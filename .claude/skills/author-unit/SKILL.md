---
name: author-unit
description: Run the content harness for one lesson job (a new unit, a checkpoint or a repair) from docs/content-backlog.md. Use for "write the next unit", "add lessons", "continue the course", "repair a unit to the standard", or /author-unit with an optional unit id.
---

# Author a unit

Lessons are written by the content harness, not by hand. If your instructions say you are already inside a harness stage, do not use this skill: do the stage's task. Otherwise read `docs/content-pipeline.md` once, then:

1. From the main project folder, start the harness in the background for one job: `npm run content:auto -- --max 1`, or `npm run content:auto -- --job <unit-id>` when a unit id was given. It takes one to three hours, most of it waiting on reviewers and the browser tests.
2. Follow it with `npm run content:auto -- --status` and `artifacts/content/auto.log`. Do not edit the job's worktree while it runs.
3. When it ends, report from the evidence, not from memory: the job's line in `docs/content-review/ledger.md`, its review record in `docs/content-review/`, and, for a blocked job, the reason shown by `--status` with the reports in `artifacts/content/<unit-id>/`.

If a job is blocked, do not push it through by hand. Decide whether the unit is at fault (then delete `artifacts/content/<unit-id>/state.json` and run the job again) or the pipeline is (then fix the pipeline in its own commit and say why in the runbook).

The harness merges finished units into the local main branch. It never pushes, publishes an update or deploys: those are the owner's.
