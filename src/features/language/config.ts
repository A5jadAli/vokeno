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
 * Each language's colours. `accent` fills buttons and highlights, `onAccent` is text or icons on
 * that fill, `onDark` is the accent used as text on the dark live-coach surfaces, and `tint` is
 * a pale background. Every pairing meets WCAG AA contrast.
 */
export const trackColors: Record<
  LanguageTrack,
  { accent: string; onAccent: string; onDark: string; tint: string }
> = {
  EN: { accent: Palette.orange, onAccent: Palette.ink, onDark: Palette.orange, tint: '#FFE5DC' },
  DE: { accent: Palette.yellow, onAccent: Palette.ink, onDark: Palette.yellow, tint: '#FCF0C8' },
  ES: {
    accent: Palette.violet,
    onAccent: Palette.white,
    onDark: Palette.violetSoft,
    tint: Palette.violetTint,
  },
};

export function isLanguageTrack(value: unknown): value is LanguageTrack {
  return typeof value === 'string' && languageTracks.some((track) => track === value);
}
