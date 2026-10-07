import { describe, expect, it } from '@jest/globals';

import {
  addPractice,
  dayFromNumber,
  dayNumberOf,
  localDay,
  mergePracticeLogs,
  parsePracticeLog,
  practiceStage,
  practiceStreak,
  PRACTICE_LOG_DAYS,
  serializePracticeLog,
  weekView,
  type PracticeLog,
} from '@/features/habits/practice-log';

/** Days relative to `today`: 0 is today, 1 yesterday, … */
const TODAY = '2026-10-07'; // a Wednesday
const ago = (days: number) => dayFromNumber(dayNumberOf(TODAY) - days);
const logOf = (...daysAgo: number[]): PracticeLog =>
  Object.fromEntries(daysAgo.map((days) => [ago(days), ['lesson']]));

describe('calendar days', () => {
  it('round-trips day numbers and rejects impossible or malformed dates', () => {
    expect(dayFromNumber(dayNumberOf('2024-02-29'))).toBe('2024-02-29');
    expect(dayNumberOf('2026-02-29')).toBeNaN();
    expect(dayNumberOf('2026-13-01')).toBeNaN();
    expect(dayNumberOf('7 Oct 2026')).toBeNaN();
    expect(dayNumberOf('')).toBeNaN();
  });

  it('uses the local calendar day, not the UTC day', () => {
    // 00:30 local time on 8 October is still 7 October in UTC for timezones east of UTC.
    const lateNight = new Date(2026, 9, 8, 0, 30).getTime();
    expect(localDay(lateNight)).toBe('2026-10-08');
  });
});

describe('recording practice', () => {
  const noon = new Date(2026, 9, 7, 12).getTime();

  it('records each kind once per day', () => {
    let log = addPractice({}, 'lesson', noon);
    log = addPractice(log, 'lesson', noon + 1000);
    log = addPractice(log, 'review', noon + 2000);
    expect(log).toEqual({ '2026-10-07': ['lesson', 'review'] });
  });

  it('returns the same object when nothing changes, so stores do not re-render', () => {
    const log = addPractice({}, 'lesson', noon);
    expect(addPractice(log, 'lesson', noon)).toBe(log);
  });

  it('drops days older than the retention window', () => {
    const old: PracticeLog = { [ago(PRACTICE_LOG_DAYS + 5)]: ['lesson'], [ago(2)]: ['review'] };
    const log = addPractice(old, 'lesson', noon);
    expect(Object.keys(log)).toEqual([ago(2), TODAY]);
  });

  it('merges two devices day by day without duplicates', () => {
    const phone: PracticeLog = { [ago(1)]: ['lesson'], [TODAY]: ['review'] };
    const tablet: PracticeLog = { [ago(1)]: ['lesson', 'speaking'], [ago(3)]: ['writing'] };
    expect(mergePracticeLogs(phone, tablet, TODAY)).toEqual({
      [ago(1)]: ['lesson', 'speaking'],
      [TODAY]: ['review'],
      [ago(3)]: ['writing'],
    });
  });
});

describe('cloud format', () => {
  it('round-trips through the compact string form', () => {
    const log: PracticeLog = { [ago(1)]: ['lesson', 'listening'], [TODAY]: ['writing'] };
    expect(serializePracticeLog(log)).toEqual([`${ago(1)}:lh`, `${TODAY}:w`]);
    expect(parsePracticeLog(serializePracticeLog(log))).toEqual(log);
  });

  it('ignores malformed, unknown and hostile values', () => {
    expect(parsePracticeLog(null)).toEqual({});
    expect(parsePracticeLog('2026-10-07:l')).toEqual({});
    expect(
      parsePracticeLog([
        '2026-10-07:l',
        '2026-02-30:l',
        'not-a-day:l',
        '2026-10-06:xyz',
        '2026-10-05',
        42,
        { day: '2026-10-04' },
      ]),
    ).toEqual({ '2026-10-07': ['lesson'] });
  });
});

describe('streaks', () => {
  it('is zero with no practice', () => {
    expect(practiceStreak({}, TODAY)).toEqual({
      current: 0,
      best: 0,
      practisedToday: false,
      restDays: 0,
      atRisk: false,
    });
  });

  it('counts consecutive days including today', () => {
    const streak = practiceStreak(logOf(0, 1, 2), TODAY);
    expect(streak.current).toBe(3);
    expect(streak.practisedToday).toBe(true);
    expect(streak.atRisk).toBe(false);
  });

  it('keeps the run alive while today is still open', () => {
    const streak = practiceStreak(logOf(1, 2), TODAY);
    expect(streak.current).toBe(2);
    expect(streak.atRisk).toBe(true);
  });

  it('bridges one missed day as a rest day without counting it as practice', () => {
    const streak = practiceStreak(logOf(0, 2, 3), TODAY);
    expect(streak.current).toBe(3);
    expect(streak.restDays).toBe(1);
  });

  it('treats yesterday as a rest day while today is still open', () => {
    const streak = practiceStreak(logOf(2, 3), TODAY);
    expect(streak.current).toBe(2);
    expect(streak.restDays).toBe(1);
    expect(streak.atRisk).toBe(true);
  });

  it('ends the run after two missed days in a row', () => {
    expect(practiceStreak(logOf(3, 4), TODAY).current).toBe(0);
    expect(practiceStreak(logOf(0, 3, 4), TODAY).current).toBe(1);
  });

  it('allows only one rest day in any seven-day stretch', () => {
    // Rests at 1 and 4 days ago are too close; the second one ends the run.
    expect(practiceStreak(logOf(0, 2, 3, 5, 6), TODAY).current).toBe(3);
    // Rests 1 and 9 days ago are far enough apart.
    expect(practiceStreak(logOf(0, 2, 3, 4, 5, 6, 7, 8, 10), TODAY)).toMatchObject({
      current: 9,
      restDays: 2,
    });
  });

  it('never bridges a gap at the very start of the history', () => {
    expect(practiceStreak(logOf(2), TODAY).current).toBe(1);
    expect(practiceStreak(logOf(3), TODAY).current).toBe(0);
  });

  it('remembers the best run after the current one ends', () => {
    const streak = practiceStreak(logOf(0, 10, 11, 12, 13, 14), TODAY);
    expect(streak.current).toBe(1);
    expect(streak.best).toBe(5);
  });

  it('ignores future-dated and empty entries', () => {
    const log: PracticeLog = { ...logOf(0), [ago(-1)]: ['lesson'], [ago(1)]: [] };
    expect(practiceStreak(log, TODAY)).toMatchObject({ current: 1, best: 1 });
  });
});

describe('week view', () => {
  it('runs Monday to Sunday and marks today, rest, missed and future days', () => {
    // Today is Wednesday. Monday practised, Tuesday missed (a rest), Wednesday not yet.
    const week = weekView(logOf(2, 3), TODAY);
    expect(week.map((day) => day.label).join('')).toBe('MTWTFSS');
    expect(week[0].day).toBe('2026-10-05');
    expect(week.map((day) => day.state)).toEqual([
      'done',
      'rest',
      'today',
      'future',
      'future',
      'future',
      'future',
    ]);
  });

  it('shows a missed day that ended a run as missed, not rest', () => {
    const week = weekView(logOf(0), TODAY); // Monday and Tuesday missed
    expect(week.slice(0, 3).map((day) => day.state)).toEqual(['missed', 'missed', 'done']);
  });

  it('starts on Monday even when today is Sunday or Monday', () => {
    expect(weekView({}, '2026-10-11')[0].day).toBe('2026-10-05');
    expect(weekView({}, '2026-10-12')[0].day).toBe('2026-10-12');
  });
});

describe('stages', () => {
  it('starts small and grows with active days', () => {
    expect(practiceStage({}, TODAY).stage).toBe('warm-up');
    expect(practiceStage(logOf(1, 2, 3), TODAY).stage).toBe('warm-up');
    expect(practiceStage(logOf(0, 1, 2, 3), TODAY).stage).toBe('building');
    const twoWeeks = logOf(...Array.from({ length: 14 }, (_, day) => day));
    expect(practiceStage(twoWeeks, TODAY).stage).toBe('momentum');
  });

  it('restarts gently after a break of four days or more', () => {
    const regular = logOf(...Array.from({ length: 20 }, (_, day) => day + 4));
    expect(practiceStage(regular, TODAY)).toMatchObject({
      stage: 'warm-up',
      returning: true,
      daysAway: 4,
    });
    const shortBreak = logOf(...Array.from({ length: 20 }, (_, day) => day + 3));
    expect(practiceStage(shortBreak, TODAY).stage).toBe('momentum');
  });
});
