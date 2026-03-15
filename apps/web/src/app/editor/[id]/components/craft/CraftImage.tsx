"use client";

import React, { useRef, useCallback } from "react";
import { useNode, useEditor, UserComponent } from "@craftjs/core";

/* ── Craft.js Image Component — CineLove Parity ──
 * - 8-point resize handles (corners + midpoints)
 * - Floating toolbar: Nhân bản / Xóa / ···
 * - Right panel: Cắt ảnh / Đổi ảnh / Xóa nền (AI)
 * - Full style accordions
 */

interface CraftImageProps {
  src: string;
  objectFit: "cover" | "contain" | "fill";
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  opacity: number;
  shadow: boolean;
  rotation?: number;
}

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

export const CraftImage: UserComponent<CraftImageProps> = ({
  src,
  objectFit,
  borderRadius,
  borderWidth,
  borderColor,
  opacity,
  shadow,
  rotation,
}) => {
  const {
    connectors: { connect, drag },
    selected,
    id,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const { actions: editorActions, query } = useEditor();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const localUrl = URL.createObjectURL(file);
      setProp((p: CraftImageProps) => {
        p.src = localUrl;
      });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", "editor");
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url)
          setProp((p: CraftImageProps) => {
            p.src = data.url;
          });
      } catch {
        /* keep local preview */
      }
      URL.revokeObjectURL(localUrl);
      e.target.value = "";
    },
    [setProp],
  );

  const handleDuplicate = useCallback(() => {
    try {
      const node = query.node(id).get();
      const parentId = node.data.parent;
      if (!parentId) return;
      const freshNode = query.createNode(
        React.createElement(CraftImage, {
          ...node.data.props,
        } as CraftImageProps),
      );
      editorActions.add(freshNode, parentId);
    } catch {
      /* noop */
    }
  }, [id, query, editorActions]);

  const handleDelete = useCallback(() => {
    try {
      editorActions.delete(id);
    } catch {
      /* noop */
    }
  }, [id, editorActions]);

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        position: "relative",
        cursor: selected ? "move" : "pointer",
        borderRadius: borderRadius + 2,
        transition: "outline 0.15s",
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || "/placeholder-couple.png"}
        alt="Template image"
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          borderRadius,
          border: borderWidth
            ? `${borderWidth}px solid ${borderColor}`
            : "none",
          opacity,
          boxShadow: shadow ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
          display: "block",
        }}
        onDoubleClick={() => fileRef.current?.click()}
      />

      {/* ── Selection UI — CineLove style ── */}
      {selected && (
        <>
          {/* Blue selection border */}
          <div
            style={{
              position: "absolute",
              inset: -2,
              border: "2px dashed #3b82f6",
              borderRadius: borderRadius + 2,
              pointerEvents: "none",
            }}
          />

          {/* 8-point resize handles */}
          {HANDLE_POSITIONS.map((pos, i) => (
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

          {/* Floating toolbar — CineLove dark theme */}
          <div
            style={{
              position: "absolute",
              top: -36,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
              background: "#1f2937",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              padding: "4px 6px",
              zIndex: 20,
              whiteSpace: "nowrap",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDuplicate}
              style={toolbarBtnStyle}
              title="Nhân bản"
            >
              📋
            </button>
            <button
              onClick={handleDelete}
              style={{ ...toolbarBtnStyle, color: "#fca5a5" }}
              title="Xóa"
            >
              🗑️
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              style={toolbarBtnStyle}
              title="Đổi ảnh"
            >
              ···
            </button>
          </div>
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

const toolbarBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 6,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
  color: "#fff",
};

CraftImage.craft = {
  displayName: "Image",
  props: {
    src: "/placeholder-couple.png",
    objectFit: "cover" as const,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "#f9a8d4",
    opacity: 1,
    shadow: false,
    rotation: 0,
  },
  related: {
    settings: CraftImageSettings,
  },
};

/* ── Settings panel — CineLove Parity ──
 * Cắt ảnh / Đổi ảnh / Xóa nền (AI)
 * Accordions: Màu sắc / Khoảng đệm / Đường viền / Đổ bóng / Liên kết
 */
function CraftImageSettings() {
  const {
    actions: { setProp },
    src,
    borderRadius,
    borderWidth,
    borderColor,
    objectFit,
    opacity,
    shadow,
    rotation,
  } = useNode((node) => ({
    src: node.data.props.src,
    borderRadius: node.data.props.borderRadius,
    borderWidth: node.data.props.borderWidth,
    borderColor: node.data.props.borderColor,
    objectFit: node.data.props.objectFit,
    opacity: node.data.props.opacity,
    shadow: node.data.props.shadow,
    rotation: node.data.props.rotation,
  }));

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "8px 0",
      }}
    >
      {/* Image Preview */}
      <div
        style={{
          width: "100%",
          height: 120,
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
          src={src || "/placeholder-couple.png"}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Primary Action Buttons — CineLove: Cắt ảnh + Đổi ảnh */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            const modes: Array<"cover" | "contain" | "fill"> = [
              "cover",
              "contain",
              "fill",
            ];
            const idx = modes.indexOf(objectFit);
            setProp((p: CraftImageProps) => {
              p.objectFit = modes[(idx + 1) % modes.length];
            });
          }}
          style={actionBtnStyle}
        >
          ✂️ Cắt ảnh
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            ...actionBtnStyle,
            border: "1px solid #3b82f6",
            background: "#eff6ff",
            color: "#1d4ed8",
          }}
        >
          🔄 Đổi ảnh
        </button>
      </div>

      {/* Xóa nền (AI) — CineLove Premium feature */}
      <button
        onClick={() => alert("Tính năng Xóa nền AI sẽ sớm ra mắt!")}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: 8,
          border: "none",
          background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
          color: "#fff",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        ✨ Xóa nền (AI)
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const localUrl = URL.createObjectURL(file);
          setProp((p: CraftImageProps) => {
            p.src = localUrl;
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
            if (data.url)
              setProp((p: CraftImageProps) => {
                p.src = data.url;
              });
          } catch {
            /* keep local */
          }
          URL.revokeObjectURL(localUrl);
          e.target.value = "";
        }}
        style={{ display: "none" }}
      />

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #f0f0f0",
          margin: "4px 0",
        }}
      />

      {/* Accordion: Đường viền */}
      <Accordion title="Đường viền">
        <label style={labelStyle}>
          Bo góc
          <input
            type="range"
            min={0}
            max={50}
            value={borderRadius}
            onChange={(e) =>
              setProp((p: CraftImageProps) => {
                p.borderRadius = Number(e.target.value);
              })
            }
            style={{ width: "100%" }}
          />
          <span style={valueStyle}>{borderRadius}px</span>
        </label>
        <label style={labelStyle}>
          Độ rộng viền
          <input
            type="range"
            min={0}
            max={10}
            value={borderWidth}
            onChange={(e) =>
              setProp((p: CraftImageProps) => {
                p.borderWidth = Number(e.target.value);
              })
            }
            style={{ width: "100%" }}
          />
          <span style={valueStyle}>{borderWidth}px</span>
        </label>
        <label style={labelStyle}>
          Màu viền
          <input
            type="color"
            value={borderColor}
            onChange={(e) =>
              setProp((p: CraftImageProps) => {
                p.borderColor = e.target.value;
              })
            }
          />
        </label>
      </Accordion>

      {/* Accordion: Đổ bóng */}
      <Accordion title="Đổ bóng">
        <label
          style={{
            ...labelStyle,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <input
            type="checkbox"
            checked={shadow}
            onChange={(e) =>
              setProp((p: CraftImageProps) => {
                p.shadow = e.target.checked;
              })
            }
          />
          Bật bóng đổ
        </label>
        <label style={labelStyle}>
          Trong suốt
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(opacity * 100)}
            onChange={(e) =>
              setProp((p: CraftImageProps) => {
                p.opacity = Number(e.target.value) / 100;
              })
            }
            style={{ width: "100%" }}
          />
          <span style={valueStyle}>{(opacity * 100).toFixed(0)}%</span>
        </label>
      </Accordion>

      {/* Accordion: Kiểu hiển thị */}
      <Accordion title="Màu sắc">
        <label style={labelStyle}>
          Kiểu hiển thị
          <select
            value={objectFit}
            onChange={(e) =>
              setProp((p: CraftImageProps) => {
                p.objectFit = e.target.value as "cover" | "contain" | "fill";
              })
            }
            style={selectStyle}
          >
            <option value="cover">Cover (lấp đầy)</option>
            <option value="contain">Contain (vừa khung)</option>
            <option value="fill">Fill (kéo giãn)</option>
          </select>
        </label>
      </Accordion>

      {/* Accordion: Xoay */}
      <Accordion title="Xoay">
        <label style={labelStyle}>
          Góc xoay
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={0}
              max={360}
              value={rotation ?? 0}
              onChange={(e) =>
                setProp((p: CraftImageProps) => {
                  p.rotation = Number(e.target.value);
                })
              }
              style={{ flex: 1 }}
            />
            <input
              type="number"
              min={0}
              max={360}
              value={rotation ?? 0}
              onChange={(e) =>
                setProp((p: CraftImageProps) => {
                  p.rotation = Number(e.target.value);
                })
              }
              style={{
                width: 48,
                padding: "4px 6px",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 12,
                textAlign: "center" as const,
              }}
            />
            <span style={valueStyle}>°</span>
          </div>
        </label>
      </Accordion>

      {/* URL input */}
      <Accordion title="Liên kết">
        <label style={labelStyle}>
          URL ảnh
          <input
            type="url"
            placeholder="https://..."
            onBlur={(e) => {
              if (e.target.value)
                setProp((p: CraftImageProps) => {
                  p.src = e.target.value;
                });
            }}
            style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
          />
        </label>
      </Accordion>
    </div>
  );
}

/* ── Accordion Component — CineLove style ── */
function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderTop: "1px solid #f0f0f0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 0",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        {title}
        <span style={{ fontSize: 10, color: "#9ca3af" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingBottom: 8,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
  color: "#374151",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
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
const selectStyle: React.CSSProperties = {
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  background: "#fff",
};
