/**
 * Section Library — CineLove "Thành phần" tab parity
 * Pre-built section templates for drag-and-drop insertion into the editor.
 */

export interface SectionCategory {
    id: string;
    label: string;
    icon: string;
}

export interface SectionPreset {
    id: string;
    name: string;
    category: string;
    description: string;
    previewBg: string;
    previewHeight: number;
    elements: SectionElement[];
}

export interface SectionElement {
    type: "text" | "image" | "sticker" | "shape" | "container";
    label: string;
    props: Record<string, unknown>;
}

export const SECTION_CATEGORIES: SectionCategory[] = [
    { id: "all", label: "Tất cả", icon: "📋" },
    { id: "photo", label: "Ảnh", icon: "📷" },
    { id: "info", label: "Thông tin", icon: "ℹ️" },
    { id: "timeline", label: "Lịch trình", icon: "📅" },
    { id: "invitation", label: "Lời mời", icon: "💌" },
    { id: "other", label: "Khác", icon: "✨" },
];

export const SECTION_PRESETS: SectionPreset[] = [
    // ── Photo sections ──
    {
        id: "sec-hero-photo",
        name: "Ảnh bìa toàn màn hình",
        category: "photo",
        description: "Ảnh cặp đôi full-width với tên chồng lên",
        previewBg: "linear-gradient(135deg, #fce7f3, #f9a8d4)",
        previewHeight: 200,
        elements: [
            { type: "image", label: "Ảnh bìa", props: { objectFit: "cover", borderRadius: 0 } },
            { type: "text", label: "Tên cô dâu & chú rể", props: { fontSize: 36, fontFamily: "'Dancing Script', cursive", color: "#fff", textAlign: "center" } },
        ],
    },
    {
        id: "sec-photo-grid-2",
        name: "Lưới 2 ảnh ngang",
        category: "photo",
        description: "Hai ảnh cạnh nhau — Chú rể & Cô dâu",
        previewBg: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
        previewHeight: 150,
        elements: [
            { type: "image", label: "Ảnh chú rể", props: { objectFit: "cover", borderRadius: 12 } },
            { type: "image", label: "Ảnh cô dâu", props: { objectFit: "cover", borderRadius: 12 } },
        ],
    },
    {
        id: "sec-photo-grid-4",
        name: "Lưới 4 ảnh",
        category: "photo",
        description: "Bốn ảnh kỷ niệm xếp dạng grid",
        previewBg: "linear-gradient(135deg, #fef3c7, #fbbf24)",
        previewHeight: 180,
        elements: [
            { type: "image", label: "Ảnh 1", props: { objectFit: "cover", borderRadius: 8 } },
            { type: "image", label: "Ảnh 2", props: { objectFit: "cover", borderRadius: 8 } },
            { type: "image", label: "Ảnh 3", props: { objectFit: "cover", borderRadius: 8 } },
            { type: "image", label: "Ảnh 4", props: { objectFit: "cover", borderRadius: 8 } },
        ],
    },
    {
        id: "sec-photo-album",
        name: "Album ảnh cuộn",
        category: "photo",
        description: "Album ảnh dạng carousel / cuộn ngang",
        previewBg: "linear-gradient(135deg, #d1fae5, #6ee7b7)",
        previewHeight: 160,
        elements: [
            { type: "container", label: "Carousel container", props: { layout: "horizontal-scroll" } },
            { type: "image", label: "Ảnh album 1", props: { objectFit: "cover", borderRadius: 12 } },
            { type: "image", label: "Ảnh album 2", props: { objectFit: "cover", borderRadius: 12 } },
            { type: "image", label: "Ảnh album 3", props: { objectFit: "cover", borderRadius: 12 } },
        ],
    },

    // ── Info sections ──
    {
        id: "sec-couple-info",
        name: "Thông tin cặp đôi",
        category: "info",
        description: "Hai cột: chú rể bên trái, cô dâu bên phải",
        previewBg: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
        previewHeight: 180,
        elements: [
            { type: "image", label: "Ảnh chú rể", props: { objectFit: "cover", borderRadius: 999 } },
            { type: "text", label: "Tên chú rể", props: { fontSize: 20, fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Gia đình chú rể", props: { fontSize: 13, textAlign: "center", color: "#6b7280" } },
            { type: "image", label: "Ảnh cô dâu", props: { objectFit: "cover", borderRadius: 999 } },
            { type: "text", label: "Tên cô dâu", props: { fontSize: 20, fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Gia đình cô dâu", props: { fontSize: 13, textAlign: "center", color: "#6b7280" } },
        ],
    },
    {
        id: "sec-family-info",
        name: "Thông tin gia đình",
        category: "info",
        description: "Thông tin họ nhà trai, nhà gái chi tiết",
        previewBg: "linear-gradient(135deg, #fef9c3, #fde68a)",
        previewHeight: 150,
        elements: [
            { type: "text", label: "Tiêu đề nhà trai", props: { fontSize: 16, fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Cha mẹ chú rể", props: { fontSize: 14, textAlign: "center", color: "#374151" } },
            { type: "sticker", label: "Đường phân cách", props: { stickerId: "gold-line" } },
            { type: "text", label: "Tiêu đề nhà gái", props: { fontSize: 16, fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Cha mẹ cô dâu", props: { fontSize: 14, textAlign: "center", color: "#374151" } },
        ],
    },

    // ── Timeline sections ──
    {
        id: "sec-timeline-vertical",
        name: "Lịch trình dọc",
        category: "timeline",
        description: "Timeline lễ cưới theo giờ — dạng dọc",
        previewBg: "linear-gradient(135deg, #e0e7ff, #a5b4fc)",
        previewHeight: 200,
        elements: [
            { type: "text", label: "Tiêu đề Lịch trình", props: { fontSize: 22, fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Sự kiện 1 — Đón khách", props: { fontSize: 14, textAlign: "left" } },
            { type: "text", label: "Sự kiện 2 — Lễ thành hôn", props: { fontSize: 14, textAlign: "left" } },
            { type: "text", label: "Sự kiện 3 — Tiệc cưới", props: { fontSize: 14, textAlign: "left" } },
            { type: "shape", label: "Timeline line", props: { shapeType: "line", stroke: "#6366f1", strokeWidth: 2 } },
        ],
    },
    {
        id: "sec-timeline-cards",
        name: "Lịch trình dạng thẻ",
        category: "timeline",
        description: "Các sự kiện hiển thị dạng thẻ card",
        previewBg: "linear-gradient(135deg, #dbeafe, #93c5fd)",
        previewHeight: 180,
        elements: [
            { type: "text", label: "Tiêu đề", props: { fontSize: 22, fontWeight: "bold", textAlign: "center" } },
            { type: "container", label: "Card Đón khách", props: { background: "#fff", borderRadius: 12, padding: 16 } },
            { type: "container", label: "Card Lễ cưới", props: { background: "#fff", borderRadius: 12, padding: 16 } },
            { type: "container", label: "Card Tiệc", props: { background: "#fff", borderRadius: 12, padding: 16 } },
        ],
    },

    // ── Invitation sections ──
    {
        id: "sec-invitation-classic",
        name: "Lời mời truyền thống",
        category: "invitation",
        description: "Trân trọng kính mời — phong cách truyền thống Việt",
        previewBg: "linear-gradient(135deg, #fef3c7, #d4a574)",
        previewHeight: 200,
        elements: [
            { type: "sticker", label: "Trang trí đầu", props: { stickerId: "floral-top" } },
            { type: "text", label: "Trân trọng kính mời", props: { fontSize: 18, fontStyle: "italic", textAlign: "center" } },
            { type: "text", label: "Tên cặp đôi", props: { fontSize: 42, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Thông tin lễ cưới", props: { fontSize: 14, textAlign: "center", color: "#6b7280" } },
            { type: "sticker", label: "Trang trí cuối", props: { stickerId: "heart-divider" } },
        ],
    },
    {
        id: "sec-invitation-modern",
        name: "Lời mời hiện đại",
        category: "invitation",
        description: "Thiết kế tối giản, font hiện đại",
        previewBg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
        previewHeight: 180,
        elements: [
            { type: "text", label: "WE ARE GETTING MARRIED", props: { fontSize: 12, fontFamily: "'Montserrat', sans-serif", letterSpacing: 4, textAlign: "center", color: "#64748b" } },
            { type: "text", label: "Tên cặp đôi", props: { fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: "bold", textAlign: "center" } },
            { type: "shape", label: "Divider line", props: { shapeType: "line", stroke: "#cbd5e1", strokeWidth: 1 } },
            { type: "text", label: "Ngày & Địa điểm", props: { fontSize: 14, textAlign: "center", color: "#475569" } },
        ],
    },

    // ── Other sections ──
    {
        id: "sec-quote",
        name: "Lời trích dẫn",
        category: "other",
        description: "Câu quote tình yêu với nền mờ",
        previewBg: "linear-gradient(135deg, #faf5ff, #e9d5ff)",
        previewHeight: 120,
        elements: [
            { type: "text", label: "Câu quote", props: { fontSize: 16, fontStyle: "italic", textAlign: "center", color: "#7c3aed" } },
            { type: "text", label: "Tác giả", props: { fontSize: 12, textAlign: "center", color: "#a78bfa" } },
        ],
    },
    {
        id: "sec-rsvp",
        name: "Xác nhận tham dự (RSVP)",
        category: "other",
        description: "Form RSVP cho khách xác nhận",
        previewBg: "linear-gradient(135deg, #ecfdf5, #a7f3d0)",
        previewHeight: 160,
        elements: [
            { type: "text", label: "Tiêu đề RSVP", props: { fontSize: 22, fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Mô tả", props: { fontSize: 13, textAlign: "center", color: "#6b7280" } },
            { type: "container", label: "Form placeholder", props: { background: "#fff", borderRadius: 12, padding: 20 } },
        ],
    },
    {
        id: "sec-venue-map",
        name: "Bản đồ địa điểm",
        category: "other",
        description: "Hiển thị bản đồ và thông tin địa điểm tổ chức",
        previewBg: "linear-gradient(135deg, #f0fdf4, #bbf7d0)",
        previewHeight: 180,
        elements: [
            { type: "text", label: "Tiêu đề Địa điểm", props: { fontSize: 22, fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Tên nhà hàng / khách sạn", props: { fontSize: 16, textAlign: "center", color: "#374151" } },
            { type: "text", label: "Địa chỉ", props: { fontSize: 13, textAlign: "center", color: "#6b7280" } },
            { type: "container", label: "Map placeholder", props: { background: "#e5e7eb", borderRadius: 12, height: 200 } },
        ],
    },
    {
        id: "sec-countdown",
        name: "Đếm ngược",
        category: "other",
        description: "Đồng hồ đếm ngược ngày cưới",
        previewBg: "linear-gradient(135deg, #fdf2f8, #f9a8d4)",
        previewHeight: 140,
        elements: [
            { type: "text", label: "Save the Date", props: { fontSize: 24, fontFamily: "'Dancing Script', cursive", textAlign: "center" } },
            { type: "container", label: "Countdown timer", props: { layout: "countdown", targetDate: "" } },
        ],
    },
    {
        id: "sec-guestbook",
        name: "Lời chúc",
        category: "other",
        description: "Tường lời chúc từ khách mời",
        previewBg: "linear-gradient(135deg, #fff7ed, #fed7aa)",
        previewHeight: 160,
        elements: [
            { type: "text", label: "Tiêu đề Lời chúc", props: { fontSize: 22, fontWeight: "bold", textAlign: "center" } },
            { type: "text", label: "Mô tả", props: { fontSize: 13, textAlign: "center", color: "#6b7280" } },
            { type: "container", label: "Guestbook placeholder", props: { background: "#fff", borderRadius: 12, padding: 16 } },
        ],
    },
];
