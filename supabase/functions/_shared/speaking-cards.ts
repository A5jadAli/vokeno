// Original exam-style speaking task cards, shared by the app and the realtime function.
// The function accepts only these ids, so a client cannot inject its own instructions.
export type SpeakingCardPart =
  | 'ielts-2'
  | 'goethe-plan'
  | 'goethe-present'
  | 'goethe-a1-intro'
  | 'goethe-a1-ask'
  | 'goethe-a1-request'
  | 'dele-a1-intro'
  | 'dele-a1-topic'
  | 'dele-a1-dialogue';

export type SpeakingCard = {
  id: string;
  track: 'EN' | 'DE' | 'ES';
  part: SpeakingCardPart;
  title: string;
  bullets: string[];
  /** English gloss for German and Spanish cards. */
  gloss?: string;
  prepSeconds: number;
  speakSeconds: number;
};

const ielts = (id: string, title: string, bullets: string[]): SpeakingCard => ({
  id,
  track: 'EN',
  part: 'ielts-2',
  title,
  bullets,
  prepSeconds: 60,
  speakSeconds: 120,
});

const presentBullets = [
  'Stellen Sie das Thema vor.',
  'Berichten Sie von Ihrer Erfahrung.',
  'Wie ist die Situation in Ihrem Heimatland?',
  'Nennen Sie Vor- und Nachteile und Ihre Meinung.',
  'Beenden Sie die Präsentation und bedanken Sie sich.',
];

export const speakingCards: SpeakingCard[] = [
  ielts('ielts-skill', 'Describe a skill you learned outside school.', [
    'what it was',
    'how you learned it',
    'how difficult it was',
    'and explain why it is useful to you',
  ]),
  ielts('ielts-place', 'Describe a place in your town or city where you like to relax.', [
    'where it is',
    'how often you go there',
    'what you do there',
    'and explain why it helps you relax',
  ]),
  ielts('ielts-advice', 'Describe a person who gave you good advice.', [
    'who the person is',
    'what the advice was',
    'when they gave it to you',
    'and explain how it helped you',
  ]),
  ielts('ielts-change', 'Describe a change you would like to see in your local area.', [
    'what the change is',
    'who it would help',
    'how it could be done',
    'and explain why it matters to you',
  ]),
  ielts('ielts-object', 'Describe something you own that you would not want to lose.', [
    'what it is',
    'how you got it',
    'how often you use it',
    'and explain why it is important to you',
  ]),
  ielts('ielts-busy', 'Describe a time when you were very busy.', [
    'when it was',
    'what you had to do',
    'how you managed',
    'and explain how you felt afterwards',
  ]),
  ielts('ielts-app', 'Describe a website or app that you use a lot.', [
    'what it is',
    'how you found it',
    'what you use it for',
    'and explain why you find it useful',
  ]),
  ielts('ielts-journey', 'Describe a journey that did not go as planned.', [
    'where you were going',
    'what went wrong',
    'what you did',
    'and explain what you learned from it',
  ]),
  {
    id: 'goethe-farewell',
    track: 'DE',
    part: 'goethe-plan',
    title: 'Eine Kollegin verlässt die Firma. Planen Sie zusammen eine kleine Abschiedsfeier.',
    gloss: 'A colleague is leaving the company. Plan a small farewell party together.',
    bullets: ['Wann und wo?', 'Essen und Getränke?', 'Geschenk?', 'Wer kümmert sich um was?'],
    prepSeconds: 60,
    speakSeconds: 180,
  },
  {
    id: 'goethe-visit',
    track: 'DE',
    part: 'goethe-plan',
    title:
      'Ein Freund aus dem Ausland besucht Sie am Wochenende. Planen Sie zusammen das Programm.',
    gloss: 'A friend from abroad is visiting at the weekend. Plan the programme together.',
    bullets: [
      'Abholen: wann und wo?',
      'Was besichtigen?',
      'Wo essen gehen?',
      'Was tun bei schlechtem Wetter?',
    ],
    prepSeconds: 60,
    speakSeconds: 180,
  },
  {
    id: 'goethe-course',
    track: 'DE',
    part: 'goethe-plan',
    title: 'Ihr Deutschkurs endet bald. Planen Sie zusammen einen gemeinsamen Ausflug.',
    gloss: 'Your German course ends soon. Plan a class trip together.',
    bullets: ['Wohin?', 'Wie fahren Sie dorthin?', 'Was kostet es?', 'Wer organisiert was?'],
    prepSeconds: 60,
    speakSeconds: 180,
  },
  {
    id: 'goethe-phones',
    track: 'DE',
    part: 'goethe-present',
    title: 'Sollten Kinder ein eigenes Handy haben?',
    gloss: 'Should children have their own mobile phone?',
    bullets: presentBullets,
    prepSeconds: 90,
    speakSeconds: 180,
  },
  {
    id: 'goethe-city',
    track: 'DE',
    part: 'goethe-present',
    title: 'Leben in der Stadt oder auf dem Land?',
    gloss: 'Living in the city or in the countryside?',
    bullets: presentBullets,
    prepSeconds: 90,
    speakSeconds: 180,
  },
  {
    id: 'goethe-online',
    track: 'DE',
    part: 'goethe-present',
    title: 'Online einkaufen: ja oder nein?',
    gloss: 'Shopping online: yes or no?',
    bullets: presentBullets,
    prepSeconds: 90,
    speakSeconds: 180,
  },
  // A1 cards: original tasks in the shape of Goethe-Zertifikat A1 Sprechen and DELE A1
  // expresión e interacción orales. For practice before a goal date, never a score.
  {
    id: 'goethe-a1-intro',
    track: 'DE',
    part: 'goethe-a1-intro',
    title: 'Stellen Sie sich vor.',
    gloss: 'Introduce yourself, using the words on the card.',
    bullets: ['Name?', 'Alter?', 'Land?', 'Wohnort?', 'Sprachen?', 'Beruf?', 'Hobby?'],
    prepSeconds: 30,
    speakSeconds: 90,
  },
  {
    id: 'goethe-a1-food',
    track: 'DE',
    part: 'goethe-a1-ask',
    title: 'Thema: Essen und Trinken',
    gloss:
      'Topic: food and drink. Ask a question with each word, and answer the partner’s questions.',
    bullets: ['Frühstück', 'Lieblingsessen', 'Kaffee', 'Restaurant'],
    prepSeconds: 30,
    speakSeconds: 120,
  },
  {
    id: 'goethe-a1-weekend',
    track: 'DE',
    part: 'goethe-a1-ask',
    title: 'Thema: Wochenende',
    gloss: 'Topic: the weekend. Ask a question with each word, and answer the partner’s questions.',
    bullets: ['Samstag', 'Freunde', 'Sport', 'Kino'],
    prepSeconds: 30,
    speakSeconds: 120,
  },
  {
    id: 'goethe-a1-requests',
    track: 'DE',
    part: 'goethe-a1-request',
    title: 'Bitten Sie höflich und reagieren Sie.',
    gloss: 'Make a polite request for each thing, and respond to the partner’s requests.',
    bullets: ['ein Glas Wasser', 'das Fenster', 'einen Stift', 'die Rechnung'],
    prepSeconds: 30,
    speakSeconds: 120,
  },
  {
    id: 'dele-a1-intro',
    track: 'ES',
    part: 'dele-a1-intro',
    title: 'Preséntate.',
    gloss: 'Introduce yourself for one to two minutes, using the points on the card.',
    bullets: ['Nombre', 'Edad', 'Nacionalidad', 'Dónde vives', 'Idiomas', 'Profesión o estudios'],
    prepSeconds: 30,
    speakSeconds: 90,
  },
  {
    id: 'dele-a1-people',
    track: 'ES',
    part: 'dele-a1-topic',
    title: 'Las personas importantes en tu vida.',
    gloss: 'Talk for about two minutes about the people who matter to you.',
    bullets: ['¿Quiénes son?', '¿Cómo se llaman?', '¿Cómo son?', '¿Dónde viven?'],
    prepSeconds: 60,
    speakSeconds: 120,
  },
  {
    id: 'dele-a1-cafe',
    track: 'ES',
    part: 'dele-a1-dialogue',
    title: 'En una cafetería.',
    gloss: 'Order at a café: something to drink and to eat, ask the price and pay.',
    bullets: ['Pide una bebida.', 'Pide algo de comer.', 'Pregunta el precio.', 'Paga.'],
    prepSeconds: 30,
    speakSeconds: 120,
  },
];

export function getSpeakingCard(id?: string) {
  return speakingCards.find((card) => card.id === id);
}

export function examinerBrief(card: SpeakingCard) {
  const points = card.bullets.join('; ');
  const a1 =
    'This is A1 practice before the learner’s exam date. Speak slowly and clearly in short sentences, as a friendly examiner. At the end give one strength and one thing to practise, in simple target-language words with a little English. Never give a score, a pass or fail, or claim to be an official examiner.';
  if (card.part === 'goethe-a1-intro')
    return `${a1} Goethe-Zertifikat A1 style, Teil 1, task "${card.title}": the learner introduces themselves using the keywords ${points}. Say only "Bitte stellen Sie sich vor." Listen. Then ask them to spell their name, and ask for a (fictional) phone number, one at a time.`;
  if (card.part === 'goethe-a1-ask')
    return `${a1} Goethe-Zertifikat A1 style, Teil 2, topic "${card.title}". Take turns: the learner asks you one question for each word (${points}) and you answer briefly; then you ask them one question per word. Speak German.`;
  if (card.part === 'goethe-a1-request')
    return `${a1} Goethe-Zertifikat A1 style, Teil 3, task "${card.title}". Take turns making polite requests about: ${points}. React naturally to theirs (Ja, natürlich / Hier, bitte / Leider nicht). Speak German.`;
  if (card.part === 'dele-a1-intro')
    return `${a1} DELE A1 style, presentación personal, task "${card.title}". The learner presents themselves for one to two minutes covering: ${points}. Say only "Preséntate, por favor." Listen without interrupting, then ask two short follow-up questions. Speak everyday Mexican Spanish.`;
  if (card.part === 'dele-a1-topic')
    return `${a1} DELE A1 style, exposición de un tema: "${card.title}" covering ${points}. Say only "Cuando quieras, empieza." Listen for about two minutes, then ask two short questions about what they said. Speak everyday Mexican Spanish.`;
  if (card.part === 'dele-a1-dialogue')
    return `${a1} DELE A1 style, diálogo, task "${card.title}": you are a waiter at a café; the learner must ${points}. Offer choices, give prices in pesos and react naturally. Speak everyday Mexican Spanish.`;
  if (card.part === 'ielts-2')
    return `This is a compressed IELTS-style Speaking Part 2 and 3 practice that must fit into a five-minute session. The learner has this task card: "${card.title} You should say: ${points}." They have already prepared for one minute. Say only "Please start speaking now." Then listen without interrupting for up to two minutes, even through pauses. If they stop very early, give one short prompt to continue. Then ask one brief rounding-off question, followed by exactly two Part 3 discussion questions linked to the topic, one at a time, the second more abstract than the first. Keep your own turns very short. Straight after the second answer, give about thirty seconds of spoken feedback on Fluency and coherence, Vocabulary, Grammar and Pronunciation: one strength and one priority overall. Never give a band score or claim to be an official examiner.`;
  if (card.part === 'goethe-plan')
    return `This is a Goethe-Zertifikat B1 style speaking practice, Teil 1 (gemeinsam etwas planen). Task: "${card.title}" Points: ${points}. You are the learner's partner. Speak natural German at B1 level. Make suggestions, react to theirs, sometimes disagree politely so they must negotiate, and make sure every point is covered and decisions are made. Keep your turns short so the learner speaks at least half the time. The session lasts at most five minutes: after about three and a half minutes, summarise the plan and give brief feedback in simple German with a little English: one strength and one improvement for interaction. Never give a score or claim to be an official examiner.`;
  return `This is a Goethe-Zertifikat B1 style speaking practice, Teil 2 and 3. The learner presents the topic "${card.title}" covering: ${points}. Say only "Bitte, fangen Sie an." The session lasts at most five minutes. Listen without interrupting for about three minutes. Then react briefly and ask one question about the presentation, as a partner would in Teil 3. Straight after the answer, give brief feedback in simple German with a little English: structure, range, accuracy and pronunciation, one point each. Never give a score or claim to be an official examiner.`;
}
