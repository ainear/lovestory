"use client";
import type { GuideLine } from "./types";

export function SnapGuideLines({ guides }: { guides: GuideLine[] }) {
  if (guides.length === 0) return null;

  return (
    <>
      {guides.map((guide, i) =>
        guide.orientation === "horizontal" ? (
          <div
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: guide.position,
              left: 0,
              width: "100%",
              height: 0,
              borderTop: "1px dashed #3b82f6",
              pointerEvents: "none",
              zIndex: 999999,
            }}
          />
        ) : (
          <div
            key={`v-${i}`}
            style={{
              position: "absolute",
              left: guide.position,
              top: 0,
              width: 0,
              height: "100%",
              borderLeft: "1px dashed #3b82f6",
              pointerEvents: "none",
              zIndex: 999999,
            }}
          />
        ),
      )}
    </>
  );
}
