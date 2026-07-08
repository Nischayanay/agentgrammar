"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "copy",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy ${label}`}
      className={`inline-flex items-center gap-1.5 rounded border border-border bg-overlay px-2 py-1 font-mono text-2xs text-muted transition-colors hover:border-border-strong hover:text-ink ${className}`}
    >
      {copied ? (
        <span className="text-signal">✓ copied</span>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
