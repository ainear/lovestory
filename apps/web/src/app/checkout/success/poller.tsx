"use client";

import { useEffect, useState } from "react";

/**
 * Client component that polls order status every 3s.
 * When payment is confirmed by SePay webhook, reloads page to show success state.
 */
export function CheckoutStatusPoller({ orderCode }: { orderCode: string }) {
    const [attempts, setAttempts] = useState(0);
    const MAX_ATTEMPTS = 60; // 3s * 60 = 3 minutes max polling

    useEffect(() => {
        if (attempts >= MAX_ATTEMPTS) return;

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/api/orders/status?code=${encodeURIComponent(orderCode)}`,
                );
                const data = await res.json();

                if (data.status === "paid") {
                    // Payment confirmed! Reload to show success state
                    window.location.reload();
                    return;
                }
            } catch {
                // Ignore errors, keep polling
            }

            setAttempts((a) => a + 1);
        }, 3000);

        return () => clearTimeout(timer);
    }, [attempts, orderCode]);

    if (attempts >= MAX_ATTEMPTS) {
        return (
            <p
                style={{
                    fontSize: 13,
                    color: "#dc2626",
                    margin: "12px 0",
                }}
            >
                ⚠️ Chưa nhận được xác nhận. Vui lòng kiểm tra lại sau hoặc
                liên hệ hỗ trợ.
            </p>
        );
    }

    return (
        <div style={{ margin: "16px 0" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 4,
                }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#f59e0b",
                            animation: `bounce 1.4s infinite both`,
                            animationDelay: `${i * 0.16}s`,
                        }}
                    />
                ))}
            </div>
            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
