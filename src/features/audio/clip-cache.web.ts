// The web build has no device file cache: lessons there use the device voice.
import type { AudioPlayer } from 'expo-audio';

export const clipsSupported = false;

export function ensureClip(): Promise<string> {
  return Promise.reject(new Error('Voice clips are not cached on the web'));
}

export const isClipOnDevice = (_key: string) => false;

export function playerFor(_key: string, _uri: string): AudioPlayer {
  throw new Error('Voice clips are not played on the web');
}

export async function warmClips(_clips: { key: string; url: string }[], _ready?: number) {}
