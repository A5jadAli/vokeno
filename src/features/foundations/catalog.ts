import { englishLessons } from './english-lessons';
import { germanA1Lessons } from './german-a1';
import { germanA2Lessons } from './german-a2';
import { germanB1Lessons } from './german-b1';
import { spanishA1Lessons } from './spanish-a1';
import { spanishA2Lessons } from './spanish-a2';
import type { FoundationLesson, LessonTrack } from './types';

export type { FoundationLesson, LessonCheck, LessonLevel, LessonTrack } from './types';

// Original guided lessons. German runs from first words to selected B1 tasks; English covers
// modern everyday communication and optional IELTS skills. Neither is a certified course.
export const germanLessons = [...germanA1Lessons, ...germanA2Lessons, ...germanB1Lessons];
export const foundationLessons: FoundationLesson[] = [
  ...germanLessons,
  ...englishLessons,
  ...spanishA1Lessons,
  ...spanishA2Lessons,
];

export function getTrackLessons(track: LessonTrack) {
  return foundationLessons.filter((lesson) => lesson.track === track);
}

/**
 * Lower-cases and strips punctuation (including Spanish ¿ ¡) so only the words are compared.
 * Accents are kept; `ignoreAccents` also drops Spanish acute accents and the diaeresis in ü
 * (as in pingüino) but never ñ, and never German umlauts, which change meaning.
 */
export function normaliseFoundationAnswer(value: string, { ignoreAccents = false } = {}) {
  let text = value.normalize('NFC').trim().toLocaleLowerCase();
  if (ignoreAccents) {
    text = text
      .normalize('NFD')
      .replace(/([aeiou])\u0301/g, '$1')
      .replace(/([u])\u0308(?=[ei])/g, '$1')
      .normalize('NFC');
  }
  return text
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/['’‘`]/g, '')
    .replace(/[.,!?¿¡;:„“”"«»–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type WritingGrade =
  | { status: 'correct' }
  /** Right words, missing or wrong accents. Accepted, with the accented form to notice. */
  | { status: 'accents'; expected: string }
  | { status: 'close' }
  | { status: 'wrong' };

export function gradeFoundationWriting(lesson: FoundationLesson, value: string): WritingGrade {
  const answer = normaliseFoundationAnswer(value);
  if (!answer) return { status: 'wrong' };
  if (lesson.writing.accepted.some((item) => normaliseFoundationAnswer(item) === answer))
    return { status: 'correct' };
  if (lesson.track === 'ES') {
    const loose = normaliseFoundationAnswer(value, { ignoreAccents: true });
    // Show the fully punctuated form (¿Cuánto cuesta?) when the lesson accepts several.
    const match = lesson.writing.accepted
      .filter((item) => normaliseFoundationAnswer(item, { ignoreAccents: true }) === loose)
      .sort((a, b) => Number(/[¿¡]/.test(b)) - Number(/[¿¡]/.test(a)))[0];
    if (match) return { status: 'accents', expected: match };
  }
  return isNearMiss(lesson, value) ? { status: 'close' } : { status: 'wrong' };
}

export function checkFoundationWriting(lesson: FoundationLesson, value: string) {
  const grade = gradeFoundationWriting(lesson, value).status;
  return grade === 'correct' || grade === 'accents';
}

/** True when an answer is not accepted but is within two letters of an accepted one. */
export function isNearMiss(lesson: FoundationLesson, value: string) {
  // Spanish accents are graded separately, so they should not count as typos here.
  const options = { ignoreAccents: lesson.track === 'ES' };
  const answer = normaliseFoundationAnswer(value, options);
  if (answer.length < 4) return false;
  if (lesson.writing.accepted.some((item) => normaliseFoundationAnswer(item, options) === answer))
    return false;
  return lesson.writing.accepted.some(
    (item) => editDistance(normaliseFoundationAnswer(item, options), answer, 2) <= 2,
  );
}

function editDistance(a: string, b: string, limit: number) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++)
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    previous = current;
  }
  return previous[b.length];
}

/** A stable shuffled display order, so the correct option is not predictable by position. */
export function optionOrder(seed: string, count: number) {
  let state = 0;
  for (const char of seed) state = (Math.imul(state, 31) + char.charCodeAt(0)) >>> 0;
  const order = Array.from({ length: count }, (_, index) => index);
  for (let i = count - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
