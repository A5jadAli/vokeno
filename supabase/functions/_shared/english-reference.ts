/** Shared whitelist: user input never becomes a free-form voice instruction. */
export type EnglishReference = 'en-GB' | 'en-US';
export const englishGoals = [
  'everyday',
  'work-study',
  'interviews',
  'meetings',
  'presentations',
  'ielts-academic',
  'ielts-general',
] as const;
export type EnglishGoal = (typeof englishGoals)[number];
export const englishGoalLabels: Record<EnglishGoal, string> = {
  everyday: 'Everyday life',
  'work-study': 'Work and study',
  interviews: 'Job interviews',
  meetings: 'Meetings and teamwork',
  presentations: 'Presentations',
  'ielts-academic': 'IELTS Academic',
  'ielts-general': 'IELTS General Training',
};
export function isEnglishGoal(value: unknown): value is EnglishGoal {
  return typeof value === 'string' && englishGoals.some((goal) => goal === value);
}
export const englishGoalBrief: Record<EnglishGoal, string> = {
  everyday: 'Practise a short everyday exchange, one useful outcome at a time.',
  'work-study':
    'Practise a useful work or study exchange, matched to demonstrated ability. This broad goal does not imply a particular profession.',
  interviews:
    'Practise interview questions and relevant follow-ups. Use real or clearly fictional experience, never invent achievements for the learner. Begin with simple introductions if needed.',
  meetings:
    'Practise short updates, clarifying a request, taking turns and confirming actions. Ask one question at a time; use simpler tasks for a beginner.',
  presentations:
    'Help the learner explain one idea, give a reason and answer a listener’s question. Increase length only when they can manage it. Do not start a beginner with a long presentation.',
  'ielts-academic':
    'Support IELTS Academic preparation at the learner’s current level. This conversation is practice, not an official test or guaranteed band score.',
  'ielts-general':
    'Support IELTS General Training preparation at the learner’s current level. This conversation is practice, not an official test or guaranteed band score.',
};

export const englishReferences = ['en-GB', 'en-US'] as const;
export const englishReferenceLabel: Record<EnglishReference, string> = {
  'en-GB': 'British English',
  'en-US': 'American English',
};

export function isEnglishReference(value: unknown): value is EnglishReference {
  return value === 'en-GB' || value === 'en-US';
}

/** Older saved profiles and callers keep their existing British model. */
export function englishReferenceOrDefault(value: unknown): EnglishReference {
  return isEnglishReference(value) ? value : 'en-GB';
}

export function englishCoachBrief(reference: EnglishReference) {
  return `Use contemporary, broadly understood ${englishReferenceLabel[reference]} as your speaking model. Accept correct American and British vocabulary, grammar and spelling; never correct a valid regional alternative as an error. Label a regional expression when useful. Coach clear meaning and intelligibility, not imitation of a native accent. With beginners, ask one short question, wait, and offer a short model if they are stuck. Do not assume a beginner can understand an explanation in English: demonstrate the exchange and ask which language would help if needed.`;
}
