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
import { FontSize, LineHeight, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import { getTrackLessons, type FoundationLesson } from '@/features/foundations/catalog';
import { foundationReviewDue } from '@/features/foundations/progress';
import { BottomSheet } from '@/components/bottom-sheet';
import { PrimaryButton } from '@/components/lesson-ui';
import { useCheckpointNudges } from '@/features/journey/checkpoint-nudges';
import { checkpointBefore, checkpointResult, coveredLessons } from '@/features/journey/checkpoints';
import {
  courseLevels,
  coursePosition,
  groupsAround,
  levelProgress,
  pathStart,
  isFinished,
  isInProgress,
  lessonMinutes,
  type LevelSection,
  type UnitSummary,
} from '@/features/journey/course';
import { trackColors, type LanguageTrack } from '@/features/language/config';
import type { LessonLevel } from '@/features/foundations/types';

/** Ends a title as a sentence for screen readers, without doubling “!” or “?”. */
const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

/** The course: levels A1 to B2 as sections, the current one open around "you are here". */
export function CourseView({ track }: { track: LanguageTrack }) {
  const router = useRouter();
  const progress = useCoachingStore((state) => state.foundations);
  const startAt = useCoachingStore((state) => state.preferences[track].startAt);
  const position = coursePosition(progress, track, startAt);
  const levels = courseLevels(track, progress);
  const nextId = position.next?.lesson.id;
  // The level that holds "you are here" (a warm-up sits inside its course's first level).
  const currentLevel =
    levels.find((item) => item.groups.some((group) => group.id === position.unit?.id))?.level ??
    levels.find((item) => item.groups.length)?.level;
  // The level and unit you are in start open; anything you open or close yourself stays that way.
  const [levelToggled, setLevelToggled] = useState<Partial<Record<LessonLevel, boolean>>>({});
  const [showAll, setShowAll] = useState<Partial<Record<LessonLevel, boolean>>>({});
  const [noteOpen, setNoteOpen] = useState<Partial<Record<LessonLevel, boolean>>>({});
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const isLevelOpen = (level: LessonLevel) => levelToggled[level] ?? level === currentLevel;
  const isOpen = (unit: UnitSummary) => toggled[unit.id] ?? unit.id === position.unit?.id;
  const colors = trackColors[track];
  const go = (lesson: FoundationLesson) => router.push(`/foundation/${lesson.id}` as Href);
  // Jumping past a checkpoint not taken yet: say so once, with two equal choices. Never a lock.
  const [jump, setJump] = useState<{ gate: FoundationLesson; lesson: FoundationLesson } | null>(
    null,
  );
  const openLesson = (lesson: FoundationLesson) => {
    const gate = checkpointBefore(
      getTrackLessons(track),
      progress,
      lesson,
      pathStart(track, startAt),
    );
    if (!gate || useCheckpointNudges.getState().seen.includes(gate.id)) return go(lesson);
    useCheckpointNudges.getState().markSeen(gate.id);
    setJump({ gate, lesson });
  };
  const gateName = jump?.gate.format === 'steps' ? `Checkpoint ${jump.gate.unit.checkpoint}` : '';

  return (
    <View style={styles.section}>
      {position.next === null ? (
        <View style={[styles.banner, { backgroundColor: colors.tint }]}>
          <MaterialCommunityIcons color={Palette.ink} name="flag-checkered" size={22} />
          <Text style={styles.bannerText}>
            You have finished every lesson so far. New units appear here when ready.
          </Text>
        </View>
      ) : null}

      {levels.map((section) => {
        const open = section.groups.length > 0 && isLevelOpen(section.level);
        const all = showAll[section.level] ?? false;
        const shown = all ? section.groups : groupsAround(section.groups, position.unit?.id);
        return (
          <Animated.View
            key={section.level}
            layout={LinearTransition.duration(220)}
            style={styles.level}
          >
            <LevelHeader
              section={section}
              open={open}
              current={section.level === currentLevel}
              track={track}
              onToggle={() => setLevelToggled((state) => ({ ...state, [section.level]: !open }))}
            />
            {open ? (
              <Animated.View entering={FadeIn.duration(200)} style={styles.units}>
                {section.note ? (
                  // The honest note stays, one line until the learner asks for more.
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={section.note}
                    accessibilityHint={
                      noteOpen[section.level] ? 'Shows less' : 'Shows the whole note'
                    }
                    onPress={() =>
                      setNoteOpen((state) => ({ ...state, [section.level]: !state[section.level] }))
                    }
                    style={styles.noteRow}
                  >
                    <Text
                      numberOfLines={noteOpen[section.level] ? undefined : 1}
                      style={[styles.levelNote, styles.noteText]}
                    >
                      {section.note}
                    </Text>
                    <Text style={styles.noteMore}>{noteOpen[section.level] ? 'Less' : 'More'}</Text>
                  </Pressable>
                ) : null}
                {shown.map((unit) =>
                  unit.kind === 'checkpoint' && unit.lessons.length === 1 ? (
                    <GateRow
                      key={unit.id}
                      unit={unit}
                      after={
                        section.groups[section.groups.indexOf(unit) - 1]?.label.split(' · ')[0]
                      }
                      isNext={unit.lessons[0].id === nextId}
                      track={track}
                      onOpen={() => openLesson(unit.lessons[0])}
                    />
                  ) : (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      open={isOpen(unit)}
                      current={unit.id === position.unit?.id}
                      nextId={nextId}
                      track={track}
                      onToggle={() =>
                        setToggled((state) => ({ ...state, [unit.id]: !isOpen(unit) }))
                      }
                      onOpenLesson={openLesson}
                    />
                  ),
                )}
                {section.groups.length > shown.length || all ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: all }}
                    aria-expanded={all}
                    onPress={() => setShowAll((state) => ({ ...state, [section.level]: !all }))}
                    style={({ pressed }) => [styles.showAll, pressed && styles.pressed]}
                  >
                    <Text style={styles.showAllText}>
                      {all ? 'Show fewer' : `Show all ${section.groups.length} in ${section.label}`}
                    </Text>
                    <MaterialCommunityIcons
                      color={Palette.ink}
                      name={all ? 'chevron-up' : 'chevron-down'}
                      size={20}
                    />
                  </Pressable>
                ) : null}
              </Animated.View>
            ) : null}
          </Animated.View>
        );
      })}

      <BottomSheet
        visible={jump !== null}
        onClose={() => setJump(null)}
        closeLabel="Close checkpoint note"
      >
        {(close) =>
          jump ? (
            <View style={styles.sheet}>
              <Text accessibilityRole="header" style={styles.sheetTitle}>
                This is past {gateName}
              </Text>
              <Text style={styles.sheetText}>
                {gateName} shows what you can do from the units before it. Take it first to check
                you are ready, or start anyway: you can take it any time.
              </Text>
              <PrimaryButton
                tone="secondary"
                title={`Take ${gateName}`}
                onPress={() => {
                  close();
                  go(jump.gate);
                }}
              />
              <PrimaryButton
                tone="secondary"
                title="Start anyway"
                onPress={() => {
                  close();
                  go(jump.lesson);
                }}
              />
            </View>
          ) : null
        }
      </BottomSheet>

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

/** A level's heading: its name, how far you are, and a bar. Levels not built yet say so. */
function LevelHeader({
  section,
  open,
  current,
  track,
  onToggle,
}: {
  section: LevelSection;
  open: boolean;
  current: boolean;
  track: LanguageTrack;
  onToggle: () => void;
}) {
  const colors = trackColors[track];
  const built = section.groups.length > 0;
  const { text, value, label } = levelProgress(section);
  const pill = <LevelPill label={section.label} built={built} track={track} />;
  if (!built)
    return (
      <View
        accessibilityLabel={`${section.label}, ${section.name}. Coming later.`}
        style={styles.levelHeader}
      >
        <View style={styles.levelCopy}>
          <View style={styles.levelTop}>
            {pill}
            <Text style={[styles.levelTitle, styles.levelTitleLater]}>{section.name}</Text>
          </View>
        </View>
        <Text style={styles.levelCount}>Coming later</Text>
      </View>
    );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      aria-expanded={open}
      accessibilityLabel={`${section.label}, ${section.name}. ${label}${current ? '. You are in this level' : ''}.`}
      onPress={onToggle}
      style={({ pressed }) => [styles.levelHeader, pressed && styles.pressed]}
    >
      <View style={styles.levelCopy}>
        <View style={styles.levelTop}>
          {pill}
          <Text style={styles.levelTitle}>{section.name}</Text>
        </View>
        <View style={styles.levelBar}>
          <View style={styles.levelBarFill}>
            <ProgressFill value={value} color={colors.deep} track={Palette.soft} height={6} />
          </View>
          <Text style={styles.levelCount}>{text}</Text>
        </View>
      </View>
      <MaterialCommunityIcons
        color={Palette.secondary}
        name={open ? 'chevron-up' : 'chevron-down'}
        size={24}
      />
    </Pressable>
  );
}

/** The level in a tint pill with deep text, the same on Course and Progress. */
export function LevelPill({
  label,
  built,
  track,
}: {
  label: string;
  built: boolean;
  track: LanguageTrack;
}) {
  const colors = trackColors[track];
  return (
    <View style={[styles.levelPill, { backgroundColor: built ? colors.tint : Palette.soft }]}>
      <Text style={[styles.levelPillText, { color: built ? colors.deep : Palette.secondary }]}>
        {label}
      </Text>
    </View>
  );
}

/**
 * A checkpoint between groups of units: a milestone in the path, never a padlock. It says what
 * the checkpoint showed, by the pass mark, and nothing it did not.
 */
function GateRow({
  unit,
  after,
  isNext,
  track,
  onOpen,
}: {
  unit: UnitSummary;
  /** The group it follows, "Unit 5", so a gate ahead says where it sits. */
  after?: string;
  isNext: boolean;
  track: LanguageTrack;
  onOpen: () => void;
}) {
  const colors = trackColors[track];
  const lesson = unit.lessons[0];
  const entry = useCoachingStore((state) => state.foundations[lesson.id]);
  const result = checkpointResult(lesson, entry);
  const score = result ? `${result.right} of ${result.total} right first time` : '';
  const status = !result
    ? isNext
      ? 'Next · see what you can do so far'
      : after
        ? `After ${after} · checks what you can do so far`
        : 'Checks what you can do so far'
    : result.passed
      ? `Passed ${new Date(result.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} · ${score}`
      : `Not passed yet · ${score}${result.speaking === 'skipped' ? ', speaking skipped' : ''}`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${sentence(unit.label)} ${status}.`}
      onPress={onOpen}
      style={({ pressed }) => [
        styles.gate,
        isNext && { backgroundColor: colors.tint },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.gateMark, result?.passed && styles.gateMarkPassed]}>
        <MaterialCommunityIcons
          color={result?.passed ? Palette.cream : Palette.ink}
          name={result?.passed ? 'flag-checkered' : 'flag-outline'}
          size={18}
        />
      </View>
      <View style={styles.gateCopy}>
        <Text style={styles.gateTitle}>{unit.label}</Text>
        <Text style={styles.gateStatus}>{status}</Text>
      </View>
      <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
    </Pressable>
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
  const covered = coveredLessons(getTrackLessons(track), progress);
  const total = unit.lessons.length;
  const complete = unit.done === total;
  const chevron = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(open ? '180deg' : '0deg', { duration: 200 }) }],
  }));
  return (
    <Animated.View
      layout={LinearTransition.duration(220)}
      style={[styles.unit, current && { borderColor: colors.deep }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        aria-expanded={open}
        accessibilityLabel={`${sentence(unit.label)} ${unit.done} of ${total} done${current ? '. You are here' : ''}`}
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
              color={colors.deep}
              track={Palette.soft}
              height={6}
            />
            <Text style={styles.unitCount}>
              {unit.done}/{total}
              {unit.covered ? ' · covered by a checkpoint' : ''}
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
            // Tested out by a passed checkpoint: counted, but not claimed as taken.
            const skipped = !finished && covered.has(lesson.id);
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
                  : skipped
                    ? 'Covered'
                    : '';
            return (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                accessibilityLabel={`${sentence(lesson.title)} ${finished ? 'Done' : skipped ? 'Covered by a checkpoint' : going ? 'In progress' : isNext ? 'Next' : 'Not started'}`}
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
                    color={
                      finished
                        ? colors.onAccent
                        : isNext
                          ? Palette.cream
                          : skipped
                            ? Palette.ink
                            : Palette.muted
                    }
                    name={finished || skipped ? 'check' : isNext || going ? 'play' : 'circle-small'}
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
  section: { gap: space(4), marginHorizontal: space(4), marginTop: space(2) },
  banner: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(3),
    padding: space(4),
  },
  bannerText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  // The same inset as the level heading above it.
  noteRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: space(2),
    minHeight: 44,
    paddingHorizontal: space(1),
  },
  noteText: { flex: 1 },
  noteMore: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    textDecorationLine: 'underline',
  },
  levelNote: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  units: { gap: space(2), marginTop: space(1) },
  level: { gap: space(1) },
  // A level is a section heading on the canvas; its units are the cards under it.
  levelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    minHeight: 56,
    paddingHorizontal: space(1),
    paddingVertical: space(2),
  },
  levelCopy: { flex: 1, gap: space(2) },
  levelTop: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  levelPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: space(2.5),
    paddingVertical: space(1),
  },
  levelPillText: {
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  levelBar: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  // A fixed height: on Android the bar would otherwise grow to the count's line height.
  levelBarFill: { flex: 1, height: 6 },
  levelTitle: {
    color: Palette.ink,
    flexShrink: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
  },
  levelTitleLater: { color: Palette.secondary },
  levelCount: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  showAll: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: space(1),
    minHeight: 44,
    paddingHorizontal: space(4),
  },
  showAllText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.label },
  // A milestone: an ink outline and a flag, so it reads as a landmark, not another unit.
  gate: {
    alignItems: 'center',
    borderColor: Palette.ink,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: space(3),
    minHeight: 64,
    paddingHorizontal: space(4),
    paddingVertical: space(3),
  },
  gateMark: {
    alignItems: 'center',
    borderColor: Palette.ink,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  gateMarkPassed: { backgroundColor: Palette.ink },
  gateCopy: { flex: 1, gap: space(0.5) },
  sheet: { gap: space(3), paddingBottom: space(2) },
  sheetTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
    marginTop: space(1),
  },
  sheetText: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    marginBottom: space(1),
  },
  gateTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  gateStatus: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  unit: {
    backgroundColor: Palette.white,
    borderColor: 'transparent',
    borderRadius: Radius.xl,
    borderWidth: 2,
    overflow: 'hidden',
  },
  unitHeader: { alignItems: 'center', flexDirection: 'row', gap: space(3), padding: space(4) },
  unitBadge: {
    alignItems: 'center',
    backgroundColor: Palette.soft,
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  unitCopy: { flex: 1, gap: space(1) },
  here: { fontFamily: VokaFonts.bodyBold, fontSize: FontSize.caption, letterSpacing: 0.3 },
  unitTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  unitCanDo: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  unitProgress: { alignItems: 'center', flexDirection: 'row', gap: space(2), marginTop: space(1) },
  unitCount: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
  },
  lessons: { borderTopColor: Palette.line, borderTopWidth: 1 },
  lesson: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    minHeight: 64,
    paddingHorizontal: space(4),
    paddingVertical: space(2),
  },
  lessonDivider: { borderTopColor: Palette.line, borderTopWidth: 1 },
  lessonMark: {
    alignItems: 'center',
    borderColor: Palette.line,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  lessonCopy: { flex: 1, gap: space(0.5) },
  lessonMeta: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.caption,
  },
  lessonTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  lessonAction: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
  },
  links: { backgroundColor: Palette.white, borderRadius: Radius.lg, marginTop: space(2) },
  link: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    minHeight: 56,
    paddingHorizontal: space(4),
  },
  linkText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
  },
  pressed: { opacity: 0.7 },
});
