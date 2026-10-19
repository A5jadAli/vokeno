import { describe, expect, it } from '@jest/globals';

import {
  cleanFormValue,
  formFieldCorrect,
  MAX_FORM_DRAFT_LENGTH,
  readFormDraft,
  writeFormDraft,
  type FormStep,
} from '@/features/foundations/form-practice';
import {
  contentVersion,
  freshFoundationEntry,
  parseFoundationProgress,
} from '@/features/foundations/progress';
import { spanishA1Units } from '@/features/foundations/spanish-a1-units';
import { lessonLines } from '@/features/audio/inventory';

const lesson = spanishA1Units.find((item) => item.id === 'es-a1-u4-task')!;
const index = lesson.steps.findIndex((step) => step.kind === 'form');
const form = lesson.steps[index] as FormStep;

describe('accurate personal details', () => {
  it('allows harmless name casing and Unicode composition but preserves accents and ñ', () => {
    const surname = form.fields[1];
    expect(formFieldCorrect(surname, '  MUÑOZ  ')).toBe(true);
    expect(formFieldCorrect(surname, 'Mun\u0303oz')).toBe(true);
    for (const value of ['Munoz', 'Muño', '', 'Vera Muñoz'])
      expect(formFieldCorrect(surname, value)).toBe(false);
    expect(formFieldCorrect({ ...surname, accepted: ['García'] }, 'Garcia')).toBe(false);
  });

  it('keeps initial zeros and every digit while accepting phone grouping', () => {
    const phone = form.fields[3];
    expect(formFieldCorrect(phone, '(55) 0100-0048')).toBe(true);
    for (const value of ['5501000024', '550100004', '55010000480', '55O1000048', '+5501000048'])
      expect(formFieldCorrect(phone, value)).toBe(false);
    const code = { ...phone, accepted: ['096'] };
    expect(formFieldCorrect(code, '0 9 6')).toBe(true);
    expect(formFieldCorrect(code, '96')).toBe(false);
  });

  it('keeps email punctuation and local-part case, allowing domain case and edge whitespace', () => {
    const email = form.fields[4];
    expect(formFieldCorrect(email, ' vera.munoz@EXAMPLE.COM ')).toBe(true);
    for (const value of [
      'veramunoz@example.com',
      'vera.munoz.example.com',
      'vera.munoz@examplecom',
      'vera. munoz@example.com',
      'Vera.munoz@example.com',
    ])
      expect(formFieldCorrect(email, value)).toBe(false);
  });

  it('restores a form draft beyond the phrase limit through progress parsing and cloud merge input', () => {
    const values = ['a'.repeat(48), 'ñ'.repeat(48), '1'.repeat(48), '0'.repeat(48), 'b'.repeat(48)];
    const draft = writeFormDraft(values);
    expect(draft.length).toBeGreaterThan(160);
    const saved = { ...freshFoundationEntry(), step: index, draft, v: contentVersion(lesson) };
    const restored = parseFoundationProgress(JSON.parse(JSON.stringify({ [lesson.id]: saved })))[
      lesson.id
    ];
    expect(readFormDraft(restored.draft, 5)).toEqual(values);
    expect(
      parseFoundationProgress({ [lesson.id]: { ...saved, step: 1 } })[lesson.id].draft,
    ).toHaveLength(160);
    expect(parseFoundationProgress({ [lesson.id]: { ...saved, v: 'old' } })[lesson.id].draft).toBe(
      '',
    );
  });

  it('bounds escaped drafts without breaking JSON, and handles malformed input', () => {
    const values = Array(6).fill('"\\'.repeat(48));
    const draft = writeFormDraft(values);
    expect(draft.length).toBeLessThanOrEqual(MAX_FORM_DRAFT_LENGTH);
    expect(readFormDraft(draft, 6)).toEqual(Array(5).fill('"\\'.repeat(24)));
    for (const invalid of ['{', '{}', 'null', '42'])
      expect(readFormDraft(invalid, 5)).toEqual(Array(5).fill(''));
    expect(readFormDraft('["Vera",null,26]', 3)).toEqual(['Vera', '', '']);
    expect(cleanFormValue('Ve\nra\u0000\u007f')).toBe('Vera');
  });

  it('includes the correction audio in the recording and prefetch inventory', () => {
    expect(lessonLines(lesson).some((line) => line.text === form.audio)).toBe(true);
    expect(
      lessonLines(spanishA1Units.find((item) => item.id === 'es-a1-u3-words')!).some(
        (line) => line.text === 'cero, nueve, seis',
      ),
    ).toBe(true);
  });
});
