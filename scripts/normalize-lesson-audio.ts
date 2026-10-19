// Makes every recorded clip play at the same loudness. Voices come back from the speech model at
// different levels (a receptionist could be twice as loud as the learner's friend in the same
// scene), so each clip gets a loudness-normalised copy under `n1/` in the lesson-audio bucket, and
// the app plays that copy. Originals are never touched, so builds already installed keep working.
// Safe to stop and run again: clips that already have a copy are skipped.
//
//   npx tsx --tsconfig tsconfig.json scripts/normalize-lesson-audio.ts
//   npx tsx --tsconfig tsconfig.json scripts/normalize-lesson-audio.ts --redo-quiet
//
// --redo-quiet measures every existing copy and redoes the ones more than 1 LU under the target.
// Needs ffmpeg and a Supabase CLI linked to the project (storage writes go through it).
// generate-lesson-audio.ts runs this after recording, so new clips are covered too.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { AUDIO_BUCKET, LOUDNESS_FOLDER } from '@/features/audio/clips';

const MANIFEST = 'src/features/audio/clips.json';
/** Integrated loudness for speech on a phone speaker, with headroom below 0 dBFS. */
const TARGET = { I: -19, TP: -1.5, LRA: 11 };
const CHUNK = 150;
const PARALLEL = 12;

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .map((line) => line.match(/^([A-Z_]+)=(.*)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => [match[1], match[2].replace(/^["']|["']$/g, '')]),
);
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? env.EXPO_PUBLIC_SUPABASE_URL;
if (!url) throw new Error('Set EXPO_PUBLIC_SUPABASE_URL (from .env.local).');
const bucketUrl = `${url}/storage/v1/object/public/${AUDIO_BUCKET}`;

const supabase = (...args: string[]) =>
  execFileSync('npx', ['supabase', 'storage', ...args, '--experimental', '--linked'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });

const ffmpeg = (args: string[]) =>
  spawnSync('ffmpeg', ['-hide_banner', '-nostdin', ...args], { encoding: 'utf8' });

/** Keys that already have a normalised copy. */
function normalisedKeys() {
  const listed = JSON.parse(supabase('ls', `ss:///${AUDIO_BUCKET}/${LOUDNESS_FOLDER}/`)) as {
    paths: string[];
  };
  return new Set(
    listed.paths.map((path) =>
      path
        .split('/')
        .pop()!
        .replace(/\.mp3$/, ''),
    ),
  );
}

/** Integrated loudness of a file, in LUFS. */
function loudness(file: string) {
  const report = ffmpeg(['-nostats', '-i', file, '-af', 'ebur128', '-f', 'null', '-']).stderr;
  return Number([...report.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].at(-1)?.[1]);
}

/** Encodes in the originals' format: 24 kHz mono MP3 at 128 kbps. */
function encode(input: string, output: string, filter: string) {
  const run = ffmpeg(
    ['-loglevel', 'error', '-y', '-i', input, '-af', filter, '-ar', '24000'].concat([
      '-ac',
      '1',
      '-c:a',
      'libmp3lame',
      '-b:a',
      '128k',
      output,
    ]),
  );
  if (run.status !== 0) throw new Error(run.stderr);
}

/**
 * EBU R128 normalisation. First one linear gain (two passes: measure, then apply), which leaves
 * the voice untouched. A very short, peaky word cannot reach the target that way without going
 * over the peak ceiling, and loudnorm's own limiter needs three seconds of audio, so such a word
 * gets the missing gain with a fast peak limiter instead.
 */
function normalise(input: string, output: string) {
  const loudnorm = `loudnorm=I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}`;
  const report = ffmpeg([
    '-i',
    input,
    '-af',
    `${loudnorm}:print_format=json`,
    '-f',
    'null',
    '-',
  ]).stderr;
  const measured = JSON.parse(
    report.slice(report.lastIndexOf('{'), report.lastIndexOf('}') + 1),
  ) as {
    input_i: string;
    input_tp: string;
    input_lra: string;
    input_thresh: string;
    target_offset: string;
  };
  encode(
    input,
    output,
    `${loudnorm}:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}` +
      `:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}` +
      `:offset=${measured.target_offset}:linear=true`,
  );
  if (loudness(output) >= TARGET.I - 1) return;
  const gain = TARGET.I - Number(measured.input_i);
  const ceiling = (10 ** (TARGET.TP / 20)).toFixed(3);
  encode(
    input,
    output,
    `volume=${gain.toFixed(2)}dB,alimiter=limit=${ceiling}:attack=5:release=50:level=false`,
  );
}

async function download(path: string) {
  for (let attempt = 1; ; attempt++) {
    try {
      // A fresh query skips the CDN, which may still hold an earlier take.
      const response = await fetch(`${bucketUrl}/${path}?fresh=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      if (attempt === 4) throw new Error(`Could not download ${path}: ${String(error)}`);
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
}

/** Runs `job` over `keys`, a few at a time: a burst of parallel downloads gets dropped. */
async function eachKey(keys: string[], job: (key: string) => Promise<void>) {
  let next = 0;
  const worker = async () => {
    while (next < keys.length) await job(keys[next++]);
  };
  await Promise.all(Array.from({ length: PARALLEL }, worker));
}

/** Normalises the given clips and uploads the copies into the loudness folder. */
async function normaliseAndUpload(keys: string[], work: string) {
  for (let start = 0; start < keys.length; start += CHUNK) {
    const chunk = keys.slice(start, start + CHUNK);
    const outDir = join(work, `chunk-${start}`);
    mkdirSync(outDir);
    await eachKey(chunk, async (key) => {
      const original = join(work, `${key}.orig.mp3`);
      writeFileSync(original, await download(`${key}.mp3`));
      normalise(original, join(outDir, `${key}.mp3`));
    });
    // `storage cp -r` behaves like Unix cp: into a folder that exists it adds a subfolder. So
    // upload to a new staging folder (files land directly in it), then move them into place,
    // which puts them directly in the target folder whether or not it exists yet.
    const staging = `ss:///${AUDIO_BUCKET}/_staging/${Date.now()}-${start}`;
    supabase('cp', '-r', outDir, staging, '--content-type', 'audio/mpeg', '-j', '6');
    supabase('mv', '-r', staging, `ss:///${AUDIO_BUCKET}/${LOUDNESS_FOLDER}`);
    process.stdout.write(`${Math.min(start + CHUNK, keys.length)}/${keys.length}\n`);
  }
}

/** Copies more than 1 LU under the target, from an earlier version of this script. */
async function quietCopies(keys: string[], work: string) {
  const quiet: string[] = [];
  await eachKey(keys, async (key) => {
    const copy = join(work, `${key}.n.mp3`);
    writeFileSync(copy, await download(`${LOUDNESS_FOLDER}/${key}.mp3`));
    if (loudness(copy) < TARGET.I - 1) quiet.push(key);
    rmSync(copy);
  });
  return quiet;
}

async function main() {
  const clips = Object.keys(
    (JSON.parse(readFileSync(MANIFEST, 'utf8')) as { clips: Record<string, number> }).clips,
  );
  const have = normalisedKeys();
  const work = mkdtempSync(join(tmpdir(), 'voka-loudness-'));
  try {
    if (process.argv.includes('--redo-quiet')) {
      const quiet = await quietCopies(
        clips.filter((key) => have.has(key)),
        work,
      );
      process.stdout.write(`${quiet.length} copies are more than 1 LU too quiet.\n`);
      // The CLI cannot overwrite, so remove first. Until the new copy lands, the app falls back
      // to the original recording.
      for (let start = 0; start < quiet.length; start += 50)
        supabase(
          'rm',
          '--yes',
          ...quiet
            .slice(start, start + 50)
            .map((key) => `ss:///${AUDIO_BUCKET}/${LOUDNESS_FOLDER}/${key}.mp3`),
        );
      await normaliseAndUpload(quiet, work);
    }
    const present = normalisedKeys();
    const todo = clips.filter((key) => !present.has(key));
    process.stdout.write(`${clips.length - todo.length} clips normalised, ${todo.length} to do.\n`);
    await normaliseAndUpload(todo, work);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  const after = normalisedKeys();
  const missing = clips.filter((key) => !after.has(key));
  if (missing.length) {
    process.stdout.write(`${missing.length} clips still have no normalised copy; run again.\n`);
    process.exitCode = 1;
  } else process.stdout.write('Every clip has a normalised copy.\n');
}

void main();
