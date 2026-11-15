import { describe, expect, it } from '@jest/globals';

import {
  STANDARD,
  knownBefore,
  renderUnit,
  sessionMetrics,
  taughtBefore,
  unitIds,
  unitProblems,
  unitSessions,
} from '../scripts/content/lib';

/**
 * Units written before the content standard (15 November 2026). They are live and miss it; each
 * leaves this list when it is repaired. Nothing may ever be added: a new unit meets the standard.
 */
const LEGACY = new Set([
  ...Array.from({ length: 20 }, (_, index) => `de-a1-u${index + 1}`),
  ...Array.from({ length: 5 }, (_, index) => `es-a1-u${index + 1}`),
  ...Array.from({ length: 3 }, (_, index) => `en-a1-u${index + 1}`),
]);

describe('the content standard', () => {
  it('holds every unit outside the legacy list to the standard', () => {
    const misses = unitIds()
      .filter((id) => !LEGACY.has(id))
      .flatMap((id) => unitProblems(unitSessions(id)));
    expect(misses).toEqual([]);
  });

  it('keeps the legacy list honest: every entry exists and still misses', () => {
    for (const id of LEGACY)
      expect([id, unitProblems(unitSessions(id)).length > 0]).toEqual([id, true]);
  });

  it('measures a session: new items, the practice mix and what comes back', () => {
    const [words, grammar] = unitSessions('es-a1-u6').map(sessionMetrics);
    expect(words).toMatchObject({ id: 'es-a1-u6-words', newItems: 7, marked: 6, produced: 2 });
    expect(words.chooseShare).toBe(0.5);
    expect(words.recycled).toBeGreaterThanOrEqual(STANDARD.minRecycled);
    expect(grammar).toMatchObject({ chooseShare: 0.5, produced: 3 });
  });

  it('names each miss with its session and the limit', () => {
    expect(unitProblems(unitSessions('de-a1-u1'))).toEqual(
      expect.arrayContaining([
        'de-a1-u1-hallo: teaches 15 new items (limit 8)',
        expect.stringMatching(/^de-a1-u1: \d+% of marked steps are typed, built or a form/),
      ]),
    );
    // The first unit of a course has nothing earlier to bring back.
    expect(unitProblems(unitSessions('de-a1-u1')).join(' ')).not.toMatch(/earlier-taught/);
    expect(unitProblems(unitSessions('no-such-unit'))).toEqual(['No such unit on a course path.']);
  });

  it('lets a checkpoint test without teaching', () => {
    expect(unitProblems(unitSessions('es-a1-cp1'))).toEqual([]);
  });
});

describe('the review script for a unit', () => {
  const script = renderUnit(unitSessions('es-a1-u6'));

  it('gives every step a reference and shows the answer key', () => {
    expect(script).toMatch(/^ES A1 · Unit 6: /);
    expect(script).toContain('[1.1] Scene: ');
    expect(script).toMatch(/\[1\.\d+\] Type: Write “an orange juice” in Spanish\./);
    expect(script).toContain('Accepted: "un jugo de naranja", "un zumo de naranja"');
  });

  it('includes the retake version of a checkpoint under its own references', () => {
    expect(renderUnit(unitSessions('es-a1-cp1'))).toMatch(/\[1R\.1\] /);
  });

  it('tells reviewers what was taught earlier, rule tables included', () => {
    const [first] = unitSessions('es-a1-u6');
    expect(taughtBefore(first)).toContain('mi hermana');
    expect(taughtBefore(first)).not.toContain('noventa');
    expect(knownBefore(first)).toContain('noventa');
  });
});
