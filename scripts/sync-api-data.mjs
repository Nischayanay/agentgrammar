#!/usr/bin/env node
// Build the catalog and snapshot dist/ into packages/api/data/ so the API can serve it
// with no dependency on the repo layout at runtime (bundle-friendly for Vercel).
//
// Usage: node scripts/sync-api-data.mjs

import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const API_DATA = join(ROOT, "packages", "api", "data");
const API_PUBLIC = join(ROOT, "packages", "api", "public");

// 1. Build dist/ from catalog/
execFileSync("node", [join(ROOT, "scripts", "render.mjs")], { stdio: "inherit" });

// 2. Snapshot the pieces the API serves: registry catalog + per-IDE payloads
if (existsSync(API_DATA)) rmSync(API_DATA, { recursive: true, force: true });
mkdirSync(API_DATA, { recursive: true });

cpSync(join(DIST, "registry"), join(API_DATA, "registry"), { recursive: true });
for (const ide of ["claude-code", "cursor", "codex", "universal"]) {
  const src = join(DIST, ide);
  if (existsSync(src)) cpSync(src, join(API_DATA, ide), { recursive: true });
}

// 3. Emit a minimal public/ so Vercel's static-output check passes. The API itself is
//    served by the serverless function (api/index.ts); this is just a landing page.
//    Note: rewrites send "/" to the function, so this file is a fallback, not the live root.
if (existsSync(API_PUBLIC)) rmSync(API_PUBLIC, { recursive: true, force: true });
mkdirSync(API_PUBLIC, { recursive: true });
writeFileSync(
  join(API_PUBLIC, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>agentgrammar API</title>
<body style="font-family:system-ui;max-width:40rem;margin:4rem auto;padding:0 1rem">
<h1>agentgrammar registry API</h1>
<p>See <a href="/v1/health">/v1/health</a>, <a href="/v1/domains">/v1/domains</a>,
<a href="/v1/skills">/v1/skills</a>.</p>
</body>`
);

console.log(`agentgrammar: synced API data -> packages/api/data/ (+ public/ landing)`);
