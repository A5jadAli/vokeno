// After a lesson-linked unit call: which taught phrases to bring back sooner. A phrase the learner
// did not use, or one the coach corrected, comes back in tomorrow's review. Not using a phrase in
// conversation is not the same as forgetting it, so the card steps down one level instead of
// starting again.

import { getTrackLessons } from '@/features/foundations/catalog';
import type { FoundationProgress } from '@/features/foundations/progress';
import type { LanguageTrack } from '@/features/language/config';
import { dayNumber } from '@/features/review/schedule';
import {
  normaliseSpeech,
  type UnitCall,
  type UnitCallPhrase,
} from '../../../supabase/functions/_shared/unit-calls';

/** The unit's review cards that a call phrase stands for: [lesson id, phrase index]. */
export function cardsForPhrases(
  track: LanguageTrack,
  call: UnitCall,
  phrases: UnitCallPhrase[],
): [string, number][] {
  const fragments = phrases.flatMap((item) => item.match.map((fragment) => fragment.trim()));
  return getTrackLessons(track)
    .filter((lesson) => lesson.format === 'steps' && lesson.unit.id === call.unitId)
    .flatMap((lesson) =>
      lesson.phrases.flatMap((phrase, index): [string, number][] => {
        const target = normaliseSpeech(phrase.target);
        return fragments.some((fragment) => fragment.length > 2 && target.includes(` ${fragment}`))
          ? [[lesson.id, index]]
          : [];
      }),
    );
}

/** Progress with those cards due tomorrow, one level lower. Cards not yet earned are skipped. */
export function bringBackSooner(
  progress: FoundationProgress,
  cards: [string, number][],
  today = dayNumber(),
): FoundationProgress {
  const next = { ...progress };
  for (const [lessonId, index] of cards) {
    const entry = next[lessonId];
    const card = entry?.cards?.[index];
    if (!entry || !card) continue;
    const cardsCopy = [...entry.cards!];
    cardsCopy[index] = [Math.max(0, card[0] - 1), Math.min(card[1], today + 1)];
    next[lessonId] = { ...entry, cards: cardsCopy, updatedAt: new Date().toISOString() };
  }
  return next;
}
