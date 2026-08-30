"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface TemplateItem {
  id: string;
  slug: string;
  name: string;
  tag: string;
  category: "all" | "luxury" | "romantic" | "botanical" | "vintage";
  thumbnail: string;
  usageCount: number;
  musicName: string;
  musicUrl: string;
  desc: string;
}

const BESPOKE_TEMPLATES: TemplateItem[] = [
  {
    id: "t-42",
    slug: "thiep-cuoi-42",
    name: "Rose Garden Romance",
    tag: "Bespoke #1",
    category: "romantic",
    thumbnail: "/cinelove-cdn/templates/long_thumbnail/5731de59-c0f3-4fa7-9860-e5e47b829ce3.webp",
    usageCount: 38211,
    musicName: "Lời Tỏ Tình Ngọt Ngào (V-POP)",
    musicUrl: "https://assets.7app.online/audio/wedding-tracks/m3.mp3",
    desc: "Full-bleed hero, tilted cameos, hoa hồng pastel tinh tế",
  },
  {
    id: "t-39",
    slug: "thiep-cuoi-39",
    name: "Champagne Cream & Harmony",
    tag: "Luxury Gold",
    category: "luxury",
    thumbnail: "/cinelove-cdn/templates/long_thumbnail/a2f11727-8717-46db-ada4-ff29271ce53b.webp",
    usageCount: 23327,
    musicName: "Canon in D — Pachelbel (Classical)",
    musicUrl: "https://assets.7app.online/audio/wedding-tracks/m33.mp3",
    desc: "Khung vòm hoàng gia, chân dung oval mạ vàng quý phái",
  },
  {
    id: "t-46",
    slug: "thiep-cuoi-46",
    name: "Modern Trend Lavender 2026",
    tag: "Trending 2026",
    category: "romantic",
    thumbnail: "/cinelove-cdn/templates/long_thumbnail/efd815e3-41ff-4eb3-b31b-c25b202bc08c_1762512003.webp",
    usageCount: 22535,
    musicName: "Cherry Blossom Romance (K-POP)",
    musicUrl: "https://assets.7app.online/audio/wedding-tracks/m31.mp3",
    desc: "Thẻ nổi film-strip 3 ảnh, tone tím lavender thời thượng",
  },
  {
    id: "t-36",
    slug: "thiep-cuoi-36",
    name: "Royal Heritage Burgundy",
    tag: "Hoàng Gia",
    category: "luxury",
    thumbnail: "/cinelove-cdn/templates/long_thumbnail/e554cdff-72d4-4657-863a-68cf83b61fe3.webp",
    usageCount: 20140,
    musicName: "Liebestraum — Liszt (Piano)",
    musicUrl: "https://assets.7app.online/audio/wedding-tracks/m36.mp3",
    desc: "Monogram huy hiệu gia tộc, tone đỏ nhung sang trọng",
  },
  {
    id: "t-44",
    slug: "thiep-cuoi-44",
    name: "Midnight Gold Luxury",
    tag: "Dark Mode VIP",
    category: "luxury",
    thumbnail: "/cinelove-cdn/templates/long_thumbnail/0189eb35-5cf1-4525-a8d0-867f70e0bf67.webp",
    usageCount: 16322,
    musicName: "Moonlit Piano (Acoustic)",
    musicUrl: "https://assets.7app.online/audio/wedding-tracks/m27.mp3",
    desc: "Dark mode dạ tiệc, viền ánh vàng gold foil quý phái",
  },
  {
    id: "t-16",
    slug: "thiep-cuoi-16",
    name: "Botanical Garden Greenery",
    tag: "Natural Chic",
    category: "botanical",
    thumbnail: "/cinelove-cdn/templates/long_thumbnail/8d4b8ad3-0d91-4cba-9e16-e5c2de3275b4.webp",
    usageCount: 14864,
    musicName: "Sweet Guitar Morning (Acoustic)",
    musicUrl: "https://assets.7app.online/audio/wedding-tracks/m19.mp3",
    desc: "Tone xanh ngọc lục bảo & sage, vòng nguyệt quế thiên nhiên",
  },
  {
    id: "t-53",
    slug: "thiep-cuoi-53",
    name: "Midnight Starry Celestial",
    tag: "CineLove Parity",
    category: "luxury",
    thumbnail: "/cinelove-cdn/templates/long_thumbnail/a038df05-e9a9-408e-bd48-3cd7a239bbc4_1767931340.webp",
    usageCount: 7764,
    musicName: "Beautiful In White (International)",
    musicUrl: "https://assets.7app.online/audio/wedding-tracks/m13.mp3",
    desc: "Bầu trời sao đêm, con dấu sáp vàng & timeline sự kiện",
  },
  {
    id: "t-28",
    slug: "thiep-cuoi-28",
    name: "Vintage Sepia & Arch Window",
    tag: "Vintage Retro",
    category: "vintage",
    thumbnail: "/cinelove-cdn/templates/long_thumbnail/248881a1-7da2-4232-b69b-c39d393f0b91.webp",
    usageCount: 7203,
    musicName: "Wedding March — Mendelssohn",
    musicUrl: "https://assets.7app.online/audio/wedding-tracks/m37.mp3",
    desc: "Giấy da sepia cổ điển, cửa vòm kiến trúc châu Âu",
  },
];

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "luxury" | "romantic" | "botanical" | "vintage">("all");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [mockupPlaying, setMockupPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredTemplates = activeCategory === "all" 
    ? BESPOKE_TEMPLATES 
    : BESPOKE_TEMPLATES.filter((t) => t.category === activeCategory);

  const togglePreviewAudio = (trackUrl: string) => {
    if (playingTrack === trackUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrack(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(trackUrl);
      audio.volume = 0.85;
      audio.play().catch(() => {});
      audioRef.current = audio;
      setPlayingTrack(trackUrl);
      audio.onended = () => setPlayingTrack(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', var(--font-inter), sans-serif",
        color: "#1f2937",
        background: "#FAF7F2",
        overflowX: "hidden",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          1. LUXURY STICKY HEADER (Glassmorphism + Gold Accents)
      ══════════════════════════════════════════════════════════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "14px 28px",
          background: "rgba(250, 247, 242, 0.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.18)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.03)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 50%, #831843 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(212, 175, 55, 0.35)",
              }}
            >
              <span style={{ fontSize: 20, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>❤️</span>
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  background: "linear-gradient(135deg, #4A1525 0%, #831843 50%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                LoveStory
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#935B3B",
                  marginTop: -2,
                }}
              >
                Couture Wedding SaaS
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden md:flex">
            <Link
              href="/templates"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#4a3e3d",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              👑 20 Mẫu Bespoke
            </Link>
            <Link
              href="/gallery"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#4a3e3d",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              🖼️ Khám Phá
            </Link>
            <Link
              href="/pricing"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#4a3e3d",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              💎 Bảng Giá (199K)
            </Link>
            <Link
              href="/blog"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#4a3e3d",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              📝 Cẩm Nang Cưới
            </Link>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/login"
              style={{
                padding: "8px 18px",
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 600,
                color: "#4A1525",
                textDecoration: "none",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                background: "rgba(255, 255, 255, 0.6)",
                transition: "all 0.2s",
              }}
            >
              Đăng nhập
            </Link>
            <Link
              href="/templates"
              style={{
                padding: "10px 22px",
                borderRadius: 99,
                background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 50%, #831843 100%)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(212, 175, 55, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <span>✨ Tạo Thiệp Miễn Phí</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. HERO SECTION (High-Impact Luxury & 3D Phone Mockup)
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          paddingTop: 130,
          paddingBottom: 90,
          background: "radial-gradient(ellipse at 50% 0%, rgba(254, 243, 199, 0.45) 0%, rgba(250, 247, 242, 1) 75%)",
          overflow: "hidden",
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "15%",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(183, 110, 121, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 48,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left Content Column */}
          <div>
            {/* Prestige Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 99,
                background: "rgba(212, 175, 55, 0.12)",
                border: "1px solid rgba(212, 175, 55, 0.35)",
                color: "#831843",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              <span>👑 #1 NỀN TẢNG THIỆP CƯỚI TƯƠNG TÁC CAO CẤP VIỆT NAM</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(38px, 4.8vw, 56px)",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#2D1B22",
                margin: "0 0 20px",
                letterSpacing: -0.5,
              }}
            >
              Biến Khoảnh Khắc Trọng Đại Thành{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #935B3B 0%, #D4AF37 40%, #B76E79 80%, #831843 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                Câu Chuyện Tình Yêu Vĩnh Cửu
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "#5C4A4D",
                margin: "0 0 36px",
                maxWidth: 560,
              }}
            >
              Trải nghiệm thiệp cưới số <strong>CineLove Parity 90%+</strong> đỉnh cao: Đĩa than phát nhạc Vinyl 33 RPM có kim quay, mở phong bì tương tác mượt mà, hộp tiền mừng VietQR thông minh và bản đồ RSVP chỉ đường 1 chạm.
            </p>

            {/* CTA Group */}
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 40 }}>
              <Link
                href="/templates"
                style={{
                  padding: "16px 36px",
                  borderRadius: 99,
                  background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 50%, #831843 100%)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 8px 28px rgba(183, 110, 121, 0.4)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
              >
                <span>✨ Bắt Đầu Tạo Thiệp — Miễn Phí</span>
              </Link>
              <Link
                href="/i/thiep-cuoi-42"
                style={{
                  padding: "15px 28px",
                  borderRadius: 99,
                  background: "#fff",
                  color: "#2D1B22",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>🎬 Trải Nghiệm Demo Live</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                paddingTop: 24,
                borderTop: "1px solid rgba(212, 175, 55, 0.2)",
              }}
            >
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#831843" }}>25,000+</div>
                <div style={{ fontSize: 12, color: "#786566" }}>Cặp đôi tin tưởng</div>
              </div>
              <div style={{ width: 1, height: 32, background: "rgba(212, 175, 55, 0.25)" }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#D4AF37" }}>★ 4.9 / 5</div>
                <div style={{ fontSize: 12, color: "#786566" }}>Đánh giá hài lòng</div>
              </div>
              <div style={{ width: 1, height: 32, background: "rgba(212, 175, 55, 0.25)" }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#2D1B22" }}>100% Free</div>
                <div style={{ fontSize: 12, color: "#786566" }}>Không giới hạn view</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Smartphone Mockup */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Golden Glow Backdrop */}
            <div
              style={{
                position: "absolute",
                width: "90%",
                height: "90%",
                top: "5%",
                left: "5%",
                borderRadius: 48,
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(183, 110, 121, 0.2))",
                filter: "blur(32px)",
                zIndex: 0,
              }}
            />

            {/* Smartphone Case Frame */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: 320,
                height: 640,
                borderRadius: 44,
                background: "#1e1e24",
                padding: 10,
                boxShadow: "0 24px 60px rgba(45, 27, 34, 0.25), 0 0 0 2px rgba(212, 175, 55, 0.4)",
              }}
            >
              {/* Screen Bezel */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 36,
                  background: "linear-gradient(180deg, #fdf6f0 0%, #fce8e8 40%, #fdf6f0 100%)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {/* Dynamic Island Notch */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 90,
                    height: 20,
                    borderRadius: 12,
                    background: "#000",
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#111" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} />
                </div>

                {/* Hero Photo Simulation */}
                <div
                  style={{
                    height: 280,
                    background: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80') center/cover",
                    position: "relative",
                  }}
                >
                  {/* Subtle Gradient Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 40%, rgba(253, 246, 240, 1) 100%)",
                    }}
                  />
                  {/* Title Overlay */}
                  <div style={{ position: "absolute", bottom: 12, width: "100%", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#831843", fontWeight: 700 }}>
                      SAVE THE DATE
                    </div>
                    <div style={{ fontFamily: "var(--font-dancing), 'Dancing Script', cursive", fontSize: 26, color: "#4a2635", fontWeight: 700 }}>
                      Minh Vũ & Mai Anh
                    </div>
                  </div>
                </div>

                {/* Interactive Vinyl Record Player Inside Phone Mockup */}
                <div
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Vinyl Disc with Tone Arm */}
                  <div
                    onClick={() => setMockupPlaying(!mockupPlaying)}
                    style={{
                      position: "relative",
                      width: 90,
                      height: 90,
                      cursor: "pointer",
                    }}
                    title="Bấm để phát / dừng đĩa than"
                  >
                    {/* Rotating Disc */}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #2a2a2a 0%, #111 60%, #000 100%)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                        animation: mockupPlaying ? "spin 3.5s linear infinite" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #444",
                      }}
                    >
                      {/* Grooves */}
                      <div style={{ width: 72, height: 72, borderRadius: "50%", border: "1px solid #333" }} />
                      <div style={{ position: "absolute", width: 56, height: 56, borderRadius: "50%", border: "1px solid #2a2a2a" }} />
                      {/* Center Label */}
                      <div
                        style={{
                          position: "absolute",
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #fce7f3 0%, #D4AF37 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                        }}
                      >
                        🎵
                      </div>
                    </div>

                    {/* Tone Arm Needle */}
                    <div
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -4,
                        width: 28,
                        height: 34,
                        transformOrigin: "top right",
                        transform: mockupPlaying ? "rotate(20deg)" : "rotate(-16deg)",
                        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
                        <circle cx="22" cy="6" r="4" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                        <path d="M22 6 L10 22 L4 28" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                        <rect x="2" y="26" width="6" height="4" rx="1.5" fill="#f43f5e" />
                      </svg>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", marginTop: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4a2635" }}>Canon in D — Pachelbel</div>
                    <div style={{ fontSize: 9, color: "#935B3B" }}>
                      {mockupPlaying ? "▶ Đang phát đĩa than (33 RPM)" : "⏸ Chạm đĩa than để phát nhạc"}
                    </div>
                  </div>

                  {/* Simulated Action Buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12, width: "100%" }}>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: 14,
                        background: "#831843",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        border: "none",
                      }}
                    >
                      💌 Xác nhận RSVP
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: 14,
                        background: "#fff",
                        color: "#831843",
                        fontSize: 10,
                        fontWeight: 700,
                        border: "1px solid rgba(131, 24, 67, 0.25)",
                      }}
                    >
                      🎁 Mừng cưới QR
                    </button>
                  </div>
                </div>

                {/* Floating Notification Pills Over Mockup */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 10,
                    right: 10,
                    padding: "6px 12px",
                    borderRadius: 99,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 9,
                    fontWeight: 600,
                    color: "#059669",
                  }}
                >
                  <span>✨ 128 Khách đã gửi lời chúc</span>
                  <span style={{ color: "#831843" }}>Xem tường 👉</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. TOP 20 BESPOKE TEMPLATES SHOWCASE (CineLove Parity 90%+)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#D4AF37",
            }}
          >
            BỘ SƯU TẬP ĐỘC QUYỀN 2026
          </span>
          <h2
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 800,
              color: "#2D1B22",
              margin: "8px 0 16px",
            }}
          >
            20 Mẫu Thiệp Bespoke Đẳng Cấp Hoàng Gia
          </h2>
          <p style={{ color: "#6b585a", maxWidth: 640, margin: "0 auto 32px", fontSize: 15 }}>
            Từng mẫu thiệp được thiết kế tỉ mỉ theo tiêu chuẩn CineLove Parity cao nhất, tích hợp sẵn bản nhạc tone-matched riêng biệt.
          </p>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { key: "all", label: "⭐ Tất cả (20 Mẫu)" },
              { key: "luxury", label: "👑 Hoàng Gia & Luxury Gold" },
              { key: "romantic", label: "🌸 Lãng Mạn Pastel" },
              { key: "botanical", label: "🌿 Tối Giản & Botanical" },
              { key: "vintage", label: "📜 Cổ Điển Vintage" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as any)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: activeCategory === cat.key ? 700 : 500,
                  border: activeCategory === cat.key ? "1px solid #D4AF37" : "1px solid rgba(212, 175, 55, 0.2)",
                  background: activeCategory === cat.key ? "linear-gradient(135deg, #D4AF37, #B76E79)" : "#fff",
                  color: activeCategory === cat.key ? "#fff" : "#4A1525",
                  cursor: "pointer",
                  boxShadow: activeCategory === cat.key ? "0 4px 12px rgba(212, 175, 55, 0.3)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {filteredTemplates.map((template) => {
            const isPlayingThis = playingTrack === template.musicUrl;
            return (
              <div
                key={template.id}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 8px 28px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(212, 175, 55, 0.18)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                className="template-card"
              >
                {/* Thumbnail Container */}
                <div style={{ position: "relative", height: 380, overflow: "hidden", background: "#f8f5f0" }}>
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    className="template-img"
                  />
                  {/* Tag Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      padding: "4px 12px",
                      borderRadius: 99,
                      background: "rgba(45, 27, 34, 0.85)",
                      backdropFilter: "blur(8px)",
                      color: "#D4AF37",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    {template.tag}
                  </div>

                  {/* Usage Counter */}
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: "rgba(255, 255, 255, 0.92)",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#831843",
                    }}
                  >
                    ❤️ {template.usageCount.toLocaleString()} cặp đôi
                  </div>
                </div>

                {/* Info Card Content */}
                <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#2D1B22",
                      margin: "0 0 4px",
                    }}
                  >
                    {template.name}
                  </h3>
                  <p style={{ fontSize: 12, color: "#6b585a", margin: "0 0 14px", flex: 1 }}>
                    {template.desc}
                  </p>

                  {/* Music Audio Preview Pill */}
                  <div
                    onClick={() => togglePreviewAudio(template.musicUrl)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: 14,
                      background: isPlayingThis ? "rgba(212, 175, 55, 0.15)" : "#FAF7F2",
                      border: isPlayingThis ? "1px solid #D4AF37" : "1px solid rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                      <span style={{ fontSize: 14 }}>{isPlayingThis ? "🔊" : "🎵"}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#4A1525", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                        {template.musicName}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#D4AF37", flexShrink: 0 }}>
                      {isPlayingThis ? "Dừng" : "Nghe thử"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link
                      href={`/editor/new?template=${template.slug}`}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "10px 0",
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 100%)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(212, 175, 55, 0.25)",
                      }}
                    >
                      ✏️ Chọn Mẫu Này
                    </Link>
                    <Link
                      href={`/i/${template.slug}`}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        background: "#FAF7F2",
                        color: "#4A1525",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                        border: "1px solid rgba(212, 175, 55, 0.25)",
                      }}
                    >
                      👁️
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            href="/templates"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 99,
              background: "#fff",
              color: "#831843",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            <span>✨ Khám Phá Toàn Bộ 80+ Mẫu Thiệp Đẹp Nhất 👉</span>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. BENTO GRID LUXURY FEATURES (4 Core Pillars)
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: "90px 24px",
          background: "linear-gradient(180deg, #FAF7F2 0%, #F5EDE4 100%)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 54 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#D4AF37" }}>
              CÔNG NGHỆ TƯƠNG TÁC ĐỈNH CAO
            </span>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 800,
                color: "#2D1B22",
                margin: "8px 0 16px",
              }}
            >
              Mọi Tính Năng Hoàn Hảo Cho Ngày Hạnh Phúc
            </h2>
            <p style={{ color: "#6b585a", maxWidth: 620, margin: "0 auto", fontSize: 15 }}>
              Không chỉ là tấm thiệp mời, LoveStory mang đến trải nghiệm cảm xúc đa giác quan khó quên cho từng vị khách quý.
            </p>
          </div>

          {/* Bento Grid Container */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 24,
            }}
          >
            {/* Bento 1: Vinyl Disc Music (7 cols) */}
            <div
              style={{
                gridColumn: "span 7",
                background: "linear-gradient(135deg, #1e1e28 0%, #2a1b24 100%)",
                borderRadius: 28,
                padding: "36px 40px",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              }}
              className="bento-card-7"
            >
              <div style={{ maxWidth: 360, position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#D4AF37", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  🎵 R2 AUDIO SUITE & VINYL DISC
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>
                  Đĩa Than Phát Nhạc & Fade-In Âm Thanh
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255, 255, 255, 0.75)", margin: "0 0 20px" }}>
                  40+ bản nhạc cưới bản quyền không lời. Đĩa than xoay 33 1/3 RPM với cần gạt kim cảm ứng và thuật toán Fade-in tăng dần âm lượng êm dịu, không giật mình.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, background: "rgba(212, 175, 55, 0.2)", color: "#fef3c7", fontSize: 11, fontWeight: 600 }}>
                  ✨ 40+ Tuyệt phẩm Acoustic, Piano & V-POP
                </div>
              </div>

              {/* Decorative Giant Vinyl Disc Art */}
              <div
                style={{
                  position: "absolute",
                  right: -40,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #333 0%, #111 70%, #000 100%)",
                  boxShadow: "0 0 40px rgba(0,0,0,0.6)",
                  border: "2px solid #555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37, #B76E79)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  🎶
                </div>
              </div>
            </div>

            {/* Bento 2: VietQR & Wish Wall (5 cols) */}
            <div
              style={{
                gridColumn: "span 5",
                background: "#fff",
                borderRadius: 28,
                padding: "36px",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              className="bento-card-5"
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#831843", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  💝 HỘP TIỀN MỪNG VIETQR
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#2D1B22", margin: "0 0 10px" }}>
                  Mừng Cưới 1 Chạm & Sổ Lưu Bút
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#6b585a", margin: 0 }}>
                  Khách quét mã VietQR tự động điền số tài khoản, chuyển tiền mừng trực tiếp về ngân hàng của bạn kèm lời chúc hiển thị thời gian thực trên tường thiệp.
                </p>
              </div>
              <div style={{ marginTop: 24, padding: "12px 16px", borderRadius: 16, background: "#FAF7F2", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>📱</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#2D1B22" }}>Hỗ trợ 50+ ngân hàng Việt Nam & MoMo/ZaloPay</span>
              </div>
            </div>

            {/* Bento 3: Smart RSVP & Maps (5 cols) */}
            <div
              style={{
                gridColumn: "span 5",
                background: "#fff",
                borderRadius: 28,
                padding: "36px",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.04)",
              }}
              className="bento-card-5"
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                📍 CHỈ ĐƯỜNG & RSVP THÔNG MINH
              </div>
              <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#2D1B22", margin: "0 0 10px" }}>
                Xác Nhận Tham Dự & Google Maps
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#6b585a", margin: "0 0 20px" }}>
                Khách mời dễ dàng tìm địa chỉ nhà hàng tiệc cưới với 1 chạm mở bản đồ GPS, đồng thời xác nhận số lượng người đi kèm giúp bạn chốt bàn tiệc chính xác.
              </p>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 99, background: "rgba(5, 150, 105, 0.1)", color: "#059669", fontSize: 11, fontWeight: 700 }}>
                ✓ Quản lý danh sách khách mời trong Dashboard
              </div>
            </div>

            {/* Bento 4: Visual Canvas Studio (7 cols) */}
            <div
              style={{
                gridColumn: "span 7",
                background: "linear-gradient(135deg, #fff 0%, #fdf8f5 100%)",
                borderRadius: 28,
                padding: "36px 40px",
                border: "1px solid rgba(212, 175, 55, 0.25)",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              className="bento-card-7"
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#D4AF37", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  🎨 VISUAL CANVAS STUDIO
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#2D1B22", margin: "0 0 12px" }}>
                  Tự Do Sáng Tạo Không Giới Hạn
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#6b585a", margin: 0 }}>
                  Thỏa sức kéo thả ảnh, đổi con dấu sáp vàng (Wax Seal), chọn font chữ thư pháp, chèn video cưới và điều chỉnh hiệu ứng mở phong bì sang trọng chuẩn CineLove.
                </p>
              </div>
              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["💌 Mở Phong Bì 3D", "✨ Cánh Hoa Bay", "🕯️ Con Dấu Sáp", "📸 Album Ảnh Grid", "⏳ Đếm Ngược Ngày Cưới"].map((feat) => (
                  <span key={feat} style={{ padding: "6px 14px", borderRadius: 99, background: "#FAF7F2", border: "1px solid rgba(212, 175, 55, 0.2)", fontSize: 11, fontWeight: 600, color: "#4A1525" }}>
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. COMPARISON MATRIX (Thiệp Giấy vs LoveStory Luxury)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#D4AF37" }}>
            TẠI SAO CHỌN LOVESTORY?
          </span>
          <h2
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 800,
              color: "#2D1B22",
              margin: "8px 0",
            }}
          >
            Thiệp Giấy Truyền Thống vs LoveStory Luxury
          </h2>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid rgba(212, 175, 55, 0.25)",
            boxShadow: "0 12px 36px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", padding: "18px 24px", background: "#FAF7F2", borderBottom: "1px solid rgba(212, 175, 55, 0.15)", fontWeight: 700, fontSize: 13, color: "#2D1B22" }}>
            <div>Tiêu chí so sánh</div>
            <div style={{ color: "#9ca3af" }}>Thiệp Giấy In Truyền Thống</div>
            <div style={{ color: "#831843" }}>❤️ LoveStory Luxury</div>
          </div>

          {[
            { metric: "Chi phí trung bình", paper: "3.000.000đ – 10.000.000đ (in ấn)", love: "0đ (Miễn phí) hoặc 199K trọn đời" },
            { metric: "Thời gian hoàn thành", paper: "7 – 14 ngày in ấn & gửi bưu điện", love: "Chỉ 2 phút là có ngay link chia sẻ" },
            { metric: "Âm nhạc & Đĩa than Vinyl", paper: "Không có", love: "40+ bài nhạc cưới & đĩa than xoay live" },
            { metric: "Xác nhận RSVP & Chỉ đường", paper: "Gọi điện hỏi từng khách rất bất tiện", love: "1 chạm Google Maps & RSVP tự động" },
            { metric: "Mừng cưới qua VietQR", paper: "Phải dùng phong bì tiền mặt", love: "Quét VietQR nhận tiền mừng tức thì" },
            { metric: "Cập nhật khi đổi địa điểm", paper: "Phải in lại toàn bộ thiệp mới", love: "Sửa online cập nhật ngay lập tức" },
          ].map((row, idx) => (
            <div
              key={row.metric}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr",
                padding: "16px 24px",
                borderBottom: idx === 5 ? "none" : "1px solid rgba(0,0,0,0.04)",
                fontSize: 13,
                alignItems: "center",
                background: idx % 2 === 0 ? "#fff" : "rgba(250, 247, 242, 0.5)",
              }}
            >
              <div style={{ fontWeight: 600, color: "#2D1B22" }}>{row.metric}</div>
              <div style={{ color: "#6b7280" }}>{row.paper}</div>
              <div style={{ fontWeight: 700, color: "#831843" }}>{row.love}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. REAL LOVE STORIES (Social Proof & Testimonials)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", background: "#FAF7F2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#D4AF37" }}>
              CÂU CHUYỆN TÌNH YÊU
            </span>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(26px, 3.2vw, 38px)",
                fontWeight: 800,
                color: "#2D1B22",
                margin: "8px 0",
              }}
            >
              Hơn 25,000 Cặp Đôi Đã Trao Gửi Yêu Thương
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {[
              {
                couple: "Minh Vũ & Mai Anh",
                city: "Hà Nội",
                date: "Tháng 05/2026",
                quote: "Thiệp cưới của LoveStory làm bạn bè mình ai cũng trầm trồ vì đĩa than phát nhạc quá xịn xò. Khách ở xa chuyển khoản mừng cưới qua VietQR cực kỳ tiện lợi!",
                avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?w=150&auto=format&fit=crop&q=80",
              },
              {
                couple: "Tuấn Hưng & Thảo Linh",
                city: "TP. Hồ Chí Minh",
                date: "Tháng 06/2026",
                quote: "Mình chọn mẫu Bespoke 39 Champagne Gold, giao diện mượt như CineLove mà lại được dùng miễn phí. Nâng cấp 199K bỏ watermark là mức giá quá hời cho chất lượng này.",
                avatar: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=150&auto=format&fit=crop&q=80",
              },
              {
                couple: "Hoàng Long & Ngọc Trang",
                city: "Đà Nẵng",
                date: "Tháng 08/2026",
                quote: "Tính năng RSVP chỉ đường Google Maps giúp khách của tụi mình đến đúng sảnh tiệc mà không cần phải gọi điện hỏi đường. Rất cảm ơn đội ngũ LoveStory!",
                avatar: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=150&auto=format&fit=crop&q=80",
              },
            ].map((item) => (
              <div
                key={item.couple}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 28,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(212, 175, 55, 0.18)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ color: "#D4AF37", fontSize: 16, marginBottom: 12 }}>★★★★★</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "#4A1525", fontStyle: "italic", margin: "0 0 20px" }}>
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={item.avatar} alt={item.couple} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B22" }}>{item.couple}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.city} • {item.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. BOTTOM LUXURY CTA BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px 100px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #2D1B22 0%, #4A1525 50%, #1e1e28 100%)",
            borderRadius: 36,
            padding: "60px 40px",
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 20px 60px rgba(45, 27, 34, 0.3)",
            border: "1px solid rgba(212, 175, 55, 0.4)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#D4AF37" }}>
              BẮT ĐẦU NGAY HÔM NAY
            </span>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(30px, 4vw, 44px)",
                fontWeight: 800,
                margin: "12px 0 16px",
              }}
            >
              Tạo Thiệp Cưới Sang Trọng Của Riêng Bạn
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.6, margin: "0 0 32px" }}>
              Chỉ 2 phút để biến ngày cưới của bạn trở nên trọn vẹn và đáng nhớ nhất trong lòng người thân và bạn bè.
            </p>
            <Link
              href="/templates"
              style={{
                padding: "16px 40px",
                borderRadius: 99,
                background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 100%)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 30px rgba(212, 175, 55, 0.4)",
                display: "inline-block",
              }}
            >
              ✨ Bắt Đầu Tạo Thiệp Miễn Phí Ngay
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. LUXURY FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          background: "#2D1B22",
          color: "rgba(255,255,255,0.7)",
          padding: "60px 24px 30px",
          borderTop: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }} className="footer-grid">
          <div>
            <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#D4AF37", marginBottom: 12 }}>
              ❤️ LoveStory
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 320, margin: "0 0 16px" }}>
              Nền tảng thiệp cưới online tương tác cao cấp số 1 Việt Nam. Đem lại trải nghiệm thiệp cưới số sang trọng, đẳng cấp và giàu cảm xúc.
            </p>
            <div style={{ fontSize: 12, color: "#D4AF37" }}>
              ✨ Chuẩn CineLove Parity 90%+ • R2 Audio Suite
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Sản Phẩm</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <Link href="/templates" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>20 Mẫu Bespoke</Link>
              <Link href="/gallery" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Thư Viện Mẫu</Link>
              <Link href="/pricing" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Gói Trọn Đời 199K</Link>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Tính Năng</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <span>🎵 Đĩa Than Vinyl</span>
              <span>💌 Tiền Mừng VietQR</span>
              <span>📍 Google Maps RSVP</span>
              <span>🎨 Visual Studio</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Hỗ Trợ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <Link href="/blog" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Cẩm Nang Cưới</Link>
              <Link href="/pricing" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Câu Hỏi Thường Gặp</Link>
              <span>Hotline: 0988.xxx.xxx</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center", fontSize: 12 }}>
          © 2026 LoveStory. All rights reserved. Nền tảng thiệp cưới online tương tác cao cấp.
        </div>
      </footer>

      {/* Global Embedded Styles for Animations & Responsive */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .template-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(212, 175, 55, 0.2) !important; }
        .template-card:hover .template-img { transform: scale(1.04); }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .bento-card-7, .bento-card-5 { grid-column: span 12 !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}