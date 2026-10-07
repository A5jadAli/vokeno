import { defineLessons } from './types';

// A2: the past, everyday problems and more natural Mexican Spanish. Practice towards A2 tasks,
// not a certified level.
export const spanishA2Lessons = defineLessons('ES', [
  {
    id: 'es-weekend',
    level: 'A2',
    title: 'What did you do at the weekend?',
    outcome: 'Talk about last weekend with regular past forms.',
    phrases: [
      [
        '¿Qué hiciste el fin de semana?',
        'What did you do at the weekend?',
        'A very common Monday question.',
      ],
      [
        'Descansé en casa.',
        'I rested at home.',
        '-ar verbs end in -é for yo: descansar, descansé.',
      ],
      [
        'Comí con mi familia.',
        'I ate with my family.',
        '-er and -ir verbs end in -í: comer, comí.',
      ],
      [
        'Salimos a cenar.',
        'We went out for dinner.',
        'For nosotros, the past looks like the present; ayer or el sábado makes it clear.',
      ],
      ['Estuvo muy bien.', 'It was really good.', 'A natural way to sum up a past event.'],
    ],
    notice:
      'The simple past (pretérito) is for finished actions: ayer, el sábado, el fin de semana pasado. The written accent matters: hablo means I speak, habló means he or she spoke.',
    pronunciation:
      'Stress shifts to the ending in the past: desCANso (I rest) but descanSÉ (I rested). Hit the final syllable clearly.',
    reading: [
      'Sábado: cine. Domingo: comida con la familia.',
      'Saturday: cinema. Sunday: lunch with the family.',
    ],
    checks: [
      {
        prompt: 'Which form means “I ate”?',
        options: ['comí', 'como', 'comió'],
        answer: 0,
        explanation: 'Comí is yo in the simple past; comió means he or she ate.',
      },
      {
        prompt: 'What does “¿Qué hiciste?” ask?',
        options: ['What did you do?', 'What are you doing?', 'What will you do?'],
        answer: 0,
        explanation: 'Hiciste is the past of hacer for tú.',
      },
      {
        prompt: 'Listen. What did the speaker do on Sunday?',
        audio: 'El sábado fui al cine y el domingo descansé.',
        options: ['Rested', 'Went to the cinema', 'Worked'],
        answer: 0,
        explanation: 'El domingo descansé: on Sunday I rested.',
      },
    ],
    writing: {
      prompt: 'Write “I rested at home” in Spanish.',
      accepted: ['Descansé en casa'],
      hint: 'Descansar becomes descansé.',
      explanation: 'Descansé en casa: the final é marks the past.',
    },
    speaking:
      'Answer ¿Qué hiciste el fin de semana? with three past actions, then ask the question back.',
  },
  {
    id: 'es-yesterday',
    level: 'A2',
    title: 'Talk about what happened yesterday',
    outcome: 'Use the most common irregular past forms to tell a short sequence.',
    phrases: [
      [
        'Ayer fui al médico.',
        'Yesterday I went to the doctor.',
        'Fui is the past of ir and of ser.',
      ],
      ['Tuve que trabajar.', 'I had to work.', 'Tener que becomes tuve que.'],
      ['Hice la tarea.', 'I did the homework.', 'Hacer becomes hice, with no accent.'],
      ['Vi una película.', 'I watched a film.', 'Ver becomes vi. Friends often say una peli.'],
      ['Primero…, luego…, al final…', 'First…, then…, in the end…', 'Words that order a story.'],
    ],
    notice:
      'The most useful irregular pasts: fui (I went or I was), tuve (I had), hice (I did), vi (I saw), estuve (I was, for a while). Irregular past forms take no written accent.',
    pronunciation: 'In hice, the c sounds like s in Mexico: I-se. Say fui as one syllable: fwi.',
    reading: [
      'Ayer: médico 9:00, trabajo 11:00–19:00',
      'Yesterday: doctor at 9:00, work from 11:00 to 19:00',
    ],
    checks: [
      {
        prompt: 'Which means “I had to work”?',
        options: ['Tuve que trabajar.', 'Tengo que trabajar.', 'Tuvo que trabajar.'],
        answer: 0,
        explanation: 'Tuve is the yo form of tener in the past.',
      },
      {
        prompt: '“Fui” can be the past of which verbs?',
        options: ['ir and ser', 'hacer and ver', 'tener and estar'],
        answer: 0,
        explanation: 'Fui means I went (ir) or I was (ser); context tells you which.',
      },
      {
        prompt: 'Listen. Where did the speaker go first?',
        audio: 'Ayer primero fui al banco y luego vi a mi hermana.',
        options: ['To the bank', 'To the cinema', 'To the doctor'],
        answer: 0,
        explanation: 'Primero fui al banco: first I went to the bank.',
      },
    ],
    writing: {
      prompt: 'Write “I watched a film” in Spanish.',
      accepted: ['Vi una película', 'Vi una peli'],
      hint: 'Ver becomes vi.',
      explanation: 'Vi una película: vi has no accent.',
    },
    speaking:
      'Tell the story of yesterday in four steps with primero, luego, después and al final.',
  },
  {
    id: 'es-appointment',
    level: 'A2',
    title: 'Make and change an appointment',
    outcome: 'Book a time, suggest another and confirm it.',
    phrases: [
      [
        'Quisiera hacer una cita.',
        'I would like to make an appointment.',
        'Cita means an appointment, and also a date.',
      ],
      ['¿Tiene algo el jueves?', 'Do you have anything on Thursday?', 'Ask about availability.'],
      [
        '¿Le queda bien a las cuatro?',
        'Does four o’clock suit you?',
        'Quedar bien means to suit. Very common in Mexico.',
      ],
      ['¿Podemos cambiar la cita?', 'Can we change the appointment?', 'Polite and direct.'],
      ['Perfecto, nos vemos el jueves.', 'Perfect, see you on Thursday.', 'Confirm the new time.'],
    ],
    notice:
      'Use el with a day for one occasion (el jueves, on Thursday) and los for a habit (los jueves, on Thursdays). Days are written in lower case: lunes, martes.',
    pronunciation:
      'Jueves starts with the breathy j: JWE-ves. In cita, the c sounds like s in Mexico.',
    reading: ['Cita: jueves 14 de octubre, 16:00', 'Appointment: Thursday 14 October, 4 p.m.'],
    checks: [
      {
        prompt: 'What does “los jueves” mean?',
        options: ['on Thursdays', 'on Thursday', 'this Thursday only'],
        answer: 0,
        explanation: 'Los with a day means every week on that day.',
      },
      {
        prompt: 'Which sentence asks to change an appointment?',
        options: ['¿Podemos cambiar la cita?', 'Quisiera hacer una cita.', 'Nos vemos el jueves.'],
        answer: 0,
        explanation: 'Cambiar means to change.',
      },
      {
        prompt: 'Listen. What new time is offered?',
        audio: 'El jueves no puedo. ¿Le queda bien el viernes a las diez?',
        options: ['Friday at ten', 'Thursday at ten', 'Friday at two'],
        answer: 0,
        explanation: 'El viernes a las diez is Friday at ten.',
      },
    ],
    writing: {
      prompt: 'Write “I would like to make an appointment” in Spanish.',
      accepted: ['Quisiera hacer una cita', 'Quiero hacer una cita', 'Me gustaría hacer una cita'],
      hint: 'Start with Quisiera.',
      explanation: 'Quisiera hacer una cita is a polite request.',
    },
    speaking:
      'Call a clinic: ask for an appointment, politely decline the first time, suggest another and confirm it.',
  },
  {
    id: 'es-flat',
    level: 'A2',
    title: 'Rent a room and report a problem',
    outcome: 'Ask about a room or flat and explain what needs fixing.',
    phrases: [
      [
        'Busco un cuarto en renta.',
        'I am looking for a room to rent.',
        'Mexico says renta; Spain says alquiler.',
      ],
      ['¿Cuánto es la renta al mes?', 'How much is the rent per month?', 'Ask before you visit.'],
      [
        '¿Están incluidos los servicios?',
        'Are the bills included?',
        'Servicios means water, electricity and gas.',
      ],
      ['No hay agua caliente.', 'There is no hot water.', 'Hay means there is or there are.'],
      [
        'La regadera no funciona.',
        'The shower does not work.',
        'Mexico says regadera; Spain says ducha.',
      ],
    ],
    notice:
      'Describe a problem with no hay (there is no …) or no funciona (does not work), then add since when: desde ayer, desde el lunes.',
    pronunciation:
      'Hay sounds like the English eye. Regadera has one quick tapped r in the middle: re-ga-DE-ra.',
    reading: [
      'Se renta cuarto amueblado · $4,500/mes',
      'Furnished room for rent · 4,500 pesos a month',
    ],
    checks: [
      {
        prompt: 'How do you report that there is no hot water?',
        options: ['No hay agua caliente.', 'No funciona agua.', 'Hay agua caliente.'],
        answer: 0,
        explanation: 'No hay means there is no.',
      },
      {
        prompt: 'In Mexico, what is “la regadera”?',
        options: ['The shower', 'The kitchen', 'The landlord'],
        answer: 0,
        explanation: 'Regadera is the shower in Mexico; Spain says ducha.',
      },
      {
        prompt: 'Listen. What is the problem?',
        audio: 'La luz del baño no funciona desde el lunes.',
        options: [
          'The bathroom light has not worked since Monday',
          'The bathroom is dirty',
          'The rent is too high',
        ],
        answer: 0,
        explanation: 'La luz no funciona desde el lunes: the light has not worked since Monday.',
      },
    ],
    writing: {
      prompt: 'Write “The shower does not work” using the Mexican word.',
      accepted: ['La regadera no funciona'],
      hint: 'Use regadera and no funciona.',
      explanation: 'La regadera no funciona. In Spain you would say la ducha.',
    },
    speaking:
      'Call a landlord: ask the monthly rent and whether bills are included, then report one problem and how long it has lasted.',
  },
  {
    id: 'es-location',
    level: 'A2',
    title: 'Where is it? Describe places',
    outcome: 'Say where things and places are with common location words.',
    phrases: [
      ['Está al lado del banco.', 'It is next to the bank.', 'De + el always becomes del.'],
      [
        'Está enfrente de la farmacia.',
        'It is opposite the pharmacy.',
        'Very common in Mexico. You will also hear frente a.',
      ],
      [
        'Las llaves están encima de la mesa.',
        'The keys are on the table.',
        'Encima de: on top of.',
      ],
      ['Está entre el café y el hotel.', 'It is between the café and the hotel.', 'Entre … y …'],
      ['Está debajo de la cama.', 'It is under the bed.', 'Debajo de: under.'],
    ],
    notice:
      'Location uses estar, not ser: el banco está aquí. Plural things take están: las llaves están en la mesa.',
    pronunciation: 'In encima, stress the middle: en-CI-ma. Debajo has the breathy j: de-BA-jo.',
    reading: ['Farmacia: enfrente del parque', 'Pharmacy: opposite the park'],
    checks: [
      {
        prompt: 'Which verb do you use to say where something is?',
        options: ['estar', 'ser', 'tener'],
        answer: 0,
        explanation: 'Location uses estar: ¿Dónde está?',
      },
      {
        prompt: 'Complete: “Está al lado ___ banco.”',
        options: ['del', 'de el', 'de la'],
        answer: 0,
        explanation: 'De + el contracts to del.',
      },
      {
        prompt: 'Listen. Where is the cash machine?',
        audio: 'El cajero está entre la farmacia y el supermercado.',
        options: [
          'Between the pharmacy and the supermarket',
          'Opposite the pharmacy',
          'Inside the supermarket',
        ],
        answer: 0,
        explanation: 'Entre … y … means between.',
      },
    ],
    writing: {
      prompt: 'Write “It is next to the bank” in Spanish.',
      accepted: ['Está al lado del banco'],
      hint: 'Al lado de + el becomes al lado del.',
      explanation: 'Está al lado del banco: de + el becomes del.',
    },
    speaking:
      'Describe your street: say what is next to, opposite and between the places near your home.',
  },
  {
    id: 'es-pharmacy',
    level: 'A2',
    title: 'Describe symptoms at the pharmacy',
    outcome: 'Say how you feel and since when, and check instructions.',
    phrases: [
      [
        'Me duele el estómago desde ayer.',
        'My stomach has hurt since yesterday.',
        'Doler works like gustar: me duele.',
      ],
      [
        'Tengo fiebre y tos.',
        'I have a fever and a cough.',
        'Spanish uses tener for many symptoms.',
      ],
      ['Estoy mareado.', 'I feel dizzy.', 'Say mareada if you are a woman.'],
      ['¿Cada cuánto lo tomo?', 'How often do I take it?', 'Ask before you leave the pharmacy.'],
      [
        '¿Me lo puede repetir más despacio?',
        'Could you repeat that more slowly?',
        'Never guess with medical instructions.',
      ],
    ],
    notice:
      'This lesson helps you communicate; it is not medical advice. In an emergency, call the local number: 911 in Mexico, 112 in Spain. Labels often say cada ocho horas (every eight hours) or en ayunas (on an empty stomach).',
    pronunciation: 'Duele: DWE-le. Fiebre: FYE-bre, with a quick tapped r.',
    reading: ['1 tableta cada 8 horas, después de comer', '1 tablet every 8 hours, after eating'],
    checks: [
      {
        prompt: 'How do you say “my head hurts”?',
        options: ['Me duele la cabeza.', 'Tengo cabeza.', 'Me duelen la cabeza.'],
        answer: 0,
        explanation: 'One body part takes duele.',
      },
      {
        prompt: 'What does “cada ocho horas” mean?',
        options: ['Every eight hours', 'For eight hours', 'At eight o’clock'],
        answer: 0,
        explanation: 'Cada means every.',
      },
      {
        prompt: 'Listen. Since when has the speaker had a cough?',
        audio: 'Tengo tos desde el lunes y un poco de fiebre.',
        options: ['Since Monday', 'Since yesterday', 'For a week'],
        answer: 0,
        explanation: 'Desde el lunes means since Monday.',
      },
    ],
    writing: {
      prompt: 'Write “I have a fever” in Spanish.',
      accepted: ['Tengo fiebre'],
      hint: 'Tengo + fiebre.',
      explanation: 'Tengo fiebre: Spanish uses tener, not estar, for a fever.',
    },
    speaking:
      'At a pharmacy, describe two symptoms and since when, then ask how often to take the medicine.',
  },
  {
    id: 'es-restaurant',
    level: 'A2',
    title: 'Eat out with friends',
    outcome: 'Order for a group, ask for a recommendation and split the bill.',
    phrases: [
      ['¿Qué nos recomienda?', 'What do you recommend?', 'Polite usted, to the server.'],
      ['Para mí, los tacos al pastor.', 'For me, the tacos al pastor.', 'Para mí when ordering.'],
      ['Sin cebolla, por favor.', 'Without onion, please.', 'Ask for one change.'],
      [
        '¿Nos trae la cuenta, por favor?',
        'Could you bring us the bill, please?',
        'Nos means to us.',
      ],
      ['¿Podemos pagar por separado?', 'Can we pay separately?', 'Split the bill.'],
    ],
    notice:
      'In Mexican restaurants a tip (propina) of about 10 to 15 percent is customary and usually not included. Check the bill for servicio incluido.',
    pronunciation:
      'A word-initial r is rolled, like rr: recomienda sounds like rre-co-MIEN-da. Cebolla is se-BO-ya in Mexico.',
    reading: [
      'Tacos al pastor (3) · $75 · Propina no incluida',
      'Three tacos al pastor · 75 pesos · Tip not included',
    ],
    checks: [
      {
        prompt: 'How do you ask the server for a recommendation?',
        options: ['¿Qué nos recomienda?', '¿Qué hora es?', '¿Algo más?'],
        answer: 0,
        explanation: 'Recomendar means to recommend.',
      },
      {
        prompt: 'What is “la propina”?',
        options: ['The tip', 'The bill', 'The menu'],
        answer: 0,
        explanation: 'Propina is the tip.',
      },
      {
        prompt: 'Listen. What does the speaker not want?',
        audio: 'Para mí una quesadilla sin cebolla, y para ella los tacos.',
        options: ['Onion', 'Cheese', 'Tacos'],
        answer: 0,
        explanation: 'Sin cebolla: without onion.',
      },
    ],
    writing: {
      prompt: 'Write “Can we pay separately?” in Spanish.',
      accepted: ['¿Podemos pagar por separado?'],
      hint: 'Podemos pagar + por separado.',
      explanation: '¿Podemos pagar por separado? splits the bill.',
    },
    speaking:
      'Order for yourself and a friend, change one thing, ask for a recommendation and ask to pay separately.',
  },
  {
    id: 'es-compare',
    level: 'A2',
    title: 'Compare and choose',
    outcome: 'Compare two options and say which one you will take.',
    phrases: [
      [
        'Este es más barato que ese.',
        'This one is cheaper than that one.',
        'Más … que: more … than.',
      ],
      ['Es menos cómodo.', 'It is less comfortable.', 'Menos means less.'],
      ['Es el mejor de la tienda.', 'It is the best in the shop.', 'Mejor and peor are irregular.'],
      ['Es tan bueno como el otro.', 'It is as good as the other one.', 'Tan … como: as … as.'],
      ['Me quedo con este.', 'I will take this one.', 'How you decide in a shop.'],
    ],
    notice:
      'For quality, say mejor (better) and peor (worse), not más bueno or más malo. Este (this) is near you; ese (that) is near the other person.',
    pronunciation:
      'Barato has one tapped r: ba-RA-to. Mejor ends in a tapped r after the breathy j: me-JOR.',
    reading: ['Modelo A: $1,200 · Modelo B: $950', 'Model A: 1,200 pesos · Model B: 950 pesos'],
    checks: [
      {
        prompt: 'Which word means “better”?',
        options: ['mejor', 'más bueno', 'más mejor'],
        answer: 0,
        explanation: 'Mejor is the comparative of bueno.',
      },
      {
        prompt: 'Model A costs 1,200 pesos and Model B costs 950. Which is true?',
        options: ['El modelo B es más barato.', 'El modelo A es más barato.', 'Cuestan lo mismo.'],
        answer: 0,
        explanation: 'B costs less, so it is más barato.',
      },
      {
        prompt: 'Listen. Why does the speaker choose it?',
        audio: 'Este es más caro, pero es más cómodo. Me quedo con este.',
        options: ['It is more comfortable', 'It is cheaper', 'It is the only one'],
        answer: 0,
        explanation: 'Más cómodo: more comfortable.',
      },
    ],
    writing: {
      prompt: 'Write “I will take this one” in Spanish.',
      accepted: ['Me quedo con este'],
      hint: 'Quedarse con means to keep or take.',
      explanation: 'Me quedo con este is how you decide in a shop.',
    },
    speaking:
      'Compare two phones or two cafés you know: price, comfort and quality. Decide with Me quedo con…',
  },
  {
    id: 'es-because',
    level: 'A2',
    title: 'Because, that and if: porque, que, si',
    outcome: 'Give reasons, share opinions and talk about conditions.',
    phrases: [
      [
        'No voy porque estoy cansado.',
        'I am not going because I am tired.',
        'Porque gives the reason. Cansada for a woman.',
      ],
      ['Creo que es una buena idea.', 'I think it is a good idea.', 'Creo que + your opinion.'],
      [
        'Si llueve, nos quedamos en casa.',
        'If it rains, we stay at home.',
        'Si + present, present.',
      ],
      [
        '¿Por qué no vienes?',
        'Why aren’t you coming?',
        '¿Por qué? is two words with an accent and asks why.',
      ],
      [
        'Dice que llega tarde.',
        'She says she will be late.',
        'Report what someone said with dice que.',
      ],
    ],
    notice:
      '¿Por qué? (two words, accent) asks why; porque (one word) answers because. Si without an accent means if; sí with an accent means yes.',
    pronunciation: 'Por qué is stressed on qué: por-QUÉ. Porque is stressed on por: POR-que.',
    reading: ['Si llueve, la clase es en línea.', 'If it rains, the class is online.'],
    checks: [
      {
        prompt: 'Which word means “because”?',
        options: ['porque', '¿por qué?', 'si'],
        answer: 0,
        explanation: 'Porque, one word without an accent, means because.',
      },
      {
        prompt: 'What does “si” without an accent mean?',
        options: ['if', 'yes', 'so'],
        answer: 0,
        explanation: 'Si is if; sí with an accent is yes.',
      },
      {
        prompt: 'Listen. Why can’t the speaker go?',
        audio: 'No puedo ir hoy porque tengo que trabajar.',
        options: ['They have to work', 'They are ill', 'It is raining'],
        answer: 0,
        explanation: 'Porque tengo que trabajar: because I have to work.',
      },
    ],
    writing: {
      prompt: 'Write “I think it is a good idea” in Spanish.',
      accepted: ['Creo que es una buena idea'],
      hint: 'Creo que + es una buena idea.',
      explanation: 'Creo que introduces your opinion.',
    },
    speaking:
      'Decline an invitation politely with a reason (porque…), then suggest another plan with si…',
  },
  {
    id: 'es-feelings',
    level: 'A2',
    title: 'Talk about feelings and react',
    outcome: 'Say how you feel and respond kindly to someone’s news.',
    phrases: [
      [
        'Estoy muy contento.',
        'I am very happy.',
        'Feelings use estar. Say contenta if you are a woman.',
      ],
      ['Estoy un poco preocupada.', 'I am a bit worried.', 'Un poco softens it.'],
      ['¡Qué bien!', 'That’s great!', 'React to good news.'],
      ['¡Qué pena!', 'What a shame!', 'React to bad news. Lo siento mucho is stronger.'],
      ['No te preocupes.', 'Don’t worry.', 'Reassure a friend, using tú.'],
    ],
    notice:
      'Use estar for feelings that change: estoy cansado, estoy nervioso. ¡Qué + a word! makes quick reactions: ¡Qué rico! (delicious) or, informally in Mexico, ¡Qué padre! (how cool).',
    pronunciation: 'Exclamations rise and then fall: ¡Qué BIEN! Put the energy on the key word.',
    reading: ['¡Aprobé el examen!', 'I passed the exam!'],
    checks: [
      {
        prompt: 'A friend passed an exam. What do you say?',
        options: ['¡Qué bien!', '¡Qué pena!', 'No te preocupes.'],
        answer: 0,
        explanation: '¡Qué bien! celebrates good news.',
      },
      {
        prompt: 'Which sentence says “I am tired”?',
        options: ['Estoy cansado.', 'Soy cansado.', 'Tengo cansado.'],
        answer: 0,
        explanation: 'Changing states use estar.',
      },
      {
        prompt: 'Listen. Why is the speaker nervous?',
        audio: 'Estoy un poco nerviosa porque mañana tengo una entrevista.',
        options: ['She has an interview tomorrow', 'She lost her job', 'She is ill'],
        answer: 0,
        explanation: 'Mañana tengo una entrevista: tomorrow I have an interview.',
      },
    ],
    writing: {
      prompt: 'Write “Don’t worry” to a friend in Spanish.',
      accepted: ['No te preocupes'],
      hint: 'No te + preocupes.',
      explanation: 'No te preocupes is the kind, informal way to reassure someone.',
    },
    speaking:
      'Tell a friend one piece of good news and one worry. Let them react, then react to theirs.',
  },
  {
    id: 'es-mexico',
    level: 'A2',
    title: 'Sound natural in Mexico',
    outcome: 'Understand and use common everyday Mexican expressions.',
    phrases: [
      [
        '¿Mande?',
        'Pardon? or Yes?',
        'Polite in Mexico when you did not hear, or when someone calls your name.',
      ],
      [
        'Ahorita.',
        'In a moment, or right now.',
        'Context decides: it can mean now, soon or later.',
      ],
      ['¡Qué padre!', 'How cool!', 'Informal and Mexican.'],
      ['Órale.', 'OK, wow, or come on.', 'Flexible and informal; listen to the tone.'],
      ['Pues…', 'Well…', 'A natural filler while you think.'],
    ],
    notice:
      'These are informal and Mexican: perfect with friends, less so in a formal email. ¿Mande? is the exception: it is polite, and Mexicans use it instead of ¿Qué? to ask someone to repeat.',
    pronunciation:
      'In fast speech pues often shortens to pos. In ahorita the h is silent: a-o-RI-ta.',
    reading: ['—¿Ya vienes? —Ahorita voy.', '“Are you coming?” “I’m coming in a moment.”'],
    checks: [
      {
        prompt: 'In Mexico, you did not hear what someone said. What is the polite reaction?',
        options: ['¿Mande?', '¿Qué onda?', '¡Órale!'],
        answer: 0,
        explanation: '¿Mande? politely asks someone to repeat.',
      },
      {
        prompt: 'What can “ahorita” mean?',
        options: ['Now, soon or later, depending on context', 'Only yesterday', 'Never'],
        answer: 0,
        explanation: 'Ahorita is flexible; the context tells you how soon.',
      },
      {
        prompt: 'Listen. How did the speaker find the match?',
        audio: '¿Viste el partido? ¡Qué padre estuvo!',
        options: ['Great', 'Boring', 'Too long'],
        answer: 0,
        explanation: '¡Qué padre! is enthusiastic.',
      },
    ],
    writing: {
      prompt: 'Write the polite Mexican way to say “Pardon?”',
      accepted: ['¿Mande?'],
      hint: 'One word that starts with M.',
      explanation: '¿Mande? is polite and very Mexican.',
    },
    speaking:
      'Have a short chat where you use pues to think, ¿mande? to ask for repetition and ¡qué padre! to react.',
  },
  {
    id: 'es-fast-speech',
    level: 'A2',
    title: 'Understand fast, everyday Spanish',
    outcome: 'Recognise how words join and shorten in real speech.',
    phrases: [
      ['¿Bueno?', 'Hello? (on the phone)', 'How most people answer the phone in Mexico.'],
      ['Voy pa’ la casa.', 'I’m heading home.', 'Pa’ is a spoken short form of para.'],
      ['’Tá bien.', 'It’s fine.', 'Fast speech drops the es of está.'],
      ['¿Qué tal?', 'How’s it going?', 'Often runs together: ¿quetal?'],
      ['Nos vemos.', 'See you.', 'Said as one smooth unit.'],
    ],
    notice:
      'Spanish links words: a final vowel joins the next vowel, so lo hago sounds like loago. Recognise short forms like pa’ and ’tá, but write the full forms para and está.',
    pronunciation:
      'Practise linking: va a ir sounds close to vair, and ¿qué hora es? like keoraes. Smooth links make you easier to understand.',
    reading: ['Voy pa’ la casa = Voy para la casa', 'I’m heading home (spoken form = full form)'],
    checks: [
      {
        prompt: 'Someone in Mexico answers the phone with “¿Bueno?” What do they mean?',
        options: ['Hello?', 'Good?', 'Goodbye'],
        answer: 0,
        explanation: '¿Bueno? is the usual phone hello in Mexico.',
      },
      {
        prompt: 'What is “pa’” short for?',
        options: ['para', 'padre', 'pues'],
        answer: 0,
        explanation: 'Pa’ is spoken para.',
      },
      {
        prompt: 'Listen. What will the speaker do?',
        audio: 'Está bien, voy para allá en cinco minutos.',
        options: ['Come over in five minutes', 'Call back later', 'Stay at home'],
        answer: 0,
        explanation: 'Voy para allá: I’m going over there.',
      },
    ],
    writing: {
      prompt: 'Write the full form of “’Tá bien”.',
      accepted: ['Está bien'],
      hint: 'Add back the missing es.',
      explanation: '’Tá bien is spoken; está bien is the full form.',
    },
    speaking:
      'Answer a pretend phone call with ¿Bueno?, then say you are on your way home with Voy pa’ la casa.',
  },
  {
    id: 'es-flight',
    level: 'A2',
    title: 'When the flight is delayed',
    outcome: 'Handle a delay or a missed connection at the airport.',
    phrases: [
      ['Mi vuelo está retrasado.', 'My flight is delayed.', 'You will also hear demorado.'],
      ['Perdí mi conexión.', 'I missed my connection.', 'Perder means to miss, or to lose.'],
      [
        '¿A qué hora sale el próximo vuelo?',
        'When does the next flight leave?',
        'Próximo means next.',
      ],
      [
        '¿Me puede cambiar el boleto?',
        'Can you change my ticket?',
        'Boleto in Mexico; billete in Spain.',
      ],
      [
        '¿Me da un comprobante, por favor?',
        'Could I have written confirmation, please?',
        'Ask for proof for insurance or a claim.',
      ],
    ],
    notice:
      'Airport screens use retrasado (delayed), cancelado (cancelled), embarcando (boarding) and puerta (gate). Stay calm and specific: give your flight number and say what you need.',
    pronunciation:
      'Retrasado starts with a rolled r: rre-tra-SA-do. In conexión, the x sounds like ks: co-nek-SIÓN.',
    reading: [
      'AM 405 · CANCÚN · RETRASADO · PUERTA 12',
      'Flight AM 405 to Cancún · Delayed · Gate 12',
    ],
    checks: [
      {
        prompt: 'The screen says EMBARCANDO. What does it mean?',
        options: ['Boarding', 'Delayed', 'Cancelled'],
        answer: 0,
        explanation: 'Embarcando means boarding.',
      },
      {
        prompt: 'How do you say you missed your connection?',
        options: ['Perdí mi conexión.', 'Tengo mi conexión.', 'Mi vuelo sale.'],
        answer: 0,
        explanation: 'Perdí means I missed.',
      },
      {
        prompt: 'Listen. What time is the next flight?',
        audio: 'El vuelo a Monterrey está cancelado. El próximo sale a las ocho.',
        options: ['Eight', 'Six', 'Eleven'],
        answer: 0,
        explanation: 'A las ocho: at eight.',
      },
    ],
    writing: {
      prompt: 'Write “My flight is delayed” in Spanish.',
      accepted: ['Mi vuelo está retrasado', 'Mi vuelo está demorado'],
      hint: 'Mi vuelo + está + retrasado.',
      explanation: 'Mi vuelo está retrasado: estar describes the current situation.',
    },
    speaking:
      'At an airline desk: explain that you missed your connection, ask about the next flight and ask for written confirmation.',
  },
  {
    id: 'es-used-to',
    level: 'A2',
    title: 'Describe how things used to be',
    outcome: 'Contrast past habits and background with single finished events.',
    phrases: [
      [
        'Cuando era niño, vivía en Lahore.',
        'When I was a child, I lived in Lahore.',
        'Imperfect for background and habits. Say niña if you are a woman.',
      ],
      ['Antes trabajaba en un banco.', 'I used to work in a bank.', 'Antes + imperfect: used to.'],
      [
        'Siempre jugábamos en la calle.',
        'We always played in the street.',
        'Siempre and todos los días go with the imperfect.',
      ],
      [
        'Llovía cuando salí.',
        'It was raining when I left.',
        'A background (llovía) and a single event (salí).',
      ],
      [
        'Un día conocí a mi mejor amigo.',
        'One day I met my best friend.',
        'Un día marks a single event: preterite.',
      ],
    ],
    notice:
      'Spanish has two simple past tenses. The imperfect (vivía, trabajaba) sets the scene and describes habits; the preterite (salí, conocí) moves the story forward. Think background versus events.',
    pronunciation:
      'Keep the accent in vivía clear: vi-VÍ-a. In trabajaba, stress the middle: tra-ba-JA-ba.',
    reading: [
      'Antes: oficina. Ahora: trabajo desde casa.',
      'Before: an office. Now: I work from home.',
    ],
    checks: [
      {
        prompt: 'Which form means “I used to work”?',
        options: ['trabajaba', 'trabajé', 'trabajo'],
        answer: 0,
        explanation: 'Trabajaba is the imperfect: a past habit.',
      },
      {
        prompt: '“Llovía cuando salí.” Which part is the background?',
        options: ['Llovía', 'Salí', 'Cuando'],
        answer: 0,
        explanation: 'Llovía (it was raining) sets the scene.',
      },
      {
        prompt: 'Listen. What did the speaker do every day?',
        audio: 'Cuando era pequeña, vivía cerca del mar y nadaba todos los días.',
        options: ['Swim', 'Work', 'Study'],
        answer: 0,
        explanation: 'Nadaba todos los días: she swam every day.',
      },
    ],
    writing: {
      prompt: 'Write “I used to work in a bank” in Spanish.',
      accepted: ['Antes trabajaba en un banco', 'Trabajaba en un banco'],
      hint: 'Use trabajaba.',
      explanation: 'Trabajaba is the imperfect for a past habit or state.',
    },
    speaking:
      'Describe your life five years ago with three habits (antes…, siempre…) and one event that changed it (un día…).',
  },
]);
