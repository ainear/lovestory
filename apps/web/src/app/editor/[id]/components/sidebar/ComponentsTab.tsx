"use client";

import React from "react";
import {
  SECTION_PRESETS as CANVAS_PRESETS,
  SECTION_PRESET_CATEGORIES,
} from "@/server/data/section-presets";
import type {
  CanvasElement,
  EditorAction,
  EditorState,
} from "../canvas-engine/types";

interface ComponentsTabProps {
  sectionCat: string;
  setSectionCat: (val: string) => void;
  triggerAutosave: () => void;
  editorDispatch?: React.Dispatch<EditorAction>;
  editorState?: EditorState;
}

let nextPresetCounter = 0;
function generateId(): string {
  nextPresetCounter += 1;
  return `sec-${Date.now()}-${nextPresetCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

function getInsertionY(elements: CanvasElement[]): number {
  if (elements.length === 0) return 20;
  let maxBottom = 0;
  for (const el of elements) {
    const h = typeof el.height === "number" ? el.height : 50;
    const bottom = el.top + h;
    if (bottom > maxBottom) maxBottom = bottom;
  }
  return maxBottom + 40;
}

export function ComponentsTab({
  sectionCat,
  setSectionCat,
  triggerAutosave,
  editorDispatch,
  editorState,
}: ComponentsTabProps) {
  const filteredPresets = CANVAS_PRESETS.filter(
    (p) => sectionCat === "all" || p.category === sectionCat,
  );

  function insertCanvasPreset(presetId: string) {
    if (!editorDispatch || !editorState) return;
    const preset = CANVAS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const insertY = getInsertionY(editorState.elements);
    const maxZ = editorState.elements.reduce(
      (max, el) => Math.max(max, el.zIndex),
      0,
    );

    editorDispatch({ type: "SNAPSHOT" });
    preset.elements.forEach((elTemplate, idx) => {
      const element: CanvasElement = {
        ...elTemplate,
        id: generateId(),
        top: elTemplate.top + insertY,
        zIndex: maxZ + idx + 1,
      };
      editorDispatch({ type: "ADD_ELEMENT", element });
    });
    triggerAutosave();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
          margin: 0,
        }}
      >
        Thu vien thanh phan
      </p>
      <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
        Chen nhanh cac khoi noi dung co san
      </p>

      {/* Category filter chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          marginTop: 2,
        }}
      >
        {SECTION_PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSectionCat(cat.id)}
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              border: "none",
              background: sectionCat === cat.id ? "#ff6b9d" : "#f3f4f6",
              color: sectionCat === cat.id ? "#fff" : "#6b7280",
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Section preset cards — 2-column visual grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: 4,
        }}
      >
        {filteredPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => insertCanvasPreset(preset.id)}
            style={{
              padding: 0,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              textAlign: "left",
              overflow: "hidden",
              transition: "all 0.15s",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ff6b9d";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(255,107,157,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Thumbnail area */}
            <div
              style={{
                aspectRatio: "3/4",
                background: "linear-gradient(135deg, #fce7f3, #f9a8d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              {preset.thumbnail}
            </div>
            <div style={{ padding: "6px 8px" }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#374151",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {preset.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
