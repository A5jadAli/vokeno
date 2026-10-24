import AsyncStorage from '@react-native-async-storage/async-storage';
import { type AudioPlayer, createAudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Device-level choice, like reminders: sounds belong to this phone, not to the account. */
export const useSoundSettings = create<{
  answerSounds: boolean;
  setAnswerSounds: (on: boolean) => void;
}>()(
  persist(
    (set) => ({
      answerSounds: true,
      setAnswerSounds: (answerSounds) => set({ answerSounds }),
    }),
    { name: 'voka-sounds', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

// Lesson voices that are playing now; the chime never plays over one of them.
const voices = new Set<object>();
export function markVoice(owner: object, playing: boolean) {
  if (playing) voices.add(owner);
  else voices.delete(owner);
}

let player: AudioPlayer | null = null;
let lastPlayed = 0;

/** Loads the chime before the first answer, so it lands together with the haptic. */
export function prepareAnswerSound() {
  if (Platform.OS === 'web' || player) return;
  const chime = createAudioPlayer(require('../../../assets/sounds/correct.wav'));
  chime.loop = false;
  chime.addListener('playbackStatusUpdate', (status) => {
    if (!status.didJustFinish) return;
    // Pause first: the player still wants to play after it ends, so rewinding alone would start
    // the chime again, and again (shipped by mistake on 24 October 2026). Then rewind, so the
    // next answer can play it without waiting for a seek.
    chime.pause();
    void chime.seekTo(0);
  });
  player = chime;
}

/**
 * A 180 ms chime for a right answer, at media volume like every other sound in the app. Silent
 * when the learner turned answer sounds off, while a lesson voice is speaking, and when two
 * parts of a screen report the same answer within a moment of each other.
 *
 * It does not change the audio mode to follow the ringer: on Android, expo-audio's
 * setAudioModeAsync also forces the speakerphone, which would move a later call's audio to the
 * loudspeaker, and it delayed the chime past the haptic. Following silent or vibrate needs a
 * native ringer check in the next store build.
 */
export async function playAnswerSound() {
  const now = Date.now();
  if (!player || !useSoundSettings.getState().answerSounds || voices.size) return;
  if (now - lastPlayed < 400) return;
  lastPlayed = now;
  try {
    if (player.currentTime > 0) await player.seekTo(0);
    player.play();
  } catch {
    // A missing chime never interrupts the lesson.
  }
}
