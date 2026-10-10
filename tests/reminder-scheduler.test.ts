import { describe, expect, it, jest } from '@jest/globals';

import { applyReminderPlan, reminderId } from '@/features/habits/reminder-scheduler';
import { planReminders } from '@/features/habits/reminders';

const scheduled = new Map<string, number>();
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(async () => undefined),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
  getPermissionsAsync: jest.fn(async () => ({ granted: true, canAskAgain: true })),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    scheduled.clear();
  }),
  scheduleNotificationAsync: jest.fn(
    async ({ identifier, trigger }: { identifier?: string; trigger: { date: number } }) => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      scheduled.set(identifier ?? `random-${Math.random()}`, trigger.date);
      return identifier ?? '';
    },
  ),
}));

describe('reminder scheduling', () => {
  it('keeps one reminder per day when several updates arrive at once', async () => {
    const now = new Date(2026, 9, 10, 9).getTime();
    const plan = planReminders({
      slot: 'evening',
      now,
      practisedToday: false,
      language: 'German',
    });
    await Promise.all([1, 2, 3, 4].map(() => applyReminderPlan(plan)));
    expect(scheduled.size).toBe(plan.length);
    const days = [...scheduled.keys()];
    expect(new Set(days).size).toBe(days.length);
    expect(days).toContain(reminderId(plan[0].date));
  });

  it('names each reminder after its calendar day', () => {
    expect(reminderId(new Date(2026, 9, 10, 20).getTime())).toBe('practice-2026-10-10');
  });
});
