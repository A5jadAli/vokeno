import '@/global.css';

// Every colour in the app is defined in this file; a lint rule rejects colour literals anywhere
// else. Variants at an opacity come from withAlpha, so each keeps its one base colour.

export const Palette = {
  cream: '#F1EDE3',
  canvas: '#E6E1D6',
  ink: '#131211',
  /** Voice only, and only on ink: on cream it is 1.02:1, which is invisible. */
  lime: '#D8FF4F',
  // Each language colour comes in three shades of one hue (docs/design-system.md): a tint for
  // backgrounds, a fill for badges, dots and bands, and a deep shade for small text, icons and
  // progress bars, which reads at 5.5:1 or more on cream.
  orange: '#F26A1F',
  orangeTint: '#FFECE0',
  orangeDeep: '#8B4501',
  yellow: '#F2B705',
  yellowTint: '#F9F0DA',
  yellowDeep: '#715700',
  violet: '#5B45D6',
  violetSoft: '#B9AAFF',
  violetTint: '#EFEEFE',
  violetDeep: '#5C4A9E',
  white: '#FFFFFF',
  muted: '#6A6663',
  secondary: '#5F5B58',
  // Ink at an opacity on light surfaces, by role.
  line: 'rgba(19, 18, 17, 0.09)',
  soft: 'rgba(19, 18, 17, 0.08)',
  pressed: 'rgba(19, 18, 17, 0.12)',
  border: 'rgba(19, 18, 17, 0.14)',
  handle: 'rgba(19, 18, 17, 0.2)',
  shadow: 'rgba(19, 18, 17, 0.1)',
  scrim: 'rgba(19, 18, 17, 0.45)',
  /** A pressed or disabled button face. */
  disabled: '#DEDAD2',
  /** Neutral bars in charts, and quiet status chips. */
  neutralBar: '#D9D6CF',
  neutralChip: '#EDEAE3',
} as const;

/** A colour at an opacity. Only for this file: screens use the named roles below. */
function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

/**
 * Cream on the dark screens, by role. Faint text stays at 0.6 or more (6.3:1 on ink), so small
 * labels, captions and prices stay readable.
 */
export const OnDark = {
  text: Palette.cream,
  textSecondary: withAlpha(Palette.cream, 0.72),
  textFaint: withAlpha(Palette.cream, 0.6),
  fill: withAlpha(Palette.cream, 0.08),
  fillStrong: withAlpha(Palette.cream, 0.12),
  line: withAlpha(Palette.cream, 0.14),
  border: withAlpha(Palette.cream, 0.22),
} as const;

/**
 * The Vokeno brand: ink and cream, so it never competes with a language's own colour (English
 * orange, German yellow, Spanish violet and any added later). On cream surfaces the brand is ink;
 * on dark surfaces it is cream. Language screens use trackColors instead.
 */
export const Brand = {
  accent: Palette.ink,
  onAccent: Palette.cream,
  onDark: Palette.cream,
  onDarkInk: Palette.ink,
} as const;

/**
 * Right, wrong and nearly right. Never shown by colour alone: right and wrong always carry a ✓ or
 * ✗ and a haptic. White on each fill and each text colour on its background reads at 4.5:1 or more.
 */
export const Feedback = {
  correctBg: '#E5F6EB',
  correctSoft: '#BFE5C8',
  correctFill: '#21763C',
  correctText: '#1F5A33',
  wrongBg: '#FDEBE7',
  wrongFill: '#B2422E',
  wrongText: '#8E2D1B',
  closeBg: '#FFF5D1',
  closeAccent: '#D99A00',
  closeInk: '#5F4500',
  /** A plan running behind, and writing that is still developing. */
  behindBg: '#FCF0C8',
} as const;

/** A chosen answer or an active control: ink marks the choice, in every language. */
export const Selection = {
  face: Palette.white,
  faceStrong: Palette.canvas,
  border: Palette.ink,
} as const;

/** Surfaces and signals on the dark screens: live conversation, Plus, results and test dates. */
export const Dark = {
  surface: '#1D1C1A',
  raised: '#282623',
  border: '#302E2B',
  control: '#3A3733',
  switchOff: '#47443F',
  errorText: '#FFB49E',
} as const;

// Plus Jakarta Sans for everything; Bricolage Grotesque for the wordmark and screen titles.
export const VokaFonts = {
  displayExtraBold: 'BricolageGrotesque_800ExtraBold',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
} as const;

/**
 * Six text sizes, far enough apart to read as different. Text still scales with the phone's
 * font-size setting. Screen titles use the display size in Bricolage Grotesque.
 */
export const FontSize = {
  caption: 12,
  label: 14,
  body: 16,
  heading: 18,
  title: 24,
  display: 32,
} as const;

/** One line height per text size, so text keeps the same rhythm everywhere. */
export const LineHeight = {
  caption: 18,
  label: 20,
  body: 24,
  heading: 24,
  title: 30,
  display: 38,
} as const;

/** Corner radii: small chips, controls, cards, large cards and sheets, and fully round. */
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/** Spacing on a 4-point grid: space(4) is 16. Halves (space(0.5)) are for hairline gaps. */
export const space = (steps: number) => steps * 4;
