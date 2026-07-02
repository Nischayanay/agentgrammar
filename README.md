<p align="left">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-111827.svg"></a>
  <img alt="Frameworks: 5" src="https://img.shields.io/badge/frameworks-5-111827.svg">
  <img alt="Tools: Claude Code, Cursor, Codex, Universal" src="https://img.shields.io/badge/tools-Claude%20Code%20%7C%20Cursor%20%7C%20Codex%20%7C%20Universal-111827.svg">
  <img alt="Status: early" src="https://img.shields.io/badge/status-early-111827.svg">
</p>

# agentgrammar

AI coding agents are useful until they are not.

The failure modes are no longer theoretical:

- They expand a small request into a broad refactor.
- They drag stale assumptions through long sessions.
- They run tools with the wrong target, params, or confidence.
- They ship happy-path logic that breaks on normal edge cases.
- They keep going after the first bad step and compound the damage.

`agentgrammar` is a framework library for AI coding agents. It gives agents structured operating checks for scope, context, tools, logic, and multi-step safety.

This is not a prompt pack for nicer answers. It is a small rules layer for agents that write, edit, review, migrate, and deploy code.

## Frameworks

| Framework | Prevents |
| --- | --- |
| `SCOPE` | Scope creep and unrelated edits. |
| `CLEAR` | Context rot in long or redirected tasks. |
| `TRUST` | Tool misuse and false confidence in tool output. |
| `LOGIC` | Happy-path bugs and broken invariants. |
| `GUARD` | Cascading failures in multi-step runs. |

## Install

Clone the repo:

```bash
git clone https://github.com/Nischayanay/agentgrammar.git
cd agentgrammar
```

Run the installer from the project where you want the files installed:

```bash
cd /path/to/your/project
/path/to/agentgrammar/install.sh
```

The no-arg command prints every supported install target.

## Install By Tool

### Claude Code

Project-local install:

```bash
/path/to/agentgrammar/install.sh claude-code
```

Installs:

```text
.claude/skills/scope/SKILL.md
.claude/skills/clear/SKILL.md
.claude/skills/trust/SKILL.md
.claude/skills/logic/SKILL.md
.claude/skills/guard/SKILL.md
```

Global Claude Code install:

```bash
/path/to/agentgrammar/install.sh claude-code --global
```

Installs to:

```text
~/.claude/skills/
```

How to use it in Claude Code:

```text
Use the skill by name in your prompt:
"Use scope for this: add payment flow to checkout."
"Use trust before running this migration."
"Use guard for this deployment."
```

These are Claude Code skills, not legacy `.claude/commands` files. If slash-style invocation is not available in your Claude Code setup, use the plain instruction above.

### Cursor

Project-local install:

```bash
/path/to/agentgrammar/install.sh cursor
```

Global install (all projects, slash commands in every workspace):

```bash
/path/to/agentgrammar/install.sh cursor --global
```

Installs:

```text
.cursor/rules/scope.mdc
.cursor/rules/clear.mdc
.cursor/rules/trust.mdc
.cursor/rules/logic.mdc
.cursor/rules/guard.mdc
.cursor/skills/agentgrammar-scope/SKILL.md
.cursor/skills/agentgrammar-clear/SKILL.md
.cursor/skills/agentgrammar-trust/SKILL.md
.cursor/skills/agentgrammar-logic/SKILL.md
.cursor/skills/agentgrammar-guard/SKILL.md
```

Global install writes rules to `~/.cursor/rules/` and skills to `~/.cursor/skills/`.

#### Slash commands (recommended)

After install, restart Cursor and open a new Agent chat. Type `/` and search `agentgrammar`:

| Slash command | Framework |
| --- | --- |
| `/agentgrammar-scope` | SCOPE |
| `/agentgrammar-clear` | CLEAR |
| `/agentgrammar-trust` | TRUST |
| `/agentgrammar-logic` | LOGIC |
| `/agentgrammar-guard` | GUARD |

Example:

```text
/agentgrammar-scope add payment status to checkout API only
```

Cursor skill names use hyphens (not `/agentgrammar/scope`). The installer registers the names above automatically.

#### Rules (automatic)

Rules still apply when Cursor matches the task. You can also mention `@scope`, `@clear`, `@trust`, `@logic`, or `@guard` if your setup supports rule mentions.

| Rule | Activation |
| --- | --- |
| `scope.mdc` | Agent-requested for new tasks, features, bugfixes, and refactors. |
| `clear.mdc` | Agent-requested for long tasks, interruptions, redirects, and stale context. |
| `trust.mdc` | Agent-requested before tool calls, APIs, installs, migrations, deploys, and writes. |
| `logic.mdc` | Glob-triggered for `**/*.ts`, `**/*.py`, `**/*.js`, and `**/*.go`. |
| `guard.mdc` | Agent-requested for multi-step, destructive, deployment, or recovery work. |

### Codex

```bash
/path/to/agentgrammar/install.sh codex
```

Installs:

```text
AGENTS.md
```

How to use it in Codex:

```text
Do nothing special. Codex reads AGENTS.md as standing repo context.
Ask for the coding task normally.
```

### Universal

```bash
/path/to/agentgrammar/install.sh universal
```

Installs:

```text
agentgrammar.md
```

How to use it:

```text
Paste agentgrammar.md into any system prompt, project instruction file, CLAUDE.md, .windsurfrules, Cline custom instructions, Gemini Code Assist context, or similar.
```

### Install Everything

```bash
/path/to/agentgrammar/install.sh all
```

Installs Claude Code skills, Cursor rules, Codex `AGENTS.md`, and the universal `agentgrammar.md` into the current project.

## Installer Behavior

- The installer works from any directory.
- Existing files are never silently overwritten.
- If a target file exists, the installer asks before replacing it.
- `--global` is valid for `claude-code` and `cursor`.
- The script refuses to install into agentgrammar's own source tool folders.

## Quick Examples

Use `SCOPE` before a bounded implementation:

```text
Use scope for this task: fix the login redirect after checkout.
```

Use `CLEAR` after a long session:

```text
Use clear before continuing. Rebuild context from the current files and latest user request.
```

Use `TRUST` before risky tool use:

```text
Use trust before running the migration. Show the target, command, expected evidence, and rollback path.
```

Use `LOGIC` before accepting code:

```text
Use logic to verify the new auth branch handles missing sessions, expired sessions, and failed callbacks.
```

Use `GUARD` for multi-step work:

```text
Use guard for this deploy. Gate each step and stop on the first failed check.
```

## Repository Layout

Skills are authored once in `catalog/` and rendered into every IDE format by a build step. You never
hand-edit per-IDE files anymore.

```text
agentgrammar/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── install.sh                 # installs the rendered payloads from dist/
├── package.json               # `npm run build`
├── scripts/
│   └── render.mjs             # catalog/ -> dist/ (all IDE formats + registry catalog)
├── catalog/                   # SINGLE SOURCE OF TRUTH
│   ├── taxonomy.json          # domains -> categories
│   └── code/review/
│       ├── scope/{manifest.json, SKILL.md}
│       ├── clear/{manifest.json, SKILL.md}
│       ├── trust/{manifest.json, SKILL.md}
│       ├── logic/{manifest.json, SKILL.md}
│       └── guard/{manifest.json, SKILL.md}
├── docs/                      # product plan, PRDs, branding, marketing, roadmap
└── dist/                      # GENERATED (git-ignored) — do not edit by hand
    ├── claude-code/.claude/skills/<id>/SKILL.md
    ├── cursor/.cursor/rules/<id>.mdc
    ├── cursor/.cursor/skills/agentgrammar-<id>/SKILL.md
    ├── codex/AGENTS.md
    ├── universal/agentgrammar.md
    └── registry/catalog.json  # machine-readable catalog for the API + MCP server
```

## Authoring & Build

Each skill is a folder in `catalog/<domain>/<category>/<id>/` with:

- `manifest.json` — catalog metadata (id, name, summary, domain, category, tags, IDE targets, version).
- `SKILL.md` — the canonical body (Claude Code format). Cursor, Codex, and universal outputs are
  generated from it.

Build all IDE payloads and the registry catalog:

```bash
npm run build     # or: node scripts/render.mjs
```

The installer runs this automatically if `dist/` is missing.

## License

MIT. See [LICENSE](./LICENSE).
