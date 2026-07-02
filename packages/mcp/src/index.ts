#!/usr/bin/env node
// agentgrammar MCP server. Exposes browse/search/get/install/list tools over stdio.
// Talks to the registry API over HTTPS; writes skill payloads into the local IDE config.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getDomains, searchSkills, getSkill, registryUrl } from "./registry.js";
import { detectIde, SUPPORTED_IDES, type Ide, type Scope } from "./ide.js";
import { installSkill } from "./install.js";
import { listInstalled } from "./installed.js";

const VERSION = "1.0.0";

const server = new McpServer({
  name: "agentgrammar",
  version: VERSION,
});

// Return a text-content tool result.
function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}
function json(obj: unknown) {
  return text(JSON.stringify(obj, null, 2));
}
function errorText(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  return { content: [{ type: "text" as const, text: `Error: ${msg}` }], isError: true };
}

// ---- browse_domains ----
server.registerTool(
  "browse_domains",
  {
    title: "Browse agentgrammar domains",
    description:
      "List the agentgrammar taxonomy (domains → categories → skill ids) for discovery. Call this first when the user asks what skills exist.",
    inputSchema: {},
  },
  async () => {
    try {
      const { domains } = await getDomains();
      const tree = domains.map((d) => ({
        domain: d.slug,
        name: d.name,
        categories: d.categories.map((c) => ({
          category: c.slug,
          name: c.name,
          skills: c.skill_ids,
        })),
      }));
      return json({ registry: registryUrl(), domains: tree });
    } catch (e) {
      return errorText(e);
    }
  }
);

// ---- search_skills ----
server.registerTool(
  "search_skills",
  {
    title: "Search agentgrammar skills",
    description:
      "Search the catalog by free-text query and/or domain/category filters. Returns ranked skill metadata. Use to find the skill that matches a task before installing.",
    inputSchema: {
      query: z.string().optional().describe("Free-text query over name, tags, and summary."),
      domain: z.string().optional().describe("Filter by domain slug (e.g. code, design, media)."),
      category: z.string().optional().describe("Filter by category slug (e.g. review, branding)."),
      limit: z.number().int().positive().max(50).optional().describe("Max results (default 20)."),
    },
  },
  async ({ query, domain, category, limit }) => {
    try {
      const ide = detectIde();
      const res = await searchSkills({ q: query, domain, category, ide, limit: limit ?? 20 });
      return json({
        detected_ide: ide,
        total: res.total,
        skills: res.skills.map((s) => ({
          id: s.id,
          name: s.name,
          summary: s.summary,
          domain: s.domain,
          category: s.category,
          tags: s.tags,
          version: s.version,
          price_tier: s.price_tier,
        })),
      });
    } catch (e) {
      return errorText(e);
    }
  }
);

// ---- get_skill ----
server.registerTool(
  "get_skill",
  {
    title: "Get an agentgrammar skill",
    description: "Fetch full metadata plus a preview of a skill's body by id.",
    inputSchema: {
      id: z.string().describe("Skill id, e.g. 'logic' or 'clear'."),
    },
  },
  async ({ id }) => {
    try {
      const { skill, preview } = await getSkill(id);
      return json({ skill, preview });
    } catch (e) {
      return errorText(e);
    }
  }
);

// ---- install_skill ----
server.registerTool(
  "install_skill",
  {
    title: "Install an agentgrammar skill",
    description:
      "Install a skill into the current IDE. Detects the IDE, fetches the payload, verifies hashes, and writes files. Never overwrites conflicting files unless force is set. For Codex it merges an idempotent block into AGENTS.md.",
    inputSchema: {
      id: z.string().describe("Skill id to install."),
      scope: z
        .enum(["project", "global"])
        .optional()
        .describe("project (default) writes to the current project; global writes to the home config (Claude Code)."),
      ide: z
        .enum(SUPPORTED_IDES as [Ide, ...Ide[]])
        .optional()
        .describe("Override IDE detection."),
      force: z.boolean().optional().describe("Overwrite files that exist with different contents."),
    },
  },
  async ({ id, scope, ide, force }) => {
    try {
      const targetIde = ide ?? detectIde();
      const result = await installSkill({
        id,
        ide: targetIde,
        scope: (scope ?? "project") as Scope,
        force: force ?? false,
      });
      const conflicts = result.files.filter((f) => f.status === "skipped-conflict");
      const summary = conflicts.length
        ? `Installed with ${conflicts.length} conflict(s) skipped. Re-run with force:true to overwrite.`
        : `Installed ${id} for ${targetIde}.`;
      return json({ summary, ...result });
    } catch (e) {
      return errorText(e);
    }
  }
);

// ---- list_installed ----
server.registerTool(
  "list_installed",
  {
    title: "List installed agentgrammar skills",
    description: "Scan the local project (and Claude Code home) for installed agentgrammar skills and their versions.",
    inputSchema: {},
  },
  async () => {
    try {
      const installed = listInstalled();
      return json({ count: installed.length, installed });
    } catch (e) {
      return errorText(e);
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Telemetry is off by default; this server sends none regardless.
  console.error(`agentgrammar MCP server v${VERSION} ready (registry: ${registryUrl()})`);
}

main().catch((e) => {
  console.error("agentgrammar: fatal", e);
  process.exit(1);
});
