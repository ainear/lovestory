"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";

// Template canvas presets — match the visual editor's background list
const TEMPLATE_CANVAS_PRESETS: Record<string, {
    bg: string;
    elements: Array<{
        type: "text";
        text: string;
        x: number; y: number;
        width: number; height: number;
        fontSize: number;
        fontFamily: string;
        fontWeight: "normal" | "bold";
        fontStyle: "normal" | "italic";
        color: string;
        textAlign: "left" | "center" | "right";
        lineHeight: number;
    }>;
}> = {
    "rose-garden": {
        bg: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
        elements: [
            { type: "text", text: "✿ ❀ ✿", x: 20, y: 60, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#be185d", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Trân trọng kính mời", x: 20, y: 120, width: 350, height: 40, fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#9f1239", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 175, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#831843", textAlign: "center", lineHeight: 1.3 },
            { type: "text", text: "cùng gia đình hai bên\nân hạnh kính mời", x: 20, y: 260, width: 350, height: 60, fontSize: 14, fontFamily: "'Lora', serif", fontWeight: "normal", fontStyle: "italic", color: "#9f1239", textAlign: "center", lineHeight: 1.6 },
            { type: "text", text: "ngày 28 · tháng 05 · năm 2026", x: 20, y: 340, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#78350f", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "lúc 10:00 sáng", x: 20, y: 390, width: 350, height: 36, fontSize: 15, fontFamily: "'Lora', serif", fontWeight: "normal", fontStyle: "italic", color: "#831843", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Trung tâm Tiệc cưới Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM", x: 20, y: 440, width: 350, height: 60, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#374151", textAlign: "center", lineHeight: 1.6 },
            { type: "text", text: "❀ ✿ ❀", x: 20, y: 520, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#be185d", textAlign: "center", lineHeight: 1.4 },
        ],
    },
    "midnight-romance": {
        bg: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)",
        elements: [
            { type: "text", text: "☆ ✧ ☆", x: 20, y: 60, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#c084fc", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "We joyfully invite you to celebrate", x: 20, y: 110, width: 350, height: 36, fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#e9d5ff", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 160, width: 350, height: 70, fontSize: 32, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#f5f3ff", textAlign: "center", lineHeight: 1.3 },
            { type: "text", text: "28 · 05 · 2026", x: 20, y: 250, width: 350, height: 44, fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#c084fc", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Diamond Palace Ballroom\nTP. Hồ Chí Minh", x: 20, y: 310, width: 350, height: 56, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#e9d5ff", textAlign: "center", lineHeight: 1.6 },
            { type: "text", text: "✧ ☆ ✧", x: 20, y: 390, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#c084fc", textAlign: "center", lineHeight: 1.4 },
        ],
    },
    "golden-hour": {
        bg: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)",
        elements: [
            { type: "text", text: "❋ ✤ ❋", x: 20, y: 60, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#d97706", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#92400e", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#78350f", textAlign: "center", lineHeight: 1.3 },
            { type: "text", text: "28 · tháng 05 · 2026  |  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#b45309", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Diamond Palace, TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#44403c", textAlign: "center", lineHeight: 1.5 },
            { type: "text", text: "✤ ❋ ✤", x: 20, y: 365, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#d97706", textAlign: "center", lineHeight: 1.4 },
        ],
    },
    "cherry-blossom": {
        bg: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)",
        elements: [
            { type: "text", text: "❀ 🌸 ❀", x: 20, y: 60, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#ec4899", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#9d174d", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#831843", textAlign: "center", lineHeight: 1.3 },
            { type: "text", text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#9d174d", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Diamond Palace  •  TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#374151", textAlign: "center", lineHeight: 1.5 },
            { type: "text", text: "🌸 ❀ 🌸", x: 20, y: 365, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#ec4899", textAlign: "center", lineHeight: 1.4 },
        ],
    },
    // ── Sprint 9: 8 New Templates ──
    "ocean-breeze": {
        bg: "linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 100%)",
        elements: [
            { type: "text" as const, text: "🌊 ～ 🌊", x: 20, y: 60, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#0e7490", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#155e75", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#0c4a6e", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#0e7490", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  •  TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "～ 🌊 ～", x: 20, y: 365, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#0e7490", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "forest-green": {
        bg: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 100%)",
        elements: [
            { type: "text" as const, text: "🌿 ✦ 🌿", x: 20, y: 60, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#15803d", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#166534", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#14532d", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#15803d", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  •  TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "✦ 🌿 ✦", x: 20, y: 365, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#15803d", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "lavender-dream": {
        bg: "linear-gradient(180deg, #faf5ff 0%, #f3e8ff 30%, #e9d5ff 100%)",
        elements: [
            { type: "text" as const, text: "✿ 💜 ✿", x: 20, y: 60, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#7c3aed", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#6d28d9", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#4c1d95", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#7c3aed", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  •  TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "💜 ✿ 💜", x: 20, y: 365, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#7c3aed", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "red-passion": {
        bg: "linear-gradient(180deg, #fff1f2 0%, #ffe4e6 30%, #fecdd3 100%)",
        elements: [
            { type: "text" as const, text: "❤ ✦ ❤", x: 20, y: 60, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#dc2626", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#b91c1c", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#7f1d1d", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#b91c1c", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  •  TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "✦ ❤ ✦", x: 20, y: 365, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#dc2626", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "vintage-ivory": {
        bg: "linear-gradient(180deg, #fefce8 0%, #fef9c3 30%, #fef08a 100%)",
        elements: [
            { type: "text" as const, text: "❧ ⁕ ❧", x: 20, y: 60, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#92400e", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "~ Thiệp Mời Cưới ~", x: 20, y: 110, width: 350, height: 36, fontSize: 14, fontFamily: "'Cormorant Garamond', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#78350f", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 158, width: 350, height: 70, fontSize: 34, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#44403c", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "Ngày 28 tháng 05 năm 2026", x: 20, y: 243, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#92400e", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace, Tp. Hồ Chí Minh", x: 20, y: 300, width: 350, height: 40, fontSize: 14, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#57534e", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "⁕ ❧ ⁕", x: 20, y: 360, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#92400e", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "modern-black": {
        bg: "linear-gradient(180deg, #111827 0%, #1f2937 50%, #111827 100%)",
        elements: [
            { type: "text" as const, text: "— ◆ —", x: 20, y: 70, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#f59e0b", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "WEDDING INVITATION", x: 20, y: 118, width: 350, height: 36, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#d1d5db", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#f9fafb", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "28 · 05 · 2026", x: 20, y: 248, width: 350, height: 44, fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#f59e0b", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "10:00 AM  |  Diamond Palace, TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#9ca3af", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "— ◆ —", x: 20, y: 365, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#f59e0b", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "sunset-coral": {
        bg: "linear-gradient(180deg, #fff7ed 0%, #fed7aa 40%, #fdba74 100%)",
        elements: [
            { type: "text" as const, text: "🌅 ~ 🌅", x: 20, y: 60, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#c2410c", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#9a3412", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#7c2d12", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#c2410c", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  •  TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "~ 🌅 ~", x: 20, y: 365, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#c2410c", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "pearl-white": {
        bg: "linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
        elements: [
            { type: "text" as const, text: "◇ ◈ ◇", x: 20, y: 60, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#64748b", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "THIỆP MỜI CƯỚI", x: 20, y: 113, width: 350, height: 36, fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#94a3b8", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 158, width: 350, height: 70, fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#1e293b", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "∙ 28 · 05 · 2026 ∙", x: 20, y: 243, width: 350, height: 44, fontSize: 20, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#475569", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  •  TP. Hồ Chí Minh", x: 20, y: 300, width: 350, height: 40, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#64748b", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "◈ ◇ ◈", x: 20, y: 360, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#64748b", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    // ── Sprint 48: 12 New Cinelove-inspired Templates ──
    "tropical-breeze": {
        bg: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%)",
        elements: [
            { type: "text" as const, text: "🌴 ✦ 🌴", x: 20, y: 55, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#047857", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "WEDDING INVITATION", x: 20, y: 105, width: 350, height: 30, fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#065f46", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể", x: 20, y: 145, width: 350, height: 50, fontSize: 36, fontFamily: "'Great Vibes', cursive", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#064e3b", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "&", x: 20, y: 200, width: 350, height: 40, fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#059669", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Tên Cô Dâu", x: 20, y: 242, width: 350, height: 50, fontSize: 36, fontFamily: "'Great Vibes', cursive", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#064e3b", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 AM", x: 20, y: 310, width: 350, height: 40, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#047857", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 360, width: 350, height: 35, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "✦ 🌴 ✦", x: 20, y: 410, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#047857", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "rustic-barn": {
        bg: "linear-gradient(180deg, #fef3e2 0%, #fde68a 30%, #fcd34d 100%)",
        elements: [
            { type: "text" as const, text: "🌾 ∼ 🌾", x: 20, y: 55, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#92400e", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Together with their families", x: 20, y: 105, width: 350, height: 30, fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#78350f", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể", x: 20, y: 148, width: 350, height: 48, fontSize: 34, fontFamily: "'Amatic SC', cursive", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#451a03", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "♥", x: 20, y: 200, width: 350, height: 35, fontSize: 24, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#b45309", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Tên Cô Dâu", x: 20, y: 238, width: 350, height: 48, fontSize: 34, fontFamily: "'Amatic SC', cursive", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#451a03", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Ngày 28 tháng 05 năm 2026", x: 20, y: 305, width: 350, height: 40, fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#92400e", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 355, width: 350, height: 35, fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#57534e", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "∼ 🌾 ∼", x: 20, y: 405, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#92400e", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "luxury-gold": {
        bg: "linear-gradient(180deg, #1c1917 0%, #292524 40%, #1c1917 100%)",
        elements: [
            { type: "text" as const, text: "❖ ✦ ❖", x: 20, y: 60, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#fbbf24", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "YOU ARE INVITED TO CELEBRATE", x: 20, y: 108, width: 350, height: 30, fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#d4d4d8", textAlign: "center" as const, lineHeight: 1.6 },
            { type: "text" as const, text: "Tên Chú Rể", x: 20, y: 150, width: 350, height: 50, fontSize: 38, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#fef3c7", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "&", x: 20, y: 205, width: 350, height: 35, fontSize: 26, fontFamily: "'Dancing Script', cursive", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#fbbf24", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Tên Cô Dâu", x: 20, y: 245, width: 350, height: 50, fontSize: 38, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#fef3c7", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "28 · 05 · 2026", x: 20, y: 315, width: 350, height: 40, fontSize: 20, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#fbbf24", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "10:00 AM  |  Diamond Palace, TP.HCM", x: 20, y: 365, width: 350, height: 35, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#a8a29e", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "✦ ❖ ✦", x: 20, y: 415, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#fbbf24", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "sage-garden": {
        bg: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%)",
        elements: [
            { type: "text" as const, text: "🌿 ❋ 🌿", x: 20, y: 55, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#4d7c0f", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Trân trọng kính mời", x: 20, y: 110, width: 350, height: 30, fontSize: 14, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#365314", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 155, width: 350, height: 65, fontSize: 32, fontFamily: "'Great Vibes', cursive", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#1a2e05", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "cùng gia đình hai bên\nân hạnh kính mời quý khách", x: 20, y: 235, width: 350, height: 55, fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#4d7c0f", textAlign: "center" as const, lineHeight: 1.6 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 310, width: 350, height: 40, fontSize: 17, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#365314", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 360, width: 350, height: 35, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "❋ 🌿 ❋", x: 20, y: 410, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#4d7c0f", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "dusty-blue": {
        bg: "linear-gradient(180deg, #eff6ff 0%, #dbeafe 40%, #bfdbfe 100%)",
        elements: [
            { type: "text" as const, text: "✧ ◆ ✧", x: 20, y: 60, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#2563eb", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "SAVE THE DATE", x: 20, y: 108, width: 350, height: 30, fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#3b82f6", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể", x: 20, y: 148, width: 350, height: 48, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#1e3a5f", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "&", x: 20, y: 200, width: 350, height: 35, fontSize: 26, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#2563eb", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Tên Cô Dâu", x: 20, y: 240, width: 350, height: 48, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#1e3a5f", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "28 tháng 05 năm 2026  ·  10:00", x: 20, y: 310, width: 350, height: 40, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#1d4ed8", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 360, width: 350, height: 35, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#6b7280", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "◆ ✧ ◆", x: 20, y: 410, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#2563eb", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "burgundy-wine": {
        bg: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 100%)",
        elements: [
            { type: "text" as const, text: "✿ ❧ ✿", x: 20, y: 55, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#881337", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Thiệp mời cưới", x: 20, y: 108, width: 350, height: 30, fontSize: 14, fontFamily: "'Cormorant Garamond', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#9f1239", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể", x: 20, y: 148, width: 350, height: 48, fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#4c0519", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "❤", x: 20, y: 200, width: 350, height: 30, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#e11d48", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Tên Cô Dâu", x: 20, y: 235, width: 350, height: 48, fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#4c0519", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 305, width: 350, height: 40, fontSize: 17, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#881337", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 355, width: 350, height: 35, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "❧ ✿ ❧", x: 20, y: 405, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#881337", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "blush-romance": {
        bg: "linear-gradient(180deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)",
        elements: [
            { type: "text" as const, text: "♡ ✧ ♡", x: 20, y: 55, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#f43f5e", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "We Are Getting Married", x: 20, y: 108, width: 350, height: 30, fontSize: 13, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#e11d48", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 150, width: 350, height: 70, fontSize: 32, fontFamily: "'Great Vibes', cursive", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#9f1239", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "cùng gia đình hai bên\nân hạnh kính mời", x: 20, y: 235, width: 350, height: 50, fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#be123c", textAlign: "center" as const, lineHeight: 1.6 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  lúc 10:00 sáng", x: 20, y: 305, width: 350, height: 40, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#e11d48", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 355, width: 350, height: 35, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#6b7280", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "✧ ♡ ✧", x: 20, y: 405, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#f43f5e", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "mocha-elegance": {
        bg: "linear-gradient(180deg, #faf5f0 0%, #f5ebe0 40%, #edddcf 100%)",
        elements: [
            { type: "text" as const, text: "❋ ◈ ❋", x: 20, y: 60, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#78350f", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "THIỆP MỜI CƯỚI", x: 20, y: 108, width: 350, height: 30, fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#92400e", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể", x: 20, y: 148, width: 350, height: 48, fontSize: 34, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#44403c", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "∞", x: 20, y: 200, width: 350, height: 35, fontSize: 28, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#a16207", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Tên Cô Dâu", x: 20, y: 240, width: 350, height: 48, fontSize: 34, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#44403c", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00", x: 20, y: 308, width: 350, height: 40, fontSize: 17, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#78350f", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 358, width: 350, height: 35, fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#57534e", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "◈ ❋ ◈", x: 20, y: 408, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#78350f", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "mint-fresh": {
        bg: "linear-gradient(180deg, #f0fdfa 0%, #ccfbf1 40%, #99f6e4 100%)",
        elements: [
            { type: "text" as const, text: "❀ ✿ ❀", x: 20, y: 55, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#0d9488", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Trân trọng kính mời", x: 20, y: 110, width: 350, height: 30, fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#134e4a", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 155, width: 350, height: 70, fontSize: 32, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#042f2e", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "cùng gia đình hai bên\nân hạnh kính mời quý khách", x: 20, y: 240, width: 350, height: 50, fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#115e59", textAlign: "center" as const, lineHeight: 1.6 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 310, width: 350, height: 40, fontSize: 17, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#0d9488", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 360, width: 350, height: 35, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "✿ ❀ ✿", x: 20, y: 410, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#0d9488", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "rose-gold": {
        bg: "linear-gradient(180deg, #1c1917 0%, #1a1615 50%, #0f0d0c 100%)",
        elements: [
            { type: "text" as const, text: "— ✦ —", x: 20, y: 60, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#f59e0b", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "THIỆP MỜI CƯỚI", x: 20, y: 108, width: 350, height: 30, fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#fbbf24", textAlign: "center" as const, lineHeight: 1.6 },
            { type: "text" as const, text: "Tên Chú Rể", x: 20, y: 148, width: 350, height: 50, fontSize: 36, fontFamily: "'Great Vibes', cursive", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#fef3c7", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "♥", x: 20, y: 202, width: 350, height: 30, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#f59e0b", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Tên Cô Dâu", x: 20, y: 238, width: 350, height: 50, fontSize: 36, fontFamily: "'Great Vibes', cursive", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#fef3c7", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "28 · 05 · 2026", x: 20, y: 310, width: 350, height: 40, fontSize: 20, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#f59e0b", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "10:00 AM  |  Diamond Palace, TP.HCM", x: 20, y: 360, width: 350, height: 35, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#a8a29e", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "✦ — ✦", x: 20, y: 410, width: 350, height: 40, fontSize: 18, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#f59e0b", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "do-truyen-thong": {
        bg: "linear-gradient(180deg, #fef2f2 0%, #fecaca 40%, #fca5a5 100%)",
        elements: [
            { type: "text" as const, text: "喜 ❖ 喜", x: 20, y: 55, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#dc2626", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "THIỆP MỜI", x: 20, y: 105, width: 350, height: 30, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#b91c1c", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể", x: 20, y: 148, width: 350, height: 48, fontSize: 34, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#7f1d1d", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "❤", x: 20, y: 200, width: 350, height: 30, fontSize: 24, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#ef4444", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Tên Cô Dâu", x: 20, y: 235, width: 350, height: 48, fontSize: 34, fontFamily: "'Playfair Display', serif", fontWeight: "bold" as const, fontStyle: "italic" as const, color: "#7f1d1d", textAlign: "center" as const, lineHeight: 1.2 },
            { type: "text" as const, text: "Ngày 28 tháng 05 năm 2026", x: 20, y: 305, width: 350, height: 40, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#b91c1c", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 355, width: 350, height: 35, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "❖ 喜 ❖", x: 20, y: 405, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#dc2626", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
    "peach-garden": {
        bg: "linear-gradient(180deg, #fff7ed 0%, #ffedd5 40%, #fed7aa 100%)",
        elements: [
            { type: "text" as const, text: "🍑 ✿ 🍑", x: 20, y: 55, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#ea580c", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Trân trọng kính mời", x: 20, y: 110, width: 350, height: 30, fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#9a3412", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 155, width: 350, height: 70, fontSize: 32, fontFamily: "'Dancing Script', cursive", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#7c2d12", textAlign: "center" as const, lineHeight: 1.3 },
            { type: "text" as const, text: "cùng gia đình hai bên\nân hạnh kính mời quý khách", x: 20, y: 240, width: 350, height: 50, fontSize: 13, fontFamily: "'Lora', serif", fontWeight: "normal" as const, fontStyle: "italic" as const, color: "#c2410c", textAlign: "center" as const, lineHeight: 1.6 },
            { type: "text" as const, text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 310, width: 350, height: 40, fontSize: 17, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" as const, fontStyle: "normal" as const, color: "#ea580c", textAlign: "center" as const, lineHeight: 1.4 },
            { type: "text" as const, text: "Diamond Palace  ·  TP.HCM", x: 20, y: 360, width: 350, height: 35, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#374151", textAlign: "center" as const, lineHeight: 1.5 },
            { type: "text" as const, text: "✿ 🍑 ✿", x: 20, y: 410, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal" as const, fontStyle: "normal" as const, color: "#ea580c", textAlign: "center" as const, lineHeight: 1.4 },
        ],
    },
};

// Default template for any unknown slug
const DEFAULT_PRESET = TEMPLATE_CANVAS_PRESETS["rose-garden"];

function buildTemplateCanvasJson(templateSlug: string): string {
    const preset = TEMPLATE_CANVAS_PRESETS[templateSlug] ?? DEFAULT_PRESET;
    return JSON.stringify({
        version: 1,
        canvas: { width: 390, height: 844, bg: preset.bg },
        elements: preset.elements.map((el, i) => ({
            id: `el-${i + 1}`,
            type: el.type,
            x: el.x, y: el.y,
            width: el.width, height: el.height,
            rotation: 0, opacity: 1,
            zIndex: i + 1, locked: false,
            animation: { entrance: "fadeIn", loop: "none" },
            props: {
                text: el.text,
                fontSize: el.fontSize,
                fontFamily: el.fontFamily,
                fontWeight: el.fontWeight,
                fontStyle: el.fontStyle,
                color: el.color,
                textAlign: el.textAlign,
                lineHeight: el.lineHeight,
            },
        })),
    });
}

function NewEditorInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const creatingRef = useRef(false);

    useEffect(() => {
        if (creatingRef.current) return;
        creatingRef.current = true;

        async function createProject() {
            const templateSlug = searchParams.get("template") || "rose-garden";
            const { createBrowserClient: createClient } = await import("@supabase/ssr");
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            );

            // Auth check
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login?redirect=/editor/new?template=" + templateSlug);
                return;
            }

            // Build initial canvas_json from template preset
            const canvasJson = buildTemplateCanvasJson(templateSlug);

            // Create slug
            const slug = `wedding-${Date.now().toString(36)}`;

            // Create project
            const { data: project, error } = await supabase
                .from("projects")
                .insert({
                    user_id: user.id,
                    slug,
                    title: "Thiệp cưới mới",
                    template: templateSlug,
                    status: "draft",
                    canvas_json: canvasJson,
                    groom_name: "Tên Chú Rể",
                    bride_name: "Tên Cô Dâu",
                    wedding_date: null,
                })
                .select("id")
                .single();

            if (error || !project) {
                alert("Không thể tạo thiệp. Vui lòng thử lại: " + (error?.message ?? "unknown"));
                router.push("/templates");
                return;
            }

            // Redirect to VisualEditor with the new project
            router.replace("/editor/" + project.id);
        }

        createProject();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{
            height: "100vh", display: "flex",
            flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #fdf2f8, #faf5ff)",
            gap: 16,
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "3px solid #f3e8ff",
                borderTop: "3px solid #ff6b9d",
                animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ fontSize: 16, color: "#be185d", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                💌 Đang tạo thiệp mới...
            </p>
            <p style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>
                Chỉ mất vài giây để khởi tạo
            </p>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg) } }
            `}</style>
        </div>
    );
}

export default function NewEditorPage() {
    return (
        <Suspense fallback={
            <div style={{
                height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "#fdf2f8",
            }}>
                <p style={{ fontSize: 16, color: "#be185d" }}>💌 Loading...</p>
            </div>
        }>
            <NewEditorInner />
        </Suspense>
    );
}
