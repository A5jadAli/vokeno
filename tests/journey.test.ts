import { describe, expect, it } from '@jest/globals';

import { buildTodayPlan, type TodayPlanInput } from '@/features/coaching/daily-plan';
import { getTrackLessons } from '@/features/foundations/catalog';
import { nextLesson } from '@/features/foundations/next';
import { freshFoundationEntry, type FoundationProgress } from '@/features/foundations/progress';
import { dayFromNumber, dayNumberOf, type PracticeLog } from '@/features/habits/practice-log';
import { ACTIVITY_LOG_DAYS, addActivity, parseActivityLog } from '@/features/journey/activity-log';
import {
  courseUnits,
  coursePosition,
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
