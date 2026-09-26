// Demo gym dataset — the public, read-only demo shown at /demo.
// Mirrors the seeded demo gym (PULSE Hyderabad) from the legacy platform so the
// public demo looks alive from day one. No real members, no real money.
// When DATABASE_URL is set, /demo reads live from Postgres instead (see getOverview()).

export type DemoMember = {
  name: string;
  phone: string;
  plan: string;
  joinDate: string;
  expiryDate: string;
  tier: string;
  risk: "ok" | "at_risk" | null;
};

export type DemoLead = {
  name: string;
  source: string;
  status: "new" | "contacted" | "trial" | "won" | "lost";
  interest: string;
};

export type DemoPayment = {
  member: string;
  amount: number;
  method: "upi" | "cash" | "card";
  when: string;
};

export type DemoClass = {
  title: string;
  trainer: string;
  day: string;
  time: string;
  booked: number;
  capacity: number;
};

export const demoGym = {
  name: "PULSE Fitness",
  city: "Hyderabad",
  plan: "Growth",
};

export const demoStats = {
  members: 110,
  activeMembers: 108,
  leads: 78,
  newLeads: 18,
  wonLeads: 15,
  revenue: 921026,
  checkInsToday: 47,
  classes: 21,
  trainers: 10,
  expiringSoon: 5,
};

// 12-week revenue trend (INR), oldest first — rendered as CSS bars.
export const revenueTrend = [61000, 63500, 66200, 65100, 69800, 72400, 71000, 75600, 78900, 77200, 80400, 83600];

export const demoMembers: DemoMember[] = [
  { name: "Tanvi Kapoor", phone: "98161 72835", plan: "Quarterly", joinDate: "21 Sep 2026", expiryDate: "20 Mar 2027", tier: "bronze", risk: null },
  { name: "Rahul Verma", phone: "98100 00000", plan: "Half-yearly", joinDate: "4 Sep 2026", expiryDate: "3 Mar 2027", tier: "bronze", risk: null },
  { name: "Sanjay Singh", phone: "91498 28513", plan: "Annual", joinDate: "14 Oct 2025", expiryDate: "2 Sep 2026", tier: "silver", risk: "at_risk" },
  { name: "Rohan Singh", phone: "95250 44022", plan: "Annual Gold", joinDate: "7 Oct 2025", expiryDate: "1 Oct 2026", tier: "gold", risk: null },
  { name: "Geeta Iyer", phone: "96282 56289", plan: "Quarterly", joinDate: "22 Aug 2025", expiryDate: "4 Sep 2026", tier: "silver", risk: "at_risk" },
  { name: "Navya Kumar", phone: "94742 13134", plan: "Monthly", joinDate: "6 Apr 2026", expiryDate: "5 Sep 2026", tier: "silver", risk: "at_risk" },
  { name: "Arjun Mehta", phone: "98480 22331", plan: "Half-yearly", joinDate: "12 Jun 2026", expiryDate: "11 Dec 2026", tier: "bronze", risk: null },
  { name: "Kavya Reddy", phone: "97012 33445", plan: "Annual", joinDate: "2 Feb 2026", expiryDate: "1 Feb 2027", tier: "gold", risk: null },
];

export const demoLeads: DemoLead[] = [
  { name: "Sneha Pillai", source: "Instagram", status: "new", interest: "Muscle Gain" },
  { name: "Amit Joshi", source: "Referral", status: "contacted", interest: "Yoga" },
  { name: "Vikram Rao", source: "Walk-in", status: "trial", interest: "Weight Loss" },
  { name: "Priya Nair", source: "Instagram", status: "new", interest: "Zumba" },
  { name: "Karthik S.", source: "WhatsApp", status: "contacted", interest: "Strength" },
  { name: "Meera Das", source: "Website", status: "won", interest: "General Fitness" },
  { name: "Aditya Kaul", source: "Walk-in", status: "lost", interest: "Cardio" },
  { name: "Ishita Bose", source: "Referral", status: "new", interest: "Pilates" },
];

export const demoPayments: DemoPayment[] = [
  { member: "Rohan Singh", amount: 14999, method: "upi", when: "Today, 9:14 AM" },
  { member: "Tanvi Kapoor", amount: 5499, method: "upi", when: "Today, 8:02 AM" },
  { member: "Arjun Mehta", amount: 8999, method: "cash", when: "Yesterday, 7:41 PM" },
  { member: "Kavya Reddy", amount: 3999, method: "upi", when: "Yesterday, 6:18 PM" },
  { member: "Rahul Verma", amount: 8999, method: "upi", when: "Yesterday, 5:55 PM" },
];

export const demoClasses: DemoClass[] = [
  { title: "HIIT Express", trainer: "Vikas", day: "Today", time: "7:00 AM", booked: 17, capacity: 20 },
  { title: "Power Yoga", trainer: "Anjali", day: "Today", time: "8:30 AM", booked: 12, capacity: 20 },
  { title: "Strength 101", trainer: "Imran", day: "Today", time: "6:30 PM", booked: 19, capacity: 20 },
  { title: "Zumba Burn", trainer: "Ritika", day: "Today", time: "7:30 PM", booked: 14, capacity: 25 },
];

export const automationFeed = [
  { time: "9:14 AM", text: "UPI payment ₹14,999 received — Rohan Singh renewed (Annual Gold)", type: "payment" },
  { time: "8:40 AM", text: "WhatsApp renewal reminder sent to 5 members expiring this week", type: "whatsapp" },
  { time: "8:02 AM", text: "QR check-in: Tanvi Kapoor entered (47th check-in today)", type: "checkin" },
  { time: "7:55 AM", text: "At-risk alert: Geeta Iyer hasn't visited in 21 days — follow-up task created", type: "risk" },
  { time: "Yesterday", text: "Lead Sneha Pillai auto-replied from Instagram DM, trial booked Friday", type: "lead" },
];

export const expiringSoon = demoMembers.filter((m) => m.risk === "at_risk").map((m) => m.name);
