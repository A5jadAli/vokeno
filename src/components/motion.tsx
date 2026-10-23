import { useEffect, useState, type PropsWithChildren } from 'react';
import {
  Pressable,
  type AccessibilityState,
  type PressableProps,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Palette, Radius } from '@/constants/theme';

type TactileProps = PropsWithChildren<{
  face: string;
  radius?: number;
  borderColor?: string;
  borderWidth?: number;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  faceStyle?: StyleProp<ViewStyle>;
  /** Lets tests find the coloured surface regardless of how it is nested. */
  faceTestID?: string;
  accessibilityRole?: PressableProps['accessibilityRole'];
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  ariaChecked?: boolean;
}>;

/**
 * A flat pressable surface, like buttons in WhatsApp or Instagram: Android shows its ripple and
 * every platform gets a slight press-in scale.
 */
export function Tactile({
  face,
  radius = Radius.lg,
  borderColor,
  borderWidth = 0,
  disabled = false,
  onPress,
  style,
  faceStyle,
  faceTestID,
  children,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  ariaChecked,
}: TactileProps) {
  const press = useSharedValue(0);
  const faceAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - press.value * 0.02 }],
  }));
  return (
    <View style={style}>
      <Pressable
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled, ...accessibilityState }}
        aria-checked={ariaChecked}
        aria-disabled={disabled}
        // Drawn in the foreground so the ripple shows on top of the coloured face.
        android_ripple={disabled ? undefined : { color: Palette.soft, foreground: true }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          press.value = withTiming(1, { duration: 80 });
        }}
        onPressOut={() => {
          press.value = withTiming(0, { duration: 140 });
        }}
        style={{ borderRadius: radius, overflow: 'hidden' }}
      >
        <Animated.View
          testID={faceTestID}
          style={[
            { backgroundColor: face, borderRadius: radius, borderColor, borderWidth },
            faceStyle,
            faceAnimation,
          ]}
        >
          {children}
        </Animated.View>
      </Pressable>
    </View>
  );
}

/** A thin progress bar whose fill springs to its new value, optionally from an earlier one. */
export function ProgressFill({
  value,
  color,
  track,
  height = 10,
  from = 0,
}: {
  value: number;
  color: string;
  track: string;
  height?: number;
  /** Where the fill starts, so a completion can show progress moving forward. */
  from?: number;
}) {
  const [width, setWidth] = useState(0);
  const fill = useSharedValue(Math.max(0, Math.min(1, from)));
  useEffect(() => {
    fill.value = withSpring(Math.max(0, Math.min(1, value)), { damping: 20, stiffness: 140 });
  }, [fill, value]);
  const style = useAnimatedStyle(() => ({ width: Math.max(height, fill.value * width) }));
  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{
        backgroundColor: track,
        borderRadius: Radius.pill,
        flex: 1,
        height,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[{ backgroundColor: color, borderRadius: Radius.pill, height }, style]}
      />
    </View>
  );
}
