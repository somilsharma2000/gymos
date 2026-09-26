// Real backend API: returns the demo gym overview as JSON.
// Proof of the backend layer — the same shape the authenticated owner app
// will consume once auth + DATABASE_URL are wired (see docs/ARCHITECTURE.md).
import { demoGym, demoStats, demoMembers, demoLeads, revenueTrend } from "@/lib/demo-data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    gym: demoGym,
    stats: demoStats,
    members: demoMembers.slice(0, 8),
    leads: demoLeads.slice(0, 8),
    revenueTrend,
    meta: { demo: true, readonly: true },
  });
}
