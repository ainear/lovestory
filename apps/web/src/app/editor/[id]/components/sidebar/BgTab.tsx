"use client";

import React from "react";
import { BG_PRESETS, GRADIENT_PRESETS } from "../editor-constants";

interface BgTabProps {
  background: string;
  setBackground: (val: string) => void;
  bgSubTab: "colors" | "gradient" | "image";
  setBgSubTab: (val: "colors" | "gradient" | "image") => void;
  bgOpacity: number;
  setBgOpacity: (val: number) => void;
  triggerAutosave: () => void;
  projectId: string;
}

export function BgTab({
  background,
  setBackground,
  bgSubTab,
  setBgSubTab,
  bgOpacity,
  setBgOpacity,
  triggerAutosave,
  projectId,
}: BgTabProps) {
  const applyBg = (val: string) => {
    setBackground(val);
    triggerAutosave();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Sub-tab buttons */}
      <div style={{ display: "flex", gap: 4 }}>
        {(
          [
            { id: "colors" as const, label: "Màu nền" },
            { id: "gradient" as const, label: "Gradient" },
            { id: "image" as const, label: "Hình nền" },
          ] as const
        ).map((sub) => (
          <button
            key={sub.id}
            onClick={() => setBgSubTab(sub.id)}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: 20,
              border: "none",
              background: bgSubTab === sub.id ? "#3b82f6" : "#f3f4f6",
              color: bgSubTab === sub.id ? "#fff" : "#6b7280",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Solid colors */}
      {bgSubTab === "colors" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            {BG_PRESETS.map((bg) => (
              <button
                key={bg.label}
                onClick={() => applyBg(bg.value)}
                style={{
                  height: 44,
                  borderRadius: 8,
                  border:
                    background === bg.value
                      ? "2px solid #3b82f6"
                      : "2px solid #e5e7eb",
                  background: bg.value,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    left: 0,
                    right: 0,
                    fontSize: 8,
                    fontWeight: 600,
                    textAlign: "center",
                    color:
                      bg.value.includes("0f0825") || bg.value.includes("111827")
                        ? "#fff"
                        : "#374151",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {bg.label}
                </span>
              </button>
            ))}
          </div>
          {/* Custom hex color */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="color"
              value={background.startsWith("#") ? background : "#ffffff"}
              onChange={(e) => applyBg(e.target.value)}
              style={{
                width: 32,
                height: 32,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: 11, color: "#6b7280" }}>
              Chọn màu tùy chỉnh
            </span>
          </div>
        </div>
      )}

      {/* Gradient presets */}
      {bgSubTab === "gradient" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
          }}
        >
          {GRADIENT_PRESETS.map((g) => (
            <button
              key={g.label}
              onClick={() => applyBg(g.value)}
              style={{
                height: 48,
                borderRadius: 10,
                border:
                  background === g.value
                    ? "2px solid #3b82f6"
                    : "2px solid #e5e7eb",
                background: g.value,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  bottom: 3,
                  left: 0,
                  right: 0,
                  fontSize: 8,
                  fontWeight: 600,
                  textAlign: "center",
                  color:
                    g.value.includes("1b2735") || g.value.includes("1a2744")
                      ? "#fff"
                      : "#374151",
                  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}
              >
                {g.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Background image upload */}
      {bgSubTab === "image" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async (ev) => {
                const file = (ev.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                formData.append("projectId", projectId);
                try {
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await res.json();
                  if (data.url) {
                    applyBg(`url(${data.url}) center/cover no-repeat`);
                  }
                } catch {
                  alert("Upload nền thất bại.");
                }
              };
              input.click();
            }}
            style={{
              padding: 16,
              borderRadius: 12,
              border: "2px dashed #d1d5db",
              background: "#fafafa",
              cursor: "pointer",
              fontSize: 12,
              color: "#6b7280",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 24 }}>📁</span>
            <span>Upload ảnh nền</span>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>
              PNG, JPG, WebP
            </span>
          </button>
        </div>
      )}

      {/* Opacity slider — always visible */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          paddingTop: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Độ trong suốt nền
          </span>
          <span style={{ fontSize: 11, color: "#6b7280" }}>{bgOpacity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={bgOpacity}
          onChange={(e) => {
            setBgOpacity(Number(e.target.value));
            triggerAutosave();
          }}
          style={{ width: "100%", accentColor: "#3b82f6" }}
        />
      </div>
    </div>
  );
}
