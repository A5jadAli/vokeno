import { defineUnit } from './types';

// People in your life, without assuming what a learner's household looks like: family, partner,
// friends or housemates are all valid answers.
export const spanishA1Unit5 = defineUnit(
  'ES',
  'A1',
  {
    id: 'es-a1-u5',
    number: 5,
    icon: 'account-group-outline',
    title: 'The people in your life',
    canDo: 'Say who someone is, describe them in a few words and introduce them to others.',
  },
  [
    {
      id: 'es-a1-u5-words',
      session: 'Words',
      title: 'Who is who?',
      outcome: 'Say who someone in a photo is and give their name.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'A photo on Ana’s phone',
          intro:
            'At the language exchange, Ana shows Omar a photo from a family lunch. Listen for how she says who each person is.',
          lines: [
            { speaker: 'Omar', text: '¿Quién es?', meaning: 'Who’s that?' },
            {
              speaker: 'Ana',
              text: 'Es mi hermana. Se llama Paola.',
              meaning: 'That’s my sister. Her name is Paola.',
            },
            { speaker: 'Omar', text: '¿Y él?', meaning: 'And him?' },
            {
              speaker: 'Ana',
              text: 'Es mi papá. Y ella es mi amiga Sofía.',
              meaning: 'That’s my dad. And she’s my friend Sofía.',
            },
          ],
          note: 'Es mi… says who someone is to you. Se llama… gives their name, like me llamo for yourself.',
        },
        {
          kind: 'teach',
          title: 'People in your life',
          items: [
            {
              target: 'mi mamá',
              meaning: 'my mum',
              note: 'Warm and everyday in Mexico. Madre is more formal.',
            },
            { target: 'mi papá', meaning: 'my dad', note: 'Padre is the more formal word.' },
            { target: 'mi hermano', meaning: 'my brother', note: 'The h is silent: er-MA-no.' },
            { target: 'mi hermana', meaning: 'my sister' },
            {
              target: 'mi amiga',
              meaning: 'my friend (a woman)',
              note: 'Mi amigo for a man.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Paola is Ana’s sister. What does Ana say about her?',
          options: ['Es mi hermana.', 'Es mi hermano.', 'Es mi mamá.'],
          answer: 0,
          explanation: 'Hermana is a sister. Hermano is a brother; mamá is a mum.',
        },
        {
          kind: 'teach',
          title: 'Ask who, give a name',
          items: [
            {
              target: '¿Quién es?',
              meaning: 'Who is it? / Who’s that?',
              note: 'Point at a photo or a person and ask.',
            },
            {
              target: 'Se llama Paola.',
              meaning: 'Her name is Paola.',
              note: 'Se llama gives someone else’s name. You learned ¿Cómo se llama? in Unit 1.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'Every family is different',
          body: 'Talk about the people who matter to you: family, a partner, friends or housemates. Hermanos can mean brothers, or brothers and sisters together. Padres means parents, and in Mexico mis papás means my parents too.',
          table: [
            ['abuelo / abuela', 'grandfather / grandmother'],
            ['hijo / hija', 'son / daughter'],
            ['esposo / esposa', 'husband / wife'],
            ['pareja', 'partner, for anyone'],
            ['compañero / compañera de casa', 'housemate'],
          ],
        },
        {
          kind: 'match',
          prompt: 'Match each person to the English.',
          pairs: [
            ['mi mamá', 'my mum'],
            ['mi hermano', 'my brother'],
            ['mi abuela', 'my grandmother'],
            ['mi pareja', 'my partner'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. Who is Rosa?',
          audio: 'Es mi abuela. Se llama Rosa.',
          options: ['The speaker’s grandmother', 'The speaker’s sister', 'The speaker’s friend'],
          answer: 0,
          explanation: 'Abuela is a grandmother. Se llama Rosa gives her name.',
        },
        {
          kind: 'type',
          prompt: 'Write “my brother” in Spanish.',
          accepted: ['mi hermano'],
          hint: 'Mi + hermano. The h is written but not pronounced.',
          explanation: 'Mi hermano is my brother. Keep the silent h when you write it.',
        },
        {
          kind: 'choose',
          context: 'Tengo dos hermanos.',
          prompt: 'What can “dos hermanos” mean?',
          options: ['Two brothers, or a brother and a sister', 'Only two sisters', 'Two parents'],
          answer: 0,
          explanation:
            'Hermanos covers brothers, or brothers and sisters together. Two sisters would be dos hermanas.',
        },
        {
          kind: 'build',
          prompt: 'Say “She is my sister.”',
          answer: ['Es', 'mi', 'hermana.'],
          extra: ['hermano'],
          explanation: 'Es mi hermana. Spanish often leaves out ella when the person is clear.',
        },
        {
          kind: 'speak',
          prompt:
            'Show a classmate a photo, real or imagined. Ask who someone is, then say who one person is to you and give their name.',
          lines: ['¿Quién es?', 'Es mi hermana.', 'Se llama Paola.'],
          tip: 'In se llama, the ll sounds like the y in yes in Mexican Spanish.',
          mission: {
            checks: ['Say who the person is to you.', 'Give their name with se llama.'],
            twist: 'Now show a photo of a friend or a housemate instead of family.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u5-grammar',
      session: 'Grammar',
      title: 'Describe someone kindly',
      outcome: 'Describe a person in a few words, with endings that match them.',
      minutes: 8,
      steps: [
        {
          kind: 'choose',
          context: 'Es mi hermana. Se llama Paola.',
          prompt: 'Which sentence gives the sister’s name?',
          options: ['Se llama Paola.', 'Es mi hermana.', '¿Quién es?'],
          answer: 0,
          explanation: 'Se llama gives a name. Es mi hermana says who she is to the speaker.',
        },
        {
          kind: 'teach',
          title: 'A few words about someone',
          items: [
            {
              target: 'Es simpática.',
              meaning: 'She is nice. / She is friendly.',
              note: 'Simpático for a man. It describes personality, not looks.',
            },
            {
              target: 'Es alto.',
              meaning: 'He is tall.',
              note: 'Alta for a woman. Bajo or baja is short.',
            },
            {
              target: 'Tiene el pelo negro.',
              meaning: 'He has black hair. / She has black hair.',
              note: 'Hair uses tener, like age. You will also hear el cabello.',
            },
          ],
        },
        {
          kind: 'rule',
          title: 'The ending follows the person',
          body: 'Many describing words end in -o for a man and -a for a woman: alto, alta; simpático, simpática. Words ending in -e or a consonant usually stay the same: amable, joven. Keep descriptions kind: as in English, comments on weight or looks can be rude.',
          table: [
            ['él', 'alto, simpático'],
            ['ella', 'alta, simpática'],
            ['él o ella', 'amable, joven'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Paola is tall. Complete the sentence: “Paola es…”',
          options: ['alta.', 'alto.', 'altos.'],
          answer: 0,
          explanation: 'Paola is a woman, so alta. Alto is for a man; altos is plural.',
        },
        {
          kind: 'rule',
          title: 'More than one: add s',
          body: 'For two or more people, the words change together: mis hermanos, mis amigas. Es becomes son, and the describing word adds -s: Son simpáticos. Mi becomes mis and tu becomes tus. A group of men and women uses the -os ending.',
          table: [
            ['mi hermano', 'mis hermanos'],
            ['tu amiga', 'tus amigas'],
            ['es simpático', 'son simpáticos'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'How do you say “my parents”?',
          options: ['mis padres', 'mi padres', 'mis padre'],
          answer: 0,
          explanation:
            'Padres is plural, so mi becomes mis. Padres means parents, not only fathers.',
        },
        {
          kind: 'teach',
          title: 'Whose sister?',
          items: [
            {
              target: 'su hermana',
              meaning: 'his, her, their or your (usted) sister',
              note: 'Su covers many owners. Context usually makes it clear.',
            },
            {
              target: 'la hermana de Ana',
              meaning: 'Ana’s sister',
              note: 'Spanish has no ’s. Say la hermana de + the person when su could be unclear.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt:
            'Diego and Ana are both in a photo. Which phrase makes it clear the sister is Ana’s?',
          options: ['la hermana de Ana', 'su hermana', 'mi hermana'],
          answer: 0,
          explanation:
            'La hermana de Ana names the owner. Su hermana could be Diego’s or Ana’s; mi hermana would be yours.',
        },
        {
          kind: 'build',
          prompt: 'Say “My friends are nice.” The friends are all women.',
          answer: ['Mis', 'amigas', 'son', 'simpáticas.'],
          extra: ['simpáticos'],
          explanation: 'Mis amigas son simpáticas: every word is plural and feminine.',
        },
        {
          kind: 'type',
          prompt: 'Write “He is tall.” Use es.',
          accepted: ['Es alto.', 'Él es alto.'],
          hint: 'Es + the describing word with the ending for a man.',
          explanation: 'Es alto. Él is optional when the person is clear.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Which description matches?',
          audio: 'Mi hermano es alto y tiene el pelo negro.',
          options: [
            'A tall brother with black hair',
            'A short sister with black hair',
            'A tall father with grey hair',
          ],
          answer: 0,
          explanation: 'Mi hermano es alto: a tall brother. Tiene el pelo negro: black hair.',
        },
        {
          kind: 'speak',
          prompt:
            'Describe someone you know, or invent someone: who they are, one thing about their looks and one about their personality.',
          lines: ['Es mi hermano.', 'Es alto y simpático.', 'Tiene el pelo negro.'],
          tip: 'Stress the second-to-last syllable in sim-PÁ-ti-co: the written accent shows it.',
          mission: {
            checks: [
              'Make the ending match the person.',
              'Give one detail about looks and one about personality.',
            ],
            twist: 'Now describe two friends at once. Change es to son and make the words plural.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u5-talk',
      session: 'Real talk',
      title: 'Introduce two people',
      outcome:
        'Introduce someone, answer politely and keep the conversation going with a question.',
      minutes: 7,
      steps: [
        {
          kind: 'scene',
          title: 'Ana’s cousin visits the exchange',
          intro:
            'Ana’s cousin Valeria joins the language exchange for the evening. Ana introduces her to Omar.',
          lines: [
            {
              speaker: 'Ana',
              text: 'Omar, esta es mi prima, Valeria.',
              meaning: 'Omar, this is my cousin, Valeria.',
            },
            {
              speaker: 'Omar',
              text: 'Mucho gusto, Valeria.',
              meaning: 'Nice to meet you, Valeria.',
            },
            { speaker: 'Valeria', text: 'Igualmente.', meaning: 'Likewise.' },
            {
              speaker: 'Omar',
              text: '¿Vives aquí en la ciudad?',
              meaning: 'Do you live here in the city?',
            },
            {
              speaker: 'Valeria',
              text: 'No, vivo en Puebla con mis papás.',
              meaning: 'No, I live in Puebla with my parents.',
            },
          ],
          note: 'Igualmente answers mucho gusto. In Mexico, mis papás means my parents.',
        },
        {
          kind: 'teach',
          title: 'Introductions',
          items: [
            {
              target: 'Esta es mi prima.',
              meaning: 'This is my cousin. (a woman)',
              note: 'Este es mi primo for a man. Este and esta point to the person you introduce.',
            },
            {
              target: 'Igualmente.',
              meaning: 'Likewise.',
              note: 'The usual answer to mucho gusto.',
            },
            {
              target: 'mis papás',
              meaning: 'my parents',
              note: 'Everyday Mexican Spanish. Mis padres is understood everywhere.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Someone says “Mucho gusto.” What do you reply?',
          options: ['Igualmente.', 'Hasta luego.', 'No entiendo.'],
          answer: 0,
          explanation: 'Igualmente returns the greeting: likewise.',
        },
        {
          kind: 'rule',
          title: 'Introduce, then add one detail',
          body: 'Este es for a man, esta es for a woman, then how you know them. One extra detail gives the other person something to ask about.',
          examples: ['Este es mi amigo Leo.', 'Esta es mi prima. Vive en Puebla.'],
        },
        {
          kind: 'build',
          prompt: 'Introduce your friend Leo.',
          answer: ['Este', 'es', 'mi', 'amigo', 'Leo.'],
          extra: ['Esta'],
          explanation: 'Leo is a man, so este es. Mi amigo says how you know him.',
        },
        {
          kind: 'choose',
          context: 'Valeria vive en Puebla con sus papás.',
          prompt: 'Who does Valeria live with?',
          options: ['Her parents', 'Her cousin', 'Her friends'],
          answer: 0,
          explanation: 'Sus papás: her parents. Su and sus can also mean his, their or your.',
        },
        {
          kind: 'teach',
          title: 'Ask a follow-up',
          items: [
            {
              target: '¿Cómo es?',
              meaning: 'What is he like? / What is she like?',
              note: 'Asks for a description. ¿Quién es? asks who someone is.',
            },
            {
              target: '¿Cuántos hermanos tienes?',
              meaning: 'How many brothers and sisters do you have?',
              note: 'Cuántos, like ¿Cuántos años tienes? With usted: ¿Cuántos hermanos tiene?',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. What does the person want to know?',
          audio: '¿Cómo es tu hermana?',
          options: [
            'What your sister is like',
            'Where your sister lives',
            'How old your sister is',
          ],
          answer: 0,
          explanation:
            '¿Cómo es? asks for a description, so answer with words like simpática or alta.',
        },
        {
          kind: 'type',
          prompt: 'Ask a friend how many brothers and sisters they have.',
          accepted: ['¿Cuántos hermanos tienes?'],
          hint: 'Start with Cuántos hermanos, then tienes for tú.',
          explanation:
            '¿Cuántos hermanos tienes? Cuántos has an accent because it asks a question.',
        },
        {
          kind: 'choose',
          prompt: 'You introduce a woman in your group: “This is my cousin.” Which is right?',
          options: ['Esta es mi prima.', 'Este es mi prima.', 'Esta es mi primo.'],
          answer: 0,
          explanation:
            'For a woman: esta and prima. Este goes with a man, and primo is a male cousin.',
        },
        {
          kind: 'speak',
          prompt:
            'Introduce someone in your life to a classmate, add one detail, then ask the classmate a question about the people in their life.',
          lines: ['Este es mi amigo Leo.', 'Es muy simpático.', '¿Cuántos hermanos tienes?'],
          mission: {
            checks: [
              'Use este or esta to match the person.',
              'Add one detail.',
              'Ask a follow-up question.',
            ],
            twist:
              'Now introduce a woman you know. Change este to esta and the ending of the description.',
          },
        },
      ],
    },
    {
      id: 'es-a1-u5-task',
      session: 'Exam task',
      title: 'Tell us about someone',
      outcome: 'Understand a short description of people and talk briefly about someone you know.',
      minutes: 6,
      steps: [
        {
          kind: 'rule',
          title: 'Talk about someone from a card',
          body: 'In the DELE A1 speaking test you talk briefly about a familiar topic. Here you practise with a short text and a card. This is practice towards that task, not an exam score.',
        },
        {
          kind: 'choose',
          context:
            'Hola, soy Marta. Vivo en Guadalajara con mi pareja, Andrés. Tengo una hermana, Laura. Laura tiene treinta años y es muy simpática.',
          prompt: 'Who is Laura?',
          options: ['Marta’s sister', 'Marta’s partner', 'Marta’s friend'],
          answer: 0,
          explanation: 'Tengo una hermana, Laura: Laura is her sister. Andrés is her partner.',
        },
        {
          kind: 'choose',
          context:
            'Hola, soy Marta. Vivo en Guadalajara con mi pareja, Andrés. Tengo una hermana, Laura. Laura tiene treinta años y es muy simpática.',
          prompt: 'Who does Marta live with?',
          options: ['Her partner', 'Her sister', 'Her parents'],
          answer: 0,
          explanation: 'Vivo con mi pareja, Andrés: she lives with her partner.',
        },
        {
          kind: 'type',
          context: 'Tarjeta: tu amiga Inés · alta · simpática',
          prompt: 'Write one sentence about Inés: she is tall.',
          accepted: ['Es alta.', 'Inés es alta.', 'Ella es alta.'],
          hint: 'Es + alta, with the ending for a woman.',
          explanation: 'Es alta. Inés is a woman, so alta ends in -a.',
        },
        {
          kind: 'match',
          prompt: 'Match each sentence to its meaning.',
          pairs: [
            ['Es mi abuela.', 'She is my grandmother.'],
            ['Son mis papás.', 'They are my parents.'],
            ['Tiene el pelo negro.', 'He or she has black hair.'],
            ['Es simpático.', 'He is nice.'],
          ],
        },
        {
          kind: 'choose',
          prompt: 'Listen. How old is Pablo?',
          audio: 'Este es mi hermano, Pablo. Tiene veintidós años y vive en Monterrey.',
          options: ['22', '12', '32'],
          answer: 0,
          explanation: 'Veintidós is 22. Pablo is the speaker’s brother and lives in Monterrey.',
        },
        {
          kind: 'type',
          prompt: 'Write: “My sisters are nice.”',
          accepted: ['Mis hermanas son simpáticas.'],
          hint: 'Every word is plural and feminine: mis, hermanas, son, simpáticas.',
          explanation:
            'Mis hermanas son simpáticas. Mis, son and the -as ending all show the plural.',
        },
        {
          kind: 'speak',
          prompt:
            'Choose someone in your life, real or invented. Say who they are to you and their name, give two facts such as age or where they live, and describe them. Speak for about 30 seconds without reading.',
          lines: [
            'Esta es mi amiga Inés.',
            'Tiene veintiséis años.',
            'Vive en Puebla.',
            'Es alta y muy simpática.',
          ],
          mission: {
            checks: [
              'Say who the person is to you.',
              'Give two facts.',
              'Add a description with the right ending.',
            ],
            twist:
              'Now talk about two people together, such as your parents or two friends. Use son and plural endings.',
          },
        },
      ],
    },
  ],
);
