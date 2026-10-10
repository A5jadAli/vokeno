import * as Notifications from 'expo-notifications';

import type { PlannedReminder } from './reminders';

const CHANNEL = 'practice-reminders';

// A reminder that arrives while Vokeno is open is redundant, so it stays silent.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureChannel() {
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Practice reminders',
    description: 'One reminder a day at the time you choose.',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/** Asks for permission when the learner turns reminders on. */
export async function requestReminderPermission() {
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

const pad = (value: number) => String(value).padStart(2, '0');

/** One reminder per calendar day: scheduling the same day again replaces it, never adds one. */
export function reminderId(date: number) {
  const day = new Date(date);
  return `practice-${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
}

async function replacePlan(plan: PlannedReminder[]) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!plan.length) return;
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return;
  await ensureChannel();
  for (const reminder of plan) {
    await Notifications.scheduleNotificationAsync({
      identifier: reminderId(reminder.date),
      content: { title: reminder.title, body: reminder.body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminder.date,
        channelId: CHANNEL,
      },
    });
  }
}

// Plans are applied one at a time. Without this, two quick updates (practice recorded, app
// reopened) could each cancel and then each schedule a full week, so the same evening reminder
// arrived several times at once.
let queue: Promise<void> = Promise.resolve();

/** Replaces every scheduled reminder with the given plan. Never prompts for permission. */
export function applyReminderPlan(plan: PlannedReminder[]) {
  const run = queue.then(() => replacePlan(plan));
  queue = run.catch(() => undefined);
  return run;
}

export const remindersSupported = true;
