import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import { LessonAudioButton } from '@/components/lesson-audio-button';
import { FontSize, LineHeight, OnDark, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import { useSelectedLanguage } from '@/features/language/selection';
import { trackColors } from '@/features/language/config';
import { useLessonAudio } from '@/features/audio/use-lesson-audio';
import { LanguageSwitch } from '@/components/language-switch';
import { levelCheckSentences } from '@/features/audio/spoken-texts';

export default function LevelCheckScreen() {
  const router = useRouter();
  const [track, setTrack] = useSelectedLanguage();
  const check = levelCheckSentences[track];
  const speech = useLessonAudio(track);

  return (
    <AppScreen backgroundColor={Palette.ink} dark showNav={false}>
      <View style={styles.topRow}>
        <HeaderBack dark variant="close" />
        <Text style={styles.duration}>ABOUT 2 MINUTES</Text>
        <View style={styles.spacer} />
      </View>
      <View style={styles.body}>
        <Eyebrow color={trackColors[track].onDark}>Read out loud</Eyebrow>
        <LanguageSwitch
          groupLabel="Assessment language"
          onChange={setTrack}
          role="radio"
          tone="dark"
          track={track}
        />
        <Text style={styles.sentence}>{check.sentence}</Text>
        <View style={{ marginTop: space(5) }}>
          <LessonAudioButton
            speech={speech}
            text={check.sentence}
            rate={0.88}
            label="Hear the level check sentence"
            dark
          />
        </View>

        {/* No waveform here: a voice line only appears when someone is actually speaking. */}
        <View style={styles.spaceAbove} />
        <View style={styles.micArea}>
          <Pressable
            accessibilityLabel="Start spoken level check"
            onPress={() => router.push(`/conversation?track=${track}&practice=diagnostic`)}
            style={({ pressed }) => [
              styles.micHalo,
              { backgroundColor: OnDark.fillStrong },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.mic, { backgroundColor: Palette.lime }]}>
              <MaterialCommunityIcons color={Palette.ink} name="microphone" size={35} />
            </View>
          </Pressable>
          <Text style={styles.listenText}>Tap to start your spoken check</Text>
          <Text style={styles.privacy}>Microphone access is requested only after you tap.</Text>
          {track !== 'ES' ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/placement' as Href)}
              style={styles.placementLink}
            >
              <Text style={styles.placementText}>
                Prefer not to speak? Take the written and listening placement check
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    paddingHorizontal: space(4),
    paddingTop: space(3),
  },
  duration: {
    color: OnDark.textFaint,
    flex: 1,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    textAlign: 'center',
  },
  spacer: { width: 40 },
  body: { flex: 1, gap: space(3), paddingHorizontal: space(6), paddingTop: space(8) },
  spaceAbove: { flex: 1, minHeight: space(10) },
  micArea: { alignItems: 'center', paddingBottom: space(10) },
  micHalo: {
    alignItems: 'center',
    borderRadius: Radius.pill,
    height: 128,
    justifyContent: 'center',
    width: 128,
  },
  mic: {
    alignItems: 'center',
    backgroundColor: Palette.lime,
    borderRadius: Radius.pill,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  listenText: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
    marginTop: space(4),
  },
  privacy: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    marginTop: space(2),
  },
  placementLink: {
    backgroundColor: OnDark.fillStrong,
    borderRadius: Radius.md,
    justifyContent: 'center',
    marginTop: space(4),
    minHeight: 48,
    paddingHorizontal: space(4),
  },
  placementText: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
    textAlign: 'center',
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  sentence: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    marginTop: space(4),
  },
});
