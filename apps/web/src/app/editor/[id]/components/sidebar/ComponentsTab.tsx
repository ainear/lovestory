"use client";

import React from "react";
import {
  SECTION_CATEGORIES,
  SECTION_PRESETS,
} from "@/server/data/section-library";

interface ComponentsTabProps {
  sectionCat: string;
  setSectionCat: (val: string) => void;
  triggerAutosave: () => void;
  /** Stub query object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  /** Stub actions object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
  /** Stub CraftText component for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftText: React.ComponentType<any>;
  /** Stub CraftImage component for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftImage: React.ComponentType<any>;
  /** Stub CraftContainer component for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftContainer: React.ComponentType<any>;
}

export function ComponentsTab({
  sectionCat,
  setSectionCat,
  triggerAutosave,
  query,
  actions,
  CraftText,
  CraftImage,
  CraftContainer,
}: ComponentsTabProps) {
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
        Thư viện thành phần
      </p>
      <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
        Chèn nhanh các khối nội dung có sẵn
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
        {SECTION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSectionCat(cat.id)}
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              border: "none",
              background:
                sectionCat === cat.id ? "#ff6b9d" : "#f3f4f6",
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
        {SECTION_PRESETS.filter(
          (p) => sectionCat === "all" || p.category === sectionCat,
        ).map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              const rootNodeId = query.node("ROOT").get().data
                .nodes?.[0];
              if (!rootNodeId) return;
              preset.elements.forEach((el) => {
                let reactEl: React.ReactElement;
                if (el.type === "text") {
                  const p = el.props as {
                    fontSize?: number;
                    fontFamily?: string;
                    fontWeight?: string;
                    fontStyle?: string;
                    color?: string;
                    textAlign?: string;
                    letterSpacing?: number;
                  };
                  reactEl = (
                    <CraftText
                      text={el.label}
                      fontSize={p.fontSize ?? 16}
                      fontFamily={
                        p.fontFamily ?? "'Inter', sans-serif"
                      }
                      fontWeight={p.fontWeight ?? "normal"}
                      fontStyle={p.fontStyle ?? "normal"}
                      color={p.color ?? "#374151"}
                      textAlign={
                        (p.textAlign as
                          | "left"
                          | "center"
                          | "right") ?? "center"
                      }
                      lineHeight={1.5}
                      letterSpacing={p.letterSpacing ?? 0}
                      opacity={1}
                    />
                  );
                } else if (el.type === "image") {
                  const p = el.props as {
                    objectFit?: string;
                    borderRadius?: number;
                  };
                  reactEl = (
                    <CraftImage
                      src=""
                      objectFit={
                        (p.objectFit as
                          | "cover"
                          | "contain"
                          | "fill") ?? "cover"
                      }
                      borderRadius={p.borderRadius ?? 8}
                      borderWidth={0}
                      borderColor="transparent"
                      opacity={1}
                      shadow={false}
                    />
                  );
                } else {
                  const p = el.props as {
                    background?: string;
                    padding?: number;
                  };
                  reactEl = (
                    <CraftContainer
                      background={p.background ?? "#f9fafb"}
                      padding={p.padding ?? 16}
                      minHeight={80}
                      flexDirection="column"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      gap={8}
                    />
                  );
                }
                try {
                  const tree = query
                    .parseReactElement(reactEl)
                    .toNodeTree();
                  actions.addNodeTree(tree, rootNodeId);
                } catch {
                  /* noop */
                }
              });
              triggerAutosave();
            }}
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
            {/* Visual preview thumbnail — aspect ratio 3:4 */}
            <div
              style={{
                aspectRatio: "3/4",
                background: preset.previewBg,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: 8,
              }}
            >
              {preset.category === "photo" && (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 3,
                      width: "100%",
                    }}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          height: 28,
                          background: "rgba(255,255,255,0.45)",
                          borderRadius: 4,
                          border: "1px solid rgba(255,255,255,0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                        }}
                      >
                        🖼
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      width: "70%",
                      height: 6,
                      background: "rgba(255,255,255,0.5)",
                      borderRadius: 3,
                    }}
                  />
                </>
              )}
              {preset.category === "info" && (
                <>
                  <div
                    style={{
                      width: "60%",
                      height: 7,
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 3,
                      marginBottom: 2,
                    }}
                  />
                  <div
                    style={{
                      width: "80%",
                      height: 5,
                      background: "rgba(255,255,255,0.5)",
                      borderRadius: 3,
                    }}
                  />
                  <div
                    style={{
                      width: "70%",
                      height: 5,
                      background: "rgba(255,255,255,0.4)",
                      borderRadius: 3,
                    }}
                  />
                  <div
                    style={{
                      width: "50%",
                      height: 5,
                      background: "rgba(255,255,255,0.3)",
                      borderRadius: 3,
                    }}
                  />
                </>
              )}
              {preset.category === "timeline" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "80%",
                    alignItems: "flex-start",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.9)",
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          height: 5,
                          background: "rgba(255,255,255,0.5)",
                          borderRadius: 3,
                          width: `${55 + i * 10}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {preset.category === "invitation" && (
                <div
                  style={{
                    width: "75%",
                    height: "60%",
                    border: "2px solid rgba(255,255,255,0.7)",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.25)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 16 }}>💌</span>
                  <div
                    style={{
                      width: "60%",
                      height: 4,
                      background: "rgba(255,255,255,0.6)",
                      borderRadius: 2,
                    }}
                  />
                  <div
                    style={{
                      width: "45%",
                      height: 4,
                      background: "rgba(255,255,255,0.4)",
                      borderRadius: 2,
                    }}
                  />
                </div>
              )}
              {![
                "photo",
                "info",
                "timeline",
                "invitation",
              ].includes(preset.category) && (
                <div
                  style={{
                    width: "80%",
                    border: "1px solid rgba(255,255,255,0.5)",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.2)",
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: "50%",
                      height: 6,
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 3,
                    }}
                  />
                  <div
                    style={{
                      width: "80%",
                      height: 4,
                      background: "rgba(255,255,255,0.4)",
                      borderRadius: 3,
                    }}
                  />
                  <div
                    style={{
                      width: "65%",
                      height: 4,
                      background: "rgba(255,255,255,0.3)",
                      borderRadius: 3,
                    }}
                  />
                </div>
              )}
            </div>
            {/* Card name below thumbnail */}
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
