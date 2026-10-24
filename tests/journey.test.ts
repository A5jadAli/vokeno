import { describe, expect, it } from '@jest/globals';

import { buildTodayPlan, type TodayPlanInput } from '@/features/coaching/daily-plan';
import { getTrackLessons } from '@/features/foundations/catalog';
import { nextLesson } from '@/features/foundations/next';
import { contentLevel } from '@/features/foundations/level-status';
import { fittingConversations, fittingScenarios } from '@/features/journey/practice';
import { freshFoundationEntry, type FoundationProgress } from '@/features/foundations/progress';
import { dayFromNumber, dayNumberOf, type PracticeLog } from '@/features/habits/practice-log';
import { ACTIVITY_LOG_DAYS, addActivity, parseActivityLog } from '@/features/journey/activity-log';
import {
  courseLevels,
  courseUnits,
  levelProgress,
  coursePosition,
  groupsAround,
  findNextLesson,
  lessonIdFromHref,
} from '@/features/journey/course';

const NOON = new Date(2026, 9, 8, 12).getTime();
const TODAY = '2026-10-08';
const ago = (days: number) => dayFromNumber(dayNumberOf(TODAY) - days);
const finished = (at = '2026-10-01T10:00:00.000Z') => ({
  ...freshFoundationEntry(),
  step: 4,
  attempts: [{ at, correctFirstTry: 3, spoken: true }],
});

function plan(overrides: Partial<TodayPlanInput> = {}) {
  return buildTodayPlan({
    track: 'DE',
    progress: {},
    completedScenarioIds: [],
    completedUnitIds: [],
    log: {},
    now: NOON,
    ...overrides,
  });
}

describe('F1: taking part is not finishing', () => {
  it('keeps a lesson open after one step, even though today counts as practice', () => {
    const first = getTrackLessons('DE')[0];
    const today = plan({
      progress: { [first.id]: { ...freshFoundationEntry(), step: 1 } },
      log: { [TODAY]: ['lesson:DE'] },
    });
    expect(today.doneCount).toBe(0);
    expect(today.steps[0]).toMatchObject({
      href: `/foundation/${first.id}`,
      action: 'Continue lesson',
      done: false,
    });
    expect(today.steps[0].why).not.toMatch(/review/);
  });

  it('does not count review as done after a single card', () => {
    const progress: FoundationProgress = {
      'de-a1-u1-hallo': {
        ...finished(),
        cards: [
          [1, dayNumberOf(TODAY) - 1],
          [1, dayNumberOf(TODAY) - 1],
        ],
      },
    };
    const log: PracticeLog = Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [ago(i + 1), ['lesson:DE' as const]]),
    );
    const today = plan({ progress, log: { ...log, [TODAY]: ['review:DE'] } });
    const review = today.steps.find((step) => step.kind === 'review');
    expect(review?.done).toBe(false);
    const after = plan({
      progress,
      log: { ...log, [TODAY]: ['review:DE'] },
      activities: { [TODAY]: ['review:DE'] },
    });
    expect(after.steps.find((step) => step.kind === 'review')?.done).toBe(true);
  });
});

describe('F2: one answer to "what next"', () => {
  it('Today and the course highlight agree on a saved starting point', () => {
    const startAt = 'de-a1-u5-order';
    expect(plan({ startAt }).steps[0].href).toBe(`/foundation/${startAt}`);
    expect(nextLesson({}, 'DE', startAt).id).toBe(startAt);
    expect(coursePosition({}, 'DE', startAt).next?.lesson.id).toBe(startAt);
  });

  it('keeps an accepted placement when the learner leaves before starting', () => {
    const startAt = lessonIdFromHref('/foundation/de-a1-u5-order');
    expect(startAt).toBe('de-a1-u5-order');
    // Opening another lesson without moving past its first screen changes nothing.
    const progress = { 'de-a1-u1-hallo': { ...freshFoundationEntry(), step: 0 } };
    expect(findNextLesson(progress, 'DE', startAt)?.lesson.id).toBe(startAt);
  });

  it('resumes the most recently touched session, not the first in the catalogue', () => {
    const progress: FoundationProgress = {
      'de-a1-u1-hallo': { ...freshFoundationEntry(), step: 2, updatedAt: '2026-10-01T09:00:00Z' },
      'de-a1-u2-verbs': { ...freshFoundationEntry(), step: 3, updatedAt: '2026-10-07T09:00:00Z' },
    };
    expect(findNextLesson(progress, 'DE')).toMatchObject({
      reason: 'resume',
      lesson: { id: 'de-a1-u2-verbs' },
    });
  });

  it('still offers lessons skipped by placement once everything after the start is done', () => {
    const lessons = getTrackLessons('DE');
    const start = lessons.findIndex((lesson) => lesson.id === 'de-a1-u5-order');
    const progress = Object.fromEntries(
      lessons.slice(start).map((lesson) => [lesson.id, finished()]),
    );
    expect(findNextLesson(progress, 'DE', 'de-a1-u5-order')?.lesson.id).toBe(lessons[0].id);
  });
});

describe('F3: a ticked item opens what it names', () => {
  it('keeps the finished lesson in today’s session instead of the next one', () => {
    const first = plan();
    const id = getTrackLessons('DE')[0].id;
    expect(first.snapshot.keys).toEqual([`lesson:${id}`]);
    const after = plan({
      progress: { [id]: finished(new Date(NOON - 600_000).toISOString()) },
      session: first.snapshot,
      activities: { [TODAY]: [`lesson:${id}`] },
    });
    expect(after.steps[0]).toMatchObject({ done: true, href: `/foundation/${id}` });
    expect(after.bonus?.href).toBe(`/foundation/${getTrackLessons('DE')[1].id}`);
  });

  it('builds a new session the next day', () => {
    const first = plan();
    const tomorrow = plan({ session: first.snapshot, now: NOON + 86_400_000 });
    expect(tomorrow.snapshot.day).not.toBe(first.snapshot.day);
  });
});

describe('F8: a new language starts as a beginner', () => {
  it('gives first-time Spanish one lesson even after weeks of German', () => {
    const german: PracticeLog = Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        ago(i + 1),
        ['lesson:DE' as const, 'speaking:DE' as const],
      ]),
    );
    const spanish = plan({ track: 'ES', log: german });
    expect(spanish.stage).toBe('warm-up');
    expect(spanish.steps).toHaveLength(1);
    expect(spanish.steps[0].kind).toBe('lesson');
  });
});

describe('G8: the end of the published course', () => {
  it('says the course is finished instead of starting again from lesson one', () => {
    const all = Object.fromEntries(getTrackLessons('ES').map((lesson) => [lesson.id, finished()]));
    expect(findNextLesson(all, 'ES')).toBeNull();
    expect(coursePosition(all, 'ES').next).toBeNull();
  });
});

describe('course structure', () => {
  it('groups German into units first, then the older lessons of each level', () => {
    const units = courseUnits('DE', {});
    expect(units[0]).toMatchObject({ id: 'de-a1-u1', label: 'Unit 1 · Hallo!' });
    expect(units.slice(0, 6).every((unit) => unit.lessons.length === 4)).toBe(true);
    expect(units.some((unit) => unit.id === 'DE-A2-lessons')).toBe(true);
    const total = units.reduce((sum, unit) => sum + unit.lessons.length, 0);
    expect(total).toBe(getTrackLessons('DE').length);
  });

  it('places the next lesson inside its unit', () => {
    const position = coursePosition({ 'de-a1-u1-hallo': finished() }, 'DE');
    expect(position.unit?.id).toBe('de-a1-u1');
    expect(position.lessonNumber).toBe(2);
    expect(position.unit?.done).toBe(1);
  });
});

describe('activity log', () => {
  it('records each activity once a day and forgets old days', () => {
    let log = addActivity({}, 'lesson:a', ago(ACTIVITY_LOG_DAYS + 2));
    log = addActivity(log, 'lesson:b', TODAY);
    expect(addActivity(log, 'lesson:b', TODAY)).toBe(log);
    expect(Object.keys(log)).toEqual([TODAY]);
  });

  it('ignores malformed stored values', () => {
    expect(parseActivityLog(null)).toEqual({});
    expect(
      parseActivityLog({
        [TODAY]: ['lesson:de-a1-u1-hallo', 'review:XX', 'lesson:<script>', 42],
        'not-a-day': ['lesson:x'],
      }),
    ).toEqual({ [TODAY]: ['lesson:de-a1-u1-hallo'] });
  });
});

describe('course levels', () => {
  it('lays each language out from its first level to B2, in course order', () => {
    expect(courseLevels('ES', {}).map((level) => level.level)).toEqual(['A1', 'A2', 'B1', 'B2']);
    expect(courseLevels('DE', {}).map((level) => level.level)).toEqual(['A1', 'A2', 'B1', 'B2']);
    expect(courseLevels('EN', {}).map((level) => level.level)).toEqual(['B1', 'B2', 'C1']);
    // English is B1 to C1: its older A2 lessons are a warm-up inside B1, never labelled A2.
    const english = courseLevels('EN', {});
    expect(english[0].groups[0].label).toBe('Warm-up before B1');
    expect(
      english.flatMap((level) => [level.label, ...level.groups.map((group) => group.label)]).join(),
    ).not.toMatch(/A2/);
    expect(english[2]).toMatchObject({ level: 'C1', lessons: 0, label: 'C1' });
    // The warm-up is in B1 but not B1 content: it does not count towards B1.
    const warmUp = english[0].groups[0].lessons.length;
    const inB1 = english[0].groups.reduce((sum, group) => sum + group.lessons.length, 0);
    expect(english[0].lessons).toBe(inB1 - warmUp);
    const spanish = courseLevels('ES', {});
    // Levels not built yet are listed, empty, so the way to B2 is visible but nothing is claimed.
    expect(spanish.find((level) => level.level === 'B2')?.lessons).toBe(0);
    expect(spanish.find((level) => level.level === 'B2')?.label).toBe('B2');
    const a1 = spanish[0];
    expect(a1.label).toBe('A1 starter');
    expect(a1.note).toMatch(/does not mean you have reached A1/);
    expect(a1.groups.some((group) => group.kind === 'checkpoint')).toBe(true);
    // Checkpoints and older lessons are not counted as units.
    expect(a1.units).toBe(a1.groups.filter((group) => group.kind === 'unit').length);
    const all = courseUnits('ES', {}).reduce((sum, group) => sum + group.lessons.length, 0);
    expect(spanish.reduce((sum, level) => sum + level.lessons, 0)).toBe(all);
  });

  it('opens around you are here: one group before and two after', () => {
    const groups = courseLevels('DE', {})[0].groups;
    expect(groupsAround(groups, groups[5].id).map((group) => group.id)).toEqual(
      groups.slice(4, 8).map((group) => group.id),
    );
    expect(groupsAround(groups, groups[0].id)).toEqual(groups.slice(0, 3));
    expect(groupsAround(groups, 'somewhere-else')).toEqual(groups.slice(0, 3));
  });

  it('always shows the next checkpoint after the units around you', () => {
    const groups = courseLevels('ES', {})[0].groups;
    const shown = groupsAround(groups, groups[0].id);
    expect(shown.slice(0, 3)).toEqual(groups.slice(0, 3));
    expect(shown.at(-1)?.kind).toBe('checkpoint');
  });

  it('counts one way: the words and the bar agree, and covered is said', () => {
    const a1 = courseLevels('ES', {})[0];
    expect(levelProgress(a1)).toMatchObject({ value: 0, text: `0 of ${a1.units} units` });
    const covered = { ...a1, unitsDone: 5, unitsCovered: 5 };
    expect(levelProgress(covered)).toEqual({
      value: 5 / a1.units,
      text: `5 of ${a1.units} units, 5 covered`,
      label: `5 of ${a1.units} units done, 5 covered`,
    });
    expect(levelProgress({ ...a1, reached: true }).text).toBe('A1 reached');
  });
});

describe('levels shown for practice content', () => {
  it('never shows A1 or A2 for English, and keeps other languages as they are', () => {
    expect(contentLevel('EN', 'A1')).toBe('Warm-up');
    expect(contentLevel('EN', 'A2')).toBe('Warm-up');
    expect(contentLevel('EN', 'B1')).toBe('B1');
    expect(contentLevel('ES', 'A1')).toBe('A1');
    expect(contentLevel('DE', 'A2–B2')).toBe('A2–B2');
  });

  it('matches English practice to B1 and up, not the warm-up', () => {
    expect(fittingConversations('EN', 'B1').map((unit) => unit.level)).toEqual(['B1']);
    expect(new Set(fittingScenarios('EN', 'B1').map((item) => item.level))).toEqual(
      new Set(['B1']),
    );
    // German at A1 still gets its A1 talks.
    expect(fittingConversations('DE', 'A1').every((unit) => unit.level === 'A1')).toBe(true);
  });
});
