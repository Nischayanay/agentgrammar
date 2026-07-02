#!/usr/bin/env node
// Build the catalog and snapshot dist/ into packages/api/data/ so the API can serve it
// with no dependency on the repo layout at runtime (bundle-friendly for Vercel).
//
// Usage: node scripts/sync-api-data.mjs

import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const API_DATA = join(ROOT, "packages", "api", "data");

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

console.log(`agentgrammar: synced API data -> packages/api/data/`);
