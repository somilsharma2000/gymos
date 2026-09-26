import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Website lead capture — fully self-contained (no Base44).
// Marketing landing form (public/landing.html) posts here; leads land in the
// product's own Postgres under a dedicated "Website Leads" gym so the owner
// app can show them in the Leads screen.
export const dynamic = "force-dynamic";

const INBOX_GYM_NAME = "Website Leads (Beyond Pixells)";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (name.length < 2 || !/^[+\d][\d\s\-()]{6,18}$/.test(phone)) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    // Find or create the inbox gym that owns all website leads
    let gym = await prisma.gym.findFirst({ where: { name: INBOX_GYM_NAME } });
    if (!gym) {
      gym = await prisma.gym.create({
        data: { name: INBOX_GYM_NAME, plan: "trial", active: true },
      });
    }

    const notes =
      [
        body.city ? `City: ${String(body.city).trim()}` : null,
        body.business ? `Gym: ${String(body.business).trim()}` : null,
        body.email ? `Email: ${String(body.email).trim()}` : null,
      ]
        .filter(Boolean)
        .join(" | ") || null;

    await prisma.lead.create({
      data: {
        gymId: gym.id,
        name,
        phone,
        source: "website",
        status: "new",
        interestedIn: String(body.interest ?? "Gym OS free demo").slice(0, 200),
        notes,
        consent: true, // DPDP consent captured on the form
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // DB unreachable — the front-end form falls back to WhatsApp, so the lead
    // is never lost.
    return NextResponse.json({ ok: false, error: "db_unavailable" }, { status: 503 });
  }
}
