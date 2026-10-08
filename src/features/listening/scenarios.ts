import type { LanguageTrack } from '@/features/language/config';

export type { LanguageTrack } from '@/features/language/config';
export type SubtitleMode = 'target' | 'meaning' | 'off';

export type DialogueLine = {
  speaker: string;
  text: string;
  translation: string;
};

export type ListeningScenario = {
  id: string;
  track: LanguageTrack;
  language: 'en-GB' | 'de-DE' | 'es-MX';
  languageName: 'English' | 'German' | 'Spanish';
  title: string;
  context: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  duration: string;
  accent: string;
  icon:
    | 'account-group-outline'
    | 'airplane'
    | 'basket-outline'
    | 'bus'
    | 'book-open-variant'
    | 'school-outline'
    | 'coffee-outline'
    | 'food-croissant'
    | 'home-city-outline'
    | 'food'
    | 'office-building-outline'
    | 'phone-outline'
    | 'podcast'
    | 'stethoscope'
    | 'train';
  lines: DialogueLine[];
  /** What to listen for: as heard in a line, the plainer form when it differs, and a note. */
  phrases: { heard: string; plain?: string; meaning: string }[];
  question: {
    prompt: string;
    options: string[];
    correctIndex: number;
  };
};

export const listeningScenarios: ListeningScenario[] = [
  {
    id: 'coffee-run',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'Coffee on the go',
    context: 'A quick order during the morning rush',
    level: 'A2',
    duration: '40 sec',
    accent: 'Everyday British English',
    icon: 'coffee-outline',
    lines: [
      {
        speaker: 'Barista',
        text: 'Hiya, what can I get you?',
        translation: 'Hello, what would you like?',
      },
      {
        speaker: 'Customer',
        text: 'Could I get a flat white to take away?',
        translation: 'I would like a takeaway flat white.',
      },
      {
        speaker: 'Barista',
        text: 'Sure thing. D’you want an extra shot in that?',
        translation: 'Certainly. Would you like an extra espresso shot?',
      },
      {
        speaker: 'Customer',
        text: 'No, I’m all right, thanks.',
        translation: 'No, thank you.',
      },
    ],
    phrases: [
      { heard: 'Hiya', meaning: 'A friendly, informal hello, very common in Britain.' },
      {
        heard: 'D’you want',
        plain: 'Do you want',
        meaning: '“Do” and “you” blend together in fast speech.',
      },
      {
        heard: 'No, I’m all right, thanks.',
        plain: 'No, thank you.',
        meaning: 'A polite British way to say no to an offer. It is not about how you feel.',
      },
    ],
    question: {
      prompt: 'What extra does the barista offer?',
      options: ['A larger cup', 'An extra espresso shot', 'Oat milk'],
      correctIndex: 1,
    },
  },
  {
    id: 'platform-change-en',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'Platform change',
    context: 'A station announcement changes your plan',
    level: 'B1',
    duration: '35 sec',
    accent: 'Public announcement',
    icon: 'train',
    lines: [
      {
        speaker: 'Announcement',
        text: 'We’re sorry to announce that the twelve-ten service to Leeds is running approximately fifteen minutes late.',
        translation: 'The 12:10 train to Leeds is about 15 minutes late.',
      },
      {
        speaker: 'Announcement',
        text: 'This service will now depart from platform eight instead of platform six.',
        translation: 'The train will leave from platform 8, not platform 6.',
      },
    ],
    phrases: [
      {
        heard: 'the twelve-ten service',
        plain: 'the 12:10 train',
        meaning: 'Announcements call trains “services”.',
      },
      {
        heard: 'running approximately fifteen minutes late',
        plain: 'about 15 minutes late',
        meaning: 'Announcements use long, formal phrasing. Listen for the number.',
      },
      {
        heard: 'instead of',
        meaning: 'The new platform comes first; the old one comes after “instead of”.',
      },
    ],
    question: {
      prompt: 'Which platform should you go to?',
      options: ['Platform 6', 'Platform 8', 'Platform 15'],
      correctIndex: 1,
    },
  },
  {
    id: 'monday-catch-up',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'Monday catch-up',
    context: 'Colleagues speak casually before a meeting',
    level: 'B1',
    duration: '50 sec',
    accent: 'Casual workplace speech',
    icon: 'office-building-outline',
    lines: [
      {
        speaker: 'Maya',
        text: 'You all right? How was your weekend?',
        translation: 'Hello. How was your weekend?',
      },
      {
        speaker: 'Sam',
        text: 'Yeah, not bad. Didn’t get up to much, to be honest.',
        translation: 'It was fine. I did not do very much.',
      },
      {
        speaker: 'Maya',
        text: 'Fair enough. We’d better head in. The stand-up’s about to start.',
        translation: 'I understand. We should go in because the meeting will start soon.',
      },
    ],
    phrases: [
      {
        heard: 'You all right?',
        plain: 'Hello, how are you?',
        meaning:
          'A casual British greeting, not a question about a problem. “Yeah, not bad” is a normal answer.',
      },
      {
        heard: 'Didn’t get up to much',
        plain: 'I did not do very much.',
        meaning: 'A natural way to say the weekend was quiet.',
      },
      {
        heard: 'We’d better head in.',
        plain: 'We should go inside now.',
        meaning: 'Suggests it is time to go somewhere.',
      },
    ],
    question: {
      prompt: 'Why do Maya and Sam need to go inside?',
      options: ['It is raining', 'Their meeting is starting', 'They need coffee'],
      correctIndex: 1,
    },
  },
  {
    id: 'ielts-booking',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'Booking a course by phone',
    context: 'Form-filling with a corrected detail, as in IELTS Listening Part 1',
    level: 'B1',
    duration: '45 sec',
    accent: 'British phone call',
    icon: 'phone-outline',
    lines: [
      {
        speaker: 'Receptionist',
        text: 'Good morning, Riverside Language Centre. How can I help?',
        translation: 'A standard phone greeting from a business.',
      },
      {
        speaker: 'Caller',
        text: 'Hi, I’d like to book the evening conversation course, please.',
        translation: 'I want to book the evening course.',
      },
      {
        speaker: 'Receptionist',
        text: 'Lovely. Can I take your surname?',
        translation: 'Great. What is your family name?',
      },
      {
        speaker: 'Caller',
        text: 'It’s Okafor. O, K, A, F, O, R.',
        translation: 'My surname is Okafor, spelled O-K-A-F-O-R.',
      },
      {
        speaker: 'Receptionist',
        text: 'Thanks. The course starts on the fourteenth. Sorry, no, the sixteenth of October, and it’s forty pounds.',
        translation: 'The course starts on 16 October and costs £40.',
      },
    ],
    phrases: [
      {
        heard: 'Can I take your surname?',
        plain: 'What is your surname?',
        meaning: 'A polite service phrase for asking for details.',
      },
      {
        heard: 'Sorry, no, the sixteenth',
        meaning:
          'A self-correction. The corrected detail is the answer; the first one is a distractor.',
      },
      {
        heard: 'forty pounds',
        meaning: 'Tens stress the first syllable (FORty); teens stress the end (fourTEEN).',
      },
    ],
    question: {
      prompt: 'When does the course start?',
      options: ['14 October', '16 October', '6 October'],
      correctIndex: 1,
    },
  },
  {
    id: 'flatmates-en',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'Sorting out the bills',
    context: 'Flatmates split the energy bill',
    level: 'B1',
    duration: '35 sec',
    accent: 'Casual British speech',
    icon: 'home-city-outline',
    lines: [
      {
        speaker: 'Priya',
        text: 'Hey, have you got a sec? The energy bill’s come in.',
        translation: 'Do you have a moment? The energy bill has arrived.',
      },
      { speaker: 'Tom', text: 'Go on, how bad is it?', translation: 'Tell me, is it expensive?' },
      {
        speaker: 'Priya',
        text: 'Not as bad as I thought, to be fair. About sixty quid each.',
        translation: 'Honestly, it is less than I expected: about £60 each.',
      },
      {
        speaker: 'Tom',
        text: 'Fair enough. I’ll sort it out tonight, if that’s all right.',
        translation: 'OK. I will pay it tonight, if that is OK.',
      },
    ],
    phrases: [
      {
        heard: 'have you got a sec?',
        plain: 'do you have a second?',
        meaning: 'A casual way to ask for a moment of someone’s time.',
      },
      {
        heard: 'quid',
        plain: 'pounds',
        meaning: 'Informal British word for pounds (£). It never takes an s: sixty quid.',
      },
      {
        heard: 'to be fair',
        plain: 'honestly',
        meaning: 'Softens or balances what you are saying.',
      },
    ],
    question: {
      prompt: 'How much does each person pay?',
      options: ['About £16', 'About £60', 'About £600'],
      correctIndex: 1,
    },
  },
  {
    id: 'podcast-opinion',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'A podcast debate',
    context: 'Two hosts discuss the four-day working week',
    level: 'B2',
    duration: '45 sec',
    accent: 'Contemporary podcast English',
    icon: 'podcast',
    lines: [
      {
        speaker: 'Host A',
        text: 'So, the four-day week. Game changer or overhyped?',
        translation: 'Is the four-day week transformative, or exaggerated?',
      },
      {
        speaker: 'Host B',
        text: 'Honestly? It’s a game changer for some industries, but I wouldn’t go so far as to say it works everywhere.',
        translation: 'It is transformative for some industries, but not for all.',
      },
      {
        speaker: 'Host A',
        text: 'Right, like hospitals can’t just close on Fridays.',
        translation: 'For example, hospitals cannot simply close one day a week.',
      },
      {
        speaker: 'Host B',
        text: 'Exactly. Having said that, the trials we’ve seen so far are pretty promising.',
        translation: 'However, the results of the trials so far look good.',
      },
    ],
    phrases: [
      {
        heard: 'Game changer',
        meaning: 'Something that transforms a situation. A modern, widely used idiom.',
      },
      {
        heard: 'overhyped',
        meaning: 'Praised more than it deserves. Common in tech and media conversation.',
      },
      {
        heard: 'I wouldn’t go so far as to say',
        plain: 'I don’t fully agree that',
        meaning: 'Politely limits an extreme claim.',
      },
    ],
    question: {
      prompt: 'What is Host B’s view?',
      options: [
        'Useful in some industries, not everywhere',
        'It works for every job',
        'A complete failure',
      ],
      correctIndex: 0,
    },
  },
  {
    id: 'doctor-en',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'At the GP',
    context: 'Checking in for an appointment',
    level: 'A2',
    duration: '30 sec',
    accent: 'Everyday British English',
    icon: 'stethoscope',
    lines: [
      {
        speaker: 'Receptionist',
        text: 'Morning! Have you got an appointment?',
        translation: 'Good morning. Do you have an appointment?',
      },
      {
        speaker: 'Patient',
        text: 'Yes, at ten past nine. It’s under Ahmed.',
        translation: 'Yes, at 9:10, booked in the name Ahmed.',
      },
      {
        speaker: 'Receptionist',
        text: 'Lovely, take a seat. The doctor’s running about ten minutes behind.',
        translation: 'Great, please sit down. The doctor is about ten minutes late.',
      },
      {
        speaker: 'Patient',
        text: 'No worries. Is there any water?',
        translation: 'That’s fine. Is there any water?',
      },
      {
        speaker: 'Receptionist',
        text: 'There’s a machine just by the door.',
        translation: 'There is a water machine next to the door.',
      },
    ],
    phrases: [
      {
        heard: 'It’s under Ahmed.',
        plain: 'It is booked in the name Ahmed.',
        meaning: 'The usual way to give the name a booking is under.',
      },
      {
        heard: 'running about ten minutes behind',
        plain: 'about ten minutes late',
        meaning: 'Behind schedule. You will hear it about doctors, trains and meetings.',
      },
      {
        heard: 'take a seat',
        plain: 'please sit down',
        meaning: 'A polite instruction in waiting rooms and offices.',
      },
    ],
    question: {
      prompt: 'How late is the doctor?',
      options: ['About 10 minutes', 'About 30 minutes', 'On time'],
      correctIndex: 0,
    },
  },
  {
    id: 'job-chat-en',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'How’s the new job?',
    context: 'Two friends catch up about work',
    level: 'B1',
    duration: '35 sec',
    accent: 'Casual British speech',
    icon: 'office-building-outline',
    lines: [
      { speaker: 'Leah', text: 'So how’s the new job going?', translation: 'How is the new job?' },
      {
        speaker: 'Ravi',
        text: 'Honestly? It’s a bit full-on, but I’m enjoying it.',
        translation: 'It is very intense, but I like it.',
      },
      { speaker: 'Leah', text: 'Full-on how?', translation: 'In what way is it intense?' },
      {
        speaker: 'Ravi',
        text: 'Loads of meetings, and I’m still getting my head round all the systems.',
        translation: 'There are many meetings, and I am still learning how the systems work.',
      },
      {
        speaker: 'Leah',
        text: 'That’s normal. Give it a couple of months and it’ll all click.',
        translation: 'That is normal. In a few months you will understand everything.',
      },
    ],
    phrases: [
      {
        heard: 'full-on',
        plain: 'very intense',
        meaning: 'Informal and very common: intense, very busy.',
      },
      {
        heard: 'getting my head round',
        plain: 'learning to understand',
        meaning: 'Informal British English for slowly understanding something complicated.',
      },
      {
        heard: 'it’ll all click',
        plain: 'you will suddenly understand it',
        meaning: 'Something suddenly becomes clear.',
      },
    ],
    question: {
      prompt: 'How does Ravi feel about the job?',
      options: ['Busy but enjoying it', 'Bored', 'He wants to leave'],
      correctIndex: 0,
    },
  },
  {
    id: 'ielts-lecture',
    track: 'EN',
    language: 'en-GB',
    languageName: 'English',
    title: 'A short lecture',
    context: 'Green roofs, in the style of IELTS Listening Part 4',
    level: 'B2',
    duration: '50 sec',
    accent: 'Academic lecture',
    icon: 'school-outline',
    lines: [
      {
        speaker: 'Lecturer',
        text: 'Today I’d like to look at why some cities are putting plants and trees on rooftops.',
        translation: 'The topic is green roofs in cities.',
      },
      {
        speaker: 'Lecturer',
        text: 'The first reason is temperature. Green roofs can make buildings noticeably cooler in summer.',
        translation: 'Reason one: they keep buildings cooler.',
      },
      {
        speaker: 'Lecturer',
        text: 'Secondly, they absorb rainwater, which reduces pressure on drains during heavy storms.',
        translation: 'Reason two: they reduce the load on drains.',
      },
      {
        speaker: 'Lecturer',
        text: 'However, they’re not cheap. The roof has to be strong enough to carry the extra weight.',
        translation: 'A disadvantage: they are expensive, and the roof must be strong.',
      },
      {
        speaker: 'Lecturer',
        text: 'So for the rest of the session, we’ll compare two cities that have tried this approach.',
        translation: 'Next, two cities will be compared.',
      },
    ],
    phrases: [
      {
        heard: 'The first reason is',
        meaning:
          'Signposting: lecturers announce their structure. Listen for “Secondly” and “However” next.',
      },
      {
        heard: 'noticeably cooler',
        plain: 'clearly cooler',
        meaning: 'A careful but clear claim: the difference is easy to notice.',
      },
      {
        heard: 'However,',
        meaning: 'A contrast is coming. Exam answers often follow a contrast word.',
      },
    ],
    question: {
      prompt: 'Which disadvantage does the lecturer mention?',
      options: [
        'They are expensive and need strong roofs',
        'They make buildings hotter',
        'They increase flooding',
      ],
      correctIndex: 0,
    },
  },
  {
    id: 'bakery-morning',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'At the bakery',
    context: 'A quick order before work',
    level: 'A2',
    duration: '45 sec',
    accent: 'Everyday German',
    icon: 'food-croissant',
    lines: [
      {
        speaker: 'Verkäuferin',
        text: 'Morgen! Was darf’s sein?',
        translation: 'Morning! What can I get you?',
      },
      {
        speaker: 'Kundin',
        text: 'Zwei normale Brötchen, bitte.',
        translation: 'Two regular bread rolls, please.',
      },
      { speaker: 'Verkäuferin', text: 'Sonst noch was?', translation: 'Anything else?' },
      {
        speaker: 'Kundin',
        text: 'Nee, das war’s. Kann ich mit Karte zahlen?',
        translation: 'No, that’s it. Can I pay by card?',
      },
      {
        speaker: 'Verkäuferin',
        text: 'Klar, einfach hier dranhalten.',
        translation: 'Sure, just tap it here.',
      },
    ],
    phrases: [
      { heard: 'Morgen!', plain: 'Guten Morgen!', meaning: 'The everyday short greeting.' },
      {
        heard: 'Was darf’s sein?',
        plain: 'Was darf es sein?',
        meaning: 'What can I get you? The standard question at a bakery counter.',
      },
      {
        heard: 'Sonst noch was?',
        plain: 'Sonst noch etwas?',
        meaning: 'Anything else? In speech, etwas is usually just was.',
      },
      {
        heard: 'Nee, das war’s.',
        plain: 'Nein, das war alles.',
        meaning: 'Common spoken German for “no, that’s it.”',
      },
    ],
    question: {
      prompt: 'What does the cashier tell you to do?',
      options: ['Insert the card', 'Tap the card here', 'Pay at another counter'],
      correctIndex: 1,
    },
  },
  {
    id: 'train-delay',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'Train announcement',
    context: 'Your platform changes suddenly',
    level: 'B1',
    duration: '35 sec',
    accent: 'Station audio',
    icon: 'train',
    lines: [
      {
        speaker: 'Ansage',
        text: 'Achtung auf Gleis sieben.',
        translation: 'Attention on platform seven.',
      },
      {
        speaker: 'Ansage',
        text: 'Der Regionalexpress nach Köln hat heute circa zehn Minuten Verspätung.',
        translation: 'The regional express to Cologne is about ten minutes late today.',
      },
      {
        speaker: 'Ansage',
        text: 'Die Abfahrt erfolgt abweichend von Gleis neun.',
        translation: 'The train will depart from platform nine instead.',
      },
    ],
    phrases: [
      {
        heard: 'zehn Minuten Verspätung',
        meaning: 'Verspätung means delay. You will hear it in almost every announcement.',
      },
      {
        heard: 'circa zehn Minuten',
        plain: 'ungefähr zehn Minuten',
        meaning: 'Announcements say circa; people usually say ungefähr.',
      },
      {
        heard: 'Die Abfahrt erfolgt abweichend von Gleis neun.',
        plain: 'Der Zug fährt heute von Gleis neun ab.',
        meaning: 'Typical station language: the train leaves from a different platform, nine.',
      },
    ],
    question: {
      prompt: 'Where will the train now leave from?',
      options: ['Platform 7', 'Platform 9', 'Platform 10'],
      correctIndex: 1,
    },
  },
  {
    id: 'landlord-call',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'Call from a landlord',
    context: 'A fast voicemail about a flat',
    level: 'B1',
    duration: '50 sec',
    accent: 'Casual phone speech',
    icon: 'home-city-outline',
    lines: [
      {
        speaker: 'Vermieter',
        text: 'Hallo, ich meld mich wegen der Wohnung.',
        translation: 'Hello, I’m getting in touch about the flat.',
      },
      {
        speaker: 'Vermieter',
        text: 'Die wär ab nächstem Monat frei.',
        translation: 'It would be available from next month.',
      },
      {
        speaker: 'Vermieter',
        text: 'Wenn Sie noch Interesse haben, rufen Sie mich einfach kurz zurück.',
        translation: 'If you’re still interested, just give me a quick call back.',
      },
    ],
    phrases: [
      {
        heard: 'ich meld mich',
        plain: 'ich melde mich',
        meaning: 'The final e is often dropped in casual speech.',
      },
      {
        heard: 'Die wär ab nächstem Monat frei.',
        plain: 'Die Wohnung wäre ab nächstem Monat frei.',
        meaning:
          'Die means the flat; the subject and ending are shortened because the context is clear.',
      },
      {
        heard: 'rufen Sie mich einfach kurz zurück',
        meaning:
          'Einfach and kurz make the request light and easy: just give me a quick call back.',
      },
    ],
    question: {
      prompt: 'When is the flat available?',
      options: ['Immediately', 'Next month', 'In three months'],
      correctIndex: 1,
    },
  },
  {
    id: 'arzt-termin',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'Calling the doctor',
    context: 'Getting an appointment at a busy practice',
    level: 'A2',
    duration: '45 sec',
    accent: 'Phone speech',
    icon: 'stethoscope',
    lines: [
      {
        speaker: 'Praxis',
        text: 'Praxis Doktor Yilmaz, Schneider am Apparat, guten Tag.',
        translation: 'Dr Yilmaz’s practice, Schneider speaking, hello.',
      },
      {
        speaker: 'Patient',
        text: 'Hallo, hier ist Amir Rahimi. Ich bräuchte einen Termin, ich hab seit Montag Fieber.',
        translation:
          'Hello, this is Amir Rahimi. I need an appointment; I’ve had a fever since Monday.',
      },
      {
        speaker: 'Praxis',
        text: 'Heute ist leider alles voll. Morgen um Viertel nach acht ginge noch.',
        translation:
          'Unfortunately today is fully booked. Tomorrow at quarter past eight is still free.',
      },
      {
        speaker: 'Patient',
        text: 'Viertel nach acht, das passt. Soll ich was mitbringen?',
        translation: 'Quarter past eight works. Should I bring anything?',
      },
      {
        speaker: 'Praxis',
        text: 'Ja, Ihre Versichertenkarte, bitte.',
        translation: 'Yes, your health insurance card, please.',
      },
    ],
    phrases: [
      { heard: 'am Apparat', meaning: '“Speaking”, when someone answers the phone at work.' },
      {
        heard: 'Ich bräuchte einen Termin',
        plain: 'Ich brauche einen Termin',
        meaning: 'The Konjunktiv II form makes a request sound polite.',
      },
      {
        heard: 'ich hab seit Montag Fieber',
        plain: 'ich habe seit Montag Fieber',
        meaning: 'Hab is habe without the final e, normal in speech.',
      },
      {
        heard: 'ginge noch',
        plain: 'wäre noch möglich',
        meaning: 'Would still be possible: the receptionist offers a free slot.',
      },
    ],
    question: {
      prompt: 'When is the appointment?',
      options: ['Today at 8:15', 'Tomorrow at 8:15', 'Tomorrow at 7:45'],
      correctIndex: 1,
    },
  },
  {
    id: 'wg-kueche',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'Flatmates in the kitchen',
    context: 'A casual chat full of particles and short forms',
    level: 'B1',
    duration: '40 sec',
    accent: 'Casual young speech',
    icon: 'account-group-outline',
    lines: [
      {
        speaker: 'Lena',
        text: 'Na, haste Hunger? Ich mach grad Nudeln.',
        translation: 'Hey, are you hungry? I’m just making pasta.',
      },
      {
        speaker: 'Jonas',
        text: 'Oh, echt? Da sag ich nicht nein. Soll ich was helfen?',
        translation: 'Oh, really? I won’t say no. Can I help with something?',
      },
      {
        speaker: 'Lena',
        text: 'Kannste mal die Zwiebeln schneiden? Die liegen da hinten.',
        translation: 'Could you chop the onions? They’re over there.',
      },
      {
        speaker: 'Jonas',
        text: 'Klar. Ach, und denk dran, morgen ist Mülltag.',
        translation: 'Sure. Oh, and remember, tomorrow is bin day.',
      },
      {
        speaker: 'Lena',
        text: 'Ja, ja, ich weiß. Ich bring ihn nachher raus.',
        translation: 'Yes, yes, I know. I’ll take it out later.',
      },
    ],
    phrases: [
      {
        heard: 'haste',
        plain: 'hast du',
        meaning: 'Du merges into the verb in fast, casual speech.',
      },
      {
        heard: 'Ich mach grad Nudeln.',
        plain: 'Ich mache gerade Nudeln.',
        meaning: 'I’m just making pasta. Mach and grad are shortened.',
      },
      {
        heard: 'Kannste mal',
        plain: 'Kannst du mal',
        meaning: 'Mal makes a request softer and more casual.',
      },
      { heard: 'Da sag ich nicht nein.', meaning: 'A warm, casual yes: I won’t say no.' },
    ],
    question: {
      prompt: 'What does Jonas remind Lena about?',
      options: ['Tomorrow is bin day', 'Buying onions', 'Paying the rent'],
      correctIndex: 0,
    },
  },
  {
    id: 'feierabend-chat',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'After-work plans',
    context: 'Colleagues chat as they leave the office',
    level: 'B1',
    duration: '35 sec',
    accent: 'Workplace small talk',
    icon: 'office-building-outline',
    lines: [
      {
        speaker: 'Aylin',
        text: 'So, Feierabend! Hast du heute noch was vor?',
        translation: 'Right, work’s over! Any plans for tonight?',
      },
      {
        speaker: 'Tim',
        text: 'Nicht wirklich. Vielleicht geh ich noch kurz zum Sport. Und du?',
        translation: 'Not really. Maybe I’ll go to the gym for a bit. And you?',
      },
      {
        speaker: 'Aylin',
        text: 'Ein paar Leute treffen sich im Biergarten. Komm doch mit!',
        translation: 'A few people are meeting at the beer garden. Why don’t you come along?',
      },
      {
        speaker: 'Tim',
        text: 'Hm, eigentlich wollte ich früh ins Bett. Na gut, auf ein Bier.',
        translation: 'Hmm, I actually wanted an early night. Oh, all right, for one beer.',
      },
    ],
    phrases: [
      {
        heard: 'Hast du heute noch was vor?',
        plain: 'Hast du heute noch etwas vor?',
        meaning: 'Any plans for later? Was is short for etwas.',
      },
      {
        heard: 'geh ich noch kurz zum Sport',
        plain: 'gehe ich noch kurz zum Sport',
        meaning: 'Geh is gehe without the final e; zum Sport often means the gym.',
      },
      { heard: 'Komm doch mit!', meaning: 'Doch makes it a friendly nudge: come on, join us!' },
      { heard: 'Na gut', meaning: 'Reluctant agreement: oh, all right.' },
    ],
    question: {
      prompt: 'What does Tim decide?',
      options: ['To join for one drink', 'To go to the gym', 'To go straight to bed'],
      correctIndex: 0,
    },
  },
  {
    id: 'erster-tag',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'My first day at the course',
    context: 'A slow, simple story',
    level: 'A1',
    duration: '40 sec',
    accent: 'Clear, slow German',
    icon: 'book-open-variant',
    lines: [
      {
        speaker: 'Maria',
        text: 'Hallo! Ich heiße Maria und ich komme aus Brasilien.',
        translation: 'Hello! My name is Maria and I come from Brazil.',
      },
      {
        speaker: 'Maria',
        text: 'Ich wohne jetzt in Leipzig.',
        translation: 'I live in Leipzig now.',
      },
      {
        speaker: 'Maria',
        text: 'Heute ist mein erster Tag im Deutschkurs.',
        translation: 'Today is my first day in the German course.',
      },
      {
        speaker: 'Maria',
        text: 'Der Kurs beginnt um neun Uhr.',
        translation: 'The course starts at nine o’clock.',
      },
      {
        speaker: 'Maria',
        text: 'Im Kurs sind zwölf Leute. Die Lehrerin heißt Frau Schulz.',
        translation: 'There are twelve people in the course. The teacher is called Frau Schulz.',
      },
      {
        speaker: 'Maria',
        text: 'Sie spricht langsam und ist sehr nett.',
        translation: 'She speaks slowly and is very nice.',
      },
    ],
    phrases: [
      {
        heard: 'Ich wohne jetzt in Leipzig.',
        meaning: 'Jetzt means now: she has moved to Leipzig.',
      },
      {
        heard: 'Der Kurs beginnt um neun Uhr.',
        meaning: 'Um + time means at. In everyday speech you also hear: Der Kurs fängt um neun an.',
      },
      {
        heard: 'Sie spricht langsam',
        meaning: 'Sie with a singular verb (spricht) means she. With a plural verb it means they.',
      },
    ],
    question: {
      prompt: 'How many people are in the course?',
      options: ['Nine', 'Twelve', 'Two'],
      correctIndex: 1,
    },
  },
  {
    id: 'markt',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'At the market',
    context: 'Buying fruit and vegetables',
    level: 'A1',
    duration: '35 sec',
    accent: 'Everyday German',
    icon: 'basket-outline',
    lines: [
      {
        speaker: 'Verkäufer',
        text: 'Guten Tag! Was möchten Sie?',
        translation: 'Hello! What would you like?',
      },
      {
        speaker: 'Kundin',
        text: 'Ich hätte gern ein Kilo Tomaten, bitte.',
        translation: 'I would like a kilo of tomatoes, please.',
      },
      {
        speaker: 'Verkäufer',
        text: 'Gern. Sonst noch etwas?',
        translation: 'Sure. Anything else?',
      },
      {
        speaker: 'Kundin',
        text: 'Ja, drei Äpfel. Was kostet das zusammen?',
        translation: 'Yes, three apples. How much is that altogether?',
      },
      {
        speaker: 'Verkäufer',
        text: 'Das macht vier Euro zwanzig.',
        translation: 'That comes to four euros twenty.',
      },
      {
        speaker: 'Kundin',
        text: 'Hier, bitte. Danke und tschüss!',
        translation: 'Here you are. Thanks, bye!',
      },
    ],
    phrases: [
      {
        heard: 'Was möchten Sie?',
        meaning: 'The polite question at a stall or counter: what would you like?',
      },
      { heard: 'Ich hätte gern', meaning: 'The most common polite way to order: I would like …' },
      {
        heard: 'Das macht vier Euro zwanzig.',
        meaning: 'That comes to €4.20. Prices are said as euros, then cents.',
      },
    ],
    question: {
      prompt: 'How much does the customer pay?',
      options: ['€4.20', '€2.40', '€14.20'],
      correctIndex: 0,
    },
  },
  {
    id: 'wochenende-tom',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'Tom’s weekend',
    context: 'A short story about a weekend routine',
    level: 'A1',
    duration: '40 sec',
    accent: 'Clear, slow German',
    icon: 'home-city-outline',
    lines: [
      {
        speaker: 'Tom',
        text: 'Am Samstag schlafe ich lange.',
        translation: 'On Saturday I sleep in.',
      },
      {
        speaker: 'Tom',
        text: 'Dann frühstücke ich mit meiner Freundin.',
        translation: 'Then I have breakfast with my girlfriend.',
      },
      {
        speaker: 'Tom',
        text: 'Am Nachmittag spielen wir Tennis.',
        translation: 'In the afternoon we play tennis.',
      },
      {
        speaker: 'Tom',
        text: 'Am Sonntag besuche ich meine Eltern. Sie wohnen in Hamburg.',
        translation: 'On Sunday I visit my parents. They live in Hamburg.',
      },
      {
        speaker: 'Tom',
        text: 'Am Abend koche ich und lese ein Buch.',
        translation: 'In the evening I cook and read a book.',
      },
    ],
    phrases: [
      {
        heard: 'Am Samstag schlafe ich lange.',
        meaning:
          'Lange schlafen means to sleep in. The time comes first, so the verb comes second: schlafe ich.',
      },
      {
        heard: 'mit meiner Freundin',
        meaning:
          'Meine Freundin usually means my girlfriend. For a friend, people often say eine Freundin von mir.',
      },
      { heard: 'Sie wohnen in Hamburg.', meaning: 'Sie with a plural verb (wohnen) means they.' },
    ],
    question: {
      prompt: 'What does Tom do on Sunday?',
      options: ['He plays tennis', 'He visits his parents', 'He sleeps in'],
      correctIndex: 1,
    },
  },
  {
    id: 'arbeitsweg',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'A chaotic morning',
    context: 'Someone explains why they were late',
    level: 'A2',
    duration: '40 sec',
    accent: 'Everyday German',
    icon: 'train',
    lines: [
      {
        speaker: 'Sara',
        text: 'Heute Morgen war alles chaotisch.',
        translation: 'This morning everything was chaotic.',
      },
      {
        speaker: 'Sara',
        text: 'Mein Wecker hat nicht geklingelt, und ich bin zu spät aufgestanden.',
        translation: 'My alarm didn’t go off, and I got up too late.',
      },
      {
        speaker: 'Sara',
        text: 'Dann ist auch noch die S-Bahn ausgefallen.',
        translation: 'Then the S-Bahn was cancelled as well.',
      },
      {
        speaker: 'Sara',
        text: 'Ich habe meinem Chef geschrieben, dass ich später komme.',
        translation: 'I messaged my boss that I would be late.',
      },
      {
        speaker: 'Sara',
        text: 'Zum Glück hat er gesagt: „Kein Problem, das passiert.“',
        translation: 'Luckily he said: “No problem, it happens.”',
      },
    ],
    phrases: [
      {
        heard: 'Mein Wecker hat nicht geklingelt',
        meaning: 'My alarm didn’t go off. In speech, the past is usually the perfect tense.',
      },
      { heard: 'auch noch', meaning: 'On top of that: something else went wrong too.' },
      {
        heard: 'ausgefallen',
        meaning: 'Cancelled. You will hear it for trains, classes and meetings.',
      },
      { heard: 'Zum Glück', meaning: 'Luckily. Much more common in speech than glücklicherweise.' },
    ],
    question: {
      prompt: 'What happened to the S-Bahn?',
      options: ['It was cancelled', 'It was early', 'It was full'],
      correctIndex: 0,
    },
  },
  {
    id: 'nachbarin',
    track: 'DE',
    language: 'de-DE',
    languageName: 'German',
    title: 'A neighbour at the door',
    context: 'A polite complaint about noise',
    level: 'B1',
    duration: '45 sec',
    accent: 'Polite everyday German',
    icon: 'home-city-outline',
    lines: [
      {
        speaker: 'Nachbarin',
        text: 'Entschuldigen Sie die Störung. Ich wohne direkt unter Ihnen.',
        translation: 'Sorry to bother you. I live right below you.',
      },
      {
        speaker: 'Mieter',
        text: 'Ah, hallo! Ist etwas passiert?',
        translation: 'Oh, hello! Has something happened?',
      },
      {
        speaker: 'Nachbarin',
        text: 'Es ist nur so, dass es abends oft ziemlich laut ist. Ich muss morgens sehr früh aufstehen.',
        translation:
          'It’s just that it is often quite loud in the evenings. I have to get up very early.',
      },
      {
        speaker: 'Mieter',
        text: 'Oh, das tut mir leid, das war mir nicht bewusst. Wir achten ab jetzt darauf.',
        translation: 'Oh, I’m sorry, I wasn’t aware. We’ll be careful from now on.',
      },
      {
        speaker: 'Nachbarin',
        text: 'Das wäre sehr nett. Vielen Dank für Ihr Verständnis!',
        translation: 'That would be very kind. Thank you for understanding!',
      },
    ],
    phrases: [
      {
        heard: 'Entschuldigen Sie die Störung.',
        meaning: 'Sorry to bother you. A polite opener with people you do not know well.',
      },
      {
        heard: 'Es ist nur so, dass',
        meaning: 'A soft way to start a complaint: it’s just that …',
      },
      {
        heard: 'das war mir nicht bewusst',
        plain: 'das wusste ich nicht',
        meaning: 'I wasn’t aware of that. A polite way to admit a problem.',
      },
    ],
    question: {
      prompt: 'Why is the neighbour at the door?',
      options: ['It is often loud in the evenings', 'She needs a parcel', 'She is moving out'],
      correctIndex: 0,
    },
  },
  {
    id: 'es-first-meeting',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'A first meeting',
    context: 'Introduce yourself and ask a question back',
    level: 'A1',
    duration: '25 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'account-group-outline',
    lines: [
      {
        speaker: 'Ana',
        text: '¡Hola! Soy Ana. ¿Cómo te llamas?',
        translation: 'Hi! I’m Ana. What’s your name?',
      },
      { speaker: 'Omar', text: 'Omar. Mucho gusto.', translation: 'Omar. Nice to meet you.' },
      {
        speaker: 'Ana',
        text: 'Igualmente. ¿Y de dónde eres?',
        translation: 'Likewise. And where are you from?',
      },
      {
        speaker: 'Omar',
        text: 'De Pakistán, pero vivo aquí, en la Ciudad de México.',
        translation: 'From Pakistan, but I live here, in Mexico City.',
      },
      {
        speaker: 'Ana',
        text: '¡Ah, mira! ¿Y te gusta?',
        translation: 'Oh, nice! And do you like it?',
      },
      {
        speaker: 'Omar',
        text: 'Sí, me encanta. Bueno, menos el tráfico.',
        translation: 'Yes, I love it. Well, except the traffic.',
      },
    ],
    phrases: [
      {
        heard: 'Soy Ana.',
        plain: 'Me llamo Ana.',
        meaning: 'The quickest everyday way to say your name. Me llamo Ana is also correct.',
      },
      {
        heard: 'Omar.',
        plain: 'Me llamo Omar.',
        meaning: 'A one-word answer is normal: the question already says what it is about.',
      },
      {
        heard: '¡Ah, mira!',
        meaning: 'Oh, nice! A reaction to something interesting. Here mira does not mean “look”.',
      },
      { heard: 'menos el tráfico', meaning: 'Menos here means except.' },
    ],
    question: {
      prompt: 'Where does Omar live now?',
      options: ['In Pakistan', 'In Mexico City', 'In Spain'],
      correctIndex: 1,
    },
  },
  {
    id: 'es-cafe-order',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'A quick café order',
    context: 'Order a drink, change your mind and pay',
    level: 'A1',
    duration: '35 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'coffee-outline',
    lines: [
      {
        speaker: 'Barista',
        text: 'Buenos días. ¿Qué le preparo?',
        translation: 'Good morning. What can I make you?',
      },
      {
        speaker: 'Cliente',
        text: 'Un americano, por favor. Bueno, no, mejor un capuchino.',
        translation: 'An americano, please. Well, no, a cappuccino instead.',
      },
      {
        speaker: 'Barista',
        text: 'Claro. ¿Para aquí o pa’ llevar?',
        translation: 'Sure. For here or to take away?',
      },
      {
        speaker: 'Cliente',
        text: 'Para llevar. ¿Cuánto es?',
        translation: 'To take away. How much is it?',
      },
      {
        speaker: 'Barista',
        text: 'Son sesenta y cinco pesos. ¿Con tarjeta o en efectivo?',
        translation: 'It’s sixty-five pesos. Card or cash?',
      },
      { speaker: 'Cliente', text: 'Con tarjeta, por favor.', translation: 'By card, please.' },
    ],
    phrases: [
      {
        heard: 'mejor un capuchino',
        meaning: 'Mejor + what you want is how you change your mind: actually, make it a …',
      },
      {
        heard: '¿Para aquí o pa’ llevar?',
        plain: '¿Para comer aquí o para llevar?',
        meaning: 'For here or to take away? In fast speech para often shrinks to pa’.',
      },
      {
        heard: '¿Con tarjeta o en efectivo?',
        plain: '¿Va a pagar con tarjeta o en efectivo?',
        meaning: 'Card or cash? The verb is dropped because the situation makes it clear.',
      },
    ],
    question: {
      prompt: 'What does the customer order in the end?',
      options: ['An americano', 'A cappuccino', 'A coffee with milk'],
      correctIndex: 1,
    },
  },
  {
    id: 'es-find-bus',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'Find the right bus',
    context: 'Check where a bus goes and when the next one comes',
    level: 'A1',
    duration: '30 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'bus',
    lines: [
      {
        speaker: 'Viajera',
        text: 'Disculpe, ¿este camión va al centro?',
        translation: 'Excuse me, does this bus go downtown?',
      },
      { speaker: 'Chofer', text: '¿Mande?', translation: 'Sorry?' },
      { speaker: 'Viajera', text: '¿Va al centro?', translation: 'Does it go downtown?' },
      {
        speaker: 'Chofer',
        text: 'No, este no. Tome el siguiente, el azul.',
        translation: 'No, not this one. Take the next one, the blue one.',
      },
      { speaker: 'Viajera', text: '¿Y tarda mucho?', translation: 'And will it be long?' },
      {
        speaker: 'Chofer',
        text: 'No, ahorita pasa. Pasa cada diez minutos.',
        translation: 'No, it’ll be here any minute. It comes every ten minutes.',
      },
    ],
    phrases: [
      {
        heard: 'camión',
        meaning: 'In Mexico a city bus is usually el camión. Autobús is understood everywhere.',
      },
      {
        heard: '¿Mande?',
        meaning: 'Sorry? The polite Mexican way to ask someone to repeat. It is not rude at all.',
      },
      {
        heard: 'ahorita pasa',
        meaning: 'Ahorita can mean right now, in a moment or much later. Here: any minute.',
      },
    ],
    question: {
      prompt: 'Which bus should she take?',
      options: ['This one', 'The next one, the blue one', 'The one in an hour'],
      correctIndex: 1,
    },
  },
  {
    id: 'es-hotel-key',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'The hotel key',
    context: 'Report a problem and get help',
    level: 'A1',
    duration: '30 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'home-city-outline',
    lines: [
      {
        speaker: 'Huésped',
        text: 'Buenas noches. Disculpe, mi llave no funciona.',
        translation: 'Good evening. Excuse me, my key does not work.',
      },
      {
        speaker: 'Recepcionista',
        text: '¡Ay, perdón! ¿Qué habitación es?',
        translation: 'Oh, sorry! Which room is it?',
      },
      { speaker: 'Huésped', text: 'La doscientos cuatro.', translation: 'Two hundred and four.' },
      {
        speaker: 'Recepcionista',
        text: 'A ver… Listo. Aquí tiene una nueva.',
        translation: 'Let’s see… Done. Here is a new one.',
      },
      { speaker: 'Huésped', text: 'Muchas gracias.', translation: 'Thank you very much.' },
      {
        speaker: 'Recepcionista',
        text: 'De nada. Que descanse.',
        translation: 'You’re welcome. Sleep well.',
      },
    ],
    phrases: [
      {
        heard: 'La doscientos cuatro.',
        plain: 'Es la habitación doscientos cuatro.',
        meaning: 'Room numbers are feminine, like habitación: la doscientos cuatro.',
      },
      {
        heard: 'A ver…',
        plain: 'Vamos a ver.',
        meaning: 'Let’s see… What people say while they check something.',
      },
      { heard: 'Listo.', meaning: 'Done, ready. Very common when a task is finished.' },
      {
        heard: 'Que descanse.',
        meaning: 'Sleep well. A warm goodbye in the evening; with tú it is que descanses.',
      },
    ],
    question: {
      prompt: 'What does the receptionist give the guest?',
      options: ['A new room', 'A new key', 'A free breakfast'],
      correctIndex: 1,
    },
  },
  {
    id: 'es-market-stall',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'At the market stall',
    context: 'Ask for quantities and pay',
    level: 'A1',
    duration: '30 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'basket-outline',
    lines: [
      { speaker: 'Vendedor', text: '¿Qué le damos, joven?', translation: 'What can we get you?' },
      {
        speaker: 'Cliente',
        text: '¿Me da un kilo de jitomate y dos aguacates?',
        translation: 'Can I have a kilo of tomatoes and two avocados?',
      },
      {
        speaker: 'Vendedor',
        text: '¿Los aguacates para hoy o para mañana?',
        translation: 'Are the avocados for today or for tomorrow?',
      },
      {
        speaker: 'Cliente',
        text: 'Para hoy, por favor. Es todo. ¿Cuánto le debo?',
        translation: 'For today, please. That’s all. How much do I owe you?',
      },
      { speaker: 'Vendedor', text: 'Son ochenta pesos.', translation: 'That’s eighty pesos.' },
    ],
    phrases: [
      {
        heard: '¿Qué le damos, joven?',
        meaning:
          'What can we get you? Market sellers call customers joven (young one), whatever their age.',
      },
      {
        heard: 'para hoy o para mañana',
        meaning:
          'Sellers ask when you will eat avocados, so they can give you ripe ones or firmer ones.',
      },
      {
        heard: '¿Cuánto le debo?',
        meaning: 'Literally “how much do I owe you?”: the usual way to ask for the total.',
      },
    ],
    question: {
      prompt: 'How much does the customer pay?',
      options: ['18 pesos', '80 pesos', '90 pesos'],
      correctIndex: 1,
    },
  },
  {
    id: 'es-weekend-plan',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'Making weekend plans',
    context: 'Two friends agree on a time and place',
    level: 'A1',
    duration: '30 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'phone-outline',
    lines: [
      { speaker: 'Diego', text: '¿Bueno?', translation: 'Hello?' },
      { speaker: 'Lucía', text: '¡Hola, Diego! ¿Qué onda?', translation: 'Hi, Diego! What’s up?' },
      { speaker: 'Diego', text: '¡Qué onda, Lucía!', translation: 'Hey, Lucía!' },
      {
        speaker: 'Lucía',
        text: 'Oye, ¿nos vemos el sábado?',
        translation: 'Hey, shall we meet on Saturday?',
      },
      { speaker: 'Diego', text: 'Va. ¿A qué hora?', translation: 'Sure. What time?' },
      {
        speaker: 'Lucía',
        text: '¿Como a las cinco, en el café del parque?',
        translation: 'Around five, at the café in the park?',
      },
      { speaker: 'Diego', text: 'Sale, ahí nos vemos.', translation: 'Deal, see you there.' },
    ],
    phrases: [
      { heard: '¿Bueno?', meaning: 'Hello? How many people in Mexico answer the phone.' },
      {
        heard: '¿Qué onda?',
        meaning: 'What’s up? A very common greeting between friends in Mexico.',
      },
      {
        heard: 'Como a las cinco',
        plain: 'Más o menos a las cinco',
        meaning: 'Como before a time means around.',
      },
      { heard: 'Sale', meaning: 'Deal, OK. Like va, it closes a plan between friends.' },
    ],
    question: {
      prompt: 'When will they meet?',
      options: ['On Saturday, around five', 'On Sunday, around five', 'On Saturday, around nine'],
      correctIndex: 0,
    },
  },
  {
    id: 'es-monday-chat',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'How was your weekend?',
    context: 'Colleagues chat about the weekend',
    level: 'A2',
    duration: '35 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'office-building-outline',
    lines: [
      {
        speaker: 'Mariana',
        text: '¿Qué onda, Raúl? ¿Qué hiciste el fin?',
        translation: 'Hey, Raúl. What did you do at the weekend?',
      },
      {
        speaker: 'Raúl',
        text: 'Me fui a Puebla con mi familia. Comimos un mole buenísimo.',
        translation: 'I went to Puebla with my family. We had amazing mole.',
      },
      {
        speaker: 'Mariana',
        text: '¡Qué padre! ¿Y el domingo?',
        translation: 'How cool! And on Sunday?',
      },
      {
        speaker: 'Raúl',
        text: 'Nada, me quedé en casa. Estaba muerto. ¿Y tú?',
        translation: 'Nothing, I stayed at home. I was exhausted. And you?',
      },
      {
        speaker: 'Mariana',
        text: 'Yo vi una peli. Nada especial, pero estuvo bien.',
        translation: 'I watched a film. Nothing special, but it was nice.',
      },
    ],
    phrases: [
      {
        heard: 'el fin',
        plain: 'el fin de semana',
        meaning: 'The weekend. Friends often shorten it.',
      },
      {
        heard: '¡Qué padre!',
        meaning: 'How cool! Informal Mexican reaction; padre here has nothing to do with fathers.',
      },
      {
        heard: 'Estaba muerto.',
        plain: 'Estaba muy cansado.',
        meaning: 'I was exhausted. Muerto means very tired in casual speech.',
      },
      {
        heard: 'una peli',
        plain: 'una película',
        meaning: 'A film. Peli is the casual short form.',
      },
    ],
    question: {
      prompt: 'What did Raúl do on Sunday?',
      options: ['He went to Puebla', 'He stayed at home', 'He watched a film'],
      correctIndex: 1,
    },
  },
  {
    id: 'es-pharmacy-visit',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'At the pharmacy',
    context: 'Describe symptoms and understand the advice',
    level: 'A2',
    duration: '35 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'stethoscope',
    lines: [
      {
        speaker: 'Farmacéutica',
        text: 'Buenas tardes. ¿En qué le ayudo?',
        translation: 'Good afternoon. How can I help you?',
      },
      {
        speaker: 'Cliente',
        text: 'Buenas. Fíjese que desde ayer tengo tos y me duele la garganta.',
        translation: 'Hello. The thing is, I have had a cough and a sore throat since yesterday.',
      },
      {
        speaker: 'Farmacéutica',
        text: '¿Y tiene fiebre?',
        translation: 'And do you have a temperature?',
      },
      { speaker: 'Cliente', text: 'No, fiebre no.', translation: 'No, no temperature.' },
      {
        speaker: 'Farmacéutica',
        text: 'Mire, tómese este jarabe cada ocho horas. Si en tres días no se le quita, vaya al médico.',
        translation:
          'Look, take this syrup every eight hours. If it has not gone away in three days, see a doctor.',
      },
    ],
    phrases: [
      {
        heard: '¿En qué le ayudo?',
        plain: '¿En qué le puedo ayudar?',
        meaning: 'How can I help you? Shop staff usually drop puedo.',
      },
      { heard: 'Buenas.', plain: 'Buenas tardes.', meaning: 'A short hello at any time of day.' },
      {
        heard: 'Fíjese que',
        meaning:
          'A polite Mexican way to start explaining a problem: the thing is … With tú: fíjate que.',
      },
      {
        heard: 'no se le quita',
        meaning: 'Quitarse is how people talk about pain or a cold going away.',
      },
    ],
    question: {
      prompt: 'When should the customer see a doctor?',
      options: ['If it has not gone away in three days', 'Straight away', 'After eight hours'],
      correctIndex: 0,
    },
  },
  {
    id: 'es-taqueria',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'Tacos with friends',
    context: 'Order, change a dish and split the bill',
    level: 'A2',
    duration: '45 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'food',
    lines: [
      {
        speaker: 'Mesero',
        text: '¿Ya saben qué van a querer?',
        translation: 'Do you know what you would like?',
      },
      {
        speaker: 'Sofía',
        text: 'Sí. Para mí, tres de pastor, pero sin cebolla, porfa.',
        translation: 'Yes. For me, three al pastor tacos, but without onion, please.',
      },
      {
        speaker: 'Mesero',
        text: '¿Nomás con cilantro, entonces?',
        translation: 'Just with coriander, then?',
      },
      { speaker: 'Sofía', text: 'Ándale, sí.', translation: 'That’s it, yes.' },
      {
        speaker: 'Andrés',
        text: 'Y para mí una quesadilla. ¿Qué nos recomienda de tomar?',
        translation: 'And a quesadilla for me. What do you recommend to drink?',
      },
      {
        speaker: 'Mesero',
        text: 'El agua de horchata está muy rica.',
        translation: 'The horchata is really good.',
      },
      {
        speaker: 'Andrés',
        text: 'Va, dos de horchata. Y al final, ¿nos trae la cuenta por separado?',
        translation: 'OK, two horchatas. And at the end, could you bring us separate bills?',
      },
    ],
    phrases: [
      {
        heard: 'tres de pastor',
        plain: 'tres tacos al pastor',
        meaning: 'Tacos is dropped because the place makes it obvious.',
      },
      { heard: 'porfa', plain: 'por favor', meaning: 'Please. Casual and very common.' },
      {
        heard: 'Nomás con cilantro',
        plain: 'Solo con cilantro',
        meaning: 'Nomás means only, just. Very common in Mexico.',
      },
      {
        heard: 'Ándale, sí.',
        meaning: 'That’s it, exactly. Agrees with what the other person just said.',
      },
    ],
    question: {
      prompt: 'What does Sofía not want in her tacos?',
      options: ['Coriander', 'Onion', 'Salsa'],
      correctIndex: 1,
    },
  },
  {
    id: 'es-flight-desk',
    track: 'ES',
    language: 'es-MX',
    languageName: 'Spanish',
    title: 'A cancelled flight',
    context: 'Rebook at the airline desk',
    level: 'A2',
    duration: '40 sec',
    accent: 'Everyday Mexican Spanish',
    icon: 'airplane',
    lines: [
      {
        speaker: 'Pasajero',
        text: 'Disculpe, me acaban de cancelar el vuelo a Guadalajara.',
        translation: 'Excuse me, my flight to Guadalajara has just been cancelled.',
      },
      {
        speaker: 'Agente',
        text: 'Sí, una disculpa. ¿Me permite su pase de abordar?',
        translation: 'Yes, we apologise. May I see your boarding pass?',
      },
      {
        speaker: 'Pasajero',
        text: 'Sí, aquí está. ¿Hay otro vuelo hoy?',
        translation: 'Yes, here it is. Is there another flight today?',
      },
      {
        speaker: 'Agente',
        text: 'Déjeme checar… Hay uno a las nueve de la noche. Le cambio el boleto sin costo.',
        translation:
          'Let me check… There is one at nine in the evening. I will change your ticket at no cost.',
      },
      {
        speaker: 'Pasajero',
        text: 'Perfecto. ¿Me da un comprobante, por favor?',
        translation: 'Perfect. Could I have written confirmation, please?',
      },
      {
        speaker: 'Agente',
        text: 'Claro, ahorita se lo imprimo.',
        translation: 'Of course, I will print it for you right away.',
      },
    ],
    phrases: [
      {
        heard: 'Una disculpa.',
        plain: 'Le pido una disculpa.',
        meaning: 'Sorry. The standard apology in Mexican customer service.',
      },
      {
        heard: 'pase de abordar',
        meaning: 'Boarding pass, in Mexico. Spain says tarjeta de embarque.',
      },
      {
        heard: 'Déjeme checar',
        plain: 'Déjeme revisar',
        meaning:
          'Let me check. Checar is everyday Mexican Spanish; in Spain people say mirar or comprobar.',
      },
      { heard: 'ahorita se lo imprimo', meaning: 'Here ahorita means right away.' },
    ],
    question: {
      prompt: 'When is the new flight?',
      options: ['At nine in the morning', 'Tomorrow', 'At nine in the evening'],
      correctIndex: 2,
    },
  },
];

const levelOrder = ['A1', 'A2', 'B1', 'B2'];

export function getScenarios(track: LanguageTrack) {
  return listeningScenarios
    .filter((scenario) => scenario.track === track)
    .sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level));
}

export function getScenario(id?: string) {
  return listeningScenarios.find((scenario) => scenario.id === id) ?? listeningScenarios[0];
}
