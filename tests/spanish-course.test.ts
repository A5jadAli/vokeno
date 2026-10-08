import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

import { curriculumUnits, examMockUnitIds } from '@/features/curriculum/catalog';
import { foundationLessons, getTrackLessons } from '@/features/foundations/catalog';
import { listeningScenarios } from '@/features/listening/scenarios';
import {
  evaluatePlacement,
  placementItems,
  placementStages,
  STAGE_SIZE,
} from '@/features/placement/items';
import { tasksForTrack, writingChecklist, writingTasks } from '@/features/writing/progress';

const read = (path: string) => readFileSync(join(__dirname, '..', path), 'utf8');

describe('app and server stay in step', () => {
  it('every live-coach unit in the app is whitelisted on the server for the same language', () => {
    const server = read('supabase/functions/realtime-session/index.ts');
    const block = server.slice(server.indexOf('const unitSettings = {'));
    for (const unit of curriculumUnits.filter((item) => !examMockUnitIds.includes(item.id))) {
      const entry = new RegExp(`'${unit.id}': \\{[^}]*?track: '(\\w\\w)'`, 's').exec(block);
      expect(entry?.[1]).toBe(unit.track);
    }
  });

  it('every writing task in the app has a server specification for the same language', () => {
    const server = read('supabase/functions/_shared/writing-tasks.ts');
    for (const [id, task] of Object.entries(writingTasks)) {
      const key = /^[a-z]+$/.test(id) ? `${id}: \\{` : `'${id}': \\{`;
      const entry = new RegExp(`${key}\\s*track: '(\\w\\w)'`).exec(server);
      expect(entry?.[1]).toBe(task.track);
    }
  });
});

describe('Spanish listening', () => {
  const spanish = listeningScenarios.filter((scenario) => scenario.track === 'ES');

  it('offers dialogues at A1 and A2 in Mexican Spanish', () => {
    expect(spanish.length).toBeGreaterThanOrEqual(10);
    expect(spanish.filter((scenario) => scenario.level === 'A2').length).toBeGreaterThanOrEqual(4);
    expect(spanish.every((scenario) => scenario.language === 'es-MX')).toBe(true);
  });

  it('gives every line a translation and every phrase a meaning', () => {
    for (const scenario of spanish) {
      expect(scenario.lines.length).toBeGreaterThanOrEqual(4);
      for (const line of scenario.lines) {
        expect(line.text.trim()).toBeTruthy();
        expect(line.translation.trim()).toBeTruthy();
      }
      for (const phrase of scenario.phrases) expect(phrase.meaning.trim()).toBeTruthy();
    }
  });

  it('balances the authored answer position so content is not biased even unshuffled', () => {
    const positions = spanish.map((scenario) => scenario.question.correctIndex);
    expect(new Set(positions).size).toBeGreaterThan(1);
  });
});

describe('Spanish placement', () => {
  const stages = placementStages('ES');
  const answerAll = (levels: number) =>
    Object.fromEntries(
      stages.flatMap((stage, index) =>
        stage.map((item) => [item.id, index < levels ? item.answer : (item.answer + 1) % 3]),
      ),
    );

  it('has three full stages from A1 to B1 with unique items', () => {
    expect(stages.map((stage) => stage[0].level)).toEqual(['A1', 'A2', 'B1']);
    for (const stage of stages) expect(stage).toHaveLength(STAGE_SIZE);
    const ids = placementItems.ES.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of placementItems.ES) {
      expect(new Set(item.options).size).toBe(item.options.length);
      expect(item.options[item.answer]).toBeTruthy();
    }
  });

  it('sends an absolute beginner to the first lesson', () => {
    const result = evaluatePlacement('ES', answerAll(0));
    expect(result.secure).toBeNull();
    expect(result.recommendation.href).toBe(`/foundation/${getTrackLessons('ES')[0].id}`);
  });

  it('starts someone secure at A1 on the first A2 lesson', () => {
    const result = evaluatePlacement('ES', answerAll(1));
    expect(result.secure).toBe('A1');
    const firstA2 = getTrackLessons('ES').find((lesson) => lesson.level === 'A2');
    expect(result.recommendation.href).toBe(`/foundation/${firstA2?.id}`);
  });

  it('sends learners beyond the guided path to the live coach', () => {
    for (const levels of [2, 3]) {
      const result = evaluatePlacement('ES', answerAll(levels));
      expect(result.recommendation.href).toBe('/conversation?track=ES');
    }
  });

  it('counts unanswered questions as not secure rather than crashing', () => {
    const result = evaluatePlacement('ES', {});
    expect(result.secure).toBeNull();
    expect(result.answered).toBe(0);
  });
});

describe('Spanish writing', () => {
  it('offers an informal message and a formal email', () => {
    expect(tasksForTrack('ES')).toEqual(['es-message', 'es-email']);
  });

  it('flags tú in the formal email, including accented forms', () => {
    const tips = writingChecklist('¿Puedes cambiar mi clase? Gracias.', 'es-email');
    expect(tips.some((tip) => tip.includes('usted'))).toBe(true);
    const formal = writingChecklist('¿Podría cambiar mi clase? Gracias.', 'es-email');
    expect(formal.some((tip) => tip.includes('use usted forms'))).toBe(false);
  });

  it('does not mistake tea (té) or words containing te for the pronoun', () => {
    const tips = writingChecklist(
      'Tomo té en la tarde. Estimado señor: necesito ayuda.',
      'es-email',
    );
    expect(tips.some((tip) => tip.includes('use usted forms'))).toBe(false);
  });

  it('suggests tú in the informal message', () => {
    const tips = writingChecklist('Hola Carla, ¿usted puede venir el miércoles?', 'es-message');
    expect(tips.some((tip) => tip.includes('tú sounds more natural'))).toBe(true);
  });

  it('reminds learners about the opening ¿ only when it is missing', () => {
    const missing = writingChecklist('Hola Carla. Nos vemos el miércoles?', 'es-message');
    expect(missing.some((tip) => tip.includes('open with ¿'))).toBe(true);
    const present = writingChecklist('Hola Carla. ¿Nos vemos el miércoles?', 'es-message');
    expect(present.some((tip) => tip.includes('open with ¿'))).toBe(false);
    const english = writingChecklist('Could I change my class?', 'letter');
    expect(english.some((tip) => tip.includes('open with ¿'))).toBe(false);
  });
});

describe('Spanish orthography', () => {
  it('opens every question with ¿ and every exclamation with ¡', () => {
    const texts: string[] = [];
    for (const lesson of getTrackLessons('ES')) {
      lesson.phrases.forEach((phrase) => texts.push(phrase.target));
      lesson.checks.forEach((check) => check.audio && texts.push(check.audio));
      if (lesson.reading) texts.push(lesson.reading.target, lesson.reading.spoken ?? '');
      texts.push(...lesson.writing.accepted);
    }
    for (const scenario of listeningScenarios.filter((item) => item.track === 'ES')) {
      scenario.lines.forEach((line) => texts.push(line.text));
      scenario.phrases.forEach((phrase) => texts.push(phrase.heard, phrase.plain ?? ''));
    }
    placementItems.ES.forEach((item) => item.audio && texts.push(item.audio));
    texts.push(writingTasks['es-message'].example, writingTasks['es-email'].example);
    const count = (text: string, mark: string) => text.split(mark).length - 1;
    const unbalanced = texts.filter(
      (text) => count(text, '?') !== count(text, '¿') || count(text, '!') !== count(text, '¡'),
    );
    expect(unbalanced).toEqual([]);
  });
});

describe('reading aloud', () => {
  it('gives every sign-style reading a spoken version, so audio never reads symbols', () => {
    const needsSpoken = /[$·→]|\d{1,2}:\d{2}/;
    for (const lesson of foundationLessons) {
      if (!lesson.reading || !needsSpoken.test(lesson.reading.target)) continue;
      expect([lesson.id, lesson.reading.spoken]).toEqual([lesson.id, expect.any(String)]);
      expect(lesson.reading.spoken).not.toMatch(needsSpoken);
    }
  });
});
