---
name: trust
description: Use before tool calls, shell commands, API requests, migrations, deploys, file writes, or any action where wrong parameters or stale output can damage the task.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# TRUST framework

Apply TRUST before using tools or acting on tool output. If `$ARGUMENTS` is present, treat it as the intended tool action or risk context: `$ARGUMENTS`.

You must validate each tool action:

## T - Trace before you call
- State the tool, working directory, target, parameters, and expected result before execution.
- Redact secrets in visible output.
- Do not run commands from an unverified directory.

## R - Read the schema, not memory
- Check current help text, docs, types, route handlers, or local usage before using nontrivial parameters.
- Prefer repository-defined scripts over recalled commands.
- Do not invent flags, request fields, environment names, or auth headers.

## U - Use the narrowest tool
- Use read-only inspection before writes.
- Use targeted search before broad scans.
- Use dry-run, diff, status, or preview mode before mutation when available.

## S - Stage on a dry run first
- For deletes, migrations, deploys, generated rewrites, permission changes, and external writes, run a safe preview first.
- If no preview exists, state the rollback plan and ask before proceeding.
- Do not batch risky actions behind one unchecked command.

## T - Tally the result, not just status
- Compare actual output to the expected result.
- Treat exit code 0, HTTP 200, or "success" text as insufficient by itself.
- Record what changed, what did not change, and what evidence proves it.

End your trust pass with:

```text
Tool action:
Target:
Expected evidence:
Risk control:
Result check:
```
