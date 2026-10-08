import { foundationLessons } from '@/features/foundations/catalog';
import type { FoundationProgress } from '@/features/foundations/progress';

import { historyLog, mergePracticeLogs, type PracticeLog } from './practice-log';

const lessonTrack = new Map(foundationLessons.map((lesson) => [lesson.id, lesson.track]));

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
  const attempts = Object.entries(state.foundations).flatMap(([id, entry]) =>
    entry.attempts.map((attempt) => ({ at: attempt.at, track: lessonTrack.get(id) })),
  );
  return mergePracticeLogs(
    state.practiceLog,
    historyLog(attempts, state.speakingPracticeDates, state.writingPracticeDates),
    today,
  );
}
