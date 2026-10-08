import { describe, expect, it } from '@jest/globals';

import { freshFoundationEntry } from '@/features/foundations/progress';
import { fullPracticeLog } from '@/features/habits/full-log';

describe('full practice log', () => {
  it('merges the practice log with older lesson, speaking and writing history', () => {
    const attemptAt = new Date(2026, 9, 6, 9, 0).toISOString();
    const log = fullPracticeLog(
      {
        practiceLog: { '2026-10-07': ['review'] },
        foundations: {
          greetings: {
            ...freshFoundationEntry(),
            attempts: [{ at: attemptAt, correctFirstTry: 3, spoken: false }],
          },
        },
        speakingPracticeDates: ['2026-10-06'],
        writingPracticeDates: [],
      },
      '2026-10-07',
    );
    expect(log).toEqual({ '2026-10-07': ['review'], '2026-10-06': ['lesson', 'speaking'] });
  });

  it('is empty for a brand-new learner', () => {
    expect(
      fullPracticeLog(
        { practiceLog: {}, foundations: {}, speakingPracticeDates: [], writingPracticeDates: [] },
        '2026-10-07',
      ),
    ).toEqual({});
  });
});
