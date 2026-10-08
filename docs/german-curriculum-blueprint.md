# German curriculum blueprint: A1 → B1 (October 2026)

Goal: a learner who finishes a Vokeno German level can handle that level's real conversations with people in Germany **and** passes the matching Goethe-Zertifikat. This replaces the current starter sets (14 + 14 + 16 short lessons, about 18–22% of each level's vocabulary; see `curriculum-standards-audit.md`).

## Principles

1. **Native-first vocabulary.** The core is ranked by frequency in real spoken German (OpenSubtitles corpus, curated: film-dubbing artefacts like _Sir_ or _töten_ are excluded). Goethe-list words that are frequent in speech are taught for active use (A1: ~520, A2: ~410, B1: ~680). Goethe words that are rare in speech (A1: ~170, A2: ~270, B1: ~780, e.g. _Absender_, _ankreuzen_, _Abbildung_) are taught for recognition in exam-skills practice. Nothing is dumped into lessons; nothing on the exam is left untaught.
2. **Two registers, always.** Every dialogue exists in a careful version and a "how people really say it" version: _Ich habe keine Zeit_ → _Hab keine Zeit_; _Wie geht es dir?_ → _Na, wie geht's?_; _nicht wahr?_ → _ne?_; particles (_mal, doch, halt, eben_), fillers (_also, na ja, ach so_), common reductions, and regional notes (Austria, Switzerland, north and south).
3. **Grammar as a system.** Each unit has one grammar point taught explicitly with a short rule, examples from the unit, and graded practice (recognise → complete → transform → produce), recycled in later units.
4. **Exam formats from the first unit.** Each unit includes one task in a Goethe format at its level. Every level ends with two full mock exams scored against the official pass mark.
5. **Volume through recombination.** Units feed a word-level review queue and generated recombination exercises, plus AI conversation and writing tied to the unit's words and grammar, so learners can reach the 80–150 h (A1), 150–300 h (A2) and 300–600 h (B1) these levels require.

## Unit structure (every level)

| Part            | Content                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------- |
| Can-do          | 1–2 CEFR/Goethe descriptors the unit delivers                                                       |
| Words           | 25–35 core lemmas with article/plural or principal parts, each in a natural sentence and with audio |
| Chunks          | 6–8 ready-made phrases for speaking                                                                 |
| Grammar         | One point, rule plus 8–12 graded items                                                              |
| Dialogue        | Careful and real-speech versions, natural-speed audio, captions                                     |
| Exam task       | One Goethe-format listening, reading, writing or speaking task                                      |
| Recognition     | 5–10 exam words that are rare in speech, met in the exam task                                       |
| Speak and write | AI coach scene and a short writing task using the unit                                              |

## A1 (20 units, then two Goethe A1 mocks)

| #   | Unit                          | Grammar                                   | Goethe themes    |
| --- | ----------------------------- | ----------------------------------------- | ---------------- |
| 1   | Hallo! Introduce yourself     | _sein_, _heißen_, W-questions, _du_/_Sie_ | Person           |
| 2   | Where are you from?           | Present tense, regular verbs              | Person, language |
| 3   | Numbers, age, phone, spelling | Numbers 0–1,000, the alphabet             | Person           |
| 4   | Family and friends            | _haben_, possessives _mein_/_dein_        | Family           |
| 5   | At the café                   | _möchten_, accusative _einen_/_eine_      | Food and drink   |
| 6   | Shopping for food             | Plurals, _kein_ versus _nicht_            | Shopping         |
| 7   | Home: flat and furniture      | Articles, predicative adjectives          | Living           |
| 8   | My day                        | Separable verbs, _am_/_um_                | Daily routine    |
| 9   | Free time and hobbies         | Stem-changing verbs, _gern_/_lieber_      | Free time        |
| 10  | Dates and appointments        | Days, months, ordinal dates               | Appointments     |
| 11  | In town                       | Imperative, _zu_/_in_ + place             | Town             |
| 12  | Trains and tickets            | _können_, questions                       | Travel           |
| 13  | Clothes and colours           | Accusative with adjectives (chunks)       | Shopping         |
| 14  | At the doctor's               | _müssen_, body, _wehtun_                  | Health           |
| 15  | Work and jobs                 | _war_/_hatte_                             | Work             |
| 16  | Weather and seasons           | _es_ + verb, months                       | Environment      |
| 17  | Forms and offices             | Personal data, formal register            | Services         |
| 18  | Messages and emails           | Informal versus formal writing            | Writing task     |
| 19  | What did you do?              | Perfect tense with _haben_, common verbs  | Narrating        |
| 20  | Real-life review              | Mixed practice at natural speed           | All              |

A2 (about 25 units: dative, reflexive verbs, adjective endings, perfect tense with _sein_, past of modals, _weil_/_dass_/_wenn_, comparatives and superlatives, travel, work, health, media, housing problems, official appointments) and B1 (about 30 units: passive, relative clauses, past perfect, simple past for narration, _zu_ + infinitive, _obwohl_/_trotzdem_, genitive, the subjunctive for politeness and wishes, discussions, complaints, job interviews, official letters) follow the same structure. Unit lists are drafted from the Goethe A2/B1 inventories once A1 is validated.

## Readiness

Each level ends with two full Goethe-format mock exams (Hören, Lesen, Schreiben, Sprechen), timed and scored. The app says "likely ready" only when both mocks reach at least 70% overall and 60% in every module (the official pass is 60%); otherwise it shows the modules to practise. Speaking and writing are scored by the AI against the Goethe criteria, and the score is described as an estimate.

## Delivery

1. Build the content model (units, word review, grammar exercises, dialogue pairs, exam tasks, mock exams), with automated checks for coverage against the spoken core and the Goethe list, orthography, and audio text.
2. Write A1 units 1–3 as a pilot and have a native German teacher review them. Adjust the template.
3. Write the remaining A1 units in batches with review, then the two A1 mocks. Mark A1 complete only when every gate passes.
4. Repeat for A2 and B1, then Spanish, then English (B1–C1 and IELTS).

## Status (8 October 2026)

**Built:** the unit format (`StepLesson` in `src/features/foundations/types.ts`, player in `src/components/step-lesson.tsx`) and A1 Units 1–6 (`german-a1-units.ts`): 24 sessions of 5–7 minutes, each with 10–14 varied steps (scene, words, rule, choose, listen, word-order tiles, typing, matching, speaking).

| Unit                   | Sessions                             | Grammar                                                         | Goethe A1 tasks                                                                                              |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1 Hallo!               | Words, Grammar, Real talk, Exam task | _sein_, _heißen_, W- and yes/no questions, _du_/_Sie_           | Hören Teil 1 (names), form words, Sprechen Teil 1 (name)                                                     |
| 2 Woher kommst du?     | Words, Grammar, Real talk, Exam task | Present tense of regular verbs, _-est/-et_, _heißt_, _sprechen_ | Lesen Teil 1 (richtig/falsch), Sprechen Teil 1 (Land, Wohnort, Sprachen)                                     |
| 3 Zahlen, Alter, Namen | Words, Grammar, Real talk, Exam task | Numbers 0–100 (units first), age with _sein_, prices            | Hören Teil 1 and 3 (corrected numbers), Schreiben Teil 1 (form), full Sprechen Teil 1 except Beruf and Hobby |
| 4 Meine Familie        | Words, Grammar, Real talk, Exam task | _haben_, _mein/dein/sein/ihr/Ihr_; spoken _der/die_ for he/they | Sprechen Teil 2 (word cards), Lesen richtig/falsch                                                           |
| 5 Im Café              | Words, Grammar, Real talk, Exam task | _möchten_, accusative _einen/eine/ein_, _den_                   | Sprechen Teil 3 (picture cards), Hören (changed orders and prices)                                           |
| 6 Einkaufen            | Words, Grammar, Real talk, Exam task | Plural patterns, _kein_ versus _nicht_, amounts without "of"    | Lesen Teil 2 and Teil 3 (adverts, signs), Hören Teil 2 (announcement)                                        |

Native-first content in Units 1–3, beyond the Goethe list, includes high-frequency spoken words that are not on it (OpenSubtitles rank in brackets): _genau_ (171), _echt_ (362), _sorry_ (1,521), _nee_ (1,725). It also covers _Moin_/_Servus_/_Grüß Gott_, _Wo kommst du her?_, merged forms (_willste_, _kommste_), _zwo_, numbers as feminine nouns (_die Zwölf_), phone numbers in pairs, spelling with words, _alles klein_ in email addresses, Saxon dialect in Leipzig, and when not to ask "where are you really from?".

The starter lessons these units replace (`greetings`, `introductions`, `origin`, `numbers`, `family`, `cafe`, `supermarket`) are retired: off the path, with history and review cards kept.

Units 4–6 add Mama/Papa used by adults, _Kumpel_, _WG_, _Einzelkind_, the _meine Freundin_ ambiguity, _Apfelschorle_ and _Hafermilch_, _Zusammen oder getrennt?_, tipping by naming the total or _Stimmt so_, cash-only places, the bill only on request, Pfand, one-word checkout questions (_Tüte? Bon?_), _Darf's ein bisschen mehr sein?_ and _günstig_ versus _billig_.

**Quality gates in place:** `tests/units.test.ts` (structure, variety, every exercise solvable, unique review cards, no digits or keyboard spellings in German audio and model lines) and the e2e walkthrough that finishes every session through the UI.

**Not yet done:** native-teacher review of Units 1–6; Units 7–20; the two A1 mock exams; human-recorded audio (scenes currently use the device voice, one voice for all speakers). German A1 stays labelled a starter set until all of these pass.
