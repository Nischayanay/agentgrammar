import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[50vh] place-items-center py-20 text-center">
      <div className="space-y-4">
        <p className="font-mono text-sm text-accent-soft">404</p>
        <h1 className="text-2xl font-semibold text-ink">This skill isn&apos;t in the catalog.</h1>
        <p className="text-muted">It may have been renamed, or it&apos;s still on the roadmap.</p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/skills" className="btn-primary">Browse skills</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </div>
  );
}
