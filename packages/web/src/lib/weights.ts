// Server-only: compute real context weight per skill from the rendered Claude Code
// SKILL.md bodies in dist/. Runs at build time (SSG), so no runtime fs cost.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { contextWeight, type ContextWeight } from "./api";
import localCatalog from "../../../../dist/registry/catalog.json";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, "..", "..", "..", "..", "dist");

type CatalogSkill = { id: string; payloads?: Record<string, string[]> };

// Read the rendered Claude Code SKILL.md body for a skill from dist/ (server-only).
// Lets detail pages render a full preview even before the API is redeployed.
export function localPreview(id: string): string {
  const skills = (localCatalog as unknown as { skills: CatalogSkill[] }).skills;
  const claude = skills.find((s) => s.id === id)?.payloads?.["claude-code"]?.[0];
  if (!claude) return "";
  try {
    return readFileSync(join(DIST, claude), "utf8");
  } catch {
    return "";
  }
}

export function weightsById(): Record<string, ContextWeight> {
  const skills = (localCatalog as unknown as { skills: CatalogSkill[] }).skills;
  const out: Record<string, ContextWeight> = {};
  for (const s of skills) {
    const claude = s.payloads?.["claude-code"]?.[0];
    let body = "";
    if (claude) {
      try {
        body = readFileSync(join(DIST, claude), "utf8");
      } catch {
        body = "";
      }
    }
    out[s.id] = contextWeight(body);
  }
  return out;
}
