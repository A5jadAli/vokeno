# Three-language learning path (October 2026)

## Product decision

Spanish is the third track. It is widely useful, has a regular spelling system that suits English-supported beginners, and the speaking reference is Mexican Spanish (`es-MX`). Lessons name common Spain and wider Latin American alternatives where they matter (ducha/regadera, billete/boleto, vale/va), without claiming one accent represents every country. The course is practice towards CEFR A1 and A2 tasks, not a certification or a promised level.

**Colour.** Spanish uses violet `#5B3DF5` with white text (6.1:1 contrast), a pale violet tint for backgrounds and a lighter violet on dark surfaces. Violet was chosen over the first-draft teal because teal sat 35° from the app's "correct answer" green, so a Spanish button read as a success state. Red was ruled out because it reads as "wrong". English keeps orange and German yellow. Each language's colours live in one place, `trackColors` in `src/features/language/config.ts`.

## What is implemented

**Spanish content**

- 29 guided lessons: 15 at A1 (first exchange to texting a friend, including a lesson on the sounds that change meaning) and 14 at A2 (past tenses, appointments, renting, the pharmacy, eating out, comparisons, porque/que/si, feelings, Mexican expressions, fast speech, travel problems, used-to versus events). Each lesson has phrases with usage notes, a reading task, three checks including a listening check, a writing task with accent-aware marking, and a speaking rehearsal.
- 10 listening dialogues (A1–A2), 6 live-coach situations (A1–A2), a 15-question placement check (A1, A2 and B1 stages) and two writing tasks (an informal message and a formal email) with AI feedback.
- Automated guards: every Spanish question and exclamation has its opening ¿ or ¡; app and server lists of coach units and writing tasks must match.

**Marking**

- Missing Spanish accents are accepted but shown ("Watch the accents: ¿Dónde está la estación?"), because accents change meaning (está/esta, sí/si). Ñ is never optional. German umlauts stay strict.

**Habits, for all three languages**

| Stage    | When                                         | Today's plan | About  |
| -------- | -------------------------------------------- | ------------ | ------ |
| Warm-up  | First 3 practice days, or after 4+ days away | 1 step       | 5 min  |
| Building | Practice days 4–13                           | 2 steps      | 10 min |
| Momentum | Practice day 14 onwards                      | 3 steps      | 15 min |

- Steps mix a lesson, a capped review (8 phrases; the rest wait), and listening or speaking, which alternate by day and match the learner's level. An unfinished lesson is always offered first. When the plan is done, one optional extra is offered (the next lesson first).
- **Honest streak**: counts days actually practised. One missed day can be bridged as a rest day, at most once in seven days; two missed days end a run. Rest days are shown, never counted as practice. A broken run is a fresh start, with no shaming.
- **Milestones**: finishing a level shows what the learner can now do, taken from that level's lessons.
- **Reminders** (opt-in): asked once, right after the first completed plan ("When will you practise tomorrow?"), and adjustable in Settings. One reminder a day, skipped once the learner has practised; after a week without a visit, a final message says reminders are pausing. Local notifications only; no exact-alarm permission.

At about one lesson a day, Spanish A1 takes roughly three weeks and A2 another three, with review and practice in between. The pace is a guide, not a lock.

**Why these choices**: small first steps and visible progress support continued use; interleaving activity types reduces monotony; habit formation tolerates the odd missed day ([Lally et al., 2010](https://doi.org/10.1002/ejsp.674)); choosing when to act improves follow-through ([Gollwitzer and Sheeran, 2006](<https://doi.org/10.1016/S0065-2601(06)38002-1>)); spaced retrieval improves retention ([Cepeda et al., 2006](https://doi.org/10.1037/0033-2909.132.3.354)). These motivate the design; they do not prove its effect in Vokeno, which should be measured.

## Voice model decision

Keep the integrated [OpenAI `gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) live session (the full model, not mini) with the `marin` voice and Spanish-pinned transcription. Gemini Live and xAI's Grok Voice are credible alternatives, but they use a different streaming protocol, so switching means rebuilding the live audio pipeline, and there is no evidence they teach Spanish better. Compare real Spanish sessions with educators before switching: intelligibility, tú/usted, latency, interruptions, transcript accuracy, correction quality and learner talk time.

## Before wider release

1. Have a Mexican Spanish speaker and a Spanish teacher review every sentence, answer, audio cue and politeness note, and listen to the installed Android Spanish voice.
2. Test with absolute beginners and with learners who know some Spanish, including the placement check, guest mode, sync and returning after a week.
3. Deploy the updated `realtime-session` and `writing-feedback` Edge Functions and the database migrations before publishing the app update.
4. Consider Spanish B1 only after A1–A2 is validated.
5. Measure first-week completion, voluntary returns after breaks, reminder opt-in and opt-out, and improvement on unseen tasks.
