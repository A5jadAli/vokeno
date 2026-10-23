import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { useAccentColors } from '@/components/accent-context';
import { AnswerChoice } from '@/components/answer-choice';
import { AudioIconButton } from '@/components/lesson-audio-button';
import {
  answerInputProps,
  ActionBar,
  InfoCard,
  LessonTopBar,
  lessonText,
  PrimaryAccent,
  PrimaryButton,
  TextButton,
} from '@/components/lesson-ui';
import { ProgressFill, Tactile } from '@/components/motion';
import { SessionFooter } from '@/components/session-footer';
import { SpeakingPractice } from '@/components/speaking-practice';
import { FormPractice } from '@/components/form-practice';
import { ListeningPrompt } from '@/components/listening-prompt';
import { AppScreen, Segmented } from '@/components/voka-ui';
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
import { haptic } from '@/features/feedback/haptics';
import {
  foundationLessons,
  gradeFoundationWriting,
  normaliseFoundationAnswer,
  optionOrder,
  type LessonStep,
  type StepLesson,
} from '@/features/foundations/catalog';
import {
  freshFoundationEntry,
  foundationDraftLimit,
  MAX_DRAFT_LENGTH,
  MAX_FOUNDATION_ATTEMPTS,
  type FoundationEntry,
} from '@/features/foundations/progress';
import { isGradedStep, type Skill, unitName, usesRetake } from '@/features/foundations/types';
import { lessonContext } from '@/features/journey/course';
import { getUnitCall } from '../../supabase/functions/_shared/unit-calls';
import { lessonLines, stepLines } from '@/features/audio/inventory';
import { languageDetails, trackColors } from '@/features/language/config';
import { useLanguageSelection } from '@/features/language/selection';
import { useLessonAudio, type LessonAudio } from '@/features/audio/use-lesson-audio';
import { seedCards } from '@/features/review/schedule';
import { formFieldCorrect } from '@/features/foundations/form-practice';

type Result = { tone: 'correct' | 'wrong' | 'close'; title: string; message?: string };
const PRAISE = ['Nice!', 'Exactly!', 'Well done!', 'Spot on!', 'Correct!'];

const keyboardNote = {
  DE: 'Capitals and punctuation don’t count. No ß or umlauts? Type ss, ae, oe or ue.',
  EN: 'Punctuation and capital letters are not marked.',
  ES: 'Capitals and punctuation don’t count. Missing accents are fine; ñ counts.',
} as const;

/** A unit session: a short run of varied steps, saved after every step. */
export function StepLessonPlayer({ lesson }: { lesson: StepLesson }) {
  useFocusEffect(
    useCallback(() => {
      useLanguageSelection.getState().choose(lesson.track);
    }, [lesson.track]),
  );
  const colors = trackColors[lesson.track];
  const languageName = languageDetails[lesson.track].name;
  const saved = useCoachingStore((state) => state.foundations[lesson.id]);
  const save = useCoachingStore((state) => state.saveFoundation);
  const entry = saved ?? freshFoundationEntry();
  const speech = useLessonAudio(lesson.track);
  // Download this lesson's voices as soon as it opens, so every line starts at once.
  const { prefetch } = speech;
  useEffect(() => {
    // The current step's lines go first (below); the rest of the lesson follows.
    const timer = setTimeout(() => prefetch(lessonLines(lesson), 0), 400);
    return () => clearTimeout(timer);
  }, [lesson, prefetch]);
  const [result, setResult] = useState<Result | null>(null);
  // Bumped to reset the current step's local state (selection, tiles, pairs).
  const [attemptKey, setAttemptKey] = useState(0);
  const [ready, setReady] = useState<{ check: () => void } | null>(null);
  const [mistakes, setMistakes] = useState(0);

  // A checkpoint alternates between two versions. While a run is open it keeps the version it
  // started with; once finished, the results describe the version just completed.
  const finishedRun = entry.step >= lesson.steps.length && entry.attempts.length > 0;
  const retakeRun = finishedRun
    ? Boolean(entry.attempts.at(-1)?.retake && lesson.retakeSteps)
    : usesRetake(lesson, entry.attempts);
  const steps = retakeRun ? lesson.retakeSteps! : lesson.steps;
  const index = Math.min(entry.step, steps.length);
  // Ready players for this step and the next, so their audio starts the moment it is tapped.
  useEffect(() => {
    const near = steps.slice(index, index + 2).flatMap((item) => stepLines(lesson.track, item));
    if (near.length) prefetch(near, near.length);
  }, [index, lesson.track, prefetch, steps]);
  const step = steps[index] as LessonStep | undefined;
  const graded = steps.filter(isGradedStep).length;
  const gradedIndex = steps.slice(0, index).filter(isGradedStep).length;
  const lastAttempt = entry.attempts.at(-1);
  const correctNow = result?.tone === 'correct';

  const update = (change: Partial<FoundationEntry>) =>
    save(lesson.id, { ...entry, ...change, updatedAt: new Date().toISOString() });
  const resetTransient = () => {
    speech.stop();
    setResult(null);
    setReady(null);
    setMistakes(0);
    setAttemptKey((key) => key + 1);
  };
  const markFirstTry = (correct: boolean) => {
    const latest = useCoachingStore.getState().foundations[lesson.id] ?? entry;
    if (latest.firstTry[gradedIndex] !== undefined) return;
    const firstTry = [...latest.firstTry];
    firstTry[gradedIndex] = correct;
    save(lesson.id, { ...latest, firstTry, updatedAt: new Date().toISOString() });
  };
  const finish = (spoken: boolean) => {
    resetTransient();
    useCoachingStore.getState().recordActivity(`lesson:${lesson.id}`, lesson.track);
    haptic.complete();
    update({
      step: steps.length,
      draft: '',
      ...seedCards(lesson, entry, undefined, useCoachingStore.getState().foundations),
      attempts: [
        ...entry.attempts,
        {
          at: new Date().toISOString(),
          correctFirstTry: entry.firstTry.slice(0, graded).filter(Boolean).length,
          spoken: spoken || entry.answers[0] === 1,
          ...(retakeRun ? { retake: true } : {}),
        },
      ].slice(-MAX_FOUNDATION_ATTEMPTS),
    });
  };
  const advance = (spoke = false) => {
    if (index + 1 >= steps.length) return finish(spoke);
    resetTransient();
    useCoachingStore.getState().recordPractice('lesson', lesson.track);
    // In step lessons, answers[0] = 1 records that a speaking step was done aloud.
    update({ step: index + 1, draft: '', ...(spoke ? { answers: [1] } : {}) });
  };
  const retry = () => {
    resetTransient();
    save(lesson.id, {
      ...freshFoundationEntry(),
      attempts: entry.attempts,
      cards: entry.cards,
      cardKeys: entry.cardKeys,
    });
  };
  const report = (correct: boolean, title: string, message: string, firstTry = correct) => {
    if (correct) {
      haptic.correct();
      // A plain “Correct” becomes varied praise; after a retry it is plainer and still honest.
      const verdict =
        title !== 'Correct'
          ? title
          : firstTry && entry.firstTry[gradedIndex] !== false
            ? PRAISE[index % PRAISE.length]
            : 'That’s it!';
      setResult({ tone: 'correct', title: verdict, message });
    } else {
      haptic.wrong();
      setMistakes((count) => count + 1);
      setResult({ tone: 'wrong', title, message });
    }
    markFirstTry(firstTry);
  };

  let footer: ReactNode = null;
  if (!step && lastAttempt) footer = <SessionFooter track={lesson.track} />;
  else if (step && !isGradedStep(step))
    footer = (
      <ActionBar>
        {step.kind === 'speak' ? (
          <>
            <PrimaryButton title="I said it aloud" icon="check" onPress={() => advance(true)} />
            <TextButton title="Skip speaking for now" onPress={() => advance(false)} />
          </>
        ) : (
          <PrimaryButton
            title={step.kind === 'rule' ? 'Got it' : 'Continue'}
            icon="arrow-right"
            onPress={() => advance()}
          />
        )}
      </ActionBar>
    );
  else if (step)
    footer = (
      <ActionBar feedback={result ?? undefined}>
        {correctNow ? (
          <PrimaryButton title="Continue" icon="arrow-right" onPress={() => advance()} />
        ) : result && step.kind !== 'type' && step.kind !== 'form' ? (
          <PrimaryButton
            title="Try again"
            onPress={() => {
              setResult(null);
              setReady(null);
              setAttemptKey((key) => key + 1);
            }}
          />
        ) : step.kind === 'match' ? (
          <Text style={styles.footerHint}>Match every pair to continue.</Text>
        ) : (
          <PrimaryButton title="Check" disabled={!ready} onPress={() => ready?.check()} />
        )}
      </ActionBar>
    );

  const progress = step ? (index + (correctNow ? 1 : 0.4)) / steps.length : 1;

  return (
    <PrimaryAccent colors={colors}>
      <AppScreen showNav={false} keyboardAware footer={footer}>
        <LessonTopBar progress={progress} label={unitName(lesson.unit)} />
        <View style={styles.body}>
          {speech.error ? (
            <Text accessibilityRole="alert" style={styles.alert}>
              {speech.error}
            </Text>
          ) : null}
          {index === 0 && step ? (
            <View style={styles.intro}>
              <Text style={lessonText.meta}>
                {unitName(lesson.unit)} · {lesson.unit.title} · {lesson.session}
              </Text>
              <Text accessibilityRole="header" style={lessonText.title}>
                {lesson.title}
              </Text>
              <Text style={lessonText.lead}>{lesson.outcome}</Text>
            </View>
          ) : null}
          {step ? (
            <Animated.View key={`${index}-${attemptKey}`} entering={FadeIn.duration(180)}>
              <StepView
                step={step}
                lesson={lesson}
                speech={speech}
                languageName={languageName}
                result={result}
                mistakes={mistakes}
                draft={entry.draft}
                onDraft={(draft) => {
                  setResult(null);
                  update({ draft: draft.slice(0, foundationDraftLimit(lesson, index)) });
                }}
                setReady={setReady}
                report={report}
                onHelp={() => markFirstTry(false)}
                setResult={setResult}
              />
            </Animated.View>
          ) : lastAttempt ? (
            <Complete
              lesson={lesson}
              graded={graded}
              correct={lastAttempt.correctFirstTry}
              spoken={lastAttempt.spoken}
              onRetry={retry}
              results={
                lesson.unit.checkpoint ? (
                  <CheckpointResults
                    steps={steps}
                    firstTry={entry.firstTry}
                    spoken={lastAttempt.spoken}
                  />
                ) : null
              }
            />
          ) : null}
        </View>
      </AppScreen>
    </PrimaryAccent>
  );
}

type StepProps = {
  step: LessonStep;
  lesson: StepLesson;
  speech: LessonAudio;
  languageName: string;
  result: Result | null;
  mistakes: number;
  draft: string;
  onDraft: (draft: string) => void;
  setReady: (ready: { check: () => void } | null) => void;
  report: (correct: boolean, title: string, message: string, firstTry?: boolean) => void;
  onHelp: () => void;
  setResult: (result: Result | null) => void;
};

function StepView(props: StepProps) {
  const { step } = props;
  switch (step.kind) {
    case 'scene':
      return <SceneStep {...props} step={step} />;
    case 'teach':
      return <TeachStep {...props} step={step} />;
    case 'rule':
      return <RuleStep {...props} step={step} />;
    case 'choose':
      return <ChooseStep {...props} step={step} />;
    case 'build':
      return <BuildStep {...props} step={step} />;
    case 'type':
      return <TypeStep {...props} step={step} />;
    case 'match':
      return <MatchStep {...props} step={step} />;
    case 'speak':
      return <SpeakingPractice step={step} speech={props.speech} />;
    case 'form':
      return (
        <FormPractice
          step={step}
          draft={props.draft}
          onDraft={props.onDraft}
          setReady={props.setReady}
          report={props.report}
          complete={props.result?.tone === 'correct'}
          speech={props.speech}
          onHelp={props.onHelp}
        />
      );
  }
}

type Of<K extends LessonStep['kind']> = Extract<LessonStep, { kind: K }>;

function SceneStep({ step, speech }: StepProps & { step: Of<'scene'> }) {
  // The second speaker's bubbles take the language tint: green is kept for right answers.
  const accent = useAccentColors();
  const hasReal = step.lines.some((line) => line.real);
  const [real, setReal] = useState(false);
  const [english, setEnglish] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const texts = step.lines.map((line) => (real && line.real ? line.real : line.text));
  const speakers = [...new Set(step.lines.map((line) => line.speaker))];
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>Scene</Text>
      <Text accessibilityRole="header" style={lessonText.prompt}>
        {step.title}
      </Text>
      <Text style={lessonText.lead}>{step.intro}</Text>
      <View style={styles.sceneControls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={speech.busy ? 'Stop the scene' : 'Play the whole scene'}
          onPress={() =>
            speech.busy
              ? speech.stop()
              : void speech.playSequence(
                  texts,
                  real ? 0.92 : 0.8,
                  setActiveLine,
                  step.lines.map((line) => line.speaker),
                )
          }
          style={({ pressed }) => [styles.playAll, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons
            name={speech.busy ? 'stop' : 'play'}
            size={22}
            color={Palette.cream}
          />
          <Text style={styles.playAllText}>{speech.busy ? 'Stop' : 'Play scene'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: english }}
          aria-checked={english}
          accessibilityLabel="Show English"
          onPress={() => setEnglish(!english)}
          style={[styles.chip, english && styles.chipOn]}
        >
          <MaterialCommunityIcons name="translate" size={16} color={Palette.ink} />
          <Text style={styles.chipText}>English</Text>
        </Pressable>
      </View>
      {hasReal ? (
        <Segmented
          value={real}
          onChange={(value) => {
            speech.stop();
            setReal(value);
          }}
          options={[
            { value: false, label: 'Careful' },
            { value: true, label: 'As people say it' },
          ]}
        />
      ) : null}
      <View style={styles.bubbles}>
        {step.lines.map((line, lineIndex) => {
          const mine = speakers.indexOf(line.speaker) % 2 === 1;
          const changed = real && line.real;
          const active = speech.busy && activeLine === lineIndex;
          return (
            <Pressable
              key={`${line.speaker}-${lineIndex}`}
              accessibilityRole="button"
              accessibilityLabel={`${line.speaker}: ${texts[lineIndex]}`}
              accessibilityHint="Plays this line"
              onPress={() => {
                setActiveLine(lineIndex);
                void speech.play(texts[lineIndex], real ? 0.92 : 0.8, line.speaker);
              }}
              style={[styles.bubbleRow, mine && styles.bubbleRowMine]}
            >
              <View
                style={[
                  styles.bubble,
                  mine
                    ? [styles.bubbleMine, { backgroundColor: accent?.tint ?? Palette.canvas }]
                    : styles.bubbleTheirs,
                  active && styles.bubbleActive,
                ]}
              >
                <Text style={styles.speaker}>{line.speaker}</Text>
                <Text style={[styles.bubbleText, changed && styles.bubbleChanged]}>
                  {texts[lineIndex]}
                </Text>
                {english ? (
                  <Text style={styles.bubbleMeaning}>
                    {changed && line.realMeaning ? line.realMeaning : line.meaning}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      {hasReal ? (
        <Text style={lessonText.small}>
          {real
            ? 'Underlined lines are how people really say it in everyday speech.'
            : 'Switch to “As people say it” to hear the everyday version.'}
        </Text>
      ) : null}
      {step.note ? (
        <InfoCard icon="lightbulb-on-outline" title="Notice" tone="quiet">
          {step.note}
        </InfoCard>
      ) : null}
    </View>
  );
}

function TeachStep({ step, speech }: StepProps & { step: Of<'teach'> }) {
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>New words</Text>
      <Text accessibilityRole="header" style={lessonText.prompt}>
        {step.title}
      </Text>
      <Text style={lessonText.small}>Tap to listen. Say each one after the audio.</Text>
      {step.items.map((item, itemIndex) => (
        <Animated.View
          key={item.target}
          entering={FadeInDown.delay(60 * itemIndex).duration(220)}
          style={styles.card}
        >
          <View style={styles.cardRow}>
            <View style={styles.cardCopy}>
              <Text style={styles.target}>{item.target}</Text>
              <Text style={styles.meaning}>{item.meaning}</Text>
            </View>
            <AudioIconButton speech={speech} text={item.target} label={`Hear: ${item.target}`} />
            <AudioIconButton
              speech={speech}
              text={item.target}
              label={`Hear slowly: ${item.target}`}
              rate={0.6}
              slow
            />
          </View>
          {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
        </Animated.View>
      ))}
    </View>
  );
}

function RuleStep({ step, speech }: StepProps & { step: Of<'rule'> }) {
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>How it works</Text>
      <Text accessibilityRole="header" style={lessonText.prompt}>
        {step.title}
      </Text>
      <Text style={styles.ruleBody}>{step.body}</Text>
      {step.table ? (
        <View style={styles.table}>
          {step.table.map(([left, right], rowIndex) => (
            <View
              key={left}
              style={[styles.tableRow, rowIndex === step.table!.length - 1 && styles.tableLast]}
            >
              <Text style={styles.tableLeft}>{left}</Text>
              <Text style={styles.tableRight}>{right}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {step.examples?.map((example) => (
        <View key={example} style={styles.example}>
          <Text style={styles.exampleText}>{example}</Text>
          <AudioIconButton speech={speech} text={example} label={`Hear: ${example}`} />
        </View>
      ))}
    </View>
  );
}

function ChooseStep({
  step,
  lesson,
  speech,
  result,
  setReady,
  report,
}: StepProps & { step: Of<'choose'> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const correctNow = result?.tone === 'correct';
  const choose = (choice: number) => {
    setSelected(choice);
    setReady({
      check: () =>
        report(
          choice === step.answer,
          choice === step.answer ? 'Correct' : 'Not quite',
          choice === step.answer
            ? step.explanation
            : step.audio
              ? 'Listen again, slowly if you like, then try another answer.'
              : step.context
                ? 'Read the text again, then try another answer.'
                : 'Read the question once more, then pick another answer.',
        ),
    });
  };
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>{step.audio ? 'Listen' : 'Choose'}</Text>
      {step.context ? (
        <View style={styles.context}>
          <Text selectable style={styles.contextText}>
            {step.context}
          </Text>
        </View>
      ) : null}
      <Text accessibilityRole="header" style={lessonText.prompt}>
        {step.prompt}
      </Text>
      {step.audio ? (
        <View style={styles.listen}>
          <AudioIconButton
            speech={speech}
            text={step.audio}
            label="Play the audio"
            size={76}
            tone="accent"
          />
          <AudioIconButton
            speech={speech}
            text={step.audio}
            label="Play the audio slowly"
            rate={0.6}
            slow
            size={56}
          />
          <Text style={[lessonText.small, styles.flex]}>
            Listen first. The words appear after you answer correctly.
          </Text>
        </View>
      ) : null}
      <View style={styles.options}>
        {optionOrder(`${lesson.id}:${step.prompt}`, step.options.length).map((choice) => (
          <AnswerChoice
            key={step.options[choice]}
            label={step.options[choice]}
            selected={selected === choice}
            result={
              result && selected === choice ? (correctNow ? 'correct' : 'incorrect') : undefined
            }
            disabled={correctNow || Boolean(result)}
            onPress={() => choose(choice)}
          />
        ))}
      </View>
      {correctNow && step.audio ? (
        <InfoCard icon="text-box-outline" title="You heard">
          {step.audio}
        </InfoCard>
      ) : null}
    </View>
  );
}

const sentence = (words: string[]) => normaliseFoundationAnswer(words.join(' '));

function BuildStep({
  step,
  lesson,
  speech,
  result,
  mistakes,
  setReady,
  report,
}: StepProps & { step: Of<'build'> }) {
  const tiles = [...step.answer, ...(step.extra ?? [])];
  const order = optionOrder(`${lesson.id}:${step.prompt}:tiles`, tiles.length);
  const [picked, setPicked] = useState<number[]>([]);
  const locked = Boolean(result);
  const solution = step.answer.join(' ');
  const set = (next: number[]) => {
    setPicked(next);
    const words = next.map((tile) => tiles[tile]);
    setReady(
      next.length
        ? {
            check: () => {
              const answer = sentence(words);
              const correct = [solution, ...(step.also ?? [])].some(
                (option) => normaliseFoundationAnswer(option) === answer,
              );
              report(
                correct,
                correct ? 'Correct' : 'Not quite',
                correct
                  ? step.explanation
                  : mistakes >= 1
                    ? `One right answer: ${solution}`
                    : 'Check the word order: where does the verb go?',
              );
              if (correct) void speech.play(words.join(' '), 0.85);
            },
          }
        : null,
    );
  };
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>Build the sentence</Text>
      <Text accessibilityRole="header" style={lessonText.prompt}>
        {step.prompt}
      </Text>
      <View
        accessibilityLabel={
          picked.length
            ? `Your sentence: ${picked.map((tile) => tiles[tile]).join(' ')}`
            : 'Your sentence is empty'
        }
        style={[
          styles.answerLine,
          result?.tone === 'correct' && { borderColor: Feedback.correctText },
          result?.tone === 'wrong' && { borderColor: Feedback.wrongText },
        ]}
      >
        {picked.length ? (
          picked.map((tile) => (
            <Tile
              key={`picked-${tile}`}
              label={tiles[tile]}
              disabled={locked}
              onPress={() => set(picked.filter((item) => item !== tile))}
              accessibilityLabel={`Remove ${tiles[tile]}`}
            />
          ))
        ) : (
          <Text style={styles.placeholder}>Tap the words in order</Text>
        )}
      </View>
      <View style={styles.bank}>
        {order.map((tile) =>
          picked.includes(tile) ? (
            <View key={`slot-${tile}`} style={[styles.tile, styles.tileUsed]}>
              <Text style={[styles.tileText, { opacity: 0 }]}>{tiles[tile]}</Text>
            </View>
          ) : (
            <Tile
              key={`bank-${tile}`}
              label={tiles[tile]}
              disabled={locked}
              onPress={() => set([...picked, tile])}
              accessibilityLabel={`Add ${tiles[tile]}`}
            />
          ),
        )}
      </View>
    </View>
  );
}

function Tile({
  label,
  onPress,
  disabled,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  accessibilityLabel: string;
}) {
  return (
    <Tactile
      face={Palette.white}
      radius={Radius.md}
      borderColor={Palette.border}
      borderWidth={1.5}
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      faceStyle={styles.tileFace}
    >
      <Text style={styles.tileText}>{label}</Text>
    </Tactile>
  );
}

function TypeStep({
  step,
  lesson,
  languageName,
  result,
  draft,
  onDraft,
  setReady,
  setResult,
  mistakes,
  report,
  speech,
  onHelp,
}: StepProps & { step: Of<'type'> }) {
  const correctNow = result?.tone === 'correct';
  const check = (value: string) => {
    Keyboard.dismiss();
    const grade = step.answerKind
      ? {
          status: formFieldCorrect(
            { kind: step.answerKind, accepted: step.accepted, label: '', hint: '' },
            value,
          )
            ? ('correct' as const)
            : ('wrong' as const),
        }
      : gradeFoundationWriting(
          { track: lesson.track, writing: { accepted: step.accepted } },
          value,
        );
    if (grade.status === 'correct' || grade.status === 'accents')
      return report(
        true,
        'Correct',
        grade.status === 'accents'
          ? `Watch the accents: ${grade.expected}. ${step.explanation}`
          : step.explanation,
      );
    if (grade.status === 'close') {
      haptic.wrong();
      setResult({
        tone: 'close',
        title: 'Very close',
        message: `One or two letters differ. ${step.hint}`,
      });
      return;
    }
    report(false, 'Not yet', step.hint);
  };
  // A draft restored after leaving the lesson can be checked straight away.
  useEffect(() => {
    if (draft.trim()) setReady({ check: () => check(draft) });
    // Only on mount: later changes go through onChangeText.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>Write it</Text>
      {step.context ? (
        <View style={styles.context}>
          <Text selectable style={styles.contextText}>
            {step.context}
          </Text>
        </View>
      ) : null}
      <Text accessibilityRole="header" style={lessonText.prompt}>
        {step.prompt}
      </Text>
      {step.audio ? (
        <ListeningPrompt text={step.audio} speech={speech} complete={correctNow} onHelp={onHelp} />
      ) : null}
      <TextInput
        accessibilityLabel={`Your ${languageName} answer`}
        {...answerInputProps}
        autoCapitalize={step.answerKind ? 'none' : 'sentences'}
        maxLength={MAX_DRAFT_LENGTH}
        multiline
        placeholder={`Type in ${languageName}`}
        placeholderTextColor={Palette.muted}
        style={[
          styles.input,
          correctNow && { borderColor: Feedback.correctText },
          result?.tone === 'wrong' && { borderColor: Feedback.wrongText },
        ]}
        value={draft}
        editable={!correctNow}
        onChangeText={(value) => {
          onDraft(value);
          setReady(value.trim() ? { check: () => check(value) } : null);
        }}
      />
      <Text style={lessonText.small}>{keyboardNote[lesson.track]}</Text>
      {mistakes >= 2 && !correctNow ? (
        <TextButton
          title="Show one possible answer"
          onPress={() =>
            setResult({
              tone: 'close',
              title: 'One possible answer',
              message: `${step.accepted[0]} Type it yourself to continue.`,
            })
          }
        />
      ) : null}
    </View>
  );
}

function MatchStep({ step, lesson, report }: StepProps & { step: Of<'match'> }) {
  const left = optionOrder(`${lesson.id}:${step.prompt}:left`, step.pairs.length);
  const right = optionOrder(`${lesson.id}:${step.prompt}:right`, step.pairs.length);
  const [matched, setMatched] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [slips, setSlips] = useState(0);
  const pick = (pair: number, side: 'left' | 'right') => {
    if (side === 'left') {
      setActive(pair);
      setWrong(null);
      return;
    }
    if (active === null) return;
    if (pair === active) {
      haptic.correct();
      const done = [...matched, pair];
      setMatched(done);
      setActive(null);
      if (done.length === step.pairs.length)
        report(
          true,
          'All matched',
          slips === 0
            ? 'Every pair right first time.'
            : `Done, with ${slips} slip${slips === 1 ? '' : 's'} on the way. These words come back in review.`,
          slips === 0,
        );
    } else {
      haptic.wrong();
      setWrong(pair);
      setSlips((count) => count + 1);
    }
  };
  const cell = (pair: number, side: 'left' | 'right') => {
    const isMatched = matched.includes(pair);
    const isActive = side === 'left' && active === pair;
    const isWrong = side === 'right' && wrong === pair;
    const label = step.pairs[pair][side === 'left' ? 0 : 1];
    return (
      <Pressable
        key={`${side}-${pair}`}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isMatched, selected: isActive }}
        disabled={isMatched}
        onPress={() => pick(pair, side)}
        style={[
          styles.matchCell,
          isActive && styles.matchActive,
          isWrong && styles.matchWrong,
          isMatched && styles.matchDone,
        ]}
      >
        <Text style={[styles.matchText, isMatched && { color: Feedback.correctText }]}>
          {label}
        </Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>Match the pairs</Text>
      <Text accessibilityRole="header" style={lessonText.prompt}>
        {step.prompt}
      </Text>
      <Text style={lessonText.small}>
        Tap a {languageDetails[lesson.track].name} phrase, then its meaning.
      </Text>
      <View style={styles.matchGrid}>
        <View style={styles.matchColumn}>{left.map((pair) => cell(pair, 'left'))}</View>
        <View style={styles.matchColumn}>{right.map((pair) => cell(pair, 'right'))}</View>
      </View>
    </View>
  );
}

function Complete({
  lesson,
  graded,
  correct,
  spoken,
  onRetry,
  results,
}: {
  lesson: StepLesson;
  graded: number;
  correct: number;
  spoken: boolean;
  onRetry: () => void;
  /** A checkpoint's results by skill, shown before the usual summary. */
  results?: ReactNode;
}) {
  const colors = trackColors[lesson.track];
  return (
    <>
      <View style={styles.celebrate}>
        <Animated.View
          entering={ZoomIn.springify().damping(12)}
          style={[styles.badge, { backgroundColor: colors.accent }]}
        >
          <MaterialCommunityIcons name="check-bold" size={40} color={colors.onAccent} />
        </Animated.View>
        <Text accessibilityRole="header" style={lessonText.title}>
          {lesson.session} done
        </Text>
        <Text style={styles.score}>
          {correct}/{graded} right first time
        </Text>
      </View>
      <Animated.View entering={FadeInDown.delay(180).springify()} style={styles.stats}>
        <Stat label="Review phrases" value={String(lesson.phrases.length)} />
        <Stat label="Speaking" value={spoken ? 'Practised' : 'Skipped'} />
        <Stat
          label="Phrase review"
          value={lesson.phrases.length ? 'Scheduled' : 'No new phrases'}
        />
      </Animated.View>
      {results}
      <UnitStep lesson={lesson} />
      {lesson.session === 'Exam task' ? <UnitCallInvite lesson={lesson} /> : null}
      <InfoCard icon="check-circle-outline" title="What you practised">
        {lesson.outcome}
      </InfoCard>
      <Text style={lessonText.lead}>
        {lesson.phrases.length
          ? 'Saved. New phrases come back for review tomorrow; earlier review progress is kept.'
          : 'Saved. This session reused earlier language. Your existing review schedule continues.'}
      </Text>
      <TextButton title="Practise this lesson again" onPress={onRetry} />
    </>
  );
}

/** After a unit's last session: talk it through with the unit's character for three minutes. */
function UnitCallInvite({ lesson }: { lesson: StepLesson }) {
  const router = useRouter();
  const used = useCoachingStore((state) => state.usedUnitCalls);
  const call = getUnitCall(lesson.unit.id);
  if (!call || call.track !== lesson.track) return null;
  const colors = trackColors[lesson.track];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Talk it through: a three-minute call with ${call.character}`}
      onPress={() => router.push(`/conversation?track=${lesson.track}&call=${call.id}` as Href)}
      style={({ pressed }) => [
        styles.callInvite,
        { backgroundColor: colors.tint },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.callIcon, { backgroundColor: Palette.ink }]}>
        <MaterialCommunityIcons name="phone-outline" size={22} color={Palette.lime} />
      </View>
      <View style={{ flex: 1, gap: space(0.5) }}>
        <Text style={styles.unitStepTitle}>Talk it through with {call.character}</Text>
        <Text style={styles.unitStepNote}>
          A three-minute call using this unit’s phrases.{' '}
          {used.includes(call.id)
            ? 'More calls come with Vokeno Plus.'
            : 'Your first call for this unit is free.'}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={Palette.secondary} />
    </Pressable>
  );
}

const skillNames: Record<Skill, string> = {
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking',
};

/**
 * A checkpoint's results, one line per skill, then the lessons that would help most. Speaking is
 * self-practice here, so it is never scored. Nothing is locked: the next unit stays open.
 */
function CheckpointResults({
  steps,
  firstTry,
  spoken,
}: {
  steps: LessonStep[];
  firstTry: boolean[];
  spoken: boolean;
}) {
  const router = useRouter();
  const marked = steps.filter(isGradedStep);
  const tally = new Map<Skill, { right: number; total: number }>();
  const revisit: string[] = [];
  marked.forEach((step, index) => {
    const right = firstTry[index] === true;
    if (step.skill) {
      const entry = tally.get(step.skill) ?? { right: 0, total: 0 };
      tally.set(step.skill, { right: entry.right + Number(right), total: entry.total + 1 });
    }
    if (!right && step.revisit && !revisit.includes(step.revisit)) revisit.push(step.revisit);
  });
  const lessons = revisit
    .map((id) => foundationLessons.find((item) => item.id === id))
    .filter((item): item is StepLesson => Boolean(item && item.format === 'steps'))
    .slice(0, 3);
  return (
    <View style={styles.results} accessibilityLabel="Results by skill">
      <Text style={styles.unitStepTitle}>Your results by skill</Text>
      {(['reading', 'listening', 'writing', 'speaking'] as const).map((skill) => {
        const entry = tally.get(skill);
        const value =
          skill === 'speaking'
            ? spoken
              ? 'Practised, not scored'
              : 'Not practised yet'
            : entry
              ? `${entry.right} of ${entry.total}`
              : 'Not checked';
        const strong = entry && entry.right === entry.total;
        return (
          <View key={skill} style={styles.resultRow}>
            <MaterialCommunityIcons
              name={
                skill === 'speaking'
                  ? 'microphone-outline'
                  : strong
                    ? 'check-circle'
                    : 'circle-half-full'
              }
              size={20}
              color={strong ? Feedback.correctFill : Palette.secondary}
            />
            <Text style={styles.resultSkill}>{skillNames[skill]}</Text>
            <Text style={styles.resultValue}>{value}</Text>
          </View>
        );
      })}
      <Text style={[styles.unitStepTitle, { marginTop: space(2) }]}>
        {lessons.length ? 'Practise next' : 'Nothing to fix'}
      </Text>
      {lessons.length ? (
        lessons.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Practise ${item.title}, ${unitName(item.unit)}`}
            onPress={() => router.push(`/foundation/${item.id}` as Href)}
            style={({ pressed }) => [styles.revisit, pressed && styles.pressed]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.resultSkill}>{item.title}</Text>
              <Text style={styles.unitStepNote}>
                {unitName(item.unit)} · {item.session}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={Palette.secondary} />
          </Pressable>
        ))
      ) : (
        <Text style={styles.unitStepNote}>Everything here was right first time. Carry on.</Text>
      )}
      <Text style={styles.unitStepNote}>
        A checkpoint shows what to practise. It is not an exam score, and the next unit is open
        either way.
      </Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={lessonText.small}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footerHint: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    paddingVertical: space(2),
    textAlign: 'center',
  },
  body: {
    gap: space(4),
    paddingBottom: space(8),
    paddingHorizontal: space(5),
    paddingTop: space(2),
  },
  intro: { gap: space(2), marginBottom: space(1) },
  stack: { gap: space(4) },
  alert: {
    backgroundColor: Feedback.closeBg,
    borderRadius: Radius.md,
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    padding: space(3),
  },
  pressed: { opacity: 0.75 },
  sceneControls: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  playAll: {
    alignItems: 'center',
    backgroundColor: Palette.ink,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: space(2),
    minHeight: 44,
    paddingHorizontal: space(4),
  },
  playAllText: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  chip: {
    alignItems: 'center',
    borderColor: Palette.line,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: space(2),
    minHeight: 44,
    paddingHorizontal: space(4),
  },
  chipOn: { backgroundColor: Palette.white, borderColor: Palette.ink },
  chipText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.label },
  bubbles: { gap: space(2) },
  bubbleRow: { alignItems: 'flex-start' },
  bubbleRowMine: { alignItems: 'flex-end' },
  bubble: {
    borderRadius: Radius.lg,
    gap: space(0.5),
    maxWidth: '86%',
    paddingHorizontal: space(4),
    paddingVertical: space(2),
  },
  bubbleTheirs: { backgroundColor: Palette.white, borderTopLeftRadius: Radius.sm },
  bubbleMine: { borderTopRightRadius: Radius.sm },
  bubbleActive: { borderColor: Palette.ink, borderWidth: 1.5 },
  speaker: { color: Palette.muted, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.caption },
  bubbleText: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  bubbleChanged: { textDecorationLine: 'underline' },
  bubbleMeaning: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: space(2),
    padding: space(4),
  },
  cardRow: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  cardCopy: { flex: 1, gap: space(0.5) },
  target: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
  },
  meaning: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  note: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  ruleBody: {
    color: Palette.ink,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  table: { backgroundColor: Palette.white, borderRadius: Radius.lg, overflow: 'hidden' },
  tableRow: {
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: space(3),
    paddingHorizontal: space(4),
    paddingVertical: space(3),
  },
  tableLast: { borderBottomWidth: 0 },
  tableLeft: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
  },
  tableRight: {
    color: Palette.secondary,
    flex: 1,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
  },
  example: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(2),
    paddingLeft: space(4),
    paddingRight: space(2),
    paddingVertical: space(2),
  },
  exampleText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  context: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: space(4),
  },
  contextText: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  listen: { alignItems: 'center', flexDirection: 'row', gap: space(4) },
  options: { gap: space(2) },
  answerLine: {
    alignItems: 'center',
    borderBottomColor: Palette.line,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    borderRadius: Radius.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space(2),
    minHeight: 64,
    paddingVertical: space(2),
  },
  placeholder: { color: Palette.muted, fontFamily: VokaFonts.body, fontSize: FontSize.body },
  bank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space(2),
    justifyContent: 'center',
    paddingTop: space(2),
  },
  tile: {
    borderRadius: Radius.md,
    minHeight: 46,
    paddingHorizontal: space(4),
    justifyContent: 'center',
  },
  tileUsed: { backgroundColor: Palette.soft },
  tileFace: { minHeight: 46, justifyContent: 'center', paddingHorizontal: space(4) },
  tileText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.heading },
  input: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.lg,
    borderWidth: 2,
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.heading,
    minHeight: 110,
    padding: space(4),
    textAlignVertical: 'top',
  },
  matchGrid: { flexDirection: 'row', gap: space(2) },
  matchColumn: { flex: 1, gap: space(2) },
  matchCell: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.md,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 60,
    padding: space(2),
  },
  matchActive: { borderColor: Palette.ink },
  matchWrong: { backgroundColor: Feedback.wrongBg, borderColor: Feedback.wrongText },
  matchDone: { backgroundColor: Feedback.correctBg, borderColor: 'transparent' },
  matchText: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    textAlign: 'center',
  },
  celebrate: { alignItems: 'center', gap: space(2), paddingTop: space(4) },
  badge: {
    alignItems: 'center',
    borderRadius: Radius.pill,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  score: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.body },
  stats: { flexDirection: 'row', gap: space(2) },
  stat: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    flex: 1,
    gap: space(0.5),
    paddingVertical: space(4),
  },
  statValue: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  unitStep: {
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    gap: space(2),
    padding: space(4),
  },
  unitStepTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  unitStepRow: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  unitStepCount: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
  },
  unitStepNote: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: FontSize.label },
  callInvite: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(3),
    padding: space(4),
  },
  callIcon: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  results: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: space(2),
    padding: space(4),
  },
  resultRow: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  resultSkill: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
  },
  resultValue: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
  },
  revisit: {
    alignItems: 'center',
    borderColor: Palette.line,
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: space(2),
    minHeight: 56,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
});

/** The unit this lesson belongs to, with its progress moving forward by this lesson. */
function UnitStep({ lesson }: { lesson: StepLesson }) {
  const progress = useCoachingStore((state) => state.foundations);
  const context = lessonContext(lesson.track, progress, lesson.id);
  if (!context) return null;
  const { unit } = context;
  const total = unit.lessons.length;
  const firstTime = (progress[lesson.id]?.attempts.length ?? 0) === 1;
  return (
    <View
      accessible
      accessibilityLabel={`${unit.label}: ${unit.done} of ${total} lessons done`}
      style={styles.unitStep}
    >
      <Text style={styles.unitStepTitle}>{unit.label}</Text>
      <View style={styles.unitStepRow}>
        <ProgressFill
          value={unit.done / total}
          from={firstTime ? (unit.done - 1) / total : unit.done / total}
          color={trackColors[lesson.track].deep}
          track={Palette.soft}
          height={10}
        />
        <Text style={styles.unitStepCount}>
          {unit.done}/{total}
        </Text>
      </View>
      <Text style={styles.unitStepNote}>
        {unit.done === total
          ? 'Unit complete.'
          : `${total - unit.done} more ${total - unit.done === 1 ? 'lesson' : 'lessons'} in this unit.`}
      </Text>
    </View>
  );
}
