import type { FoundationProgress } from '@/features/foundations/progress';

import { historyLog, mergePracticeLogs, type PracticeLog } from './practice-log';

/** The practice log plus practice the app recorded before the log existed. */
export function fullPracticeLog(
  state: {
    practiceLog: PracticeLog;
    foundations: FoundationProgress;
    speakingPracticeDates: string[];
    writingPracticeDates: string[];
  },
  today: string,
) {
  const attempts = Object.values(state.foundations).flatMap((entry) =>
    entry.attempts.map((attempt) => attempt.at),
  );
  return mergePracticeLogs(
    state.practiceLog,
    historyLog(attempts, state.speakingPracticeDates, state.writingPracticeDates),
    today,
  );
}
