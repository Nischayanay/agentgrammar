// A static mock of the moment the product is built around: you type a prompt, the
// agentgrammar chip lights up as a callable tool, and a skill installs. No JS —
// pure CSS so it renders instantly and respects reduced-motion.
export function HeroDemo() {
  return (
    <div className="card animate-fade-up overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-danger/70" />
        <span className="h-3 w-3 rounded-full bg-warn/70" />
        <span className="h-3 w-3 rounded-full bg-signal/70" />
        <span className="ml-3 font-mono text-xs text-faint">agent · new task</span>
      </div>

      <div className="space-y-4 p-5 font-mono text-sm">
        <div className="flex gap-3">
          <span className="text-faint">you</span>
          <p className="text-ink">
            use{" "}
            <span className="rounded-md border border-accent/50 bg-accent/10 px-1.5 py-0.5 text-accent-soft shadow-glow">
              ⟩ agentgrammar
            </span>{" "}
            to design this pricing page
          </p>
        </div>

        <div className="flex gap-3">
          <span className="text-faint">agent</span>
          <div className="space-y-2 text-muted">
            <p>
              <span className="text-signal">✓</span> matched{" "}
              <span className="text-accent-soft">INTERFACE</span> · design/ui-ux
            </p>
            <p>
              <span className="text-signal">✓</span> installed to{" "}
              <span className="text-ink">.claude/skills/interface-design</span>
            </p>
            <p>
              <span className="text-signal">✓</span> applying: contrast, touch targets,
              type scale, semantic tokens…
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="h-2 w-2 animate-pulseglow rounded-full bg-accent" />
          <span className="text-xs text-faint">skill active — 6 rules enforced</span>
        </div>
      </div>
    </div>
  );
}
