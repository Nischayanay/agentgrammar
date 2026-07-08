import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[55vh] place-items-center py-20">
      <div className="terminal max-w-sm w-full overflow-hidden">
        <div className="terminal-bar">
          <span className="terminal-dot bg-danger/60" />
          <span className="terminal-dot bg-warn/60" />
          <span className="terminal-dot bg-signal/60" />
          <span className="ml-auto font-mono text-xs text-faint">404</span>
        </div>
        <div className="p-6 space-y-4 font-mono text-sm">
          <div className="flex gap-3">
            <span className="text-faint">❯</span>
            <span className="text-ink">agentgrammar search <span className="text-danger/80">404</span></span>
          </div>
          <div className="pl-6 space-y-1.5 text-muted">
            <p><span className="text-danger/70">✗</span> skill not found in catalog</p>
            <p className="text-faint text-xs">it may be renamed, or still on the roadmap</p>
          </div>
        </div>
        <div className="border-t border-border/60 bg-raised/30 px-6 py-4 flex flex-col gap-2 sm:flex-row">
          <Link href="/skills" className="btn-primary text-xs py-1.5">browse skills</Link>
          <Link href="/" className="btn-ghost text-xs py-1.5">home</Link>
        </div>
      </div>
    </div>
  );
}
