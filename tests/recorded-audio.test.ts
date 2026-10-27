import { act, renderHook } from '@testing-library/react-native';
import { expect, it, jest } from '@jest/globals';
import type { AudioPlayer } from 'expo-audio';
import * as cache from '@/features/audio/clip-cache';
import { useLessonAudio } from '@/features/audio/use-lesson-audio';

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = jest.requireActual<typeof import('react')>('react');
    React.useEffect(callback, [callback]);
  },
}));
jest.mock('@/features/feedback/sounds', () => ({ markVoice: jest.fn() }));
jest.mock('@/features/audio/clips', () => ({
  findClip: () => ({ key: 'clip', url: 'test.mp3', end: 1 }),
}));
jest.mock('@/features/audio/clip-cache', () => ({
  clipsSupported: true,
  ensureClip: jest.fn(async () => 'test.mp3'),
  isClipOnDevice: () => true,
  playerFor: jest.fn(),
}));
jest.mock('@/features/listening/use-lesson-speech', () => {
  const stop = jest.fn();
  const playSequence = jest.fn();
  // Like the real hook: a fresh result object each render, with stable methods.
  return {
    useLessonSpeech: () => ({ stop, playSequence, busy: false, playing: false, loading: false }),
  };
});

it('keeps a recorded clip playing through state renders and stops it when the screen leaves', async () => {
  let status!: (event: { currentTime: number; didJustFinish: boolean }) => void;
  const player = {
    currentTime: 0,
    setPlaybackRate: jest.fn(),
    pause: jest.fn(),
    play: jest.fn(),
    addListener: jest.fn((_name, callback: typeof status) => {
      status = callback;
      return { remove: jest.fn() };
    }),
  };
  jest.mocked(cache.playerFor).mockReturnValue(player as unknown as AudioPlayer);
  const hook = await renderHook(() => useLessonAudio('EN'));
  await act(async () => {
    void hook.result.current.play('Hello.');
  });
  expect(player.play).toHaveBeenCalledTimes(1);
  expect(hook.result.current.playing).toBe(true);
  expect(player.pause).not.toHaveBeenCalled();
  await act(() => status({ currentTime: 1.2, didJustFinish: true }));
  expect(hook.result.current.playing).toBe(false);
  await act(async () => {
    void hook.result.current.play('Hello.');
  });
  const pauses = player.pause.mock.calls.length;
  await hook.unmount();
  expect(player.pause).toHaveBeenCalledTimes(pauses + 1);
});
