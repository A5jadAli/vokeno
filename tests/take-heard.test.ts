import { describe, expect, it } from '@jest/globals';

import { markHeard } from '@/features/take/heard';

const missed = (result: ReturnType<typeof markHeard>) =>
  result.words.filter((word) => !word.heard).map((word) => word.text);

describe('what a listener heard of a spoken line', () => {
  it('understands a line said in full, whatever the case, punctuation or accents', () => {
    const result = markHeard('¿Cuántos años tienes?', 'cuantos anos tienes', 'ES');
    expect(result.verdict).toBe('understood');
    expect(result.words.map((word) => word.text)).toEqual(['¿Cuántos', 'años', 'tienes?']);
  });

  it('ignores extra words around the line', () => {
    expect(markHeard('Tengo veinte años.', 'Eh, tengo veinte años, sí.', 'ES').verdict).toBe(
      'understood',
    );
  });

  it('reads a transcriber’s digits as the number words the learner said', () => {
    expect(markHeard('Tengo veinte años.', 'Tengo 20 años.', 'ES').verdict).toBe('understood');
    expect(markHeard('Tengo veintiún años.', 'Tengo 21 años', 'ES').verdict).toBe('understood');
    expect(markHeard('Tengo treinta y dos años.', 'tengo 32 años', 'ES').verdict).toBe(
      'understood',
    );
    expect(markHeard('Ich bin einundzwanzig.', 'Ich bin 21.', 'DE').verdict).toBe('understood');
    expect(markHeard('Das kostet zwölf Euro.', 'das kostet 12 euro', 'DE').verdict).toBe(
      'understood',
    );
    expect(markHeard('I’m twenty-one.', "I'm 21", 'EN').verdict).toBe('understood');
    expect(markHeard('Un café, por favor.', '1 café por favor', 'ES').verdict).toBe('understood');
  });

  it('treats ß and ss as the same sound', () => {
    expect(markHeard('Ich heiße Alex.', 'ich heisse alex', 'DE').verdict).toBe('understood');
  });

  it('marks the words that were not heard and calls most of a line almost', () => {
    const result = markHeard('Ich stehe um sieben auf.', 'Ich stehe um sieben', 'DE');
    expect(result.verdict).toBe('almost');
    expect(missed(result)).toEqual(['auf.']);
  });

  it('keeps a different word different: one letter can change the meaning', () => {
    const result = markHeard('Es mi hermana.', 'es mi hermano', 'ES');
    expect(missed(result)).toEqual(['hermana.']);
    expect(result.verdict).toBe('almost');
  });

  it('wants the words in order', () => {
    const result = markHeard('Tengo veinte años.', 'años veinte tengo', 'ES');
    expect(result.verdict).toBe('not-yet');
    expect(result.words.filter((word) => word.heard)).toHaveLength(1);
  });

  it('says not yet for silence or something else entirely', () => {
    expect(markHeard('Guten Morgen!', '', 'DE').verdict).toBe('not-yet');
    expect(markHeard('Guten Morgen!', 'hello there', 'DE').verdict).toBe('not-yet');
  });

  it('accepts another way to say the line when the content allows it', () => {
    const result = markHeard('I’m from Lima.', 'I am from Lima', 'EN', ['I am from Lima.']);
    expect(result.verdict).toBe('understood');
    expect(result.words.map((word) => word.text)).toEqual(['I', 'am', 'from', 'Lima.']);
  });

  it('marks a hyphenated number heard only when both parts were', () => {
    const result = markHeard('I’m twenty-one.', "I'm twenty", 'EN');
    expect(missed(result)).toEqual(['twenty-one.']);
  });
});
