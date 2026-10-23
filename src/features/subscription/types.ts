export type PlusAccess = {
  config: {
    enabled: boolean;
    salesEnabled: boolean;
    environment: 'PRODUCTION' | 'SANDBOX';
    androidProduct: string;
    iosProduct: string;
    androidAnnualProduct: string;
    iosAnnualProduct: string;
    voiceDaily: number;
    assessmentDaily: number;
  };
  isPlus: boolean;
  expiresAt: string | null;
  store: string | null;
  willRenew: boolean;
  billingIssue: boolean;
  fresh: boolean;
  voiceRemaining: number;
  assessmentRemaining: number;
  resetsAt: string;
};

/** A plan as the store sells it to this user. Every price and trial comes from the store. */
export type PlusPlan = {
  id: PlanId;
  /** The full renewal price for one period, formatted by the store. */
  price: string;
  period: 'month' | 'year';
  /** Annual only: the same price spread over twelve months. */
  perMonth?: string;
  /** Only when the store offers this user a free trial on this plan. */
  trialDays?: number;
  /** Annual only: the saving against twelve monthly payments, rounded down. */
  savePercent?: number;
};
export type PlanId = 'annual' | 'monthly';

export type PlusState = PlusAccess & {
  plans: PlusPlan[];
  canPurchase: boolean;
  canRestore: boolean;
  storeEntitled: boolean;
  managementUrl: string;
  storeError?: string;
};

export type PurchaseOutcome = 'active' | 'cancelled' | 'pending' | 'confirming' | 'not-found';
