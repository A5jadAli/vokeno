import type { LanguageTrack } from '@/features/language/config';

import type { LessonLevel } from './types';

/**
 * Whether a level's lessons cover what the level really requires (see
 * docs/curriculum-standards-audit.md). A level becomes 'complete' only after it passes every
 * gate there; until then it is never presented as the full level. 'units' means every planned unit
 * is built, but the mock exams and the native-teacher review are still to come.
 */
export const levelStatus: Record<
  LanguageTrack,
  Partial<Record<LessonLevel, 'starter' | 'units' | 'complete'>>
> = {
  DE: { A1: 'units', A2: 'starter', B1: 'starter' },
  EN: { A2: 'starter', B1: 'starter', B2: 'starter' },
  ES: { A1: 'starter', A2: 'starter' },
};

export const exams: Partial<Record<LanguageTrack, Partial<Record<LessonLevel, string>>>> = {
  DE: { A1: 'Goethe-Zertifikat A1', A2: 'Goethe-Zertifikat A2', B1: 'Goethe-Zertifikat B1' },
  ES: { A1: 'DELE A1', A2: 'DELE A2' },
  EN: { B1: 'IELTS or Cambridge', B2: 'IELTS or Cambridge' },
};

/**
 * The levels each course is built to, in order (decided 7 October 2026): German and Spanish
 * from A1 to at least B2; English for B1 to C1 fluency and IELTS, with no A1 or A2 labels.
 */
export const levelRange: Record<LanguageTrack, LessonLevel[]> = {
  DE: ['A1', 'A2', 'B1', 'B2'],
  ES: ['A1', 'A2', 'B1', 'B2'],
  EN: ['B1', 'B2', 'C1'],
};

const order: LessonLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

/** Lessons below a course's first level are a warm-up for it, never labelled with their level. */
export const isWarmUp = (track: LanguageTrack, level: LessonLevel) =>
  order.indexOf(level) < order.indexOf(levelRange[track][0]);

/** The course level a lesson belongs under: its own, or the first level for a warm-up. */
export const courseLevelOf = (track: LanguageTrack, level: LessonLevel) =>
  isWarmUp(track, level) ? levelRange[track][0] : level;

export function isStarterLevel(track: LanguageTrack, level: LessonLevel) {
  return levelStatus[track][level] !== 'complete';
}

/** Short label for tabs and headers: "A1 starter" while the units are still being written. */
export function levelLabel(track: LanguageTrack, level: LessonLevel) {
  if (isWarmUp(track, level)) return 'Warm-up';
  return levelStatus[track][level] === 'units' || !isStarterLevel(track, level)
    ? level
    : `${level} starter`;
}

/** One honest sentence about what finishing this level's lessons does and does not mean. */
export function levelNote(track: LanguageTrack, level: LessonLevel) {
  if (isWarmUp(track, level))
    return `A short warm-up before ${levelRange[track][0]}: it tunes your ear and everyday phrases, and is not a level of its own.`;
  if (!isStarterLevel(track, level)) return '';
  const exam = exams[track]?.[level];
  if (levelStatus[track][level] === 'units')
    return `All ${level} units are here. Practice exams and a teacher review are still to come, so finishing the units does not yet mean you are ready${exam ? ` for the ${exam} exam` : ''}.`;
  return `A starter set: first steps towards ${level}, not yet everything ${level} needs. Finishing it does not mean you have reached ${level}${exam ? ` or are ready for the ${exam} exam` : ''}.`;
}
