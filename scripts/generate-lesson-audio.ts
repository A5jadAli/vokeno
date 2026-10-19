// Records every spoken line that has no clip yet, through the admin-only lesson-audio function,
// and adds it to src/features/audio/clips.json with the moment the voice stops. Safe to stop and
// run again: it resumes.
//
//   npx tsx --tsconfig tsconfig.json scripts/generate-lesson-audio.ts
//
// Needs EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY (from .env.local).
// Keep LESSON_AUDIO_TOKEN in ignored .env.audio.local or supply it through the environment.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

import { AUDIO_BUCKET, clipKey, fullDirection, spokenForm } from '@/features/audio/clips';
import { spokenLines } from '@/features/audio/inventory';
import { castingFor } from '@/features/audio/voices';

import { measureEnds, SILENT } from './clip-ends';

const MANIFEST = 'src/features/audio/clips.json';
const BATCH = 8;
const PARALLEL = 2;

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .map((line) => line.match(/^([A-Z_]+)=(.*)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => [match[1], match[2].replace(/^["']|["']$/g, '')]),
);
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? env.EXPO_PUBLIC_SUPABASE_URL;
const apikey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const audioEnv = existsSync('.env.audio.local')
  ? parseEnv(readFileSync('.env.audio.local', 'utf8'))
  : {};
const token = process.env.LESSON_AUDIO_TOKEN ?? audioEnv.LESSON_AUDIO_TOKEN;
if (!url || !apikey || !token) throw new Error('Set LESSON_AUDIO_TOKEN and the Supabase URL/key.');

// Each recorded clip, with the second at which the voice stops (0 until it is measured).
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as { clips: Record<string, number> };
// A clip measured as silent is recorded again.
const ends = new Map(
  Object.entries(manifest.clips).filter(([, end]) => !(end > 0 && end <= SILENT)),
);
const done = new Set(ends.keys());
const save = () => {
  const clips = Object.fromEntries([...done].sort().map((key) => [key, ends.get(key) ?? 0]));
  writeFileSync(MANIFEST, `${JSON.stringify({ clips }, null, 2)}\n`);
};

const todo = new Map<string, { key: string; text: string; voice: string; instructions: string }>();
for (const line of spokenLines()) {
  const casting = castingFor(line.track, line.speaker);
  const key = clipKey(line.track, line.text, casting);
  if (done.has(key) || todo.has(key)) continue;
  todo.set(key, {
    key,
    text: spokenForm(line.text),
    voice: casting.voice,
    instructions: fullDirection(line.track, casting),
  });
}

const batches: (typeof todo extends Map<string, infer V> ? V : never)[][] = [];
const items = [...todo.values()];
for (let index = 0; index < items.length; index += BATCH)
  batches.push(items.slice(index, index + BATCH));
process.stdout.write(`${done.size} clips already recorded, ${items.length} to record.\n`);

let failed = 0;
async function run(batch: (typeof batches)[number]) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(`${url}/functions/v1/lesson-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey, 'x-voka-audio': token! },
      body: JSON.stringify({ items: batch }),
    });
    if (response.ok) {
      const { results } = (await response.json()) as { results: { key: string; ok: boolean }[] };
      const missing = results.filter((result) => !result.ok);
      results.filter((result) => result.ok).forEach((result) => done.add(result.key));
      if (!missing.length) return;
      batch = batch.filter((item) => missing.some((result) => result.key === item.key));
    }
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
  }
  failed += batch.length;
  console.error(`Could not record: ${batch.map((item) => item.text).join(' | ')}`);
}

async function main() {
  for (let index = 0; index < batches.length; index += PARALLEL) {
    await Promise.all(batches.slice(index, index + PARALLEL).map(run));
    save();
    process.stdout.write(
      `${Math.min(index + PARALLEL, batches.length)}/${batches.length} batches\n`,
    );
  }
  save();
  const unmeasured = new Map(
    [...done]
      .filter((key) => !ends.get(key))
      // A fresh query skips the CDN, which may still hold an earlier take.
      .map((key) => [
        key,
        `${url}/storage/v1/object/public/${AUDIO_BUCKET}/${key}.mp3?fresh=${Date.now()}`,
      ]),
  );
  if (unmeasured.size) {
    process.stdout.write(`Finding where the voice stops in ${unmeasured.size} clips.\n`);
    const measured = await measureEnds(unmeasured, (count) => {
      if (count % 100 === 0) process.stdout.write(`${count}/${unmeasured.size}\n`);
    });
    measured.forEach((end, key) => ends.set(key, end));
    // Now and then the voice comes back empty: drop those clips so the next run records them again.
    const silent = [...measured].filter(([, end]) => end <= SILENT).map(([key]) => key);
    silent.forEach((key) => {
      done.delete(key);
      ends.delete(key);
    });
    save();
    if (silent.length) {
      failed += silent.length;
      process.stdout.write(`${silent.length} clips came back silent.\n`);
    }
  }
  process.stdout.write(
    failed ? `Done with ${failed} failures; run again to retry.\n` : 'All clips recorded.\n',
  );
  if (failed) process.exitCode = 1;
  // New clips get a loudness-normalised copy too, so every voice plays at the same level.
  execFileSync('npx', ['tsx', '--tsconfig', 'tsconfig.json', 'scripts/normalize-lesson-audio.ts'], {
    stdio: 'inherit',
  });
}

void main();
