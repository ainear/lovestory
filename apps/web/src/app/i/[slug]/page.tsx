"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface InvitationData {
    groomName: string;
    brideName: string;
    weddingDate: string;
    weddingTime: string;
    venueName: string;
    venueAddress: string;
    googleMapsUrl: string;
    groomParentNames: string;
    brideParentNames: string;
    story: string;
    message: string;
    bankName: string;
    bankAccount: string;
    bankOwner: string;
    groomPhone?: string;
    photos: string[];
    musicUrl?: string;
    musicName?: string;
    youtubeUrl?: string;
}

// ── Template Themes ──
interface Theme {
    bg: string;
    accent: string;
    accentLight: string;
    heading: string;
    text: string;
    card: string;
    label: string;
    envelopeBg: string;
    buttonGrad: string;
}

const THEMES: Record<string, Theme> = {
    "rose-garden": {
        bg: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 20%, #fff5f7 50%, #fefce8 100%)",
        accent: "#be185d", accentLight: "#fce7f3",
        heading: "#831843", text: "#374151", card: "rgba(255,255,255,0.5)",
        label: "#d97706", envelopeBg: "linear-gradient(180deg, #fce7f3, #fdf2f8)",
        buttonGrad: "linear-gradient(135deg, #ff6b9d, #c084fc)",
    },
    "midnight-romance": {
        bg: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #1e1b4b 100%)",
        accent: "#a78bfa", accentLight: "rgba(167,139,250,0.15)",
        heading: "#e0e7ff", text: "#c7d2fe", card: "rgba(255,255,255,0.06)",
        label: "#a78bfa", envelopeBg: "linear-gradient(180deg, #1e1b4b, #312e81)",
        buttonGrad: "linear-gradient(135deg, #6366f1, #a78bfa)",
    },
    "golden-hour": {
        bg: "linear-gradient(180deg, #fffbeb 0%, #fef3c7 20%, #fde68a 50%, #fffbeb 100%)",
        accent: "#b45309", accentLight: "#fef3c7",
        heading: "#78350f", text: "#44403c", card: "rgba(255,255,255,0.6)",
        label: "#b45309", envelopeBg: "linear-gradient(180deg, #fef3c7, #fffbeb)",
        buttonGrad: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    "cherry-blossom": {
        bg: "linear-gradient(180deg, #fff1f2 0%, #ffe4e6 20%, #fecdd3 50%, #fff1f2 100%)",
        accent: "#e11d48", accentLight: "#ffe4e6",
        heading: "#9f1239", text: "#374151", card: "rgba(255,255,255,0.5)",
        label: "#e11d48", envelopeBg: "linear-gradient(180deg, #ffe4e6, #fff1f2)",
        buttonGrad: "linear-gradient(135deg, #fb7185, #ec4899)",
    },
    "beach-sunset": {
        bg: "linear-gradient(180deg, #ecfeff 0%, #cffafe 20%, #a5f3fc 40%, #fef3c7 100%)",
        accent: "#0e7490", accentLight: "#cffafe",
        heading: "#155e75", text: "#374151", card: "rgba(255,255,255,0.55)",
        label: "#0e7490", envelopeBg: "linear-gradient(180deg, #cffafe, #ecfeff)",
        buttonGrad: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
    },
    "classic-elegance": {
        bg: "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 30%, #e7e5e4 60%, #fafaf9 100%)",
        accent: "#78716c", accentLight: "#f5f5f4",
        heading: "#292524", text: "#44403c", card: "rgba(255,255,255,0.7)",
        label: "#78716c", envelopeBg: "linear-gradient(180deg, #f5f5f4, #fafaf9)",
        buttonGrad: "linear-gradient(135deg, #78716c, #a8a29e)",
    },
    "ocean-breeze": {
        bg: "linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 100%)",
        accent: "#0891b2", accentLight: "#cffafe",
        heading: "#164e63", text: "#374151", card: "rgba(255,255,255,0.55)",
        label: "#0891b2", envelopeBg: "linear-gradient(180deg, #cffafe, #ecfeff)",
        buttonGrad: "linear-gradient(135deg, #06b6d4, #0891b2)",
    },
    "rustic-charm": {
        bg: "linear-gradient(180deg, #fefce8 0%, #fef9c3 30%, #fef3c7 100%)",
        accent: "#a16207", accentLight: "#fef9c3",
        heading: "#854d0e", text: "#44403c", card: "rgba(255,255,255,0.6)",
        label: "#a16207", envelopeBg: "linear-gradient(180deg, #fef9c3, #fefce8)",
        buttonGrad: "linear-gradient(135deg, #d97706, #a16207)",
    },
    "lavender-dream": {
        bg: "linear-gradient(180deg, #f5f3ff 0%, #ede9fe 30%, #ddd6fe 100%)",
        accent: "#7c3aed", accentLight: "#ede9fe",
        heading: "#4c1d95", text: "#374151", card: "rgba(255,255,255,0.55)",
        label: "#7c3aed", envelopeBg: "linear-gradient(180deg, #ede9fe, #f5f3ff)",
        buttonGrad: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    },
    "emerald-forest": {
        bg: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 30%, #a7f3d0 100%)",
        accent: "#059669", accentLight: "#d1fae5",
        heading: "#064e3b", text: "#374151", card: "rgba(255,255,255,0.55)",
        label: "#059669", envelopeBg: "linear-gradient(180deg, #d1fae5, #ecfdf5)",
        buttonGrad: "linear-gradient(135deg, #10b981, #059669)",
    },
    "sunset-glow": {
        bg: "linear-gradient(180deg, #fff7ed 0%, #ffedd5 30%, #fed7aa 100%)",
        accent: "#ea580c", accentLight: "#ffedd5",
        heading: "#7c2d12", text: "#44403c", card: "rgba(255,255,255,0.6)",
        label: "#ea580c", envelopeBg: "linear-gradient(180deg, #ffedd5, #fff7ed)",
        buttonGrad: "linear-gradient(135deg, #f97316, #ea580c)",
    },
    "minimalist-white": {
        bg: "linear-gradient(180deg, #fafafa 0%, #f5f5f5 50%, #ffffff 100%)",
        accent: "#525252", accentLight: "#f5f5f5",
        heading: "#262626", text: "#404040", card: "rgba(255,255,255,0.8)",
        label: "#525252", envelopeBg: "linear-gradient(180deg, #f5f5f5, #fafafa)",
        buttonGrad: "linear-gradient(135deg, #525252, #737373)",
    },
    "royal-navy": {
        bg: "linear-gradient(180deg, #0c1929 0%, #1e293b 30%, #0f172a 100%)",
        accent: "#fbbf24", accentLight: "rgba(251,191,36,0.15)",
        heading: "#f8fafc", text: "#e2e8f0", card: "rgba(255,255,255,0.06)",
        label: "#fbbf24", envelopeBg: "linear-gradient(180deg, #1e293b, #0f172a)",
        buttonGrad: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    },
    "spring-garden": {
        bg: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 100%)",
        accent: "#16a34a", accentLight: "#dcfce7",
        heading: "#14532d", text: "#374151", card: "rgba(255,255,255,0.55)",
        label: "#16a34a", envelopeBg: "linear-gradient(180deg, #dcfce7, #f0fdf4)",
        buttonGrad: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
    "blush-romance": {
        bg: "linear-gradient(180deg, #fff1f2 0%, #ffe4e6 30%, #fecdd3 100%)",
        accent: "#e11d48", accentLight: "#ffe4e6",
        heading: "#881337", text: "#374151", card: "rgba(255,255,255,0.5)",
        label: "#e11d48", envelopeBg: "linear-gradient(180deg, #ffe4e6, #fff1f2)",
        buttonGrad: "linear-gradient(135deg, #f43f5e, #e11d48)",
    },
    "tropical-paradise": {
        bg: "linear-gradient(180deg, #f0fdfa 0%, #ccfbf1 30%, #99f6e4 100%)",
        accent: "#0d9488", accentLight: "#ccfbf1",
        heading: "#134e4a", text: "#374151", card: "rgba(255,255,255,0.55)",
        label: "#0d9488", envelopeBg: "linear-gradient(180deg, #ccfbf1, #f0fdfa)",
        buttonGrad: "linear-gradient(135deg, #14b8a6, #0d9488)",
    },
};
const DEFAULT_THEME = THEMES["rose-garden"];

// ── Scroll Reveal Component ──
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

// ── Confetti Canvas ──
function ConfettiCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const colors = ["#ff6b9d", "#c084fc", "#f9a8d4", "#fbbf24", "#34d399", "#60a5fa", "#fb7185"];
        const particles: { x: number; y: number; w: number; h: number; color: string; vx: number; vy: number; rot: number; vr: number }[] = [];
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height,
                w: 4 + Math.random() * 6,
                h: 8 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 3,
                vy: 2 + Math.random() * 4,
                rot: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * 0.2,
            });
        }
        let frame = 0;
        const maxFrames = 180; // ~3 seconds at 60fps
        function animate() {
            if (frame >= maxFrames) { ctx!.clearRect(0, 0, canvas!.width, canvas!.height); return; }
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vr;
                p.vy += 0.05; // gravity
                ctx!.save();
                ctx!.translate(p.x, p.y);
                ctx!.rotate(p.rot);
                ctx!.fillStyle = p.color;
                ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx!.restore();
            });
            frame++;
            requestAnimationFrame(animate);
        }
        animate();
    }, []);
    return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 }} />;
}

// ── Envelope Animation Component ──
function EnvelopeAnimation({
    groomName,
    brideName,
    guestName,
    onOpen,
}: {
    groomName: string;
    brideName: string;
    guestName?: string;
    onOpen: () => void;
}) {
    return (
        <div
            onClick={onOpen}
            style={{
                position: "fixed",
                inset: 0,
                background: "linear-gradient(180deg, #fce7f3, #fdf2f8)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                cursor: "pointer",
                animation: "fadeIn 0.5s ease-in",
            }}
        >
            {/* Envelope */}
            <div
                style={{
                    width: 280,
                    height: 200,
                    background: "linear-gradient(135deg, #fff, #fef3c7)",
                    borderRadius: 16,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "pulse 2s ease-in-out infinite",
                }}
            >
                {/* Heart Seal */}
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        boxShadow: "0 4px 12px rgba(255,107,157,0.4)",
                    }}
                >
                    💌
                </div>

                {/* Flap */}
                <div
                    style={{
                        position: "absolute",
                        top: -1,
                        left: -1,
                        right: -1,
                        height: 100,
                        background: "linear-gradient(180deg, #fef3c7, #fff)",
                        clipPath: "polygon(0 0, 50% 60%, 100% 0)",
                        borderRadius: "16px 16px 0 0",
                    }}
                />
            </div>

            {/* Names */}
            <div style={{ textAlign: "center", marginTop: 32 }}>
                <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 4, margin: "0 0 8px" }}>
                    THIỆP MỜI
                </p>
                <h2
                    style={{
                        fontSize: 28,
                        fontWeight: 300,
                        color: "#831843",
                        margin: 0,
                        fontStyle: "italic",
                    }}
                >
                    {groomName} & {brideName}
                </h2>
                {guestName && (
                    <p style={{ fontSize: 13, color: "#be185d", margin: "10px 0 0", fontWeight: 500 }}>
                        💌 Kính gởi: <strong>{decodeURIComponent(guestName)}</strong>
                    </p>
                )}
            </div>

            {/* Tap hint */}
            <p
                style={{
                    color: "#9ca3af",
                    fontSize: 13,
                    marginTop: 40,
                    animation: "blink 1.5s ease-in-out infinite",
                }}
            >
                Nhấn để mở thiệp 💕
            </p>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
        </div>
    );
}

// ── Countdown Widget ──
function CountdownWidget({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const target = new Date(targetDate).getTime();
            const now = Date.now();
            const diff = Math.max(0, target - now);

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div style={{ textAlign: "center", padding: "32px 24px", background: "rgba(255,255,255,0.5)", borderRadius: 20 }}>
            <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 3, margin: "0 0 16px" }}>⏳ ĐẾM NGƯỢC</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                {[
                    { value: timeLeft.days, label: "Ngày" },
                    { value: timeLeft.hours, label: "Giờ" },
                    { value: timeLeft.minutes, label: "Phút" },
                    { value: timeLeft.seconds, label: "Giây" },
                ].map((item, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 14,
                                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 22,
                                fontWeight: 700,
                                boxShadow: "0 4px 12px rgba(255,107,157,0.3)",
                            }}
                        >
                            {item.value}
                        </div>
                        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Calendar Widget ──
function CalendarWidget({ date }: { date: string }) {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleDateString("vi-VN", { month: "long" });
    const year = d.getFullYear();
    const weekday = d.toLocaleDateString("vi-VN", { weekday: "long" });

    return (
        <div
            style={{
                textAlign: "center",
                padding: "24px",
                background: "#fff",
                borderRadius: 20,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    margin: "-24px -24px 16px",
                    padding: "12px",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "capitalize",
                }}
            >
                📅 {month} {year}
            </div>
            <p style={{ fontSize: 48, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>{day}</p>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0, textTransform: "capitalize" }}>{weekday}</p>
        </div>
    );
}

// ── Map Widget ──
function MapWidget({ venueName, venueAddress, mapsUrl }: { venueName: string; venueAddress: string; mapsUrl: string }) {
    return (
        <div style={{ padding: "24px", background: "rgba(255,255,255,0.5)", borderRadius: 20 }}>
            <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 3, margin: "0 0 12px" }}>📍 ĐỊA ĐIỂM</p>
            <h4 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>{venueName}</h4>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>{venueAddress}</p>
            {mapsUrl && (
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 20px",
                        borderRadius: 12,
                        background: "#4285F4",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: "none",
                    }}
                >
                    🗺️ Xem bản đồ
                </a>
            )}
        </div>
    );
}

// ── RSVP Widget ──
function RsvpWidget({ projectId }: { projectId: string }) {
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"confirmed" | "declined" | "maybe">("confirmed");
    const [guestCount, setGuestCount] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div style={{ textAlign: "center", padding: 32, background: "rgba(255,255,255,0.5)", borderRadius: 20 }}>
                <p style={{ fontSize: 48, marginBottom: 8 }}>✅</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#059669" }}>Cảm ơn bạn đã xác nhận!</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 24, background: "rgba(255,255,255,0.5)", borderRadius: 20 }}>
            <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 3, margin: "0 0 16px" }}>✅ XÁC NHẬN THAM DỰ</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                    placeholder="Tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, outline: "none" }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                    {(["confirmed", "maybe", "declined"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: status === s ? "2px solid #c084fc" : "1px solid #e5e7eb",
                                background: status === s ? "#f5f3ff" : "#fff",
                                color: status === s ? "#7c3aed" : "#6b7280",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                        >
                            {s === "confirmed" ? "✅ Tham dự" : s === "maybe" ? "🤔 Có thể" : "❌ Không"}
                        </button>
                    ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Số khách:</span>
                    <input
                        type="number"
                        min={1}
                        max={20}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        style={{ width: 60, padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, textAlign: "center" }}
                    />
                </div>
                <button
                    onClick={async () => {
                        if (!name) return;
                        // Demo mode — just show success UI
                        if (projectId === "demo") { setSubmitted(true); return; }
                        try {
                            const res = await fetch("/api/rsvp", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ projectId, guestName: name, status, guestCount }),
                            });
                            if (!res.ok) {
                                alert("Gửi xác nhận thất bại. Vui lòng thử lại.");
                                return;
                            }
                        } catch {
                            alert("Lỗi kết nối. Vui lòng thử lại.");
                            return;
                        }
                        setSubmitted(true);
                    }}
                    style={{
                        padding: "12px 20px",
                        borderRadius: 12,
                        border: "none",
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Gửi xác nhận
                </button>
            </div>
        </div>
    );
}

// ── Wish Wall Widget ──
function WishWallWidget({ projectId }: { projectId: string }) {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [wishes, setWishes] = useState<{ name: string; message: string; emoji: string }[]>([]);
    const emojis = ["❤️", "🎉", "🥂", "💐", "💕", "🌹"];
    const [selectedEmoji, setSelectedEmoji] = useState("❤️");

    useEffect(() => {
        fetch(`/api/wishes?projectId=${projectId}`)
            .then(r => r.json())
            .then(d => setWishes((d.data || []).map((w: { guest_name: string; message: string; emoji?: string }) => ({ name: w.guest_name, message: w.message, emoji: w.emoji || "❤️" }))))
            .catch(() => { });
    }, [projectId]);

    async function handleSubmit() {
        if (!name || !message) return;
        // Demo mode — just show locally
        if (projectId === "demo") {
            setWishes((prev) => [{ name, message, emoji: selectedEmoji }, ...prev]);
            setName(""); setMessage("");
            return;
        }
        try {
            const res = await fetch("/api/wishes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, guestName: name, message, emoji: selectedEmoji }),
            });
            if (!res.ok) {
                alert("Gửi lời chúc thất bại. Vui lòng thử lại.");
                return;
            }
        } catch {
            alert("Lỗi kết nối. Vui lòng thử lại.");
            return;
        }
        setWishes((prev) => [{ name, message, emoji: selectedEmoji }, ...prev]);
        setName("");
        setMessage("");
    }

    return (
        <div style={{ padding: 24, background: "rgba(255,255,255,0.5)", borderRadius: 20 }}>
            <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 3, margin: "0 0 16px" }}>💬 LỜI CHÚC</p>

            {/* Submit */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                <input
                    placeholder="Tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, outline: "none" }}
                />
                <textarea
                    placeholder="Gửi lời chúc..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {emojis.map((e) => (
                        <button
                            key={e}
                            onClick={() => setSelectedEmoji(e)}
                            style={{
                                fontSize: 20,
                                border: selectedEmoji === e ? "2px solid #c084fc" : "1px solid transparent",
                                borderRadius: 8,
                                padding: 4,
                                background: "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {e}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    💌 Gửi lời chúc
                </button>
            </div>

            {/* Wishes */}
            {wishes.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {wishes.map((w, i) => (
                        <div
                            key={i}
                            style={{
                                background: "#fff",
                                borderRadius: 12,
                                padding: 14,
                                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                animation: "slideUp 0.3s ease-out",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 16 }}>{w.emoji}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>{w.name}</span>
                            </div>
                            <p style={{ fontSize: 13, color: "#4b5563", margin: 0, lineHeight: 1.5 }}>{w.message}</p>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

// ── Gift QR Widget ──
function GiftQrWidget({ bankName, bankAccount, bankOwner }: { bankName: string; bankAccount: string; bankOwner: string }) {
    if (!bankAccount) return null;

    return (
        <div style={{ textAlign: "center", padding: 24, background: "rgba(255,255,255,0.5)", borderRadius: 20 }}>
            <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 3, margin: "0 0 16px" }}>🎁 MỪNG CƯỚI</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`https://img.vietqr.io/image/${encodeURIComponent(bankName)}-${encodeURIComponent(bankAccount)}-compact.png?amount=0&addInfo=${encodeURIComponent(`Mung cuoi ${bankOwner}`)}`}
                alt="QR chuyển khoản"
                width={160}
                height={160}
                style={{
                    borderRadius: 16,
                    margin: "0 auto 16px",
                    display: "block",
                    background: "#fff",
                }}
                onError={(e) => {
                    // Fallback to generic QR code
                    (e.target as HTMLImageElement).src = `https://quickchart.io/qr?text=${encodeURIComponent(`${bankName} - ${bankAccount} - ${bankOwner}`)}&size=160`;
                }}
            />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>{bankName}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#374151", margin: "0 0 4px", letterSpacing: 2 }}>
                {bankAccount}
            </p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{bankOwner}</p>
        </div>
    );
}

// ── Photo Slideshow Component ──
function PhotoSlideshow({ photos, accent }: { photos: string[]; accent: string }) {
    const [slide, setSlide] = useState(0);
    useEffect(() => {
        if (photos.length <= 1) return;
        const t = setInterval(() => setSlide(s => (s + 1) % photos.length), 3500);
        return () => clearInterval(t);
    }, [photos.length]);
    if (photos.length === 0) return null;
    return (
        <section style={{ padding: "0 24px 24px" }}>
            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: 20 }}>
                <p style={{ fontSize: 12, color: accent, letterSpacing: 3, margin: "0 0 16px", textAlign: "center" }}>📸 KHOẢNH KHẮC</p>
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", background: "#f3f4f6" }}>
                    {photos.map((url, i) => (
                        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === slide ? 1 : 0, transition: "opacity 0.8s ease", zIndex: i === slide ? 1 : 0 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Ảnh cưới ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                        </div>
                    ))}
                    {photos.length > 1 && (
                        <>
                            <button onClick={() => setSlide(s => (s - 1 + photos.length) % photos.length)}
                                style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.35)", color: "#fff", cursor: "pointer", fontSize: 18 }}>‹</button>
                            <button onClick={() => setSlide(s => (s + 1) % photos.length)}
                                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.35)", color: "#fff", cursor: "pointer", fontSize: 18 }}>›</button>
                        </>
                    )}
                    <div style={{ position: "absolute", bottom: 10, right: 12, zIndex: 10, background: "rgba(0,0,0,0.4)", borderRadius: 20, padding: "2px 8px", fontSize: 10, color: "#fff" }}>
                        {slide + 1} / {photos.length}
                    </div>
                </div>
                {photos.length > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
                        {photos.map((_, i) => (
                            <button key={i} onClick={() => setSlide(i)}
                                style={{ width: i === slide ? 16 : 6, height: 6, borderRadius: 4, border: "none", background: i === slide ? accent : "#d1d5db", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ── YouTube Embed Component ──
function YouTubeEmbed({ url, accent }: { url: string; accent: string }) {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    if (!m) return null;
    return (
        <section style={{ padding: "0 24px 24px" }}>
            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: 20 }}>
                <p style={{ fontSize: 12, color: accent, letterSpacing: 3, margin: "0 0 16px", textAlign: "center" }}>▶️ VIDEO</p>
                <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", background: "#000" }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`}
                        title="Wedding Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ width: "100%", height: "100%", border: "none" }}
                    />
                </div>
            </div>
        </section>
    );
}

// ── HeartButton: Floating like button with animated count ──
function HeartButton({ slug }: { slug: string }) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        // Load initial count
        fetch(`/api/likes?slug=${slug}`)
            .then(r => r.json())
            .then(d => setCount(d.likes || 0))
            .catch(() => { });
        // Check localStorage
        const key = `liked:${slug}`;
        if (typeof window !== "undefined" && localStorage.getItem(key)) {
            setLiked(true);
        }
    }, [slug]);

    async function handleLike() {
        if (liked) return;
        setAnimating(true);
        setLiked(true);
        const key = `liked:${slug}`;
        localStorage.setItem(key, "1");
        try {
            const res = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug }),
            });
            const d = await res.json();
            setCount(d.likes || count + 1);
        } catch {
            setCount(c => c + 1);
        }
        setTimeout(() => setAnimating(false), 600);
    }

    return (
        <button
            onClick={handleLike}
            disabled={liked}
            style={{
                position: "fixed",
                bottom: 24,
                right: 20,
                zIndex: 90,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "10px 14px",
                borderRadius: 50,
                border: "none",
                background: liked ? "linear-gradient(135deg, #ff6b9d, #ff3366)" : "rgba(255,255,255,0.95)",
                color: liked ? "#fff" : "#ff6b9d",
                fontSize: 22,
                cursor: liked ? "default" : "pointer",
                boxShadow: liked ? "0 4px 20px rgba(255,107,157,0.4)" : "0 2px 12px rgba(0,0,0,0.12)",
                transform: animating ? "scale(1.3)" : "scale(1)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
        >
            <span style={{ lineHeight: 1 }}>{liked ? "❤️" : "🤍"}</span>
            {count > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, lineHeight: 1 }}>{count}</span>
            )}
        </button>
    );
}

// ── Main Public Invitation ──
export default function PublicInvitationPage({ params }: { params: Promise<{ slug: string }> }) {


    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pageSlug, setPageSlug] = useState("");
    const audioRef = useRef<HTMLAudioElement>(null);
    const [projectId, setProjectId] = useState("");
    const [templateSlug, setTemplateSlug] = useState("rose-garden");
    const searchParams = useSearchParams();
    const guestName = searchParams.get("guest") || "";
    const [data, setData] = useState<InvitationData>({
        groomName: "", brideName: "", weddingDate: "", weddingTime: "",
        venueName: "", venueAddress: "", googleMapsUrl: "",
        groomParentNames: "", brideParentNames: "", story: "",
        message: "", bankName: "", bankAccount: "", bankOwner: "",
        photos: [], musicUrl: "", musicName: "",
    });


    useEffect(() => {
        async function loadProject() {
            const { slug } = await params;
            setPageSlug(slug);
            const { createBrowserClient } = await import("@supabase/ssr");

            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            );

            const { data: project } = await supabase
                .from("projects")
                .select("*")
                .eq("slug", slug)
                .eq("status", "published")
                .maybeSingle();

            if (project) {
                setProjectId(project.id);
                setTemplateSlug(project.template || "rose-garden");
                setData({
                    groomName: project.groom_name || "Chú rể",
                    brideName: project.bride_name || "Cô dâu",
                    weddingDate: project.wedding_date || "",
                    weddingTime: project.wedding_time || "",
                    venueName: project.venue_name || "",
                    venueAddress: project.venue_address || "",
                    googleMapsUrl: project.google_maps_url || "",
                    groomParentNames: project.groom_parent_names || "",
                    brideParentNames: project.bride_parent_names || "",
                    story: project.story || "",
                    message: project.message || "",
                    bankName: project.bank_name || "",
                    bankAccount: project.bank_account || "",
                    bankOwner: project.bank_owner || "",
                    groomPhone: project.groom_phone || "",
                    photos: (() => { try { return JSON.parse(project.photos || "[]"); } catch { return []; } })(),
                    musicUrl: project.music_url || "",
                    musicName: project.music_name || "",
                    youtubeUrl: project.youtube_url || "",
                });

                // Increment view count
                fetch("/api/views", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slug }),
                }).catch(() => { });
            } else if (slug === "demo-wedding") {
                // Demo fallback for landing page "Xem demo" button
                setProjectId("demo");
                setTemplateSlug("rose-garden");
                setData({
                    groomName: "Minh", brideName: "Mai",
                    weddingDate: "2026-06-15", weddingTime: "10:00",
                    venueName: "Trung tâm Tiệc cưới Diamond Palace",
                    venueAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
                    googleMapsUrl: "https://maps.google.com/?q=diamond+palace+hcm",
                    groomParentNames: "Ông Nguyễn Văn A & Bà Lê Thị B",
                    brideParentNames: "Ông Trần Văn C & Bà Phạm Thị D",
                    story: "Chúng tôi gặp nhau vào một ngày mùa thu Sài Gòn. Ánh nắng chiều xuyên qua tán lá cổ thụ trên con đường Nguyễn Du, và tình yêu bắt đầu từ đó.",
                    message: "Sự hiện diện của bạn là niềm vinh hạnh lớn lao cho chúng tôi.",
                    bankName: "Vietcombank", bankAccount: "1234567890", bankOwner: "NGUYEN VAN MINH",
                    musicUrl: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3",
                    musicName: "Beautiful Wedding",
                    groomPhone: "0901234567",
                    photos: [
                        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
                        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
                        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600",
                        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600",
                    ],
                });
            }
            setLoading(false);
        }
        loadProject();
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        setShowConfetti(true);
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        } else {
            setIsPlaying(true);
        }
    };

    const toggleMusic = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) { audioRef.current.pause(); }
            else { audioRef.current.play().catch(() => { }); }
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(180deg, #fce7f3, #fdf2f8)", fontFamily: "'Inter', sans-serif",
            }}>
                <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 48, margin: "0 0 16px", animation: "spin 2s linear infinite" }}>💌</p>
                    <p style={{ fontSize: 14, color: "#be185d" }}>Đang tải thiệp mời...</p>
                </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!projectId) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(180deg, #fce7f3, #fdf2f8)", fontFamily: "'Inter', sans-serif",
            }}>
                <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 48, margin: "0 0 16px" }}>💔</p>
                    <p style={{ fontSize: 16, color: "#831843", fontWeight: 600 }}>Thiệp không tồn tại hoặc chưa xuất bản</p>
                    <a href="/" style={{ fontSize: 13, color: "#be185d" }}>← Về trang chủ</a>
                </div>
            </div>
        );
    }

    if (!isOpen) {
        return <EnvelopeAnimation groomName={data.groomName} brideName={data.brideName} guestName={guestName} onOpen={handleOpen} />;
    }

    const theme = THEMES[templateSlug] || DEFAULT_THEME;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: theme.bg,
                fontFamily: "'Inter', -apple-system, sans-serif",
                maxWidth: 480,
                margin: "0 auto",
                position: "relative",
                animation: "fadeIn 0.8s ease-in",
                color: theme.text,
            }}
        >
            {/* Background Music Audio */}
            {data.musicUrl && (
                <audio
                    ref={audioRef}
                    src={data.musicUrl}
                    loop
                    preload="auto"
                />
            )}

            {/* Confetti */}
            {showConfetti && <ConfettiCanvas />}

            {/* Floating Music Player */}
            {data.musicUrl && (
                <div style={{
                    position: "fixed", bottom: 24, right: 16, zIndex: 50,
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
                    borderRadius: 40, padding: "8px 14px 8px 10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    maxWidth: 200,
                }}>
                    <button
                        onClick={toggleMusic}
                        style={{
                            width: 32, height: 32, borderRadius: "50%", border: "none",
                            background: theme.buttonGrad, color: "#fff", fontSize: 14,
                            cursor: "pointer", flexShrink: 0, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            animation: isPlaying ? "spin 3s linear infinite" : "none",
                        }}
                    >
                        {isPlaying ? "🎵" : "🔇"}
                    </button>
                    <div style={{ overflow: "hidden", flex: 1 }}>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", margin: 0 }}>Nhạc nền</p>
                        <p style={{ fontSize: 11, color: "#fff", margin: 0, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {data.musicName || "Nhạc cưới"}
                        </p>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section style={{ textAlign: "center", padding: "60px 24px 40px" }}>
                <p style={{ fontSize: 12, color: theme.label, letterSpacing: 4, margin: "0 0 24px" }}>
                    WE ARE GETTING MARRIED
                </p>
                <h1 style={{ fontSize: 36, fontWeight: 300, color: theme.heading, fontStyle: "italic", margin: "0 0 4px", lineHeight: 1.3 }}>
                    {data.groomName}
                </h1>
                <p style={{ fontSize: 24, color: theme.accent, margin: "0 0 4px" }}>&amp;</p>
                <h1 style={{ fontSize: 36, fontWeight: 300, color: theme.heading, fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.3 }}>
                    {data.brideName}
                </h1>

                {/* Parents */}
                {(data.groomParentNames || data.brideParentNames) && (
                    <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
                        {data.groomParentNames && <p style={{ margin: "0 0 2px" }}>Con trai: {data.groomParentNames}</p>}
                        {data.brideParentNames && <p style={{ margin: 0 }}>Con gái: {data.brideParentNames}</p>}
                    </div>
                )}
                {guestName && (
                    <div style={{
                        marginTop: 20, padding: "10px 20px", borderRadius: 12,
                        background: "rgba(255,255,255,0.5)", display: "inline-block",
                        fontSize: 14, color: theme.accent, fontStyle: "italic",
                    }}>
                        💌 Kính gởi: <strong>{decodeURIComponent(guestName)}</strong>
                    </div>
                )}
            </section>

            {/* Calendar */}
            {data.weddingDate && (
                <ScrollReveal delay={0.1}>
                    <section style={{ padding: "0 24px 24px" }}>
                        <CalendarWidget date={data.weddingDate} />
                    </section>
                </ScrollReveal>
            )}

            {/* Countdown */}
            {data.weddingDate && (
                <ScrollReveal delay={0.15}>
                    <section style={{ padding: "0 24px 24px" }}>
                        <CountdownWidget targetDate={`${data.weddingDate}T${data.weddingTime || "12:00"}`} />
                    </section>
                </ScrollReveal>
            )}

            {/* Story */}
            {data.story && (
                <ScrollReveal delay={0.1}>
                    <section style={{ padding: "0 24px 24px" }}>
                        <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: 24 }}>
                            <p style={{ fontSize: 12, color: theme.label, letterSpacing: 3, margin: "0 0 12px" }}>💕 CÂU CHUYỆN CỦA CHÚNG TÔI</p>
                            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>{data.story}</p>
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* Photo Slideshow */}
            <ScrollReveal delay={0.1}>
                <PhotoSlideshow photos={data.photos} accent={theme.accent} />
            </ScrollReveal>

            {/* YouTube Embed */}
            {data.youtubeUrl && <ScrollReveal delay={0.1}><YouTubeEmbed url={data.youtubeUrl} accent={theme.accent} /></ScrollReveal>}

            {/* Venue + Map */}
            {data.venueName && (
                <ScrollReveal delay={0.1}>
                    <section style={{ padding: "0 24px 24px" }}>
                        <MapWidget venueName={data.venueName} venueAddress={data.venueAddress} mapsUrl={data.googleMapsUrl} />
                    </section>
                </ScrollReveal>
            )}

            {/* Message */}
            {data.message && (
                <ScrollReveal delay={0.1}>
                    <section style={{ padding: "0 24px 24px", textAlign: "center" }}>
                        <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: 24 }}>
                            <p style={{ fontSize: 12, color: theme.label, letterSpacing: 3, margin: "0 0 12px" }}>💌 LỜI MỜI</p>
                            <p style={{ fontSize: 15, color: "#374151", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
                                &ldquo;{data.message}&rdquo;
                            </p>
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* RSVP */}
            <ScrollReveal delay={0.1}>
                <section style={{ padding: "0 24px 24px" }}>
                    <RsvpWidget projectId={projectId} />
                </section>
            </ScrollReveal>

            {/* Wish Wall */}
            <ScrollReveal delay={0.15}>
                <section style={{ padding: "0 24px 24px" }}>
                    <WishWallWidget projectId={projectId} />
                </section>
            </ScrollReveal>

            {/* Gift QR */}
            <ScrollReveal delay={0.1}>
                <section style={{ padding: "0 24px 24px" }}>
                    <GiftQrWidget bankName={data.bankName} bankAccount={data.bankAccount} bankOwner={data.bankOwner} />
                </section>
            </ScrollReveal>

            {/* Footer — LoveStory watermark (always visible) */}
            <footer style={{ textAlign: "center", padding: "24px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <a
                    href="https://7app.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "6px 14px", borderRadius: 20,
                        background: "linear-gradient(135deg, rgba(255,107,157,0.08), rgba(192,132,252,0.08))",
                        border: "1px solid rgba(255,107,157,0.15)",
                        textDecoration: "none", fontSize: 12, color: "#9ca3af",
                    }}
                >
                    ❤️ Tạo thiệp cưới miễn phí tại <strong style={{ color: "#ff6b9d", marginLeft: 4 }}>LoveStory</strong>
                </a>
            </footer>

            {/* Floating Click-to-Call button (bottom-left) */}
            {data.groomPhone && (
                <a
                    href={`tel:${data.groomPhone}`}
                    style={{
                        position: "fixed",
                        bottom: 24,
                        left: 20,
                        zIndex: 90,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        borderRadius: 50,
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: "none",
                        boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
                        animation: "pulse 2s infinite",
                    }}
                >
                    📞 <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.groomPhone}</span>
                </a>
            )}

            {/* Floating Heart button (bottom-right) */}
            {pageSlug && <HeartButton slug={pageSlug} />}




            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

