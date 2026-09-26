import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { setLeadStatus } from "@/lib/actions";

const STATUSES = ["new", "contacted", "trial", "won", "lost"];

export default async function Leads() {
  const session = await getServerSession(authOptions);
  const gymId = (session?.user as { gymId?: string | null } | undefined)?.gymId;
  if (!gymId) redirect("/login");

  const leads = await prisma.lead.findMany({ where: { gymId }, orderBy: { createdAt: "desc" }, take: 80 });
  const byStatus = STATUSES.map((s) => ({ s, n: leads.filter((l) => l.status === s).length }));

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold sm:text-2xl">Lead pipeline</h1>
      <div className="flex flex-wrap gap-2">
        {byStatus.map(({ s, n }) => (
          <span key={s} className="rounded-full border border-navy-border bg-navy-surface px-3 py-1 text-xs capitalize text-ink-dim">{s}: <b className="text-ink">{n}</b></span>
        ))}
      </div>
      <section className="overflow-hidden rounded-xl border border-navy-border bg-navy-surface">
        <ul>
          {leads.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-border/60 px-4 py-2.5 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{l.name}</p>
                <p className="text-[11px] text-ink-faint">{l.source.replace("_", " ")} · {l.interestedIn ?? "general"} · {l.phone}</p>
              </div>
              <form action={setLeadStatus} className="flex items-center gap-2">
                <input type="hidden" name="leadId" value={l.id} />
                <select name="status" defaultValue={l.status} className="rounded-lg border border-navy-border bg-navy-canvas px-2 py-1.5 text-xs capitalize outline-none focus:border-bp">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" className="rounded-lg bg-bp/20 px-2.5 py-1.5 text-xs font-medium text-bp-pale hover:bg-bp/30">Save</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
