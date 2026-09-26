// Gym OS blog — honest guides for Indian gym owners. Same visual system as the
// landing: navy canvas, blue accent, Space Grotesk headings.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readMinutes: number;
  blocks: Block[];
  faq: { q: string; a: string }[];
};

export const posts: BlogPost[] = [
  {
    slug: "whatsapp-renewal-system",
    title: "The WhatsApp renewal system: how gyms stop losing members silently",
    description:
      "Most gyms don't lose members to competitors — they lose them to silence. A renewal system that reaches members on WhatsApp turns quiet expiries into collected fees.",
    date: "2026-09-27",
    readMinutes: 5,
    blocks: [
      { type: "p", text: "Every gym has the same quiet leak. A member's plan expires on a Tuesday. Nobody notices until they stop showing up two weeks later. By then they've already replied to another gym's Instagram ad, or simply drifted off. The owner finds out at month-end when the collections don't add up." },
      { type: "h2", text: "Why registers leak money" },
      { type: "p", text: "A paper register or an Excel sheet tells you a member expired only if you go looking. In a gym running morning-to-evening shifts, nobody goes looking. The follow-up happens late, on the phone, by whoever remembers — which in practice means it usually doesn't happen." },
      { type: "callout", text: "The fix isn't more discipline. It's making the follow-up happen without anyone remembering to do it." },
      { type: "h2", text: "How an automated renewal flow works" },
      { type: "p", text: "Gym OS watches every membership's expiry date and runs the same disciplined routine your best front-desk person would — every single time, for every single member:" },
      { type: "ul", items: [
        "Day 7 before expiry: a friendly WhatsApp reminder with the member's plan and a UPI payment link.",
        "Day 3: a nudge, phrased differently, with the same one-tap payment.",
        "Day 1: a final reminder, so the renewal happens before the member even thinks of skipping.",
        "On payment: the membership extends automatically, a receipt arrives on WhatsApp, and the owner dashboard updates the same second.",
      ]},
      { type: "h2", text: "What the owner actually sees" },
      { type: "p", text: "The renewal pipeline shows every member with their expiry date, colour-coded by urgency, and WhatsApp delivery status. You stop guessing who's slipping and start seeing a queue of exactly who to talk to — and most of the queue resolves itself." },
      { type: "h2", text: "The consent part (because it matters)" },
      { type: "p", text: "Under India's DPDP Act, reminders only go to members who opted in. Gym OS captures consent at every touchpoint — lead forms, member onboarding — and keeps a record of it. Your members get useful messages they agreed to, and your gym stays on the right side of the law." },
      { type: "p", text: "If renewals are your gym's biggest silent leak, book a free demo and we'll show you the renewal pipeline running on sample data — then set it up on your member base in about a day." },
    ],
    faq: [
      { q: "Do members need to install an app?", a: "No. Everything arrives on WhatsApp — reminders, QR passes, receipts, plans. Members don't download anything." },
      { q: "Is sending WhatsApp reminders legal?", a: "Yes, when the member has opted in. Gym OS captures and records consent at every lead form and at member onboarding, in line with India's DPDP Act." },
      { q: "What does it cost?", a: "Gym OS uses flat monthly pricing with no per-member fees — you pay the same whether you manage 200 members or 2,000." },
    ],
  },
  {
    slug: "register-vs-gym-os",
    title: "From register to Gym OS: what actually changes in your first week",
    description:
      "Switching a working gym from a paper register to software sounds like disruption. Here's the honest day-by-day of what happens — and what doesn't.",
    date: "2026-09-27",
    readMinutes: 5,
    blocks: [
      { type: "p", text: "Most gym owners don't avoid software because they love registers. They avoid it because switching feels dangerous: what if the front desk freezes mid-check-in? What if we lose a week of data? Here's what the actual first week looks like when we move a gym onto Gym OS." },
      { type: "h2", text: "Day 1: your data moves, not your routine" },
      { type: "p", text: "You send us photos of your register or your Excel sheet. Our team transfers every member — names, phones, plans, expiry dates — into Gym OS. You don't type anything. The register stays on the desk as a backup; you'll stop reaching for it on your own within a week." },
      { type: "h2", text: "Day 2: the front desk learns one new thing" },
      { type: "p", text: "Instead of flipping pages, the desk scans a member's QR code as they walk in. Entry takes about a second. There's one training call, and it's shorter than most gym owners expect — the daily interface is deliberately small: check-in, add member, log payment." },
      { type: "h2", text: "Day 3: WhatsApp starts working for you" },
      { type: "p", text: "Expiry reminders begin going out automatically to members who've opted in. This is usually the day owners stop being sceptical — the first few renewals arrive as UPI payments that nobody had to chase." },
      { type: "h2", text: "Days 4-7: you start opening the dashboard instead of asking" },
      { type: "ul", items: [
        "Collected today, without counting cash at close.",
        "Who's expiring this week, without asking the desk.",
        "Which leads never got a follow-up, without checking Instagram DMs.",
      ]},
      { type: "callout", text: "The register told you what happened. Gym OS tells you what's about to happen — that's the whole difference." },
      { type: "h2", text: "What does NOT change" },
      { type: "p", text: "Your staff doesn't become technical. Your members don't download anything. Your fees don't get a per-member tax as you grow. And your data stays yours — every record is exportable, any day you ask." },
      { type: "p", text: "Want to see it on your own numbers? Book a free demo — we'll walk your member list through the system and show you exactly what week one would look like for your gym." },
    ],
    faq: [
      { q: "How long does setup really take?", a: "About 24 hours end to end: data transfer, branded setup, staff training and your owner dashboard — once we have your register photos or Excel file." },
      { q: "What if my staff isn't technical?", a: "The daily interface is three actions: scan a QR to check a member in, add a member, log a payment. One training call covers it." },
      { q: "Can I get my data out?", a: "Yes — every record is exportable at any time. Your data is yours, and there's a written data processing agreement per India's DPDP Act, Sec 8(2)." },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
