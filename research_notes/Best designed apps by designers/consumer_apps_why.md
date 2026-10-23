# Why the most acclaimed consumer mobile apps are considered world-class in UI/UX (Airbnb, Duolingo, Things 3, Headspace, Monzo vs Revolut, Flighty)

Research date: 2026-10-23. About 22 search and fetch calls. Primary sources found and read: Apple Developer "Behind the Design" pieces on Duolingo and Flighty, three Duolingo blog posts (streak milestone animation, streak experiments, shape language), and the MacStories Things 3 review (reputable press). Airbnb 2025, Headspace 2024 and Monzo details rely mostly on secondary design press or community sources; each is flagged where it is used. Two sources failed to load: Lenny's Newsletter (Mazal) and It's Nice That (Airbnb).

## 1. What specific, named design decisions do designers point to?

### Takeaway

The acclaimed apps share one move: each turns its core object into a recognisable, emotional and often animated "hero" element. Examples are Duolingo's single path, cast of characters and streak flame; Things' draggable Magic Plus; Flighty's airport-board line in the Dynamic Island; Monzo's coral card; and Airbnb's 3D "Lava" icons. Each also cuts everything else down hard.

### Cited Findings

**Duolingo (the category benchmark, so it gets the most depth)**

- In 2022–23 the old "tree", which let learners take many routes, was replaced by one linear "path". VP of Design Ryan Sims called it "a complete reboot of our product strategy." His reason: "Two people could spend the same number of hours doing the same number of lessons, but end up in different places." — [Apple Developer, Behind the Design: Duolingo](https://developer.apple.com/news/?id=jhkvppla)
- Sims: "The secret to Duolingo is that we're not an education company. We're a fun and motivation company." He also said "Fun is the most important part of the work we do." — [Apple Developer](https://developer.apple.com/news/?id=jhkvppla)
- The character cast came from head of art Greg Hartman, who asked "Wouldn't it be cool if you encountered the same people through the entire experience?" The cast includes Lily, a perpetually unimpressed teen with a slow clap; Oscar, a dramatic teacher; and Eddy, a fitness buff. A team of writers keeps the characters' stories from contradicting each other. — [Apple Developer](https://developer.apple.com/news/?id=jhkvppla)
- Short character animations play when a learner answers correctly, and Apple describes them as "a reward in themselves." Sims says the character interaction "was informed by seeing how people connected with Duo." — [Apple Developer](https://developer.apple.com/news/?id=jhkvppla)
- Duolingo uses Rive's State Machine to control which animation states run, how they transition and how they blend, which made lip-sync (visemes) for characters possible at scale. — [Duolingo Blog, world character visemes](https://blog.duolingo.com/world-character-visemes)
  - A secondhand figure relays Rive's claim that 8 head and 8 body animations combine into more than 64 idle variations in a file under 1 MB. — [Medium/UI Animation](https://uianimation.medium.com/duolingo-style-animation-in-mobile-apps-2026-how-it-works-and-what-a-rive-animator-brings-to-53f21ab79cbc). This is not primary.
- Streak milestone redesign, from Duolingo's own write-up by Kurt Hartfelder:
  - Research and focus groups found some new learners did not understand the streak. The team suspected the fire metaphor does not translate across cultures, so it moved to a phoenix, a motif found on many national flags and emblems.
  - Milestones are framed as video-game power-ups, with Duo visibly transforming into "Fire Duo." The old Duo holding number balloons (50, 100, 365) was judged "cute but not energetic enough."
  - Rejected ideas included a s'more, a candle and a lab beaker, which were seen as hard to scale and not universal.
  - A share card lets learners post milestones without leaving the app.
  - Quotes: "Timing is everything in animation" and "We want one of our most popular features to be as universally understood as possible."
  - Source: [Duolingo Blog, Animating the Duolingo Streak](https://blog.duolingo.com/streak-milestone-design-animation/)
- Art-style rules ("shape language"), from Megan Barker in 2020:
  - The goal is a "minimalistic, playful aesthetic that is quick to produce, clear to understand, and fun to learn with."
  - Use few, deliberately placed vector shapes with clear silhouettes, and vary shape and size for rhythm.
  - The style moved from hard-edged shapes to rounder, friendlier forms; the 2018 UI redesign introduced rounded buttons on white.
  - Use the fewest details needed: too few confuses, too many distracts.
  - Frame art with white negative space and exaggerate key details almost to caricature.
  - Each sentence's illustration tells a small story rather than showing a generic scene.
  - Rationale: a small team can produce a lot of art; learners must not misread visuals; playful visuals "reduce fear of mistakes."
  - Source: [Duolingo Blog, Shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/)
- Duolingo's own teaching-method page says its courses are built to "entertain and delight," and that it builds "light-hearted learning into every course and lesson." — [Duolingo Blog, teaching method](https://blog.duolingo.com/duolingo-teaching-method) (via search snippet)
- Sign-up is delayed: learners try a lesson before creating an account. — [First Round Review](https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker)
- Streak mechanics tested as products (2017):
  - Streak Wager: spend gems to bet on keeping a streak for 7 more days, with the stake doubled on success. Shown at the end of a lesson.
  - Weekend Amulet: protects the streak over the weekend, offered each Friday.
  - Source: [Duolingo Blog, How streaks keep learners committed](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/)

**Airbnb (Summer 2025 release)**

- The May 2025 relaunch added Services, reworked Experiences, rebuilt the tech stack and introduced a "dimensional," animated interface with 3D iconography. Coverage cites a roughly 200-person global design team and VP of Design Teo Connor. — [Tech Buzz Ireland](https://techbuzzireland.com/2025/05/14/redesigned-airbnb-app-now-available/); [It's Nice That](https://www.itsnicethat.com/articles/airbnb-app-redesign-140525) (could not be fetched, so details come from search summaries)
- The icons use "Lava," a proprietary format that has been described as micro-video with transparency, built to get past the limits of Lottie and standard video. Coverage describes the icons as soft, toy-like and clay-textured with pastel colours, and mentions optimisations for preloading, rendering, compression and file size.
  - Sources: [Medium deep dive](https://medium.com/@waldobear002/airbnbs-new-lava-icon-format-a-technical-deep-dive-b2604626c7e0); [Zuhayeer Musa on X](https://x.com/zuhayeer/status/1922724522748187045); [Richard Rolfs](https://www.richardrolfs.com/resources/airbnb-2025-lava-icons)
  - Caveat: no official Airbnb engineering post was found. The binary format and patent claims are unverified.
- In mid-2025, after user feedback on the summer app, Brian Chesky posted a video previewing a further design system update: new typeface, navigation, layout system, colour palette, card styles and icons. — [Design Compass](https://designcompass.org/en/2025/07/04/airbnb-new-design-system/)
- The underlying Design Language System (DLS) was led by Karri Saarinen from 2015. Its aim was a "more beautiful and accessible design language."
  - Components are treated as living elements with their own function and personality, not a rigid atomic hierarchy.
  - Most components look the same on iOS and Android, with platform conventions kept for navigation and icons.
  - Source: [Karri Saarinen, Airbnb DLS](https://karrisaarinen.com/dls/)

**Things 3 (Cultured Code)**

- Magic Plus is a floating add button in the lower right that can be dragged to set context:
  - drop it into a list position to create a task exactly there;
  - drop it on the Inbox icon to create an Inbox task;
  - drop it on a day in Upcoming to set a start date.
  - New tasks need only a name; other details come later.
  - Source: [MacStories review](https://www.macstories.net/reviews/things-3-beauty-and-delight-in-a-task-manager/)
- Tapping a task makes it "pop out into a card-like form" while the rest of the list fades. A long-press lifts the task for dragging, and haptic feedback accompanies these moments. The look is "bold fonts, lovely icons, and thoughtful splashes of color" in a layout "dominated by white space." — [MacStories](https://www.macstories.net/reviews/things-3-beauty-and-delight-in-a-task-manager/)
- Things has won two Apple Design Awards, and Cultured Code is based in Stuttgart. — [culturedcode.com](https://culturedcode.com/)

**Flighty**

- Flighty won the 2023 Apple Design Award for Interaction, with Live Activities and Dynamic Island support singled out. — [Apple ADA 2023](https://developer.apple.com/design/awards/2023/); [Apple Newsroom](https://www.apple.com/newsroom/2023/06/apple-announces-winners-of-the-2023-apple-design-awards/)
- The interface mirrors airport signage. Ryan Jones: "Those airport boards have one line per flight, and that's a good guiding light — they've had 50 years of figuring out what's important." — [Apple Developer, Behind the Design: Flighty](https://developer.apple.com/news/?id=970ncww4)
- Designing for offline: "Whenever [someone] takes off, we have to assume that we won't see them again until they land." Before takeoff, the Dynamic Island switches to progress bars and counters, and a simple circular chart tracks flight duration. — [Apple Developer](https://developer.apple.com/news/?id=970ncww4)
- Other features:
  - Live sharing of a flight with people who don't have the app.
  - A Friends' Flights globe.
  - Passport: lifetime travel stats as shareable artwork.
  - Source: [Apple Developer](https://developer.apple.com/news/?id=970ncww4)
- Recent change: version 4.7.0 (November 2025) brought a "bold new look" for Live Activities, aligned with Liquid Glass. — [App Store listing via search](https://apps.apple.com/us/app/flighty-live-flight-tracker/id1358823008?platform=mac)

**Headspace**

- In 2024 Italic Studio rebranded Headspace as it expanded into mental-health coaching, after its 2021 merger with Ginger.
  - The orange smiley stays, but faces now show stress, sadness and contentment, not only joy.
  - New custom typeface: "Headspace Apercu," a modified cut of Colophon's Aperçu whose curves echo the smile.
  - Breath-driven animations were kept from the earlier identity.
  - Characters avoid sharp edges.
  - The internal brand team wrote the guidelines for colour, type, tone and motion.
  - Sources: [It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424) (via search summary); [Standards case study](https://standards.site/examples/headspace/)

**Monzo (and Revolut)**

- The hot coral card was chosen for alpha and beta testing "and we didn't really think beyond this at the time." It then became "an incredible mascot." A former Head of Design wanted a card people would ask about if it were handed over in a restaurant. — [Monzo Community](https://community.monzo.com/t/dont-go-coral-card/3433?page=5); [Phable](https://www.phable.io/phable-labs/monzo-brand-origin-inspired-by-nike)
- Tone and notifications: a plain-English, conversational voice that mirrors customers' language, with real-time spending notifications that each carry an emoji. — [Scaleup Collective](https://www.thescaleupcollective.com/blog/monzos-brand-strategy-how-the-neobank-championed-community); [Joseph Clift](https://josephclift.com/writing/not-so-hot/). These are secondary sources; Monzo's official tone guide was not found.
- Revolut comparison, from user sentiment only:
  - One Revolut user counted 23 buttons and links on the home screen.
  - Users complain about promotional content and want to hide unused features.
  - Users often describe Monzo as "cleaner," while Revolut is better for global use and extra features.
  - Sources: [Revolut Community](https://community.revolut.com/t/stop-updating-ui-with-a-terrible-ux-changes/125058?page=7); [Monzo Community](https://community.monzo.com/t/revolut-user-very-disappointed-with-monzo/7427)

### Inferences

- A pattern repeats across the apps: one signature interaction or element (path, Magic Plus, airport line, coral card, Lava icon), carried out with unusual polish, gets more design credit than broad feature sets.
- Duolingo's acclaim rests less on any single screen than on a system: one path, a consistent cast and art rules, short lessons, reward animations, and streak mechanics treated as products that are tested.

### Gaps

- No primary Duolingo source on sound design or haptics was found. design.duolingo.com now redirects (301) to blog.duolingo.com/hub/design/, which was not read.
- No official Airbnb engineering or design post on Lava was found.
- No Cultured Code primary interview on Things 3's animation was found.
- Instagram and Spotify were not researched. No evidence was gathered on whether designers still rate them highly, so leave them out.

## 2. What design principles or philosophies have the companies published, and what does their design process look like?

### Takeaway

The stated philosophies are short and memorable: "fun and motivation company" (Duolingo), "boringly obvious" (Flighty), and DLS components "with personality" (Airbnb). The processes range from Duolingo's heavy A/B testing, to Flighty's very small team sketching 20 ideas per problem, to Cultured Code's rare, years-long major releases.

### Cited Findings

- **Duolingo, principles:** "Fun is the most important part of the work we do"; "You learn a language to connect to another human." — [Apple Developer](https://developer.apple.com/news/?id=jhkvppla)
- **Duolingo, process:**
  - A writing team checks the characters' stories for consistency. — [Apple Developer](https://developer.apple.com/news/?id=jhkvppla)
  - Animators make many rough passes before refining rhythm and energy, and explore several variations of a concept. — [Duolingo Blog](https://blog.duolingo.com/streak-milestone-design-animation/)
  - Growth lead Gina Gotthilf's team iterates constantly; after the delayed sign-up result, they tested exactly when to ask (mid-lesson or after a lesson). — [First Round Review](https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker)
- **Duolingo, growth strategy:**
  - Jorge Mazal reports that a major gamification update at first produced no change in retention or DAU.
  - His team then modelled the user base and found current-user retention (CURR) had roughly 5 times the DAU impact of the next-best lever.
  - That finding refocused work on retaining existing users through leaderboards and streaks.
  - Source: [Lenny's Newsletter, Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) (page fetch failed; detail from search summaries, and [Okara](https://okara.ai/blog/how-duolingo-grew) relays the same)
- **Flighty, principles and process:**
  - "We want Flighty to work so well that it feels almost boringly obvious"; "There's something comforting about information always being there."
  - The team sketches 20 design ideas per problem ("what fits on a sheet of paper") and avoids "pulling from your existing asset library."
  - Jones: "You get to six or seven ideas and think 'that's it'... then you try it and it's not bad at all." Also: "We really have to shine when things go awry."
  - Source: [Apple Developer, Flighty](https://developer.apple.com/news/?id=970ncww4)
- **Airbnb:** the DLS favours reusable cross-platform components that have personality, and Saarinen has worked on it since 2015 — [Karri Saarinen](https://karrisaarinen.com/dls/). The 2025 relaunch reportedly involved about 200 designers; Chesky personally previews design-system changes — [Design Compass](https://designcompass.org/en/2025/07/04/airbnb-new-design-system/). The four labels "unified, universal, iconic, conversational" for DLS principles appear only in secondary blogs and are unverified.
- **Things 3:**
  - Things launched in 2008; going from Things 1 to Things 2 took about four years, and the gap to Things 3 (2017) was longer.
  - Between major versions, the app regularly adopted new OS features.
  - Source: [MacStories](https://www.macstories.net/reviews/things-3-beauty-and-delight-in-a-task-manager/)
- **Headspace:** the internal brand team owns guidelines for colour, type, tone and motion; the 2024 identity was made with Italic Studio. — [Standards](https://standards.site/examples/headspace/)

### Inferences

- Duolingo's process is a mix of strong art and character direction with growth experiments. Design decisions such as streak features are framed as hypotheses and kept only if they win A/B tests.
- Flighty and Things show a small team can win design awards by doing fewer things with extreme finish, and by using platform features (Live Activities, haptics) early and well.

### Gaps

- No primary Cultured Code interview on team size or design process was retrieved.
- Monzo's design principles and tone guide were not found on monzo.com in this pass.

## 3. What measurable outcomes are attributed to design?

### Takeaway

Duolingo has the most hard numbers, from its own blog and interviews: delayed sign-up gave about +20% DAU, Streak Wager +14% Day-7 retention, and Weekend Amulet +4% return a week later. The other apps' outcomes are mostly awards and reputation.

### Cited Findings

- Moving sign-up a few steps later, after the learner had tried the app, gave about a 20% increase in DAU (per Gotthilf). — [First Round Review](https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker); [Taplytics](https://taplytics.com/blog/duolingo-ab-test-onboarding)
- Duolingo streak experiments (2017, by product manager Kai Herng Loh, Growth team):
  - Streak Wager raised Day-1, Day-7 and Day-14 retention significantly, with Day-7 the biggest at +14%.
  - Weekend Amulet users were 4% more likely to return a week later and 5% less likely to lose their streak.
  - DAU falls 5–10% on weekends.
  - Research found learners who binge lessons are more likely to quit than those who pace themselves, which is the rationale for streaks.
  - Source: [Duolingo Blog](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/)
- After the phoenix streak-milestone redesign, early iOS and Android metrics showed more learners keeping streaks and celebrating milestones. No figures were published. — [Duolingo Blog](https://blog.duolingo.com/streak-milestone-design-animation/)
- Mazal's CURR work: secondary sources report about 4.5x DAU growth over four years, a 21% relative CURR gain, and daily churn among current users down more than 40%. Some figures may be cumulative, so treat them as approximate. — [Virtualpatrick](https://virtualpatrick.com/2023/03/22/meaningful-metrics-product-growth-inspired-by-duolingo/); [Okara](https://okara.ai/blog/how-duolingo-grew)
- Awards:
  - Duolingo is an Apple Design Award winner (2023, Delight and Fun per secondary coverage). — [Apple Developer](https://developer.apple.com/news/?id=jhkvppla); [Madhyamam](https://english.madhyamam.com/technology/innovative-design-duolingo-wins-apple-design-award-2023-1169335)
  - Flighty won the 2023 Apple Design Award for Interaction. — [Apple ADA 2023](https://developer.apple.com/design/awards/2023/)
  - Things has won two Apple Design Awards. — [culturedcode.com](https://culturedcode.com/)
- Headspace: Monks reports that generative-AI tooling cut ad production time by about two-thirds. This is a marketing outcome, not a UX one. — [Monks](https://www.monks.com/case-studies/headspace-personalized-at-scale-performance-creative)

### Inferences

- For a gamified learning app, the best-evidenced design levers are when the app asks for sign-up and how streak loss is softened (freezes and amulets), more than visual polish alone.

### Gaps

- No published retention numbers tie Airbnb's 2025 redesign, Things, Headspace, Monzo or Flighty's design to business outcomes.
- The exact Apple Design Award years and categories for Things were not confirmed from Apple's pages in this pass.

## 4. What criticisms exist?

### Takeaway

The main criticism falls on Duolingo: streak anxiety and guilt-driven notifications ("streak creep"), plus a trust backlash after the April 2025 "AI-first" memo. Revolut is criticised for clutter, Monzo for upsell nags and a dated look, and Things 3 at launch for missing power features.

### Cited Findings

- "Streak creep": guilt-laden alerts to lapsed users, including a disappointed-owl framing, used once the streak itself stops motivating. — [The Decision Lab](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification)
- Counterpoint: calling every persuasive choice manipulation blurs real dark patterns, and the owl's nagging is accountability users signed up for. — [Opinions and Conditions (Substack)](https://opinionsandconditions.substack.com/p/duolingo-owl-dark-patterns-digital-guilt)
- AI-first backlash:
  - Luis von Ahn's memo of 28 April 2025 said contractors would be phased out for work AI can do, and that AI use would factor into hiring and reviews.
  - Users posted app-deletion videos and unfollowed the company in large numbers.
  - Von Ahn said he did not expect the backlash.
  - Sources: [Fortune](https://fortune.com/2025/06/09/duolingo-ceo-surprised-backlash-ai-first-company-announcement); [Ban the Bots](https://www.banthebots.org/explainers/duolingo-ai-backlash)
  - Claims of a formal walk-back and of slower youth growth are unverified.
- The energy and hearts system limits free daily practice, and streak pressure can displace learning goals. — [Unanswered](https://unanswered.io/guide/why-are-people-leaving-duolingo) (low-quality source)
- Revolut: home-screen clutter (23 tap targets), promotions, unwanted features; Monzo: upgrade nags and a UI "not clean." — [Revolut Community](https://community.revolut.com/t/stop-updating-ui-with-a-terrible-ux-changes/125058?page=7); [Monzo Community](https://community.monzo.com/t/app-design-is-not-clean/38534)
- Things 3 at launch:
  - No web API.
  - Weak attachments.
  - No iOS keyboard shortcuts.
  - Repeating tasks could not be created inside projects.
  - Slow bulk entry.
  - Source: [MacStories](https://www.macstories.net/reviews/things-3-beauty-and-delight-in-a-task-manager/)
  - Several of these have probably been fixed since, so treat them as 2017-era.
- Airbnb 2025: Chesky previewed a further design-system revision after feedback on the summer app, which suggests the May 2025 look was not final. — [Design Compass](https://designcompass.org/en/2025/07/04/airbnb-new-design-system/)

### Inferences

- The same mechanic (the streak) produces both Duolingo's best retention numbers and its strongest criticism. For a small app, the lesson is to pair streak pressure with built-in forgiveness, such as freezes or a weekend amulet, which Duolingo found measurably good for retention.

### Gaps

- No academic or large-sample study of streak anxiety was found. The February 2025 "Duo is dead" marketing stunt surfaced only as a headline ([Interrobang Design](https://interrobangdesign.beehiiv.com/p/why-did-the-duolingo-owl-get-killed-off)) and was not researched.

## 5. Which lessons transfer to a small team building a gamified language-learning app in React Native/Expo?

### Takeaway

Copy Duolingo's mechanisms, not its scale:

1. one linear path;
2. a small, consistent cast of characters;
3. reward micro-animations at the moment of a correct answer;
4. delayed sign-up;
5. streaks with built-in forgiveness, tested as products.

Add Things' and Flighty's discipline: one signature interaction, extreme restraint, and early use of platform surfaces such as widgets and Live Activities.

### Cited Findings

- One path instead of a tree, so that equal effort gives equal progress. — [Apple Developer](https://developer.apple.com/news/?id=jhkvppla)
- A minimal vector art style is "quick to produce," so a small team can make lots of art. Use few shapes, round forms, white space and a caricatured key detail, and give each sentence its own small story. — [Duolingo Blog, Shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/)
- Rive state machines handle character states and lip-sync, and combined animations stay small (under 1 MB claimed). Rive has a React Native runtime, though this pass did not verify current Expo compatibility. — [Duolingo Blog, visemes](https://blog.duolingo.com/world-character-visemes); [Medium/UI Animation](https://uianimation.medium.com/duolingo-style-animation-in-mobile-apps-2026-how-it-works-and-what-a-rive-animator-brings-to-53f21ab79cbc)
- Let learners try a lesson before asking for sign-up (about +20% DAU). — [First Round Review](https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker)
- Streak forgiveness (Weekend Amulet) and commitment devices (Streak Wager) gave +4% one-week return and +14% Day-7 retention; daily cadence beats bingeing. — [Duolingo Blog](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/)
- Build milestone celebrations as transformations ("power-ups") with culturally universal imagery and a shareable card. — [Duolingo Blog](https://blog.duolingo.com/streak-milestone-design-animation/)
- Retention of current users beats new-user features: gamification alone did not move DAU until it was aimed at CURR. — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- Flighty-style process: sketch 20 ideas per screen, avoid assembling from stock components, design for the offline and failure states, and borrow proven real-world conventions. — [Apple Developer, Flighty](https://developer.apple.com/news/?id=970ncww4)
- Things-style signature interaction: one context-aware, draggable gesture element plus haptics and white space. — [MacStories](https://www.macstories.net/reviews/things-3-beauty-and-delight-in-a-task-manager/)
- Monzo-style identity: one ownable saturated colour object and plain-English copy. — [Monzo Community](https://community.monzo.com/t/dont-go-coral-card/3433?page=5); [Scaleup Collective](https://www.thescaleupcollective.com/blog/monzos-brand-strategy-how-the-neobank-championed-community)
- Avoid the trap of guilt notifications and pressure-only streaks. — [The Decision Lab](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification)

### Inferences

- For a small RN/Expo team, a sensible order of investment:
  - Streak with a freeze or forgiveness mechanic from day one.
  - Deferred account creation.
  - A correct-answer reward moment (a character reaction plus sound and haptic).
  - One milestone celebration done really well.
  - Home-screen widgets or iOS Live Activities for the daily goal, Flighty-style.
- A visual system costs less to keep consistent than a large art set. Duolingo's rules (few shapes, round, white space, exaggerate one detail) are written explicitly so a small team can follow them.
- Expo-specific feasibility of Rive, Live Activities and widgets was not researched here. Check the Expo v57 docs, as the project's AGENTS.md requires.

### Gaps

- No primary data on Duolingo sound and haptic design. The Duolingo design hub (blog.duolingo.com/hub/design/) is the next source to read.
- No primary data on Duolingo leaderboards, XP or league effect sizes; the Mazal article could not be fetched.
