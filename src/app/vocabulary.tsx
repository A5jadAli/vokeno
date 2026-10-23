import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, HeaderBack } from '@/components/voka-ui';
import { LessonAudioButton } from '@/components/lesson-audio-button';
import { FontSize, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import { useLessonAudio } from '@/features/audio/use-lesson-audio';
import { vocabularyDeck } from '@/features/audio/spoken-texts';
import { useCoachingStore } from '@/features/coaching/store';

export default function VocabularyScreen() {
  const router = useRouter();
  const speech = useLessonAudio('DE');
  const { prefetch } = speech;
  useEffect(() => prefetch(vocabularyDeck.map((card) => ({ text: card.word }))), [prefetch]);
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const words = vocabularyDeck;
  const current = words[index];
  const move = (direction: number) => {
    speech.stop();
    setIndex((value) => Math.max(0, Math.min(words.length - 1, value + direction)));
    setFlipped(false);
  };
  const isLast = index === words.length - 1;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dx) > 20,
        onPanResponderRelease: (_event, gesture) => {
          if (gesture.dx > 55) move(-1);
          if (gesture.dx < -55) move(1);
        },
      }),
    // The gesture only needs the stable move behavior for this finite deck.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <AppScreen showNav={false}>
      <View style={styles.header}>
        <HeaderBack variant="close" />
        <View style={styles.progressDots}>
          {words.map((word, dot) => (
            <View
              key={word.word}
              style={[
                styles.dot,
                dot < index && styles.dotDone,
                dot === index && styles.dotCurrent,
              ]}
            />
          ))}
        </View>
        <View style={styles.spacer} />
      </View>
      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Flip vocabulary card"
          onPress={() => setFlipped((value) => !value)}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          {...panResponder.panHandlers}
        >
          <View style={styles.cardTop}>
            <Text style={styles.article}>{current.article}</Text>
          </View>
          <Text style={styles.word}>{flipped ? current.meaning : current.word}</Text>
          <Text style={styles.pronunciation}>
            {flipped ? current.example : current.pronunciation}
          </Text>
          <View style={styles.divider} />
          <View style={styles.translationRow}>
            <View style={styles.receipt}>
              <MaterialCommunityIcons color={Palette.muted} name="receipt-text-outline" size={20} />
            </View>
            <View>
              <Text style={styles.translation}>{current.meaning}</Text>
              <Text style={styles.example}>{current.example}</Text>
            </View>
          </View>
        </Pressable>
        <View style={{ alignSelf: 'stretch', marginTop: space(3) }}>
          <LessonAudioButton speech={speech} text={current.word} label={`Hear ${current.word}`} />
        </View>
        <View style={styles.swipeHint}>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-left" size={18} />
          <Text style={styles.hint}>Swipe between cards · tap card to flip</Text>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={18} />
        </View>
        <Pressable
          accessibilityLabel={isLast ? 'Finish vocabulary deck' : 'Next vocabulary card'}
          accessibilityRole="button"
          onPress={() => {
            useCoachingStore.getState().recordPractice('review', 'DE');
            if (isLast) router.replace('/sprint?track=DE');
            else move(1);
          }}
          style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
        >
          <Text style={styles.nextButtonText}>{isLast ? 'Finish deck' : 'Next card'}</Text>
          <MaterialCommunityIcons color={Palette.cream} name="chevron-right" size={21} />
        </Pressable>
        <Text style={styles.hint}>Practise it with the live coach</Text>
        <Pressable
          accessibilityLabel="Open German pronunciation coach"
          onPress={() => router.push('/conversation?track=DE')}
          style={({ pressed }) => [styles.mic, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.lime} name="microphone" size={34} />
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: space(4),
  },
  spacer: { width: 40 },
  progressDots: { flexDirection: 'row', gap: space(1) },
  dot: { backgroundColor: Palette.handle, borderRadius: Radius.pill, height: 8, width: 8 },
  dotDone: { backgroundColor: Palette.yellowDeep },
  dotCurrent: { backgroundColor: Palette.ink },
  content: { alignItems: 'center', flex: 1, paddingHorizontal: space(6) },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginTop: space(1),
    padding: space(7),
    width: '100%',
  },
  cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  article: {
    backgroundColor: Palette.yellowTint,
    borderRadius: Radius.pill,
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
  word: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.display,
    marginTop: space(5),
  },
  pronunciation: {
    color: Palette.muted,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    marginTop: space(2),
  },
  divider: { backgroundColor: Palette.line, height: 1, marginVertical: space(6) },
  translationRow: { alignItems: 'center', flexDirection: 'row', gap: space(4) },
  receipt: {
    alignItems: 'center',
    backgroundColor: Palette.soft,
    borderRadius: Radius.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  translation: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.title },
  example: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    marginTop: space(1),
  },
  hint: {
    color: Palette.muted,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    marginTop: space(6),
  },
  swipeHint: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  nextButton: {
    alignItems: 'center',
    backgroundColor: Palette.ink,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(1),
    justifyContent: 'center',
    marginTop: space(4),
    minHeight: 50,
    paddingHorizontal: space(6),
  },
  nextButtonText: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  mic: {
    alignItems: 'center',
    backgroundColor: Palette.ink,
    borderColor: Palette.ink,
    borderRadius: Radius.pill,
    borderWidth: 12,
    height: 104,
    justifyContent: 'center',
    marginTop: space(4),
    width: 104,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
