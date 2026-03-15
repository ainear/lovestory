"use client";

import React, { useState, useRef, useEffect } from "react";

const SWATCHES = [
  "#e11d48", "#f43f5e", "#fb7185", "#fda4af",
  "#c084fc", "#a855f7", "#f59e0b", "#d97706",
  "#10b981", "#059669", "#3b82f6", "#1e40af",
  "#d4a574", "#8b5e3c", "#ffffff", "#000000",
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  showOpacity?: boolean;
}

export function ColorPicker({ value, onChange, showOpacity }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(() => toHex(value));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHex(toHex(value));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleHexChange(input: string) {
    const cleaned = input.replace(/[^0-9a-fA-F#]/g, "");
    setHex(cleaned);
    const bare = cleaned.replace("#", "");
    if (bare.length === 3 || bare.length === 6) {
      onChange("#" + bare);
    }
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: "2px solid #e5e7eb",
          background: value,
          cursor: "pointer",
          padding: 0,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
        }}
        title={value}
      />
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 4,
            background: "#fff",
            borderRadius: 10,
            padding: 10,
            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
            border: "1px solid #e5e7eb",
            zIndex: 999,
            width: 172,
          }}
        >
          {/* Swatches */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 4,
              marginBottom: 8,
            }}
          >
            {SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onChange(c);
                  setHex(c);
                }}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: 6,
                  border:
                    toHex(value).toLowerCase() === c.toLowerCase()
                      ? "2px solid #3b82f6"
                      : c === "#ffffff"
                        ? "1px solid #d1d5db"
                        : "1px solid transparent",
                  background: c,
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Hex input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: showOpacity ? 8 : 0,
            }}
          >
            <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>
              HEX
            </span>
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              maxLength={7}
              style={{
                flex: 1,
                padding: "4px 6px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                fontSize: 11,
                fontFamily: "monospace",
                background: "#fafafa",
              }}
            />
            <input
              type="color"
              value={toHex(value)}
              onChange={(e) => {
                onChange(e.target.value);
                setHex(e.target.value);
              }}
              style={{
                width: 24,
                height: 24,
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                padding: 0,
              }}
              title="Bảng màu hệ thống"
            />
          </div>

          {/* Opacity slider */}
          {showOpacity && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}
              >
                Opacity
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={100}
                onChange={(e) => {
                  const opacity = Number(e.target.value) / 100;
                  const rgb = hexToRgb(toHex(value));
                  if (rgb) {
                    onChange(
                      `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`,
                    );
                  }
                }}
                style={{ flex: 1, accentColor: "#3b82f6" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function toHex(color: string): string {
  if (color.startsWith("#")) return color;
  if (color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const [r, g, b] = match.map(Number);
      return (
        "#" +
        [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")
      );
    }
  }
  return "#000000";
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
