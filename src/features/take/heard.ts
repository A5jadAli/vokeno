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
const HUNDREDS_ES = [
  '',
  'ciento',
  'doscientos',
  'trescientos',
  'cuatrocientos',
  'quinientos',
  'seiscientos',
  'setecientos',
  'ochocientos',
  'novecientos',
];

/**
 * A whole number as the words a speaker says, already without accents, up to 999 999; larger
 * numbers stay digits. Transcribers write prices, years and house numbers as digits.
 */
function numberWords(value: number, track: LanguageTrack): string {
  if (value < ONES[track].length) return ONES[track][value];
  if (value < 100) {
    const tens = TENS[track][Math.floor(value / 10) - 2];
    const one = value % 10;
    if (!one) return tens;
    if (track === 'DE') return `${one === 1 ? 'ein' : ONES.DE[one]}und${tens}`;
    return track === 'ES' ? `${tens} y ${ONES.ES[one]}` : `${tens} ${ONES.EN[one]}`;
  }
  if (value < 1000) {
    const hundreds = Math.floor(value / 100);
    const rest = value % 100 ? numberWords(value % 100, track) : '';
    if (track === 'ES') return value === 100 ? 'cien' : `${HUNDREDS_ES[hundreds]} ${rest}`.trim();
    if (track === 'DE') return `${hundreds === 1 ? '' : ONES.DE[hundreds]}hundert${rest}`;
    // "and" as in British English; an American line without it still matches.
    return `${ONES.EN[hundreds]} hundred${rest ? ` and ${rest}` : ''}`;
  }
  if (value < 1_000_000) {
    const thousands = Math.floor(value / 1000);
    const left = value % 1000;
    const rest = left ? numberWords(left, track) : '';
    if (track === 'ES')
      return `${thousands === 1 ? '' : `${numberWords(thousands, track)} `}mil ${rest}`.trim();
    if (track === 'DE')
      return `${thousands === 1 ? '' : numberWords(thousands, track)}tausend${rest}`;
    return `${numberWords(thousands, track)} thousand${rest ? `${left < 100 ? ' and' : ''} ${rest}` : ''}`;
  }
  return String(value);
}

/** Forms that are one spoken word to a listener: "veintiún" and "veintiuno", "un" and "uno". */
const SAME: Record<string, string> = {
  un: 'uno',
  una: 'uno',
  veintiun: 'veintiuno',
  veintiuna: 'veintiuno',
  eins: 'ein',
  einhundert: 'hundert',
  // Two spellings of one German word.
  tschau: 'ciao',
  tschus: 'tschuss',
  doscientas: 'doscientos',
  trescientas: 'trescientos',
  cuatrocientas: 'cuatrocientos',
  quinientas: 'quinientos',
  seiscientas: 'seiscientos',
  setecientas: 'setecientos',
  ochocientas: 'ochocientos',
  novecientas: 'novecientos',
};

function tokens(text: string, track: LanguageTrack) {
  return (
    normaliseSpeech(
      text
        .replace(/ß/g, 'ss')
        .replace(/[-–—…]/g, ' ')
        // "1,500" and "1.500" are one number.
        .replace(/(\d)[,.](?=\d{3}(?!\d))/g, '$1')
        // "$140" is said "140 dollars": the sign stands for whichever currency word the line has.
        .replace(/([$€£])\s?(\d+)/g, '$2 $1')
        .replace(/[$€£]/g, ` ${SIGN} `),
    )
      .replace(/\d+/g, (digits) => numberWords(Number(digits), track))
      // German writes "einhundert" or "hundert", "eintausend" or "tausend": the same number.
      .replace(/\bein(?=hundert|tausend)/g, '')
      .split(' ')
      .filter(Boolean)
      .map((token) => SAME[token] ?? token)
  );
}

/** A currency sign in what was heard, which matches any currency word in the line. */
const SIGN = '¤';
const CURRENCY = new Set(
  'euro euros peso pesos dolar dolares dollar dollars pound pounds libra libras'.split(' '),
);
const same = (word: string, heard: string) =>
  word === heard || (heard === SIGN && CURRENCY.has(word));

/** Which of `line`'s tokens appear, in order, in `said`: a longest common subsequence. */
function matched(line: string[], said: string[]) {
  const length = Array.from({ length: line.length + 1 }, () => new Array(said.length + 1).fill(0));
  for (let i = line.length - 1; i >= 0; i--)
    for (let j = said.length - 1; j >= 0; j--)
      length[i][j] = same(line[i], said[j])
        ? length[i + 1][j + 1] + 1
        : Math.max(length[i + 1][j], length[i][j + 1]);
  const hit = line.map(() => false);
  for (let i = 0, j = 0; i < line.length && j < said.length;)
    if (same(line[i], said[j])) {
      hit[i] = true;
      i++;
      j++;
    } else if (length[i + 1][j] >= length[i][j + 1]) i++;
    else j++;
  return hit;
}

/**
 * What was heard, rewritten where it is the same speech as the line in other spelling. A
 * transcriber writes "nochmal" for "noch mal", and turns the colloquial German the course teaches
 * into the standard form: "kommst du" for "kommste", "heiße" for "heiß". Nothing else changes, so
 * a word that was not said is still missing.
 */
function alignSaid(line: string[], said: string[], track: LanguageTrack) {
  const out: string[] = [];
  for (let j = 0; j < said.length; j++) {
    const word = said[j];
    const pair = line.findIndex((token, i) => i < line.length - 1 && token + line[i + 1] === word);
    if (pair >= 0) {
      out.push(line[pair], line[pair + 1]);
      continue;
    }
    if (track === 'DE') {
      const reduced =
        said[j + 1] === 'du' && line.find((token) => token === `${word}e` && /ste$/.test(token));
      if (reduced) {
        out.push(reduced);
        j++;
        continue;
      }
      const clipped = line.find((token) => `${token}e` === word && !token.endsWith('e'));
      if (clipped) {
        out.push(clipped);
        continue;
      }
    }
    out.push(word);
  }
  return out;
}

function mark(line: string, said: string[], track: LanguageTrack) {
  const parts = line.split(/\s+/).filter(Boolean);
  const perWord = parts.map((part) => tokens(part, track));
  const hit = matched(perWord.flat(), alignSaid(perWord.flat(), said, track));
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
