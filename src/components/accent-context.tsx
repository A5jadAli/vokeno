import { createContext, useContext, type PropsWithChildren } from 'react';

export type AccentColors = { accent: string; onAccent: string; onDark: string; tint: string };

/**
 * A language screen's colours. A screen about one language wraps its content in `PrimaryAccent`
 * with that language's colours: main buttons, the progress bar, play buttons and highlighted cards
 * follow them. Outside a wrapper, the brand yellow is used.
 */
const PrimaryAccentContext = createContext<AccentColors | null>(null);

export function PrimaryAccent({ colors, children }: PropsWithChildren<{ colors: AccentColors }>) {
  return <PrimaryAccentContext.Provider value={colors}>{children}</PrimaryAccentContext.Provider>;
}

/** The surrounding language's colours, or null outside a language screen. */
export const useAccentColors = () => useContext(PrimaryAccentContext);
