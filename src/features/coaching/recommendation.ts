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
        href: '/foundation/es-first-words',
      };
    if (ability === 'basics')
      return {
        title: 'Order at a café',
        why: 'Put familiar words to work in a real service conversation.',
        href: '/foundation/es-cafe',
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
  // English starts at A2. Every choice opens a lesson, so Today continues from the same place.
  if (goal === 'ielts-academic' || goal === 'ielts-general')
    return ability === 'new'
      ? {
          title: 'English sounds that change meaning',
          why: 'Start with the sounds, then move on to the IELTS lessons at B1.',
          href: '/foundation/en-sounds',
        }
      : {
          title: 'IELTS Listening: numbers, spelling and traps',
          why: 'The first IELTS lesson. Reading, Writing and Speaking follow in order.',
          href: '/foundation/en-ielts-listening',
        };
  if (ability === 'conversational')
    return goal === 'work-study'
      ? {
          title: 'Messages at work: email, Slack and Teams',
          why: 'Start at B1 with the English you write at work every day.',
          href: '/foundation/en-workplace',
        }
      : {
          title: 'Ask and suggest politely',
          why: 'Start at B1: sound natural and polite, not just correct.',
          href: '/foundation/en-softening',
        };
  return {
    title: 'English sounds that change meaning',
    why: 'The first guided lesson: hear and practise the contrasts that make you easy to understand.',
    href: '/foundation/en-sounds',
  };
}
