import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
  createDeadMicrophoneCheck,
  createSpeechGate,
  lineLevel,
  loudness,
  SPEECH_LOUDNESS,
  watchAudioLevels,
} from '@/features/conversation/audio-levels';
import { markPoints, voiceLineSegments } from '@/components/voice-line-geometry';

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

  it('draws the icon mark: level ends, small rises, the deep dip in the middle', () => {
    const points = markPoints();
    const at = (x: number) =>
      points.reduce((best, p) => (Math.abs(p[0] - x) < Math.abs(best[0] - x) ? p : best));
    expect(points[0]).toEqual([0, 0]);
    expect(points[points.length - 1]).toEqual([1, 0]);
    expect(at(0.5)[1]).toBeCloseTo(1);
    expect(Math.min(...points.map((p) => p[1]))).toBeCloseTo(-0.375);
    // The ends leave level, as on the app icon: almost no rise over the first 2%.
    expect(Math.abs(at(0.02)[1])).toBeLessThan(0.03);
    expect(at(0.8)[1]).toBeCloseTo(at(0.2)[1]);
  });

  it('cuts the line into short joined pieces that span the box', () => {
    const segments = voiceLineSegments(220, 88, 7);
    expect(segments.length).toBeGreaterThan(30);
    expect(segments.length).toBeLessThan(50);
    for (const [index, piece] of segments.entries()) {
      expect(piece.length).toBeLessThanOrEqual(7.01);
      const next = segments[index + 1];
      if (next) {
        // Each piece ends where the next begins.
        expect(piece.x + piece.dx / 2).toBeCloseTo(next.x - next.dx / 2);
        expect(piece.y + piece.dy / 2).toBeCloseTo(next.y - next.dy / 2);
      }
    }
    const first = segments[0];
    const last = segments[segments.length - 1];
    expect(first.x - first.dx / 2).toBeCloseTo(3.5);
    expect(last.x + last.dx / 2).toBeCloseTo(216.5);
    expect(Math.max(...segments.map((piece) => piece.y))).toBeLessThanOrEqual(40.5);
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
  it('warns only when an open microphone has heard nothing for eight seconds', () => {
    const dead = createDeadMicrophoneCheck();
    const silent = { input: 0, output: 0, inputReported: true };
    expect(dead(silent, 0)).toBe(false);
    expect(dead(silent, 7900)).toBe(false);
    expect(dead(silent, 8000)).toBe(true);
  });

  it('treats silence after any sound as a quiet room (noise suppression reports zero)', () => {
    const dead = createDeadMicrophoneCheck();
    const silent = { input: 0, output: 0, inputReported: true };
    expect(dead({ ...silent, input: 0.0001 }, 0)).toBe(false);
    expect(dead(silent, 1000)).toBe(false);
    expect(dead(silent, 60_000)).toBe(false);
  });

  it('never warns for a closed microphone or a phone that does not report a level', () => {
    const dead = createDeadMicrophoneCheck();
    expect(dead({ input: 0, output: 0, inputReported: false }, 0)).toBe(false);
    expect(dead({ input: 0, output: 0, inputReported: false }, 60_000)).toBe(false);
    expect(dead(null, 120_000)).toBe(false);
  });
});
