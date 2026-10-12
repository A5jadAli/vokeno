import { defineUnit } from './types';

/*
 * German A1, built as full units (docs/german-curriculum-blueprint.md).
 *
 * Story: Alex (the learner's stand-in, any gender) moves into a shared flat in Leipzig with Lena
 * and Jonas (from Hamburg), meets the neighbour Frau Wagner, and starts a German course with
 * Frau Schulz, Maria (from Brazil) and Karim (from Egypt).
 *
 * Every unit: careful and everyday versions of real scenes, words in small sets, one grammar
 * point with graded practice, and a task in a Goethe-Zertifikat A1 format.
 */

const unit1 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u1',
    number: 1,
    icon: 'hand-wave',
    title: 'Hallo!',
    canDo: 'Greet people, say who you are and ask their name, with du or Sie.',
  },
  [
    {
      id: 'de-a1-u1-hallo',
      session: 'Words',
      title: 'Hallo, Tschüss and everything in between',
      outcome: 'Say hello and goodbye the way people in Germany do, from morning to night.',
      minutes: 5,
      steps: [
        {
          kind: 'scene',
          title: 'Morning in the shared flat',
          intro:
            'Your first morning in a shared flat in Leipzig. Your flatmates Lena and Jonas are in the kitchen.',
          lines: [
            { speaker: 'Jonas', text: 'Moin!', meaning: 'Morning! (Hi!)' },
            {
              speaker: 'Lena',
              text: 'Guten Morgen, Jonas!',
              real: 'Morgen!',
              meaning: 'Good morning, Jonas!',
            },
            { speaker: 'Jonas', text: 'Wie geht’s?', meaning: 'How are you?' },
            {
              speaker: 'Lena',
              text: 'Gut, danke. Und dir?',
              real: 'Gut, und selbst?',
              meaning: 'Good, thanks. And you?',
              realMeaning: 'Good, and yourself?',
            },
            {
              speaker: 'Jonas',
              text: 'Auch gut. Ich muss los. Tschüss!',
              real: 'Auch gut. So, ich muss los. Tschüss!',
              meaning: 'Good too. I have to go. Bye!',
            },
            {
              speaker: 'Lena',
              text: 'Tschüss, bis später!',
              real: 'Ciao, bis später!',
              meaning: 'Bye, see you later!',
            },
          ],
          note: 'Jonas is from Hamburg. In the north, people say Moin to say hello, at any time of day, not only in the morning.',
        },
        {
          kind: 'teach',
          title: 'Saying hello',
          items: [
            {
              target: 'Hallo!',
              meaning: 'Hello! / Hi!',
              note: 'Works almost everywhere: friends, colleagues and most shops.',
            },
            {
              target: 'Guten Morgen!',
              meaning: 'Good morning!',
              note: 'Until about 11. Often just Morgen!',
            },
            {
              target: 'Guten Tag!',
              meaning: 'Hello! (polite, in the daytime)',
              note: 'At offices, receptions and with older people you do not know. Often just Tag!',
            },
            {
              target: 'Guten Abend!',
              meaning: 'Good evening!',
              note: 'From about 6 in the evening.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'It is 10 in the morning. You walk into a doctor’s practice. What do you say?',
          options: ['Guten Morgen!', 'Gute Nacht!', 'Tschüss!'],
          answer: 0,
          explanation:
            'At 10 in the morning, Guten Morgen! or Guten Tag! is right. Gute Nacht! is only for bedtime, and Tschüss! is for leaving.',
        },
        {
          kind: 'teach',
          title: 'Saying goodbye',
          items: [
            {
              target: 'Tschüss!',
              meaning: 'Bye!',
              note: 'The everyday goodbye: friends, colleagues and most shops.',
            },
            {
              target: 'Auf Wiedersehen!',
              meaning: 'Goodbye!',
              note: 'More formal: offices, doctors, older people. On the phone: Auf Wiederhören!',
            },
            {
              target: 'Bis später!',
              meaning: 'See you later!',
              note: 'Bis means until: Bis morgen! See you tomorrow!',
            },
            {
              target: 'Gute Nacht!',
              meaning: 'Good night!',
              note: 'Only when someone goes to bed.',
            },
            {
              target: 'Schönen Tag noch!',
              meaning: 'Have a nice day!',
              note: 'What people say when you leave a shop or café. Answer: Danke, gleichfalls! (Thanks, you too!)',
            },
          ],
        },
        {
          kind: 'match',
          prompt: 'When do you say it?',
          pairs: [
            ['Guten Morgen!', 'In the morning'],
            ['Guten Abend!', 'In the evening'],
            ['Gute Nacht!', 'At bedtime'],
            ['Auf Wiedersehen!', 'Leaving, formally'],
            ['Tschüss!', 'Leaving, casually'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Is the person arriving or leaving?',
          audio: 'Tschüss, bis morgen!',
          options: ['Leaving', 'Arriving'],
          answer: 0,
          explanation: 'Tschüss, bis morgen! means bye, see you tomorrow.',
        },
        {
          kind: 'teach',
          title: 'How are you?',
          items: [
            {
              target: 'Wie geht’s?',
              meaning: 'How are you?',
              note: 'Short for Wie geht es dir? To someone you call Sie: Wie geht es Ihnen?',
            },
            {
              target: 'Gut, danke. Und dir?',
              meaning: 'Good, thanks. And you?',
              note: 'To someone you call Sie: Und Ihnen?',
            },
            {
              target: 'Es geht.',
              meaning: 'So-so.',
              note: 'Also: Geht so. Germans often answer honestly, so gut is not automatic.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Lena asks “Wie geht’s?” You are tired and not great. What can you say?',
          options: ['Es geht.', 'Gute Nacht!', 'Guten Tag!'],
          answer: 0,
          explanation: 'Es geht or Geht so means so-so. It is fine to be honest.',
        },
        {
          kind: 'teach',
          title: 'Hello around the German-speaking world',
          items: [
            {
              target: 'Moin!',
              meaning: 'Hi! (north)',
              note: 'Northern Germany, at any time of day.',
            },
            {
              target: 'Servus!',
              meaning: 'Hi! / Bye! (south)',
              note: 'Bavaria and Austria, casual. It works for hello and goodbye.',
            },
            {
              target: 'Grüß Gott!',
              meaning: 'Hello! (south, polite)',
              note: 'Bavaria and Austria. Answer with Grüß Gott! or simply Hallo!',
            },
          ],
        },
        {
          kind: 'choose',
          prompt:
            'You are in a shop in Munich. The woman at the till says “Grüß Gott!” What is she doing?',
          options: ['Saying hello', 'Saying goodbye', 'Saying thank you'],
          answer: 0,
          explanation:
            'Grüß Gott is a polite hello in Bavaria and Austria. You can answer Grüß Gott! or Hallo!',
        },
        {
          kind: 'build',
          prompt: 'Answer Lena: “Good, thanks. And you?”',
          answer: ['Gut,', 'danke.', 'Und', 'dir?'],
          extra: ['Tschüss!'],
          explanation: 'Und dir? passes the question back. To someone you call Sie: Und Ihnen?',
        },
        {
          kind: 'type',
          prompt: 'You leave the flat. Write “Bye, see you later!”',
          accepted: ['Tschüss, bis später!', 'Tschüs, bis später!', 'Ciao, bis später!'],
          hint: 'Tschüss, then bis (until) and später (later).',
          explanation:
            'Tschüss, bis später! is the everyday goodbye when you will see someone again soon.',
        },
        {
          kind: 'speak',
          prompt:
            'Meet Lena in the kitchen in the morning, answer her question, then leave. Say each line, then play it to compare.',
          lines: ['Guten Morgen!', 'Gut, danke. Und dir?', 'Tschüss, bis später!'],
          tip: 'In Tschüss, ü is “ee” said with rounded lips. In Tag and Abend, the end sounds hard: Tak, Abent.',
        },
      ],
    },
    {
      id: 'de-a1-u1-ich-bin',
      session: 'Grammar',
      title: 'Ich bin … Who are you?',
      outcome: 'Say your name, ask other people for theirs, and introduce someone.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'First day at the language course',
          intro:
            'Alex starts a German course. The teacher, Frau Schulz, says hello. Then Maria from Brazil sits down next to Alex.',
          lines: [
            {
              speaker: 'Frau Schulz',
              text: 'Guten Morgen! Ich bin Frau Schulz, Ihre Lehrerin. Wie heißen Sie?',
              meaning: 'Good morning! I am Frau Schulz, your teacher. What is your name?',
            },
            {
              speaker: 'Alex',
              text: 'Guten Morgen! Ich heiße Alex.',
              real: 'Morgen! Ich heiß Alex.',
              meaning: 'Good morning! My name is Alex.',
            },
            {
              speaker: 'Frau Schulz',
              text: 'Willkommen, Alex! Und das ist Maria.',
              meaning: 'Welcome, Alex! And this is Maria.',
            },
            {
              speaker: 'Maria',
              text: 'Hallo, ich bin Maria. Freut mich!',
              real: 'Hi, Maria. Freut mich!',
              meaning: 'Hi, I am Maria. Nice to meet you!',
            },
            { speaker: 'Alex', text: 'Freut mich auch!', meaning: 'Nice to meet you too!' },
          ],
          note: 'The teacher uses Sie with a new adult student. Maria, another student, is on du with Alex straight away. That is normal in a course.',
        },
        {
          kind: 'rule',
          title: 'sein: to be',
          body: 'Sein (to be) is irregular, like “to be” in English. Learn the forms as a set.',
          table: [
            ['ich bin', 'I am'],
            ['du bist', 'you are (du)'],
            ['er / sie ist', 'he / she is'],
            ['Sie sind', 'you are (Sie)'],
          ],
          examples: ['Ich bin Alex.', 'Bist du Maria?', 'Das ist Frau Schulz.'],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich ___ Alex.',
          options: ['bin', 'ist', 'bist'],
          answer: 0,
          explanation: 'ich bin: I am.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Du ___ Maria, oder?',
          options: ['bist', 'bin', 'sind'],
          answer: 0,
          explanation: 'du bist: you are. Oder? at the end means “right?”.',
        },
        {
          kind: 'rule',
          title: 'heißen: to be called',
          body: 'Heißen means “to be called”: Ich heiße Alex is “I am called Alex”. The du form adds only -t, because the stem already ends in ß.',
          table: [
            ['ich heiße', 'my name is'],
            ['du heißt', 'your name is (du)'],
            ['er / sie heißt', 'his / her name is'],
            ['Sie heißen', 'your name is (Sie)'],
          ],
          examples: ['Wie heißt du?', 'Wie heißen Sie?', 'Er heißt Karim.'],
        },
        {
          kind: 'teach',
          title: 'Names',
          items: [
            { target: 'Wie heißt du?', meaning: 'What’s your name? (du)' },
            { target: 'Wie heißen Sie?', meaning: 'What’s your name? (Sie)' },
            {
              target: 'Mein Name ist …',
              meaning: 'My name is …',
              note: 'A little formal: on the phone, at offices, in the exam.',
            },
            { target: 'Wer ist das?', meaning: 'Who is that?' },
            { target: 'Das ist Maria.', meaning: 'This is Maria.', note: 'To introduce someone.' },
            {
              target: 'Freut mich!',
              meaning: 'Nice to meet you!',
              note: 'Answer: Freut mich auch! (Nice to meet you too!)',
            },
          ],
        },
        {
          kind: 'build',
          prompt: 'Ask Maria: “What’s your name?”',
          answer: ['Wie', 'heißt', 'du?'],
          extra: ['heißen', 'bist'],
          explanation: 'Question word first, verb second: Wie heißt du?',
        },
        {
          kind: 'choose',
          prompt: 'You are at an office. Which question is right for the clerk, an older man?',
          options: ['Wie heißen Sie?', 'Wie heißt du?', 'Wer bist du?'],
          answer: 0,
          explanation: 'Sie is the polite you: Wie heißen Sie?',
        },
        {
          kind: 'rule',
          title: 'Questions: where the verb goes',
          body: 'With a question word (wie, wer, was), the verb comes straight after it. A yes/no question starts with the verb.',
          table: [
            ['Wie heißt du?', 'question word, then verb'],
            ['Wer ist das?', 'question word, then verb'],
            ['Bist du Maria?', 'yes/no: verb first'],
          ],
        },
        {
          kind: 'build',
          prompt: 'Ask: “Are you Jonas?”',
          answer: ['Bist', 'du', 'Jonas?'],
          extra: ['Ist'],
          explanation: 'A yes/no question starts with the verb: Bist du Jonas?',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What is the woman’s name?',
          audio: 'Guten Tag! Mein Name ist Becker, Anna Becker.',
          options: ['Anna Becker', 'Hanna Becker', 'Anna Decker'],
          answer: 0,
          explanation:
            'You heard “Mein Name ist Becker, Anna Becker.” In formal situations, people often say the family name first, then the full name.',
        },
        {
          kind: 'type',
          prompt: 'Introduce Maria to Jonas. Write “This is Maria.”',
          accepted: ['Das ist Maria.'],
          hint: 'Das + ist + Maria.',
          explanation: 'Das ist … introduces someone or something.',
        },
        {
          kind: 'speak',
          prompt:
            'Introduce yourself to Maria and ask her name. Use your own name instead of Alex.',
          lines: ['Hallo, ich bin Alex.', 'Wie heißt du?', 'Freut mich!'],
          tip: 'In heiße and heißt, ei sounds like English “eye” and ß is a sharp s: HEI-se.',
        },
      ],
    },
    {
      id: 'de-a1-u1-du-sie',
      session: 'Real talk',
      title: 'du or Sie, and what to say when you do not understand',
      outcome:
        'Choose du or Sie like a local, and keep a conversation going when you do not understand.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'du or Sie?',
          body: 'German has two words for “you”. Sie is for adults you do not know, offices, doctors and older people. Du is for friends, family, children, and most people under about 30 in relaxed places. Many gyms, cafés, apps and workplaces use du too. When you are not sure, start with Sie. The other person may offer du: “Wir können uns duzen.”',
          table: [
            ['du', 'friends, family, children, most young people'],
            ['Sie', 'strangers, officials, doctors, older people'],
            ['ihr', 'two or more people you call du'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Who would you normally call Sie?',
          options: ['A police officer', 'Your flatmate Lena', 'A child in the park'],
          answer: 0,
          explanation:
            'Officials and adults you do not know get Sie. Flatmates and children get du.',
        },
        {
          kind: 'choose',
          prompt: 'At a party, you meet Lena’s friend. He is about 25. What do you say?',
          options: ['Hi, wie heißt du?', 'Guten Tag, wie heißen Sie?', 'Wer sind Sie?'],
          answer: 0,
          explanation:
            'At a party with people your age, du is normal. Sie would sound strangely distant.',
        },
        {
          kind: 'scene',
          title: 'On the stairs',
          intro: 'Alex meets the neighbour, Frau Wagner, on the stairs. She is about 70.',
          lines: [
            {
              speaker: 'Frau Wagner',
              text: 'Guten Tag! Sie sind neu hier, oder?',
              meaning: 'Hello! You are new here, aren’t you?',
            },
            {
              speaker: 'Alex',
              text: 'Ja, guten Tag! Ich bin Alex.',
              meaning: 'Yes, hello! I am Alex.',
            },
            {
              speaker: 'Frau Wagner',
              text: 'Wagner. Freut mich.',
              meaning: 'Wagner. Nice to meet you.',
            },
            {
              speaker: 'Alex',
              text: 'Freut mich auch, Frau Wagner.',
              meaning: 'Nice to meet you too, Frau Wagner.',
            },
            {
              speaker: 'Frau Wagner',
              text: 'Na dann, schönen Tag noch!',
              meaning: 'Well then, have a nice day!',
            },
            { speaker: 'Alex', text: 'Danke, gleichfalls!', meaning: 'Thanks, you too!' },
          ],
          note: 'Frau Wagner gives only her family name. That is typical for older people, and on the phone. Call her Frau Wagner, not by a first name.',
        },
        {
          kind: 'choose',
          prompt: 'Frau Wagner just said “Wagner.” How do you address her?',
          options: ['Frau Wagner', 'Wagner', 'Du'],
          answer: 0,
          explanation: 'Use Frau or Herr with the family name: Frau Wagner.',
        },
        {
          kind: 'teach',
          title: 'When you do not understand',
          items: [
            {
              target: 'Wie bitte?',
              meaning: 'Sorry? / Pardon?',
              note: 'The polite way to ask someone to repeat.',
            },
            { target: 'Noch mal, bitte.', meaning: 'Once more, please.' },
            { target: 'Langsamer, bitte.', meaning: 'Slower, please.' },
            {
              target: 'Ich verstehe das nicht.',
              meaning: 'I don’t understand.',
              note: 'In everyday speech often: Versteh ich nicht.',
            },
            {
              target: 'Entschuldigung!',
              meaning: 'Excuse me! / Sorry!',
              note: 'To get attention or to apologise. Many people also just say Sorry!',
            },
          ],
        },
        {
          kind: 'teach',
          title: 'What friends say',
          items: [
            {
              target: 'Hä?',
              meaning: 'Huh? / What?',
              note: 'Very casual: friends say it when they did not understand. Not with strangers.',
            },
            { target: 'Ach so!', meaning: 'Oh, I see!', note: 'When something becomes clear.' },
            {
              target: 'Genau.',
              meaning: 'Exactly. / Right.',
              note: 'One of the most frequent words in spoken German.',
            },
            { target: 'Nee.', meaning: 'Nope.', note: 'The everyday spoken form of nein.' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match what you hear with what it means.',
          pairs: [
            ['Wie bitte?', 'Sorry? (polite)'],
            ['Hä?', 'Huh? (casual)'],
            ['Ach so!', 'Oh, I see!'],
            ['Genau.', 'Exactly.'],
            ['Nee.', 'Nope.'],
          ],
        },
        {
          kind: 'scene',
          title: 'Too fast',
          intro: 'Jonas speaks fast. Alex asks him to slow down.',
          lines: [
            {
              speaker: 'Jonas',
              text: 'Na, alles klar? Willst du heute Abend mit in die Kneipe?',
              real: 'Na, alles klar? Willste heute Abend mit in die Kneipe?',
              meaning: 'Hey, all good? Do you want to come to the pub tonight?',
            },
            {
              speaker: 'Alex',
              text: 'Wie bitte? Langsamer, bitte.',
              meaning: 'Sorry? Slower, please.',
            },
            {
              speaker: 'Jonas',
              text: 'Ach so, Entschuldigung! Heute Abend. Kneipe. Kommst du mit?',
              real: 'Ach so, sorry! Heute Abend. Kneipe. Kommste mit?',
              meaning: 'Oh, sorry! Tonight. Pub. Are you coming?',
            },
            { speaker: 'Alex', text: 'Ach so! Ja, gern!', meaning: 'Oh, I see! Yes, I’d love to!' },
          ],
          note: 'Asking someone to repeat is normal, even between native speakers. Most people slow down and use simpler words straight away. In fast speech, du often merges with the verb: willst du becomes willste.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the person want?',
          audio: 'Entschuldigung, können Sie das bitte noch mal sagen?',
          options: ['You to say it again', 'To leave', 'To say thank you'],
          answer: 0,
          explanation:
            'You heard “Können Sie das bitte noch mal sagen?”: could you say that again, please?',
        },
        {
          kind: 'build',
          prompt: 'Say: “I don’t understand that.”',
          answer: ['Ich', 'verstehe', 'das', 'nicht.'],
          extra: ['bin'],
          also: ['Das verstehe ich nicht.'],
          explanation:
            'Nicht goes at the end here. You can also start with das: Das verstehe ich nicht. The verb stays second either way.',
        },
        {
          kind: 'type',
          prompt: 'Ask someone politely to repeat. Write the two-word phrase for “Sorry?”.',
          accepted: ['Wie bitte?'],
          hint: 'wie + bitte',
          explanation: 'Wie bitte? is polite with everyone. Hä? is only for friends.',
        },
        {
          kind: 'speak',
          prompt:
            'Someone speaks too fast. Ask them to repeat and slow down, then show you understood.',
          lines: ['Wie bitte?', 'Noch mal, bitte. Langsamer, bitte.', 'Ach so! Danke.'],
          tip: 'The ch in ach comes from the back of the throat, like a soft hiss. It is never a k.',
        },
      ],
    },
    {
      id: 'de-a1-u1-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: names and forms',
      outcome:
        'Do a Hören Teil 1 task about names, read a simple form, and start your Sprechen Teil 1 introduction.',
      minutes: 5,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: Hören Teil 1',
          body: 'In Goethe-Zertifikat A1 Hören Teil 1, you hear six short everyday conversations, each twice, and choose a, b or c. Names, numbers and times are typical. Read the question first, then listen for that one detail.',
        },
        {
          kind: 'choose',
          prompt: 'Hören Teil 1. Wie heißt die Frau?',
          audio:
            'Guten Tag. Wie ist Ihr Name, bitte? Schmidt, Laura Schmidt. Danke, Frau Schmidt. Nehmen Sie bitte Platz.',
          options: ['Laura Schmidt', 'Laura Schmitz', 'Lara Schmidt'],
          answer: 0,
          explanation:
            'She says “Schmidt, Laura Schmidt”: the family name, then the full name. Nehmen Sie bitte Platz means please take a seat.',
        },
        {
          kind: 'teach',
          title: 'Words on forms',
          items: [
            { target: 'der Vorname', meaning: 'first name' },
            {
              target: 'der Familienname',
              meaning: 'family name',
              note: 'Also: der Nachname. Both are common on forms.',
            },
            {
              target: 'Herr / Frau',
              meaning: 'Mr / Ms',
              note: 'Frau is used for every adult woman, married or not.',
            },
            { target: 'das Formular', meaning: 'form' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Look at the form. What is her first name?',
          context: 'Anmeldung Deutschkurs\nFrau\nFamilienname: Schmidt\nVorname: Laura',
          options: ['Laura', 'Schmidt', 'Frau'],
          answer: 0,
          explanation:
            'Vorname is the first name: Laura. Familienname is the family name: Schmidt.',
        },
        {
          kind: 'type',
          prompt: 'Fill in the form for Karim. Vorname: ___',
          context: 'Karim sagt: “Ich heiße Karim Haddad.”',
          accepted: ['Karim'],
          hint: 'Vorname is the first name.',
          explanation: 'Vorname: Karim. Familienname: Haddad.',
        },
        {
          kind: 'rule',
          title: 'The exam: Sprechen Teil 1',
          body: 'In Sprechen Teil 1, you introduce yourself with the help of cards: Name, Alter (age), Land (country), Wohnort (where you live), Sprachen (languages), Beruf (job) and Hobby. Then the examiner may ask you to spell your name or say a number. This unit covers the name; the next units add the other cards.',
          examples: ['Mein Name ist Alex.', 'Ich heiße Alex.'],
        },
        {
          kind: 'build',
          prompt: 'Start the exam introduction: “My name is Alex.”',
          answer: ['Mein', 'Name', 'ist', 'Alex.'],
          extra: ['heiße'],
          explanation:
            'Mein Name ist … is a clear start for the exam. Ich heiße … is just as good.',
        },
        {
          kind: 'choose',
          prompt: 'The examiner says: “Buchstabieren Sie bitte Ihren Namen.” What do you do?',
          options: ['Spell your name', 'Say your name slowly', 'Write your name'],
          answer: 0,
          explanation: 'Buchstabieren means to spell. You learn the German alphabet in Unit 3.',
        },
        {
          kind: 'match',
          prompt: 'Unit 1 review: match the pairs.',
          pairs: [
            ['Guten Abend!', 'Good evening!'],
            ['Freut mich!', 'Nice to meet you!'],
            ['Wie bitte?', 'Sorry? (polite)'],
            ['Wie heißen Sie?', 'What’s your name? (Sie)'],
            ['Bis später!', 'See you later!'],
          ],
        },
        {
          kind: 'speak',
          prompt:
            'Start your exam introduction: greet the examiner, say your name, and ask theirs politely. Use your own name.',
          lines: ['Guten Tag!', 'Mein Name ist Alex.', 'Und wie heißen Sie?'],
        },
      ],
    },
  ],
);

const mariaEmail =
  'Liebe Paula,\nich bin jetzt in Leipzig! Ich wohne bei Familie Becker. Mein Deutschkurs ist super. Die Leute im Kurs kommen aus Polen, aus der Türkei und aus Ägypten. Im Kurs sprechen wir nur Deutsch. Abends lerne ich mit Karim. Er kommt aus Ägypten und spricht sehr gut Englisch.\nViele Grüße\nMaria';

const unit2 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u2',
    number: 2,
    icon: 'earth',
    title: 'Woher kommst du?',
    canDo: 'Say where you are from, where you live and which languages you speak, and ask others.',
  },
  [
    {
      id: 'de-a1-u2-countries',
      session: 'Words',
      title: 'Countries, cities and languages',
      outcome: 'Say where you come from, where you live and what you speak.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Coffee break at the course',
          intro: 'In the break, Maria, Karim and Alex get to know each other.',
          lines: [
            {
              speaker: 'Maria',
              text: 'Karim, woher kommst du?',
              real: 'Karim, wo kommst du her?',
              meaning: 'Karim, where are you from?',
            },
            {
              speaker: 'Karim',
              text: 'Ich komme aus Ägypten, aus Kairo. Und du?',
              real: 'Aus Ägypten, aus Kairo. Und du?',
              meaning: 'I am from Egypt, from Cairo. And you?',
            },
            {
              speaker: 'Maria',
              text: 'Aus Brasilien. Ich wohne jetzt hier in Leipzig.',
              meaning: 'From Brazil. I live here in Leipzig now.',
            },
            {
              speaker: 'Karim',
              text: 'Und welche Sprachen sprichst du?',
              real: 'Und was sprichst du so?',
              meaning: 'And which languages do you speak?',
            },
            {
              speaker: 'Maria',
              text: 'Portugiesisch, Spanisch und ein bisschen Deutsch!',
              meaning: 'Portuguese, Spanish and a little German!',
            },
          ],
          note: 'German uses aus for where you come from (aus Ägypten) and in for where you live (in Leipzig).',
        },
        {
          kind: 'teach',
          title: 'Where from, where you live',
          items: [
            {
              target: 'Woher kommst du?',
              meaning: 'Where are you from?',
              note: 'To someone you call Sie: Woher kommen Sie?',
            },
            {
              target: 'Ich komme aus Brasilien.',
              meaning: 'I am from Brazil.',
              note: 'aus + country or city.',
            },
            {
              target: 'Wo wohnst du?',
              meaning: 'Where do you live?',
              note: 'To someone you call Sie: Wo wohnen Sie?',
            },
            {
              target: 'Ich wohne in Leipzig.',
              meaning: 'I live in Leipzig.',
              note: 'in + city or country.',
            },
            { target: 'jetzt', meaning: 'now' },
            { target: 'hier', meaning: 'here' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich komme ___ Polen.',
          options: ['aus', 'in', 'bei'],
          answer: 0,
          explanation: 'aus means from: Ich komme aus Polen.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich wohne ___ Berlin.',
          options: ['in', 'aus', 'bei'],
          answer: 0,
          explanation: 'in for where you live: Ich wohne in Berlin.',
        },
        {
          kind: 'teach',
          title: 'Countries with der, die or den',
          items: [
            {
              target: 'aus der Türkei',
              meaning: 'from Turkey',
              note: 'Most countries have no article (aus Indien, aus Polen), but a few do: die Türkei becomes aus der Türkei.',
            },
            { target: 'aus der Schweiz', meaning: 'from Switzerland' },
            { target: 'aus der Ukraine', meaning: 'from Ukraine' },
            {
              target: 'aus den USA',
              meaning: 'from the USA',
              note: 'Plural: die USA, aus den USA.',
            },
            { target: 'aus dem Iran', meaning: 'from Iran', note: 'Also: aus dem Irak.' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the countries.',
          pairs: [
            ['Deutschland', 'Germany'],
            ['Österreich', 'Austria'],
            ['die Schweiz', 'Switzerland'],
            ['Ägypten', 'Egypt'],
            ['Indien', 'India'],
          ],
        },
        {
          kind: 'teach',
          title: 'Languages',
          items: [
            {
              target: 'Ich spreche Englisch.',
              meaning: 'I speak English.',
              note: 'Most language names end in -isch: Arabisch, Türkisch, Polnisch, Spanisch. They start with a capital letter.',
            },
            {
              target: 'Sprichst du Deutsch?',
              meaning: 'Do you speak German?',
              note: 'sprechen changes its vowel: du sprichst, er spricht.',
            },
            {
              target: 'ein bisschen',
              meaning: 'a little',
              note: 'Ich spreche ein bisschen Deutsch. Honest and very useful.',
            },
            { target: 'Welche Sprachen sprechen Sie?', meaning: 'Which languages do you speak?' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which languages does Karim speak?',
          audio: 'Ich spreche Arabisch, Englisch und ein bisschen Deutsch.',
          options: [
            'Arabic, English and a little German',
            'Arabic and German',
            'English and a little Arabic',
          ],
          answer: 0,
          explanation: 'You heard “Arabisch, Englisch und ein bisschen Deutsch”.',
        },
        {
          kind: 'build',
          prompt: 'Say: “I live in Leipzig now.”',
          answer: ['Ich', 'wohne', 'jetzt', 'in', 'Leipzig.'],
          extra: ['komme'],
          also: ['Jetzt wohne ich in Leipzig.'],
          explanation:
            'Jetzt usually comes right after the verb. If you start with Jetzt, the verb still comes second: Jetzt wohne ich in Leipzig.',
        },
        {
          kind: 'type',
          prompt: 'Write in German: “I am from India.”',
          accepted: ['Ich komme aus Indien.', 'Ich bin aus Indien.'],
          hint: 'Ich komme + aus + Indien.',
          explanation: 'Ich komme aus Indien and Ich bin aus Indien are both natural.',
        },
        {
          kind: 'speak',
          prompt:
            'Say where you are from, where you live now and which languages you speak. Use your own country, city and languages.',
          lines: [
            'Ich komme aus Indien.',
            'Ich wohne jetzt in Leipzig.',
            'Ich spreche Englisch und ein bisschen Deutsch.',
          ],
          tip: 'In ich and Indien, ch is soft, like a whispered “h” after “ee”. It is not k and not sh.',
        },
      ],
    },
    {
      id: 'de-a1-u2-verbs',
      session: 'Grammar',
      title: 'Verb endings: ich wohne, du wohnst',
      outcome: 'Use the right verb ending for every person and ask yes/no questions.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'Present tense: the ending follows the person',
          body: 'Take the infinitive (wohnen), drop -en, and add the ending for the person. Most German verbs work like this.',
          table: [
            ['ich wohne', '-e'],
            ['du wohnst', '-st'],
            ['er / sie / es wohnt', '-t'],
            ['wir wohnen', '-en'],
            ['ihr wohnt', '-t'],
            ['sie / Sie wohnen', '-en'],
          ],
          examples: ['Wir wohnen in Leipzig.', 'Wohnt ihr auch hier?'],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Maria ___ aus Brasilien.',
          options: ['kommt', 'komme', 'kommst'],
          answer: 0,
          explanation: 'er / sie: -t. Maria kommt aus Brasilien.',
        },
        {
          kind: 'build',
          prompt: 'Say: “We are learning German.”',
          answer: ['Wir', 'lernen', 'Deutsch.'],
          extra: ['lernt', 'lernst'],
          explanation:
            'wir: -en. Wir lernen Deutsch. One German present tense covers “we learn” and “we are learning”.',
        },
        {
          kind: 'choose',
          prompt: 'You ask two friends. Complete: Woher ___ ihr?',
          options: ['kommt', 'kommen', 'kommst'],
          answer: 0,
          explanation:
            'ihr is “you” for two or more people you call du. Its ending is -t: ihr kommt.',
        },
        {
          kind: 'rule',
          title: 'Two small exceptions',
          body: 'If the stem ends in -t or -d, add an e before -st and -t so you can say it: arbeiten → du arbeitest, er arbeitet. If the stem ends in -s, -ß or -z, the du form adds only -t: heißen → du heißt.',
          table: [
            ['du arbeitest', 'not: du arbeitst'],
            ['er arbeitet', 'not: er arbeitt'],
            ['du heißt', 'not: du heißst'],
          ],
        },
        {
          kind: 'rule',
          title: 'sprechen: a vowel that changes',
          body: 'Some common verbs change their vowel with du and er / sie: sprechen → du sprichst, er spricht. For now, learn these forms as you meet them. The pattern comes in Unit 9.',
          table: [
            ['ich spreche', 'I speak'],
            ['du sprichst', 'you speak'],
            ['er / sie spricht', 'he / she speaks'],
            ['wir / sie / Sie sprechen', 'we / they / you speak'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Karim ___ Arabisch.',
          options: ['spricht', 'sprecht', 'sprechen'],
          answer: 0,
          explanation: 'sprechen changes to spricht with er / sie.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Du ___ in Leipzig, oder?',
          options: ['arbeitest', 'arbeitst', 'arbeiten'],
          answer: 0,
          explanation: 'The stem arbeit- ends in t, so du gets -est: du arbeitest.',
        },
        {
          kind: 'teach',
          title: 'Useful verbs',
          items: [
            { target: 'arbeiten', meaning: 'to work', note: 'Ich arbeite hier.' },
            { target: 'lernen', meaning: 'to learn', note: 'Ich lerne Deutsch.' },
            {
              target: 'studieren',
              meaning: 'to study (at university)',
              note: 'Only for university: Ich studiere Informatik. For a language course, say lernen.',
            },
            {
              target: 'machen',
              meaning: 'to do, to make',
              note: 'Was machst du? What are you doing? / What do you do?',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Alex goes to a language school. Which sentence is right?',
          options: ['Ich lerne Deutsch.', 'Ich studiere Deutsch.'],
          answer: 0,
          explanation:
            'At a language course you lernen. Ich studiere Deutsch would mean German is your subject at university.',
        },
        {
          kind: 'build',
          prompt: 'Ask a friend: “Do you speak English?”',
          answer: ['Sprichst', 'du', 'Englisch?'],
          extra: ['Sprechen'],
          explanation: 'A yes/no question starts with the verb: Sprichst du Englisch?',
        },
        {
          kind: 'type',
          prompt: 'Write: “We live in Hamburg.”',
          accepted: ['Wir wohnen in Hamburg.', 'Wir leben in Hamburg.'],
          hint: 'wir + the -en form of wohnen.',
          explanation: 'wir wohnen: the wir form looks like the infinitive.',
        },
        {
          kind: 'type',
          prompt: 'Ask two friends: “Where are you from?”',
          accepted: ['Woher kommt ihr?', 'Wo kommt ihr her?'],
          hint: 'Woher + kommt + ihr?',
          explanation: 'ihr kommt: -t, like er kommt.',
        },
        {
          kind: 'speak',
          prompt: 'Tell a new friend about yourself and about Jonas.',
          lines: [
            'Ich wohne in Leipzig und lerne Deutsch.',
            'Jonas kommt aus Hamburg.',
            'Er spricht Englisch und ein bisschen Spanisch.',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u2-real',
      session: 'Real talk',
      title: '“Wo kommst du her?” How people really ask',
      outcome: 'Understand the everyday versions of these questions and react naturally.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Dinner in the shared flat',
          intro: 'Jonas cooks pasta and asks Alex the usual questions, the way people really talk.',
          lines: [
            {
              speaker: 'Jonas',
              text: 'Und woher kommst du?',
              real: 'Und, wo kommst du eigentlich her?',
              meaning: 'So, where are you from?',
            },
            {
              speaker: 'Alex',
              text: 'Ich komme aus Kanada, aus Toronto.',
              real: 'Aus Kanada, aus Toronto.',
              meaning: 'From Canada, from Toronto.',
            },
            {
              speaker: 'Jonas',
              text: 'Cool! Wie lange bist du schon in Leipzig?',
              real: 'Ach, cool! Und wie lange bist du schon hier?',
              meaning: 'Cool! How long have you been in Leipzig?',
            },
            { speaker: 'Alex', text: 'Seit zwei Wochen.', meaning: 'For two weeks.' },
            {
              speaker: 'Jonas',
              text: 'Und gefällt es dir hier?',
              real: 'Und, gefällt’s dir?',
              meaning: 'And do you like it here?',
            },
            {
              speaker: 'Alex',
              text: 'Ja, sehr! Aber das Deutsch hier ist schwer.',
              real: 'Ja, total! Aber das Deutsch hier ist echt schwer.',
              meaning: 'Yes, a lot! But the German here is (really) hard.',
            },
            {
              speaker: 'Jonas',
              text: 'Das ist Sächsisch. Das verstehe ich auch nicht!',
              real: 'Ach, das ist Sächsisch. Das versteh ich auch nicht!',
              meaning: 'That’s Saxon dialect. I don’t understand it either!',
            },
          ],
          note: 'Wo kommst du her? is the everyday way to say Woher kommst du?: the word splits into wo … her. Eigentlich (actually) makes the question sound relaxed. And yes, people in Leipzig speak Saxon dialect, which other Germans find hard too.',
        },
        {
          kind: 'teach',
          title: 'Everyday versions',
          items: [
            {
              target: 'Wo kommst du her?',
              meaning: 'Where are you from?',
              note: 'The everyday spoken form of Woher kommst du?',
            },
            {
              target: 'Ich bin aus Kanada.',
              meaning: 'I am from Canada.',
              note: 'As common as Ich komme aus Kanada.',
            },
            {
              target: 'Wie lange bist du schon hier?',
              meaning: 'How long have you been here?',
              note: 'German uses the present tense here: bist … schon.',
            },
            {
              target: 'seit zwei Wochen',
              meaning: 'for two weeks',
              note: 'seit + the present tense, for something that is still going on.',
            },
            {
              target: 'Gefällt’s dir?',
              meaning: 'Do you like it?',
              note: 'Short for Gefällt es dir? Answer: Ja, sehr!',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Jonas asks: “Wo kommst du her?” What does he want to know?',
          options: ['Where you are from', 'Where you live', 'Where you are going'],
          answer: 0,
          explanation: 'Wo kommst du her? = Woher kommst du? Where are you from?',
        },
        {
          kind: 'choose',
          prompt: 'How do you say “I have been here for two weeks”?',
          options: [
            'Ich bin seit zwei Wochen hier.',
            'Ich war zwei Wochen hier.',
            'Ich bin für zwei Wochen hier.',
          ],
          answer: 0,
          explanation:
            'German uses seit + present tense for something still going on. Ich bin für zwei Wochen hier means your whole stay is two weeks.',
        },
        {
          kind: 'teach',
          title: 'Reacting',
          items: [
            { target: 'Echt?', meaning: 'Really?', note: 'Very common in speech.' },
            { target: 'Cool!', meaning: 'Cool!', note: 'Germans use it all the time.' },
            { target: 'Ach, schön!', meaning: 'Oh, nice!' },
            { target: 'Total!', meaning: 'Totally!' },
            {
              target: 'Und du so?',
              meaning: 'And you?',
              note: 'Very casual: and what about you?',
            },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the reactions.',
          pairs: [
            ['Echt?', 'Really?'],
            ['Ach, schön!', 'Oh, nice!'],
            ['Total!', 'Totally!'],
            ['Und du so?', 'And you? (casual)'],
            ['Genau.', 'Exactly.'],
          ],
        },
        {
          kind: 'rule',
          title: 'A question to ask with care',
          body: 'Many people in Germany have family roots in other countries and are just as German. If someone says “Ich komme aus Köln”, take that as the answer. Asking “Und woher kommst du wirklich?” (where are you really from?) can sound as if you think they are not German. If you are curious, talk about languages instead: “Welche Sprachen sprichst du?”',
        },
        {
          kind: 'choose',
          prompt: 'Aylin says: “Ich komme aus Köln.” What is a friendly next question?',
          options: [
            'Ach, cool! Wie lange bist du schon in Leipzig?',
            'Nein, woher kommst du wirklich?',
            'Sprichst du Deutsch?',
          ],
          answer: 0,
          explanation:
            'Take Köln as the answer and keep talking. The other questions can sound as if you do not see her as German.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. How long has Jonas lived in Leipzig?',
          audio: 'Ich bin aus Hamburg, aber ich wohne seit zwei Jahren in Leipzig.',
          options: ['For two years', 'For two weeks', 'He lives in Hamburg'],
          answer: 0,
          explanation: 'You heard “seit zwei Jahren”: for two years. Wochen would be weeks.',
        },
        {
          kind: 'build',
          prompt: 'Ask casually: “Where are you from?”',
          answer: ['Wo', 'kommst', 'du', 'her?'],
          extra: ['bist'],
          explanation: 'Wo at the start, her at the end: Wo kommst du her?',
        },
        {
          kind: 'type',
          prompt: 'Answer Jonas: “For two weeks.”',
          accepted: ['Seit zwei Wochen.'],
          hint: 'seit + zwei Wochen',
          explanation: 'Seit zwei Wochen: for two weeks, and you are still here.',
        },
        {
          kind: 'speak',
          prompt:
            'Have the dinner conversation: say where you are from and how long you have been here, then react to Jonas. Use your own details.',
          lines: ['Ich bin aus Kanada.', 'Seit zwei Wochen.', 'Echt? Cool!'],
          tip: 'In echt and ich, ch is the soft sound at the front of the mouth. In ach and auch, it comes from the back.',
        },
      ],
    },
    {
      id: 'de-a1-u2-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: read a message, introduce yourself',
      outcome:
        'Do a Lesen Teil 1 task and answer the Land, Wohnort and Sprachen cards of Sprechen Teil 1.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: Lesen Teil 1',
          body: 'In Goethe-Zertifikat A1 Lesen Teil 1, you read two short texts, such as an email or a message, and decide whether five sentences are richtig (true) or falsch (false). Read the sentences first, then find the place in the text.',
        },
        {
          kind: 'teach',
          title: 'Words in emails and exams',
          items: [
            { target: 'richtig', meaning: 'true, correct' },
            { target: 'falsch', meaning: 'false, wrong' },
            {
              target: 'Liebe Paula, …',
              meaning: 'Dear Paula, …',
              note: 'Lieber for a man: Lieber Jonas. In casual messages, people write Hallo Paula or Hi Paula.',
            },
            {
              target: 'Viele Grüße',
              meaning: 'Best wishes',
              note: 'The usual way to end an email.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Maria wohnt in Leipzig.',
          context: mariaEmail,
          options: ['Richtig', 'Falsch'],
          answer: 0,
          explanation: '“Ich bin jetzt in Leipzig! Ich wohne bei Familie Becker.”',
        },
        {
          kind: 'choose',
          prompt: 'Im Kurs sprechen die Leute Englisch.',
          context: mariaEmail,
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation:
            '“Im Kurs sprechen wir nur Deutsch”: only German. Karim speaks good English, but not in the course. Exam texts often mention the wrong answer somewhere else.',
        },
        {
          kind: 'type',
          prompt: 'Woher kommt Karim? Write the country.',
          context: mariaEmail,
          accepted: ['Ägypten', 'aus Ägypten'],
          hint: 'Find “Er kommt aus …” in the email.',
          explanation:
            '“Er kommt aus Ägypten.” Die Türkei and Polen are where other people in the course come from: exam texts often name the wrong answers too.',
        },
        {
          kind: 'rule',
          title: 'Sprechen Teil 1: Land, Wohnort, Sprachen',
          body: 'For each card, say one clear sentence. Short and correct is better than long and risky.',
          table: [
            ['Land', 'Ich komme aus …'],
            ['Wohnort', 'Ich wohne in …'],
            ['Sprachen', 'Ich spreche …'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'The card says “Wohnort”. What do you say?',
          options: ['Ich wohne in Leipzig.', 'Ich komme aus Kanada.', 'Ich spreche Englisch.'],
          answer: 0,
          explanation: 'Wohnort is where you live.',
        },
        {
          kind: 'choose',
          prompt: 'The card says “Land”. Which sentence fits?',
          options: ['Ich komme aus Kanada.', 'Ich wohne in Leipzig.', 'Ich heiße Alex.'],
          answer: 0,
          explanation: 'Land means country: where you come from.',
        },
        {
          kind: 'match',
          prompt: 'Unit 2 review: match the pairs.',
          pairs: [
            ['Woher kommst du?', 'Where are you from?'],
            ['Wo wohnst du?', 'Where do you live?'],
            ['ein bisschen', 'a little'],
            ['seit zwei Wochen', 'for two weeks'],
            ['Ich lerne Deutsch.', 'I am learning German.'],
          ],
        },
        {
          kind: 'speak',
          prompt:
            'Answer the cards Name, Land, Wohnort and Sprachen about yourself, one sentence each.',
          lines: [
            'Ich heiße Alex.',
            'Ich komme aus Kanada.',
            'Ich wohne in Leipzig.',
            'Ich spreche Englisch und ein bisschen Deutsch.',
          ],
        },
      ],
    },
  ],
);

const karimProfile =
  'Karim Haddad ist 31 Jahre alt. Er kommt aus Ägypten und wohnt jetzt in Leipzig, in der Goethestraße 14. Seine Handynummer ist 0176 5512 4407.';

const unit3 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u3',
    number: 3,
    icon: 'numeric',
    title: 'Zahlen, Alter, Namen',
    canDo:
      'Understand and say numbers, ages, prices and phone numbers, and spell your name the German way.',
  },
  [
    {
      id: 'de-a1-u3-numbers',
      session: 'Words',
      title: 'Numbers from 0 to 20',
      outcome: 'Count to twenty and catch numbers when people say them quickly.',
      minutes: 5,
      steps: [
        {
          kind: 'scene',
          title: 'At the gym',
          intro: 'Alex joins a gym. The trainer gives out a locker key.',
          lines: [
            {
              speaker: 'Trainer',
              text: 'Hallo! Du bist neu, oder? Hier ist dein Schlüssel: Nummer zwölf.',
              real: 'Hi! Bist neu, oder? Hier, dein Schlüssel. Die Zwölf.',
              meaning: 'Hi! You are new, right? Here is your key: number twelve.',
            },
            { speaker: 'Alex', text: 'Zwölf? Danke!', meaning: 'Twelve? Thanks!' },
            {
              speaker: 'Trainer',
              text: 'Und der Kurs ist in Raum drei.',
              meaning: 'And the class is in room three.',
            },
            { speaker: 'Alex', text: 'Raum drei. Okay!', meaning: 'Room three. OK!' },
            { speaker: 'Trainer', text: 'Viel Spaß!', meaning: 'Have fun!' },
          ],
          note: 'Gyms usually use du, even with new people. And numbers used as names are feminine: die Zwölf (locker 12), die Elf (tram number 11).',
        },
        {
          kind: 'teach',
          title: 'Numbers from 0 to 10',
          items: [
            {
              target: 'null, eins, zwei, drei',
              meaning: '0, 1, 2, 3',
              note: 'Eins when you count; before a noun it is ein or eine.',
            },
            {
              target: 'vier, fünf, sechs',
              meaning: '4, 5, 6',
              note: 'In sechs, chs sounds like ks.',
            },
            {
              target: 'sieben, acht, neun, zehn',
              meaning: '7, 8, 9, 10',
              note: 'The z in zehn sounds like ts.',
            },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the numbers.',
          pairs: [
            ['drei', '3'],
            ['acht', '8'],
            ['fünf', '5'],
            ['zehn', '10'],
            ['sechs', '6'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which room?',
          audio: 'Der Kurs ist in Raum neun.',
          options: ['Room 9', 'Room 5', 'Room 10'],
          answer: 0,
          explanation: 'You heard “Raum neun”: room nine.',
        },
        {
          kind: 'teach',
          title: 'Numbers from 11 to 20',
          items: [
            {
              target: 'elf, zwölf',
              meaning: '11, 12',
              note: 'Special words, like eleven and twelve.',
            },
            {
              target: 'dreizehn, vierzehn, fünfzehn',
              meaning: '13, 14, 15',
              note: 'Number + zehn, like English -teen.',
            },
            {
              target: 'sechzehn, siebzehn',
              meaning: '16, 17',
              note: 'Careful: sechzehn drops the s of sechs, and siebzehn drops the -en of sieben.',
            },
            { target: 'achtzehn, neunzehn, zwanzig', meaning: '18, 19, 20' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Which word is 17?',
          options: ['siebzehn', 'siebenzehn', 'siebzig'],
          answer: 0,
          explanation: 'siebzehn: sieben loses -en. Siebzig is 70.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which locker number?',
          audio: 'Ihr Schrank ist die Nummer sechzehn.',
          options: ['16', '6', '60'],
          answer: 0,
          explanation: 'You heard “sechzehn”: 16. Sechs is 6 and sechzig is 60.',
        },
        {
          kind: 'teach',
          title: 'How numbers sound in real life',
          items: [
            {
              target: 'zwo',
              meaning: 'two',
              note: 'On the phone and in announcements, people often say zwo, so it is not confused with drei.',
            },
            {
              target: 'die Nummer',
              meaning: 'the number',
              note: 'Hier ist dein Schlüssel, Nummer zwölf.',
            },
          ],
        },
        {
          kind: 'build',
          prompt: 'Say: “The class is in room twelve.”',
          answer: ['Der', 'Kurs', 'ist', 'in', 'Raum', 'zwölf.'],
          extra: ['zwanzig'],
          explanation: 'in Raum zwölf: in room twelve. No article before a room number.',
        },
        {
          kind: 'type',
          prompt: 'Write 13 as a word.',
          accepted: ['dreizehn'],
          hint: 'drei + zehn',
          explanation: 'dreizehn: three + ten, like thirteen.',
        },
        {
          kind: 'speak',
          prompt: 'Count from zero to twenty, then say your locker number.',
          lines: [
            'null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn',
            'elf, zwölf, dreizehn, vierzehn, fünfzehn',
            'Meine Nummer ist zwölf.',
          ],
          tip: 'In zwölf, ö is the e of “her” said with rounded lips, and z is ts: tsvölf.',
        },
      ],
    },
    {
      id: 'de-a1-u3-age-prices',
      session: 'Grammar',
      title: 'From 21 to 100: age and prices',
      outcome: 'Say big numbers the German way, give your age and understand prices.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'Units first, then tens',
          body: 'From 21, German says the units first, then und, then the tens, all in one word: 21 is einundzwanzig, “one-and-twenty”. When you hear a number, write the second digit first.',
          table: [
            ['21', 'einundzwanzig'],
            ['34', 'vierunddreißig'],
            ['47', 'siebenundvierzig'],
            ['58', 'achtundfünfzig'],
            ['99', 'neunundneunzig'],
            ['100', 'hundert'],
          ],
        },
        {
          kind: 'teach',
          title: 'The tens',
          items: [
            {
              target: 'zwanzig, dreißig, vierzig',
              meaning: '20, 30, 40',
              note: 'Dreißig ends in -ßig, not -zig.',
            },
            {
              target: 'fünfzig, sechzig, siebzig',
              meaning: '50, 60, 70',
              note: 'Sechzig and siebzig are shortened, like sechzehn and siebzehn.',
            },
            { target: 'achtzig, neunzig, hundert', meaning: '80, 90, 100' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Which word is 63?',
          options: ['dreiundsechzig', 'sechsunddreißig', 'sechzigdrei'],
          answer: 0,
          explanation: 'Units first: drei-und-sechzig, three and sixty.',
        },
        {
          kind: 'choose',
          prompt: 'Listen and choose the number.',
          audio: 'achtundvierzig',
          options: ['48', '84', '40'],
          answer: 0,
          explanation: 'acht-und-vierzig: eight and forty, 48.',
        },
        {
          kind: 'rule',
          title: 'Prices',
          body: 'Prices are written with a comma: 3,50 €. People say the euros, then the cents, without “and”: drei Euro fünfzig. Euro does not change after a number: zehn Euro.',
          examples: ['Das kostet drei Euro fünfzig.', 'Was kostet das?', 'Das macht zwölf Euro.'],
        },
        {
          kind: 'choose',
          prompt: 'Listen. How much do you pay?',
          audio: 'Das macht dreiundzwanzig Euro fünfzig.',
          options: ['€23.50', '€32.50', '€23.15'],
          answer: 0,
          explanation: 'drei-und-zwanzig Euro fünfzig: €23.50.',
        },
        {
          kind: 'teach',
          title: 'Age and prices',
          items: [
            {
              target: 'Wie alt bist du?',
              meaning: 'How old are you?',
              note: 'Sie: Wie alt sind Sie?',
            },
            {
              target: 'Ich bin dreißig.',
              meaning: 'I am thirty.',
              note: 'You can add Jahre alt: Ich bin dreißig Jahre alt.',
            },
            { target: 'Was kostet das?', meaning: 'How much is it?' },
            {
              target: 'Das macht …',
              meaning: 'That comes to …',
              note: 'What you hear at the till.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Lena is 27. What does she say?',
          options: [
            'Ich bin siebenundzwanzig.',
            'Ich habe siebenundzwanzig.',
            'Ich bin zweiundsiebzig.',
          ],
          answer: 0,
          explanation:
            'German uses sein for age, like English: Ich bin 27. Not haben, as in Spanish or French.',
        },
        {
          kind: 'build',
          prompt: 'Ask a friend: “How old are you?”',
          answer: ['Wie', 'alt', 'bist', 'du?'],
          extra: ['sind'],
          explanation: 'Wie alt + verb + du?',
        },
        {
          kind: 'choose',
          prompt: 'Look at the menu. What does the cake cost?',
          context: 'Kaffee 2,80 €\nTee 2,50 €\nKuchen 3,90 €',
          options: ['drei Euro neunzig', 'neun Euro dreißig', 'drei Euro neunzehn'],
          answer: 0,
          explanation: 'Kuchen (cake) costs 3,90 €: drei Euro neunzig.',
        },
        {
          kind: 'type',
          prompt: 'Write 45 as a word.',
          accepted: ['fünfundvierzig'],
          hint: 'Units first: fünf + und + vierzig.',
          explanation: 'fünfundvierzig: five and forty.',
        },
        {
          kind: 'speak',
          prompt: 'Say your age, then ask the price of something and repeat the answer.',
          lines: ['Ich bin dreißig.', 'Was kostet das?', 'Zwei Euro achtzig? Okay, danke!'],
        },
      ],
    },
    {
      id: 'de-a1-u3-spelling',
      session: 'Real talk',
      title: 'Spell your name, give your number',
      outcome:
        'Spell your name the way people do on the phone, and give phone numbers and email addresses.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'A call to the gym',
          intro:
            'Alex calls a gym to book a trial session. The receptionist needs a name and a number.',
          lines: [
            {
              speaker: 'Rezeption',
              text: 'Fitnessstudio Süd, guten Tag! Was kann ich für Sie tun?',
              meaning: 'Fitness Studio Süd, hello! What can I do for you?',
            },
            {
              speaker: 'Alex',
              text: 'Guten Tag! Ich möchte ein Probetraining machen.',
              meaning: 'Hello! I would like to do a trial session.',
            },
            {
              speaker: 'Rezeption',
              text: 'Gern. Wie ist Ihr Name, bitte?',
              meaning: 'Sure. What is your name, please?',
            },
            { speaker: 'Alex', text: 'Novak.', meaning: 'Novak.' },
            {
              speaker: 'Rezeption',
              text: 'Wie schreibt man das?',
              meaning: 'How do you spell that?',
            },
            {
              speaker: 'Alex',
              text: 'N, O, V wie Viktor, A, K.',
              meaning: 'N, O, V as in Viktor, A, K.',
            },
            {
              speaker: 'Rezeption',
              text: 'Danke. Und Ihre Handynummer?',
              meaning: 'Thanks. And your mobile number?',
            },
            {
              speaker: 'Alex',
              text: 'Null eins sieben sechs, zwei drei, vier vier, eins acht.',
              real: 'Null eins sieben sechs, zwo drei, vierundvierzig, achtzehn.',
              meaning: '0176 23 44 18.',
            },
            {
              speaker: 'Rezeption',
              text: 'Super, danke. Bis dann!',
              meaning: 'Great, thanks. See you!',
            },
          ],
          note: 'Germans often say phone numbers in pairs (vierundvierzig, achtzehn) and use zwo for 2. Mobile numbers start with 015, 016 or 017. Mobile phone is das Handy.',
        },
        {
          kind: 'teach',
          title: 'Letters that sound different',
          items: [
            {
              target: 'A, E, I',
              meaning: 'a, e, i',
              note: 'A is “ah”, E is “eh”, I is “ee”. English speakers often mix up E and I.',
            },
            { target: 'J, V, W', meaning: 'j, v, w', note: 'J is “yot”, V is “fow”, W is “veh”.' },
            { target: 'Y, Z', meaning: 'y, z', note: 'Y is “üpsilon”, Z is “tset”.' },
            {
              target: 'Ä, Ö, Ü, ß',
              meaning: 'a, o, u with umlaut; sharp s',
              note: 'Say ä, ö, ü as their sounds, or A-Umlaut. ß is called Eszett.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which name is spelled?',
          audio: 'W, A, G, N, E, R',
          options: ['Wagner', 'Vagner', 'Wegner'],
          answer: 0,
          explanation: 'W (veh), A (ah), G, N, E (eh), R: Wagner.',
        },
        {
          kind: 'teach',
          title: 'Spelling on the phone',
          items: [
            {
              target: 'Wie schreibt man das?',
              meaning: 'How do you spell that?',
              note: 'Literally: how does one write that? The everyday question.',
            },
            {
              target: 'Können Sie das buchstabieren?',
              meaning: 'Can you spell that?',
              note: 'Buchstabieren: to spell. You will hear it in the exam.',
            },
            {
              target: 'V wie Viktor',
              meaning: 'V as in Viktor',
              note: 'To be clear on the phone, people say a word for a letter. Many use traditional first names (A wie Anton, M wie Martha); the official standard since 2022 uses cities (L wie Leipzig). Any clear word works.',
            },
            {
              target: 'das Handy',
              meaning: 'mobile phone',
              note: 'A German word, even if it looks English. Handynummer: mobile number.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which letter?',
          audio: 'J wie Julius',
          options: ['J', 'Y', 'G'],
          answer: 0,
          explanation: 'J (yot) wie Julius.',
        },
        {
          kind: 'teach',
          title: 'Email addresses',
          items: [
            {
              target: 'at',
              meaning: '@',
              note: 'Said as in English. Some people say Klammeraffe, “bracket monkey”.',
            },
            { target: 'Punkt', meaning: 'dot (.)', note: 'Also a full stop.' },
            { target: 'Bindestrich', meaning: 'hyphen (-)' },
            {
              target: 'alles klein',
              meaning: 'all lower case',
              note: 'What people add when they spell an email address.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which email address?',
          audio: 'alex Punkt novak, at, web Punkt D E. Alles klein.',
          options: ['alex.novak@web.de', 'alexnovak@web.de', 'alex.novak@web.com'],
          answer: 0,
          explanation:
            'alex Punkt novak at web Punkt D E: alex.novak@web.de. Germany’s domain is .de.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which phone number?',
          audio: 'Meine Nummer ist null eins fünf eins, achtundsechzig, zweiundneunzig, null drei.',
          options: ['0151 68 92 03', '0151 86 29 03', '0115 68 92 03'],
          answer: 0,
          explanation:
            'achtundsechzig is 68 and zweiundneunzig is 92: units first, so write the second digit first.',
        },
        {
          kind: 'build',
          prompt: 'Ask politely: “Can you spell that?”',
          answer: ['Können', 'Sie', 'das', 'buchstabieren?'],
          extra: ['heißen'],
          explanation:
            'A yes/no question: the verb können comes first, buchstabieren goes to the end.',
        },
        {
          kind: 'type',
          prompt: 'Write the everyday question “How do you spell that?”',
          accepted: ['Wie schreibt man das?'],
          hint: 'Wie + schreibt + man + das?',
          explanation:
            'Wie schreibt man das? is what people ask on the phone, in shops and at offices.',
        },
        {
          kind: 'speak',
          prompt:
            'Spell your family name, using “wie” for a letter that is easy to mishear. Then say your phone number in pairs. Use your own details.',
          lines: [
            'N, O, V wie Viktor, A, K.',
            'Null eins sieben sechs, zwo drei, vierundvierzig, achtzehn.',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u3-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: numbers you hear, a form you fill',
      outcome:
        'Catch numbers in Hören, fill a Schreiben Teil 1 form, and give the whole Sprechen Teil 1 introduction.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: listen for the final number',
          body: 'In Goethe A1 Hören, speakers often say one number, then correct it or give another. The question asks for the final detail. Listen for words like nicht … sondern (not … but) and nein, Moment (no, wait).',
        },
        {
          kind: 'choose',
          prompt: 'Hören Teil 3: a phone message. Wo ist der Kurs morgen?',
          audio:
            'Hallo, hier ist Frau Schulz von der Sprachschule. Der Kurs ist morgen nicht in Raum zwölf, sondern in Raum zwanzig. Bis morgen!',
          options: ['Raum 12', 'Raum 20', 'Raum 2'],
          answer: 1,
          explanation:
            '“Nicht in Raum zwölf, sondern in Raum zwanzig”: not 12 but 20. The first number is the trap.',
        },
        {
          kind: 'choose',
          prompt: 'Hören Teil 1. Wie alt ist Lena?',
          audio: 'Lena ist sechsundzwanzig. Nein, Moment, sie ist schon siebenundzwanzig!',
          options: ['26', '27', '72'],
          answer: 1,
          explanation: '“Nein, Moment”: the speaker corrects himself. Lena is already (schon) 27.',
        },
        {
          kind: 'rule',
          title: 'The exam: Schreiben Teil 1',
          body: 'In Schreiben Teil 1, you read a short text about a person and fill five gaps in a form, such as Familienname, Alter, Wohnort or Telefonnummer. Copy names and numbers exactly from the text.',
        },
        {
          kind: 'teach',
          title: 'More words on forms',
          items: [
            { target: 'das Alter', meaning: 'age' },
            { target: 'der Wohnort', meaning: 'place of residence', note: 'Where you live.' },
            {
              target: 'die Straße',
              meaning: 'street',
              note: 'Often written Str.: Goethestr. 14. The house number comes after the street.',
            },
            { target: 'die Hausnummer', meaning: 'house number' },
            { target: 'die Telefonnummer', meaning: 'phone number' },
          ],
        },
        {
          kind: 'type',
          prompt: 'Formular: Alter. Write the number.',
          context: karimProfile,
          accepted: ['31', 'einunddreißig'],
          hint: 'Find “Jahre alt” in the text.',
          explanation: 'Karim ist 31 Jahre alt.',
        },
        {
          kind: 'type',
          prompt: 'Formular: Wohnort.',
          context: karimProfile,
          accepted: ['Leipzig'],
          hint: 'Where does he live now?',
          explanation:
            'He comes from Egypt but wohnt (lives) in Leipzig. Wohnort is where you live.',
        },
        {
          kind: 'choose',
          prompt: 'Formular: Hausnummer.',
          context: karimProfile,
          options: ['14', '31', '44'],
          answer: 0,
          explanation: 'Goethestraße 14: the house number comes after the street name.',
        },
        {
          kind: 'rule',
          title: 'Sprechen Teil 1: your whole introduction',
          body: 'You can now answer five cards: Name, Alter, Land, Wohnort and Sprachen. The examiner may then ask you to spell your name or give a number. Beruf (job) and Hobby come in later units.',
          examples: [
            'Ich heiße Alex Novak.',
            'Ich bin dreißig Jahre alt.',
            'Ich komme aus Kanada und wohne in Leipzig.',
            'Ich spreche Englisch, Französisch und ein bisschen Deutsch.',
          ],
        },
        {
          kind: 'choose',
          prompt: 'The examiner asks: “Wie ist Ihre Telefonnummer?” Which answer fits?',
          options: [
            'Meine Nummer ist null eins sieben sechs, zwo drei, vierundvierzig, achtzehn.',
            'Ich bin dreißig.',
            'Ich wohne in Raum zwölf.',
          ],
          answer: 0,
          explanation: 'Meine Nummer ist … followed by the digits, in pairs or one by one.',
        },
        {
          kind: 'match',
          prompt: 'Unit 3 review: match the numbers.',
          pairs: [
            ['dreißig', '30'],
            ['siebzehn', '17'],
            ['sechzig', '60'],
            ['zweiundzwanzig', '22'],
            ['neunundneunzig', '99'],
          ],
        },
        {
          kind: 'speak',
          prompt:
            'Give the whole introduction about yourself, then spell your family name. Use your own details.',
          lines: [
            'Ich heiße Alex Novak. Ich bin dreißig Jahre alt.',
            'Ich komme aus Kanada und wohne in Leipzig.',
            'Ich spreche Englisch und ein bisschen Deutsch.',
            'Novak: N, O, V, A, K.',
          ],
        },
      ],
    },
  ],
);

const lenaMessage =
  'Hallo Alex,\nam Samstag kommen meine Eltern nach Leipzig. Mein Vater hat Geburtstag, er wird sechzig! Meine Oma kommt auch mit. Wir gehen zusammen essen. Jonas kommt leider nicht, er ist am Wochenende in Hamburg. Kommst du mit?\nLiebe Grüße\nLena';

const unit4 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u4',
    number: 4,
    icon: 'account-group',
    title: 'Meine Familie',
    canDo: 'Talk about your family and the people you live with, and ask about theirs.',
  },
  [
    {
      id: 'de-a1-u4-family',
      session: 'Words',
      title: 'Family, friends and flatmates',
      outcome: 'Name the people in your life the way Germans talk about them.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Photos on the phone',
          intro: 'In the course break, Maria shows Alex photos on her phone.',
          lines: [
            {
              speaker: 'Maria',
              text: 'Schau mal, das ist meine Familie.',
              meaning: 'Look, this is my family.',
            },
            { speaker: 'Alex', text: 'Oh, schön! Wer ist das?', meaning: 'Oh, nice! Who is that?' },
            {
              speaker: 'Maria',
              text: 'Das ist meine Mutter, und das ist mein Vater.',
              real: 'Das ist meine Mama, und das ist mein Papa.',
              meaning: 'That is my mother, and that is my father.',
              realMeaning: 'That is my mum, and that is my dad.',
            },
            {
              speaker: 'Alex',
              text: 'Und das? Ist das deine Schwester?',
              meaning: 'And that? Is that your sister?',
            },
            {
              speaker: 'Maria',
              text: 'Ja, das ist Ana. Sie ist achtzehn und wohnt noch zu Hause.',
              meaning: 'Yes, that is Ana. She is eighteen and still lives at home.',
            },
            {
              speaker: 'Alex',
              text: 'Hast du noch Geschwister?',
              real: 'Und, hast du noch mehr Geschwister?',
              meaning: 'Do you have any other brothers or sisters?',
            },
            {
              speaker: 'Maria',
              text: 'Nein, nur Ana.',
              real: 'Nee, nur Ana.',
              meaning: 'No, just Ana.',
            },
          ],
          note: 'Adults in Germany often say Mama and Papa, not only children. Mutter and Vater sound more formal.',
        },
        {
          kind: 'teach',
          title: 'Family',
          items: [
            { target: 'die Familie', meaning: 'family' },
            { target: 'die Eltern', meaning: 'parents', note: 'Always plural.' },
            { target: 'die Mutter / die Mama', meaning: 'mother / mum' },
            { target: 'der Vater / der Papa', meaning: 'father / dad' },
            { target: 'der Bruder', meaning: 'brother' },
            { target: 'die Schwester', meaning: 'sister' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Maria says “meine Mama”. Who is she talking about?',
          options: ['Her mother', 'Her grandmother', 'Her sister'],
          answer: 0,
          explanation: 'Mama is mum. Grown-ups use it too.',
        },
        {
          kind: 'teach',
          title: 'More family',
          items: [
            {
              target: 'die Geschwister',
              meaning: 'brothers and sisters, siblings',
              note: 'Germans use this word all the time: Hast du Geschwister?',
            },
            { target: 'das Kind, die Kinder', meaning: 'child, children' },
            { target: 'der Sohn / die Tochter', meaning: 'son / daughter' },
            {
              target: 'die Oma / der Opa',
              meaning: 'grandma / grandpa',
              note: 'Much more common in speech than Großmutter and Großvater.',
            },
            { target: 'die Großeltern', meaning: 'grandparents' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the family words.',
          pairs: [
            ['die Eltern', 'parents'],
            ['die Geschwister', 'siblings'],
            ['die Tochter', 'daughter'],
            ['der Opa', 'grandpa'],
            ['die Großeltern', 'grandparents'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Who lives in Hamburg?',
          audio: 'Meine Eltern wohnen in Köln, aber meine Schwester wohnt in Hamburg.',
          options: ['Her sister', 'Her parents', 'Her brother'],
          answer: 0,
          explanation: 'You heard “meine Schwester wohnt in Hamburg”. Her parents live in Köln.',
        },
        {
          kind: 'teach',
          title: 'Friends, partners, flatmates',
          items: [
            {
              target: 'eine Freundin von mir',
              meaning: 'a (female) friend of mine',
              note: 'For a man: ein Freund von mir.',
            },
            {
              target: 'mein Freund / meine Freundin',
              meaning: 'my boyfriend / my girlfriend',
              note: 'Often means a partner, not just a friend. Many women do say meine Freundin for a close friend.',
            },
            { target: 'mein Partner / meine Partnerin', meaning: 'my partner' },
            {
              target: 'mein Mitbewohner / meine Mitbewohnerin',
              meaning: 'my flatmate',
              note: 'In a WG (Wohngemeinschaft), a shared flat.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Jonas says: “Das ist meine Freundin Sophie.” What does he most likely mean?',
          options: [
            'Sophie is his girlfriend',
            'Sophie is a friend from work',
            'Sophie is his sister',
          ],
          answer: 0,
          explanation:
            'When a man says meine Freundin, he usually means his girlfriend. A friend would be eine Freundin von mir.',
        },
        {
          kind: 'choose',
          prompt: 'Alex introduces Lena as a friend, not a partner. Which is clearest?',
          options: [
            'Das ist Lena, eine Freundin von mir.',
            'Das ist meine Freundin Lena.',
            'Das ist mein Freund Lena.',
          ],
          answer: 0,
          explanation:
            'Eine Freundin von mir is clearly a friend. Meine Freundin can mean girlfriend. Mein Freund is for a man.',
        },
        {
          kind: 'build',
          prompt: 'Say: “This is my brother.”',
          answer: ['Das', 'ist', 'mein', 'Bruder.'],
          extra: ['meine'],
          explanation: 'der Bruder → mein Bruder. Die words take meine: meine Schwester.',
        },
        {
          kind: 'type',
          prompt: 'Write: “I have a sister.”',
          accepted: ['Ich habe eine Schwester.'],
          hint: 'Ich habe + eine + Schwester.',
          explanation:
            'Ich habe eine Schwester. With a brother it is einen: Ich habe einen Bruder.',
        },
        {
          kind: 'speak',
          prompt: 'Talk about your family: who they are and where they live. Use your own family.',
          lines: [
            'Das ist meine Familie.',
            'Meine Eltern wohnen in Toronto.',
            'Ich habe einen Bruder und eine Schwester.',
          ],
          tip: 'Geschwister: stress on -schwis-, and w sounds like v: ge-SHVIS-ter.',
        },
      ],
    },
    {
      id: 'de-a1-u4-haben',
      session: 'Grammar',
      title: 'haben, and mein, dein, sein, ihr',
      outcome: 'Say what people have, and whose family member someone is.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'haben: to have',
          body: 'Haben is irregular with du and er / sie: du hast and er hat, without the b.',
          table: [
            ['ich habe', 'I have'],
            ['du hast', 'you have'],
            ['er / sie hat', 'he / she has'],
            ['wir haben', 'we have'],
            ['ihr habt', 'you have (two or more)'],
            ['sie / Sie haben', 'they have / you have (Sie)'],
          ],
          examples: ['Ich habe zwei Brüder.', 'Hast du Kinder?', 'Sie hat eine Tochter.'],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Karim ___ zwei Schwestern.',
          options: ['hat', 'habt', 'hast'],
          answer: 0,
          explanation: 'er / sie: hat. Karim hat zwei Schwestern.',
        },
        {
          kind: 'build',
          prompt: 'Ask a friend: “Do you have siblings?”',
          answer: ['Hast', 'du', 'Geschwister?'],
          extra: ['Habt'],
          explanation: 'du hast. A yes/no question starts with the verb.',
        },
        {
          kind: 'choose',
          prompt: 'You ask two friends. Complete: Ihr ___ eine große Familie, oder?',
          options: ['habt', 'hat', 'haben'],
          answer: 0,
          explanation: 'ihr habt: you (two or more people) have.',
        },
        {
          kind: 'rule',
          title: 'mein and dein',
          body: 'Mein (my) and dein (your, for du) work like ein: no ending with der and das words, -e with die words and with plurals.',
          table: [
            ['der Bruder', 'mein Bruder'],
            ['das Kind', 'mein Kind'],
            ['die Schwester', 'meine Schwester'],
            ['die Eltern (plural)', 'meine Eltern'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Das ist ___ Mutter.',
          options: ['meine', 'mein', 'meinen'],
          answer: 0,
          explanation: 'die Mutter → meine Mutter.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ist das ___ Vater?',
          options: ['dein', 'deine', 'deinen'],
          answer: 0,
          explanation: 'der Vater → dein Vater.',
        },
        {
          kind: 'rule',
          title: 'his, her, your (Sie)',
          body: 'Sein means his. Ihr means her, and also their. Ihr with a capital I means your, for someone you call Sie. They take the same endings as mein.',
          table: [
            ['sein Bruder / seine Schwester', 'his'],
            ['ihr Bruder / ihre Schwester', 'her'],
            ['Ihr Bruder / Ihre Schwester', 'your (Sie)'],
          ],
          examples: ['Jonas und seine Schwester', 'Maria und ihre Eltern', 'Wie heißt Ihr Sohn?'],
        },
        {
          kind: 'teach',
          title: 'Words for forms and small talk',
          items: [
            { target: 'verheiratet', meaning: 'married' },
            {
              target: 'ledig',
              meaning: 'single (on forms)',
              note: 'Familienstand: ledig. In speech, people say Ich bin Single.',
            },
            { target: 'geschieden', meaning: 'divorced' },
            { target: 'das Einzelkind', meaning: 'only child', note: 'Ich bin Einzelkind.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Ana is Maria’s sister. Complete: Maria und ___ Schwester.',
          options: ['ihre', 'seine', 'ihr'],
          answer: 0,
          explanation: 'Her: ihr. Die Schwester needs -e: ihre Schwester.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Jonas und ___ Eltern.',
          options: ['seine', 'sein', 'ihre'],
          answer: 0,
          explanation: 'His: sein. Plural needs -e: seine Eltern.',
        },
        {
          kind: 'type',
          prompt: 'Ask a friend: “Is that your brother?”',
          accepted: ['Ist das dein Bruder?'],
          hint: 'Ist + das + dein + Bruder?',
          explanation: 'der Bruder → dein Bruder.',
        },
        {
          kind: 'speak',
          prompt: 'Say something about one person in your family, then ask about your friend’s.',
          lines: [
            'Ich habe eine Schwester. Sie heißt Sara.',
            'Mein Vater ist sechzig.',
            'Hast du Geschwister?',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u4-real',
      session: 'Real talk',
      title: '“Der ist zwanzig”: family talk as people say it',
      outcome: 'Understand how people really talk about family, and keep the questions friendly.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Breakfast in the shared flat',
          intro: 'Sunday breakfast. Lena asks Alex about family.',
          lines: [
            {
              speaker: 'Lena',
              text: 'Und, hast du Geschwister?',
              meaning: 'So, do you have brothers or sisters?',
            },
            {
              speaker: 'Alex',
              text: 'Ja, einen Bruder. Er ist zwanzig und studiert in Montreal.',
              real: 'Ja, ’nen Bruder. Der ist zwanzig und studiert in Montreal.',
              meaning: 'Yes, a brother. He is twenty and studies in Montreal.',
            },
            {
              speaker: 'Lena',
              text: 'Cool! Und deine Eltern?',
              meaning: 'Cool! And your parents?',
            },
            {
              speaker: 'Alex',
              text: 'Sie wohnen in Toronto.',
              real: 'Die wohnen in Toronto.',
              meaning: 'They live in Toronto.',
            },
            {
              speaker: 'Lena',
              text: 'Ich bin Einzelkind. Aber meine Oma wohnt hier in Leipzig.',
              meaning: 'I am an only child. But my grandma lives here in Leipzig.',
            },
            {
              speaker: 'Alex',
              text: 'Ach, schön! Wie alt ist sie?',
              meaning: 'Oh, nice! How old is she?',
            },
            {
              speaker: 'Lena',
              text: 'Sie ist zweiundachtzig, aber total fit!',
              real: 'Die ist zweiundachtzig, aber total fit!',
              meaning: 'She is eighty-two, but really fit!',
            },
          ],
          note: 'In speech, people often say der, die or das instead of er, sie or es, and einen shrinks to ’nen.',
        },
        {
          kind: 'rule',
          title: 'der, die, das for he, she, they',
          body: 'In everyday speech, der, die and das often replace er, sie and es, especially at the start of a sentence. It is not rude; it is normal spoken German. In writing, use er, sie and es.',
          table: [
            ['Er ist zwanzig.', 'Der ist zwanzig.'],
            ['Sie wohnen in Toronto.', 'Die wohnen in Toronto.'],
            ['Sie ist total fit.', 'Die ist total fit.'],
          ],
        },
        {
          kind: 'choose',
          prompt:
            'Lena asks about Alex’s parents. Alex says: “Die wohnen in Toronto.” What does die mean here?',
          options: ['they', 'the', 'she'],
          answer: 0,
          explanation: 'Die stands for die Eltern: they. In writing: Sie wohnen in Toronto.',
        },
        {
          kind: 'teach',
          title: 'Talking about family',
          items: [
            {
              target: 'Wie viele Geschwister hast du?',
              meaning: 'How many brothers and sisters do you have?',
            },
            { target: 'Ich bin Einzelkind.', meaning: 'I am an only child.' },
            {
              target: 'Er ist älter. / Sie ist jünger.',
              meaning: 'He is older. / She is younger.',
            },
            {
              target: 'Wir verstehen uns gut.',
              meaning: 'We get on well.',
              note: 'A very common phrase about family and flatmates.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. How many brothers and sisters does Karim have?',
          audio: 'Ich habe drei Geschwister: zwei Brüder und eine Schwester.',
          options: ['Three', 'Two', 'One'],
          answer: 0,
          explanation: 'Drei Geschwister: two brothers and one sister.',
        },
        {
          kind: 'teach',
          title: 'Words you hear a lot',
          items: [
            {
              target: 'der Kumpel',
              meaning: 'mate, buddy',
              note: 'Casual, mostly about men: Das ist mein Kumpel Tim.',
            },
            {
              target: 'die WG',
              meaning: 'shared flat',
              note: 'Short for Wohngemeinschaft. Very common for students and young workers.',
            },
            { target: 'Single', meaning: 'single, not in a relationship', note: 'Ich bin Single.' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match what you hear.',
          pairs: [
            ['der Kumpel', 'mate'],
            ['das Einzelkind', 'only child'],
            ['die WG', 'shared flat'],
            ['Single', 'not in a relationship'],
            ['Wir verstehen uns gut.', 'We get on well.'],
          ],
        },
        {
          kind: 'rule',
          title: 'Friendly questions',
          body: 'Family is normal small talk in Germany, but people are private about some things. Questions about a partner, about children, or about why someone has none can feel too personal with people you have just met. Ask open questions like “Hast du Geschwister?” and let people decide what to share.',
        },
        {
          kind: 'choose',
          prompt: 'You have just met a colleague of Lena’s. Which question is easy small talk?',
          options: ['Hast du Geschwister?', 'Warum hast du keine Kinder?', 'Bist du verheiratet?'],
          answer: 0,
          explanation:
            'Siblings are an easy topic. Children and marriage can wait until people tell you themselves.',
        },
        {
          kind: 'build',
          prompt: 'Say casually about your parents: “They live in Toronto.”',
          answer: ['Die', 'wohnen', 'in', 'Toronto.'],
          extra: ['Der'],
          explanation: 'Die for they, as people say it. In writing: Sie wohnen in Toronto.',
        },
        {
          kind: 'type',
          prompt: 'Answer Lena: “I am an only child.”',
          accepted: ['Ich bin Einzelkind.', 'Ich bin ein Einzelkind.'],
          hint: 'Ich bin + Einzelkind.',
          explanation: 'Ich bin Einzelkind: usually without ein.',
        },
        {
          kind: 'speak',
          prompt:
            'Answer Lena’s questions about your family, the everyday way. Use your own details.',
          lines: [
            'Ja, ’nen Bruder. Der ist zwanzig.',
            'Die wohnen in Toronto.',
            'Wir verstehen uns gut.',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u4-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: ask and answer about family',
      outcome:
        'Do a Sprechen Teil 2 task with word cards, and a Lesen task about a family weekend.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: Sprechen Teil 2',
          body: 'In Sprechen Teil 2, the group gets a topic, for example Familie, and everyone draws a word card such as Geschwister, Kinder or Wohnort. You use your card to ask someone a question, and you answer the question someone asks you. One clear question and one clear answer are enough.',
        },
        {
          kind: 'teach',
          title: 'Questions about family',
          items: [
            { target: 'Hast du Kinder? / Haben Sie Kinder?', meaning: 'Do you have children?' },
            { target: 'Wie heißt deine Mutter?', meaning: 'What is your mother’s name?' },
            { target: 'Wo wohnen deine Eltern?', meaning: 'Where do your parents live?' },
            { target: 'Wie alt ist dein Bruder?', meaning: 'How old is your brother?' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Topic: Familie. Your card says “Geschwister”. Which question works?',
          options: ['Hast du Geschwister?', 'Geschwister ist gut.', 'Wo ist Geschwister?'],
          answer: 0,
          explanation: 'Use the card word in a real question: Hast du Geschwister?',
        },
        {
          kind: 'choose',
          prompt: 'Your card says “Kinder”. Which question works?',
          options: ['Haben Sie Kinder?', 'Sind Sie Kinder?', 'Kinder Sie haben?'],
          answer: 0,
          explanation: 'Haben Sie Kinder? The verb comes first in a yes/no question.',
        },
        {
          kind: 'build',
          prompt: 'Your card says “Wohnort”. Ask: “Where do your parents live?”',
          answer: ['Wo', 'wohnen', 'deine', 'Eltern?'],
          extra: ['dein', 'wohnt'],
          explanation: 'Eltern is plural: deine Eltern, and the verb is wohnen.',
        },
        {
          kind: 'choose',
          prompt: 'Someone asks you: “Wie alt ist dein Vater?” Which answer fits?',
          options: ['Er ist dreiundsechzig.', 'Er heißt Peter.', 'Er wohnt in Bonn.'],
          answer: 0,
          explanation: 'Wie alt asks the age: Er ist dreiundsechzig (63).',
        },
        {
          kind: 'rule',
          title: 'Lesen: a message about the weekend',
          body: 'Read Lena’s message, then decide richtig or falsch. As in the exam, the text also names people and places that are not the answer.',
        },
        {
          kind: 'choose',
          prompt: 'Lenas Vater wird sechzig.',
          context: lenaMessage,
          options: ['Richtig', 'Falsch'],
          answer: 0,
          explanation: '“Mein Vater hat Geburtstag, er wird sechzig!” Wird sechzig: turns sixty.',
        },
        {
          kind: 'choose',
          prompt: 'Lenas Oma kommt nicht.',
          context: lenaMessage,
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation: '“Meine Oma kommt auch mit.” It is Jonas who does not come.',
        },
        {
          kind: 'type',
          prompt: 'Wo ist Jonas am Wochenende? Write the city.',
          context: lenaMessage,
          accepted: ['Hamburg', 'in Hamburg'],
          hint: 'Find “Jonas kommt leider nicht”.',
          explanation: '“Er ist am Wochenende in Hamburg.” Leider means unfortunately.',
        },
        {
          kind: 'match',
          prompt: 'Unit 4 review: match the pairs.',
          pairs: [
            ['die Eltern', 'parents'],
            ['Hast du Geschwister?', 'Do you have siblings?'],
            ['meine Schwester', 'my sister'],
            ['seine Mutter', 'his mother'],
            ['ihr Vater', 'her father'],
          ],
        },
        {
          kind: 'speak',
          prompt:
            'Sprechen Teil 2: ask about family with the cards, then answer the same questions about yourself.',
          lines: [
            'Hast du Geschwister?',
            'Ja, ich habe eine Schwester.',
            'Wo wohnen deine Eltern?',
            'Meine Eltern wohnen in Toronto.',
          ],
        },
      ],
    },
  ],
);

const cafeMenu =
  'Café am Markt\nKaffee 2,90 €\nCappuccino 3,40 €\nTee 2,60 €\nApfelschorle 3,20 €\nKäsekuchen 3,80 €';

const unit5 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u5',
    number: 5,
    icon: 'coffee',
    title: 'Im Café',
    canDo: 'Order food and drink, change your order and pay in a café, bakery or restaurant.',
  },
  [
    {
      id: 'de-a1-u5-order',
      session: 'Words',
      title: 'Coffee, cake and something to drink',
      outcome: 'Order in a German café and understand what the staff ask you.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'After the course',
          intro: 'Maria and Alex go to a café near the language school.',
          lines: [
            {
              speaker: 'Kellnerin',
              text: 'Hallo! Was darf es sein?',
              real: 'Hallo! Was darf’s sein?',
              meaning: 'Hello! What can I get you?',
            },
            {
              speaker: 'Maria',
              text: 'Ich hätte gern einen Cappuccino, bitte.',
              real: 'Einen Cappuccino, bitte.',
              meaning: 'I would like a cappuccino, please.',
              realMeaning: 'A cappuccino, please.',
            },
            {
              speaker: 'Kellnerin',
              text: 'Gern. Mit normaler Milch oder mit Hafermilch?',
              meaning: 'Sure. With regular milk or with oat milk?',
            },
            { speaker: 'Maria', text: 'Mit Hafermilch, bitte.', meaning: 'With oat milk, please.' },
            {
              speaker: 'Alex',
              text: 'Und ich nehme eine Apfelschorle.',
              meaning: 'And I’ll have an apple spritzer.',
            },
            {
              speaker: 'Kellnerin',
              text: 'Möchten Sie auch etwas essen? Der Käsekuchen ist heute sehr gut.',
              real: 'Wollt ihr auch was essen? Der Käsekuchen ist heute super.',
              meaning: 'Would you like something to eat too? The cheesecake is very good today.',
              realMeaning: 'Do you want something to eat too? The cheesecake is great today.',
            },
            {
              speaker: 'Alex',
              text: 'Oh ja, ein Stück Käsekuchen, bitte!',
              meaning: 'Oh yes, a piece of cheesecake, please!',
            },
          ],
          note: 'Apfelschorle, apple juice mixed with sparkling water, is one of the most popular drinks in Germany. In relaxed cafés, staff often say du or ihr to young guests.',
        },
        {
          kind: 'teach',
          title: 'Drinks',
          items: [
            { target: 'der Kaffee', meaning: 'coffee' },
            { target: 'der Tee', meaning: 'tea' },
            {
              target: 'das Wasser',
              meaning: 'water',
              note: 'You will be asked: Mit oder ohne Kohlensäure? Sparkling or still?',
            },
            {
              target: 'die Apfelschorle',
              meaning: 'apple juice with sparkling water',
            },
            { target: 'der Saft', meaning: 'juice' },
            { target: 'die Milch', meaning: 'milk', note: 'Hafermilch: oat milk.' },
          ],
        },
        {
          kind: 'choose',
          prompt:
            'You order water. The waiter asks: “Mit oder ohne Kohlensäure?” What is he asking?',
          options: ['Sparkling or still', 'With or without ice', 'Large or small'],
          answer: 0,
          explanation: 'Kohlensäure is the fizz: mit (sparkling) or ohne (still).',
        },
        {
          kind: 'teach',
          title: 'Food',
          items: [
            {
              target: 'der Kuchen',
              meaning: 'cake',
              note: 'Kaffee und Kuchen in the afternoon is a German tradition.',
            },
            { target: 'das Stück', meaning: 'piece', note: 'ein Stück Kuchen: a piece of cake.' },
            { target: 'das Brötchen', meaning: 'bread roll' },
            {
              target: 'die Brezel',
              meaning: 'pretzel',
              note: 'In the south often Breze or Brezn.',
            },
            { target: 'der Zucker', meaning: 'sugar' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the words.',
          pairs: [
            ['der Tee', 'tea'],
            ['der Saft', 'juice'],
            ['das Brötchen', 'bread roll'],
            ['das Stück', 'piece'],
            ['der Zucker', 'sugar'],
          ],
        },
        {
          kind: 'teach',
          title: 'Ordering',
          items: [
            {
              target: 'Ich hätte gern …',
              meaning: 'I would like …',
              note: 'The most common polite way to order.',
            },
            {
              target: 'Ich nehme …',
              meaning: 'I’ll have …',
              note: 'Just as common, a little more direct.',
            },
            {
              target: 'Was darf es sein?',
              meaning: 'What can I get you?',
              note: 'In speech: Was darf’s sein?',
            },
            {
              target: 'Sonst noch etwas?',
              meaning: 'Anything else?',
              note: 'In speech: Sonst noch was?',
            },
            { target: 'Das war’s.', meaning: 'That’s all.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the woman order?',
          audio: 'Ich hätte gern einen Tee mit Milch und ein Stück Apfelkuchen.',
          options: [
            'Tea with milk and apple cake',
            'Coffee with milk and apple cake',
            'Tea and cheesecake',
          ],
          answer: 0,
          explanation: 'You heard “einen Tee mit Milch und ein Stück Apfelkuchen”.',
        },
        {
          kind: 'choose',
          prompt: 'The barista asks “Sonst noch etwas?” You have everything. What do you say?',
          options: ['Nein, danke. Das war’s.', 'Ja, gern.', 'Was darf es sein?'],
          answer: 0,
          explanation: 'Das war’s: that’s all.',
        },
        {
          kind: 'build',
          prompt: 'Order: “I would like a piece of cake.”',
          answer: ['Ich', 'hätte', 'gern', 'ein', 'Stück', 'Kuchen.'],
          extra: ['einen'],
          explanation: 'das Stück → ein Stück. No word for “of”: ein Stück Kuchen.',
        },
        {
          kind: 'type',
          prompt: 'Order an apple spritzer with “Ich nehme …”.',
          accepted: ['Ich nehme eine Apfelschorle.', 'Ich nehme eine Apfelschorle, bitte.'],
          hint: 'die Apfelschorle → eine Apfelschorle.',
          explanation: 'Ich nehme eine Apfelschorle. Adding bitte is always good.',
        },
        {
          kind: 'speak',
          prompt: 'Order a drink and a piece of cake. Choose what you really like.',
          lines: [
            'Ich hätte gern einen Kaffee, bitte.',
            'Mit Hafermilch, bitte.',
            'Und ein Stück Käsekuchen.',
          ],
          tip: 'In hätte, ä sounds like the e in “bed”. In Schorle, sch is “sh”.',
        },
      ],
    },
    {
      id: 'de-a1-u5-einen',
      session: 'Grammar',
      title: 'möchten, and einen, eine, ein',
      outcome: 'Say what you would like, with the right article for what you order.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'möchten: would like',
          body: 'Möchten is the polite “would like”. Ich and er / sie have the same form, möchte, with no -t.',
          table: [
            ['ich möchte', 'I would like'],
            ['du möchtest', 'you would like'],
            ['er / sie möchte', 'he / she would like'],
            ['wir möchten', 'we would like'],
            ['ihr möchtet', 'you would like (two or more)'],
            ['sie / Sie möchten', 'they / you would like'],
          ],
          examples: [
            'Ich möchte einen Tee.',
            'Möchtest du auch etwas?',
            'Was möchten Sie trinken?',
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Maria ___ einen Cappuccino.',
          options: ['möchte', 'möchtet', 'möchtest'],
          answer: 0,
          explanation: 'er / sie: möchte, like ich.',
        },
        {
          kind: 'rule',
          title: 'What you order: einen for der words',
          body: 'What you order, have or buy is the object of the sentence (the accusative). Only der words change: ein becomes einen and der becomes den. Die and das words stay the same.',
          table: [
            ['der Kaffee', 'Ich möchte einen Kaffee.'],
            ['die Cola', 'Ich möchte eine Cola.'],
            ['das Wasser', 'Ich möchte ein Wasser.'],
            ['der Kuchen', 'Ich nehme den Kuchen.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich hätte gern ___ Tee. (der Tee)',
          options: ['einen', 'ein', 'eine'],
          answer: 0,
          explanation: 'der Tee is the object: einen Tee.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich nehme ___ Apfelschorle. (die Apfelschorle)',
          options: ['eine', 'einen', 'ein'],
          answer: 0,
          explanation: 'Die words do not change: eine Apfelschorle.',
        },
        {
          kind: 'build',
          prompt: 'Order: “I would like a water.” (das Wasser)',
          answer: ['Ich', 'möchte', 'ein', 'Wasser.'],
          extra: ['einen'],
          explanation: 'Das words do not change: ein Wasser.',
        },
        {
          kind: 'rule',
          title: 'Learn every noun with der, die or das',
          body: 'The article tells you how a word changes, so always learn it with the noun: der Kaffee, die Milch, das Brötchen. Two helpful patterns: words ending in -chen are always das (das Brötchen), and most words ending in -e are die (die Schorle, die Tasse), with a few exceptions like der Käse.',
        },
        {
          kind: 'choose',
          prompt: 'Which article? ___ Brötchen',
          options: ['das', 'der', 'die'],
          answer: 0,
          explanation: 'Words ending in -chen are always das.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich nehme ___ Saft. (der Saft)',
          options: ['einen', 'ein', 'eine'],
          answer: 0,
          explanation: 'der Saft → einen Saft.',
        },
        {
          kind: 'teach',
          title: 'Questions at the table',
          items: [
            { target: 'Was möchtest du trinken?', meaning: 'What would you like to drink?' },
            { target: 'Möchten Sie bestellen?', meaning: 'Would you like to order?' },
            { target: 'Ich möchte bitte zahlen.', meaning: 'I would like to pay, please.' },
          ],
        },
        {
          kind: 'type',
          prompt: 'Write with möchte: “I would like a coffee.”',
          accepted: ['Ich möchte einen Kaffee.', 'Ich möchte einen Kaffee, bitte.'],
          hint: 'der Kaffee → einen Kaffee.',
          explanation: 'Ich möchte einen Kaffee.',
        },
        {
          kind: 'speak',
          prompt: 'Order for yourself, ask your friend, and ask to pay.',
          lines: ['Ich möchte einen Tee.', 'Und du? Was möchtest du?', 'Wir möchten bitte zahlen.'],
        },
      ],
    },
    {
      id: 'de-a1-u5-pay',
      session: 'Real talk',
      title: '“Zusammen oder getrennt?” Paying like a local',
      outcome: 'Pay the German way: split the bill, tip, and cope with cash-only places.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Paying the bill',
          intro: 'Maria and Alex have finished and want to pay.',
          lines: [
            {
              speaker: 'Alex',
              text: 'Entschuldigung, wir möchten bitte zahlen!',
              real: 'Zahlen, bitte!',
              meaning: 'Excuse me, we would like to pay, please!',
              realMeaning: 'The bill, please!',
            },
            {
              speaker: 'Kellnerin',
              text: 'Gern. Zusammen oder getrennt?',
              meaning: 'Sure. Together or separately?',
            },
            { speaker: 'Maria', text: 'Getrennt, bitte.', meaning: 'Separately, please.' },
            {
              speaker: 'Kellnerin',
              text: 'Der Cappuccino mit Hafermilch macht vier Euro zwanzig.',
              meaning: 'The cappuccino with oat milk is four euros twenty.',
            },
            {
              speaker: 'Maria',
              text: 'Fünf Euro, bitte. Stimmt so.',
              real: 'Mach fünf. Stimmt so.',
              meaning: 'Five euros, please. Keep the change.',
              realMeaning: 'Make it five. Keep the change.',
            },
            { speaker: 'Kellnerin', text: 'Danke schön! Und Sie?', meaning: 'Thank you! And you?' },
            { speaker: 'Alex', text: 'Kann ich mit Karte zahlen?', meaning: 'Can I pay by card?' },
            {
              speaker: 'Kellnerin',
              text: 'Leider nein, wir nehmen nur bar.',
              real: 'Nee, sorry, nur bar.',
              meaning: 'Unfortunately not, we only take cash.',
              realMeaning: 'No, sorry, cash only.',
            },
          ],
          note: 'Zusammen oder getrennt? is one of the most common questions in German cafés: friends often pay separately. To tip, say the total you want to pay (Fünf Euro, bitte) or Stimmt so. Around 5 to 10% is usual.',
        },
        {
          kind: 'teach',
          title: 'Paying',
          items: [
            {
              target: 'Zahlen, bitte!',
              meaning: 'The bill, please!',
              note: 'Also: Die Rechnung, bitte.',
            },
            { target: 'Zusammen oder getrennt?', meaning: 'Together or separately?' },
            { target: 'Stimmt so.', meaning: 'Keep the change.' },
            {
              target: 'nur bar',
              meaning: 'cash only',
              note: 'Bar means cash. On signs: Nur Barzahlung.',
            },
            { target: 'Kann ich mit Karte zahlen?', meaning: 'Can I pay by card?' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'The bill is 8,60 €. You want to give about 10% tip. What do you say?',
          options: ['Neun fünfzig, bitte.', 'Acht sechzig, bitte.', 'Zusammen, bitte.'],
          answer: 0,
          explanation:
            'Say the total you want to pay: neun fünfzig (9,50 €). People often leave out Euro.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. How much does Alex pay?',
          audio: 'Die Apfelschorle und der Käsekuchen, das macht sieben Euro achtzig.',
          options: ['€7.80', '€8.70', '€17.80'],
          answer: 0,
          explanation: 'sieben Euro achtzig: €7.80.',
        },
        {
          kind: 'teach',
          title: 'At the counter',
          items: [
            { target: 'Für hier oder zum Mitnehmen?', meaning: 'For here or to take away?' },
            { target: 'Zum Mitnehmen, bitte.', meaning: 'To take away, please.' },
            {
              target: 'Möchten Sie den Bon?',
              meaning: 'Would you like the receipt?',
              note: 'Shops must offer a receipt, so you hear this all the time. Nein, danke is fine.',
            },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the phrases.',
          pairs: [
            ['Zusammen oder getrennt?', 'Together or separately?'],
            ['Stimmt so.', 'Keep the change.'],
            ['nur bar', 'cash only'],
            ['zum Mitnehmen', 'to take away'],
            ['der Bon', 'the receipt'],
          ],
        },
        {
          kind: 'rule',
          title: 'Café and restaurant habits',
          body: 'In most cafés you choose your own table. When you want to pay, you ask: the staff rarely bring the bill without being asked, so nobody is rushing you out. Water is not free by default; you can ask for Leitungswasser (tap water), but not every place serves it.',
        },
        {
          kind: 'choose',
          prompt:
            'You have finished and want to leave. The waiter has not come over. What do you do?',
          options: [
            'Catch their eye and say: Zahlen, bitte!',
            'Wait: the bill will come soon.',
            'Leave the money on the table and go.',
          ],
          answer: 0,
          explanation: 'The bill comes when you ask for it.',
        },
        {
          kind: 'build',
          prompt: 'Say: “Together, please. Keep the change.”',
          answer: ['Zusammen,', 'bitte.', 'Stimmt', 'so.'],
          extra: ['getrennt'],
          explanation: 'One bill for everyone, and the rest is the tip.',
        },
        {
          kind: 'type',
          prompt: 'Ask whether you can pay by card.',
          accepted: [
            'Kann ich mit Karte zahlen?',
            'Kann ich mit Karte bezahlen?',
            'Kann ich hier mit Karte zahlen?',
          ],
          hint: 'Kann ich + mit Karte + zahlen?',
          explanation: 'Kann comes first, zahlen goes to the end.',
        },
        {
          kind: 'speak',
          prompt: 'Ask for the bill, pay separately and leave a tip.',
          lines: ['Zahlen, bitte!', 'Getrennt, bitte.', 'Fünf Euro, bitte. Stimmt so.'],
        },
      ],
    },
    {
      id: 'de-a1-u5-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: requests and prices',
      outcome:
        'Do a Sprechen Teil 3 task with picture cards, and Hören tasks about orders and prices.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: Sprechen Teil 3',
          body: 'In Sprechen Teil 3, you get cards with pictures, for example a cup of coffee or a window. You ask someone for something, or to do something, and you react to their request. Short and polite is perfect.',
        },
        {
          kind: 'teach',
          title: 'Polite requests',
          items: [
            {
              target: 'Kannst du mir bitte das Wasser geben?',
              meaning: 'Can you give me the water, please?',
              note: 'To someone you call Sie: Können Sie mir bitte … geben?',
            },
            { target: 'Können Sie mir bitte helfen?', meaning: 'Can you help me, please?' },
            { target: 'Ja, gern. Hier, bitte.', meaning: 'Yes, sure. Here you are.' },
            { target: 'Leider nicht.', meaning: 'Unfortunately not.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Picture card: a cup of coffee. Which request fits?',
          options: ['Einen Kaffee, bitte.', 'Ein Kaffee ist gut.', 'Kaffee, ja?'],
          answer: 0,
          explanation:
            'Einen Kaffee, bitte, or Ich möchte einen Kaffee. Short and polite is enough.',
        },
        {
          kind: 'build',
          prompt: 'Picture card: sugar. Ask a friend politely.',
          answer: ['Kannst', 'du', 'mir', 'bitte', 'den', 'Zucker', 'geben?'],
          extra: ['einen'],
          explanation: 'der Zucker → den Zucker, because it is the object. Geben goes to the end.',
        },
        {
          kind: 'choose',
          prompt: 'Your partner asks: “Kannst du mir bitte das Wasser geben?” How do you react?',
          options: ['Ja, gern. Hier, bitte.', 'Ich nehme ein Wasser.', 'Zusammen oder getrennt?'],
          answer: 0,
          explanation: 'Ja, gern. Hier, bitte. A clear reaction is part of the task.',
        },
        {
          kind: 'rule',
          title: 'The exam: Hören, listen past the first number',
          body: 'In Hören, the first thing you hear is often not the answer: the price changes (heute nur …) or someone changes their mind (Ach nein, lieber …). Lieber means “rather”.',
        },
        {
          kind: 'choose',
          prompt: 'Hören. Wie viel kostet der Kaffee heute?',
          audio: 'Ein Kaffee kostet normalerweise drei Euro, aber heute nur zwei Euro fünfzig.',
          options: ['€2.50', '€3.00', '€5.20'],
          answer: 0,
          explanation: 'Normally €3, but today (heute) only (nur) €2.50.',
        },
        {
          kind: 'choose',
          prompt: 'Hören. Was möchte der Mann?',
          audio: 'Ich hätte gern ein Wasser. Ach nein, lieber eine Apfelschorle, bitte.',
          options: ['Eine Apfelschorle', 'Ein Wasser', 'Einen Saft'],
          answer: 0,
          explanation: '“Ach nein, lieber eine Apfelschorle”: he changes his mind.',
        },
        {
          kind: 'type',
          prompt: 'You order a tea and a cheesecake. How much is it? Write it like 5,00.',
          context: cafeMenu,
          accepted: ['6,40', '6,40 €', 'sechs Euro vierzig'],
          hint: 'Tee 2,60 € + Käsekuchen 3,80 €.',
          explanation: '2,60 € + 3,80 € = 6,40 €: sechs Euro vierzig.',
        },
        {
          kind: 'match',
          prompt: 'Unit 5 review: match the pairs.',
          pairs: [
            ['einen Kaffee', 'a coffee (der)'],
            ['eine Cola', 'a cola (die)'],
            ['ein Wasser', 'a water (das)'],
            ['Sonst noch etwas?', 'Anything else?'],
            ['Stimmt so.', 'Keep the change.'],
          ],
        },
        {
          kind: 'speak',
          prompt: 'Sprechen Teil 3: make a request for each picture card, then react to one.',
          lines: [
            'Einen Kaffee, bitte.',
            'Kannst du mir bitte das Wasser geben?',
            'Ja, gern. Hier, bitte.',
          ],
        },
      ],
    },
  ],
);

const bakerySign =
  'Bäckerei Hoffmann\nÖffnungszeiten:\nMontag bis Freitag 6 bis 18 Uhr\nSamstag 6 bis 13 Uhr\nSonntag geschlossen';
const supermarketAnnouncement =
  'Liebe Kundinnen und Kunden, heute im Angebot: ein Kilo Äpfel für nur ein Euro neunundneunzig. Und Bananen: zwei Kilo für drei Euro!';

const unit6 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u6',
    number: 6,
    icon: 'cart',
    title: 'Einkaufen',
    canDo: 'Shop for food, ask where things are, say how much you want, and use kein and nicht.',
  },
  [
    {
      id: 'de-a1-u6-shopping',
      session: 'Words',
      title: 'The shopping list',
      outcome: 'Name everyday food and amounts, and understand them in a shop.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Saturday morning',
          intro: 'Jonas and Alex write the shopping list for the shared flat.',
          lines: [
            { speaker: 'Jonas', text: 'Was brauchen wir noch?', meaning: 'What else do we need?' },
            {
              speaker: 'Alex',
              text: 'Milch, Brot und Eier. Wir haben keine Eier mehr.',
              meaning: 'Milk, bread and eggs. We have no eggs left.',
            },
            {
              speaker: 'Jonas',
              text: 'Und Kaffee! Ohne Kaffee geht gar nichts.',
              real: 'Und Kaffee! Ohne Kaffee geht gar nix.',
              meaning: 'And coffee! Nothing works without coffee.',
            },
            { speaker: 'Alex', text: 'Brauchen wir Tomaten?', meaning: 'Do we need tomatoes?' },
            {
              speaker: 'Jonas',
              text: 'Ja, ein Kilo. Und Äpfel und Bananen.',
              meaning: 'Yes, a kilo. And apples and bananas.',
            },
            {
              speaker: 'Alex',
              text: 'Okay. Ich gehe zum Supermarkt.',
              real: 'Okay. Ich geh schnell zum Supermarkt.',
              meaning: 'OK. I am going to the supermarket.',
              realMeaning: 'OK. I’ll quickly go to the supermarket.',
            },
            {
              speaker: 'Jonas',
              text: 'Super! Und denk an die Pfandflaschen!',
              meaning: 'Great! And don’t forget the deposit bottles!',
            },
          ],
          note: 'Most bottles and cans in Germany carry a deposit (Pfand) of 8 to 25 cents. You put them into a machine in the supermarket and get a receipt that you cash in at the till.',
        },
        {
          kind: 'teach',
          title: 'Food',
          items: [
            { target: 'das Brot', meaning: 'bread' },
            { target: 'das Ei, die Eier', meaning: 'egg, eggs' },
            { target: 'der Käse', meaning: 'cheese' },
            { target: 'das Obst', meaning: 'fruit' },
            {
              target: 'das Gemüse',
              meaning: 'vegetables',
              note: 'Obst and Gemüse are singular words for the whole group.',
            },
            { target: 'das Fleisch', meaning: 'meat' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Alex says: “Wir haben keine Eier mehr.” What does he mean?',
          options: [
            'There are no eggs left',
            'He wants more eggs than usual',
            'He does not like eggs',
          ],
          answer: 0,
          explanation: 'kein … mehr: none left. Wir haben keine Eier mehr.',
        },
        {
          kind: 'teach',
          title: 'Fruit and vegetables',
          items: [
            { target: 'der Apfel, die Äpfel', meaning: 'apple, apples' },
            { target: 'die Banane, die Bananen', meaning: 'banana, bananas' },
            { target: 'die Tomate, die Tomaten', meaning: 'tomato, tomatoes' },
            { target: 'die Kartoffel, die Kartoffeln', meaning: 'potato, potatoes' },
            { target: 'die Zwiebel, die Zwiebeln', meaning: 'onion, onions' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the food.',
          pairs: [
            ['das Brot', 'bread'],
            ['der Käse', 'cheese'],
            ['das Gemüse', 'vegetables'],
            ['die Äpfel', 'apples'],
            ['die Kartoffeln', 'potatoes'],
          ],
        },
        {
          kind: 'teach',
          title: 'How much?',
          items: [
            { target: 'ein Kilo', meaning: 'a kilo' },
            {
              target: 'zweihundert Gramm',
              meaning: '200 grams',
              note: 'Written 200 g. At markets, some people say ein Pfund for 500 g.',
            },
            { target: 'eine Flasche', meaning: 'a bottle' },
            { target: 'eine Packung', meaning: 'a packet' },
            { target: 'ein Liter', meaning: 'a litre' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. How much cheese?',
          audio: 'Ich hätte gern zweihundert Gramm Käse, bitte.',
          options: ['200 g', '2 kg', '20 g'],
          answer: 0,
          explanation: 'zweihundert Gramm: 200 g.',
        },
        {
          kind: 'choose',
          prompt: 'Where do you buy fresh Brötchen in the morning?',
          options: ['In der Bäckerei', 'In der Apotheke', 'In der Bank'],
          answer: 0,
          explanation: 'Bäckerei: bakery. Many bakeries open on Sunday mornings too.',
        },
        {
          kind: 'build',
          prompt: 'Say: “We need a kilo of tomatoes.”',
          answer: ['Wir', 'brauchen', 'ein', 'Kilo', 'Tomaten.'],
          extra: ['einen'],
          explanation: 'No word for “of”: ein Kilo Tomaten, eine Flasche Wasser.',
        },
        {
          kind: 'type',
          prompt: 'Write the shopping item: “a bottle of milk”.',
          accepted: ['eine Flasche Milch'],
          hint: 'eine Flasche + Milch, with no “of”.',
          explanation: 'eine Flasche Milch.',
        },
        {
          kind: 'speak',
          prompt: 'Make your own shopping list out loud.',
          lines: [
            'Wir brauchen Milch, Brot und Eier.',
            'Ein Kilo Tomaten und zwei Äpfel.',
            'Und eine Flasche Wasser.',
          ],
          tip: 'In Milch, ch after l is the soft sound, like a whispered h.',
        },
      ],
    },
    {
      id: 'de-a1-u6-kein',
      session: 'Grammar',
      title: 'Plurals, kein and nicht',
      outcome: 'Make plurals and say what there is not.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'Plurals',
          body: 'German plurals follow several patterns, so learn each noun with its plural. The good news: in the plural, the article is always die.',
          table: [
            ['-n / -en', 'die Tomate → die Tomaten'],
            ['-e', 'das Brot → die Brote'],
            ['-er, often with umlaut', 'das Ei → die Eier'],
            ['umlaut only', 'der Apfel → die Äpfel'],
            ['-s', 'der Joghurt → die Joghurts'],
            ['no change', 'das Brötchen → die Brötchen'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'What is the plural of die Banane?',
          options: ['die Bananen', 'die Bananes', 'die Banane'],
          answer: 0,
          explanation: 'Most die words ending in -e add -n: die Bananen.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich kaufe zwei ___. (das Brötchen)',
          options: ['Brötchen', 'Brötchens', 'Brötchenen'],
          answer: 0,
          explanation: 'Words ending in -chen do not change in the plural.',
        },
        {
          kind: 'rule',
          title: 'kein: not a, no, none',
          body: 'Use kein to say there is none of something. It works like ein: kein Brot, keine Milch, and keinen for a der word that is the object. In the plural it is keine.',
          table: [
            ['Ich habe kein Auto.', 'das Auto'],
            ['Wir haben keine Milch.', 'die Milch'],
            ['Ich brauche keinen Zucker.', 'der Zucker, object'],
            ['Wir haben keine Eier.', 'plural'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Wir haben ___ Brot mehr.',
          options: ['kein', 'nicht', 'keine'],
          answer: 0,
          explanation: 'das Brot → kein Brot.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich trinke ___ Kaffee. (der Kaffee)',
          options: ['keinen', 'kein', 'nicht'],
          answer: 0,
          explanation: 'der Kaffee is the object: keinen Kaffee.',
        },
        {
          kind: 'rule',
          title: 'nicht: for everything else',
          body: 'Use nicht with verbs, with words like teuer, and with nouns that have der, die, das or mein: Ich komme nicht. Das ist nicht teuer. Das ist nicht mein Kaffee. A quick test: if you could say ein, or no article at all, use kein. Otherwise, use nicht.',
        },
        {
          kind: 'choose',
          prompt: 'Which sentence is correct?',
          options: ['Das ist nicht teuer.', 'Das ist kein teuer.', 'Das ist keine teuer.'],
          answer: 0,
          explanation: 'Teuer (expensive) is not a noun, so nicht.',
        },
        {
          kind: 'choose',
          prompt: 'Which sentence is correct?',
          options: ['Ich habe keine Zeit.', 'Ich habe nicht Zeit.', 'Ich habe nicht eine Zeit.'],
          answer: 0,
          explanation:
            'Zeit has no article here, so kein: Ich habe keine Zeit. You will hear it every day.',
        },
        {
          kind: 'teach',
          title: 'Useful words',
          items: [
            { target: 'teuer', meaning: 'expensive' },
            {
              target: 'günstig / billig',
              meaning: 'good value / cheap',
              note: 'Günstig sounds positive. Billig can also mean cheap and poor quality.',
            },
            { target: 'brauchen', meaning: 'to need' },
            { target: 'kaufen', meaning: 'to buy' },
            {
              target: 'keine Milch mehr',
              meaning: 'no milk left',
              note: 'kein … mehr means none left: kein Brot mehr, keine Eier mehr.',
            },
          ],
        },
        {
          kind: 'build',
          prompt: 'Say: “We have no milk left.”',
          answer: ['Wir', 'haben', 'keine', 'Milch', 'mehr.'],
          extra: ['nicht'],
          explanation: 'die Milch → keine Milch, and mehr at the end: none left.',
        },
        {
          kind: 'type',
          prompt: 'Write: “I don’t need a bag.” (die Tüte)',
          accepted: ['Ich brauche keine Tüte.'],
          hint: 'die Tüte → keine Tüte.',
          explanation: 'Ich brauche keine Tüte.',
        },
        {
          kind: 'speak',
          prompt: 'Say what you do not have, need or think.',
          lines: ['Ich habe keine Zeit.', 'Das ist nicht teuer.', 'Wir brauchen keinen Zucker.'],
        },
      ],
    },
    {
      id: 'de-a1-u6-till',
      session: 'Real talk',
      title: 'Tüte? Bon? Getting through the checkout',
      outcome: 'Handle a fast German checkout and a market stall without stress.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'At the checkout',
          intro: 'Alex is at the supermarket checkout. It is busy, and the cashier is fast.',
          lines: [
            {
              speaker: 'Kassiererin',
              text: 'Hallo! Sammeln Sie Punkte?',
              real: 'Hallo! Punkte?',
              meaning: 'Hello! Do you collect points?',
              realMeaning: 'Hi! Points?',
            },
            { speaker: 'Alex', text: 'Nein, danke.', meaning: 'No, thanks.' },
            {
              speaker: 'Kassiererin',
              text: 'Brauchen Sie eine Tüte?',
              real: 'Tüte?',
              meaning: 'Do you need a bag?',
              realMeaning: 'Bag?',
            },
            { speaker: 'Alex', text: 'Nein, ich habe eine Tasche.', meaning: 'No, I have a bag.' },
            {
              speaker: 'Kassiererin',
              text: 'Das macht siebzehn Euro vierzig. Zahlen Sie mit Karte?',
              real: 'Siebzehn vierzig. Mit Karte?',
              meaning: 'That comes to seventeen euros forty. Are you paying by card?',
              realMeaning: 'Seventeen forty. Card?',
            },
            {
              speaker: 'Alex',
              text: 'Ja. Und hier ist mein Pfandbon.',
              meaning: 'Yes. And here is my deposit receipt.',
            },
            {
              speaker: 'Kassiererin',
              text: 'Danke. Möchten Sie den Kassenbon?',
              real: 'Danke. Bon?',
              meaning: 'Thanks. Would you like the receipt?',
              realMeaning: 'Thanks. Receipt?',
            },
            {
              speaker: 'Alex',
              text: 'Nein, danke. Schönes Wochenende!',
              meaning: 'No, thanks. Have a nice weekend!',
            },
          ],
          note: 'German checkouts are fast: cashiers often shrink their questions to one word, and you pack your shopping yourself, usually at a shelf after paying. Bags cost money, so most people bring their own.',
        },
        {
          kind: 'teach',
          title: 'One-word questions at the till',
          items: [
            { target: 'Punkte?', meaning: 'Do you collect points?', note: 'About a loyalty card.' },
            { target: 'Tüte?', meaning: 'Do you need a bag?' },
            { target: 'Bon?', meaning: 'Do you want the receipt?' },
            { target: 'Mit Karte?', meaning: 'Paying by card?' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the cashier ask?',
          audio: 'Brauchen Sie eine Tüte?',
          options: ['If you need a bag', 'If you collect points', 'If you want the receipt'],
          answer: 0,
          explanation: 'Tüte: bag. Your own bag is die Tasche.',
        },
        {
          kind: 'teach',
          title: 'In the supermarket',
          items: [
            {
              target: 'Wo finde ich die Butter?',
              meaning: 'Where can I find the butter?',
              note: 'Wo finde ich …? is the question for anything in a shop.',
            },
            { target: 'im Angebot', meaning: 'on offer' },
            {
              target: 'Pfand',
              meaning: 'deposit on bottles and cans',
              note: 'Bring them back to the Pfandautomat; you get a Bon for the money.',
            },
            { target: 'die Kasse', meaning: 'checkout, till' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'You cannot find the rice. What do you ask a member of staff?',
          options: [
            'Entschuldigung, wo finde ich Reis?',
            'Entschuldigung, wo ist ich Reis?',
            'Reis, bitte!',
          ],
          answer: 0,
          explanation: 'Wo finde ich …? Where can I find …?',
        },
        {
          kind: 'scene',
          title: 'At the market',
          intro: 'Saturday market. Alex buys apples. Market sellers talk fast and friendly.',
          lines: [
            {
              speaker: 'Verkäufer',
              text: 'So, was darf’s sein?',
              meaning: 'So, what can I get you?',
            },
            {
              speaker: 'Alex',
              text: 'Ein Kilo Äpfel, bitte.',
              meaning: 'A kilo of apples, please.',
            },
            {
              speaker: 'Verkäufer',
              text: 'Die hier oder die da? Die roten sind süßer.',
              real: 'Die hier oder die da? Die roten sind süßer, ne?',
              meaning: 'These or those? The red ones are sweeter.',
              realMeaning: 'These or those? The red ones are sweeter, you know?',
            },
            { speaker: 'Alex', text: 'Die roten, bitte.', meaning: 'The red ones, please.' },
            {
              speaker: 'Verkäufer',
              text: 'Gerne. Darf es ein bisschen mehr sein?',
              real: 'Gerne. Darf’s ein bisschen mehr sein?',
              meaning: 'Sure. Is a little more OK?',
            },
            { speaker: 'Alex', text: 'Ja, kein Problem.', meaning: 'Yes, no problem.' },
            {
              speaker: 'Verkäufer',
              text: 'Zwei Euro fünfzig. Schönen Tag noch!',
              meaning: 'Two euros fifty. Have a nice day!',
            },
          ],
          note: '“Darf’s ein bisschen mehr sein?” is a classic at markets and at the meat or cheese counter: the seller has weighed a little more than you asked for. Ne? at the end of a sentence means “right?”.',
        },
        {
          kind: 'choose',
          prompt: 'The seller asks: “Darf’s ein bisschen mehr sein?” What does he mean?',
          options: [
            'He has weighed a little more than you asked for: is that OK?',
            'He wants you to buy more fruit.',
            'He asks if you want a bag.',
          ],
          answer: 0,
          explanation: 'It is about the weight: a little over what you asked for.',
        },
        {
          kind: 'match',
          prompt: 'Match what you hear.',
          pairs: [
            ['Tüte?', 'Bag?'],
            ['Bon?', 'Receipt?'],
            ['im Angebot', 'on offer'],
            ['Pfand', 'deposit'],
            ['die da', 'those (there)'],
          ],
        },
        {
          kind: 'build',
          prompt: 'Ask: “Where can I find the milk?”',
          answer: ['Wo', 'finde', 'ich', 'die', 'Milch?'],
          extra: ['ist'],
          explanation: 'Wo finde ich …? The verb comes second.',
        },
        {
          kind: 'type',
          prompt: 'Answer the cashier: “No, I have a bag.” (die Tasche)',
          accepted: ['Nein, ich habe eine Tasche.', 'Nein, danke, ich habe eine Tasche.'],
          hint: 'Nein, ich habe + eine Tasche.',
          explanation: 'Die Tasche is your own bag; die Tüte is the one you buy at the till.',
        },
        {
          kind: 'speak',
          prompt: 'Get through the checkout, then ask for something you cannot find.',
          lines: [
            'Nein, danke. Ich habe eine Tasche.',
            'Mit Karte, bitte.',
            'Entschuldigung, wo finde ich die Milch?',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u6-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: signs, ads and announcements',
      outcome: 'Do Lesen Teil 2 and Teil 3 tasks, and a Hören Teil 2 supermarket announcement.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: Lesen Teil 3',
          body: 'In Lesen Teil 3, you read short signs and notices, for example on a shop door, and decide whether a sentence is richtig or falsch.',
        },
        {
          kind: 'teach',
          title: 'Words on signs',
          items: [
            { target: 'geöffnet / geschlossen', meaning: 'open / closed' },
            { target: 'die Öffnungszeiten', meaning: 'opening hours' },
            { target: 'Nur Barzahlung', meaning: 'Cash only' },
            { target: 'täglich', meaning: 'daily, every day' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Die Bäckerei ist am Sonntag geöffnet.',
          context: bakerySign,
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation: '“Sonntag geschlossen”: closed on Sunday.',
        },
        {
          kind: 'choose',
          prompt: 'Hier kann man mit Karte zahlen.',
          context: 'Kiosk am Bahnhof\nNur Barzahlung!',
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation: 'Nur Barzahlung: cash only.',
        },
        {
          kind: 'rule',
          title: 'The exam: Lesen Teil 2',
          body: 'In Lesen Teil 2, you read a question and two short texts, such as two adverts or web pages, and choose the one that fits: a or b.',
        },
        {
          kind: 'choose',
          prompt: 'Sie möchten am Sonntag frische Brötchen kaufen. Welche Bäckerei?',
          context:
            'a) Bäckerei Krause: Montag bis Samstag, 6 bis 18 Uhr. Frische Brötchen und Kuchen.\nb) Bäckerei am Park: täglich 7 bis 12 Uhr, auch sonntags! Brötchen, Brezeln und Kaffee.',
          options: ['a) Bäckerei Krause', 'b) Bäckerei am Park'],
          answer: 1,
          explanation: 'Bäckerei am Park is open täglich, auch sonntags: every day, Sundays too.',
        },
        {
          kind: 'rule',
          title: 'The exam: Hören Teil 2',
          body: 'In Hören Teil 2, you hear short announcements only once, for example in a supermarket or at a station, and decide richtig or falsch. Read the sentence before you listen.',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Die Äpfel sind heute im Angebot.',
          audio: supermarketAnnouncement,
          options: ['Richtig', 'Falsch'],
          answer: 0,
          explanation: '“Heute im Angebot: ein Kilo Äpfel für nur ein Euro neunundneunzig.”',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Ein Kilo Bananen kostet drei Euro.',
          audio: supermarketAnnouncement,
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation: '“Zwei Kilo für drei Euro”: three euros is for two kilos.',
        },
        {
          kind: 'match',
          prompt: 'Unit 6 review: match the pairs.',
          pairs: [
            ['im Angebot', 'on offer'],
            ['geschlossen', 'closed'],
            ['die Tüte', 'bag'],
            ['keine Eier', 'no eggs'],
            ['die Äpfel', 'apples'],
          ],
        },
        {
          kind: 'speak',
          prompt: 'Ask a shop assistant two questions about what they have and when they open.',
          lines: ['Entschuldigung, haben Sie Hafermilch?', 'Ist die Bäckerei am Sonntag geöffnet?'],
        },
      ],
    },
  ],
);

const flatAds =
  'a) WG-Zimmer, 14 m², möbliert, ab sofort frei. 360 € warm.\nb) 2-Zimmer-Wohnung, 55 m², Balkon, frei ab April. 620 € kalt + 150 € Nebenkosten.';
const houseRules =
  'Hausordnung\nRuhezeiten: täglich von 22 bis 6 Uhr und am Sonntag.\nBitte den Müll trennen: Papier, Glas, Bio, Rest.';

const unit7 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u7',
    number: 7,
    icon: 'sofa',
    title: 'Zu Hause',
    canDo: 'Describe a flat and its rooms, name furniture, and say what things are like.',
  },
  [
    {
      id: 'de-a1-u7-flat',
      session: 'Words',
      title: 'Rooms and furniture',
      outcome: 'Name the rooms and furniture of a flat, and ask what something is called.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Karim’s new flat',
          intro: 'Karim has moved into a new flat. Alex comes round for the first time.',
          lines: [
            {
              speaker: 'Karim',
              text: 'Hallo, komm rein! Das ist meine neue Wohnung.',
              meaning: 'Hi, come in! This is my new flat.',
            },
            {
              speaker: 'Alex',
              text: 'Wow, schön! Wie viele Zimmer hast du?',
              meaning: 'Wow, nice! How many rooms do you have?',
            },
            {
              speaker: 'Karim',
              text: 'Zwei Zimmer, Küche, Bad. Hier links ist das Wohnzimmer.',
              meaning: 'Two rooms, kitchen, bathroom. Here on the left is the living room.',
            },
            { speaker: 'Alex', text: 'Und das Schlafzimmer?', meaning: 'And the bedroom?' },
            {
              speaker: 'Karim',
              text: 'Hier rechts. Aber das Bett ist noch nicht da.',
              real: 'Hier rechts. Aber das Bett fehlt noch.',
              meaning: 'Here on the right. But the bed isn’t here yet.',
              realMeaning: 'Here on the right. But the bed is still missing.',
            },
            { speaker: 'Alex', text: 'Und die Küche?', meaning: 'And the kitchen?' },
            {
              speaker: 'Karim',
              text: 'Die ist klein, aber sie hat einen Balkon!',
              real: 'Die is klein, aber mit Balkon!',
              meaning: 'It’s small, but it has a balcony!',
              realMeaning: 'It’s small, but with a balcony!',
            },
          ],
          note: 'Germans count only the rooms you live in: a Zwei-Zimmer-Wohnung has two rooms plus a kitchen and a bathroom. Many rented flats come without a kitchen, so tenants bring their own or buy it from the last tenant.',
        },
        {
          kind: 'teach',
          title: 'Rooms',
          items: [
            { target: 'die Wohnung', meaning: 'flat, apartment' },
            { target: 'das Zimmer', meaning: 'room' },
            { target: 'die Küche', meaning: 'kitchen' },
            {
              target: 'das Bad',
              meaning: 'bathroom',
              note: 'Short for das Badezimmer. The toilet is often separate: das WC.',
            },
            { target: 'das Wohnzimmer', meaning: 'living room' },
            { target: 'das Schlafzimmer', meaning: 'bedroom' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Karim says: “Zwei Zimmer, Küche, Bad.” How big is his flat?',
          options: [
            'Two rooms, plus a kitchen and a bathroom',
            'Two rooms in total, kitchen included',
            'Two bedrooms and two bathrooms',
          ],
          answer: 0,
          explanation: 'Küche and Bad are never counted as Zimmer: this is a Zwei-Zimmer-Wohnung.',
        },
        {
          kind: 'teach',
          title: 'Furniture',
          items: [
            { target: 'der Tisch', meaning: 'table' },
            { target: 'der Stuhl, die Stühle', meaning: 'chair, chairs' },
            { target: 'das Bett', meaning: 'bed' },
            { target: 'der Schrank', meaning: 'wardrobe, cupboard' },
            { target: 'das Sofa', meaning: 'sofa', note: 'Also die Couch.' },
            { target: 'die Lampe', meaning: 'lamp' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the furniture.',
          pairs: [
            ['der Tisch', 'table'],
            ['die Stühle', 'chairs'],
            ['der Schrank', 'wardrobe'],
            ['das Bett', 'bed'],
            ['die Lampe', 'lamp'],
          ],
        },
        {
          kind: 'teach',
          title: 'Around the flat',
          items: [
            { target: 'der Balkon', meaning: 'balcony' },
            { target: 'der Kühlschrank', meaning: 'fridge' },
            { target: 'das Fenster', meaning: 'window' },
            { target: 'links / rechts', meaning: 'on the left / on the right' },
            {
              target: 'Wie heißt das auf Deutsch?',
              meaning: 'What is this called in German?',
              note: 'Point at anything and ask. Wie heißt das auf Englisch? asks the other way round.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which room is it?',
          audio: 'Hier schlafe ich. Das Bett kommt am Freitag.',
          options: ['The bedroom', 'The kitchen', 'The living room'],
          answer: 0,
          explanation: 'Schlafzimmer: schlafen (to sleep) + Zimmer (room).',
        },
        {
          kind: 'choose',
          prompt: 'You point at the fridge and want the German word. What do you ask?',
          options: [
            'Wie heißt das auf Deutsch?',
            'Wie heißt du auf Deutsch?',
            'Was kostet das auf Deutsch?',
          ],
          answer: 0,
          explanation:
            'Wie heißt das …? asks for the name of a thing. Wie heißt du? asks for a person’s name.',
        },
        {
          kind: 'build',
          prompt: 'Say: “Here on the left is the living room.”',
          answer: ['Hier', 'links', 'ist', 'das', 'Wohnzimmer.'],
          extra: ['rechts'],
          explanation: 'links: on the left. The verb ist stays in second place.',
        },
        {
          kind: 'type',
          prompt: 'Write: “This is my flat.”',
          accepted: ['Das ist meine Wohnung.'],
          hint: 'die Wohnung → meine Wohnung.',
          explanation: 'Wohnung is a die word, so meine: Das ist meine Wohnung.',
        },
        {
          kind: 'speak',
          prompt: 'Show a friend round your home.',
          lines: [
            'Komm rein! Das ist meine Wohnung.',
            'Hier links ist die Küche.',
            'Und das ist mein Zimmer.',
          ],
          tip: 'In Küche, say i with rounded lips to get ü.',
        },
      ],
    },
    {
      id: 'de-a1-u7-adjectives',
      session: 'Grammar',
      title: 'Er, sie, es for things, and “Die Küche ist klein”',
      outcome: 'Say it with er, sie or es, and describe what things are like.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'ein Tisch, der Tisch',
          body: 'Ein, eine introduce something new. Der, die, das point to something you both know already. Ich habe einen Tisch. Der Tisch ist alt. In the plural there is no word for “a”: Stühle.',
          table: [
            ['ein Tisch', 'der Tisch'],
            ['eine Lampe', 'die Lampe'],
            ['ein Bett', 'das Bett'],
            ['Stühle', 'die Stühle'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Karim hat ___ Sofa. Das Sofa ist neu.',
          options: ['ein', 'eine', 'der'],
          answer: 0,
          explanation: 'First mention, das word: ein Sofa. After that: das Sofa.',
        },
        {
          kind: 'rule',
          title: 'it: er, sie or es',
          body: 'English says it for every thing. German follows the noun: a der word becomes er, a die word becomes sie, a das word becomes es. In speech you will also hear der, die, das, as for people in Unit 4: Die ist alt.',
          table: [
            ['der Tisch', 'Er ist neu.'],
            ['die Lampe', 'Sie ist alt.'],
            ['das Bett', 'Es ist groß.'],
            ['die Stühle', 'Sie sind neu.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Wie ist der Schrank? ___ ist sehr alt.',
          options: ['Er', 'Sie', 'Es'],
          answer: 0,
          explanation: 'der Schrank → er.',
        },
        {
          kind: 'teach',
          title: 'What is it like?',
          items: [
            { target: 'groß / klein', meaning: 'big / small' },
            { target: 'hell / dunkel', meaning: 'bright, light / dark' },
            { target: 'alt / neu', meaning: 'old / new' },
            { target: 'ruhig / laut', meaning: 'quiet / noisy, loud' },
            {
              target: 'gemütlich',
              meaning: 'cosy, snug',
              note: 'A favourite German word for a warm, relaxed place or evening.',
            },
            {
              target: 'bequem',
              meaning: 'comfortable',
              note: 'For chairs, beds, sofas and shoes.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Wo ist die Küche? ___ ist hier links.',
          options: ['Sie', 'Er', 'Es'],
          answer: 0,
          explanation: 'die Küche → sie.',
        },
        {
          kind: 'rule',
          title: 'After sein: no ending',
          body: 'After ist and sind, the adjective has no ending at all: Die Wohnung ist hell. Das Zimmer ist klein. Die Stühle sind bequem. Endings come later, when the adjective stands before the noun.',
        },
        {
          kind: 'choose',
          prompt: 'Which sentence is correct?',
          options: ['Das Zimmer ist hell.', 'Das Zimmer ist helles.', 'Das Zimmer hell ist.'],
          answer: 0,
          explanation: 'After ist: no ending, and the verb comes second.',
        },
        {
          kind: 'match',
          prompt: 'Match the opposites.',
          pairs: [
            ['groß', 'klein'],
            ['hell', 'dunkel'],
            ['alt', 'neu'],
            ['ruhig', 'laut'],
          ],
        },
        {
          kind: 'build',
          prompt: 'Say: “The flat is bright, but small.”',
          answer: ['Die', 'Wohnung', 'ist', 'hell,', 'aber', 'klein.'],
          extra: ['helle'],
          explanation: 'No ending after ist: hell, klein. Aber (but) joins the two.',
        },
        {
          kind: 'type',
          prompt: '“Wie ist das Bett?” Answer: “It is comfortable.”',
          accepted: ['Es ist bequem.', 'Das ist bequem.'],
          hint: 'das Bett → es.',
          explanation: 'Es ist bequem. In speech, Das ist bequem works too.',
        },
        {
          kind: 'speak',
          prompt: 'Describe your room.',
          lines: [
            'Mein Zimmer ist klein, aber gemütlich.',
            'Das Bett ist bequem.',
            'Das Fenster ist groß, und es ist ruhig.',
          ],
          tip: 'Gemütlich: stress the second part, ge-MÜT-lich.',
        },
      ],
    },
    {
      id: 'de-a1-u7-wg',
      session: 'Real talk',
      title: '“Komm rein!” Visiting a room in a WG',
      outcome: 'Visit a flat, react like a local and ask the questions that matter.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'A free room',
          intro: 'A room in Lena’s shared flat is free. Maria comes to see it.',
          lines: [
            { speaker: 'Lena', text: 'Hallo, Maria! Komm rein!', meaning: 'Hi, Maria! Come in!' },
            {
              speaker: 'Maria',
              text: 'Hallo! Soll ich die Schuhe ausziehen?',
              meaning: 'Hi! Should I take my shoes off?',
            },
            {
              speaker: 'Lena',
              text: 'Ja, gern. So, und hier ist das Zimmer.',
              meaning: 'Yes, please. So, and here is the room.',
            },
            {
              speaker: 'Maria',
              text: 'Oh, es ist schön hell! Und ganz ruhig.',
              real: 'Oh, voll schön hell! Und so ruhig hier.',
              meaning: 'Oh, it’s nice and bright! And very quiet.',
              realMeaning: 'Oh, really nice and bright! And so quiet here.',
            },
            {
              speaker: 'Lena',
              text: 'Ja, das Fenster geht zum Hof. Das Zimmer hat sechzehn Quadratmeter.',
              meaning: 'Yes, the window faces the courtyard. The room is sixteen square metres.',
            },
            {
              speaker: 'Maria',
              text: 'Und was kostet das Zimmer?',
              real: 'Und was kostet das so im Monat?',
              meaning: 'And how much is the room?',
              realMeaning: 'And roughly what does it cost a month?',
            },
            {
              speaker: 'Lena',
              text: 'Dreihundertachtzig warm, mit Internet.',
              meaning: '380 a month including heating and bills, with internet.',
            },
            {
              speaker: 'Maria',
              text: 'Super! Das Zimmer gefällt mir.',
              meaning: 'Great! I like the room.',
            },
          ],
          note: 'Most Germans take their shoes off at home, so guests often ask. Rent is given warm (heating and bills included) or kalt (without them). In a WG, the flatmates usually choose the new person together after short visits, the WG-Casting.',
        },
        {
          kind: 'teach',
          title: 'Visiting someone at home',
          items: [
            {
              target: 'Komm rein!',
              meaning: 'Come in!',
              note: 'To someone you call Sie: Kommen Sie rein!',
            },
            { target: 'Soll ich die Schuhe ausziehen?', meaning: 'Should I take my shoes off?' },
            { target: 'Fühl dich wie zu Hause!', meaning: 'Make yourself at home!' },
            {
              target: 'Das gefällt mir.',
              meaning: 'I like that.',
              note: 'Literally “that pleases me”: Das Zimmer gefällt mir.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does Lena say about the room?',
          audio: 'Das Zimmer ist nicht groß, aber es ist hell und sehr ruhig.',
          options: ['Not big, but bright and quiet', 'Big and bright, but noisy', 'Small and dark'],
          answer: 0,
          explanation: 'nicht groß, aber hell und sehr ruhig.',
        },
        {
          kind: 'teach',
          title: 'Rent and size',
          items: [
            { target: 'die Miete', meaning: 'rent' },
            {
              target: 'warm / kalt',
              meaning: 'with / without heating and bills',
              note: 'Said about rent: 380 Euro warm. Ads often give the kalt price.',
            },
            { target: 'der Quadratmeter', meaning: 'square metre', note: 'Written m² or qm.' },
            {
              target: 'der Hof',
              meaning: 'courtyard',
              note: 'Many city flats look onto a quiet courtyard at the back.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'A room costs “380 Euro warm”. What do you pay for heating and bills on top?',
          options: [
            'Nothing: they are included',
            'About 100 euros more',
            'It depends on the furniture',
          ],
          answer: 0,
          explanation: 'warm: heating and service costs are in the price. kalt: they come on top.',
        },
        {
          kind: 'scene',
          title: 'Jonas comes home',
          intro: 'Jonas, another flatmate, comes home and says hello. He talks fast.',
          lines: [
            {
              speaker: 'Jonas',
              text: 'Hey! Du bist Maria, oder? Ich bin Jonas.',
              real: 'Hey! Du bist Maria, ne? Jonas.',
              meaning: 'Hey! You’re Maria, right? I’m Jonas.',
              realMeaning: 'Hey! You’re Maria, right? Jonas.',
            },
            {
              speaker: 'Maria',
              text: 'Hi, Jonas! Die Wohnung ist echt schön.',
              meaning: 'Hi, Jonas! The flat is really nice.',
            },
            {
              speaker: 'Jonas',
              text: 'Danke! Die Küche ist klein, aber wir kochen oft zusammen.',
              meaning: 'Thanks! The kitchen is small, but we often cook together.',
            },
            {
              speaker: 'Maria',
              text: 'Und wie viele Leute wohnen hier?',
              meaning: 'And how many people live here?',
            },
            {
              speaker: 'Jonas',
              text: 'Wir sind drei: Lena, Alex und ich. Fühl dich wie zu Hause!',
              real: 'Wir sind zu dritt: Lena, Alex und ich. Fühl dich wie zu Hause!',
              meaning: 'There are three of us: Lena, Alex and me. Make yourself at home!',
            },
            { speaker: 'Maria', text: 'Danke, das ist nett!', meaning: 'Thanks, that’s kind!' },
          ],
          note: 'Oder? at the end of a sentence means “right?”, just like ne? In the south you will hear gell? instead.',
        },
        {
          kind: 'choose',
          prompt: 'Jonas says: “Du bist Maria, oder?” What is he doing?',
          options: [
            'Checking that she is Maria',
            'Asking her to choose a name',
            'Saying he does not believe her',
          ],
          answer: 0,
          explanation: 'oder? at the end checks something: right?',
        },
        {
          kind: 'match',
          prompt: 'Match what you hear at a flat visit.',
          pairs: [
            ['Komm rein!', 'Come in!'],
            ['oder?', 'right?'],
            ['warm', 'bills included'],
            ['der Hof', 'courtyard'],
            ['Das gefällt mir.', 'I like that.'],
          ],
        },
        {
          kind: 'build',
          prompt: 'Say: “I like the kitchen.”',
          answer: ['Die', 'Küche', 'gefällt', 'mir.'],
          also: ['Mir gefällt die Küche.'],
          extra: ['ich'],
          explanation:
            'The thing you like does the verb, and mir means “to me”: Die Küche gefällt mir.',
        },
        {
          kind: 'type',
          prompt: 'Lena says: “Fühl dich wie zu Hause!” Answer: “Thanks, that is kind!”',
          accepted: ['Danke, das ist nett!', 'Danke, das ist sehr nett!'],
          hint: 'Danke + das ist + nett.',
          explanation: 'nett: kind, nice. A short, warm reply that always works.',
        },
        {
          kind: 'speak',
          prompt: 'Visit a flat: ask your two questions, then react.',
          lines: [
            'Soll ich die Schuhe ausziehen?',
            'Was kostet das Zimmer?',
            'Oh, das ist schön hell!',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u7-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: flat ads and house rules',
      outcome:
        'Choose a flat ad in Lesen Teil 2, read house rules, and ask about home in Sprechen Teil 2.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: ads in Lesen Teil 2',
          body: 'Flat ads are short and full of abbreviations. In Lesen Teil 2 you read two of them and choose the one that fits a person: a or b. Look for the one detail that decides it.',
        },
        {
          kind: 'teach',
          title: 'Words in flat ads',
          items: [
            { target: 'die Anzeige', meaning: 'advert' },
            { target: 'möbliert', meaning: 'furnished' },
            {
              target: 'die Nebenkosten',
              meaning: 'service charges, bills',
              note: 'Heating, water, rubbish. Often NK in ads.',
            },
            { target: 'ab sofort', meaning: 'from now, immediately' },
            {
              target: 'frei',
              meaning: 'free, available',
              note: 'Free as in available. Free of charge is kostenlos.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Sie brauchen jetzt sofort ein Zimmer mit Möbeln. Welche Anzeige passt?',
          context: flatAds,
          options: ['a) WG-Zimmer', 'b) 2-Zimmer-Wohnung'],
          answer: 0,
          explanation:
            'a is möbliert (with furniture) and frei ab sofort. b is free only from April.',
        },
        {
          kind: 'choose',
          prompt: 'Was kostet die Wohnung b) im Monat, mit Nebenkosten?',
          context: flatAds,
          options: ['620 €', '770 €', '150 €'],
          answer: 1,
          explanation: '620 € kalt + 150 € Nebenkosten = 770 € warm.',
        },
        {
          kind: 'rule',
          title: 'Signs: the Hausordnung',
          body: 'Every building has house rules. Two are everywhere: quiet hours (Ruhezeiten), usually from 22 to 6 o’clock and all of Sunday, and sorting the rubbish (Mülltrennung). Signs like these appear in Lesen Teil 3.',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Am Sonntag ist im Haus Ruhezeit.',
          context: houseRules,
          options: ['Richtig', 'Falsch'],
          answer: 0,
          explanation: '“Ruhezeiten: … und am Sonntag.”',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Die Ruhezeit ist von sechs bis zweiundzwanzig Uhr.',
          context: houseRules,
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation: 'It is the other way round: from 22:00 at night until 6:00 in the morning.',
        },
        {
          kind: 'rule',
          title: 'Sprechen Teil 2: Wohnen',
          body: 'As in Unit 4, you draw a word card and ask your partner a question with the word. Today’s topic is Wohnen (living).',
        },
        {
          kind: 'choose',
          prompt: 'Your card says “Küche”. Which question fits?',
          options: ['Wie groß ist deine Küche?', 'Küche ist groß?', 'Wie heißt deine Küche?'],
          answer: 0,
          explanation: 'A full question with the card word. Ist deine Küche hell? works too.',
        },
        {
          kind: 'type',
          prompt: 'Your card says “Balkon”. Ask your partner if they have a balcony (du).',
          accepted: ['Hast du einen Balkon?'],
          hint: 'Hast du + einen Balkon (der Balkon, as the object).',
          explanation: 'der Balkon → einen Balkon, as with einen Kaffee in Unit 5.',
        },
        {
          kind: 'match',
          prompt: 'Unit 7 review: match the pairs.',
          pairs: [
            ['möbliert', 'furnished'],
            ['die Miete', 'rent'],
            ['hell', 'bright'],
            ['das Schlafzimmer', 'bedroom'],
            ['gemütlich', 'cosy'],
          ],
        },
        {
          kind: 'speak',
          prompt: 'Answer your partner’s questions about your home.',
          lines: [
            'Meine Wohnung hat zwei Zimmer.',
            'Die Küche ist klein, aber hell.',
            'Ja, ich habe einen Balkon.',
          ],
        },
      ],
    },
  ],
);

const karimInvitation =
  'Hallo Alex,\nich habe am Samstag Geburtstag! Am Abend mache ich eine Party in meiner neuen Wohnung. Sie fängt um acht an. Kannst du schon um sieben kommen und mir helfen? Ich kaufe am Vormittag ein.\nViele Grüße\nKarim';

const unit8 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u8',
    number: 8,
    icon: 'clock-outline',
    title: 'Mein Tag',
    canDo: 'Ask and tell the time, describe your day, and say when things happen.',
  },
  [
    {
      id: 'de-a1-u8-time',
      session: 'Words',
      title: 'Wie spät ist es?',
      outcome: 'Ask and tell the time, the everyday way and the official way.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'Monday morning',
          intro: 'Monday morning in the WG. Alex is in a hurry.',
          lines: [
            { speaker: 'Alex', text: 'Lena, wie spät ist es?', meaning: 'Lena, what time is it?' },
            { speaker: 'Lena', text: 'Es ist halb acht.', meaning: 'It’s half past seven.' },
            {
              speaker: 'Alex',
              text: 'Halb acht? Oh nein, mein Kurs fängt um acht an!',
              real: 'Halb acht? Mist, mein Kurs fängt um acht an!',
              meaning: 'Half past seven? Oh no, my course starts at eight!',
              realMeaning: 'Half past seven? Damn, my course starts at eight!',
            },
            {
              speaker: 'Lena',
              text: 'Keine Panik. Der Bus kommt um zwanzig vor acht.',
              real: 'Keine Panik. Der Bus kommt zwanzig vor.',
              meaning: 'Don’t panic. The bus comes at twenty to eight.',
              realMeaning: 'Don’t panic. The bus comes at twenty to.',
            },
            {
              speaker: 'Alex',
              text: 'Und wie lange fährt der Bus?',
              meaning: 'And how long does the bus take?',
            },
            {
              speaker: 'Lena',
              text: 'Zehn Minuten. Also, Kaffee zum Mitnehmen?',
              meaning: 'Ten minutes. So, coffee to go?',
            },
            {
              speaker: 'Alex',
              text: 'Ja, bitte! Du bist die Beste!',
              meaning: 'Yes, please! You’re the best!',
            },
          ],
          note: 'Halb acht is half past seven: halfway to eight. It is the classic trap for English speakers, so always think “half to the next hour”.',
        },
        {
          kind: 'teach',
          title: 'Telling the time',
          items: [
            {
              target: 'Wie spät ist es?',
              meaning: 'What time is it?',
              note: 'Also: Wie viel Uhr ist es?',
            },
            { target: 'Es ist acht Uhr.', meaning: 'It’s eight o’clock.' },
            { target: 'halb acht', meaning: 'half past seven', note: 'Halfway to eight: 7:30.' },
            { target: 'Viertel nach acht', meaning: 'quarter past eight' },
            { target: 'Viertel vor neun', meaning: 'quarter to nine' },
            { target: 'zehn nach acht / zehn vor neun', meaning: 'ten past eight / ten to nine' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Lena says: “Es ist halb acht.” What time is it?',
          options: ['7:30', '8:30', '8:00'],
          answer: 0,
          explanation: 'halb acht: halfway to eight, so 7:30.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What time is it?',
          audio: 'Es ist jetzt Viertel nach zehn.',
          options: ['10:15', '9:45', '10:45'],
          answer: 0,
          explanation: 'Viertel nach zehn: a quarter past ten.',
        },
        {
          kind: 'teach',
          title: 'Official times',
          items: [
            {
              target: 'neunzehn Uhr dreißig',
              meaning: '19:30 (7.30 pm)',
              note: 'Timetables, the TV, offices and appointments use the 24-hour clock, read out as written.',
            },
            { target: 'acht Uhr fünfzehn', meaning: '8:15' },
            { target: 'Mittag / Mitternacht', meaning: 'noon / midnight' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the times.',
          pairs: [
            ['halb neun', '8:30'],
            ['Viertel nach neun', '9:15'],
            ['zehn vor neun', '8:50'],
            ['neunzehn Uhr', '7 pm'],
            ['Viertel vor zehn', '9:45'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Your ticket says 20:30. A friend asks when your train leaves. What do you say?',
          options: ['Um halb neun.', 'Um halb zwanzig.', 'Um zwanzig nach acht.'],
          answer: 0,
          explanation: 'Among friends, people use the 12-hour clock: 20:30 is halb neun.',
        },
        {
          kind: 'teach',
          title: 'Parts of the day',
          items: [
            { target: 'der Morgen', meaning: 'morning' },
            {
              target: 'der Vormittag',
              meaning: 'late morning',
              note: 'From about nine until noon.',
            },
            { target: 'der Mittag', meaning: 'midday, lunchtime' },
            { target: 'der Nachmittag', meaning: 'afternoon' },
            { target: 'der Abend', meaning: 'evening' },
            { target: 'die Nacht', meaning: 'night' },
          ],
        },
        {
          kind: 'build',
          prompt: 'Say: “It is half past nine.”',
          answer: ['Es', 'ist', 'halb', 'zehn.'],
          extra: ['neun'],
          explanation: 'Half past nine is halfway to ten: halb zehn.',
        },
        {
          kind: 'type',
          prompt: 'Write 8:15 in words, the everyday way.',
          accepted: ['Viertel nach acht', 'Es ist Viertel nach acht.'],
          hint: 'Viertel + nach + acht.',
          explanation:
            'Viertel nach acht. In Leipzig you may also hear viertel neun: more on that soon.',
        },
        {
          kind: 'speak',
          prompt: 'Ask a flatmate the time, then panic a little.',
          lines: ['Wie spät ist es?', 'Was? Schon Viertel vor acht?', 'Der Bus kommt um zehn vor!'],
          tip: 'In acht, ch after a is the throaty sound, as in Scottish loch.',
        },
      ],
    },
    {
      id: 'de-a1-u8-routine',
      session: 'Grammar',
      title: 'Ich stehe um sieben auf: separable verbs, am and um',
      outcome: 'Describe your routine with separable verbs, and say when with am and um.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'Separable verbs',
          body: 'Many everyday verbs have a small prefix: aufstehen, anfangen, einkaufen. In a sentence the verb goes second as usual, and the prefix jumps to the very end.',
          table: [
            ['aufstehen', 'Ich stehe um sieben auf.'],
            ['anfangen', 'Der Kurs fängt um acht an.'],
            ['einkaufen', 'Wir kaufen heute ein.'],
            ['anrufen', 'Ich rufe dich morgen an.'],
          ],
        },
        {
          kind: 'teach',
          title: 'Your day',
          items: [
            { target: 'aufstehen', meaning: 'to get up', note: 'Ich stehe auf.' },
            {
              target: 'frühstücken',
              meaning: 'to have breakfast',
              note: 'Not separable: Ich frühstücke.',
            },
            {
              target: 'anfangen',
              meaning: 'to start, begin',
              note: 'The a changes too: ich fange an, er fängt an.',
            },
            { target: 'einkaufen', meaning: 'to do the shopping' },
            { target: 'aufräumen', meaning: 'to tidy up' },
            { target: 'anrufen', meaning: 'to call (on the phone)' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Which sentence is correct?',
          options: [
            'Wir kaufen am Samstag ein.',
            'Wir einkaufen am Samstag.',
            'Wir kaufen ein am Samstag.',
          ],
          answer: 0,
          explanation: 'kaufen in second place, ein at the very end.',
        },
        {
          kind: 'build',
          prompt: 'Say: “I am tidying up my room.”',
          answer: ['Ich', 'räume', 'mein', 'Zimmer', 'auf.'],
          extra: ['aufräume'],
          explanation: 'räume second, auf at the end. English uses -ing here; German does not.',
        },
        {
          kind: 'rule',
          title: 'am and um',
          body: 'Use um with clock times and am with days and parts of the day. One exception: in der Nacht.',
          table: [
            ['um acht Uhr', 'at eight o’clock'],
            ['um halb neun', 'at half past eight'],
            ['am Montag', 'on Monday'],
            ['am Abend', 'in the evening'],
            ['in der Nacht', 'at night'],
          ],
        },
        {
          kind: 'teach',
          title: 'The week',
          items: [
            { target: 'Montag, Dienstag', meaning: 'Monday, Tuesday' },
            { target: 'Mittwoch, Donnerstag', meaning: 'Wednesday, Thursday' },
            { target: 'Freitag', meaning: 'Friday' },
            {
              target: 'Samstag, Sonntag',
              meaning: 'Saturday, Sunday',
              note: 'In the north and east, Saturday is also Sonnabend.',
            },
            { target: 'das Wochenende', meaning: 'weekend' },
            {
              target: 'heute / morgen',
              meaning: 'today / tomorrow',
              note: 'morgen is tomorrow; der Morgen is the morning. morgen früh: tomorrow morning.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Der Kurs ist ___ Montag ___ neun Uhr.',
          options: ['am … um', 'um … am', 'im … um'],
          answer: 0,
          explanation: 'am Montag (a day), um neun Uhr (a clock time).',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Lena arbeitet ___ Nachmittag.',
          options: ['am', 'um', 'im'],
          answer: 0,
          explanation: 'Parts of the day take am: am Morgen, am Nachmittag, am Abend.',
        },
        {
          kind: 'rule',
          title: 'Time first? The verb stays second',
          body: 'You can start with the time to stress it. The verb keeps second place, so ich moves behind it: Um sieben stehe ich auf. Am Samstag kaufen wir ein.',
        },
        {
          kind: 'build',
          prompt: 'Start with the day: “On Sunday I have a long breakfast.”',
          answer: ['Am', 'Sonntag', 'frühstücke', 'ich', 'lange.'],
          extra: ['um'],
          explanation: 'Am Sonntag first, then the verb, then ich: frühstücke ich.',
        },
        {
          kind: 'type',
          prompt: 'Write: “The course starts at nine.” (anfangen)',
          accepted: ['Der Kurs fängt um neun an.', 'Der Kurs fängt um neun Uhr an.'],
          hint: 'fängt second, an at the end.',
          explanation: 'Der Kurs fängt um neun an.',
        },
        {
          kind: 'speak',
          prompt: 'Describe your morning.',
          lines: [
            'Ich stehe um halb sieben auf.',
            'Dann frühstücke ich.',
            'Um acht fängt mein Kurs an.',
          ],
          tip: 'Stress the prefix of separable verbs: AUFstehen, ANfangen, EINkaufen.',
        },
      ],
    },
    {
      id: 'de-a1-u8-real',
      session: 'Real talk',
      title: '“Viertel neun?” Times as people say them',
      outcome: 'Understand casual and regional times, and talk about your day like a local.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'On the stairs',
          intro: 'Frau Wagner, the neighbour, asks Alex a favour. She grew up in Leipzig.',
          lines: [
            {
              speaker: 'Frau Wagner',
              text: 'Guten Morgen, Alex! Sind Sie morgen früh zu Hause?',
              meaning: 'Good morning, Alex! Are you at home tomorrow morning?',
            },
            { speaker: 'Alex', text: 'Ja, bis neun. Warum?', meaning: 'Yes, until nine. Why?' },
            {
              speaker: 'Frau Wagner',
              text: 'Ein Paket kommt für mich, so um viertel neun.',
              meaning: 'A parcel is coming for me, at about quarter past eight.',
            },
            {
              speaker: 'Alex',
              text: 'Viertel neun? Ist das Viertel vor neun?',
              meaning: 'Viertel neun? Is that quarter to nine?',
            },
            {
              speaker: 'Frau Wagner',
              text: 'Nein, nein: Viertel nach acht! So sagen wir das hier in Sachsen.',
              meaning: 'No, no: quarter past eight! That’s how we say it here in Saxony.',
            },
            {
              speaker: 'Alex',
              text: 'Ach so! Kein Problem, ich nehme das Paket an.',
              meaning: 'I see! No problem, I’ll take in the parcel.',
            },
            {
              speaker: 'Frau Wagner',
              text: 'Sie sind ein Schatz! Vielen Dank!',
              meaning: 'You’re a treasure! Thank you so much!',
            },
          ],
          note: 'In much of eastern and southern Germany and in Austria, viertel neun means 8:15 (a quarter of the way to nine) and dreiviertel neun means 8:45. Everyone understands Viertel nach acht too. Taking in parcels for neighbours is completely normal here.',
        },
        {
          kind: 'teach',
          title: 'Times, the casual way',
          items: [
            { target: 'kurz nach acht', meaning: 'just after eight' },
            { target: 'gegen acht', meaning: 'around eight' },
            { target: 'so um acht', meaning: 'eight-ish', note: 'Very casual and vague.' },
            {
              target: 'viertel neun / dreiviertel neun',
              meaning: '8:15 / 8:45 (east and south)',
            },
            {
              target: 'pünktlich',
              meaning: 'on time',
              note: 'Being on time matters. Running five minutes late? Send a message.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Frau Wagner says the parcel comes “um viertel neun”. When is that?',
          options: ['8:15', '8:45', '9:15'],
          answer: 0,
          explanation: 'viertel neun: a quarter of the way to nine, so 8:15.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. When do they meet?',
          audio: 'Wir treffen uns so gegen sieben, okay?',
          options: ['At about seven', 'At exactly seven', 'At half past seven'],
          answer: 0,
          explanation: 'gegen sieben: around seven. So makes it even more relaxed.',
        },
        {
          kind: 'scene',
          title: 'Not a morning person',
          intro: 'Breakfast in the WG. Jonas is not a morning person.',
          lines: [
            {
              speaker: 'Lena',
              text: 'Morgen, Jonas! Gut geschlafen?',
              meaning: 'Morning, Jonas! Sleep well?',
            },
            {
              speaker: 'Jonas',
              text: 'Nee. Ich bin total müde.',
              real: 'Nee. Bin total müde.',
              meaning: 'Nope. I’m totally tired.',
              realMeaning: 'Nope. Totally tired.',
            },
            {
              speaker: 'Lena',
              text: 'Wann stehst du denn auf?',
              meaning: 'So when do you get up?',
            },
            {
              speaker: 'Jonas',
              text: 'Um sechs. Meine Schicht fängt um sieben an.',
              meaning: 'At six. My shift starts at seven.',
            },
            {
              speaker: 'Lena',
              text: 'Oh, früh! Und wann hast du Feierabend?',
              meaning: 'Oh, early! And when do you finish work?',
            },
            {
              speaker: 'Jonas',
              text: 'Um drei. Dann mache ich erst mal gar nichts.',
              real: 'Um drei. Dann mach ich erst mal gar nix.',
              meaning: 'At three. Then, first of all, I do nothing at all.',
            },
          ],
          note: 'Many Germans start work early, at seven or eight, and finish early too. Feierabend is the end of the working day and the free time after it.',
        },
        {
          kind: 'teach',
          title: 'Talking about your day',
          items: [
            { target: 'Gut geschlafen?', meaning: 'Sleep well?' },
            { target: 'Ich bin müde.', meaning: 'I’m tired.' },
            {
              target: 'der Feierabend',
              meaning: 'end of the working day',
              note: 'Wann hast du Feierabend? When do you finish work?',
            },
            { target: 'früh / spät', meaning: 'early / late' },
            {
              target: 'erst mal',
              meaning: 'first (of all), for now',
              note: 'Very common: Erst mal Kaffee! Coffee first!',
            },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match what you hear.',
          pairs: [
            ['gegen acht', 'around eight'],
            ['kurz nach acht', 'just after eight'],
            ['pünktlich', 'on time'],
            ['müde', 'tired'],
            ['erst mal', 'first of all'],
          ],
        },
        {
          kind: 'choose',
          prompt:
            'At five, a colleague closes her laptop and says: “So, Feierabend!” What does she mean?',
          options: ['Work is over for today', 'She is hungry', 'She is late'],
          answer: 0,
          explanation: 'Feierabend: the end of the working day, and the free time after it.',
        },
        {
          kind: 'build',
          prompt: 'Ask a friend: “When do you finish work?”',
          answer: ['Wann', 'hast', 'du', 'Feierabend?'],
          extra: ['bist'],
          explanation: 'Feierabend haben: Wann hast du Feierabend?',
        },
        {
          kind: 'type',
          prompt: 'You are running late. Message your friend: “Sorry, I’m coming at around eight.”',
          accepted: ['Sorry, ich komme gegen acht.', 'Sorry, ich komme so gegen acht.'],
          hint: 'Sorry + ich komme + gegen acht.',
          explanation: 'gegen acht: around eight. Sorry is completely normal in German messages.',
        },
        {
          kind: 'speak',
          prompt: 'Tell a new flatmate about your day.',
          lines: [
            'Ich stehe früh auf, so um sechs.',
            'Um halb sechs habe ich Feierabend.',
            'Dann bin ich total müde.',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u8-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: times you hear, a message you write',
      outcome:
        'Catch times in Hören, read an invitation in Lesen Teil 1, and answer it for Schreiben Teil 2.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: times in Hören',
          body: 'Times come up in almost every listening task. Watch for two traps: halb (halb sieben is 6:30) and a time that is corrected. Always listen to the end.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. When does the course start?',
          audio: 'Der Deutschkurs fängt am Montag an, um halb sieben am Abend.',
          options: ['Monday, 6:30 pm', 'Monday, 7:30 pm', 'Sunday, 6:30 pm'],
          answer: 0,
          explanation: 'halb sieben: 6:30, and am Abend: in the evening.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. When is the appointment now?',
          audio:
            'Hallo, hier ist die Praxis Doktor Braun. Ihr Termin ist nicht um neun, sondern um Viertel nach zehn.',
          options: ['10:15', '9:00', '9:15'],
          answer: 0,
          explanation: '“Nicht um neun, sondern um Viertel nach zehn”: the second time counts.',
        },
        {
          kind: 'rule',
          title: 'Lesen Teil 1: an invitation',
          body: 'Lesen Teil 1 again, with a longer message. Read the sentence first, then find the day and the time it is about.',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Die Party ist am Samstagabend.',
          context: karimInvitation,
          options: ['Richtig', 'Falsch'],
          answer: 0,
          explanation: 'am Samstag … am Abend: on Saturday evening.',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Alex soll um acht Uhr kommen.',
          context: karimInvitation,
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation: 'The party starts at eight, but Karim asks Alex to come at seven to help.',
        },
        {
          kind: 'teach',
          title: 'Answering an invitation',
          items: [
            { target: 'der Geburtstag', meaning: 'birthday' },
            { target: 'die Einladung', meaning: 'invitation' },
            { target: 'Danke für die Einladung!', meaning: 'Thanks for the invitation!' },
            { target: 'leider', meaning: 'unfortunately' },
            { target: 'erst um acht', meaning: 'not until eight' },
          ],
        },
        {
          kind: 'rule',
          title: 'The exam: Schreiben Teil 2',
          body: 'You write a message of about 30 words that answers three points. Write one or two sentences for each point, and start and end like a real message.',
        },
        {
          kind: 'build',
          prompt: 'Point 1: Say you would love to come.',
          answer: ['Ich', 'komme', 'sehr', 'gern.'],
          extra: ['kommst'],
          explanation: 'Ich komme gern: I’d love to come. Sehr makes it warmer.',
        },
        {
          kind: 'build',
          prompt: 'Point 2: Say that unfortunately you can only come at eight.',
          answer: ['Leider', 'komme', 'ich', 'erst', 'um', 'acht.'],
          extra: ['bin'],
          explanation: 'Leider first, so the verb comes next: Leider komme ich erst um acht.',
        },
        {
          kind: 'type',
          prompt: 'Point 3: Ask “What can I bring?”',
          accepted: ['Was kann ich mitbringen?'],
          hint: 'Was kann ich … and mitbringen at the end, in one piece.',
          explanation: 'With kann, the second verb goes to the end in one piece: mitbringen.',
        },
        {
          kind: 'speak',
          prompt: 'Read your whole message out loud.',
          lines: [
            'Hallo Karim, danke für die Einladung!',
            'Ich komme sehr gern, aber leider erst um acht.',
            'Was kann ich mitbringen? Viele Grüße, Alex',
          ],
        },
      ],
    },
  ],
);

const courseAds =
  'a) Tanzkurs für Anfänger: Salsa und Tango. Jeden Dienstag, 19 bis 20.30 Uhr. 8 Termine, 60 €. Anmeldung bei der VHS.\nb) Lauftreff im Park: Wir laufen jeden Samstag um 9 Uhr, 5 km. Für alle, kostenlos! Keine Anmeldung.';
const mariaVoicemail =
  'Hallo Alex, hier ist Maria. Wir gehen morgen schwimmen. Wir treffen uns nicht am Schwimmbad, sondern um zwei Uhr vor dem Supermarkt. Bis morgen!';

const unit9 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u9',
    number: 9,
    icon: 'bike',
    title: 'Freizeit',
    canDo:
      'Talk about hobbies, say what you like and like best, and make, accept or turn down plans.',
  },
  [
    {
      id: 'de-a1-u9-hobbies',
      session: 'Words',
      title: 'What do you do for fun?',
      outcome: 'Name common hobbies and say what you like doing.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'In the course break',
          intro: 'Karim and Maria talk about what they do outside the course.',
          lines: [
            {
              speaker: 'Karim',
              text: 'Was machst du so in deiner Freizeit?',
              meaning: 'So what do you do in your free time?',
            },
            {
              speaker: 'Maria',
              text: 'Ich tanze gern. Samba, natürlich! Und du?',
              meaning: 'I like dancing. Samba, of course! And you?',
            },
            {
              speaker: 'Karim',
              text: 'Ich spiele jeden Sonntag Fußball.',
              real: 'Ich kick jeden Sonntag mit Freunden.',
              meaning: 'I play football every Sunday.',
              realMeaning: 'I play football with friends every Sunday.',
            },
            { speaker: 'Maria', text: 'Cool! In einem Verein?', meaning: 'Cool! In a club?' },
            {
              speaker: 'Karim',
              text: 'Ja, im Sportverein hier um die Ecke. Und ich lese gern.',
              meaning: 'Yes, in the sports club round the corner. And I like reading.',
            },
            {
              speaker: 'Maria',
              text: 'Ich auch! Und am Wochenende gehe ich gern spazieren.',
              meaning: 'Me too! And at the weekend I like going for walks.',
            },
          ],
          note: 'Germany has more than 600,000 clubs (Vereine) for sport, music, gardening and much more. Joining one is a classic way to make German friends. Going for a walk, spazieren gehen, is a real pastime here, especially on Sundays.',
        },
        {
          kind: 'teach',
          title: 'Hobbies',
          items: [
            { target: 'Sport machen', meaning: 'to do sport' },
            { target: 'Fußball spielen', meaning: 'to play football' },
            { target: 'schwimmen', meaning: 'to swim' },
            { target: 'tanzen', meaning: 'to dance' },
            { target: 'lesen', meaning: 'to read' },
            { target: 'Musik hören', meaning: 'to listen to music' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Karim plays football “im Sportverein”. What is a Verein?',
          options: ['A club', 'A stadium', 'A team shirt'],
          answer: 0,
          explanation: 'der Verein: a club. There is one for almost everything.',
        },
        {
          kind: 'teach',
          title: 'More free time',
          items: [
            { target: 'spazieren gehen', meaning: 'to go for a walk' },
            { target: 'Rad fahren', meaning: 'to cycle', note: 'Also: Fahrrad fahren.' },
            { target: 'wandern', meaning: 'to hike' },
            { target: 'kochen', meaning: 'to cook' },
            { target: 'Freunde treffen', meaning: 'to meet friends' },
            { target: 'ins Kino gehen', meaning: 'to go to the cinema' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the hobbies.',
          pairs: [
            ['schwimmen', 'swim'],
            ['tanzen', 'dance'],
            ['wandern', 'hike'],
            ['Rad fahren', 'cycle'],
            ['spazieren gehen', 'go for a walk'],
          ],
        },
        {
          kind: 'rule',
          title: 'gern: liking what you do',
          body: 'To say you like doing something, put gern (or gerne) after the verb: Ich lese gern. Maria tanzt gern. Not your thing? Ich koche nicht gern.',
        },
        {
          kind: 'choose',
          prompt: 'Maria likes swimming. Which sentence is correct?',
          options: ['Sie schwimmt gern.', 'Sie gern schwimmt.', 'Sie schwimmen gern.'],
          answer: 0,
          explanation: 'The verb second with its sie ending, then gern: Sie schwimmt gern.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does he not like doing?',
          audio: 'Ich lese gern, aber ich koche nicht gern.',
          options: ['Cooking', 'Reading', 'Dancing'],
          answer: 0,
          explanation: 'nicht gern: does not like doing. He likes reading, not cooking.',
        },
        {
          kind: 'build',
          prompt: 'Say: “I like going for a walk at the weekend.”',
          answer: ['Ich', 'gehe', 'am', 'Wochenende', 'gern', 'spazieren.'],
          also: ['Ich gehe gern am Wochenende spazieren.'],
          extra: ['um'],
          explanation: 'spazieren goes to the end, like the second part of a separable verb.',
        },
        {
          kind: 'type',
          prompt: 'Ask a friend: “Do you like dancing?”',
          accepted: ['Tanzt du gern?', 'Tanzt du gerne?'],
          hint: 'Start with the verb: Tanzt du …?',
          explanation: 'Yes/no questions start with the verb: Tanzt du gern?',
        },
        {
          kind: 'speak',
          prompt: 'Say what you like doing in your free time.',
          lines: [
            'Ich lese gern und ich höre gern Musik.',
            'Am Wochenende gehe ich gern spazieren.',
            'Aber ich koche nicht gern.',
          ],
          tip: 'In spazieren and Sport, sp sounds like shp.',
        },
      ],
    },
    {
      id: 'de-a1-u9-lieber',
      session: 'Grammar',
      title: 'Du fährst, er liest: verbs that change, and gern, lieber, am liebsten',
      outcome: 'Use verbs that change their vowel, and say what you like, prefer and like best.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'Verbs that change their vowel',
          body: 'You met sprechen → du sprichst in Unit 2. A few other common verbs change their vowel too, but only with du and with er, sie, es. Ich, wir, ihr and sie (they) stay regular.',
          table: [
            ['fahren', 'du fährst, er fährt'],
            ['schlafen', 'du schläfst, sie schläft'],
            ['lesen', 'du liest, er liest'],
            ['sehen', 'du siehst, sie sieht'],
            ['essen', 'du isst, er isst'],
            ['treffen', 'du triffst, sie trifft'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Karim ___ gern Rad. (fahren)',
          options: ['fährt', 'fahrt', 'fährst'],
          answer: 0,
          explanation: 'er, sie, es: fährt, with ä.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: ___ du gern Krimis? (lesen)',
          options: ['Liest', 'Lest', 'Lesst'],
          answer: 0,
          explanation:
            'du liest: e becomes ie. Krimis are crime stories, Germany’s favourite on TV.',
        },
        {
          kind: 'teach',
          title: 'Verbs to know',
          items: [
            { target: 'fahren', meaning: 'to go (by vehicle), drive, ride', note: 'Er fährt Rad.' },
            { target: 'schlafen', meaning: 'to sleep', note: 'Sie schläft lange.' },
            { target: 'sehen', meaning: 'to see, watch', note: 'Wir sehen einen Film.' },
            { target: 'essen', meaning: 'to eat', note: 'Was isst du gern?' },
            { target: 'treffen', meaning: 'to meet', note: 'Er trifft Freunde.' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match each verb with its er form.',
          pairs: [
            ['fahren', 'er fährt'],
            ['lesen', 'er liest'],
            ['essen', 'er isst'],
            ['sehen', 'er sieht'],
            ['schlafen', 'er schläft'],
          ],
        },
        {
          kind: 'rule',
          title: 'gern, lieber, am liebsten',
          body: 'gern: you like it. lieber: you like it more, you prefer it. am liebsten: you like it best of all. Gern and lieber go after the verb; am liebsten usually starts the sentence.',
          table: [
            ['Ich schwimme gern.', 'I like swimming.'],
            ['Ich wandere lieber.', 'I prefer hiking.'],
            ['Am liebsten tanze ich.', 'Most of all, I like dancing.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Lena asks: “Kino oder Theater?” Jonas: “Ich gehe ___ ins Kino.” (he prefers it)',
          options: ['lieber', 'gern', 'am liebsten'],
          answer: 0,
          explanation: 'lieber: prefer, for a choice between two.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: ___ spiele ich Tennis. (best of all)',
          options: ['Am liebsten', 'Lieber', 'Gern'],
          answer: 0,
          explanation: 'Am liebsten at the start, then the verb: Am liebsten spiele ich Tennis.',
        },
        {
          kind: 'teach',
          title: 'Liking things and people: mögen',
          items: [
            {
              target: 'Ich mag Pizza.',
              meaning: 'I like pizza.',
              note: 'mögen with things and people; gern with verbs.',
            },
            { target: 'Magst du Krimis?', meaning: 'Do you like crime stories?' },
            { target: 'Ich mag keine Horrorfilme.', meaning: 'I don’t like horror films.' },
          ],
        },
        {
          kind: 'build',
          prompt: 'Say: “At the weekend I’d rather sleep in.”',
          answer: ['Am', 'Wochenende', 'schlafe', 'ich', 'lieber', 'lange.'],
          extra: ['schläfe'],
          explanation: 'Only du and er, sie, es change: ich schlafe, du schläfst.',
        },
        {
          kind: 'type',
          prompt: 'Write: “She is meeting friends.” (treffen)',
          accepted: ['Sie trifft Freunde.'],
          hint: 'treffen → sie trifft, with i and double f.',
          explanation: 'sie trifft: e becomes i. English uses -ing here; German does not.',
        },
        {
          kind: 'speak',
          prompt: 'Say what you like, prefer and like best.',
          lines: ['Ich sehe gern Filme.', 'Ich lese lieber Krimis.', 'Am liebsten fahre ich Rad.'],
        },
      ],
    },
    {
      id: 'de-a1-u9-plans',
      session: 'Real talk',
      title: '“Hast du Bock?” Making plans',
      outcome: 'Suggest something, say yes or no kindly, and agree on a time.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'Friday evening',
          intro: 'Jonas wants to go out. Alex is on the sofa.',
          lines: [
            {
              speaker: 'Jonas',
              text: 'Hast du heute Lust auf Kino?',
              real: 'Hast du heute Bock auf Kino?',
              meaning: 'Do you feel like going to the cinema today?',
              realMeaning: 'Do you fancy the cinema today?',
            },
            { speaker: 'Alex', text: 'Hm, welcher Film?', meaning: 'Hmm, which film?' },
            {
              speaker: 'Jonas',
              text: 'Ein Krimi. Er fängt um Viertel nach acht an.',
              real: 'So’n Krimi. Fängt Viertel nach acht an.',
              meaning: 'A crime film. It starts at quarter past eight.',
              realMeaning: 'Some crime film. Starts quarter past eight.',
            },
            {
              speaker: 'Alex',
              text: 'Heute nicht, ich bin zu müde. Wie wär’s mit morgen?',
              meaning: 'Not today, I’m too tired. How about tomorrow?',
            },
            {
              speaker: 'Jonas',
              text: 'Morgen spiele ich Fußball. Sonntag?',
              meaning: 'Tomorrow I’m playing football. Sunday?',
            },
            {
              speaker: 'Alex',
              text: 'Sonntag passt. Um wie viel Uhr?',
              meaning: 'Sunday works. What time?',
            },
            {
              speaker: 'Jonas',
              text: 'Um sechs? Und danach essen wir noch was.',
              real: 'Um sechs? Und danach noch ’n Döner.',
              meaning: 'At six? And afterwards we’ll eat something.',
              realMeaning: 'At six? And a döner afterwards.',
            },
            { speaker: 'Alex', text: 'Super, abgemacht!', meaning: 'Great, it’s a deal!' },
          ],
          note: 'Bock haben is very common casual German for “to feel like”: Hast du Bock? Keinen Bock! With people you call Sie, use Lust: Haben Sie Lust …?',
        },
        {
          kind: 'teach',
          title: 'Suggesting and agreeing',
          items: [
            { target: 'Hast du Lust auf Kino?', meaning: 'Do you feel like the cinema?' },
            {
              target: 'Hast du Bock?',
              meaning: 'Do you fancy it?',
              note: 'Casual. Keinen Bock! means “Can’t be bothered!”',
            },
            { target: 'Wie wär’s mit morgen?', meaning: 'How about tomorrow?' },
            { target: 'Das passt.', meaning: 'That works (for me).' },
            { target: 'Abgemacht!', meaning: 'It’s a deal!' },
            {
              target: 'Mal sehen.',
              meaning: 'We’ll see.',
              note: 'Often a polite maybe, or even a polite no.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'You invite a friend, and she answers: “Mal sehen.” What does that often mean?',
          options: ['Maybe, or a polite no', 'Yes, definitely', 'Let’s watch a film'],
          answer: 0,
          explanation: 'Mal sehen: we’ll see. Don’t count on it!',
        },
        {
          kind: 'choose',
          prompt: 'Listen. When and where do they meet?',
          audio: 'Sonntag passt mir. Treffen wir uns um sechs vor dem Kino?',
          options: [
            'Sunday at six, at the cinema',
            'Saturday at six, at home',
            'Sunday at seven, at the cinema',
          ],
          answer: 0,
          explanation: 'Sonntag, um sechs, vor dem Kino: in front of the cinema.',
        },
        {
          kind: 'teach',
          title: 'Saying no kindly',
          items: [
            { target: 'Ich kann leider nicht.', meaning: 'I can’t, unfortunately.' },
            { target: 'Ich habe schon was vor.', meaning: 'I already have plans.' },
            { target: 'Vielleicht ein andermal?', meaning: 'Maybe another time?' },
            { target: 'Schade!', meaning: 'What a pity!' },
          ],
        },
        {
          kind: 'scene',
          title: 'A voice message',
          intro: 'Maria and Karim plan Saturday by voice message.',
          lines: [
            {
              speaker: 'Maria',
              text: 'Hi Karim! Am Samstag gehen wir wandern, in der Sächsischen Schweiz. Kommst du mit?',
              meaning:
                'Hi Karim! On Saturday we’re going hiking in Saxon Switzerland. Are you coming?',
            },
            {
              speaker: 'Karim',
              text: 'Klingt super! Wann fahrt ihr los?',
              meaning: 'Sounds great! When are you setting off?',
            },
            {
              speaker: 'Maria',
              text: 'Um acht, am Hauptbahnhof. Ziemlich früh, ich weiß!',
              meaning: 'At eight, at the main station. Pretty early, I know!',
            },
            {
              speaker: 'Karim',
              text: 'Oh, acht ist hart. Aber okay, ich bin dabei!',
              meaning: 'Oh, eight is tough. But OK, count me in!',
            },
          ],
          note: 'The Sächsische Schweiz, about two hours from Leipzig, is famous for its sandstone rocks and hiking trails. Note ihr fahrt: no vowel change with ihr.',
        },
        {
          kind: 'choose',
          prompt: 'Karim says: “Ich bin dabei!” What does he mean?',
          options: ['Count me in', 'I am already there', 'I am busy'],
          answer: 0,
          explanation: 'dabei sein: to be part of it. Ich bin dabei! Count me in!',
        },
        {
          kind: 'match',
          prompt: 'Match the answers.',
          pairs: [
            ['Abgemacht!', 'It’s a deal!'],
            ['Schade!', 'What a pity!'],
            ['Mal sehen.', 'We’ll see.'],
            ['Ich bin dabei!', 'Count me in!'],
            ['Das passt.', 'That works.'],
          ],
        },
        {
          kind: 'build',
          prompt: 'Suggest: “How about Saturday?”',
          answer: ['Wie', 'wär’s', 'mit', 'Samstag?'],
          extra: ['am'],
          explanation: 'Wie wär’s mit + day, with no am.',
        },
        {
          kind: 'type',
          prompt: 'Turn down an invitation kindly: “Unfortunately I can’t. Maybe another time?”',
          accepted: [
            'Ich kann leider nicht. Vielleicht ein andermal?',
            'Leider kann ich nicht. Vielleicht ein andermal?',
          ],
          hint: 'Ich kann leider nicht. + Vielleicht ein andermal?',
          explanation: 'Leider softens the no, and offering another time keeps it friendly.',
        },
        {
          kind: 'speak',
          prompt: 'Invite a friend, then agree on a time.',
          lines: [
            'Hast du am Samstag Lust auf Kino?',
            'Wie wär’s mit sieben Uhr?',
            'Super, abgemacht!',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u9-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: course ads, a voicemail and free-time cards',
      outcome:
        'Choose the right ad in Lesen Teil 2, catch a place and time in Hören Teil 3, and ask about free time in Sprechen Teil 2.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'Lesen Teil 2: course ads',
          body: 'You know this task from Unit 7: two short texts, one question, a or b. This time: offers from the Volkshochschule (VHS), the adult education centre found in nearly every German town.',
        },
        {
          kind: 'teach',
          title: 'Words in course ads',
          items: [
            {
              target: 'die Volkshochschule',
              meaning: 'adult education centre',
              note: 'Short: VHS.',
            },
            { target: 'der Anfänger, die Anfängerin', meaning: 'beginner' },
            { target: 'die Anmeldung', meaning: 'registration, signing up' },
            { target: 'kostenlos', meaning: 'free of charge' },
            { target: 'jeden Dienstag', meaning: 'every Tuesday' },
          ],
        },
        {
          kind: 'choose',
          prompt:
            'Sie möchten Sport machen, aber Sie haben nur am Wochenende Zeit. Welches Angebot passt?',
          context: courseAds,
          options: ['a) Tanzkurs', 'b) Lauftreff'],
          answer: 1,
          explanation: 'b is on Saturday, at the weekend. The dance course is on Tuesdays.',
        },
        {
          kind: 'choose',
          prompt: 'Sie möchten nichts bezahlen. Welches Angebot passt?',
          context: courseAds,
          options: ['a) Tanzkurs', 'b) Lauftreff'],
          answer: 1,
          explanation: 'kostenlos: free. The dance course costs 60 €.',
        },
        {
          kind: 'rule',
          title: 'The exam: Hören Teil 3',
          body: 'You hear a phone message twice and choose a, b or c: often a time, a day or a place. Read the question first, and watch out for nicht …, sondern … (not …, but …).',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Where do they meet?',
          audio: mariaVoicemail,
          options: ['In front of the supermarket', 'At the swimming pool', 'At Maria’s flat'],
          answer: 0,
          explanation:
            '“Nicht am Schwimmbad, sondern vor dem Supermarkt”: the second place counts.',
        },
        {
          kind: 'choose',
          prompt: 'Listen again. What time do they meet?',
          audio: mariaVoicemail,
          options: ['At two', 'At twelve', 'At ten'],
          answer: 0,
          explanation: '“um zwei Uhr”: at two.',
        },
        {
          kind: 'rule',
          title: 'Sprechen Teil 2: Freizeit',
          body: 'Free time is a favourite topic for the word cards: Sport, Wochenende, Hobby, Kino, Musik. Ask a real question with the word, and give a short, true answer.',
        },
        {
          kind: 'choose',
          prompt: 'Your card says “Wochenende”. Which question fits?',
          options: [
            'Was machst du am Wochenende?',
            'Wochenende machst du?',
            'Wie heißt dein Wochenende?',
          ],
          answer: 0,
          explanation: 'A full W-question with the card word: Was machst du am Wochenende?',
        },
        {
          kind: 'type',
          prompt: 'Your card says “Sport”. Ask your partner (Sie) if they like doing sport.',
          accepted: ['Machen Sie gern Sport?', 'Machen Sie gerne Sport?'],
          hint: 'Verb first: Machen Sie gern …?',
          explanation: 'Machen Sie gern Sport? Use du or Sie, but stay with one.',
        },
        {
          kind: 'match',
          prompt: 'Unit 9 review: match the pairs.',
          pairs: [
            ['am liebsten', 'best of all'],
            ['lieber', 'rather'],
            ['kostenlos', 'free of charge'],
            ['der Verein', 'club'],
            ['er fährt', 'he drives, rides'],
          ],
        },
        {
          kind: 'speak',
          prompt: 'Answer two free-time questions from your exam partner.',
          lines: [
            'Am Wochenende gehe ich gern wandern.',
            'Ja, ich mache gern Sport. Am liebsten schwimme ich.',
          ],
        },
      ],
    },
  ],
);

const practiceNotice =
  'Praxis Dr. Klein\nVom 4. bis 15. August geschlossen.\nAb 18. August sind wir wieder für Sie da.\nIn dringenden Fällen: Praxis Dr. Ahmadi, Lindenstraße 3.';

const unit10 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u10',
    number: 10,
    icon: 'calendar-month',
    title: 'Termine',
    canDo: 'Say and understand dates, talk about birthdays, and make or cancel an appointment.',
  },
  [
    {
      id: 'de-a1-u10-months',
      session: 'Words',
      title: 'Months and birthdays',
      outcome: 'Name the months and say when things happen in the year.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'When is your birthday?',
          intro: 'In the course break, Maria and Karim talk about birthdays.',
          lines: [
            {
              speaker: 'Maria',
              text: 'Karim, wann hast du Geburtstag?',
              meaning: 'Karim, when is your birthday?',
            },
            {
              speaker: 'Karim',
              text: 'Im März. Am zwölften März.',
              meaning: 'In March. On the twelfth of March.',
            },
            {
              speaker: 'Maria',
              text: 'Oh, schade, das ist vorbei! Meiner ist im Juli.',
              real: 'Oh, schade, schon vorbei! Meiner ist im Juli.',
              meaning: 'Oh, too bad, that’s over! Mine is in July.',
              realMeaning: 'Oh, too bad, already over! Mine is in July.',
            },
            {
              speaker: 'Karim',
              text: 'Im Juli? Dann machen wir eine Party!',
              meaning: 'In July? Then we’ll have a party!',
            },
            {
              speaker: 'Maria',
              text: 'Aber nicht vorher gratulieren, okay? Das bringt Unglück.',
              meaning: 'But don’t congratulate me early, OK? That brings bad luck.',
            },
            {
              speaker: 'Karim',
              text: 'Ach so? Okay, dann erst am Tag selbst.',
              meaning: 'Really? OK, then only on the day itself.',
            },
          ],
          note: 'In Germany, wishing someone a happy birthday before the day is said to bring bad luck. If you are late, say Alles Gute nachträglich! At work, the person with the birthday usually brings the cake.',
        },
        {
          kind: 'teach',
          title: 'The months',
          items: [
            {
              target: 'Januar, Februar, März',
              meaning: 'January, February, March',
              note: 'In Austria, January is often Jänner.',
            },
            { target: 'April, Mai, Juni', meaning: 'April, May, June' },
            {
              target: 'Juli, August, September',
              meaning: 'July, August, September',
              note: 'On the phone, people sometimes say Juno and Julei so June and July are not mixed up.',
            },
            { target: 'Oktober, November, Dezember', meaning: 'October, November, December' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Karim’s birthday is “am zwölften März”. When is it?',
          options: ['12 March', '2 March', '12 May'],
          answer: 0,
          explanation: 'zwölf → am zwölften: on the twelfth. März: March.',
        },
        {
          kind: 'teach',
          title: 'When in the year',
          items: [
            {
              target: 'im Mai',
              meaning: 'in May',
              note: 'Months take im: im Januar, im Dezember.',
            },
            {
              target: 'Anfang / Mitte / Ende Mai',
              meaning: 'at the beginning / in the middle / at the end of May',
            },
            { target: 'nächste Woche', meaning: 'next week' },
            { target: 'übermorgen', meaning: 'the day after tomorrow' },
            { target: 'Alles Gute zum Geburtstag!', meaning: 'Happy birthday!' },
            { target: 'Alles Gute nachträglich!', meaning: 'Happy belated birthday!' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the months.',
          pairs: [
            ['Januar', 'January'],
            ['März', 'March'],
            ['Mai', 'May'],
            ['Juli', 'July'],
            ['Oktober', 'October'],
            ['Dezember', 'December'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. When is the next course?',
          audio: 'Der nächste Kurs ist Ende Oktober.',
          options: [
            'At the end of October',
            'At the beginning of October',
            'In the middle of October',
          ],
          answer: 0,
          explanation: 'Ende Oktober: at the end of October.',
        },
        {
          kind: 'choose',
          prompt: 'A colleague’s birthday was yesterday. What do you say?',
          options: ['Alles Gute nachträglich!', 'Alles Gute für morgen!', 'Gute Nacht!'],
          answer: 0,
          explanation: 'nachträglich: belated. Wishing someone well in advance is avoided.',
        },
        {
          kind: 'build',
          prompt: 'Say: “My birthday is in July.”',
          answer: ['Mein', 'Geburtstag', 'ist', 'im', 'Juli.'],
          also: ['Im Juli ist mein Geburtstag.'],
          extra: ['am'],
          explanation: 'Months take im: im Juli. Dates take am: am zwölften Juli.',
        },
        {
          kind: 'type',
          prompt: 'Write: “next week”.',
          accepted: ['nächste Woche'],
          hint: 'nächste + Woche.',
          explanation: 'nächste Woche. Also nächsten Monat and nächstes Jahr.',
        },
        {
          kind: 'speak',
          prompt: 'Talk about birthdays.',
          lines: [
            'Mein Geburtstag ist im Juli.',
            'Wann hast du Geburtstag?',
            'Alles Gute nachträglich!',
          ],
          tip: 'In März, ä sounds like the e in “bed”, a little longer.',
        },
      ],
    },
    {
      id: 'de-a1-u10-dates',
      session: 'Grammar',
      title: 'Am dritten Mai: dates with ordinal numbers',
      outcome: 'Say and understand dates: der dritte Mai, am dritten Mai.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'Ordinal numbers',
          body: 'Dates use ordinal numbers. Up to 19, add -te to the number; from 20, add -ste. Four are different and worth learning by heart: erste, dritte, siebte, achte.',
          table: [
            ['1.', 'der erste'],
            ['2.', 'der zweite'],
            ['3.', 'der dritte'],
            ['7.', 'der siebte'],
            ['8.', 'der achte'],
            ['20.', 'der zwanzigste'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'How do you say “the fourth”?',
          options: ['der vierte', 'der vierste', 'der viertste'],
          answer: 0,
          explanation: 'Up to 19: the number + -te. vier → der vierte.',
        },
        {
          kind: 'choose',
          prompt: 'How do you say “the twenty-first”?',
          options: ['der einundzwanzigste', 'der einundzwanzigte', 'der einszwanzigste'],
          answer: 0,
          explanation: 'From 20: -ste. einundzwanzig → der einundzwanzigste.',
        },
        {
          kind: 'rule',
          title: 'der dritte, am dritten',
          body: 'What the date is: Heute ist der dritte Mai. When something happens: am dritten Mai. After am, the ending is -en.',
          table: [
            ['Heute ist der dritte Mai.', 'Today is the third of May.'],
            ['Die Party ist am dritten Mai.', 'The party is on the third of May.'],
          ],
        },
        {
          kind: 'teach',
          title: 'Asking about dates',
          items: [
            {
              target: 'Der Wievielte ist heute?',
              meaning: 'What’s the date today?',
              note: 'Casual: Den Wievielten haben wir heute?',
            },
            { target: 'Heute ist der erste.', meaning: 'Today is the first.' },
            { target: 'Am Wievielten?', meaning: 'On which date?' },
            { target: 'vom ersten bis zum fünften', meaning: 'from the first to the fifth' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: Mein Kurs beginnt ___ Mai.',
          options: ['am zweiten', 'der zweite', 'am zweite'],
          answer: 0,
          explanation: 'am + the ordinal with -en: am zweiten Mai.',
        },
        {
          kind: 'match',
          prompt: 'Match the dates.',
          pairs: [
            ['am ersten', 'on the 1st'],
            ['am dritten', 'on the 3rd'],
            ['am siebten', 'on the 7th'],
            ['am zwanzigsten', 'on the 20th'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. When is the appointment?',
          audio: 'Ihr Termin ist am siebzehnten Juni.',
          options: ['17 June', '7 June', '17 July'],
          answer: 0,
          explanation: 'am siebzehnten: the 17th. Juni, not Juli: listen to the end of the word.',
        },
        {
          kind: 'rule',
          title: 'Written dates',
          body: 'Germans write the day first, then the month, with dots: 3.5. is the 3rd of May, not the 5th of March. Read it aloud as der dritte Mai, or in everyday speech der dritte Fünfte.',
        },
        {
          kind: 'build',
          prompt: 'Say: “I was born on the eighth of March.”',
          answer: ['Ich', 'bin', 'am', 'achten', 'März', 'geboren.'],
          extra: ['achte'],
          explanation: 'am + achten, with -en. geboren goes to the end.',
        },
        {
          kind: 'type',
          prompt: 'Write: “Today is the first of June.”',
          accepted: ['Heute ist der erste Juni.'],
          hint: 'Heute ist der + erste + Juni.',
          explanation: 'After ist: der erste. After am: am ersten.',
        },
        {
          kind: 'speak',
          prompt: 'Say three dates that matter to you.',
          lines: [
            'Mein Geburtstag ist am achten März.',
            'Heute ist der zwölfte Oktober.',
            'Der Kurs ist vom ersten bis zum fünften Juni.',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u10-real',
      session: 'Real talk',
      title: '“Passt dir Donnerstag?” Booking and cancelling',
      outcome: 'Book, move and cancel an appointment, by phone and by message.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'At the hairdresser’s',
          intro: 'Alex calls a hairdresser to book a haircut.',
          lines: [
            {
              speaker: 'Friseurin',
              text: 'Salon Haarmonie, guten Tag!',
              meaning: 'Salon Haarmonie, hello!',
            },
            {
              speaker: 'Alex',
              text: 'Hallo, ich hätte gern einen Termin zum Haareschneiden.',
              meaning: 'Hello, I’d like an appointment for a haircut.',
            },
            {
              speaker: 'Friseurin',
              text: 'Gern. Wann passt es Ihnen?',
              meaning: 'Sure. When suits you?',
            },
            {
              speaker: 'Alex',
              text: 'Geht es am Donnerstag?',
              real: 'Geht’s am Donnerstag?',
              meaning: 'Is Thursday possible?',
            },
            {
              speaker: 'Friseurin',
              text: 'Donnerstag ist leider voll. Freitag um halb fünf?',
              meaning: 'Thursday is fully booked, unfortunately. Friday at half past four?',
            },
            {
              speaker: 'Alex',
              text: 'Ja, das passt mir gut.',
              meaning: 'Yes, that suits me well.',
            },
            {
              speaker: 'Friseurin',
              text: 'Prima. Und Ihr Name, bitte?',
              meaning: 'Great. And your name, please?',
            },
          ],
          note: 'German hairdressers love puns in their names: Haarmonie, Vorhair Nachhair, Kamm in. Hairdressers, doctors and offices mostly work with appointments, so book ahead.',
        },
        {
          kind: 'teach',
          title: 'Booking',
          items: [
            { target: 'der Termin', meaning: 'appointment' },
            { target: 'Wann passt es Ihnen?', meaning: 'When suits you?' },
            {
              target: 'Geht es am Donnerstag?',
              meaning: 'Is Thursday possible?',
              note: 'Casual: Passt dir Donnerstag?',
            },
            { target: 'voll', meaning: 'full, booked up', note: 'Also: ausgebucht.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. When is the haircut?',
          audio: 'Gut, dann sehen wir uns am Freitag um halb fünf.',
          options: ['Friday, 4:30', 'Friday, 5:30', 'Thursday, 4:30'],
          answer: 0,
          explanation: 'halb fünf: halfway to five, 4:30, as in Unit 8.',
        },
        {
          kind: 'scene',
          title: 'Something came up',
          intro: 'On Thursday evening, Alex has to cancel and calls the salon.',
          lines: [
            {
              speaker: 'Alex',
              text: 'Hallo, hier ist Alex. Ich habe morgen um halb fünf einen Termin.',
              meaning: 'Hello, it’s Alex. I have an appointment tomorrow at half past four.',
            },
            {
              speaker: 'Friseurin',
              text: 'Ja, ich sehe es hier. Was kann ich für Sie tun?',
              meaning: 'Yes, I can see it here. What can I do for you?',
            },
            {
              speaker: 'Alex',
              text: 'Leider muss ich absagen. Ich bin krank.',
              meaning: 'Unfortunately I have to cancel. I’m ill.',
            },
            {
              speaker: 'Friseurin',
              text: 'Kein Problem, gute Besserung! Machen wir einen neuen Termin?',
              meaning: 'No problem, get well soon! Shall we make a new appointment?',
            },
            {
              speaker: 'Alex',
              text: 'Ja, gern. Vielleicht nächste Woche?',
              meaning: 'Yes, please. Maybe next week?',
            },
          ],
          note: 'Cancel at least a day ahead if you can: many practices and salons charge for appointments that are missed without notice.',
        },
        {
          kind: 'teach',
          title: 'Changing plans',
          items: [
            {
              target: 'absagen',
              meaning: 'to cancel',
              note: 'Separable: Ich sage den Termin ab.',
            },
            { target: 'Ich bin krank.', meaning: 'I’m ill.' },
            { target: 'Gute Besserung!', meaning: 'Get well soon!' },
            { target: 'einen neuen Termin machen', meaning: 'to make a new appointment' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Someone tells you they are ill. What do you say?',
          options: ['Gute Besserung!', 'Alles Gute nachträglich!', 'Guten Appetit!'],
          answer: 0,
          explanation: 'Gute Besserung: get well soon.',
        },
        {
          kind: 'match',
          prompt: 'Match what you hear.',
          pairs: [
            ['Wann passt es Ihnen?', 'When suits you?'],
            ['voll', 'booked up'],
            ['absagen', 'to cancel'],
            ['Gute Besserung!', 'Get well soon!'],
            ['übermorgen', 'the day after tomorrow'],
          ],
        },
        {
          kind: 'build',
          prompt: 'Ask a friend casually: “Does Thursday work for you?”',
          answer: ['Passt', 'dir', 'Donnerstag?'],
          extra: ['du'],
          explanation: 'Passt dir …? Literally “does … suit you?”. No am needed here.',
        },
        {
          kind: 'type',
          prompt: 'Message a friend: “Sorry, I have to cancel.”',
          accepted: ['Sorry, ich muss absagen.', 'Tut mir leid, ich muss absagen.'],
          hint: 'ich muss + absagen at the end.',
          explanation: 'After muss, the second verb goes to the end in one piece: absagen.',
        },
        {
          kind: 'speak',
          prompt: 'Book an appointment by phone.',
          lines: [
            'Hallo, ich hätte gern einen Termin.',
            'Geht es am Freitag?',
            'Ja, das passt mir gut. Danke!',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u10-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: dates you hear, a notice, a message',
      outcome:
        'Catch dates in Hören, read a notice in Lesen Teil 3, and cancel an appointment in writing.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'The exam: dates in Hören',
          body: 'Dates come up often. Listen for the ending (-ten, -sten) and for the month. As with times, a date may be corrected, so listen to the end.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. When is the party?',
          audio: 'Die Party ist am fünfzehnten. Nein, Moment, am sechzehnten Mai!',
          options: ['16 May', '15 May', '6 May'],
          answer: 0,
          explanation: '“Nein, Moment”: the second date counts.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Until when is the shop closed?',
          audio: 'Liebe Kunden, unser Geschäft ist bis zum dritten Januar geschlossen.',
          options: ['Until 3 January', 'Until 13 January', 'Until 3 June'],
          answer: 0,
          explanation: 'bis zum dritten Januar: until the third of January.',
        },
        {
          kind: 'rule',
          title: 'Lesen Teil 3: a notice',
          body: 'Practices and offices put up notices when they close for a holiday. Look for vom … bis (from … to) and ab (from … on).',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Die Praxis ist im August fast zwei Wochen geschlossen.',
          context: practiceNotice,
          options: ['Richtig', 'Falsch'],
          answer: 0,
          explanation: 'Vom 4. bis 15. August: closed for almost two weeks.',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Am 16. August ist die Praxis wieder geöffnet.',
          context: practiceNotice,
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation: '“Ab 18. August”: it opens again on the 18th.',
        },
        {
          kind: 'teach',
          title: 'Words in notices',
          items: [
            { target: 'der Urlaub', meaning: 'holiday, time off' },
            { target: 'ab', meaning: 'from … on', note: 'Ab Montag: from Monday on.' },
            { target: 'dringend', meaning: 'urgent' },
            { target: 'wieder', meaning: 'again' },
          ],
        },
        {
          kind: 'rule',
          title: 'Schreiben Teil 2: cancel and suggest',
          body: 'A classic task: you can’t come to an appointment. Say sorry, give a reason, and suggest a new day.',
        },
        {
          kind: 'build',
          prompt: 'Point 1: Say that unfortunately you can’t come on Friday.',
          answer: ['Leider', 'kann', 'ich', 'am', 'Freitag', 'nicht', 'kommen.'],
          extra: ['bin'],
          explanation: 'Leider first, then kann, and kommen at the very end.',
        },
        {
          kind: 'build',
          prompt: 'Point 2: Give the reason: you have to work.',
          answer: ['Ich', 'muss', 'arbeiten.'],
          extra: ['arbeite'],
          explanation: 'muss, then the second verb at the end: arbeiten.',
        },
        {
          kind: 'type',
          prompt: 'Point 3: Suggest a new date: “Is the twelfth possible?”',
          accepted: ['Geht es am zwölften?', 'Geht es am zwölften auch?', 'Passt es am zwölften?'],
          hint: 'Geht es + am zwölften?',
          explanation: 'Geht es am zwölften? Short and polite.',
        },
        {
          kind: 'speak',
          prompt: 'Read your message aloud.',
          lines: [
            'Liebe Frau Klein, leider kann ich am Freitag nicht kommen.',
            'Ich muss arbeiten. Geht es am zwölften?',
            'Viele Grüße, Alex',
          ],
        },
      ],
    },
  ],
);

const libraryPages =
  'a) Stadtbibliothek: Mo–Fr 10–19 Uhr, Sa 10–14 Uhr. Am Markt 10. Straßenbahn 9, Haltestelle Markt.\nb) Musikbibliothek: Di und Do 13–18 Uhr. Parkstraße 2. Bus 89, Haltestelle Parkstraße.';
const postDirections =
  'Gehen Sie hier geradeaus bis zur Kirche. Die Post ist dann links, neben dem Café.';

const unit11 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u11',
    number: 11,
    icon: 'city-variant-outline',
    title: 'In der Stadt',
    canDo: 'Ask the way and follow directions, name places in town, and give simple instructions.',
  },
  [
    {
      id: 'de-a1-u11-places',
      session: 'Words',
      title: 'Places in town',
      outcome: 'Name places in town and ask how to get there.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'In the city centre',
          intro: 'Maria and Karim are in the centre of Leipzig. Maria needs a pharmacy.',
          lines: [
            {
              speaker: 'Maria',
              text: 'Karim, gibt es hier eine Apotheke?',
              meaning: 'Karim, is there a pharmacy around here?',
            },
            {
              speaker: 'Karim',
              text: 'Ja, am Marktplatz, gegenüber vom Rathaus.',
              meaning: 'Yes, on the market square, opposite the town hall.',
            },
            { speaker: 'Maria', text: 'Ist das weit?', meaning: 'Is that far?' },
            {
              speaker: 'Karim',
              text: 'Nein, nur fünf Minuten zu Fuß. Wir gehen hier geradeaus.',
              meaning: 'No, only five minutes on foot. We go straight on here.',
            },
            {
              speaker: 'Maria',
              text: 'Und danach muss ich noch zur Post.',
              real: 'Und danach muss ich noch schnell zur Post.',
              meaning: 'And after that I still need to go to the post office.',
              realMeaning: 'And after that I still need to pop to the post office.',
            },
            {
              speaker: 'Karim',
              text: 'Die Post ist direkt am Bahnhof. Das ist auch nicht weit.',
              meaning: 'The post office is right by the station. That’s not far either.',
            },
          ],
          note: 'Many German towns are built around a Marktplatz with the Rathaus (town hall) and a church. Most medicines, even painkillers, are sold only in an Apotheke, marked with a red A.',
        },
        {
          kind: 'teach',
          title: 'In town',
          items: [
            { target: 'der Bahnhof', meaning: 'station' },
            { target: 'die Apotheke', meaning: 'pharmacy' },
            { target: 'die Post', meaning: 'post office' },
            { target: 'die Bank', meaning: 'bank' },
            { target: 'das Rathaus', meaning: 'town hall' },
            { target: 'der Marktplatz', meaning: 'market square' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Maria needs painkillers. Where does she go?',
          options: ['In die Apotheke', 'In den Supermarkt', 'In die Post'],
          answer: 0,
          explanation:
            'In Germany, most medicines, even painkillers, are sold only in an Apotheke.',
        },
        {
          kind: 'teach',
          title: 'How far?',
          items: [
            { target: 'Ist das weit?', meaning: 'Is that far?' },
            { target: 'zu Fuß', meaning: 'on foot' },
            { target: 'geradeaus', meaning: 'straight on' },
            { target: 'gegenüber', meaning: 'opposite' },
            { target: 'direkt am Bahnhof', meaning: 'right by the station' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the places.',
          pairs: [
            ['der Bahnhof', 'station'],
            ['die Apotheke', 'pharmacy'],
            ['das Rathaus', 'town hall'],
            ['der Marktplatz', 'market square'],
            ['die Post', 'post office'],
          ],
        },
        {
          kind: 'rule',
          title: 'zum, zur: going to a place',
          body: 'To say where you are going, use zum for der and das words and zur for die words: zum Bahnhof, zum Rathaus, zur Post, zur Apotheke. zum is short for zu dem, zur for zu der.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Ich gehe ___ Post.',
          options: ['zur', 'zum', 'zu'],
          answer: 0,
          explanation: 'die Post → zur Post.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Where does she want to go?',
          audio: 'Entschuldigung, wie komme ich zum Rathaus?',
          options: ['To the town hall', 'To the station', 'To the post office'],
          answer: 0,
          explanation: 'zum Rathaus: to the town hall.',
        },
        {
          kind: 'build',
          prompt: 'Ask: “How do I get to the station?”',
          answer: ['Wie', 'komme', 'ich', 'zum', 'Bahnhof?'],
          extra: ['zur'],
          explanation: 'der Bahnhof → zum Bahnhof.',
        },
        {
          kind: 'type',
          prompt: 'Write: “I am going to the pharmacy.”',
          accepted: ['Ich gehe zur Apotheke.', 'Ich gehe in die Apotheke.'],
          hint: 'die Apotheke → zur Apotheke.',
          explanation: 'zur Apotheke (towards it) and in die Apotheke (into it) are both natural.',
        },
        {
          kind: 'speak',
          prompt: 'Ask about places in your town.',
          lines: ['Gibt es hier eine Apotheke?', 'Ist das weit?', 'Wie komme ich zur Post?'],
          tip: 'In Apotheke, the stress is on the e: a-po-TEE-ke.',
        },
      ],
    },
    {
      id: 'de-a1-u11-imperative',
      session: 'Grammar',
      title: 'Gehen Sie geradeaus! Giving instructions',
      outcome: 'Understand and give directions and instructions with the imperative.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'Instructions to someone you call Sie',
          body: 'Put the verb first and keep Sie: Gehen Sie geradeaus. Nehmen Sie den Bus. Add bitte to sound friendly.',
          table: [
            ['gehen', 'Gehen Sie geradeaus.'],
            ['nehmen', 'Nehmen Sie die zweite Straße links.'],
            ['warten', 'Warten Sie bitte hier.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Which sentence tells a stranger to take the bus?',
          options: ['Nehmen Sie den Bus.', 'Sie nehmen den Bus?', 'Nimm Sie den Bus.'],
          answer: 0,
          explanation: 'Verb first, then Sie: Nehmen Sie den Bus.',
        },
        {
          kind: 'rule',
          title: 'Instructions to a friend (du)',
          body: 'Take the du form and drop -st and du: du gehst → Geh! du kommst → Komm! An e that changes to i stays: du nimmst → Nimm! An a that changes to ä does not: du fährst → Fahr!',
          table: [
            ['du gehst', 'Geh!'],
            ['du kommst', 'Komm mit!'],
            ['du nimmst', 'Nimm den Bus!'],
            ['du fährst', 'Fahr langsam!'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Tell a friend: “Come with me!”',
          options: ['Komm mit!', 'Kommst mit!', 'Komm du mit!'],
          answer: 0,
          explanation: 'du kommst → Komm! The prefix mit goes to the end.',
        },
        {
          kind: 'choose',
          prompt: 'Tell a friend: “Take the tram!” (nehmen)',
          options: ['Nimm die Straßenbahn!', 'Nehm die Straßenbahn!', 'Nimmst die Straßenbahn!'],
          answer: 0,
          explanation: 'du nimmst → Nimm! The i stays.',
        },
        {
          kind: 'teach',
          title: 'Directions',
          items: [
            { target: 'die erste Straße links', meaning: 'the first street on the left' },
            { target: 'an der Ampel', meaning: 'at the traffic lights' },
            { target: 'an der Kreuzung', meaning: 'at the crossroads' },
            { target: 'über die Brücke', meaning: 'over the bridge' },
            { target: 'bis zur Kirche', meaning: 'as far as the church' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the directions.',
          pairs: [
            ['geradeaus', 'straight on'],
            ['an der Ampel', 'at the traffic lights'],
            ['die erste Straße links', 'the first street on the left'],
            ['über die Brücke', 'over the bridge'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Where do you turn?',
          audio: 'Gehen Sie bis zur Ampel und dann rechts.',
          options: [
            'Right at the traffic lights',
            'Left at the traffic lights',
            'Right at the church',
          ],
          answer: 0,
          explanation: 'bis zur Ampel, dann rechts.',
        },
        {
          kind: 'build',
          prompt: 'Tell a stranger: “Take the first street on the right.”',
          answer: ['Nehmen', 'Sie', 'die', 'erste', 'Straße', 'rechts.'],
          extra: ['Nimm'],
          explanation: 'Verb first, then Sie. Nimm is for a friend.',
        },
        {
          kind: 'type',
          prompt: 'Tell a friend: “Wait here!” (warten)',
          accepted: ['Warte hier!', 'Wart hier!'],
          hint: 'du wartest → Warte!',
          explanation: 'Verbs ending in -t or -d keep an e: Warte! In speech: Wart mal!',
        },
        {
          kind: 'speak',
          prompt: 'Give a stranger directions to the station.',
          lines: [
            'Gehen Sie hier geradeaus.',
            'Nehmen Sie an der Ampel die erste Straße links.',
            'Der Bahnhof ist dann rechts.',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u11-real',
      session: 'Real talk',
      title: '“Ich bin auch nicht von hier.” Asking the way',
      outcome:
        'Ask strangers the way, cope with fast answers, and know the unwritten rules of the street.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'Lost in Leipzig',
          intro: 'Alex is looking for the Thomaskirche. He asks two people.',
          lines: [
            {
              speaker: 'Alex',
              text: 'Entschuldigung, wo ist die Thomaskirche?',
              meaning: 'Excuse me, where is the Thomaskirche?',
            },
            {
              speaker: 'Passantin',
              text: 'Tut mir leid, ich bin auch nicht von hier.',
              real: 'Sorry, bin auch nicht von hier.',
              meaning: 'Sorry, I’m not from here either.',
            },
            { speaker: 'Alex', text: 'Okay, danke trotzdem!', meaning: 'OK, thanks anyway!' },
            {
              speaker: 'Alex',
              text: 'Entschuldigung, ist die Thomaskirche hier in der Nähe?',
              meaning: 'Excuse me, is the Thomaskirche near here?',
            },
            {
              speaker: 'Passant',
              text: 'Ja, ganz nah. Da vorne links, dann sehen Sie sie schon.',
              real: 'Ja, gleich da vorne links, dann sehen Sie die schon.',
              meaning: 'Yes, very close. Up there on the left, then you’ll see it.',
            },
            {
              speaker: 'Alex',
              text: 'Super, vielen Dank!',
              meaning: 'Great, thank you very much!',
            },
            {
              speaker: 'Passant',
              text: 'Gern. Und Vorsicht, das ist ein Radweg!',
              meaning: 'You’re welcome. And careful, that’s a cycle path!',
            },
          ],
          note: 'Ich bin auch nicht von hier is one of the most common answers in any German city. Red or marked lanes on the pavement are cycle paths: walking on them annoys cyclists, who will ring their bell.',
        },
        {
          kind: 'teach',
          title: 'Asking strangers',
          items: [
            { target: 'Ist das hier in der Nähe?', meaning: 'Is that near here?' },
            { target: 'Ich bin auch nicht von hier.', meaning: 'I’m not from here either.' },
            { target: 'Danke trotzdem!', meaning: 'Thanks anyway!' },
            { target: 'da vorne', meaning: 'up there, just ahead' },
            { target: 'ganz nah', meaning: 'very close' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'You ask the way and hear: “Ich bin auch nicht von hier.” What now?',
          options: [
            'Say “Danke trotzdem!” and ask someone else',
            'Ask the same question more slowly',
            'Say “Gute Besserung!”',
          ],
          answer: 0,
          explanation: 'They can’t help: thank them anyway and try the next person.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. How far is it?',
          audio: 'Das ist ganz nah, vielleicht zwei Minuten zu Fuß.',
          options: [
            'About two minutes on foot',
            'About twenty minutes on foot',
            'Two stops by bus',
          ],
          answer: 0,
          explanation: 'ganz nah, zwei Minuten zu Fuß: very close.',
        },
        {
          kind: 'scene',
          title: 'The red man',
          intro: 'Karim and Alex are at a pedestrian crossing. There are no cars.',
          lines: [
            {
              speaker: 'Alex',
              text: 'Komm, da ist kein Auto!',
              meaning: 'Come on, there’s no car!',
            },
            {
              speaker: 'Karim',
              text: 'Warte, die Ampel ist rot!',
              meaning: 'Wait, the light is red!',
            },
            {
              speaker: 'Alex',
              text: 'Aber die Straße ist leer.',
              meaning: 'But the street is empty.',
            },
            {
              speaker: 'Karim',
              text: 'Egal. Da drüben steht ein Kind. Bei Rot bleibt man stehen.',
              real: 'Egal. Da drüben steht ’n Kind. Bei Rot bleibt man stehen.',
              meaning: 'Doesn’t matter. There’s a child over there. On red, you wait.',
            },
            {
              speaker: 'Alex',
              text: 'Okay, okay. Ganz schön deutsch!',
              meaning: 'OK, OK. That’s pretty German!',
            },
          ],
          note: 'Many Germans wait at a red light even when the road is empty, especially when children can see them. Crossing on red can also mean a fine.',
        },
        {
          kind: 'teach',
          title: 'Words from the street',
          items: [
            { target: 'rot / grün', meaning: 'red / green' },
            { target: 'die Haltestelle', meaning: 'stop (bus, tram)' },
            { target: 'der Radweg', meaning: 'cycle path' },
            { target: 'Vorsicht!', meaning: 'Careful!' },
            { target: 'Egal.', meaning: 'Doesn’t matter.' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match what you hear.',
          pairs: [
            ['Vorsicht!', 'Careful!'],
            ['da vorne', 'up ahead'],
            ['Danke trotzdem!', 'Thanks anyway!'],
            ['der Radweg', 'cycle path'],
            ['Egal.', 'Doesn’t matter.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Why does Karim wait at the empty crossing?',
          options: ['The light is red, and a child is watching', 'He is lost', 'The bus is coming'],
          answer: 0,
          explanation: 'Bei Rot bleibt man stehen: on red, you wait.',
        },
        {
          kind: 'build',
          prompt: 'Ask: “Is the station near here?”',
          answer: ['Ist', 'der', 'Bahnhof', 'hier', 'in', 'der', 'Nähe?'],
          extra: ['zum'],
          explanation: 'Ist … hier in der Nähe? Is … near here?',
        },
        {
          kind: 'type',
          prompt:
            'Someone asks you the way, but you are new too. Write: “Sorry, I’m not from here either.”',
          accepted: [
            'Tut mir leid, ich bin auch nicht von hier.',
            'Sorry, ich bin auch nicht von hier.',
          ],
          hint: 'ich bin + auch nicht + von hier.',
          explanation: 'auch nicht: not … either.',
        },
        {
          kind: 'speak',
          prompt: 'Ask a stranger the way, then thank them.',
          lines: [
            'Entschuldigung, ist die Post hier in der Nähe?',
            'Super, vielen Dank!',
            'Danke trotzdem!',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u11-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: web pages and directions',
      outcome:
        'Find the right web page in Lesen Teil 2, follow directions you hear, and ask the way in Sprechen Teil 3.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'Lesen Teil 2: web pages',
          body: 'You read two short web pages and decide which one helps: opening hours, the address and how to get there.',
        },
        {
          kind: 'teach',
          title: 'Words on town web pages',
          items: [
            { target: 'die Bibliothek', meaning: 'library' },
            { target: 'die Adresse', meaning: 'address' },
            { target: 'die Linie', meaning: 'line (bus, tram)' },
            {
              target: 'aussteigen',
              meaning: 'to get off',
              note: 'Separable: Wir steigen am Marktplatz aus.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Sie möchten am Samstag Bücher ausleihen. Wohin gehen Sie?',
          context: libraryPages,
          options: ['a) Stadtbibliothek', 'b) Musikbibliothek'],
          answer: 0,
          explanation: 'a is open on Saturday: Sa 10–14 Uhr.',
        },
        {
          kind: 'choose',
          prompt: 'Mit welcher Linie fahren Sie zur Musikbibliothek?',
          context: libraryPages,
          options: ['Bus 89', 'Straßenbahn 9', 'Bus 9'],
          answer: 0,
          explanation: 'b) Musikbibliothek: Bus 89, Haltestelle Parkstraße.',
        },
        {
          kind: 'rule',
          title: 'Hören: directions',
          body: 'When someone explains the way, follow each step in order: geradeaus, links, rechts, and the landmarks in between.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Where is the post office?',
          audio: postDirections,
          options: [
            'Left, once you reach the church',
            'Right, before the church',
            'Opposite the station',
          ],
          answer: 0,
          explanation: 'bis zur Kirche, dann links.',
        },
        {
          kind: 'choose',
          prompt: 'Listen again. What is next to the post office?',
          audio: postDirections,
          options: ['A café', 'A bank', 'A pharmacy'],
          answer: 0,
          explanation: '“neben dem Café”: next to the café.',
        },
        {
          kind: 'rule',
          title: 'Sprechen Teil 3: asking for help',
          body: 'You met Sprechen Teil 3 in Unit 5. With places, ask politely with Wo ist …? or Können Sie mir bitte …?, and add Entschuldigung.',
        },
        {
          kind: 'choose',
          prompt: 'Your card shows a map. Which request fits?',
          options: [
            'Können Sie mir bitte den Weg zum Bahnhof zeigen?',
            'Bahnhof zeigen, Sie?',
            'Wo Bahnhof?',
          ],
          answer: 0,
          explanation: 'A full, polite request: Können Sie mir bitte …?',
        },
        {
          kind: 'type',
          prompt: 'Your card shows a bus. Ask a stranger where the stop is.',
          accepted: [
            'Entschuldigung, wo ist die Haltestelle?',
            'Wo ist die Haltestelle, bitte?',
            'Wo ist bitte die Haltestelle?',
          ],
          hint: 'Entschuldigung, wo ist + die Haltestelle?',
          explanation: 'Entschuldigung or bitte makes it polite.',
        },
        {
          kind: 'match',
          prompt: 'Unit 11 review: match the pairs.',
          pairs: [
            ['zur Post', 'to the post office'],
            ['geradeaus', 'straight on'],
            ['die Haltestelle', 'stop'],
            ['Nimm!', 'Take!'],
            ['aussteigen', 'to get off'],
          ],
        },
        {
          kind: 'speak',
          prompt: 'Explain the way to your home from the nearest stop.',
          lines: [
            'Nimm die Straßenbahn bis zum Marktplatz.',
            'Dann geh geradeaus bis zur Ampel.',
            'Meine Wohnung ist gleich da vorne links.',
          ],
        },
      ],
    },
  ],
);

const dresdenConnections =
  'a) Leipzig Hbf ab 8:12, Dresden Hbf an 9:47. Regionalexpress: Deutschlandticket gilt.\nb) Leipzig Hbf ab 8:35, Dresden Hbf an 9:40. ICE: 29,90 €, Deutschlandticket gilt nicht.';

const unit12 = defineUnit(
  'DE',
  'A1',
  {
    id: 'de-a1-u12',
    number: 12,
    icon: 'train',
    title: 'Bahn fahren',
    canDo:
      'Buy a ticket, understand platforms, times and delays, and ask what you can and can’t do.',
  },
  [
    {
      id: 'de-a1-u12-tickets',
      session: 'Words',
      title: 'Trains, trams and tickets',
      outcome: 'Name ways to travel and buy a ticket.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'A day in Dresden',
          intro: 'Jonas and Alex plan a day trip to Dresden by train.',
          lines: [
            {
              speaker: 'Jonas',
              text: 'Wollen wir am Samstag nach Dresden fahren?',
              meaning: 'Shall we go to Dresden on Saturday?',
            },
            {
              speaker: 'Alex',
              text: 'Gern! Wie lange braucht der Zug?',
              meaning: 'Sure! How long does the train take?',
            },
            {
              speaker: 'Jonas',
              text: 'Etwa anderthalb Stunden, mit dem Regionalexpress.',
              meaning: 'About an hour and a half, with the regional express.',
            },
            {
              speaker: 'Alex',
              text: 'Und was kostet eine Fahrkarte?',
              meaning: 'And how much is a ticket?',
            },
            {
              speaker: 'Jonas',
              text: 'Mit dem Deutschlandticket nichts extra. Hast du eins?',
              real: 'Mit’m Deutschlandticket nix extra. Haste eins?',
              meaning: 'With the Deutschlandticket, nothing extra. Do you have one?',
            },
            {
              speaker: 'Alex',
              text: 'Nein. Dann kaufe ich eine Fahrkarte am Automaten.',
              meaning: 'No. Then I’ll buy a ticket at the machine.',
            },
          ],
          note: 'The Deutschlandticket is a monthly subscription for local and regional trains, buses and trams all over Germany. It does not cover fast long-distance trains like the ICE.',
        },
        {
          kind: 'teach',
          title: 'Getting around',
          items: [
            { target: 'der Zug', meaning: 'train' },
            {
              target: 'die Straßenbahn',
              meaning: 'tram',
              note: 'In Leipzig and many other cities, the tram is the main way to get around.',
            },
            { target: 'die S-Bahn / die U-Bahn', meaning: 'suburban train / underground' },
            { target: 'die Fahrkarte', meaning: 'ticket', note: 'Also: das Ticket.' },
            { target: 'der Automat', meaning: 'ticket machine' },
            { target: 'mit dem Zug', meaning: 'by train' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Jonas says: “Etwa anderthalb Stunden.” What does etwa mean?',
          options: ['about, roughly', 'exactly', 'at least'],
          answer: 0,
          explanation: 'etwa: about. ungefähr means the same.',
        },
        {
          kind: 'teach',
          title: 'Buying a ticket',
          items: [
            {
              target: 'Einmal nach Dresden, bitte.',
              meaning: 'One ticket to Dresden, please.',
              note: 'The short way at the counter. Two tickets: Zweimal.',
            },
            { target: 'einfach', meaning: 'one way' },
            { target: 'hin und zurück', meaning: 'return, there and back' },
            { target: 'Wie lange dauert die Fahrt?', meaning: 'How long is the journey?' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the travel words.',
          pairs: [
            ['der Zug', 'train'],
            ['die Straßenbahn', 'tram'],
            ['die Fahrkarte', 'ticket'],
            ['hin und zurück', 'return'],
            ['einfach', 'one way'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What ticket does he buy?',
          audio: 'Einmal nach Leipzig und zurück, bitte.',
          options: [
            'A return ticket to Leipzig',
            'A one-way ticket to Leipzig',
            'Two tickets to Leipzig',
          ],
          answer: 0,
          explanation: 'und zurück: and back, a return ticket.',
        },
        {
          kind: 'choose',
          prompt: 'You want to go to Berlin and come back the same day. What do you ask for?',
          options: [
            'Hin und zurück nach Berlin, bitte.',
            'Einfach nach Berlin, bitte.',
            'Zweimal Berlin, bitte.',
          ],
          answer: 0,
          explanation: 'hin und zurück: there and back.',
        },
        {
          kind: 'build',
          prompt: 'Ask: “How long does it take by train?”',
          answer: ['Wie', 'lange', 'dauert', 'das', 'mit', 'dem', 'Zug?'],
          extra: ['der'],
          explanation: 'dauern: to take (time). mit dem Zug: by train.',
        },
        {
          kind: 'type',
          prompt: 'At the counter, say: “One ticket to Berlin, please.”',
          accepted: ['Einmal nach Berlin, bitte.'],
          hint: 'Einmal + nach Berlin + bitte.',
          explanation: 'Einmal: one (ticket). Zweimal for two.',
        },
        {
          kind: 'speak',
          prompt: 'Buy a ticket at the counter.',
          lines: ['Einmal nach Dresden, bitte.', 'Hin und zurück.', 'Wie lange dauert die Fahrt?'],
          tip: 'In Zug, the z sounds like ts: tsook.',
        },
      ],
    },
    {
      id: 'de-a1-u12-koennen',
      session: 'Grammar',
      title: 'Kann ich hier sitzen? können and the verb at the end',
      outcome: 'Say what you can and can’t do, and ask if something is possible.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'können: can, be able to',
          body: 'können changes its vowel in the singular, and ich and er, sie, es have no ending. The second verb goes to the very end, in its basic form.',
          table: [
            ['ich kann', 'Ich kann heute nicht kommen.'],
            ['du kannst', 'Kannst du mich abholen?'],
            ['er, sie, es kann', 'Sie kann gut Deutsch.'],
            ['wir können', 'Wir können den Bus nehmen.'],
            ['ihr könnt', 'Könnt ihr warten?'],
            ['sie, Sie können', 'Können Sie das wiederholen?'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete: ___ du mich vom Bahnhof abholen?',
          options: ['Kannst', 'Kann', 'Könnt'],
          answer: 0,
          explanation: 'du kannst, with -st.',
        },
        {
          kind: 'choose',
          prompt: 'Complete: Karim ___ heute nicht kommen.',
          options: ['kann', 'kannt', 'können'],
          answer: 0,
          explanation: 'er, sie, es kann: no ending, like ich kann.',
        },
        {
          kind: 'rule',
          title: 'The verb at the end',
          body: 'With können, the main verb moves to the end: Ich kann den Zug nehmen. In a question too: Kann ich hier eine Fahrkarte kaufen?',
        },
        {
          kind: 'build',
          prompt: 'Say: “We can take the tram.”',
          answer: ['Wir', 'können', 'die', 'Straßenbahn', 'nehmen.'],
          extra: ['nimmt'],
          explanation: 'können second, nehmen at the end.',
        },
        {
          kind: 'teach',
          title: 'What is possible?',
          items: [
            { target: 'Kann ich hier sitzen?', meaning: 'Can I sit here?' },
            {
              target: 'Ist hier noch frei?',
              meaning: 'Is this seat free?',
              note: 'The usual question on a train or in a café.',
            },
            {
              target: 'abholen',
              meaning: 'to pick someone up',
              note: 'Separable: Ich hole dich ab.',
            },
            { target: 'Das geht nicht.', meaning: 'That’s not possible.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Which question is correct?',
          options: ['Kann ich hier sitzen?', 'Kann ich sitzen hier?', 'Ich kann hier sitzen?'],
          answer: 0,
          explanation: 'Kann first in a yes/no question, sitzen at the end.',
        },
        {
          kind: 'match',
          prompt: 'Match the forms of können.',
          pairs: [
            ['ich', 'kann'],
            ['du', 'kannst'],
            ['wir', 'können'],
            ['ihr', 'könnt'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What can’t she do?',
          audio: 'Ich kann dich leider nicht abholen, ich arbeite bis sechs.',
          options: ['Pick him up', 'Work today', 'Call him'],
          answer: 0,
          explanation: 'nicht abholen: she can’t pick him up. She works until six.',
        },
        {
          kind: 'rule',
          title: 'Two kinds of questions',
          body: 'As in Unit 1: a W-question starts with the question word, then the verb: Wann fährt der Zug? A yes/no question starts with the verb: Fährt der Zug pünktlich? With können: Wann kannst du kommen? Kannst du kommen?',
        },
        {
          kind: 'type',
          prompt: 'Ask a friend: “When can you come?”',
          accepted: ['Wann kannst du kommen?'],
          hint: 'Wann + kannst + du + kommen?',
          explanation: 'The question word, then kannst, then du, and kommen at the end.',
        },
        {
          kind: 'speak',
          prompt: 'Say what you can and can’t do today.',
          lines: [
            'Ich kann heute nicht kommen.',
            'Kannst du mich vom Bahnhof abholen?',
            'Wir können die Straßenbahn nehmen.',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u12-real',
      session: 'Real talk',
      title: '“Die Bahn hat mal wieder Verspätung”',
      outcome:
        'Understand platform changes and delays, get through a ticket check, and complain about the train like a local.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'On the platform',
          intro: 'Alex and Jonas are waiting at Leipzig Hauptbahnhof. There is an announcement.',
          lines: [
            {
              speaker: 'Ansage',
              text: 'Information zum Regionalexpress nach Dresden, Abfahrt neun Uhr zwölf: heute von Gleis fünf.',
              meaning:
                'Information about the regional express to Dresden, departure 9:12: today from platform 5.',
            },
            {
              speaker: 'Alex',
              text: 'Gleis fünf? Ich dachte, Gleis zwei!',
              meaning: 'Platform five? I thought platform two!',
            },
            {
              speaker: 'Jonas',
              text: 'Ja, Gleiswechsel. Schnell, komm!',
              meaning: 'Yes, platform change. Quick, come on!',
            },
            {
              speaker: 'Ansage',
              text: 'Der Zug hat heute etwa fünfzehn Minuten Verspätung.',
              meaning: 'The train is about fifteen minutes late today.',
            },
            {
              speaker: 'Jonas',
              text: 'Typisch. Die Bahn hat mal wieder Verspätung.',
              real: 'Typisch. Die Bahn mal wieder.',
              meaning: 'Typical. The train is late again.',
              realMeaning: 'Typical. Deutsche Bahn again.',
            },
            {
              speaker: 'Alex',
              text: 'Na ja, dann haben wir noch Zeit für einen Kaffee.',
              meaning: 'Oh well, then we still have time for a coffee.',
            },
          ],
          note: 'Delays are so common that complaining about Die Bahn is a national small-talk topic. Always check the display: platform changes (Gleiswechsel) happen often.',
        },
        {
          kind: 'teach',
          title: 'At the station',
          items: [
            { target: 'das Gleis', meaning: 'platform, track' },
            { target: 'die Abfahrt / die Ankunft', meaning: 'departure / arrival' },
            { target: 'die Verspätung', meaning: 'delay' },
            {
              target: 'umsteigen',
              meaning: 'to change (trains)',
              note: 'Separable: In Halle steigen wir um.',
            },
            { target: 'Typisch!', meaning: 'Typical!' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'The announcement says “heute von Gleis fünf”. What do you do?',
          options: ['Go to platform 5', 'Wait at platform 2', 'Wait five minutes'],
          answer: 0,
          explanation: 'heute von Gleis fünf: today it leaves from platform 5.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. How late is the train?',
          audio: 'Der Zug nach Berlin hat circa zwanzig Minuten Verspätung.',
          options: ['About 20 minutes', 'About 10 minutes', 'About 2 minutes'],
          answer: 0,
          explanation: 'circa zwanzig Minuten: about twenty minutes.',
        },
        {
          kind: 'scene',
          title: 'Tickets, please',
          intro: 'On the train, an inspector checks tickets.',
          lines: [
            {
              speaker: 'Kontrolleurin',
              text: 'Guten Tag, die Fahrkarten, bitte!',
              real: 'Tach, die Fahrkarten bitte!',
              meaning: 'Hello, tickets, please!',
              realMeaning: 'Hi, tickets please!',
            },
            {
              speaker: 'Alex',
              text: 'Hier, bitte. Hält der Zug auch in Riesa?',
              meaning: 'Here you are. Does the train stop in Riesa too?',
            },
            {
              speaker: 'Kontrolleurin',
              text: 'Ja, in zwanzig Minuten. Danke, gute Fahrt!',
              meaning: 'Yes, in twenty minutes. Thanks, have a good trip!',
            },
            { speaker: 'Alex', text: 'Danke, Ihnen auch!', meaning: 'Thanks, you too!' },
          ],
          note: 'German stations have no ticket barriers: you need a valid ticket before you get on. Riding without one (schwarzfahren) costs a fine of 60 euros.',
        },
        {
          kind: 'teach',
          title: 'On the train',
          items: [
            { target: 'Die Fahrkarten, bitte!', meaning: 'Tickets, please!' },
            { target: 'Gute Fahrt!', meaning: 'Have a good trip!' },
            {
              target: 'Danke, Ihnen auch!',
              meaning: 'Thanks, you too!',
              note: 'To a friend: Danke, dir auch!',
            },
            { target: 'Hält der Zug in Riesa?', meaning: 'Does the train stop in Riesa?' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match what you hear.',
          pairs: [
            ['das Gleis', 'platform'],
            ['die Verspätung', 'delay'],
            ['umsteigen', 'to change trains'],
            ['Gute Fahrt!', 'Have a good trip!'],
            ['Typisch!', 'Typical!'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'The inspector says “Gute Fahrt!”. What do you answer?',
          options: ['Danke, Ihnen auch!', 'Gute Besserung!', 'Bis später!'],
          answer: 0,
          explanation: 'Ihnen auch: you too, to someone you call Sie.',
        },
        {
          kind: 'build',
          prompt: 'Ask: “Do I have to change trains?”',
          answer: ['Muss', 'ich', 'umsteigen?'],
          extra: ['um'],
          explanation: 'With muss, umsteigen goes to the end in one piece.',
        },
        {
          kind: 'type',
          prompt: 'Complain like a local: “The train is late again.”',
          accepted: ['Die Bahn hat mal wieder Verspätung.', 'Der Zug hat mal wieder Verspätung.'],
          hint: 'hat + mal wieder + Verspätung.',
          explanation: 'mal wieder: once again. Usually said with a sigh.',
        },
        {
          kind: 'speak',
          prompt: 'At the station: ask, check and react.',
          lines: [
            'Von welchem Gleis fährt der Zug nach Dresden?',
            'Hat der Zug Verspätung?',
            'Typisch! Dann trinken wir noch einen Kaffee.',
          ],
        },
      ],
    },
    {
      id: 'de-a1-u12-exam',
      session: 'Exam task',
      title: 'Goethe A1 practice: announcements, connections and requests',
      outcome:
        'Catch platforms and times in Hören Teil 2, choose a connection in Lesen Teil 2, and make requests in Sprechen Teil 3.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'Hören Teil 2: at the station',
          body: 'Announcements are short and fast: a train, a platform, a time, sometimes a delay. You hear each one once. Read the sentence first, then listen for that one detail.',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Der Zug nach Hamburg fährt heute von Gleis drei.',
          audio: 'Achtung an Gleis drei: Der Intercity nach Hamburg fährt heute von Gleis acht.',
          options: ['Richtig', 'Falsch'],
          answer: 1,
          explanation: 'The announcement is at Gleis drei, but the train leaves from Gleis acht.',
        },
        {
          kind: 'choose',
          prompt: 'Richtig oder falsch? Der Bus fährt in fünf Minuten.',
          audio:
            'Liebe Fahrgäste, der Bus der Linie zwölf zum Flughafen fährt in fünf Minuten an der Haltestelle Hauptbahnhof ab.',
          options: ['Richtig', 'Falsch'],
          answer: 0,
          explanation: 'fährt in fünf Minuten ab: leaves in five minutes.',
        },
        {
          kind: 'rule',
          title: 'Lesen Teil 2: connections',
          body: 'You compare two connections or offers: departure (ab), arrival (an), the kind of train and the price.',
        },
        {
          kind: 'choose',
          prompt:
            'Sie haben ein Deutschlandticket und möchten nichts extra bezahlen. Welche Verbindung nehmen Sie?',
          context: dresdenConnections,
          options: ['a) 8:12, Regionalverkehr', 'b) 8:35, ICE'],
          answer: 0,
          explanation: 'The Deutschlandticket is valid on regional trains, not on the ICE.',
        },
        {
          kind: 'choose',
          prompt: 'Sie möchten so schnell wie möglich in Dresden sein. Welche Verbindung passt?',
          context: dresdenConnections,
          options: ['a) 8:12, Regionalverkehr', 'b) 8:35, ICE'],
          answer: 1,
          explanation: 'b takes about an hour; a takes over an hour and a half.',
        },
        {
          kind: 'teach',
          title: 'Words in timetables',
          items: [
            { target: 'ab / an', meaning: 'departs / arrives' },
            { target: 'die Verbindung', meaning: 'connection' },
            { target: 'gilt', meaning: 'is valid', note: 'Das Ticket gilt nicht im ICE.' },
            { target: 'der Fahrgast, die Fahrgäste', meaning: 'passenger, passengers' },
          ],
        },
        {
          kind: 'rule',
          title: 'Sprechen Teil 3: requests with können',
          body: 'Picture cards often show a ticket, a bag or a seat. Make a polite request with Können Sie …? or Kann ich …?, and answer one too.',
        },
        {
          kind: 'choose',
          prompt: 'Your card shows a ticket machine. Which request fits?',
          options: [
            'Können Sie mir bitte am Automaten helfen?',
            'Automat, helfen Sie?',
            'Sie können Automat?',
          ],
          answer: 0,
          explanation: 'Können Sie mir bitte …? is the safest polite request.',
        },
        {
          kind: 'type',
          prompt: 'Your card shows a window seat. Ask if you can sit by the window.',
          accepted: ['Kann ich am Fenster sitzen?', 'Kann ich bitte am Fenster sitzen?'],
          hint: 'Kann ich + am Fenster + sitzen?',
          explanation: 'Kann first, sitzen at the end.',
        },
        {
          kind: 'match',
          prompt: 'Unit 12 review: match the pairs.',
          pairs: [
            ['einfach', 'one way'],
            ['hin und zurück', 'return'],
            ['das Gleis', 'platform'],
            ['umsteigen', 'to change trains'],
            ['ich kann', 'I can'],
          ],
        },
        {
          kind: 'speak',
          prompt: 'Answer your exam partner’s requests.',
          lines: [
            'Ja, natürlich. Hier, bitte.',
            'Tut mir leid, das geht nicht.',
            'Ist hier noch frei? Kann ich hier sitzen?',
          ],
        },
      ],
    },
  ],
);

export const germanA1Units = [
  ...unit1,
  ...unit2,
  ...unit3,
  ...unit4,
  ...unit5,
  ...unit6,
  ...unit7,
  ...unit8,
  ...unit9,
  ...unit10,
  ...unit11,
  ...unit12,
];
