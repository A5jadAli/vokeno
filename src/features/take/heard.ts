import type { LanguageTrack } from '@/features/language/config';

import { normaliseSpeech } from '../../../supabase/functions/_shared/unit-calls';

/**
 * The spoken-line check of docs/the-take.md: which words of a line a listener understood, from a
 * transcript made without knowing the line. Pure, so it runs on the phone and can be tested.
 * It reports what was heard; it is never a pronunciation score.
 */
export type HeardWord = { text: string; heard: boolean };
export type HeardResult = {
  /** The line as written, word by word, each marked heard or not. */
  words: HeardWord[];
  verdict: 'understood' | 'almost' | 'not-yet';
};

/** "Almost" from this share of the words. A starting point, to be tuned with learners. */
export const ALMOST_SHARE = 0.6;

const ONES: Record<LanguageTrack, string[]> = {
  EN: 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(
    ' ',
  ),
  ES: 'cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis diecisiete dieciocho diecinueve veinte veintiuno veintidos veintitres veinticuatro veinticinco veintiseis veintisiete veintiocho veintinueve'.split(
    ' ',
  ),
  DE: 'null eins zwei drei vier funf sechs sieben acht neun zehn elf zwolf dreizehn vierzehn funfzehn sechzehn siebzehn achtzehn neunzehn'.split(
    ' ',
  ),
};
const TENS: Record<LanguageTrack, string[]> = {
  EN: 'twenty thirty forty fifty sixty seventy eighty ninety'.split(' '),
  ES: 'veinte treinta cuarenta cincuenta sesenta setenta ochenta noventa'.split(' '),
  DE: 'zwanzig dreissig vierzig funfzig sechzig siebzig achtzig neunzig'.split(' '),
};
const HUNDRED: Record<LanguageTrack, string> = { EN: 'one hundred', ES: 'cien', DE: 'hundert' };

/** 0 to 100 as the words a speaker says, already without accents. Other numbers stay digits. */
function numberWords(value: number, track: LanguageTrack) {
  if (value < ONES[track].length) return ONES[track][value];
  if (value === 100) return HUNDRED[track];
  if (value > 100) return String(value);
  const tens = TENS[track][Math.floor(value / 10) - 2];
  const one = value % 10;
  if (!one) return tens;
  if (track === 'DE') return `${one === 1 ? 'ein' : ONES.DE[one]}und${tens}`;
  return track === 'ES' ? `${tens} y ${ONES.ES[one]}` : `${tens} ${ONES.EN[one]}`;
}

/** Forms that are one spoken word to a listener: "veintiún" and "veintiuno", "un" and "uno". */
const SAME: Record<string, string> = {
  un: 'uno',
  una: 'uno',
  veintiun: 'veintiuno',
  veintiuna: 'veintiuno',
  eins: 'ein',
  einhundert: 'hundert',
};

function tokens(text: string, track: LanguageTrack) {
  return normaliseSpeech(text.replace(/ß/g, 'ss').replace(/[-–—…]/g, ' '))
    .replace(/\d+/g, (digits) => numberWords(Number(digits), track))
    .split(' ')
    .filter(Boolean)
    .map((token) => SAME[token] ?? token);
}

/** Which of `line`'s tokens appear, in order, in `said`: a longest common subsequence. */
function matched(line: string[], said: string[]) {
  const length = Array.from({ length: line.length + 1 }, () => new Array(said.length + 1).fill(0));
  for (let i = line.length - 1; i >= 0; i--)
    for (let j = said.length - 1; j >= 0; j--)
      length[i][j] =
        line[i] === said[j]
          ? length[i + 1][j + 1] + 1
          : Math.max(length[i + 1][j], length[i][j + 1]);
  const hit = line.map(() => false);
  for (let i = 0, j = 0; i < line.length && j < said.length;)
    if (line[i] === said[j]) {
      hit[i] = true;
      i++;
      j++;
    } else if (length[i + 1][j] >= length[i][j + 1]) i++;
    else j++;
  return hit;
}

function mark(line: string, said: string[], track: LanguageTrack) {
  const parts = line.split(/\s+/).filter(Boolean);
  const perWord = parts.map((part) => tokens(part, track));
  const hit = matched(perWord.flat(), said);
  let at = 0;
  const words = parts.map((text, index) => {
    const mine = hit.slice(at, (at += perWord[index].length));
    return { text, heard: mine.every(Boolean) };
  });
  const total = hit.length;
  return { words, share: total ? hit.filter(Boolean).length / total : 0 };
}

/**
 * Compares a line with what was heard. `also` holds other ways to say the same line that the
 * content accepts; the best match is the one shown.
 */
export function markHeard(
  line: string,
  heard: string,
  track: LanguageTrack,
  also: readonly string[] = [],
): HeardResult {
  const said = tokens(heard, track);
  const best = [line, ...also]
    .map((candidate) => mark(candidate, said, track))
    .reduce((top, next) => (next.share > top.share ? next : top));
  return {
    words: best.words,
    verdict: best.share === 1 ? 'understood' : best.share >= ALMOST_SHARE ? 'almost' : 'not-yet',
  };
}
