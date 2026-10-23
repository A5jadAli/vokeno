import {
  getOrCreateSession,
  getSupabaseAnonKey,
  getSupabaseFunctionUrl,
} from '@/features/auth/supabase';
import { parseSpokenAssessment } from '@/features/assessment/types';
import type { LanguageTrack } from '@/features/language/config';
import type { TranscriptTurn } from './events';

export const conversationApiUrl =
  process.env.EXPO_PUBLIC_VOKA_API_URL?.trim() || getSupabaseFunctionUrl();

export const isConversationBackendConfigured = Boolean(conversationApiUrl);

/** The free call for this unit has been used; more unit calls come with Plus. */
export class FreeCallUsedError extends Error {
  constructor(message?: string) {
    super(
      message ??
        'You have used the free call for this unit. Unlimited unit calls come with Vokeno Plus.',
    );
    this.name = 'FreeCallUsedError';
  }
}

export type CallReview = {
  callId: string;
  corrections: { said: string; better: string; why: string }[];
  tip: string;
  facts: string[];
};

/** Accepts only a well-formed review: bounded strings and lists. */
export function parseCallReview(value: unknown): CallReview | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const review = value as Record<string, unknown>;
  const text = (item: unknown, max: number) =>
    typeof item === 'string' && item.trim() && item.length <= max ? item.trim() : undefined;
  const corrections = Array.isArray(review.corrections)
    ? review.corrections.slice(0, 3).flatMap((item) => {
        const c = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        const said = text(c.said, 160);
        const better = text(c.better, 160);
        const why = text(c.why, 120);
        return said && better && why ? [{ said, better, why }] : [];
      })
    : [];
  const facts = Array.isArray(review.facts)
    ? review.facts.slice(0, 3).flatMap((fact) => (text(fact, 80) ? [text(fact, 80)!] : []))
    : [];
  const callId = text(review.callId, 40);
  if (!callId) return undefined;
  return { callId, corrections, tip: text(review.tip, 220) ?? '', facts };
}

export async function createConversationRequest(
  sdp: string,
  track: LanguageTrack,
  options: {
    coachTone: 'supportive' | 'tough';
    goal: string;
    practice: string;
    unitId?: string;
    cardId?: string;
    callId?: string;
    memory?: { facts: string[]; mistakes: string[] };
  },
  signal?: AbortSignal,
) {
  if (!conversationApiUrl) {
    throw new Error('The secure voice service has not been connected yet.');
  }

  const session = await getOrCreateSession();
  const anonKey = getSupabaseAnonKey();
  const response = await fetch(conversationApiUrl, {
    signal,
    body: JSON.stringify({ sdp, track, ...options }),
    headers: {
      'Content-Type': 'application/json',
      ...(anonKey ? { apikey: anonKey } : {}),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    method: 'POST',
  });

  const body = (await response.json()) as {
    error?: string;
    reason?: string;
    session?: { id?: string; expiresAt?: string };
    transport?: { sdp?: string };
  };

  if (!response.ok) {
    if (body.reason === 'free-call-used') throw new FreeCallUsedError(body.error);
    throw new Error(body.error ?? `Voice service returned ${response.status}.`);
  }
  if (!body.transport?.sdp) throw new Error('Voice service returned an invalid connection.');

  const leaseId = body.session?.id;
  return {
    answerSdp: body.transport.sdp,
    sessionId: leaseId,
    expiresAt: body.session?.expiresAt,
    close: async () => {
      if (!leaseId) return;
      // Capture the creating account's token. Account switching must not close another account's call.
      await fetch(conversationApiUrl, {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
        headers: {
          'Content-Type': 'application/json',
          ...(anonKey ? { apikey: anonKey } : {}),
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ action: 'end', leaseId }),
      });
    },
  };
}

export async function createAssessmentRequest(
  track: LanguageTrack,
  turns: TranscriptTurn[],
  coachTone: 'supportive' | 'tough',
  signal?: AbortSignal,
) {
  if (!conversationApiUrl) throw new Error('The assessment service has not been connected yet.');
  const session = await getOrCreateSession();
  const anonKey = getSupabaseAnonKey();
  const response = await fetch(conversationApiUrl, {
    signal,
    body: JSON.stringify({
      action: 'assess',
      coachTone,
      track,
      turns: turns.slice(-30).map(({ role, text }) => ({ role, text: text.slice(0, 2_000) })),
    }),
    headers: {
      'Content-Type': 'application/json',
      ...(anonKey ? { apikey: anonKey } : {}),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    method: 'POST',
  });
  const body = (await response.json()) as { assessment?: unknown; error?: string };
  if (!response.ok)
    throw new Error(body.error ?? `Assessment service returned ${response.status}.`);
  const assessment = parseSpokenAssessment(body.assessment);
  if (!assessment) throw new Error('The assessment service returned an invalid result.');
  return assessment;
}

/** Asks for the after-call card of a lesson-linked unit call. */
export async function createCallReview(
  track: LanguageTrack,
  callId: string,
  turns: TranscriptTurn[],
  signal?: AbortSignal,
) {
  if (!conversationApiUrl) throw new Error('The review service has not been connected yet.');
  const session = await getOrCreateSession();
  const anonKey = getSupabaseAnonKey();
  const response = await fetch(conversationApiUrl, {
    signal,
    body: JSON.stringify({
      action: 'review',
      callId,
      track,
      turns: turns.slice(-60).map(({ role, text }) => ({ role, text: text.slice(0, 2_000) })),
    }),
    headers: {
      'Content-Type': 'application/json',
      ...(anonKey ? { apikey: anonKey } : {}),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    method: 'POST',
  });
  const body = (await response.json()) as { review?: unknown; error?: string };
  if (!response.ok) throw new Error(body.error ?? `Review service returned ${response.status}.`);
  const review = parseCallReview(body.review);
  if (!review) throw new Error('The review service returned an invalid result.');
  return review;
}
