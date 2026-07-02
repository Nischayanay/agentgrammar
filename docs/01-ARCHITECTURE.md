# agentgrammar — Architecture

## System overview

```
┌───────────────────────────────────────────────────────────────┐
│  AI IDE:  Claude Code  ·  Cursor  ·  Codex                      │
│  User: "use agentgrammar to design this dashboard UI"          │
│                          │                                      │
│        ┌─────────────────▼──────────────────┐                  │
│        │  agentgrammar MCP server (local)    │  ← thin client  │
│        │  Node/TS, runs via npx or binary    │                  │
│        │  tools:                             │                  │
│        │   • search_skills(query, domain?)   │                  │
│        │   • browse_domains()                │                  │
│        │   • get_skill(id)                   │                  │
│        │   • install_skill(id)               │                  │
│        │   • install_plugin(id)              │                  │
│        │   • list_installed()                │                  │
│        └─────────────────┬──────────────────┘                  │
└──────────────────────────┼─────────────────────────────────────┘
                           │ HTTPS (REST/JSON)
┌──────────────────────────▼─────────────────────────────────────┐
│  Registry API  (stateless, cacheable)                          │
│   GET /v1/domains                                              │
│   GET /v1/skills?q=&domain=&ide=                              │
│   GET /v1/skills/{id}                                          │
│   GET /v1/skills/{id}/payload?ide=claude-code                 │
│   GET /v1/plugins ...                                          │
│   POST /v1/telemetry  (opt-in usage events)                   │
├────────────────────────────────────────────────────────────────┤
│  Data:                                                          │
│   Postgres  → catalog metadata, versions, (later) users/ent.  │
│   Object storage (S3/R2) → skill/plugin payload bundles        │
│   Search    → Postgres FTS at first; upgrade to Meilisearch    │
├────────────────────────────────────────────────────────────────┤
│  Web catalog (Next.js)  → browse, search, install snippets,   │
│                            submission form, docs               │
└────────────────────────────────────────────────────────────────┘
```

## Why MCP is the backbone

- **One integration, three IDEs.** Claude Code, Cursor, and Codex all support MCP servers. Building
  on MCP means we do not maintain three separate plugin mechanisms.
- **It produces the tool-call UX.** A registered MCP server is what makes "agentgrammar" render/behave
  as a callable tool (the Supabase-chip effect).
- **On-demand delivery.** The agent decides what it needs, calls a tool, gets the skill injected —
  no manual file copying.

The thin MCP server holds no catalog itself; it proxies the hosted registry and writes installed
skills to the correct per-IDE location on the user's machine.

## Install-time rendering (the per-IDE trick, automated)

The repo already renders the same content four ways by hand. We formalize this: each catalog item
stores a **canonical body** plus render rules, and the MCP server writes the right file for the
active IDE.

| IDE | Install location | Format |
| --- | --- | --- |
| Claude Code | `.claude/skills/<name>/SKILL.md` (or `~/.claude/...`) | SKILL.md + frontmatter |
| Cursor | `.cursor/skills/agentgrammar-<name>/SKILL.md` + `.cursor/rules/<name>.mdc` | SKILL.md + .mdc rule |
| Codex | append/merge into `AGENTS.md` | standing context block |

The MCP server detects the IDE (env/config) or accepts an explicit `--ide` and requests
`GET /skills/{id}/payload?ide=...`, which returns the already-rendered file(s).

## Components & recommended stack

| Component | Recommendation | Why |
| --- | --- | --- |
| MCP server | **TypeScript** + official MCP SDK, distributed via `npx agentgrammar` | Zero-install UX; matches IDE ecosystems |
| Registry API | **TypeScript (Hono/Fastify)** or Python (FastAPI) | Small, stateless, easy to host |
| DB | **Postgres** (Supabase or Neon) | Catalog + future auth/entitlements in one place |
| Object storage | **Cloudflare R2** or S3 | Cheap payload hosting, CDN edge |
| Web catalog | **Next.js on Vercel** | Fast SSR catalog + docs + form |
| Search | Postgres FTS → **Meilisearch** later | Start simple, upgrade when catalog grows |
| Submission form | **Google Form / Tally** → issues/DB | Minimal per the founder's call |
| Telemetry | Opt-in POST to API; **PostHog** for product analytics | Measure the success metrics |
| Auth (Phase 3+) | Supabase Auth / Clerk | Only when accounts/Pro arrive |

Single-language (TypeScript) across MCP server, API, and web keeps the surface small for a lean team.

## Data model (Phase 1, read-mostly)

```
domain(id, slug, name, description, icon, sort)
category(id, domain_id, slug, name, description, sort)
skill(id, slug, name, summary, category_id, tags[], ide_targets[],
      latest_version, price_tier /* 'free' now */, publisher, status)
skill_version(id, skill_id, semver, canonical_body, changelog, created_at)
skill_payload(id, skill_version_id, ide, rendered_body, extra_files jsonb)
plugin(...)            -- same shape; payload is a bundle, not a doc
telemetry_event(id, event, skill_id, ide, anon_id, ts)   -- opt-in
-- Phase 3+: user, entitlement, rating, submission
```

`price_tier` exists from day one but is always `'free'` now — this is the "don't block future paid
tiers, build none" hook.

## Security & trust

- Skills are executable *instructions*, so **curation = the security boundary** at launch.
- Every payload is content-addressed (hash in the version row); the MCP server can verify integrity.
- The MCP server only writes to known per-IDE skill dirs; it never executes fetched content itself.
- Telemetry is **opt-in**, anonymous, and documents exactly what is sent.

## Non-goals for Phase 1

- No accounts, login, or payments.
- No community publishing pipeline (form only, manual review).
- No plugin execution sandbox yet (plugins arrive Phase 3).
