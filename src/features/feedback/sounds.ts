import AsyncStorage from '@react-native-async-storage/async-storage';
import { type AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
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
 * A 180 ms chime for a right answer. Silent when the phone is on silent or vibrate, when the
 * learner turned answer sounds off, while a lesson voice is speaking, and when two parts of a
 * screen report the same answer within a moment of each other.
 */
export async function playAnswerSound() {
  const now = Date.now();
  if (!player || !useSoundSettings.getState().answerSounds || voices.size) return;
  if (now - lastPlayed < 400) return;
  lastPlayed = now;
  try {
    // Android checks the ringer when play() is called. Only for that moment, silent mode is
    // respected and other audio (the learner's music) is mixed with, not paused. Then the default
    // mode comes back (the app sets no other), so lesson audio behaves exactly as before.
    await setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' });
    if (player.currentTime > 0) await player.seekTo(0);
    player.play();
  } catch {
    // A missing chime never interrupts the lesson.
  } finally {
    await setAudioModeAsync({}).catch(() => undefined);
  }
}
