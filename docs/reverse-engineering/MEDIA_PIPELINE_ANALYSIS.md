# MEDIA_PIPELINE_ANALYSIS.md — CineLove Media Processing

## Overview

CineLove is **NOT** an AI video generation platform. It is a **template-based digital invitation builder** with rich interactive elements. The "cinematic" aspect comes from the invitation experience itself (animations, music, scroll effects), not from video rendering.

---

## Media Types

### 1. Image Processing
- **Upload:** Direct upload to server, stored on `img.cinelove.me`
- **Processing:** Server-side resize/optimization
- **CDN:** Served from dedicated `img.cinelove.me` domain (likely Cloudflare or similar CDN)
- **Formats:** JPEG, PNG, WEBP
- **Limits:**
  - Free: 10 images
  - Basic: 50 images
  - Premium: 100 images
  - Total storage: 5GB

### 2. Music Processing
- **Library:** Pre-loaded romantic/wedding music tracks
- **Custom Upload:** MP3 upload for Basic+ users
- **Playback:** HTML5 Audio API, auto-play on invitation load
- **No Server Processing:** Music files served as-is, no transcoding

### 3. Template Rendering
- **Type:** Client-side rendering using JSON layout data
- **Engine:** Custom JavaScript rendering engine (NOT FFmpeg video)
- **Templates:** Stored as JSON layout definitions
- **Rendering:** Browser renders invitation in real-time using CSS/JS
- **Static Export:** When publishing, the invitation is rendered as interactive HTML/CSS/JS pages

---

## No Video Generation Pipeline

**KEY FINDING:** CineLove does NOT generate videos. It creates:
- Interactive scrollable web pages (invitations)
- Real-time browser-rendered experiences
- No video encoding/decoding

The "cinematic" effect comes from:
1. CSS animations (fade-in, slide-up, zoom)
2. Scroll-triggered animations
3. Background music auto-play
4. Envelope opening animation
5. Global particle effects (hearts, leaves, snow)

---

## Content Pipeline

```
User uploads photo → API receives multipart/form-data
→ Server stores to S3/CDN → Server generates thumbnail
→ Return asset URL (img.cinelove.me/uploads/...)
→ Editor inserts URL into layout JSON
→ Auto-save layout JSON to database
→ Publish: Layout JSON → Server-side render to HTML → Deploy to CDN/hosting
→ Public URL serves the HTML page directly
```

---

## Publishing Pipeline

```
1. User clicks "Xuất bản"
2. Server reads project layout JSON
3. Server-side renders to static HTML/CSS/JS bundle
4. Static files uploaded to hosting (likely Vercel/Cloudflare)
5. Public URL generated: cinelove.me/showcase/pc/[id]
6. Each page view: view counter incremented
7. View quota checked against plan limits
```

---

## Interactive Widgets (Runtime)

The following widgets are processed at runtime (in the browser):

| Widget | Processing |
|--------|------------|
| Calendar | Client-side date calculation |
| Countdown | Client-side timer (real-time) |
| Google Maps | Google Maps JS API embed |
| Wish Wall | Real-time API calls (POST/GET wishes) |
| RSVP Form | API call to backend |
| Gift QR | QR code generated client-side (VietQR format) |
| YouTube Video | YouTube embed iframe |
| Photo Album | Client-side gallery with lightbox |
| Dynamic Guest Names | URL parameter substitution |

---

## AI Features (Premium Only)

| Feature | Implementation |
|---------|---------------|
| Background Removal | Server-side AI (rembg or similar) |
| Smart Crop | Not observed |
| AI Text Generation | Not observed |

**Background removal** is the only confirmed AI feature (Premium tier).
