import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import PlusScreen from '@/app/plus';
import type { PlusState, PurchaseOutcome } from '@/features/subscription/types';
jest.mock('@/global.css', () => ({}));

const mockRouter = { replace: jest.fn(), push: jest.fn() };
let mockUser = { id: 'account-a', is_anonymous: false };
const mockLoad = jest.fn<() => Promise<PlusState>>();
const mockPurchase = jest.fn<(plan?: string) => Promise<PurchaseOutcome>>();
const mockRestore = jest.fn<() => Promise<PurchaseOutcome>>();
const mockRefresh = jest.fn<() => Promise<PlusState>>();
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useFocusEffect: (fn: () => void) =>
    jest.requireActual<typeof import('react')>('react').useEffect(fn, [fn]),
}));
jest.mock('expo-linking', () => ({ openURL: jest.fn() }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: () => null }));
jest.mock('@/features/auth/use-auth-session', () => ({
  useAuthSession: () => ({ loading: false, session: { user: mockUser } }),
}));
jest.mock('@/components/voka-ui', () => {
  const { Text, View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    AppScreen: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    Eyebrow: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
    HeaderBack: () => null,
  };
});
jest.mock('@/features/subscription/billing', () => ({
  loadVokaPlus: (...args: []) => mockLoad(...args),
  purchaseVokaPlus: (_user: string, plan: string) => mockPurchase(plan),
  restoreVokaPlus: () => mockRestore(),
  fetchPlusAccess: () => mockRefresh(),
  subscriptionManagementUrl: () => 'https://play.google.com/store/account/subscriptions',
}));
const state: PlusState = {
  config: {
    enabled: true,
    salesEnabled: true,
    environment: 'PRODUCTION',
    androidProduct: 'voka_plus:monthly',
    iosProduct: '',
    androidAnnualProduct: 'voka_plus:annual',
    iosAnnualProduct: '',
    voiceDaily: 15,
    assessmentDaily: 25,
  },
  isPlus: false,
  expiresAt: null,
  store: null,
  willRenew: true,
  billingIssue: false,
  fresh: true,
  voiceRemaining: 15,
  assessmentRemaining: 25,
  resetsAt: '',
  canPurchase: true,
  canRestore: true,
  storeEntitled: false,
  plans: [
    {
      id: 'annual',
      price: 'Rs 5,999',
      period: 'year',
      perMonth: 'Rs 499.92',
      trialDays: 7,
      savePercent: 49,
    },
    { id: 'monthly', price: 'Rs 999', period: 'month' },
  ],
  managementUrl: 'https://play.google.com/store/account/subscriptions',
};
beforeEach(() => {
  jest.clearAllMocks();
  // Vokeno ships on Android first; its store wording is what learners see.
  jest.requireActual<typeof import('react-native')>('react-native').Platform.OS = 'android';
  mockUser = { id: 'account-a', is_anonymous: false };
  mockLoad.mockResolvedValue(state);
  mockRefresh.mockResolvedValue(state);
  mockPurchase.mockResolvedValue('cancelled');
  mockRestore.mockResolvedValue('not-found');
});
describe('subscription screen feedback', () => {
  it('shows price, renewal period and a finite daily allowance before purchase', async () => {
    const screen = await render(<PlusScreen />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Start 7-day free trial' })).toBeEnabled(),
    );
    // The trial terms sit next to the button: length, price after, renewal and how to cancel.
    expect(
      screen.getByText(
        'Free for 7 days, then Rs 5,999 a year. Renews automatically every year until you cancel in Google Play › Payments and subscriptions. Cancel before the trial ends and you will not be charged.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Save 49%')).toBeTruthy();
    expect(screen.getByText('Rs 499.92 a month, billed yearly')).toBeTruthy();
    expect(screen.getByText('15 live practice calls a day, up to 5 minutes each')).toBeTruthy();
    expect(screen.queryByText(/Unlimited|unlimited/)).toBeNull();
    expect(screen.queryByText(/US\$1/)).toBeNull();
  });
  it('switches plans and buys the one shown', async () => {
    mockPurchase.mockResolvedValue('cancelled');
    const screen = await render(<PlusScreen />);
    await waitFor(() => expect(screen.getByText('Start 7-day free trial')).toBeTruthy());
    await fireEvent.press(screen.getByRole('radio', { name: /Monthly/ }));
    expect(screen.getByRole('button', { name: 'Subscribe · Rs 999/month' })).toBeEnabled();
    expect(
      screen.getByText(
        'Rs 999 a month, charged to your Google Play account when you confirm. Renews automatically every month until you cancel in Google Play › Payments and subscriptions.',
      ),
    ).toBeTruthy();
    await fireEvent.press(screen.getByText('Subscribe · Rs 999/month'));
    await waitFor(() => expect(mockPurchase).toHaveBeenCalledWith('monthly'));
  });
  it('shows honest coming-soon feedback with checkout disabled before launch', async () => {
    mockLoad.mockResolvedValue({
      ...state,
      config: { ...state.config, enabled: false, salesEnabled: false },
      canPurchase: false,
      canRestore: false,
      plans: [],
    });
    const screen = await render(<PlusScreen />);
    await waitFor(() => expect(screen.getByText('Coming soon')).toBeTruthy());
    expect(screen.getByRole('button', { name: 'Not available yet' })).toBeDisabled();
    expect(screen.queryByText('Restore purchases')).toBeNull();
  });
  it('shows pending payment without a success claim or another purchase button', async () => {
    mockPurchase.mockResolvedValue('pending');
    const screen = await render(<PlusScreen />);
    await waitFor(() => expect(screen.getByText('Start 7-day free trial')).toBeTruthy());
    await fireEvent.press(screen.getByText('Start 7-day free trial'));
    await waitFor(() => expect(screen.getByText(/waiting for payment approval/)).toBeTruthy());
    expect(screen.queryByText('You’re on Plus.')).toBeNull();
    expect(screen.queryByText('Start 7-day free trial')).toBeNull();
    expect(screen.getByText('Refresh status')).toBeTruthy();
  });
  it('reports cancellation and empty restore outcomes explicitly', async () => {
    const screen = await render(<PlusScreen />);
    await waitFor(() => expect(screen.getByText('Start 7-day free trial')).toBeTruthy());
    await fireEvent.press(screen.getByText('Start 7-day free trial'));
    await waitFor(() => expect(screen.getByText(/Purchase cancelled/)).toBeTruthy());
    await fireEvent.press(screen.getByText('Restore purchases'));
    await waitFor(() => expect(screen.getByText(/No active subscription was found/)).toBeTruthy());
  });
  it('redirects guests and never loads their store identity', async () => {
    mockUser.is_anonymous = true;
    await render(<PlusScreen />);
    expect(mockRouter.replace).toHaveBeenCalledWith('/auth?mode=sign-up');
    expect(mockLoad).not.toHaveBeenCalled();
  });
  it('clears a previous account entitlement before another account finishes loading', async () => {
    mockLoad.mockResolvedValue({ ...state, isPlus: true, expiresAt: '2026-10-24T12:00:00Z' });
    const screen = await render(<PlusScreen />);
    await waitFor(() => expect(screen.getByText('You’re on Plus.')).toBeTruthy());
    mockUser = { id: 'account-b', is_anonymous: false };
    let finish!: (next: PlusState) => void;
    mockLoad.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    await screen.rerender(<PlusScreen />);
    expect(screen.queryByText('You’re on Plus.')).toBeNull();
    await act(async () => finish(state));
    expect(screen.getByText('Start 7-day free trial')).toBeTruthy();
  });
});
