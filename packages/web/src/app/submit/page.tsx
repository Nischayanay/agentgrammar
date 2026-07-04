import type { Metadata } from "next";
import { CodeSnippet } from "@/components/CodeSnippet";

export const metadata: Metadata = {
  title: "Submit a skill",
  description:
    "Suggest a skill for the agentgrammar catalog. Every submission is human-reviewed against the curation bar before it ships.",
};

// Replace with the real Tally/Google Form URL when live.
const FORM_URL = "https://tally.so/r/agentgrammar-submit";

const BAR = [
  { title: "One testable output", body: "The skill produces a concrete, checkable result — not “improve the code.”" },
  { title: "Failure-mode first", body: "It names the specific way agents get this wrong and prevents it." },
  { title: "No prompt injection", body: "No instructions that hijack the agent or exfiltrate context. We check every line." },
  { title: "IDE-portable", body: "Written once in SKILL.md; renders cleanly to Claude Code, Cursor, and Codex." },
];

export default function SubmitPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-ink">Submit a skill</h1>
          <p className="text-lg text-muted">
            agentgrammar is curated on purpose. We&apos;d rather ship 50 skills we&apos;d
            stake our name on than 20,000 we haven&apos;t read. Send us yours — if it
            clears the bar, we&apos;ll render it to every IDE and credit you.
          </p>
        </header>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-faint">
            The curation bar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BAR.map((b) => (
              <div key={b.title} className="card p-5">
                <h3 className="flex items-center gap-2 font-medium text-ink">
                  <span className="text-signal" aria-hidden>✓</span>
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-faint">
            How to submit
          </h2>
          <p className="text-muted">
            Fastest path: fill out the form. Prefer git? Open a PR that adds a folder under{" "}
            <code className="rounded bg-raised px-1.5 py-0.5 font-mono text-xs text-accent-soft">
              catalog/&lt;domain&gt;/&lt;category&gt;/&lt;id&gt;/
            </code>{" "}
            with a <span className="font-mono text-sm">manifest.json</span> and{" "}
            <span className="font-mono text-sm">SKILL.md</span>.
          </p>
          <CodeSnippet
            caption="catalog layout"
            code={`catalog/design/ui-ux/interface-design/\n├── manifest.json   # id, name, summary, domain, tags, ide_targets\n└── SKILL.md        # the canonical body (Claude Code format)`}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={FORM_URL} target="_blank" rel="noreferrer" className="btn-primary">
              Open the submission form →
            </a>
            <a
              href="https://github.com/Nischayanay/agentgrammar/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              Read CONTRIBUTING.md
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
