// IDE detection + install path resolution. Mirrors install.sh write locations.

import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export type Ide = "claude-code" | "cursor" | "codex";
export const SUPPORTED_IDES: Ide[] = ["claude-code", "cursor", "codex"];

export type Scope = "project" | "global";

// Detect the current IDE. Precedence: explicit override -> env markers -> cwd markers.
export function detectIde(cwd = process.cwd()): Ide {
  const override = process.env.AGENTGRAMMAR_IDE?.trim().toLowerCase();
  if (override && SUPPORTED_IDES.includes(override as Ide)) return override as Ide;

  // Environment markers set by the host agent.
  if (process.env.CURSOR_TRACE_ID || process.env.CURSOR_SESSION_ID) return "cursor";
  if (process.env.CODEX_HOME || process.env.CODEX_SANDBOX) return "codex";
  if (process.env.CLAUDECODE || process.env.CLAUDE_CODE) return "claude-code";

  // Filesystem markers in the project.
  if (existsSync(join(cwd, ".cursor"))) return "cursor";
  if (existsSync(join(cwd, ".claude"))) return "claude-code";
  if (existsSync(join(cwd, "AGENTS.md"))) return "codex";

  // Default: Claude Code (primary target).
  return "claude-code";
}

// Resolve the root directory the payload `path` values are written under.
// For claude-code global scope, skills live in ~/.claude; otherwise cwd.
export function installRoot(ide: Ide, scope: Scope, cwd = process.cwd()): string {
  if (scope === "global") {
    if (ide === "claude-code") return homedir();
    // Cursor/Codex are project-scoped in practice; global falls back to home too.
    return homedir();
  }
  return cwd;
}

// How each IDE's payload files are applied. "write" = whole-file write (with conflict
// handling); "merge-agents" = idempotent block merge into AGENTS.md.
export function applyMode(ide: Ide): "write" | "merge-agents" {
  return ide === "codex" ? "merge-agents" : "write";
}
