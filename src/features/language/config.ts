import { Palette } from '@/constants/theme';

export const languageTracks = ['EN', 'DE', 'ES'] as const;
export type LanguageTrack = (typeof languageTracks)[number];

export const languageDetails: Record<
  LanguageTrack,
  { accent: string; name: string; nativeName: string; speechLocale: string }
> = {
  EN: { accent: Palette.orange, name: 'English', nativeName: 'English', speechLocale: 'en-GB' },
  DE: { accent: Palette.yellow, name: 'German', nativeName: 'Deutsch', speechLocale: 'de-DE' },
  ES: { accent: Palette.violet, name: 'Spanish', nativeName: 'Español', speechLocale: 'es-MX' },
};

/**
 * Each language's colours: three shades of one hue (docs/design-system.md). `accent` is the fill
 * for badges, dots, bands and icons, with `onAccent` on it (ink or white, whichever reads better).
 * `deep` is for small text, icons, outlines and progress bars on cream (5.5:1 or more). `tint` is a
 * pale background, and `onDark` the colour on the dark screens. Buttons are never the language
 * colour: actions are ink.
 */
export const trackColors: Record<
  LanguageTrack,
  { accent: string; onAccent: string; deep: string; onDark: string; tint: string }
> = {
  EN: {
    accent: Palette.orange,
    onAccent: Palette.ink,
    deep: Palette.orangeDeep,
    onDark: Palette.orange,
    tint: Palette.orangeTint,
  },
  DE: {
    accent: Palette.yellow,
    onAccent: Palette.ink,
    deep: Palette.yellowDeep,
    onDark: Palette.yellow,
    tint: Palette.yellowTint,
  },
  ES: {
    accent: Palette.violet,
    onAccent: Palette.white,
    deep: Palette.violetDeep,
    onDark: Palette.violetSoft,
    tint: Palette.violetTint,
  },
};

export function isLanguageTrack(value: unknown): value is LanguageTrack {
  return typeof value === 'string' && languageTracks.some((track) => track === value);
}
