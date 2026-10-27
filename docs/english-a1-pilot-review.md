# English A1 pilot review

Status: the M3 review pack is ready, with author findings and technical checks recorded. Reviewers are available, but no native-speaker, teacher or beginner sign-off has been recorded. These three units are a starter block, not a complete A1 course or a validated speaking assessment. See the [M3 findings and evidence](english-m3-validation.md).

## Review material

- [Open the review page](english-m3-review.html): 80 lesson steps and 123 distinct recordings, with saved findings, separate reviewer profiles and JSON export. No item is pre-approved. Export regularly and return the file to the product owner through your agreed channel.
- [Participant guide and delayed tasks](english-m3-participant-guide.md), plus the blank [observation sheet](english-m3-observations.csv).
- [Session scripts, bounded answers and feedback](english-a1-pilot-scripts.md).
- [Recording inventory with direct audio links](english-a1-pilot-audio.csv). Each row identifies the lesson version, step, speaker, variety and recording. Repeated links deliberately show all the places a clip is used.
- [All English audio models](english-audio-models.csv), including the new American narrator recordings for the older library. Review these before treating American support across the whole library as validated.
- [Curriculum plan](english-curriculum-plan.md) and [full unit map](english-curriculum-units.md).
- Application sources: [Unit 1](../src/features/foundations/english-a1-unit-1.ts), [Unit 2](../src/features/foundations/english-a1-unit-2.ts), [Unit 3](../src/features/foundations/english-a1-unit-3.ts).

The script, audio inventory and review page are generated from the actual app. Regenerate with `npm run review:english` after changing content or recordings. Run `npm run review:english:audio`, then export again to attach current recording hashes. Keep human findings in exported review files and the review log below so regeneration cannot erase them. Findings for changed lesson versions are retained but do not count as current review.

## Route to try

Open English, choose a starting ability and optional goal, and choose American or British English. A beginner starts with `en-a1-u1-meet` for every goal, including interviews and IELTS. Each unit has four sessions: Meet the language, Build a reply, Hear and respond, Use it yourself. Finish the current session, return to Today, or choose the single optional next session.

The last session of each unit offers a short call with Robin, up to three minutes, using that unit's language. The coach should close after the task is complete. Model phrases and the coach follow the selected variety; recorded characters keep their own identities. Alex and Casey use American English. Ella and Ben use British English. The scenes name the varieties without suggesting that one is better.

The updated `supabase/functions/realtime-session` backend is now deployed for M3. Use the current pilot client, which includes the selected-model greeting fix. No app store release has been published. The twelve guided sessions can be reviewed without a live call. The generated recordings are stored and technically checked; their pronunciation and naturalness still need human listening review.

After Unit 3, Today offers review and calls from completed units while more A1 units are being built. It does not automatically send this beginner into A2. Later starter lessons remain available through Course or a chosen starting point. Existing learners' older starting points, attempts and phrase review remain available.

## What each unit covers

| Unit                  | Introduced                                                            | Supported use                                                             | Changed task and retrieval                                                                   | Not yet covered                                                          |
| --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1: Hello              | Greeting, name, name question, welcome, repeat, thanks, goodbye       | Two-person scene, badge, question building, listening for a repeated name | A different name or partner; introduction retrieved at the start of Unit 2 and end of Unit 3 | Alphabet, spelling, age and contact details                              |
| 2: A little about you | Origin versus current home; two city names; student/shop/store        | Contrasting profiles, short questions, bounded written introduction       | Swap origin and home; correct a mixed-up city; ask a question back                           | All nationalities, broad job vocabulary, third-person grammar, addresses |
| 3: A drink, please    | Three drinks, request, accept/decline, correct a drink, here/takeaway | Tiny menu, order note, both regional service questions                    | Change drink and place; catch a wrong confirmation; return to introductions at class         | Prices, quantities, payment, complex substitutions                       |

Written tasks deliberately ask for supplied facts or a stated pattern. They do not grade an arbitrary personal introduction against a short whitelist. Speaking models are optional and hidden until requested; the task and self-check remain visible. Choosing “I said it aloud” records practice only. It is not evidence of independently assessed speaking.

## Native and teacher review

Review the English and recordings separately. An accurate script does not prove that a generated voice pronounced it naturally. American and British reviewers should each check their own models and cross-variety understanding.

For every step, record:

1. Is the language natural for this situation today? Is a regional preference labelled accurately without presenting it as a universal rule?
2. Does the learner have the language needed for the task? Do the instructions, fictional details, answer and audio agree?
3. Does every rejected choice fail the stated task? Try a plausible alternative, especially contractions, shop/store and takeaway/to go. An open task must not demand the model verbatim.
4. Is the voice complete, audible and consistent with the named speaker? Check short clips such as Hi and longer linked phrases. Silence detection and loudness measurement cannot judge pronunciation, accent or warmth.
5. Can the learner succeed with a different name, city or drink? Does correction repair the meaning without penalising a valid variety or accent?

Check the older repaired lessons too: `en-phrasal`, `en-small-talk`, `en-workplace`, `en-real-meaning`, `en-connected`, `en-sounds`, `en-register`, `en-ielts-listening`, `en-ielts-reading`, and the standalone `sleep-tfng` reading task. Their IDs and previous completed attempts are retained. Changed partial exercises restart to avoid resuming against a different question key.

## Beginner observation

Use the participant's actual phone and note their first language and starting English ability. Observe without explaining the interface first. Ask them to find the first lesson, replay a scene, recover from a wrong answer, find the next step, and explain what they can practise after Unit 3.

Record support used: example shown, audio replayed, transcript read, human instruction translated, or independent attempt. These observations belong in the pilot sheet; the app does not yet store a durable support-use portfolio. Do not infer independent use from a quiz score or a speaking completion tap.

After the first attempt, ask for one changed task without displaying its model. On a later day, ideally about a week later, repeat a comparable task with new details. Record task achievement, intelligibility, interaction/repair and language separately. Record self-reported comfort separately from performance. No native-speaker percentage or promised fluency outcome is appropriate.

## Known limits and release gate

- Instructions currently use English, supported by examples and a few visual cues. No reviewed support-language pack exists yet. Beginners with no English literacy may need help; test this before advertising universal beginner access.
- Browser and offline fallback need the relevant installed English voices. A missing American voice must not silently play a British voice under an American label. Native recorded playback uses the asset inventory.
- Live coaching and correction are variable generated output. Test actual calls in both varieties and all three units. A transcript cannot establish pronunciation quality. Optional calls must not be required to finish the guided lessons.
- The legacy B1/B2 library is still available. Its complete integration into the future core and opt-in exam branches belongs to M5. Selecting Meetings or Presentations does not imply that all the planned professional missions already exist.
- This pilot does not implement a full CEFR coverage matrix, cumulative A1 checkpoint, professional portfolio or validated confidence measure. Unit 4 and the first checkpoint follow the three-unit review boundary.

Do not expand to the remaining A1 units until blocking meaning, marking and audio findings are resolved and their affected versions re-reviewed. Unit counts, generated recordings and passing software tests are implementation evidence, not native or learning-outcome validation.

## Review log

| Reviewer / role      | Lesson and version / step / audio key | Finding and proposed correction                         | Severity | Resolution and re-review |
| -------------------- | ------------------------------------- | ------------------------------------------------------- | -------- | ------------------------ |
| American reviewer    | Pending                               | Scripts and listening review needed                     | Pending  | Pending                  |
| British reviewer     | Pending                               | Scripts and listening review needed                     | Pending  | Pending                  |
| English teacher      | Pending                               | Scaffolding, valid alternatives and assessment scope    | Pending  | Pending                  |
| Beginner observation | Pending                               | Navigation, instructions, changed task and later recall | Pending  | Pending                  |
