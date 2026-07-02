#!/usr/bin/env bash
set -euo pipefail

script_source="${BASH_SOURCE[0]}"
script_dir_part="${script_source%/*}"
if [ "$script_dir_part" = "$script_source" ]; then
  script_dir_part="."
fi
SCRIPT_DIR="$(cd "$script_dir_part" && pwd)"
TARGET_DIR="$(pwd)"
SRC_DIR="$SCRIPT_DIR/dist"

if [ -t 1 ] && [ "${NO_COLOR:-}" = "" ]; then
  GREEN=$'\033[32m'
  YELLOW=$'\033[33m'
  RED=$'\033[31m'
  RESET=$'\033[0m'
else
  GREEN=""
  YELLOW=""
  RED=""
  RESET=""
fi

info() { echo "$1"; }
success() { echo "${GREEN}$1${RESET}"; }
warn() { echo "${YELLOW}$1${RESET}"; }
err() { echo "${RED}$1${RESET}" >&2; }

# Generated payloads live in dist/. Build them if missing (requires Node 18+).
ensure_built() {
  if [ -d "$SRC_DIR/claude-code" ]; then
    return 0
  fi
  if command -v node >/dev/null 2>&1; then
    ( cd "$SCRIPT_DIR" && node scripts/render.mjs >/dev/null )
  fi
  if [ ! -d "$SRC_DIR/claude-code" ]; then
    err "Generated payloads not found in $SRC_DIR and could not be built."
    err "Run 'node scripts/render.mjs' from the agentgrammar source tree first."
    exit 1
  fi
}

# Discover skill ids from the built Claude Code payloads (single source of truth).
skill_ids() {
  for d in "$SRC_DIR"/claude-code/.claude/skills/*/; do
    [ -d "$d" ] || continue
    basename "$d"
  done
}

usage() {
  echo "Usage:"
  echo "  ./install.sh"
  echo "  ./install.sh <tool>"
  echo "  ./install.sh claude-code --global"
  echo "  ./install.sh cursor --global"
  echo ""
  echo "Supported tools:"
  echo "  claude-code   installs Claude Code skills to ./.claude/skills/"
  echo "  cursor        installs Cursor rules and slash-command skills"
  echo "  codex         copies Codex standing context to ./AGENTS.md"
  echo "  universal     copies the tool-agnostic prompt to ./agentgrammar.md"
  echo "  all           installs claude-code, cursor, codex, and universal locally"
}

prompt_overwrite() {
  path="$1"
  warn "File already exists: $path"
  echo "Overwrite? [y/N]"
  if ! read -r answer; then
    err "Aborted: no overwrite confirmation received"
    exit 2
  fi
  case "$answer" in
    y|Y|yes|YES) return 0 ;;
    *) err "Aborted: $path was not overwritten"; exit 2 ;;
  esac
}

copy_file() {
  src="$1"
  dst="$2"
  parent="${dst%/*}"

  if [ "$src" = "$dst" ]; then
    err "Refusing to copy a source file onto itself: $src"
    exit 1
  fi

  if [ -e "$dst" ]; then
    prompt_overwrite "$dst"
  fi

  mkdir -p "$parent"
  cp "$src" "$dst"
}

ensure_not_source_target() {
  source_target="$1"
  case "$TARGET_DIR/" in
    "$source_target"/*)
    err "Refusing to install into agentgrammar's source folder: $TARGET_DIR"
    err "Run this command from the project that should receive the files."
    exit 1
      ;;
  esac
}

install_claude_code() {
  if [ "${GLOBAL_INSTALL:-0}" = "1" ]; then
    dest_root="$HOME/.claude/skills"
  else
    ensure_not_source_target "$SCRIPT_DIR"
    dest_root="$TARGET_DIR/.claude/skills"
  fi

  for name in $(skill_ids); do
    copy_file "$SRC_DIR/claude-code/.claude/skills/$name/SKILL.md" "$dest_root/$name/SKILL.md"
  done
  success "Installed Claude Code skills to $dest_root"
}

install_cursor() {
  if [ "${GLOBAL_INSTALL:-0}" = "1" ]; then
    rules_root="$HOME/.cursor/rules"
    skills_root="$HOME/.cursor/skills"
  else
    ensure_not_source_target "$SCRIPT_DIR"
    rules_root="$TARGET_DIR/.cursor/rules"
    skills_root="$TARGET_DIR/.cursor/skills"
  fi

  for name in $(skill_ids); do
    copy_file "$SRC_DIR/cursor/.cursor/rules/$name.mdc" "$rules_root/$name.mdc"
    copy_file "$SRC_DIR/cursor/.cursor/skills/agentgrammar-$name/SKILL.md" "$skills_root/agentgrammar-$name/SKILL.md"
  done
  success "Installed Cursor rules to $rules_root"
  success "Installed Cursor slash-command skills to $skills_root"
}

install_codex() {
  ensure_not_source_target "$SCRIPT_DIR"
  copy_file "$SRC_DIR/codex/AGENTS.md" "$TARGET_DIR/AGENTS.md"
  success "Installed Codex context to $TARGET_DIR/AGENTS.md"
}

install_universal() {
  ensure_not_source_target "$SCRIPT_DIR"
  copy_file "$SRC_DIR/universal/agentgrammar.md" "$TARGET_DIR/agentgrammar.md"
  success "Installed universal prompt to $TARGET_DIR/agentgrammar.md"
}

if [ "${1:-}" = "" ]; then
  usage
  exit 0
fi

tool="$1"
GLOBAL_INSTALL=0

case "${2:-}" in
  "") ;;
  --global) GLOBAL_INSTALL=1 ;;
  *) err "Unknown argument: $2"; usage; exit 1 ;;
esac

if [ "${3:-}" != "" ]; then
  err "Too many arguments."
  usage
  exit 1
fi

if [ "$GLOBAL_INSTALL" = "1" ] && [ "$tool" != "claude-code" ] && [ "$tool" != "cursor" ]; then
  err "--global is only valid with claude-code or cursor."
  exit 1
fi

case "$tool" in
  -h|--help) usage; exit 0 ;;
esac

ensure_built

case "$tool" in
  claude-code) install_claude_code ;;
  cursor) install_cursor ;;
  codex) install_codex ;;
  universal) install_universal ;;
  all)
    install_claude_code
    install_cursor
    install_codex
    install_universal
    ;;
  *) err "Unknown tool: $tool"; usage; exit 1 ;;
esac
