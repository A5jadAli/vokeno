# Spanish A1 implementation milestones

Updated 18 October 2026. Target: everyday beginners preparing towards **standard DELE A1**. This is the implementation ledger for the [curriculum plan](spanish-a1-curriculum-plan.md), [unit briefs](spanish-a1-units-plan.md), [coverage register](spanish-a1-coverage.md) and [assessment/review specification](spanish-a1-assessment-review.md).

## Delivery sequence

Build one reviewable unit at a time within each batch. Each unit must work from Today through completion and review before starting the next one. The table separates teaching content from the infrastructure needed to substantiate exam-readiness claims.

| Milestone | Deliverable                                                                                                                     | Acceptance and dependencies                                                                                                                                        | State                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| M1        | Unit 1, four sessions; shared optional speaking models; safe replacement of three starter lessons; focused German improvements  | Working journey, complete audio inventory, retained history/review intervals, no false speaking score                                                              | Implemented locally; language review and beginner pilot pending            |
| M2a       | Unit 2: origins, languages and personal details; prerequisite-aware practice selection                                          | Continue Unit 1 chunks; Today and Practice avoid advanced A1/A2 tasks before their prerequisites; bridge for existing starter learners                             | Unit 2 implemented; suggestion prerequisites and legacy bridge remain open |
| M2b       | Unit 3: numbers and phone numbers; Unit 4: spelling, email and the A1 personal-details form (split from one unit on 18 October) | Field-specific feedback, accepted variants, accessible form, matching app/server definitions; source/auditor review                                                | Units 3 and 4 and both practice forms implemented; native review pending   |
| M2c       | Unit 5: family and descriptions; checkpoint 1                                                                                   | Original reading/listening and personal writing/speaking evidence across U1–5; different reattempt; targeted next practice; native/beginner pilot before expansion | Unit 5 implemented; checkpoint 1 planned                                   |
| M3        | Units 6–9: café, shopping, home and location; checkpoint 2                                                                      | One unit per increment; earlier number/repair retrieval; new scenes and reviewed audio; early scaffolded Spain listening                                           | Planned                                                                    |
| M4        | Units 10–13: time, routine, work/study and interests; checkpoint 3                                                              | Varied speakers, information gaps, personal responses and delayed reuse                                                                                            | Planned                                                                    |
| M5        | Units 14–17: directions, transport, travel and accommodation; checkpoint 4                                                      | Functional notices, bookings, details/form transfer and interactive requests                                                                                       | Planned                                                                    |
| M6        | Units 18–21: help, services, invitations and messages; checkpoint 5                                                             | Short A1 writing with all requested points; repair and negotiation; validated productive feedback                                                                  | Planned                                                                    |
| M7        | Units 22–25: integration and independent A1 tasks; checkpoint 6                                                                 | Close every coverage row with source, instruction, retrieval and evidence; cumulative unseen tasks                                                                 | Planned                                                                    |
| M8a       | DELE entry and full assessment runner                                                                                           | All 13 task families; verified timings/replays; saved attempts; separate speaking preparation; required oral duration; accurate group scoring                      | Planned                                                                    |
| M8b       | Three original full mocks and readiness reporting                                                                               | Distinct reviewed stimuli and audio; rating calibration; native/exam-teacher sign-off; learner pilot; current official-source verification                         | Planned                                                                    |

Keep the existing Spanish violet palette, shared components, Today → Course → Practice → Progress navigation and Words → Grammar → Real talk → Exam task rhythm. Show the learner one recommended next action. Optional challenge/help must remain optional. The session estimates are starting assumptions for the pilot, not a target learners must beat.

## M1: what is implemented

[Unit 1 source](../src/features/foundations/spanish-a1-units.ts) contains 42 steps across four sessions, 17 taught review phrases and a synthesis session with no new cards:

| Session ID         | Everyday task                          | Practice                                                                                                    | Review targets           |
| ------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ |
| `es-a1-u1-words`   | Say hello and leave on a friendly note | Ana/Omar exchange; greeting choice; courtesy; vowels and silent h; listening; recall; changed time of day   | 7                        |
| `es-a1-u1-grammar` | Your name, your turn                   | Name/origin chunks; tú/usted in an explicit context; listening; unfamiliar name card; personal introduction | 5                        |
| `es-a1-u1-talk`    | Keep going when you miss a word        | Repetition, slower speech and spelling; choose help for the actual difficulty; personal repair request      | 5                        |
| `es-a1-u1-task`    | Meet someone new                       | Different names/places in short texts; name listening; written recall; introduction with a repair request   | 0; reuse the previous 17 |

The small `soy de + place` chunk is now taught in Unit 1. Unit 2 still develops origin, residence, languages and related grammar. `Nombre` is glossed before the first card task. The first scene contains some supported incidental language; it is not all required for recall in session one. Asking for spelling is introduced here; decoding spelled letters is taught later.

Each speaking step starts with a task and an immediately available **Show an example** button. The model and its audio controls are hidden until requested. Selected tasks add self-check cues and a changed situation; starting that situation hides the previous model and stops its audio. Learners can use invented details and skip speech. These activities are **unrecorded self-practice**, not interactive conversations or assessed pronunciation. The existing first-try score covers objective exercises only.

The shared change also benefits all German step sessions. Completion now says what was practised, labels self-reported speech as “Practised”, and handles sessions that introduce no phrases. Existing next-action and unit-progress components supply the onward path. The path now continues from Unit 1 into Units 2, 3 and 4. After Unit 4, the next currently available lesson is the existing Spanish sounds lesson. Units 5–25 are not displayed as available.

### Saved progress and audio

- Three earlier IDs remain in the catalogue for history, links and review: `es-first-words`, `es-names`, `es-repair`. Their replacements are respectively `es-a1-u1-words`, `es-a1-u1-grammar`, `es-a1-u1-talk`. Only these three are retired from the default path in this working implementation.
- Saved starting points resolve to available replacements. An unfinished first attempt at a retired lesson remains resumable and appears under **Saved lessons** in Course. The newest unfinished first attempt wins. Replaying a completed lesson does not take over the recommendation.
- Completed older lessons are not silently credited as completing newly authored tasks. Current-course totals count the active path; earlier attempts remain stored. A placement/bridge that lets established starter learners demonstrate what they already know is still M2a work. The partial rollout can otherwise recommend familiar material again.
- Completing a replacement inherits exact matching phrase cards from retired lessons in the same language, including earned intervals and due dates. Existing replacement cards remain authoritative. Retired duplicates are excluded from the review queue once the active card exists. This is migration protection, not the full cross-unit concept/retrieval system planned for later milestones.
- Fifteen of the 17 expressions reuse the former beginner vocabulary and keep their earned review intervals. Buenas tardes and buenas noches were added in the 18 October native pass; they start as new cards and have new clips. Passing the audio-inventory check proves that the expected clip entries exist, not that a native teacher approved their performance. Listen to the actual recordings during review.
- Spanish A1 remains labelled **starter**. There are twenty active step sessions and 11 remaining classic A1 lessons; A2 keeps its 14 classic lessons. Finishing the available material is not a DELE-readiness claim.

## M2: Units 2 to 4 delivered for the native pilot

The [review packet](spanish-a1-units-1-3-review.md) contains the exact scope, prerequisite map, grading rules and outstanding review questions. The [audio sheet](spanish-a1-audio-review.csv) lists all 175 unique clips used across the five units, including 158 newly generated clips.

- Unit 2: four sessions, 48 steps, 19 new review targets. Origins, residence, languages, occupations, nationality forms, singular verb patterns, contextual tú/usted and introducing a friend. Final practice changes the people and details rather than repeating the model.
- Unit 3: four sessions, 52 steps, 16 new review targets. Numbers through 100 by pattern, age, phone numbers read digit by digit and in Mexican pairs, a corrected ending and a three-field details form.
- Unit 4: four sessions, 36 steps, 9 new review targets. Form labels, the alphabet with Mexican letter names (be grande, ve chica), mi/tu/su, email symbols, desk spelling and a five-field registration that retains a saved draft and gives field-specific feedback. It is local learning practice, not a full DELE W1 runner; the existing cloud JSON envelope carries its bounded draft without a new backend grading contract.
- Dictation now supports normal/slow playback and an explicit transcript fallback. Requested text help cannot become first-try listening credit, including after reload. Contact details and spelling exercises preserve meaningful characters instead of applying phrase-level punctuation tolerance.
- Unit 5 (23 October): four sessions, 42 steps, 17 new review targets. People in your life, descriptions with agreement, possessives and introductions; `es-family` retires to it.
- All 20 sessions keep one onward action, optional speaking models and changed situations. The total taught review set is 78 unique targets. No new cards are added by the synthesis sessions.
- Audio generation is complete and durations are measured. The admin token is stored only in the ignored local secret file and the linked Supabase project. Native listening review remains pending.

M2a is only partially complete: automatic standalone practice suggestions still filter by level, not lesson prerequisites, and the bridge for established starter learners remains open. The learner follows the ordered lesson path, but these broader recommendation features must be finished before a general rollout claim. M2b delivers the short form precursor; the full assessed exam runner remains M8a. Stop after Unit 3 for native review before proceeding to M2c.

## Competing products: lessons to use, claims to avoid

Research checked 18 October 2026 against first-party product descriptions. This is a desk review, not a controlled comparison of current app installations or learning outcomes. Capabilities can vary by course/platform.

| Verified observation                                                                                                                                                                                                                                                                   | Decision for Vokeno                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Duolingo offers free skills practice, mistake and word review, speaking and listening. Its description also includes Stories/Radio/Adventures where available, and Max conversation practice. [Official Practice tab guide](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) | Short varied sessions, contextual language and feedback are baseline expectations. We cannot claim these features are missing elsewhere.                                                              |
| Duolingo describes spacing, accuracy-based scheduling and trying to remember before checking the answer. [Official learning-science explanation](https://blog.duolingo.com/spaced-repetition-for-learning/)                                                                            | Keep spaced review and encourage an initial unaided attempt. Make assistance easy to reveal and avoid presenting this technique as our invention.                                                     |
| U-Dictionary's developer listing describes dictionaries, bilingual/native examples, text/camera/voice translation and English grammar checking. [Developer's App Store description](https://apps.apple.com/de/app/u-dictionary/id1319771553)                                           | Fast explanations and examples help learners, but our product promise needs a sequenced curriculum and evidence of transfer. The listing alone does not prove the absence of other learning features. |

Our intended differentiation is a **traceable everyday-to-exam route**: know the next task, use language with changed information, revisit it later and demonstrate all required skills on unseen tasks. This is a design hypothesis; the first three units are the initial implementation. Full writing, genuine interactive evidence, prerequisite filtering, assessed checkpoints, Spain input and mock exams remain open work. Do not market the app as better than Duolingo or U-Dictionary on the basis of this implementation.

Pilot acceptance targets below are proposed product thresholds, not research-established universal rules:

1. At least 8 of 10 first-time beginners can identify and start the recommended lesson without facilitator help, then identify the next action after completion.
2. Review recordings/observations of where they request a model, become stuck or abandon a task; reduce confusing text or overload before adding more content. Opening help is not failure.
3. After a delay, use new names, places and situations to check unaided recall and communicative success. An unseen answer must not be displayed as part of the prompt.
4. Ask a Spanish teacher to rate the personal responses for understandable task completion and appropriateness. Do not treat correct choice answers or “I said it aloud” as oral evidence.
5. If claiming superiority later, compare learning outcomes with a fair matched starting level, study time and unseen tasks. Engagement and retention are useful, but session duration alone is not learning.

## German A1 improvements in M1

- Replaced the “under about 30” rule for **du/Sie** with relationship, setting and established practice. The party question now explicitly states the group uses du, and the neighbour scene identifies her use of Sie rather than making age the deciding factor. This matches Goethe's explanation that workplace usage varies and colleagues may offer du. [Goethe: workplace communication](https://www.goethe.de/prj/mwd/en/deu/tzs/muendlich/ima.html).
- Added optional changed situations and self-check cues to Unit 1's introduction and repair speaking tasks. Existing recorded German lines remain usable.
- Separated the everyday question about another person's name from the exam-introduction instruction. Full task administration must still be checked against [Goethe's official A1 practice materials](https://www.goethe.de/en/spr/prf/ueb/pa1.html).
- Removed Unit 20's promise that full mocks “come next”; it now describes the activity as a short warm-up and says full mocks are not yet available.

The existing content-version safeguard restarts an unfinished run of a German session whose authored content changes; it retains completed attempts and review cards. The retired Spanish lessons retain their original content versions and unfinished runs.

Next German audit priorities: map the 20 units to all Goethe A1 functions and task types; sample truly unseen listening/reading; add progressively independent messages and interactive speaking; link remedial practice to weaknesses; review du/Sie and regional speech across the remaining units. These are not completed by changing Unit 1.

## Native review packet and release gate

Units 1–5 are available for local review, not marked language-approved. Use the [pilot packet and audio sheet](spanish-a1-units-1-3-review.md). Review the actual [Spanish scripts](../src/features/foundations/spanish-a1-units.ts), rendered tasks and recordings together. Record issues using the [assessment review protocol](spanish-a1-assessment-review.md); do not accept a general “looks good” as coverage sign-off.

| Review scope                                | Evidence needed                                                                                                                              | Current status         |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| All Spanish text, translations and feedback | Mexican reference speaker + Spanish-language teacher; natural expressions, accent/orthography, distractor validity and accepted alternatives | Pending                |
| Register and regional claims                | Check tú/usted context, `mucho gusto`, `ll`, pronunciation guidance and coherent reference variety                                           | Pending                |
| Listening                                   | Listen to each actual clip and scene voice; verify wording, intelligibility, stress, pace and natural interaction                            | Pending                |
| Beginner load                               | Observe all twenty sessions; time, confusing instructions, model use, reading difficulty and ability to choose the next action               | Pending                |
| A1/DELE claims                              | U1–3 are introductory practice only; no complete task-family or speaking competence sign-off yet                                             | Open, later milestones |
| German changes                              | Native/teacher review of revised register guidance and mission prompts                                                                       | Pending                |

Automated checks cover IDs, journey order, saved-run access, review-card inheritance/deduplication, Spanish punctuation, audio inventory and model visibility. Browser walkthroughs now cover all sixteen Spanish sessions and the existing German beginner flow at two mobile widths. They do not replace language, native-device audio, accessibility assistive-technology or exam-rater review.

### M1 validation record: 18 October 2026

- `npm run validate`: passed. Expo Doctor 21/21; formatting, TypeScript and lint clean; 49 test suites / 433 tests passed.
- `npx playwright test e2e/foundations.spec.ts --grep 'Spanish Unit 1|a complete beginner'`: four passed across compact and modern Android-sized web viewports. Spanish goes from Today through all four sessions, optional model/challenge controls, completion, the next available lesson and 15 scheduled review phrases. German covers correction, a saved draft, completion and onward navigation.
- Speaking-screen screenshots inspected for consistency with the existing visual design. These were browser emulations, not physical Android/iOS audio tests.
- The initial local browser server could not start inside the restricted sandbox; the successful run used the same synthetic configuration outside it. Browser requests to external hosts remained blocked. An initial test assertion omitted the period in “Unit complete.”; the corrected walkthrough passed at both widths.

### M2 validation record: 18 October 2026

- `npm run format:check`, `npm run typecheck`, `npm run lint` and `npm run test:ci`: passed; 51 suites / 444 tests. Includes exact contact grading, Unicode/ñ, leading zeros, email punctuation, bounded form draft recovery, transcript visibility, correct-field retention, journey order, phrase uniqueness, existing progress migration and the complete audio inventory.
- Mobile browsers: four checks passed after the form-focus improvement, covering the full twelve-session Spanish flow and the German beginner regression at both sizes. Ran `npx playwright test e2e/foundations.spec.ts --grep 'Spanish Units 1 to 3|a complete beginner'` separately with `--project=compact-android` and `--project=modern-android`. The walkthrough includes wrong-field feedback, saved surname/phone details, assisted listening after reload, optional speaking models, onward navigation and 58 scheduled review targets.
- Expo Doctor: all 21 checks passed with `NODE_USE_ENV_PROXY=1 npm run doctor`. The initial direct-network run passed 19 checks but timed out reaching the config-schema API and received an unexpected directory response; the proxy-backed retry resolved both.
- Audio: 110 new clips generated through the linked Supabase function (7 of them in the 18 October native pass); all recorded and measured. The 127-clip review sheet matches current lesson IDs, step positions and content versions. Native listening approval remains pending.
- Visual review: inspected mobile speaking and form-feedback screenshots at both sizes. Incorrect form fields now receive focus, and feedback identifies the fields to fix while preserving the others. These are browser checks, not physical-device keyboard or audio verification.
- New Spanish unit text and Spanish planning/review documents contain no em dashes. The private audio environment file is gitignored with mode 600; no secret values were added to source control.
