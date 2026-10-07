import type { LanguageTrack } from '@/features/listening/scenarios';

export const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;

export type CefrLevel = (typeof cefrLevels)[number];

export type CurriculumPhrase = {
  meaning: string;
  phrase: string;
  usage: string;
};

export type CurriculumUnit = {
  coachBrief: string;
  context: string;
  id: string;
  level: CefrLevel;
  outcome: string;
  phrases: CurriculumPhrase[];
  pronunciationFocus: string;
  title: string;
  track: LanguageTrack;
};

export const curriculumUnits: CurriculumUnit[] = [
  {
    coachBrief:
      'Run a short first-meeting conversation. Model one phrase, let the learner answer, then vary the question. Focus on clear word stress and unstressed function words.',
    context: 'Greetings, introductions and simple requests',
    id: 'en-a1-first-contact',
    level: 'A1',
    outcome: 'Introduce yourself and manage a short friendly exchange.',
    phrases: [
      {
        meaning: 'An informal British greeting.',
        phrase: 'Hiya, how’s it going?',
        usage: 'Friends and relaxed everyday situations',
      },
      {
        meaning: 'A natural short response to “How are you?”',
        phrase: 'I’m good, thanks.',
        usage: 'Neutral everyday conversation',
      },
      {
        meaning: 'A polite way to order or request something.',
        phrase: 'Could I get …, please?',
        usage: 'Cafés, shops and service situations',
      },
    ],
    pronunciationFocus: 'Clear word stress and weak forms such as “to” and “a”',
    title: 'First contact',
    track: 'EN',
  },
  {
    coachBrief:
      'Arrange a casual plan in contemporary British English. Encourage short natural replies and practise linking across word boundaries without forcing slang.',
    context: 'Making plans and responding naturally',
    id: 'en-a2-making-plans',
    level: 'A2',
    outcome: 'Suggest, accept and adjust a simple social plan.',
    phrases: [
      {
        meaning: 'Would you like to do something?',
        phrase: 'Do you fancy grabbing a coffee?',
        usage: 'Informal British English',
      },
      {
        meaning: 'I agree with that suggestion.',
        phrase: 'Sounds good to me.',
        usage: 'Friendly and neutral situations',
      },
      {
        meaning: 'A gentle way to change a plan.',
        phrase: 'Could we make it a bit later?',
        usage: 'Informal arrangements',
      },
    ],
    pronunciationFocus: 'Linking, contractions and the rhythm of short replies',
    title: 'Make a plan',
    track: 'EN',
  },
  {
    coachBrief:
      'Run a lively but respectful interview-style conversation. Elicit an opinion and a short story. Recycle modern high-frequency discourse phrases in context, never as a celebrity imitation.',
    context: 'Modern interviews and confident everyday opinions',
    id: 'en-b1-interview-flow',
    level: 'B1',
    outcome: 'Give an opinion and keep an unscripted interview moving.',
    phrases: [
      {
        meaning: 'Introduces a balanced or honest point.',
        phrase: 'To be fair, …',
        usage: 'Conversational opinions',
      },
      {
        meaning: 'A natural British way to say “I think”.',
        phrase: 'I reckon …',
        usage: 'Informal British conversation',
      },
      {
        meaning: 'Nearly or essentially.',
        phrase: 'Pretty much.',
        usage: 'Short informal responses',
      },
    ],
    pronunciationFocus: 'Sentence stress, reductions and confident turn-taking',
    title: 'Interview flow',
    track: 'EN',
  },
  {
    coachBrief:
      'Invite the learner to tell a surprising story. Help them foreground key events with stress, chunk longer sentences and use natural narrative transitions.',
    context: 'Storytelling with nuance and reaction',
    id: 'en-b2-storytelling',
    level: 'B2',
    outcome: 'Tell a clear, engaging story with natural emphasis.',
    phrases: [
      {
        meaning: 'The eventual result was unexpected.',
        phrase: 'It turned out that …',
        usage: 'Narratives and explanations',
      },
      {
        meaning: 'This was the result, often unexpectedly.',
        phrase: 'I ended up …',
        usage: 'Informal storytelling',
      },
      {
        meaning: 'I was moderately surprised or unsettled.',
        phrase: 'I was a bit taken aback.',
        usage: 'Measured British reaction',
      },
    ],
    pronunciationFocus: 'Thought groups, contrastive stress and expressive intonation',
    title: 'Tell the story',
    track: 'EN',
  },
  {
    coachBrief:
      'Run a thoughtful professional interview. Challenge the learner to qualify a claim, contrast two positions and land a concise conclusion. Prioritise clarity over accent erasure.',
    context: 'Precise professional and interview communication',
    id: 'en-c1-presence',
    level: 'C1',
    outcome: 'Express a nuanced position with calm, credible delivery.',
    phrases: [
      {
        meaning: 'Introduces the most noticeable insight.',
        phrase: 'What struck me was …',
        usage: 'Reflective answers and presentations',
      },
      {
        meaning: 'Adds a contrasting qualification.',
        phrase: 'Having said that, …',
        usage: 'Balanced formal or professional speech',
      },
      {
        meaning: 'Politely limits or rejects an extreme claim.',
        phrase: 'I wouldn’t go so far as to say …',
        usage: 'Nuanced disagreement',
      },
    ],
    pronunciationFocus: 'Prosodic control, emphasis and deliberate pacing',
    title: 'Interview presence',
    track: 'EN',
  },
  {
    coachBrief:
      'Run an IELTS-style Speaking Part 2 and 3 mock from a task card. Listen without interrupting during the long turn, then discuss abstract follow-up questions and give qualitative feedback on the four speaking criteria.',
    context: 'Exam mock with a task card and timer',
    id: 'en-ielts-speaking',
    level: 'B2',
    outcome: 'Speak for two minutes from a task card, then discuss the topic in depth.',
    phrases: [
      {
        meaning: 'Introduces the most important point in a story.',
        phrase: 'What made it so memorable was …',
        usage: 'Part 2 long turn',
      },
      {
        meaning: 'Gives a cautious main reason.',
        phrase: 'I’d say it’s largely because …',
        usage: 'Part 3 discussion',
      },
      {
        meaning: 'Buys time naturally before an abstract answer.',
        phrase: 'That’s not something I’ve thought about much, but …',
        usage: 'Part 3 discussion',
      },
    ],
    pronunciationFocus: 'Extended answers, chunking and clear sentence stress',
    title: 'IELTS speaking mock',
    track: 'EN',
  },
  {
    coachBrief:
      'Run a first meeting and a simple café order in standard German from Germany. Model vowel length and primary word stress, then accept short complete learner turns.',
    context: 'Greetings, introductions and essential requests',
    id: 'de-a1-first-contact',
    level: 'A1',
    outcome: 'Greet someone, introduce yourself and order politely.',
    phrases: [
      {
        meaning: 'Morning! A shortened everyday greeting.',
        phrase: 'Morgen!',
        usage: 'Informal daytime greetings',
      },
      {
        meaning: 'I would like …',
        phrase: 'Ich hätte gern …',
        usage: 'Polite orders and requests',
      },
      {
        meaning: 'That is all, thank you.',
        phrase: 'Das war’s, danke.',
        usage: 'Finishing an order',
      },
    ],
    pronunciationFocus: 'German vowel length, word stress and clear final consonants',
    title: 'Erster Kontakt',
    track: 'DE',
  },
  {
    coachBrief:
      'Run a busy bakery or shop interaction. Use natural but widely understood colloquial German, contrasting the complete form with what learners actually hear.',
    context: 'Fast everyday transactions',
    id: 'de-a2-einkaufen',
    level: 'A2',
    outcome: 'Understand and complete a quick shop interaction.',
    phrases: [
      {
        meaning: 'Anything else?',
        phrase: 'Sonst noch was?',
        usage: 'Everyday service encounters',
      },
      {
        meaning: 'I’ll take …',
        phrase: 'Ich nehm …',
        usage: 'Common spoken reduction of “ich nehme”',
      },
      {
        meaning: 'Keep the change / that amount is fine.',
        phrase: 'Passt so.',
        usage: 'Paying in cafés, taxis and shops',
      },
    ],
    pronunciationFocus: 'Schwa reduction and recognising shortened verb endings',
    title: 'Schnell einkaufen',
    track: 'DE',
  },
  {
    coachBrief:
      'Simulate a real phone call about an appointment or flat. Help the learner manage uncertainty and repair misunderstandings without switching immediately to English.',
    context: 'Phone calls, appointments and clarification',
    id: 'de-b1-phone',
    level: 'B1',
    outcome: 'Handle a practical call and ask for clarification.',
    phrases: [
      {
        meaning: 'I’m getting in touch about …',
        phrase: 'Ich meld mich wegen …',
        usage: 'Natural spoken form of “ich melde mich”',
      },
      {
        meaning: 'It depends.',
        phrase: 'Kommt drauf an.',
        usage: 'Everyday spoken German',
      },
      {
        meaning: 'Could you explain that again?',
        phrase: 'Könnten Sie das noch mal erklären?',
        usage: 'Polite communication repair',
      },
    ],
    pronunciationFocus: 'Consonant clusters, reductions and question intonation',
    title: 'Am Telefon',
    track: 'DE',
  },
  {
    coachBrief:
      'Lead a workplace discussion where the learner agrees, hedges and disagrees politely. Focus on sentence-level prominence and keeping the verb frame clear.',
    context: 'Workplace opinions and polite disagreement',
    id: 'de-b2-discussion',
    level: 'B2',
    outcome: 'Contribute a nuanced opinion in a German discussion.',
    phrases: [
      {
        meaning: 'Honestly speaking …',
        phrase: 'Ehrlich gesagt, …',
        usage: 'Candid but neutral opinions',
      },
      {
        meaning: 'I am not sure about that.',
        phrase: 'Da bin ich mir nicht sicher.',
        usage: 'Soft disagreement',
      },
      {
        meaning: 'I see that somewhat differently.',
        phrase: 'Ich sehe das etwas anders.',
        usage: 'Polite professional disagreement',
      },
    ],
    pronunciationFocus: 'Sentence stress, rhythm and long-clause chunking',
    title: 'Im Gespräch',
    track: 'DE',
  },
  {
    coachBrief:
      'Run a high-level professional discussion. Ask the learner to distinguish evidence, judgement and conclusion while maintaining calm, intelligible prosody.',
    context: 'Professional precision and persuasive speaking',
    id: 'de-c1-praezision',
    level: 'C1',
    outcome: 'State and defend a precise position with natural structure.',
    phrases: [
      {
        meaning: 'As far as I can judge …',
        phrase: 'Soweit ich das beurteilen kann, …',
        usage: 'Careful professional assessment',
      },
      {
        meaning: 'The decisive factor is …',
        phrase: 'Ausschlaggebend ist …',
        usage: 'Highlighting a central argument',
      },
      {
        meaning: 'All things considered …',
        phrase: 'Unterm Strich …',
        usage: 'A concise spoken conclusion',
      },
    ],
    pronunciationFocus: 'Flexible prominence, intonation and controlled speech rate',
    title: 'Präzise auftreten',
    track: 'DE',
  },
  {
    coachBrief:
      'Run a Goethe B1 style speaking mock: plan something with the learner as a partner, or listen to a short presentation, then give brief feedback on structure and interaction.',
    context: 'Exam mock with a task card and timer',
    id: 'de-b1-goethe-sprechen',
    level: 'B1',
    outcome: 'Plan together with a partner or present a topic, as in Goethe B1 Sprechen.',
    phrases: [
      {
        meaning: 'How about if …?',
        phrase: 'Wie wäre es, wenn …?',
        usage: 'Making a suggestion (Teil 1)',
      },
      {
        meaning: 'What do you think of that?',
        phrase: 'Was hältst du davon?',
        usage: 'Involving your partner (Teil 1)',
      },
      {
        meaning: 'In my opinion …',
        phrase: 'Meiner Meinung nach …',
        usage: 'Giving your view (Teil 2)',
      },
    ],
    pronunciationFocus: 'Clear structure, reacting to a partner and sentence melody',
    title: 'Goethe B1 Sprechen mock',
    track: 'DE',
  },
  {
    coachBrief:
      'Run a friendly first meeting in widely understood Mexican Spanish. Model one short sentence at a time, pause for the learner, and help them ask a question back. Explain unfamiliar words briefly in English.',
    context: 'Names, origin and a question back',
    id: 'es-a1-meet',
    level: 'A1',
    outcome: 'Introduce yourself and keep a first meeting going.',
    phrases: [
      { meaning: 'My name is Sara.', phrase: 'Me llamo Sara.', usage: 'Everyday introduction' },
      {
        meaning: 'I am from Pakistan.',
        phrase: 'Soy de Pakistán.',
        usage: 'Introduce your home country',
      },
      { meaning: 'And you?', phrase: '¿Y tú?', usage: 'Ask a peer in a casual setting' },
    ],
    pronunciationFocus: 'Clear Spanish vowels and the ll sound in llamo',
    title: 'Meet someone',
    track: 'ES',
  },
  {
    coachBrief:
      'Play a café worker in Mexico. Begin with a simple question, let the learner order, then ask whether it is for here or to take away. If they hesitate, offer one short model and let them try again.',
    context: 'Café ordering and payment',
    id: 'es-a1-cafe',
    level: 'A1',
    outcome: 'Order a drink and ask to pay.',
    phrases: [
      {
        meaning: 'I would like a coffee with milk.',
        phrase: 'Quisiera un café con leche.',
        usage: 'Polite order',
      },
      { meaning: 'To take away.', phrase: 'Para llevar.', usage: 'At the counter' },
      { meaning: 'Can I pay by card?', phrase: '¿Puedo pagar con tarjeta?', usage: 'At payment' },
    ],
    pronunciationFocus: 'Steady vowels and stress in quisiera and café',
    title: 'At the café',
    track: 'ES',
  },
  {
    coachBrief:
      'Play a helpful local giving short directions. Use one or two turns at a time and check whether the learner understood left, right and straight ahead. Keep the learner speaking more than you.',
    context: 'Finding a station and checking directions',
    id: 'es-a1-directions',
    level: 'A1',
    outcome: 'Ask for a station and check a short direction.',
    phrases: [
      {
        meaning: 'Where is the station?',
        phrase: '¿Dónde está la estación?',
        usage: 'Ask for a place',
      },
      { meaning: 'Go straight ahead.', phrase: 'Siga derecho.', usage: 'Direction you may hear' },
      { meaning: 'Is it nearby?', phrase: '¿Está cerca?', usage: 'Check the distance' },
    ],
    pronunciationFocus: 'Question rhythm and the r in derecho',
    title: 'Find your way',
    track: 'ES',
  },
  {
    coachBrief:
      'Play a friendly coworker in Mexico on a Monday morning. Ask what the learner did at the weekend, react naturally (¡Qué padre!, ¿En serio?) and ask one follow-up question about each answer. Recast past-tense mistakes inside your reply instead of correcting them directly.',
    context: 'Monday small talk about the weekend',
    id: 'es-a2-weekend',
    level: 'A2',
    outcome: 'Tell what you did at the weekend and keep the chat going.',
    phrases: [
      {
        meaning: 'What did you do at the weekend?',
        phrase: '¿Qué hiciste el fin de semana?',
        usage: 'Ask it back',
      },
      { meaning: 'I went to…', phrase: 'Fui a…', usage: 'Past of ir' },
      { meaning: 'It was really good.', phrase: 'Estuvo muy bien.', usage: 'Sum up an event' },
    ],
    pronunciationFocus: 'Final stress in past forms such as descansé and comí',
    title: 'Your weekend',
    track: 'ES',
  },
  {
    coachBrief:
      'Play a receptionist at a clinic in Mexico, using usted. The learner needs to move an appointment. Offer two alternative times, one of which does not work for them, and confirm the final day and time clearly.',
    context: 'Rescheduling a clinic appointment by phone',
    id: 'es-a2-appointment',
    level: 'A2',
    outcome: 'Change an appointment and confirm the new time.',
    phrases: [
      {
        meaning: 'Can we change the appointment?',
        phrase: '¿Podemos cambiar la cita?',
        usage: 'Start the change',
      },
      {
        meaning: 'Does Friday suit you?',
        phrase: '¿Le queda bien el viernes?',
        usage: 'Suggest a day',
      },
      {
        meaning: 'Perfect, see you on Friday.',
        phrase: 'Perfecto, nos vemos el viernes.',
        usage: 'Confirm',
      },
    ],
    pronunciationFocus: 'Clear numbers and days: jueves, viernes, a las diez',
    title: 'Change an appointment',
    track: 'ES',
  },
  {
    coachBrief:
      'Play a server at a busy taquería in Mexico. Take the order, ask about drinks, handle one change (sin cebolla) and, at the end, respond to a request to pay separately. Mention the tip only if the learner asks.',
    context: 'Ordering and paying at a taquería',
    id: 'es-a2-restaurant',
    level: 'A2',
    outcome: 'Order for yourself, change a dish and split the bill.',
    phrases: [
      { meaning: 'For me, …', phrase: 'Para mí, …', usage: 'Order' },
      {
        meaning: 'Without onion, please.',
        phrase: 'Sin cebolla, por favor.',
        usage: 'Change a dish',
      },
      {
        meaning: 'Can we pay separately?',
        phrase: '¿Podemos pagar por separado?',
        usage: 'Split the bill',
      },
    ],
    pronunciationFocus: 'The rolled r at the start of recomienda and the ll in cebolla',
    title: 'At the taquería',
    track: 'ES',
  },
];

export function getCurriculumUnits(track: LanguageTrack) {
  return curriculumUnits.filter((unit) => unit.track === track);
}

export function getCurriculumUnit(id?: string) {
  return curriculumUnits.find((unit) => unit.id === id);
}

export const examMockUnitIds = ['en-ielts-speaking', 'de-b1-goethe-sprechen'];
