# Curriculum standards audit (October 2026)

**Question:** if Vokeno labels lessons A1, A2 or B1, does finishing them actually bring a learner to that level, and could they pass the matching exam?

**Answer today: no, for any language.** The lessons teach useful situations at the right difficulty, but they cover only a small part of what each level requires. A learner who finished our German "A2" lessons and sat the Goethe-Zertifikat A2 would very likely fail. This document records the evidence and the plan to make every level label true and verifiable.

## 1. What each level requires

| Level                | Typical study time (cumulative from zero)                                                                                  | Vocabulary                                                                                                                                                                  | Official exam                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| German A1            | 80–150 h                                                                                                                   | ~650 words ([Goethe A1 list](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf))                                                                            | Goethe-Zertifikat A1: Start Deutsch 1 |
| German A2            | 150–300 h                                                                                                                  | ~1,300 words ([Goethe A2 list](https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_A2_Wortliste.pdf))                                                               | Goethe-Zertifikat A2                  |
| German B1            | 300–600 h                                                                                                                  | ~2,400 words ([Goethe B1 list](https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf))                                                               | Goethe-Zertifikat B1                  |
| Spanish A1           | 60–100 h                                                                                                                   | [Instituto Cervantes A1–A2 inventory](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm)               | DELE A1                               |
| Spanish A2           | 120–180 h                                                                                                                  | as above, plus A2                                                                                                                                                           | DELE A2                               |
| English A2 / B1 / B2 | ~200 / ~400 / ~600 h ([Cambridge](https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours)) | ~900 / ~1,700 / ~2,400 / ~3,000 by B2 ([Oxford 3000](https://www.oxfordlearnersdictionaries.com/external/pdf/wordlists/oxford-3000-5000/The_Oxford_3000_by_CEFR_level.pdf)) | Cambridge A2 Key to B2 First; IELTS   |

The Goethe-Zertifikat A2, for example, has four modules (reading and listening of about 30 minutes each, two short writing tasks, paired speaking) and needs 60 of 100 points.

## 2. Measured vocabulary coverage

Method: every target-language text in lessons, dialogues, coach units, placement items and writing examples was lemmatised with spaCy (so _getrunken_ counts as _trinken_) and compared with the official lists, cumulatively by level. This is generous: a word counts as covered if it appears once, anywhere.

| Track   | Level   | Official words covered                |
| ------- | ------- | ------------------------------------- |
| German  | A1      | 152 of 686 (22%)                      |
| German  | A2      | 297 of 1,366 (22%)                    |
| German  | B1      | 504 of 2,819 (18%)                    |
| Spanish | A1      | 43 of 473 inventory items (9%)        |
| Spanish | A2      | 121 of 1,004 (12%)                    |
| English | A1 → B2 | 17%, 16%, 18%, 18% of the Oxford 3000 |

Missing words include the most basic ones: German _alt, Arbeit, Arzt, Adresse, antworten, April_; Spanish _abuelo, aprender, alto, apellido, apartamento_.

## 3. Grammar, topics and skills

**German.** Each lesson teaches five phrases around one situation. Missing:

- **A1:** home and furniture, body and health, jobs, weather, clothes, dates and months, filling in forms; systematic present tense, accusative, separable verbs, imperative, prepositions of time.
- **A2:** systematic dative, reflexive verbs, adjective endings, superlatives, job applications, holidays and media.
- **B1:** passive, relative clauses, past perfect, narrative simple past, _zu_ + infinitive, _obwohl_/_trotzdem_, genitive.

**Spanish.** Taught as chunks (_me llamo_, _tengo_, _quiero_). Missing:

- **A1:** a present-tense system (regular verbs and key irregulars), _ser_/_estar_, agreement, _hay_, numbers to 100, days, months and dates, describing people, home, weather, clothes, _ir a_ + infinitive.
- **A2:** the present perfect (essential in Spain), object pronouns, imperatives, _por_/_para_, _estar_ + gerund.

**English.** The track is built as modern-communication and IELTS skills for learners who already have the basics. It does not teach A1–A2, yet some lessons are labelled A2.

**Exam formats.** The app has some exam-style practice:

- an IELTS guide, timed writing and a speaking mock
- a Goethe B1 speaking mock
- one German A2 and two B1 writing tasks

There are no full or sectional practice tests for Goethe A1, A2 or B1, DELE A1 or A2, or the IELTS listening and reading papers, and nothing measures readiness.

**Study volume.** All guided lessons together take about 4 hours per language. Levels need 60–600 hours. Most of that time must come from practice that recycles the syllabus: word-level review, recombination exercises, listening, and AI conversation and writing tied to each unit.

## 4. How people really speak

Learners report that certificate German or Spanish does not match the street. Some lessons already address this (German modal particles and fast speech; Mexican expressions such as _¿mande?_ and _ahorita_; British understatement), but only as isolated lessons. Each unit at each level needs a "how people really say it" strand:

- **Standard and spoken versions** side by side: _Ich habe keine Zeit_ → _Hab keine Zeit_; _¿Cómo estás?_ → _¿Qué onda?_
- **Natural-speed audio** with reductions.
- **Register labels** for informal, slang and regional forms.
- **Regional variants** where they matter: Austria and Switzerland, Spain versus Mexico, UK versus US.

## 5. Plan: make every level label true

**Decisions (7 October 2026):** German first (A1 → A2 → B1), then Spanish, then English. English becomes a B1–C1 fluency and IELTS track with no A1–A2 labels. Until a level passes the gates below, the app labels it a starter set.

**Rule:** a level is labelled complete only when it passes all of these gates, enforced by automated tests in CI where possible:

1. **Vocabulary, native-first:** the core is the most-used words and chunks in real spoken language (ranked from subtitle corpora), taught in natural sentences; frequent colloquial items are core too, with register labels. Official lists (Goethe, Instituto Cervantes, Oxford/English Vocabulary Profile) are a **benchmark**, not the syllabus: every official word for the level is either taught in the core or, if it is rare in speech (for example _Absender_, _ankreuzen_), taught for recognition in exam-skills practice. No official word is left untaught, and none is dumped into lessons.
2. **Grammar and functions:** every item in the official inventory for the level is taught and practised (checklist maintained per level).
3. **Skills and exam formats:** practice in every exam module and task type, plus at least two full mock exams per level, timed and scored against the official pass mark.
4. **Study volume:** enough practice for the level's hours: unit review, recombination exercises, listening, and AI conversation and writing per unit.
5. **Real speech:** a spoken-language strand in every unit.
6. **Validation:** native-speaker and teacher review of all content; pilot learners take official sample papers ([Goethe practice sets](https://www.goethe.de/en/spr/prf/ueb.html), DELE models) and results are compared with our mock scores.

**Readiness, not hope.** The app says "likely ready for Goethe A2" only when the learner's mock-exam scores clear the official pass marks with a margin in every module. Until then it shows which modules need work.

**Until a level passes its gates,** it is presented honestly as a starter set ("A1 situations: a first step towards A1"), not as the level.

**Structure per unit:**

- a can-do goal (CEFR descriptor)
- 25–40 official words in context
- one grammar point
- a standard dialogue and a real-speech version
- graded exercises from recognition to free production
- listening and reading
- AI-marked writing and speaking tasks in exam formats
- spaced review of every word

**Scale:**

- **German A1–B1:** about 80 units (~2,400 words).
- **Spanish A1–A2:** about 35–40 units.
- **English:** depends on positioning; covering A1–B2 is about 90 units, or about 35 units for B1–C1 fluency plus IELTS.

Content is authored against the official inventories, checked automatically for coverage and orthography, and reviewed by native teachers before release.
