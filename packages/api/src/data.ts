// Loads the bundled catalog snapshot (packages/api/data/) once at cold start.
// The snapshot is produced by scripts/sync-api-data.mjs which runs before start/deploy.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));
// src/ -> package root -> data/. Works both from src (tsx) and dist builds one level deeper.
const CANDIDATES = [
  join(HERE, "..", "data"),
  join(HERE, "..", "..", "data"),
];
export const DATA_DIR =
  CANDIDATES.find((p) => existsSync(join(p, "registry", "catalog.json"))) ?? CANDIDATES[0];

export interface Payloads {
  [ide: string]: string[];
}

export interface Skill {
  id: string;
  name: string;
  summary: string;
  domain: string;
  category: string;
  tags: string[];
  ide_targets: string[];
  price_tier: string;
  version: string;
  publisher: string;
  prevents?: string;
  requires: string[];
  hash: string;
  payloads: Payloads;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  skill_ids: string[];
}

export interface Domain {
  slug: string;
  name: string;
  description: string;
  icon?: string;
  categories: Category[];
}

export interface Catalog {
  version: string;
  generated_from: string;
  domains: Domain[];
  skills: Skill[];
}

function loadCatalog(): Catalog {
  const raw = readFileSync(join(DATA_DIR, "registry", "catalog.json"), "utf8");
  return JSON.parse(raw) as Catalog;
}

export const catalog: Catalog = loadCatalog();
export const skillsById = new Map(catalog.skills.map((s) => [s.id, s]));

export const AGENTGRAMMAR_VERSION =
  process.env.AGENTGRAMMAR_VERSION ?? catalog.version ?? "0.0.0";

export function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

// Read one payload file's contents from the snapshot. Path is relative to the IDE
// payload root as stored in catalog.json (e.g. "claude-code/.claude/skills/clear/SKILL.md").
export function readPayloadFile(relPath: string): string {
  return readFileSync(join(DATA_DIR, relPath), "utf8");
}
