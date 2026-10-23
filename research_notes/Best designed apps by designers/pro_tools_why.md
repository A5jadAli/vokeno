# Why Linear, Stripe, Arc/Dia, Notion, Figma, Raycast and Superhuman are considered world-class UI/UX (as of Oct 2026)

Scope note: research run 2026-10-23. Primary sources (company blogs and founder essays) were fetched for Linear, Arc/Dia, Superhuman, Figma and Stripe. Notion and Raycast coverage leans more on secondary sources, and each finding below says which kind of source it is. Raycast's developer docs and First Round's Superhuman onboarding playbook could not be fetched.

## 1. What specific design decisions do designers point to?

### Takeaway

The products share a few concrete moves. They make speed feel instant through local data and optimistic UI (Linear, Superhuman, Figma). They put a keyboard or command layer over everything (Superhuman Cmd+K, Raycast, Linear). They build colour and theme systems on perceptual colour spaces (Stripe CIELAB in 2019, Linear LCH in 2024). They limit how much the user must learn by making strong default choices for them. The products that went too far on novelty (Arc, Figma's floating panels) are the ones that had to walk changes back.

### Cited Findings

**Linear**

- Speed comes from architecture. Tuomas Artman says the first code he wrote was the sync engine, which is "very uncommon for a startup." The browser keeps a full local replica of the workspace in IndexedDB: reads are local, and the network is used for sync rather than fetching. Changes go to in-memory state first, are saved locally, and are sent to the server in batches in the background (optimistic UI). These are secondary technical breakdowns, and Linear has not fully documented its conflict handling. — [performance.dev](https://performance.dev/what-makes-linear-feel-instant); [1023jack breakdown](https://1023jack.com/general/how-s-linear-so-fast-a-technical-breakdown/); [reverse-engineered LSE repo](https://github.com/Aslam97/reverse-linear-sync-engine)
- March 2024 redesign: light and dark themes moved from HSL to LCH. Each theme went from **98 specific variables to 3 inputs: base colour, accent colour and contrast**. LCH was chosen because it is perceptually uniform, so colours at the same lightness look equally bright, and it handles surface elevation (background, panels, dialogs, modals) well. The contrast variable lets Linear generate high-contrast accessibility themes automatically. — [Linear, "How we redesigned the Linear UI (part II)", 28 Mar 2024](https://linear.app/now/how-we-redesigned-the-linear-ui)
- The same redesign used less blue in the chrome for a more neutral look. Text and neutral icons became darker in light mode and lighter in dark mode for better contrast. Inter Display was added for headings, with Inter kept for body text. Labels, icons and buttons in the sidebar and tabs were aligned, and notifications in the inbox were grouped by type. Navigation was deliberately left out of scope because changing it was "too risky." — [Linear part II](https://linear.app/now/how-we-redesigned-the-linear-ui)
- March 2026 refresh: Linear calls it a "calmer, more consistent interface." Headers, navigation and view controls are now the same across projects, issues, reviews and documents. Icons were redrawn and resized, and the sidebar is dimmed so content stands out. The cool, blue-ish palette shifted to a warmer, less saturated grey; the team notes that going too warm "would look muddy." — [Linear changelog 2026-03-12](https://linear.app/changelog/2026-03-12-ui-refresh); [Linear, "Behind the latest design refresh"](https://linear.app/now/behind-the-latest-design-refresh)
- Polish happens at the level of tiny details. Examples from Quality Wednesdays: matching the sizes of adjacent buttons, stopping the issue composer from changing height when a line is added, and fixing a hover state that darkened instantly instead of fading over **150 ms**. — [Linear, "Quality Wednesdays", 13 Aug 2025](https://linear.app/now/quality-wednesdays)

**Stripe (dashboard, Checkout, docs)**

- Colour system: Stripe's audit found that **none of its default small-text colours except black met the 4.5:1 WCAG threshold**. Stripe rebuilt the palette in CIELAB so every hue follows the same perceptual lightness curve, which means yellow gets the same contrast range as blue. Rules: any two colours **5 levels apart** are safe for small text, and **4 levels apart** for icons and large text. Stripe also built an internal tool that shows "imaginary" colours that cannot be displayed (such as a "really dark yellow"). — [Stripe, "Designing accessible color systems", Koopersmith & Miner, 15 Oct 2019](https://stripe.com/blog/accessible-color-systems)
- Docs: written in Markdoc, a Markdown superset Stripe open-sourced in 2022. Its purpose is to let writers "express interactivity and simple page logic without mixing code and content." Code samples include the reader's own API test key, and pages have checklists and collapsible sections. — [Stripe, "How Stripe builds interactive docs with Markdoc"](https://stripe.com/blog/markdoc)
- Docs layout (secondary teardowns): three columns, with navigation, then prose, then runnable code that stays in sync with the prose. Hovering over a paragraph highlights its code. The API reference is organised by object, not by HTTP method. The language picker re-renders every sample on the page and the choice carries across pages. — [Moesif teardown](https://www.moesif.com/blog/best-practices/api-product-management/the-stripe-developer-experience-and-docs-teardown/); [docsio teardown](https://docsio.co/blog/stripe-api-docs-teardown)
- Early attention to detail: early designer Benjamin De Cock says Stripe "invested in [design] at a time where companies were usually taking a different approach." A secondary summary of his essay says Patrick Collison personally rewrote the payment-demo typing animation because it felt too rigid. This is a single anecdote. — [Interview with Benjamin De Cock](https://manual.compoundplanning.com/chapters/interview-with-benjamin-de-cock-early-designer-at-stripe); [inside.com.tw summary](https://www.inside.com.tw/article/3668-stripe)

**Arc / Dia (The Browser Company)**

- Arc's signature features were a vertical sidebar, Spaces, Live Folders and Calendar Preview on Hover. Josh Miller's own data shows how few people used them: **"Only 5.52% of DAUs use more than one Space regularly"**, **"Only 4.17% use Live Folders"**, and Calendar Preview on Hover was used by **0.4%**. — [Josh Miller, "Letter to Arc members 2025", 26 May 2025](https://browsercompany.substack.com/p/letter-to-arc-members-2025)
- Dia's design choice is to start from a familiar browser interface and put AI on top. Miller writes that users still rely on familiar interfaces, so new products should start there. Speed, security and a clean architecture were made foundations, and Dia was rebuilt from scratch. — [Miller letter](https://browsercompany.substack.com/p/letter-to-arc-members-2025)
- From late 2025 Dia began adding back "Arc's greatest hits." In Oct 2026 Dia 1.53 (Mac) and 1.2 (Windows) convert Arc's GitHub Live Folders into "Live Groups" on import, and importing from Arc on Windows switches Dia to vertical tabs automatically. — [TechCrunch, 3 Nov 2025](https://techcrunch.com/2025/11/03/dias-ai-browser-starts-adding-arcs-greatest-hits-to-its-feature-set); [PiunikaWeb, 16 Oct 2026](https://piunikaweb.com/2026/10/16/dia-update-github-live-groups-custom-skills/)

**Notion**

- The blocks model: Ivan Zhao and Simon Last built "LEGO-style software blocks" (pages, databases, bulleted lists, embeds) so that anyone can build their own tools. Zhao contrasts this with most software, which is like "toasters" that do one thing well. Templates act as "LEGO kits" that teach users how to build something. People typically start with one page and build it up over time. — [Ness Labs interview with Ivan Zhao](https://nesslabs.com/notion-featured-tool)
- Performance work: adding SQLite caching to the desktop apps (2021) made initial page loads **50% faster** for most users and navigation **50% faster**. WASM SQLite in the browser improved navigation by **20%**, with bigger gains on slow networks: **28% in Australia, 31% in China, 33% in India**. — [Notion, faster page load](https://www.notion.com/blog/faster-page-load-navigation); [Notion, WASM SQLite](https://www.notion.com/blog/how-we-sped-up-notion-in-the-browser-with-wasm-sqlite)

**Figma**

- Multiplayer (Evan Wallace, 2019): Figma rejected Operational Transformation as "unnecessarily complex for our problem space." It uses a CRDT-inspired, server-authoritative model where the last write wins for each property, so edits to different properties never conflict. Clients apply their own edits **immediately** and ignore conflicting server updates until their changes are acknowledged, which avoids flicker. Sharing is a link: "Just by having the right link, everyone can view the current status of a design project." — [Figma, "How Figma's multiplayer technology works", 16 Oct 2019](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
- UI3 (more than two years of work; generally available 10 Oct 2024):
  - Floating navigation and properties panels were reversed to "fixed but resizable."
  - "Minimize UI" replaced Hide UI.
  - Blend modes moved out from behind an icon button into an inline dropdown, because the icon slowed people down.
  - "Clip content" went back from a dropdown to a checkbox, because the dropdown added a click.
  - Sliders gained context-specific variants (notches for variable fonts, hue and opacity previews).
  - An early label-less minimal design was dropped because it hurt accessibility (the UX writer called it "a deal breaker").
  - Tim Van Damme hand-drew about **200 icons**.
  - [Figma, "Our approach to designing UI3", 1 Oct 2024](https://www.figma.com/blog/our-approach-to-designing-ui3/)

**Raycast**

- (Secondary analysis) Its core principle is a near-instant response, with a **50 ms** latency threshold. It is credited to native code, a preloaded extension index and aggressive caching. Keyboard shortcuts appear inline in results. Extensions feel native because they reuse shared form components, action panels and navigation patterns. — [Blake Crosley design guide](https://blakecrosley.com/guides/design/raycast). This is not a Raycast publication.
- Raycast 2.0 (out of beta 21 Aug 2026) is a ground-up rewrite that runs on macOS and Windows, using TypeScript, Swift, C#, Rust, Node and React. Raycast's own framing: "the hard part wasn't making Raycast run. The hard part was making it feel right." Windows needed a custom file search because "Windows doesn't have proper indexing." — [Raycast, "A Technical Deep Dive Into the New Raycast"](https://www.raycast.com/blog/a-technical-deep-dive-into-the-new-raycast); [Raycast for Windows](https://raycast.com/blog/raycast-for-windows); [Raycast changelog v2.0, 21 Aug 2026](https://www.raycast.com/changelog/windows/2-0)
- (Secondary) The 2.0 architecture is a native host app (Swift/AppKit on Mac, C#/.NET 8/WPF on Windows) with a shared React/TypeScript UI in a native web view and a Rust file indexer. The trade-off is higher memory use in exchange for faster development and cross-platform reach. — [devtoolpicks](https://devtoolpicks.com/blog/raycast-2-public-beta-windows-indie-hackers-2026); [plushcap summary](https://www.plushcap.com/companies/raycast/blog/summaries/2026/5)

**Superhuman**

- Speed budget: 100 ms is treated as the **maximum**. The internal target is **under 50 ms "whenever possible"**, and the new renderer shows emails in **under 32 ms** (one to two Chrome frames). Techniques: a local email database (works offline), preloading and prerendering threads the user is likely to open, minimal animations, keyboard-first design with shortcut hints shown in the UI, a Cmd+K command library, and continuous performance measurement. — [Superhuman, "Why Superhuman Mail is built for speed: applying the 100ms rule", 28 Jun 2022](https://blog.superhuman.com/superhuman-is-built-for-speed/)
- Onboarding as game design: every new user had a **one-to-one 30-minute concierge video call**. Its purpose was to make the goal (inbox zero) achievable. Vohra lists goals as the first of five game-design factors: "Good goals are concrete, achievable, and rewarding." — [Rahul Vohra, a16z, "Game Design, Not Gamification"](https://a16z.com/game-design-not-gamification-for-great-products)

### Inferences

- "Instant" is the design decision most often credited, and in every case it is an architecture choice (local replica plus optimistic writes) made before any visual design. Linear, Superhuman, Figma and Notion all moved data onto the client.
- Linear (LCH) and Stripe (CIELAB) independently chose perceptually uniform colour spaces so that a small number of inputs produce accessible, consistent themes. This is a portable technique, not just a matter of taste.

### Gaps

- No primary source was found on the origin or design rationale of Notion's "/" command. It is a well-known feature, but no Notion design-lead statement was retrieved.
- Linear's Cmd+K and keyboard-first design are widely cited, but this run found no Linear primary text on them; only secondary sources such as the [buildmvpfast piece](https://www.buildmvpfast.com/blog/linear-aesthetic-tokens-density-keyboard-first-ux-2026) cover them.
- Stripe Checkout's specific UI decisions (field order, inline validation, Link autofill UX) were not documented from a primary design source in this run.
- Raycast's extension UI guidelines and store review rules could not be fetched (developers.raycast.com failed).

## 2. What design philosophies have the founders and design leads articulated?

### Takeaway

Linear argues for craft over metrics and taste over A/B tests, and says quality is a business strategy because it creates pull. Superhuman treats speed as the feature and runs product–market fit as a measured engine. The Browser Company changed its philosophy in public, from novelty to "simplicity matters more than novelty." Figma's design leads say craft cannot be measured, so you listen hard. Notion's philosophy is building blocks rather than finished tools ("LEGO, not toasters").

### Cited Findings

- **Linear / Karri Saarinen, "Why is quality so rare?" (27 May 2025, adapted from his Config 2025 keynote):**
  - Craft is "deliberate attention to excellence because the work matters to the maker, not because someone is checking."
  - Designers moved from asking "does it feel right" to "does it convert," and A/B tests replaced judgment.
  - "Technology makes it faster to build, but harder to care."
  - Quality is a "feeling of rightness," and he cites Christopher Alexander's "quality without a name."
  - He rejects the idea that you must choose between quality and growth, and says quality "creates pull."
  - [Linear](https://linear.app/now/why-is-quality-so-rare)
- **Linear on A/B tests:** Saarinen says his product teams "don't do A/B tests": "We validate ideas and assumptions that are driven by taste and opinions, rather than the other way around where tests drive decisions. There is no specific engagement or other number we look at." They still run betas and gather feedback. — [LogRocket, quoting Saarinen](https://blog.logrocket.com/product-management/ab-testing-pros-and-cons)
- **Linear Method:** the opening line is "There is a lost art of building true quality software." Its sections include "Scope projects down," "Generate momentum," "Write issues not user stories," "Build with users," "Launch and keep launching," and "Build in public." — [linear.app/method](https://linear.app/method)
- **Linear on redesigns:** "A redesign should not completely disassemble the product to its atomic parts." "The design concept should feel like an exciting evolution of the product." "It's always better to do a redesign quickly." — [Linear part II](https://linear.app/now/how-we-redesigned-the-linear-ui)
- **The Browser Company (Josh Miller, May 2025):**
  - Arc had a "novelty tax" and was "too different, with too many new things to learn, for too little reward."
  - Scott Forstall's critique: "Arc felt like a saxophone — powerful but hard to learn"; he urged them to build a piano instead.
  - Lessons: simplicity over novelty; speed, security and architecture as foundations; start from familiar interfaces.
  - [Miller letter](https://browsercompany.substack.com/p/letter-to-arc-members-2025)
- **Superhuman:**
  - "Speed is a built-in part of the Superhuman Mail experience." The post cites Paul Buchheit's 100 ms rule ("where interactions feel instantaneous"). — [Superhuman blog](https://blog.superhuman.com/superhuman-is-built-for-speed/)
  - Vohra's PMF engine is built on Sean Ellis's question, "How would you feel if you could no longer use Superhuman?" The benchmark is 40% "very disappointed," and Superhuman focuses on the "high-expectation customer," defined as "the most discerning person within your target demographic." — [First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit)
  - "Game design, not gamification": real goals, made achievable. — [a16z](https://a16z.com/game-design-not-gamification-for-great-products)
- **Figma:**
  - Marcin Wichary (Design Director): "Craft and flow don't have easy metrics, so you have to listen to users a lot, and then process feedback carefully."
  - Joel Miller: "The best products are built not just by the team behind them, but in close collaboration with the people who use them."
  - [Figma UI3 post](https://www.figma.com/blog/our-approach-to-designing-ui3/)
  - Evan Wallace's engineering principle: be "no more complex than necessary to get the job done." — [Figma multiplayer post](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
- **Notion / Ivan Zhao:** most software is "like toasters"; Notion gives LEGO blocks so people build their own tools. — [Ness Labs](https://nesslabs.com/notion-featured-tool)
- **Stripe:**
  - Benjamin De Cock: a users-first culture plus "shipping surprisingly-great things (as Patrick liked to say)." He says that unlike most fast-growing companies, quality did not degrade with growth. — [De Cock interview](https://manual.compoundplanning.com/chapters/interview-with-benjamin-de-cock-early-designer-at-stripe)
  - Katie Dill (Head of Design) argued on Lenny's Podcast (Oct 2023, "Building beautiful products with Stripe's Head of Design") that beauty and quality drive business growth. This comes from an episode summary, not the transcript. — [Podwise listing](https://podwise.ai/podcasts/8550?page=14)
- **Raycast / Thomas Paul Mann:** the origin story is frustration with "slow, clunky tools… too many clicks, too little speed." — [Ness Labs](https://nesslabs.com/raycast-featured-tool)

### Inferences

- Linear and Superhuman both reject using engagement metrics to decide design, but they replace them with different things. Linear uses judgment checked by betas. Superhuman uses one explicit qualitative-quantitative measure: the PMF survey of its most demanding users.
- The Browser Company's letter is the strongest primary evidence in this set that delight and novelty without broad usage is a product failure, even when the people who adopt it love it.

### Gaps

- No full transcript of Katie Dill's Lenny episode was retrieved, so her exact quotes are unverified.
- No primary Stripe text was found on "Stripe quality culture" as a formal doctrine. The evidence is former-employee accounts.

## 3. How do these teams operate to achieve quality?

### Takeaway

They build quality into routines rather than relying on heroics. Linear has weekly Quality Wednesdays (more than 1,000 polish fixes), a zero-bugs SLA, work trials and no handoffs. Stripe has friction logs. Figma runs all-team critique "speed rounds" and a reversible beta. Linear ran a six-week redesign with three core designers behind feature flags. Superhuman splits its roadmap 50/50 between what users love and what blocks them.

### Cited Findings

- **Linear, Quality Wednesdays:**
  - Started after an early-2023 offsite. Each week every engineer finds and fixes one small flaw that "degrade[s] the overall experience," usually in 30 minutes or less and never more than about an hour.
  - Fixes are presented at the Wednesday standup. Over two years there have been **more than 1,000 fixes**, tracked with a "quality" label.
  - Origin: the team could not spot an animation flaw in a screen recording, which showed that noticing flaws is a trained skill. One engineer: "Since you train this muscle over time, you start noticing patterns and common pitfalls."
  - [Linear, 13 Aug 2025](https://linear.app/now/quality-wednesdays)
- **Linear operating model** (from Saarinen):
  - Quality is the north star.
  - Hiring uses paid work trials to screen for craft.
  - Small teams with taste make decisions, not committees.
  - No handoffs from concept to completion.
  - Incomplete work is tested internally rather than shipped half-baked.
  - A **zero-bugs policy: bugs are fixed within 7 days**.
  - [Linear, "Why is quality so rare?"](https://linear.app/now/why-is-quality-so-rare)
- **Linear 2024 redesign process:**
  - Karri produced hundreds of concept screens in Figma, which were narrowed to a few directions.
  - A typical redesign needs 5–7 people; this one used **3 product designers** as the core and took about **6 weeks**. It started with an offsite in Athens.
  - Engineers paired in twos each afternoon and had a working build by the end of week one.
  - Milestones: stress tests, behaviour definitions, a sidebar refresh behind a feature flag, private beta, then general availability.
  - [Linear part II](https://linear.app/now/how-we-redesigned-the-linear-ui)
- **Linear 2026 refresh:** a dev toolbar inside the app toggles feature flags, so the team could compare the new and old UI in one click and ship incremental changes rather than one big release. — [Linear, "Behind the latest design refresh"](https://linear.app/now/behind-the-latest-design-refresh)
- **Stripe, friction logs:**
  - A "friction logger" takes on a user's mindset and works through a real flow end to end (sign up, interpret a warning, generate a report). They record every obstacle and what works, along with ideas for fixes.
  - Typical structure: context and persona, pros and cons, then a detailed stream-of-consciousness log. Logs are sized small, medium or large up front.
  - Everyone, managers included, is encouraged to write them. The practice carries most weight when leaders act on the findings.
  - Mostly reported via one Pragmatic Engineer deep dive; this run did not find Stripe's own published guide.
  - [Pragmatic Engineer, "Inside Stripe's engineering culture, part 2"](https://newsletter.pragmaticengineer.com/p/stripe-part-2)
- **Figma UI3 process:**
  - Critiques moved from 30-minute one-on-one sessions to 60-minute all-team "speed rounds."
  - The open beta had an opt-out ("If you get UI3 on a Wednesday, but have a work deadline for Friday, you can still go back," Ryhan Hassan) and was used to measure adoption, performance and feedback.
  - [Figma UI3 post](https://www.figma.com/blog/our-approach-to-designing-ui3/)
  - Multiplayer was prototyped in a simulated playground before touching the real codebase. — [Figma multiplayer](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
- **Superhuman:**
  - Half of the roadmap went to "doubling down on what users already love" (speed, shortcuts, automation, design). The other half went to "addressing what's holding others back" (mobile, integrations, calendaring).
  - Survey answers were segmented down to the "very disappointed" group to find the core user.
  - [First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit)
  - Performance metrics are tracked continuously to find slow areas. — [Superhuman blog](https://blog.superhuman.com/superhuman-is-built-for-speed/)
- **The Browser Company (counter-example):** "built too much too quickly," Arc "became bloated," and the team saw the warning signs in its data a year earlier "but didn't want to admit it." — [Miller letter](https://browsercompany.substack.com/p/letter-to-arc-members-2025)

### Inferences

- The repeatable mechanism is a fixed, recurring slot for polish (Linear) plus a structured "use your own product as a stranger" exercise (Stripe friction logs). Both are cheap for a small team.
- Feature-flagged, reversible rollouts (Linear's toolbar, Figma's opt-out) let opinionated teams take design risks without trapping users.

### Gaps

- "Polish weeks" at Linear: no primary source was found. Quality Wednesdays and the zero-bugs policy are the documented practices.
- No primary source was found for Raycast's or Notion's internal quality rituals.

## 4. What measurable outcomes are tied to design?

### Takeaway

The hard numbers are mostly self-reported. Superhuman's PMF score rose from 22% to 58%. Stripe reports 10.5–11.9% revenue lifts from its optimised checkout. Notion cut page loads by 20–50% with caching. Linear reached profitability in year two and more than 10,000 paying customers by year four with essentially no marketing. Arc's low feature adoption (5.5% use multiple Spaces) versus Dia's 40% use of chat-with-tabs is the clearest negative-to-positive design metric.

### Cited Findings

- **Superhuman:** PMF score went from **22% to 33%** after segmenting, then to **58%** within three quarters. The benchmark is 40%. — [First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit)
- **Superhuman's speed rationale** cites outside numbers: Amazon reportedly lost about 1% of sales per 100 ms of added latency, and Google reportedly lost 20% of traffic when search was 500 ms slower. — [Superhuman blog](https://blog.superhuman.com/superhuman-is-built-for-speed/). These are widely repeated figures cited second-hand by Superhuman.
- **Stripe:**
  - Businesses that switched to the Payment Element saw **10.5% more revenue** on average than those that did not. This is an observational comparison, not a controlled test. — [Stripe newsroom](https://stripe.com/newsroom/news/payments-revenue-uplift)
  - Moving from Card Element to the optimised checkout gave **+11.9% revenue** (Stripe analysis). — [Stripe blog](https://stripe.com/blog/testing-the-conversion-impact-of-50-plus-global-payment-methods)
  - Link raises conversion by **more than 7%** for logged-in Link customers. Apple Pay gave **+22.3% conversion** (via WooCommerce citing Stripe). — [WooCommerce](https://woocommerce.com/es/posts/stripe-optimized-checkout-suite/)
- **Notion:** SQLite caching made desktop loads and navigation **50% faster**. WASM SQLite in the browser made navigation **20% faster**, and **33% faster in India**. — [Notion](https://www.notion.com/blog/faster-page-load-navigation); [Notion WASM](https://www.notion.com/blog/how-we-sped-up-notion-in-the-browser-with-wasm-sqlite)
- **Linear:** profitable by year two and **more than 10,000 paying customers by year four with essentially no marketing spend**. Saarinen attributes this to the "pull" that quality creates. — [Linear](https://linear.app/now/why-is-quality-so-rare)
- **Arc vs Dia:** Arc's multi-Space use was 5.52% of DAUs, Live Folders 4.17%, and Calendar Preview 0.4%. Dia's chat-with-tabs is used by **40% of DAUs** and personalisation by **37%**. — [Miller letter](https://browsercompany.substack.com/p/letter-to-arc-members-2025)
- **Atlassian** agreed to buy The Browser Company for about **$610M cash** (announced 4 Sep 2025). One source dates the close to 21 Oct 2025; that date is single-sourced. — [Nasdaq](https://www.nasdaq.com/articles/atlassian-acquire-browser-co-610-mln-build-ai-powered-browser-work); [Wikipedia: Dia](<https://en.wikipedia.org/wiki/Dia_(web_browser)>)
- **Linear Quality Wednesdays:** more than 1,000 fixes in two years. This is an output count, not a business outcome. — [Linear](https://linear.app/now/quality-wednesdays)

### Inferences

- Almost no company here ties a single UI decision to a controlled business result. Stripe's checkout numbers come closest, and those are observational. Most of the evidence that design drives outcomes is founder narrative.

### Gaps

- No verified figures were found for Superhuman's ARR per onboarding specialist (a teardown cites $650K, but it was not found in First Round), Raycast usage numbers, or Figma UI3 adoption and retention.
- Superhuman's corporate status: a podcast listing says Grammarly acquired Superhuman in July 2025 and the combined company rebranded as "Superhuman" in Oct 2025. — [ListenNotes](https://www.listennotes.com/he/top-podcasts/rahul-vohra/). Not verified against a primary source; this changes who "Superhuman" refers to after 2025.

## 5. What criticisms or limits exist?

### Takeaway

Every exemplar has a documented weak spot. Arc failed on learning curve and was put into maintenance. Figma's UI3 floating panels slowed down power users and were reversed. Notion is slow on large databases and its offline mode is limited. Linear's look has been copied so much that it has become a generic, AI-default SaaS style. Raycast 2.0 trades memory for cross-platform reach.

### Cited Findings

- **Arc:**
  - Development of the core experience has stopped. Arc gets only Chromium upgrades, security and bug fixes. It is not open-sourced because it shares ADK with Dia. The team says it is "not trying to shut Arc down." — [Miller letter, May 2025](https://browsercompany.substack.com/p/letter-to-arc-members-2025)
  - **Outdated-claim flag:** any source that describes Arc as being actively developed is pre-May 2025. As of 2026 it is in maintenance mode, and users get help migrating to Dia rather than new features. — [usmobile 2026 roundup](https://www.usmobile.com/blog/best-browser-mac-2026/); [PiunikaWeb Oct 2026](https://piunikaweb.com/2026/10/16/dia-update-github-live-groups-custom-skills/)
- **Figma UI3:**
  - Floating panels "cramped the canvas," designs "peeked out" from behind them, and they moved rulers away from the design. KC Oh: "The nail in the coffin was learning that they slowed people down." — [Figma](https://www.figma.com/blog/our-approach-to-designing-ui3/)
  - Forum staff: "due to the overwhelming amount of negative feedback… we won't be bringing the floating panels back." Some users wanted the option kept rather than removed.
  - Accounts created after June 2024 had no "Go back to previous UI" option. By May 2025 UI3 had been rolled out to everyone, and complaints about the bottom toolbar continued.
  - [Figma forum](https://forum.figma.com/t/shortcut-to-bring-back-floating-panels-in-ui3/88458); [UX Collective](https://uxdesign.cc/figma-scrapes-ui3s-floating-panels-44303803c1ad); [feedme.design](https://feedme.design/figmas-ui3-balancing-bold-moves-with-user-feedback)
- **Notion:**
  - The first browser rollout of WASM SQLite made **initial page loads slower**, because the library download blocked boot. — [Notion](https://www.notion.com/blog/how-we-sped-up-notion-in-the-browser-with-wasm-sqlite)
  - Third-party reports say databases slow down at around 10,000 rows, with relations and rollups the most expensive features. — [Nuclino](https://www.nuclino.com/articles/notion-slow)
  - Offline-mode user reports: heavy resource use, a 2 GB cache, and lost blocks when switching between offline and online. These are anecdotal and undated. — [Latenode forum](https://community.latenode.com/t/notion-just-released-offline-functionality-whats-everyone-thinking/39156)
- **Linear clones and aesthetic fatigue:**
  - Daryl Ginn's "the Linear effect": dark backgrounds, blurred gradients and glowing accents on nearly every SaaS launch. — [UX Collective bootcamp](https://bootcamp.uxdesign.cc/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
  - Anthony Hobday: the dark style suited Linear's developer audience but "started a trend which many websites adopt even if it doesn't suit their brand." — [Hobday](https://anthonyhobday.com/blog/20230119.html)
  - LogRocket: the trend has "peaked already," and gradient and blur backgrounds can hurt text contrast. — [LogRocket](https://blog.logrocket.com/ux-design/linear-design)
  - AI tools such as v0, Lovable and Bolt produce this style by default ("AI purple problem"). — [dev.to](https://dev.to/jaainil/ai-purple-problem-make-your-ui-unmistakable-3ono)
  - "Copying Linear's aesthetics without understanding the reasoning… is why most clones feel hollow." — [925studios](https://www.925studios.co/blog/linear-design-breakdown-saas-ui-2026)
- **Linear's own course corrections:** the 2024 redesign deliberately left navigation out because changing it was too risky. The 2026 refresh moved away from the cool blue palette toward warmer greys, a quiet admission that the earlier look had become a cliché. — [Linear part II](https://linear.app/now/how-we-redesigned-the-linear-ui); [Linear 2026](https://linear.app/now/behind-the-latest-design-refresh)
- **No A/B tests:** critics note it depends on having taste and on beta feedback. LogRocket points out that Linear still validates through betas. — [LogRocket](https://blog.logrocket.com/product-management/ab-testing-pros-and-cons)
- **Raycast 2.0:** the web-view-based hybrid design raised memory use and stack complexity. — [plushcap summary](https://www.plushcap.com/companies/raycast/blog/summaries/2026/5)
- **Superhuman:** the 1:1 onboarding requirement meant a reported **550,000-person waitlist (2021)**. This figure comes from a third-party teardown. — [Flowjam](https://www.flowjam.com/blog/superhuman-onboarding-teardown-30-minute-wow-session)
- **Stripe:** its checkout uplift figures are self-reported and observational (see section 4). Docs teardown authors warn that copycats "are copying the surface (three columns, dark mode, a language picker)." — [docsio](https://docsio.co/blog/stripe-api-docs-teardown)

### Inferences

- The two biggest public reversals (Arc, Figma floating panels) both came from adding novelty or visual drama at the cost of efficiency for daily users. Both companies said so explicitly ("too much to learn"; "slowed people down").
- Copying the visual surface of Linear or Stripe without their architecture (instant feel) or rituals (polish) yields "hollow" products.

### Gaps

- No quantitative data was found on Figma UI3 backlash (number of opt-outs, churn).
- No authoritative critique of Superhuman's or Raycast's UX beyond onboarding friction and memory use.

## 6. Which principles transfer to a small team building a consumer language-learning app in React Native/Expo?

### Takeaway

Several practices transfer well. Make every tap feel instant through local-first data and optimistic writes. Set an explicit latency budget. Hold a weekly polish slot and write friction logs. Ship opinionated defaults instead of settings. Build the theme from a few perceptual-colour inputs. Treat onboarding as making the first goal achievable. Use reversible, flagged rollouts. Arc's lesson matters most for a consumer app: novelty costs the user effort to learn, so start from familiar patterns. The inferences below map the cited practices onto a mobile app; none of them was tested in a mobile language-learning setting.

### Cited Findings (principles from sources)

- Speed budget: under 50 ms target, 100 ms maximum. Preload what the user will open next, keep animations minimal, cache locally. — [Superhuman](https://blog.superhuman.com/superhuman-is-built-for-speed/)
- Local replica plus optimistic writes, synced in the background. — [performance.dev on Linear](https://performance.dev/what-makes-linear-feel-instant); clients apply their own edits immediately and suppress conflicting server echoes to avoid flicker — [Figma](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
- Caching helps navigation most; startup or boot cost can dominate first load, and heavy libraries can make it worse. — [Notion WASM SQLite](https://www.notion.com/blog/how-we-sped-up-notion-in-the-browser-with-wasm-sqlite)
- Weekly polish slot: each person fixes one small flaw in 30–60 minutes, tracked with a label. — [Linear Quality Wednesdays](https://linear.app/now/quality-wednesdays). Zero-bugs SLA of 7 days. — [Linear](https://linear.app/now/why-is-quality-so-rare)
- Friction logs: take on a persona, run a real flow end to end, record pros and cons as a stream of consciousness. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/stripe-part-2)
- Perceptual colour: generate themes from a base, an accent and a contrast input in LCH (Linear). Use a level-gap rule that guarantees WCAG contrast (Stripe: 5 levels for small text, 4 for icons). — [Linear](https://linear.app/now/how-we-redesigned-the-linear-ui); [Stripe](https://stripe.com/blog/accessible-color-systems)
- Onboarding: make the first goal "concrete, achievable, and rewarding" (Superhuman: inbox zero, made achievable by a call). — [a16z](https://a16z.com/game-design-not-gamification-for-great-products)
- PMF engine: ask "How would you feel if you could no longer use X?" and aim for 40% or more "very disappointed." Segment to high-expectation users and split the roadmap 50/50 between love and blockers. — [First Round](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit)
- Novelty tax: Arc's distinctive features reached under 6% of DAUs. Start from familiar interfaces. — [Miller letter](https://browsercompany.substack.com/p/letter-to-arc-members-2025)
- Reversible rollouts: feature-flag toggles to compare new and old UI (Linear), and opt-out betas (Figma). — [Linear 2026](https://linear.app/now/behind-the-latest-design-refresh); [Figma](https://www.figma.com/blog/our-approach-to-designing-ui3/)
- Don't hide controls in pursuit of minimalism. Figma removed label-less UI for accessibility and brought back one-click controls. — [Figma](https://www.figma.com/blog/our-approach-to-designing-ui3/)

### Inferences (how each applies to a small RN/Expo language app)

- **Perceived performance is the top transferable lever.**
  - Store lesson content, progress and audio clips locally (SQLite or MMKV in Expo).
  - Record answers, XP and streak updates optimistically, and sync in the background.
  - Preload the next exercise and its audio while the current one is on screen, the mobile equivalent of Superhuman's prefetching.
  - Set a budget, for example under 100 ms from tap to visible feedback, and measure it, much as Superhuman tracks performance continuously.
  - Watch cold start: Notion's experience shows a heavy dependency can make first load slower even while it speeds up navigation.
- **Mobile replaces keyboard-first with gesture- and tap-first.** The idea behind Cmd+K and shortcuts is fewer steps to the next action. For a learning app, that means one obvious primary action per screen (continue, check, next) and no menu hunting. This is an analogy; no source covers mobile directly.
- **Opinionated defaults over settings.** Linear and Superhuman chose the best workflow for the user. A learning app can have its journey module decide "what next" rather than offering a catalogue, which fits a single-journey design.
- **Craft rituals scaled to a team of 1–3.** A weekly 1-hour "quality slot" with a `quality` label in the tracker. A friction log written on a real phone (including a cheap Android device and a slow network) for each new unit or flow before release. A 7-day bug SLA.
- **Theme from tokens in a perceptual colour space.** Define a brand palette in OKLCH/LCH with a contrast-level rule. This keeps dark mode, high-contrast mode and accent colours accessible without hand-tuning dozens of values (Linear went from 98 values to 3).
- **Onboarding as game design.** The first session should finish a concrete, achievable, rewarding goal, such as completing a first real exchange in the target language. A human call doesn't scale for a consumer app, but its function (guaranteeing early success) can be built in. Superhuman's pattern of putting human help in front of high-value users could fit premium subscribers.
- **Measure love, not just engagement.** The Sean Ellis question can run as an in-app survey after a user's Nth lesson. Linear's "taste, then validate in beta" suits a team too small to get statistical significance from A/B tests; OTA preview channels can serve as the beta.
- **Avoid the novelty tax and clone aesthetics.** Distinctive interactions should earn their learning cost (Arc). Copying the Linear dark-gradient look reads as generic SaaS in 2026; owning a distinct brand voice transfers better than borrowing Linear's style.

### Gaps

- No source in this run measured these principles in consumer mobile or education apps specifically. All mappings above are inference.
- React Native-specific benchmarks (for example, what tap-to-feedback latency users perceive on low-end Android) were outside this run's sources.
