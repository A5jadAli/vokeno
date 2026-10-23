import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, FontSize, LineHeight, Palette, Radius, space, VokaFonts } from '@/constants/theme';

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
    gap: space(4),
    minHeight: 56,
    paddingHorizontal: space(4),
    paddingVertical: space(3),
  },
  divider: { borderBottomColor: Palette.line, borderBottomWidth: 1 },
  radio: {
    alignItems: 'center',
    borderColor: Palette.muted,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  radioSelected: { borderColor: Brand.accent },
  radioDot: { backgroundColor: Brand.accent, borderRadius: Radius.pill, height: 12, width: 12 },
  copy: { flex: 1, gap: space(0.5) },
  label: { color: Palette.ink, fontFamily: VokaFonts.bodyMedium, fontSize: FontSize.body },
  description: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  value: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium, fontSize: FontSize.label },
  pressed: { opacity: 0.7 },
});
