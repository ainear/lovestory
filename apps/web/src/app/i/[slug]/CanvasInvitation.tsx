"use client";

/**
 * CanvasInvitation — renders canvas_json as a public invitation.
 * Sprint 8: + music autoplay float button, + RSVP form below canvas card.
 */

import { useMemo, useState, useRef, useCallback } from "react";

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
    };
}

export interface CanvasData {
    version: number;
    canvas: { width: number; height: number; bg: string };
    elements: CanvasElementData[];
    meta?: { musicUrl?: string; musicName?: string };
}

interface CanvasInvitationProps {
    canvasJson: string;
    guestName?: string;
    projectId?: string;
}

function parseCanvasJson(raw: string): CanvasData | null {
    try { return JSON.parse(raw); } catch { return null; }
}

export function CanvasInvitation({ canvasJson, guestName, projectId }: CanvasInvitationProps) {
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

    // C1 fix: route through rate-limited /api/rsvp (not direct DB insert)
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

            // Fire-and-forget email notification to project owner
            if (projectId) {
                fetch("/api/rsvp/notify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        projectId,
                        guestName: rsvpName.trim(),
                        attending: rsvpAttend === "yes",
                    }),
                }).catch(() => { }); // silent — never block user
            }
        } catch {
            alert("Không thể gửi RSVP. Vui lòng thử lại.");
        }
        setRsvpSending(false);
    }, [rsvpName, rsvpAttend, rsvpGuests, projectId]);

    const copyLink = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    if (!data) return null;

    const { canvas, elements } = data;
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const CARD_WIDTH = 390;

    return (
        <div style={{
            minHeight: "100vh", background: "#f3f4f6",
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "24px 16px 64px",
        }}>
            {/* Google Fonts */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;1,400&family=Inter:wght@400;600;700&display=swap');
                @keyframes spin { to { transform: rotate(360deg) } }
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
                @keyframes bounce { 0%,100% { transform: scale(1) } 50% { transform: scale(1.1) } }
            `}</style>

            {/* Guest name banner */}
            {guestName && (
                <div style={{
                    marginBottom: 16, background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    color: "#fff", padding: "8px 24px", borderRadius: 24,
                    fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                    boxShadow: "0 4px 12px rgba(255,107,157,.35)",
                }}>
                    💌 Kính gửi: {guestName}
                </div>
            )}

            {/* Canvas card */}
            <div style={{
                position: "relative", width: "min(390px, 100%)", minHeight: canvas.height,
                background: canvas.bg, boxShadow: "0 8px 40px rgba(0,0,0,.15)",
                borderRadius: 8, overflow: "visible",
            }}>
                {sorted.map((el, idx) => {
                    const entranceAnim = el.animation?.entrance && el.animation.entrance !== "none"
                        ? `${el.animation.entrance} 0.6s ease-out ${idx * 0.1}s both`
                        : undefined;
                    const loopAnim = el.animation?.loop && el.animation.loop !== "none"
                        ? `el${el.animation.loop.charAt(0).toUpperCase() + el.animation.loop.slice(1)} 2s ease-in-out infinite`
                        : undefined;
                    const animStr = [entranceAnim, loopAnim].filter(Boolean).join(", ") || undefined;

                    if (el.type === "text") {
                        const p = el.props;
                        return (
                            <div key={el.id} style={{
                                position: "absolute", left: el.x, top: el.y,
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
                            <div key={el.id} style={{
                                position: "absolute", left: el.x, top: el.y,
                                width: el.width, height: el.height, zIndex: el.zIndex,
                                borderRadius: p.borderRadius ?? 12, overflow: "hidden",
                                opacity: el.opacity,
                                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                                animation: animStr,
                                boxShadow: p.boxShadow || undefined,
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
                })}

                {/* Floating music button on card */}
                {musicUrl && (
                    <button onClick={toggleMusic} title={musicName} style={{
                        position: "absolute", bottom: 16, right: 16, zIndex: 999,
                        width: 44, height: 44, borderRadius: "50%", border: "none",
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff", fontSize: 20, cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(255,107,157,.45)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        animation: isPlaying ? "pulse 1.5s ease-in-out infinite" : undefined,
                    }}>
                        {isPlaying ? "⏸" : "🎵"}
                    </button>
                )}
            </div>

            {/* Share bar */}
            <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    onClick={() => navigator.share?.({ url: window.location.href })}
                    style={{
                        padding: "10px 20px", borderRadius: 12,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        border: "none", color: "#fff", fontSize: 14,
                        fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 8,
                        fontFamily: "'Inter', sans-serif", boxShadow: "0 4px 12px rgba(255,107,157,.3)",
                    }}
                >
                    💌 Chia sẻ thiệp
                </button>
                <button onClick={copyLink} style={{
                    padding: "10px 16px", borderRadius: 12,
                    background: copied ? "#ecfdf5" : "#fff",
                    border: "1px solid " + (copied ? "#6ee7b7" : "#e5e7eb"),
                    color: copied ? "#059669" : "#374151", fontSize: 14, cursor: "pointer",
                    fontFamily: "'Inter', sans-serif", fontWeight: copied ? 600 : 400,
                }}>
                    {copied ? "✅ Đã copy!" : "🔗 Sao chép link"}
                </button>
            </div>

            {/* RSVP Section */}
            <div style={{
                width: "min(390px, 100%)", marginTop: 32,
                background: "#fff", borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,.07)",
                padding: 24, fontFamily: "'Inter', sans-serif",
            }}>
                {rsvpSent ? (
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <p style={{ fontSize: 40, margin: "0 0 12px" }}>🎉</p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>Cảm ơn bạn!</p>
                        <p style={{ fontSize: 14, color: "#6b7280", margin: "8px 0 0" }}>
                            Chúng tôi rất mong được gặp{" "}
                            <strong>{rsvpAttend === "yes" ? "bạn" : "nhưng hiểu vì bạn bận"}</strong> 💕
                        </p>
                    </div>
                ) : (
                    <>
                        <p style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>
                            📝 Xác nhận tham dự (RSVP)
                        </p>
                        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
                            Vui lòng xác nhận để chúng tôi chuẩn bị tốt nhất cho tiệc cưới.
                        </p>

                        {/* Name */}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                                Họ và tên *
                            </label>
                            <input
                                value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                                placeholder="Ví dụ: Nguyễn Văn A"
                                style={{
                                    width: "100%", padding: "10px 12px", borderRadius: 10,
                                    border: "1px solid #e5e7eb", fontSize: 14, outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Attend */}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                                Bạn có tham dự không? *
                            </label>
                            <div style={{ display: "flex", gap: 10 }}>
                                {(["yes", "no"] as const).map(a => (
                                    <button key={a} onClick={() => setRsvpAttend(a)} style={{
                                        flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 600,
                                        border: "2px solid " + (rsvpAttend === a ? (a === "yes" ? "#ff6b9d" : "#9ca3af") : "#e5e7eb"),
                                        background: rsvpAttend === a ? (a === "yes" ? "#fdf2f8" : "#f9fafb") : "#fff",
                                        color: rsvpAttend === a ? (a === "yes" ? "#be185d" : "#374151") : "#6b7280",
                                        cursor: "pointer",
                                    }}>
                                        {a === "yes" ? "💕 Sẽ tham dự" : "😔 Không thể đến"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Guest count */}
                        {rsvpAttend === "yes" && (
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                                    Số người tham dự (bao gồm bạn)
                                </label>
                                <select
                                    value={rsvpGuests} onChange={e => setRsvpGuests(e.target.value)}
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14 }}
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
                                    width: "100%", padding: "10px 12px", borderRadius: 10,
                                    border: "1px solid #e5e7eb", fontSize: 14, resize: "vertical",
                                    outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <button
                            onClick={handleRSVP} disabled={rsvpSending || !rsvpName.trim() || !rsvpAttend}
                            style={{
                                width: "100%", padding: "14px 0", borderRadius: 12,
                                background: (!rsvpName.trim() || !rsvpAttend)
                                    ? "#e5e7eb"
                                    : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                border: "none", color: (!rsvpName.trim() || !rsvpAttend) ? "#9ca3af" : "#fff",
                                fontSize: 15, fontWeight: 700, cursor: (!rsvpName.trim() || !rsvpAttend) ? "not-allowed" : "pointer",
                                fontFamily: "'Inter', sans-serif",
                                boxShadow: (!rsvpName.trim() || !rsvpAttend) ? "none" : "0 4px 16px rgba(255,107,157,.35)",
                            }}
                        >
                            {rsvpSending ? "⏳ Đang gửi..." : "💌 Xác nhận tham dự"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
