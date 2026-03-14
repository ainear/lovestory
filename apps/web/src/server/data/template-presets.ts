/**
 * Per-template unique element presets for ALL 75 Cinelove templates.
 * Sprint 59: Rich 32-element layouts (5000px canvas) with CineLove parity
 * 
 * Sections: Hero → Names → Family (NhaTrai/NhaGai) → Date/Events → Gallery → Quote → Venue
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
    "img-gallery1": "/placeholder-couple.png",
    "img-gallery2": "/placeholder-groom.png",
    "img-gallery3": "/placeholder-bride.png",
    "img-gallery4": "/placeholder-couple.png",
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
// PRESET FACTORIES — Sprint 59: Rich 32-element layouts (5000px canvas)
// ═══════════════════════════════════════════

/** Romantic pink variant — 32 elements across 5000px (CineLove parity) */
function makeRomanticPreset(accent: string, text: string, deco: string, font: string, decoText: string): TemplateElement[] {
    return [
        txt("txt-ceremony", 20, 30, 350, 36, "Le Thanh Hon", { size: 18, font: "'Cormorant Garamond', serif", color: deco, italic: true, zIndex: 2 }),
        img("img-main", 30, 80, 330, 380, { radius: 20, borderColor: accent, borderWidth: 3 }),
        txt("txt-deco1", 20, 470, 350, 24, decoText, { size: 12, font: "'Georgia', serif", color: deco, opacity: 0.5, zIndex: 4, locked: true }),
        txt("txt-invite", 20, 510, 350, 32, "Tran trong kinh moi", { size: 15, font: font, color: text, italic: true, zIndex: 5 }),
        txt("txt-names", 10, 550, 370, 110, "Ten Chu Re\n&\nTen Co Dau", { size: 40, font: "'Dancing Script', cursive", weight: "bold", italic: true, color: text, zIndex: 6, lineHeight: 1.1 }),
        txt("txt-family", 20, 670, 350, 56, "Cung gia dinh hai ben\ntran trong kinh moi quy khach\ntoi du buoi le Vu Quy", { size: 14, font: "'Lora', serif", color: text, italic: true, opacity: 0.9, zIndex: 7, lineHeight: 1.5 }),
        txt("deco-family", 20, 750, 350, 24, decoText, { size: 12, font: "'Georgia', serif", color: deco, opacity: 0.5, zIndex: 8, locked: true }),
        txt("txt-nhatrai-label", 20, 790, 170, 28, "NHA TRAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: accent, zIndex: 9 }),
        txt("txt-nhatrai", 20, 820, 170, 70, "Ong: Ho ten cha\nBa: Ho ten me\nCon trai: Ten Chu Re", { size: 12, font: "'Lora', serif", color: text, opacity: 0.85, zIndex: 10, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 790, 170, 28, "NHA GAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: accent, zIndex: 11 }),
        txt("txt-nhagai", 200, 820, 170, 70, "Ong: Ho ten cha\nBa: Ho ten me\nCon gai: Ten Co Dau", { size: 12, font: "'Lora', serif", color: text, opacity: 0.85, zIndex: 12, lineHeight: 1.8, align: "left" }),
        img("img-groom", 40, 910, 140, 180, { radius: 14, borderColor: deco, rotation: -3, zIndex: 2 }),
        img("img-bride", 210, 910, 140, 180, { radius: 14, borderColor: deco, rotation: 3, zIndex: 3 }),
        txt("name-groom", 40, 1100, 140, 32, "Chu Re", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: text, zIndex: 14 }),
        txt("name-bride", 210, 1100, 140, 32, "Co Dau", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: text, zIndex: 15 }),
        txt("txt-weekday", 20, 1160, 350, 30, "VAO NGAY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: text, opacity: 0.7, zIndex: 16 }),
        txt("txt-date", 20, 1190, 350, 70, "Chu Nhat, 28 . 05 . 2026", { size: 30, font: "'Cormorant Garamond', serif", weight: "bold", color: text, zIndex: 17, lineHeight: 1.2 }),
        txt("txt-time", 20, 1265, 350, 30, "Luc 10:00 sang", { size: 16, font: "'Lora', serif", color: text, italic: true, opacity: 0.85, zIndex: 18 }),
        txt("txt-lunar", 20, 1300, 350, 24, "(Tuc ngay ... thang ... nam ...)", { size: 12, font: "'Lora', serif", color: deco, italic: true, opacity: 0.65, zIndex: 19 }),
        txt("txt-event1-label", 20, 1350, 170, 24, "LE VU QUY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: accent, zIndex: 20 }),
        txt("txt-event1", 20, 1375, 170, 50, "08:00 Sang\nTu gia Nha Gai\nDia chi Nha Gai", { size: 11, font: "'Inter', sans-serif", color: text, opacity: 0.8, zIndex: 21, lineHeight: 1.6, align: "left" }),
        txt("txt-event2-label", 200, 1350, 170, 24, "TIEC CUOI", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: accent, zIndex: 22 }),
        txt("txt-event2", 200, 1375, 170, 50, "17:00 Chieu\nNha Hang ABC\nDia chi Nha Hang", { size: 11, font: "'Inter', sans-serif", color: text, opacity: 0.8, zIndex: 23, lineHeight: 1.6, align: "left" }),
        img("img-couple2", 30, 1460, 330, 220, { radius: 16, borderColor: accent, borderWidth: 2 }),
        img("img-gallery1", 30, 1700, 160, 160, { radius: 12, borderColor: deco }),
        img("img-gallery2", 200, 1700, 160, 160, { radius: 12, borderColor: deco }),
        img("img-gallery3", 30, 1870, 160, 160, { radius: 12, borderColor: deco }),
        img("img-gallery4", 200, 1870, 160, 160, { radius: 12, borderColor: deco }),
        txt("txt-quote", 30, 2060, 330, 80, "Yeu la hanh phuc khi duoc o ben nhau,\nla niem vui moi ngay.", { size: 15, font: "'Lora', serif", color: text, italic: true, opacity: 0.9, zIndex: 24, lineHeight: 1.6 }),
        txt("txt-hashtag", 20, 2160, 350, 28, "#TenChuRe_TenCoDau", { size: 14, font: "'Inter', sans-serif", weight: "bold", color: accent, zIndex: 25 }),
        txt("txt-venue-label", 20, 2220, 350, 28, "DIA DIEM TO CHUC", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: text, opacity: 0.7, zIndex: 26 }),
        txt("txt-venue", 20, 2250, 350, 60, "Ten Nha Hang\nDia chi nha hang tiec cuoi\nQuan, Thanh pho", { size: 14, font: "'Inter', sans-serif", color: text, opacity: 0.9, zIndex: 27, lineHeight: 1.5 }),
    ];
}

function makeLuxuryPreset(gold: string, light: string, midDeco: string): TemplateElement[] {
    return [
        txt("txt-ceremony", 20, 30, 350, 36, "Wedding Invitation", { size: 16, font: "'Cormorant Garamond', serif", color: gold, italic: true, zIndex: 2 }),
        img("img-main", 30, 80, 330, 380, { radius: 8, borderColor: gold, borderWidth: 2 }),
        txt("txt-deco1", 20, 470, 350, 28, midDeco, { size: 13, font: "'Georgia', serif", color: gold, opacity: 0.5, zIndex: 4, locked: true }),
        txt("txt-invite", 20, 510, 350, 32, "TRAN TRONG KINH MOI", { size: 13, font: "'Cormorant Garamond', serif", weight: "bold", color: gold, zIndex: 5 }),
        txt("txt-names", 10, 550, 370, 110, "Ten Chu Re\n&\nTen Co Dau", { size: 40, font: "'Playfair Display', serif", weight: "bold", italic: true, color: light, zIndex: 6, lineHeight: 1.1 }),
        txt("txt-family", 20, 670, 350, 56, "Cung gia dinh hai ben\ntran trong kinh moi quy khach\ntoi du buoi le Thanh Hon", { size: 14, font: "'Lora', serif", color: light, italic: true, opacity: 0.85, zIndex: 7, lineHeight: 1.5 }),
        txt("deco-family", 20, 750, 350, 28, midDeco, { size: 11, font: "'Georgia', serif", color: gold, opacity: 0.4, zIndex: 8, locked: true }),
        txt("txt-nhatrai-label", 20, 790, 170, 28, "NHA TRAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: gold, zIndex: 9 }),
        txt("txt-nhatrai", 20, 820, 170, 70, "Ong: Ho ten cha\nBa: Ho ten me\nCon trai: Ten Chu Re", { size: 12, font: "'Lora', serif", color: light, opacity: 0.85, zIndex: 10, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 790, 170, 28, "NHA GAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: gold, zIndex: 11 }),
        txt("txt-nhagai", 200, 820, 170, 70, "Ong: Ho ten cha\nBa: Ho ten me\nCon gai: Ten Co Dau", { size: 12, font: "'Lora', serif", color: light, opacity: 0.85, zIndex: 12, lineHeight: 1.8, align: "left" }),
        img("img-groom", 40, 910, 140, 180, { radius: 6, borderColor: gold, zIndex: 2 }),
        img("img-bride", 210, 910, 140, 180, { radius: 6, borderColor: gold, zIndex: 3 }),
        txt("name-groom", 40, 1100, 140, 32, "Chu Re", { size: 16, font: "'Playfair Display', serif", weight: "bold", italic: true, color: light, zIndex: 14 }),
        txt("name-bride", 210, 1100, 140, 32, "Co Dau", { size: 16, font: "'Playfair Display', serif", weight: "bold", italic: true, color: light, zIndex: 15 }),
        txt("txt-weekday", 20, 1160, 350, 30, "VAO NGAY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: gold, opacity: 0.7, zIndex: 16 }),
        txt("txt-date", 20, 1190, 350, 70, "Chu Nhat, 28 . 05 . 2026", { size: 30, font: "'Cormorant Garamond', serif", weight: "bold", color: light, zIndex: 17, lineHeight: 1.2 }),
        txt("txt-time", 20, 1265, 350, 30, "Luc 10:00 sang", { size: 16, font: "'Lora', serif", color: gold, italic: true, opacity: 0.85, zIndex: 18 }),
        txt("txt-lunar", 20, 1300, 350, 24, "(Tuc ngay ... thang ... nam ...)", { size: 12, font: "'Lora', serif", color: gold, italic: true, opacity: 0.55, zIndex: 19 }),
        txt("txt-event1-label", 20, 1350, 170, 24, "LE VU QUY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: gold, zIndex: 20 }),
        txt("txt-event1", 20, 1375, 170, 50, "08:00 Sang\nTu gia Nha Gai\nDia chi Nha Gai", { size: 11, font: "'Inter', sans-serif", color: light, opacity: 0.8, zIndex: 21, lineHeight: 1.6, align: "left" }),
        txt("txt-event2-label", 200, 1350, 170, 24, "TIEC CUOI", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: gold, zIndex: 22 }),
        txt("txt-event2", 200, 1375, 170, 50, "17:00 Chieu\nNha Hang ABC\nDia chi Nha Hang", { size: 11, font: "'Inter', sans-serif", color: light, opacity: 0.8, zIndex: 23, lineHeight: 1.6, align: "left" }),
        img("img-couple2", 30, 1460, 330, 220, { radius: 8, borderColor: gold, borderWidth: 1 }),
        img("img-gallery1", 30, 1700, 160, 160, { radius: 6, borderColor: gold }),
        img("img-gallery2", 200, 1700, 160, 160, { radius: 6, borderColor: gold }),
        img("img-gallery3", 30, 1870, 160, 160, { radius: 6, borderColor: gold }),
        img("img-gallery4", 200, 1870, 160, 160, { radius: 6, borderColor: gold }),
        txt("txt-quote", 30, 2060, 330, 80, "Every love story is beautiful,\nbut ours is my favorite.", { size: 16, font: "'Playfair Display', serif", color: light, italic: true, opacity: 0.9, zIndex: 24, lineHeight: 1.6 }),
        txt("txt-hashtag", 20, 2160, 350, 28, "#TenChuRe_TenCoDau", { size: 14, font: "'Inter', sans-serif", weight: "bold", color: gold, zIndex: 25 }),
        txt("txt-venue-label", 20, 2220, 350, 28, "DIA DIEM TO CHUC", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: gold, opacity: 0.7, zIndex: 26 }),
        txt("txt-venue", 20, 2250, 350, 60, "Ten Nha Hang\nDia chi nha hang tiec cuoi\nQuan, Thanh pho", { size: 14, font: "'Inter', sans-serif", color: light, opacity: 0.85, zIndex: 27, lineHeight: 1.5 }),
    ];
}

function makeClassicPreset(heading: string, body: string, deco: string): TemplateElement[] {
    return [
        txt("txt-ceremony", 20, 30, 350, 36, "Le Vu Quy", { size: 20, font: "'Cormorant Garamond', serif", color: deco, italic: true, zIndex: 2 }),
        img("img-main", 40, 80, 310, 370, { radius: 4, borderColor: deco, borderWidth: 1 }),
        txt("txt-deco1", 20, 460, 350, 28, "--- <3 ---", { size: 12, font: "'Georgia', serif", color: deco, opacity: 0.4, zIndex: 4, locked: true }),
        txt("txt-invite", 20, 500, 350, 32, "Tran trong kinh moi", { size: 16, font: "'Cormorant Garamond', serif", color: body, italic: true, zIndex: 5 }),
        txt("txt-names", 10, 540, 370, 110, "Ten Chu Re\n&\nTen Co Dau", { size: 38, font: "'Playfair Display', serif", weight: "bold", color: heading, zIndex: 6, lineHeight: 1.15 }),
        txt("txt-family", 20, 660, 350, 56, "Cung gia dinh hai ben\ntran trong kinh moi quy khach\ntoi du buoi le Vu Quy", { size: 14, font: "'Lora', serif", color: body, italic: true, opacity: 0.85, zIndex: 7, lineHeight: 1.5 }),
        txt("deco-family", 20, 740, 350, 24, "--- <3 ---", { size: 11, font: "'Georgia', serif", color: deco, opacity: 0.35, zIndex: 8, locked: true }),
        txt("txt-nhatrai-label", 20, 780, 170, 28, "NHA TRAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: heading, zIndex: 9 }),
        txt("txt-nhatrai", 20, 810, 170, 70, "Ong: Ho ten cha\nBa: Ho ten me\nCon trai: Ten Chu Re", { size: 12, font: "'Lora', serif", color: body, opacity: 0.85, zIndex: 10, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 780, 170, 28, "NHA GAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: heading, zIndex: 11 }),
        txt("txt-nhagai", 200, 810, 170, 70, "Ong: Ho ten cha\nBa: Ho ten me\nCon gai: Ten Co Dau", { size: 12, font: "'Lora', serif", color: body, opacity: 0.85, zIndex: 12, lineHeight: 1.8, align: "left" }),
        img("img-groom", 40, 900, 140, 180, { radius: 4, borderColor: deco, borderWidth: 1, zIndex: 2 }),
        img("img-bride", 210, 900, 140, 180, { radius: 4, borderColor: deco, borderWidth: 1, zIndex: 3 }),
        txt("name-groom", 40, 1090, 140, 32, "Chu Re", { size: 16, font: "'Playfair Display', serif", weight: "bold", color: heading, zIndex: 14 }),
        txt("name-bride", 210, 1090, 140, 32, "Co Dau", { size: 16, font: "'Playfair Display', serif", weight: "bold", color: heading, zIndex: 15 }),
        txt("txt-weekday", 20, 1150, 350, 30, "VAO NGAY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: body, opacity: 0.6, zIndex: 16 }),
        txt("txt-date", 20, 1180, 350, 70, "Chu Nhat, 28 . 05 . 2026", { size: 28, font: "'Cormorant Garamond', serif", weight: "bold", color: heading, zIndex: 17, lineHeight: 1.2 }),
        txt("txt-time", 20, 1255, 350, 30, "Luc 10:00 sang", { size: 16, font: "'Lora', serif", color: body, italic: true, opacity: 0.8, zIndex: 18 }),
        txt("txt-event1-label", 20, 1310, 170, 24, "LE VU QUY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: heading, zIndex: 20 }),
        txt("txt-event1", 20, 1335, 170, 50, "08:00 Sang\nTu gia Nha Gai\nDia chi Nha Gai", { size: 11, font: "'Inter', sans-serif", color: body, opacity: 0.8, zIndex: 21, lineHeight: 1.6, align: "left" }),
        txt("txt-event2-label", 200, 1310, 170, 24, "TIEC CUOI", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: heading, zIndex: 22 }),
        txt("txt-event2", 200, 1335, 170, 50, "17:00 Chieu\nNha Hang ABC\nDia chi Nha Hang", { size: 11, font: "'Inter', sans-serif", color: body, opacity: 0.8, zIndex: 23, lineHeight: 1.6, align: "left" }),
        img("img-couple2", 40, 1420, 310, 220, { radius: 4, borderColor: deco, borderWidth: 1 }),
        img("img-gallery1", 30, 1660, 160, 160, { radius: 4, borderColor: deco }),
        img("img-gallery2", 200, 1660, 160, 160, { radius: 4, borderColor: deco }),
        img("img-gallery3", 30, 1830, 160, 160, { radius: 4, borderColor: deco }),
        img("img-gallery4", 200, 1830, 160, 160, { radius: 4, borderColor: deco }),
        txt("txt-quote", 30, 2020, 330, 60, "Yeu la hanh phuc khi duoc o ben nhau.", { size: 15, font: "'Lora', serif", color: body, italic: true, opacity: 0.85, zIndex: 24, lineHeight: 1.6 }),
        txt("txt-venue-label", 20, 2110, 350, 28, "DIA DIEM TO CHUC", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: body, opacity: 0.6, zIndex: 26 }),
        txt("txt-venue", 20, 2140, 350, 60, "Ten Nha Hang\nDia chi nha hang tiec cuoi\nQuan, Thanh pho", { size: 14, font: "'Inter', sans-serif", color: body, opacity: 0.85, zIndex: 27, lineHeight: 1.5 }),
    ];
}

function makeTraditionalPreset(red: string, dark: string, gold: string): TemplateElement[] {
    return [
        txt("txt-ceremony", 20, 25, 350, 40, "Le Thanh Hon", { size: 22, font: "'Dancing Script', cursive", color: red, weight: "bold", zIndex: 2 }),
        img("img-main", 30, 75, 330, 380, { radius: 12, borderColor: gold, borderWidth: 3 }),
        txt("txt-deco1", 20, 465, 350, 30, "=== Xi ===", { size: 14, font: "'Georgia', serif", color: red, opacity: 0.75, zIndex: 4, locked: true, weight: "bold" }),
        txt("txt-invite", 20, 505, 350, 34, "Tran Trong Kinh Moi", { size: 17, font: "'Playfair Display', serif", weight: "bold", color: red, zIndex: 5 }),
        txt("txt-names", 10, 545, 370, 110, "Ten Chu Re\n&\nTen Co Dau", { size: 40, font: "'Dancing Script', cursive", weight: "bold", italic: true, color: dark, zIndex: 6, lineHeight: 1.15 }),
        txt("txt-family", 20, 665, 350, 56, "Cung gia dinh hai ben\ntran trong kinh moi quy khach\ntoi du buoi le Thanh Hon", { size: 14, font: "'Lora', serif", color: dark, italic: true, opacity: 0.9, zIndex: 7, lineHeight: 1.5 }),
        txt("deco-family", 20, 740, 350, 24, "=== Xi ===", { size: 12, font: "'Georgia', serif", color: red, opacity: 0.65, zIndex: 8, locked: true }),
        txt("txt-nhatrai-label", 20, 780, 170, 28, "NHA TRAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: red, zIndex: 9 }),
        txt("txt-nhatrai", 20, 810, 170, 70, "Ong: Ho ten cha\nBa: Ho ten me\nCon trai: Ten Chu Re", { size: 12, font: "'Lora', serif", color: dark, opacity: 0.85, zIndex: 10, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 780, 170, 28, "NHA GAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: red, zIndex: 11 }),
        txt("txt-nhagai", 200, 810, 170, 70, "Ong: Ho ten cha\nBa: Ho ten me\nCon gai: Ten Co Dau", { size: 12, font: "'Lora', serif", color: dark, opacity: 0.85, zIndex: 12, lineHeight: 1.8, align: "left" }),
        img("img-groom", 40, 900, 140, 180, { radius: 10, borderColor: gold, rotation: -2, zIndex: 2 }),
        img("img-bride", 210, 900, 140, 180, { radius: 10, borderColor: gold, rotation: 2, zIndex: 3 }),
        txt("name-groom", 40, 1090, 140, 32, "Chu Re", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: dark, zIndex: 14 }),
        txt("name-bride", 210, 1090, 140, 32, "Co Dau", { size: 16, font: "'Dancing Script', cursive", weight: "bold", color: dark, zIndex: 15 }),
        txt("txt-weekday", 20, 1150, 350, 30, "VAO NGAY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: dark, opacity: 0.7, zIndex: 16 }),
        txt("txt-date", 20, 1180, 350, 70, "Chu Nhat, 28 . 05 . 2026", { size: 28, font: "'Cormorant Garamond', serif", weight: "bold", color: dark, zIndex: 17, lineHeight: 1.2 }),
        txt("txt-time", 20, 1255, 350, 30, "Luc 10:00 sang", { size: 16, font: "'Lora', serif", color: red, italic: true, opacity: 0.85, zIndex: 18 }),
        txt("txt-lunar", 20, 1290, 350, 24, "(Tuc ngay ... thang ... nam At Ty)", { size: 12, font: "'Lora', serif", color: red, italic: true, opacity: 0.6, zIndex: 19 }),
        txt("txt-event1-label", 20, 1340, 170, 24, "LE VU QUY", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: red, zIndex: 20 }),
        txt("txt-event1", 20, 1365, 170, 50, "08:00 Sang\nTu gia Nha Gai\nDia chi Nha Gai", { size: 11, font: "'Inter', sans-serif", color: dark, opacity: 0.8, zIndex: 21, lineHeight: 1.6, align: "left" }),
        txt("txt-event2-label", 200, 1340, 170, 24, "TIEC CUOI", { size: 12, font: "'Inter', sans-serif", weight: "bold", color: red, zIndex: 22 }),
        txt("txt-event2", 200, 1365, 170, 50, "17:00 Chieu\nNha Hang ABC\nDia chi Nha Hang", { size: 11, font: "'Inter', sans-serif", color: dark, opacity: 0.8, zIndex: 23, lineHeight: 1.6, align: "left" }),
        img("img-couple2", 30, 1450, 330, 220, { radius: 12, borderColor: gold, borderWidth: 2 }),
        img("img-gallery1", 30, 1690, 160, 160, { radius: 10, borderColor: gold }),
        img("img-gallery2", 200, 1690, 160, 160, { radius: 10, borderColor: gold }),
        img("img-gallery3", 30, 1860, 160, 160, { radius: 10, borderColor: gold }),
        img("img-gallery4", 200, 1860, 160, 160, { radius: 10, borderColor: gold }),
        txt("txt-quote", 25, 2050, 340, 60, "Tinh yeu la cung nhin ve mot huong.", { size: 16, font: "'Dancing Script', cursive", color: red, italic: true, opacity: 0.9, zIndex: 24, lineHeight: 1.6 }),
        txt("txt-hashtag", 20, 2130, 350, 28, "#TenChuRe_TenCoDau", { size: 14, font: "'Inter', sans-serif", weight: "bold", color: red, zIndex: 25 }),
        txt("txt-venue-label", 20, 2190, 350, 28, "TU GIA NHA GAI", { size: 13, font: "'Inter', sans-serif", weight: "bold", color: dark, opacity: 0.7, zIndex: 26 }),
        txt("txt-venue", 20, 2220, 350, 60, "Ten Nha Hang\nDia chi nha hang tiec cuoi\nQuan, Thanh pho", { size: 14, font: "'Inter', sans-serif", color: dark, opacity: 0.9, zIndex: 27, lineHeight: 1.5 }),
    ];
}

// ═══════════════════════════════════════════════════════════════════
// ALL 75 TEMPLATE UNIQUE PRESETS
// ═══════════════════════════════════════════════════════════════════

export const TEMPLATE_UNIQUE_PRESETS: Record<string, TemplateElement[]> = {

    // ── WEDDING Romantic Pink (21) ──
    "thiep-cuoi-42": makeRomanticPreset("#fda4af", "#831843", "#f472b6", "'Great Vibes', cursive", "* --- * --- *"),
    "thiep-cuoi-39": makeRomanticPreset("#e8a4b8", "#6b2058", "#c87fa4", "'Playfair Display', serif", "~ * ~"),
    "thiep-cuoi-46": makeRomanticPreset("#c4b5fd", "#5b21b6", "#a78bfa", "'Cormorant Garamond', serif", "* --- *"),
    "thiep-cuoi-38": makeRomanticPreset("#fca5a5", "#9f1239", "#f87171", "'Dancing Script', cursive", "* ---- *"),
    "thiep-cuoi-44": makeRomanticPreset("#fde68a", "#92400e", "#fbbf24", "'Cormorant Garamond', serif", "* ==== *"),
    "thiep-cuoi-40": makeRomanticPreset("#fca5a5", "#831843", "#f9a8d4", "'Playfair Display', serif", "* --- *"),
    "thiep-cuoi-16": makeRomanticPreset("#f9a8d4", "#831843", "#f472b6", "'Great Vibes', cursive", "* ---- *"),
    "thiep-cuoi-47": makeRomanticPreset("#fda4af", "#9f1239", "#fb7185", "'Cormorant Garamond', serif", "-- * ---- * --"),
    "thiep-cuoi-48": makeRomanticPreset("#fecdd3", "#be185d", "#fda4af", "'Lora', serif", "* ------- *"),
    "thiep-cuoi-19": makeRomanticPreset("#f9a8d4", "#7c3369", "#f472b6", "'Playfair Display', serif", "* ======== *"),
    "thiep-cuoi-2": makeRomanticPreset("#fda4af", "#831843", "#fb7185", "'Dancing Script', cursive", "* ---- *"),
    "thiep-cuoi-43": makeRomanticPreset("#fecdd3", "#9f1239", "#fda4af", "'Cormorant Garamond', serif", "* --- * --- *"),
    "thiep-cuoi-21": makeRomanticPreset("#f9a8d4", "#be185d", "#f472b6", "'Great Vibes', cursive", "* ====== *"),
    "thiep-cuoi-14": makeRomanticPreset("#fecdd3", "#831843", "#f9a8d4", "'Playfair Display', serif", "--- * ---"),
    "thiep-cuoi-15": makeRomanticPreset("#fde8f3", "#9f1239", "#fca5e4", "'Lora', serif", "* --- *"),
    "thiep-cuoi-50": makeRomanticPreset("#fda4af", "#831843", "#fb7185", "'Cormorant Garamond', serif", "* ------ *"),
    "thiep-cuoi-24": makeRomanticPreset("#f9a8d4", "#7c3369", "#e879a7", "'Dancing Script', cursive", "* ==== *"),
    "thiep-cuoi-41": makeRomanticPreset("#fecdd3", "#be185d", "#fda4af", "'Great Vibes', cursive", "* --- * --- *"),
    "thiep-cuoi-37": makeRomanticPreset("#fda4af", "#9f1239", "#fb7185", "'Playfair Display', serif", "* -- * -- *"),
    "thiep-cuoi-35": makeRomanticPreset("#fde8f3", "#831843", "#f9a8d4", "'Lora', serif", "* ==== *"),
    "thiep-cuoi-55": makeRomanticPreset("#fecdd3", "#9f1239", "#fda4af", "'Cormorant Garamond', serif", "* --- *"),

    // ── WEDDING Luxury Dark (10) ──
    "thiep-cuoi-36": makeLuxuryPreset("#c9a84c", "#fef3c7", "--- * ---"),
    "thiep-cuoi-53": makeLuxuryPreset("#d4a574", "#fef3c7", "* ------- *"),
    "thiep-cuoi-56": makeLuxuryPreset("#c9a84c", "#fef9e7", "* ======= *"),
    "thiep-cuoi-52": makeLuxuryPreset("#d4af37", "#fff8e1", "--- * ---"),
    "thiep-cuoi-49": makeLuxuryPreset("#b8860b", "#fef3c7", "* ------- *"),
    "thiep-cuoi-57": makeLuxuryPreset("#d4a574", "#faf3e0", "* ------- *"),
    "thiep-cuoi-54": makeLuxuryPreset("#c9a84c", "#fef3c7", "--- * ---"),
    "thiep-cuoi-60": makeLuxuryPreset("#e5c678", "#fffbeb", "* ------ *"),
    "thiep-cuoi-34": makeLuxuryPreset("#d4a574", "#fef3c7", "- * - * -"),
    "thiep-cuoi-33": makeLuxuryPreset("#c9a84c", "#fff8e1", "* ------- *"),

    // ── WEDDING Classic White/Silver (12) ──
    "thiep-cuoi-5": makeClassicPreset("#111827", "#4b5563", "#d1d5db"),
    "thiep-cuoi-23": makeClassicPreset("#1c1917", "#44403c", "#d6cfc7"),
    "thiep-cuoi-8": makeClassicPreset("#1e293b", "#475569", "#cbd5e1"),
    "thiep-cuoi-11": makeClassicPreset("#292524", "#57534e", "#d6d3d1"),
    "thiep-cuoi-1": makeClassicPreset("#111827", "#6b7280", "#e5e7eb"),
    "thiep-cuoi-17": makeClassicPreset("#1f2937", "#4b5563", "#d1d5db"),
    "thiep-cuoi-12": makeClassicPreset("#1c1917", "#57534e", "#e7e5e4"),
    "thiep-cuoi-7": makeClassicPreset("#111827", "#374151", "#d1d5db"),
    "thiep-cuoi-4": makeClassicPreset("#18181b", "#52525b", "#d4d4d8"),
    "thiep-cuoi-3": makeClassicPreset("#161616", "#404040", "#d4d4d4"),
    "thiep-cuoi-18": makeClassicPreset("#1e1e1e", "#4a4a4a", "#c4c4c4"),
    "thiep-cuoi-22": makeClassicPreset("#111827", "#6b7280", "#e5e7eb"),

    // ── WEDDING Traditional Red/Gold Vietnamese (12) ──
    "thiep-cuoi-28": makeTraditionalPreset("#dc2626", "#7f1d1d", "#fbbf24"),
    "thiep-cuoi-31": makeTraditionalPreset("#b91c1c", "#7f1d1d", "#f59e0b"),
    "thiep-cuoi-30": makeTraditionalPreset("#dc2626", "#881337", "#fbbf24"),
    "thiep-cuoi-10": makeTraditionalPreset("#dc2626", "#7f1d1d", "#d97706"),
    "thiep-cuoi-6": makeTraditionalPreset("#b91c1c", "#7f1d1d", "#f59e0b"),
    "thiep-cuoi-32": makeTraditionalPreset("#dc2626", "#78181d", "#fbbf24"),
    "thiep-cuoi-20": makeTraditionalPreset("#ef4444", "#7f1d1d", "#f59e0b"),
    "thiep-cuoi-9": makeTraditionalPreset("#b91c1c", "#6b1414", "#d97706"),
    "thiep-cuoi-13": makeTraditionalPreset("#dc2626", "#7f1d1d", "#fbbf24"),
    "thiep-cuoi-29": makeTraditionalPreset("#b91c1c", "#7f1d1d", "#f59e0b"),
    "thiep-cuoi-26": makeTraditionalPreset("#dc2626", "#881337", "#fbbf24"),
    "thiep-cuoi-27": makeTraditionalPreset("#be123c", "#7f1d1d", "#d97706"),

    // ── Nature Green (2) ──
    "thiep-cuoi-tone-xanh": makeRomanticPreset("#86efac", "#14532d", "#22c55e", "'Dancing Script', cursive", "--- * ---"),
    "thiep-cuoi-25": makeRomanticPreset("#bbf7d0", "#14532d", "#86efac", "'Lora', serif", "* --- *"),

    // ── Modern B&W (1) ──
    "thiep-bw-1": makeClassicPreset("#18181b", "#52525b", "#71717a"),

    // ── BIRTHDAY (6) ──
    "thiep-sinh-nhat-01": makeRomanticPreset("#fda4af", "#be185d", "#f472b6", "'Pacifico', cursive", "* --- *"),
    "thiep-sinh-nhat-06": makeRomanticPreset("#c4b5fd", "#5b21b6", "#a78bfa", "'Dancing Script', cursive", "* ------ *"),
    "thiep-sinh-nhat-05": makeRomanticPreset("#fde68a", "#92400e", "#fbbf24", "'Pacifico', cursive", "* --- *"),
    "thiep-sinh-nhat-02": makeRomanticPreset("#fca5a5", "#9f1239", "#f87171", "'Dancing Script', cursive", "* ====== *"),
    "thiep-sinh-nhat-04": makeRomanticPreset("#bfdbfe", "#1e40af", "#93c5fd", "'Pacifico', cursive", "* ------ *"),
    "thiep-sinh-nhat-03": makeRomanticPreset("#fde68a", "#78350f", "#fbbf24", "'Dancing Script', cursive", "* --- *"),

    // ── GRADUATION (3) ──
    "thiep-tot-nghiep-1": makeClassicPreset("#1e3a5f", "#2d5a8e", "#bfdbfe"),
    "thiep-tot-nghiep-3": makeClassicPreset("#1a1a2e", "#374151", "#c7d2fe"),
    "thiep-tot-nghiep-2": makeClassicPreset("#14532d", "#166534", "#bbf7d0"),

    // ── EVENTS ──
    "thiep-ky-yeu-mau1": makeClassicPreset("#1e3a5f", "#374151", "#bfdbfe"),
    "thiep-ky-yeu-mau2": makeClassicPreset("#312e81", "#4338ca", "#c7d2fe"),
    "thiep-tan-gia-1": makeTraditionalPreset("#dc2626", "#7f1d1d", "#fbbf24"),
    "thiep-tan-gia-2": makeRomanticPreset("#fde68a", "#92400e", "#fbbf24", "'Lora', serif", "* --- *"),
    "thiep-valentine-1": makeRomanticPreset("#fda4af", "#be185d", "#f472b6", "'Great Vibes', cursive", "* ------ *"),
    "tiec-tat-nien-3": makeLuxuryPreset("#d4a574", "#fef3c7", "* ----- *"),
    "thiep-tat-nien-4": makeLuxuryPreset("#c9a84c", "#fef3c7", "* ====== *"),
    "tiec-tat-nien-1": makeLuxuryPreset("#b8860b", "#fef9e7", "* ------ *"),
};
