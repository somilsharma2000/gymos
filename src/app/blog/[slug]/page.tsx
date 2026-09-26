import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost } from "@/lib/blog-posts";
import type { Block } from "@/lib/blog-posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article", publishedTime: post.date },
  };
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i} className="mt-10 font-grotesk text-xl font-semibold sm:text-2xl">{b.text}</h2>;
        if (b.type === "ul")
          return (
            <ul key={i} className="mt-4 space-y-2.5">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-ink-dim">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bp" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        if (b.type === "callout")
          return (
            <p key={i} className="mt-6 rounded-xl border border-bp/30 bg-bp/10 p-4 font-medium text-ink">
              {b.text}
            </p>
          );
        return <p key={i} className="mt-4 text-sm leading-relaxed text-ink-dim sm:text-[15px]">{b.text}</p>;
      })}
    </>
  );
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const base = process.env.SITE_URL || "https://gymos.in";

  return (
    <main className="min-h-screen bg-navy-canvas text-ink">
      <header className="sticky top-0 z-40 border-b border-navy-border bg-navy-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/blog" className="text-xs font-semibold text-bp">← All posts</Link>
          <Link href="/#demo" className="rounded-lg bg-bp px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90">
            Book Free Demo
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-[11px] text-ink-faint">
          {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {post.readMinutes} min read
        </p>
        <h1 className="mt-3 font-grotesk text-2xl font-bold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim sm:text-base">{post.description}</p>

        <div className="mt-6">
          <Blocks blocks={post.blocks} />
        </div>

        {/* CTA */}
        <section className="mt-14 rounded-2xl border border-bp/30 bg-gradient-to-b from-bp/10 to-transparent p-6 text-center sm:p-10">
          <h2 className="font-grotesk text-lg font-semibold sm:text-2xl">See it running on sample data — free.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-dim">
            Watch the live product demo, then book a free demo for your own gym. Setup in about 24 hours.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link href="/demo" className="rounded-xl bg-bp px-6 py-3 text-sm font-semibold text-white hover:opacity-90">Open the demo dashboard →</Link>
            <Link href="/#demo" className="rounded-xl border border-navy-border px-6 py-3 text-sm font-semibold text-ink hover:border-bp/50">Book Free Demo</Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="font-grotesk text-lg font-semibold sm:text-xl">Common questions</h2>
          <div className="mt-4 space-y-3">
            {post.faq.map((f) => (
              <details key={f.q} className="rounded-xl border border-navy-border bg-navy-surface p-4">
                <summary className="cursor-pointer text-sm font-semibold">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Article",
                  headline: post.title,
                  description: post.description,
                  datePublished: post.date,
                  author: { "@type": "Organization", name: "Beyond Pixells" },
                  publisher: { "@type": "Organization", name: "Beyond Pixells" },
                  mainEntityOfPage: `${base}/blog/${post.slug}`,
                },
                {
                  "@type": "FAQPage",
                  mainEntity: post.faq.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                },
              ],
            }),
          }}
        />
      </article>
    </main>
  );
}
