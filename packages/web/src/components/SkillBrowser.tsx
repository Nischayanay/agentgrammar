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
        .join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [skills, q, domain, ide]);

  const isFiltered = q.trim() || domain !== ALL || ide !== ALL;

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="terminal overflow-visible">
        <div className="terminal-bar gap-3">
          <span className="terminal-dot bg-danger/50" />
          <span className="terminal-dot bg-warn/50" />
          <span className="terminal-dot bg-signal/50" />
          <span className="ml-2 font-mono text-xs text-faint">catalog search</span>
        </div>
        <div className="flex flex-col gap-2.5 p-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-faint">
              /
            </span>
            <label htmlFor="skill-search" className="sr-only">Search skills</label>
            <input
              id="skill-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search skills, tags, failure modes…"
              className="w-full rounded border border-border bg-base pl-7 pr-4 py-2 font-mono text-sm text-ink placeholder:text-ghost focus:border-accent/50 focus:outline-none"
            />
          </div>
          {/* Domain filter */}
          <FilterSelect
            label="Domain"
            value={domain}
            onChange={setDomain}
            options={[
              { value: ALL, label: "all domains" },
              ...domains.map((d) => ({ value: d.slug, label: d.name })),
            ]}
          />
          {/* IDE filter */}
          <FilterSelect
            label="IDE"
            value={ide}
            onChange={setIde}
            options={[
              { value: ALL, label: "all IDEs" },
              ...ides.map((i) => ({ value: i, label: IDE_LABELS[i] ?? i })),
            ]}
          />
          {/* Clear */}
          {isFiltered && (
            <button
              onClick={() => { setQ(""); setDomain(ALL); setIde(ALL); }}
              className="shrink-0 rounded border border-border bg-raised px-3 py-2 font-mono text-xs text-muted transition-colors hover:text-ink"
            >
              clear ×
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-faint" aria-live="polite">
          <span className="text-ink">{results.length}</span>{" "}
          skill{results.length === 1 ? "" : "s"}
          {isFiltered ? " match" : " in catalog"}
        </p>
        {isFiltered && (
          <p className="font-mono text-xs text-faint">
            {skills.length - results.length} hidden by filters
          </p>
        )}
      </div>

      {/* Grid */}
      {results.length === 0 ? (
        <div className="terminal py-16 text-center">
          <p className="font-mono text-sm text-faint">no results.</p>
          <p className="mt-2 font-mono text-xs text-ghost">
            try a broader query or{" "}
            <a href="/submit" className="text-accent-soft hover:underline">suggest a skill</a>
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s, i) => (
            <SkillCard key={s.id} skill={s} weight={weights[s.id]} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
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
    <label className="flex items-center gap-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-border bg-base px-3 py-2 font-mono text-xs text-ink focus:border-accent/50 focus:outline-none"
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
