/**
 * Admin — Commission Dashboard (/admin/commissions)
 * Server Component + Server Actions for approve / mark-paid
 */
import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// ── Server Actions ─────────────────────────────────────────────────────────
function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function approvePayout(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await getServiceSupabase()
    .from("referral_payouts")
    .update({ status: "approved" })
    .eq("id", id)
    .eq("status", "pending"); // idempotent guard
  revalidatePath("/admin/commissions");
}

async function markPaidPayout(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await getServiceSupabase()
    .from("referral_payouts")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "approved"); // idempotent guard
  revalidatePath("/admin/commissions");
}

async function rejectPayout(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await getServiceSupabase()
    .from("referral_payouts")
    .update({ status: "rejected" })
    .eq("id", id)
    .in("status", ["pending", "approved"]); // can reject from either state
  revalidatePath("/admin/commissions");
}

// ── Helpers ───────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  approved: "#3b82f6",
  paid: "#10b981",
  rejected: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "⏳ Chờ duyệt",
  approved: "✅ Đã duyệt",
  paid: "💰 Đã trả",
  rejected: "❌ Từ chối",
};

const BTN = {
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    transition: "opacity .15s",
  } as React.CSSProperties,
};

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M ₫`
    : `${(n / 1000).toFixed(0)}K ₫`;

// ── React needed for JSX ──────────────────────────────────────────────────
import React from "react";

// ── Page ─────────────────────────────────────────────────────────────────
export default async function CommissionsAdminPage() {
  const supabase = getServiceSupabase();

  const { data: payouts } = await supabase
    .from("referral_payouts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  const rows = payouts ?? [];
  const totalVnd = rows.reduce((s, p) => s + (p.amount_vnd ?? 0), 0);
  const pendingCount = rows.filter((p) => p.status === "pending").length;
  const paidVnd = rows.filter((p) => p.status === "paid").reduce((s, p) => s + (p.amount_vnd ?? 0), 0);
  const approvedCount = rows.filter((p) => p.status === "approved").length;

  return (
    <div style={{ padding: "32px", fontFamily: "system-ui, sans-serif", maxWidth: 1200 }}>
      {/* Header */}
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: "#111" }}>
        💸 Commission Payouts
      </h1>
      <p style={{ color: "#6b7280", margin: "0 0 28px" }}>
        Duyệt và thanh toán hoa hồng cho referrers
      </p>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Tổng hoa hồng", value: fmt(totalVnd), color: "#8b5cf6" },
          { label: "⏳ Chờ duyệt", value: `${pendingCount} khoản`, color: "#f59e0b" },
          { label: "✅ Đã duyệt", value: `${approvedCount} khoản`, color: "#3b82f6" },
          { label: "💰 Đã thanh toán", value: fmt(paidVnd), color: "#10b981" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 12, padding: "18px 22px",
            border: `2px solid ${s.color}20`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Referral Code", "Plan", "Hoa hồng", "Status", "Ngày tạo", "Hành động"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#9ca3af" }}>
                  Chưa có khoản hoa hồng nào
                </td>
              </tr>
            ) : rows.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                {/* Referral code */}
                <td style={{ padding: "12px 16px", fontWeight: 700, fontFamily: "monospace", fontSize: 13 }}>
                  {p.referral_code}
                </td>

                {/* Plan badge */}
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    background: p.plan === "premium" ? "#f5f3ff" : "#eff6ff",
                    color: p.plan === "premium" ? "#7c3aed" : "#2563eb",
                    padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                  }}>
                    {p.plan === "premium" ? "👑 Premium" : "⭐ Basic"}
                  </span>
                </td>

                {/* Amount */}
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "#059669", fontSize: 15 }}>
                  {fmt(p.amount_vnd ?? 0)}
                </td>

                {/* Status badge */}
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    background: `${STATUS_COLORS[p.status] ?? "#9ca3af"}18`,
                    color: STATUS_COLORS[p.status] ?? "#6b7280",
                    padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                  }}>
                    {STATUS_LABELS[p.status] ?? p.status}
                  </span>
                </td>

                {/* Date */}
                <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: 12 }}>
                  {new Date(p.created_at).toLocaleDateString("vi-VN")}
                  {p.paid_at && (
                    <div style={{ color: "#059669", marginTop: 2 }}>
                      ✓ {new Date(p.paid_at).toLocaleDateString("vi-VN")}
                    </div>
                  )}
                </td>

                {/* Action buttons — Server Action forms */}
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {p.status === "pending" && (
                      <>
                        <form action={approvePayout}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" style={{
                            ...BTN.base, background: "#3b82f6", color: "#fff",
                          }}>
                            ✅ Duyệt
                          </button>
                        </form>
                        <form action={rejectPayout}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" style={{
                            ...BTN.base, background: "#fee2e2", color: "#dc2626",
                          }}>
                            ✕ Từ chối
                          </button>
                        </form>
                      </>
                    )}
                    {p.status === "approved" && (
                      <>
                        <form action={markPaidPayout}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" style={{
                            ...BTN.base, background: "#10b981", color: "#fff",
                          }}>
                            💰 Đã trả
                          </button>
                        </form>
                        <form action={rejectPayout}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" style={{
                            ...BTN.base, background: "#fee2e2", color: "#dc2626",
                          }}>
                            ✕ Huỷ
                          </button>
                        </form>
                      </>
                    )}
                    {(p.status === "paid" || p.status === "rejected") && (
                      <span style={{ color: "#9ca3af", fontSize: 12 }}>—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, color: "#9ca3af", fontSize: 12 }}>
        Tổng {rows.length} khoản · Server Actions (tự reload sau khi bấm) ·
        Service Role key bảo vệ bởi Admin Layout guard
      </div>
    </div>
  );
}
