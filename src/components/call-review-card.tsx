import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AudioIconButton } from '@/components/lesson-audio-button';
import { FontSize, LineHeight, OnDark, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import type { CallReview } from '@/features/conversation/backend';
import type { LessonAudio } from '@/features/audio/use-lesson-audio';
import type { UnitCallPhrase } from '../../supabase/functions/_shared/unit-calls';

type Props = {
  review: CallReview | null;
  pending: boolean;
  error: string;
  phrases: (UnitCallPhrase & { used: boolean })[];
  /** False when the call was too short to judge, so no phrase was moved in review. */
  scheduled: boolean;
  speech: LessonAudio;
  accent: string;
};

/**
 * After a unit call: what to say differently, one tip, which of the unit's phrases came up, and
 * what the coach will remember. Phrases not used come back in tomorrow's review.
 */
export function CallReviewCard({
  review,
  pending,
  error,
  phrases,
  scheduled,
  speech,
  accent,
}: Props) {
  const router = useRouter();
  const avoided = phrases.filter((item) => !item.used);
  return (
    <Animated.View entering={FadeInDown.duration(260)} style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>
        Your call, reviewed
      </Text>

      <Text style={styles.label}>Phrases from the unit</Text>
      <View style={styles.chips}>
        {phrases.map((item) => (
          <View
            key={item.say}
            accessibilityLabel={`${item.say}: ${item.used ? 'used' : 'not used yet'}`}
            style={[styles.chip, item.used && { borderColor: accent }]}
          >
            <MaterialCommunityIcons
              name={item.used ? 'check' : 'circle-outline'}
              size={14}
              color={item.used ? accent : OnDark.textFaint}
            />
            <Text style={styles.chipText}>{item.say}</Text>
          </View>
        ))}
      </View>
      {!scheduled ? null : avoided.length ? (
        <Text style={styles.note}>
          The ones you did not use come back in tomorrow’s review, so they are fresh for next time.
        </Text>
      ) : (
        <Text style={styles.note}>You used every phrase from the unit. Nicely done.</Text>
      )}

      {pending ? (
        <Text style={styles.note}>Reviewing what you said…</Text>
      ) : error ? (
        <Text accessibilityRole="alert" style={styles.note}>
          {error}
        </Text>
      ) : review ? (
        <>
          <Text style={styles.label}>
            {review.corrections.length ? 'You said · People say' : 'Corrections'}
          </Text>
          {review.corrections.length ? (
            review.corrections.map((item) => (
              <View key={`${item.said}-${item.better}`} style={styles.correction}>
                <Text style={styles.said}>{item.said}</Text>
                <View style={styles.betterRow}>
                  <Text style={[styles.better, { color: accent }]}>{item.better}</Text>
                  <AudioIconButton
                    speech={speech}
                    text={item.better}
                    label={`Hear: ${item.better}`}
                    size={40}
                  />
                </View>
                <Text style={styles.why}>{item.why}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.note}>Nothing to correct this time.</Text>
          )}
          {review.tip ? (
            <>
              <Text style={styles.label}>Tip for next time</Text>
              <Text style={styles.body}>{review.tip}</Text>
            </>
          ) : null}
          {review.facts.length ? (
            <>
              <Text style={styles.label}>Your coach will remember</Text>
              {review.facts.map((fact) => (
                <Text key={fact} style={styles.body}>
                  · {fact}
                </Text>
              ))}
            </>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/coach-memory' as Href)}
            style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.linkText}>See or change what your coach remembers</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color={Palette.cream} />
          </Pressable>
        </>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: OnDark.fill,
    borderColor: OnDark.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: space(2),
    padding: space(4),
  },
  title: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  label: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    letterSpacing: 0.6,
    marginTop: space(2),
    textTransform: 'uppercase',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  chip: {
    alignItems: 'center',
    borderColor: OnDark.border,
    borderRadius: Radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: space(2),
    paddingHorizontal: space(2),
    paddingVertical: space(2),
  },
  chipText: { color: Palette.cream, fontFamily: VokaFonts.bodyMedium, fontSize: FontSize.label },
  note: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  body: {
    color: Palette.cream,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  correction: { gap: space(1), paddingVertical: space(1) },
  said: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    textDecorationLine: 'line-through',
  },
  betterRow: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  better: { flex: 1, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  why: { color: OnDark.textSecondary, fontFamily: VokaFonts.body, fontSize: FontSize.label },
  link: { alignItems: 'center', flexDirection: 'row', gap: space(2), minHeight: 44 },
  linkText: { color: Palette.cream, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.label },
});
