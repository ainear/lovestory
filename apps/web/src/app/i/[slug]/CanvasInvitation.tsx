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
    type: "text" | "image" | "sticker" | "shape";
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

    return null;
}

/* ═══════ Main Component ═══════ */

interface CanvasInvitationProps {
    canvasJson: string;
    guestName?: string;
    projectId?: string;
    showWatermark?: boolean;
}

function parseCanvasJson(raw: string): CanvasData | null {
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

    const musicUrl = data?.meta?.musicUrl || "";
    const musicName = data?.meta?.musicName || "";
    const particleEffect = (data?.effects?.particleEffect || "none") as ParticleType;

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

    const { canvas, elements } = data;
    const sections = splitIntoSections(elements, canvas.height);

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
            {sections.map((section, sIdx) => {
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
                            // Seamless section join (no gap between sections)
                            ...(sIdx === 0 ? { borderRadius: "16px 16px 0 0", paddingTop: guestName ? 0 : 24 } : {}),
                            ...(sIdx === sections.length - 1 ? { borderRadius: "0 0 16px 16px", paddingBottom: 24 } : {}),
                        }}>
                            {section.elements.sort((a, b) => a.zIndex - b.zIndex).map((el, eIdx) => (
                                <RenderElement key={el.id} el={el} sectionYStart={section.yStart} idx={eIdx} />
                            ))}
                        </div>
                    </ScrollSection>
                );
            })}

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
