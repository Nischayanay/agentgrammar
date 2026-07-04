import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSkill,
  getSkillIds,
  getSkills,
  contextWeight,
  domainAccent,
} from "@/lib/api";
import { renderMarkdown } from "@/lib/markdown";
import { VerifiedBadge, ContextWeightChip, IdeChips } from "@/components/Badges";
import { InstallInstructions } from "@/components/InstallInstructions";
import { SkillCard } from "@/components/SkillCard";
import { weightsById, localPreview } from "@/lib/weights";

export const revalidate = 3600;

export async function generateStaticParams() {
  const ids = await getSkillIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const detail = await getSkill(params.id);
  if (!detail) return { title: "Skill not found" };
  const { skill } = detail;
  const title = `${skill.name} — ${skill.domain}/${skill.category} skill`;
  return {
    title,
    description: skill.summary,
    alternates: { canonical: `/skills/${skill.id}` },
    openGraph: { title: `${skill.name} · agentgrammar`, description: skill.summary },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: { id: string };
}) {
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
    <div className="container-page py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-faint">
        <Link href="/skills" className="hover:text-ink">Browse</Link>
        <span className="px-2">/</span>
        <span className={domainAccent(skill.domain)}>
          {skill.domain}/{skill.category}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        {/* Main */}
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-3xl font-semibold text-ink">{skill.name}</h1>
              <VerifiedBadge />
            </div>
            <p className="text-lg text-muted">{skill.summary}</p>
            {skill.prevents ? (
              <p className="text-sm text-faint">
                <span className="text-danger/80">Prevents:</span> {skill.prevents}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <ContextWeightChip weight={weight} />
              <IdeChips ides={skill.ide_targets} />
            </div>
          </header>

          {bodyHtml ? (
            <section>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-faint">
                What this skill does
              </h2>
              <div
                className="prose-skill card p-6"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </section>
          ) : null}

          {related.length ? (
            <section>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-faint">
                Related skills
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((s) => (
                  <SkillCard key={s.id} skill={s} weight={weights[s.id]} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-faint">
              Install
            </h2>
            <InstallInstructions
              skillId={skill.id}
              skillName={skill.name}
              ideTargets={skill.ide_targets}
            />
          </div>

          <dl className="card space-y-3 p-5 text-sm">
            <Meta label="Version" value={`v${skill.version}`} />
            <Meta label="Publisher" value={skill.publisher} />
            <Meta label="Price" value={skill.price_tier === "free" ? "Free" : skill.price_tier} />
            <div>
              <dt className="text-faint">Tags</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {skill.tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-faint">{label}</dt>
      <dd className="font-mono text-ink">{value}</dd>
    </div>
  );
}
