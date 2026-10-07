import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { buildTodayPlan } from '@/features/coaching/daily-plan';
import { useCoachingStore } from '@/features/coaching/store';
import type { LanguageTrack } from '@/features/language/config';
import { useProgressStore } from '@/features/progress/store';

import { levelMilestone } from './milestones';
import { localDay, practiceStreak, weekView } from './practice-log';

/** Today's plan, the streak and this week, recalculated whenever the screen comes into view. */
export function useHabits(track: LanguageTrack) {
  const [clock, setClock] = useState(() => Date.now());
  useFocusEffect(useCallback(() => setClock(Date.now()), []));
  const choices = useCoachingStore((state) => state.preferences[track]);
  const progress = useCoachingStore((state) => state.foundations);
  const completedUnitIds = useCoachingStore((state) => state.completedUnitIds);
  const log = useCoachingStore((state) => state.practiceLog);
  const completedScenarioIds = useProgressStore((state) => state.completedScenarioIds);
  return useMemo(() => {
    const today = localDay(clock);
    return {
      plan: buildTodayPlan({
        track,
        progress,
        completedScenarioIds,
        completedUnitIds,
        ability: choices.ability ?? 'new',
        goal: choices.studyGoal ?? 'everyday',
        log,
        now: clock,
      }),
      streak: practiceStreak(log, today),
      week: weekView(log, today),
      milestone: levelMilestone(track, progress, clock),
    };
  }, [choices, clock, completedScenarioIds, completedUnitIds, log, progress, track]);
}
