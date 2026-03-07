"use client";

import { useState, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
    Type, Image, Puzzle, Palette, Music, LayoutGrid,
    LayoutTemplate, Sparkles, HelpCircle, Undo2, Redo2,
    Eye, Rocket, Heart, Save, Menu, Headphones,
} from "lucide-react";

/* ─── SIDEBAR TABS (matches CineLove — SVG icons) ─── */
const SIDEBAR_TABS: { key: string; icon: ReactNode; label: string }[] = [
    { key: "text", icon: <Type size={20} />, label: "Văn bản" },
    { key: "images", icon: <Image size={20} />, label: "Hình ảnh" },
    { key: "stock", icon: <Puzzle size={20} />, label: "Stock" },
    { key: "bg", icon: <Palette size={20} />, label: "Nền" },
    { key: "music", icon: <Music size={20} />, label: "Âm nhạc" },
    { key: "widgets", icon: <LayoutGrid size={20} />, label: "Tiện ích" },
    { key: "templates", icon: <LayoutTemplate size={20} />, label: "Mẫu" },
    { key: "effects", icon: <Sparkles size={20} />, label: "Hiệu ứng" },
];

/* ─── TEMPLATE THEMES ─── */
const TEMPLATE_THEMES: Record<string, {
    bg: string; accent: string; textColor: string; nameColor: string;
    font: string; pattern: string; decorTop: string; decorBottom: string;
}> = {
    "rose-garden": {
        bg: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
        accent: "#be185d", textColor: "#831843", nameColor: "#9f1239",
        font: "'Georgia', serif", pattern: "🌹",
        decorTop: "✿ ❀ ✿", decorBottom: "❀ ✿ ❀",
    },
    "midnight-romance": {
        bg: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)",
        accent: "#c084fc", textColor: "#e9d5ff", nameColor: "#f5f3ff",
        font: "'Georgia', serif", pattern: "🌙",
        decorTop: "☆ ✧ ☆", decorBottom: "✧ ☆ ✧",
    },
    "golden-hour": {
        bg: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)",
        accent: "#d97706", textColor: "#92400e", nameColor: "#78350f",
        font: "'Georgia', serif", pattern: "🌅",
        decorTop: "❋ ✤ ❋", decorBottom: "✤ ❋ ✤",
    },
};

function EditorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const templateSlug = searchParams.get("template") || "rose-garden";
    const theme = TEMPLATE_THEMES[templateSlug] || TEMPLATE_THEMES["rose-garden"];

    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const [autoSaved, setAutoSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("text");
    const [zoom, setZoom] = useState(100);
    const [widgetToggles, setWidgetToggles] = useState<Record<string, boolean>>({
        calendar: true, countdown: true, map: true, rsvp: true,
        wishes: true, qr: true, photos: true, phone: false,
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const [formData, setFormData] = useState({
        groomName: "", brideName: "",
        weddingDate: "", weddingTime: "",
        venueName: "", venueAddress: "",
        groomParentNames: "", brideParentNames: "",
        story: "", message: "",
        googleMapsUrl: "",
        bankName: "", bankAccount: "", bankOwner: "",
        photos: ["", "", "", "", "", ""] as string[],
    });

    const handleChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setAutoSaved(false);
        // Simulate auto-save
        setTimeout(() => setAutoSaved(true), 1500);
    }, []);

    async function handleSave(publish = false) {
        setSaving(true);
        setSaveMsg("");
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setSaveMsg("Vui lòng đăng nhập"); setSaving(false); return; }

            // Use maybeSingle() — new users have no subscription row (avoids 406)
            const { data: sub } = await supabase.from("subscriptions").select("plan").eq("user_id", user.id).maybeSingle();
            const plan = sub?.plan || "free";
            const maxProjects = plan === "premium" ? 999 : plan === "basic" ? 5 : 1;
            const { count } = await supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user.id);
            if ((count || 0) >= maxProjects) {
                setSaveMsg(`Giới hạn ${maxProjects} thiệp (${plan})`);
                setSaving(false);
                return;
            }

            if (!formData.groomName || !formData.brideName) {
                setSaveMsg("Nhập tên Chú rể và Cô dâu");
                setSaving(false);
                return;
            }

            const slug = `${formData.groomName.toLowerCase().replace(/\s+/g, "-")}-${formData.brideName.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;

            // Step 1: Insert with ONLY core columns guaranteed to exist
            const { data: inserted, error } = await supabase.from("projects").insert({
                user_id: user.id,
                title: `${formData.groomName} & ${formData.brideName}`,
                slug,
                template: templateSlug,
                groom_name: formData.groomName,
                bride_name: formData.brideName,
                wedding_date: formData.weddingDate || null,
                venue_name: formData.venueName || null,
                venue_address: formData.venueAddress || null,
                status: publish ? "published" : "draft",
                view_count: 0,
            }).select("id").single();

            if (error) {
                console.error("Project insert error:", error);
                setSaveMsg(`Lỗi: ${error.message}`);
                setSaving(false);
                return;
            }

            // Step 2: Update optional columns (may not exist in DB yet — fail silently)
            if (inserted?.id) {
                try {
                    await supabase.from("projects").update({
                        wedding_time: formData.weddingTime || null,
                        google_maps_url: formData.googleMapsUrl || null,
                        story: formData.story || null,
                        message: formData.message || null,
                        bank_name: formData.bankName || null,
                        bank_account: formData.bankAccount || null,
                        bank_owner: formData.bankOwner || null,
                        groom_parent_names: formData.groomParentNames || null,
                        bride_parent_names: formData.brideParentNames || null,
                        photos: JSON.stringify(formData.photos.filter(p => p.trim())),
                    }).eq("id", inserted.id);
                } catch { /* columns may not exist yet — continue */ }
            }
            setSaveMsg(publish ? "Đã xuất bản!" : "Đã lưu!");
            setTimeout(() => router.push("/dashboard/projects"), 1500);
        } catch (err) {
            console.error("Save error:", err);
            setSaveMsg("Lỗi kết nối");
        }
        setSaving(false);
    }

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", background: "#f5f7fa", overflow: "hidden" }}>

            {/* ═══ LEFT: ICON SIDEBAR (64px) — Like CineLove ═══ */}
            <div style={{
                width: 64, background: "#fff", borderRight: "1px solid #e8e8ec",
                display: "flex", flexDirection: "column", alignItems: "center",
                paddingTop: 8, gap: 2, flexShrink: 0, zIndex: 20,
            }}>
                {SIDEBAR_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            width: 52, padding: "10px 0", border: "none", borderRadius: 10,
                            background: activeTab === tab.key ? "#eef2ff" : "transparent",
                            color: activeTab === tab.key ? "#4f46e5" : "#6b7280",
                            cursor: "pointer", display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 2, fontSize: 18, transition: "all 0.15s",
                        }}
                    >
                        <span>{tab.icon}</span>
                        <span style={{ fontSize: 9, fontWeight: 500 }}>{tab.label}</span>
                    </button>
                ))}
                <div style={{ flex: 1 }} />
                <button
                    onClick={() => window.open("https://7app.online", "_blank")}
                    style={{
                        width: 52, padding: "10px 0", border: "none", borderRadius: 10,
                        background: "transparent", color: "#6b7280", cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 2, fontSize: 18, marginBottom: 12,
                    }}
                >
                    <Headphones size={18} />
                    <span style={{ fontSize: 9, fontWeight: 500 }}>Hỗ trợ</span>
                </button>
            </div>

            {/* ═══ LEFT: CONTENT PANEL (340px) — Slides based on active tab ═══ */}
            <div style={{
                width: 340, background: "#fff", borderRight: "1px solid #e8e8ec",
                display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0,
                overflow: "hidden",
            }}>
                {/* Panel Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: 0 }}>
                        {SIDEBAR_TABS.find(t => t.key === activeTab)?.icon}{" "}
                        {SIDEBAR_TABS.find(t => t.key === activeTab)?.label}
                    </h3>
                </div>

                {/* Panel Content */}
                <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>

                    {/* ── TEXT TAB: Couple info & Story ── */}
                    {activeTab === "text" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <PanelSection title="Cô dâu & Chú rể">
                                <FormField label="Tên Chú rể" placeholder="Nguyễn Văn A" value={formData.groomName} onChange={v => handleChange("groomName", v)} />
                                <FormField label="Tên Cô dâu" placeholder="Trần Thị B" value={formData.brideName} onChange={v => handleChange("brideName", v)} />
                                <FormField label="Bố mẹ Chú rể" placeholder="Ông Nguyễn Văn C & Bà Lê Thị D" value={formData.groomParentNames} onChange={v => handleChange("groomParentNames", v)} />
                                <FormField label="Bố mẹ Cô dâu" placeholder="Ông Trần Văn E & Bà Phạm Thị F" value={formData.brideParentNames} onChange={v => handleChange("brideParentNames", v)} />
                            </PanelSection>
                            <PanelSection title="Sự kiện">
                                <FormField label="Ngày cưới" type="date" value={formData.weddingDate} onChange={v => handleChange("weddingDate", v)} />
                                <FormField label="Giờ cưới" type="time" value={formData.weddingTime} onChange={v => handleChange("weddingTime", v)} />
                            </PanelSection>
                            <PanelSection title="Địa điểm">
                                <FormField label="Tên địa điểm" placeholder="Trung tâm tiệc cưới ABC" value={formData.venueName} onChange={v => handleChange("venueName", v)} />
                                <FormField label="Địa chỉ" placeholder="123 Đường Nguyễn Huệ, Q.1" value={formData.venueAddress} onChange={v => handleChange("venueAddress", v)} />
                                <FormField label="Google Maps URL" placeholder="https://maps.google.com/..." value={formData.googleMapsUrl} onChange={v => handleChange("googleMapsUrl", v)} />
                            </PanelSection>
                            <PanelSection title="Nội dung">
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>Câu chuyện tình yêu</label>
                                    <textarea placeholder="Chúng tôi gặp nhau..." value={formData.story} onChange={e => handleChange("story", e.target.value)} rows={4}
                                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#1f2937" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>Lời mời</label>
                                    <textarea placeholder="Trân trọng kính mời..." value={formData.message} onChange={e => handleChange("message", e.target.value)} rows={3}
                                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#1f2937" }} />
                                </div>
                            </PanelSection>
                        </div>
                    )}

                    {/* ── IMAGES TAB: Photo upload ── */}
                    {activeTab === "images" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Upload hoặc dán link. Tối đa 6 ảnh, mỗi ảnh ≤ 5MB.</p>
                            {formData.photos.map((url, i) => (
                                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <input type="url" placeholder={`Ảnh ${i + 1} — URL hoặc upload →`} value={url}
                                        onChange={e => { const p = [...formData.photos]; p[i] = e.target.value; setFormData(prev => ({ ...prev, photos: p })); }}
                                        style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, outline: "none" }} />
                                    <label style={{ padding: "6px 10px", borderRadius: 8, background: "#10b981", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                                        ↑
                                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                                            const file = e.target.files?.[0]; if (!file) return;
                                            const fd = new FormData(); fd.append("file", file); fd.append("projectId", "new");
                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: fd });
                                                const data = await res.json();
                                                if (data.url) { const p = [...formData.photos]; p[i] = data.url; setFormData(prev => ({ ...prev, photos: p })); }
                                            } catch { /* ignore */ }
                                            e.target.value = "";
                                        }} />
                                    </label>
                                    {url && <div style={{ width: 32, height: 32, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                                        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                    </div>}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── STOCK TAB: Decorative elements ── */}
                    {activeTab === "stock" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Chọn trang trí cho thiệp</p>
                            {["Hoa & Lá", "Viền & Khung", "Chữ nghệ thuật", "Biểu tượng"].map((cat, i) => (
                                <div key={i}>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "#374151", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>{cat}</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                                        {["🌹", "🌸", "🌺", "🌻", "💐", "🍃", "🌿", "✿"][i === 0 ? "slice" : "slice"](0, 4).map((e, j) => (
                                            <div key={j} style={{ width: "100%", aspectRatio: "1", borderRadius: 8, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, cursor: "pointer", transition: "all 0.15s", background: "#fafafa" }}>{["🌹", "🌸", "💐", "🍃", "❀", "✿", "❋", "✤", "♡", "💕", "💒", "🎀", "𝓐", "𝓑", "𝓒", "𝓓"][i * 4 + j]}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── BACKGROUND TAB ── */}
                    {activeTab === "bg" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Chọn nền cho thiệp</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                                {[
                                    { name: "Hồng nhạt", bg: "linear-gradient(180deg, #fce7f3, #fff)" },
                                    { name: "Tím đêm", bg: "linear-gradient(180deg, #0f0825, #2d1b69)" },
                                    { name: "Vàng ấm", bg: "linear-gradient(180deg, #fdf6e3, #fffbeb)" },
                                    { name: "Xanh pastel", bg: "linear-gradient(180deg, #ecfdf5, #f0fdf4)" },
                                    { name: "Đỏ cổ điển", bg: "linear-gradient(180deg, #7f1d1d, #991b1b)" },
                                    { name: "Trắng tinh", bg: "linear-gradient(180deg, #ffffff, #f9fafb)" },
                                ].map((c, i) => (
                                    <div key={i} style={{ aspectRatio: "3/4", borderRadius: 8, background: c.bg, border: "1px solid #e5e7eb", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                                        <span style={{ position: "absolute", bottom: 4, left: 0, right: 0, textAlign: "center", fontSize: 9, color: i === 1 || i === 4 ? "#fff" : "#6b7280", fontWeight: 500 }}>{c.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── MUSIC TAB ── */}
                    {activeTab === "music" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Chọn nhạc nền cho thiệp</p>
                            {[
                                { name: "A Thousand Years", artist: "Christina Perri", duration: "4:45" },
                                { name: "Perfect", artist: "Ed Sheeran", duration: "4:23" },
                                { name: "Can't Help Falling in Love", artist: "Elvis Presley", duration: "3:02" },
                                { name: "Marry Me", artist: "Train", duration: "3:33" },
                                { name: "All of Me", artist: "John Legend", duration: "4:29" },
                            ].map((track, i) => (
                                <div key={i} style={{
                                    padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb",
                                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                                    background: i === 0 ? "#eef2ff" : "#fff", transition: "all 0.15s",
                                }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `hsl(${i * 60 + 330}, 60%, 90%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>♫</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: "#1f2937", margin: 0 }}>{track.name}</p>
                                        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{track.artist}</p>
                                    </div>
                                    <span style={{ fontSize: 10, color: "#9ca3af" }}>{track.duration}</span>
                                </div>
                            ))}
                            <div style={{ padding: "12px", borderRadius: 10, border: "1px dashed #d1d5db", textAlign: "center", cursor: "pointer", marginTop: 8 }}>
                                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>🎵 Upload nhạc riêng (Premium)</p>
                            </div>
                        </div>
                    )}

                    {/* ── WIDGETS TAB ── */}
                    {activeTab === "widgets" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Thêm tiện ích tương tác</p>
                            {[
                                { key: "calendar", icon: "📅", name: "Lịch", desc: "Hiển thị lịch tháng cưới" },
                                { key: "countdown", icon: "⏱", name: "Đếm ngược", desc: "Countdown đến ngày cưới" },
                                { key: "map", icon: "🗺", name: "Bản đồ", desc: "Google Maps nhúng" },
                                { key: "rsvp", icon: "✅", name: "RSVP", desc: "Xác nhận tham dự" },
                                { key: "wishes", icon: "💬", name: "Lời chúc", desc: "Tường lời chúc từ khách" },
                                { key: "qr", icon: "🎁", name: "QR Mừng cưới", desc: "QR chuyển khoản" },
                                { key: "photos", icon: "📸", name: "Album ảnh", desc: "Slider ảnh cưới" },
                                { key: "phone", icon: "📞", name: "Gọi điện", desc: "Nút gọi trực tiếp" },
                            ].map((w) => {
                                const isOn = widgetToggles[w.key] ?? false;
                                return (
                                    <div key={w.key}
                                        onClick={() => setWidgetToggles(prev => ({ ...prev, [w.key]: !prev[w.key] }))}
                                        style={{
                                            padding: "10px 14px", borderRadius: 10,
                                            border: `1px solid ${isOn ? "#86efac" : "#e5e7eb"}`,
                                            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                                            background: isOn ? "#f0fdf4" : "#fff",
                                            transition: "all 0.2s",
                                        }}>
                                        <span style={{ fontSize: 20, opacity: isOn ? 1 : 0.4 }}>{w.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 12, fontWeight: 600, color: isOn ? "#166534" : "#6b7280", margin: 0 }}>{w.name}</p>
                                            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{w.desc}</p>
                                        </div>
                                        <div style={{
                                            width: 36, height: 20, borderRadius: 10,
                                            background: isOn ? "#22c55e" : "#d1d5db",
                                            position: "relative", transition: "background 0.2s",
                                        }}>
                                            <div style={{
                                                width: 16, height: 16, borderRadius: "50%", background: "#fff",
                                                position: "absolute", top: 2,
                                                left: isOn ? 18 : 2,
                                                transition: "left 0.2s",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── TEMPLATES TAB ── */}
                    {activeTab === "templates" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Đổi mẫu thiệp</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                                {Object.entries(TEMPLATE_THEMES).map(([slug, t]) => (
                                    <div key={slug} style={{
                                        borderRadius: 10, overflow: "hidden", border: templateSlug === slug ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                                        cursor: "pointer", transition: "all 0.15s",
                                    }}>
                                        <div style={{ height: 80, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{t.pattern}</div>
                                        <div style={{ padding: "6px 8px" }}>
                                            <p style={{ fontSize: 10, fontWeight: 600, color: "#1f2937", margin: 0 }}>{slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── EFFECTS TAB ── */}
                    {activeTab === "effects" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Hiệu ứng toàn trang</p>
                            {[
                                { icon: "💕", name: "Tim rơi", desc: "Hearts falling animation" },
                                { icon: "🍃", name: "Lá bay", desc: "Floating leaves" },
                                { icon: "❄", name: "Tuyết rơi", desc: "Snow particles" },
                                { icon: "🎊", name: "Confetti", desc: "Celebration particles" },
                                { icon: "✨", name: "Lấp lánh", desc: "Sparkle particles" },
                            ].map((fx, i) => (
                                <div key={i} style={{
                                    padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb",
                                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                                    background: "#fff", transition: "all 0.15s",
                                }}>
                                    <span style={{ fontSize: 20 }}>{fx.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: "#1f2937", margin: 0 }}>{fx.name}</p>
                                        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{fx.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bank Info (shown in text tab) */}
                {activeTab === "text" && (
                    <div style={{ padding: "12px 20px", borderTop: "1px solid #f3f4f6" }}>
                        <PanelSection title="Quà tặng (QR)">
                            <FormField label="Ngân hàng" placeholder="Vietcombank" value={formData.bankName} onChange={v => handleChange("bankName", v)} />
                            <FormField label="Số tài khoản" placeholder="0123456789" value={formData.bankAccount} onChange={v => handleChange("bankAccount", v)} />
                            <FormField label="Chủ tài khoản" placeholder="Nguyễn Văn A" value={formData.bankOwner} onChange={v => handleChange("bankOwner", v)} />
                        </PanelSection>
                    </div>
                )}
            </div>

            {/* ═══ CENTER: CANVAS + TOP TOOLBAR ═══ */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* ── TOP TOOLBAR (matches CineLove) ── */}
                <div style={{
                    height: 52, background: "#fff", borderBottom: "1px solid #e8e8ec",
                    display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0,
                }}>
                    {/* Logo */}
                    <Link href="/dashboard/projects" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", marginRight: 8 }}>
                        <Heart size={20} fill="#ff6b9d" color="#ff6b9d" />
                        <span style={{ fontSize: 15, fontWeight: 700, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LoveStory</span>
                    </Link>

                    {/* Undo / Redo */}
                    <div style={{ display: "flex", gap: 4 }}>
                        <button style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}><Undo2 size={16} /></button>
                        <button style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}><Redo2 size={16} /></button>
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Auto-save status */}
                    <span style={{ fontSize: 11, color: autoSaved ? "#10b981" : "#9ca3af" }}>
                        {autoSaved ? "✓ Tự động lưu: Bật" : "○ Chưa lưu"}
                    </span>

                    {/* Save message */}
                    {saveMsg && <span style={{ fontSize: 11, color: saveMsg.includes("Lỗi") || saveMsg.includes("Giới hạn") || saveMsg.includes("Nhập") ? "#dc2626" : "#059669", fontWeight: 500 }}>{saveMsg}</span>}

                    {/* Preview */}
                    <button onClick={() => window.open(`/i/preview`, "_blank")} style={{
                        padding: "6px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                        background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 4,
                    }}>
                        <Eye size={14} /> Xem trước
                    </button>

                    {/* Publish */}
                    <button onClick={() => handleSave(true)} disabled={saving} style={{
                        padding: "6px 20px", borderRadius: 8, border: "none",
                        background: saving ? "#9ca3af" : "linear-gradient(135deg, #10b981, #059669)",
                        color: "#fff", fontSize: 12, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: 4,
                    }}>
                        <Rocket size={14} /> Xuất bản
                    </button>
                </div>

                {/* ── CANVAS AREA ── */}
                <div style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#e8ecf1", position: "relative", overflow: "auto",
                }}>
                    {/* Phone Preview */}
                    <div style={{
                        width: 375 * (zoom / 100), minHeight: 667 * (zoom / 100),
                        borderRadius: 32 * (zoom / 100), background: "#fff",
                        overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        transform: `scale(1)`, transition: "width 0.2s, min-height 0.2s",
                        position: "relative", flexShrink: 0,
                    }}>
                        {/* Phone Notch */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 44 * (zoom / 100), background: "#000", borderRadius: `${32 * (zoom / 100)}px ${32 * (zoom / 100)}px 0 0`, zIndex: 5 }}>
                            <div style={{ width: 120 * (zoom / 100), height: 24 * (zoom / 100), background: "#000", borderRadius: `0 0 ${16 * (zoom / 100)}px ${16 * (zoom / 100)}px`, margin: "0 auto" }} />
                        </div>

                        {/* Template Content */}
                        <div style={{ paddingTop: 44 * (zoom / 100), minHeight: "100%", overflow: "auto", background: theme.bg }}>
                            <div style={{ textAlign: "center", padding: `${40 * (zoom / 100)}px ${24 * (zoom / 100)}px` }}>
                                {/* Decorative top */}
                                <p style={{ fontSize: 16 * (zoom / 100), opacity: 0.3, margin: "0 0 8px", letterSpacing: 8 }}>{theme.decorTop}</p>

                                <p style={{ fontSize: 11 * (zoom / 100), color: theme.accent, letterSpacing: 3, margin: "0 0 12px", fontWeight: 600 }}>SAVE THE DATE</p>

                                <h2 style={{ fontSize: 28 * (zoom / 100), fontWeight: 300, color: theme.nameColor, margin: "0 0 4px", fontStyle: "italic", fontFamily: theme.font }}>
                                    {formData.groomName || "Chú rể"}
                                </h2>
                                <p style={{ fontSize: 18 * (zoom / 100), color: theme.accent, margin: "0 0 4px" }}>&</p>
                                <h2 style={{ fontSize: 28 * (zoom / 100), fontWeight: 300, color: theme.nameColor, margin: "0 0 20px", fontStyle: "italic", fontFamily: theme.font }}>
                                    {formData.brideName || "Cô dâu"}
                                </h2>

                                {/* Parent names */}
                                {(formData.groomParentNames || formData.brideParentNames) && (
                                    <div style={{ marginBottom: 20, opacity: 0.7 }}>
                                        {formData.groomParentNames && <p style={{ fontSize: 10 * (zoom / 100), color: theme.textColor, margin: "0 0 2px" }}>Con trai: {formData.groomParentNames}</p>}
                                        {formData.brideParentNames && <p style={{ fontSize: 10 * (zoom / 100), color: theme.textColor, margin: 0 }}>Con gái: {formData.brideParentNames}</p>}
                                    </div>
                                )}

                                {/* Date */}
                                <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 12, padding: `${12 * (zoom / 100)}px`, margin: "0 auto 20px", maxWidth: 200 * (zoom / 100), backdropFilter: "blur(10px)" }}>
                                    <p style={{ fontSize: 13 * (zoom / 100), color: theme.textColor, margin: 0, fontWeight: 500 }}>
                                        {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Chọn ngày cưới"}
                                    </p>
                                    {formData.weddingTime && <p style={{ fontSize: 11 * (zoom / 100), color: theme.accent, margin: "4px 0 0" }}>⏰ {formData.weddingTime}</p>}
                                </div>

                                {/* Venue */}
                                {(formData.venueName || formData.venueAddress) && (
                                    <div style={{ marginBottom: 20 }}>
                                        <p style={{ fontSize: 13 * (zoom / 100), fontWeight: 500, color: theme.textColor, margin: "0 0 4px" }}>📍 {formData.venueName || "Địa điểm"}</p>
                                        <p style={{ fontSize: 11 * (zoom / 100), color: theme.textColor, margin: 0, opacity: 0.7 }}>{formData.venueAddress}</p>
                                    </div>
                                )}

                                {/* Story */}
                                {formData.story && (
                                    <div style={{ background: "rgba(255,255,255,0.4)", borderRadius: 12, padding: `${16 * (zoom / 100)}px`, margin: "0 0 20px", textAlign: "left", backdropFilter: "blur(10px)" }}>
                                        <p style={{ fontSize: 10 * (zoom / 100), color: theme.accent, letterSpacing: 2, margin: "0 0 6px", fontWeight: 600 }}>OUR STORY</p>
                                        <p style={{ fontSize: 12 * (zoom / 100), color: theme.textColor, lineHeight: 1.7, margin: 0 }}>{formData.story}</p>
                                    </div>
                                )}

                                {/* Message */}
                                {formData.message && (
                                    <p style={{ fontSize: 12 * (zoom / 100), color: theme.textColor, lineHeight: 1.6, fontStyle: "italic", opacity: 0.8 }}>&ldquo;{formData.message}&rdquo;</p>
                                )}

                                {/* Photos */}
                                {formData.photos.filter(p => p.trim()).length > 0 ? (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, margin: "16px 0" }}>
                                        {formData.photos.filter(p => p.trim()).slice(0, 4).map((url, i) => (
                                            <div key={i} style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "1" }}>
                                                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Photo placeholder grid (shown when no photos uploaded) */
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, margin: "16px 0" }}>
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} style={{
                                                borderRadius: 8, aspectRatio: "1",
                                                background: `linear-gradient(135deg, ${theme.accent}15, ${theme.accent}08)`,
                                                border: `1px dashed ${theme.accent}40`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <span style={{ fontSize: 20 * (zoom / 100), opacity: 0.3 }}>📷</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Countdown Widget (always shown as preview) */}
                                {widgetToggles.countdown && (
                                    <div style={{
                                        background: "rgba(255,255,255,0.6)", borderRadius: 12,
                                        padding: `${14 * (zoom / 100)}px`, margin: "0 0 16px",
                                        backdropFilter: "blur(10px)",
                                    }}>
                                        <p style={{ fontSize: 10 * (zoom / 100), color: theme.accent, letterSpacing: 2, margin: "0 0 8px", fontWeight: 600 }}>ĐẾM NGƯỢC</p>
                                        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                                            {[
                                                { val: "88", label: "Ngày" },
                                                { val: "12", label: "Giờ" },
                                                { val: "34", label: "Phút" },
                                                { val: "56", label: "Giây" },
                                            ].map((d, i) => (
                                                <div key={i} style={{ textAlign: "center" }}>
                                                    <div style={{
                                                        width: 42 * (zoom / 100), height: 42 * (zoom / 100),
                                                        borderRadius: 8, background: theme.accent + "18",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 16 * (zoom / 100), fontWeight: 700, color: theme.accent,
                                                    }}>{d.val}</div>
                                                    <p style={{ fontSize: 8 * (zoom / 100), color: theme.textColor, margin: "4px 0 0", opacity: 0.6 }}>{d.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* RSVP Widget */}
                                {widgetToggles.rsvp && (
                                    <div style={{
                                        background: "rgba(255,255,255,0.6)", borderRadius: 12,
                                        padding: `${14 * (zoom / 100)}px`, margin: "0 0 16px",
                                        backdropFilter: "blur(10px)",
                                    }}>
                                        <p style={{ fontSize: 10 * (zoom / 100), color: theme.accent, letterSpacing: 2, margin: "0 0 8px", fontWeight: 600 }}>XÁC NHẬN THAM DỰ</p>
                                        <div style={{
                                            padding: `${8 * (zoom / 100)}px ${12 * (zoom / 100)}px`,
                                            borderRadius: 8, border: `1px solid ${theme.accent}30`,
                                            fontSize: 11 * (zoom / 100), color: theme.textColor,
                                            opacity: 0.5, textAlign: "left",
                                        }}>Nhập họ tên...</div>
                                        <button style={{
                                            marginTop: 8, width: "100%",
                                            padding: `${8 * (zoom / 100)}px`, borderRadius: 8,
                                            border: "none", background: theme.accent,
                                            color: "#fff", fontSize: 11 * (zoom / 100), fontWeight: 600,
                                            cursor: "default", opacity: 0.8,
                                        }}>Gửi xác nhận</button>
                                    </div>
                                )}

                                {/* QR Bank Widget */}
                                {widgetToggles.qr && (formData.bankName || formData.bankAccount) && (
                                    <div style={{
                                        background: "rgba(255,255,255,0.6)", borderRadius: 12,
                                        padding: `${14 * (zoom / 100)}px`, margin: "0 0 16px",
                                        backdropFilter: "blur(10px)",
                                    }}>
                                        <p style={{ fontSize: 10 * (zoom / 100), color: theme.accent, letterSpacing: 2, margin: "0 0 8px", fontWeight: 600 }}>MỪNG CƯỚI</p>
                                        <div style={{
                                            width: 80 * (zoom / 100), height: 80 * (zoom / 100),
                                            background: theme.accent + "10", borderRadius: 8,
                                            margin: "0 auto 8px", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            border: `1px dashed ${theme.accent}40`,
                                        }}>
                                            <span style={{ fontSize: 24 * (zoom / 100), opacity: 0.4 }}>📱</span>
                                        </div>
                                        <p style={{ fontSize: 10 * (zoom / 100), color: theme.textColor, margin: 0, opacity: 0.6 }}>
                                            {formData.bankName} • {formData.bankAccount}
                                        </p>
                                    </div>
                                )}

                                {/* Decorative bottom */}
                                <p style={{ fontSize: 16 * (zoom / 100), opacity: 0.3, margin: "20px 0 0", letterSpacing: 8 }}>{theme.decorBottom}</p>
                            </div>
                        </div>
                    </div>

                    {/* Zoom Controls */}
                    <div style={{
                        position: "absolute", bottom: 20, right: 20,
                        display: "flex", alignItems: "center", gap: 4,
                        background: "#fff", borderRadius: 10, padding: "4px 8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}>
                        <button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "#f3f4f6", cursor: "pointer", fontSize: 14 }}>−</button>
                        <span style={{ fontSize: 11, color: "#6b7280", minWidth: 36, textAlign: "center" }}>{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "#f3f4f6", cursor: "pointer", fontSize: 14 }}>+</button>
                    </div>
                </div>
            </div>

            {/* ═══ RIGHT: PROPERTY PANEL (280px) ═══ */}
            <div style={{
                width: 280, background: "#fff", borderLeft: "1px solid #e8e8ec",
                display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0,
                overflow: "auto",
            }}>
                {/* Customization Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: 0, display: "flex", alignItems: "center", gap: 6 }}><Sparkles size={16} /> Tuỳ chỉnh</h3>
                </div>

                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Category */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>Danh mục *</label>
                        <select style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, color: "#1f2937", outline: "none", cursor: "pointer" }}>
                            <option>Thiệp cưới</option>
                            <option>Sinh nhật</option>
                            <option>Sự kiện</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>Trạng thái</label>
                        <select style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, color: "#1f2937", outline: "none", cursor: "pointer" }}>
                            <option>Công khai</option>
                            <option>Nháp</option>
                        </select>
                    </div>

                    {/* Template info */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>Mẫu thiệp</label>
                        <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{templateSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>

                    {/* Preview Card */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <label style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>Bản xem trước</label>
                            <button style={{ fontSize: 11, color: "#4f46e5", border: "none", background: "none", cursor: "pointer", fontWeight: 500 }}>✏️ Chỉnh sửa</button>
                        </div>
                        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", aspectRatio: "9/16", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: 8, color: theme.accent, margin: 0 }}>SAVE THE DATE</p>
                                <p style={{ fontSize: 12, color: theme.nameColor, fontStyle: "italic", margin: "4px 0 0", fontFamily: theme.font }}>{formData.groomName || "Chú rể"} & {formData.brideName || "Cô dâu"}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: 10, color: "#9ca3af", margin: "6px 0 0" }}>Đây là cách trang của bạn sẽ hiển thị khi được chia sẻ trên Facebook, Zalo, Messenger hoặc các mạng xã hội khác.</p>
                    </div>

                    {/* Premium features */}
                    <div style={{ background: "#eef2ff", borderRadius: 12, padding: "14px 16px", border: "1px solid #c7d2fe" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>Tính năng nâng cao</span>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#4f46e5", color: "#fff", fontWeight: 700 }}>Basic+</span>
                        </div>
                        <p style={{ fontSize: 11, color: "#4b5563", margin: "0 0 8px" }}>Nâng cấp lên gói Basic+ để sử dụng:</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                            {["Xoá watermark", "Nhạc nền tuỳ chọn", "Font chữ Premium", "Hiệu ứng đặc biệt"].map((f, i) => (
                                <li key={i} style={{ fontSize: 11, color: "#4b5563", display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4f46e5", flexShrink: 0 }} /> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Reusable Components ─── */
function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" }}>{title}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
        </div>
    );
}

function FormField({ label, placeholder, value, onChange, type = "text" }: {
    label: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string;
}) {
    return (
        <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>{label}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, color: "#1f2937", background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
        </div>
    );
}

export default function EditorNewPage() {
    return (
        <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 18, color: "#6b7280" }}>Đang tải editor...</div>}>
            <EditorContent />
        </Suspense>
    );
}
