// npm run content:auto [-- --status | --max <n> | --job <unit-id>]
//
// The content harness (docs/content-pipeline.md). It takes the next job from the queue in
// docs/content-backlog.md and drives it through every stage: brief, write, panel, arbiter, voice
// check, lessons, browser tests, merge. An author model does one small task per stage; this code
// checks each stage with commands and decides what happens next. Stop it and start it again at
// any time: a job's stage is saved in artifacts/content/<unit-id>/state.json in the main folder.
import { spawnSync } from 'node:child_process';
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
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
  /** Every author that did a task for this job, e.g. "claude opus". */
  authors?: string[];
  startedAt: string;
};
type PanelReport = {
  results: { role: string; error: string; findings: { severity: string }[] }[];
};

const sh = (
  command: string,
  args: string[],
  cwd: string,
  minutes = 20,
  env?: Record<string, string>,
) => {
  const result = spawnSync(command, args, {
    cwd,
    env: env ? { ...process.env, ...env } : process.env,
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
const wait = (minutes: number, cwd: string) =>
  sh('sleep', [String(minutes * 60)], cwd, minutes + 1);

const MAIN = dirname(
  git(['rev-parse', '--path-format=absolute', '--git-common-dir'], process.cwd()).out.trim(),
);

// Settings for unattended runs can live in the ignored .claude/settings.local.json of the main
// folder (the review keys file, a long-lived Claude token, the author choice), so a plain
// terminal needs nothing else. A variable already set in the environment wins.
const settings = join(MAIN, '.claude/settings.local.json');
if (existsSync(settings))
  for (const [name, value] of Object.entries(
    (JSON.parse(readFileSync(settings, 'utf8')) as { env?: Record<string, string> }).env ?? {},
  ))
    process.env[name] ??= value;

const BACKLOG = 'docs/content-backlog.md';
const AGENT = process.env.CONTENT_AGENT ?? 'claude';
const MODEL = process.env.CONTENT_AGENT_MODEL ?? (AGENT === 'claude' ? 'opus' : 'gpt-6.1-sol');
/** The author for a task the main author cannot take because its plan is over its limit. */
const FALLBACK = process.env.CONTENT_AGENT_FALLBACK ?? '';
const FALLBACK_MODEL =
  process.env.CONTENT_FALLBACK_MODEL ?? (FALLBACK === 'claude' ? 'opus' : 'gpt-6.1-sol');
const CODEX_EFFORT = process.env.CONTENT_CODEX_EFFORT ?? 'high';
const AUTHORS = [
  { agent: AGENT, model: MODEL },
  ...(FALLBACK && FALLBACK !== AGENT ? [{ agent: FALLBACK, model: FALLBACK_MODEL }] : []),
];

const pad = (value: number) => String(value).padStart(2, '0');
/** Local time, as the owner reads it: 2026-11-19 22:41:05. */
const stamp = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};
const today = () => stamp().slice(0, 10);
const tail = (text: string, characters = 6000) => text.slice(-characters);

const log = (message: string) => {
  const line = `${stamp()}  ${message}\n`;
  process.stdout.write(line);
  mkdirSync(join(MAIN, 'artifacts/content'), { recursive: true });
  appendFileSync(join(MAIN, 'artifacts/content/auto.log'), line);
};

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

/** This boot of the machine, so a lock left before a restart is never mistaken for a live one. */
const boot = () =>
  existsSync('/proc/sys/kernel/random/boot_id')
    ? readFileSync('/proc/sys/kernel/random/boot_id', 'utf8').trim()
    : '';

/** One copy of the harness at a time: two would fight over the queue, main and port 4173. */
function lock() {
  const file = join(MAIN, 'artifacts/content/auto.lock');
  const mine = `${process.pid} ${boot()}`;
  if (existsSync(file)) {
    const [pid, since = ''] = readFileSync(file, 'utf8').trim().split(' ');
    // A lock from before a restart, or from a process that has gone, was left by a copy that
    // was killed. After a restart its number may belong to an unrelated process.
    let alive = since === boot();
    if (alive)
      try {
        process.kill(Number(pid), 0);
      } catch (error) {
        // Not allowed to signal it means it exists, under another user.
        alive = (error as NodeJS.ErrnoException).code === 'EPERM';
      }
    if (alive) throw new Error(`The harness is already running (process ${pid}).`);
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, mine);
  const release = () => {
    if (existsSync(file) && readFileSync(file, 'utf8') === mine) unlinkSync(file);
  };
  process.on('exit', release);
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const)
    process.on(signal, () => process.exit(130));
}

function call(agent: string, model: string, prompt: string, cwd: string) {
  return agent === 'codex'
    ? sh(
        'codex',
        [
          'exec',
          '--sandbox',
          'workspace-write',
          '-m',
          model,
          '-c',
          `model_reasoning_effort=${CODEX_EFFORT}`,
          prompt,
        ],
        cwd,
        90,
      )
    : sh(
        'claude',
        ['-p', prompt, '--model', model, '--permission-mode', 'auto', '--output-format', 'json'],
        cwd,
        90,
      );
}

const LIMIT = /hit your [^.]{0,40}limit|usage limit|rate limit|quota/i;

/**
 * One task for an author, in the job's worktree. The stage's checks decide whether it worked; the
 * author's report is only kept in a log. An author over its plan's limit hands the task to the
 * fallback author, or waits for the limit to reset.
 */
function author(job: Job, state: State, label: string, prompt: string) {
  const cwd = worktree(job.id);
  let broken = 0;
  let waited = 0;
  for (;;) {
    let limited = 0;
    for (const { agent, model } of AUTHORS) {
      const who = model ? `${agent} ${model}` : agent;
      log(`${job.id}  ${who}: ${label}`);
      const result = call(agent, model, prompt, cwd);
      writeFileSync(
        join(folder(job.id), `author-${label.replace(/\W+/g, '-')}-${Date.now()}.log`),
        result.out,
      );
      if (result.code === 0 || result.code === 124) {
        state.authors = [...new Set([...(state.authors ?? []), who])];
        save(job.id, state);
        return;
      }
      if (LIMIT.test(tail(result.out, 2000))) {
        log(`${job.id}  ${who} is over its usage limit`);
        limited++;
        continue;
      }
      // The program itself failed: a network error, a sign-in that ended, no credit. Two more
      // tries after a pause, then the harness stops, because every job would fail the same way.
      if (++broken >= 3)
        throw new Error(
          `${who} failed three times (exit ${result.code}):\n${tail(result.out, 1500)}`,
        );
      log(`${job.id}  ${who} failed (exit ${result.code}); trying again in 5 minutes`);
      wait(5, cwd);
      break;
    }
    if (limited < AUTHORS.length) continue;
    if (++waited > 40) throw new Blocked('every author stayed over its usage limit for ten hours');
    log(`${job.id}  waiting 15 minutes for a usage limit to reset`);
    wait(15, cwd);
  }
}

type Failure = { check: string; out: string; authors: boolean };

/** Prettier is run for the author, not checked against them. */
function format(cwd: string) {
  const changed = git(['status', '--porcelain', '--untracked-files=all'], cwd)
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
    // The loudness copies upload to production through a CLI that asks a person first: left
    // for the owner (docs/content-pipeline.md). Until then the app plays the original clip.
    const recorded = sh(
      'npx',
      ['tsx', '--tsconfig', 'tsconfig.json', 'scripts/generate-lesson-audio.ts'],
      cwd,
      45,
      { VOKA_SKIP_LOUDNESS: '1' },
    );
    writeFileSync(join(folder(job.id), 'voices.log'), recorded.out);
    const again = sh('npx', ['jest', 'tests/audio.test.ts', '-t', 'has a recorded clip'], cwd, 10);
    if (again.code)
      return { check: 'recording the voices', out: tail(recorded.out + again.out), authors: false };
  }
  return npm('test:ci');
}

/** Runs the gates; a failure the author can fix goes back to them, a set number of times. */
function passGates(job: Job, state: State) {
  for (let attempt = 0; ; attempt++) {
    const failed = gates(job);
    if (!failed) return;
    log(`${job.id}  failed: ${failed.check}`);
    if (!failed.authors || attempt >= TRIES.fix)
      throw new Blocked(`${failed.check} still fails:\n${tail(failed.out, 1500)}`);
    author(job, state, `fix ${failed.check}`, prompts.fix(job, failed.check, failed.out));
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
  // Files git ignores that the job needs: the app's settings, the voice token, and the Supabase
  // link the voice recorder's loudness step uploads through.
  for (const path of ['.env.local', '.env.audio.local', 'supabase/.temp'])
    if (existsSync(join(MAIN, path)) && !existsSync(join(cwd, path)))
      cpSync(join(MAIN, path), join(cwd, path), { recursive: true });
  // Reports written in the worktree land in the main folder, so they outlive the worktree.
  mkdirSync(folder(job.id), { recursive: true });
  mkdirSync(join(cwd, 'artifacts/content'), { recursive: true });
  if (!existsSync(join(cwd, 'artifacts/content', job.id)))
    symlinkSync(folder(job.id), join(cwd, 'artifacts/content', job.id));
  // Main's latest pipeline fixes reach a job that is already under way. Git refuses, without
  // changing anything, when the job's unsaved work is in a file main changed: then main comes
  // in at the merge stage instead, where every gate runs again.
  const merged = git(['merge', '--no-edit', 'main'], cwd);
  if (merged.code && /would be overwritten|commit your changes or stash them/i.test(merged.out))
    log(`${job.id}  main comes in at the merge stage: unsaved work here is in files main changed`);
  else if (merged.code) {
    git(['merge', '--abort'], cwd);
    throw new Blocked('main no longer merges into this job’s branch without conflicts');
  }
}

function brief(job: Job, state: State) {
  const record = join(worktree(job.id), 'docs/content-review', `${job.id}.md`);
  for (let attempt = 1; ; attempt++) {
    author(job, state, 'coverage sheet', prompts.brief(job));
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
  const file = join(folder(job.id), 'panel.json');
  for (; state.round <= TRIES.rounds; state.round++) {
    log(`${job.id}  panel round ${state.round}`);
    let run = { code: 0, out: '' };
    let report: PanelReport = { results: [] };
    for (let attempt = 1; ; attempt++) {
      // A report from an earlier round must never stand in for this one.
      rmSync(file, { force: true });
      run = sh('npm', ['run', '-s', 'content:panel', '--', job.id], cwd, 45);
      if (!existsSync(file)) throw new Blocked(`the panel did not run:\n${tail(run.out, 1200)}`);
      report = JSON.parse(readFileSync(file, 'utf8')) as PanelReport;
      const silent = report.results.filter((result) => result.error);
      if (!silent.length) break;
      // A reviewer that did not answer is waited for: a panel of two is not a panel.
      const names = silent.map((result) => `${result.role} (${result.error.slice(0, 120)})`);
      if (attempt >= 6)
        throw new Blocked(`a reviewer did not answer for an hour: ${names.join('; ')}`);
      log(`${job.id}  no answer from ${names.join('; ')}; asking again in 10 minutes`);
      wait(10, cwd);
    }
    cpSync(join(folder(job.id), 'PANEL.md'), join(folder(job.id), `PANEL-round-${state.round}.md`));
    const count = { blocker: 0, major: 0, minor: 0 };
    for (const finding of report.results.flatMap((result) => result.findings))
      if (finding.severity in count) count[finding.severity as keyof typeof count]++;
    state.rounds[state.round - 1] = count;
    save(job.id, state);
    log(
      `${job.id}  round ${state.round}: ${count.blocker} blocker, ${count.major} major, ${count.minor} minor`,
    );
    if (run.code === 0) return true;
    author(job, state, `answer round ${state.round}`, prompts.resolve(job, state.round));
    passGates(job, state);
  }
  return false;
}

function arbiter(job: Job, state: State) {
  const cwd = worktree(job.id);
  const file = join(folder(job.id), 'arbiter.json');
  for (let attempt = 0; ; attempt++) {
    log(`${job.id}  arbiter`);
    let run = { code: 2, out: '' };
    for (let tries = 1; ; tries++) {
      rmSync(file, { force: true });
      run = sh('npm', ['run', '-s', 'content:arbiter', '--', job.id], cwd, 45);
      if (run.code !== 2) break;
      if (tries >= 6) throw new Blocked('fewer than two judges answered the arbiter for an hour');
      log(`${job.id}  fewer than two judges answered; asking again in 10 minutes`);
      wait(10, cwd);
    }
    if (!existsSync(file)) throw new Blocked(`the arbiter did not run:\n${tail(run.out, 1200)}`);
    const verdict = JSON.parse(readFileSync(file, 'utf8')) as {
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
    author(job, state, 'fix upheld findings', prompts.upheld(job));
    passGates(job, state);
  }
}

function listen(job: Job, state: State) {
  const cwd = worktree(job.id);
  for (let attempt = 1; ; attempt++) {
    log(`${job.id}  voice check`);
    const run = sh('npm', ['run', '-s', 'content:listen', '--', job.id], cwd, 30);
    state.clips = run.out.trim().split('\n').at(-1) ?? '';
    save(job.id, state);
    if (run.code === 0) return;
    const file = join(folder(job.id), 'listen.json');
    if (!existsSync(file))
      throw new Blocked(`the voice check did not run:\n${tail(run.out, 1200)}`);
    const report = JSON.parse(readFileSync(file, 'utf8')) as {
      failed: { key: string }[];
      unchecked: unknown[];
    };
    if (report.failed.length && attempt <= 2) {
      // A new clip that most listeners mishear is recorded again: the voice is not the same twice.
      log(`${job.id}  recording ${report.failed.length} clip(s) again`);
      const manifest = join(cwd, 'src/features/audio/clips.json');
      const saved = JSON.parse(readFileSync(manifest, 'utf8')) as { clips: Record<string, number> };
      for (const { key } of report.failed) delete saved.clips[key];
      writeFileSync(manifest, `${JSON.stringify(saved, null, 2)}\n`);
      const again = sh(
        'npx',
        ['tsx', '--tsconfig', 'tsconfig.json', 'scripts/generate-lesson-audio.ts'],
        cwd,
        45,
        { VOKA_SKIP_LOUDNESS: '1' },
      );
      appendFileSync(join(folder(job.id), 'voices.log'), again.out);
      continue;
    }
    // A transcriber that did not answer is the provider's problem, not the unit's.
    if (!report.failed.length && report.unchecked.length && attempt < 4) {
      log(`${job.id}  some clips could not be checked; trying again in 10 minutes`);
      wait(10, cwd);
      continue;
    }
    throw new Blocked(`the voice check failed (LISTEN.md):\n${tail(run.out, 1200)}`);
  }
}

/** The pipeline learns from this unit's real defects. An improvement, never a gate. */
function learn(job: Job) {
  log(`${job.id}  lessons for later units`);
  const run = sh('npm', ['run', '-s', 'content:lessons', '--', job.id], worktree(job.id), 20);
  writeFileSync(join(folder(job.id), 'lessons.log'), run.out);
  log(`${job.id}  ${run.out.trim().split('\n').at(-1) ?? ''}`);
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
  const authors = state.authors?.join(', ') || `${AGENT} ${MODEL}`;
  writeFileSync(
    file,
    [
      before,
      '',
      heading,
      '',
      `${today()}, by the content harness. Author: ${authors}. The panel and the arbiter are three models from three other companies (\`scripts/content/providers.ts\`). No person has reviewed this unit.`,
      '',
      '| Panel round | Blocker | Major | Minor |',
      '| --- | --- | --- | --- |',
      ...rounds,
      '',
      state.judged === 0
        ? '- **Arbiter:** not needed; the last panel round left no blocker or major finding.'
        : `- **Arbiter:** ${state.judged} finding(s) from the last round judged against the finished unit, ${state.upheld} upheld by two or more judges.`,
      `- **Voice check:** ${state.clips || 'no recorded clips in this unit.'}`,
      '- **Loudness copies:** not made by the harness; the owner makes them (`docs/content-pipeline.md`, "Set up once"). Until then the app plays the original recordings.',
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
    `| ${today()} | \`${job.id}\` | ${job.kind} | ${authors} | ${state.rounds.map((r) => `${r.blocker}/${r.major}/${r.minor}`).join(', ')} | ${state.judged} | ${state.upheld} | ${state.clips.split(':')[0] || 'none'} | ${minutes} |\n`,
  );
}

function commit(job: Job, state: State, message: string) {
  const cwd = worktree(job.id);
  format(cwd);
  git(['add', '-A'], cwd);
  if (git(['diff', '--cached', '--quiet'], cwd).code === 0) return;
  const done = git(
    [
      'commit',
      '-m',
      `${message}\n\nWritten by the content harness (docs/content-pipeline.md). Author: ${state.authors?.join(', ') || `${AGENT} ${MODEL}`}.`,
    ],
    cwd,
  );
  if (done.code) throw new Blocked(`the commit was refused:\n${tail(done.out, 1200)}`);
}

function browser(job: Job, state: State) {
  const cwd = worktree(job.id);
  for (let attempt = 0; ; attempt++) {
    // Another session may be running the suite: wait for the port, never take it.
    for (
      let waited = 0;
      sh('bash', ['-c', '(echo > /dev/tcp/127.0.0.1/4173) 2>/dev/null'], cwd).code === 0;
      waited++
    ) {
      if (waited >= 360) throw new Blocked('port 4173 stayed in use for six hours');
      if (waited === 0) log(`${job.id}  waiting for port 4173`);
      wait(1, cwd);
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
      state,
      'fix browser tests',
      prompts.browser(job, `${failures.join('\n')}\n\n${tail(run.out, 4000)}`),
    );
    passGates(job, state);
    commit(job, state, `Content: ${job.id} browser fixes`);
  }
}

function merge(job: Job, state: State) {
  const cwd = worktree(job.id);
  const branch = `content/${job.id}`;
  // Checked again here: someone may have switched the main folder while the job ran.
  const onMain = () => git(['branch', '--show-current'], MAIN).out.trim() === 'main';
  if (!onMain()) throw new Blocked('the main folder is not on the main branch');
  if (git(['merge', '--ff-only', branch], MAIN).code) {
    // Main moved while the job ran: bring it in, check again, and try once more.
    if (git(['merge', '--no-edit', 'main'], cwd).code) {
      git(['merge', '--abort'], cwd);
      throw new Blocked('main changed and no longer merges with this unit');
    }
    passGates(job, state);
    commit(job, state, `Content: ${job.id} after merging main`);
    const again = onMain() ? git(['merge', '--ff-only', branch], MAIN) : { code: 1, out: '' };
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
  if (state.stage === 'blocked') {
    state.stage = state.at ?? 'brief';
    delete state.reason;
  }
  const to = (stage: Stage) => {
    state.stage = stage;
    save(job.id, state);
  };
  log(`${job.id}  ${job.kind}: starting at "${state.stage}"`);
  try {
    prepare(job);
    if (state.stage === 'brief') {
      brief(job, state);
      to('write');
    }
    if (state.stage === 'write') {
      author(job, state, 'write', prompts.write(job));
      passGates(job, state);
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
      learn(job);
      record(job, state);
      commit(job, state, `Content: ${job.id} (${job.kind})`);
      to('browser');
    }
    if (state.stage === 'browser') {
      browser(job, state);
      to('merge');
    }
    if (state.stage === 'merge') {
      merge(job, state);
      to('done');
    }
    log(`${job.id}  done and merged into main`);
    return true;
  } catch (error) {
    if (!(error instanceof Blocked)) throw error;
    state.at = state.stage as Stage;
    state.stage = 'blocked';
    state.reason = error.message;
    save(job.id, state);
    log(`${job.id}  BLOCKED at "${state.at}": ${error.message.split('\n')[0]}`);
    return false;
  }
}

function main() {
  // "--status | head" closes the pipe early; that is not an error.
  process.stdout.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EPIPE') process.exit(0);
    throw error;
  });
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
  lock();

  const only = value('--job');
  const max = Number(value('--max') ?? Infinity);
  log(
    `Harness started. Author: ${AUTHORS.map(({ agent, model }) => `${agent} ${model}`).join(', then ')}.`,
  );
  let finished = 0;
  for (let ran = 0; ran < max; ran++) {
    // --job also takes up a blocked job again, at the stage where it stopped.
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
    if (runJob(job)) finished++;
    if (only) break;
  }
  log(`Finished ${finished} job(s) this run. "npm run content:auto -- --status" shows the queue.`);
}

try {
  main();
} catch (error) {
  // A reason to stop, said once, without a stack trace.
  console.error(`content:auto stopped: ${(error as Error).message}`);
  process.exit(1);
}
