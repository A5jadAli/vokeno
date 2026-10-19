import {
  allTrackLessons,
  optionOrder,
  type FoundationLesson,
  type LessonTrack,
} from '@/features/foundations/catalog';
import {
  phraseKey,
  type FoundationEntry,
  type FoundationProgress,
} from '@/features/foundations/progress';
import { dayNumberOf, localDay } from '@/features/habits/practice-log';

/** Days until the next review for each Leitner box. Expanding gaps favour long-term retention. */
export const REVIEW_INTERVALS = [1, 3, 7, 16, 35, 90] as const;
export const REVIEW_SESSION_SIZE = 8;

/**
 * The learner's local calendar day as a number, the same count Today and the streak use. A UTC
 * count made phrases learned after midnight east of Greenwich come back "due" straight away.
 */
export const dayNumber = (time = Date.now()) => dayNumberOf(localDay(time));

export type ReviewKind = 'choose' | 'listen' | 'recall';
export type ReviewItem = {
  key: string;
  lessonId: string;
  phraseIndex: number;
  kind: ReviewKind;
  target: string;
  meaning: string;
  use: string;
  /** For choose/listen items: three options and the correct index. */
  options: string[];
  answer: number;
};

/**
 * Adds a new card (due tomorrow) for every phrase that has none. Existing cards are kept, and
 * every card is labelled with its phrase so it survives later changes to the lesson.
 */
export function seedCards(
  lesson: FoundationLesson,
  entry: FoundationEntry,
  today = dayNumber(),
  progress: FoundationProgress = {},
) {
  // A rebuilt lesson must not restart already-earned intervals from its retired predecessors.
  // Limit inheritance to the same track and exact phrase identity. Keep an existing new card
  // authoritative; a later mistake there must not be overwritten by older successful practice.
  const inherited = new Map<string, [number, number]>();
  for (const previous of allTrackLessons(lesson.track).filter((item) => item.retired)) {
    const saved = progress[previous.id];
    previous.phrases.forEach((phrase, index) => {
      const key = phraseKey(phrase.target);
      const savedIndex = saved?.cardKeys ? saved.cardKeys.indexOf(key) : index;
      const card = saved?.cards?.[savedIndex];
      if (!card) return;
      const known = inherited.get(key);
      // If old lessons disagree, retain the more cautious strength and earlier review date.
      inherited.set(
        key,
        known ? [Math.min(known[0], card[0]), Math.min(known[1], card[1])] : [...card],
      );
    });
  }
  const cards = lesson.phrases.map(
    (phrase, index) =>
      entry.cards?.[index] ??
      inherited.get(phraseKey(phrase.target)) ??
      ([0, today + REVIEW_INTERVALS[0]] as [number, number]),
  );
  return { cards, cardKeys: lesson.phrases.map((phrase) => phraseKey(phrase.target)) };
}

export function gradeCard(
  entry: FoundationEntry,
  phraseIndex: number,
  correct: boolean,
  today = dayNumber(),
): FoundationEntry {
  const cards = [...(entry.cards ?? [])];
  const [box] = cards[phraseIndex] ?? [0, today];
  const next = correct ? Math.min(box + 1, REVIEW_INTERVALS.length - 1) : 0;
  cards[phraseIndex] = [next, today + (correct ? REVIEW_INTERVALS[next] : 1)];
  return { ...entry, cards, updatedAt: new Date().toISOString() };
}

type DueCard = { lesson: FoundationLesson; phraseIndex: number; box: number; dueDay: number };

/**
 * The learner's cards for a language. A card from a retired lesson is left out when an active
 * lesson already gives the learner the same phrase, so a phrase is never reviewed twice.
 */
function liveCards(progress: FoundationProgress, track: LessonTrack) {
  const cards = allTrackLessons(track).flatMap((lesson) =>
    (progress[lesson.id]?.cards ?? []).flatMap((card, phraseIndex) => {
      const phrase = lesson.phrases[phraseIndex];
      return card && phrase
        ? [{ lesson, phraseIndex, box: card[0], dueDay: card[1], key: phraseKey(phrase.target) }]
        : [];
    }),
  );
  const active = new Set(cards.filter((card) => !card.lesson.retired).map((card) => card.key));
  return cards.filter((card) => !card.lesson.retired || !active.has(card.key));
}

export function dueCards(
  progress: FoundationProgress,
  track: LessonTrack,
  today = dayNumber(),
): DueCard[] {
  return liveCards(progress, track)
    .filter((card) => card.dueDay <= today)
    .sort((a, b) => a.dueDay - b.dueDay || a.box - b.box)
    .map(({ lesson, phraseIndex, box, dueDay }) => ({ lesson, phraseIndex, box, dueDay }));
}

export function reviewSummary(
  progress: FoundationProgress,
  track: LessonTrack,
  today = dayNumber(),
) {
  const all = liveCards(progress, track).map(({ box, dueDay }) => [box, dueDay] as const);
  return {
    due: dueCards(progress, track, today).length,
    learning: all.length,
    strong: all.filter(([box]) => box >= 3).length,
    /** Days until the next card is due (0 = today), or null with no cards. */
    nextInDays: all.length ? Math.max(0, Math.min(...all.map(([, due]) => due)) - today) : null,
  };
}

export function buildReviewSession(
  progress: FoundationProgress,
  track: LessonTrack,
  today = dayNumber(),
  size = REVIEW_SESSION_SIZE,
): ReviewItem[] {
  const pool = allTrackLessons(track).flatMap((lesson) =>
    lesson.phrases.map((phrase) => ({ ...phrase, level: lesson.level })),
  );
  return dueCards(progress, track, today)
    .slice(0, size)
    .map(({ lesson, phraseIndex, box }) => {
      const phrase = lesson.phrases[phraseIndex];
      const key = `${lesson.id}#${phraseIndex}`;
      const kind: ReviewKind = box === 0 ? 'choose' : box === 1 ? 'listen' : 'recall';
      const field = kind === 'choose' ? 'target' : 'meaning';
      const correct = phrase[field];
      // Prefer distractors from the same level so options are plausible, not trivially different.
      const candidates = [
        ...pool.filter((item) => item.level === lesson.level),
        ...pool.filter((item) => item.level !== lesson.level),
      ]
        .map((item) => item[field])
        .filter((value, index, list) => value !== correct && list.indexOf(value) === index);
      const order = optionOrder(`${key}:${today}`, candidates.length);
      const distractors = order.slice(0, 2).map((index) => candidates[index]);
      const options = [correct, ...distractors];
      const display = optionOrder(`${key}:display:${today}`, options.length);
      const shuffled = display.map((index) => options[index]);
      return {
        key,
        lessonId: lesson.id,
        phraseIndex,
        kind,
        target: phrase.target,
        meaning: phrase.meaning,
        use: phrase.use,
        options: shuffled,
        answer: shuffled.indexOf(correct),
      };
    });
}
