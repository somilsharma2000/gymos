"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Wrong email or password.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-navy-border bg-navy-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-bp font-grotesk font-bold text-white">G</span>
          <div>
            <h1 className="text-lg font-semibold">Owner login</h1>
            <p className="text-xs text-ink-dim">Gym OS · by Beyond Pixells</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            placeholder="Email" autoComplete="email"
            className="w-full rounded-lg border border-navy-border bg-navy-canvas px-3 py-2.5 text-sm outline-none placeholder:text-ink-faint focus:border-bp"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            placeholder="Password" autoComplete="current-password"
            className="w-full rounded-lg border border-navy-border bg-navy-canvas px-3 py-2.5 text-sm outline-none placeholder:text-ink-faint focus:border-bp"
          />
          {error && <p className="text-xs text-amber">{error}</p>}
          <button
            type="submit" disabled={busy}
            className="w-full rounded-xl bg-bp px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 border-t border-navy-border pt-4 text-xs text-ink-faint">
          <p>Demo owner: <code className="text-ink-dim">owner@pulse.demo</code> / <code className="text-ink-dim">demo1234</code></p>
        </div>
        <div className="mt-3 text-center">
          <Link href="/demo" className="text-xs text-bp hover:underline">Just looking? Open the public demo →</Link>
        </div>
      </div>
    </main>
  );
}
