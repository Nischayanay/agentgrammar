import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const TITLE = "agentgrammar — the curated skill library your AI agent installs on demand";
const DESCRIPTION =
  "A curated, security-verified library of skills for AI coding agents. One tool, every IDE — Claude Code, Cursor, Codex. Your agent installs the exact skill the task needs.";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentgrammar.dev"),
  title: {
    default: TITLE,
    template: "%s · agentgrammar",
  },
  description: DESCRIPTION,
  keywords: [
    "agentgrammar",
    "AI coding agent skills",
    "Claude Code skills",
    "Cursor skills",
    "Codex skills",
    "MCP server",
    "agent skills marketplace",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://agentgrammar.dev",
    siteName: "agentgrammar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
