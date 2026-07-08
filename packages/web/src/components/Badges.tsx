import type { ContextWeight } from "@/lib/api";

export function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded border border-signal/25 bg-signal/8 px-1.5 py-0.5 font-mono text-2xs text-signal"
      title="Human-reviewed, rendered from a single canonical source."
    >
      ✓ {compact ? "verified" : "verified skill"}
    </span>
  );
}

export function ContextWeightChip({ weight }: { weight: ContextWeight }) {
  const cls =
    weight.label === "Light"
      ? "text-signal border-signal/20 bg-signal/5"
      : weight.label === "Medium"
        ? "text-warn   border-warn/20   bg-warn/5"
        : "text-danger border-danger/20 bg-danger/5";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-2xs ${cls}`}
      title={`~${weight.tokens.toLocaleString()} tokens when installed`}
    >
      {weight.label === "Light" ? "◑" : weight.label === "Medium" ? "◕" : "●"}{" "}
      {weight.label.toLowerCase()} · ~{weight.tokens.toLocaleString()}t
    </span>
  );
}

export function IdeChips({ ides }: { ides: string[] }) {
  const labels: Record<string, string> = {
    "claude-code": "claude",
    cursor: "cursor",
    codex:  "codex",
  };
  return (
    <div className="flex flex-wrap gap-1">
      {ides.map((ide) => (
        <span key={ide} className="chip">{labels[ide] ?? ide}</span>
      ))}
    </div>
  );
}

export function DomainChip({ domain, category }: { domain: string; category: string }) {
  const cls =
    domain === "design" ? "text-design border-design/20 bg-design/5"
    : domain === "media" ? "text-media border-media/20 bg-media/5"
    : "text-code border-code/20 bg-code/5";
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-2xs ${cls}`}>
      {domain}/{category}
    </span>
  );
}

export function PublisherChip({ publisher }: { publisher: string }) {
  const isOfficial = publisher === "agentgrammar";
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-2xs ${
      isOfficial
        ? "border-accent/25 bg-accent/8 text-accent-soft"
        : "border-border bg-raised text-faint"
    }`}>
      {isOfficial ? "★ " : ""}{publisher}
    </span>
  );
}
