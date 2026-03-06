import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ code?: string }>;
}) {
    const params = await searchParams;
    const orderCode = params.code;

    let planName = "Premium";
    let orderStatus = "pending";

    if (orderCode) {
        const supabase = await createClient();

        // Only READ order info — NEVER mark as paid here!
        // Payment confirmation ONLY happens via SePay webhook
        const { data: order } = await supabase
            .from("orders")
            .select("plan, status")
            .eq("order_code", orderCode)
            .single();

        if (order) {
            planName = order.plan === "basic" ? "Basic" : "Premium";
            orderStatus = order.status;
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(180deg, #ecfdf5 0%, #fff 100%)",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div style={{ textAlign: "center", maxWidth: 440, padding: 40 }}>
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #34d399, #10b981)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 40,
                        margin: "0 auto 24px",
                        boxShadow: "0 12px 32px rgba(16,185,129,0.3)",
                    }}
                >
                    ✅
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#059669", margin: "0 0 8px" }}>
                    Thanh toán thành công!
                </h1>
                <p style={{ fontSize: 16, color: "#6b7280", margin: "0 0 8px" }}>
                    Bạn đã nâng cấp lên gói <strong>{planName}</strong>
                </p>
                {orderCode && (
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 32px" }}>
                        Mã đơn: {orderCode}
                    </p>
                )}

                <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                    <Link
                        href="/dashboard"
                        style={{
                            padding: "14px 32px",
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                            boxShadow: "0 4px 16px rgba(255,107,157,0.3)",
                        }}
                    >
                        🏠 Về Dashboard
                    </Link>
                    <Link
                        href="/templates"
                        style={{
                            padding: "14px 24px",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            background: "#fff",
                            color: "#374151",
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        🎨 Tạo thiệp ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}
