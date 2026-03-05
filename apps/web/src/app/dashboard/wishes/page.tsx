"use client";

import { useState } from "react";

const DEMO_WISHES = [
    { id: "1", guestName: "Nguyễn Văn Hùng", message: "Chúc hai bạn trăm năm hạnh phúc, sớm có em bé nhé! 🥰", emoji: "❤️", createdAt: "2026-03-05T10:30:00" },
    { id: "2", guestName: "Trần Thị Lan", message: "Chúc mừng đám cưới hai đứa! Mãi mãi bên nhau nha 💕", emoji: "🎉", createdAt: "2026-03-04T14:20:00" },
    { id: "3", guestName: "Phạm Minh Tuấn", message: "Happy wedding! Wish you all the best!", emoji: "🥂", createdAt: "2026-03-04T09:15:00" },
    { id: "4", guestName: "Lê Thị Hương", message: "Chúc hai con luôn yêu thương và che chở nhau. Bố Mẹ rất vui!", emoji: "💐", createdAt: "2026-03-03T18:00:00" },
    { id: "5", guestName: "Đỗ Quang Vinh", message: "Congratulations! 🎊 Hanh phuc nhe!", emoji: "🎉", createdAt: "2026-03-03T11:45:00" },
];

export default function WishesPage() {
    const [wishes] = useState(DEMO_WISHES);
    const [filter, setFilter] = useState("all");

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>💬 Lời chúc</h2>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>{wishes.length} lời chúc từ khách mời</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {["all", "❤️", "🎉", "🥂", "💐"].map((e) => (
                        <button
                            key={e}
                            onClick={() => setFilter(e)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: 8,
                                border: filter === e ? "2px solid #c084fc" : "1px solid #e5e7eb",
                                background: filter === e ? "#f5f3ff" : "#fff",
                                fontSize: e === "all" ? 12 : 16,
                                cursor: "pointer",
                                color: filter === e ? "#7c3aed" : "#6b7280",
                                fontWeight: filter === e ? 600 : 400,
                            }}
                        >
                            {e === "all" ? "Tất cả" : e}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                    { icon: "💬", label: "Tổng", value: wishes.length, color: "#3b82f6" },
                    { icon: "❤️", label: "Yêu thích", value: wishes.filter((w) => w.emoji === "❤️").length, color: "#ef4444" },
                    { icon: "🎉", label: "Chúc mừng", value: wishes.filter((w) => w.emoji === "🎉").length, color: "#f59e0b" },
                    { icon: "Hôm nay", label: "", value: wishes.filter((w) => new Date(w.createdAt).toDateString() === new Date().toDateString()).length, color: "#10b981" },
                ].map((s, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e8e8ec", textAlign: "center" }}>
                        <p style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 2px" }}>{s.value}</p>
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{s.icon} {s.label}</p>
                    </div>
                ))}
            </div>

            {/* Wishes List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {wishes
                    .filter((w) => filter === "all" || w.emoji === filter)
                    .map((wish) => (
                        <div
                            key={wish.id}
                            style={{
                                background: "#fff",
                                borderRadius: 14,
                                border: "1px solid #e8e8ec",
                                padding: 20,
                                display: "flex",
                                gap: 14,
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                    flexShrink: 0,
                                }}
                            >
                                {wish.emoji}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{wish.guestName}</span>
                                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                        {new Date(wish.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>
                                <p style={{ fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>{wish.message}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
