import { describe, expect, it } from '@jest/globals';

import { buildTodayPlan, type TodayPlanInput } from '@/features/coaching/daily-plan';
import { getTrackLessons } from '@/features/foundations/catalog';
import { freshFoundationEntry, type FoundationProgress } from '@/features/foundations/progress';
import { dayFromNumber, dayNumberOf, type PracticeLog } from '@/features/habits/practice-log';
import type { LanguageTrack } from '@/features/language/config';
import { listeningScenarios } from '@/features/listening/scenarios';

const NOON = new Date(2026, 9, 7, 12).getTime(); // Wednesday 7 October 2026, local time
const TODAY = '2026-10-07';
const ago = (days: number) => dayFromNumber(dayNumberOf(TODAY) - days);
const activeDays = (count: number, offset = 1, track: LanguageTrack = 'ES'): PracticeLog =>
  Object.fromEntries(
    Array.from({ length: count }, (_, i) => [ago(i + offset), [`lesson:${track}` as const]]),
  );

const completed = (dueDay?: number, at = '2026-10-01T10:00:00.000Z') => ({
  ...freshFoundationEntry(),
  step: 4,
  attempts: [{ at, correctFirstTry: 3, spoken: true }],
  cards: dueDay === undefined ? undefined : [[1, dueDay] as [number, number]],
});
/** A learner who has finished the first Spanish lesson, so sessions can grow. */
const started: FoundationProgress = { 'es-first-words': completed() };

function plan(overrides: Partial<TodayPlanInput> = {}) {
  return buildTodayPlan({
    track: 'ES',
    progress: {},
    completedScenarioIds: [],
    completedUnitIds: [],
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

  it('is pointed at the first lesson for English and German too', () => {
    for (const track of ['EN', 'DE'] as const) {
      const today = plan({ track });
      expect(today.steps).toHaveLength(1);
      expect(today.steps[0].href).toBe(`/foundation/${getTrackLessons(track)[0].id}`);
    }
  });

  it('always starts with a lesson until one is finished, however many days they practised', () => {
    const today = plan({ log: activeDays(15) });
    expect(today.steps).toHaveLength(1);
    expect(today.steps[0].kind).toBe('lesson');
  });
});

describe('stages', () => {
  it('grows from one to two to three steps as practice days add up', () => {
    expect(plan({ progress: started, log: activeDays(3) }).steps).toHaveLength(1);
    expect(plan({ progress: started, log: activeDays(5) }).steps).toHaveLength(2);
    expect(plan({ progress: started, log: activeDays(15) }).steps).toHaveLength(3);
  });

  it('never repeats a kind of step on the same day', () => {
    for (const days of [0, 5, 15, 40]) {
      const kinds = plan({ progress: started, log: activeDays(days) }).steps.map(
        (step) => step.kind,
      );
      expect(new Set(kinds).size).toBe(kinds.length);
    }
  });

  it('mixes a lesson with listening or speaking when nothing is due for review', () => {
    const kinds = plan({ progress: started, log: activeDays(15) }).steps.map((step) => step.kind);
    expect(kinds).toContain('lesson');
    expect(kinds.some((kind) => kind === 'listening' || kind === 'speaking')).toBe(true);
  });

  it('alternates listening and speaking from one day to the next', () => {
    const first = plan({ progress: started, log: activeDays(5) }).steps[1].kind;
    const next = plan({
      progress: started,
      log: activeDays(5, 0),
      now: NOON + 86_400_000,
    }).steps.find((step) => step.kind !== 'lesson')?.kind;
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
    expect(plan({ progress }).steps[0]).toMatchObject({
      title: 'Meet someone',
      action: 'Continue lesson',
      href: '/foundation/es-names',
    });
  });

  it('continues from the chosen starting point instead of lesson one', () => {
    const lessons = getTrackLessons('ES');
    const cafe = lessons.findIndex((lesson) => lesson.id === 'es-cafe');
    expect(plan({ startAt: 'es-cafe' }).steps[0].href).toBe('/foundation/es-cafe');
    const step = plan({ progress: { 'es-cafe': completed() }, startAt: 'es-cafe' }).steps[0];
    expect(step.href).toBe(`/foundation/${lessons[cafe + 1].id}`);
  });
});

describe('completing the day', () => {
  const session = { day: TODAY, keys: ['lesson:es-first-words' as const] };
  const finishedToday: FoundationProgress = {
    'es-first-words': completed(undefined, new Date(NOON - 3_600_000).toISOString()),
  };

  it('ticks the lesson that was finished and keeps it in place', () => {
    const today = plan({ progress: finishedToday, session });
    expect(today.steps[0]).toMatchObject({
      kind: 'lesson',
      done: true,
      href: '/foundation/es-first-words',
    });
    expect(today.doneCount).toBe(1);
  });

  it('offers the next lesson as an optional extra once every step is done', () => {
    const today = plan({ progress: finishedToday, session });
    expect(today.bonus).toMatchObject({ kind: 'lesson', href: '/foundation/es-names' });
    expect(today.bonus?.done).toBe(false);
  });

  it('offers practice as the extra once the guided path is finished', () => {
    const allDone: FoundationProgress = Object.fromEntries(
      getTrackLessons('ES').map((lesson) => [lesson.id, completed()]),
    );
    const first = plan({ progress: allDone });
    const today = plan({
      progress: allDone,
      session: first.snapshot,
      activities: { [TODAY]: first.snapshot.keys },
    });
    expect(today.doneCount).toBe(today.steps.length);
    expect(today.bonus?.kind === 'lesson').toBe(false);
  });
});

describe('after the guided path', () => {
  const allDone: FoundationProgress = Object.fromEntries(
    getTrackLessons('ES').map((lesson) => [lesson.id, completed()]),
  );

  it('switches to listening and speaking, and says the course is finished', () => {
    for (const days of [0, 5, 15]) {
      const today = plan({ progress: allDone, log: activeDays(days) });
      expect(today.steps.length).toBeGreaterThan(0);
      expect(today.steps.every((step) => step.kind !== 'lesson')).toBe(true);
      expect(today.courseFinished).toBe(true);
      expect(today.position.finishedLessons).toBe(today.position.totalLessons);
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
    expect(today.steps.find((step) => step.kind === 'listening')?.href).toMatch(/^\/lesson\/es-/);
  });
});

describe('level matching', () => {
  it('suggests A1 dialogues to an A1 learner, not A2 ones', () => {
    const today = plan({ progress: started, log: activeDays(15) });
    const listening = today.steps.find((step) => step.kind === 'listening');
    if (listening) {
      const id = listening.href.replace('/lesson/', '');
      expect(listeningScenarios.find((scenario) => scenario.id === id)?.level).toBe('A1');
    }
    const speaking = today.steps.find((step) => step.kind === 'speaking');
    if (speaking) expect(speaking.href).toMatch(/unit=es-a1-/);
  });
});

describe('one language at a time', () => {
  it('does not tick a Spanish step for German activity', () => {
    const today = plan({
      activities: { [TODAY]: ['lesson:de-a1-u1-hallo', 'review:DE'] },
      log: { [TODAY]: ['lesson:DE', 'review:DE'] },
    });
    expect(today.steps.every((step) => !step.done)).toBe(true);
  });

  it('ticks the Spanish lesson for the Spanish lesson finished', () => {
    const today = plan({ activities: { [TODAY]: ['lesson:es-first-words'] } });
    expect(today.steps.find((step) => step.kind === 'lesson')?.done).toBe(true);
  });
});
