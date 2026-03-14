"use client";

import React from "react";
import { useNode } from "@craftjs/core";

/* ══════════════════════════════════════════
   CraftMap — Google Maps embed + directions button
   ══════════════════════════════════════════ */

export interface CraftMapProps {
    address: string;
    venueName: string;
    lat: number;
    lng: number;
    zoom: number;
    height: number;
    borderRadius: number;
    accentColor: string;
}

export function CraftMap({
    address = "123 Nguyễn Huệ, Quận 1, TP.HCM",
    venueName = "Diamond Palace",
    lat = 10.7769,
    lng = 106.7009,
    zoom = 15,
    height = 200,
    borderRadius = 12,
    accentColor = "#ff6b9d",
}: CraftMapProps) {
    const { connectors: { connect, drag } } = useNode();
    const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    return (
        <div
            ref={(r) => { if (r) connect(drag(r)); }}
            style={{
                width: "100%", boxSizing: "border-box",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 12,
            }}
        >
            {/* Venue name */}
            <p style={{
                fontSize: 16, fontWeight: 700, color: "#374151",
                margin: 0, fontFamily: "'Playfair Display', serif",
                textAlign: "center",
            }}>
                📍 {venueName}
            </p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0, textAlign: "center" }}>
                {address}
            </p>

            {/* Map iframe */}
            <div style={{
                width: "100%", height, borderRadius,
                overflow: "hidden", border: "1px solid #e5e7eb",
            }}>
                <iframe
                    src={embedUrl}
                    width="100%"
                    height={height}
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Wedding venue map"
                />
            </div>

            {/* Directions button */}
            <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 24px", borderRadius: 24,
                    background: accentColor, color: "#fff",
                    fontSize: 13, fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: `0 2px 8px ${accentColor}40`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                🧭 Chỉ đường
            </a>
        </div>
    );
}

/* ── Settings Panel ── */
function CraftMapSettings() {
    const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props as CraftMapProps }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={labelStyle}>Tên nhà hàng</label>
            <input type="text" value={props.venueName}
                onChange={e => setProp((p: CraftMapProps) => { p.venueName = e.target.value; })}
                style={inputStyle} />
            <label style={labelStyle}>Địa chỉ</label>
            <input type="text" value={props.address}
                onChange={e => setProp((p: CraftMapProps) => { p.address = e.target.value; })}
                style={inputStyle} />
            <label style={labelStyle}>Vĩ độ (Lat)</label>
            <input type="number" step="0.0001" value={props.lat}
                onChange={e => setProp((p: CraftMapProps) => { p.lat = +e.target.value; })}
                style={inputStyle} />
            <label style={labelStyle}>Kinh độ (Lng)</label>
            <input type="number" step="0.0001" value={props.lng}
                onChange={e => setProp((p: CraftMapProps) => { p.lng = +e.target.value; })}
                style={inputStyle} />
            <label style={labelStyle}>Chiều cao map</label>
            <input type="range" min={120} max={350} step={10}
                value={props.height}
                onChange={e => setProp((p: CraftMapProps) => { p.height = +e.target.value; })}
                style={inputStyle} />
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{props.height}px</span>
            <label style={labelStyle}>Màu nút</label>
            <input type="color" value={props.accentColor}
                onChange={e => setProp((p: CraftMapProps) => { p.accentColor = e.target.value; })}
                style={{ ...inputStyle, height: 32, padding: 2 }} />
            <label style={labelStyle}>Bo góc</label>
            <input type="range" min={0} max={24} step={2}
                value={props.borderRadius}
                onChange={e => setProp((p: CraftMapProps) => { p.borderRadius = +e.target.value; })}
                style={inputStyle} />
        </div>
    );
}

const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#374151", margin: 0 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 };

CraftMap.craft = {
    displayName: "CraftMap",
    props: {
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        venueName: "Diamond Palace",
        lat: 10.7769,
        lng: 106.7009,
        zoom: 15,
        height: 200,
        borderRadius: 12,
        accentColor: "#ff6b9d",
    },
    related: { settings: CraftMapSettings },
};
