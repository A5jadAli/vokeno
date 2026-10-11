import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useEffect, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { PrimaryAccent, PrimaryButton } from '@/components/lesson-ui';
import { ReminderPicker } from '@/components/reminder-picker';
import { StreakStrip } from '@/components/streak-strip';
import { Palette, VokaFonts } from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import type { PlanStep } from '@/features/coaching/daily-plan';
import { foundationLessons, getTrackLessons } from '@/features/foundations/catalog';
import { lessonLines } from '@/features/audio/inventory';
import { prefetchClips } from '@/features/audio/use-lesson-audio';
import { levelLabel, levelNote } from '@/features/foundations/level-status';
import { remindersSupported } from '@/features/habits/reminder-scheduler';
import { useReminderStore } from '@/features/habits/reminders';
import type { useHabits } from '@/features/habits/use-habits';
import { reviewSummary } from '@/features/review/schedule';
import { isFinished, lessonContext } from '@/features/journey/course';
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
export function TodayCard({
  track,
  habits,
}: {
  track: LanguageTrack;
  habits: ReturnType<typeof useHabits>;
}) {
  const router = useRouter();
  const { plan, streak, week, milestone } = habits;
  const progress = useCoachingStore((state) => state.foundations);
  const review = reviewSummary(progress, track);
  const reminderAsked = useReminderStore((state) => state.asked);
  const colors = trackColors[track];
  const current = plan.steps.find((step) => !step.done);
  // While Today is open, fetch the next lesson's voices so it plays instantly from the first tap.
  const upcoming = [current, plan.bonus].find((step) => step?.kind === 'lesson')?.key;
  useEffect(() => {
    const lesson = foundationLessons.find((item) => `lesson:${item.id}` === upcoming);
    if (lesson) prefetchClips(track, lessonLines(lesson));
  }, [track, upcoming]);
  const allDone = !current;
  const open = (step: PlanStep) => router.push(step.href as Href);
  // Two quick ways in besides the session, skipping anything the session still has in it.
  const planned = new Set(plan.steps.filter((step) => !step.done).map((step) => step.kind));
  const shortcuts = [
    !planned.has('review') && {
      icon: 'cards-outline' as IconName,
      title: 'Review',
      meta: review.due
        ? `${Math.min(review.due, 8)} phrases ready`
        : review.learning
          ? 'All caught up'
          : 'Words from lessons land here',
      href: `/review?track=${track}`,
      highlight: review.due > 0,
    },
    !planned.has('speaking') && {
      icon: 'microphone-outline' as IconName,
      title: 'Talk',
      meta: 'A short chat with the coach',
      href: `/conversation?track=${track}`,
      highlight: false,
    },
    !planned.has('listening') && {
      icon: 'headphones' as IconName,
      title: 'Listen',
      meta: `Real ${languageDetails[track].name}, short and natural`,
      href: `/listening?track=${track}`,
      highlight: false,
    },
  ]
    .filter((tile) => tile !== false)
    .slice(0, 2);
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

      <Text style={styles.intro}>{plan.footnote}</Text>

      {current ? (
        <Focus step={current} track={track} progress={progress} onOpen={() => open(current)} />
      ) : (
        <Animated.View entering={FadeIn.duration(240)} style={[styles.card, styles.done]}>
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
          {plan.bonus ? (
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
          {!reminderAsked && remindersSupported ? (
            <View style={styles.intention}>
              <Text style={styles.intentionTitle}>When will you practise tomorrow?</Text>
              <Text style={styles.note}>
                Picking a time makes it much easier to come back. One reminder a day; you can change
                it in Settings.
              </Text>
              <ReminderPicker variant="chips" />
            </View>
          ) : null}
        </Animated.View>
      )}

      {/* Several steps, or a finished day: list them, so what was done stays visible. */}
      {plan.steps.length > 1 || allDone ? (
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.sectionTitle}>
              {allDone ? 'Your session · done' : `Your session · about ${plan.minutes} min`}
            </Text>
            {plan.steps.length > 1 ? (
              <Text style={styles.count}>
                {plan.doneCount} of {plan.steps.length} done
              </Text>
            ) : null}
          </View>
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

      <View style={styles.tiles}>
        {shortcuts.map((tile) => (
          <Pressable
            key={tile.title}
            accessibilityRole="button"
            accessibilityLabel={`${tile.title}: ${tile.meta}`}
            onPress={() => router.push(tile.href as Href)}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
          >
            <View
              style={[
                styles.tileIcon,
                { backgroundColor: tile.highlight ? colors.accent : colors.tint },
              ]}
            >
              <MaterialCommunityIcons
                color={tile.highlight ? colors.onAccent : Palette.ink}
                name={tile.icon}
                size={22}
              />
            </View>
            <Text style={styles.tileTitle}>{tile.title}</Text>
            <Text numberOfLines={2} style={styles.tileMeta}>
              {tile.meta}
            </Text>
          </Pressable>
        ))}
      </View>

      <StreakStrip streak={streak} track={track} week={week} showCount={false} />
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
  const icon = (context?.unit.icon as IconName | undefined) ?? kindIcon[step.kind];
  const lessons = context?.unit.lessons ?? [];
  return (
    <Animated.View
      key={step.key}
      entering={FadeInDown.duration(260)}
      style={[styles.card, styles.hero]}
    >
      <View style={[styles.band, { backgroundColor: colors.tint }]}>
        {/* A large, faint copy of the topic icon gives the card some character. */}
        <View importantForAccessibility="no-hide-descendants" style={styles.bandArt}>
          <MaterialCommunityIcons color={colors.accent} name={icon} size={112} />
        </View>
        <View style={[styles.bandIcon, { backgroundColor: colors.accent }]}>
          <MaterialCommunityIcons color={colors.onAccent} name={icon} size={24} />
        </View>
        <View style={styles.bandCopy}>
          <Text numberOfLines={1} style={styles.bandLabel}>
            {context ? context.unit.label : kindLabel[step.kind]}
          </Text>
          {context && lessons.length <= 8 ? (
            <View
              accessible
              accessibilityLabel={`Lesson ${context.number} of ${lessons.length}. ${context.unit.done} done.`}
              style={styles.dots}
            >
              {lessons.map((lesson, index) => {
                const finished = isFinished(progress[lesson.id]);
                const now = index === context.number - 1;
                return (
                  <View
                    key={lesson.id}
                    style={[
                      styles.dotStep,
                      finished && { backgroundColor: colors.accent },
                      now && styles.dotNow,
                    ]}
                  >
                    {finished ? (
                      <MaterialCommunityIcons color={colors.onAccent} name="check" size={11} />
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : context ? (
            <Text style={styles.bandMeta}>
              Lesson {context.number} of {lessons.length}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.heroBody}>
        <Text accessibilityRole="header" style={styles.title}>
          {step.title}
        </Text>
        <Text style={styles.lead}>{step.why}</Text>
        <PrimaryButton
          title={`${step.action} · ${step.minutes} min`}
          icon="arrow-right"
          accessibilityLabel={`${step.action}: ${step.title}`}
          onPress={onOpen}
        />
      </View>
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
  intro: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 6,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
    marginBottom: 12,
    marginHorizontal: 18,
    padding: 18,
  },
  hero: { gap: 0, overflow: 'hidden', padding: 0 },
  band: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    minHeight: 84,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  bandCopy: { flex: 1, gap: 8 },
  bandArt: { opacity: 0.22, position: 'absolute', right: -14, top: -16 },
  bandIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  bandLabel: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 15 },
  bandMeta: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  dots: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  dotStep: {
    alignItems: 'center',
    backgroundColor: 'rgba(19,18,17,0.10)',
    borderRadius: 99,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  dotNow: {
    backgroundColor: Palette.white,
    borderColor: Palette.ink,
    borderWidth: 2.5,
    height: 18,
    width: 18,
  },
  heroBody: { gap: 10, padding: 18, paddingTop: 16 },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 15 },
  count: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  title: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 24, lineHeight: 30 },
  lead: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 15, lineHeight: 22 },
  done: { alignItems: 'flex-start', gap: 10 },
  doneBadge: {
    alignItems: 'center',
    borderRadius: 99,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
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
  tiles: { flexDirection: 'row', gap: 12, marginBottom: 12, marginHorizontal: 18 },
  tile: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    minHeight: 120,
    padding: 14,
  },
  tileIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginBottom: 6,
    width: 40,
  },
  tileTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 16 },
  tileMeta: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13, lineHeight: 18 },
  extra: {
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
  extraCopy: { flex: 1, gap: 2 },
  extraLabel: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium, fontSize: 13 },
  extraTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 15 },
  intention: {
    alignSelf: 'stretch',
    borderColor: Palette.line,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  intentionTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 16 },
  note: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 14, lineHeight: 20 },
  milestone: { borderRadius: 24, gap: 8, marginBottom: 12, marginHorizontal: 18, padding: 18 },
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
