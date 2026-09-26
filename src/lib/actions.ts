"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireGymId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const gymId = (session?.user as { gymId?: string | null } | undefined)?.gymId;
  if (!gymId) throw new Error("No gym on session — re-login after DB attach.");
  return gymId;
}

export async function addMember(formData: FormData) {
  const gymId = await requireGymId();
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const planName = String(formData.get("planName") || "Monthly");
  const amount = Number(formData.get("amount") || 1999);
  if (!name || !phone) return;

  const plan = await prisma.membershipPlan.findFirst({ where: { gymId, name: planName } });
  const days = plan?.durationDays ?? 30;
  const start = new Date();
  const expiry = new Date(Date.now() + days * 86400000);

  const member = await prisma.member.create({
    data: {
      gymId,
      name,
      phone,
      joinDate: start,
      expiryDate: expiry,
      status: "active",
    },
  });
  if (plan) {
    await prisma.membership.create({
      data: {
        gymId, memberId: member.id, planId: plan.id,
        planName: plan.name, amount: plan.price,
        startDate: start, endDate: expiry, status: "active",
      },
    });
    await prisma.payment.create({
      data: { gymId, memberId: member.id, memberName: member.name, amount: plan.price, method: "cash", status: "paid" },
    });
  }
  revalidatePath("/members");
  revalidatePath("/dashboard");
}

export async function setLeadStatus(formData: FormData) {
  const gymId = await requireGymId();
  const leadId = String(formData.get("leadId") || "");
  const status = String(formData.get("status") || "");
  if (!leadId || !status) return;
  await prisma.lead.updateMany({ where: { id: leadId, gymId }, data: { status } });
  if (status === "won") {
    const lead = await prisma.lead.findFirst({ where: { id: leadId, gymId } });
    if (lead) {
      const exists = await prisma.member.findFirst({ where: { gymId, phone: lead.phone } });
      if (!exists) {
        await prisma.member.create({
          data: { gymId, name: lead.name, phone: lead.phone, status: "active", joinDate: new Date() },
        });
      }
    }
  }
  revalidatePath("/leads");
  revalidatePath("/dashboard");
}

export async function recordPayment(formData: FormData) {
  const gymId = await requireGymId();
  const memberName = String(formData.get("memberName") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  const method = String(formData.get("method") || "upi");
  if (!memberName || amount <= 0) return;
  const member = await prisma.member.findFirst({ where: { gymId, name: memberName } });
  await prisma.payment.create({
    data: { gymId, memberId: member?.id, memberName, amount, method, status: "paid", invoiceNo: `INV-${Date.now()}` },
  });
  revalidatePath("/payments");
  revalidatePath("/dashboard");
}
