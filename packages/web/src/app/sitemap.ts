import type { MetadataRoute } from "next";
import { getSkillIds } from "@/lib/api";

const BASE = "https://agentgrammar.dev";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ids = await getSkillIds();
  const staticRoutes = ["", "/skills", "/domains", "/submit"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const skillRoutes = ids.map((id) => ({
    url: `${BASE}/skills/${id}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...skillRoutes];
}
