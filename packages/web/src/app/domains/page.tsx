import type { Metadata } from "next";
import Link from "next/link";
import { getDomains, getSkills, domainAccent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Domains",
  description: "The agentgrammar taxonomy: design, code, and media skills organized by domain and category.",
};

export default async function DomainsPage() {
  const [domains, skills] = await Promise.all([getDomains(), getSkills()]);
  const byId = new Map(skills.map((s) => [s.id, s]));

  return (
    <div className="container-page py-10">
      <header className="mb-12 max-w-2xl">
        <p className="overline mb-3">catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Domains</h1>
        <p className="mt-3 text-base text-muted leading-relaxed">
          Skills are organised into domains and categories. Every slot in the taxonomy
          is a curation decision — empty categories are on the roadmap.
        </p>
      </header>

      <div className="space-y-16">
        {domains.map((d) => {
          const accent = domainAccent(d.slug);
          const totalSkills = d.categories.reduce((n, c) => n + c.skill_ids.length, 0);

          return (
            <section key={d.slug} id={d.slug} className="scroll-mt-24">
              {/* Domain header */}
              <div className="mb-6 flex items-baseline gap-4 border-b border-border pb-4">
                <h2 className={`font-mono text-lg font-semibold tracking-tight ${accent}`}>
                  {d.slug}
                </h2>
                <span className="text-base font-medium text-ink">{d.name}</span>
                <span className="ml-auto font-mono text-xs text-faint">
                  {totalSkills} skill{totalSkills !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {d.categories.map((c) => (
                  <div key={c.slug} className="card overflow-hidden">
                    {/* Category header */}
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                      <span className="font-mono text-xs font-medium text-ink">{c.name}</span>
                      <span className="font-mono text-2xs text-faint">
                        {c.skill_ids.length} skill{c.skill_ids.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="px-4 py-3">
                      <p className="text-xs text-muted mb-3">{c.description}</p>

                      {c.skill_ids.length ? (
                        <ul className="space-y-1">
                          {c.skill_ids.map((id) => {
                            const s = byId.get(id);
                            return (
                              <li key={id}>
                                <Link
                                  href={`/skills/${id}`}
                                  className="row-item rounded"
                                >
                                  <span className="font-mono text-xs text-ghost select-none w-4">›</span>
                                  <span className="font-mono text-xs font-medium text-ink flex-1 hover:text-accent-soft transition-colors">
                                    {s?.name ?? id}
                                  </span>
                                  <span className="font-mono text-2xs text-faint truncate max-w-[140px]">
                                    {s?.summary?.slice(0, 38)}…
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="font-mono text-xs text-ghost">
                          coming soon ·{" "}
                          <Link href="/submit" className="text-accent-soft hover:underline">
                            suggest a skill
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
