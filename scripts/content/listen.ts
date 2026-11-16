// npm run content:listen -- <unit-id>
//
// Listens to every recorded clip of a unit without a person: each clip is transcribed by a model
// that is not told the line, and the transcript is compared with the line word by word
// (src/features/take/heard.ts). A clip whose words were mostly not heard fails the unit; one that
// was nearly heard is listed for a person to try. This catches a voice that read the wrong thing.
// It cannot judge accent or naturalness.
//
// Needs EXPO_PUBLIC_SUPABASE_URL (from .env.local) and the OpenAI key (scripts/content/providers.ts).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

import { AUDIO_BUCKET, clipKey } from '@/features/audio/clips';
import { lessonLines } from '@/features/audio/inventory';
import { castingFor } from '@/features/audio/voices';
import { markHeard } from '@/features/take/heard';

import { unitSessions } from './lib';
import { apiKey } from './providers';

const unitId = process.argv[2];
const sessions = unitId ? unitSessions(unitId) : [];
if (!sessions.length) {
  console.error('Usage: npm run content:listen -- <unit-id>');
  process.exit(2);
}
const env = existsSync('.env.local') ? parseEnv(readFileSync('.env.local', 'utf8')) : {};
const base = process.env.EXPO_PUBLIC_SUPABASE_URL ?? env.EXPO_PUBLIC_SUPABASE_URL;
if (!base) {
  console.error('Set EXPO_PUBLIC_SUPABASE_URL (it is in the main tree’s .env.local).');
  process.exit(2);
}
const manifest = JSON.parse(readFileSync('src/features/audio/clips.json', 'utf8')) as {
  clips: Record<string, number>;
};
const MODEL = process.env.CONTENT_MODEL_TRANSCRIBE ?? 'gpt-4o-transcribe';
const { track } = sessions[0];
const language = { DE: 'de', ES: 'es', EN: 'en' }[track];

// One entry per clip: the same line by the same voice is one recording.
const clips = new Map<string, { text: string; speaker: string }>();
for (const line of sessions.flatMap(lessonLines)) {
  const key = clipKey(line.track, line.text, castingFor(line.track, line.speaker, line.reference));
  if (key in manifest.clips)
    clips.set(key, { text: line.text, speaker: line.speaker ?? 'narrator' });
}

async function transcribe(key: string) {
  const audio = await fetch(`${base}/storage/v1/object/public/${AUDIO_BUCKET}/${key}.mp3`);
  if (!audio.ok) throw new Error(`clip ${audio.status}`);
  const form = new FormData();
  form.append('file', new Blob([await audio.arrayBuffer()], { type: 'audio/mpeg' }), `${key}.mp3`);
  form.append('model', MODEL);
  form.append('language', language);
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey('openai')}` },
    body: form,
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`${response.status} ${(await response.text()).slice(0, 200)}`);
  return ((await response.json()) as { text: string }).text;
}

async function main() {
  const entries = [...clips.entries()];
  const results: { key: string; speaker: string; text: string; heard: string; verdict: string }[] =
    [];
  // Four at a time: quick, and gentle on the provider's rate limit.
  for (let index = 0; index < entries.length; index += 4)
    results.push(
      ...(await Promise.all(
        entries.slice(index, index + 4).map(async ([key, { text, speaker }]) => {
          try {
            const heard = await transcribe(key);
            return { key, speaker, text, heard, verdict: markHeard(text, heard, track).verdict };
          } catch (error) {
            return { key, speaker, text, heard: '', verdict: `error: ${(error as Error).message}` };
          }
        }),
      )),
    );

  const failed = results.filter((result) => result.verdict === 'not-yet');
  const errors = results.filter((result) => result.verdict.startsWith('error'));
  const near = results.filter((result) => result.verdict === 'almost');
  const dir = `artifacts/content/${unitId}`;
  mkdirSync(dir, { recursive: true });
  const cell = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  writeFileSync(
    `${dir}/LISTEN.md`,
    [
      `# Voice check: ${unitId}`,
      '',
      `${new Date().toISOString().slice(0, 10)}. ${results.length} clip(s) transcribed blind by ${MODEL}: ${results.length - failed.length - near.length - errors.length} heard in full, ${near.length} nearly, ${failed.length} not heard, ${errors.length} could not be checked.`,
      '',
      '| Result | Speaker | Line | Heard |',
      '| --- | --- | --- | --- |',
      ...[...failed, ...errors, ...near].map(
        (result) =>
          `| ${cell(result.verdict)} | ${cell(result.speaker)} | ${cell(result.text)} | ${cell(result.heard)} |`,
      ),
      '',
    ].join('\n'),
  );
  for (const result of failed)
    console.error(`NOT HEARD  ${result.speaker}: "${result.text}" was heard as "${result.heard}"`);
  for (const result of errors) console.error(`NOT CHECKED  "${result.text}": ${result.verdict}`);
  process.stdout.write(
    `${results.length} clip(s): ${failed.length} not heard, ${near.length} nearly, ${errors.length} unchecked. See ${dir}/LISTEN.md\n`,
  );
  process.exit(failed.length || errors.length ? 1 : 0);
}

void main();
