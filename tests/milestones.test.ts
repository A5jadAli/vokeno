import { describe, expect, it } from '@jest/globals';

import { getTrackLessons } from '@/features/foundations/catalog';
import { freshFoundationEntry, type FoundationProgress } from '@/features/foundations/progress';
import { levelMilestone } from '@/features/habits/milestones';

const NOW = new Date(2026, 9, 7, 18).getTime();
const done = (at: number) => ({
  ...freshFoundationEntry(),
  step: 4,
  attempts: [{ at: new Date(at).toISOString(), correctFirstTry: 3, spoken: true }],
});
const a1 = getTrackLessons('ES').filter((lesson) => lesson.level === 'A1');
const a2 = getTrackLessons('ES').filter((lesson) => lesson.level === 'A2');
const finishedA1 = (lastAt: number): FoundationProgress =>
  Object.fromEntries(
    a1.map((lesson, index) => [
      lesson.id,
      done(index === a1.length - 1 ? lastAt : lastAt - 86_400_000 * 3),
    ]),
  );

describe('level milestones', () => {
  it('celebrates the day a level is finished, with what the learner can now do', () => {
    const milestone = levelMilestone('ES', finishedA1(NOW - 60_000), NOW);
    expect(milestone?.level).toBe('A1');
    expect(milestone?.nextLevel).toBe('A2');
    expect(milestone?.canDo).toHaveLength(4);
    expect(milestone?.canDo).toContain(a1.at(-1)!.outcome);
  });

  it('does not celebrate an unfinished level', () => {
    const progress = finishedA1(NOW);
    delete progress[a1[3].id];
    expect(levelMilestone('ES', progress, NOW)).toBeNull();
  });

  it('stops celebrating the next day', () => {
    expect(levelMilestone('ES', finishedA1(NOW), NOW + 86_400_000)).toBeNull();
  });

  it('steps aside once the next level has started', () => {
    const progress = { ...finishedA1(NOW), [a2[0].id]: { ...freshFoundationEntry(), step: 1 } };
    expect(levelMilestone('ES', progress, NOW)).toBeNull();
  });

  it('celebrates the final level with no next level', () => {
    const all: FoundationProgress = Object.fromEntries(
      getTrackLessons('ES').map((lesson) => [lesson.id, done(NOW)]),
    );
    const milestone = levelMilestone('ES', all, NOW);
    // A1 was also finished today but A2 has started, so the newest level wins.
    expect(milestone?.level).toBe('A2');
    expect(milestone?.nextLevel).toBeUndefined();
  });

  it('ignores malformed timestamps', () => {
    const progress = finishedA1(NOW);
    progress[a1[0].id] = {
      ...progress[a1[0].id],
      attempts: [{ at: 'not a date', correctFirstTry: 3, spoken: true }],
    };
    // The latest valid timestamp still decides; a malformed one is not "today".
    expect(levelMilestone('ES', progress, NOW)?.level).toBe('A1');
  });

  it('returns nothing for a learner with no progress', () => {
    expect(levelMilestone('DE', {}, NOW)).toBeNull();
  });
});
