// A small, honest record of practice days. Everything here is pure so the habit rules can be
// tested without a device clock. Days are the learner's local calendar days, not UTC days.

export const practiceKinds = ['lesson', 'review', 'listening', 'speaking', 'writing'] as const;
export type PracticeKind = (typeof practiceKinds)[number];

/** Local day (YYYY-MM-DD) → what was practised that day. */
export type PracticeLog = Record<string, PracticeKind[]>;

/** Enough history for a best streak and a weekly view, small enough to sync. */
export const PRACTICE_LOG_DAYS = 120;
/** One missed day can be bridged at most once in any 7-day stretch. */
export const REST_DAY_SPACING = 7;

const codes: Record<PracticeKind, string> = {
  lesson: 'l',
  review: 'r',
  listening: 'h',
  speaking: 's',
  writing: 'w',
};
const kindsByCode = Object.fromEntries(
  Object.entries(codes).map(([kind, code]) => [code, kind]),
) as Record<string, PracticeKind>;

const pad = (value: number) => String(value).padStart(2, '0');

/** The learner's local calendar day for a timestamp. */
export function localDay(time: number) {
  const date = new Date(time);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Whole days since 1970-01-01 for a calendar day, independent of time zones. */
export function dayNumberOf(day: string) {
  const match = DAY_PATTERN.exec(day);
  if (!match) return NaN;
  const [, year, month, date] = match.map(Number);
  const time = Date.UTC(year, month - 1, date);
  const check = new Date(time);
  // Reject impossible dates such as 2026-02-30.
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== date) return NaN;
  return Math.round(time / 86_400_000);
}

export function dayFromNumber(dayNumber: number) {
  const date = new Date(dayNumber * 86_400_000);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function prune(log: PracticeLog, today: string): PracticeLog {
  const newest = dayNumberOf(today);
  return Object.fromEntries(
    Object.entries(log).filter(([day, kinds]) => {
      const number = dayNumberOf(day);
      return kinds.length > 0 && number <= newest && newest - number < PRACTICE_LOG_DAYS;
    }),
  );
}

export function addPractice(log: PracticeLog, kind: PracticeKind, time: number): PracticeLog {
  const today = localDay(time);
  const existing = log[today] ?? [];
  if (existing.includes(kind)) return log;
  return prune({ ...log, [today]: [...existing, kind] }, today);
}

export function mergePracticeLogs(local: PracticeLog, remote: PracticeLog, today: string) {
  const merged: PracticeLog = { ...local };
  for (const [day, kinds] of Object.entries(remote)) {
    merged[day] = practiceKinds.filter(
      (kind) => kinds.includes(kind) || (merged[day] ?? []).includes(kind),
    );
  }
  return prune(merged, today);
}

/** Cloud form: ['2026-10-07:lr', …]. Unknown codes and malformed days are dropped. */
export function serializePracticeLog(log: PracticeLog): string[] {
  return Object.keys(log)
    .sort()
    .map((day) => `${day}:${log[day].map((kind) => codes[kind]).join('')}`);
}

export function parsePracticeLog(value: unknown): PracticeLog {
  if (!Array.isArray(value)) return {};
  const log: PracticeLog = {};
  for (const entry of value.slice(-PRACTICE_LOG_DAYS * 2)) {
    if (typeof entry !== 'string') continue;
    const [day, letters = ''] = entry.split(':');
    if (!Number.isFinite(dayNumberOf(day))) continue;
    const kinds = practiceKinds.filter((kind) =>
      [...letters].some((code) => kindsByCode[code] === kind),
    );
    if (kinds.length) log[day] = kinds;
  }
  return log;
}

export type StreakSummary = {
  /** Practice days in the current unbroken run, including today if practised. */
  current: number;
  /** Longest run of practice days in the log. */
  best: number;
  practisedToday: boolean;
  /** Missed days inside the current run that were bridged as rest days. */
  restDays: number;
  /** A run exists but today has not been practised yet. */
  atRisk: boolean;
};

/**
 * Walks a run from `start` towards older days. A missed day is bridged as a rest day only when
 * the run has practice on both sides of it and no other rest day falls within the spacing.
 * `pendingStart` lets an unpractised `start` (yesterday, while today is still open) be a rest.
 */
function runFrom(practised: Set<number>, start: number, oldest: number, pendingStart = false) {
  let count = 0;
  const rests: number[] = [];
  for (let day = start; day >= oldest; day--) {
    if (practised.has(day)) {
      count++;
      continue;
    }
    const lastRest = rests.at(-1);
    const restAllowed =
      (count > 0 || (pendingStart && day === start)) &&
      practised.has(day - 1) &&
      (lastRest === undefined || lastRest - day >= REST_DAY_SPACING);
    if (!restAllowed) break;
    rests.push(day);
  }
  return { count, rests };
}

function practisedDays(log: PracticeLog, todayNumber: number) {
  return new Set(
    Object.keys(log)
      .filter((day) => log[day].length > 0)
      .map(dayNumberOf)
      .filter((day) => Number.isFinite(day) && day <= todayNumber),
  );
}

function currentRun(log: PracticeLog, today: string) {
  const todayNumber = dayNumberOf(today);
  const practised = practisedDays(log, todayNumber);
  const oldest = Math.min(todayNumber, ...practised);
  const practisedToday = practised.has(todayNumber);
  // Until today is practised, the run is measured from yesterday and today stays open.
  const run = practisedToday
    ? runFrom(practised, todayNumber, oldest)
    : runFrom(practised, todayNumber - 1, oldest, true);
  return { ...run, practised, practisedToday, oldest };
}

export function practiceStreak(log: PracticeLog, today: string): StreakSummary {
  const { count: current, rests, practised, practisedToday, oldest } = currentRun(log, today);
  let best = current;
  for (const day of practised) {
    if (practised.has(day + 1)) continue; // start each run from its newest day
    best = Math.max(best, runFrom(practised, day, oldest).count);
  }
  return {
    current,
    best,
    practisedToday,
    restDays: current > 0 ? rests.length : 0,
    atRisk: current > 0 && !practisedToday,
  };
}

export type WeekDayState = 'done' | 'rest' | 'missed' | 'today' | 'future';

/** Monday to Sunday of the current week, for the small row of day dots. */
export function weekView(log: PracticeLog, today: string) {
  const todayNumber = dayNumberOf(today);
  // 1970-01-01 was a Thursday, so the Monday-based weekday is (n + 3) mod 7.
  const monday = todayNumber - ((todayNumber + 3) % 7);
  const run = currentRun(log, today);
  const rests = new Set(run.count > 0 ? run.rests : []);
  return Array.from({ length: 7 }, (_, index) => {
    const number = monday + index;
    const day = dayFromNumber(number);
    let state: WeekDayState;
    if ((log[day] ?? []).length > 0) state = 'done';
    else if (number > todayNumber) state = 'future';
    else if (number === todayNumber) state = 'today';
    else state = rests.has(number) ? 'rest' : 'missed';
    return { day, label: 'MTWTFSS'[index], state };
  });
}

export type PracticeStage = 'warm-up' | 'building' | 'momentum';

/**
 * Slow start, then a little more: one step a day for the first few active days, two once a
 * routine forms, three after two weeks of practice. A return after a break starts small again.
 */
export function practiceStage(log: PracticeLog, today: string) {
  const days = Object.keys(log)
    .filter((day) => log[day].length > 0 && dayNumberOf(day) <= dayNumberOf(today))
    .sort();
  const activeDays = days.length;
  const last = days.at(-1);
  const daysAway = last ? dayNumberOf(today) - dayNumberOf(last) : 0;
  const returning = activeDays > 0 && daysAway >= 4;
  const stage: PracticeStage =
    returning || activeDays < 4 ? 'warm-up' : activeDays < 14 ? 'building' : 'momentum';
  return { stage, activeDays, returning, daysAway };
}

export const stageSteps: Record<PracticeStage, number> = {
  'warm-up': 1,
  building: 2,
  momentum: 3,
};
