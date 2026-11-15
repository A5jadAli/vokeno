# The Take: you are in the scene

15 November 2026. A proposal for Vokeno's main selling point. Not built. It needs the owner's yes, then the development session.

## The idea in one line

Every unit ends with a short film of its own scene in which **your recorded voice plays your part**, checked by what a listener actually understood. Your first take is kept, so months later you can hear day one next to today.

## Why this, and not another feature

- **It is the design made real.** Film already says "a film you speak in" and "no scene ends without your line". Today that line is a button marked "I said it aloud": nothing is recorded and nothing is checked. The Take closes the gap between the promise and the product without adding a new idea.
- **It fixes the weakest part of the course.** All 80 German speaking steps are on the honour system. Real speaking happens only in live calls, which cost money per minute and are rationed.
- **It is proof no points system can give.** A streak says you opened the app. Your own voice, then and now, says you can speak.
- **It makes the call the next step.** First the scene with the script, then the same character on a call without it.
- **It is cheap and private.** Recordings stay on the phone. The check is one short transcription per line. `expo-audio`, already installed, records and plays.
- **It stays honest.** It reports what was understood, never a pronunciation score, as `docs/product-research.md` requires.

## Keep it, and lead with what only a course can do (owner's question, 15 November)

The mechanism is not new: dubbing-practice apps such as 2DUB and SceneLine let learners voice film and TV scenes, and shadowing apps record a line and compare it with the model (web search, 15 November 2026; app listings only, not tried). That is no reason to drop it. Without a recorded, checked line, "a film you speak in" is a slogan, and those apps solve a different problem: performing someone else's film. They have no course, no cast that returns, and no record of the learner over time.

So keep the mechanism and put the three things they cannot copy at the front, in this order:

1. **Day one beside today.** The first take of every scene is kept. Hearing your own first attempt next to your latest is proof of progress that no streak, score or level label gives, and it needs nothing but local storage. This is the headline, and it ships in part 1, not later.
2. **The same character calls you without the script.** A dubbing app ends when the scene ends. Here the scene is the rehearsal and the call is the performance.
3. **An honest listener.** "Ana heard …", never a pronunciation score.

Try 2DUB and SceneLine before writing any marketing line that says "only".

## What the learner does

1. **Watch the scene.** As today.
2. **Learn the lines.** As today.
3. **Say your line** (the speak step, Film S17). Tap the record light and say it. The page marks the words that were understood. If some were missed: "Ana heard: …", the model line, one more try. It never blocks: after two tries, Continue.
4. **Play your take** (new, at the end of a unit's last session). The scene runs again. The characters' lines are their recorded clips; your lines are your own recordings, with subtitles.
5. **Credits.** "and you", as designed, plus one row: "Your take · 0:24".
6. **The call.** The invite says what changes: "Now without the script."
7. **Then and now.** Whenever a scene is said again (a retake, a review, a checkpoint, the end of a level): the same line as you said it the first time, then as you say it now.

## How it is built

**Part 1: record and play (app only, no server).**

- The speak step records each line with `expo-audio` and plays it back beside the model.
- Clips are files in the app's own storage: the first and the latest take of each line, nothing else. A three-second line is tens of kilobytes; a whole A1 course stays in the low tens of megabytes. Settings gets "Delete my recordings".
- Nothing is uploaded or synced. Finishing the step with a recording counts as spoken; "Skip speaking for now" stays.
- The take is a playlist: scene clips and the learner's clips in script order through the existing player. No audio mixing and no new native module.
- Then and now is the same playlist with two clips of the learner's line, first take then latest. It belongs to part 1 because it is the part no other app has and it costs nothing more to build.

**Part 2: the check (needs a function deploy).**

- A `speech-check` action on the existing function takes one clip of ten seconds or less and the language, and returns a transcript. The clip is not stored.
- The transcriber is **not** told the expected line. Told what to expect, it tends to hear it, and a check that always passes is worthless.
- In the app, a pure function compares the line with what was heard, word by word, ignoring case, punctuation and accents (the transcriber's accents are not the learner's), with digits read as number words and each line's authored variants accepted.
- Verdicts: every word heard is "Understood"; most is "Almost", with the missed words marked; fewer shows what was heard and the model. The cut-off for "most" starts at 60% and is tuned with the first five learners.
- The words stay honest: "Ana heard …", never "wrong" and never a score. A recogniser fails on some accents, cheap microphones and noisy rooms, so a miss must never block progress or lower a mark.
- The clip leaves the phone for the check only, with the same consent wording as calls. Without consent or a connection, part 1 still works.

**Part 3: the level's film.** At the end of a level, every scene's take in story order, opening with day one. Sharing it as a video needs encoding on the phone, so it waits for a store build.

## What content must provide

Each unit's main scene has a stand-in for the learner (Alex in German) with at least three lines, and the unit's speak steps use those lines. The content pipeline's coverage sheet already asks for this.

## How to judge it

- Share of speak steps finished with a recording (today: unknown, because the button proves nothing).
- Share of unit ends where the take is played; share that go on to the call.
- Words understood on the first try and on the retry.
- Day-7 retention against the weeks before (`voka_usage_days`).

If few people record, or the check annoys more than it helps, keep part 1 and drop part 2.

## Risks

- **An unfair check.** Mitigated by wording, no blocking and the learner test. This is the risk to watch.
- **Embarrassment.** Takes are private; nothing is shared unless the learner exports it.
- **Cost.** One short transcription per spoken line. Price it from the provider's current rate before promising it free without limit.
- **Storage.** First and latest only, with a delete control.

## Where it sits in the redesign

Film S17 already draws the record light and "hear yours and the model", and plans "the words understood are marked" for phase 3. This proposal moves that check into phase 2, so the five learners test the real thing, and adds one screen (the take) and one row on the credits. The change request for the design session lists the exact edits.
