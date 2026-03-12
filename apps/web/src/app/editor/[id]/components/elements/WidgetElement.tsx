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

    // Generate calendar grid
    const firstDay = new Date(year, targetDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(year, targetDate.getMonth() + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
        <div style={{
            width: "100%", height: "100%",
            background: "#fff", borderRadius: 12 * scale,
            border: "1px solid #e5e7eb", padding: 12 * scale,
            fontFamily: "'Inter', sans-serif",
            display: "flex", flexDirection: "column",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
            <div style={{ textAlign: "center", marginBottom: 8 * scale }}>
                <p style={{ fontSize: 14 * scale, fontWeight: 700, color: "#374151", margin: 0, textTransform: "capitalize" }}>
                    {month} {year}
                </p>
                <p style={{ fontSize: 10 * scale, color: "#9ca3af", margin: "2px 0 0" }}>
                    {props.lunarDate || `${weekday}`}
                </p>
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1,
                fontSize: 8 * scale, textAlign: "center",
            }}>
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => (
                    <span key={d} style={{ fontWeight: 600, color: "#9ca3af", padding: 2 * scale }}>{d}</span>
                ))}
                {days.map((d, i) => (
                    <span key={i} style={{
                        padding: 2 * scale,
                        borderRadius: 999,
                        fontWeight: d === day ? 700 : 400,
                        background: d === day ? "#ff6b9d" : "transparent",
                        color: d === day ? "#fff" : d ? "#374151" : "transparent",
                    }}>{d ?? "."}</span>
                ))}
            </div>
        </div>
    );
}

// ── COUNTDOWN WIDGET ──
function CountdownWidget({ props, scale }: { props: CanvasElement["props"]; scale: number }) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const iv = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(iv);
    }, []);

    const target = props.targetDate ? new Date(props.targetDate).getTime() : Date.now() + 30 * 86400000;
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const blocks = [
        { value: days, label: "Ngày" },
        { value: hours, label: "Giờ" },
        { value: minutes, label: "Phút" },
        { value: seconds, label: "Giây" },
    ];

    return (
        <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
            borderRadius: 12 * scale, padding: 12 * scale,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 6 * scale,
        }}>
            <p style={{ fontSize: 11 * scale, fontWeight: 600, color: "#831843", margin: 0, letterSpacing: 1 }}>
                {props.label || "ĐẾM NGƯỢC NGÀY CƯỚI"}
            </p>
            <div style={{ display: "flex", gap: 8 * scale }}>
                {blocks.map(b => (
                    <div key={b.label} style={{
                        textAlign: "center", background: "#fff",
                        borderRadius: 8 * scale, padding: `${6 * scale}px ${10 * scale}px`,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)", minWidth: 48 * scale,
                    }}>
                        <p style={{ fontSize: 18 * scale, fontWeight: 800, color: "#e11d48", margin: 0 }}>
                            {String(b.value).padStart(2, "0")}
                        </p>
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
        <div style={{
            width: "100%", height: "100%",
            background: "#fff", borderRadius: 12 * scale,
            border: "1px solid #e5e7eb", overflow: "hidden",
            display: "flex", flexDirection: "column",
        }}>
            {/* Map Preview */}
            <div style={{
                flex: 1, background: "linear-gradient(135deg, #d1fae5, #ecfdf5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
            }}>
                <span style={{ fontSize: 32 * scale }}>📍</span>
                <div style={{
                    position: "absolute", bottom: 6, right: 6,
                    background: "rgba(0,0,0,0.5)", color: "#fff",
                    fontSize: 7 * scale, padding: `${2 * scale}px ${6 * scale}px`,
                    borderRadius: 4 * scale,
                }}>Google Maps</div>
            </div>
            {/* Info bar */}
            <div style={{ padding: `${8 * scale}px ${12 * scale}px`, background: "#fff" }}>
                <p style={{ fontSize: 11 * scale, fontWeight: 700, color: "#374151", margin: "0 0 2px" }}>
                    {props.venueName || props.label || "Vị trí tiệc cưới"}
                </p>
                <p style={{ fontSize: 9 * scale, color: "#9ca3af", margin: "0 0 6px" }}>
                    {props.venueAddress || "Nhấn để xem trên bản đồ"}
                </p>
                <button style={{
                    width: "100%", padding: `${6 * scale}px`,
                    borderRadius: 8 * scale, border: "none",
                    background: "#10b981", color: "#fff",
                    fontSize: 10 * scale, fontWeight: 700, cursor: "pointer",
                }}>🗺️ Chỉ đường</button>
            </div>
        </div>
    );
}

// ── MAIN WIDGET ELEMENT ──
export function WidgetElement({ element, zoom, isSelected, onSelect }: WidgetElementProps) {
    const scale = zoom / 100;
    const { x, y, width, height, opacity, rotation, props } = element;
    const widgetType = props.widgetType ?? "countdown";

    return (
        <div
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            style={{
                position: "absolute",
                left: x * scale, top: y * scale,
                width: width * scale, height: height * scale,
                opacity: opacity ?? 1,
                transform: rotation ? `rotate(${rotation}deg)` : undefined,
                cursor: "pointer",
                outline: isSelected ? "2px solid #3b82f6" : "none",
                outlineOffset: 2,
                transition: "outline 0.1s",
            }}
        >
            {widgetType === "calendar" && <CalendarWidget props={props} scale={scale} />}
            {widgetType === "countdown" && <CountdownWidget props={props} scale={scale} />}
            {widgetType === "map" && <MapWidget props={props} scale={scale} />}
            {/* Placeholder for other widget types */}
            {!["calendar", "countdown", "map"].includes(widgetType) && (
                <div style={{
                    width: "100%", height: "100%", background: "#f9fafb",
                    borderRadius: 12 * scale, border: "1px dashed #d1d5db",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12 * scale, color: "#9ca3af",
                }}>
                    {props.label || "Widget"}
                </div>
            )}
        </div>
    );
}
