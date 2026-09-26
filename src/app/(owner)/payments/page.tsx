import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { recordPayment } from "@/lib/actions";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default async function Payments() {
  const session = await getServerSession(authOptions);
  const gymId = (session?.user as { gymId?: string | null } | undefined)?.gymId;
  if (!gymId) redirect("/login");

  const [payments, sum] = await Promise.all([
    prisma.payment.findMany({ where: { gymId }, orderBy: { paidAt: "desc" }, take: 50 }),
    prisma.payment.aggregate({ where: { gymId, status: "paid" }, _sum: { amount: true } }),
  ]);

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-xl font-semibold sm:text-2xl">Payments</h1>
        <p className="text-sm text-ink-dim">Collected all-time: <b className="text-success">{inr(sum._sum.amount ?? 0)}</b></p>
      </div>

      <form action={recordPayment} className="grid gap-3 rounded-xl border border-navy-border bg-navy-surface p-4 sm:grid-cols-4">
        <input name="memberName" required placeholder="Member name" className="rounded-lg border border-navy-border bg-navy-canvas px-3 py-2 text-sm outline-none placeholder:text-ink-faint focus:border-bp" />
        <input name="amount" required type="number" min="1" placeholder="Amount ₹" className="rounded-lg border border-navy-border bg-navy-canvas px-3 py-2 text-sm outline-none placeholder:text-ink-faint focus:border-bp" />
        <select name="method" className="rounded-lg border border-navy-border bg-navy-canvas px-3 py-2 text-sm outline-none focus:border-bp">
          <option value="upi">UPI</option><option value="cash">Cash</option><option value="card">Card</option>
        </select>
        <button type="submit" className="rounded-lg bg-bp px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Record payment</button>
      </form>

      <section className="overflow-hidden rounded-xl border border-navy-border bg-navy-surface">
        <ul>
          {payments.map((p) => (
            <li key={p.id} className="flex items-center justify-between border-b border-navy-border/60 px-4 py-2.5 last:border-0">
              <div>
                <p className="text-sm font-medium">{p.memberName}</p>
                <p className="text-[11px] text-ink-faint">{p.paidAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {p.method.toUpperCase()} · {p.invoiceNo}</p>
              </div>
              <span className="text-sm font-semibold text-success">{inr(p.amount)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
