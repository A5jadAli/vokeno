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

/** Replaces every scheduled reminder with the given plan. Never prompts for permission. */
export async function applyReminderPlan(plan: PlannedReminder[]) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!plan.length) return;
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return;
  await ensureChannel();
  for (const reminder of plan) {
    await Notifications.scheduleNotificationAsync({
      content: { title: reminder.title, body: reminder.body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminder.date,
        channelId: CHANNEL,
      },
    });
  }
}

export const remindersSupported = true;
