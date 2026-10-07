import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Eyebrow } from '@/components/voka-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import { speakingGoalCopy, useCoachingStore } from '@/features/coaching/store';
import { examMockUnitIds, getCurriculumUnits } from '@/features/curriculum/catalog';
import { useSelectedLanguage } from '@/features/language/selection';
import { languageDetails, trackColors } from '@/features/language/config';
import { formatTestDate, getTestDatePlan } from '@/features/profile/test-date';
import { FoundationPath } from '@/components/foundation-path';
import { LanguageSwitch } from '@/components/language-switch';

export default function SprintScreen() {
  const router = useRouter();
  const [track, setTrack] = useSelectedLanguage();
  const completedIds = useCoachingStore((state) => state.completedUnitIds);
  const goal = useCoachingStore((state) => state.preferences[track].goal);
  const testDate = useCoachingStore((state) => state.testDate);
  const testPlan = getTestDatePlan(testDate);
  const units = getCurriculumUnits(track);
  const accent = languageDetails[track].accent;

  return (
    <AppScreen activeNav="plan">
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Eyebrow>{languageDetails[track].name} learning path</Eyebrow>
          <Text style={styles.title}>Learn</Text>
        </View>
        <LanguageSwitch
          groupLabel="Learning path language"
          itemLabel={(name) => `${name} learning path`}
          onChange={setTrack}
          show="code"
          track={track}
        />
      </View>

      {testDate && testPlan ? (
        <Pressable
          accessibilityLabel={`Test-date practice plan for ${formatTestDate(testDate)}`}
          accessibilityRole="button"
          onPress={() => router.push('/test-date' as Href)}
          style={({ pressed }) => [styles.testPlanCard, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="calendar-clock" size={24} />
          <View style={styles.goalCopy}>
            <Eyebrow color={Palette.ink}>Practice suggestions · {formatTestDate(testDate)}</Eyebrow>
            <Text style={styles.testPlanTitle}>{testPlan.cadence}</Text>
            <Text style={styles.testPlanCopy}>{testPlan.recommendation}</Text>
          </View>
          <MaterialCommunityIcons color={Palette.ink} name="chevron-right" size={22} />
        </Pressable>
      ) : null}

      <FoundationPath track={track} />
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        Practice tools
      </Text>
      <View style={styles.tools}>
        {(
          [
            ['Review', 'Phrases due today', 'cards-outline', `/review?track=${track}`],
            [
              'Listening',
              track === 'ES' ? 'Everyday dialogues, A1' : 'Real dialogues, A1–B2',
              'headphones',
              `/listening?track=${track}`,
            ],
            [
              'Writing',
              'AI feedback, timed mode',
              'pencil-outline',
              `/activity/write?track=${track}`,
            ],
            ...(track === 'ES'
              ? []
              : ([
                  [
                    'Speaking mock',
                    track === 'EN' ? 'IELTS Parts 2 and 3' : 'Goethe B1 Sprechen',
                    'card-text-outline',
                    `/speaking-mock?track=${track}`,
                  ],
                ] as [string, string, IconName, string][])),
            ...(track === 'EN'
              ? [
                  ['Reading', 'Main idea, detail, T/F/NG', 'book-open-variant', '/reading'],
                  ['IELTS guide', 'All four papers', 'school-outline', '/exam-practice'],
                ]
              : track === 'DE'
                ? [['Vocabulary', 'Nouns with articles', 'cards-variant', '/vocabulary']]
                : []),
            ['Placement', 'Find your level', 'compass-outline', `/placement?track=${track}`],
            ...(track === 'ES'
              ? ([
                  [
                    'Spoken check',
                    'A short, non-certified estimate',
                    'account-voice',
                    '/level-check',
                  ],
                ] as [string, string, IconName, string][])
              : []),
          ] as [string, string, IconName, string][]
        ).map(([title, copy, icon, href]) => (
          <Pressable
            key={title}
            accessibilityRole="button"
            accessibilityLabel={`${title}: ${copy}`}
            onPress={() => router.push(href as Href)}
            style={({ pressed }) => [styles.tool, pressed && styles.pressed]}
          >
            <View style={[styles.toolIcon, { backgroundColor: accent }]}>
              <MaterialCommunityIcons color={trackColors[track].onAccent} name={icon} size={22} />
            </View>
            <Text style={styles.toolTitle}>{title}</Text>
            <Text style={styles.toolCopy}>{copy}</Text>
          </Pressable>
        ))}
      </View>

      <Text accessibilityRole="header" style={styles.sectionTitle}>
        Live speaking scenarios
      </Text>
      <Pressable
        accessibilityLabel="Change speaking style and goal"
        onPress={() => router.push(`/accent?track=${track}`)}
        style={({ pressed }) => [styles.goalCard, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons color={trackColors[track].onDark} name="target" size={23} />
        <View style={styles.goalCopy}>
          <Eyebrow color={trackColors[track].onDark}>
            Your goal · {speakingGoalCopy[goal].label}
          </Eyebrow>
          <Text style={styles.goalText}>{speakingGoalCopy[goal].description}</Text>
        </View>
        <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={22} />
      </Pressable>

      <View style={styles.path}>
        <View style={styles.pathLine} />
        {units.map((unit) => {
          const complete = completedIds.includes(unit.id);
          return (
            <Pressable
              accessibilityLabel={`Open ${unit.level} ${unit.title}`}
              accessibilityRole="button"
              key={unit.id}
              onPress={() =>
                router.push(
                  (examMockUnitIds.includes(unit.id)
                    ? `/speaking-mock?track=${track}`
                    : `/conversation?track=${track}&unit=${unit.id}`) as Href,
                )
              }
              style={({ pressed }) => [styles.unitCard, pressed && styles.pressed]}
            >
              <View style={[styles.level, { backgroundColor: complete ? accent : Palette.ink }]}>
                {complete ? (
                  <MaterialCommunityIcons
                    color={trackColors[track].onAccent}
                    name="check"
                    size={19}
                  />
                ) : (
                  <Text style={styles.levelText}>{unit.level}</Text>
                )}
              </View>
              <View style={styles.unitCopy}>
                <Eyebrow color={complete ? accent : Palette.muted}>
                  {complete ? 'Practised' : unit.context}
                </Eyebrow>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <Text style={styles.outcome}>{unit.outcome}</Text>
                <View style={styles.focusRow}>
                  <MaterialCommunityIcons color={accent} name="waveform" size={15} />
                  <Text style={styles.focus}>{unit.pronunciationFocus}</Text>
                </View>
              </View>
              <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={23} />
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.note}>
        CEFR labels describe scenario difficulty, not a completed level. These practice scenarios
        are not a complete CEFR course.
      </Text>
    </AppScreen>
  );
}

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const styles = StyleSheet.create({
  sectionTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: 22,
    marginBottom: 12,
    marginHorizontal: 18,
    marginTop: 28,
  },
  tools: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginHorizontal: 18 },
  tool: {
    backgroundColor: Palette.white,
    borderRadius: 20,
    flexBasis: '47%',
    flexGrow: 1,
    gap: 4,
    minHeight: 118,
    padding: 14,
  },
  toolIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginBottom: 6,
    width: 40,
  },
  toolTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 16 },
  toolCopy: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13, lineHeight: 18 },
  header: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, padding: 22, paddingTop: 14 },
  headerCopy: { flex: 1 },
  title: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: 28,
    lineHeight: 34,
    marginTop: 6,
  },
  goalCopy: { flex: 1 },
  goalText: {
    color: 'rgba(241,237,227,.65)',
    fontFamily: VokaFonts.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  testPlanCard: {
    alignItems: 'center',
    backgroundColor: Palette.orange,
    borderRadius: 22,
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 18,
    marginTop: 12,
    padding: 17,
  },
  testPlanTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: 18,
    marginTop: 4,
  },
  testPlanCopy: {
    color: 'rgba(19,18,17,.68)',
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  path: { gap: 12, marginTop: 22, paddingHorizontal: 18 },
  pathLine: {
    backgroundColor: Palette.line,
    bottom: 28,
    left: 46,
    position: 'absolute',
    top: 28,
    width: 2,
  },
  unitCard: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 13,
    minHeight: 132,
    padding: 15,
  },
  level: {
    alignItems: 'center',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  levelText: { color: Palette.cream, fontFamily: VokaFonts.bodySemiBold, fontSize: 12 },
  unitCopy: { flex: 1 },
  unitTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 18, marginTop: 4 },
  outcome: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  focusRow: { alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 7 },
  focus: {
    color: Palette.muted,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 18,
  },
  note: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: 12,
    lineHeight: 18,
    margin: 22,
    textAlign: 'center',
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  goalCard: {
    alignItems: 'center',
    backgroundColor: Palette.ink,
    borderRadius: 22,
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 18,
    padding: 17,
  },
});
