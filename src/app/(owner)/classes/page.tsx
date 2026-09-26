import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Classes() {
  const session = await getServerSession(authOptions);
  const gymId = (session?.user as { gymId?: string | null } | undefined)?.gymId;
  if (!gymId) redirect("/login");

  const classes = await prisma.gymClass.findMany({
    where: { gymId, active: true },
    include: { trainer: true },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold sm:text-2xl">Classes <span className="text-sm font-normal text-ink-dim">({classes.length} weekly)</span></h1>
      <section className="overflow-hidden rounded-xl border border-navy-border bg-navy-surface">
        <ul>
          {classes.map((c) => (
            <li key={c.id} className="border-b border-navy-border/60 px-4 py-3 last:border-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="text-[11px] text-ink-faint">{c.day.toUpperCase()} {c.startTime} · {c.trainer?.name ?? "Unassigned"}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-dim">{c.booked}/{c.capacity}</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-navy-raised">
                <div className="h-1 rounded-full bg-bp" style={{ width: `${(c.booked / c.capacity) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
