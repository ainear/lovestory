import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách bảo mật — LoveStory",
  description: "Chính sách bảo mật và quyền riêng tư của LoveStory. Chúng tôi tôn trọng và bảo vệ dữ liệu cá nhân của bạn.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Thông tin chúng tôi thu thập",
      content: `Chúng tôi thu thập các thông tin sau khi bạn sử dụng LoveStory:
• Thông tin tài khoản: email, tên hiển thị (khi đăng ký)
• Dữ liệu thiệp cưới: nội dung, hình ảnh bạn tải lên, thông tin RSVP
• Dữ liệu sử dụng: lượt xem, tương tác, thiết bị, địa chỉ IP
• Cookie: phiên đăng nhập, tùy chọn giao diện, A/B test`,
    },
    {
      title: "2. Cách chúng tôi sử dụng thông tin",
      content: `• Cung cấp và cải thiện dịch vụ tạo thiệp cưới
• Gửi email thông báo RSVP (có thể hủy đăng ký bất kỳ lúc nào)
• Phân tích lưu lượng và cải thiện trải nghiệm người dùng
• Ngăn chặn gian lận và đảm bảo bảo mật`,
    },
    {
      title: "3. Cookie và Tracking",
      content: `Chúng tôi sử dụng:
• Cookie phiên (cần thiết cho đăng nhập): httpOnly, Secure
• PostHog analytics (ẩn danh, IP không lưu trữ)
• A/B testing cookie (ab_pricing): để tối ưu trải nghiệm giá
• Bạn có thể từ chối cookie không cần thiết — chức năng cốt lõi vẫn hoạt động`,
    },
    {
      title: "4. Chia sẻ dữ liệu",
      content: `Chúng tôi KHÔNG bán dữ liệu của bạn. Chúng tôi chỉ chia sẻ với:
• Supabase (lưu trữ dữ liệu, PostgreSQL — tuân thủ GDPR)
• Vercel (hosting — tuân thủ GDPR)
• Resend (gửi email thông báo RSVP)
• SePay (xử lý thanh toán — không lưu thông tin thẻ)`,
    },
    {
      title: "5. Quyền của bạn",
      content: `Theo GDPR và luật bảo vệ dữ liệu Việt Nam, bạn có quyền:
• Truy cập dữ liệu cá nhân của mình
• Yêu cầu xóa tài khoản và dữ liệu (xóa hoàn toàn trong 30 ngày)
• Hủy đăng ký nhận email RSVP qua link trong email
• Xuất dữ liệu thiệp cưới của mình
Liên hệ: support@7app.online`,
    },
    {
      title: "6. Bảo mật dữ liệu",
      content: `• Mật khẩu được hash (bcrypt) — không ai đọc được kể cả chúng tôi
• HTTPS/TLS bắt buộc cho mọi kết nối
• Row Level Security (RLS) trong Supabase — dữ liệu của bạn chỉ bạn đọc được
• HMAC-SHA256 ký token unsubscribe email`,
    },
    {
      title: "7. Liên hệ",
      content: `Email: support@7app.online
Địa chỉ: TP. Hồ Chí Minh, Việt Nam
Cập nhật lần cuối: 18/03/2026`,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>💕</span>
            <span style={{ fontWeight: 800, fontSize: 16, background: "linear-gradient(135deg, #ec4899, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              LoveStory
            </span>
          </Link>
          <Link href="/" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>← Về trang chủ</Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>
            🔐 Chính sách bảo mật
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>
            LoveStory cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {sections.map((s) => (
            <div key={s.title} style={{ background: "#fff", borderRadius: 12, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: "0 0 12px" }}>
                {s.title}
              </h2>
              <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
