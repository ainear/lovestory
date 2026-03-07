/**
 * Transactional Email Service — Resend
 * Handles all outgoing emails for LoveStory.
 */

import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}
const FROM = "LoveStory <noreply@7app.online>";

// ─── Generic sender ─────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string) {
  const { error } = await getResend().emails.send({ from: FROM, to, subject, html });
  if (error) {
    console.error("[Email] Send failed:", error);
    throw new Error(error.message);
  }
}

// ─── Welcome Email ───────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#ff6b9d,#c084fc);padding:40px;text-align:center;">
          <h1 style="color:#fff;font-size:32px;margin:0;font-weight:800;letter-spacing:-0.5px;">❤️ LoveStory</h1>
          <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:8px 0 0;">Thiệp cưới kỹ thuật số đẹp nhất Việt Nam</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          <h2 style="font-size:22px;color:#1f2937;margin:0 0 16px;">Chào mừng bạn, ${name}! 🎉</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Tài khoản LoveStory của bạn đã được tạo thành công. Hãy bắt đầu tạo thiệp cưới đẹp nhất trong cuộc đời bạn!
          </p>
          <div style="background:#eff6ff;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:#1e40af;font-size:14px;font-weight:600;margin:0 0 8px;">✨ Gói Free bao gồm:</p>
            <ul style="color:#3b82f6;font-size:14px;margin:0;padding-left:20px;line-height:2;">
              <li>1 thiệp cưới online đẹp</li>
              <li>Chia sẻ link + QR code</li>
              <li>Nhận lời chúc từ khách mời</li>
              <li>RSVP xác nhận tham dự</li>
            </ul>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/templates" 
             style="display:inline-block;background:linear-gradient(135deg,#ff6b9d,#c084fc);color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
            🎨 Tạo thiệp đầu tiên
          </a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #f3f4f6;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 LoveStory · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#c084fc;">lovestory.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail(to, "🎉 Chào mừng đến với LoveStory!", html);
}

// ─── Video Ready Email ────────────────────────────────────────────────────────

export async function sendVideoReadyEmail(
  to: string,
  name: string,
  videoUrl: string,
  thumbnailUrl: string,
) {
  const thumb = thumbnailUrl
    ? `<img src="${thumbnailUrl}" alt="Video thumbnail" style="width:100%;border-radius:12px;margin-bottom:24px;">`
    : `<div style="background:linear-gradient(135deg,#0f0c29,#302b63);border-radius:12px;padding:40px;text-align:center;margin-bottom:24px;"><p style="font-size:48px;margin:0;">🎬</p></div>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);padding:40px;text-align:center;">
          <p style="font-size:48px;margin:0 0 12px;">🎬</p>
          <h1 style="color:#fff;font-size:24px;margin:0;font-weight:800;">Video của bạn đã sẵn sàng!</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:8px 0 0;">AI đã hoàn thành xử lý video cưới của bạn</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Xin chào <strong>${name}</strong>, video cưới AI của bạn đã được tạo xong! 🎉
          </p>
          ${thumb}
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${videoUrl}" 
               style="display:inline-block;background:linear-gradient(135deg,#ff6b9d,#c084fc);color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;margin-right:12px;">
              ▶️ Xem video
            </a>
            <a href="${videoUrl}?download=1" 
               style="display:inline-block;background:#f3f4f6;color:#374151;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
              ⬇️ Tải về
            </a>
          </div>
          <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0;">
            💡 Bạn cũng có thể xem video trong <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/videos" style="color:#c084fc;">Dashboard → Video của tôi</a>
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #f3f4f6;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 LoveStory · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#c084fc;">lovestory.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail(to, "🎬 Video cưới AI của bạn đã sẵn sàng!", html);
}

// ─── Payment Confirmed Email ──────────────────────────────────────────────────

export async function sendPaymentConfirmedEmail(
  to: string,
  name: string,
  plan: string,
) {
  const planLabel = plan === "premium" ? "👑 Premium" : "⭐ Basic";
  const planColor = plan === "premium" ? "#f59e0b" : "#8b5cf6";
  const features = plan === "premium"
    ? ["Không giới hạn thiệp", "Video AI 1080p/4K", "Xóa watermark", "Nhạc nền tùy chỉnh", "Font chữ tùy chỉnh"]
    : ["Tối đa 5 thiệp", "Video AI 720p", "Xóa watermark", "Nhạc nền tùy chỉnh"];

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#ff6b9d,#c084fc);padding:40px;text-align:center;">
          <p style="font-size:48px;margin:0 0 12px;">🎊</p>
          <h1 style="color:#fff;font-size:24px;margin:0;font-weight:800;">Thanh toán thành công!</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Xin chào <strong>${name}</strong>, gói <span style="color:${planColor};font-weight:700;">${planLabel}</span> đã được kích hoạt thành công! 🎉
          </p>
          <div style="background:#faf5ff;border:2px solid ${planColor}30;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:${planColor};font-size:14px;font-weight:700;margin:0 0 12px;">${planLabel} — Tính năng đã mở khóa:</p>
            ${features.map(f => `<p style="color:#4b5563;font-size:14px;margin:0 0 6px;">✅ ${f}</p>`).join("")}
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="display:inline-block;background:linear-gradient(135deg,#ff6b9d,#c084fc);color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
            🚀 Đến Dashboard
          </a>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #f3f4f6;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 LoveStory · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#c084fc;">lovestory.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail(to, `✅ Kích hoạt thành công gói ${planLabel}`, html);
}

// ─── RSVP Alert Email ─────────────────────────────────────────────────────────

export async function sendRsvpAlertEmail(
  to: string,
  ownerName: string,
  guestName: string,
  status: "confirmed" | "declined" | "maybe",
  projectTitle: string,
) {
  const statusMap = {
    confirmed: { icon: "✅", text: "đã xác nhận tham dự", color: "#10b981" },
    declined: { icon: "❌", text: "không thể tham dự", color: "#ef4444" },
    maybe: { icon: "🤔", text: "có thể tham dự", color: "#f59e0b" },
  };
  const s = statusMap[status];

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#ff6b9d,#c084fc);padding:32px 40px;text-align:center;">
          <h1 style="color:#fff;font-size:22px;margin:0;font-weight:800;">${s.icon} Phản hồi RSVP mới</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Chào <strong>${ownerName}</strong>, bạn có một phản hồi RSVP mới cho thiệp <strong>"${projectTitle}"</strong>!
          </p>
          <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid ${s.color};">
            <p style="font-size:16px;font-weight:700;color:#1f2937;margin:0 0 4px;">${guestName}</p>
            <p style="font-size:14px;color:${s.color};margin:0;font-weight:600;">${s.icon} ${s.text}</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/rsvp" 
             style="display:inline-block;background:linear-gradient(135deg,#ff6b9d,#c084fc);color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
            ✅ Xem danh sách RSVP
          </a>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #f3f4f6;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 LoveStory · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#c084fc;">lovestory.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail(to, `${s.icon} ${guestName} ${s.text}`, html);
}
