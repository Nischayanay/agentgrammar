import type { Metadata } from "next";
import { CodeSnippet } from "@/components/CodeSnippet";

export const metadata: Metadata = {
  title: "Submit a skill",
  description: "Suggest a skill for the agentgrammar catalog. Every submission is human-reviewed before it ships.",
};

const FORM_URL = "https://tally.so/r/agentgrammar-submit";

const BAR = [
  { n: "01", title: "One testable output",    body: "The skill produces a concrete, checkable result — not 'improve the code.'" },
  { n: "02", title: "Failure-mode first",     body: "It names the specific way agents get this wrong and prevents it." },
  { n: "03", title: "No prompt injection",    body: "No instructions that hijack the agent or exfiltrate context. We check every line." },
  { n: "04", title: "IDE-portable",           body: "Written once in SKILL.md; renders cleanly to Claude Code, Cursor, and Codex." },
];

export default function SubmitPage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl space-y-12">

        <header className="space-y-3">
          <p className="overline">contribute</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Submit a skill</h1>
          <p className="text-base text-muted leading-relaxed">
            agentgrammar is curated on purpose. We&apos;d rather ship 50 skills we&apos;d
            stake our name on than 20,000 we haven&apos;t read. Send us yours — if it
            clears the bar, we render it to every IDE and credit you.
          </p>
        </header>

        {/* Curation bar */}
        <section>
          <p className="overline mb-4">the curation bar</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {BAR.map((b) => (
              <div key={b.n} className="card p-5 space-y-2">
                <span className="font-mono text-xs text-faint">{b.n}</span>
                <h3 className="font-medium text-ink">{b.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to submit */}
        <section className="space-y-5">
          <p className="overline">how to submit</p>
          <p className="text-muted text-sm leading-relaxed">
            Fastest path: fill out the form below. Prefer git? Open a PR that adds a
            folder under{" "}
            <code className="rounded border border-border bg-raised px-1.5 py-0.5 font-mono text-xs text-accent-soft">
              catalog/&lt;domain&gt;/&lt;category&gt;/&lt;id&gt;/
            </code>{" "}
            with a <code className="font-mono text-xs text-sub">manifest.json</code> and{" "}
            <code className="font-mono text-xs text-sub">SKILL.md</code>.
          </p>
          <CodeSnippet
            caption="catalog structure"
            code={`catalog/design/ui-ux/my-skill/\n├── manifest.json   # id, name, summary, domain, tags, ide_targets\n└── SKILL.md        # canonical body (Claude Code format)`}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={FORM_URL} target="_blank" rel="noreferrer" className="btn-primary">
              Open submission form →
            </a>
            <a
              href="https://github.com/Nischayanay/agentgrammar/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              CONTRIBUTING.md
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
