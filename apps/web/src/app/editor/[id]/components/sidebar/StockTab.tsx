"use client";

import React from "react";
import {
  CLIPART_CATEGORIES,
  CLIPART_ITEMS,
} from "@/server/data/clipart-library";

interface StockTabProps {
  clipartCat: string;
  setClipartCat: (val: string) => void;
  triggerAutosave: () => void;
  /** Stub query object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  /** Stub actions object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
  /** Stub CraftSticker component for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftSticker: React.ComponentType<any>;
}

export function StockTab({
  clipartCat,
  setClipartCat,
  triggerAutosave,
  query,
  actions,
  CraftSticker,
}: StockTabProps) {
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
              background:
                clipartCat === cat.id ? "#fdf2f8" : "#f3f4f6",
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
          (item) =>
            clipartCat === "all" || item.category === clipartCat,
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => {
              const el = (
                <CraftSticker
                  stickerId={item.id}
                  color="#d4a574"
                  size={150}
                  opacity={1}
                  customSvg={item.svgContent}
                />
              );
              const tree = query.parseReactElement(el).toNodeTree();
              const rootNodeId = query.node("ROOT").get().data
                .nodes?.[0];
              if (rootNodeId) actions.addNodeTree(tree, rootNodeId);
              triggerAutosave();
            }}
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
              dangerouslySetInnerHTML={{ __html: item.svgContent }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
