import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { buildTodayPlan } from '@/features/coaching/daily-plan';
import { useCoachingStore } from '@/features/coaching/store';
import type { LanguageTrack } from '@/features/language/config';
import { useProgressStore } from '@/features/progress/store';

import { fullPracticeLog } from './full-log';
import { levelMilestone } from './milestones';
import { localDay, practiceStreak, weekView } from './practice-log';

/** Today's plan, the streak and this week, recalculated whenever the screen comes into view. */
export function useHabits(track: LanguageTrack) {
  const [clock, setClock] = useState(() => Date.now());
  useFocusEffect(useCallback(() => setClock(Date.now()), []));
  const choices = useCoachingStore((state) => state.preferences[track]);
  const progress = useCoachingStore((state) => state.foundations);
  const completedUnitIds = useCoachingStore((state) => state.completedUnitIds);
  const practiceLog = useCoachingStore((state) => state.practiceLog);
  const speakingPracticeDates = useCoachingStore((state) => state.speakingPracticeDates);
  const writingPracticeDates = useCoachingStore((state) => state.writingPracticeDates);
  const completedScenarioIds = useProgressStore((state) => state.completedScenarioIds);
  const activities = useCoachingStore((state) => state.activityLog);
  const session = useCoachingStore((state) => state.sessions[track]);
  const habits = useMemo(() => {
    const today = localDay(clock);
    const log = fullPracticeLog(
      { practiceLog, foundations: progress, speakingPracticeDates, writingPracticeDates },
      today,
    );
    return {
      plan: buildTodayPlan({
        track,
        progress,
        completedScenarioIds,
        completedUnitIds,
        log,
        activities,
        session,
        startAt: choices.startAt,
        now: clock,
      }),
      streak: practiceStreak(log, today),
      week: weekView(log, today),
      milestone: levelMilestone(track, progress, clock),
    };
  }, [
    activities,
    session,
    choices,
    clock,
    completedScenarioIds,
    completedUnitIds,
    practiceLog,
    progress,
    speakingPracticeDates,
    track,
    writingPracticeDates,
  ]);
  // Keep today's session once it is built, so its items stay the same all day. Never before the
  // saved progress has loaded: a plan built from empty progress would be the wrong one.
  const hydrated = useCoachingStore((state) => state.hasHydrated);
  const { snapshot } = habits.plan;
  useEffect(() => {
    if (hydrated) useCoachingStore.getState().saveSession(track, snapshot);
  }, [hydrated, snapshot, track]);
  return habits;
}
