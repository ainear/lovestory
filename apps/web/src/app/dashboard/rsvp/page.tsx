"use client";

import { useState } from "react";

const DEMO_RSVPS = [
    { id: "1", guestName: "Nguyễn Văn Hùng", status: "confirmed" as const, guestCount: 2, phone: "0901234567", createdAt: "2026-03-05T10:30:00" },
    { id: "2", guestName: "Trần Thị Lan", status: "confirmed" as const, guestCount: 3, phone: "0912345678", createdAt: "2026-03-04T14:20:00" },
    { id: "3", guestName: "Phạm Minh Tuấn", status: "maybe" as const, guestCount: 1, phone: "", createdAt: "2026-03-04T09:15:00" },
    { id: "4", guestName: "Lê Thị Hương", status: "confirmed" as const, guestCount: 4, phone: "0923456789", createdAt: "2026-03-03T18:00:00" },
    { id: "5", guestName: "Đỗ Quang Vinh", status: "declined" as const, guestCount: 0, phone: "0934567890", createdAt: "2026-03-03T11:45:00" },
    { id: "6", guestName: "Hoàng Thị Mai", status: "confirmed" as const, guestCount: 2, phone: "0945678901", createdAt: "2026-03-02T16:30:00" },
];

const STATUS_CONFIG = {
    confirmed: { label: "✅ Tham dự", color: "#059669", bg: "#ecfdf5" },
    maybe: { label: "🤔 Có thể", color: "#d97706", bg: "#fffbeb" },
    declined: { label: "❌ Không", color: "#dc2626", bg: "#fef2f2" },
};

export default function RsvpPage() {
    const [rsvps] = useState(DEMO_RSVPS);
    const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "maybe" | "declined">("all");

    const confirmed = rsvps.filter((r) => r.status === "confirmed");
    const totalGuests = confirmed.reduce((sum, r) => sum + r.guestCount, 0);
    const filtered = activeFilter === "all" ? rsvps : rsvps.filter((r) => r.status === activeFilter);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>✅ Xác nhận tham dự</h2>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>{rsvps.length} phản hồi</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                <StatBox icon="📊" label="Tổng phản hồi" value={rsvps.length} color="#3b82f6" />
                <StatBox icon="✅" label="Tham dự" value={confirmed.length} color="#059669" />
                <StatBox icon="👥" label="Tổng khách" value={totalGuests} color="#8b5cf6" />
                <StatBox icon="🤔" label="Có thể" value={rsvps.filter((r) => r.status === "maybe").length} color="#d97706" />
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {(["all", "confirmed", "maybe", "declined"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 10,
                            border: activeFilter === f ? "2px solid #c084fc" : "1px solid #e5e7eb",
                            background: activeFilter === f ? "#f5f3ff" : "#fff",
                            fontSize: 13,
                            fontWeight: activeFilter === f ? 600 : 400,
                            color: activeFilter === f ? "#7c3aed" : "#6b7280",
                            cursor: "pointer",
                        }}
                    >
                        {f === "all" ? `Tất cả (${rsvps.length})` : `${STATUS_CONFIG[f].label} (${rsvps.filter((r) => r.status === f).length})`}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8ec", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f9fafb" }}>
                            <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Khách mời</th>
                            <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Trạng thái</th>
                            <th style={{ padding: "12px 20px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Số khách</th>
                            <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>SĐT</th>
                            <th style={{ padding: "12px 20px", textAlign: "right", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Ngày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((rsvp) => {
                            const config = STATUS_CONFIG[rsvp.status];
                            return (
                                <tr key={rsvp.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{ fontSize: 14, fontWeight: 500, color: "#1f2937" }}>{rsvp.guestName}</span>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span
                                            style={{
                                                padding: "3px 10px",
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: config.color,
                                                background: config.bg,
                                            }}
                                        >
                                            {config.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, color: "#374151" }}>{rsvp.guestCount}</td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#6b7280" }}>{rsvp.phone || "—"}</td>
                                    <td style={{ padding: "14px 20px", textAlign: "right", fontSize: 12, color: "#9ca3af" }}>
                                        {new Date(rsvp.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
    return (
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e8e8ec", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color, margin: "0 0 2px" }}>{value}</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{icon} {label}</p>
        </div>
    );
}
