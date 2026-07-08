import Link from "next/link";
import { getDomains, getSkills, domainAccent } from "@/lib/api";
import { weightsById } from "@/lib/weights";
import { HeroDemo } from "@/components/HeroDemo";
import { CodeSnippet } from "@/components/CodeSnippet";
import { SkillCard } from "@/components/SkillCard";

export const revalidate = 3600;

const NPX = "npx -y agentgrammar";

export default async function HomePage() {
  const [domains, skills] = await Promise.all([getDomains(), getSkills()]);
  const weights = weightsById();
  const featured = skills.slice(0, 6);
  const totalSkills = skills.length;
  const totalDomains = domains.length;

  return (
    <div className="container-page">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="space-y-7 max-w-xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent/50" />
            <span className="font-mono text-xs text-accent-soft tracking-wide">
              one tool · every AI IDE
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tighter text-ink leading-[1.08] sm:text-5xl">
            The skill library<br />
            your agent installs<br />
            <span className="text-accent-soft">on demand.</span>
          </h1>

          <p className="text-base text-muted leading-relaxed">
            agentgrammar is a curated, human-reviewed library of skills for AI coding
            agents. Design, code, review, migration, media — your agent pulls in exactly
            what the task needs. Claude Code, Cursor, Codex — one snippet.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="sm:min-w-80">
              <CodeSnippet code={NPX} />
            </div>
            <Link href="/skills" className="btn-primary shrink-0">
              Browse catalog →
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-xs text-faint">
            <span className="flex items-center gap-1.5">
              <span className="text-signal">✓</span> human-reviewed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-signal">✓</span> no prompt injection
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-signal">✓</span> free to start
            </span>
          </div>
        </div>

        <div className="lg:pl-6">
          <HeroDemo />
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {[
          { n: totalSkills,  label: "skills" },
          { n: totalDomains, label: "domains" },
          { n: 3,            label: "IDEs supported" },
        ].map(({ n, label }) => (
          <div key={label} className="bg-surface px-6 py-5 text-center">
            <p className="stat-number">{n}</p>
            <p className="stat-label mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* ── Trust strip ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <TrustCard
            no="01"
            title="Curated, not scraped"
            body="Every skill is human-reviewed and rendered from a single canonical source. 36% of open skills have prompt injection. None of ours do."
          />
          <TrustCard
            no="02"
            title="Context-weight aware"
            body="Each skill shows its token cost before your agent loads it, so sessions stay sharp instead of drowning in half-read instructions."
          />
          <TrustCard
            no="03"
            title="One protocol, three IDEs"
            body="Built on MCP — the one protocol Claude Code, Cursor, and Codex share. Configure once, works everywhere."
          />
        </div>
      </section>

      {/* ── Domains ───────────────────────────────────────────── */}
      <section className="py-4 pb-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="overline mb-2">taxonomy</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Domains</h2>
          </div>
          <Link href="/domains" className="btn-text font-mono text-xs">
            all domains →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {domains.map((d) => {
            const count = d.categories.reduce((n, c) => n + c.skill_ids.length, 0);
            const accent = domainAccent(d.slug);
            return (
              <Link
                key={d.slug}
                href={`/domains#${d.slug}`}
                className="card-hover group p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={`font-mono text-xs font-medium ${accent}`}>
                    {d.slug}
                  </span>
                  <span className="font-mono text-xs text-ghost">
                    {count} skill{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm font-medium text-ink group-hover:text-accent-soft transition-colors">
                  {d.name}
                </p>
                <p className="mt-1.5 text-xs text-muted line-clamp-2">{d.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.categories.slice(0, 4).map((c) => (
                    <span key={c.slug} className="chip">{c.slug}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured skills ───────────────────────────────────── */}
      <section className="pb-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="overline mb-2">catalog</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Featured skills</h2>
          </div>
          <Link href="/skills" className="btn-text font-mono text-xs">
            browse all →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <SkillCard key={s.id} skill={s} weight={weights[s.id]} index={i} />
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="py-4 pb-24">
        <div className="mb-8">
          <p className="overline mb-2">workflow</p>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">How it works</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Add the MCP server",
              body: "One line in your IDE config. Claude Code, Cursor, and Codex all speak MCP — paste once, done.",
            },
            {
              n: "02",
              title: "Ask in plain language",
              body: "\"use agentgrammar to design this page.\" Your agent searches the catalog and picks the right skill.",
            },
            {
              n: "03",
              title: "Skill installs itself",
              body: "The agent writes to the correct IDE location, verifies the hash, and applies the skill — no copy-paste.",
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="card p-5 space-y-3">
              <span className="font-mono text-xs text-faint">{n}</span>
              <h3 className="font-medium text-ink">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 max-w-xl">
          <CodeSnippet
            caption="example prompt · claude / cursor / codex"
            code="use agentgrammar to review this migration before I run it"
          />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="mb-24 rounded-xl border border-accent/20 bg-accent/5 px-8 py-10 text-center">
        <p className="overline mb-3">get started</p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Ready to give your agent expert-level skills?
        </h2>
        <p className="mt-3 text-muted mx-auto max-w-md">
          One snippet. 19 curated skills across code, design, and media.
          Your agent installs exactly what the task needs, right when it needs it.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <div className="sm:min-w-72">
            <CodeSnippet code={NPX} />
          </div>
          <Link href="/skills" className="btn-ghost shrink-0">Browse catalog</Link>
        </div>
      </section>

    </div>
  );
}

function TrustCard({ no, title, body }: { no: string; title: string; body: string }) {
  return (
    <div className="card p-5 space-y-3">
      <span className="font-mono text-xs text-faint">{no}</span>
      <h3 className="font-medium text-ink">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}
