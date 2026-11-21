# Handover

20 November 2026. For whoever continues Vokeno: the owner, or a coding model in Claude Code or Codex. Read `AGENTS.md` first; this file says where things stand and what comes next. Update it when you finish something that changes either.

## Where the courses stand

No level is claimed: every one is a starter set until it passes the gates in `docs/curriculum-standards-audit.md`.

| Course     | Built                                                                                                                       | Next                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| German A1  | All 20 units, written before the content standard; Unit 1 repaired to it (now five sessions); older A2 and B1 short lessons | Repair Units 2–20, each with its unit call; then two Goethe mocks |
| Spanish A1 | Units 1–7 and Checkpoint 1; Units 6 and 7 meet the standard (Unit 7 written by the harness); older starter and A2 lessons   | Units 8–25 and Checkpoints 2–6, each with its unit call           |
| English    | Starts at A2, for people who know basic English. Three A1 units as a warm-up; 20 older A2–B2 short lessons                  | A2 units (London setting, `docs/english-curriculum-plan.md`)      |

Unit calls (a three-minute call with the unit's character) exist for Spanish Units 1–6 and the English warm-up. A new call reaches learners only after the owner deploys `realtime-session`.

## Three streams of work

### 1. Lessons: the content harness

All new and repaired units come from one command, run in the main folder:

```sh
npm run content:auto            # works through the queue until it is empty or stopped
npm run content:auto -- --status
```

`docs/content-pipeline.md` is the runbook; `docs/content-backlog.md` is the queue. The harness gives an author model one small task per stage, checks every stage with commands, has three models from three other companies review the unit and vote on what is still wrong, transcribes every recorded clip blind, runs the full browser suite and merges into the local main branch. It learns from its own defects in `docs/content-lessons.md`. It never pushes, publishes or deploys.

Do not write or repair units by hand, and never weaken a gate to get one through. When a job is blocked, `--status` gives the reason. Fix the unit or the pipeline, then run `npm run content:auto -- --job <unit-id>`, which resumes where it stopped.

Two authors are proven: Claude Code (the default, on the owner's plan) and Codex (`CONTENT_AGENT=codex npm run content:auto`, paid per use). The gates, not the author, decide what reaches main, so either can run it. What has been proven, and what not, is in "Proof so far" at the end of this file.

### 2. Design: the Film redesign

The app is being restyled to Design Foundation 2.0, "Film" (`docs/design-system.md` on the `design-film` branch, and the frozen spec in `docs/design/foundation-2.0/` there). The work is 32 modules, M0 to M31, each on its own branch `design-film-mN` with its own worktree.

- **Status:** M0–M3 approved. M4 (sheets, result sheet, wrong-pick shake) is built at `172d025` and waits for review; its handoff is `artifacts/redesign/m4/HANDOFF.md` in `../voka-design-film-m4`. The owner's next message to the reviewer, with decisions on M4's three questions, is in `artifacts/redesign-next-messages-2026-11-20.md` (main folder, ignored by git).
- **The loop:** one session builds a module and writes `HANDOFF.md`. A separate session reviews it independently: it re-runs every check on a clean checkout, checks motion on the phone, and writes `FEEDBACK.md`. A module is approved only when nothing is left open.
- **Pending for the reviewer:** five spec changes in the owner's change request (`artifacts/redesign-change-request-2026-11-15.md` in the main folder, ignored by git), to apply as spec 2.0.10 once M4 is approved.
- **When M4 is approved:** the builder merges main into `design-film`. Main has moved a lot: English from A2, the content harness, the AGENTS.md Expo heading. Keep `design-film`'s `docs/design-system.md` and carry the English facts into it.
- **The gate:** five learners use the test build after M18, before anything reaches the preview channel.

### 3. App work

In this order:

1. **The 1.12.0 store build.**
   - Upgrade the eight held Expo patch packages, so `expo-doctor` and CI pass again. `expo-updates` 57.0.27 fixes an Android start-up crash.
   - Re-check the production audit (`scripts/audit-production.mjs`), whose exceptions expired on 8 November:
     - `node-forge` is fixed in 1.4.3;
     - `decode-uri-component` 0.5.0 (through the `query-string` override) has a new advisory;
     - `zod` 3.x and `braces` have no fixed release: renew those exceptions with a new date and reason.
   - Add `react-native-svg` (the voice line as one path), `expo-video`, the ringer check for the answer chime, and the black navigation bar.
   - Ship the redesign inside this build.
2. **The Take** (`docs/the-take.md`), the proposed main selling point. Your recorded voice plays your part in the unit's scene, checked by what a listener understood, and your first take is kept beside your latest. The word matcher is built and tested (`src/features/take/heard.ts`). Part 1 (record and play, no server) comes next; part 2 needs a function deploy.
3. **Learning engine:**
   - a daily review that grows with what is due (it is capped at 8 today);
   - grammar from rule steps in review;
   - digit answers that accept a unit word ("68 pesos");
   - spoken or model-marked answers for open orders.
4. **Mock exams:** decide how a full Goethe or DELE mock runs in the app, then queue the mocks.

## Waiting on the owner

- **Push:** main was pushed on 21 November. CI stays red until item 1 of the app work is done (the Expo patches and the audit).
- **Release and deploy:** publish the content to the preview channel (an OTA is a release), and deploy `realtime-session` for new unit calls.
- **Loudness copies:** from your own terminal in the main folder, run `npx tsx --tsconfig tsconfig.json scripts/normalize-lesson-audio.ts --redo 06bvi6b1gsax55 09pbjjy1gcjv48` and type `yes` when it asks. It replaces the copies of German Unit 1's two re-recorded clips ("Danke, gleichfalls!", "Auch gut. Ich muss los. Tschüss!") and makes copies for every new clip. After later units, run it again without `--redo`. Until then new clips play at their original level, and the two re-recorded ones still play the old take.
- **Unattended sign-in:** a normal Claude Code sign-in ends after some weeks. Run `claude setup-token`, sign in in the browser, paste the code it shows back into the terminal, and copy the token the terminal then prints (it starts with `sk-ant-oat01-`). Put that in `.claude/settings.local.json` as `CLAUDE_CODE_OAUTH_TOKEN`. The browser's code (with a `#` in it) is not the token: an invalid token overrides your working sign-in and stops the harness.
- **Fallback author:** set on 20 November: `CONTENT_AGENT_FALLBACK=codex` in `.claude/settings.local.json`, so Codex takes a stage when the Claude plan is over its limit. Codex is paid per use (a few dollars a unit); delete the line to stop it.
- **Native ear, optional:** units are no longer held for a native teacher; a native speaker reading one unit in five from `docs/content-review/` covers what the machines miss.
- **The redesign gate:** five learners for the redesign test build.

## Rules that have proved themselves

- **One job per worktree:** every job gets its own branch and worktree, with its own `node_modules` copied as hard links (`cp -al`), never a link to the main folder's. With a link, builds silently mixed another worktree's screens.
- **Shared main folder:** other sessions edit it at the same time. Stage only your own changes and check the commit on a clean checkout.
- **Port 4173:** the browser suite uses it. Wait for it, never stop another session's server.
- **Evidence before "done":** re-run the checks yourself; never trust a report, including a model's.
- **Validate:** `npm run validate` fails on `expo-doctor` until the Expo patches land. Until then run `format:check`, `typecheck`, `lint`, `test:ci` and `test:e2e`.

## Proof so far

- **15 November, the old manual pipeline:** a headless Claude session repaired Spanish Unit 6 cold. Three review rounds found real answer-key defects; the unit passed every check and was merged.
- **20 November, a brand-new unit end to end:** `npm run content:auto` wrote Spanish Unit 7 (At the market) with Claude Opus as the author and merged it into main. No person touched it.
  - **Write:** the unit, its unit call, a new voice, the published ids and the Spanish tests, in 18 minutes; 92 voice clips recorded.
  - **Review:** three panel rounds (11, 9 and 8 blocker or major findings, including a wrong price sum in a prompt). The arbiter then upheld 2 of 8 findings (a teach entry bundling three items, a missing answer variant); the author fixed both and the second judgement upheld none.
  - **Voice check:** two clips that most listeners misheard ("por kilo" heard as "por ti, ¿no?") were recorded again automatically and then heard.
  - **Learning:** the lessons step added a general rule from the unit's real defects.
  - **Checks:** the browser suite passed (114 tests); main had moved during the run, so the harness merged it in and re-ran the checks before the merge.
  - **Time:** 114 minutes of work, spread over four days of interruptions (a usage limit, a session ending, a machine shutdown), each resumed where it stopped.
- **20 November, Codex as the author, on a repair:** the same command with `CONTENT_AGENT=codex` (GPT-6.1 Sol) repaired German Unit 1 and merged it.
  - **Review:** three panel rounds fell from 8 blocker or major findings to 1, and the arbiter upheld none. The panel found real errors in the live unit: Tschüss taught with a long ü, "Hallo, ich bin Maria" glossed as "Hi, Maria", the Goethe Sprechen Teil 1 format described wrongly.
  - **The new gate held:** Codex had changed `progress.ts` to carry learners' review cards between sessions. The gate refused it, and Codex undid it and kept every test.
  - **Browser fix:** a browser test still counted four sessions; Codex updated it.
  - **Result:** 601 unit tests and 114 browser tests pass on main, in 85 minutes of work.
- **Found and fixed by those runs:**
  - the voice check trusted one transcriber, which failed good clips and passed bad ones (now three, by majority, with automatic retakes);
  - the matcher read numbers only to 100 and wrote colloquial German as mistakes (now numbers to 999 999, currency signs, compound spellings, "kommste" and "heiß");
  - Codex's sandbox could not start the content scripts (they now start with `node --import tsx`);
  - an author could change app code unreviewed (now refused);
  - the lock could be fooled after a restart;
  - the production loudness upload needs a person.
- **Live clips at fault, found by the voice check:** German Unit 1's "Danke, gleichfalls!" (only "Danke" is heard) and "Auch gut" (heard as "Auf gut"). Re-recording a live clip also needs its loudness copy made again, so it is listed for the owner above.
- **Not yet proven end to end:** English A2, whose first job also creates the English units file.
