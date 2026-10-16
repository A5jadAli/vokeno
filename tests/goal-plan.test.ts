import { beforeEach, describe, expect, it } from '@jest/globals';

import { buildTodayPlan } from '@/features/coaching/daily-plan';
import { buildGoalPlan, goalLevels, type GoalInput } from '@/features/coaching/goal-plan';
import { useCoachingStore } from '@/features/coaching/store';
import { getTrackLessons } from '@/features/foundations/catalog';
import { freshFoundationEntry, type FoundationProgress } from '@/features/foundations/progress';
import { dayFromNumber, dayNumberOf, type PracticeLog } from '@/features/habits/practice-log';

const NOON = new Date(2026, 9, 7, 12).getTime(); // Wednesday 7 October 2026, local time
const TODAY = '2026-10-07';
const inDays = (days: number) => dayFromNumber(dayNumberOf(TODAY) + days);
const finishedOn = (day: string) => ({
  ...freshFoundationEntry(),
  step: 4,
  attempts: [{ at: new Date(`${day}T12:00:00`).toISOString(), correctFirstTry: 3, spoken: true }],
});
const germanA1 = getTrackLessons('DE').filter((lesson) => lesson.level === 'A1');

const goal = (overrides: Partial<GoalInput> = {}) =>
  buildGoalPlan({
    track: 'DE',
    progress: {},
    date: inDays(70),
    level: 'A1',
    since: TODAY,
    now: NOON,
    ...overrides,
  });

describe('the goal plan', () => {
  it('is empty without a date', () => {
    expect(goal({ date: null })).toBeNull();
    expect(goal({ date: 'soon' })).toBeNull();
  });

  it('counts every A1 lesson left and keeps the last week for review', () => {
    const plan = goal()!;
    expect(plan.lessonsLeft).toBe(germanA1.length);
    expect(plan.unitsLeft).toBeLessThan(plan.lessonsLeft);
    expect(plan.perWeek).toBe(Math.ceil((germanA1.length * 7) / 63));
    expect(plan.week).toBe(1);
    expect(plan.weeks).toBe(10);
  });

  it('calls a fresh, doable goal on track and adds lessons to today when the pace needs it', () => {
    const plan = goal()!;
    expect(plan.status).toBe('on-track');
    expect(plan.lessonsToday).toBe(Math.ceil(plan.perWeek / 6));
    expect(goal({ date: inDays(300) })!.lessonsToday).toBe(1);
  });

  it('counts the weeks from the day the goal was set', () => {
    const plan = goal({ since: inDays(-14), date: inDays(70) })!;
    expect(plan.week).toBe(3);
    expect(plan.weeks).toBe(12);
    expect(goal({ since: undefined })!.week).toBeNull();
  });

  it('says behind once a week has passed without enough lessons', () => {
    expect(goal({ since: inDays(-10) })!.status).toBe('behind');
  });

  it('says on track when the recent pace is enough', () => {
    const progress: FoundationProgress = Object.fromEntries(
      germanA1.slice(0, 20).map((lesson, index) => [lesson.id, finishedOn(inDays(-(index % 13)))]),
    );
    expect(goal({ progress, since: inDays(-14), date: inDays(150) })!.status).toBe('on-track');
  });

  it('is honest when the date is too close', () => {
    expect(goal({ date: inDays(5) })!.status).toBe('tight');
  });

  it('says the level is done when every lesson is finished', () => {
    const progress = Object.fromEntries(germanA1.map((lesson) => [lesson.id, finishedOn(TODAY)]));
    const plan = goal({ progress })!;
    expect(plan.status).toBe('ready');
    expect(plan.lessonsToday).toBe(1);
  });

  it('handles the day itself and a date that has passed', () => {
    expect(goal({ date: TODAY })!.status).toBe('today');
    expect(goal({ date: inDays(-1) })!.status).toBe('passed');
  });

  it('counts this week from Monday', () => {
    const [first, second] = germanA1;
    const progress = {
      [first.id]: finishedOn('2026-10-05'),
      [second.id]: finishedOn('2026-10-04'),
    };
    expect(goal({ progress })!.doneThisWeek).toBe(1);
  });

  it('offers only levels the language has', () => {
    expect(goalLevels('DE')[0]).toBe('A1');
    expect(goalLevels('EN')).not.toContain('A1');
  });
});

describe('today with a goal', () => {
  const started: FoundationProgress = { [germanA1[0].id]: finishedOn('2026-10-01') };
  const log: PracticeLog = Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [inDays(-(i + 1)), ['lesson:DE' as const]]),
  );
  const plan = (lessonsToday?: number, progress = started) =>
    buildTodayPlan({
      track: 'DE',
      progress,
      completedScenarioIds: [],
      completedUnitIds: [],
      log,
      lessonsToday,
      now: NOON,
    });

  it('holds two lessons in a row when the date needs them', () => {
    const lessons = plan(2).steps.filter((step) => step.kind === 'lesson');
    expect(lessons.map((step) => step.href)).toEqual([
      `/foundation/${germanA1[1].id}`,
      `/foundation/${germanA1[2].id}`,
    ]);
  });

  it('keeps one lesson without a goal, and on the very first day', () => {
    expect(plan().steps.filter((step) => step.kind === 'lesson')).toHaveLength(1);
    expect(plan(3, {}).steps).toHaveLength(1);
  });
});

describe('saving a goal', () => {
  beforeEach(() => useCoachingStore.getState().resetCoaching());

  it('stores the level and the day it was set, and keeps that day when saved again', () => {
    useCoachingStore.getState().setTestDate('DE', '2026-12-16', 'A1');
    const first = useCoachingStore.getState().preferences.DE;
    expect(first.goalLevel).toBe('A1');
    expect(first.goalSince).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    useCoachingStore.setState((state) => ({
      preferences: {
        ...state.preferences,
        DE: { ...state.preferences.DE, goalSince: '2026-10-01' },
      },
    }));
    useCoachingStore.getState().setTestDate('DE', '2026-12-16', 'A1');
    expect(useCoachingStore.getState().preferences.DE.goalSince).toBe('2026-10-01');
    useCoachingStore.getState().setTestDate('DE', '2027-01-20', 'A1');
    expect(useCoachingStore.getState().preferences.DE.goalSince).not.toBe('2026-10-01');
    useCoachingStore.getState().setTestDate('DE', null);
    expect(useCoachingStore.getState().preferences.DE.goalLevel).toBeUndefined();
  });
});
