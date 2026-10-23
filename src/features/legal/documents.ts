// Single source for the in-app legal screens and the public web pages
// (scripts/build-legal-pages.mjs). Keep this file free of imports so Node can read it directly.
export const SUPPORT_EMAIL = 'support@vokeno.com';

export const documents = {
  privacy: {
    intro: 'Effective 23 October 2026',
    sections: [
      [
        'What Vokeno processes',
        'Account details, learning progress, preferences, assessment results, and live-session transcripts needed to provide the service.',
      ],
      [
        'Practice history and reminders',
        'We keep a short record of which days you practised and what you did (for example a lesson or a review) to show your streak and plan each day. It is kept for 120 days and synced to your account. If you turn on daily reminders, they are scheduled on your phone only; no reminder data is sent to us, and you can turn them off at any time in Settings.',
      ],
      [
        'Signing in with Google',
        'If you choose Continue with Google, Google shares your name, email address and profile picture link with us so we can create and secure your account. We use your name and email only; we do not receive your Google password or access your Google data.',
      ],
      [
        'Live voice and assessments',
        'Supabase authorises live sessions. Microphone audio travels directly to OpenAI over an encrypted WebRTC connection during live practice and is not stored by Vokeno. Assessment transcripts are processed by xAI, or OpenAI when xAI is unavailable, to produce a non-certified language estimate.',
      ],
      [
        'Unit calls and coach memory',
        'After a unit call, its transcript is sent to OpenAI to produce corrections, one tip and up to three things you said about yourself. Only things you said are kept. They and your repeated corrections are stored on this device only, are not synced to Vokeno, and are sent to OpenAI only during your unit calls so the coach can follow up. See, delete or clear them at any time in Profile › Coach memory. Providers are instructed not to store these requests for training.',
      ],
      [
        'AI writing feedback',
        'When you ask for feedback, the text you wrote and the task are sent to xAI, or OpenAI when xAI is unavailable, to generate the feedback. Vokeno saves your draft and the feedback with your learning progress. Providers are instructed not to store the request for training.',
      ],
      [
        'Reports about AI responses',
        'If you report an AI response, Vokeno stores the reason, any note you add, a short excerpt of the response and your account identifier so the team can review it and improve safety.',
      ],
      [
        'Storage',
        'Signed-in learning state is kept separately for each account on the device and synced to Supabase when connected. Guest progress stays separate on the device. Signing out does not delete unsynced account progress. Deleting your account removes its synced data and local learning data on this device. Vokeno does not offer profile photos.',
      ],
      [
        'Purchases',
        'App stores and RevenueCat process subscription and entitlement information. Your Vokeno account identifier is used to associate purchases with your account. Vokeno stores subscription status, expiry and daily AI request counts to enforce your allowance. Vokeno never receives your full payment-card details. Deleting your Vokeno account does not cancel a store subscription or delete records held separately by the store and payment providers.',
      ],
      [
        'Retention',
        'Synced learning data is kept while your account exists and deleted when you delete the account. AI content reports are deleted together with your account. Daily usage counters are kept only as long as needed to enforce allowances and prevent abuse.',
      ],
      [
        'Your choices',
        'You can stop microphone access in device settings, restore or manage store purchases, sign out, or permanently delete your account and synced learning data from Profile. You can also request deletion by email.',
      ],
      [
        'Children',
        'Vokeno is not directed to children under 13 and does not knowingly collect their personal data.',
      ],
      ['Contact', `Questions, data requests or account deletion: ${SUPPORT_EMAIL}.`],
    ],
    title: 'Privacy policy',
  },
  terms: {
    intro: 'Effective 23 October 2026',
    sections: [
      [
        'Learning service',
        'Vokeno provides authored language lessons and AI-assisted live practice. Captions and AI feedback can contain mistakes and should not be treated as professional advice.',
      ],
      [
        'Assessments',
        'Spoken levels are broad, transcript-based estimates. They are not certified CEFR examinations and do not measure pronunciation from text.',
      ],
      [
        'Subscriptions',
        'Vokeno Plus is offered as a monthly or an annual subscription. The plan screen and the store show the price, billing period, renewal terms, and any free trial before purchase. If a free trial is offered, you are charged the plan price when the trial ends unless you cancel before then; the store decides trial eligibility, usually one trial per account. Subscriptions renew automatically unless cancelled through the store before the current period ends. Cancellation stops future renewals; access continues until the paid period ends unless the purchase is refunded or revoked. Manage or cancel from the Vokeno Plus screen or your store account. Deleting the app or your Vokeno account does not cancel billing. Restore purchases using the same Vokeno and store accounts. Purchases cannot be restored to a new Vokeno account after permanently deleting the original account, so cancel your subscription before account deletion.',
      ],
      [
        'Practice allowances',
        'The plan screen shows the included daily live practice calls and spoken assessments. Each voice session lasts up to five minutes. Every learner gets one free three-minute coach call per unit; Plus lets you repeat unit calls within the daily allowance. AI requests count when processing starts, including an interrupted attempt. Allowances reset at midnight UTC and do not roll over. Service safety limits and temporary outages may affect availability. Lessons and learning history do not require Plus.',
      ],
      [
        'AI-generated content',
        'The live coach, writing feedback and assessments are generated by AI and can be wrong or inappropriate. Use Report on any AI response that is offensive, harmful or wrong.',
      ],
      [
        'Acceptable use',
        'Do not misuse the service, attempt to access another person’s account, disrupt the service, or submit unlawful content.',
      ],
      [
        'Availability',
        'Internet access is required for authentication, cloud sync, purchases, updates, and live voice. Authored lessons can remain available without a live connection.',
      ],
    ],
    title: 'Terms of use',
  },
} as const;
