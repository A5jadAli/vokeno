import { defineUnit } from './types';

// Spelling, email and the full registration form, once numbers are secure from Unit 3.
export const spanishA1Unit4 = defineUnit(
  'ES',
  'A1',
  {
    id: 'es-a1-u4',
    number: 4,
    icon: 'card-account-details-outline',
    title: 'Spell it and send it',
    canDo: 'Spell a name, give an email address and complete a short registration form.',
  },
  [
    {
      id: 'es-a1-u4-words',
      session: 'Words',
      title: 'Fill in the right field',
      outcome: 'Recognise form labels and spell a short name with the first half of the alphabet.',
      minutes: 6,
      steps: [
        {
          kind: 'choose',
          prompt: 'A form asks for your edad. What do you write?',
          options: ['Your age', 'Your phone number', 'Your city'],
          answer: 0,
          explanation: 'Edad means age. You practised giving ages in Unit 3.',
        },
        {
          kind: 'teach',
          title: 'Labels you will meet on a form',
          items: [
            {
              target: 'el nombre',
              meaning: 'given name / first name',
              note: 'On a form with a separate apellido field, nombre asks for the given name.',
            },
            {
              target: 'el apellido',
              meaning: 'surname / family name',
              note: 'Some people have more than one surname. Keep the details the person gives you.',
            },
            {
              target: 'el correo electrónico',
              meaning: 'email / email address',
              note: 'On a contact form this asks for an email address. Later you will practise arroba and punto.',
            },
          ],
        },
        {
          kind: 'choose',
          context: 'Nombre: Ana\nApellido: Soto',
          prompt: 'Which part is Ana’s surname?',
          options: ['Ana', 'Soto', 'Nombre'],
          answer: 1,
          explanation: 'Apellido labels the surname, Soto. Nombre labels the given name, Ana.',
        },
        {
          kind: 'match',
          prompt: 'Choose the field for each detail.',
          pairs: [
            ['Nombre', 'Your given name'],
            ['Apellido', 'Your surname'],
            ['Número de teléfono', 'Your phone number'],
            ['Correo electrónico', 'Your email address'],
          ],
        },
        {
          kind: 'rule',
          title: 'Spell a name: a to i',
          body: 'Letter names help someone write a name correctly. The Spanish alphabet has 27 letters, including ñ. Work through three small groups, then use just the letters you need for a name.',
          table: [
            ['a', 'a'],
            ['b', 'be / be grande'],
            ['c', 'ce'],
            ['d', 'de'],
            ['e', 'e'],
            ['f', 'efe'],
            ['g', 'ge'],
            ['h', 'hache'],
            ['i', 'i'],
          ],
          examples: ['a, be, ce, de, e, efe, ge, hache, i'],
        },
        {
          kind: 'choose',
          prompt: 'Listen to a letter name. Which letter is it?',
          audio: 'hache',
          options: ['a', 'g', 'h'],
          answer: 2,
          explanation:
            'Hache names h. The letter name is spoken, even though h is silent in a word such as hola.',
        },
        {
          kind: 'rule',
          title: 'Spell a name: j to q',
          body: 'N and ñ are different letters. Keep ñ when writing a surname: it is a different letter from n. On many phone keyboards, holding n offers ñ.',
          table: [
            ['j', 'jota'],
            ['k', 'ka'],
            ['l', 'ele'],
            ['m', 'eme'],
            ['n', 'ene'],
            ['ñ', 'eñe'],
            ['o', 'o'],
            ['p', 'pe'],
            ['q', 'cu'],
          ],
          examples: ['jota, ka, ele, eme, ene, eñe, o, pe, cu'],
        },
        {
          kind: 'type',
          prompt: 'Listen to three letter names and write the name they spell.',
          audio: 'a, ene, a',
          answerKind: 'text',
          accepted: ['Ana'],
          hint: 'Write one letter for each letter name. Ene is n.',
          explanation:
            'A, ene, a spells Ana. The same spelling strategy works for unfamiliar names.',
        },
        {
          kind: 'choose',
          prompt: 'Which letter name is ñ?',
          options: ['ene', 'eñe', 'eme'],
          answer: 1,
          explanation: 'Eñe is ñ. Ene is n and eme is m.',
        },
        {
          kind: 'speak',
          prompt:
            'Spell a short first name such as Ana, letter by letter. Then ask how someone else’s name is written, using a phrase from Unit 1.',
          lines: ['a, ene, a', '¿Cómo se escribe?'],
          tip: 'Say one letter name per letter, with a small pause between them.',
          mission: {
            checks: ['Say one letter name for each letter.', 'Ask how a name is written.'],
            twist: 'Now spell Paco. Remember that c is ce and o is o.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u4-grammar',
      session: 'Grammar',
      title: 'My surname, your email',
      outcome: 'Use mi, tu and su with contact details and spell with the rest of the alphabet.',
      minutes: 7,
      steps: [
        {
          kind: 'choose',
          prompt: 'A form asks for apellido. Which detail belongs there?',
          options: ['Your age', 'Your email address', 'Your surname'],
          answer: 2,
          explanation: 'Apellido asks for a surname. Next you will ask for contact details.',
        },
        {
          kind: 'teach',
          title: 'Ask for a detail',
          items: [
            {
              target: '¿Cuál es su correo electrónico?',
              meaning: 'What is your email address? (usted)',
              note: 'When addressing someone with usted. Su can refer to other people too; context tells you whose.',
            },
            {
              target: 'Mi apellido es García.',
              meaning: 'My surname is García.',
              note: 'Mi means my. Keep the accent in García when copying the name.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'Match the question to the detail',
          body: 'On a form, edad means age. Cuántos asks how many in ¿Cuántos años tienes? Cuál asks which value in ¿Cuál es tu número de teléfono? Cómo asks how, as in ¿Cómo se escribe? Mi means my, tu means your with tú, and su can mean your with usted. It can also mean his, her or their; ask if the owner is unclear.',
          table: [
            ['mi apellido', 'my surname'],
            ['tu apellido', 'your surname: tú'],
            ['su apellido', 'your surname: usted; context may indicate someone else'],
          ],
        },
        {
          kind: 'match',
          prompt: 'Choose a question that asks for the missing information.',
          pairs: [
            ['¿Cuántos años tienes?', 'Edad'],
            ['¿Cuál es tu número de teléfono?', 'Teléfono'],
            ['¿Cuál es su correo electrónico?', 'Correo electrónico'],
            ['¿Cómo se escribe?', 'Spelling'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Which phrase means “your surname” when speaking to a classmate using tú?',
          options: ['mi apellido', 'tu apellido', 'tú apellido'],
          answer: 1,
          explanation:
            'Tu apellido uses the possessive tu without an accent. Tú with an accent is the subject pronoun you.',
        },
        {
          kind: 'rule',
          title: 'Spell a name: r to z',
          body: 'Letter names vary by country. In Mexico you will usually hear be grande for b and ve chica for v, because b and v sound the same. Spain says uve and uve doble. Y is ye or i griega. Ch and ll are pairs of letters, not extra alphabet letters.',
          table: [
            ['r', 'erre'],
            ['s', 'ese'],
            ['t', 'te'],
            ['u', 'u'],
            ['v', 've chica / uve'],
            ['w', 'doble u / uve doble'],
            ['x', 'equis'],
            ['y', 'ye / i griega'],
            ['z', 'zeta'],
          ],
          examples: ['erre, ese, te, u, ve chica, doble u, equis, ye, zeta'],
        },
        {
          kind: 'choose',
          prompt: 'Someone says “doble u” when spelling. Which letter should you write?',
          options: ['w', 'u', 'v'],
          answer: 0,
          explanation: 'Doble u is a common name for w. Uve doble also names w.',
        },
        {
          kind: 'choose',
          prompt: 'Someone spells: be grande, e, te, o. Which name is it?',
          options: ['Beto', 'Veto', 'Peto'],
          answer: 0,
          explanation:
            'Be grande is b, so the name is Beto. Ve chica would have given a v instead.',
        },
        {
          kind: 'type',
          prompt:
            'Listen to the surname being spelled. Write the five-letter surname, including ñ.',
          audio: 'eme, u, eñe, o, zeta',
          answerKind: 'text',
          accepted: ['Muñoz'],
          hint: 'Eme is m; eñe is ñ. Keep all five letters.',
          explanation:
            'The letters spell Muñoz. Munoz changes a letter and is not the same spelling.',
        },
        {
          kind: 'speak',
          prompt:
            'Give an invented surname and spell it. Then ask a receptionist for their email address using usted.',
          lines: ['Mi apellido es Soto.', 'Ese, o, te, o.', '¿Cuál es su correo electrónico?'],
          mission: {
            checks: ['Spell with letter names, not only the name.', 'Use su with usted.'],
            twist:
              'Now spell Muñoz, including eñe. Then ask a classmate for their email address using tú.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u4-talk',
      session: 'Real talk',
      title: 'Spell it and check it back',
      outcome: 'Read an email address aloud, spell a surname and confirm written details.',
      minutes: 7,
      steps: [
        {
          kind: 'teach',
          title: 'Email symbols',
          items: [
            {
              target: 'arroba',
              meaning: '@',
              note: 'Use arroba when reading an email address aloud.',
            },
            {
              target: 'punto',
              meaning: '.',
              note: 'A dot in an email address. The dot is part of the address, not sentence punctuation.',
            },
            {
              target: 'guion',
              meaning: '-',
              note: 'A hyphen. Guion is written without an accent.',
            },
            { target: 'guion bajo', meaning: '_', note: 'An underscore, different from a hyphen.' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match the name of each email symbol.',
          pairs: [
            ['arroba', '@'],
            ['punto', '.'],
            ['guion', '-'],
            ['guion bajo', '_'],
          ],
        },
        {
          kind: 'rule',
          title: 'An email address has no spaces',
          body: 'In ana.soto@example.com, say the name parts, punto for the dot and arroba for @. Example.com is a domain reserved for examples. Copy the address exactly; a missing dot can send it somewhere else.',
          examples: ['ana punto soto, arroba, example punto com'],
        },
        {
          kind: 'type',
          context: 'The ending is @example.com.',
          prompt:
            'Listen and type the full fictional email address. Use symbols, not the words arroba and punto.',
          audio: 'luz, arroba, example punto com',
          answerKind: 'email',
          accepted: ['luz@example.com'],
          hint: 'Join the name before arroba to the supplied ending. Do not add spaces.',
          explanation:
            'Luz, arroba, example punto com gives luz@example.com. Email punctuation must stay in place.',
        },
        {
          kind: 'scene',
          title: 'Spelling at the class desk',
          intro:
            'Ana registers for the exchange. The receptionist asks how to spell her surname and reads it back.',
          lines: [
            {
              speaker: 'Recepcionista',
              text: '¿Cómo se escribe su apellido?',
              meaning: 'How is your surname spelled?',
            },
            { speaker: 'Ana', text: 'Soto. Ese, o, te, o.', meaning: 'Soto. S, o, t, o.' },
            {
              speaker: 'Recepcionista',
              text: 'Soto. ¿Así está bien?',
              meaning: 'Soto. Is it correct like this?',
            },
            { speaker: 'Ana', text: 'Sí, gracias.', meaning: 'Yes, thank you.' },
          ],
          note: 'The receptionist uses usted: su apellido. ¿Así está bien? is the check-back phrase from Unit 3.',
        },
        {
          kind: 'choose',
          prompt: 'The receptionist reads back the wrong surname. What helps you fix it?',
          options: [
            'Say goodbye immediately.',
            'Repeat your age.',
            'Ask to correct it and spell the surname.',
          ],
          answer: 2,
          explanation:
            'Spelling identifies the letters that need changing. Correcting a detail is a useful communication strategy.',
        },
        {
          kind: 'type',
          prompt: 'Listen and type the fictional email address. Use symbols and no spaces.',
          audio: 'ana guion bajo soto, arroba, example punto com',
          answerKind: 'email',
          accepted: ['ana_soto@example.com'],
          hint: 'Guion bajo is _. Arroba is @ and punto is the dot.',
          explanation:
            'The address is ana_soto@example.com. Guion bajo is an underscore, not a hyphen.',
        },
        {
          kind: 'choose',
          context: 'Correo electrónico: diego-ruiz@example.com',
          prompt: 'How do you read the - in this address aloud?',
          options: ['guion', 'guion bajo', 'punto'],
          answer: 0,
          explanation: 'The - is guion. Guion bajo is _ and punto is the dot.',
        },
        {
          kind: 'speak',
          prompt:
            'Spell the fictional surname Soto, read the address ana.soto@example.com aloud, then ask if the written details are correct.',
          lines: ['Ese, o, te, o.', 'ana punto soto, arroba, example punto com', '¿Así está bien?'],
          tip: 'Read letter names and symbols clearly, with pauses. Spell any part the listener misses.',
          mission: {
            checks: [
              'Spell the letters rather than only repeating the name.',
              'Say arroba and punto in the right places.',
              'Ask for confirmation.',
            ],
            twist:
              'Now spell Muñoz, including eñe, and read the address vera.munoz@example.com aloud.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u4-task',
      session: 'Exam task',
      title: 'Register for the language exchange',
      outcome:
        'Complete personal fields accurately and use a spoken correction before confirming the details.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'A small registration task',
          body: 'Use a fictional person’s details to complete a short form. Nombre, apellido, edad, teléfono and correo electrónico are the fields you have practised. This is an A1 form exercise, not the full DELE writing task. No real contact details are needed.',
        },
        {
          kind: 'choose',
          context: 'Me llamo Vera Muñoz. Soy de Chile. Vivo en Puebla. Tengo veintiséis años.',
          prompt: 'Which pair gives Vera’s surname and age?',
          options: ['Vera, 26', 'Muñoz, 26', 'Muñoz, 16'],
          answer: 1,
          explanation: 'Muñoz is the surname. Veintiséis is 26, not 16.',
        },
        {
          kind: 'choose',
          context: 'Correo electrónico: vera.munoz@example.com',
          prompt: 'Which copy keeps the exact address?',
          options: ['vera.munoz@example.com', 'veramunoz@example.com', 'vera.munoz.example.com'],
          answer: 0,
          explanation:
            'The first copy keeps both the dot in the name and @. Surnames can contain ñ even when a chosen email address uses n; copy each supplied detail as written.',
        },
        {
          kind: 'form',
          prompt: 'Complete Vera’s registration. Listen for her corrected phone number.',
          context:
            'Me llamo Vera Muñoz. Tengo veintiséis años.\nCorreo electrónico: vera.munoz@example.com\nOld phone number: 55 0100 0024\nVera gives the new number in the audio. Use the new number in Teléfono.',
          audio: 'Mi número es cinco cinco, cero uno, cero cero, cero cero, cuatro ocho.',
          fields: [
            {
              label: 'Nombre',
              kind: 'text',
              accepted: ['Vera'],
              hint: 'Use the given name, without the surname.',
            },
            {
              label: 'Apellido',
              kind: 'text',
              accepted: ['Muñoz'],
              hint: 'Use the surname and keep ñ.',
            },
            {
              label: 'Edad (en cifras)',
              kind: 'digits',
              accepted: ['26'],
              hint: 'Veintiséis is the age. Enter it with digits.',
            },
            {
              label: 'Teléfono',
              kind: 'digits',
              accepted: ['5501000048'],
              hint: 'Use the ten digits in the new audio. The old number on the card has a different ending.',
            },
            {
              label: 'Correo electrónico',
              kind: 'email',
              accepted: ['vera.munoz@example.com'],
              hint: 'Copy the full address, including the dot and @. It uses n in munoz.',
            },
          ],
          explanation:
            'The updated number is 55 0100 0048. You kept the five fields separate and used the correction instead of copying the old phone number.',
        },
        {
          kind: 'type',
          prompt: 'Listen to a surname being spelled. Write it.',
          audio: 'te, o, erre, erre, e, ese',
          answerKind: 'text',
          accepted: ['Torres'],
          hint: 'Erre is r. This surname has two of them together.',
          explanation: 'The letters spell Torres, with rr in the middle.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What should you do next?',
          audio: '¿Cómo se escribe?',
          options: ['Give a price.', 'Spell the detail you just gave.', 'Say where you live.'],
          answer: 1,
          explanation:
            '¿Cómo se escribe? requests spelling. You used it in Unit 1; now you can respond with letter names.',
        },
        {
          kind: 'speak',
          prompt:
            'Register an invented person. Give a name, spell a surname and read an email address. Imagine one letter is copied wrongly: correct it and check the result.',
          lines: [
            'Me llamo Ana.',
            'Mi apellido es Soto.',
            'Ese, o, te, o.',
            'ana punto soto, arroba, example punto com',
            '¿Así está bien?',
          ],
          mission: {
            checks: [
              'Give each requested detail.',
              'Use letter names and keep ñ if your surname has it.',
              'Correct the wrong letter and ask for confirmation.',
            ],
            twist:
              'The receptionist asks for your phone number too. Add a fictional number, read in pairs.',
          },
        },
      ],
    },
  ],
);
