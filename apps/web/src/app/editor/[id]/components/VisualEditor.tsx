"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Type, Image as ImageIcon, Palette, Music, Sparkles, Undo2, Redo2, Eye, Rocket, Save, LayoutTemplate, Grid } from "lucide-react";
import { Canvas } from "./Canvas";
import { useCanvasReducer, type CanvasElement } from "./useCanvasReducer";
import { createBrowserClient } from "@supabase/ssr";

// ── Sidebar tab map ──
const TABS = [
    { key: "text", icon: <Type size={20} />, label: "Văn bản" },
    { key: "image", icon: <ImageIcon size={20} />, label: "Hình ảnh" },
    { key: "bg", icon: <Palette size={20} />, label: "Nền" },
    { key: "effects", icon: <Sparkles size={20} />, label: "Hiệu ứng" },
    { key: "music", icon: <Music size={20} />, label: "Âm nhạc" },
    { key: "templates", icon: <LayoutTemplate size={20} />, label: "Mẫu" },
];

// Text preset styles
const TEXT_PRESETS = [
    { label: "Tiêu đề chính", text: "Tuấn Minh & Mai Lan", fontSize: 32, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "italic" as const },
    { label: "Tiêu đề phụ", text: "Trân trọng kính mời", fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const },
    { label: "Ngày tháng", text: "28 · 05 · 2026", fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const },
    { label: "Địa điểm", text: "Diamond Palace, TP.HCM", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const },
    { label: "Ghi chú", text: "Sự hiện diện của Quý Khách là niềm hân hạnh của gia đình chúng tôi", fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const },
    { label: "Hashtag", text: "#TuanMinhMaiLan2026", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const },
];

const BG_PRESETS = [
    { label: "Hoa hồng", value: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)" },
    { label: "Đêm tím", value: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)" },
    { label: "Vàng hoàng hôn", value: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)" },
    { label: "Anh đào", value: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)" },
    { label: "Trắng tinh", value: "#ffffff" },
    { label: "Đen sang trọng", value: "linear-gradient(180deg, #111827 0%, #1f2937 100%)" },
    { label: "Xanh biển", value: "linear-gradient(180deg, #ecfeff 0%, #cffafe 40%, #a5f3fc 100%)" },
    { label: "Xanh lá", value: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%)" },
];

const ZOOM_LEVELS = [50, 75, 100];

interface VisualEditorProps {
    projectId: string;
    initialCanvasJson?: string | null;
    projectSlug: string;
    onPublish?: () => void;
}

export function VisualEditor({ projectId, initialCanvasJson, projectSlug, onPublish }: VisualEditorProps) {
    const [activeTab, setActiveTab] = useState("text");
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Parse initial canvas
    const initial = (() => {
        if (!initialCanvasJson) return {};
        try {
            const parsed = JSON.parse(initialCanvasJson);
            return {
                elements: parsed.elements || [],
                background: parsed.canvas?.bg || "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
                zoom: 75,
            };
        } catch { return {}; }
    })();

    const { state, dispatch, addText, addImage } = useCanvasReducer(initial);

    // Auto-save
    const save = useCallback(async () => {
        setSaveStatus("saving");
        const canvasJson = JSON.stringify({
            version: 1,
            canvas: { width: state.width, height: state.height, bg: state.background },
            elements: state.elements,
        });
        try {
            await supabase.from("projects").update({
                canvas_json: canvasJson,
                updated_at: new Date().toISOString(),
            }).eq("id", projectId);
            setSaveStatus("saved");
        } catch {
            setSaveStatus("unsaved");
        }
    }, [state.elements, state.background, state.width, state.height, projectId, supabase]);

    // Debounced auto-save on elements change
    useEffect(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        setSaveStatus("unsaved");
        saveTimer.current = setTimeout(save, 2000);
        return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.elements, state.background]);

    // Image upload handler
    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) addImage(data.url, 20, 200);
        } catch {
            alert("Upload ảnh thất bại. Vui lòng thử lại.");
        }
        e.target.value = "";
    }, [addImage, projectId]);

    const selectedEl = state.elements.find(e => e.id === state.selectedId) ?? null;

    return (
        <div style={{
            display: "flex", flexDirection: "column", height: "100vh",
            background: "#f0f0f0", fontFamily: "'Inter', -apple-system, sans-serif",
            overflow: "hidden",
        }}>
            {/* ── Top Bar ── */}
            <div style={{
                height: 52, display: "flex", alignItems: "center",
                padding: "0 16px", gap: 12,
                background: "#fff", borderBottom: "1px solid #e5e7eb",
                flexShrink: 0, zIndex: 100,
            }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#ff6b9d", marginRight: 8 }}>💌</span>
                <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, flex: 1 }}>Visual Editor</span>

                {/* Undo / Redo */}
                {[
                    { icon: <Undo2 size={16} />, action: () => dispatch({ type: "UNDO" }), disabled: state.past.length === 0, title: "Hoàn tác (⌘Z)" },
                    { icon: <Redo2 size={16} />, action: () => dispatch({ type: "REDO" }), disabled: state.future.length === 0, title: "Làm lại (⌘⇧Z)" },
                ].map((btn, i) => (
                    <button key={i} onClick={btn.action} disabled={btn.disabled} title={btn.title} style={{
                        width: 32, height: 32, border: "1px solid #e5e7eb",
                        borderRadius: 8, background: "#fff", cursor: btn.disabled ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: btn.disabled ? "#d1d5db" : "#374151",
                    }}>
                        {btn.icon}
                    </button>
                ))}

                {/* Zoom */}
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {ZOOM_LEVELS.map(z => (
                        <button key={z} onClick={() => dispatch({ type: "SET_ZOOM", zoom: z })} style={{
                            padding: "4px 10px", borderRadius: 6, border: "none",
                            background: state.zoom === z ? "#f3f4f6" : "transparent",
                            fontSize: 12, fontWeight: 500, color: state.zoom === z ? "#374151" : "#9ca3af",
                            cursor: "pointer",
                        }}>
                            {z}%
                        </button>
                    ))}
                </div>

                {/* Save status */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 12, color: saveStatus === "saved" ? "#10b981" : saveStatus === "saving" ? "#f59e0b" : "#ef4444",
                }}>
                    <Save size={13} />
                    {saveStatus === "saved" ? "Đã lưu" : saveStatus === "saving" ? "Đang lưu..." : "Chưa lưu"}
                </div>

                {/* Preview */}
                <a href={`/i/${projectSlug}`} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 10,
                    border: "1px solid #e5e7eb", background: "#fff",
                    color: "#374151", fontSize: 13, fontWeight: 500,
                    textDecoration: "none", cursor: "pointer",
                }}>
                    <Eye size={14} /> Xem trước
                </a>

                {/* Publish */}
                <button onClick={onPublish} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 10, border: "none",
                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(255,107,157,0.35)",
                }}>
                    <Rocket size={14} /> Xuất bản
                </button>
            </div>

            {/* ── Main Area ── */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* ── Left Sidebar ── */}
                <div style={{
                    width: 280, background: "#fff",
                    borderRight: "1px solid #e5e7eb",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden", flexShrink: 0,
                }}>
                    {/* Tab icons */}
                    <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", flexShrink: 0, overflowX: "auto" }}>
                        {TABS.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                flex: 1, padding: "10px 4px",
                                border: "none", background: "none",
                                borderBottom: activeTab === tab.key ? "2px solid #ff6b9d" : "2px solid transparent",
                                color: activeTab === tab.key ? "#ff6b9d" : "#9ca3af",
                                cursor: "pointer", fontSize: 9,
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                                transition: "all 0.15s",
                            }}>
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>

                        {/* TEXT TAB */}
                        {activeTab === "text" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 8px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                                    Thêm văn bản
                                </p>
                                {TEXT_PRESETS.map((preset) => (
                                    <button key={preset.label}
                                        onClick={() => {
                                            dispatch({
                                                type: "ADD_ELEMENT",
                                                element: {
                                                    id: `el-${Date.now()}`,
                                                    type: "text",
                                                    x: 20, y: 120 + state.elements.length * 40,
                                                    width: 350, height: 60,
                                                    rotation: 0, opacity: 1, zIndex: state.elements.length + 1, locked: false,
                                                    props: {
                                                        text: preset.text,
                                                        fontSize: preset.fontSize,
                                                        fontFamily: preset.fontFamily,
                                                        fontWeight: preset.fontWeight,
                                                        fontStyle: preset.fontStyle,
                                                        color: "#831843",
                                                        textAlign: "center",
                                                        lineHeight: 1.4,
                                                    },
                                                },
                                            });
                                        }}
                                        style={{
                                            border: "1px dashed #e5e7eb",
                                            borderRadius: 10,
                                            padding: "12px 14px",
                                            background: "#fafafa",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "all 0.15s",
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#fdf2f8")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "#fafafa")}
                                    >
                                        <p style={{ fontSize: preset.fontSize > 20 ? 16 : 13, fontFamily: preset.fontFamily, fontWeight: preset.fontWeight, fontStyle: preset.fontStyle, color: "#1f2937", margin: "0 0 2px" }}>
                                            {preset.label}
                                        </p>
                                        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{preset.text.slice(0, 30)}...</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* IMAGE TAB */}
                        {activeTab === "image" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                                    Thêm hình ảnh
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        padding: "14px", borderRadius: 12,
                                        border: "2px dashed #c084fc",
                                        background: "#faf5ff", cursor: "pointer",
                                        fontSize: 13, color: "#7c3aed", fontWeight: 600,
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    }}
                                >
                                    <ImageIcon size={18} /> Tải ảnh lên
                                </button>

                                {/* Add placeholder slot */}
                                <button
                                    onClick={() => dispatch({
                                        type: "ADD_ELEMENT",
                                        element: {
                                            id: `el-${Date.now()}`,
                                            type: "image",
                                            x: 20, y: 200 + state.elements.length * 20,
                                            width: 350, height: 280,
                                            rotation: 0, opacity: 1, zIndex: state.elements.length + 1, locked: false,
                                            props: { src: "", objectFit: "cover", borderRadius: 12, opacity: 1 },
                                        },
                                    })}
                                    style={{
                                        padding: "10px", borderRadius: 10,
                                        border: "1px solid #e5e7eb",
                                        background: "#fff", cursor: "pointer",
                                        fontSize: 12, color: "#6b7280",
                                        display: "flex", alignItems: "center", gap: 8,
                                    }}
                                >
                                    <Grid size={14} /> Thêm ô ảnh trống
                                </button>
                            </div>
                        )}

                        {/* BACKGROUND TAB */}
                        {activeTab === "bg" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 8px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                                    Màu nền
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                    {BG_PRESETS.map(bg => (
                                        <button
                                            key={bg.label}
                                            onClick={() => dispatch({ type: "SET_BACKGROUND", background: bg.value })}
                                            style={{
                                                borderRadius: 10,
                                                border: state.background === bg.value ? "2px solid #ff6b9d" : "2px solid transparent",
                                                cursor: "pointer", padding: 0, overflow: "hidden",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            <div style={{
                                                height: 60, width: "100%", background: bg.value,
                                            }} />
                                            <p style={{ fontSize: 10, padding: "4px 0 4px", margin: 0, textAlign: "center", color: "#374151", background: "#fff" }}>
                                                {bg.label}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* EFFECTS TAB */}
                        {activeTab === "effects" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 8px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                                    Hiệu ứng bay
                                </p>
                                {["🌸 Cánh hoa", "💕 Trái tim", "✨ Bokeh", "❄️ Tuyết rơi", "🚫 Tắt hiệu ứng"].map(fx => (
                                    <div key={fx} style={{
                                        padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb",
                                        cursor: "pointer", fontSize: 13, color: "#374151",
                                        display: "flex", alignItems: "center", gap: 8,
                                    }}>
                                        {fx}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* MUSIC TAB */}
                        {activeTab === "music" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                                    Nhạc nền
                                </p>
                                <input
                                    placeholder="YouTube URL hoặc link nhạc..."
                                    style={{
                                        padding: "10px 12px", borderRadius: 10,
                                        border: "1px solid #e5e7eb", fontSize: 13,
                                        outline: "none", width: "100%", boxSizing: "border-box",
                                    }}
                                />
                                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                                    Dán link YouTube hoặc MP3 để thêm nhạc nền cho thiệp
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Canvas Area ── */}
                <div style={{
                    flex: 1, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    overflow: "auto", padding: 32,
                    background: "#e5e7eb",
                }}>
                    <div style={{ position: "relative" }}>
                        <Canvas
                            width={state.width}
                            height={state.height}
                            background={state.background}
                            elements={state.elements}
                            selectedId={state.selectedId}
                            zoom={state.zoom}
                            dispatch={dispatch}
                        />
                    </div>
                </div>

                {/* ── Right Panel (Properties) ── */}
                <div style={{
                    width: 260, background: "#fff",
                    borderLeft: "1px solid #e5e7eb",
                    flexShrink: 0, overflowY: "auto",
                    padding: 16,
                }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 16px", letterSpacing: 0.5 }}>
                        ✏️ Tuỳ chỉnh
                    </p>

                    {!selectedEl && (
                        <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                            <p style={{ fontSize: 32, marginBottom: 8 }}>👆</p>
                            <p style={{ fontSize: 13 }}>Chọn một phần tử trên thiệp để chỉnh sửa</p>
                        </div>
                    )}

                    {selectedEl?.type === "text" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {/* Color */}
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Màu chữ</label>
                                <input type="color" value={selectedEl.props.color ?? "#831843"}
                                    onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, color: e.target.value } } })}
                                    style={{ width: "100%", height: 36, borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer", padding: 2 }}
                                />
                            </div>
                            {/* Font size */}
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                                    Cỡ chữ: {selectedEl.props.fontSize}px
                                </label>
                                <input type="range" min={8} max={80}
                                    value={selectedEl.props.fontSize ?? 24}
                                    onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, fontSize: Number(e.target.value) } } })}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            {/* Font family */}
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Font chữ</label>
                                <select
                                    value={selectedEl.props.fontFamily ?? "'Dancing Script', cursive"}
                                    onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, fontFamily: e.target.value } } })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
                                >
                                    <option value="'Dancing Script', cursive">Dancing Script (Script)</option>
                                    <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                                    <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                                    <option value="'Lora', serif">Lora</option>
                                    <option value="'Inter', sans-serif">Inter (Sans-serif)</option>
                                </select>
                            </div>
                            {/* Align */}
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Căn chỉnh</label>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {(["left", "center", "right"] as const).map(align => (
                                        <button key={align}
                                            onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, textAlign: align } } })}
                                            style={{
                                                flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 15,
                                                border: "1px solid " + (selectedEl.props.textAlign === align ? "#ff6b9d" : "#e5e7eb"),
                                                background: selectedEl.props.textAlign === align ? "#fdf2f8" : "#fff",
                                                cursor: "pointer",
                                            }}>
                                            {align === "left" ? "⬅" : align === "center" ? "⬆" : "➡"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Bold / Italic */}
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, fontWeight: selectedEl.props.fontWeight === "bold" ? "normal" : "bold" } } })}
                                    style={{
                                        flex: 1, padding: "8px 0", borderRadius: 8,
                                        border: "1px solid " + (selectedEl.props.fontWeight === "bold" ? "#ff6b9d" : "#e5e7eb"),
                                        background: selectedEl.props.fontWeight === "bold" ? "#fdf2f8" : "#fff",
                                        fontWeight: "bold", cursor: "pointer", fontSize: 14,
                                    }}>
                                    B
                                </button>
                                <button
                                    onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, fontStyle: selectedEl.props.fontStyle === "italic" ? "normal" : "italic" } } })}
                                    style={{
                                        flex: 1, padding: "8px 0", borderRadius: 8,
                                        border: "1px solid " + (selectedEl.props.fontStyle === "italic" ? "#ff6b9d" : "#e5e7eb"),
                                        background: selectedEl.props.fontStyle === "italic" ? "#fdf2f8" : "#fff",
                                        fontStyle: "italic", cursor: "pointer", fontSize: 14,
                                    }}>
                                    I
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedEl?.type === "image" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {/* Opacity */}
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                                    Độ trong suốt: {Math.round((selectedEl.props.opacity ?? 1) * 100)}%
                                </label>
                                <input type="range" min={0} max={100}
                                    value={Math.round((selectedEl.props.opacity ?? 1) * 100)}
                                    onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, opacity: Number(e.target.value) / 100 } } })}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            {/* Border radius */}
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                                    Bo góc: {selectedEl.props.borderRadius ?? 12}px
                                </label>
                                <input type="range" min={0} max={60}
                                    value={selectedEl.props.borderRadius ?? 12}
                                    onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, borderRadius: Number(e.target.value) } } })}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            {/* Object fit */}
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Kiểu hiển thị</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {(["cover", "contain"] as const).map(fit => (
                                        <button key={fit}
                                            onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...selectedEl.props, objectFit: fit } } })}
                                            style={{
                                                flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 12,
                                                border: "1px solid " + (selectedEl.props.objectFit === fit ? "#ff6b9d" : "#e5e7eb"),
                                                background: selectedEl.props.objectFit === fit ? "#fdf2f8" : "#fff",
                                                cursor: "pointer",
                                            }}>
                                            {fit === "cover" ? "Cắt đầy" : "Vừa khung"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Replace image button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb",
                                    background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                }}>
                                <ImageIcon size={14} /> Đổi ảnh
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
