# agentgrammar

Install curated [agentgrammar](https://agentgrammar.dev) skills into **Claude Code**, **Cursor**, and
**Codex** on demand — straight from your agent, no copy-paste.

agentgrammar ships as an MCP server. Add it once, then say *"use agentgrammar to review this code"* and
the agent will browse the catalog, pick the right skill, and install it into your project.

## Install

Add the same snippet to your IDE's MCP config — it's identical for all three:

```jsonc
{
  "mcpServers": {
    "agentgrammar": {
      "command": "npx",
      "args": ["-y", "agentgrammar"]
    }
  }
}
```

- **Claude Code** — `~/.claude.json` (or a project `.mcp.json`), under `mcpServers`. Or run:
  `claude mcp add agentgrammar -- npx -y agentgrammar`
- **Cursor** — `~/.cursor/mcp.json` (or project `.cursor/mcp.json`), under `mcpServers`.
- **Codex** — your Codex MCP config, under `mcpServers`.

No manual install step — `npx` fetches and runs the server on first use.

## Tools

| Tool | What it does |
| --- | --- |
| `browse_domains` | List the taxonomy (domains → categories → skills). |
| `search_skills` | Find skills by query / domain / category. |
| `get_skill` | Full metadata + a preview of a skill's body. |
| `install_skill` | Detect the IDE, fetch the payload, verify hashes, write files. |
| `list_installed` | List agentgrammar skills already installed locally. |

## Where skills are installed

`install_skill` detects your IDE and writes to the conventional location:

- **Claude Code** — `.claude/skills/<id>/SKILL.md` (or `~/.claude/…` with `scope: "global"`)
- **Cursor** — `.cursor/rules/<id>.mdc` + `.cursor/skills/agentgrammar-<id>/SKILL.md`
- **Codex** — an idempotent block merged into `AGENTS.md`

Existing files are never overwritten silently — a conflicting file is skipped and reported; pass
`force: true` to overwrite. Every payload file's `sha256` is verified before it touches disk.

## Configuration

| Env var | Default | Purpose |
| --- | --- | --- |
| `AGENTGRAMMAR_REGISTRY_URL` | `https://api.agentgrammar.dev` | Registry API base URL. |
| `AGENTGRAMMAR_IDE` | auto-detected | Force the target IDE (`claude-code` \| `cursor` \| `codex`). |
| `AGENTGRAMMAR_TELEMETRY` | `off` | Telemetry is off by default; this server sends none. |

## License

MIT
