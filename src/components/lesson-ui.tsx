import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ComponentProps, type PropsWithChildren } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type TextInputProps } from 'react-native';
import Animated, { FadeIn, SlideInDown, ZoomIn } from 'react-native-reanimated';

import { useAccentColors } from '@/components/accent-context';
import { AudioIconButton } from '@/components/lesson-audio-button';
import { ProgressFill, Tactile } from '@/components/motion';
import {
  Feedback,
  FontSize,
  LineHeight,
  OnDark,
  Palette,
  Radius,
  Selection,
  space,
  VokaFonts,
} from '@/constants/theme';
import type { LessonAudio } from '@/features/audio/use-lesson-audio';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * Settings for a box where the learner types an answer: no autocorrect, no autofill and, on
 * Android, no suggestion bar (Gboard ignores the plain flag in multi-line boxes, so the
 * visible-password keyboard is used: letters, umlauts by long press, but no suggestions).
 */
export const answerInputProps: TextInputProps = {
  autoCorrect: false,
  autoComplete: 'off',
  spellCheck: false,
  importantForAutofill: 'no',
  keyboardType: Platform.OS === 'android' ? 'visible-password' : 'default',
};

const feedbackLooks = {
  correct: {
    bg: Feedback.correctBg,
    accent: Feedback.correctFill,
    onAccent: Palette.white,
    ink: Feedback.correctText,
    icon: 'check-bold',
  },
  wrong: {
    bg: Feedback.wrongBg,
    accent: Feedback.wrongFill,
    onAccent: Palette.white,
    ink: Feedback.wrongText,
    icon: 'close-thick',
  },
  close: {
    bg: Feedback.closeBg,
    accent: Feedback.closeAccent,
    // White on this amber is 2.24:1; ink reads at 8:1.
    onAccent: Palette.ink,
    ink: Feedback.closeInk,
    icon: 'lightbulb-on',
  },
} as const;

/** Close control, a thin progress bar and an optional label, as in modern lesson players. */
/** Close, then the session's progress. Without `progress` (nothing to go through) only the close shows. */
export function LessonTopBar({ progress, label }: { progress?: number; label?: string }) {
  const accent = useAccentColors();
  const router = useRouter();
  const value = Math.max(0, Math.min(1, progress ?? 0));
  return (
    <View style={styles.topBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={8}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        style={({ pressed }) => [styles.close, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons name="close" size={24} color={Palette.ink} />
      </Pressable>
      {progress === undefined ? null : (
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
          style={styles.track}
        >
          <ProgressFill value={value} color={accent?.deep ?? Palette.ink} track={Palette.soft} />
        </View>
      )}
      {label ? <Text style={styles.topLabel}>{label}</Text> : null}
    </View>
  );
}

export { PrimaryAccent } from '@/components/accent-context';

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  tone = 'primary',
  icon,
  accessibilityLabel,
  accessibilityRole,
  busy = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  /** Every action is ink. `secondary` is the quieter of two side-by-side choices. */
  tone?: 'primary' | 'secondary';
  icon?: IconName;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
  busy?: boolean;
}) {
  const look = {
    primary: { face: Palette.ink, ink: Palette.cream, border: undefined },
    secondary: { face: Palette.white, ink: Palette.ink, border: Palette.border },
  }[tone];
  const face = disabled ? Palette.disabled : look.face;
  const ink = disabled ? Palette.muted : look.ink;
  return (
    <Tactile
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole={accessibilityRole}
      accessibilityState={busy ? { busy } : undefined}
      disabled={disabled}
      onPress={onPress}
      face={face}
      borderColor={look.border}
      borderWidth={look.border ? 1.5 : 0}
      radius={Radius.lg}
    >
      <View style={styles.primary}>
        {/* Wraps rather than shrinking, so the phone's larger text setting is kept. */}
        <Text
          numberOfLines={2}
          style={[styles.primaryText, { color: ink, flexShrink: 1, textAlign: 'center' }]}
        >
          {title}
        </Text>
        {icon ? <MaterialCommunityIcons name={icon} size={20} color={ink} /> : null}
      </View>
    </Tactile>
  );
}

/** A quiet secondary action: a soft pill rather than an underlined web-style link. */
export function TextButton({
  title,
  onPress,
  icon,
  disabled = false,
  expanded,
}: {
  title: string;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  expanded?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled, expanded }}
      aria-expanded={expanded}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.textButton,
        pressed && styles.softPressed,
        disabled && { opacity: 0.45 },
      ]}
    >
      {icon ? <MaterialCommunityIcons name={icon} size={18} color={Palette.ink} /> : null}
      <Text
        numberOfLines={2}
        style={[styles.textButtonLabel, { flexShrink: 1, textAlign: 'center' }]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

/**
 * Sticky bottom area. With `feedback`, it becomes a result sheet that rises from the bottom: a
 * badge that pops in, a short verdict and the reason, above the next action.
 */
export function ActionBar({
  children,
  feedback,
}: PropsWithChildren<{
  feedback?: { tone: 'correct' | 'wrong' | 'close'; title: string; message?: string };
}>) {
  if (!feedback) return <View style={[styles.actionBar, styles.actionBorder]}>{children}</View>;
  const look = feedbackLooks[feedback.tone];
  return (
    <Animated.View
      key={`${feedback.tone}-${feedback.title}`}
      entering={SlideInDown.springify().damping(20).stiffness(220)}
      style={[styles.actionBar, styles.sheet, { backgroundColor: look.bg }]}
    >
      <View accessibilityLiveRegion="polite" style={styles.feedbackCopy}>
        <View style={styles.feedbackHeading}>
          <Animated.View
            entering={ZoomIn.delay(90).springify().damping(11)}
            style={[styles.feedbackBadge, { backgroundColor: look.accent }]}
          >
            <MaterialCommunityIcons name={look.icon} size={22} color={look.onAccent} />
          </Animated.View>
          <Text accessibilityRole="header" style={[styles.feedbackTitle, { color: look.ink }]}>
            {feedback.title}
          </Text>
        </View>
        {feedback.message ? (
          <Animated.Text
            entering={FadeIn.delay(120).duration(200)}
            style={[styles.feedbackMessage, { color: look.ink }]}
          >
            {feedback.message}
          </Animated.Text>
        ) : null}
      </View>
      {children}
    </Animated.View>
  );
}

/** A full-width tappable row: icon, title, optional subtitle and a chevron. */
export function ActionRow({
  icon,
  title,
  subtitle,
  onPress,
  accent = Palette.soft,
  selected = false,
  trailing,
  choice = false,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  accent?: string;
  selected?: boolean;
  trailing?: string;
  /** One option in a pick-one list: shows a radio mark instead of a navigation chevron. */
  choice?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={choice ? 'radio' : 'button'}
      accessibilityLabel={subtitle ? `${title}: ${subtitle}` : title}
      accessibilityState={choice ? { checked: selected } : { selected }}
      aria-checked={choice ? selected : undefined}
      aria-pressed={choice ? undefined : selected}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && { borderColor: Selection.border, backgroundColor: Selection.face },
        pressed && styles.softPressed,
      ]}
    >
      {icon ? (
        <View style={[styles.rowIcon, { backgroundColor: accent }]}>
          <MaterialCommunityIcons name={icon} size={22} color={Palette.ink} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: space(0.5) }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ? <Text style={styles.rowTrailing}>{trailing}</Text> : null}
      {/* Pick-one options use the same radio mark as answer choices; ✓ is kept for "correct". */}
      <MaterialCommunityIcons
        name={
          choice
            ? selected
              ? 'radiobox-marked'
              : 'radiobox-blank'
            : selected
              ? 'check-circle'
              : 'chevron-right'
        }
        size={22}
        color={selected ? Palette.ink : Palette.muted}
      />
    </Pressable>
  );
}

export function InfoCard({
  icon,
  title,
  children,
  tone = 'white',
}: PropsWithChildren<{
  icon: IconName;
  title: string;
  /** `quiet` (canvas) is for explanations beside dialogue, so they never look like speech. */
  tone?: 'white' | 'tint' | 'quiet' | 'ink';
}>) {
  const dark = tone === 'ink';
  const accent = useAccentColors();
  return (
    <View
      style={[
        styles.info,
        tone === 'tint' && { backgroundColor: accent?.tint ?? Palette.canvas },
        tone === 'quiet' && { backgroundColor: Palette.canvas },
        dark && { backgroundColor: Palette.ink },
      ]}
    >
      <View style={styles.infoHeading}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={dark ? (accent?.onDark ?? Palette.cream) : Palette.ink}
        />
        <Text style={[styles.infoTitle, dark && { color: Palette.cream }]}>{title}</Text>
      </View>
      {typeof children === 'string' ? (
        <Text style={[styles.infoText, dark && { color: OnDark.textSecondary }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function PhraseCard({
  phrase,
  speech,
}: {
  phrase: { target: string; meaning: string; use: string };
  speech: LessonAudio;
}) {
  return (
    <View style={styles.phrase}>
      <View style={styles.phraseRow}>
        <View style={styles.phraseCopy}>
          <Text style={styles.phraseTarget}>{phrase.target}</Text>
          <Text style={styles.phraseMeaning}>{phrase.meaning}</Text>
        </View>
        <View style={styles.phraseAudio}>
          <AudioIconButton speech={speech} text={phrase.target} label={`Hear: ${phrase.target}`} />
          <AudioIconButton
            speech={speech}
            text={phrase.target}
            label={`Hear slowly: ${phrase.target}`}
            rate={0.6}
            slow
          />
        </View>
      </View>
      <Text style={styles.phraseUse}>{phrase.use}</Text>
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.section}>{children}</Text>;
}

export const lessonText = StyleSheet.create({
  title: {
    color: Palette.ink,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
  },
  lead: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  prompt: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
  },
  meta: {
    color: Palette.muted,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  small: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
});

const styles = StyleSheet.create({
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    paddingHorizontal: space(4),
    paddingVertical: space(2),
  },
  close: { alignItems: 'center', height: 44, justifyContent: 'center', width: 36 },
  track: { flex: 1, flexDirection: 'row' },
  topLabel: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
  },
  primary: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(2),
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: space(5),
  },
  primaryText: { fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  // A plain text action, like secondary actions in WhatsApp or Instagram: no fill, so it never
  // looks like an answer option or a second primary button.
  textButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(2),
    justifyContent: 'center',
    borderRadius: Radius.md,
    minHeight: 44,
    paddingHorizontal: space(3),
  },
  textButtonLabel: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
  },
  softPressed: { backgroundColor: Palette.pressed },
  actionBar: {
    backgroundColor: Palette.cream,
    gap: space(3),
    paddingBottom: space(4),
    paddingHorizontal: space(4),
    paddingTop: space(4),
  },
  actionBorder: { borderTopColor: Palette.line, borderTopWidth: 1 },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    boxShadow: `0 -6px 24px ${Palette.shadow}`,
    gap: space(4),
    paddingTop: space(5),
  },
  feedbackCopy: { gap: space(2) },
  feedbackHeading: { alignItems: 'center', flexDirection: 'row', gap: space(3) },
  feedbackBadge: {
    alignItems: 'center',
    borderRadius: Radius.xl,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  feedbackTitle: {
    flex: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.title,
    letterSpacing: -0.3,
  },
  feedbackMessage: {
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  info: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    gap: space(2),
    padding: space(4),
  },
  infoHeading: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  infoTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  infoText: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  phrase: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: space(2),
    padding: space(4),
  },
  phraseRow: { alignItems: 'flex-start', flexDirection: 'row', gap: space(3) },
  phraseCopy: { flex: 1, gap: space(1) },
  phraseTarget: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
  },
  phraseMeaning: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  phraseAudio: { flexDirection: 'row', gap: space(2) },
  phraseUse: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  section: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    marginTop: space(2),
  },
  row: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: 'transparent',
    borderRadius: Radius.lg,
    borderWidth: 2,
    flexDirection: 'row',
    gap: space(3),
    minHeight: 64,
    paddingHorizontal: space(4),
    paddingVertical: space(3),
  },
  rowIcon: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  rowTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  rowSubtitle: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  rowTrailing: {
    color: Palette.muted,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
  },
  pressed: { opacity: 0.75 },
});
