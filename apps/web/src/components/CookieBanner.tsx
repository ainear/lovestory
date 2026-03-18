"use client";

import { useState, useEffect } from "react";

/**
 * GDPR-compliant cookie consent banner.
 * Shows on first visit, persists "consent_given" cookie for 365 days.
 * Minimal design — non-blocking, bottom-fixed.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if consent not yet given
    const consent = document.cookie
      .split("; ")
      .find((r) => r.startsWith("consent_given="));
    if (!consent) {
      setTimeout(() => setVisible(true), 1500); // delay so it doesn't flash immediately
    }
  }, []);

  function accept() {
    // Set consent cookie for 365 days
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `consent_given=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  function decline() {
    // Set minimal cookie (no analytics/tracking)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `consent_given=minimal; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(17,17,17,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        backdropFilter: "blur(12px)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <p style={{ color: "#d1d5db", fontSize: 13, margin: 0, maxWidth: 680, lineHeight: 1.6 }}>
        🍪 LoveStory dùng cookie để cải thiện trải nghiệm của bạn và phân tích lưu lượng truy cập.
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <a href="/privacy" style={{ color: "#c084fc", textDecoration: "underline" }}>
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi.
      </p>

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "#9ca3af",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Chỉ cơ bản
        </button>
        <button
          onClick={accept}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg, #ec4899, #c084fc)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Chấp nhận tất cả
        </button>
      </div>
    </div>
  );
}
