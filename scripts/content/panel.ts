// npm run content:panel -- <unit-id> [--skip native|teacher|solver]
//
// Three models from three other companies each review one unit on their own (docs/content-
// pipeline.md). None of them wrote it and none sees another's findings. The result goes to
// artifacts/content/<unit-id>/ and the command fails while a blocker or major finding stands.
//
// Keys and models: scripts/content/providers.ts.
import { mkdirSync, writeFileSync } from 'node:fs';
import { contentVersion } from '../../src/features/foundations/progress';
import { exams } from '../../src/features/foundations/level-status';
import { knownBefore, renderUnit, unitProblems, unitSessions } from './lib';
import { askJson, MODELS, type Provider } from './providers';

type Role = 'native' | 'teacher' | 'solver';
type Finding = {
  severity: 'blocker' | 'major' | 'minor';
  ref: string;
  quote: string;
  problem: string;
  fix: string;
  confidence: 'high' | 'medium' | 'low';
};

const args = process.argv.slice(2);
const unitId = args.find((arg) => !arg.startsWith('--'));
const skip = new Set(args.flatMap((arg, index) => (arg === '--skip' ? [args[index + 1]] : [])));
const sessions = unitId ? unitSessions(unitId) : [];
if (!unitId || !sessions.length) {
  console.error('Usage: npm run content:panel -- <unit-id> [--skip native|teacher|solver]');
  process.exit(2);
}

const { track, level } = sessions[0];
const language = { DE: 'German', ES: 'Spanish', EN: 'English' }[track];
const variety = {
  DE: 'German as spoken in Germany today',
  ES: 'Mexican Spanish as spoken today (the course reference), noting where Spain differs',
  EN: 'both American and British English as spoken today',
}[track];
const exam = exams[track]?.[level] ?? `CEFR ${level}`;

const roles: Record<Role, { provider: Provider; model: string; brief: string }> = {
  native: {
    provider: 'gemini',
    model: MODELS.gemini,
    brief: `You are a native speaker of ${variety}, in your thirties, who also teaches it. Say every ${language} line in your head: would a person in this situation really say it this way today? Check the careful lines and the "as people say it" lines, the register and regional claims, the cultural notes, spelling, punctuation and accents, and that each English meaning is what the line means.`,
  },
  teacher: {
    provider: 'openai',
    model: MODELS.openai,
    brief: `You are an experienced ${language} teacher and ${exam} examiner. Judge whether the unit delivers its can-do statement at CEFR ${level}; whether each rule is accurate and not over-general; whether a teach entry merges two words or chunks into one so that a session looks lighter than it is (a major finding); whether a marked step needs a word or structure that neither this unit nor the "taught earlier" list has taught; whether any exam-style task matches the real ${exam} format; and whether a session asks a beginner to hold too much at once.`,
  },
  solver: {
    provider: 'xai',
    model: MODELS.xai,
    brief: `You are a sharp learner trying to break the answer keys. Answer every marked step yourself before you read its key. Report: a correct answer the key rejects; an option other than the key that can be defended; an accepted answer that is wrong; tiles that build another correct sentence that is not accepted; a question whose details contradict the scene; and any step that can be answered without knowing ${language}. For rejected answers, make one finding per step that lists every correct answer you can think of at once, not one example. A rejected answer is a blocker only when every word and form in it is taught in this unit or the "taught earlier" list; otherwise it is minor. Answers are compared without capital letters or punctuation, so those differences are never findings.`,
  },
};

const shared = `You are one of three independent reviewers of one unit of a mobile ${language} course for adults, explained in English. The unit is shown as plain text; each step has a reference in square brackets such as [2.7].

Report only real problems that would harm a learner. Do not praise, summarise or restate the unit. Do not invent problems to seem useful: an empty list is a valid answer. Quote the exact text you object to.

Severity:
- blocker: it teaches something wrong; a key marks a correct answer wrong or a wrong answer right; a line a voice would read badly.
- major: language a native speaker would not use in this situation; a level that is too high; untaught language needed for a marked answer; a misleading explanation or cultural claim.
- minor: style, or a better alternative to something that is already acceptable.

Return JSON only, in this shape:
{"findings":[{"severity":"blocker|major|minor","ref":"2.7","quote":"exact text","problem":"what is wrong and why","fix":"the exact replacement text","confidence":"high|medium|low"}]}`;

const earlier = knownBefore(sessions[0]);
const material = [
  renderUnit(sessions),
  '',
  `## Taught earlier in the course (${earlier.length} items, rule tables included)`,
  earlier.join(' · ') || 'Nothing: this is the first unit.',
].join('\n');

async function ask(role: Role): Promise<Finding[]> {
  const { provider, brief } = roles[role];
  const reply = await askJson<{ findings?: Finding[] }>(
    provider,
    `${shared}\n\nYour role: ${brief}`,
    material,
  );
  if (!Array.isArray(reply.findings)) throw new Error('The reply had no findings list.');
  return reply.findings;
}

const version = sessions.map(contentVersion).join(' ');
const dir = `artifacts/content/${unitId}`;
mkdirSync(dir, { recursive: true });

async function main() {
  const active = (Object.keys(roles) as Role[]).filter((role) => !skip.has(role));
  const results = await Promise.all(
    active.map(async (role) => {
      try {
        return { role, findings: await ask(role), error: '' };
      } catch (error) {
        return { role, findings: [] as Finding[], error: String((error as Error).message) };
      }
    }),
  );

  const order = { blocker: 0, major: 1, minor: 2 };
  const all = results
    .flatMap(({ role, findings }) => findings.map((finding) => ({ role, ...finding })))
    .sort((a, b) => order[a.severity] - order[b.severity] || a.ref.localeCompare(b.ref));
  const standing = all.filter(
    (finding) => finding.severity !== 'minor' && finding.confidence !== 'low',
  );
  const failed = results.filter((result) => result.error);
  const standard = unitProblems(sessions);

  const cell = (value: string) => String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  writeFileSync(
    `${dir}/panel.json`,
    JSON.stringify({ unitId, version, at: new Date().toISOString(), roles, results }, null, 2),
  );
  writeFileSync(
    `${dir}/PANEL.md`,
    [
      `# Panel review: ${unitId}`,
      '',
      `${new Date().toISOString().slice(0, 10)}. Content versions: \`${version}\`.`,
      '',
      ...results.map(
        ({ role, findings, error }) =>
          `- **${role}** (${roles[role].model}): ${error ? `not run: ${error}` : `${findings.length} finding(s)`}`,
      ),
      ...[...skip].map((role) => `- **${role}**: skipped by hand`),
      `- **content standard**: ${standard.length ? standard.join('; ') : 'met'}`,
      '',
      '| Severity | Step | Reviewer | Confidence | Quote | Problem | Fix |',
      '| --- | --- | --- | --- | --- | --- | --- |',
      ...all.map(
        (f) =>
          `| ${f.severity} | ${cell(f.ref)} | ${f.role} | ${f.confidence} | ${cell(f.quote)} | ${cell(f.problem)} | ${cell(f.fix)} |`,
      ),
      '',
    ].join('\n'),
  );

  for (const { role, error } of failed) console.error(`NOT RUN  ${role}: ${error}`);
  process.stdout.write(
    `${all.length} finding(s): ${standing.length} blocker or major to resolve. See ${dir}/PANEL.md\n`,
  );
  process.exit(standing.length || failed.length || skip.size ? 1 : 0);
}

void main();
