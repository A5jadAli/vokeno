import { View } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { Radius } from '@/constants/theme';

import { type LineSegment, voiceLineSegments } from './voice-line-geometry';

type Size = { height: number; thickness: number; piece: number };

/**
 * The Vokeno voice line, drawn from the app icon's own curve as short round-ended pieces, so
 * it needs no SVG renderer and its edge stays smooth. Live: `level` (0 to 1) is the real voice
 * level, so the line is flat in silence and takes the mark's shape only as loud as someone is
 * speaking. Only transforms move, on the UI thread.
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
  const segments = voiceLineSegments(width, height, thickness);
  const size = { height, thickness, piece: pieceWidth(segments, thickness) };
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={{ width, height }}
    >
      {segments.map((segment, index) => (
        <LivePiece key={index} color={color} level={level} segment={segment} size={size} />
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
  const segments = voiceLineSegments(width, height, thickness);
  const size = { height, thickness, piece: pieceWidth(segments, thickness) };
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={{ width, height }}
    >
      {segments.map((segment, index) => (
        <View
          key={index}
          style={[
            pieceStyle(size, color),
            {
              transform: [
                { translateX: segment.x - size.piece / 2 },
                { translateY: segment.y },
                { rotate: `${Math.atan2(segment.dy, segment.dx)}rad` },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

function LivePiece({
  color,
  level,
  segment,
  size,
}: {
  color: string;
  level: SharedValue<number>;
  segment: LineSegment;
  size: Size;
}) {
  const { x, y, dx, dy } = segment;
  const left = x - size.piece / 2;
  const moving = useAnimatedStyle(() => ({
    transform: [
      { translateX: left },
      { translateY: y * level.value },
      { rotate: `${Math.atan2(dy * level.value, dx)}rad` },
    ],
  }));
  return <Animated.View style={[pieceStyle(size, color), moving]} />;
}

/**
 * Every piece is one pill the length of the longest piece plus its round ends; the pieces are
 * cut at equal lengths, so that is at most a hair over each. All of them share one size and
 * left edge and are placed with transforms, because layout snaps sizes and positions to the
 * pixel grid and would leave the round ends of neighbours a pixel apart.
 */
const pieceWidth = (segments: LineSegment[], thickness: number) =>
  Math.max(...segments.map((segment) => segment.length)) + thickness;

const pieceStyle = ({ height, thickness, piece }: Size, color: string) =>
  ({
    backgroundColor: color,
    borderRadius: Radius.pill,
    height: thickness,
    left: 0,
    position: 'absolute',
    top: (height - thickness) / 2,
    width: piece,
  }) as const;

/**
 * The voice mark at icon size, for speaking: Vokeno's own shape means "talk" across the app
 * instead of a generic microphone. It takes exactly the icon's width (`size`), so labels next
 * to it line up with the labels next to other icons.
 */
export function SpeakGlyph({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <VoiceLineMark
      color={color}
      height={Math.round(size * 0.6)}
      thickness={Math.max(2, Math.round(size / 9))}
      width={size}
    />
  );
}
