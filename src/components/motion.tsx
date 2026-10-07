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

type TactileProps = PropsWithChildren<{
  face: string;
  lip: string;
  radius?: number;
  depth?: number;
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
 * every platform gets a slight press-in scale. `lip` and `depth` are accepted for compatibility
 * and ignored, since raised 3D buttons read as dated.
 */
export function Tactile({
  face,
  radius = 16,
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
        android_ripple={
          disabled ? undefined : { color: 'rgba(19, 18, 17, 0.08)', foreground: true }
        }
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

/** A thin progress bar whose fill springs to its new value. */
export function ProgressFill({
  value,
  color,
  track,
  height = 10,
}: {
  value: number;
  color: string;
  track: string;
  height?: number;
}) {
  const [width, setWidth] = useState(0);
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = withSpring(Math.max(0, Math.min(1, value)), { damping: 20, stiffness: 140 });
  }, [fill, value]);
  const style = useAnimatedStyle(() => ({ width: Math.max(height, fill.value * width) }));
  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{ backgroundColor: track, borderRadius: 99, flex: 1, height, overflow: 'hidden' }}
    >
      <Animated.View style={[{ backgroundColor: color, borderRadius: 99, height }, style]} />
    </View>
  );
}
