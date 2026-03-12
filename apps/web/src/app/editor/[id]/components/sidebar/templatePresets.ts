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

export const TEMPLATE_PRESETS: TemplatePreset[] = [
    {
        slug: "rose-garden",
        label: "Hoa Hồng",
        emoji: "🌹",
        category: "romantic",
        background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
        accent: "#ff6b9d",
        sections: [
            { id: "s1", name: "Bìa", height: 600 },
            { id: "s2", name: "Thông tin", height: 500 },
            { id: "s3", name: "Đếm ngược", height: 400 },
        ],
        elements: [
            { id: uid(), sectionId: "s1", type: "text", x: 60, y: 40, width: 280, height: 60, rotation: 0, opacity: 1, zIndex: 1, locked: false, props: { text: "Save the Date", fontSize: 14, fontFamily: "'Playfair Display', serif", color: "#be185d", textAlign: "center", fontWeight: "normal", fontStyle: "italic", textDecoration: "none", lineHeight: 1.4, letterSpacing: 2, textTransform: "uppercase", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 30, y: 120, width: 340, height: 100, rotation: 0, opacity: 1, zIndex: 2, locked: false, props: { text: "Tuấn Minh\n&\nMai Lan", fontSize: 36, fontFamily: "'Dancing Script', cursive", color: "#831843", textAlign: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 80, y: 300, width: 240, height: 40, rotation: 0, opacity: 1, zIndex: 3, locked: false, props: { text: "28 . 05 . 2026", fontSize: 20, fontFamily: "'Playfair Display', serif", color: "#9d174d", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.4, letterSpacing: 4, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s2", type: "text", x: 40, y: 40, width: 320, height: 50, rotation: 0, opacity: 1, zIndex: 4, locked: false, props: { text: "Trân trọng kính mời", fontSize: 18, fontFamily: "'Playfair Display', serif", color: "#9d174d", textAlign: "center", fontWeight: "normal", fontStyle: "italic", textDecoration: "none", lineHeight: 1.6, letterSpacing: 1, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s2", type: "text", x: 30, y: 120, width: 340, height: 200, rotation: 0, opacity: 1, zIndex: 5, locked: false, props: { text: "Chúng tôi vui mừng thông báo lễ thành hôn sẽ được tổ chức vào lúc 17:00 ngày 28/05/2026 tại Trung tâm Tiệc Cưới Diamond Palace.", fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#4b5563", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.8, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s3", type: "widget", x: 25, y: 40, width: 350, height: 100, rotation: 0, opacity: 1, zIndex: 6, locked: false, props: { widgetType: "countdown", label: "ĐẾM NGƯỢC NGÀY CƯỚI", targetDate: "2026-05-28" } },
            { id: uid(), sectionId: "s3", type: "widget", x: 90, y: 180, width: 220, height: 180, rotation: 0, opacity: 1, zIndex: 7, locked: false, props: { widgetType: "calendar", label: "Lịch cưới", targetDate: "2026-05-28" } },
        ],
    },
    {
        slug: "midnight-romance",
        label: "Đêm Huyền",
        emoji: "🌙",
        category: "modern",
        background: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)",
        accent: "#a78bfa",
        sections: [
            { id: "s1", name: "Bìa", height: 600 },
            { id: "s2", name: "Chi tiết", height: 500 },
        ],
        elements: [
            { id: uid(), sectionId: "s1", type: "text", x: 80, y: 60, width: 240, height: 40, rotation: 0, opacity: 0.7, zIndex: 1, locked: false, props: { text: "WE'RE GETTING MARRIED", fontSize: 12, fontFamily: "'Inter', sans-serif", color: "#c4b5fd", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.4, letterSpacing: 4, textTransform: "uppercase", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 20, y: 140, width: 360, height: 120, rotation: 0, opacity: 1, zIndex: 2, locked: false, props: { text: "Tuấn Minh\n&\nMai Lan", fontSize: 38, fontFamily: "'Dancing Script', cursive", color: "#e9d5ff", textAlign: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", textShadow: { active: true, color: "#7c3aed", blur: 20, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 100, y: 320, width: 200, height: 40, rotation: 0, opacity: 1, zIndex: 3, locked: false, props: { text: "28 . 05 . 2026", fontSize: 18, fontFamily: "'Playfair Display', serif", color: "#c4b5fd", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.4, letterSpacing: 3, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s2", type: "widget", x: 25, y: 50, width: 350, height: 100, rotation: 0, opacity: 1, zIndex: 4, locked: false, props: { widgetType: "countdown", label: "ĐẾM NGƯỢC", targetDate: "2026-05-28" } },
        ],
    },
    {
        slug: "golden-hour",
        label: "Hoàng Hôn",
        emoji: "🌅",
        category: "classic",
        background: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)",
        accent: "#f59e0b",
        sections: [
            { id: "s1", name: "Bìa", height: 600 },
            { id: "s2", name: "Thông tin", height: 450 },
            { id: "s3", name: "Bản đồ", height: 350 },
        ],
        elements: [
            { id: uid(), sectionId: "s1", type: "text", x: 60, y: 50, width: 280, height: 50, rotation: 0, opacity: 1, zIndex: 1, locked: false, props: { text: "Wedding Invitation", fontSize: 16, fontFamily: "'Playfair Display', serif", color: "#92400e", textAlign: "center", fontWeight: "normal", fontStyle: "italic", textDecoration: "none", lineHeight: 1.4, letterSpacing: 2, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 30, y: 130, width: 340, height: 100, rotation: 0, opacity: 1, zIndex: 2, locked: false, props: { text: "Tuấn Minh\n&\nMai Lan", fontSize: 34, fontFamily: "'Dancing Script', cursive", color: "#78350f", textAlign: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s2", type: "text", x: 30, y: 30, width: 340, height: 180, rotation: 0, opacity: 1, zIndex: 3, locked: false, props: { text: "Chúng tôi trân trọng kính mời quý khách đến dự tiệc chung vui cùng gia đình chúng tôi.", fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#78350f", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.8, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s3", type: "widget", x: 25, y: 30, width: 350, height: 200, rotation: 0, opacity: 1, zIndex: 4, locked: false, props: { widgetType: "map", label: "Vị trí tiệc cưới", venueName: "Diamond Palace", venueAddress: "123 Nguyễn Huệ, Q.1, TP.HCM", mapUrl: "https://maps.google.com" } },
        ],
    },
    {
        slug: "cherry-blossom",
        label: "Anh Đào",
        emoji: "🌸",
        category: "romantic",
        background: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)",
        accent: "#ec4899",
        sections: [
            { id: "s1", name: "Bìa", height: 600 },
            { id: "s2", name: "Lịch & RSVP", height: 500 },
        ],
        elements: [
            { id: uid(), sectionId: "s1", type: "text", x: 30, y: 60, width: 340, height: 50, rotation: 0, opacity: 0.6, zIndex: 1, locked: false, props: { text: "TOGETHER WITH THEIR FAMILIES", fontSize: 11, fontFamily: "'Inter', sans-serif", color: "#9d174d", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.4, letterSpacing: 3, textTransform: "uppercase", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 20, y: 130, width: 360, height: 120, rotation: 0, opacity: 1, zIndex: 2, locked: false, props: { text: "Tuấn Minh\n&\nMai Lan", fontSize: 36, fontFamily: "'Dancing Script', cursive", color: "#be185d", textAlign: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 60, y: 310, width: 280, height: 100, rotation: 0, opacity: 1, zIndex: 3, locked: false, props: { text: "Mời bạn đến chung vui và chia sẻ niềm hạnh phúc cùng chúng tôi.", fontSize: 13, fontFamily: "'Inter', sans-serif", color: "#9d174d", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.8, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s2", type: "widget", x: 90, y: 20, width: 220, height: 220, rotation: 0, opacity: 1, zIndex: 4, locked: false, props: { widgetType: "calendar", label: "Lịch cưới", targetDate: "2026-05-28" } },
            { id: uid(), sectionId: "s2", type: "widget", x: 30, y: 270, width: 340, height: 200, rotation: 0, opacity: 1, zIndex: 5, locked: false, props: { widgetType: "rsvp", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng cho chúng tôi biết bạn có đến không" } },
        ],
    },
    {
        slug: "ocean-breeze",
        label: "Biển Xanh",
        emoji: "🌊",
        category: "minimal",
        background: "linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 100%)",
        accent: "#06b6d4",
        sections: [
            { id: "s1", name: "Bìa", height: 550 },
            { id: "s2", name: "Phong bì", height: 400 },
        ],
        elements: [
            { id: uid(), sectionId: "s1", type: "text", x: 40, y: 80, width: 320, height: 50, rotation: 0, opacity: 1, zIndex: 1, locked: false, props: { text: "Thiệp Mời", fontSize: 16, fontFamily: "'Playfair Display', serif", color: "#164e63", textAlign: "center", fontWeight: "normal", fontStyle: "italic", textDecoration: "none", lineHeight: 1.4, letterSpacing: 2, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 20, y: 160, width: 360, height: 100, rotation: 0, opacity: 1, zIndex: 2, locked: false, props: { text: "Tuấn Minh\n&\nMai Lan", fontSize: 32, fontFamily: "'Dancing Script', cursive", color: "#0e7490", textAlign: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s2", type: "widget", x: 25, y: 40, width: 350, height: 150, rotation: 0, opacity: 1, zIndex: 3, locked: false, props: { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "NGUYEN VAN A" } },
        ],
    },
    // ── Rich Cinelove-style template ──
    {
        slug: "cinelove-classic",
        label: "Cinelove Classic",
        emoji: "💍",
        category: "classic",
        background: "linear-gradient(180deg, #faf5ef 0%, #f5ede3 30%, #faf5ef 60%, #f5ede3 100%)",
        accent: "#b8860b",
        sections: [
            { id: "s1", name: "Full", height: 3200 },
        ],
        elements: [
            // ── HERO / BÌA ──
            { id: uid(), sectionId: "s1", type: "text", x: 40, y: 30, width: 310, height: 35, rotation: 0, opacity: 0.5, zIndex: 1, locked: false, props: { text: "SAVE THE DATE", fontSize: 12, fontFamily: "'Cinzel', serif", color: "#b8860b", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.4, letterSpacing: 6, textTransform: "uppercase", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 15, y: 80, width: 360, height: 120, rotation: 0, opacity: 1, zIndex: 2, locked: false, props: { text: "Tuấn Ninh\nand\nNlai Trang", fontSize: 36, fontFamily: "'Great Vibes', cursive", color: "#4a3728", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 65, y: 220, width: 260, height: 30, rotation: 0, opacity: 1, zIndex: 3, locked: false, props: { text: "28.01.2026", fontSize: 18, fontFamily: "'Cormorant Garamond', serif", color: "#8b7355", textAlign: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none", lineHeight: 1.4, letterSpacing: 4, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },

            // ── TRÂN TRỌNG MỜI BẠN ──
            { id: uid(), sectionId: "s1", type: "text", x: 30, y: 300, width: 330, height: 180, rotation: 0, opacity: 1, zIndex: 4, locked: false, props: { text: "Trân trọng mời Bạn\n\nDự Lễ Vu Quy\n\nVÀO 08:00, THỨ BẢY\nTHÁNG 02 — 28 — NĂM 2026\n\n(Tức ngày 8 tháng 12 năm Ất Tỵ)", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", color: "#4a3728", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.6, letterSpacing: 1, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 60, y: 500, width: 270, height: 70, rotation: 0, opacity: 1, zIndex: 5, locked: false, props: { text: "TƯ GIA NHÀ GÁI\nHÀ NỘI", fontSize: 14, fontFamily: "'Cinzel', serif", color: "#4a3728", textAlign: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none", lineHeight: 1.5, letterSpacing: 2, textTransform: "uppercase", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },

            // ── CHUYỆN KỂ RẰNG (Love Story) ──
            { id: uid(), sectionId: "s1", type: "text", x: 40, y: 640, width: 310, height: 50, rotation: 0, opacity: 1, zIndex: 6, locked: false, props: { text: "Chuyện kể rằng....", fontSize: 28, fontFamily: "'Great Vibes', cursive", color: "#b8860b", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 25, y: 710, width: 340, height: 200, rotation: 0, opacity: 1, zIndex: 7, locked: false, props: { text: "\"Chúng ta đã cùng nhau đi qua biết bao tháng năm, để nhận ra rằng được ở bên nhau là điều quý giá nhất.\n\nHôm nay, trước sự chứng kiến của mọi người, và khoảnh khắc này chúng ta nhẹ nhàng gọi nhau bằng hai tiếng vợ chồng\"", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", color: "#6b5744", textAlign: "center", fontWeight: "normal", fontStyle: "italic", textDecoration: "none", lineHeight: 1.8, letterSpacing: 0.5, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },

            // ── CHÚ RỂ & CÔ DÂU ──
            { id: uid(), sectionId: "s1", type: "text", x: 30, y: 960, width: 160, height: 80, rotation: 0, opacity: 1, zIndex: 8, locked: false, props: { text: "Chú rể\nTuấn Ninh\n16.01.2000", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", color: "#4a3728", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.6, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 200, y: 960, width: 160, height: 80, rotation: 0, opacity: 1, zIndex: 9, locked: false, props: { text: "Cô dâu\nNlai Trang\n26.01.2002", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", color: "#4a3728", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.6, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },

            // ── TIMELINE ──
            { id: uid(), sectionId: "s1", type: "text", x: 60, y: 1100, width: 270, height: 40, rotation: 0, opacity: 1, zIndex: 10, locked: false, props: { text: "Timeline", fontSize: 28, fontFamily: "'Great Vibes', cursive", color: "#b8860b", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 20, y: 1160, width: 110, height: 60, rotation: 0, opacity: 1, zIndex: 11, locked: false, props: { text: "08:00\nLễ thành hôn", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", color: "#4a3728", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.5, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 140, y: 1160, width: 110, height: 60, rotation: 0, opacity: 1, zIndex: 12, locked: false, props: { text: "10:30\nCheckin", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", color: "#4a3728", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.5, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 260, y: 1160, width: 110, height: 60, rotation: 0, opacity: 1, zIndex: 13, locked: false, props: { text: "11:00\nKhai tiệc", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", color: "#4a3728", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.5, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },

            // ── DRESSCODE ──
            { id: uid(), sectionId: "s1", type: "text", x: 60, y: 1280, width: 270, height: 40, rotation: 0, opacity: 1, zIndex: 14, locked: false, props: { text: "Dresscode", fontSize: 28, fontFamily: "'Great Vibes', cursive", color: "#b8860b", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
            { id: uid(), sectionId: "s1", type: "text", x: 60, y: 1330, width: 270, height: 30, rotation: 0, opacity: 0.6, zIndex: 15, locked: false, props: { text: "Xin vui lòng mặc trang phục theo tone màu", fontSize: 11, fontFamily: "'Cormorant Garamond', serif", color: "#6b5744", textAlign: "center", fontWeight: "normal", fontStyle: "italic", textDecoration: "none", lineHeight: 1.4, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },

            // ── LỜI NHẮN ──
            { id: uid(), sectionId: "s1", type: "text", x: 25, y: 1430, width: 340, height: 100, rotation: 0, opacity: 1, zIndex: 16, locked: false, props: { text: "Rất mong bạn có thể sắp xếp tới sớm để chụp thật nhiều ảnh kỷ niệm cùng chúng mình nhé!", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", color: "#4a3728", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.8, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },

            // ── CALENDAR ──
            { id: uid(), sectionId: "s1", type: "widget", x: 85, y: 1580, width: 220, height: 220, rotation: 0, opacity: 1, zIndex: 17, locked: false, props: { widgetType: "calendar", label: "Tháng 2", targetDate: "2026-02-28" } },

            // ── COUNTDOWN ──
            { id: uid(), sectionId: "s1", type: "widget", x: 25, y: 1850, width: 340, height: 100, rotation: 0, opacity: 1, zIndex: 18, locked: false, props: { widgetType: "countdown", label: "ĐẾM NGƯỢC NGÀY CƯỚI", targetDate: "2026-02-28" } },

            // ── RSVP ──
            { id: uid(), sectionId: "s1", type: "widget", x: 25, y: 2000, width: 340, height: 200, rotation: 0, opacity: 1, zIndex: 19, locked: false, props: { widgetType: "rsvp", rsvpTitle: "Xác nhận tham dự", rsvpSubtitle: "Vui lòng cho chúng tôi biết bạn có đến không" } },

            // ── MAP ──
            { id: uid(), sectionId: "s1", type: "widget", x: 25, y: 2250, width: 340, height: 200, rotation: 0, opacity: 1, zIndex: 20, locked: false, props: { widgetType: "map", label: "Vị trí tiệc cưới", venueName: "Tư gia nhà gái", venueAddress: "Hà Nội", mapUrl: "https://maps.google.com" } },

            // ── PHONG BÌ ──
            { id: uid(), sectionId: "s1", type: "widget", x: 25, y: 2500, width: 340, height: 200, rotation: 0, opacity: 1, zIndex: 21, locked: false, props: { widgetType: "gift", label: "Phong bì mừng cưới", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "NGUYEN VAN A" } },

            // ── CẢM ƠN ──
            { id: uid(), sectionId: "s1", type: "text", x: 30, y: 2750, width: 330, height: 80, rotation: 0, opacity: 1, zIndex: 22, locked: false, props: { text: "Cảm ơn bạn đã đến\nchung vui cùng chúng tôi 💕", fontSize: 20, fontFamily: "'Great Vibes', cursive", color: "#b8860b", textAlign: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", lineHeight: 1.4, letterSpacing: 0, textTransform: "none", textShadow: { active: false, color: "#000", blur: 0, x: 0, y: 0 }, backgroundColor: "" } },
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
