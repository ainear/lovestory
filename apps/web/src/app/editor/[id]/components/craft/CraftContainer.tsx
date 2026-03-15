"use client";

import React from "react";
import { useNode, Element, UserComponent } from "@craftjs/core";

/* ── Craft.js Container / Section Component ──
 * Droppable region for text, images, widgets
 * Styled with background, padding, alignment
 */

/* ── 8-point resize handles — corners + midpoints ── */
const HANDLE_POSITIONS = [
  { top: -4, left: -4, cursor: "nwse-resize" }, // top-left
  { top: -4, left: "50%", cursor: "ns-resize", ml: -4 }, // top-center
  { top: -4, right: -4, cursor: "nesw-resize" }, // top-right
  { top: "50%", right: -4, cursor: "ew-resize", mt: -4 }, // mid-right
  { bottom: -4, right: -4, cursor: "nwse-resize" }, // bottom-right
  { bottom: -4, left: "50%", cursor: "ns-resize", ml: -4 }, // bottom-center
  { bottom: -4, left: -4, cursor: "nesw-resize" }, // bottom-left
  { top: "50%", left: -4, cursor: "ew-resize", mt: -4 }, // mid-left
] as const;

interface CraftContainerProps {
  background: string;
  padding: number;
  minHeight: number;
  flexDirection: "column" | "row";
  alignItems: "flex-start" | "center" | "flex-end" | "stretch";
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between";
  gap: number;
  rotation?: number;
  children?: React.ReactNode;
}

export const CraftContainer: UserComponent<CraftContainerProps> = ({
  background,
  padding,
  minHeight,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  rotation,
  children,
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const replaceRef = React.useRef<HTMLInputElement>(null);
  const isImageBg =
    typeof background === "string" && background.includes("url(");

  const handleReplace = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const localUrl = URL.createObjectURL(file);
      setProp((p: CraftContainerProps) => {
        p.background = `url(${localUrl}) center/cover no-repeat`;
      });
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", "editor");
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setProp((p: CraftContainerProps) => {
            p.background = `url(${data.url}) center/cover no-repeat`;
          });
        }
      } catch {
        /* keep local preview */
      }
      URL.revokeObjectURL(localUrl);
      e.target.value = "";
    },
    [setProp],
  );

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        background,
        padding,
        minHeight,
        display: "flex",
        flexDirection,
        alignItems,
        justifyContent,
        gap,
        width: "100%",
        outline: selected ? "2px dashed #3b82f6" : "none",
        outlineOffset: -2,
        borderRadius: 4,
        transition: "outline 0.15s",
        cursor: selected ? "move" : "default",
        position: "relative",
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {children}

      {/* 8-point resize handles when selected */}
      {selected &&
        HANDLE_POSITIONS.map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#fff",
              border: "2px solid #3b82f6",
              top: "top" in pos ? (pos.top as number | string) : undefined,
              left: "left" in pos ? (pos.left as number | string) : undefined,
              right:
                "right" in pos ? (pos.right as number | string) : undefined,
              bottom:
                "bottom" in pos ? (pos.bottom as number | string) : undefined,
              cursor: pos.cursor,
              marginLeft: "ml" in pos ? pos.ml : undefined,
              marginTop: "mt" in pos ? pos.mt : undefined,
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
        ))}

      {/* Always-visible "Change Photo" button when container has bg image */}
      {isImageBg && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              replaceRef.current?.click();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              zIndex: 9999,
              padding: "5px 10px",
              borderRadius: 6,
              background: "rgba(0,0,0,0.65)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 3,
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              pointerEvents: "auto",
              letterSpacing: 0.3,
            }}
          >
            📷 Thay ảnh
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept="image/*"
            onChange={handleReplace}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  );
};

CraftContainer.craft = {
  displayName: "Section",
  props: {
    background: "transparent",
    padding: 16,
    minHeight: 100,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    rotation: 0,
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: CraftContainerSettings,
  },
};

/* ── Settings panel for Container ── */
function CraftContainerSettings() {
  const {
    actions: { setProp },
    background,
    padding,
    minHeight,
    gap,
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    minHeight: node.data.props.minHeight,
    gap: node.data.props.gap,
  }));

  const fileRef = React.useRef<HTMLInputElement>(null);
  const isImageBg =
    typeof background === "string" && background.includes("url(");
  const isGradient =
    typeof background === "string" && background.includes("gradient");

  // Extract image URL from CSS background value
  const extractImageUrl = (bg: string): string | null => {
    const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
    return match ? match[1] : null;
  };
  const bgImageUrl = isImageBg ? extractImageUrl(background) : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "8px 0",
      }}
    >
      {/* Background Image Preview — show when has image bg */}
      {isImageBg && bgImageUrl && (
        <div
          style={{
            width: "100%",
            height: 100,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImageUrl}
            alt="Background preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* Background Image Replace Button */}
      {isImageBg && (
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #3b82f6",
            background: "#eff6ff",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            color: "#1d4ed8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          🔄 Đổi ảnh nền
        </button>
      )}

      {/* Upload Button for non-image backgrounds */}
      {!isImageBg && (
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px dashed #d1d5db",
            background: "#f9fafb",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          📁 Thêm ảnh nền
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          // Instant local preview
          const localUrl = URL.createObjectURL(file);
          const bgCss = `url(${localUrl}) center/cover no-repeat`;
          setProp((p: CraftContainerProps) => {
            p.background = bgCss;
          });
          // Upload to Supabase
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("projectId", "editor");
            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.url) {
              setProp((p: CraftContainerProps) => {
                p.background = `url(${data.url}) center/cover no-repeat`;
              });
            }
          } catch {
            /* keep local preview */
          }
          URL.revokeObjectURL(localUrl);
          e.target.value = "";
        }}
        style={{ display: "none" }}
      />

      {/* Remove background image */}
      {isImageBg && (
        <button
          onClick={() =>
            setProp((p: CraftContainerProps) => {
              p.background = "transparent";
            })
          }
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            cursor: "pointer",
            fontSize: 10,
            fontWeight: 600,
            color: "#dc2626",
          }}
        >
          🗑️ Xóa ảnh nền
        </button>
      )}

      {/* Background Color — solid colors and gradients */}
      {!isImageBg && (
        <label style={labelStyle}>
          Màu nền
          <input
            type="color"
            value={
              background === "transparent" || isGradient
                ? "#ffffff"
                : background
            }
            onChange={(e) =>
              setProp((p: CraftContainerProps) => {
                p.background = e.target.value;
              })
            }
          />
        </label>
      )}

      {/* Quick Background Patterns */}
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#9ca3af",
            margin: "0 0 4px",
          }}
        >
          Nền nhanh
        </p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { label: "Trong", value: "transparent" },
            { label: "Trắng", value: "rgba(255,255,255,0.5)" },
            { label: "Kem", value: "rgba(255,248,240,0.8)" },
            { label: "Hồng", value: "rgba(253,232,243,0.6)" },
          ].map((bg) => (
            <button
              key={bg.label}
              onClick={() =>
                setProp((p: CraftContainerProps) => {
                  p.background = bg.value;
                })
              }
              style={{
                width: 40,
                height: 24,
                borderRadius: 4,
                border:
                  background === bg.value
                    ? "2px solid #3b82f6"
                    : "1px solid #e5e7eb",
                background:
                  bg.value === "transparent"
                    ? "repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 8px 8px"
                    : bg.value,
                cursor: "pointer",
                fontSize: 7,
                fontWeight: 600,
                color: "#6b7280",
              }}
              title={bg.label}
            />
          ))}
        </div>
      </div>

      {/* Padding */}
      <label style={labelStyle}>
        Padding
        <input
          type="range"
          min={0}
          max={64}
          value={padding}
          onChange={(e) =>
            setProp((p: CraftContainerProps) => {
              p.padding = Number(e.target.value);
            })
          }
          style={{ width: "100%" }}
        />
        <span style={valueStyle}>{padding}px</span>
      </label>

      {/* Min Height */}
      <label style={labelStyle}>
        Chiều cao tối thiểu
        <input
          type="range"
          min={50}
          max={800}
          step={10}
          value={minHeight}
          onChange={(e) =>
            setProp((p: CraftContainerProps) => {
              p.minHeight = Number(e.target.value);
            })
          }
          style={{ width: "100%" }}
        />
        <span style={valueStyle}>{minHeight}px</span>
      </label>

      {/* Gap */}
      <label style={labelStyle}>
        Khoảng cách
        <input
          type="range"
          min={0}
          max={48}
          value={gap}
          onChange={(e) =>
            setProp((p: CraftContainerProps) => {
              p.gap = Number(e.target.value);
            })
          }
          style={{ width: "100%" }}
        />
        <span style={valueStyle}>{gap}px</span>
      </label>
    </div>
  );
}

/* ── Root Canvas Container — top-level drop zone ── */
export const RootContainer: UserComponent<{
  background: string;
  children?: React.ReactNode;
}> = ({ background, children }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      style={{
        width: 390,
        minHeight: 5000,
        background,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

RootContainer.craft = {
  displayName: "Canvas",
  props: {
    background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
  },
  rules: {
    canDrag: () => false,
  },
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 12,
  fontWeight: 600,
  color: "#6b7280",
};
const valueStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#9ca3af",
  fontWeight: 400,
};
