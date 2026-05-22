---
name: agentgrammar-clear
description: >-
  agentgrammar CLEAR — rebuild context from verified state after long sessions,
  interruptions, or redirects. Use when the user invokes /agentgrammar-clear.
disable-model-invocation: true
---
# CLEAR

Before proceeding, you must rebuild working context from verified state only.

## C - Compress the history
- Summarize completed actions, current diffs, user decisions, and verified command results.
- Remove abandoned plans and speculation.
- Mark every unverified claim as unverified.

## L - Load only what this step needs
- Identify the exact files, symbols, logs, or tests required for the next action.
- Read those sources before editing.
- Do not load unrelated code to compensate for uncertainty.

## E - Echo the goal at every action
- Restate the current goal before tool calls or edits.
- Include the success condition for that immediate step.
- Replace old goals when the user changes direction.

## A - Anchor to source of truth
- Use the latest user message, issue, task file, test, or project note as the anchor.
- Re-read the anchor after interruption or context shift.
- If no anchor exists, state the current anchor as the latest verified request.

## R - Reset on drift signals
- Reset when output diverges from plan, tests fail unexpectedly, files differ from assumptions, or requirements conflict.
- Name the failed assumption.
- Continue only from verified state.

Return:

```text
Current goal:
Verified state:
Loaded context:
Dropped assumptions:
Next action:
```
