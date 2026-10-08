import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { RadioRow } from '@/components/radio-row';
import { Palette, VokaFonts } from '@/constants/theme';
import {
  remindersSupported,
  requestReminderPermission,
} from '@/features/habits/reminder-scheduler';
import { reminderSlots, useReminderStore, type ReminderChoice } from '@/features/habits/reminders';

const choices: { value: ReminderChoice; label: string; time?: string }[] = [
  ...(Object.keys(reminderSlots) as (keyof typeof reminderSlots)[]).map((slot) => ({
    value: slot,
    label: reminderSlots[slot].label,
    time: reminderSlots[slot].time,
  })),
  { value: 'off', label: 'No reminders' },
];

/**
 * Pick a daily reminder time. Turning reminders on asks for notification permission; if the
 * phone blocks it, the learner sees why and how to fix it instead of a silent failure.
 */
export function ReminderPicker({ variant }: { variant: 'chips' | 'list' }) {
  const choice = useReminderStore((state) => state.choice);
  const setChoice = useReminderStore((state) => state.setChoice);
  const [blocked, setBlocked] = useState(false);
  if (!remindersSupported) return null;

  const pick = async (value: ReminderChoice) => {
    setBlocked(false);
    if (value === 'off') {
      setChoice('off');
      return;
    }
    const granted = await requestReminderPermission().catch(() => false);
    if (granted) setChoice(value);
    else {
      setChoice('off');
      setBlocked(true);
    }
  };

  const message = blocked ? (
    <Text
      accessibilityRole="alert"
      style={[styles.blocked, variant === 'list' && styles.blockedInCard]}
    >
      Notifications are turned off for Vokeno.{' '}
      <Text
        accessibilityRole="link"
        onPress={() => void Linking.openSettings()}
        style={styles.link}
      >
        Open phone settings
      </Text>{' '}
      to allow them, then choose a time again.
    </Text>
  ) : null;

  if (variant === 'list')
    return (
      <View accessibilityRole="radiogroup">
        {choices.map((option, index) => (
          <RadioRow
            key={option.value}
            label={option.label}
            value={option.time}
            selected={choice === option.value}
            last={index === choices.length - 1 && !blocked}
            onPress={() => void pick(option.value)}
          />
        ))}
        {message}
      </View>
    );

  return (
    <View style={styles.wrap}>
      <View accessibilityRole="radiogroup" style={styles.chips}>
        {choices.map((option) => {
          const selected = choice === option.value;
          const label =
            option.value === 'off'
              ? 'Not now'
              : option.time
                ? `${option.label} · ${option.time}`
                : option.label;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              accessibilityLabel={label}
              onPress={() => void pick(option.value)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      {message}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderColor: Palette.line,
    borderRadius: 99,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 14,
  },
  chipSelected: { backgroundColor: Palette.ink, borderColor: Palette.ink },
  chipText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  chipTextSelected: { color: Palette.cream },
  blocked: { color: '#8E2D1B', fontFamily: VokaFonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  blockedInCard: { padding: 16 },
  link: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, textDecorationLine: 'underline' },
  pressed: { opacity: 0.7 },
});
