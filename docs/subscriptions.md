# Subscription implementation and setup

Status: code implemented and deployed to the Vokeno preview backend on 24 September
2026, with **billing and sales disabled**. The Android client is published to the
preview OTA channel. No real purchase can be verified until store setup is complete.
Local test prices and limits are synthetic fixtures, not an approved Vokeno offer.
See [preview release verification](subscription-preview-release.md).

## Implemented behavior

- An authenticated Plus screen offers the configured **annual** and **monthly**
  plans (annual first), with store-localized prices and the server-configured finite
  daily allowance. Guests are directed to account creation.
- Every price, per-month figure, saving and trial comes from the store. The saving
  is computed from the two plans' store prices in the same currency, rounded down,
  and shown only at 10% or more. Nothing on the paywall is a hard-coded price.
- Android buys exactly the option shown: the base plan, or a free-trial offer when
  Play lists one for this user (Play returns only offers the user is eligible for).
  A trial is used only when it is a plain free trial followed by the base plan's
  full price, so the price shown is the price renewed at. Discounted, introductory
  and prepaid offers are never chosen. Lifetime plans are not supported.
- Google Play subscription policy: the trial length, the price after it, the
  billing period, automatic renewal and where to cancel are shown next to the
  purchase button, before checkout (`planTerms` in `src/app/plus.tsx`). Benefits
  are finite and match the server allowance; the app never says "unlimited".
- Purchase/restore operations and SDK identity changes are serialized. Duplicate
  actions are blocked and authentication is checked again after asynchronous work.
- Cancellation, pending payment, unconfirmed purchase, empty restore, expired
  access and store/network failures have distinct feedback. Pending confirmation
  refreshes automatically for a bounded time and always offers manual refresh.
- The app never grants paid AI access from a local `isPlus` flag. Backend REST v1
  lookup verifies `voka_plus`, product, store, environment, expiry, refund status
  and the authenticated Vokeno user ID.
- Backend state is cached for at most five minutes, bounded by the subscription
  expiry. App refresh, purchase/restore and authenticated webhook notifications
  reconcile canonical state. Provider failures do not overwrite valid state.
  Free practice remains available under its existing limits; stale paid state
  cannot grant extra requests. Provider notification delays may add latency.
- Cancellation retains access until expiry. Explicit provider grace dates are
  honored; refunds, revoked/expired entitlements and invalid products do not
  qualify. Webhook arrival order does not overwrite a newer canonical snapshot.
- Request usage is atomic and server-only. Restores, renewals, repeated webhooks
  and account switches never refill a day's usage. UTC midnight resets the daily
  allowance, separately from the monthly billing period. Paid limits are total
  daily limits, not additional credits on top of free usage. Request attempts
  count once admitted for processing, even if a downstream call fails.
- Existing five-minute voice leases, cleanup heartbeat and global request caps
  remain enforced. These caps are not a currency spending guarantee.
- Safe store-management links remain available even without new sales. No
  arbitrary URL supplied by an event or customer is opened.

## Owner-controlled setup

1. Complete the Play developer/payments profile and RevenueCat project. Approve
   the price and daily limits before creating a live offer. The former Rs 200 and
   unlimited promises have been removed, not replaced with an assumed price.
2. Upload a billing-enabled Android build for `com.asjadali.voka` to the appropriate
   Play test track. In Play Console › Monetize › Subscriptions, create subscription
   `voka_plus` with two auto-renewing base plans:
   - `monthly`: billing period 1 month, US$9.99;
   - `annual`: billing period 1 year, US$59.99, with one offer `trial-7d`: a 7-day
     free trial, eligibility "New customer acquisition: never had this subscription".
     Set the regional prices by hand rather than accepting Play's conversion: Pakistan
     PKR 999 / PKR 5,999 and India INR 299 / INR 1,799 (the business model plan's
     proposal). Turn on grace period and account hold. Connect the Play app/service
     credentials and real-time developer notifications to RevenueCat, following its
     current store-integration instructions.
3. Create entitlement `voka_plus` and attach both products. In the current
   offering, put `voka_plus:monthly` in the Monthly package and `voka_plus:annual`
   in the Annual package. Configure the actual identifiers in the backend.
4. Set RevenueCat restore behavior to **Keep with original App User ID**. This
   implementation uses authenticated Supabase UUIDs only, never anonymous SDK
   identities. Restores require the original Vokeno account. Automatic transfers
   or sharing across Vokeno accounts are not supported. Do not change that policy
   without implementing and testing an explicit ownership-transfer flow.
5. Add only public `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` / iOS SDK keys to the
   corresponding EAS environment. Production keys use the actual store app, not
   a RevenueCat Test Store. Test Store receipts cannot grant paid AI access.
6. Store these values in **Supabase Edge Function secrets**, not Git, public
   environment variables, command-line arguments or chat:
   - `REVENUECAT_SECRET_API_KEY`: project REST v1 secret API key.
   - `REVENUECAT_WEBHOOK_AUTH`: a strong random full Authorization-header value
     of at least 32 characters, configured identically in RevenueCat.
   - `REVENUECAT_WEBHOOK_SIGNING_SECRET`: integration HMAC signing secret.
7. Register webhook URL
   `https://<project>.supabase.co/functions/v1/revenuecat-webhook`. Enable HMAC
   signing. Supabase JWT verification is intentionally off only for this webhook;
   the function requires both its own Authorization header and a valid raw-body
   signature with a five-minute delivery timestamp tolerance. Failed processing
   returns a retryable status. Never disable these checks to make a test pass.

Use a separate staging Supabase project and store license testers for sandbox
purchases. Set its configuration environment to `SANDBOX`. Production uses
`PRODUCTION` and rejects sandbox receipts. Do not turn the production database
into a sandbox to test purchases.

## Deploy and configure, with sales still disabled

After reviewing the target project and migrations:

```bash
npx supabase db push
npx supabase functions deploy subscription-status revenuecat-webhook realtime-session
```

Migration `20261024000000_plus_annual.sql` adds the annual product columns (empty,
so nothing changes until they are set) and `voka_plus_product`, which both the access
check and the daily quota use. Migration `20260924000000_subscriptions.sql` starts with `enabled = false`,
`sales_enabled = false`, empty product IDs and zero paid allowances. Database
access is restricted to the service role; do not grant clients write privileges.

The owner-approved configuration belongs in the singleton row of
`public.voka_subscription_config`:

| Field                    | Meaning                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| `enabled`                | Enables verified subscription access. Keep false until setup is valid. |
| `sales_enabled`          | Allows new checkout independently of existing subscribers.             |
| `environment`            | `PRODUCTION` or staging-only `SANDBOX`.                                |
| `android_product`        | Exact RevenueCat monthly subscription/base-plan ID.                    |
| `ios_product`            | Exact monthly iOS product, or empty if not launching iOS.              |
| `android_annual_product` | Exact annual base-plan ID, or empty to sell monthly only.              |
| `ios_annual_product`     | Exact annual iOS product, or empty.                                    |
| `voice_daily`            | Approved total daily session-start allowance.                          |
| `assessment_daily`       | Approved total daily assessment-request allowance.                     |

Recommended values when sales open, from the business model plan. Today signed-in
free learners get 10 voice session starts a day (`voka_ai_budget_config`), which
is kept during the free beta. At launch:

| Setting                                       | Value | Meaning                                                                      |
| --------------------------------------------- | ----- | ---------------------------------------------------------------------------- |
| `voka_ai_budget_config` voice `account_daily` | 2     | Free: a unit call and one practice call                                      |
| `voice_daily`                                 | 6     | Plus: up to 30 minutes of calls a day                                        |
| `assessment_daily`                            | 30    | Plus: spoken assessments and call reviews                                    |
| voice `global_daily`                          | raise | Must be at least `voice_daily` and sized for the expected number of learners |

Voice is the only cost that grows with use. On `gpt-realtime-2.1` (about US$0.08 a
minute) a Plus learner who uses all 6 calls every day costs about US$72 a month;
a typical learner uses about 50 minutes a month (about US$4). Watch the share of
heavy users before raising the limit, as the business model plan's risks section
describes, and lower `voice_daily` for everyone rather than per country.

Paid limits should exceed free allowances and fit the separately reviewed global
caps in `voka_ai_budget_config`. New sales are suppressed if voice limits do not
exceed free limits, assessment limits are lower than free limits, global caps are
too small, or webhook credentials are missing. This is a safety check, not proof
of provider readiness, verified webhooks or commercial viability.

Keep the quota/model cost budget under operational review. Before changing a
live plan's benefits, product identifiers or price, review existing subscribers,
store requirements and customer communication. Do not shrink an advertised paid
allowance silently.

## Verification

```bash
npm run typecheck
npm run lint
npm run test:ci
bash scripts/test-subscriptions-db.sh
```

The database script creates an isolated synthetic PostgreSQL 16 cluster under
`/tmp`, never connects to a production database, and stops the cluster on exit.
Set `VOKA_TEST_PG_BIN` if PostgreSQL binaries are installed elsewhere.

Local verification on 24 September 2026: 113 unit tests and all 68 mobile-sized
browser checks passed, along with isolated database permission, expiry, replay
and concurrent paid-quota checks. TypeScript, lint, formatting, frozen Deno checks,
Expo Doctor (21 checks) and the production npm dependency audit also passed.
These are synthetic tests, not real store purchase verification.

Before enabling production sales, verify on a physical device using the store
test track: purchase, pending approval, cancellation, renewal, payment failure,
grace, expiry, refund/revocation, restore/reinstall, original-account ownership,
account switching during checkout, background/return, duplicate webhooks,
provider outages and quota exhaustion. Confirm a real provider response matches
the configured Android base-plan identifier. Test public Terms/Privacy URLs,
support contact and refund-support procedure. Store approval and owner business
verification are separate from code completion.

## Operational controls

- Set `sales_enabled = false` to stop new checkout while honoring existing paid
  access. Do not use `enabled = false` as the normal sales pause.
- If webhook delivery fails, inspect provider delivery status without logging
  bodies, tokens or credentials. Canonical reads on app/AI use provide recovery.
- Five-minute entitlement freshness and ten-second per-user reconciliation
  throttling bound stale state and lookup load. Retry failed webhook deliveries;
  do not acknowledge skipped work as successfully synchronized.
- Account deletion cascades the Vokeno entitlement row. It does not cancel the
  external store subscription. The account-deletion warning explains continued
  billing and that purchases cannot be restored to a newly created Vokeno account;
  provider financial records and their retention remain separate.
- The test suite does not replace an actual store receipt, store review or
  production monitoring. Do not advertise subscriptions as live until those pass.

Primary integration references:
[RevenueCat customer API](https://www.revenuecat.com/docs/api-v1/customers),
[webhook authentication and delivery](https://www.revenuecat.com/docs/integrations/webhooks),
[Google Play product IDs](https://www.revenuecat.com/docs/getting-started/entitlements/android-products),
[customer identity](https://www.revenuecat.com/docs/customers/identifying-customers).
