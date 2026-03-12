"use client";

import { useEffect, useState } from "react";
import type { CanvasElement } from "../useCanvasReducer";

interface WidgetElementProps {
    element: CanvasElement;
    zoom: number;
    isSelected: boolean;
    onSelect: () => void;
}

// ── CALENDAR WIDGET ──
function CalendarWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    const targetDate = props.targetDate ? new Date(props.targetDate) : new Date();
    const month = targetDate.toLocaleString("vi-VN", { month: "long" });
    const year = targetDate.getFullYear();
    const day = targetDate.getDate();
    const weekday = targetDate.toLocaleString("vi-VN", { weekday: "long" });
    const firstDay = new Date(year, targetDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(year, targetDate.getMonth() + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
        <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 12 * scale, border: "1px solid #e5e7eb", padding: 12 * scale, fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: 8 * scale }}>
                <p style={{ fontSize: 14 * scale, fontWeight: 700, color: "#374151", margin: 0, textTransform: "capitalize" }}>{month} {year}</p>
                <p style={{ fontSize: 10 * scale, color: "#9ca3af", margin: "2px 0 0" }}>{props.lunarDate || weekday}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, fontSize: 8 * scale, textAlign: "center" }}>
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => (
                    <span key={d} style={{ fontWeight: 600, color: "#9ca3af", padding: 2 * scale }}>{d}</span>
                ))}
                {days.map((d, i) => (
                    <span key={i} style={{ padding: 2 * scale, borderRadius: 999, fontWeight: d === day ? 700 : 400, background: d === day ? "#ff6b9d" : "transparent", color: d === day ? "#fff" : d ? "#374151" : "transparent" }}>{d ?? "."}</span>
                ))}
            </div>
        </div>
    );
}

// ── COUNTDOWN WIDGET ──
function CountdownWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => { const iv = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(iv); }, []);
    const target = props.targetDate ? new Date(props.targetDate).getTime() : Date.now() + 30 * 86400000;
    const diff = Math.max(0, target - now);
    const blocks = [
        { value: Math.floor(diff / 86400000), label: "Ngày" },
        { value: Math.floor((diff % 86400000) / 3600000), label: "Giờ" },
        { value: Math.floor((diff % 3600000) / 60000), label: "Phút" },
        { value: Math.floor((diff % 60000) / 1000), label: "Giây" },
    ];
    return (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fdf2f8, #fce7f3)", borderRadius: 12 * scale, padding: 12 * scale, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 * scale }}>
            <p style={{ fontSize: 11 * scale, fontWeight: 600, color: "#831843", margin: 0, letterSpacing: 1 }}>{props.label || "ĐẾM NGƯỢC NGÀY CƯỚI"}</p>
            <div style={{ display: "flex", gap: 8 * scale }}>
                {blocks.map(b => (
                    <div key={b.label} style={{ textAlign: "center", background: "#fff", borderRadius: 8 * scale, padding: `${6 * scale}px ${10 * scale}px`, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", minWidth: 48 * scale }}>
                        <p style={{ fontSize: 18 * scale, fontWeight: 800, color: "#e11d48", margin: 0 }}>{String(b.value).padStart(2, "0")}</p>
                        <p style={{ fontSize: 8 * scale, color: "#9ca3af", margin: 0 }}>{b.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── MAP WIDGET ──
function MapWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    return (
        <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 12 * scale, border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, background: "linear-gradient(135deg, #d1fae5, #ecfdf5)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: 32 * scale }}>📍</span>
                <div style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 7 * scale, padding: `${2 * scale}px ${6 * scale}px`, borderRadius: 4 * scale }}>Google Maps</div>
            </div>
            <div style={{ padding: `${8 * scale}px ${12 * scale}px`, background: "#fff" }}>
                <p style={{ fontSize: 11 * scale, fontWeight: 700, color: "#374151", margin: "0 0 2px" }}>{props.venueName || props.label || "Vị trí tiệc cưới"}</p>
                <p style={{ fontSize: 9 * scale, color: "#9ca3af", margin: "0 0 6px" }}>{props.venueAddress || "Nhấn để xem trên bản đồ"}</p>
                <button style={{ width: "100%", padding: `${6 * scale}px`, borderRadius: 8 * scale, border: "none", background: "#10b981", color: "#fff", fontSize: 10 * scale, fontWeight: 700, cursor: "pointer" }}>🗺️ Chỉ đường</button>
            </div>
        </div>
    );
}

// ── RSVP WIDGET ──
function RSVPWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    return (
        <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 12 * scale, border: "1px solid #e5e7eb", padding: 14 * scale, display: "flex", flexDirection: "column", gap: 8 * scale, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 13 * scale, fontWeight: 700, color: "#374151", margin: 0 }}>{props.rsvpTitle || "Xác nhận tham dự"}</p>
                <p style={{ fontSize: 9 * scale, color: "#9ca3af", margin: `${2 * scale}px 0 0` }}>{props.rsvpSubtitle || "Vui lòng xác nhận sự hiện diện của bạn"}</p>
            </div>
            <input type="text" placeholder="Họ và tên" readOnly style={{ width: "100%", padding: `${7 * scale}px ${10 * scale}px`, border: "1px solid #e5e7eb", borderRadius: 8 * scale, fontSize: 10 * scale, outline: "none", background: "#f9fafb", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 6 * scale }}>
                {["Tham dự", "Không thể"].map(opt => (
                    <button key={opt} style={{ flex: 1, padding: `${6 * scale}px`, borderRadius: 8 * scale, border: "1px solid #e5e7eb", background: opt === "Tham dự" ? "#ecfdf5" : "#fff", fontSize: 9 * scale, fontWeight: 600, cursor: "pointer", color: opt === "Tham dự" ? "#10b981" : "#6b7280" }}>{opt}</button>
                ))}
            </div>
            <button style={{ width: "100%", padding: `${7 * scale}px`, borderRadius: 8 * scale, border: "none", background: "#ff6b9d", color: "#fff", fontSize: 10 * scale, fontWeight: 700, cursor: "pointer" }}>Gửi xác nhận 💌</button>
        </div>
    );
}

// ── QR WIDGET ──
function QRWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    return (
        <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 12 * scale, border: "1px solid #e5e7eb", padding: 12 * scale, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 * scale, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 10 * scale, fontWeight: 600, color: "#374151", margin: 0 }}>{props.label || "Quét mã QR"}</p>
            <div style={{ width: 80 * scale, height: 80 * scale, background: "#f9fafb", borderRadius: 8 * scale, border: "2px solid #e5e7eb", display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, padding: 6 * scale, boxSizing: "border-box" }}>
                {Array.from({ length: 49 }).map((_, i) => (
                    <div key={i} style={{ background: [0,1,2,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,46,47,48].includes(i) ? "#374151" : "transparent", borderRadius: 1 }} />
                ))}
            </div>
            {props.bankName && (
                <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 8 * scale, color: "#6b7280", margin: 0 }}>{props.bankName}</p>
                    <p style={{ fontSize: 9 * scale, fontWeight: 600, color: "#374151", margin: 0 }}>{props.accountNumber}</p>
                    <p style={{ fontSize: 8 * scale, color: "#9ca3af", margin: 0 }}>{props.accountName}</p>
                </div>
            )}
        </div>
    );
}

// ── GIFT/ENVELOPE WIDGET ──
function GiftWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    return (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fef3c7, #fefde8)", borderRadius: 12 * scale, padding: 14 * scale, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 * scale, border: "1px solid #fcd34d" }}>
            <span style={{ fontSize: 24 * scale }}>💰</span>
            <p style={{ fontSize: 12 * scale, fontWeight: 700, color: "#92400e", margin: 0 }}>{props.label || "Phong bì mừng cưới"}</p>
            {props.bankName && (
                <div style={{ background: "#fff", borderRadius: 8 * scale, padding: `${6 * scale}px ${12 * scale}px`, textAlign: "center", width: "100%", boxSizing: "border-box" }}>
                    <p style={{ fontSize: 9 * scale, color: "#6b7280", margin: 0 }}>{props.bankName}</p>
                    <p style={{ fontSize: 11 * scale, fontWeight: 700, color: "#374151", margin: "2px 0", letterSpacing: 1 }}>{props.accountNumber || "0123456789"}</p>
                    <p style={{ fontSize: 9 * scale, color: "#9ca3af", margin: 0 }}>{props.accountName || "NGUYEN VAN A"}</p>
                </div>
            )}
        </div>
    );
}

// ── YOUTUBE WIDGET ──
function YouTubeWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    const url = props.youtubeUrl ?? "";
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = match?.[1];
    return (
        <div style={{ width: "100%", height: "100%", background: "#000", borderRadius: 12 * scale, overflow: "hidden", position: "relative" }}>
            {videoId ? (
                <div style={{ width: "100%", height: "100%", background: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg) center/cover`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 48 * scale, height: 34 * scale, background: "rgba(255,0,0,0.9)", borderRadius: 8 * scale, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 0, height: 0, borderTop: `${8 * scale}px solid transparent`, borderBottom: `${8 * scale}px solid transparent`, borderLeft: `${14 * scale}px solid #fff`, marginLeft: 3 * scale }} />
                    </div>
                </div>
            ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 * scale, color: "#9ca3af" }}>
                    <span style={{ fontSize: 28 * scale }}>▶️</span>
                    <p style={{ fontSize: 10 * scale, margin: 0 }}>{props.label || "Dán link YouTube"}</p>
                </div>
            )}
        </div>
    );
}

// ── CALL BUTTON WIDGET (Sprint 33 — Cinelove parity) ──
function CallWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    return (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderRadius: 12 * scale, border: "1px solid #6ee7b7", padding: 14 * scale, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 * scale }}>
            <span style={{ fontSize: 28 * scale }}>📞</span>
            <p style={{ fontSize: 12 * scale, fontWeight: 700, color: "#065f46", margin: 0 }}>{props.label || "Liên hệ cô/chú rể"}</p>
            <p style={{ fontSize: 10 * scale, color: "#059669", margin: 0, fontWeight: 600 }}>{props.phoneNumber || "0909 xxx xxx"}</p>
            <button style={{ padding: `${7 * scale}px ${20 * scale}px`, borderRadius: 99, border: "none", background: "#10b981", color: "#fff", fontSize: 10 * scale, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 * scale }}>📱 Gọi ngay</button>
        </div>
    );
}

// ── ALBUM WIDGET (Sprint 35 — Cinelove parity) ──
function AlbumWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    const images = (props.albumImages || "").split(",").filter(Boolean);
    return (
        <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 12 * scale, border: "1px solid #e5e7eb", padding: 10 * scale, display: "flex", flexDirection: "column", gap: 6 * scale, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 11 * scale, fontWeight: 700, color: "#374151", margin: 0, textAlign: "center" }}>{props.label || "Album ảnh cưới"}</p>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 * scale, overflow: "hidden" }}>
                {(images.length > 0 ? images : ["📷", "📷", "📷", "📷"]).map((img, i) => (
                    <div key={i} style={{ background: "linear-gradient(135deg, #fdf2f8, #fce7f3)", borderRadius: 6 * scale, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", aspectRatio: "1" }}>
                        {img.startsWith("http") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <span style={{ fontSize: 20 * scale, opacity: 0.4 }}>{img}</span>
                        )}
                    </div>
                ))}
            </div>
            <p style={{ fontSize: 8 * scale, color: "#9ca3af", margin: 0, textAlign: "center" }}>Vuốt để xem thêm ảnh</p>
        </div>
    );
}

// ── GUEST NAME WIDGET (Sprint 35 — Cinelove parity) ──
function GuestNameWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    return (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fdf2f8, #faf5ff)", borderRadius: 12 * scale, border: "1px dashed #d946ef", padding: 14 * scale, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 * scale }}>
            <span style={{ fontSize: 24 * scale }}>👤</span>
            <p style={{ fontSize: 10 * scale, fontWeight: 600, color: "#9333ea", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>{props.guestNameLabel || "Trân trọng kính mời"}</p>
            <p style={{ fontSize: 16 * scale, fontWeight: 800, color: "#7c3aed", margin: 0, fontStyle: "italic" }}>Tên khách mời</p>
            <p style={{ fontSize: 8 * scale, color: "#a78bfa", margin: 0 }}>Tên sẽ tự động thay đổi khi gửi thiệp</p>
        </div>
    );
}

// ── MAIN WIDGET ELEMENT ──
export function WidgetElement({ element, zoom, isSelected, onSelect }: WidgetElementProps) {
    const scale = zoom / 100;
    const { x, y, width, height, opacity, rotation, props } = element;
    const wt = props.widgetType ?? "countdown";
    return (
        <div data-element-id={element.id} onClick={(e) => { e.stopPropagation(); onSelect(); }} style={{ position: "absolute", left: x * scale, top: y * scale, width: width * scale, height: height * scale, opacity: opacity ?? 1, transform: rotation ? `rotate(${rotation}deg)` : undefined, cursor: "pointer", outline: isSelected ? "2px solid #3b82f6" : "none", outlineOffset: 2, transition: "outline 0.1s" }}>
            {wt === "calendar" && <CalendarWidget props={props} scale={scale} />}
            {wt === "countdown" && <CountdownWidget props={props} scale={scale} />}
            {wt === "map" && <MapWidget props={props} scale={scale} />}
            {wt === "rsvp" && <RSVPWidget props={props} scale={scale} />}
            {wt === "qr" && <QRWidget props={props} scale={scale} />}
            {wt === "gift" && <GiftWidget props={props} scale={scale} />}
            {wt === "youtube" && <YouTubeWidget props={props} scale={scale} />}
            {wt === "call" && <CallWidget props={props} scale={scale} />}
            {wt === "album" && <AlbumWidget props={props} scale={scale} />}
            {wt === "guestname" && <GuestNameWidget props={props} scale={scale} />}
        </div>
    );
}
