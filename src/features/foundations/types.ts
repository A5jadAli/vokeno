import type { LanguageTrack } from '@/features/language/config';

export type LessonTrack = LanguageTrack;
export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type LessonCheck = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  /** When present, the learner hears this text and answers without seeing it first. */
  audio?: string;
  /** The question is about the lesson's reading text, which is shown with it. */
  useReading?: boolean;
};

type LessonBase = {
  id: string;
  track: LessonTrack;
  level: LessonLevel;
  title: string;
  outcome: string;
  /** Words and chunks the lesson teaches. Each one becomes a card in the review queue. */
  phrases: { target: string; meaning: string; use: string }[];
  /**
   * Replaced by a newer unit: hidden from the path, but kept so earlier progress, history and
   * review cards are not lost.
   */
  retired?: boolean;
};

/** The original format: phrases, up to four checks, one written phrase and speaking aloud. */
export type ClassicLesson = LessonBase & {
  format: 'classic';
  notice: string;
  /** A short articulation or prosody tip, aimed at intelligibility rather than accent erasure. */
  pronunciation?: string;
  /** `spoken` is how a local reads the text aloud when it differs from the sign (prices, times). */
  reading?: { target: string; meaning: string; spoken?: string };
  checks: LessonCheck[];
  writing: { prompt: string; accepted: string[]; hint: string; explanation: string };
  speaking: string;
};

/**
 * One line of a scene. `real` is how people actually say it when it differs from the careful
 * form; `realMeaning` translates it when the English differs too.
 */
export type SceneLine = {
  speaker: string;
  text: string;
  meaning: string;
  real?: string;
  realMeaning?: string;
};

/**
 * One screen of a unit session. Teaching steps (scene, teach, rule, speak) are not marked;
 * the others are, and count towards "right first time".
 */
export type LessonStep =
  | { kind: 'scene'; title: string; intro: string; lines: SceneLine[]; note?: string }
  | {
      kind: 'teach';
      title: string;
      items: { target: string; meaning: string; note?: string }[];
    }
  | { kind: 'rule'; title: string; body: string; table?: [string, string][]; examples?: string[] }
  | {
      kind: 'choose';
      prompt: string;
      options: string[];
      answer: number;
      explanation: string;
      /** The learner hears this and answers without seeing it first. */
      audio?: string;
      /** A short text (sign, message, form) the question is about. */
      context?: string;
    }
  | {
      kind: 'build';
      prompt: string;
      /** The words of the sentence in the right order; they are shown shuffled as tiles. */
      answer: string[];
      /** Plausible wrong tiles mixed in. */
      extra?: string[];
      /** Other correct orders of the same tiles, as sentences (German word order is flexible). */
      also?: string[];
      explanation: string;
    }
  | {
      kind: 'type';
      prompt: string;
      accepted: string[];
      hint: string;
      explanation: string;
      /** A short text (form, message) the answer comes from. */
      context?: string;
    }
  | { kind: 'match'; prompt: string; pairs: [target: string, meaning: string][] }
  | { kind: 'speak'; prompt: string; lines: string[]; tip?: string };

export type GradedStep = Extract<LessonStep, { kind: 'choose' | 'build' | 'type' | 'match' }>;

export const isGradedStep = (step: LessonStep): step is GradedStep =>
  step.kind === 'choose' || step.kind === 'build' || step.kind === 'type' || step.kind === 'match';

/** A short session inside a unit: about five minutes of varied steps. */
export type StepLesson = LessonBase & {
  format: 'steps';
  unit: { id: string; number: number; title: string; canDo: string };
  /** One of the unit's sessions, e.g. "Words", "Grammar", "Real talk", "Exam task". */
  session: string;
  minutes: number;
  steps: LessonStep[];
};

export type FoundationLesson = ClassicLesson | StepLesson;

export const MAX_LESSON_CHECKS = 4;
/** Upper bound on steps in one session; keeps sessions short and cloud progress small. */
export const MAX_LESSON_STEPS = 24;

/** Marked items in a lesson: the checks plus the written phrase, or the graded steps. */
export function gradedCount(lesson: FoundationLesson) {
  return lesson.format === 'steps'
    ? lesson.steps.filter(isGradedStep).length
    : lesson.checks.length + 1;
}

/** The `step` value of a finished lesson. */
export function finalStep(lesson: FoundationLesson) {
  return lesson.format === 'steps' ? lesson.steps.length : 4;
}

type LessonInput = Omit<ClassicLesson, 'phrases' | 'reading' | 'track' | 'format'> & {
  phrases: [target: string, meaning: string, use: string][];
  reading?: [target: string, meaning: string, spoken?: string];
};

type SessionInput = Omit<StepLesson, 'track' | 'level' | 'format' | 'unit' | 'phrases'>;

/**
 * A unit's sessions in order. Every word taught in a `teach` step becomes a review card, so the
 * review queue holds exactly what the unit taught.
 */
export function defineUnit(
  track: LessonTrack,
  level: LessonLevel,
  unit: StepLesson['unit'],
  sessions: SessionInput[],
): StepLesson[] {
  return sessions.map((session) => ({
    ...session,
    format: 'steps',
    track,
    level,
    unit,
    phrases: session.steps.flatMap((step) =>
      step.kind === 'teach'
        ? step.items.map((item) => ({
            target: item.target,
            meaning: item.meaning,
            use: item.note ?? '',
          }))
        : [],
    ),
  }));
}

export function defineLessons(track: LessonTrack, inputs: LessonInput[]): ClassicLesson[] {
  return inputs.map(({ phrases, reading, ...input }) => ({
    ...input,
    format: 'classic',
    track,
    phrases: phrases.map(([target, meaning, use]) => ({ target, meaning, use })),
    reading: reading ? { target: reading[0], meaning: reading[1], spoken: reading[2] } : undefined,
  }));
}
