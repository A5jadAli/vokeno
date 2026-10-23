import { useState } from 'react';
import { Redirect } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import { AnswerChoice } from '@/components/answer-choice';
import {
  FontSize,
  LineHeight,
  Palette,
  Radius,
  Selection,
  space,
  VokaFonts,
} from '@/constants/theme';
import { readingLessons } from '@/features/reading/catalog';
import { useCoachingStore } from '@/features/coaching/store';
import { useSelectedLanguage } from '@/features/language/selection';
export default function ReadingScreen() {
  const [track] = useSelectedLanguage();
  if (track !== 'EN') return <Redirect href={`/sprint?track=${track}`} />;
  return <EnglishReading />;
}

function EnglishReading() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const lesson = readingLessons[lessonIndex];
  const question = lesson.questions[questionIndex];
  const complete = useCoachingStore((state) => state.completeUnit);
  const completed = useCoachingStore((state) => state.completedUnitIds);
  const chooseLesson = (index: number) => {
    setLessonIndex(index);
    setQuestionIndex(0);
    setSelected(null);
  };
  return (
    <AppScreen showNav={false}>
      <View style={{ padding: space(5), gap: space(4) }}>
        <HeaderBack variant="close" />
        <Eyebrow>Read, check, explain</Eyebrow>
        <Text
          style={{ color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.display }}
        >
          English reading practice
        </Text>
        {readingLessons.map((item, index) => (
          <Button
            key={item.id}
            label={`${item.title}${completed.includes(`reading-${item.id}`) ? ' · Practised' : ''}`}
            selected={lessonIndex === index}
            onPress={() => {
              if (lessonIndex !== index) chooseLesson(index);
            }}
          />
        ))}
        <Eyebrow>{lesson.kind}</Eyebrow>
        <Text style={styles.question}>{lesson.title}</Text>
        <Text selectable style={styles.passage}>
          {lesson.text}
        </Text>
        {question ? (
          <>
            <Text style={styles.copy}>
              Question {questionIndex + 1} of {lesson.questions.length}
            </Text>
            <Text style={styles.question}>{question.prompt}</Text>
            {question.options.map((option, index) => (
              <AnswerChoice
                key={option}
                label={option}
                selected={selected === index}
                result={
                  selected === index
                    ? index === question.answer
                      ? 'correct'
                      : 'incorrect'
                    : undefined
                }
                disabled={selected === question.answer}
                onPress={() => setSelected(index)}
              />
            ))}
            {selected !== null ? (
              <Text accessibilityLiveRegion="polite" style={styles.copy}>
                {selected === question.answer
                  ? 'Correct.'
                  : 'Not quite. Check the evidence and try again.'}{' '}
                {question.explanation}
              </Text>
            ) : null}
            {selected === question.answer ? (
              <Button
                primary
                label={
                  questionIndex === lesson.questions.length - 1
                    ? 'Save reading practice'
                    : 'Next question'
                }
                onPress={() => {
                  if (questionIndex === lesson.questions.length - 1)
                    complete(`reading-${lesson.id}`);
                  useCoachingStore.getState().recordPractice('lesson', 'EN');
                  setQuestionIndex(questionIndex + 1);
                  setSelected(null);
                }}
              />
            ) : null}
          </>
        ) : (
          <>
            <Eyebrow>Practice saved</Eyebrow>
            <Text style={styles.copy}>All three checked. Now explain one answer aloud.</Text>
            <Button
              primary
              label={
                lessonIndex < readingLessons.length - 1 ? 'Next reading' : 'Back to first reading'
              }
              onPress={() => chooseLesson((lessonIndex + 1) % readingLessons.length)}
            />
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  passage: {
    color: Palette.ink,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  question: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
  },
  copy: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
});
function Button({
  label,
  onPress,
  disabled = false,
  selected = false,
  primary = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  selected?: boolean;
  primary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      aria-pressed={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 48,
        padding: space(4),
        backgroundColor: primary ? Palette.ink : selected ? Selection.faceStrong : Palette.white,
        borderColor: selected ? Selection.border : primary ? Palette.ink : Palette.line,
        borderWidth: 2,
        borderRadius: Radius.lg,
        opacity: disabled || pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{ color: primary ? Palette.cream : Palette.ink, fontFamily: VokaFonts.bodySemiBold }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
