// A small, honest record of practice days. Everything here is pure so the habit rules can be
// tested without a device clock. Days are the learner's local calendar days, not UTC days.

import type { LanguageTrack } from '@/features/language/config';

export const practiceKinds = ['lesson', 'review', 'listening', 'speaking', 'writing'] as const;
export type PracticeKind = (typeof practiceKinds)[number];
/**
 * What was practised, and in which language ('lesson:ES'). Entries recorded before languages
 * were tracked have no language: they count for the streak but never tick a language's plan.
 */
export type PracticeEntry = PracticeKind | `${PracticeKind}:${LanguageTrack}`;

/** Local day (YYYY-MM-DD) → what was practised that day. */
export type PracticeLog = Record<string, PracticeEntry[]>;

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
const trackCodes: Record<LanguageTrack, string> = { EN: 'E', DE: 'D', ES: 'S' };
const tracksByCode = Object.fromEntries(
  Object.entries(trackCodes).map(([track, code]) => [code, track]),
) as Record<string, LanguageTrack>;

/** The kinds practised on a day in one language. */
export function practisedKinds(log: PracticeLog, day: string, track: LanguageTrack) {
  return (log[day] ?? [])
    .filter((entry) => entry.endsWith(`:${track}`))
    .map((entry) => entry.split(':')[0] as PracticeKind);
}

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

export function addPractice(
  log: PracticeLog,
  kind: PracticeKind,
  time: number,
  track?: LanguageTrack,
): PracticeLog {
  const today = localDay(time);
  const entry: PracticeEntry = track ? `${kind}:${track}` : kind;
  const existing = log[today] ?? [];
  if (existing.includes(entry)) return log;
  return prune({ ...log, [today]: [...existing, entry] }, today);
}

export function mergePracticeLogs(local: PracticeLog, remote: PracticeLog, today: string) {
  const merged: PracticeLog = { ...local };
  for (const [day, entries] of Object.entries(remote)) {
    merged[day] = [...new Set([...(merged[day] ?? []), ...entries])];
  }
  return prune(merged, today);
}

/** Cloud form: ['2026-10-07:lSrD', …]: a kind letter, then an optional language letter. */
export function serializePracticeLog(log: PracticeLog): string[] {
  return Object.keys(log)
    .sort()
    .map((day) => {
      const letters = log[day].map((entry) => {
        const [kind, track] = entry.split(':') as [PracticeKind, LanguageTrack | undefined];
        return codes[kind] + (track ? trackCodes[track] : '');
      });
      return `${day}:${letters.join('')}`;
    });
}

/** Unknown letters and malformed days are dropped. */
export function parsePracticeLog(value: unknown): PracticeLog {
  if (!Array.isArray(value)) return {};
  const log: PracticeLog = {};
  for (const item of value.slice(-PRACTICE_LOG_DAYS * 2)) {
    if (typeof item !== 'string') continue;
    const [day, letters = ''] = item.split(':');
    if (!Number.isFinite(dayNumberOf(day))) continue;
    const entries = new Set<PracticeEntry>();
    for (const [, code, trackCode] of letters.matchAll(/([a-z])([A-Z]?)/g)) {
      const kind = kindsByCode[code];
      if (!kind) continue;
      const track = tracksByCode[trackCode];
      if (trackCode && !track) continue;
      entries.add(track ? `${kind}:${track}` : kind);
    }
    if (entries.size) log[day] = [...entries];
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

/** `before` is a day before the learner's first practice: not missed, just not started. */
export type WeekDayState = 'done' | 'rest' | 'missed' | 'today' | 'future' | 'before';

/** Monday to Sunday of the current week, for the small row of day dots. */
export function weekView(log: PracticeLog, today: string) {
  const todayNumber = dayNumberOf(today);
  // 1970-01-01 was a Thursday, so the Monday-based weekday is (n + 3) mod 7.
  const monday = todayNumber - ((todayNumber + 3) % 7);
  const run = currentRun(log, today);
  const rests = new Set(run.count > 0 ? run.rests : []);
  const firstPractice = Math.min(...[...run.practised]);
  return Array.from({ length: 7 }, (_, index) => {
    const number = monday + index;
    const day = dayFromNumber(number);
    let state: WeekDayState;
    if ((log[day] ?? []).length > 0) state = 'done';
    else if (number > todayNumber) state = 'future';
    else if (number === todayNumber) state = 'today';
    else if (!Number.isFinite(firstPractice) || number < firstPractice) state = 'before';
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
  // Decided from days before today, so practising today never changes today's plan size.
  const days = Object.keys(log)
    .filter((day) => log[day].length > 0 && dayNumberOf(day) < dayNumberOf(today))
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

/**
 * Practice days the app already knew about before the practice log existed, or that arrive with
 * an account on a new phone: finished lesson attempts and recorded speaking or writing days.
 * Merging these keeps an existing learner's streak and stage honest instead of starting at zero.
 */
export function historyLog(
  lessonAttempts: { at: string; track?: LanguageTrack }[],
  speakingDays: string[],
  writingDays: string[],
): PracticeLog {
  const log: PracticeLog = {};
  const add = (day: string, entry: PracticeEntry) => {
    if (!Number.isFinite(dayNumberOf(day))) return;
    log[day] = log[day]?.includes(entry) ? log[day] : [...(log[day] ?? []), entry];
  };
  for (const { at, track } of lessonAttempts) {
    const time = Date.parse(at);
    if (Number.isFinite(time)) add(localDay(time), track ? `lesson:${track}` : 'lesson');
  }
  for (const day of speakingDays) add(day, 'speaking');
  for (const day of writingDays) add(day, 'writing');
  return log;
}
