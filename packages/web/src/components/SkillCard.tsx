import Link from "next/link";
import type { SkillMeta, ContextWeight } from "@/lib/api";
import { domainAccent } from "@/lib/api";
import { VerifiedBadge, ContextWeightChip, IdeChips } from "./Badges";

export function SkillCard({
  skill,
  weight,
}: {
  skill: SkillMeta;
  weight?: ContextWeight;
}) {
  return (
    <Link
      href={`/skills/${skill.id}`}
      className="card group flex flex-col gap-3 p-5 transition-colors duration-200 hover:border-accent/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-ink">{skill.name}</span>
            <span className={`text-xs font-medium ${domainAccent(skill.domain)}`}>
              {skill.domain}/{skill.category}
            </span>
          </div>
        </div>
        <VerifiedBadge compact />
      </div>

      <p className="text-sm leading-relaxed text-muted">{skill.summary}</p>

      {skill.prevents ? (
        <p className="text-xs text-faint">
          <span className="text-danger/80">Prevents:</span> {skill.prevents}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        {weight ? <ContextWeightChip weight={weight} /> : null}
        <IdeChips ides={skill.ide_targets} />
      </div>
    </Link>
  );
}
