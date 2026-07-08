import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkill, getSkillIds, getSkills, contextWeight, domainAccent } from "@/lib/api";
import { renderMarkdown } from "@/lib/markdown";
import { VerifiedBadge, ContextWeightChip, IdeChips, DomainChip, PublisherChip } from "@/components/Badges";
import { InstallInstructions } from "@/components/InstallInstructions";
import { SkillCard } from "@/components/SkillCard";
import { weightsById, localPreview } from "@/lib/weights";

export const revalidate = 3600;

export async function generateStaticParams() {
  const ids = await getSkillIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const detail = await getSkill(params.id);
  if (!detail) return { title: "Skill not found" };
  const { skill } = detail;
  return {
    title: `${skill.name} — ${skill.domain}/${skill.category}`,
    description: skill.summary,
    alternates: { canonical: `/skills/${skill.id}` },
    openGraph: { title: `${skill.name} · agentgrammar`, description: skill.summary },
  };
}

export default async function SkillDetailPage({ params }: { params: { id: string } }) {
  const detail = await getSkill(params.id, localPreview(params.id));
  if (!detail) notFound();

  const { skill, preview } = detail;
  const weight = contextWeight(preview || skill.summary);
  const bodyHtml = preview ? renderMarkdown(preview) : "";

  const allSkills = await getSkills();
  const weights = weightsById();
  const related = allSkills
    .filter((s) => s.id !== skill.id && (s.domain === skill.domain || s.category === skill.category))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `agentgrammar ${skill.name}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Claude Code, Cursor, Codex",
    description: skill.summary,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    softwareVersion: skill.version,
    author: { "@type": "Organization", name: skill.publisher },
  };

  return (
    <div className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-faint">
        <Link href="/skills" className="hover:text-ink transition-colors">browse</Link>
        <span>/</span>
        <span className={domainAccent(skill.domain)}>{skill.domain}</span>
        <span>/</span>
        <span className="text-muted">{skill.category}</span>
        <span>/</span>
        <span className="text-ink">{skill.id}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">

        {/* ── Main ── */}
        <div className="space-y-8 min-w-0">

          {/* Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="font-mono text-3xl font-semibold tracking-tight text-ink leading-tight">
                {skill.name}
              </h1>
              <VerifiedBadge />
            </div>

            <p className="text-base text-muted leading-relaxed max-w-2xl">{skill.summary}</p>

            {skill.prevents && (
              <div className="flex items-start gap-2.5 rounded border border-danger/20 bg-danger/5 px-4 py-3">
                <span className="font-mono text-xs text-danger/70 shrink-0 mt-0.5">prevents</span>
                <p className="font-mono text-xs text-sub">{skill.prevents}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <ContextWeightChip weight={weight} />
              <IdeChips ides={skill.ide_targets} />
              <DomainChip domain={skill.domain} category={skill.category} />
              <PublisherChip publisher={skill.publisher} />
            </div>
          </header>

          {/* Body */}
          {bodyHtml && (
            <section>
              <p className="overline mb-4">what this skill does</p>
              <div className="card p-6 prose-skill" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section>
              <p className="overline mb-4">related skills</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map((s, i) => (
                  <SkillCard key={s.id} skill={s} weight={weights[s.id]} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-5 lg:sticky lg:top-20">

          {/* Install */}
          <div>
            <p className="overline mb-3">install</p>
            <InstallInstructions skillId={skill.id} skillName={skill.name} ideTargets={skill.ide_targets} />
          </div>

          {/* Metadata */}
          <div className="terminal overflow-hidden">
            <div className="terminal-bar">
              <span className="font-mono text-xs text-faint">metadata</span>
            </div>
            <dl className="divide-y divide-border/60 px-5 py-1">
              {[
                { label: "version",    value: `v${skill.version}` },
                { label: "publisher",  value: skill.publisher },
                { label: "price",      value: skill.price_tier === "free" ? "free" : skill.price_tier },
                { label: "domain",     value: `${skill.domain}/${skill.category}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5">
                  <dt className="font-mono text-xs text-faint">{label}</dt>
                  <dd className="font-mono text-xs text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div>
              <p className="overline mb-3">tags</p>
              <div className="flex flex-wrap gap-1.5">
                {skill.tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
