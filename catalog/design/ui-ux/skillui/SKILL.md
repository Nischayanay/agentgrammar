---
name: skillui
description: Use before building UI that must match an existing visual reference — a live site, git repo, or local codebase. Requires skillui CLI (npm install -g skillui). Extracts the complete design system so the agent builds with exact tokens, not guesses.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# SKILLUI framework

Apply SKILLUI before writing any UI code when there is a reference design to match. If `$ARGUMENTS` is present, treat it as the target URL, repo, or local path: `$ARGUMENTS`.

Install once: `npm install -g skillui`. For ultra mode (visual screenshots + animations): `npm install playwright && npx playwright install chromium`.

Work the gates in order — the output of each one feeds the next.

## S - Source the reference correctly
- Choose the extraction mode that matches where the reference lives:
  - Live URL: `skillui --url <url>` (default static) or `skillui --url <url> --mode ultra` (visual + animation)
  - Local project: `skillui --dir ./path`
  - Public repo: `skillui --repo <github-url>`
- Use `--mode ultra` only when you need scroll screenshots, hover states, or animation keyframes — it requires Playwright and is slower.
- Set `--out ./design-systems/<name>` to keep multiple references organized.

```bash
# Match a live site (static — fast, no Playwright needed)
skillui --url https://linear.app --out ./design-systems/linear

# Match a live site (ultra — screenshots + animations)
skillui --url https://linear.app --mode ultra --screens 7 --out ./design-systems/linear

# Scan a local Next.js project for existing tokens
skillui --dir ./apps/web --name "MyApp"
```

## K - Know what was extracted before writing code
- Read `SKILL.md` in the output folder — it is the master skill file Claude loads automatically when you `cd <output> && claude`.
- Read `DESIGN.md` for the full token inventory: colors, type scale, spacing grid, component patterns.
- Check `tokens/colors.json`, `tokens/typography.json`, `tokens/spacing.json` for machine-readable values.
- In ultra mode, read `references/ANIMATIONS.md` for keyframes and timing before writing any CSS transitions.

## I - Inject only what this component needs
- Load the relevant token files before generating a component — do not paste the entire DESIGN.md into every prompt.
- Pull the exact hex values from `tokens/colors.json` rather than approximating from a screenshot.
- Reference `references/COMPONENTS.md` to identify recurring DOM patterns before inventing new structure.

## L - Lock the token contract
- Map every color, spacing value, and font weight in the new component to a named token from the extraction.
- Reject magic numbers — if a value does not appear in the token files, flag it and ask.
- When the reference uses CSS variables, propagate the same variable names to the new code.

## L - Lift visual fidelity with ultra artifacts (when extracted)
- Use `references/VISUAL_GUIDE.md` scroll screenshots as the ground truth for section layout and density.
- Use `references/INTERACTIONS.md` hover/focus diffs to match interactive states precisely.
- Match animation timing from `references/ANIMATIONS.md` — do not substitute generic `transition: all 0.3s`.

## U - Update the extraction when the reference changes
- Re-run `skillui --url <url>` whenever the reference site ships a significant visual update.
- Diff `tokens/colors.json` between runs to surface token drift before it reaches the component.
- Do not cache the extraction for more than one sprint on a fast-moving reference.

## I - Integrate the .skill ZIP for team sharing
- Commit the `<name>.skill` ZIP (not the expanded folder) for teammates who work on the same reference.
- Unzip with `unzip <name>.skill -d <name>-design` to restore the full extraction.

End your skillui pass with:

```text
Reference source:
Extraction mode used:
Key tokens loaded (colors / type / spacing):
Component-to-token mapping:
Drift risks:
```
