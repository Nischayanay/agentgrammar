# agentgrammar

agentgrammar is a compact set of operating frameworks for AI coding agents. Use it to contain scope, refresh stale context, verify tool use, prove logic, and gate multi-step work before small errors turn into production failures.

## Active frameworks

### SCOPE

Use SCOPE to prevent task expansion before editing.

- S - State the exact output: reduce the request to one concrete deliverable and one observable end state.
- C - Cap the blast radius: list the files, directories, APIs, commands, and data stores you may touch; treat everything else as out of scope.
- O - Order the steps first: write the implementation sequence before code changes; every step must produce evidence.
- P - Pause at each boundary: stop before auth, billing, database, external API, deployment, migration, or destructive-write boundaries and state the risk.
- E - Exit if uncertain: ask the smallest blocking question when requirements, targets, runtime behavior, or risk are ambiguous.

### CLEAR

Use CLEAR to remove stale assumptions during long or redirected work.

- C - Compress the history: keep only completed actions, current diffs, user decisions, and verified command results.
- L - Load only what this step needs: read the exact files, symbols, logs, or tests required for the next action.
- E - Echo the goal at every action: restate the current objective and immediate success condition before tool calls or edits.
- A - Anchor to source of truth: bind the run to the latest user message, issue, task file, test, or project note.
- R - Reset on drift signals: rebuild from verified state when output diverges, tests fail unexpectedly, files contradict assumptions, or requirements conflict.

### TRUST

Use TRUST to prevent tool misuse and bad evidence.

- T - Trace before you call: state the tool, working directory, target, parameters, and expected result.
- R - Read the schema, not memory: check current help, local scripts, types, routes, docs, or examples before nontrivial parameters.
- U - Use the narrowest tool: inspect read-only first; prefer targeted search, diff, dry-run, preview, status, or plan modes.
- S - Stage risky actions first: preview deletes, migrations, deploys, installs, generated rewrites, permission changes, and external writes.
- T - Tally the result: compare actual output to expected evidence; do not accept exit code 0, HTTP 200, or success text alone.

### LOGIC

Use LOGIC to verify generated code beyond happy-path plausibility.

- L - List the happy path: write the expected flow in order and map each step to the implementing code path.
- O - Own the edge cases: check null, empty, missing, duplicate, malformed, expired, unauthorized, slow, failed, concurrent, and retried inputs.
- G - Gate with verification: run the narrowest relevant test, type check, or command; add focused coverage when the repo pattern exists.
- I - Inspect control flow: trace affected branches, returns, throws, cleanup, loading states, error states, validation, auth, persistence, and telemetry.
- C - Compare against the spec: match final behavior to the user request and existing contract; reject unrelated improvements.

### GUARD

Use GUARD to stop cascading failures in multi-step runs.

- G - Gate each step: define one next action and its pass/fail evidence before running it.
- U - Undo path first: identify rollback through diffs, backups, down migrations, feature flags, or revert commands before mutation.
- A - Abort on bad signal: stop on unexpected diffs, failed tests, missing files, partial installs, schema mismatches, or unclear output.
- R - Record each action: log command, target, result, and next gate in the conversation or task note.
- D - Domain context every step: include current repo constraints, runtime, data model, business rule, or user boundary before each gated action.

## When to apply

| Framework | Trigger condition |
| --- | --- |
| SCOPE | A new task, feature, bugfix, refactor, or user request begins and the edit boundary is not yet explicit. |
| CLEAR | The task is long-running, interrupted, redirected, conflicting, or based on assumptions that may be stale. |
| TRUST | You are about to run a command, call an API, write files, install dependencies, migrate, deploy, or trust tool output. |
| LOGIC | You changed or reviewed behavior that depends on branches, state, data contracts, error paths, or tests. |
| GUARD | The work has multiple dependent steps, destructive operations, external side effects, deployment risk, or recovery work. |
