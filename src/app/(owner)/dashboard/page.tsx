import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const gymId = (session?.user as { gymId?: string | null } | undefined)?.gymId;
  if (!gymId) redirect("/login");
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) return <p className="text-sm text-ink-dim">No gym assigned to this account.</p>;

  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [members, activeMembers, leads, newLeads, monthRevenue, expiring, recentPayments, checkInsToday, renewals] =
    await Promise.all([
      prisma.member.count({ where: { gymId } }),
      prisma.member.count({ where: { gymId, status: "active" } }),
      prisma.lead.count({ where: { gymId } }),
      prisma.lead.count({ where: { gymId, status: { in: ["new", "contacted"] } } }),
      prisma.payment.aggregate({ where: { gymId, status: "paid", paidAt: { gte: monthStart } }, _sum: { amount: true } }),
      prisma.member.count({ where: { gymId, status: "active", expiryDate: { lte: weekAhead } } }),
      prisma.payment.findMany({ where: { gymId }, orderBy: { paidAt: "desc" }, take: 5 }),
      prisma.attendanceRecord.count({ where: { gymId, checkInTime: { gte: new Date(now.toDateString()) } } }),
      prisma.renewalPipeline.count({ where: { gymId, stage: { in: ["upcoming", "reminder_sent"] } } }),
    ]);

  const kpis = [
    { label: "Active members", value: activeMembers.toString(), sub: `${members} total`, href: "/members" },
    { label: "Revenue this month", value: inr(monthRevenue._sum.amount ?? 0), sub: "UPI + cash collected", href: "/payments" },
    { label: "Check-ins today", value: checkInsToday.toString(), sub: "QR entries", href: "/members" },
    { label: "Expiring in 7 days", value: expiring.toString(), sub: `${renewals} in renewal pipeline`, href: "/members" },
    { label: "Leads in pipeline", value: newLeads.toString(), sub: `${leads} total leads`, href: "/leads" },
  ];

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">Owner Dashboard</h1>
        <p className="text-sm text-ink-dim">{gym.name} · {gym.city} · live data</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="rounded-xl border border-navy-border bg-navy-surface p-4 transition-colors hover:border-bp/50">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-dim">{k.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{k.value}</p>
            <p className="mt-0.5 text-xs text-ink-faint">{k.sub}</p>
          </Link>
        ))}
      </div>
      <section className="rounded-xl border border-navy-border bg-navy-surface">
        <div className="flex items-center justify-between border-b border-navy-border px-4 py-3">
          <h2 className="text-sm font-semibold">Recent payments</h2>
          <Link href="/payments" className="text-xs text-bp hover:underline">View all →</Link>
        </div>
        <ul>
          {recentPayments.map((p) => (
            <li key={p.id} className="flex items-center justify-between border-b border-navy-border/60 px-4 py-2.5 last:border-0">
              <div>
                <p className="text-sm font-medium">{p.memberName}</p>
                <p className="text-[11px] text-ink-faint">{p.paidAt.toLocaleDateString("en-IN")} · {p.method.toUpperCase()}</p>
              </div>
              <span className="text-sm font-semibold text-success">{inr(p.amount)}</span>
            </li>
          ))}
          {recentPayments.length === 0 && <li className="px-4 py-3 text-xs text-ink-dim">No payments yet.</li>}
        </ul>
      </section>
    </main>
  );
}
