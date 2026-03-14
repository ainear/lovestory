"use client";

/**
 * CanvasInvitation v2 — Multi-section scrollable published invitation.
 * Sprint 56: Full-page scroll with per-section IntersectionObserver,
 *            parallax background, sticky music, floating RSVP CTA.
 * Replaces the old single-card static render.
 */

import { useMemo, useState, useRef, useCallback, useEffect } from "react";

/* ═══════ Types ═══════ */

export interface ElementAnimationData {
    entrance?: "none" | "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "zoomIn" | "bounceIn";
    loop?: "none" | "pulse" | "float" | "shake";
}

export interface CanvasElementData {
    id: string;
    type: "text" | "image" | "sticker" | "shape" | "widget";
    x: number; y: number;
    width: number; height: number;
    rotation: number; opacity: number;
    zIndex: number; locked: boolean;
    animation?: ElementAnimationData;
    props: {
        text?: string; fontSize?: number; fontFamily?: string;
        color?: string; textAlign?: "left" | "center" | "right";
        fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; lineHeight?: number;
        src?: string; objectFit?: "cover" | "contain"; borderRadius?: number; opacity?: number;
        filter?: string; boxShadow?: string;
        borderWidth?: number; borderColor?: string; borderStyle?: string;
    };
}

export interface CanvasData {
    version: number;
    canvas: { width: number; height: number; bg: string };
    elements: CanvasElementData[];
    meta?: { musicUrl?: string; musicName?: string };
    effects?: { particleEffect?: string; introEffect?: string };
}

type ParticleType = "hearts" | "confetti" | "snow" | "petals" | "none";

/* ═══════ Sub-components ═══════ */

const PARTICLE_CHARS: Record<string, string[]> = {
    hearts: ["❤️", "💕", "💗", "💖", "💞"],
    confetti: ["🎊", "🎉", "✨", "⭐", "🌟"],
    snow: ["❄️", "❅", "❆", "✦", "·"],
    petals: ["🌸", "🌺", "🌹", "💮", "🌼"],
};

function ParticleOverlay({ effect }: { effect: ParticleType }) {
    if (effect === "none" || !PARTICLE_CHARS[effect]) return null;
    const chars = PARTICLE_CHARS[effect];
    return (
        <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 900 }}>
            {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} style={{
                    position: "absolute",
                    left: `${(i * 17 + 3) % 95}%`,
                    top: -20,
                    fontSize: 12 + (i % 4) * 4,
                    animation: `particleFall ${4 + (i % 3) * 2}s linear ${(i * 0.6) % 5}s infinite`,
                    opacity: 0,
                }}>
                    {chars[i % chars.length]}
                </span>
            ))}
        </div>
    );
}

/** Scroll-in-view reveal wrapper */
function ScrollSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: `opacity 0.8s cubic-bezier(.25,.46,.45,.94) ${delay}s, transform 0.8s cubic-bezier(.25,.46,.45,.94) ${delay}s`,
        }}>
            {children}
        </div>
    );
}

/* ═══════ Section Splitter ═══════ */

interface Section {
    elements: CanvasElementData[];
    yStart: number;
    yEnd: number;
}

/** Split elements into sections by Y-position bands (each ~SECTION_H px tall) */
function splitIntoSections(elements: CanvasElementData[], canvasHeight: number): Section[] {
    const SECTION_H = Math.min(400, canvasHeight / 2); // ~2-4 sections
    const sorted = [...elements].sort((a, b) => a.y - b.y);
    const sections: Section[] = [];
    let currentSection: Section = { elements: [], yStart: 0, yEnd: SECTION_H };

    for (const el of sorted) {
        if (el.y >= currentSection.yEnd && currentSection.elements.length > 0) {
            sections.push(currentSection);
            const newStart = currentSection.yEnd;
            currentSection = { elements: [], yStart: newStart, yEnd: newStart + SECTION_H };
        }
        // Adjust yEnd to fit this element
        const elBottom = el.y + el.height;
        if (elBottom > currentSection.yEnd) currentSection.yEnd = elBottom + 20;
        currentSection.elements.push(el);
    }
    if (currentSection.elements.length > 0) sections.push(currentSection);

    return sections;
}

/* ═══════ Element Renderer ═══════ */

function RenderElement({ el, sectionYStart, idx }: { el: CanvasElementData; sectionYStart: number; idx: number }) {
    const entranceAnim = el.animation?.entrance && el.animation.entrance !== "none"
        ? `${el.animation.entrance} 0.6s ease-out ${idx * 0.12}s both`
        : undefined;
    const loopAnim = el.animation?.loop && el.animation.loop !== "none"
        ? `el${el.animation.loop.charAt(0).toUpperCase() + el.animation.loop.slice(1)} 2s ease-in-out infinite`
        : undefined;
    const animStr = [entranceAnim, loopAnim].filter(Boolean).join(", ") || undefined;

    // Remap Y position relative to section
    const relativeY = el.y - sectionYStart;

    if (el.type === "text") {
        const p = el.props;
        return (
            <div style={{
                position: "absolute", left: el.x, top: relativeY,
                width: el.width, minHeight: el.height,
                zIndex: el.zIndex, opacity: el.opacity,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                fontSize: p.fontSize ?? 24, fontFamily: p.fontFamily ?? "serif",
                color: p.color ?? "#1f2937", textAlign: p.textAlign ?? "center",
                fontWeight: p.fontWeight ?? "normal", fontStyle: p.fontStyle ?? "normal",
                lineHeight: p.lineHeight ?? 1.4, padding: "2px 4px",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                boxSizing: "border-box", pointerEvents: "none", userSelect: "none",
                animation: animStr,
                boxShadow: p.boxShadow || undefined,
            }}>
                {p.text ?? ""}
            </div>
        );
    }

    if (el.type === "image") {
        const p = el.props;
        if (!p.src) return null;
        return (
            <div style={{
                position: "absolute", left: el.x, top: relativeY,
                width: el.width, height: el.height, zIndex: el.zIndex,
                borderRadius: p.borderRadius ?? 12, overflow: "hidden",
                opacity: el.opacity,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                animation: animStr,
                boxShadow: p.boxShadow || undefined,
                border: p.borderWidth ? `${p.borderWidth}px ${p.borderStyle || "solid"} ${p.borderColor || "transparent"}` : undefined,
            }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" style={{
                    width: "100%", height: "100%",
                    objectFit: p.objectFit ?? "cover", display: "block",
                    filter: p.filter || undefined,
                }} />
            </div>
        );
    }

    /* ── Sprint 57: Widget rendering on published page ── */
    if (el.type === "widget" || (el.props as Record<string, unknown>).widgetType) {
        const p = el.props as Record<string, unknown>;
        const wt = (p.widgetType ?? "countdown") as string;
        const wrapStyle: React.CSSProperties = {
            position: "absolute", left: el.x, top: relativeY,
            width: el.width, height: el.height, zIndex: el.zIndex,
            opacity: el.opacity,
            transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
            animation: animStr,
            fontFamily: "'Inter', sans-serif",
        };

        if (wt === "countdown") {
            const target = p.targetDate ? new Date(p.targetDate as string).getTime() : Date.now() + 30 * 86400000;
            const diff = Math.max(0, target - Date.now());
            const blocks = [
                { v: Math.floor(diff / 86400000), l: "Ngày" },
                { v: Math.floor((diff % 86400000) / 3600000), l: "Giờ" },
                { v: Math.floor((diff % 3600000) / 60000), l: "Phút" },
                { v: Math.floor((diff % 60000) / 1000), l: "Giây" },
            ];
            return (
                <div style={{ ...wrapStyle, background: "linear-gradient(135deg, rgba(253,242,248,0.95), rgba(252,231,243,0.95))", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, backdropFilter: "blur(8px)" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#831843", margin: 0, letterSpacing: 2, textTransform: "uppercase" }}>{(p.label as string) || "ĐẾM NGƯỢC"}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                        {blocks.map(b => (
                            <div key={b.l} style={{ textAlign: "center", background: "#fff", borderRadius: 10, padding: "8px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: 52 }}>
                                <p style={{ fontSize: 22, fontWeight: 800, color: "#e11d48", margin: 0 }}>{String(b.v).padStart(2, "0")}</p>
                                <p style={{ fontSize: 9, color: "#9ca3af", margin: 0 }}>{b.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (wt === "map") {
            const venueName = (p.venueName || p.label || "Vị trí tiệc cưới") as string;
            const venueAddr = (p.venueAddress || "") as string;
            const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddr)}`;
            return (
                <div style={{ ...wrapStyle, background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                    <div style={{ flex: 1, background: "linear-gradient(135deg, #d1fae5, #ecfdf5)", display: "flex", alignItems: "center", justifyContent: "center", height: "60%" }}>
                        <span style={{ fontSize: 36 }}>📍</span>
                    </div>
                    <div style={{ padding: "10px 14px" }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: 0 }}>{venueName}</p>
                        {venueAddr && <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 8px" }}>{venueAddr}</p>}
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "8px", borderRadius: 10, border: "none", background: "#10b981", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>🗺️ Chỉ đường</a>
                    </div>
                </div>
            );
        }

        if (wt === "gift") {
            return (
                <div style={{ ...wrapStyle, background: "linear-gradient(135deg, #fef3c7, #fefde8)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, border: "1px solid #fcd34d" }}>
                    <span style={{ fontSize: 28 }}>💰</span>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#92400e", margin: 0 }}>{(p.label as string) || "Phong bì mừng cưới"}</p>
                    {Boolean(p.bankName) && (
                        <div style={{ background: "#fff", borderRadius: 10, padding: "8px 16px", textAlign: "center", width: "100%", boxSizing: "border-box" }}>
                            <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{String(p.bankName)}</p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "2px 0", letterSpacing: 1 }}>{(p.accountNumber as string) || "0123456789"}</p>
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{(p.accountName as string) || ""}</p>
                        </div>
                    )}
                </div>
            );
        }

        if (wt === "qr") {
            const qrUrl = `https://img.vietqr.io/image/${(p.bankBin || "970422") as string}-${(p.accountNumber || "0123456789") as string}-qr_only.png?amount=${(p.amount || "") as string}&addInfo=${encodeURIComponent((p.message || "") as string)}`;
            return (
                <div style={{ ...wrapStyle, background: "#fff", borderRadius: 16, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0 }}>{(p.label as string) || "Quét mã QR"}</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt="QR" style={{ width: 120, height: 120, borderRadius: 8 }} />
                    {Boolean(p.bankName) && <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>{String(p.bankName)} — {String(p.accountName || "")}</p>}
                </div>
            );
        }

        if (wt === "calendar") {
            const targetDate = p.targetDate ? new Date(p.targetDate as string) : new Date();
            const month = targetDate.toLocaleString("vi-VN", { month: "long" });
            const year = targetDate.getFullYear();
            const day = targetDate.getDate();
            return (
                <div style={{ ...wrapStyle, background: "#fff", borderRadius: 16, padding: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 8px", textTransform: "capitalize" }}>{month} {year}</p>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ff6b9d", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 28, fontWeight: 800 }}>{day}</div>
                </div>
            );
        }

        if (wt === "guestname") {
            return (
                <div style={{ ...wrapStyle, background: "linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.9))", borderRadius: 16, border: "1px dashed #d946ef", padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9333ea", margin: 0, textTransform: "uppercase", letterSpacing: 2 }}>{(p.guestNameLabel as string) || "Trân trọng kính mời"}</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#7c3aed", margin: 0, fontStyle: "italic", fontFamily: "'Great Vibes', cursive" }}>Tên khách mời</p>
                </div>
            );
        }

        if (wt === "call") {
            const phone = (p.phoneNumber || "0909 xxx xxx") as string;
            return (
                <div style={{ ...wrapStyle, background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderRadius: 16, border: "1px solid #6ee7b7", padding: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <span style={{ fontSize: 28 }}>📞</span>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#065f46", margin: 0 }}>{(p.label as string) || "Liên hệ"}</p>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} style={{ padding: "8px 20px", borderRadius: 99, border: "none", background: "#10b981", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>📱 Gọi {phone}</a>
                </div>
            );
        }

        if (wt === "youtube") {
            const url = (p.youtubeUrl ?? "") as string;
            const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            const videoId = match?.[1];
            if (!videoId) return <div style={wrapStyle} />;
            return (
                <div style={{ ...wrapStyle, borderRadius: 16, overflow: "hidden" }}>
                    <iframe src={`https://www.youtube.com/embed/${videoId}?rel=0`} style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay; encrypted-media" loading="lazy" />
                </div>
            );
        }

        // Fallback for unknown widget types
        return <div style={wrapStyle} />;
    }

    return null;
}

/* ═══════ Published Page Widget Renderers ═══════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CountdownRenderer({ props: p }: { props: Record<string, any> }) {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        function calc() {
            const diff = new Date(p.targetDate || "2026-05-28").getTime() - Date.now();
            if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            return {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            };
        }
        setTime(calc());
        const timer = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(timer);
    }, [p.targetDate]);

    const boxes = [
        { value: time.days, unit: "Ngày" },
        { value: time.hours, unit: "Giờ" },
        { value: time.minutes, unit: "Phút" },
        { value: time.seconds, unit: "Giây" },
    ];

    return (
        <div style={{ padding: 20, background: p.background || "rgba(255,255,255,0.6)", borderRadius: p.borderRadius ?? 16, textAlign: "center", width: "100%", boxSizing: "border-box" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: p.labelColor || "#9f1239", margin: "0 0 12px", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                {p.label || "Đếm ngược đến ngày cưới"}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                {boxes.map(b => (
                    <div key={b.unit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: p.fontSize ?? 28, fontWeight: 700, color: p.color || "#831843", fontFamily: "'Cormorant Garamond', serif", minWidth: 48, lineHeight: 1 }}>
                            {String(b.value).padStart(2, "0")}
                        </span>
                        <span style={{ fontSize: 10, color: p.labelColor || "#9f1239", fontWeight: 500, textTransform: "uppercase", letterSpacing: 1 }}>
                            {b.unit}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const WEEKDAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS_VI = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CalendarRenderer({ props: p }: { props: Record<string, any> }) {
    const d = new Date(p.targetDate || "2026-05-28");
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days: (number | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let dd = 1; dd <= daysInMonth; dd++) days.push(dd);

    return (
        <div style={{ padding: 16, background: p.background || "rgba(255,255,255,0.7)", borderRadius: p.borderRadius ?? 16, width: "100%", boxSizing: "border-box", maxWidth: 320, margin: "0 auto" }}>
            <p style={{ textAlign: "center", margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: p.accentColor || "#ff6b9d", fontFamily: "'Playfair Display', serif" }}>
                {MONTHS_VI[month]} {year}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                {WEEKDAYS_VI.map(w => (
                    <div key={w} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: p.accentColor || "#ff6b9d", padding: "4px 0" }}>{w}</div>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {days.map((dd, i) => {
                    const isTarget = dd === day;
                    return (
                        <div key={i} style={{ textAlign: "center", padding: "6px 0", fontSize: 12, color: isTarget ? "#fff" : dd ? (p.textColor || "#374151") : "transparent", fontWeight: isTarget ? 700 : 400, background: isTarget ? (p.accentColor || "#ff6b9d") : "transparent", borderRadius: isTarget ? "50%" : 0, position: "relative" }}>
                            {dd ?? ""}
                            {isTarget && <span style={{ position: "absolute", top: -6, right: -2, fontSize: 10 }}>❤️</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════ Craft.js v2 Static Renderer ═══════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CraftNode { type: { resolvedName: string }; props: Record<string, any>; nodes?: string[]; linkedNodes?: Record<string, string>; }
interface CraftState { [nodeId: string]: CraftNode; }

/** Parse craft.js serialized state and render statically (no drag-drop, view only) */
function CraftV2Renderer({ craftState, background }: { craftState: string; background: string }) {
    const nodes: CraftState = useMemo(() => {
        try { return JSON.parse(craftState); } catch { return {}; }
    }, [craftState]);

    /** Recursively render a craft.js node tree */
    function renderNode(nodeId: string): React.ReactNode {
        const node = nodes[nodeId];
        if (!node) return null;
        const name = node.type?.resolvedName || "";
        const p = node.props || {};
        const childIds = node.nodes || [];

        if (name === "CraftText") {
            return (
                <div key={nodeId} style={{
                    padding: "4px 8px",
                    fontSize: p.fontSize ?? 16,
                    fontFamily: p.fontFamily ?? "serif",
                    fontWeight: p.fontWeight ?? "normal",
                    fontStyle: p.fontStyle ?? "normal",
                    color: p.color ?? "#1f2937",
                    textAlign: p.textAlign ?? "center",
                    lineHeight: p.lineHeight ?? 1.5,
                    letterSpacing: p.letterSpacing ?? 0,
                    opacity: p.opacity ?? 1,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}>
                    {p.text ?? ""}
                </div>
            );
        }

        if (name === "CraftImage") {
            return (
                <div key={nodeId} style={{ padding: 4, display: "flex", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={p.src || "/placeholder-couple.png"}
                        alt="Wedding"
                        style={{
                            width: "100%",
                            maxWidth: 320,
                            height: "auto",
                            objectFit: p.objectFit ?? "cover",
                            borderRadius: p.borderRadius ?? 12,
                            border: (p.borderWidth || 0) > 0 ? `${p.borderWidth}px solid ${p.borderColor || "transparent"}` : undefined,
                            opacity: p.opacity ?? 1,
                            boxShadow: p.shadow ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
                            display: "block",
                        }}
                    />
                </div>
            );
        }

        if (name === "CraftContainer" || name === "RootContainer") {
            const isRoot = name === "RootContainer";
            const bg = isRoot ? background : (p.background || "transparent");
            const containerStyle: React.CSSProperties = {
                background: bg,
                padding: p.padding ?? (isRoot ? 0 : 16),
                minHeight: isRoot ? undefined : (p.minHeight ?? 100),
                display: "flex",
                flexDirection: (p.flexDirection as React.CSSProperties["flexDirection"]) ?? "column",
                alignItems: p.alignItems ?? "center",
                justifyContent: p.justifyContent ?? "center",
                gap: p.gap ?? 8,
                width: "100%",
                boxSizing: "border-box",
            };
            // Also render linked nodes (sections inside root)
            const linkedIds = Object.values(node.linkedNodes || {}) as string[];
            const allChildIds = [...childIds, ...linkedIds];
            return (
                <div key={nodeId} style={containerStyle}>
                    {allChildIds.map(cid => renderNode(cid))}
                </div>
            );
        }

        if (name === "CraftCountdown") {
            return <CountdownRenderer key={nodeId} props={p} />;
        }

        if (name === "CraftCalendar") {
            return <CalendarRenderer key={nodeId} props={p} />;
        }

        if (name === "CraftMap") {
            const embedUrl = `https://www.google.com/maps?q=${p.lat ?? 10.7769},${p.lng ?? 106.7009}&z=${p.zoom ?? 15}&output=embed`;
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat ?? 10.7769},${p.lng ?? 106.7009}`;
            return (
                <div key={nodeId} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, boxSizing: "border-box" }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#374151", margin: 0, fontFamily: "'Playfair Display', serif" }}>📍 {p.venueName || "Nhà hàng"}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{p.address || ""}</p>
                    <div style={{ width: "100%", height: p.height ?? 200, borderRadius: p.borderRadius ?? 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                        <iframe src={embedUrl} width="100%" height={p.height ?? 200} style={{ border: 0 }} loading="lazy" title="Wedding venue map" />
                    </div>
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer" style={{
                        display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 24,
                        background: p.accentColor || "#ff6b9d", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}>🧭 Chỉ đường</a>
                </div>
            );
        }

        if (name === "CraftRSVP") {
            return (
                <div key={nodeId} style={{ padding: 20, background: p.background || "rgba(255,255,255,0.7)", borderRadius: p.borderRadius ?? 16, width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: p.accentColor || "#ff6b9d", margin: 0, textAlign: "center", fontFamily: "'Playfair Display', serif" }}>💌 {p.title || "Xác nhận tham dự"}</p>
                    <p style={{ fontSize: 12, color: p.textColor || "#374151", margin: 0, textAlign: "center", opacity: 0.7 }}>{p.subtitle || ""}</p>
                    <input type="text" placeholder="Họ và tên" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13, width: "100%", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", background: p.accentColor || "#ff6b9d", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✅ Tham dự</button>
                        <button style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", background: "#f3f4f6", color: p.textColor || "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>❌ Vắng mặt</button>
                    </div>
                    <button style={{ padding: "12px 20px", borderRadius: 24, border: "none", background: p.accentColor || "#ff6b9d", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Gửi xác nhận</button>
                </div>
            );
        }

        // Fallback: render children
        return <div key={nodeId}>{childIds.map(cid => renderNode(cid))}</div>;
    }

    return <>{renderNode("ROOT")}</>;
}

/* ═══════ Main Component ═══════ */

interface CanvasInvitationProps {
    canvasJson: string;
    guestName?: string;
    projectId?: string;
    showWatermark?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCanvasJson(raw: string): any | null {
    try { return JSON.parse(raw); } catch { return null; }
}

export function CanvasInvitation({ canvasJson, guestName, projectId, showWatermark = true }: CanvasInvitationProps) {
    const data = useMemo(() => parseCanvasJson(canvasJson), [canvasJson]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [copied, setCopied] = useState(false);
    const [rsvpName, setRsvpName] = useState(guestName || "");
    const [rsvpAttend, setRsvpAttend] = useState<"yes" | "no" | null>(null);
    const [rsvpGuests, setRsvpGuests] = useState("1");
    const [rsvpNote, setRsvpNote] = useState("");
    const [rsvpSent, setRsvpSent] = useState(false);
    const [rsvpSending, setRsvpSending] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Detect v2 craft.js format
    const isCraftV2 = data?.engine === "craftjs" && data?.craftState;

    const musicUrl = isCraftV2 ? (data?.meta?.musicUrl || "") : (data?.meta?.musicUrl || "");
    const musicName = isCraftV2 ? (data?.meta?.musicName || "") : (data?.meta?.musicName || "");
    const particleEffect = ((data?.effects?.particleEffect || "none")) as ParticleType;
    const canvasBg = data?.canvas?.bg || "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)";

    const toggleMusic = useCallback(() => {
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

    // Auto-play music on first interaction
    useEffect(() => {
        const handleFirst = () => {
            if (musicUrl && !audioRef.current) {
                audioRef.current = new Audio(musicUrl);
                audioRef.current.loop = true;
                audioRef.current.play().catch(() => { });
                setIsPlaying(true);
            }
            document.removeEventListener("click", handleFirst);
            document.removeEventListener("touchstart", handleFirst);
        };
        if (musicUrl) {
            document.addEventListener("click", handleFirst, { once: true });
            document.addEventListener("touchstart", handleFirst, { once: true });
        }
        return () => {
            document.removeEventListener("click", handleFirst);
            document.removeEventListener("touchstart", handleFirst);
        };
    }, [musicUrl]);

    const handleRSVP = useCallback(async () => {
        if (!rsvpName.trim() || !rsvpAttend) return;
        setRsvpSending(true);
        try {
            const res = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    guestName: rsvpName.trim(),
                    status: rsvpAttend === "yes" ? "confirmed" : "declined",
                    guestCount: parseInt(rsvpGuests) || 1,
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: "Lỗi gửi RSVP" })) as { error?: string };
                alert(err.error || "Gửi RSVP thất bại, vui lòng thử lại.");
                setRsvpSending(false);
                return;
            }
            setRsvpSent(true);
            if (projectId) {
                fetch("/api/rsvp/notify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ projectId, guestName: rsvpName.trim(), attending: rsvpAttend === "yes" }),
                }).catch(() => { });
            }
        } catch { alert("Không thể gửi RSVP. Vui lòng thử lại."); }
        setRsvpSending(false);
    }, [rsvpName, rsvpAttend, rsvpGuests, projectId]);

    const copyLink = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    if (!data) return null;

    /* ── V1 branch: old format with flat elements array ── */
    const elements: CanvasElementData[] | undefined = !isCraftV2 ? data.elements : undefined;
    const canvas = data.canvas || { width: 390, height: 5000, bg: canvasBg };
    const sections = elements ? splitIntoSections(elements, canvas.height) : [];

    return (
        <div style={{ minHeight: "100vh", background: "#000", fontFamily: "'Inter', sans-serif" }}>
            {/* Global styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Lora:ital,wght@0,400;1,400&family=Inter:wght@400;600;700&display=swap');
                @keyframes particleFall {
                    0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
                    10% { opacity: 1; }
                    90% { opacity: 0.8; }
                    100% { opacity: 0; transform: translateY(100vh) rotate(360deg); }
                }
                @keyframes elPulse { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: .7; transform: scale(1.03) } }
                @keyframes elFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
                @keyframes elShake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-3px) } 75% { transform: translateX(3px) } }
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-30px) } to { opacity: 1; transform: translateY(0) } }
                @keyframes slideLeft { from { opacity: 0; transform: translateX(40px) } to { opacity: 1; transform: translateX(0) } }
                @keyframes slideRight { from { opacity: 0; transform: translateX(-40px) } to { opacity: 1; transform: translateX(0) } }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.7) } to { opacity: 1; transform: scale(1) } }
                @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3) } 50% { transform: scale(1.05) } 70% { transform: scale(0.95) } 100% { opacity: 1; transform: scale(1) } }
                @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .6 } }
                @keyframes spinVinyl { to { transform: rotate(360deg) } }
                @keyframes slideInUp { from { opacity: 0; transform: translateY(100%) } to { opacity: 1; transform: translateY(0) } }
                html { scroll-behavior: smooth; }
                body { overscroll-behavior-y: none; }
            `}</style>

            {/* Particle effects — fixed full-screen */}
            <ParticleOverlay effect={particleEffect} />

            {/* Guest name hero banner */}
            {guestName && (
                <ScrollSection>
                    <div style={{
                        textAlign: "center", padding: "48px 24px 24px",
                        background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
                    }}>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", letterSpacing: 2, textTransform: "uppercase" }}>
                            Thiệp mời dành riêng cho
                        </p>
                        <p style={{
                            fontSize: 28, fontFamily: "'Great Vibes', 'Dancing Script', cursive",
                            color: "#fff", margin: 0,
                            textShadow: "0 2px 16px rgba(255,107,157,0.5)",
                        }}>
                            {guestName}
                        </p>
                    </div>
                </ScrollSection>
            )}

            {/* ═══ Multi-section scrollable invitation ═══ */}
            {isCraftV2 ? (
                /* V2: craft.js static renderer */
                <ScrollSection delay={0.15}>
                    <div style={{
                        width: "100%",
                        maxWidth: 420,
                        margin: "0 auto",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
                    }}>
                        <CraftV2Renderer craftState={data.craftState} background={canvasBg} />
                    </div>
                </ScrollSection>
            ) : (
                /* V1: old absolute positioning sections */
                sections.map((section, sIdx) => {
                    const sectionHeight = section.yEnd - section.yStart;
                    return (
                        <ScrollSection key={sIdx} delay={sIdx * 0.15}>
                            <div style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: 420,
                                minHeight: Math.max(sectionHeight, 200),
                                margin: "0 auto",
                                background: canvas.bg,
                                overflow: "hidden",
                                ...(sIdx === 0 ? { borderRadius: "16px 16px 0 0", paddingTop: guestName ? 0 : 24 } : {}),
                                ...(sIdx === sections.length - 1 ? { borderRadius: "0 0 16px 16px", paddingBottom: 24 } : {}),
                            }}>
                                {section.elements.sort((a, b) => a.zIndex - b.zIndex).map((el, eIdx) => (
                                    <RenderElement key={el.id} el={el} sectionYStart={section.yStart} idx={eIdx} />
                                ))}
                            </div>
                        </ScrollSection>
                    );
                })
            )}

            {/* ═══ Share Bar ═══ */}
            <ScrollSection delay={0.2}>
                <div style={{
                    maxWidth: 420, margin: "32px auto 0", padding: "0 16px",
                    display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
                }}>
                    <button
                        onClick={() => navigator.share?.({ url: window.location.href })}
                        style={{
                            padding: "12px 24px", borderRadius: 50,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            border: "none", color: "#fff", fontSize: 14,
                            fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "0 4px 16px rgba(255,107,157,.35)",
                        }}
                    >
                        💌 Chia sẻ thiệp
                    </button>
                    <button onClick={copyLink} style={{
                        padding: "12px 20px", borderRadius: 50,
                        background: copied ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.1)",
                        border: "1px solid " + (copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.2)"),
                        color: copied ? "#10b981" : "#e5e7eb", fontSize: 14, cursor: "pointer",
                        fontWeight: copied ? 600 : 400, backdropFilter: "blur(8px)",
                    }}>
                        {copied ? "✅ Đã copy!" : "🔗 Sao chép link"}
                    </button>
                </div>
            </ScrollSection>

            {/* ═══ RSVP Section ═══ */}
            <ScrollSection delay={0.3}>
                <div data-rsvp-section style={{
                    maxWidth: 420, margin: "32px auto 0", padding: "0 16px 80px",
                }}>
                    <div style={{
                        background: "rgba(255,255,255,0.95)", borderRadius: 20,
                        boxShadow: "0 8px 32px rgba(0,0,0,.12)",
                        padding: 28, backdropFilter: "blur(12px)",
                    }}>
                        {rsvpSent ? (
                            <div style={{ textAlign: "center", padding: "24px 0" }}>
                                <p style={{ fontSize: 48, margin: "0 0 12px" }}>🎉</p>
                                <p style={{ fontSize: 20, fontWeight: 700, color: "#1f2937" }}>Cảm ơn bạn!</p>
                                <p style={{ fontSize: 14, color: "#6b7280", margin: "8px 0 0" }}>
                                    Chúng tôi rất mong được gặp{" "}
                                    <strong>{rsvpAttend === "yes" ? "bạn" : "nhưng hiểu vì bạn bận"}</strong> 💕
                                </p>
                            </div>
                        ) : (
                            <>
                                <p style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", margin: "0 0 4px", textAlign: "center" }}>
                                    📝 Xác nhận tham dự
                                </p>
                                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px", textAlign: "center" }}>
                                    Vui lòng xác nhận để chúng tôi chuẩn bị tốt nhất
                                </p>

                                {/* Name */}
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                                        Họ và tên *
                                    </label>
                                    <input
                                        value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                        style={{
                                            width: "100%", padding: "12px 14px", borderRadius: 12,
                                            border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
                                            boxSizing: "border-box", transition: "border-color 0.2s",
                                        }}
                                        onFocus={e => e.target.style.borderColor = "#ff6b9d"}
                                        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                                    />
                                </div>

                                {/* Attend */}
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                                        Bạn có tham dự không? *
                                    </label>
                                    <div style={{ display: "flex", gap: 10 }}>
                                        {(["yes", "no"] as const).map(a => (
                                            <button key={a} onClick={() => setRsvpAttend(a)} style={{
                                                flex: 1, padding: "14px 0", borderRadius: 14, fontSize: 14, fontWeight: 600,
                                                border: "2px solid " + (rsvpAttend === a ? (a === "yes" ? "#ff6b9d" : "#9ca3af") : "#e5e7eb"),
                                                background: rsvpAttend === a ? (a === "yes" ? "#fdf2f8" : "#f9fafb") : "#fff",
                                                color: rsvpAttend === a ? (a === "yes" ? "#be185d" : "#374151") : "#6b7280",
                                                cursor: "pointer", transition: "all 0.2s",
                                            }}>
                                                {a === "yes" ? "💕 Sẽ tham dự" : "😔 Không thể đến"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Guest count */}
                                {rsvpAttend === "yes" && (
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                                            Số người tham dự
                                        </label>
                                        <select
                                            value={rsvpGuests} onChange={e => setRsvpGuests(e.target.value)}
                                            style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 14 }}
                                        >
                                            {["1", "2", "3", "4", "5+"].map(n => <option key={n}>{n}</option>)}
                                        </select>
                                    </div>
                                )}

                                {/* Note */}
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                                        Lời nhắn (tuỳ chọn)
                                    </label>
                                    <textarea
                                        value={rsvpNote} onChange={e => setRsvpNote(e.target.value)}
                                        placeholder="Gửi lời chúc mừng đến cặp đôi..."
                                        rows={3}
                                        style={{
                                            width: "100%", padding: "12px 14px", borderRadius: 12,
                                            border: "1.5px solid #e5e7eb", fontSize: 14, resize: "vertical",
                                            outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={handleRSVP} disabled={rsvpSending || !rsvpName.trim() || !rsvpAttend}
                                    style={{
                                        width: "100%", padding: "16px 0", borderRadius: 14,
                                        background: (!rsvpName.trim() || !rsvpAttend)
                                            ? "#e5e7eb"
                                            : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                        border: "none", color: (!rsvpName.trim() || !rsvpAttend) ? "#9ca3af" : "#fff",
                                        fontSize: 15, fontWeight: 700,
                                        cursor: (!rsvpName.trim() || !rsvpAttend) ? "not-allowed" : "pointer",
                                        boxShadow: (!rsvpName.trim() || !rsvpAttend) ? "none" : "0 4px 16px rgba(255,107,157,.35)",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {rsvpSending ? "⏳ Đang gửi..." : "💌 Xác nhận tham dự"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </ScrollSection>

            {/* ═══ Watermark ═══ */}
            {showWatermark && (
                <a
                    href="https://7app.online?ref=watermark"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "block", textAlign: "center",
                        padding: "16px 0 32px", fontSize: 11,
                        color: "rgba(255,255,255,0.35)", textDecoration: "none",
                        letterSpacing: 0.5,
                    }}
                >
                    Made with LoveStory ❤️
                </a>
            )}

            {/* ═══ Sticky Music Player (bottom-right) ═══ */}
            {musicUrl && (
                <button onClick={toggleMusic} title={musicName} style={{
                    position: "fixed", bottom: 20, right: 20, zIndex: 999,
                    width: 52, height: 52, borderRadius: "50%", border: "none",
                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    color: "#fff", fontSize: 22, cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(255,107,157,.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    animation: isPlaying ? "spinVinyl 3s linear infinite" : undefined,
                }}>
                    {isPlaying ? "🎵" : "▶️"}
                </button>
            )}

            {/* ═══ Sticky bottom RSVP CTA ═══ */}
            {!rsvpSent && (
                <div style={{
                    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 990,
                    padding: "12px 16px", paddingBottom: "max(12px, env(safe-area-inset-bottom))",
                    background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 30%)",
                    display: "flex", justifyContent: "center",
                    animation: "slideInUp 0.5s ease-out 1.5s both",
                }}>
                    <button
                        onClick={() => {
                            const rsvpEl = document.querySelector('[data-rsvp-section]');
                            rsvpEl?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                            padding: "14px 32px", borderRadius: 50,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 4px 20px rgba(255,107,157,.45)",
                            letterSpacing: 0.3,
                        }}
                    >
                        💌 Xác nhận tham dự
                    </button>
                </div>
            )}
        </div>
    );
}
