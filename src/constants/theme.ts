import '@/global.css';

// Every colour in the app is defined in this file; a lint rule rejects colour literals anywhere
// else. Variants at an opacity come from withAlpha, so each keeps its one base colour.

export const Palette = {
  cream: '#F1EDE3',
  canvas: '#E6E1D6',
  ink: '#131211',
  black: '#000000',
  orange: '#F26A1F',
  orangeTint: '#FDE7D8',
  orangeTintStrong: '#FFE3D6',
  yellow: '#F2B705',
  yellowTint: '#FCF0C8',
  violet: '#5B45D6',
  violetSoft: '#B9AAFF',
  violetTint: '#ECE9FB',
  white: '#FFFFFF',
  muted: '#6A6663',
  secondary: '#5F5B58',
  line: 'rgba(19, 18, 17, 0.09)',
  soft: 'rgba(19, 18, 17, 0.08)',
  /** A pressed or disabled button face. */
  disabled: '#DEDAD2',
  /** Neutral bars in charts, and quiet status chips. */
  neutralBar: '#D9D6CF',
  neutralChip: '#EDEAE3',
  /** The learner's own speech bubble in lesson scenes. */
  bubbleMine: '#E9F4E6',
} as const;

/** A colour at an opacity: withAlpha(Palette.cream, 0.7). Takes a six-digit hex colour. */
export function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

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
 * Right, wrong and nearly right, and the success and error messages around them. These are the
 * values the screens used before colours moved here. Entries marked "≈" are near-duplicates kept
 * so nothing changed on screen; the colour-roles step merges each family into one scale.
 */
export const Feedback = {
  correctBg: '#E5F6EB',
  /** ≈ correctBg */
  correctBgAlt: '#E3F2E5',
  correctSoft: '#BFE5C8',
  correctAccent: '#1E9E57',
  correctLip: '#137040',
  correctFill: '#2F7A47',
  correctInk: '#14532D',
  correctText: '#1F5A33',
  correctTextLight: '#237A45',
  /** ≈ correctTextLight */
  correctTextLightAlt: '#337A45',
  correctTextMuted: '#39734A',
  wrongBg: '#FDEBE7',
  /** ≈ wrongBg */
  wrongBgAlt: '#FFE9E1',
  wrongAccent: '#D93F26',
  wrongLip: '#A12A15',
  wrongInk: '#7A1F10',
  wrongText: '#8E2D1B',
  wrongTextLight: '#A4391B',
  /** ≈ wrongTextLight; destructive buttons and their labels. */
  danger: '#A33A22',
  wrongTextBright: '#B23818',
  wrongBorder: '#B44931',
  closeBg: '#FFF5D1',
  closeAccent: '#D99A00',
  closeInk: '#5F4500',
  /** A plan running behind, and writing that is still developing. */
  behindBg: '#FCF0C8',
  behindInk: '#6B4E00',
} as const;

/** The yellow highlight for a chosen answer, an active audio button and a selected reading answer. */
export const Selection = {
  face: '#FFF4CC',
  faceStrong: '#FFF1BC',
  faceSoft: '#FFF8E0',
  lip: '#C99600',
} as const;

/** Surfaces and signals on the dark screens: live conversation, Plus, results and test dates. */
export const Dark = {
  surface: '#1D1C1A',
  raised: '#282623',
  /** ≈ raised */
  raisedAlt: '#242321',
  border: '#302E2B',
  control: '#3A3733',
  switchOff: '#47443F',
  endCall: '#C8422F',
  errorText: '#FFB49E',
  live: '#55DB8A',
} as const;

// Plus Jakarta Sans for everything; Bricolage Grotesque only for the VOKENO wordmark.
export const VokaFonts = {
  displayExtraBold: 'BricolageGrotesque_800ExtraBold',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
} as const;
