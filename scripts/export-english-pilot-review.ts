// Derived review material. Record reviewer decisions in english-a1-pilot-review.md, not these
// generated files. Regenerate after editing content or recording audio: node --import tsx ...
import { readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { englishA1Units } from '../src/features/foundations/english-a1-units';
import { contentVersion } from '../src/features/foundations/progress';
import { spokenLines, stepLines } from '../src/features/audio/inventory';
import { clipKey, AUDIO_BUCKET, LOUDNESS_FOLDER } from '../src/features/audio/clips';
import { castingFor } from '../src/features/audio/voices';
import { buildEnglishReviewPage } from './english-review-page';

const env = parseEnv(readFileSync('.env.local', 'utf8'));
const base = process.env.EXPO_PUBLIC_SUPABASE_URL ?? env.EXPO_PUBLIC_SUPABASE_URL;
if (!base) throw new Error('Set the public Supabase URL for the audio links.');
const manifest = JSON.parse(readFileSync('src/features/audio/clips.json', 'utf8')) as {
  clips: Record<string, number>;
};
const text = (value: string) => value.replace(/\n/g, ' / ');
const table = (value: string) => text(value).replace(/\|/g, '\\|');
const csv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
const rows: (string | number)[][] = [
  [
    'lesson',
    'content_version',
    'step',
    'speaker',
    'model_variety',
    'voice',
    'script',
    'key',
    'voice_end_seconds',
    'recording_url',
    'recording_status',
  ],
];
const out = [
  '# English A1 pilot scripts',
  '',
  'Generated from the application content. Human review is pending. See [review instructions](english-a1-pilot-review.md) and [recording inventory](english-a1-pilot-audio.csv). Do not mark a script approved without checking its current content version and associated audio.',
];
for (const lesson of englishA1Units) {
  const version = contentVersion(lesson);
  out.push(
    '',
    `## ${lesson.id}: ${lesson.title}`,
    '',
    `Unit ${lesson.unit.number}. ${lesson.session}. Version: \`${version}\`. Estimated ${lesson.minutes} minutes.`,
    '',
    `Outcome: ${lesson.outcome}`,
  );
  lesson.steps.forEach((step, index) => {
    out.push('', `### Step ${index + 1}: ${step.kind}`, '');
    if ('title' in step) out.push(`**${step.title}**`, '');
    if ('prompt' in step) out.push(step.prompt, '');
    if ('context' in step && step.context) out.push(`Supplied text: ${text(step.context)}`, '');
    if ('audio' in step && step.audio) out.push(`Listen first: ${step.audio}`, '');
    if (step.kind === 'scene') {
      out.push(step.intro, '');
      for (const line of step.lines)
        out.push(`- **${line.speaker}:** ${line.text} (${line.meaning})`);
      if (step.note) out.push('', step.note);
    }
    if (step.kind === 'teach') {
      out.push('| Target | Meaning support | Note |', '| --- | --- | --- |');
      for (const item of step.items)
        out.push(`| ${table(item.target)} | ${table(item.meaning)} | ${table(item.note ?? '')} |`);
    }
    if (step.kind === 'rule')
      out.push(step.body, '', ...(step.examples ?? []).map((example) => `- ${example}`));
    if (step.kind === 'choose')
      for (const [option, value] of step.options.entries())
        out.push(`- ${value}${option === step.answer ? ' **(key)**' : ''}`);
    if (step.kind === 'type')
      out.push(`Accepted bounded replies: ${step.accepted.join(' / ')}`, '', `Hint: ${step.hint}`);
    if (step.kind === 'build')
      out.push(
        `Model tile order: ${step.answer.join(' ')}`,
        '',
        `Extra tiles: ${step.extra?.join(' / ') || 'None'}`,
      );
    if (step.kind === 'match')
      for (const [left, right] of step.pairs) out.push(`- ${left} → ${right}`);
    if (step.kind === 'form')
      for (const field of step.fields)
        out.push(`- ${field.label}: ${field.accepted.join(' / ')}. Hint: ${field.hint}`);
    if ('explanation' in step) out.push('', `Feedback and answer rationale: ${step.explanation}`);
    if (step.kind === 'speak') {
      out.push(
        'Unscored self-practice. Models are hidden until requested.',
        '',
        ...step.lines.map((line) => `- Model: ${line}`),
      );
      if (step.tip) out.push('', `Tip: ${step.tip}`);
      if (step.mission)
        out.push(
          '',
          ...step.mission.checks.map((check) => `- Self-check: ${check}`),
          '',
          `Changed situation: ${step.mission.twist}`,
        );
    }
    for (const line of stepLines('EN', step)) {
      for (const reference of line.speaker ? (['en-GB'] as const) : (['en-GB', 'en-US'] as const)) {
        const casting = castingFor('EN', line.speaker, reference);
        const key = clipKey('EN', line.text, casting);
        const end = manifest.clips[key];
        rows.push([
          lesson.id,
          version,
          index + 1,
          line.speaker ?? 'Model narrator',
          casting.reference ?? 'en-GB',
          casting.voice,
          line.text,
          key,
          end ?? '',
          `${base}/storage/v1/object/public/${AUDIO_BUCKET}/${LOUDNESS_FOLDER}/${key}.mp3?take=${Math.round((end ?? 0) * 100)}`,
          end > 0.25 ? 'Recorded; human listening review pending' : 'Recording missing',
        ]);
      }
    }
  });
}
writeFileSync('docs/english-a1-pilot-scripts.md', `${out.join('\n')}\n`);
writeFileSync(
  'docs/english-a1-pilot-audio.csv',
  `${rows.map((row) => row.map(csv).join(',')).join('\n')}\n`,
);
// M1 also adds American narrator models to the earlier English library. Include those
// recordings separately so the variety change can be reviewed beyond the three-unit pilot.
const models: (string | number)[][] = [
  [
    'speaker',
    'model_variety',
    'voice',
    'script',
    'key',
    'voice_end_seconds',
    'recording_url',
    'review_status',
  ],
];
const seen = new Set<string>();
for (const line of spokenLines().filter((line) => line.track === 'EN')) {
  const casting = castingFor('EN', line.speaker, line.reference);
  const key = clipKey('EN', line.text, casting);
  if (seen.has(key)) continue;
  seen.add(key);
  const end = manifest.clips[key];
  models.push([
    line.speaker ?? 'Model narrator',
    casting.reference ?? 'en-GB',
    casting.voice,
    line.text,
    key,
    end ?? '',
    `${base}/storage/v1/object/public/${AUDIO_BUCKET}/${LOUDNESS_FOLDER}/${key}.mp3?take=${Math.round((end ?? 0) * 100)}`,
    end > 0.25 ? 'Human listening review pending' : 'Recording missing',
  ]);
}
writeFileSync(
  'docs/english-audio-models.csv',
  `${models.map((row) => row.map(csv).join(',')).join('\n')}\n`,
);
process.stdout.write(
  `Exported ${englishA1Units.length} sessions and ${rows.length - 1} audio references. Human review remains pending.\n`,
);
writeFileSync('docs/english-m3-review.html', buildEnglishReviewPage(englishA1Units, rows));
