import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        // Ground — pure near-black, no blue tint
        base:    "#080A0D",
        surface: "#0E1117",
        raised:  "#141920",
        overlay: "#1A2130",
        // Borders — single hairline system
        border:  "#1E2733",
        "border-strong": "#2A3545",
        // Ink scale
        ink:     "#F0F4F8",
        sub:     "#B8C4D0",
        muted:   "#8594A3",
        faint:   "#4A5568",
        ghost:   "#2D3748",
        // Accent — cooler electric blue-violet (not purple)
        accent: {
          DEFAULT: "#5B8DEF",
          soft:    "#7BA8F5",
          dim:     "#3A6BC9",
          glow:    "rgba(91,141,239,0.15)",
        },
        // Signal green — success, verified
        signal:  "#34D399",
        "signal-dim": "#065F46",
        // Warn
        warn:    "#FBBF24",
        "warn-dim": "#78350F",
        // Danger
        danger:  "#F87171",
        "danger-dim": "#7F1D1D",
        // Domain taxonomy accents
        code:    "#5B8DEF",
        design:  "#34D399",
        media:   "#F97316",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": ["0.65rem",  { lineHeight: "1.4", letterSpacing: "0.04em" }],
        xs:    ["0.75rem",  { lineHeight: "1.5" }],
        sm:    ["0.875rem", { lineHeight: "1.6" }],
        base:  ["1rem",     { lineHeight: "1.65" }],
        lg:    ["1.125rem", { lineHeight: "1.55" }],
        xl:    ["1.375rem", { lineHeight: "1.4" }],
        "2xl": ["1.75rem",  { lineHeight: "1.25" }],
        "3xl": ["2.25rem",  { lineHeight: "1.15" }],
        "4xl": ["3rem",     { lineHeight: "1.08" }],
        "5xl": ["3.75rem",  { lineHeight: "1.0" }],
      },
      letterSpacing: {
        tight:   "-0.025em",
        tighter: "-0.04em",
        wide:    "0.06em",
        wider:   "0.1em",
        widest:  "0.16em",
      },
      borderRadius: {
        sm:  "0.25rem",
        DEFAULT: "0.375rem",
        md:  "0.5rem",
        lg:  "0.75rem",
        xl:  "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        // Subtle inset highlight — the "glass edge" effect
        card:    "0 0 0 1px rgba(255,255,255,0.04) inset, 0 4px 24px -8px rgba(0,0,0,0.7)",
        "card-hover": "0 0 0 1px rgba(91,141,239,0.3) inset, 0 8px 32px -8px rgba(91,141,239,0.2)",
        glow:    "0 0 0 1px rgba(91,141,239,0.4), 0 0 24px rgba(91,141,239,0.15)",
        "glow-sm": "0 0 12px rgba(91,141,239,0.25)",
        inner:   "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
        pulse: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.4" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scan-line": {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      animation: {
        "fade-in":   "fade-in 200ms ease-out both",
        "fade-up":   "fade-up 300ms ease-out both",
        "slide-right": "slide-in-right 250ms ease-out both",
        blink:       "blink 1.1s step-end infinite",
        pulse:       "pulse 2s ease-in-out infinite",
        shimmer:     "shimmer 2.5s linear infinite",
      },
      backgroundImage: {
        "grid-subtle": `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
