# Content pipeline: one command that writes, checks and merges lessons

15 November 2026.

```sh
npm run content:auto
```

Run it from the main project folder. It takes the first job in `docs/content-backlog.md` that is not done, sees it through every stage below, merges it into main, and goes on to the next, until the queue is empty or it is stopped. Stop it at any time with Ctrl+C and run it again: it picks up the same job at the stage it had reached.

```sh
npm run content:auto -- --status         # where every job stands; changes nothing
npm run content:auto -- --max 1          # one job, then stop
npm run content:auto -- --job es-a1-u8   # this job only; a blocked job is taken up again where it stopped
```

## How it stays right with a weaker author

The harness (`scripts/content/run.ts`) is ordinary code. It decides what happens next; a model never does.

- **One small task at a time.** The author model is started fresh for each stage with one instruction: write the coverage sheet; write the unit; answer these findings. It never plans the job or judges when it is finished.
- **Code checks every stage.** After each stage the harness runs commands and reads their exit codes. A stage that fails goes back to the author with the failing output, a fixed number of times. The author's own report is not read.
- **Other companies' models review the language.** Three models that did not write the unit review it without seeing each other's findings. After the author has answered, the same three vote on whether each finding is still a real defect; two votes uphold it. The author cannot overrule them.
- **Nothing reaches main unless every gate passed.** A job that cannot pass is marked blocked with the reason and left on its branch; the harness moves on to a job that does not depend on it.
- **It learns from its own defects.** When a unit has passed review, one model turns the defects that were real into at most two general rules in `docs/content-lessons.md`, which every later author reads. The rules arrive in git with the unit, so a person can see and remove any of them. The ledger shows whether later units need fewer review rounds.

## What it can and cannot do

It produces units that meet the content standard, pass every test, have been reviewed by three models with two rounds of checking, and whose recorded voices say the words they should. On 15 November it found three real answer-key defects in a live unit that had already been reviewed by hand.

It does not make a level true. The owner decided on 15 November that units are not held back for a native teacher: machine review is the gate. That is a trade, and it should be made knowingly. The models are strong at wrong answer keys, untaught words, false rules and mistranslation. They are weaker at what only an ear catches: a line that is correct but that nobody says, a voice with the wrong melody, a cultural note that is ten years old. Three ways to cover that without slowing the queue:

- the app's "report content" button, read regularly;
- a native speaker reading a sample (one unit in five costs little) from `docs/content-review/`;
- the level gates in `docs/curriculum-standards-audit.md`, which still stand: mock exams and learner results before a level stops being a starter set. Only the owner changes `levelStatus`.

Releases (`eas update`, `supabase db push`, function deploys) stay the owner's call. The harness merges into the local main branch and never pushes, publishes or deploys.

## Who does what

| Job                       | Who                                                                                                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Order of work, every gate | The harness, in code                                                                                                                                                                                     |
| Author                    | Claude Code, headless (`CONTENT_AGENT_MODEL`, default `opus`); when its plan is over its limit, Codex if `CONTENT_AGENT_FALLBACK=codex` (`CONTENT_FALLBACK_MODEL`, default `gpt-6.1-sol` at high effort) |
| Native-speaker read       | Gemini (`gemini-pro-latest`)                                                                                                                                                                             |
| Teacher and exam          | OpenAI (`gpt-6.1-sol`)                                                                                                                                                                                   |
| Answer-key attack         | xAI (`grok-4.7`)                                                                                                                                                                                         |
| Arbiter                   | The same three, voting; two uphold a finding                                                                                                                                                             |
| Lessons                   | OpenAI (`gpt-6.1-sol`), after review                                                                                                                                                                     |
| Voices                    | OpenAI speech, through `generate-lesson-audio`                                                                                                                                                           |
| Voice check               | OpenAI transcription, blind (`content:listen`)                                                                                                                                                           |
| Release                   | The owner                                                                                                                                                                                                |

Reviewer models are the defaults in `scripts/content/providers.ts`: set `CONTENT_MODEL_GEMINI`, `CONTENT_MODEL_OPENAI` or `CONTENT_MODEL_XAI` to change one, and use each provider's strongest general model.

## Set up once (owner)

- **Claude Code** signed in on this machine (`claude auth login`). A normal sign-in ends after some weeks; for runs that must not stop, make a long-lived token with `claude setup-token` and put it in `.claude/settings.local.json` as `CLAUDE_CODE_OAUTH_TOKEN`. The harness waits when the plan's usage limit is reached, or hands the stage to Codex when `CONTENT_AGENT_FALLBACK` is `codex` (Codex signed in with `codex login`; it is paid per use).
- **Review keys.** An OpenAI, a Gemini and an xAI key, found in this order: the environment (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `XAI_API_KEY`), an ignored `.env.content.local`, the file named by `CONTENT_KEYS_FILE`. `.claude/settings.local.json` (ignored by git) can hold `{ "env": { "CONTENT_KEYS_FILE": "/full/path" } }`; the harness reads that file too, so a plain terminal needs nothing more.
- **Voice token.** `LESSON_AUDIO_TOKEN` in the ignored `.env.audio.local`, and the app's `.env.local`, both in the main folder.

No agent prints a key, commits one, or copies one into a tracked file.

## The content standard

`npm run content:check -- <unit-id>` measures a unit against these limits (`STANDARD` in `scripts/content/lib.ts`).

| Limit                                              | Value        | Reason                                                         |
| -------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| New words or chunks taught in a session            | 8 at most    | Earlier sessions taught up to 17 in five minutes.              |
| Multiple choice among a session's marked steps     | 50% at most  | Exams and conversations need production, not recognition.      |
| Typed, built or form answers among a unit's marked | 40% at least | The same.                                                      |
| Options on a multiple-choice step                  | 3 at least   | Two options is a coin toss.                                    |
| Lines said aloud in a session                      | 2 at least   | You speak in every scene.                                      |
| Earlier-taught items met again in a session        | 4 at least   | Words must come back in new sentences, not only as flashcards. |

These are editorial limits from the November 2026 course review, not trial results. Change one only here, with a date and a reason, and in `STANDARD` in the same commit. Units written before the standard are listed in `scripts/content/legacy.json`; the harness removes one when its repair passes, and nothing is ever added to it.

## What the harness does for one job

Each job gets its own branch (`content/<unit-id>`) and its own worktree beside the main folder, with its own copy of the packages. Its state and every report are kept in `artifacts/content/<unit-id>/` in the main folder, which git ignores.

| Stage      | Who acts                | The gate, checked by code                                                                                   | Tries    |
| ---------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| 1. Brief   | Author                  | The coverage sheet exists in `docs/content-review/<unit-id>.md` with all eight parts                        | 3        |
| 2. Write   | Author                  | `content:check`, type-check, lint, then voices recorded for new lines, then every unit test                 | 5        |
| 3. Panel   | Three reviewers, author | Each round: the panel reports; the author fixes or rejects each finding; the stage 2 gates pass again       | 3 rounds |
| 4. Arbiter | Three judges, author    | No finding from the last round is upheld by two judges; if one is, the author fixes it and they judge again | 2        |
| 5. Listen  | Transcription model     | No recorded clip of the unit is mostly unheard (`content:listen`)                                           | 1        |
| 6. Learn   | One model               | None: it adds at most two rules to `docs/content-lessons.md`, and a failure never holds a unit back         | 1        |
| 7. Browser | Harness, author         | The complete browser suite passes on the committed unit                                                     | 2        |
| 8. Merge   | Harness                 | Main fast-forwards to the unit; the queue row becomes `done`; the ledger gets a line; the worktree goes     | 1        |

A stage that runs out of tries blocks the job. The reason is in `--status` and in the job's folder under `artifacts/content/`. Its branch and worktree are kept. Once the cause is fixed, `npm run content:auto -- --job <unit-id>` takes the job up again at the stage where it stopped. To start a job again from nothing, remove its worktree, its branch `content/<unit-id>` and its folder under `artifacts/content/`.

What goes wrong outside the job is waited for, not counted against it: a reviewer or judge that does not answer (up to an hour), a clip that cannot be fetched for the voice check (up to half an hour), port 4173 in use (up to six hours), every author over its usage limit (up to ten hours). If the author's program itself fails three times, the harness stops, because every job would fail the same way.

The browser suite uses port 4173. If another session is using it, the harness waits; it never stops another session's server.

## Running it unattended

The harness runs in the foreground and stops when its terminal closes. To leave it running, start it with `nohup npm run content:auto > artifacts/content/auto.out 2>&1 &` from the main folder, and follow `artifacts/content/auto.log`. Only one copy runs at a time (`artifacts/content/auto.lock`). Stopping it, a restart of the machine, or a lost connection loses at most the task in hand: run it again and it carries on.

## For the author: how to write a unit

The harness's instructions point here. Read `AGENTS.md` first: levels must be true, language is native-first with register labels, answer keys accept every reasonable answer.

### The coverage sheet (stage 1)

`docs/content-review/<unit-id>.md` starts with a heading `## Coverage sheet` and these eight bullets, each beginning with the bold label shown:

- **Can do:** the can-do statement and the exam descriptor it serves.
- **New items for active use:** per session, 8 at most, each with the reason it is there: how common it is in speech, or which exam task needs it.
- **Recognition only:** items the learner should understand but is not asked to produce.
- **Grammar point:** one.
- **Sound and spelling:** one focus.
- **Brought back:** the earlier items each session uses again (4 at least), by the unit that taught them.
- **Scene:** place, cast, and the learner's own lines in it (three at least).
- **Exam-format task:** which paper and part it copies.

Read first: the job's brief (the backlog row names it), the coverage register for the level, and the newest unit of the same language. A unit with a weak sheet cannot be reviewed into a good one.

### Writing (stage 2)

Follow the newest unit of the same language as the pattern (`spanish-a1-unit-6.ts`, the last units in `german-a1-units.ts`, `spanish-a1-checkpoint-1.ts` for a checkpoint).

- Every scene has a careful line and, where people say it differently, the real one.
- Wrong options are things a learner at this level would really say or confuse. If an option can be ruled out without knowing the language, replace it.
- A typed answer accepts every variant the unit itself has taught, including regional forms it mentions.
- A typed step asks for one thing. When many sentences would be right ("order a tea"), either name the form in the prompt ("Order a tea with ¿Me das …?") or build the accepted list with a small helper that covers every form the unit teaches, as `orders()` does in `spanish-a1-unit-6.ts`. An open prompt with a short list is the commonest defect the panel finds.
- The last speaking step changes the situation, so a memorised line is not enough.
- Nothing essential to a marked answer is untaught.
- No digits or symbols in text a voice will read.

A new unit or checkpoint also has to be wired in. The tests name each gap:

- its own file, imported in the language's units file in path order (`spanish-a1-units.ts`);
- its lesson ids added to `tests/published-ids.json` (ids are only ever added);
- the language's own tests brought up to the new truth where they count sessions or name what follows the last unit (`tests/spanish-units.test.ts`): change the numbers, never delete the check;
- a voice for each new speaker in `src/features/audio/voices.ts`;
- its unit call in `supabase/functions/_shared/unit-calls.ts` (`docs/unit-calls.md`). The app offers the call only after the owner deploys `realtime-session`.

A repair changes only what the standard requires. It keeps every lesson id, step position and taught phrase, so progress and review cards survive, and it adds the unit call if the unit has none.

The author does not record voices, commit, run the panel or run the browser tests. The harness does.

### Answering review findings (stages 3 and 4)

A finding is a claim, not a fact. For each blocker and major finding, open the source and check it. Then either fix the unit, or leave the unit alone because the finding is wrong. Write one row per finding in the record, under `## Panel round N`, with what was checked and what was done. The judges will read the unit, not the row, so a rejection has to be true.

- Typed answers are compared without capital letters or punctuation; Spanish answers that differ only in accents are accepted with a note. A finding that depends on those is wrong.
- A rejected answer is a real defect only when every word and form in it is taught in this unit or earlier.
- The answer-key reviewer can always find one more variant of an open answer. Prefer closing the prompt (name the form) to growing the list.

## Keeping the pipeline honest

- `docs/content-review/ledger.md` gets one line per finished job: the authors, findings per panel round, findings judged and upheld, clips checked, minutes. If the panel stops finding real defects, or the arbiter upholds many, look at why. If review rounds do not fall as `docs/content-lessons.md` grows, the rules are not helping: prune them.
- If a reviewer is often wrong about the same thing, fix what it is shown (`renderUnit`, `knownBefore` in `scripts/content/lib.ts`) or its brief (`scripts/content/panel.ts`), not the author.
- If a learner or a native reader finds a class of error the panel missed, add it to the role briefs and note it here.
- Every worktree has its own packages (`cp -al`), never a link to the main folder's. With a link, builds share one cached copy of the app's route folder and can silently contain another worktree's screens (15 November: a 1.1 MB bundle where 5.6 MB was right).
- The harness runs `format:check`, `typecheck`, `lint` and `test:ci`, not `npm run validate`: validate's first step, `expo-doctor`, fails on every branch while the Expo patch upgrades wait for the 1.12.0 store build, and a content unit changes no packages.

## By hand

Each piece also runs alone, from a unit's worktree: `npm run content:check -- <unit-id>`, `content:panel`, `content:arbiter`, `content:listen`. `/author-unit` in Claude Code starts the harness for one job.
