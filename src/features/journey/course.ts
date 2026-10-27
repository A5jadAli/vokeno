// Where a learner is in a language's course. Today, Course, Progress, the language picker and
// every completion screen read their "what next" from here, so they can never disagree.

import {
  allTrackLessons,
  getTrackLessons,
  type FoundationLesson,
} from '@/features/foundations/catalog';
import type { FoundationEntry, FoundationProgress } from '@/features/foundations/progress';
import {
  courseLevelOf,
  isWarmUp,
  levelLabel,
  levelNote,
  levelRange,
  levelStatus,
} from '@/features/foundations/level-status';
import { finalStep, unitName, type LessonLevel } from '@/features/foundations/types';
import type { LanguageTrack } from '@/features/language/config';

import { coveredLessons, levelReached } from './checkpoints';

export const isFinished = (entry: FoundationEntry | undefined) => Boolean(entry?.attempts.length);

export const isInProgress = (lesson: FoundationLesson, entry: FoundationEntry | undefined) =>
  Boolean(entry && entry.step > 0 && entry.step < finalStep(lesson));

/** Retiring a lesson must not strand someone's unfinished first attempt. */
function savedEarlierLessons(track: LanguageTrack, progress: FoundationProgress) {
  return allTrackLessons(track).filter(
    (lesson) =>
      lesson.retired &&
      !isFinished(progress[lesson.id]) &&
      isInProgress(lesson, progress[lesson.id]),
  );
}

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
/** A saved starting point, moved to the unit lesson that replaced it if it was retired. */
export function pathStart(track: LanguageTrack, startAt?: string) {
  const lessons = allTrackLessons(track);
  let id = startAt;
  for (let hop = 0; hop < 3; hop++) {
    const lesson = lessons.find((item) => item.id === id);
    if (!lesson?.retired || !lesson.replacedBy) break;
    id = lesson.replacedBy;
  }
  return id;
}

/** A partial A1 pilot must not silently advance a beginner into the older A2/B1 library. */
export function isEnglishBeginnerRoute(progress: FoundationProgress, startAt?: string) {
  if (levelStatus.EN.A1 === 'complete') return false;
  const lessons = getTrackLessons('EN');
  const chosen = lessons.find((lesson) => lesson.id === startAt);
  if (chosen) return chosen.level === 'A1';
  return !lessons.some(
    (lesson) =>
      lesson.level !== 'A1' &&
      (isFinished(progress[lesson.id]) || (progress[lesson.id]?.step ?? 0) > 0),
  );
}

function routeLessons(progress: FoundationProgress, track: LanguageTrack, startAt?: string) {
  const lessons = getTrackLessons(track);
  return track === 'EN' && isEnglishBeginnerRoute(progress, startAt)
    ? lessons.filter((lesson) => lesson.level === 'A1')
    : lessons;
}

function routeStart(progress: FoundationProgress, track: LanguageTrack, startAt?: string) {
  return (
    pathStart(track, startAt) ??
    (track === 'EN' && !isEnglishBeginnerRoute(progress) ? 'en-sounds' : undefined)
  );
}

export function findNextLesson(
  progress: FoundationProgress,
  track: LanguageTrack,
  startAt?: string,
): NextLesson | null {
  const lessons = routeLessons(progress, track, startAt);
  // Only first runs count: replaying a finished lesson must not take over "what next".
  const resume = [...lessons, ...savedEarlierLessons(track, progress)]
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
    lessons.findIndex((lesson) => lesson.id === routeStart(progress, track, startAt)),
  );
  // Lessons a passed checkpoint tested the learner out of are not offered as next.
  const covered = coveredLessons(lessons, progress);
  const open = (lesson: FoundationLesson) =>
    !isFinished(progress[lesson.id]) && !covered.has(lesson.id);
  const fresh = lessons.slice(start).find(open) ?? lessons.find(open);
  return fresh ? { lesson: fresh, reason: 'start' } : null;
}

/** Unfinished lessons from the learner's starting point on, in course order. */
export function lessonsAhead(progress: FoundationProgress, track: LanguageTrack, startAt?: string) {
  const lessons = routeLessons(progress, track, startAt);
  const start = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.id === routeStart(progress, track, startAt)),
  );
  const covered = coveredLessons(lessons, progress);
  return lessons
    .slice(start)
    .filter((lesson) => !isFinished(progress[lesson.id]) && !covered.has(lesson.id));
}

export type UnitSummary = {
  id: string;
  /**
   * A unit, a checkpoint after a group of units, a level's older lessons, a warm-up below the
   * course's first level, or saved lessons.
   */
  kind: 'unit' | 'checkpoint' | 'lessons' | 'warm-up' | 'saved';
  title: string;
  /** "Unit 2 · Woher kommst du?" for units, the level for older lessons. */
  label: string;
  canDo: string;
  /** The unit's topic icon, when it has one. */
  icon?: string;
  lessons: FoundationLesson[];
  /** Lessons finished, or covered by a passed checkpoint. */
  done: number;
  /** Of those, the ones covered by a passed checkpoint without being taken. */
  covered: number;
};

/** The course grouped the way learners see it: units, then the older lessons of each level. */
export function courseUnits(track: LanguageTrack, progress: FoundationProgress): UnitSummary[] {
  const groups: UnitSummary[] = [];
  const saved = savedEarlierLessons(track, progress);
  const covered = coveredLessons(getTrackLessons(track), progress);
  if (saved.length)
    groups.push({
      id: `${track}-saved-lessons`,
      kind: 'saved',
      title: 'Saved lessons',
      label: 'Saved lessons',
      canDo: 'Finish your earlier lesson, then continue with the updated course.',
      lessons: saved,
      done: 0,
      covered: 0,
    });
  for (const lesson of getTrackLessons(track)) {
    const id = lesson.format === 'steps' ? lesson.unit.id : `${track}-${lesson.level}-lessons`;
    let group = groups.find((item) => item.id === id);
    if (!group) {
      group =
        lesson.format === 'steps'
          ? {
              id,
              kind: lesson.unit.checkpoint ? 'checkpoint' : 'unit',
              title: lesson.unit.title,
              label: `${unitName(lesson.unit)} · ${lesson.unit.title}`,
              canDo: lesson.unit.canDo,
              icon: lesson.unit.icon,
              lessons: [],
              done: 0,
              covered: 0,
            }
          : isWarmUp(track, lesson.level)
            ? {
                id,
                kind: 'warm-up',
                title: 'Warm-up',
                label: `Warm-up before ${levelRange[track][0]}`,
                canDo: `Short lessons that tune your ear before ${levelRange[track][0]}.`,
                lessons: [],
                done: 0,
                covered: 0,
              }
            : {
                id,
                kind: 'lessons',
                title: `${lesson.level} lessons`,
                label: `${lesson.level} lessons`,
                canDo: 'Short lessons from the starter set, until full units are ready.',
                lessons: [],
                done: 0,
                covered: 0,
              };
      groups.push(group);
    }
    group.lessons.push(lesson);
    if (isFinished(progress[lesson.id])) group.done += 1;
    else if (covered.has(lesson.id)) {
      group.done += 1;
      group.covered += 1;
    }
  }
  return groups;
}

export type CoursePosition = {
  next: NextLesson | null;
  /** The available beginner block is done; later library lessons are not its continuation. */
  waitingForContent: boolean;
  /** The unit (or lesson group) the next lesson belongs to. */
  unit?: UnitSummary;
  /** 1-based position of the next lesson inside its unit. */
  lessonNumber?: number;
  /** Lessons finished or covered by a passed checkpoint: the one count used everywhere. */
  finishedLessons: number;
  /** Of those, lessons covered by a checkpoint rather than taken. */
  coveredLessons: number;
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
    waitingForContent: next === null && track === 'EN' && isEnglishBeginnerRoute(progress, startAt),
    unit,
    lessonNumber: next && unit ? unit.lessons.indexOf(next.lesson) + 1 : undefined,
    finishedLessons: units.reduce((sum, item) => sum + (item.kind === 'saved' ? 0 : item.done), 0),
    coveredLessons: units.reduce((sum, item) => sum + item.covered, 0),
    totalLessons: lessons.length,
    started: allTrackLessons(track).some(
      (lesson) => isFinished(progress[lesson.id]) || (progress[lesson.id]?.step ?? 0) > 0,
    ),
  };
}

/** The unit a lesson belongs to, and its 1-based place in it. */
export function lessonContext(
  track: LanguageTrack,
  progress: FoundationProgress,
  lessonId: string,
) {
  const unit = courseUnits(track, progress).find((item) =>
    item.lessons.some((lesson) => lesson.id === lessonId),
  );
  if (!unit) return undefined;
  return { unit, number: unit.lessons.findIndex((lesson) => lesson.id === lessonId) + 1 };
}

/** The lesson an href opens, if it is a guided lesson: '/foundation/de-a1-u5-order' → its id. */
export function lessonIdFromHref(href: string) {
  const match = /^\/foundation\/([a-z0-9-]+)$/.exec(href);
  return match?.[1];
}

/** Approximate minutes for a lesson: units carry their own; older lessons take about five. */
export const lessonMinutes = (lesson: FoundationLesson) =>
  lesson.format === 'steps' ? lesson.minutes : 5;

/** What each level lets a learner do, in a few words, after the CEFR descriptors. */
export const levelNames: Record<LessonLevel, string> = {
  A1: 'Everyday basics',
  A2: 'Getting by',
  B1: 'Independent',
  B2: 'Confident',
  C1: 'Advanced',
};

export type LevelSection = {
  level: LessonLevel;
  /** "A1" once a level's units are all built, "A1 starter" before. */
  label: string;
  name: string;
  /** One honest sentence on what finishing this level's lessons does and does not mean. */
  note: string;
  groups: UnitSummary[];
  units: number;
  /** Units finished or covered by a passed checkpoint. */
  unitsDone: number;
  /** Of those, the units a checkpoint covered rather than the learner taking every lesson. */
  unitsCovered: number;
  lessons: number;
  /** Lessons finished or covered by a passed checkpoint. */
  lessonsDone: number;
  lessonsCovered: number;
  /** Only true once the level is complete and every checkpoint in it is passed. */
  reached: boolean;
};

/**
 * The course as levels, in the language's own range (A1 to B2, or B1 to C1 for English), each
 * holding its units, checkpoints and older lessons in course order. Lessons below the range are
 * a warm-up at the start of the first level. A level with nothing built yet has no groups.
 */
export function courseLevels(track: LanguageTrack, progress: FoundationProgress): LevelSection[] {
  const groups = courseUnits(track, progress);
  const levelOf = (group: UnitSummary) => courseLevelOf(track, group.lessons[0].level);
  return levelRange[track].map((level) => {
    const inLevel = groups.filter((group) => levelOf(group) === level);
    const units = inLevel.filter((group) => group.kind === 'unit');
    // A warm-up sits in the level but is not its content, so it never moves the level's count.
    const content = inLevel.filter((group) => group.kind !== 'warm-up');
    const done = units.filter((unit) => unit.done === unit.lessons.length);
    return {
      level,
      // A level with nothing built yet is not a starter set either: just its name.
      label: inLevel.length ? levelLabel(track, level) : level,
      name: levelNames[level],
      note: inLevel.length ? levelNote(track, level) : '',
      groups: inLevel,
      units: units.length,
      unitsDone: done.length,
      unitsCovered: done.filter((unit) => unit.covered > 0).length,
      lessons: content.reduce((sum, group) => sum + group.lessons.length, 0),
      lessonsDone: content.reduce((sum, group) => sum + group.done, 0),
      lessonsCovered: content.reduce((sum, group) => sum + group.covered, 0),
      reached: levelReached(track, level, getTrackLessons(track), progress),
    };
  });
}

/**
 * How far through a level, counted one way everywhere (Course and Progress): by units when the
 * level has units, by lessons otherwise, with covered ones said out loud. The bar uses the same
 * count as the words.
 */
export function levelProgress(section: LevelSection) {
  const byUnits = section.units > 0;
  const done = byUnits ? section.unitsDone : section.lessonsDone;
  const total = byUnits ? section.units : section.lessons;
  const covered = byUnits ? section.unitsCovered : section.lessonsCovered;
  const noun = byUnits ? 'units' : 'lessons';
  const coveredText = covered ? `, ${covered} covered` : '';
  return {
    value: total ? done / total : 0,
    text: section.reached
      ? `${section.level} reached`
      : `${done} of ${total} ${noun}${coveredText}`,
    /** For screen readers: "3 of 6 units done, 2 covered". */
    label: section.reached
      ? `${section.level} reached`
      : `${done} of ${total} ${noun} done${coveredText}`,
  };
}

/**
 * The groups to show in an open level without a long scroll: one before "you are here" and two
 * after it (or the first three when you are not in this level), plus the next checkpoint after
 * them, because the next milestone is what keeps people going.
 */
export function groupsAround(groups: UnitSummary[], currentId?: string, before = 1, after = 2) {
  const here = groups.findIndex((group) => group.id === currentId);
  const start = here < 0 ? 0 : Math.max(0, here - before);
  const end = here < 0 ? before + after : here + after + 1;
  const shown = groups.slice(start, end);
  const gate = groups.slice(end).find((group) => group.kind === 'checkpoint');
  return gate ? [...shown, gate] : shown;
}
