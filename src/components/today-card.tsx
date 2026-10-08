import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { PrimaryAccent, PrimaryButton } from '@/components/lesson-ui';
import { ProgressFill } from '@/components/motion';
import { ReminderPicker } from '@/components/reminder-picker';
import { StreakStrip } from '@/components/streak-strip';
import { Palette, VokaFonts } from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import type { PlanStep } from '@/features/coaching/daily-plan';
import { getTrackLessons } from '@/features/foundations/catalog';
import { levelLabel, levelNote } from '@/features/foundations/level-status';
import { remindersSupported } from '@/features/habits/reminder-scheduler';
import { useReminderStore } from '@/features/habits/reminders';
import { useHabits } from '@/features/habits/use-habits';
import { lessonContext } from '@/features/journey/course';
import { languageDetails, trackColors, type LanguageTrack } from '@/features/language/config';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const kindIcon: Record<PlanStep['kind'], IconName> = {
  lesson: 'book-open-page-variant-outline',
  review: 'cards-outline',
  listening: 'headphones',
  speaking: 'microphone-outline',
};

const kindLabel: Record<PlanStep['kind'], string> = {
  lesson: 'Lesson',
  review: 'Review',
  listening: 'Listening',
  speaking: 'Speaking',
};

/** Today: the one thing to do now, the short session around it, and an honest finish. */
export function TodayCard({ track }: { track: LanguageTrack }) {
  const router = useRouter();
  const { plan, streak, week, milestone } = useHabits(track);
  const progress = useCoachingStore((state) => state.foundations);
  const reminderAsked = useReminderStore((state) => state.asked);
  const colors = trackColors[track];
  const current = plan.steps.find((step) => !step.done);
  const allDone = !current;
  const open = (step: PlanStep) => router.push(step.href as Href);
  const nextLevelStart = milestone?.nextLevel
    ? getTrackLessons(track).find((lesson) => lesson.level === milestone.nextLevel)
    : undefined;

  return (
    <PrimaryAccent colors={colors}>
      {milestone ? (
        <Animated.View
          entering={FadeInDown.duration(260)}
          style={[styles.milestone, { backgroundColor: colors.tint }]}
        >
          <View style={[styles.trophy, { backgroundColor: colors.accent }]}>
            <MaterialCommunityIcons color={colors.onAccent} name="trophy-outline" size={26} />
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            {languageDetails[track].name} {levelLabel(track, milestone.level)} finished
          </Text>
          <Text style={styles.note}>You practised:</Text>
          {milestone.canDo.map((item) => (
            <View key={item} style={styles.canDo}>
              <MaterialCommunityIcons color={Palette.ink} name="check" size={18} />
              <Text style={styles.canDoText}>{item}</Text>
            </View>
          ))}
          {levelNote(track, milestone.level) ? (
            <Text style={styles.note}>{levelNote(track, milestone.level)}</Text>
          ) : null}
          {nextLevelStart ? (
            <PrimaryButton
              title={`Start ${milestone.nextLevel}`}
              icon="arrow-right"
              accessibilityLabel={`Start ${milestone.nextLevel}: ${nextLevelStart.title}`}
              onPress={() => router.push(`/foundation/${nextLevelStart.id}` as Href)}
            />
          ) : null}
        </Animated.View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.eyebrow}>
            {allDone ? 'Your session · done' : `Your session · about ${plan.minutes} min`}
          </Text>
          {plan.steps.length > 1 ? (
            <Text style={styles.count}>
              {plan.doneCount} of {plan.steps.length} done
            </Text>
          ) : null}
        </View>

        {current ? (
          <Focus step={current} track={track} progress={progress} onOpen={() => open(current)} />
        ) : (
          <Animated.View entering={FadeIn.duration(240)} style={styles.done}>
            <Animated.View
              entering={ZoomIn.springify().damping(12)}
              style={[styles.doneBadge, { backgroundColor: colors.accent }]}
            >
              <MaterialCommunityIcons color={colors.onAccent} name="check-bold" size={30} />
            </Animated.View>
            <Text accessibilityRole="header" style={styles.title}>
              Today’s session is done
            </Text>
            <Text style={styles.lead}>
              {plan.courseFinished
                ? `You have finished every ${languageDetails[track].name} lesson available so far. Keep it fresh with review and practice.`
                : 'That is all you need today. Come back tomorrow, or do one more if you like.'}
            </Text>
          </Animated.View>
        )}

        {plan.steps.length > 1 || allDone ? (
          <View style={styles.list}>
            {plan.steps.map((step) => (
              <StepRow
                key={step.key}
                step={step}
                current={step === current}
                accent={colors.accent}
                onAccent={colors.onAccent}
                onPress={() => open(step)}
              />
            ))}
          </View>
        ) : null}

        {allDone && plan.bonus ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Optional: ${plan.bonus.title}`}
            onPress={() => open(plan.bonus!)}
            style={({ pressed }) => [styles.extra, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons color={Palette.ink} name="plus-circle-outline" size={22} />
            <View style={styles.extraCopy}>
              <Text style={styles.extraLabel}>
                One more, if you like · {plan.bonus.minutes} min
              </Text>
              <Text style={styles.extraTitle}>{plan.bonus.title}</Text>
            </View>
            <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={22} />
          </Pressable>
        ) : null}

        {allDone && !reminderAsked && remindersSupported ? (
          <View style={styles.intention}>
            <Text style={styles.intentionTitle}>When will you practise tomorrow?</Text>
            <Text style={styles.note}>
              Picking a time makes it much easier to come back. One reminder a day; you can change
              it in Settings.
            </Text>
            <ReminderPicker variant="chips" />
          </View>
        ) : null}
      </View>

      <StreakStrip streak={streak} track={track} week={week} />
      <Text style={styles.footnote}>{plan.footnote}</Text>
    </PrimaryAccent>
  );
}

/** The current step, large: what it is, where it sits in the course, and one button. */
function Focus({
  step,
  track,
  progress,
  onOpen,
}: {
  step: PlanStep;
  track: LanguageTrack;
  progress: ReturnType<typeof useCoachingStore.getState>['foundations'];
  onOpen: () => void;
}) {
  const colors = trackColors[track];
  const context =
    step.kind === 'lesson'
      ? lessonContext(track, progress, step.key.slice('lesson:'.length))
      : undefined;
  return (
    <Animated.View key={step.key} entering={FadeIn.duration(220)} style={styles.focus}>
      <View style={styles.kindRow}>
        <View style={[styles.kindIcon, { backgroundColor: colors.tint }]}>
          <MaterialCommunityIcons color={Palette.ink} name={kindIcon[step.kind]} size={18} />
        </View>
        <Text style={styles.kindText} numberOfLines={1}>
          {context
            ? `${context.unit.label} · Lesson ${context.number} of ${context.unit.lessons.length}`
            : kindLabel[step.kind]}
        </Text>
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {step.title}
      </Text>
      <Text style={styles.lead}>{step.why}</Text>
      {context ? (
        <View
          accessible
          accessibilityLabel={`${context.unit.done} of ${context.unit.lessons.length} lessons in this unit done`}
          style={styles.unitProgress}
        >
          <ProgressFill
            value={context.unit.done / context.unit.lessons.length}
            color={colors.accent}
            track="rgba(19,18,17,0.08)"
            height={8}
          />
          <Text style={styles.unitCount}>
            {context.unit.done}/{context.unit.lessons.length}
          </Text>
        </View>
      ) : null}
      <PrimaryButton
        title={`${step.action} · ${step.minutes} min`}
        icon="arrow-right"
        accessibilityLabel={`${step.action}: ${step.title}`}
        onPress={onOpen}
      />
    </Animated.View>
  );
}

function StepRow({
  step,
  current,
  accent,
  onAccent,
  onPress,
}: {
  step: PlanStep;
  current: boolean;
  accent: string;
  onAccent: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${step.done ? 'Done' : current ? 'Now' : 'Next'}: ${step.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.marker,
          step.done && { backgroundColor: accent, borderColor: accent },
          current && { borderColor: Palette.ink },
        ]}
      >
        {step.done ? (
          <Animated.View entering={ZoomIn.springify().damping(14)}>
            <MaterialCommunityIcons color={onAccent} name="check" size={16} />
          </Animated.View>
        ) : (
          <MaterialCommunityIcons
            color={current ? Palette.ink : Palette.muted}
            name={kindIcon[step.kind]}
            size={15}
          />
        )}
      </View>
      <View style={styles.rowCopy}>
        <Text numberOfLines={1} style={[styles.rowTitle, step.done && styles.rowTitleDone]}>
          {step.title}
        </Text>
        <Text style={styles.rowMeta}>
          {kindLabel[step.kind]} · {step.done ? 'done' : `${step.minutes} min`}
        </Text>
      </View>
      <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    marginBottom: 12,
    marginHorizontal: 18,
    marginTop: 8,
    padding: 18,
  },
  cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  count: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  focus: { gap: 10 },
  kindRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  kindIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  kindText: { color: Palette.secondary, flex: 1, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  title: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 22, lineHeight: 28 },
  lead: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 15, lineHeight: 22 },
  unitProgress: { alignItems: 'center', flexDirection: 'row', gap: 10, marginVertical: 2 },
  unitCount: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  done: { alignItems: 'flex-start', gap: 8 },
  doneBadge: {
    alignItems: 'center',
    borderRadius: 99,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  list: { borderTopColor: Palette.line, borderTopWidth: 1, paddingTop: 6 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12, minHeight: 56, paddingVertical: 6 },
  marker: {
    alignItems: 'center',
    borderColor: Palette.line,
    borderRadius: 99,
    borderWidth: 1.5,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 15 },
  rowTitleDone: { color: Palette.secondary },
  rowMeta: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13 },
  extra: {
    alignItems: 'center',
    borderColor: Palette.line,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 60,
    padding: 12,
  },
  extraCopy: { flex: 1, gap: 2 },
  extraLabel: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium, fontSize: 13 },
  extraTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 15 },
  intention: { borderColor: Palette.line, borderRadius: 16, borderWidth: 1, gap: 8, padding: 14 },
  intentionTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 16 },
  note: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 14, lineHeight: 20 },
  footnote: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginHorizontal: 22,
    marginTop: 4,
  },
  milestone: { borderRadius: 24, gap: 8, marginHorizontal: 18, marginTop: 8, padding: 18 },
  trophy: {
    alignItems: 'center',
    borderRadius: 99,
    height: 48,
    justifyContent: 'center',
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
  pressed: { opacity: 0.7 },
});
