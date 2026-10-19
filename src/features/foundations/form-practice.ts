import type { LessonStep } from './types';

export type FormStep = Extract<LessonStep, { kind: 'form' }>;
export const MAX_FORM_FIELDS = 5;
export const MAX_FORM_FIELD_LENGTH = 48;
export const MAX_FORM_DRAFT_LENGTH = 512;

// Five 48-character values, even all quotes/backslashes, fit in 512 characters as JSON.
// Strip control characters, which have no use in these single-line fields.
export const cleanFormValue = (value: string) =>
  Array.from(value)
    .filter((char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127)
    .join('')
    .slice(0, MAX_FORM_FIELD_LENGTH);

export function readFormDraft(draft: string, count: number): string[] {
  let values: unknown;
  try {
    values = JSON.parse(draft);
  } catch {
    values = [];
  }
  return Array.from({ length: Math.min(count, MAX_FORM_FIELDS) }, (_, index) =>
    Array.isArray(values) && typeof values[index] === 'string' ? cleanFormValue(values[index]) : '',
  );
}

export const writeFormDraft = (values: string[]) =>
  JSON.stringify(values.slice(0, MAX_FORM_FIELDS).map(cleanFormValue));

/** Details must survive accurately. Phrase grading's punctuation stripping is unsafe here. */
export function formFieldCorrect(field: FormStep['fields'][number], value: string) {
  const normalise = (input: string) => {
    const text = input.normalize('NFC').trim();
    if (field.kind === 'digits') return text.replace(/[ ()-]/g, '');
    if (field.kind === 'email') {
      const at = text.lastIndexOf('@');
      return at < 0 ? text : text.slice(0, at) + text.slice(at).toLowerCase();
    }
    return text.replace(/\s+/g, ' ').toLocaleLowerCase();
  };
  return (
    value.trim().length > 0 &&
    field.accepted.some((answer) => normalise(answer) === normalise(value))
  );
}
