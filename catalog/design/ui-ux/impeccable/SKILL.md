---
name: impeccable
description: Use when any task builds or changes a visual interface. Run /impeccable init once per project to lock design context, then use the 23-command vocabulary for every design decision. Requires impeccable (npx impeccable install).
allowed-tools: Read, Write, Glob, Grep, Bash
---
# IMPECCABLE framework

Apply IMPECCABLE for every visual surface. If `$ARGUMENTS` is present, treat it as the target surface or command: `$ARGUMENTS`.

Install once per project: `npx impeccable install`. Reload your IDE after install.

## One-time project setup (do this first)

```text
/impeccable init
```

`init` asks whether the surface is brand (marketing, landing, portfolio) or product (app, dashboard, tool), then writes `PRODUCT.md` and `DESIGN.md` — the design context every later command reads. Skip `init` and every command works blind.

---

## The 23-command vocabulary

Use the command that matches what the current step actually needs. Do not reach for `craft` on every task — each command is scoped to a specific design concern.

### Foundation
| Command | When to use |
| --- | --- |
| `/impeccable init` | First run on a new project — writes design context |
| `/impeccable document` | Generate `DESIGN.md` from existing project code |
| `/impeccable extract` | Pull reusable components and tokens into the design system |

### Build
| Command | When to use |
| --- | --- |
| `/impeccable shape` | Plan UX/UI structure before writing any code |
| `/impeccable craft` | Full shape-then-build flow with live browser iteration |
| `/impeccable live` | Iterate on a specific element visually in the browser |

### Review & fix
| Command | When to use |
| --- | --- |
| `/impeccable audit` | Technical quality: a11y, performance, responsive |
| `/impeccable critique` | UX design review: hierarchy, clarity, emotional resonance |
| `/impeccable polish` | Final pass: design system alignment, shipping readiness |
| `/impeccable harden` | Error handling, i18n, text overflow, edge cases |

### Tune the aesthetic
| Command | When to use |
| --- | --- |
| `/impeccable bolder` | Amplify a design that feels weak or timid |
| `/impeccable quieter` | Tone down a design that is too loud |
| `/impeccable distill` | Strip to essence — remove everything non-essential |
| `/impeccable colorize` | Introduce strategic color |
| `/impeccable typeset` | Fix font choices, hierarchy, sizing |
| `/impeccable layout` | Fix layout, spacing, visual rhythm |
| `/impeccable animate` | Add purposeful motion |
| `/impeccable delight` | Add moments of joy |
| `/impeccable overdrive` | Add technically extraordinary effects |

### Flow & copy
| Command | When to use |
| --- | --- |
| `/impeccable onboard` | First-run flows, empty states, activation paths |
| `/impeccable clarify` | Improve unclear UX copy |
| `/impeccable adapt` | Adapt for different devices or screen sizes |
| `/impeccable optimize` | Performance improvements |

---

## The 45 detector rules (enforced automatically via hooks)

After `npx impeccable install`, a hook fires on every direct UI file edit and surfaces detector findings before or after the write depending on your IDE. Findings are deterministic — no LLM, no API key.

**AI-slop category (highest signal):**
- Overused fonts: Arial, Inter, system-ui as the only font choice
- Purple-to-blue gradients used as primary visual identity
- Dark glows and drop shadows as a default decoration
- Bounce / elastic easing on UI transitions
- Side-tab left borders as the sole active-state indicator
- Cards nested inside cards with no hierarchy purpose

**General quality category:**
- Line length over 75ch without constraint
- Touch targets under 44px
- Cramped padding (less than 8px between interactive elements)
- Skipped heading levels (h1 → h3, no h2)
- Gray text on a colored background below 4.5:1 contrast
- Missing focus rings on interactive elements

Run the detector standalone on any file, directory, or URL:
```bash
npx impeccable detect src/components/         # scan a directory
npx impeccable detect https://your-staging-url # scan a live URL
npx impeccable detect --json src/ | jq .       # CI-friendly output
```

Suppress a rule for a legitimate exception with an inline comment:
```html
<!-- impeccable-disable overused-font: brand-mandated Inter -->
```

---

## Anti-patterns to reject on every surface

Never accept these without a documented exception:

- Pure black (`#000`) or pure gray (`#888`) with no color tint
- Placeholder text used as a field label (it disappears on focus)
- "Improve", "enhance", or "make better" as a design brief — demand a concrete, testable deliverable
- Emojis as icons — use SVG (Heroicons, Lucide) instead
- Hard-coded hex values outside a token system
- `transition: all` — always scope to specific properties

---

## Pin your most-used commands

```text
/impeccable pin audit       → creates /audit as a standalone shortcut
/impeccable pin polish      → creates /polish
```

End your impeccable pass with:

```text
Surface:
Command used:
Detector findings:
Design context (PRODUCT.md / DESIGN.md loaded):
Remaining issues:
```
