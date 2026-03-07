import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bảng giá — LoveStory",
    description: "Chọn gói phù hợp. Miễn phí bắt đầu, nâng cấp khi bạn sẵn sàng.",
};

const PLANS = [
    {
        name: "Miễn phí",
        price: 0,
        priceLabel: "0₫",
        period: "/mãi mãi",
        badge: null,
        color: "#6b7280",
        gradient: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
        border: "#e5e7eb",
        cta: "Bắt đầu miễn phí",
        ctaHref: "/login",
        ctaStyle: { background: "#fff", border: "2px solid #e5e7eb", color: "#374151" },
        features: [
            { text: "1 thiệp cưới online", included: true },
            { text: "Tất cả mẫu thiệp", included: true },
            { text: "RSVP + Lời chúc", included: true },
            { text: "QR mừng cưới", included: true },
            { text: "Link cá nhân hóa (?guest=)", included: true },
            { text: "Photo slideshow", included: true },
            { text: "Watermark LoveStory", included: false },
            { text: "Nhạc nền tùy chọn", included: false },
            { text: "Nhiều thiệp", included: false },
            { text: "AI Video", included: false },
        ],
    },
    {
        name: "Basic",
        price: 199000,
        priceLabel: "199.000₫",
        period: "/tháng",
        badge: null,
        color: "#3b82f6",
        gradient: "linear-gradient(135deg, #dbeafe, #eff6ff)",
        border: "#93c5fd",
        cta: "Nâng cấp Basic",
        ctaHref: "/dashboard/my-plan",
        ctaStyle: { background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff" },
        features: [
            { text: "5 thiệp cưới online", included: true },
            { text: "Tất cả mẫu thiệp", included: true },
            { text: "RSVP + Lời chúc + QR", included: true },
            { text: "Nhạc nền đầy đủ", included: true },
            { text: "Không watermark", included: true },
            { text: "YouTube embed", included: true },
            { text: "Export CSV khách mời", included: true },
            { text: "Hỗ trợ ưu tiên", included: true },
            { text: "AI Video", included: false },
            { text: "Video 4K", included: false },
        ],
    },
    {
        name: "Pro",
        price: 499000,
        priceLabel: "499.000₫",
        period: "/tháng",
        badge: "🔥 Phổ biến nhất",
        color: "#ec4899",
        gradient: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
        border: "#f9a8d4",
        cta: "Nâng cấp Pro",
        ctaHref: "/dashboard/my-plan",
        ctaStyle: { background: "linear-gradient(135deg, #ff6b9d, #c084fc)", color: "#fff" },
        features: [
            { text: "Không giới hạn thiệp", included: true },
            { text: "Tất cả Basic features", included: true },
            { text: "AI Video Generator", included: true },
            { text: "Video 1080p Full HD", included: true },
            { text: "10 AI video credits/tháng", included: true },
            { text: "Template độc quyền Pro", included: true },
            { text: "Domain tùy chỉnh (soon)", included: true },
            { text: "Analytics nâng cao", included: true },
            { text: "Video 4K", included: false },
            { text: "White-label", included: false },
        ],
    },
    {
        name: "Premium",
        price: 1290000,
        priceLabel: "1.290.000₫",
        period: "/tháng",
        badge: "💎 Cao cấp",
        color: "#f59e0b",
        gradient: "linear-gradient(135deg, #fef3c7, #fffbeb)",
        border: "#fbbf24",
        cta: "Liên hệ tư vấn",
        ctaHref: "mailto:hello@7app.online",
        ctaStyle: { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff" },
        features: [
            { text: "Tất cả Pro features", included: true },
            { text: "Video 4K Ultra HD", included: true },
            { text: "Credits AI không giới hạn", included: true },
            { text: "White-label (tên studio)", included: true },
            { text: "API riêng", included: true },
            { text: "Dedicated support", included: true },
            { text: "Custom domain / subdomain", included: true },
            { text: "Training & onboarding", included: true },
            { text: "SLA 99.9% uptime", included: true },
            { text: "Ưu đãi event volume", included: true },
        ],
    },
];

const FAQ = [
    { q: "Tôi có thể hủy lúc nào không?", a: "Có, bạn có thể hủy bất cứ lúc nào. Không có phí hủy, không ràng buộc hợp đồng dài hạn." },
    { q: "Gói miễn phí có giới hạn thời gian không?", a: "Không! Gói miễn phí là mãi mãi. Bạn có 1 thiệp hoạt động không giới hạn thời gian." },
    { q: "Thanh toán bằng hình thức nào?", a: "Chúng tôi hỗ trợ chuyển khoản ngân hàng, MoMo, VNPay, ZaloPay thông qua SePay." },
    { q: "AI Video là gì?", a: "AI Video tự động tạo video slideshow từ ảnh của bạn với hiệu ứng Ken Burns, transitions đẹp và nhạc nền. Chỉ cần upload ảnh và AI làm phần còn lại." },
    { q: "Thiệp có hoạt động trên mobile không?", a: "Hoàn toàn! Tất cả thiệp được tối ưu cho mobile-first. Khách mời chỉ cần click link là xem được ngay." },
];

export default function PricingPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* Header */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                        <span style={{ fontSize: 22 }}>💕</span>
                        <span style={{ fontSize: 18, fontWeight: 700, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LoveStory</span>
                    </Link>
                    <div style={{ display: "flex", gap: 12 }}>
                        <Link href="/templates" style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Mẫu thiệp</Link>
                        <Link href="/login" style={{ padding: "8px 20px", borderRadius: 8, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Bắt đầu miễn phí</Link>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
                {/* Headline */}
                <div style={{ textAlign: "center", marginBottom: 60 }}>
                    <p style={{ fontSize: 12, color: "#ec4899", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 12px" }}>💳 Bảng giá</p>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.2 }}>
                        Chọn gói phù hợp
                        <br />
                        <span style={{ background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            bắt đầu miễn phí
                        </span>
                    </h1>
                    <p style={{ fontSize: 16, color: "#6b7280", margin: 0 }}>Không cần thẻ tín dụng. Nâng cấp khi bạn cần thêm tính năng.</p>
                </div>

                {/* Pricing Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 80 }}>
                    {PLANS.map((plan) => (
                        <div key={plan.name} style={{
                            background: "#fff", borderRadius: 20, border: `2px solid ${plan.border}`,
                            overflow: "hidden", display: "flex", flexDirection: "column",
                            boxShadow: plan.badge ? "0 8px 32px rgba(255,107,157,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
                            position: "relative",
                        }}>
                            {plan.badge && (
                                <div style={{ position: "absolute", top: 16, right: 16, padding: "4px 10px", borderRadius: 20, background: plan.color, color: "#fff", fontSize: 10, fontWeight: 700 }}>
                                    {plan.badge}
                                </div>
                            )}
                            {/* Plan header */}
                            <div style={{ padding: "28px 24px 20px", background: plan.gradient }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: plan.color, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>{plan.name}</p>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                                    <span style={{ fontSize: 36, fontWeight: 800, color: "#1f2937" }}>{plan.priceLabel}</span>
                                    <span style={{ fontSize: 13, color: "#9ca3af" }}>{plan.period}</span>
                                </div>
                            </div>
                            {/* Features */}
                            <div style={{ padding: "20px 24px", flex: 1 }}>
                                <ul style={{ list: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 } as React.CSSProperties}>
                                    {plan.features.map((f, i) => (
                                        <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: f.included ? "#1f2937" : "#9ca3af" }}>
                                            <span style={{ fontSize: 14, flexShrink: 0 }}>{f.included ? "✅" : "✕"}</span>
                                            {f.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* CTA */}
                            <div style={{ padding: "0 24px 24px" }}>
                                <Link href={plan.ctaHref} style={{
                                    display: "block", textAlign: "center", padding: "12px",
                                    borderRadius: 12, fontSize: 14, fontWeight: 700,
                                    textDecoration: "none", transition: "opacity 0.15s",
                                    ...plan.ctaStyle,
                                }}>
                                    {plan.cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Value props */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 80 }}>
                    {[
                        { icon: "🔒", title: "Bảo mật tuyệt đối", desc: "Dữ liệu mã hóa, không chia sẻ thông tin khách" },
                        { icon: "⚡", title: "Xuất bản ngay", desc: "Thiệp online trong vài phút, không cần kỹ thuật" },
                        { icon: "📱", title: "Mobile-first", desc: "Khách xem đẹp trên mọi thiết bị" },
                        { icon: "🇻🇳", title: "Thanh toán VN", desc: "SePay, MoMo, VNPay, chuyển khoản" },
                    ].map((v, i) => (
                        <div key={i} style={{ textAlign: "center", padding: 24 }}>
                            <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: "0 0 6px" }}>{v.title}</p>
                            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{v.desc}</p>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div style={{ maxWidth: 720, margin: "0 auto", marginBottom: 60 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", textAlign: "center", margin: "0 0 32px" }}>Câu hỏi thường gặp</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {FAQ.map((item, i) => (
                            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e5e7eb" }}>
                                <p style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 8px" }}>❓ {item.q}</p>
                                <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div style={{ textAlign: "center", padding: "48px 24px", borderRadius: 24, background: "linear-gradient(135deg, rgba(255,107,157,0.06), rgba(192,132,252,0.06))", border: "1px solid rgba(192,132,252,0.15)" }}>
                    <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1f2937", margin: "0 0 8px" }}>Sẵn sàng tạo thiệp cưới đẹp?</h2>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>Miễn phí · Không thẻ tín dụng · Xuất bản ngay</p>
                    <Link href="/login" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "14px 36px", borderRadius: 14,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none",
                        boxShadow: "0 8px 32px rgba(255,107,157,0.35)",
                    }}>
                        💌 Bắt đầu miễn phí ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}
