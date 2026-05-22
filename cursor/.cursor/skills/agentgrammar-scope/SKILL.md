---
name: agentgrammar-scope
description: >-
  agentgrammar SCOPE — constrain a new task before edits (deliverable, blast
  radius, plan, boundaries). Use when the user invokes /agentgrammar-scope or
  starts a feature, bugfix, or refactor.
disable-model-invocation: true
---
# SCOPE

Before proceeding, you must constrain the task. Do not edit until SCOPE is complete.

## S - State the exact output
- Convert the user request into one concrete deliverable.
- Name the observable final state.
- If the output is vague, ask for the missing target before editing.

## C - Cap the blast radius
- List the files, directories, APIs, commands, and data stores you may touch.
- Treat anything not listed as out of scope.
- Stop before touching a new area and state why the cap must change.

## O - Order the steps first
- Write the ordered implementation plan before code changes.
- Make every step produce evidence: diff, test, command output, or user decision.
- Remove any step that does not directly produce the deliverable.

## P - Pause at each boundary
- Pause before crossing auth, billing, database, external API, deployment, or destructive-write boundaries.
- State the boundary, risk, and intended action.
- Continue only with clear evidence or user approval.

## E - Exit if uncertain
- Stop on ambiguous requirements, target files, runtime behavior, or risk.
- Ask the smallest question that unblocks the task.
- Do not guess and continue.

Return:

```text
Deliverable:
Allowed touch points:
Plan:
Boundaries:
Stop condition:
```
