"use client";

import React from "react";

interface ShapesTabProps {
  triggerAutosave: () => void;
  /** Stub query object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  /** Stub actions object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
  /** Stub CraftShape component for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftShape: React.ComponentType<any>;
}

const SHAPES = [
  {
    id: "shape-line",
    name: "Đường thẳng",
    shapeType: "line",
    svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" stroke-width="4"/></svg>',
  },
  {
    id: "shape-rect",
    name: "Hình chữ nhật",
    shapeType: "rectangle",
    svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="40" width="160" height="120" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
  },
  {
    id: "shape-circle",
    name: "Hình tròn",
    shapeType: "circle",
    svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
  },
  {
    id: "shape-triangle",
    name: "Tam giác",
    shapeType: "triangle",
    svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,20 180,180 20,180" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
  },
  {
    id: "shape-star",
    name: "Ngôi sao",
    shapeType: "star",
    svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,10 125,75 195,80 140,125 155,195 100,160 45,195 60,125 5,80 75,75" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
  },
  {
    id: "shape-heart",
    name: "Trái tim",
    shapeType: "heart",
    svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100,180 C60,140 10,110 10,70 C10,30 50,10 100,50 C150,10 190,30 190,70 C190,110 140,140 100,180Z" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
  },
];

export function ShapesTab({
  triggerAutosave,
  query,
  actions,
  CraftShape,
}: ShapesTabProps) {
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
        Hình dạng cơ bản
      </p>
      <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
        Thêm hình dạng vào thiệp
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginTop: 4,
        }}
      >
        {SHAPES.map((shape) => (
          <button
            key={shape.id}
            onClick={() => {
              const el = (
                <CraftShape
                  shapeType={shape.shapeType}
                  fill="#374151"
                  stroke="#374151"
                  strokeWidth={2}
                  opacity={1}
                  rotation={0}
                />
              );
              const tree = query.parseReactElement(el).toNodeTree();
              const rootNodeId = query.node("ROOT").get().data
                .nodes?.[0];
              if (rootNodeId) actions.addNodeTree(tree, rootNodeId);
              triggerAutosave();
            }}
            style={{
              padding: "12px 6px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.15s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ff6b9d";
              e.currentTarget.style.background = "#fff0f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.background = "#fff";
            }}
          >
            <div
              style={{ width: 40, height: 40, color: "#6b7280" }}
              dangerouslySetInnerHTML={{ __html: shape.svg }}
            />
            <span
              style={{
                fontSize: 9,
                color: "#6b7280",
                fontWeight: 500,
              }}
            >
              {shape.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
