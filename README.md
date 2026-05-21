<p align="left">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-111827.svg"></a>
  <img alt="Frameworks: 5" src="https://img.shields.io/badge/frameworks-5-111827.svg">
  <img alt="Tools: Claude Code, Cursor, Codex" src="https://img.shields.io/badge/tools-Claude%20Code%20%7C%20Cursor%20%7C%20Codex-111827.svg">
  <img alt="Status: early" src="https://img.shields.io/badge/status-early-111827.svg">
</p>

# agentgrammar

AI coding agents are useful until they are not.

The failure modes are no longer theoretical:

- They keep expanding the task after the original request was satisfied.
- They drag stale assumptions through long sessions and call it context.
- They use tools because a tool exists, not because the tool is correct.
- They produce code that looks plausible but breaks under simple logic checks.
- They continue multi-step runs after the first bad assumption and compound the damage.

`agentgrammar` is a framework library for AI coding agents. It gives agents explicit operating grammars for the work they already do: stay inside scope, refresh context, choose tools deliberately, check logic, and stop cascading failures before they reach production.

This is not a prompt pack for nicer answers. It is a set of reusable mental models and tool-specific command/rule files for agents that write, edit, review, and ship code.

## Frameworks

| Framework | Purpose |
| --- | --- |
| `SCOPE` | Stops the agent from doing more than the user asked. |
| `CLEAR` | Prevents context rot during long or multi-turn tasks. |
| `TRUST` | Enforces correct tool use before acting on tool output. |
| `LOGIC` | Catches reasoning and implementation errors before they ship. |
| `GUARD` | Gates multi-step runs so early mistakes do not compound. |

## Install

From inside this repo:

```bash
cd agentgrammar
```

Install the framework files for your agent tool from inside the project you want to improve:

### Claude Code

```bash
/path/to/agentgrammar/install.sh claude-code .
```

This copies skill files into:

```text
.claude/skills/
```

You can then use `/scope`, `/clear`, `/trust`, `/logic`, and `/guard` in Claude Code with the current skill format.

### Cursor

```bash
/path/to/agentgrammar/install.sh cursor .
```

This copies rule files into:

```text
.cursor/rules/
```

Cursor will load the rules as project-level agent instructions.

### Codex

```bash
/path/to/agentgrammar/install.sh codex .
```

This copies the Codex instruction file into:

```text
AGENTS.md
```

Codex will use it as the repo-level agent operating guide.

## Quick Usage

In Claude Code, run:

```text
/scope
```

Use it before implementation when the task is at risk of expanding.

Example:

```text
User: Fix the broken login redirect.
Agent: /scope
Agent: I will only inspect and change the login redirect path, auth callback handling, and directly related tests. I will not redesign the auth flow, change providers, or touch unrelated session code unless the redirect bug requires it.
```

The point is to force the agent to state the boundary before it starts editing files. If it cannot define the boundary, it is not ready to act.

## Repository Layout

```text
agentgrammar/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── install.sh
├── claude-code/
│   └── .claude/skills/
│       ├── scope/SKILL.md
│       ├── clear/SKILL.md
│       ├── trust/SKILL.md
│       ├── logic/SKILL.md
│       └── guard/SKILL.md
├── cursor/
│   └── .cursor/rules/
│       ├── scope.mdc
│       ├── clear.mdc
│       ├── trust.mdc
│       ├── logic.mdc
│       └── guard.mdc
└── codex/
    └── AGENTS.md
```

## When To Use Each Framework

Use `SCOPE` when the task is small, production-sensitive, or easy to overbuild.

Use `CLEAR` when the session is long, requirements have changed, or the agent is relying on old context.

Use `TRUST` when the agent is about to run commands, call APIs, edit files, migrate data, deploy code, or act on tool output.

Use `LOGIC` before accepting an implementation that looks correct but has not been checked against edge cases and invariants.

Use `GUARD` for multi-step runs: refactors, migrations, deploys, bulk edits, dependency upgrades, and anything where one bad step can poison the rest.

## Design Principles

- Small frameworks beat vague system prompts.
- Each framework must target a real agent failure mode.
- Each rule must change behavior during actual coding work.
- Tool-specific files should preserve the same framework semantics.
- No motivational filler, no fake safety theater, no rules that cannot be followed.

## License

MIT. See [LICENSE](./LICENSE).
