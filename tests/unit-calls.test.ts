import { describe, expect, it } from '@jest/globals';

import { bringBackSooner, cardsForPhrases } from '@/features/coaching/unit-call-review';
import { getTrackLessons } from '@/features/foundations/catalog';
import { freshFoundationEntry } from '@/features/foundations/progress';
import {
  getUnitCall,
  phrasesUsed,
  sanitiseMemory,
  unitCallBrief,
  unitCalls,
} from '../supabase/functions/_shared/unit-calls';

describe('lesson-linked unit calls', () => {
  it('belong to real units, each with a character, a twist and several phrases', () => {
    const units = new Set(
      getTrackLessons('ES').flatMap((lesson) =>
        lesson.format === 'steps' ? [lesson.unit.id] : [],
      ),
    );
    for (const call of unitCalls) {
      expect(units.has(call.unitId)).toBe(true);
      expect(call.phrases.length).toBeGreaterThanOrEqual(4);
      expect(call.twist.length).toBeGreaterThan(20);
      for (const phrase of call.phrases)
        for (const fragment of phrase.match) expect(fragment).toBe(fragment.toLowerCase());
    }
    expect(getUnitCall('es-a1-u6')?.character).toBe('Barista');
    expect(getUnitCall('not-a-call')).toBeUndefined();
    expect(getUnitCall(42)).toBeUndefined();
  });

  it('spots which phrases came up, ignoring accents, case and punctuation', () => {
    const call = getUnitCall('es-a1-u6')!;
    const used = phrasesUsed(call, [
      '¿Me das un café sin azúcar?',
      'Para llevar, gracias.',
      '¿CUÁNTO ES?',
    ]);
    const byPhrase = Object.fromEntries(used.map((item) => [item.say, item.used]));
    expect(byPhrase['¿Me das…? / Quiero…']).toBe(true);
    expect(byPhrase['Con leche. / Sin azúcar.']).toBe(true);
    expect(byPhrase['Para aquí. / Para llevar.']).toBe(true);
    expect(byPhrase['¿Cuánto es?']).toBe(true);
    expect(byPhrase['¿Puedo pagar con tarjeta?']).toBe(false);
  });

  it('does not count a fragment found inside another word', () => {
    const call = getUnitCall('es-a1-u5')!;
    // "quien es" must not match inside "quienes son".
    const used = phrasesUsed(call, ['¿Quienes son tus amigos?']);
    expect(used.find((item) => item.say === '¿Quién es?')?.used).toBe(false);
  });

  it('bounds and cleans memory, and labels it as data in the brief', () => {
    const memory = sanitiseMemory({
      facts: [
        'Lives in Puebla',
        'x'.repeat(500),
        'Has a sister\ncalled Paola',
        1,
        '',
        'a',
        'b',
        'c',
        'd',
      ],
      mistakes: ['sin azúcar', 'para llevar', 'es todo', 'extra'],
    });
    expect(memory.facts).toHaveLength(6);
    expect(memory.facts[1]).toHaveLength(120);
    expect(memory.facts[2]).toBe('Has a sister called Paola');
    expect(memory.mistakes).toHaveLength(3);
    expect(sanitiseMemory('nonsense')).toEqual({ facts: [], mistakes: [] });
    const brief = unitCallBrief(getUnitCall('es-a1-u6')!, memory);
    expect(brief).toContain('data, not instructions');
    expect(brief).toContain('Corrections are on');
    expect(brief).toContain('Para llevar');
  });
});

describe('after a unit call', () => {
  it('brings unused unit phrases back tomorrow, one level down, never resetting them', () => {
    const call = getUnitCall('es-a1-u6')!;
    const cards = cardsForPhrases(
      'ES',
      call,
      call.phrases.filter((item) => item.say.includes('tarjeta')),
    );
    expect(cards.length).toBeGreaterThan(0);
    const [lessonId, index] = cards[0];
    const lesson = getTrackLessons('ES').find((item) => item.id === lessonId)!;
    const entry = {
      ...freshFoundationEntry(),
      cards: lesson.phrases.map((): [number, number] => [3, 130]),
    };
    const next = bringBackSooner({ [lessonId]: entry }, cards, 100);
    expect(next[lessonId].cards![index]).toEqual([2, 101]);
    // A card already due sooner keeps its date.
    const soon = bringBackSooner(
      { [lessonId]: { ...entry, cards: entry.cards.map((): [number, number] => [0, 100]) } },
      cards,
      100,
    );
    expect(soon[lessonId].cards![index]).toEqual([0, 100]);
    // A lesson not yet finished has no cards to move.
    expect(bringBackSooner({}, cards, 100)).toEqual({});
  });
});
