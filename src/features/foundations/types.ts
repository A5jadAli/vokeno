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

export type FoundationLesson = {
  id: string;
  track: LessonTrack;
  level: LessonLevel;
  title: string;
  outcome: string;
  phrases: { target: string; meaning: string; use: string }[];
  notice: string;
  /** A short articulation or prosody tip, aimed at intelligibility rather than accent erasure. */
  pronunciation?: string;
  /** `spoken` is how a local reads the text aloud when it differs from the sign (prices, times). */
  reading?: { target: string; meaning: string; spoken?: string };
  checks: LessonCheck[];
  writing: { prompt: string; accepted: string[]; hint: string; explanation: string };
  speaking: string;
};

export const MAX_LESSON_CHECKS = 4;

type LessonInput = Omit<FoundationLesson, 'phrases' | 'reading' | 'track'> & {
  phrases: [target: string, meaning: string, use: string][];
  reading?: [target: string, meaning: string, spoken?: string];
};

export function defineLessons(track: LessonTrack, inputs: LessonInput[]): FoundationLesson[] {
  return inputs.map(({ phrases, reading, ...input }) => ({
    ...input,
    track,
    phrases: phrases.map(([target, meaning, use]) => ({ target, meaning, use })),
    reading: reading ? { target: reading[0], meaning: reading[1], spoken: reading[2] } : undefined,
  }));
}
