// Typed client for the agentgrammar registry API.
// Shapes mirror packages/api/src/app.ts exactly. All reads are build-time (SSG/ISR);
// if the API is briefly unreachable during a build, we fall back to the local
// dist/registry/catalog.json snapshot so a deploy never fails on a cold API.

import localCatalog from "../../../../dist/registry/catalog.json";

export const REGISTRY_URL =
  process.env.NEXT_PUBLIC_REGISTRY_URL?.replace(/\/$/, "") ??
  "https://agentgrammar.vercel.app";

export const IDE_LABELS: Record<string, string> = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  codex: "Codex",
};

export type SkillMeta = {
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
  requires?: string[];
  hash: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  skill_ids: string[];
};

export type Domain = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  categories: Category[];
};

export type SkillDetail = {
  skill: SkillMeta;
  preview: string;
};

type Catalog = {
  version: string;
  domains: Domain[];
  skills: (SkillMeta & { payloads?: Record<string, string[]> })[];
};

const CATALOG = localCatalog as unknown as Catalog;

// Revalidate hourly — new skills appear without a redeploy, matching the API's own cache.
const REVALIDATE = 3600;

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${REGISTRY_URL}${path}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// The in-repo catalog snapshot is the source of truth for THIS deploy: the site and
// catalog ship from the same commit, so the local snapshot is always >= the deployed
// API (which lags until it is redeployed). We therefore drive SSG from local, and use
// the API only as an additive freshness overlay (via ISR) — it may add skills the local
// snapshot doesn't have yet, but it must never remove ones that shipped in this build.

export async function getDomains(): Promise<Domain[]> {
  const data = await apiGet<{ domains: Domain[] }>("/v1/domains");
  if (!data?.domains) return CATALOG.domains;
  // Prefer whichever source knows about more skills (guards against a lagging API).
  const localCount = countSkills(CATALOG.domains);
  const apiCount = countSkills(data.domains);
  return apiCount >= localCount ? data.domains : CATALOG.domains;
}

function countSkills(domains: Domain[]): number {
  return domains.reduce(
    (n, d) => n + d.categories.reduce((m, c) => m + c.skill_ids.length, 0),
    0
  );
}

export async function getSkills(): Promise<SkillMeta[]> {
  const data = await apiGet<{ skills: SkillMeta[] }>("/v1/skills?limit=500");
  const api = data?.skills ?? [];
  // Union by id, local first so a not-yet-deployed skill still appears; API entries
  // only add ids the local snapshot is missing.
  const byId = new Map<string, SkillMeta>();
  for (const s of CATALOG.skills) byId.set(s.id, s);
  for (const s of api) if (!byId.has(s.id)) byId.set(s.id, s);
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

// Fetch skill metadata + API preview. `localPreview` (read server-side from dist/) is
// used only when the API has no preview yet — keeps this module client-bundle safe.
export async function getSkill(
  id: string,
  localPreview?: string
): Promise<SkillDetail | null> {
  const data = await apiGet<SkillDetail>(`/v1/skills/${id}`);
  const skill = CATALOG.skills.find((s) => s.id === id) ?? data?.skill;
  if (!skill) return null;
  const preview = data?.preview || localPreview || "";
  return { skill, preview };
}

export async function getSkillIds(): Promise<string[]> {
  const skills = await getSkills();
  return skills.map((s) => s.id);
}

// Curation is human + rendered from a single source; every catalog skill is verified.
export function isVerified(_s: SkillMeta): boolean {
  return true;
}

// Context weight: an honest, ownable signal. We approximate a skill's context cost
// from the length of its canonical body, bucketed so it reads at a glance. This
// addresses the repeated "too many skills eat the context window" complaint.
export type ContextWeight = { label: "Light" | "Medium" | "Heavy"; tokens: number };

export function contextWeight(preview: string): ContextWeight {
  // ~4 chars/token is the standard rough estimate.
  const tokens = Math.max(1, Math.round(preview.length / 4));
  const rounded = tokens >= 1000 ? Math.round(tokens / 100) * 100 : Math.round(tokens / 50) * 50;
  const label = tokens < 500 ? "Light" : tokens < 1200 ? "Medium" : "Heavy";
  return { label, tokens: rounded };
}

export function domainAccent(domain: string): string {
  return domain === "design" ? "text-design" : domain === "media" ? "text-media" : "text-code";
}
