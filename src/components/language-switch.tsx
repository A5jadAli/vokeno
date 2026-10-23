import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, OnDark, Palette, Radius, Selection, space, VokaFonts } from '@/constants/theme';
import { languageDetails, languageTracks, type LanguageTrack } from '@/features/language/config';

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
              selected &&
                (dark
                  ? { backgroundColor: Palette.cream, borderColor: Palette.cream }
                  : { backgroundColor: Selection.border, borderColor: Selection.border }),
              pressed && !selected && styles.pressed,
              disabled && !selected && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: dark ? Palette.cream : Palette.ink },
                selected && { color: dark ? Palette.ink : Palette.cream },
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  chip: {
    alignItems: 'center',
    borderRadius: Radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: space(4),
  },
  chipLight: { backgroundColor: Palette.white, borderColor: Palette.line },
  chipDark: {
    backgroundColor: OnDark.fill,
    borderColor: OnDark.line,
  },
  label: { fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.label },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.45 },
});
