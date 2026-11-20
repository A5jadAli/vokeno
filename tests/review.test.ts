import { describe, expect, it } from '@jest/globals';
import { foundationLessons, getTrackLessons } from '@/features/foundations/catalog';
import {
  contentVersion,
  freshFoundationEntry,
  parseFoundationProgress,
  phraseKey,
  type FoundationEntry,
  type FoundationProgress,
} from '@/features/foundations/progress';
import { dayNumberOf, localDay } from '@/features/habits/practice-log';
import {
  buildReviewSession,
  dayNumber,
  dueCards,
  gradeCard,
  REVIEW_INTERVALS,
  reviewSummary,
  seedCards,
} from '@/features/review/schedule';

const today = 20_000;
const greetings = foundationLessons.find((lesson) => lesson.id === 'greetings')!;

function progressWith(cards: [number, number][], id = 'greetings'): FoundationProgress {
  return { [id]: { ...freshFoundationEntry(), cards } };
}

describe('spaced review', () => {
  it('seeds one card per phrase, due tomorrow, without resetting existing cards', () => {
    const { cards, cardKeys } = seedCards(greetings, freshFoundationEntry(), today);
    expect(cards).toHaveLength(greetings.phrases.length);
    expect(cardKeys).toHaveLength(greetings.phrases.length);
    expect(cards.every(([box, due]) => box === 0 && due === today + 1)).toBe(true);
    const kept = seedCards(
      greetings,
      { ...freshFoundationEntry(), cards: [[3, today + 9]] },
      today,
    ).cards;
    expect(kept[0]).toEqual([3, today + 9]);
    expect(kept).toHaveLength(greetings.phrases.length);
  });

  it('expands the interval after success and resets after a miss', () => {
    let entry: FoundationEntry = { ...freshFoundationEntry(), cards: [[0, today]] };
    entry = gradeCard(entry, 0, true, today);
    expect(entry.cards![0]).toEqual([1, today + REVIEW_INTERVALS[1]]);
    entry = gradeCard(entry, 0, true, today);
    expect(entry.cards![0]).toEqual([2, today + REVIEW_INTERVALS[2]]);
    entry = gradeCard(entry, 0, false, today);
    expect(entry.cards![0]).toEqual([0, today + 1]);
  });

  it('returns only due cards for the track and builds valid three-option items', () => {
    const progress = {
      ...progressWith([
        [0, today - 1],
        [1, today],
        [2, today],
        [3, today + 5],
      ]),
      ...progressWith([[0, today]], 'en-small-talk'),
    };
    expect(dueCards(progress, 'DE', today)).toHaveLength(3);
    expect(dueCards(progress, 'EN', today)).toHaveLength(1);
    const session = buildReviewSession(progress, 'DE', today);
    expect(session.map((item) => item.kind)).toEqual(['choose', 'listen', 'recall']);
    for (const item of session) {
      expect(item.options).toHaveLength(3);
      expect(new Set(item.options).size).toBe(3);
      const expected = item.kind === 'choose' ? item.target : item.meaning;
      expect(item.options[item.answer]).toBe(expected);
    }
    expect(reviewSummary(progress, 'DE', today)).toEqual({
      due: 3,
      learning: 4,
      strong: 1,
      nextInDays: 0,
    });
  });

  it('reviews a phrase once when a retired lesson and its replacement both teach it', () => {
    const unit = foundationLessons.find((lesson) => lesson.id === 'de-a1-u1-hallo')!;
    const due = (lesson: typeof unit) => lesson.phrases.map((): [number, number] => [0, today]);
    const progress = {
      ...progressWith(due(greetings)),
      ...progressWith(due(unit), unit.id),
    };
    const targets = dueCards(progress, 'DE', today).map(
      (card) => card.lesson.phrases[card.phraseIndex].target,
    );
    expect(new Set(targets).size).toBe(targets.length);
    // Hallo!, Guten Tag! and the rest come from the unit; Bitte. and Danke. only from greetings.
    expect(targets.filter((target) => target === 'Hallo!')).toHaveLength(1);
    expect(targets).toEqual(expect.arrayContaining(['Bitte.', 'Danke.']));
    expect(reviewSummary(progress, 'DE', today).due).toBe(targets.length);
  });

  it('can build a review item for every phrase in every lesson', () => {
    for (const track of ['DE', 'EN'] as const) {
      const progress: FoundationProgress = Object.fromEntries(
        getTrackLessons(track).map((lesson) => [
          lesson.id,
          {
            ...freshFoundationEntry(),
            cards: lesson.phrases.map(() => [0, today] as [number, number]),
          },
        ]),
      );
      const session = buildReviewSession(progress, track, today, 10_000);
      expect(session.length).toBe(getTrackLessons(track).reduce((n, l) => n + l.phrases.length, 0));
      for (const item of session) expect(item.options[item.answer]).toBeTruthy();
    }
  });

  it('keeps valid cards through cloud parsing and drops a malformed set', () => {
    const parsed = parseFoundationProgress({
      greetings: { ...freshFoundationEntry(), cards: [[1, today]] },
      introductions: { ...freshFoundationEntry(), cards: [[9, today]] },
    });
    expect(parsed.greetings.cards).toEqual([[1, today]]);
    expect(parsed.introductions.cards).toBeUndefined();
  });
});

describe('German Unit 1 repair: saved review cards', () => {
  const oldTargets = {
    'de-a1-u1-hallo': [
      'Hallo!',
      'Guten Morgen!',
      'Guten Tag!',
      'Guten Abend!',
      'Tschüss!',
      'Auf Wiedersehen!',
      'Bis später!',
      'Gute Nacht!',
      'Schönen Tag noch!',
      'Wie geht’s?',
      'Gut, danke. Und dir?',
      'Es geht.',
      'Moin!',
      'Servus!',
      'Grüß Gott!',
    ],
    'de-a1-u1-ich-bin': [
      'Wie heißt du?',
      'Wie heißen Sie?',
      'Mein Name ist …',
      'Wer ist das?',
      'Das ist Maria.',
      'Freut mich!',
    ],
    'de-a1-u1-du-sie': [
      'Wie bitte?',
      'Noch mal, bitte.',
      'Langsamer, bitte.',
      'Ich verstehe das nicht.',
      'Entschuldigung!',
      'Hä?',
      'Ach so!',
      'Genau.',
      'Nee.',
    ],
    'de-a1-u1-exam': ['der Vorname', 'der Familienname', 'Herr / Frau', 'das Formular'],
  };
  const saved = (keyed: boolean): FoundationProgress =>
    Object.fromEntries(
      Object.entries(oldTargets).map(([id, targets]) => [
        id,
        {
          ...freshFoundationEntry(),
          cards: targets.map((_, index) => [index % 6, today + index] as [number, number]),
          ...(keyed ? { cardKeys: targets.map(phraseKey) } : {}),
        },
      ]),
    );

  it.each([false, true])('keeps each old phrase’s schedule with keyed progress = %s', (keyed) => {
    const progress = saved(keyed);
    const parsed = parseFoundationProgress(progress);
    for (const [id, targets] of Object.entries(oldTargets)) {
      const lesson = foundationLessons.find((item) => item.id === id)!;
      expect(lesson.phrases.slice(0, targets.length).map((phrase) => phrase.target)).toEqual(
        targets,
      );
      expect(parsed[id].cardKeys).toEqual(targets.map(phraseKey));
      expect(parsed[id].cards).toEqual(progress[id].cards);
      expect(parsed[id].attempts).toEqual([]);
      expect(parsed[id].step).toBe(0);
    }
    expect(parsed['de-a1-u1-greetings']).toBeUndefined();
    const reviewed = dueCards(parsed, 'DE', today + 100).map(
      ({ lesson, phraseIndex }) => lesson.phrases[phraseIndex].target,
    );
    expect(reviewed).toHaveLength(34);
    expect(new Set(reviewed).size).toBe(34);
    expect(reviewed).toEqual(expect.arrayContaining(Object.values(oldTargets).flat()));
    for (const target of ['Gut, danke.', 'Und dir?', 'der Nachname', 'Herr', 'Frau'])
      expect(reviewed).not.toContain(target);
    const roundTrip = parseFoundationProgress(parsed);
    for (const id of Object.keys(parsed)) {
      expect(roundTrip[id].cards).toEqual(parsed[id].cards);
      expect(roundTrip[id].cardKeys).toEqual(parsed[id].cardKeys);
    }
  });

  it('keeps a new phrase’s own schedule independent of the old greeting schedules', () => {
    const progress = saved(true);
    const parsed = parseFoundationProgress({
      ...progress,
      'de-a1-u1-greetings': {
        ...freshFoundationEntry(),
        cards: [[0, today]],
        cardKeys: [phraseKey('Auf Wiedersehen, Frau Wagner!')],
      },
    });
    const lesson = foundationLessons.find((item) => item.id === 'de-a1-u1-greetings')!;
    expect(parsed[lesson.id].cards).toEqual([[0, today]]);
    expect(parsed[lesson.id].cardKeys).toEqual([phraseKey('Auf Wiedersehen, Frau Wagner!')]);
    const seeded = seedCards(lesson, parsed[lesson.id], today, parsed);
    expect(seeded.cards).toEqual([
      [0, today],
      [0, today + 1],
    ]);
    expect(seeded.cardKeys).toEqual(lesson.phrases.map((phrase) => phraseKey(phrase.target)));
    for (const id of Object.keys(oldTargets)) expect(parsed[id].cards).toEqual(progress[id].cards);
    const reviewed = dueCards(parsed, 'DE', today + 100).map(
      ({ lesson, phraseIndex }) => lesson.phrases[phraseIndex].target,
    );
    expect(reviewed).toHaveLength(35);
    expect(new Set(reviewed).size).toBe(35);
  });

  it.each(Object.keys(oldTargets))(
    'does not realign current unkeyed progress for %s as legacy',
    (id) => {
      const lesson = foundationLessons.find((item) => item.id === id)!;
      const cards = lesson.phrases.map(
        (_, index) => [index % 6, today + index] as [number, number],
      );
      const parsed = parseFoundationProgress({
        [id]: { ...freshFoundationEntry(), v: contentVersion(lesson), cards },
      });
      expect(parsed[id].cards).toEqual(cards);
      expect(parsed['de-a1-u1-greetings']).toBeUndefined();
    },
  );

  it.each(Object.entries(oldTargets))(
    'adds new cards only after the saved cards when %s is completed again',
    (id, targets) => {
      const lesson = foundationLessons.find((item) => item.id === id)!;
      const progress = parseFoundationProgress(saved(false));
      const seeded = seedCards(lesson, progress[id], today, progress);
      expect(seeded.cards.slice(0, targets.length)).toEqual(progress[id].cards);
      expect(seeded.cards.slice(targets.length)).toEqual(
        lesson.phrases.slice(targets.length).map(() => [0, today + 1]),
      );
      expect(seeded.cardKeys).toEqual(lesson.phrases.map((phrase) => phraseKey(phrase.target)));
    },
  );
});

describe('review days', () => {
  it('count local calendar days, like Today, so a lesson after midnight is due tomorrow', () => {
    const justAfterMidnight = new Date(2026, 9, 17, 0, 30).getTime();
    const lateEvening = new Date(2026, 9, 16, 23, 30).getTime();
    expect(dayNumber(justAfterMidnight)).toBe(dayNumberOf(localDay(justAfterMidnight)));
    expect(dayNumber(justAfterMidnight) - dayNumber(lateEvening)).toBe(1);
  });
});
