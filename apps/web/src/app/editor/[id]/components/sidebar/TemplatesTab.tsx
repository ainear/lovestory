"use client";

import React from "react";
import { TEMPLATE_STYLES } from "../editor-constants";

interface TemplatesTabProps {
  background: string;
  setBackground: (val: string) => void;
  triggerAutosave: () => void;
  /** Stub query object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  /** Stub actions object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
}

export function TemplatesTab({
  background,
  setBackground,
  triggerAutosave,
  query,
  actions,
}: TemplatesTabProps) {
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
              }}
            >
              {/* Thumbnail preview */}
              <button
                onClick={() => {
                  setBackground(t.bg);
                  const rootNodeId = query.node("ROOT").get().data
                    .nodes?.[0];
                  if (rootNodeId) {
                    actions.setProp(
                      rootNodeId,
                      (props: { background: string }) => {
                        props.background = t.bg;
                      },
                    );
                  }
                  const nodes = query.getSerializedNodes();
                  Object.keys(nodes).forEach((nodeId) => {
                    const node = nodes[nodeId];
                    if (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (node?.type as any)?.resolvedName ===
                      "CraftText"
                    ) {
                      actions.setProp(
                        nodeId,
                        (props: { color: string }) => {
                          props.color = t.textColor;
                        },
                      );
                    }
                  });
                  triggerAutosave();
                }}
                style={{
                  width: "100%",
                  padding: 0,
                  border: "none",
                  cursor: "pointer",
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
                      setBackground(t.bg);
                      const rootNodeId = query.node("ROOT").get()
                        .data.nodes?.[0];
                      if (rootNodeId) {
                        actions.setProp(
                          rootNodeId,
                          (props: { background: string }) => {
                            props.background = t.bg;
                          },
                        );
                      }
                      triggerAutosave();
                    }}
                    style={{
                      fontSize: 9,
                      padding: "2px 8px",
                      borderRadius: 4,
                      border: "1px solid #3b82f6",
                      background: "#eff6ff",
                      color: "#3b82f6",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Xem mẫu
                  </button>
                </div>
                {/* View count + usage */}
                <div
                  style={{ display: "flex", gap: 8, marginTop: 3 }}
                >
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
