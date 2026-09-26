import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Gym OS Blog — Running a gym in India, honestly",
  description: "Practical guides for Indian gym owners: WhatsApp renewals, member retention, front-desk operations, and what software actually changes.",
};

export default function BlogIndex() {
  const base = process.env.SITE_URL || "https://gymos.in";
  return (
    <main className="min-h-screen bg-navy-canvas text-ink">
      <header className="sticky top-0 z-40 border-b border-navy-border bg-navy-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-bp font-grotesk font-bold text-white">G</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Gym OS</p>
              <p className="text-[11px] text-ink-dim">by Beyond Pixells</p>
            </div>
          </Link>
          <Link href="/#demo" className="rounded-lg bg-bp px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90">
            Book Free Demo
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bp">Blog</p>
        <h1 className="mt-3 font-grotesk text-3xl font-bold tracking-tight sm:text-4xl">
          Running a gym in India, honestly.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-dim">
          No fluff, no invented numbers. Practical guides on members, renewals and what software actually changes.
        </p>

        <div className="mt-10 space-y-5">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block rounded-2xl border border-navy-border bg-navy-surface p-6 transition hover:border-bp/50"
            >
              <p className="text-[11px] text-ink-faint">
                {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {p.readMinutes} min read
              </p>
              <h2 className="mt-2 font-grotesk text-lg font-semibold leading-snug sm:text-xl">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{p.description}</p>
              <p className="mt-3 text-xs font-semibold text-bp">Read →</p>
            </Link>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Gym OS Blog",
            url: `${base}/blog`,
            publisher: { "@type": "Organization", name: "Beyond Pixells" },
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              description: p.description,
              datePublished: p.date,
              url: `${base}/blog/${p.slug}`,
            })),
          }),
        }}
      />
    </main>
  );
}
