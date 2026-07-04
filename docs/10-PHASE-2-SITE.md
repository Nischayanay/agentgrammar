# agentgrammar — Phase 2: the catalog site

Status: **built** (2026-07-03). Lives in `packages/web`. Next.js (App Router) + Tailwind,
deployed on Vercel as a separate project from the API. It is a pure consumer of the
registry API and never touches a database.

## What shipped

The missing public discovery + growth layer from `07-ROADMAP.md` Phase 2:

- **Landing** (`/`) — hero with the "type agentgrammar → skill installs" demo (static CSS
  mock of the IDE composer chip), `npx agentgrammar` snippet with copy button, a
  curation/trust strip, domain grid, featured skills, and a "how it works" section.
- **Browse** (`/skills`) — client-side search + domain/IDE filters over the catalog.
- **Skill detail** (`/skills/[id]`) — SSG per-skill SEO pages: rendered SKILL.md preview,
  per-IDE install snippets (MCP / Claude Code / Cursor / Codex), metadata, related skills,
  `SoftwareApplication` JSON-LD.
- **Domains** (`/domains`) and **Submit** (`/submit`, framed on the curation bar).
- `sitemap.xml` + `robots.txt` for the organic-discovery funnel.

## Data flow

```
catalog/  --render.mjs-->  dist/  --sync-api-data-->  packages/api/data  -->  registry API
                            |                                                      |
                            |  build-time import (source of truth for the deploy)  |  ISR overlay
                            +---------------------> packages/web <-----------------+
```

**Local-first, API-as-overlay.** The site and the catalog ship from the same commit, so
the in-repo `dist/registry/catalog.json` is the source of truth for a given deploy. The
live API (which lags until redeployed) is an *additive* freshness overlay via ISR: it can
surface skills the snapshot doesn't have yet, but never removes skills that shipped in the
build. This is why a newly authored skill (e.g. `interface-design`) renders immediately,
before the API is redeployed. See `src/lib/api.ts` (`getSkills` union, `getDomains`
max-count guard) and `src/lib/weights.ts` (`localPreview`).

> Build order: `dist/` must exist before `next build` (the app imports it). Run
> `node scripts/sync-api-data.mjs` (or `npm run build` at repo root) first. On Vercel,
> add a prebuild step or commit the snapshot — `dist/` is git-ignored by default.

## The three market-driven product decisions (baked in)

Research across X / Reddit / the 2026 skills-marketplace landscape surfaced that the space
is now crowded (claudemarketplaces.com, skillkit.sh, agentskills.io, microsoft/skills) and
competes mostly on catalog *size* — while a widely-cited audit found prompt injection in
36% of open skills. That reframed our differentiation:

1. **Curated / security-verified positioning.** A `✓ Verified` badge on every skill; the
   trust strip leads with "curated, not scraped." This is the wedge scraped catalogs can't
   copy, and it's on-brand with the SCOPE/TRUST/GUARD origin.
2. **Flagship design skill (`interface-design`, `INTERFACE`).** Fills the previously-empty
   `design/ui-ux` domain and powers the hero demo ("use agentgrammar to design this page").
   Product asset and marketing asset in one.
3. **Context-weight surfacing.** Each skill shows a Light/Medium/Heavy chip + token
   estimate (computed at build time from the rendered SKILL.md body), addressing the
   repeated "too many skills eat the context window" complaint. Nobody else surfaces this.

## Deploy checklist (Vercel)

- New Vercel project, **Root Directory = `packages/web`**, "Include files outside root" ON
  (imports `../../dist/**`).
- Ensure `dist/` exists at build (prebuild `node scripts/render.mjs` or commit the snapshot).
- Env: `NEXT_PUBLIC_REGISTRY_URL` = production API URL (set to `api.agentgrammar.dev` once live).
- Point `agentgrammar.dev` at this project; keep the API on its own subdomain.

## Known follow-ups

- **Next.js version:** pinned to `14.2.33` (latest patched 14.x). Remaining npm-audit
  "high" items are DoS advisories fixed only in Next 15/16, which is a breaking change
  (async `params`). Low risk for a static SSG catalog with no image remotePatterns / rewrites;
  revisit when doing the 15/16 upgrade.
- Wire real submission form URL in `src/app/submit/page.tsx` (`FORM_URL`).
- Add PostHog on the browse → install funnel (roadmap Phase 2 item).
- OG images per skill (currently text metadata only).
- Record the hero demo video to replace/augment the CSS mock.
