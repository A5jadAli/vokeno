import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { SpeakingPractice } from '@/components/speaking-practice';
import type { LessonAudio } from '@/features/audio/use-lesson-audio';
import type { LessonStep } from '@/features/foundations/types';

jest.mock('expo-router', () => ({ useRouter: () => ({}) }));

const step: Extract<LessonStep, { kind: 'speak' }> = {
  kind: 'speak',
  prompt: 'Introduce yourself.',
  lines: ['Me llamo Sara.'],
  mission: { checks: ['Give a name.'], twist: 'Now ask someone their name using usted.' },
};
const audio = () =>
  ({
    stop: jest.fn(),
    play: jest.fn<LessonAudio['play']>(),
    busy: false,
    loading: false,
    activeText: '',
    activeRate: 0.9,
    error: '',
  }) as unknown as LessonAudio;

describe('optional speaking models', () => {
  it('keeps the model and its accessible audio label out of the initial attempt, and shows help on request', async () => {
    const speech = audio();
    const screen = await render(<SpeakingPractice step={step} speech={speech} />);
    expect(screen.queryByText(step.lines[0])).toBeNull();
    expect(screen.queryByRole('button', { name: `Hear: ${step.lines[0]}` })).toBeNull();
    expect(screen.getByText(/Nothing is recorded or scored here/)).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Show an example' }).props.accessibilityState.expanded,
    ).toBe(false);
    await fireEvent.press(screen.getByRole('button', { name: 'Show an example' }));
    expect(screen.getByText(step.lines[0])).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Hide the example and try again' }).props
        .accessibilityState.expanded,
    ).toBe(true);
    await fireEvent.press(screen.getByRole('button', { name: `Hear: ${step.lines[0]}` }));
    expect(speech.play).toHaveBeenCalledWith(step.lines[0], 0.9);
    await fireEvent.press(screen.getByRole('button', { name: 'Hide the example and try again' }));
    expect(screen.queryByText(step.lines[0])).toBeNull();
    expect(speech.stop).toHaveBeenCalledTimes(2);
  });

  it('hides the model and stops playback when moving to a changed situation', async () => {
    const speech = audio();
    const screen = await render(<SpeakingPractice step={step} speech={speech} />);
    expect(screen.queryByText(step.mission!.twist)).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Show an example' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Try a different situation' }));
    expect(screen.getByText(step.mission!.twist)).toBeTruthy();
    expect(screen.queryByText(step.lines[0])).toBeNull();
    expect(speech.stop).toHaveBeenCalledTimes(2);
  });

  it('supports existing sessions without a mission', async () => {
    const screen = await render(
      <SpeakingPractice step={{ ...step, mission: undefined }} speech={audio()} />,
    );
    expect(screen.queryByText('Check your own response')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Try a different situation' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Show an example' })).toBeTruthy();
  });
});
