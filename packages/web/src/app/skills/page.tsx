import type { Metadata } from "next";
import { getDomains, getSkills } from "@/lib/api";
import { weightsById } from "@/lib/weights";
import { SkillBrowser } from "@/components/SkillBrowser";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Browse skills",
  description:
    "Browse the curated agentgrammar catalog. Search verified skills for Claude Code, Cursor, and Codex across design, code, review, and more.",
};

export default async function SkillsPage() {
  const [skills, domains] = await Promise.all([getSkills(), getDomains()]);
  const weights = weightsById();

  return (
    <div className="container-page py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink">Browse the catalog</h1>
        <p className="mt-2 text-muted">
          Every skill is human-reviewed and installable on demand. Filter by domain or
          IDE, and check each skill&apos;s context weight before your agent pulls it in.
        </p>
      </header>
      <SkillBrowser skills={skills} domains={domains} weights={weights} />
    </div>
  );
}
