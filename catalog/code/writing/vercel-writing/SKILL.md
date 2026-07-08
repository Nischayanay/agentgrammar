---
name: vercel-writing
description: Use when writing or reviewing any technical documentation, README, changelog, how-to guide, reference page, or prose. Applies 80+ Vercel writing handbook rules for voice, structure, content type, code samples, and typography.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# WRITING GUIDELINES framework

Apply WRITING GUIDELINES when producing or auditing any technical prose. If `$ARGUMENTS` is present, treat it as the document or section to write or review: `$ARGUMENTS`.

Good technical writing is a product decision. A developer who cannot understand the docs does not use the feature. Every rule below removes friction between the reader and the answer they need.

---

## P - Plan the content type first

Each content type has a distinct job and a distinct structure. Using the wrong one wastes the reader's time:

| Type | Job | Structure |
| --- | --- | --- |
| Tutorial | Teach by doing | Steps → achievement |
| How-to guide | Solve a specific problem | Numbered steps, goal at top |
| Reference | Look something up | Tables, parameters, exhaustive |
| Conceptual | Explain how something works | Explanation, no steps |
| Troubleshooting | Fix a known problem | Symptom → cause → fix |

Do not mix types in one document. A "Tutorial" that also covers every API parameter is neither — split it.

## L - Lead with the user's goal, not the product's structure

- Title: user-shaped — "Deploy a Next.js app to Vercel" not "Vercel Deployment Overview."
- Opening sentence: state the outcome. "This guide shows you how to deploy a Next.js project with zero configuration."
- TL;DR or summary first for reference and conceptual docs — the reader should know what they'll learn before committing to read.
- Do not open with history, background, or "In today's world…" — get to the point.

## A - Active voice, direct address

- Write to the reader: "You can deploy with one command" not "Deployment can be done with one command."
- Active voice: "The CLI fetches the config" not "The config is fetched by the CLI."
- Second person ("you") throughout — not "the user", not "one", not "developers."
- Present tense for current state: "The command returns a URL" not "The command will return a URL."

**Banned words** — these words signal the author did not think hard enough about the reader's situation:
- easy, simple, quick, just, straightforward, obvious, clearly, basically, simply

## N - Notes, warnings, and callouts sparingly

- Use a callout only when the information would cause real harm or confusion if missed inline.
- Maximum one callout per screen of text.
- Types in order of severity: Note → Tip → Important → Warning → Danger.
- Never use a callout to emphasise a preference or add flavour — that is inline prose.

## D - Document headings as user questions

- Sentence case for all headings: "Set up authentication" not "Set Up Authentication."
- Headings should be descriptive enough to navigate by — "Step 3" is not a heading.
- Do not use headings for single-sentence sections — combine or promote to inline bold.
- `<h2>` for major sections, `<h3>` for subsections — never skip levels.

---

## Code sample rules

- Every code sample has a language tag: ` ```ts ` not ` ``` `.
- TypeScript first — show JS as a secondary tab if needed, not the primary.
- Lines ≤ 80 columns. Code blocks ≤ 25 lines — split or summarise longer examples.
- Use `<Steps>` (or equivalent) for sequential CLI commands — not a single code block with multiple commands run together.
- Placeholder values use `SCREAMING_SNAKE_CASE`: `YOUR_API_KEY`, `PROJECT_ID`.
- Show the full command including `npx` / `npm run` / `node` prefix — never assume the reader knows the runner.

```ts
// Good: complete, typed, realistic
import { createClient } from '@vercel/postgres';

const client = createClient({
  connectionString: process.env.POSTGRES_URL,
});

const { rows } = await client.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
```

---

## Typography and formatting rules

- En dash (`–`) for number ranges: "5–10 minutes", not "5-10 minutes."
- Em dash (`—`) for parenthetical clauses — inline, no spaces around it.
- Curly/smart quotes (`"` `"`) in prose, straight quotes only in code.
- Numbers: spell out zero through nine; use numerals for 10 and above.
- Units: `64 KB`, `200 ms`, `1 GB` — value and unit separated by a non-breaking space, unit abbreviated.
- No hard line-wrapping in Markdown source — let the renderer handle line length.
- No `---` horizontal rules as section dividers in prose documents.
- Blank line discipline: one blank line between paragraphs, not two.

---

## AI workflow accountability

When writing docs that describe AI-assisted workflows:

- Disclose clearly when content was AI-generated or AI-assisted.
- "Plan first, then generate" — outline the structure before asking an AI to fill sections.
- The human author is accountable for factual accuracy regardless of the generation method.
- Do not publish AI-generated code samples without testing them.

---

## Audit checklist

```text
[ ] Content type identified and consistent throughout
[ ] Title is user-shaped (goal, not product structure)
[ ] Opens with outcome, not background
[ ] Active voice throughout
[ ] No banned words (easy, simple, quick, just, basically, clearly)
[ ] Callouts used sparingly — max one per screen
[ ] Headings sentence case, descriptive, no level skips
[ ] Code samples: language tag, ≤80 cols, ≤25 lines, TypeScript first
[ ] Placeholders in SCREAMING_SNAKE_CASE
[ ] Units: abbreviated, separated from value
[ ] Smart quotes in prose, no hard line wraps
```

End your writing guidelines pass with:

```text
Document type:
Primary audience:
Failures found:
Rewrites needed:
Cleared for publish: yes/no
```
