"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Type, Image as ImageIcon, Palette, Music, Sparkles, Undo2, Redo2, Eye, Rocket, Save, LayoutTemplate, Grid, Smile, Plus, ZoomIn, ZoomOut, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";
import { Canvas } from "./Canvas";
import { useCanvasReducer, type CanvasElement, type ParticleEffect } from "./useCanvasReducer";
import { createBrowserClient } from "@supabase/ssr";
import { StockPanel } from "./sidebar/StockPanel";
import { StickerPanel } from "./sidebar/StickerPanel";
import { TEMPLATE_PRESETS, TEMPLATE_CATEGORIES } from "./sidebar/templatePresets";
import { QuickImageBar } from "./QuickImageBar";
import { RightPanel } from "./RightPanel";

// ── Sidebar tab map ──
const TABS = [
    { key: "text", icon: <Type size={18} />, label: "Văn bản" },
    { key: "image", icon: <ImageIcon size={18} />, label: "Hình ảnh" },
    { key: "stock", icon: <LayoutTemplate size={18} />, label: "Stock" },
    { key: "sticker", icon: <Smile size={18} />, label: "Sticker" },
    { key: "widgets", icon: <Grid size={18} />, label: "Tiện ích" },
    { key: "bg", icon: <Palette size={18} />, label: "Nền" },
    { key: "effects", icon: <Sparkles size={18} />, label: "Hiệu ứng" },
    { key: "music", icon: <Music size={18} />, label: "Âm nhạc" },
    { key: "templates", icon: <LayoutTemplate size={18} />, label: "Mẫu" },
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

// ── Music presets (8 wedding songs, royalty-free via Pixabay) ──
const MUSIC_PRESETS = [
    { id: "m1", label: "Beautiful Wedding", emoji: "🎵", genre: "Pop nhẹ nhàng", url: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3" },
    { id: "m2", label: "Canon in D", emoji: "🎻", genre: "Cổ điển", url: "https://cdn.pixabay.com/audio/2024/03/18/audio_4f0fbf77d6.mp3" },
    { id: "m3", label: "Romantic Piano", emoji: "🎹", genre: "Piano lãng mạn", url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3" },
    { id: "m4", label: "Wedding March", emoji: "💍", genre: "Hành khúc", url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3" },
    { id: "m5", label: "Chill Acoustic", emoji: "🎸", genre: "Acoustic", url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3" },
    { id: "m6", label: "Love Strings", emoji: "🎼", genre: "Dàn dây", url: "https://cdn.pixabay.com/audio/2024/09/10/audio_3d1e42b71b.mp3" },
    { id: "m7", label: "Cinematic Romance", emoji: "🎬", genre: "Cinematic", url: "https://cdn.pixabay.com/audio/2024/02/15/audio_8b56c8c4fb.mp3" },
    { id: "m8", label: "Sweet Jazz", emoji: "🎷", genre: "Jazz nhẹ", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
];

// ── Template presets for in-editor switch ──
const EDITOR_TEMPLATES = [
    { slug: "rose-garden", label: "Hoa Hồng", emoji: "🌹", bg: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)" },
    { slug: "midnight-romance", label: "Đêm Tím", emoji: "🌙", bg: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)" },
    { slug: "golden-hour", label: "Hoàng Hôn", emoji: "🌅", bg: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)" },
    { slug: "cherry-blossom", label: "Anh Đào", emoji: "🌸", bg: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)" },
    { slug: "ocean-breeze", label: "Biển Xanh", emoji: "🌊", bg: "linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 100%)" },
];

/** Small inline audio preview button — isolated, doesn't affect canvas music state */
function MusicPreviewBtn({ url }: { url: string }) {
    const [playing, setPlaying] = useState(false);
    const ref = useRef<HTMLAudioElement | null>(null);
    const toggle = () => {
        if (!playing) {
            if (ref.current) { ref.current.pause(); ref.current = null; }
            const a = new Audio(url);
            a.volume = 0.4;
            a.onended = () => setPlaying(false);
            a.play();
            ref.current = a;
            setPlaying(true);
        } else {
            ref.current?.pause();
            ref.current = null;
            setPlaying(false);
        }
    };
    return (
        <button onClick={toggle} title={playing ? "Dừng" : "Nghe thử"} style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            border: "none", cursor: "pointer", fontSize: 12,
            background: playing ? "#ff6b9d" : "#f3f4f6",
            color: playing ? "#fff" : "#6b7280",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
        }}>{playing ? "⏸" : "▶"}</button>
    );
}

interface VisualEditorProps {
    projectId: string;
    initialCanvasJson?: string | null;
    projectSlug: string;
    onPublish?: () => void;
}

export function VisualEditor({ projectId, initialCanvasJson, projectSlug, onPublish }: VisualEditorProps) {
    const [activeTab, setActiveTab] = useState("text");
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "done">("idle");
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceImageInputRef = useRef<HTMLInputElement>(null); // U4 fix: separate ref for replacing selected image
    // P1: Music state
    const [musicUrl, setMusicUrl] = useState("");
    const [musicName, setMusicName] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [templateCat, setTemplateCat] = useState("all");
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Parse initial canvas
    const initial = (() => {
        if (!initialCanvasJson) return {};
        try {
            const parsed = JSON.parse(initialCanvasJson);
            // Load music from canvas meta
            if (parsed.meta?.musicUrl) { setMusicUrl(parsed.meta.musicUrl); setMusicName(parsed.meta.musicName || ""); }
            return {
                elements: parsed.elements || [],
                background: parsed.canvas?.bg || "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
                zoom: 75,
            };
        } catch { return {}; }
    })();

    const { state, dispatch, addText, addImage } = useCanvasReducer(initial);

    // Auto-save — include music in canvas meta
    const save = useCallback(async () => {
        setSaveStatus("saving");
        const canvasJson = JSON.stringify({
            version: 1,
            canvas: { width: state.width, height: state.height, bg: state.background },
            elements: state.elements,
            meta: { musicUrl, musicName },
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
    }, [state.elements, state.background, state.width, state.height, projectId, supabase, musicUrl, musicName]);

    // P0 FIX: Publish — save canvas_json AND set status='published' before redirect
    const handlePublish = useCallback(async () => {
        if (publishStatus === "publishing") return;
        setPublishStatus("publishing");
        const canvasJson = JSON.stringify({
            version: 1,
            canvas: { width: state.width, height: state.height, bg: state.background },
            elements: state.elements,
            meta: { musicUrl, musicName },
        });
        try {
            await supabase.from("projects").update({
                canvas_json: canvasJson,
                music_url: musicUrl || null,
                music_name: musicName || null,
                status: "published",          // ← THE CRITICAL FIX
                updated_at: new Date().toISOString(),
            }).eq("id", projectId);
            setSaveStatus("saved");
            setPublishStatus("done");
            onPublish?.();
        } catch {
            setPublishStatus("idle");
            alert("Xuất bản thất bại. Vui lòng thử lại.");
        }
    }, [state.elements, state.background, state.width, state.height, projectId, supabase, musicUrl, musicName, onPublish, publishStatus]);

    // Debounced auto-save on elements/music change
    useEffect(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        setSaveStatus("unsaved");
        saveTimer.current = setTimeout(save, 2000);
        return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.elements, state.background, musicUrl]);

    // P1: Music play/stop
    const handlePlayMusic = useCallback(() => {
        if (!musicUrl) return;
        if (audioRef.current) {
            if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
            else { audioRef.current.play().catch(() => { }); setIsPlaying(true); }
        } else {
            audioRef.current = new Audio(musicUrl);
            audioRef.current.loop = true;
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    }, [musicUrl, isPlaying]);

    const handleSetMusic = useCallback((url: string, name: string) => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        setIsPlaying(false);
        setMusicUrl(url);
        setMusicName(name);
    }, []);

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

                {/* Publish — P0 fix: now saves status='published' before redirect */}
                <button
                    onClick={handlePublish}
                    disabled={publishStatus === "publishing"}
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", borderRadius: 10, border: "none",
                        background: publishStatus === "publishing"
                            ? "#d1d5db"
                            : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff", fontSize: 13, fontWeight: 700,
                        cursor: publishStatus === "publishing" ? "not-allowed" : "pointer",
                        boxShadow: publishStatus === "publishing" ? "none" : "0 2px 8px rgba(255,107,157,0.35)",
                        transition: "all 0.2s",
                    }}
                >
                    <Rocket size={14} />
                    {publishStatus === "publishing" ? "Đang xuất bản..." : "Xuất bản"}
                </button>
            </div>

            {/* ── Main Area ── */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* ── Vertical Icon Column (60px) — Canva-style ── */}
                <div style={{
                    width: 64, background: "#fff",
                    borderRight: "1px solid #f0f0f0",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    paddingTop: 8, gap: 2, flexShrink: 0, overflowY: "auto",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
                    zIndex: 2,
                }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(activeTab === tab.key ? "" : tab.key)} title={tab.label} style={{
                            width: 52, padding: "10px 4px",
                            border: "none",
                            borderRadius: 10,
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

                {/* ── Expandable Panel (240px) — slides in when tab active ── */}
                {activeTab !== "" && (
                    <div style={{
                        width: 248, background: "#fff",
                        borderRight: "1px solid #e5e7eb",
                        display: "flex", flexDirection: "column",
                        overflow: "hidden", flexShrink: 0,
                        animation: "slideIn 0.15s ease",
                    }}>
                        <style>{`@keyframes slideIn { from { transform: translateX(-10px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>

                        {/* Panel header */}
                        <div style={{ padding: "12px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: 0, textTransform: "uppercase", letterSpacing: 0.8 }}>
                                {TABS.find(t => t.key === activeTab)?.label}
                            </p>
                            <button onClick={() => setActiveTab("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16, padding: 2 }}>×</button>
                        </div>

                        {/* Panel content */}
                        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>

                            {/* TEXT TAB */}
                            {activeTab === "text" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 8px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Thêm văn bản</p>
                                    {TEXT_PRESETS.map((preset) => (
                                        <button key={preset.label}
                                            onClick={() => {
                                                dispatch({
                                                    type: "ADD_ELEMENT",
                                                    element: {
                                                        id: `el-${Date.now()}`,
                                                        sectionId: state.sections[0]?.id || "section-1",
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
                                                            color: "#1f2937",
                                                            textAlign: "center" as const,
                                                        },
                                                    },
                                                });
                                            }}
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
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Thêm hình ảnh</p>
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
                                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                const json = await res.json() as { url?: string };
                                                if (json.url) addImage(json.url);
                                            } catch { alert("Upload thất bại, vui lòng thử lại."); }
                                        }}
                                    />
                                </div>
                            )}

                            {/* STOCK TAB */}
                            {activeTab === "stock" && (
                                <StockPanel
                                    onAddImage={(url) => dispatch({
                                        type: "ADD_ELEMENT",
                                        element: {
                                            id: `el-${Date.now()}`,
                                            sectionId: state.sections[0]?.id || "section-1",
                                            type: "image",
                                            x: 20, y: 80,
                                            width: 200, height: 200,
                                            rotation: 0, opacity: 1,
                                            zIndex: state.elements.length + 1, locked: false,
                                            props: { src: url, objectFit: "cover" },
                                        },
                                    })}
                                />
                            )}

                            {/* STICKER TAB */}
                            {activeTab === "sticker" && (
                                <StickerPanel
                                    onAddSticker={(el) => dispatch({
                                        type: "ADD_ELEMENT",
                                        element: {
                                            ...el,
                                            id: `el-${Date.now()}`,
                                            sectionId: state.sections[0]?.id || "section-1",
                                            zIndex: state.elements.length + 1,
                                        },
                                    })}
                                />
                            )}

                            {/* WIDGETS TAB — Cinelove-style Tiện ích */}
                            {activeTab === "widgets" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Tiện ích</p>
                                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 8px" }}>Click để thêm vào thiệp</p>

                                    {([
                                        {
                                            type: "widget", emoji: "📅", label: "Lịch ngày cưới", desc: "Hiển thị lịch tháng với highlight ngày cưới",
                                            props: { widgetType: "calendar", label: "Lịch cưới", targetDate: "2026-05-28" }, w: 220, h: 220
                                        },
                                        {
                                            type: "widget", emoji: "⏰", label: "Đếm ngược ngày cưới", desc: "Hiển thị thời gian đến ngày cưới",
                                            props: { widgetType: "countdown", label: "ĐẾM NGƯỢC NGÀY CƯỚI", targetDate: "2026-05-28" }, w: 350, h: 100
                                        },
                                        {
                                            type: "widget", emoji: "🗺️", label: "Bản đồ", desc: "Gắn link Google Maps địa điểm",
                                            props: { widgetType: "map", mapUrl: "https://maps.google.com", label: "Vị trí tiệc cưới", venueName: "Diamond Palace", venueAddress: "123 Nguyễn Huệ, Q.1, TP.HCM" }, w: 350, h: 200
                                        },
                                        {
                                            type: "widget", emoji: "📱", label: "Mã QR", desc: "QR code link thiệp để chia sẻ",
                                            props: { widgetType: "qr", label: "Quét để xem thiệp" }, w: 160, h: 180
                                        },
                                        {
                                            type: "widget", emoji: "💰", label: "Phong bì mừng cưới", desc: "Tài khoản nhận phong bì mừng cưới",
                                            props: { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "NGUYEN VAN A" }, w: 350, h: 150
                                        },
                                        {
                                            type: "widget", emoji: "📝", label: "RSVP Form", desc: "Form xác nhận tham dự tiệc cưới",
                                            props: { widgetType: "rsvp", label: "RSVP", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng xác nhận sự hiện diện của bạn" }, w: 340, h: 220
                                        },
                                        {
                                            type: "widget", emoji: "▶️", label: "YouTube Video", desc: "Nhúng video YouTube vào thiệp",
                                            props: { widgetType: "youtube", label: "Video cưới", youtubeUrl: "" }, w: 350, h: 200
                                        },
                                    ] as Array<{ type: string; emoji: string; label: string; desc: string; props: Record<string, string>; w: number; h: number }>).map((w) => (
                                        <button key={w.label}
                                            onClick={() => dispatch({
                                                type: "ADD_ELEMENT",
                                                element: {
                                                    id: `el-${Date.now()}`,
                                                    sectionId: state.sections[0]?.id || "section-1",
                                                    type: w.type as CanvasElement["type"],
                                                    x: 20, y: 100 + state.elements.length * 30,
                                                    width: w.w, height: w.h,
                                                    rotation: 0, opacity: 1,
                                                    zIndex: state.elements.length + 1, locked: false,
                                                    props: w.props,
                                                },
                                            })}
                                            style={{
                                                display: "flex", alignItems: "flex-start", gap: 12,
                                                padding: "12px 14px", borderRadius: 12,
                                                border: "1px solid #f3f4f6", background: "#fafafa",
                                                cursor: "pointer", textAlign: "left",
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            <span style={{ fontSize: 24, flexShrink: 0 }}>{w.emoji}</span>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "0 0 2px" }}>{w.label}</p>
                                                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{w.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* BG TAB */}
                            {activeTab === "bg" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 8px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Màu nền</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                        {BG_PRESETS.map(bg => (
                                            <button key={bg.label}
                                                onClick={() => dispatch({ type: "SET_BACKGROUND", background: bg.value })}
                                                style={{
                                                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                                                    padding: 8, borderRadius: 10,
                                                    border: `2px solid ${state.background === bg.value ? "#ff6b9d" : "#e5e7eb"}`,
                                                    background: "#fff", cursor: "pointer",
                                                }}
                                            >
                                                <div style={{ width: "100%", height: 48, borderRadius: 6, background: bg.value ?? "#f3f4f6" }} />
                                                <span style={{ fontSize: 10, color: "#6b7280", textAlign: "center" }}>{bg.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* EFFECTS TAB */}
                            {activeTab === "effects" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 8px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Hiệu ứng bay</p>
                                    {([
                                        { label: "🌸 Cánh hoa", effect: "petals" as ParticleEffect },
                                        { label: "💕 Trái tim", effect: "hearts" as ParticleEffect },
                                        { label: "✨ Bokeh", effect: "bokeh" as ParticleEffect },
                                        { label: "❄️ Tuyết rơi", effect: "snow" as ParticleEffect },
                                        { label: "🚫 Tắt hiệu ứng", effect: "none" as ParticleEffect },
                                    ]).map(fx => (
                                        <button key={fx.effect}
                                            onClick={() => dispatch({ type: "SET_PARTICLE_EFFECT", effect: fx.effect })}
                                            style={{
                                                padding: "10px 14px", borderRadius: 10,
                                                border: `1px solid ${state.particleEffect === fx.effect ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: state.particleEffect === fx.effect ? "#fdf2f8" : "#fff",
                                                cursor: "pointer", fontSize: 13, color: "#374151",
                                                display: "flex", alignItems: "center", gap: 8, textAlign: "left",
                                            }}>
                                            {fx.label}
                                            {state.particleEffect === fx.effect && <span style={{ marginLeft: "auto", color: "#ff6b9d", fontSize: 12 }}>✔</span>}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* MUSIC TAB */}
                            {activeTab === "music" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Nhạc nền</p>
                                    {musicUrl && (
                                        <div style={{
                                            padding: "10px 14px", borderRadius: 12,
                                            background: isPlaying ? "linear-gradient(135deg, #fdf2f8, #faf5ff)" : "#f9fafb",
                                            border: "1px solid " + (isPlaying ? "#ff6b9d" : "#e5e7eb"),
                                            display: "flex", alignItems: "center", gap: 10,
                                        }}>
                                            <button onClick={handlePlayMusic} style={{
                                                width: 36, height: 36, borderRadius: "50%",
                                                border: "none", cursor: "pointer",
                                                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                                color: "#fff", fontSize: 16, flexShrink: 0,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>{isPlaying ? "⏸" : "▶"}</button>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{musicName || "Nhạc đã chọn"}</p>
                                                <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{isPlaying ? "🎵 Đang phát..." : "Click ► để nghe thử"}</p>
                                            </div>
                                            <button onClick={() => handleSetMusic("", "")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 18, padding: 4 }}>×</button>
                                        </div>
                                    )}
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "4px 0 0", fontWeight: 600 }}>Nhạc có sẵn ({MUSIC_PRESETS.length} bài):</p>
                                    {MUSIC_PRESETS.map(m => (
                                        <div key={m.id} style={{
                                            padding: "8px 12px", borderRadius: 10,
                                            border: "1px solid " + (musicUrl === m.url ? "#ff6b9d" : "#e5e7eb"),
                                            background: musicUrl === m.url ? "#fdf2f8" : "#fff",
                                            display: "flex", alignItems: "center", gap: 8,
                                        }}>
                                            <MusicPreviewBtn url={m.url} />
                                            <button onClick={() => handleSetMusic(m.url, m.label)} style={{
                                                flex: 1, background: "none", border: "none",
                                                cursor: "pointer", textAlign: "left", padding: 0,
                                            }}>
                                                <span style={{ fontSize: 15, marginRight: 6 }}>{m.emoji}</span>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{m.label}</span>
                                                <span style={{ fontSize: 10, color: "#9ca3af", display: "block" }}>{m.genre}</span>
                                            </button>
                                            {musicUrl === m.url && <span style={{ color: "#ff6b9d", fontSize: 14, flexShrink: 0 }}>✔</span>}
                                        </div>
                                    ))}
                                    <div style={{ marginTop: 8 }}>
                                        <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 6px", fontWeight: 600 }}>Hoặc dán link MP3:</p>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <input
                                                placeholder="https://... .mp3"
                                                value={musicUrl.startsWith("https://cdn.pixabay") ? "" : musicUrl}
                                                onChange={e => setMusicUrl(e.target.value)}
                                                style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, outline: "none" }}
                                            />
                                            <button onClick={() => setMusicName("Custom")} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#f3f4f6", cursor: "pointer", fontSize: 12 }}>OK</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TEMPLATES TAB */}
                            {activeTab === "templates" && (() => {
                                const [cat, setCat] = [templateCat, setTemplateCat];
                                const filtered = cat === "all" ? TEMPLATE_PRESETS : TEMPLATE_PRESETS.filter(t => t.category === cat);
                                return (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Chọn mẫu thiệp</p>
                                        {/* Category filter */}
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                            {TEMPLATE_CATEGORIES.map(c => (
                                                <button key={c.key} onClick={() => setTemplateCat(c.key)}
                                                    style={{
                                                        padding: "5px 12px", borderRadius: 16,
                                                        border: `1px solid ${cat === c.key ? "#ff6b9d" : "#e5e7eb"}`,
                                                        background: cat === c.key ? "#fdf2f8" : "#fff",
                                                        color: cat === c.key ? "#ff6b9d" : "#6b7280",
                                                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                                                        transition: "all 0.15s",
                                                    }}
                                                >{c.label}</button>
                                            ))}
                                        </div>
                                        {/* Template cards */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                            {filtered.map(t => (
                                                <button key={t.slug}
                                                    onClick={() => {
                                                        if (confirm(`Áp dụng mẫu "${t.label}"? Nội dung hiện tại sẽ được thay thế.`)) {
                                                            dispatch({ type: "LOAD", elements: JSON.parse(JSON.stringify(t.elements)), background: t.background, sections: JSON.parse(JSON.stringify(t.sections)) });
                                                        }
                                                    }}
                                                    style={{
                                                        padding: 0, border: `2px solid ${state.background === t.background ? t.accent : "#e5e7eb"}`,
                                                        borderRadius: 12, overflow: "hidden",
                                                        background: "#fff", cursor: "pointer",
                                                        transition: "all 0.2s", textAlign: "left",
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
                                                    onMouseLeave={e => { if (state.background !== t.background) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                                                >
                                                    <div style={{ height: 80, background: t.background, position: "relative" }}>
                                                        <span style={{ position: "absolute", top: 6, right: 6, fontSize: 18 }}>{t.emoji}</span>
                                                    </div>
                                                    <div style={{ padding: "8px 10px" }}>
                                                        <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 2px" }}>{t.label}</p>
                                                        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{t.sections.length} sections · {t.elements.length} elements</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* ── Canvas Area ── */}
                <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* Element Toolbar — floating action bar */}
                    {state.selectedId && (() => {
                        const sel = state.elements.find(e => e.id === state.selectedId);
                        if (!sel) return null;
                        const scale = state.zoom / 100;
                        return (
                            <div className="animate-toolbar-in" style={{
                                position: "absolute", top: 8, left: "50%",
                                transform: "translateX(-50%)", zIndex: 200,
                                background: "#fff", borderRadius: 12,
                                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                padding: "6px 10px", display: "flex", gap: 4,
                                border: "1px solid #e5e7eb",
                            }}>
                                {[
                                    { icon: <Copy size={14} />, label: "Nhân bản", action: () => dispatch({ type: "DUPLICATE", id: sel.id }) },
                                    { icon: <ArrowUp size={14} />, label: "Lên", action: () => dispatch({ type: "BRING_FORWARD", id: sel.id }) },
                                    { icon: <ArrowDown size={14} />, label: "Xuống", action: () => dispatch({ type: "SEND_BACKWARD", id: sel.id }) },
                                    { icon: <Trash2 size={14} />, label: "Xóa", action: () => dispatch({ type: "DELETE_ELEMENT", id: sel.id }), danger: true },
                                ].map(btn => (
                                    <button key={btn.label} title={btn.label} onClick={btn.action} style={{
                                        padding: "6px 10px", borderRadius: 8, border: "none",
                                        background: "transparent", cursor: "pointer",
                                        color: (btn as { danger?: boolean }).danger ? "#ef4444" : "#4b5563",
                                        display: "flex", alignItems: "center", gap: 4,
                                        fontSize: 11, fontWeight: 500,
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >{btn.icon}<span>{btn.label}</span></button>
                                ))}
                            </div>
                        );
                    })()}
                    <div style={{
                        flex: 1, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        overflow: "auto", padding: 32,
                        background: "#e5e7eb",
                    }}>
                    <div style={{ position: "relative", paddingBottom: 68 }}>
                        <Canvas
                            width={state.width}
                            height={state.height}
                            background={state.background}
                            sections={state.sections}
                            elements={state.elements}
                            selectedId={state.selectedId}
                            zoom={state.zoom}
                            dispatch={dispatch}
                        />
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 24, paddingBottom: 68 }}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch({ type: "ADD_SECTION" });
                                }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "10px 20px", borderRadius: 20,
                                    background: "#fff", border: "1px solid #e5e7eb",
                                    color: "#4b5563", fontSize: 13, fontWeight: 600,
                                    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                    transition: "all 0.2s"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff6b9d"; e.currentTarget.style.color = "#ff6b9d"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#4b5563"; }}
                            >
                                <Plus size={16} /> Thêm Trang Mới
                            </button>
                        </div>
                        <QuickImageBar
                            elements={state.elements}
                            selectedId={state.selectedId}
                            onSelectElement={(id) => dispatch({ type: "SELECT", id })}
                            onReplaceImage={(id, src) => {
                                const el = state.elements.find(e => e.id === id);
                                if (el) dispatch({ type: "UPDATE_ELEMENT", id, changes: { props: { ...el.props, src } } });
                            }}
                            onAddImage={(src) => {
                                addImage(src);
                            }}
                        />
                    </div>
                </div>
                    
                {/* ── Floating Zoom Controls ── */}
                    <div style={{
                        position: "absolute",
                        bottom: 24, left: 24, zIndex: 100,
                        backgroundColor: "#fff",
                        borderRadius: 20,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                        padding: "8px 12px",
                        display: "flex", alignItems: "center", gap: 12,
                        border: "1px solid #e5e7eb"
                    }}>
                        <button 
                            onClick={() => dispatch({ type: "SET_ZOOM", zoom: Math.max(25, state.zoom - 25) })}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: 0, display: "flex", transition: "color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#ff6b9d"}
                            onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                        >
                            <ZoomOut size={16} />
                        </button>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 44, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                            {state.zoom}%
                        </span>
                        <button 
                            onClick={() => dispatch({ type: "SET_ZOOM", zoom: Math.min(200, state.zoom + 25) })}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: 0, display: "flex", transition: "color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#ff6b9d"}
                            onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                        >
                            <ZoomIn size={16} />
                        </button>
                    </div>

                    {/* ── Floating Music Vinyl Icon ── */}
                    <button
                        onClick={() => {
                            const body = document.body;
                            const cur = body.getAttribute("data-music") === "playing";
                            body.setAttribute("data-music", cur ? "paused" : "playing");
                            // Force re-render for class toggle
                            (window as unknown as Record<string, unknown>).__musicPlaying = !cur;
                        }}
                        title="Bật/Tắt nhạc nền"
                        style={{
                            position: "absolute", bottom: 24, right: 24, zIndex: 100,
                            width: 48, height: 48, borderRadius: "50%",
                            background: "linear-gradient(135deg, #1f2937, #374151)",
                            border: "3px solid #4b5563",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 20,
                            transition: "transform 0.3s, box-shadow 0.3s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)"; }}
                    >
                        <span className="animate-vinyl-spin" style={{ fontSize: 22, lineHeight: 1 }}>🎵</span>
                        {/* Vinyl rings */}
                        <div style={{
                            position: "absolute", inset: 3,
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }} />
                        <div style={{
                            position: "absolute", width: 10, height: 10,
                            borderRadius: "50%", background: "#9ca3af",
                            top: "50%", left: "50%",
                            transform: "translate(-50%, -50%)",
                        }} />
                    </button>
                </div>

                {/* ── Right Panel (Properties) ── */}
                {/* U4 fix: hidden file input for replacing a selected image element */}
                <input
                    ref={replaceImageInputRef}
                    type="file" accept="image/*" style={{ display: "none" }}
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !state.selectedId) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("projectId", projectId);
                        try {
                            const res = await fetch("/api/upload", { method: "POST", body: formData });
                            const json = await res.json() as { url?: string };
                            if (json.url) {
                                dispatch({ type: "UPDATE_ELEMENT", id: state.selectedId, changes: { props: { ...selectedEl?.props, src: json.url } } });
                            }
                        } catch { alert("Upload thất bại, vui lòng thử lại."); }
                        e.target.value = "";
                    }}
                />

                <RightPanel
                    selectedEl={selectedEl}
                    dispatch={dispatch}
                    background={state.background}
                    particleEffect={state.particleEffect ?? "none"}
                    onReplaceImage={() => replaceImageInputRef.current?.click()}
                    onShowFontPicker={() => setShowFontPicker(true)}
                    showFontPicker={showFontPicker}
                    onCloseFontPicker={() => setShowFontPicker(false)}
                />
            </div>
        </div>
    );
}
