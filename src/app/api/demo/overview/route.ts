// Public demo overview API: live database when attached, seeded dataset otherwise.
import { getOverview } from "@/lib/gym-data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, live } = await getOverview();
  return NextResponse.json({ ...data, meta: { demo: true, readonly: true, live } });
}
