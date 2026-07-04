---
name: interface-design
description: Use when a task changes how a feature looks, feels, moves, or is interacted with — building or reviewing UI, layout, components, color, type, or motion. Skip for pure backend, API, DB, or DevOps work.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# INTERFACE framework

Apply INTERFACE when you build or change a visual interface. If `$ARGUMENTS` is present, treat it as the surface to design or critique: `$ARGUMENTS`.

Design against rules, not taste. Each rule below has a testable pass condition. When a rule fails, fix it before moving on. Work the checks in order — the earliest ones cause the most user harm.

## I - Inclusive by default
- Body text contrast is at least 4.5:1; large text and UI glyphs at least 3:1. Reject gray-on-gray.
- Every control is keyboard reachable and shows a visible focus ring. Never remove the outline without replacing it.
- Meaning is never carried by color alone — pair it with text, icon, or shape.
- Interactive images and icons have accessible names; decorative ones are hidden from assistive tech.

## N - Nail the touch and pointer targets
- Interactive targets are at least 44×44px (iOS) / 48×48dp (Android), with 8px minimum spacing between them.
- Hover is never the only way to reach an action — it must also work on touch and keyboard.
- Every action gives immediate feedback: pressed, loading, disabled, success, error. No dead clicks.
- Press states use color, opacity, or elevation — never a layout shift that moves neighboring content.

## T - Type and space on a scale
- Body text is at least 16px with line-height 1.5; line length stays 45–75 characters.
- Font sizes come from one type scale (e.g. 12 14 16 18 24 32 48), not arbitrary values.
- Spacing comes from one 4px/8px step scale. No magic numbers between elements.
- Headings, body, and labels use a deliberate weight hierarchy (e.g. 600 / 400 / 500), not random bolding.

## E - Employ semantic tokens, not raw values
- Color, spacing, radius, and shadow are referenced as named tokens (primary, surface, on-surface, danger), never hard-coded hex sprinkled through components.
- Dark mode uses desaturated tonal variants, not naively inverted colors, and is contrast-checked on its own.
- One icon set, one stroke width. Vector only — no emoji standing in for icons.
- State colors (success, warning, danger, info) are defined once and reused everywhere.

## R - Respect motion and reduced-motion
- Micro-interactions run 150–300ms; larger transitions stay under 400ms. Nothing important animates longer than 500ms.
- Animate transform and opacity, not layout properties that trigger reflow.
- Motion conveys meaning (origin, direction, hierarchy) — never decoration for its own sake.
- Honor `prefers-reduced-motion`: replace movement with instant or fade transitions.

## F - Forms and feedback that recover
- Every field has a visible, persistent label — placeholder text is not a label.
- Validate on blur and on submit; show errors inline, next to the field, in text plus color, with `aria-live` for screen readers.
- Use the correct input type and autocomplete so keyboards and password managers work.
- After a failed submit, move focus to the first invalid field. Preserve entered data.

## A - Anchor layout to breakpoints and safe areas
- Design mobile-first; verify at systematic breakpoints (e.g. 375 / 768 / 1024 / 1440) with no horizontal scroll.
- Reserve space for images and async content to keep cumulative layout shift under 0.1.
- Respect device safe areas and prefer `min-h-dvh` over `100vh` on mobile.
- Constrain content width for readability; don't let text run the full width of a wide viewport.

## Pre-delivery checklist

Before you call a UI done, confirm each line:

```text
Contrast: body ≥4.5:1, large/UI ≥3:1 — pass?
Focus: every control keyboard-reachable with a visible ring — pass?
Targets: ≥44px, ≥8px apart, feedback on every action — pass?
Type & space: one type scale, one spacing scale — pass?
Tokens: semantic tokens, no raw hex in components — pass?
Dark mode: contrast re-checked, not inverted — pass?
Motion: 150–400ms, reduced-motion honored — pass?
Forms: visible labels, inline errors, focus-to-error — pass?
Layout: no horizontal scroll, CLS < 0.1, safe areas — pass?
```

If any line fails, fix it before shipping. If a rule genuinely does not apply to this surface, say so and why — do not skip it silently.
