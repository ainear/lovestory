import Link from "next/link";
import type { Metadata } from "next";
import { PLANS, PLAN_IDS, formatPrice, type PlanId } from "@/config/plans";
import { cookies } from "next/headers";
import { ProductJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Bảng giá Cao Cấp — LoveStory Luxury Wedding",
  description: "Bảng giá minh bạch cho thiệp cưới online cao cấp. Khởi đầu miễn phí, nâng cấp gói Trọn Đời 199K không phí duy trì.",
};

/* ─── feature comparison table rows ─── */
interface FeatureRow {
  label: string;
  values: Record<PlanId, string | boolean>;
}

/** Helper to derive a row from PLANS config — single source of truth */
function planValues(
  fn: (id: PlanId) => string | boolean,
): Record<PlanId, string | boolean> {
  return Object.fromEntries(PLAN_IDS.map((id) => [id, fn(id)])) as Record<
    PlanId,
    string | boolean
  >;
}

const FEATURE_ROWS: FeatureRow[] = [
  { label: "Số lượng thiệp cưới", values: planValues((id) => String(PLANS[id].maxCards)) },
  {
    label: "Thời gian lưu trữ thiệp",
    values: planValues((id) => PLANS[id].storageDuration),
  },
  {
    label: "Số ảnh tải lên tối đa",
    values: planValues((id) => String(PLANS[id].maxImages)),
  },
  {
    label: "Lượt xem thiệp / tháng",
    values: planValues((id) =>
      PLANS[id].maxViewsPerMonth.toLocaleString("vi-VN"),
    ),
  },
  {
    label: "Album ảnh tương tác",
    values: planValues((id) => PLANS[id].features.albumWidget),
  },
  {
    label: "YouTube Video Cinematic",
    values: planValues((id) => PLANS[id].features.youtubeEmbed),
  },
  {
    label: "Font chữ Thư Pháp cao cấp",
    values: planValues((id) => PLANS[id].features.customFonts),
  },
  {
    label: "Tùy biến Form RSVP nâng cao",
    values: planValues((id) => PLANS[id].features.customForms),
  },
  {
    label: "20 Mẫu Bespoke CineLove",
    values: planValues((id) => PLANS[id].features.premiumTemplates),
  },
  { label: "Đĩa Than Vinyl & 40+ Nhạc Cưới R2", values: planValues(() => true) },
  { label: "Xác nhận RSVP & Bản đồ GPS", values: planValues(() => true) },
  { label: "Mừng cưới VietQR tự động", values: planValues(() => true) },
  { label: "Hiệu ứng mở phong bì 3D", values: planValues(() => true) },
];

const FAQ = [
  {
    q: "Gói Trọn Đời 199K có phải trả thêm phí hàng tháng không?",
    a: "Hoàn toàn KHÔNG! Bạn chỉ thanh toán 1 lần duy nhất 199.000đ và thiệp cưới của bạn sẽ được lưu giữ trọn đời không phát sinh bất kỳ phụ phí nào.",
  },
  {
    q: "Gói miễn phí có giới hạn thời gian sử dụng không?",
    a: "Không! Gói miễn phí có thể sử dụng vĩnh viễn với đầy đủ tính năng tạo thiệp, nhạc nền và nhận RSVP cơ bản.",
  },
  {
    q: "Thanh toán bằng hình thức nào và kích hoạt trong bao lâu?",
    a: "Hệ thống tích hợp cổng SePay tự động. Bạn quét mã VietQR từ mọi ứng dụng ngân hàng (Vietcombank, Techcombank, MB, BIDV...) hoặc MoMo, thiệp sẽ được kích hoạt tức thì sau 3 giây.",
  },
  {
    q: "Khách mời xem thiệp trên điện thoại có cần cài ứng dụng không?",
    a: "Không cần cài đặt ứng dụng! Thiệp cưới LoveStory mở trực tiếp trên trình duyệt mọi dòng smartphone (iPhone, Android) với trải nghiệm mượt mà 60 FPS.",
  },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span style={{ fontSize: 13, fontWeight: 700, color: "#2D1B22" }}>{value}</span>;
  }
  return value ? (
    <span style={{ color: "#059669", fontSize: 16, fontWeight: 800 }}>✓</span>
  ) : (
    <span style={{ color: "#d1d5db", fontSize: 14 }}>—</span>
  );
}

export default async function PricingPage() {
  const cookieStore = await cookies();
  const abCookie = cookieStore.get("ab_pricing")?.value;
  const abVariant: "control" | "variant" =
    (abCookie as "control" | "variant") ??
    (Math.random() < 0.5 ? "control" : "variant");

  const basicPrice = abVariant === "variant" ? 49_000 : PLANS.basic.price;
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "'Plus Jakarta Sans', var(--font-inter), sans-serif", color: "#2D1B22" }}>
      <ProductJsonLd />
      {isDev && (
        <div style={{
          position: "fixed", bottom: 8, right: 8, zIndex: 9999,
          background: abVariant === "variant" ? "#059669" : "#D4AF37",
          color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
        }}>
          A/B: [{abVariant === "variant" ? "B" : "A"}] {abVariant === "variant" ? "49K" : "199K"}
        </div>
      )}

      {/* ── Luxury Header ── */}
      <header style={{
        background: "rgba(250, 247, 242, 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.18)",
        padding: "14px 28px",
        position: "sticky", top: 0, zIndex: 40,
        boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 50%, #831843 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 16 }}>❤️</span>
            </div>
            <span style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 20, fontWeight: 800,
              background: "linear-gradient(135deg, #4A1525 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              LoveStory
            </span>
          </Link>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link
              href="/templates"
              style={{
                borderRadius: 99,
                border: "1px solid rgba(212, 175, 55, 0.3)",
                background: "#fff",
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "#4A1525",
                textDecoration: "none",
              }}
            >
              Mẫu thiệp
            </Link>
            <Link
              href="/templates"
              style={{
                borderRadius: 99,
                background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 100%)",
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)",
              }}
            >
              ✨ Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px" }}>
        {/* Headline */}
        <div style={{ textAlign: "center", marginBottom: 54 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#D4AF37" }}>
            BẢNG GIÁ MINH BẠCH · KHÔNG PHÍ DUY TRÌ
          </span>
          <h1 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "clamp(30px, 4vw, 44px)",
            fontWeight: 800,
            color: "#2D1B22",
            margin: "10px 0 14px",
          }}>
            Đầu Tư Cho Hạnh Phúc Trọn Vẹn
          </h1>
          <p style={{ fontSize: 15, color: "#6b585a", maxWidth: 540, margin: "0 auto" }}>
            Khởi đầu 100% miễn phí. Nâng cấp trọn đời với mức giá bằng 1 cốc trà sữa để mở khóa toàn bộ đặc quyền Hoàng Gia.
          </p>
        </div>

        {/* ─── Pricing Cards ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, marginBottom: 80 }}>
          {PLAN_IDS.map((planId) => {
            const plan = PLANS[planId];
            const isPopular = planId === "basic";
            const isFree = planId === "free";

            return (
              <div
                key={planId}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 28,
                  background: "#fff",
                  border: isPopular ? "2px solid #D4AF37" : "1px solid rgba(212, 175, 55, 0.2)",
                  boxShadow: isPopular ? "0 16px 40px rgba(212, 175, 55, 0.2)" : "0 8px 24px rgba(0,0,0,0.03)",
                  overflow: "hidden",
                  transform: isPopular ? "scale(1.02)" : "none",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      borderRadius: 99,
                      padding: "4px 14px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      background: isPopular ? "linear-gradient(135deg, #D4AF37, #B76E79)" : "#831843",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {isPopular ? "👑 " : ""}
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div
                  style={{
                    padding: "32px 28px 24px",
                    background: isPopular
                      ? "radial-gradient(ellipse at 50% 0%, rgba(254, 243, 199, 0.6) 0%, rgba(255, 255, 255, 1) 100%)"
                      : isFree
                        ? "linear-gradient(180deg, #FAF7F2 0%, #fff 100%)"
                        : "linear-gradient(180deg, rgba(131, 24, 67, 0.05) 0%, #fff 100%)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: isPopular ? "#D4AF37" : isFree ? "#6b585a" : "#831843",
                      margin: "0 0 8px",
                    }}
                  >
                    {plan.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: 38,
                      fontWeight: 800,
                      color: "#2D1B22",
                    }}>
                      {formatPrice(plan.id === "basic" ? basicPrice : plan.price)}
                    </span>
                    {plan.id === "basic" && abVariant === "variant" && (
                      <span style={{ fontSize: 14, textDecoration: "line-through", color: "#9ca3af" }}>
                        {formatPrice(PLANS.basic.price)}
                      </span>
                    )}
                    {!isFree && (
                      <span style={{ fontSize: 13, color: "#6b585a", fontWeight: 600 }}>/ Trọn Đời</span>
                    )}
                  </div>
                </div>

                {/* Quick features */}
                <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 12, padding: "20px 28px 28px" }}>
                  <QuickFeature text={`${plan.maxCards} thiệp cưới online`} />
                  <QuickFeature text={`Lưu trữ ${plan.storageDuration}`} />
                  <QuickFeature text={`${plan.maxImages} ảnh tải lên`} />
                  <QuickFeature text={`${plan.maxViewsPerMonth.toLocaleString("vi-VN")} lượt xem / tháng`} />
                  {plan.features.albumWidget && <QuickFeature text="Album ảnh cưới tương tác" />}
                  {plan.features.youtubeEmbed && <QuickFeature text="Video Cinematic YouTube Embed" />}
                  {plan.features.customFonts && <QuickFeature text="Font chữ Thư Pháp sang trọng" />}
                  {plan.features.customForms && <QuickFeature text="Tùy biến câu hỏi RSVP" />}
                  {plan.features.premiumTemplates && <QuickFeature text="Toàn bộ 20 Mẫu Bespoke CineLove" highlight />}
                  <QuickFeature text="Đĩa Than Vinyl + Nhạc Cưới R2 + VietQR" />
                </div>

                {/* CTA */}
                <div style={{ padding: "0 28px 28px" }}>
                  <Link
                    href={isFree ? "/templates" : `/checkout?plan=${planId}`}
                    style={{
                      display: "block",
                      borderRadius: 99,
                      padding: "14px 0",
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      textDecoration: "none",
                      background: isFree
                        ? "#FAF7F2"
                        : isPopular
                          ? "linear-gradient(135deg, #D4AF37 0%, #B76E79 100%)"
                          : "linear-gradient(135deg, #4A1525 0%, #831843 100%)",
                      color: isFree ? "#4A1525" : "#fff",
                      border: isFree ? "1px solid rgba(212, 175, 55, 0.3)" : "none",
                      boxShadow: isPopular ? "0 6px 20px rgba(212, 175, 55, 0.4)" : "none",
                    }}
                  >
                    {isFree ? "Bắt Đầu Miễn Phí" : "👑 Nâng Cấp Ngay"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Feature Comparison Table ─── */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 800,
            textAlign: "center",
            color: "#2D1B22",
            marginBottom: 32,
          }}>
            So Sánh Đặc Quyền Chi Tiết
          </h2>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid rgba(212, 175, 55, 0.25)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAF7F2", borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontWeight: 700, color: "#6b585a" }}>
                    Tính năng
                  </th>
                  {PLAN_IDS.map((id) => (
                    <th
                      key={id}
                      style={{
                        padding: "16px 20px",
                        textAlign: "center",
                        fontWeight: 800,
                        color: id === "basic" ? "#D4AF37" : "#2D1B22",
                      }}
                    >
                      {PLANS[id].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      background: i % 2 === 0 ? "#fff" : "rgba(250, 247, 242, 0.4)",
                      borderBottom: i === FEATURE_ROWS.length - 1 ? "none" : "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    <td style={{ padding: "14px 24px", fontWeight: 600, color: "#2D1B22" }}>
                      {row.label}
                    </td>
                    {PLAN_IDS.map((id) => (
                      <td key={id} style={{ padding: "14px 20px", textAlign: "center" }}>
                        <CellValue value={row.values[id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── FAQ ─── */}
        <div style={{ maxWidth: 760, margin: "0 auto 64px" }}>
          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 800,
            textAlign: "center",
            color: "#2D1B22",
            marginBottom: 32,
          }}>
            Câu Hỏi Thường Gặp
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FAQ.map((item) => (
              <div
                key={item.q}
                style={{
                  borderRadius: 20,
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  background: "#fff",
                  padding: "20px 24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 700, color: "#2D1B22", margin: "0 0 8px" }}>
                  {item.q}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#6b585a", margin: 0 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Final Luxury CTA ─── */}
        <div style={{
          borderRadius: 32,
          background: "linear-gradient(135deg, #2D1B22 0%, #4A1525 50%, #1e1e28 100%)",
          padding: "54px 32px",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 16px 48px rgba(45, 27, 34, 0.25)",
          border: "1px solid rgba(212, 175, 55, 0.4)",
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#D4AF37" }}>
            SẴN SÀNG CHO NGÀY CƯỚI HOÀN HẢO?
          </span>
          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 800,
            margin: "10px 0 14px",
          }}>
            Tạo Thiệp Cưới Trực Tuyến Ngay Hôm Nay
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 28 }}>
            Miễn phí 100% · Không yêu cầu thẻ tín dụng · Nhận link thiệp sau 2 phút
          </p>
          <Link
            href="/templates"
            style={{
              display: "inline-block",
              borderRadius: 99,
              background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 100%)",
              padding: "15px 36px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(212, 175, 55, 0.4)",
            }}
          >
            ✨ Bắt Đầu Tạo Thiệp Miễn Phí
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── tiny helper ─── */
function QuickFeature({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: highlight ? "#D4AF37" : "#4A1525", fontWeight: highlight ? 700 : 500 }}>
      <span style={{ color: highlight ? "#D4AF37" : "#059669", fontSize: 14 }}>✓</span>
      {text}
    </div>
  );
}
