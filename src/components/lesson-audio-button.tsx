import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Dark,
  FontSize,
  LineHeight,
  Palette,
  Radius,
  Selection,
  space,
  VokaFonts,
} from '@/constants/theme';
import type { LessonAudio } from '@/features/audio/use-lesson-audio';
import { useAccentColors } from '@/components/accent-context';

/** Label and status space stay mounted, so starting/stopping never moves the target. */
export function LessonAudioButton({
  speech,
  text,
  label,
  rate = 0.82,
  dark = false,
}: {
  speech: LessonAudio;
  text: string;
  label: string;
  rate?: number;
  dark?: boolean;
}) {
  const ownsAudio = speech.activeText === text && speech.activeRate === rate;
  const active = ownsAudio && speech.busy;
  const loading = active && speech.loading;
  const error = ownsAudio ? speech.error : '';
  const color = dark && !active ? Palette.cream : Palette.ink;
  const status = loading ? 'Preparing audio...' : active ? 'Playing audio' : 'Tap to listen';
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={
          active ? (loading ? 'Preparing audio. Tap to cancel.' : 'Playing. Tap to stop.') : status
        }
        accessibilityState={{ busy: loading, selected: active }}
        aria-busy={loading}
        aria-pressed={active}
        onPress={() => (active ? speech.stop() : void speech.play(text, rate))}
        style={({ pressed }) => [
          styles.button,
          dark && styles.dark,
          active && styles.active,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.icon}>
          {loading ? (
            <ActivityIndicator size="small" color={color} />
          ) : (
            <MaterialCommunityIcons
              name={active ? 'stop' : 'volume-high'}
              size={22}
              color={color}
            />
          )}
        </View>
        <View style={styles.copy}>
          <Text style={[styles.label, { color }]}>{label}</Text>
          <Text accessibilityLiveRegion="polite" style={[styles.status, { color }]}>
            {status}
          </Text>
        </View>
      </Pressable>
      {error ? (
        <Text accessibilityRole="alert" style={[styles.error, dark && { color: Palette.cream }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: space(2) },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    // White with a border, so it reads as a control rather than a disabled grey block.
    backgroundColor: Palette.white,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Palette.border,
    padding: space(3),
    minHeight: 76,
  },
  dark: { backgroundColor: Dark.raised, borderColor: 'transparent' },
  active: { backgroundColor: Selection.faceStrong, borderColor: Selection.border },
  pressed: { opacity: 0.8 },
  icon: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: space(1) },
  label: {
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  status: {
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  error: {
    fontFamily: VokaFonts.body,
    color: Palette.secondary,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  round: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    backgroundColor: Palette.soft,
  },
  roundAccent: { backgroundColor: Palette.ink },
  roundActive: {
    backgroundColor: Selection.faceStrong,
    borderWidth: 2,
    borderColor: Selection.border,
  },
});

/** A compact round play control for dense lists; slow playback uses a tortoise icon. */
export function AudioIconButton({
  speech,
  text,
  label,
  rate = 0.9,
  slow = false,
  size = 44,
  tone = 'light',
}: {
  speech: LessonAudio;
  text: string;
  label: string;
  rate?: number;
  slow?: boolean;
  size?: number;
  tone?: 'light' | 'accent';
}) {
  const active = speech.activeText === text && speech.activeRate === rate && speech.busy;
  const loading = active && speech.loading;
  const accent = tone === 'accent';
  // The accent play button takes the language's colour on a language screen.
  const colors = useAccentColors();
  const filled = accent && !active && colors;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: loading, selected: active }}
      aria-busy={loading}
      aria-pressed={active}
      hitSlop={6}
      onPress={() => (active ? speech.stop() : void speech.play(text, rate))}
      style={({ pressed }) => [
        styles.round,
        { width: size, height: size },
        accent && styles.roundAccent,
        filled && { backgroundColor: Palette.ink },
        active && styles.roundActive,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Palette.ink} />
      ) : (
        <MaterialCommunityIcons
          name={active ? 'stop' : slow ? 'tortoise' : 'volume-high'}
          size={Math.round(size * 0.46)}
          color={accent && !active ? Palette.cream : Palette.ink}
        />
      )}
    </Pressable>
  );
}
