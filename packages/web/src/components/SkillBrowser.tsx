"use client";

import { useMemo, useState } from "react";
import type { SkillMeta, ContextWeight, Domain } from "@/lib/api";
import { IDE_LABELS } from "@/lib/api";
import { SkillCard } from "./SkillCard";

type Props = {
  skills: SkillMeta[];
  domains: Domain[];
  weights: Record<string, ContextWeight>;
};

const ALL = "all";

export function SkillBrowser({ skills, domains, weights }: Props) {
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState(ALL);
  const [ide, setIde] = useState(ALL);

  const ides = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => s.ide_targets.forEach((i) => set.add(i)));
    return [...set];
  }, [skills]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return skills.filter((s) => {
      if (domain !== ALL && s.domain !== domain) return false;
      if (ide !== ALL && !s.ide_targets.includes(ide)) return false;
      if (!needle) return true;
      const hay = [s.name, s.id, s.summary, s.prevents ?? "", ...s.tags]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [skills, q, domain, ide]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="skill-search" className="sr-only">
            Search skills
          </label>
          <input
            id="skill-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search skills, tags, or failure modes…"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/60"
          />
        </div>
        <Select
          label="Domain"
          value={domain}
          onChange={setDomain}
          options={[{ value: ALL, label: "All domains" }, ...domains.map((d) => ({ value: d.slug, label: d.name }))]}
        />
        <Select
          label="IDE"
          value={ide}
          onChange={setIde}
          options={[{ value: ALL, label: "All IDEs" }, ...ides.map((i) => ({ value: i, label: IDE_LABELS[i] ?? i }))]}
        />
      </div>

      <p className="text-sm text-faint" aria-live="polite">
        {results.length} skill{results.length === 1 ? "" : "s"}
        {q || domain !== ALL || ide !== ALL ? " match your filters" : " in the catalog"}
      </p>

      {results.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          No skills match. Try a broader search — or{" "}
          <a href="/submit" className="text-accent-soft hover:underline">
            suggest one
          </a>
          .
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <SkillCard key={s.id} skill={s} weight={weights[s.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-accent/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
