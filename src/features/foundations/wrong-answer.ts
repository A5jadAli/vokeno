// What a wrong pick teaches. When the chosen option is a phrase the course teaches, say what it
// actually means ("Gute Nacht" means "Good night", said at bedtime), which shows why it does
// not fit without giving the answer away. Otherwise a short, neutral way to try again.

import type { LanguageTrack } from '@/features/language/config';

import { allTrackLessons } from './catalog';

type Phrase = { target: string; meaning: string; use: string };

const clean = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[¿¡?!.,;:“”"‘’'()…]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const byTrack = new Map<
  LanguageTrack,
  { target: Map<string, Phrase>; meaning: Map<string, Phrase> }
>();

function phrases(track: LanguageTrack) {
  let found = byTrack.get(track);
  if (!found) {
    found = { target: new Map(), meaning: new Map() };
    for (const lesson of allTrackLessons(track))
      for (const phrase of lesson.phrases) {
        if (!found.target.has(clean(phrase.target))) found.target.set(clean(phrase.target), phrase);
        if (!found.meaning.has(clean(phrase.meaning)))
          found.meaning.set(clean(phrase.meaning), phrase);
      }
    byTrack.set(track, found);
  }
  return found;
}

/** A quote that already ends a sentence ("Goodbye.") takes no second full stop after it. */
const quoted = (text: string) => `“${text}”${/[.!?…]$/.test(text) ? '' : '.'}`;

/** A short "use" line reads as a reason; a long one would bury the retry. */
const shortUse = (use: string) => (use && use.length <= 80 ? ` ${use.replace(/\.?$/, '.')}` : '');

/**
 * The message for a wrong choice: what the chosen option means when the course teaches it,
 * then how to try again.
 */
export function wrongChoiceMessage(track: LanguageTrack, option: string, retry: string) {
  const { target, meaning } = phrases(track);
  const asTarget = target.get(clean(option));
  const asMeaning = asTarget ? undefined : meaning.get(clean(option));
  const why = asTarget
    ? `“${asTarget.target}” means ${quoted(asTarget.meaning)}${shortUse(asTarget.use)}`
    : asMeaning && clean(asMeaning.target) !== clean(option)
      ? `“${asMeaning.meaning}” would be ${quoted(asMeaning.target)}`
      : '';
  return [why, retry].filter(Boolean).join(' ');
}
