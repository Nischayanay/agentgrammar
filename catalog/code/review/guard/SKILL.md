---
name: guard
description: Use for multi-step refactors, migrations, dependency changes, deploys, bulk edits, or recovery work where one failed step can compound into larger damage.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# GUARD framework

Apply GUARD before and during multi-step work. If `$ARGUMENTS` is present, treat it as the guarded run objective: `$ARGUMENTS`.

You must gate each step:

## G - Gate each step, not just the end
- Define one next step only.
- Define its pass/fail evidence before running it.
- Do not start the following step until the current evidence passes.

## U - Undo path must exist first
- Identify how to reverse the step before any write, migration, deploy, install, or generated rewrite.
- Prefer version control diffs, backups, down migrations, feature flags, or revert commands.
- If no undo path exists, ask before proceeding.

## A - Abort on first bad signal
- Stop on unexpected diffs, failed tests, missing files, partial installs, schema mismatch, or unclear command output.
- Name the failed gate and the evidence.
- Do not continue with later steps while the failed gate is unresolved.

## R - Record every action as a log
- Keep a concise run log in the conversation or a task note when the run spans multiple risky steps.
- Record command, target, result, and next gate.
- Do not rely on memory for completed steps.

## D - Domain context in every prompt
- Include current repo constraints, runtime, data model, business rule, or user boundary before each gated action.
- Re-read the relevant source when the next gate depends on domain behavior.
- Do not apply generic fixes that violate local contracts.

End each guard gate with:

```text
Gate:
Undo path:
Pass evidence:
Result:
Next gate or stop:
```
