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
import { answeredRight, useAnswerSound } from '@/features/feedback/answer';
import { haptic } from '@/features/feedback/haptics';

// A choice is marked by shape as well as colour: an empty or filled radio before checking, then a
// tick or a cross. Selection is ink in every language, so it never looks like a language colour
// or like "nearly right".
const looks = {
  idle: { face: Palette.white, border: Palette.border, ink: Palette.ink },
  selected: { face: Selection.face, border: Selection.border, ink: Palette.ink },
  correct: { face: Feedback.correctBg, border: Feedback.correctFill, ink: Feedback.correctText },
  incorrect: { face: Feedback.wrongBg, border: Feedback.wrongFill, ink: Feedback.wrongText },
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
  useAnswerSound();
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
      answeredRight();
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
        borderColor={look.border}
        borderWidth={2}
        radius={Radius.lg}
        onPress={() => {
          if (!selected) haptic.select();
          onPress();
        }}
      >
        <View style={styles.row}>
          <Text style={[styles.label, { color: look.ink }]}>{label}</Text>
          <MaterialCommunityIcons
            name={
              result === 'correct'
                ? 'check-circle'
                : result === 'incorrect'
                  ? 'close-circle'
                  : selected
                    ? 'radiobox-marked'
                    : 'radiobox-blank'
            }
            size={24}
            color={result || selected ? look.border : Palette.muted}
          />
        </View>
      </Tactile>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    minHeight: 58,
    paddingHorizontal: space(4),
    paddingVertical: space(4),
  },
  label: {
    flex: 1,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
});
