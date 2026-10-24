import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/lesson-ui';
import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import {
  Brand,
  Dark,
  FontSize,
  LineHeight,
  OnDark,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
import { useAuthSession } from '@/features/auth/use-auth-session';
import {
  fetchPlusAccess,
  loadVokaPlus,
  purchaseVokaPlus,
  restoreVokaPlus,
  subscriptionManagementUrl,
} from '@/features/subscription/billing';
import type { PlanId, PlusPlan, PlusState, PurchaseOutcome } from '@/features/subscription/types';
import { SpeakGlyph } from '@/components/voice-line';

/** What the learner agrees to, next to the button that agrees to it. */
function planTerms(plan: PlusPlan) {
  const apple = Platform.OS === 'ios';
  const account = apple ? 'Apple account' : 'Google Play account';
  const cancel = apple
    ? 'Settings › your name › Subscriptions'
    : 'Google Play › Payments and subscriptions';
  const renews = `Renews automatically every ${plan.period} until you cancel in ${cancel}.`;
  return plan.trialDays
    ? `Free for ${plan.trialDays} days, then ${plan.price} a ${plan.period}. ${renews} Cancel before the trial ends and you will not be charged.`
    : `${plan.price} a ${plan.period}, charged to your ${account} when you confirm. ${renews}`;
}

export default function PlusScreen() {
  const { session } = useAuthSession();
  return <PlusContent key={session?.user.id ?? 'signed-out'} />;
}

function PlusContent() {
  const router = useRouter();
  const { loading: authLoading, session } = useAuthSession();
  const userId = session && !session.user.is_anonymous ? session.user.id : undefined;
  const [state, setState] = useState<PlusState>();
  const [pending, setPending] = useState<'load' | 'purchase' | 'restore' | 'manage' | null>('load');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [checkedAt, setCheckedAt] = useState(() => Date.now());
  const [planId, setPlanId] = useState<PlanId>();
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (action: 'load' | 'purchase' | 'restore', force = false, plan?: PlanId) => {
      if (!userId || busy.current) return;
      busy.current = true;
      setPending(action);
      setError('');
      const current = () => mounted.current;
      try {
        let outcome: PurchaseOutcome | undefined;
        if (action === 'purchase' && plan) outcome = await purchaseVokaPlus(userId, plan);
        if (action === 'restore') outcome = await restoreVokaPlus(userId);
        if (action === 'load' && force) await fetchPlusAccess(userId, true);
        if (!current()) return;
        if (outcome) {
          const messages: Record<PurchaseOutcome, string> = {
            active:
              action === 'restore'
                ? 'Your Vokeno Plus subscription is restored.'
                : 'Vokeno Plus is active. Your allowance is ready.',
            cancelled: 'Purchase cancelled. No subscription was started.',
            pending:
              'Your store is waiting for payment approval. Plus will activate after payment is confirmed. Do not purchase again.',
            confirming:
              'Your purchase is being confirmed. You do not need to pay again. We will check automatically, or you can tap Refresh status.',
            'not-found':
              'No active subscription was found. Check that you are using the original Vokeno and store accounts.',
          };
          setNotice(messages[outcome]);
          setConfirming(outcome === 'pending' || outcome === 'confirming');
        }
        const next = await loadVokaPlus(userId);
        if (!current()) return;
        setState(next);
        setCheckedAt(Date.now());
        if (next.isPlus) {
          setConfirming(false);
          if (force) setNotice('Your subscription is active and up to date.');
        } else if (next.storeEntitled) setConfirming(true);
      } catch (reason) {
        if (current()) setError(reason instanceof Error ? reason.message : 'Please try again.');
      } finally {
        busy.current = false;
        if (current()) setPending(null);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (!authLoading && !userId) {
      router.replace('/auth?mode=sign-up');
      return;
    }
  }, [authLoading, router, userId]);

  useFocusEffect(
    useCallback(() => {
      void run('load');
    }, [run]),
  );
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (value) => {
      if (value === 'active') void run('load');
    });
    return () => subscription.remove();
  }, [run]);
  useEffect(() => {
    if (!confirming) return;
    let attempts = 0;
    const timer = setInterval(() => {
      if (++attempts > 6) {
        clearInterval(timer);
        return;
      }
      if (AppState.currentState === 'active') void run('load', true);
    }, 12_000);
    return () => clearInterval(timer);
  }, [confirming, run]);

  const manage = async () => {
    if (busy.current) return;
    busy.current = true;
    setPending('manage');
    try {
      await Linking.openURL(state?.managementUrl ?? subscriptionManagementUrl());
    } catch {
      if (mounted.current)
        setError(
          'Open your store app and go to Payments and subscriptions to manage or cancel Vokeno Plus.',
        );
    } finally {
      busy.current = false;
      if (mounted.current) setPending(null);
    }
  };
  const date = state?.expiresAt ? new Date(state.expiresAt).toLocaleDateString() : undefined;
  const unavailable = !state?.config.enabled || !state.config.salesEnabled;
  const canPurchase = state?.canPurchase && !confirming && !state.isPlus && !pending && !error;
  const showManage = state?.isPlus || confirming || state?.storeEntitled;
  // Annual comes first when the store sells it; the learner can switch before paying.
  const chosen = state?.plans.find((plan) => plan.id === planId) ?? state?.plans[0];

  return (
    <AppScreen backgroundColor={Palette.ink} dark showNav={false}>
      <View style={styles.header}>
        <HeaderBack dark />
        <Text style={styles.logo}>VOKENO PLUS</Text>
        <View style={styles.spacer} />
      </View>
      <View style={[styles.body, state?.isPlus && styles.activeBody]}>
        <View style={[styles.icon, state?.isPlus && styles.activeIcon]}>
          <SpeakGlyph color={Palette.ink} size={32} />
        </View>
        <Eyebrow color={Brand.onDark}>
          {state?.isPlus
            ? 'Active subscription'
            : state && unavailable
              ? 'Coming soon'
              : 'Vokeno Plus'}
        </Eyebrow>
        <Text style={styles.title}>
          {state?.isPlus ? 'You’re on Plus.' : 'Make speaking a daily habit.'}
        </Text>
        <Text style={styles.copy}>
          {state?.isPlus
            ? `${state.willRenew ? 'Renews' : 'Access until'} ${date}. Manage or cancel in your store settings.`
            : unavailable
              ? 'Subscriptions are not open yet. Keep learning with the free lessons and your current practice allowance.'
              : 'Lessons stay free. Plus adds more speaking practice with your coach. Choose monthly or annual; your store confirms the price before you pay, and you can cancel anytime.'}
        </Text>
        {state && !state.isPlus && date && new Date(state.expiresAt!).getTime() <= checkedAt ? (
          <Text style={styles.notice}>
            Your previous Plus access ended on {date}. Free lessons remain available.
          </Text>
        ) : null}
        {state?.config.environment === 'SANDBOX' ? (
          <Text style={styles.notice}>
            Test purchases only. This is not a live subscription offer.
          </Text>
        ) : null}
        {state?.billingIssue && state.isPlus ? (
          <Text style={styles.notice}>
            Your store reported a payment issue. Update your payment method to keep access after the
            grace period.
          </Text>
        ) : null}
        {state?.isPlus ? (
          <Text style={styles.notice}>
            Today: {state.voiceRemaining} practice calls and {state.assessmentRemaining} spoken
            assessments remaining.
          </Text>
        ) : null}
        {notice || (confirming && !state?.isPlus) ? (
          <Text accessibilityLiveRegion="polite" style={styles.notice}>
            {notice ||
              'The store reports an active purchase. We are confirming access with Vokeno. Do not purchase again.'}
          </Text>
        ) : null}
        {error || state?.storeError ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {error || state?.storeError}
          </Text>
        ) : null}
        {showManage ? (
          <View style={styles.primaryWrap}>
            <PrimaryButton
              title="Manage subscription"
              accessibilityRole="link"
              disabled={Boolean(pending)}
              onPress={() => void manage()}
            />
          </View>
        ) : null}
        <View style={styles.benefits}>
          {(state?.config.enabled
            ? [
                'Repeat any unit call with your coach',
                `${state.config.voiceDaily} live practice calls a day, up to 5 minutes each`,
                `${state.config.assessmentDaily} spoken assessments a day`,
                'Daily allowances reset at midnight UTC',
              ]
            : [
                'English, German and Spanish learning',
                'Your learning progress stays with your account',
              ]
          ).map((benefit) => (
            <View key={benefit} style={styles.benefit}>
              <MaterialCommunityIcons color={Brand.onDark} name="check-circle" size={21} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
        {pending && !state ? (
          <ActivityIndicator color={Brand.onDark} style={styles.loader} />
        ) : null}
        {!showManage && state?.plans.length ? (
          <View accessibilityRole="radiogroup" style={styles.plans}>
            {state.plans.map((plan) => {
              const selected = plan.id === chosen?.id;
              return (
                <Pressable
                  key={plan.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected, disabled: Boolean(pending) }}
                  disabled={Boolean(pending)}
                  onPress={() => setPlanId(plan.id)}
                  style={[styles.plan, selected && styles.planSelected]}
                >
                  <View style={styles.planTop}>
                    <Text style={styles.planName}>
                      {plan.id === 'annual' ? 'Annual' : 'Monthly'}
                    </Text>
                    {plan.savePercent ? (
                      <Text style={styles.badge}>Save {plan.savePercent}%</Text>
                    ) : null}
                  </View>
                  <Text style={styles.planPrice}>
                    {plan.price} a {plan.period}
                  </Text>
                  {plan.perMonth ? (
                    <Text style={styles.planMeta}>{plan.perMonth} a month, billed yearly</Text>
                  ) : null}
                  {plan.trialDays ? (
                    <Text style={styles.planMeta}>{plan.trialDays}-day free trial</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}
        {!showManage ? (
          <View style={styles.primaryWrap}>
            <PrimaryButton
              title={
                pending === 'purchase'
                  ? 'Opening checkout…'
                  : pending === 'load'
                    ? 'Checking…'
                    : chosen?.trialDays
                      ? `Start ${chosen.trialDays}-day free trial`
                      : chosen
                        ? `Subscribe · ${chosen.price}/${chosen.period}`
                        : 'Not available yet'
              }
              icon={chosen && !pending ? 'arrow-right' : undefined}
              busy={pending === 'purchase'}
              disabled={!canPurchase || !chosen}
              onPress={() => void run('purchase', false, chosen?.id)}
            />
            {chosen ? <Text style={styles.priceNote}>{planTerms(chosen)}</Text> : null}
          </View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: Boolean(pending) }}
          disabled={Boolean(pending)}
          onPress={() => void run('load', Boolean(state?.config.enabled))}
        >
          <Text style={styles.restore}>
            {pending === 'load' ? 'Checking status...' : 'Refresh status'}
          </Text>
        </Pressable>
        {state?.canRestore ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: Boolean(pending) }}
            disabled={Boolean(pending)}
            onPress={() => void run('restore')}
          >
            <Text style={styles.restore}>
              {pending === 'restore' ? 'Restoring purchases...' : 'Restore purchases'}
            </Text>
          </Pressable>
        ) : null}
        {!state?.isPlus && !confirming ? (
          <Pressable
            accessibilityRole="link"
            disabled={Boolean(pending)}
            onPress={() => void manage()}
          >
            <Text style={styles.restore}>Manage store subscriptions</Text>
          </Pressable>
        ) : null}
        {state?.config.enabled ? (
          <Text style={styles.copy}>
            Lessons and learning history stay free. AI requests count when processing starts; daily
            allowances do not roll over. Service safety limits may temporarily affect availability.
          </Text>
        ) : null}
        {state?.config.enabled ? (
          <Text style={styles.terms}>
            Payment is charged to your store account. Subscriptions renew automatically unless
            cancelled before the current period ends. Cancelling stops future renewals, not access
            for the period already paid. Deleting Vokeno does not cancel your subscription.
          </Text>
        ) : null}
        <View style={styles.legalLinks}>
          <Pressable
            accessibilityRole="link"
            style={styles.legalTarget}
            onPress={() => router.push('/legal/terms' as Href)}
          >
            <Text style={styles.legalText}>Terms</Text>
          </Pressable>
          <Pressable
            accessibilityRole="link"
            style={styles.legalTarget}
            onPress={() => router.push('/legal/privacy' as Href)}
          >
            <Text style={styles.legalText}>Privacy</Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: space(4),
  },
  logo: {
    color: Palette.cream,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.heading,
  },
  spacer: { width: 40 },
  body: { padding: space(6), paddingTop: space(8) },
  activeBody: { paddingTop: space(5) },
  activeIcon: { width: 48, height: 48, marginBottom: space(4) },
  icon: {
    alignItems: 'center',
    backgroundColor: Brand.onDark,
    borderRadius: Radius.xl,
    height: 64,
    justifyContent: 'center',
    marginBottom: space(6),
    width: 64,
  },
  title: {
    color: Palette.cream,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    marginTop: space(2),
  },
  copy: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(3),
  },
  benefits: { gap: space(4), marginTop: space(7) },
  benefit: { alignItems: 'center', flexDirection: 'row', gap: space(3) },
  benefitText: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
    flex: 1,
    lineHeight: LineHeight.body,
  },
  notice: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(5),
  },
  loader: { marginTop: space(7) },
  error: {
    color: Dark.errorText,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(6),
  },
  terms: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    gap: space(6),
    justifyContent: 'center',
    marginTop: space(3),
  },
  legalTarget: { minHeight: 44, minWidth: 64, justifyContent: 'center', alignItems: 'center' },
  legalText: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
    textDecorationLine: 'underline',
  },
  primaryWrap: { alignSelf: 'stretch', gap: space(2), marginTop: space(7) },
  plans: { gap: space(3), marginTop: space(7) },
  plan: {
    borderColor: OnDark.border,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    gap: space(1),
    padding: space(4),
  },
  planSelected: { backgroundColor: OnDark.fill, borderColor: Brand.onDark },
  planTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  planName: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  planPrice: { color: Palette.cream, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.body },
  planMeta: { color: OnDark.textSecondary, fontFamily: VokaFonts.body, fontSize: FontSize.label },
  badge: {
    backgroundColor: Brand.onDark,
    borderRadius: Radius.pill,
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.caption,
    overflow: 'hidden',
    paddingHorizontal: space(2),
    paddingVertical: space(1),
  },
  priceNote: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    textAlign: 'center',
  },
  restore: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.label,
    paddingVertical: space(4),
    textAlign: 'center',
  },
});
