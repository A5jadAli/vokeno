import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryAccent, PrimaryButton } from '@/components/lesson-ui';
import { ReminderPicker } from '@/components/reminder-picker';
import { StreakStrip } from '@/components/streak-strip';
import { Eyebrow } from '@/components/voka-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import type { PlanStep } from '@/features/coaching/daily-plan';
import { getTrackLessons } from '@/features/foundations/catalog';
import { remindersSupported } from '@/features/habits/reminder-scheduler';
import { useReminderStore } from '@/features/habits/reminders';
import { useHabits } from '@/features/habits/use-habits';
import { languageDetails, trackColors, type LanguageTrack } from '@/features/language/config';
import { levelLabel, levelNote } from '@/features/foundations/level-status';

/** Home's "Today" card: one to three small steps, then the streak for this week. */
export function LearningRecommendation({ track }: { track: LanguageTrack }) {
  const router = useRouter();
  const { plan, streak, week, milestone } = useHabits(track);
  const colors = trackColors[track];
  const next = plan.steps.find((step) => !step.done) ?? plan.bonus;
  const allDone = plan.doneCount === plan.steps.length;
  const reminderAsked = useReminderStore((state) => state.asked);
  const open = (step: PlanStep) => router.push(step.href as Href);
  const nextLevelStart = milestone?.nextLevel
    ? getTrackLessons(track).find((lesson) => lesson.level === milestone.nextLevel)
    : undefined;
  return (
    <>
      {milestone ? (
        <View style={[styles.milestone, { backgroundColor: colors.tint }]}>
          <View style={[styles.trophy, { backgroundColor: colors.accent }]}>
            <MaterialCommunityIcons color={colors.onAccent} name="trophy-outline" size={26} />
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            {languageDetails[track].name} {levelLabel(track, milestone.level)} done
          </Text>
          <Text style={styles.footnote}>You can now:</Text>
          {milestone.canDo.map((item) => (
            <View key={item} style={styles.canDo}>
              <MaterialCommunityIcons color={Palette.ink} name="check" size={18} />
              <Text style={styles.canDoText}>{item}</Text>
            </View>
          ))}
          {levelNote(track, milestone.level) ? (
            <Text style={styles.footnote}>{levelNote(track, milestone.level)}</Text>
          ) : null}
          {nextLevelStart ? (
            <PrimaryAccent colors={colors}>
              <PrimaryButton
                title={`Start ${milestone.nextLevel}`}
                icon="arrow-right"
                accessibilityLabel={`Start ${milestone.nextLevel}: ${nextLevelStart.title}`}
                onPress={() => router.push(`/foundation/${nextLevelStart.id}` as Href)}
              />
            </PrimaryAccent>
          ) : null}
        </View>
      ) : null}
      <View style={styles.card}>
        <View style={styles.header}>
          <Eyebrow>{allDone ? 'Today · done' : `Today · about ${plan.minutes} min`}</Eyebrow>
          {plan.steps.length > 1 ? (
            <Text style={styles.count}>
              {plan.doneCount} of {plan.steps.length}
            </Text>
          ) : null}
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          {allDone
            ? 'Today’s plan is done'
            : plan.steps.length === 1
              ? 'One small step'
              : `${plan.steps.length} small steps`}
        </Text>
        <View style={styles.steps}>
          {plan.steps.map((step, index) => (
            <Pressable
              key={step.kind}
              accessibilityRole="button"
              accessibilityLabel={`${step.done ? 'Done' : `Step ${index + 1}`}: ${step.title}`}
              accessibilityState={{ checked: step.done }}
              onPress={() => open(step)}
              style={({ pressed }) => [styles.step, pressed && styles.pressed]}
            >
              <View
                style={[
                  styles.marker,
                  step.done && { backgroundColor: colors.accent, borderColor: colors.accent },
                ]}
              >
                {step.done ? (
                  <MaterialCommunityIcons color={colors.onAccent} name="check" size={16} />
                ) : (
                  <Text style={styles.markerText}>{index + 1}</Text>
                )}
              </View>
              <View style={styles.stepCopy}>
                <Text style={[styles.stepTitle, step.done && styles.stepTitleDone]}>
                  {step.title}
                </Text>
                <Text style={styles.stepWhy}>{step.why}</Text>
              </View>
              <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
            </Pressable>
          ))}
        </View>
        {next ? (
          <PrimaryAccent colors={colors}>
            <PrimaryButton
              title={allDone ? 'One more, if you like' : next.action}
              icon="arrow-right"
              accessibilityLabel={`${allDone ? 'Optional extra' : next.action}: ${next.title}`}
              onPress={() => open(next)}
            />
          </PrimaryAccent>
        ) : null}
        {allDone && !reminderAsked && remindersSupported ? (
          <View style={styles.intention}>
            <Text style={styles.intentionTitle}>When will you practise tomorrow?</Text>
            <Text style={styles.footnote}>
              Picking a time makes it much easier to come back. One reminder a day, and you can
              change it in Settings.
            </Text>
            <ReminderPicker variant="chips" />
          </View>
        ) : null}
        <Text style={styles.footnote}>
          {plan.footnote} {plan.position.finishedLessons} of {plan.position.totalLessons} guided
          lessons done.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change my starting point and goal"
          onPress={() => router.push('/learning-plan' as Href)}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="tune-variant" size={19} color={Palette.secondary} />
          <Text style={styles.secondaryText}>Starting point & goal</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Palette.secondary} />
        </Pressable>
      </View>
      <StreakStrip streak={streak} track={track} week={week} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    margin: 18,
    marginBottom: 12,
    padding: 18,
  },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  count: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  title: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 22, lineHeight: 28 },
  steps: { gap: 2 },
  step: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
    paddingVertical: 8,
  },
  marker: {
    alignItems: 'center',
    borderColor: Palette.line,
    borderRadius: 99,
    borderWidth: 1.5,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  markerText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  stepCopy: { flex: 1, gap: 2 },
  stepTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 16 },
  stepTitleDone: { color: Palette.secondary },
  stepWhy: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13, lineHeight: 18 },
  footnote: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 12, lineHeight: 18 },
  secondary: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 44,
  },
  secondaryText: {
    color: Palette.secondary,
    flex: 1,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: 14,
  },
  milestone: { borderRadius: 22, gap: 8, marginHorizontal: 18, marginTop: 18, padding: 18 },
  trophy: {
    alignItems: 'center',
    borderRadius: 99,
    height: 48,
    justifyContent: 'center',
    marginBottom: 4,
    width: 48,
  },
  canDo: { alignItems: 'flex-start', flexDirection: 'row', gap: 8 },
  canDoText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  intention: { borderColor: Palette.line, borderRadius: 16, borderWidth: 1, gap: 8, padding: 14 },
  intentionTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 16 },
  pressed: { opacity: 0.7 },
});
