// npm run content:panel -- <unit-id> [--skip native|teacher|solver]
//
// Three models from three other companies each review one unit on their own (docs/content-
// pipeline.md). None of them wrote it and none sees another's findings. The result goes to
// artifacts/content/<unit-id>/ and the command fails while a blocker or major finding stands.
//
// Keys: OPENAI_API_KEY (or OPENAI_SECRET_KEY, tried first), GEMINI_API_KEY and XAI_API_KEY from
// the environment, or from .env.content.local, or from the file named by CONTENT_KEYS_FILE.
// Keys are never printed.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { contentVersion } from '../../src/features/foundations/progress';
import { exams } from '../../src/features/foundations/level-status';
import { knownBefore, renderUnit, unitProblems, unitSessions } from './lib';

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

const fileKeys = [process.env.CONTENT_KEYS_FILE, '.env.content.local']
  .filter((path): path is string => Boolean(path && existsSync(path)))
  .map((path) => parseEnv(readFileSync(path, 'utf8')));
/** The first name that has a value, the environment before the key files. */
const key = (...names: string[]) =>
  names
    .map((name) => process.env[name] ?? fileKeys.find((file) => file[name])?.[name])
    .find(Boolean);

const { track, level } = sessions[0];
const language = { DE: 'German', ES: 'Spanish', EN: 'English' }[track];
const variety = {
  DE: 'German as spoken in Germany today',
  ES: 'Mexican Spanish as spoken today (the course reference), noting where Spain differs',
  EN: 'both American and British English as spoken today',
}[track];
const exam = exams[track]?.[level] ?? `CEFR ${level}`;

const roles: Record<Role, { provider: 'openai' | 'gemini' | 'xai'; model: string; brief: string }> =
  {
    native: {
      provider: 'gemini',
      model: process.env.CONTENT_MODEL_GEMINI ?? 'gemini-pro-latest',
      brief: `You are a native speaker of ${variety}, in your thirties, who also teaches it. Say every ${language} line in your head: would a person in this situation really say it this way today? Check the careful lines and the "as people say it" lines, the register and regional claims, the cultural notes, spelling, punctuation and accents, and that each English meaning is what the line means.`,
    },
    teacher: {
      provider: 'openai',
      model: process.env.CONTENT_MODEL_OPENAI ?? 'gpt-6.1-sol',
      brief: `You are an experienced ${language} teacher and ${exam} examiner. Judge whether the unit delivers its can-do statement at CEFR ${level}; whether each rule is accurate and not over-general; whether a marked step needs a word or structure that neither this unit nor the "taught earlier" list has taught; whether any exam-style task matches the real ${exam} format; and whether a session asks a beginner to hold too much at once.`,
    },
    solver: {
      provider: 'xai',
      model: process.env.CONTENT_MODEL_XAI ?? 'grok-4.7',
      brief: `You are a sharp learner trying to break the answer keys. Answer every marked step yourself before you read its key. Report: a correct answer the key rejects (give it); an option other than the key that can be defended; an accepted answer that is wrong; tiles that build another correct sentence that is not accepted; a question whose details contradict the scene; and any step that can be answered without knowing ${language}.`,
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

/** Sends one request and returns the streamed reply's text. A stream keeps a slow connection
 *  alive while a model thinks for minutes; a plain request is dropped after five. */
async function stream(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  pick: (event: any) => string | undefined,
) {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(1_200_000),
    });
    // One retry for a busy or failing provider; anything else is a real error.
    if (attempt === 0 && (response.status === 429 || response.status >= 500)) continue;
    if (!response.ok || !response.body)
      throw new Error(`${response.status} ${(await response.text()).slice(0, 300)}`);
    let text = '';
    let pending = '';
    for await (const chunk of response.body.pipeThrough(new TextDecoderStream())) {
      const lines = (pending + chunk).split('\n');
      pending = lines.pop() ?? '';
      for (const line of lines) {
        const data = line.startsWith('data:') ? line.slice(5).trim() : '';
        if (data && data !== '[DONE]') text += pick(JSON.parse(data)) ?? '';
      }
    }
    return text;
  }
}

async function ask(role: Role): Promise<Finding[]> {
  const { provider, model, brief } = roles[role];
  const system = `${shared}\n\nYour role: ${brief}`;
  let text: string;
  if (provider === 'gemini') {
    const apiKey = key('GEMINI_API_KEY', 'GOOGLE_API_KEY', 'NANO_BANANA_API_KEY');
    if (!apiKey) throw new Error('No Gemini key (GEMINI_API_KEY).');
    text = await stream(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
      { 'x-goog-api-key': apiKey },
      {
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: material }] }],
        generationConfig: { responseMimeType: 'application/json' },
      },
      (event) =>
        event.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text).join(''),
    );
  } else {
    const apiKey =
      provider === 'openai' ? key('OPENAI_SECRET_KEY', 'OPENAI_API_KEY') : key('XAI_API_KEY');
    if (!apiKey) throw new Error(`No ${provider} key.`);
    text = await stream(
      `${provider === 'openai' ? 'https://api.openai.com/v1' : 'https://api.x.ai/v1'}/chat/completions`,
      { Authorization: `Bearer ${apiKey}` },
      {
        model,
        stream: true,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: material },
        ],
        response_format: { type: 'json_object' },
      },
      (event) => event.choices?.[0]?.delta?.content,
    );
  }
  const findings = (JSON.parse(text) as { findings?: Finding[] }).findings;
  if (!Array.isArray(findings)) throw new Error('The reply had no findings list.');
  return findings;
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
