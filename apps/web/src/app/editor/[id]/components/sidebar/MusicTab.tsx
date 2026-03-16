"use client";

import React from "react";
import { MUSIC_PRESETS, MUSIC_WIDGET_STYLES } from "../editor-constants";
import { ColorPicker } from "../canvas-engine/ColorPicker";

interface MusicTabProps {
  musicUrl: string;
  setMusicUrl: (val: string) => void;
  musicName: string;
  setMusicName: (val: string) => void;
  musicFilter:
    | "all"
    | "intl"
    | "vpop"
    | "acoustic"
    | "piano"
    | "kpop"
    | "classical";
  setMusicFilter: (
    val: "all" | "intl" | "vpop" | "acoustic" | "piano" | "kpop" | "classical",
  ) => void;
  musicSearch: string;
  setMusicSearch: (val: string) => void;
  previewId: string | null;
  setPreviewId: (val: string | null) => void;
  musicAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  musicWidgetStyle: string;
  setMusicWidgetStyle: (val: string) => void;
  musicWidgetColor: string;
  setMusicWidgetColor: (val: string) => void;
  triggerAutosave: () => void;
}

export function MusicTab({
  musicUrl,
  setMusicUrl,
  musicName,
  setMusicName,
  musicFilter,
  setMusicFilter,
  musicSearch,
  setMusicSearch,
  previewId,
  setPreviewId,
  musicAudioRef,
  musicWidgetStyle,
  setMusicWidgetStyle,
  musicWidgetColor,
  setMusicWidgetColor,
  triggerAutosave,
}: MusicTabProps) {
  const filtered = MUSIC_PRESETS.filter((m) => {
    if (musicFilter !== "all" && m.cat !== musicFilter) return false;
    if (
      musicSearch &&
      !m.label.toLowerCase().includes(musicSearch.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Tab categories */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#374151",
            margin: 0,
            marginRight: 8,
          }}
        >
          Thư viện nhạc
        </p>
      </div>

      {/* Currently playing */}
      {musicUrl && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            background: "#fdf2f8",
            border: "1px solid #ff6b9d",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🎵</span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#374151",
                margin: 0,
              }}
            >
              {musicName || "Đã chọn nhạc"}
            </p>
            <p
              style={{
                fontSize: 9,
                color: "#9ca3af",
                margin: 0,
              }}
            >
              Nhạc hiện tại
            </p>
          </div>
          <button
            onClick={() => {
              setMusicUrl("");
              setMusicName("");
              triggerAutosave();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 10,
            top: 8,
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm bài hát"
          value={musicSearch}
          onChange={(e) => setMusicSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "7px 10px 7px 28px",
            borderRadius: 20,
            border: "1px solid #e5e7eb",
            fontSize: 11,
            boxSizing: "border-box",
            background: "#fff",
          }}
        />
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "all" as const, label: "Tất cả" },
          { id: "vpop" as const, label: "V-POP" },
          { id: "intl" as const, label: "Nhạc ngoại" },
          { id: "acoustic" as const, label: "🎸 Guitar" },
          { id: "piano" as const, label: "🎹 Piano" },
          { id: "kpop" as const, label: "🇰🇷 K-Pop" },
          { id: "classical" as const, label: "🎻 Cổ điển" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setMusicFilter(cat.id)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: musicFilter === cat.id ? "#3b82f6" : "#f3f4f6",
              color: musicFilter === cat.id ? "#fff" : "#6b7280",
              transition: "all 0.15s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Song list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {filtered.map((m) => (
          <div
            key={m.id}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: musicUrl === m.url ? "#fdf2f8" : "transparent",
              transition: "all 0.1s",
            }}
          >
            {/* Play button */}
            <button
              onClick={() => {
                if (previewId === m.id) {
                  musicAudioRef.current?.pause();
                  setPreviewId(null);
                } else {
                  if (musicAudioRef.current) musicAudioRef.current.pause();
                  musicAudioRef.current = new Audio(m.url);
                  musicAudioRef.current.play().catch(() => {});
                  setPreviewId(m.id);
                }
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "none",
                background: previewId === m.id ? "#3b82f6" : "#f3f4f6",
                color: previewId === m.id ? "#fff" : "#374151",
                cursor: "pointer",
                fontSize: 10,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {previewId === m.id ? "⏸" : "▶"}
            </button>

            {/* Song info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#374151",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {m.label}
              </p>
              <p
                style={{
                  fontSize: 9,
                  color: "#9ca3af",
                  margin: 0,
                }}
              >
                {m.duration}
              </p>
            </div>

            {/* Use button */}
            <button
              onClick={() => {
                setMusicUrl(m.url);
                setMusicName(m.label);
                if (musicAudioRef.current) {
                  musicAudioRef.current.pause();
                  setPreviewId(null);
                }
                triggerAutosave();
              }}
              style={{
                padding: "4px 12px",
                borderRadius: 16,
                fontSize: 10,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                background: musicUrl === m.url ? "#dcfce7" : "#e0f2fe",
                color: musicUrl === m.url ? "#16a34a" : "#0369a1",
              }}
            >
              {musicUrl === m.url ? "✓" : "Sử dụng"}
            </button>
            {musicUrl === m.url && (
              <span style={{ fontSize: 10, color: "#16a34a" }}>✅</span>
            )}
          </div>
        ))}
      </div>

      {/* Music widget style picker */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          paddingTop: 10,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#374151",
            margin: "0 0 6px",
          }}
        >
          Kiểu nhạc widget
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
          }}
        >
          {MUSIC_WIDGET_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setMusicWidgetStyle(s.id);
                triggerAutosave();
              }}
              style={{
                padding: "10px 8px",
                borderRadius: 10,
                border:
                  musicWidgetStyle === s.id
                    ? "2px solid #3b82f6"
                    : "2px solid #e5e7eb",
                background: musicWidgetStyle === s.id ? "#eff6ff" : "#fff",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 18 }}>{s.emoji}</span>
              <span style={{ color: "#374151" }}>{s.label}</span>
            </button>
          ))}
        </div>
        {/* Widget color picker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <ColorPicker
            value={musicWidgetColor}
            onChange={(color) => {
              setMusicWidgetColor(color);
              triggerAutosave();
            }}
          />
          <span style={{ fontSize: 11, color: "#6b7280" }}>
            Màu widget nhạc
          </span>
        </div>
      </div>
    </div>
  );
}
