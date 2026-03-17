"use client";

/**
 * Sprint 10 — HistoryPanel
 * Shows undo/redo history in the editor sidebar.
 * Uses undoStack (past states) + redoStack (future states) from EditorContext.
 * Provides one-click undo/redo buttons per step.
 */

import { useState } from "react";
import { useEditorContext } from "./useEditorState";

export function HistoryPanel() {
  const { state, dispatch } = useEditorContext();
  const [expanded, setExpanded] = useState(true);

  const undoCount = state.undoStack?.length ?? 0;
  const redoCount = state.redoStack?.length ?? 0;

  return (
    <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10, marginTop: 10 }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          width: "100%", background: "none", border: "none",
          cursor: "pointer", padding: "2px 0 6px",
          fontSize: 11, fontWeight: 700, color: "#374151",
        }}
      >
        <span>🕐</span>
        <span>Lịch sử thao tác</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#9ca3af" }}>
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div>
          {/* Undo / Redo quick action row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={undoCount === 0}
              style={{
                padding: "7px 0", borderRadius: 8, border: "1px solid #e5e7eb",
                background: undoCount > 0 ? "#f9fafb" : "#f3f4f6",
                color: undoCount > 0 ? "#374151" : "#9ca3af",
                fontSize: 12, fontWeight: 600, cursor: undoCount > 0 ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}
              title="Hoàn tác (Ctrl+Z)"
            >
              ↩ Hoàn tác
            </button>
            <button
              onClick={() => dispatch({ type: "REDO" })}
              disabled={redoCount === 0}
              style={{
                padding: "7px 0", borderRadius: 8, border: "1px solid #e5e7eb",
                background: redoCount > 0 ? "#f9fafb" : "#f3f4f6",
                color: redoCount > 0 ? "#374151" : "#9ca3af",
                fontSize: 12, fontWeight: 600, cursor: redoCount > 0 ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}
              title="Làm lại (Ctrl+Y)"
            >
              ↪ Làm lại
            </button>
          </div>

          {/* History stack visualization */}
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {undoCount === 0 && redoCount === 0 ? (
              <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", padding: "12px 0", margin: 0 }}>
                Chưa có thao tác nào
              </p>
            ) : (
              <>
                {/* Future stack (redo items) — shown in gray above */}
                {redoCount > 0 && (
                  <div style={{ marginBottom: 4 }}>
                    {Array.from({ length: Math.min(redoCount, 3) }).map((_, i) => (
                      <div
                        key={`redo-${i}`}
                        onClick={() => dispatch({ type: "REDO" })}
                        style={{
                          padding: "6px 10px", borderRadius: 6, marginBottom: 3,
                          background: "#f9fafb", border: "1px solid #e5e7eb",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                          opacity: 0.55,
                        }}
                      >
                        <span style={{ fontSize: 10 }}>↪</span>
                        <span style={{ fontSize: 11, color: "#6b7280" }}>
                          Thao tác #{undoCount + redoCount - i}
                        </span>
                        <span style={{ marginLeft: "auto", fontSize: 10, color: "#9ca3af" }}>Redo</span>
                      </div>
                    ))}
                    {redoCount > 3 && (
                      <p style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", margin: "2px 0 4px" }}>
                        +{redoCount - 3} thao tác redo
                      </p>
                    )}
                  </div>
                )}

                {/* Current state indicator */}
                <div style={{
                  padding: "6px 10px", borderRadius: 6, marginBottom: 3,
                  background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)",
                  border: "1px solid #fce7f3",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 10 }}>●</span>
                  <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
                    Trạng thái hiện tại
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#9ca3af" }}>
                    #{undoCount + 1}
                  </span>
                </div>

                {/* Past stack (undo items) */}
                {Array.from({ length: Math.min(undoCount, 5) }).map((_, i) => (
                  <div
                    key={`undo-${i}`}
                    onClick={() => {
                      for (let j = 0; j <= i; j++) dispatch({ type: "UNDO" });
                    }}
                    style={{
                      padding: "6px 10px", borderRadius: 6, marginBottom: 3,
                      background: "#f9fafb", border: "1px solid #e5e7eb",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                      opacity: 1 - (i * 0.15),
                    }}
                    title="Click để undo về trạng thái này"
                  >
                    <span style={{ fontSize: 10 }}>↩</span>
                    <span style={{ fontSize: 11, color: "#374151" }}>
                      Thao tác #{undoCount - i}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#9ca3af" }}>Undo</span>
                  </div>
                ))}
                {undoCount > 5 && (
                  <p style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", margin: "4px 0 0" }}>
                    +{undoCount - 5} trạng thái cũ hơn
                  </p>
                )}
              </>
            )}
          </div>

          {/* Keyboard shortcut hint */}
          <p style={{ fontSize: 10, color: "#9ca3af", margin: "8px 0 0", textAlign: "center" }}>
            Ctrl+Z hoàn tác · Ctrl+Y làm lại
          </p>
        </div>
      )}
    </div>
  );
}
