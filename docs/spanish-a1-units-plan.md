# Spanish A1: 25 units and 100 session briefs

Companion to the [curriculum plan](spanish-a1-curriculum-plan.md). This is an authoring specification. **Units 1–6 and checkpoint 1 are implemented locally and awaiting native review; Units 7–25 and checkpoints 2–6 remain proposed.** See the [implementation ledger](spanish-a1-milestones.md) for exact session IDs, delivered changes and open review gates. Scripts, item banks, media and answer variants require review.

## Authoring contract

Use stable unit IDs `es-a1-u1` through `es-a1-u25`; session IDs append `-words`, `-grammar`, `-talk`, `-task`. The labels remain Words, Grammar, Real talk and Exam task, matching German. Each table row is one session. Reordering a published lesson must not change its ID.

Default prerequisite: the preceding unit's teaching sequence, with a short catch-up option for learners placed later. A checkpoint recommendation must not become a permanent progression lock. All new assessed language must have been introduced; incidental scene language must be supported and excluded from required recall until taught.

The sequences, examples, missions and quantities here are Vokeno design proposals. Cross-check their level assignment using the [coverage register](spanish-a1-coverage.md). **Core** means intended productive A1 content subject to that check. **Chunk** means a limited useful expression, not mastery of its entire grammar system. **Extension** means optional A2 preparation, excluded from core mastery scoring. Familiar everyday topics can contain language above A1: topic alone never determines level.

For each unit author:

- A small new productive set, a separate receptive set and explicit reused concept IDs. Begin the pilot with roughly 4–7 new chunks per teaching segment; revise the load from observation.
- At least one short reading, a multi-turn listening scene, a changed-detail production task and a later retrieval assignment.
- Natural Spanish, English help, literal clarification only where useful, accepted alternatives, plausible distractors and feedback explaining the communicative consequence.
- One pronunciation/orthography focus, revisited later; do not put the entire sound system into a single initial lesson.
- A normal accessible learning version and a separate unseen evidence version. No answers visible before the evidence attempt.

`R1–R4`, `L1–L4`, `W1–W2` and `O1–O3` refer to the [exam blueprint](spanish-a1-assessment-review.md#exam-blueprint). Early mini-tasks practise the underlying skill; they are not miniature official scores. CP1–CP6 are additional cumulative activities, outside the 100 short sessions.

## Phase 1: Meet people and share your details

### Unit 1: Hola: make your first exchange

**Can do:** greet someone, give a name, thank them and request repetition. Starting context: meet Ana at a neighbourhood language exchange. Use fictional details if preferred.

Implementation adjustment: Unit 1 also teaches `soy de + place` as a limited origin chunk and a context-bound `usted` name question. This permits a coherent replacement of the earlier names lesson. Unit 2 develops those chunks further. The [implemented four sessions](../src/features/foundations/spanish-a1-units.ts) use the same everyday outcomes with slightly revised titles.

| Session   | Brief                                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Words     | “Your first hello”: hear and use `hola`, time-appropriate greetings, `gracias`, `por favor`, `hasta luego`; complete a greeting rather than memorising an isolated list. |
| Grammar   | “Your name and a question back”: `me llamo…`, `¿Cómo te llamas?`, `soy…` as limited patterns; distinguish a statement from a question.                                   |
| Real talk | “Keep going when you miss a word”: `No entiendo`, `¿Puede repetir, por favor?`, `Más despacio, por favor`; practise a genuine repair turn.                               |
| Exam task | “Introduce yourself”: O1 precursor with a name and greeting, then one unpredictable name question; identify greeting purpose in a brief audio.                           |

**Sound/writing:** five stable vowels; ¿…? and ¡…!; hear phrase boundaries. **Recycle in:** U2, U3, U4, U6, U19. **Evidence:** respond after the model is hidden; requesting help counts as a successful strategy.

### Unit 2: Who you are and where you live

**Can do:** exchange origin, residence, language and a basic occupation. Begin regular present forms in useful first/second-person sentences; full charts come gradually.

| Session   | Brief                                                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “A few facts about you”: country/city, language, nationality and common occupation words; offer personal vocabulary choices.                    |
| Grammar   | “Soy de, vivo en, hablo”: present `ser`, `vivir`, `hablar`; subject pronouns and their frequent omission; `de/en`; basic nationality agreement. |
| Real talk | “Meet someone and introduce a friend”: friendly `tú`, contextual `usted`, `¿Y tú?`/`¿Y usted?`; simple third-person introduction.               |
| Exam task | “Choose the right profile”: R1 precursor with a short personal message; expand O1 to name, origin and residence using new details.              |

**Sound/writing:** syllables and stress in names/nationalities; lowercase language and nationality names. **Recycle:** U5, U12, U24. **Evidence:** distinguish where someone is from from where they live.

### Unit 3: Numbers and your phone number

**Can do:** give an age and a phone number, follow a number read in pairs and correct a number taken down wrong.

| Session   | Brief                                                                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Make sure they have your number”: digits, 10–20 in two small groups, `el número de teléfono`; read a phone number digit by digit.             |
| Grammar   | “Your age, your number”: age with `tener`, 21–30, `veintiún años`; `¿Cuál es tu número de teléfono?` and the everyday `¿Me das tu número?`.    |
| Real talk | “Did you say fifteen or fifty?”: tens to 100, `sesenta/setenta`, Mexican pair-reading of phone numbers, a corrected ending, `¿Así está bien?`. |
| Exam task | “Leave your number at the desk”: dictated codes and numbers, a three-field details form with an audio correction, an age in words.             |

**Sound/writing:** contrast stress in number words (`quince/cincuenta`, `sesenta/setenta`); accents in dieciséis, veintidós, veintitrés and veintiséis. **Recycle:** U7, U10, U17, U23. **Evidence:** accurate numbers in a new form; no requirement to share a real phone number.

### Unit 4: Spell it and send it

**Can do:** spell a name, give an email address and complete a short registration form.

| Session   | Brief                                                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Fill in the right field”: `nombre`, `apellido`, `correo electrónico`; letter names a–q including ñ; spell a short name.                        |
| Grammar   | “My surname, your email”: `mi/tu/su` in contact details without a full possessive system; letter names r–z with Mexican `be grande / ve chica`. |
| Real talk | “Spell it and check it back”: `arroba`, `punto`, `guion`, `guion bajo`; email dictation; spell a surname at the desk and confirm it.            |
| Exam task | “Register for the language exchange”: W1 precursor with five labelled fields, an audio correction and a spelled surname.                        |

**Sound/writing:** alphabet including ñ and rr; letter-name variants by region; exact copying of email punctuation. **Recycle:** U17, U23. **Evidence:** accurate contact information in a new form; no real details required.

Implementation note (18 October): the first build put all of this into one Unit 3. Its Words session introduced 14 cards and its Real talk had 21 steps and an 11-minute estimate, so the review split it into the two units above before Unit 5 was started. The [pilot review packet](spanish-a1-units-1-3-review.md) records the delivered sequence. The Unit 4 form is a W1 precursor, not the full DELE task.

### Unit 5: Family, friends and people around you

**Can do:** identify and describe someone using a few relevant details, without assumptions about the learner's household.

| Session   | Brief                                                                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Who is who?”: relationships, age, basic appearance/personality; descriptions respectful enough for real introductions.                                     |
| Grammar   | “My friend, our family”: noun/adjective agreement, articles, `tener`, possessives; distinguish `su` from information identifying whose person/object it is. |
| Real talk | “Introduce two people”: identify someone in a small group; ask and answer a follow-up; short `este/esta` introduction.                                      |
| Exam task | “Tell us about someone”: O2 precursor from a simple cue card; write a few original sentences; read a profile with changed names/relationships.              |

Implementation note (23 October): the [Unit 5 script](../src/features/foundations/spanish-a1-unit-5.ts) is titled “The people in your life”. Words: who is who in a photo (`mi mamá`, `mi hermano`, `¿Quién es?`, `Se llama…`) with partner, housemate and other households in the reference table. Grammar: describing kindly with gender and number agreement, `mis/tus`, and `su` versus `la hermana de Ana`. Real talk: a cousin joins the exchange (`Esta es mi prima`, `Igualmente`, Mexican `mis papás`) and follow-up questions. Exam task: an O2 precursor from a card plus a short reading. The retired starter lesson `es-family` now points to `es-a1-u5-words`.

**Sound/writing:** `ll/y`, ñ and gender/number endings; plural spelling in taught words. **Recycle:** U8, U12, U24. **CP1 after U5:** meet a new person, interpret a profile, supply contact fields and give a short introduction. Route number errors to U3, spelling and form errors to U4, identity patterns to U2, repair difficulty to U1.

Implementation note (23 October): [Checkpoint 1](../src/features/foundations/spanish-a1-checkpoint-1.ts) sits between Units 5 and 6 as one mixed session. Bruno, from Argentina and living in Puebla, joins the exchange: a heard greeting, his profile, a phone number and a spelled surname, a registration form, agreement, asking him to slow down, introducing him to a friend, his sister’s age and a short spoken introduction. The retake uses Carmen, from Spain and living in Mérida, with the same step kinds and new details. Each graded step routes to its Unit 1–5 lesson, as above.

## Phase 2: Buy things and describe your home

### Unit 6: At a café

**Can do:** order a simple drink/snack, state a preference, understand the total and close politely.

| Session   | Brief                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Words     | “Choose your order”: a small menu, drinks, snacks, portions and `la cuenta`; teach nouns with their articles.                              |
| Grammar   | “One coffee, without sugar”: `un/una`, numbers, `con/sin`, basic `quiero`/`¿Tiene…?` patterns; revisit agreement.                          |
| Real talk | “Order and check”: server asks an unannounced choice question; learner confirms a quantity or corrects the order; natural polite ellipsis. |
| Exam task | “Which order is theirs?”: L1 image-choice precursor and menu reading; use an unseen order and total.                                       |

Implementation note (23 October): the [Unit 6 script](../src/features/foundations/spanish-a1-unit-6.ts) is set in a Mexico City café. Words: drinks and snacks with their article (`un café`, `una concha`, `un jugo de naranja` with Spain's `zumo` labelled), `para aquí / para llevar`. Grammar: `¿Me das…?`, `Quiero…`, `¿Tienen…?`, `con/sin`, plurals. Real talk: an order repeated wrongly and fixed with `No, solo uno`, `¿Algo más?`, `¿Cuánto es?`, a price in pesos, paying by card. Exam task: menu reading, a heard order to match and a heard total. The starter lesson `es-cafe` now points to `es-a1-u6-words`, and learners who know some Spanish start here.

**Sound/writing:** word linking with clear vowels; `qu/c` in known words. **Recycle:** U7, U19, U25. **Regional exposure:** `jugo/zumo`, with context. **Evidence:** handle a changed order without copying a fixed script.

### Unit 7: At the market

**Can do:** ask quantities and prices, understand a purchase and check the amount.

| Session   | Brief                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Words     | “Fill a small shopping bag”: high-utility foods and containers; structured hundreds/thousands for prices and addresses, not a giant number list. |
| Grammar   | “How much and how many?”: plurals, `cuánto/a/os/as`, `mucho/poco`, `de` in quantities; quantity expressions as useful chunks.                    |
| Real talk | “A different price”: ask the seller to repeat, confirm units and price, decline politely and pay; change one item on the list.                   |
| Exam task | “Match the shop to the message”: R2 and L2 precursors with signs/images and extra alternatives; distinguish number from unit.                    |

**Sound/writing:** number contrasts and syllable stress; currency labels/decimal notation with explicit locale. **Recycle:** U8, U15, U22. **Evidence:** obtain the intended quantity and budget; no assumed currency from `$` alone.

### Unit 8: Clothes and personal things

**Can do:** identify an item by colour/size, say whose it is and make a simple choice.

| Session   | Brief                                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Find the right item”: clothes, everyday possessions, colours, size and price; receptive shop labels.                                              |
| Grammar   | “This one and that one”: demonstratives including supported recognition of `aquel`; adjective position/agreement and `muy`; reinforce possessives. |
| Real talk | “Ask for your size”: request a colour/size, reject an unsuitable option politely; recognise a Spain shop voice without changing production model.  |
| Exam task | “Whose bag is it?”: R3 description matching and L1 detail selection; describe a lost item in a short original response.                            |

**Sound/writing:** `r/rr` perception and supported production, revisited later; avoid pass/fail based on trill perfection. **Recycle:** U17, U19, U25. **Extension:** comparative `más… que` may be noticed, but its full system belongs beyond core A1.

### Unit 9: Where you live

**Can do:** describe a home, say what is there and locate familiar objects.

| Session   | Brief                                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “A place to stay”: rooms, a small furniture set and useful housing-ad terms; map a simple floor plan.                                                                      |
| Grammar   | “Hay, está, es”: existence, location and basic description; `en`, `aquí/allí`, location phrases; recycle articles. Avoid the false permanent/temporary rule for ser/estar. |
| Real talk | “Where is the key?”: an information-gap floor plan and one housemate question; recognise `piso/departamento`.                                                              |
| Exam task | “Choose a room”: R3 short-ad matching; write a basic home description, then answer an O3-style follow-up.                                                                  |

**Sound/writing:** `b/v` share a phoneme; do not describe every realisation as the same “soft b.” **Recycle:** U14, U17, U23. **CP2 after U9:** buy an item and locate something in a new home; route agreement to U5/U8, quantities to U7, location to U9.

## Phase 3: Organise your everyday life

### Unit 10: Time, dates and opening hours

**Can do:** ask when something happens, read a schedule and agree on an exact date/time.

| Session   | Brief                                                                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Find a time that works”: weekdays, months, parts of the day, dates and opening hours; ordinal recognition for familiar numbered labels. |
| Grammar   | “Es la una; son las dos”: clock patterns, `a/de… a…`, `el/los` with weekdays; distinguish event time from current time.                  |
| Real talk | “Confirm the appointment”: say date and time back; recognise 12/24-hour formats and regional ways of expressing the time.                |
| Exam task | “Which place is open?”: R4 timetable precursor and L4 detail selection; enter an appointment correctly.                                  |

**Sound/writing:** `j/g` before e/i; day/month lowercase; clarify ambiguous numeric dates rather than guessing. **Recycle:** U11, U15, U20, U22. **Evidence:** discriminate closing time from meeting time.

### Unit 11: A normal day

**Can do:** describe a simple daily routine and ask another person about theirs.

| Session   | Brief                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Morning to evening”: a limited routine set, everyday meals and basic frequency phrases.                                                                |
| Grammar   | “What I do, what you do”: consolidate present -ar/-er/-ir; introduce high-frequency reflexive routines with `me/te/se`; sequence with basic connectors. |
| Real talk | “Same day, different routine”: compare information from two people's schedules through questions; respond to an unfamiliar follow-up.                   |
| Exam task | “Match the person and the routine”: L3 beginnings/endings precursor; give an O2-style routine description without a written script.                     |

**Sound/writing:** stress in present-tense forms; preserve unstressed vowels; distinguish question words from statements. **Recycle:** U12, U16, U24. **Evidence:** communicate at least three actual routine details plus one question; this is a product practice target, not an official word/utterance requirement.

### Unit 12: Work, study and learning Spanish

**Can do:** give basic work/study information and understand simple classroom instructions.

| Session   | Brief                                                                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Where and what you study or do”: common workplaces, subjects and learning materials; include alternatives to paid employment.                                       |
| Grammar   | “We study; they work”: broaden present-person forms, `ser` with professions and article use; selected frequent irregulars in context, not a single overloaded chart. |
| Real talk | “Ask the teacher for help”: ask a word's meaning/spelling, confirm a page or time, recognise classroom imperatives as chunks.                                        |
| Exam task | “Choose a class”: R2/R3 short notices and course information; complete a learning-interest field and explain a choice simply.                                        |

**Sound/writing:** `g/gu/gü` and silent h in familiar vocabulary; names/abbreviations on forms. **Recycle:** U19, U23, U24. **Evidence:** identify the correct class by day, place and interest, not by matching one repeated word.

### Unit 13: Free time and preferences

**Can do:** say what activities you like, ask about another person's interests and choose something to do.

| Session   | Brief                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Your kind of free time”: sports, music, books, films and small cultural activities; learner chooses relevant examples.    |
| Grammar   | “Me gusta / me gustan”: noun/infinitive complements, `te/le/nos`, agreement; `también/tampoco` in a supported exchange.    |
| Real talk | “Find a shared interest”: ask a preference, respond and suggest a suitable activity using familiar present/chunk patterns. |
| Exam task | “A person and a hobby”: O2/O3 mini-pair plus R4 event information; respond with different preferences from the model.      |

**Sound/writing:** intonation for interest, questions and neutral replies; linking `me gusta`. **Recycle:** U20, U22, U24. **CP3 after U13:** combine a schedule, a profile, a short written reply and a work/routine/hobby conversation. Diagnose comprehension and production separately.

## Phase 4: Move around and travel

### Unit 14: Your neighbourhood

**Can do:** locate a service, understand a short route and check where to go.

| Session   | Brief                                                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Find what you need”: streets, common services, landmarks and direction words on a simple map.                                                  |
| Grammar   | “From here to the station”: retrieve hay/estar; `a`, `de`, `al/del`, destination and location; useful direction commands as recognition chunks. |
| Real talk | “Ask, listen, check”: get attention politely, request directions, confirm a landmark; two short route variants with different voices.           |
| Exam task | “Match the place and the notice”: L2/R2 precursors; follow a new route using labels and audio.                                                  |

**Sound/writing:** hear linked article/preposition phrases without changing their written forms. **Recycle:** U15, U19, U25. **Evidence:** reach the correct destination; complete imperative paradigms are not a hidden requirement.

### Unit 15: Public transport

**Can do:** choose a service, ask its time/destination and buy an appropriate ticket.

| Session   | Brief                                                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “The right bus or train”: destination, departure, arrival, ticket, return/single as supported chunks, platform/stop labels.         |
| Grammar   | “Voy a…; va a…”: present `ir`, destination with `a`, `en/a pie`, `para` in a destination/purpose chunk; retrieve time and quantity. |
| Real talk | “Before you get on”: ask whether this service goes to the destination and confirm a time/price; compare `boleto/billete`.           |
| Exam task | “Read the departures; hear the change”: R4 and L4 detail work; use a corrected number or time with plausible distractors.           |

**Sound/writing:** listen for stress and pauses around times/platform numbers; written vs spoken schedules. **Recycle:** U17, U22, U25. **Evidence:** correct ticket and service; complex disruption negotiation is A2 extension.

### Unit 16: Weather, seasons and a day out

**Can do:** understand basic weather information and choose suitable clothes/activity.

| Session   | Brief                                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “What is it like outside?”: seasons, everyday weather, familiar places in nature and a few temperature expressions.                                |
| Grammar   | “Hace…; hay…; está…”: weather patterns and impersonal expressions; select useful present forms such as `llueve`; no full impersonal-verb taxonomy. |
| Real talk | “Choose today's outing”: interpret a short weather exchange and make a simple choice; recognise a peninsular forecast voice.                       |
| Exam task | “Choose the matching forecast”: L1/L2 images and short R4 notices; send a brief factual weather/place update.                                      |

**Sound/writing:** natural phrase grouping and question intonation; numbers with units. **Recycle:** U20, U22, U25. **Evidence:** understand a changed location/day; weather expertise is unnecessary.

### Unit 17: At a hotel

**Can do:** give booking details, understand basic facilities and report a simple immediate problem.

| Session   | Brief                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Your room and stay”: reservation, room, nights, key, reception and essential facilities; `reserva/reservación` recognised.                       |
| Grammar   | “What is there; what is missing?”: retrieve hay/estar/tener, negation and polite question patterns; use `no funciona` as a limited problem chunk. |
| Real talk | “Check in and ask”: receptionist requests unannounced personal details; ask where breakfast/reception is and clarify one misunderstanding.        |
| Exam task | “Complete the registration”: W1-style form and L4 details; assess correct field interpretation, not just spelling a rehearsed sentence.           |

**Sound/writing:** names, accents, dates and numbers with unfamiliar voices; ordinal floor labels. **Recycle:** U19, U23, U25. **CP4 after U17:** a short trip combining timetable, route, hotel form and conversation. Recycle U3–4 contact accuracy and U9 location.

## Phase 5: Get help and stay in touch

### Unit 18: Wellbeing and asking for help

**Can do:** say a basic need, locate help and understand simple follow-up questions.

| Session   | Brief                                                                                                                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Find help”: doctor/pharmacy/help labels and a limited need/condition set; keep detailed anatomy and symptom discussion for A2.                                                              |
| Grammar   | “Necesito…; ¿Puede…?”: useful need/help chunks; revisit personal information and location. `Me duele…` is supported extension unless the source-level audit approves the intended treatment. |
| Real talk | “Explain enough to get help”: state the need, give location, request repetition; practise with a supportive service worker.                                                                  |
| Exam task | “Choose the appropriate notice”: R2/L2 service information and a short contact form; identify whom/where to ask.                                                                             |

**Sound/writing:** intelligible stressed syllables in key requests; distinguish statements and urgent requests. **Recycle:** U19, U23, U25. **Evidence:** communicate the need safely. Teach language, not diagnosis, medication or local emergency-number assumptions.

### Unit 19: Everyday services and the phone

**Can do:** ask opening times or a simple service question, give contact details and check a reply.

| Session   | Brief                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Words     | “Post office, information desk and phone”: high-utility service signs and contact words; recognise `móvil/celular` and `ordenador/computadora`.  |
| Grammar   | “Ask one clear question”: retrieve question words, present forms, negation and polite address; basic modal expressions already taught as chunks. |
| Real talk | “Without seeing the speaker”: short phone turn, identification, repair and confirmation; audio remains clear and A1-accessible.                  |
| Exam task | “Listen and select the right details”: L3/L4 practice plus a service notice; no transcription-only substitute for selection formats.             |

**Sound/writing:** words across boundaries; letter names and number contrasts under modest listening variation. **Recycle:** U21, U23, U25. **Evidence:** confirm the correct detail after a misunderstanding; complex complaints/contracts excluded.

### Unit 20: Invitations and simple plans

**Can do:** understand a simple invitation, accept/decline politely and agree on a time/place.

| Session   | Brief                                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Words     | “Make a small plan”: invitation, time/place and polite acceptance/refusal expressions; retrieve hobbies and food.                                                                                            |
| Grammar   | “A useful reply”: `puedo/no puedo`, `quiero`, and simple connectors in taught contexts. `Vamos a…`/`voy a + infinitive` may be useful chunks; broader future grammar is marked extension pending PCIC audit. |
| Real talk | “Find a plan that works”: preferences differ; ask a follow-up, decline one option and confirm another.                                                                                                       |
| Exam task | “Reply to the invitation”: W2 precursor addressing every requested point; hear and select a changed meeting detail.                                                                                          |

**Sound/writing:** invitation vs confirmation intonation; ¿…? in short messages. **Recycle:** U21, U22, U25. **Evidence:** the recipient knows the final plan. Do not demand elaborate excuses, conditional politeness or subjunctive production.

### Unit 21: Short messages people can act on

**Can do:** write a clear short message with the requested details and an appropriate opening/closing.

| Session   | Brief                                                                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “A message, not an essay”: practical opening/closing and information phrases; readable standard spelling even in chat.                       |
| Grammar   | “Join the details”: recycle basic connectors, reference and pronoun choices; `y/e`, `o/u`; short reasons only within taught language.        |
| Real talk | “Text and voice-note repair”: message plus spoken follow-up; confirm which day/time was intended.                                            |
| Exam task | “Answer the whole message”: W2 original response, self-check content points, then revise after feedback; assess an unseen prompt separately. |

**Sound/writing:** accents, ñ, opening punctuation, spacing and appropriate layout; distinguish meaning-changing errors from minor slips. **Recycle:** U22, U23, U25. **CP5 after U21:** combine help, service information and a message/conversation; use a new prompt rather than a memorised model.

## Phase 6: Transfer, confidence and the exam bridge

### Unit 22: Choose an outing from real information

**Can do:** use a small cultural programme to choose an affordable, suitable activity and tell someone the plan.

| Session   | Brief                                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Read only what matters”: retrieve event labels; a few needed museum/theatre/cinema/entry terms and accessibility labels.                          |
| Grammar   | “Bring known language together”: targeted retrieval of prices, times, location, likes and quantity; no new mandatory grammar system.               |
| Real talk | “Plan with someone from Spain”: clear peninsular input; recognise frequent `vosotros` forms and regional alternatives while replying consistently. |
| Exam task | “Search a cultural programme”: R4 multi-part factual information and a W2 reply; maintain shared stimulus/response navigation.                     |

**Sound/writing:** supported seseo/distinción comparison and unfamiliar speaker adaptation. **Recycle:** U24/U25 and delayed review. **Evidence:** integrate two constraints, such as time and budget; do not reward guessing from a single keyword.

### Unit 23: Forms and simple public transactions

**Can do:** understand the fields of an unfamiliar simple form, supply relevant details and ask a clarification question.

| Session   | Brief                                                                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Read the field before writing”: retrieve personal details, address, nationality, interests and date vocabulary; supported alternate field labels.   |
| Grammar   | “Say exactly what is needed”: revisit agreement, numbers, present forms and concise phrases; distinguish a name field from a full sentence response. |
| Real talk | “At the registration desk”: ask what a field means, spell a surname, correct an entry and finish politely.                                           |
| Exam task | “A form and a message”: paired W1/W2 practice using original material; gradually practise the shared writing time budget outside the short lesson.   |

**Sound/writing:** alphabetical information, dates, formatting and legibility; no real documents required. **Recycle:** U25 and delayed review. **Evidence:** adapt to a new form layout and relevant fictional identity; do not copy the whole model into every field.

### Unit 24: Talk about your world

**Can do:** introduce yourself, give a short organised description and answer related questions with appropriate help.

| Session   | Brief                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Words     | “Choose what is useful for you”: personalise existing identity, routine, home, work/study and leisure language; fill only genuine essential vocabulary gaps. |
| Grammar   | “Make your meaning clear”: targeted consolidation from the learner's errors; present person, agreement, questions and basic linking.                         |
| Real talk | “A different question each time”: supported interviewer turns on familiar topics, including a repair request; avoid an invariant memorised interview.        |
| Exam task | “Introduction, topic, conversation”: practise O1–O3 transitions; full timed delivery is a separate longer activity with human/validated feedback.            |

**Sound/writing:** phrasing, comprehensibility and recovery after hesitation; record a fresh response before hearing a model. **Recycle:** U25 and delayed review. **Evidence:** answer a follow-up absent from the rehearsal, without treating pauses as failure.

### Unit 25: A day you can manage

**Can do:** combine familiar skills in new situations and understand what to practise next.

| Session   | Brief                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words     | “Use what you already know”: retrieve high-value language across contexts; no last-minute large vocabulary list.                                                                      |
| Grammar   | “Fix your recurring difficulty”: adaptive small sets drawn from taught content; build a useful response after feedback.                                                               |
| Real talk | “Your choices change the day”: a route/order/meeting mission with changed details, a misunderstanding and a final confirmation.                                                       |
| Exam task | “Know the exam, know your next step”: work through representative task instructions and response mechanics; schedule full practice rather than claiming this short session is a mock. |

**Sound/writing:** new voices and prompts using familiar language; small final orthography check. **CP6 after U25:** unseen four-skill transfer, then a personalised recommendation. Learner chooses ordinary A1 consolidation, the exam route or available A2 starter content.

## Checkpoint and retrieval schedule

Every checkpoint covers reading, listening, writing and speaking in a small set of connected tasks. Offer it as a clearly timed longer activity, or split it into saved skill sessions. A split or assisted attempt is useful practice; record its conditions. Collect evidence after a delay as well as immediately after teaching. CP6 is not a substitute for a full mock.

| Checkpoint | Introduced material | Deliberate older retrieval                               | Immediate next action                                      |
| ---------- | ------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| CP1        | U1–5                | Greetings/name repeated across contexts                  | Personal details, number or repair micro-practice; then U6 |
| CP2        | U6–9                | U1 courtesy, U3 numbers, U5 agreement                    | Order, quantity or location practice; then U10             |
| CP3        | U10–13              | U2 identity, U3–4 contact, U6 requests                   | Time, routine or preference practice; then U14             |
| CP4        | U14–17              | U4 form details, U7 price, U9 location, U10 time         | Travel/form/listening practice; then U18                   |
| CP5        | U18–21              | U1 repair, U10 time, U12 learning context, U13 interests | Requested message points or service conversation; then U22 |
| CP6        | U22–25              | Sample all earlier phases using unseen stimuli           | Weak-skill practice, mock familiarisation, or A2 starter   |

For each checkpoint, author a parallel reattempt with new names, amounts, speakers, images and wording. Changing only the answer order is not an unseen task. Later assessment pools must sample early content too. A remembered story outcome must never reveal the test answer.

## Spanish A1 legacy migration

Keep all published IDs and histories. These mappings designate where an old starting-point link can resume; they **do not** award an entire new unit as mastered. Resolve current saved runs before retiring content; retain legacy review access and avoid double-seeding equivalent cards. A learner who completed the starter path should receive a short bridge/diagnostic, not a demand to repeat everything or an automatic A1 pass.

| Existing lesson  | Proposed replacement starting point                                                   |
| ---------------- | ------------------------------------------------------------------------------------- |
| `es-first-words` | `es-a1-u1-words`                                                                      |
| `es-names`       | `es-a1-u1-grammar` (implemented in M1; origin/language expansion continues in U2)     |
| `es-repair`      | `es-a1-u1-talk`                                                                       |
| `es-sounds`      | `es-a1-u1-words`, plus pronunciation diagnostic/review; sound teaching is distributed |
| `es-prices`      | `es-a1-u7-words`; offer U3 number catch-up                                            |
| `es-family`      | `es-a1-u5-words`                                                                      |
| `es-cafe`        | `es-a1-u6-words`                                                                      |
| `es-time`        | `es-a1-u10-words`; routine continues in U11                                           |
| `es-market`      | `es-a1-u7-words`                                                                      |
| `es-directions`  | `es-a1-u14-words`; location prerequisite U9                                           |
| `es-transport`   | `es-a1-u15-words`                                                                     |
| `es-likes`       | `es-a1-u13-words`                                                                     |
| `es-hotel`       | `es-a1-u17-words`                                                                     |
| `es-help`        | `es-a1-u18-words`; retain U1 repair link                                              |
| `es-messages`    | `es-a1-u21-words`; invitation prerequisite U20                                        |

Retire a legacy lesson in a public release only when its approved replacement and necessary catch-up path are published. M1 prepares the first three replacements in the local working implementation; their native-review gates remain open. An unfinished earlier first run stays accessible under Saved lessons. A partial rollout must not leave `replacedBy` pointing to an unavailable ID. Keep A2 lessons in A2; audit overlap, but do not use a broad current “A2” label as a reason to omit simple A1 housing, service or help functions.
