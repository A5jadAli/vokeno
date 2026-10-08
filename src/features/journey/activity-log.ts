// Completed activities by day, by ID. The practice log answers "did you practise today?" (any
// step counts, for the streak); this log answers "what did you finish?", which is the only thing
// allowed to tick an item in today's session or a lesson in the course.

import type { LanguageTrack } from '@/features/language/config';
import { dayNumberOf } from '@/features/habits/practice-log';

/** `lesson:<lessonId>`, `review:<track>`, `listening:<scenarioId>` or `speaking:<unitId|track>`. */
export type ActivityKey =
  `lesson:${string}` | `review:${LanguageTrack}` | `listening:${string}` | `speaking:${string}`;

/** Local day (YYYY-MM-DD) → activities finished that day. */
export type ActivityLog = Record<string, ActivityKey[]>;

/** Long enough for today's session and a short look back; small enough to keep on the device. */
export const ACTIVITY_LOG_DAYS = 14;
const MAX_PER_DAY = 40;

export function addActivity(log: ActivityLog, key: ActivityKey, today: string): ActivityLog {
  const existing = log[today] ?? [];
  if (existing.includes(key)) return log;
  const newest = dayNumberOf(today);
  const kept = Object.entries(log).filter(([day]) => {
    const number = dayNumberOf(day);
    return Number.isFinite(number) && number <= newest && newest - number < ACTIVITY_LOG_DAYS;
  });
  return Object.fromEntries([
    ...kept.filter(([day]) => day !== today),
    [today, [...existing, key].slice(-MAX_PER_DAY)],
  ]);
}

export function finishedOn(log: ActivityLog, day: string, key: ActivityKey) {
  return (log[day] ?? []).includes(key);
}

const KEY = /^(lesson|listening|speaking):[A-Za-z0-9-]{1,80}$|^review:(EN|DE|ES)$/;

/** Drops malformed days and keys, so stored data can never break the plan. */
export function parseActivityLog(value: unknown): ActivityLog {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const log: ActivityLog = {};
  for (const [day, keys] of Object.entries(value as Record<string, unknown>)) {
    if (!Number.isFinite(dayNumberOf(day)) || !Array.isArray(keys)) continue;
    const valid = keys.filter(
      (key): key is ActivityKey => typeof key === 'string' && KEY.test(key),
    );
    if (valid.length) log[day] = [...new Set(valid)].slice(-MAX_PER_DAY);
  }
  return log;
}
