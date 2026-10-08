import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, VokaFonts } from '@/constants/theme';

/**
 * One choice in a pick-one list inside a settings card, like WhatsApp's settings rows: label,
 * optional description, optional value on the right, divider between rows.
 */
export function RadioRow({
  label,
  description,
  value,
  selected,
  last = false,
  accessibilityLabel,
  onPress,
}: {
  label: string;
  description?: string;
  value?: string;
  selected: boolean;
  last?: boolean;
  accessibilityLabel?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      aria-checked={selected}
      accessibilityLabel={accessibilityLabel ?? (value ? `${label} · ${value}` : label)}
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: { borderBottomColor: Palette.line, borderBottomWidth: 1 },
  radio: {
    alignItems: 'center',
    borderColor: Palette.muted,
    borderRadius: 99,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  radioSelected: { borderColor: Palette.orange },
  radioDot: { backgroundColor: Palette.orange, borderRadius: 99, height: 12, width: 12 },
  copy: { flex: 1, gap: 2 },
  label: { color: Palette.ink, fontFamily: VokaFonts.bodyMedium, fontSize: 16 },
  description: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: 14,
    lineHeight: 19,
  },
  value: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium, fontSize: 14 },
  pressed: { opacity: 0.7 },
});
