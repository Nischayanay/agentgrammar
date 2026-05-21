# Contributing to agentgrammar

agentgrammar is small on purpose. Add rules only when they stop a real agent failure mode during coding work.

## Two ways to contribute

1. Add a new framework: a named acronym that teaches the agent one operating model.
2. Add a new tool: a native packaging of the existing frameworks for another coding agent.

## Adding a new framework

Create all four tool files:

```text
claude-code/.claude/skills/<name>/SKILL.md    # current Claude skill format, under 60 lines
cursor/.cursor/rules/<name>.mdc               # Cursor rule format, under 50 lines
codex/AGENTS.md                               # update the standing context, keep file under 120 lines
universal/agentgrammar.md                     # update the paste-in prompt, keep file under 80 lines
```

A framework acronym must:

- Spell a real word a developer can remember.
- Map to one failure mode, not a general virtue.
- Give every letter one concrete agent action.
- Use actions the agent can check: list, read, compare, stop, ask, run, verify, record.
- Avoid principle-only letters like "be careful", "think deeply", or "prefer quality".

Micro-example:

```text
Good: T - Trace before you call: state the tool, target, parameters, and expected result.
Bad:  T - Think carefully: use good judgment before tools.
```

Keep wording consistent across the four files. The syntax can change for each tool, but the letter meanings cannot.

## Adding a new tool

Research before writing:

- Activation model: always-on, explicit command, glob match, agent-requested, or paste-in context.
- File format: frontmatter, markdown, JSON, root config, folder convention.
- Context limits: line budget, token cost, and whether the file loads on every request.
- Install target: exact path developers expect inside their project or home directory.

Put tool files under a root folder named for the tool:

```text
<tool-name>/
```

Mirror the tool's native layout inside that folder. Examples already in this repo:

```text
claude-code/.claude/skills/scope/SKILL.md
cursor/.cursor/rules/scope.mdc
codex/AGENTS.md
universal/agentgrammar.md
```

Update `install.sh` with:

- A usage line for the tool.
- A case branch for the tool name.
- Conflict detection before overwriting target files.
- A copy test into a temp project before opening the PR.

## PR checklist

- [ ] The change targets one clear agent failure mode or one new tool.
- [ ] Every acronym letter is a concrete action.
- [ ] Claude skill files stay under 60 lines.
- [ ] Cursor rule files stay under 50 lines and use the right activation mode.
- [ ] `codex/AGENTS.md` stays under 120 lines.
- [ ] `universal/agentgrammar.md` stays under 80 lines.
- [ ] `bash -n install.sh` passes.
- [ ] Installer copy was verified in a throwaway directory.

## Naming rules

- Framework names are uppercase in prose: `SCOPE`, `CLEAR`, `TRUST`, `LOGIC`, `GUARD`.
- File and folder names are lowercase: `scope`, `scope.mdc`, `scope/SKILL.md`.
- Slash-style invocations use lowercase: `/scope`.
- Do not use broad names like `BETTER`, `SMART`, `QUALITY`, or `FOCUS`.
- If the name does not point to a specific failure mode, pick another name.

## What gets rejected

- Vague instructions the agent cannot literally execute or verify.
- Files that exceed the line budget for their tool.
- Cursor rules with the wrong activation mode or `alwaysApply: true` without a proven need.
- New frameworks that duplicate coverage already handled by SCOPE, CLEAR, TRUST, LOGIC, or GUARD.
- Install changes that were not tested in a clean target directory.
