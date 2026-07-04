import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
        <div className="max-w-xs space-y-3">
          <Wordmark />
          <p className="text-sm text-faint">
            The curated, security-verified library of skills your AI coding agent installs on demand.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:gap-16">
          <div className="space-y-2">
            <p className="font-medium text-ink">Product</p>
            <Link href="/skills" className="block text-muted hover:text-ink">Browse skills</Link>
            <Link href="/domains" className="block text-muted hover:text-ink">Domains</Link>
            <Link href="/submit" className="block text-muted hover:text-ink">Submit a skill</Link>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-ink">Resources</p>
            <a href="https://github.com/Nischayanay/agentgrammar" className="block text-muted hover:text-ink">GitHub</a>
            <a href="https://www.npmjs.com/package/agentgrammar" className="block text-muted hover:text-ink">npm</a>
            <a href="https://agentgrammar.vercel.app/v1/health" className="block text-muted hover:text-ink">API status</a>
          </div>
        </div>
      </div>
      <div className="container-page pb-10 text-xs text-faint">
        © 2026 agentgrammar · MIT licensed · One tool, every AI IDE.
      </div>
    </footer>
  );
}
