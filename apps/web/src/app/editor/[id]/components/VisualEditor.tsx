"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Type, Image as ImageIcon, Palette, Music, Sparkles, Undo2, Redo2, Eye, Rocket, Save, LayoutTemplate, Grid, Smile, ChevronsUp, ChevronsDown, Copy, Trash2 } from "lucide-react";
import { Canvas } from "./Canvas";
import { useCanvasReducer, type CanvasElement, type ParticleEffect } from "./useCanvasReducer";
import { createBrowserClient } from "@supabase/ssr";
import { StockPanel } from "./sidebar/StockPanel";
import { StickerPanel } from "./sidebar/StickerPanel";

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
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
                                            type: "countdown", emoji: "⏰", label: "Đếm ngược ngày cưới", desc: "Hiển thị thời gian đến ngày cưới",
                                            props: { widgetType: "countdown", label: "Countdown", targetDate: "" }, w: 350, h: 100
                                        },
                                        {
                                            type: "widget", emoji: "🗺️", label: "Bản đồ", desc: "Gắn link Google Maps địa điểm",
                                            props: { widgetType: "map", mapUrl: "https://maps.google.com", label: "Vị trí tiệc cưới" }, w: 350, h: 200
                                        },
                                        {
                                            type: "widget", emoji: "📱", label: "Mã QR", desc: "QR code link thiệp để chia sẻ",
                                            props: { widgetType: "qr", label: "Quét để xem thiệp" }, w: 160, h: 180
                                        },
                                        {
                                            type: "widget", emoji: "💰", label: "Phong bì mừng cưới", desc: "Tài khoản nhận phong bì mừng cưới",
                                            props: { widgetType: "gift", label: "Phong bì mừng cưới" }, w: 350, h: 120
                                        },
                                    ] as Array<{ type: string; emoji: string; label: string; desc: string; props: Record<string, string>; w: number; h: number }>).map((w) => (
                                        <button key={w.label}
                                            onClick={() => dispatch({
                                                type: "ADD_ELEMENT",
                                                element: {
                                                    id: `el-${Date.now()}`,
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
                            {activeTab === "templates" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Đổi mẫu thiệp</p>
                                    {EDITOR_TEMPLATES.map(t => (
                                        <button key={t.slug}
                                            onClick={() => dispatch({ type: "SET_BACKGROUND", background: t.bg })}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 12,
                                                padding: "10px 12px", borderRadius: 12,
                                                border: `2px solid ${state.background === t.bg ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: state.background === t.bg ? "#fdf2f8" : "#fff",
                                                cursor: "pointer", textAlign: "left",
                                            }}
                                        >
                                            <div style={{ width: 40, height: 56, borderRadius: 6, background: t.bg, flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "0 0 2px" }}>{t.emoji} {t.label}</p>
                                                <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{t.slug}</p>
                                            </div>
                                            {state.background === t.bg && <span style={{ marginLeft: "auto", color: "#ff6b9d", fontSize: 16 }}>✔</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

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

                <div style={{
                    width: 260, background: "#fff",
                    borderLeft: "1px solid #e5e7eb",
                    flexShrink: 0, overflowY: "auto",
                    padding: 16,
                    display: "flex", flexDirection: "column", gap: 0,
                }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 12px", letterSpacing: 0.5 }}>
                        ✏️ Tuỳ chỉnh
                    </p>

                    {/* ── GLOBAL PANEL (no element selected) ── */}
                    {!selectedEl && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Canvas info */}
                            <div style={{ padding: "10px 14px", borderRadius: 10, background: "#f9fafb", border: "1px solid #f3f4f6" }}>
                                <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.8 }}>Thiệp</p>
                                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>390 × 844px</p>
                                <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>{state.elements.length} phần tử</p>
                            </div>

                            {/* Quick background */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.8 }}>Nền nhanh</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                                    {BG_PRESETS.map(bg => (
                                        <button key={bg.label}
                                            title={bg.label}
                                            onClick={() => dispatch({ type: "SET_BACKGROUND", background: bg.value })}
                                            style={{
                                                width: "100%", aspectRatio: "1", borderRadius: 8,
                                                background: bg.value,
                                                border: `2px solid ${state.background === bg.value ? "#ff6b9d" : "transparent"}`,
                                                cursor: "pointer", padding: 0,
                                                boxShadow: "0 1px 4px rgba(0,0,0,.1)",
                                                transition: "border-color 0.15s",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Particle effects */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.8 }}>Hiệu ứng hạt</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                    {([
                                        { label: "🌸 Hoa", effect: "petals" as ParticleEffect },
                                        { label: "💕 Tim", effect: "hearts" as ParticleEffect },
                                        { label: "✨ Bokeh", effect: "bokeh" as ParticleEffect },
                                        { label: "❄️ Tuyết", effect: "snow" as ParticleEffect },
                                    ]).map(fx => (
                                        <button key={fx.effect}
                                            onClick={() => dispatch({ type: "SET_PARTICLE_EFFECT", effect: fx.effect === state.particleEffect ? "none" : fx.effect })}
                                            style={{
                                                padding: "8px 6px", borderRadius: 8, fontSize: 12,
                                                border: `1.5px solid ${state.particleEffect === fx.effect ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: state.particleEffect === fx.effect ? "#fdf2f8" : "#fafafa",
                                                cursor: "pointer", color: "#374151",
                                                fontWeight: state.particleEffect === fx.effect ? 700 : 400,
                                                transition: "all 0.15s",
                                            }}>
                                            {fx.label}
                                        </button>
                                    ))}
                                </div>
                                {state.particleEffect !== "none" && (
                                    <button onClick={() => dispatch({ type: "SET_PARTICLE_EFFECT", effect: "none" })}
                                        style={{
                                            marginTop: 6, width: "100%", padding: "5px 0", borderRadius: 6,
                                            border: "1px solid #e5e7eb", background: "#f9fafb",
                                            cursor: "pointer", fontSize: 11, color: "#9ca3af"
                                        }}>
                                        🚫 Tắt hiệu ứng
                                    </button>
                                )}
                            </div>

                            <div style={{ textAlign: "center", padding: "20px 0 8px", color: "#d1d5db" }}>
                                <p style={{ fontSize: 32, margin: 0 }}>👆</p>
                                <p style={{ fontSize: 12, marginTop: 6, color: "#9ca3af" }}>Chọn phần tử để chỉnh sửa</p>
                            </div>
                        </div>
                    )}

                    {/* ── TEXT ELEMENT PANEL ── */}
                    {selectedEl?.type === "text" && (() => {
                        const p = selectedEl.props;
                        const upd = (changes: Record<string, unknown>) =>
                            dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...p, ...changes } } });
                        const shadow = p.textShadow ?? { active: false, color: "rgba(0,0,0,0.4)", blur: 4, x: 2, y: 2 };

                        return (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                                {/* Layer / Action row */}
                                <div style={{ display: "flex", gap: 5 }}>
                                    {[
                                        { icon: <ChevronsUp size={13} />, label: "↑", action: () => dispatch({ type: "BRING_FORWARD", id: selectedEl.id }), title: "Lên trên" },
                                        { icon: <ChevronsDown size={13} />, label: "↓", action: () => dispatch({ type: "SEND_BACKWARD", id: selectedEl.id }), title: "Xuống dưới" },
                                        { icon: <Copy size={13} />, label: "", action: () => dispatch({ type: "DUPLICATE", id: selectedEl.id }), title: "Nhân đôi" },
                                    ].map((btn, i) => (
                                        <button key={i} title={btn.title} onClick={btn.action} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 11, color: "#374151" }}>
                                            {btn.icon}{btn.label}
                                        </button>
                                    ))}
                                </div>

                                {/* ── Font Family ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Font chữ</label>
                                    <select
                                        value={p.fontFamily ?? "'Dancing Script', cursive"}
                                        onChange={e => upd({ fontFamily: e.target.value })}
                                        style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, outline: "none", background: "#fff" }}
                                    >
                                        {[
                                            ["'Dancing Script', cursive", "Dancing Script ✍️"],
                                            ["'Playfair Display', serif", "Playfair Display 📜"],
                                            ["'Cormorant Garamond', serif", "Cormorant Garamond"],
                                            ["'Lora', serif", "Lora"],
                                            ["'EB Garamond', serif", "EB Garamond"],
                                            ["'Inter', sans-serif", "Inter 🔤"],
                                            ["'Roboto', sans-serif", "Roboto"],
                                            ["'Montserrat', sans-serif", "Montserrat"],
                                            ["'Nunito', sans-serif", "Nunito"],
                                            ["'Poppins', sans-serif", "Poppins"],
                                            ["'Great Vibes', cursive", "Great Vibes ✨"],
                                            ["'Pacifico', cursive", "Pacifico"],
                                            ["'Sacramento', cursive", "Sacramento"],
                                            ["'Satisfy', cursive", "Satisfy"],
                                            ["Georgia, serif", "Georgia (System)"],
                                        ].map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* ── Font Size stepper ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Cỡ chữ</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <button onClick={() => upd({ fontSize: Math.max(8, (p.fontSize ?? 24) - 1) })} style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#374151" }}>−</button>
                                        <input
                                            type="number" min={8} max={120}
                                            value={p.fontSize ?? 24}
                                            onChange={e => upd({ fontSize: Number(e.target.value) })}
                                            style={{ flex: 1, textAlign: "center", padding: "6px 4px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13, outline: "none" }}
                                        />
                                        <button onClick={() => upd({ fontSize: Math.min(120, (p.fontSize ?? 24) + 1) })} style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#374151" }}>+</button>
                                    </div>
                                </div>

                                {/* ── Bold / Italic / Underline / Strikethrough ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Định dạng</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5 }}>
                                        {[
                                            { label: "B", active: p.fontWeight === "bold", style: { fontWeight: "bold" as const }, action: () => upd({ fontWeight: p.fontWeight === "bold" ? "normal" : "bold" }), title: "In đậm" },
                                            { label: "I", active: p.fontStyle === "italic", style: { fontStyle: "italic" as const }, action: () => upd({ fontStyle: p.fontStyle === "italic" ? "normal" : "italic" }), title: "In nghiêng" },
                                            { label: "U", active: p.textDecoration === "underline", style: { textDecoration: "underline" as const }, action: () => upd({ textDecoration: p.textDecoration === "underline" ? "none" : "underline" }), title: "Gạch chân" },
                                            { label: "S̶", active: p.textDecoration === "line-through", style: { textDecoration: "line-through" as const }, action: () => upd({ textDecoration: p.textDecoration === "line-through" ? "none" : "line-through" }), title: "Gạch ngang" },
                                        ].map((btn, i) => (
                                            <button key={i} title={btn.title} onClick={btn.action} style={{
                                                padding: "8px 0", borderRadius: 8, fontSize: 14, cursor: "pointer",
                                                border: `1.5px solid ${btn.active ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: btn.active ? "#fdf2f8" : "#fff",
                                                color: btn.active ? "#ff6b9d" : "#374151",
                                                ...btn.style,
                                            }}>{btn.label}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Text Alignment ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Căn chỉnh</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5 }}>
                                        {([["left", "≡ Trái"], ["center", "≡ Giữa"], ["right", "≡ Phải"], ["justify", "≡≡"]] as const).map(([align, label]) => (
                                            <button key={align} onClick={() => upd({ textAlign: align })} style={{
                                                padding: "7px 2px", borderRadius: 8, fontSize: 10, cursor: "pointer",
                                                border: `1.5px solid ${p.textAlign === align ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: p.textAlign === align ? "#fdf2f8" : "#fff",
                                                color: p.textAlign === align ? "#ff6b9d" : "#374151",
                                                fontWeight: p.textAlign === align ? 700 : 400,
                                            }}>{label}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Text Color + Hex ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Màu chữ</label>
                                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                        <input type="color" value={p.color ?? "#831843"}
                                            onChange={e => upd({ color: e.target.value })}
                                            style={{ width: 42, height: 36, borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer", padding: 2, flexShrink: 0 }}
                                        />
                                        <input type="text" value={p.color ?? "#831843"}
                                            onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) upd({ color: e.target.value }); }}
                                            style={{ flex: 1, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, fontFamily: "monospace", outline: "none" }}
                                        />
                                    </div>
                                    {/* Color swatches */}
                                    <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                                        {["#ffffff", "#000000", "#831843", "#1e40af", "#065f46", "#92400e", "#7c3aed", "#be123c", "#0f766e", "#374151", "#f59e0b", "#ec4899"].map(c => (
                                            <button key={c} onClick={() => upd({ color: c })} title={c} style={{
                                                width: 20, height: 20, borderRadius: 4, background: c, border: p.color === c ? "2.5px solid #ff6b9d" : "1.5px solid #e5e7eb",
                                                cursor: "pointer", padding: 0, flexShrink: 0,
                                            }} />
                                        ))}
                                    </div>
                                </div>

                                {/* ── Line Height ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>
                                        Giãn dòng: {(p.lineHeight ?? 1.4).toFixed(1)}×
                                    </label>
                                    <input type="range" min={8} max={40} step={1}
                                        value={Math.round((p.lineHeight ?? 1.4) * 10)}
                                        onChange={e => upd({ lineHeight: Number(e.target.value) / 10 })}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {/* ── Letter Spacing ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>
                                        Khoảng cách chữ: {p.letterSpacing ?? 0}px
                                    </label>
                                    <input type="range" min={-5} max={20} step={0.5}
                                        value={p.letterSpacing ?? 0}
                                        onChange={e => upd({ letterSpacing: Number(e.target.value) })}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {/* ── Text Shadow ── */}
                                <div style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #f3f4f6", background: "#fafafa" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: shadow.active ? 10 : 0 }}>
                                        <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>Đổ bóng chữ</label>
                                        <button onClick={() => upd({ textShadow: { ...shadow, active: !shadow.active } })} style={{
                                            width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                                            background: shadow.active ? "#ff6b9d" : "#d1d5db",
                                            position: "relative", transition: "all 0.2s", flexShrink: 0,
                                        }}>
                                            <span style={{
                                                position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%",
                                                background: "#fff", transition: "all 0.2s",
                                                left: shadow.active ? 18 : 2,
                                            }} />
                                        </button>
                                    </div>
                                    {shadow.active && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                                <input type="color" value={shadow.color} onChange={e => upd({ textShadow: { ...shadow, color: e.target.value } })}
                                                    style={{ width: 34, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer", padding: 1 }} />
                                                <span style={{ fontSize: 10, color: "#9ca3af" }}>Màu bóng</span>
                                            </div>
                                            {[
                                                { label: `Mờ: ${shadow.blur}px`, min: 0, max: 20, val: shadow.blur, key: "blur" },
                                                { label: `X: ${shadow.x}px`, min: -20, max: 20, val: shadow.x, key: "x" },
                                                { label: `Y: ${shadow.y}px`, min: -20, max: 20, val: shadow.y, key: "y" },
                                            ].map(s => (
                                                <div key={s.key}>
                                                    <span style={{ fontSize: 10, color: "#6b7280" }}>{s.label}</span>
                                                    <input type="range" min={s.min} max={s.max}
                                                        value={s.val}
                                                        onChange={e => upd({ textShadow: { ...shadow, [s.key]: Number(e.target.value) } })}
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── Opacity ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>
                                        Độ mờ: {Math.round((selectedEl.opacity ?? 1) * 100)}%
                                    </label>
                                    <input type="range" min={10} max={100}
                                        value={Math.round((selectedEl.opacity ?? 1) * 100)}
                                        onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { opacity: Number(e.target.value) / 100 } })}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {/* ── Rotation ── */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>
                                        Xoay: {selectedEl.rotation ?? 0}°
                                    </label>
                                    <input type="range" min={-180} max={180}
                                        value={selectedEl.rotation ?? 0}
                                        onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { rotation: Number(e.target.value) } })}
                                        style={{ width: "100%" }}
                                    />
                                    <button onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { rotation: 0 } })}
                                        style={{ marginTop: 4, width: "100%", padding: "4px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 11, color: "#6b7280" }}>Reset 0°</button>
                                </div>

                                {/* ── Animation ── */}
                                <div style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #f3f4f6", background: "#fafafa" }}>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8 }}>🎬 Hiệu ứng chuyển động</label>
                                    <div style={{ marginBottom: 6 }}>
                                        <span style={{ fontSize: 10, color: "#9ca3af", marginBottom: 4, display: "block" }}>Xuất hiện</span>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                                            {([["none", "Không"], ["fadeIn", "Fade In"], ["slideUp", "Slide Up"], ["zoomIn", "Zoom In"]] as const).map(([val, label]) => (
                                                <button key={val} onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { animation: { ...selectedEl.animation, entrance: val, loop: selectedEl.animation?.loop ?? "none" } } })} style={{
                                                    padding: "5px 4px", borderRadius: 7, fontSize: 10, cursor: "pointer",
                                                    border: `1.5px solid ${(selectedEl.animation?.entrance ?? "none") === val ? "#ff6b9d" : "#e5e7eb"}`,
                                                    background: (selectedEl.animation?.entrance ?? "none") === val ? "#fdf2f8" : "#fff",
                                                    color: (selectedEl.animation?.entrance ?? "none") === val ? "#ff6b9d" : "#374151",
                                                }}>{label}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: 10, color: "#9ca3af", marginBottom: 4, display: "block" }}>Liên tục</span>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
                                            {([["none", "Không"], ["pulse", "Pulse"], ["float", "Float"], ["shake", "Shake"]] as const).map(([val, label]) => (
                                                <button key={val} onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { animation: { entrance: selectedEl.animation?.entrance ?? "none", loop: val } } })} style={{
                                                    padding: "5px 2px", borderRadius: 7, fontSize: 9, cursor: "pointer",
                                                    border: `1.5px solid ${(selectedEl.animation?.loop ?? "none") === val ? "#ff6b9d" : "#e5e7eb"}`,
                                                    background: (selectedEl.animation?.loop ?? "none") === val ? "#fdf2f8" : "#fff",
                                                    color: (selectedEl.animation?.loop ?? "none") === val ? "#ff6b9d" : "#374151",
                                                }}>{label}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete */}
                                <button onClick={() => dispatch({ type: "DELETE_ELEMENT", id: selectedEl.id })} style={{
                                    width: "100%", padding: "9px 0", borderRadius: 10,
                                    border: "1px solid #fecdd3", background: "#fff1f2",
                                    color: "#e11d48", cursor: "pointer", fontSize: 13, fontWeight: 600,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                }}>
                                    <Trash2 size={14} /> Xóa phần tử
                                </button>
                            </div>
                        );
                    })()}

                    {/* ── IMAGE ELEMENT PANEL ── */}
                    {selectedEl?.type === "image" && (() => {
                        const p = selectedEl.props;
                        const upd = (changes: Record<string, unknown>) =>
                            dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { props: { ...p, ...changes } } });

                        return (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {/* Layer / Action row */}
                                <div style={{ display: "flex", gap: 5 }}>
                                    {[
                                        { icon: <ChevronsUp size={13} />, action: () => dispatch({ type: "BRING_FORWARD", id: selectedEl.id }), title: "Lên trên" },
                                        { icon: <ChevronsDown size={13} />, action: () => dispatch({ type: "SEND_BACKWARD", id: selectedEl.id }), title: "Xuống dưới" },
                                        { icon: <Copy size={13} />, action: () => dispatch({ type: "DUPLICATE", id: selectedEl.id }), title: "Nhân đôi" },
                                    ].map((btn, i) => (
                                        <button key={i} title={btn.title} onClick={btn.action} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#374151" }}>
                                            {btn.icon}
                                        </button>
                                    ))}
                                </div>

                                {/* Replace image */}
                                <button onClick={() => replaceImageInputRef.current?.click()} style={{
                                    padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb",
                                    background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                }}>
                                    <ImageIcon size={14} /> Đổi ảnh
                                </button>

                                {/* Opacity */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Độ mờ: {Math.round((selectedEl.opacity ?? 1) * 100)}%</label>
                                    <input type="range" min={10} max={100}
                                        value={Math.round((selectedEl.opacity ?? 1) * 100)}
                                        onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { opacity: Number(e.target.value) / 100 } })}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {/* Border radius */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Bo góc: {p.borderRadius ?? 12}px</label>
                                    <input type="range" min={0} max={60} value={p.borderRadius ?? 12}
                                        onChange={e => upd({ borderRadius: Number(e.target.value) })}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {/* Border/Stroke */}
                                <div style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #f3f4f6", background: "#fafafa" }}>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8 }}>Đường viền</label>
                                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                                        <input type="color" value={p.borderColor ?? "#ffffff"}
                                            onChange={e => upd({ borderColor: e.target.value })}
                                            style={{ width: 34, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer", padding: 1 }} />
                                        <span style={{ fontSize: 10, color: "#6b7280" }}>Độ dày: {p.borderWidth ?? 0}px</span>
                                    </div>
                                    <input type="range" min={0} max={20} value={p.borderWidth ?? 0}
                                        onChange={e => upd({ borderWidth: Number(e.target.value) })}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {/* Image filters — Brightness / Contrast / Saturation */}
                                <div style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #f3f4f6", background: "#fafafa" }}>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8 }}>Điều chỉnh ảnh</label>
                                    {[
                                        { label: "Độ sáng", key: "brightness", val: p.brightness ?? 100, min: 0, max: 200 },
                                        { label: "Độ tương phản", key: "contrast", val: p.contrast ?? 100, min: 0, max: 200 },
                                        { label: "Độ bão hòa", key: "saturation", val: p.saturation ?? 100, min: 0, max: 200 },
                                    ].map(f => (
                                        <div key={f.key} style={{ marginBottom: 8 }}>
                                            <span style={{ fontSize: 10, color: "#6b7280" }}>{f.label}: {f.val}%</span>
                                            <input type="range" min={f.min} max={f.max} value={f.val}
                                                onChange={e => upd({ [f.key]: Number(e.target.value) })}
                                                style={{ width: "100%", marginTop: 2 }}
                                            />
                                        </div>
                                    ))}
                                    <button onClick={() => upd({ brightness: 100, contrast: 100, saturation: 100 })} style={{
                                        width: "100%", padding: "4px 0", borderRadius: 6, border: "1px solid #e5e7eb",
                                        background: "#fff", cursor: "pointer", fontSize: 10, color: "#9ca3af",
                                    }}>Reset về mặc định</button>
                                </div>

                                {/* CSS filter presets */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Bộ lọc nhanh</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                                        {[
                                            { label: "Gốc", filter: "" },
                                            { label: "B&W", filter: "grayscale(100%)" },
                                            { label: "Sepia", filter: "sepia(80%)" },
                                            { label: "Ấm", filter: "saturate(150%) hue-rotate(-15deg)" },
                                            { label: "Mát", filter: "saturate(80%) hue-rotate(15deg) brightness(1.05)" },
                                            { label: "Fade", filter: "opacity(70%) brightness(1.1)" },
                                        ].map(f => (
                                            <button key={f.label} onClick={() => upd({ filter: f.filter })} style={{
                                                padding: "6px 4px", borderRadius: 8, fontSize: 11,
                                                border: `1px solid ${p.filter === f.filter ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: p.filter === f.filter ? "#fdf2f8" : "#fafafa",
                                                cursor: "pointer", color: "#374151",
                                            }}>{f.label}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* ObjectFit */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Kiểu hiển thị</label>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {(["cover", "contain"] as const).map(fit => (
                                            <button key={fit} onClick={() => upd({ objectFit: fit })} style={{
                                                flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 12,
                                                border: `1px solid ${p.objectFit === fit ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: p.objectFit === fit ? "#fdf2f8" : "#fff",
                                                cursor: "pointer",
                                            }}>{fit === "cover" ? "Cắt đầy" : "Vừa khung"}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rotation */}
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5 }}>Xoay: {selectedEl.rotation ?? 0}°</label>
                                    <input type="range" min={-180} max={180}
                                        value={selectedEl.rotation ?? 0}
                                        onChange={e => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { rotation: Number(e.target.value) } })}
                                        style={{ width: "100%" }}
                                    />
                                    <button onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { rotation: 0 } })} style={{
                                        marginTop: 4, width: "100%", padding: "4px 0", borderRadius: 6,
                                        border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 11, color: "#6b7280",
                                    }}>Reset 0°</button>
                                </div>

                                {/* Animation */}
                                <div style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #f3f4f6", background: "#fafafa" }}>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8 }}>🎬 Hiệu ứng liên tục</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
                                        {([["none", "Không"], ["pulse", "Pulse"], ["float", "Float"], ["shake", "Shake"]] as const).map(([val, label]) => (
                                            <button key={val} onClick={() => dispatch({ type: "UPDATE_ELEMENT", id: selectedEl.id, changes: { animation: { entrance: selectedEl.animation?.entrance ?? "none", loop: val } } })} style={{
                                                padding: "5px 2px", borderRadius: 7, fontSize: 9, cursor: "pointer",
                                                border: `1.5px solid ${(selectedEl.animation?.loop ?? "none") === val ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: (selectedEl.animation?.loop ?? "none") === val ? "#fdf2f8" : "#fff",
                                                color: (selectedEl.animation?.loop ?? "none") === val ? "#ff6b9d" : "#374151",
                                            }}>{label}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Delete */}
                                <button onClick={() => dispatch({ type: "DELETE_ELEMENT", id: selectedEl.id })} style={{
                                    width: "100%", padding: "9px 0", borderRadius: 10,
                                    border: "1px solid #fecdd3", background: "#fff1f2",
                                    color: "#e11d48", cursor: "pointer", fontSize: 13, fontWeight: 600,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                }}>
                                    <Trash2 size={14} /> Xóa phần tử
                                </button>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
