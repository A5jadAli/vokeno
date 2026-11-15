# Review record: es-a1-u6 · At a café

The first unit put through `docs/content-pipeline.md`, as the trial of the panel. The unit was already live, so this record starts at the panel stage; its coverage sheet is the Unit 6 brief in `docs/spanish-a1-units-plan.md`.

## Panel, 15 November 2026

Content versions reviewed: `z1frs4 e0lhdn c6m1xr 13g1ogr`. Reviewers: native `gemini-pro-latest` (0 findings), teacher `gpt-6.1-sol` (2), answer keys `grok-4.7` (6). The run took 11 minutes.

| Step | Severity | Finding                                                                                        | Checked against the source                                                                                   | Done                                                                            |
| ---- | -------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 1.9  | blocker  | "un zumo de naranja" is rejected, though the unit teaches it as the Spain form (two reviewers) | True: taught in the note of step 1.2 and repeated in this step's own explanation                             | Accepted                                                                        |
| 2.9  | blocker  | "¿Tienen zumo de naranja?" and the usted form "¿Tiene …?" are rejected (two reviewers)         | True: usted is taught in step 2.2                                                                            | All four forms accepted                                                         |
| 4.6  | blocker  | "Write an order: a tea with milk, please" accepts only the bare noun phrase                    | True: "¿Me das …?", "¿Me da …?" and "Quiero …" are this unit's own ways to order                             | Those three and "Por favor, un té con leche." accepted                          |
| 4.4  | major    | The right option says "white coffee", British English the course never used for "con leche"    | True: the unit glosses "con leche" as "with milk"                                                            | Option now reads "A coffee with milk, no sugar, and two biscuits, to take away" |
| 2.6  | minor    | "Un and una only mean one" contradicts their earlier gloss as "a"                              | True                                                                                                         | Now "Un and una are only for one item."                                         |
| 4.3  | minor    | The menu total can be worked out without Spanish                                               | True, and intended: it is a reading-a-menu task. Better wrong options would help                             | Left for the repair in the backlog                                              |
| 1.9  | (part)   | "Un jugo de naranja" with a capital is rejected                                                | False: answers are compared without capitals or punctuation (`normaliseFoundationAnswer`)                    | Nothing                                                                         |
| 4.5  | major    | "noventa" was never taught (first run only)                                                    | False: taught in Unit 3's rule table. The reviewers were not shown rule tables; they are now (`knownBefore`) | Nothing in the unit                                                             |

The panel has not been run again on the changed keys: the repair in the backlog reruns it.

## Content standard

Four misses remain (`npm run content:check -- es-a1-u6`): three sessions are more than half multiple choice, and 32% of the unit's marked steps are typed or built against 40%. This is row 1 of `docs/content-backlog.md`.

## For the native teacher

- Is "¿Tiene jugo de naranja?" (usted, to one person behind the counter) as natural in a Mexico City café as "¿Tienen …?"?
- "Quiero un té con leche, por favor": acceptable to a stranger, or too blunt beside "¿Me da …?"?
- The clips for this unit have not been heard by a native speaker.
