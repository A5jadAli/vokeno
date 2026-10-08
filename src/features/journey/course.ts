// Where a learner is in a language's course. Today, Course, Progress, the language picker and
// every completion screen read their "what next" from here, so they can never disagree.

import { getTrackLessons, type FoundationLesson } from '@/features/foundations/catalog';
import type { FoundationEntry, FoundationProgress } from '@/features/foundations/progress';
import { finalStep } from '@/features/foundations/types';
import type { LanguageTrack } from '@/features/language/config';

export const isFinished = (entry: FoundationEntry | undefined) => Boolean(entry?.attempts.length);

export const isInProgress = (lesson: FoundationLesson, entry: FoundationEntry | undefined) =>
  Boolean(entry && entry.step > 0 && entry.step < finalStep(lesson));

export type NextLesson = {
  lesson: FoundationLesson;
  /** resume: a session left part-way; start: the next one in the course. */
  reason: 'resume' | 'start';
};

/**
 * The lesson to offer next, or null when every published lesson is finished.
 * 1. A first run left part-way, the most recently touched first (not the first in catalog order).
 * 2. The first unstarted lesson from the learner's chosen starting point.
 * 3. Any lesson still unstarted, for example ones skipped by placement.
 */
export function findNextLesson(
  progress: FoundationProgress,
  track: LanguageTrack,
  startAt?: string,
): NextLesson | null {
  const lessons = getTrackLessons(track);
  // Only first runs count: replaying a finished lesson must not take over "what next".
  const resume = lessons
    .filter(
      (lesson) => !isFinished(progress[lesson.id]) && isInProgress(lesson, progress[lesson.id]),
    )
    .sort(
      (a, b) =>
        Date.parse(progress[b.id]?.updatedAt ?? '') - Date.parse(progress[a.id]?.updatedAt ?? ''),
    )[0];
  if (resume) return { lesson: resume, reason: 'resume' };
  const start = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.id === startAt),
  );
  const fresh =
    lessons.slice(start).find((lesson) => !isFinished(progress[lesson.id])) ??
    lessons.find((lesson) => !isFinished(progress[lesson.id]));
  return fresh ? { lesson: fresh, reason: 'start' } : null;
}

export type UnitSummary = {
  id: string;
  title: string;
  /** "Unit 2 · Woher kommst du?" for units, the level for older lessons. */
  label: string;
  canDo: string;
  lessons: FoundationLesson[];
  done: number;
};

/** The course grouped the way learners see it: units, then the older lessons of each level. */
export function courseUnits(track: LanguageTrack, progress: FoundationProgress): UnitSummary[] {
  const groups: UnitSummary[] = [];
  for (const lesson of getTrackLessons(track)) {
    const id = lesson.format === 'steps' ? lesson.unit.id : `${track}-${lesson.level}-lessons`;
    let group = groups.find((item) => item.id === id);
    if (!group) {
      group =
        lesson.format === 'steps'
          ? {
              id,
              title: lesson.unit.title,
              label: `Unit ${lesson.unit.number} · ${lesson.unit.title}`,
              canDo: lesson.unit.canDo,
              lessons: [],
              done: 0,
            }
          : {
              id,
              title: `${lesson.level} lessons`,
              label: `${lesson.level} lessons`,
              canDo: 'Short lessons from the starter set, until full units are ready.',
              lessons: [],
              done: 0,
            };
      groups.push(group);
    }
    group.lessons.push(lesson);
    if (isFinished(progress[lesson.id])) group.done += 1;
  }
  return groups;
}

export type CoursePosition = {
  next: NextLesson | null;
  /** The unit (or lesson group) the next lesson belongs to. */
  unit?: UnitSummary;
  /** 1-based position of the next lesson inside its unit. */
  lessonNumber?: number;
  finishedLessons: number;
  totalLessons: number;
  started: boolean;
};

export function coursePosition(
  progress: FoundationProgress,
  track: LanguageTrack,
  startAt?: string,
): CoursePosition {
  const lessons = getTrackLessons(track);
  const next = findNextLesson(progress, track, startAt);
  const units = courseUnits(track, progress);
  const unit = next ? units.find((item) => item.lessons.includes(next.lesson)) : undefined;
  return {
    next,
    unit,
    lessonNumber: next && unit ? unit.lessons.indexOf(next.lesson) + 1 : undefined,
    finishedLessons: lessons.filter((lesson) => isFinished(progress[lesson.id])).length,
    totalLessons: lessons.length,
    started: lessons.some(
      (lesson) => isFinished(progress[lesson.id]) || (progress[lesson.id]?.step ?? 0) > 0,
    ),
  };
}

/** The lesson an href opens, if it is a guided lesson: '/foundation/de-a1-u5-order' → its id. */
export function lessonIdFromHref(href: string) {
  const match = /^\/foundation\/([a-z0-9-]+)$/.exec(href);
  return match?.[1];
}

/** Approximate minutes for a lesson: units carry their own; older lessons take about five. */
export const lessonMinutes = (lesson: FoundationLesson) =>
  lesson.format === 'steps' ? lesson.minutes : 5;
