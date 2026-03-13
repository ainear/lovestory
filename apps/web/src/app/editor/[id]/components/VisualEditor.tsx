"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Type, Image as ImageIcon, Palette, Music, Sparkles, Undo2, Redo2, Eye, Rocket, Save, LayoutTemplate, Grid, Smile, Plus, ZoomIn, ZoomOut, Trash2, Copy, ArrowUp, ArrowDown, Download, Home, Share2, Layers } from "lucide-react";
import { Canvas } from "./Canvas";
import { useCanvasReducer, type CanvasElement, type ParticleEffect, type IntroEffect, type MusicIconStyle } from "./useCanvasReducer";
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
    { label: "Tiêu đề chính", text: "Nhập tiêu đề của bạn", fontSize: 32, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "italic" as const },
    { label: "Tiêu đề phụ", text: "Nhập nội dung phụ", fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const },
    { label: "Ngày tháng", text: "DD · MM · YYYY", fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const },
    { label: "Địa điểm", text: "Tên nhà hàng, Thành phố", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const },
    { label: "Ghi chú", text: "Nhập ghi chú của bạn tại đây", fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const },
    { label: "Hashtag", text: "#HashtagCủaBạn", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const },
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

// ── Music presets (16 wedding songs, royalty-free via Pixabay) ──
const MUSIC_GENRES = ["Tất cả", "Cổ điển", "Piano", "Acoustic", "Jazz", "Cinematic", "Pop", "Lofi"];
const MUSIC_PRESETS = [
    { id: "m1", label: "Beautiful Wedding", emoji: "🎵", genre: "Pop", url: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3" },
    { id: "m2", label: "Canon in D", emoji: "🎻", genre: "Cổ điển", url: "https://cdn.pixabay.com/audio/2024/03/18/audio_4f0fbf77d6.mp3" },
    { id: "m3", label: "Romantic Piano", emoji: "🎹", genre: "Piano", url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3" },
    { id: "m4", label: "Wedding March", emoji: "💍", genre: "Cổ điển", url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3" },
    { id: "m5", label: "Chill Acoustic", emoji: "🎸", genre: "Acoustic", url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3" },
    { id: "m6", label: "Love Strings", emoji: "🎼", genre: "Cổ điển", url: "https://cdn.pixabay.com/audio/2024/09/10/audio_3d1e42b71b.mp3" },
    { id: "m7", label: "Cinematic Romance", emoji: "🎬", genre: "Cinematic", url: "https://cdn.pixabay.com/audio/2024/02/15/audio_8b56c8c4fb.mp3" },
    { id: "m8", label: "Sweet Jazz", emoji: "🎷", genre: "Jazz", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
    { id: "m9", label: "Lofi Wedding", emoji: "☁️", genre: "Lofi", url: "https://cdn.pixabay.com/audio/2024/05/16/audio_166b80e398.mp3" },
    { id: "m10", label: "Acoustic Love", emoji: "🎸", genre: "Acoustic", url: "https://cdn.pixabay.com/audio/2024/01/08/audio_58cbc3aa64.mp3" },
    { id: "m11", label: "Piano Ballad", emoji: "🎹", genre: "Piano", url: "https://cdn.pixabay.com/audio/2023/05/13/audio_3f3e6e34cd.mp3" },
    { id: "m12", label: "Jazz Café", emoji: "☕", genre: "Jazz", url: "https://cdn.pixabay.com/audio/2023/09/04/audio_60bf8ded52.mp3" },
    { id: "m13", label: "Cinematic Emotion", emoji: "🎥", genre: "Cinematic", url: "https://cdn.pixabay.com/audio/2023/07/07/audio_3a53a4ea90.mp3" },
    { id: "m14", label: "Soft Pop Love", emoji: "💖", genre: "Pop", url: "https://cdn.pixabay.com/audio/2023/10/18/audio_69f8b44fa3.mp3" },
    { id: "m15", label: "Classical Waltz", emoji: "💃", genre: "Cổ điển", url: "https://cdn.pixabay.com/audio/2023/03/15/audio_c94e0a0d37.mp3" },
    { id: "m16", label: "Lofi Sunset", emoji: "🌇", genre: "Lofi", url: "https://cdn.pixabay.com/audio/2024/03/20/audio_9c7a3e6bfa.mp3" },
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
    // Sprint 21: Clipboard for copy-paste
    const [clipboard, setClipboard] = useState<CanvasElement | null>(null);
    // Sprint 22: Canvas grid overlay
    const [showGrid, setShowGrid] = useState(false);
    // Sprint 24: Shortcut cheatsheet modal
    const [showShortcuts, setShowShortcuts] = useState(false);
    // Sprint 25: Export format + QR + fullscreen
    const [exportFormat, setExportFormat] = useState<"png" | "jpg">("png");
    const [showQR, setShowQR] = useState(false);
    const [fullscreenPreview, setFullscreenPreview] = useState(false);
    // Sprint 26: Welcome onboarding + snap-to-grid
    const [showWelcome, setShowWelcome] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(false);
    // Sprint 27: Duplicate toast
    const [dupToast, setDupToast] = useState(false);
    // Sprint 28: Grid pattern + position indicator
    const [gridPattern, setGridPattern] = useState<"dots" | "lines" | "cross">("dots");
    // Sprint 29: Minimap toggle
    const [showMinimap, setShowMinimap] = useState(false);
    // Sprint 30: Element search + status bar + stats panel
    const [elementSearch, setElementSearch] = useState("");
    const [lastAction, setLastAction] = useState("Editor khởi tạo");
    const [showStats, setShowStats] = useState(false);
    const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "done">("idle");
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceImageInputRef = useRef<HTMLInputElement>(null); // U4 fix: separate ref for replacing selected image
    // P1: Music state
    const [musicUrl, setMusicUrl] = useState("");
    const [musicName, setMusicName] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [musicGenre, setMusicGenre] = useState("Tất cả");
    const [musicSearch, setMusicSearch] = useState("");
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

    // Sprint 31: Auto-zoom fit on initial load — make canvas fill space like Cinelove
    useEffect(() => {
        const timer = setTimeout(() => {
            const containerW = window.innerWidth - 200 - 52 - 300; // panel + icons + right panel
            const containerH = window.innerHeight - 60 - 24; // top bar + status bar
            const fitZoom = Math.min(
                Math.floor((containerW / state.width) * 100),
                Math.floor((containerH / state.height) * 100),
                150
            );
            dispatch({ type: "SET_ZOOM", zoom: Math.max(50, fitZoom) });
        }, 300);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sprint 11: Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement;
            if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
            const ctrl = e.metaKey || e.ctrlKey;
            if (ctrl && e.key === "z" && !e.shiftKey) { e.preventDefault(); dispatch({ type: "UNDO" }); setLastAction("Hoàn tác (Undo)"); }
            else if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); dispatch({ type: "REDO" }); setLastAction("Làm lại (Redo)"); }
            else if (ctrl && e.key === "d" && state.selectedId) {
                e.preventDefault();
                dispatch({ type: "DUPLICATE", id: state.selectedId });
                setDupToast(true); setTimeout(() => setDupToast(false), 1200);
                setLastAction("Nhân bản phần tử");
            }
            else if ((e.key === "Delete" || e.key === "Backspace") && state.selectedId) { e.preventDefault(); dispatch({ type: "DELETE_ELEMENT", id: state.selectedId }); setLastAction("Xóa phần tử"); }
            else if (e.key === "Escape") { dispatch({ type: "SELECT", id: null }); }
            // Sprint 21: Copy-paste (Ctrl+C / Ctrl+V)
            else if (ctrl && e.key === "c" && state.selectedId) {
                e.preventDefault();
                const copyEl = state.elements.find(el => el.id === state.selectedId);
                if (copyEl) setClipboard({ ...copyEl });
            }
            else if (ctrl && e.key === "v" && clipboard) {
                e.preventDefault();
                const newId = Math.random().toString(36).slice(2, 10);
                const pastedEl: CanvasElement = { ...clipboard, id: newId, x: clipboard.x + 20, y: clipboard.y + 20 };
                dispatch({ type: "ADD_ELEMENT", element: pastedEl });
                dispatch({ type: "SELECT", id: newId });
            }
            // Sprint 21: Zoom shortcuts (Ctrl+/− and Ctrl+0)
            else if (ctrl && (e.key === "=" || e.key === "+")) { e.preventDefault(); dispatch({ type: "SET_ZOOM", zoom: Math.min(200, state.zoom + 25) }); }
            else if (ctrl && e.key === "-") { e.preventDefault(); dispatch({ type: "SET_ZOOM", zoom: Math.max(25, state.zoom - 25) }); }
            else if (ctrl && e.key === "0") { e.preventDefault(); dispatch({ type: "SET_ZOOM", zoom: 100 }); }
            // Sprint 20: Arrow key nudge (1px, Shift = 10px)
            else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && state.selectedId) {
                e.preventDefault();
                const step = e.shiftKey ? 10 : 1;
                const sel = state.elements.find(el => el.id === state.selectedId);
                if (sel && !sel.locked) {
                    const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
                    const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
                    dispatch({ type: "UPDATE_ELEMENT", id: sel.id, changes: { x: sel.x + dx, y: sel.y + dy } });
                }
            }
            // Sprint 27: Select first element (⌘A)
            else if (ctrl && e.key === "a") {
                e.preventDefault();
                if (state.elements.length > 0) {
                    dispatch({ type: "SELECT", id: state.elements[0].id });
                }
            }
            // Sprint 24: Shortcut cheatsheet (Ctrl+/ or Ctrl+?)
            else if (ctrl && (e.key === "/" || e.key === "?")) { e.preventDefault(); setShowShortcuts(s => !s); }
            // Sprint 28: Zoom to fit (⌘+1)
            else if (ctrl && e.key === "1") {
                e.preventDefault();
                const containerW = window.innerWidth - 300 - 260; // minus sidebars
                const containerH = window.innerHeight - 80; // minus toolbar
                const fitZoom = Math.min(Math.floor((containerW / state.width) * 100), Math.floor((containerH / state.height) * 100), 200);
                dispatch({ type: "SET_ZOOM", zoom: Math.max(25, fitZoom) });
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [dispatch, state.selectedId, state.elements, state.zoom, clipboard]);

    // Sprint 11+25: Export canvas as PNG or JPG
    const handleExportPNG = useCallback(async () => {
        const canvasArea = document.querySelector("[data-canvas-export]") as HTMLElement | null;
        if (!canvasArea) { alert("Không tìm thấy canvas"); return; }
        try {
            const mod = await import("html2canvas");
            const html2canvas = mod.default;
            const canvas = await html2canvas(canvasArea, { scale: 2, useCORS: true, backgroundColor: null });
            const link = document.createElement("a");
            const ext = exportFormat;
            link.download = `thiep-cuoi-${projectSlug || "export"}.${ext}`;
            link.href = canvas.toDataURL(ext === "jpg" ? "image/jpeg" : "image/png", 0.95);
            link.click();
        } catch {
            alert("Export thất bại. Vui lòng thử lại.");
        }
    }, [projectSlug, exportFormat]);

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

    // ── Right-click context menu ──
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elId: string } | null>(null);
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const target = (e.target as HTMLElement).closest("[data-element-id]");
        if (target) {
            const elId = target.getAttribute("data-element-id")!;
            dispatch({ type: "SELECT", id: elId });
            setContextMenu({ x: e.clientX, y: e.clientY, elId });
        } else {
            setContextMenu(null);
        }
    }, [dispatch]);

    // Close context menu on click anywhere
    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

    return (
        <div style={{
            display: "flex", flexDirection: "column", height: "100vh",
            background: "#f0f0f0", fontFamily: "'Inter', -apple-system, sans-serif",
            overflow: "hidden",
        }}>
            {/* \u2500\u2500 Context Menu \u2500\u2500 */}
            {contextMenu && (() => {
                const ctxEl = state.elements.find(e => e.id === contextMenu.elId);
                if (!ctxEl) return null;
                const items = [
                    { label: "📋 Nhân bản", action: () => dispatch({ type: "DUPLICATE", id: ctxEl.id }) },
                    { label: "🗑️ Xóa", action: () => dispatch({ type: "DELETE_ELEMENT", id: ctxEl.id }), danger: true },
                    { label: ctxEl.locked ? "🔓 Mở khóa" : "🔒 Khóa vị trí", action: () => dispatch({ type: "UPDATE_ELEMENT", id: ctxEl.id, changes: { locked: !ctxEl.locked } }) },
                    { label: "⬆️ Lên trước", action: () => dispatch({ type: "BRING_FORWARD", id: ctxEl.id }) },
                    { label: "⬇️ Xuống sau", action: () => dispatch({ type: "SEND_BACKWARD", id: ctxEl.id }) },
                ];
                return (
                    <div style={{
                        position: "fixed", left: contextMenu.x, top: contextMenu.y, zIndex: 9999,
                        background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                        border: "1px solid #e5e7eb", padding: "4px 0", minWidth: 180,
                    }}>
                        {items.map((item, i) => (
                            <button key={i} onClick={() => { item.action(); setContextMenu(null); }} style={{
                                width: "100%", padding: "8px 14px", border: "none", background: "transparent",
                                cursor: "pointer", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 8,
                                color: (item as { danger?: boolean }).danger ? "#e11d48" : "#374151",
                            }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >{item.label}</button>
                        ))}
                    </div>
                );
            })()}
            {/* ── Top Bar ── */}
            <div style={{
                height: 52, display: "flex", alignItems: "center",
                padding: "0 16px", gap: 12,
                background: "#fff", borderBottom: "1px solid #e5e7eb",
                flexShrink: 0, zIndex: 100,
            }}>
                <a href="/dashboard" title="Về trang chủ" style={{
                    display: "flex", alignItems: "center", gap: 6,
                    textDecoration: "none", marginRight: 4,
                }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#ff6b9d" }}>💌</span>
                    <Home size={16} style={{ color: "#9ca3af" }} />
                </a>
                <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, flex: 1 }}>Visual Editor</span>

                {/* Undo / Redo */}
                {[
                    { icon: <Undo2 size={16} />, action: () => dispatch({ type: "UNDO" }), disabled: state.past.length === 0, title: "Hoàn tác (⌘Z)", count: state.past.length },
                    { icon: <Redo2 size={16} />, action: () => dispatch({ type: "REDO" }), disabled: state.future.length === 0, title: "Làm lại (⌘⇧Z)", count: state.future.length },
                ].map((btn, i) => (
                    <button key={i} onClick={btn.action} disabled={btn.disabled} title={`${btn.title} (${btn.count})`} style={{
                        width: 32, height: 32, border: "1px solid #e5e7eb", position: "relative",
                        borderRadius: 8, background: "#fff", cursor: btn.disabled ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: btn.disabled ? "#d1d5db" : "#374151",
                    }}>
                        {btn.icon}
                        {btn.count > 0 && (
                            <span style={{
                                position: "absolute", top: -4, right: -4,
                                background: "#3b82f6", color: "#fff", fontSize: 9, fontWeight: 700,
                                borderRadius: 99, minWidth: 14, height: 14, lineHeight: "14px",
                                textAlign: "center", padding: "0 3px",
                            }}>{btn.count}</span>
                        )}
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

                {/* Sprint 25: Export with format toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <button onClick={handleExportPNG} title={`Tải thiệp dạng ${exportFormat.toUpperCase()}`} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", borderRadius: "10px 0 0 10px",
                        border: "1px solid #e5e7eb", borderRight: "none", background: "#fff",
                        color: "#374151", fontSize: 13, fontWeight: 500,
                        cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff6b9d"; e.currentTarget.style.color = "#ff6b9d"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                    >
                        <Download size={14} /> Tải {exportFormat.toUpperCase()}
                    </button>
                    <select
                        value={exportFormat}
                        onChange={e => setExportFormat(e.target.value as "png" | "jpg")}
                        style={{
                            padding: "8px 6px", borderRadius: "0 10px 10px 0",
                            border: "1px solid #e5e7eb", background: "#f9fafb",
                            fontSize: 11, fontWeight: 600, color: "#6b7280",
                            cursor: "pointer", outline: "none",
                        }}
                    >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                    </select>
                </div>

                {/* Sprint 25: QR Code button */}
                <button
                    onClick={() => setShowQR(true)}
                    title="Tạo QR Code chia sẻ"
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 12px", borderRadius: 10,
                        border: "1px solid #e5e7eb", background: "#fff",
                        color: "#374151", fontSize: 13, fontWeight: 500,
                        cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff6b9d"; e.currentTarget.style.color = "#ff6b9d"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                >
                    📱 QR
                </button>

                {/* Share / Copy Link */}
                <button
                    onClick={async () => {
                        const url = `${window.location.origin}/i/${projectSlug}`;
                        try {
                            if (navigator.share) {
                                await navigator.share({ title: "Thiệp mời cưới", url });
                            } else {
                                await navigator.clipboard.writeText(url);
                                alert("✅ Đã sao chép link mời!");
                            }
                        } catch { /* user cancelled share */ }
                    }}
                    title="Chia sẻ thiệp mời"
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", borderRadius: 10,
                        border: "1px solid #e5e7eb", background: "#fff",
                        color: "#374151", fontSize: 13, fontWeight: 500,
                        cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#3b82f6"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                >
                    <Share2 size={14} /> Chia sẻ
                </button>

                {/* Sprint 27: Element count breakdown badge */}
                {(() => {
                    const texts = state.elements.filter(e => e.type === "text").length;
                    const images = state.elements.filter(e => e.type === "image").length;
                    const widgets = state.elements.filter(e => e.type === "widget").length;
                    return (
                        <div title={`${texts} text · ${images} image · ${widgets} widget`} style={{
                            display: "flex", alignItems: "center", gap: 6,
                            fontSize: 11, color: "#9ca3af", fontWeight: 500,
                            padding: "4px 10px", borderRadius: 8,
                            background: "#f9fafb", border: "1px solid #f3f4f6",
                            cursor: "default",
                        }}>
                            <Layers size={12} />
                            {state.elements.length}
                            <span style={{ color: "#d1d5db" }}>|</span>
                            <span style={{ fontSize: 10 }}>T{texts} · I{images} · W{widgets}</span>
                        </div>
                    );
                })()}

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
                    width: 52, background: "#fff",
                    borderRight: "1px solid #f0f0f0",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    paddingTop: 8, gap: 2, flexShrink: 0, overflowY: "auto",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
                    zIndex: 2,
                }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(activeTab === tab.key ? "" : tab.key)} title={tab.label} style={{
                            width: 44, padding: "8px 2px",
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
                        width: 200, background: "#fff",
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
                                                const newId = `el-${Date.now()}`;
                                                const randomX = 20 + Math.floor(Math.random() * 20);
                                                const randomY = 100 + state.elements.length * 60 + Math.floor(Math.random() * 30);
                                                dispatch({
                                                    type: "ADD_ELEMENT",
                                                    element: {
                                                        id: newId,
                                                        sectionId: state.sections[0]?.id || "section-1",
                                                        type: "text",
                                                        x: randomX, y: randomY,
                                                        width: 350, height: 60,
                                                        rotation: 0, opacity: 1, zIndex: state.elements.length + 1, locked: false,
                                                        props: {
                                                            text: preset.text,
                                                            fontSize: preset.fontSize,
                                                            fontFamily: preset.fontFamily,
                                                            fontWeight: preset.fontWeight,
                                                            fontStyle: preset.fontStyle,
                                                            color: state.background.includes("0f0825") || state.background.includes("111827") ? "#ffffff" : "#1f2937",
                                                            textAlign: "center" as const,
                                                        },
                                                    },
                                                });
                                                // Auto-select the newly added element for immediate feedback
                                                setTimeout(() => dispatch({ type: "SELECT", id: newId }), 50);
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
                                    {/* Sprint 36: Text Cluster Presets */}
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "12px 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>✨ Bộ chữ thiết kế</p>
                                    {[
                                        { id: "tc1", label: "Tiêu đề + Phụ đề", emoji: "📝", texts: [
                                            { text: "Tiêu đề chính", fontSize: 28, fontFamily: "'Dancing Script', cursive", fontWeight: "700", fontStyle: "normal", dy: 0 },
                                            { text: "Phụ đề mô tả bên dưới", fontSize: 14, fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: "400", fontStyle: "normal", dy: 50 },
                                        ]},
                                        { id: "tc2", label: "Tên cô dâu & Chú rể", emoji: "💍", texts: [
                                            { text: "Minh", fontSize: 32, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontStyle: "normal", dy: 0 },
                                            { text: "&", fontSize: 20, fontFamily: "'Dancing Script', cursive", fontWeight: "700", fontStyle: "italic", dy: 45 },
                                            { text: "Lan", fontSize: 32, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontStyle: "normal", dy: 75 },
                                        ]},
                                        { id: "tc3", label: "Save The Date", emoji: "📅", texts: [
                                            { text: "SAVE THE DATE", fontSize: 12, fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: "700", fontStyle: "normal", dy: 0 },
                                            { text: "25.12.2025", fontSize: 26, fontFamily: "'Playfair Display', serif", fontWeight: "700", fontStyle: "normal", dy: 22 },
                                        ]},
                                        { id: "tc4", label: "Thiệp mời dự tiệc", emoji: "🎉", texts: [
                                            { text: "Trân trọng kính mời", fontSize: 13, fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: "500", fontStyle: "normal", dy: 0 },
                                            { text: "Quý khách đến dự bữa tiệc", fontSize: 16, fontFamily: "'Dancing Script', cursive", fontWeight: "700", fontStyle: "normal", dy: 28 },
                                            { text: "Mừng Hỷ", fontSize: 24, fontFamily: "'Great Vibes', cursive", fontWeight: "400", fontStyle: "normal", dy: 58 },
                                        ]},
                                    ].map(cluster => (
                                        <button key={cluster.id}
                                            onClick={() => {
                                                const baseY = 100 + state.elements.length * 40;
                                                cluster.texts.forEach((t, i) => {
                                                    const newId = `el-${Date.now()}-${i}`;
                                                    dispatch({
                                                        type: "ADD_ELEMENT",
                                                        element: {
                                                            id: newId,
                                                            sectionId: state.sections[0]?.id || "section-1",
                                                            type: "text",
                                                            x: 20, y: baseY + t.dy,
                                                            width: 350, height: t.fontSize + 20,
                                                            rotation: 0, opacity: 1, zIndex: state.elements.length + 1 + i, locked: false,
                                                            props: {
                                                                text: t.text,
                                                                fontSize: t.fontSize,
                                                                fontFamily: t.fontFamily,
                                                                fontWeight: t.fontWeight as "bold" | "normal" | undefined,
                                                                fontStyle: t.fontStyle as "italic" | "normal" | undefined,
                                                                color: state.background.includes("0f0825") || state.background.includes("111827") ? "#ffffff" : "#1f2937",
                                                                textAlign: "center" as const,
                                                            },
                                                        },
                                                    });
                                                });
                                            }}
                                            style={{
                                                padding: "10px 14px", borderRadius: 10,
                                                border: "1px solid #e5e7eb", background: "linear-gradient(135deg, #fdf2f8, #fff)",
                                                cursor: "pointer", textAlign: "left",
                                                display: "flex", alignItems: "center", gap: 8,
                                            }}
                                        >
                                            <span style={{ fontSize: 20 }}>{cluster.emoji}</span>
                                            <div>
                                                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0 }}>{cluster.label}</p>
                                                <p style={{ fontSize: 9, color: "#9ca3af", margin: 0 }}>{cluster.texts.length} phần tử • click để thêm</p>
                                            </div>
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
                                        {
                                            type: "widget", emoji: "📞", label: "Nút gọi", desc: "Nút bấm gọi điện cho cô dâu/chú rể",
                                            props: { widgetType: "call", label: "Liên hệ cô/chú rể", phoneNumber: "0909 xxx xxx" }, w: 300, h: 140
                                        },
                                        {
                                            type: "widget", emoji: "🖼️", label: "Album ảnh", desc: "Album ảnh cưới dạng lưới/slider",
                                            props: { widgetType: "album", label: "Album ảnh cưới", albumImages: "" }, w: 300, h: 260
                                        },
                                        {
                                            type: "widget", emoji: "👤", label: "Tên khách mời", desc: "Tên tự động thay đổi khi gửi thiệp hàng loạt",
                                            props: { widgetType: "guestname", label: "Tên khách mời", guestNameLabel: "Trân trọng kính mời" }, w: 320, h: 140
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
                                    {/* Sprint 36: Background Image Library */}
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "12px 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>🖼️ Ảnh nền cưới</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                        {[
                                            { id: "bg1", label: "Hoa hồng", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800" },
                                            { id: "bg2", label: "Hoa lavender", url: "https://images.unsplash.com/photo-1490750967868-88df5691cc35?w=800" },
                                            { id: "bg3", label: "Vải lụa", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800" },
                                            { id: "bg4", label: "Bokeh vàng", url: "https://images.unsplash.com/photo-1451847251646-8a6c0dd1510c?w=800" },
                                            { id: "bg5", label: "Mây trời", url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800" },
                                            { id: "bg6", label: "Hoa trắng", url: "https://images.unsplash.com/photo-1487530811015-780c5b3ac781?w=800" },
                                            { id: "bg7", label: "Marble", url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800" },
                                            { id: "bg8", label: "Watercolor", url: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800" },
                                        ].map(bg => (
                                            <button key={bg.id}
                                                onClick={() => dispatch({ type: "SET_BACKGROUND", background: `url(${bg.url}) center/cover` })}
                                                style={{
                                                    padding: 0, borderRadius: 8, overflow: "hidden",
                                                    border: `2px solid ${state.background.includes(bg.url) ? "#ff6b9d" : "#e5e7eb"}`,
                                                    cursor: "pointer", background: "none",
                                                    display: "flex", flexDirection: "column",
                                                }}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={bg.url.replace("w=800", "w=200")} alt={bg.label} style={{ width: "100%", height: 60, objectFit: "cover" }} />
                                                <span style={{ fontSize: 9, color: "#6b7280", padding: "3px 0", textAlign: "center", background: "#fff", width: "100%" }}>{bg.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 8, color: "#9ca3af", margin: "2px 0 0", textAlign: "center" }}>📷 Ảnh từ Unsplash — miễn phí thương mại</p>
                                    {/* Sprint 37: Custom Background Upload */}
                                    <div style={{ marginTop: 10, padding: "10px 12px", background: "#f0fdf4", borderRadius: 10, border: "1px dashed #86efac" }}>
                                        <p style={{ fontSize: 11, color: "#15803d", margin: "0 0 6px", fontWeight: 600 }}>📤 Ảnh nền riêng</p>
                                        <label style={{
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                            padding: "10px", borderRadius: 8, border: "1px dashed #4ade80",
                                            background: "#fff", cursor: "pointer", fontSize: 12, color: "#15803d", fontWeight: 600,
                                        }}>
                                            📁 Tải ảnh nền lên
                                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    dispatch({ type: "SET_BACKGROUND", background: `url(${url}) center/cover` });
                                                }
                                            }} />
                                        </label>
                                        <p style={{ fontSize: 9, color: "#86efac", margin: "4px 0 0", textAlign: "center" }}>JPG, PNG, WEBP — tối đa 5MB</p>
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
                                    {/* Sprint 37: Intro Effect */}
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "12px 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>✉️ Hiệu ứng mở đầu</p>
                                    {([
                                        { label: "✉️ Phong bì mở", effect: "envelope" as IntroEffect, desc: "Hiệu ứng mở phong bì cưới" },
                                        { label: "🌅 Fade In", effect: "fade" as IntroEffect, desc: "Mờ dần hiện ra" },
                                        { label: "📜 Slide Up", effect: "slide" as IntroEffect, desc: "Trượt từ dưới lên" },
                                        { label: "🚫 Không", effect: "none" as IntroEffect, desc: "Không hiệu ứng mở đầu" },
                                    ]).map(fx => (
                                        <button key={fx.effect}
                                            onClick={() => dispatch({ type: "SET_INTRO_EFFECT", effect: fx.effect })}
                                            style={{
                                                padding: "10px 14px", borderRadius: 10,
                                                border: `1px solid ${state.introEffect === fx.effect ? "#ff6b9d" : "#e5e7eb"}`,
                                                background: state.introEffect === fx.effect ? "#fdf2f8" : "#fff",
                                                cursor: "pointer", fontSize: 13, color: "#374151",
                                                display: "flex", alignItems: "center", gap: 8, textAlign: "left",
                                            }}>
                                            <span>{fx.label}</span>
                                            <span style={{ fontSize: 9, color: "#9ca3af", flex: 1 }}>{fx.desc}</span>
                                            {state.introEffect === fx.effect && <span style={{ color: "#ff6b9d", fontSize: 12 }}>✔</span>}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* MUSIC TAB */}
                            {activeTab === "music" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Nhạc nền ({MUSIC_PRESETS.length} bài)</p>
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
                                    {/* Sprint 34: Search bar */}
                                    <input
                                        placeholder="🔍 Tìm bài nhạc..."
                                        value={musicSearch}
                                        onChange={e => setMusicSearch(e.target.value)}
                                        style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box" }}
                                    />
                                    {/* Sprint 34: Genre filter pills */}
                                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                        {MUSIC_GENRES.map(g => (
                                            <button key={g} onClick={() => setMusicGenre(g)} style={{
                                                padding: "4px 10px", borderRadius: 99, border: "none",
                                                fontSize: 10, cursor: "pointer", fontWeight: 600,
                                                background: musicGenre === g ? "#fdf2f8" : "#f3f4f6",
                                                color: musicGenre === g ? "#be185d" : "#6b7280",
                                            }}>
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Filtered song list */}
                                    <div style={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                                    {MUSIC_PRESETS
                                        .filter(m => musicGenre === "Tất cả" || m.genre === musicGenre)
                                        .filter(m => !musicSearch || m.label.toLowerCase().includes(musicSearch.toLowerCase()) || m.genre.toLowerCase().includes(musicSearch.toLowerCase()))
                                        .map(m => (
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
                                    </div>
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
                                    {/* Sprint 35: Nhạc của tôi — file upload */}
                                    <div style={{ marginTop: 8, padding: "10px 12px", background: "#faf5ff", borderRadius: 10, border: "1px dashed #d8b4fe" }}>
                                        <p style={{ fontSize: 11, color: "#7c3aed", margin: "0 0 6px", fontWeight: 600 }}>🎵 Nhạc của tôi</p>
                                        <label style={{
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                            padding: "10px", borderRadius: 8, border: "1px dashed #c084fc",
                                            background: "#fff", cursor: "pointer", fontSize: 12, color: "#7c3aed", fontWeight: 600,
                                        }}>
                                            📁 Tải file MP3 lên
                                            <input type="file" accept="audio/mp3,audio/mpeg,audio/*" style={{ display: "none" }} onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    setMusicUrl(url);
                                                    setMusicName(file.name.replace(/\.[^/.]+$/, ""));
                                                }
                                            }} />
                                        </label>
                                        <p style={{ fontSize: 9, color: "#a78bfa", margin: "4px 0 0", textAlign: "center" }}>Hỗ trợ MP3, WAV — tối đa 10MB</p>
                                    </div>
                                    {/* Sprint 38: Music Icon Style */}
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "12px 0 4px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>🎨 Kiểu biểu tượng nhạc</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                        {([
                                            { id: "vinyl" as MusicIconStyle, emoji: "💿", label: "Đĩa xoay", desc: "Vinyl quay tròn" },
                                            { id: "note" as MusicIconStyle, emoji: "🎵", label: "Nốt nhạc", desc: "Nốt nhạc bay" },
                                            { id: "miniplayer" as MusicIconStyle, emoji: "🎧", label: "Mini Player", desc: "Thanh phát nhạc" },
                                            { id: "wave" as MusicIconStyle, emoji: "🌊", label: "Sóng nhạc", desc: "Waveform" },
                                        ]).map(st => (
                                            <button key={st.id}
                                                onClick={() => dispatch({ type: "SET_MUSIC_ICON_STYLE", style: st.id })}
                                                style={{
                                                    padding: "8px", borderRadius: 8,
                                                    border: `2px solid ${state.musicIconStyle === st.id ? "#ff6b9d" : "#e5e7eb"}`,
                                                    background: state.musicIconStyle === st.id ? "#fdf2f8" : "#fff",
                                                    cursor: "pointer", textAlign: "center",
                                                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                                                }}>
                                                <span style={{ fontSize: 20 }}>{st.emoji}</span>
                                                <span style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>{st.label}</span>
                                                <span style={{ fontSize: 8, color: "#9ca3af" }}>{st.desc}</span>
                                            </button>
                                        ))}
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
                <div onContextMenu={handleContextMenu} style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
                                {/* Sprint 29: Lock badge */}
                                {sel.locked && (
                                    <span style={{ padding: "6px 8px", fontSize: 11, color: "#f59e0b", fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
                                        🔒 Khóa
                                    </span>
                                )}
                                {[
                                    { icon: <Copy size={14} />, label: "Nhân bản", shortcut: "⌘D", action: () => dispatch({ type: "DUPLICATE", id: sel.id }) },
                                    { icon: <ArrowUp size={14} />, label: "Lên", shortcut: "", action: () => dispatch({ type: "BRING_FORWARD", id: sel.id }) },
                                    { icon: <ArrowDown size={14} />, label: "Xuống", shortcut: "", action: () => dispatch({ type: "SEND_BACKWARD", id: sel.id }) },
                                    // Sprint 29: Auto-align center buttons
                                    { icon: <span style={{ fontSize: 12 }}>⫿</span>, label: "Giữa H", shortcut: "", action: () => dispatch({ type: "UPDATE_ELEMENT", id: sel.id, changes: { x: Math.round((state.width - sel.width) / 2) } }) },
                                    { icon: <span style={{ fontSize: 12 }}>⫾</span>, label: "Giữa V", shortcut: "", action: () => dispatch({ type: "UPDATE_ELEMENT", id: sel.id, changes: { y: Math.round((state.height - sel.height) / 2) } }) },
                                    { icon: <Trash2 size={14} />, label: "Xóa", shortcut: "Del", action: () => dispatch({ type: "DELETE_ELEMENT", id: sel.id }), danger: true },
                                ].map(btn => (
                                    <button key={btn.label} title={`${btn.label}${btn.shortcut ? ` (${btn.shortcut})` : ""}`} onClick={btn.action} style={{
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
                        alignItems: "flex-start", justifyContent: "center",
                        overflow: "auto", padding: "12px 8px",
                        background: "#f1f5f9",
                    }}>
                    <div style={{ position: "relative", paddingBottom: 68 }} data-canvas-export>

                    {/* Sprint 31 → UX Polish: Thay ảnh nhanh — full-width bottom bar like Cinelove */}
                    {(() => {
                        const imageEls = state.elements.filter(e => e.type === "image");
                        if (imageEls.length === 0) return null;
                        return (
                            <div style={{
                                position: "fixed", bottom: 0, left: 240, right: 320, zIndex: 110,
                                background: "rgba(255,255,255,0.97)",
                                padding: "10px 20px", display: "flex", gap: 12, alignItems: "center",
                                boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
                                backdropFilter: "blur(12px)",
                                borderTop: "1px solid #e5e7eb",
                            }}>
                                <span style={{ fontSize: 12, color: "#374151", fontWeight: 700, whiteSpace: "nowrap", letterSpacing: 0.5 }}>📸 Thay ảnh nhanh</span>
                                <div style={{ width: 1, height: 44, background: "#e5e7eb" }} />
                                <div style={{ display: "flex", gap: 8, overflowX: "auto", flex: 1, paddingBottom: 2 }}>
                                {imageEls.map(img => (
                                    <button
                                        key={img.id}
                                        onClick={() => {
                                            dispatch({ type: "SELECT", id: img.id });
                                            setLastAction(`Chọn ảnh: ${img.id.slice(0, 6)}`);
                                        }}
                                        style={{
                                            width: 56, height: 56, borderRadius: 10, border: img.id === state.selectedId ? "3px solid #ff6b9d" : "2px solid #e5e7eb",
                                            padding: 0, cursor: "pointer", overflow: "hidden", background: "#f3f4f6", flexShrink: 0,
                                            transition: "border-color 0.2s, transform 0.2s",
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.borderColor = "#ff6b9d"; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; if (img.id !== state.selectedId) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                                    >
                                        <img src={img.props.src || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </button>
                                ))}
                                </div>
                            </div>
                        );
                    })()}
                        <Canvas
                            width={state.width}
                            height={state.height}
                            background={state.background}
                            sections={state.sections}
                            elements={state.elements}
                            selectedId={state.selectedId}
                            zoom={state.zoom}
                            particleEffect={state.particleEffect ?? "none"}
                            showGrid={showGrid}
                            dispatch={dispatch}
                        />
                        {/* Sprint 11: Empty canvas guidance */}
                        {state.elements.length === 0 && (
                            <div style={{
                                position: "absolute", inset: 0,
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center",
                                gap: 12, pointerEvents: "none",
                            }}>
                                <span style={{ fontSize: 48, opacity: 0.3 }}>💌</span>
                                <p style={{ fontSize: 16, fontWeight: 600, color: "#9ca3af", margin: 0 }}>Chưa có nội dung</p>
                                <p style={{ fontSize: 12, color: "#d1d5db", margin: 0, maxWidth: 220, textAlign: "center", lineHeight: 1.6 }}>Chọn &quot;Văn bản&quot;, &quot;Hình ảnh&quot; hoặc &quot;Tiện ích&quot; từ thanh bên trái để bắt đầu thiết kế thiệp</p>
                            </div>
                        )}
                        {/* Sprint 11: Premium watermark */}
                        <div style={{
                            position: "absolute", bottom: 6, left: "50%",
                            transform: "translateX(-50%)",
                            background: "rgba(0,0,0,0.5)", color: "#fff",
                            fontSize: 9, padding: "3px 10px",
                            borderRadius: 10, letterSpacing: 0.5,
                            pointerEvents: "none", whiteSpace: "nowrap",
                        }}>7app.online — Tạo thiệp miễn phí</div>
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
                    
                {/* Sprint 26 → UX Polish: Welcome banner — top-right slim auto-dismiss */}
                {showWelcome && !state.selectedId && (
                    <div style={{
                        position: "fixed", top: 56, right: 330, zIndex: 200,
                        background: "linear-gradient(135deg, #1e293b, #334155)",
                        borderRadius: 12, padding: "10px 16px", maxWidth: 300,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        color: "#fff", fontSize: 12, lineHeight: 1.5,
                        animation: "fadeInUp 0.4s ease",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, fontSize: 12 }}>👋 Mẹo nhanh</span>
                            <button onClick={() => setShowWelcome(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px", color: "#cbd5e1", fontSize: 11 }}>
                            <span>📌 Click để sửa</span>
                            <span>🖱️ Kéo thả</span>
                            <span>📱 QR chia sẻ</span>
                        </div>
                    </div>
                )}

                {/* Sprint 27: Duplicate toast */}
                {dupToast && (
                    <div style={{
                        position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
                        zIndex: 300, background: "#10b981", color: "#fff",
                        borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 600,
                        boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
                        animation: "fadeInUp 0.3s ease",
                    }}>
                        ✅ Đã nhân bản phần tử!
                    </div>
                )}

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
                        {/* Sprint 22: Grid toggle */}
                        <div style={{ width: 1, height: 16, background: "#e5e7eb" }} />
                        <button
                            title={showGrid ? "Ẩn lưới (Grid Off)" : "Hiện lưới (Grid On)"}
                            onClick={() => setShowGrid(g => !g)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: showGrid ? "#3b82f6" : "#6b7280", padding: 0, display: "flex", transition: "color 0.2s" }}
                        >
                            <Grid size={16} />
                        </button>
                        {/* Sprint 26: Snap toggle */}
                        <button
                            title={snapToGrid ? "Snap Off" : "Snap On (10px)"}
                            onClick={() => setSnapToGrid(s => !s)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: snapToGrid ? "#f59e0b" : "#6b7280", padding: 0, display: "flex", transition: "color 0.2s", fontSize: 12, fontWeight: 700 }}
                        >
                            🧲
                        </button>
                        {/* Sprint 29: Minimap toggle */}
                        <button
                            title={showMinimap ? "Ẩn minimap" : "Hiện minimap"}
                            onClick={() => setShowMinimap(m => !m)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: showMinimap ? "#8b5cf6" : "#6b7280", padding: 0, display: "flex", transition: "color 0.2s", fontSize: 11, fontWeight: 700 }}
                        >
                            🗺️
                        </button>
                        {/* Sprint 26: Canvas dimension badge */}
                        <div style={{ width: 1, height: 16, background: "#e5e7eb" }} />
                        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                            {state.width}×{state.height}
                        </span>
                        {/* Sprint 28: X/Y position indicator */}
                        {selectedEl && (
                            <>
                                <div style={{ width: 1, height: 16, background: "#e5e7eb" }} />
                                <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                                    X:{Math.round(selectedEl.x)} Y:{Math.round(selectedEl.y)}
                                </span>
                            </>
                        )}
                        {/* Sprint 28: Grid pattern selector */}
                        {showGrid && (
                            <select
                                value={gridPattern}
                                onChange={e => setGridPattern(e.target.value as "dots" | "lines" | "cross")}
                                title="Kiểu lưới"
                                style={{
                                    padding: "2px 4px", border: "1px solid #e5e7eb", borderRadius: 6,
                                    fontSize: 10, color: "#6b7280", background: "#f9fafb",
                                    cursor: "pointer", outline: "none",
                                }}
                            >
                                <option value="dots">⊡ Dots</option>
                                <option value="lines">⊞ Lines</option>
                                <option value="cross">✚ Cross</option>
                            </select>
                        )}
                    </div>

                    {/* Sprint 29: Minimap preview */}
                    {showMinimap && (
                        <div style={{
                            position: "absolute", bottom: 70, right: 70, zIndex: 150,
                            width: 160, height: Math.round(160 * (state.height / state.width)),
                            background: "#fff", borderRadius: 10,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                            border: "1px solid #e5e7eb", overflow: "hidden",
                        }}>
                            <div style={{ position: "relative", width: "100%", height: "100%", background: state.background || "#fff" }}>
                                {state.elements.map(el => {
                                    const scaleX = 160 / state.width;
                                    const scaleY = (160 * (state.height / state.width)) / state.height;
                                    return (
                                        <div key={el.id} style={{
                                            position: "absolute",
                                            left: el.x * scaleX, top: el.y * scaleY,
                                            width: el.width * scaleX, height: el.height * scaleY,
                                            background: el.type === "text" ? "#3b82f6" : el.type === "image" ? "#10b981" : "#f59e0b",
                                            opacity: el.id === state.selectedId ? 1 : 0.4,
                                            borderRadius: 1, border: el.id === state.selectedId ? "1px solid #fff" : "none",
                                        }} />
                                    );
                                })}
                            </div>
                            <div style={{ position: "absolute", bottom: 2, left: 0, right: 0, textAlign: "center", fontSize: 8, color: "#9ca3af" }}>
                                Minimap
                            </div>
                        </div>
                    )}

                    {/* Sprint 30: Status bar — bottom status strip */}
                    <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 120,
                        height: 24, background: "linear-gradient(90deg, #1e293b, #334155)",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "0 16px", fontSize: 10, color: "#94a3b8",
                        fontFamily: "monospace",
                    }}>
                        <span>⚡ {lastAction}</span>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <span>{state.elements.length} elements</span>
                            <span>{state.zoom}%</span>
                            <span>{saveStatus === "saved" ? "✅ Saved" : saveStatus === "saving" ? "💾 Saving..." : "⚠️ Unsaved"}</span>
                            <button
                                onClick={() => setShowStats(s => !s)}
                                style={{ background: "none", border: "none", color: showStats ? "#60a5fa" : "#64748b", cursor: "pointer", fontSize: 10, fontFamily: "monospace" }}
                            >
                                📊 Stats
                            </button>
                        </div>
                    </div>

                    {/* Sprint 30: Stats panel */}
                    {showStats && (
                        <div style={{
                            position: "absolute", bottom: 30, right: 24, zIndex: 200,
                            background: "#1e293b", color: "#e2e8f0", borderRadius: 12,
                            padding: "14px 18px", fontSize: 11, lineHeight: 1.8,
                            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                            fontFamily: "monospace", minWidth: 200,
                        }}>
                            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: "#60a5fa" }}>📊 Editor Stats</div>
                            <div>📐 Canvas: {state.width}×{state.height}px</div>
                            <div>🔍 Zoom: {state.zoom}%</div>
                            <div>📦 Elements: {state.elements.length}</div>
                            <div>📝 Text: {state.elements.filter(e => e.type === "text").length}</div>
                            <div>🖼️ Image: {state.elements.filter(e => e.type === "image").length}</div>
                            <div>🧩 Widget: {state.elements.filter(e => e.type === "widget").length}</div>
                            <div>🔒 Locked: {state.elements.filter(e => e.locked).length}</div>
                            <div>💾 Status: {saveStatus === "saved" ? "Đã lưu" : saveStatus === "saving" ? "Đang lưu..." : "Chưa lưu"}</div>
                            <div>⚡ Action: {lastAction}</div>
                        </div>
                    )}

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
                    allElements={state.elements}
                    dispatch={dispatch}
                    background={state.background}
                    particleEffect={state.particleEffect ?? "none"}
                    canvasWidth={state.width}
                    onReplaceImage={() => replaceImageInputRef.current?.click()}
                    onShowFontPicker={() => setShowFontPicker(true)}
                    showFontPicker={showFontPicker}
                    onCloseFontPicker={() => setShowFontPicker(false)}
                    onSelectElement={(id) => dispatch({ type: "SELECT", id })}
                />
            </div>

            {/* Sprint 25: QR Code Share Modal */}
            {showQR && (() => {
                const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/i/${projectSlug}`;
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
                return (
                    <div onClick={() => setShowQR(false)} style={{
                        position: "fixed", inset: 0, zIndex: 9999,
                        background: "rgba(0,0,0,0.5)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        backdropFilter: "blur(4px)",
                    }}>
                        <div onClick={e => e.stopPropagation()} style={{
                            background: "#fff", borderRadius: 16,
                            padding: "28px 32px", maxWidth: 360, width: "90%",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", textAlign: "center",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>📱 QR Code Chia sẻ</h3>
                                <button onClick={() => setShowQR(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af" }}>✕</button>
                            </div>
                            <img src={qrUrl} alt="QR Code" style={{ width: 200, height: 200, margin: "16px auto", borderRadius: 8, border: "1px solid #e5e7eb" }} />
                            <p style={{ fontSize: 12, color: "#6b7280", wordBreak: "break-all", margin: "12px 0" }}>{shareUrl}</p>
                            <button
                                onClick={async () => { await navigator.clipboard.writeText(shareUrl); alert("✅ Đã sao chép link!"); }}
                                style={{
                                    width: "100%", padding: "10px 0", borderRadius: 10,
                                    border: "none", background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                    color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                                }}
                            >📋 Sao chép link mời</button>
                        </div>
                    </div>
                );
            })()}

            {/* Sprint 24: Keyboard Shortcut Cheatsheet Modal */}
            {showShortcuts && (
                <div onClick={() => setShowShortcuts(false)} style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    backdropFilter: "blur(4px)",
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: "#fff", borderRadius: 16,
                        padding: "28px 32px", maxWidth: 480, width: "90%",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>⌨️ Phím tắt</h3>
                            <button onClick={() => setShowShortcuts(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af" }}>✕</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", fontSize: 13 }}>
                            {[
                                ["⌘Z", "Hoàn tác (Undo)"],
                                ["⌘⇧Z / ⌘Y", "Làm lại (Redo)"],
                                ["⌘D", "Nhân bản"],
                                ["⌘C / ⌘V", "Sao chép / Dán"],
                                ["Delete", "Xóa phần tử"],
                                ["Escape", "Bỏ chọn"],
                                ["⌘+ / ⌘−", "Phóng to / Thu nhỏ"],
                                ["⌘0", "Zoom 100%"],
                                ["⌘1", "Zoom vừa canvas"],
                                ["Arrow ↑↓←→", "Di chuyển 1px"],
                                ["Shift+Arrow", "Di chuyển 10px"],
                                ["⌘A", "Chọn phần tử đầu"],
                                ["⌘/", "Hiện bảng phím tắt"],
                                ["Right-click", "Menu ngữ cảnh"],
                            ].map(([key, desc]) => (
                                <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                                    <kbd style={{ background: "#f3f4f6", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontFamily: "monospace", fontWeight: 600, color: "#374151" }}>{key}</kbd>
                                    <span style={{ color: "#6b7280" }}>{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
