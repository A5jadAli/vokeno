// What the harness tells the author model at each stage (scripts/content/run.ts). Each prompt is
// one small task with its gate named, so a weaker model has nothing to plan and nothing to judge.
import type { Job } from './queue';

const LANGUAGE: Record<string, string> = { de: 'German', es: 'Spanish', en: 'English' };
const languageOf = (job: Job) => LANGUAGE[job.id.slice(0, 2)] ?? 'the course language';
const what = (job: Job) =>
  job.kind === 'repair'
    ? `repair the live ${languageOf(job)} unit ${job.id} so it meets the content standard`
    : `write the new ${languageOf(job)} ${job.kind} ${job.id}`;

const rules = (
  job: Job,
) => `You are working on the Vokeno language-learning app, in a git worktree prepared for one job: ${what(job)}.
The job's brief: ${job.brief}

An automated harness runs you one stage at a time and then checks your work with commands. It reads their exit codes, not your report, so the only way to finish a stage is to make its checks pass.

Rules for every stage:
- Work only inside this directory. You are already inside the content harness: do not use the author-unit skill and do not run npm run content:auto.
- Do not commit, merge, push, deploy or publish. Do not record audio, run the review panel, run the arbiter or run the browser tests. Do not start background jobs. The harness does all of these.
- Change only content files: the unit's own file and its course's units file, src/features/audio/voices.ts, supabase/functions/_shared/unit-calls.ts, the review record, docs/unit-calls.md, and tests. Never change app code (progress.ts, types.ts, level-status.ts, components), package.json, a lockfile or scripts/: npm run content:check fails if you do.
- Never weaken, skip or delete a test to make it pass, and never add a unit to scripts/content/legacy.json. If a test counts sessions or names what follows the last unit, bring its numbers up to the new truth.
- Read AGENTS.md, then the sections of docs/content-pipeline.md named below, then docs/content-lessons.md (rules learned from defects in earlier units), before you write.
- When you have finished, reply with one line that starts with DONE.`;

export const prompts = {
  brief: (job: Job) => `${rules(job)}

STAGE 1 OF 4: the coverage sheet. Write no lesson code in this stage.

Read "The content standard" and "The coverage sheet (stage 1)" in docs/content-pipeline.md, the brief named above, and the newest unit of the same language in src/features/foundations/.${job.kind === 'repair' ? ` Run \`npm run content:check -- ${job.id}\` to see what the unit misses, and read the unit itself.` : ''}

Then write docs/content-review/${job.id}.md. It must begin with a title line, then the heading "## Coverage sheet", then the eight bullets, each starting with its bold label exactly as the runbook shows them: **Can do:**, **New items for active use:**, **Recognition only:**, **Grammar point:**, **Sound and spelling:**, **Brought back:**, **Scene:**, **Exam-format task:**.${job.kind === 'repair' ? ' For a repair, describe the unit as it will stand after the repair and say which steps will change. If the file already exists, keep what is there and put the sheet at the top.' : ''}

The harness checks that the file exists and has all eight labels.`,

  write: (job: Job) => `${rules(job)}

STAGE 2 OF 4: ${job.kind === 'repair' ? 'repair the unit' : `write the ${job.kind}`}.

Read "The content standard" and "Writing (stage 2)" in docs/content-pipeline.md, and the coverage sheet you are working from: docs/content-review/${job.id}.md.

${
  job.kind === 'repair'
    ? `Change only what the standard requires (\`npm run content:check -- ${job.id}\` lists each miss). Keep every lesson id. When a session teaches more than the limit, move items the unit needs to a later session of the same unit, and make items that only help understanding (regional greetings, rarer words) recognition-only: shown in a scene line or a note, not taught as a card. Never merge two words or chunks into one teach entry to get under a count, and never drop language a marked step needs. Say in the record which items moved or became recognition-only. A phrase that moves to another session simply gets a fresh review card there; do not change app code to carry its old one over. If the unit has no unit call in supabase/functions/_shared/unit-calls.ts, add one (docs/unit-calls.md).`
    : `Write the ${job.kind} after the pattern of the newest one in the same language, and wire it in as "Writing (stage 2)" lists: its own file, the import in the language's units file, tests/published-ids.json, the language's own tests, voices for new speakers${job.kind === 'unit' ? ', and its unit call' : ''}.`
}

The harness will then run, in this order, and all must pass:
1. npm run content:check -- ${job.id}
2. npm run typecheck
3. npm run lint
4. npm run test:ci   (the harness records the voices for new lines first, so a missing-clip failure in tests/audio.test.ts is the only failure you may leave)

Run them yourself before you finish.`,

  fix: (job: Job, check: string, output: string) => `${rules(job)}

The harness ran \`${check}\` and it failed. Fix the cause in the job's files, then run the same command yourself until it passes. "Writing (stage 2)" in docs/content-pipeline.md lists what a unit must be wired into.

The end of the failing output:

${output}`,

  resolve: (job: Job, round: number) => `${rules(job)}

STAGE 3 OF 4: answer review round ${round}.

Three independent reviewers read the unit. Their findings are in artifacts/content/${job.id}/PANEL.md. Read "Answering review findings (stages 3 and 4)" in docs/content-pipeline.md first.

For every finding marked blocker or major:
1. Open the source and check whether it is true.
2. If it is true, fix the unit. If it is false, change nothing for it.
3. Add a row for it to docs/content-review/${job.id}.md under the heading "## Panel round ${round}" (create the heading and a table with the columns Step, Severity, Finding, Checked, Done).

Minor findings are optional: take the ones that clearly improve the unit.

After you finish, three judges will read the unit itself and vote on whether each finding is still a real defect. They do not read your table, so a finding you reject must really be wrong.

The harness will then run again: npm run content:check -- ${job.id}, npm run typecheck, npm run lint, npm run test:ci. Run them yourself before you finish.`,

  upheld: (job: Job) => `${rules(job)}

STAGE 4 OF 4: fix what the judges upheld.

Three judges read the unit as it stands and voted on each review finding. The findings that two or more of them still uphold are marked "yes" in the Upheld column of artifacts/content/${job.id}/ARBITER.md, with each judge's reason. These are real defects in the current unit. Fix every one of them in the unit, and add a row for each to docs/content-review/${job.id}.md under "## Arbiter".

The harness will then run again: npm run content:check -- ${job.id}, npm run typecheck, npm run lint, npm run test:ci. Run them yourself before you finish.`,

  browser: (job: Job, output: string) => `${rules(job)}

The harness ran the complete browser suite on the committed unit and it failed. The suite walks a learner through the lessons, so a failure usually means a step in this job cannot be completed the way the walk in e2e/foundations.spec.ts expects, or a test still describes the course as it was before this job. Fix the cause. Change a browser test only where this job made it out of date. Do not run the browser suite yourself: it takes half an hour and the harness will run it again.

The failing tests and the end of the output:

${output}`,
};
