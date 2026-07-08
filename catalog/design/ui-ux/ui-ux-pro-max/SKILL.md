---
name: ui-ux-pro-max
description: Use at the start of any UI task to generate a complete, industry-matched design system before writing a single line of code. The reasoning engine matches the product type to style, color palette, typography, and anti-patterns from 161 industry-specific rules.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# UI/UX PRO MAX framework

Apply UI/UX PRO MAX before generating any UI — the design system comes first, the code comes second. If `$ARGUMENTS` is present, treat it as the product description or UI task: `$ARGUMENTS`.

Install: `npm install -g ui-ux-pro-max-cli` then `uipro init --ai claude` (or swap `claude` for `cursor`, `codex`, `kiro`, etc.).

---

## Step 1 — Identify the product type precisely

Before touching any code, extract these three facts from the user's request:
1. **Product type** — what category of product is this? (SaaS, fintech, wellness, e-commerce, portfolio, …) The engine knows 161 types.
2. **Stack** — what framework will the code use? (HTML+Tailwind, React, Next.js, Vue, SwiftUI, Flutter, …)
3. **Surface** — landing page, dashboard, mobile app, onboarding flow, or specific component?

Do not default to "SaaS dashboard" when the product is a wellness app. The wrong category produces the wrong palette, wrong typography, and wrong anti-patterns list.

---

## Step 2 — Generate the design system

Run the reasoning engine with the product description:

```bash
# ASCII output (default — easy to read inline)
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product description>" --design-system -p "<ProjectName>"

# Markdown output (easier to persist)
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product description>" --design-system -f markdown

# Domain-specific queries
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "elegant serif" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech" --domain color

# Stack-specific guidelines
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation" --stack react
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "responsive grid" --stack html-tailwind
```

The output delivers:
- **Pattern** — recommended landing page or app structure for the product type
- **Style** — matched UI style from 67 options (glassmorphism, minimalism, bento grid, etc.)
- **Colors** — named palette with hex values aligned to the industry
- **Typography** — font pairing with Google Fonts URL
- **Key effects** — animation and interaction recommendations
- **Anti-patterns** — what NOT to build for this product type
- **Pre-delivery checklist** — pass/fail gates before shipping

---

## Step 3 — Persist and use the design system

For projects with multiple pages, persist the system to files:

```bash
# Generate and save to design-system/MASTER.md
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<description>" --design-system --persist -p "<ProjectName>"

# Page-specific override
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<description>" --design-system --persist -p "<ProjectName>" --page "<page-name>"
```

This produces:
```text
design-system/
├── MASTER.md           # Global source of truth
└── pages/
    └── <page>.md       # Page-specific overrides (only deviations from Master)
```

On every subsequent request that touches UI, load context this way:

```text
I am building the [Page Name] page.
Read design-system/MASTER.md.
Check if design-system/pages/[page-name].md exists — if it does, its rules override Master.
Now generate the code.
```

---

## Step 4 — Apply the pre-delivery checklist

The reasoning engine outputs a checklist. Every item is a binary pass/fail gate — not a suggestion.

Standard gates present on every output:
```text
[ ] No emojis used as icons — SVG only (Heroicons/Lucide)
[ ] cursor-pointer on all clickable elements
[ ] Hover states with smooth transitions (150–300ms)
[ ] Text contrast ≥ 4.5:1 in light mode
[ ] Focus states visible for keyboard navigation
[ ] prefers-reduced-motion honored
[ ] Responsive tested at 375px / 768px / 1024px / 1440px
```

Reject any component that fails a checklist item. Fix the failure before shipping.

---

## What the 161 reasoning rules do

Each rule encodes industry-specific design norms:

- **Tech/SaaS** → glass or minimal, cool palette, Inter or Geist, avoid skeuomorphism
- **Healthcare** → accessible, WCAG AA mandatory, no dark mode as default, trust-first typography
- **Banking/Fintech** → no AI purple/pink gradients, data-dense layouts, precision over decoration
- **Wellness/Spa** → soft shadows, calming palette, organic shapes, no harsh animations
- **Gaming** → dark mode default, vibrant palette, motion-driven, Cyberpunk or HUD styles acceptable
- **Gen Z / Lifestyle** → Y2K, neubrutalism, or maximalism acceptable; Inter is actively discouraged

---

## Style quick-reference (67 available)

Consult this when the product type is clear but the style is not:

| If the product is… | Consider… |
| --- | --- |
| SaaS dashboard | Minimalism, Glassmorphism, Bento Grid |
| AI / Copilot tool | AI-Native UI, Zero Interface |
| Wellness / meditation | Neumorphism, Soft UI Evolution, Organic Biophilic |
| E-commerce (premium) | Liquid Glass, Skeuomorphism, 3D Product Preview |
| Creative portfolio | Brutalism, Motion-Driven, Anti-Polish, Interactive Cursor |
| Fintech | Flat Design, Swiss Modernism 2.0, Data-Dense Dashboard |
| Gaming | Dark Mode OLED, Cyberpunk UI, HUD/Sci-Fi FUI |
| Gen Z brand | Y2K Aesthetic, Neubrutalism, Gen Z Chaos / Maximalism |

---

End your UI/UX PRO MAX pass with:

```text
Product type identified:
Stack:
Surface:
Design system generated: yes/no
Style matched:
Colors (primary / secondary / CTA / background):
Typography:
Anti-patterns to avoid:
Checklist status:
```
