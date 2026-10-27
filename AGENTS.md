# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# How to work in this repo

Behavioural rules adapted from Andrej Karpathy's guidelines (forrestchang/andrej-karpathy-skills), plus the project rules this codebase has proved it needs. They favour care over speed; for trivial tasks, use judgment.

## 1. Think before coding

- State assumptions. If a request has more than one reading, name them; do not pick silently.
- If something is unclear, stop and ask. If a simpler approach exists, say so and push back when warranted.
- Check the claim before building on it: read the code, the content data or the device output, not memory of it.

## 2. Simplicity first

- The minimum that solves the problem. No speculative features, options or abstractions for one use.
- No error handling for cases that cannot happen. If 200 lines could be 50, rewrite.

## 3. Surgical changes

- Every changed line traces to the request. Do not reformat, refactor or "improve" neighbouring code; match the existing style.
- Remove only what your change made unused; mention other dead code, do not delete it.
- **Other sessions edit this working tree at the same time.** Before committing, run `git status` and `git diff` on every file. Stage only your own hunks, never a whole file that contains someone else's changes, and check the commit alone in a clean `git worktree` (type-check and tests) before pushing.

## 4. Goal-driven, verified work

- Turn a task into checks: a failing test that reproduces a bug, then the fix; tests green before and after a refactor.
- For multi-step work, state the plan as steps with how each is verified.
- Report what was verified and how. "Done" means checked; say plainly what was not checked.
- Motion, touch, keyboard and audio only prove themselves on a real Android phone; web screenshots cannot.

## Project rules

- **Levels must be true.** A level label (A1 to C1) is claimed only when the content would get a learner there and through the matching exam. English is B1 to C1 and IELTS: no A1 or A2 labels, lessons below B1 are a warm-up. See `docs/curriculum-standards-audit.md` and `docs/spanish-a1-curriculum-plan.md` (checkpoint pass mark).
- **Content is native-first.** Modern, natural language with register labels; official word lists only as a coverage benchmark. Answer keys accept every reasonable answer.
- **Design follows `docs/design-system.md`.** Tokens from `src/constants/theme.ts` only (lint enforces it); ink actions, lime only for voice on ink, one radio mark, the calm result sheet, say less.
- **The preview channel reaches real users.** An OTA update is a release: run the full checks first. Native modules and config changes need a store build, never an OTA.
- **Releases and deploys** (`eas update`, `supabase db push`, functions deploy) are the owner's call unless they ask you to run them.
