import type { AudioPlayer } from 'expo-audio';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { languageDetails, type LanguageTrack } from '@/features/language/config';
import { markVoice } from '@/features/feedback/sounds';
import { useLessonSpeech } from '@/features/listening/use-lesson-speech';
import { useCoachingStore } from '@/features/coaching/store';
import { castingFor } from './voices';

import * as clipCache from './clip-cache';
import { findClip, type Clip } from './clips';

type Phase = 'idle' | 'loading' | 'playing';

/** Recorded voices play at their natural pace; "slow" is three quarters, pitch kept. */
const clipRate = (rate: number) => (rate <= 0.7 ? 0.75 : rate < 0.85 ? 0.9 : 1);

// The cache needs the device file system; the web build keeps the device voice.
const clips = clipCache.clipsSupported ? clipCache : null;

/**
 * Lesson audio: recorded AI voices (a different voice per character) when a clip exists, the
 * device voice otherwise. Same shape as the device-voice hook, plus `prefetch`.
 */
export function useLessonAudio(track: LanguageTrack) {
  const reference = useCoachingStore((state) => state.preferences.EN.reference);
  const locale = track === 'EN' ? reference : languageDetails[track].speechLocale;
  const device = useLessonSpeech(locale);
  const { stop: stopDevice, playSequence: playDevice } = device;
  const focusedLocale = useRef<string | null>(null);
  const token = useRef(0);
  const current = useRef<{ player: AudioPlayer; done: () => void } | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [activeText, setActiveText] = useState('');
  const [activeRate, setActiveRate] = useState(0.9);

  const halt = useCallback(() => {
    const playing = current.current;
    current.current = null;
    if (playing) {
      playing.player.pause();
      playing.done();
    }
  }, []);

  const stop = useCallback(() => {
    token.current += 1;
    halt();
    setPhase('idle');
    stopDevice();
  }, [stopDevice, halt]);

  useFocusEffect(
    useCallback(() => {
      focusedLocale.current = locale;
      const subscription = AppState.addEventListener('change', (state) => {
        if (state !== 'active') stop();
      });
      return () => {
        focusedLocale.current = null;
        token.current += 1;
        halt();
        setPhase('idle');
        subscription.remove();
      };
    }, [halt, stop, locale]),
  );

  /** Plays one clip until the voice stops; false when it was stopped or failed. */
  const playClip = useCallback(async (clip: Clip, rate: number, generation: number) => {
    if (!clips) return false;
    const uri = await clips.ensureClip(clip);
    if (generation !== token.current) return false;
    const player = clips.playerFor(clip.key, uri);
    // The native property is read-only; the setter keeps the pitch at the slower rates.
    player.setPlaybackRate(clipRate(rate), 'high');
    // A fresh player is already at the start; seeking it first only waits for it to load.
    if (player.currentTime > 0) await player.seekTo(0);
    if (generation !== token.current) return false;
    return new Promise<boolean>((resolve) => {
      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        // The recordings end in silence: stop where the voice stops, not where the file does.
        // A little past it, so the last sound still in the speaker is not cut off.
        const spoken = clip.end > 0 && status.currentTime >= clip.end + 0.1;
        if (spoken) player.pause();
        if (spoken || status.didJustFinish) finish(true);
      });
      const finish = (completed: boolean) => {
        subscription.remove();
        if (current.current?.player === player) current.current = null;
        resolve(completed);
      };
      current.current = { player, done: () => finish(false) };
      setPhase('playing');
      player.play();
    });
  }, []);

  const playSequence = useCallback(
    async (
      lines: string[],
      rate = 0.82,
      onLine?: (index: number) => void,
      speakers?: (string | undefined)[],
    ) => {
      if (!lines.length || focusedLocale.current !== locale) return;
      const found = lines.map((text, index) => findClip(track, text, speakers?.[index], reference));
      const locales = lines.map((_, index) =>
        track === 'EN'
          ? speakers?.[index]
            ? (castingFor(track, speakers[index]).reference ?? 'en-GB')
            : reference
          : locale,
      );
      // Anything not recorded yet, or the web build: the device voice reads the whole sequence.
      halt();
      const generation = ++token.current;
      stopDevice();
      if (!clips || found.some((clip) => !clip)) {
        setPhase('idle');
        return playDevice(lines, rate, onLine, locales);
      }
      setActiveRate(rate);
      setActiveText(lines[0]);
      setPhase(clips.isClipOnDevice(found[0]!.key) ? 'playing' : 'loading');
      try {
        for (const [index, clip] of found.entries()) {
          if (generation !== token.current) return;
          setActiveText(lines[index]);
          onLine?.(index);
          const completed = await playClip(clip!, rate, generation);
          if (!completed) return;
        }
        if (generation === token.current) setPhase('idle');
      } catch {
        if (generation !== token.current) return;
        setPhase('idle');
        // Offline before the clip was saved: the device voice still reads it.
        void playDevice(lines, rate, onLine, locales);
      }
    },
    [stopDevice, playDevice, halt, playClip, track, reference, locale],
  );

  const play = useCallback(
    (text: string, rate?: number, speaker?: string) =>
      playSequence([text], rate, undefined, [speaker]),
    [playSequence],
  );

  /** Downloads a lesson's clips in the background so they start at once when tapped. */
  const prefetch = useCallback(
    (lines: { text: string; speaker?: string }[], ready = 8) => {
      if (!clips) return;
      const found = lines
        .map((line) => findClip(track, line.text, line.speaker, reference))
        .filter((clip): clip is Clip => Boolean(clip));
      void clips.warmClips(found, ready);
    },
    [track, reference],
  );

  const recorded = phase !== 'idle';
  const busy = recorded || device.busy;
  // The answer chime waits for silence: it never plays over a lesson voice.
  useEffect(() => {
    markVoice(token, busy);
    return () => markVoice(token, false);
  }, [busy]);
  return {
    play,
    playSequence,
    prefetch,
    stop,
    playing: recorded ? phase === 'playing' : device.playing,
    loading: recorded ? phase === 'loading' : device.loading,
    busy,
    activeText: recorded ? activeText : device.activeText,
    activeRate: recorded ? activeRate : device.activeRate,
    error: device.error,
  };
}

export type LessonAudio = ReturnType<typeof useLessonAudio>;

/** Downloads clips ahead of time, for example the next lesson's while Today is open. */
export function prefetchClips(track: LanguageTrack, lines: { text: string; speaker?: string }[]) {
  if (!clips) return;
  void clips.warmClips(
    lines
      .map((line) =>
        findClip(
          track,
          line.text,
          line.speaker,
          useCoachingStore.getState().preferences.EN.reference,
        ),
      )
      .filter((clip): clip is Clip => Boolean(clip)),
    0,
  );
}
