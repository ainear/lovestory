"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface VideoStatus {
    id: string;
    status: string;
    progress: number;
    output_url?: string;
    thumbnail_url?: string;
    error_message?: string;
    duration_seconds?: number;
}

export default function AIVideoPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [style, setStyle] = useState("cinematic");
    const [music, setMusic] = useState("romantic");
    const [duration, setDuration] = useState("30");
    const [status, setStatus] = useState<
        "idle" | "uploading" | "processing" | "done" | "error"
    >("idle");
    const [progress, setProgress] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for future display
    const [_videoId, setVideoId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);
    const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const STYLES = [
        {
            id: "cinematic",
            name: "🎬 Cinematic",
            desc: "Phong cách điện ảnh, ấm áp",
        },
        {
            id: "romantic",
            name: "💕 Romantic",
            desc: "Lãng mạn, nhẹ nhàng",
        },
        { id: "vintage", name: "📸 Vintage", desc: "Cổ điển, retro" },
        {
            id: "modern",
            name: "✨ Modern",
            desc: "Hiện đại, tối giản",
        },
    ];

    const MUSIC_OPTIONS = [
        { id: "romantic", name: "🎵 Romantic Piano" },
        { id: "acoustic", name: "🎸 Acoustic Guitar" },
        { id: "orchestra", name: "🎻 Orchestra" },
        { id: "none", name: "🔇 Không nhạc" },
    ];

    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(e.target.files || []).slice(0, 20);
        setFiles((prev) => [...prev, ...selected].slice(0, 20));

        selected.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreviews((prev) =>
                    [...prev, ev.target?.result as string].slice(0, 20),
                );
            };
            reader.readAsDataURL(file);
        });
    }

    function removePhoto(index: number) {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    // Stable ref updated every render — avoids circular self-reference in useCallback
    const pollStatusRef = useRef<((vid: string) => void) | null>(null);

    const pollStatus = useCallback(async (vid: string) => {
        try {
            const res = await fetch(
                `/api/video/status?id=${encodeURIComponent(vid)}`,
            );
            const data: VideoStatus = await res.json();

            setProgress(data.progress || 0);

            if (data.status === "complete" && data.output_url) {
                setStatus("done");
                setVideoUrl(data.output_url);
                return;
            }

            if (data.status === "failed") {
                setStatus("error");
                setErrorMsg(
                    data.error_message || "Video generation failed",
                );
                return;
            }

            // Use ref to schedule next poll — avoids circular self-reference
            pollRef.current = setTimeout(() => pollStatusRef.current?.(vid), 2000);
        } catch {
            pollRef.current = setTimeout(() => pollStatusRef.current?.(vid), 3000);
        }
    }, []);

    // Keep ref in sync with latest pollStatus (runs after each render)
    useEffect(() => {
        pollStatusRef.current = pollStatus;
    });

    useEffect(() => {
        return () => {
            if (pollRef.current) clearTimeout(pollRef.current);
        };
    }, []);

    async function handleGenerate() {
        if (files.length < 3) return;

        setStatus("uploading");
        setProgress(0);
        setErrorMsg("");

        try {
            // 1. Upload all photos to get URLs
            const photoUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    if (data.url) {
                        photoUrls.push(data.url);
                    }
                }
                setProgress(
                    Math.round(((i + 1) / files.length) * 30),
                );
            }

            if (photoUrls.length < 3) {
                setStatus("error");
                setErrorMsg(
                    "Không upload được đủ ảnh. Vui lòng thử lại.",
                );
                return;
            }

            setStatus("processing");
            setProgress(35);

            // 2. Call video generate via tRPC (or direct API)
            const genRes = await fetch("/api/video/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photoUrls,
                    style,
                    music,
                    duration,
                }),
            });

            const genData = await genRes.json();
            if (genData.videoId) {
                setVideoId(genData.videoId);
                // Start polling for status
                pollRef.current = setTimeout(
                    () => pollStatusRef.current?.(genData.videoId),
                    2000,
                );
            } else {
                setStatus("error");
                setErrorMsg(
                    genData.error || "Không thể bắt đầu tạo video",
                );
            }
        } catch {
            setStatus("error");
            setErrorMsg("Lỗi kết nối. Vui lòng thử lại.");
        }
    }

    if (status === "error") {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "linear-gradient(180deg, #0f0c29, #302b63)",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        maxWidth: 480,
                        padding: 40,
                    }}
                >
                    <div style={{ fontSize: 64, marginBottom: 16 }}>
                        ❌
                    </div>
                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#ef4444",
                            margin: "0 0 12px",
                        }}
                    >
                        Có lỗi xảy ra
                    </h1>
                    <p
                        style={{
                            fontSize: 14,
                            color: "rgba(255,255,255,0.5)",
                            margin: "0 0 24px",
                        }}
                    >
                        {errorMsg}
                    </p>
                    <button
                        onClick={() => {
                            setStatus("idle");
                            setErrorMsg("");
                            setProgress(0);
                        }}
                        style={{
                            padding: "12px 28px",
                            borderRadius: 12,
                            background:
                                "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        🔄 Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (status === "done" && videoUrl) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "linear-gradient(180deg, #0f0c29, #302b63)",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        maxWidth: 640,
                        padding: 40,
                    }}
                >
                    <div style={{ fontSize: 48, marginBottom: 16 }}>
                        🎬
                    </div>
                    <h1
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#fff",
                            margin: "0 0 16px",
                        }}
                    >
                        Video đã sẵn sàng!
                    </h1>

                    {/* Video Player */}
                    <div
                        style={{
                            borderRadius: 16,
                            overflow: "hidden",
                            marginBottom: 24,
                            boxShadow:
                                "0 20px 60px rgba(0,0,0,0.5)",
                        }}
                    >
                        <video
                            controls
                            autoPlay
                            style={{
                                width: "100%",
                                display: "block",
                            }}
                            src={videoUrl}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "center",
                        }}
                    >
                        <a
                            href={videoUrl}
                            download
                            style={{
                                padding: "12px 28px",
                                borderRadius: 12,
                                background:
                                    "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >
                            ⬇️ Tải video
                        </a>
                        <Link
                            href="/dashboard"
                            style={{
                                padding: "12px 24px",
                                borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "#fff",
                                fontSize: 14,
                                textDecoration: "none",
                            }}
                        >
                            🏠 Về Dashboard
                        </Link>
                        <button
                            onClick={() => {
                                setStatus("idle");
                                setFiles([]);
                                setPreviews([]);
                                setVideoUrl(null);
                                setVideoId(null);
                                setProgress(0);
                            }}
                            style={{
                                padding: "12px 24px",
                                borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.2)",
                                background: "transparent",
                                color: "#fff",
                                fontSize: 14,
                                cursor: "pointer",
                            }}
                        >
                            ➕ Tạo video mới
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                fontFamily: "'Inter', sans-serif",
                padding: "40px 24px",
            }}
        >
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <Link
                        href="/"
                        style={{
                            fontSize: 20,
                            fontWeight: 800,
                            background:
                                "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textDecoration: "none",
                        }}
                    >
                        ❤️ LoveStory
                    </Link>
                    <h1
                        style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: "#fff",
                            margin: "16px 0 4px",
                        }}
                    >
                        🎬 AI Video Maker
                    </h1>
                    <p
                        style={{
                            fontSize: 14,
                            color: "rgba(255,255,255,0.5)",
                            margin: 0,
                        }}
                    >
                        Upload ảnh cưới → AI tạo video cinematic với hiệu
                        ứng chuyên nghiệp
                    </p>
                </div>

                {status === "uploading" || status === "processing" ? (
                    /* Progress UI */
                    <div
                        style={{
                            maxWidth: 400,
                            margin: "0 auto",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: 24,
                                padding: 40,
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.1)",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 48,
                                    marginBottom: 16,
                                }}
                            >
                                {status === "uploading"
                                    ? "📤"
                                    : progress < 50
                                        ? "🤖"
                                        : "🎬"}
                            </div>
                            <h3
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    color: "#fff",
                                    margin: "0 0 8px",
                                }}
                            >
                                {status === "uploading"
                                    ? "Đang upload ảnh..."
                                    : progress < 40
                                        ? "AI đang xử lý ảnh..."
                                        : progress < 60
                                            ? "Đang tạo text với Gemini AI..."
                                            : progress < 90
                                                ? "FFmpeg đang render video..."
                                                : "Đang hoàn tất..."}
                            </h3>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: "rgba(255,255,255,0.5)",
                                    margin: "0 0 24px",
                                }}
                            >
                                {status === "uploading"
                                    ? `${files.length} ảnh`
                                    : `${STYLES.find((s) => s.id === style)?.name} · ${duration}s`}
                            </p>
                            {/* Progress bar */}
                            <div
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    borderRadius: 8,
                                    height: 8,
                                    overflow: "hidden",
                                    marginBottom: 8,
                                }}
                            >
                                <div
                                    style={{
                                        width: `${progress}%`,
                                        height: "100%",
                                        background:
                                            "linear-gradient(90deg, #ff6b9d, #c084fc)",
                                        borderRadius: 8,
                                        transition: "width 0.5s",
                                    }}
                                />
                            </div>
                            <p
                                style={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.4)",
                                    margin: 0,
                                }}
                            >
                                {progress}%
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Upload Area */}
                        <div
                            onClick={() => fileRef.current?.click()}
                            style={{
                                border: "2px dashed rgba(255,255,255,0.15)",
                                borderRadius: 20,
                                padding:
                                    files.length > 0 ? 16 : 48,
                                textAlign: "center",
                                cursor: "pointer",
                                background: "rgba(255,255,255,0.03)",
                                marginBottom: 24,
                                transition: "all 0.2s",
                            }}
                        >
                            {files.length === 0 ? (
                                <>
                                    <p
                                        style={{
                                            fontSize: 48,
                                            marginBottom: 12,
                                        }}
                                    >
                                        📸
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: "#fff",
                                            margin: "0 0 4px",
                                        }}
                                    >
                                        Kéo thả hoặc nhấn để chọn ảnh
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: "rgba(255,255,255,0.4)",
                                            margin: 0,
                                        }}
                                    >
                                        Tối thiểu 3 ảnh · Tối đa 20 ảnh
                                        · JPG, PNG
                                    </p>
                                </>
                            ) : (
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(5, 1fr)",
                                        gap: 8,
                                    }}
                                >
                                    {previews.map((src, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                position: "relative",
                                                aspectRatio: "1",
                                                borderRadius: 10,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <img
                                                src={src}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removePhoto(i);
                                                }}
                                                style={{
                                                    position: "absolute",
                                                    top: 4,
                                                    right: 4,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: "50%",
                                                    background:
                                                        "rgba(0,0,0,0.6)",
                                                    border: "none",
                                                    color: "#fff",
                                                    fontSize: 10,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "center",
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {files.length < 20 && (
                                        <div
                                            style={{
                                                aspectRatio: "1",
                                                borderRadius: 10,
                                                border: "1px dashed rgba(255,255,255,0.2)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent:
                                                    "center",
                                                color: "rgba(255,255,255,0.3)",
                                                fontSize: 24,
                                            }}
                                        >
                                            +
                                        </div>
                                    )}
                                </div>
                            )}
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleFiles}
                            />
                        </div>

                        {/* Style Selection */}
                        <div style={{ marginBottom: 24 }}>
                            <h3
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "rgba(255,255,255,0.7)",
                                    margin: "0 0 12px",
                                }}
                            >
                                🎨 Phong cách video
                            </h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(4, 1fr)",
                                    gap: 10,
                                }}
                            >
                                {STYLES.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() =>
                                            setStyle(s.id)
                                        }
                                        style={{
                                            padding: 14,
                                            borderRadius: 14,
                                            border:
                                                style === s.id
                                                    ? "2px solid #c084fc"
                                                    : "1px solid rgba(255,255,255,0.1)",
                                            background:
                                                style === s.id
                                                    ? "rgba(192,132,252,0.1)"
                                                    : "rgba(255,255,255,0.03)",
                                            cursor: "pointer",
                                            textAlign: "center",
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "#fff",
                                                margin: "0 0 4px",
                                            }}
                                        >
                                            {s.name}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 11,
                                                color: "rgba(255,255,255,0.4)",
                                                margin: 0,
                                            }}
                                        >
                                            {s.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Music */}
                        <div style={{ marginBottom: 24 }}>
                            <h3
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "rgba(255,255,255,0.7)",
                                    margin: "0 0 12px",
                                }}
                            >
                                🎵 Nhạc nền
                            </h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(4, 1fr)",
                                    gap: 10,
                                }}
                            >
                                {MUSIC_OPTIONS.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() =>
                                            setMusic(m.id)
                                        }
                                        style={{
                                            padding: "10px 14px",
                                            borderRadius: 10,
                                            border:
                                                music === m.id
                                                    ? "2px solid #c084fc"
                                                    : "1px solid rgba(255,255,255,0.1)",
                                            background:
                                                music === m.id
                                                    ? "rgba(192,132,252,0.1)"
                                                    : "rgba(255,255,255,0.03)",
                                            cursor: "pointer",
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {m.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div style={{ marginBottom: 32 }}>
                            <h3
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "rgba(255,255,255,0.7)",
                                    margin: "0 0 12px",
                                }}
                            >
                                ⏱️ Thời lượng
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                }}
                            >
                                {["15", "30", "60"].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() =>
                                            setDuration(d)
                                        }
                                        style={{
                                            flex: 1,
                                            padding: "10px 14px",
                                            borderRadius: 10,
                                            border:
                                                duration === d
                                                    ? "2px solid #c084fc"
                                                    : "1px solid rgba(255,255,255,0.1)",
                                            background:
                                                duration === d
                                                    ? "rgba(192,132,252,0.1)"
                                                    : "rgba(255,255,255,0.03)",
                                            cursor: "pointer",
                                            color: "#fff",
                                            fontSize: 13,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {d}s
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={files.length < 3}
                            style={{
                                width: "100%",
                                padding: "16px 32px",
                                borderRadius: 14,
                                background:
                                    files.length >= 3
                                        ? "linear-gradient(135deg, #ff6b9d, #c084fc)"
                                        : "rgba(255,255,255,0.1)",
                                color:
                                    files.length >= 3
                                        ? "#fff"
                                        : "rgba(255,255,255,0.3)",
                                fontSize: 16,
                                fontWeight: 700,
                                border: "none",
                                cursor:
                                    files.length >= 3
                                        ? "pointer"
                                        : "not-allowed",
                                boxShadow:
                                    files.length >= 3
                                        ? "0 8px 24px rgba(255,107,157,0.35)"
                                        : "none",
                            }}
                        >
                            {files.length < 3
                                ? `📸 Cần thêm ${3 - files.length} ảnh nữa`
                                : `🎬 Tạo video (${files.length} ảnh · ${duration}s · ${STYLES.find((s) => s.id === style)?.name})`}
                        </button>

                        <p
                            style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.3)",
                                textAlign: "center",
                                marginTop: 12,
                            }}
                        >
                            ⚡ Video AI cần gói Basic/Premium · Thời gian
                            render: 1-5 phút
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
