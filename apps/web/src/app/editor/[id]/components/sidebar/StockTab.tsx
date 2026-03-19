"use client";

import React from "react";
import DOMPurify from "isomorphic-dompurify";
import {
  CLIPART_CATEGORIES,
  CLIPART_ITEMS,
} from "@/server/data/clipart-library";
import type {
  EditorAction,
  CanvasElement,
  StickerProps,
} from "../canvas-engine/types";

interface StockTabProps {
  clipartCat: string;
  setClipartCat: (val: string) => void;
  triggerAutosave: () => void;
  editorDispatch?: React.Dispatch<EditorAction>;
}

export function StockTab({
  clipartCat,
  setClipartCat,
  triggerAutosave,
  editorDispatch,
}: StockTabProps) {
  function addSticker(item: { id: string; svgContent: string }) {
    if (!editorDispatch) return;
    const element: CanvasElement = {
       
      id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: "sticker",
      top: 100,
      left: 100,
      width: 150,
      height: 150,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      zIndex: 1,
      locked: false,
      visible: true,
      opacity: 1,
      borderRadius: 0,
      border: { width: 0, color: "transparent", style: "solid" },
      shadow: null,
      entrance: null,
      continuous: null,
      props: {
        stickerId: item.id,
        color: "#d4a574",
        size: 150,
        customSvg: item.svgContent,
      } as StickerProps,
    };
    editorDispatch({ type: "SNAPSHOT" });
    editorDispatch({ type: "ADD_ELEMENT", element });
    triggerAutosave();
  }

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
        Clipart đám cưới
      </p>
      <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
        Chọn danh mục và thêm clipart vào thiệp
      </p>
      {/* Category filter chips */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {CLIPART_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setClipartCat(cat.id)}
            style={{
              padding: "4px 10px",
              borderRadius: 12,
              border: "none",
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 500,
              background: clipartCat === cat.id ? "#fdf2f8" : "#f3f4f6",
              color: clipartCat === cat.id ? "#be185d" : "#6b7280",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
      {/* Clipart grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 6,
        }}
      >
        {CLIPART_ITEMS.filter(
          (item) => clipartCat === "all" || item.category === clipartCat,
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => addSticker(item)}
            title={item.name}
            style={{
              padding: 6,
              borderRadius: 8,
              border: "1px solid #f3e8ff",
              background: "#faf5ff",
              cursor: "pointer",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{ width: "100%", height: "100%" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item.svgContent),
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
