"use client";

import React, { useRef, useState } from "react";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import type { CanvasElement } from "../canvas-engine/types";

interface QuickImageBarProps {
  elements: CanvasElement[];
  onReplaceImage: (elementId: string, newSrc: string) => void;
}

export function QuickImageBar({ elements, onReplaceImage }: QuickImageBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  const imageElements = elements.filter(
    (el) => el.type === "image" && (el.props as { src?: string }).src,
  );

  if (imageElements.length === 0) return null;

  function handleClick(elId: string) {
    setTargetId(elId);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !targetId) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onReplaceImage(targetId, reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setTargetId(null);
  }

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: "rgba(255,255,255,0.97)",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Toggle header */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 16px",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          color: "#6b7280",
          userSelect: "none",
        }}
      >
        <ChevronDown
          size={14}
          style={{
            transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
        Thay ảnh nhanh
      </div>

      {/* Thumbnail strip */}
      {!collapsed && (
        <div style={{ display: "flex", alignItems: "center", padding: "0 8px 8px" }}>
          <button
            onClick={() => scroll("left")}
            style={{
              width: 28,
              height: 28,
              border: "none",
              borderRadius: "50%",
              background: "#f3f4f6",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#6b7280",
            }}
          >
            <ChevronLeft size={14} />
          </button>

          <div
            ref={scrollRef}
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              flex: 1,
              padding: "0 8px",
              scrollbarWidth: "none",
            }}
          >
            {imageElements.map((el) => {
              const src = (el.props as { src?: string }).src || "";
              return (
                <button
                  key={el.id}
                  onClick={() => handleClick(el.id)}
                  title="Click để thay ảnh"
                  style={{
                    width: 72,
                    height: 72,
                    minWidth: 72,
                    borderRadius: 8,
                    border: "2px solid #e5e7eb",
                    cursor: "pointer",
                    background: `url(${src}) center/cover no-repeat`,
                    position: "relative",
                    overflow: "hidden",
                    padding: 0,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#3b82f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                >
                  {/* Upload overlay icon */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            style={{
              width: 28,
              height: 28,
              border: "none",
              borderRadius: "50%",
              background: "#f3f4f6",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#6b7280",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
