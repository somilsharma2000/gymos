"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const tabs = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/members", label: "Members" },
  { href: "/leads", label: "Leads" },
  { href: "/payments", label: "Payments" },
  { href: "/classes", label: "Classes" },
];

export default function OwnerNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 border-b border-navy-border bg-navy-canvas/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-bp font-grotesk font-bold text-white">G</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Gym OS</p>
              <p className="text-[11px] text-ink-dim">{userName}</p>
            </div>
          </div>
          <button
            onClick={() => { void signOut({ redirect: false }).then(() => router.push("/login")); }}
            className="rounded-lg border border-navy-border px-3 py-1.5 text-xs text-ink-dim hover:bg-navy-raised"
          >
            Log out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-bp text-white" : "text-ink-dim hover:bg-navy-raised"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
