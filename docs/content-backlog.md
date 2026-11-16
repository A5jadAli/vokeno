# Content backlog

What the content harness writes next, in order (`docs/content-pipeline.md`). Run `npm run content:auto` and it takes the first job that is not done. `npm run content:auto -- --status` shows where each job stands.

One row is one job. Kinds: `unit` (a new unit with its unit call), `checkpoint`, `repair` (bring a live unit inside the content standard). Status is `todo` or `done (date)`; the harness changes it and nothing else in the table. To change the order, move rows. To add work, add a row.

The order puts the course closest to a true level first and keeps every course moving: a new Spanish unit, then a German repair, with the first English A2 units mixed in. The first English job is the least proven: it has to create the English units file as well as the unit.

## Queue

| # | Job | Kind | Brief | Status |
| --- | --- | --- | --- | --- |
| 1 | `es-a1-u6` | repair | `npm run content:check -- es-a1-u6` | done (2026-11-15) |
| 2 | `es-a1-u7` | unit | `docs/spanish-a1-units-plan.md`, Unit 7: At the market; with its unit call | todo |
| 3 | `de-a1-u1` | repair | `npm run content:check -- de-a1-u1`; add its unit call (`docs/unit-calls.md`) | todo |
| 4 | `es-a1-u8` | unit | `docs/spanish-a1-units-plan.md`, Unit 8: Clothes and personal things; with its unit call | todo |
| 5 | `de-a1-u2` | repair | `npm run content:check -- de-a1-u2`; add its unit call (`docs/unit-calls.md`) | todo |
| 6 | `es-a1-u9` | unit | `docs/spanish-a1-units-plan.md`, Unit 9: Where you live; with its unit call | todo |
| 7 | `es-a1-cp2` | checkpoint | `docs/spanish-a1-units-plan.md`, checkpoint schedule, CP2 (U6–9); pattern `spanish-a1-checkpoint-1.ts` | todo |
| 8 | `de-a1-u3` | repair | `npm run content:check -- de-a1-u3`; add its unit call (`docs/unit-calls.md`) | todo |
| 9 | `es-a1-u10` | unit | `docs/spanish-a1-units-plan.md`, Unit 10: Time, dates and opening hours; with its unit call | todo |
| 10 | `de-a1-u4` | repair | `npm run content:check -- de-a1-u4`; add its unit call (`docs/unit-calls.md`) | todo |
| 11 | `en-a2-u1` | unit | `docs/english-curriculum-units.md`, A2.01: Explain where you were; London setting and cast from `docs/english-curriculum-plan.md`; with its unit call | todo |
| 12 | `es-a1-u11` | unit | `docs/spanish-a1-units-plan.md`, Unit 11: A normal day; with its unit call | todo |
| 13 | `de-a1-u5` | repair | `npm run content:check -- de-a1-u5`; add its unit call (`docs/unit-calls.md`) | todo |
| 14 | `es-a1-u12` | unit | `docs/spanish-a1-units-plan.md`, Unit 12: Work, study and learning Spanish; with its unit call | todo |
| 15 | `de-a1-u6` | repair | `npm run content:check -- de-a1-u6`; add its unit call (`docs/unit-calls.md`) | todo |
| 16 | `es-a1-u13` | unit | `docs/spanish-a1-units-plan.md`, Unit 13: Free time and preferences; with its unit call | todo |
| 17 | `es-a1-cp3` | checkpoint | `docs/spanish-a1-units-plan.md`, checkpoint schedule, CP3 (U10–13); pattern `spanish-a1-checkpoint-1.ts` | todo |
| 18 | `de-a1-u7` | repair | `npm run content:check -- de-a1-u7`; add its unit call (`docs/unit-calls.md`) | todo |
| 19 | `en-a2-u2` | unit | `docs/english-curriculum-units.md`, A2.02: Describe a completed activity; London setting and cast from `docs/english-curriculum-plan.md`; with its unit call | todo |
| 20 | `es-a1-u14` | unit | `docs/spanish-a1-units-plan.md`, Unit 14: Your neighbourhood; with its unit call | todo |
| 21 | `de-a1-u8` | repair | `npm run content:check -- de-a1-u8`; add its unit call (`docs/unit-calls.md`) | todo |
| 22 | `es-a1-u15` | unit | `docs/spanish-a1-units-plan.md`, Unit 15: Public transport; with its unit call | todo |
| 23 | `de-a1-u9` | repair | `npm run content:check -- de-a1-u9`; add its unit call (`docs/unit-calls.md`) | todo |
| 24 | `es-a1-u16` | unit | `docs/spanish-a1-units-plan.md`, Unit 16: Weather, seasons and a day out; with its unit call | todo |
| 25 | `de-a1-u10` | repair | `npm run content:check -- de-a1-u10`; add its unit call (`docs/unit-calls.md`) | todo |
| 26 | `en-a2-u3` | unit | `docs/english-curriculum-units.md`, A2.03: Ask about someone else's experience; London setting and cast from `docs/english-curriculum-plan.md`; with its unit call | todo |
| 27 | `es-a1-u17` | unit | `docs/spanish-a1-units-plan.md`, Unit 17: At a hotel; with its unit call | todo |
| 28 | `es-a1-cp4` | checkpoint | `docs/spanish-a1-units-plan.md`, checkpoint schedule, CP4 (U14–17); pattern `spanish-a1-checkpoint-1.ts` | todo |
| 29 | `de-a1-u11` | repair | `npm run content:check -- de-a1-u11`; add its unit call (`docs/unit-calls.md`) | todo |
| 30 | `es-a1-u18` | unit | `docs/spanish-a1-units-plan.md`, Unit 18: Wellbeing and asking for help; with its unit call | todo |
| 31 | `de-a1-u12` | repair | `npm run content:check -- de-a1-u12`; add its unit call (`docs/unit-calls.md`) | todo |
| 32 | `es-a1-u19` | unit | `docs/spanish-a1-units-plan.md`, Unit 19: Everyday services and the phone; with its unit call | todo |
| 33 | `de-a1-u13` | repair | `npm run content:check -- de-a1-u13`; add its unit call (`docs/unit-calls.md`) | todo |
| 34 | `en-a2-u4` | unit | `docs/english-curriculum-units.md`, A2.04: Tell a short connected story; London setting and cast from `docs/english-curriculum-plan.md`; with its unit call | todo |
| 35 | `es-a1-u20` | unit | `docs/spanish-a1-units-plan.md`, Unit 20: Invitations and simple plans; with its unit call | todo |
| 36 | `de-a1-u14` | repair | `npm run content:check -- de-a1-u14`; add its unit call (`docs/unit-calls.md`) | todo |
| 37 | `es-a1-u21` | unit | `docs/spanish-a1-units-plan.md`, Unit 21: Short messages people can act on; with its unit call | todo |
| 38 | `es-a1-cp5` | checkpoint | `docs/spanish-a1-units-plan.md`, checkpoint schedule, CP5 (U18–21); pattern `spanish-a1-checkpoint-1.ts` | todo |
| 39 | `de-a1-u15` | repair | `npm run content:check -- de-a1-u15`; add its unit call (`docs/unit-calls.md`) | todo |
| 40 | `es-a1-u22` | unit | `docs/spanish-a1-units-plan.md`, Unit 22: Choose an outing from real information; with its unit call | todo |
| 41 | `de-a1-u16` | repair | `npm run content:check -- de-a1-u16`; add its unit call (`docs/unit-calls.md`) | todo |
| 42 | `es-a1-u23` | unit | `docs/spanish-a1-units-plan.md`, Unit 23: Forms and simple public transactions; with its unit call | todo |
| 43 | `de-a1-u17` | repair | `npm run content:check -- de-a1-u17`; add its unit call (`docs/unit-calls.md`) | todo |
| 44 | `es-a1-u24` | unit | `docs/spanish-a1-units-plan.md`, Unit 24: Talk about your world; with its unit call | todo |
| 45 | `de-a1-u18` | repair | `npm run content:check -- de-a1-u18`; add its unit call (`docs/unit-calls.md`) | todo |
| 46 | `es-a1-u25` | unit | `docs/spanish-a1-units-plan.md`, Unit 25: A day you can manage; with its unit call | todo |
| 47 | `es-a1-cp6` | checkpoint | `docs/spanish-a1-units-plan.md`, checkpoint schedule, CP6 (U22–25); pattern `spanish-a1-checkpoint-1.ts` | todo |
| 48 | `de-a1-u19` | repair | `npm run content:check -- de-a1-u19`; add its unit call (`docs/unit-calls.md`) | todo |
| 49 | `de-a1-u20` | repair | `npm run content:check -- de-a1-u20`; add its unit call (`docs/unit-calls.md`) | todo |

## Not in the queue yet

- Two Goethe A1 mock exams and the DELE A1 mocks: they need a decision on how a full mock runs in the app first.
- English A2 units 5 to 20, then B1: add rows when the first four have been through the harness.
- Spanish A2 and German A2 as units.

## App work the content depends on (for the development session)

| Work                                                                                                                                   | Why                                                                               | Status |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------ |
| **The Take**, parts 1 and 2 (`docs/the-take.md`)                                                                                       | Speaking steps are an honour-system button today.                                 | engine |
| **Review allowance.** Let the daily review grow with what is due (8 today; German adds about 7.5 cards a day) and offer a second round | By estimate only a quarter of scheduled reviews happen at one unit session a day. | engine |
| **Grammar in review.** A rule step's examples become cards (a gap to fill), not only taught phrases                                    | Grammar is taught once and never returns.                                         | engine |
| **Digit answers with a unit word.** `formFieldCorrect` accepts `68 pesos` or `90 euros` for a digits answer | Found by the Unit 6 repair: today each unit has to list them. | engine |
| **Open spoken or written orders.** A typed order with many right forms fits The Take or a model-marked answer better than a list | Found by the Unit 6 repair: three panel rounds each asked for more variants. | engine |

## Owner

| Work                                                                                          | Status |
| --------------------------------------------------------------------------------------------- | ------ |
| Native German teacher: review Units 1 to 20 from their records as they are repaired           | owner  |
| Native Spanish (Mexico) teacher: Units 1 to 6 and each new unit's record                      | owner  |
| Five learners on German Units 1 to 5 for two weeks (the same five can do the Film test build) | owner  |
| Deploy `realtime-session` after each block of new unit calls                                  | owner  |
