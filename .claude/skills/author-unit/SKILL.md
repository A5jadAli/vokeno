---
name: author-unit
description: Write, check and hand over the next lesson unit from docs/content-backlog.md, following docs/content-pipeline.md. Use for "write the next unit", "add lessons", "continue the course", "repair a unit to the standard", or /author-unit with an optional unit id.
---

# Author a unit

Read `docs/content-pipeline.md` in full before anything else, then `AGENTS.md`. The runbook is the source of truth; this is the short form.

1. **Pick.** The unit id given, or the first `next` row in `docs/content-backlog.md`. Skip `owner`, `engine` and `later` rows. Mark it `in progress` with today's date.
2. **Work apart.** `git worktree add -b content/<unit-id> ../voka-content-<unit-id> main`. Other sessions use the main tree.
3. **Brief.** Write the coverage sheet at the top of `docs/content-review/<unit-id>.md` before any lesson: can-do, new items per session with a reason each, recognition items, one grammar point, one sound focus, what each session brings back, the scene and the learner's own lines, the exam-format task.
4. **Write** the unit after the newest unit of the same language. For a repair, change only what the standard and the panel require, and keep every lesson id and taught phrase so progress and review cards survive.
5. **Gates.** `npm run content:check -- <unit-id>`, then `npm run test:ci`. Fix every miss. Never add to the legacy list in `tests/content-standard.test.ts`; remove a repaired unit from it.
6. **Panel.** `npm run content:panel -- <unit-id>` (about ten minutes; keys as the runbook says). Check every finding against the source before acting. Fix it, or write in the record why it is wrong. Rerun; three rounds at most.
7. **Call and voices.** Add the unit call; record the voices if `.env.audio.local` has the token, otherwise mark the row `written, needs audio`.
8. **Hand over.** Finish the record (panel date, models, versions, what was done about each blocker and major, questions for the native teacher). Check the commit in a clean worktree with `npm run validate` and `npm run test:e2e`. Commit on the branch. Set the row to `ready for native review (<branch>)` and the next row to `next`.

Stop there. Do not merge to main, publish an update, deploy a function or change `levelStatus`: those are the owner's.

Report at the end: what was written, the check and panel results with numbers, what was not verified (voices heard by a person, a real phone), and what waits on the owner.
