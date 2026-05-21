# agentgrammar — universal

## What this is

agentgrammar is a small operating layer for AI coding agents. It gives the agent five compact checks for the failure modes that break real code work: uncontrolled scope, stale context, unsafe tool use, flawed logic, and compounding multi-step errors.

## How to use it

Paste this file into the system prompt, project instructions, `CLAUDE.md`, `.windsurfrules`, or any tool-level context field your coding agent reads. Tell the agent to choose the framework that matches the current task before it edits code, runs commands, calls APIs, deploys, or continues a long run.

## The 5 frameworks

### SCOPE

- S - State the exact output: turn the request into one deliverable.
- C - Cap the blast radius: name the files, APIs, commands, and data stores allowed for this task.
- O - Order the steps first: write the plan before the first edit.
- P - Pause at each boundary: stop before auth, billing, database, deploy, external API, or destructive-write actions.
- E - Exit if uncertain: ask when the target, requirement, or risk is unclear.

### CLEAR

- C - Compress the history: keep only verified actions, decisions, diffs, and command results.
- L - Load only what matters now: read the sources needed for the next move.
- E - Echo the goal: restate the current objective before acting.
- A - Anchor to truth: use the latest user request, issue, test, or project note as the reference point.
- R - Reset on drift: rebuild context when assumptions fail or requirements conflict.

### TRUST

- T - Trace the call: name the tool, directory, target, parameters, and expected evidence.
- R - Read current schema: check local help, scripts, docs, types, routes, or examples instead of memory.
- U - Use the narrowest option: inspect before writing and prefer preview modes.
- S - Stage risky work: dry-run deletes, migrations, deploys, installs, generated rewrites, and external writes.
- T - Tally real results: verify changed state, not just success status.

### LOGIC

- L - List the happy path: describe the intended flow step by step.
- O - Own edge cases: test null, empty, duplicate, malformed, expired, unauthorized, slow, failed, concurrent, and retried states.
- G - Gate with proof: run the smallest relevant test, type check, or manual trace.
- I - Inspect branches: follow returns, throws, cleanup, loading, error, validation, auth, persistence, and telemetry paths.
- C - Compare to spec: reject behavior that does not match the request or existing contract.

### GUARD

- G - Gate one step: define the next action and pass evidence before running it.
- U - Undo before mutation: identify rollback through diffs, backups, migrations, flags, or revert commands.
- A - Abort on bad signals: stop on failed tests, unexpected diffs, missing files, partial installs, schema mismatch, or unclear output.
- R - Record actions: keep command, target, result, and next gate visible.
- D - Domain context each step: carry repo constraints, runtime, data model, business rules, and user boundaries into each action.

## Quick reference card

```text
Framework | Trigger | What it prevents
SCOPE     | New task, feature, bugfix, or refactor | Scope creep and unrelated edits
CLEAR     | Long, interrupted, redirected, or stale-context task | Context rot and contradictory plans
TRUST     | Tool call, shell command, API request, write, install, deploy, or migration | Tool misuse and false evidence
LOGIC     | Behavior change, review, test, or generated implementation | Happy-path bugs and broken invariants
GUARD     | Multi-step, destructive, external, deployment, or recovery work | Cascading failures
```
