import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const TITLE = "agentgrammar — curated skills for AI coding agents";
const DESCRIPTION =
  "A human-reviewed library of skills for Claude Code, Cursor, and Codex. One MCP server, every IDE. Your agent installs exactly what the task needs.";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentgrammar.dev"),
  title: { default: TITLE, template: "%s · agentgrammar" },
  description: DESCRIPTION,
  keywords: [
    "agentgrammar", "AI coding agent skills", "Claude Code skills",
    "Cursor skills", "Codex skills", "MCP server", "agent skills catalog",
  ],
  openGraph: {
    title: TITLE, description: DESCRIPTION,
    url: "https://agentgrammar.dev", siteName: "agentgrammar", type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
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
