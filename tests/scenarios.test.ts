import { describe, expect, it } from '@jest/globals';

import { getScenario, getScenarios, listeningScenarios } from '@/features/listening/scenarios';

describe('listening scenario catalogue', () => {
  it.each(['EN', 'DE'] as const)('has a complete %s MVP track', (track) => {
    const scenarios = getScenarios(track);

    expect(scenarios.length).toBeGreaterThanOrEqual(6);
    expect(scenarios.every((scenario) => scenario.lines.length >= 2)).toBe(true);
    expect(scenarios.every((scenario) => scenario.phrases.length >= 3)).toBe(true);
  });

  it('has a Spanish A1–A2 listening set with regional metadata', () => {
    const scenarios = getScenarios('ES');
    expect(scenarios.length).toBeGreaterThanOrEqual(4);
    expect(scenarios.every((scenario) => scenario.language === 'es-MX')).toBe(true);
    expect(scenarios.every((scenario) => ['A1', 'A2'].includes(scenario.level))).toBe(true);
    expect(scenarios.every((scenario) => scenario.lines.length >= 3)).toBe(true);
  });

  it('uses unique ids and valid answer indexes', () => {
    const ids = listeningScenarios.map((scenario) => scenario.id);

    expect(new Set(ids).size).toBe(ids.length);
    listeningScenarios.forEach((scenario) => {
      expect(scenario.question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(scenario.question.correctIndex).toBeLessThan(scenario.question.options.length);
      expect(scenario.lines.every((line) => line.text && line.translation)).toBe(true);
    });
  });

  it('only lists phrases the learner actually hears, with a real plainer form', () => {
    const englishWords = /\b(the|you|my|with|is|and|I)\b/;
    for (const scenario of listeningScenarios) {
      const heardText = scenario.lines.map((line) => line.text.toLowerCase()).join(' ');
      expect([scenario.id, scenario.phrases.length >= 3 && scenario.phrases.length <= 4]).toEqual([
        scenario.id,
        true,
      ]);
      for (const phrase of scenario.phrases) {
        expect([scenario.id, heardText.includes(phrase.heard.toLowerCase())]).toEqual([
          scenario.id,
          true,
        ]);
        expect(phrase.meaning.trim()).toBeTruthy();
        if (phrase.plain === undefined) continue;
        expect(phrase.plain).not.toBe(phrase.heard);
        if (scenario.track !== 'EN')
          expect([phrase.plain, englishWords.test(phrase.plain)]).toEqual([phrase.plain, false]);
      }
    }
  });

  it('falls back safely for missing or invalid lesson ids', () => {
    expect(getScenario()).toBe(listeningScenarios[0]);
    expect(getScenario('not-real')).toBe(listeningScenarios[0]);
  });
});
