#!/usr/bin/env python3
"""Fresh week batch — Sep 29 to Oct 5, 14 IG/FB posts."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_posts as G

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "week_posts")
os.makedirs(out, exist_ok=True)

POSTS = [
    # (filename, style, params)
    ("tue_1000.png", "stat_callout", {"headline": "Check-in speed decides queue length.", "stat_number": "30", "stat_label": "SECONDS PER MEMBER", "subtitle": "QR scan in. Validated. Door opens.\nThe register takes 5 minutes and lies sometimes."}),
    ("tue_1800.png", "hook_card", {"hook_text": "Your best trainer just retained 3 members.\nYour register just lost 2.", "subtitle": "Manual tracking always nets negative. Automate the counting."}),
    ("wed_1000.png", "before_after", {"before_text": "RENEWAL DAY\n\nExcel open. Calculator out.\nThree phone calls to figure out\nwho even expired this month.", "after_text": "RENEWAL DAY\n\nDashboard shows the list.\nWhatsApp nudges already sent.\nYou just count the payments."}),
    ("wed_1800.png", "list_post", {"hook": "What Gym OS does while you sleep:", "items": ["Renewal nudges go out on D-7", "Trial passes self-validate at the door", "Revenue ledger stays double-checked", "At-risk members get flagged early", "Your website keeps capturing leads"]}),
    ("thu_1000.png", "question_hook", {"question": "How many of your members\nare expired right now?", "subtitle": "If you can't answer without opening a file, that's the problem."}),
    ("thu_1800.png", "stat_callout", {"headline": "The silent leak nobody audits:", "stat_number": "₹4L", "stat_label": "LOST PER YEAR, TYPICAL GYM", "subtitle": "Missed renewals. Cold leads. Untracked dues.\nAll three are automatable."}),
    ("fri_1000.png", "hook_card", {"hook_text": "Happy members refer.\nForgotten members quietly leave.", "subtitle": "The follow-up system IS the retention system."}),
    ("fri_1800.png", "minimal_bold", {"hook": "Premium gyms run on premium systems."}),
    ("sat_1000.png", "list_post", {"hook": "5 numbers every gym owner should know by heart:", "items": ["This month's collected revenue", "Active vs expired member count", "Leads that never got a follow-up", "Members who haven't shown in 14 days", "Renewals due next week"]}),
    ("sat_1800.png", "before_after", {"before_text": "TRIAL PASS ON WHATSAPP\n\nForwarded to 4 friends.\nUsed 9 times.\nYou never knew.", "after_text": "GYM OS TRIAL PASS\n\nSingle-use QR.\nOne scan validates.\nSharing is impossible."}),
    ("sun_1000.png", "question_hook", {"question": "Your gym is closed today.\nIs your website still selling?", "subtitle": "Members sign up at 11 PM. A website never sleeps."}),
    ("sun_1800.png", "stat_callout", {"headline": "From scan to door:", "stat_number": "3", "stat_label": "SECONDS, MEMBER CHECK-IN", "subtitle": "Expired? Unpaid? The system says no politely — and records why."}),
    ("mon_1000.png", "hook_card", {"hook_text": "October's new members\nare won in September.", "subtitle": "Festive season signups go to the gyms that followed up first."}),
    ("mon_1800.png", "minimal_bold", {"hook": "One dashboard. The whole gym."}),
]

styles = {
    "stat_callout": G.style_stat_callout,
    "hook_card": G.style_hook_card,
    "before_after": G.style_before_after,
    "list_post": G.style_list_post,
    "question_hook": G.style_question_hook,
    "minimal_bold": G.style_minimal_bold,
}

for fname, style, params in POSTS:
    p = os.path.join(out, fname)
    styles[style](**params, output_path=p)
    print("✓", fname)
print("\nAll", len(POSTS), "posts generated in", out)
