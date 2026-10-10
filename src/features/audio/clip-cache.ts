// Voice clips on the device: downloaded once into the cache folder, then played from there, so a
// clip starts at once, like a voice note that has already arrived.
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { Directory, File, Paths } from 'expo-file-system';

type Clip = { key: string; url: string };

export const clipsSupported = true;

const folder = new Directory(Paths.cache, 'lesson-audio');
const downloads = new Map<string, Promise<string>>();

function local(key: string) {
  return new File(folder, `${key}.mp3`);
}

/** The clip's file on the device, downloading it first if needed. */
export function ensureClip(clip: Clip): Promise<string> {
  const file = local(clip.key);
  if (file.exists) return Promise.resolve(file.uri);
  let pending = downloads.get(clip.key);
  if (!pending) {
    pending = (async () => {
      if (!folder.exists) folder.create({ intermediates: true, idempotent: true });
      const saved = await File.downloadFileAsync(clip.url, folder, { idempotent: true });
      return saved.uri;
    })().finally(() => downloads.delete(clip.key));
    downloads.set(clip.key, pending);
  }
  return pending;
}

export const isClipOnDevice = (key: string) => local(key).exists;

// A small pool of ready players, most recently used last, so replays and the next lines of a
// scene start without loading.
const POOL_SIZE = 24;
const players = new Map<string, AudioPlayer>();

export function playerFor(key: string, uri: string) {
  let player = players.get(key);
  if (player) {
    players.delete(key);
  } else {
    player = createAudioPlayer({ uri });
    player.shouldCorrectPitch = true;
  }
  players.set(key, player);
  while (players.size > POOL_SIZE) {
    const [oldest, stale] = players.entries().next().value as [string, AudioPlayer];
    players.delete(oldest);
    stale.remove();
  }
  return player;
}

const PARALLEL = 6;

/**
 * Downloads clips in the background, six at a time and in the order given (the current step
 * first), and readies players for the first `ready` of them.
 */
export async function warmClips(clips: Clip[], ready = 8) {
  let next = 0;
  const worker = async () => {
    while (next < clips.length) {
      const index = next++;
      const clip = clips[index];
      try {
        const uri = await ensureClip(clip);
        if (index < ready) playerFor(clip.key, uri);
      } catch {
        // Offline or unavailable: the lesson falls back to the device voice for this line.
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(PARALLEL, clips.length) }, worker));
}
