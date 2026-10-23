# Lesson-linked coach calls

After a unit's Exam task, the learner can talk it through with that unit's character for 3 minutes. The call has a twist, uses the unit's phrases, and ends with a review card. Every learner gets one free call per unit; Plus members can repeat them.

## How it works

- **Calls:** `supabase/functions/_shared/unit-calls.ts` defines one call per unit (`es-a1-u1` to `es-a1-u6` so far), each with a character, persona, scene, twist and the unit phrases to listen for. The app and the `realtime-session` edge function import the same file, so the call the learner is offered is the call the server runs.
- **Invite:** `UnitCallInvite` in `src/components/step-lesson.tsx` appears when an Exam task is completed and says whether the free call is still available (`usedUnitCalls` in the coaching store).
- **Call:** `/conversation?call=<id>` runs a realtime session with the call's brief appended to the usual instructions. Corrections are on, since unit calls are for beginners. A countdown ends the call at 3 minutes.
- **Server rules:** the function claims the call with the `voka_unit_call` RPC before starting. A learner without Plus who has already used that call gets HTTP 402 with `reason: 'free-call-used'`, and the app links to Plus. If the call cannot start (connection, upstream or bind failure), the claim is released so the free call is not lost. The daily live-practice allowance applies as usual.
- **Review:** when the call ends, the app:
  1. marks which unit phrases came up (`phrasesUsed`, which ignores accents, case and punctuation, and does not match inside another word);
  2. brings unused phrases back in tomorrow's review, one box lower, never reset (`bringBackSooner` in `src/features/coaching/unit-call-review.ts`);
  3. asks the function's `review` action for up to 3 corrections (You said · People say, with tap to hear), one pronunciation tip and up to 3 non-sensitive facts. Corrected unit phrases are also brought back sooner.
- **Memory:** facts and repeated corrections are kept per language in the coaching store (6 facts, 3 corrections, 120 characters each). They stay on the device, are not synced to the cloud, and are sent only with a unit call, labelled in the brief as data, not instructions. **Profile → Coach memory** shows them; the learner can delete any item or clear everything.

## Exam practice near a goal date

When the learner's goal is German or Spanish A1 and the date is 42 days away or less, the goal card offers exam practice: Goethe A1 or DELE A1 speaking cue cards in `/speaking-mock?track=…&level=A1`. The examiner gives one strength and one thing to practise, never a score or a pass/fail.

## Adding a call for a new unit

1. Add an entry to `unitCalls` with the unit's id, character and at least four phrases. Every `match` fragment must be lower case, with no accents or end punctuation, as `normaliseSpeech` produces.
2. Run `npm test`. `tests/unit-calls.test.ts` checks that every call belongs to a real unit.
3. Deploy the `realtime-session` function, since it reads the same file.

## Deploy

1. Apply the migration `supabase/migrations/20261023000000_unit_calls.sql` (`npx supabase db push` on the linked project).
2. Deploy the function: `npx supabase functions deploy realtime-session`.
3. Ship the app update. Builds without the update never send a `callId`, so they are unaffected.

The review uses `OPENAI_ASSESSMENT_MODEL` (default `gpt-4o-mini`). A 3-minute call costs about US$0.24 on `gpt-realtime-2.1`, or about US$0.12 on the mini model. See the business model plan for the cost of free calls.
