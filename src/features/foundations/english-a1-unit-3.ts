import { defineUnit } from './types';

export const englishA1Unit3 = defineUnit(
  'EN',
  'A1',
  {
    id: 'en-a1-u3',
    number: 3,
    icon: 'coffee-outline',
    title: 'A drink, please',
    canDo: 'Order a drink, choose here or takeaway and correct a mix-up.',
  },
  [
    {
      id: 'en-a1-u3-meet',
      session: 'Meet the language',
      title: 'I’d like a coffee, please',
      outcome: 'Choose a drink and make a polite request.',
      minutes: 6,
      steps: [
        {
          kind: 'teach',
          title: 'A small menu',
          items: [
            {
              target: 'coffee',
              meaning: '☕ Coffee',
              note: 'A coffee means one cup of coffee in an order.',
            },
            { target: 'tea', meaning: '🍵 Tea', note: 'A tea means one cup of tea in an order.' },
            {
              target: 'water',
              meaning: '💧 Water',
              note: 'Some water is a useful request. You will learn prices and payment later.',
            },
          ],
        },
        {
          kind: 'scene',
          title: 'At the counter',
          intro: 'Alex orders. Casey works in the cafe. Both use American English.',
          lines: [
            { speaker: 'Casey', text: 'Hello.', meaning: 'Casey greets Alex.' },
            {
              speaker: 'Alex',
              text: 'Hi. I’d like a coffee, please.',
              meaning: 'Alex asks for one coffee.',
            },
          ],
        },
        {
          kind: 'teach',
          title: 'Ask for a drink',
          items: [
            {
              target: 'I’d like a coffee, please.',
              meaning: 'One coffee, please.',
              note: 'I’d like means I would like. It is a polite request.',
            },
            {
              target: 'I’d like a tea, please.',
              meaning: 'One tea, please.',
              note: 'Keep the pattern and change the drink.',
            },
            {
              target: 'I’d like some water, please.',
              meaning: 'Some water, please.',
              note: 'Use some water for this request.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Choose the drink.',
          audio: 'I’d like a tea, please.',
          options: ['☕ Coffee', '💧 Water', '🍵 Tea'],
          answer: 2,
          explanation: 'The request is for tea. Please makes the request polite.',
        },
        {
          kind: 'build',
          prompt: 'Ask for coffee using I’d like. Start with I’d.',
          answer: ['I’d', 'like', 'a', 'coffee,', 'please.'],
          extra: ['from'],
          explanation:
            'I’d like a coffee, please. In conversation, “Could I have a coffee, please?” is also natural, and in American English “Can I get a coffee?” is very common. This tile task practises I’d like.',
        },
        {
          kind: 'speak',
          prompt: 'Say hello and order tea or coffee.',
          lines: ['Hello. I’d like a tea, please.'],
          tip: 'Make the drink clear. You can pause after Hello. You do not have to speak quickly.',
        },
      ],
    },
    {
      id: 'en-a1-u3-build',
      session: 'Build a reply',
      title: 'Yes, please. No, thank you.',
      outcome: 'Accept a drink, decline it and correct the wrong drink.',
      minutes: 6,
      steps: [
        {
          kind: 'teach',
          title: 'Choose and correct',
          items: [
            { target: 'Yes, please.', meaning: 'Yes, I want that.', note: 'Accept an offer.' },
            {
              target: 'No, thank you.',
              meaning: 'No, I do not want that.',
              note: 'Decline an offer politely. No, thanks is also natural.',
            },
            {
              target: 'No, tea, please.',
              meaning: 'Tea is the right drink.',
              note: 'Correct someone who thinks you asked for coffee.',
            },
          ],
        },
        {
          kind: 'scene',
          title: 'A small mix-up',
          intro: 'Ella wants tea. Ben checks the wrong drink. Both use British English.',
          lines: [
            { speaker: 'Ella', text: 'I’d like a tea, please.', meaning: 'Ella orders tea.' },
            { speaker: 'Ben', text: 'Coffee?', meaning: 'Ben checks whether she wants coffee.' },
            { speaker: 'Ella', text: 'No, tea, please.', meaning: 'Ella corrects the drink.' },
            { speaker: 'Ben', text: 'Tea?', meaning: 'Ben checks the corrected drink.' },
            { speaker: 'Ella', text: 'Yes, please.', meaning: 'Ella confirms tea.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'You want tea. The server says: Coffee? Choose the correction.',
          options: ['Yes, please.', 'No, tea, please.', 'No, thank you.'],
          answer: 1,
          explanation:
            'No, tea, please corrects the drink and tells the server what you want. No, thank you declines but does not name the right drink.',
        },
        {
          kind: 'choose',
          prompt: 'You do not want water. Someone offers: Water? Choose the reply.',
          options: ['Yes, please.', 'I’d like some water, please.', 'No, thank you.'],
          answer: 2,
          explanation:
            'No, thank you declines the water. The other replies ask for or accept water.',
        },
        {
          kind: 'type',
          prompt: 'Complete the reply: Yes, ___.',
          accepted: ['please', 'thanks', 'thank you'],
          hint: 'Please works here. Thanks or thank you can also accept an offer.',
          explanation:
            'Yes, please accepts an offer. Yes, thanks and Yes, thank you can also accept an offer politely. No, thank you would decline it.',
        },
        {
          kind: 'build',
          prompt: 'Ask for water using I’d like. Start with I’d.',
          answer: ['I’d', 'like', 'some', 'water,', 'please.'],
          extra: ['from'],
          explanation: 'I’d like some water, please. Use the whole pattern, changing the drink.',
        },
        {
          kind: 'speak',
          prompt:
            'You want coffee. The server checks: Tea? Correct the drink. Then the server says: Coffee? Confirm it.',
          lines: ['No, coffee, please.', 'Yes, please.'],
          mission: {
            checks: ['Did I name the drink I wanted?', 'Did I confirm the correct drink?'],
            twist: 'Now you want tea and the server says Coffee? Change your correction.',
          },
        },
      ],
    },
    {
      id: 'en-a1-u3-listen',
      session: 'Hear and respond',
      title: 'Here or to go?',
      outcome: 'Understand the choice between staying and taking a drink away.',
      minutes: 7,
      steps: [
        {
          kind: 'teach',
          title: 'Stay or leave with your drink',
          items: [
            {
              target: 'For here, please.',
              meaning: 'I will drink it in the cafe.',
              note: 'A natural reply to a service question.',
            },
            {
              target: 'To go, please.',
              meaning: 'I will take it with me.',
              note: 'Common in American English.',
            },
            {
              target: 'To take away, please.',
              meaning: 'I will take it with me.',
              note: 'Common in British English. It means the same as To go.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'Two ways to ask',
          body: 'For here or to go? asks: stay in the cafe, or take your drink with you? To have here or take away? asks the same thing. Learn to understand both. Use the reply that feels comfortable.',
          examples: ['For here or to go?', 'To have here or take away?'],
        },
        {
          kind: 'scene',
          title: 'The American model',
          intro: 'Casey asks where Alex wants the drink.',
          lines: [
            {
              speaker: 'Casey',
              text: 'For here or to go?',
              meaning: 'Stay in the cafe, or take it with you?',
            },
            { speaker: 'Alex', text: 'To go, please.', meaning: 'Alex will take the drink away.' },
          ],
        },
        {
          kind: 'scene',
          title: 'The British model',
          intro: 'Ben asks Ella the same choice.',
          lines: [
            {
              speaker: 'Ben',
              text: 'To have here or take away?',
              meaning: 'Stay in the cafe, or take it with you?',
            },
            {
              speaker: 'Ella',
              text: 'For here, please.',
              meaning: 'Ella will drink it in the cafe.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Where will the person drink?',
          audio: 'For here, please.',
          options: ['In the cafe', 'Away from the cafe', 'The reply does not say'],
          answer: 0,
          explanation: 'For here means staying in the cafe.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the person want?',
          audio: 'To take away, please.',
          options: ['To stay in the cafe', 'To take the drink with them', 'To change the drink'],
          answer: 1,
          explanation: 'To take away and to go both mean taking the drink with you.',
        },
        {
          kind: 'type',
          prompt: 'Type either model reply: To go, please. OR To take away, please.',
          accepted: ['To go, please.', 'To take away, please.'],
          hint: 'Choose one complete model reply. Both mean taking the drink with you.',
          explanation:
            'To take away, please. To go, please. Both choices work for taking your drink with you.',
        },
        {
          kind: 'speak',
          prompt:
            'The server asks: For here or to go? Answer. Then imagine the question is To have here or take away? Give the same choice.',
          lines: ['To go, please.', 'To take away, please.'],
          mission: {
            checks: [
              'Did I choose staying or taking the drink away?',
              'Did I understand both questions?',
            ],
            twist: 'Change your choice: stay in the cafe. Say For here, please.',
          },
        },
      ],
    },
    {
      id: 'en-a1-u3-use',
      session: 'Use it yourself',
      title: 'Order, check and correct',
      outcome: 'Complete a short order and fix a misheard drink.',
      minutes: 7,
      steps: [
        {
          kind: 'choose',
          prompt: 'Read the note. Which order matches?',
          context: 'Drink: tea 🍵\nPlace: in the cafe',
          options: [
            'I’d like a coffee, please. For here.',
            'I’d like a tea, please. For here.',
            'I’d like a tea, please. To go.',
          ],
          answer: 1,
          explanation:
            'The note asks for tea in the cafe. The other orders change either the drink or the place.',
        },
        {
          kind: 'type',
          prompt: 'Write the short order note: drink + for here. Use the details shown.',
          context: 'Drink: coffee ☕\nPlace: in the cafe\nPattern: ___, for here.',
          accepted: ['Coffee, for here.', 'A coffee, for here.'],
          hint: 'Coffee + for here.',
          explanation:
            'Coffee, for here. A short note does not need a full sentence. When speaking, add please to make the request polite.',
        },
        {
          kind: 'choose',
          prompt: 'You ordered tea to go. Listen to the check. What needs correcting?',
          audio: 'Coffee to go?',
          options: ['The drink', 'The place', 'Nothing'],
          answer: 0,
          explanation:
            'To go is right. Coffee is wrong because you ordered tea. Say “No, tea, please. To go.”',
        },
        {
          kind: 'build',
          prompt: 'Correct coffee to tea. Use No at the start.',
          answer: ['No,', 'tea,', 'please.'],
          explanation: 'No, tea, please tells the server the correct drink.',
        },
        {
          kind: 'speak',
          prompt:
            'Order tea to go. The server checks “Coffee?” Correct it. Then answer “For here or to go?” Finish with thanks. Try without the example first.',
          lines: ['Hello. I’d like a tea, please.', 'No, tea, please.', 'To go, please. Thanks.'],
          mission: {
            checks: [
              'Was my drink clear?',
              'Did I correct the wrong drink?',
              'Did I say whether to stay or take it away?',
            ],
            twist:
              'Order coffee for here. This time the server says Tea? Correct the drink and give your new place choice.',
          },
          tip: 'Could I have a tea, please?, Can I get a tea? (American) and A tea, please can also work. Aim for a clear request. This is practice, not an accent test.',
        },
        {
          kind: 'speak',
          prompt:
            'After the cafe, meet Ella at class. Give a name and your home city. Ask Ella’s name, then say goodbye. Use Unit 1 and Unit 2 again.',
          lines: [
            'Hello. I’m Alex. I live in London. What’s your name?',
            'Nice to meet you. Bye, Ella.',
          ],
          mission: {
            checks: ['Could I introduce myself again?', 'Did I ask a question and close?'],
            twist:
              'Use a different name and city. If you miss the reply, ask the person to say it again.',
          },
        },
        {
          kind: 'rule',
          title: 'Your next small step',
          body: 'You have practised three everyday situations. Come back for phrase review and try the unit calls with different details. More A1 units are being built. These first three units do not complete A1.',
        },
      ],
    },
  ],
);
