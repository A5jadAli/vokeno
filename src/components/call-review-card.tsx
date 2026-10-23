import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AudioIconButton } from '@/components/lesson-audio-button';
import { Palette, VokaFonts, withAlpha } from '@/constants/theme';
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
              color={item.used ? accent : withAlpha(Palette.cream, 0.5)}
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
    backgroundColor: withAlpha(Palette.cream, 0.06),
    borderColor: withAlpha(Palette.cream, 0.14),
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  title: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: 18 },
  label: {
    color: withAlpha(Palette.cream, 0.6),
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    alignItems: 'center',
    borderColor: withAlpha(Palette.cream, 0.2),
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: Palette.cream, fontFamily: VokaFonts.bodyMedium, fontSize: 13 },
  note: {
    color: withAlpha(Palette.cream, 0.7),
    fontFamily: VokaFonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  body: { color: Palette.cream, fontFamily: VokaFonts.body, fontSize: 15, lineHeight: 22 },
  correction: { gap: 4, paddingVertical: 4 },
  said: {
    color: withAlpha(Palette.cream, 0.55),
    fontFamily: VokaFonts.body,
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
  betterRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  better: { flex: 1, fontFamily: VokaFonts.bodyBold, fontSize: 17 },
  why: { color: withAlpha(Palette.cream, 0.7), fontFamily: VokaFonts.body, fontSize: 13 },
  link: { alignItems: 'center', flexDirection: 'row', gap: 6, minHeight: 44 },
  linkText: { color: Palette.cream, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
});
