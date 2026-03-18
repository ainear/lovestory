import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng — LoveStory",
  description:
    "Điều khoản sử dụng dịch vụ LoveStory. Vui lòng đọc kỹ trước khi sử dụng.",
};

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. Chấp nhận điều khoản",
      content: `Bằng cách truy cập và sử dụng LoveStory (7app.online), bạn đồng ý tuân thủ và chịu ràng buộc bởi các Điều khoản sử dụng này.
Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.`,
    },
    {
      title: "2. Mô tả dịch vụ",
      content: `LoveStory là nền tảng tạo và chia sẻ thiệp mời điện tử (thiệp cưới, thiệp sinh nhật, v.v.) với các tính năng:
• Trình chỉnh sửa thiệp cưới trực tuyến
• Chia sẻ thiệp qua link cá nhân
• Quản lý RSVP (xác nhận tham dự) trực tuyến
• Nhạc nền và hiệu ứng động
• Lưu trữ và quản lý danh sách khách mời`,
    },
    {
      title: "3. Tài khoản người dùng",
      content: `• Bạn phải cung cấp thông tin chính xác khi đăng ký
• Bạn chịu trách nhiệm bảo mật mật khẩu và tài khoản của mình
• Một người dùng một tài khoản — không được tạo nhiều tài khoản để lách hạn mức miễn phí
• Chúng tôi có quyền đình chỉ tài khoản vi phạm điều khoản`,
    },
    {
      title: "4. Quyền sở hữu nội dung",
      content: `• Bạn giữ toàn quyền sở hữu nội dung, hình ảnh và văn bản bạn tạo
• Bằng cách tải lên nội dung, bạn cấp cho LoveStory quyền lưu trữ và hiển thị nội dung đó
• Bạn phải có quyền sử dụng mọi hình ảnh, âm nhạc và tài liệu bạn đưa vào thiệp
• LoveStory không chịu trách nhiệm về vi phạm bản quyền từ nội dung người dùng tạo`,
    },
    {
      title: "5. Nội dung bị cấm",
      content: `Nghiêm cấm sử dụng LoveStory để:
• Đăng tải nội dung bất hợp pháp, khiêu dâm, bạo lực, phỉ báng
• Vi phạm quyền sở hữu trí tuệ của bên thứ ba
• Gửi spam hoặc lừa đảo qua hệ thống RSVP/email
• Tấn công, khai thác hoặc phá hoại hệ thống
• Thu thập dữ liệu người dùng khác trái phép`,
    },
    {
      title: "6. Gói dịch vụ và Thanh toán",
      content: `• Gói Free: tạo tối đa 3 thiệp, tính năng cơ bản
• Gói Pro: không giới hạn thiệp, nhạc tùy chỉnh, tính năng nâng cao
• Thanh toán qua SePay (chuyển khoản ngân hàng Việt Nam)
• Không hoàn tiền sau khi kích hoạt gói Pro trừ lỗi kỹ thuật từ phía chúng tôi
• Giá có thể thay đổi — thông báo trước 30 ngày qua email`,
    },
    {
      title: "7. Giới hạn trách nhiệm",
      content: `• LoveStory cung cấp dịch vụ "nguyên trạng" (as-is)
• Chúng tôi không đảm bảo dịch vụ không có gián đoạn hay lỗi
• Trách nhiệm tối đa của chúng tôi không vượt quá số tiền bạn đã thanh toán trong 12 tháng gần nhất
• Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp, đặc biệt hoặc hậu quả`,
    },
    {
      title: "8. Chấm dứt dịch vụ",
      content: `• Bạn có thể xóa tài khoản bất kỳ lúc nào trong phần Cài đặt
• Dữ liệu của bạn sẽ bị xóa hoàn toàn trong vòng 30 ngày
• Chúng tôi có quyền chấm dứt tài khoản vi phạm Điều khoản này không cần báo trước`,
    },
    {
      title: "9. Thay đổi điều khoản",
      content: `Chúng tôi có thể cập nhật Điều khoản sử dụng này. Khi có thay đổi quan trọng, chúng tôi sẽ:
• Thông báo qua email đã đăng ký
• Cập nhật ngày "Cập nhật lần cuối" ở cuối trang
Việc tiếp tục sử dụng dịch vụ sau thông báo có nghĩa bạn chấp nhận Điều khoản mới.`,
    },
    {
      title: "10. Luật áp dụng",
      content: `Các Điều khoản này được điều chỉnh bởi pháp luật Việt Nam.
Mọi tranh chấp sẽ được giải quyết tại Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh, Việt Nam.
Liên hệ: support@7app.online
Cập nhật lần cuối: 18/03/2026`,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>💕</span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 16,
                background: "linear-gradient(135deg, #ec4899, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LoveStory
            </span>
          </Link>
          <Link
            href="/"
            style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}
          >
            ← Về trang chủ
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{ fontSize: 32, fontWeight: 800, color: "#111", margin: "0 0 8px" }}
          >
            📋 Điều khoản sử dụng
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>
            Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ LoveStory.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {sections.map((s) => (
            <div
              key={s.title}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "24px 28px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid #f3f4f6",
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1f2937",
                  margin: "0 0 12px",
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  color: "#4b5563",
                  fontSize: 14,
                  lineHeight: 1.8,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {s.content}
              </p>
            </div>
          ))}
        </div>

        {/* Cross-links */}
        <div
          style={{
            marginTop: 40,
            padding: "20px 24px",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/privacy"
            style={{ color: "#ec4899", fontSize: 14, textDecoration: "none" }}
          >
            🔐 Chính sách bảo mật →
          </Link>
          <Link
            href="/"
            style={{ color: "#6b7280", fontSize: 14, textDecoration: "none" }}
          >
            ← Về trang chủ
          </Link>
          <a
            href="mailto:support@7app.online"
            style={{ color: "#6b7280", fontSize: 14, textDecoration: "none" }}
          >
            ✉️ Liên hệ hỗ trợ
          </a>
        </div>
      </main>
    </div>
  );
}
