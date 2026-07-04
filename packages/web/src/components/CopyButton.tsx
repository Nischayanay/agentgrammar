"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copy",
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
      // Feedback on every action (INTERFACE rule); reset after a beat.
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied to clipboard" : `Copy: ${label}`}
      className={`inline-flex items-center gap-1.5 rounded-md border border-border bg-raised px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink ${className}`}
    >
      {copied ? (
        <span className="text-signal">✓ Copied</span>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
