import Link from "next/link";
import { Wordmark } from "./Wordmark";

const LINKS = {
  Product: [
    { href: "/skills",  label: "Browse skills"   },
    { href: "/domains", label: "Domains"          },
    { href: "/submit",  label: "Submit a skill"   },
  ],
  Resources: [
    { href: "https://github.com/Nischayanay/agentgrammar",     label: "GitHub",    external: true },
    { href: "https://www.npmjs.com/package/agentgrammar",      label: "npm",       external: true },
    { href: "https://agentgrammar.vercel.app/v1/health",       label: "API status",external: true },
  ],
};

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-[1fr_auto]">
        {/* Brand */}
        <div className="space-y-3 max-w-xs">
          <Wordmark />
          <p className="text-sm text-muted leading-relaxed">
            The curated skill library your AI coding agent installs on demand.
            Human-reviewed. Zero prompt injection.
          </p>
          <p className="font-mono text-xs text-faint">
            npx -y agentgrammar
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-14">
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section} className="space-y-3">
              <p className="font-mono text-2xs uppercase tracking-widest text-faint">{section}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    {"external" in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted transition-colors hover:text-ink"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-muted transition-colors hover:text-ink"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-page border-t border-border/50 py-5 flex items-center justify-between">
        <p className="font-mono text-xs text-faint">
          © 2026 agentgrammar · MIT licensed
        </p>
        <p className="font-mono text-xs text-faint hidden sm:block">
          one tool · every AI IDE
        </p>
      </div>
    </footer>
  );
}
