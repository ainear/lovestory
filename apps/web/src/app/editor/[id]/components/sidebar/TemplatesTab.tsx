"use client";

import React from "react";
import { TEMPLATE_STYLES } from "../editor-constants";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface TemplatesTabProps {
  background: string;
  setBackground: (val: string) => void;
  triggerAutosave: () => void;
}

export function TemplatesTab({
  background,
  setBackground,
  triggerAutosave,
}: TemplatesTabProps) {
  const { hasFeature } = useSubscription();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
          margin: 0,
        }}
      >
        Chọn mẫu thiết kế
      </p>
      <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
        Chọn một mẫu có sẵn để bắt đầu nhanh chóng
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: 4,
        }}
      >
        {TEMPLATE_STYLES.map((t) => {
          const tierColors = {
            FREE: { bg: "#6b7280", text: "#fff" },
            BASIC: { bg: "#10b981", text: "#fff" },
            PREMIUM: { bg: "#8b5cf6", text: "#fff" },
          };
          const badge = tierColors[t.tier];
          const isPremiumLocked =
            t.tier === "PREMIUM" && !hasFeature("premiumTemplates");
          return (
            <div
              key={t.name}
              style={{
                borderRadius: 10,
                border:
                  background === t.bg
                    ? "2px solid #ff6b9d"
                    : "1px solid #e5e7eb",
                background: "#fff",
                overflow: "hidden",
                transition: "all 0.2s",
                opacity: isPremiumLocked ? 0.75 : 1,
              }}
            >
              {/* Thumbnail preview */}
              <button
                onClick={() => {
                  if (isPremiumLocked) {
                    alert("Nâng cấp lên Premium để dùng mẫu này");
                    return;
                  }
                  setBackground(t.bg);
                  triggerAutosave();
                }}
                style={{
                  width: "100%",
                  padding: 0,
                  border: "none",
                  cursor: isPremiumLocked ? "not-allowed" : "pointer",
                  background: "none",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    height: 100,
                    background: t.bg,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Premium lock overlay */}
                  {isPremiumLocked && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                        borderRadius: "inherit",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 22,
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                        }}
                      >
                        🔒
                      </span>
                    </div>
                  )}
                  {/* Tier Badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: 8,
                      fontWeight: 700,
                      background: badge.bg,
                      color: badge.text,
                      letterSpacing: 0.5,
                      zIndex: 3,
                    }}
                  >
                    {t.tier}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: t.textColor,
                      fontFamily: t.font,
                      fontWeight: 600,
                      opacity: 0.9,
                    }}
                  >
                    A & B
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      color: t.textColor,
                      fontFamily: t.font,
                      opacity: 0.6,
                      marginTop: 2,
                    }}
                  >
                    28.05.2026
                  </span>
                </div>
              </button>
              {/* Label + Stats + Xem mẫu */}
              <div style={{ padding: "6px 8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPremiumLocked) {
                        alert("Nâng cấp lên Premium để dùng mẫu này");
                        return;
                      }
                      setBackground(t.bg);
                      triggerAutosave();
                    }}
                    style={{
                      fontSize: 9,
                      padding: "2px 8px",
                      borderRadius: 4,
                      border: isPremiumLocked
                        ? "1px solid #8b5cf6"
                        : "1px solid #3b82f6",
                      background: isPremiumLocked ? "#f5f3ff" : "#eff6ff",
                      color: isPremiumLocked ? "#8b5cf6" : "#3b82f6",
                      cursor: isPremiumLocked ? "not-allowed" : "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {isPremiumLocked ? "Nâng cấp" : "Xem mẫu"}
                  </button>
                </div>
                {/* View count + usage */}
                <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 8, color: "#9ca3af" }}>
                    {t.views.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 8, color: "#f9a8d4" }}>
                    {t.uses.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
