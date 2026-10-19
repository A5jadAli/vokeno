import { defineUnit } from './types';

export const spanishA1Unit3 = defineUnit(
  'ES',
  'A1',
  {
    id: 'es-a1-u3',
    number: 3,
    icon: 'card-account-details-outline',
    title: 'Get the details right',
    canDo: 'Give an age, spell a name and check contact details, including a corrected number.',
  },
  [
    {
      id: 'es-a1-u3-words',
      session: 'Words',
      title: 'Make sure they have your number',
      outcome: 'Read and say numbers from zero to twenty and recognise contact labels.',
      minutes: 9,
      steps: [
        {
          kind: 'rule',
          title: 'A number you can check',
          body: 'Numbers help you keep in touch. Start with single digits, then small groups. Use fictional numbers throughout this unit. You can stop after any step and return to your saved place.',
        },
        {
          kind: 'teach',
          title: 'The first five digits',
          items: [
            { target: 'cero', meaning: '0', note: 'Say cero for the digit 0, not the letter o.' },
            { target: 'uno', meaning: '1', note: 'Use uno when reading a digit on its own.' },
            { target: 'dos', meaning: '2' },
            { target: 'tres', meaning: '3' },
            { target: 'cuatro', meaning: '4' },
          ],
        },
        {
          kind: 'match',
          prompt: 'Connect a spoken-number word to its digit.',
          pairs: [
            ['cero', '0'],
            ['dos', '2'],
            ['cuatro', '4'],
            ['uno', '1'],
          ],
        },
        {
          kind: 'teach',
          title: 'The other five digits',
          items: [
            { target: 'cinco', meaning: '5' },
            { target: 'seis', meaning: '6' },
            { target: 'siete', meaning: '7' },
            { target: 'ocho', meaning: '8' },
            { target: 'nueve', meaning: '9' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which digit did you hear?',
          audio: 'ocho',
          options: ['6', '8', '9'],
          answer: 1,
          explanation: 'Ocho is 8. Seis is 6 and nueve is 9.',
        },
        {
          kind: 'type',
          prompt:
            'Listen to a three-digit practice code. Type every digit, including the first zero.',
          audio: 'cero, nueve, seis',
          answerKind: 'digits',
          accepted: ['096'],
          hint: 'There are three digits. Replay slowly and keep the first zero.',
          explanation: 'Cero, nueve, seis gives 096. A code keeps its initial zero.',
        },
        {
          kind: 'rule',
          title: 'From ten to fifteen',
          body: 'These numbers have their own forms. Listen in order, then try the next question without reading this list.',
          table: [
            ['10', 'diez'],
            ['11', 'once'],
            ['12', 'doce'],
            ['13', 'trece'],
            ['14', 'catorce'],
            ['15', 'quince'],
          ],
          examples: ['diez, once, doce, trece, catorce, quince'],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which number is it?',
          audio: 'quince',
          options: ['13', '14', '15'],
          answer: 2,
          explanation: 'Quince is 15. Catorce is 14; trece is 13.',
        },
        {
          kind: 'rule',
          title: 'From sixteen to twenty',
          body: 'Sixteen to nineteen are written as one word. Dieciséis needs an accent. Twenty is veinte, the start of the next group you will use for ages.',
          table: [
            ['16', 'dieciséis'],
            ['17', 'diecisiete'],
            ['18', 'dieciocho'],
            ['19', 'diecinueve'],
            ['20', 'veinte'],
          ],
          examples: ['dieciséis, diecisiete, dieciocho, diecinueve, veinte'],
        },
        {
          kind: 'type',
          prompt: 'Write 16 as one Spanish word.',
          answerKind: 'text',
          accepted: ['dieciséis'],
          hint: 'Start with dieci and end with séis. It is one word.',
          explanation: 'Dieciséis has an accent on é. The accent marks the stressed syllable.',
        },
        {
          kind: 'choose',
          prompt: 'Listen to the two numbers. Which pair did you hear, in order?',
          audio: 'dieciocho, trece',
          options: ['18, 13', '13, 18', '8, 3'],
          answer: 0,
          explanation: 'Dieciocho is 18; trece is 13. The order matters when taking down details.',
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
              target: 'el número de teléfono',
              meaning: 'telephone number',
              note: 'Teléfono has an accent. You may also see teléfono móvil or celular for a mobile phone.',
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
          kind: 'rule',
          title: 'Group the digits, keep their order',
          body: 'You can read a phone number digit by digit. Pauses make it easier to follow. People also use pairs and other groups, so ask for repetition when needed. The grouping on paper does not change the digits.',
          examples: ['cinco cinco, cero uno, cero cero, cero cero, dos cuatro'],
        },
        {
          kind: 'type',
          prompt: 'Listen to a fictional phone number. Type all ten digits. Spaces are allowed.',
          audio: 'cinco cinco, cero uno, cero cero, cero cero, tres ocho',
          answerKind: 'digits',
          accepted: ['5501000038'],
          hint: 'There are ten digits, read in five groups of two. Replay one group at a time.',
          explanation: 'The number is 55 0100 0038. The final pair is tres ocho, or 38.',
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
          kind: 'speak',
          prompt:
            'Read this fictional number to a classmate: 55 0100 0024. Pause between groups. Then ask for repetition using a phrase from Unit 1.',
          lines: [
            'cinco cinco, cero uno, cero cero, cero cero, dos cuatro',
            '¿Puede repetir, por favor?',
          ],
          tip: 'Keep each digit clear. Speaking slowly enough to be understood is more useful than rushing.',
          mission: {
            checks: [
              'Include all ten digits in order.',
              'Keep every zero.',
              'Use pauses and a repair request.',
            ],
            twist: 'Change only the last two digits to 38. Say the whole number again.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u3-grammar',
      session: 'Grammar',
      title: 'Your age and your contact details',
      outcome:
        'Use tener for age, build numbers through thirty and choose a question for a personal detail.',
      minutes: 9,
      steps: [
        {
          kind: 'choose',
          prompt: 'A form asks for apellido. Which detail belongs there?',
          options: ['Your age', 'Your email address', 'Your surname'],
          answer: 2,
          explanation: 'Apellido asks for a surname. You will add age and contact questions next.',
        },
        {
          kind: 'teach',
          title: 'Age uses tener',
          items: [
            {
              target: 'Tengo veinte años.',
              meaning: 'I am twenty years old.',
              note: 'Spanish uses tengo, literally I have, for age. Keep ñ in años.',
            },
            {
              target: '¿Cuántos años tienes?',
              meaning: 'How old are you? (tú)',
              note: 'Ask with tienes. In real life, ask about age when it is relevant and welcome.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'Age: tengo, tienes, tiene',
          body: 'For one person: yo tengo, tú tienes, él/ella tiene. Usted also uses tiene. For age, use the number followed by años. You can practise with an invented person instead of sharing your age.',
          table: [
            ['yo', 'tengo'],
            ['tú', 'tienes'],
            ['él / ella / usted', 'tiene'],
          ],
          examples: ['Tiene veinte años.', '¿Cuántos años tiene?'],
        },
        {
          kind: 'choose',
          prompt: 'Say that you are twenty years old.',
          options: ['Tengo veinte años.', 'Soy veinte años.', 'Vivo veinte años.'],
          answer: 0,
          explanation:
            'Tengo veinte años expresses age. Spanish uses tener, not ser, for this meaning.',
        },
        {
          kind: 'rule',
          title: 'Twenty-one to twenty-five',
          body: 'These numbers are written as one word. Keep the accents in veintidós and veintitrés. Read the number first; the next step shows the small change before años.',
          table: [
            ['21', 'veintiuno'],
            ['22', 'veintidós'],
            ['23', 'veintitrés'],
            ['24', 'veinticuatro'],
            ['25', 'veinticinco'],
          ],
          examples: ['veintiuno, veintidós, veintitrés, veinticuatro, veinticinco'],
        },
        {
          kind: 'rule',
          title: 'Before años, uno becomes un',
          body: 'When a number ending in uno comes directly before the masculine noun años, use un: veintiún años. When you say 21 by itself, use veintiuno. The spelling changes with the stress. For one year, say un año.',
          examples: ['Tengo veintiún años.', 'Tiene un año.'],
        },
        {
          kind: 'build',
          prompt: 'Give the age 21 in a complete sentence.',
          answer: ['Tengo', 'veintiún', 'años.'],
          extra: ['veintiuno'],
          explanation:
            'Before años, veintiuno becomes veintiún. Tengo veintiún años is the complete age statement.',
        },
        {
          kind: 'rule',
          title: 'Twenty-six to thirty',
          body: 'Veintiséis also needs an accent. Twenty-seven, twenty-eight and twenty-nine stay single words. Thirty is treinta.',
          table: [
            ['26', 'veintiséis'],
            ['27', 'veintisiete'],
            ['28', 'veintiocho'],
            ['29', 'veintinueve'],
            ['30', 'treinta'],
          ],
          examples: ['veintiséis, veintisiete, veintiocho, veintinueve, treinta'],
        },
        {
          kind: 'type',
          prompt: 'Write 26 as one Spanish word.',
          answerKind: 'text',
          accepted: ['veintiséis'],
          hint: 'Use veinti + séis, joined as one word.',
          explanation: 'Veintiséis has an accent on é, like dieciséis.',
        },
        {
          kind: 'type',
          prompt: 'Listen to the age. Type the number using digits.',
          audio: 'Tengo veintisiete años.',
          answerKind: 'digits',
          accepted: ['27'],
          hint: 'Listen to the number between tengo and años.',
          explanation: 'Veintisiete is 27. The speaker says their age, not a phone number.',
        },
        {
          kind: 'teach',
          title: 'Ask for a detail',
          items: [
            {
              target: '¿Cuál es tu número de teléfono?',
              meaning: 'What is your phone number? (tú)',
              note: 'Tu without an accent means your. Tú with an accent means you.',
            },
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
          kind: 'choose',
          context: 'Nombre: Eva\nApellido: Ríos\nEdad: 23',
          prompt: 'Which sentence gives Eva’s age?',
          options: ['Es veintitrés años.', 'Tengo veintitrés años.', 'Tiene veintitrés años.'],
          answer: 2,
          explanation: 'Tiene is the form for Eva. Tengo would mean the speaker’s own age.',
        },
        {
          kind: 'type',
          prompt:
            'Speak as a fictional person aged 22. Write a complete sentence using words for the number.',
          accepted: ['Tengo veintidós años.', 'Yo tengo veintidós años.'],
          hint: 'Use Tengo + veintidós + años.',
          explanation:
            'Tengo veintidós años gives an age. Veintidós keeps its accent, and años keeps ñ.',
        },
        {
          kind: 'speak',
          prompt:
            'Choose an invented name, surname and age between 20 and 30. Introduce yourself, give the age and ask a classmate for their phone number.',
          lines: [
            'Me llamo Ana.',
            'Mi apellido es García.',
            'Tengo veintiún años.',
            '¿Cuál es tu número de teléfono?',
          ],
          mission: {
            checks: [
              'Use tengo for your character’s age.',
              'Use the correct number form before años.',
              'Keep tú and tu in their different jobs.',
            ],
            twist:
              'Now talk about the character instead of speaking as them. Change tengo to tiene, then ask a receptionist for their email using usted.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u3-talk',
      session: 'Real talk',
      title: 'Spell it and check it back',
      outcome:
        'Understand common letter names, distinguish fifteen from fifty and correct contact details.',
      minutes: 11,
      steps: [
        {
          kind: 'rule',
          title: 'Tens up to one hundred',
          body: 'You already know veinte and treinta. These tens help with ages, prices and pairs of phone digits. Exactly 100 is cien. Practise a few at a time; you can return to this lesson for the reference.',
          table: [
            ['40', 'cuarenta'],
            ['50', 'cincuenta'],
            ['60', 'sesenta'],
            ['70', 'setenta'],
            ['80', 'ochenta'],
            ['90', 'noventa'],
            ['100', 'cien'],
          ],
          examples: ['cuarenta, cincuenta, sesenta, setenta, ochenta, noventa, cien'],
        },
        {
          kind: 'choose',
          prompt: 'Listen carefully. Is it fifteen or fifty?',
          audio: 'cincuenta',
          options: ['50', '15', '5'],
          answer: 0,
          explanation:
            'Cincuenta is 50. Quince is 15. Replay both number lists if you need another comparison.',
        },
        {
          kind: 'rule',
          title: 'Build a number between the tens',
          body: 'From 31 to 99, combine the ten, y, and the last digit: treinta y dos, sesenta y cuatro. Exact tens do not need y. Before años, uno still becomes un: treinta y un años.',
          examples: ['treinta y dos', 'sesenta y cuatro', 'noventa y nueve', 'treinta y un años'],
        },
        {
          kind: 'build',
          prompt: 'Build the number 64.',
          answer: ['sesenta', 'y', 'cuatro'],
          extra: ['cuarenta'],
          explanation: 'Sesenta y cuatro is 60 plus 4. The conjunction y joins the tens and units.',
        },
        {
          kind: 'type',
          prompt: 'Write 37 in Spanish words.',
          answerKind: 'text',
          accepted: ['treinta y siete'],
          hint: 'Use treinta + y + siete.',
          explanation:
            'Treinta y siete is written as three words. Unlike veintisiete, it uses y as a separate word.',
        },
        {
          kind: 'choose',
          prompt: 'Which word means exactly 100?',
          options: ['ciento', 'cien', 'diez'],
          answer: 1,
          explanation:
            'Exactly 100 is cien. Ciento is used in larger numbers such as 101, which you will practise later.',
        },
        {
          kind: 'rule',
          title: 'Spell a name: a to i',
          body: 'Letter names help someone write a name correctly. The Spanish alphabet has 27 letters, including ñ. Work through three small groups, then use just the letters you need for a name.',
          table: [
            ['a', 'a'],
            ['b', 'be'],
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
          kind: 'rule',
          title: 'Spell a name: r to z',
          body: 'Letter names vary. You may hear ve corta for v, doble u for w and i griega for y. Uve, uve doble and ye are also valid. B and v do not represent different sounds in ordinary Spanish, so a clarifying name can help. Ch and ll are pairs of letters, not extra alphabet letters.',
          table: [
            ['r', 'erre'],
            ['s', 'ese'],
            ['t', 'te'],
            ['u', 'u'],
            ['v', 'uve / ve corta'],
            ['w', 'doble u / uve doble'],
            ['x', 'equis'],
            ['y', 'ye / i griega'],
            ['z', 'zeta'],
          ],
          examples: ['erre, ese, te, u, uve, doble u, equis, ye, zeta'],
        },
        {
          kind: 'choose',
          prompt: 'Someone says “doble u” when spelling. Which letter should you write?',
          options: ['w', 'u', 'v'],
          answer: 0,
          explanation: 'Doble u is a common name for w. Uve doble also names w.',
        },
        {
          kind: 'teach',
          title: 'Email symbols and checking',
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
            {
              target: '¿Así está bien?',
              meaning: 'Is it correct like this?',
              note: 'Say it when showing the written details for confirmation.',
            },
          ],
        },
        {
          kind: 'scene',
          title: 'One correction at the class desk',
          intro:
            'Ana gives a fictional surname and checks the end of her phone number. The receptionist repeats it incorrectly, so Ana corrects just the part that needs changing.',
          lines: [
            {
              speaker: 'Recepcionista',
              text: '¿Cómo se escribe tu apellido?',
              meaning: 'How is your surname spelled?',
            },
            { speaker: 'Ana', text: 'Soto. Ese, o, te, o.', meaning: 'Soto. S, o, t, o.' },
            {
              speaker: 'Recepcionista',
              text: '¿Tu número termina en quince?',
              meaning: 'Does your number end in fifteen?',
            },
            {
              speaker: 'Ana',
              text: 'No, en cincuenta. Cinco, cero.',
              meaning: 'No, in fifty. Five, zero.',
            },
            {
              speaker: 'Recepcionista',
              text: 'Cincuenta. ¿Así está bien?',
              meaning: 'Fifty. Is it correct like this?',
            },
            { speaker: 'Ana', text: 'Sí, gracias.', meaning: 'Yes, thank you.' },
          ],
          note: 'Termina en means ends in. Switching from a pair to single digits can make a correction clearer.',
        },
        {
          kind: 'type',
          prompt: 'Listen to the correction. Type the final two digits the speaker wants.',
          audio: 'No, en cincuenta. Cinco, cero.',
          answerKind: 'digits',
          accepted: ['50'],
          hint: 'The speaker repeats the correct pair as two separate digits.',
          explanation: 'The correction is 50. Do not keep the earlier guess, 15.',
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
          kind: 'speak',
          prompt:
            'Spell the fictional surname Soto, then correct the end of a phone number from 15 to 50. Finish by asking if the written details are correct.',
          lines: ['Ese, o, te, o.', 'No, en cincuenta. Cinco, cero.', '¿Así está bien?'],
          tip: 'Read letter names and digits clearly, with pauses. If a pair is confusing, say each digit separately.',
          mission: {
            checks: [
              'Spell the letters rather than only repeating the name.',
              'Correct 15 to 50.',
              'Ask for confirmation.',
            ],
            twist:
              'Now spell Muñoz, including ñ. Change a different final pair from 38 to 24, then check it back.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u3-task',
      session: 'Exam task',
      title: 'Register for the language exchange',
      outcome:
        'Complete personal fields accurately and use a spoken correction before confirming the details.',
      minutes: 7,
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
          kind: 'type',
          prompt: 'Listen to a new practice code. Type the four digits in order.',
          audio: 'siete, cero, cuatro, uno',
          answerKind: 'digits',
          accepted: ['7041'],
          hint: 'Write one digit per spoken number. Keep the zero in the second position.',
          explanation:
            'Siete, cero, cuatro, uno gives 7041. Correct order matters as much as recognising each digit.',
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
          context: 'Nombre: Luis\nEdad: 31',
          prompt: 'Give Luis’s age in a sentence about him. Write the number in words.',
          accepted: [
            'Tiene treinta y un años.',
            'Luis tiene treinta y un años.',
            'Él tiene treinta y un años.',
          ],
          hint: 'Use tiene, then treinta y un años.',
          explanation:
            'Tiene is the form for Luis. Before años, treinta y uno becomes treinta y un.',
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
            'Register an invented person. Give a name, spell a surname, give an age and read a fictional phone number. Imagine one digit is copied wrongly: correct it and check the result.',
          lines: [
            'Me llamo Ana.',
            'Mi apellido es Soto.',
            'Ese, o, te, o.',
            'Tengo veintiún años.',
            'cinco cinco, cero uno, cero cero, cero cero, dos cuatro',
            '¿Así está bien?',
          ],
          mission: {
            checks: [
              'Give each requested detail.',
              'Use letter names and keep ñ if your surname has it.',
              'Correct the wrong digit and ask for confirmation.',
            ],
            twist:
              'The receptionist uses usted and asks for an email address instead. Give ana.soto@example.com aloud, including its symbols.',
          },
        },
      ],
    },
  ],
);
