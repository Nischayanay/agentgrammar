import type { ContextWeight } from "@/lib/api";

// The wedge: every catalog skill is human-vetted and rendered from one source.
export function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-signal/30 bg-signal/10 px-2 py-0.5 text-xs font-medium text-signal"
      title="Human-reviewed, rendered from a single source, no prompt injection."
    >
      <span aria-hidden>✓</span>
      {compact ? "Verified" : "Verified skill"}
    </span>
  );
}

// Ownable signal: how much of the context window this skill costs.
export function ContextWeightChip({ weight }: { weight: ContextWeight }) {
  const tone =
    weight.label === "Light"
      ? "text-signal border-signal/30 bg-signal/5"
      : weight.label === "Medium"
        ? "text-warn border-warn/30 bg-warn/5"
        : "text-danger border-danger/30 bg-danger/5";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}
      title={`~${weight.tokens.toLocaleString()} tokens of context when installed`}
    >
      <span aria-hidden>◔</span>
      {weight.label} · ~{weight.tokens.toLocaleString()} tok
    </span>
  );
}

export function IdeChips({ ides }: { ides: string[] }) {
  const labels: Record<string, string> = {
    "claude-code": "Claude Code",
    cursor: "Cursor",
    codex: "Codex",
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {ides.map((ide) => (
        <span key={ide} className="chip">
          {labels[ide] ?? ide}
        </span>
      ))}
    </div>
  );
}
