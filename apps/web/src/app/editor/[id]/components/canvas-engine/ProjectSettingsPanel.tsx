"use client";

import React from "react";

interface ProjectSettingsPanelProps {
  category: string;
  setCategory: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
}

export function ProjectSettingsPanel({
  category,
  setCategory,
  status,
  setStatus,
}: ProjectSettingsPanelProps) {
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#374151",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 13 }}>⚙</span>
        Cài đặt dự án
      </div>

      <div style={{ marginBottom: 10 }}>
        <label
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#6b7280",
            display: "block",
            marginBottom: 4,
          }}
        >
          Danh mục
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            fontSize: 12,
            boxSizing: "border-box" as const,
            background: "#fff",
            color: "#374151",
          }}
        >
          <option value="Thiệp cưới">Thiệp cưới</option>
          <option value="Thiệp sinh nhật">Thiệp sinh nhật</option>
          <option value="Thiệp tốt nghiệp">Thiệp tốt nghiệp</option>
          <option value="Sự kiện">Sự kiện</option>
          <option value="Kỷ niệm">Kỷ niệm</option>
          <option value="Lời chúc">Lời chúc</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <div>
        <label
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#6b7280",
            display: "block",
            marginBottom: 4,
          }}
        >
          Trạng thái
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            fontSize: 12,
            boxSizing: "border-box" as const,
            background: "#fff",
            color: "#374151",
          }}
        >
          <option value="Nháp">Nháp</option>
          <option value="Công khai">Công khai</option>
        </select>
      </div>
    </div>
  );
}
