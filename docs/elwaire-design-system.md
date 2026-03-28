# Elwaire Design System
> Source: Screenshot thực tế + DevTools CSS extraction từ elwaire.com  
> Version 3.0 — Đã kiểm tra và xác nhận chính xác với giao diện thật

---

## ⚠️ CORRECTION — SAI LẦM ĐÃ SỬA

```
❌ VERSION CŨ (sai):  Theme tối, nền #000f31
✅ VERSION NÀY (đúng): Theme SÁNG (light), nền trắng #ffffff
   #000f31 là màu TEXT heading, KHÔNG phải background!
```

---

## 1. DESIGN PHILOSOPHY

| Thuộc tính | Giá trị thật |
|---|---|
| **Theme** | **LIGHT** — nền trắng, chữ tối, accent blue |
| **Aesthetic** | Clean professional studio — minimal, airy, trustworthy |
| **Palette** | White base + Electric blue accent + Dark navy text |
| **Special section** | About section dùng solid blue (#155dfc) làm nền — chỉ 1 section |
| **Language** | Tiếng Việt primary |

---

## 2. COLOR SYSTEM — CHÍNH XÁC TỪ CSS + SCREENSHOT

### 2.1 Background

```
--bg-page:       #ffffff               Nền trang chủ — trắng thuần
--bg-hero:       #eff6ff               Hero section — xanh nhạt rất nhẹ (blue tint)
--bg-hero-grad:  linear-gradient(      Hero có gradient nhẹ
                   135deg,
                   #f7f8ff 0%,
                   #eff6ff 50%,
                   #ffffff 100%
                 )
--bg-section:    #ffffff               Section thường — trắng
--bg-section-alt:#f7f8ff               Section xen kẽ (optional) — very light blue
--bg-card:       #ffffff               Card — trắng với shadow
--bg-input:      #ffffff               Input field
--bg-tag-blue:   #eff6ff               Badge/tag nền xanh nhạt

/* Special — About section */
--bg-about:      #155dfc               Section "Về chúng tôi" — xanh đậm solid
```

### 2.2 Text

```
--text-heading:  #000f31               Heading chính — dark navy (extracted thật)
--text-body:     #4a5568               Body text — gray đậm vừa
--text-muted:    #718096               Muted text — gray nhạt
--text-caption:  #a0aec0               Caption, meta info
--text-accent:   #155dfc               Text accent — blue (dùng cho H1 line 2, label)
--text-on-blue:  #ffffff               Chữ trên nền xanh (About section)
--text-price:    #155dfc               Giá nổi bật — blue
--text-price-old:#6b7280               Giá thường — gray
```

### 2.3 Accent

```
--accent:        #155dfc               Electric blue — màu chủ đạo
--accent-hover:  #1248c9               Darker blue khi hover
--accent-light:  #b8e5ff               Light blue — icon backgrounds
--accent-tint:   #eff6ff               Blue tint — backgrounds nhạt
--accent-60:     rgba(21, 93, 252, 0.6) Blue mờ
```

### 2.4 Border

```
--border-card:   #e2e8f0               Border card — light gray-blue (slate-200)
--border-input:  #e2e8f0               Border input
--border-subtle: rgba(226,232,240,0.6) Border mờ
--border-section:#e2e8f0               Divider giữa sections
```

### 2.5 Status

```
--status-open:   #10b981               Còn chỗ — emerald green
--status-closed: #6b7280               Đã đóng — gray
--status-limited:#f59e0b               Còn ít — amber
```

### 2.6 Shadow

```
--shadow-card:   0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)
--shadow-card-hover: 0 4px 16px rgba(21,93,252,0.12), 0 1px 4px rgba(0,0,0,0.08)
--shadow-navbar: 0 1px 4px rgba(0,0,0,0.08)
--shadow-btn:    0 2px 8px rgba(21,93,252,0.25)
```

---

## 3. PALETTE VISUAL

```
LIGHT BACKGROUNDS           ACCENT BLUE              TEXT
#ffffff  (page, card)       #155dfc (primary)        #000f31 (heading)
#f7f8ff  (hero/section)     #b8e5ff (light)          #4a5568 (body)
#eff6ff  (hero tint)        #eff6ff (tint)           #718096 (muted)
                                                     #a0aec0 (caption)

SPECIAL SECTION             STATUS
#155dfc  (About bg solid)   #10b981 (open)
                            #6b7280 (closed)
                            #f59e0b (limited)
```

---

## 4. TYPOGRAPHY

### 4.1 Font Stack

```css
/* Sans-serif — extracted từ CSS */
font-family: var(--font-sans);
/* = */ -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui,
         ui-sans-serif, Helvetica, Arial, sans-serif,
         "Apple Color Emoji", "Segoe UI Emoji";

/* Monospace — splash screen */
font-family: var(--font-mono);
/* = */ ui-monospace, SFMono-Regular, Menlo, Monaco,
         Consolas, "Liberation Mono", "Courier New", monospace;
```

> Khi AI generate page: dùng **Inter** hoặc **Plus Jakarta Sans** cho sans,
> **JetBrains Mono** cho mono.

### 4.2 Type Scale

| Token | Size | Weight | Color | Dùng cho |
|---|---|---|---|---|
| `display` | 52–64px | 800 | `#000f31` | Hero H1 line 1 |
| `display-accent` | 52–64px | 800 | `#155dfc` | Hero H1 line 2 (blue) |
| `h1` | 40–48px | 700 | `#000f31` | Page title |
| `h2` | 28–36px | 700 | `#000f31` | Section heading |
| `h3` | 17–20px | 600 | `#000f31` | Card title |
| `body-lg` | 16–18px | 400 | `#4a5568` | Body chính |
| `body` | 14–15px | 400 | `#4a5568` | Mô tả card |
| `small` | 12–13px | 400 | `#718096` | Meta, caption |
| `label` | 11–12px | 600 | `#155dfc` | Section label (UPPERCASE + centered) |
| `price` | 18–20px | 700 | `#155dfc` | Giá nổi bật |
| `price-gray` | 16px | 500 | `#6b7280` | Giá thường |
| `mono` | 12px | 400 | rgba(0,15,49,0.4) | Splash loading |

### 4.3 Hero H1 Pattern — 2 dòng màu khác nhau

```html
<!-- Pattern đặc trưng: dòng 1 tối, dòng 2 xanh -->
<h1>
  <span style="color: #000f31">Biến Ý Tưởng Thành</span><br>
  <span style="color: #155dfc">Thiết Kế Chuyên Nghiệp</span>
</h1>
```

---

## 5. SPACING

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px

--container-max:    1200px
--container-pad:    24px       (mobile)
--container-pad-lg: 48px       (desktop)
--section-gap:      80–100px
--card-gap:         16–20px
```

---

## 6. BORDER & RADIUS

```
--radius-sm:   6px     Input, tag nhỏ
--radius-md:   10–12px Button, badge
--radius-lg:   14–16px Card
--radius-xl:   20px    Ảnh hero
--radius-full: 9999px  Pill button, avatar, tag pill
--radius-btn:  9999px  Button CTA dùng fully rounded

--border-card:  1px solid #e2e8f0
--border-input: 1px solid #e2e8f0
--border-hover: 1px solid #b8e5ff  (blue nhạt khi hover card)
```

---

## 7. COMPONENTS

### 7.1 Navigation Bar

```
Vị trí:         sticky top-0
Height:         56–64px
Background:     #ffffff
Border-bottom:  1px solid #e2e8f0 (hiện khi scroll)
Shadow:         0 1px 4px rgba(0,0,0,0.06) khi scroll
z-index:        1000
padding-x:      container

Logo:
  [Hình tròn xanh "E"] + ["STUDIO" chữ xanh #155dfc]
  font-weight: 700, font-size: 16px

Nav links:
  color:        #4a5568 (default) -> #000f31 (hover/active)
  font-size:    14px, font-weight: 500
  gap:          24–32px

Right side:
  [Flag VN] [▼] [Avatar/Username]
  font-size: 14px
```

---

### 7.2 Splash / Loading Screen

```
background:   #000f31 HOẶC #ffffff (trước khi page load)
content:      [Logo] + "INITIALIZING STUDIO..."
font:         var(--font-mono), 11–12px, UPPERCASE
color:        rgba(0, 15, 49, 0.4) hoặc rgba(255,255,255,0.5)
letter-spacing: 0.2em
z-index:      9999, fadeOut sau 1.5s
```

---

### 7.3 Buttons

#### Primary Button — CTA chính

```css
background:    #155dfc;
color:         #ffffff;
font-size:     14–15px;
font-weight:   600;
padding:       12px 28px;
border-radius: 9999px;          /* Fully rounded — đặc trưng Elwaire */
border:        none;
box-shadow:    0 2px 8px rgba(21,93,252,0.25);
transition:    background 0.2s, transform 0.15s, box-shadow 0.2s;

:hover {
  background:  #1248c9;
  transform:   translateY(-1px);
  box-shadow:  0 4px 12px rgba(21,93,252,0.35);
}
```

#### Ghost / Outline Button

```css
background:    transparent;
color:         #155dfc;
border:        1.5px solid #155dfc;
font-size:     14px;
font-weight:   500;
padding:       10px 24px;
border-radius: 9999px;

:hover {
  background:  #eff6ff;
}
```

#### Text Link Button (card CTA)

```css
color:          #155dfc;
font-size:      13–14px;
font-weight:    500;
text-decoration: none;
display:        flex; align-items: center; gap: 4px;

/* [Xem chi tiết →] */
:hover { text-decoration: underline; }
```

---

### 7.4 Badges / Labels

#### Section Label (trên mỗi section heading)

```
text:           UPPERCASE hoặc sentence case — nhỏ, centered
font-size:      12px, font-weight: 600
color:          #155dfc
letter-spacing: 0.08em
margin-bottom:  8px
text-align:     center
/* KHÔNG có background, KHÔNG có border — plain blue text */
```

#### Level Badge (card — "Cơ bản", "Trung cấp")

```
background:     #eff6ff
color:          #155dfc
font-size:      11px, font-weight: 600
padding:        3px 10px
border-radius:  9999px
border:         1px solid #b8e5ff
```

#### Status Badge — Open (còn chỗ)

```
background:     rgba(16, 185, 129, 0.1)
color:          #10b981
border:         1px solid rgba(16,185,129,0.3)
font-size:      11–12px
padding:        3px 10px, radius: 9999px
```

#### Status Badge — Closed (đã đóng)

```
background:     rgba(107,114,128,0.1)
color:          #6b7280
border:         1px solid rgba(107,114,128,0.2)
font-size:      12px
/* "Đã đóng đăng ký" */

Image overlay text:
  background:   rgba(0,0,0,0.5) full-width bottom
  color:        #ffffff
  font-size:    13px, font-weight: 600
  text-align:   center
  /* "ĐÃ ĐÓNG ĐĂNG KÝ" uppercase overlay */
```

#### Trust Badge / Status Indicator (hero)

```
/* "• Bạt ở những tới liên học viên" */
display:        flex; align-items: center; gap: 6px;
font-size:      12–13px, color: #155dfc

dot:            6px circle, background: #155dfc
                animation: pulse
```

---

### 7.5 Cards

#### Course Card (Khoá học)

```
background:     #ffffff
border:         1px solid #e2e8f0
border-radius:  14–16px
overflow:       hidden
transition:     box-shadow 0.2s, transform 0.2s

:hover {
  box-shadow:   0 4px 20px rgba(21,93,252,0.12)
  transform:    translateY(-2px)
  border-color: #b8e5ff
}

Thumbnail:
  width: 100%, aspect-ratio: 16/9 hoặc 4/3
  object-fit: cover
  position: relative

  Overlay badge (closed):
    position: absolute, bottom: 0, left/right: 0
    background: rgba(0,0,0,0.5)
    color: #fff, UPPERCASE, 13px, 600
    text-align: center, padding: 8px

Body:           padding: 14–16px

Badges row:     [Level badge] [Status badge], margin-bottom: 8px

Title:
  font-size: 15–16px, font-weight: 600
  color: #000f31, margin: 8px 0

Description:
  font-size: 13–14px, color: #718096
  line-clamp: 2–3, line-height: 1.6

Meta row:
  [icon Clock] [duration]  [icon Users] [count]
  font-size: 12px, color: #a0aec0, gap: 12px
  margin-top: 8px

Footer:
  border-top: 1px solid #f1f5f9
  padding-top: 12px, margin-top: 12px
  display: flex, justify-content: space-between

  Status text: 12px, color tương ứng (gray/green)
  Price:
    featured: font-size 17–18px, font-weight 700, color #155dfc
    normal:   font-size 15px, font-weight 500, color #6b7280

Link "Xem chi tiết →":
  color: #155dfc, font-size: 13px, font-weight: 500
```

#### Service Card (Dịch vụ)

```
background:     #ffffff
border:         1px solid #e2e8f0
border-radius:  14px
padding:        24–28px
text-align:     center
transition:     box-shadow 0.2s, border-color 0.2s

:hover {
  border-color: #b8e5ff
  box-shadow:   0 4px 16px rgba(21,93,252,0.1)
}

Icon area:
  width: 48px, height: 48px, margin: 0 auto 16px
  background: #eff6ff
  border-radius: 50%
  display: flex, align-items: center, justify-content: center
  icon color: #155dfc, size: 22–24px

Title:    font-size: 15px, font-weight: 600, color: #000f31
Body:     font-size: 13–14px, color: #718096, line-height: 1.6
          max lines: 3–4
```

#### Stat Card (bên trong About section — nền xanh)

```
background:     #ffffff
border-radius:  12px
padding:        20–24px
text-align:     center
box-shadow:     0 2px 8px rgba(0,0,0,0.1)

Value:  font-size: 36–40px, font-weight: 800, color: #155dfc
Label:  font-size: 13px, color: #6b7280, margin-top: 4px
```

#### Testimonial Card

```
background:     #ffffff
border:         1px solid #e2e8f0
border-radius:  14px
padding:        20–24px
box-shadow:     0 1px 4px rgba(0,0,0,0.06)

Header row:     [Avatar 40px] + [Name + Role column]
Avatar:         40px circle, object-fit: cover
Name:           15px, 600, #000f31
Role:           12px, #718096

Stars row:      ★★★★★ yellow, margin: 8px 0

Quote:
  font-size: 13–14px, color: #4a5568
  line-height: 1.7, font-style: italic optional
```

---

### 7.6 Hero Section

```
Background:
  Gradient nhẹ từ #f7f8ff / #eff6ff — KHÔNG phải trắng thuần
  Có thể dùng: background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 30%, #fff 100%)
  Hoặc: background: #f7f8ff với radial gradient overlay nhẹ

Layout:       2 cột (text trái, mockup/image phải) — desktop
              Stack (text trên, image dưới) — mobile
min-height:   80–90vh
padding-top:  80px (compensate navbar)

Trust indicator:
  [• dot blue] ["Bạt ở những tới liên học viên" text blue]
  font-size: 12px, color: #155dfc, margin-bottom: 20px

H1 — 2 dòng màu khác nhau:
  Line 1: font-size 48–60px, 800, color #000f31
  Line 2: font-size 48–60px, 800, color #155dfc
  line-height: 1.1

Description:
  font-size: 15–17px, color: #718096
  max-width: 480px, line-height: 1.65
  margin-top: 16px

CTA:
  [Button primary #155dfc rounded-full]
  margin-top: 28–32px

Stats row:
  margin-top: 40px
  [50+] [2+] [98%] — value: 28–32px, 700, #000f31
  label: 12px, #718096
  gap: 32–40px, separator: optional "│" #e2e8f0

Right image:
  Browser mockup với screenshot/design image
  border-radius: 14–16px
  box-shadow: 0 8px 32px rgba(0,0,0,0.12)
  max-width: 480–520px
```

---

### 7.7 About Section — SECTION ĐẶC BIỆT (nền xanh solid)

```
background:       #155dfc              ← solid blue, DUY NHẤT section này
padding-y:        64–80px
color:            #ffffff

Layout:           2 cột — [text trái] [stat grid 2×2 phải]

Left column:
  Label:          "VỀ CHÚNG TÔI", UPPERCASE, 12px, rgba(255,255,255,0.7)
  Heading:        font-size 28–34px, 700, #ffffff
  Body:           font-size 14–15px, rgba(255,255,255,0.8), line-height 1.65

Stat cards (2×2 grid):
  background: #ffffff
  border-radius: 12px
  padding: 20–24px, text-align: center
  
  Value:  36–40px, 800, color: #155dfc
  Label:  13px, color: #6b7280
```

---

### 7.8 Section Structure — Standard

```
padding-y:   80–100px
background:  #ffffff (default) hoặc #f7f8ff (xen kẽ)

Container:   max-width 1200px, margin 0 auto
             padding-x: 24px (mobile) / 48px (desktop)

Section label (centered):
  font-size: 12px, font-weight: 600, color: #155dfc
  UPPERCASE, letter-spacing: 0.06em
  margin-bottom: 8px
  text-align: center

Section heading (centered):
  font-size: 28–36px, font-weight: 700, color: #000f31
  margin-bottom: 12px
  text-align: center

Section description (centered, optional):
  font-size: 15–16px, color: #718096
  max-width: 540px, margin: 0 auto 48px
  text-align: center

Card grid:
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
  gap: 16–20px
  margin-top: 40–48px
```

---

### 7.9 Form & Input

```
Label:
  font-size: 13px, font-weight: 500, color: #374151
  margin-bottom: 6px

Input / Textarea:
  background: #ffffff
  border: 1px solid #e2e8f0
  border-radius: 8px
  color: #000f31
  font-size: 14px
  padding: 10–12px 14px

  placeholder: color #a0aec0

  :focus {
    border-color: #155dfc
    box-shadow: 0 0 0 3px rgba(21,93,252,0.1)
    outline: none
  }

Textarea: min-height 120px, resize: vertical

Required (*): color #ef4444

Submit button:
  width: 100%
  background: #155dfc, color #fff
  border-radius: 9999px
  padding: 13px
  font-weight: 600
  → Button Primary (§7.3)
```

---

### 7.10 Contact Info Block

```
layout:  vertical stack, gap: 16px

Item:    [icon 18px, color #155dfc]  [text]
         gap: 12px, align-items: flex-start

icon:    Lucide/Heroicons, color: #155dfc
text:    font-size: 14px, color: #4a5568
link:    color: #155dfc, hover: underline
```

---

### 7.11 Facebook Popup (bottom-left)

```
Floating widget bottom-left
background: #155dfc
border-radius: 12px
padding: 16px
max-width: 220px
box-shadow: 0 4px 20px rgba(0,0,0,0.15)

Thumbnail: rounded image
Title: 14px, 600, #fff
Body: 12px, rgba(255,255,255,0.8)
Button: bg #fff, color #155dfc, border-radius: 9999px
        font-size: 13px, font-weight: 600
```

---

### 7.12 Footer

```
background:   #ffffff
border-top:   1px solid #e2e8f0
padding:      40–56px 0 24px

Layout 2 col:
  Left:  [Logo E STUDIO] + [tagline] + [social links]
  Right: optional nav links

Logo:     [E icon] + "STUDIO" text, color #155dfc, font-weight 700

Tagline:  "Thiết kế • Đào tạo • Sáng tạo"
          font-size: 13px, color: #718096

Social links:
  [Instagram] [Facebook] [Email] — plain text links
  font-size: 13px, color: #718096 -> #155dfc on hover

Copyright:
  font-size: 12px, color: #a0aec0
  margin-top: 16px

"Built with Elwaire":
  font-size: 12px, color: #a0aec0
```

---

## 8. CSS VARIABLES — COPY & PASTE

```css
:root {
  /* Background */
  --bg-page:        #ffffff;
  --bg-hero:        #f0f4ff;
  --bg-section-alt: #f7f8ff;
  --bg-card:        #ffffff;
  --bg-tag:         #eff6ff;
  --bg-about:       #155dfc;    /* Special section only */

  /* Accent */
  --accent:         #155dfc;
  --accent-hover:   #1248c9;
  --accent-light:   #b8e5ff;
  --accent-tint:    #eff6ff;
  --accent-glow:    rgba(21, 93, 252, 0.12);

  /* Text */
  --text-heading:   #000f31;    /* Dark navy — headings */
  --text-body:      #4a5568;    /* Gray — body text */
  --text-muted:     #718096;    /* Light gray — descriptions */
  --text-caption:   #a0aec0;    /* Very light — meta/captions */
  --text-accent:    #155dfc;    /* Blue — labels, prices, links */
  --text-on-blue:   #ffffff;    /* On #155dfc backgrounds */

  /* Border */
  --border:         #e2e8f0;    /* Standard border */
  --border-hover:   #b8e5ff;    /* Blue hover border */
  --border-focus:   #155dfc;    /* Focus border */

  /* Status */
  --status-open:    #10b981;
  --status-closed:  #6b7280;
  --status-limited: #f59e0b;

  /* Shadow */
  --shadow-card:    0 1px 4px rgba(0,0,0,0.08);
  --shadow-hover:   0 4px 20px rgba(21,93,252,0.12);
  --shadow-btn:     0 2px 8px rgba(21,93,252,0.25);

  /* Layout */
  --container:      1200px;
  --section-py:     80px;
  --card-radius:    14px;

  /* Font */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont,
               "Segoe UI", system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

---

## 9. ANIMATION & MOTION

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.4); }
}
```

| Element | Behavior |
|---|---|
| Page sections | fadeInUp on scroll, stagger 0.08s |
| Card hover | translateY(-2px) + shadow + border blue |
| Primary button | translateY(-1px) + deeper shadow |
| Input focus | border blue + box-shadow blue 10% opacity |
| Status dot | pulse animation |
| Splash screen | fadeOut sau 1.5s |

---

## 10. AI PROMPT TEMPLATE

```
Tao trang web [linh vuc] theo Elwaire Design System:

THEME: LIGHT (nen trang) — KHONG dung dark theme

COLORS:
  Nen page:       #ffffff
  Nen hero:       #f0f4ff (xanh nhat nhe)
  Accent chinh:   #155dfc (electric blue)
  Text heading:   #000f31 (dark navy)
  Text body:      #4a5568
  Text muted:     #718096
  Border:         #e2e8f0
  Border hover:   #b8e5ff
  Card bg:        #ffffff
  Status open:    #10b981
  Status closed:  #6b7280

  DIEM DANG TRUONG: H1 co 2 dong mau khac nhau
    Dong 1: color #000f31
    Dong 2: color #155dfc (blue)

  SECTION ABOUT: Duy nhat section nay dung bg #155dfc solid
    + stat cards trang tren nen xanh

TYPOGRAPHY:
  Font: Inter / Plus Jakarta Sans
  H1: 2 dong — dong 1 #000f31, dong 2 #155dfc, font-weight 800
  H2: 700, #000f31, text-align center trong section
  Body: 400, #4a5568, line-height 1.65
  Section label: UPPERCASE 12px 600 #155dfc, centered, truoc heading

BUTTONS:
  Primary: bg #155dfc, color #fff, border-radius 9999px (fully rounded)
  Ghost: border #155dfc, color #155dfc, bg transparent, radius 9999px
  Hover: translateY(-1px) + shadow rgba(21,93,252,0.25)

CARDS:
  background #ffffff, border 1px solid #e2e8f0, border-radius 14px
  :hover border-color #b8e5ff + box-shadow 0 4px 20px rgba(21,93,252,0.12)

LAYOUT:
  Container: 1200px
  Section padding-y: 80–100px
  Card gap: 16–20px
  Section heading + label: centered

SECTIONS CAN CO:
1. Navbar: bg #fff, [Logo blue] + [links #4a5568] + [avatar]
2. Hero: bg #f0f4ff gradient, H1 2 mau, [blue CTA rounded], [mockup image]
3. [Content section]: centered label + H2 + card grid
4. About: bg #155dfc, 2-col [text+stats], stat cards trang
5. Testimonials: bg #fff, 3 cards
6. Contact: form + contact info
7. Footer: bg #fff, logo + social + copyright

LINH VUC: [dien vao]
SECTIONS: [dien vao]
```

---

## 11. DO & DON'T

### ✅ DO
- Nền trang `#ffffff` — light theme
- Hero bg có màu xanh nhạt nhẹ `#f0f4ff` hoặc `#eff6ff`
- H1: **2 dòng khác màu** — dòng 1 navy, dòng 2 blue
- Accent `#155dfc` cho button, label, price, icon
- Button CTA: **`border-radius: 9999px`** — fully rounded, đặc trưng
- Card: white bg + border `#e2e8f0` + hover shadow blue
- Section heading: **centered + label nhỏ xanh phía trên**
- About section: **solid `#155dfc`** — duy nhất section này dùng nền xanh
- Text body: `#4a5568`, KHÔNG dùng `#000` hay `#333`
- Input focus: border `#155dfc` + glow `rgba(21,93,252,0.1)`

### ❌ DON'T
- Không dùng nền dark `#000`, `#111`, `#000f31` cho page bg
- Không dùng `#000f31` làm nền — nó là **màu text heading**
- Không dùng white accent — CTA luôn là `#155dfc`
- Không dùng `border-radius: 8px` cho button CTA — phải **`9999px`**
- Không căn lề trái section heading — phải **centered**
- Không bỏ section label (chữ xanh nhỏ phía trên heading)
- Không card có nền tối — card phải trắng trên trang sáng
- Không bỏ hero H1 pattern 2 màu (đặc trưng nhất của Elwaire)

---

*Elwaire Design System v3.0 — Verified against real screenshot + DevTools CSS extraction*  
*March 2026*