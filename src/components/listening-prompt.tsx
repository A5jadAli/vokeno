import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AudioIconButton } from '@/components/lesson-audio-button';
import { InfoCard, lessonText, TextButton } from '@/components/lesson-ui';
import type { LessonAudio } from '@/features/audio/use-lesson-audio';

/** Reading support keeps a dictation accessible without recording it as unaided listening. */
export function ListeningPrompt({
  text,
  speech,
  complete,
  onHelp,
}: {
  text: string;
  speech: LessonAudio;
  complete: boolean;
  onHelp: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <View style={styles.stack}>
      <View style={styles.audio}>
        <AudioIconButton
          speech={speech}
          text={text}
          label="Play the audio"
          size={64}
          tone="accent"
        />
        <AudioIconButton
          speech={speech}
          text={text}
          label="Play the audio slowly"
          rate={0.6}
          slow
          size={48}
        />
      </View>
      {!complete && !revealed ? (
        <TextButton
          title="Read instead"
          expanded={false}
          onPress={() => {
            speech.stop();
            setRevealed(true);
            onHelp();
          }}
        />
      ) : null}
      {complete || revealed ? (
        <InfoCard icon="text-box-outline" title={complete ? 'You heard' : 'Reading support'}>
          {text}
        </InfoCard>
      ) : null}
      {revealed ? (
        <Text style={lessonText.small}>
          With text help, this counts as reading practice rather than an unaided listening answer.
        </Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  stack: { gap: 12 },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
