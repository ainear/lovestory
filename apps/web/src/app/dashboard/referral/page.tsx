"use client";

/**
 * Referral Dashboard — Sprint 10
 * Users can view their referral link, copy it, and track clicks/conversions.
 * Auto-generates a referral code on first visit if none exists.
 */

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface ReferralStats {
    code: string;
    clicks: number;
    conversions: number;
    commission_earned: number;
    created_at: string;
}

export default function ReferralPage() {
    const [refData, setRefData] = useState<ReferralStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://7app.online";

    const loadReferralCode = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data } = await supabase
            .from("referral_codes")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        if (data) {
            setRefData(data as ReferralStats);
        }
        setLoading(false);
    }, [supabase]);

    const generateCode = useCallback(async () => {
        setGenerating(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setGenerating(false); return; }

        // Generate a code from email prefix + random 4 digits
        const prefix = (user.email || "user").split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
        const suffix = Math.floor(1000 + Math.random() * 9000);
        const code = `${prefix}${suffix}`;

        const { data, error } = await supabase
            .from("referral_codes")
            .insert({ user_id: user.id, code })
            .select()
            .single();

        if (!error && data) {
            setRefData(data as ReferralStats);
        }
        setGenerating(false);
    }, [supabase]);

    useEffect(() => {
        loadReferralCode();
    }, [loadReferralCode]);

    const refLink = refData ? `${BASE_URL}/r/${refData.code}` : "";

    const copyLink = useCallback(() => {
        navigator.clipboard.writeText(refLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }, [refLink]);

    const shareLink = useCallback(() => {
        if (navigator.share && refLink) {
            navigator.share({
                title: "Tạo thiệp cưới đẹp miễn phí!",
                text: "Mình dùng LoveStory để tạo thiệp cưới online — đẹp, nhanh, miễn phí. Bạn thử xem nhé!",
                url: refLink,
            });
        }
    }, [refLink]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--dash-text-muted)" }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>⏳</p>
                <p style={{ fontSize: 14 }}>Đang tải...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--dash-text)", margin: 0 }}>
                    🎁 Chương trình Referral
                </h2>
                <p style={{ fontSize: 14, color: "var(--dash-text-secondary)", margin: "4px 0 0" }}>
                    Chia sẻ link của bạn — mỗi người đăng ký qua link đóng góp vào số liệu của bạn
                </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[
                    { icon: "👆", label: "Lượt click", value: refData?.clicks ?? 0, color: "#3b82f6" },
                    { icon: "✅", label: "Chuyển đổi", value: refData?.conversions ?? 0, color: "#059669" },
                    { icon: "💰", label: "Hoa hồng (VNĐ)", value: `${((refData?.commission_earned ?? 0) * 23000).toLocaleString("vi-VN")}`, color: "#f59e0b" },
                ].map((s, i) => (
                    <div key={i} style={{ background: "var(--dash-card)", borderRadius: 14, padding: "18px 20px", border: "1px solid var(--dash-border)" }}>
                        <p style={{ fontSize: 26, fontWeight: 700, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                        <p style={{ fontSize: 12, color: "var(--dash-text-muted)", margin: 0 }}>{s.icon} {s.label}</p>
                    </div>
                ))}
            </div>

            {/* Referral link card */}
            <div style={{ background: "var(--dash-card)", borderRadius: 16, border: "1px solid var(--dash-border)", padding: 24, marginBottom: 24 }}>
                {!refData ? (
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <p style={{ fontSize: 36, marginBottom: 12 }}>🎁</p>
                        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--dash-text)", marginBottom: 6 }}>
                            Bạn chưa có mã giới thiệu
                        </p>
                        <p style={{ fontSize: 13, color: "var(--dash-text-secondary)", marginBottom: 20 }}>
                            Tạo mã để chia sẻ LoveStory với bạn bè và theo dõi số người đăng ký
                        </p>
                        <button
                            onClick={generateCode}
                            disabled={generating}
                            style={{
                                padding: "12px 28px", borderRadius: 12, border: "none",
                                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                color: "#fff", fontSize: 14, fontWeight: 700,
                                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                                boxShadow: "0 4px 12px rgba(255,107,157,.3)",
                            }}
                        >
                            {generating ? "⏳ Đang tạo..." : "✨ Tạo mã giới thiệu ngay"}
                        </button>
                    </div>
                ) : (
                    <>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dash-text-secondary)", marginBottom: 12 }}>
                            🔗 Link giới thiệu của bạn
                        </p>

                        {/* Ref code badge */}
                        <div style={{ marginBottom: 16 }}>
                            <span style={{
                                display: "inline-block", padding: "6px 16px", borderRadius: 20,
                                background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)",
                                border: "1px solid #fce7f3",
                                fontSize: 16, fontWeight: 800, color: "#be185d",
                                letterSpacing: 2, fontFamily: "monospace",
                            }}>
                                {refData.code}
                            </span>
                        </div>

                        {/* Full link input */}
                        <div style={{ display: "flex", gap: 10, alignItems: "stretch", marginBottom: 16 }}>
                            <input
                                readOnly value={refLink}
                                style={{
                                    flex: 1, padding: "10px 14px", borderRadius: 10,
                                    border: "1px solid var(--dash-border)", fontSize: 13,
                                    background: "var(--dash-card-hover)", color: "var(--dash-text)",
                                    overflow: "hidden", textOverflow: "ellipsis",
                                }}
                            />
                            <button onClick={copyLink} style={{
                                padding: "10px 18px", borderRadius: 10, border: "none",
                                background: copied ? "#059669" : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, flexShrink: 0,
                                transition: "background .3s",
                            }}>
                                {copied ? "✅ Đã copy" : "📋 Copy"}
                            </button>
                        </div>

                        {/* Share buttons */}
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button onClick={shareLink} style={{
                                padding: "9px 16px", borderRadius: 10, border: "1px solid var(--dash-border)",
                                background: "var(--dash-card)", color: "var(--dash-text)", cursor: "pointer", fontSize: 13,
                            }}>
                                📤 Chia sẻ nhanh
                            </button>
                            <a
                                href={`https://zalo.me/share/url?url=${encodeURIComponent(refLink)}&title=${encodeURIComponent("Tạo thiệp cưới đẹp miễn phí!")}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                    padding: "9px 16px", borderRadius: 10, border: "1px solid #0068FF",
                                    background: "#0068FF", color: "#fff", cursor: "pointer", fontSize: 13,
                                    textDecoration: "none", fontWeight: 600,
                                }}
                            >
                                💙 Zalo
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                    padding: "9px 16px", borderRadius: 10, border: "1px solid #1877f2",
                                    background: "#1877f2", color: "#fff", cursor: "pointer", fontSize: 13,
                                    textDecoration: "none", fontWeight: 600,
                                }}
                            >
                                📘 Facebook
                            </a>
                        </div>
                    </>
                )}
            </div>

            {/* How it works */}
            <div style={{ background: "var(--dash-card)", borderRadius: 16, border: "1px solid var(--dash-border)", padding: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--dash-text)", margin: "0 0 16px" }}>
                    🎯 Cách hoạt động
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                        { step: "1", label: "Chia sẻ link của bạn", desc: "Gửi link cho bạn bè, đăng lên Zalo, Facebook" },
                        { step: "2", label: "Bạn bè đăng ký", desc: "Khi ai đó đăng ký qua link của bạn, hệ thống tự động ghi nhận" },
                        { step: "3", label: "Tích lũy hoa hồng", desc: "Mỗi conversion được tính vào số liệu và hoa hồng của bạn" },
                    ].map((item) => (
                        <div key={item.step} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, fontWeight: 800,
                            }}>
                                {item.step}
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dash-text)", margin: 0 }}>{item.label}</p>
                                <p style={{ fontSize: 12, color: "var(--dash-text-muted)", margin: "2px 0 0" }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
