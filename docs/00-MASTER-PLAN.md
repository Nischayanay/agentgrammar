# agentgrammar — Master Plan

> The online library of skills & plugins that AI coding agents install on demand.
> Free-first. Multi-IDE (Claude Code, Cursor, Codex). Curated.

This folder is the source of truth for the product pivot from "internal framework files" to
"hosted developer product." Read in order:

| Doc | What it covers |
| --- | --- |
| `00-MASTER-PLAN.md` | This file. Vision, decisions, phases, success metrics. |
| `01-ARCHITECTURE.md` | System architecture, MCP server design, registry API, data model. |
| `02-CONTENT-MODEL.md` | Taxonomy (domains → categories → skills/plugins), manifest schema, submission flow. |
| `03-PRD-mcp-server.md` | PRD: the agentgrammar MCP server (the "type agentgrammar → tool call" experience). |
| `04-PRD-registry.md` | PRD: registry API + web catalog + submission form. |
| `05-BRANDING.md` | Name, positioning, voice, visual identity, taglines. |
| `06-MARKETING.md` | GTM from day one: launch sequence, X/Twitter content calendar, channels. |
| `07-ROADMAP.md` | Phased milestones with concrete deliverables and sequencing. |

## The one-sentence pitch

**agentgrammar is a curated online library of skills and plugins that any AI coding agent can
browse and install on demand — so your agent gets expert-level ability in design, code, review,
migration, and video, just by asking.**

## Locked decisions (from planning session, 2026-07-02)

1. **Target IDEs:** Claude Code, Cursor, and Codex — all three, unified via **MCP**.
2. **Content:** Fully curated by the team. Add a **minimal submission form** ("send us your
   skills/plugins, we review") — Google Form or equivalent, no heavy pipeline yet.
3. **Monetization:** **Free / donations only** at launch. Goal is a large user base first;
   subscription comes later. Architecture must not *block* future paid tiers, but we build none now.
4. **Deliverable now:** full plan — MCP framework, PRDs, branding, positioning, architecture, and
   marketing starting today (including what to tweet on X and what content to create).

## The core product insight

The green `⚡ Supabase` chip the founder referenced is an **MCP server integration** the IDE
recognizes and renders as a branded tool. MCP is the **one protocol all three target IDEs share**.

So: **agentgrammar ships as an MCP server.** When a developer types "use agentgrammar to design
this landing page," the IDE calls the `agentgrammar` MCP tool → the tool queries the hosted registry
→ returns/install the right skills → the agent now has that expertise. The word "agentgrammar"
becoming a live tool call *is* the MCP integration. Everything else in the product exists to feed
that moment.

## What exists today (starting point)

- 5 discipline frameworks as static files: `SCOPE`, `CLEAR`, `TRUST`, `LOGIC`, `GUARD`.
- Per-IDE packaging already solved by hand: Claude Code skills, Cursor rules+skills, Codex
  `AGENTS.md`, universal prompt.
- `install.sh` copies files locally. No backend, no discovery, no plugins, no categories.

The existing frameworks are **not thrown away** — they become the seed of the `code › review`
category and the reference example of "what a great agentgrammar skill looks like."

## What changes

| From | To |
| --- | --- |
| Clone + copy files | Agent installs on demand via MCP |
| 5 frameworks | Multi-domain library (design, code, review, migration, media) |
| Static local files | Hosted, versioned, searchable registry |
| No discovery | Browsable taxonomy + web catalog + in-agent search |
| Internal tool | Free public developer product, subscription-ready |

## Phases (summary — detail in `07-ROADMAP.md`)

- **Phase 0 — Foundation (week 1):** lock taxonomy + manifest schema; restructure repo into a
  registry-shaped catalog; keep `install.sh` as fallback. No backend.
- **Phase 1 — MVP (weeks 2–4):** hosted read-only registry API + agentgrammar MCP server working in
  Claude Code, Cursor, and Codex, serving the free catalog on demand. **This is the launch/demo.**
- **Phase 2 — Catalog site (weeks 5–7):** public web catalog to browse/search + "add to your agent"
  install snippets + submission form. Analytics.
- **Phase 3 — Depth (weeks 8–12):** plugins (not just skills), accounts, ratings, versioning UX.
- **Phase 4 — Monetize (when user base warrants):** Pro tier + entitlements; later, publisher payouts.

## Success metrics

| Metric | Phase 1 target | Phase 2 target |
| --- | --- | --- |
| Installs of the MCP server | 500 | 5,000 |
| Skills invoked / week | 1,000 | 25,000 |
| Catalog size (curated skills) | 25 | 75 |
| Weekly active agents | 200 | 2,500 |
| Submission-form entries | — | 50 |
| GitHub stars | 500 | 3,000 |

## Guiding principles

1. **The demo is the product.** If "type agentgrammar → it works" isn't magic, nothing else matters.
2. **Free removes friction; curation builds trust.** Both are the moat while small.
3. **One protocol (MCP), three IDEs.** Never build three separate integrations if one serves all.
4. **Ship the free loop before the paid loop.** Entitlement hooks now, paywalls never (yet).
