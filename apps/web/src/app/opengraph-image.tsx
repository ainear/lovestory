import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LoveStory — Thiệp cưới online & AI Video";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ fontSize: 80, marginBottom: 20 }}>❤️</div>
                <div
                    style={{
                        fontSize: 64,
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        backgroundClip: "text",
                        color: "transparent",
                        marginBottom: 16,
                    }}
                >
                    LoveStory
                </div>
                <div
                    style={{
                        fontSize: 28,
                        color: "rgba(255,255,255,0.7)",
                        maxWidth: 600,
                        textAlign: "center",
                        lineHeight: 1.4,
                    }}
                >
                    Thiệp cưới online đẹp trong 5 phút
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 24,
                        marginTop: 40,
                        fontSize: 20,
                        color: "rgba(255,255,255,0.5)",
                    }}
                >
                    <span>✨ 50+ mẫu thiệp</span>
                    <span>•</span>
                    <span>🎬 AI Video</span>
                    <span>•</span>
                    <span>💝 Miễn phí</span>
                </div>
            </div>
        ),
        { ...size }
    );
}
