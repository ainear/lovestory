"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEditorContext } from "./useEditorState";
import { SelectionOverlay } from "./SelectionOverlay";
import { ElementToolbar } from "./ElementToolbar";
import type {
  CanvasElement,
  TextProps,
  ImageProps,
  ShapeProps,
  WidgetProps,
} from "./types";
import { useDrag } from "./useDrag";
import { SnapGuideLines } from "./SnapGuideLines";
import {
  ENTRANCE_KEYFRAMES,
  getEntranceAnimation,
  getContinuousAnimation,
} from "./animations";

/** Sanitize paste to plain text only — prevents XSS via pasted HTML */
function handlePastePlainText(e: React.ClipboardEvent) {
  e.preventDefault();
  const text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
}

/** Render a single text element */
function TextElement({
  el,
  isEditing,
  onStartEdit,
}: {
  el: CanvasElement;
  isEditing: boolean;
  onStartEdit: () => void;
}) {
  const p = el.props as TextProps;
  const { dispatch } = useEditorContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      // Place cursor at end of text
      const sel = window.getSelection();
      if (sel && ref.current.childNodes.length > 0) {
        sel.selectAllChildren(ref.current);
        sel.collapseToEnd();
      }
    }
  }, [isEditing]);

  const handleBlur = useCallback(() => {
    if (!ref.current) return;
    const newText = ref.current.innerText;
    dispatch({ type: "SNAPSHOT" });
    dispatch({ type: "UPDATE_PROPS", id: el.id, props: { text: newText } });
  }, [dispatch, el.id]);

  return (
    <div
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={isEditing ? handleBlur : undefined}
      onPaste={isEditing ? handlePastePlainText : undefined}
      onDoubleClick={onStartEdit}
      style={{
        width: "100%",
        height: "100%",
        fontFamily: p.fontFamily,
        fontSize: p.fontSize,
        fontWeight: p.fontWeight,
        fontStyle: p.fontStyle,
        color: p.color,
        backgroundColor: p.backgroundColor || "transparent",
        textAlign: p.textAlign,
        lineHeight: p.lineHeight,
        letterSpacing: p.letterSpacing,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        userSelect: isEditing ? "text" : "none",
        outline: "none",
        cursor: isEditing ? "text" : "inherit",
      }}
    >
      {p.text}
    </div>
  );
}

/** Render a single shape element */
function ShapeElement({ el }: { el: CanvasElement }) {
  const p = el.props as ShapeProps;
  const common = {
    fill: p.fill,
    stroke: p.stroke,
    strokeWidth: p.strokeWidth,
  };

  const svgContent = (() => {
    switch (p.shapeType) {
      case "circle":
        return <ellipse cx="50" cy="50" rx="49" ry="49" {...common} />;
      case "line":
        return <line x1="0" y1="50" x2="100" y2="50" {...common} />;
      case "star":
        return (
          <polygon
            points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
            {...common}
          />
        );
      case "heart":
        return (
          <path
            d="M50,88 C25,65 5,50 5,30 A20,20,0,0,1,50,30 A20,20,0,0,1,95,30 C95,50 75,65 50,88Z"
            {...common}
          />
        );
      case "rectangle":
      default:
        return <rect x="1" y="1" width="98" height="98" rx="4" {...common} />;
    }
  })();

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {svgContent}
    </svg>
  );
}

/** Validate image URL — allow https, data URIs, blob, and relative paths */
function isValidImageSrc(src: string): boolean {
  if (!src || typeof src !== "string") return false;
  return (
    src.startsWith("https://") ||
    src.startsWith("http://") ||
    src.startsWith("/") ||
    src.startsWith("blob:") ||
    src.startsWith("data:image/")
  );
}

/** Render a single image element */
function ImageElement({ el }: { el: CanvasElement }) {
  const p = el.props as ImageProps;
  if (!isValidImageSrc(p.src)) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          color: "#9ca3af",
          fontSize: 12,
          borderRadius: "inherit",
        }}
      >
        Invalid image
      </div>
    );
  }
  return (
    <img
      src={p.src}
      alt=""
      draggable={false}
      style={{
        width: "100%",
        height: "100%",
        objectFit: p.objectFit,
        borderRadius: "inherit",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  );
}

/** Render a widget element */
function WidgetElement({ el }: { el: CanvasElement }) {
  const p = el.props as WidgetProps;
  return <WidgetRendererInline widgetType={p.widgetType} config={p.config} />;
}

/** Inline widget renderer — simple placeholder for all widget types in editor */
function WidgetRendererInline({
  widgetType,
  config,
}: {
  widgetType: string;
  config: Record<string, unknown>;
}) {
  const c = config;
  switch (widgetType) {
    case "countdown": {
      const targetDate = String(c.targetDate || "2026-06-01");
      const label = String(c.label || "");
      const color = String(c.color || "#1f2937");
      const bg = String(c.background || "rgba(255,255,255,0.8)");
      const radius = Number(c.borderRadius ?? 12);
      const fs = Number(c.fontSize ?? 28);
      return (
        <div
          style={{
            padding: 16,
            background: bg,
            borderRadius: radius,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {["Ngay", "Gio", "Phut", "Giay"].map((u) => (
              <div key={u} style={{ textAlign: "center" }}>
                <div style={{ fontSize: fs, fontWeight: 700, color }}>00</div>
                <div
                  style={{
                    fontSize: 10,
                    color: String(c.labelColor || "#6b7280"),
                  }}
                >
                  {u}
                </div>
              </div>
            ))}
          </div>
          {label && (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: String(c.labelColor || "#6b7280"),
              }}
            >
              {label}
            </div>
          )}
          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
            {targetDate}
          </div>
        </div>
      );
    }
    case "calendar": {
      const accent = String(c.accentColor || "#dc2626");
      const textColor = String(c.textColor || "#1f2937");
      const bg = String(c.background || "rgba(255,255,255,0.9)");
      return (
        <div
          style={{
            padding: 12,
            background: bg,
            borderRadius: Number(c.borderRadius ?? 12),
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: textColor,
              marginBottom: 8,
            }}
          >
            Thang 6, 2026
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: 2,
              fontSize: 10,
            }}
          >
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <div
                key={d}
                style={{ fontWeight: 600, color: "#9ca3af", padding: 2 }}
              >
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <div
                key={d}
                style={{
                  padding: 2,
                  borderRadius: "50%",
                  background: d === 28 ? accent : "transparent",
                  color: d === 28 ? "#fff" : textColor,
                  fontWeight: d === 28 ? 700 : 400,
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "map":
      return (
        <div
          style={{
            padding: 16,
            background: "#e5e7eb",
            borderRadius: Number(c.borderRadius ?? 12),
            textAlign: "center",
            minHeight: Number(c.height ?? 200),
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
            {String(c.venueName || "Dia diem")}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
            {String(c.address || "")}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "8px 16px",
              background: String(c.accentColor || "#dc2626"),
              color: "#fff",
              borderRadius: 8,
              display: "inline-block",
              fontSize: 12,
            }}
          >
            Chi duong
          </div>
        </div>
      );
    case "rsvp":
      return (
        <div
          style={{
            padding: 16,
            background: String(c.background || "rgba(255,255,255,0.9)"),
            borderRadius: Number(c.borderRadius ?? 12),
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: String(c.textColor || "#1f2937"),
              textAlign: "center",
            }}
          >
            {String(c.title || "Xac nhan tham du")}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#6b7280",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            {String(c.subtitle || "")}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                padding: "6px 10px",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              Ho ten
            </div>
            <div
              style={{
                padding: "8px 16px",
                background: String(c.accentColor || "#dc2626"),
                color: "#fff",
                borderRadius: 8,
                textAlign: "center",
                fontSize: 13,
              }}
            >
              Gui
            </div>
          </div>
        </div>
      );
    case "qrbox":
      return (
        <div
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: Number(c.borderRadius ?? 12),
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: String(c.accentColor || "#1f2937"),
            }}
          >
            {String(c.bankName || "Ngan hang")}
          </div>
          <div
            style={{
              width: 120,
              height: 120,
              margin: "12px auto",
              background: "#f3f4f6",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#9ca3af",
            }}
          >
            QR Code
          </div>
          <div
            style={{ fontSize: 11, color: String(c.textColor || "#6b7280") }}
          >
            {String(c.accountName || "")}
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>
            {String(c.accountNumber || "")}
          </div>
        </div>
      );
    case "album": {
      const photos = (Array.isArray(c.photos) ? c.photos : []) as string[];
      const cols = Number(c.columns ?? 2);
      const gap = Number(c.gap ?? 4);
      return (
        <div>
          {String(c.title || "") && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                textAlign: "center",
                marginBottom: 8,
                color: String(c.accentColor || "#1f2937"),
              }}
            >
              {String(c.title)}
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols},1fr)`,
              gap,
            }}
          >
            {(photos.length > 0
              ? photos
              : [
                  "/placeholder.jpg",
                  "/placeholder.jpg",
                  "/placeholder.jpg",
                  "/placeholder.jpg",
                ]
            ).map((src, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  background: "#e5e7eb",
                  borderRadius: Number(c.borderRadius ?? 8),
                  overflow: "hidden",
                }}
              >
                <img
                  src={String(src)}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "envelope":
      return (
        <div
          style={{
            padding: 24,
            background: String(c.envelopeColor || "#fef3cd"),
            borderRadius: 12,
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: String(c.sealColor || "#dc2626"),
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 18 }}>&#9829;</span>
          </div>
          <div
            style={{
              fontFamily: String(c.fontFamily || "'Dancing Script', cursive"),
              fontSize: 16,
              color: String(c.textColor || "#8b4513"),
            }}
          >
            {String(c.groomName || "Chu Re")} &{" "}
            {String(c.brideName || "Co Dau")}
          </div>
          <div style={{ fontSize: 10, color: "#a0855b", marginTop: 8 }}>
            {String(c.label || "Mo thu moi")}
          </div>
        </div>
      );
    case "youtube": {
      const url = String(c.videoUrl || "");
      return (
        <div
          style={{
            background: "#000",
            borderRadius: Number(c.borderRadius ?? 8),
            aspectRatio: String(c.aspectRatio || "16/9").replace(":", "/"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "16px solid #fff",
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  marginLeft: 4,
                }}
              />
            </div>
            {url && (
              <div
                style={{
                  fontSize: 9,
                  color: "#aaa",
                  marginTop: 8,
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {url}
              </div>
            )}
          </div>
        </div>
      );
    }
    case "callbutton":
      return (
        <div
          style={{
            padding: "10px 20px",
            background: String(c.accentColor || "#dc2626"),
            color: String(c.textColor || "#fff"),
            borderRadius: Number(c.borderRadius ?? 8),
            textAlign: "center",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {String(c.label || "Goi dien")}
        </div>
      );
    case "guestname":
      return (
        <div
          style={{
            textAlign: String(c.textAlign || "center") as "center",
            fontFamily: String(c.fontFamily || "'Dancing Script', cursive"),
          }}
        >
          <div style={{ fontSize: 12, color: String(c.color || "#6b7280") }}>
            {String(c.prefix || "Tran trong kinh moi")}
          </div>
          <div
            style={{
              fontSize: Number(c.fontSize ?? 24),
              color: String(c.accentColor || "#dc2626"),
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {String(c.defaultName || "Quy Khach")}
          </div>
        </div>
      );
    case "formbuilder": {
      const fields = (Array.isArray(c.fields) ? c.fields : []) as Array<{
        label: string;
        type: string;
      }>;
      return (
        <div
          style={{
            padding: 16,
            background: String(c.background || "rgba(255,255,255,0.9)"),
            borderRadius: Number(c.borderRadius ?? 12),
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: String(c.textColor || "#1f2937"),
              textAlign: "center",
            }}
          >
            {String(c.title || "Form")}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 12,
            }}
          >
            {fields.slice(0, 3).map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  fontSize: 11,
                  color: "#9ca3af",
                }}
              >
                {f.label}
              </div>
            ))}
            <div
              style={{
                padding: "8px 16px",
                background: String(c.accentColor || "#dc2626"),
                color: "#fff",
                borderRadius: 8,
                textAlign: "center",
                fontSize: 13,
              }}
            >
              {String(c.buttonText || "Gui")}
            </div>
          </div>
        </div>
      );
    }
    case "music":
      return (
        <div
          style={{
            background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
            borderRadius: Number(c.borderRadius ?? 12),
            padding: 12,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Vinyl disc preview */}
          <svg width={60} height={60} viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="35" fill="#111" stroke="#333" strokeWidth="1"/>
            {[30, 26, 22, 18, 14].map(r => (
              <circle key={r} cx="36" cy="36" r={r} fill="none" stroke="#2a2a2a" strokeWidth="1"/>
            ))}
            <circle cx="36" cy="36" r="12" fill="#fce7f3"/>
            <circle cx="36" cy="36" r="3" fill="#831843"/>
          </svg>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#f9fafb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
            {String(c.musicTitle || "Bài hát tặng em")}
          </div>
          <div style={{ fontSize: 8, color: "#9ca3af" }}>
            {String(c.musicArtist || "Nhạc sĩ yêu thương")}
          </div>
        </div>
      );
    default:
      return (
        <div
          style={{
            padding: 12,
            background: "#f3f4f6",
            borderRadius: 8,
            fontSize: 11,
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Widget: {widgetType}
        </div>
      );
  }
}

/** Render a single canvas element wrapper (absolute positioned) */
const CanvasElementWrapper = React.memo(function CanvasElementWrapper({
  el,
  isSelected,
}: {
  el: CanvasElement;
  isSelected: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEdit = useCallback(() => {
    if (el.locked || el.type !== "text") return;
    setIsEditing(true);
  }, [el.locked, el.type]);

  // Exit editing when element is deselected
  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
    }
  }, [isSelected]);

  const {
    onPointerDown: dragDown,
    onPointerMove,
    onPointerUp,
  } = useDrag(el.id);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isEditing) return; // Don't drag while editing text
      dragDown(e);
    },
    [isEditing, dragDown],
  );

  const shadow = el.shadow
    ? `${el.shadow.offsetX}px ${el.shadow.offsetY}px ${el.shadow.blur}px ${el.shadow.spread}px ${el.shadow.color}`
    : "none";

  return (
    <div
      data-element-id={el.id}
      onPointerDown={handlePointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        top: el.top,
        left: el.left,
        width: el.width,
        height: el.height === "auto" ? "auto" : el.height,
        zIndex: el.zIndex,
        opacity: el.opacity,
        borderRadius: el.borderRadius,
        border:
          el.border.width > 0
            ? `${el.border.width}px ${el.border.style} ${el.border.color}`
            : "none",
        boxShadow: shadow,
        transform: `rotate(${el.rotation}deg) scale(${el.scaleX}, ${el.scaleY})`,
        animation:
          getEntranceAnimation(el.entrance) ||
          getContinuousAnimation(el.continuous) ||
          undefined,
        cursor: isEditing ? "text" : el.locked ? "default" : "move",
        outline: isSelected ? "2px dashed #3b82f6" : "none",
        outlineOffset: 2,
        boxSizing: "border-box",
        display: el.visible ? "block" : "none",
      }}
    >
      {el.type === "text" && (
        <TextElement
          el={el}
          isEditing={isEditing}
          onStartEdit={handleStartEdit}
        />
      )}
      {(el.type === "image" || el.type === "sticker") && (
        <ImageElement el={el} />
      )}
      {el.type === "shape" && <ShapeElement el={el} />}
      {el.type === "widget" && <WidgetElement el={el} />}
    </div>
  );
});

/** Main canvas renderer */
export function CanvasRenderer() {
  const { state, dispatch } = useEditorContext();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = useCallback(
    (e: React.PointerEvent) => {
      if (e.target === canvasRef.current) {
        dispatch({ type: "SELECT", id: null });
      }
    },
    [dispatch],
  );

  const sortedElements = useMemo(
    () => [...state.elements].sort((a, b) => a.zIndex - b.zIndex),
    [state.elements],
  );

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        paddingTop: 56,
        paddingBottom: 200,
        background: "#e5e7eb",
      }}
    >
      <div
        ref={canvasRef}
        onPointerDown={handleCanvasClick}
        style={{
          position: "relative",
          width: state.canvasWidth,
          minHeight: state.canvasHeight,
          background: state.canvasBackground,
          transform: `scale(${state.zoom})`,
          transformOrigin: "top center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: ENTRANCE_KEYFRAMES }} />
        {sortedElements.map((el) => (
          <CanvasElementWrapper
            key={el.id}
            el={el}
            isSelected={state.selectedId === el.id}
          />
        ))}
        <SnapGuideLines guides={state.activeGuides} />
        <SelectionOverlay />
        <ElementToolbar />
      </div>
    </div>
  );
}
