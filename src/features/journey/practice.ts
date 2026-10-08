// Practice matched to where the learner is: the same choices for Today's session and the
// Practice tab, so a suggested dialogue or conversation is always one the learner can follow.

import { examMockUnitIds, getCurriculumUnits } from '@/features/curriculum/catalog';
import type { LessonLevel } from '@/features/foundations/types';
import type { LanguageTrack } from '@/features/language/config';
import { listeningScenarios } from '@/features/listening/scenarios';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
const rank = (level: string) => levels.indexOf(level as (typeof levels)[number]);

/** Dialogues at or below the learner's level, or all of them if none fit. */
export function fittingScenarios(track: LanguageTrack, level: LessonLevel) {
  const all = listeningScenarios.filter((scenario) => scenario.track === track);
  const fitting = all.filter((scenario) => rank(scenario.level) <= Math.max(0, rank(level)));
  return fitting.length ? fitting : all;
}

/** Conversation scenarios at or below the learner's level, without exam mocks. */
export function fittingConversations(track: LanguageTrack, level: LessonLevel) {
  const all = getCurriculumUnits(track).filter((unit) => !examMockUnitIds.includes(unit.id));
  const fitting = all.filter((unit) => rank(unit.level) <= Math.max(0, rank(level)));
  return fitting.length ? fitting : all;
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
