import type { LanguageTrack } from '@/features/language/config';

import type { LessonLevel } from './types';

/**
 * Whether a level's lessons cover what the level really requires (see
 * docs/curriculum-standards-audit.md). A level becomes 'complete' only after it passes every
 * gate there; until then it is a starter set and must never be presented as the full level.
 */
export const levelStatus: Record<
  LanguageTrack,
  Partial<Record<LessonLevel, 'starter' | 'complete'>>
> = {
  DE: { A1: 'starter', A2: 'starter', B1: 'starter' },
  EN: { A2: 'starter', B1: 'starter', B2: 'starter' },
  ES: { A1: 'starter', A2: 'starter' },
};

const exams: Partial<Record<LanguageTrack, Partial<Record<LessonLevel, string>>>> = {
  DE: { A1: 'Goethe-Zertifikat A1', A2: 'Goethe-Zertifikat A2', B1: 'Goethe-Zertifikat B1' },
  ES: { A1: 'DELE A1', A2: 'DELE A2' },
  EN: { B1: 'IELTS or Cambridge', B2: 'IELTS or Cambridge' },
};

export function isStarterLevel(track: LanguageTrack, level: LessonLevel) {
  return levelStatus[track][level] !== 'complete';
}

/** Short label for tabs and headers: "A1 starter" until the level is complete. */
export function levelLabel(track: LanguageTrack, level: LessonLevel) {
  return isStarterLevel(track, level) ? `${level} starter` : level;
}

/** One honest sentence about what finishing this level's lessons does and does not mean. */
export function levelNote(track: LanguageTrack, level: LessonLevel) {
  if (!isStarterLevel(track, level)) return '';
  const exam = exams[track]?.[level];
  return `A starter set: first steps towards ${level}, not yet everything ${level} needs. Finishing it does not mean you have reached ${level}${exam ? ` or are ready for the ${exam} exam` : ''}.`;
}
