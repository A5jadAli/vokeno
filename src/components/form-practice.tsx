import { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';

import { answerInputProps, lessonText } from '@/components/lesson-ui';
import { Feedback, Palette, VokaFonts } from '@/constants/theme';
import { ListeningPrompt } from '@/components/listening-prompt';
import type { LessonAudio } from '@/features/audio/use-lesson-audio';
import {
  cleanFormValue,
  formFieldCorrect,
  MAX_FORM_FIELD_LENGTH,
  readFormDraft,
  writeFormDraft,
  type FormStep,
} from '@/features/foundations/form-practice';

export function FormPractice({
  step,
  draft,
  onDraft,
  setReady,
  report,
  complete,
  speech,
  onHelp,
}: {
  step: FormStep;
  draft: string;
  onDraft: (draft: string) => void;
  setReady: (ready: { check: () => void } | null) => void;
  report: (correct: boolean, title: string, message: string) => void;
  complete: boolean;
  speech: LessonAudio;
  onHelp: () => void;
}) {
  const values = readFormDraft(draft, step.fields.length);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const check = (answers: string[]) => {
    const results = step.fields.map((field, index) => formFieldCorrect(field, answers[index]));
    setChecked(results);
    const correct = results.every(Boolean);
    if (correct) Keyboard.dismiss();
    else inputs.current[results.indexOf(false)]?.focus();
    report(
      correct,
      correct ? 'Correct' : 'Check the marked fields',
      correct
        ? step.explanation
        : `Check ${step.fields
            .filter((_, index) => !results[index])
            .map((field) => field.label)
            .join(', ')}. Your other entries are kept.`,
    );
  };
  useEffect(() => {
    setReady({ check: () => check(values) });
    // Restore the saved form immediately. Edits refresh the action with their new values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>Complete the form</Text>
      <Text accessibilityRole="header" style={lessonText.prompt}>
        {step.prompt}
      </Text>
      <View style={styles.context}>
        <Text selectable style={lessonText.lead}>
          {step.context}
        </Text>
      </View>
      <Text style={lessonText.small}>
        Use the fictional details above, not your own contact information. Keep accents and every
        digit.
      </Text>
      {step.audio ? (
        <ListeningPrompt text={step.audio} speech={speech} complete={complete} onHelp={onHelp} />
      ) : null}
      {step.fields.map((field, index) => (
        <View key={field.label} style={styles.field}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            ref={(input) => {
              inputs.current[index] = input;
            }}
            {...answerInputProps}
            accessibilityLabel={field.label}
            accessibilityHint={field.hint}
            autoCapitalize="none"
            maxLength={MAX_FORM_FIELD_LENGTH}
            value={values[index]}
            editable={!complete}
            style={[
              styles.input,
              checked?.[index] === false && styles.wrong,
              checked?.[index] === true && styles.correct,
            ]}
            onChangeText={(value) => {
              const next = values.map((previous, i) =>
                i === index ? cleanFormValue(value) : previous,
              );
              onDraft(writeFormDraft(next));
              setChecked(null);
              setReady({ check: () => check(next) });
            }}
          />
          {checked?.[index] === false ? (
            <Text accessibilityRole="alert" style={styles.hint}>
              {field.hint}
            </Text>
          ) : null}
          {checked?.[index] === true ? <Text style={lessonText.small}>Correct</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  field: { gap: 8 },
  context: { backgroundColor: Palette.white, borderRadius: 16, padding: 16 },
  label: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 16 },
  input: {
    borderColor: Palette.line,
    borderWidth: 2,
    borderRadius: 14,
    minHeight: 52,
    padding: 14,
    backgroundColor: Palette.white,
    color: Palette.ink,
    fontFamily: VokaFonts.body,
    fontSize: 17,
  },
  wrong: { borderColor: Feedback.wrongInk },
  correct: { borderColor: Feedback.correctInk },
  hint: { color: Feedback.wrongInk, fontFamily: VokaFonts.body, fontSize: 14, lineHeight: 21 },
});
