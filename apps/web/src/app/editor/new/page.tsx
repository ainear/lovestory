"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EditorContent() {
    const searchParams = useSearchParams();
    const templateSlug = searchParams.get("template") || "rose-garden";

    const [formData, setFormData] = useState({
        groomName: "",
        brideName: "",
        weddingDate: "",
        weddingTime: "",
        venueName: "",
        venueAddress: "",
        groomParentNames: "",
        brideParentNames: "",
        story: "",
        message: "",
        googleMapsUrl: "",
        bankName: "",
        bankAccount: "",
        bankOwner: "",
    });

    const [activeSection, setActiveSection] = useState("couple");

    const sections = [
        { key: "couple", icon: "💑", label: "Cô dâu & Chú rể" },
        { key: "event", icon: "📅", label: "Sự kiện" },
        { key: "venue", icon: "📍", label: "Địa điểm" },
        { key: "story", icon: "💕", label: "Câu chuyện" },
        { key: "gift", icon: "🎁", label: "Quà tặng" },
    ];

    function handleChange(field: string, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* Editor Panel */}
            <div
                style={{
                    width: 420,
                    background: "#fff",
                    borderRight: "1px solid #e8e8ec",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    zIndex: 30,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #e8e8ec",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <Link
                        href="/templates"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textDecoration: "none",
                            fontSize: 16,
                            color: "#6b7280",
                        }}
                    >
                        ←
                    </Link>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: 0 }}>
                            Chỉnh sửa thiệp
                        </h2>
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                            Mẫu: {templateSlug.replace(/-/g, " ")}
                        </p>
                    </div>
                    <button
                        style={{
                            padding: "8px 20px",
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        💾 Lưu
                    </button>
                </div>

                {/* Section Tab */}
                <div
                    style={{
                        display: "flex",
                        gap: 4,
                        padding: "12px 16px",
                        borderBottom: "1px solid #f3f4f6",
                        overflowX: "auto",
                    }}
                >
                    {sections.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => setActiveSection(s.key)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 500,
                                border: "none",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                background: activeSection === s.key ? "#f0f0ff" : "transparent",
                                color: activeSection === s.key ? "#6366f1" : "#6b7280",
                            }}
                        >
                            {s.icon} {s.label}
                        </button>
                    ))}
                </div>

                {/* Form Fields */}
                <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
                    {activeSection === "couple" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <FormField
                                label="Tên Chú rể"
                                placeholder="Nguyễn Văn A"
                                value={formData.groomName}
                                onChange={(v) => handleChange("groomName", v)}
                            />
                            <FormField
                                label="Tên Cô dâu"
                                placeholder="Trần Thị B"
                                value={formData.brideName}
                                onChange={(v) => handleChange("brideName", v)}
                            />
                            <FormField
                                label="Bố mẹ Chú rể"
                                placeholder="Ông Nguyễn Văn C & Bà Lê Thị D"
                                value={formData.groomParentNames}
                                onChange={(v) => handleChange("groomParentNames", v)}
                            />
                            <FormField
                                label="Bố mẹ Cô dâu"
                                placeholder="Ông Trần Văn E & Bà Phạm Thị F"
                                value={formData.brideParentNames}
                                onChange={(v) => handleChange("brideParentNames", v)}
                            />
                        </div>
                    )}

                    {activeSection === "event" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <FormField
                                label="Ngày cưới"
                                type="date"
                                value={formData.weddingDate}
                                onChange={(v) => handleChange("weddingDate", v)}
                            />
                            <FormField
                                label="Giờ cưới"
                                type="time"
                                value={formData.weddingTime}
                                onChange={(v) => handleChange("weddingTime", v)}
                            />
                        </div>
                    )}

                    {activeSection === "venue" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <FormField
                                label="Tên địa điểm"
                                placeholder="Trung tâm tiệc cưới ABC"
                                value={formData.venueName}
                                onChange={(v) => handleChange("venueName", v)}
                            />
                            <FormField
                                label="Địa chỉ"
                                placeholder="123 Đường Nguyễn Huệ, Q.1, TP.HCM"
                                value={formData.venueAddress}
                                onChange={(v) => handleChange("venueAddress", v)}
                            />
                            <FormField
                                label="Google Maps URL"
                                placeholder="https://maps.google.com/..."
                                value={formData.googleMapsUrl}
                                onChange={(v) => handleChange("googleMapsUrl", v)}
                            />
                        </div>
                    )}

                    {activeSection === "story" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>
                                    Câu chuyện tình yêu
                                </label>
                                <textarea
                                    placeholder="Chúng tôi gặp nhau vào một ngày mưa..."
                                    value={formData.story}
                                    onChange={(e) => handleChange("story", e.target.value)}
                                    rows={6}
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
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>
                                    Lời mời
                                </label>
                                <textarea
                                    placeholder="Trân trọng kính mời quý khách đến dự..."
                                    value={formData.message}
                                    onChange={(e) => handleChange("message", e.target.value)}
                                    rows={4}
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
                        </div>
                    )}

                    {activeSection === "gift" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <FormField
                                label="Ngân hàng"
                                placeholder="Vietcombank"
                                value={formData.bankName}
                                onChange={(v) => handleChange("bankName", v)}
                            />
                            <FormField
                                label="Số tài khoản"
                                placeholder="0123456789"
                                value={formData.bankAccount}
                                onChange={(v) => handleChange("bankAccount", v)}
                            />
                            <FormField
                                label="Chủ tài khoản"
                                placeholder="Nguyễn Văn A"
                                value={formData.bankOwner}
                                onChange={(v) => handleChange("bankOwner", v)}
                            />
                            <div
                                style={{
                                    background: "#f0f9ff",
                                    borderRadius: 12,
                                    padding: 16,
                                    border: "1px solid #bae6fd",
                                }}
                            >
                                <p style={{ fontSize: 12, color: "#0369a1", margin: 0 }}>
                                    💡 QR chuyển khoản sẽ tự động tạo từ thông tin ngân hàng
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderTop: "1px solid #e8e8ec",
                        display: "flex",
                        gap: 12,
                    }}
                >
                    <button
                        style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            background: "#fff",
                            color: "#374151",
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: "pointer",
                        }}
                    >
                        👁️ Xem trước
                    </button>
                    <button
                        style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: 12,
                            border: "none",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        🚀 Xuất bản
                    </button>
                </div>
            </div>

            {/* Live Preview */}
            <div
                style={{
                    flex: 1,
                    marginLeft: 420,
                    background: "#1a1a2e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 40,
                    minHeight: "100vh",
                }}
            >
                <div
                    style={{
                        width: 375,
                        height: 667,
                        borderRadius: 32,
                        background: "#fff",
                        overflow: "hidden",
                        boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
                        position: "relative",
                    }}
                >
                    {/* Phone Frame */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 44,
                            background: "#000",
                            borderRadius: "32px 32px 0 0",
                            zIndex: 5,
                        }}
                    >
                        {/* Notch */}
                        <div
                            style={{
                                width: 120,
                                height: 24,
                                background: "#000",
                                borderRadius: "0 0 16px 16px",
                                margin: "0 auto",
                            }}
                        />
                    </div>

                    {/* Preview Content */}
                    <div
                        style={{
                            paddingTop: 44,
                            height: "100%",
                            overflow: "auto",
                            background: `linear-gradient(180deg, #fce7f3, #fdf2f8, #fff)`,
                        }}
                    >
                        {/* Invitation Content */}
                        <div style={{ textAlign: "center", padding: "40px 24px" }}>
                            <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 3, margin: "0 0 8px" }}>
                                SAVE THE DATE
                            </p>
                            <h2
                                style={{
                                    fontSize: 28,
                                    fontWeight: 300,
                                    color: "#831843",
                                    margin: "0 0 4px",
                                    fontStyle: "italic",
                                }}
                            >
                                {formData.groomName || "Chú rể"}
                            </h2>
                            <p
                                style={{
                                    fontSize: 20,
                                    color: "#be185d",
                                    margin: "0 0 4px",
                                }}
                            >
                                &
                            </p>
                            <h2
                                style={{
                                    fontSize: 28,
                                    fontWeight: 300,
                                    color: "#831843",
                                    margin: "0 0 24px",
                                    fontStyle: "italic",
                                }}
                            >
                                {formData.brideName || "Cô dâu"}
                            </h2>

                            {/* Date */}
                            <div
                                style={{
                                    background: "rgba(255,255,255,0.7)",
                                    borderRadius: 16,
                                    padding: "16px 24px",
                                    margin: "0 auto 24px",
                                    maxWidth: 200,
                                }}
                            >
                                <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                                    {formData.weddingDate
                                        ? new Date(formData.weddingDate).toLocaleDateString("vi-VN", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : "Chọn ngày cưới"}
                                </p>
                                {formData.weddingTime && (
                                    <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>
                                        ⏰ {formData.weddingTime}
                                    </p>
                                )}
                            </div>

                            {/* Venue */}
                            {(formData.venueName || formData.venueAddress) && (
                                <div style={{ marginBottom: 24 }}>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: "#374151", margin: "0 0 4px" }}>
                                        📍 {formData.venueName || "Địa điểm"}
                                    </p>
                                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                                        {formData.venueAddress}
                                    </p>
                                </div>
                            )}

                            {/* Story */}
                            {formData.story && (
                                <div
                                    style={{
                                        background: "rgba(255,255,255,0.5)",
                                        borderRadius: 16,
                                        padding: 20,
                                        margin: "0 0 24px",
                                        textAlign: "left",
                                    }}
                                >
                                    <p style={{ fontSize: 11, color: "#d97706", letterSpacing: 2, margin: "0 0 8px" }}>
                                        OUR STORY
                                    </p>
                                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                                        {formData.story}
                                    </p>
                                </div>
                            )}

                            {/* Message */}
                            {formData.message && (
                                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, fontStyle: "italic" }}>
                                    &ldquo;{formData.message}&rdquo;
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormField({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <div>
            <label
                style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#374151",
                    display: "block",
                    marginBottom: 6,
                }}
            >
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                }}
            />
        </div>
    );
}

export default function EditorNewPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        fontSize: 18,
                        color: "#6b7280",
                    }}
                >
                    Đang tải editor...
                </div>
            }
        >
            <EditorContent />
        </Suspense>
    );
}
