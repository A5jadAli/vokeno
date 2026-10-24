// Practice matched to where the learner is: the same choices for Today's session and the
// Practice tab, so a suggested dialogue or conversation is always one the learner can follow.

import { examMockUnitIds, getCurriculumUnits } from '@/features/curriculum/catalog';
import type { LessonLevel } from '@/features/foundations/types';
import { levelRange } from '@/features/foundations/level-status';
import type { LanguageTrack } from '@/features/language/config';
import { listeningScenarios } from '@/features/listening/scenarios';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
const rank = (level: string) => levels.indexOf(level as (typeof levels)[number]);

/**
 * Items at the learner's level: from the course's first level (B1 for English) up to theirs.
 * Below the range is a warm-up, so it only fills in when nothing in range exists; then
 * anything at or below their level, then everything.
 */
function atLevel<T extends { level: string }>(all: T[], track: LanguageTrack, level: LessonLevel) {
  const top = Math.max(0, rank(level));
  const floor = rank(levelRange[track][0]);
  const inRange = all.filter((item) => rank(item.level) >= floor && rank(item.level) <= top);
  if (inRange.length) return inRange;
  const below = all.filter((item) => rank(item.level) <= top);
  return below.length ? below : all;
}

/** Dialogues at the learner's level. */
export function fittingScenarios(track: LanguageTrack, level: LessonLevel) {
  return atLevel(
    listeningScenarios.filter((scenario) => scenario.track === track),
    track,
    level,
  );
}

/** Conversation scenarios at the learner's level, without exam mocks. */
export function fittingConversations(track: LanguageTrack, level: LessonLevel) {
  return atLevel(
    getCurriculumUnits(track).filter((unit) => !examMockUnitIds.includes(unit.id)),
    track,
    level,
  );
}

/** The first dialogue not heard yet; after all are heard, one that rotates by day. */
export function suggestedScenario(
  track: LanguageTrack,
  level: LessonLevel,
  heard: string[],
  day: number,
) {
  const pool = fittingScenarios(track, level);
  return pool.find((scenario) => !heard.includes(scenario.id)) ?? pool[day % pool.length];
}

/** The first conversation not practised yet; after that, one that rotates by day. */
export function suggestedConversation(
  track: LanguageTrack,
  level: LessonLevel,
  practised: string[],
  day: number,
) {
  const pool = fittingConversations(track, level);
  if (!pool.length) return undefined;
  return pool.find((unit) => !practised.includes(unit.id)) ?? pool[day % pool.length];
}
