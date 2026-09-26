import Link from "next/link";

export default function Login() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-navy-border bg-navy-surface p-6">
        <h1 className="text-lg font-semibold">Owner login</h1>
        <p className="mt-2 text-sm text-ink-dim">
          Gym owner authentication arrives with the platform phase (see docs/ROADMAP in the repo).
          Until then, explore the live demo.
        </p>
        <Link href="/demo" className="mt-4 inline-block rounded-xl bg-bp px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
          See How It Looks →
        </Link>
      </div>
    </main>
  );
}
