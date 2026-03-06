"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function EditorEditPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const [activeSection, setActiveSection] = useState("couple");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

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
        photos: ["", "", "", "", "", ""] as string[],
    });
    const [templateSlug, setTemplateSlug] = useState("rose-garden");
    const [projectStatus, setProjectStatus] = useState("draft");
    const [slug, setSlug] = useState("");

    // Load project from DB
    useEffect(() => {
        async function loadProject() {
            const { data: project, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", projectId)
                .single();

            if (error || !project) {
                setSaveMsg("❌ Không tìm thấy thiệp");
                setLoading(false);
                return;
            }

            setFormData({
                groomName: project.groom_name || "",
                brideName: project.bride_name || "",
                weddingDate: project.wedding_date || "",
                weddingTime: project.wedding_time || "",
                venueName: project.venue_name || "",
                venueAddress: project.venue_address || "",
                groomParentNames: project.groom_parent_names || "",
                brideParentNames: project.bride_parent_names || "",
                story: project.story || "",
                message: project.message || "",
                googleMapsUrl: project.google_maps_url || "",
                bankName: project.bank_name || "",
                bankAccount: project.bank_account || "",
                bankOwner: project.bank_owner || "",
                photos: (() => {
                    try { const p = JSON.parse(project.photos || "[]"); while (p.length < 6) p.push(""); return p; }
                    catch { return ["", "", "", "", "", ""]; }
                })(),
            });
            setTemplateSlug(project.template || "rose-garden");
            setProjectStatus(project.status || "draft");
            setSlug(project.slug || "");
            setLoading(false);
        }
        loadProject();
    }, [projectId]);

    const sections = [
        { key: "couple", icon: "💑", label: "Cô dâu & Chú rể" },
        { key: "event", icon: "📅", label: "Sự kiện" },
        { key: "venue", icon: "📍", label: "Địa điểm" },
        { key: "story", icon: "💕", label: "Câu chuyện" },
        { key: "photos", icon: "📸", label: "Ảnh cưới" },
        { key: "gift", icon: "🎁", label: "Quà tặng" },
    ];

    function handleChange(field: string, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave(publish = false) {
        setSaving(true);
        setSaveMsg("");
        try {
            const updateData: Record<string, any> = {
                title: `${formData.groomName || "Chú rể"} & ${formData.brideName || "Cô dâu"}`,
                template: templateSlug,
                groom_name: formData.groomName,
                bride_name: formData.brideName,
                wedding_date: formData.weddingDate || null,
                wedding_time: formData.weddingTime || null,
                venue_name: formData.venueName,
                venue_address: formData.venueAddress,
                google_maps_url: formData.googleMapsUrl,
                story: formData.story,
                message: formData.message,
                bank_name: formData.bankName,
                bank_account: formData.bankAccount,
                bank_owner: formData.bankOwner,
                groom_parent_names: formData.groomParentNames,
                bride_parent_names: formData.brideParentNames,
                photos: JSON.stringify(formData.photos.filter(p => p.trim())),
                updated_at: new Date().toISOString(),
            };

            if (publish) updateData.status = "published";

            const { error } = await supabase
                .from("projects")
                .update(updateData)
                .eq("id", projectId);

            if (error) { setSaveMsg(`Lỗi: ${error.message}`); setSaving(false); return; }

            setProjectStatus(publish ? "published" : projectStatus);
            setSaveMsg(publish ? "✅ Đã xuất bản!" : "✅ Đã lưu!");
        } catch {
            setSaveMsg("Lỗi kết nối");
        }
        setSaving(false);
    }

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 18, color: "#6b7280" }}>
                ⏳ Đang tải thiệp...
            </div>
        );
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
                        href="/dashboard/projects"
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
                            ✏️ Chỉnh sửa thiệp
                        </h2>
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                            Mẫu: {templateSlug.replace(/-/g, " ")} ·{" "}
                            <span style={{ color: projectStatus === "published" ? "#059669" : "#f59e0b" }}>
                                {projectStatus === "published" ? "🟢 Đã xuất bản" : "📝 Bản nháp"}
                            </span>
                        </p>
                    </div>
                    {saveMsg && <span style={{ fontSize: 12, color: saveMsg.startsWith("✅") ? "#059669" : "#dc2626" }}>{saveMsg}</span>}
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        style={{
                            padding: "8px 20px",
                            borderRadius: 10,
                            background: saving ? "#9ca3af" : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 600,
                            border: "none",
                            cursor: saving ? "not-allowed" : "pointer",
                        }}
                    >
                        {saving ? "⏳..." : "💾 Lưu"}
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
                            <FormField label="Tên Chú rể" placeholder="Nguyễn Văn A" value={formData.groomName} onChange={(v) => handleChange("groomName", v)} />
                            <FormField label="Tên Cô dâu" placeholder="Trần Thị B" value={formData.brideName} onChange={(v) => handleChange("brideName", v)} />
                            <FormField label="Bố mẹ Chú rể" placeholder="Ông Nguyễn Văn C & Bà Lê Thị D" value={formData.groomParentNames} onChange={(v) => handleChange("groomParentNames", v)} />
                            <FormField label="Bố mẹ Cô dâu" placeholder="Ông Trần Văn E & Bà Phạm Thị F" value={formData.brideParentNames} onChange={(v) => handleChange("brideParentNames", v)} />
                        </div>
                    )}

                    {activeSection === "event" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <FormField label="Ngày cưới" type="date" value={formData.weddingDate} onChange={(v) => handleChange("weddingDate", v)} />
                            <FormField label="Giờ lễ cưới" placeholder="17:00" value={formData.weddingTime} onChange={(v) => handleChange("weddingTime", v)} />
                        </div>
                    )}

                    {activeSection === "venue" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <FormField label="Tên địa điểm" placeholder="Trung tâm hội nghị ABC" value={formData.venueName} onChange={(v) => handleChange("venueName", v)} />
                            <FormField label="Địa chỉ" placeholder="123 Đường XYZ, Quận 1, TP.HCM" value={formData.venueAddress} onChange={(v) => handleChange("venueAddress", v)} />
                            <FormField label="Google Maps URL" placeholder="https://maps.google.com/..." value={formData.googleMapsUrl} onChange={(v) => handleChange("googleMapsUrl", v)} />
                        </div>
                    )}

                    {activeSection === "story" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Câu chuyện tình yêu</label>
                                <textarea
                                    placeholder="Chúng tôi gặp nhau vào một ngày đẹp trời..."
                                    value={formData.story}
                                    onChange={(e) => handleChange("story", e.target.value)}
                                    rows={5}
                                    style={{
                                        width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14,
                                        resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#1f2937", background: "#fff",
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Lời nhắn</label>
                                <textarea
                                    placeholder="Sự hiện diện của bạn là niềm vui lớn..."
                                    value={formData.message}
                                    onChange={(e) => handleChange("message", e.target.value)}
                                    rows={3}
                                    style={{
                                        width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14,
                                        resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#1f2937", background: "#fff",
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === "photos" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ background: "#fef3c7", borderRadius: 12, padding: 16, border: "1px solid #fde68a" }}>
                                <p style={{ fontSize: 12, color: "#92400e", margin: 0 }}>
                                    📷 Dán link ảnh từ Google Photos, iCloud, Imgur hoặc bất kỳ đường dẫn ảnh nào. Tối đa 6 ảnh.
                                </p>
                            </div>
                            {formData.photos.map((url, i) => (
                                <div key={i}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>
                                        Ảnh {i + 1}
                                    </label>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <input
                                            type="url"
                                            placeholder="https://example.com/photo.jpg"
                                            value={url}
                                            onChange={(e) => {
                                                const newPhotos = [...formData.photos];
                                                newPhotos[i] = e.target.value;
                                                setFormData(prev => ({ ...prev, photos: newPhotos }));
                                            }}
                                            style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", background: "#fff" }}
                                        />
                                        {url && (
                                            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid #e5e7eb" }}>
                                                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === "gift" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <FormField label="Tên ngân hàng" placeholder="Vietcombank" value={formData.bankName} onChange={(v) => handleChange("bankName", v)} />
                            <FormField label="Số tài khoản" placeholder="0123456789" value={formData.bankAccount} onChange={(v) => handleChange("bankAccount", v)} />
                            <FormField label="Chủ tài khoản" placeholder="NGUYEN VAN A" value={formData.bankOwner} onChange={(v) => handleChange("bankOwner", v)} />
                        </div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderTop: "1px solid #e8e8ec",
                        display: "flex",
                        gap: 10,
                    }}
                >
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: 12,
                            border: "none",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: saving ? "not-allowed" : "pointer",
                        }}
                    >
                        🚀 Xuất bản
                    </button>
                    {projectStatus === "published" && slug && (
                        <Link
                            href={`/i/${slug}`}
                            target="_blank"
                            style={{
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                color: "#6b7280",
                                fontSize: 13,
                                fontWeight: 500,
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            👁️ Xem
                        </Link>
                    )}
                </div>
            </div>

            {/* Preview Panel */}
            <div
                style={{
                    flex: 1,
                    marginLeft: 420,
                    background: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 40,
                    minHeight: "100vh",
                }}
            >
                <div
                    style={{
                        width: 380,
                        background: "#fff",
                        borderRadius: 24,
                        overflow: "hidden",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                        border: "1px solid #e8e8ec",
                    }}
                >
                    {/* Card Preview */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #fce7f3, #fdf2f8, #fff1f2)",
                            padding: "40px 28px",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ fontSize: 12, color: "#be185d", textTransform: "uppercase", letterSpacing: 3 }}>Thiệp mời</p>
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#831843", margin: "12px 0" }}>
                            {formData.groomName || "Chú rể"} & {formData.brideName || "Cô dâu"}
                        </h2>
                        {formData.groomParentNames && <p style={{ fontSize: 12, color: "#9d174d", margin: "4px 0 0" }}>Con Ông/Bà: {formData.groomParentNames}</p>}
                        {formData.brideParentNames && <p style={{ fontSize: 12, color: "#9d174d", margin: "4px 0 0" }}>Con Ông/Bà: {formData.brideParentNames}</p>}
                    </div>
                    <div style={{ padding: "24px 28px" }}>
                        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                            <div style={{ flex: 1, padding: "12px 16px", background: "#fef2f2", borderRadius: 12, textAlign: "center" }}>
                                <p style={{ fontSize: 10, color: "#be185d", margin: 0 }}>📅 Ngày cưới</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#831843", margin: "4px 0 0" }}>
                                    {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString("vi-VN") : "DD/MM/YYYY"}
                                </p>
                            </div>
                            <div style={{ flex: 1, padding: "12px 16px", background: "#fef2f2", borderRadius: 12, textAlign: "center" }}>
                                <p style={{ fontSize: 10, color: "#be185d", margin: 0 }}>⏰ Thời gian</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#831843", margin: "4px 0 0" }}>{formData.weddingTime || "HH:MM"}</p>
                            </div>
                        </div>
                        {formData.venueName && (
                            <div style={{ padding: "12px 16px", background: "#fef2f2", borderRadius: 12, marginBottom: 16 }}>
                                <p style={{ fontSize: 10, color: "#be185d", margin: 0 }}>📍 Địa điểm</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#831843", margin: "4px 0 0" }}>{formData.venueName}</p>
                                {formData.venueAddress && <p style={{ fontSize: 12, color: "#be185d", margin: "2px 0 0" }}>{formData.venueAddress}</p>}
                            </div>
                        )}
                        {formData.story && (
                            <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#831843", margin: "0 0 6px" }}>💕 Câu chuyện tình yêu</p>
                                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{formData.story}</p>
                            </div>
                        )}
                        {formData.message && (
                            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, fontStyle: "italic" }}>
                                &ldquo;{formData.message}&rdquo;
                            </p>
                        )}
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
            <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
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
                    color: "#1f2937",
                    background: "#fff",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                }}
            />
        </div>
    );
}
