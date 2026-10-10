# Lesson audio (AI voices)

Every line the app speaks is a pre-recorded clip in a natural AI voice. Each character has their own voice, so a scene sounds like different people talking. The device voice is only a fallback, used offline before a clip has been downloaded, on the web build, and for a line that has no clip yet.

## How it works

- **Casting:** `src/features/audio/voices.ts` gives each track a narrator voice and a voice for every named character. It also holds a speaking direction per language, asking for native pronunciation at a learner-friendly pace. The tests fail if a scene gives two people the same voice, or if a character has no voice.
- **Clips:** each clip is named by a hash of the track, voice, direction and text (`clipKey` in `clips.ts`). Any change to the words or the voice produces a new clip. Old clips stay valid for older app versions.
- **Storage:** clips are stored as `<key>.mp3` in the public Supabase Storage bucket `lesson-audio`. `src/features/audio/clips.json` lists the clips that exist. The app plays only listed clips.
- **Playback:** `useLessonAudio(track)` replaces `useLessonSpeech` on every lesson screen.
  - A lesson's clips download into the cache folder in the background: the current step first, six at a time.
  - Ready players are kept for the current and next step, so a tap starts in about 0.2 s, like a downloaded voice note.
  - Today prefetches the upcoming lesson.
- **Speed:** recorded audio plays at its natural pace. "Slow" plays at 0.75× with the pitch kept.

## Adding or changing lines

1. Edit the lesson as usual.
2. Run `npm test`. `tests/audio.test.ts` lists every line that has no clip.
3. Record the missing clips:

   ```sh
   LESSON_AUDIO_TOKEN=… npx tsx --tsconfig tsconfig.json scripts/generate-lesson-audio.ts
   ```

   The script sends batches of up to 8 lines to the admin-only `lesson-audio` edge function. The function calls OpenAI `gpt-4o-mini-tts` and uploads the result. The script can be stopped and run again; it resumes where it left off.

4. Commit the updated `clips.json` with the lesson change.

`LESSON_AUDIO_TOKEN` is set as a Supabase function secret, and the function rejects any request without it. Never commit it. The edge function also needs the `OPENAI_API_KEY` secret.

## Gotchas

- Release builds don't print JS logs to logcat. To see which voice actually played, run `adb shell dumpsys audio`:
  - Vokeno's own players run under the app's uid with `CONTENT_TYPE_UNKNOWN`.
  - The device voice runs under the TTS engine's uid with `CONTENT_TYPE_SPEECH`.
- With expo-audio on Android, `player.playbackRate` is read-only, so assigning it throws. Use `player.setPlaybackRate(rate, 'high')`. Because any playback error falls back to the device voice without a message, a bug like this sounds like "the AI voices are missing".
