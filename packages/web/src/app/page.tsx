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

  return (
    <div className="container-page">
      {/* Hero */}
      <section className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="space-y-6">
          <span className="chip border-accent/40 text-accent-soft">
            One tool · every AI IDE
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            The skill library your AI agent{" "}
            <span className="text-accent-soft">installs on demand.</span>
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Stop copy-pasting prompts. agentgrammar is a curated, security-verified
            library of skills — design, code, review, migration, media — that your
            coding agent pulls in exactly when the task needs it. Claude Code, Cursor,
            Codex, one snippet.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-auto sm:min-w-80">
              <CodeSnippet code={NPX} />
            </div>
            <Link href="/skills" className="btn-primary">
              Browse the catalog →
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-faint">
            <span>✓ Human-reviewed</span>
            <span>✓ No prompt injection</span>
            <span>✓ Free to start</span>
          </div>
        </div>
        <HeroDemo />
      </section>

      {/* Trust strip — the wedge */}
      <section className="grid gap-4 border-y border-border py-10 sm:grid-cols-3">
        <TrustItem
          title="Curated, not scraped"
          body="Every skill is human-reviewed and rendered from a single source. Recent audits found prompt injection in 36% of open skills — none of ours."
        />
        <TrustItem
          title="Context-weight aware"
          body="Each skill shows how much of your context window it costs, so your agent stays sharp instead of drowning in 20 half-read skills."
        />
        <TrustItem
          title="One protocol, three IDEs"
          body="Built on MCP — the one protocol Claude Code, Cursor, and Codex share. Install once, works everywhere."
        />
      </section>

      {/* Domains */}
      <section className="py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Domains</h2>
            <p className="mt-1 text-muted">Expert skills across the work you actually do.</p>
          </div>
          <Link href="/domains" className="text-sm text-accent-soft hover:underline">
            All domains →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {domains.map((d) => {
            const count = d.categories.reduce((n, c) => n + c.skill_ids.length, 0);
            return (
              <Link
                key={d.slug}
                href={`/domains#${d.slug}`}
                className="card group p-6 transition-colors hover:border-accent/50"
              >
                <div className={`text-sm font-medium ${domainAccent(d.slug)}`}>{d.name}</div>
                <p className="mt-2 text-sm text-muted">{d.description}</p>
                <p className="mt-4 text-xs text-faint">
                  {count} skill{count === 1 ? "" : "s"} ·{" "}
                  {d.categories.length} categories
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured skills */}
      <section className="pb-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Featured skills</h2>
            <p className="mt-1 text-muted">A taste of the catalog. Every one verified.</p>
          </div>
          <Link href="/skills" className="text-sm text-accent-soft hover:underline">
            Browse all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <SkillCard key={s.id} skill={s} weight={weights[s.id]} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold text-ink">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <Step n={1} title="Add the MCP server" body="Point your IDE at agentgrammar once with npx. Claude Code, Cursor, and Codex all speak MCP." />
          <Step n={2} title="Ask in plain language" body="“use agentgrammar to design this page.” Your agent searches the curated catalog and picks the right skill." />
          <Step n={3} title="The skill installs itself" body="The agent writes the skill to the correct location for your IDE and applies it — no copy-paste, no lost prompts." />
        </div>
        <div className="mt-8 max-w-xl">
          <CodeSnippet
            caption="claude / cursor / codex"
            code={'use agentgrammar to review this migration before I run it'}
          />
        </div>
      </section>
    </div>
  );
}

function TrustItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2 px-1">
      <h3 className="flex items-center gap-2 font-medium text-ink">
        <span className="text-signal" aria-hidden>✓</span>
        {title}
      </h3>
      <p className="text-sm text-muted">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="card p-6">
      <div className="grid h-8 w-8 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-sm text-accent-soft">
        {n}
      </div>
      <h3 className="mt-4 font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}
