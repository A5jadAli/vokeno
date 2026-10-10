import { foundationLessons } from './catalog';
import { finalStep, gradedCount, MAX_LESSON_CHECKS, type FoundationLesson } from './types';

// Keep the per-lesson history short: cloud state for every lesson must stay under 256 KB
// (about 1 KB per lesson in the worst case).
export const MAX_FOUNDATION_ATTEMPTS = 4;
export const MAX_DRAFT_LENGTH = 160;

export type FoundationAttempt = { at: string; correctFirstTry: number; spoken: boolean };
export type FoundationEntry = {
  step: number;
  answers: number[];
  firstTry: boolean[];
  draft: string;
  writingMistakes: number;
  attempts: FoundationAttempt[];
  /**
   * Spaced-review state per phrase, in the lesson's current phrase order: [box, due day number
   * (days since epoch)], or null for a phrase added after the lesson was finished.
   */
  cards?: ([box: number, dueDay: number] | null)[];
  /** Which phrase each card belongs to (`phraseKey`), so cards survive reordered content. */
  cardKeys?: string[];
  /** The lesson's content version when this progress was saved (`contentVersion`). */
  v?: string;
  updatedAt: string;
};

/** A short, stable fingerprint (FNV-1a, base 36). */
function fingerprint(text: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

/** Identifies a phrase by its words, not its position, so review cards follow it. */
export function phraseKey(target: string) {
  return fingerprint(target.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase());
}

const versions = new Map<string, string>();

/**
 * A fingerprint of what a learner steps through. When it changes, a saved half-finished
 * position may point at a different step, so it starts again from the top.
 */
export function contentVersion(lesson: FoundationLesson) {
  let version = versions.get(lesson.id);
  if (!version) {
    version = fingerprint(
      JSON.stringify(
        lesson.format === 'steps' ? lesson.steps : [lesson.checks, lesson.writing.accepted],
      ),
    );
    versions.set(lesson.id, version);
  }
  return version;
}

const validCard = (card: unknown): card is [number, number] =>
  Array.isArray(card) &&
  Number.isInteger(card[0]) &&
  card[0] >= 0 &&
  card[0] <= 5 &&
  Number.isInteger(card[1]) &&
  card[1] > 0 &&
  card[1] < 100000;

/**
 * Lines stored cards up with the lesson's current phrases by key. Older progress without keys
 * was saved in phrase order, which is still the order of its phrases.
 */
function alignCards(lesson: FoundationLesson, entry: FoundationEntry) {
  if (!Array.isArray(entry.cards)) return undefined;
  const keys =
    Array.isArray(entry.cardKeys) &&
    entry.cardKeys.length === entry.cards.length &&
    entry.cardKeys.every((key) => typeof key === 'string' && key.length <= 12)
      ? entry.cardKeys
      : lesson.phrases.slice(0, entry.cards.length).map((phrase) => phraseKey(phrase.target));
  const byKey = new Map<string, [number, number]>();
  entry.cards.forEach((card, index) => {
    if (validCard(card) && keys[index]) byKey.set(keys[index], [card[0], card[1]]);
  });
  const current = lesson.phrases.map((phrase) => phraseKey(phrase.target));
  const cards = current.map((key) => byKey.get(key) ?? null);
  const last = cards.reduce((end, card, index) => (card ? index + 1 : end), 0);
  if (!last) return undefined;
  return { cards: cards.slice(0, last), cardKeys: current.slice(0, last) };
}
export type FoundationProgress = Record<string, FoundationEntry>;

export function freshFoundationEntry(): FoundationEntry {
  return {
    step: 0,
    answers: [],
    firstTry: [],
    draft: '',
    writingMistakes: 0,
    attempts: [],
    updatedAt: new Date().toISOString(),
  };
}

export function parseFoundationProgress(value: unknown): FoundationProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: FoundationProgress = {};
  for (const lesson of foundationLessons) {
    const raw = (value as Record<string, unknown>)[lesson.id];
    if (!raw || typeof raw !== 'object') continue;
    const entry = raw as FoundationEntry;
    const last = finalStep(lesson);
    const marked = lesson.format === 'steps' ? gradedCount(lesson) : MAX_LESSON_CHECKS;
    const version = contentVersion(lesson);
    const changed = entry.v !== undefined && entry.v !== version;
    if (
      !Number.isInteger(entry.step) ||
      entry.step < 0 ||
      // A step past the end is only valid when the lesson has since been shortened.
      (entry.step > last && !changed) ||
      !Array.isArray(entry.answers) ||
      !entry.answers.every((v) => Number.isInteger(v) && v >= -1 && v < 3) ||
      !Array.isArray(entry.firstTry) ||
      !entry.firstTry.every((v) => typeof v === 'boolean') ||
      typeof entry.draft !== 'string' ||
      !Number.isInteger(entry.writingMistakes) ||
      entry.writingMistakes < 0 ||
      typeof entry.updatedAt !== 'string' ||
      !Number.isFinite(Date.parse(entry.updatedAt))
    )
      continue;
    const attempts = Array.isArray(entry.attempts)
      ? entry.attempts
          .filter(
            (a) =>
              a &&
              typeof a.at === 'string' &&
              Number.isFinite(Date.parse(a.at)) &&
              Number.isInteger(a.correctFirstTry) &&
              a.correctFirstTry >= 0 &&
              a.correctFirstTry <= 1000 &&
              typeof a.spoken === 'boolean',
          )
          // A lesson with fewer marked items now still keeps its earlier completions.
          .map((a) => ({ ...a, correctFirstTry: Math.min(a.correctFirstTry, gradedCount(lesson)) }))
          .slice(-MAX_FOUNDATION_ATTEMPTS)
      : [];
    const aligned = alignCards(lesson, entry);
    // Content changed under a half-finished lesson: start it again rather than resume at a
    // step that now means something else. Finished work, history and cards stay.
    const stale = changed && entry.step > 0 && (entry.step < last || entry.step > last);
    result[lesson.id] = {
      ...(aligned ?? {}),
      v: version,
      step: stale || (entry.step === last && !attempts.length) ? 0 : entry.step,
      // Step lessons keep one marker here: [1] once a speaking step was done aloud.
      answers: stale
        ? []
        : entry.answers.slice(0, lesson.format === 'steps' ? 1 : MAX_LESSON_CHECKS),
      firstTry: stale ? [] : entry.firstTry.slice(0, marked),
      // Drafts are only needed until the writing is passed; keep cloud state small.
      draft:
        stale || entry.step >= (lesson.format === 'steps' ? last : 3)
          ? ''
          : entry.draft.slice(0, MAX_DRAFT_LENGTH),
      writingMistakes: Math.min(entry.writingMistakes, 1000),
      updatedAt: entry.updatedAt,
      attempts,
    };
  }
  return result;
}

export function mergeFoundationProgress(local: FoundationProgress, remote: FoundationProgress) {
  const result = { ...local };
  for (const [id, incoming] of Object.entries(parseFoundationProgress(remote))) {
    const current = result[id];
    if (!current) {
      result[id] = incoming;
      continue;
    }
    const latest =
      Date.parse(incoming.updatedAt) > Date.parse(current.updatedAt) ? incoming : current;
    const attempts = [
      ...new Map(
        [...current.attempts, ...incoming.attempts].map((attempt) => [attempt.at, attempt]),
      ).values(),
    ]
      .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
      .slice(-MAX_FOUNDATION_ATTEMPTS);
    result[id] = { ...latest, attempts };
  }
  return result;
}

export function foundationReviewDue(entry: FoundationEntry | undefined, now = Date.now()) {
  const last = entry?.attempts.at(-1);
  return Boolean(last && now - Date.parse(last.at) >= 24 * 60 * 60 * 1000);
}
