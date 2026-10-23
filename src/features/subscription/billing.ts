import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesPackage,
  type SubscriptionOption,
} from 'react-native-purchases';
import { getSupabaseAnonKey, getSupabaseFunctionUrl, supabase } from '@/features/auth/supabase';
import type { PlanId, PlusAccess, PlusPlan, PlusState, PurchaseOutcome } from './types';

export const VOKA_PLUS_ENTITLEMENT = 'voka_plus';
let configuredUserId: string | undefined;
let queue: Promise<unknown> = Promise.resolve();
let changingPurchase = false;

function apiKey() {
  if (Platform.OS === 'android') return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY?.trim();
  if (Platform.OS === 'ios') return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY?.trim();
  return undefined;
}
export const isVokaPlusConfigured = Boolean(apiKey());

async function requireUser(userId: string) {
  const result = await supabase?.auth.getSession();
  const session = result?.data.session;
  if (result?.error || !session || session.user.is_anonymous || session.user.id !== userId)
    throw new Error('Sign in to your Vokeno account before continuing.');
  return session;
}

// Serialize the complete operation, not just logIn: an account switch must not
// change the SDK identity while another account's purchase sheet is open.
function serial<T>(action: () => Promise<T>): Promise<T> {
  const next = queue.then(action, action);
  queue = next.catch(() => undefined);
  return next;
}

async function configure(userId: string) {
  await requireUser(userId);
  const key = apiKey();
  if (!key || !(Platform.OS === 'android' ? key.startsWith('goog_') : key.startsWith('appl_')))
    throw new Error('Store purchases are not available in this build.');
  if (!configuredUserId) {
    await Purchases.setLogLevel(LOG_LEVEL.ERROR);
    if (await Purchases.isConfigured()) {
      configuredUserId = await Purchases.getAppUserID();
    } else {
      Purchases.configure({ apiKey: key, appUserID: userId });
      configuredUserId = userId;
    }
  }
  if (configuredUserId !== userId) {
    await Purchases.logIn(userId);
    configuredUserId = userId;
  }
  await requireUser(userId);
}

export async function fetchPlusAccess(userId: string, force = false): Promise<PlusAccess> {
  const session = await requireUser(userId);
  const url = getSupabaseFunctionUrl()?.replace(/\/realtime-session$/, '/subscription-status');
  if (!url) throw new Error('Account services are not configured.');
  const response = await fetch(url, {
    method: 'POST',
    signal: AbortSignal.timeout(15_000),
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...(getSupabaseAnonKey() ? { apikey: getSupabaseAnonKey()! } : {}),
    },
    body: JSON.stringify({ action: force ? 'sync' : 'status' }),
  });
  await requireUser(userId);
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? 'Your subscription could not be loaded.');
  if (
    !body.config ||
    typeof body.isPlus !== 'boolean' ||
    typeof body.config.salesEnabled !== 'boolean'
  )
    throw new Error('The subscription service returned an invalid response.');
  return body as PlusAccess;
}

export function subscriptionManagementUrl(store?: string | null) {
  return store === 'app_store' || (!store && Platform.OS === 'ios')
    ? 'https://apps.apple.com/account/subscriptions'
    : 'https://play.google.com/store/account/subscriptions';
}

function storeEntitled(info: CustomerInfo) {
  // Display/purchase-suppression hint only; this NEVER authorizes paid AI use.
  return Boolean(info.entitlements.active[VOKA_PLUS_ENTITLEMENT]?.isActive);
}

const PLAN = {
  monthly: { packageType: 'MONTHLY', period: 'P1M' },
  annual: { packageType: 'ANNUAL', period: 'P1Y' },
} as const;

function planProduct(access: PlusAccess, plan: PlanId) {
  if (plan === 'annual')
    return Platform.OS === 'android'
      ? access.config.androidAnnualProduct
      : access.config.iosAnnualProduct;
  return Platform.OS === 'android' ? access.config.androidProduct : access.config.iosProduct;
}

async function planPackages(access: PlusAccess) {
  const offerings = await Purchases.getOfferings();
  const find = (plan: PlanId) => {
    const expected = planProduct(access, plan);
    return expected
      ? offerings.current?.availablePackages.find(
          (item) =>
            item.packageType === PLAN[plan].packageType &&
            item.product.identifier === expected &&
            item.product.subscriptionPeriod === PLAN[plan].period,
        )
      : undefined;
  };
  return { annual: find('annual'), monthly: find('monthly') };
}

const trialLength = (option: SubscriptionOption) => {
  const period = option.freePhase?.billingPeriod;
  if (!period) return undefined;
  if (period.unit === 'DAY') return period.value;
  if (period.unit === 'WEEK') return period.value * 7;
  return undefined;
};

/**
 * The exact Android option to show and buy. A free trial is used only when it is a plain trial
 * followed by the plan's full price; Play lists only the offers this user is eligible for.
 * Discounted or prepaid offers are never chosen, so the price shown is the price renewed at.
 */
function planOption(pkg: PurchasesPackage): SubscriptionOption | undefined {
  const options = (pkg.product.subscriptionOptions ?? []).filter(
    (item) => !item.isPrepaid && item.storeProductId === pkg.product.identifier,
  );
  const base = options.find((item) => item.isBasePlan && item.fullPricePhase);
  if (!base) return undefined;
  const trial = options.find(
    (item) =>
      !item.isBasePlan &&
      !item.introPhase &&
      item.pricingPhases.length === 2 &&
      trialLength(item) !== undefined &&
      item.fullPricePhase?.price.amountMicros === base.fullPricePhase!.price.amountMicros,
  );
  return trial ?? base;
}

function describePlan(id: PlanId, pkg?: PurchasesPackage): PlusPlan | undefined {
  if (!pkg) return undefined;
  const period = id === 'annual' ? 'year' : 'month';
  if (Platform.OS !== 'android')
    return pkg.product.priceString ? { id, price: pkg.product.priceString, period } : undefined;
  const option = planOption(pkg);
  const price = option?.fullPricePhase?.price.formatted;
  if (!option || !price) return undefined;
  return {
    id,
    price,
    period,
    ...(trialLength(option) ? { trialDays: trialLength(option) } : {}),
    ...(id === 'annual' && pkg.product.pricePerMonthString
      ? { perMonth: pkg.product.pricePerMonthString }
      : {}),
  };
}

/** Annual against twelve monthly payments, from the store's own prices in the same currency. */
function savePercent(annual?: PurchasesPackage, monthly?: PurchasesPackage) {
  const year = annual && planOption(annual)?.fullPricePhase?.price;
  const month = monthly && planOption(monthly)?.fullPricePhase?.price;
  if (!year || !month || year.currencyCode !== month.currencyCode || !month.amountMicros)
    return undefined;
  const percent = Math.floor((1 - year.amountMicros / (month.amountMicros * 12)) * 100);
  return percent >= 10 ? percent : undefined;
}

export function storePlans(packages: { annual?: PurchasesPackage; monthly?: PurchasesPackage }) {
  const annual = describePlan('annual', packages.annual);
  const monthly = describePlan('monthly', packages.monthly);
  const save =
    Platform.OS === 'android' ? savePercent(packages.annual, packages.monthly) : undefined;
  return [
    ...(annual ? [{ ...annual, ...(save ? { savePercent: save } : {}) }] : []),
    ...(monthly ? [monthly] : []),
  ];
}

export function loadVokaPlus(userId: string): Promise<PlusState> {
  return serial(async () => {
    const access = await fetchPlusAccess(userId);
    const state: PlusState = {
      ...access,
      plans: [],
      canPurchase: false,
      canRestore: false,
      storeEntitled: false,
      managementUrl: subscriptionManagementUrl(access.store),
    };
    if (!access.config.enabled || !apiKey()) return state;
    try {
      await configure(userId);
      state.canRestore = true;
      const info = await Purchases.getCustomerInfo();
      state.storeEntitled = storeEntitled(info);
      if (!access.isPlus && !state.storeEntitled && access.config.salesEnabled) {
        state.plans = storePlans(await planPackages(access));
        state.canPurchase = state.plans.length > 0;
        if (!state.canPurchase)
          state.storeError =
            'This plan is not available from your store yet. Please try again later.';
      }
    } catch {
      state.storeError = 'The store could not be reached. Check your connection and try again.';
    }
    await requireUser(userId);
    return state;
  });
}

async function confirm(userId: string): Promise<PurchaseOutcome> {
  try {
    return (await fetchPlusAccess(userId, true)).isPlus ? 'active' : 'confirming';
  } catch {
    await requireUser(userId);
    return 'confirming';
  }
}

function changePurchase(userId: string, action: () => Promise<PurchaseOutcome>) {
  if (changingPurchase)
    return Promise.reject(new Error('A purchase or restore is already in progress.'));
  changingPurchase = true;
  return serial(async () => {
    await requireUser(userId);
    return action();
  }).finally(() => {
    changingPurchase = false;
  });
}

export function purchaseVokaPlus(userId: string, plan: PlanId): Promise<PurchaseOutcome> {
  return changePurchase(userId, async () => {
    const access = await fetchPlusAccess(userId);
    if (access.isPlus) return 'active';
    if (!access.config.enabled || !access.config.salesEnabled)
      throw new Error('Vokeno Plus is not open for new subscriptions yet.');
    await configure(userId);
    if (storeEntitled(await Purchases.getCustomerInfo())) return confirm(userId);
    const pkg = (await planPackages(access))[plan];
    if (!pkg || !describePlan(plan, pkg))
      throw new Error(`The ${plan} plan is unavailable. Please try again later.`);
    await requireUser(userId);
    try {
      // Buy exactly the option that was shown: its trial, price and period.
      if (Platform.OS === 'android') await Purchases.purchaseSubscriptionOption(planOption(pkg)!);
      else await Purchases.purchasePackage(pkg);
    } catch (reason) {
      const error = reason as { code?: string; userCancelled?: boolean } | undefined;
      if (error?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR || error?.userCancelled)
        return 'cancelled';
      if (error?.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) return 'pending';
      throw new Error(
        'The purchase could not be completed. Check your store account or try Restore purchases if you were charged.',
      );
    }
    await requireUser(userId);
    return confirm(userId);
  });
}

export function restoreVokaPlus(userId: string): Promise<PurchaseOutcome> {
  return changePurchase(userId, async () => {
    const access = await fetchPlusAccess(userId);
    if (!access.config.enabled) throw new Error('Subscriptions are not available yet.');
    await configure(userId);
    const info = await Purchases.restorePurchases();
    await requireUser(userId);
    const confirmed = await confirm(userId);
    if (confirmed === 'active') return confirmed;
    return storeEntitled(info) ? 'confirming' : 'not-found';
  });
}
