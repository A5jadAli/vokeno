import { readFileSync } from 'node:fs';

import { describe, expect, it } from '@jest/globals';

import { curriculumUnits } from '@/features/curriculum/catalog';
import { foundationLessons, type StepLesson } from '@/features/foundations/catalog';
import {
  contentVersion,
  freshFoundationEntry,
  parseFoundationProgress,
  phraseKey,
  type FoundationEntry,
} from '@/features/foundations/progress';
import { finalStep, gradedCount } from '@/features/foundations/types';
import { listeningScenarios } from '@/features/listening/scenarios';
import { dueCards, seedCards } from '@/features/review/schedule';

const lesson = foundationLessons.find(
  (item): item is StepLesson => item.id === 'de-a1-u1-hallo' && item.format === 'steps',
)!;
const keys = lesson.phrases.map((phrase) => phraseKey(phrase.target));
const parse = (entry: Partial<FoundationEntry>) =>
  parseFoundationProgress({ [lesson.id]: { ...freshFoundationEntry(), ...entry } })[lesson.id];

describe('review cards follow their phrases', () => {
  it('re-matches cards when phrases were reordered', () => {
    // Saved when the first three phrases were in the order 3, 1, 2.
    const parsed = parse({
      cards: [
        [3, 300],
        [1, 100],
        [2, 200],
      ],
      cardKeys: [keys[2], keys[0], keys[1]],
    });
    expect(parsed.cards?.slice(0, 3)).toEqual([
      [1, 100],
      [2, 200],
      [3, 300],
    ]);
    expect(parsed.cardKeys?.slice(0, 3)).toEqual(keys.slice(0, 3));
  });

  it('drops the card of a removed phrase and leaves a gap for a new one', () => {
    const parsed = parse({
      cards: [
        [1, 100],
        [4, 400],
        [3, 300],
      ],
      cardKeys: [keys[0], 'gone123', keys[2]],
    });
    expect(parsed.cards?.slice(0, 3)).toEqual([[1, 100], null, [3, 300]]);
    // Finishing the lesson again gives the new phrase a card and keeps the others.
    const seeded = seedCards(lesson, parsed, 50);
    expect(seeded.cards[0]).toEqual([1, 100]);
    expect(seeded.cards[1]).toEqual([0, 51]);
    expect(seeded.cardKeys).toEqual(keys);
  });

  it('treats older progress without labels as being in phrase order', () => {
    const parsed = parse({ cards: [[2, 200]] });
    expect(parsed.cards).toEqual([[2, 200]]);
    expect(parsed.cardKeys).toEqual([keys[0]]);
  });

  it('never schedules an empty gap', () => {
    const parsed = parse({ cards: [null, [1, 10]], cardKeys: [keys[0], keys[1]] });
    const due = dueCards({ [lesson.id]: parsed }, 'DE', 20);
    expect(due.map((card) => card.phraseIndex)).toEqual([1]);
  });
});

describe('lessons whose content changed', () => {
  const attempts = [{ at: '2026-10-01T10:00:00.000Z', correctFirstTry: 5, spoken: true }];

  it('restarts a half-finished lesson but keeps history and cards', () => {
    const parsed = parse({
      v: 'older',
      step: 4,
      firstTry: [true, false],
      draft: 'halb',
      attempts,
      cards: [[2, 200]],
      cardKeys: [keys[0]],
    });
    expect(parsed).toMatchObject({ step: 0, firstTry: [], draft: '', v: contentVersion(lesson) });
    expect(parsed.attempts).toHaveLength(1);
    expect(parsed.cards).toEqual([[2, 200]]);
  });

  it('keeps a position saved with the current version', () => {
    expect(parse({ v: contentVersion(lesson), step: 4 }).step).toBe(4);
    expect(parse({ step: 4 }).step).toBe(4);
  });

  it('keeps progress when a lesson became shorter than the saved position', () => {
    const parsed = parse({ v: 'older', step: finalStep(lesson) + 5, attempts });
    expect(parsed).toBeDefined();
    expect(parsed.step).toBe(0);
    expect(parsed.attempts).toHaveLength(1);
  });

  it('keeps a completion scored on more items than the lesson now has', () => {
    const parsed = parse({
      step: finalStep(lesson),
      attempts: [{ ...attempts[0], correctFirstTry: gradedCount(lesson) + 3 }],
    });
    expect(parsed.attempts[0].correctFirstTry).toBe(gradedCount(lesson));
  });
});

describe('published content', () => {
  const published = JSON.parse(readFileSync('tests/published-ids.json', 'utf8')) as {
    lessons: string[];
    listening: string[];
    conversations: string[];
  };
  const current = {
    lessons: foundationLessons.map((item) => item.id),
    listening: listeningScenarios.map((item) => item.id),
    conversations: curriculumUnits.map((item) => item.id),
  };

  it('never removes a published id, so nobody loses earned progress', () => {
    // Retire a lesson instead of deleting it (see `retired` in foundations/types.ts).
    for (const kind of ['lessons', 'listening', 'conversations'] as const)
      expect(published[kind].filter((id) => !current[kind].includes(id))).toEqual([]);
  });

  it('lists every new id in tests/published-ids.json when it is published', () => {
    for (const kind of ['lessons', 'listening', 'conversations'] as const)
      expect(current[kind].filter((id) => !published[kind].includes(id))).toEqual([]);
  });
});
