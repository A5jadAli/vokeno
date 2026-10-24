import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
  createDeadMicrophoneCheck,
  createSpeechGate,
  lineLevel,
  loudness,
  SPEECH_LOUDNESS,
  voiceLineShape,
  watchAudioLevels,
} from '@/features/conversation/audio-levels';

const db = (value: number) => 10 ** (value / 20);

describe('voice line levels', () => {
  it('maps speech loudness to 0 to 1 and silence to 0', () => {
    expect(loudness(0)).toBe(0);
    expect(loudness(Number.NaN)).toBe(0);
    expect(loudness(db(-60))).toBe(0);
    expect(loudness(db(-12))).toBeCloseTo(1);
    expect(loudness(1)).toBe(1);
    expect(loudness(db(-31))).toBeCloseTo(0.5);
  });

  it('follows the louder voice and keeps room hiss flat', () => {
    expect(lineLevel({ input: db(-48), output: 0 })).toBe(0);
    expect(lineLevel({ input: 0, output: db(-20) })).toBeCloseTo(30 / 38);
    expect(lineLevel({ input: db(-20), output: db(-40) })).toBeCloseTo(30 / 38);
  });

  it('draws the mark: level ends, small rises, the deep dip in the middle', () => {
    expect(voiceLineShape(0)).toBeCloseTo(0);
    expect(voiceLineShape(1)).toBeCloseTo(0);
    expect(voiceLineShape(0.5)).toBeCloseTo(1);
    expect(voiceLineShape(1 / 6)).toBeLessThan(0);
    expect(voiceLineShape(5 / 6)).toBeCloseTo(voiceLineShape(1 / 6));
  });

  it('holds the still line through short pauses, then lets it fall flat', () => {
    const speaking = createSpeechGate(600);
    expect(speaking(0, 0)).toBe(false);
    expect(speaking(SPEECH_LOUDNESS, 100)).toBe(true);
    expect(speaking(0, 500)).toBe(true);
    expect(speaking(0, 701)).toBe(false);
  });
});

describe('watching call audio levels', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const report = (stats: object[]) => ({
    forEach: (callback: (stat: object) => void) => stats.forEach(callback),
  });
  const peer = (microphone: number, coach: number) => ({
    getSenders: () => [
      { track: { kind: 'video' }, getStats: async () => report([]) },
      {
        track: { kind: 'audio' },
        getStats: async () =>
          report([{ type: 'outbound-rtp' }, { type: 'media-source', audioLevel: microphone }]),
      },
    ],
    getReceivers: () => [
      {
        track: { kind: 'audio' },
        getStats: async () => report([{ type: 'inbound-rtp', audioLevel: coach }]),
      },
    ],
  });

  it('reports the real microphone and coach levels', async () => {
    const onLevels = jest.fn();
    const stop = watchAudioLevels(peer(0.2, 0.4), () => true, onLevels);
    await jest.advanceTimersByTimeAsync(100);
    expect(onLevels).toHaveBeenLastCalledWith({ input: 0.2, output: 0.4, inputReported: true });
    stop();
  });

  it('reads a closed microphone as silence and stops when asked', async () => {
    const onLevels = jest.fn();
    const stop = watchAudioLevels(peer(0.2, 0), () => false, onLevels);
    await jest.advanceTimersByTimeAsync(100);
    expect(onLevels).toHaveBeenLastCalledWith({ input: 0, output: 0, inputReported: false });
    stop();
    onLevels.mockClear();
    await jest.advanceTimersByTimeAsync(500);
    expect(onLevels).not.toHaveBeenCalled();
  });

  it('stays quiet when the connection has no stats', async () => {
    const onLevels = jest.fn();
    const stop = watchAudioLevels({}, () => true, onLevels);
    await jest.advanceTimersByTimeAsync(300);
    expect(onLevels).toHaveBeenLastCalledWith({ input: 0, output: 0, inputReported: false });
    stop();
  });
});

describe('dead microphone', () => {
  it('warns only after an open microphone reports exact silence for five seconds', () => {
    const dead = createDeadMicrophoneCheck();
    const silent = { input: 0, output: 0, inputReported: true };
    expect(dead(silent, 0)).toBe(false);
    expect(dead(silent, 4900)).toBe(false);
    expect(dead(silent, 5000)).toBe(true);
    // Any room sound, even very quiet, means the microphone works.
    expect(dead({ ...silent, input: 0.0001 }, 5100)).toBe(false);
    expect(dead(silent, 5200)).toBe(false);
  });

  it('never warns for a closed microphone or a phone that does not report a level', () => {
    const dead = createDeadMicrophoneCheck();
    expect(dead({ input: 0, output: 0, inputReported: false }, 0)).toBe(false);
    expect(dead({ input: 0, output: 0, inputReported: false }, 60_000)).toBe(false);
    expect(dead(null, 120_000)).toBe(false);
  });
});
