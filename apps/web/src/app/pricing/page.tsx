import Link from "next/link";
import type { Metadata } from "next";
import { PLANS, PLAN_IDS, formatPrice, type PlanId } from "@/config/plans";

export const metadata: Metadata = {
  title: "Bảng giá — LoveStory",
  description: "Chọn gói phù hợp. Miễn phí bắt đầu, nâng cấp khi bạn sẵn sàng.",
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
  { label: "Số thiệp", values: planValues((id) => String(PLANS[id].maxCards)) },
  {
    label: "Thời gian lưu",
    values: planValues((id) => PLANS[id].storageDuration),
  },
  {
    label: "Ảnh tải lên",
    values: planValues((id) => String(PLANS[id].maxImages)),
  },
  {
    label: "Lượt xem/tháng",
    values: planValues((id) =>
      PLANS[id].maxViewsPerMonth.toLocaleString("vi-VN"),
    ),
  },
  {
    label: "Album ảnh",
    values: planValues((id) => PLANS[id].features.albumWidget),
  },
  {
    label: "YouTube embed",
    values: planValues((id) => PLANS[id].features.youtubeEmbed),
  },
  {
    label: "Font tùy chỉnh",
    values: planValues((id) => PLANS[id].features.customFonts),
  },
  {
    label: "Form tùy chỉnh",
    values: planValues((id) => PLANS[id].features.customForms),
  },
  {
    label: "Mẫu Premium",
    values: planValues((id) => PLANS[id].features.premiumTemplates),
  },
  { label: "Nhạc nền", values: planValues(() => true) },
  { label: "RSVP", values: planValues(() => true) },
  { label: "QR Bank", values: planValues(() => true) },
  { label: "Hiệu ứng", values: planValues(() => true) },
];

const FAQ = [
  {
    q: "Tôi có thể hủy lúc nào không?",
    a: "Có, bạn có thể hủy bất cứ lúc nào. Không có phí hủy, không ràng buộc hợp đồng dài hạn.",
  },
  {
    q: "Gói miễn phí có giới hạn thời gian không?",
    a: "Không! Gói miễn phí là mãi mãi. Bạn có 1 thiệp hoạt động không giới hạn thời gian.",
  },
  {
    q: "Thanh toán bằng hình thức nào?",
    a: "Chúng tôi hỗ trợ chuyển khoản ngân hàng, MoMo, VNPay, ZaloPay thông qua SePay.",
  },
  {
    q: "Thiệp có hoạt động trên mobile không?",
    a: "Hoàn toàn! Tất cả thiệp được tối ưu cho mobile-first. Khách mời chỉ cần click link là xem được ngay.",
  },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-sm font-semibold text-gray-800">{value}</span>;
  }
  return value ? (
    <span className="text-green-500 text-lg">&#10003;</span>
  ) : (
    <span className="text-gray-300 text-lg">&#10005;</span>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6">
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-[22px]">&#x1F495;</span>
            <span className="text-lg font-bold bg-gradient-to-br from-pink-400 to-purple-400 bg-clip-text text-transparent">
              LoveStory
            </span>
          </Link>
          <div className="flex gap-3">
            <Link
              href="/templates"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 no-underline"
            >
              Mẫu thiệp
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-gradient-to-br from-pink-400 to-purple-400 px-5 py-2 text-[13px] font-semibold text-white no-underline"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-6 py-16">
        {/* Headline */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-pink-500">
            Bảng giá
          </p>
          <h1 className="mb-3 text-4xl font-extrabold leading-tight text-gray-900">
            Chọn gói phù hợp
            <br />
            <span className="bg-gradient-to-br from-pink-400 to-purple-400 bg-clip-text text-transparent">
              bắt đầu miễn phí
            </span>
          </h1>
          <p className="text-base text-gray-500">
            Không cần thẻ tín dụng. Nâng cấp khi bạn cần thêm tính năng.
          </p>
        </div>

        {/* ─── Pricing Cards ─── */}
        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLAN_IDS.map((planId) => {
            const plan = PLANS[planId];
            const isPopular = planId === "basic";
            const isFree = planId === "free";

            return (
              <div
                key={planId}
                className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white ${
                  isPopular
                    ? "border-blue-400 shadow-lg shadow-blue-100"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold text-white ${
                      isPopular ? "bg-blue-500" : "bg-amber-500"
                    }`}
                  >
                    {isPopular ? "&#x1F525; " : ""}
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div
                  className={`px-6 pb-5 pt-7 ${
                    isPopular
                      ? "bg-gradient-to-br from-blue-50 to-blue-100/50"
                      : isFree
                        ? "bg-gradient-to-br from-gray-50 to-gray-100/50"
                        : "bg-gradient-to-br from-amber-50 to-amber-100/50"
                  }`}
                >
                  <p
                    className={`mb-2 text-[13px] font-bold uppercase tracking-wide ${
                      isPopular
                        ? "text-blue-500"
                        : isFree
                          ? "text-gray-500"
                          : "text-amber-600"
                    }`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    {!isFree && (
                      <span className="text-[13px] text-gray-400">/1 lần</span>
                    )}
                  </div>
                </div>

                {/* Quick features */}
                <div className="flex flex-1 flex-col gap-2.5 px-6 py-5">
                  <QuickFeature text={`${plan.maxCards} thiệp cưới`} />
                  <QuickFeature text={`Lưu ${plan.storageDuration}`} />
                  <QuickFeature text={`${plan.maxImages} ảnh tải lên`} />
                  <QuickFeature
                    text={`${plan.maxViewsPerMonth.toLocaleString("vi-VN")} lượt xem/tháng`}
                  />
                  {plan.features.albumWidget && (
                    <QuickFeature text="Album ảnh" />
                  )}
                  {plan.features.youtubeEmbed && (
                    <QuickFeature text="YouTube embed" />
                  )}
                  {plan.features.customFonts && (
                    <QuickFeature text="Font tùy chỉnh" />
                  )}
                  {plan.features.customForms && (
                    <QuickFeature text="Form tùy chỉnh" />
                  )}
                  {plan.features.premiumTemplates && (
                    <QuickFeature text="Mẫu Premium" />
                  )}
                  <QuickFeature text="Nhạc nền + RSVP + QR + Hiệu ứng" />
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Link
                    href={isFree ? "/editor/new" : `/checkout?plan=${planId}`}
                    className={`block rounded-xl py-3 text-center text-sm font-bold no-underline transition-opacity hover:opacity-90 ${
                      isFree
                        ? "border-2 border-gray-200 bg-white text-gray-700"
                        : isPopular
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                          : "bg-gradient-to-br from-amber-500 to-amber-600 text-white"
                    }`}
                  >
                    {isFree ? "Bắt đầu miễn phí" : "Chọn gói"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Feature Comparison Table ─── */}
        <div className="mb-20 overflow-x-auto">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            So sánh chi tiết
          </h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 pr-4 text-left font-semibold text-gray-500">
                  Tính năng
                </th>
                {PLAN_IDS.map((id) => (
                  <th
                    key={id}
                    className={`px-4 py-3 text-center font-bold ${
                      id === "basic" ? "text-blue-600" : "text-gray-800"
                    }`}
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
                  className={i % 2 === 0 ? "bg-gray-50/50" : ""}
                >
                  <td className="py-3 pr-4 font-medium text-gray-700">
                    {row.label}
                  </td>
                  {PLAN_IDS.map((id) => (
                    <td key={id} className="px-4 py-3 text-center">
                      <CellValue value={row.values[id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Value Props ─── */}
        <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "&#x1F512;",
              title: "Bảo mật tuyệt đối",
              desc: "Dữ liệu mã hóa, không chia sẻ thông tin khách",
            },
            {
              icon: "&#x26A1;",
              title: "Xuất bản ngay",
              desc: "Thiệp online trong vài phút, không cần kỹ thuật",
            },
            {
              icon: "&#x1F4F1;",
              title: "Mobile-first",
              desc: "Khách xem đẹp trên mọi thiết bị",
            },
            {
              icon: "&#x1F1FB;&#x1F1F3;",
              title: "Thanh toán VN",
              desc: "SePay, MoMo, VNPay, chuyển khoản",
            },
          ].map((v, i) => (
            <div key={i} className="p-6 text-center">
              <div
                className="mb-3 text-4xl"
                dangerouslySetInnerHTML={{ __html: v.icon }}
              />
              <p className="mb-1.5 text-[15px] font-bold text-gray-900">
                {v.title}
              </p>
              <p className="text-[13px] text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* ─── FAQ ─── */}
        <div className="mx-auto mb-16 max-w-[720px]">
          <h2 className="mb-8 text-center text-[28px] font-bold text-gray-900">
            Câu hỏi thường gặp
          </h2>
          <div className="flex flex-col gap-4">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white px-6 py-5"
              >
                <p className="mb-2 text-[15px] font-semibold text-gray-900">
                  {item.q}
                </p>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Final CTA ─── */}
        <div className="rounded-3xl border border-purple-200/40 bg-gradient-to-br from-pink-50/60 to-purple-50/60 px-6 py-12 text-center">
          <h2 className="mb-2 text-[26px] font-bold text-gray-900">
            Sẵn sàng tạo thiệp cưới đẹp?
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Miễn phí &middot; Không thẻ tín dụng &middot; Xuất bản ngay
          </p>
          <Link
            href="/editor/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 px-9 py-3.5 text-base font-bold text-white no-underline shadow-lg shadow-pink-200/50 transition-opacity hover:opacity-90"
          >
            Bắt đầu miễn phí ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── tiny helper ─── */
function QuickFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-gray-700">
      <span className="text-green-500 text-sm">&#10003;</span>
      {text}
    </div>
  );
}
