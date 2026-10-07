import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

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

  return (
    <View style={styles.wrap}>
      <View accessibilityRole="radiogroup" style={variant === 'chips' ? styles.chips : styles.list}>
        {choices.map((option) => {
          const selected = choice === option.value;
          const label =
            variant === 'chips' && option.value === 'off'
              ? 'Not now'
              : option.time
                ? `${option.label} · ${option.time}`
                : option.label;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={label}
              onPress={() => void pick(option.value)}
              style={({ pressed }) => [
                variant === 'chips' ? styles.chip : styles.row,
                variant === 'chips' && selected && styles.chipSelected,
                pressed && styles.pressed,
              ]}
            >
              {variant === 'list' ? (
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
              ) : null}
              <Text
                style={[
                  variant === 'chips' ? styles.chipText : styles.rowText,
                  variant === 'chips' && selected && styles.chipTextSelected,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {blocked ? (
        <Text accessibilityRole="alert" style={styles.blocked}>
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
      ) : null}
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
  list: { gap: 2 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12, minHeight: 48 },
  rowText: { color: Palette.ink, flex: 1, fontFamily: VokaFonts.bodyMedium, fontSize: 16 },
  radio: {
    alignItems: 'center',
    borderColor: Palette.muted,
    borderRadius: 99,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  radioSelected: { borderColor: Palette.ink },
  radioDot: { backgroundColor: Palette.ink, borderRadius: 99, height: 10, width: 10 },
  blocked: { color: '#8E2D1B', fontFamily: VokaFonts.bodyMedium, fontSize: 13, lineHeight: 19 },
  link: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, textDecorationLine: 'underline' },
  pressed: { opacity: 0.7 },
});
