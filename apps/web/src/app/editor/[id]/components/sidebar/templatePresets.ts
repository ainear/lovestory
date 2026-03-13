import type { CanvasElement, CanvasSection } from "../useCanvasReducer";

export interface TemplatePreset {
    slug: string;
    label: string;
    emoji: string;
    category: "romantic" | "modern" | "classic" | "minimal";
    background: string;
    sections: CanvasSection[];
    elements: CanvasElement[];
    accent: string; // for thumbnail border
}

// Helper to create unique IDs
let _uid = 0;
function uid() { return `tpl_${Date.now()}_${++_uid}`; }

// ── Shared text factory ──
type TextTransformType = "none" | "uppercase" | "capitalize" | "lowercase";
type TextShadowType = { active: boolean; color: string; blur: number; x: number; y: number };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function txt(sId: string, x: number, y: number, w: number, h: number, z: number, text: string, fontSize: number, fontFamily: string, color: string, opts?: Record<string, any>): CanvasElement {
    const textTransform: TextTransformType = opts?.textTransform ?? "none";
    const textShadow: TextShadowType = opts?.textShadow ?? { active: false, color: "#000", blur: 0, x: 0, y: 0 };
    return { id: uid(), sectionId: sId, type: "text", x, y, width: w, height: h, rotation: 0, opacity: opts?.opacity ?? 1, zIndex: z, locked: false, props: { text, fontSize, fontFamily, color, textAlign: "center", fontWeight: opts?.fontWeight ?? "normal", fontStyle: opts?.fontStyle ?? "normal", textDecoration: "none", lineHeight: opts?.lineHeight ?? 1.4, letterSpacing: opts?.letterSpacing ?? 0, textTransform, textShadow, backgroundColor: "" } };
}
function wgt(sId: string, x: number, y: number, w: number, h: number, z: number, props: Record<string, unknown>): CanvasElement {
    return { id: uid(), sectionId: sId, type: "widget", x, y, width: w, height: h, rotation: 0, opacity: 1, zIndex: z, locked: false, props };
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
    // ═══════════════════════════════════════════
    // 1. HOA HỒNG (Romantic)
    // ═══════════════════════════════════════════
    {
        slug: "rose-garden",
        label: "Hoa Hồng",
        emoji: "🌹",
        category: "romantic",
        background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
        accent: "#ff6b9d",
        sections: [{ id: "s1", name: "Full", height: 3000 }],
        elements: [
            txt("s1", 60, 30, 280, 35, 1, "SAVE THE DATE", 12, "'Cinzel', serif", "#be185d", { letterSpacing: 5, textTransform: "uppercase" as unknown as number, opacity: 0.6 }),
            txt("s1", 30, 80, 340, 120, 2, "Tuấn Minh\n&\nMai Lan", 36, "'Dancing Script', cursive", "#831843", { fontWeight: "bold", lineHeight: 1.2 }),
            txt("s1", 80, 220, 240, 30, 3, "28 . 05 . 2026", 20, "'Playfair Display', serif", "#9d174d", { letterSpacing: 4 }),
            txt("s1", 30, 310, 330, 160, 4, "Trân trọng kính mời\n\nDự Lễ Thành Hôn\nvào 17:00, Thứ Bảy\nNgày 28 tháng 05 năm 2026\ntại Diamond Palace", 13, "'Inter', sans-serif", "#9d174d", { lineHeight: 1.7 }),
            txt("s1", 40, 530, 310, 40, 5, "Chuyện kể rằng....", 26, "'Dancing Script', cursive", "#ff6b9d", { fontWeight: "bold" }),
            txt("s1", 25, 590, 340, 120, 6, "\"Tình yêu giống như một đoá hồng — cần được chăm sóc mỗi ngày để nở rộ. Và hôm nay, chúng tôi muốn chia sẻ niềm hạnh phúc ấy cùng bạn.\"", 12, "'Inter', sans-serif", "#9d174d", { fontStyle: "italic", opacity: 0.8, lineHeight: 1.8 }),
            txt("s1", 60, 770, 270, 40, 7, "Timeline", 26, "'Dancing Script', cursive", "#ff6b9d", { fontWeight: "bold" }),
            txt("s1", 20, 830, 110, 50, 8, "16:30\nĐón khách", 12, "'Inter', sans-serif", "#9d174d", { lineHeight: 1.5 }),
            txt("s1", 140, 830, 110, 50, 9, "17:00\nLễ cưới", 12, "'Inter', sans-serif", "#9d174d", { lineHeight: 1.5 }),
            txt("s1", 260, 830, 110, 50, 10, "18:00\nKhai tiệc", 12, "'Inter', sans-serif", "#9d174d", { lineHeight: 1.5 }),
            wgt("s1", 85, 950, 220, 220, 11, { widgetType: "calendar", label: "Lịch cưới", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1210, 340, 100, 12, { widgetType: "countdown", label: "ĐẾM NGƯỢC NGÀY CƯỚI", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1350, 340, 200, 13, { widgetType: "rsvp", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng cho chúng tôi biết bạn có đến không" }),
            wgt("s1", 25, 1600, 340, 200, 14, { widgetType: "map", label: "Vị trí tiệc cưới", venueName: "Diamond Palace", venueAddress: "123 Nguyễn Huệ, Q.1, TP.HCM", mapUrl: "https://maps.google.com" }),
            wgt("s1", 25, 1850, 340, 200, 15, { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "NGUYEN VAN A" }),
            txt("s1", 30, 2100, 330, 80, 16, "Cảm ơn bạn đã đến\nchung vui cùng chúng tôi 🌹", 20, "'Dancing Script', cursive", "#ff6b9d", { fontWeight: "bold", lineHeight: 1.4 }),
        ],
    },
    // ═══════════════════════════════════════════
    // 2. ĐÊM HUYỀN (Modern / Dark)
    // ═══════════════════════════════════════════
    {
        slug: "midnight-romance",
        label: "Đêm Huyền",
        emoji: "🌙",
        category: "modern",
        background: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)",
        accent: "#a78bfa",
        sections: [{ id: "s1", name: "Full", height: 3000 }],
        elements: [
            txt("s1", 80, 30, 240, 35, 1, "WE'RE GETTING MARRIED", 11, "'Inter', sans-serif", "#c4b5fd", { letterSpacing: 4, textTransform: "uppercase" as unknown as number, opacity: 0.6 }),
            txt("s1", 20, 80, 360, 120, 2, "Tuấn Minh\n&\nMai Lan", 38, "'Dancing Script', cursive", "#e9d5ff", { fontWeight: "bold", lineHeight: 1.2, textShadow: { active: true, color: "#7c3aed", blur: 20, x: 0, y: 0 } }),
            txt("s1", 100, 220, 200, 30, 3, "28 . 05 . 2026", 18, "'Playfair Display', serif", "#c4b5fd", { letterSpacing: 3 }),
            txt("s1", 30, 310, 330, 150, 4, "Trân trọng kính mời\n\nDự lễ thành hôn\nvào 17:00, Thứ bảy\nNgày 28 tháng 05 năm 2026", 13, "'Inter', sans-serif", "#ddd6fe", { lineHeight: 1.7 }),
            txt("s1", 40, 520, 310, 40, 5, "Chuyện tình của chúng tôi", 26, "'Dancing Script', cursive", "#a78bfa", { fontWeight: "bold" }),
            txt("s1", 25, 580, 340, 120, 6, "\"Dưới ánh trăng huyền ảo, hai trái tim tìm thấy nhau giữa triệu vì sao. Và từ đó, mỗi đêm đều trở thành một bài thơ tình.\"", 12, "'Inter', sans-serif", "#c4b5fd", { fontStyle: "italic", opacity: 0.8, lineHeight: 1.8 }),
            txt("s1", 60, 760, 270, 40, 7, "Timeline", 26, "'Dancing Script', cursive", "#a78bfa", { fontWeight: "bold" }),
            txt("s1", 20, 820, 110, 50, 8, "16:30\nĐón khách", 12, "'Inter', sans-serif", "#ddd6fe", { lineHeight: 1.5 }),
            txt("s1", 140, 820, 110, 50, 9, "17:00\nLễ cưới", 12, "'Inter', sans-serif", "#ddd6fe", { lineHeight: 1.5 }),
            txt("s1", 260, 820, 110, 50, 10, "18:00\nTiệc cưới", 12, "'Inter', sans-serif", "#ddd6fe", { lineHeight: 1.5 }),
            wgt("s1", 85, 940, 220, 220, 11, { widgetType: "calendar", label: "Lịch cưới", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1200, 340, 100, 12, { widgetType: "countdown", label: "ĐẾM NGƯỢC", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1350, 340, 200, 13, { widgetType: "rsvp", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng cho chúng tôi biết" }),
            wgt("s1", 25, 1600, 340, 200, 14, { widgetType: "map", label: "Vị trí tiệc cưới", venueName: "Star Palace", venueAddress: "123 Nguyễn Huệ, Q.1, TP.HCM", mapUrl: "https://maps.google.com" }),
            wgt("s1", 25, 1850, 340, 200, 15, { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "NGUYEN VAN A" }),
            txt("s1", 30, 2100, 330, 80, 16, "Cảm ơn bạn đã đến\nchung vui cùng chúng tôi 💜", 20, "'Dancing Script', cursive", "#c4b5fd", { fontWeight: "bold", lineHeight: 1.4, textShadow: { active: true, color: "#7c3aed", blur: 15, x: 0, y: 0 } }),
        ],
    },
    // ═══════════════════════════════════════════
    // 3. HOÀNG HÔN (Classic / Gold)
    // ═══════════════════════════════════════════
    {
        slug: "golden-hour",
        label: "Hoàng Hôn",
        emoji: "🌅",
        category: "classic",
        background: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)",
        accent: "#f59e0b",
        sections: [{ id: "s1", name: "Full", height: 3000 }],
        elements: [
            txt("s1", 60, 30, 280, 35, 1, "WEDDING INVITATION", 12, "'Cinzel', serif", "#92400e", { letterSpacing: 5, textTransform: "uppercase" as unknown as number, opacity: 0.6 }),
            txt("s1", 30, 80, 340, 110, 2, "Tuấn Minh\n&\nMai Lan", 36, "'Great Vibes', cursive", "#78350f", { lineHeight: 1.3 }),
            txt("s1", 85, 210, 220, 30, 3, "28 . 05 . 2026", 20, "'Playfair Display', serif", "#b45309", { fontWeight: "bold", letterSpacing: 4 }),
            txt("s1", 30, 300, 330, 160, 4, "Trân trọng kính mời\n\nQuý khách đến dự tiệc\nchung vui cùng gia đình\nvào lúc 17:00, ngày 28/05/2026\ntại Diamond Palace", 13, "'Cormorant Garamond', serif", "#78350f", { lineHeight: 1.7, letterSpacing: 0.5 }),
            txt("s1", 40, 520, 310, 40, 5, "Chuyện kể rằng....", 26, "'Great Vibes', cursive", "#f59e0b"),
            txt("s1", 25, 580, 340, 120, 6, "\"Như ánh hoàng hôn ấm áp chiếu rọi, tình yêu của chúng tôi được thắp sáng từ những điều bình dị nhất. Bên nhau, mỗi khoảnh khắc đều trở thành vàng.\"", 12, "'Cormorant Garamond', serif", "#92400e", { fontStyle: "italic", opacity: 0.8, lineHeight: 1.8, letterSpacing: 0.5 }),
            txt("s1", 60, 760, 270, 40, 7, "Timeline", 26, "'Great Vibes', cursive", "#f59e0b"),
            txt("s1", 20, 820, 110, 50, 8, "16:30\nĐón khách", 12, "'Cormorant Garamond', serif", "#78350f", { lineHeight: 1.5 }),
            txt("s1", 140, 820, 110, 50, 9, "17:00\nLễ cưới", 12, "'Cormorant Garamond', serif", "#78350f", { lineHeight: 1.5 }),
            txt("s1", 260, 820, 110, 50, 10, "18:00\nKhai tiệc", 12, "'Cormorant Garamond', serif", "#78350f", { lineHeight: 1.5 }),
            wgt("s1", 85, 940, 220, 220, 11, { widgetType: "calendar", label: "Lịch cưới", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1200, 340, 100, 12, { widgetType: "countdown", label: "ĐẾM NGƯỢC NGÀY CƯỚI", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1350, 340, 200, 13, { widgetType: "rsvp", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng xác nhận sự hiện diện của bạn" }),
            wgt("s1", 25, 1600, 340, 200, 14, { widgetType: "map", label: "Vị trí tiệc cưới", venueName: "Diamond Palace", venueAddress: "123 Nguyễn Huệ, Q.1, TP.HCM", mapUrl: "https://maps.google.com" }),
            wgt("s1", 25, 1850, 340, 200, 15, { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "NGUYEN VAN A" }),
            txt("s1", 30, 2100, 330, 80, 16, "Cảm ơn bạn đã đến\nchung vui cùng chúng tôi 🌅", 20, "'Great Vibes', cursive", "#f59e0b", { lineHeight: 1.4 }),
        ],
    },
    // ═══════════════════════════════════════════
    // 4. ANH ĐÀO (Romantic / Pink)
    // ═══════════════════════════════════════════
    {
        slug: "cherry-blossom",
        label: "Anh Đào",
        emoji: "🌸",
        category: "romantic",
        background: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)",
        accent: "#ec4899",
        sections: [{ id: "s1", name: "Full", height: 3000 }],
        elements: [
            txt("s1", 30, 30, 340, 35, 1, "TOGETHER WITH THEIR FAMILIES", 11, "'Inter', sans-serif", "#9d174d", { letterSpacing: 3, textTransform: "uppercase" as unknown as number, opacity: 0.5 }),
            txt("s1", 20, 80, 360, 120, 2, "Tuấn Minh\n&\nMai Lan", 36, "'Dancing Script', cursive", "#be185d", { fontWeight: "bold", lineHeight: 1.2 }),
            txt("s1", 85, 220, 220, 30, 3, "28 . 05 . 2026", 20, "'Playfair Display', serif", "#9d174d", { letterSpacing: 3 }),
            txt("s1", 30, 310, 330, 150, 4, "Trân trọng kính mời\n\nBạn đến dự bữa tiệc hạnh phúc\nvào lúc 11:00, Thứ Bảy\nNgày 28 tháng 05 năm 2026", 13, "'Inter', sans-serif", "#9d174d", { lineHeight: 1.7 }),
            txt("s1", 40, 520, 310, 40, 5, "Love Story", 26, "'Dancing Script', cursive", "#ec4899", { fontWeight: "bold" }),
            txt("s1", 25, 580, 340, 120, 6, "\"Mùa hoa anh đào nở rộ, chúng tôi gặp nhau lần đầu. Từ ánh nhìn ấy, tình yêu lớn dần như những cánh hoa bay trong gió xuân.\"", 12, "'Inter', sans-serif", "#9d174d", { fontStyle: "italic", opacity: 0.8, lineHeight: 1.8 }),
            wgt("s1", 85, 760, 220, 220, 7, { widgetType: "calendar", label: "Lịch cưới", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1020, 340, 100, 8, { widgetType: "countdown", label: "ĐẾM NGƯỢC NGÀY CƯỚI", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1160, 340, 200, 9, { widgetType: "rsvp", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng cho chúng tôi biết bạn có đến không" }),
            wgt("s1", 25, 1410, 340, 200, 10, { widgetType: "map", label: "Vị trí tiệc cưới", venueName: "Palace Convention", venueAddress: "456 Trần Hưng Đạo, Q.5, TP.HCM", mapUrl: "https://maps.google.com" }),
            wgt("s1", 25, 1660, 340, 200, 11, { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "Techcombank", accountNumber: "0987654321", accountName: "NGUYEN THI B" }),
            txt("s1", 30, 1910, 330, 80, 12, "Cảm ơn bạn đã đến\nchung vui cùng chúng tôi 🌸", 20, "'Dancing Script', cursive", "#ec4899", { fontWeight: "bold", lineHeight: 1.4 }),
        ],
    },
    // ═══════════════════════════════════════════
    // 5. BIỂN XANH (Minimal / Teal)
    // ═══════════════════════════════════════════
    {
        slug: "ocean-breeze",
        label: "Biển Xanh",
        emoji: "🌊",
        category: "minimal",
        background: "linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 100%)",
        accent: "#06b6d4",
        sections: [{ id: "s1", name: "Full", height: 3000 }],
        elements: [
            txt("s1", 60, 30, 280, 35, 1, "THIỆP MỜI", 13, "'Cinzel', serif", "#164e63", { letterSpacing: 6, textTransform: "uppercase" as unknown as number, opacity: 0.5 }),
            txt("s1", 20, 80, 360, 110, 2, "Tuấn Minh\n&\nMai Lan", 34, "'Dancing Script', cursive", "#0e7490", { fontWeight: "bold", lineHeight: 1.3 }),
            txt("s1", 85, 210, 220, 30, 3, "28 . 05 . 2026", 18, "'Playfair Display', serif", "#155e75", { fontWeight: "bold", letterSpacing: 4 }),
            txt("s1", 30, 300, 330, 150, 4, "Trân trọng kính mời\n\nQuý khách đến dự tiệc\ncùng gia đình chúng tôi\nvào lúc 11:00, Chủ Nhật\nngày 28 tháng 05 năm 2026", 13, "'Inter', sans-serif", "#164e63", { lineHeight: 1.7 }),
            txt("s1", 40, 510, 310, 40, 5, "Our Love Story", 26, "'Dancing Script', cursive", "#06b6d4", { fontWeight: "bold" }),
            txt("s1", 25, 570, 340, 100, 6, "\"Biển xanh mênh mông, tình yêu bao la. Chúng tôi tìm thấy nhau như hai con sóng hòa vào nhau trong ánh nắng ban mai.\"", 12, "'Inter', sans-serif", "#155e75", { fontStyle: "italic", opacity: 0.8, lineHeight: 1.8 }),
            wgt("s1", 85, 730, 220, 220, 7, { widgetType: "calendar", label: "Lịch cưới", targetDate: "2026-05-28" }),
            wgt("s1", 25, 990, 340, 100, 8, { widgetType: "countdown", label: "ĐẾM NGƯỢC NGÀY CƯỚI", targetDate: "2026-05-28" }),
            wgt("s1", 25, 1130, 340, 200, 9, { widgetType: "rsvp", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng xác nhận sự hiện diện" }),
            wgt("s1", 25, 1380, 340, 200, 10, { widgetType: "map", label: "Vị trí tiệc cưới", venueName: "Ocean Bay Resort", venueAddress: "789 Trần Phú, Nha Trang", mapUrl: "https://maps.google.com" }),
            wgt("s1", 25, 1630, 340, 200, 11, { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "MB Bank", accountNumber: "1122334455", accountName: "TRAN VAN C" }),
            txt("s1", 30, 1880, 330, 80, 12, "Cảm ơn bạn đã đến\nchung vui cùng chúng tôi 🌊", 20, "'Dancing Script', cursive", "#06b6d4", { fontWeight: "bold", lineHeight: 1.4 }),
        ],
    },
    // ═══════════════════════════════════════════
    // 6. CINELOVE CLASSIC (Classic / Gold — Full)
    // ═══════════════════════════════════════════
    {
        slug: "cinelove-classic",
        label: "Cinelove Classic",
        emoji: "💍",
        category: "classic",
        background: "linear-gradient(180deg, #faf5ef 0%, #f5ede3 30%, #faf5ef 60%, #f5ede3 100%)",
        accent: "#b8860b",
        sections: [{ id: "s1", name: "Full", height: 3200 }],
        elements: [
            txt("s1", 40, 30, 310, 35, 1, "SAVE THE DATE", 12, "'Cinzel', serif", "#b8860b", { letterSpacing: 6, textTransform: "uppercase" as unknown as number, opacity: 0.5 }),
            txt("s1", 15, 80, 360, 120, 2, "Tuấn Ninh\nand\nNlai Trang", 36, "'Great Vibes', cursive", "#4a3728", { lineHeight: 1.3 }),
            txt("s1", 65, 220, 260, 30, 3, "28.01.2026", 18, "'Cormorant Garamond', serif", "#8b7355", { fontWeight: "bold", letterSpacing: 4 }),
            txt("s1", 30, 300, 330, 180, 4, "Trân trọng mời Bạn\n\nDự Lễ Vu Quy\n\nVÀO 08:00, THỨ BẢY\nTHÁNG 02 — 28 — NĂM 2026\n\n(Tức ngày 8 tháng 12 năm Ất Tỵ)", 13, "'Cormorant Garamond', serif", "#4a3728", { lineHeight: 1.6, letterSpacing: 1 }),
            txt("s1", 60, 500, 270, 70, 5, "TƯ GIA NHÀ GÁI\nHÀ NỘI", 14, "'Cinzel', serif", "#4a3728", { fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase" as unknown as number, lineHeight: 1.5 }),
            txt("s1", 40, 640, 310, 50, 6, "Chuyện kể rằng....", 28, "'Great Vibes', cursive", "#b8860b", { lineHeight: 1.3 }),
            txt("s1", 25, 710, 340, 200, 7, "\"Chúng ta đã cùng nhau đi qua biết bao tháng năm, để nhận ra rằng được ở bên nhau là điều quý giá nhất.\n\nHôm nay, trước sự chứng kiến của mọi người, và khoảnh khắc này chúng ta nhẹ nhàng gọi nhau bằng hai tiếng vợ chồng\"", 12, "'Cormorant Garamond', serif", "#6b5744", { fontStyle: "italic", lineHeight: 1.8, letterSpacing: 0.5 }),
            txt("s1", 30, 960, 160, 80, 8, "Chú rể\nTuấn Ninh\n16.01.2000", 12, "'Cormorant Garamond', serif", "#4a3728", { lineHeight: 1.6 }),
            txt("s1", 200, 960, 160, 80, 9, "Cô dâu\nNlai Trang\n26.01.2002", 12, "'Cormorant Garamond', serif", "#4a3728", { lineHeight: 1.6 }),
            txt("s1", 60, 1100, 270, 40, 10, "Timeline", 28, "'Great Vibes', cursive", "#b8860b", { lineHeight: 1.3 }),
            txt("s1", 20, 1160, 110, 60, 11, "08:00\nLễ thành hôn", 12, "'Cormorant Garamond', serif", "#4a3728", { lineHeight: 1.5 }),
            txt("s1", 140, 1160, 110, 60, 12, "10:30\nCheckin", 12, "'Cormorant Garamond', serif", "#4a3728", { lineHeight: 1.5 }),
            txt("s1", 260, 1160, 110, 60, 13, "11:00\nKhai tiệc", 12, "'Cormorant Garamond', serif", "#4a3728", { lineHeight: 1.5 }),
            txt("s1", 60, 1280, 270, 40, 14, "Dresscode", 28, "'Great Vibes', cursive", "#b8860b", { lineHeight: 1.3 }),
            txt("s1", 60, 1330, 270, 30, 15, "Xin vui lòng mặc trang phục theo tone màu", 11, "'Cormorant Garamond', serif", "#6b5744", { fontStyle: "italic", opacity: 0.6 }),
            txt("s1", 25, 1430, 340, 100, 16, "Rất mong bạn có thể sắp xếp tới sớm để chụp thật nhiều ảnh kỷ niệm cùng chúng mình nhé!", 13, "'Cormorant Garamond', serif", "#4a3728", { lineHeight: 1.8 }),
            wgt("s1", 85, 1580, 220, 220, 17, { widgetType: "calendar", label: "Tháng 2", targetDate: "2026-02-28" }),
            wgt("s1", 25, 1850, 340, 100, 18, { widgetType: "countdown", label: "ĐẾM NGƯỢC NGÀY CƯỚI", targetDate: "2026-02-28" }),
            wgt("s1", 25, 2000, 340, 200, 19, { widgetType: "rsvp", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng cho chúng tôi biết bạn có đến không" }),
            wgt("s1", 25, 2250, 340, 200, 20, { widgetType: "map", label: "Vị trí tiệc cưới", venueName: "Tư gia nhà gái", venueAddress: "Hà Nội", mapUrl: "https://maps.google.com" }),
            wgt("s1", 25, 2500, 340, 200, 21, { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "NGUYEN VAN A" }),
            txt("s1", 30, 2750, 330, 80, 22, "Cảm ơn bạn đã đến\nchung vui cùng chúng tôi 💕", 20, "'Great Vibes', cursive", "#b8860b", { lineHeight: 1.4 }),
        ],
    },
];

export const TEMPLATE_CATEGORIES = [
    { key: "all", label: "Tất cả" },
    { key: "romantic", label: "Lãng mạn" },
    { key: "modern", label: "Hiện đại" },
    { key: "classic", label: "Cổ điển" },
    { key: "minimal", label: "Tối giản" },
];
