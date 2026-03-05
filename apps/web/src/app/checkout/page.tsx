"use client";

import { useState, useEffect } from "react";
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
    const [status, setStatus] = useState<"selecting" | "paying" | "success">("selecting");

    useEffect(() => {
        // Generate unique order code
        const code = `LS${Date.now().toString(36).toUpperCase()}`;
        setOrderCode(code);
    }, []);

    const plan = PLANS[selectedPlan];

    // SePay QR URL format:
    // https://qr.sepay.vn/img?acc=ACCOUNT&bank=BANK&amount=AMOUNT&des=DESCRIPTION
    const SEPAY_BANK = "MB"; // Thay bằng bank thật
    const SEPAY_ACCOUNT = "0123456789"; // Thay bằng STK thật
    const qrUrl = `https://qr.sepay.vn/img?acc=${SEPAY_ACCOUNT}&bank=${SEPAY_BANK}&amount=${plan.price}&des=${orderCode}`;

    const handlePay = async () => {
        // Create order in DB
        try {
            await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: selectedPlan, amount: plan.price, orderCode }),
            });
            setStatus("paying");
        } catch {
            setStatus("paying"); // Still show QR even if DB fails
        }
    };

    // Poll for payment confirmation
    useEffect(() => {
        if (status !== "paying") return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/orders/status?code=${orderCode}`);
                const data = await res.json();
                if (data.status === "paid") {
                    setStatus("success");
                    clearInterval(interval);
                }
            } catch {
                // ignore
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [status, orderCode]);

    if (status === "success") {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #ecfdf5, #fff)", fontFamily: "'Inter', sans-serif" }}>
                <div style={{ textAlign: "center", maxWidth: 400, padding: 40 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: "#059669", margin: "0 0 8px" }}>Thanh toán thành công!</h1>
                    <p style={{ fontSize: 16, color: "#6b7280", margin: "0 0 24px" }}>
                        Bạn đã nâng cấp lên gói {plan.name}
                    </p>
                    <Link
                        href="/dashboard"
                        style={{
                            display: "inline-block",
                            padding: "12px 32px",
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        🏠 Về Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', sans-serif", padding: "40px 24px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link href="/" style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>
                        ❤️ LoveStory
                    </Link>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", margin: "16px 0 4px" }}>
                        {status === "selecting" ? "Nâng cấp tài khoản" : "Quét QR để thanh toán"}
                    </h1>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                        {status === "selecting" ? "Chọn gói phù hợp với bạn" : "Hệ thống tự động xác nhận trong 10-30 giây"}
                    </p>
                </div>

                {status === "selecting" ? (
                    <>
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
                                style={{
                                    padding: "16px 48px",
                                    borderRadius: 14,
                                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                    color: "#fff",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 8px 24px rgba(255,107,157,0.35)",
                                }}
                            >
                                💳 Thanh toán {plan.priceLabel}
                            </button>
                            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>Thanh toán qua chuyển khoản ngân hàng · SePay.vn</p>
                        </div>
                    </>
                ) : (
                    /* QR Payment */
                    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
                        <div style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 24 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", margin: "0 0 16px" }}>{plan.name} — {plan.priceLabel}</p>
                            {/* QR Code from SePay */}
                            <img
                                src={qrUrl}
                                alt="QR Code thanh toán"
                                width={240}
                                height={240}
                                style={{ borderRadius: 16, margin: "0 auto 16px", display: "block" }}
                            />
                            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px" }}>Mã đơn hàng:</p>
                            <p style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: "0 0 16px", letterSpacing: 2 }}>{orderCode}</p>
                            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 12 }}>
                                <p style={{ fontSize: 12, color: "#059669", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                    <span style={{ animation: "blink 1.5s ease-in-out infinite" }}>⏳</span>
                                    Đang chờ thanh toán... Tự động xác nhận sau 10-30 giây
                                </p>
                            </div>
                        </div>

                        <Link href="/" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>← Quay lại</Link>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
        </div>
    );
}
