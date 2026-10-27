import { defineUnit } from './types';

export const englishA1Unit1 = defineUnit(
  'EN',
  'A1',
  {
    id: 'en-a1-u1',
    number: 1,
    icon: 'hand-wave',
    title: 'Hello: meet someone',
    canDo: 'Say your name, ask a name and ask someone to repeat.',
  },
  [
    {
      id: 'en-a1-u1-meet',
      session: 'Meet the language',
      title: 'Hello, I’m Alex',
      outcome: 'Say hello and understand a name.',
      minutes: 5,
      steps: [
        {
          kind: 'scene',
          title: 'Meet Ella and Alex',
          intro: 'Tap play. Listen. Tap again to listen again. Ella and Alex meet at a class.',
          lines: [
            {
              speaker: 'Ella',
              text: 'Hello. I’m Ella.',
              meaning: 'Ella says hello and gives her name.',
            },
            {
              speaker: 'Alex',
              text: 'Hi. I’m Alex.',
              meaning: 'Alex says hello and gives a name.',
            },
          ],
          note: 'Ella uses British English. Alex uses American English. Both say I’m + name.',
        },
        {
          kind: 'teach',
          title: 'Hello and a name',
          items: [
            { target: 'Hello.', meaning: 'Say hello.', note: 'Use it when you meet someone.' },
            { target: 'Hi.', meaning: 'A friendly hello.', note: 'Hi and Hello both work here.' },
            {
              target: 'I’m Alex.',
              meaning: 'My name is Alex.',
              note: 'I’m means I am. Change Alex to your name.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Choose the name.',
          audio: 'Hi. I’m Alex.',
          options: ['Ella', 'Alex', 'Ben'],
          answer: 1,
          explanation: 'You heard “I’m Alex.” The name is Alex. Listen again if you need to.',
        },
        {
          kind: 'choose',
          prompt: 'You meet Ella. Say hello.',
          options: ['Hello.', 'Alex.', 'Ella.'],
          answer: 0,
          explanation:
            'Hello greets someone. Alex and Ella are names. Hi also works as a greeting.',
        },
        {
          kind: 'build',
          prompt: 'Use the tiles to say the name Alex. Start with I’m.',
          answer: ['I’m', 'Alex.'],
          explanation: 'I’m Alex. I’m + name tells someone your name.',
        },
        {
          kind: 'speak',
          prompt: 'Say hello. Say your name. You can use Alex or a made-up name.',
          lines: ['Hi. I’m Alex.'],
          tip: 'Make the name clear. Say “I’m Alex” together, with a small pause after Hello.',
          mission: {
            checks: ['Did I say hello?', 'Could someone hear the name?'],
            twist: 'Meet a new person. Say Hello instead of Hi, then give a different name.',
          },
        },
      ],
    },
    {
      id: 'en-a1-u1-build',
      session: 'Build a reply',
      title: 'What’s your name?',
      outcome: 'Ask a name and answer the same question.',
      minutes: 5,
      steps: [
        {
          kind: 'choose',
          prompt: 'Read the badge. Choose the introduction.',
          context: 'Name: Alex',
          options: ['I’m Ella.', 'I’m Alex.', 'Hello, Ella.'],
          answer: 1,
          explanation: 'The badge says Alex. “I’m Alex” gives that name.',
        },
        {
          kind: 'scene',
          title: 'Ask and answer',
          intro: 'Alex asks. Ella answers.',
          lines: [
            { speaker: 'Alex', text: 'What’s your name?', meaning: 'Alex asks Ella’s name.' },
            {
              speaker: 'Ella',
              text: 'I’m Ella. Nice to meet you.',
              meaning: 'Ella gives her name and a friendly welcome.',
            },
            {
              speaker: 'Alex',
              text: 'Nice to meet you, too.',
              meaning: 'Alex returns the friendly welcome.',
            },
          ],
        },
        {
          kind: 'teach',
          title: 'A question and a friendly reply',
          items: [
            {
              target: 'What’s your name?',
              meaning: 'Tell me your name, please.',
              note: 'What’s means What is.',
            },
            {
              target: 'Nice to meet you.',
              meaning: 'I’m happy to meet you.',
              note: 'Use it when you meet for the first time.',
            },
            {
              target: 'Nice to meet you, too.',
              meaning: 'I’m happy to meet you as well.',
              note: 'A friendly reply. “You too” also works.',
            },
          ],
        },
        {
          kind: 'build',
          prompt: 'Ask the name. Start with What’s.',
          answer: ['What’s', 'your', 'name?'],
          extra: ['I’m'],
          explanation: 'What’s your name? asks for a name. I’m starts your answer.',
        },
        {
          kind: 'type',
          prompt: 'Complete: I’m ___. Use the badge.',
          context: 'Name: Ella',
          accepted: ['Ella'],
          hint: 'Copy the name: Ella.',
          explanation:
            'I’m Ella. This task uses the badge name. In your own introduction, use any name you choose.',
        },
        {
          kind: 'choose',
          prompt: 'Ella asks: What’s your name? Answer as Alex.',
          options: ['Nice to meet you.', 'I’m Alex.', 'Hello, Ella.'],
          answer: 1,
          explanation:
            'I’m Alex answers the name question. The other replies are friendly but do not give a name.',
        },
        {
          kind: 'speak',
          prompt: 'Ask a name. Imagine the reply “I’m Ella.” Say Nice to meet you.',
          lines: ['What’s your name?', 'Nice to meet you.'],
          tip: 'Listen to the question, then try it. Your voice does not need to match the speaker’s accent.',
        },
      ],
    },
    {
      id: 'en-a1-u1-listen',
      session: 'Hear and respond',
      title: 'Sorry, can you say that again?',
      outcome: 'Ask for repetition, understand the reply and say goodbye.',
      minutes: 6,
      steps: [
        {
          kind: 'teach',
          title: 'When you miss something',
          items: [
            {
              target: 'Sorry, can you say that again?',
              meaning: 'Repeat it, please.',
              note: 'Use it when you do not hear or understand. Sorry? on its own also works. Pardon? is also polite in British English.',
            },
            { target: 'Thanks.', meaning: 'Thank you.', note: 'Use it when someone helps you.' },
            { target: 'Bye.', meaning: 'Goodbye.', note: 'Use it when you leave.' },
          ],
        },
        {
          kind: 'scene',
          title: 'Try again',
          intro: 'Ella misses the name. Alex repeats it.',
          lines: [
            { speaker: 'Alex', text: 'Hi. I’m Alex.', meaning: 'Alex gives a name.' },
            {
              speaker: 'Ella',
              text: 'Sorry, can you say that again?',
              meaning: 'Ella asks to hear it again.',
            },
            { speaker: 'Alex', text: 'Alex.', meaning: 'Alex repeats the name.' },
            {
              speaker: 'Ella',
              text: 'Thanks, Alex. I’m Ella.',
              meaning: 'Ella thanks Alex and gives her name.',
            },
          ],
          note: 'Asking again helps you communicate. You do not need to guess.',
        },
        {
          kind: 'choose',
          prompt: 'You did not hear the name. What helps?',
          options: ['Bye.', 'Sorry, can you say that again?', 'Nice to meet you.'],
          answer: 1,
          explanation:
            'Sorry, can you say that again? asks for repetition. You can use it as often as you need.',
        },
        {
          kind: 'choose',
          prompt: 'Listen to the repeated name.',
          audio: 'Alex. I’m Alex.',
          options: ['Ben', 'Ella', 'Alex'],
          answer: 2,
          explanation: 'The repeated name is Alex.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Is the person arriving or leaving?',
          audio: 'Thanks. Bye.',
          options: ['Leaving', 'Arriving', 'Asking a name'],
          answer: 0,
          explanation: 'Bye closes the conversation. Thanks adds a thank-you.',
        },
        {
          kind: 'type',
          prompt: 'Ask someone to repeat: Sorry, can you say that ___?',
          accepted: ['again', 'once more', 'one more time'],
          hint: 'Again means one more time.',
          explanation:
            'Sorry, can you say that again? Once more and one more time also ask for a repeat. Use the complete request when you miss something.',
        },
        {
          kind: 'speak',
          prompt:
            'You miss a name. Ask to hear it again. Imagine the reply “Ella.” Thank Ella, then say goodbye.',
          lines: ['Sorry, can you say that again?', 'Thanks, Ella. Bye.'],
          mission: {
            checks: ['Did I ask again?', 'Did I say thanks and goodbye?'],
            twist: 'This time the repeated name is Alex. Thank Alex and say goodbye.',
          },
        },
      ],
    },
    {
      id: 'en-a1-u1-use',
      session: 'Use it yourself',
      title: 'Your first short conversation',
      outcome: 'Introduce yourself, ask a name and close the conversation.',
      minutes: 6,
      steps: [
        {
          kind: 'choose',
          prompt: 'Ella says: Nice to meet you. Choose a friendly reply.',
          options: [
            'Sorry, can you say that again?',
            'Nice to meet you, too.',
            'What’s your name?',
          ],
          answer: 1,
          explanation:
            'Nice to meet you, too returns the welcome. Asking again is useful if you missed her words, but this task asks for a welcome.',
        },
        {
          kind: 'type',
          prompt: 'Write the introduction using I’m and the badge name.',
          context: 'Name: Ben',
          accepted: ['I’m Ben.', 'I am Ben.'],
          hint: 'I’m + Ben.',
          explanation:
            'I’m Ben. I am Ben is also correct. This is a supplied practice name, not your personal information.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does Ella want you to do?',
          audio: 'Sorry, can you say that again?',
          options: ['Repeat your words', 'Leave', 'Say thanks'],
          answer: 0,
          explanation: 'She asks you to repeat. Say the same words more clearly.',
        },
        {
          kind: 'build',
          prompt: 'Thank Ella and leave. Start with Thanks.',
          answer: ['Thanks,', 'Ella.', 'Bye.'],
          explanation: 'Thanks, Ella. Bye. You can thank someone by name before leaving.',
        },
        {
          kind: 'speak',
          prompt:
            'Meet Ella. Say hello and a name. Ask her name. Give a friendly reply and say goodbye. Try first without the example.',
          lines: ['Hi. I’m Ben. What’s your name?', 'Nice to meet you.', 'Bye, Ella.'],
          mission: {
            checks: [
              'I said hello and a name.',
              'I asked the other person’s name.',
              'I gave a friendly reply and said goodbye.',
            ],
            twist: 'Meet Alex instead. You miss the name. Ask again before saying goodbye.',
          },
          tip: 'If one part is hard, practise just that part, then try the exchange again. Pauses are fine.',
        },
        {
          kind: 'rule',
          title: 'Next: a little about you',
          body: 'You can meet someone and ask them to repeat. Unit 2 adds where you are from and where you live. Your phrases will also return in review. Speaking here is self-practice, not an assessed language level.',
        },
      ],
    },
  ],
);
