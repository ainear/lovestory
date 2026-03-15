"use client";

import React from "react";

interface PremiumFeaturesPanelProps {
  removeWatermark: boolean;
  setRemoveWatermark: (v: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (v: boolean) => void;
  scrollSpeed: number;
  setScrollSpeed: (v: number) => void;
  qrBank: string;
  setQrBank: (v: string) => void;
}

export function PremiumFeaturesPanel({
  removeWatermark,
  setRemoveWatermark,
  autoScroll,
  setAutoScroll,
  scrollSpeed,
  setScrollSpeed,
  qrBank,
  setQrBank,
}: PremiumFeaturesPanelProps) {
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
    </div>
  );
}
