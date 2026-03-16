/**
 * AI Template Generator — JSON Schema + Converter
 * 
 * PURPOSE: Let AI (GPT, Gemini, Claude) mass-produce wedding templates 
 * by generating simple JSON specs → this module converts them to full TemplateElement[] presets.
 * 
 * USAGE:
 *   1. AI generates a TemplateSpec JSON
 *   2. Call generateTemplateFromSpec(spec) → gets full TemplateElement[]
 *   3. Insert into TEMPLATE_UNIQUE_PRESETS
 * 
 * AI PROMPT EXAMPLE:
 * "Generate 10 wedding template specs in TemplateSpec JSON format.
 *  Each should have a unique slug, layout family, color palette, and font combination.
 *  Follow this schema: { slug, layout, tier, colors, fonts, content, music }"
 */

import { TemplateElement } from "./template-presets";

// ═══════════════════════════════════════════════════════
// JSON SCHEMA — What AI produces
// ═══════════════════════════════════════════════════════

export interface TemplateSpec {
    /** Unique template slug, e.g. "thiep-cuoi-76" */
    slug: string;

    /** Layout family — determines structural arrangement */
    layout: "romantic" | "luxury" | "classic" | "traditional" | "nature" | "modern";

    /** Pricing tier */
    tier: "BASIC" | "PREMIUM";

    /** Color palette */
    colors: {
        /** Primary accent color (hex), e.g. "#ff6b9d" */
        accent: string;
        /** Main text / heading color (hex) */
        text: string;
        /** Decorative element color (hex) */
        deco: string;
        /** Background CSS value — gradient or solid */
        background: string;
    };

    /** Font selections */
    fonts: {
        /** Display/heading font, e.g. "'Dancing Script', cursive" */
        heading: string;
        /** Body text font, e.g. "'Lora', serif" */
        body: string;
        /** Label font, e.g. "'Inter', sans-serif" */
        label: string;
    };

    /** Content customizations (optional — defaults provided) */
    content?: {
        /** Ceremony label, default "Lễ Thành Hôn" */
        ceremonyLabel?: string;
        /** Decorative separator text, default "✿ ─── ✿" */
        decoText?: string;
        /** Quote text */
        quote?: string;
    };

    /** Recommended music ID from MUSIC_PRESETS */
    music?: string;

    /** Optional metadata */
    meta?: {
        name?: string;
        description?: string;
        tags?: string[];
    };
}

// ═══════════════════════════════════════════════════════
// CONVERTER — TemplateSpec → TemplateElement[]
// ═══════════════════════════════════════════════════════

function txt(id: string, x: number, y: number, w: number, h: number, text: string, o: {
    size?: number; font?: string; color?: string; weight?: string;
    italic?: boolean; align?: "left" | "center" | "right"; opacity?: number;
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

function img(id: string, x: number, y: number, w: number, h: number, o: {
    radius?: number; borderColor?: string; borderWidth?: number;
    rotation?: number; zIndex?: number; src?: string;
} = {}): TemplateElement {
    const PLACEHOLDERS: Record<string, string> = {
        "img-main": "/placeholder-couple.png",
        "img-groom": "/placeholder-groom.png",
        "img-bride": "/placeholder-bride.png",
        "img-couple2": "/placeholder-couple.png",
        "img-gallery1": "/placeholder-couple.png",
        "img-gallery2": "/placeholder-groom.png",
        "img-gallery3": "/placeholder-bride.png",
        "img-gallery4": "/placeholder-couple.png",
    };
    return {
        id, type: "image", x, y, width: w, height: h,
        rotation: o.rotation ?? 0, opacity: 1, zIndex: o.zIndex ?? 1, locked: false,
        animation: { entrance: "fadeIn", loop: "none" },
        props: { src: o.src ?? PLACEHOLDERS[id] ?? "/placeholder-couple.png", objectFit: "cover", borderRadius: o.radius ?? 8, borderWidth: o.borderWidth ?? 2, borderColor: o.borderColor ?? "#f9a8d4" }
    };
}

/**
 * Convert a simplified AI-generated TemplateSpec → full TemplateElement[]
 */
export function generateTemplateFromSpec(spec: TemplateSpec): TemplateElement[] {
    const { colors, fonts, content } = spec;
    const ceremony = content?.ceremonyLabel ?? "Lễ Thành Hôn";
    const decoText = content?.decoText ?? "✿ ─── ✿ ─── ✿";
    const quote = content?.quote ?? "Yêu là hạnh phúc khi được ở bên nhau.";

    // Each layout family generates a different structural arrangement
    switch (spec.layout) {
        case "romantic":
            return generateRomantic(colors, fonts, ceremony, decoText, quote);
        case "luxury":
            return generateLuxury(colors, fonts, ceremony, decoText, quote);
        case "classic":
            return generateClassic(colors, fonts, ceremony, decoText, quote);
        case "traditional":
            return generateTraditional(colors, fonts, ceremony, decoText, quote);
        case "nature":
            return generateNature(colors, fonts, ceremony, decoText, quote);
        case "modern":
            return generateModern(colors, fonts, ceremony, decoText, quote);
        default:
            return generateRomantic(colors, fonts, ceremony, decoText, quote);
    }
}

function generateRomantic(c: TemplateSpec["colors"], f: TemplateSpec["fonts"], ceremony: string, decoText: string, quote: string): TemplateElement[] {
    return [
        img("img-main", 20, 20, 350, 400, { radius: 24, borderColor: c.accent, borderWidth: 3 }),
        txt("txt-ceremony", 20, 440, 350, 32, ceremony, { size: 18, font: f.heading, color: c.deco, italic: true }),
        txt("txt-deco1", 20, 475, 350, 24, decoText, { size: 12, font: "'Georgia', serif", color: c.deco, opacity: 0.5, locked: true }),
        txt("txt-invite", 20, 510, 350, 32, "Trân trọng kính mời", { size: 15, font: f.body, color: c.text, italic: true }),
        txt("txt-names", 10, 550, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 38, font: f.heading, weight: "bold", italic: true, color: c.text, lineHeight: 1.1 }),
        txt("txt-family", 20, 660, 350, 56, "Cùng gia đình hai bên\ntrân trọng kính mời quý khách\ntới dự buổi lễ Vũ Quy", { size: 14, font: f.body, color: c.text, italic: true, opacity: 0.9 }),
        txt("txt-nhatrai-label", 20, 740, 170, 28, "NHÀ TRAI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhatrai", 20, 770, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 740, 170, 28, "NHÀ GÁI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhagai", 200, 770, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        img("img-groom", 40, 860, 140, 180, { radius: 16, borderColor: c.deco, rotation: -3, zIndex: 2 }),
        img("img-bride", 210, 860, 140, 180, { radius: 16, borderColor: c.deco, rotation: 3, zIndex: 3 }),
        txt("name-groom", 40, 1050, 140, 32, "Chú Rể", { size: 16, font: f.heading, weight: "bold", color: c.text }),
        txt("name-bride", 210, 1050, 140, 32, "Cô Dâu", { size: 16, font: f.heading, weight: "bold", color: c.text }),
        txt("txt-date", 20, 1110, 350, 60, "Chủ Nhật, 28 · 05 · 2026", { size: 28, font: "'Cormorant Garamond', serif", weight: "bold", color: c.text }),
        txt("txt-time", 20, 1175, 350, 30, "Lúc 10:00 sáng", { size: 16, font: f.body, color: c.text, italic: true, opacity: 0.85 }),
        txt("txt-event1-label", 20, 1230, 170, 24, "LỄ VŨ QUY", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event1", 20, 1255, 170, 50, "08:00 Sáng\nTư gia Nhà Gái\nĐịa chỉ Nhà Gái", { size: 11, font: f.label, color: c.text, opacity: 0.8, lineHeight: 1.6, align: "left" }),
        txt("txt-event2-label", 200, 1230, 170, 24, "TIỆC CƯỚI", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event2", 200, 1255, 170, 50, "17:00 Chiều\nNhà Hàng ABC\nĐịa chỉ Nhà Hàng", { size: 11, font: f.label, color: c.text, opacity: 0.8, lineHeight: 1.6, align: "left" }),
        img("img-couple2", 30, 1330, 330, 200, { radius: 16, borderColor: c.accent, borderWidth: 2 }),
        img("img-gallery1", 30, 1550, 160, 150, { radius: 12, borderColor: c.deco }),
        img("img-gallery2", 200, 1550, 160, 150, { radius: 12, borderColor: c.deco }),
        img("img-gallery3", 30, 1710, 160, 150, { radius: 12, borderColor: c.deco }),
        img("img-gallery4", 200, 1710, 160, 150, { radius: 12, borderColor: c.deco }),
        txt("txt-quote", 30, 1890, 330, 70, quote, { size: 15, font: f.body, color: c.text, italic: true, opacity: 0.9 }),
        txt("txt-venue", 20, 1980, 350, 60, "Nhà Hàng ABC\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố", { size: 14, font: f.label, color: c.text, opacity: 0.9 }),
    ];
}

function generateLuxury(c: TemplateSpec["colors"], f: TemplateSpec["fonts"], ceremony: string, decoText: string, quote: string): TemplateElement[] {
    return [
        txt("txt-ceremony", 20, 30, 350, 36, "WEDDING INVITATION", { size: 14, font: f.heading, color: c.accent, weight: "bold" }),
        txt("txt-names", 10, 80, 370, 120, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 42, font: f.heading, weight: "bold", italic: true, color: c.text, lineHeight: 1.1 }),
        txt("txt-deco1", 20, 210, 350, 28, decoText, { size: 13, font: "'Georgia', serif", color: c.accent, opacity: 0.5, locked: true }),
        txt("txt-invite", 20, 250, 350, 32, "TRÂN TRỌNG KÍNH MỜI", { size: 13, font: f.heading, weight: "bold", color: c.accent }),
        txt("txt-family", 20, 290, 350, 50, "Cùng gia đình hai bên\ntrân trọng kính mời quý khách", { size: 14, font: f.body, color: c.text, italic: true, opacity: 0.85 }),
        img("img-main", 40, 360, 310, 350, { radius: 8, borderColor: c.accent, borderWidth: 2 }),
        txt("txt-date", 20, 730, 350, 60, "Chủ Nhật, 28 · 05 · 2026", { size: 30, font: f.heading, weight: "bold", color: c.text }),
        txt("txt-time", 20, 795, 350, 30, "Lúc 10:00 sáng", { size: 16, font: f.body, color: c.accent, italic: true, opacity: 0.85 }),
        txt("txt-nhatrai-label", 20, 850, 170, 28, "NHÀ TRAI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhatrai", 20, 880, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 850, 170, 28, "NHÀ GÁI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhagai", 200, 880, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        img("img-groom", 40, 970, 140, 180, { radius: 6, borderColor: c.accent, zIndex: 2 }),
        img("img-bride", 210, 970, 140, 180, { radius: 6, borderColor: c.accent, zIndex: 3 }),
        txt("name-groom", 40, 1160, 140, 32, "Chú Rể", { size: 16, font: f.heading, weight: "bold", italic: true, color: c.text }),
        txt("name-bride", 210, 1160, 140, 32, "Cô Dâu", { size: 16, font: f.heading, weight: "bold", italic: true, color: c.text }),
        txt("txt-event1-label", 20, 1220, 350, 24, "LỄ VŨ QUY", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event1", 20, 1245, 350, 40, "08:00 Sáng · Tư gia Nhà Gái · Địa chỉ", { size: 11, font: f.label, color: c.text, opacity: 0.8 }),
        txt("txt-event2-label", 20, 1295, 350, 24, "TIỆC CƯỚI", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event2", 20, 1320, 350, 40, "17:00 Chiều · Nhà Hàng ABC · Địa chỉ", { size: 11, font: f.label, color: c.text, opacity: 0.8 }),
        img("img-couple2", 20, 1380, 350, 250, { radius: 8, borderColor: c.accent, borderWidth: 1 }),
        img("img-gallery1", 20, 1650, 110, 120, { radius: 6, borderColor: c.accent }),
        img("img-gallery2", 140, 1650, 110, 120, { radius: 6, borderColor: c.accent }),
        img("img-gallery3", 260, 1650, 110, 120, { radius: 6, borderColor: c.accent }),
        img("img-gallery4", 80, 1780, 230, 150, { radius: 6, borderColor: c.accent }),
        txt("txt-quote", 30, 1960, 330, 70, quote, { size: 16, font: f.heading, color: c.text, italic: true, opacity: 0.9 }),
        txt("txt-venue", 20, 2050, 350, 60, "Nhà Hàng\nĐịa chỉ nhà hàng\nQuận, Thành phố", { size: 14, font: f.label, color: c.text, opacity: 0.85 }),
    ];
}

function generateClassic(c: TemplateSpec["colors"], f: TemplateSpec["fonts"], ceremony: string, decoText: string, quote: string): TemplateElement[] {
    return [
        txt("txt-ceremony", 20, 20, 350, 40, ceremony, { size: 22, font: f.heading, color: c.accent, italic: true }),
        txt("txt-names", 10, 70, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 36, font: f.heading, weight: "bold", color: c.accent, lineHeight: 1.15 }),
        txt("txt-deco1", 20, 175, 350, 24, decoText, { size: 12, font: "'Georgia', serif", color: c.deco, opacity: 0.4, locked: true }),
        txt("txt-invite", 20, 210, 350, 32, "Trân trọng kính mời", { size: 16, font: f.heading, color: c.text, italic: true }),
        txt("txt-family", 20, 250, 350, 50, "Cùng gia đình hai bên\ntrân trọng kính mời quý khách", { size: 14, font: f.body, color: c.text, italic: true, opacity: 0.85 }),
        img("img-main", 50, 320, 290, 340, { radius: 4, borderColor: c.deco, borderWidth: 1 }),
        txt("txt-date", 20, 680, 350, 60, "Chủ Nhật, 28 · 05 · 2026", { size: 26, font: f.heading, weight: "bold", color: c.accent }),
        txt("txt-time", 20, 745, 350, 30, "Lúc 10:00 sáng", { size: 16, font: f.body, color: c.text, italic: true, opacity: 0.8 }),
        txt("txt-nhatrai-label", 20, 800, 170, 28, "NHÀ TRAI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhatrai", 20, 830, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 800, 170, 28, "NHÀ GÁI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhagai", 200, 830, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        img("img-groom", 80, 920, 230, 160, { radius: 4, borderColor: c.deco, borderWidth: 1, zIndex: 2 }),
        img("img-bride", 80, 1090, 230, 160, { radius: 4, borderColor: c.deco, borderWidth: 1, zIndex: 3 }),
        txt("name-groom", 80, 1260, 230, 32, "Chú Rể", { size: 16, font: f.heading, weight: "bold", color: c.accent }),
        txt("name-bride", 80, 1090, 230, 32, "Cô Dâu", { size: 16, font: f.heading, weight: "bold", color: c.accent, opacity: 0 }),
        txt("txt-event1-label", 20, 1310, 170, 24, "LỄ VŨ QUY", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event1", 20, 1335, 170, 50, "08:00 Sáng\nTư gia Nhà Gái\nĐịa chỉ", { size: 11, font: f.label, color: c.text, opacity: 0.8, lineHeight: 1.6, align: "left" }),
        txt("txt-event2-label", 200, 1310, 170, 24, "TIỆC CƯỚI", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event2", 200, 1335, 170, 50, "17:00 Chiều\nNhà Hàng ABC\nĐịa chỉ", { size: 11, font: f.label, color: c.text, opacity: 0.8, lineHeight: 1.6, align: "left" }),
        img("img-couple2", 20, 1410, 350, 200, { radius: 4, borderColor: c.deco, borderWidth: 1 }),
        img("img-gallery1", 20, 1630, 170, 140, { radius: 4, borderColor: c.deco }),
        img("img-gallery2", 200, 1630, 170, 140, { radius: 4, borderColor: c.deco }),
        img("img-gallery3", 20, 1780, 170, 140, { radius: 4, borderColor: c.deco }),
        img("img-gallery4", 200, 1780, 170, 140, { radius: 4, borderColor: c.deco }),
        txt("txt-quote", 30, 1940, 330, 50, quote, { size: 15, font: f.body, color: c.text, italic: true, opacity: 0.85 }),
        txt("txt-venue", 20, 2010, 350, 60, "Nhà Hàng\nĐịa chỉ nhà hàng\nQuận, Thành phố", { size: 14, font: f.label, color: c.text, opacity: 0.85 }),
    ];
}

function generateTraditional(c: TemplateSpec["colors"], f: TemplateSpec["fonts"], ceremony: string, decoText: string, quote: string): TemplateElement[] {
    return [
        img("img-main", 20, 15, 350, 360, { radius: 12, borderColor: c.deco, borderWidth: 3 }),
        txt("txt-deco1", 20, 390, 350, 30, "═══════  囍  ═══════", { size: 14, font: "'Georgia', serif", color: c.accent, opacity: 0.75, locked: true, weight: "bold" }),
        txt("txt-ceremony", 20, 425, 350, 36, ceremony, { size: 22, font: f.heading, color: c.accent, weight: "bold" }),
        txt("txt-invite", 20, 465, 350, 32, "Trân Trọng Kính Mời", { size: 17, font: f.heading, weight: "bold", color: c.accent }),
        txt("txt-names", 10, 505, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 38, font: f.heading, weight: "bold", italic: true, color: c.text, lineHeight: 1.15 }),
        txt("txt-date", 60, 620, 270, 80, "28\nTHÁNG 05 · 2026", { size: 48, font: f.heading, weight: "bold", color: c.text, lineHeight: 0.9 }),
        txt("txt-time", 20, 710, 350, 30, "Lúc 10:00 sáng", { size: 16, font: f.body, color: c.accent, italic: true, opacity: 0.85 }),
        txt("txt-family", 20, 755, 350, 50, "Cùng gia đình hai bên\ntrân trọng kính mời quý khách", { size: 14, font: f.body, color: c.text, italic: true, opacity: 0.9 }),
        txt("txt-nhatrai-label", 20, 825, 170, 28, "NHÀ TRAI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhatrai", 20, 855, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 825, 170, 28, "NHÀ GÁI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhagai", 200, 855, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        img("img-groom", 40, 945, 140, 180, { radius: 10, borderColor: c.deco, rotation: -2, zIndex: 2 }),
        img("img-bride", 210, 945, 140, 180, { radius: 10, borderColor: c.deco, rotation: 2, zIndex: 3 }),
        txt("name-groom", 40, 1135, 140, 32, "Chú Rể", { size: 16, font: f.heading, weight: "bold", color: c.text }),
        txt("name-bride", 210, 1135, 140, 32, "Cô Dâu", { size: 16, font: f.heading, weight: "bold", color: c.text }),
        txt("txt-event1-label", 20, 1190, 170, 24, "LỄ VŨ QUY", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event1", 20, 1215, 170, 50, "08:00 Sáng\nTư gia Nhà Gái\nĐịa chỉ", { size: 11, font: f.label, color: c.text, opacity: 0.8, lineHeight: 1.6, align: "left" }),
        txt("txt-event2-label", 200, 1190, 170, 24, "TIỆC CƯỚI", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event2", 200, 1215, 170, 50, "17:00 Chiều\nNhà Hàng ABC\nĐịa chỉ", { size: 11, font: f.label, color: c.text, opacity: 0.8, lineHeight: 1.6, align: "left" }),
        img("img-couple2", 30, 1290, 330, 220, { radius: 12, borderColor: c.deco, borderWidth: 2 }),
        img("img-gallery1", 20, 1530, 170, 150, { radius: 10, borderColor: c.deco }),
        img("img-gallery2", 200, 1530, 170, 150, { radius: 10, borderColor: c.deco }),
        img("img-gallery3", 20, 1690, 170, 150, { radius: 10, borderColor: c.deco }),
        img("img-gallery4", 200, 1690, 170, 150, { radius: 10, borderColor: c.deco }),
        txt("txt-quote", 25, 1860, 340, 50, quote, { size: 16, font: f.heading, color: c.accent, italic: true, opacity: 0.9 }),
        txt("txt-venue", 20, 1930, 350, 60, "Nhà Hàng\nĐịa chỉ nhà hàng\nQuận, Thành phố", { size: 14, font: f.label, color: c.text, opacity: 0.9 }),
    ];
}

function generateNature(c: TemplateSpec["colors"], f: TemplateSpec["fonts"], ceremony: string, decoText: string, quote: string): TemplateElement[] {
    return [
        txt("txt-ceremony", 20, 20, 350, 32, "SAVE THE DATE", { size: 14, font: f.label, weight: "bold", color: c.accent, opacity: 0.7 }),
        txt("txt-names", 10, 60, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 34, font: f.heading, weight: "bold", italic: true, color: c.text, lineHeight: 1.15 }),
        txt("txt-deco1", 20, 170, 350, 24, decoText, { size: 14, font: "'Georgia', serif", color: c.deco, opacity: 0.55, locked: true }),
        img("img-main", 0, 210, 390, 300, { radius: 0, borderColor: "transparent", borderWidth: 0 }),
        txt("txt-invite", 20, 530, 350, 32, "Trân trọng kính mời", { size: 15, font: f.heading, color: c.text, italic: true }),
        txt("txt-family", 20, 570, 350, 50, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: f.body, color: c.text, italic: true }),
        img("img-groom", 30, 640, 160, 200, { radius: 20, borderColor: c.accent, borderWidth: 2, zIndex: 2 }),
        img("img-bride", 200, 640, 160, 200, { radius: 20, borderColor: c.accent, borderWidth: 2, zIndex: 3 }),
        txt("name-groom", 30, 850, 160, 32, "Chú Rể", { size: 16, font: f.heading, weight: "bold", color: c.text }),
        txt("name-bride", 200, 850, 160, 32, "Cô Dâu", { size: 16, font: f.heading, weight: "bold", color: c.text }),
        txt("txt-date", 20, 910, 350, 60, "Chủ Nhật, 28 · 05 · 2026", { size: 24, font: f.heading, weight: "bold", color: c.text }),
        txt("txt-time", 20, 975, 350, 30, "Lúc 10:00 sáng", { size: 15, font: f.body, color: c.text, italic: true }),
        txt("txt-nhatrai-label", 20, 1030, 170, 28, "NHÀ TRAI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhatrai", 20, 1060, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 1030, 170, 28, "NHÀ GÁI", { size: 13, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhagai", 200, 1060, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu", { size: 12, font: f.body, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        txt("txt-event1-label", 20, 1155, 170, 24, "LỄ VŨ QUY", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event1", 20, 1180, 170, 50, "08:00 Sáng\nTư gia Nhà Gái\nĐịa chỉ", { size: 11, font: f.label, color: c.text, opacity: 0.8, lineHeight: 1.6, align: "left" }),
        txt("txt-event2-label", 200, 1155, 170, 24, "TIỆC CƯỚI", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event2", 200, 1180, 170, 50, "17:00 Chiều\nNhà Hàng ABC\nĐịa chỉ", { size: 11, font: f.label, color: c.text, opacity: 0.8, lineHeight: 1.6, align: "left" }),
        img("img-couple2", 0, 1260, 390, 220, { radius: 0, borderColor: "transparent", borderWidth: 0 }),
        img("img-gallery1", 20, 1500, 115, 130, { radius: 12, borderColor: c.accent }),
        img("img-gallery2", 140, 1500, 115, 130, { radius: 12, borderColor: c.accent }),
        img("img-gallery3", 260, 1500, 115, 130, { radius: 12, borderColor: c.accent }),
        img("img-gallery4", 80, 1640, 230, 150, { radius: 12, borderColor: c.accent }),
        txt("txt-quote", 30, 1810, 330, 50, quote, { size: 15, font: f.body, color: c.text, italic: true, opacity: 0.9 }),
        txt("txt-venue", 20, 1880, 350, 60, "📍 Nhà Hàng\nĐịa chỉ\nQuận, Thành phố", { size: 12, font: f.label, color: c.text, opacity: 0.9 }),
    ];
}

function generateModern(c: TemplateSpec["colors"], f: TemplateSpec["fonts"], _ceremony: string, decoText: string, quote: string): TemplateElement[] {
    return [
        txt("txt-date", 20, 20, 350, 50, "28 . 05 . 2026", { size: 32, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-ceremony", 20, 75, 350, 28, "WE'RE GETTING MARRIED", { size: 11, font: f.label, weight: "bold", color: c.text, opacity: 0.7 }),
        txt("txt-deco1", 20, 108, 350, 20, decoText, { size: 10, font: f.label, color: c.deco, opacity: 0.3, locked: true }),
        txt("txt-names", 10, 140, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", { size: 36, font: f.heading, weight: "bold", color: c.accent, lineHeight: 1.15 }),
        txt("txt-invite", 20, 250, 350, 32, "REQUEST THE PLEASURE OF YOUR COMPANY", { size: 10, font: f.label, weight: "bold", color: c.text, opacity: 0.6 }),
        img("img-main", 60, 300, 270, 320, { radius: 0, borderColor: c.accent, borderWidth: 2 }),
        txt("txt-time", 20, 640, 350, 24, "10:00 AM", { size: 14, font: f.label, color: c.text, opacity: 0.7 }),
        txt("txt-family", 20, 680, 350, 40, "Cùng gia đình hai bên\nân hạnh kính mời quý khách", { size: 13, font: f.label, color: c.text }),
        txt("txt-nhatrai-label", 20, 740, 170, 28, "NHÀ TRAI", { size: 11, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhatrai", 20, 770, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể", { size: 12, font: f.label, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        txt("txt-nhagai-label", 200, 740, 170, 28, "NHÀ GÁI", { size: 11, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-nhagai", 200, 770, 170, 70, "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu", { size: 12, font: f.label, color: c.text, opacity: 0.85, lineHeight: 1.8, align: "left" }),
        img("img-groom", 50, 860, 140, 170, { radius: 0, borderColor: c.accent, borderWidth: 1, zIndex: 2 }),
        img("img-bride", 200, 860, 140, 170, { radius: 0, borderColor: c.accent, borderWidth: 1, zIndex: 3 }),
        txt("name-groom", 50, 1040, 140, 28, "MINH ANH", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("name-bride", 200, 1040, 140, 28, "THUỲ LINH", { size: 12, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event1-label", 20, 1090, 350, 24, "CEREMONY & RECEPTION", { size: 11, font: f.label, weight: "bold", color: c.accent }),
        txt("txt-event1", 20, 1115, 350, 40, "08:00 AM — Lễ Vũ Quy — Tư gia Nhà Gái", { size: 11, font: f.label, color: c.text, opacity: 0.8, align: "left" }),
        txt("txt-event2-label", 20, 1160, 350, 0, "", { size: 1, font: f.label, color: "transparent" }),
        txt("txt-event2", 20, 1165, 350, 40, "05:00 PM — Tiệc Cưới — Nhà Hàng ABC", { size: 11, font: f.label, color: c.text, opacity: 0.8, align: "left" }),
        img("img-couple2", 40, 1230, 310, 200, { radius: 0, borderColor: c.accent, borderWidth: 1 }),
        img("img-gallery1", 20, 1450, 85, 100, { radius: 0, borderColor: c.deco }),
        img("img-gallery2", 115, 1450, 85, 100, { radius: 0, borderColor: c.deco }),
        img("img-gallery3", 210, 1450, 85, 100, { radius: 0, borderColor: c.deco }),
        img("img-gallery4", 305, 1450, 80, 100, { radius: 0, borderColor: c.deco }),
        txt("txt-quote", 20, 1570, 350, 40, quote, { size: 13, font: f.label, color: c.text, italic: true }),
        txt("txt-venue", 20, 1630, 350, 50, "Diamond Palace — 123 Nguyễn Huệ, Q1, TP.HCM", { size: 11, font: f.label, color: c.text, opacity: 0.75 }),
    ];
}

// ═══════════════════════════════════════════════════════
// BATCH GENERATOR — AI produces array of specs → bulk generate
// ═══════════════════════════════════════════════════════

/**
 * Generate multiple templates from an array of AI-produced specs
 * Returns a Record<slug, TemplateElement[]> ready to merge into TEMPLATE_UNIQUE_PRESETS
 */
export function batchGenerateTemplates(specs: TemplateSpec[]): Record<string, TemplateElement[]> {
    const result: Record<string, TemplateElement[]> = {};
    for (const spec of specs) {
        result[spec.slug] = generateTemplateFromSpec(spec);
    }
    return result;
}

// ═══════════════════════════════════════════════════════
// EXAMPLE SPECS — Copy these as a starting point for AI
// ═══════════════════════════════════════════════════════

export const EXAMPLE_SPECS: TemplateSpec[] = [
    {
        slug: "thiep-cuoi-ai-01",
        layout: "romantic",
        tier: "BASIC",
        colors: { accent: "#e8a4b8", text: "#6b2058", deco: "#c87fa4", background: "linear-gradient(180deg, #fdf2f8 0%, #fff 100%)" },
        fonts: { heading: "'Dancing Script', cursive", body: "'Lora', serif", label: "'Inter', sans-serif" },
        content: { ceremonyLabel: "Lễ Vũ Quy", decoText: "✿ ─── ✿ ─── ✿", quote: "Yêu là hạnh phúc khi được ở bên nhau." },
        meta: { name: "Hồng Nhạt", tags: ["romantic", "pink", "wedding"] },
    },
    {
        slug: "thiep-cuoi-ai-02",
        layout: "luxury",
        tier: "PREMIUM",
        colors: { accent: "#d4af37", text: "#fef3c7", deco: "#c9a84c", background: "linear-gradient(180deg, #0f0825 0%, #1a0a30 100%)" },
        fonts: { heading: "'Playfair Display', serif", body: "'Lora', serif", label: "'Inter', sans-serif" },
        content: { ceremonyLabel: "Wedding Invitation", decoText: "─── ✦ ───", quote: "Every love story is beautiful, but ours is my favorite." },
        meta: { name: "Royal Gold", tags: ["luxury", "dark", "gold"] },
    },
    {
        slug: "thiep-cuoi-ai-03",
        layout: "modern",
        tier: "BASIC",
        colors: { accent: "#1e293b", text: "#475569", deco: "#94a3b8", background: "#ffffff" },
        fonts: { heading: "'Cormorant Garamond', serif", body: "'Inter', sans-serif", label: "'Inter', sans-serif" },
        content: { ceremonyLabel: "Wedding", decoText: "▬▬▬▬▬▬▬▬▬▬", quote: "Less is more." },
        meta: { name: "Minimalist", tags: ["modern", "minimal", "clean"] },
    },
];
