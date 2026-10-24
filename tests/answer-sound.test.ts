import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
  markVoice,
  playAnswerSound,
  prepareAnswerSound,
  useSoundSettings,
} from '@/features/feedback/sounds';

const mockCalls: string[] = [];
let mockStatusListener: ((status: { didJustFinish: boolean }) => void) | undefined;
const mockPlayer = {
  currentTime: 0,
  loop: true,
  addListener: jest.fn((_event: string, listener: (status: { didJustFinish: boolean }) => void) => {
    mockStatusListener = listener;
  }),
  play: jest.fn(() => mockCalls.push('play')),
  pause: jest.fn(() => mockCalls.push('pause')),
  seekTo: jest.fn(async () => {
    mockCalls.push('seek');
  }),
};
jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => mockPlayer),
  setAudioModeAsync: jest.fn(async (mode: object) => {
    mockCalls.push(`mode ${JSON.stringify(mode)}`);
  }),
}));

describe('answer sound', () => {
  let now = 1_000_000;
  beforeEach(() => {
    mockCalls.length = 0;
    now += 10_000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    useSoundSettings.setState({ answerSounds: true });
  });

  it('does nothing before the chime is loaded', async () => {
    await playAnswerSound();
    expect(mockCalls).toEqual([]);
  });

  it('plays with silent mode respected, then gives the default mode back', async () => {
    prepareAnswerSound();
    await playAnswerSound();
    expect(mockCalls).toEqual([
      'mode {"playsInSilentMode":false,"interruptionMode":"mixWithOthers"}',
      'play',
      'mode {}',
    ]);
  });

  it('plays once when two parts of a screen report the same answer', async () => {
    prepareAnswerSound();
    await playAnswerSound();
    now += 50;
    await playAnswerSound();
    expect(mockCalls.filter((call) => call === 'play')).toHaveLength(1);
  });

  it('stays silent when turned off or while a lesson voice speaks', async () => {
    prepareAnswerSound();
    useSoundSettings.setState({ answerSounds: false });
    await playAnswerSound();
    useSoundSettings.setState({ answerSounds: true });
    const voice = {};
    markVoice(voice, true);
    now += 1000;
    await playAnswerSound();
    expect(mockCalls).toEqual([]);
    markVoice(voice, false);
    now += 1000;
    await playAnswerSound();
    expect(mockCalls).toContain('play');
  });

  it('plays once: when the chime ends it pauses before rewinding, so it cannot replay itself', async () => {
    prepareAnswerSound();
    expect(mockPlayer.loop).toBe(false);
    mockCalls.length = 0;
    mockStatusListener?.({ didJustFinish: false });
    expect(mockCalls).toEqual([]);
    mockStatusListener?.({ didJustFinish: true });
    expect(mockCalls).toEqual(['pause', 'seek']);
  });
});
