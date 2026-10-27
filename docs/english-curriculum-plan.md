# English for everyday life and confident professional communication

Version 1, 27 October 2026. Planning baseline: `84ff698`.

**Status: M0 to M2 are implemented; M3 technical checks and reviewer preparation are under way.** This is the implementation specification for an American and British English course. It supersedes the British-only reference recommendation and provisional pilot order in the [independent review](english-curriculum-review-2026-10.md). The review's existing-content findings remain valid. The status table below separates implemented code from the human validation still needed.

The [unit map](english-curriculum-units.md) defines the core sequence, professional missions and the first three pilot units. Later unit rows are authoring briefs, not finished lessons. Every release still needs scripts, exercises, recordings, assessment review and learner testing. The first three units are ready for review; this is not evidence that the complete course already exists or produces a guaranteed proficiency level.

## 1. Product decisions

Build one English course with American and British production models, receptive practice in both, and progressively wider international input. Start with people who cannot yet hold a basic exchange. Let learners with existing ability enter at an appropriate point.

The course develops four skills together. Its visible milestones describe things learners can do: introduce themselves, arrange something, resolve a problem, contribute to a meeting, answer an interview follow-up, explain a proposal and handle questions. CEFR bands support planning and coverage checks, rather than replacing these concrete outcomes.

Meetings, interviews and presentations are explicit learning goals. They draw on the same language foundation and add goal-specific missions. A learner does not need to finish the entire advanced course before practising a small workplace exchange. IELTS remains an optional exam branch, never the default continuation for a communication goal.

Our ambition is reliable communication under gradually less support, including when an exchange changes direction. We will judge the experience by independent performance and retention alongside confidence and return visits. We will not call a lesson count, a streak, accent imitation or a memorised script proof of fluency.

## 2. Research translated into design decisions

The following distinguishes empirical findings, instructional frameworks and our own design choices. Research on a learning method does not validate every app implementation of that method.

| Evidence                                                                                                                                                                                                                                                                                                                                                                      | What it supports                                                                                                         | Our implementation decision and limit                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kim and Webb's 2022 meta-analysis examined 48 experiments and found advantages for spaced second-language practice. Equal and expanding schedules were not significantly different overall. [Research](https://onlinelibrary.wiley.com/doi/10.1111/lang.12479)                                                                                                                | Revisit learning over time and evaluate delayed retention                                                                | Keep the existing phrase schedule initially. Add delayed retrieval of functions and grammar in new contexts. Do not claim that our particular intervals are scientifically optimal              |
| Kakitani and Kormos's 2024 experiment studied 116 Japanese learners of English. Both one-day and seven-day spaced fluency practice produced similar delayed gains. [Research](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/effects-of-distributed-practice-on-second-language-fluency-development/4F6787916C198376CAD222934D3B37E4) | Repeated speaking practice can support fluency; there is no single established best gap for every learner                | Repeat a useful task, then change its content and return to it later. Do not convert a vocabulary schedule into a universal speaking prescription                                               |
| Research on massed task repetition found trade-offs when performance transferred to unfamiliar prompts. [Research](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/massed-task-repetition-is-a-doubleedged-sword-for-fluency-development/D28EDD7E3D0FA15630165538D706E80F)                                                             | Improvement on a rehearsed answer and transfer to new situations must be distinguished                                   | Include changed details, new questions and later unseen tasks. Avoid repeatedly grading one memorised answer as increasing ability                                                              |
| Nation's four-strands framework balances meaningful input, meaningful output, explicit language learning and fluency work. It is a curriculum-design framework, not a trial proving a particular screen sequence. [Author's paper](https://www.wgtn.ac.nz/lals/resources/paul-nations-resources/paul-nations-publications/publications/documents/2007-Four-strands.pdf)       | A course needs actual reading/listening and speaking/writing as well as instruction and practice using familiar language | Audit the balance across each four-unit block. Use approximate balance as an editorial check, not a rigid equal-time rule for every five-minute session                                         |
| Lyster and Saito's classroom meta-analysis found durable benefits from oral corrective feedback, with larger effects for prompts than recasts in that study pool. [Research](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/oral-feedback-in-classroom-sla/4999EE1C8379B2BF026B148EAF373CA1)                                      | Feedback should lead to another attempt, rather than only display a corrected sentence                                   | Address one high-impact issue, invite a retry, and model the answer if the learner remains stuck. Classroom findings do not establish that automatic feedback is accurate                       |
| A 2025 meta-analysis of talker variability found that training conditions depend on both the number of voices and how they are presented. [Research abstract](https://pubmed.ncbi.nlm.nih.gov/39937693/)                                                                                                                                                                      | Voice diversity needs careful introduction and testing                                                                   | Use a stable initial model, introduce another clear speaker with known language, then test unfamiliar voices. Do not interpret this as a universal requirement for a specific number of accents |
| The CEFR action-oriented approach connects reception, production and interaction through realistic tasks. [Council of Europe](https://www.coe.int/en/web/common-european-framework-reference-languages/the-action-oriented-approach)                                                                                                                                          | Language serves a purpose beyond answering a language question                                                           | Give units a concrete outcome and a final exchange or written artefact. Our unit order and mission design are original product decisions                                                        |
| MIT's communication guidance emphasises audience, message, rehearsal and responding to questions. [Structure](https://mitcommlab.mit.edu/nse/commkit/structuring-a-slide-presentation/), [delivery and Q&A](https://mitcommlab.mit.edu/nse/commkit/delivery-and-qa/)                                                                                                          | Presentation teaching must cover audience understanding and unscripted responses                                         | Teach a short explanation before slides or formal pitches, then introduce evidence, signposting and Q&A. This is professional teaching guidance, not proof of an app's effectiveness            |

### Learn from competing products without copying their course

The earlier review records the broader comparison. These are the specific techniques worth adapting:

| Documented product capability                                                                                                                                                                                               | Adopt                                                      | Risk our design must address                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Duolingo's speaking exercises, practice and conversations. [Official description](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)                                                  | Frequent approachable speaking and an obvious continuation | Make spontaneous meaning and delayed transfer visible alongside successful exercises                              |
| Busuu's scenario goals and conversations within its course timeline. [Official description](https://help.busuu.com/hc/en-gb/articles/21862192336402-What-are-Busuu-Conversations-and-how-can-they-help-me-learn-a-language) | Connect a conversation to taught language                  | Ensure the next task actually revisits the learner's specific difficulty, and keep feedback contestable           |
| ELSA's personalised paths, role-play and bilingual support. [January 2026 update](https://blog.elsaspeak.com/en/discover-the-new-elsa-speak-experience/)                                                                    | Relevant practice and accessible explanations              | Distinguish comprehensibility, language use and accent preference; avoid misleading precision in scoring          |
| U-Dictionary's examples, pronunciation and translation. [Developer listing](https://apps.apple.com/gb/app/udictionary-translator/id1319771553)                                                                              | Fast help when meaning blocks progress                     | Return from lookup to retrieval and a useful exchange, rather than leaving learning as disconnected reference use |

The risks are our design responsibilities, not findings that every competitor always fails at them. We have not run a controlled comparison. Claims of better outcomes require a later study with comparable learners, time on task and independent assessments.

## 3. American and British English policy

Both varieties are first-class choices, with the same learning objectives and progression. Most core grammar is shared; meaningful differences include vocabulary, spelling, pronunciation and some patterns of grammatical use. [Cambridge's comparison](https://dictionary.cambridge.org/grammar/british-grammar/british-english) supports teaching shared structures with contextual differences rather than two unrelated languages.

### Learner experience

- Offer short American and British voice samples and a changeable "My speaking model" choice. It is optional and does not create another mandatory onboarding screen.
- Existing learners retain their saved British reference. New learners can choose either; skipping keeps the existing British model, clearly named and changeable. This is a continuity default, not a claim of superiority.
- A speaker's recorded voice and regional identity stay stable within a scene. Switching the learner's preference does not magically change every character's nationality or the setting.
- Beginner instructional models follow the chosen variety. Known phrases spoken by the other variety appear early as supported listening, with new voices introduced gradually.
- Each four-unit block includes reviewed American and British listening. Wider regional and international English enters progressively, including proficient speakers who learned English later in life.
- In a comprehension check, assess the information heard. In a production task, accept valid forms from either variety when they preserve meaning and fit the situation.
- Show differences where they help: `lift/elevator`, `flat/apartment`, `takeaway/to go`, `at/on the weekend`, `colour/color`, `centre/center`, and relevant date conventions. Do not display a comparison panel after every sentence.
- Do not globally replace words or accept every spelling interchangeably. Context matters, including word class and meanings that differ between varieties. Explain document-style consistency as editing advice rather than treating valid regional English as bad grammar.
- Use explicit dates and time zones in scheduling tasks. Teach clarification when a numeric date or time could be misunderstood.

No native-speaker percentage is a learning outcome. Our pronunciation objectives are comprehensibility, useful contrasts, word and sentence stress, rhythm and appropriate pacing. The [Council of Europe's phonology guidance](https://www.coe.int/en/web/common-european-framework-reference-languages/phonological-competence) supports intelligibility and separate attention to articulation and prosody.

### Required implementation, beyond changing a label

The current app hard-codes `en-GB` in [language configuration](../src/features/language/config.ts), [preferences](../src/features/coaching/store.ts), and several audio and live-coach instructions. American support requires coordinated changes:

1. Store and validate an English reference union of `en-US` and `en-GB`; preserve old preferences during local/cloud migration. Keep the language track `EN`.
2. Carry the selected reference through web/native live-session requests and server validation. A server-owned scenario fixes scene speakers; a practice coach follows the learner's model.
3. Give recorded lines explicit variety/locale and versioned casting metadata. Review script variants rather than applying automatic word substitutions.
4. Introduce an English audio-key version containing locale and the full effective voice direction. Currently [clipKey](../src/features/audio/clips.ts) hashes the casting direction but not the language-wide `nativeDirection` that the generator also uses. Changing that direction alone can reuse the old key.
5. Keep existing British recordings addressable as legacy assets. Never serve a British clip as an unlabelled American fallback. If a reviewed American recording is missing, show availability honestly and use only a correctly configured, clearly identified fallback where appropriate.
6. Apply the same variety policy to device speech, recorded audio, live coaching, examples and writing feedback. A setting is not complete until all those paths agree.
7. Preserve phrase-review history when adding a variant. Do not create duplicate review debt for two spellings of the same familiar item unless a meaningful contrast is deliberately taught.

Native American and British reviewers must listen to actual recordings. A voice direction or voice identifier does not prove that the generated accent is correct.

## 4. How a learner progresses

The course has five broad stages, plus optional first-use support. The core map contains 92 proposed units: A1 24, A2 20, B1 20, B2 16 and C1 12. Counts are production planning, not proof of CEFR coverage. Advanced units require substantially more sustained input, practice and projects than introductory units. Do not calculate time to C1 by multiplying the count by a five-minute session.

| Stage                          | Visible outcome                                                  | Expected support and evidence                                                                                         |
| ------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| First-use support              | Understand how to listen, respond and request help               | Demonstrations, replay, pictures, simple instructions and optional support-language help; no grammar terminology test |
| A1: Start communicating        | Handle short personal and practical exchanges                    | Clear cooperative speech, useful chunks, brief forms/messages and supported interaction                               |
| A2: Manage everyday situations | Arrange things, explain a simple problem and give a short update | Less prompting, familiar changes of plan, connected messages and short explanations                                   |
| B1: Participate independently  | Explain, ask follow-ups and contribute usefully                  | Original connected responses, routine meetings/interviews/presentations, clarification and practical writing          |
| B2: Handle complexity          | Discuss alternatives and communicate under challenge             | Longer input, unfamiliar follow-ups, disagreement, negotiation, evidence and audience adaptation                      |
| C1: Communicate with precision | Lead demanding discussions and develop nuanced ideas             | Sustained interaction, complex texts, synthesis, flexible register and precise qualification                          |

These are our planning summaries. Full alignment requires a descriptor-to-evidence coverage review before publishing a completed level, using the [CEFR Companion Volume](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4).

### Skill development across the stages

The following makes the broad outcomes concrete for authors. It is our progression specification, not a set of official duration or word-count requirements. Each row revisits and extends earlier skills.

| Stage | Listening and reading                                                                                                       | Speaking and writing                                                                                            | Pronunciation and receptive variety                                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1    | Short exchanges, signs, labels, menus, schedules and simple profiles; find a needed fact                                    | Give facts, ask a simple question, request repetition; complete a form and write a short practical message      | Hear meaningful sound contrasts in taught words, make names/numbers clear, notice word stress and contractions; supported American/British models       |
| A2    | Longer familiar exchanges, announcements, instructions and correspondence; follow a changed detail                          | Connect events, explain a problem, negotiate a simple change; write a connected message and instructions        | Practise endings, phrase groups, sentence prominence and familiar connected speech; new speakers using known language                                   |
| B1    | Sustained familiar discussion, short talks, job/community notices and practical articles; separate main points from details | Sustain an exchange, explain reasons and relay information; write an organised account, email or action summary | Use stress to signal the important information, manage pauses and recognise reductions; progressively varied British, American and international voices |
| B2    | Multi-person discussion, longer talks and arguments; compare claims and infer a supported attitude                          | Negotiate, defend and revise a proposal; develop an argument or report and adapt it to the reader               | Control emphasis, chunking and intonation for meaning; understand unfamiliar voices without requiring imitation                                         |
| C1    | Extended complex input and multiple sources; interpret implication and synthesise accurately                                | Lead demanding interaction, explain nuance and revise sustained documents for different audiences               | Adapt delivery for audience and intent; understand wider regional variation and repair remaining comprehension gaps                                     |

Regional pronunciation instruction needs reviewed examples, such as rhotic/non-rhotic patterns or American intervocalic t, when those examples occur in useful language. They are listening and optional production targets, not blanket rules about how every American or British person speaks. Vocabulary grows through repeated use, collocations and word families; grammar extends from purposeful chunks to flexible sentence patterns. Each unit's coverage sheet must name those targets explicitly before authoring is considered finished.

### One next step, with goals that change practice

The learner chooses a main goal: everyday communication, meetings, interviews or presentations. IELTS is a separate option under exam preparation. The main goal changes the selected mission and context, not the prerequisite grammar or evidence needed to learn successfully. Change it at any time without losing progress.

For migration, retain existing start points and explicit exam choices. A legacy `work-study` choice remains broad until the learner refines it. The current store's default `SpeakingGoal` of `interviews` is not evidence that the learner deliberately chose interviews. Do not silently redirect those users into a specialist path; offer the new choice without resetting their work. New learners who skip goal selection begin with everyday communication.

Everyday situations remain the shared foundation. At A2, professional goals introduce small updates and simple questions. At B1/B2, the corresponding mission sequence grows into fuller performance. A learner can also request help rehearsing a near-term event, without treating that rehearsal as completion of the prerequisite course.

The first implementation uses explicit prerequisite rules, not an opaque AI recommendation model:

1. Resume today's unfinished selected activity. Keep the existing stable daily session.
2. Offer one short repair activity if a recent result shows a prerequisite misunderstanding that blocks the next task. Let the learner continue with support rather than imposing an indefinite lock.
3. Fit a bounded review into the selected time budget, preserving the current eight-card maximum. A backlog must not consume every day indefinitely.
4. Continue the next core session, or a ready mission for the chosen goal. A mission becomes ready when its listed language prerequisites have evidence of practice or diagnostic coverage.
5. Over a four-unit block, schedule all four skills and familiar-language fluency work. Reading and writing must be selectable daily activities, not optional destinations that never enter the plan.
6. When published material ends, offer goal-relevant consolidation at the learner's demonstrated level and say that the available lessons are finished. Never infer the level from another language's last catalog item.

Use short sessions with save/resume for sustained work. Start with one achievable task. A learner with more time may combine review, a session and practice, but always sees a clear daily finish. Display one reason for a recommendation, such as "Practise confirming a deadline before your meeting task."

### Placement and accessibility

"I am new" goes directly to A1 Unit 1, with optional first-use help. Existing learners can take a short receptive check and optional speaking/writing samples. Store skill-specific observations and uncertainty; do not assume a correct grammar choice proves spontaneous speech.

Use demonstrated instructions before relying on written English. The support-language mechanism must allow reviewed translations without changing lesson IDs. The first localisation pack should be selected from actual pilot participants' languages; no first-language audience has been established by the project brief. If no reviewed translation exists, offer visual/audio scaffolding and describe support honestly. Do not advertise accessibility to all zero-English learners before testing it with them.

Allow reading/writing work when the microphone is unavailable and return to speaking later. Assisted and silent practice count as practice, but do not silently count as observed spoken performance. Keep transcripts available for learning and distinguish their use from an independent listening check.

## 5. The learning cycle inside a unit

Use a recurring, understandable sequence, without mechanically forcing the same exercise types into every topic:

1. **Understand the situation.** Hear or read a short scene with a clear purpose and enough support to understand it.
2. **Learn what helps.** Notice a small amount of useful language, one manageable pattern and one pronunciation focus.
3. **Try it with support.** Complete an information gap, build a meaningful reply, or write a short response with fading help.
4. **Use it yourself.** Give personal or fictional information, ask a question and react to another person's answer.
5. **Improve one thing.** Receive specific feedback and make another attempt. A correct alternative is accepted; optional style advice is labelled as such.
6. **Use it in a changed situation later.** Change the person, details or purpose and revisit the skill after a delay.

The first pilot uses four short sessions per unit: "Meet the language", "Build a reply", "Hear and respond", and "Use it yourself". Feedback belongs inside the relevant activity; delayed practice belongs in later daily sessions. Split a session if novice observation shows overload. Later units can span more sessions and longer projects.

Meaningful input and familiar-language fluency cannot be squeezed out by novel quizzes. Each block includes a short continuing story or practical reading/listening sequence, with optional longer material and increasing independence. Use fresh authored texts and reviewed audio; do not fill the course with unreviewed generated material.

## 6. Meetings, interviews and presentations are separate skills

The [mission map](english-curriculum-units.md#professional-missions) specifies six missions in each area, tied to core prerequisites. They are applied practice sequences, not replacements for the core units.

| Goal          | Small first performance                           | Later performance                                                                                | Transfer evidence                                                                                       |
| ------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Meetings      | Say what is done and ask when something is needed | Clarify scope, disagree, propose alternatives, include another participant and confirm decisions | An unfamiliar agenda, a changed constraint, and an accurate written action list                         |
| Interviews    | Explain a role, skill or study experience         | Give relevant examples, clarify a question and handle unexpected follow-ups                      | A new vacancy and questions; answers use the learner's real or clearly fictional evidence               |
| Presentations | Explain one familiar thing to one listener        | Organise a proposal, explain evidence, adapt to the audience and handle Q&A                      | A new audience, shorter time or a question that requires clarification rather than a memorised response |

Interview practice uses examples and follow-ups rather than invented impressive achievements. STAR is a flexible structure for relevant experience, not a compulsory format for every question. [National Careers Service guidance](https://nationalcareers.service.gov.uk/careers-advice/interview-advice/the-star-method/) supports concise, conversational examples and preparation for follow-ups.

For meetings and presentations, success includes understanding and responding to other people. A polished monologue alone is insufficient. Practise a spoken contribution and its written consequence, such as a follow-up message or action summary. Do not send anything to real colleagues from a practice task.

## 7. Distinctive experiences worth building

These are hypotheses to validate, not claims of unprecedented inventions.

### A conversation that changes for a reason

The learner agrees a plan. A participant then changes one constraint, such as a time or required item. The learner must notice, clarify and confirm. Beginner changes use taught language; advanced changes introduce competing priorities. Success is resolving the situation, not repeating a target string. Include this in the first pilot in a very small form.

### Practise recovering, not only performing perfectly

Teach a response to not hearing, not knowing a word or misunderstanding a question. Later, deliberately include an unclear detail and reward asking the right question. Clearly present this as part of the scenario, not a fake technical failure. Offer accessible alternatives. Recovery should be a positive skill, not counted as a fluency failure. Include simple repair from Unit 1.

### Carry the outcome into the next medium

What the learner agreed in a call becomes the content of a short confirmation message. A presentation produces a follow-up answer; a meeting produces actions. Use the actual agreed details, with deterministic checking for critical facts and reviewed qualitative feedback for open writing. Start with authored branching details; live-generated state comes later after reliability checks.

### Rehearse an upcoming event and revisit it

Later, let learners specify an event, audience and intended outcome. Build a bounded rehearsal from reviewed mission patterns and current ability. Afterward, offer an optional reflection and a focused retry. This stays linked to the course rather than becoming a separate chatbot. It does not promise an interview pass or professional expertise.

## 8. Confidence and progress must have evidence

Ask learners optionally how comfortable they feel before and after a mission. Keep that self-report separate from what they demonstrated. No webcam emotion inference, accent score or automatic personality judgement is needed.

For each capability, distinguish:

- **Practised with help:** models, scripts, translations or prompts were needed.
- **Used independently in this task:** the learner achieved the task with the allowed natural support and no supplied answer.
- **Used again later:** a changed task on another day shows retained use.

These are practice records, not certification. A provisional pilot rule for a retained capability is independent success on two different task versions on separate days, with one revisit approximately a week later. Validate this rule; it is not a universal scientific mastery threshold. An 80% choice score can remain a practice checkpoint, but cannot compensate for a missing productive task.

Use four qualitative dimensions: task achievement, comprehensibility, interaction/repair, and language appropriate to the purpose. Writing also needs organisation and content accuracy. Missing evidence is "not observed", not automatically weak performance. Judge advanced performance against more demanding tasks, not simply faster speech.

Feedback quotes the learner's actual words, identifies one priority and invites a retry. Separate an error from an alternative phrasing. Transcript-only feedback must not claim to have heard pronunciation or intonation. Speech-transcription punctuation is not the learner's spoken grammar. Review American and British forms before correcting them.

Keep an optional small portfolio of chosen recordings and writing samples so learners can compare attempts. Store the task version, support used, date, relevant capability, input variety and feedback provenance. The current fourteen-day activity log cannot serve as that durable evidence store. Raw voice retention must be optional and deletable; record a structured practice result without requiring permanent audio storage.

## 9. Content and engineering contract

Every authored unit must supply:

- A stable ID, concrete outcome, prerequisite capability IDs, proposed level and goal tags.
- New language and retrieval targets, including where each was first taught. Keep incidental language understandable and do not make an untaught expression essential to a marked answer.
- Short session plans with receptive and productive activities; complete four-skills coverage at unit/block level.
- American/British models where needed, scene speaker varieties and contextual acceptance rules.
- A familiar practice task, changed-task variants and a delayed revisit link.
- Supported versus independent assessment rules, factual answer keys, valid alternatives and plausible wrong answers.
- Audio inventory, content version and native/teacher review state. Display authoring and review status honestly.

For the first pilot, implement deterministic recognition/building tasks with clear prompts. A personal open answer uses self-practice or labelled feedback, not a closed list pretending to assess free communication. Add observable missions as a separate result type; do not quietly reinterpret existing `spoken: true` history as assessed speaking.

| Area                       | Current constraint                                                                   | Required change                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Course and preferences     | Raw level/catalog ordering; `StudyGoal` and `SpeakingGoal` express different choices | One explicit English goal mapping and prerequisite-aware route selection; preserve saved entry points                            |
| Today and activity history | Four activity kinds exclude scheduled reading/extended writing                       | Add reading/writing/mission completion handling consistently across routing, parsing, persistence and sync                       |
| Level display              | English configured B1 to C1 with warm-ups                                            | Publish A1/A2 as actual starter content becomes available; keep incomplete levels honest; update design documentation with scope |
| Audio                      | British-only language direction, no variety on `SpokenLine`, legacy clip keys        | Variety-aware metadata, inventory, caching, playback and verified recordings; keep DE/ES and old English assets compatible       |
| Live practice              | British instructions and generic English scenarios; Spanish-only linked unit calls   | Shared English mission definitions consumed by app/server, chosen reference and explicit support level                           |
| Progress                   | Phrase review plus lesson attempts and short daily activity log                      | Capability evidence separate from completion and self-reported confidence; bounded durable storage                               |
| Content migration          | Existing users have saved old lessons and review cards                               | Retain IDs/history, retire with replacements where justified, preserve intervals and prevent duplicate cards                     |

Keep the existing ink actions, English orange identity, cream surfaces, voice glyph, typography, spacing, calm feedback sheets, keyboard behaviour, touch targets and reduced-motion support. The learning improvements should fit those components. Do not introduce a new dashboard of scores or expose all future units at first launch.

## 10. Implementation milestones

| Milestone                                     | Deliverable                                                                                                                                     | Acceptance evidence                                                                                                                            |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| M0: Repair trust                              | Resolve the review's phrasal-verb error, valid-answer rejections, ambiguous reading keys, overconfident explanations and end-of-course fallback | Reproduce each defect before correction; verify valid alternatives, changed contexts and English-only continuation afterward                   |
| M1: Support both varieties and explicit goals | Preferences, request/response validation, audio identity, route metadata and migration; show American/British choices with honest availability  | Both models work through actual playback and coaching; assets do not collide; old progress and DE/ES behaviour remain intact                   |
| M2: Build the first three units               | Twelve short pilot sessions with reviewed model variants, varied tasks, simple repair, linked practice and a review packet                      | Scripts, questions and recordings agree; no untaught essential checks; both varieties reviewed; novice navigation observed                     |
| M3: Validate the pilot                        | Native American/British review, English-teacher review, beginner observation, delayed changed-task checks                                       | Fix blocking errors and re-review affected versions; record comprehension, false corrections, support use, retention and confidence separately |
| M4: Expand the foundation                     | Remaining A1 units, cumulative checkpoints and a first A2 block                                                                                 | Descriptor coverage, retrieval and four-skills evidence reviewed; no "complete A1" claim based only on authored unit count                     |
| M5: Build professional communication          | Corrected existing B1/B2 material integrated into the new sequence; meeting, interview and presentation missions                                | Unfamiliar questions and constraints tested; accurate written follow-through; goal changes preserve progress                                   |
| M6: Deepen advanced ability                   | Sustained B2/C1 input, projects, multi-person situations and portfolio assessment                                                               | Calibrated human review of performance and transfer; published claims supported by evidence                                                    |

### Implementation status, 27 October 2026

| Milestone | Current state                                                                                                                                                                                                                                      | Remaining gate                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| M0        | Implemented: grammar, bounded reply handling, reading evidence, contextual explanations and same-language continuation. Regressions reproduced before correction.                                                                                  | Native/teacher check of revised explanations in the review packet                             |
| M1        | Implemented: persisted American/British choice, cloud validation, web/native requests, server whitelists, fixed scene identities, separate American recording keys and explicit professional goals. Legacy starts and review history are retained. | Actual live calls and native listening review; advanced route integration remains M5          |
| M2        | Authored and integrated: 12 sessions across three units, three linked calls, changed situations and a beginner stopping point. Existing design components are reused.                                                                              | Native, teacher and beginner review before expanding                                          |
| M3        | Author and technical validation under way: answer repairs, deployed beginner-call fixes, audited recordings, a versioned review page and participant protocols. See the [M3 record](english-m3-validation.md). No external sign-off recorded.      | American and British reviewers, teacher, novice observation and delayed changed-task evidence |
| M4 to M6  | Planned, not implemented by this pilot.                                                                                                                                                                                                            | Pass the pilot review boundary, then expand in reviewed blocks                                |

The [pilot review packet](english-a1-pilot-review.md) contains coverage, limitations, reviewer instructions, generated scripts and audio links. More A1 lessons are not automatically replaced by the older A2 library when a beginner finishes Unit 3. This is an intentional content boundary, not a claim that A1 is complete.

The pilot currently uses English instructions, optional models and self-practice. Support-use observations are collected during the human pilot; a durable independent-performance portfolio is not yet implemented. Software checks and generated recordings do not substitute for the milestone acceptance evidence above.

### Software verification and deployment

- All 526 tests in 61 suites pass after the M3 repairs. These include valid-answer repairs, beginner and legacy routes, persisted/cloud preferences, per-line audio varieties, recording identity, recorded playback surviving a render and the selected-model call opening.
- TypeScript, ESLint, formatting, the realtime function's Deno check and all 21 Expo Doctor checks pass.
- Generated and stored 275 additional recordings, including American narrator models for the older English library. Every recorded clip has a normalised copy. The pilot review inventory has 170 usage references to 123 distinct recordings; human listening review is pending.
- All 22 selected browser checks pass across compact and modern Android phone viewports. They cover the full twelve-session pilot, selected American model and Meetings goal, completion handoffs, a visible Unit 3 next action, saved preferences, beginner versus exam entry, and shared English/German/Spanish navigation. Browser tests use a test backend and do not establish microphone, generated-coach or native-device audio quality.
- The pilot client is in the working tree; no app release was published. The `realtime-session` backend was deployed during M3 with English call definitions, reference/goal handling and tighter beginner turns. Function version 32 is active with JWT verification enabled. Use the current pilot client for human review. The [M3 record](english-m3-validation.md) separates synthetic live integration checks from human microphone and learning evidence.

The browser journey also exposed a daily-plan handoff bug: opening a lesson directly from Learning Plan could forget that it was today's selected lesson. The selected starting lesson is now saved before navigation, so finishing it counts toward the same daily session.

The pilot's completion view keeps the next optional practice visible instead of stacking a long level-celebration panel above it. First-run language selection now describes beginner conversations and everyday/work English. Choosing an exam goal keeps a beginner in the foundation; a conversational learner can still enter the existing exam branch.

### Pilot evaluation

Recruit beginners and basic communicators with different first languages, plus American and British English reviewers and a qualified English teacher. Include learners interested in both everyday life and work; test on the phones they use. Choose reviewed support-language packs from this cohort before claiming beginner accessibility for those languages.

Observe whether a learner can start unaided, explain the unit's purpose, understand its instructions, use a phrase with changed details, recover from confusion and identify the next action. Repeat a comparable task about a week later. Track false-positive corrections and valid alternatives rejected as release defects. Have human reviewers assess a sample without seeing the app's judgement, then compare disagreements.

Release criteria are no unresolved meaning/answer-key/audio blockers, a documented route through all pilot activities, functioning American/British handling and evidence that the intended beginners can use the material. Set quantitative learning targets after baseline pilot data, rather than inventing a universal success rate. Short sessions are an entry point into sustained practice, not a promise of advanced fluency in a few minutes a day.
