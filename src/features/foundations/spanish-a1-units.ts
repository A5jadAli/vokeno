import { defineUnit } from './types';
import { spanishA1Unit2 } from './spanish-a1-unit-2';
import { spanishA1Unit3 } from './spanish-a1-unit-3';
import { spanishA1Unit4 } from './spanish-a1-unit-4';
import { spanishA1Unit5 } from './spanish-a1-unit-5';
import { spanishA1Checkpoint1 } from './spanish-a1-checkpoint-1';
import { spanishA1Unit6 } from './spanish-a1-unit-6';

// The first six units are available for the native-review pilot.
// Familiar recorded phrases are deliberately retrieved in new situations. The final task
// introduces no new review cards. Scripts and existing audio still need native-teacher review.
const unit1 = defineUnit(
  'ES',
  'A1',
  {
    id: 'es-a1-u1',
    number: 1,
    icon: 'hand-wave',
    title: 'Hola: your first conversation',
    canDo: 'Greet someone, introduce yourself and ask for help when you miss something.',
  },
  [
    {
      id: 'es-a1-u1-words',
      session: 'Words',
      title: 'Say hello and leave on a friendly note',
      outcome: 'Choose a greeting, say thank you and end a short exchange.',
      minutes: 5,
      steps: [
        {
          kind: 'scene',
          title: 'Meet Ana and Omar',
          intro:
            'At a language exchange in Mexico City, Ana meets Omar. Listen for Hola: hello. The names and the rest of the introduction come in the next session. Tap English whenever you need it.',
          lines: [
            {
              speaker: 'Ana',
              text: '¡Hola! Soy Ana. ¿Cómo te llamas?',
              meaning: 'Hi! I’m Ana. What’s your name?',
            },
            { speaker: 'Omar', text: 'Omar. Mucho gusto.', meaning: 'Omar. Nice to meet you.' },
          ],
          note: 'A short answer can be natural. Omar gives his name because Ana has just asked for it.',
        },
        {
          kind: 'teach',
          title: 'Arrive and leave',
          items: [
            { target: 'Hola.', meaning: 'Hello.', note: 'A friendly greeting at any time of day.' },
            {
              target: 'Buenos días.',
              meaning: 'Good morning.',
              note: 'Useful when entering a shop or meeting someone in the morning.',
            },
            {
              target: 'Buenas tardes.',
              meaning: 'Good afternoon.',
              note: 'From about midday until it gets dark.',
            },
            {
              target: 'Buenas noches.',
              meaning: 'Good evening. / Good night.',
              note: 'After dark. It works for hello and for goodbye.',
            },
            {
              target: 'Hasta luego.',
              meaning: 'See you later.',
              note: 'A common goodbye. You do not need a definite plan to meet again.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'You arrive at a language exchange in the morning. Which phrase is a greeting?',
          options: ['Hasta luego.', 'Buenos días.', 'Gracias.'],
          answer: 1,
          explanation:
            'Buenos días greets someone in the morning. Hola also works. Hasta luego is for leaving.',
        },
        {
          kind: 'teach',
          title: 'A little courtesy',
          items: [
            {
              target: 'Por favor.',
              meaning: 'Please.',
              note: 'Add it to a request. You will use it to ask for repetition in Real talk.',
            },
            { target: 'Gracias.', meaning: 'Thank you.', note: 'Use it when someone helps you.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Someone helps you find your class. What do you say?',
          options: ['Hola.', 'Por favor.', 'Gracias.'],
          answer: 2,
          explanation: 'Gracias thanks them for their help. Por favor belongs with a request.',
        },
        {
          kind: 'rule',
          title: 'Small phrases, clear sounds',
          body: 'Spanish has five vowel sounds: a, e, i, o, u. Listen to Hola and Gracias, then try them. Keep the vowels clear. The h in hola is silent. Written questions begin with ¿ and end with ?; exclamations use ¡ and !.',
          examples: ['Hola.', 'Gracias.'],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What is happening at the end of this exchange?',
          audio: 'Gracias. Hasta luego.',
          options: ['The person is leaving', 'The person is arriving', 'The person asks a name'],
          answer: 0,
          explanation: 'Hasta luego closes the exchange. Gracias adds a thank-you before leaving.',
        },
        {
          kind: 'match',
          prompt: 'Give each phrase a job.',
          pairs: [
            ['Buenas tardes.', 'Greet someone in the afternoon'],
            ['Por favor.', 'Make a request polite'],
            ['Gracias.', 'Thank someone'],
            ['Hasta luego.', 'Say goodbye'],
          ],
        },
        {
          kind: 'type',
          prompt: 'You are leaving the class. Write “See you later” in Spanish.',
          accepted: ['Hasta luego.'],
          hint: 'Two words: Hasta + luego.',
          explanation:
            'Hasta luego is a friendly way to leave. You can use it even without a next meeting arranged.',
        },
        {
          kind: 'choose',
          prompt: 'You arrive at your class at four in the afternoon. Which greeting fits?',
          options: ['Buenos días.', 'Buenas tardes.', 'Buenas noches.'],
          answer: 1,
          explanation:
            'Buenas tardes fits the afternoon. Buenos días is for the morning and buenas noches for after dark. Hola works at any time.',
        },
        {
          kind: 'speak',
          prompt:
            'Imagine arriving at your class in the morning. Greet someone. Later, thank them and say goodbye.',
          lines: ['Buenos días.', 'Gracias. Hasta luego.'],
          tip: 'Listen to the vowels, then try the phrases without reading.',
          mission: {
            checks: ['Greet on arrival.', 'Thank the person and close the exchange.'],
            twist: 'Now imagine arriving in the afternoon. Change the greeting to match the time.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u1-grammar',
      session: 'Grammar',
      title: 'Your name, your turn',
      outcome: 'Say your name and where you are from, then ask the other person their name.',
      minutes: 7,
      steps: [
        {
          kind: 'choose',
          prompt: 'Before you introduce yourself, greet the other person. Which phrase fits?',
          options: ['Gracias.', 'Hola.', 'Hasta luego.'],
          answer: 1,
          explanation: 'Hola opens the exchange. The next step is to introduce yourself.',
        },
        {
          kind: 'teach',
          title: 'Introduce yourself',
          items: [
            {
              target: 'Me llamo Sara.',
              meaning: 'My name is Sara.',
              note: 'Replace Sara with your own name or an invented one.',
            },
            {
              target: 'Mucho gusto.',
              meaning: 'Nice to meet you.',
              note: 'A common reply when meeting someone in Mexico.',
            },
            {
              target: 'Soy de Pakistán.',
              meaning: 'I am from Pakistan.',
              note: 'A useful whole pattern: soy de + place. Choose a real or invented place.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'My name; your name',
          body: 'Me llamo tells your name. ¿Cómo te llamas? asks someone their name using tú, the familiar form. Learn these short patterns first; you do not need a whole verb chart yet. Soy de tells where you are from, not where you live now.',
          table: [
            ['Me llamo + name', 'Give your name'],
            ['¿Cómo te llamas?', 'Ask a name using tú'],
            ['Soy de + place', 'Give your origin'],
          ],
        },
        {
          kind: 'build',
          prompt: 'Introduce the character Sara. Put the words in order.',
          answer: ['Me', 'llamo', 'Sara.'],
          extra: ['te'],
          explanation:
            'Me llamo Sara gives Sara’s name. Change the name when you speak for yourself.',
        },
        {
          kind: 'teach',
          title: 'Ask a name',
          items: [
            {
              target: '¿Cómo te llamas?',
              meaning: 'What is your name? (tú)',
              note: 'Use the familiar form with a friend or when tú is established.',
            },
            {
              target: '¿Cómo se llama?',
              meaning: 'What is your name? (usted)',
              note: 'Use this when you are addressing someone with usted. Customs vary by setting and region.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'A receptionist addresses you with usted. Ask their name using the same form.',
          options: ['¿Cómo te llamas?', 'Me llamo Sara.', '¿Cómo se llama?'],
          answer: 2,
          explanation:
            '¿Cómo se llama? keeps usted. Me llamo gives your own name; it does not ask theirs.',
        },
        {
          kind: 'choose',
          prompt: 'Listen for the name. What is the speaker called?',
          audio: 'Hola, me llamo Sara. Soy de Pakistán.',
          options: ['Sara', 'Pakistán', 'Hola'],
          answer: 0,
          explanation: 'Me llamo introduces Sara. Soy de introduces her place of origin.',
        },
        {
          kind: 'match',
          prompt: 'Match the information each phrase gives or asks for.',
          pairs: [
            ['Me llamo Sara.', 'The speaker’s name'],
            ['Soy de Pakistán.', 'The speaker’s origin'],
            ['¿Cómo te llamas?', 'A question about your name'],
            ['Mucho gusto.', 'A friendly response to meeting someone'],
          ],
        },
        {
          kind: 'type',
          context: 'Nombre (name): Luz',
          prompt: 'Use the card to introduce Luz with “Me llamo”.',
          accepted: ['Me llamo Luz.'],
          hint: 'Keep Me llamo; replace the example name with the one on the card.',
          explanation: 'Me llamo Luz uses the same pattern with a new name. Nombre means name.',
        },
        {
          kind: 'choose',
          context: 'Me llamo Ravi. Soy de India.',
          prompt: 'Which information does this introduction give?',
          options: ['A name and an age', 'A name and an origin', 'A name and a phone number'],
          answer: 1,
          explanation:
            'Me llamo gives the name Ravi; soy de gives the origin India. It does not give an age or phone number.',
        },
        {
          kind: 'speak',
          prompt:
            'Greet a new classmate, give your chosen name and origin, then ask their name using tú. Fictional details are fine.',
          lines: [
            'Hola.',
            'Me llamo Sara.',
            'Soy de Pakistán.',
            '¿Cómo te llamas?',
            'Mucho gusto.',
          ],
          tip: 'The ll in llamo often sounds like an English y in Mexican Spanish. Listen and keep the vowels clear.',
          mission: {
            checks: ['Give a name and an origin.', 'Ask the other person their name.'],
            twist:
              'Now speak to someone who addresses you with usted. Change the name question to match.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u1-talk',
      session: 'Real talk',
      title: 'Keep going when you miss a word',
      outcome: 'Ask for repetition, slower speech or spelling instead of giving up.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'Missing a word is normal',
          body: 'At the class desk, the receptionist says something you do not catch. You can ask for help in Spanish. Choose one useful request; you do not need to say every phrase at once.',
        },
        {
          kind: 'teach',
          title: 'Get attention and ask again',
          items: [
            {
              target: 'Disculpe.',
              meaning: 'Excuse me.',
              note: 'A courteous way to get attention using usted.',
            },
            {
              target: 'No entiendo.',
              meaning: 'I do not understand.',
              note: 'Say what went wrong, then ask for the help you need.',
            },
            {
              target: '¿Puede repetir, por favor?',
              meaning: 'Could you repeat that, please?',
              note: 'This request uses usted. With tú, the verb is puedes.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt:
            'You did not hear the receptionist’s name. Which request asks them to say it again?',
          options: ['¿Puede repetir, por favor?', 'Mucho gusto.', 'Hasta luego.'],
          answer: 0,
          explanation:
            'Repetir asks for repetition. Mucho gusto is a response after an introduction.',
        },
        {
          kind: 'teach',
          title: 'Ask for the kind of help you need',
          items: [
            {
              target: 'Más despacio, por favor.',
              meaning: 'More slowly, please.',
              note: 'A short request when the speech is too fast.',
            },
            {
              target: '¿Cómo se escribe?',
              meaning: 'How is it spelled?',
              note: 'Useful after hearing a name you need to write. You learn the alphabet in a later unit.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'They repeat the sentence, but it is still too fast. What would help now?',
          options: ['Hasta luego.', 'Más despacio, por favor.', 'Mucho gusto.'],
          answer: 1,
          explanation:
            'Más despacio asks them to slow down. Repeating the same speed may not solve the problem.',
        },
        {
          kind: 'build',
          prompt: 'Ask for slower speech. Arrange the request.',
          answer: ['Más', 'despacio,', 'por', 'favor.'],
          extra: ['gusto'],
          explanation: 'Más despacio, por favor is a complete useful request, even without a verb.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does this person need?',
          audio: 'Disculpe, no entiendo. ¿Puede repetir, por favor?',
          options: ['An introduction', 'A goodbye', 'The words repeated'],
          answer: 2,
          explanation: 'No entiendo signals difficulty. ¿Puede repetir? asks for the words again.',
        },
        {
          kind: 'match',
          prompt: 'Choose the right tool for the difficulty.',
          pairs: [
            ['¿Puede repetir, por favor?', 'You need to hear it again'],
            ['Más despacio, por favor.', 'The speech is too fast'],
            ['¿Cómo se escribe?', 'You need the spelling'],
          ],
        },
        {
          kind: 'type',
          prompt: 'Say that you do not understand. Write the two-word phrase.',
          accepted: ['No entiendo.'],
          hint: 'No + entiendo.',
          explanation:
            'No entiendo tells the other person you need help. Follow it with a specific request.',
        },
        {
          kind: 'choose',
          prompt: 'You hear a name clearly but do not know how to write it. Ask for the spelling.',
          options: ['¿Cómo se escribe?', '¿Cómo te llamas?', 'Soy de Pakistán.'],
          answer: 0,
          explanation:
            '¿Cómo se escribe? asks how to write what you just heard. You already know which name they said.',
        },
        {
          kind: 'speak',
          prompt:
            'At the class desk, you miss what the receptionist says. Get their attention, ask for repetition, then thank them.',
          lines: ['Disculpe.', '¿Puede repetir, por favor?', 'Gracias.'],
          tip: 'Give the request a calm, friendly tone. Clear words matter more than speaking quickly.',
          mission: {
            checks: ['Ask for help that fits the difficulty.', 'Thank the person after they help.'],
            twist:
              'You hear the name this time, but need to write it. Ask a different question to get the spelling.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u1-task',
      session: 'Exam task',
      title: 'Meet someone new',
      outcome:
        'Use your first Spanish in a new introduction, a short reading and a repair request.',
      minutes: 5,
      steps: [
        {
          kind: 'rule',
          title: 'Put it together',
          body: 'Use what you already know. This is a short introduction practice towards DELE A1 speaking, with reading and listening warm-ups. It is not a full exam or a speaking assessment. You can use fictional personal details.',
        },
        {
          kind: 'choose',
          context: 'Hola. Me llamo Elena. Soy de México.',
          prompt: '¿Cómo se llama? (What is her name?)',
          options: ['México', 'Elena', 'Hola'],
          answer: 1,
          explanation: 'Me llamo introduces Elena. México follows soy de, so it gives her origin.',
        },
        {
          kind: 'type',
          context: 'Nombre: Tomás',
          prompt: 'Introduce the person on the card with “Me llamo”. Use the name you see.',
          accepted: ['Me llamo Tomás.'],
          hint: 'Use Me llamo, followed by Tomás.',
          explanation:
            'Me llamo Tomás adapts the pattern to a different person. Keep the accent in Tomás when writing.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Are you being asked a name, hearing a thank-you or hearing a goodbye?',
          audio: '¿Cómo se llama?',
          options: ['A name question', 'A thank-you', 'A goodbye'],
          answer: 0,
          explanation: '¿Cómo se llama? asks a name. When addressed to you, it uses usted.',
        },
        {
          kind: 'match',
          prompt: 'Make the conversation work.',
          pairs: [
            ['Me llamo Sara.', 'Introduce yourself'],
            ['Mucho gusto.', 'Respond to meeting someone'],
            ['Más despacio, por favor.', 'Ask for slower speech'],
            ['Hasta luego.', 'End the exchange'],
          ],
        },
        {
          kind: 'choose',
          prompt:
            'A new classmate has just introduced herself. Which reply acknowledges the introduction?',
          options: ['No entiendo.', 'Por favor.', 'Mucho gusto.'],
          answer: 2,
          explanation:
            'Mucho gusto responds warmly to meeting someone. You can then ask a question back.',
        },
        {
          kind: 'type',
          prompt:
            'You need the person to speak more slowly. Write the request ending with “por favor”.',
          accepted: ['Más despacio, por favor.'],
          hint: 'Start with Más despacio.',
          explanation: 'This request helps you stay in the conversation. Notice the accent in Más.',
        },
        {
          kind: 'choose',
          context: 'Hola. Me llamo Inés. Soy de Chile.',
          prompt: 'Inés tells you she lives in Mexico now. What does “Soy de Chile” tell you?',
          options: ['Her current address', 'Her origin', 'Her age'],
          answer: 1,
          explanation:
            'Soy de gives origin. It does not necessarily tell you where someone lives now.',
        },
        {
          kind: 'speak',
          prompt:
            'Meet a new classmate. Greet them, say your chosen name and origin, and ask their name. Imagine you miss the answer: ask for help, then say goodbye.',
          lines: [
            'Hola.',
            'Me llamo Sara.',
            'Soy de Pakistán.',
            '¿Cómo te llamas?',
            'Más despacio, por favor.',
            'Hasta luego.',
          ],
          mission: {
            checks: [
              'Give your own or invented details.',
              'Ask a name and recover when you miss the reply.',
              'Close the exchange politely.',
            ],
            twist:
              'Try again as a different character, using usted. Change the name, the place and the name question.',
          },
        },
      ],
    },
  ],
);

export const spanishA1Units = [
  ...unit1,
  ...spanishA1Unit2,
  ...spanishA1Unit3,
  ...spanishA1Unit4,
  ...spanishA1Unit5,
  ...spanishA1Checkpoint1,
  ...spanishA1Unit6,
];
