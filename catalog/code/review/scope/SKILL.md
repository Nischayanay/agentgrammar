---
name: scope
description: Use before implementation when the request could expand across files, features, services, or refactors beyond the user's stated task.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# SCOPE framework

Apply SCOPE before writing code. If `$ARGUMENTS` is present, treat it as the user's scoped task: `$ARGUMENTS`.

You must complete these checks before editing:

## S - State the exact output
- Convert the request into one concrete deliverable.
- Name the observable end state in one sentence.
- Reject goals like "improve", "clean up", or "make better" until they map to a deliverable.

## C - Cap the blast radius
- List the files, directories, commands, APIs, and data stores you may touch.
- Treat every unlisted area as off limits.
- If you discover required work outside the cap, stop and state the new boundary before editing it.

## O - Order the steps first
- Write the ordered plan before the first edit.
- Make each step produce evidence: file diff, command output, test result, or explicit user decision.
- Do not add steps that do not directly produce the deliverable.

## P - Pause at each boundary
- Pause before crossing service, database, auth, billing, deployment, migration, or destructive-write boundaries.
- State the boundary, risk, intended action, and required confirmation.
- Continue only after the boundary is resolved by evidence or user approval.

## E - Exit if uncertain
- Stop when the request, target file, runtime behavior, or risk boundary is ambiguous.
- Ask the smallest question that unblocks the task.
- Do not guess and continue.

End your scope pass with:

```text
Deliverable:
Allowed touch points:
Plan:
Boundaries:
Stop condition:
```
