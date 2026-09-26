import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default async function AdminOverview() {
  const [gyms, members, leads, websiteLeads, recentWebsiteLeads] = await Promise.all([
    prisma.gym.count(),
    prisma.member.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { source: "website" } }),
    prisma.lead.findMany({
      where: { source: "website" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { gym: true },
    }),
  ]);

  const cards = [
    { label: "Gyms on platform", value: gyms.toString(), sub: "all tenants" },
    { label: "Members managed", value: members.toString(), sub: "across all gyms" },
    { label: "Leads total", value: leads.toString(), sub: "all sources" },
    { label: "Website leads", value: websiteLeads.toString(), sub: "from our landing" },
  ];

  return (
    <main className="space-y-8">
      <section className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Command Center</h1>
          <p className="text-sm text-ink-dim">Every gym, every lead — one view.</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-navy-border bg-navy-surface p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-dim">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{c.value}</p>
            <p className="mt-0.5 text-xs text-ink-faint">{c.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-navy-border bg-navy-surface p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Latest website leads</h2>
          <Link href="/admin/leads" className="text-xs text-bp hover:underline">All leads →</Link>
        </div>
        {recentWebsiteLeads.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-dim">
            No website leads yet — they appear here the moment someone submits the landing form.
          </p>
        ) : (
          <ul className="divide-y divide-navy-border">
            {recentWebsiteLeads.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-ink-dim">{l.phone}{l.notes ? ` · ${l.notes}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-bp/15 px-2 py-0.5 text-bp">{l.status}</span>
                  <a href={`https://wa.me/91${l.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener"
                    className="rounded-lg bg-bp px-2.5 py-1 font-semibold text-white hover:opacity-90">WhatsApp</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
