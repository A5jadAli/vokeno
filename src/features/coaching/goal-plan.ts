// "Ready by your date": the learner's target level and date turned into a weekly pace, an
// honest on-track verdict and how many lessons today's session needs.

import { getTrackLessons, levelOrder } from '@/features/foundations/catalog';
import { courseLevelOf, levelRange } from '@/features/foundations/level-status';
import type { FoundationProgress } from '@/features/foundations/progress';
import type { LessonLevel } from '@/features/foundations/types';
import { dayNumberOf, localDay } from '@/features/habits/practice-log';
import { lessonsAhead } from '@/features/journey/course';
import type { LanguageTrack } from '@/features/language/config';

export type GoalStatus = 'on-track' | 'behind' | 'tight' | 'ready' | 'today' | 'passed';

export type GoalPlan = {
  level: LessonLevel;
  date: string;
  daysLeft: number;
  /** Week of the plan, counted from the day the goal was set; null for goals set before that. */
  week: number | null;
  weeks: number;
  weeksLeft: number;
  lessonsLeft: number;
  unitsLeft: number;
  /** Lessons a week needed to finish the level with the last week left for review. */
  perWeek: number;
  /** First finishes of this language's lessons since Monday. */
  doneThisWeek: number;
  status: GoalStatus;
  /** How many new lessons today's session should hold: one, or more when the date needs it. */
  lessonsToday: number;
};

export type GoalInput = {
  track: LanguageTrack;
  progress: FoundationProgress;
  date: string | null | undefined;
  level?: LessonLevel;
  since?: string;
  startAt?: string;
  now: number;
};

/** Keep the last week before the exam for review and mock tests, when there is time for it. */
export const REVIEW_BUFFER_DAYS = 7;
/** One rest day a week: the daily pace is the weekly one over six days. */
const STUDY_DAYS = 6;

const isDate = (value: string | null | undefined): value is string =>
  Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));

/** The level a goal aims at when none was chosen: the one the learner is working through now. */
export function defaultGoalLevel(
  progress: FoundationProgress,
  track: LanguageTrack,
  startAt?: string,
): LessonLevel {
  // A warm-up is not a level to aim at: its goal is the course's first level.
  return courseLevelOf(
    track,
    lessonsAhead(progress, track, startAt)[0]?.level ??
      getTrackLessons(track).at(-1)?.level ??
      levelRange[track][0],
  );
}

/** Levels a goal can aim at in this language, in course order. */
export function goalLevels(track: LanguageTrack): LessonLevel[] {
  const present = new Set(getTrackLessons(track).map((lesson) => lesson.level));
  return levelRange[track].filter((level) => present.has(level));
}

export function buildGoalPlan(input: GoalInput): GoalPlan | null {
  const { track, progress, date, now } = input;
  if (!isDate(date)) return null;
  const today = dayNumberOf(localDay(now));
  const target = dayNumberOf(date);
  const daysLeft = target - today;
  // A goal saved before English started at B1 ("A2") now aims at the course's first level.
  const level = courseLevelOf(
    track,
    input.level ?? defaultGoalLevel(progress, track, input.startAt),
  );
  const rank = levelOrder.indexOf(level);
  const ahead = lessonsAhead(progress, track, input.startAt).filter(
    (lesson) => levelOrder.indexOf(lesson.level) <= rank,
  );
  const lessonsLeft = ahead.length;
  const unitsLeft = new Set(
    ahead.map((lesson) =>
      lesson.format === 'steps' ? lesson.unit.id : `${lesson.level}-lesson-${lesson.id}`,
    ),
  ).size;

  const studyDays = Math.max(1, daysLeft - (daysLeft >= 3 * 7 ? REVIEW_BUFFER_DAYS : 0));
  const perWeek = lessonsLeft ? Math.ceil((lessonsLeft * 7) / studyDays) : 0;
  const since = isDate(input.since) ? dayNumberOf(input.since) : null;
  const weeks = Math.max(1, Math.ceil((target - (since ?? today)) / 7));
  const week = since === null ? null : Math.min(weeks, Math.floor((today - since) / 7) + 1);

  // First finishes of this language's lessons, by local day.
  const firstFinishes = getTrackLessons(track)
    .map((lesson) => progress[lesson.id]?.attempts[0]?.at)
    .filter((at): at is string => Boolean(at))
    .map((at) => dayNumberOf(localDay(Date.parse(at))));
  const weekday = (new Date(now).getDay() + 6) % 7; // Monday is 0
  const doneThisWeek = firstFinishes.filter((day) => day > today - weekday - 1).length;
  // Recent pace: the last two weeks, or since the goal was set when that is sooner.
  const window = Math.max(1, Math.min(14, since === null ? 14 : today - since + 1));
  const recentPerWeek =
    (firstFinishes.filter((day) => day > today - window).length * 7) / Math.max(window, 7);

  const status: GoalStatus =
    daysLeft < 0
      ? 'passed'
      : daysLeft === 0
        ? 'today'
        : lessonsLeft === 0
          ? 'ready'
          : perWeek > 2 * STUDY_DAYS
            ? 'tight'
            : recentPerWeek >= perWeek ||
                // A goal set this week has no pace yet: following Today keeps it on track.
                (since !== null && today - since < 7)
              ? 'on-track'
              : 'behind';

  return {
    level,
    date,
    daysLeft,
    week,
    weeks,
    weeksLeft: Math.max(0, Math.ceil(daysLeft / 7)),
    lessonsLeft,
    unitsLeft,
    perWeek,
    doneThisWeek,
    status,
    lessonsToday:
      status === 'ready' || status === 'today' || status === 'passed'
        ? 1
        : Math.min(3, Math.max(1, Math.ceil(perWeek / STUDY_DAYS))),
  };
}
