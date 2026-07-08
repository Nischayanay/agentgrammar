---
name: vercel-web-design
description: Use when reviewing UI code or auditing any web interface. Applies 100+ Vercel Engineering rules across 11 categories: accessibility, focus, forms, animation, typography, images, performance, navigation, dark mode, touch, and i18n.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# WEB DESIGN AUDIT framework

Apply WEB DESIGN AUDIT when building or reviewing any web interface. If `$ARGUMENTS` is present, treat it as the component, page, or feature to audit: `$ARGUMENTS`.

Work each category in order — Accessibility and Focus first, i18n last. Flag every failure before proposing fixes so the full picture is visible before changes begin.

---

## A - Accessibility

- Every interactive element has an accessible name: buttons have text or `aria-label`, images have `alt`, icons used as controls have `aria-label` or `aria-labelledby`.
- Semantic HTML over `<div>` soup: use `<button>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>` for their semantic roles.
- Heading hierarchy is sequential: never skip from `<h1>` to `<h3>`.
- `aria-live` regions present for dynamic content updates (toasts, status messages, validation errors).
- Color contrast: body text ≥ 4.5:1, large text and UI components ≥ 3:1. Never rely on color alone to convey meaning.

## F - Focus states

- Every focusable element has a visible focus ring. `outline: none` without a replacement is a blocker.
- Use `:focus-visible` not `:focus` for mouse-free focus styling — this shows rings for keyboard users without affecting mouse clicks.
- Focus order follows the visual reading order of the page.
- Modal dialogs trap focus inside while open and restore focus to the trigger element on close.

## F - Forms

- Every input has a visible, persistent `<label>` linked via `for`/`id` or wrapping — placeholder text is not a label.
- Inputs have correct `type`: `email`, `tel`, `number`, `password`, `search` — not `type="text"` for everything.
- `autocomplete` attributes set correctly: `autocomplete="email"`, `autocomplete="current-password"`, etc.
- Validation fires on blur for single fields; on submit for the whole form.
- Error messages are inline, next to the field, in text (not color alone), with `aria-describedby` or `aria-live`.
- On failed submit, focus moves to the first invalid field. User-entered data is preserved.
- Submit buttons are disabled only when the form is actively submitting — not as a pre-validation technique.

## A - Animation

- Transitions use `transform` and `opacity` — never `width`, `height`, `top`, `left` or other layout properties that trigger reflow.
- Duration: micro-interactions 150–200ms, page transitions 250–350ms. Nothing important over 500ms.
- `prefers-reduced-motion` is honoured: replace movement with instant or fade-only transitions.
- No `animation: infinite` on decorative elements without a pause mechanism.
- Easing: `ease-out` for elements entering, `ease-in` for elements leaving. No bounce or elastic easing in product UI.

## T - Typography

- Use curly/smart quotes (`"` `"` `'` `'`) not straight quotes in prose.
- Use proper ellipsis (`…`) not three dots (`...`) in prose.
- Use en dash (`–`) for ranges and em dash (`—`) for parenthetical breaks — not hyphens.
- Tabular numbers (`font-variant-numeric: tabular-nums`) for any column of numbers that must align.
- Line length: 45–75 characters for body text. Constrain with `max-width`, not `width`.
- Line height: 1.5 for body text, 1.2–1.3 for headings.

## I - Images

- Every `<img>` has a meaningful `alt` (empty `alt=""` only for decorative images).
- `width` and `height` attributes on all images to prevent layout shift (CLS < 0.1).
- Lazy-load below-the-fold images: `loading="lazy"` or `next/image`.
- Responsive images: use `srcset` and `sizes` so the browser requests the correct resolution.
- Use `next/image` (or equivalent framework image component) for automatic format selection (WebP/AVIF) and resizing.
- No images for text — use real text with CSS styling.

## P - Performance

- Virtualise lists over ~100 items (`@tanstack/react-virtual`, `react-window`).
- Avoid layout thrashing: do not read layout properties (offsetWidth, getBoundingClientRect) inside loops or immediately after style writes.
- Use `preconnect` for critical third-party origins (fonts, analytics, CDN) in `<head>`.
- Remove unused CSS — do not ship entire CSS frameworks when only 10% is used.
- Avoid synchronous operations in scroll and resize event handlers — debounce or use passive listeners.

## N - Navigation and state

- URL reflects the application state: filters, pagination, selected items, open modals (where appropriate) should be in the URL.
- Back button works as expected — browser history is not broken by state changes.
- Deep links work: sharing a URL lands the user in the correct state without extra steps.
- Active navigation items are marked with `aria-current="page"` for screen readers.

## D - Dark mode and theming

- Use `color-scheme: dark` in CSS and `<meta name="color-scheme" content="dark light">` in `<head>` so the browser native controls match.
- Check all color contrast ratios independently in dark mode — do not assume light-mode ratios hold when colors are inverted.
- `prefers-color-scheme` media query or CSS custom properties with a `[data-theme]` attribute — not two separate stylesheets.
- `<meta name="theme-color">` set for browser chrome theming on mobile.

## T - Touch and interaction

- Interactive targets ≥ 44×44px (iOS HIG) / 48×48dp (Android Material).
- Minimum 8px spacing between adjacent interactive targets.
- `-webkit-tap-highlight-color: transparent` for custom-styled controls that already have visible press states.
- `touch-action` set correctly on draggable elements to avoid browser scroll interference.
- Hover is never the only way to reach information or an action.

## I - Internationalisation (i18n)

- Use `Intl.DateTimeFormat` for date/time display — never hardcode locale-specific formats.
- Use `Intl.NumberFormat` for numbers, currencies, and percentages.
- Use `Intl.RelativeTimeFormat` for relative time strings ("3 hours ago").
- `lang` attribute set correctly on `<html>` and on any inline foreign-language content.
- Text containers do not assume fixed width — translated text expands by 30–50% in many languages.
- LTR/RTL: use `dir="auto"` or explicit `dir` attribute; use logical CSS properties (`margin-inline-start`) not physical (`margin-left`).

---

## Audit checklist

```text
[ ] Accessibility: semantic HTML, accessible names, heading order, aria-live, contrast
[ ] Focus: visible focus ring, :focus-visible, correct focus order, modal trap
[ ] Forms: visible labels, correct input types, autocomplete, inline errors, focus-on-error
[ ] Animation: transform/opacity only, ≤500ms, prefers-reduced-motion honoured
[ ] Typography: smart quotes, ellipsis, tabular nums, 45-75ch line length
[ ] Images: alt text, width/height, lazy-load, responsive srcset
[ ] Performance: lists virtualised, no layout thrashing, preconnect for third parties
[ ] Navigation: URL reflects state, back button works, aria-current
[ ] Dark mode: color-scheme meta, contrast rechecked, theme-color meta
[ ] Touch: ≥44px targets, ≥8px spacing, touch-action, no hover-only actions
[ ] i18n: Intl APIs for dates/numbers, lang attr, logical CSS props
```

End your web design audit pass with:

```text
Component / page reviewed:
Failures found:
Critical (fix before ship):
Non-critical (fix in follow-up):
```
