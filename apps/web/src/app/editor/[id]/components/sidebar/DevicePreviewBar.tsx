"use client";
import React from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";

export type DeviceMode = "mobile" | "tablet" | "desktop";

interface DevicePreviewBarProps {
  activeDevice: DeviceMode;
  onDeviceChange: (device: DeviceMode) => void;
}

const DEVICES: { mode: DeviceMode; label: string; icon: React.ReactNode; width: number }[] = [
  { mode: "mobile", label: "Mobile", icon: <Smartphone size={14} />, width: 390 },
  { mode: "tablet", label: "Tablet", icon: <Tablet size={14} />, width: 768 },
  { mode: "desktop", label: "Desktop", icon: <Monitor size={14} />, width: 1024 },
];

export function DevicePreviewBar({ activeDevice, onDeviceChange }: DevicePreviewBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 8,
        padding: "3px 4px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {DEVICES.map((d) => (
        <button
          key={d.mode}
          onClick={() => onDeviceChange(d.mode)}
          title={`${d.label} (${d.width}px)`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 8px",
            border: "none",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            background: activeDevice === d.mode ? "#3b82f6" : "transparent",
            color: activeDevice === d.mode ? "#fff" : "#6b7280",
            transition: "all 0.15s ease",
          }}
        >
          {d.icon}
          {d.label}
        </button>
      ))}
    </div>
  );
}
