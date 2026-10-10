import { readFileSync } from 'node:fs';

import { describe, expect, it } from '@jest/globals';

import { clipKey } from '@/features/audio/clips';
import { lessonLines, scenarioLines, spokenLines } from '@/features/audio/inventory';
import { castingFor, characters } from '@/features/audio/voices';
import { foundationLessons } from '@/features/foundations/catalog';
import { listeningScenarios } from '@/features/listening/scenarios';

const recorded = new Set(
  (JSON.parse(readFileSync('src/features/audio/clips.json', 'utf8')) as { clips: string[] }).clips,
);

describe('AI voices', () => {
  it('has a recorded clip for every line the app can speak', () => {
    const missing = spokenLines()
      .filter(
        (line) =>
          !recorded.has(clipKey(line.track, line.text, castingFor(line.track, line.speaker))),
      )
      .map((line) => `${line.track} ${line.speaker ?? 'narrator'}: ${line.text}`);
    // Record new lines with: npx tsx --tsconfig tsconfig.json scripts/generate-lesson-audio.ts
    expect(missing).toEqual([]);
  });

  it('casts every character explicitly, never falling back to the narrator', () => {
    const uncast = [
      ...foundationLessons.flatMap(lessonLines),
      ...listeningScenarios.flatMap(scenarioLines),
    ]
      .filter((line) => line.speaker && !characters[line.track][line.speaker])
      .map((line) => `${line.track} ${line.speaker}`);
    expect([...new Set(uncast)]).toEqual([]);
  });

  it('gives different people in the same scene different voices', () => {
    const scenes = [
      ...foundationLessons.flatMap((lesson) =>
        lesson.format === 'steps'
          ? lesson.steps.flatMap((step) =>
              step.kind === 'scene'
                ? [{ track: lesson.track, speakers: step.lines.map((line) => line.speaker) }]
                : [],
            )
          : [],
      ),
      ...listeningScenarios.map((scenario) => ({
        track: scenario.track,
        speakers: scenario.lines.map((line) => line.speaker),
      })),
    ];
    for (const scene of scenes) {
      const people = [...new Set(scene.speakers)];
      const voices = people.map((person) => characters[scene.track][person]?.voice);
      expect([people.join(', '), new Set(voices).size]).toEqual([people.join(', '), people.length]);
    }
  });

  it('makes a new clip when the words or the voice change', () => {
    const lena = castingFor('DE', 'Lena');
    const key = clipKey('DE', 'Gut, danke.', lena);
    expect(clipKey('DE', '  Gut,  danke. ', lena)).toBe(key);
    expect(clipKey('DE', 'Gut, danke!', lena)).not.toBe(key);
    expect(clipKey('DE', 'Gut, danke.', castingFor('DE', 'Jonas'))).not.toBe(key);
    expect(clipKey('ES', 'Gut, danke.', lena)).not.toBe(key);
    expect(key).toMatch(/^[0-9a-z]{14}$/);
  });
});
