import type { Metadata } from "next";
import Link from "next/link";
import { getDomains, getSkills, domainAccent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Domains",
  description:
    "The agentgrammar taxonomy: design, code, and media skills for AI coding agents, organized by category.",
};

export default async function DomainsPage() {
  const [domains, skills] = await Promise.all([getDomains(), getSkills()]);
  const byId = new Map(skills.map((s) => [s.id, s]));

  return (
    <div className="container-page py-12">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink">Domains</h1>
        <p className="mt-2 text-muted">
          Skills are organized into domains and categories. Empty categories are on the
          roadmap — the curation bar is the same for every one.
        </p>
      </header>

      <div className="space-y-14">
        {domains.map((d) => (
          <section key={d.slug} id={d.slug} className="scroll-mt-24">
            <div className="mb-5 flex items-baseline gap-3">
              <h2 className={`text-2xl font-semibold ${domainAccent(d.slug)}`}>{d.name}</h2>
              <span className="text-sm text-faint">{d.description}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {d.categories.map((c) => (
                <div key={c.slug} className="card p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-ink">{c.name}</h3>
                    <span className="text-xs text-faint">
                      {c.skill_ids.length} skill{c.skill_ids.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{c.description}</p>
                  {c.skill_ids.length ? (
                    <ul className="mt-4 space-y-1.5">
                      {c.skill_ids.map((id) => {
                        const s = byId.get(id);
                        return (
                          <li key={id}>
                            <Link
                              href={`/skills/${id}`}
                              className="flex items-center justify-between rounded-md px-2 py-1 text-sm text-muted hover:bg-raised hover:text-ink"
                            >
                              <span className="font-mono">{s?.name ?? id}</span>
                              <span className="text-xs text-faint">{s?.summary?.slice(0, 40)}…</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-4 text-xs text-faint">
                      Coming soon ·{" "}
                      <Link href="/submit" className="text-accent-soft hover:underline">
                        suggest a skill
                      </Link>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
