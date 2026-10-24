import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import {
  FontSize,
  LineHeight,
  OnDark,
  Palette,
  Radius,
  Selection,
  space,
  VokaFonts,
} from '@/constants/theme';
import { speakingGoalCopy, type SpeakingGoal, useCoachingStore } from '@/features/coaching/store';
import { useSelectedLanguage } from '@/features/language/selection';
import { trackColors } from '@/features/language/config';
import { LanguageSwitch } from '@/components/language-switch';

const goals = Object.keys(speakingGoalCopy) as SpeakingGoal[];

export default function AccentScreen() {
  const router = useRouter();
  const [track, setTrack] = useSelectedLanguage();
  const preferences = useCoachingStore((state) => state.preferences);
  const hasHydrated = useCoachingStore((state) => state.hasHydrated);
  const setGoal = useCoachingStore((state) => state.setGoal);

  if (!hasHydrated) {
    return (
      <AppScreen>
        <View style={styles.header}>
          <HeaderBack />
          <Eyebrow>Speaking profile</Eyebrow>
        </View>
        <Text accessibilityLiveRegion="polite" style={styles.loading}>
          Loading speaking profile…
        </Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <HeaderBack />
        <Eyebrow>Speaking profile</Eyebrow>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Sound clear, natural and like yourself.</Text>
        <Text style={styles.intro}>
          Choose what you need. The goal is being understood, not losing your accent.
        </Text>

        <LanguageSwitch
          groupLabel="Speaking profile language"
          itemLabel={(name) => `${name} speaking profile`}
          onChange={setTrack}
          track={track}
        />

        <View style={styles.referenceCard}>
          <MaterialCommunityIcons color={trackColors[track].onDark} name="waveform" size={25} />
          <View style={styles.referenceCopy}>
            <Text style={styles.referenceTitle}>
              {track === 'EN'
                ? 'Contemporary British reference'
                : track === 'DE'
                  ? 'Standard German reference'
                  : 'Everyday Mexican Spanish reference'}
            </Text>
            <Text style={styles.referenceText}>
              {track === 'EN'
                ? 'Widely understood modern British speech, including connected speech and current phrases, never a named person’s voice.'
                : track === 'DE'
                  ? 'Widely understood German from Germany, while recognising natural reductions and regional variation.'
                  : 'Clear everyday speech from Mexico, with notes about other common Spanish varieties. Your own accent is welcome.'}
            </Text>
          </View>
        </View>

        <Eyebrow>What are you preparing for?</Eyebrow>
        <View style={styles.goalList}>
          {goals.map((goal) => {
            const selected = preferences[track].goal === goal;
            return (
              <Pressable
                aria-checked={selected}
                accessibilityLabel={`${speakingGoalCopy[goal].label} speaking goal`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={goal}
                onPress={() => setGoal(track, goal)}
                style={[
                  styles.goalCard,
                  selected && { borderColor: Selection.border, borderWidth: 2 },
                ]}
              >
                <View style={styles.goalCopy}>
                  <Text style={styles.goalTitle}>{speakingGoalCopy[goal].label}</Text>
                  <Text style={styles.goalDescription}>{speakingGoalCopy[goal].description}</Text>
                </View>
                <MaterialCommunityIcons
                  color={selected ? Selection.border : Palette.muted}
                  name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                  size={24}
                />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityLabel="Start speaking diagnostic"
          accessibilityRole="button"
          onPress={() => router.push(`/conversation?track=${track}&practice=diagnostic`)}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: Palette.ink },
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons color={Palette.lime} name="account-voice" size={21} />
          <Text style={[styles.primaryText, { color: Palette.cream }]}>
            Try a short speaking check
          </Text>
        </Pressable>
        <Text style={styles.disclaimer}>
          Feedback is qualitative and adaptive. It is not a certified language assessment.
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(4),
    paddingHorizontal: space(4),
    paddingTop: space(2),
  },
  body: { padding: space(6), paddingTop: space(5) },
  title: {
    color: Palette.ink,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
  },
  intro: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(2),
  },
  referenceCopy: { flex: 1 },
  referenceTitle: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  referenceText: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(1),
  },
  goalList: { gap: space(2), marginTop: space(3) },
  goalCard: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: space(3),
    minHeight: 78,
    padding: space(4),
  },
  goalCopy: { flex: 1 },
  goalTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.label },
  goalDescription: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(1),
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(2),
    justifyContent: 'center',
    marginTop: space(6),
    minHeight: 56,
  },
  primaryText: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  disclaimer: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(2),
    textAlign: 'center',
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  loading: {
    color: Palette.muted,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    padding: space(6),
  },
  referenceCard: {
    backgroundColor: Palette.ink,
    borderRadius: Radius.xl,
    marginTop: space(4),
    flexDirection: 'row',
    gap: space(3),
    marginBottom: space(6),
    padding: space(4),
  },
});
