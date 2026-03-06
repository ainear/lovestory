import Link from "next/link";

export default function NotFound() {
    return (
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
                <p style={{ fontSize: 120, margin: "0 0 16px", lineHeight: 1 }}>💔</p>
                <h1 style={{ fontSize: 48, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>404</h1>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 32px", lineHeight: 1.6 }}>
                    Trang bạn tìm không tồn tại hoặc đã bị xóa
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <Link
                        href="/"
                        style={{
                            padding: "14px 28px",
                            borderRadius: 14,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 15,
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        🏠 Về trang chủ
                    </Link>
                    <Link
                        href="/dashboard"
                        style={{
                            padding: "14px 28px",
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                            fontSize: 15,
                            fontWeight: 500,
                            textDecoration: "none",
                        }}
                    >
                        📊 Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
