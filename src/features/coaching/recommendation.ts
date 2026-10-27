import type { StartingAbility, StudyGoal } from './store';
import type { LanguageTrack } from '@/features/language/config';
export function learningRecommendation(
  track: LanguageTrack,
  ability: StartingAbility = 'new',
  goal: StudyGoal = 'everyday',
) {
  if (track === 'ES') {
    if (ability === 'new')
      return {
        title: 'Your first useful Spanish exchange',
        why: 'Greet someone, ask politely and leave with a complete exchange.',
        href: '/foundation/es-a1-u1-words',
      };
    if (ability === 'basics')
      return {
        title: 'Unit 6: At a café',
        why: 'Put familiar words to work in a real service conversation.',
        href: '/foundation/es-a1-u6-words',
      };
    return goal === 'work-study'
      ? {
          title: 'Make and change an appointment',
          why: 'Start at A2: arrange times and handle changes, as you would at work.',
          href: '/foundation/es-appointment',
        }
      : {
          title: 'What did you do at the weekend?',
          why: 'Start at A2: talk about the past and keep a real conversation going.',
          href: '/foundation/es-weekend',
        };
  }
  if (track === 'DE') {
    if (ability === 'new')
      return {
        title: 'Unit 1: Hallo!',
        why: 'Short sessions with real scenes, the words people use, and clear English explanations.',
        href: '/foundation/de-a1-u1-hallo',
      };
    if (ability === 'basics')
      return goal === 'work-study'
        ? {
            title: 'Unit 8: Mein Tag',
            why: 'Unit 8: times, your working day and answering an invitation, all at A1.',
            href: '/foundation/de-a1-u8-time',
          }
        : {
            title: 'Order and pay in a café',
            why: 'Unit 5: order, change your mind and pay the way people do in Germany.',
            href: '/foundation/de-a1-u5-order',
          };
    return goal === 'work-study'
      ? {
          title: 'Arrange an appointment',
          why: 'Start at A2: polite requests and times for work or study.',
          href: '/foundation/appointments',
        }
      : {
          title: 'What did you do at the weekend?',
          why: 'Start at A2: talk about the past and keep a conversation going.',
          href: '/foundation/weekend-smalltalk',
        };
  }
  // Work goals do not skip the foundations a beginner still needs.
  if (ability !== 'conversational')
    return {
      title: 'Unit 1: Hello, I’m Alex',
      why: 'Start with a name, a question and asking someone to repeat. Three A1 units are ready for practice; more are being built.',
      href: '/foundation/en-a1-u1-meet',
    };
  if (goal === 'ielts-academic' || goal === 'ielts-general')
    return {
      title: 'IELTS Listening: numbers, spelling and traps',
      why: 'The first IELTS lesson. Reading, Writing and Speaking follow in order.',
      href: '/foundation/en-ielts-listening',
    };
  if (goal === 'interviews')
    return {
      title: 'Buy time and fix misunderstandings',
      why: 'Practise clarifying a question before building longer interview answers. The full interview pathway is still being built.',
      href: '/foundation/en-repair',
    };
  return goal === 'work-study' || goal === 'meetings' || goal === 'presentations'
    ? {
        title: 'Messages at work: email, Slack and Teams',
        why: 'Start with clear workplace requests and updates. Dedicated meeting and presentation missions are still being built.',
        href: '/foundation/en-workplace',
      }
    : {
        title: 'Ask and suggest politely',
        why: 'Start at B1: sound natural and polite, not just correct.',
        href: '/foundation/en-softening',
      };
}
