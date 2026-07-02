// Install engine: verify hashes, write payload files, merge Codex blocks into AGENTS.md.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { getPayload, type PayloadFile } from "./registry.js";
import { applyMode, installRoot, type Ide, type Scope } from "./ide.js";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export interface FileResult {
  path: string;
  status: "written" | "skipped-identical" | "skipped-conflict" | "merged" | "unchanged";
  reason?: string;
}

export interface InstallResult {
  id: string;
  ide: Ide;
  scope: Scope;
  root: string;
  files: FileResult[];
  ok: boolean;
}

// Verify every payload file's sha256 before touching disk. Throws on mismatch so a
// corrupted/tampered payload never gets written.
function verifyPayload(files: PayloadFile[]): void {
  for (const f of files) {
    const actual = sha256(f.contents);
    if (actual !== f.sha256) {
      throw new Error(
        `hash mismatch for ${f.path}: expected ${f.sha256.slice(0, 12)}…, got ${actual.slice(0, 12)}…`
      );
    }
  }
}

function writeFile(abs: string, contents: string, force: boolean): FileResult["status"] {
  if (existsSync(abs)) {
    const current = readFileSync(abs, "utf8");
    if (current === contents) return "skipped-identical";
    if (!force) return "skipped-conflict";
  }
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, contents);
  return "written";
}

// Idempotent merge of a Codex skill block into AGENTS.md. Blocks are delimited by
// `<!-- agentgrammar:<id> ... -->` … up to the next agentgrammar marker or EOF.
// Re-installing replaces the existing block in place; installing new appends.
function mergeAgents(abs: string, id: string, block: string): FileResult["status"] {
  const marker = new RegExp(`<!--\\s*agentgrammar:${id}\\b[^>]*-->`);
  const header =
    "# agentgrammar\n\n" +
    "Curated skills installed as standing context. Apply the matching skill before editing " +
    "code, running commands, calling APIs, deploying, or continuing a long run.\n";

  let doc = existsSync(abs) ? readFileSync(abs, "utf8") : "";
  if (!doc.trim()) doc = header;

  const trimmed = block.trim() + "\n";

  if (marker.test(doc)) {
    // Replace the existing block (from its marker to the next agentgrammar marker / EOF).
    const start = doc.search(marker);
    const rest = doc.slice(start);
    const nextRel = rest.slice(1).search(/<!--\s*agentgrammar:/);
    const end = nextRel === -1 ? doc.length : start + 1 + nextRel;
    const replaced = doc.slice(0, start) + trimmed + "\n" + doc.slice(end);
    if (replaced === doc) return "unchanged";
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, replaced);
    return "merged";
  }

  const sep = doc.endsWith("\n") ? "\n" : "\n\n";
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, doc + sep + trimmed);
  return "merged";
}

export async function installSkill(opts: {
  id: string;
  ide: Ide;
  scope: Scope;
  force?: boolean;
  cwd?: string;
}): Promise<InstallResult> {
  const { id, ide, scope, force = false } = opts;
  const cwd = opts.cwd ?? process.cwd();
  const root = installRoot(ide, scope, cwd);

  const payload = await getPayload(id, ide);
  verifyPayload(payload.files);

  const results: FileResult[] = [];

  if (applyMode(ide) === "merge-agents") {
    // Codex: every payload file is a skill block merged into AGENTS.md.
    const agents = join(root, "AGENTS.md");
    for (const f of payload.files) {
      const status = mergeAgents(agents, id, f.contents);
      results.push({ path: "AGENTS.md", status });
    }
  } else {
    for (const f of payload.files) {
      const abs = join(root, f.path);
      const status = writeFile(abs, f.contents, force);
      results.push({
        path: f.path,
        status,
        reason: status === "skipped-conflict" ? "exists with different contents; pass force to overwrite" : undefined,
      });
    }
  }

  const ok = results.every((r) => r.status !== "skipped-conflict");
  return { id, ide, scope, root, files: results, ok };
}
