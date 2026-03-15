"use client";

import React, { useCallback, useState } from "react";
import { useNode, useEditor, UserComponent } from "@craftjs/core";

/* ── Craft.js Text Component ──
 * CineLove-parity: B/I/S/U, alignment, font picker, color, opacity,
 * letter-spacing, text-shadow, text-decoration, background color,
 * rotation, textTransform, border styles
 * + Floating toolbar (Nhân bản / Xóa) on selection
 * + Double-click to edit inline
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

interface CraftTextProps {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  color: string;
  textAlign: "left" | "center" | "right" | "justify";
  lineHeight: number;
  letterSpacing: number;
  opacity: number;
  textDecoration?: string;
  textShadow?: string;
  backgroundColor?: string;
  rotation?: number;
  textTransform?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}

export const CraftText: UserComponent<CraftTextProps> = ({
  text,
  fontSize,
  fontFamily,
  fontWeight,
  fontStyle,
  color,
  textAlign,
  lineHeight,
  letterSpacing,
  opacity,
  textDecoration,
  textShadow,
  backgroundColor,
  rotation,
  textTransform,
  borderWidth,
  borderColor,
  borderRadius,
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
  const [editing, setEditing] = useState(false);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const newText = (e.target as HTMLElement).innerText;
      setProp((props: CraftTextProps) => {
        props.text = newText;
      });
    },
    [setProp],
  );

  const handleDoubleClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setEditing(false);
  }, []);

  // Deactivate editing when deselected
  React.useEffect(() => {
    if (!selected) setEditing(false);
  }, [selected]);

  const handleDuplicate = useCallback(() => {
    try {
      const node = query.node(id).get();
      const parentId = node.data.parent;
      if (!parentId) return;
      const freshNode = query.createNode(
        React.createElement(CraftText, {
          ...node.data.props,
        } as CraftTextProps),
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
        padding: "4px 8px",
        cursor: selected ? "move" : "pointer",
        outline: selected ? "2px dashed #3b82f6" : "none",
        outlineOffset: 3,
        minHeight: 24,
        position: "relative",
        transition: "outline 0.15s",
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* ── CineLove-style Floating Toolbar + Resize Handles ── */}
      {selected && (
        <>
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
              padding: "4px 6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              zIndex: 100,
              whiteSpace: "nowrap",
            }}
          >
            <button onClick={handleDuplicate} style={floatBtn} title="Nhân bản">
              📋
            </button>
            <button onClick={handleDelete} style={floatBtn} title="Xóa">
              🗑️
            </button>
          </div>

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
        </>
      )}

      <div
        contentEditable={editing}
        suppressContentEditableWarning
        onInput={handleInput}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        style={{
          fontSize,
          fontFamily,
          fontWeight,
          fontStyle,
          color,
          textAlign,
          lineHeight,
          letterSpacing,
          opacity,
          textDecoration,
          textShadow: textShadow || "none",
          backgroundColor: backgroundColor || "transparent",
          textTransform:
            (textTransform as React.CSSProperties["textTransform"]) || "none",
          outline: "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          borderRadius: borderRadius || (backgroundColor ? 4 : 0),
          borderWidth: borderWidth || 0,
          borderColor: borderColor || "transparent",
          borderStyle: borderWidth ? "solid" : "none",
          padding: backgroundColor ? "2px 6px" : 0,
          cursor: editing ? "text" : undefined,
        }}
      >
        {text}
      </div>
    </div>
  );
};

CraftText.craft = {
  displayName: "CraftText",
  props: {
    text: "Nhập nội dung",
    fontSize: 16,
    fontFamily: "'Inter', sans-serif",
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#1f2937",
    textAlign: "center" as const,
    lineHeight: 1.5,
    letterSpacing: 0,
    opacity: 1,
    textDecoration: "none",
    textShadow: "",
    backgroundColor: "",
    rotation: 0,
    textTransform: "none",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
  },
  related: {
    settings: CraftTextSettings,
  },
};

/* ── Settings panel — CineLove parity ── */
function CraftTextSettings() {
  const {
    actions: { setProp },
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    color,
    textAlign,
    opacity,
    letterSpacing,
    textDecoration,
    textShadow,
    backgroundColor,
    rotation,
    textTransform,
    borderWidth,
    borderColor,
    borderRadius,
  } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    fontFamily: node.data.props.fontFamily,
    fontWeight: node.data.props.fontWeight,
    fontStyle: node.data.props.fontStyle,
    color: node.data.props.color,
    textAlign: node.data.props.textAlign,
    opacity: node.data.props.opacity,
    letterSpacing: node.data.props.letterSpacing,
    textDecoration: node.data.props.textDecoration,
    textShadow: node.data.props.textShadow,
    backgroundColor: node.data.props.backgroundColor,
    rotation: node.data.props.rotation,
    textTransform: node.data.props.textTransform,
    borderWidth: node.data.props.borderWidth,
    borderColor: node.data.props.borderColor,
    borderRadius: node.data.props.borderRadius,
  }));

  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  const FONTS = [
    "'Inter', sans-serif",
    "'Dancing Script', cursive",
    "'Great Vibes', cursive",
    "'Playfair Display', serif",
    "'Cormorant Garamond', serif",
    "'Lora', serif",
    "'Pacifico', cursive",
    "'Be Vietnam Pro', sans-serif",
    "'Montserrat', sans-serif",
    "'Georgia', serif",
    "'Roboto', sans-serif",
    "'Merriweather', serif",
    // CineLove-style wedding fonts
    "'Sacramento', cursive",
    "'Alex Brush', cursive",
    "'Satisfy', cursive",
    "'Allura', cursive",
    "'Pinyon Script', cursive",
    "'Cinzel Decorative', serif",
  ];

  const FONT_SIZE_PRESETS = [
    8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 120,
  ];

  const TEXT_TRANSFORM_CYCLE: string[] = [
    "none",
    "uppercase",
    "lowercase",
    "capitalize",
  ];

  const isItalic = fontStyle === "italic";
  const isBold = fontWeight === "bold" || Number(fontWeight) >= 700;
  const isUnderline = textDecoration?.includes("underline");
  const isStrike = textDecoration?.includes("line-through");

  const currentTransformIndex = TEXT_TRANSFORM_CYCLE.indexOf(
    textTransform || "none",
  );
  const textTransformLabel = (() => {
    switch (textTransform) {
      case "uppercase":
        return "AA";
      case "lowercase":
        return "aa";
      case "capitalize":
        return "Aa";
      default:
        return "Aa";
    }
  })();

  const toggleDeco = (deco: string) => {
    setProp((p: CraftTextProps) => {
      const current = p.textDecoration || "none";
      if (current.includes(deco)) {
        const next = current.replace(deco, "").trim() || "none";
        p.textDecoration = next;
      } else {
        p.textDecoration = current === "none" ? deco : `${current} ${deco}`;
      }
    });
  };

  const cycleTextTransform = () => {
    const nextIndex = (currentTransformIndex + 1) % TEXT_TRANSFORM_CYCLE.length;
    setProp((p: CraftTextProps) => {
      p.textTransform = TEXT_TRANSFORM_CYCLE[nextIndex];
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "8px 0",
      }}
    >
      {/* ── Kiểu chữ (Typography) ── */}
      <div style={sectionStyle}>
        <p style={sectionLabel}>Kiểu chữ</p>

        {/* B / I / S / U / Aa buttons — CineLove parity */}
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          <button
            onClick={() =>
              setProp((p: CraftTextProps) => {
                p.fontWeight = isBold ? "normal" : "bold";
              })
            }
            style={{ ...toggleBtn, ...(isBold ? toggleBtnActive : {}) }}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() =>
              setProp((p: CraftTextProps) => {
                p.fontStyle = isItalic ? "normal" : "italic";
              })
            }
            style={{ ...toggleBtn, ...(isItalic ? toggleBtnActive : {}) }}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => toggleDeco("line-through")}
            style={{ ...toggleBtn, ...(isStrike ? toggleBtnActive : {}) }}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
          <button
            onClick={() => toggleDeco("underline")}
            style={{ ...toggleBtn, ...(isUnderline ? toggleBtnActive : {}) }}
            title="Underline"
          >
            <u>U</u>
          </button>
          <button
            onClick={cycleTextTransform}
            style={{
              ...toggleBtn,
              ...(textTransform && textTransform !== "none"
                ? toggleBtnActive
                : {}),
            }}
            title={`Text transform: ${textTransform || "none"}`}
          >
            {textTransformLabel}
          </button>
        </div>

        {/* Alignment — 4 modes like CineLove */}
        <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
          {(["left", "center", "right", "justify"] as const).map((a) => (
            <button
              key={a}
              onClick={() =>
                setProp((p: CraftTextProps) => {
                  p.textAlign = a;
                })
              }
              style={{
                ...toggleBtn,
                flex: 1,
                background: textAlign === a ? "#3b82f6" : "#f3f4f6",
                color: textAlign === a ? "#fff" : "#6b7280",
              }}
            >
              {a === "left"
                ? "⫷"
                : a === "center"
                  ? "≡"
                  : a === "right"
                    ? "⫸"
                    : "☰"}
            </button>
          ))}
        </div>

        {/* Font Size — with +/- buttons + dropdown like CineLove */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#6b7280",
              fontWeight: 600,
              minWidth: 50,
            }}
          >
            Font size
          </span>
          <button
            onClick={() =>
              setProp((p: CraftTextProps) => {
                p.fontSize = Math.max(8, p.fontSize - 1);
              })
            }
            style={smBtn}
          >
            −
          </button>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
              style={{
                width: 48,
                padding: "4px 6px",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 12,
                textAlign: "center" as const,
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {fontSize}
            </button>
            {showFontSizeDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 200,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  maxHeight: 200,
                  overflowY: "auto",
                  width: 80,
                  marginTop: 4,
                }}
              >
                {FONT_SIZE_PRESETS.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setProp((p: CraftTextProps) => {
                        p.fontSize = size;
                      });
                      setShowFontSizeDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 12px",
                      border: "none",
                      background: fontSize === size ? "#eff6ff" : "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                      textAlign: "left" as const,
                      fontWeight: fontSize === size ? 700 : 400,
                      color: fontSize === size ? "#3b82f6" : "#374151",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() =>
              setProp((p: CraftTextProps) => {
                p.fontSize = Math.min(120, p.fontSize + 1);
              })
            }
            style={smBtn}
          >
            +
          </button>
        </div>

        {/* Font Family — custom styled dropdown */}
        <div style={{ marginBottom: 8, position: "relative" }}>
          <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
            Font
          </span>
          {/* Trigger button — shows current font in its own typeface */}
          <button
            onClick={() => setShowFontDropdown(!showFontDropdown)}
            style={{
              ...selectStyle,
              width: "100%",
              marginTop: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: fontFamily,
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            <span style={{ fontFamily: fontFamily }}>
              {fontFamily.split("'")[1] || fontFamily}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#9ca3af",
                fontFamily: "sans-serif",
              }}
            >
              ▾
            </span>
          </button>
          {/* Dropdown panel */}
          {showFontDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 2px)",
                left: 0,
                right: 0,
                zIndex: 300,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                maxHeight: 220,
                overflowY: "auto",
              }}
            >
              {FONTS.map((f) => {
                const label = f.split("'")[1] || f;
                const isSelected = fontFamily === f;
                return (
                  <button
                    key={f}
                    onClick={() => {
                      setProp((p: CraftTextProps) => {
                        p.fontFamily = f;
                      });
                      setShowFontDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "none",
                      background: isSelected ? "#eff6ff" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: f,
                      fontSize: 14,
                      fontWeight: isSelected ? 700 : 400,
                      color: isSelected ? "#3b82f6" : "#374151",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Colors: text + background */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            Màu chữ
            <input
              type="color"
              value={color}
              onChange={(e) =>
                setProp((p: CraftTextProps) => {
                  p.color = e.target.value;
                })
              }
              style={{
                width: 28,
                height: 28,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                cursor: "pointer",
              }}
            />
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            Màu nền
            <input
              type="color"
              value={backgroundColor || "#ffffff"}
              onChange={(e) =>
                setProp((p: CraftTextProps) => {
                  p.backgroundColor = e.target.value;
                })
              }
              style={{
                width: 28,
                height: 28,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                cursor: "pointer",
              }}
            />
          </label>
        </div>

        {/* Opacity */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#6b7280",
              fontWeight: 600,
              minWidth: 55,
            }}
          >
            Trong suốt
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(opacity * 100)}
            onChange={(e) =>
              setProp((p: CraftTextProps) => {
                p.opacity = Number(e.target.value) / 100;
              })
            }
            style={{ flex: 1, accentColor: "#3b82f6" }}
          />
          <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 30 }}>
            {(opacity ?? 1).toFixed(2)}
          </span>
        </div>
      </div>

      {/* ── Xoay (Rotation) ── */}
      <CollapsibleSection title="Xoay">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#6b7280", minWidth: 55 }}>
            Góc xoay
          </span>
          <input
            type="range"
            min={0}
            max={360}
            value={rotation ?? 0}
            onChange={(e) =>
              setProp((p: CraftTextProps) => {
                p.rotation = Number(e.target.value);
              })
            }
            style={{ flex: 1, accentColor: "#3b82f6" }}
          />
          <input
            type="number"
            min={0}
            max={360}
            value={rotation ?? 0}
            onChange={(e) =>
              setProp((p: CraftTextProps) => {
                p.rotation = Number(e.target.value);
              })
            }
            style={{
              width: 48,
              padding: "4px 6px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontSize: 12,
              textAlign: "center",
            }}
          />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>°</span>
        </div>
      </CollapsibleSection>

      {/* ── Đường viền (Border) ── */}
      <CollapsibleSection title="Đường viền">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 11, color: "#6b7280", minWidth: 75 }}>
            Độ rộng viền
          </span>
          <input
            type="range"
            min={0}
            max={10}
            value={borderWidth ?? 0}
            onChange={(e) =>
              setProp((p: CraftTextProps) => {
                p.borderWidth = Number(e.target.value);
              })
            }
            style={{ flex: 1, accentColor: "#3b82f6" }}
          />
          <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 30 }}>
            {borderWidth ?? 0}px
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 11, color: "#6b7280", minWidth: 75 }}>
            Màu viền
          </span>
          <input
            type="color"
            value={
              borderColor === "transparent"
                ? "#000000"
                : borderColor || "#000000"
            }
            onChange={(e) =>
              setProp((p: CraftTextProps) => {
                p.borderColor = e.target.value;
              })
            }
            style={{
              width: 28,
              height: 28,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "pointer",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#6b7280", minWidth: 75 }}>
            Bo góc
          </span>
          <input
            type="range"
            min={0}
            max={50}
            value={borderRadius ?? 0}
            onChange={(e) =>
              setProp((p: CraftTextProps) => {
                p.borderRadius = Number(e.target.value);
              })
            }
            style={{ flex: 1, accentColor: "#3b82f6" }}
          />
          <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 30 }}>
            {borderRadius ?? 0}px
          </span>
        </div>
      </CollapsibleSection>

      {/* ── Khoảng đệm (Spacing) ── */}
      <CollapsibleSection title="Khoảng đệm">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#6b7280", minWidth: 75 }}>
            Letter spacing
          </span>
          <input
            type="range"
            min={-5}
            max={20}
            step={0.5}
            value={letterSpacing ?? 0}
            onChange={(e) =>
              setProp((p: CraftTextProps) => {
                p.letterSpacing = Number(e.target.value);
              })
            }
            style={{ flex: 1, accentColor: "#3b82f6" }}
          />
          <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 30 }}>
            {letterSpacing ?? 0}px
          </span>
        </div>
      </CollapsibleSection>

      {/* ── Đổ bóng (Shadow) ── */}
      <CollapsibleSection title="Đổ bóng">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {SHADOW_PRESETS.map((s) => (
            <button
              key={s.label}
              onClick={() =>
                setProp((p: CraftTextProps) => {
                  p.textShadow = s.value;
                })
              }
              style={{
                ...toggleBtn,
                flex: "1 1 45%",
                background: textShadow === s.value ? "#3b82f6" : "#f9fafb",
                color: textShadow === s.value ? "#fff" : "#374151",
                fontSize: 10,
                padding: "6px 8px",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}

/* ── Collapsible Section ── */
function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 0",
          fontSize: 12,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        <span>
          {open ? "▾" : "▸"} {title}
        </span>
      </button>
      {open && <div style={{ padding: "8px 0 4px" }}>{children}</div>}
    </div>
  );
}

const SHADOW_PRESETS = [
  { label: "Không", value: "" },
  { label: "Nhẹ", value: "1px 1px 2px rgba(0,0,0,0.15)" },
  { label: "Trung bình", value: "2px 2px 4px rgba(0,0,0,0.25)" },
  { label: "Đậm", value: "3px 3px 6px rgba(0,0,0,0.4)" },
  { label: "Sáng", value: "0 0 8px rgba(255,255,255,0.8)" },
  {
    label: "Neon",
    value: "0 0 10px rgba(59,130,246,0.6), 0 0 20px rgba(59,130,246,0.3)",
  },
];

const sectionStyle: React.CSSProperties = {
  background: "#fafafa",
  borderRadius: 8,
  padding: 12,
  border: "1px solid #f0f0f0",
};
const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#374151",
  margin: "0 0 8px",
  textTransform: "uppercase",
  letterSpacing: 0.8,
};
const selectStyle: React.CSSProperties = {
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  background: "#fff",
};
const toggleBtn: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  background: "#f9fafb",
  color: "#374151",
  transition: "all 0.15s",
};
const toggleBtnActive: React.CSSProperties = {
  background: "#3b82f6",
  color: "#fff",
  borderColor: "#3b82f6",
};
const smBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const floatBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  padding: "4px 8px",
  borderRadius: 4,
  color: "#fff",
  transition: "background 0.15s",
};
