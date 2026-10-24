import { View } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { Radius } from '@/constants/theme';
import { voiceLineShape } from '@/features/conversation/audio-levels';

type Size = { width: number; height: number; thickness: number };

/**
 * The Vokeno voice line, drawn from overlapping dots so it needs no SVG renderer.
 * Live: `level` (0 to 1) is the real voice level, so the line is flat in silence and takes
 * the mark's shape only as loud as someone is speaking. Only `translateY` moves, on the UI thread.
 */
export function VoiceLine({
  level,
  color,
  width = 220,
  height = 88,
  thickness = 7,
}: {
  level: SharedValue<number>;
  color: string;
  width?: number;
  height?: number;
  thickness?: number;
}) {
  const size = { width, height, thickness };
  const count = Math.round(width / (thickness * 0.35));
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={{ width, height }}
    >
      {Array.from({ length: count }, (_, index) => (
        <LiveDot key={index} color={color} level={level} size={size} x={index / (count - 1)} />
      ))}
    </View>
  );
}

/** The same line, still, at its full shape: for controls that start or carry a voice. */
export function VoiceLineMark({
  color,
  width = 28,
  height = 16,
  thickness = 3,
}: {
  color: string;
  width?: number;
  height?: number;
  thickness?: number;
}) {
  const size = { width, height, thickness };
  const count = Math.round(width / (thickness * 0.35));
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={{ width, height }}
    >
      {Array.from({ length: count }, (_, index) => {
        const x = index / (count - 1);
        return (
          <View
            key={index}
            style={[
              dotStyle(size, x, color),
              { transform: [{ translateY: voiceLineShape(x) * reach(size) }] },
            ]}
          />
        );
      })}
    </View>
  );
}

function LiveDot({
  color,
  level,
  size,
  x,
}: {
  color: string;
  level: SharedValue<number>;
  size: Size;
  x: number;
}) {
  const lift = voiceLineShape(x) * reach(size);
  const moving = useAnimatedStyle(() => ({ transform: [{ translateY: lift * level.value }] }));
  return <Animated.View style={[dotStyle(size, x, color), moving]} />;
}

/** How far the deepest point travels from the middle without leaving the box. */
const reach = ({ height, thickness }: Size) => (height - thickness) / 2;

const dotStyle = ({ width, height, thickness }: Size, x: number, color: string) =>
  ({
    backgroundColor: color,
    borderRadius: Radius.pill,
    height: thickness,
    left: x * (width - thickness),
    position: 'absolute',
    top: (height - thickness) / 2,
    width: thickness,
  }) as const;
