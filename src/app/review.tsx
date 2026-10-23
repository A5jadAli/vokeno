import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { AnswerChoice } from '@/components/answer-choice';
import { AudioIconButton } from '@/components/lesson-audio-button';
import {
  ActionBar,
  InfoCard,
  LessonTopBar,
  lessonText,
  PrimaryButton,
  PrimaryAccent,
} from '@/components/lesson-ui';
import { SessionFooter } from '@/components/session-footer';
import { AppScreen } from '@/components/voka-ui';
import {
  Feedback,
  FontSize,
  LineHeight,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import { freshFoundationEntry } from '@/features/foundations/progress';
import { useSelectedLanguage } from '@/features/language/selection';
import { languageDetails, trackColors } from '@/features/language/config';
import type { LanguageTrack } from '@/features/language/config';
import { useLessonAudio } from '@/features/audio/use-lesson-audio';
import {
  buildReviewSession,
  dayNumber,
  gradeCard,
  reviewSummary,
  type ReviewItem,
} from '@/features/review/schedule';

export default function ReviewScreen() {
  const [track] = useSelectedLanguage();
  return (
    <PrimaryAccent colors={trackColors[track]}>
      <ReviewSession key={track} track={track} />
    </PrimaryAccent>
  );
}

function ReviewSession({ track }: { track: LanguageTrack }) {
  const router = useRouter();
  const progress = useCoachingStore((state) => state.foundations);
  const save = useCoachingStore((state) => state.saveFoundation);
  const speech = useLessonAudio(track);
  const language = languageDetails[track].name;
  // Build once so grading does not reshuffle the running session.
  const [queue, setQueue] = useState<ReviewItem[]>(() => buildReviewSession(progress, track));
  const [total] = useState(queue.length);
  const { prefetch } = speech;
  useEffect(() => prefetch(queue.map((entry) => ({ text: entry.target }))), [prefetch, queue]);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [outcome, setOutcome] = useState<'correct' | 'wrong' | null>(null);
  const graded = useRef(new Set<string>());
  const [remembered, setRemembered] = useState(0);
  const item = queue[position];
  // Today's review is done when the session is finished, not when the first card is answered.
  const finished = total > 0 && !item;
  useEffect(() => {
    if (finished) useCoachingStore.getState().recordActivity(`review:${track}`, track);
  }, [finished, track]);

  const grade = (correct: boolean) => {
    // Only the first attempt in a session moves the card; retries are for learning.
    if (!graded.current.has(item.key)) {
      graded.current.add(item.key);
      useCoachingStore.getState().recordPractice('review', track);
      const entry =
        useCoachingStore.getState().foundations[item.lessonId] ?? freshFoundationEntry();
      save(item.lessonId, gradeCard(entry, item.phraseIndex, correct, dayNumber()));
      if (correct) setRemembered((value) => value + 1);
    }
    if (!correct) setQueue((items) => [...items, { ...item, kind: 'recall' }]);
  };
  const nextItem = () => {
    speech.stop();
    setSelected(null);
    setRevealed(false);
    setOutcome(null);
    setPosition(position + 1);
  };

  if (!total || !item) {
    const summary = reviewSummary(useCoachingStore.getState().foundations, track);
    return (
      <AppScreen
        showNav={false}
        footer={
          total ? (
            <SessionFooter track={track} />
          ) : (
            <ActionBar>
              <PrimaryButton
                title={summary.learning ? 'Back to Today' : 'Go to your next lesson'}
                onPress={() => router.replace(`/?track=${track}` as Href)}
              />
            </ActionBar>
          )
        }
      >
        <LessonTopBar progress={total ? 1 : 0} />
        <View style={styles.center}>
          <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.badge}>
            <MaterialCommunityIcons
              name={total ? 'brain' : 'calendar-check'}
              size={40}
              color={Palette.ink}
            />
          </Animated.View>
          <Text accessibilityRole="header" style={lessonText.title}>
            {total
              ? 'Review complete'
              : summary.learning
                ? 'All caught up'
                : 'Nothing to review yet'}
          </Text>
          <Text style={[lessonText.lead, { textAlign: 'center' }]}>
            {total
              ? `You remembered ${remembered} of ${total} phrases first time. Missed ones come back tomorrow.`
              : summary.learning
                ? `No phrases are due. ${summary.nextInDays === 1 ? 'The next ones come back tomorrow.' : `The next ones come back in ${summary.nextInDays} days.`} Scheduled review helps you remember them.`
                : 'Finish a lesson and its phrases appear here the next day.'}
          </Text>
          {summary.learning ? (
            <View style={styles.stats}>
              <Stat label="In review" value={summary.learning} />
              <Stat label="Strong" value={summary.strong} />
              <Stat label="Due now" value={summary.due} />
            </View>
          ) : null}
        </View>
      </AppScreen>
    );
  }

  const objective = item.kind !== 'recall';
  const correct = objective && selected === item.answer;
  const footer = objective ? (
    <ActionBar
      feedback={
        outcome
          ? outcome === 'correct'
            ? {
                tone: 'correct',
                title: 'Correct',
                message: `${item.target} means “${item.meaning}”`,
              }
            : {
                tone: 'wrong',
                title: 'Not quite',
                message: `${item.target} means “${item.meaning}”`,
              }
          : undefined
      }
    >
      {outcome ? (
        <PrimaryButton title="Continue" onPress={nextItem} />
      ) : (
        <PrimaryButton
          title="Check"
          disabled={selected === null}
          onPress={() => {
            setOutcome(correct ? 'correct' : 'wrong');
            grade(correct);
          }}
        />
      )}
    </ActionBar>
  ) : (
    <ActionBar>
      {revealed ? (
        <View style={styles.selfGrade}>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              tone="secondary"
              icon="close"
              title="Not yet"
              onPress={() => {
                grade(false);
                nextItem();
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              icon="check"
              title="I knew it"
              onPress={() => {
                grade(true);
                nextItem();
              }}
            />
          </View>
        </View>
      ) : (
        <PrimaryButton title="Show answer" onPress={() => setRevealed(true)} />
      )}
    </ActionBar>
  );

  return (
    <AppScreen showNav={false} footer={footer}>
      <LessonTopBar
        progress={position / queue.length}
        label={`${Math.min(position + 1, queue.length)}/${queue.length}`}
      />
      <View style={styles.body}>
        <Text style={lessonText.meta}>
          {language} review ·{' '}
          {item.kind === 'choose' ? 'recognise' : item.kind === 'listen' ? 'listen' : 'recall'}
        </Text>
        {item.kind === 'choose' ? (
          <>
            <Text style={lessonText.prompt}>Which phrase means:</Text>
            <InfoCard icon="translate" title={item.meaning}>
              {item.use}
            </InfoCard>
          </>
        ) : null}
        {item.kind === 'listen' ? (
          <>
            <Text style={lessonText.prompt}>What does this mean?</Text>
            <View style={styles.listen}>
              <AudioIconButton
                speech={speech}
                text={item.target}
                label="Play the phrase"
                size={76}
                tone="accent"
              />
              <AudioIconButton
                speech={speech}
                text={item.target}
                label="Play the phrase slowly"
                rate={0.6}
                slow
                size={56}
              />
            </View>
          </>
        ) : null}
        {objective ? (
          <View style={{ gap: space(2) }}>
            {item.options.map((option, index) => (
              <AnswerChoice
                key={option}
                label={option}
                selected={selected === index}
                result={
                  outcome && selected === index
                    ? outcome === 'correct'
                      ? 'correct'
                      : 'incorrect'
                    : undefined
                }
                disabled={Boolean(outcome)}
                onPress={() => setSelected(index)}
              />
            ))}
          </View>
        ) : (
          <>
            <Text style={lessonText.prompt}>Say it in {language} before you reveal it:</Text>
            <InfoCard icon="translate" title={item.meaning}>
              {item.use}
            </InfoCard>
            {revealed ? (
              <View style={styles.answer}>
                <Text selectable style={styles.answerText}>
                  {item.target}
                </Text>
                <AudioIconButton speech={speech} text={item.target} label="Hear the answer" />
              </View>
            ) : (
              <Text style={lessonText.small}>
                Saying it out loud builds speaking recall. Be honest when you grade yourself.
              </Text>
            )}
          </>
        )}
        {speech.error ? (
          <Text accessibilityRole="alert" style={lessonText.small}>
            {speech.error}
          </Text>
        ) : null}
      </View>
    </AppScreen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={lessonText.small}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space(4),
    paddingBottom: space(8),
    paddingHorizontal: space(5),
    paddingTop: space(2),
  },
  center: { alignItems: 'center', gap: space(4), padding: space(6), paddingTop: space(10) },
  badge: {
    alignItems: 'center',
    backgroundColor: Palette.canvas,
    borderRadius: Radius.pill,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  stats: { alignSelf: 'stretch', flexDirection: 'row', gap: space(2) },
  stat: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    flex: 1,
    paddingVertical: space(4),
  },
  statValue: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.title },
  listen: { alignItems: 'center', flexDirection: 'row', gap: space(4), justifyContent: 'center' },
  answer: {
    alignItems: 'center',
    backgroundColor: Feedback.correctBg,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    gap: space(3),
    padding: space(4),
  },
  answerText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
  },
  selfGrade: { flexDirection: 'row', gap: space(2) },
});
