---
name: vercel-deploy
description: Use when deploying to Vercel, optimising a live Vercel project, or investigating slow/expensive routes. Metrics-first — collect Vercel data before touching code.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# VERCEL DEPLOY framework

Apply VERCEL DEPLOY before deploying, and when a deployed project has cost, performance, or reliability problems. If `$ARGUMENTS` is present, treat it as the project, route, or problem to address: `$ARGUMENTS`.

Vercel costs and slow routes are almost always discoverable from metrics before you open a single file. Work metrics-first — every investigation starts with data, not assumptions.

---

## V - Validate the project is deploy-ready

Before running any deploy command, confirm:

```text
[ ] vercel.json is valid (run: npx vercel inspect or vercel build --dry-run locally)
[ ] Environment variables in Vercel dashboard match .env.example keys
[ ] Build succeeds locally: npm run build (or the project's build command)
[ ] No secrets committed — confirm .gitignore covers .env* files
[ ] Framework is detected correctly (check vercel.json "framework" or auto-detection)
[ ] Static assets are in /public, not imported directly into bundles
```

For Next.js projects, additionally:
```text
[ ] next.config.js has no deprecated options for the installed Next.js version
[ ] Image domains / remotePatterns configured for all external image sources
[ ] Middleware matchers are as narrow as possible — broad matchers add latency to every request
```

---

## E - Extract live metrics before investigating code

Never start a performance or cost investigation without Vercel metrics. The metrics tell you which routes to look at — looking at every file wastes time.

Collect from Vercel dashboard or CLI:

| Metric | Where to find | What high means |
| --- | --- | --- |
| Function invocations | Analytics → Functions | High volume or unexpected routes firing |
| Function duration (p95) | Analytics → Functions | Slow routes — investigate DB / external calls |
| Function errors | Analytics → Functions | Broken routes in production |
| Edge requests | Analytics → Edge | Middleware overhead |
| Bandwidth | Usage → Bandwidth | Large responses or missing caching |
| Build minutes | Usage → Build | Slow builds — cache or monorepo scope issues |
| Cache hit rate | Analytics → Caching | Low hit rate = cache misconfiguration |

```bash
# CLI equivalents
vercel logs --since 1h         # recent function logs
vercel inspect <deployment>    # deployment metadata and routes
```

Only investigate code for the routes the metrics flagged.

---

## R - Reduce function invocations with caching

The cheapest function call is the one that never happens. Work caching in this priority order:

**1. Static generation (ISR) — highest leverage**
```ts
// Pages Router
export const revalidate = 3600; // Next.js App Router

// Or getStaticProps with revalidate
export async function getStaticProps() {
  return { props: { ... }, revalidate: 3600 };
}
```
Use for: content pages, product listings, blog posts, any data that doesn't change per-user.

**2. CDN caching via Cache-Control**
```ts
// API routes / Route Handlers
response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
```
Use for: public API responses, shared data, aggregation endpoints.

**3. On-demand revalidation**
```ts
// Revalidate specific paths on content change — avoids full redeploy
import { revalidatePath } from 'next/cache';
revalidatePath('/products/[slug]');
```

**4. Route caching with `unstable_cache` / `React.cache`**
Deduplicate expensive DB calls within a single render pass.

---

## C - Cut function duration at the source

For routes with high p95 duration, investigate in this order:

1. **Database queries** — check for N+1 patterns (one query per list item). Use `EXPLAIN ANALYZE` or ORM query logging to confirm.
2. **External API calls** — are they necessary on every request? Can they be cached or pre-fetched?
3. **Cold starts** — use `export const runtime = 'edge'` for ultra-low latency stateless functions; use standard Node runtime for functions with Node-specific dependencies.
4. **Middleware** — every request through a broad middleware matcher pays the middleware overhead. Narrow the matcher: `{ source: '/api/:path*' }` instead of matching everything.

```ts
// Narrow middleware matcher — never use '/:path*' unless you need to
export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
```

---

## E - Eliminate bandwidth waste

High bandwidth cost is almost always one of three things:

- **Unoptimised images** — use `next/image` for all images; set `sizes` prop correctly so the browser requests the right size.
- **Large API responses** — audit the shape of JSON responses; return only fields the client uses.
- **Missing compression** — Vercel compresses by default, but confirm no middleware is stripping `Accept-Encoding` headers.

---

## L - Lock the deploy with environment validation

Add startup validation so a misconfigured deploy fails fast at boot rather than at runtime:

```ts
// lib/env.ts — run at module load time
const required = ['DATABASE_URL', 'AUTH_SECRET', 'NEXT_PUBLIC_API_URL'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}
```

---

## Deploy checklist

```text
[ ] Build passes locally
[ ] Env vars confirmed in Vercel dashboard
[ ] Secrets not in git
[ ] Caching strategy set for high-volume routes
[ ] Middleware matcher is narrow
[ ] next/image used for all images with correct sizes prop
[ ] No function p95 > 1000ms without investigation
[ ] No N+1 queries confirmed via query logging
[ ] ISR revalidation period set for static-like content
```

End your vercel-deploy pass with:

```text
Deploy target:
Metrics reviewed: yes/no
Routes flagged:
Caching changes made:
Duration improvements:
Bandwidth changes:
Deploy command run:
```
