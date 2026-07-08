"use client";

import { useEffect, useState } from "react";

const LINES = [
  { role: "user",  text: 'use agentgrammar to design this pricing page', delay: 0 },
  { role: "agent", text: '→ searching catalog for design/ui-ux…',          delay: 900 },
  { role: "match", text: '✓ matched  INTERFACE  ·  design/ui-ux',           delay: 1700 },
  { role: "match", text: '✓ matched  IMPECCABLE  ·  design/ui-ux',          delay: 2400 },
  { role: "agent", text: '→ installing interface-design…',                  delay: 3000 },
  { role: "ok",    text: '✓ written  .claude/skills/interface-design/',      delay: 3700 },
  { role: "agent", text: '→ applying: contrast · targets · type scale…',    delay: 4300 },
  { role: "live",  text: '● skill active · 9 rules enforced',               delay: 5000 },
];

type Line = typeof LINES[number];

function roleCls(role: Line["role"]) {
  if (role === "user")  return "text-ink";
  if (role === "match") return "text-signal";
  if (role === "ok")    return "text-signal/70";
  if (role === "live")  return "text-accent-soft animate-pulse";
  return "text-muted";
}

function rolePrefix(role: Line["role"]) {
  if (role === "user")  return <span className="text-faint select-none">❯ </span>;
  if (role === "live")  return null;
  return null;
}

export function HeroDemo() {
  const [visible, setVisible] = useState<number[]>([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((l, i) => {
      timers.push(setTimeout(() => setVisible((v) => [...v, i]), l.delay));
    });
    // blink cursor
    const blinkId = setInterval(() => setCursor((c) => !c), 530);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(blinkId);
    };
  }, []);

  return (
    <div className="terminal animate-fade-up overflow-hidden">
      {/* Chrome bar */}
      <div className="terminal-bar">
        <span className="terminal-dot bg-danger/60" />
        <span className="terminal-dot bg-warn/60" />
        <span className="terminal-dot bg-signal/60" />
        <span className="ml-auto font-mono text-xs text-faint">
          agentgrammar · mcp · stdio
        </span>
      </div>

      {/* Output area */}
      <div className="min-h-[220px] space-y-1.5 p-5 font-mono text-sm">
        {LINES.map((line, i) => (
          <div
            key={i}
            className={`flex gap-3 transition-opacity duration-300 ${visible.includes(i) ? "opacity-100" : "opacity-0"}`}
          >
            {line.role === "user" ? (
              <>
                <span className="shrink-0 text-faint select-none">❯</span>
                <span className="text-ink">{line.text}</span>
              </>
            ) : line.role === "live" ? (
              <span className={roleCls(line.role)}>{line.text}</span>
            ) : (
              <span className={`pl-4 ${roleCls(line.role)}`}>{line.text}</span>
            )}
          </div>
        ))}

        {/* Blinking cursor after last visible line */}
        {visible.length < LINES.length && (
          <div className="flex gap-3 pl-4">
            <span className={`text-accent-soft transition-opacity ${cursor ? "opacity-100" : "opacity-0"}`}>▌</span>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="border-t border-border/60 bg-raised/40 px-5 py-2 flex items-center justify-between">
        <span className="font-mono text-xs text-faint">registry · agentgrammar.vercel.app</span>
        <span className="font-mono text-xs text-signal flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-signal inline-block animate-pulse" />
          connected
        </span>
      </div>
    </div>
  );
}
