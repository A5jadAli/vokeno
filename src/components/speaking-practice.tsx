import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AudioIconButton } from '@/components/lesson-audio-button';
import { InfoCard, lessonText, TextButton } from '@/components/lesson-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import type { LessonAudio } from '@/features/audio/use-lesson-audio';
import type { LessonStep } from '@/features/foundations/types';

/** Models support an attempt without giving away the response before the learner tries. */
export function SpeakingPractice({
  step,
  speech,
}: {
  step: Extract<LessonStep, { kind: 'speak' }>;
  speech: LessonAudio;
}) {
  const [showModel, setShowModel] = useState(false);
  const [showTwist, setShowTwist] = useState(false);
  return (
    <View style={styles.stack}>
      <Text style={lessonText.meta}>Speaking practice</Text>
      <Text accessibilityRole="header" style={lessonText.prompt}>
        Your turn
      </Text>
      <InfoCard icon="account-voice" title="Your task" tone="ink">
        {step.prompt}
      </InfoCard>
      <Text style={lessonText.small}>
        Try it in your own words. Need a starting point? Open the example whenever you like.
      </Text>
      <TextButton
        title={showModel ? 'Hide the example and try again' : 'Show an example'}
        expanded={showModel}
        onPress={() => {
          speech.stop();
          setShowModel(!showModel);
        }}
      />
      {showModel ? (
        <View style={styles.stack}>
          <Text style={lessonText.meta}>One possible response</Text>
          {step.lines.map((line, index) => (
            <View key={`${index}:${line}`} style={styles.example}>
              <Text style={styles.exampleText}>{line}</Text>
              <AudioIconButton speech={speech} text={line} label={`Hear: ${line}`} />
            </View>
          ))}
        </View>
      ) : null}
      {step.tip ? (
        <InfoCard icon="waveform" title="Sound and rhythm">
          {step.tip}
        </InfoCard>
      ) : null}
      {step.mission ? (
        <>
          <View style={styles.checks}>
            <Text style={lessonText.meta}>Check your own response</Text>
            {step.mission.checks.map((check) => (
              <Text key={check} style={lessonText.small}>
                • {check}
              </Text>
            ))}
          </View>
          <TextButton
            title={showTwist ? 'Hide the extra situation' : 'Try a different situation'}
            expanded={showTwist}
            onPress={() => {
              speech.stop();
              setShowModel(false);
              setShowTwist(!showTwist);
            }}
          />
          {showTwist ? (
            <InfoCard icon="swap-horizontal" title="Change the situation">
              {step.mission.twist}
            </InfoCard>
          ) : null}
        </>
      ) : null}
      <Text style={lessonText.small}>
        Nothing is recorded or scored here. Marking this done records practice, not a speaking
        assessment.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 14 },
  checks: { gap: 6 },
  example: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 12,
  },
  exampleText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: 18,
    lineHeight: 26,
  },
});
