# Learning-journey redesign: decisions (October 2026)

Builds on the external review in `ux-review-2026-10.md`. Every finding there (F1–F12) was checked against the code on 8 October 2026 and confirmed. This document records what was decided and why; the review holds the evidence.

## Additional gaps found

| #   | Gap                                                                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | Home is three different screens: English shows a listening ring and four skill cards, German a speaking path, a fixed "Order naturally at a café" vocabulary card and a coach button, Spanish a hero banner. Nothing on them depends on where the learner is. |
| G2  | Two different things are called a unit: course units (Unit 1 · Hallo!) and live-speaking scenarios (A1 Erster Kontakt), each with its own "next".                                                                                                             |
| G3  | First run is three marketing slides with the language choice hidden on the last one, then a settings form (ability, goal, placement) before any learning. The tour promises "your next step is always on Home", which Home did not keep.                      |
| G4  | The Speak tab opens the generic coach for the language (B1–C1 English interviews, A2–B2 German), not something matched to the learner's level.                                                                                                                |
| G5  | Language chips (EN DE ES) repeat on Home and Learn, show codes rather than names, and will not scale past a few languages.                                                                                                                                    |
| G6  | Lesson headers say "A1 starter", jargon that tells a beginner nothing about the lesson.                                                                                                                                                                       |
| G7  | Progress's "Next step" button always shows a microphone, even when the next step is a lesson or review.                                                                                                                                                       |
| G8  | There is no "you have finished the available lessons" state; the path silently wraps to the first lesson.                                                                                                                                                     |

## Decisions

1. **One journey model.** A shared module decides, for each language: the active course position, the next lesson, and today's session. Today, Course, Progress and every completion screen read from it. Nothing else chooses "what next".
2. **Participation is not completion.** Streaks still count any practice. Plan items, lesson ticks and "phrases join your review" only follow real completions, recorded as activity IDs with the day they happened.
3. **Today's session is fixed for the day.** It is built once per day and language, holds activity IDs, and never relabels an item. A ticked item opens the activity it names.
4. **Course position is saved.** Choosing "I know some" or accepting a placement saves a starting lesson per language, which survives restarts and syncs with the account. Replaying an earlier lesson never moves it back.
5. **Workload is per language.** The 1–3 step session size grows with practice in that language, not across all languages. The streak stays app-wide.
6. **Four labelled destinations: Today, Course, Practice, Progress.** Profile moves behind an account button in the header. Speaking sits at the top of Practice and is offered after lessons, matched to the learner's level.
7. **Same layout for every language.** Content differs; screens do not. The language chips become one control ("German ▾") that opens a picker showing each language's saved position.
8. **Course shows the current unit open and the rest summarised.** Older starter lessons sit in a collapsed group. Live-speaking scenarios are called conversations and live in Practice (fixes G2).
9. **One completion pattern.** Every activity ends with what was practised, what was saved, and one main action: the next item in today's session, or "Done for today" with one named optional extra.
10. **First run reaches a lesson fast.** Choose a language and "new" or "I know some" (placement optional for every language), then the first lesson starts. Goals, accents and reminders come later.
11. **Honest English entry.** English is labelled "for learners who know the basics (A2 and up)" wherever a language is chosen, until a true beginner course exists.

## Motion

Motion is used only where it explains a change of state, and every animation respects the system's reduce-motion setting:

- Unit and course progress bars animate from the old value to the new one on completion, so progress is visible rather than just stated.
- Unit sections in Course expand and collapse with a layout transition and a rotating chevron.
- A plan item's tick scales in when it becomes done.
- The language picker slides up as a sheet.

There is no confetti, no looping animation and no motion on screens where nothing changed.

## Phases

1. Journey model and fixes for F1–F3, F8, placement persistence and G8, with tests that run the journey transitions.
2. Navigation (four labelled tabs), Today, Course, Practice and Progress screens, the language picker, and motion.
3. The shared completion pattern for lessons, review, listening and conversation.
4. First run, copy fixes (F11), contrast and touch targets (F12), and English labelling (F7, decision 11).
5. Usability round with six to eight beginners (owner to arrange), using the targets in section 8 of the review.
