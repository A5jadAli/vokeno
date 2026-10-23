import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Tactile } from '@/components/motion';
import { Feedback, Palette, Selection, VokaFonts, withAlpha } from '@/constants/theme';
import { haptic } from '@/features/feedback/haptics';

const looks = {
  idle: {
    face: Palette.white,
    border: withAlpha(Palette.ink, 0.12),
    lip: withAlpha(Palette.ink, 0.14),
    ink: Palette.ink,
  },
  selected: { face: Selection.face, border: Palette.yellow, lip: Selection.lip, ink: Palette.ink },
  correct: {
    face: Feedback.correctBg,
    border: Feedback.correctAccent,
    lip: Feedback.correctAccent,
    ink: Feedback.correctInk,
  },
  incorrect: {
    face: Feedback.wrongBg,
    border: Feedback.wrongAccent,
    lip: Feedback.wrongAccent,
    ink: Feedback.wrongInk,
  },
} as const;

export function AnswerChoice({
  label,
  selected,
  result,
  disabled = false,
  onPress,
}: {
  label: string;
  selected: boolean;
  result?: 'correct' | 'incorrect';
  disabled?: boolean;
  onPress: () => void;
}) {
  const look = looks[result ?? (selected ? 'selected' : 'idle')];
  const shake = useSharedValue(0);
  const pop = useSharedValue(1);
  const previous = useRef(result);
  useEffect(() => {
    if (result === previous.current) return;
    previous.current = result;
    if (result === 'incorrect') {
      shake.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 70 }),
        withTiming(-5, { duration: 60 }),
        withTiming(5, { duration: 60 }),
        withTiming(0, { duration: 50 }),
      );
      haptic.wrong();
    }
    if (result === 'correct') {
      pop.value = withSequence(withSpring(1.035, { stiffness: 500 }), withSpring(1));
      haptic.correct();
    }
  }, [pop, result, shake]);
  const popStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: pop.value }],
  }));
  return (
    <Animated.View style={popStyle}>
      <Tactile
        accessibilityRole="radio"
        accessibilityLabel={label}
        accessibilityHint={
          result === 'correct'
            ? 'Correct answer'
            : result === 'incorrect'
              ? 'Not quite. Try another answer.'
              : undefined
        }
        accessibilityState={{ checked: selected }}
        ariaChecked={selected}
        disabled={disabled}
        face={look.face}
        faceTestID="answer-face"
        lip={look.lip}
        borderColor={look.border}
        borderWidth={2}
        radius={18}
        onPress={() => {
          if (!selected) haptic.select();
          onPress();
        }}
      >
        <View style={styles.row}>
          <Text style={[styles.label, { color: look.ink }]}>{label}</Text>
          {result ? (
            <MaterialCommunityIcons
              name={result === 'correct' ? 'check-circle' : 'close-circle'}
              size={24}
              color={look.border}
            />
          ) : null}
        </View>
      </Tactile>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  label: { flex: 1, fontFamily: VokaFonts.bodySemiBold, fontSize: 16, lineHeight: 23 },
});
