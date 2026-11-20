import { defineUnit } from './types';

// A Saturday market in Mexico City: ask for amounts and prices, check the unit, change one item,
// turn down an offer and pay. Exact phrases from the retired starter market lesson (¿Me da un
// kilo de jitomates?, Medio kilo, por favor., Nada más, gracias.) keep their earned review
// intervals; ¿Algo más? and ¿Cuánto es? are Unit 6's.

const sentence = (text: string) =>
  text.replace(/^(¿?)(.)/, (_, mark: string, first: string) => mark + first.toLocaleUpperCase());

/** A question with the greetings and polite words the course teaches: Hola, a greeting for the
 *  time of day, Disculpe or Perdón first; por favor first or last; gracias last. Por favor is
 *  said once. A question can start with what it is about: 'los huevos, ¿cuánto cuestan'. */
const politely = (...questions: string[]) =>
  questions.flatMap((question) => {
    const [topic, ask] = question.includes('¿') ? question.split(/,? ¿/) : ['', question];
    return ['', 'Hola', 'Buenos días', 'Buenas tardes', 'Buenas noches', 'Disculpe', 'Perdón']
      .flatMap((opener) =>
        ['', 'por favor'].flatMap((please) =>
          ['', ', por favor', ', gracias', ', por favor, gracias'].map((ending) => {
            const lead = [opener, please, topic].filter(Boolean).join(', ');
            return lead ? `${sentence(lead)}, ¿${ask}${ending}?` : `¿${sentence(ask)}${ending}?`;
          }),
        ),
      )
      .filter((asked) => (asked.match(/por favor/gi) ?? []).length < 2);
  });

/** The price questions the unit teaches: cuesta for one thing, cuestan for several, and the
 *  market's ¿A cómo está…?, so a typed price question accepts each of them. */
const priceOf = (thing: string, plural = false) =>
  politely(
    `cuánto ${plural ? 'cuestan' : 'cuesta'} ${thing}`,
    `a cómo ${plural ? 'están' : 'está'} ${thing}`,
  );

/** Every way the unit teaches to ask for an amount at the scales: on its own, with Quiero or
 *  ¿Me da…?, with por favor, gracias or muchas gracias; after Es mucho, No, No está bien, Así no
 *  or Disculpe, or followed by Es mucho. */
const atTheScales = (...amounts: string[]) => {
  const thanks = [
    ', por favor',
    '',
    ', gracias',
    ', muchas gracias',
    ', por favor, gracias',
    ', por favor, muchas gracias',
  ];
  const asks = amounts.flatMap((amount) => [
    ...thanks.map((ending) => `${amount}${ending}.`),
    `por favor, ${amount}.`,
    ...thanks.map((ending) => `quiero ${amount}${ending}.`),
    `¿me da ${amount}?`,
    `¿me da ${amount}, por favor?`,
  ]);
  const openers = [
    '',
    'Es mucho. ',
    'Es mucho queso. ',
    'No, ',
    'No, es mucho. ',
    'Disculpe, ',
    'No está bien. ',
    'No, no está bien. ',
    'Así no. ',
    'No, así no. ',
  ];
  return [
    ...openers.flatMap((opener) =>
      asks.map((ask) =>
        !opener || opener.endsWith('. ') ? `${opener}${sentence(ask)}` : `${opener}${ask}`,
      ),
    ),
    ...asks.flatMap((ask) => [`${sentence(ask)} Es mucho.`, `${sentence(ask)} Es mucho queso.`]),
  ];
};

const marketSigns =
  'LETREROS DEL MERCADO\nFrutas y verduras\nQuesos y crema\nPanadería\nOferta · aguacate · 75 pesos el kilo\nAguacate · 20 pesos la pieza\nHuevo · 4 pesos la pieza';

export const spanishA1Unit7 = defineUnit(
  'ES',
  'A1',
  {
    id: 'es-a1-u7',
    number: 7,
    icon: 'basket-outline',
    title: 'At the market',
    canDo: 'Ask for amounts and prices at a market, check what you owe and pay.',
  },
  [
    {
      id: 'es-a1-u7-words',
      session: 'Words',
      title: 'Fill a shopping bag',
      outcome: 'Ask for fruit, cheese and milk by the kilo or the litre, and understand the total.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'Saturday at the market',
          intro:
            'On Saturday morning Ana buys food for the language exchange’s snack table at a market in Mexico City. Listen to how she asks at the fruit and vegetable stall.',
          lines: [
            {
              speaker: 'Vendedor',
              text: 'Buenos días. ¿Qué le damos?',
              meaning: 'Good morning. What can we get you?',
              real: 'Buenos días, güera. ¿Qué le damos?',
              realMeaning: 'Morning, miss. What can we get you?',
            },
            {
              speaker: 'Ana',
              text: '¿Me da un kilo de jitomates, por favor?',
              meaning: 'Can I have a kilo of tomatoes, please?',
            },
            {
              speaker: 'Vendedor',
              text: 'Claro. ¿Algo más?',
              meaning: 'Sure. Anything else?',
              real: 'Sale. ¿Qué más le doy?',
              realMeaning: 'OK. What else can I get you?',
            },
            {
              speaker: 'Ana',
              text: 'Medio kilo de plátanos y tres aguacates.',
              meaning: 'Half a kilo of bananas and three avocados.',
            },
            {
              speaker: 'Vendedor',
              text: 'Aquí tiene. ¿Le doy una bolsa?',
              meaning: 'Here you are. Shall I give you a bag?',
            },
            {
              speaker: 'Ana',
              text: 'Sí, por favor. ¿Cuánto es?',
              meaning: 'Yes, please. How much is it?',
            },
            {
              speaker: 'Vendedor',
              text: 'Son ciento veinte pesos.',
              meaning: 'That’s a hundred and twenty pesos.',
              real: 'Ciento veinte, güera.',
              realMeaning: 'A hundred and twenty, miss.',
            },
          ],
          note: 'Sellers use usted with customers: ¿Qué le damos? means what can we get you. Güera is a friendly way Mexican market sellers call to a woman, whatever her hair colour; joven is used for a young customer. Sale is an informal Mexican OK. ¿Le doy una bolsa? asks if you want a bag (una bolsa). In Mexico the red tomato is a jitomate.',
        },
        {
          kind: 'teach',
          title: 'At the fruit stall',
          items: [
            {
              target: 'el jitomate',
              meaning: 'the red tomato (Mexico)',
              note: 'In Mexico tomate often means the green tomatillo; in Spain and much of Latin America the red one is el tomate.',
            },
            {
              target: 'el aguacate',
              meaning: 'the avocado',
              note: 'Sold by the kilo or by the piece.',
            },
            {
              target: 'el plátano',
              meaning: 'the banana',
              note: 'The stress is on the first syllable: PLÁ-ta-no. In Argentina it is la banana.',
            },
            {
              target: 'el queso',
              meaning: 'the cheese',
              note: 'Queso starts with a k sound and the u is silent: KE-so.',
            },
          ],
        },
        {
          kind: 'rule',
          title: '¿Me da…?, an amount, then de',
          body: 'Each part works on its own. ¿Me da…? is Unit 6’s ¿Me das…? said with usted, the polite way to ask a seller. Then say the amount, then de, then the food; at a stall you can also say just the amount and the food. When you mean that food in general, not one you are pointing at, there is no el or la after de. Fruit and vegetables you can count usually go in the plural, though in Mexico you will also hear the singular: un kilo de jitomate.',
          table: [
            ['¿Me da…?', 'can I have…? (usted)'],
            ['un kilo de', 'a kilo of'],
            ['medio kilo de', 'half a kilo of'],
            ['jitomates', 'tomatoes (red; Mexico)'],
          ],
          examples: ['¿Me da un kilo de jitomates?', 'Medio kilo de plátanos.'],
        },
        {
          kind: 'match',
          prompt: 'Match each part to the English.',
          pairs: [
            ['¿Me da…?', 'Can I have…?'],
            ['un kilo de', 'a kilo of'],
            ['el jitomate', 'the red tomato'],
            ['el aguacate', 'the avocado'],
            ['el plátano', 'the banana'],
            ['el queso', 'the cheese'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'You want half a kilo of bananas. Which one is right?',
          options: [
            'Medio kilo de plátanos.',
            'Medio kilos de plátanos.',
            'Media kilo de plátanos.',
          ],
          answer: 0,
          explanation:
            'Kilo is masculine and there is one kilo, so medio kilo, not media kilo or medio kilos: medio kilo de plátanos.',
        },
        {
          kind: 'teach',
          title: 'Ask for an amount',
          items: [
            {
              target: '¿Me da un kilo de jitomates?',
              meaning: 'Can I have a kilo of tomatoes?',
              note: 'The parts you have just matched, together: ¿Me da…? + un kilo de + jitomates.',
            },
            {
              target: 'Medio kilo, por favor.',
              meaning: 'Half a kilo, please.',
              note: 'Medio means half. It usually goes without un: medio kilo. In Mexico you will also hear un medio kilo.',
            },
            {
              target: 'un litro de leche',
              meaning: 'a litre of milk',
              note: 'Milk and other drinks go by the litro, with the same de: un litro de leche.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the customer want?',
          audio: 'Un kilo de plátanos y medio kilo de queso.',
          options: [
            'A kilo of bananas and half a kilo of cheese',
            'Half a kilo of bananas and a kilo of cheese',
            'A kilo of bananas and a litre of milk',
          ],
          answer: 0,
          explanation: 'Un kilo de plátanos, then medio kilo de queso.',
        },
        {
          kind: 'rule',
          title: 'Past one hundred',
          body: 'Exactly one hundred is cien, also before a noun: cien pesos. From one hundred and one to one hundred and ninety-nine, say ciento and then the rest, with no y after ciento. The y only joins tens and units, as in Unit 3: ciento cincuenta y cinco.',
          table: [
            ['100', 'cien'],
            ['101', 'ciento uno'],
            ['120', 'ciento veinte'],
            ['155', 'ciento cincuenta y cinco'],
            ['199', 'ciento noventa y nueve'],
          ],
          examples: ['cien pesos', 'ciento veinte pesos'],
        },
        {
          kind: 'teach',
          title: 'The total',
          items: [
            {
              target: 'ciento veinte',
              meaning: 'a hundred and twenty (120)',
              note: 'Ciento, then the rest. One hundred on its own is cien.',
            },
          ],
        },
        {
          kind: 'type',
          prompt: 'Listen to the price. Type the number of pesos.',
          audio: 'Son ciento quince pesos.',
          answerKind: 'digits',
          accepted: ['115', '115 pesos'],
          hint: 'Ciento is a hundred and something. Quince is from Unit 3.',
          explanation: 'Ciento quince is 115: ciento, then quince.',
        },
        {
          kind: 'type',
          prompt: 'Ask for half a kilo of avocados: ¿Me da…?, then the amount and the food.',
          accepted: ['medio kilo', 'un medio kilo']
            .flatMap((amount) => [`${amount} de aguacates`, `${amount} de aguacate`])
            .flatMap((amount) =>
              politely(
                `me da ${amount}`,
                `me da usted ${amount}`,
                `me da por favor ${amount}`,
                `me da usted por favor ${amount}`,
              ),
            ),
          hint: 'Me da + medio kilo + de + aguacates.',
          explanation:
            '¿Me da medio kilo de aguacates? Medio kilo usually goes without un, and de joins the amount to the food.',
        },
        {
          kind: 'build',
          prompt: 'Ask for a litre of milk, politely.',
          answer: ['¿Me', 'da', 'un', 'litro', 'de', 'leche,', 'por', 'favor?'],
          extra: ['la'],
          also: [
            'Por favor, ¿me da un litro de leche?',
            '¿Me da por favor un litro de leche?',
            '¿Me da un litro de leche?',
            'Un litro de leche, por favor.',
            'Por favor, un litro de leche.',
            'Un litro de leche, ¿me da?',
            'Un litro de leche, ¿me da, por favor?',
            'Un litro de leche, por favor, ¿me da?',
            'Por favor, un litro de leche, ¿me da?',
          ],
          explanation: 'Un litro de leche: de joins the amount to the milk, with no la.',
        },
        {
          kind: 'choose',
          prompt: 'The seller asks “¿Algo más?” You have everything you need. What do you say?',
          options: ['No, es todo.', 'Sí, por favor.', 'Medio kilo, por favor.'],
          answer: 0,
          explanation:
            'No, es todo, from Unit 6, says that’s all. Sí, por favor or another amount would mean you want more.',
        },
        {
          kind: 'speak',
          prompt:
            'The seller asks “¿Qué le damos?” Ask for a kilo of tomatoes and half a kilo of avocados, then answer when the seller asks “¿Algo más?”',
          lines: [
            '¿Me da un kilo de jitomates, por favor?',
            'Y medio kilo de aguacates.',
            'No, es todo, gracias.',
          ],
          tip: 'Jitomates starts with a breathy j, like a strong h, and the stress falls on MA: ji-to-MA-tes.',
          mission: {
            checks: [
              'Ask with ¿Me da…? and an amount.',
              'Join the amount to the food with de.',
              'Answer ¿Algo más?',
            ],
            twist:
              'Now you are at the cheese stall. Ask for half a kilo of cheese and a litre of milk, and say yes to a bag.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u7-grammar',
      session: 'Grammar',
      title: 'How much, how many?',
      outcome:
        'Ask what one thing or several things cost, say how many you want, and ask for a little more or less.',
      minutes: 8,
      steps: [
        {
          kind: 'scene',
          title: 'At the cheese stall',
          intro:
            'Omar goes to the cheese and dairy stall. Listen to how he asks the price and gets the amount he wants.',
          lines: [
            {
              speaker: 'Vendedora',
              text: 'Buenos días. ¿Qué va a llevar?',
              meaning: 'Good morning. What would you like?',
              real: 'Buenos días, joven. ¿Qué va a llevar?',
              realMeaning: 'Morning, young man. What would you like?',
            },
            {
              speaker: 'Omar',
              text: '¿Cuánto cuesta el queso?',
              meaning: 'How much is the cheese?',
              real: '¿A cómo está el queso?',
              realMeaning: 'What’s the cheese going for?',
            },
            {
              speaker: 'Vendedora',
              text: 'Ciento cuarenta pesos el kilo.',
              meaning: 'A hundred and forty pesos a kilo.',
              real: 'A ciento cuarenta el kilo.',
            },
            { speaker: 'Omar', text: 'Medio kilo, por favor.', meaning: 'Half a kilo, please.' },
            {
              speaker: 'Vendedora',
              text: '¿Así está bien?',
              meaning: 'Is this all right?',
            },
            {
              speaker: 'Omar',
              text: 'Es mucho. Un poco menos, por favor.',
              meaning: 'That’s a lot. A little less, please.',
            },
            {
              speaker: 'Vendedora',
              text: 'Listo. ¿Algo más?',
              meaning: 'Done. Anything else?',
            },
            {
              speaker: 'Omar',
              text: 'Sí, huevos, por favor.',
              meaning: 'Yes, eggs, please.',
            },
            {
              speaker: 'Vendedora',
              text: '¿Cuántos quiere?',
              meaning: 'How many would you like?',
            },
            { speaker: 'Omar', text: 'Doce, por favor.', meaning: 'Twelve, please.' },
          ],
          note: 'At a Mexican market you will often hear ¿A cómo está…? for the price, and a price with el kilo after it is per kilo. Joven is a friendly way sellers call to a young customer.',
        },
        {
          kind: 'teach',
          title: 'Ask the price',
          items: [
            {
              target: '¿Cuánto cuesta el queso?',
              meaning: 'How much is the cheese?',
              note: 'Cuesta for one thing. At a market you will also hear ¿A cómo está el queso?',
            },
            {
              target: '¿Cuánto cuestan los aguacates?',
              meaning: 'How much are the avocados?',
              note: 'Cuestan for several things.',
            },
            { target: 'la manzana', meaning: 'the apple', note: 'Several: las manzanas.' },
            {
              target: 'los huevos',
              meaning: 'the eggs',
              note: 'In Mexico eggs are often sold by the kilo: un kilo de huevo. Elsewhere you buy una docena, a dozen.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'Cuesta or cuestan',
          body: 'Ask about one thing, or one amount such as el kilo, with cuesta. Ask about several things with cuestan. The thing usually comes after the verb, with el, la, los or las. For the total of everything you buy, use ¿Cuánto es? from Unit 6.',
          table: [
            ['¿Cuánto cuesta…?', 'el queso, la manzana, el kilo'],
            ['¿Cuánto cuestan…?', 'los aguacates, las manzanas, los huevos'],
          ],
          examples: ['¿Cuánto cuesta el kilo?', '¿Cuánto cuestan los huevos?'],
        },
        {
          kind: 'choose',
          prompt: 'You want to know the price of the apples. Which question is right?',
          options: [
            '¿Cuánto cuestan las manzanas?',
            '¿Cuánto cuesta las manzanas?',
            '¿Cuántas cuestan las manzanas?',
          ],
          answer: 0,
          explanation: 'Las manzanas are several, so cuestan. Cuántas asks how many, not how much.',
        },
        {
          kind: 'type',
          prompt: 'Ask how much the eggs cost: ¿Cuánto…? with los huevos.',
          accepted: [
            ...priceOf('los huevos', true),
            ...priceOf('los huevos por kilo', true),
            ...[
              'el kilo de huevo',
              'el kilo de huevos',
              'un kilo de huevo',
              'un kilo de huevos',
              'el huevo',
              'el huevo por kilo',
            ].flatMap((thing) => priceOf(thing)),
            // The eggs first, Y to go on from the last question, or por favor inside the question.
            ...politely(
              ...['', ' por kilo'].flatMap((per) => [
                `los huevos, ¿cuánto cuestan${per}`,
                `los huevos, ¿a cómo están${per}`,
                `y los huevos, ¿cuánto cuestan${per}`,
                `y cuánto cuestan los huevos${per}`,
                `cuánto cuestan, por favor, los huevos${per}`,
                `cuánto, por favor, cuestan los huevos${per}`,
              ]),
              ...['el huevo', 'el kilo de huevo'].flatMap((thing) => [
                `${thing}, ¿cuánto cuesta`,
                `${thing}, ¿a cómo está`,
              ]),
            ),
          ],
          hint: 'Several eggs, so cuestan + los huevos.',
          explanation:
            '¿Cuánto cuestan los huevos? In Mexico you can also ask about the kilo: ¿Cuánto cuesta el kilo de huevo?',
        },
        {
          kind: 'rule',
          title: 'How much, how many',
          body: 'Before a food, cuánto matches it, like the describing words in Unit 5: cuánto and cuánta ask how much, cuántos and cuántas ask how many. It matches the same way when the food is understood, as in ¿Cuántos quiere? You already know ¿Cuántos años tienes? To ask a price it is always cuánto: ¿Cuánto cuesta la leche? ¿Cuánto cuestan las manzanas? When they ask a question, all four forms carry an accent.',
          table: [
            ['cuánto queso', 'how much cheese (masculine)'],
            ['cuánta leche', 'how much milk (feminine)'],
            ['cuántos huevos', 'how many eggs (masculine)'],
            ['cuántas manzanas', 'how many apples (feminine)'],
          ],
          examples: ['¿Cuántos aguacates?', '¿Cuántas manzanas?'],
        },
        {
          kind: 'teach',
          title: 'At the scales',
          items: [
            {
              target: '¿Cuántos quiere?',
              meaning: 'How many would you like?',
              note: 'The seller asks with usted. About something feminine: ¿Cuántas quiere?',
            },
            {
              target: 'Es mucho.',
              meaning: 'That’s a lot. / That’s too much.',
              note: 'Say it while the seller weighs, or about a price.',
            },
            { target: 'Un poco más, por favor.', meaning: 'A little more, please.' },
            { target: 'Un poco menos, por favor.', meaning: 'A little less, please.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete the seller’s question: “¿___ manzanas quiere?”',
          options: ['Cuántas', 'Cuántos', 'Cuánta'],
          answer: 0,
          explanation: 'Manzanas is feminine and plural, so cuántas.',
        },
        {
          kind: 'build',
          prompt: 'Build the seller’s question: How many avocados would you like?',
          answer: ['¿Cuántos', 'aguacates', 'quiere?'],
          extra: ['¿Cuántas', 'cuesta'],
          explanation: 'Aguacates is masculine and plural, so cuántos.',
        },
        {
          kind: 'rule',
          title: 'Mucho and poco',
          body: 'Es mucho and un poco más or un poco menos are fixed chunks: use them as they are while the seller weighs. Before a noun, mucho and poco match it like other describing words: mucha leche, muchas manzanas, pocos huevos.',
          table: [
            ['Es mucho.', 'That’s a lot.'],
            ['Es poco.', 'That’s not much.'],
            ['un poco más', 'a little more'],
            ['un poco menos', 'a little less'],
          ],
          examples: ['Es mucho. Un poco menos, por favor.'],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the customer want?',
          audio: 'Es poco. Un poco más, por favor.',
          options: ['A little more', 'A little less', 'Half a kilo more'],
          answer: 0,
          explanation: 'Un poco más: a little more. Es poco means it is not much.',
        },
        {
          kind: 'type',
          prompt:
            'The seller puts too much cheese on the scales. Ask for a little less with un poco menos.',
          accepted: atTheScales(
            'un poco menos',
            'un poquito menos',
            'un poco menos de queso',
            'un poquito menos de queso',
            'menos',
            'menos queso',
          ),
          hint: 'Un poco + menos + por favor.',
          explanation: 'Un poco menos, por favor. You can start with Es mucho.',
        },
        {
          kind: 'type',
          prompt: 'Listen. How much is a kilo of cheese? Type the number of pesos.',
          audio: 'El kilo de queso cuesta ciento sesenta pesos.',
          answerKind: 'digits',
          accepted: ['160', '160 pesos'],
          hint: 'Ciento, then a ten. Sesenta is 60; setenta is 70.',
          explanation: 'Ciento sesenta is 160.',
        },
        {
          kind: 'speak',
          prompt:
            'At the cheese stall: ask what the cheese costs, ask for half a kilo, then ask for a little less when the seller weighs it.',
          lines: [
            '¿Cuánto cuesta el queso?',
            'Medio kilo, por favor.',
            'Es mucho. Un poco menos, por favor.',
          ],
          mission: {
            checks: [
              'Use cuesta for one thing.',
              'Ask for an amount.',
              'Ask for a little more or less.',
            ],
            twist:
              'Now you are at the fruit stall. Ask what the apples cost, answer ¿Cuántas quiere? with a number, and ask for a little more.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u7-talk',
      session: 'Real talk',
      title: 'A different price',
      outcome:
        'Ask for a price again, check the unit, change one thing, turn down an offer and pay.',
      minutes: 8,
      steps: [
        {
          kind: 'scene',
          title: 'Say that again',
          intro:
            'Back at the fruit stall, Omar wants avocados. The seller answers fast, so Omar checks the price and the unit before he buys.',
          lines: [
            {
              speaker: 'Omar',
              text: '¿Cuánto cuestan los aguacates?',
              meaning: 'How much are the avocados?',
              real: '¿A cómo están los aguacates?',
              realMeaning: 'What are the avocados going for?',
            },
            {
              speaker: 'Vendedor',
              text: 'Noventa pesos.',
              meaning: 'Ninety pesos.',
              real: 'A noventa, joven.',
              realMeaning: 'Ninety, young man.',
            },
            { speaker: 'Omar', text: '¿Cuánto, perdón?', meaning: 'Sorry, how much?' },
            { speaker: 'Vendedor', text: 'Noventa.', meaning: 'Ninety.' },
            { speaker: 'Omar', text: '¿Es por kilo?', meaning: 'Is that per kilo?' },
            {
              speaker: 'Vendedor',
              text: 'Sí, el kilo. ¿Cuánto le doy?',
              meaning: 'Yes, a kilo. How much shall I give you?',
            },
            {
              speaker: 'Omar',
              text: 'Un kilo. No, mejor medio kilo.',
              meaning: 'A kilo. No, make it half a kilo.',
            },
          ],
          note: '¿Cuánto, perdón? asks for a price again; ¿Puede repetir, por favor? from Unit 1 is the careful way. Mejor and the new amount changes your mind: mejor medio kilo, make it half a kilo.',
        },
        {
          kind: 'teach',
          title: 'Check before you buy',
          items: [
            {
              target: '¿Cuánto, perdón?',
              meaning: 'Sorry, how much?',
              note: 'Quick and natural when a price goes by too fast.',
            },
            {
              target: '¿Es por kilo?',
              meaning: 'Is it per kilo?',
              note: 'Some things are sold by the piece instead: por pieza.',
            },
            {
              target: 'Mejor medio kilo.',
              meaning: 'Make it half a kilo.',
              note: 'Mejor and the new amount or thing changes one item on your list.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'The seller says a price too fast for you. What do you say?',
          options: ['¿Cuánto, perdón?', '¿Es por kilo?', 'Mejor medio kilo.'],
          answer: 0,
          explanation:
            '¿Cuánto, perdón? asks for the price again. ¿Es por kilo? checks the unit once you have the number.',
        },
        {
          kind: 'type',
          prompt:
            'The seller says “Noventa.” Check, with por kilo, that the price is for one kilo.',
          // With an amount of pesos the usual verb is son (¿Son noventa por kilo?); es is also
          // right when the price is what you ask about (el precio es noventa).
          accepted: [
            'es por kilo',
            'por kilo',
            'por kilo es',
            'por el kilo es',
            'por un kilo es',
            'son por kilo',
            'es el kilo',
            'es por el kilo',
            'por el kilo',
            'es por un kilo',
            'por un kilo',
            'es por kilo o por pieza',
            'por kilo o por pieza',
            'es por pieza o por kilo',
            'por pieza o por kilo',
            'es por kilo de aguacates',
            'es por kilo de aguacate',
            'cuánto es por kilo',
            'el kilo',
            'cuánto cuesta el kilo',
            'a cómo está el kilo',
            ...['noventa', 'noventa pesos'].flatMap((price) => [
              ...['', 'son ', 'es ', 'a '].flatMap((verb) =>
                ['por kilo', 'el kilo', 'por el kilo', 'por un kilo'].map(
                  (unit) => `${verb}${price} ${unit}`,
                ),
              ),
              ...['por kilo', 'por el kilo'].map((unit) => `${price} son ${unit}`),
              `el kilo cuesta ${price}`,
              `cuesta ${price} el kilo`,
            ]),
            // Two questions: the price said back, then the check, or the other way round.
            ...[
              'es por kilo',
              'es por el kilo',
              'es por un kilo',
              'por kilo',
              'por el kilo',
              'por un kilo',
            ].flatMap((unit) => [
              ...[
                'noventa',
                'noventa pesos',
                'noventa, perdón',
                'noventa pesos, perdón',
                'son noventa',
              ].map((price) => `${price}? ¿${sentence(unit)}`),
              ...['noventa', 'noventa pesos'].map((price) => `${unit}? ¿${sentence(price)}`),
            ]),
            ...['noventa', 'noventa pesos'].map((price) => `${price}? ¿Por kilo es`),
          ]
            .flatMap((check) => [
              `¿${sentence(check)}?`,
              `¿${sentence(check)}, perdón?`,
              `¿${sentence(check)}, por favor?`,
              `Perdón, ¿${check}?`,
              `Disculpe, ¿${check}?`,
              `Por favor, ¿${check}?`,
            ])
            .filter((check) => (check.match(/perdón/gi) ?? []).length < 2),
          hint: 'Es + por + kilo, as a question.',
          explanation:
            '¿Es por kilo? checks the unit. With the price in it, son is the usual verb, as in Son ciento veinte pesos: ¿Son noventa pesos por kilo? The answer might be sí, el kilo, or no, por pieza.',
        },
        {
          kind: 'choose',
          prompt: 'You asked for a kilo of apples, but half a kilo is enough. What do you say?',
          options: ['Mejor medio kilo.', 'Medio kilo más.', 'Un poco más, por favor.'],
          answer: 0,
          explanation:
            'Mejor medio kilo changes your kilo to half a kilo. Medio kilo más would add another half kilo.',
        },
        {
          kind: 'type',
          prompt:
            'You have just asked for a kilo of tomatoes, and the seller is weighing them. Change it to half a kilo: Mejor, then the new amount.',
          accepted: ['medio kilo', 'un medio kilo']
            .flatMap((amount) => [amount, `${amount} de jitomates`, `${amount} de jitomate`])
            .flatMap((amount) => [
              amount,
              `solo ${amount}`,
              `quiero ${amount}`,
              `solo quiero ${amount}`,
            ])
            .flatMap((change) => [
              ...[
                '',
                'No, ',
                'Perdón, ',
                'Disculpe, ',
                'No, perdón, ',
                'No, disculpe, ',
                'No un kilo, ',
                'No, un kilo no, ',
                'Está bien, ',
                'Por favor, ',
                'Por favor, no, ',
                'No, por favor, ',
                'Perdón, por favor, ',
                'Disculpe, por favor, ',
                'No, perdón, por favor, ',
                'No, disculpe, por favor, ',
              ].flatMap((opener) =>
                ['.', ', por favor.', ', gracias.', ', perdón.'].map(
                  (ending) => `${opener}${opener ? 'mejor' : 'Mejor'} ${change}${ending}`,
                ),
              ),
              ...['.', ', gracias.', ', perdón.'].map(
                (ending) => `Mejor, por favor, ${change}${ending}`,
              ),
              `Mejor ${change}, está bien.`,
              ...['', 'Por favor, '].flatMap((opener) =>
                ['.', ', por favor.', ', gracias.'].map(
                  (ending) =>
                    `${opener}${opener ? 'mejor' : 'Mejor'} ${change}, no un kilo${ending}`,
                ),
              ),
            ])
            // A greeting or thanks may come before Mejor or Por favor, as in the unit's other typed
            // requests.
            .flatMap((change) => [
              change,
              ...(/^(Mejor|Por favor, mejor)/.test(change) && !change.endsWith('perdón.')
                ? [
                    'Hola',
                    'Buenos días',
                    'Buenas tardes',
                    'Buenas noches',
                    'Gracias',
                    'Muchas gracias',
                  ].map((lead) => `${lead}, ${change[0].toLocaleLowerCase()}${change.slice(1)}`)
                : []),
            ])
            .filter(
              (change) =>
                (change.match(/por favor/gi) ?? []).length < 2 &&
                (change.match(/gracias/gi) ?? []).length < 2,
            ),
          hint: 'Mejor + medio kilo.',
          explanation:
            'Mejor medio kilo. Mejor changes one item without repeating the whole order.',
        },
        {
          kind: 'scene',
          title: 'Anything else?',
          intro: 'The seller offers Omar something more, and Omar pays with a big note.',
          lines: [
            {
              speaker: 'Vendedor',
              text: '¿Unos plátanos? Están muy buenos.',
              meaning: 'Some bananas? They’re very good.',
              real: '¿No va a querer plátanos? Están bien buenos.',
              realMeaning: 'Won’t you have some bananas? They’re really good.',
            },
            { speaker: 'Omar', text: 'Ahorita no, gracias.', meaning: 'Not right now, thanks.' },
            { speaker: 'Vendedor', text: '¿Algo más?', meaning: 'Anything else?' },
            {
              speaker: 'Omar',
              text: 'Nada más, gracias. ¿Tiene cambio de quinientos?',
              meaning: 'That’s all, thanks. Do you have change for five hundred?',
            },
            {
              speaker: 'Vendedor',
              text: 'Sí, claro. Son cuarenta y cinco.',
              meaning: 'Yes, of course. That’s forty-five.',
            },
          ],
          note: 'Bien buenos is an everyday Mexican way to say very good. ¿Tiene cambio de quinientos? asks if they can change a five-hundred-peso note.',
        },
        {
          kind: 'teach',
          title: 'Say no, and pay',
          items: [
            {
              target: 'Ahorita no, gracias.',
              meaning: 'Not right now, thanks.',
              note: 'The everyday Mexican way to turn down an offer: friendly and informal. No, gracias works everywhere.',
            },
            {
              target: 'Nada más, gracias.',
              meaning: 'That’s all, thanks.',
              note: 'The market answer to ¿Algo más?',
            },
            {
              target: '¿Tiene cambio?',
              meaning: 'Do you have change?',
              note: 'Ask before you pay with a big note: ¿Tiene cambio de quinientos?',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the seller want to know?',
          audio: '¿Le doy una bolsa?',
          options: ['If you want a bag', 'If you have change', 'How many you want'],
          answer: 0,
          explanation: '¿Le doy una bolsa? Shall I give you a bag?',
        },
        {
          kind: 'rule',
          title: 'The hundreds',
          body: 'Most hundreds are the number plus -cientos: doscientos, trescientos, cuatrocientos, seiscientos, ochocientos. Three change their first part: quinientos (500), setecientos (700) and novecientos (900). After the hundred, add the rest with no y: doscientos cincuenta. Prices in pesos end in -os; before a feminine word the ending is -as: doscientas manzanas.',
          table: [
            ['200', 'doscientos'],
            ['300', 'trescientos'],
            ['400', 'cuatrocientos'],
            ['500', 'quinientos'],
            ['600', 'seiscientos'],
            ['700', 'setecientos'],
            ['800', 'ochocientos'],
            ['900', 'novecientos'],
          ],
          examples: ['doscientos pesos', 'quinientos pesos'],
        },
        {
          kind: 'teach',
          title: 'The notes you pay with',
          items: [
            {
              target: 'doscientos',
              meaning: 'two hundred (200)',
              note: 'Mexico has a two-hundred-peso note.',
            },
            {
              target: 'quinientos',
              meaning: 'five hundred (500)',
              note: 'Not cinco-cientos. Quince is 15; quinientos is 500.',
            },
          ],
        },
        {
          kind: 'type',
          prompt: 'Listen. The seller tells you what you owe. Type the number of pesos.',
          audio: 'Son doscientos quince pesos.',
          answerKind: 'digits',
          accepted: ['215', '215 pesos'],
          hint: 'Doscientos is 200. Then listen for the last number.',
          explanation: 'Doscientos quince is 215. Quince is 15; quinientos would be 500.',
        },
        {
          kind: 'build',
          prompt:
            'You only have a five-hundred-peso note. Ask the seller if they have change for it.',
          answer: ['¿Tiene', 'cambio', 'de', 'quinientos?'],
          extra: ['quince?', 'mucho'],
          explanation: '¿Tiene cambio de quinientos? Quinientos is 500; quince is only 15.',
        },
        {
          kind: 'match',
          prompt: 'Match each phrase to the English.',
          pairs: [
            ['¿Cuánto, perdón?', 'Sorry, how much?'],
            ['¿Es por kilo?', 'Is it per kilo?'],
            ['Ahorita no, gracias.', 'Not right now, thanks.'],
            ['¿Tiene cambio?', 'Do you have change?'],
          ],
        },
        {
          kind: 'speak',
          prompt:
            'At the fruit stall the seller says a price fast. Ask for it again, check it is per kilo, change your kilo to half a kilo, turn down the bananas and pay with a five-hundred-peso note.',
          lines: [
            '¿Cuánto, perdón?',
            '¿Es por kilo?',
            'Mejor medio kilo.',
            'Ahorita no, gracias.',
            'Nada más, gracias. ¿Tiene cambio de quinientos?',
          ],
          mission: {
            checks: [
              'Ask for the price again.',
              'Check the unit before you buy.',
              'Change one thing with Mejor…',
              'Say no politely and pay.',
            ],
            twist:
              'Now the seller offers you a bag, and you brought your own. Turn it down, and pay with a two-hundred-peso note instead.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u7-task',
      session: 'Exam task',
      title: 'Match the sign to the message',
      outcome:
        'Match market signs and short messages to what people need, and hear and check a total.',
      minutes: 7,
      steps: [
        {
          kind: 'rule',
          title: 'Signs and short messages',
          body: 'DELE A1 reading and listening include tasks where you match short notices or messages to what someone needs, from a list with more options than you use. Here you practise with market signs and messages you have not met before. Listen for the number and the unit separately: dos kilos is not doce. This is practice towards those tasks, not an exam score.',
        },
        {
          kind: 'choose',
          context: marketSigns,
          prompt: 'Ana needs cheese for the snack table. Which sign does she look for?',
          options: ['Quesos y crema', 'Frutas y verduras', 'Panadería'],
          answer: 0,
          explanation: 'Quesos y crema: cheeses and cream. Panadería is a bakery.',
        },
        {
          kind: 'choose',
          context: marketSigns,
          prompt: 'Omar wants to buy avocados one by one. Which sign is for him?',
          options: [
            'Aguacate · 20 pesos la pieza',
            'Oferta · aguacate · 75 pesos el kilo',
            'Huevo · 4 pesos la pieza',
          ],
          answer: 0,
          explanation:
            'La pieza means each one, and aguacate is the avocado. The offer sells avocados by the kilo, and the other sign by the piece is for eggs.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which shopping note matches the message?',
          audio: 'Dos kilos de manzanas, por favor.',
          options: ['2 kg de manzanas', '12 kg de manzanas', '2 manzanas'],
          answer: 0,
          explanation:
            'Dos kilos: the number is dos and the unit is kilos. Doce kilos would be 12 kg.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which shopping note matches the message?',
          audio: 'Doce huevos y medio litro de leche.',
          options: [
            '12 huevos · ½ litro de leche',
            '2 huevos · ½ litro de leche',
            '12 huevos · 1 litro de leche',
          ],
          answer: 0,
          explanation: 'Doce is 12, and medio litro is half a litre.',
        },
        {
          kind: 'match',
          prompt: 'Match each sign to what it tells you.',
          pairs: [
            ['Precio por kilo', 'The price is for one kilo'],
            ['Precio por pieza', 'The price is for one item'],
            ['Oferta', 'Special offer'],
            ['Panadería', 'Bakery'],
          ],
        },
        {
          kind: 'rule',
          title: 'A thousand, and prices on labels',
          body: 'Mil is a thousand. For one thousand you say mil, never un mil: mil pesos, mil doscientos, dos mil. You hear it in prices and in house numbers. Mexico writes one thousand five hundred as 1,500, and Spain as 1.500 or 1500. Decimals are the other way round: 25.50 in Mexico and 25,50 in Spain, both said veinticinco cincuenta. In full, in Mexico: veinticinco pesos con cincuenta centavos. Mexico uses $ for pesos, but $ also means dollars, so look for MXN or the word pesos.',
          table: [
            ['1000', 'mil'],
            ['1200', 'mil doscientos'],
            ['1500', 'mil quinientos'],
            ['2000', 'dos mil'],
          ],
          examples: ['mil pesos', 'mil quinientos pesos'],
        },
        {
          kind: 'type',
          prompt:
            'Ana leaves a voice message with the address of another market. Type the street number.',
          audio: 'Está en la calle Olivo, número mil doscientos.',
          answerKind: 'digits',
          accepted: ['1200', '1,200', '1.200'],
          hint: 'Mil is 1000. Then listen for the hundreds.',
          explanation: 'Mil doscientos is 1200: mil, with no un, then doscientos.',
        },
        {
          kind: 'type',
          prompt: 'Listen to the total at the stall. Type the number of pesos.',
          audio: 'Son trescientos quince pesos.',
          answerKind: 'digits',
          accepted: ['315', '315 pesos'],
          hint: 'Trescientos is 300. Then listen for the last number.',
          explanation: 'Trescientos quince is 315. Quince is 15, not quinientos.',
        },
        {
          kind: 'type',
          context: 'Café de Chiapas · 1 kg · 520 pesos',
          prompt: 'Read the label. Write just the price in words, with pesos.',
          accepted: [
            ...[
              '',
              'son ',
              'cuesta ',
              'el café cuesta ',
              'el café de Chiapas cuesta ',
              'el precio es ',
            ].flatMap((start) =>
              ['pesos', 'pesos mexicanos'].flatMap((money) =>
                ['', ' el kilo', ' por kilo', ' por un kilo'].map(
                  (per) => `${start}quinientos veinte ${money}${per}`,
                ),
              ),
            ),
            'a quinientos veinte pesos el kilo',
            'el precio por kilo es quinientos veinte pesos',
            'el precio de un kilo es quinientos veinte pesos',
            ...[
              'el kilo',
              'un kilo',
              'el kilo de café',
              'un kilo de café',
              'café de Chiapas',
              'un kilo de café de Chiapas',
            ].map((thing) => `${thing} cuesta quinientos veinte pesos`),
          ].map((price) => `${sentence(price)}.`),
          hint: 'Quinientos (500), then veinte.',
          explanation: 'Quinientos veinte pesos. Five hundred is quinientos, not cinco-cientos.',
        },
        {
          kind: 'build',
          prompt:
            'Omar needs two kilos of apples and half a kilo of cheese. Write his shopping note.',
          answer: ['Dos', 'kilos', 'de', 'manzanas', 'y', 'medio', 'kilo', 'de', 'queso.'],
          extra: ['doce', 'media'],
          also: [
            'Medio kilo de queso y dos kilos de manzanas.',
            'Dos kilos de manzanas, medio kilo de queso.',
            'Medio kilo de queso, dos kilos de manzanas.',
          ],
          explanation:
            'An amount, de, then the food, with no el or la: dos kilos de manzanas, medio kilo de queso.',
        },
        {
          kind: 'speak',
          prompt:
            'A different stall: this seller sells avocados by the piece, and you have two hundred pesos for the snack table. Ask the price, check the unit, say how many you want and ask for the total.',
          lines: [
            '¿Cuánto cuestan los aguacates?',
            '¿Es por kilo?',
            'Cinco, por favor.',
            'Nada más, gracias. ¿Cuánto es?',
          ],
          mission: {
            checks: [
              'Ask the price and check the unit.',
              'Buy what fits your budget.',
              'Ask for the total and check it.',
            ],
            twist:
              'The avocados are twenty pesos each, but the seller says five come to a hundred and twenty. That total is wrong: correct it with No, son…, then pay with a two-hundred-peso note.',
          },
        },
      ],
    },
  ],
);
