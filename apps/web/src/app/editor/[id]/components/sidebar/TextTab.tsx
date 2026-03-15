"use client";

import React from "react";
import { TEXT_PRESETS, panelLabelStyle } from "../editor-constants";

interface TextTabProps {
  addCraftText: (preset: (typeof TEXT_PRESETS)[0]) => void;
}

export function TextTab({ addCraftText }: TextTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={panelLabelStyle}>Thêm văn bản</p>
      {TEXT_PRESETS.map((preset) => (
        <button
          key={preset.label}
          onClick={() => addCraftText(preset)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: preset.fontFamily,
            fontSize: Math.min(preset.fontSize * 0.65, 16),
          }}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
