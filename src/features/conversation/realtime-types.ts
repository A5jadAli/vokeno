import type { LanguageTrack } from '@/features/listening/scenarios';
import type { SpeakingGoal } from '@/features/coaching/store';

import type { AudioLevels } from './audio-levels';
import type { RealtimeEvent } from './events';

export type RealtimeSessionStatus =
  'connecting' | 'ended' | 'error' | 'joining' | 'listening' | 'speaking' | 'thinking';

export type StartRealtimeSessionOptions = {
  coachTone: 'supportive' | 'tough';
  goal: SpeakingGoal;
  onEvent: (event: RealtimeEvent) => void;
  /** Real microphone and coach levels, about ten times a second while the call is live. */
  onLevels?: (levels: AudioLevels) => void;
  onStatus: (status: RealtimeSessionStatus) => void;
  practice: 'conversation' | 'diagnostic';
  signal?: AbortSignal;
  starter: string;
  /** Keep the microphone closed until the caller opens it with `setMuted(false)`. */
  startMuted?: boolean;
  track: LanguageTrack;
  unitId?: string;
  /** A whitelisted exam task card, for speaking mocks. */
  cardId?: string;
  /** A lesson-linked unit call, and what the learner chose to let the coach remember. */
  callId?: string;
  memory?: { facts: string[]; mistakes: string[] };
};

export type RealtimeSessionHandle = {
  setMuted: (muted: boolean) => void;
  stop: () => void;
};
