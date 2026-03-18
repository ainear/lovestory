"use client";

import React, { useState } from "react";

interface PremiumFeaturesPanelProps {
  removeWatermark: boolean;
  setRemoveWatermark: (v: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (v: boolean) => void;
  scrollSpeed: number;
  setScrollSpeed: (v: number) => void;
  qrBank: string;
  setQrBank: (v: string) => void;
  // AI text suggestions (only active when a text element is selected)
  selectedElementId?: string;
  selectedElementType?: string;
  onApplySuggestion?: (text: string) => void;
}

type SuggestType = "invitation" | "vow" | "description";

const SUGGEST_LABELS: Record<SuggestType, string> = {
  invitation: "💌 Lời mời",
  vow: "💍 Lời thề",
  description: "📖 Mô tả tình yêu",
};

export function PremiumFeaturesPanel({
  removeWatermark,
  setRemoveWatermark,
  autoScroll,
  setAutoScroll,
  scrollSpeed,
  setScrollSpeed,
  qrBank,
  setQrBank,
  selectedElementId,
  selectedElementType,
  onApplySuggestion,
}: PremiumFeaturesPanelProps) {
  // AI suggestion state
  const [suggestType, setSuggestType] = useState<SuggestType>("invitation");
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);

  const isTextSelected = selectedElementType === "text" && !!selectedElementId;

  async function handleGenerateSuggestions() {
    if (!groomName.trim() || !brideName.trim()) {
      setAiError("Nhập tên cô dâu & chú rể để tiếp tục.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setSuggestions([]);
    setAppliedIdx(null);
    try {
      const res = await fetch("/api/ai/text-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: suggestType,
          groomName: groomName.trim(),
          brideName: brideName.trim(),
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || "Có lỗi xảy ra. Vui lòng thử lại.");
        return;
      }
      setSuggestions(data.suggestions || []);
    } catch {
      setAiError("Không kết nối được. Vui lòng thử lại.");
    } finally {
      setAiLoading(false);
    }
  }

  function handleApply(text: string, idx: number) {
    onApplySuggestion?.(text);
    setAppliedIdx(idx);
    setTimeout(() => setAppliedIdx(null), 2000);
  }

  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#374151",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 13 }}>💎</span>
        Tính năng nâng cao
        <span
          style={{
            fontSize: 9,
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            color: "#fff",
            padding: "1px 6px",
            borderRadius: 8,
            fontWeight: 700,
          }}
        >
          PRO
        </span>
      </div>

      {/* Remove watermark */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "#374151",
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        <input
          type="checkbox"
          checked={removeWatermark}
          onChange={(e) => setRemoveWatermark(e.target.checked)}
          style={{ accentColor: "#3b82f6" }}
        />
        Xóa watermark
      </label>

      {/* Auto-scroll */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "#374151",
          cursor: "pointer",
          marginBottom: 6,
        }}
      >
        <input
          type="checkbox"
          checked={autoScroll}
          onChange={(e) => setAutoScroll(e.target.checked)}
          style={{ accentColor: "#3b82f6" }}
        />
        Tự động cuộn
      </label>
      {autoScroll && (
        <div style={{ marginLeft: 24, marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            <span>Chậm</span>
            <input
              type="range"
              min={1}
              max={5}
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              style={{ flex: 1, accentColor: "#3b82f6" }}
            />
            <span>Nhanh</span>
          </div>
        </div>
      )}

      {/* QR Bank */}
      <div style={{ marginBottom: 4 }}>
        <label
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#6b7280",
            display: "block",
            marginBottom: 4,
          }}
        >
          QR Bank (số tài khoản)
        </label>
        <input
          type="text"
          value={qrBank}
          onChange={(e) => setQrBank(e.target.value)}
          placeholder="VD: 1234567890 — Vietcombank"
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            fontSize: 12,
            boxSizing: "border-box" as const,
            background: "#fff",
          }}
        />
      </div>

      {/* ── AI Text Suggestions ── */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ✨ Gợi ý nội dung AI
          </span>
          <span
            style={{
              fontSize: 9,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              color: "#fff",
              padding: "1px 6px",
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            BETA
          </span>
        </div>

        {!isTextSelected ? (
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            💡 Chọn một phần tử văn bản trên canvas để dùng AI gợi ý nội dung.
          </p>
        ) : (
          <>
            {/* Type selector */}
            <div style={{ marginBottom: 8 }}>
              <label
                style={{ fontSize: 10, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}
              >
                Loại gợi ý
              </label>
              <select
                value={suggestType}
                onChange={(e) => {
                  setSuggestType(e.target.value as SuggestType);
                  setSuggestions([]);
                }}
                style={{
                  width: "100%",
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  fontSize: 11,
                  background: "#fff",
                }}
              >
                {(Object.keys(SUGGEST_LABELS) as SuggestType[]).map((k) => (
                  <option key={k} value={k}>{SUGGEST_LABELS[k]}</option>
                ))}
              </select>
            </div>

            {/* Names */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 3 }}>
                  Chú rể
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Minh"
                  style={{
                    width: "100%",
                    padding: "5px 7px",
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    fontSize: 11,
                    boxSizing: "border-box" as const,
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "#6b7280", display: "block", marginBottom: 3 }}>
                  Cô dâu
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Lan"
                  style={{
                    width: "100%",
                    padding: "5px 7px",
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    fontSize: 11,
                    boxSizing: "border-box" as const,
                  }}
                />
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerateSuggestions}
              disabled={aiLoading}
              style={{
                width: "100%",
                padding: "8px 0",
                borderRadius: 8,
                border: "none",
                background: aiLoading
                  ? "#f3f4f6"
                  : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                color: aiLoading ? "#9ca3af" : "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: aiLoading ? "not-allowed" : "pointer",
                marginBottom: 8,
                transition: "opacity 0.2s",
              }}
            >
              {aiLoading ? "🤖 Đang tạo gợi ý..." : "🪄 Tạo gợi ý"}
            </button>

            {/* Error */}
            {aiError && (
              <p style={{ fontSize: 11, color: "#ef4444", margin: "0 0 8px" }}>
                ⚠️ {aiError}
              </p>
            )}

            {/* Suggestions list */}
            {suggestions.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fafafa",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "#374151",
                        margin: "0 0 6px",
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {s}
                    </p>
                    <button
                      onClick={() => handleApply(s, i)}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 6,
                        border: "none",
                        background: appliedIdx === i
                          ? "#10b981"
                          : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {appliedIdx === i ? "✓ Đã dùng" : "Dùng"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
