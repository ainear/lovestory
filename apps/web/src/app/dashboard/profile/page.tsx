import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: "0 0 24px" }}>👤 Thông tin cá nhân</h2>

            <div style={{ maxWidth: 600 }}>
                {/* Avatar + Name */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e8e8ec",
                        padding: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 28,
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                    >
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>
                            {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                        </h3>
                        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 4px" }}>{user?.email}</p>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "3px 12px",
                                borderRadius: 6,
                                background: "#ecfdf5",
                                color: "#059669",
                                fontSize: 12,
                                fontWeight: 600,
                            }}
                        >
                            ⭐ Free Plan
                        </span>
                    </div>
                </div>

                {/* Profile Form */}
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8ec", padding: 24 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 16px" }}>Chỉnh sửa thông tin</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <FieldRow label="Họ tên" value={user?.user_metadata?.full_name || ""} placeholder="Nhập họ tên" />
                        <FieldRow label="Email" value={user?.email || ""} disabled />
                        <FieldRow label="Số điện thoại" value="" placeholder="0912345678" />
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>
                                Giới thiệu
                            </label>
                            <textarea
                                placeholder="Viết vài dòng về bạn..."
                                rows={3}
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 14,
                                    resize: "vertical",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>
                        <button
                            style={{
                                padding: "12px 24px",
                                borderRadius: 12,
                                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                alignSelf: "flex-start",
                            }}
                        >
                            💾 Lưu thay đổi
                        </button>
                    </div>
                </div>

                {/* Sign Out */}
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #e8e8ec" }}>
                    <a
                        href="/auth/signout"
                        style={{
                            display: "inline-block",
                            padding: "10px 20px",
                            borderRadius: 10,
                            border: "1px solid #fecaca",
                            background: "#fff",
                            color: "#dc2626",
                            fontSize: 14,
                            fontWeight: 500,
                            textDecoration: "none",
                        }}
                    >
                        🚪 Đăng xuất
                    </a>
                </div>
            </div>
        </div>
    );
}

function FieldRow({
    label,
    value,
    placeholder,
    disabled,
}: {
    label: string;
    value: string;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
            <input
                defaultValue={value}
                placeholder={placeholder}
                disabled={disabled}
                style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    background: disabled ? "#f9fafb" : "#fff",
                    color: disabled ? "#9ca3af" : "#1f2937",
                }}
            />
        </div>
    );
}
