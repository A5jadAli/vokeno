import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import { ReportContent } from '@/components/report-content';
import {
  Dark,
  FontSize,
  LineHeight,
  OnDark,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
import { useAssessmentStore } from '@/features/assessment/store';
import { useSelectedLanguage } from '@/features/language/selection';
import { languageDetails, trackColors } from '@/features/language/config';

export default function AssessmentResultScreen() {
  const router = useRouter();
  const [track] = useSelectedLanguage();
  const assessment = useAssessmentStore((state) => state.assessments[track]);
  const hasHydrated = useAssessmentStore((state) => state.hasHydrated);
  const colors = trackColors[track];

  return (
    <AppScreen backgroundColor={Palette.ink} dark showNav={false}>
      <View style={styles.header}>
        <HeaderBack dark />
        <Eyebrow color={OnDark.textFaint}>Assessment results</Eyebrow>
        <View style={styles.spacer} />
      </View>
      <View style={styles.body}>
        {!hasHydrated ? (
          <>
            <Eyebrow color={colors.onDark}>Loading result</Eyebrow>
            <Text style={styles.title}>Checking your saved assessment…</Text>
          </>
        ) : assessment ? (
          <>
            <View style={[styles.levelCircle, { backgroundColor: colors.accent }]}>
              <Text style={[styles.level, { color: colors.onAccent }]}>
                {assessment.estimatedLevel}
              </Text>
            </View>
            <Eyebrow color={trackColors[track].onDark}>
              {languageDetails[track].name} · {assessment.confidence} confidence
            </Eyebrow>
            <Text style={styles.title}>Your current spoken range</Text>
            <Text style={styles.copy}>{assessment.summary}</Text>
            <ReportContent dark surface="assessment" track={track} excerpt={assessment.summary} />
            <ResultList
              icon="check-circle-outline"
              items={assessment.strengths}
              color={colors.onDark}
              title="Strengths"
            />
            <ResultList
              icon="arrow-up-circle-outline"
              items={assessment.priorities}
              color={colors.onDark}
              title="Next priorities"
            />
            <Text style={styles.disclaimer}>
              Estimated from {assessment.evidenceTurnCount} transcribed responses. This is not a
              certified CEFR result and does not score pronunciation.
            </Text>
          </>
        ) : (
          <>
            <View style={[styles.icon, { backgroundColor: colors.accent }]}>
              <MaterialCommunityIcons color={colors.onAccent} name="account-voice" size={38} />
            </View>
            <Eyebrow color={trackColors[track].onDark}>No result yet</Eyebrow>
            <Text style={styles.title}>Complete a real conversation first.</Text>
            <Text style={styles.copy}>
              A level appears once there is enough evidence. No made-up scores.
            </Text>
          </>
        )}
        {hasHydrated ? (
          <Pressable
            accessibilityLabel={
              assessment ? 'Retake spoken level check' : 'Start spoken level check'
            }
            accessibilityRole="button"
            onPress={() => router.replace('/level-check')}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: Palette.lime },
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons color={Palette.ink} name="microphone" size={21} />
            <Text style={[styles.buttonText, { color: Palette.ink }]}>
              {assessment ? 'Retake check' : 'Start spoken check'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </AppScreen>
  );
}

function ResultList({
  icon,
  items,
  title,
  color,
}: {
  color: string;
  icon: 'arrow-up-circle-outline' | 'check-circle-outline';
  items: string[];
  title: string;
}) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item} style={styles.resultRow}>
          <MaterialCommunityIcons color={color} name={icon} size={18} />
          <Text style={styles.resultText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    paddingHorizontal: space(4),
    paddingTop: space(3),
  },
  spacer: { width: 40 },
  body: { flex: 1, padding: space(6), paddingTop: space(10) },
  icon: {
    alignItems: 'center',
    backgroundColor: Palette.cream,
    borderRadius: Radius.xl,
    height: 72,
    justifyContent: 'center',
    marginBottom: space(6),
    width: 72,
  },
  levelCircle: {
    alignItems: 'center',
    backgroundColor: Palette.cream,
    borderRadius: Radius.pill,
    height: 82,
    justifyContent: 'center',
    marginBottom: space(5),
    width: 82,
  },
  level: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.display },
  title: {
    color: Palette.cream,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    marginTop: space(2),
  },
  copy: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(3),
  },
  resultCard: {
    backgroundColor: Dark.raised,
    borderRadius: Radius.xl,
    gap: space(2),
    marginTop: space(4),
    padding: space(4),
  },
  resultTitle: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  resultRow: { alignItems: 'flex-start', flexDirection: 'row', gap: space(2) },
  resultText: {
    color: OnDark.textSecondary,
    flex: 1,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  disclaimer: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(4),
  },
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Palette.lime,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: space(2),
    marginTop: space(6),
    paddingHorizontal: space(5),
    paddingVertical: space(4),
  },
  buttonText: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.label },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
