import Link from "next/link";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/skills", label: "Browse" },
  { href: "/domains", label: "Domains" },
  { href: "/submit", label: "Submit" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-base/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label="agentgrammar home" className="flex items-center">
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/Nischayanay/agentgrammar"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost ml-1 hidden sm:inline-flex"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
