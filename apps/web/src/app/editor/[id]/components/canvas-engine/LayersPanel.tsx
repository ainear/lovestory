"use client";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Type,
  Image,
  Pentagon,
  Star,
  Zap,
} from "lucide-react";
import { useEditorContext } from "./useEditorState";
import type {
  CanvasElement,
  TextProps,
  WidgetProps,
} from "./types";

const TYPE_ICONS: Record<CanvasElement["type"], React.ComponentType<{ size?: number }>> = {
  text: Type,
  image: Image,
  shape: Pentagon,
  sticker: Star,
  widget: Zap,
};

function getElementLabel(el: CanvasElement): string {
  switch (el.type) {
    case "text": {
      const text = (el.props as TextProps).text || "";
      return text.length > 20 ? text.slice(0, 20) + "..." : text || "Text";
    }
    case "image":
      return "Image";
    case "shape":
      return "Shape";
    case "sticker":
      return "Sticker";
    case "widget": {
      const wt = (el.props as WidgetProps).widgetType || "widget";
      return wt.charAt(0).toUpperCase() + wt.slice(1);
    }
    default:
      return "Element";
  }
}

export function LayersPanel() {
  const { state, dispatch } = useEditorContext();
  const { elements, selectedId } = state;

  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
          Layers
        </span>
        <span
          style={{
            fontSize: 10,
            color: "#9ca3af",
            background: "#f3f4f6",
            padding: "1px 6px",
            borderRadius: 8,
          }}
        >
          {elements.length}
        </span>
      </div>

      {/* Layer rows */}
      {sorted.length === 0 ? (
        <div style={{ padding: 16, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
            Canvas is empty
          </p>
        </div>
      ) : (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
          {sorted.map((el) => {
            const isSelected = el.id === selectedId;
            const IconComponent = TYPE_ICONS[el.type] || Zap;

            return (
              <div
                key={el.id}
                onClick={() => dispatch({ type: "SELECT", id: el.id })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  cursor: "pointer",
                  background: isSelected ? "#eff6ff" : "transparent",
                  borderLeft: isSelected
                    ? "3px solid #3b82f6"
                    : "3px solid transparent",
                  borderBottom: "1px solid #f3f4f6",
                  opacity: el.visible ? 1 : 0.45,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {/* Type icon */}
                <IconComponent size={14} />

                {/* Label */}
                <span
                  style={{
                    flex: 1,
                    fontSize: 11,
                    color: isSelected ? "#1d4ed8" : "#374151",
                    fontWeight: isSelected ? 600 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getElementLabel(el)}
                </span>

                {/* zIndex badge */}
                <span
                  style={{
                    fontSize: 9,
                    color: "#9ca3af",
                    minWidth: 16,
                    textAlign: "center",
                  }}
                >
                  z{el.zIndex}
                </span>

                {/* Reorder buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "SNAPSHOT" });
                    dispatch({ type: "REORDER", id: el.id, direction: "up" });
                  }}
                  style={iconBtnStyle}
                  title="Move up"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "SNAPSHOT" });
                    dispatch({ type: "REORDER", id: el.id, direction: "down" });
                  }}
                  style={iconBtnStyle}
                  title="Move down"
                >
                  <ArrowDown size={12} />
                </button>

                {/* Visibility toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "SNAPSHOT" });
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      id: el.id,
                      patch: { visible: !el.visible },
                    });
                  }}
                  style={iconBtnStyle}
                  title={el.visible ? "Hide" : "Show"}
                >
                  {el.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>

                {/* Lock toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "SNAPSHOT" });
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      id: el.id,
                      patch: { locked: !el.locked },
                    });
                  }}
                  style={{
                    ...iconBtnStyle,
                    color: el.locked ? "#dc2626" : "#9ca3af",
                  }}
                  title={el.locked ? "Unlock" : "Lock"}
                >
                  {el.locked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  border: "none",
  background: "none",
  cursor: "pointer",
  borderRadius: 4,
  color: "#9ca3af",
  padding: 0,
  flexShrink: 0,
};
