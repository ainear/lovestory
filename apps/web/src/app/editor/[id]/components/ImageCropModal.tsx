"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ImageCropModalProps {
    imageUrl: string;
    onCrop: (croppedDataUrl: string) => void;
    onCancel: () => void;
}

export function ImageCropModal({ imageUrl, onCrop, onCancel }: ImageCropModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
    const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
    const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragType, setDragType] = useState<"move" | "resize-br" | "create">("create");
    const [aspectRatio, setAspectRatio] = useState<number | null>(null); // null = free

    const imgRef = useRef<HTMLImageElement | null>(null);

    // Load image
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            imgRef.current = img;
            setImgSize({ w: img.naturalWidth, h: img.naturalHeight });

            // Fit to container (max 500px)
            const maxW = 500, maxH = 400;
            const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
            const dw = img.naturalWidth * scale;
            const dh = img.naturalHeight * scale;
            setDisplaySize({ w: dw, h: dh });

            // Default crop = center 80%
            const cx = dw * 0.1, cy = dh * 0.1;
            setCrop({ x: cx, y: cy, width: dw * 0.8, height: dh * 0.8 });
            setImgLoaded(true);
        };
        img.src = imageUrl;
    }, [imageUrl]);

    // Draw canvas with crop overlay
    useEffect(() => {
        if (!imgLoaded || !canvasRef.current || !imgRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        canvasRef.current.width = displaySize.w;
        canvasRef.current.height = displaySize.h;

        // Draw image
        ctx.drawImage(imgRef.current, 0, 0, displaySize.w, displaySize.h);

        // Dark overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, displaySize.w, displaySize.h);

        // Clear crop area (show original)
        ctx.clearRect(crop.x, crop.y, crop.width, crop.height);
        ctx.drawImage(
            imgRef.current,
            (crop.x / displaySize.w) * imgSize.w,
            (crop.y / displaySize.h) * imgSize.h,
            (crop.width / displaySize.w) * imgSize.w,
            (crop.height / displaySize.h) * imgSize.h,
            crop.x, crop.y, crop.width, crop.height
        );

        // Crop border
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

        // Rule of thirds grid
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        for (let i = 1; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(crop.x + (crop.width / 3) * i, crop.y);
            ctx.lineTo(crop.x + (crop.width / 3) * i, crop.y + crop.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(crop.x, crop.y + (crop.height / 3) * i);
            ctx.lineTo(crop.x + crop.width, crop.y + (crop.height / 3) * i);
            ctx.stroke();
        }

        // Corner handles
        const hs = 8;
        ctx.fillStyle = "#fff";
        const corners = [
            [crop.x - hs / 2, crop.y - hs / 2],
            [crop.x + crop.width - hs / 2, crop.y - hs / 2],
            [crop.x - hs / 2, crop.y + crop.height - hs / 2],
            [crop.x + crop.width - hs / 2, crop.y + crop.height - hs / 2],
        ];
        corners.forEach(([cx, cy]) => {
            ctx.fillRect(cx, cy, hs, hs);
        });
    }, [imgLoaded, crop, displaySize, imgSize]);

    // Mouse handlers
    const getPos = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const pos = getPos(e);
        const hs = 12; // handle zone

        // Check if near bottom-right corner for resize
        if (Math.abs(pos.x - (crop.x + crop.width)) < hs && Math.abs(pos.y - (crop.y + crop.height)) < hs) {
            setDragType("resize-br");
        } else if (pos.x >= crop.x && pos.x <= crop.x + crop.width && pos.y >= crop.y && pos.y <= crop.y + crop.height) {
            setDragType("move");
        } else {
            setDragType("create");
            setCrop({ x: pos.x, y: pos.y, width: 0, height: 0 });
        }
        setDragStart(pos);
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const pos = getPos(e);
        const dx = pos.x - dragStart.x;
        const dy = pos.y - dragStart.y;

        if (dragType === "move") {
            setCrop(prev => ({
                ...prev,
                x: Math.max(0, Math.min(displaySize.w - prev.width, prev.x + dx)),
                y: Math.max(0, Math.min(displaySize.h - prev.height, prev.y + dy)),
            }));
        } else if (dragType === "resize-br") {
            setCrop(prev => {
                let newW = Math.max(20, prev.width + dx);
                let newH = aspectRatio ? newW / aspectRatio : Math.max(20, prev.height + dy);
                newW = Math.min(newW, displaySize.w - prev.x);
                newH = Math.min(newH, displaySize.h - prev.y);
                return { ...prev, width: newW, height: newH };
            });
        } else {
            // create
            let w = pos.x - crop.x;
            let h = aspectRatio ? w / aspectRatio : pos.y - crop.y;
            setCrop(prev => ({ ...prev, width: Math.max(w, 20), height: Math.max(h, 20) }));
        }
        setDragStart(pos);
    };

    const handleMouseUp = () => setIsDragging(false);

    // Crop and export
    const handleCrop = () => {
        if (!imgRef.current) return;
        const scaleX = imgSize.w / displaySize.w;
        const scaleY = imgSize.h / displaySize.h;

        const outCanvas = document.createElement("canvas");
        const cropW = crop.width * scaleX;
        const cropH = crop.height * scaleY;
        outCanvas.width = cropW;
        outCanvas.height = cropH;
        const ctx = outCanvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(
            imgRef.current,
            crop.x * scaleX, crop.y * scaleY,
            cropW, cropH,
            0, 0, cropW, cropH
        );

        const dataUrl = outCanvas.toDataURL("image/jpeg", 0.9);
        onCrop(dataUrl);
    };

    // Preset ratios
    const presets = [
        { label: "Tự do", ratio: null },
        { label: "1:1", ratio: 1 },
        { label: "4:3", ratio: 4 / 3 },
        { label: "16:9", ratio: 16 / 9 },
        { label: "3:4", ratio: 3 / 4 },
        { label: "9:16", ratio: 9 / 16 },
    ];

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <div style={{
                background: "#fff", borderRadius: 20, padding: 24,
                maxWidth: 600, width: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1f2937" }}>✂️ Cắt ảnh</h3>
                    <button onClick={onCancel} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
                </div>

                {/* Aspect ratio presets */}
                <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                    {presets.map(p => (
                        <button
                            key={p.label}
                            onClick={() => {
                                setAspectRatio(p.ratio);
                                if (p.ratio && crop.width > 0) {
                                    setCrop(prev => ({ ...prev, height: prev.width / p.ratio! }));
                                }
                            }}
                            style={{
                                padding: "5px 12px", borderRadius: 6, border: "1px solid #e5e7eb",
                                background: aspectRatio === p.ratio ? "#fdf2f8" : "#fff",
                                color: aspectRatio === p.ratio ? "#be185d" : "#6b7280",
                                fontSize: 12, fontWeight: 600, cursor: "pointer",
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Canvas */}
                <div
                    ref={containerRef}
                    style={{
                        display: "flex", justifyContent: "center", background: "#f3f4f6",
                        borderRadius: 12, padding: 12, marginBottom: 16,
                    }}
                >
                    {imgLoaded ? (
                        <canvas
                            ref={canvasRef}
                            style={{ cursor: isDragging ? "grabbing" : "crosshair", borderRadius: 8 }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        />
                    ) : (
                        <div style={{ padding: 60, color: "#9ca3af", fontSize: 14 }}>Đang tải ảnh...</div>
                    )}
                </div>

                {/* Crop info */}
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 16px", textAlign: "center" }}>
                    {Math.round(crop.width * (imgSize.w / displaySize.w))} × {Math.round(crop.height * (imgSize.h / displaySize.h))}px
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={onCancel} style={{
                        padding: "10px 20px", borderRadius: 10, border: "1px solid #e5e7eb",
                        background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer",
                    }}>
                        Hủy
                    </button>
                    <button onClick={handleCrop} style={{
                        padding: "10px 24px", borderRadius: 10, border: "none",
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}>
                        ✂️ Cắt & áp dụng
                    </button>
                </div>
            </div>
        </div>
    );
}
