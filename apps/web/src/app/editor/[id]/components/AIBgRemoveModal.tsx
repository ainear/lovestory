"use client";

import { useState, useCallback } from "react";

interface AIBgRemoveProps {
    imageUrl: string;
    onComplete: (resultDataUrl: string) => void;
    onCancel: () => void;
}

export function AIBgRemoveModal({ imageUrl, onComplete, onCancel }: AIBgRemoveProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "processing" | "done" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleRemove = useCallback(async () => {
        setStatus("loading");
        setProgress(10);
        try {
            // Dynamic import to avoid SSR issues (WASM)
            const { removeBackground } = await import("@imgly/background-removal");
            setStatus("processing");
            setProgress(30);

            const result = await removeBackground(imageUrl, {
                progress: (key: string, current: number, total: number) => {
                    if (total > 0) {
                        const pct = Math.round(30 + (current / total) * 60);
                        setProgress(Math.min(pct, 95));
                    }
                },
            });

            // Convert blob to data URL
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string;
                setResultUrl(dataUrl);
                setStatus("done");
                setProgress(100);
            };
            reader.readAsDataURL(result);
        } catch (err) {
            console.error("BG Removal failed:", err);
            setErrorMsg(err instanceof Error ? err.message : "Lỗi không xác định");
            setStatus("error");
        }
    }, [imageUrl]);

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <div style={{
                background: "#fff", borderRadius: 20, padding: 24,
                maxWidth: 560, width: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1f2937" }}>🪄 Xóa nền ảnh (AI)</h3>
                    <button onClick={onCancel} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
                </div>

                {/* Preview */}
                <div style={{
                    display: "flex", gap: 12, marginBottom: 16, justifyContent: "center",
                    background: "#f3f4f6", borderRadius: 12, padding: 12,
                }}>
                    <div style={{ textAlign: "center", flex: 1 }}>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 6px" }}>Gốc</p>
                        <img src={imageUrl} alt="Original" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, objectFit: "contain" }} />
                    </div>
                    {resultUrl && (
                        <div style={{ textAlign: "center", flex: 1 }}>
                            <p style={{ fontSize: 11, color: "#10b981", margin: "0 0 6px", fontWeight: 600 }}>✅ Đã xóa nền</p>
                            <div style={{ background: "repeating-conic-gradient(#d1d5db 0% 25%, #fff 0% 50%) 50% / 16px 16px", borderRadius: 8, display: "inline-block", padding: 4 }}>
                                <img src={resultUrl} alt="Result" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 6, objectFit: "contain" }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress */}
                {(status === "loading" || status === "processing") && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: "#6b7280" }}>
                                {status === "loading" ? "Đang tải mô hình AI..." : "Đang xử lý ảnh..."}
                            </span>
                            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{progress}%</span>
                        </div>
                        <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{
                                height: "100%", borderRadius: 3, transition: "width 0.3s ease",
                                background: "linear-gradient(90deg, #ff6b9d, #c084fc)",
                                width: `${progress}%`,
                            }} />
                        </div>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: "8px 0 0", textAlign: "center" }}>
                            ⚡ Lần đầu có thể mất 10-20s để tải mô hình AI (~3MB)
                        </p>
                    </div>
                )}

                {/* Error */}
                {status === "error" && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 10, padding: 12, marginBottom: 16 }}>
                        <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>❌ {errorMsg}</p>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={onCancel} style={{
                        padding: "10px 20px", borderRadius: 10, border: "1px solid #e5e7eb",
                        background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer",
                    }}>
                        {status === "done" ? "Bỏ qua" : "Hủy"}
                    </button>
                    {status === "idle" && (
                        <button onClick={handleRemove} style={{
                            padding: "10px 24px", borderRadius: 10, border: "none",
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                        }}>
                            🪄 Xóa nền
                        </button>
                    )}
                    {status === "error" && (
                        <button onClick={handleRemove} style={{
                            padding: "10px 24px", borderRadius: 10, border: "none",
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                        }}>
                            🔄 Thử lại
                        </button>
                    )}
                    {status === "done" && resultUrl && (
                        <button onClick={() => onComplete(resultUrl)} style={{
                            padding: "10px 24px", borderRadius: 10, border: "none",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                        }}>
                            ✅ Áp dụng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
