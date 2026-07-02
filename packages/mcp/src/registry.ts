// HTTP client for the agentgrammar registry API.

// Live production registry. Swap for a custom domain (e.g. https://api.agentgrammar.dev)
// once it's configured; users can always override with AGENTGRAMMAR_REGISTRY_URL.
const DEFAULT_REGISTRY = "https://agentgrammar.vercel.app";

export function registryUrl(): string {
  return (process.env.AGENTGRAMMAR_REGISTRY_URL ?? DEFAULT_REGISTRY).replace(/\/+$/, "");
}

export interface SkillMeta {
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

export interface PayloadFile {
  path: string;
  contents: string;
  sha256: string;
}

export interface PayloadResponse {
  id: string;
  ide: string;
  version: string;
  files: PayloadFile[];
}

async function get<T>(path: string): Promise<T> {
  const url = `${registryUrl()}${path}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(`registry ${res.status} for ${path}${detail ? `: ${detail}` : ""}`);
  }
  return (await res.json()) as T;
}

export function getDomains(): Promise<{ version: string; domains: Domain[] }> {
  return get("/v1/domains");
}

export function searchSkills(params: {
  q?: string;
  domain?: string;
  category?: string;
  ide?: string;
  limit?: number;
}): Promise<{ count: number; total: number; skills: SkillMeta[] }> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.domain) qs.set("domain", params.domain);
  if (params.category) qs.set("category", params.category);
  if (params.ide) qs.set("ide", params.ide);
  if (params.limit) qs.set("limit", String(params.limit));
  const s = qs.toString();
  return get(`/v1/skills${s ? `?${s}` : ""}`);
}

export function getSkill(id: string): Promise<{ skill: SkillMeta; preview: string }> {
  return get(`/v1/skills/${encodeURIComponent(id)}`);
}

export function getPayload(id: string, ide: string): Promise<PayloadResponse> {
  return get(`/v1/skills/${encodeURIComponent(id)}/payload?ide=${encodeURIComponent(ide)}`);
}
