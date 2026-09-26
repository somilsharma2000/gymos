import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function toggleGym(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  await prisma.gym.update({ where: { id }, data: { active: !active } });
  revalidatePath("/admin/gyms");
}

export default async function AdminGyms() {
  const gyms = await prisma.gym.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { members: true, leads: true } } },
  });

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">Gyms on the platform</h1>
        <p className="text-sm text-ink-dim">Activate, pause or inspect every tenant.</p>
      </div>
      <section className="space-y-3">
        {gyms.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy-border bg-navy-surface p-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                {g.name}
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${g.active ? "bg-success/15 text-success" : "bg-ink-faint/15 text-ink-dim"}`}>
                  {g.active ? "active" : "paused"}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-ink-dim">
                {g.plan} plan · {g._count.members} members · {g._count.leads} leads
              </p>
            </div>
            <form action={toggleGym}>
              <input type="hidden" name="id" value={g.id} />
              <input type="hidden" name="active" value={String(g.active)} />
              <button className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${g.active ? "bg-navy-raised text-ink-dim" : "bg-bp text-white"}`}>
                {g.active ? "Pause gym" : "Activate gym"}
              </button>
            </form>
          </div>
        ))}
        {gyms.length === 0 && <p className="py-10 text-center text-sm text-ink-dim">No gyms yet.</p>}
      </section>
      <p className="text-xs text-ink-faint">
        <Link href="/admin" className="text-bp hover:underline">← Overview</Link>
      </p>
    </main>
  );
}
