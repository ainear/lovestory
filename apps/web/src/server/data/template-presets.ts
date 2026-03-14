/**
 * Per-template unique element presets for ALL 75 Cinelove templates.
 * Sprint 52: top 8 unique presets
 * Sprint 53: remaining 67 templates — each with tailored colors + typography
 * 
 * Design system: Each template reads its background image tone and
 * applies matching font/color/decoration choices.
 */

export type TemplateElement = {
    id: string; type: string; x: number; y: number; width: number; height: number;
    rotation: number; opacity: number; zIndex: number; locked: boolean;
    animation: { entrance: string; loop: string };
    props: Record<string, unknown>;
};

/** Helper: text element */
function txt(id: string, x: number, y: number, w: number, h: number, text: string, o: {
    size?: number; font?: string; color?: string; weight?: string;
    italic?: boolean; align?: "left"|"center"|"right"; opacity?: number;
    zIndex?: number; entrance?: string; lineHeight?: number; rotation?: number; locked?: boolean;
} = {}): TemplateElement {
    return {
        id, type: "text", x, y, width: w, height: h,
        rotation: o.rotation ?? 0, opacity: o.opacity ?? 1, zIndex: o.zIndex ?? 5,
        locked: o.locked ?? false,
        animation: { entrance: o.entrance ?? "fadeIn", loop: "none" },
        props: {
            text, fontSize: o.size ?? 14,
            fontFamily: o.font ?? "'Playfair Display', serif",
            fontWeight: o.weight ?? "normal",
            fontStyle: o.italic ? "italic" : "normal",
            color: o.color ?? "#831843",
            textAlign: o.align ?? "center",
            lineHeight: o.lineHeight ?? 1.4,
        }
    };
}

/** Placeholder images for template init — users replace with real photos */
const PLACEHOLDERS: Record<string, string> = {
    "img-main":  "/placeholder-couple.png",
    "img-groom": "/placeholder-groom.png",
    "img-bride": "/placeholder-bride.png",
    "img-couple2": "/placeholder-couple.png",
};

/** Helper: image placeholder element */
function img(id: string, x: number, y: number, w: number, h: number, o: {
    radius?: number; borderColor?: string; borderWidth?: number;
    rotation?: number; zIndex?: number;
} = {}): TemplateElement {
    return {
        id, type: "image", x, y, width: w, height: h,
        rotation: o.rotation ?? 0, opacity: 1, zIndex: o.zIndex ?? 1, locked: false,
        animation: { entrance: "fadeIn", loop: "none" },
        props: { src: PLACEHOLDERS[id] ?? "/placeholder-couple.png", objectFit: "cover", borderRadius: o.radius ?? 8, borderWidth: o.borderWidth ?? 2, borderColor: o.borderColor ?? "#f9a8d4" }
    };
}

// ═══════════════════════════════════════════
// PRESET FACTORIES — Sprint 58: Rich 18-20 element layouts (2800px canvas)
// Section layout: Hero → Names → Date → Gallery → Love Story → Venue
// ═══════════════════════════════════════════

/** Romantic pink variant — 18 elements across 2800px */
function makeRomanticPreset(accent: string, text: string, deco: string, font: string, decoText: string): TemplateElement[] {
    return [
        // ── Section 1: Hero (0-450px) ──
        txt("txt-ceremony", 20, 30, 350, 36, "Lễ Thành Hôn", { size: 18, font: "'Cormorant Garamond', serif", color: deco, italic: true, zIndex: 2, entrance: "fadeIn" }),
        img("img-main", 30, 80, 330, 340, { radius: 20, borderColor: accent, borderWidth: 3 }),
        txt("txt-deco1", 20, 430, 350, 24, decoText, { size: 12, font: "'Georgia', serif", color: deco, opacity: 0.5, zIndex: 4, locked: true }),

        // ── Section 2: Names & Invitation (450-850px) ──
        txt("txt-invite", 20, 470, 350, 32, "Trân trọng kính mời", { size: 15, font: font, color: text, italic: true, zIndex: 5, entrance: "slideUp" }),
        txt("txt-names", 10, 510, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 38, font: "'Dancing Script', cursive", weight: "bold", italic: true, color: text, zIndex: 6, lineHeight: 1.1, entrance: "zoomIn" }),
        txt("txt-family", 20, 620, 350, 56, "Cùng gia đình hai bên\ntrân trọng kính mời quý khách\ntới dự buổi lễ Vu Quy", { size: 14, font: "'Lora', serif", color: text, italic: true, opacity: 0.9, zIndex: 7, lineHeight: 1.5 }),
        txt("deco-mid", 20, 685, 350, 24, "❀ ══════════════ ❀", { size: 12, font: "'Georgia', serif", color: deco, opacity: 0.5, zIndex: 8, locked: true }),

        // ── Section 3: Date & Time (850-1200px) ──
        txt("txt-weekday", 20, 730, 350, 30, "VÀO NGÀY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: text, opacity: 0.7, zIndex: 9, entrance: "slideUp" }),
        txt("txt-date", 20, 760, 350, 64, "Chủ Nhật, 28 · 05 · 2026", { size: 28, font: "'Cormorant Garamond', serif", weight: "bold", color: text, zIndex: 10, lineHeight: 1.2, entrance: "fadeIn" }),
        txt("txt-time", 20, 830, 350, 30, "Lúc 10:00 sáng", { size: 16, font: "'Lora', serif", color: text, italic: true, opacity: 0.85, zIndex: 11 }),
        txt("txt-lunar", 20, 865, 350, 24, "(Tức ngày ... tháng ... năm ...)", { size: 12, font: "'Lora', serif", color: deco, italic: true, opacity: 0.65, zIndex: 12 }),

        // ── Section 4: Gallery (1200-1800px) ──
        img("img-groom", 20, 920, 170, 220, { radius: 14, borderColor: deco, rotation: -3, zIndex: 2 }),
        img("img-bride", 200, 920, 170, 220, { radius: 14, borderColor: deco, rotation: 3, zIndex: 3 }),
        txt("name-groom", 20, 1150, 170, 36, "Chú Rể", { size: 18, font: "'Dancing Script', cursive", weight: "bold", color: text, zIndex: 14 }),
        txt("name-bride", 200, 1150, 170, 36, "Cô Dâu", { size: 18, font: "'Dancing Script', cursive", weight: "bold", color: text, zIndex: 15 }),
        img("img-couple2", 55, 1210, 280, 200, { radius: 16, borderColor: accent, borderWidth: 2 }),

        // ── Section 5: Love Story Quote (1800-2200px) ──
        txt("txt-quote", 30, 1440, 330, 80, "Yeu la hanh phuc khi duoc o ben nhau,\nla niem vui moi ngay.", { size: 15, font: "'Lora', serif", color: text, italic: true, opacity: 0.9, zIndex: 16, lineHeight: 1.6, entrance: "fadeIn" }),
        txt("txt-hashtag", 20, 1540, 350, 28, "#TenChuRe_TenCoDau", { size: 14, font: "'Inter', sans-serif", weight: "bold", color: accent, zIndex: 17 }),

        // ── Section 6: Venue (2200-2800px) ──
        txt("txt-venue-label", 20, 1600, 350, 28, "ĐỊA ĐIỂM TỔ CHỨC", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: text, opacity: 0.7, zIndex: 18, entrance: "slideUp" }),
        txt("txt-venue", 20, 1630, 350, 60, "📍 Tên Nhà Hàng\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố", { size: 14, font: "'Inter', sans-serif", color: text, opacity: 0.9, zIndex: 19, lineHeight: 1.5 }),
    ];
}

/** Luxury dark variant — 18 elements across 2800px */
function makeLuxuryPreset(gold: string, light: string, midDeco: string): TemplateElement[] {
    return [
        // ── Section 1: Hero ──
        txt("txt-ceremony", 20, 30, 350, 36, "Wedding Invitation", { size: 16, font: "'Cormorant Garamond', serif", color: gold, italic: true, zIndex: 2, entrance: "fadeIn" }),
        img("img-main", 30, 80, 330, 340, { radius: 8, borderColor: gold, borderWidth: 2 }),
        txt("txt-deco1", 20, 430, 350, 28, "╌╌╌╌  ◆  ╌╌╌╌", { size: 13, font: "'Georgia', serif", color: gold, opacity: 0.5, zIndex: 4, locked: true }),

        // ── Section 2: Names & Invitation ──
        txt("txt-invite", 20, 470, 350, 32, "TRÂN TRỌNG KÍNH MỜI", { size: 13, font: "'Cormorant Garamond', serif", weight: "bold", color: gold, zIndex: 5, entrance: "slideUp" }),
        txt("txt-names", 10, 510, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 38, font: "'Playfair Display', serif", weight: "bold", italic: true, color: light, zIndex: 6, lineHeight: 1.1, entrance: "zoomIn" }),
        txt("txt-family", 20, 620, 350, 56, "Cùng gia đình hai bên\ntrân trọng kính mời quý khách\ntới dự buổi lễ Thành Hôn", { size: 14, font: "'Lora', serif", color: light, italic: true, opacity: 0.85, zIndex: 7, lineHeight: 1.5 }),
        txt("deco-mid", 20, 685, 350, 28, midDeco, { size: 11, font: "'Georgia', serif", color: gold, opacity: 0.4, zIndex: 8, locked: true }),

        // ── Section 3: Date & Time ──
        txt("txt-weekday", 20, 730, 350, 30, "VÀO NGÀY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: gold, opacity: 0.7, zIndex: 9 }),
        txt("txt-date", 20, 760, 350, 64, "Chủ Nhật, 28 · 05 · 2026", { size: 26, font: "'Cormorant Garamond', serif", weight: "bold", color: light, zIndex: 10, lineHeight: 1.2 }),
        txt("txt-time", 20, 830, 350, 30, "Lúc 10:00 sáng", { size: 16, font: "'Lora', serif", color: gold, italic: true, opacity: 0.85, zIndex: 11 }),
        txt("txt-lunar", 20, 865, 350, 24, "(Tức ngày ... tháng ... năm ...)", { size: 12, font: "'Lora', serif", color: gold, italic: true, opacity: 0.55, zIndex: 12 }),

        // ── Section 4: Gallery ──
        img("img-groom", 20, 920, 170, 220, { radius: 6, borderColor: gold, zIndex: 2 }),
        img("img-bride", 200, 920, 170, 220, { radius: 6, borderColor: gold, zIndex: 3 }),
        txt("name-groom", 20, 1150, 170, 36, "Chú Rể", { size: 18, font: "'Playfair Display', serif", weight: "bold", italic: true, color: light, zIndex: 14 }),
        txt("name-bride", 200, 1150, 170, 36, "Cô Dâu", { size: 18, font: "'Playfair Display', serif", weight: "bold", italic: true, color: light, zIndex: 15 }),
        img("img-couple2", 55, 1210, 280, 200, { radius: 8, borderColor: gold, borderWidth: 1 }),

        // ── Section 5: Quote ──
        txt("txt-quote", 30, 1440, 330, 80, "Every love story is beautiful,\nbut ours is my favorite.", { size: 16, font: "'Playfair Display', serif", color: light, italic: true, opacity: 0.9, zIndex: 16, lineHeight: 1.6 }),
        txt("txt-hashtag", 20, 1540, 350, 28, "#TenChuRe_TenCoDau", { size: 14, font: "'Inter', sans-serif", weight: "bold", color: gold, zIndex: 17 }),

        // ── Section 6: Venue ──
        txt("txt-venue-label", 20, 1600, 350, 28, "ĐỊA ĐIỂM TỔ CHỨC", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: gold, opacity: 0.7, zIndex: 18 }),
        txt("txt-venue", 20, 1630, 350, 60, "📍 Tên Nhà Hàng\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố", { size: 14, font: "'Inter', sans-serif", color: light, opacity: 0.85, zIndex: 19, lineHeight: 1.5 }),
    ];
}

/** Classic white/neutral variant — 18 elements across 2800px */
function makeClassicPreset(heading: string, body: string, deco: string): TemplateElement[] {
    return [
        // ── Section 1: Hero ──
        txt("txt-ceremony", 20, 30, 350, 36, "Lễ Vu Quy", { size: 20, font: "'Cormorant Garamond', serif", color: deco, italic: true, zIndex: 2, entrance: "fadeIn" }),
        img("img-main", 40, 80, 310, 330, { radius: 4, borderColor: deco, borderWidth: 1 }),
        txt("txt-deco1", 20, 420, 350, 28, "───────  ♡  ───────", { size: 12, font: "'Georgia', serif", color: deco, opacity: 0.4, zIndex: 4, locked: true }),

        // ── Section 2: Names & Invitation ──
        txt("txt-invite", 20, 460, 350, 32, "Trân trọng kính mời", { size: 16, font: "'Cormorant Garamond', serif", color: body, italic: true, zIndex: 5, entrance: "slideUp" }),
        txt("txt-names", 10, 500, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 36, font: "'Playfair Display', serif", weight: "bold", color: heading, zIndex: 6, lineHeight: 1.15, entrance: "zoomIn" }),
        txt("txt-family", 20, 610, 350, 56, "Cùng gia đình hai bên\ntrân trọng kính mời quý khách\ntới dự buổi lễ Vu Quy", { size: 14, font: "'Lora', serif", color: body, italic: true, opacity: 0.85, zIndex: 7, lineHeight: 1.5 }),
        txt("deco-mid", 20, 675, 350, 24, "♡ ─────────────── ♡", { size: 11, font: "'Georgia', serif", color: deco, opacity: 0.35, zIndex: 8, locked: true }),

        // ── Section 3: Date & Time ──
        txt("txt-weekday", 20, 720, 350, 30, "VÀO NGÀY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: body, opacity: 0.6, zIndex: 9 }),
        txt("txt-date", 20, 750, 350, 64, "Chủ Nhật, 28 · 05 · 2026", { size: 26, font: "'Cormorant Garamond', serif", weight: "bold", color: heading, zIndex: 10, lineHeight: 1.2 }),
        txt("txt-time", 20, 820, 350, 30, "Lúc 10:00 sáng", { size: 16, font: "'Lora', serif", color: body, italic: true, opacity: 0.8, zIndex: 11 }),

        // ── Section 4: Gallery ──
        img("img-groom", 25, 890, 165, 215, { radius: 4, borderColor: deco, borderWidth: 1, zIndex: 2 }),
        img("img-bride", 200, 890, 165, 215, { radius: 4, borderColor: deco, borderWidth: 1, zIndex: 3 }),
        txt("name-groom", 25, 1115, 165, 36, "Chú Rể", { size: 18, font: "'Playfair Display', serif", weight: "bold", color: heading, zIndex: 14 }),
        txt("name-bride", 200, 1115, 165, 36, "Cô Dâu", { size: 18, font: "'Playfair Display', serif", weight: "bold", color: heading, zIndex: 15 }),
        img("img-couple2", 55, 1175, 280, 200, { radius: 4, borderColor: deco, borderWidth: 1 }),

        // ── Section 5: Quote ──
        txt("txt-quote", 30, 1400, 330, 80, "Yeu la hanh phuc khi duoc o ben nhau,\nla niem vui moi ngay.", { size: 15, font: "'Lora', serif", color: body, italic: true, opacity: 0.85, zIndex: 16, lineHeight: 1.6 }),

        // ── Section 6: Venue ──
        txt("txt-venue-label", 20, 1510, 350, 28, "ĐỊA ĐIỂM TỔ CHỨC", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: body, opacity: 0.6, zIndex: 18 }),
        txt("txt-venue", 20, 1540, 350, 60, "📍 Tên Nhà Hàng\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố", { size: 14, font: "'Inter', sans-serif", color: body, opacity: 0.85, zIndex: 19, lineHeight: 1.5 }),
    ];
}

/** Traditional red/gold Vietnamese wedding — 20 elements across 2800px */
function makeTraditionalPreset(red: string, dark: string, gold: string): TemplateElement[] {
    return [
        // ── Section 1: Hero ──
        txt("txt-ceremony", 20, 25, 350, 40, "Lễ Thành Hôn", { size: 22, font: "'Dancing Script', cursive", color: red, weight: "bold", zIndex: 2, entrance: "fadeIn" }),
        img("img-main", 30, 75, 330, 340, { radius: 12, borderColor: gold, borderWidth: 3 }),
        txt("txt-deco1", 20, 425, 350, 30, "═══ 囍 ═══ 囍 ═══", { size: 14, font: "'Georgia', serif", color: red, opacity: 0.75, zIndex: 4, locked: true, weight: "bold" }),

        // ── Section 2: Names & Invitation ──
        txt("txt-invite", 20, 465, 350, 34, "Trân Trọng Kính Mời", { size: 17, font: "'Playfair Display', serif", weight: "bold", color: red, zIndex: 5, entrance: "slideUp" }),
        txt("txt-names", 10, 505, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 38, font: "'Dancing Script', cursive", weight: "bold", italic: true, color: dark, zIndex: 6, lineHeight: 1.15, entrance: "zoomIn" }),
        txt("txt-family", 20, 615, 350, 56, "Cùng gia đình hai bên\ntrân trọng kính mời quý khách\ntới dự buổi lễ Thành Hôn", { size: 14, font: "'Lora', serif", color: dark, italic: true, opacity: 0.9, zIndex: 7, lineHeight: 1.5 }),
        txt("deco-mid", 20, 680, 350, 24, "♦ ═════════════ ♦", { size: 12, font: "'Georgia', serif", color: red, opacity: 0.65, zIndex: 8, locked: true }),

        // ── Section 3: Date & Time ──
        txt("txt-weekday", 20, 725, 350, 30, "VÀO NGÀY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: dark, opacity: 0.7, zIndex: 9 }),
        txt("txt-date", 20, 755, 350, 64, "Chủ Nhật, 28 · 05 · 2026", { size: 26, font: "'Cormorant Garamond', serif", weight: "bold", color: dark, zIndex: 10, lineHeight: 1.2 }),
        txt("txt-time", 20, 825, 350, 30, "Lúc 10:00 sáng", { size: 16, font: "'Lora', serif", color: red, italic: true, opacity: 0.85, zIndex: 11 }),
        txt("txt-lunar", 20, 860, 350, 24, "(Tức ngày ... tháng ... năm Ất Tỵ)", { size: 12, font: "'Lora', serif", color: red, italic: true, opacity: 0.6, zIndex: 12 }),

        // ── Section 4: Gallery ──
        img("img-groom", 20, 915, 170, 220, { radius: 10, borderColor: gold, rotation: -2, zIndex: 2 }),
        img("img-bride", 200, 915, 170, 220, { radius: 10, borderColor: gold, rotation: 2, zIndex: 3 }),
        txt("name-groom", 20, 1145, 170, 36, "Chú Rể", { size: 18, font: "'Dancing Script', cursive", weight: "bold", color: dark, zIndex: 14 }),
        txt("name-bride", 200, 1145, 170, 36, "Cô Dâu", { size: 18, font: "'Dancing Script', cursive", weight: "bold", color: dark, zIndex: 15 }),
        img("img-couple2", 45, 1200, 300, 210, { radius: 12, borderColor: gold, borderWidth: 2 }),

        // ── Section 5: Quote ──
        txt("txt-quote", 25, 1440, 340, 80, "Tinh yeu la cung nhin ve mot huong.", { size: 16, font: "'Dancing Script', cursive", color: red, italic: true, opacity: 0.9, zIndex: 16, lineHeight: 1.6 }),
        txt("txt-hashtag", 20, 1540, 350, 28, "#TenChuRe_TenCoDau", { size: 14, font: "'Inter', sans-serif", weight: "bold", color: red, zIndex: 17 }),

        // ── Section 6: Venue ──
        txt("txt-venue-label", 20, 1600, 350, 28, "TƯ GIA NHÀ GÁI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: dark, opacity: 0.7, zIndex: 18 }),
        txt("txt-venue", 20, 1630, 350, 60, "📍 Tên Nhà Hàng\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố", { size: 14, font: "'Inter', sans-serif", color: dark, opacity: 0.9, zIndex: 19, lineHeight: 1.5 }),
    ];
}

// ═══════════════════════════════════════════════════════════════════
// ALL 75 TEMPLATE UNIQUE PRESETS
// ═══════════════════════════════════════════════════════════════════

export const TEMPLATE_UNIQUE_PRESETS: Record<string, TemplateElement[]> = {

    // ── WEDDING — Romantic Pink family (21 templates, each with unique tone) ──

    // thiep-cuoi-42: Most popular — deep blush, Great Vibes
    "thiep-cuoi-42": [
        img("img-main", 45, 20, 300, 230, { radius: 20, borderColor: "#fda4af", borderWidth: 3 }),
        img("img-groom", 28, 560, 152, 185, { radius: 14, borderColor: "#fb7185", rotation: -4, zIndex: 2 }),
        img("img-bride", 210, 560, 152, 185, { radius: 14, borderColor: "#fb7185", rotation: 4, zIndex: 3 }),
        txt("deco-top", 20, 258, 350, 28, "✦ ─────────── ✦", { size: 13, font: "'Georgia', serif", color: "#f472b6", opacity: 0.6, zIndex: 4, locked: true }),
        txt("txt-invite", 20, 288, 350, 32, "Trân trọng kính mời", { size: 14, font: "'Cormorant Garamond', serif", color: "#9f1239", italic: true }),
        txt("txt-names", 10, 320, 370, 80, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 34, font: "'Great Vibes', cursive", weight: "bold", italic: true, color: "#831843", zIndex: 6, lineHeight: 1.1 }),
        txt("deco-mid", 20, 404, 350, 24, "❀ ══════════════ ❀", { size: 12, font: "'Georgia', serif", color: "#fb7185", opacity: 0.5, zIndex: 7, locked: true }),
        txt("txt-family", 20, 432, 350, 50, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#6b2140", italic: true, opacity: 0.9, zIndex: 8, lineHeight: 1.6 }),
        txt("txt-date", 20, 490, 350, 46, "Chủ Nhật, 28 · 05 · 2026", { size: 24, font: "'Cormorant Garamond', serif", weight: "bold", color: "#831843", zIndex: 9 }),
        txt("txt-time", 20, 540, 350, 24, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#9f1239", italic: true, opacity: 0.85, zIndex: 10 }),
        txt("name-groom", 28, 750, 152, 36, "Tên Chú Rể", { size: 16, font: "'Great Vibes', cursive", weight: "bold", color: "#831843", zIndex: 11 }),
        txt("name-bride", 210, 750, 152, 36, "Tên Cô Dâu", { size: 16, font: "'Great Vibes', cursive", weight: "bold", color: "#831843", zIndex: 12 }),
        txt("txt-venue", 20, 792, 350, 50, "📍 Tên Địa Điểm\nĐịa chỉ nhà hàng tiệc cưới", { size: 12, font: "'Inter', sans-serif", color: "#6b2140", opacity: 0.85, zIndex: 13, lineHeight: 1.5 }),
    ],

    // thiep-cuoi-39: Dusty rose mauve
    "thiep-cuoi-39": makeRomanticPreset("#e8a4b8", "#6b2058", "#c87fa4", "'Playfair Display', serif", "~ ≈ ≈ ✿ ≈ ≈ ~"),
    // thiep-cuoi-46: Lavender purple blossoms
    "thiep-cuoi-46": makeRomanticPreset("#c4b5fd", "#5b21b6", "#a78bfa", "'Cormorant Garamond', serif", "✦ ─── ❋ ─── ✦"),
    // thiep-cuoi-38: Soft peach/coral
    "thiep-cuoi-38": makeRomanticPreset("#fca5a5", "#9f1239", "#f87171", "'Dancing Script', cursive", "✿ ──── ♡ ──── ✿"),
    // thiep-cuoi-44: Cream floral feminine
    "thiep-cuoi-44": makeRomanticPreset("#fde68a", "#92400e", "#fbbf24", "'Cormorant Garamond', serif", "✾ ════════ ✾"),
    // thiep-cuoi-40: Warm rose gold
    "thiep-cuoi-40": makeRomanticPreset("#fca5a5", "#831843", "#f9a8d4", "'Playfair Display', serif", "❀ ─────── ❀"),
    // thiep-cuoi-16: Classic rose
    "thiep-cuoi-16": makeRomanticPreset("#f9a8d4", "#831843", "#f472b6", "'Great Vibes', cursive", "✦ ──── ♡ ──── ✦"),
    // thiep-cuoi-47: Modern pink geometric
    "thiep-cuoi-47": makeRomanticPreset("#fda4af", "#9f1239", "#fb7185", "'Cormorant Garamond', serif", "── ✿ ──── ✿ ──"),
    // thiep-cuoi-48: Blush floral minimal
    "thiep-cuoi-48": makeRomanticPreset("#fecdd3", "#be185d", "#fda4af", "'Lora', serif", "✦ ─────── ✦"),
    // thiep-cuoi-19: Vintage rose
    "thiep-cuoi-19": makeRomanticPreset("#f9a8d4", "#7c3369", "#f472b6", "'Playfair Display', serif", "❀ ════════ ❀"),
    // thiep-cuoi-2: Simple pink
    "thiep-cuoi-2": makeRomanticPreset("#fda4af", "#831843", "#fb7185", "'Dancing Script', cursive", "✿ ──── ♡ ──── ✿"),
    // thiep-cuoi-43: Romantic rose delicate
    "thiep-cuoi-43": makeRomanticPreset("#fecdd3", "#9f1239", "#fda4af", "'Cormorant Garamond', serif", "✦ ─── ❀ ─── ✦"),
    // thiep-cuoi-21: Pink watercolor
    "thiep-cuoi-21": makeRomanticPreset("#f9a8d4", "#be185d", "#f472b6", "'Great Vibes', cursive", "✾ ══════ ✾"),
    // thiep-cuoi-14: Blush serif classic
    "thiep-cuoi-14": makeRomanticPreset("#fecdd3", "#831843", "#f9a8d4", "'Playfair Display', serif", "─── ♡ ───"),
    // thiep-cuoi-15: Soft pink botanical
    "thiep-cuoi-15": makeRomanticPreset("#fde8f3", "#9f1239", "#fca5e4", "'Lora', serif", "🌸 ─── 🌸"),
    // thiep-cuoi-50: Pink modern
    "thiep-cuoi-50": makeRomanticPreset("#fda4af", "#831843", "#fb7185", "'Cormorant Garamond', serif", "✦ ────── ✦"),
    // thiep-cuoi-24: Rose ombre
    "thiep-cuoi-24": makeRomanticPreset("#f9a8d4", "#7c3369", "#e879a7", "'Dancing Script', cursive", "❀ ════ ❀"),
    // thiep-cuoi-41: Pink script
    "thiep-cuoi-41": makeRomanticPreset("#fecdd3", "#be185d", "#fda4af", "'Great Vibes', cursive", "✿ ─── ♡ ─── ✿"),
    // thiep-cuoi-37: Rose blush
    "thiep-cuoi-37": makeRomanticPreset("#fda4af", "#9f1239", "#fb7185", "'Playfair Display', serif", "✦ ── ❀ ── ✦"),
    // thiep-cuoi-35: Pastel pink
    "thiep-cuoi-35": makeRomanticPreset("#fde8f3", "#831843", "#f9a8d4", "'Lora', serif", "✾ ════ ✾"),
    // thiep-cuoi-55: Floral blush
    "thiep-cuoi-55": makeRomanticPreset("#fecdd3", "#9f1239", "#fda4af", "'Cormorant Garamond', serif", "✦ ─── ✦"),

    // ── WEDDING — Luxury Dark family (10 templates) ──

    // thiep-cuoi-36: Primary luxury navy gold
    "thiep-cuoi-36": makeLuxuryPreset("#c9a84c", "#fef3c7", "◇ ╍╍╍╍╍╍╍╍╍╍╍╍ ◇"),
    // thiep-cuoi-53: Deep emerald gold
    "thiep-cuoi-53": makeLuxuryPreset("#d4a574", "#fef3c7", "◆ ─────────── ◆"),
    // thiep-cuoi-56: Midnight luxury
    "thiep-cuoi-56": makeLuxuryPreset("#c9a84c", "#fef9e7", "◇ ══════════ ◇"),
    // thiep-cuoi-52: Dark plum gold
    "thiep-cuoi-52": makeLuxuryPreset("#d4af37", "#fff8e1", "╌╌╌  ◆  ╌╌╌"),
    // thiep-cuoi-49: Black tie gold
    "thiep-cuoi-49": makeLuxuryPreset("#b8860b", "#fef3c7", "◆ ╌╌╌╌╌╌╌╌╌ ◆"),
    // thiep-cuoi-57: Onyx champagne
    "thiep-cuoi-57": makeLuxuryPreset("#d4a574", "#faf3e0", "◇ ───────── ◇"),
    // thiep-cuoi-54: Dark navy subtle gold
    "thiep-cuoi-54": makeLuxuryPreset("#c9a84c", "#fef3c7", "╍╍╍  ◈  ╍╍╍"),
    // thiep-cuoi-60: Modern dark minimal gold
    "thiep-cuoi-60": makeLuxuryPreset("#e5c678", "#fffbeb", "◆ ──────── ◆"),
    // thiep-cuoi-34: Dark chocolate gold
    "thiep-cuoi-34": makeLuxuryPreset("#d4a574", "#fef3c7", "╌  ◆  ╌  ◆  ╌"),
    // thiep-cuoi-33: Luxury velvet gold
    "thiep-cuoi-33": makeLuxuryPreset("#c9a84c", "#fff8e1", "◇ ╍╍╍╍╍╍╍╍╍ ◇"),

    // ── WEDDING — Classic White/Silver (12 templates) ──

    // thiep-cuoi-5: Clean white primary
    "thiep-cuoi-5": makeClassicPreset("#111827", "#4b5563", "#d1d5db"),
    // thiep-cuoi-23: Ivory warm
    "thiep-cuoi-23": makeClassicPreset("#1c1917", "#44403c", "#d6cfc7"),
    // thiep-cuoi-8: Silver pearl
    "thiep-cuoi-8": makeClassicPreset("#1e293b", "#475569", "#cbd5e1"),
    // thiep-cuoi-11: Cream linen
    "thiep-cuoi-11": makeClassicPreset("#292524", "#57534e", "#d6d3d1"),
    // thiep-cuoi-1: Pure white classic
    "thiep-cuoi-1": makeClassicPreset("#111827", "#6b7280", "#e5e7eb"),
    // thiep-cuoi-17: Soft grey elegant
    "thiep-cuoi-17": makeClassicPreset("#1f2937", "#4b5563", "#d1d5db"),
    // thiep-cuoi-12: Warm cream
    "thiep-cuoi-12": makeClassicPreset("#1c1917", "#57534e", "#e7e5e4"),
    // thiep-cuoi-7: White rose
    "thiep-cuoi-7": makeClassicPreset("#111827", "#374151", "#d1d5db"),
    // thiep-cuoi-4: Simple elegant
    "thiep-cuoi-4": makeClassicPreset("#18181b", "#52525b", "#d4d4d8"),
    // thiep-cuoi-3: Classic serif
    "thiep-cuoi-3": makeClassicPreset("#161616", "#404040", "#d4d4d4"),
    // thiep-cuoi-18: Art deco white
    "thiep-cuoi-18": makeClassicPreset("#1e1e1e", "#4a4a4a", "#c4c4c4"),
    // thiep-cuoi-22: Pearl white
    "thiep-cuoi-22": makeClassicPreset("#111827", "#6b7280", "#e5e7eb"),

    // ── WEDDING — Traditional Red/Gold Vietnamese (12 templates) ──

    // thiep-cuoi-28: Primary traditional
    "thiep-cuoi-28": makeTraditionalPreset("#dc2626", "#7f1d1d", "#fbbf24"),
    // thiep-cuoi-31: Dragon phoenix red
    "thiep-cuoi-31": makeTraditionalPreset("#b91c1c", "#7f1d1d", "#f59e0b"),
    // thiep-cuoi-30: Vermillion wedding
    "thiep-cuoi-30": makeTraditionalPreset("#dc2626", "#881337", "#fbbf24"),
    // thiep-cuoi-10: Red gold festive
    "thiep-cuoi-10": makeTraditionalPreset("#dc2626", "#7f1d1d", "#d97706"),
    // thiep-cuoi-6: Crimson traditional
    "thiep-cuoi-6": makeTraditionalPreset("#b91c1c", "#7f1d1d", "#f59e0b"),
    // thiep-cuoi-32: Scarlet ceremony
    "thiep-cuoi-32": makeTraditionalPreset("#dc2626", "#78181d", "#fbbf24"),
    // thiep-cuoi-20: Bold red classic
    "thiep-cuoi-20": makeTraditionalPreset("#ef4444", "#7f1d1d", "#f59e0b"),
    // thiep-cuoi-9: Dark red traditional
    "thiep-cuoi-9": makeTraditionalPreset("#b91c1c", "#6b1414", "#d97706"),
    // thiep-cuoi-13: Heritage red
    "thiep-cuoi-13": makeTraditionalPreset("#dc2626", "#7f1d1d", "#fbbf24"),
    // thiep-cuoi-29: Imperial red
    "thiep-cuoi-29": makeTraditionalPreset("#b91c1c", "#7f1d1d", "#f59e0b"),
    // thiep-cuoi-26: Red floral
    "thiep-cuoi-26": makeTraditionalPreset("#dc2626", "#881337", "#fbbf24"),
    // thiep-cuoi-27: Classic Vietnamese
    "thiep-cuoi-27": makeTraditionalPreset("#be123c", "#7f1d1d", "#d97706"),

    // ── WEDDING — Nature Green (2 templates) ──

    "thiep-cuoi-tone-xanh": [
        img("img-main", 45, 25, 300, 215, { radius: 20, borderColor: "#86efac", borderWidth: 3 }),
        img("img-groom", 35, 565, 145, 175, { radius: 14, borderColor: "#a7f3d0", rotation: -2, zIndex: 2 }),
        img("img-bride", 215, 565, 145, 175, { radius: 14, borderColor: "#a7f3d0", rotation: 2, zIndex: 3 }),
        txt("deco-top", 20, 252, 350, 28, "─── 🌿 ───── 🌿 ───", { size: 14, font: "'Georgia', serif", color: "#22c55e", opacity: 0.55, zIndex: 4, locked: true }),
        txt("txt-invite", 20, 283, 350, 32, "Trân trọng kính mời", { size: 15, font: "'Cormorant Garamond', serif", color: "#166534", italic: true }),
        txt("txt-names", 10, 315, 370, 80, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 32, font: "'Dancing Script', cursive", weight: "bold", italic: true, color: "#14532d", zIndex: 6, lineHeight: 1.15 }),
        txt("deco-mid", 20, 400, 350, 24, "🍃 ─────────────── 🍃", { size: 11, font: "'Georgia', serif", color: "#22c55e", opacity: 0.45, zIndex: 7, locked: true }),
        txt("txt-family", 20, 428, 350, 52, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Lora', serif", color: "#15803d", italic: true, opacity: 0.9, lineHeight: 1.6 }),
        txt("txt-date", 20, 490, 350, 46, "Chủ Nhật, 28 · 05 · 2026", { size: 22, font: "'Cormorant Garamond', serif", weight: "bold", color: "#14532d", zIndex: 9 }),
        txt("txt-time", 20, 540, 350, 28, "Lúc 10:00 sáng", { size: 14, font: "'Lora', serif", color: "#166534", italic: true, opacity: 0.85, zIndex: 10 }),
        txt("name-groom", 35, 745, 145, 36, "Tên Chú Rể", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#14532d", zIndex: 11 }),
        txt("name-bride", 215, 745, 145, 36, "Tên Cô Dâu", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: "#14532d", zIndex: 12 }),
        txt("txt-venue", 20, 790, 350, 50, "📍 Tên Địa Điểm\nĐịa chỉ nhà hàng tiệc cưới", { size: 12, font: "'Inter', sans-serif", color: "#15803d", opacity: 0.9, zIndex: 13, lineHeight: 1.5 }),
    ],
    "thiep-cuoi-25": makeRomanticPreset("#bbf7d0", "#14532d", "#86efac", "'Lora', serif", "🌿 ─────── 🌿"),

    // ── WEDDING — Modern Minimal B&W ──

    "thiep-bw-1": [
        img("img-main", 50, 20, 290, 220, { radius: 0, borderColor: "#18181b", borderWidth: 2 }),
        img("img-groom", 35, 570, 148, 175, { radius: 0, borderColor: "#3f3f46", borderWidth: 1, zIndex: 2 }),
        img("img-bride", 210, 570, 148, 175, { radius: 0, borderColor: "#3f3f46", borderWidth: 1, zIndex: 3 }),
        txt("deco-top", 20, 250, 350, 28, "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", { size: 10, font: "'Inter', sans-serif", color: "#71717a", opacity: 0.3, zIndex: 4, locked: true }),
        txt("txt-invite", 20, 280, 350, 32, "WE'RE GETTING MARRIED", { size: 11, font: "'Inter', sans-serif", weight: "bold", color: "#52525b", opacity: 0.8 }),
        txt("txt-names", 10, 314, 370, 78, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 34, font: "'Cormorant Garamond', serif", weight: "bold", color: "#18181b", zIndex: 6, lineHeight: 1.15 }),
        txt("deco-mid", 20, 396, 350, 24, "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", { size: 10, font: "'Inter', sans-serif", color: "#71717a", opacity: 0.25, zIndex: 7, locked: true }),
        txt("txt-family", 20, 424, 350, 50, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: "'Inter', sans-serif", color: "#3f3f46", opacity: 0.8, lineHeight: 1.6 }),
        txt("txt-date", 20, 482, 350, 44, "28 . 05 . 2026", { size: 28, font: "'Inter', sans-serif", weight: "bold", color: "#18181b", zIndex: 9 }),
        txt("txt-time", 20, 530, 350, 28, "10:00 AM", { size: 14, font: "'Inter', sans-serif", color: "#52525b", opacity: 0.7, zIndex: 10 }),
        txt("name-groom", 35, 750, 148, 32, "TÊN CHÚ RỂ", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: "#18181b", zIndex: 11 }),
        txt("name-bride", 210, 750, 148, 32, "TÊN CÔ DÂU", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: "#18181b", zIndex: 12 }),
        txt("txt-venue", 20, 790, 350, 48, "Tên Địa Điểm — Địa chỉ nhà hàng", { size: 11, font: "'Inter', sans-serif", color: "#52525b", opacity: 0.75, zIndex: 13, lineHeight: 1.5 }),
    ],

    // ── BIRTHDAY (6 templates) — Bright, celebration ──

    "thiep-sinh-nhat-01": makeRomanticPreset("#fda4af", "#be185d", "#f472b6", "'Pacifico', cursive", "🎂 ──── 🌟 ──── 🎂"),
    "thiep-sinh-nhat-06": makeRomanticPreset("#c4b5fd", "#5b21b6", "#a78bfa", "'Dancing Script', cursive", "🎉 ────── 🎉"),
    "thiep-sinh-nhat-05": makeRomanticPreset("#fde68a", "#92400e", "#fbbf24", "'Pacifico', cursive", "⭐ ─── 🎈 ─── ⭐"),
    "thiep-sinh-nhat-02": makeRomanticPreset("#fca5a5", "#9f1239", "#f87171", "'Dancing Script', cursive", "🎂 ══════ 🎂"),
    "thiep-sinh-nhat-04": makeRomanticPreset("#bfdbfe", "#1e40af", "#93c5fd", "'Pacifico', cursive", "🌟 ────── 🌟"),
    "thiep-sinh-nhat-03": makeRomanticPreset("#fde68a", "#78350f", "#fbbf24", "'Dancing Script', cursive", "🎉 ─── 🎈 ─── 🎉"),

    // ── GRADUATION (3 templates) — Academic, dignified ──

    "thiep-tot-nghiep-1": makeClassicPreset("#1e3a5f", "#2d5a8e", "#bfdbfe"),
    "thiep-tot-nghiep-3": makeClassicPreset("#1a1a2e", "#374151", "#c7d2fe"),
    "thiep-tot-nghiep-2": makeClassicPreset("#14532d", "#166534", "#bbf7d0"),

    // ── EVENTS — Kỷ yếu, Tân gia, Valentine, Tất niên ──

    "thiep-ky-yeu-mau1": makeClassicPreset("#1e3a5f", "#374151", "#bfdbfe"),
    "thiep-ky-yeu-mau2": makeClassicPreset("#312e81", "#4338ca", "#c7d2fe"),
    "thiep-tan-gia-1": makeTraditionalPreset("#dc2626", "#7f1d1d", "#fbbf24"),
    "thiep-tan-gia-2": makeRomanticPreset("#fde68a", "#92400e", "#fbbf24", "'Lora', serif", "🏡 ──────── 🏡"),
    "thiep-valentine-1": makeRomanticPreset("#fda4af", "#be185d", "#f472b6", "'Great Vibes', cursive", "❤️ ────── ❤️"),
    "tiec-tat-nien-3": makeLuxuryPreset("#d4a574", "#fef3c7", "◆ ───── ◆"),
    "thiep-tat-nien-4": makeLuxuryPreset("#c9a84c", "#fef3c7", "◇ ══════ ◇"),
    "tiec-tat-nien-1": makeLuxuryPreset("#b8860b", "#fef9e7", "◆ ╍╍╍╍╍╍ ◆"),
};
