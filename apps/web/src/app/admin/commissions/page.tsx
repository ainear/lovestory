/**
 * Admin — Commission Dashboard (/admin/commissions)
 * Shows referral_payouts table: approve/mark-paid referrers
 * Only accessible by service_role (admin auth check in layout)
 */
import { createClient as createServiceClient } from "@supabase/supabase-js";

const sb = () => createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  approved: "#3b82f6",
  paid: "#10b981",
  rejected: "#ef4444",
};

export default async function CommissionsAdminPage() {
  const supabase = sb();

  const { data: payouts } = await supabase
    .from("referral_payouts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const total = (payouts ?? []).reduce((s, p) => s + (p.amount_vnd ?? 0), 0);
  const pending = (payouts ?? []).filter((p) => p.status === "pending").length;
  const paid_vnd = (payouts ?? [])
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + (p.amount_vnd ?? 0), 0);

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M ₫`
      : `${(n / 1000).toFixed(0)}K ₫`;

  return (
    <div style={{ padding: "32px", fontFamily: "system-ui, sans-serif", maxWidth: 1100 }}>
      {/* Header */}
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: "#111" }}>
        💸 Commission Payouts
      </h1>
      <p style={{ color: "#6b7280", margin: "0 0 24px" }}>
        Theo dõi và thanh toán hoa hồng cho referrers
      </p>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Tổng hoa hồng", value: fmt(total), color: "#8b5cf6" },
          { label: "⏳ Chờ duyệt", value: `${pending} khoản`, color: "#f59e0b" },
          { label: "✅ Đã thanh toán", value: fmt(paid_vnd), color: "#10b981" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "20px 24px",
              border: `2px solid ${s.color}20`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Referral Code", "Plan", "Hoa hồng (VND)", "Status", "Ngày tạo", "Hành động"].map((h) => (
                <th
                  key={h}
                  style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 13 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(payouts ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                  Chưa có khoản hoa hồng nào
                </td>
              </tr>
            ) : (
              (payouts ?? []).map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.referral_code}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      background: p.plan === "premium" ? "#f5f3ff" : "#eff6ff",
                      color: p.plan === "premium" ? "#7c3aed" : "#2563eb",
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {p.plan === "premium" ? "👑 Premium" : "⭐ Basic"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#059669" }}>
                    {fmt(p.amount_vnd)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      background: `${STATUS_COLORS[p.status] ?? "#9ca3af"}15`,
                      color: STATUS_COLORS[p.status] ?? "#6b7280",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: 13 }}>
                    {new Date(p.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.status === "pending" && (
                      <span style={{ color: "#6b7280", fontSize: 12 }}>
                        → Duyệt trong DB
                      </span>
                    )}
                    {p.status === "approved" && (
                      <span style={{ color: "#6b7280", fontSize: 12 }}>
                        → Mark paid trong DB
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info note */}
      <div style={{
        marginTop: 20,
        padding: "12px 16px",
        background: "#eff6ff",
        borderRadius: 8,
        fontSize: 13,
        color: "#1d4ed8",
      }}>
        💡 Để approve/pay: UPDATE referral_payouts SET status = &#39;approved&#39; WHERE id = &#39;...&#39; — hoặc dùng Supabase dashboard Table Editor
      </div>
    </div>
  );
}
