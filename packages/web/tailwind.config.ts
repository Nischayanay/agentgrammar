import type { Config } from "tailwindcss";

// The site is its own proof-of-quality artifact: tokens map 1:1 to BRANDING.md.
// Dark-first, near-black base, single electric-violet accent.
const config: Config = {
  content: ["./src/**/*.{ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces (near-black -> raised panels)
        base: "#0B0F14",
        surface: "#11161D",
        raised: "#171E27",
        border: "#232B36",
        // Ink
        ink: "#E7ECF3",
        muted: "#9AA6B2",
        faint: "#5D6B7A",
        // Single electric accent + supporting signal green (echoes the MCP chip)
        accent: {
          DEFAULT: "#7C5CFF",
          soft: "#A08CFF",
          dim: "#5B43C4",
        },
        signal: "#3DDC84",
        danger: "#FF6B6B",
        warn: "#F5C451",
        // Per-domain accent for taxonomy chips
        code: "#7C5CFF",
        design: "#3DDC84",
        media: "#FF8A5C",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // One deliberate type scale — the INTERFACE skill made flesh.
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.375rem", { lineHeight: "1.4" }],
        "2xl": ["1.75rem", { lineHeight: "1.25" }],
        "3xl": ["2.5rem", { lineHeight: "1.1" }],
        "4xl": ["3.5rem", { lineHeight: "1.05" }],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.35), 0 12px 40px -12px rgba(124,92,255,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 32px -16px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseglow: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        // 150-400ms per the INTERFACE motion rule; transform/opacity only.
        "fade-up": "fade-up 300ms ease-out both",
        pulseglow: "pulseglow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
