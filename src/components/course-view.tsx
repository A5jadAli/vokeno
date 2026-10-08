import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { ProgressFill } from '@/components/motion';
import { Palette, VokaFonts } from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import { getTrackLessons, type FoundationLesson } from '@/features/foundations/catalog';
import { levelLabel, levelNote } from '@/features/foundations/level-status';
import { foundationReviewDue } from '@/features/foundations/progress';
import {
  courseUnits,
  coursePosition,
  isFinished,
  isInProgress,
  lessonMinutes,
  type UnitSummary,
} from '@/features/journey/course';
import { trackColors, type LanguageTrack } from '@/features/language/config';
import type { LessonLevel } from '@/features/foundations/types';

/** The course: levels, then units with the current one open and the rest summarised. */
export function CourseView({ track }: { track: LanguageTrack }) {
  const router = useRouter();
  const progress = useCoachingStore((state) => state.foundations);
  const startAt = useCoachingStore((state) => state.preferences[track].startAt);
  const position = coursePosition(progress, track, startAt);
  const units = courseUnits(track, progress);
  const lessons = getTrackLessons(track);
  const levels = [...new Set(lessons.map((lesson) => lesson.level))];
  const nextId = position.next?.lesson.id;
  const [picked, setPicked] = useState<LessonLevel | null>(null);
  const level =
    picked && levels.includes(picked)
      ? picked
      : (position.next?.lesson.level ?? lessons.at(-1)?.level ?? levels[0]);
  const inLevel = units.filter((unit) => unit.lessons[0].level === level);
  // The unit you are in starts open; anything you open or close yourself stays that way.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const isOpen = (unit: UnitSummary) => toggled[unit.id] ?? unit.id === position.unit?.id;
  const colors = trackColors[track];

  return (
    <View style={styles.section}>
      {position.next === null ? (
        <View style={[styles.banner, { backgroundColor: colors.tint }]}>
          <MaterialCommunityIcons color={Palette.ink} name="flag-checkered" size={22} />
          <Text style={styles.bannerText}>
            You have finished every lesson available so far. New units appear here as soon as they
            are ready; your progress stays.
          </Text>
        </View>
      ) : null}

      <View accessibilityRole="tablist" style={styles.tabs}>
        {levels.map((value) => {
          const tabLessons = lessons.filter((lesson) => lesson.level === value);
          const done = tabLessons.filter((lesson) => isFinished(progress[lesson.id])).length;
          return (
            <Pressable
              key={value}
              accessibilityRole="tab"
              accessibilityState={{ selected: level === value }}
              accessibilityLabel={`${levelLabel(track, value)}: ${done} of ${tabLessons.length} lessons done`}
              onPress={() => setPicked(value)}
              style={[styles.tab, level === value && styles.tabActive]}
            >
              <Text style={styles.tabText}>{levelLabel(track, value)}</Text>
              <Text style={styles.tabCount}>
                {done}/{tabLessons.length}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {levelNote(track, level) ? (
        <Text style={styles.levelNote}>{levelNote(track, level)}</Text>
      ) : null}

      <Animated.View layout={LinearTransition.duration(220)} style={styles.units}>
        {inLevel.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            open={isOpen(unit)}
            current={unit.id === position.unit?.id}
            nextId={nextId}
            track={track}
            onToggle={() => setToggled((state) => ({ ...state, [unit.id]: !isOpen(unit) }))}
            onOpenLesson={(lesson) => router.push(`/foundation/${lesson.id}` as Href)}
          />
        ))}
      </Animated.View>

      <View style={styles.links}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change where I start"
          onPress={() => router.push('/learning-plan' as Href)}
          style={({ pressed }) => [styles.link, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="tune-variant" size={20} />
          <Text style={styles.linkText}>Change where I start</Text>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Find my level with a short check"
          onPress={() => router.push(`/placement?track=${track}` as Href)}
          style={({ pressed }) => [styles.link, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="compass-outline" size={20} />
          <Text style={styles.linkText}>Find my level with a short check</Text>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
        </Pressable>
      </View>
    </View>
  );
}

function UnitCard({
  unit,
  open,
  current,
  nextId,
  track,
  onToggle,
  onOpenLesson,
}: {
  unit: UnitSummary;
  open: boolean;
  current: boolean;
  nextId?: string;
  track: LanguageTrack;
  onToggle: () => void;
  onOpenLesson: (lesson: FoundationLesson) => void;
}) {
  const colors = trackColors[track];
  const progress = useCoachingStore((state) => state.foundations);
  const total = unit.lessons.length;
  const complete = unit.done === total;
  const chevron = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(open ? '180deg' : '0deg', { duration: 200 }) }],
  }));
  return (
    <Animated.View
      layout={LinearTransition.duration(220)}
      style={[styles.unit, current && { borderColor: colors.accent }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        aria-expanded={open}
        accessibilityLabel={`${unit.label}. ${unit.done} of ${total} done${current ? '. You are here' : ''}`}
        onPress={onToggle}
        style={({ pressed }) => [styles.unitHeader, pressed && styles.pressed]}
      >
        <View
          style={[
            styles.unitBadge,
            complete && { backgroundColor: colors.accent },
            current && !complete && { backgroundColor: Palette.ink },
          ]}
        >
          <MaterialCommunityIcons
            color={complete ? colors.onAccent : current ? Palette.cream : Palette.ink}
            name={complete ? 'check-bold' : current ? 'map-marker' : 'book-outline'}
            size={18}
          />
        </View>
        <View style={styles.unitCopy}>
          {current ? <Text style={[styles.here, { color: Palette.ink }]}>You are here</Text> : null}
          <Text style={styles.unitTitle}>{unit.label}</Text>
          <Text style={styles.unitCanDo} numberOfLines={open ? undefined : 2}>
            {unit.canDo}
          </Text>
          <View style={styles.unitProgress}>
            <ProgressFill
              value={unit.done / total}
              color={colors.accent}
              track="rgba(19,18,17,0.08)"
              height={6}
            />
            <Text style={styles.unitCount}>
              {unit.done}/{total}
            </Text>
          </View>
        </View>
        <Animated.View style={chevron}>
          <MaterialCommunityIcons color={Palette.secondary} name="chevron-down" size={24} />
        </Animated.View>
      </Pressable>
      {open ? (
        <Animated.View entering={FadeIn.duration(200)} style={styles.lessons}>
          {unit.lessons.map((lesson, index) => {
            const entry = progress[lesson.id];
            const finished = isFinished(entry);
            const going = isInProgress(lesson, entry);
            const isNext = lesson.id === nextId;
            const action = going
              ? 'Continue'
              : isNext
                ? 'Start'
                : finished
                  ? foundationReviewDue(entry)
                    ? 'Practise again'
                    : 'Done'
                  : '';
            return (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.title}. ${finished ? 'Done' : going ? 'In progress' : isNext ? 'Next' : 'Not started'}`}
                onPress={() => onOpenLesson(lesson)}
                style={({ pressed }) => [
                  styles.lesson,
                  index > 0 && styles.lessonDivider,
                  isNext && { backgroundColor: colors.tint },
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.lessonMark,
                    finished && { backgroundColor: colors.accent, borderColor: colors.accent },
                    isNext &&
                      !finished && { borderColor: Palette.ink, backgroundColor: Palette.ink },
                  ]}
                >
                  <MaterialCommunityIcons
                    color={finished ? colors.onAccent : isNext ? Palette.cream : Palette.muted}
                    name={finished ? 'check' : isNext || going ? 'play' : 'circle-small'}
                    size={16}
                  />
                </View>
                <View style={styles.lessonCopy}>
                  <Text style={styles.lessonMeta}>
                    {lesson.format === 'steps' ? `${lesson.session} · ` : ''}
                    {lessonMinutes(lesson)} min
                  </Text>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                </View>
                {action ? <Text style={styles.lessonAction}>{action}</Text> : null}
                <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
              </Pressable>
            );
          })}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12, marginHorizontal: 18, marginTop: 6 },
  banner: { alignItems: 'center', borderRadius: 18, flexDirection: 'row', gap: 12, padding: 14 },
  bannerText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  tabs: {
    backgroundColor: Palette.soft,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  tab: { alignItems: 'center', borderRadius: 12, flex: 1, justifyContent: 'center', minHeight: 52 },
  tabActive: { backgroundColor: Palette.white },
  tabText: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 15 },
  tabCount: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 12 },
  levelNote: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13, lineHeight: 19 },
  units: { gap: 10 },
  unit: {
    backgroundColor: Palette.white,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  unitHeader: { alignItems: 'center', flexDirection: 'row', gap: 12, padding: 14 },
  unitBadge: {
    alignItems: 'center',
    backgroundColor: Palette.soft,
    borderRadius: 14,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  unitCopy: { flex: 1, gap: 3 },
  here: { fontFamily: VokaFonts.bodyBold, fontSize: 12, letterSpacing: 0.3 },
  unitTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 16, lineHeight: 22 },
  unitCanDo: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 14, lineHeight: 20 },
  unitProgress: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 4 },
  unitCount: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 12 },
  lessons: { borderTopColor: Palette.line, borderTopWidth: 1 },
  lesson: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  lessonDivider: { borderTopColor: Palette.line, borderTopWidth: 1 },
  lessonMark: {
    alignItems: 'center',
    borderColor: Palette.line,
    borderRadius: 99,
    borderWidth: 1.5,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  lessonCopy: { flex: 1, gap: 2 },
  lessonMeta: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium, fontSize: 12 },
  lessonTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 21,
  },
  lessonAction: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  links: { backgroundColor: Palette.white, borderRadius: 18, marginTop: 6 },
  link: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  linkText: { color: Palette.ink, flex: 1, fontFamily: VokaFonts.bodyMedium, fontSize: 15 },
  pressed: { opacity: 0.7 },
});
