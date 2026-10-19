import { defineUnit } from './types';

export const spanishA1Unit2 = defineUnit(
  'ES',
  'A1',
  {
    id: 'es-a1-u2',
    number: 2,
    icon: 'earth',
    title: 'A little about you',
    canDo: 'Exchange your origin, home, languages and occupation, then introduce someone else.',
  },
  [
    {
      id: 'es-a1-u2-words',
      session: 'Words',
      title: 'Where you live and what you do',
      outcome: 'Give a few useful facts about yourself without a long memorised speech.',
      minutes: 7,
      steps: [
        {
          kind: 'choose',
          prompt: 'You meet Ana again. Which phrase gives your name?',
          options: ['Soy de Pakistán.', 'Me llamo Sara.', 'Hasta luego.'],
          answer: 1,
          explanation:
            'Me llamo gives a name. Soy de gives an origin. Today you will add where you live and what you do.',
        },
        {
          kind: 'scene',
          title: 'Two places in one answer',
          intro:
            'Ana already knows Omar’s name. They are at their language exchange in Mexico City. Use English to check unfamiliar words; you will practise the new patterns next.',
          lines: [
            { speaker: 'Ana', text: '¿De dónde eres, Omar?', meaning: 'Where are you from, Omar?' },
            {
              speaker: 'Omar',
              text: 'Soy de Pakistán, pero vivo en México.',
              meaning: 'I’m from Pakistan, but I live in Mexico.',
            },
            { speaker: 'Ana', text: '¿Hablas español?', meaning: 'Do you speak Spanish?' },
            {
              speaker: 'Omar',
              text: 'Sí, hablo un poco de español.',
              meaning: 'Yes, I speak a little Spanish.',
            },
          ],
          note: 'Someone’s origin and current home can be different. Here, pero means but and un poco means a little.',
        },
        {
          kind: 'teach',
          title: 'Home and languages',
          items: [
            {
              target: 'Vivo en México.',
              meaning: 'I live in Mexico.',
              note: 'Vivo en + place tells where you live now.',
            },
            {
              target: 'Hablo español.',
              meaning: 'I speak Spanish.',
              note: 'Hablo + language. Español starts with a lowercase letter inside a sentence.',
            },
            {
              target: 'Hablo inglés.',
              meaning: 'I speak English.',
              note: 'Keep the accent in inglés. You can add another language with y, meaning and.',
            },
          ],
        },
        {
          kind: 'choose',
          context: 'Soy de Chile. Vivo en México.',
          prompt: 'Where does this person live now?',
          options: ['Chile', 'It does not say', 'México'],
          answer: 2,
          explanation: 'Vivo en México gives the current home. Soy de Chile gives the origin.',
        },
        {
          kind: 'rule',
          title: 'Read a short profile',
          body: 'These labels help you find the right detail. País is a country; ciudad is a city. An idioma is a language. Origen means origin; residencia means where you live now. Do not assume someone’s language or nationality from their name.',
          table: [
            ['país', 'country: México, España, Chile'],
            ['ciudad', 'city: Puebla, Madrid, Santiago'],
            ['idioma', 'language: español, inglés, urdu'],
            ['ocupación', 'occupation: estudiante, profesor, profesora'],
          ],
        },
        {
          kind: 'choose',
          context: 'País: México\nCiudad: Puebla\nIdioma: español',
          prompt: 'Which entry names a city?',
          options: ['Puebla', 'México', 'español'],
          answer: 0,
          explanation: 'Puebla is the city. The country is México and the language is español.',
        },
        {
          kind: 'teach',
          title: 'A role you can introduce',
          items: [
            {
              target: 'Soy estudiante.',
              meaning: 'I am a student.',
              note: 'Estudiante has the same form here for a woman or a man.',
            },
            {
              target: 'Soy profesor.',
              meaning: 'I am a teacher. (masculine)',
              note: 'Profesor is the masculine form. Learn it as a role, not a guess about someone’s name.',
            },
            {
              target: 'Soy profesora.',
              meaning: 'I am a teacher. (feminine)',
              note: 'Profesora is the feminine form. Use a role that fits you or your fictional character.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'Keep it simple',
          body: 'With an unmodified occupation after soy, Spanish normally leaves out a/an: Soy estudiante. To say where you work, you can use Trabajo en una tienda: I work in a shop. This is an optional useful chunk; work gets more practice in Unit 11.',
          examples: ['Soy estudiante.', 'Trabajo en una tienda.'],
        },
        {
          kind: 'match',
          prompt: 'Match each fact to its purpose.',
          pairs: [
            ['Vivo en México.', 'Say where you live'],
            ['Hablo inglés.', 'Name a language you speak'],
            ['Soy estudiante.', 'Give your occupation'],
            ['Soy de Pakistán.', 'Say where you are from'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which detail does the speaker give?',
          audio: 'Hablo español e inglés.',
          options: ['Their occupation', 'The languages they speak', 'Their current city'],
          answer: 1,
          explanation:
            'The speaker names Spanish and English. You hear e instead of y before the i sound in inglés. For your own response, Hablo español is enough.',
        },
        {
          kind: 'build',
          prompt: 'Say “I live in Mexico.”',
          answer: ['Vivo', 'en', 'México.'],
          extra: ['de'],
          explanation: 'Vivo en gives your current home. Soy de gives your origin.',
        },
        {
          kind: 'type',
          prompt: 'You are a student. Give that fact using soy.',
          accepted: ['Soy estudiante.', 'Yo soy estudiante.'],
          hint: 'Use soy + estudiante, with no un or una.',
          explanation:
            'Soy estudiante is complete. Yo soy estudiante also works; yo is often unnecessary because soy already identifies the speaker.',
        },
        {
          kind: 'speak',
          prompt:
            'Tell a classmate where you live, one language you speak and your occupation. Use your own or invented details.',
          lines: ['Vivo en México.', 'Hablo inglés.', 'Soy estudiante.'],
          tip: 'In inglés the last syllable is stressed. In estudiante, listen for es-tu-DIAN-te.',
          mission: {
            checks: ['Give your current home, not only your origin.', 'Add a language and a role.'],
            twist: 'Your character now lives in Puebla and is a teacher. Change those two facts.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u2-grammar',
      session: 'Grammar',
      title: 'Ask back without mixing up the facts',
      outcome: 'Ask about origin, residence and languages, and use common nationality forms.',
      minutes: 8,
      steps: [
        {
          kind: 'choose',
          context: 'Me llamo Lucía. Soy de España. Vivo en Chile.',
          prompt: 'Lucía is from which country?',
          options: ['Chile', 'Lucía', 'España'],
          answer: 2,
          explanation: 'Soy de España gives her origin. Vivo en Chile tells you where she lives.',
        },
        {
          kind: 'teach',
          title: 'Three questions for a classmate',
          items: [
            {
              target: '¿De dónde eres?',
              meaning: 'Where are you from? (tú)',
              note: 'Ask about origin. The answer can name a country or city.',
            },
            {
              target: '¿Dónde vives?',
              meaning: 'Where do you live? (tú)',
              note: 'Ask about the current home.',
            },
            {
              target: '¿Qué idiomas hablas?',
              meaning: 'What languages do you speak? (tú)',
              note: 'Ask instead of assuming from someone’s nationality.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'Change the ending when you ask',
          body: 'The verb tells you who the sentence is about. You can often leave out yo or tú when the meaning is clear. Keep them when they help clarify or contrast. Start with these singular patterns; the plural forms come later.',
          table: [
            ['yo: I', 'soy / vivo / hablo'],
            ['tú: you, familiar', 'eres / vives / hablas'],
            ['él, ella, usted', 'es / vive / habla'],
          ],
          examples: ['Vivo en Puebla. ¿Dónde vives?', 'Hablo inglés. ¿Qué idiomas hablas?'],
        },
        {
          kind: 'match',
          prompt: 'Ask for the detail you need.',
          pairs: [
            ['¿De dónde eres?', 'Your origin'],
            ['¿Dónde vives?', 'Your current home'],
            ['¿Qué idiomas hablas?', 'Your languages'],
            ['¿Cómo te llamas?', 'Your name'],
          ],
        },
        {
          kind: 'build',
          prompt: 'Ask a classmate where they live.',
          answer: ['¿Dónde', 'vives?'],
          extra: ['vivo'],
          explanation: 'Vives is the tú form. Vivo is the I form.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which question did the speaker answer?',
          audio: 'Vivo en Madrid.',
          options: ['¿Dónde vives?', '¿De dónde eres?', '¿Cómo te llamas?'],
          answer: 0,
          explanation:
            'Vivo en Madrid answers where the speaker lives. It does not establish their origin.',
        },
        {
          kind: 'teach',
          title: 'Nationality is another detail',
          items: [
            {
              target: 'Soy mexicano.',
              meaning: 'I am Mexican. (masculine)',
              note: 'Mexicano describes nationality, while México names the country.',
            },
            {
              target: 'Soy mexicana.',
              meaning: 'I am Mexican. (feminine)',
              note: 'Here the ending changes from -o to -a.',
            },
            {
              target: 'Soy español.',
              meaning: 'I am Spanish. (masculine)',
              note: 'Español has an accent and ends in a consonant.',
            },
            {
              target: 'Soy española.',
              meaning: 'I am Spanish. (feminine)',
              note: 'Española adds -a and has no written accent. Other nationalities have other patterns.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'A place, a nationality, a language',
          body: 'Country and city names take capitals: México, España, Madrid. Nationalities and languages normally use lowercase: mexicana, español. A country of origin does not always tell someone’s citizenship, and speaking Spanish does not make someone Spanish. Soy de + place is a useful alternative when you want to describe origin.',
          table: [
            ['Ella es mexicana.', 'The adjective matches ella.'],
            ['Él es mexicano.', 'The adjective matches él.'],
            ['Ella es estudiante.', 'Estudiante stays the same.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Complete the sentence using the feminine nationality form: “Ella es…”',
          options: ['mexicano.', 'mexicana.', 'México.'],
          answer: 1,
          explanation:
            'Ella es mexicana uses the feminine adjective. México is a country name, not an adjective.',
        },
        {
          kind: 'choose',
          prompt: 'Which sentence says that you speak Spanish?',
          options: ['Soy español.', 'Soy de España.', 'Hablo español.'],
          answer: 2,
          explanation:
            'Hablo español tells a language. Soy español states a nationality; Soy de España gives origin.',
        },
        {
          kind: 'type',
          prompt: 'Ask a classmate where they are from. Use tú.',
          accepted: ['¿De dónde eres?', '¿De dónde eres tú?', '¿Tú de dónde eres?'],
          hint: 'Begin with De dónde; use eres for tú.',
          explanation:
            '¿De dónde eres? is natural without tú. The question word dónde has an accent.',
        },
        {
          kind: 'rule',
          title: 'Join two languages',
          body: 'Y means and. It becomes e before a word beginning with an i sound: español e inglés. You can keep a sentence short with one language, or say inglés y español in the other order.',
          examples: ['Hablo español e inglés.', 'Hablo inglés y español.'],
        },
        {
          kind: 'build',
          prompt: 'Say you speak English and Spanish, in that order.',
          answer: ['Hablo', 'inglés', 'y', 'español.'],
          extra: ['soy'],
          explanation: 'Hablo names the languages you speak. Y joins the two language names here.',
        },
        {
          kind: 'speak',
          prompt:
            'Meet a classmate. Give your origin and current home, then ask their origin, home or languages. Choose details rather than reading a fixed speech.',
          lines: ['Soy de Pakistán.', 'Vivo en México.', '¿De dónde eres?', '¿Qué idiomas hablas?'],
          tip: 'Listen for the stressed syllables in México, mexicano and española. A written accent helps you place the stress; do not add one to every nationality.',
          mission: {
            checks: ['Keep origin and residence separate.', 'Ask a question using the tú form.'],
            twist:
              'Your partner says “Vivo en Madrid.” You still need their origin. Choose a different question.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u2-talk',
      session: 'Real talk',
      title: 'Bring someone into the conversation',
      outcome:
        'Introduce a friend, ask a question back and adapt to an established form of address.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'Ana introduces Diego',
          intro:
            'At the exchange, Ana introduces Diego, who is from Spain and now lives in Puebla.',
          lines: [
            {
              speaker: 'Ana',
              text: 'Este es Diego. Es de España.',
              meaning: 'This is Diego. He’s from Spain.',
            },
            {
              speaker: 'Omar',
              text: 'Mucho gusto, Diego. ¿Dónde vives?',
              meaning: 'Nice to meet you, Diego. Where do you live?',
            },
            {
              speaker: 'Diego',
              text: 'Vivo en Puebla. ¿Y tú?',
              meaning: 'I live in Puebla. And you?',
            },
            {
              speaker: 'Omar',
              text: 'Yo vivo en Ciudad de México.',
              meaning: 'I live in Mexico City.',
            },
          ],
          note: '¿Y tú? asks the same question back. Here yo makes the contrast between the two speakers clear.',
        },
        {
          kind: 'teach',
          title: 'A short introduction',
          items: [
            {
              target: 'Este es Diego.',
              meaning: 'This is Diego.',
              note: 'Este introduces a male person here.',
            },
            {
              target: 'Esta es Ana.',
              meaning: 'This is Ana.',
              note: 'Esta introduces a female person here.',
            },
            {
              target: 'Es de España.',
              meaning: 'He or she is from Spain.',
              note: 'The person is already clear from context. Es also works with usted.',
            },
          ],
        },
        {
          kind: 'choose',
          context: 'Esta es Ana. Es mexicana. Vive en Puebla.',
          prompt: 'Which introduction matches the text?',
          options: [
            'Ana lives in Spain.',
            'Ana is Mexican and lives in Puebla.',
            'Ana only speaks English.',
          ],
          answer: 1,
          explanation:
            'Es mexicana gives nationality and vive en Puebla gives residence. No language is stated.',
        },
        {
          kind: 'rule',
          title: 'Keep one form of address',
          body: 'With tú, ask ¿De dónde eres? or ¿Dónde vives? If a conversation uses usted, use ¿De dónde es usted? or ¿Dónde vive? Usted uses the same verb forms as él and ella. Local habits vary; follow the established form rather than judging by age.',
          table: [
            ['tú', 'eres / vives / hablas'],
            ['usted', 'es / vive / habla'],
          ],
        },
        {
          kind: 'teach',
          title: 'Keep the exchange moving',
          items: [
            {
              target: '¿Y tú?',
              meaning: 'And you? (tú)',
              note: 'Ask the same question back to a peer when tú is established.',
            },
            {
              target: '¿Y usted?',
              meaning: 'And you? (usted)',
              note: 'Ask back while keeping usted.',
            },
            {
              target: '¿Dónde vive?',
              meaning: 'Where do you live? (usted)',
              note: 'When addressed to someone using usted. In another context it can mean where he or she lives.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'A receptionist uses usted with you. Which question keeps that form?',
          options: ['¿Dónde vives?', '¿Y tú?', '¿Dónde vive?'],
          answer: 2,
          explanation: '¿Dónde vive? uses the usted form. The other two use tú.',
        },
        {
          kind: 'build',
          prompt: 'Introduce Ana to another person.',
          answer: ['Esta', 'es', 'Ana.'],
          extra: ['soy'],
          explanation: 'Esta es introduces Ana. Soy introduces yourself.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. What do you learn about Ana?',
          audio: 'Esta es Ana. Habla español e inglés.',
          options: [
            'She speaks two named languages.',
            'She lives in England.',
            'She teaches Spanish.',
          ],
          answer: 0,
          explanation:
            'Habla español e inglés gives two languages. It does not tell you where she lives or works.',
        },
        {
          kind: 'match',
          prompt: 'Follow the person being talked about.',
          pairs: [
            ['Soy estudiante.', 'I am a student.'],
            ['Es estudiante.', 'He or she is a student.'],
            ['Hablo inglés.', 'I speak English.'],
            ['Habla inglés.', 'He or she speaks English.'],
          ],
        },
        {
          kind: 'type',
          prompt:
            'Someone asks where you live. You answer, then ask the same question back using tú. Write only “And you?”',
          accepted: ['¿Y tú?'],
          hint: 'Use Y + tú, with the accent on tú.',
          explanation:
            '¿Y tú? works because the question is already clear. Tú with an accent means you.',
        },
        {
          kind: 'choose',
          prompt: 'You missed Diego’s answer. Which response asks for a slower pace?',
          options: ['Más despacio, por favor.', 'Soy estudiante.', '¿Y tú?'],
          answer: 0,
          explanation:
            'Use your Unit 1 repair phrase when you need help. Asking back is useful only once you understand the exchange.',
        },
        {
          kind: 'speak',
          prompt:
            'Introduce a fictional friend. Give their name, origin and one language. Then speak as that friend and ask the other person a question.',
          lines: ['Esta es Ana.', 'Es de España.', 'Habla inglés.', '¿Y tú?'],
          mission: {
            checks: [
              'Use es or habla for the friend.',
              'Change to a question addressed to the other person.',
            ],
            twist:
              'Now introduce Diego instead. Later, speak to a receptionist using usted and ask where they live.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u2-task',
      session: 'Exam task',
      title: 'Find the right person for your exchange',
      outcome:
        'Read different personal profiles and introduce someone using the details that matter.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'Meet someone new on paper',
          body: 'Read the profiles carefully, then use new details in your own introduction. These short tasks practise personal information needed for A1. They are not a complete DELE reading paper or an assessed oral interview.',
        },
        {
          kind: 'choose',
          context:
            'Hola. Me llamo Julia. Soy de Chile. Vivo en Madrid. Hablo español e inglés. Soy profesora.',
          prompt: 'Where does Julia live?',
          options: ['Chile', 'Madrid', 'It does not say'],
          answer: 1,
          explanation: 'Vivo en Madrid is the residence. Chile is her origin.',
        },
        {
          kind: 'choose',
          context:
            'A. Soy Pablo. Vivo en Puebla. Hablo español. Soy estudiante.\nB. Soy Isabel. Vivo en Madrid. Hablo español e inglés. Soy profesora.\nC. Soy Hugo. Vivo en Puebla. Hablo español e inglés. Soy profesor.',
          prompt:
            'You want to meet a teacher who lives in Puebla and speaks English. Which profile fits all three details?',
          options: ['A: Pablo', 'B: Isabel', 'C: Hugo'],
          answer: 2,
          explanation:
            'Hugo is a profesor, lives in Puebla and speaks English. Pablo is a student; Isabel lives in Madrid.',
        },
        {
          kind: 'type',
          context: 'Nombre: Nuria\nOrigen: España\nCiudad actual: Puebla',
          prompt: 'Speak as Nuria. Write the sentence that gives your current home.',
          accepted: ['Vivo en Puebla.', 'Yo vivo en Puebla.'],
          hint: 'Use Vivo en + the current city.',
          explanation:
            'Vivo en Puebla gives residence. Soy de España would give a different detail.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which fact is explicitly stated?',
          audio: 'Soy de México. Vivo en Chile. Hablo inglés.',
          options: [
            'The speaker lives in Chile.',
            'The speaker is from England.',
            'The speaker is a teacher.',
          ],
          answer: 0,
          explanation:
            'Vivo en Chile is stated. A language does not tell you origin or occupation.',
        },
        {
          kind: 'match',
          prompt: 'Choose a question for each missing field.',
          pairs: [
            ['¿Cómo te llamas?', 'Nombre'],
            ['¿De dónde eres?', 'Origen'],
            ['¿Dónde vives?', 'Residencia'],
            ['¿Qué idiomas hablas?', 'Idiomas'],
          ],
        },
        {
          kind: 'type',
          context: 'Esta es Marta. Ella es profesora.',
          prompt: 'Marta speaks English. Add a sentence about her using hablar.',
          accepted: ['Habla inglés.', 'Ella habla inglés.', 'Marta habla inglés.'],
          hint: 'Use habla for Marta, then inglés.',
          explanation: 'Habla is the third-person singular form. Hablo would mean I speak.',
        },
        {
          kind: 'choose',
          context: 'Nombre: Daniel\nResidencia: Madrid',
          prompt: 'Can you conclude that Daniel is Spanish?',
          options: [
            'Yes, because he lives in Madrid.',
            'No. His nationality is not given.',
            'Yes, because of his name.',
          ],
          answer: 1,
          explanation:
            'Residence and names do not establish nationality. Ask for the information you need.',
        },
        {
          kind: 'speak',
          prompt:
            'Choose an invented person. Introduce them with a name, origin, home and language. Then become that person and answer “¿Dónde vives?” without reading the model.',
          lines: [
            'Este es Diego.',
            'Es de España.',
            'Vive en Puebla.',
            'Habla español.',
            'Vivo en Puebla.',
          ],
          mission: {
            checks: [
              'Keep the profile’s origin and home separate.',
              'Change vive to vivo when answering as the person.',
              'Ask for repetition if you need it.',
            ],
            twist:
              'Your person now lives in Madrid and speaks English too. Update the introduction and ask a classmate about their languages.',
          },
        },
      ],
    },
  ],
);
