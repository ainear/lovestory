"use client";

import { useState } from "react";

const DEMO_GIFTS = [
    { id: "1", guestName: "Nguyễn Văn Hùng", amount: 500000, method: "bank" as const, message: "Chúc mừng hạnh phúc!", createdAt: "2026-03-05T10:30:00" },
    { id: "2", guestName: "Trần Thị Lan", amount: 1000000, method: "bank" as const, message: "Chúc hai con trăm năm hạnh phúc", createdAt: "2026-03-04T14:20:00" },
    { id: "3", guestName: "Phạm Minh Tuấn", amount: 2000000, method: "cash" as const, message: "", createdAt: "2026-03-03T09:15:00" },
    { id: "4", guestName: "Lê Thị Hương", amount: 500000, method: "bank" as const, message: "Mừng cưới con gái yêu!", createdAt: "2026-03-02T18:00:00" },
];

export default function GiftsPage() {
    const [gifts] = useState(DEMO_GIFTS);
    const totalAmount = gifts.reduce((sum, g) => sum + g.amount, 0);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>🎁 Quà tặng</h2>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>{gifts.length} món quà</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(255,107,157,0.08), rgba(192,132,252,0.08))",
                        borderRadius: 16,
                        padding: 24,
                        border: "1px solid rgba(192,132,252,0.15)",
                        textAlign: "center",
                    }}
                >
                    <p style={{ fontSize: 32, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>
                        {totalAmount.toLocaleString("vi-VN")}₫
                    </p>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>💰 Tổng nhận</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e8e8ec", textAlign: "center" }}>
                    <p style={{ fontSize: 32, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>{gifts.length}</p>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>🎁 Tổng quà</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e8e8ec", textAlign: "center" }}>
                    <p style={{ fontSize: 32, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>
                        {gifts.length > 0 ? Math.round(totalAmount / gifts.length).toLocaleString("vi-VN") : 0}₫
                    </p>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>📊 Trung bình</p>
                </div>
            </div>

            {/* Gift List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {gifts.map((gift) => (
                    <div
                        key={gift.id}
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            border: "1px solid #e8e8ec",
                            padding: 20,
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                                flexShrink: 0,
                            }}
                        >
                            🎁
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{gift.guestName}</span>
                                <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>
                                    +{gift.amount.toLocaleString("vi-VN")}₫
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 12, color: "#6b7280" }}>
                                    {gift.message || "Không có lời nhắn"} · {gift.method === "bank" ? "🏦 Chuyển khoản" : "💵 Tiền mặt"}
                                </span>
                                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                    {new Date(gift.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
