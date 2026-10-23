import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ActionBar,
  InfoCard,
  lessonText,
  PrimaryButton,
  SectionLabel,
  TextButton,
  PrimaryAccent,
} from '@/components/lesson-ui';
import { AppScreen, HeaderBack, Segmented } from '@/components/voka-ui';
import { ReportContent } from '@/components/report-content';
import {
  Feedback,
  FontSize,
  LineHeight,
  Palette,
  Radius,
  Selection,
  space,
  VokaFonts,
} from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import { useSelectedLanguage } from '@/features/language/selection';
import { isWritingFeedbackConfigured, requestWritingFeedback } from '@/features/writing/feedback';
import {
  tasksForTrack,
  writingChecklist,
  writingTasks,
  type WritingFeedback,
  type WritingTaskId,
} from '@/features/writing/progress';
import { countWritingWords } from '@/features/writing/validation';
import { languageDetails, type LanguageTrack, trackColors } from '@/features/language/config';

const ratingStyle = {
  strong: { bg: Feedback.correctBg, ink: Feedback.correctText },
  developing: { bg: Feedback.closeBg, ink: Feedback.closeInk },
  'needs work': { bg: Feedback.wrongBg, ink: Feedback.wrongText },
} as const;

const keyboardTip = {
  DE: 'Tip: add German to your phone’s keyboard languages. You get ä, ö, ü and ß, and English autocorrect stops changing German words (for example im → I’m).',
  ES: 'Tip: add Spanish to your phone’s keyboard languages. You get á, é, ñ, ¿ and ¡, and English autocorrect stops changing Spanish words (for example que → queue).',
} as const;

export function WritingActivity() {
  const [track] = useSelectedLanguage();
  return (
    <PrimaryAccent colors={trackColors[track]}>
      <WritingPractice key={track} track={track} />
    </PrimaryAccent>
  );
}

function WritingPractice({ track }: { track: LanguageTrack }) {
  const router = useRouter();
  const { task: taskParam } = useLocalSearchParams<{ task?: string }>();
  const ids = tasksForTrack(track);
  const taskId = (ids as string[]).includes(taskParam ?? '')
    ? (taskParam as WritingTaskId)
    : ids[0];
  const task = writingTasks[taskId];
  const exam = 'exam' in task ? task.exam : undefined;
  const draft = useCoachingStore((state) => state.writing[taskId]);
  const saveWriting = useCoachingStore((state) => state.saveWriting);
  const saveFeedback = useCoachingStore((state) => state.saveWritingFeedback);
  const recordWritingPractice = useCoachingStore((state) => state.recordWritingPractice);
  const answer = draft?.text ?? '';
  const submitted = Boolean(answer && draft?.submitted === answer);
  const feedback =
    draft?.feedback && draft.feedback.forText === draft.submitted ? draft.feedback : undefined;
  const [examMode, setExamMode] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const abort = useRef<AbortController | null>(null);
  const minimum = examMode && exam ? exam.minimum : task.minimum;
  const words = countWritingWords(answer);
  const language = languageDetails[track].name;

  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  useEffect(() => () => abort.current?.abort(), []);
  const remaining = deadline ? Math.max(0, deadline - now) : 0;
  const clock = `${Math.floor(remaining / 60000)}:${String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0')}`;

  const chooseTask = (id: WritingTaskId) => {
    abort.current?.abort();
    router.setParams({ task: id });
    setMessage('');
    setFeedbackError('');
    setExamMode(false);
    setDeadline(null);
  };
  const submit = () => {
    if (words < minimum || new Set(answer.toLowerCase().match(/[a-zäöüß]+/g) ?? []).size < 5) {
      setMessage(
        `Write at least ${minimum} words, using several different words, before you submit.`,
      );
      return;
    }
    Keyboard.dismiss();
    setMessage('');
    setDeadline(null);
    saveWriting(taskId, answer, answer);
    recordWritingPractice(track);
  };
  const getFeedback = async () => {
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setLoading(true);
    setFeedbackError('');
    try {
      const result = await requestWritingFeedback(taskId, answer, controller.signal);
      saveFeedback(taskId, result);
    } catch (error) {
      if (!controller.signal.aborted)
        setFeedbackError(
          error instanceof Error ? error.message : 'Feedback is unavailable right now.',
        );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const footer = (
    <ActionBar>
      {!submitted ? (
        <PrimaryButton title="Submit my writing" disabled={!answer.trim()} onPress={submit} />
      ) : !feedback && isWritingFeedbackConfigured ? (
        <PrimaryButton
          title={loading ? 'Getting feedback…' : 'Get AI feedback'}
          icon="auto-fix"
          disabled={loading}
          onPress={() => void getFeedback()}
        />
      ) : (
        <PrimaryButton
          title="Try the next task"
          icon="arrow-right"
          onPress={() => chooseTask(ids[(ids.indexOf(taskId) + 1) % ids.length])}
        />
      )}
    </ActionBar>
  );

  return (
    <AppScreen showNav={false} keyboardAware footer={footer}>
      <View style={styles.header}>
        <HeaderBack />
        <Text style={styles.headerTitle}>{language} writing</Text>
        {deadline ? (
          <View
            accessibilityLabel={`Time left ${clock}`}
            style={[styles.clock, remaining === 0 && styles.clockDone]}
          >
            <MaterialCommunityIcons name="timer-outline" size={16} color={Palette.ink} />
            <Text style={styles.clockText}>{clock}</Text>
          </View>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
      <View style={styles.body}>
        <Segmented
          value={taskId}
          onChange={chooseTask}
          options={ids.map((id) => ({ value: id, label: writingTasks[id].label }))}
        />

        <Text accessibilityRole="header" style={lessonText.title}>
          {task.title}
        </Text>
        <Text style={styles.prompt}>{task.prompt}</Text>
        {'promptHelp' in task ? (
          <>
            <TextButton
              title={showHelp ? 'Hide English' : 'Show in English'}
              onPress={() => setShowHelp(!showHelp)}
            />
            {showHelp ? <Text style={lessonText.small}>{task.promptHelp}</Text> : null}
          </>
        ) : null}
        <Text style={lessonText.small}>
          {task.target} Practice for one task: it does not show that you are ready for a whole exam.
        </Text>

        {taskId === 'chart' ? <CoffeeChart /> : null}

        {exam && !submitted ? (
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: examMode }}
            onPress={() => {
              const next = !examMode;
              setExamMode(next);
              setDeadline(next ? Date.now() + exam.minutes * 60_000 : null);
              setNow(Date.now());
            }}
            style={[styles.examToggle, examMode && styles.examToggleOn]}
          >
            <MaterialCommunityIcons
              name={examMode ? 'timer' : 'timer-outline'}
              size={22}
              color={Palette.ink}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.examTitle}>Timed exam mode</Text>
              <Text style={lessonText.small}>
                {exam.minutes} minutes · at least {exam.minimum} words, as in the real test
              </Text>
            </View>
            <View style={[styles.switch, examMode && styles.switchOn]}>
              <View style={[styles.knob, examMode && styles.knobOn]} />
            </View>
          </Pressable>
        ) : null}

        <TextInput
          accessibilityLabel="Writing response"
          // The phone's autocorrect rewrites German (im → I'm) and exams have none.
          autoCorrect={false}
          autoComplete="off"
          spellCheck={false}
          multiline
          editable={!loading}
          onChangeText={(value) => {
            saveWriting(taskId, value);
            setMessage('');
          }}
          maxLength={8000}
          placeholder={`Write your answer in ${language}. Your draft saves automatically.`}
          placeholderTextColor={Palette.muted}
          style={styles.input}
          textAlignVertical="top"
          value={answer}
        />
        <View style={styles.counter}>
          <View style={styles.counterTrack}>
            <View
              style={[
                styles.counterFill,
                { width: `${Math.min(100, (words / minimum) * 100)}%` },
                words >= minimum && { backgroundColor: Feedback.correctFill },
              ]}
            />
          </View>
          <Text style={styles.counterText}>
            {words} / {minimum} words
          </Text>
        </View>
        {track !== 'EN' && !submitted ? (
          <Text style={lessonText.small}>{keyboardTip[track]}</Text>
        ) : null}
        {message ? (
          <Text accessibilityLiveRegion="polite" style={styles.warning}>
            {message}
          </Text>
        ) : null}
        {remaining === 0 && deadline ? (
          <Text accessibilityLiveRegion="polite" style={styles.warning}>
            Time is up. Finish your sentence and submit.
          </Text>
        ) : null}

        {!submitted ? (
          <TextButton
            title="Answer by speaking instead"
            onPress={() => router.push(`/conversation?track=${track}` as Href)}
          />
        ) : null}
        {submitted ? (
          <>
            <Text accessibilityLiveRegion="polite" style={styles.saved}>
              Writing activity complete. {words} words submitted and saved. Editing your text starts
              a new revision.
            </Text>
            <SectionLabel>Quick checks</SectionLabel>
            <View style={styles.checklist}>
              {writingChecklist(answer, taskId, examMode).map((tip) => (
                <View key={tip} style={styles.checkRow}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={18}
                    color={Palette.secondary}
                  />
                  <Text style={[lessonText.small, { flex: 1 }]}>{tip}</Text>
                </View>
              ))}
            </View>
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color={Palette.ink} />
                <Text style={lessonText.small}>Reading your text carefully…</Text>
              </View>
            ) : null}
            {feedbackError ? (
              <Text accessibilityRole="alert" style={styles.warning}>
                {feedbackError}
              </Text>
            ) : null}
            {feedback ? <FeedbackView feedback={feedback} track={track} /> : null}
            {!isWritingFeedbackConfigured ? (
              <Text style={lessonText.small}>AI feedback is not available in this build.</Text>
            ) : null}
            <Model example={task.example} />
            <TextButton
              title="View my progress"
              onPress={() => router.replace('/progress' as Href)}
            />
          </>
        ) : null}
      </View>
    </AppScreen>
  );
}

function FeedbackView({ feedback, track }: { feedback: WritingFeedback; track: LanguageTrack }) {
  const [showImproved, setShowImproved] = useState(false);
  return (
    <View style={{ gap: space(3) }}>
      <View style={styles.feedbackHeader}>
        <SectionLabel>AI feedback</SectionLabel>
        <ReportContent
          surface="writing-feedback"
          track={track}
          excerpt={`${feedback.summary}\n${feedback.improvedVersion}`}
        />
      </View>
      <InfoCard icon="auto-fix" title="Overall" tone="ink">
        {feedback.summary}
      </InfoCard>
      {feedback.criteria.map((criterion) => (
        <View key={criterion.name} style={styles.criterion}>
          <View style={styles.criterionTop}>
            <Text style={styles.criterionName}>{criterion.name}</Text>
            <Text
              style={[
                styles.pill,
                {
                  backgroundColor: ratingStyle[criterion.rating].bg,
                  color: ratingStyle[criterion.rating].ink,
                },
              ]}
            >
              {criterion.rating}
            </Text>
          </View>
          <Text style={lessonText.small}>{criterion.comment}</Text>
        </View>
      ))}
      {feedback.corrections.length ? (
        <View style={styles.criterion}>
          <Text style={styles.criterionName}>Corrections</Text>
          {feedback.corrections.map((item) => (
            <View key={item.original} style={styles.correction}>
              <Text style={styles.original}>{item.original}</Text>
              <Text style={styles.corrected}>{item.corrected}</Text>
              <Text style={lessonText.small}>{item.why}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <View style={styles.criterion}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: showImproved }}
          onPress={() => setShowImproved(!showImproved)}
          style={styles.criterionTop}
        >
          <Text style={styles.criterionName}>Improved version</Text>
          <MaterialCommunityIcons
            name={showImproved ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={Palette.ink}
          />
        </Pressable>
        {showImproved ? (
          <Text selectable style={styles.improved}>
            {feedback.improvedVersion}
          </Text>
        ) : (
          <Text style={lessonText.small}>
            Your ideas, rewritten slightly above your level. Compare before you revise.
          </Text>
        )}
      </View>
      <InfoCard icon="flag-checkered" title="Next step" tone="tint">
        {feedback.nextStep}
      </InfoCard>
      <Text style={lessonText.small}>AI feedback can be wrong. It is not a score or a level.</Text>
    </View>
  );
}

function Model({ example }: { example: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.criterion}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={styles.criterionTop}
      >
        <Text style={styles.criterionName}>Compare with a short example</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={Palette.ink}
        />
      </Pressable>
      {open ? (
        <>
          <Text selectable style={styles.improved}>
            {example}
          </Text>
          <Text style={lessonText.small}>One possible response, not the only correct answer.</Text>
        </>
      ) : null}
    </View>
  );
}

function CoffeeChart() {
  const bars = [33, 49, 43, 63, 76, 34, 27];
  return (
    <View
      accessibilityLabel="Bar chart of coffee sold each day: Monday 33, Tuesday 49, Wednesday 43, Thursday 63, Friday 76, Saturday 34, Sunday 27"
      style={styles.chartCard}
    >
      <Text style={lessonText.small}>Coffee sold each day (cups)</Text>
      <View style={styles.chart}>
        {bars.map((value, index) => (
          <View key={index} style={styles.barColumn}>
            <Text style={styles.barLabel}>{value}</Text>
            <View style={[styles.bar, { height: value * 1.3 }, value === 76 && styles.barPeak]} />
            <Text style={styles.barLabel}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.wordChips}>
        {['rose', 'peaked at', 'fell sharply', 'about half', 'overall'].map((word) => (
          <Text key={word} style={styles.wordChip}>
            {word}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    paddingHorizontal: space(4),
    paddingVertical: space(2),
  },
  headerTitle: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
  },
  clock: {
    alignItems: 'center',
    backgroundColor: Palette.canvas,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: space(1),
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
  clockDone: { backgroundColor: Feedback.wrongBg },
  clockText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.label },
  body: { gap: space(4), paddingBottom: space(8), paddingHorizontal: space(5) },
  prompt: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  examToggle: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: 'transparent',
    borderRadius: Radius.lg,
    borderWidth: 2,
    flexDirection: 'row',
    gap: space(3),
    padding: space(4),
  },
  examToggleOn: { borderColor: Selection.border },
  examTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  switch: {
    backgroundColor: Palette.handle,
    borderRadius: Radius.pill,
    height: 28,
    padding: space(1),
    width: 48,
  },
  switchOn: { backgroundColor: Feedback.correctFill },
  knob: { backgroundColor: Palette.white, borderRadius: Radius.pill, height: 22, width: 22 },
  knobOn: { transform: [{ translateX: 20 }] },
  input: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.lg,
    borderWidth: 2,
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    maxHeight: 360,
    minHeight: 180,
    padding: space(4),
  },
  counter: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  counterTrack: {
    backgroundColor: Palette.pressed,
    borderRadius: Radius.pill,
    flex: 1,
    height: 6,
    overflow: 'hidden',
  },
  counterFill: { backgroundColor: Palette.ink, height: '100%' },
  counterText: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
  },
  warning: {
    backgroundColor: Feedback.wrongBg,
    borderRadius: Radius.md,
    color: Feedback.wrongText,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    padding: space(3),
  },
  saved: {
    backgroundColor: Feedback.correctBg,
    borderRadius: Radius.md,
    color: Feedback.correctText,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    padding: space(3),
  },
  feedbackHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checklist: {
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    gap: space(2),
    padding: space(4),
  },
  checkRow: { flexDirection: 'row', gap: space(2) },
  loading: { alignItems: 'center', flexDirection: 'row', gap: space(2), padding: space(3) },
  criterion: {
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    gap: space(2),
    padding: space(4),
  },
  criterionTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  criterionName: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  pill: {
    borderRadius: Radius.pill,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    overflow: 'hidden',
    paddingHorizontal: space(2),
    paddingVertical: space(1),
    textTransform: 'capitalize',
  },
  correction: {
    borderTopColor: Palette.line,
    borderTopWidth: 1,
    gap: space(1),
    paddingTop: space(2),
  },
  original: {
    color: Feedback.wrongText,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    textDecorationLine: 'line-through',
  },
  corrected: {
    color: Feedback.correctText,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
  },
  improved: {
    color: Palette.ink,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  chartCard: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    gap: space(3),
    padding: space(4),
  },
  chart: { alignItems: 'flex-end', flexDirection: 'row', gap: space(2), height: 130 },
  barColumn: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  bar: {
    backgroundColor: Palette.neutralBar,
    borderRadius: Radius.sm,
    marginVertical: space(1),
    width: '100%',
  },
  barPeak: { backgroundColor: Palette.ink },
  barLabel: {
    color: Palette.muted,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
  },
  wordChips: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  wordChip: {
    backgroundColor: Palette.soft,
    borderRadius: Radius.pill,
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    overflow: 'hidden',
    paddingHorizontal: space(2),
    paddingVertical: space(2),
  },
});
