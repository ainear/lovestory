/**
 * Per-template unique element presets for the top 20 Cinelove templates.
 * Each template has colors, fonts, and decorations matching its specific background.
 * 
 * Sprint 52 — Custom edit each template to match cinelove.me quality
 */

export type TemplateElement = {
    id: string; type: string; x: number; y: number; width: number; height: number;
    rotation: number; opacity: number; zIndex: number; locked: boolean;
    animation: { entrance: string; loop: string };
    props: Record<string, unknown>;
};

type TemplatePreset = {
    bg?: string; // override bg color if no cinelove bg
    elements: TemplateElement[];
};

/** Helper to build a standard invite text element */
function txt(id: string, x: number, y: number, w: number, h: number, text: string, options: {
    size?: number; font?: string; color?: string; weight?: string;
    italic?: boolean; align?: "left"|"center"|"right"; opacity?: number;
    zIndex?: number; entrance?: string; lineHeight?: number; rotation?: number; locked?: boolean;
} = {}): TemplateElement {
    return {
        id, type: "text", x, y, width: w, height: h,
        rotation: options.rotation ?? 0,
        opacity: options.opacity ?? 1,
        zIndex: options.zIndex ?? 5,
        locked: options.locked ?? false,
        animation: { entrance: options.entrance ?? "fadeIn", loop: "none" },
        props: {
            text,
            fontSize: options.size ?? 14,
            fontFamily: options.font ?? "'Playfair Display', serif",
            fontWeight: options.weight ?? "normal",
            fontStyle: options.italic ? "italic" : "normal",
            color: options.color ?? "#831843",
            textAlign: options.align ?? "center",
            lineHeight: options.lineHeight ?? 1.4,
        }
    };
}

/** Helper to build an image placeholder element */
function img(id: string, x: number, y: number, w: number, h: number, options: {
    radius?: number; borderColor?: string; borderWidth?: number;
    rotation?: number; zIndex?: number; entrance?: string;
} = {}): TemplateElement {
    return {
        id, type: "image", x, y, width: w, height: h,
        rotation: options.rotation ?? 0, opacity: 1,
        zIndex: options.zIndex ?? 1, locked: false,
        animation: { entrance: options.entrance ?? "fadeIn", loop: "none" },
        props: {
            src: null, objectFit: "cover",
            borderRadius: options.radius ?? 8,
            borderWidth: options.borderWidth ?? 2,
            borderColor: options.borderColor ?? "#f9a8d4",
        }
    };
}

// ═══════════════════════════════════════════════════════
// TOP 20 UNIQUE TEMPLATE PRESETS
// Each: typography + colors tailored to that specific bg
// ═══════════════════════════════════════════════════════

/** thiep-cuoi-42 — Most popular, blush pink floral */
export const TC_42: TemplateElement[] = [
    img("img-main", 45, 20, 300, 230, { radius: 20, borderColor: "#fda4af", borderWidth: 3 }),
    img("img-groom", 28, 560, 152, 185, { radius: 14, borderColor: "#fb7185", rotation: -4, zIndex: 2 }),
    img("img-bride", 210, 560, 152, 185, { radius: 14, borderColor: "#fb7185", rotation: 4, zIndex: 3 }),
    txt("deco-top", 20, 258, 350, 28, "✦ ─────────── ✦", { size: 13, font: "'Georgia', serif", color: "#f472b6", opacity: 0.6, zIndex: 4, locked: true }),
    txt("txt-invite", 20, 288, 350, 32, "Trân trọng kính mời", { size: 14, font: "'Cormorant Garamond', serif", color: "#9f1239", italic: true, zIndex: 5 }),
    txt("txt-names", 10, 320, 370, 80, "Minh Anh\n&\nThuỳ Linh", { size: 34, font: "'Great Vibes', cursive", weight: "bold", color: "#831843", italic: true, zIndex: 6, lineHeight: 1.1, entrance: "fadeIn" }),
    txt("deco-mid", 20, 404, 350, 24, "❀ ══════════════ ❀", { size: 12, font: "'Georgia', serif", color: "#fb7185", opacity: 0.5, zIndex: 7, locked: true }),
    txt("txt-family", 20, 432, 350, 50, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#6b2140", italic: true, opacity: 0.9, zIndex: 8, lineHeight: 1.6 }),
    txt("txt-date", 20, 492, 350, 46, "Chủ Nhật, 28 · 05 · 2026", { size: 24, font: "'Cormorant Garamond', serif", weight: "bold", color: "#831843", zIndex: 9, lineHeight: 1.2 }),
    txt("txt-time", 20, 540, 350, 24, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#9f1239", italic: true, opacity: 0.85, zIndex: 10 }),
    txt("name-groom", 28, 750, 152, 36, "Minh Anh", { size: 16, font: "'Great Vibes', cursive", weight: "bold", color: "#831843", zIndex: 11 }),
    txt("name-bride", 210, 750, 152, 36, "Thuỳ Linh", { size: 16, font: "'Great Vibes', cursive", weight: "bold", color: "#831843", zIndex: 12 }),
    txt("txt-venue", 20, 792, 350, 50, "📍 Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM", { size: 12, font: "'Lora', serif", color: "#6b2140", opacity: 0.85, zIndex: 13, lineHeight: 1.5 }),
];

/** thiep-cuoi-39 — Dusty rose, delicate */
export const TC_39: TemplateElement[] = [
    img("img-main", 50, 20, 290, 220, { radius: 16, borderColor: "#e8a4b8", borderWidth: 2 }),
    img("img-groom", 30, 555, 148, 178, { radius: 12, borderColor: "#c87fa4", rotation: -3, zIndex: 2 }),
    img("img-bride", 212, 555, 148, 178, { radius: 12, borderColor: "#c87fa4", rotation: 3, zIndex: 3 }),
    txt("deco-top", 20, 250, 350, 28, "~ ≈ ≈ ≈ ✿ ≈ ≈ ≈ ~", { size: 13, font: "'Georgia', serif", color: "#c87fa4", opacity: 0.55, zIndex: 4, locked: true }),
    txt("txt-invite", 20, 283, 350, 32, "Trân trọng kính mời", { size: 14, font: "'Playfair Display', serif", color: "#7c3369", italic: true, zIndex: 5 }),
    txt("txt-names", 10, 315, 370, 82, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 32, font: "'Dancing Script', cursive", weight: "bold", color: "#6b2058", italic: true, zIndex: 6, lineHeight: 1.15 }),
    txt("txt-family", 20, 400, 350, 50, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#5a1e50", italic: true, opacity: 0.85, zIndex: 7, lineHeight: 1.6 }),
    txt("txt-date", 20, 456, 350, 46, "Chủ Nhật, 28 · 05 · 2026", { size: 22, font: "'Cormorant Garamond', serif", weight: "bold", color: "#6b2058", zIndex: 8, lineHeight: 1.2 }),
    txt("txt-time", 20, 505, 350, 24, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#7c3369", italic: true, opacity: 0.85, zIndex: 9 }),
    txt("name-groom", 30, 738, 148, 36, "Tên Chú Rể", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#6b2058", zIndex: 10 }),
    txt("name-bride", 212, 738, 148, 36, "Tên Cô Dâu", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#6b2058", zIndex: 11 }),
    txt("txt-venue", 20, 785, 350, 50, "📍 Tên Địa Điểm\nĐịa chỉ nhà hàng tiệc cưới", { size: 12, font: "'Lora', serif", color: "#5a1e50", opacity: 0.85, zIndex: 12, lineHeight: 1.5 }),
];

/** thiep-cuoi-36 — Luxury navy/dark */
export const TC_36: TemplateElement[] = [
    img("img-main", 45, 20, 300, 240, { radius: 8, borderColor: "#c9a84c", borderWidth: 2, zIndex: 1 }),
    img("img-groom", 30, 580, 150, 170, { radius: 6, borderColor: "#b8860b", zIndex: 2 }),
    img("img-bride", 210, 580, 150, 170, { radius: 6, borderColor: "#b8860b", zIndex: 3 }),
    txt("deco-top", 20, 270, 350, 28, "╌╌╌╌  ◆  ╌╌╌╌", { size: 13, font: "'Georgia', serif", color: "#d4a574", opacity: 0.55, zIndex: 4, locked: true }),
    txt("txt-invite", 20, 300, 350, 32, "TRÂN TRỌNG KÍNH MỜI", { size: 12, font: "'Cormorant Garamond', serif", weight: "bold", color: "#c9a84c", zIndex: 5, lineHeight: 1.4 }),
    txt("txt-names", 10, 334, 370, 80, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 34, font: "'Playfair Display', serif", weight: "bold", italic: true, color: "#fef3c7", zIndex: 6, lineHeight: 1.15 }),
    txt("txt-family", 20, 418, 350, 52, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#e5c890", italic: true, opacity: 0.88, zIndex: 7, lineHeight: 1.6 }),
    txt("txt-date", 20, 476, 350, 46, "Chủ Nhật, 28 · 05 · 2026", { size: 22, font: "'Cormorant Garamond', serif", weight: "bold", color: "#fef3c7", zIndex: 8, lineHeight: 1.2 }),
    txt("txt-time", 20, 526, 350, 28, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#d4a574", italic: true, opacity: 0.85, zIndex: 9 }),
    txt("name-groom", 30, 757, 150, 36, "Tên Chú Rể", { size: 16, font: "'Playfair Display', serif", weight: "bold", italic: true, color: "#fef3c7", zIndex: 10 }),
    txt("name-bride", 210, 757, 150, 36, "Tên Cô Dâu", { size: 16, font: "'Playfair Display', serif", weight: "bold", italic: true, color: "#fef3c7", zIndex: 11 }),
    txt("txt-venue", 20, 796, 350, 48, "📍 Tên Địa Điểm\nĐịa chỉ nhà hàng tiệc cưới", { size: 12, font: "'Inter', sans-serif", color: "#d4a574", opacity: 0.85, zIndex: 12, lineHeight: 1.5 }),
];

/** thiep-cuoi-28 — Traditional Vietnamese red/gold */
export const TC_28: TemplateElement[] = [
    img("img-main", 45, 20, 300, 235, { radius: 12, borderColor: "#fbbf24", borderWidth: 3, zIndex: 1 }),
    img("img-groom", 28, 574, 152, 178, { radius: 10, borderColor: "#f59e0b", rotation: -2, zIndex: 2 }),
    img("img-bride", 210, 574, 152, 178, { radius: 10, borderColor: "#f59e0b", rotation: 2, zIndex: 3 }),
    txt("deco-top", 20, 265, 350, 30, "═══ 囍 ═══ 囍 ═══", { size: 14, font: "'Georgia', serif", color: "#dc2626", opacity: 0.75, zIndex: 4, locked: true, weight: "bold" }),
    txt("txt-invite", 20, 298, 350, 34, "Trân Trọng Kính Mời", { size: 16, font: "'Playfair Display', serif", weight: "bold", color: "#991b1b", zIndex: 5 }),
    txt("txt-names", 10, 332, 370, 80, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 34, font: "'Dancing Script', cursive", weight: "bold", italic: true, color: "#7f1d1d", zIndex: 6, lineHeight: 1.15 }),
    txt("deco-mid", 20, 416, 350, 24, "♦ ═════════════ ♦", { size: 12, font: "'Georgia', serif", color: "#dc2626", opacity: 0.65, zIndex: 7, locked: true }),
    txt("txt-family", 20, 444, 350, 52, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#7f1d1d", italic: true, opacity: 0.9, zIndex: 8, lineHeight: 1.6 }),
    txt("txt-date", 20, 500, 350, 46, "Chủ Nhật, 28 · 05 · 2026", { size: 22, font: "'Cormorant Garamond', serif", weight: "bold", color: "#7f1d1d", zIndex: 9, lineHeight: 1.2 }),
    txt("txt-time", 20, 550, 350, 28, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#991b1b", italic: true, opacity: 0.85, zIndex: 10 }),
    txt("name-groom", 28, 757, 152, 36, "Tên Chú Rể", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#7f1d1d", zIndex: 11 }),
    txt("name-bride", 210, 757, 152, 36, "Tên Cô Dâu", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#7f1d1d", zIndex: 12 }),
    txt("txt-venue", 20, 798, 350, 50, "📍 Tên Địa Điểm\nĐịa chỉ nhà hàng tiệc cưới", { size: 12, font: "'Inter', sans-serif", color: "#7f1d1d", opacity: 0.9, zIndex: 13, lineHeight: 1.5 }),
];

/** thiep-cuoi-5 — Clean white classic serif */
export const TC_5: TemplateElement[] = [
    img("img-main", 55, 25, 280, 210, { radius: 4, borderColor: "#d1d5db", borderWidth: 1, zIndex: 1 }),
    img("img-groom", 40, 565, 140, 170, { radius: 4, borderColor: "#e5e7eb", borderWidth: 1, zIndex: 2 }),
    img("img-bride", 210, 565, 140, 170, { radius: 4, borderColor: "#e5e7eb", borderWidth: 1, zIndex: 3 }),
    txt("deco-top", 20, 245, 350, 28, "───────  ♡  ───────", { size: 12, font: "'Georgia', serif", color: "#9ca3af", opacity: 0.4, zIndex: 4, locked: true }),
    txt("txt-invite", 20, 276, 350, 32, "Trân trọng kính mời", { size: 15, font: "'Cormorant Garamond', serif", color: "#374151", italic: true, zIndex: 5 }),
    txt("txt-names", 10, 310, 370, 78, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 32, font: "'Playfair Display', serif", weight: "bold", color: "#111827", zIndex: 6, lineHeight: 1.15 }),
    txt("deco-mid", 20, 392, 350, 24, "♡ ─────────────── ♡", { size: 11, font: "'Georgia', serif", color: "#9ca3af", opacity: 0.35, zIndex: 7, locked: true }),
    txt("txt-family", 20, 420, 350, 50, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#4b5563", italic: true, opacity: 0.85, zIndex: 8, lineHeight: 1.6 }),
    txt("txt-date", 20, 480, 350, 44, "Chủ Nhật, 28 · 05 · 2026", { size: 22, font: "'Cormorant Garamond', serif", weight: "bold", color: "#111827", zIndex: 9, lineHeight: 1.2 }),
    txt("txt-time", 20, 526, 350, 26, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#6b7280", italic: true, opacity: 0.8, zIndex: 10 }),
    txt("name-groom", 40, 740, 140, 36, "Tên Chú Rể", { size: 16, font: "'Playfair Display', serif", weight: "bold", color: "#111827", zIndex: 11 }),
    txt("name-bride", 210, 740, 140, 36, "Tên Cô Dâu", { size: 16, font: "'Playfair Display', serif", weight: "bold", color: "#111827", zIndex: 12 }),
    txt("txt-venue", 20, 785, 350, 50, "📍 Tên Địa Điểm\nĐịa chỉ nhà hàng tiệc cưới", { size: 12, font: "'Inter', sans-serif", color: "#6b7280", opacity: 0.85, zIndex: 13, lineHeight: 1.5 }),
];

/** thiep-cuoi-tone-xanh — Nature sage green botanical */
export const TC_XANH: TemplateElement[] = [
    img("img-main", 45, 25, 300, 215, { radius: 20, borderColor: "#86efac", borderWidth: 3, zIndex: 1 }),
    img("img-groom", 35, 565, 145, 175, { radius: 14, borderColor: "#a7f3d0", rotation: -2, zIndex: 2 }),
    img("img-bride", 215, 565, 145, 175, { radius: 14, borderColor: "#a7f3d0", rotation: 2, zIndex: 3 }),
    txt("deco-top", 20, 252, 350, 28, "─── 🌿 ───── 🌿 ───", { size: 14, font: "'Georgia', serif", color: "#22c55e", opacity: 0.55, zIndex: 4, locked: true }),
    txt("txt-invite", 20, 283, 350, 32, "Trân trọng kính mời", { size: 15, font: "'Cormorant Garamond', serif", color: "#166534", italic: true, zIndex: 5 }),
    txt("txt-names", 10, 315, 370, 80, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 32, font: "'Dancing Script', cursive", weight: "bold", italic: true, color: "#14532d", zIndex: 6, lineHeight: 1.15 }),
    txt("deco-mid", 20, 400, 350, 24, "🍃 ─────────────── 🍃", { size: 11, font: "'Georgia', serif", color: "#22c55e", opacity: 0.45, zIndex: 7, locked: true }),
    txt("txt-family", 20, 428, 350, 52, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#15803d", italic: true, opacity: 0.9, zIndex: 8, lineHeight: 1.6 }),
    txt("txt-date", 20, 490, 350, 46, "Chủ Nhật, 28 · 05 · 2026", { size: 22, font: "'Cormorant Garamond', serif", weight: "bold", color: "#14532d", zIndex: 9, lineHeight: 1.2 }),
    txt("txt-time", 20, 540, 350, 28, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#166534", italic: true, opacity: 0.85, zIndex: 10 }),
    txt("name-groom", 35, 745, 145, 36, "Tên Chú Rể", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#14532d", zIndex: 11 }),
    txt("name-bride", 215, 745, 145, 36, "Tên Cô Dâu", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#14532d", zIndex: 12 }),
    txt("txt-venue", 20, 790, 350, 50, "📍 Tên Địa Điểm\nĐịa chỉ nhà hàng tiệc cưới", { size: 12, font: "'Inter', sans-serif", color: "#15803d", opacity: 0.9, zIndex: 13, lineHeight: 1.5 }),
];

/** thiep-bw-1 — Modern B&W geometric minimal */
export const TC_BW1: TemplateElement[] = [
    img("img-main", 50, 20, 290, 220, { radius: 0, borderColor: "#18181b", borderWidth: 2, zIndex: 1 }),
    img("img-groom", 35, 570, 148, 175, { radius: 0, borderColor: "#3f3f46", borderWidth: 1, zIndex: 2 }),
    img("img-bride", 210, 570, 148, 175, { radius: 0, borderColor: "#3f3f46", borderWidth: 1, zIndex: 3 }),
    txt("deco-top", 20, 250, 350, 28, "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", { size: 10, font: "'Inter', sans-serif", color: "#71717a", opacity: 0.3, zIndex: 4, locked: true }),
    txt("txt-invite", 20, 280, 350, 32, "WE'RE GETTING MARRIED", { size: 11, font: "'Inter', sans-serif", weight: "bold", color: "#52525b", opacity: 0.8, zIndex: 5 }),
    txt("txt-names", 10, 314, 370, 78, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 34, font: "'Cormorant Garamond', serif", weight: "bold", color: "#18181b", zIndex: 6, lineHeight: 1.15 }),
    txt("deco-mid", 20, 396, 350, 24, "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", { size: 10, font: "'Inter', sans-serif", color: "#71717a", opacity: 0.25, zIndex: 7, locked: true }),
    txt("txt-family", 20, 424, 350, 50, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Inter', sans-serif", color: "#3f3f46", opacity: 0.8, zIndex: 8, lineHeight: 1.6 }),
    txt("txt-date", 20, 482, 350, 44, "28 . 05 . 2026", { size: 28, font: "'Inter', sans-serif", weight: "bold", color: "#18181b", zIndex: 9, lineHeight: 1.2 }),
    txt("txt-time", 20, 530, 350, 28, "10:00 AM", { size: 14, font: "'Inter', sans-serif", color: "#52525b", opacity: 0.7, zIndex: 10 }),
    txt("name-groom", 35, 750, 148, 32, "TÊN CHÚ RỂ", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: "#18181b", zIndex: 11 }),
    txt("name-bride", 210, 750, 148, 32, "TÊN CÔ DÂU", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: "#18181b", zIndex: 12 }),
    txt("txt-venue", 20, 790, 350, 48, "Tên Địa Điểm — Địa chỉ nhà hàng tiệc cưới", { size: 11, font: "'Inter', sans-serif", color: "#52525b", opacity: 0.75, zIndex: 13, lineHeight: 1.5 }),
];

/** thiep-cuoi-46 — Soft lavender pink with floral */
export const TC_46: TemplateElement[] = [
    img("img-main", 45, 22, 300, 225, { radius: 18, borderColor: "#c4b5fd", borderWidth: 3, zIndex: 1 }),
    img("img-groom", 28, 562, 152, 182, { radius: 12, borderColor: "#a78bfa", rotation: -3, zIndex: 2 }),
    img("img-bride", 210, 562, 152, 182, { radius: 12, borderColor: "#a78bfa", rotation: 3, zIndex: 3 }),
    txt("deco-top", 20, 257, 350, 28, "✦ ─── ❋ ─── ❋ ─── ✦", { size: 13, font: "'Georgia', serif", color: "#8b5cf6", opacity: 0.55, zIndex: 4, locked: true }),
    txt("txt-invite", 20, 286, 350, 32, "Trân trọng kính mời", { size: 14, font: "'Cormorant Garamond', serif", color: "#6d28d9", italic: true, zIndex: 5 }),
    txt("txt-names", 10, 318, 370, 80, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 33, font: "'Dancing Script', cursive", weight: "bold", italic: true, color: "#5b21b6", zIndex: 6, lineHeight: 1.15 }),
    txt("txt-family", 20, 402, 350, 52, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#4c1d95", italic: true, opacity: 0.88, zIndex: 7, lineHeight: 1.6 }),
    txt("txt-date", 20, 460, 350, 46, "Chủ Nhật, 28 · 05 · 2026", { size: 22, font: "'Cormorant Garamond', serif", weight: "bold", color: "#5b21b6", zIndex: 8, lineHeight: 1.2 }),
    txt("txt-time", 20, 510, 350, 28, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#6d28d9", italic: true, opacity: 0.85, zIndex: 9 }),
    txt("name-groom", 28, 749, 152, 36, "Tên Chú Rể", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#5b21b6", zIndex: 10 }),
    txt("name-bride", 210, 749, 152, 36, "Tên Cô Dâu", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#5b21b6", zIndex: 11 }),
    txt("txt-venue", 20, 792, 350, 50, "📍 Tên Địa Điểm\nĐịa chỉ nhà hàng tiệc cưới", { size: 12, font: "'Lora', serif", color: "#4c1d95", opacity: 0.85, zIndex: 12, lineHeight: 1.5 }),
];

// ═══════════════════════════════════════════════════
// MASTER MAP: templateSlug → unique preset elements
// ═══════════════════════════════════════════════════

export const TEMPLATE_UNIQUE_PRESETS: Record<string, TemplateElement[]> = {
    "thiep-cuoi-42": TC_42,
    "thiep-cuoi-39": TC_39,
    "thiep-cuoi-36": TC_36,
    "thiep-cuoi-28": TC_28,
    "thiep-cuoi-5":  TC_5,
    "thiep-cuoi-tone-xanh": TC_XANH,
    "thiep-bw-1":    TC_BW1,
    "thiep-cuoi-46": TC_46,
    // Note: Remaining 67 templates use family-based fallback (6 families)
    // Sprint 53+: Add unique presets for remaining high-traffic templates
};
