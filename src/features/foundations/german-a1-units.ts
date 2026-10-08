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

export const germanA1Units = [...unit1, ...unit2, ...unit3, ...unit4, ...unit5, ...unit6];
