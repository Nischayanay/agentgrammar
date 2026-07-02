#!/usr/bin/env node
// agentgrammar render pipeline
// Single source of truth: catalog/<domain>/<category>/<id>/{manifest.json, SKILL.md}
// Generates per-IDE payloads + a machine-readable registry catalog into dist/.
//
// Usage: node scripts/render.mjs
// No dependencies. Node 18+.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = join(ROOT, "catalog");
const DIST = join(ROOT, "dist");

// ---------- tiny helpers ----------
const read = (p) => readFileSync(p, "utf8");
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };
const sha256 = (s) => createHash("sha256").update(s).digest("hex");

function walkManifests(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkManifests(full));
    else if (entry === "manifest.json") out.push(full);
  }
  return out;
}

// Parse leading YAML-ish frontmatter delimited by --- ... ---
function parseFrontmatter(md) {
  if (!md.startsWith("---")) return { fm: {}, body: md };
  const end = md.indexOf("\n---", 3);
  if (end === -1) return { fm: {}, body: md };
  const raw = md.slice(3, end).trim();
  const body = md.slice(end + 4).replace(/^\n+/, "");
  const fm = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return { fm, body };
}

function frontmatterBlock(obj) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) lines.push(`${k}: [${v.map((x) => JSON.stringify(x)).join(", ")}]`);
    else if (typeof v === "boolean") lines.push(`${k}: ${v}`);
    else lines.push(`${k}: ${v}`);
  }
  lines.push("---");
  return lines.join("\n");
}

// Extract "## X - Title" headers + their first bullet for condensed (Codex/universal) forms
function condensedBullets(body) {
  const lines = body.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^##\s+(.+?)\s*$/);
    if (!h) continue;
    // find first bullet under this header
    let detail = "";
    for (let j = i + 1; j < lines.length; j++) {
      if (/^##\s/.test(lines[j])) break;
      const b = lines[j].match(/^[-*]\s+(.+)$/);
      if (b) { detail = b[1].replace(/\.$/, ""); break; }
    }
    out.push(detail ? `- ${h[1]}: ${detail}.` : `- ${h[1]}.`);
  }
  return out;
}

// ---------- load catalog ----------
const taxonomy = JSON.parse(read(join(CATALOG, "taxonomy.json")));
const skills = [];

for (const manifestPath of walkManifests(CATALOG)) {
  const dir = dirname(manifestPath);
  const manifest = JSON.parse(read(manifestPath));
  const skillMd = read(join(dir, "SKILL.md"));
  const { fm, body } = parseFrontmatter(skillMd);
  skills.push({ manifest, fm, body, canonical: skillMd, dir });
}
skills.sort((a, b) => a.manifest.id.localeCompare(b.manifest.id));

// ---------- clean dist ----------
if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });

// ---------- per-skill renderers ----------
function renderClaude(s) {
  // Canonical body IS the Claude Code format. Emit verbatim.
  return s.canonical.endsWith("\n") ? s.canonical : s.canonical + "\n";
}

function renderCursorRule(s) {
  const c = s.manifest.render?.cursor ?? {};
  const fm = frontmatterBlock({
    description: c.rule_description ?? s.manifest.summary,
    globs: c.rule_globs ?? [],
    alwaysApply: c.rule_always_apply ?? false,
  });
  return `${fm}\n${s.body}`.replace(/\n*$/, "\n");
}

function renderCursorSkill(s) {
  const c = s.manifest.render?.cursor ?? {};
  const fm = frontmatterBlock({
    name: `agentgrammar-${s.manifest.id}`,
    description: c.skill_description ?? s.manifest.summary,
    "disable-model-invocation": true,
  });
  return `${fm}\n${s.body}`.replace(/\n*$/, "\n");
}

function renderCodexBlock(s) {
  const bullets = condensedBullets(s.body).join("\n");
  return `### ${s.manifest.name}\n\n${s.manifest.summary}\n\n${bullets}\n`;
}

// ---------- write per-IDE payloads ----------
const registrySkills = [];

for (const s of skills) {
  const id = s.manifest.id;
  const payloads = {};

  if (s.manifest.ide_targets.includes("claude-code")) {
    const out = renderClaude(s);
    const rel = `claude-code/.claude/skills/${id}/SKILL.md`;
    write(join(DIST, rel), out);
    payloads["claude-code"] = [rel];
  }

  if (s.manifest.ide_targets.includes("cursor")) {
    const rule = renderCursorRule(s);
    const skill = renderCursorSkill(s);
    const ruleRel = `cursor/.cursor/rules/${id}.mdc`;
    const skillRel = `cursor/.cursor/skills/agentgrammar-${id}/SKILL.md`;
    write(join(DIST, ruleRel), rule);
    write(join(DIST, skillRel), skill);
    payloads["cursor"] = [ruleRel, skillRel];
  }

  registrySkills.push({
    id,
    name: s.manifest.name,
    summary: s.manifest.summary,
    domain: s.manifest.domain,
    category: s.manifest.category,
    tags: s.manifest.tags ?? [],
    ide_targets: s.manifest.ide_targets,
    price_tier: s.manifest.price_tier ?? "free",
    version: s.manifest.version,
    publisher: s.manifest.publisher ?? "agentgrammar",
    prevents: s.manifest.prevents,
    requires: s.manifest.requires ?? [],
    hash: sha256(s.canonical),
    payloads,
  });
}

// ---------- aggregate Codex AGENTS.md ----------
{
  const codexTargets = skills.filter((s) => s.manifest.ide_targets.includes("codex"));
  const blocks = codexTargets.map(renderCodexBlock).join("\n");
  const triggers = codexTargets
    .map((s) => `| ${s.manifest.name} | ${s.manifest.render?.cursor?.rule_description ?? s.manifest.summary} |`)
    .join("\n");
  const doc = `# agentgrammar

agentgrammar is a curated library of skills for AI coding agents. This file lists the skills
installed in this project as standing context. The agent should apply the matching skill before it
edits code, runs commands, calls APIs, deploys, or continues a long run.

## Skills

${blocks}
## When to apply

| Skill | Trigger condition |
| --- | --- |
${triggers}
`;
  write(join(DIST, "codex/AGENTS.md"), doc);
}

// ---------- aggregate universal ----------
{
  const blocks = skills
    .map((s) => `### ${s.manifest.name}\n\n${condensedBullets(s.body).join("\n")}\n`)
    .join("\n");
  const doc = `# agentgrammar — universal

## What this is

agentgrammar is a curated library of skills for AI coding agents. Paste this file into any system
prompt, project instruction file, CLAUDE.md, .windsurfrules, Cline custom instructions, or similar.
Tell the agent to choose the skill that matches the current task before it edits code, runs commands,
calls APIs, deploys, or continues a long run.

## Skills

${blocks}`;
  write(join(DIST, "universal/agentgrammar.md"), doc);
}

// ---------- machine-readable registry catalog ----------
{
  const catalog = {
    version: taxonomy.version,
    generated_from: "catalog/",
    domains: taxonomy.domains.map((d) => ({
      ...d,
      categories: d.categories.map((c) => ({
        ...c,
        skill_ids: registrySkills
          .filter((s) => s.domain === d.slug && s.category === c.slug)
          .map((s) => s.id),
      })),
    })),
    skills: registrySkills,
  };
  write(join(DIST, "registry/catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
}

// ---------- report ----------
console.log(`agentgrammar: rendered ${skills.length} skill(s)`);
console.log(`  domains:   ${taxonomy.domains.length}`);
console.log(`  targets:   claude-code, cursor, codex, universal`);
console.log(`  output:    dist/`);
console.log(`  registry:  dist/registry/catalog.json`);
