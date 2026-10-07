import { getTrackLessons, type FoundationLesson } from '@/features/foundations/catalog';
import type { FoundationProgress } from '@/features/foundations/progress';
import type { LanguageTrack } from '@/features/language/config';

import { localDay } from './practice-log';

export type LevelMilestone = {
  level: FoundationLesson['level'];
  /** What the learner can now do, in their own words from the lessons. */
  canDo: string[];
  nextLevel?: FoundationLesson['level'];
};

/**
 * A level just finished: every lesson in it is done, the last one was finished today, and the
 * next level has not started. Derived, so it cannot repeat or go stale.
 */
export function levelMilestone(
  track: LanguageTrack,
  progress: FoundationProgress,
  now: number,
): LevelMilestone | null {
  const lessons = getTrackLessons(track);
  const today = localDay(now);
  const levels = [...new Set(lessons.map((lesson) => lesson.level))];
  for (const [index, level] of levels.entries()) {
    const inLevel = lessons.filter((lesson) => lesson.level === level);
    const finishedAt = inLevel.map((lesson) => progress[lesson.id]?.attempts.at(-1)?.at);
    if (finishedAt.some((at) => !at)) continue;
    const latest = Math.max(
      ...finishedAt.map((at) => Date.parse(at!)).filter((time) => Number.isFinite(time)),
    );
    if (!Number.isFinite(latest) || localDay(latest) !== today) continue;
    const nextLevel = levels[index + 1];
    const nextStarted = lessons.some(
      (lesson) => lesson.level === nextLevel && (progress[lesson.id]?.step ?? 0) > 0,
    );
    if (nextStarted) continue;
    return { level, canDo: inLevel.slice(-4).map((lesson) => lesson.outcome), nextLevel };
  }
  return null;
}
