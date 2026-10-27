import { describe, expect, it } from '@jest/globals';

import { buildTodayPlan } from '@/features/coaching/daily-plan';
import {
  classicLessons,
  getTrackLessons,
  gradeFoundationWriting,
} from '@/features/foundations/catalog';
import { freshFoundationEntry } from '@/features/foundations/progress';
import { fittingConversations, fittingScenarios } from '@/features/journey/practice';

const english = (id: string) => classicLessons.find((lesson) => lesson.id === id)!;

describe('English review regressions', () => {
  it('puts a pronoun between turn and down, or uses a noun after down', () => {
    const exercise = english('en-phrasal').checks[1];
    const sentence = exercise.prompt.replace('___', exercise.options[exercise.answer]);
    expect(sentence).not.toContain('turned down it');
    expect(sentence).toMatch(/turned (it down|down the (job )?offer)/);
  });

  it.each([
    ['en-workplace', 'Could you review the document when you get a chance?'],
    ['en-small-talk', 'Are you doing anything this weekend?'],
  ])('accepts a valid reply to %s', (id, answer) => {
    expect(gradeFoundationWriting(english(id), answer).status).toBe('correct');
    expect(gradeFoundationWriting(english(id), answer.toUpperCase().replace('?', '')).status).toBe(
      'correct',
    );
  });

  it.each([
    ['en-workplace', 'Review the document right now.'],
    ['en-small-talk', 'Did you do anything last weekend?'],
  ])('still rejects a reply with the wrong meaning in %s', (id, answer) => {
    expect(gradeFoundationWriting(english(id), answer).status).toBe('wrong');
  });

  it.each(['EN', 'DE', 'ES'] as const)(
    'continues at the published %s level when its path ends',
    (track) => {
      const lessons = getTrackLessons(track);
      const lastLevel = lessons.at(-1)!.level;
      const progress = Object.fromEntries(
        lessons.map((lesson) => [
          lesson.id,
          {
            ...freshFoundationEntry(),
            attempts: [{ at: '2026-10-20T09:00:00Z', correctFirstTry: 3, spoken: true }],
          },
        ]),
      );
      const now = Date.parse('2026-10-27T09:00:00Z');
      const plan = buildTodayPlan({
        track,
        progress,
        completedScenarioIds: [],
        completedUnitIds: [],
        log: {},
        now,
      });
      expect(plan.courseFinished).toBe(true);
      const expected = [
        ...fittingConversations(track, lastLevel).map((unit) => `speaking:${unit.id}`),
        ...fittingScenarios(track, lastLevel).map((scene) => `listening:${scene.id}`),
      ];
      expect(plan.steps.length).toBeGreaterThan(0);
      for (const step of plan.steps) expect(expected).toContain(step.key);
      if (track === 'EN') expect(plan.snapshot.keys).not.toContain('speaking:en-a1-first-contact');
    },
  );
});
