// Public demo overview: reads the LIVE database when one is attached,
// falls back to the bundled seeded dataset otherwise (zero-setup Vercel deploys).
import { prisma } from "@/lib/prisma";
import type { DemoMember, DemoLead } from "@/lib/demo-data";
import * as fallback from "@/lib/demo-data";

export type Overview = {
  gym: { name: string; city: string | null; plan: string };
  stats: {
    members: number; activeMembers: number; leads: number; newLeads: number;
    wonLeads: number; revenue: number; checkInsToday: number;
    classes: number; trainers: number; expiringSoon: number;
  };
  members: DemoMember[];
  leads: DemoLead[];
};

export async function getOverview(): Promise<{ data: Overview; live: boolean }> {
  try {
    const gym = await prisma.gym.findFirst({ where: { isPublic: true, active: true } });
    if (!gym) throw new Error("no public gym");
    const now = new Date();
    const weekAhead = new Date(now.getTime() + 7 * 86400000);

    const [members, activeMembers, leads, newLeads, wonLeads, revenue, checkInsToday, classes, trainers, expiringSoon] =
      await Promise.all([
        prisma.member.count({ where: { gymId: gym.id } }),
        prisma.member.count({ where: { gymId: gym.id, status: "active" } }),
        prisma.lead.count({ where: { gymId: gym.id } }),
        prisma.lead.count({ where: { gymId: gym.id, status: { in: ["new", "contacted"] } } }),
        prisma.lead.count({ where: { gymId: gym.id, status: "won" } }),
        prisma.payment.aggregate({ where: { gymId: gym.id, status: "paid" }, _sum: { amount: true } }),
        prisma.attendanceRecord.count({ where: { gymId: gym.id, checkInTime: { gte: new Date(now.toDateString()) } } }),
        prisma.gymClass.count({ where: { gymId: gym.id, active: true } }),
        prisma.trainer.count({ where: { gymId: gym.id, active: true } }),
        prisma.member.count({ where: { gymId: gym.id, status: "active", expiryDate: { lte: weekAhead } } }),
      ]);

    const [memberRows, leadRows] = await Promise.all([
      prisma.member.findMany({ where: { gymId: gym.id }, orderBy: { joinDate: "desc" }, take: 8 }),
      prisma.lead.findMany({ where: { gymId: gym.id }, orderBy: { createdAt: "desc" }, take: 8 }),
    ]);

    return {
      live: true,
      data: {
        gym: { name: gym.name, city: gym.city, plan: gym.plan },
        stats: {
          members, activeMembers, leads, newLeads, wonLeads,
          revenue: revenue._sum.amount ?? 0, checkInsToday,
          classes, trainers, expiringSoon,
        },
        members: memberRows.map((m) => ({
          name: m.name, phone: m.phone,
          plan: "—", // plan shown on member detail; demo card keeps it light
          joinDate: m.joinDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—",
          expiryDate: m.expiryDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—",
          tier: m.loyaltyTier,
          risk: m.riskStatus === "at_risk" ? "at_risk" : null,
        })),
        leads: leadRows.map((l) => ({
          name: l.name,
          source: l.source.replace("_", " "),
          status: l.status as DemoLead["status"],
          interest: l.interestedIn ?? "General",
        })),
      },
    };
  } catch {
    // No DATABASE_URL (or DB unreachable) — serve the bundled seeded dataset.
    return {
      live: false,
      data: {
        gym: fallback.demoGym,
        stats: fallback.demoStats,
        members: fallback.demoMembers.slice(0, 8),
        leads: fallback.demoLeads.slice(0, 8),
      },
    };
  }
}
