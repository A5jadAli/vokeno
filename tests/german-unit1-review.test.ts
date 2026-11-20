import { readFileSync } from 'node:fs';

import { describe, expect, it } from '@jest/globals';

import { clipKey } from '@/features/audio/clips';
import { castingFor } from '@/features/audio/voices';
import { checkFoundationWriting, normaliseFoundationAnswer } from '@/features/foundations/catalog';
import { germanA1Units } from '@/features/foundations/german-a1-units';

const sessions = germanA1Units.filter((session) => session.unit.id === 'de-a1-u1');

describe('German Unit 1: panel round 1 regressions', () => {
  it('constrains the typed departure to the taught goodbye-first frame without und', () => {
    const step = sessions[0].steps[11];
    expect(step.kind).toBe('type');
    if (step.kind !== 'type') throw new Error('Expected the original typed departure step');
    expect(step.prompt).toContain('goodbye first');
    expect(step.prompt).toContain('without und');
    for (const answer of ['Tschüss, bis später!', 'Tschüs, bis später!', 'Ciao, bis später!'])
      expect(checkFoundationWriting({ track: 'DE', writing: step }, answer)).toBe(true);
  });

  it.each([
    { session: 1, index: 5, answer: 'Frau Wagner, auf Wiedersehen!' },
    { session: 4, index: 6, answer: 'Alex ist mein Name.' },
  ])(
    'accepts the other valid tile order at session $session step $index',
    ({ session, index, answer }) => {
      const step = sessions[session].steps[index];
      expect(step.kind).toBe('build');
      if (step.kind !== 'build') throw new Error('Expected the original word-order step');
      expect(step.also?.map((value) => normaliseFoundationAnswer(value))).toContain(
        normaliseFoundationAnswer(answer),
      );
    },
  );

  it('models the short rounded vowel and preserves Maria’s self-introduction in both registers', () => {
    const speech = sessions[0].steps[12];
    expect(speech.kind).toBe('speak');
    if (speech.kind !== 'speak') throw new Error('Expected the original speaking step');
    expect(speech.tip).toContain('short');
    expect(speech.tip).toContain('“sit”');
    const scene = sessions[2].steps[0];
    expect(scene.kind).toBe('scene');
    if (scene.kind !== 'scene') throw new Error('Expected the original course scene');
    const maria = scene.lines.find((line) => line.speaker === 'Maria')!;
    expect(maria.text).toContain('ich bin Maria');
    expect(maria.real ?? maria.text).toContain('ich bin Maria');
  });

  it('teaches independently reusable wellbeing and form words as separate targets', () => {
    const taught = (session: (typeof sessions)[number]) =>
      session.steps.flatMap((step) =>
        step.kind === 'teach' ? step.items.map((item) => item.target) : [],
      );
    expect(taught(sessions[0])).toEqual([
      'Hallo!',
      'Guten Morgen!',
      'Tschüss!',
      'Bis später!',
      'Wie geht’s?',
      'Gut, danke.',
      'Und dir?',
      'Es geht.',
    ]);
    expect(taught(sessions[1])).toContain('Guten Tag!');
    expect(JSON.stringify(sessions[0].steps)).not.toMatch(/Wie geht es Ihnen|Und Ihnen|Geht so/);
    expect(taught(sessions[4])).toEqual([
      'der Vorname',
      'der Familienname',
      'der Nachname',
      'Herr',
      'Frau',
      'das Formular',
    ]);
  });

  it('describes both required speaking follow-ups and the introduction task sheet', () => {
    const step = sessions[4].steps[5];
    expect(step.kind).toBe('rule');
    if (step.kind !== 'rule') throw new Error('Expected the original exam rule');
    expect(step.body).toContain('task sheet');
    expect(step.body).toContain('spell a word');
    expect(step.body).toContain('and give a number');
    expect(step.body).not.toMatch(/cards|may ask|or say a number/);
  });

  it('keeps every actively taught target in exactly one review deck', () => {
    const targets = sessions.flatMap((session) =>
      session.steps.flatMap((step) =>
        step.kind === 'teach' ? step.items.map((item) => item.target) : [],
      ),
    );
    const reviewTargets = sessions.flatMap((session) =>
      session.phrases.map((phrase) => phrase.target),
    );
    for (const target of targets)
      expect(reviewTargets.filter((reviewTarget) => reviewTarget === target)).toEqual([target]);
  });

  it('has a recorded narrator model for every active or preserved review card', () => {
    const { clips } = JSON.parse(readFileSync('src/features/audio/clips.json', 'utf8')) as {
      clips: Record<string, number>;
    };
    const missing = sessions.flatMap((session) =>
      session.phrases
        .filter((phrase) => !clips[clipKey('DE', phrase.target, castingFor('DE'))])
        .map((phrase) => phrase.target),
    );
    expect(missing).toEqual([]);
  });
});

describe('German Unit 1: panel round 2 regressions', () => {
  it('accepts the natural thanks-first order using the supplied wellbeing tiles', () => {
    const step = sessions[0].steps[10];
    expect(step.kind).toBe('build');
    if (step.kind !== 'build') throw new Error('Expected the original wellbeing build step');
    expect(step.also?.map((answer) => normaliseFoundationAnswer(answer))).toContain(
      normaliseFoundationAnswer('Danke, gut. Und dir?'),
    );
  });

  it('does not present the shortened Tag as a polite greeting for strangers', () => {
    const step = sessions[1].steps[1];
    expect(step.kind).toBe('teach');
    if (step.kind !== 'teach') throw new Error('Expected the daytime greetings teaching step');
    const greeting = step.items.find((item) => item.target === 'Guten Tag!')!;
    expect(greeting.note).toContain('offices and receptions');
    expect(greeting.note).not.toContain('Tag!');
  });

  it.each([
    { session: 1, index: 4, target: 'Schönen Tag noch!', reply: 'Danke, gleichfalls!' },
    { session: 2, index: 5, target: 'Freut mich!', reply: 'Freut mich auch!' },
  ])(
    'keeps $reply out of the active $target teaching entry',
    ({ session, index, target, reply }) => {
      const step = sessions[session].steps[index];
      expect(step.kind).toBe('teach');
      if (step.kind !== 'teach') throw new Error('Expected the original teaching step');
      expect(step.items.find((item) => item.target === target)?.note ?? '').not.toContain(reply);
      const scene = sessions[session].steps[0];
      expect(scene.kind).toBe('scene');
      if (scene.kind !== 'scene') throw new Error('Expected the original scene');
      expect(scene.note).toContain('Recognition only');
      expect(scene.note).toContain(reply);
    },
  );

  it('teaches the name questions as complete phrases without overgeneralising word order', () => {
    const step = sessions[2].steps[8];
    expect(step.kind).toBe('rule');
    if (step.kind !== 'rule') throw new Error('Expected the original name-question step');
    expect(step.body).toContain('complete phrases');
    expect(step.body).toContain('replace only the name');
    expect(step.body).not.toContain('With a question word (wie, wer, was)');
    expect(step.body).not.toMatch(
      /question word comes first|verb comes immediately after|verb first/,
    );
    expect(step.table).toEqual([
      ['Wer ist das?', 'Who is that?'],
      ['Das ist Maria.', 'This is Maria.'],
    ]);
  });

  it('distinguishes the final sounds of heiße and heißt in the speaking tip', () => {
    const step = sessions[2].steps[12];
    expect(step.kind).toBe('speak');
    if (step.kind !== 'speak') throw new Error('Expected the original introduction speaking step');
    expect(step.tip).toContain('HIGH-suh');
    expect(step.tip).toContain('heißt ends in st');
  });

  it('tests the meaning of the first-name label rather than copying it from the prompt', () => {
    const step = sessions[4].steps[3];
    expect(step.kind).toBe('choose');
    if (step.kind !== 'choose') throw new Error('Expected the original form-reading step');
    expect(step.prompt).toBe('Look at the form. Which label means first name?');
    expect(step.prompt).not.toContain('Vorname');
    expect(step.context).toContain('Vorname: Laura');
    expect(step.options).toEqual(['Vorname', 'Familienname', 'Frau']);
    expect(step.options[step.answer]).toBe('Vorname');
  });
});

describe('German Unit 1: panel round 3 regressions', () => {
  it('scaffolds naming with whole phrases instead of two verb paradigms', () => {
    const givingName = sessions[2].steps[1];
    const askingName = sessions[2].steps[4];
    expect(givingName.kind).toBe('rule');
    expect(askingName.kind).toBe('rule');
    if (givingName.kind !== 'rule' || askingName.kind !== 'rule')
      throw new Error('Expected the original naming rules');
    expect(givingName.table).toEqual([
      ['Ich bin Alex.', 'I am Alex.'],
      ['Das ist Frau Schulz.', 'This is Ms Schulz.'],
    ]);
    expect(askingName.table).toEqual([
      ['Ich heiße Alex.', 'My name is Alex.'],
      ['Wie heißt du?', 'What is your name? (familiar)'],
      ['Wie heißen Sie?', 'What is your name? (formal)'],
    ]);
    const rules = sessions[2].steps
      .filter((step) => step.kind === 'rule')
      .map((step) => JSON.stringify(step))
      .join(' ');
    expect(rules).not.toMatch(/Learn the forms as a set|stem|er \/ sie|Sie sind|yes\/no/);
    const completion = sessions[2].steps[3];
    expect(completion.kind).toBe('type');
    if (completion.kind !== 'type') throw new Error('Expected the original naming completion');
    expect(completion.prompt).toContain('Ich ___ Maria.');
    expect(checkFoundationWriting({ track: 'DE', writing: completion }, 'bin')).toBe(true);
    const recognition = sessions[2].steps[8];
    expect(recognition.kind).toBe('rule');
    if (recognition.kind !== 'rule') throw new Error('Expected the original name-question step');
    expect(recognition.body).toContain('Bist du Jonas?');
    expect(recognition.body).toContain('recognition-only');
    const question = sessions[2].steps[9];
    expect(question.kind).toBe('build');
    if (question.kind !== 'build') throw new Error('Expected the original question-building step');
    expect(question.answer).toEqual(['Wer', 'ist', 'das?']);
  });

  it('requires more than a question mark to identify the reply that returns the question', () => {
    const step = sessions[0].steps[9];
    expect(step.kind).toBe('choose');
    if (step.kind !== 'choose') throw new Error('Expected the original wellbeing choice');
    expect(step.options[step.answer]).toBe('Gut, danke. Und dir?');
    expect(step.options.filter((option) => option.endsWith('?')).length).toBeGreaterThan(1);
    expect(step.options).toContain('Bis später?');
  });

  it('describes the familiar party register without supplying the keyed German pronoun', () => {
    const step = sessions[3].steps[2];
    expect(step.kind).toBe('choose');
    if (step.kind !== 'choose') throw new Error('Expected the original party-register choice');
    expect(step.prompt).toContain('familiar form');
    expect(step.prompt).not.toMatch(/\bdu\b|\bSie\b/);
    expect(step.options[step.answer]).toBe('Hi, wie heißt du?');
  });
});
