# English M3 validation record

27 October 2026. Status: in progress. Author and technical checks are separate from native review, teacher review and observed learning. The product owner confirmed that reviewers are available. No completed external findings or participant results have been supplied yet.

## What is ready for reviewers

Open [the review page](english-m3-review.html) in a browser. It contains the actual 12 sessions, 80 steps and 123 distinct recorded clips. Enter a reviewer code and role. Check scripts and listen to audio separately; choose a decision, add a severity and explanation for changes, and export findings. The page stores drafts locally and does not transmit findings. Audio is fetched from the public lesson store when played.

The page identifies each script by lesson version and each audited recording by a SHA-256 hash. Changing a lesson or recording does not silently carry its approval forward. Old findings remain in exports. Technical reviewer entries and an export action do not count as native approval or completion of M3.

Use the [participant guide](english-m3-participant-guide.md) and [blank observation sheet](english-m3-observations.csv) for learner sessions. They include navigation, all four skills, two changed-task forms per unit, support-use tracking, later recall and separate comfort ratings. They are practical pilot instruments, not a validated proficiency scale.

## Author review findings

| ID    | Finding                                                                                             | Change and evidence                                                                                                                                            | Human follow-up                                                                            |
| ----- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| M3-01 | Unit 3 accepted only “please” in “Yes, ___”, rejecting natural affirmative thanks                   | Accept please, thanks and thank you; clarify the explanation. Regression checks reject refusals and unrelated words                                            | Check naturalness and task clarity in both varieties                                       |
| M3-02 | The repetition cloze did not state its function explicitly                                          | Ask for repetition explicitly; accept again, once more and one more time. Reject unrelated instructions                                                        | Check the prompt is understandable for beginners                                           |
| M3-03 | The city-preposition cloze could look like an unrestricted sentence-completion task                 | State that it practises the taught I live in + city pattern                                                                                                    | Observe whether the supplied pattern helps without unnecessary explanation                 |
| M3-04 | A response-level greeting replaced session instructions without carrying the chosen English model   | Carry American/British selection into the pilot opening itself; preserve the existing non-English opening behaviour. Regression covers both models and Spanish | Listen to the opening and subsequent turns in the actual app                               |
| M3-05 | A live Unit 2 call introduced a preferences question after the required exchange                    | Keep the call within taught name/origin/home language; close after the task instead of filling three minutes                                                   | Repeat with unfamiliar replies and requests for help                                       |
| M3-06 | A subsequent live call gave away a correction before the learner attempted it and stacked questions | Add explicit final turn rules: one question, wait, no answer before an attempt, a separate correction turn, and a bounded Unit 2 sequence                      | Check variability across real calls; prompt instructions are not a deterministic guarantee |

All lesson steps were read against their stated task, supplied facts, answer and preceding teaching. The author review cannot establish how an actual novice interprets the instructions or how natural every recording sounds. Existing limitations, including English-only instructions and unscored speaking completion, remain visible in the main review packet.

## Technical evidence

- [Audio audit](english-m3-audio-audit.json): all 123 public recordings downloaded and decoded; 63 British-model and 60 American-model clips. The check measures signal, possible clipping and whether the app's playback cutoff precedes audible content. It does not transcribe, judge accent or certify naturalness.
- Review-page browser checks cover reviewer separation, saved drafts, export validation and retention of obsolete-version findings without counting them as current approval.
- The full twelve-session app journey and the existing microphone lifecycle checks run at two Android browser sizes. Mocked microphone tests are not physical-device observations.
- Live scripts use the real deployed backend, disposable synthetic guests and scripted text turns. They inspect effective session instructions, remote audio transport, after-call correction output, server hangup and guest deletion. They do not test a learner's microphone, automatic speech recognition accuracy or learning.
- The initial live harness received audio packets but saved empty files. Those files are unusable and must not be treated as reviewed recordings. The capture path was revised to decode and measure recorded output before accepting a saved recording. Initial runs remain diagnostic evidence only.

Final automated checks: all 526 tests in 61 suites passed; TypeScript, ESLint and the realtime function's Deno check passed. The two review-page scenarios passed at both phone sizes (four checks). The twelve-session pilot journey and two microphone lifecycle scenarios also passed at both sizes (six checks). The microphone checks use test doubles; the live samples below use the real backend.

The existing live smoke test also passed after deployment: legacy English WebRTC connection, concurrent-session guard, server hangup, xAI assessment and deletion of the synthetic guest. This checks backward compatibility without changing subscription or auth settings.

### Final synthetic live matrix

All six cases used the current deployed call instructions. Each returned the selected model and unit scope, decodable recorded output with a non-silent signal, zero corrections to the valid synthetic replies, successful server hangup and confirmed deletion of its synthetic guest. See the [raw results](english-m3-live-results.json). The review page includes the captured coach output when opened from the complete review bundle.

| Unit                       | British model                                | American model                               |
| -------------------------- | -------------------------------------------- | -------------------------------------------- |
| 1: Meet a classmate        | Integration passed; listening review pending | Integration passed; listening review pending |
| 2: A little about you      | Integration passed; listening review pending | Integration passed; listening review pending |
| 3: Order and check a drink | Integration passed; listening review pending | Integration passed; listening review pending |

These are six sampled calls, not a measured false-correction rate or proof of reliable teaching across all inputs. In the final Unit 2 samples, the coach waited for the city correction without giving the answer or stacking another question. The service calls accepted the other variety's takeaway reply. Some closings still add formulae such as “Nice talking with you” and can be longer than the preferred short turn. Native/teacher review should consider their suitability; the prompt's word-length guidance is not a hard limit. Generated language must still be heard and reviewed by people, including calls with actual speech recognition and unfamiliar replies.

## Deployment and reproduction

The `realtime-session` function is active at version 32 with English unit calls, reference/goal validation and the revised beginner instructions. JWT verification remains enabled. No database migration, auth configuration change or app release was needed. The previous deployed source was saved to `/tmp/voka-m3-realtime-backup` before deployment; this is a temporary local rollback copy, not a durable release archive.

Commands from the project root:

```sh
npm run review:english
npm run review:english:audio
npm run review:english:live
cp artifacts/english-m3-live/results.json docs/english-m3-live-results.json
npm run review:english
npx --no-install prettier --write docs/english-m3-live-results.json
python3 scripts/package-english-review.py
```

The audio command reads public files and writes a technical report. The live command uses the project's public Supabase configuration and its existing deployed provider credentials. It creates only test guests, uses paid live service within the configured budgets, saves diagnostic output under ignored `artifacts/english-m3-live`, and deletes its guests. It stops on a failed case; it does not disable quotas or alter real users. For a focused rerun, append `-- --case=en-a1-u2,en-US` to the live npm command.

The live harness follows the [official OpenAI Realtime conversation events](https://developers.openai.com/api/docs/guides/realtime-conversations). Response-specific instructions can change the opening independently of subsequent session instructions, so both are checked. A transcript and received audio packets alone do not establish perceptual quality.

## Remaining M3 evidence

| Gate                                          | Current state | Evidence required                                                                                         |
| --------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| American script and listening review          | Pending       | Current-version step decisions, actual listening findings and affected-item re-review                     |
| British script and listening review           | Pending       | Current-version step decisions, actual listening findings and affected-item re-review                     |
| Teacher review                                | Pending       | Prerequisites, four-skill balance, valid alternatives, prompt clarity and assessment limits               |
| Beginner navigation and initial changed tasks | Pending       | Observed attempts, first language, device, help used and actual responses                                 |
| Later changed tasks                           | Pending       | A later visit with actual interval, intervening practice and independent/supported attempts distinguished |
| Actual microphone and device behaviour        | Pending       | Android/iPhone playback, network loss, backgrounding, fallback, accessibility and human live calls        |
| Resolution and release decision               | Pending       | No unresolved blocking meaning, marking, audio or navigation findings; re-review of changed versions      |

Keep M3 open until this evidence exists. Unit 4 and the rest of M4 should follow the three-unit review boundary. Passing software checks cannot fill any of the human rows above.
