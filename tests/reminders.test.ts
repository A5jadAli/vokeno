import { describe, expect, it } from '@jest/globals';

import { planReminders, REMINDER_DAYS, reminderSlots } from '@/features/habits/reminders';

const at = (month: number, day: number, hour: number, minute = 0) =>
  new Date(2026, month - 1, day, hour, minute).getTime();
const base = { slot: 'evening' as const, language: 'Spanish', practisedToday: false };

describe('reminder planning', () => {
  it('includes today when not practised and the time is still ahead', () => {
    const plan = planReminders({ ...base, now: at(10, 7, 9) });
    expect(plan).toHaveLength(REMINDER_DAYS);
    expect(new Date(plan[0].date)).toEqual(new Date(2026, 9, 7, 20, 0));
  });

  it('skips today once the learner has practised', () => {
    const plan = planReminders({ ...base, now: at(10, 7, 9), practisedToday: true });
    expect(plan).toHaveLength(REMINDER_DAYS - 1);
    expect(new Date(plan[0].date)).toEqual(new Date(2026, 9, 8, 20, 0));
  });

  it('skips today when the time has passed or is less than a minute away', () => {
    expect(planReminders({ ...base, now: at(10, 7, 21) })).toHaveLength(REMINDER_DAYS - 1);
    expect(planReminders({ ...base, now: at(10, 7, 19, 59) + 30_000 })).toHaveLength(
      REMINDER_DAYS - 1,
    );
  });

  it('schedules each day at the chosen local time, across month and year ends', () => {
    for (const slot of Object.keys(reminderSlots) as (keyof typeof reminderSlots)[]) {
      const plan = planReminders({ ...base, slot, now: at(12, 29, 6) });
      for (const reminder of plan) {
        const date = new Date(reminder.date);
        expect(date.getHours()).toBe(reminderSlots[slot].hour);
        expect(date.getMinutes()).toBe(reminderSlots[slot].minute);
      }
      const days = plan.map((reminder) => new Date(reminder.date).getDate());
      expect(days).toEqual([29, 30, 31, 1, 2, 3, 4]);
      expect(new Date(plan.at(-1)!.date).getFullYear()).toBe(2027);
    }
  });

  it('ends with a message that reminders are pausing', () => {
    const plan = planReminders({ ...base, now: at(10, 7, 9) });
    expect(plan.at(-1)?.title).toBe('Pausing reminders for now');
    expect(plan.at(-1)?.body).toMatch(/progress is saved/);
    expect(plan.slice(0, -1).every((reminder) => !reminder.title.includes('Pausing'))).toBe(true);
  });

  it('names the next step and varies the wording from day to day', () => {
    const plan = planReminders({ ...base, now: at(10, 7, 9), nextStep: 'Order at a café' });
    expect(plan[0].title).toBe('Next: Order at a café');
    for (let i = 1; i < plan.length; i++) expect(plan[i].title).not.toBe(plan[i - 1].title);
  });

  it('never uses guilt or pressure language', () => {
    const plan = planReminders({ ...base, now: at(10, 7, 9), nextStep: 'Meet someone' });
    const text = plan.map((reminder) => `${reminder.title} ${reminder.body}`).join(' ');
    expect(text).not.toMatch(/lose|losing|break|broken|disappoint|sad|last chance|hurry/i);
  });
});
