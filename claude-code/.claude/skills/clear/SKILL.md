---
name: clear
description: Use during long, redirected, or multi-turn coding tasks when stale context, conflicting requirements, or drifting plans may affect the next action.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# CLEAR framework

Apply CLEAR before continuing a long or drift-prone task. If `$ARGUMENTS` is present, use it as the current task focus: `$ARGUMENTS`.

You must refresh context before the next edit:

## C - Compress the history
- Write a state block with only completed actions, current diffs, user decisions, and verified command results.
- Remove narrative, speculation, and abandoned plans.
- Mark every unverified claim as unverified.

## L - Load only what this step needs
- Identify the exact files, symbols, logs, or test outputs needed for the next action.
- Read those sources before editing.
- Do not load unrelated code to compensate for uncertainty.

## E - Echo the goal at every call
- Restate the current goal before each tool call or edit.
- Include the success condition for that immediate step.
- If the goal has changed, replace the old goal instead of merging both.

## A - Anchor to a memory file
- Use an existing project note, task file, issue, test, or user message as the source of truth when available.
- If no anchor exists and the task is long-running, create or update a concise markdown state note only when it helps the next turn.
- Read the anchor before resuming after interruption.

## R - Reset on drift signals
- Reset context when output no longer matches the plan, tests fail unexpectedly, files differ from assumptions, or the user changes direction.
- Rebuild the next step from verified state only.
- Do not patch around drift without naming the failed assumption.

End your clear pass with:

```text
Current goal:
Verified state:
Loaded context:
Dropped assumptions:
Next action:
```
