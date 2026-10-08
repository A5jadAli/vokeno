import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ActionBar, PrimaryButton, TextButton } from '@/components/lesson-ui';
import { languageAudience } from '@/components/tab-header';
import { AppScreen } from '@/components/voka-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import { completeOnboarding } from '@/features/onboarding/storage';
import { useLanguageSelection } from '@/features/language/selection';
import { languageDetails, languageTracks, trackColors } from '@/features/language/config';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const promises: [IconName, string][] = [
  ['timer-outline', 'Short lessons: about 5 minutes a day'],
  ['account-voice', 'The language people really speak, not just textbook phrases'],
  ['microphone-outline', 'Speak with a live coach when you are ready'],
];

/** First run: one screen, one choice, then straight on to a first lesson. */
export default function OnboardingScreen() {
  const router = useRouter();
  const track = useLanguageSelection((state) => state.track);
  const choose = useLanguageSelection((state) => state.choose);

  const finish = async (destination: string) => {
    await completeOnboarding();
    router.replace(destination as Href);
  };

  return (
    <AppScreen
      showNav={false}
      footer={
        <ActionBar>
          <PrimaryButton
            title={`Continue with ${languageDetails[track].name}`}
            icon="arrow-right"
            onPress={() => void finish('/learning-plan')}
          />
          <TextButton
            title="I already have an account"
            onPress={() => void finish('/auth?mode=sign-in')}
          />
        </ActionBar>
      }
    >
      <View style={styles.body}>
        <Text style={styles.logo}>VOKENO</Text>
        <Animated.Text
          entering={FadeInDown.duration(260)}
          accessibilityRole="header"
          style={styles.title}
        >
          Which language do you want to learn?
        </Animated.Text>

        <View accessibilityRole="radiogroup" style={styles.options}>
          {languageTracks.map((language, index) => {
            const selected = language === track;
            const colors = trackColors[language];
            return (
              <Animated.View
                key={language}
                entering={FadeInDown.delay(80 + index * 60).duration(240)}
              >
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  aria-checked={selected}
                  accessibilityLabel={`${languageDetails[language].name}. ${languageAudience[language]}`}
                  onPress={() => choose(language)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && { borderColor: colors.accent },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.badgeText, { color: colors.onAccent }]}>{language}</Text>
                  </View>
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionTitle}>
                      {languageDetails[language].name}
                      <Text style={styles.native}> · {languageDetails[language].nativeName}</Text>
                    </Text>
                    <Text style={styles.optionMeta}>{languageAudience[language]}</Text>
                  </View>
                  <MaterialCommunityIcons
                    color={selected ? Palette.ink : Palette.muted}
                    name={selected ? 'check-circle' : 'circle-outline'}
                    size={24}
                  />
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.promises}>
          {promises.map(([icon, text]) => (
            <View key={text} style={styles.promise}>
              <MaterialCommunityIcons color={Palette.ink} name={icon} size={20} />
              <Text style={styles.promiseText}>{text}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>
          No account needed to start. Explanations are in English. Guest progress stays on this
          device; create an account later to keep it in sync.
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: { gap: 16, paddingBottom: 24, paddingHorizontal: 20, paddingTop: 12 },
  logo: { color: Palette.ink, fontFamily: VokaFonts.displayExtraBold, fontSize: 22 },
  title: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 28, lineHeight: 34 },
  options: { gap: 10 },
  option: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 12,
    minHeight: 76,
    padding: 14,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  badgeText: { fontFamily: VokaFonts.bodyBold, fontSize: 14 },
  optionCopy: { flex: 1, gap: 2 },
  optionTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 17 },
  native: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium },
  optionMeta: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  promises: { gap: 10, marginTop: 4 },
  promise: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  promiseText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 21,
  },
  note: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13, lineHeight: 19 },
  pressed: { opacity: 0.7 },
});
