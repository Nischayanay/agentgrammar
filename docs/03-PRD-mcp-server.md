# PRD — agentgrammar MCP Server

**Owner:** founder · **Status:** draft · **Phase:** 1 (MVP) · **Priority:** P0 (the product)

## Problem

Developers using AI IDEs want expert ability on demand (design, code, review, migration, media) but
today must clone a repo and copy files. There is no way for the agent itself to discover and pull the
right skill mid-task. We need the moment where typing "agentgrammar" turns into a live tool call that
fetches and installs exactly the skill the task needs.

## Goal

Ship a single MCP server that runs inside Claude Code, Cursor, and Codex, exposing tools that let the
agent **discover, fetch, and install** agentgrammar skills from the hosted registry on demand.

## Users & top job stories

- *When* I start a design task, *I want* my agent to grab the best UI/UX skill automatically, *so*
  the output looks professionally designed.
- *When* I say "use agentgrammar to migrate this to Next.js," *I want* the migration skill installed
  and applied, *so* I don't hunt for prompts.
- *When* I don't know what exists, *I want* to ask my agent to browse agentgrammar domains, *so* I
  discover capabilities.

## The headline experience

```
User:  use agentgrammar to design a clean pricing page
Agent: (calls agentgrammar.search_skills "pricing page design", domain=design)
       (finds design-system-builder + product-ui/pricing-page)
       (calls install_skill for the best match)
Agent: Installed the Pricing Page Design skill. Applying it now...
```

The word "agentgrammar" resolves to the MCP server → branded, recognizable, tool-call UX in all three
IDEs.

## Functional requirements

### Tools exposed

| Tool | Input | Output | Notes |
| --- | --- | --- | --- |
| `browse_domains` | — | domains + categories tree | For discovery / "what can you do" |
| `search_skills` | `query`, `domain?`, `category?`, `limit?` | ranked skill matches (id, name, summary, tags) | Primary entry point |
| `get_skill` | `id` | full skill metadata + body preview | Inspect before install |
| `install_skill` | `id`, `scope? (project\|global)` | install result + path written | Renders per active IDE |
| `list_installed` | — | installed agentgrammar skills + versions | Manage state |
| `install_plugin` | `id` | (Phase 3) | Stub returns "coming soon" in Phase 1 |

### Install behavior

- Detect active IDE from environment/config; allow explicit override.
- Request the pre-rendered payload for that IDE from the registry.
- Write to the correct location (project `.claude/`, `.cursor/`, or `AGENTS.md`; `--global` supported
  for Claude Code / Cursor as today).
- Never overwrite silently — mirror `install.sh` behavior (prompt/skip on conflict).
- Verify payload hash against manifest before writing.

### Config

- `AGENTGRAMMAR_REGISTRY_URL` (default: prod), `AGENTGRAMMAR_IDE`, `AGENTGRAMMAR_TELEMETRY=on|off`
  (default off).

### Telemetry (opt-in only)

- If enabled: anonymous events `skill_searched`, `skill_installed`, `skill_invoked`.
- Documented in README; no PII; no source code ever sent.

## Non-functional

- **Zero-install run:** `npx agentgrammar` / one-line config block per IDE.
- **Latency:** search < 400ms p50 (cached catalog), install < 1.5s.
- **Offline-tolerant:** cache last catalog; clear error if registry unreachable.
- **Safe:** only writes to known skill dirs; never executes fetched content.

## IDE registration snippets (what the user pastes)

```jsonc
// Claude Code — .mcp.json / settings
{ "mcpServers": { "agentgrammar": { "command": "npx", "args": ["-y", "agentgrammar"] } } }

// Cursor — .cursor/mcp.json (same shape)
// Codex — MCP config block (same shape)
```

One consistent snippet across all three is a marketing asset in itself.

## Acceptance criteria

1. From a clean project in each IDE, pasting the snippet exposes `agentgrammar` tools.
2. "use agentgrammar to <task>" causes a real tool call that installs a working skill.
3. Installed skill functions identically to today's hand-copied files.
4. Conflicts prompt; hashes verify; telemetry off by default.
5. Works for Claude Code, Cursor, and Codex from the same server build.

## Open questions

- Auto-invoke the installed skill in the same turn, or install-then-user-invokes? (Recommend:
  install + apply in one turn for the "magic" demo.)
- Global vs project default scope per IDE.

## Out of scope (Phase 1)

Accounts, payments, plugin execution, community publishing.
