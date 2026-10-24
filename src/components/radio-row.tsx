import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, LineHeight, Palette, Selection, space, VokaFonts } from '@/constants/theme';

/**
 * One choice in a pick-one list inside a settings card: label, optional description, optional
 * value, then the app's one radio mark on the right (as on every pick-one list), divider between.
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
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      <MaterialCommunityIcons
        color={selected ? Selection.border : Palette.muted}
        name={selected ? 'radiobox-marked' : 'radiobox-blank'}
        size={24}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    minHeight: 56,
    paddingHorizontal: space(4),
    paddingVertical: space(3),
  },
  divider: { borderBottomColor: Palette.line, borderBottomWidth: 1 },
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
