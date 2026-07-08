---
name: playwright-cli
description: Use when a task requires browser automation, end-to-end testing, screenshot capture, or verifying live page behavior. Requires playwright-cli (npm install -g @playwright/cli@latest).
allowed-tools: Read, Write, Glob, Grep, Bash
---
# PLAYWRIGHT framework

Apply PLAYWRIGHT before browser-dependent verification or when the agent must interact with a live page. If `$ARGUMENTS` is present, treat it as the URL, flow, or test scenario: `$ARGUMENTS`.

Install once per machine: `npm install -g @playwright/cli@latest` then `playwright-cli install --skills`.

Work through the gates in order — each one produces evidence the next gate reads.

## P - Plan the flow before opening a browser
- Write the user journey as numbered steps: start URL → actions → success condition.
- Name the observable success signal (DOM element text, URL path, screenshot region, HTTP status).
- Do not open a browser until the plan is explicit — guessing costs context tokens.

## L - Launch with the narrowest scope
- Use `playwright-cli open <url>` to start; add `--headed` only when debugging visual issues.
- Use a named session (`-s=<name>`) when the flow spans multiple turns or requires preserved auth state.
- Prefer `playwright-cli snapshot` over `playwright-cli screenshot` as the first step — snapshots give element refs at a fraction of the token cost.

## A - Act on refs, not guesses
- Always run `playwright-cli snapshot` before clicking, filling, or checking to get current element refs.
- Target elements by `e<ref>` from the snapshot, then CSS selector, then `role=<role>[name=<text>]` — in that order.
- Never hard-code a ref across turns; they change when the DOM changes.

```text
# Correct targeting sequence
playwright-cli snapshot                          # get live refs
playwright-cli click e21                         # use the ref
playwright-cli fill e34 "user@example.com"
playwright-cli press Enter
```

## Y - Yield evidence at every step
- After each action capture a snapshot or screenshot and compare it to the expected state.
- Record: command → expected → actual → pass/fail.
- Treat exit-code 0 as necessary but not sufficient — verify the DOM or URL changed as expected.

## W - Watch for failure signals early
- Abort the flow if a step produces an unexpected URL, error text, missing element, or network failure.
- Name the failed step, the evidence, and the next action (fix, retry, escalate) — do not silently continue.
- Use `playwright-cli requests` to inspect network calls when a UI state is wrong but no visible error appears.

## R - Record for CI and regression
- After a verified flow succeeds, output a `playwright-cli` command sequence that can run headlessly in CI.
- Use `playwright-cli state-save` to checkpoint authenticated sessions instead of re-running login flows.
- For visual regressions, name the reference screenshot and the comparison command.

```text
# CI-ready command sequence (output at end of a verified flow)
playwright-cli goto https://example.com/login
playwright-cli fill e12 "user@example.com"
playwright-cli fill e14 "password"
playwright-cli click e16
playwright-cli snapshot --filename=post-login.yml
```

## Token-efficiency rules
- Use `playwright-cli snapshot` (YAML, compact) instead of `playwright-cli screenshot` (binary, large) when you only need element structure.
- Close the browser with `playwright-cli close` when the flow is complete to free the session.
- Use `--skills` once at install time so the agent reads skill docs, not the full CLI schema on every call.

## Core command reference

| Goal | Command |
| --- | --- |
| Navigate | `playwright-cli goto <url>` |
| Get element refs | `playwright-cli snapshot` |
| Click | `playwright-cli click <ref>` |
| Type (append) | `playwright-cli type "<text>"` |
| Fill (replace) | `playwright-cli fill <ref> "<text>"` |
| Assert presence | `playwright-cli snapshot` → grep for element |
| Screenshot | `playwright-cli screenshot` |
| Network log | `playwright-cli requests` |
| Save auth state | `playwright-cli state-save auth.json` |
| Run headlessly | (omit `--headed`) |
| Monitor sessions | `playwright-cli show` |

End your playwright pass with:

```text
Flow:
Steps executed:
Evidence per step:
CI sequence:
Failure signals:
```
