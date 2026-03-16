"use client";

import React, { useState } from "react";
import { Pencil, X } from "lucide-react";

interface SEOPreviewCardProps {
  thumbnailUrl: string | null;
  ogTitle: string;
  ogDescription: string;
  onOgTitleChange: (v: string) => void;
  onOgDescriptionChange: (v: string) => void;
  triggerAutosave: () => void;
}

export function SEOPreviewCard({
  thumbnailUrl,
  ogTitle,
  ogDescription,
  onOgTitleChange,
  onOgDescriptionChange,
  triggerAutosave,
}: SEOPreviewCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <strong style={{ fontSize: 13, color: "#374151" }}>
          Bản xem trước
        </strong>
        <button
          onClick={() => setEditing(!editing)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 10px",
            borderRadius: 6,
            border: "1px solid #3b82f6",
            background: editing ? "#3b82f6" : "transparent",
            color: editing ? "#fff" : "#3b82f6",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {editing ? <X size={12} /> : <Pencil size={12} />}
          {editing ? "Đóng" : "Chỉnh sửa"}
        </button>
      </div>

      {/* Social card preview */}
      <div
        style={{
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            width: "100%",
            height: 160,
            background: thumbnailUrl
              ? `url(${thumbnailUrl}) center/cover no-repeat`
              : "linear-gradient(135deg, #fce7f3, #faf5ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!thumbnailUrl && (
            <span style={{ fontSize: 11, color: "#9ca3af" }}>
              Thumbnail tự động tạo khi lưu
            </span>
          )}
        </div>

        {/* Title + description */}
        <div style={{ padding: "10px 12px" }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1f2937",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {ogTitle || "Chưa có tiêu đề"}
          </p>
          {ogDescription && (
            <p
              style={{
                fontSize: 11,
                color: "#6b7280",
                margin: "4px 0 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {ogDescription}
            </p>
          )}
        </div>
      </div>

      <p
        style={{
          fontSize: 10,
          color: "#9ca3af",
          margin: "6px 0 0",
          lineHeight: 1.4,
        }}
      >
        Đây là cách trang của bạn sẽ hiển thị khi được chia sẻ trên Facebook,
        Zalo, Messenger hoặc các mạng xã hội khác.
      </p>

      {/* Edit form */}
      {editing && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 4,
              }}
            >
              Tiêu đề
            </label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => {
                onOgTitleChange(e.target.value);
                triggerAutosave();
              }}
              placeholder="VD: Thiệp cưới Mai Anh & Minh Quân"
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: 12,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 4,
              }}
            >
              Mô tả
            </label>
            <input
              type="text"
              value={ogDescription}
              onChange={(e) => {
                onOgDescriptionChange(e.target.value);
                triggerAutosave();
              }}
              placeholder="VD: Mời bạn dự lễ cưới ngày 15/06/2026"
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: 12,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
