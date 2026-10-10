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

const available = new Set<string>(manifest.clips);

export const AUDIO_BUCKET = 'lesson-audio';

/** The clip for a line, if one has been recorded. */
export function findClip(track: LanguageTrack, text: string, speaker?: string) {
  const key = clipKey(track, text, castingFor(track, speaker));
  if (!available.has(key)) return undefined;
  const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!base) return undefined;
  return { key, url: `${base}/storage/v1/object/public/${AUDIO_BUCKET}/${key}.mp3` };
}
