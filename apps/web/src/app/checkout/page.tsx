"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const PLANS = {
    basic: {
        name: "⭐ Basic",
        price: 199000,
        priceLabel: "199.000₫",
        features: ["5 thiệp online", "50 hình ảnh", "Không giới hạn lượt xem", "Bỏ watermark", "Nhạc nền tùy chọn", "RSVP + Lời chúc"],
    },
    premium: {
        name: "👑 Premium",
        price: 299000,
        priceLabel: "299.000₫",
        features: ["Không giới hạn thiệp", "100 hình ảnh", "Mẫu Premium độc quyền", "Video AI cinematic", "Tên miền riêng", "Hỗ trợ VIP 24/7"],
    },
};

export default function CheckoutPage() {
    const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("basic");
    const [orderCode, setOrderCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const code = `LS${Date.now().toString(36).toUpperCase()}`;
        setOrderCode(code);

        // Check URL params for errors
        const params = new URLSearchParams(window.location.search);
        if (params.get("error")) {
            setError(params.get("error") === "cancelled" ? "Bạn đã hủy thanh toán" : "Thanh toán thất bại. Vui lòng thử lại");
        }
    }, []);

    const plan = PLANS[selectedPlan];

    const handlePay = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: selectedPlan, amount: plan.price, orderCode }),
            });

            const data = await res.json();

            if (data.checkoutUrl) {
                // Redirect to SePay checkout
                window.location.href = data.checkoutUrl;
            } else if (data.formAction && data.formData) {
                // Fallback: create hidden form and auto-submit to SePay
                const form = formRef.current;
                if (form) {
                    form.action = data.formAction;
                    form.method = "POST";
                    // Clear existing inputs
                    form.innerHTML = "";
                    // Add form fields
                    Object.entries(data.formData as Record<string, string>).forEach(([key, value]) => {
                        const input = document.createElement("input");
                        input.type = "hidden";
                        input.name = key;
                        input.value = value;
                        form.appendChild(input);
                    });
                    form.submit();
                }
            } else {
                setError("Không thể tạo liên kết thanh toán");
                setLoading(false);
            }
        } catch {
            setError("Lỗi kết nối. Vui lòng thử lại");
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', sans-serif", padding: "40px 24px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link href="/" style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>
                        ❤️ LoveStory
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", margin: "16px 0 4px" }}>
                        Nâng cấp tài khoản
                    </h1>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                        Chọn gói phù hợp — thanh toán an toàn qua SePay
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 20px", marginBottom: 24, textAlign: "center" }}>
                        <p style={{ fontSize: 14, color: "#dc2626", margin: 0 }}>⚠️ {error}</p>
                    </div>
                )}

                {/* Plan Selection */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 32 }}>
                    {(["basic", "premium"] as const).map((p) => {
                        const planInfo = PLANS[p];
                        const isSelected = selectedPlan === p;
                        return (
                            <button
                                key={p}
                                onClick={() => setSelectedPlan(p)}
                                style={{
                                    padding: 28,
                                    borderRadius: 20,
                                    border: isSelected ? "2px solid #c084fc" : "1px solid #e5e7eb",
                                    background: isSelected ? "linear-gradient(180deg, #fff, #fef3ff)" : "#fff",
                                    boxShadow: isSelected ? "0 8px 24px rgba(192,132,252,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    position: "relative",
                                    transition: "all 0.2s",
                                }}
                            >
                                {p === "basic" && (
                                    <div style={{ position: "absolute", top: -10, right: 16, padding: "3px 12px", borderRadius: 8, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                                        🔥 PHỔ BIẾN
                                    </div>
                                )}
                                <p style={{ fontSize: 16, fontWeight: 600, color: p === "basic" ? "#7c3aed" : "#d97706", margin: "0 0 4px" }}>{planInfo.name}</p>
                                <p style={{ fontSize: 32, fontWeight: 800, color: "#1f2937", margin: "0 0 4px" }}>{planInfo.priceLabel}</p>
                                <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 16px" }}>1 lần duy nhất</p>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                                    {planInfo.features.map((f, i) => (
                                        <li key={i} style={{ fontSize: 13, color: "#4b5563", display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ color: "#10b981" }}>✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                            </button>
                        );
                    })}
                </div>

                {/* Pay Button */}
                <div style={{ textAlign: "center" }}>
                    <button
                        onClick={handlePay}
                        disabled={loading}
                        style={{
                            padding: "16px 48px",
                            borderRadius: 14,
                            background: loading ? "#9ca3af" : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: 700,
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: loading ? "none" : "0 8px 24px rgba(255,107,157,0.35)",
                            transition: "all 0.2s",
                        }}
                    >
                        {loading ? "⏳ Đang chuyển..." : `💳 Thanh toán ${plan.priceLabel}`}
                    </button>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
                        🔒 Thanh toán an toàn qua SePay.vn · Chấp nhận mọi ngân hàng VN
                    </p>
                </div>

                {/* Hidden form for SePay redirect */}
                <form ref={formRef} style={{ display: "none" }} />

                {/* Trust badges */}
                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 40 }}>
                    {[
                        { icon: "🔒", label: "SSL Encrypted" },
                        { icon: "🏦", label: "40+ Ngân hàng" },
                        { icon: "⚡", label: "Xác nhận tức thì" },
                    ].map((b, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 20, margin: "0 0 4px" }}>{b.icon}</p>
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{b.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
