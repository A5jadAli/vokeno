import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Palette, VokaFonts } from '@/constants/theme';
import type { StreakSummary, WeekDayState } from '@/features/habits/practice-log';
import { trackColors, type LanguageTrack } from '@/features/language/config';

const stateNames: Record<WeekDayState, string> = {
  done: 'practised',
  rest: 'rest day',
  missed: 'no practice',
  today: 'today, not yet practised',
  future: 'coming up',
  before: 'before you started',
};

function caption(streak: StreakSummary) {
  if (streak.current === 0)
    return streak.best > 0
      ? `Your best is ${streak.best} days. Start a new run today.`
      : 'Practise today to start a streak.';
  if (!streak.practisedToday) return 'Practise today to keep it going.';
  if (streak.current >= streak.best && streak.current > 1) return 'Your best run yet. Nice.';
  return streak.restDays > 0
    ? 'Done for today. A missed day was covered as a rest day.'
    : 'Done for today.';
}

/** The honest streak: practice days in a row, with at most one rest day a week. */
export function StreakStrip({
  streak,
  week,
  track,
}: {
  streak: StreakSummary;
  week: { day: string; label: string; state: WeekDayState }[];
  track: LanguageTrack;
}) {
  const colors = trackColors[track];
  const lit = streak.current > 0;
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View
          accessible
          accessibilityLabel={`${streak.current}-day streak. Best ${streak.best} days.`}
          style={styles.count}
        >
          <MaterialCommunityIcons
            color={lit ? Palette.orange : Palette.muted}
            name="fire"
            size={24}
          />
          <Text style={styles.number}>{streak.current}</Text>
          <Text style={styles.unit}>{streak.current === 1 ? 'day' : 'days'}</Text>
        </View>
        {streak.best > streak.current ? <Text style={styles.best}>Best {streak.best}</Text> : null}
      </View>
      <View style={styles.week}>
        {week.map((day) => (
          <View
            key={day.day}
            accessible
            accessibilityLabel={`${day.day}: ${stateNames[day.state]}`}
            style={styles.day}
          >
            <View
              style={[
                styles.dot,
                day.state === 'done' && { backgroundColor: colors.accent },
                day.state === 'today' && { borderColor: colors.accent, borderWidth: 2 },
                day.state === 'rest' && styles.rest,
                (day.state === 'future' || day.state === 'before') && styles.future,
              ]}
            >
              {day.state === 'done' ? (
                <MaterialCommunityIcons color={colors.onAccent} name="check" size={14} />
              ) : day.state === 'rest' ? (
                <MaterialCommunityIcons color={Palette.secondary} name="sleep" size={13} />
              ) : null}
            </View>
            <Text style={[styles.label, day.state === 'today' && styles.labelToday]}>
              {day.label}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.caption}>{caption(streak)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    marginHorizontal: 18,
    padding: 16,
  },
  top: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  count: { alignItems: 'baseline', flexDirection: 'row', gap: 4 },
  number: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 22 },
  unit: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  best: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium, fontSize: 13 },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: 4 },
  dot: {
    alignItems: 'center',
    backgroundColor: Palette.soft,
    borderRadius: 99,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  rest: { backgroundColor: Palette.canvas },
  future: { backgroundColor: 'transparent', borderColor: Palette.line, borderWidth: 1 },
  label: { color: Palette.muted, fontFamily: VokaFonts.bodySemiBold, fontSize: 12 },
  labelToday: { color: Palette.ink },
  caption: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 13, lineHeight: 18 },
});
