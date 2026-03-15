"use client";

import React from "react";
import {
  Undo2,
  Redo2,
  Eye,
  Rocket,
  Save,
  LayoutTemplate,
  Home,
  Share2,
} from "lucide-react";
import { BG_PRESETS, topBtnStyle } from "../editor-constants";

interface EditorTopBarProps {
  projectSlug: string;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: "saved" | "saving" | "unsaved";
  publishStatus: "idle" | "publishing" | "done";
  showTemplateSwap: boolean;
  setShowTemplateSwap: React.Dispatch<React.SetStateAction<boolean>>;
  background: string;
  setBackground: (val: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorDispatch: React.Dispatch<any>;
  save: () => void;
  handlePublish: () => void;
  triggerAutosave: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
}

export function EditorTopBar({
  projectSlug,
  canUndo,
  canRedo,
  saveStatus,
  publishStatus,
  showTemplateSwap,
  setShowTemplateSwap,
  background,
  setBackground,
  editorDispatch,
  save,
  handlePublish,
  triggerAutosave,
  query,
  actions,
}: EditorTopBarProps) {
  return (
    <div
      style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 10,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      <a
        href="/dashboard"
        title="Về trang chủ"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, color: "#ff6b9d" }}>
          💌
        </span>
        <Home size={16} style={{ color: "#9ca3af" }} />
      </a>
      <span
        style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, flex: 1 }}
      >
        Visual Editor
      </span>

      {/* Undo/Redo */}
      <button
        onClick={() => editorDispatch({ type: "UNDO" })}
        disabled={!canUndo}
        title="Hoàn tác (⌘Z)"
        style={topBtnStyle(!canUndo)}
      >
        <Undo2 size={16} />
      </button>
      <button
        onClick={() => editorDispatch({ type: "REDO" })}
        disabled={!canRedo}
        title="Làm lại (⌘⇧Z)"
        style={topBtnStyle(!canRedo)}
      >
        <Redo2 size={16} />
      </button>

      {/* Template Hot-Swap */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowTemplateSwap((p) => !p)}
          title="Đổi giao diện"
          style={{
            ...topBtnStyle(false),
            padding: "6px 10px",
            fontSize: 11,
            gap: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <LayoutTemplate size={14} /> Đổi mẫu
        </button>
        {showTemplateSwap && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              background: "#fff",
              borderRadius: 12,
              padding: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              border: "1px solid #e5e7eb",
              width: 220,
              zIndex: 999,
              marginTop: 4,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#374151",
                margin: "0 0 8px",
                textTransform: "uppercase",
              }}
            >
              Đổi giao diện nhanh
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 6,
              }}
            >
              {BG_PRESETS.map((bg) => (
                <button
                  key={bg.label}
                  onClick={() => {
                    setBackground(bg.value);
                    const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
                    if (rootNodeId) {
                      actions.setProp(
                        rootNodeId,
                        (props: { background: string }) => {
                          props.background = bg.value;
                        },
                      );
                    }
                    triggerAutosave();
                    setShowTemplateSwap(false);
                  }}
                  style={{
                    height: 44,
                    borderRadius: 8,
                    border:
                      background === bg.value
                        ? "2px solid #ff6b9d"
                        : "1px solid #e5e7eb",
                    background: bg.value,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      bottom: 1,
                      left: 0,
                      right: 0,
                      fontSize: 7,
                      fontWeight: 600,
                      textAlign: "center",
                      color:
                        bg.value.includes("0f0825") ||
                        bg.value.includes("111827")
                          ? "#fff"
                          : "#374151",
                    }}
                  >
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color:
            saveStatus === "saved"
              ? "#10b981"
              : saveStatus === "saving"
                ? "#f59e0b"
                : "#ef4444",
        }}
      >
        <Save size={13} />
        {saveStatus === "saved"
          ? "Đã lưu tạm thời"
          : saveStatus === "saving"
            ? "Đang lưu..."
            : "Chưa lưu"}
      </div>

      {/* Manual Save */}
      <button
        onClick={save}
        title="Lưu ngay (⌘S)"
        style={{
          ...topBtnStyle(false),
          padding: "6px 12px",
          fontSize: 12,
        }}
      >
        💾 Lưu
      </button>

      {/* Preview */}
      <a
        href={`/i/${projectSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "#fff",
          color: "#374151",
          fontSize: 13,
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        <Eye size={14} /> Xem trước
      </a>

      {/* Share */}
      <button
        onClick={async () => {
          const url = `${window.location.origin}/i/${projectSlug}`;
          try {
            if (navigator.share)
              await navigator.share({ title: "Thiệp mời cưới", url });
            else {
              await navigator.clipboard.writeText(url);
              alert("✅ Đã sao chép link mời!");
            }
          } catch {
            /* user cancelled */
          }
        }}
        style={{ ...topBtnStyle(false), padding: "6px 12px", fontSize: 12 }}
      >
        <Share2 size={14} /> Chia sẻ
      </button>

      {/* Publish */}
      <button
        onClick={handlePublish}
        disabled={publishStatus === "publishing"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          borderRadius: 10,
          border: "none",
          background:
            publishStatus === "publishing"
              ? "#d1d5db"
              : "linear-gradient(135deg, #ff6b9d, #c084fc)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          cursor: publishStatus === "publishing" ? "not-allowed" : "pointer",
          boxShadow:
            publishStatus === "publishing"
              ? "none"
              : "0 2px 8px rgba(255,107,157,0.35)",
        }}
      >
        <Rocket size={14} />
        {publishStatus === "publishing" ? "Đang xuất bản..." : "Xuất bản"}
      </button>
    </div>
  );
}
