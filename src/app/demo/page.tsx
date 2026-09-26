import Link from "next/link";
import {
  demoGym, demoStats, demoMembers, demoLeads, demoPayments,
  demoClasses, automationFeed, revenueTrend,
} from "@/lib/demo-data";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-navy-border bg-navy-surface p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-dim">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-success">{sub}</p>}
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-success/15 text-success", won: "bg-success/15 text-success",
    trial: "bg-bp/15 text-bp", contacted: "bg-bp/15 text-bp",
    new: "bg-bp-pale/15 text-bp-pale", booked: "bg-bp/15 text-bp",
    at_risk: "bg-amber/15 text-amber", lost: "bg-ink-faint/15 text-ink-dim",
    upcoming: "bg-bp/15 text-bp", reminder_sent: "bg-amber/15 text-amber",
  };
  const cls = map[status] ?? "bg-navy-raised text-ink-dim";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{status.replace(/_/g, " ")}</span>;
}

export default function DemoPage() {
  const maxRev = Math.max(...revenueTrend);
  return (
    <main className="min-h-screen">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-navy-border bg-navy-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-bp font-grotesk font-bold text-white">G</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Gym OS</p>
              <p className="text-[11px] text-ink-dim">by Beyond Pixells</p>
            </div>
          </div>
          <a
            href="https://wa.me/917737077479?text=Hi!%20I%20run%20a%20gym%20and%20want%20Gym%20OS%20for%20my%20gym."
            className="rounded-lg bg-bp px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            Connect my gym
          </a>
        </div>
      </header>

      {/* demo banner */}
      <div className="border-b border-navy-border bg-navy-surface">
        <p className="mx-auto max-w-6xl px-4 py-2 text-center text-[11px] text-ink-dim">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber align-middle" />
          Live product demo · read-only · seeded demo data of {demoGym.name}, {demoGym.city}
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:py-8">
        {/* owner greeting */}
        <section className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">Owner Dashboard</h1>
            <p className="text-sm text-ink-dim">{demoGym.name} · {demoGym.city} · {demoGym.plan} plan</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-dim">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" /> All systems running
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Active members" value={demoStats.activeMembers.toString()} sub={`+${demoStats.newLeads} leads in pipeline`} />
          <Kpi label="Revenue collected" value={inr(demoStats.revenue)} sub="₹9.2L this quarter" />
          <Kpi label="Check-ins today" value={demoStats.checkInsToday.toString()} sub="via QR — no queues" />
          <Kpi label="Expiring this week" value={demoStats.expiringSoon.toString()} sub="WhatsApp reminders queued" />
        </section>

        {/* revenue trend */}
        <section className="rounded-xl border border-navy-border bg-navy-surface p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Revenue trend — last 12 weeks</h2>
            <span className="text-xs text-success">▲ 37%</span>
          </div>
          <div className="flex h-28 items-end gap-1.5 sm:h-36">
            {revenueTrend.map((v, i) => (
              <div key={i} className="flex-1 rounded-t bg-bp/80 transition-all" style={{ height: `${(v / maxRev) * 100}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-ink-faint">
            <span>12 weeks ago</span><span>Today</span>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* members */}
          <section className="overflow-hidden rounded-xl border border-navy-border bg-navy-surface">
            <div className="flex items-center justify-between border-b border-navy-border px-4 py-3">
              <h2 className="text-sm font-semibold">Members</h2>
              <span className="text-xs text-ink-dim">{demoStats.members} total</span>
            </div>
            <ul>
              {demoMembers.map((m) => (
                <li key={m.name} className="flex items-center justify-between gap-3 border-b border-navy-border/60 px-4 py-2.5 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="text-[11px] text-ink-faint">{m.plan} · expires {m.expiryDate}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] capitalize text-ink-dim">{m.tier}</span>
                    <Badge status={m.risk ?? "active"} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* leads */}
          <section className="overflow-hidden rounded-xl border border-navy-border bg-navy-surface">
            <div className="flex items-center justify-between border-b border-navy-border px-4 py-3">
              <h2 className="text-sm font-semibold">Lead pipeline</h2>
              <span className="text-xs text-ink-dim">{demoStats.leads} total · {demoStats.wonLeads} won</span>
            </div>
            <ul>
              {demoLeads.map((l) => (
                <li key={l.name} className="flex items-center justify-between gap-3 border-b border-navy-border/60 px-4 py-2.5 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{l.name}</p>
                    <p className="text-[11px] text-ink-faint">{l.source} · {l.interest}</p>
                  </div>
                  <Badge status={l.status} />
                </li>
              ))}
            </ul>
          </section>

          {/* payments */}
          <section className="overflow-hidden rounded-xl border border-navy-border bg-navy-surface">
            <div className="flex items-center justify-between border-b border-navy-border px-4 py-3">
              <h2 className="text-sm font-semibold">Recent payments</h2>
              <span className="text-xs text-success">UPI-first</span>
            </div>
            <ul>
              {demoPayments.map((p, i) => (
                <li key={i} className="flex items-center justify-between gap-3 border-b border-navy-border/60 px-4 py-2.5 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.member}</p>
                    <p className="text-[11px] text-ink-faint">{p.when} · {p.method.toUpperCase()}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-success">{inr(p.amount)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* classes */}
          <section className="overflow-hidden rounded-xl border border-navy-border bg-navy-surface">
            <div className="flex items-center justify-between border-b border-navy-border px-4 py-3">
              <h2 className="text-sm font-semibold">Classes today</h2>
              <span className="text-xs text-ink-dim">{demoStats.classes} weekly · {demoStats.trainers} trainers</span>
            </div>
            <ul>
              {demoClasses.map((c) => (
                <li key={c.title} className="border-b border-navy-border/60 px-4 py-2.5 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{c.title}</p>
                      <p className="text-[11px] text-ink-faint">{c.time} · {c.trainer}</p>
                    </div>
                    <span className="shrink-0 text-xs text-ink-dim">{c.booked}/{c.capacity} booked</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-navy-raised">
                    <div className="h-1 rounded-full bg-bp" style={{ width: `${(c.booked / c.capacity) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* automation feed */}
        <section className="rounded-xl border border-navy-border bg-navy-surface p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Automation feed — things Gym OS did on its own</h2>
          <ul className="space-y-2">
            {automationFeed.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-bp" />
                <p><span className="text-ink-faint">{a.time} · </span>{a.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-bp/30 bg-gradient-to-b from-bp/10 to-transparent p-6 text-center sm:p-10">
          <h2 className="text-lg font-semibold sm:text-2xl">This is your gym, running itself.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-dim">
            Renewals collected, renewals chased on WhatsApp, leads followed up — while you train members.
            We set your gym up in 24 hours and move your register for you.
          </p>
          <a
            href="https://wa.me/917737077479?text=Hi!%20I%20run%20a%20gym%20and%20want%20Gym%20OS%20for%20my%20gym."
            className="mt-5 inline-block rounded-xl bg-bp px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Get Gym OS for my gym →
          </a>
          <p className="mt-3 text-[11px] text-ink-faint">Flat pricing · unlimited members · cancel anytime</p>
        </section>
      </div>

      <footer className="border-t border-navy-border py-6 text-center text-[11px] text-ink-faint">
        Gym OS is a product of Beyond Pixells · beyondpixells@gmail.com · +91 77370 77479
      </footer>
    </main>
  );
}
