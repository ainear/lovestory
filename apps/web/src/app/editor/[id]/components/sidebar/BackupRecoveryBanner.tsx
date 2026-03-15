"use client";

import React from "react";

interface BackupRecoveryBannerProps {
  projectId: string;
  setBackground: (val: string) => void;
  setBgOpacity: (val: number) => void;
  setMusicUrl: (val: string) => void;
  setMusicName: (val: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorDispatch: React.Dispatch<any>;
  triggerAutosave: () => void;
  setShowBackupRecovery: (val: boolean) => void;
}

export function BackupRecoveryBanner({
  projectId,
  setBackground,
  setBgOpacity,
  setMusicUrl,
  setMusicName,
  editorDispatch,
  triggerAutosave,
  setShowBackupRecovery,
}: BackupRecoveryBannerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        background: "linear-gradient(90deg, #fef3c7, #fde68a)",
        borderBottom: "1px solid #f59e0b",
      }}
    >
      <span style={{ fontSize: 16 }}>💾</span>
      <p style={{ flex: 1, fontSize: 12, color: "#92400e", margin: 0 }}>
        Phát hiện bản sao lưu chưa được lưu. Bạn muốn khôi phục?
      </p>
      <button
        onClick={() => {
          try {
            const backup = localStorage.getItem(`editor_backup_${projectId}`);
            if (backup) {
              const parsed = JSON.parse(backup);
              const data = JSON.parse(parsed.canvasJson);
              if (data.canvas?.bg) setBackground(data.canvas.bg);
              if (data.canvas?.bgOpacity !== undefined)
                setBgOpacity(data.canvas.bgOpacity);
              if (data.meta?.musicUrl) {
                setMusicUrl(data.meta.musicUrl);
                setMusicName(data.meta.musicName || "");
              }
              if (data.elements) {
                const { sanitizeElements } =
                  await import("../canvas-engine/types");
                editorDispatch({
                  type: "SET_ELEMENTS",
                  elements: sanitizeElements(data.elements),
                });
              }
              triggerAutosave();
            }
          } catch {
            /* ignore */
          }
          setShowBackupRecovery(false);
        }}
        style={{
          padding: "5px 14px",
          borderRadius: 8,
          border: "none",
          background: "#16a34a",
          color: "#fff",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Khôi phục
      </button>
      <button
        onClick={() => {
          localStorage.removeItem(`editor_backup_${projectId}`);
          setShowBackupRecovery(false);
        }}
        style={{
          padding: "5px 14px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          background: "#fff",
          color: "#6b7280",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Bỏ qua
      </button>
    </div>
  );
}
