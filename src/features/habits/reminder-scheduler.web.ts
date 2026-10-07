import type { PlannedReminder } from './reminders';

// Browsers have no scheduled local notifications for this app; reminders are mobile-only.
export async function requestReminderPermission() {
  return false;
}

export async function applyReminderPlan(_plan: PlannedReminder[]) {}

export const remindersSupported = false;
