# agentgrammar — Go-To-Market & Content Plan

Free-first strategy: **maximize install base and word-of-mouth now; monetize later.** Marketing
starts today, before the product ships, by building the story and audience in public.

## Audience & channels (ranked)

1. **X/Twitter** — where AI-dev tooling breaks out (Cursor, Claude Code, MCP crowd). Primary.
2. **GitHub** — the repo is a marketing surface; stars = social proof. Keep README demo-first.
3. **Reddit** — r/ClaudeAI, r/cursor, r/LocalLLaMA (share value, not spam).
4. **Hacker News** — one strong "Show HN" at MVP launch, not before.
5. **Dev communities** — MCP / Cursor / Claude Discords; answer real questions, drop the tool where relevant.
6. **YouTube/Shorts + Loom** — the "type agentgrammar → magic" demo video is the single most shareable asset.

## The one asset everything hinges on

A **15–30s screen recording**: developer types "use agentgrammar to design this page," the chip
lights up, a skill installs, the UI transforms. This clip goes on the site, the README, X, and every
launch post. **Build this the moment the MVP works.**

## Launch sequence (build-in-public)

| Stage | Timing | Move |
| --- | --- | --- |
| Tease | today → week 2 | Post the vision, screenshots, the problem. Grow followers. |
| Build log | weeks 1–4 | Ship-in-public: daily/every-other-day progress posts. |
| Soft launch | end of Phase 1 | Drop the demo video + `npx agentgrammar` snippet to followers. |
| Public launch | Phase 2 | Show HN + Product Hunt + Reddit + full site live. |
| Sustain | ongoing | "New skill" posts from the changelog; user demos; skill spotlights. |

## X/Twitter content — start today

### Voice on X
Short, concrete, dev-native. Lead with a problem or a demo. One idea per post. Screenshots/clips beat
words. Never thread-bait without payoff.

### Post bank (ready to schedule)

**Day 1 — the reframe (pinned)**
> AI coding agents are great until they aren't.
> They over-refactor, run the wrong tool, ship happy-path bugs.
> What if your agent could *install a skill* for the exact job — design, review, migration — on demand?
> Building agentgrammar in public. Follow along. 🧵

**Day 2 — the problem, concretely**
> Every dev I know has a graveyard folder of "good prompts."
> Copy → paste → tweak → lose it.
> Prompts shouldn't live in a Notion doc. They should be skills your agent installs.

**Day 3 — the vision shot**
> One tool. Every AI IDE.
> `use agentgrammar to design a pricing page` → the agent grabs the best UI/UX skill and applies it.
> Claude Code, Cursor, Codex — same snippet. [mockup image]

**Day 4 — build log**
> Day 4 building agentgrammar:
> - locked the taxonomy (design / code / media)
> - manifest schema for skills
> - MCP tool spec
> Ship-in-public, receipts below 👇 [screenshot of docs]

**Day 5 — teach (borrow authority from the frameworks)**
> A good agent skill has ONE testable output.
> Not "improve the code." → "add pagination to GET /users, tests included."
> This is literally the first rule in our SCOPE framework. Steal it. [SKILL.md snippet]

**Day 6 — the chip reveal**
> This is the moment we're chasing 👇
> You type "agentgrammar" and it becomes a live tool your agent calls.
> [10s clip of the chip lighting up]

**Day 7 — ask/engagement**
> If your AI agent could install ONE expert skill instantly, what would it be?
> Design systems? Test writing? Framework migration? Motion graphics?
> Reply — we're curating the launch catalog from your answers.

**Launch day**
> agentgrammar is live. 🚀
> A curated library of skills your AI coding agent installs on demand.
> Free. Works in Claude Code, Cursor & Codex.
> `npx agentgrammar`
> Demo 👇 [the hero video] · Star the repo: [link]

**Recurring templates (use forever)**
- *New skill:* "New in agentgrammar: {Skill}. {one-line}. `use agentgrammar to {task}`. [clip]"
- *Before/after:* agent output without vs with the skill.
- *User spotlight:* quote-tweet someone using it.
- *Teardown:* "Why your agent broke this task — and the skill that fixes it."

### Cadence
- Weeks 1–4: **1 post/day** (mix build-log + teach + tease).
- Post-launch: **3–4/week** + reply to everything. Consistency > volume.

## Content to create (beyond X)

| Asset | Purpose | When |
| --- | --- | --- |
| Hero demo video (15–30s) | Everything hinges on it | End of Phase 1 |
| README demo GIF | GitHub top-of-funnel | Phase 1 |
| "How agentgrammar works" 2-min Loom | Onboarding + docs | Phase 1–2 |
| Blog: "Skills, not prompts" | SEO + category-defining manifesto | Phase 2 |
| Blog: "How we built one MCP server for 3 IDEs" | Dev credibility, HN-friendly | Phase 2 |
| Per-skill pages (SEO) | Capture "cursor design skill" searches | Phase 2 |
| Skill spotlight Shorts | Ongoing reach | Ongoing |

## Community / distribution playbook

- Answer MCP/Cursor/Claude questions in Discords & Reddit; link the tool only when it truly solves
  the asked problem.
- Turn the submission form into content: "Community skill of the week."
- Ask early users for a clip; repost. UGC is the flywheel.

## Metrics to watch (tie to master plan)

- Follower growth & post engagement (leading indicator).
- README/site → `npx agentgrammar` conversion.
- MCP installs, skills invoked/week, GitHub stars.
- Submission-form entries (community interest signal).

## Guardrails

- No spam, no fake engagement. Build-in-public earns trust; astroturfing kills it.
- Don't announce `npx agentgrammar` until the npm name is reserved and the server actually runs.
- Under-promise autonomy, over-deliver on the demo.

## This week's concrete to-dos

1. Reserve: npm `agentgrammar`, X `@agentgrammar`, domain, GitHub org.
2. Post Day 1 tease (pinned).
3. Make the vision mockup image (the chip + example prompt).
4. Start the build log — post progress from the Phase 0 repo restructure.
