import Link from "next/link";
import type { SkillMeta, ContextWeight } from "@/lib/api";
import { ContextWeightChip, IdeChips, DomainChip, VerifiedBadge } from "./Badges";

export function SkillCard({
  skill,
  weight,
  index,
}: {
  skill: SkillMeta;
  weight?: ContextWeight;
  index?: number;
}) {
  return (
    <Link
      href={`/skills/${skill.id}`}
      className="card-hover group flex flex-col gap-0 overflow-hidden"
    >
      {/* Top strip */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <DomainChip domain={skill.domain} category={skill.category} />
        <div className="flex items-center gap-2">
          {index !== undefined && (
            <span className="font-mono text-2xs text-ghost tabular-nums">
              #{String(index + 1).padStart(2, "0")}
            </span>
          )}
          <VerifiedBadge compact />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div>
          <h3 className="font-mono text-sm font-semibold tracking-tight text-ink group-hover:text-accent-soft transition-colors">
            {skill.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-2">
            {skill.summary}
          </p>
        </div>

        {skill.prevents && (
          <p className="font-mono text-xs text-faint border-l-2 border-danger/30 pl-2.5">
            prevents: {skill.prevents}
          </p>
        )}
      </div>

      {/* Footer strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 px-4 py-2.5">
        <IdeChips ides={skill.ide_targets} />
        {weight && <ContextWeightChip weight={weight} />}
      </div>
    </Link>
  );
}
