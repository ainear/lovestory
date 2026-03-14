"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";

/* ══════════════════════════════════════════
   CraftRSVP — Guest confirmation form widget
   In editor: shows form preview. On published page: functional form.
   ══════════════════════════════════════════ */

export interface CraftRSVPProps {
    title: string;
    subtitle: string;
    accentColor: string;
    textColor: string;
    background: string;
    borderRadius: number;
}

export function CraftRSVP({
    title = "Xác nhận tham dự",
    subtitle = "Vui lòng xác nhận sự hiện diện của bạn",
    accentColor = "#ff6b9d",
    textColor = "#374151",
    background = "rgba(255,255,255,0.7)",
    borderRadius = 16,
}: CraftRSVPProps) {
    const { connectors: { connect, drag } } = useNode();
    const [name, setName] = useState("");
    const [attend, setAttend] = useState<"yes" | "no" | "">("");
    const [guests, setGuests] = useState("1");

    return (
        <div
            ref={(r) => { if (r) connect(drag(r)); }}
            style={{
                padding: 20, background, borderRadius,
                width: "100%", boxSizing: "border-box",
                display: "flex", flexDirection: "column", gap: 12,
            }}
        >
            {/* Header */}
            <p style={{
                fontSize: 18, fontWeight: 700, color: accentColor,
                margin: 0, textAlign: "center",
                fontFamily: "'Playfair Display', serif",
            }}>
                💌 {title}
            </p>
            <p style={{ fontSize: 12, color: textColor, margin: 0, textAlign: "center", opacity: 0.7 }}>
                {subtitle}
            </p>

            {/* Name */}
            <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={e => setName(e.target.value)}
                onClick={e => e.stopPropagation()}
                style={{
                    padding: "10px 14px", borderRadius: 10,
                    border: "1px solid #e5e7eb", fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    outline: "none", width: "100%", boxSizing: "border-box",
                }}
            />

            {/* Attendance */}
            <div style={{ display: "flex", gap: 8 }}>
                {[
                    { val: "yes", label: "✅ Tham dự", bg: attend === "yes" ? accentColor : "#f3f4f6", color: attend === "yes" ? "#fff" : textColor },
                    { val: "no", label: "❌ Vắng mặt", bg: attend === "no" ? "#9ca3af" : "#f3f4f6", color: attend === "no" ? "#fff" : textColor },
                ].map(opt => (
                    <button
                        key={opt.val}
                        onClick={(e) => { e.stopPropagation(); setAttend(opt.val as "yes" | "no"); }}
                        style={{
                            flex: 1, padding: "10px 8px", borderRadius: 10,
                            border: "none", cursor: "pointer",
                            background: opt.bg, color: opt.color,
                            fontSize: 12, fontWeight: 600,
                            transition: "all 0.15s",
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Guest count */}
            {attend === "yes" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: textColor }}>Số khách:</span>
                    <select
                        value={guests}
                        onChange={e => { e.stopPropagation(); setGuests(e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            padding: "6px 10px", borderRadius: 8,
                            border: "1px solid #e5e7eb", fontSize: 12,
                            flex: 1,
                        }}
                    >
                        {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n} người</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Submit (preview in editor) */}
            <button
                onClick={e => e.stopPropagation()}
                style={{
                    padding: "12px 20px", borderRadius: 24,
                    border: "none", cursor: "pointer",
                    background: accentColor, color: "#fff",
                    fontSize: 14, fontWeight: 700,
                    boxShadow: `0 2px 8px ${accentColor}40`,
                }}
            >
                Gửi xác nhận
            </button>
        </div>
    );
}

/* ── Settings Panel ── */
function CraftRSVPSettings() {
    const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props as CraftRSVPProps }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={labelStyle}>Tiêu đề</label>
            <input type="text" value={props.title}
                onChange={e => setProp((p: CraftRSVPProps) => { p.title = e.target.value; })}
                style={inputStyle} />
            <label style={labelStyle}>Phụ đề</label>
            <input type="text" value={props.subtitle}
                onChange={e => setProp((p: CraftRSVPProps) => { p.subtitle = e.target.value; })}
                style={inputStyle} />
            <label style={labelStyle}>Màu nhấn</label>
            <input type="color" value={props.accentColor}
                onChange={e => setProp((p: CraftRSVPProps) => { p.accentColor = e.target.value; })}
                style={{ ...inputStyle, height: 32, padding: 2 }} />
            <label style={labelStyle}>Màu chữ</label>
            <input type="color" value={props.textColor}
                onChange={e => setProp((p: CraftRSVPProps) => { p.textColor = e.target.value; })}
                style={{ ...inputStyle, height: 32, padding: 2 }} />
            <label style={labelStyle}>Bo góc</label>
            <input type="range" min={0} max={24} step={2}
                value={props.borderRadius}
                onChange={e => setProp((p: CraftRSVPProps) => { p.borderRadius = +e.target.value; })}
                style={inputStyle} />
        </div>
    );
}

const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#374151", margin: 0 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 };

CraftRSVP.craft = {
    displayName: "CraftRSVP",
    props: {
        title: "Xác nhận tham dự",
        subtitle: "Vui lòng xác nhận sự hiện diện của bạn",
        accentColor: "#ff6b9d",
        textColor: "#374151",
        background: "rgba(255,255,255,0.7)",
        borderRadius: 16,
    },
    related: { settings: CraftRSVPSettings },
};
