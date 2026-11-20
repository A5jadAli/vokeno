// npm run content:listen -- <unit-id>
//
// Listens to every recorded clip of a unit without a person. Three transcribers from two
// companies, none told the line, each write down what they hear; a word counts as heard when
// most of them heard it (scripts/content/lib.ts, heardByMost). A clip new in this job that most
// listeners mishear fails the unit, and the harness records it again; a clip that was already in
// the app is reported, not failed. This catches a voice that said the wrong thing or swallowed a
// word. It cannot judge accent or naturalness.
//
// Needs EXPO_PUBLIC_SUPABASE_URL (from .env.local) and the OpenAI and Gemini keys
// (scripts/content/providers.ts). Writes LISTEN.md and listen.json in artifacts/content/<id>/.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

import { AUDIO_BUCKET, clipKey } from '@/features/audio/clips';
import { lessonLines } from '@/features/audio/inventory';
import { castingFor } from '@/features/audio/voices';

import { heardByMost, unitSessions } from './lib';
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
  console.error('Set EXPO_PUBLIC_SUPABASE_URL (it is in the main folder’s .env.local).');
  process.exit(2);
}
const MANIFEST = 'src/features/audio/clips.json';
const recorded = (JSON.parse(readFileSync(MANIFEST, 'utf8')) as { clips: Record<string, number> })
  .clips;
// Clips already on main belong to earlier units: reported, never failed or recorded again here.
const live = (() => {
  try {
    return (
      JSON.parse(execFileSync('git', ['show', `main:${MANIFEST}`], { encoding: 'utf8' })) as {
        clips: Record<string, number>;
      }
    ).clips;
  } catch {
    return {};
  }
})();

const { track } = sessions[0];
const code = { DE: 'de', ES: 'es', EN: 'en' }[track];
const language = { DE: 'German', ES: 'Spanish', EN: 'English' }[track];
const GEMINI = process.env.CONTENT_MODEL_LISTEN_GEMINI ?? 'gemini-3.5-flash';
const LISTENERS = ['gpt-4o-transcribe', 'whisper-1', GEMINI];

// One entry per clip: the same line by the same voice is one recording.
const clips = new Map<string, { text: string; speaker: string }>();
for (const line of sessions.flatMap(lessonLines)) {
  const key = clipKey(line.track, line.text, castingFor(line.track, line.speaker, line.reference));
  if (key in recorded) clips.set(key, { text: line.text, speaker: line.speaker ?? 'narrator' });
}

async function openai(model: string, audio: Blob, key: string) {
  const form = new FormData();
  form.append('file', audio, `${key}.mp3`);
  form.append('model', model);
  form.append('language', code);
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey('openai')}` },
    body: form,
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`${response.status}`);
  return ((await response.json()) as { text: string }).text;
}

async function gemini(audio: ArrayBuffer) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI}:generateContent`,
    {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey('gemini'), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: 'audio/mpeg',
                  data: Buffer.from(audio).toString('base64'),
                },
              },
              {
                text: `Transcribe this ${language} audio exactly, word for word. Reply with the transcript only.`,
              },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(120_000),
    },
  );
  if (!response.ok) throw new Error(`${response.status}`);
  const body = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return (body.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
    .trim();
}

async function check(key: string, text: string) {
  // A fresh query skips the CDN, which may still hold an earlier take of a re-recorded clip.
  const download = await fetch(
    `${base}/storage/v1/object/public/${AUDIO_BUCKET}/${key}.mp3?fresh=${Date.now()}`,
  );
  if (!download.ok) throw new Error(`clip ${download.status}`);
  const audio = await download.arrayBuffer();
  const blob = new Blob([audio], { type: 'audio/mpeg' });
  const transcripts = await Promise.all([
    openai('gpt-4o-transcribe', blob, key).catch(() => ''),
    openai('whisper-1', blob, key).catch(() => ''),
    gemini(audio).catch(() => ''),
  ]);
  const result = heardByMost(text, transcripts, track);
  if (result.listeners < 2) throw new Error('fewer than two transcribers answered');
  return { transcripts, ...result };
}

type Result = {
  key: string;
  speaker: string;
  text: string;
  isNew: boolean;
  verdict: 'heard' | 'not heard' | 'unchecked';
  transcripts: string[];
  missed: string[];
};

async function main() {
  const entries = [...clips.entries()];
  const results: Result[] = [];
  // Four clips at a time: quick, and gentle on the providers' rate limits.
  for (let index = 0; index < entries.length; index += 4)
    results.push(
      ...(await Promise.all(
        entries.slice(index, index + 4).map(async ([key, { text, speaker }]): Promise<Result> => {
          const isNew = !(key in live);
          try {
            const result = await check(key, text);
            return {
              key,
              speaker,
              text,
              isNew,
              verdict: result.heard ? 'heard' : 'not heard',
              transcripts: result.transcripts,
              missed: result.words.filter((word) => !word.heard).map((word) => word.text),
            };
          } catch (error) {
            return {
              key,
              speaker,
              text,
              isNew,
              verdict: 'unchecked',
              transcripts: [(error as Error).message],
              missed: [],
            };
          }
        }),
      )),
    );

  const failed = results.filter((result) => result.verdict === 'not heard' && result.isNew);
  const older = results.filter((result) => result.verdict === 'not heard' && !result.isNew);
  const unchecked = results.filter((result) => result.verdict === 'unchecked');
  const dir = `artifacts/content/${unitId}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/listen.json`, `${JSON.stringify({ failed, older, unchecked }, null, 2)}\n`);
  const cell = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const row = (result: Result) =>
    `| ${result.verdict}${result.isNew ? '' : ' (already in the app)'} | ${cell(result.speaker)} | ${cell(result.text)} | ${cell(result.missed.join(' '))} | ${result.transcripts.map(cell).join('<br>')} |`;
  writeFileSync(
    `${dir}/LISTEN.md`,
    [
      `# Voice check: ${unitId}`,
      '',
      `${new Date().toISOString().slice(0, 10)}. ${results.length} clip(s), each transcribed blind by ${LISTENERS.join(', ')}; a word counts as heard when most of them heard it. ${results.length - failed.length - older.length - unchecked.length} heard in full, ${failed.length} new clip(s) not heard, ${older.length} older clip(s) not heard, ${unchecked.length} could not be checked.`,
      '',
      '| Result | Speaker | Line | Missed | Heard by each |',
      '| --- | --- | --- | --- | --- |',
      ...[...failed, ...unchecked, ...older].map(row),
      '',
    ].join('\n'),
  );
  for (const result of failed)
    console.error(
      `NOT HEARD  ${result.speaker}: "${result.text}" (missed: ${result.missed.join(' ')})`,
    );
  for (const result of unchecked)
    console.error(`NOT CHECKED  "${result.text}": ${result.transcripts[0]}`);
  process.stdout.write(
    `${results.length} clip(s): ${failed.length} not heard, ${unchecked.length} unchecked, ${older.length} older not heard. See ${dir}/LISTEN.md\n`,
  );
  process.exit(failed.length || unchecked.length ? 1 : 0);
}

void main();
