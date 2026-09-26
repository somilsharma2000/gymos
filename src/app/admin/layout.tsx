import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// SUPER ADMIN — Beyond Pixells only. Full control across every gym.
// Visitors and gym owners never see this surface; the gate is role-based.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "superadmin") redirect("/login");
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-navy-border bg-navy-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-bp font-bold text-white">BP</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Super Admin</p>
              <p className="text-[11px] text-ink-dim">Beyond Pixells · full control</p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-xs font-medium">
            <Link href="/admin" className="text-ink-dim hover:text-white">Overview</Link>
            <Link href="/admin/leads" className="text-ink-dim hover:text-white">Leads</Link>
            <Link href="/admin/gyms" className="text-ink-dim hover:text-white">Gyms</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
