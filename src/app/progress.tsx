import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { LevelPill } from '@/components/course-view';
import { ProgressFill } from '@/components/motion';
import { StreakStrip } from '@/components/streak-strip';
import { SyncStatusNotice } from '@/components/sync-status';
import { TabHeader } from '@/components/tab-header';
import { AppScreen } from '@/components/voka-ui';
import { FontSize, LineHeight, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import { testDateFor, useCoachingStore } from '@/features/coaching/store';
import { curriculumUnits } from '@/features/curriculum/catalog';
import { useHabits } from '@/features/habits/use-habits';
import { courseLevels, coursePosition, levelProgress } from '@/features/journey/course';
import {
  languageDetails,
  languageTracks,
  trackColors,
  type LanguageTrack,
} from '@/features/language/config';
import { useSelectedLanguage } from '@/features/language/selection';
import { listeningScenarios } from '@/features/listening/scenarios';
import { daysUntilTest, formatTestDate } from '@/features/profile/test-date';
import { useProgressStore } from '@/features/progress/store';
import { reviewSummary } from '@/features/review/schedule';

/** Progress: what you have learned in this language, then this week, then the rest. */
export default function ProgressScreen() {
  const router = useRouter();
  const [track, setTrack] = useSelectedLanguage();
  const progress = useCoachingStore((state) => state.foundations);
  const preferences = useCoachingStore((state) => state.preferences);
  const practisedUnits = useCoachingStore((state) => state.completedUnitIds);
  const signals = useCoachingStore((state) => state.signals).filter(
    (signal) => signal.track === track,
  );
  const writingDays = useCoachingStore((state) => state.writingPracticeDates.length);
  const testDate = useCoachingStore((state) => testDateFor(state, track));
  const heard = useProgressStore((state) => state.completedScenarioIds);
  const habits = useHabits(track);
  const colors = trackColors[track];
  const language = languageDetails[track].name;
  const position = coursePosition(progress, track, preferences[track].startAt);
  const levels = courseLevels(track, progress);
  const here =
    levels.find((section) => section.groups.some((group) => group.id === position.unit?.id)) ??
    levels.find((section) => section.groups.length > 0);
  const words = reviewSummary(progress, track);
  const dialogues = listeningScenarios.filter((scenario) => scenario.track === track);
  const conversations = curriculumUnits.filter((unit) => unit.track === track);
  const daysLeft = daysUntilTest(testDate);

  return (
    <AppScreen activeNav="progress">
      <TabHeader title="Progress" track={track} onTrack={setTrack} />
      <SyncStatusNotice />

      <Animated.View entering={FadeInDown.duration(220)} style={styles.card}>
        <Text style={styles.eyebrow}>{language} course</Text>
        <Text style={styles.big}>
          {position.finishedLessons} of {position.totalLessons} lessons
        </Text>
        <ProgressFill
          value={position.finishedLessons / Math.max(1, position.totalLessons)}
          color={colors.deep}
          track={Palette.soft}
          height={10}
        />
        <Text style={styles.meta}>
          {here?.reached
            ? `${here.level} reached`
            : `Working towards ${here?.level ?? levels[0].level}`}
          {position.next ? ` · now in ${position.unit?.label ?? position.next.lesson.level}` : ''}
          {position.coveredLessons ? ` · ${position.coveredLessons} covered by a checkpoint` : ''}
        </Text>
        {/* The same levels and counts as Course, so the two tabs always agree. */}
        <View style={styles.unitList}>
          {levels.map((section) => {
            const { text, value } = levelProgress(section);
            const built = section.groups.length > 0;
            return (
              <View key={section.level} style={styles.levelBlock}>
                <View style={styles.unitRow}>
                  <View style={styles.unitTop}>
                    <View style={styles.levelHead}>
                      <LevelPill label={section.label} built={built} track={track} />
                      <Text style={[styles.levelName, !built && styles.later]}>{section.name}</Text>
                    </View>
                    <Text style={styles.unitCount}>{built ? text : 'Coming later'}</Text>
                  </View>
                  {built ? (
                    <View style={styles.unitBar}>
                      <ProgressFill
                        value={value}
                        color={colors.deep}
                        track={Palette.soft}
                        height={6}
                      />
                    </View>
                  ) : null}
                </View>
                {section === here
                  ? section.groups.map((unit) => (
                      <View key={unit.id} style={[styles.unitRow, styles.unitInLevel]}>
                        {/* Name and count on one line, the bar below, so names keep the full width. */}
                        <View style={styles.unitTop}>
                          <Text style={styles.unitName} numberOfLines={2}>
                            {unit.label}
                          </Text>
                          <Text style={styles.unitCount}>
                            {unit.done}/{unit.lessons.length}
                          </Text>
                        </View>
                        <View style={styles.unitBar}>
                          <ProgressFill
                            value={unit.done / unit.lessons.length}
                            color={colors.deep}
                            track={Palette.soft}
                            height={6}
                          />
                        </View>
                      </View>
                    ))
                  : null}
              </View>
            );
          })}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/sprint?track=${track}` as Href)}
          style={({ pressed }) => [styles.link, pressed && styles.pressed]}
        >
          <Text style={styles.linkText}>Open the course</Text>
          <MaterialCommunityIcons color={Palette.ink} name="chevron-right" size={20} />
        </Pressable>
      </Animated.View>

      <View style={styles.stats}>
        <Stat
          value={words.learning}
          label="phrases learned"
          detail={words.strong ? `${words.strong} well remembered` : 'in your review queue'}
        />
        <Stat
          value={heard.filter((id) => dialogues.some((item) => item.id === id)).length}
          label="dialogues heard"
          detail={`of ${dialogues.length}`}
        />
        <Stat
          value={conversations.filter((unit) => practisedUnits.includes(unit.id)).length}
          label="conversations"
          detail={`of ${conversations.length}`}
        />
      </View>

      <Text accessibilityRole="header" style={styles.sectionTitle}>
        This week
      </Text>
      <StreakStrip streak={habits.streak} track={track} week={habits.week} />
      <Text style={styles.note}>
        The streak counts days you practise any language. One missed day a week is covered as a rest
        day, and nothing you have learned is lost when a run ends. Writing days so far:{' '}
        {writingDays}.
      </Text>

      {testDate ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change goal date"
          onPress={() => router.push('/test-date' as Href)}
          style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="calendar-clock" size={24} />
          <View style={styles.rowCopy}>
            <Text style={styles.eyebrow}>Goal date · {formatTestDate(testDate)}</Text>
            <Text style={styles.rowTitle}>
              {daysLeft !== null && daysLeft < 0
                ? 'This date has passed · tap to update'
                : daysLeft === 0
                  ? 'Your test is today'
                  : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} to go`}
            </Text>
          </View>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
        </Pressable>
      ) : null}

      {signals.length ? (
        <View style={styles.card}>
          <Text style={styles.eyebrow}>What Vokeno noticed when you spoke</Text>
          {signals.slice(0, 3).map((signal) => (
            <View key={signal.label} style={styles.signal}>
              <Text style={styles.rowTitle}>
                {signal.label} · {signal.count}×
              </Text>
              <Text style={styles.meta}>{signal.reason}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text accessibilityRole="header" style={styles.sectionTitle}>
        Your other languages
      </Text>
      <View style={styles.others}>
        {languageTracks
          .filter((item) => item !== track)
          .map((item) => (
            <OtherLanguage key={item} track={item} onOpen={() => setTrack(item)} />
          ))}
      </View>
    </AppScreen>
  );
}

function OtherLanguage({ track, onOpen }: { track: LanguageTrack; onOpen: () => void }) {
  const progress = useCoachingStore((state) => state.foundations);
  const startAt = useCoachingStore((state) => state.preferences[track].startAt);
  const position = coursePosition(progress, track, startAt);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Show ${languageDetails[track].name} progress`}
      onPress={onOpen}
      style={({ pressed }) => [styles.other, pressed && styles.pressed]}
    >
      <View style={[styles.badge, { backgroundColor: trackColors[track].accent }]}>
        <Text style={[styles.badgeText, { color: trackColors[track].onAccent }]}>{track}</Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{languageDetails[track].name}</Text>
        <Text style={styles.meta}>
          {position.started
            ? `${position.finishedLessons} of ${position.totalLessons} lessons done`
            : 'Not started'}
        </Text>
      </View>
      <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
    </Pressable>
  );
}

function Stat({ value, label, detail }: { value: number; label: string; detail: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statDetail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: space(2),
    marginHorizontal: space(4),
    marginTop: space(2),
    padding: space(4),
  },
  eyebrow: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
  },
  big: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
  },
  meta: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  unitList: { gap: space(4), marginTop: space(1) },
  levelBlock: { gap: space(2) },
  levelHead: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space(2),
  },
  levelName: {
    color: Palette.ink,
    flexShrink: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  later: { color: Palette.secondary },
  unitInLevel: { paddingLeft: space(3) },
  unitRow: { gap: space(1.5) },
  unitTop: { alignItems: 'flex-start', flexDirection: 'row', gap: space(2) },
  unitName: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  unitBar: { flex: 1, flexDirection: 'row' },
  unitCount: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.label,
    minWidth: 28,
    textAlign: 'right',
  },
  link: { alignItems: 'center', flexDirection: 'row', gap: space(1), minHeight: 44 },
  linkText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.body },
  // Three across where they fit; on small phones or large text they wrap rather than break words.
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space(2),
    marginHorizontal: space(4),
    marginTop: space(3),
  },
  stat: {
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    flexBasis: 112,
    flexGrow: 1,
    gap: space(0.5),
    padding: space(3),
  },
  statValue: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.title },
  statLabel: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.caption },
  statDetail: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: FontSize.caption },
  sectionTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
    marginBottom: space(3),
    marginHorizontal: space(5),
    marginTop: space(6),
  },
  note: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginHorizontal: space(6),
  },
  row: { alignItems: 'center', flexDirection: 'row' },
  rowCopy: { flex: 1, gap: space(0.5) },
  rowTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.body },
  signal: {
    borderTopColor: Palette.line,
    borderTopWidth: 1,
    gap: space(0.5),
    paddingTop: space(2),
  },
  others: {
    gap: space(2),
    marginHorizontal: space(4),
    marginTop: space(2),
    marginBottom: space(4),
  },
  other: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(3),
    minHeight: 64,
    padding: space(3),
  },
  badge: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  badgeText: { fontFamily: VokaFonts.bodyBold, fontSize: FontSize.label },
  pressed: { opacity: 0.7 },
});
