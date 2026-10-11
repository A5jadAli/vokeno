// Recorded AI voice clips: which exist, and where they live. The key covers the language, the
// voice, its direction and the exact words, so recasting a character or editing a line makes a
// new clip instead of playing a stale one.

import type { LanguageTrack } from '@/features/language/config';

import manifest from './clips.json';
import { castingFor, nativeDirection, type Casting } from './voices';

function fnv(text: string, seed: number) {
  let hash = seed;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).padStart(7, '0');
}

/** The words exactly as they will be spoken: one form for the same sentence. */
export const spokenForm = (text: string) => text.normalize('NFC').trim().replace(/\s+/g, ' ');

export function clipKey(track: LanguageTrack, text: string, casting: Casting) {
  const source = [track, casting.voice, casting.direction, spokenForm(text)].join('|');
  return `${fnv(source, 0x811c9dc5)}${fnv(source, 0x01000193)}`;
}

/** Everything the voice is told: the language's native direction, then the character's. */
export const fullDirection = (track: LanguageTrack, casting: Casting) =>
  `${nativeDirection[track]} ${casting.direction}`;

// Each recorded clip, with the second at which the voice stops (the files end in silence).
const recorded: Record<string, number> = manifest.clips;

export const AUDIO_BUCKET = 'lesson-audio';

/** The clip for a line, if one has been recorded. */
export function findClip(track: LanguageTrack, text: string, speaker?: string) {
  const key = clipKey(track, text, castingFor(track, speaker));
  if (!(key in recorded)) return undefined;
  const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!base) return undefined;
  const end = recorded[key];
  // A re-recorded clip keeps its key but not its length, so the length names this take: the
  // download skips any cached copy of an older take, and the device keeps the takes apart.
  const take = Math.round(end * 100);
  return {
    key: `${key}.${take}`,
    url: `${base}/storage/v1/object/public/${AUDIO_BUCKET}/${key}.mp3?take=${take}`,
    /** Seconds until the voice stops; 0 when not measured, so the clip plays to its end. */
    end,
  };
}

export type Clip = NonNullable<ReturnType<typeof findClip>>;
