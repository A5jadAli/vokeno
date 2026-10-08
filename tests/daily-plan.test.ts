import { describe, expect, it } from '@jest/globals';

import { buildTodayPlan, type TodayPlanInput } from '@/features/coaching/daily-plan';
import { getTrackLessons } from '@/features/foundations/catalog';
import { freshFoundationEntry, type FoundationProgress } from '@/features/foundations/progress';
import { dayFromNumber, dayNumberOf, type PracticeLog } from '@/features/habits/practice-log';
import { listeningScenarios } from '@/features/listening/scenarios';

const NOON = new Date(2026, 9, 7, 12).getTime(); // Wednesday 7 October 2026, local time
const TODAY = '2026-10-07';
const ago = (days: number) => dayFromNumber(dayNumberOf(TODAY) - days);
const activeDays = (count: number, offset = 1): PracticeLog =>
  Object.fromEntries(Array.from({ length: count }, (_, i) => [ago(i + offset), ['lesson']]));

const completed = (dueDay?: number) => ({
  ...freshFoundationEntry(),
  step: 4,
  attempts: [{ at: '2026-10-01T10:00:00.000Z', correctFirstTry: 3, spoken: true }],
  cards: dueDay === undefined ? undefined : [[1, dueDay] as [number, number]],
});

function plan(overrides: Partial<TodayPlanInput> = {}) {
  return buildTodayPlan({
    track: 'ES',
    progress: {},
    completedScenarioIds: [],
    completedUnitIds: [],
    ability: 'new',
    goal: 'everyday',
    log: {},
    now: NOON,
    ...overrides,
  });
}

describe('a brand-new learner', () => {
  it('gets exactly one small step: the first useful Spanish exchange', () => {
    const today = plan();
    expect(today.stage).toBe('warm-up');
    expect(today.steps).toHaveLength(1);
    expect(today.steps[0]).toMatchObject({ kind: 'lesson', href: '/foundation/es-first-words' });
    expect(today.doneCount).toBe(0);
    expect(today.footnote).toMatch(/one step a day/);
  });

  it('is pointed at the right first lesson for English and German too', () => {
    for (const track of ['EN', 'DE'] as const) {
      const today = plan({ track });
      expect(today.steps).toHaveLength(1);
      expect(today.steps[0].kind).toBe('lesson');
    }
  });
});

describe('stages', () => {
  it('grows from one to two to three steps as practice days add up', () => {
    expect(plan({ log: activeDays(3) }).steps).toHaveLength(1);
    expect(plan({ log: activeDays(5) }).steps).toHaveLength(2);
    expect(plan({ log: activeDays(15) }).steps).toHaveLength(3);
  });

  it('never repeats a kind of step on the same day', () => {
    for (const days of [0, 5, 15, 40]) {
      const kinds = plan({ log: activeDays(days) }).steps.map((step) => step.kind);
      expect(new Set(kinds).size).toBe(kinds.length);
    }
  });

  it('mixes a lesson with listening or speaking when nothing is due for review', () => {
    const kinds = plan({ log: activeDays(15) }).steps.map((step) => step.kind);
    expect(kinds).toContain('lesson');
    expect(kinds.some((kind) => kind === 'listening' || kind === 'speaking')).toBe(true);
  });

  it('alternates listening and speaking from one day to the next', () => {
    const first = plan({ log: activeDays(5) }).steps[1].kind;
    const next = plan({ log: activeDays(5, 0), now: NOON + 86_400_000 }).steps.find(
      (step) => step.kind !== 'lesson',
    )?.kind;
    expect(['listening', 'speaking']).toContain(first);
    expect(next).not.toBe(first);
  });
});

describe('review', () => {
  const today = dayNumberOf(TODAY);
  const progress: FoundationProgress = Object.fromEntries(
    getTrackLessons('ES')
      .slice(0, 12)
      .map((lesson) => [lesson.id, completed(today - 1)]),
  );

  it('is capped, and says the rest can wait', () => {
    const review = plan({ progress, log: activeDays(5) }).steps.find(
      (step) => step.kind === 'review',
    );
    expect(review?.title).toBe('Review 8 phrases');
    expect(review?.why).toMatch(/other 4 can wait/);
  });

  it('comes first after a break, as a gentle restart', () => {
    const today = plan({ progress, log: activeDays(20, 6) });
    expect(today.returning).toBe(true);
    expect(today.steps).toHaveLength(1);
    expect(today.steps[0].kind).toBe('review');
    expect(today.footnote).toMatch(/Welcome back/);
  });

  it('uses singular wording for a single phrase', () => {
    const one: FoundationProgress = { 'es-first-words': completed(today) };
    const review = plan({ progress: one, log: activeDays(5) }).steps.find(
      (step) => step.kind === 'review',
    );
    expect(review?.title).toBe('Review 1 phrase');
  });
});

describe('lessons', () => {
  it('offers to finish an unfinished lesson before starting a new one', () => {
    const progress: FoundationProgress = {
      'es-first-words': completed(),
      'es-names': { ...freshFoundationEntry(), step: 2 },
    };
    const step = plan({ progress }).steps[0];
    expect(step).toMatchObject({
      title: 'Finish Meet someone',
      action: 'Continue lesson',
      href: '/foundation/es-names',
    });
  });

  it('continues after an intermediate starting point instead of lesson one', () => {
    const lessons = getTrackLessons('ES');
    const cafe = lessons.findIndex((lesson) => lesson.id === 'es-cafe');
    const step = plan({ progress: { 'es-cafe': completed() }, ability: 'basics' }).steps[0];
    expect(step.href).toBe(`/foundation/${lessons[cafe + 1].id}`);
  });
});

describe('completing the day', () => {
  it('ticks off what was practised today and keeps the step visible', () => {
    const log: PracticeLog = { ...activeDays(5), [TODAY]: ['lesson:ES'] };
    const today = plan({ log });
    const lesson = today.steps.find((step) => step.kind === 'lesson');
    expect(lesson?.done).toBe(true);
    expect(today.doneCount).toBe(1);
    expect(today.bonus).toBeUndefined();
  });

  it('offers an optional bonus only once every step is done', () => {
    const log: PracticeLog = { [TODAY]: ['lesson:ES'] };
    const today = plan({ log });
    expect(today.doneCount).toBe(today.steps.length);
    expect(today.bonus).toBeDefined();
    expect(today.bonus?.done).toBe(false);
  });

  it('offers the next lesson as the bonus after today’s lesson', () => {
    const progress: FoundationProgress = { 'es-first-words': completed() };
    const today = plan({ progress, log: { [TODAY]: ['lesson:ES'] } });
    expect(today.steps[0]).toMatchObject({ kind: 'lesson', done: true });
    expect(today.bonus).toMatchObject({ kind: 'lesson', href: '/foundation/es-names' });
  });

  it('offers practice as the bonus once the guided path is finished', () => {
    const allDone: FoundationProgress = Object.fromEntries(
      getTrackLessons('ES').map((lesson) => [lesson.id, completed()]),
    );
    const today = plan({ progress: allDone, log: { [TODAY]: ['listening:ES', 'speaking:ES'] } });
    expect(today.doneCount).toBe(today.steps.length);
    expect(today.bonus?.kind === 'lesson').toBe(false);
  });
});

describe('after the guided path', () => {
  const allDone: FoundationProgress = Object.fromEntries(
    getTrackLessons('ES').map((lesson) => [lesson.id, completed()]),
  );

  it('switches to listening and speaking instead of an empty plan', () => {
    for (const days of [0, 5, 15]) {
      const today = plan({ progress: allDone, log: activeDays(days) });
      expect(today.steps.length).toBeGreaterThan(0);
      expect(today.steps.every((step) => step.kind !== 'lesson')).toBe(true);
      expect(today.completedLessons).toBe(today.totalLessons);
    }
  });

  it('keeps suggesting dialogues once every one has been heard', () => {
    const everyDialogue = listeningScenarios
      .filter((scenario) => scenario.track === 'ES')
      .map((scenario) => scenario.id);
    const today = plan({
      progress: allDone,
      completedScenarioIds: everyDialogue,
      log: activeDays(5),
    });
    const listening = today.steps.find((step) => step.kind === 'listening');
    expect(listening?.href).toMatch(/^\/lesson\/es-/);
    expect(listening?.why).toMatch(/Listen again/);
  });
});

describe('level matching', () => {
  it('suggests A1 dialogues to an A1 learner, not A2 ones', () => {
    const today = plan({ log: activeDays(15) });
    const listening = today.steps.find((step) => step.kind === 'listening');
    if (listening) {
      const id = listening.href.replace('/lesson/', '');
      expect(listeningScenarios.find((scenario) => scenario.id === id)?.level).toBe('A1');
    }
    const speaking = today.steps.find((step) => step.kind === 'speaking');
    if (speaking) expect(speaking.href).toMatch(/unit=es-a1-/);
  });
});

describe('the lesson step', () => {
  it('always opens a guided lesson, whatever the starting point and goal', () => {
    for (const track of ['EN', 'DE', 'ES'] as const)
      for (const ability of ['new', 'basics', 'conversational'] as const)
        for (const goal of ['everyday', 'work-study', 'ielts-academic', 'ielts-general'] as const) {
          const lesson = plan({ track, ability, goal }).steps.find(
            (step) => step.kind === 'lesson',
          );
          expect(lesson?.href).toMatch(/^\/foundation\//);
        }
  });
});

describe('one language at a time', () => {
  it('does not tick a Spanish step for German practice', () => {
    const today = plan({ log: { [TODAY]: ['lesson:DE', 'review:DE'] } });
    expect(today.steps.every((step) => !step.done)).toBe(true);
  });

  it('ticks the Spanish lesson for Spanish practice', () => {
    const today = plan({ log: { [TODAY]: ['lesson:ES'] } });
    expect(today.steps.find((step) => step.kind === 'lesson')?.done).toBe(true);
  });
});
