// npm run content:lessons -- <unit-id>
//
// How the pipeline learns from its own defects (docs/content-pipeline.md). After a unit has been
// through review, one model reads what the reviewers found and what was done about it, and
// proposes at most two short, general rules that the authors' guide does not already cover. They
// are added to docs/content-lessons.md, which every author stage reads. Each rule names the unit
// it came from and arrives in git with that unit, so a person can see it and remove it.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { addLessons, type Lesson } from './lib';
import { askJson } from './providers';

const FILE = 'docs/content-lessons.md';
const unitId = process.argv[2];
const record = `docs/content-review/${unitId}.md`;
if (!unitId || !existsSync(record) || !existsSync(FILE)) {
  console.error('Usage: npm run content:lessons -- <unit-id>   (after the unit has been reviewed)');
  process.exit(2);
}

const read = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : '');
const dir = `artifacts/content/${unitId}`;
const rounds = existsSync(dir)
  ? readdirSync(dir)
      .filter((name) => /^PANEL-round-?\d+\.md$/.test(name))
      .sort()
      .map((name) => `### ${name}\n\n${read(join(dir, name))}`)
  : [];
if (!rounds.length) {
  process.stdout.write('No panel rounds to learn from.\n');
  process.exit(0);
}
const guide = read('docs/content-pipeline.md');
const authorsGuide = guide.slice(
  guide.indexOf('## For the author'),
  guide.indexOf('## Keeping the pipeline honest'),
);
const current = read(FILE);

const system = `You keep the house rules for the authors of a mobile language course. Below are the review findings for one unit, round by round; the author's record of what was checked and done about each; the judges' verdicts, if there were any; the authors' guide; and the house rules learned from earlier units.

Propose at most two new rules for future authors. Propose a rule only when all of these hold:
- the record or the judges show the defect was real: it was fixed, or the judges upheld it;
- the same mistake could happen in another unit or another language;
- the rule says what to do, in one sentence of at most 30 words, and a reviewer could check it;
- neither the guide nor the existing house rules already say it, in any words.

Most units teach nothing new about writing units: then return an empty list. Never state a fact about this unit alone, and never repeat a rule in other words.

Return JSON only: {"rules":[{"rule":"...","because":"the finding it comes from, in at most 12 words"}]}`;

const material = [
  '## Review findings',
  ...rounds,
  '## Judges',
  read(join(dir, 'ARBITER.md')) || 'No arbiter was needed.',
  "## The author's record",
  read(record),
  "## The authors' guide",
  authorsGuide,
  '## House rules so far',
  current,
].join('\n\n');

async function main() {
  const reply = await askJson<{ rules?: Lesson[] }>('openai', system, material);
  const proposed = (Array.isArray(reply.rules) ? reply.rules : []).filter(
    (item) => typeof item?.rule === 'string' && item.rule.trim(),
  );
  const result = addLessons(current, proposed, unitId, new Date().toISOString().slice(0, 10));
  if (result.added) writeFileSync(FILE, result.text);
  process.stdout.write(
    result.full
      ? `The lessons file has ${result.count} rules, the most it holds: prune it before more are added.\n`
      : `${result.added} rule(s) added to ${FILE} (${proposed.length} proposed).\n`,
  );
}

void main();
