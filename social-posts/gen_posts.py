#!/usr/bin/env python3
"""
Beyond Pixels Premium Social Media Post Generator v2
Trend-researched design: bold typography, gradients, glassmorphism, stat callouts,
hook-based content, modern SaaS aesthetic.

Design styles:
1. STAT CALLOUT — Big number in electric blue + context
2. HOOK CARD — Bold hook text on glassmorphism card with glow
3. BEFORE/AFTER — Split design showing transformation
4. LIST POST — Numbered list with electric blue numbers
5. QUESTION HOOK — Large question + visual elements
6. MINIMAL BOLD — Just the hook, huge, centered, with glow
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, sys, math, random

# Brand colors
NAVY = (10, 14, 39)        # #0A0E27
NAVY_DARK = (5, 8, 25)     # Darker navy
BLUE = (0, 102, 255)       # #0066FF
BLUE_GLOW = (0, 102, 255, 60)  # Semi-transparent blue for glow
WHITE = (255, 255, 255)
GRAY = (160, 170, 195)     # Muted text
GRAY_LIGHT = (200, 210, 225)

SIZE = 1080
LOGO_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bp-logo.jpg")

def get_font(size, bold=True):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def create_gradient_bg(size, color1=NAVY, color2=NAVY_DARK, direction="vertical"):
    """Create a smooth gradient background."""
    img = Image.new("RGB", (size, size), color1)
    draw = ImageDraw.Draw(img)
    
    if direction == "vertical":
        for y in range(size):
            ratio = y / size
            r = int(color1[0] + (color2[0] - color1[0]) * ratio)
            g = int(color1[1] + (color2[1] - color1[1]) * ratio)
            b = int(color1[2] + (color2[2] - color1[2]) * ratio)
            draw.line([(0, y), (size, y)], fill=(r, g, b))
    elif direction == "radial":
        cx, cy = size // 2, size // 3
        max_dist = math.sqrt(cx**2 + cy**2)
        for y in range(size):
            for x in range(0, size, 2):
                dist = math.sqrt((x - cx)**2 + (y - cy)**2)
                ratio = min(dist / max_dist, 1.0)
                r = int(color1[0] + (color2[0] - color1[0]) * ratio)
                g = int(color1[1] + (color2[1] - color1[1]) * ratio)
                b = int(color1[2] + (color2[2] - color1[2]) * ratio)
                draw.point([(x, y), (x+1, y)], fill=(r, g, b))
    elif direction == "diagonal":
        for y in range(size):
            for x in range(0, size, 2):
                ratio = (x + y) / (size * 2)
                r = int(color1[0] + (color2[0] - color1[0]) * ratio)
                g = int(color1[1] + (color2[1] - color1[1]) * ratio)
                b = int(color1[2] + (color2[2] - color1[2]) * ratio)
                draw.point([(x, y), (x+1, y)], fill=(r, g, b))
    
    return img

def add_glow_orbs(img, count=3):
    """Add subtle glowing orbs for depth."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    positions = [
        (SIZE * 0.15, SIZE * 0.85, 180),
        (SIZE * 0.85, SIZE * 0.15, 150),
        (SIZE * 0.7, SIZE * 0.7, 120),
    ]
    
    for i, (x, y, r) in enumerate(positions[:count]):
        glow = Image.new("RGBA", (r*4, r*4), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        for j in range(r, 0, -3):
            alpha = int(25 * (1 - j / r))
            gd.ellipse([r*2-j, r*2-j, r*2+j, r*2+j], fill=(*BLUE, alpha))
        overlay.paste(glow, (int(x - r*2), int(y - r*2)), glow)
    
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    return img

def add_blue_line(draw, y, width=SIZE, thickness=4):
    """Add an electric blue accent line."""
    draw.rectangle([(0, y), (width, y + thickness)], fill=BLUE)

def add_logo(img, size_ratio=0.10):
    """Add BP logo to top-left corner with subtle shadow."""
    try:
        logo = Image.open(LOGO_PATH).convert("RGBA")
        logo_size = int(SIZE * size_ratio)
        logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
        
        # Circular mask
        mask = Image.new("L", (logo_size, logo_size), 0)
        md = ImageDraw.Draw(mask)
        md.ellipse([0, 0, logo_size, logo_size], fill=255)
        
        # Shadow
        shadow = Image.new("RGBA", (logo_size + 20, logo_size + 20), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        sd.ellipse([10, 10, logo_size + 10, logo_size + 10], fill=(0, 0, 0, 80))
        shadow = shadow.filter(ImageFilter.GaussianBlur(8))
        
        position = (45, 45)
        img.paste(shadow, (position[0] - 10, position[1] - 10), shadow)
        img.paste(logo, position, mask)
    except Exception as e:
        print(f"Logo warning: {e}")
        draw = ImageDraw.Draw(img)
        font = get_font(32, bold=True)
        # Draw a circle with BP text
        draw.ellipse([45, 45, 105, 105], fill=BLUE)
        draw.text((58, 52), "BP", fill=WHITE, font=font)

def add_cta_pill(img, text="DM us to get started"):
    """Add CTA pill at bottom."""
    draw = ImageDraw.Draw(img)
    font = get_font(28, bold=True)
    
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    px, py = 35, 18
    cx = (SIZE - tw) // 2
    cy = SIZE - 95
    
    # Pill background with slight glow
    glow = Image.new("RGBA", (tw + px*2 + 20, th + py*2 + 20), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle([10, 10, tw + px*2 + 10, th + py*2 + 10], radius=35, fill=(*BLUE, 200))
    glow = glow.filter(ImageFilter.GaussianBlur(6))
    img.paste(glow, (cx - px - 10, cy - py - 10), glow)
    
    draw.rounded_rectangle(
        [(cx - px, cy - py), (cx + tw + px, cy + th + py)],
        radius=30, fill=BLUE
    )
    draw.text((cx, cy - 2), text, fill=WHITE, font=font)

def wrap_text(text, font, max_width):
    lines = []
    for paragraph in text.split('\n'):
        words = paragraph.split()
        current = []
        for word in words:
            test = " ".join(current + [word])
            if font.getbbox(test)[2] <= max_width:
                current.append(word)
            else:
                if current:
                    lines.append(" ".join(current))
                current = [word]
        if current:
            lines.append(" ".join(current))
        if not words:
            lines.append("")
    return lines

def draw_centered_text(draw, lines, font, y_start, color, line_height=None):
    if line_height is None:
        line_height = int(font.size * 1.3)
    y = y_start
    for line in lines:
        bbox = font.getbbox(line)
        tw = bbox[2] - bbox[0]
        x = (SIZE - tw) // 2
        draw.text((x, y), line, fill=color, font=font)
        y += line_height
    return y

# ============= DESIGN STYLES =============

def style_stat_callout(headline, stat_number, stat_label, subtitle, output_path):
    """Big number in electric blue + context. Eye-catching stat-focused design."""
    img = create_gradient_bg(SIZE, NAVY, NAVY_DARK, "diagonal")
    img = add_glow_orbs(img, 2)
    draw = ImageDraw.Draw(img)
    
    # Top blue line
    add_blue_line(draw, 0, thickness=6)
    
    # Logo
    add_logo(img)
    
    # Hook text at top (smaller)
    hook_font = get_font(34, bold=True)
    hook_lines = wrap_text(headline, hook_font, SIZE - 180)
    y = 180
    y = draw_centered_text(draw, hook_lines, hook_font, y, GRAY_LIGHT, 50)
    
    # BIG STAT NUMBER
    y += 30
    stat_font = get_font(140, bold=True)
    stat_lines = wrap_text(stat_number, stat_font, SIZE - 100)
    y = draw_centered_text(draw, stat_lines, stat_font, y, BLUE, 160)
    
    # Stat label
    y += 10
    label_font = get_font(36, bold=True)
    label_lines = wrap_text(stat_label, label_font, SIZE - 200)
    y = draw_centered_text(draw, label_lines, label_font, y, WHITE, 48)
    
    # Subtitle
    y += 25
    sub_font = get_font(28, bold=False)
    sub_lines = wrap_text(subtitle, sub_font, SIZE - 200)
    draw_centered_text(draw, sub_lines, sub_font, y, GRAY, 40)
    
    add_cta_pill(img)
    img.save(output_path, "PNG", quality=95)
    print(f"Created (stat): {output_path}")

def style_hook_card(hook_text, subtitle, output_path, card_glow=True):
    """Bold hook text on a glassmorphism card with glow effect."""
    img = create_gradient_bg(SIZE, NAVY, NAVY_DARK, "vertical")
    img = add_glow_orbs(img, 3)
    draw = ImageDraw.Draw(img)
    add_blue_line(draw, 0, thickness=6)
    add_logo(img)
    
    # Glassmorphism card
    card_margin = 80
    card_y1 = 220
    card_y2 = SIZE - 180
    
    # Card glow
    if card_glow:
        glow = Image.new("RGBA", (SIZE - 2*card_margin + 40, card_y2 - card_y1 + 40), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.rounded_rectangle([20, 20, SIZE - 2*card_margin + 20, card_y2 - card_y1 + 20], radius=30, fill=(*BLUE, 30))
        glow = glow.filter(ImageFilter.GaussianBlur(20))
        img.paste(glow, (card_margin - 20, card_y1 - 20), glow)
    
    # Card background (semi-transparent dark)
    card = Image.new("RGBA", (SIZE - 2*card_margin, card_y2 - card_y1), (20, 25, 55, 200))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0, 0, SIZE - 2*card_margin - 1, card_y2 - card_y1 - 1], radius=24, fill=(20, 25, 55, 200))
    # Border
    cd.rounded_rectangle([0, 0, SIZE - 2*card_margin - 1, card_y2 - card_y1 - 1], radius=24, outline=(*BLUE, 100), width=2)
    img.paste(card, (card_margin, card_y1), card)
    draw = ImageDraw.Draw(img)
    
    # Hook text inside card
    hook_font = get_font(48, bold=True)
    hook_lines = wrap_text(hook_text, hook_font, SIZE - 2*card_margin - 80)
    total_h = len(hook_lines) * 64
    y_start = card_y1 + (card_y2 - card_y1 - total_h) // 2 - 20
    
    y = draw_centered_text(draw, hook_lines, hook_font, y_start, WHITE, 64)
    
    # Subtitle in card
    if subtitle:
        y += 30
        sub_font = get_font(28, bold=False)
        sub_lines = wrap_text(subtitle, sub_font, SIZE - 2*card_margin - 80)
        draw_centered_text(draw, sub_lines, sub_font, y, GRAY, 42)
    
    add_cta_pill(img)
    img.save(output_path, "PNG", quality=95)
    print(f"Created (hook): {output_path}")

def style_before_after(before_text, after_text, output_path):
    """Split design showing transformation (before/after)."""
    img = create_gradient_bg(SIZE, NAVY, NAVY_DARK, "vertical")
    img = add_glow_orbs(img, 2)
    draw = ImageDraw.Draw(img)
    add_blue_line(draw, 0, thickness=6)
    add_logo(img)
    
    mid_y = SIZE // 2 + 20
    
    # Divider line
    draw.rectangle([(80, mid_y - 2), (SIZE - 80, mid_y + 2)], fill=BLUE)
    
    # Before section (top)
    before_label_font = get_font(24, bold=True)
    draw.text((SIZE // 2 - 60, 200), "BEFORE", fill=GRAY, font=before_label_font)
    
    before_font = get_font(38, bold=True)
    before_lines = wrap_text(before_text, before_font, SIZE - 180)
    total_h = len(before_lines) * 52
    y_start = 250 + (mid_y - 280 - total_h) // 2
    draw_centered_text(draw, before_lines, before_font, y_start, GRAY_LIGHT, 52)
    
    # After section (bottom)
    draw.text((SIZE // 2 - 50, mid_y + 30), "AFTER", fill=BLUE, font=before_label_font)
    
    after_font = get_font(42, bold=True)
    after_lines = wrap_text(after_text, after_font, SIZE - 180)
    total_h = len(after_lines) * 56
    y_start = mid_y + 75 + (SIZE - mid_y - 200 - total_h) // 2
    draw_centered_text(draw, after_lines, after_font, y_start, WHITE, 56)
    
    add_cta_pill(img)
    img.save(output_path, "PNG", quality=95)
    print(f"Created (before/after): {output_path}")

def style_list_post(hook, items, output_path):
    """Numbered list with electric blue numbers. Great for value-packed posts."""
    img = create_gradient_bg(SIZE, NAVY, NAVY_DARK, "diagonal")
    img = add_glow_orbs(img, 2)
    draw = ImageDraw.Draw(img)
    add_blue_line(draw, 0, thickness=6)
    add_logo(img)
    
    # Hook at top
    hook_font = get_font(40, bold=True)
    hook_lines = wrap_text(hook, hook_font, SIZE - 160)
    y = 180
    y = draw_centered_text(draw, hook_lines, hook_font, y, WHITE, 54)
    
    y += 40
    
    # List items
    item_font = get_font(32, bold=True)
    num_font = get_font(40, bold=True)
    
    for i, item in enumerate(items):
        # Number circle
        num_y = y
        draw.ellipse([90, num_y, 140, num_y + 50], outline=BLUE, width=3)
        num_str = str(i + 1)
        bbox = num_font.getbbox(num_str)
        nw = bbox[2] - bbox[0]
        draw.text((90 + (50 - nw) // 2, num_y + 2), num_str, fill=BLUE, font=num_font)
        
        # Item text
        item_lines = wrap_text(item, item_font, SIZE - 220)
        for j, line in enumerate(item_lines):
            draw.text((170, num_y + 5 + j * 42), line, fill=GRAY_LIGHT, font=item_font)
        
        y += max(len(item_lines) * 42 + 20, 60)
    
    add_cta_pill(img)
    img.save(output_path, "PNG", quality=95)
    print(f"Created (list): {output_path}")

def style_question_hook(question, subtitle, output_path):
    """Large question + visual elements. Scroll-stopping question design."""
    img = create_gradient_bg(SIZE, NAVY, NAVY_DARK, "radial")
    img = add_glow_orbs(img, 3)
    draw = ImageDraw.Draw(img)
    add_blue_line(draw, 0, thickness=6)
    add_logo(img)
    
    # Large question mark accent
    qm_font = get_font(200, bold=True)
    draw.text((SIZE - 180, 120), "?", fill=(*BLUE[:3],), font=qm_font)
    
    # Question text
    q_font = get_font(52, bold=True)
    q_lines = wrap_text(question, q_font, SIZE - 200)
    total_h = len(q_lines) * 68
    y_start = (SIZE - total_h) // 2 - 40
    y = draw_centered_text(draw, q_lines, q_font, y_start, WHITE, 68)
    
    # Subtitle
    if subtitle:
        y += 35
        sub_font = get_font(30, bold=False)
        sub_lines = wrap_text(subtitle, sub_font, SIZE - 200)
        draw_centered_text(draw, sub_lines, sub_font, y, GRAY, 44)
    
    add_cta_pill(img)
    img.save(output_path, "PNG", quality=95)
    print(f"Created (question): {output_path}")

def style_minimal_bold(hook, output_path):
    """Just the hook. Huge. Centered. With glow. Maximum impact."""
    img = create_gradient_bg(SIZE, NAVY, NAVY_DARK, "radial")
    img = add_glow_orbs(img, 3)
    draw = ImageDraw.Draw(img)
    add_blue_line(draw, 0, thickness=6)
    add_logo(img)
    
    # Huge text
    font = get_font(64, bold=True)
    lines = wrap_text(hook, font, SIZE - 140)
    total_h = len(lines) * 84
    y_start = (SIZE - total_h) // 2 - 30
    draw_centered_text(draw, lines, font, y_start, WHITE, 84)
    
    add_cta_pill(img, "DM us")
    img.save(output_path, "PNG", quality=95)
    print(f"Created (minimal): {output_path}")

# ============= REEL FRAME GENERATOR =============

def create_reel_frame(text, frame_idx, total_frames, output_path, accent_color=BLUE):
    """Create a single 1080x1920 vertical frame for Instagram Reel."""
    W, H = 1080, 1920
    img = create_gradient_bg_custom(W, H, NAVY, NAVY_DARK, "diagonal")
    
    # Glow orbs
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for cx, cy, r in [(W*0.2, H*0.8, 200), (W*0.8, H*0.2, 160)]:
        glow = Image.new("RGBA", (r*4, r*4), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        for j in range(r, 0, -4):
            alpha = int(20 * (1 - j / r))
            gd.ellipse([r*2-j, r*2-j, r*2+j, r*2+j], fill=(*accent_color, alpha))
        overlay.paste(glow, (int(cx - r*2), int(cy - r*2)), glow)
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)
    
    # Top blue line
    draw.rectangle([(0, 0), (W, 6)], fill=accent_color)
    
    # Logo
    try:
        logo = Image.open(LOGO_PATH).convert("RGBA")
        logo_size = int(W * 0.10)
        logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
        mask = Image.new("L", (logo_size, logo_size), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, logo_size, logo_size], fill=255)
        img.paste(logo, (50, 50), mask)
    except:
        draw.ellipse([50, 50, 110, 110], fill=accent_color)
        draw.text((63, 57), "BP", fill=WHITE, font=get_font(32, bold=True))
    
    # Text in safe zone (300px to 1300px from top)
    font = get_font(56, bold=True)
    lines = wrap_text(text, font, W - 160)
    total_h = len(lines) * 74
    y_start = max(350, (H - total_h) // 2 - 100)
    
    y = y_start
    for line in lines:
        bbox = font.getbbox(line)
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        draw.text((x, y), line, fill=WHITE, font=font)
        y += 74
    
    # Progress bar at bottom (above safe zone)
    progress_y = H - 350
    bar_width = W - 200
    draw.rectangle([(100, progress_y), (100 + bar_width, progress_y + 6)], fill=(60, 70, 100))
    progress = (frame_idx + 1) / total_frames
    draw.rectangle([(100, progress_y), (100 + int(bar_width * progress), progress_y + 6)], fill=accent_color)
    
    # CTA
    cta_font = get_font(30, bold=True)
    cta_text = "DM us to get started"
    bbox = cta_font.getbbox(cta_text)
    ctw = bbox[2] - bbox[0]
    cx = (W - ctw) // 2
    cy = H - 280
    draw.rounded_rectangle([(cx - 30, cy - 15), (cx + ctw + 30, cy + 35)], radius=30, fill=accent_color)
    draw.text((cx, cy - 2), cta_text, fill=WHITE, font=cta_font)
    
    img.save(output_path, "PNG", quality=95)
    return output_path

def create_gradient_bg_custom(w, h, color1, color2, direction="vertical"):
    img = Image.new("RGB", (w, h), color1)
    draw = ImageDraw.Draw(img)
    if direction == "diagonal":
        for y in range(h):
            for x in range(0, w, 2):
                ratio = (x + y) / (w + h)
                r = int(color1[0] + (color2[0] - color1[0]) * ratio)
                g = int(color1[1] + (color2[1] - color1[1]) * ratio)
                b = int(color1[2] + (color2[2] - color1[2]) * ratio)
                draw.point([(x, y), (x+1, y)], fill=(r, g, b))
    elif direction == "vertical":
        for y in range(h):
            ratio = y / h
            r = int(color1[0] + (color2[0] - color1[0]) * ratio)
            g = int(color1[1] + (color2[1] - color1[1]) * ratio)
            b = int(color1[2] + (color2[2] - color1[2]) * ratio)
            draw.line([(0, y), (w, y)], fill=(r, g, b))
    else:
        for y in range(h):
            for x in range(0, w, 2):
                ratio = x / w
                r = int(color1[0] + (color2[0] - color1[0]) * ratio)
                g = int(color1[1] + (color2[1] - color1[1]) * ratio)
                b = int(color1[2] + (color2[2] - color1[2]) * ratio)
                draw.point([(x, y), (x+1, y)], fill=(r, g, b))
    return img

# ============= CONTENT CALENDAR v2 =============
# Format: (day, time_ist, platform, style, params, hook_caption, full_caption)
# Hooks use viral formulas: question, secret, number promise, myth busting, problem+fix, etc.

CONTENT_V2 = [
    # Day 1 - Thursday Aug 27 (tonight)
    ("Day 1", "6:30 PM", "instagram,facebook", "hook_card",
     {"hook_text": "No one talks about this...\n\nBut your gym is losing\nmembers every single day\nbecause of THIS.",
      "subtitle": "Paper registers. Missed follow-ups. Expired memberships nobody noticed."},
     "No one talks about this, but your gym is losing members every single day because of one thing: paper registers.\n\nMissed follow-ups. Expired memberships nobody noticed. Leads that went cold.\n\nGym OS fixes all of it. Automatically.\n\nDM us to stop the leak."),
    
    # Day 2 - Friday Aug 28
    ("Day 2", "10:00 AM", "instagram,facebook", "stat_callout",
     {"headline": "QR check-in vs manual entry. Every. Single. Day.",
      "stat_number": "10 hrs",
      "stat_label": "saved daily with QR check-in",
      "subtitle": "200 members x 3 minutes saved each = 10 hours back. Every day."},
     "10 hours saved. Every. Single. Day.\n\n200 members x 3 minutes saved each with QR check-in.\n\nThat's 300 hours a month you're wasting on manual entry.\n\nDM us to get those hours back."),
    
    ("Day 2", "11:00 AM", "linkedin", "text_only",
     None,  # LinkedIn text post - no image needed
     "LINKEDIN_TEXT_POST"),  # Special marker for LinkedIn text posts
    
    ("Day 2", "6:00 PM", "instagram,facebook", "before_after",
     {"before_text": "Paper registers.\nMissed renewals.\nLost leads.\nSpreadsheets everywhere.",
      "after_text": "QR check-in.\nAuto-renewal reminders.\nLead tracking on autopilot.\nOne dashboard. Everything."},
     "Before: Paper registers. Missed renewals. Lost leads.\nAfter: QR check-in. Auto reminders. Lead tracking on autopilot.\n\nThis is what Gym OS does. DM us to switch."),
    
    # Day 3 - Saturday Aug 29
    ("Day 3", "10:00 AM", "instagram,facebook", "list_post",
     {"hook": "5 things your gym software should do (but probably doesn't):",
      "items": ["QR check-in in under 3 seconds", "Auto-follow-up with every lead", "Track revenue in real-time", "Send renewal reminders automatically", "Manage class bookings without chaos"]},
     "5 things your gym software should do (but probably doesn't):\n\n1. QR check-in in under 3 seconds\n2. Auto-follow-up with every lead\n3. Track revenue in real-time\n4. Send renewal reminders automatically\n5. Manage class bookings without chaos\n\nGym OS does all 5. DM us."),
    
    ("Day 3", "6:00 PM", "instagram,facebook", "question_hook",
     {"question": "What if your gym\nran itself?",
      "subtitle": "Check-ins. Follow-ups. Renewals. Payments. All automatic."},
     "What if your gym ran itself?\n\nCheck-ins. Follow-ups. Renewals. Payments. All automatic.\n\nDM us to make it happen."),
    
    # Day 4 - Sunday Aug 30
    ("Day 4", "10:00 AM", "instagram,facebook", "minimal_bold",
     {"hook": "They say you need\na big team to run\na gym.\nThat's a lie."},
     "They say you need a big team to run a gym. That's a lie.\n\nYou need the right system.\n\nDM us to see how."),
    
    ("Day 4", "6:00 PM", "instagram,facebook", "stat_callout",
     {"headline": "Gyms that switch to automated follow-ups see:",
      "stat_number": "+40%",
      "stat_label": "more conversions",
      "subtitle": "Every lead gets a response in minutes, not days. While you train, your system closes."},
     "Gyms that switch to automated follow-ups see +40% more conversions.\n\nEvery lead gets a response in minutes, not days. While you train members, your system closes deals.\n\nDM us to automate your gym."),
    
    # Day 5 - Monday Aug 31
    ("Day 5", "10:00 AM", "instagram,facebook", "hook_card",
     {"hook_text": "I wish I'd known this\n2 years ago.\n\nYour gym website is your\n24/7 salesperson.",
      "subtitle": "Not templates. Built for your gym. Converts visitors into members."},
     "I wish I'd known this 2 years ago. Your gym website is your 24/7 salesperson.\n\nNot templates. Not cookie-cutter. Built specifically for your gym.\n\nDM us to build yours."),
    
    ("Day 5", "11:00 AM", "linkedin", "text_only",
     None,
     "LINKEDIN_TEXT_POST"),
    
    ("Day 5", "6:00 PM", "instagram,facebook", "before_after",
     {"before_text": "Walk-in fills a form.\nWaits 5 minutes.\nPays in cash.\nGets a paper receipt.",
      "after_text": "QR scan.\nAuto-fill.\nUPI payment.\nDigital receipt.\nDone in 60 seconds."},
     "Before: Walk-in fills a form, waits 5 minutes, pays cash, gets paper receipt.\nAfter: QR scan, auto-fill, UPI payment, digital receipt. Done in 60 seconds.\n\nDM us to speed up your gym."),
    
    # Day 6 - Tuesday Sep 1
    ("Day 6", "10:00 AM", "instagram,facebook", "question_hook",
     {"question": "Why do 60% of gyms\nfail in year one?",
      "subtitle": "It's not the equipment. It's the operations. Here's the fix."},
     "Why do 60% of gyms fail in year one?\n\nIt's not the equipment. It's the operations. Lost leads. Missed renewals. No follow-up system.\n\nGym OS fixes all of it. DM us."),
    
    ("Day 6", "11:00 AM", "linkedin", "text_only",
     None,
     "LINKEDIN_TEXT_POST"),
    
    ("Day 6", "6:00 PM", "instagram,facebook", "list_post",
     {"hook": "How Gym OS handles 500+ members without breaking a sweat:",
      "items": ["QR check-in: 200 entries in seconds", "CRM: every lead tracked start to finish", "Payments: auto invoices + GST", "Trainers: who's training who, when", "Classes: auto-booking + reminders"]},
     "How Gym OS handles 500+ members without breaking a sweat:\n\n1. QR check-in: 200 entries in seconds\n2. CRM: every lead tracked start to finish\n3. Payments: auto invoices + GST\n4. Trainers: who's training who, when\n5. Classes: auto-booking + reminders\n\nOne dashboard. DM us."),
    
    # Day 7 - Wednesday Sep 2
    ("Day 7", "10:00 AM", "instagram,facebook", "minimal_bold",
     {"hook": "Premium gyms\nuse premium tools.\nDoes yours?"},
     "Premium gyms use premium tools. Does yours?\n\nDM us to join the top 1%."),
    
    ("Day 7", "11:00 AM", "linkedin", "text_only",
     None,
     "LINKEDIN_TEXT_POST"),
    
    ("Day 7", "6:00 PM", "instagram,facebook", "stat_callout",
     {"headline": "Average retention rate for gyms using Gym OS:",
      "stat_number": "92%",
      "stat_label": "member retention after 6 months",
      "subtitle": "Automated renewal reminders. CRM follow-ups. Zero members slipping through cracks."},
     "92% member retention after 6 months.\n\nAutomated renewal reminders. CRM follow-ups. Zero members slipping through the cracks.\n\nDM us to boost your retention."),
]

# LinkedIn text posts (properly formatted per LinkedIn best practices)
LINKEDIN_TEXT_POSTS = [
    """73% of gyms struggle with member retention.

The hidden cost isn't bad equipment or poor training.

It's manual operations.

Paper registers. Spreadsheets. Missed follow-ups. Expired memberships nobody noticed.

When a gym runs on pen and paper, members slip through the cracks. The fix isn't more staff — it's better systems.

At Beyond Pixels, we built Gym OS to handle this:

→ QR check-in (no more paper)
→ CRM with automated follow-ups (never lose a lead)
→ Payment tracking with GST invoices (know your numbers)
→ Class scheduling with auto-reminders (full classes, zero no-shows)
→ Custom website that converts (your 24/7 salesperson)

All from one dashboard. No switching between apps.

The result? Gyms that retain better, grow faster, and operate smoother.

What's your gym's retention rate? Drop it in the comments.

#GymManagement #SaaS #FitnessTech #Retention #GymOS""",

    """The tech stack every modern gym needs in 2026:

1. QR-based check-in system
(Paper registers are dead. Your members deserve better.)

2. CRM with automated follow-ups
(If you're not following up within 5 minutes, you've already lost the lead.)

3. Payment tracking with GST invoices
(Stop guessing your revenue. Know it in real-time.)

4. Class scheduling with auto-reminders
(Full classes. Zero no-shows. Automatic.)

5. Custom website that converts
(Your 24/7 salesperson. Not a template. Not cookie-cutter.)

You could buy 5 separate tools. Or you could get all 5 in one system.

That's why we built Gym OS.

One dashboard. One system. Everything your gym needs.

Save this post if you're planning to upgrade your gym's tech stack this year.

#GymManagement #FitnessTech #SaaS #GymOS #BeyondPixels""",

    """Building Beyond Pixels: The operating system for gyms.

We didn't start with software. We started with a question:

Why do gyms still run on pen and paper in 2026?

The answer isn't that gym owners don't care. It's that existing tools are either too simple (spreadsheets) or too complex (enterprise software built for chains with 50+ locations).

So we built something in between.

Gym OS — powerful enough for a 500-member gym, simple enough for a 50-member one.

Custom website. QR check-in. CRM. Payments. Scheduling. Trainer management. One system. One dashboard.

No training manuals. No 3-week onboarding. Just scan, click, done.

We're Beyond Pixels. We build the tools that gyms need to grow.

What's the one thing you wish your gym software did better?

#GymOS #BeyondPixels #SaaS #GymManagement #TechStartup""",

    """How Gym OS handles 500+ members without breaking a sweat:

→ QR check-in processes 200 entries/day in under 3 seconds each
→ CRM tracks every lead from first inquiry to signed membership
→ Payment system auto-generates invoices, GST, and renewal reminders
→ Trainer dashboard shows who's training who, when, and how much revenue each trainer generates
→ Class scheduling fills spots automatically and sends WhatsApp reminders

All from one dashboard. No switching between apps. No lost data. No Excel sheets.

This is what gym management looks like in 2026.

If you're still using paper registers and spreadsheets, you're not saving money — you're losing members.

DM us to see Gym OS in action.

#GymOS #GymManagement #SaaS #FitnessTech #Automation""",

    """Most gym owners I talk to have the same problem.

They're great at training. They're great at building community. They're great at fitness.

But they're terrible at operations.

And it's not their fault. Nobody opened a gym because they wanted to manage spreadsheets and chase renewals.

That's why we built Gym OS.

The philosophy is simple:
• The gym owner focuses on training and community
• Gym OS handles everything else

Check-ins. CRM. Payments. Scheduling. Follow-ups. Reminders. Website. All automatic.

If you're spending more than 1 hour a day on admin work, your system is broken.

What's the most annoying part of running your gym? Let me know below.

#GymManagement #FitnessTech #SaaS #GymOS #Entrepreneurship""",
]

# ============= REEL CONTENT =============
REEL_SCRIPT = {
    "title": "5 things your gym is doing the hard way",
    "frames": [
        "No one talks about this...",
        "But your gym is losing\nmembers every day",
        "because of THESE 5 things:",
        "1. Paper registers\n(3 minutes per check-in)",
        "2. No follow-up system\n(leads go cold in 24 hours)",
        "3. Manual renewals\n(members leave, nobody notices)",
        "4. Cash-only payments\n(no tracking, no GST)",
        "5. No website\n(your 24/7 salesperson = missing)",
        "Gym OS fixes all 5.",
        "Automatically.",
        "QR check-in. CRM.\nPayments. Scheduling.\nWebsite.",
        "One system. One dashboard.",
        "DM us to switch.",
    ],
    "duration_per_frame": 3,  # seconds per frame
}

if __name__ == "__main__":
    output_dir = "branded_posts_v2"
    os.makedirs(output_dir, exist_ok=True)
    
    if not os.path.exists(LOGO_PATH):
        for p in ["real-bp-logo.jpg", "bp-logo.jpg", "../bp-logo.jpg"]:
            if os.path.exists(p):
                import shutil
                shutil.copy(p, LOGO_PATH)
                break
    
    post_idx = 0
    for day, time_ist, platform, style, params, caption in CONTENT_V2:
        if style == "text_only":
            post_idx += 1
            continue
        
        post_idx += 1
        filename = f"post_{post_idx:02d}_{day}_{time_ist.replace(':', '').replace(' ', '').replace('AM', 'am').replace('PM', 'pm')}.png"
        output_path = os.path.join(output_dir, filename)
        
        if style == "stat_callout":
            style_stat_callout(params["headline"], params["stat_number"], params["stat_label"], params["subtitle"], output_path)
        elif style == "hook_card":
            style_hook_card(params["hook_text"], params["subtitle"], output_path)
        elif style == "before_after":
            style_before_after(params["before_text"], params["after_text"], output_path)
        elif style == "list_post":
            style_list_post(params["hook"], params["items"], output_path)
        elif style == "question_hook":
            style_question_hook(params["question"], params["subtitle"], output_path)
        elif style == "minimal_bold":
            style_minimal_bold(params["hook"], output_path)
    
    # Generate Reel frames
    reel_dir = os.path.join(output_dir, "reel_frames")
    os.makedirs(reel_dir, exist_ok=True)
    for i, frame_text in enumerate(REEL_SCRIPT["frames"]):
        create_reel_frame(frame_text, i, len(REEL_SCRIPT["frames"]), 
                         os.path.join(reel_dir, f"frame_{i:03d}.png"))
    
    print(f"\nGenerated {post_idx} branded posts + {len(REEL_SCRIPT['frames'])} reel frames in {output_dir}/")
