import { defineUnit } from './types';

// Numbers have a unit of their own: digits, ages and phone numbers read the Mexican way, in
// pairs. Spelling, email and the full registration form follow in Unit 4.
export const spanishA1Unit3 = defineUnit(
  'ES',
  'A1',
  {
    id: 'es-a1-u3',
    number: 3,
    icon: 'numeric',
    title: 'Numbers and your phone number',
    canDo: 'Give your age and phone number, and correct a number someone gets wrong.',
  },
  [
    {
      id: 'es-a1-u3-words',
      session: 'Words',
      title: 'Make sure they have your number',
      outcome: 'Say numbers from zero to twenty and read a phone number digit by digit.',
      minutes: 7,
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
          hint: 'One word: dieci + seis, with an accent on the é: dieciséis.',
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
          title: 'The number they ask for',
          items: [
            {
              target: 'el número de teléfono',
              meaning: 'telephone number',
              note: 'Teléfono has an accent. A mobile is el celular in Mexico and el móvil in Spain.',
            },
          ],
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
      title: 'Your age, your number',
      outcome: 'Use tener for age, count to thirty and ask for a phone number.',
      minutes: 8,
      steps: [
        {
          kind: 'choose',
          prompt: 'Someone reads a code: cero, cinco, dos. Which digits do you write?',
          options: ['052', '502', '025'],
          answer: 0,
          explanation:
            'Cero, cinco, dos is 052. Keep the zero at the start and the order as heard.',
        },
        {
          kind: 'teach',
          title: 'Age uses tener',
          items: [
            {
              target: 'Tengo veinte años.',
              meaning: 'I am twenty years old.',
              note: 'Spanish uses tengo, literally I have, for age. Keep the ñ: without it, años becomes a very different word.',
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
          body: 'For one person: yo tengo, tú tienes, él/ella tiene. Usted also uses tiene. For age, use the number followed by años. On a form, edad means age. You can practise with an invented person instead of sharing your age.',
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
          hint: 'One word: veinti + seis, with an accent on the é: veintiséis.',
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
          title: 'Ask for a number',
          items: [
            {
              target: '¿Cuál es tu número de teléfono?',
              meaning: 'What is your phone number? (tú)',
              note: 'Tu without an accent means your. Tú with an accent means you.',
            },
            {
              target: '¿Me das tu número?',
              meaning: 'Can I have your number? (tú)',
              note: 'Friendly and very common between peers in Mexico. With usted: ¿Me da su número?',
            },
          ],
        },
        {
          kind: 'choose',
          context: 'Nombre: Eva\nEdad: 23',
          prompt: 'Which sentence gives Eva’s age?',
          options: ['Es veintitrés años.', 'Tengo veintitrés años.', 'Tiene veintitrés años.'],
          answer: 2,
          explanation: 'Tiene is the form for Eva. Tengo would mean the speaker’s own age.',
        },
        {
          kind: 'choose',
          prompt: 'A classmate asks “¿Me das tu número?” What do they want?',
          options: ['Your phone number', 'Your age', 'Your name'],
          answer: 0,
          explanation:
            '¿Me das tu número? asks for your phone number. Answer with the digits, slowly.',
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
            'Choose an invented name and an age between 20 and 30. Introduce yourself, give the age and ask a classmate for their phone number.',
          lines: ['Me llamo Ana.', 'Tengo veintiún años.', '¿Cuál es tu número de teléfono?'],
          mission: {
            checks: [
              'Use tengo for your character’s age.',
              'Use the correct number form before años.',
              'Ask for a phone number.',
            ],
            twist:
              'Now talk about the character instead of speaking as them. Change tengo to tiene, then ask a friend for their number the casual way.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u3-talk',
      session: 'Real talk',
      title: 'Did you say fifteen or fifty?',
      outcome:
        'Count to one hundred, follow a number read in pairs and correct a number taken down wrong.',
      minutes: 8,
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
          kind: 'choose',
          prompt: 'Listen. Sixty or seventy?',
          audio: 'setenta',
          options: ['60', '70', '17'],
          answer: 1,
          explanation:
            'Setenta is 70: listen for the t in se-TEN-ta. Sesenta, 60, has an s: se-SEN-ta.',
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
          title: 'Phone numbers in pairs',
          body: 'In Mexico many people read a phone number in pairs: cincuenta y cinco for 55, doce for 12. Digit by digit is also fine. If a pair is unclear, ask for the digits one by one.',
          examples: ['cincuenta y cinco, doce, treinta y cuatro, cincuenta y seis, cincuenta'],
        },
        {
          kind: 'type',
          prompt: 'Listen to a number read in pairs. Type all ten digits. Spaces are allowed.',
          audio: 'cincuenta y cinco, cuarenta, veintiuno, noventa, trece',
          answerKind: 'digits',
          accepted: ['5540219013'],
          hint: 'Five pairs. Write each pair as two digits.',
          explanation: 'The number is 55 40 21 90 13. Cuarenta is 40 and trece is 13.',
        },
        {
          kind: 'teach',
          title: 'Check it back',
          items: [
            {
              target: '¿Así está bien?',
              meaning: 'Is it correct like this?',
              note: 'Say it when showing or reading back details for confirmation.',
            },
          ],
        },
        {
          kind: 'scene',
          title: 'One correction at the class desk',
          intro:
            'Ana gives her phone number at the class desk. The receptionist reads the end back wrong, so Ana corrects just the part that needs changing.',
          lines: [
            {
              speaker: 'Recepcionista',
              text: '¿Su número termina en quince?',
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
          note: 'The receptionist uses usted, so su means your. Termina en means ends in. Switching from a pair to single digits makes a correction clearer.',
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
          kind: 'choose',
          prompt: 'Listen. How does the number end?',
          audio: 'Termina en sesenta.',
          options: ['60', '70', '16'],
          answer: 0,
          explanation: 'Sesenta is 60. Setenta, with a t, is 70; dieciséis is 16.',
        },
        {
          kind: 'speak',
          prompt:
            'Read this fictional number in pairs: 55 12 34 56 50. The receptionist reads the end back as 15: correct it to 50 and check it back.',
          lines: [
            'cincuenta y cinco, doce, treinta y cuatro, cincuenta y seis, cincuenta',
            'No, en cincuenta. Cinco, cero.',
            '¿Así está bien?',
          ],
          tip: 'Read pairs and digits clearly, with pauses. If a pair is confusing, say each digit separately.',
          mission: {
            checks: [
              'Read the number in pairs.',
              'Correct 15 to 50, with single digits if it helps.',
              'Ask for confirmation.',
            ],
            twist:
              'Now the receptionist hears setenta instead of sesenta. Correct it the same way.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u3-task',
      session: 'Exam task',
      title: 'Leave your number at the desk',
      outcome:
        'Take down an age and a phone number, and use a correction instead of the old number.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'A small check-in',
          body: 'Use a fictional person’s details. You will hear numbers, write them down and use a correction. This is practice towards A1 listening and forms, not a full DELE task. No real contact details are needed.',
        },
        {
          kind: 'choose',
          context: 'Me llamo Vera. Soy de Chile. Vivo en Puebla. Tengo veintiséis años.',
          prompt: 'How old is Vera?',
          options: ['16', '26', '62'],
          answer: 1,
          explanation: 'Veintiséis is 26. Dieciséis would be 16.',
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
          kind: 'form',
          prompt: 'Complete Vera’s details. Listen for her new phone number.',
          context:
            'Me llamo Vera. Tengo veintiséis años.\nOld phone number: 55 0100 0024\nVera gives the new number in the audio. Use the new number in Teléfono.',
          audio: 'Mi número es cinco cinco, cero uno, cero cero, cero cero, cuatro ocho.',
          fields: [
            {
              label: 'Nombre',
              kind: 'text',
              accepted: ['Vera'],
              hint: 'Use the given name.',
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
          ],
          explanation:
            'The new number is 55 0100 0048. You used the correction instead of copying the old phone number.',
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
          kind: 'type',
          prompt: 'Listen to a phone number read in pairs. Type all ten digits.',
          audio: 'Mi número es cincuenta y cinco, veinte, treinta, catorce, noventa y nueve.',
          answerKind: 'digits',
          accepted: ['5520301499'],
          hint: 'Five pairs: write each pair as two digits.',
          explanation: 'The number is 55 20 30 14 99. Catorce is 14; noventa y nueve is 99.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the person want?',
          audio: '¿Me das tu número?',
          options: ['Your phone number.', 'Your age.', 'To say goodbye.'],
          answer: 0,
          explanation: '¿Me das tu número? asks for your phone number in a friendly way.',
        },
        {
          kind: 'speak',
          prompt:
            'Check in as an invented person: give a name, an age and a fictional phone number. Imagine one digit is copied wrongly: correct it and check the result.',
          lines: [
            'Me llamo Ana.',
            'Tengo veintiún años.',
            'cinco cinco, cero uno, cero cero, cero cero, dos cuatro',
            '¿Así está bien?',
          ],
          mission: {
            checks: [
              'Give each requested detail.',
              'Correct the wrong digit.',
              'Ask for confirmation.',
            ],
            twist: 'This time read the phone number in pairs, the way many people in Mexico do.',
          },
        },
      ],
    },
  ],
);
