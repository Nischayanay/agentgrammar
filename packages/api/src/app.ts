// agentgrammar registry API — Hono, serverless, read-only, no DB.
// Serves the bundled catalog snapshot (packages/api/data/) to the MCP server and web catalog.

import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  catalog,
  skillsById,
  AGENTGRAMMAR_VERSION,
  readPayloadFile,
  sha256,
  type Skill,
} from "./data.js";

const app = new Hono();

// Open CORS for GET — the catalog is public and read-only.
app.use("/v1/*", cors({ origin: "*", allowMethods: ["GET", "OPTIONS"] }));

// Long, immutable-ish caching. Content is versioned; bust by version bump/redeploy.
const CACHE = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

// Attach an ETag + Cache-Control to a JSON body and short-circuit on If-None-Match.
function json(c: any, body: unknown) {
  const text = JSON.stringify(body);
  const etag = `"${sha256(text).slice(0, 32)}"`;
  c.header("Cache-Control", CACHE);
  c.header("ETag", etag);
  if (c.req.header("if-none-match") === etag) {
    return c.body(null, 304);
  }
  return c.body(text, 200, { "Content-Type": "application/json; charset=utf-8" });
}

// Metadata-only view of a skill (drops nothing sensitive; just excludes nothing here,
// payloads map is small and useful to clients deciding what to install).
function skillMeta(s: Skill) {
  return {
    id: s.id,
    name: s.name,
    summary: s.summary,
    domain: s.domain,
    category: s.category,
    tags: s.tags,
    ide_targets: s.ide_targets,
    price_tier: s.price_tier,
    version: s.version,
    publisher: s.publisher,
    prevents: s.prevents,
    requires: s.requires,
    hash: s.hash,
  };
}

app.get("/v1/health", (c) =>
  json(c, { ok: true, version: AGENTGRAMMAR_VERSION, skills: catalog.skills.length })
);

// Taxonomy tree with skill_ids per category.
app.get("/v1/domains", (c) =>
  json(c, { version: catalog.version, domains: catalog.domains })
);

// Filtered skill list (metadata only). Substring/tag match — no search engine yet.
app.get("/v1/skills", (c) => {
  const q = (c.req.query("q") ?? "").trim().toLowerCase();
  const domain = c.req.query("domain");
  const category = c.req.query("category");
  const ide = c.req.query("ide");
  const limitRaw = parseInt(c.req.query("limit") ?? "", 10);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 100;

  let results = catalog.skills.filter((s) => {
    if (domain && s.domain !== domain) return false;
    if (category && s.category !== category) return false;
    if (ide && !s.ide_targets.includes(ide)) return false;
    return true;
  });

  if (q) {
    const scored = results
      .map((s) => ({ s, score: score(s, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
    results = scored.map((r) => r.s);
  }

  return json(c, {
    query: { q: q || undefined, domain, category, ide, limit },
    count: Math.min(results.length, limit),
    total: results.length,
    skills: results.slice(0, limit).map(skillMeta),
  });
});

// Simple relevance score over name/summary/tags/id. Higher = better.
function score(s: Skill, q: string): number {
  const name = s.name.toLowerCase();
  const id = s.id.toLowerCase();
  const summary = s.summary.toLowerCase();
  const tags = s.tags.map((t) => t.toLowerCase());
  let sc = 0;
  if (id === q || name === q) sc += 100;
  if (id.includes(q) || name.includes(q)) sc += 40;
  if (tags.some((t) => t === q)) sc += 30;
  if (tags.some((t) => t.includes(q))) sc += 15;
  if (summary.includes(q)) sc += 10;
  if ((s.prevents ?? "").toLowerCase().includes(q)) sc += 5;
  return sc;
}

// One skill + a preview of its canonical body (Claude Code SKILL.md, trimmed).
app.get("/v1/skills/:id", (c) => {
  const s = skillsById.get(c.req.param("id"));
  if (!s) return c.json({ error: "not_found", id: c.req.param("id") }, 404);

  let preview = "";
  const claudeFiles = s.payloads["claude-code"];
  if (claudeFiles?.length) {
    try {
      const body = readPayloadFile(claudeFiles[0]);
      preview = body.length > 4000 ? body.slice(0, 4000) + "\n…(truncated)" : body;
    } catch {
      preview = "";
    }
  }

  return json(c, { skill: skillMeta(s), preview });
});

// The install payload: every file to write for a given IDE, with target path + contents + hash.
app.get("/v1/skills/:id/payload", (c) => {
  const s = skillsById.get(c.req.param("id"));
  if (!s) return c.json({ error: "not_found", id: c.req.param("id") }, 404);

  const ide = c.req.query("ide") ?? "claude-code";
  const files = s.payloads[ide];
  if (!files || files.length === 0) {
    return c.json(
      { error: "unsupported_ide", id: s.id, ide, supported: Object.keys(s.payloads) },
      400
    );
  }

  const out = [];
  for (const rel of files) {
    const contents = readPayloadFile(rel);
    // Strip the leading IDE segment so `path` is where the client writes, relative to the
    // install scope root (project cwd or home): "claude-code/.claude/..." -> ".claude/...".
    const targetPath = rel.slice(rel.indexOf("/") + 1);
    out.push({ path: targetPath, contents, sha256: sha256(contents) });
  }

  return json(c, { id: s.id, ide, version: s.version, files: out });
});

app.get("/", (c) =>
  c.json({
    name: "agentgrammar registry API",
    version: AGENTGRAMMAR_VERSION,
    endpoints: [
      "/v1/health",
      "/v1/domains",
      "/v1/skills?q=&domain=&category=&ide=&limit=",
      "/v1/skills/:id",
      "/v1/skills/:id/payload?ide=claude-code|cursor|codex",
    ],
  })
);

export default app;
