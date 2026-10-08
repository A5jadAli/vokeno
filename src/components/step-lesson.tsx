import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { AnswerChoice } from '@/components/answer-choice';
import { AudioIconButton } from '@/components/lesson-audio-button';
import {
  ActionBar,
  Feedback,
  InfoCard,
  LessonTopBar,
  lessonText,
  PrimaryAccent,
  PrimaryButton,
  TextButton,
} from '@/components/lesson-ui';
import { ProgressFill, Tactile } from '@/components/motion';
import { SessionFooter } from '@/components/session-footer';
import { AppScreen } from '@/components/voka-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import { haptic } from '@/features/feedback/haptics';
import {
  gradeFoundationWriting,
  normaliseFoundationAnswer,
  optionOrder,
  type LessonStep,
  type StepLesson,
} from '@/features/foundations/catalog';
import { levelLabel } from '@/features/foundations/level-status';
import {
  freshFoundationEntry,
  MAX_DRAFT_LENGTH,
  MAX_FOUNDATION_ATTEMPTS,
  type FoundationEntry,
} from '@/features/foundations/progress';
import { isGradedStep } from '@/features/foundations/types';
import { lessonContext } from '@/features/journey/course';
import { languageDetails, trackColors } from '@/features/language/config';
import { useLanguageSelection } from '@/features/language/selection';
import { useLessonSpeech, type LessonSpeech } from '@/features/listening/use-lesson-speech';
import { REVIEW_INTERVALS, seedCards } from '@/features/review/schedule';

type Result = { tone: 'correct' | 'wrong' | 'close'; title: string; message?: string };

const keyboardNote = {
  DE: 'Punctuation and capital letters are not marked. No ß or umlaut key? Type ss, ae, oe or ue.',
  EN: 'Punctuation and capital letters are not marked.',
  ES: 'Punctuation and capital letters do not count. A missing accent is accepted, and you will see where it goes. Ñ always counts.',
} as const;

/** A unit session: a short run of varied steps, saved after every step. */
export function StepLessonPlayer({ lesson }: { lesson: StepLesson }) {
  const router = useRouter();
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
  const speech = useLessonSpeech(languageDetails[lesson.track].speechLocale);
  const [result, setResult] = useState<Result | null>(null);
  // Bumped to reset the current step's local state (selection, tiles, pairs).
  const [attemptKey, setAttemptKey] = useState(0);
  const [ready, setReady] = useState<{ check: () => void } | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const steps = lesson.steps;
  const index = Math.min(entry.step, steps.length);
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
    if (entry.firstTry[gradedIndex] !== undefined) return;
    const firstTry = [...entry.firstTry];
    firstTry[gradedIndex] = correct;
    update({ firstTry });
  };
  const finish = (spoken: boolean) => {
    resetTransient();
    useCoachingStore.getState().recordActivity(`lesson:${lesson.id}`, lesson.track);
    haptic.complete();
    update({
      step: steps.length,
      draft: '',
      cards: seedCards(lesson, entry),
      attempts: [
        ...entry.attempts,
        {
          at: new Date().toISOString(),
          correctFirstTry: entry.firstTry.slice(0, graded).filter(Boolean).length,
          spoken: spoken || entry.answers[0] === 1,
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
    save(lesson.id, { ...freshFoundationEntry(), attempts: entry.attempts, cards: entry.cards });
  };
  const report = (correct: boolean, title: string, message: string, firstTry = correct) => {
    if (correct) {
      haptic.correct();
      setResult({ tone: 'correct', title, message });
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
          <PrimaryButton
            tone="green"
            title="Continue"
            icon="arrow-right"
            onPress={() => advance()}
          />
        ) : result && step.kind !== 'type' ? (
          <PrimaryButton
            tone="red"
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
        <LessonTopBar progress={progress} label={levelLabel(lesson.track, lesson.level)} />
        <View style={styles.body}>
          {speech.error ? (
            <Text accessibilityRole="alert" style={styles.alert}>
              {speech.error}
            </Text>
          ) : null}
          {index === 0 && step ? (
            <View style={styles.intro}>
              <Text style={lessonText.meta}>
                Unit {lesson.unit.number} · {lesson.unit.title} · {lesson.session}
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
                  update({ draft: draft.slice(0, MAX_DRAFT_LENGTH) });
                }}
                setReady={setReady}
                report={report}
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
              onPath={() => router.replace(`/sprint?track=${lesson.track}` as Href)}
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
  speech: LessonSpeech;
  languageName: string;
  result: Result | null;
  mistakes: number;
  draft: string;
  onDraft: (draft: string) => void;
  setReady: (ready: { check: () => void } | null) => void;
  report: (correct: boolean, title: string, message: string, firstTry?: boolean) => void;
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
      return <SpeakStep {...props} step={step} />;
  }
}

type Of<K extends LessonStep['kind']> = Extract<LessonStep, { kind: K }>;

function SceneStep({ step, speech }: StepProps & { step: Of<'scene'> }) {
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
              : void speech.playSequence(texts, real ? 0.92 : 0.8, setActiveLine)
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
        <View accessibilityRole="tablist" style={styles.segment}>
          {[
            { value: false, label: 'Careful' },
            { value: true, label: 'As people say it' },
          ].map((option) => (
            <Pressable
              key={option.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: real === option.value }}
              onPress={() => {
                speech.stop();
                setReal(option.value);
              }}
              style={[styles.segmentItem, real === option.value && styles.segmentActive]}
            >
              <Text style={styles.segmentText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
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
                void speech.play(texts[lineIndex], real ? 0.92 : 0.8);
              }}
              style={[styles.bubbleRow, mine && styles.bubbleRowMine]}
            >
              <View
                style={[
                  styles.bubble,
                  mine ? styles.bubbleMine : styles.bubbleTheirs,
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
        <InfoCard icon="lightbulb-on-outline" title="Notice" tone="yellow">
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
                : 'Think about who you are talking to and when, then try another answer.',
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
          result?.tone === 'correct' && { borderColor: Feedback.correctInk },
          result?.tone === 'wrong' && { borderColor: Feedback.wrongInk },
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
      lip="rgba(19,18,17,0.14)"
      radius={12}
      borderColor="rgba(19,18,17,0.14)"
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
}: StepProps & { step: Of<'type'> }) {
  const correctNow = result?.tone === 'correct';
  const check = (value: string) => {
    Keyboard.dismiss();
    const grade = gradeFoundationWriting(
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
      <TextInput
        accessibilityLabel={`Your ${languageName} answer`}
        autoCapitalize="sentences"
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        maxLength={MAX_DRAFT_LENGTH}
        multiline
        placeholder={`Type in ${languageName}`}
        placeholderTextColor={Palette.muted}
        style={[
          styles.input,
          correctNow && { borderColor: Feedback.correctInk },
          result?.tone === 'wrong' && { borderColor: Feedback.wrongInk },
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
        <Text style={[styles.matchText, isMatched && { color: Feedback.correctInk }]}>{label}</Text>
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

function SpeakStep({ step, speech }: StepProps & { step: Of<'speak'> }) {
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>Say it</Text>
      <Text accessibilityRole="header" style={lessonText.prompt}>
        Speak out loud
      </Text>
      <InfoCard icon="account-voice" title="Your task" tone="ink">
        {step.prompt}
      </InfoCard>
      {step.lines.map((line) => (
        <View key={line} style={styles.example}>
          <Text style={styles.exampleText}>{line}</Text>
          <AudioIconButton speech={speech} text={line} label={`Hear: ${line}`} />
        </View>
      ))}
      {step.tip ? (
        <InfoCard icon="waveform" title="Sound and rhythm">
          {step.tip}
        </InfoCard>
      ) : null}
      <Text style={lessonText.small}>
        Say it first, then play it to compare. Nothing is recorded here.
      </Text>
    </View>
  );
}

function Complete({
  lesson,
  graded,
  correct,
  spoken,
  onRetry,
  onPath,
}: {
  lesson: StepLesson;
  graded: number;
  correct: number;
  spoken: boolean;
  onRetry: () => void;
  onPath: () => void;
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
        <Stat label="New words" value={String(lesson.phrases.length)} />
        <Stat label="Speaking" value={spoken ? 'Done' : 'Skipped'} />
        <Stat label="Review" value={`In ${REVIEW_INTERVALS[0]} day`} />
      </Animated.View>
      <UnitStep lesson={lesson} />
      <Text style={lessonText.lead}>
        Your lesson is saved, and its new words are in your review queue. Scheduled review helps you
        remember them. This is practice evidence, not a language level.
      </Text>
      <TextButton title="Practise this lesson again" onPress={onRetry} />
      <TextButton title="Open the course" onPress={onPath} />
    </>
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
    fontSize: 14,
    paddingVertical: 8,
    textAlign: 'center',
  },
  body: { gap: 16, paddingBottom: 32, paddingHorizontal: 20, paddingTop: 8 },
  intro: { gap: 6, marginBottom: 4 },
  stack: { gap: 14 },
  alert: {
    backgroundColor: Feedback.closeBg,
    borderRadius: 14,
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 21,
    padding: 12,
  },
  pressed: { opacity: 0.75 },
  sceneControls: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  playAll: {
    alignItems: 'center',
    backgroundColor: Palette.ink,
    borderRadius: 99,
    flexDirection: 'row',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 18,
  },
  playAllText: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: 15 },
  chip: {
    alignItems: 'center',
    borderColor: Palette.line,
    borderRadius: 99,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
  },
  chipOn: { backgroundColor: Palette.white, borderColor: Palette.ink },
  chipText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  segment: {
    backgroundColor: Palette.soft,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  segmentItem: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  segmentActive: { backgroundColor: Palette.white },
  segmentText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  bubbles: { gap: 8 },
  bubbleRow: { alignItems: 'flex-start' },
  bubbleRowMine: { alignItems: 'flex-end' },
  bubble: { borderRadius: 18, gap: 2, maxWidth: '86%', paddingHorizontal: 14, paddingVertical: 10 },
  bubbleTheirs: { backgroundColor: Palette.white, borderTopLeftRadius: 6 },
  bubbleMine: { backgroundColor: '#E9F4E6', borderTopRightRadius: 6 },
  bubbleActive: { borderColor: Palette.ink, borderWidth: 1.5 },
  speaker: { color: Palette.muted, fontFamily: VokaFonts.bodySemiBold, fontSize: 12 },
  bubbleText: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 16,
    lineHeight: 23,
  },
  bubbleChanged: { textDecorationLine: 'underline' },
  bubbleMeaning: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 14,
  },
  cardRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  cardCopy: { flex: 1, gap: 2 },
  target: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 18, lineHeight: 24 },
  meaning: { color: Palette.ink, fontFamily: VokaFonts.bodyMedium, fontSize: 15, lineHeight: 21 },
  note: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 14, lineHeight: 20 },
  ruleBody: { color: Palette.ink, fontFamily: VokaFonts.body, fontSize: 16, lineHeight: 24 },
  table: { backgroundColor: Palette.white, borderRadius: 16, overflow: 'hidden' },
  tableRow: {
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tableLast: { borderBottomWidth: 0 },
  tableLeft: { color: Palette.ink, flex: 1, fontFamily: VokaFonts.bodyBold, fontSize: 16 },
  tableRight: { color: Palette.secondary, flex: 1, fontFamily: VokaFonts.body, fontSize: 15 },
  example: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
  },
  exampleText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 16,
    lineHeight: 23,
  },
  context: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  contextText: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  listen: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  options: { gap: 10 },
  answerLine: {
    alignItems: 'center',
    borderBottomColor: Palette.line,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    borderRadius: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 64,
    paddingVertical: 8,
  },
  placeholder: { color: Palette.muted, fontFamily: VokaFonts.body, fontSize: 15 },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', paddingTop: 8 },
  tile: { borderRadius: 12, minHeight: 46, paddingHorizontal: 14, justifyContent: 'center' },
  tileUsed: { backgroundColor: Palette.soft },
  tileFace: { minHeight: 46, justifyContent: 'center', paddingHorizontal: 14 },
  tileText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 17 },
  input: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 18,
    borderWidth: 2,
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 18,
    minHeight: 110,
    padding: 16,
    textAlignVertical: 'top',
  },
  matchGrid: { flexDirection: 'row', gap: 10 },
  matchColumn: { flex: 1, gap: 10 },
  matchCell: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: 'rgba(19,18,17,0.12)',
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 60,
    padding: 10,
  },
  matchActive: { borderColor: Palette.ink },
  matchWrong: { backgroundColor: Feedback.wrongBg, borderColor: Feedback.wrongInk },
  matchDone: { backgroundColor: Feedback.correctBg, borderColor: 'transparent' },
  matchText: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  celebrate: { alignItems: 'center', gap: 10, paddingTop: 16 },
  badge: {
    alignItems: 'center',
    borderRadius: 99,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  score: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 16 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 18,
    flex: 1,
    gap: 2,
    paddingVertical: 14,
  },
  statValue: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 18 },
  unitStep: { backgroundColor: Palette.white, borderRadius: 18, gap: 8, padding: 16 },
  unitStepTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 16 },
  unitStepRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  unitStepCount: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  unitStepNote: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 14 },
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
          color={trackColors[lesson.track].accent}
          track="rgba(19,18,17,0.08)"
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
