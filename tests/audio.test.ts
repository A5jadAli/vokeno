import { readFileSync } from 'node:fs';

import { describe, expect, it } from '@jest/globals';

import { AUDIO_BUCKET, clipKey, findClip, LOUDNESS_FOLDER } from '@/features/audio/clips';
import { lessonLines, scenarioLines, spokenLines } from '@/features/audio/inventory';
import { castingFor, characters } from '@/features/audio/voices';
import { foundationLessons } from '@/features/foundations/catalog';
import { listeningScenarios } from '@/features/listening/scenarios';

const manifest = JSON.parse(readFileSync('src/features/audio/clips.json', 'utf8')) as {
  clips: Record<string, number>;
};
const recorded = new Set(Object.keys(manifest.clips));

describe('AI voices', () => {
  it('has a recorded clip for every line the app can speak', () => {
    const missing = spokenLines()
      .filter(
        (line) =>
          !recorded.has(
            clipKey(line.track, line.text, castingFor(line.track, line.speaker, line.reference)),
          ),
      )
      .map((line) => `${line.track} ${line.speaker ?? 'narrator'}: ${line.text}`);
    // Record new lines with: npx tsx --tsconfig tsconfig.json scripts/generate-lesson-audio.ts
    expect(missing).toEqual([]);
  });

  it('knows where the voice stops in every clip, so playback ends without trailing silence', () => {
    // Below 0.25 s there is no voice at all: the recording came back silent.
    const unmeasured = Object.entries(manifest.clips).filter(
      ([, end]) => !(end > 0.25 && end < 60),
    );
    expect(unmeasured).toEqual([]);
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

describe('loudness-normalised clips', () => {
  it('plays the normalised copy, keeps the original as a fallback and renames the device copy', () => {
    const previous = process.env.EXPO_PUBLIC_SUPABASE_URL;
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    try {
      const clip = findClip('ES', 'Buenas tardes.')!;
      const key = clipKey('ES', 'Buenas tardes.', castingFor('ES'));
      const take = Math.round(manifest.clips[key] * 100);
      const bucket = `https://example.supabase.co/storage/v1/object/public/${AUDIO_BUCKET}`;
      expect(clip.url).toBe(`${bucket}/${LOUDNESS_FOLDER}/${key}.mp3?take=${take}`);
      expect(clip.fallbackUrl).toBe(`${bucket}/${key}.mp3?take=${take}`);
      // A device that cached the original downloads the normalised copy instead of reusing it.
      expect(clip.key).toBe(`${key}.${LOUDNESS_FOLDER}.${take}`);
    } finally {
      process.env.EXPO_PUBLIC_SUPABASE_URL = previous;
    }
  });
});
