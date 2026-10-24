export type AudioLevels = {
  input: number;
  output: number;
  /** The phone reported a microphone level this time (an open microphone with stats). */
  inputReported?: boolean;
};

type AudioStat = { audioLevel?: number; type?: string };
type StatsReport = { forEach: (callback: (stat: AudioStat) => void) => void };
type Endpoint = { getStats?: () => Promise<StatsReport>; track?: { kind?: string } | null };
type Peer = { getReceivers?: () => Endpoint[]; getSenders?: () => Endpoint[] };

const POLL_MS = 100;

/**
 * WebRTC's audioLevel is linear (0 to 1). Speech on a phone sits roughly between -50 and
 * -12 dBFS, so that range becomes 0 to 1 and anything quieter is silence.
 */
export function loudness(audioLevel: number) {
  if (!(audioLevel > 0)) return 0;
  const db = 20 * Math.log10(audioLevel);
  return Math.min(1, Math.max(0, (db + 50) / 38));
}

/** Loudness above this counts as someone speaking. */
export const SPEECH_LOUDNESS = 0.12;

/** How high the line stands: the louder voice, with room hiss well below speech kept flat. */
export function lineLevel({ input, output }: AudioLevels) {
  const level = Math.max(loudness(input), loudness(output));
  return level < SPEECH_LOUDNESS / 2 ? 0 : level;
}

/**
 * For reduce motion: true while someone speaks, held through the short pauses between words,
 * so the still line does not flicker on and off.
 */
export function createSpeechGate(holdMs = 600) {
  let lastHeard = Number.NEGATIVE_INFINITY;
  return (loudnessNow: number, now: number) => {
    if (loudnessNow >= SPEECH_LOUDNESS) lastHeard = now;
    return now - lastHeard < holdMs;
  };
}

/** The level of one stat type, or undefined when the phone does not report it. */
async function levelOf(endpoint: Endpoint | undefined, type: string) {
  if (!endpoint?.getStats) return undefined;
  let level: number | undefined;
  (await endpoint.getStats()).forEach((stat) => {
    if (stat.type === type && typeof stat.audioLevel === 'number') {
      level = Math.max(level ?? 0, stat.audioLevel);
    }
  });
  return level;
}

/** How long a reported microphone level of exactly zero means the microphone is not working. */
export const DEAD_MICROPHONE_MS = 5000;

/**
 * A working microphone always picks up some room sound; a blocked or dead one reports exact
 * digital silence. True once an open microphone has reported zero for the whole turn so far
 * (at least DEAD_MICROPHONE_MS). Phones that never report a level never trigger it.
 */
export function createDeadMicrophoneCheck() {
  let silentSince: number | null = null;
  return (levels: AudioLevels | null, now: number) => {
    if (!levels?.inputReported || levels.input > 0) {
      silentSince = null;
      return false;
    }
    silentSince ??= now;
    return now - silentSince >= DEAD_MICROPHONE_MS;
  };
}

/**
 * Polls the real microphone level (media-source) and the coach's incoming level (inbound-rtp)
 * from the call's own stats, so the voice line only moves when someone is actually speaking.
 * A closed microphone reads as silence and is not reported. Returns a stop function.
 */
export function watchAudioLevels(
  peer: Peer,
  microphoneOpen: () => boolean,
  onLevels: (levels: AudioLevels) => void,
) {
  let stopped = false;
  let polling = false;
  const isAudio = (endpoint: Endpoint) => endpoint.track?.kind === 'audio';
  const timer = setInterval(() => {
    if (polling) return;
    polling = true;
    Promise.all([
      microphoneOpen() ? levelOf(peer.getSenders?.().find(isAudio), 'media-source') : undefined,
      levelOf(peer.getReceivers?.().find(isAudio), 'inbound-rtp'),
    ])
      .then(([input, output]) => {
        if (stopped) return;
        onLevels({ input: input ?? 0, output: output ?? 0, inputReported: input !== undefined });
      })
      .catch(() => undefined)
      .finally(() => {
        polling = false;
      });
  }, POLL_MS);
  return () => {
    stopped = true;
    clearInterval(timer);
  };
}
