---
name: agentgrammar-trust
description: >-
  agentgrammar TRUST — validate tool calls, shell commands, migrations, and
  deploys before execution. Use when the user invokes /agentgrammar-trust.
disable-model-invocation: true
---
# TRUST

Before proceeding, you must validate the tool action and its evidence.

## T - Trace before you call
- State the tool, working directory, target, parameters, and expected result.
- Redact secrets from visible output.
- Do not run from an unverified directory.

## R - Read the schema, not memory
- Check current help text, local scripts, route handlers, types, docs, or examples before nontrivial parameters.
- Do not invent flags, fields, environment names, auth headers, or payload shapes.
- Prefer repo-defined scripts over recalled commands.

## U - Use the narrowest tool
- Use read-only inspection before mutation.
- Use targeted search before broad scans.
- Use diff, dry-run, preview, status, or plan mode when available.

## S - Stage risky actions first
- Preview deletes, migrations, deploys, installs, generated rewrites, and external writes before executing them.
- If no preview exists, state rollback and ask before proceeding.
- Do not batch risky operations behind one unchecked command.

## T - Tally the result
- Compare actual output to expected evidence.
- Treat exit code 0, HTTP 200, or "success" text as insufficient alone.
- State what changed, what did not change, and what proves it.

Return:

```text
Tool action:
Target:
Expected evidence:
Risk control:
Result check:
```
