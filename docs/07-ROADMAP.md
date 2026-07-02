# agentgrammar — Roadmap

Sequenced so the "type agentgrammar → magic" demo exists as early as possible, because it is both
the product and the marketing asset.

## Phase 0 — Foundation (Week 1) · no backend

**Goal:** repo becomes registry-shaped; taxonomy + schema locked.

- [ ] Lock taxonomy (`design/code/media` + launch categories) — `02-CONTENT-MODEL.md`.
- [ ] Finalize `manifest.json` schema.
- [ ] Restructure repo → `catalog/<domain>/<category>/<skill>/{manifest.json,SKILL.md}`.
- [ ] Migrate existing 5 frameworks → `catalog/code/review/*`.
- [ ] Write a `render` script: canonical `SKILL.md` → Claude/Cursor/Codex payloads (kills current
      hand-maintained duplication).
- [ ] Keep `install.sh` working as a fallback path.
- [ ] Reserve npm name, domain, X handle, GitHub org.

**Exit:** one command builds per-IDE payloads from `catalog/`; 5 seed skills migrated.

## Phase 1 — MVP: the live demo (Weeks 2–4) · P0

**Goal:** agent installs skills on demand via MCP in all three IDEs.

- [ ] Registry API (read-only): `/v1/domains`, `/v1/skills`, `/v1/skills/{id}`, `/payload`.
- [ ] Publish script: `catalog/` → Postgres + object storage.
- [ ] agentgrammar MCP server (TS, `npx agentgrammar`): `browse_domains`, `search_skills`,
      `get_skill`, `install_skill`, `list_installed`.
- [ ] Per-IDE detection + install to correct locations; conflict prompts; hash verify.
- [ ] Verify end-to-end in Claude Code, Cursor, Codex.
- [ ] Curate catalog to ~25 skills across all three domains.
- [ ] Record the hero demo video.

**Exit / launch-ready:** From a clean project, paste snippet → "use agentgrammar to <task>" →
skill installs and works. Soft-launch to X followers.

## Phase 2 — Catalog site + funnel (Weeks 5–7) · P1

**Goal:** public discovery + growth loop.

- [ ] Next.js catalog: home (demo), browse, skill detail, docs, changelog.
- [ ] Per-skill SEO pages; three-IDE install snippets everywhere.
- [ ] Submission form (Google Form/Tally) on `/submit` + README.
- [ ] PostHog analytics on the browse → install funnel.
- [ ] Public launch: Show HN + Product Hunt + Reddit.

**Exit:** developer discovers via search, installs in < 2 min, community can submit skills.

## Phase 3 — Depth (Weeks 8–12) · P2

**Goal:** plugins + retention.

- [ ] Plugins (not just skills): manifest + `install_plugin` + sandbox thinking.
- [ ] Accounts (Supabase/Clerk) — optional login for saved skills/sync.
- [ ] Ratings/usage signals feeding search ranking.
- [ ] Versioning UX: pin/update installed skills.
- [ ] Expand catalog to 75+ skills; "skill of the week" content engine.

**Exit:** repeat usage; plugins live; catalog broad and ranked.

## Phase 4 — Monetize (when user base warrants) · P3

**Goal:** turn on revenue without breaking free-first.

- [ ] Pro tier: premium/curated packs behind entitlements (`price_tier` already in schema).
- [ ] Billing (Stripe) + entitlement checks in API/MCP.
- [ ] Later: publisher accounts + marketplace revenue share + payouts.
- [ ] Keep a strong permanent free tier — it stays the growth engine.

**Trigger:** hit the Phase 2 success metrics (thousands of WAU) before adding any paywall.

## Critical path / dependencies

```
taxonomy+schema → render script → registry API → MCP server → DEMO → site → community → plugins → paid
       (P0)            (P0)           (P1)          (P1)       (P1)    (P2)     (P2)       (P3)   (P4)
```

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| MCP behaves differently across 3 IDEs | Build IDE-detection + payload rendering early; test all 3 in Phase 1 |
| npm name taken | Reserve in Phase 0 before any announcement |
| Curation doesn't scale | Form is a gate, not a firehose; revisit ingestion in Phase 4 |
| Demo underwhelms | Treat the hero video as a P0 deliverable, not an afterthought |
| Free forever with no revenue | Entitlement hooks in schema now; flip on Pro only after WAU proven |

## Immediate next actions (this week)

1. Approve taxonomy + manifest schema.
2. Restructure repo into `catalog/` and migrate the 5 frameworks.
3. Write the `render` script.
4. Reserve npm/domain/handles.
5. Post Day 1 tease on X and start the build log.
