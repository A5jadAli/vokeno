// npm run content:auto [-- --status | --max <n> | --job <unit-id>]
//
// The content harness (docs/content-pipeline.md). It takes the next job from the queue in
// docs/content-backlog.md and drives it through every stage: brief, write, panel, arbiter, voice
// check, browser tests, merge. An author model does one small task per stage; this code checks
// each stage with commands and decides what happens next. Stop it and start it again at any
// time: a job's stage is saved in artifacts/content/<unit-id>/state.json in the main folder.
import { spawnSync } from 'node:child_process';
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

import { prompts } from './prompts';
import { nextJob, parseQueue, withStatus, type Job } from './queue';

const TRIES = { brief: 3, fix: 4, rounds: 3, arbiter: 2, browser: 2 } as const;
const SHEET = [
  '## Coverage sheet',
  '**Can do:**',
  '**New items for active use:**',
  '**Recognition only:**',
  '**Grammar point:**',
  '**Sound and spelling:**',
  '**Brought back:**',
  '**Scene:**',
  '**Exam-format task:**',
];

type Stage = 'brief' | 'write' | 'panel' | 'arbiter' | 'listen' | 'browser' | 'merge' | 'done';
type State = {
  stage: Stage | 'blocked';
  /** Why a blocked job stopped, and the stage it stopped in. */
  reason?: string;
  at?: Stage;
  round: number;
  rounds: { blocker: number; major: number; minor: number }[];
  upheld: number;
  judged: number;
  clips: string;
  startedAt: string;
};

const sh = (command: string, args: string[], cwd: string, minutes = 20) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    timeout: minutes * 60_000,
  });
  return {
    code: result.status ?? 124,
    out: `${result.stdout ?? ''}${result.stderr ?? ''}${result.status === null ? `\n(stopped after ${minutes} minutes)` : ''}`,
  };
};
const git = (args: string[], cwd: string) => sh('git', args, cwd);

const MAIN = dirname(
  git(['rev-parse', '--path-format=absolute', '--git-common-dir'], process.cwd()).out.trim(),
);
const BACKLOG = 'docs/content-backlog.md';
const AGENT = process.env.CONTENT_AGENT ?? 'claude';
const MODEL = process.env.CONTENT_AGENT_MODEL ?? (AGENT === 'claude' ? 'opus' : '');
const today = () => new Date().toISOString().slice(0, 10);
const tail = (text: string, characters = 6000) => text.slice(-characters);

const log = (message: string) => {
  const line = `${new Date().toISOString().slice(0, 19).replace('T', ' ')}  ${message}\n`;
  process.stdout.write(line);
  mkdirSync(join(MAIN, 'artifacts/content'), { recursive: true });
  appendFileSync(join(MAIN, 'artifacts/content/auto.log'), line);
};

// The review keys: a pointer in the ignored local settings is enough, in any terminal.
const settings = join(MAIN, '.claude/settings.local.json');
if (!process.env.CONTENT_KEYS_FILE && existsSync(settings)) {
  const pointer = (JSON.parse(readFileSync(settings, 'utf8')) as { env?: Record<string, string> })
    .env?.CONTENT_KEYS_FILE;
  if (pointer) process.env.CONTENT_KEYS_FILE = pointer;
}

const folder = (id: string) => join(MAIN, 'artifacts/content', id);
const worktree = (id: string) => join(MAIN, '..', `voka-content-${id}`);
const load = (id: string): State | undefined =>
  existsSync(join(folder(id), 'state.json'))
    ? (JSON.parse(readFileSync(join(folder(id), 'state.json'), 'utf8')) as State)
    : undefined;
const save = (id: string, state: State) => {
  mkdirSync(folder(id), { recursive: true });
  writeFileSync(join(folder(id), 'state.json'), `${JSON.stringify(state, null, 2)}\n`);
};

/** Raised when a job cannot go on. The job is marked blocked and the harness takes the next. */
class Blocked extends Error {}

/** One task for the author model, in the job's worktree. Waits out the plan's usage limit. */
function author(job: Job, label: string, prompt: string) {
  const cwd = worktree(job.id);
  for (let wait = 0; ; wait++) {
    log(`${job.id}  author: ${label}`);
    const result =
      AGENT === 'codex'
        ? sh(
            'codex',
            ['exec', '--sandbox', 'workspace-write', ...(MODEL ? ['-m', MODEL] : []), prompt],
            cwd,
            90,
          )
        : sh(
            'claude',
            [
              '-p',
              prompt,
              '--model',
              MODEL,
              '--permission-mode',
              'auto',
              '--output-format',
              'json',
            ],
            cwd,
            90,
          );
    writeFileSync(
      join(folder(job.id), `author-${label.replace(/\W+/g, '-')}-${Date.now()}.log`),
      result.out,
    );
    const limited = /hit your [^.]{0,40}limit|usage limit|rate limit reached/i.test(
      tail(result.out, 2000),
    );
    // Anything else that stops the author's own program (a sign-in that ended, no credit) would
    // fail every job the same way, so it stops the harness instead of blocking jobs one by one.
    if (!limited && result.code !== 0 && result.code !== 124)
      throw new Error(
        `The author program failed (exit ${result.code}):\n${tail(result.out, 1500)}`,
      );
    if (limited) {
      if (wait >= 40)
        throw new Blocked('the author model stayed over its usage limit for ten hours');
      log(`${job.id}  the author model is over its usage limit; trying again in 15 minutes`);
      sh('sleep', ['900'], cwd, 16);
      continue;
    }
    return;
  }
}

type Failure = { check: string; out: string; authors: boolean };

/** Prettier is run for the author, not checked against them. */
function format(cwd: string) {
  const changed = git(['status', '--porcelain'], cwd)
    .out.split('\n')
    .map((line) => line.slice(3).trim())
    .filter(
      (path) => /\.(ts|tsx|md|json)$/.test(path) && path !== BACKLOG && existsSync(join(cwd, path)),
    );
  if (changed.length) sh('npx', ['prettier', '--write', '--log-level', 'warn', ...changed], cwd);
}

/** The stage 2 gates, in order. Returns the first that fails, or nothing when all pass. */
function gates(job: Job): Failure | undefined {
  const cwd = worktree(job.id);
  format(cwd);
  const npm = (script: string, ...rest: string[]) => {
    const check = `npm run ${script}${rest.length ? ` -- ${rest.join(' ')}` : ''}`;
    const result = sh(
      'npm',
      ['run', '-s', script, ...(rest.length ? ['--', ...rest] : [])],
      cwd,
      30,
    );
    return result.code ? { check, out: tail(result.out), authors: true } : undefined;
  };
  const failed = npm('content:check', job.id) ?? npm('typecheck') ?? npm('lint');
  if (failed) return failed;

  // A repaired unit leaves the legacy list the moment it meets the standard.
  const legacyFile = join(cwd, 'scripts/content/legacy.json');
  const legacy = JSON.parse(readFileSync(legacyFile, 'utf8')) as string[];
  if (legacy.includes(job.id))
    writeFileSync(
      legacyFile,
      `${JSON.stringify(
        legacy.filter((id) => id !== job.id),
        null,
        2,
      )}\n`,
    );

  // Voices for new lines are recorded before the tests, which require a clip for every line.
  const missing = sh('npx', ['jest', 'tests/audio.test.ts', '-t', 'has a recorded clip'], cwd, 10);
  if (missing.code) {
    log(`${job.id}  recording voices for new lines`);
    const recorded = sh(
      'npx',
      ['tsx', '--tsconfig', 'tsconfig.json', 'scripts/generate-lesson-audio.ts'],
      cwd,
      45,
    );
    writeFileSync(join(folder(job.id), 'voices.log'), recorded.out);
    const again = sh('npx', ['jest', 'tests/audio.test.ts', '-t', 'has a recorded clip'], cwd, 10);
    if (again.code)
      return { check: 'recording the voices', out: tail(recorded.out + again.out), authors: false };
  }
  return npm('test:ci');
}

/** Runs the gates; a failure the author can fix goes back to them, a set number of times. */
function passGates(job: Job) {
  for (let attempt = 0; ; attempt++) {
    const failed = gates(job);
    if (!failed) return;
    log(`${job.id}  failed: ${failed.check}`);
    if (!failed.authors || attempt >= TRIES.fix)
      throw new Blocked(`${failed.check} still fails:\n${tail(failed.out, 1500)}`);
    author(job, `fix ${failed.check}`, prompts.fix(job, failed.check, failed.out));
  }
}

function prepare(job: Job) {
  const cwd = worktree(job.id);
  const branch = `content/${job.id}`;
  if (!existsSync(cwd)) {
    const exists = git(['rev-parse', '--verify', '--quiet', branch], MAIN).code === 0;
    const added = git(
      exists ? ['worktree', 'add', cwd, branch] : ['worktree', 'add', '-b', branch, cwd, 'main'],
      MAIN,
    );
    if (added.code) throw new Blocked(`could not make the worktree:\n${tail(added.out, 800)}`);
  }
  // Its own packages, as hard links: a link to the main folder's would share one build cache.
  if (!existsSync(join(cwd, 'node_modules')))
    sh('cp', ['-al', join(MAIN, 'node_modules'), join(cwd, 'node_modules')], MAIN);
  for (const file of ['.env.local', '.env.audio.local'])
    if (existsSync(join(MAIN, file)) && !existsSync(join(cwd, file)))
      cpSync(join(MAIN, file), join(cwd, file));
  // Reports written in the worktree land in the main folder, so they outlive the worktree.
  mkdirSync(folder(job.id), { recursive: true });
  mkdirSync(join(cwd, 'artifacts/content'), { recursive: true });
  if (!existsSync(join(cwd, 'artifacts/content', job.id)))
    symlinkSync(folder(job.id), join(cwd, 'artifacts/content', job.id));
  if (git(['merge', '--no-edit', 'main'], cwd).code) {
    git(['merge', '--abort'], cwd);
    throw new Blocked('main no longer merges into this job’s branch without conflicts');
  }
}

function brief(job: Job) {
  const record = join(worktree(job.id), 'docs/content-review', `${job.id}.md`);
  for (let attempt = 1; ; attempt++) {
    author(job, 'coverage sheet', prompts.brief(job));
    const text = existsSync(record) ? readFileSync(record, 'utf8') : '';
    const missing = SHEET.filter((label) => !text.includes(label));
    if (!missing.length) return;
    log(`${job.id}  the coverage sheet lacks: ${missing.join(', ')}`);
    if (attempt >= TRIES.brief)
      throw new Blocked(`the coverage sheet still lacks ${missing.join(', ')}`);
  }
}

function panel(job: Job, state: State) {
  const cwd = worktree(job.id);
  for (; state.round <= TRIES.rounds; state.round++) {
    log(`${job.id}  panel round ${state.round}`);
    let run = sh('npm', ['run', '-s', 'content:panel', '--', job.id], cwd, 45);
    const read = () => {
      const file = join(folder(job.id), 'panel.json');
      if (!existsSync(file)) throw new Blocked(`the panel did not run:\n${tail(run.out, 1200)}`);
      return JSON.parse(readFileSync(file, 'utf8')) as {
        results: {
          role: string;
          error: string;
          findings: { severity: keyof State['rounds'][0] }[];
        }[];
      };
    };
    // A reviewer that did not answer is asked once more; a panel of two is not a panel.
    if (run.code && read().results.some((result) => result.error))
      run = sh('npm', ['run', '-s', 'content:panel', '--', job.id], cwd, 45);
    const report = read();
    const silent = report.results.filter((result) => result.error);
    if (silent.length)
      throw new Blocked(
        `a reviewer did not answer: ${silent.map((result) => `${result.role} (${result.error})`).join('; ')}`,
      );
    cpSync(join(folder(job.id), 'PANEL.md'), join(folder(job.id), `PANEL-round-${state.round}.md`));
    const count = { blocker: 0, major: 0, minor: 0 };
    for (const finding of report.results.flatMap((result) => result.findings))
      if (finding.severity in count) count[finding.severity]++;
    state.rounds[state.round - 1] = count;
    save(job.id, state);
    log(
      `${job.id}  round ${state.round}: ${count.blocker} blocker, ${count.major} major, ${count.minor} minor`,
    );
    if (run.code === 0) return true;
    author(job, `answer round ${state.round}`, prompts.resolve(job, state.round));
    passGates(job);
  }
  return false;
}

function arbiter(job: Job, state: State) {
  const cwd = worktree(job.id);
  for (let attempt = 0; ; attempt++) {
    log(`${job.id}  arbiter`);
    let run = sh('npm', ['run', '-s', 'content:arbiter', '--', job.id], cwd, 45);
    if (run.code === 2) run = sh('npm', ['run', '-s', 'content:arbiter', '--', job.id], cwd, 45);
    if (run.code === 2) throw new Blocked('fewer than two judges answered the arbiter');
    const verdict = JSON.parse(readFileSync(join(folder(job.id), 'arbiter.json'), 'utf8')) as {
      findings: unknown[];
      upheld: number[];
    };
    state.judged = verdict.findings.length;
    state.upheld = verdict.upheld.length;
    save(job.id, state);
    log(`${job.id}  arbiter: ${state.judged} judged, ${state.upheld} upheld`);
    if (run.code === 0) return;
    if (attempt >= TRIES.arbiter)
      throw new Blocked(`${state.upheld} finding(s) are still upheld by the judges (ARBITER.md)`);
    author(job, 'fix upheld findings', prompts.upheld(job));
    passGates(job);
  }
}

function listen(job: Job, state: State) {
  log(`${job.id}  voice check`);
  const run = sh('npm', ['run', '-s', 'content:listen', '--', job.id], worktree(job.id), 30);
  state.clips = run.out.trim().split('\n').at(-1) ?? '';
  save(job.id, state);
  if (run.code) throw new Blocked(`the voice check failed (LISTEN.md):\n${tail(run.out, 1200)}`);
}

/** The harness's own section of the review record, the queue row and the ledger. */
function record(job: Job, state: State) {
  const cwd = worktree(job.id);
  const file = join(cwd, 'docs/content-review', `${job.id}.md`);
  const heading = '## Machine review';
  const before = readFileSync(file, 'utf8').split(`\n${heading}`)[0].trimEnd();
  const rounds = state.rounds.map(
    (round, index) => `| ${index + 1} | ${round.blocker} | ${round.major} | ${round.minor} |`,
  );
  const clean = state.judged === 0;
  writeFileSync(
    file,
    [
      before,
      '',
      heading,
      '',
      `${today()}, by the content harness. Author: ${AGENT}${MODEL ? ` (${MODEL})` : ''}. The panel and the arbiter are three models from three other companies (\`scripts/content/providers.ts\`). No person has reviewed this unit.`,
      '',
      '| Panel round | Blocker | Major | Minor |',
      '| --- | --- | --- | --- |',
      ...rounds,
      '',
      clean
        ? '- **Arbiter:** not needed; the last panel round left no blocker or major finding.'
        : `- **Arbiter:** ${state.judged} finding(s) from the last round judged against the finished unit, ${state.upheld} upheld by two or more judges.`,
      `- **Voice check:** ${state.clips || 'no recorded clips in this unit.'}`,
      '- **Checks:** the content standard, type-check, lint, every unit test and the complete browser suite pass on the merged commit.',
      '',
    ].join('\n'),
  );
  const backlog = join(cwd, BACKLOG);
  writeFileSync(backlog, withStatus(readFileSync(backlog, 'utf8'), job.id, `done (${today()})`));
  const ledger = join(cwd, 'docs/content-review/ledger.md');
  if (!existsSync(ledger))
    writeFileSync(
      ledger,
      '# Content ledger\n\nOne line per job the harness finished (`docs/content-pipeline.md`). Findings are blocker/major/minor per panel round.\n\n| Date | Job | Kind | Author | Findings by round | Judged | Upheld | Voices | Minutes |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n',
    );
  const minutes = Math.round((Date.now() - Date.parse(state.startedAt)) / 60_000);
  appendFileSync(
    ledger,
    `| ${today()} | \`${job.id}\` | ${job.kind} | ${AGENT}${MODEL ? ` ${MODEL}` : ''} | ${state.rounds.map((r) => `${r.blocker}/${r.major}/${r.minor}`).join(', ')} | ${state.judged} | ${state.upheld} | ${state.clips.split(':')[0] || 'none'} | ${minutes} |\n`,
  );
}

function commit(job: Job, message: string) {
  const cwd = worktree(job.id);
  format(cwd);
  git(['add', '-A'], cwd);
  if (git(['diff', '--cached', '--quiet'], cwd).code === 0) return;
  const done = git(
    [
      'commit',
      '-m',
      `${message}\n\nWritten by the content harness (docs/content-pipeline.md); author model: ${AGENT}${MODEL ? ` ${MODEL}` : ''}.`,
    ],
    cwd,
  );
  if (done.code) throw new Blocked(`the commit was refused:\n${tail(done.out, 1200)}`);
}

function browser(job: Job) {
  const cwd = worktree(job.id);
  for (let attempt = 0; ; attempt++) {
    // Another session may be running the suite: wait for the port, never take it.
    for (
      let waited = 0;
      sh('bash', ['-c', '(echo > /dev/tcp/127.0.0.1/4173) 2>/dev/null'], cwd).code === 0;
      waited++
    ) {
      if (waited >= 90) throw new Blocked('port 4173 stayed in use for 90 minutes');
      if (waited === 0) log(`${job.id}  waiting for port 4173`);
      sh('sleep', ['60'], cwd);
    }
    log(`${job.id}  browser suite`);
    const run = sh('npx', ['playwright', 'test'], cwd, 90);
    writeFileSync(join(folder(job.id), 'browser.log'), run.out);
    if (run.code === 0) return;
    const failures = run.out
      .split('\n')
      .filter((line) => line.includes('✘'))
      .slice(0, 12);
    log(`${job.id}  browser suite failed (${failures.length} or more tests)`);
    if (attempt >= TRIES.browser)
      throw new Blocked(`the browser suite still fails:\n${failures.join('\n')}`);
    author(
      job,
      'fix browser tests',
      prompts.browser(job, `${failures.join('\n')}\n\n${tail(run.out, 4000)}`),
    );
    passGates(job);
    commit(job, `Content: ${job.id} browser fixes`);
  }
}

function merge(job: Job) {
  const cwd = worktree(job.id);
  const branch = `content/${job.id}`;
  if (git(['merge', '--ff-only', branch], MAIN).code) {
    // Main moved while the job ran: bring it in, check again, and try once more.
    if (git(['merge', '--no-edit', 'main'], cwd).code) {
      git(['merge', '--abort'], cwd);
      throw new Blocked('main changed and no longer merges with this unit');
    }
    passGates(job);
    commit(job, `Content: ${job.id} after merging main`);
    const again = git(['merge', '--ff-only', branch], MAIN);
    if (again.code)
      throw new Blocked(
        `main could not take the unit; is the main folder on main, with no conflicting edits?\n${tail(again.out, 600)}`,
      );
  }
  // The reports folder is a link into the main folder: take the link away, never its target.
  unlinkSync(join(cwd, 'artifacts/content', job.id));
  git(['worktree', 'remove', '--force', cwd], MAIN);
  git(['branch', '-d', branch], MAIN);
}

function runJob(job: Job) {
  const state: State = load(job.id) ?? {
    stage: 'brief',
    round: 1,
    rounds: [],
    upheld: 0,
    judged: 0,
    clips: '',
    startedAt: new Date().toISOString(),
  };
  const to = (stage: Stage) => {
    state.stage = stage;
    save(job.id, state);
  };
  log(`${job.id}  ${job.kind}: starting at "${state.stage}"`);
  try {
    prepare(job);
    if (state.stage === 'brief') {
      brief(job);
      to('write');
    }
    if (state.stage === 'write') {
      author(job, 'write', prompts.write(job));
      passGates(job);
      to('panel');
    }
    if (state.stage === 'panel') {
      // A clean round needs no arbiter: there is nothing left to judge.
      to(panel(job, state) ? 'listen' : 'arbiter');
    }
    if (state.stage === 'arbiter') {
      arbiter(job, state);
      to('listen');
    }
    if (state.stage === 'listen') {
      listen(job, state);
      record(job, state);
      commit(job, `Content: ${job.id} (${job.kind})`);
      to('browser');
    }
    if (state.stage === 'browser') {
      browser(job);
      to('merge');
    }
    if (state.stage === 'merge') {
      merge(job);
      to('done');
    }
    log(`${job.id}  done and merged into main`);
    return true;
  } catch (error) {
    if (!(error instanceof Blocked)) throw error;
    state.at = state.stage === 'blocked' ? state.at : (state.stage as Stage);
    state.stage = 'blocked';
    state.reason = error.message;
    save(job.id, state);
    log(`${job.id}  BLOCKED at "${state.at}": ${error.message.split('\n')[0]}`);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const value = (flag: string) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined);
  const queue = () => parseQueue(readFileSync(join(MAIN, BACKLOG), 'utf8'));
  const blocked = () =>
    new Set(
      queue()
        .filter((job) => load(job.id)?.stage === 'blocked')
        .map((job) => job.id),
    );

  if (args.includes('--status')) {
    for (const job of queue()) {
      const state = job.status === 'todo' ? load(job.id) : undefined;
      const where = !state
        ? job.status
        : state.stage === 'blocked'
          ? `BLOCKED at ${state.at}: ${state.reason?.split('\n')[0]}`
          : `in progress: ${state.stage}`;
      process.stdout.write(
        `${String(job.n).padStart(3)}  ${job.id.padEnd(11)} ${job.kind.padEnd(10)} ${where}\n`,
      );
    }
    return;
  }

  if (git(['rev-parse', '--show-toplevel'], process.cwd()).out.trim() !== MAIN)
    throw new Error('Run the harness from the main project folder.');
  if (git(['branch', '--show-current'], MAIN).out.trim() !== 'main')
    throw new Error('The main folder must be on the main branch.');

  const only = value('--job');
  const max = Number(value('--max') ?? Infinity);
  let finished = 0;
  for (let ran = 0; ran < max; ran++) {
    const job = only ? queue().find((item) => item.id === only) : nextJob(queue(), blocked());
    if (!job) {
      log(
        only ? `No job ${only} in the queue.` : 'Nothing left to do: every job is done or blocked.',
      );
      break;
    }
    if (job.status !== 'todo') {
      log(`${job.id} is already ${job.status}.`);
      break;
    }
    if (only && load(job.id)?.stage === 'blocked') {
      log(
        `${job.id} is blocked. Delete ${join(folder(job.id), 'state.json')} to take it up again.`,
      );
      break;
    }
    if (runJob(job)) finished++;
    if (only) break;
  }
  log(`Finished ${finished} job(s) this run. "npm run content:auto -- --status" shows the queue.`);
}

main();
