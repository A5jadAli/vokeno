import { describe, expect, it } from '@jest/globals';

import { Palette } from '@/constants/theme';
import {
  checkFoundationWriting,
  foundationLessons,
  gradeFoundationWriting,
  normaliseFoundationAnswer,
  optionOrder,
  type FoundationLesson,
} from '@/features/foundations/catalog';
import { languageTracks, trackColors } from '@/features/language/config';
import { listeningScenarios } from '@/features/listening/scenarios';

function lesson(track: FoundationLesson['track'], accepted: string[]): FoundationLesson {
  const base = foundationLessons.find((item) => item.track === track);
  if (!base) throw new Error(`No ${track} lesson`);
  return { ...base, writing: { ...base.writing, accepted } };
}

describe('answer normalisation', () => {
  it('ignores Spanish inverted punctuation like any other punctuation', () => {
    expect(normaliseFoundationAnswer('¿Cuánto cuesta?')).toBe(
      normaliseFoundationAnswer('Cuánto cuesta'),
    );
    expect(normaliseFoundationAnswer('¡Hola!')).toBe('hola');
    expect(normaliseFoundationAnswer('¿¿Dónde?? ¡¡ya!!')).toBe('dónde ya');
  });

  it('keeps accents unless asked to ignore them, and never drops ñ', () => {
    expect(normaliseFoundationAnswer('Está')).toBe('está');
    expect(normaliseFoundationAnswer('Está', { ignoreAccents: true })).toBe('esta');
    expect(normaliseFoundationAnswer('ÁRBOL', { ignoreAccents: true })).toBe('arbol');
    expect(normaliseFoundationAnswer('Niño', { ignoreAccents: true })).toBe('niño');
    expect(normaliseFoundationAnswer('pingüino', { ignoreAccents: true })).toBe('pinguino');
  });

  it('treats decomposed and composed accents the same', () => {
    expect(normaliseFoundationAnswer('Está')).toBe(normaliseFoundationAnswer('Está'));
  });

  it('never strips German umlauts, which change meaning', () => {
    expect(normaliseFoundationAnswer('schön', { ignoreAccents: true })).toBe('schoen');
    expect(normaliseFoundationAnswer('schön', { ignoreAccents: true })).not.toBe(
      normaliseFoundationAnswer('schon'),
    );
  });

  it('collapses whitespace and handles empty input', () => {
    expect(normaliseFoundationAnswer('  la   cuenta ,  por favor  ')).toBe('la cuenta por favor');
    expect(normaliseFoundationAnswer('')).toBe('');
    expect(normaliseFoundationAnswer(' ¿? ')).toBe('');
  });
});

describe('writing grades', () => {
  const spanish = lesson('ES', ['¿Dónde está la estación?']);

  it('accepts the exact answer with or without punctuation and case', () => {
    expect(gradeFoundationWriting(spanish, '¿Dónde está la estación?').status).toBe('correct');
    expect(gradeFoundationWriting(spanish, 'dónde está la estación').status).toBe('correct');
  });

  it('accepts missing Spanish accents but shows the accented form', () => {
    expect(gradeFoundationWriting(spanish, 'Donde esta la estacion')).toEqual({
      status: 'accents',
      expected: '¿Dónde está la estación?',
    });
    expect(checkFoundationWriting(spanish, 'donde esta la estacion')).toBe(true);
  });

  it('shows the fully punctuated form when several spellings are accepted', () => {
    const prices = lesson('ES', ['Cuánto cuesta', '¿Cuánto cuesta?']);
    expect(gradeFoundationWriting(prices, 'cuanto cuesta')).toEqual({
      status: 'accents',
      expected: '¿Cuánto cuesta?',
    });
  });

  it('does not treat a missing ñ as an accent slip', () => {
    const year = lesson('ES', ['Tengo un año']);
    expect(gradeFoundationWriting(year, 'Tengo un ano').status).not.toBe('accents');
    expect(checkFoundationWriting(year, 'Tengo un ano')).toBe(false);
  });

  it('keeps German strict about umlauts', () => {
    const german = lesson('DE', ['Das ist schön']);
    expect(gradeFoundationWriting(german, 'Das ist schoen').status).toBe('correct');
    expect(gradeFoundationWriting(german, 'Das ist schon').status).not.toBe('accents');
    expect(checkFoundationWriting(german, 'Das ist schon')).toBe(false);
  });

  it('rejects empty, punctuation-only and wrong answers', () => {
    expect(gradeFoundationWriting(spanish, '').status).toBe('wrong');
    expect(gradeFoundationWriting(spanish, '   ').status).toBe('wrong');
    expect(gradeFoundationWriting(spanish, '¿?').status).toBe('wrong');
    expect(gradeFoundationWriting(spanish, 'La cuenta, por favor').status).toBe('wrong');
  });

  it('marks a one-letter typo as close without accepting it', () => {
    expect(gradeFoundationWriting(spanish, 'Donde esta la estacon').status).toBe('close');
    expect(checkFoundationWriting(spanish, 'Donde esta la estacon')).toBe(false);
  });

  it('accepts every authored Spanish answer typed without accents or punctuation', () => {
    for (const item of foundationLessons.filter((entry) => entry.track === 'ES')) {
      for (const accepted of item.writing.accepted) {
        const plain = accepted
          .normalize('NFD')
          .replace(/[́̈]/g, '')
          .normalize('NFC')
          .replace(/[¿?¡!.,]/g, '');
        expect(checkFoundationWriting(item, plain)).toBe(true);
      }
    }
  });
});

describe('language colours', () => {
  function luminance(hex: string) {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  it('defines colours for every language', () => {
    for (const track of languageTracks) expect(trackColors[track]).toBeDefined();
  });

  it('keeps text on each accent readable (WCAG AA, 4.5:1)', () => {
    for (const track of languageTracks) {
      const { accent, onAccent, onDark, tint } = trackColors[track];
      expect(contrast(onAccent, accent)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(onDark, Palette.ink)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(Palette.ink, tint)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('gives each language a distinct accent', () => {
    const accents = languageTracks.map((track) => trackColors[track].accent);
    expect(new Set(accents).size).toBe(accents.length);
  });
});

describe('listening questions', () => {
  it('have unique options and a valid answer', () => {
    for (const scenario of listeningScenarios) {
      const { options, correctIndex } = scenario.question;
      expect(new Set(options).size).toBe(options.length);
      expect(correctIndex).toBeGreaterThanOrEqual(0);
      expect(correctIndex).toBeLessThan(options.length);
    }
  });

  it('shuffle into a stable full permutation', () => {
    for (const scenario of listeningScenarios) {
      const order = optionOrder(scenario.id, scenario.question.options.length);
      expect([...order].sort()).toEqual(scenario.question.options.map((_, index) => index));
      expect(optionOrder(scenario.id, scenario.question.options.length)).toEqual(order);
    }
  });

  it('do not leave the answer in the same displayed position for most questions', () => {
    const positions = listeningScenarios.map((scenario) =>
      optionOrder(scenario.id, scenario.question.options.length).indexOf(
        scenario.question.correctIndex,
      ),
    );
    const counts = [0, 1, 2].map((position) => positions.filter((p) => p === position).length);
    expect(Math.max(...counts)).toBeLessThan(positions.length * 0.6);
  });
});
