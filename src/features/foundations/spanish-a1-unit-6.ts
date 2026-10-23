import { defineUnit } from './types';

// A café in Mexico City: order, change one thing, check the total and pay. Exact phrases from
// the retired starter café lesson (Para llevar, Sin azúcar, La cuenta, por favor, ¿Puedo pagar
// con tarjeta?) keep their earned review intervals.
export const spanishA1Unit6 = defineUnit(
  'ES',
  'A1',
  {
    id: 'es-a1-u6',
    number: 6,
    icon: 'coffee-outline',
    title: 'At a café',
    canDo: 'Order a drink and something to eat, change your order and pay.',
  },
  [
    {
      id: 'es-a1-u6-words',
      session: 'Words',
      title: 'Choose your order',
      outcome: 'Order a drink and a snack, for here or to take away.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Coffee before class',
          intro:
            'Before the language exchange, Ana stops at a small café in Mexico City. Listen to how the barista asks for her order.',
          lines: [
            {
              speaker: 'Barista',
              text: 'Buenas tardes. ¿Qué te sirvo?',
              meaning: 'Good afternoon. What can I get you?',
            },
            {
              speaker: 'Ana',
              text: 'Un café americano y una concha, por favor.',
              meaning: 'An americano and a concha, please.',
            },
            {
              speaker: 'Barista',
              text: '¿Para aquí o para llevar?',
              meaning: 'For here or to take away?',
            },
            { speaker: 'Ana', text: 'Para aquí, gracias.', meaning: 'For here, thanks.' },
          ],
          note: '¿Qué te sirvo? means what can I get you. A concha is a Mexican sweet bread with a shell pattern on top.',
        },
        {
          kind: 'teach',
          title: 'On the menu',
          items: [
            { target: 'un café', meaning: 'a coffee', note: 'Café americano is black coffee.' },
            {
              target: 'un té',
              meaning: 'a tea',
              note: 'Té has an accent; te without one means you.',
            },
            {
              target: 'un jugo de naranja',
              meaning: 'an orange juice',
              note: 'In Spain it is un zumo de naranja.',
            },
            {
              target: 'una concha',
              meaning: 'a concha (Mexican sweet bread)',
              note: 'You will find it in almost every Mexican bakery and many cafés.',
            },
            { target: 'una galleta', meaning: 'a biscuit / a cookie' },
          ],
        },
        {
          kind: 'rule',
          title: 'Learn the word with un or una',
          body: 'Every noun is masculine or feminine, and the word for a changes with it: un café, una concha. Learn each new food or drink together with un or una, the way you heard it.',
          table: [
            ['un', 'café, té, jugo'],
            ['una', 'concha, galleta'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Which one is right?',
          options: ['una concha', 'un concha', 'unas concha'],
          answer: 0,
          explanation: 'Concha is feminine, so una concha.',
        },
        {
          kind: 'teach',
          title: 'Stay or go',
          items: [
            {
              target: 'Para aquí.',
              meaning: 'For here.',
              note: 'You will also hear para tomar aquí.',
            },
            {
              target: 'Para llevar.',
              meaning: 'To take away.',
              note: 'Use it when you will not stay.',
            },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match each item to the English.',
          pairs: [
            ['un té', 'a tea'],
            ['un jugo de naranja', 'an orange juice'],
            ['una galleta', 'a biscuit'],
            ['Para llevar.', 'To take away.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the customer order?',
          audio: 'Un té y una galleta, por favor.',
          options: ['A tea and a biscuit', 'A coffee and a concha', 'An orange juice'],
          answer: 0,
          explanation: 'Un té y una galleta: a tea and a biscuit.',
        },
        {
          kind: 'choose',
          prompt:
            'The barista asks: “¿Para aquí o para llevar?” You want to sit down. What do you say?',
          options: ['Para aquí.', 'Para llevar.', 'Hasta luego.'],
          answer: 0,
          explanation:
            'Para aquí means you will stay. Para llevar means you will take it with you.',
        },
        {
          kind: 'type',
          prompt: 'Write “an orange juice” in Spanish.',
          accepted: ['un jugo de naranja'],
          hint: 'un + jugo + de naranja.',
          explanation: 'Un jugo de naranja. In Spain you would read un zumo de naranja.',
        },
        {
          kind: 'build',
          prompt: 'Order a coffee and a concha, politely.',
          answer: ['Un', 'café', 'y', 'una', 'concha,', 'por', 'favor.'],
          extra: ['un'],
          explanation: 'Un café, una concha: each noun keeps its own un or una.',
        },
        {
          kind: 'speak',
          prompt:
            'The barista asks “¿Qué te sirvo?” Order a drink and something to eat, then answer the question about staying or going.',
          lines: ['Un café americano y una concha, por favor.', 'Para aquí, gracias.'],
          tip: 'Link the words in un café: they flow together, with clear vowels.',
          mission: {
            checks: ['Order two things with un or una.', 'Say whether you will stay.'],
            twist: 'This time you are in a hurry. Order a tea and take it away.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u6-grammar',
      session: 'Grammar',
      title: 'One coffee, without sugar',
      outcome: 'Ask for what you want, with or without something, and ask what they have.',
      minutes: 8,
      steps: [
        {
          kind: 'choose',
          prompt: 'Which is right for a biscuit?',
          options: ['una galleta', 'un galleta', 'una galletas'],
          answer: 0,
          explanation: 'Galleta is feminine and singular: una galleta.',
        },
        {
          kind: 'teach',
          title: 'Ask for it',
          items: [
            {
              target: '¿Me das un café, por favor?',
              meaning: 'Can I have a coffee, please?',
              note: 'The everyday way to order in Mexico. With usted: ¿Me da un café?',
            },
            {
              target: 'Quiero un té.',
              meaning: 'I want a tea. / I’d like a tea.',
              note: 'Fine with por favor and a friendly tone.',
            },
            {
              target: '¿Tienen jugo de naranja?',
              meaning: 'Do you have orange juice?',
              note: 'Tienen asks the café as a business: do you (all) have.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'With and without',
          body: 'Con means with and sin means without. Add them straight after what you order. Nouns like leche and azúcar need no un or una here.',
          table: [
            ['con leche', 'with milk'],
            ['sin azúcar', 'without sugar'],
            ['con hielo', 'with ice'],
          ],
          examples: ['Un café con leche.', 'Un té sin azúcar.'],
        },
        {
          kind: 'teach',
          title: 'Change one thing',
          items: [
            {
              target: 'Con leche, por favor.',
              meaning: 'With milk, please.',
              note: 'Leche has two clear e sounds: LE-che.',
            },
            {
              target: 'Sin azúcar, por favor.',
              meaning: 'Without sugar, please.',
              note: 'Sin means without. The stress is on the u: a-ZÚ-car.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'You want your tea without sugar. Which do you say?',
          options: ['Un té sin azúcar.', 'Un té con azúcar.', 'Un té y azúcar.'],
          answer: 0,
          explanation: 'Sin means without. Con would ask for sugar.',
        },
        {
          kind: 'rule',
          title: 'Two or more',
          body: 'For more than one, add -s to a word ending in a vowel and -es to one ending in a consonant. Numbers from Unit 3 go first: dos cafés, tres conchas. Un and una only mean one.',
          table: [
            ['un café', 'dos cafés'],
            ['una concha', 'tres conchas'],
            ['un té', 'dos tés'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Order two coffees.',
          options: ['Dos cafés, por favor.', 'Dos café, por favor.', 'Un cafés, por favor.'],
          answer: 0,
          explanation: 'Dos needs the plural: cafés.',
        },
        {
          kind: 'build',
          prompt: 'Ask for a coffee with milk, the everyday Mexican way.',
          answer: ['¿Me', 'das', 'un', 'café', 'con', 'leche?'],
          extra: ['sin'],
          explanation: '¿Me das un café con leche? With usted, change das to da.',
        },
        {
          kind: 'type',
          prompt: 'Ask if they have orange juice.',
          accepted: ['¿Tienen jugo de naranja?'],
          hint: 'Start with Tienen, then the drink, inside ¿ and ?.',
          explanation: '¿Tienen jugo de naranja? No un is needed when you ask if they have it.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the customer want?',
          audio: 'Dos tés con leche, por favor.',
          options: ['Two teas with milk', 'Two coffees with milk', 'A tea without milk'],
          answer: 0,
          explanation: 'Dos tés con leche: two teas with milk.',
        },
        {
          kind: 'speak',
          prompt: 'Order a drink with one change, then ask if they have something else.',
          lines: ['¿Me das un café con leche, por favor?', '¿Tienen jugo de naranja?'],
          mission: {
            checks: ['Use con or sin for your change.', 'Ask what they have with ¿Tienen…?'],
            twist: 'Now order for you and a friend: two drinks, one without sugar.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u6-talk',
      session: 'Real talk',
      title: 'Order, check and pay',
      outcome: 'Answer the barista’s questions, fix a mistake in your order and pay.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'One coffee, not two',
          intro:
            'Omar orders at the counter. The barista mishears him, so he corrects the order before paying.',
          lines: [
            { speaker: 'Omar', text: 'Un americano, por favor.', meaning: 'An americano, please.' },
            {
              speaker: 'Barista',
              text: '¿Dos americanos?',
              meaning: 'Two americanos?',
            },
            {
              speaker: 'Omar',
              text: 'No, solo uno, por favor.',
              meaning: 'No, just one, please.',
            },
            {
              speaker: 'Barista',
              text: 'Perfecto. ¿Algo más?',
              meaning: 'Perfect. Anything else?',
            },
            {
              speaker: 'Omar',
              text: 'No, es todo. ¿Cuánto es?',
              meaning: 'No, that’s all. How much is it?',
            },
            {
              speaker: 'Barista',
              text: 'Son cuarenta y cinco pesos.',
              meaning: 'That’s forty-five pesos.',
            },
          ],
          note: 'Solo uno fixes the number without repeating the whole order. Son introduces a price: son cuarenta y cinco pesos.',
        },
        {
          kind: 'teach',
          title: 'At the counter',
          items: [
            {
              target: '¿Algo más?',
              meaning: 'Anything else?',
              note: 'The question you will hear before you pay.',
            },
            { target: 'No, es todo.', meaning: 'No, that’s all.' },
            {
              target: '¿Cuánto es?',
              meaning: 'How much is it?',
              note: 'Cuánto has an accent because it asks a question.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'The barista asks “¿Algo más?” You don’t want anything else. What do you say?',
          options: ['No, es todo.', 'Para llevar.', 'Sí, por favor.'],
          answer: 0,
          explanation: 'No, es todo: no, that’s all. Then you can ask ¿Cuánto es?',
        },
        {
          kind: 'type',
          prompt: 'Listen to the price. Type the number of pesos.',
          audio: 'Son sesenta y ocho pesos.',
          answerKind: 'digits',
          accepted: ['68'],
          hint: 'Sesenta is 60. Listen for the last number.',
          explanation: 'Sesenta y ocho is 68. Remember sesenta is 60 and setenta is 70.',
        },
        {
          kind: 'rule',
          title: 'Fix it in a few words',
          body: 'If an order comes back wrong, fix just the part that changed. No, solo uno fixes a number; no, sin azúcar fixes a detail. You do not need a whole sentence.',
          examples: ['No, solo uno, por favor.', 'No, sin azúcar, por favor.'],
        },
        {
          kind: 'choose',
          prompt: 'You ordered one tea. The barista says “¿Dos tés?” Fix it.',
          options: ['No, solo uno, por favor.', 'Sí, dos.', 'No, es todo.'],
          answer: 0,
          explanation: 'Solo uno: just one. Es todo would mean you want nothing else.',
        },
        {
          kind: 'teach',
          title: 'Pay',
          items: [
            {
              target: 'La cuenta, por favor.',
              meaning: 'The bill, please.',
              note: 'At a table. At a counter you usually pay when you order.',
            },
            {
              target: '¿Puedo pagar con tarjeta?',
              meaning: 'Can I pay by card?',
              note: 'Pagar en efectivo is to pay in cash.',
            },
          ],
        },
        {
          kind: 'match',
          prompt: 'Match each question to its answer.',
          pairs: [
            ['¿Algo más?', 'No, es todo.'],
            ['¿Cuánto es?', 'Son cuarenta pesos.'],
            ['¿Para aquí o para llevar?', 'Para llevar.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the customer ask?',
          audio: '¿Puedo pagar con tarjeta?',
          options: ['If they can pay by card', 'How much it is', 'For the bill'],
          answer: 0,
          explanation: '¿Puedo pagar con tarjeta? asks to pay by card.',
        },
        {
          kind: 'speak',
          prompt:
            'You order one americano. The barista repeats it as two. Correct the order, say that is all, ask the price and ask to pay by card.',
          lines: [
            'No, solo uno, por favor.',
            'No, es todo. ¿Cuánto es?',
            '¿Puedo pagar con tarjeta?',
          ],
          mission: {
            checks: ['Fix only the part that was wrong.', 'Ask the price.', 'Ask how to pay.'],
            twist: 'Now the barista adds sugar you did not want. Fix it with sin.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u6-task',
      session: 'Exam task',
      title: 'Which order is theirs?',
      outcome: 'Read a café menu, follow an order you hear and work out the total.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'Menus and orders',
          body: 'DELE A1 listening includes short everyday exchanges where you pick the right option, such as the right order or picture. Here you practise with a menu and orders you have not heard before. This is practice towards that task, not an exam score.',
        },
        {
          kind: 'choose',
          context:
            'MENÚ\nCafé americano · 35 pesos\nCafé con leche · 40 pesos\nTé · 30 pesos\nJugo de naranja · 45 pesos\nConcha · 25 pesos',
          prompt: 'How much is an orange juice?',
          options: ['45 pesos', '40 pesos', '25 pesos'],
          answer: 0,
          explanation: 'Jugo de naranja · 45 pesos.',
        },
        {
          kind: 'choose',
          context:
            'MENÚ\nCafé americano · 35 pesos\nCafé con leche · 40 pesos\nTé · 30 pesos\nJugo de naranja · 45 pesos\nConcha · 25 pesos',
          prompt: 'You order a té and a concha. What is the total?',
          options: ['55 pesos', '65 pesos', '45 pesos'],
          answer: 0,
          explanation: 'Té 30 + concha 25 = 55 pesos, cincuenta y cinco.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which order is it?',
          audio: 'Un café con leche sin azúcar y dos galletas, para llevar.',
          options: [
            'A white coffee without sugar and two biscuits, to take away',
            'A black coffee with sugar and one biscuit, for here',
            'Two coffees with milk, to take away',
          ],
          answer: 0,
          explanation: 'Con leche sin azúcar, dos galletas, para llevar.',
        },
        {
          kind: 'type',
          prompt: 'Listen to the total. Type the number of pesos.',
          audio: 'Son noventa pesos.',
          answerKind: 'digits',
          accepted: ['90'],
          hint: 'Noventa is one of the tens from Unit 3.',
          explanation: 'Noventa is 90.',
        },
        {
          kind: 'type',
          prompt: 'Write an order: a tea with milk, please.',
          accepted: ['Un té con leche, por favor.', 'Un té con leche por favor.'],
          hint: 'Un té + con leche + por favor.',
          explanation: 'Un té con leche, por favor. Keep the accent on té.',
        },
        {
          kind: 'speak',
          prompt:
            'Order for yourself and a friend from the menu: two different drinks, one change with con or sin, and one thing to eat. Then ask the price and say whether you are staying.',
          lines: [
            'Un café americano y un té con leche, por favor.',
            'Y una concha.',
            '¿Cuánto es?',
            'Para aquí, gracias.',
          ],
          mission: {
            checks: [
              'Order two drinks and one thing to eat.',
              'Make one change with con or sin.',
              'Ask the price and say if you stay.',
            ],
            twist:
              'The café has no conchas today. Ask what they have with ¿Tienen…? and choose something else.',
          },
        },
      ],
    },
  ],
);
