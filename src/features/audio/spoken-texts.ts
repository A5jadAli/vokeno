// Spoken texts that live outside the lesson catalogues, kept here so the voice inventory and
// the screens that play them always agree.

export const vocabularyDeck = [
  {
    article: 'DIE',
    example: 'Die Rechnung, bitte.',
    meaning: 'the bill',
    pronunciation: '/ˈʁɛçnʊŋ/',
    word: 'Rechnung',
  },
  {
    article: 'DER',
    example: 'Der Kaffee ist noch zu heiß.',
    meaning: 'the coffee',
    pronunciation: '/ˈkafe/',
    word: 'Kaffee',
  },
  {
    article: 'DAS',
    example: 'Das Wasser ist sehr kalt.',
    meaning: 'the water',
    pronunciation: '/ˈvasɐ/',
    word: 'Wasser',
  },
  {
    article: 'DER',
    example: 'Der Termin ist am Dienstag.',
    meaning: 'the appointment',
    pronunciation: '/tɛʁˈmiːn/',
    word: 'Termin',
  },
  {
    article: 'DIE',
    example: 'Die Wohnung ist noch frei.',
    meaning: 'the flat',
    pronunciation: '/ˈvoːnʊŋ/',
    word: 'Wohnung',
  },
  {
    article: 'DAS',
    example: 'Das Brötchen ist frisch.',
    meaning: 'the bread roll',
    pronunciation: '/ˈbʁøːtçən/',
    word: 'Brötchen',
  },
];

export const levelCheckSentences = {
  DE: {
    language: 'de-DE',
    sentence: 'Der Bus in die Stadt fährt alle zwanzig Minuten.',
  },
  EN: {
    language: 'en-GB',
    sentence: 'The bus to the city leaves every twenty minutes.',
  },
  ES: {
    language: 'es-MX',
    sentence: 'El autobús al centro sale a las nueve.',
  },
} as const;

export const listeningWarmUpSample = 'Let’s meet outside the station at half past three.';
