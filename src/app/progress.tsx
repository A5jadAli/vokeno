import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ProgressFill } from '@/components/motion';
import { StreakStrip } from '@/components/streak-strip';
import { SyncStatusNotice } from '@/components/sync-status';
import { TabHeader } from '@/components/tab-header';
import { AppScreen } from '@/components/voka-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import { testDateFor, useCoachingStore } from '@/features/coaching/store';
import { curriculumUnits } from '@/features/curriculum/catalog';
import { useHabits } from '@/features/habits/use-habits';
import { courseUnits, coursePosition } from '@/features/journey/course';
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
  const units = courseUnits(track, progress);
  const words = reviewSummary(progress, track);
  const dialogues = listeningScenarios.filter((scenario) => scenario.track === track);
  const conversations = curriculumUnits.filter((unit) => unit.track === track);
  const daysLeft = daysUntilTest(testDate);
  const unitsDone = units.filter((unit) => unit.done === unit.lessons.length).length;

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
          color={colors.accent}
          track="rgba(19,18,17,0.08)"
          height={10}
        />
        <Text style={styles.meta}>
          {unitsDone} of {units.length} {units.length === 1 ? 'section' : 'sections'} complete
          {position.next ? ` · now in ${position.unit?.label ?? position.next.lesson.level}` : ''}
        </Text>
        <View style={styles.unitList}>
          {units.map((unit) => (
            <View key={unit.id} style={styles.unitRow}>
              <Text style={styles.unitName} numberOfLines={1}>
                {unit.label}
              </Text>
              <View style={styles.unitBar}>
                <ProgressFill
                  value={unit.done / unit.lessons.length}
                  color={colors.accent}
                  track="rgba(19,18,17,0.06)"
                  height={6}
                />
              </View>
              <Text style={styles.unitCount}>
                {unit.done}/{unit.lessons.length}
              </Text>
            </View>
          ))}
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
          accessibilityLabel="Change test date"
          onPress={() => router.push('/test-date' as Href)}
          style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="calendar-clock" size={24} />
          <View style={styles.rowCopy}>
            <Text style={styles.eyebrow}>Test date · {formatTestDate(testDate)}</Text>
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
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    marginHorizontal: 18,
    marginTop: 10,
    padding: 18,
  },
  eyebrow: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  big: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 22, lineHeight: 28 },
  meta: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 14, lineHeight: 20 },
  unitList: { gap: 8, marginTop: 4 },
  unitRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  unitName: { color: Palette.ink, flex: 1.4, fontFamily: VokaFonts.bodyMedium, fontSize: 13 },
  unitBar: { flex: 1, flexDirection: 'row' },
  unitCount: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: 12,
    minWidth: 28,
    textAlign: 'right',
  },
  link: { alignItems: 'center', flexDirection: 'row', gap: 4, minHeight: 44 },
  linkText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 15 },
  stats: { flexDirection: 'row', gap: 10, marginHorizontal: 18, marginTop: 12 },
  stat: { backgroundColor: Palette.white, borderRadius: 18, flex: 1, gap: 2, padding: 14 },
  statValue: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 22 },
  statLabel: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  statDetail: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 12 },
  sectionTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: 18,
    marginHorizontal: 20,
    marginTop: 24,
  },
  note: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginHorizontal: 22,
  },
  row: { alignItems: 'center', flexDirection: 'row' },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 16 },
  signal: { borderTopColor: Palette.line, borderTopWidth: 1, gap: 2, paddingTop: 10 },
  others: { gap: 8, marginHorizontal: 18, marginTop: 10, marginBottom: 18 },
  other: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    padding: 12,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  badgeText: { fontFamily: VokaFonts.bodyBold, fontSize: 13 },
  pressed: { opacity: 0.7 },
});
