"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";

type Props = {
  skillId: string;
  skillName: string;
  ideTargets: string[];
};

const TABS = [
  { id: "mcp",         label: "MCP"        },
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor",      label: "Cursor"      },
  { id: "codex",       label: "Codex"       },
];

export function InstallInstructions({ skillId, skillName, ideTargets }: Props) {
  const [tab, setTab] = useState("mcp");

  const snippets: Record<string, { code: string; note: string }> = {
    mcp: {
      code: `use agentgrammar to apply ${skillId}`,
      note: "With the agentgrammar MCP server connected, just ask. Your agent finds and installs the skill.",
    },
    "claude-code": {
      code: `npx -y agentgrammar\n# then in Claude Code:\nUse ${skillName} for this task.`,
      note: `Installs to .claude/skills/${skillId}/SKILL.md`,
    },
    cursor: {
      code: `npx -y agentgrammar\n# then in Cursor Agent chat:\n/agentgrammar-${skillId}`,
      note: `Installs the Cursor rule + skill for ${skillName}.`,
    },
    codex: {
      code: `npx -y agentgrammar\n# Codex reads the skill from AGENTS.md as standing context.`,
      note: "Merged into AGENTS.md — ask for the task normally.",
    },
  };

  const available = TABS.filter((t) => t.id === "mcp" || ideTargets.includes(t.id));
  const active = snippets[tab] ?? snippets.mcp;

  return (
    <div className="terminal overflow-hidden">
      {/* Tab bar */}
      <div className="terminal-bar flex-wrap gap-1">
        <span className="terminal-dot bg-danger/50" />
        <span className="terminal-dot bg-warn/50" />
        <span className="terminal-dot bg-signal/50" />
        <div className="ml-3 flex gap-0.5" role="tablist">
          {available.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded px-2.5 py-1 font-mono text-2xs transition-colors ${
                tab === t.id
                  ? "bg-accent/15 text-accent-soft"
                  : "text-faint hover:text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <div className="absolute right-3 top-3">
          <CopyButton value={active.code} />
        </div>
        <pre className="overflow-x-auto px-5 py-4 pr-20 font-mono text-xs leading-relaxed text-ink">
          <code>{active.code}</code>
        </pre>
      </div>

      {/* Note */}
      <div className="border-t border-border/60 bg-raised/30 px-5 py-2.5">
        <p className="font-mono text-xs text-faint">{active.note}</p>
      </div>
    </div>
  );
}
