"use client";
import { useState, useCallback } from "react";
import { useEditorContext } from "./useEditorState";
import { LayersPanel } from "./LayersPanel";
import type { TextProps, ImageProps } from "./types";

/** Only allow safe URL schemes for image src */
function isValidImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true; // empty is ok (clearing)
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:image/")
  );
}

/** Parse number safely — returns fallback if NaN */
function safeNumber(value: string, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const FONT_FAMILIES = [
  { label: "Dancing Script", value: "'Dancing Script', cursive" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Great Vibes", value: "'Great Vibes', cursive" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Lora", value: "'Lora', serif" },
];

const ENTRANCE_ANIMATIONS = [
  { id: "none", label: "Không" },
  { id: "fadeIn", label: "Fade In" },
  { id: "slideUp", label: "Slide Up" },
  { id: "slideLeft", label: "Slide Left" },
  { id: "slideRight", label: "Slide Right" },
  { id: "scaleIn", label: "Scale In" },
  { id: "bounceIn", label: "Bounce In" },
  { id: "flipIn", label: "Flip In" },
];

const LOOP_ANIMATIONS = [
  { id: "none", label: "Không" },
  { id: "float", label: "Float (lên xuống)" },
  { id: "pulse", label: "Pulse (nhịp đập)" },
  { id: "shake", label: "Shake (rung)" },
  { id: "spin", label: "Spin (xoay)" },
  { id: "bounce", label: "Bounce (nảy)" },
];

export function CanvasRightPanel() {
  const { state, dispatch, selectedElement: el } = useEditorContext();

  if (!el) {
    return <LayersPanel />;
  }

  const isText = el.type === "text";
  const isImage = el.type === "image" || el.type === "sticker";
  const textProps = isText ? (el.props as TextProps) : null;
  const imageProps = isImage ? (el.props as ImageProps) : null;

  const updateProp = (props: Record<string, unknown>) => {
    dispatch({ type: "UPDATE_PROPS", id: el.id, props });
  };

  const updateElement = (patch: Record<string, unknown>) => {
    dispatch({ type: "UPDATE_ELEMENT", id: el.id, patch });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Element tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            background: "#3b82f6",
            color: "#fff",
            fontSize: 10,
            padding: "3px 10px",
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          {el.type.charAt(0).toUpperCase() + el.type.slice(1)}
        </span>
        <span style={{ fontSize: 10, color: "#9ca3af" }}>
          ID: {el.id.slice(0, 8)}
        </span>
        <button
          onClick={() => {
            dispatch({ type: "SNAPSHOT" });
            dispatch({ type: "DELETE_ELEMENT", id: el.id });
          }}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            color: "#dc2626",
            padding: "2px 6px",
          }}
          title="Xóa phần tử"
        >
          🗑️
        </button>
      </div>

      {/* ── Text Properties ── */}
      {isText && textProps && (
        <PanelSection title="Văn bản" icon="🔤">
          {/* Font Family */}
          <label style={labelStyle}>Font</label>
          <select
            value={textProps.fontFamily}
            onChange={(e) => updateProp({ fontFamily: e.target.value })}
            style={selectStyle}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Font Size + Weight */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Cỡ chữ</label>
              <input
                type="number"
                value={textProps.fontSize}
                onChange={(e) =>
                  updateProp({
                    fontSize: safeNumber(e.target.value, textProps.fontSize),
                  })
                }
                min={8}
                max={200}
                step={1}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Đậm</label>
              <select
                value={textProps.fontWeight}
                onChange={(e) => updateProp({ fontWeight: e.target.value })}
                style={selectStyle}
              >
                <option value="normal">Thường</option>
                <option value="bold">Đậm</option>
                <option value="100">100</option>
                <option value="300">300</option>
                <option value="500">500</option>
                <option value="700">700</option>
                <option value="900">900</option>
              </select>
            </div>
          </div>

          {/* Font Style */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Kiểu chữ</label>
              <select
                value={textProps.fontStyle}
                onChange={(e) => updateProp({ fontStyle: e.target.value })}
                style={selectStyle}
              >
                <option value="normal">Thường</option>
                <option value="italic">Nghiêng</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Căn chỉnh</label>
              <select
                value={textProps.textAlign}
                onChange={(e) => updateProp({ textAlign: e.target.value })}
                style={selectStyle}
              >
                <option value="left">Trái</option>
                <option value="center">Giữa</option>
                <option value="right">Phải</option>
                <option value="justify">Đều</option>
              </select>
            </div>
          </div>

          {/* Color */}
          <div style={{ marginTop: 8 }}>
            <label style={labelStyle}>Màu chữ</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                value={textProps.color}
                onChange={(e) => updateProp({ color: e.target.value })}
                style={{
                  width: 32,
                  height: 32,
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  cursor: "pointer",
                  padding: 0,
                }}
              />
              <input
                type="text"
                value={textProps.color}
                onChange={(e) => updateProp({ color: e.target.value })}
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          </div>

          {/* Line Height + Letter Spacing */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Chiều cao dòng</label>
              <input
                type="number"
                value={textProps.lineHeight}
                onChange={(e) =>
                  updateProp({
                    lineHeight: safeNumber(
                      e.target.value,
                      textProps.lineHeight,
                    ),
                  })
                }
                min={0.5}
                max={5}
                step={0.1}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Khoảng cách chữ</label>
              <input
                type="number"
                value={textProps.letterSpacing}
                onChange={(e) =>
                  updateProp({
                    letterSpacing: safeNumber(
                      e.target.value,
                      textProps.letterSpacing,
                    ),
                  })
                }
                min={-5}
                max={50}
                step={0.5}
                style={inputStyle}
              />
            </div>
          </div>
        </PanelSection>
      )}

      {/* ── Image Properties ── */}
      {isImage && imageProps && (
        <PanelSection title="Hình ảnh" icon="🖼️">
          <label style={labelStyle}>URL hình ảnh</label>
          <input
            type="text"
            value={imageProps.src}
            onChange={(e) => {
              const url = e.target.value;
              if (isValidImageUrl(url)) {
                updateProp({ src: url });
              }
            }}
            style={inputStyle}
            placeholder="https://..."
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Kiểu hiển thị</label>
              <select
                value={imageProps.objectFit}
                onChange={(e) => updateProp({ objectFit: e.target.value })}
                style={selectStyle}
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Bo góc</label>
              <input
                type="number"
                value={el.borderRadius}
                onChange={(e) =>
                  updateElement({
                    borderRadius: safeNumber(e.target.value, el.borderRadius),
                  })
                }
                min={0}
                max={999}
                step={1}
                style={inputStyle}
              />
            </div>
          </div>
        </PanelSection>
      )}

      {/* ── Position & Size ── */}
      <PanelSection title="Vị trí & Kích thước" icon="📐">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <div>
            <label style={labelStyle}>X (left)</label>
            <input
              type="number"
              value={Math.round(el.left)}
              onChange={(e) =>
                updateElement({ left: safeNumber(e.target.value, el.left) })
              }
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Y (top)</label>
            <input
              type="number"
              value={Math.round(el.top)}
              onChange={(e) =>
                updateElement({ top: safeNumber(e.target.value, el.top) })
              }
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Rộng</label>
            <input
              type="number"
              value={Math.round(el.width)}
              onChange={(e) =>
                updateElement({ width: safeNumber(e.target.value, el.width) })
              }
              min={10}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Cao</label>
            <input
              type={el.height === "auto" ? "text" : "number"}
              value={
                el.height === "auto" ? "auto" : Math.round(el.height as number)
              }
              onChange={(e) => {
                const v = e.target.value;
                if (v === "auto") {
                  updateElement({ height: "auto" });
                } else {
                  const n = safeNumber(
                    v,
                    typeof el.height === "number" ? el.height : 100,
                  );
                  updateElement({ height: n });
                }
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Xoay (°)</label>
            <input
              type="number"
              value={Math.round(el.rotation)}
              onChange={(e) =>
                updateElement({
                  rotation: safeNumber(e.target.value, el.rotation),
                })
              }
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Lớp (z)</label>
            <input
              type="number"
              value={el.zIndex}
              onChange={(e) =>
                updateElement({ zIndex: safeNumber(e.target.value, el.zIndex) })
              }
              min={0}
              style={inputStyle}
            />
          </div>
        </div>
      </PanelSection>

      {/* ── Opacity ── */}
      <PanelSection title="Độ trong suốt" icon="💧">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={el.opacity}
            onChange={(e) => updateElement({ opacity: Number(e.target.value) })}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: 11, color: "#6b7280", minWidth: 35 }}>
            {Math.round(el.opacity * 100)}%
          </span>
        </div>
      </PanelSection>

      {/* ── Entrance Animation ── */}
      <PanelSection title="Hiệu ứng chuyển động" icon="🎬">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ENTRANCE_ANIMATIONS.map((a) => {
            const isActive = (el.entrance?.type ?? "none") === a.id;
            return (
              <button
                key={a.id}
                onClick={() => {
                  dispatch({ type: "SNAPSHOT" });
                  updateElement({
                    entrance:
                      a.id === "none"
                        ? null
                        : { type: a.id, duration: 600, delay: 0 },
                  });
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: isActive ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                  background: isActive ? "#eff6ff" : "#fff",
                  cursor: "pointer",
                  fontSize: 11,
                  color: isActive ? "#1d4ed8" : "#374151",
                  textAlign: "left" as const,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </PanelSection>

      {/* ── Loop Animation ── */}
      <PanelSection title="Chuyển động liên tục" icon="🔄">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {LOOP_ANIMATIONS.map((a) => {
            const isActive = (el.continuous?.type ?? "none") === a.id;
            return (
              <button
                key={a.id}
                onClick={() => {
                  dispatch({ type: "SNAPSHOT" });
                  updateElement({
                    continuous:
                      a.id === "none" ? null : { type: a.id, duration: 2000 },
                  });
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: isActive ? "2px solid #ff6b9d" : "1px solid #e5e7eb",
                  background: isActive ? "#fdf2f8" : "#fff",
                  cursor: "pointer",
                  fontSize: 11,
                  color: isActive ? "#be185d" : "#374151",
                  textAlign: "left" as const,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </PanelSection>

      {/* ── Border ── */}
      <PanelSection title="Viền" icon="🔲">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <div>
            <label style={labelStyle}>Độ dày</label>
            <input
              type="number"
              value={el.border.width}
              onChange={(e) => {
                dispatch({ type: "SNAPSHOT" });
                updateElement({
                  border: {
                    ...el.border,
                    width: safeNumber(e.target.value, el.border.width),
                  },
                });
              }}
              min={0}
              max={20}
              step={1}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Kiểu</label>
            <select
              value={el.border.style}
              onChange={(e) => {
                dispatch({ type: "SNAPSHOT" });
                updateElement({
                  border: { ...el.border, style: e.target.value },
                });
              }}
              style={selectStyle}
            >
              <option value="solid">Nét liền</option>
              <option value="dashed">Nét đứt</option>
              <option value="dotted">Chấm</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={labelStyle}>Màu viền</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={el.border.color}
              onChange={(e) => {
                dispatch({ type: "SNAPSHOT" });
                updateElement({
                  border: { ...el.border, color: e.target.value },
                });
              }}
              style={{
                width: 32,
                height: 32,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                cursor: "pointer",
                padding: 0,
              }}
            />
            <input
              type="text"
              value={el.border.color}
              onChange={(e) =>
                updateElement({
                  border: { ...el.border, color: e.target.value },
                })
              }
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>
      </PanelSection>

      {/* ── Shadow ── */}
      <PanelSection title="Đổ bóng" icon="🌑">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <div>
            <label style={labelStyle}>X offset</label>
            <input
              type="number"
              value={el.shadow?.offsetX ?? 0}
              onChange={(e) => {
                dispatch({ type: "SNAPSHOT" });
                const s = el.shadow ?? {
                  offsetX: 0,
                  offsetY: 4,
                  blur: 8,
                  spread: 0,
                  color: "rgba(0,0,0,0.15)",
                };
                updateElement({
                  shadow: {
                    ...s,
                    offsetX: safeNumber(e.target.value, s.offsetX),
                  },
                });
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Y offset</label>
            <input
              type="number"
              value={el.shadow?.offsetY ?? 0}
              onChange={(e) => {
                dispatch({ type: "SNAPSHOT" });
                const s = el.shadow ?? {
                  offsetX: 0,
                  offsetY: 4,
                  blur: 8,
                  spread: 0,
                  color: "rgba(0,0,0,0.15)",
                };
                updateElement({
                  shadow: {
                    ...s,
                    offsetY: safeNumber(e.target.value, s.offsetY),
                  },
                });
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Blur</label>
            <input
              type="number"
              value={el.shadow?.blur ?? 0}
              onChange={(e) => {
                dispatch({ type: "SNAPSHOT" });
                const s = el.shadow ?? {
                  offsetX: 0,
                  offsetY: 4,
                  blur: 8,
                  spread: 0,
                  color: "rgba(0,0,0,0.15)",
                };
                updateElement({
                  shadow: { ...s, blur: safeNumber(e.target.value, s.blur) },
                });
              }}
              min={0}
              step={1}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Spread</label>
            <input
              type="number"
              value={el.shadow?.spread ?? 0}
              onChange={(e) => {
                dispatch({ type: "SNAPSHOT" });
                const s = el.shadow ?? {
                  offsetX: 0,
                  offsetY: 4,
                  blur: 8,
                  spread: 0,
                  color: "rgba(0,0,0,0.15)",
                };
                updateElement({
                  shadow: {
                    ...s,
                    spread: safeNumber(e.target.value, s.spread),
                  },
                });
              }}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={labelStyle}>Màu bóng</label>
          <input
            type="text"
            value={el.shadow?.color ?? "rgba(0,0,0,0.15)"}
            onChange={(e) => {
              dispatch({ type: "SNAPSHOT" });
              const s = el.shadow ?? {
                offsetX: 0,
                offsetY: 4,
                blur: 8,
                spread: 0,
                color: "rgba(0,0,0,0.15)",
              };
              updateElement({ shadow: { ...s, color: e.target.value } });
            }}
            style={inputStyle}
            placeholder="rgba(0,0,0,0.15)"
          />
        </div>
        {el.shadow && (
          <button
            onClick={() => {
              dispatch({ type: "SNAPSHOT" });
              updateElement({ shadow: null });
            }}
            style={{
              marginTop: 8,
              padding: "4px 10px",
              fontSize: 11,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              background: "#fff",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            Xóa bóng
          </button>
        )}
      </PanelSection>

      {/* ── Background Color (text only) ── */}
      {isText && textProps && (
        <PanelSection title="Nền văn bản" icon="🎨">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={textProps.backgroundColor || "#ffffff"}
              onChange={(e) => updateProp({ backgroundColor: e.target.value })}
              style={{
                width: 32,
                height: 32,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                cursor: "pointer",
                padding: 0,
              }}
            />
            <input
              type="text"
              value={textProps.backgroundColor || ""}
              onChange={(e) => updateProp({ backgroundColor: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
              placeholder="transparent"
            />
          </div>
          {textProps.backgroundColor && (
            <button
              onClick={() => updateProp({ backgroundColor: "" })}
              style={{
                marginTop: 6,
                padding: "4px 10px",
                fontSize: 11,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                background: "#fff",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              Xóa nền
            </button>
          )}
        </PanelSection>
      )}

      {/* ── Lock ── */}
      <PanelSection title="Khóa" icon="🔒">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontSize: 12,
            color: "#374151",
          }}
        >
          <input
            type="checkbox"
            checked={el.locked}
            onChange={(e) => updateElement({ locked: e.target.checked })}
          />
          Khóa vị trí (không cho kéo)
        </label>
      </PanelSection>
    </div>
  );
}

/** Collapsible panel section */
function PanelSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div
      style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10, marginTop: 10 }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 600,
          color: "#374151",
          padding: 0,
          marginBottom: open ? 8 : 0,
        }}
      >
        <span>{icon}</span>
        <span>{title}</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#9ca3af" }}>
          {open ? "▼" : "▶"}
        </span>
      </button>
      {open && children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: "#6b7280",
  display: "block",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxSizing: "border-box",
  background: "#fff",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxSizing: "border-box",
  background: "#fff",
};
