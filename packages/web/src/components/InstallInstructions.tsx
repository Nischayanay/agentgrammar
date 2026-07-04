"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";

type Props = {
  skillId: string;
  skillName: string;
  ideTargets: string[];
};

const TABS = [
  { id: "mcp", label: "MCP (recommended)" },
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "codex", label: "Codex" },
];

export function InstallInstructions({ skillId, skillName, ideTargets }: Props) {
  const [tab, setTab] = useState("mcp");

  const snippets: Record<string, { code: string; note: string }> = {
    mcp: {
      code: `use agentgrammar to apply ${skillId} to this task`,
      note: "With the agentgrammar MCP server connected, just ask in plain language. Your agent finds and installs the skill.",
    },
    "claude-code": {
      code: `# add the MCP server once\nnpx -y agentgrammar\n\n# then in Claude Code:\nUse ${skillName} for this task.`,
      note: "Installs to .claude/skills/" + skillId + "/SKILL.md",
    },
    cursor: {
      code: `# add the MCP server once\nnpx -y agentgrammar\n\n# then in a Cursor Agent chat:\n/agentgrammar-${skillId}`,
      note: "Installs the Cursor rule + skill for " + skillName + ".",
    },
    codex: {
      code: `# add the MCP server once\nnpx -y agentgrammar\n\n# Codex reads the skill from AGENTS.md as standing context.`,
      note: "Merged into AGENTS.md — ask for the task normally.",
    },
  };

  const available = TABS.filter(
    (t) => t.id === "mcp" || ideTargets.includes(t.id)
  );
  const active = snippets[tab] ?? snippets.mcp;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-border p-2" role="tablist">
        {available.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t.id
                ? "bg-accent/15 text-accent-soft"
                : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="absolute right-3 top-3">
          <CopyButton value={active.code} />
        </div>
        <pre className="overflow-x-auto p-4 pr-20 font-mono text-xs leading-relaxed text-ink">
          <code>{active.code}</code>
        </pre>
      </div>
      <p className="border-t border-border px-4 py-2.5 text-xs text-faint">
        {active.note}
      </p>
    </div>
  );
}
