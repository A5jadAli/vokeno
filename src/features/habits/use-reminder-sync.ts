import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { buildTodayPlan } from '@/features/coaching/daily-plan';
import { useCoachingStore } from '@/features/coaching/store';
import { languageDetails } from '@/features/language/config';
import { useLanguageSelection } from '@/features/language/selection';
import { useProgressStore } from '@/features/progress/store';

import { fullPracticeLog } from './full-log';
import { localDay } from './practice-log';
import { applyReminderPlan } from './reminder-scheduler';
import { planReminders, useReminderStore } from './reminders';

/** Keeps scheduled reminders in step with the learner's choice and today's practice. */
export function useReminderSync() {
  const choice = useReminderStore((state) => state.choice);
  const track = useLanguageSelection((state) => state.track);
  const log = useCoachingStore((state) => state.practiceLog);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setVisits((value) => value + 1);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const now = Date.now();
    let plan: ReturnType<typeof planReminders> = [];
    if (choice !== 'off') {
      const coaching = useCoachingStore.getState();
      const fullLog = fullPracticeLog(coaching, localDay(now));
      const choices = coaching.preferences[track];
      const today = buildTodayPlan({
        track,
        progress: coaching.foundations,
        completedScenarioIds: useProgressStore.getState().completedScenarioIds,
        completedUnitIds: coaching.completedUnitIds,
        log: fullLog,
        activities: coaching.activityLog,
        session: coaching.sessions[track],
        startAt: choices.startAt,
        now,
      });
      plan = planReminders({
        slot: choice,
        now,
        practisedToday: (fullLog[localDay(now)] ?? []).length > 0,
        language: languageDetails[track].name,
        nextStep: today.steps.find((step) => !step.done)?.title,
      });
    }
    void applyReminderPlan(plan).catch(() => undefined);
  }, [choice, log, track, visits]);
}
