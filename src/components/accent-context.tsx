import { createContext, useContext, type PropsWithChildren } from 'react';

export type AccentColors = {
  accent: string;
  onAccent: string;
  deep: string;
  onDark: string;
  tint: string;
};

/**
 * A language screen's colours. A screen about one language wraps its content in `PrimaryAccent`
 * with that language's colours: the progress bar, badges and highlighted cards follow them. Main
 * buttons stay ink in every language. Outside a wrapper, those marks are ink too.
 */
const PrimaryAccentContext = createContext<AccentColors | null>(null);

export function PrimaryAccent({ colors, children }: PropsWithChildren<{ colors: AccentColors }>) {
  return <PrimaryAccentContext.Provider value={colors}>{children}</PrimaryAccentContext.Provider>;
}

/** The surrounding language's colours, or null outside a language screen. */
export const useAccentColors = () => useContext(PrimaryAccentContext);
