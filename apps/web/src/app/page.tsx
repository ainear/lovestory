import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: "#1f2937" }}>
      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "16px 24px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            ❤️ LoveStory
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/templates" style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}>Mẫu thiệp</Link>
            <Link href="/gallery" style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}>🖼️ Khám phá</Link>
            <Link href="/pricing" style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}>Bảng giá</Link>
            <Link href="/ai-video" style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}>🎬 AI Video</Link>
            <Link
              href="/login"
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                color: "#374151",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                background: "#fff",
              }}
            >
              Đăng nhập
            </Link>
            <Link
              href="/login"
              style={{
                padding: "8px 20px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(255,107,157,0.3)",
              }}
            >
              Đăng ký miễn phí
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating decorations */}
        <div style={{ position: "absolute", top: "15%", left: "8%", fontSize: 40, opacity: 0.15, animation: "float 6s ease-in-out infinite" }}>💐</div>
        <div style={{ position: "absolute", top: "25%", right: "10%", fontSize: 36, opacity: 0.12, animation: "float 8s ease-in-out infinite 1s" }}>💕</div>
        <div style={{ position: "absolute", bottom: "20%", left: "15%", fontSize: 32, opacity: 0.1, animation: "float 7s ease-in-out infinite 2s" }}>🌹</div>
        <div style={{ position: "absolute", bottom: "30%", right: "12%", fontSize: 28, opacity: 0.08, animation: "float 5s ease-in-out infinite 0.5s" }}>✨</div>

        <div style={{ maxWidth: 700, textAlign: "center", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 20,
              background: "rgba(255,107,157,0.1)",
              color: "#ec4899",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            ✨ #1 Nền tảng thiệp cưới online Việt Nam
          </div>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
              margin: "0 0 20px",
              letterSpacing: -1,
            }}
          >
            Tạo thiệp cưới{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff6b9d, #c084fc, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              đẹp xuất sắc
            </span>
            <br />
            trong 5 phút
          </h1>
          <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.6, margin: "0 0 40px", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Thiết kế thiệp cưới online, chia sẻ qua link, nhận RSVP & lời chúc — tất cả trong một nền tảng.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/templates"
              style={{
                padding: "16px 36px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(255,107,157,0.35)",
                transition: "all 0.2s",
              }}
            >
              🎨 Tạo thiệp miễn phí
            </Link>
            <Link
              href="/i/demo-wedding"
              style={{
                padding: "16px 32px",
                borderRadius: 14,
                background: "#fff",
                color: "#374151",
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              👁️ Xem demo
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", margin: 0 }}>10K+</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Thiệp đã tạo</p>
            </div>
            <div style={{ width: 1, height: 40, background: "#e5e7eb" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", margin: 0 }}>50+</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Mẫu thiệp đẹp</p>
            </div>
            <div style={{ width: 1, height: 40, background: "#e5e7eb" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", margin: 0 }}>4.9⭐</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Đánh giá</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#c084fc", letterSpacing: 2, margin: "0 0 8px" }}>TÍNH NĂNG</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 12px" }}>Tại sao chọn LoveStory?</h2>
            <p style={{ fontSize: 16, color: "#6b7280", margin: 0 }}>Mọi thứ bạn cần cho ngày trọng đại</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "🎨", title: "50+ mẫu thiệp", desc: "Mẫu thiệp được thiết kế bởi designer chuyên nghiệp, đa dạng phong cách" },
              { icon: "📱", title: "Mobile-first", desc: "Tối ưu cho điện thoại — khách mời xem thiệp mượt mà trên mọi thiết bị" },
              { icon: "✅", title: "RSVP thông minh", desc: "Nhận xác nhận tham dự, quản lý danh sách khách mời tự động" },
              { icon: "💬", title: "Tường lời chúc", desc: "Khách mời gửi lời chúc kèm emoji — lưu giữ kỷ niệm đẹp" },
              { icon: "🎁", title: "QR mừng cưới", desc: "Tích hợp QR chuyển khoản — nhận quà dễ dàng, chuyên nghiệp" },
              { icon: "🎬", title: "Video AI Cinematic", desc: "Upload 3+ ảnh → AI tạo video cinematic cực đẹp chỉ trong vài phút!" },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  padding: 28,
                  borderRadius: 20,
                  border: "1px solid #f3f4f6",
                  background: "#fefefe",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, rgba(255,107,157,0.1), rgba(192,132,252,0.1))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Video Showcase */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(180deg, #0f0c29 0%, #1a0533 50%, #0f0c29 100%)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 20,
              background: "rgba(192,132,252,0.15)", border: "1px solid rgba(192,132,252,0.3)",
              color: "#c084fc", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 24,
            }}>
              ✨ TÍNH NĂNG MỚI
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
              Video Cinematic{" "}
              <span style={{ background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                từ AI
              </span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 32px" }}>
              Upload 3+ ảnh cưới → AI tự động tạo video có hiệu ứng Ken Burns, chuyển cảnh đẹp, nhạc nền và chữ chý rể cô dâu. Xuất video 1080p về máy chỉ trong vài phút.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {[
                { icon: "🎬", text: "4 phong cách: Cinematic, Romantic, Vintage, Modern" },
                { icon: "🧠", text: "AI generate lời chú thích tứ thiơ (Gemini AI)" },
                { icon: "⏱️", text: "Render xong trong 3-5 phút" },
                { icon: "📹", text: "Xuất 1080p Full HD, tải xuống trực tiếp" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{item.text}</span>
                </div>
              ))}
            </div>
            <Link
              href="/ai-video"
              style={{
                display: "inline-block", padding: "14px 32px", borderRadius: 14,
                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 8px 32px rgba(255,107,157,0.4)",
              }}
            >
              🎬 Thử tạo AI Video ngay
            </Link>
          </div>

          {/* Video Preview Card */}
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: 24, overflow: "hidden",
              background: "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(99,102,241,0.15))",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              padding: 24,
            }}>
              {/* Mock video player */}
              <div style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderRadius: 16, paddingBottom: "56.25%", position: "relative", marginBottom: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}>
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", flexDirection: "column", gap: 12,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, boxShadow: "0 8px 24px rgba(255,107,157,0.5)",
                  }}>▶</div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>Cinematic Wedding Video</p>
                </div>
              </div>
              {/* Style badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Cinematic", "Romantic", "Vintage", "Modern"].map((s, i) => (
                  <span key={i} style={{
                    padding: "4px 12px", borderRadius: 20,
                    background: i === 0 ? "linear-gradient(135deg, #ff6b9d, #c084fc)" : "rgba(255,255,255,0.08)",
                    color: i === 0 ? "#fff" : "rgba(255,255,255,0.6)",
                    fontSize: 12, fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div style={{
              position: "absolute", top: -16, right: -16,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              borderRadius: 16, padding: "10px 16px",
              boxShadow: "0 8px 24px rgba(255,107,157,0.5)",
            }}>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0 }}>✨ AI Powered</p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <section style={{ padding: "80px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#c084fc", letterSpacing: 2, margin: "0 0 8px" }}>QUY TRÌNH</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 48px" }}>3 bước tạo thiệp cưới</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              { step: "01", icon: "✏️", title: "Chọn mẫu", desc: "Duyệt 50+ mẫu thiệp và chọn phong cách yêu thích" },
              { step: "02", icon: "📝", title: "Điền thông tin", desc: "Nhập tên, ngày cưới, địa điểm — tự động điền vào thiệp" },
              { step: "03", icon: "🔗", title: "Chia sẻ link", desc: "Xuất bản và gửi link cho khách mời qua Zalo, Facebook" },
            ].map((s, i) => (
              <div key={i}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    margin: "0 auto 16px",
                    boxShadow: "0 8px 24px rgba(255,107,157,0.3)",
                  }}
                >
                  {s.icon}
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#c084fc", letterSpacing: 2, margin: "0 0 8px" }}>BƯỚC {s.step}</p>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Template Showcase ═══ */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(180deg, #fdf2f8 0%, #f5f3ff 50%, #ecfeff 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#c084fc", letterSpacing: 2, margin: "0 0 8px" }}>15+ MẪU THIỆP</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 12px" }}>Bộ sưu tập mẫu thiệp</h2>
            <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 500, margin: "0 auto" }}>
              Từ cổ điển sang trọng đến hiện đại tối giản — chọn phong cách phù hợp với đám cưới của bạn
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { name: "Rose Garden", bg: "linear-gradient(135deg, #fce7f3, #fdf2f8)", icon: "🌹", color: "#be185d" },
              { name: "Midnight Romance", bg: "linear-gradient(135deg, #1e1b4b, #312e81)", icon: "🌙", color: "#a78bfa", textLight: true },
              { name: "Golden Hour", bg: "linear-gradient(135deg, #fef3c7, #fffbeb)", icon: "🌅", color: "#b45309" },
              { name: "Cherry Blossom", bg: "linear-gradient(135deg, #ffe4e6, #fff1f2)", icon: "🌸", color: "#e11d48" },
              { name: "Ocean Breeze", bg: "linear-gradient(135deg, #cffafe, #ecfeff)", icon: "🌊", color: "#0891b2" },
              { name: "Royal Navy", bg: "linear-gradient(135deg, #0f172a, #1e293b)", icon: "👑", color: "#fbbf24", textLight: true },
              { name: "Emerald Forest", bg: "linear-gradient(135deg, #d1fae5, #ecfdf5)", icon: "🌿", color: "#059669" },
              { name: "Classic Elegance", bg: "linear-gradient(135deg, #27272a, #18181b)", icon: "✦", color: "#facc15", textLight: true },
            ].map((t, i) => (
              <div key={i} style={{
                borderRadius: 16, overflow: "hidden", background: t.bg,
                padding: "32px 20px", textAlign: "center", position: "relative",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}>
                <p style={{ fontSize: 32, margin: "0 0 12px" }}>{t.icon}</p>
                <p style={{
                  fontSize: 14, fontWeight: 600, margin: "0 0 4px",
                  color: t.textLight ? "#fff" : "#1f2937",
                }}>{t.name}</p>
                <p style={{
                  fontSize: 11, margin: 0,
                  color: t.textLight ? "rgba(255,255,255,0.6)" : "#6b7280",
                }}>Thiệp cưới</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              href="/templates"
              style={{
                display: "inline-block", padding: "14px 32px", borderRadius: 12,
                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 4px 20px rgba(255,107,157,0.3)",
              }}
            >
              Xem tất cả 15+ mẫu →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#c084fc", letterSpacing: 2, margin: "0 0 8px" }}>BẢNG GIÁ</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 12px" }}>Gói dịch vụ</h2>
            <p style={{ fontSize: 16, color: "#6b7280", margin: 0 }}>Bắt đầu miễn phí, nâng cấp khi cần</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {/* Free */}
            <div style={{ padding: 32, borderRadius: 24, border: "1px solid #e5e7eb", background: "#fff" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", margin: "0 0 4px" }}>🆓 Miễn phí</p>
              <p style={{ fontSize: 40, fontWeight: 800, margin: "0 0 4px" }}>0₫</p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>Mãi mãi</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {["1 thiệp online", "10 hình ảnh", "300 lượt xem", "Watermark LoveStory"].map((f, i) => (
                  <li key={i} style={{ fontSize: 14, color: "#4b5563", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#10b981" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                style={{
                  display: "block",
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Bắt đầu ngay
              </Link>
            </div>

            {/* Basic — Popular */}
            <div
              style={{
                padding: 32,
                borderRadius: 24,
                background: "linear-gradient(180deg, #fff, #fef3ff)",
                border: "2px solid #c084fc",
                position: "relative",
                boxShadow: "0 8px 32px rgba(192,132,252,0.15)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "4px 16px",
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                🔥 PHỔ BIẾN NHẤT
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", margin: "0 0 4px" }}>⭐ Basic</p>
              <p style={{ fontSize: 40, fontWeight: 800, margin: "0 0 4px" }}>199K</p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>/ thiệp</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {["5 thiệp online", "50 hình ảnh", "Không giới hạn lượt xem", "Bỏ watermark", "Nhạc nền tùy chọn", "RSVP + Lời chúc"].map((f, i) => (
                  <li key={i} style={{ fontSize: 14, color: "#4b5563", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#10b981" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/checkout"
                style={{
                  display: "block",
                  padding: "12px 24px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "center",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(255,107,157,0.3)",
                }}
              >
                Chọn gói Basic
              </Link>
            </div>

            {/* Premium */}
            <div style={{ padding: 32, borderRadius: 24, border: "1px solid #e5e7eb", background: "#fff" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#d97706", margin: "0 0 4px" }}>👑 Premium</p>
              <p style={{ fontSize: 40, fontWeight: 800, margin: "0 0 4px" }}>299K</p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>/ thiệp</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Không giới hạn thiệp", "100 hình ảnh", "Mẫu Premium độc quyền", "Video AI cinematic", "Tên miền riêng", "Hỗ trợ VIP 24/7"].map((f, i) => (
                  <li key={i} style={{ fontSize: 14, color: "#4b5563", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#10b981" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/checkout"
                style={{
                  display: "block",
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Chọn gói Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section style={{ padding: "80px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#c084fc", letterSpacing: 2, margin: "0 0 8px" }}>MẪU THIỆP NỔI BẬT</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 12px" }}>Thiệp cưới được yêu thích nhất</h2>
            <p style={{ fontSize: 16, color: "#6b7280", margin: 0 }}>Chọn phong cách phù hợp với câu chuyện tình yêu của bạn</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { name: "Rose Garden", emoji: "🌹", color: "#fce7f3", accent: "#be185d", desc: "Nhẹ nhàng, lãng mạn như vườn hồng", badge: "🔥 HOT" },
              { name: "Midnight Romance", emoji: "🌙", color: "#1a1a2e", accent: "#c084fc", desc: "Huyền bí, sang trọng, đầy cuốn hút", badge: "✨ NEW", dark: true },
              { name: "Golden Hour", emoji: "🌅", color: "#fdf6e3", accent: "#d97706", desc: "Ấm áp tựa hoàng hôn mùa thu", badge: "⭐ TOP" },
            ].map((t, i) => (
              <div key={i} style={{ borderRadius: 24, overflow: "hidden", border: "1px solid #e5e7eb", background: "#fff", transition: "all 0.3s" }}>
                <div style={{
                  height: 180, background: t.color, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 64, position: "relative",
                }}>
                  {t.emoji}
                  <span style={{
                    position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 8,
                    background: t.dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)", fontSize: 11, fontWeight: 700,
                    color: t.dark ? "#fff" : "#1f2937",
                  }}>{t.badge}</span>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 6px", color: "#1f2937" }}>{t.name}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.5 }}>{t.desc}</p>
                  <Link href="/templates" style={{
                    display: "inline-block", padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    background: `linear-gradient(135deg, ${t.accent}, ${t.accent}cc)`, color: "#fff", textDecoration: "none",
                  }}>Dùng mẫu này →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#c084fc", letterSpacing: 2, margin: "0 0 8px" }}>CẢM NHẬN</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 12px" }}>Khách hàng nói gì?</h2>
            <p style={{ fontSize: 16, color: "#6b7280", margin: 0 }}>Hơn 10,000 cặp đôi đã tin tưởng LoveStory</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { name: "Thanh & Hương", loc: "TP.HCM", stars: 5, text: "Thiệp quá đẹp! Khách mời ai cũng khen. Tạo chỉ mất 10 phút mà cảm giác như thuê designer." },
              { name: "Minh & Trang", loc: "Hà Nội", stars: 5, text: "RSVP online tiện vô cùng. Mình biết chính xác bao nhiêu khách đến mà không cần gọi từng người." },
              { name: "Đức & Linh", loc: "Đà Nẵng", stars: 5, text: "Giá rẻ hơn nhiều so với in thiệp giấy, mà lại đẹp hơn. Bạn bè share Zalo rất tiện." },
            ].map((r, i) => (
              <div key={i} style={{ padding: 28, borderRadius: 20, border: "1px solid #f3f4f6", background: "#fefefe" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {Array(r.stars).fill(0).map((_, j) => <span key={j} style={{ fontSize: 16, color: "#fbbf24" }}>⭐</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, margin: "0 0 16px", fontStyle: "italic" }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: `linear-gradient(135deg, hsl(${i * 40 + 330}, 70%, 65%), hsl(${i * 40 + 360}, 60%, 55%))`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700,
                  }}>{r.name[0]}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", margin: 0 }}>{r.name}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>📍 {r.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#c084fc", letterSpacing: 2, margin: "0 0 8px" }}>CÂU HỎI THƯỜNG GẶP</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>FAQ</h2>
          </div>
          {[
            { q: "Thiệp online khác gì thiệp giấy?", a: "Thiệp online gửi qua link, khách xem trên điện thoại. Có nhạc nền, animation, RSVP tự động — trải nghiệm hiện đại hơn nhiều." },
            { q: "Tạo thiệp mất bao lâu?", a: "Chỉ 5 phút! Chọn mẫu → điền thông tin → xuất bản. Không cần biết thiết kế." },
            { q: "Gói miễn phí có giới hạn gì?", a: "Gói Free: 1 thiệp, 300 lượt xem, có watermark. Nâng lên Basic (199K) để mở khóa toàn bộ tính năng." },
            { q: "Khách mời xem thiệp bằng cách nào?", a: "Bạn gửi link qua Zalo, Facebook, WhatsApp hoặc email. Khách nhấn link → xem thiệp → RSVP trực tiếp." },
            { q: "Có hỗ trợ thanh toán online không?", a: "Có! Thanh toán qua chuyển khoản ngân hàng (SePay), xác nhận tự động trong vài phút." },
          ].map((faq, i) => (
            <div key={i} style={{ padding: "20px 0", borderBottom: i < 4 ? "1px solid #e5e7eb" : "none" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 8px" }}>❓ {faq.q}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>💌</p>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
            Sẵn sàng tạo thiệp cưới?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "0 0 32px" }}>
            Tham gia cùng 10,000+ cặp đôi đã tin tưởng LoveStory
          </p>
          <Link
            href="/templates"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(255,107,157,0.4)",
            }}
          >
            🎨 Bắt đầu miễn phí
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", background: "#111827", color: "#9ca3af" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: "0 0 4px",
              }}
            >
              ❤️ LoveStory
            </h3>
            <p style={{ fontSize: 13, margin: 0 }}>Nền tảng thiệp cưới online #1 Việt Nam</p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/templates" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>Mẫu thiệp</Link>
            <Link href="#pricing" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>Bảng giá</Link>
            <Link href="/login" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>Đăng nhập</Link>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "16px auto 0", borderTop: "1px solid #1f2937", paddingTop: 16 }}>
          <p style={{ fontSize: 12, textAlign: "center", margin: 0 }}>© 2026 LoveStory. Made with ❤️ in Vietnam</p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @media (max-width: 768px) {
          nav > div { flex-wrap: wrap; gap: 8px; }
          nav > div > div:first-of-type + div > a:not(:last-child) { display: none; }
          section h1 { font-size: 32px !important; }
          section h2 { font-size: 28px !important; }
          div[style*="gridTemplateColumns: repeat(3"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
