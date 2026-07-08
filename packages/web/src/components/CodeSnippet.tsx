import { CopyButton } from "./CopyButton";

export function CodeSnippet({
  code,
  caption,
  lang = "bash",
}: {
  code: string;
  caption?: string;
  lang?: string;
}) {
  return (
    <div className="terminal overflow-hidden">
      <div className="terminal-bar">
        <span className="terminal-dot bg-danger/50" />
        <span className="terminal-dot bg-warn/50" />
        <span className="terminal-dot bg-signal/50" />
        {caption && (
          <span className="ml-3 font-mono text-xs text-faint">{caption}</span>
        )}
        <div className="ml-auto">
          <CopyButton value={code} />
        </div>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-sm leading-relaxed text-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}
