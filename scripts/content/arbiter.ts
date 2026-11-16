// npm run content:arbiter -- <unit-id>
//
// The last gate on a unit's language (docs/content-pipeline.md). The panel's findings were about
// an earlier version; the author has answered them since. Each of the three models now judges,
// on its own, whether each finding is still a real defect in the unit as it stands. Two votes
// uphold a finding. The command fails while any finding is upheld.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { contentVersion } from '../../src/features/foundations/progress';
import { knownBefore, renderUnit, upheldBy, unitSessions, type Vote } from './lib';
import { askJson, MODELS, type Provider } from './providers';

type Finding = {
  severity: 'blocker' | 'major' | 'minor';
  ref: string;
  quote: string;
  problem: string;
  fix: string;
  confidence: 'high' | 'medium' | 'low';
};

const unitId = process.argv[2];
const sessions = unitId ? unitSessions(unitId) : [];
const dir = `artifacts/content/${unitId}`;
if (!sessions.length || !existsSync(`${dir}/panel.json`)) {
  console.error(
    'Usage: npm run content:arbiter -- <unit-id>   (after npm run content:panel -- <unit-id>)',
  );
  process.exit(2);
}

const panel = JSON.parse(readFileSync(`${dir}/panel.json`, 'utf8')) as {
  results: { role: string; findings: Finding[] }[];
};
const findings = panel.results
  .flatMap(({ role, findings: list }) => list.map((finding) => ({ role, ...finding })))
  .filter((finding) => finding.severity !== 'minor' && finding.confidence !== 'low');

const language = { DE: 'German', ES: 'Spanish', EN: 'English' }[sessions[0].track];
const system = `You are one of three independent judges of one unit of a mobile ${language} course for adults, explained in English.

Reviewers raised the numbered findings below about an EARLIER version of the unit. The author has revised the unit since. The unit shown is the CURRENT version. For each finding, decide whether it is still a real defect in the current unit.

Uphold a finding only if both are true: the reviewer was right, and the problem is still there. Dismiss it if it has been fixed, if the reviewer was wrong, or if it asks for more than these rules require:
- Typed answers are compared without capital letters or punctuation; Spanish answers that differ only by accents are accepted with a note.
- A typed answer must accept every correct answer made only of words and forms taught in this unit or in the "taught earlier" list. It need not accept answers that use anything else.
- When a prompt names the form to use, other forms need not be accepted.
- A regional form the unit itself teaches is acceptable even if the course's main variety prefers another.

Judge each finding on the text in front of you, not on who raised it. Return JSON only:
{"verdicts":[{"n":1,"verdict":"uphold|dismiss","reason":"one sentence quoting the current text"}]}`;

const earlier = knownBefore(sessions[0]);
const material = [
  '## Findings to judge',
  ...findings.map(
    (finding, index) =>
      `${index + 1}. [${finding.ref}] (${finding.severity}) Quoted: ${finding.quote}\n   Problem: ${finding.problem}\n   Proposed fix: ${finding.fix}`,
  ),
  '',
  '## The unit as it stands now',
  renderUnit(sessions),
  '',
  `## Taught earlier in the course (${earlier.length} items, rule tables included)`,
  earlier.join(' · ') || 'Nothing: this is the first unit.',
].join('\n');

async function main() {
  const judges: Provider[] = ['gemini', 'openai', 'xai'];
  const replies = findings.length
    ? await Promise.all(
        judges.map(async (judge) => {
          try {
            const reply = await askJson<{ verdicts?: Vote[] }>(judge, system, material);
            if (!Array.isArray(reply.verdicts)) throw new Error('The reply had no verdicts list.');
            return { judge, verdicts: reply.verdicts, error: '' };
          } catch (error) {
            return { judge, verdicts: [] as Vote[], error: String((error as Error).message) };
          }
        }),
      )
    : [];
  const voted = replies.filter((reply) => !reply.error);
  const upheld = upheldBy(
    findings.length,
    voted.map((reply) => reply.verdicts),
  );

  const cell = (value: string) => String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const votes = (n: number) =>
    replies
      .map((reply) => {
        const vote = reply.verdicts.find((item) => item.n === n);
        return `${reply.judge}: ${reply.error ? 'no vote' : `${vote?.verdict ?? 'no vote'}${vote ? ` (${cell(vote.reason)})` : ''}`}`;
      })
      .join('<br>');
  writeFileSync(
    `${dir}/arbiter.json`,
    JSON.stringify(
      {
        unitId,
        version: sessions.map(contentVersion).join(' '),
        at: new Date().toISOString(),
        models: MODELS,
        findings,
        replies,
        upheld,
      },
      null,
      2,
    ),
  );
  writeFileSync(
    `${dir}/ARBITER.md`,
    [
      `# Arbiter: ${unitId}`,
      '',
      `${new Date().toISOString().slice(0, 10)}. ${findings.length} finding(s) judged against the current unit; ${upheld.length} upheld by two or more of ${voted.length} judge(s).`,
      ...replies
        .filter((reply) => reply.error)
        .map((reply) => `- **${reply.judge}** did not vote: ${reply.error}`),
      '',
      '| # | Step | Upheld | Finding | Votes |',
      '| --- | --- | --- | --- | --- |',
      ...findings.map(
        (finding, index) =>
          `| ${index + 1} | ${cell(finding.ref)} | ${upheld.includes(index + 1) ? '**yes**' : 'no'} | ${cell(finding.problem)} | ${votes(index + 1)} |`,
      ),
      '',
    ].join('\n'),
  );

  // Fewer than two judges cannot make a majority: that is a failed run, not a pass.
  const short = findings.length > 0 && voted.length < 2;
  if (short) console.error(`Only ${voted.length} judge(s) voted; two are needed.`);
  process.stdout.write(
    `${findings.length} finding(s) judged, ${upheld.length} upheld. See ${dir}/ARBITER.md\n`,
  );
  process.exit(short ? 2 : upheld.length ? 1 : 0);
}

void main();
