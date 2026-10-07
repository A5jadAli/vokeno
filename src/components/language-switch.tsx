import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, VokaFonts } from '@/constants/theme';
import {
  languageDetails,
  languageTracks,
  trackColors,
  type LanguageTrack,
} from '@/features/language/config';

/**
 * The one language picker used across the app: a row of chips, like the filter chips in
 * WhatsApp. The selected chip takes that language's colour.
 */
export function LanguageSwitch({
  track,
  onChange,
  groupLabel,
  itemLabel = (name) => name,
  show = 'native',
  tone = 'light',
  role = 'button',
  disabled = false,
}: {
  track: LanguageTrack;
  onChange: (track: LanguageTrack) => void;
  /** Read by screen readers for the whole row, e.g. "Conversation language". */
  groupLabel: string;
  /** Accessible name of each chip, from the language's English name. */
  itemLabel?: (name: string) => string;
  /** `native` shows Español; `code` shows ES for tight headers. */
  show?: 'native' | 'code';
  tone?: 'light' | 'dark';
  role?: 'button' | 'radio';
  disabled?: boolean;
}) {
  const dark = tone === 'dark';
  return (
    <View
      accessibilityLabel={groupLabel}
      accessibilityRole={role === 'radio' ? 'radiogroup' : undefined}
      style={styles.row}
    >
      {languageTracks.map((item) => {
        const selected = item === track;
        const colors = trackColors[item];
        return (
          <Pressable
            key={item}
            accessibilityLabel={itemLabel(languageDetails[item].name)}
            accessibilityRole={role}
            accessibilityState={
              role === 'radio' ? { checked: selected, disabled } : { selected, disabled }
            }
            // React Native Web does not map accessibilityState to ARIA on its own.
            aria-checked={role === 'radio' ? selected : undefined}
            aria-pressed={role === 'button' ? selected : undefined}
            aria-disabled={disabled}
            disabled={disabled}
            hitSlop={4}
            onPress={() => onChange(item)}
            style={({ pressed }) => [
              styles.chip,
              dark ? styles.chipDark : styles.chipLight,
              selected && { backgroundColor: colors.accent, borderColor: colors.accent },
              pressed && !selected && styles.pressed,
              disabled && !selected && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: dark ? Palette.cream : Palette.ink },
                selected && { color: colors.onAccent },
              ]}
            >
              {show === 'code' ? item : languageDetails[item].nativeName}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    alignItems: 'center',
    borderRadius: 99,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 14,
  },
  chipLight: { backgroundColor: Palette.white, borderColor: Palette.line },
  chipDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  label: { fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.45 },
});
