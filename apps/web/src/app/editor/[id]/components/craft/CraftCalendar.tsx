"use client";

import React from "react";
import { useNode } from "@craftjs/core";

/* ══════════════════════════════════════════
   CraftCalendar — Visual calendar with highlighted date
   Shows month grid with heart on wedding date
   ══════════════════════════════════════════ */

export interface CraftCalendarProps {
    targetDate: string; // e.g. "2026-05-28"
    accentColor: string;
    textColor: string;
    background: string;
    borderRadius: number;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS_VI = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

function getCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon-based offset
    const days: (number | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
}

export function CraftCalendar({
    targetDate = "2026-05-28",
    accentColor = "#ff6b9d",
    textColor = "#374151",
    background = "rgba(255,255,255,0.7)",
    borderRadius = 16,
}: CraftCalendarProps) {
    const { connectors: { connect, drag } } = useNode();
    const d = new Date(targetDate);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const days = getCalendarDays(year, month);

    return (
        <div
            ref={(r) => { if (r) connect(drag(r)); }}
            style={{
                padding: 16, background, borderRadius,
                width: "100%", boxSizing: "border-box", maxWidth: 320,
                margin: "0 auto",
            }}
        >
            {/* Month/Year header */}
            <p style={{
                textAlign: "center", margin: "0 0 12px",
                fontSize: 16, fontWeight: 700, color: accentColor,
                fontFamily: "'Playfair Display', serif",
            }}>
                {MONTHS_VI[month]} {year}
            </p>

            {/* Weekday headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                {WEEKDAYS.map(w => (
                    <div key={w} style={{
                        textAlign: "center", fontSize: 9, fontWeight: 700,
                        color: accentColor, padding: "4px 0",
                        textTransform: "uppercase", letterSpacing: 1,
                    }}>
                        {w}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {days.map((d, i) => {
                    const isTarget = d === day;
                    return (
                        <div key={i} style={{
                            textAlign: "center", padding: "6px 0", fontSize: 12,
                            color: isTarget ? "#fff" : d ? textColor : "transparent",
                            fontWeight: isTarget ? 700 : 400,
                            background: isTarget ? accentColor : "transparent",
                            borderRadius: isTarget ? "50%" : 0,
                            position: "relative",
                        }}>
                            {d ?? ""}
                            {isTarget && (
                                <span style={{
                                    position: "absolute", top: -6, right: -2,
                                    fontSize: 10,
                                }}>
                                    ❤️
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ── Settings Panel ── */
function CraftCalendarSettings() {
    const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props as CraftCalendarProps }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={labelStyle}>Ngày cưới</label>
            <input type="date" value={props.targetDate}
                onChange={e => setProp((p: CraftCalendarProps) => { p.targetDate = e.target.value; })}
                style={inputStyle} />
            <label style={labelStyle}>Màu nhấn</label>
            <input type="color" value={props.accentColor}
                onChange={e => setProp((p: CraftCalendarProps) => { p.accentColor = e.target.value; })}
                style={{ ...inputStyle, height: 32, padding: 2 }} />
            <label style={labelStyle}>Màu chữ</label>
            <input type="color" value={props.textColor}
                onChange={e => setProp((p: CraftCalendarProps) => { p.textColor = e.target.value; })}
                style={{ ...inputStyle, height: 32, padding: 2 }} />
            <label style={labelStyle}>Bo góc</label>
            <input type="range" min={0} max={24} step={2}
                value={props.borderRadius}
                onChange={e => setProp((p: CraftCalendarProps) => { p.borderRadius = +e.target.value; })}
                style={inputStyle} />
        </div>
    );
}

const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#374151", margin: 0 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 };

CraftCalendar.craft = {
    displayName: "CraftCalendar",
    props: {
        targetDate: "2026-05-28",
        accentColor: "#ff6b9d",
        textColor: "#374151",
        background: "rgba(255,255,255,0.7)",
        borderRadius: 16,
    },
    related: { settings: CraftCalendarSettings },
};
