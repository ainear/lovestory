/**
 * Section Presets — Pre-built CanvasElement-based sections
 * for the wedding template editor's "Thanh phan" tab.
 *
 * Each preset is an array of CanvasElement definitions (without id)
 * that together form a visual section (e.g. family info, timeline, etc.).
 */

import type {
  CanvasElement,
  TextProps,
  ImageProps,
  ShapeProps,
  WidgetProps,
} from "@/app/editor/[id]/components/canvas-engine/types";

export type SectionCategory =
  | "all"
  | "photo"
  | "info"
  | "timeline"
  | "invitation"
  | "other";

export interface SectionPreset {
  id: string;
  name: string;
  category: SectionCategory;
  thumbnail: string;
  elements: Omit<CanvasElement, "id">[];
}

/* ── Shared defaults ── */

const BASE: Omit<
  CanvasElement,
  "id" | "type" | "top" | "left" | "width" | "height" | "props"
> = {
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  zIndex: 0,
  locked: false,
  visible: true,
  opacity: 1,
  borderRadius: 0,
  border: { width: 0, color: "transparent", style: "solid" },
  shadow: null,
  entrance: null,
  continuous: null,
};

function text(
  top: number,
  left: number,
  width: number,
  overrides: Partial<TextProps> & { text: string },
  extra?: Partial<CanvasElement>,
): Omit<CanvasElement, "id"> {
  return {
    ...BASE,
    type: "text",
    top,
    left,
    width,
    height: "auto",
    props: {
      text: overrides.text,
      fontFamily: overrides.fontFamily ?? "'Playfair Display', serif",
      fontSize: overrides.fontSize ?? 16,
      fontWeight: overrides.fontWeight ?? "normal",
      fontStyle: overrides.fontStyle ?? "normal",
      color: overrides.color ?? "#1f2937",
      backgroundColor: overrides.backgroundColor ?? "transparent",
      textAlign: overrides.textAlign ?? "center",
      lineHeight: overrides.lineHeight ?? 1.4,
      letterSpacing: overrides.letterSpacing ?? 0,
    } satisfies TextProps,
    ...extra,
  };
}

function image(
  top: number,
  left: number,
  width: number,
  height: number,
  overrides?: Partial<ImageProps>,
  extra?: Partial<CanvasElement>,
): Omit<CanvasElement, "id"> {
  return {
    ...BASE,
    type: "image",
    top,
    left,
    width,
    height,
    borderRadius: extra?.borderRadius ?? 12,
    props: {
      src: overrides?.src ?? "",
      objectFit: overrides?.objectFit ?? "cover",
      crop: overrides?.crop ?? null,
    } satisfies ImageProps,
    ...extra,
  };
}

function shape(
  top: number,
  left: number,
  width: number,
  height: number,
  overrides?: Partial<ShapeProps>,
  extra?: Partial<CanvasElement>,
): Omit<CanvasElement, "id"> {
  return {
    ...BASE,
    type: "shape",
    top,
    left,
    width,
    height,
    props: {
      shapeType: overrides?.shapeType ?? "rectangle",
      fill: overrides?.fill ?? "#e5e7eb",
      stroke: overrides?.stroke ?? "transparent",
      strokeWidth: overrides?.strokeWidth ?? 0,
    } satisfies ShapeProps,
    ...extra,
  };
}

function widget(
  top: number,
  left: number,
  width: number,
  height: number,
  widgetType: WidgetProps["widgetType"],
  config: Record<string, unknown> = {},
  extra?: Partial<CanvasElement>,
): Omit<CanvasElement, "id"> {
  return {
    ...BASE,
    type: "widget",
    top,
    left,
    width,
    height,
    props: {
      widgetType,
      config,
    } satisfies WidgetProps,
    ...extra,
  };
}

/* ── Category definitions ── */

export const SECTION_PRESET_CATEGORIES: {
  id: SectionCategory;
  label: string;
  icon: string;
}[] = [
  { id: "all", label: "Tat ca", icon: "\u{1F4CB}" },
  { id: "photo", label: "Anh", icon: "\u{1F4F7}" },
  { id: "info", label: "Thong tin", icon: "\u2139\uFE0F" },
  { id: "timeline", label: "Lich trinh", icon: "\u{1F4C5}" },
  { id: "invitation", label: "Loi moi", icon: "\u{1F48C}" },
  { id: "other", label: "Khac", icon: "\u2728" },
];

/* ── Presets ── */

export const SECTION_PRESETS: SectionPreset[] = [
  /* 1. Khung anh cuoi — Wedding photo frame */
  {
    id: "preset-photo-frame",
    name: "Khung anh cuoi",
    category: "photo",
    thumbnail: "\u{1F5BC}\uFE0F",
    elements: [
      image(0, 0, 500, 350, { objectFit: "cover" }, { borderRadius: 16 }),
      text(360, 100, 300, {
        text: "Hanh phuc ben nhau",
        fontFamily: "'Dancing Script', cursive",
        fontSize: 24,
        fontWeight: "bold",
        color: "#7c3aed",
        textAlign: "center",
      }),
    ],
  },

  /* 2. Thong tin hai ho — Family info */
  {
    id: "preset-family-info",
    name: "Thong tin hai ho",
    category: "info",
    thumbnail: "\u{1F46B}",
    elements: [
      text(0, 50, 400, {
        text: "Thong Tin Hai Ho",
        fontSize: 26,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(50, 50, 400, {
        text: "Nha Trai",
        fontSize: 18,
        fontWeight: "bold",
        color: "#be185d",
        textAlign: "center",
      }),
      text(85, 50, 400, {
        text: "Ong Nguyen Van A & Ba Tran Thi B",
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
      }),
      text(120, 50, 400, {
        text: "Chu Re: NGUYEN VAN C",
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
      shape(160, 150, 200, 2, {
        shapeType: "line",
        fill: "#d4a574",
        stroke: "#d4a574",
        strokeWidth: 1,
      }),
      text(175, 50, 400, {
        text: "Nha Gai",
        fontSize: 18,
        fontWeight: "bold",
        color: "#be185d",
        textAlign: "center",
      }),
      text(210, 50, 400, {
        text: "Ong Le Van D & Ba Pham Thi E",
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
      }),
      text(245, 50, 400, {
        text: "Co Dau: LE THI F",
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
    ],
  },

  /* 3. Timeline su kien — Event timeline */
  {
    id: "preset-timeline",
    name: "Timeline su kien",
    category: "timeline",
    thumbnail: "\u{1F551}",
    elements: [
      text(0, 50, 400, {
        text: "Lich Trinh Le Cuoi",
        fontSize: 26,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(55, 30, 440, {
        text: "\u{1F559} 09:00 — Don khach & dang ky",
        fontSize: 15,
        color: "#374151",
        textAlign: "left",
      }),
      text(90, 30, 440, {
        text: "\u{1F55B} 10:00 — Le thanh hon",
        fontSize: 15,
        color: "#374151",
        textAlign: "left",
      }),
      text(125, 30, 440, {
        text: "\u{1F55D} 11:30 — Tiec cuoi & chuc mung",
        fontSize: 15,
        color: "#374151",
        textAlign: "left",
      }),
      text(160, 30, 440, {
        text: "\u{1F55F} 14:00 — Le vu quy",
        fontSize: 15,
        color: "#374151",
        textAlign: "left",
      }),
    ],
  },

  /* 4. Dresscode */
  {
    id: "preset-dresscode",
    name: "Dresscode",
    category: "other",
    thumbnail: "\u{1F457}",
    elements: [
      text(0, 50, 400, {
        text: "Dresscode",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(45, 50, 400, {
        text: "Hay den trong trang phuc lich su voi tong mau sau:",
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
      }),
      shape(90, 130, 80, 80, {
        shapeType: "circle",
        fill: "#fecdd3",
        stroke: "#fda4af",
        strokeWidth: 2,
      }),
      shape(90, 290, 80, 80, {
        shapeType: "circle",
        fill: "#c7d2fe",
        stroke: "#a5b4fc",
        strokeWidth: 2,
      }),
    ],
  },

  /* 5. Loi moi — Invitation letter */
  {
    id: "preset-invitation",
    name: "Loi moi",
    category: "invitation",
    thumbnail: "\u{1F48C}",
    elements: [
      text(0, 30, 440, {
        text: "Tran Trong Kinh Moi",
        fontSize: 28,
        fontWeight: "bold",
        color: "#7c3aed",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
      text(55, 30, 440, {
        text: "Thua ong/ba va gia dinh,\n\nChung toi tran trong kinh moi ong/ba den tham du buoi tiec chung mung le thanh hon cua chung toi.\n\nSu hien dien cua ong/ba la niem vinh hanh lon lao cho gia dinh chung toi.",
        fontSize: 14,
        color: "#374151",
        textAlign: "center",
        lineHeight: 1.7,
      }),
      text(220, 30, 440, {
        text: "Tran trong,\nCo Dau & Chu Re",
        fontSize: 16,
        fontStyle: "italic",
        color: "#6b7280",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
    ],
  },

  /* 6. Ten doi uyen uong — Couple names */
  {
    id: "preset-couple-names",
    name: "Ten doi uyen uong",
    category: "info",
    thumbnail: "\u{1F491}",
    elements: [
      text(0, 20, 200, {
        text: "Van A",
        fontSize: 42,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "right",
        fontFamily: "'Dancing Script', cursive",
      }),
      text(10, 220, 60, {
        text: "&",
        fontSize: 36,
        fontWeight: "normal",
        color: "#be185d",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(0, 280, 200, {
        text: "Thi B",
        fontSize: 42,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "left",
        fontFamily: "'Dancing Script', cursive",
      }),
    ],
  },

  /* 7. Lich cuoi — Wedding calendar */
  {
    id: "preset-calendar",
    name: "Lich cuoi",
    category: "timeline",
    thumbnail: "\u{1F4C6}",
    elements: [
      text(0, 50, 400, {
        text: "Save The Date",
        fontSize: 26,
        fontWeight: "bold",
        color: "#be185d",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
      widget(50, 75, 350, 300, "calendar", {
        weddingDate: "",
        highlightColor: "#be185d",
      }),
    ],
  },

  /* 8. Ban do — Map section */
  {
    id: "preset-map",
    name: "Ban do dia diem",
    category: "other",
    thumbnail: "\u{1F4CD}",
    elements: [
      text(0, 50, 400, {
        text: "Dia Diem To Chuc",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(45, 50, 400, {
        text: "Trung Tam Tiec Cuoi ABC Palace",
        fontSize: 16,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
      }),
      text(75, 50, 400, {
        text: "123 Duong Le Loi, Quan 1, TP. Ho Chi Minh",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
      }),
      widget(110, 25, 450, 250, "map", {
        lat: 10.7769,
        lng: 106.7009,
        zoom: 15,
        markerLabel: "Dia diem to chuc",
      }),
    ],
  },

  /* 9. RSVP */
  {
    id: "preset-rsvp",
    name: "Xac nhan tham du",
    category: "other",
    thumbnail: "\u2709\uFE0F",
    elements: [
      text(0, 50, 400, {
        text: "Xac Nhan Tham Du",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(45, 50, 400, {
        text: "Vui long xac nhan su tham du cua ban de chung toi co the chuan bi chu dao hon.",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
      }),
      widget(90, 50, 400, 200, "rsvp", {
        fields: ["name", "phone", "guests", "message"],
        buttonText: "Gui xac nhan",
        buttonColor: "#be185d",
      }),
    ],
  },

  /* 10. Gui qua mung — Gift / QR */
  {
    id: "preset-gift-qr",
    name: "Gui qua mung",
    category: "other",
    thumbnail: "\u{1F381}",
    elements: [
      text(0, 50, 400, {
        text: "Gui Qua Mung",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(45, 50, 400, {
        text: "Quet ma QR de gui loi chuc va qua mung den co dau chu re.",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
      }),
      widget(90, 150, 200, 200, "qrbox", {
        bankName: "Vietcombank",
        accountNumber: "0123456789",
        accountHolder: "NGUYEN VAN A",
      }),
    ],
  },

  /* 11. Chuyen tinh yeu — Our love story */
  {
    id: "preset-love-story",
    name: "Chuyen tinh yeu",
    category: "timeline",
    thumbnail: "\u{1F495}",
    elements: [
      text(0, 50, 400, {
        text: "Chuyen Tinh Yeu Cua Chung Toi",
        fontSize: 26,
        fontWeight: "bold",
        color: "#be185d",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
      shape(50, 245, 2, 280, {
        shapeType: "rectangle",
        fill: "#e5e7eb",
      }),
      text(60, 30, 200, {
        text: "2019",
        fontSize: 18,
        fontWeight: "bold",
        color: "#7c3aed",
        textAlign: "right",
      }),
      text(85, 30, 200, {
        text: "Lan dau gap nhau tai quan ca phe",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "right",
      }),
      text(130, 270, 200, {
        text: "2020",
        fontSize: 18,
        fontWeight: "bold",
        color: "#7c3aed",
        textAlign: "left",
      }),
      text(155, 270, 200, {
        text: "Chinh thuc hen ho",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "left",
      }),
      text(200, 30, 200, {
        text: "2023",
        fontSize: 18,
        fontWeight: "bold",
        color: "#7c3aed",
        textAlign: "right",
      }),
      text(225, 30, 200, {
        text: "Cau hon thanh cong",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "right",
      }),
      text(270, 270, 200, {
        text: "2024",
        fontSize: 18,
        fontWeight: "bold",
        color: "#7c3aed",
        textAlign: "left",
      }),
      text(295, 270, 200, {
        text: "Ngay chung toi nen duyen",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "left",
      }),
    ],
  },

  /* 12. Album anh — Photo gallery grid */
  {
    id: "preset-photo-gallery",
    name: "Album anh",
    category: "photo",
    thumbnail: "\u{1F4F8}",
    elements: [
      text(0, 50, 400, {
        text: "Album Cua Chung Toi",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      image(50, 20, 220, 180, { objectFit: "cover" }, { borderRadius: 12 }),
      image(50, 260, 220, 180, { objectFit: "cover" }, { borderRadius: 12 }),
      image(245, 20, 220, 180, { objectFit: "cover" }, { borderRadius: 12 }),
      image(245, 260, 220, 180, { objectFit: "cover" }, { borderRadius: 12 }),
    ],
  },

  /* 13. Dem nguoc — Countdown */
  {
    id: "preset-countdown",
    name: "Dem nguoc",
    category: "other",
    thumbnail: "\u23F3",
    elements: [
      text(0, 50, 400, {
        text: "Dem Nguoc Den Ngay Vui",
        fontSize: 24,
        fontWeight: "bold",
        color: "#be185d",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
      widget(55, 50, 400, 120, "countdown", {
        targetDate: "",
        labelDays: "Ngay",
        labelHours: "Gio",
        labelMinutes: "Phut",
        labelSeconds: "Giay",
        textColor: "#1f2937",
        accentColor: "#be185d",
      }),
    ],
  },

  /* 14. Video cuoi — YouTube embed */
  {
    id: "preset-video-embed",
    name: "Video cuoi",
    category: "photo",
    thumbnail: "\u{1F3AC}",
    elements: [
      text(0, 50, 400, {
        text: "Video Cuoi Cua Chung Toi",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      widget(50, 25, 450, 260, "youtube", {
        videoUrl: "",
        autoplay: false,
      }),
      text(320, 50, 400, {
        text: "Xem lai nhung khoanh khac dep nhat cua chung toi",
        fontSize: 13,
        fontStyle: "italic",
        color: "#6b7280",
        textAlign: "center",
      }),
    ],
  },

  /* 15. Cau noi lang man — Romantic quote */
  {
    id: "preset-quote",
    name: "Cau noi lang man",
    category: "invitation",
    thumbnail: "\u{1F4AC}",
    elements: [
      shape(0, 0, 500, 200, {
        shapeType: "rectangle",
        fill: "#fdf2f8",
      }),
      text(30, 50, 400, {
        text: "\u201CTinh yeu khong lam cho the gioi quay tron.\nTinh yeu la thu lam cho chuyen di xung dang.\u201D",
        fontSize: 18,
        fontStyle: "italic",
        color: "#9d174d",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
        lineHeight: 1.8,
      }),
      text(150, 50, 400, {
        text: "— Franklin P. Jones",
        fontSize: 13,
        color: "#be185d",
        textAlign: "center",
      }),
    ],
  },

  /* 16. Loi cam on — Thank you */
  {
    id: "preset-thank-you",
    name: "Loi cam on",
    category: "invitation",
    thumbnail: "\u{1F64F}",
    elements: [
      text(0, 50, 400, {
        text: "Loi Cam On",
        fontSize: 28,
        fontWeight: "bold",
        color: "#7c3aed",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
      text(55, 30, 440, {
        text: "Cam on ban da danh thoi gian den chung vui cung chung toi.\nSu hien dien cua ban la mon qua y nghia nhat.\nChuc ban va gia dinh luon binh an va hanh phuc!",
        fontSize: 15,
        color: "#374151",
        textAlign: "center",
        lineHeight: 1.8,
      }),
      text(160, 50, 400, {
        text: "Voi tat ca yeu thuong,\nCo Dau & Chu Re",
        fontSize: 16,
        fontStyle: "italic",
        color: "#6b7280",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
    ],
  },

  /* 17. Gui loi chuc — Wishes wall */
  {
    id: "preset-wishes-wall",
    name: "Gui loi chuc",
    category: "other",
    thumbnail: "\u{1F4DD}",
    elements: [
      text(0, 50, 400, {
        text: "Gui Loi Chuc",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(45, 50, 400, {
        text: "Hay gui nhung loi chuc tot dep nhat den co dau va chu re nhe!",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
      }),
      widget(90, 50, 400, 220, "formbuilder", {
        fields: ["name", "message"],
        buttonText: "Gui loi chuc",
        buttonColor: "#7c3aed",
        successMessage: "Cam on loi chuc cua ban!",
      }),
    ],
  },

  /* 18. Phong bi — Envelope intro */
  {
    id: "preset-envelope",
    name: "Phong bi",
    category: "other",
    thumbnail: "\u2709\uFE0F",
    elements: [
      widget(0, 0, 500, 400, "envelope", {
        coverText: "Thiep moi",
        openText: "Mo thiep",
        coverColor: "#fecdd3",
        accentColor: "#be185d",
      }),
    ],
  },

  /* 19. Banner anh — Photo banner with overlay */
  {
    id: "preset-photo-banner",
    name: "Banner anh",
    category: "photo",
    thumbnail: "\u{1F5BC}\uFE0F",
    elements: [
      image(0, 0, 500, 280, { objectFit: "cover" }, { borderRadius: 0 }),
      shape(0, 0, 500, 280, {
        shapeType: "rectangle",
        fill: "rgba(0,0,0,0.35)",
      }),
      text(80, 50, 400, {
        text: "We're Getting Married",
        fontSize: 36,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        fontFamily: "'Dancing Script', cursive",
      }),
      text(140, 100, 300, {
        text: "25 . 12 . 2024",
        fontSize: 20,
        color: "#ffffff",
        textAlign: "center",
        letterSpacing: 4,
      }),
    ],
  },

  /* 20. Loi chao khach — Guest greeting */
  {
    id: "preset-guest-greeting",
    name: "Loi chao khach moi",
    category: "invitation",
    thumbnail: "\u{1F44B}",
    elements: [
      text(0, 50, 400, {
        text: "Tran Trong Kinh Moi",
        fontSize: 18,
        color: "#6b7280",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      widget(40, 75, 350, 60, "guestname", {
        placeholder: "Quy Khach",
        fontSize: 32,
        fontFamily: "'Dancing Script', cursive",
        color: "#be185d",
      }),
      text(115, 50, 400, {
        text: "Den chung vui cung gia dinh chung toi\ntrong ngay le thanh hon",
        fontSize: 15,
        color: "#374151",
        textAlign: "center",
        lineHeight: 1.7,
      }),
    ],
  },

  /* 21. Nhac cuoi — Music suggestion */
  {
    id: "preset-music-player",
    name: "Nhac cuoi",
    category: "other",
    thumbnail: "\u{1F3B5}",
    elements: [
      text(0, 50, 400, {
        text: "Nhac Cuoi",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(45, 50, 400, {
        text: "Bai hat danh cho ngay dac biet cua chung toi",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
      }),
      shape(80, 75, 350, 100, {
        shapeType: "rectangle",
        fill: "#f3e8ff",
        stroke: "#c084fc",
        strokeWidth: 1,
      }),
      text(95, 95, 120, {
        text: "\u{1F3B6}",
        fontSize: 36,
        textAlign: "center",
      }),
      text(92, 200, 200, {
        text: "Can't Help Falling In Love",
        fontSize: 15,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "left",
      }),
      text(115, 200, 200, {
        text: "Elvis Presley",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "left",
      }),
      text(140, 200, 200, {
        text: "Nhan play de nghe",
        fontSize: 12,
        fontStyle: "italic",
        color: "#9333ea",
        textAlign: "left",
      }),
    ],
  },

  /* 22. Chia se — Social share */
  {
    id: "preset-social-share",
    name: "Chia se",
    category: "other",
    thumbnail: "\u{1F517}",
    elements: [
      text(0, 50, 400, {
        text: "Chia Se Voi Ban Be",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        fontFamily: "'Playfair Display', serif",
      }),
      text(45, 50, 400, {
        text: "Hay chia se thiep cuoi cua chung toi den nhung nguoi ban yeu thuong!",
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
      }),
      shape(85, 110, 70, 70, {
        shapeType: "circle",
        fill: "#dbeafe",
        stroke: "#93c5fd",
        strokeWidth: 1,
      }),
      text(100, 110, 70, {
        text: "\u{1F4F1}",
        fontSize: 28,
        textAlign: "center",
      }),
      shape(85, 215, 70, 70, {
        shapeType: "circle",
        fill: "#dcfce7",
        stroke: "#86efac",
        strokeWidth: 1,
      }),
      text(100, 215, 70, {
        text: "\u{1F4E7}",
        fontSize: 28,
        textAlign: "center",
      }),
      shape(85, 320, 70, 70, {
        shapeType: "circle",
        fill: "#fef3c7",
        stroke: "#fcd34d",
        strokeWidth: 1,
      }),
      text(100, 320, 70, {
        text: "\u{1F517}",
        fontSize: 28,
        textAlign: "center",
      }),
      text(170, 100, 100, {
        text: "Zalo",
        fontSize: 13,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
      }),
      text(170, 205, 100, {
        text: "Email",
        fontSize: 13,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
      }),
      text(170, 310, 100, {
        text: "Copy link",
        fontSize: 13,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
      }),
    ],
  },
];
