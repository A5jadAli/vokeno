import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Feedback, Palette, VokaFonts, withAlpha } from '@/constants/theme';
import type { GoalPlan, GoalStatus } from '@/features/coaching/goal-plan';
import { levelLabel } from '@/features/foundations/level-status';
import { parseDateOnly } from '@/features/profile/test-date';
import { languageDetails, trackColors, type LanguageTrack } from '@/features/language/config';

const statusStyle: Record<GoalStatus, { label: string; bg: string; ink: string }> = {
  'on-track': { label: 'On track', bg: Feedback.correctBg, ink: Feedback.correctInk },
  behind: { label: 'Behind', bg: Feedback.behindBg, ink: Feedback.behindInk },
  tight: { label: 'Very tight', bg: Feedback.wrongBg, ink: Feedback.wrongInk },
  ready: { label: 'Level done', bg: Feedback.correctBg, ink: Feedback.correctInk },
  today: { label: 'Exam day', bg: Feedback.correctBg, ink: Feedback.correctInk },
  passed: { label: 'Date passed', bg: Palette.neutralChip, ink: Palette.ink },
};

const shortDate = (value: string) => {
  const date = parseDateOnly(value);
  return date
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date)
    : value;
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

/** One line under the headline: where the learner is in the plan. */
function progressLine(goal: GoalPlan) {
  const time =
    goal.week !== null
      ? `Week ${goal.week} of ${goal.weeks}`
      : `${plural(goal.weeksLeft, 'week')} to go`;
  const left =
    goal.unitsLeft < goal.lessonsLeft
      ? plural(goal.unitsLeft, 'unit')
      : plural(goal.lessonsLeft, 'lesson');
  return `${time} · ${left} left`;
}

/** What to do about it, in one short sentence. */
function advice(goal: GoalPlan, level: string) {
  switch (goal.status) {
    case 'on-track':
      return goal.lessonsToday > 1
        ? `${goal.lessonsToday} lessons a day keeps you on time.`
        : 'One lesson a day gets you there.';
    case 'behind':
      return goal.lessonsToday > 1
        ? `Today has ${goal.lessonsToday} lessons to help you catch up.`
        : 'Practise on more days this week to catch up.';
    case 'tight':
      return 'More than 2 lessons a day. A later date is kinder.';
    case 'ready':
      return `All ${level} lessons done. Keep reviewing until the day.`;
    case 'today':
      return 'Good luck. A short warm-up is enough today.';
    case 'passed':
      return 'Set your next date to keep a plan.';
  }
}

/** "German A1 by 15 Dec": the learner's goal, their pace this week and whether it is enough. */
export function GoalCard({ goal, track }: { goal: GoalPlan; track: LanguageTrack }) {
  const router = useRouter();
  const colors = trackColors[track];
  const status = statusStyle[goal.status];
  const level = levelLabel(track, goal.level);
  const headline = `${languageDetails[track].name} ${level} by ${shortDate(goal.date)}`;
  const showWeek = goal.perWeek > 0 && goal.daysLeft > 0;
  const share = showWeek ? Math.min(1, goal.doneThisWeek / goal.perWeek) : 1;
  // In the last six weeks before an A1 exam, offer the speaking test in its exam format.
  const examPractice =
    goal.level === 'A1' &&
    (track === 'DE' || track === 'ES') &&
    goal.daysLeft > 0 &&
    goal.daysLeft <= 42;
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${headline}. ${status.label}. ${progressLine(goal)}. Change goal`}
        onPress={() => router.push('/test-date' as Href)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <View style={styles.top}>
          <View style={[styles.icon, { backgroundColor: colors.tint }]}>
            <MaterialCommunityIcons color={Palette.ink} name="flag-checkered" size={20} />
          </View>
          <View style={styles.copy}>
            <Text numberOfLines={2} style={styles.headline}>
              {headline}
            </Text>
            <Text style={styles.meta}>{progressLine(goal)}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: status.bg }]}>
            <Text style={[styles.pillText, { color: status.ink }]}>{status.label}</Text>
          </View>
        </View>
        {showWeek ? (
          <View style={styles.week}>
            <View style={styles.weekTop}>
              <Text style={styles.weekLabel}>This week</Text>
              <Text style={styles.weekCount}>
                {Math.min(goal.doneThisWeek, goal.perWeek)} of {plural(goal.perWeek, 'lesson')}
              </Text>
            </View>
            <View style={styles.track}>
              <View
                style={[styles.fill, { backgroundColor: colors.accent, width: `${share * 100}%` }]}
              />
            </View>
          </View>
        ) : null}
        <Text style={styles.advice}>{advice(goal, level)}</Text>
      </Pressable>
      {examPractice ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Practise the ${track === 'DE' ? 'Goethe A1' : 'DELE A1'} speaking test`}
          onPress={() => router.push(`/speaking-mock?track=${track}&level=A1` as Href)}
          style={({ pressed }) => [
            styles.exam,
            { backgroundColor: colors.tint },
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="microphone-outline" size={20} />
          <View style={styles.copy}>
            <Text style={styles.examTitle}>
              Practise the {track === 'DE' ? 'Goethe A1' : 'DELE A1'} speaking test
            </Text>
            <Text style={styles.meta}>
              Exam-style cards with your coach. Practice, not a score.
            </Text>
          </View>
          <MaterialCommunityIcons color={Palette.secondary} name="chevron-right" size={20} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** A quiet offer to set a goal date, for learners who have none yet. */
export function GoalPrompt() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/test-date' as Href)}
      style={({ pressed }) => [styles.prompt, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons color={Palette.ink} name="flag-checkered" size={22} />
      <View style={styles.copy}>
        <Text style={styles.promptTitle}>Have an exam or move date?</Text>
        <Text style={styles.meta}>Set it and get a weekly plan to be ready.</Text>
      </View>
      <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
    marginHorizontal: 18,
    padding: 16,
  },
  main: { gap: 12 },
  exam: { alignItems: 'center', borderRadius: 14, flexDirection: 'row', gap: 10, padding: 12 },
  examTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 14 },
  top: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  icon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  copy: { flex: 1, gap: 2 },
  headline: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 15 },
  meta: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13 },
  pill: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
  pillText: { fontFamily: VokaFonts.bodyBold, fontSize: 12 },
  week: { gap: 6 },
  weekTop: { flexDirection: 'row', justifyContent: 'space-between' },
  weekLabel: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  weekCount: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  track: {
    backgroundColor: withAlpha(Palette.ink, 0.08),
    borderRadius: 99,
    height: 8,
    overflow: 'hidden',
  },
  fill: { borderRadius: 99, height: 8 },
  advice: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13, lineHeight: 18 },
  prompt: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: Palette.line,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 60,
    padding: 12,
  },
  promptTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 15 },
  pressed: { opacity: 0.7 },
});
