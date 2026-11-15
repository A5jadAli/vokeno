# Content pipeline: how a unit gets written, checked and handed over

15 November 2026. This is the runbook for adding lessons. Any coding agent can follow it from start to finish without the person who wrote it: Claude Code, Codex, or a person at a terminal. Start a session with:

> Follow `docs/content-pipeline.md` for the next unit in `docs/content-backlog.md`.

In Claude Code, `/author-unit` does the same.

## What the pipeline can and cannot do

It produces units that are accurate, natural, at the right level and inside the content standard, with the evidence written down. It lowers the number of errors a human reviewer has to find.

It cannot make a level true. Models reviewing models is not a native teacher, and no model has listened to the audio on a phone. A level stays a starter set until the gates in `docs/curriculum-standards-audit.md` pass, and only the owner changes `levelStatus`. Releases (`eas update`, `supabase db push`, function deploys) stay the owner's call.

## Who does what

| Job                 | Who                                            | Why                                                                                           |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Author              | One agent per unit: Claude Code or Codex       | One voice per unit. Never two authors on the same unit.                                       |
| Native-speaker read | Gemini (`gemini-pro-latest`)                   | A model from another company, so it does not share the author's blind spots.                  |
| Teacher and exam    | OpenAI (`gpt-6.1-sol`)                         | Level, rules, exam format, untaught language.                                                 |
| Answer-key attack   | xAI (`grok-4.7`)                               | Tries to break every key. In the first run it found the most defects; it is also the slowest. |
| Voices              | OpenAI speech, through `generate-lesson-audio` | As today (`docs/lesson-audio.md`).                                                            |
| Listening check     | Whisper on the owner's machine, when available | Catches a voice that read a line wrongly. Optional; a person still listens.                   |
| Final language gate | A native teacher (owner arranges)              | The only review that counts for a level claim.                                                |
| Merge and release   | The owner                                      | An update on the preview channel reaches real users.                                          |

The three reviewers run together with `npm run content:panel`. Each sees the unit and the list of what was taught before it. None sees another's findings. Model names are defaults: set `CONTENT_MODEL_GEMINI`, `CONTENT_MODEL_OPENAI` or `CONTENT_MODEL_XAI` to change one, and use the provider's strongest general model.

## Set up once (owner)

- **Review keys.** The panel needs an OpenAI, a Gemini and an xAI key. It looks, in order, in the environment (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `XAI_API_KEY`), in an ignored `.env.content.local` in the directory it runs from, and in the file named by `CONTENT_KEYS_FILE`. For Claude Code, put the pointer in `.claude/settings.local.json`, which git ignores: `{ "env": { "CONTENT_KEYS_FILE": "/full/path/to/keys/file" } }`. For Codex or a terminal, `export CONTENT_KEYS_FILE=/full/path/to/keys/file` before starting.
- **Voice token.** `LESSON_AUDIO_TOKEN` in the ignored `.env.audio.local` of the main tree (`docs/lesson-audio.md`).

An agent never prints a key, commits one, or copies one into a tracked file. If the panel says a key is missing, stop and tell the owner; do not go looking for keys.

## The content standard

`npm run content:check -- <unit-id>` measures a unit against these limits (`STANDARD` in `scripts/content/lib.ts`). `tests/content-standard.test.ts` fails the build if a unit outside its legacy list misses one.

| Limit                                              | Value        | Reason                                                         |
| -------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| New words or chunks taught in a session            | 8 at most    | Earlier sessions taught up to 17 in five minutes.              |
| Multiple choice among a session's marked steps     | 50% at most  | Exams and conversations need production, not recognition.      |
| Typed, built or form answers among a unit's marked | 40% at least | The same.                                                      |
| Options on a multiple-choice step                  | 3 at least   | Two options is a coin toss.                                    |
| Lines said aloud in a session                      | 2 at least   | You speak in every scene.                                      |
| Earlier-taught items met again in a session        | 4 at least   | Words must come back in new sentences, not only as flashcards. |

These are editorial limits from the November 2026 course review, not trial results. Change one only here, with a date and a reason, and in `STANDARD` in the same commit. `npm run content:check -- --all` shows every unit; the 29 units written before the standard are on the legacy list and leave it as they are repaired.

The existing rules still apply and are tested elsewhere: every exercise solvable, each word taught once, no sentence reused across sessions, no digits in audio text, a voice for every speaker (`tests/units.test.ts`, `tests/spanish-units.test.ts`, `tests/audio.test.ts`).

## The stages

Work on one unit at a time, on its own branch in its own worktree. Other sessions share the main working tree, so never write lessons there.

```sh
MAIN=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")   # the main tree
git worktree add -b content/<unit-id> "$MAIN/../voka-content-<unit-id>" main
cd "$MAIN/../voka-content-<unit-id>"
ln -s "$MAIN/node_modules" node_modules                    # use the main tree's packages
cp "$MAIN/.env.local" "$MAIN/.env.audio.local" . 2>/dev/null   # ignored files a worktree lacks
```

Run every later command from the worktree. When the owner has merged the branch, remove it with `git worktree remove`.

### 1. Pick

Take the first row in `docs/content-backlog.md` whose status is `next`. Make the unit's worktree (above), and as the first change there set the row to `in progress` with the date. The backlog is only ever edited in a unit's worktree, so its changes arrive with the unit. If a row says it waits on the owner, skip it and say so.

### 2. Brief

Read, in this order: the unit's row in the language's units plan (linked from the backlog), the coverage register for the level, and the previous unit's source file. Then start the unit's review record, `docs/content-review/<unit-id>.md`, with its coverage sheet:

- the can-do statement and the exam descriptor it serves;
- new items for active use, per session (8 at most), each with the reason it is there: how common it is in speech, or which exam task needs it;
- items for recognition only;
- one grammar point and one sound or spelling focus;
- the earlier items each session brings back (4 at least), by the unit that taught them;
- the scene: place, cast, and the learner's own lines in it (three at least);
- the exam-format task and which paper and part it copies.

Do not write lessons before this sheet exists. A unit with a weak sheet cannot be reviewed into a good one.

### 3. Write

Follow the newest unit of the same language as the pattern (`spanish-a1-unit-6.ts`, the last units in `german-a1-units.ts`). Hold to `AGENTS.md`: levels must be true, native-first language with register labels, answer keys that accept every reasonable answer. In particular:

- Every scene has a careful line and, where people say it differently, the real one.
- Wrong options are things a learner at this level would really say or confuse. If an option can be ruled out without knowing the language, replace it.
- A typed answer accepts every variant the unit itself has taught, including regional forms it mentions.
- The last speaking step changes the situation, so a memorised line is not enough.
- Nothing essential to a marked answer is untaught.

### 4. Machine gates

```sh
npm run content:check -- <unit-id>   # the standard
npm run test:ci                      # structure, solvability, missing audio
```

Fix every miss. Do not add a unit to the legacy list.

### 5. Panel

```sh
npm run content:panel -- <unit-id>
```

It takes about ten minutes and writes `artifacts/content/<unit-id>/PANEL.md`. It fails while a blocker or major finding stands.

A finding is a claim, not a fact. For each one, open the source and check it. In the first runs, one finding was wrong (the reviewer could not see a number taught in a rule table; it is shown them now) and one was half wrong (it did not know the app ignores capital letters). Then either fix the unit, or write in the review record why the finding is wrong, with the evidence.

Run the panel again after fixes. Stop after three rounds: if blockers remain, set the backlog row to `blocked`, write what is unresolved, and move on. Do not skip a reviewer to get a pass; `--skip` is for a provider that is down, and the record must say so.

### 6. Unit call

Add the unit's call to `supabase/functions/_shared/unit-calls.ts` (`docs/unit-calls.md`). The app offers it only after the owner deploys `realtime-session`: note that in the record.

### 7. Voices

Give each new speaker a voice in `src/features/audio/voices.ts`, then record (`docs/lesson-audio.md`). This needs `LESSON_AUDIO_TOKEN` in `.env.audio.local`. If the token is missing, stop here, set the row to `written, needs audio`, and say so: do not ship a unit that falls back to the device voice.

### 8. Record and hand over

Finish `docs/content-review/<unit-id>.md`: the panel date, models and content versions; each blocker and major finding with what was done; and a short list of questions for the native teacher (lines you were unsure of, regional choices, anything a reviewer disputed).

Then, as `AGENTS.md` requires: `git status` and `git diff` on every file, commit only your own changes, and check the commit (the unit's worktree is a clean checkout of it once everything is committed):

```sh
npm run format:check && npm run typecheck && npm run lint && npm run test:ci
npm run test:e2e
```

These are `npm run validate` without its first step, `expo-doctor`. That step fails on every branch while the Expo patch upgrades wait for the 1.12.0 store build, and a content unit changes no packages, so it is not this pipeline's gate. Do not change `package.json` or the lockfile to make it pass. The browser tests take about 25 minutes and use port 4173: if another session is using it they fail at once with "port in use"; wait and run them again, and never stop another session's server. Before the final commit, set the backlog row to `ready for native review` with the branch name and the row after it to `next`. Do not merge, push to the preview channel or deploy.

## When a level's units are all written

1. Two full mock exams in the real format, timed and marked against the official pass mark.
2. The native teacher's review of every unit's record.
3. Pilot learners sit an official sample paper; compare with their mock results.
4. Only then does the owner change the level's status.

## Keeping the pipeline honest

- If a reviewer is often wrong about the same thing, fix what it is shown (`renderUnit`, `knownBefore`), not the prompt alone.
- If the native teacher finds a class of error the panel missed, add it to the role briefs in `scripts/content/panel.ts` and note it here.
- Count, per unit, the findings the panel raised, how many were real, and what the teacher found afterwards. If the panel stops finding real defects, it is no longer earning its ten minutes.
