import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, LineHeight, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import type { StreakSummary, WeekDayState } from '@/features/habits/practice-log';

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
  if (streak.current >= streak.best && streak.current > 1)
    // The card shows the number already.
    return 'Your longest run so far.';
  // The streak only knows that you practised; whether today's session is done is shown above.
  return streak.restDays > 0
    ? 'You practised today. A missed day was covered as a rest day.'
    : 'You practised today.';
}

const streakLabel = (streak: StreakSummary) =>
  `${streak.current}-day streak. Best ${streak.best} days.`;

/** The streak as a small chip for a header: a flame and the number of days. */
export function StreakChip({ streak, onPress }: { streak: StreakSummary; onPress: () => void }) {
  const lit = streak.current > 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={streakLabel(streak)}
      accessibilityHint="Opens your progress"
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, lit && styles.chipLit, pressed && styles.pressed]}
    >
      {/* Lit and unlit differ by shape, not only colour: a filled flame, or an outline. */}
      <Ionicons
        color={lit ? Palette.ink : Palette.muted}
        name={lit ? 'flame' : 'flame-outline'}
        size={20}
      />
      <Text style={styles.chipNumber}>{streak.current}</Text>
    </Pressable>
  );
}

/** The honest streak: practice days in a row, with at most one rest day a week. */
export function StreakStrip({
  streak,
  week,
  showCount = true,
}: {
  streak: StreakSummary;
  week: { day: string; label: string; state: WeekDayState }[];
  /** Off where the count is already shown, as in the Today header. */
  showCount?: boolean;
}) {
  const lit = streak.current > 0;
  return (
    <View style={styles.card}>
      {showCount ? (
        <View style={styles.top}>
          <View accessible accessibilityLabel={streakLabel(streak)} style={styles.count}>
            <Ionicons
              color={lit ? Palette.ink : Palette.muted}
              name={lit ? 'flame' : 'flame-outline'}
              size={24}
            />
            <Text style={styles.number}>{streak.current}</Text>
            <Text style={styles.unit}>{streak.current === 1 ? 'day' : 'days'}</Text>
          </View>
          {streak.best > streak.current ? (
            <Text style={styles.best}>Best {streak.best}</Text>
          ) : null}
        </View>
      ) : null}
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
                // Ink, not a language colour: the streak counts days in any language.
                day.state === 'done' && { backgroundColor: Palette.ink },
                day.state === 'today' && { borderColor: Palette.ink, borderWidth: 2 },
                day.state === 'rest' && styles.rest,
                (day.state === 'future' || day.state === 'before') && styles.future,
              ]}
            >
              {day.state === 'done' ? (
                <MaterialCommunityIcons color={Palette.cream} name="check" size={14} />
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
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: space(3),
    marginHorizontal: space(4),
    padding: space(4),
  },
  top: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  count: { alignItems: 'baseline', flexDirection: 'row', gap: space(1) },
  number: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.title },
  unit: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.label },
  best: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium, fontSize: FontSize.label },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: space(1) },
  dot: {
    alignItems: 'center',
    backgroundColor: Palette.soft,
    borderRadius: Radius.pill,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  rest: { backgroundColor: Palette.canvas },
  future: { backgroundColor: 'transparent', borderColor: Palette.line, borderWidth: 1 },
  label: { color: Palette.muted, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.caption },
  labelToday: { color: Palette.ink },
  caption: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: space(1),
    height: 44,
    paddingLeft: space(3),
    paddingRight: space(4),
  },
  chipLit: { backgroundColor: Palette.white },
  chipNumber: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  pressed: { opacity: 0.7 },
});
