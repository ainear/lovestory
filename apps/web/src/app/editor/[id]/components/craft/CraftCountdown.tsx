"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNode } from "@craftjs/core";

/* ══════════════════════════════════════════
   CraftCountdown — Live countdown timer
   Shows days/hours/minutes/seconds until target date
   ══════════════════════════════════════════ */

export interface CraftCountdownProps {
    targetDate: string; // ISO date string e.g. "2026-05-28"
    label: string;
    color: string;
    labelColor: string;
    background: string;
    borderRadius: number;
    fontSize: number;
}

function calcTimeLeft(target: string) {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export function CraftCountdown({
    targetDate = "2026-05-28",
    label = "Đếm ngược đến ngày cưới",
    color = "#831843",
    labelColor = "#9f1239",
    background = "rgba(255,255,255,0.6)",
    borderRadius = 16,
    fontSize = 28,
}: CraftCountdownProps) {
    const { connectors: { connect, drag } } = useNode();
    const [time, setTime] = useState(calcTimeLeft(targetDate));

    useEffect(() => {
        const timer = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const boxes = [
        { value: time.days, unit: "Ngày" },
        { value: time.hours, unit: "Giờ" },
        { value: time.minutes, unit: "Phút" },
        { value: time.seconds, unit: "Giây" },
    ];

    return (
        <div
            ref={(r) => { if (r) connect(drag(r)); }}
            style={{
                padding: 20,
                background,
                borderRadius,
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <p style={{
                fontSize: 14, fontWeight: 600, color: labelColor,
                margin: "0 0 12px", fontFamily: "'Playfair Display', serif",
                fontStyle: "italic", letterSpacing: 1,
            }}>
                {label}
            </p>
            <div style={{
                display: "flex", justifyContent: "center", gap: 12,
            }}>
                {boxes.map(b => (
                    <div key={b.unit} style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 4,
                    }}>
                        <span style={{
                            fontSize,
                            fontWeight: 700,
                            color,
                            fontFamily: "'Cormorant Garamond', serif",
                            lineHeight: 1,
                            minWidth: 48,
                        }}>
                            {String(b.value).padStart(2, "0")}
                        </span>
                        <span style={{
                            fontSize: 10, color: labelColor,
                            fontWeight: 500, textTransform: "uppercase",
                            letterSpacing: 1,
                        }}>
                            {b.unit}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Settings Panel ── */
function CraftCountdownSettings() {
    const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props as CraftCountdownProps }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={labelStyle}>Ngày mục tiêu</label>
            <input
                type="date"
                value={props.targetDate}
                onChange={e => setProp((p: CraftCountdownProps) => { p.targetDate = e.target.value; })}
                style={inputStyle}
            />
            <label style={labelStyle}>Tiêu đề</label>
            <input
                type="text"
                value={props.label}
                onChange={e => setProp((p: CraftCountdownProps) => { p.label = e.target.value; })}
                style={inputStyle}
            />
            <label style={labelStyle}>Màu số</label>
            <input
                type="color"
                value={props.color}
                onChange={e => setProp((p: CraftCountdownProps) => { p.color = e.target.value; })}
                style={{ ...inputStyle, height: 32, padding: 2 }}
            />
            <label style={labelStyle}>Màu nhãn</label>
            <input
                type="color"
                value={props.labelColor}
                onChange={e => setProp((p: CraftCountdownProps) => { p.labelColor = e.target.value; })}
                style={{ ...inputStyle, height: 32, padding: 2 }}
            />
            <label style={labelStyle}>Cỡ chữ số</label>
            <input
                type="range" min={18} max={48} step={2}
                value={props.fontSize}
                onChange={e => setProp((p: CraftCountdownProps) => { p.fontSize = +e.target.value; })}
                style={inputStyle}
            />
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{props.fontSize}px</span>
            <label style={labelStyle}>Bo góc</label>
            <input
                type="range" min={0} max={24} step={2}
                value={props.borderRadius}
                onChange={e => setProp((p: CraftCountdownProps) => { p.borderRadius = +e.target.value; })}
                style={inputStyle}
            />
        </div>
    );
}

const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#374151", margin: 0 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 };

CraftCountdown.craft = {
    displayName: "CraftCountdown",
    props: {
        targetDate: "2026-05-28",
        label: "Đếm ngược đến ngày cưới",
        color: "#831843",
        labelColor: "#9f1239",
        background: "rgba(255,255,255,0.6)",
        borderRadius: 16,
        fontSize: 28,
    },
    related: { settings: CraftCountdownSettings },
};
