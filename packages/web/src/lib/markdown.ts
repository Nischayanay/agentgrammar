// Minimal, dependency-free Markdown → HTML for rendering SKILL.md previews.
// Scope is intentionally small: the headings, lists, code, and paragraphs that
// SKILL.md files actually use. Input is our own curated content (not user input),
// but we still escape HTML to be safe.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  // Order matters: escape first, then apply inline markup on the escaped text.
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return out;
}

// Strip YAML frontmatter if present.
function stripFrontmatter(md: string): string {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  if (end === -1) return md;
  return md.slice(end + 4).replace(/^\n+/, "");
}

export function renderMarkdown(md: string): string {
  const src = stripFrontmatter(md);
  const lines = src.split("\n");
  const html: string[] = [];
  let i = 0;
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      closeList();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(escapeHtml(lines[i]));
        i++;
      }
      i++; // consume closing fence
      html.push(`<pre><code>${buf.join("\n")}</code></pre>`);
      continue;
    }

    // Headings
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      closeList();
      const level = Math.min(h[1].length + 1, 4); // shift down: # -> h2
      html.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // List items
    const li = line.match(/^[-*]\s+(.*)$/);
    if (li) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inline(li[1])}</li>`);
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      closeList();
      i++;
      continue;
    }

    // Truncation marker from the API preview
    if (line.trim() === "…(truncated)") {
      closeList();
      html.push(`<p class="truncate-note">…(preview truncated)</p>`);
      i++;
      continue;
    }

    // Paragraph
    closeList();
    html.push(`<p>${inline(line)}</p>`);
    i++;
  }

  closeList();
  return html.join("\n");
}
