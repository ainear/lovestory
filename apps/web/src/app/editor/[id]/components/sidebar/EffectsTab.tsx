"use client";

import React from "react";
import {
  PAGE_ANIM_PRESETS,
  CURTAIN_PRESETS,
  PARTICLE_PRESETS,
} from "../editor-constants";

interface EffectsTabProps {
  effectSubTab: string;
  setEffectSubTab: (val: string) => void;
  pageAnimation: string;
  setPageAnimation: (val: string) => void;
  curtainEffect: string;
  setCurtainEffect: (val: string) => void;
  particleEffect: string;
  setParticleEffect: (val: string) => void;
  triggerAutosave: () => void;
}

export function EffectsTab({
  effectSubTab,
  setEffectSubTab,
  pageAnimation,
  setPageAnimation,
  curtainEffect,
  setCurtainEffect,
  particleEffect,
  setParticleEffect,
  triggerAutosave,
}: EffectsTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Sub-tab buttons */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {[
          { id: "anim", label: "Hiệu ứng động" },
          { id: "curtain", label: "Hiệu ứng mở màn" },
          { id: "particles", label: "Hiệu ứng rơi" },
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setEffectSubTab(sub.id)}
            style={{
              padding: "6px 10px",
              borderRadius: 20,
              border: "none",
              background:
                effectSubTab === sub.id ? "#3b82f6" : "#f3f4f6",
              color: effectSubTab === sub.id ? "#fff" : "#6b7280",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Hiệu ứng động — page transition presets */}
      {effectSubTab === "anim" && (
        <div>
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              margin: "0 0 8px",
            }}
          >
            Chọn 1 mẫu hiệu ứng để áp dụng cho toàn bộ trang
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            {PAGE_ANIM_PRESETS.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setPageAnimation(a.id);
                  triggerAutosave();
                }}
                style={{
                  padding: "12px 8px",
                  borderRadius: 10,
                  border: `2px solid ${pageAnimation === a.id ? "#3b82f6" : "#e5e7eb"}`,
                  background:
                    pageAnimation === a.id ? "#eff6ff" : "#fff",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {a.label}
                </span>
              </button>
            ))}
          </div>
          <button
            disabled
            style={{
              marginTop: 10,
              padding: "8px 16px",
              borderRadius: 10,
              border: "none",
              background: "rgba(100,100,120,0.3)",
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "not-allowed",
              width: "100%",
            }}
          >
            🎬 Xem trước (sắp có)
          </button>
        </div>
      )}

      {/* Hiệu ứng mở màn — envelope opening */}
      {effectSubTab === "curtain" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
            Hiệu ứng mở màn khi khách xem thiệp
          </p>
          {CURTAIN_PRESETS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCurtainEffect(c.id);
                triggerAutosave();
              }}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                border: `2px solid ${curtainEffect === c.id ? "#ff6b9d" : "#e5e7eb"}`,
                background:
                  curtainEffect === c.id ? "#fdf2f8" : "#fff",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    margin: 0,
                  }}
                >
                  {c.label}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    margin: 0,
                  }}
                >
                  {c.desc}
                </p>
              </div>
              {curtainEffect === c.id && (
                <span
                  style={{
                    fontSize: 14,
                    color: "#ff6b9d",
                    marginLeft: "auto",
                  }}
                >
                  ✔
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Hiệu ứng rơi — particles */}
      {effectSubTab === "particles" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            {PARTICLE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setParticleEffect(p.id);
                  triggerAutosave();
                }}
                style={{
                  padding: "10px 8px",
                  borderRadius: 10,
                  border: `2px solid ${particleEffect === p.id ? "#ff6b9d" : "#e5e7eb"}`,
                  background:
                    particleEffect === p.id ? "#fdf2f8" : "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 20 }}>{p.emoji}</span>
                <span style={{ fontSize: 10, color: "#374151" }}>
                  {p.label}
                </span>
                {particleEffect === p.id && (
                  <span style={{ fontSize: 10, color: "#ff6b9d" }}>
                    ✔
                  </span>
                )}
              </button>
            ))}
          </div>
          <p
            style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}
          >
            Hiệu ứng hiển thị trên thiệp khi khách mở link mời
          </p>
        </div>
      )}
    </div>
  );
}
