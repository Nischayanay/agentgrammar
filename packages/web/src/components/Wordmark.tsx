export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-ink ${className}`}>
      <span
        aria-hidden
        className="flex h-6 w-6 items-center justify-center rounded border border-accent/40 bg-accent/10 text-xs text-accent-soft"
      >
        ⟩
      </span>
      <span className="tracking-tight">
        agent<span className="text-accent-soft">grammar</span>
      </span>
    </span>
  );
}
