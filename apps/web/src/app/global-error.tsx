"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html lang="vi">
            <body style={{ margin: 0 }}>
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                        fontFamily: "'Inter', -apple-system, sans-serif",
                        padding: 24,
                    }}
                >
                    <div style={{ textAlign: "center", maxWidth: 480 }}>
                        <p style={{ fontSize: 100, margin: "0 0 16px", lineHeight: 1 }}>⚡</p>
                        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
                            Có lỗi xảy ra
                        </h1>
                        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "0 0 32px", lineHeight: 1.6 }}>
                            Đã có sự cố. Vui lòng thử lại hoặc quay về trang chủ.
                        </p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button
                                onClick={() => reset()}
                                style={{
                                    padding: "14px 28px",
                                    borderRadius: 14,
                                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                    color: "#fff",
                                    fontSize: 15,
                                    fontWeight: 600,
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                🔄 Thử lại
                            </button>
                            <a
                                href="/"
                                style={{
                                    padding: "14px 28px",
                                    borderRadius: 14,
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "#fff",
                                    fontSize: 15,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                }}
                            >
                                🏠 Trang chủ
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
