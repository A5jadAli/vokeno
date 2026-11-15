# Content backlog

What to write next, in order. Follow `docs/content-pipeline.md`. Take the first row whose status is `next`; when it is handed over, set the row after it to `next`. Rows marked `owner` or `engine` are not content work: skip them and leave them as they are.

Statuses: `next` · `in progress (date)` · `written, needs audio` · `ready for native review (branch)` · `blocked (why)` · `done` · `owner` · `engine` · `later`.

The order puts the course closest to a true level first. German A1 has every unit and needs repair, calls and mocks. Spanish A1 has 6 of 25 units. English is rebuilt from A2 after the decision of 15 November 2026 (`docs/english-curriculum-plan.md`); the app already starts it there, and its story is set in London.

## Queue

| #   | Work                                                                                                                                                                | Brief                                                                                 | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------ |
| 1   | `es-a1-u6` repair to the standard (4 misses: too much multiple choice, too little production)                                                                       | `npm run content:check -- es-a1-u6`; panel of 15 Nov already fixed its keys           | next   |
| 2   | `es-a1-u7` At the market, with its unit call                                                                                                                        | `docs/spanish-a1-units-plan.md`, Unit 7                                               |        |
| 3   | German A1 unit calls for `de-a1-u1` to `de-a1-u4`                                                                                                                   | `docs/unit-calls.md`; cast from `german-a1-units.ts`                                  |        |
| 4   | `de-a1-u1` repair to the standard                                                                                                                                   | `npm run content:check -- de-a1-u1`                                                   |        |
| 5   | `es-a1-u8` Clothes and personal things, with its call                                                                                                               | Spanish units plan, Unit 8                                                            |        |
| 6   | `de-a1-u2` repair                                                                                                                                                   | as row 4                                                                              |        |
| 7   | `es-a1-u9` Where you live, with its call; then Checkpoint 2                                                                                                         | Spanish units plan, Unit 9 and the checkpoint schedule                                |        |
| 8   | `de-a1-u3`, `de-a1-u4` repair; then German calls for `de-a1-u5` to `de-a1-u8`                                                                                       | as rows 3 and 4                                                                       |        |
| 9   | Continue the same alternation: one new Spanish unit (10 to 25, a checkpoint where the plan puts one), then one German repair (5 to 20) with calls in blocks of four | Spanish units plan; `content:check -- --all` for the German order (most misses first) |        |
| 10  | Two Goethe A1 mock exams (Hören, Lesen, Schreiben, Sprechen), timed, marked at the official 60%                                                                     | `docs/german-curriculum-blueprint.md`, Readiness                                      | engine |
| 11  | English A2 block 1: `A2.01` to `A2.04` as units, then its checkpoint                                                                                                | `docs/english-curriculum-units.md`, A2                                                |        |
| 12  | English A2 blocks 2 to 5, then B1                                                                                                                                   | English unit map                                                                      | later  |
| 13  | Spanish A1 mocks (DELE A1), after Unit 25                                                                                                                           | `docs/spanish-a1-assessment-review.md`                                                | later  |

## Why some rows wait

- **Row 10** needs a decision on how a full mock runs in the app (one long timed session, or four papers). That is app work first.

## App work the content depends on (for the development session)

| Work                                                                                                                                   | Why                                                                               | Status |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------ |
| **The Take**, parts 1 and 2 (`docs/the-take.md`)                                                                                       | Speaking steps are an honour-system button today.                                 | engine |
| **Review allowance.** Let the daily review grow with what is due (8 today; German adds about 7.5 cards a day) and offer a second round | By estimate only a quarter of scheduled reviews happen at one unit session a day. | engine |
| **Grammar in review.** A rule step's examples become cards (a gap to fill), not only taught phrases                                    | Grammar is taught once and never returns.                                         | engine |

## Owner

| Work                                                                                          | Status |
| --------------------------------------------------------------------------------------------- | ------ |
| Native German teacher: review Units 1 to 20 from their records as they are repaired           | owner  |
| Native Spanish (Mexico) teacher: Units 1 to 6 and each new unit's record                      | owner  |
| Five learners on German Units 1 to 5 for two weeks (the same five can do the Film test build) | owner  |
| Deploy `realtime-session` after each block of new unit calls                                  | owner  |
