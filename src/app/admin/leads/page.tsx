import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusChip: Record<string, string> = {
  new: "bg-bp-pale/15 text-bp-pale",
  contacted: "bg-bp/15 text-bp",
  trial: "bg-bp/15 text-bp",
  won: "bg-success/15 text-success",
  lost: "bg-ink-faint/15 text-ink-dim",
};

export default async function AdminLeads() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { gym: true },
  });

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">All leads</h1>
        <p className="text-sm text-ink-dim">Every gym, every source — latest 200.</p>
      </div>
      <section className="overflow-x-auto rounded-xl border border-navy-border bg-navy-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-navy-border text-[11px] uppercase tracking-wider text-ink-dim">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Gym / inbox</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-border">
            {leads.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3 text-ink-dim">{l.phone}</td>
                <td className="px-4 py-3 text-ink-dim">{l.gym.name}</td>
                <td className="px-4 py-3 text-ink-dim">{l.source}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${statusChip[l.status] ?? "bg-navy-raised text-ink-dim"}`}>{l.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <a href={`https://wa.me/91${l.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener"
                    className="rounded-lg bg-bp px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90">WhatsApp</a>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-dim">No leads yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
      <p className="text-xs text-ink-faint">
        <Link href="/admin" className="text-bp hover:underline">← Overview</Link>
      </p>
    </main>
  );
}
