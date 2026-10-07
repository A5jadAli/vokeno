import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ReminderPicker } from '@/components/reminder-picker';
import { useReminderStore } from '@/features/habits/reminders';

const mockRequestPermission = jest.fn<() => Promise<boolean>>();
jest.mock('@/features/habits/reminder-scheduler', () => ({
  remindersSupported: true,
  requestReminderPermission: () => mockRequestPermission(),
  applyReminderPlan: jest.fn(),
}));

describe('ReminderPicker', () => {
  beforeEach(() => {
    mockRequestPermission.mockReset();
    useReminderStore.setState({ choice: 'off', asked: false });
  });

  it('turns on a reminder when permission is granted', async () => {
    mockRequestPermission.mockResolvedValue(true);
    const screen = await render(<ReminderPicker variant="list" />);
    await fireEvent.press(screen.getByRole('radio', { name: 'Evening · 20:00' }));
    await waitFor(() => expect(useReminderStore.getState().choice).toBe('evening'));
    expect(useReminderStore.getState().asked).toBe(true);
    expect(screen.getByRole('radio', { name: 'Evening · 20:00' })).toBeChecked();
  });

  it('explains how to fix blocked notifications and stays off', async () => {
    mockRequestPermission.mockResolvedValue(false);
    const screen = await render(<ReminderPicker variant="chips" />);
    await fireEvent.press(screen.getByRole('radio', { name: 'Morning · 8:00' }));
    await waitFor(() => expect(screen.getByText(/Notifications are turned off/)).toBeTruthy());
    expect(useReminderStore.getState()).toMatchObject({ choice: 'off', asked: true });
    expect(screen.getByRole('link', { name: 'Open phone settings' })).toBeTruthy();
  });

  it('treats a permission error like a refusal instead of crashing', async () => {
    mockRequestPermission.mockRejectedValue(new Error('native module missing'));
    const screen = await render(<ReminderPicker variant="list" />);
    await fireEvent.press(screen.getByRole('radio', { name: 'Lunch break · 13:00' }));
    await waitFor(() => expect(screen.getByText(/Notifications are turned off/)).toBeTruthy());
    expect(useReminderStore.getState().choice).toBe('off');
  });

  it('records “Not now” without asking for permission, so the prompt never repeats', async () => {
    const screen = await render(<ReminderPicker variant="chips" />);
    await fireEvent.press(screen.getByRole('radio', { name: 'Not now' }));
    expect(mockRequestPermission).not.toHaveBeenCalled();
    expect(useReminderStore.getState()).toMatchObject({ choice: 'off', asked: true });
  });

  it('turns reminders off from Settings without a permission prompt', async () => {
    useReminderStore.setState({ choice: 'morning', asked: true });
    const screen = await render(<ReminderPicker variant="list" />);
    await fireEvent.press(screen.getByRole('radio', { name: 'No reminders' }));
    expect(mockRequestPermission).not.toHaveBeenCalled();
    expect(useReminderStore.getState().choice).toBe('off');
  });
});
