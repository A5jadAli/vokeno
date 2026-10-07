import { defineLessons } from './types';

// Mexican Spanish is the speaking reference. Notes introduce widely used regional alternatives.
// A1 describes these tasks, not a promise of certified A1 proficiency.
export const spanishA1Lessons = defineLessons('ES', [
  {
    id: 'es-first-words',
    level: 'A1',
    title: 'Your first useful exchange',
    outcome: 'Greet someone, make a polite request and say thank you.',
    phrases: [
      ['Hola.', 'Hello.', 'Works at any time of day. In a shop, add buenos días or buenas tardes.'],
      ['Buenos días.', 'Good morning.', 'A polite greeting until around midday.'],
      ['Por favor.', 'Please.', 'Put it after a request: Un café, por favor.'],
      ['Gracias.', 'Thank you.', 'A short, natural thank you. The reply is often de nada.'],
      ['Hasta luego.', 'See you later.', 'A friendly goodbye, even when you may not meet again.'],
    ],
    notice:
      'Start with complete little exchanges, not a long word list. Greet, ask, thank and leave. Spanish uses ¿ at the start of a question and ¡ at the start of an exclamation.',
    pronunciation:
      'Spanish has five short, steady vowels. Say every one fully: GRA-sias, not “grassy-us”. In Mexico and most of Latin America the c in gracias sounds like s.',
    reading: ['HORARIO: 9:00–18:00', 'Opening hours: 9 a.m. to 6 p.m.'],
    checks: [
      {
        prompt: 'You enter a shop in the morning. What can you say?',
        options: ['Buenos días.', 'Hasta luego.', 'Gracias.'],
        answer: 0,
        explanation: 'Buenos días is a polite morning greeting.',
      },
      {
        prompt: 'Which phrase adds “please” to a request?',
        options: ['Por favor.', 'Gracias.', 'Hasta luego.'],
        answer: 0,
        explanation: 'Por favor means please. Gracias means thank you.',
      },
      {
        prompt: 'Listen. Is the speaker arriving or leaving?',
        audio: 'Gracias. Hasta luego.',
        options: ['Leaving politely', 'Arriving', 'Asking the price'],
        answer: 0,
        explanation: 'Hasta luego is a goodbye.',
      },
    ],
    writing: {
      prompt: 'Write “Thank you” in Spanish.',
      accepted: ['Gracias'],
      hint: 'It begins with Gra.',
      explanation: 'Gracias is the everyday way to thank someone.',
    },
    speaking:
      'Imagine entering a café. Say Hola, buenos días. Ask for something with por favor, then say gracias and hasta luego.',
  },
  {
    id: 'es-names',
    level: 'A1',
    title: 'Meet someone',
    outcome: 'Say your name and where you are from, then ask back.',
    phrases: [
      ['Me llamo Sara.', 'My name is Sara.', 'Replace Sara with your own name.'],
      ['Soy de Pakistán.', 'I am from Pakistan.', 'Use soy de plus your country or city.'],
      ['¿Cómo te llamas?', 'What is your name?', 'Casual form with another learner or friend.'],
      ['¿Cómo se llama?', 'What is your name?', 'Polite form with a stranger or receptionist.'],
      ['Mucho gusto.', 'Nice to meet you.', 'Common in Mexico and much of Latin America.'],
    ],
    notice:
      'Spanish has informal tú and polite usted. With a stranger in a service setting, ¿Cómo se llama? is a safe choice. In Spain you may also hear encantado or encantada for nice to meet you.',
    pronunciation:
      'In llamo, ll often sounds like English y in Mexico. Do not pronounce both l letters separately.',
    reading: ['Nombre: Sara. País: Pakistán.', 'Name: Sara. Country: Pakistan.'],
    checks: [
      {
        prompt: 'Which sentence tells someone your name?',
        options: ['Me llamo Sara.', 'Soy de Pakistán.', 'Mucho gusto.'],
        answer: 0,
        explanation: 'Me llamo Sara introduces your name.',
      },
      {
        prompt: 'You politely ask a hotel receptionist for their name. Which form fits?',
        options: ['¿Cómo se llama?', '¿Cómo te llamas?', 'Soy de México.'],
        answer: 0,
        explanation: 'Se llama is the polite form used with usted.',
      },
      {
        prompt: 'Listen. Where is the speaker from?',
        audio: 'Hola, me llamo Sara. Soy de Pakistán.',
        options: ['Pakistan', 'Spain', 'Mexico'],
        answer: 0,
        explanation: 'Soy de Pakistán means I am from Pakistan.',
      },
    ],
    writing: {
      prompt: 'Introduce Sara. Write “My name is Sara” in Spanish.',
      accepted: ['Me llamo Sara', 'Mi nombre es Sara'],
      hint: 'Start with Me llamo.',
      explanation: 'Me llamo Sara is natural in everyday conversation.',
    },
    speaking:
      'Say Me llamo, then your name. Add Soy de and your country. Ask someone else ¿Cómo te llamas? and reply Mucho gusto.',
  },
  {
    id: 'es-repair',
    level: 'A1',
    title: 'Keep the conversation going',
    outcome: 'Ask for repetition or slower speech when you lose the thread.',
    phrases: [
      ['Disculpe.', 'Excuse me.', 'A polite way to get a stranger’s attention.'],
      ['No entiendo.', 'I do not understand.', 'Be honest; then ask for what will help.'],
      ['¿Puede repetir, por favor?', 'Could you repeat that, please?', 'Polite usted form.'],
      [
        'Más despacio, por favor.',
        'More slowly, please.',
        'A short request when speech is too fast.',
      ],
      ['¿Cómo se escribe?', 'How is it spelled?', 'Useful for names, addresses and places.'],
    ],
    notice:
      'You do not need perfect grammar to recover a conversation. A short request plus a friendly tone is enough. With a friend, ¿Puedes repetir? uses informal tú.',
    pronunciation:
      'The c in despacio sounds like s in most of Latin America. In much of Spain it sounds like th in think.',
    reading: ['Dirección: Calle Reforma 20', 'Address: 20 Reforma Street'],
    checks: [
      {
        prompt: 'Someone speaks too fast. What can you say?',
        options: ['Más despacio, por favor.', 'Mucho gusto.', 'Hasta luego.'],
        answer: 0,
        explanation: 'Más despacio asks for slower speech.',
      },
      {
        prompt: 'You need a name spelled out. What do you ask?',
        options: ['¿Cómo se escribe?', '¿Cuánto cuesta?', '¿Dónde está?'],
        answer: 0,
        explanation: '¿Cómo se escribe? asks how something is spelled.',
      },
      {
        prompt: 'Listen. What does the speaker need?',
        audio: 'Disculpe, no entiendo. ¿Puede repetir, por favor?',
        options: ['A repetition', 'A bill', 'A ticket'],
        answer: 0,
        explanation: '¿Puede repetir? asks the other person to repeat.',
      },
    ],
    writing: {
      prompt: 'Write “I do not understand” in Spanish.',
      accepted: ['No entiendo'],
      hint: 'No + entiendo.',
      explanation: 'No entiendo is direct and useful; follow it with a request.',
    },
    speaking:
      'Pretend you missed a bus announcement. Say Disculpe, no entiendo. Ask ¿Puede repetir, por favor? Then ask for slower speech.',
  },
  {
    id: 'es-sounds',
    level: 'A1',
    title: 'The Spanish sounds that matter most',
    outcome: 'Hear and say the sounds that change meaning: r and rr, ñ, j and the five vowels.',
    phrases: [
      ['pero, perro', 'but, dog', 'One tap for r, a rolled rr. The difference changes the word.'],
      [
        'caro, carro',
        'expensive, car',
        'Carro is the everyday word for car in Mexico; Spain says coche.',
      ],
      [
        'año',
        'year',
        'Ñ is like the ny in canyon. Without the tilde it becomes a different, anatomical word, so keep it.',
      ],
      [
        'jugo',
        'juice',
        'J is a breathy h from the throat. Jugo is juice in Mexico; in Spain, zumo.',
      ],
      ['Vamos.', 'Let’s go.', 'B and v sound the same in Spanish: a soft b.'],
    ],
    notice:
      'Spanish spelling is very regular: once you know the sounds, you can read any word aloud. H is always silent, and qu sounds like k, as in queso.',
    pronunciation:
      'For rr, rest the tongue tip behind your top teeth and let it flutter. If you cannot roll it yet, keep practising the pair pero and perro; a clear tap still keeps you understood in most other words.',
    reading: ['JUGO DE NARANJA · $25', 'Orange juice, 25 pesos'],
    checks: [
      {
        prompt: 'Which word means dog?',
        options: ['perro', 'pero', 'para'],
        answer: 0,
        explanation: 'Perro has the rolled rr. Pero, with one r, means but.',
      },
      {
        prompt: 'Which letter is always silent in Spanish?',
        options: ['h', 'j', 'ñ'],
        answer: 0,
        explanation: 'H is silent: hola sounds like ola.',
      },
      {
        prompt: 'Listen. What does the speaker want?',
        audio: 'Quiero un carro rojo.',
        options: ['A red car', 'An expensive car', 'A red dog'],
        answer: 0,
        explanation: 'Carro is car and rojo is red.',
      },
    ],
    writing: {
      prompt: 'Write the Spanish word for “year”.',
      accepted: ['año'],
      hint: 'It has an ñ.',
      explanation: 'Año needs the ñ: with a plain n it becomes a different word.',
    },
    speaking:
      'Say pero, then perro, three times each. Then say Quiero un carro and Tengo un perro, keeping the rr rolled or clearly tapped.',
  },
  {
    id: 'es-prices',
    level: 'A1',
    title: 'Numbers and prices',
    outcome: 'Ask a price and recognise a small amount in a shop.',
    phrases: [
      [
        '¿Cuánto cuesta?',
        'How much does it cost?',
        'For one item. For several items, ask ¿Cuánto cuestan?',
      ],
      [
        'Cuesta veinte pesos.',
        'It costs twenty pesos.',
        'In Mexico prices are in pesos. Elsewhere the currency changes.',
      ],
      [
        'Son treinta y cinco pesos.',
        'It is thirty-five pesos.',
        'Often used for the total at the counter.',
      ],
      ['¿Tiene cambio?', 'Do you have change?', 'Useful when paying cash.'],
      ['Está bien, gracias.', 'That is fine, thank you.', 'A polite way to accept the price.'],
    ],
    notice:
      'Hear the tens first: veinte is 20, treinta is 30. Treinta y cinco is 35. Do not assume every Spanish-speaking country uses pesos; ask and check the currency symbol.',
    pronunciation:
      'In veinte, the vowels stay clear: vein-te. Treinta y cinco links smoothly, but keep the final o in cinco audible.',
    reading: ['$35.00 · agua', 'Water costs 35 pesos on this Mexican price label.'],
    checks: [
      {
        prompt: 'How do you ask the price of one item?',
        options: ['¿Cuánto cuesta?', '¿Dónde está?', '¿Cómo se llama?'],
        answer: 0,
        explanation: 'Cuánto cuesta asks the price of one item.',
      },
      {
        prompt: 'What number is treinta y cinco?',
        options: ['35', '53', '30'],
        answer: 0,
        explanation: 'Treinta is 30 and cinco is 5.',
      },
      {
        prompt: 'Listen. What is the total?',
        audio: 'Son treinta y cinco pesos.',
        options: ['35 pesos', '25 pesos', '53 pesos'],
        answer: 0,
        explanation: 'Treinta y cinco is thirty-five.',
      },
    ],
    writing: {
      prompt: 'Write “How much does it cost?” in Spanish.',
      accepted: ['Cuánto cuesta', '¿Cuánto cuesta?'],
      hint: 'Start with cuánto.',
      explanation: '¿Cuánto cuesta? asks the price of one item.',
    },
    speaking:
      'Point to an item and ask ¿Cuánto cuesta? Listen for veinte or treinta. Reply Está bien, gracias or ask ¿Tiene cambio?',
  },
  {
    id: 'es-family',
    level: 'A1',
    title: 'Talk about family and friends',
    outcome: 'Say who is in your family and ask about someone else’s.',
    phrases: [
      [
        'Tengo dos hermanos.',
        'I have two brothers, or a brother and a sister.',
        'Hermanos covers brothers, or brothers and sisters together.',
      ],
      [
        'Mi mamá se llama Aisha.',
        'My mum is called Aisha.',
        'Mamá and papá are warm and very common in Mexico; madre and padre are more formal.',
      ],
      ['¿Tienes hijos?', 'Do you have children?', 'Informal tú. With usted: ¿Tiene hijos?'],
      ['Es mi mejor amiga.', 'She is my best friend.', 'Amiga for a woman, amigo for a man.'],
      ['Somos cinco en mi familia.', 'There are five of us in my family.', 'Somos means we are.'],
    ],
    notice:
      'Possessives come before the noun: mi (my), tu (your, informal), su (his, her or your, polite). With plurals, add s: mis padres. Padres means parents, not only fathers.',
    pronunciation:
      'Hermanos starts with a silent h: er-MA-nos. In hijos, the j is the breathy throat sound: I-jos.',
    reading: [
      'Familia López: Ana, Luis y sus dos hijos',
      'The López family: Ana, Luis and their two children',
    ],
    checks: [
      {
        prompt: 'How do you say “my parents”?',
        options: ['mis padres', 'mi padres', 'mis padre'],
        answer: 0,
        explanation: 'Padres is plural, so mi becomes mis.',
      },
      {
        prompt: 'You politely ask an older neighbour if she has children. Which fits?',
        options: ['¿Tiene hijos?', '¿Tienes hijos?', 'Tengo hijos.'],
        answer: 0,
        explanation: 'Tiene is the usted form, a respectful choice with an older neighbour.',
      },
      {
        prompt: 'Listen. How many siblings does the speaker have?',
        audio: 'Tengo un hermano y una hermana.',
        options: ['Two', 'One', 'Three'],
        answer: 0,
        explanation: 'Un hermano y una hermana: one brother and one sister.',
      },
    ],
    writing: {
      prompt: 'Write “Do you have children?” using the informal tú form.',
      accepted: ['¿Tienes hijos?'],
      hint: 'Start with Tienes.',
      explanation: '¿Tienes hijos? uses tú; with usted it is ¿Tiene hijos?',
    },
    speaking:
      'Describe your family in three sentences: Somos…, Tengo… and Mi mamá se llama… Then ask someone ¿Tienes hermanos?',
  },
  {
    id: 'es-cafe',
    level: 'A1',
    title: 'Order at a café',
    outcome: 'Order a drink, make one change and ask to pay.',
    phrases: [
      [
        'Quisiera un café con leche, por favor.',
        'I would like a coffee with milk, please.',
        'A polite request that works widely.',
      ],
      ['Sin azúcar, por favor.', 'Without sugar, please.', 'Sin means without.'],
      ['Para llevar.', 'To take away.', 'Use it when you will not stay.'],
      [
        'La cuenta, por favor.',
        'The bill, please.',
        'Use this at a table when you are ready to pay.',
      ],
      ['¿Puedo pagar con tarjeta?', 'Can I pay by card?', 'A common payment question.'],
    ],
    notice:
      'In many cafés you order and pay at the counter, so you may not need la cuenta. Café con leche is widely understood, though coffee styles vary by place.',
    pronunciation:
      'The stress in quisiera falls on the e: qui-SIE-ra. The accent in café marks stress on the last syllable: ca-FÉ. Leche has two clear e sounds: LE-che.',
    reading: ['PARA LLEVAR · café con leche', 'Takeaway · coffee with milk'],
    checks: [
      {
        prompt: 'You do not want sugar. What do you add?',
        options: ['Sin azúcar, por favor.', 'Con azúcar, por favor.', 'La cuenta.'],
        answer: 0,
        explanation: 'Sin azúcar means without sugar.',
      },
      {
        prompt: 'At a table, you are ready to pay. What do you ask for?',
        options: ['La cuenta, por favor.', '¿Cómo se llama?', 'Para llevar.'],
        answer: 0,
        explanation: 'La cuenta is the bill.',
      },
      {
        prompt: 'Listen. Is the drink for here or to take away?',
        audio: 'Un café con leche para llevar, por favor.',
        options: ['To take away', 'For here', 'The speaker has not said'],
        answer: 0,
        explanation: 'Para llevar means to take away.',
      },
    ],
    writing: {
      prompt: 'Write “The bill, please” in Spanish.',
      accepted: ['La cuenta, por favor'],
      hint: 'Use la cuenta and por favor.',
      explanation: 'La cuenta, por favor is a natural request at a table.',
    },
    speaking:
      'Order a coffee with milk. Add sin azúcar or para llevar. Ask if you can pay by card, then thank the server.',
  },
  {
    id: 'es-time',
    level: 'A1',
    title: 'Tell the time and describe your day',
    outcome: 'Ask and tell the time, and describe a simple daily routine.',
    phrases: [
      ['¿Qué hora es?', 'What time is it?', 'The everyday question.'],
      [
        'Es la una.',
        'It is one o’clock.',
        'Only one o’clock uses es la; every other hour uses son las.',
      ],
      [
        'Son las tres y media.',
        'It is half past three.',
        'Y cuarto is quarter past. For quarter to, Mexico often says cuarto para las cuatro.',
      ],
      [
        'Me levanto a las siete.',
        'I get up at seven.',
        'Levantarse is reflexive: me levanto, te levantas.',
      ],
      ['Trabajo de nueve a cinco.', 'I work from nine to five.', 'Use de … a … for a time span.'],
    ],
    notice:
      'Parts of the day: de la mañana (morning), de la tarde (afternoon and early evening), de la noche (night). Timetables often use the 24-hour clock: 18:00 is las dieciocho horas.',
    pronunciation: 'Link the words: son_las_tres. In media, stress the first syllable: ME-dia.',
    reading: ['Clase de yoga: 7:30 p. m.', 'Yoga class: 7:30 in the evening'],
    checks: [
      {
        prompt: 'How do you say “It is one o’clock”?',
        options: ['Es la una.', 'Son las una.', 'Es las una.'],
        answer: 0,
        explanation: 'Only one o’clock is singular: es la una.',
      },
      {
        prompt: 'What time is “cuarto para las cinco”?',
        options: ['4:45', '5:15', '5:45'],
        answer: 0,
        explanation:
          'Cuarto para las cinco is a quarter to five. Spain says las cinco menos cuarto.',
      },
      {
        prompt: 'Listen. When does the speaker get up?',
        audio: 'Me levanto a las seis y media.',
        options: ['6:30', '7:30', '6:15'],
        answer: 0,
        explanation: 'Seis y media is half past six.',
      },
    ],
    writing: {
      prompt: 'Write “What time is it?” in Spanish.',
      accepted: ['¿Qué hora es?'],
      hint: 'Start with Qué hora.',
      explanation: '¿Qué hora es? is the standard question.',
    },
    speaking:
      'Ask ¿Qué hora es? and answer with the real time. Then describe your morning: Me levanto a las…, desayuno a las… and trabajo de… a…',
  },
  {
    id: 'es-market',
    level: 'A1',
    title: 'Shop at the market',
    outcome: 'Ask for quantities, answer “anything else?” and pay.',
    phrases: [
      [
        '¿Me da un kilo de jitomates?',
        'Can I have a kilo of tomatoes?',
        'Me da is a common, polite way to ask in Mexico. Red tomatoes are jitomates there; tomate often means the green tomatillo.',
      ],
      ['Medio kilo, por favor.', 'Half a kilo, please.', 'Medio means half.'],
      ['¿Algo más?', 'Anything else?', 'What the seller asks before you pay.'],
      ['Nada más, gracias.', 'That is all, thank you.', 'A polite way to finish.'],
      ['¿Cuánto es?', 'How much is it?', 'For the total. ¿Cuánto cuesta? is for one item.'],
    ],
    notice:
      'Markets in Mexico are mercados or tianguis (open-air street markets). Sellers may call out ¿Qué le damos? (What can we get you?) or address you as joven; it is friendly. In Spain, shoppers often say ¿Me pone…?',
    pronunciation:
      'Kilo and queso both start with a k sound. Jitomates has a breathy j and stress on MA: ji-to-MA-tes.',
    reading: ['Aguacate · $60 el kilo', 'Avocados, 60 pesos per kilo'],
    checks: [
      {
        prompt: 'The seller asks ¿Algo más? and you have everything. What do you say?',
        options: ['Nada más, gracias.', 'Medio kilo.', '¿Me da un kilo?'],
        answer: 0,
        explanation: 'Nada más means nothing more.',
      },
      {
        prompt: 'Which question asks for the total?',
        options: ['¿Cuánto es?', '¿Qué hora es?', '¿Algo más?'],
        answer: 0,
        explanation: '¿Cuánto es? asks how much you owe in total.',
      },
      {
        prompt: 'Listen. How much cheese does the customer want?',
        audio: 'Medio kilo de queso, por favor.',
        options: ['Half a kilo', 'One kilo', 'Two kilos'],
        answer: 0,
        explanation: 'Medio kilo is half a kilo.',
      },
    ],
    writing: {
      prompt: 'Write “Anything else?” in Spanish.',
      accepted: ['¿Algo más?'],
      hint: 'Two words: algo + más.',
      explanation: '¿Algo más? is what shop staff ask before you pay.',
    },
    speaking:
      'Buy three things at a market stall. Ask ¿Me da…? with a quantity, answer ¿Algo más? and finish with ¿Cuánto es?',
  },
  {
    id: 'es-directions',
    level: 'A1',
    title: 'Find your way',
    outcome: 'Ask where a place is and follow two simple directions.',
    phrases: [
      [
        '¿Dónde está la estación?',
        'Where is the station?',
        'A widely understood way to ask for a place.',
      ],
      ['Siga derecho.', 'Go straight ahead.', 'Polite instruction you might hear from a stranger.'],
      ['A la derecha.', 'To the right.', 'Right-hand direction.'],
      ['A la izquierda.', 'To the left.', 'Left-hand direction.'],
      ['¿Está cerca?', 'Is it nearby?', 'Ask this before you start walking.'],
    ],
    notice:
      'Careful with one pair: derecho means straight ahead, but a la derecha means to the right. In Mexico you may also hear ¿Dónde queda la estación? Listen for landmarks as well as left and right.',
    pronunciation:
      'The single r in derecho is one quick tap of the tongue, like the tt in American “butter”. In izquierda, the z sounds like s in Mexico and like th in much of Spain.',
    reading: ['ESTACIÓN → 200 m', 'Station, 200 metres to the right'],
    checks: [
      {
        prompt: 'Which phrase asks if a place is nearby?',
        options: ['¿Está cerca?', 'Siga derecho.', 'A la izquierda.'],
        answer: 0,
        explanation: 'Cerca means nearby.',
      },
      {
        prompt: 'Which direction means “to the left”?',
        options: ['A la izquierda.', 'A la derecha.', 'Siga derecho.'],
        answer: 0,
        explanation: 'Izquierda means left.',
      },
      {
        prompt: 'Listen. Which way should you turn?',
        audio: 'Siga derecho y luego a la derecha.',
        options: ['Go straight, then right', 'Go straight, then left', 'Turn around'],
        answer: 0,
        explanation: 'Derecha means right; luego means then.',
      },
    ],
    writing: {
      prompt: 'Write “Where is the station?” in Spanish.',
      accepted: ['Dónde está la estación', '¿Dónde está la estación?', 'Dónde queda la estación'],
      hint: 'Start with dónde and use está.',
      explanation: '¿Dónde está la estación? is understood widely.',
    },
    speaking:
      'Ask for the station. Listen for derecho, derecha or izquierda. Ask ¿Está cerca? and repeat the direction to check you understood.',
  },
  {
    id: 'es-transport',
    level: 'A1',
    title: 'Take the right bus',
    outcome: 'Ask whether a bus reaches your destination and check departure time.',
    phrases: [
      [
        '¿Este autobús va al centro?',
        'Does this bus go downtown?',
        'Ask before you board. Autobús is understood everywhere.',
      ],
      ['¿A qué hora sale?', 'What time does it leave?', 'Use it for buses, trains and flights.'],
      ['Sale a las nueve.', 'It leaves at nine.', 'For one o’clock, use a la una.'],
      [
        'Un boleto, por favor.',
        'One ticket, please.',
        'Boleto is common in Mexico; billete is common in Spain.',
      ],
      ['¿Dónde me bajo?', 'Where do I get off?', 'Ask a driver or fellow passenger when unsure.'],
    ],
    notice:
      'In Mexico a city bus is often called camión; in Argentina, colectivo. Autobús is understood everywhere, so start with it. Check the destination shown on the front of the bus.',
    pronunciation:
      'Stress in autobús falls on the last syllable. In boleto, each vowel is clear: bo-le-to.',
    reading: ['CENTRO · SALIDA 9:00', 'Downtown · departure 9:00'],
    checks: [
      {
        prompt: 'How do you check if a bus goes downtown?',
        options: ['¿Este autobús va al centro?', '¿Dónde me bajo?', 'Un boleto.'],
        answer: 0,
        explanation: 'Va al centro asks if it goes downtown.',
      },
      {
        prompt: 'A sign says SALIDA 9:00. What does it tell you?',
        options: ['Departure at 9', 'Arrival at 9', 'Ticket price 9'],
        answer: 0,
        explanation: 'Salida means departure or exit; with a time it indicates departure.',
      },
      {
        prompt: 'Listen. When does the bus leave?',
        audio: 'El autobús sale a las nueve.',
        options: ['At nine', 'At one', 'At noon'],
        answer: 0,
        explanation: 'A las nueve means at nine.',
      },
    ],
    writing: {
      prompt: 'Write “One ticket, please” in Mexican Spanish.',
      accepted: ['Un boleto, por favor'],
      hint: 'Use un boleto and por favor.',
      explanation: 'Un boleto, por favor is a simple ticket request in Mexico.',
    },
    speaking:
      'Ask if the bus goes downtown. Ask when it leaves. Request one ticket and ask where to get off.',
  },
  {
    id: 'es-likes',
    level: 'A1',
    title: 'Say what you like doing',
    outcome: 'Talk about likes and dislikes and react to someone else’s.',
    phrases: [
      ['Me gusta cocinar.', 'I like cooking.', 'Gusta with a verb or one thing.'],
      ['Me gustan los tacos.', 'I like tacos.', 'Gustan with a plural thing.'],
      ['¿Te gusta el fútbol?', 'Do you like football?', 'Informal tú. With usted: ¿Le gusta…?'],
      ['No me gusta el frío.', 'I do not like the cold.', 'No goes before me.'],
      [
        'A mí también.',
        'Me too.',
        'Agrees with a like. To agree with a dislike, say A mí tampoco.',
      ],
    ],
    notice:
      'Gustar works backwards from English: the thing pleases you, so the verb agrees with the thing. Me gusta el café, but me gustan los tacos. To agree with “I don’t like it”, say a mí tampoco, not a mí también.',
    pronunciation:
      'The g in gusta is hard at the start of a word: GUS-ta. Fútbol is stressed on the first syllable: FÚT-bol.',
    reading: ['Me gusta: leer, el cine y la música', 'I like reading, the cinema and music'],
    checks: [
      {
        prompt: 'Which is correct for “I like tacos”?',
        options: ['Me gustan los tacos.', 'Me gusta los tacos.', 'Yo gusto los tacos.'],
        answer: 0,
        explanation: 'Tacos is plural, so the verb is gustan.',
      },
      {
        prompt: 'A friend says “No me gusta el frío.” You agree. What do you say?',
        options: ['A mí tampoco.', 'A mí también.', 'Me gusta.'],
        answer: 0,
        explanation: 'Tampoco agrees with a negative.',
      },
      {
        prompt: 'Listen. What does the speaker dislike?',
        audio: 'Me gusta mucho leer, pero no me gusta correr.',
        options: ['Running', 'Reading', 'Music'],
        answer: 0,
        explanation: 'No me gusta correr: they do not like running.',
      },
    ],
    writing: {
      prompt: 'Write “I like cooking” in Spanish.',
      accepted: ['Me gusta cocinar'],
      hint: 'Me gusta + a verb.',
      explanation: 'With a verb, gusta stays singular: me gusta cocinar.',
    },
    speaking:
      'Name two things you like and one you do not. Ask ¿Y a ti? and react with A mí también or A mí tampoco.',
  },
  {
    id: 'es-hotel',
    level: 'A1',
    title: 'Check in and solve a problem',
    outcome: 'Give a reservation name and report a simple room problem.',
    phrases: [
      [
        'Tengo una reservación.',
        'I have a reservation.',
        'Common in Mexico. In Spain you may hear reserva.',
      ],
      ['A nombre de Sara.', 'In Sara’s name.', 'Give the name used for the booking.'],
      ['¿Dónde está mi habitación?', 'Where is my room?', 'Habitación means room.'],
      ['La llave no funciona.', 'The key does not work.', 'Use this for a key card too.'],
      ['¿Me puede ayudar?', 'Can you help me?', 'A polite request to staff.'],
    ],
    notice:
      'When checking in, staff may ask for su nombre (your name), su pasaporte (your passport) or a confirmation number. Do not recite personal details in the app’s practice exercises.',
    pronunciation: 'The h in habitación is silent. Llave often starts with a y sound in Mexico.',
    reading: ['HABITACIÓN 204 · SALIDA 11:00', 'Room 204 · check-out 11:00'],
    checks: [
      {
        prompt: 'How do you say the booking is in Sara’s name?',
        options: ['A nombre de Sara.', 'La llave no funciona.', 'Está cerca.'],
        answer: 0,
        explanation: 'A nombre de introduces the name used for a booking.',
      },
      {
        prompt: 'A key card fails. What can you say?',
        options: ['La llave no funciona.', 'Tengo una reservación.', 'Un boleto.'],
        answer: 0,
        explanation: 'La llave no funciona reports that the key is not working.',
      },
      {
        prompt: 'Listen. What is the problem?',
        audio: 'Disculpe, la llave no funciona. ¿Me puede ayudar?',
        options: ['The key does not work', 'The room is too cold', 'The booking is missing'],
        answer: 0,
        explanation: 'La llave no funciona means the key does not work.',
      },
    ],
    writing: {
      prompt: 'Write “I have a reservation” in Mexican Spanish.',
      accepted: ['Tengo una reservación', 'Tengo una reserva'],
      hint: 'Use Tengo una reservación.',
      explanation: 'Reservación is common in Mexico; reserva is also understood.',
    },
    speaking:
      'Check in with Tengo una reservación a nombre de, then a name you invent. Ask about your room and explain that the key does not work.',
  },
  {
    id: 'es-help',
    level: 'A1',
    title: 'Ask for help',
    outcome: 'Ask for a pharmacy and explain a simple urgent need.',
    phrases: [
      ['Necesito ayuda.', 'I need help.', 'A direct request when something is wrong.'],
      ['¿Dónde hay una farmacia?', 'Where is there a pharmacy?', 'Ask for a nearby pharmacy.'],
      ['Me duele la cabeza.', 'My head hurts.', 'A simple way to name a symptom.'],
      ['Necesito un médico.', 'I need a doctor.', 'Say it clearly if you need medical care.'],
      [
        '¿Puede llamar a una ambulancia?',
        'Can you call an ambulance?',
        'For a genuine emergency. In Mexico the emergency number is 911; in Spain it is 112.',
      ],
    ],
    notice:
      'These phrases help you ask for assistance; the app does not give medical advice. Emergency numbers differ by country: 911 in Mexico, 112 in Spain. Check the local number before you travel.',
    pronunciation: 'The h in hay is silent. Duele has two vowel sounds together: DWE-le.',
    reading: ['FARMACIA · ABIERTO', 'Pharmacy · open'],
    checks: [
      {
        prompt: 'You need a pharmacy. Which question asks for one?',
        options: ['¿Dónde hay una farmacia?', '¿Cuánto cuesta?', '¿A qué hora sale?'],
        answer: 0,
        explanation: 'Dónde hay una farmacia asks where a pharmacy is.',
      },
      {
        prompt: 'What does “Me duele la cabeza” mean?',
        options: ['My head hurts', 'I lost my key', 'I need a ticket'],
        answer: 0,
        explanation: 'Cabeza is head; me duele means it hurts me.',
      },
      {
        prompt: 'Listen. What does the speaker need?',
        audio: 'Necesito ayuda. ¿Dónde hay una farmacia?',
        options: ['Help finding a pharmacy', 'A hotel room', 'Change for a bill'],
        answer: 0,
        explanation: 'The speaker asks for help and for a pharmacy.',
      },
    ],
    writing: {
      prompt: 'Write “I need help” in Spanish.',
      accepted: ['Necesito ayuda'],
      hint: 'Use Necesito + ayuda.',
      explanation: 'Necesito ayuda is direct and widely understood.',
    },
    speaking:
      'Ask a shop worker for help finding a pharmacy. Say Necesito ayuda, ask ¿Dónde hay una farmacia? and repeat the answer to confirm.',
  },
  {
    id: 'es-messages',
    level: 'A1',
    title: 'Message a friend like a local',
    outcome: 'Make and confirm a casual plan by message.',
    phrases: [
      [
        '¿Qué onda?',
        'What’s up?',
        'Very common and informal in Mexico. Use it with friends, not at work.',
      ],
      [
        '¿Nos vemos mañana?',
        'Shall we meet tomorrow?',
        'Nos vemos literally means we see each other.',
      ],
      [
        'Va.',
        'OK, sounds good.',
        'Informal Mexican agreement; sale is also common. In Spain people say vale.',
      ],
      [
        'Llego en diez minutos.',
        'I will be there in ten minutes.',
        'Llegar en + a length of time.',
      ],
      ['Perdón, voy tarde.', 'Sorry, I am running late.', 'Voy tarde: literally, I am going late.'],
    ],
    notice:
      'Text shortcuts you will see: q for que, xq for porque, tmb for también, and jaja for laughter. Read them, but write in full until you are confident.',
    pronunciation:
      'Onda has a clear o and a soft d: ON-da. In llego, the ll sounds like y in Mexico: YE-go.',
    reading: ['¿Nos vemos a las 6 en el café?', 'Shall we meet at 6 at the café?'],
    checks: [
      {
        prompt: 'Which greeting is informal and typically Mexican?',
        options: ['¿Qué onda?', 'Buenos días.', 'Mucho gusto.'],
        answer: 0,
        explanation: '¿Qué onda? is a casual hello among friends in Mexico.',
      },
      {
        prompt: 'A friend asks “¿Nos vemos a las seis?” You agree casually. What do you write?',
        options: ['Va, nos vemos.', 'No entiendo.', 'La cuenta, por favor.'],
        answer: 0,
        explanation: 'Va is a quick yes in Mexico.',
      },
      {
        prompt: 'Listen. What is the problem?',
        audio: 'Perdón, voy tarde. Llego en quince minutos.',
        options: ['They are running late', 'They cannot come', 'They are lost'],
        answer: 0,
        explanation: 'Voy tarde means they are running late.',
      },
    ],
    writing: {
      prompt: 'Write “Sorry, I am running late” in Spanish.',
      accepted: ['Perdón, voy tarde', 'Perdona, voy tarde', 'Lo siento, voy tarde'],
      hint: 'Perdón + voy tarde.',
      explanation: 'Perdón, voy tarde is a natural quick apology.',
    },
    speaking:
      'Leave a voice note for a friend: greet them with ¿Qué onda?, suggest a time with ¿Nos vemos…? and say you will arrive in ten minutes.',
  },
]);
