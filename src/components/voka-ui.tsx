import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import {
  useCallback,
  useEffect,
  useRef,
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, VokaFonts } from '@/constants/theme';
import { useLanguageSelection } from '@/features/language/selection';
import { focusedInputScrollOffset } from './keyboard-scroll';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type NavKey = 'today' | 'course' | 'practice' | 'progress';

/**
 * Four destinations, each answering one question: what now, where am I going, what can I
 * practise, what have I learned. Profile and settings sit behind the header's account button.
 */
const navItems: { icon: IconName; activeIcon: IconName; label: string; key: NavKey }[] = [
  { key: 'today', icon: 'home-outline', activeIcon: 'home', label: 'Today' },
  { key: 'course', icon: 'map-outline', activeIcon: 'map', label: 'Course' },
  { key: 'practice', icon: 'dumbbell', activeIcon: 'dumbbell', label: 'Practice' },
  { key: 'progress', icon: 'chart-box-outline', activeIcon: 'chart-box', label: 'Progress' },
];

const navHref: Record<NavKey, string> = {
  today: '/',
  course: '/sprint',
  practice: '/practice',
  progress: '/progress',
};

type AppScreenProps = PropsWithChildren<{
  activeNav?: NavKey;
  backgroundColor?: string;
  dark?: boolean;
  footer?: ReactNode;
  keyboardAware?: boolean;
  scroll?: boolean;
  showNav?: boolean;
}>;

export function AppScreen({
  activeNav,
  backgroundColor = Palette.cream,
  children,
  dark = false,
  footer,
  keyboardAware = false,
  scroll = true,
  showNav = true,
}: AppScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  const revealInput = useCallback(() => {
    if (!keyboardAware || Platform.OS === 'web' || !Keyboard.isVisible()) return;
    const input = TextInput.State.currentlyFocusedInput();
    const scrollView = scrollRef.current;
    if (!input || !scrollView) return;
    // Measure the actual scroll viewport, which excludes the fixed action footer.
    // Android's resize mode alone does not scroll a multiline field into view.
    scrollView.getNativeScrollRef()?.measureInWindow((_x, top, _width, height) => {
      input.measureInWindow((_inputX, inputTop, _inputWidth, inputHeight) => {
        if (TextInput.State.currentlyFocusedInput() !== input || !Keyboard.isVisible()) return;
        const y = focusedInputScrollOffset({
          scrollOffset: scrollOffset.current,
          viewportTop: top,
          viewportHeight: height,
          keyboardTop: Keyboard.metrics()?.screenY ?? Infinity,
          inputTop,
          inputHeight,
        });
        if (y !== undefined) scrollView.scrollTo({ y, animated: true });
      });
    });
  }, [keyboardAware]);
  useEffect(() => {
    if (!keyboardAware) return;
    const subscription = Keyboard.addListener('keyboardDidShow', revealInput);
    return () => subscription.remove();
  }, [keyboardAware, revealInput]);
  const content = scroll ? (
    <ScrollView
      ref={scrollRef}
      automaticallyAdjustKeyboardInsets={!keyboardAware}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      onLayout={revealInput}
      onFocus={revealInput}
      onContentSizeChange={revealInput}
      onScroll={(event) => {
        scrollOffset.current = event.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.fixedContent}>{children}</View>
  );

  const screen = (
    <SafeAreaView
      edges={showNav ? ['top', 'left', 'right'] : ['top', 'right', 'bottom', 'left']}
      style={[styles.screen, { backgroundColor }]}
    >
      {content}
      {footer}
      {showNav ? <BottomNav active={activeNav} dark={dark} /> : null}
    </SafeAreaView>
  );
  return keyboardAware ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled={Platform.OS !== 'web'}
    >
      {screen}
    </KeyboardAvoidingView>
  ) : (
    screen
  );
}

export function BottomNav({ active, dark = false }: { active?: NavKey; dark?: boolean }) {
  const router = useRouter();
  const track = useLanguageSelection((state) => state.track);
  const foreground = dark ? Palette.cream : Palette.ink;
  // At least 3:1 against the bar, so unselected destinations stay readable.
  const muted = dark ? 'rgba(241, 237, 227, 0.7)' : Palette.secondary;

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.navSafeArea,
        {
          backgroundColor: dark ? Palette.ink : Palette.cream,
          borderTopColor: dark ? '#302E2B' : Palette.line,
        },
      ]}
    >
      <View accessibilityRole="tablist" style={styles.navRow}>
        {navItems.map((item) => {
          const selected = item.key === active;
          return (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              aria-selected={selected}
              key={item.key}
              onPress={() => router.navigate(`${navHref[item.key]}?track=${track}` as Href)}
              style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            >
              <View style={[styles.navIconWrap, selected && { backgroundColor: foreground }]}>
                <MaterialCommunityIcons
                  color={selected ? (dark ? Palette.ink : Palette.cream) : muted}
                  name={selected ? item.activeIcon : item.icon}
                  size={20}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.navLabel,
                  { color: selected ? foreground : muted },
                  selected && styles.navLabelSelected,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export function Eyebrow({
  children,
  color = Palette.muted,
}: PropsWithChildren<{ color?: string }>) {
  return <Text style={[styles.eyebrow, { color }]}>{children}</Text>;
}

export function RoundIcon({
  backgroundColor,
  color,
  name,
  size = 52,
}: {
  backgroundColor: string;
  color: string;
  name: IconName;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.roundIcon,
        { backgroundColor, borderRadius: size / 3.25, height: size, width: size },
      ]}
    >
      <MaterialCommunityIcons color={color} name={name} size={size * 0.46} />
    </View>
  );
}

export function HeaderBack({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityLabel="Go back"
      accessibilityRole="button"
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }
        router.navigate('/');
      }}
      style={({ pressed }) => [
        styles.back,
        { backgroundColor: dark ? 'rgba(241, 237, 227, 0.1)' : Palette.soft },
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons
        color={dark ? Palette.cream : Palette.ink}
        name="chevron-left"
        size={25}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  fixedContent: { flex: 1 },
  navSafeArea: { borderTopWidth: StyleSheet.hairlineWidth },
  navRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 68,
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navButton: { alignItems: 'center', flex: 1, gap: 2, justifyContent: 'center', minHeight: 56 },
  navIconWrap: {
    alignItems: 'center',
    borderRadius: 99,
    height: 32,
    justifyContent: 'center',
    width: 56,
  },
  navLabel: { fontFamily: VokaFonts.bodyMedium, fontSize: 12 },
  navLabelSelected: { fontFamily: VokaFonts.bodySemiBold },
  roundIcon: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.66, transform: [{ scale: 0.97 }] },
  eyebrow: { fontFamily: VokaFonts.bodySemiBold, fontSize: 13, lineHeight: 18 },
  back: {
    alignItems: 'center',
    borderRadius: 99,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
