"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { STOCK_IMAGES, panelLabelStyle } from "../editor-constants";
import type { EditorAction } from "../canvas-engine/types";

interface UploadedImage {
  url: string;
  name: string;
  size: number;
}

interface ImageTabProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  triggerAutosave: () => void;
  editorDispatch?: React.Dispatch<EditorAction>;
}

export function ImageTab({
  fileInputRef,
  handleImageUpload,
  uploadedImages,
  setUploadedImages,
  triggerAutosave,
  editorDispatch,
}: ImageTabProps) {
  function addStockImage(url: string) {
    if (!editorDispatch) return;
    editorDispatch({ type: "SNAPSHOT" });
    editorDispatch({
      type: "ADD_ELEMENT",
      element: {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: "image",
        top: 100,
        left: 50,
        width: 300,
        height: 200,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: 1,
        locked: false,
        visible: true,
        opacity: 1,
        borderRadius: 12,
        border: { width: 0, color: "transparent", style: "solid" },
        shadow: null,
        entrance: null,
        continuous: null,
        props: {
          src: url,
          objectFit: "cover",
          crop: null,
        },
      },
    });
    triggerAutosave();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={panelLabelStyle}>Thêm hình ảnh</p>
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: 16,
          borderRadius: 12,
          border: "2px dashed #e5e7eb",
          background: "#fafafa",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ImageIcon size={24} color="#9ca3af" />
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          Kéo thả hoặc nhấn vào đây để tải lên
        </span>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>
          PNG, JPG, WebP — tối đa 15 ảnh cùng lúc
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {/* File counter — CineLove parity */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          fontSize: 11,
          color: "#6b7280",
          padding: "4px 0",
        }}
      >
        <span>
          Đã tải:{" "}
          <strong style={{ color: "#3b82f6" }}>
            {uploadedImages.length}/10
          </strong>
        </span>
        <span>•</span>
        <span>
          Còn lại: <strong>{Math.max(0, 10 - uploadedImages.length)}</strong>
        </span>
      </div>

      {/* Uploaded files section */}
      <div>
        <p style={panelLabelStyle}>Tệp đã tải lên</p>
        <p
          style={{
            fontSize: 10,
            color: "#9ca3af",
            margin: "-4px 0 8px",
          }}
        >
          Tổng {uploadedImages.length} tệp (
          {(
            uploadedImages.reduce((a, b) => a + b.size, 0) /
            (1024 * 1024 * 1024)
          ).toFixed(4)}{" "}
          GB / 5GB)
        </p>
        {uploadedImages.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 4,
              marginBottom: 8,
            }}
          >
            {uploadedImages.map((img, i) => (
              <div
                key={i}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  position: "relative",
                  background: `url(${img.url}) center/cover`,
                }}
              >
                <button
                  onClick={() => {
                    setUploadedImages((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    );
                    triggerAutosave();
                  }}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.5)",
                    border: "none",
                    color: "#fff",
                    fontSize: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    fontSize: 7,
                    textAlign: "center",
                    padding: "1px 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {img.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Image Library */}
      <p style={panelLabelStyle}>Kho ảnh miễn phí</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 4,
        }}
      >
        {STOCK_IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => addStockImage(img.url)}
            title={img.label}
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              background: `url(${img.thumb}) center/cover no-repeat`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.45)",
                color: "#fff",
                fontSize: 7,
                textAlign: "center",
                padding: "2px 0",
              }}
            >
              {img.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
