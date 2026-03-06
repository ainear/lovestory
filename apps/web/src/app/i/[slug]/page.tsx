"use client";

import { useState, useEffect } from "react";

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
}

// ── Envelope Animation Component ──
function EnvelopeAnimation({
    groomName,
    brideName,
    onOpen,
}: {
    groomName: string;
    brideName: string;
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
                        try {
                            await fetch("/api/rsvp", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ projectId, guestName: name, status, guestCount }),
                            });
                        } catch { }
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
            .then(d => setWishes((d.data || []).map((w: any) => ({ name: w.guest_name, message: w.message, emoji: w.emoji || "❤️" }))))
            .catch(() => { });
    }, [projectId]);

    async function handleSubmit() {
        if (!name || !message) return;
        try {
            await fetch("/api/wishes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, guestName: name, message, emoji: selectedEmoji }),
            });
        } catch { }
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
            <div
                style={{
                    width: 160,
                    height: 160,
                    background: "#f3f4f6",
                    borderRadius: 16,
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: "#9ca3af",
                }}
            >
                QR Code
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>{bankName}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#374151", margin: "0 0 4px", letterSpacing: 2 }}>
                {bankAccount}
            </p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{bankOwner}</p>
        </div>
    );
}

// ── Main Public Invitation ──
export default function PublicInvitationPage({ params }: { params: Promise<{ slug: string }> }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [projectId, setProjectId] = useState("");
    const [data, setData] = useState<InvitationData>({
        groomName: "", brideName: "", weddingDate: "", weddingTime: "",
        venueName: "", venueAddress: "", googleMapsUrl: "",
        groomParentNames: "", brideParentNames: "", story: "",
        message: "", bankName: "", bankAccount: "", bankOwner: "",
    });

    useEffect(() => {
        async function loadProject() {
            const { slug } = await params;
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
                .single();

            if (project) {
                setProjectId(project.id);
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
                });
            }
            setLoading(false);
        }
        loadProject();
    }, []);

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

    const handleOpen = () => {
        setIsOpen(true);
        setIsPlaying(true);
    };

    if (!isOpen) {
        return <EnvelopeAnimation groomName={data.groomName} brideName={data.brideName} onOpen={handleOpen} />;
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 20%, #fff5f7 50%, #fefce8 100%)",
                fontFamily: "'Inter', -apple-system, sans-serif",
                maxWidth: 480,
                margin: "0 auto",
                position: "relative",
                animation: "fadeIn 0.8s ease-in",
            }}
        >
            {/* Music Toggle */}
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    border: "none",
                    color: "#fff",
                    fontSize: 20,
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(255,107,157,0.4)",
                    zIndex: 50,
                    animation: isPlaying ? "spin 3s linear infinite" : "none",
                }}
            >
                {isPlaying ? "🎵" : "🔇"}
            </button>

            {/* Hero Section */}
            <section style={{ textAlign: "center", padding: "60px 24px 40px" }}>
                <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 4, margin: "0 0 24px" }}>
                    WE ARE GETTING MARRIED
                </p>
                <h1 style={{ fontSize: 36, fontWeight: 300, color: "#831843", fontStyle: "italic", margin: "0 0 4px", lineHeight: 1.3 }}>
                    {data.groomName}
                </h1>
                <p style={{ fontSize: 24, color: "#be185d", margin: "0 0 4px" }}>&amp;</p>
                <h1 style={{ fontSize: 36, fontWeight: 300, color: "#831843", fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.3 }}>
                    {data.brideName}
                </h1>

                {/* Parents */}
                {(data.groomParentNames || data.brideParentNames) && (
                    <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
                        {data.groomParentNames && <p style={{ margin: "0 0 2px" }}>Con trai: {data.groomParentNames}</p>}
                        {data.brideParentNames && <p style={{ margin: 0 }}>Con gái: {data.brideParentNames}</p>}
                    </div>
                )}
            </section>

            {/* Calendar */}
            {data.weddingDate && (
                <section style={{ padding: "0 24px 24px" }}>
                    <CalendarWidget date={data.weddingDate} />
                </section>
            )}

            {/* Countdown */}
            {data.weddingDate && (
                <section style={{ padding: "0 24px 24px" }}>
                    <CountdownWidget targetDate={`${data.weddingDate}T${data.weddingTime || "12:00"}`} />
                </section>
            )}

            {/* Story */}
            {data.story && (
                <section style={{ padding: "0 24px 24px" }}>
                    <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: 24 }}>
                        <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 3, margin: "0 0 12px" }}>💕 CÂU CHUYỆN CỦA CHÚNG TÔI</p>
                        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>{data.story}</p>
                    </div>
                </section>
            )}

            {/* Venue + Map */}
            {data.venueName && (
                <section style={{ padding: "0 24px 24px" }}>
                    <MapWidget venueName={data.venueName} venueAddress={data.venueAddress} mapsUrl={data.googleMapsUrl} />
                </section>
            )}

            {/* Message */}
            {data.message && (
                <section style={{ padding: "0 24px 24px", textAlign: "center" }}>
                    <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: 24 }}>
                        <p style={{ fontSize: 12, color: "#d97706", letterSpacing: 3, margin: "0 0 12px" }}>💌 LỜI MỜI</p>
                        <p style={{ fontSize: 15, color: "#374151", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
                            &ldquo;{data.message}&rdquo;
                        </p>
                    </div>
                </section>
            )}

            {/* RSVP */}
            <section style={{ padding: "0 24px 24px" }}>
                <RsvpWidget projectId={projectId} />
            </section>

            {/* Wish Wall */}
            <section style={{ padding: "0 24px 24px" }}>
                <WishWallWidget projectId={projectId} />
            </section>

            {/* Gift QR */}
            <section style={{ padding: "0 24px 24px" }}>
                <GiftQrWidget bankName={data.bankName} bankAccount={data.bankAccount} bankOwner={data.bankOwner} />
            </section>

            {/* Footer */}
            <footer style={{ textAlign: "center", padding: "24px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                    Made with ❤️ by <strong>LoveStory</strong>
                </p>
            </footer>

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

