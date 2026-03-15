import React from "react";

/* ── Shared styles ── */
export const panelLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#6b7280",
  margin: "0 0 8px",
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase",
};

export function topBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: disabled ? "#d1d5db" : "#374151",
  };
}

/* ── Floating toolbar button style ── */
export const floatBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  border: "none",
  borderRadius: 6,
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#e5e7eb",
  transition: "background 0.1s",
};
