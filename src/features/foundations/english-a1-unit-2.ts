import { defineUnit } from './types';

export const englishA1Unit2 = defineUnit(
  'EN',
  'A1',
  {
    id: 'en-a1-u2',
    number: 2,
    icon: 'map-marker-outline',
    title: 'A little about you',
    canDo: 'Say where you are from, where you live and that you work or study.',
  },
  [
    {
      id: 'en-a1-u2-meet',
      session: 'Meet the language',
      title: 'From one place, living in another',
      outcome: 'Understand the difference between where someone is from and where they live.',
      minutes: 6,
      steps: [
        {
          kind: 'choose',
          prompt: 'A new classmate asks: What’s your name? Answer as Ella.',
          options: ['I’m Ella.', 'Bye, Alex.', 'Thanks.'],
          answer: 0,
          explanation: 'I’m Ella gives your name. This uses the introduction from Unit 1.',
        },
        {
          kind: 'teach',
          title: 'Two places',
          items: [
            {
              target: 'Where are you from?',
              meaning: 'What place do you come from?',
              note: 'You can answer with a city or a country.',
            },
            {
              target: 'I’m from London.',
              meaning: 'London is where I come from.',
              note: 'London is a city. Replace London with your place.',
            },
            {
              target: 'Where do you live?',
              meaning: 'Where is your home now?',
              note: 'This asks about your home now, not your full address.',
            },
            {
              target: 'I live in Boston.',
              meaning: 'Boston is my home now.',
              note: 'Boston is a city. Your home can be different from where you are from.',
            },
          ],
        },
        {
          kind: 'scene',
          title: 'Ella’s two places',
          intro: 'Ella is from London. Her home now is Boston.',
          lines: [
            {
              speaker: 'Alex',
              text: 'Where are you from?',
              meaning: 'Alex asks where Ella comes from.',
            },
            { speaker: 'Ella', text: 'I’m from London.', meaning: 'Ella comes from London.' },
            {
              speaker: 'Alex',
              text: 'Where do you live?',
              meaning: 'Alex asks about Ella’s home now.',
            },
            { speaker: 'Ella', text: 'I live in Boston.', meaning: 'Ella’s home now is Boston.' },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Read. Where is Ella’s home now?',
          context: 'I’m Ella. I’m from London. I live in Boston.',
          options: ['London', 'Boston', 'The text does not say'],
          answer: 1,
          explanation:
            'I live in Boston tells you her home now. I’m from London tells you where she comes from.',
        },
        {
          kind: 'choose',
          prompt: 'You want to know where Alex comes from. Ask the question.',
          options: ['Where do you live?', 'What’s your name?', 'Where are you from?'],
          answer: 2,
          explanation:
            'Where are you from? asks where someone comes from. Where do you live? asks about their home now.',
        },
        {
          kind: 'match',
          prompt: 'Match each question to its answer.',
          pairs: [
            ['What’s your name?', 'I’m Ella.'],
            ['Where are you from?', 'I’m from London.'],
            ['Where do you live?', 'I live in Boston.'],
          ],
        },
        {
          kind: 'speak',
          prompt: 'Be Ella. Say your name, where you are from and where you live.',
          lines: ['I’m Ella. I’m from London. I live in Boston.'],
          tip: 'Pause between the short sentences. Make each place name clear.',
        },
      ],
    },
    {
      id: 'en-a1-u2-build',
      session: 'Build a reply',
      title: 'I live here. I work here.',
      outcome: 'Build short replies about home, work and study.',
      minutes: 7,
      steps: [
        {
          kind: 'build',
          prompt: 'Say where you come from. Start with I’m.',
          answer: ['I’m', 'from', 'London.'],
          extra: ['in'],
          explanation: 'I’m from London. Use from for where you come from.',
        },
        {
          kind: 'type',
          prompt: 'Use the pattern I live in + city. Complete: I live ___ Boston.',
          accepted: ['in'],
          hint: 'Use in for a city where you live.',
          explanation: 'I live in Boston. Do not use from after live in this pattern.',
        },
        {
          kind: 'teach',
          title: 'Work or study',
          items: [
            {
              target: 'I’m a student.',
              meaning: 'I study at a school, college or university.',
              note: 'Use a before student: a student.',
            },
            {
              target: 'I work in a shop.',
              meaning: 'My job is in a shop.',
              note: 'A shop sells things. Store is a common American alternative.',
            },
            {
              target: 'I work in a store.',
              meaning: 'My job is in a store.',
              note: 'Store and shop both work in this practice situation.',
            },
          ],
        },
        {
          kind: 'choose',
          prompt: 'Read the profile. Choose the matching sentence.',
          context: 'Alex is a college student. Alex has no job.',
          options: ['I work in a shop.', 'I’m a student.', 'I live in a shop.'],
          answer: 1,
          explanation:
            'I’m a student fits someone studying at college. Work tells us about a job; live tells us about a home.',
        },
        {
          kind: 'build',
          prompt: 'Build the student reply. Start with I’m.',
          answer: ['I’m', 'a', 'student.'],
          explanation: 'I’m a student. Keep a before student.',
        },
        {
          kind: 'type',
          prompt: 'Complete the work sentence with either word: shop or store.',
          context: 'I work in a ___.',
          accepted: ['shop', 'store'],
          hint: 'Both shop and store are valid here.',
          explanation:
            'I work in a shop. I work in a store. Both are correct; neither variety is a mistake.',
        },
        {
          kind: 'speak',
          prompt: 'Be Ella. You live in Boston and study at college. Say the two facts.',
          lines: ['I live in Boston. I’m a student.'],
          mission: {
            checks: ['Did I say where I live?', 'Did I say that I’m a student?'],
            twist:
              'Now imagine you work in a shop instead. Keep Boston as your home and change the work/study sentence.',
          },
        },
      ],
    },
    {
      id: 'en-a1-u2-listen',
      session: 'Hear and respond',
      title: 'Listen for the place',
      outcome: 'Follow two short introductions and check a place you missed.',
      minutes: 6,
      steps: [
        {
          kind: 'scene',
          title: 'Two English voices',
          intro:
            'Listen to Alex’s American English and Ella’s British English. Both use the same patterns.',
          lines: [
            {
              speaker: 'Alex',
              text: 'Hi. I’m Alex. I’m from Boston. I live in London.',
              meaning: 'Alex: from Boston; home now in London.',
            },
            {
              speaker: 'Ella',
              text: 'Hello. I’m Ella. I’m from London. I live in Boston.',
              meaning: 'Ella: from London; home now in Boston.',
            },
          ],
          note: 'An accent does not tell you where someone lives. Listen to the words.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Where does this person live now?',
          audio: 'I’m from Boston. I live in London.',
          options: ['Boston', 'London', 'The speaker does not say'],
          answer: 1,
          explanation:
            'I live in London gives the home now. Boston is where the person comes from.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Where does this person come from?',
          audio: 'I’m from London. I live in Boston.',
          options: ['Boston', 'The speaker does not say', 'London'],
          answer: 2,
          explanation: 'I’m from London answers the origin question. The home now is Boston.',
        },
        {
          kind: 'choose',
          prompt: 'You miss the place. Ask to hear it again.',
          options: ['Sorry, can you say that again?', 'Bye.', 'Nice to meet you.'],
          answer: 0,
          explanation:
            'Use the repetition request from Unit 1. Asking again is part of a successful conversation.',
        },
        {
          kind: 'type',
          prompt: 'Listen to the repeat. Complete: I live in ___.',
          audio: 'Boston. I live in Boston.',
          accepted: ['Boston'],
          hint: 'The place starts with B.',
          explanation: 'The speaker repeats Boston. You can replay the recording before answering.',
        },
        {
          kind: 'speak',
          prompt:
            'Someone asks: Where do you live? Give your city or a made-up city. Then ask the same question back.',
          lines: ['I live in London. Where do you live?'],
          mission: {
            checks: ['Did I answer with my home now?', 'Did I ask the other person a question?'],
            twist: 'Now the question is Where are you from? Answer that question instead.',
          },
        },
      ],
    },
    {
      id: 'en-a1-u2-use',
      session: 'Use it yourself',
      title: 'A short introduction',
      outcome: 'Write a supplied introduction, then try one with your own details.',
      minutes: 7,
      steps: [
        {
          kind: 'form',
          prompt: 'Use the profile. Complete the introduction as Alex.',
          context: 'Name: Alex\nFrom: Boston\nHome now: London\nWork/study: student',
          fields: [
            {
              label: 'I’m ___ (name).',
              accepted: ['Alex'],
              kind: 'text',
              hint: 'Use the profile name.',
            },
            {
              label: 'I’m from ___.',
              accepted: ['Boston'],
              kind: 'text',
              hint: 'Where Alex comes from.',
            },
            {
              label: 'I live in ___.',
              accepted: ['London'],
              kind: 'text',
              hint: 'Alex’s home now.',
            },
            {
              label: 'I’m a ___.',
              accepted: ['student'],
              kind: 'text',
              hint: 'Use the work/study line.',
            },
          ],
          explanation:
            'I’m Alex. I’m from Boston. I live in London. I’m a student. From and live in give different facts.',
        },
        {
          kind: 'choose',
          prompt: 'You live in London. Someone says: You live in Boston? Choose the correction.',
          options: ['Yes. I’m from Boston.', 'No. I live in London.', 'I’m a student.'],
          answer: 1,
          explanation:
            'No. I live in London corrects the home. You can come from Boston without living there now.',
        },
        {
          kind: 'type',
          prompt: 'Write one sentence using I live in and the home shown.',
          context: 'Home now: Boston',
          accepted: ['I live in Boston.'],
          hint: 'I live in + Boston.',
          explanation:
            'I live in Boston. This task asks for one supplied pattern. Your personal introduction can use different facts and wording.',
        },
        {
          kind: 'choose',
          prompt: 'Listen. Choose the question that this reply answers.',
          audio: 'I’m from London.',
          options: ['What’s your name?', 'Where do you live?', 'Where are you from?'],
          answer: 2,
          explanation:
            'I’m from London answers Where are you from? It does not tell us the home now.',
        },
        {
          kind: 'speak',
          prompt:
            'Meet a new classmate. Give a name, where you are from and your home now. Add work or study if the examples fit you. Ask one question back. Real or made-up details are fine.',
          lines: [
            'Hi. I’m Alex. I’m from Boston. I live in London. I’m a student. Where are you from?',
          ],
          mission: {
            checks: [
              'Did I give the facts I wanted to share?',
              'Did I keep origin and home clear?',
              'Did I ask a question back?',
            ],
            twist:
              'Your partner mixes up your home and origin. Say No, then give the correct home. Try again with a different city.',
          },
          tip: 'Keep each idea short. If a model does not describe you, use a made-up profile for now. More work and daily-life language comes later.',
        },
        {
          kind: 'rule',
          title: 'Next: order a drink',
          body: 'Unit 3 uses a short question and reply in a cafe. Keep using Sorry, can you say that again? when you need help. You will meet familiar words again in phrase review.',
        },
      ],
    },
  ],
);
