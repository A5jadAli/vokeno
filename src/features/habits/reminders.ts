import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const reminderSlots = {
  morning: { hour: 8, minute: 0, label: 'Morning', time: '8:00' },
  midday: { hour: 13, minute: 0, label: 'Lunch break', time: '13:00' },
  evening: { hour: 20, minute: 0, label: 'Evening', time: '20:00' },
} as const;
export type ReminderSlot = keyof typeof reminderSlots;
export type ReminderChoice = ReminderSlot | 'off';

/** Reminders run for a week after the last visit, then pause instead of nagging. */
export const REMINDER_DAYS = 7;

export type PlannedReminder = { date: number; title: string; body: string };

/**
 * The reminders to schedule from now on. Pure: the caller passes the clock and today's state.
 * Today is skipped once the learner has practised, or once the time has passed.
 */
export function planReminders({
  slot,
  now,
  practisedToday,
  language,
  nextStep,
}: {
  slot: ReminderSlot;
  now: number;
  practisedToday: boolean;
  language: string;
  nextStep?: string;
}): PlannedReminder[] {
  const { hour, minute } = reminderSlots[slot];
  const start = new Date(now);
  const reminders: PlannedReminder[] = [];
  for (let offset = 0; offset < REMINDER_DAYS; offset++) {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + offset,
      hour,
      minute,
    ).getTime();
    if (offset === 0 && (practisedToday || date <= now + 60_000)) continue;
    const last = offset === REMINDER_DAYS - 1;
    reminders.push({
      date,
      ...(last
        ? {
            title: 'Pausing reminders for now',
            body: `Your ${language} progress is saved. Open Vokeno whenever you are ready and reminders start again.`,
          }
        : message(reminders.length, language, nextStep)),
    });
  }
  return reminders;
}

function message(index: number, language: string, nextStep?: string) {
  const variants = [
    {
      title: nextStep ? `Next: ${nextStep}` : `A few minutes of ${language}?`,
      body: 'One small step today. It takes about five minutes.',
    },
    {
      title: `Time for a little ${language}`,
      body: nextStep ? `${nextStep} is ready when you are.` : 'Your next step is ready.',
    },
    {
      title: 'Keep the habit light',
      body: `Five minutes of ${language} counts. Small and steady beats long and rare.`,
    },
    {
      title: `Your ${language} phrases miss you`,
      body: 'A short review now makes them stick for longer.',
    },
  ];
  return variants[index % variants.length];
}

/** Device-level choice: reminders belong to this phone, not to the account. */
export const useReminderStore = create<{
  choice: ReminderChoice;
  /** Whether the learner has been asked once, so the prompt never repeats. */
  asked: boolean;
  setChoice: (choice: ReminderChoice) => void;
}>()(
  persist(
    (set) => ({
      choice: 'off',
      asked: false,
      setChoice: (choice) => set({ choice, asked: true }),
    }),
    { name: 'voka-reminders', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
