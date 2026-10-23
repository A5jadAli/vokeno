# Design system

The agreed direction, with the research behind it, is the [Vokeno Design Direction](https://claude.ai/artifact/5WZsftP3tEXaxybebUrjBV) page. The research itself is in `reports/` and `research_notes/`. This file records the rules the code follows and what has been built.

## Rules

- **Colours live in one file.** Every colour is defined in `src/constants/theme.ts`. A lint rule rejects hex and rgba literals anywhere else in `src/`. A colour at an opacity is `withAlpha(Palette.cream, 0.7)`, so each variant keeps one base colour.
- **Ink acts, colour identifies, lime speaks.** The main action is ink in every language. A language's colour marks where you are; it never decides what a button means. Lime (`#D8FF4F`) is for voice only, and only on ink: on cream it is 1.02:1, which is invisible.
- **Language colours come in three shades from one hue:**
  - tint (OKLCH lightness 0.955), for card backgrounds;
  - fill, for dots, bands, illustrations and face backgrounds. English, German and Spanish keep today's bright colours; a new language uses lightness 0.74. Text on a fill is ink or white, whichever has more contrast: white on Spanish violet, ink on the others.
  - deep (lightness 0.47, chroma up to 0.13, reduced until the colour can be displayed), for small labels, icons and progress bars. It reads at 5.49:1 or more on cream for every hue.
- **Never colour alone.** Right and wrong always carry ✓ or ✗ and a haptic.
- **Motion respects reduce-motion.** All animation uses Reanimated, whose animations and entering/exiting transitions follow the phone's reduce-motion setting by default (`ReduceMotion.System`). Keep that default: never pass `ReduceMotion.Never`, and never animate with React Native's `Animated`.
- **Type scale (from the colour-roles step):** 32 · 24 · 18 · 16 · 14 · 12. Plus Jakarta Sans for everything; Bricolage Grotesque for screen titles. Text keeps scaling with the phone's font-size setting; check screens at 200%.

## Steps

| Step                         | Status                                                                                                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Tokens, no visible change | Done 23 October 2026. 51 distinct hex and 53 distinct rgba values in 43 files replaced by tokens; lint rule added; unused starter code removed. Before and after screenshots of 36 screens are pixel-identical. |
| 2. Colour roles and type     | Next. Merge the near-duplicates marked "≈" in theme.ts, ink main buttons everywhere (screens outside a language still default to German yellow), the three language shades, streak flame in ink.                |
| 3. Signature moment          | The live voice line on calls; the line on speak and listen controls; a sound with the haptic on a correct answer.                                                                                               |
| 4. Course levels             | A1 to B2 as sections, with checkpoints as gates, before A2 content ships.                                                                                                                                       |
| 5. One face                  | One Spanish character in calls, judged on day-7 retention before the rest of the cast.                                                                                                                          |
| 6. Dark mode                 | Generated from the tokens.                                                                                                                                                                                      |
| 7. Non-Latin scripts         | A font and right-to-left direction in a single lesson-text component, when a non-Latin language is planned.                                                                                                     |
