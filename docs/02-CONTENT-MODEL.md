# agentgrammar — Content Model & Taxonomy

The catalog is the product. Its structure is what makes the agent able to say "I need a UI/UX skill"
and find the right one. Three levels: **domain → category → skill/plugin**.

## Taxonomy (launch)

```
design ──────────── ui-ux            design-system-builder, a11y-audit, layout-critique
                     branding         brand-voice, naming, logo-brief, color-system
                     product-ui       dashboard-patterns, onboarding-flow

code ────────────── frameworks        nextjs-app, fastapi-service, expo-mobile, tailwind-setup
                     writing           idiomatic-refactor, test-authoring, api-design
                     review            scope, clear, trust, logic, guard   ← existing 5
                     migration         codebase-transfer, framework-upgrade, ts-migration

media ───────────── motion-graphics   after-effects-motion, lottie-export
                     video-editing     cut-to-beat, color-grade-brief, shorts-repurpose
```

Domains and categories are deliberately few at launch — enough to demonstrate breadth (design + code
+ media), shallow enough to curate well. Grow categories as curated content earns a slot.

## Item = manifest + body

Every skill/plugin is a folder with a `manifest.json` and a canonical body. The build renders
per-IDE payloads from the body.

```
catalog/
  design/
    ui-ux/
      design-system-builder/
        manifest.json
        SKILL.md            # canonical body
  code/
    review/
      scope/
        manifest.json
        SKILL.md            # migrated from existing claude-code/.claude/skills/scope
```

### manifest.json schema

```jsonc
{
  "id": "design-system-builder",          // stable, unique, kebab-case
  "name": "Design System Builder",
  "summary": "Generate a coherent design system: tokens, type scale, spacing, components.",
  "domain": "design",
  "category": "ui-ux",
  "tags": ["design-system", "tokens", "tailwind", "figma"],
  "ide_targets": ["claude-code", "cursor", "codex"],
  "price_tier": "free",                    // always 'free' at launch
  "version": "1.0.0",
  "publisher": "agentgrammar",             // "community" once form submissions land
  "requires": [],                          // ids of prerequisite skills
  "render": {                              // optional per-IDE overrides; else derived from SKILL.md
    "cursor": { "rule_activation": "agent-requested" }
  }
}
```

### Canonical body (SKILL.md) rules

- Frontmatter: `name`, `description` (matches existing skill format), optional `allowed-tools`.
- Body: the actual instructions the agent follows.
- Must be **IDE-agnostic in content**; only *packaging* differs per IDE. This is exactly how the
  current 5 frameworks already work, so migration is mechanical.

## Quality bar (the curation contract)

A skill enters the catalog only if it:

1. Solves one clear job with a named deliverable (borrow SCOPE's "state the exact output").
2. Is testable — you can tell whether the agent did it right.
3. Works across all listed `ide_targets` (or lists fewer).
4. Doesn't duplicate an existing skill; it either replaces or specializes.
5. Has a real example prompt in its description.

The existing SCOPE/CLEAR/TRUST/LOGIC/GUARD frameworks are the reference standard for tone and rigor.

## Submission flow (minimal, per founder decision)

```
Contributor → Google Form / Tally
   fields: name, contact, skill title, domain, category, target IDEs,
           short description, link to SKILL.md/gist/repo, license confirmation
        │
        ▼
Form responses → spreadsheet / GitHub issue
        │
   Team review against the quality bar (manual)
        │
   Accept → author manifest.json, place in catalog/, publish version
   Reject → templated reply with the failing criterion
```

No auth, no dashboard, no automated ingestion at launch. The form is a lead funnel and a quality
gate, not a pipeline. When submissions outpace manual review (a good problem), revisit in Phase 4.

## Versioning

- Semver per skill. `latest_version` in catalog; older versions retained for reproducibility.
- Breaking change to a skill body = major bump; the MCP server can pin or auto-update.

## Migration of existing content (Phase 0 task)

| Existing path | New catalog path |
| --- | --- |
| `claude-code/.claude/skills/scope/SKILL.md` | `catalog/code/review/scope/SKILL.md` |
| ...clear/trust/logic/guard | `catalog/code/review/{clear,trust,logic,guard}/` |

Cursor `.mdc` and Codex `AGENTS.md` variants become *rendered payloads* generated from the canonical
`SKILL.md`, not hand-maintained source — this removes the current duplication.
