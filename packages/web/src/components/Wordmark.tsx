// The logotype: lowercase, mono, with the callable-command caret motif from BRANDING.md.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-mono text-base font-semibold text-ink ${className}`}>
      <span
        aria-hidden
        className="grid h-6 w-6 place-items-center rounded-md border border-accent/50 bg-accent/10 text-accent-soft"
      >
        ⟩
      </span>
      <span>
        agent<span className="text-accent-soft">grammar</span>
      </span>
    </span>
  );
}
