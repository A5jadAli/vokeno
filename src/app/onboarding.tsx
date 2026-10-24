import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ActionBar, PrimaryButton, TextButton } from '@/components/lesson-ui';
import { languageAudience } from '@/components/tab-header';
import { AppScreen } from '@/components/voka-ui';
import {
  FontSize,
  LineHeight,
  Palette,
  Radius,
  Selection,
  space,
  VokaFonts,
} from '@/constants/theme';
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
  // Nothing is pre-selected: English here starts at A2, so a beginner must not land in it by default.
  const [chosen, setChosen] = useState(false);

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
            title={chosen ? `Continue with ${languageDetails[track].name}` : 'Choose a language'}
            icon={chosen ? 'arrow-right' : undefined}
            disabled={!chosen}
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
            const selected = chosen && language === track;
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
                  onPress={() => {
                    choose(language);
                    setChosen(true);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    selected && { borderColor: Selection.border },
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
                    name={selected ? 'radiobox-marked' : 'radiobox-blank'}
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
        <Text style={styles.note}>No account needed. Explanations are in English.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space(4),
    paddingBottom: space(6),
    paddingHorizontal: space(5),
    paddingTop: space(3),
  },
  logo: { color: Palette.ink, fontFamily: VokaFonts.displayExtraBold, fontSize: FontSize.title },
  title: {
    color: Palette.ink,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
  },
  options: { gap: space(2) },
  option: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: 'transparent',
    borderRadius: Radius.xl,
    borderWidth: 2,
    flexDirection: 'row',
    gap: space(3),
    minHeight: 76,
    padding: space(4),
  },
  badge: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  badgeText: { fontFamily: VokaFonts.bodyBold, fontSize: FontSize.label },
  optionCopy: { flex: 1, gap: space(0.5) },
  optionTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  native: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium },
  optionMeta: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  promises: { gap: space(2), marginTop: space(1) },
  promise: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  promiseText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  note: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  pressed: { opacity: 0.7 },
});
