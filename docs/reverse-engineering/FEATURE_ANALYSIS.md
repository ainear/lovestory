# FEATURE_ANALYSIS.md — CineLove Complete Feature Breakdown

## Core Features (Revenue-Critical)

### 1. Template Gallery
- **Purpose:** First touchpoint for users — browse and select invitation designs
- **Details:** 8 categories, BASIC/PREMIUM tier filtering, preview modal with QR code, live iframe preview
- **Monetization:** Premium templates locked behind paid plans

### 2. Visual Editor (Page Builder)
- **Purpose:** The core product — drag-and-drop invitation creation
- **Details:**
  - 8 toolbox tabs (Text, Photos, Stock materials, Backgrounds, Music, Widgets, Templates, Effects)
  - Canvas-based editing with zoom controls
  - Right property panel (font, color, size, alignment, shadows, animations)
  - Undo/Redo, Layer management
  - Auto-save (real-time status indicator)
- **Tech:** Custom JavaScript editor with JSON layout data

### 3. Publishing System
- **Purpose:** Generate public shareable invitation URL
- **Details:** One-click publish → unique URL → QR code → social sharing
- **URL Format:** `cinelove.me/showcase/pc/[id]`

### 4. Tiered Pricing Plans
- **Purpose:** Revenue generation
- **Tiers:**
  | Feature | Free | Basic (199K) | Premium (299K) |
  |---------|------|-------------|----------------|
  | Projects | 1 | 3 | 5 |
  | Photos | 10 | 50 | 100 |
  | Views | 300 | 10,000 | 50,000 |
  | Storage | 6 months | 2 years | 5 years |
  | Watermark | Yes | No | No |
  | Custom Music | No | Yes | Yes |
  | Custom Font | No | No | Yes |
  | Background Removal (AI) | No | No | Yes |
  | YouTube Embed | No | No | Yes |
  | Custom Forms | No | No | Yes |
  | Auto Guest Names | No | No | Yes |

---

## Advanced Features (Differentiation)

### 5. Interactive Widgets
- **Purpose:** Make invitations interactive, not static images
- **Widgets:**
  - 📅 Calendar (wedding date display)
  - ⏱️ Countdown timer (real-time)
  - 🗺️ Google Maps embed (venue directions)
  - 📞 Call button (direct phone call)
  - ✅ RSVP form (attendance confirmation)
  - 📝 Custom forms (any data collection)
  - 👤 Dynamic guest names (via URL parameter)
  - 📱 QR code box
  - 🎥 YouTube video embed
  - 📸 Photo album slider

### 6. Guest Interaction System
- **Wish Wall:** Guests submit blessings/wishes visible on the invitation
- **RSVP:** Attendance confirmation with guest count
- **Gift System:** QR bank transfer for monetary gifts

### 7. Global Animation Effects
- **Purpose:** Create cinematic feel
- **Effects:** Falling hearts, leaves, snow, confetti particles
- **Element Animations:** Entrance effects (fade, slide, zoom) + loop animations (pulse, bounce)

### 8. Background Music
- **Library:** Pre-loaded romantic/wedding tracks
- **Custom Upload:** MP3 upload for paid plans
- **Auto-play:** Music starts when invitation opens

---

## Secondary Features (Engagement & Retention)

### 9. Dashboard Analytics
- **Purpose:** Show value to users, encourage engagement
- **Metrics:** Website count, Photo count, View count (with progress bars vs limits)

### 10. Personalized Guest Names (Premium)
- **Purpose:** Premium differentiator — each guest sees their name on the invitation
- **Tech:** URL parameter substitution (`?name=Nguyen Van A`)

### 11. Partner Program
- **Purpose:** B2B channel for studios and agencies
- **Features:** Higher limits, client management, custom branding
- **Status:** "MỚI" (New) — recently launched

### 12. Full-Service Package (Thiệp Trọn Gói)
- **Purpose:** Additional revenue from users who don't want to DIY
- **Packages:**
  - Gói 1: 149K (1 profile)
  - Gói 2: 219K (1 shared invitation)
  - Gói 3: 249K (2 separate invitations)
  - Add-ons: Rush 24h (+69K), Auto guest names (+99K)

### 13. Add-on System
- **Purpose:** Upsell beyond plan limits
- **Types:** Extra views, extra photos, priority support
- **Tracked:** Dashboard shows purchased add-ons count

### 14. Multi-Category Templates
- **Purpose:** Expand TAM beyond weddings
- **Categories:** Wedding, Birthday, Graduation, Event, Anniversary, Wishes, Other

### 15. Customer Showcase
- **Purpose:** Social proof — show real customer invitations
- **URL:** `/thiep-cuoi/khach-hang`
- **Effect:** Build trust and inspiration

### 16. Feedback System
- **Purpose:** User engagement and product improvement
- **Location:** Dashboard sidebar → Đóng góp ý kiến

### 17. Website Builder (Experimental)
- **Purpose:** Expand into general website building
- **Evidence:** "Website khác" section + "Web hay ho" creation option
- **Status:** Appears early-stage / secondary focus

---

## Features NOT Present (vs LoveStory Design)

| Feature | CineLove | LoveStory (Planned) |
|---------|----------|-------------------|
| AI Video Generation | ❌ | ✅ FFmpeg + AI |
| AI Text Generation | ❌ | ✅ Gemini API |
| Face Detection | ❌ | ✅ face-api.js |
| Smart Photo Crop | ❌ | ✅ |
| Background Removal | ✅ (Premium only) | ✅ |
| Video Export | ❌ | ✅ |
| Subscription Model | One-time payment | Subscription + Credits |
| Edge Workers | Unknown | ✅ Cloudflare Workers |
