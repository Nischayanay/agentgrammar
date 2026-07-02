// Scan local install locations for agentgrammar skills.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import type { Ide } from "./ide.js";

export interface InstalledSkill {
  id: string;
  ide: Ide;
  scope: "project" | "global";
  version?: string;
  path: string;
}

function versionFromFrontmatter(md: string): string | undefined {
  const m = md.match(/^version:\s*(.+)$/m);
  return m?.[1]?.trim();
}

function scanClaude(root: string, scope: "project" | "global"): InstalledSkill[] {
  const dir = join(root, ".claude", "skills");
  if (!existsSync(dir)) return [];
  const out: InstalledSkill[] = [];
  for (const name of readdirSync(dir)) {
    const skillMd = join(dir, name, "SKILL.md");
    if (!existsSync(skillMd) || !statSync(skillMd).isFile()) continue;
    const md = readFileSync(skillMd, "utf8");
    out.push({ id: name, ide: "claude-code", scope, version: versionFromFrontmatter(md), path: skillMd });
  }
  return out;
}

function scanCursor(root: string, scope: "project" | "global"): InstalledSkill[] {
  const dir = join(root, ".cursor", "skills");
  if (!existsSync(dir)) return [];
  const out: InstalledSkill[] = [];
  for (const name of readdirSync(dir)) {
    if (!name.startsWith("agentgrammar-")) continue;
    const skillMd = join(dir, name, "SKILL.md");
    if (!existsSync(skillMd)) continue;
    const md = readFileSync(skillMd, "utf8");
    out.push({
      id: name.replace(/^agentgrammar-/, ""),
      ide: "cursor",
      scope,
      version: versionFromFrontmatter(md),
      path: skillMd,
    });
  }
  return out;
}

function scanCodex(root: string, scope: "project" | "global"): InstalledSkill[] {
  const agents = join(root, "AGENTS.md");
  if (!existsSync(agents)) return [];
  const doc = readFileSync(agents, "utf8");
  const out: InstalledSkill[] = [];
  const re = /<!--\s*agentgrammar:([a-z0-9-]+)(?:\s+v([^\s>]+))?\s*-->/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(doc))) {
    out.push({ id: m[1], ide: "codex", scope, version: m[2], path: agents });
  }
  return out;
}

export function listInstalled(cwd = process.cwd()): InstalledSkill[] {
  const out: InstalledSkill[] = [];
  // Project scope.
  out.push(...scanClaude(cwd, "project"));
  out.push(...scanCursor(cwd, "project"));
  out.push(...scanCodex(cwd, "project"));
  // Global scope (Claude Code home skills).
  out.push(...scanClaude(homedir(), "global"));
  return out;
}
