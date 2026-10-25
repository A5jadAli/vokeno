import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
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

import {
  Dark,
  FontSize,
  LineHeight,
  OnDark,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
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
  {
    key: 'practice',
    icon: 'lightning-bolt-outline',
    activeIcon: 'lightning-bolt',
    label: 'Practice',
  },
  { key: 'progress', icon: 'chart-box-outline', activeIcon: 'chart-box', label: 'Progress' },
];

const navHref: Record<NavKey, string> = {
  today: '/',
  course: '/sprint',
  practice: '/practice',
  progress: '/progress',
};

/**
 * Scrolls something on the current screen into view: what a tap opens must appear where the
 * learner is looking. 'nearest' brings its bottom into view without pushing its top off;
 * 'top' lines its top up with the top of the screen.
 */
type Reveal = (node: View | null, align?: 'nearest' | 'top') => void;
const RevealContext = createContext<Reveal>(() => undefined);
export const useRevealInScroll = () => useContext(RevealContext);

/** How long an opening card's layout animation takes before it is measured. */
const REVEAL_AFTER_MS = 240;

type AppScreenProps = PropsWithChildren<{
  activeNav?: NavKey;
  backgroundColor?: string;
  dark?: boolean;
  footer?: ReactNode;
  keyboardAware?: boolean;
  scroll?: boolean;
  /** When this changes (a new lesson step), the screen starts again at the top. */
  scrollKey?: string | number;
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
  scrollKey,
  showNav = true,
}: AppScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [scrollKey]);
  const reveal = useCallback<Reveal>((node, align = 'nearest') => {
    setTimeout(() => {
      const scrollView = scrollRef.current?.getNativeScrollRef();
      if (!node || !scrollView) return;
      scrollView.measureInWindow((_x, top, _width, height) => {
        node.measureInWindow((_nodeX, nodeTop, _nodeWidth, nodeHeight) => {
          const fromTop = nodeTop - top - space(2);
          const below = nodeTop + nodeHeight - (top + height) + space(4);
          const by = align === 'top' ? fromTop : below > 0 ? Math.min(below, fromTop) : 0;
          if (by !== 0)
            scrollRef.current?.scrollTo({
              y: Math.max(0, scrollOffset.current + by),
              animated: true,
            });
        });
      });
    }, REVEAL_AFTER_MS);
  }, []);
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
      {/* Light icons on dark screens, dark on cream; the most recent screen's choice wins. */}
      <StatusBar style={dark ? 'light' : 'dark'} />
      <RevealContext.Provider value={reveal}>{content}</RevealContext.Provider>
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
  const muted = dark ? OnDark.textSecondary : Palette.secondary;

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.navSafeArea,
        {
          backgroundColor: dark ? Palette.ink : Palette.cream,
          borderTopColor: dark ? Dark.border : Palette.line,
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

/**
 * The one segmented control: a choice between a few views of the same thing. The chosen option
 * is ink with cream text everywhere, like every other selection in the app.
 */
export function Segmented<T extends string | boolean>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; detail?: string; accessibilityLabel?: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View accessibilityRole="tablist" style={styles.segmented}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.accessibilityLabel}
            accessibilityState={{ selected }}
            aria-selected={selected}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              selected && styles.segmentSelected,
              pressed && !selected && styles.pressed,
            ]}
          >
            <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>
              {option.label}
            </Text>
            {option.detail ? (
              <Text style={[styles.segmentDetail, selected && styles.segmentDetailSelected]}>
                {option.detail}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
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

/**
 * The top-left control. Pages that sit in the app use “back” (an arrow). Learning activities,
 * which open as a focused screen from below, use “close” (a cross), matching lessons and review.
 */
export function HeaderBack({
  dark = false,
  variant = 'back',
}: {
  dark?: boolean;
  variant?: 'back' | 'close';
}) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityLabel={variant === 'close' ? 'Close' : 'Go back'}
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
        { backgroundColor: dark ? OnDark.fillStrong : Palette.soft },
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons
        color={dark ? Palette.cream : Palette.ink}
        name={variant === 'close' ? 'close' : 'chevron-left'}
        size={variant === 'close' ? 23 : 25}
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
    paddingHorizontal: space(2),
  },
  // The whole cell is the touch target, the bar's full 68 high: centred alone, a tab measured
  // 34 on Android (below the 48 minimum), with its label hanging outside.
  navButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    gap: space(0.5),
    justifyContent: 'center',
    minHeight: 56,
  },
  navIconWrap: {
    alignItems: 'center',
    borderRadius: Radius.pill,
    height: 32,
    justifyContent: 'center',
    width: 56,
  },
  navLabel: { fontFamily: VokaFonts.bodyMedium, fontSize: FontSize.caption },
  navLabelSelected: { fontFamily: VokaFonts.bodySemiBold },
  roundIcon: { alignItems: 'center', justifyContent: 'center' },
  segmented: {
    backgroundColor: Palette.soft,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(1),
    padding: space(1),
  },
  segment: {
    alignItems: 'center',
    borderRadius: Radius.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: space(2),
    paddingVertical: space(1),
  },
  segmentSelected: { backgroundColor: Palette.ink },
  segmentLabel: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
    textAlign: 'center',
  },
  segmentLabelSelected: { color: Palette.cream },
  segmentDetail: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.caption,
  },
  segmentDetailSelected: { color: OnDark.textSecondary },
  pressed: { opacity: 0.66, transform: [{ scale: 0.97 }] },
  eyebrow: {
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  back: {
    alignItems: 'center',
    borderRadius: Radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
