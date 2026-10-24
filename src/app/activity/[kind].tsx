import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import {
  Dark,
  Feedback,
  FontSize,
  LineHeight,
  OnDark,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
import { useLessonAudio } from '@/features/audio/use-lesson-audio';
import { listeningWarmUpSample } from '@/features/audio/spoken-texts';
import { AnswerChoice } from '@/components/answer-choice';
import { ActionBar, PrimaryButton } from '@/components/lesson-ui';
import { VoiceLineMark } from '@/components/voice-line';
import { WritingActivity } from '@/components/writing-activity';
import { useSelectedLanguage } from '@/features/language/selection';
import { useCoachingStore } from '@/features/coaching/store';

export default function ActivityScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const [track] = useSelectedLanguage();
  if (kind === 'write') return <WritingActivity />;
  // English listening drills only; Spanish and German listening lives in the dialogue library.
  if (track === 'ES') return <Redirect href={'/listening?track=ES' as Href} />;
  if (kind === 'listen') return <ListeningActivity />;
  return <Redirect href={`/conversation?track=${track}`} />;
}

function ActivityHeader({
  dark = false,
  progress = 1,
  total = 3,
}: {
  dark?: boolean;
  progress?: number;
  total?: number;
}) {
  return (
    <View style={styles.header}>
      <HeaderBack dark={dark} variant="close" />
      <View style={styles.progressBars}>
        {Array.from({ length: total }, (_, item) => (
          <View
            key={item}
            style={[
              styles.progressBar,
              {
                backgroundColor: dark ? OnDark.fillStrong : Palette.handle,
              },
              item < progress && styles.progressDone,
            ]}
          />
        ))}
      </View>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function ListeningActivity() {
  const speech = useLessonAudio('EN');
  const [selected, setSelected] = useState<number | null>(null);
  const [showText, setShowText] = useState(false);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const sample = listeningWarmUpSample;
  const play = (rate = 0.92) => void speech.play(sample, rate);
  const footer = (
    <ActionBar>
      <PrimaryButton
        title={feedback && selected === 1 ? 'Continue' : 'Check'}
        accessibilityLabel={feedback && selected === 1 ? 'Continue' : 'Check answer'}
        disabled={selected === null}
        onPress={() => {
          if (feedback && selected === 1) {
            router.push('/lesson/coffee-run');
            return;
          }
          if (selected === 1) useCoachingStore.getState().recordPractice('listening', 'EN');
          setFeedback(
            selected === 1
              ? 'Correct. They will meet outside the station.'
              : 'Not quite. Replay it slowly and listen for the place.',
          );
        }}
      />
    </ActionBar>
  );
  return (
    <AppScreen footer={footer} showNav={false}>
      <ActivityHeader progress={feedback && selected === 1 ? 1 : 0} total={1} />
      {speech.error ? (
        <Text accessibilityRole="alert" style={{ padding: space(4), color: Palette.ink }}>
          {speech.error}
        </Text>
      ) : null}
      <View style={styles.activityBody}>
        <View style={styles.audioCard}>
          <Pressable
            accessibilityLabel={
              speech.loading
                ? 'Cancel listening sample'
                : speech.busy
                  ? 'Stop listening sample'
                  : 'Play listening sample'
            }
            accessibilityRole="button"
            accessibilityState={{ busy: speech.loading }}
            aria-busy={speech.loading}
            onPress={() => (speech.busy ? speech.stop() : play())}
            style={styles.pauseButton}
          >
            {speech.loading ? (
              <ActivityIndicator color={Palette.ink} />
            ) : (
              <MaterialCommunityIcons
                color={Palette.ink}
                name={speech.playing ? 'stop' : 'play'}
                size={30}
              />
            )}
          </Pressable>
          <View style={styles.wave}>
            {/* Still: lime while the voice plays, faint otherwise. No made-up audio shape. */}
            <VoiceLineMark
              color={speech.playing ? Palette.lime : Dark.lineRest}
              height={44}
              thickness={5}
              width={150}
            />
          </View>
          <Text
            accessibilityLiveRegion="polite"
            style={{
              color: Palette.cream,
              fontFamily: VokaFonts.body,
              fontSize: FontSize.caption,
              lineHeight: LineHeight.caption,
            }}
          >
            {speech.loading
              ? 'Preparing audio...'
              : speech.playing
                ? 'Playing audio'
                : 'Tap play to listen'}
          </Text>
          <View style={styles.audioControls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Play slowly"
              accessibilityState={{ selected: speech.busy && speech.activeRate === 0.72 }}
              aria-pressed={speech.busy && speech.activeRate === 0.72}
              style={styles.audioControl}
              onPress={() => play(0.72)}
            >
              <Text
                style={
                  speech.busy && speech.activeRate === 0.72 ? styles.slowChip : styles.audioChip
                }
              >
                ✦ Slow
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Replay audio"
              style={styles.audioControl}
              onPress={() => play()}
            >
              <Text style={styles.audioChip}>Replay</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showText ? 'Hide transcript' : 'Show transcript'}
              accessibilityState={{ expanded: showText }}
              aria-expanded={showText}
              style={styles.audioControl}
              onPress={() => setShowText((value) => !value)}
            >
              <Text style={styles.audioChip}>{showText ? 'Hide text' : 'Show text'}</Text>
            </Pressable>
          </View>
          {showText ? <Text style={styles.audioTranscript}>{sample}</Text> : null}
        </View>
        <View style={styles.questionBlock}>
          <Eyebrow>Question 1 of 1</Eyebrow>
          <Text style={styles.question}>Where will they meet?</Text>
          <View style={styles.answers}>
            {['At the library', 'Outside the station', 'In the café'].map((answer, index) => (
              <AnswerChoice
                label={answer}
                selected={selected === index}
                result={
                  feedback && selected === index
                    ? selected === 1
                      ? 'correct'
                      : 'incorrect'
                    : undefined
                }
                disabled={Boolean(feedback && selected === 1)}
                key={answer}
                onPress={() => {
                  setSelected(index);
                  setFeedback('');
                }}
              />
            ))}
          </View>
          {feedback ? (
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.answerFeedback, selected === 1 && styles.answerFeedbackCorrect]}
            >
              {feedback}
            </Text>
          ) : null}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headerSpacer: { width: 40 },
  progressBars: { flexDirection: 'row', gap: space(1) },
  progressBar: { borderRadius: Radius.pill, height: 5, width: 20 },
  progressDone: { backgroundColor: Palette.ink },
  activityBody: { flex: 1, paddingHorizontal: space(4), paddingTop: space(3) },
  pressed: { opacity: 0.7 },
  audioCard: { backgroundColor: Palette.ink, borderRadius: Radius.xl, padding: space(5) },
  pauseButton: {
    alignItems: 'center',
    backgroundColor: Palette.cream,
    borderRadius: Radius.pill,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  wave: {
    alignItems: 'center',
    height: 50,
    marginLeft: space(18),
    marginTop: -54,
  },
  audioControls: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2), marginTop: space(4) },
  audioControl: { minHeight: 44, justifyContent: 'center' },
  audioTranscript: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(4),
  },
  slowChip: {
    backgroundColor: Palette.cream,
    borderRadius: Radius.pill,
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.caption,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
  audioChip: {
    backgroundColor: OnDark.fillStrong,
    borderRadius: Radius.pill,
    color: Palette.cream,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
  questionBlock: { marginTop: space(7) },
  question: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
    marginTop: space(2),
  },
  answers: { gap: space(2), marginTop: space(4) },
  answerFeedback: {
    color: Feedback.wrongText,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(4),
  },
  answerFeedbackCorrect: { color: Feedback.correctText },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space(4),
    paddingVertical: space(3),
  },
});
