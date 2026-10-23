import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LanguageSwitch } from '@/components/language-switch';
import { AppScreen, HeaderBack } from '@/components/voka-ui';
import {
  Feedback,
  FontSize,
  LineHeight,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import { languageDetails } from '@/features/language/config';
import { useSelectedLanguage } from '@/features/language/selection';

/**
 * What the coach remembers between unit calls: things the learner shared and the corrections
 * that keep coming up. The learner can remove any of it, or all of it, at any time.
 */
export default function CoachMemoryScreen() {
  const [track, setTrack] = useSelectedLanguage();
  const memory = useCoachingStore((state) => state.coachMemory[track]);
  const forgetFact = useCoachingStore((state) => state.forgetCoachFact);
  const forgetMistake = useCoachingStore((state) => state.forgetCoachMistake);
  const clearMemory = useCoachingStore((state) => state.clearCoachMemory);
  const [confirming, setConfirming] = useState(false);
  const facts = memory?.facts ?? [];
  const mistakes = memory?.mistakes ?? [];
  const language = languageDetails[track].name;

  return (
    <AppScreen showNav={false}>
      <View style={styles.header}>
        <HeaderBack />
        <Text style={styles.headerTitle}>Coach memory</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.body}>
        <Text accessibilityRole="header" style={styles.title}>
          What your coach remembers
        </Text>
        <Text style={styles.description}>
          After each unit call, your coach keeps a few things you shared and the corrections that
          come up again, so the next call can follow up. It stays on this phone and is only sent to
          the coach during your calls.
        </Text>
        <LanguageSwitch groupLabel="Memory for" onChange={setTrack} role="radio" track={track} />

        <Text style={styles.section}>Things you shared</Text>
        <View style={styles.card}>
          {facts.length ? (
            facts.map((fact) => (
              <View key={fact} style={styles.row}>
                <Text style={styles.rowText}>{fact}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Forget: ${fact}`}
                  hitSlop={8}
                  onPress={() => forgetFact(track, fact)}
                  style={styles.remove}
                >
                  <MaterialCommunityIcons name="close" size={18} color={Palette.secondary} />
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>
              Nothing yet. After a {language} unit call, what you mention appears here.
            </Text>
          )}
        </View>

        <Text style={styles.section}>Corrections that come up again</Text>
        <View style={styles.card}>
          {mistakes.length ? (
            mistakes.map((item) => (
              <View key={item.better} style={styles.row}>
                <View style={{ flex: 1, gap: space(0.5) }}>
                  <Text style={styles.rowText}>{item.better}</Text>
                  <Text style={styles.rowMeta}>
                    You said “{item.said}”{item.count > 1 ? ` · ${item.count} times` : ''}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Forget correction: ${item.better}`}
                  hitSlop={8}
                  onPress={() => forgetMistake(track, item.better)}
                  style={styles.remove}
                >
                  <MaterialCommunityIcons name="close" size={18} color={Palette.secondary} />
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>
              No repeated corrections. Your coach brings these back gently.
            </Text>
          )}
        </View>

        {facts.length || mistakes.length ? (
          confirming ? (
            <View style={styles.confirm}>
              <Text style={styles.rowText}>
                Clear everything your coach remembers in {language}?
              </Text>
              <View style={styles.confirmRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setConfirming(false)}
                  style={[styles.button, styles.secondary]}
                >
                  <Text style={styles.buttonText}>Keep it</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    clearMemory(track);
                    setConfirming(false);
                  }}
                  style={[styles.button, styles.danger]}
                >
                  <Text style={[styles.buttonText, { color: Palette.white }]}>Clear</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable accessibilityRole="button" onPress={() => setConfirming(true)}>
              <Text style={styles.clear}>Clear everything</Text>
            </Pressable>
          )
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: space(4),
  },
  headerTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  headerSpacer: { width: 40 },
  body: { gap: space(3), paddingBottom: space(8), paddingHorizontal: space(5) },
  title: {
    color: Palette.ink,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
  },
  description: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  section: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    marginTop: space(2),
  },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: space(2),
    minHeight: 56,
    paddingHorizontal: space(4),
    paddingVertical: space(2),
  },
  rowText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
  },
  rowMeta: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: FontSize.label },
  remove: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  empty: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    padding: space(4),
  },
  clear: {
    color: Feedback.wrongFill,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    paddingVertical: space(4),
    textAlign: 'center',
  },
  confirm: {
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    gap: space(3),
    padding: space(4),
  },
  confirmRow: { flexDirection: 'row', gap: space(2) },
  button: {
    alignItems: 'center',
    borderRadius: Radius.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  secondary: { backgroundColor: Palette.soft },
  danger: { backgroundColor: Feedback.wrongFill },
  buttonText: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
});
