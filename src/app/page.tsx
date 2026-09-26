import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-bp-pale">Beyond Pixells presents</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          Gym OS
          <span className="block text-base font-normal text-ink-dim sm:text-lg">The operating system for Indian gyms</span>
        </h1>
      </div>
      <p className="max-w-md text-sm text-ink-dim sm:text-base">
        Members, payments, leads, QR check-ins and WhatsApp automation — one platform, flat pricing, unlimited members.
        No app downloads. Live in 24 hours.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/demo"
          className="w-full rounded-xl bg-bp px-6 py-3 text-sm font-semibold text-white hover:opacity-90 sm:w-auto"
        >
          See How It Looks →
        </Link>
        <a
          href="https://wa.me/917737077479?text=Hi!%20I%20run%20a%20gym%20and%20want%20Gym%20OS%20for%20my%20gym."
          className="w-full rounded-xl border border-navy-border bg-navy-surface px-6 py-3 text-sm font-semibold hover:bg-navy-raised sm:w-auto"
        >
          Connect my gym
        </a>
      </div>
      <p className="text-[11px] text-ink-faint">Gym OS is a product of Beyond Pixells</p>
    </main>
  );
}
