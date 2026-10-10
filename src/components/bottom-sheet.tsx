import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Palette } from '@/constants/theme';

const OPEN_SPRING = { damping: 26, stiffness: 260, mass: 0.9 };

/**
 * A sheet from the bottom edge, like the ones in system settings: it follows your finger when
 * dragged, closes when pulled down far or flicked, and closes on a tap outside or Back.
 */
export function BottomSheet({
  visible,
  onClose,
  closeLabel,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  closeLabel: string;
  /** Content, or a function that receives `close` to slide the sheet away (after a choice). */
  children: ReactNode | ((close: () => void) => ReactNode);
}) {
  const { height: screen } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState(screen);
  // 0 is fully open; `screen` is fully below the screen edge.
  const offset = useSharedValue(screen);

  useEffect(() => {
    // Opening always starts below the screen edge and springs up.
    if (visible) {
      offset.set(screen);
      offset.set(withSpring(0, OPEN_SPRING));
    }
  }, [offset, screen, visible]);

  // Every way of closing slides the sheet away first, then tells the parent.
  const close = (duration = 220) =>
    offset.set(
      withTiming(screen, { duration }, (done) => {
        if (done) scheduleOnRN(onClose);
      }),
    );

  const pan = Gesture.Pan()
    // Taps on rows still work; only a clear vertical drag moves the sheet.
    .activeOffsetY([-8, 8])
    .onUpdate((event) => {
      offset.set(event.translationY > 0 ? event.translationY : event.translationY * 0.15);
    })
    .onEnd((event) => {
      if (event.translationY > height * 0.25 || event.velocityY > 900)
        offset.set(
          withTiming(screen, { duration: 200 }, (done) => {
            if (done) scheduleOnRN(onClose);
          }),
        );
      else offset.set(withSpring(0, OPEN_SPRING));
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.get() }] }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offset.get(), [0, Math.min(height, screen)], [1, 0], 'clamp'),
  }));

  if (!visible) return null;
  return (
    <Modal
      animationType="none"
      navigationBarTranslucent
      onRequestClose={() => close()}
      statusBarTranslucent
      transparent
      visible
    >
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
            onPress={() => close()}
            style={styles.fill}
          />
        </Animated.View>
        <GestureDetector gesture={pan}>
          <Animated.View
            onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
            style={[styles.sheet, { paddingBottom: 18 + insets.bottom }, sheetStyle]}
          >
            <View accessibilityLabel="Drag down to close" style={styles.handleArea}>
              <View style={styles.grabber} />
            </View>
            {typeof children === 'function' ? children(close) : children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(19,18,17,0.45)' },
  fill: { flex: 1 },
  sheet: {
    backgroundColor: Palette.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 12,
    paddingHorizontal: 18,
  },
  handleArea: { alignItems: 'center', paddingBottom: 4, paddingTop: 10 },
  grabber: { backgroundColor: 'rgba(19,18,17,0.22)', borderRadius: 99, height: 5, width: 40 },
});
