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
    return {
      title: goal === 'work-study' ? 'Keep the conversation going' : 'Find your way',
      why:
        goal === 'work-study'
          ? 'Ask for repetition and clarification before practising longer conversations.'
          : 'Ask for a place, follow directions and confirm what you heard.',
      href: goal === 'work-study' ? '/foundation/es-repair' : '/foundation/es-directions',
    };
  }
  if (track === 'DE') {
    if (ability === 'new')
      return {
        title: 'Start Unit 1: Hallo!',
        why: 'Short sessions with real scenes, the words people use, and clear English explanations.',
        href: '/foundation/de-a1-u1-hallo',
      };
    if (ability === 'basics')
      return goal === 'work-study'
        ? {
            title: 'Arrange an appointment',
            why: 'Practise polite requests and times for work or study.',
            href: '/foundation/appointments',
          }
        : {
            title: 'Order and pay in a café',
            why: 'Unit 5: order, change your mind and pay the way people do in Germany.',
            href: '/foundation/de-a1-u5-order',
          };
    return goal === 'work-study'
      ? {
          title: 'Explain a problem at work',
          why: 'Practise reasons, polite solutions and connected sentences.',
          href: '/foundation/work-problem',
        }
      : {
          title: 'Explain and compare your options',
          why: 'Build a longer answer with reasons and a clear preference.',
          href: '/foundation/opinions',
        };
  }
  if (ability === 'new')
    return {
      title: 'Start with the English sounds that matter',
      why: 'The first guided lesson: hear and practise the contrasts that make you easy to understand.',
      href: '/foundation/en-sounds',
    };
  if (goal === 'ielts-academic')
    return {
      title: ability === 'basics' ? 'Describe a chart' : 'Develop a supported opinion',
      why: 'Practise exam-relevant writing with a saved draft and a revision checklist.',
      href: ability === 'basics' ? '/activity/write?task=chart' : '/activity/write?task=opinion',
    };
  if (goal === 'ielts-general' || goal === 'work-study')
    return {
      title: 'Write a practical request',
      why: 'Cover each point and choose a suitable tone for the reader.',
      href: '/activity/write?task=letter',
    };
  return {
    title: 'Read for the main idea and detail',
    why: 'Read a short real-world text, then explain the evidence for your answer.',
    href: '/reading',
  };
}
