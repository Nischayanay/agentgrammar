# Phase 1 — Build Doc (7-day launch)

The reference doc for building the MVP: the `agentgrammar` MCP server + serverless registry API that
makes "use agentgrammar to <task>" a live tool call in Claude Code, Cursor, and Codex.

## Locked decisions (2026-07-02)

- **Backend:** serverless API functions (Hono/TypeScript), **no database**. Reads the built
  `catalog.json` + payload files. Deployed on Vercel.
- **Layout:** **monorepo** — everything in this repo under new top-level folders.
- **npm:** Claude prepares the package; **founder publishes** (`npm publish`) — founder owns the
  npm account + 2FA.
- **IDE targets:** Claude Code, Cursor, Codex — one MCP server, one config snippet.
- **Scope cuts:** no accounts, no DB, no plugins, no web catalog (Phase 2), no payments.

## Monorepo structure (added this phase)

```text
agentgrammar/
├── catalog/                      # (Phase 0) source of truth
├── scripts/render.mjs            # (Phase 0) builds dist/
├── dist/registry/catalog.json    # (Phase 0) API reads this
├── packages/
│   ├── mcp/                      # the `agentgrammar` MCP server (npx target)
│   │   ├── package.json          # "name": "agentgrammar", "bin": agentgrammar
│   │   ├── src/index.ts          # MCP server entry
│   │   ├── src/tools/            # browse_domains, search_skills, get_skill,
│   │   │                         #   install_skill, list_installed
│   │   ├── src/registry.ts       # HTTP client for the API
│   │   ├── src/ide.ts            # IDE detection + install paths
│   │   └── README.md             # install snippet per IDE
│   └── api/                      # serverless registry API
│       ├── package.json
│       ├── src/app.ts            # Hono app with /v1/* routes
│       ├── api/index.ts          # Vercel serverless entry
│       └── vercel.json
└── ...
```

## Component A — Registry API (Hono, serverless, no DB)

Data source: the committed/uploaded `catalog.json` and the rendered payload files from `dist/`.
For launch we bundle a snapshot of `dist/` into the API deploy (or read from CDN). No DB.

### Endpoints

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/v1/health` | `{ ok: true, version }` |
| GET | `/v1/domains` | taxonomy tree with skill_ids |
| GET | `/v1/skills?q=&domain=&category=&ide=&limit=` | filtered skill list (metadata only) |
| GET | `/v1/skills/:id` | one skill + canonical body preview |
| GET | `/v1/skills/:id/payload?ide=claude-code\|cursor\|codex` | array of `{ path, contents, sha256 }` to write |

### Rules
- Read-only, public, cacheable (CDN + `Cache-Control`, `ETag`).
- Search = substring/tag match over name/summary/tags (no search engine yet).
- CORS open for GET.
- Payload response includes each file's target relative path + contents + hash for integrity.

### Deploy
- Vercel project, root `packages/api`. Env: `AGENTGRAMMAR_VERSION`.
- Publish flow: `npm run build` (repo root) → copy `dist/` snapshot into `packages/api/data/` →
  deploy. A script automates this.

## Component B — MCP server (`npx agentgrammar`)

TypeScript, uses the official MCP SDK (`@modelcontextprotocol/sdk`). Talks to the API over HTTPS.

### Tools

| Tool | Input | Behavior |
| --- | --- | --- |
| `browse_domains` | — | GET /v1/domains; return the tree for discovery |
| `search_skills` | `query`, `domain?`, `category?`, `limit?` | GET /v1/skills; return ranked matches |
| `get_skill` | `id` | GET /v1/skills/:id; return metadata + preview |
| `install_skill` | `id`, `scope?` (`project`\|`global`) | detect IDE → GET payload → write files → verify hash → report paths |
| `list_installed` | — | read local install dirs; list agentgrammar skills + versions |

### IDE detection + install paths
- Detect from env / cwd markers; allow `AGENTGRAMMAR_IDE` override.
- Write locations (mirror `install.sh`):
  - Claude Code: `.claude/skills/<id>/SKILL.md` (or `~/.claude/...` if `scope=global`)
  - Cursor: `.cursor/rules/<id>.mdc` + `.cursor/skills/agentgrammar-<id>/SKILL.md`
  - Codex: append/merge block into `AGENTS.md`
- Never overwrite silently → prompt/skip on conflict. Verify sha256 before writing.

### Config
- `AGENTGRAMMAR_REGISTRY_URL` (default: prod API), `AGENTGRAMMAR_IDE`, `AGENTGRAMMAR_TELEMETRY=off`.

### The universal install snippet (same for all 3 IDEs)
```jsonc
{ "mcpServers": { "agentgrammar": { "command": "npx", "args": ["-y", "agentgrammar"] } } }
```

## Acceptance criteria (Phase 1 "done")

1. From a clean project in Claude Code, Cursor, and Codex, pasting the snippet exposes `agentgrammar`
   tools.
2. "use agentgrammar to <task>" triggers a real tool call that installs a working skill.
3. Installed skill behaves identically to today's hand-copied files.
4. Hash verification passes; conflicts prompt; telemetry off by default.
5. API serves domains/search/skill/payload with < 300ms p50.
6. `npx agentgrammar` runs the server with zero manual install.

## 7-day plan

| Day | Focus | Deliverable |
| --- | --- | --- |
| 1 | API scaffold | Hono app, `/v1/health` + `/v1/domains` + `/v1/skills` reading catalog.json, deployed to Vercel |
| 2 | API payloads | `/v1/skills/:id` + `/payload?ide=`; bundle dist/ snapshot; caching + CORS |
| 3 | MCP scaffold | MCP server with `browse_domains`, `search_skills`, `get_skill` hitting the live API |
| 4 | Install engine | `install_skill` + IDE detection + write paths + hash verify + conflict prompt; `list_installed` |
| 5 | 3-IDE verify | Test end-to-end in Claude Code, Cursor, Codex; fix per-IDE quirks; write MCP README snippets |
| 6 | Seed + polish | Add 5–10 design/media skills to catalog; rebuild; package prep for npm; founder publishes |
| 7 | Demo + launch | Record hero video; soft-launch post; pin snippet; monitor |

## npm publish (founder runs these — Claude prepares everything first)

```bash
# one-time
npm login                       # founder's npm account, with 2FA

# each release (Claude will have set version + built)
cd packages/mcp
npm publish --access public     # publishes `agentgrammar` so `npx agentgrammar` works
```

Claude prepares `package.json` (name, bin, files, version), builds, and dry-runs `npm pack` so the
founder only runs `npm publish`.

## Founder action checklist (parallel to Claude coding)

- [ ] **Reserve npm name `agentgrammar`** (blocks the whole `npx` UX). See below.
- [ ] Buy the domain (`agentgrammar.dev` / `.com`). See `docs/09-FOUNDER-SETUP.md`.
- [ ] Create a Vercel account + connect the GitHub repo (for API deploy).
- [ ] Create X handle `@agentgrammar`; post Day 1 tease.
- [ ] Confirm GitHub repo will host the MCP server (already: Nischayanay/agentgrammar).

## Risks

| Risk | Mitigation |
| --- | --- |
| npm name taken | Check + reserve Day 1; fallback names ready |
| MCP quirks differ across IDEs | Dedicate Day 5 to all three; keep IDE logic isolated in `ide.ts` |
| Payload write conflicts | Reuse proven install.sh conflict behavior |
| Demo underwhelms | Video is a Day 7 deliverable, scripted in advance |
