import { CopyButton } from "./CopyButton";

export function CodeSnippet({
  code,
  caption,
}: {
  code: string;
  caption?: string;
}) {
  return (
    <div className="card overflow-hidden">
      {caption ? (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="font-mono text-xs text-faint">{caption}</span>
          <CopyButton value={code} />
        </div>
      ) : null}
      <div className="relative">
        {!caption ? (
          <div className="absolute right-3 top-3">
            <CopyButton value={code} />
          </div>
        ) : null}
        <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-ink">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
