# PRD — Registry API, Web Catalog & Submission Form

**Owner:** founder · **Status:** draft · **Phases:** 1 (API) + 2 (web/form) · **Priority:** P0/P1

## Problem

The MCP server needs a hosted source of truth for the catalog, and humans need a place to browse
what exists and contribute. Both read from the same catalog data.

## Part A — Registry API (Phase 1, P0)

### Goal
A stateless, cacheable HTTP API that serves the curated catalog to the MCP server and web catalog.

### Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/v1/domains` | Full domain → category tree |
| GET | `/v1/skills?q=&domain=&category=&ide=&limit=` | Search/list skills |
| GET | `/v1/skills/{id}` | Skill metadata + canonical body preview |
| GET | `/v1/skills/{id}/payload?ide=claude-code` | Rendered install payload for one IDE |
| GET | `/v1/plugins*` | Same shape; Phase 3 content |
| POST | `/v1/telemetry` | Opt-in anonymous usage events |
| GET | `/v1/health` | Liveness |

### Data source

- Catalog authored as files in `catalog/` (see `02-CONTENT-MODEL.md`), built into Postgres +
  object storage by a publish script. Git remains the editorial source of truth.
- `price_tier` present but always `free`.

### Requirements

- Read-only public endpoints, aggressively cacheable (CDN + ETag).
- Payload rendering: canonical `SKILL.md` → per-IDE format (Claude SKILL.md, Cursor SKILL.md+.mdc,
  Codex AGENTS.md block). Rendered at publish time and stored, not per request.
- Search: Postgres full-text over name/summary/tags at launch.
- Rate limiting + basic abuse protection on telemetry.

### Acceptance criteria

1. MCP server can list domains, search, and fetch a working payload for each IDE.
2. Publishing a new skill = add folder + run publish script; it appears in the API.
3. p50 latency < 200ms for cached reads.

## Part B — Web Catalog (Phase 2, P1)

### Goal
A public site to browse, search, and get one-click install snippets — plus docs and the submission
form. This is the top-of-funnel for the free-first growth strategy.

### Pages

- **Home:** the pitch, the "type agentgrammar" demo (GIF/video), install snippet, top skills.
- **Browse:** domain → category → skill grid with search & filters (by IDE, tag).
- **Skill detail:** description, example prompt, supported IDEs, "Add to your agent" (copy MCP
  snippet + `install_skill` hint), version history.
- **Submit:** embedded Google Form / Tally (see Part C).
- **Docs:** install per IDE, how skills work, contribution guide.
- **Changelog:** new/updated skills (also feeds marketing content).

### Requirements

- Next.js on Vercel, SSR for SEO (developers search Google for "cursor design skill" etc.).
- Reads the same registry API; no separate data source.
- Copy-paste MCP snippet identical across IDEs.
- PostHog analytics on browse → install-snippet-copy funnel.

### Acceptance criteria

1. A developer can discover a skill via search engine, land on the detail page, and install in < 2
   min without cloning anything.
2. Every skill page shows all three IDE install paths.

## Part C — Submission Form (Phase 2, P2, minimal)

### Goal
Let contributors send skills/plugins for manual review, with zero backend.

### Implementation
- **Google Form or Tally**, embedded on `/submit` and linked from README/CONTRIBUTING.
- Fields: name, contact, skill title, domain, category, target IDEs, description, link to
  SKILL.md/gist/repo, license/originality confirmation.
- Responses → spreadsheet + email/Slack notification.
- Manual review against the quality bar in `02-CONTENT-MODEL.md`; accepted skills authored into
  `catalog/` by the team.

### Acceptance criteria
1. Form reachable from site + README.
2. A submission produces a notification and a tracked row.
3. Rejection has a templated, criterion-specific reply.

## Out of scope (until Phase 3+)

Accounts, ratings UI, automated ingestion, publisher dashboards, payments.
