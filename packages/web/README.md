# @agentgrammar/web

The public catalog site — Phase 2. Next.js (App Router) + Tailwind, deployed on Vercel.
It is a **pure consumer of the registry API**; it never talks to a database.

## Data flow

```
catalog/  --render-->  dist/registry/catalog.json  -->  registry API (packages/api)
                                   |                              |
                                   |  (build-time fallback)       |  (SSG/ISR fetch)
                                   +------------> packages/web <---+
```

- Pages are statically generated and revalidated hourly (ISR), so new skills appear
  without a redeploy.
- `src/lib/api.ts` fetches the live API (`NEXT_PUBLIC_REGISTRY_URL`, default
  `https://agentgrammar.vercel.app`). If the API is unreachable at build time it falls
  back to the local `dist/registry/catalog.json` snapshot, so a deploy never fails cold.
- `src/lib/weights.ts` reads the rendered `dist/claude-code/**/SKILL.md` bodies to compute
  each skill's **context weight** at build time.

> Because the site imports `dist/registry/catalog.json`, run `npm run build` (repo root)
> or `node scripts/sync-api-data.mjs` **before** building the site, so `dist/` exists.

## Develop

```bash
cd packages/web
npm install
npm run dev        # http://localhost:3000, fetches the live API
```

Point at a local API instead:

```bash
NEXT_PUBLIC_REGISTRY_URL=http://localhost:8787 npm run dev
```

## Deploy (Vercel)

Separate Vercel project from the API. Settings:

- **Root Directory:** `packages/web`, with **Include files outside root** ON
  (the app imports `../../dist/registry/catalog.json` and reads `../../dist/**` for weights).
- Framework preset: **Next.js** (auto-detected).
- Env var: `NEXT_PUBLIC_REGISTRY_URL` = the production API URL (once
  `api.agentgrammar.dev` is live, set it here).
- Ensure `dist/` is present at build. If the repo's `dist/` is git-ignored, add a root
  `vercel-build`/`prebuild` that runs `node scripts/render.mjs` before `next build`, or
  commit the snapshot. (See `docs/10-PHASE-2-SITE.md`.)

## Routes

| Route | What |
| --- | --- |
| `/` | Landing: hero demo, npx snippet, trust strip, domains, featured skills |
| `/skills` | Browse: client search + domain/IDE filters |
| `/skills/[id]` | SSG skill detail: preview, per-IDE install, related, JSON-LD |
| `/domains` | Taxonomy overview |
| `/submit` | Submission funnel framed on the curation bar |
| `/sitemap.xml`, `/robots.txt` | SEO |
