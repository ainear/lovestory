"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
    Type, Image as ImageIcon, Palette, Music, Sparkles,
    Undo2, Redo2, Eye, Rocket, Save, LayoutTemplate,
    Grid, Smile, Plus, Download, Home, Share2, Layers,
} from "lucide-react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { CraftText } from "./craft/CraftText";
import { CraftImage } from "./craft/CraftImage";
import { CraftContainer, RootContainer } from "./craft/CraftContainer";
import { CraftCountdown } from "./craft/CraftCountdown";
import { CraftCalendar } from "./craft/CraftCalendar";
import { CraftMap } from "./craft/CraftMap";
import { CraftRSVP } from "./craft/CraftRSVP";
import { createBrowserClient } from "@supabase/ssr";

/* ── Tab config (same as old VisualEditor) ── */
const TABS = [
    { key: "text", icon: <Type size={18} />, label: "Văn bản" },
    { key: "image", icon: <ImageIcon size={18} />, label: "Hình ảnh" },
    { key: "bg", icon: <Palette size={18} />, label: "Nền" },
    { key: "plugins", icon: <Grid size={18} />, label: "Tiện ích" },
    { key: "effects", icon: <Sparkles size={18} />, label: "Hiệu ứng" },
    { key: "music", icon: <Music size={18} />, label: "Âm nhạc" },
];

/* ── Text presets ── */
const TEXT_PRESETS = [
    { label: "Tiêu đề chính", fontSize: 32, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "normal" },
    { label: "Tiêu đề phụ", fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic" },
    { label: "Ngày tháng", fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal" },
    { label: "Địa điểm", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal" },
    { label: "Ghi chú", fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal", fontStyle: "italic" },
];

/* ── Background presets ── */
const BG_PRESETS = [
    { label: "Hoa hồng", value: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)" },
    { label: "Đêm tím", value: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)" },
    { label: "Vàng hoàng hôn", value: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)" },
    { label: "Anh đào", value: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)" },
    { label: "Trắng tinh", value: "#ffffff" },
    { label: "Đen sang trọng", value: "linear-gradient(180deg, #111827 0%, #1f2937 100%)" },
];

/* ── Music presets ── */
const MUSIC_PRESETS = [
    { id: "m1", label: "Beautiful Wedding", emoji: "🎵", url: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3" },
    { id: "m2", label: "Canon in D", emoji: "🎻", url: "https://cdn.pixabay.com/audio/2024/03/18/audio_4f0fbf77d6.mp3" },
    { id: "m3", label: "Romantic Piano", emoji: "🎹", url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3" },
    { id: "m4", label: "Wedding March", emoji: "💍", url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3" },
    { id: "m5", label: "Chill Acoustic", emoji: "🎸", url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3" },
    { id: "m6", label: "Love Strings", emoji: "🎼", url: "https://cdn.pixabay.com/audio/2024/09/10/audio_3d1e42b71b.mp3" },
];

/* ── Particle effect presets (CineLove parity: 7 effects) ── */
const PARTICLE_PRESETS = [
    { id: "none", label: "Không hiệu ứng", emoji: "🚫" },
    { id: "hearts", label: "Trái tim", emoji: "❤️" },
    { id: "flowers", label: "Hoa anh đào", emoji: "🌸" },
    { id: "snow", label: "Tuyết rơi", emoji: "❄️" },
    { id: "stars", label: "Ngôi sao", emoji: "⭐" },
    { id: "confetti", label: "Confetti", emoji: "🎉" },
    { id: "butterflies", label: "Bướm", emoji: "🦋" },
    { id: "mixed", label: "Hỗn hợp", emoji: "✨" },
];

/* ═══════════════════════════════════════════════
   CraftVisualEditor — Main Editor Component
   Uses craft.js for drag-drop canvas
   ═══════════════════════════════════════════════ */

interface CraftVisualEditorProps {
    projectId: string;
    initialCanvasJson?: string | null;
    projectSlug: string;
    onPublish?: () => void;
}

export function CraftVisualEditor({ projectId, initialCanvasJson, projectSlug, onPublish }: CraftVisualEditorProps) {
    return (
        <Editor
            resolver={{ CraftText, CraftImage, CraftContainer, RootContainer, CraftCountdown, CraftCalendar, CraftMap, CraftRSVP }}
            enabled={true}
        >
            <CraftEditorInner
                projectId={projectId}
                initialCanvasJson={initialCanvasJson}
                projectSlug={projectSlug}
                onPublish={onPublish}
            />
        </Editor>
    );
}

/* ── Inner component with useEditor access ── */
function CraftEditorInner({ projectId, initialCanvasJson, projectSlug, onPublish }: CraftVisualEditorProps) {
    const { actions, query, selected, canUndo, canRedo } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let sel: { id: string; name: string; settings: any; isDeletable: boolean } | undefined;
        if (currentNodeId) {
            sel = {
                id: currentNodeId,
                name: state.nodes[currentNodeId]?.data?.name || "Unknown",
                settings: (state.nodes[currentNodeId] as any)?.related?.settings || null,
                isDeletable: query.node(currentNodeId).isDeletable(),
            };
        }
        return {
            selected: sel,
            canUndo: query.history.canUndo(),
            canRedo: query.history.canRedo(),
        };
    });

    const [activeTab, setActiveTab] = useState("text");
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "done">("idle");
    const [musicUrl, setMusicUrl] = useState("");
    const [musicName, setMusicName] = useState("");
    const [particleEffect, setParticleEffect] = useState("none");
    const [background, setBackground] = useState("linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)");
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Parse initial background from saved canvas_json
    useEffect(() => {
        if (initialCanvasJson) {
            try {
                const parsed = JSON.parse(initialCanvasJson);
                if (parsed.canvas?.bg) setBackground(parsed.canvas.bg);
                if (parsed.meta?.musicUrl) { setMusicUrl(parsed.meta.musicUrl); setMusicName(parsed.meta.musicName || ""); }
                if (parsed.effects?.particleEffect) setParticleEffect(parsed.effects.particleEffect);
            } catch { /* ignore */ }
        }
    }, [initialCanvasJson]);

    // ── Save ──
    const save = useCallback(async () => {
        setSaveStatus("saving");
        const craftJson = query.serialize();
        const canvasJson = JSON.stringify({
            version: 2,
            engine: "craftjs",
            canvas: { width: 390, height: 5000, bg: background },
            craftState: craftJson,
            meta: { musicUrl, musicName },
            effects: { particleEffect },
        });
        try {
            await supabase.from("projects").update({
                canvas_json: canvasJson,
                music_url: musicUrl || null,
                music_name: musicName || null,
                updated_at: new Date().toISOString(),
            }).eq("id", projectId);
            setSaveStatus("saved");
        } catch {
            setSaveStatus("unsaved");
        }
    }, [query, background, projectId, supabase, musicUrl, musicName]);

    // ── Publish ──
    const handlePublish = useCallback(async () => {
        if (publishStatus === "publishing") return;
        setPublishStatus("publishing");
        const craftJson = query.serialize();
        const canvasJson = JSON.stringify({
            version: 2,
            engine: "craftjs",
            canvas: { width: 390, height: 5000, bg: background },
            craftState: craftJson,
            meta: { musicUrl, musicName },
            effects: { particleEffect },
        });
        try {
            await supabase.from("projects").update({
                canvas_json: canvasJson,
                music_url: musicUrl || null,
                music_name: musicName || null,
                status: "published",
                updated_at: new Date().toISOString(),
            }).eq("id", projectId);
            setSaveStatus("saved");
            setPublishStatus("done");
            onPublish?.();
        } catch {
            setPublishStatus("idle");
            alert("Xuất bản thất bại. Vui lòng thử lại.");
        }
    }, [query, background, projectId, supabase, musicUrl, musicName, onPublish, publishStatus]);

    // Auto-save on changes (debounced)
    const triggerAutosave = useCallback(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        setSaveStatus("unsaved");
        saveTimer.current = setTimeout(save, 3000);
    }, [save]);

    // ── Add Text via craft.js ──
    const addCraftText = useCallback((preset: typeof TEXT_PRESETS[0]) => {
        const tree = query.parseReactElement(
            <CraftText
                text={preset.label}
                fontSize={preset.fontSize}
                fontFamily={preset.fontFamily}
                fontWeight={preset.fontWeight}
                fontStyle={preset.fontStyle}
                color={background.includes("0f0825") || background.includes("111827") ? "#ffffff" : "#1f2937"}
                textAlign="center"
                lineHeight={1.5}
                letterSpacing={0}
                opacity={1}
            />
        ).toNodeTree();
        // Add to ROOT canvas node
        const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
        if (rootNodeId) {
            actions.addNodeTree(tree, rootNodeId);
        }
        triggerAutosave();
    }, [query, actions, background, triggerAutosave]);

    // ── Add Image via upload ──
    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                const tree = query.parseReactElement(
                    <CraftImage
                        src={data.url}
                        objectFit="cover"
                        borderRadius={12}
                        borderWidth={2}
                        borderColor="#f9a8d4"
                        opacity={1}
                        shadow={false}
                    />
                ).toNodeTree();
                const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
                if (rootNodeId) {
                    actions.addNodeTree(tree, rootNodeId);
                }
                triggerAutosave();
            }
        } catch {
            alert("Upload ảnh thất bại.");
        }
        e.target.value = "";
    }, [query, actions, projectId, triggerAutosave]);

    return (
        <div style={{
            display: "flex", flexDirection: "column", height: "100vh",
            background: "#f0f0f0", fontFamily: "'Inter', -apple-system, sans-serif",
            overflow: "hidden",
        }}>
            {/* ══ Top Bar ══ */}
            <div style={{
                height: 52, display: "flex", alignItems: "center",
                padding: "0 16px", gap: 10,
                background: "#fff", borderBottom: "1px solid #e5e7eb",
                flexShrink: 0, zIndex: 100,
            }}>
                <a href="/dashboard" title="Về trang chủ" style={{
                    display: "flex", alignItems: "center", gap: 6,
                    textDecoration: "none",
                }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#ff6b9d" }}>💌</span>
                    <Home size={16} style={{ color: "#9ca3af" }} />
                </a>
                <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, flex: 1 }}>Visual Editor</span>

                {/* Undo/Redo — craft.js history */}
                <button onClick={() => actions.history.undo()} disabled={!canUndo} title="Hoàn tác (⌘Z)" style={topBtnStyle(!canUndo)}>
                    <Undo2 size={16} />
                </button>
                <button onClick={() => actions.history.redo()} disabled={!canRedo} title="Làm lại (⌘⇧Z)" style={topBtnStyle(!canRedo)}>
                    <Redo2 size={16} />
                </button>

                {/* Save status */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 12,
                    color: saveStatus === "saved" ? "#10b981" : saveStatus === "saving" ? "#f59e0b" : "#ef4444",
                }}>
                    <Save size={13} />
                    {saveStatus === "saved" ? "Đã lưu" : saveStatus === "saving" ? "Đang lưu..." : "Chưa lưu"}
                </div>

                {/* Manual Save */}
                <button onClick={save} title="Lưu ngay (⌘S)" style={{
                    ...topBtnStyle(false), padding: "6px 12px", fontSize: 12,
                }}>
                    💾 Lưu
                </button>

                {/* Preview */}
                <a href={`/i/${projectSlug}`} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 10,
                    border: "1px solid #e5e7eb", background: "#fff",
                    color: "#374151", fontSize: 13, fontWeight: 500,
                    textDecoration: "none",
                }}>
                    <Eye size={14} /> Xem trước
                </a>

                {/* Share */}
                <button
                    onClick={async () => {
                        const url = `${window.location.origin}/i/${projectSlug}`;
                        try {
                            if (navigator.share) await navigator.share({ title: "Thiệp mời cưới", url });
                            else { await navigator.clipboard.writeText(url); alert("✅ Đã sao chép link mời!"); }
                        } catch { /* user cancelled */ }
                    }}
                    style={{ ...topBtnStyle(false), padding: "6px 12px", fontSize: 12 }}
                >
                    <Share2 size={14} /> Chia sẻ
                </button>

                {/* Publish */}
                <button
                    onClick={handlePublish}
                    disabled={publishStatus === "publishing"}
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", borderRadius: 10, border: "none",
                        background: publishStatus === "publishing" ? "#d1d5db" : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff", fontSize: 13, fontWeight: 700,
                        cursor: publishStatus === "publishing" ? "not-allowed" : "pointer",
                        boxShadow: publishStatus === "publishing" ? "none" : "0 2px 8px rgba(255,107,157,0.35)",
                    }}
                >
                    <Rocket size={14} />
                    {publishStatus === "publishing" ? "Đang xuất bản..." : "Xuất bản"}
                </button>
            </div>

            {/* ══ Main Area ══ */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* ── Left Icon Column ── */}
                <div style={{
                    width: 52, background: "#fff",
                    borderRight: "1px solid #f0f0f0",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    paddingTop: 8, gap: 2, flexShrink: 0, overflowY: "auto",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.04)", zIndex: 2,
                }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(activeTab === tab.key ? "" : tab.key)} title={tab.label} style={{
                            width: 44, padding: "8px 2px", border: "none", borderRadius: 10,
                            background: activeTab === tab.key ? "#fff0f5" : "transparent",
                            color: activeTab === tab.key ? "#ff6b9d" : "#6b7280",
                            cursor: "pointer", fontSize: 9, fontWeight: activeTab === tab.key ? 700 : 400,
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                            transition: "all 0.15s",
                        }}>
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* ── Expandable Left Panel ── */}
                {activeTab !== "" && (
                    <div style={{
                        width: 200, background: "#fff",
                        borderRight: "1px solid #e5e7eb",
                        display: "flex", flexDirection: "column",
                        overflow: "hidden", flexShrink: 0,
                        animation: "slideIn 0.15s ease",
                    }}>
                        <style>{`@keyframes slideIn { from { transform: translateX(-10px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
                        <div style={{ padding: "12px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: 0, textTransform: "uppercase", letterSpacing: 0.8 }}>
                                {TABS.find(t => t.key === activeTab)?.label}
                            </p>
                            <button onClick={() => setActiveTab("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16, padding: 2 }}>×</button>
                        </div>

                        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                            {/* TEXT TAB */}
                            {activeTab === "text" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={panelLabelStyle}>Thêm văn bản</p>
                                    {TEXT_PRESETS.map(preset => (
                                        <button key={preset.label}
                                            onClick={() => addCraftText(preset)}
                                            style={{
                                                padding: "10px 14px", borderRadius: 10,
                                                border: "1px solid #e5e7eb", background: "#fff",
                                                cursor: "pointer", textAlign: "left",
                                                fontFamily: preset.fontFamily,
                                                fontSize: Math.min(preset.fontSize * 0.65, 16),
                                            }}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* IMAGE TAB */}
                            {activeTab === "image" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <p style={panelLabelStyle}>Thêm hình ảnh</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            padding: 16, borderRadius: 12,
                                            border: "2px dashed #e5e7eb", background: "#fafafa",
                                            cursor: "pointer", display: "flex",
                                            flexDirection: "column", alignItems: "center", gap: 8,
                                        }}
                                    >
                                        <ImageIcon size={24} color="#9ca3af" />
                                        <span style={{ fontSize: 13, color: "#6b7280" }}>Upload ảnh</span>
                                        <span style={{ fontSize: 11, color: "#9ca3af" }}>PNG, JPG, WebP</span>
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                                </div>
                            )}

                            {/* BG TAB */}
                            {activeTab === "bg" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={panelLabelStyle}>Nền nhanh</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                        {BG_PRESETS.map(bg => (
                                            <button key={bg.label}
                                                onClick={() => {
                                                    setBackground(bg.value);
                                                    // Update root container background
                                                    const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
                                                    if (rootNodeId) {
                                                        actions.setProp(rootNodeId, (props: { background: string }) => {
                                                            props.background = bg.value;
                                                        });
                                                    }
                                                    triggerAutosave();
                                                }}
                                                style={{
                                                    height: 44, borderRadius: 8, border: "2px solid #e5e7eb",
                                                    background: bg.value, cursor: "pointer",
                                                    position: "relative", overflow: "hidden",
                                                }}
                                            >
                                                <span style={{
                                                    position: "absolute", bottom: 2, left: 0, right: 0,
                                                    fontSize: 8, fontWeight: 600, textAlign: "center",
                                                    color: bg.value.includes("0f0825") || bg.value.includes("111827") ? "#fff" : "#374151",
                                                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                                                }}>
                                                    {bg.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    {/* Custom BG upload */}
                                    <p style={panelLabelStyle}>Ảnh nền tùy chỉnh</p>
                                    <button
                                        onClick={() => {
                                            const input = document.createElement("input");
                                            input.type = "file";
                                            input.accept = "image/*";
                                            input.onchange = async (ev) => {
                                                const file = (ev.target as HTMLInputElement).files?.[0];
                                                if (!file) return;
                                                const formData = new FormData();
                                                formData.append("file", file);
                                                formData.append("projectId", projectId);
                                                try {
                                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                    const data = await res.json();
                                                    if (data.url) {
                                                        const bgCss = `url(${data.url}) center/cover no-repeat`;
                                                        setBackground(bgCss);
                                                        const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
                                                        if (rootNodeId) {
                                                            actions.setProp(rootNodeId, (props: { background: string }) => {
                                                                props.background = bgCss;
                                                            });
                                                        }
                                                        triggerAutosave();
                                                    }
                                                } catch {
                                                    alert("Upload nền thất bại.");
                                                }
                                            };
                                            input.click();
                                        }}
                                        style={{
                                            padding: 12, borderRadius: 10,
                                            border: "2px dashed #e5e7eb", background: "#fafafa",
                                            cursor: "pointer", fontSize: 12, color: "#6b7280",
                                            display: "flex", alignItems: "center", gap: 8,
                                        }}
                                    >
                                        📁 Upload ảnh nền
                                    </button>
                                </div>
                            )}

                            {/* PLUGINS TAB — Widget add buttons */}
                            {activeTab === "plugins" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={panelLabelStyle}>Thêm tiện ích</p>
                                    {[
                                        { label: "⏱️ Đếm ngược", desc: "Live countdown đến ngày cưới", component: <CraftCountdown targetDate="2026-05-28" label="Đếm ngược đến ngày cưới" color="#831843" labelColor="#9f1239" background="rgba(255,255,255,0.6)" borderRadius={16} fontSize={28} /> },
                                        { label: "📅 Lịch cưới", desc: "Lịch tháng đánh dấu ngày cưới", component: <CraftCalendar targetDate="2026-05-28" accentColor="#ff6b9d" textColor="#374151" background="rgba(255,255,255,0.7)" borderRadius={16} /> },
                                        { label: "📍 Bản đồ", desc: "Google Maps + nút chỉ đường", component: <CraftMap address="123 Nguyễn Huệ, Quận 1, TP.HCM" venueName="Diamond Palace" lat={10.7769} lng={106.7009} zoom={15} height={200} borderRadius={12} accentColor="#ff6b9d" /> },
                                        { label: "💌 RSVP", desc: "Form xác nhận tham dự", component: <CraftRSVP title="Xác nhận tham dự" subtitle="Vui lòng xác nhận sự hiện diện của bạn" accentColor="#ff6b9d" textColor="#374151" background="rgba(255,255,255,0.7)" borderRadius={16} /> },
                                    ].map(widget => (
                                        <button
                                            key={widget.label}
                                            onClick={() => {
                                                const tree = query.parseReactElement(widget.component).toNodeTree();
                                                const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
                                                if (rootNodeId) {
                                                    actions.addNodeTree(tree, rootNodeId);
                                                }
                                                triggerAutosave();
                                            }}
                                            style={{
                                                padding: "12px 14px", borderRadius: 12,
                                                border: "1px solid #e5e7eb", background: "#fff",
                                                cursor: "pointer", textAlign: "left",
                                                display: "flex", flexDirection: "column", gap: 4,
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{widget.label}</span>
                                            <span style={{ fontSize: 11, color: "#9ca3af" }}>{widget.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* EFFECTS TAB — Particle picker (CineLove parity) */}
                            {activeTab === "effects" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={panelLabelStyle}>Hiệu ứng rơi</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                        {PARTICLE_PRESETS.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => { setParticleEffect(p.id); triggerAutosave(); }}
                                                style={{
                                                    padding: "10px 8px", borderRadius: 10,
                                                    border: `2px solid ${particleEffect === p.id ? "#ff6b9d" : "#e5e7eb"}`,
                                                    background: particleEffect === p.id ? "#fdf2f8" : "#fff",
                                                    cursor: "pointer", fontSize: 12,
                                                    display: "flex", flexDirection: "column",
                                                    alignItems: "center", gap: 4,
                                                    transition: "all 0.15s",
                                                }}
                                            >
                                                <span style={{ fontSize: 20 }}>{p.emoji}</span>
                                                <span style={{ fontSize: 10, color: "#374151" }}>{p.label}</span>
                                                {particleEffect === p.id && <span style={{ fontSize: 10, color: "#ff6b9d" }}>✔</span>}
                                            </button>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
                                        Hiệu ứng hiển thị trên thiệp khi khách mở link mời
                                    </p>
                                </div>
                            )}

                            {/* MUSIC TAB */}
                            {activeTab === "music" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={panelLabelStyle}>Nhạc nền</p>
                                    {musicUrl && (
                                        <div style={{
                                            padding: "10px 14px", borderRadius: 12,
                                            background: "#fdf2f8", border: "1px solid #ff6b9d",
                                            display: "flex", alignItems: "center", gap: 8,
                                        }}>
                                            <span style={{ fontSize: 16 }}>🎵</span>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1 }}>
                                                {musicName || "Đã chọn nhạc"}
                                            </span>
                                            <button onClick={() => { setMusicUrl(""); setMusicName(""); triggerAutosave(); }}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>×</button>
                                        </div>
                                    )}
                                    {MUSIC_PRESETS.map(m => (
                                        <button key={m.id}
                                            onClick={() => {
                                                setMusicUrl(m.url);
                                                setMusicName(m.label);
                                                triggerAutosave();
                                            }}
                                            style={{
                                                padding: "8px 12px", borderRadius: 10,
                                                border: `1px solid ${musicUrl === m.url ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: musicUrl === m.url ? "#fdf2f8" : "#fff",
                                                cursor: "pointer", fontSize: 12, color: "#374151",
                                                display: "flex", alignItems: "center", gap: 8,
                                                textAlign: "left",
                                            }}
                                        >
                                            <span>{m.emoji}</span>
                                            <span style={{ flex: 1 }}>{m.label}</span>
                                            {musicUrl === m.url && <span style={{ color: "#ff6b9d" }}>✔</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ══ Canvas Area — craft.js Frame ══ */}
                <div style={{
                    flex: 1, overflow: "auto",
                    display: "flex", justifyContent: "center",
                    padding: "24px 0",
                    background: "#e5e7eb",
                }}>
                    <div style={{
                        width: 390,
                        minHeight: 5000,
                        boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
                        borderRadius: 8,
                        overflow: "hidden",
                    }}>
                        <Frame>
                            <Element
                                canvas
                                is={RootContainer}
                                background={background}
                            >
                                {/* Hero Section */}
                                <Element canvas is={CraftContainer} background="transparent" padding={20} minHeight={400} gap={12} flexDirection="column" alignItems="center" justifyContent="center">
                                    <CraftText text="Lễ Thành Hôn" fontSize={22} fontFamily="'Cormorant Garamond', serif" fontWeight="normal" fontStyle="italic" color="#9f1239" textAlign="center" lineHeight={1.4} letterSpacing={2} opacity={0.9} />
                                </Element>

                                {/* Names Section */}
                                <Element canvas is={CraftContainer} background="transparent" padding={16} minHeight={200} gap={4} flexDirection="column" alignItems="center" justifyContent="center">
                                    <CraftText text="Tên Chú Rể" fontSize={36} fontFamily="'Dancing Script', cursive" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.2} letterSpacing={0} opacity={1} />
                                    <CraftText text="&" fontSize={24} fontFamily="'Playfair Display', serif" fontWeight="normal" fontStyle="italic" color="#f472b6" textAlign="center" lineHeight={1.4} letterSpacing={0} opacity={0.8} />
                                    <CraftText text="Tên Cô Dâu" fontSize={36} fontFamily="'Dancing Script', cursive" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.2} letterSpacing={0} opacity={1} />
                                </Element>

                                {/* Photo Section */}
                                <Element canvas is={CraftContainer} background="transparent" padding={16} minHeight={280} gap={12} flexDirection="row" alignItems="center" justifyContent="center">
                                    <CraftImage src="/placeholder-groom.png" objectFit="cover" borderRadius={14} borderWidth={2} borderColor="#f9a8d4" opacity={1} shadow={false} />
                                    <CraftImage src="/placeholder-bride.png" objectFit="cover" borderRadius={14} borderWidth={2} borderColor="#f9a8d4" opacity={1} shadow={false} />
                                </Element>

                                {/* Date Section */}
                                <Element canvas is={CraftContainer} background="transparent" padding={20} minHeight={150} gap={8} flexDirection="column" alignItems="center" justifyContent="center">
                                    <CraftText text="Chủ Nhật, 28 · 05 · 2026" fontSize={26} fontFamily="'Cormorant Garamond', serif" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.3} letterSpacing={1} opacity={1} />
                                    <CraftText text="Lúc 10:00 sáng" fontSize={16} fontFamily="'Lora', serif" fontWeight="normal" fontStyle="italic" color="#9f1239" textAlign="center" lineHeight={1.4} letterSpacing={0} opacity={0.85} />
                                </Element>

                                {/* Family Section */}
                                <Element canvas is={CraftContainer} background="rgba(255,255,255,0.5)" padding={20} minHeight={200} gap={8} flexDirection="column" alignItems="center" justifyContent="center">
                                    <CraftText text="Nhà Trai" fontSize={18} fontFamily="'Dancing Script', cursive" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.4} letterSpacing={0} opacity={1} />
                                    <CraftText text="Ông: Nguyễn Văn A & Bà: Trần Thị B" fontSize={14} fontFamily="'Inter', sans-serif" fontWeight="normal" fontStyle="normal" color="#6b7280" textAlign="center" lineHeight={1.5} letterSpacing={0} opacity={0.9} />
                                    <CraftText text="Nhà Gái" fontSize={18} fontFamily="'Dancing Script', cursive" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.4} letterSpacing={0} opacity={1} />
                                    <CraftText text="Ông: Lê Văn C & Bà: Phạm Thị D" fontSize={14} fontFamily="'Inter', sans-serif" fontWeight="normal" fontStyle="normal" color="#6b7280" textAlign="center" lineHeight={1.5} letterSpacing={0} opacity={0.9} />
                                </Element>

                                {/* Venue Section */}
                                <Element canvas is={CraftContainer} background="transparent" padding={20} minHeight={150} gap={8} flexDirection="column" alignItems="center" justifyContent="center">
                                    <CraftText text="Địa Điểm" fontSize={20} fontFamily="'Playfair Display', serif" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.3} letterSpacing={1} opacity={1} />
                                    <CraftText text="Nhà Hàng ABC, 123 Đường XYZ, TP.HCM" fontSize={14} fontFamily="'Inter', sans-serif" fontWeight="normal" fontStyle="normal" color="#6b7280" textAlign="center" lineHeight={1.5} letterSpacing={0} opacity={0.9} />
                                </Element>

                                {/* Gallery Section */}
                                <Element canvas is={CraftContainer} background="transparent" padding={16} minHeight={300} gap={8} flexDirection="row" alignItems="center" justifyContent="center">
                                    <CraftImage src="/placeholder-couple.png" objectFit="cover" borderRadius={10} borderWidth={0} borderColor="transparent" opacity={1} shadow={true} />
                                    <CraftImage src="/placeholder-couple.png" objectFit="cover" borderRadius={10} borderWidth={0} borderColor="transparent" opacity={1} shadow={true} />
                                </Element>

                                {/* Quote Section */}
                                <Element canvas is={CraftContainer} background="transparent" padding={24} minHeight={120} gap={8} flexDirection="column" alignItems="center" justifyContent="center">
                                    <CraftText text={`"Yêu nhau không phải là ngồi nhìn nhau, mà là cùng nhìn về một hướng."`} fontSize={16} fontFamily="'Lora', serif" fontWeight="normal" fontStyle="italic" color="#9f1239" textAlign="center" lineHeight={1.6} letterSpacing={0} opacity={0.85} />
                                </Element>
                            </Element>
                        </Frame>
                    </div>
                </div>

                {/* ══ Right Settings Panel ══ */}
                <div style={{
                    width: 280, background: "#fff",
                    borderLeft: "1px solid #e5e7eb",
                    overflowY: "auto", padding: 16, flexShrink: 0,
                }}>
                    <h3 style={{
                        fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 12px",
                        textTransform: "uppercase", letterSpacing: 1,
                    }}>
                        🎨 Tùy chỉnh
                    </h3>

                    {selected ? (
                        <div>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 12px" }}>
                                <span style={{
                                    background: "#3b82f6", color: "#fff", fontSize: 10,
                                    padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                                }}>
                                    {selected.name}
                                </span>
                            </p>

                            {/* Component-specific settings (auto from craft.js related) */}
                            {selected.settings && React.createElement(selected.settings)}

                            {/* Delete button */}
                            {selected.isDeletable && (
                                <button
                                    onClick={() => {
                                        actions.delete(selected.id);
                                        triggerAutosave();
                                    }}
                                    style={{
                                        width: "100%", padding: "8px 14px", borderRadius: 8,
                                        border: "1px solid #fca5a5", background: "#fef2f2",
                                        color: "#dc2626", fontSize: 12, fontWeight: 600,
                                        cursor: "pointer", marginTop: 16,
                                    }}
                                >
                                    🗑️ Xóa phần tử
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", paddingTop: 40 }}>
                            <p style={{ fontSize: 32, margin: "0 0 8px" }}>👆</p>
                            <p style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>
                                Click vào phần tử trên canvas để chỉnh sửa
                            </p>
                            <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 4 }}>
                                Kéo thả, thêm text/image, thay đổi nền từ sidebar
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Shared styles ── */
const panelLabelStyle: React.CSSProperties = {
    fontSize: 11, color: "#6b7280", margin: "0 0 8px",
    fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
};

function topBtnStyle(disabled: boolean): React.CSSProperties {
    return {
        width: 32, height: 32, border: "1px solid #e5e7eb",
        borderRadius: 8, background: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: disabled ? "#d1d5db" : "#374151",
    };
}
