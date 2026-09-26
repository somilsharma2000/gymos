// Seeds the demo gym (PULSE Fitness) + a real starter structure into PostgreSQL.
// Run: DATABASE_URL="postgresql://..." npm run db:seed
// Deterministic, safe to re-run (clears the demo gym only).

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FIRST = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Rudra", "Tanvi", "Ananya", "Diya", "Myra", "Saanvi", "Aadhya", "Kiara", "Navya", "Rohit", "Kabir"];
const LAST = ["Sharma", "Verma", "Kapoor", "Reddy", "Nair", "Iyer", "Singh", "Kaul", "Mehta", "Das", "Bose", "Pillai", "Joshi", "Rao", "Yadav", "Gupta"];

function phone(i: number) {
  return `9${(800000000 + i * 137911).toString().slice(0, 9)}`;
}

async function main() {
  // fresh demo gym
  await prisma.gym.deleteMany({ where: { isDemo: true } });

  const gym = await prisma.gym.create({
    data: {
      name: "PULSE Fitness",
      city: "Hyderabad",
      plan: "growth",
      isDemo: true,
      isPublic: true,
    },
  });

  const branch = await prisma.branch.create({
    data: { gymId: gym.id, name: "Main Branch", city: "Hyderabad" },
  });

  await prisma.staff.create({
    data: { gymId: gym.id, name: "Gym Owner", role: "owner" },
  });

  const plans = await Promise.all(
    [
      { name: "Monthly", price: 1999, durationDays: 30 },
      { name: "Quarterly", price: 5499, durationDays: 90 },
      { name: "Half-yearly", price: 8999, durationDays: 180 },
      { name: "Annual", price: 14999, durationDays: 365 },
      { name: "Annual Gold", price: 17999, durationDays: 365 },
    ].map((p) => prisma.membershipPlan.create({ data: { ...p, gymId: gym.id } }))
  );

  const trainers = await Promise.all(
    ["Vikas", "Anjali", "Imran", "Ritika", "Sandeep"].map((name, i) =>
      prisma.trainer.create({ data: { gymId: gym.id, name, specialization: ["HIIT", "Yoga", "Strength", "Zumba", "CrossFit"][i] } })
    )
  );

  // 110 members with memberships
  const now = Date.now();
  const day = 86400000;
  for (let i = 0; i < 110; i++) {
    const name = `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`;
    const plan = plans[i % plans.length];
    const join = new Date(now - (30 + (i % 300)) * day);
    const expiry = new Date(now + (5 + (i % 90)) * day);
    const member = await prisma.member.create({
      data: {
        gymId: gym.id,
        branchId: branch.id,
        name,
        phone: phone(i),
        joinDate: join,
        expiryDate: expiry,
        status: i % 13 === 0 ? "expired" : "active",
        loyaltyPoints: (i % 40) * 50,
        loyaltyTier: i % 10 === 0 ? "gold" : i % 3 === 0 ? "silver" : "bronze",
        riskStatus: i % 17 === 0 ? "at_risk" : null,
        riskReason: i % 17 === 0 ? "No visit in 21 days" : null,
      },
    });
    await prisma.membership.create({
      data: {
        gymId: gym.id,
        branchId: branch.id,
        memberId: member.id,
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        startDate: join,
        endDate: expiry,
        status: "active",
      },
    });
    // attendance: last 14 days, ~40% visit
    for (let d = 0; d < 14; d++) {
      if ((i + d) % 5 < 2) {
        await prisma.attendanceRecord.create({
          data: {
            gymId: gym.id,
            memberId: member.id,
            memberName: member.name,
            checkInTime: new Date(now - d * day - ((i % 10) + 6) * 3600000),
            entryMethod: "qr",
          },
        });
      }
    }
    if (i % 17 === 0) {
      await prisma.renewalPipeline.create({
        data: {
          gymId: gym.id,
          memberId: member.id,
          expiryDate: expiry,
          planName: plan.name,
          amount: plan.price,
          stage: i % 34 === 0 ? "reminder_sent" : "upcoming",
        },
      });
    }
  }

  // 78 leads
  const sources = ["walk_in", "instagram", "referral", "website", "whatsapp"];
  const statuses = ["new", "contacted", "trial", "won", "lost"];
  const interests = ["Weight Loss", "Muscle Gain", "Yoga", "Zumba", "Strength", "General Fitness"];
  for (let i = 0; i < 78; i++) {
    const name = `${FIRST[(i * 3) % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`;
    await prisma.lead.create({
      data: {
        gymId: gym.id,
        branchId: branch.id,
        name,
        phone: phone(i + 1000),
        source: sources[i % sources.length],
        status: statuses[i % statuses.length],
        interestedIn: interests[i % interests.length],
        consent: i % 4 !== 0, // DPDP consent mostly captured
        followUpDate: i % 5 === 0 ? new Date(now + 2 * day) : null,
      },
    });
  }

  // classes + bookings
  const classDefs = [
    { title: "HIIT Express", trainer: 0, day: "mon", startTime: "07:00" },
    { title: "Power Yoga", trainer: 1, day: "mon", startTime: "08:30" },
    { title: "Strength 101", trainer: 2, day: "tue", startTime: "18:30" },
    { title: "Zumba Burn", trainer: 3, day: "wed", startTime: "19:30" },
    { title: "CrossFit WOD", trainer: 4, day: "thu", startTime: "06:30" },
  ];
  for (const c of classDefs) {
    await prisma.gymClass.create({
      data: {
        gymId: gym.id,
        branchId: branch.id,
        title: c.title,
        trainerId: trainers[c.trainer].id,
        day: c.day,
        startTime: c.startTime,
        capacity: 20,
        booked: 8 + (c.trainer * 3) % 10,
      },
    });
  }

  // payments (recent)
  for (let i = 0; i < 25; i++) {
    const plan = plans[i % plans.length];
    await prisma.payment.create({
      data: {
        gymId: gym.id,
        memberName: `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`,
        amount: plan.price,
        method: i % 5 === 0 ? "cash" : "upi",
        status: "paid",
        paidAt: new Date(now - i * day),
        invoiceNo: `INV-${1000 + i}`,
      },
    });
  }

  const counts = {
    members: await prisma.member.count({ where: { gymId: gym.id } }),
    leads: await prisma.lead.count({ where: { gymId: gym.id } }),
    payments: await prisma.payment.count({ where: { gymId: gym.id } }),
    classes: await prisma.gymClass.count({ where: { gymId: gym.id } }),
  };
  console.log("Seeded demo gym:", gym.name, counts);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
