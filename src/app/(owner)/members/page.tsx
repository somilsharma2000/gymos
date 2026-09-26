import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { addMember } from "@/lib/actions";

export default async function Members() {
  const session = await getServerSession(authOptions);
  const gymId = (session?.user as { gymId?: string | null } | undefined)?.gymId;
  if (!gymId) redirect("/login");

  const [members, plans] = await Promise.all([
    prisma.member.findMany({ where: { gymId }, orderBy: { joinDate: "desc" }, take: 50 }),
    prisma.membershipPlan.findMany({ where: { gymId, active: true } }),
  ]);

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold sm:text-2xl">Members <span className="text-sm font-normal text-ink-dim">({members.length} shown of {members.length})</span></h1>

      <form action={addMember} className="grid gap-3 rounded-xl border border-navy-border bg-navy-surface p-4 sm:grid-cols-5">
        <input name="name" required placeholder="Member name" className="rounded-lg border border-navy-border bg-navy-canvas px-3 py-2 text-sm outline-none placeholder:text-ink-faint focus:border-bp sm:col-span-2" />
        <input name="phone" required placeholder="Phone" inputMode="tel" className="rounded-lg border border-navy-border bg-navy-canvas px-3 py-2 text-sm outline-none placeholder:text-ink-faint focus:border-bp" />
        <select name="planName" className="rounded-lg border border-navy-border bg-navy-canvas px-3 py-2 text-sm outline-none focus:border-bp">
          {plans.map((p) => <option key={p.id} value={p.name}>{p.name} · ₹{p.price}</option>)}
        </select>
        <button type="submit" className="rounded-lg bg-bp px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Add member</button>
      </form>

      <section className="overflow-hidden rounded-xl border border-navy-border bg-navy-surface">
        <ul>
          {members.map((m) => {
            const expiry = m.expiryDate ? m.expiryDate.toLocaleDateString("en-IN") : "—";
            return (
              <li key={m.id} className="flex items-center justify-between gap-3 border-b border-navy-border/60 px-4 py-2.5 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="text-[11px] text-ink-faint">{m.phone} · joined {m.joinDate?.toLocaleDateString("en-IN") ?? "—"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {m.riskStatus === "at_risk" && <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] text-amber">at risk</span>}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${m.status === "active" ? "bg-success/15 text-success" : "bg-ink-faint/15 text-ink-dim"}`}>
                    {m.status}
                  </span>
                  <span className="text-[11px] text-ink-dim">till {expiry}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
