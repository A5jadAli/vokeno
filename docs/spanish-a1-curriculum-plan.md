# Spanish A1: curriculum and learning journey

Research and repository review: 18 October 2026. Status: **curriculum specification; Units 1–6 and checkpoint 1 are now implemented locally, with native review pending**. The remaining units, checkpoints and exam system are planned. See the [implementation milestones](spanish-a1-milestones.md) for delivered work and open gates; this document is not a certification claim.

The user selected **standard DELE A1** and delegated the choice of Spanish variety. The primary audience remains beginners learning for everyday life. This plan preserves the app's current design and adds a rigorous route towards exam preparation.

## Recommendation

Build **25 units, four sessions per unit**, with six cumulative checkpoints, deliberate spaced retrieval, linked listening and productive practice, and three original full exam forms. Keep Mexican Spanish as the main production model; introduce carefully scaffolded Spanish-from-Spain comprehension throughout the course. Use the existing Today → Course → Practice → Progress journey.

Twenty-five is an instructional design decision, not a CEFR requirement. It gives pronunciation, personal information, time, forms, messages and unscripted interaction more space than a literal translation of the German syllabus. The plan originally had 24 units; the 18 October review split the overloaded numbers-and-spelling unit into Unit 3 (numbers) and Unit 4 (spelling and forms), so later units moved up by one. Unit 5 completes the first phase. Pilot the first five units and checkpoint 1 before committing to the final session lengths. Split an overloaded session rather than compressing essential practice to meet a unit count.

The intended outcome is **reliable, natural A1 communication, with evidence of readiness for DELE A1 tasks**. A1 still allows hesitation, limited language and help from a cooperative interlocutor. Accent elimination, unrestricted native-speed comprehension and native-level fluency are not appropriate completion criteria. The CEFR prioritises intelligibility and successful communication; its A1 interaction and fluency descriptors explicitly allow repetition and pauses. [CEFR Companion Volume, sections 3.3 and 5.2–5.3](https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4).

“Beyond the exam” should mean better retention, flexible reuse and confidence in familiar situations, with a few clearly marked extension expressions. It should not mean quietly moving A2 grammar into mandatory A1 tests.

### The planning package

- [Unit specifications](spanish-a1-units-plan.md): all 100 session briefs, progression, pronunciation, real-world missions and checkpoint routing.
- [Coverage register](spanish-a1-coverage.md): planned teaching, recycling and evidence for language and exam requirements; source-audit rules.
- [Assessment and native-review specification](spanish-a1-assessment-review.md): exam blueprint, review gates, authoring example and implementation backlog.

These documents specify the whole course. Units 1–6 are now authored in the local catalogue; the remaining specification is still planned. No native-speaker approval is claimed. “Mapped” means assigned in a plan; “covered” will require approved content and evidence.

### Relationship to existing project decisions

This develops the Spanish work anticipated in the [curriculum standards audit](curriculum-standards-audit.md) and [language expansion plan](language-expansion-plan.md). Keep their requirements for inventory coverage, authentic speech, all-skill practice, native/teacher review and learner validation. The earlier audit's vocabulary percentages and course counts are historical measurements; this review did not recompute its lemmatisation analysis. Its hour ranges and combined A1–A2 unit estimate are planning estimates, not official DELE requirements or constraints on this new A1 sequence. The specific Spanish exam grouping and source-checked level boundaries in this plan govern Spanish implementation.

Every relevant item in the audited A1 linguistic inventories must receive a productive or receptive teaching/practice assignment. A few example words under a broad topic do not close that obligation. Corpus frequency can help choose teaching order and natural examples, but cannot replace the inventory audit or justify omitting an exam-relevant item. Keep the existing Spanish violet palette and shared language components.

## What the current project actually supports

This review inspected the active catalogue, German unit data and tests, Spanish A1/A2 content, the lesson schema and player, journey selection, review-state migration, listening, writing, voice casting and exam routes. Counts below are the **pre-implementation baseline** from 18 October, not from the older UX review. The current implementation adds twelve Spanish sessions and retires three classic lessons from the default path; see the [implementation ledger](spanish-a1-milestones.md) for current counts and shared player improvements.

| Current evidence                                                                                                                                    | Consequence for Spanish A1                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| German has 20 units / 80 step sessions, totalling 515 advertised minutes. Two active classic A1 lessons also remain: `de-sounds` and `modal-verbs`. | Reuse the four-session unit presentation and scene-based teaching. Do not equate the number of units or advertised minutes with proficiency.                   |
| Spanish has 15 classic A1 lessons and 14 A2 lessons.                                                                                                | Useful material exists, but it is a starter path, not a complete unit curriculum.                                                                              |
| Spanish has six A1 and four A2 standalone listening scenarios; three A1 and three A2 live-coach scenarios.                                          | Expand and link these to prerequisites and unit outcomes. Six A1 dialogues cannot be the entire listening diet.                                                |
| Both standalone Spanish writing tasks, `es-message` and `es-email`, explicitly target A2.                                                           | Add A1 forms and short-message tasks. The generic Spanish Writing entry currently offers tasks beyond the beginner path.                                       |
| `defineUnit` creates review phrases from `teach` steps.                                                                                             | A useful expression appearing only in a scene, rule or speaking model is not automatically a review target. Authors need an explicit retrieval map.            |
| The step player supports scenes, teaching, rules, choices, token building, short typing, matching and modelled speaking.                            | Good teaching tools; they do not yet provide full DELE task administration or assessed spontaneous production.                                                 |
| Speaking completion can be self-reported or skipped; course completion follows saved attempts.                                                      | Completion is participation evidence. Do not display it as demonstrated oral competence or exam readiness.                                                     |
| Foundation drafts are capped at 160 characters; answer grading compares accepted phrases and gives separate accent feedback.                        | Use the standalone writing infrastructure, extended for A1, for complete messages and forms. Do not stretch a phrase-answer field into an exam-writing engine. |
| Practice suggestions are filtered by CEFR level, not unit prerequisites.                                                                            | A learner in Unit 1 can receive practice whose grammar and vocabulary belong much later in A1. Add outcome/prerequisite links.                                 |
| Phrase fingerprints, `cardKeys`, content versions and published-ID tests already exist.                                                             | Preserve these protections. Cross-lesson canonical concepts and editorial identity across wording corrections remain a separate improvement.                   |
| `/exam-practice` currently provides an IELTS guide.                                                                                                 | There is no equivalent complete DELE A1 route to relabel. Make exam support track-aware when implementing it.                                                  |

Code evidence: [catalogue](../src/features/foundations/catalog.ts), [German units](../src/features/foundations/german-a1-units.ts), [schema](../src/features/foundations/types.ts), [progress migration](../src/features/foundations/progress.ts), [course position](../src/features/journey/course.ts), [practice selection](../src/features/journey/practice.ts), [writing tasks](../src/features/writing/progress.ts), [Spanish tests](../tests/spanish-course.test.ts), [change safety](../tests/change-safety.test.ts).

### Keep from German; improve for Spanish

Keep recurring characters, concrete can-do outcomes, varied short steps, careful/everyday scene variants, pronunciation in context, article-aware vocabulary and a familiar four-session rhythm: **Words → Grammar → Real talk → Exam task**. Every fourth session should have an everyday purpose in its title, such as “Register for a class”; the exam-format connection belongs in supporting text.

Improve the relationship between recognition and production. A learner who selects the right sentence needs a later opportunity to create a response without seeing it. Use real information gaps: the learner knows a preference, the other person knows a timetable, and both need to settle a plan. Introduce model-free evidence before the final units.

German's tests prevent accidental repeated teaching phrases and repeated sentences. That is a useful content-maintenance check, but Spanish must explicitly permit **intentional retrieval**. Teach a core expression once, reference its concept again, and reuse it in new contexts. Do not create duplicate review cards for each appearance. Repeated practice is not an authoring defect.

The German past-tense sequence and Goethe task formats should not dictate Spanish content. PCIC pages often place A1 and A2 in adjacent columns; copy neither the whole page nor the German grammar sequence into A1.

## Variety: Mexican production, planned Spain comprehension

Use broadly understood urban Mexican Spanish for the main characters and first production models. This continues the existing `es-MX` content and voice cast, avoids a disruptive reset and gives learners one stable starting model. It is a choice of reference, not a claim that Mexican Spanish is neutral or superior.

There is a specific exam reason to add Spain exposure: the indexed official general A1 guide describes peninsular varieties for input and accepts coherent established Hispanic norms in candidate output. Consequently, Mexican production alone is compatible with the intended exam, but exclusively Mexican listening would leave a preparation gap. [DELE A1 guide, “Norma lingüística,” p. 7](https://examenes.cervantes.es/sites/default/files/DELE_A1_v2020_Guia-de-examen.pdf). The RAE also recognises seseo as an accepted pronunciation. [RAE: seseo](https://www.rae.es/buen-uso-espa%C3%B1ol/el-seseo-y-el-ceceo).

Implement the choice as follows:

- Units 1–5: Mexican production, with one supported alternate voice and an explanation that varieties differ. No second conjugation chart to memorise on day one.
- Units 6–13: recognise common Spain alternatives in context: `zumo/jugo`, `camarero/mesero`, `móvil/celular`, `piso/departamento`, `ordenador/computadora`. Show one relevant alternative at a time, with a region label.
- Units 14–25: regular peninsular listening; recognise `vosotros`, its high-frequency forms and possessives; continue accepting consistent `ustedes` production. Teach the difference between `billete`, `boleto` and event `entrada` in their actual contexts.
- Before exam simulations: explicitly familiarise learners with the exam's input variety and instructions. Mock audio must follow the verified exam specification, independently of the everyday cast.
- Do not call regional forms errors, require a Castilian /θ/, treat all Spain accents as identical, or introduce unlabelled slang. `Vale` is useful recognition; `órale`, `mande` and similar expressions need context and are optional enrichment.
- Prefer standard written forms even when audio links or reduces sounds. Do not teach exaggerated phonetic spellings as the correct way to write Spanish.

The existing cast includes Ana, Omar, Lucía, Diego and service roles. Reuse it, and add reviewed Spain voices only where needed. A character with a learner accent can support the story; core pronunciation models should be separately verified. Audio generation instructions are not proof of a native accent.

## Learning design

Each unit has one practical destination and four short sessions. Every session should have one primary outcome, a small amount of new language and retrieval of something already learned. Target roughly 5–8 minutes, then verify with beginners. Use the existing 10–14 varied-step pattern as a starting budget, not as a reason to add filler.

Units 10 (time/dates) and 12 (present-person forms) are particular overload risks. Unit 3 had the same problem with numbers and spelling together; it was split into Units 3 and 4 after review. Their broad briefs require small practice sets distributed across linked activities and later retrieval. Do not interpret “numbers to 100” as a requirement to present 101 new cards in a session. If the pilot shows that a prerequisite cannot be taught comfortably within the four slots, expand the teaching sequence and revise the plan's counts.

| Session   | Learning sequence                                                                                                    | Evidence                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Words     | Understand a short situation; notice a small set of useful words/chunks; identify them in changed examples.          | Meaning and listening checks, followed by a short personal response.                                                         |
| Grammar   | Notice one useful contrast; read a brief explanation; practise it in meaningful choices and short production.        | At least one response requiring the learner to supply language, not only identify an answer.                                 |
| Real talk | Hear an exchange; understand the goal; notice one pronunciation/pragmatic feature; respond with changed information. | An information-gap exchange, recording or supported partner task. Reading a model aloud remains practice.                    |
| Exam task | Solve an everyday task using a progressively introduced DELE task family; fade help.                                 | An unseen mini-task with specific feedback and a next-practice recommendation. Full tasks remain longer separate activities. |

Do not put a new word list into every session to satisfy a minimum `teach` count. In later sessions, use a few needed expressions, or explicitly reference earlier review targets. Review cards should serve the learning outcome.

### Retrieval and durable learning

For each priority outcome, plan an introduction, another retrieval within the unit, reuse in at least two later contexts, and an unseen check. Early review should include meaning → Spanish as well as Spanish → meaning; add audio → meaning and spoken/written production. A phrase matching task cannot demonstrate all four.

Start with next-day review and later checks around a week and several weeks; use the existing scheduler where suitable and tune from learner evidence. These intervals are product hypotheses, not a universally optimal scientific schedule. An online vocabulary experiment found spaced practice superior to massed practice; a separate fluency study found benefits under both tested spacing schedules. Neither establishes that flashcards alone create conversational competence. [Rogers et al., distributed vocabulary practice](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/optimizing-distributed-practice-online/C833408A4C3BAD939CA39EA734423BB7), [Kakitani & Kormos, 2024](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/effects-of-distributed-practice-on-second-language-fluency-development/4F6787916C198376CAD222934D3B37E4).

Prioritise recoverable success: attempt → meaningful feedback → another attempt with changed details. Repeated failure should trigger a brief model or easier scaffold, not a pile of identical questions. Do not require perfect speed or a flawless trill to proceed.

### Fun with an educational purpose

Use a light recurring story: settling into a neighbourhood, meeting people, joining a class and arranging a shared outing. Give the learner choices that alter the language: drink, budget, time, destination, hobby. A coffee order succeeds when the correct drink arrives; an invitation succeeds when both people agree on a time.

Alternate story episodes with independent contexts so learners do not succeed only because they remember the plot. Allow fictional personal details. Include people with different ages, occupations and household arrangements without turning culture into stereotypes. Small humour and satisfying outcomes are welcome; timed pressure, public rankings and punitive streaks are unnecessary.

### Workload and completeness

One hundred sessions at 5–8 minutes represent only **8.3–13.3 hours of first-pass guided activity**. That arithmetic is not a proficiency estimate. Budget additional distributed listening, reading, retrieval, interaction, writing and remediation; the amount depends on the learner. Do not advertise an invented universal “hours to fluency” figure.

The authoring package also requires, beyond those sessions:

- At least one linked standalone listening task per unit, plus alternate unseen material for checkpoints; reuse an existing scenario only after a prerequisite and language audit.
- One productive mission per unit, with both spoken and written evidence accumulated within each four-unit phase. Provide non-live practice when the coach is unavailable.
- Six checkpoints, with independent variants for reattempts; diagnose skills separately.
- Three full original exam forms: one familiarisation form, then two unseen readiness forms on separate days. Official samples remain external familiarisation/benchmark resources, not repeated score-training material.
- A reviewable vocabulary/chunk inventory: lemma, article/plural where applicable, sense, register, region, first use, subsequent retrieval and accepted alternatives. Set quantities after auditing the actual inventory and pilot load. A vocabulary count alone does not establish A1.

## Keep the app comfortable as content grows

Preserve the [implemented journey decisions](ux-redesign-2026-10.md), language switcher, shared components, typography, colours and four tabs. The October UX review predates these changes; its old findings should not be presented as current defects without rechecking.

| Screen/state            | Planned behaviour                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First visit             | Continue the short language/ability setup. Start Unit 1 with a useful exchange. Everyday learning is the default; DELE is an optional goal in the existing plan.                       |
| Today                   | One primary Continue/Resume action with unit, outcome and duration. Add a small review action when due; do not show 96 lesson cards. Keep the daily session's identity stable.         |
| Course                  | Current unit expanded; later units summarised. Phase names may be small headings within the current list, not a new navigation level. Show “2 of 4 sessions” and the unit destination. |
| After a session         | Say what was practised, then name the next session. If today's plan is done, provide a clear stopping point and an optional next action.                                               |
| After a checkpoint      | Show one strength and one next priority. Offer targeted practice and allow continuation; do not trap learners in an all-or-nothing gate.                                               |
| Practice                | Recommend material tied to completed prerequisites and weak outcomes. Put the full library and exam preparation behind clear secondary actions.                                        |
| Progress                | Separate sessions completed, abilities demonstrated and exam evidence. An unassessed skill says “Not assessed yet.”                                                                    |
| Course completion       | Offer the next relevant step: strengthen a skill, take an unseen mock, or start available A2 material. Clearly label the current A2 offering as a starter path.                        |
| Returning after absence | Resume with a small recovery set and the saved next lesson. Do not require clearing an intimidating backlog before learning.                                                           |

Example post-session copy: “You practised ordering and checking the price. Next: ask for something without sugar · about 6 min.” Example checkpoint copy: “You understood opening times. Practise giving your email address.” These are concrete destinations, not vague percentages.

This applies progressive disclosure and contextual guidance. Navigation should be easy to recognise; learning tasks should still exercise recall when pedagogically appropriate. Those are different uses of memory. [Nielsen Norman Group: progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/).

Preserve accessibility: text scaling, labelled controls, visible focus, reduced motion and transcripts in learning mode. Offer an accessible alternative to timed/audio-only practice, but label it as an adapted session rather than directly comparable exam evidence. Speaking refusal, missing microphone access and offline use must have understandable next steps without falsely marking speaking assessed.

Keep the existing short placement check as a starting-point recommendation. Its five-item level stages do not assess all four skills and cannot establish A1 completion or exam readiness. Allow learners placed later to revisit prerequisites; use broader diagnostic evidence for a legacy-course bridge or exam recommendation.

## Delivery sequence

1. **Freeze the reference specification.** Resolve the source checks in the review document; have an ELE curriculum reviewer confirm A1/A2 boundaries and the current general DELE format. Assign each coverage requirement an owner.
2. **Build a five-unit pilot.** Author and review Units 1–5, their audio, linked practice and CP1. Implement only the missing features needed by that pilot. Test the experience with beginners and native reviewers before scaling.
3. **Build Units 6–13.** Add basic A1 writing, image/reading task support, unit-aware practice and delayed evidence. Review each four-unit batch before publication.
4. **Build Units 14–25.** Expand regional listening and productive tasks; check that late units retrieve earlier language rather than introducing a final rush of grammar.
5. **Validate assessment.** Complete the full-mock runner and original forms, obtain trained human ratings, calibrate recommendations and test unknown variants. Native fluency alone is not examiner training.
6. **Publish claims supported by evidence.** Keep a partial route labelled as such during rollout. “All units available,” “course reviewed” and “learner ready to attempt an exam” are separate states.

For the pilot, observe whether learners can identify their next action, understand their progress and complete a new real-world task after a delay. Track abandonment, time spent recovering from mistakes, dependence on hints, delayed retention and skill-specific improvement. Session length, return rate and streaks alone do not establish learning quality. Use a small formative usability round first, then a larger learning evaluation before making readiness claims.

## Research limitations and source policy

The Council of Europe document was directly retrieved. Several Cervantes/CVC pages and PDF links redirected to a maintenance page during this review; official search-indexed text supplied parts of the current 2020-format specification. Some regional Cervantes pages still show older task formats. This plan records that limitation rather than treating every official-domain page as current.

The companion review document lists the exact publication gates. In particular, final task instructions, response pools, timing/replay details, rating conversions and all PCIC A1 column assignments must be checked against the complete source documents before exam content is released. The plan is actionable now; exhaustive item-level source verification and native approval are not yet complete.
