"use client";

import React, { useState, useRef } from "react";
import { MUSIC_PRESETS, MUSIC_WIDGET_STYLES } from "../editor-constants";
import type { MusicFilterCategory } from "../editor-constants";
import { ColorPicker } from "../canvas-engine/ColorPicker";

interface UploadedSong {
  id: string;
  name: string;
  url: string;
  duration?: string;
}

interface MusicTabProps {
  musicUrl: string;
  setMusicUrl: (val: string) => void;
  musicName: string;
  setMusicName: (val: string) => void;
  musicFilter: MusicFilterCategory;
  setMusicFilter: (val: MusicFilterCategory) => void;
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
  projectId?: string;
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
  projectId,
}: MusicTabProps) {

  const [myMusic, setMyMusic] = useState<UploadedSong[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const audioInputRef = useRef<HTMLInputElement>(null);

  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (projectId) formData.append("projectId", projectId);
      const res = await fetch("/api/upload-audio", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload thất bại");
        return;
      }
      const newSong: UploadedSong = {
        id: `my-${Date.now()}`,
        name: data.name || file.name,
        url: data.url,
      };
      setMyMusic((prev) => [newSong, ...prev]);
      // Auto-select newly uploaded song
      setMusicUrl(newSong.url);
      setMusicName(newSong.name);
      triggerAutosave();
    } catch {
      setUploadError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

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

      {/* ── Custom Upload section ── */}
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", margin: 0, flex: 1 }}>
            🎵 Nhạc của tôi
          </p>
          <input
            ref={audioInputRef}
            type="file"
            accept=".mp3,.m4a,.wav,.ogg"
            style={{ display: "none" }}
            onChange={handleAudioUpload}
          />
          <button
            onClick={() => audioInputRef.current?.click()}
            disabled={uploading}
            data-testid="upload-music-btn"
            style={{
              padding: "5px 12px",
              borderRadius: 16,
              fontSize: 11,
              fontWeight: 600,
              border: "none",
              cursor: uploading ? "wait" : "pointer",
              background: uploading ? "#e5e7eb" : "#3b82f6",
              color: uploading ? "#9ca3af" : "#fff",
              opacity: uploading ? 0.7 : 1,
              transition: "all 0.15s",
            }}
          >
            {uploading ? "⏳ Đang tải..." : "⬆ Tải lên"}
          </button>
        </div>
        {uploadError && (
          <p style={{ fontSize: 11, color: "#dc2626", margin: "0 0 6px" }}>⚠ {uploadError}</p>
        )}
        {myMusic.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 8 }}>
            {myMusic.map((song) => (
              <div
                key={song.id}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: musicUrl === song.url ? "#fdf2f8" : "#f8f9fa",
                  border: musicUrl === song.url ? "1px solid #ff6b9d" : "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontSize: 14 }}>🎵</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {song.name}
                  </p>
                  <p style={{ fontSize: 9, color: "#9ca3af", margin: 0 }}>Nhạc của tôi</p>
                </div>
                <button
                  onClick={() => {
                    setMusicUrl(song.url);
                    setMusicName(song.name);
                    triggerAutosave();
                  }}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 12,
                    fontSize: 10,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: musicUrl === song.url ? "#dcfce7" : "#e0f2fe",
                    color: musicUrl === song.url ? "#16a34a" : "#0369a1",
                  }}
                >
                  {musicUrl === song.url ? "✓" : "Dùng"}
                </button>
                <button
                  onClick={() => setMyMusic((prev) => prev.filter((s) => s.id !== song.id))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12 }}
                >✕</button>
              </div>
            ))}
          </div>
        )}
        {myMusic.length === 0 && !uploading && (
          <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "4px 0 8px" }}>
            Chưa có nhạc tải lên · Hỗ trợ MP3, M4A, WAV (tối đa 10MB)
          </p>
        )}
      </div>

      {/* Thư viện nhạc label */}
      <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", margin: "4px 0 0" }}>🎶 Thư viện nhạc</p>

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
