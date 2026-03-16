/**
 * Per-template unique element presets for ALL 75 Cinelove templates.
 * Sprint 63: 6 STRUCTURALLY UNIQUE layouts (not just color variations)
 * Each family has different element positions, section orders, photo layouts, and decorative patterns
 */

export type TemplateElement = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  animation: { entrance: string; loop: string };
  props: Record<string, unknown>;
};

/** Helper: text element */
function txt(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  o: {
    size?: number;
    font?: string;
    color?: string;
    weight?: string;
    italic?: boolean;
    align?: "left" | "center" | "right";
    opacity?: number;
    zIndex?: number;
    entrance?: string;
    lineHeight?: number;
    rotation?: number;
    locked?: boolean;
  } = {},
): TemplateElement {
  return {
    id,
    type: "text",
    x,
    y,
    width: w,
    height: h,
    rotation: o.rotation ?? 0,
    opacity: o.opacity ?? 1,
    zIndex: o.zIndex ?? 5,
    locked: o.locked ?? false,
    animation: { entrance: o.entrance ?? "fadeIn", loop: "none" },
    props: {
      text,
      fontSize: o.size ?? 14,
      fontFamily: o.font ?? "'Playfair Display', serif",
      fontWeight: o.weight ?? "normal",
      fontStyle: o.italic ? "italic" : "normal",
      color: o.color ?? "#831843",
      textAlign: o.align ?? "center",
      lineHeight: o.lineHeight ?? 1.4,
    },
  };
}

/** Helper: image placeholder element */
function img(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  o: {
    radius?: number;
    borderColor?: string;
    borderWidth?: number;
    rotation?: number;
    zIndex?: number;
    src?: string;
    locked?: boolean;
    opacity?: number;
  } = {},
): TemplateElement {
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
    id,
    type: "image",
    x,
    y,
    width: w,
    height: h,
    rotation: o.rotation ?? 0,
    opacity: o.opacity ?? 1,
    zIndex: o.zIndex ?? 1,
    locked: o.locked ?? false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: o.src ?? PLACEHOLDERS[id] ?? "/placeholder-couple.png",
      objectFit: "cover",
      borderRadius: o.radius ?? 8,
      borderWidth: o.borderWidth ?? 2,
      borderColor: o.borderColor ?? "#f9a8d4",
      opacity: o.opacity ?? 1,
    },
  };
}

// ═══════════════════════════════════════════
// LAYOUT A: ROMANTIC — Full-bleed hero, centered names, side-by-side portraits
// Section flow: Hero → Deco → Invite/Names → Family columns → Portraits row → Date block → Events → Gallery grid → Quote → Venue
// ═══════════════════════════════════════════
function makeRomanticPreset(
  accent: string,
  text: string,
  deco: string,
  font: string,
  decoText: string,
): TemplateElement[] {
  return [
    // ── Hero photo — full-width, large, premium feel ──
    img("img-main", 0, 0, 390, 480, {
      radius: 0,
      borderColor: "transparent",
      borderWidth: 0,
    }),

    // ── Decorative divider ──
    txt("txt-deco1", 20, 500, 350, 28, decoText, {
      size: 14,
      font: "'Georgia', serif",
      color: deco,
      opacity: 0.4,
      zIndex: 4,
      locked: true,
    }),

    // ── Ceremony label ──
    txt("txt-ceremony", 20, 540, 350, 36, "Lễ Thành Hôn", {
      size: 20,
      font: "'Cormorant Garamond', serif",
      color: deco,
      italic: true,
      zIndex: 2,
    }),

    // ── Invitation text ──
    txt("txt-invite", 20, 590, 350, 36, "Trân trọng kính mời", {
      size: 16,
      font,
      color: text,
      italic: true,
    }),

    // ── Names — CineLove uses VERY large script ──
    txt("txt-names", 10, 640, 370, 150, "Tên Chú Rể\nand\nTên Cô Dâu", {
      size: 48,
      font: "'Dancing Script', cursive",
      weight: "bold",
      italic: true,
      color: text,
      lineHeight: 1.0,
    }),

    // ── Decorative divider 2 ──
    txt("txt-deco2", 20, 810, 350, 24, "─────── ✿ ───────", {
      size: 11,
      font: "'Georgia', serif",
      color: deco,
      opacity: 0.3,
      locked: true,
    }),

    // ── Family text ──
    txt(
      "txt-family",
      20,
      850,
      350,
      70,
      "Cùng gia đình hai bên\ntrân trọng kính mời quý khách\ntới dự buổi lễ Vũ Quy",
      {
        size: 15,
        font: "'Lora', serif",
        color: text,
        italic: true,
        opacity: 0.9,
        lineHeight: 1.6,
      },
    ),

    // ── Nhà Trai / Nhà Gái ──
    txt("txt-nhatrai-label", 20, 950, 170, 32, "NHÀ TRAI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
    }),
    txt(
      "txt-nhatrai",
      20,
      985,
      170,
      80,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể",
      {
        size: 12,
        font: "'Lora', serif",
        color: text,
        opacity: 0.85,
        lineHeight: 1.9,
        align: "left",
      },
    ),
    txt("txt-nhagai-label", 200, 950, 170, 32, "NHÀ GÁI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
    }),
    txt(
      "txt-nhagai",
      200,
      985,
      170,
      80,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu",
      {
        size: 12,
        font: "'Lora', serif",
        color: text,
        opacity: 0.85,
        lineHeight: 1.9,
        align: "left",
      },
    ),

    // ── Decorative divider 3 ──
    txt(
      "txt-deco3",
      20,
      1090,
      350,
      24,
      "· · · · · · · · · · · · · · · · · · · · · · · · · ·",
      {
        size: 10,
        font: "'Georgia', serif",
        color: deco,
        opacity: 0.25,
        locked: true,
      },
    ),

    // ── Groom/Bride individual photos ──
    img("img-groom", 40, 1130, 140, 190, {
      radius: 16,
      borderColor: deco,
      rotation: -3,
      zIndex: 2,
    }),
    img("img-bride", 210, 1130, 140, 190, {
      radius: 16,
      borderColor: deco,
      rotation: 3,
      zIndex: 3,
    }),
    txt("name-groom", 40, 1330, 140, 32, "Chú Rể", {
      size: 18,
      font: "'Dancing Script', cursive",
      weight: "bold",
      color: text,
    }),
    txt("name-bride", 210, 1330, 140, 32, "Cô Dâu", {
      size: 18,
      font: "'Dancing Script', cursive",
      weight: "bold",
      color: text,
    }),

    // ── Styled Date Block — CineLove-style centered date ──
    txt(
      "txt-date",
      20,
      1400,
      350,
      40,
      "THÁNG 05                              NĂM 2026",
      {
        size: 16,
        font: "'Cormorant Garamond', serif",
        weight: "bold",
        color: text,
        lineHeight: 1.4,
      },
    ),
    txt("txt-date-day", 135, 1440, 120, 80, "28", {
      size: 64,
      font: "'Cormorant Garamond', serif",
      weight: "bold",
      color: accent,
    }),
    txt("txt-time", 20, 1530, 350, 30, "Lúc 10:00 sáng · Thứ Bảy", {
      size: 15,
      font: "'Lora', serif",
      color: text,
      italic: true,
      opacity: 0.8,
    }),

    // ── Decorative divider 4 ──
    txt("txt-deco4", 20, 1510, 350, 24, decoText, {
      size: 12,
      font: "'Georgia', serif",
      color: deco,
      opacity: 0.3,
      locked: true,
    }),

    // ── Events ──
    txt("txt-event1-label", 20, 1555, 170, 28, "LỄ VŨ QUY", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
    }),
    txt(
      "txt-event1",
      20,
      1585,
      170,
      60,
      "08:00 Sáng\nTư gia Nhà Gái\nĐịa chỉ Nhà Gái",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: text,
        opacity: 0.8,
        lineHeight: 1.7,
        align: "left",
      },
    ),
    txt("txt-event2-label", 200, 1555, 170, 28, "TIỆC CƯỚI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
    }),
    txt(
      "txt-event2",
      200,
      1585,
      170,
      60,
      "17:00 Chiều\nNhà Hàng ABC\nĐịa chỉ Nhà Hàng",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: text,
        opacity: 0.8,
        lineHeight: 1.7,
        align: "left",
      },
    ),

    // ── Gallery — spacious ──
    img("img-couple2", 30, 1680, 330, 220, {
      radius: 12,
      borderColor: accent,
      borderWidth: 1,
    }),
    img("img-gallery1", 30, 1920, 160, 150, { radius: 10, borderColor: deco }),
    img("img-gallery2", 200, 1920, 160, 150, { radius: 10, borderColor: deco }),
    img("img-gallery3", 30, 2085, 160, 150, { radius: 10, borderColor: deco }),
    img("img-gallery4", 200, 2085, 160, 150, { radius: 10, borderColor: deco }),

    // ── Quote ──
    txt(
      "txt-quote",
      30,
      2270,
      330,
      80,
      "Yeu la hanh phuc khi duoc o ben nhau,\nla niem vui moi ngay.",
      {
        size: 16,
        font: "'Lora', serif",
        color: text,
        italic: true,
        opacity: 0.9,
        lineHeight: 1.6,
      },
    ),

    // ── Venue ──
    txt(
      "txt-venue",
      20,
      2380,
      350,
      70,
      "Nhà Hàng ABC\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố",
      {
        size: 14,
        font: "'Inter', sans-serif",
        color: text,
        opacity: 0.9,
        lineHeight: 1.6,
      },
    ),

    // ── Bottom ornament ──
    txt("txt-deco5", 20, 2470, 350, 28, decoText, {
      size: 14,
      font: "'Georgia', serif",
      color: deco,
      opacity: 0.3,
      locked: true,
    }),
  ];
}

// ═══════════════════════════════════════════
// LAYOUT B: LUXURY — Dark bg, gold accents, large centered names on top, hero below
// Section flow: Big Names → Invitation → Hero photo → Date/Time centered → Family → Single large couple photo → Events stacked → Quote → Venue
// ═══════════════════════════════════════════
function makeLuxuryPreset(
  gold: string,
  light: string,
  midDeco: string,
): TemplateElement[] {
  return [
    txt("txt-ceremony", 20, 30, 350, 36, "WEDDING INVITATION", {
      size: 14,
      font: "'Cormorant Garamond', serif",
      color: gold,
      weight: "bold",
      zIndex: 2,
    }),
    txt("txt-names", 10, 80, 370, 120, "Tên Chú Rể\n&\nTên Cô Dâu", {
      size: 42,
      font: "'Playfair Display', serif",
      weight: "bold",
      italic: true,
      color: light,
      lineHeight: 1.1,
    }),
    txt("txt-deco1", 20, 210, 350, 28, midDeco, {
      size: 13,
      font: "'Georgia', serif",
      color: gold,
      opacity: 0.5,
      locked: true,
    }),
    txt("txt-invite", 20, 250, 350, 32, "TRÂN TRỌNG KÍNH MỜI", {
      size: 13,
      font: "'Cormorant Garamond', serif",
      weight: "bold",
      color: gold,
    }),
    txt(
      "txt-family",
      20,
      290,
      350,
      50,
      "Cùng gia đình hai bên\ntrân trọng kính mời quý khách",
      {
        size: 14,
        font: "'Lora', serif",
        color: light,
        italic: true,
        opacity: 0.85,
      },
    ),
    img("img-main", 40, 360, 310, 350, {
      radius: 8,
      borderColor: gold,
      borderWidth: 2,
    }),
    txt("txt-date", 20, 730, 350, 60, "Chủ Nhật, 28 · 05 · 2026", {
      size: 30,
      font: "'Cormorant Garamond', serif",
      weight: "bold",
      color: light,
    }),
    txt("txt-time", 20, 795, 350, 30, "Lúc 10:00 sáng", {
      size: 16,
      font: "'Lora', serif",
      color: gold,
      italic: true,
      opacity: 0.85,
    }),
    txt("txt-nhatrai-label", 20, 850, 170, 28, "NHÀ TRAI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: gold,
    }),
    txt(
      "txt-nhatrai",
      20,
      880,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể",
      {
        size: 12,
        font: "'Lora', serif",
        color: light,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    txt("txt-nhagai-label", 200, 850, 170, 28, "NHÀ GÁI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: gold,
    }),
    txt(
      "txt-nhagai",
      200,
      880,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu",
      {
        size: 12,
        font: "'Lora', serif",
        color: light,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    img("img-groom", 40, 970, 140, 180, {
      radius: 6,
      borderColor: gold,
      zIndex: 2,
    }),
    img("img-bride", 210, 970, 140, 180, {
      radius: 6,
      borderColor: gold,
      zIndex: 3,
    }),
    txt("name-groom", 40, 1160, 140, 32, "Chú Rể", {
      size: 16,
      font: "'Playfair Display', serif",
      weight: "bold",
      italic: true,
      color: light,
    }),
    txt("name-bride", 210, 1160, 140, 32, "Cô Dâu", {
      size: 16,
      font: "'Playfair Display', serif",
      weight: "bold",
      italic: true,
      color: light,
    }),
    txt("txt-event1-label", 20, 1220, 350, 24, "LỄ VŨ QUY", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: gold,
    }),
    txt(
      "txt-event1",
      20,
      1245,
      350,
      40,
      "08:00 Sáng · Tư gia Nhà Gái · Địa chỉ Nhà Gái",
      { size: 11, font: "'Inter', sans-serif", color: light, opacity: 0.8 },
    ),
    txt("txt-event2-label", 20, 1295, 350, 24, "TIỆC CƯỚI", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: gold,
    }),
    txt(
      "txt-event2",
      20,
      1320,
      350,
      40,
      "17:00 Chiều · Nhà Hàng ABC · Địa chỉ Nhà Hàng",
      { size: 11, font: "'Inter', sans-serif", color: light, opacity: 0.8 },
    ),
    img("img-couple2", 20, 1380, 350, 250, {
      radius: 8,
      borderColor: gold,
      borderWidth: 1,
    }),
    img("img-gallery1", 20, 1650, 110, 120, { radius: 6, borderColor: gold }),
    img("img-gallery2", 140, 1650, 110, 120, { radius: 6, borderColor: gold }),
    img("img-gallery3", 260, 1650, 110, 120, { radius: 6, borderColor: gold }),
    img("img-gallery4", 80, 1780, 230, 150, { radius: 6, borderColor: gold }),
    txt(
      "txt-quote",
      30,
      1960,
      330,
      70,
      "Every love story is beautiful,\nbut ours is my favorite.",
      {
        size: 16,
        font: "'Playfair Display', serif",
        color: light,
        italic: true,
        opacity: 0.9,
      },
    ),
    txt(
      "txt-venue",
      20,
      2050,
      350,
      60,
      "Nhà Hàng\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố",
      { size: 14, font: "'Inter', sans-serif", color: light, opacity: 0.85 },
    ),
  ];
}

// ═══════════════════════════════════════════
// LAYOUT C: CLASSIC — Elegant symmetry, hero + names interleaved, full-width gallery
// Section flow: Ceremony label → Names → Deco → Invite text → Hero → Date circle → Family → Portraits stacked → Events → Wide gallery → Quote → Venue
// ═══════════════════════════════════════════
function makeClassicPreset(
  heading: string,
  body: string,
  deco: string,
): TemplateElement[] {
  return [
    txt("txt-ceremony", 20, 20, 350, 40, "Lễ Vũ Quy", {
      size: 22,
      font: "'Cormorant Garamond', serif",
      color: heading,
      italic: true,
    }),
    txt("txt-names", 10, 70, 370, 120, "Tên Chú Rể\n&\nTên Cô Dâu", {
      size: 48,
      font: "'Playfair Display', serif",
      weight: "bold",
      color: heading,
      lineHeight: 1.1,
    }),
    txt("txt-deco1", 20, 175, 350, 24, "─── ♥ ───", {
      size: 12,
      font: "'Georgia', serif",
      color: deco,
      opacity: 0.4,
      locked: true,
    }),
    txt("txt-invite", 20, 210, 350, 32, "Trân trọng kính mời", {
      size: 16,
      font: "'Cormorant Garamond', serif",
      color: body,
      italic: true,
    }),
    txt(
      "txt-family",
      20,
      250,
      350,
      50,
      "Cùng gia đình hai bên\ntrân trọng kính mời quý khách",
      {
        size: 14,
        font: "'Lora', serif",
        color: body,
        italic: true,
        opacity: 0.85,
      },
    ),
    img("img-main", 50, 320, 290, 340, {
      radius: 4,
      borderColor: deco,
      borderWidth: 1,
    }),
    txt("txt-date", 20, 680, 350, 60, "Chủ Nhật, 28 · 05 · 2026", {
      size: 26,
      font: "'Cormorant Garamond', serif",
      weight: "bold",
      color: heading,
    }),
    txt("txt-time", 20, 745, 350, 30, "Lúc 10:00 sáng", {
      size: 16,
      font: "'Lora', serif",
      color: body,
      italic: true,
      opacity: 0.8,
    }),
    txt("txt-nhatrai-label", 20, 800, 170, 28, "NHÀ TRAI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: heading,
    }),
    txt(
      "txt-nhatrai",
      20,
      830,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể",
      {
        size: 12,
        font: "'Lora', serif",
        color: body,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    txt("txt-nhagai-label", 200, 800, 170, 28, "NHÀ GÁI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: heading,
    }),
    txt(
      "txt-nhagai",
      200,
      830,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu",
      {
        size: 12,
        font: "'Lora', serif",
        color: body,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    img("img-groom", 80, 920, 230, 160, {
      radius: 4,
      borderColor: deco,
      borderWidth: 1,
      zIndex: 2,
    }),
    img("img-bride", 80, 1090, 230, 160, {
      radius: 4,
      borderColor: deco,
      borderWidth: 1,
      zIndex: 3,
    }),
    txt("name-groom", 80, 1260, 230, 32, "Chú Rể", {
      size: 16,
      font: "'Playfair Display', serif",
      weight: "bold",
      color: heading,
    }),
    txt("name-bride", 80, 1090, 230, 32, "Cô Dâu", {
      size: 16,
      font: "'Playfair Display', serif",
      weight: "bold",
      color: heading,
      opacity: 0,
    }),
    txt("txt-event1-label", 20, 1310, 170, 24, "LỄ VŨ QUY", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: heading,
    }),
    txt(
      "txt-event1",
      20,
      1335,
      170,
      50,
      "08:00 Sáng\nTư gia Nhà Gái\nĐịa chỉ Nhà Gái",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: body,
        opacity: 0.8,
        lineHeight: 1.6,
        align: "left",
      },
    ),
    txt("txt-event2-label", 200, 1310, 170, 24, "TIỆC CƯỚI", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: heading,
    }),
    txt(
      "txt-event2",
      200,
      1335,
      170,
      50,
      "17:00 Chiều\nNhà Hàng ABC\nĐịa chỉ Nhà Hàng",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: body,
        opacity: 0.8,
        lineHeight: 1.6,
        align: "left",
      },
    ),
    img("img-couple2", 20, 1410, 350, 200, {
      radius: 4,
      borderColor: deco,
      borderWidth: 1,
    }),
    img("img-gallery1", 20, 1630, 170, 140, { radius: 4, borderColor: deco }),
    img("img-gallery2", 200, 1630, 170, 140, { radius: 4, borderColor: deco }),
    img("img-gallery3", 20, 1780, 170, 140, { radius: 4, borderColor: deco }),
    img("img-gallery4", 200, 1780, 170, 140, { radius: 4, borderColor: deco }),
    txt(
      "txt-quote",
      30,
      1940,
      330,
      50,
      "Yêu là hạnh phúc khi được ở bên nhau.",
      {
        size: 15,
        font: "'Lora', serif",
        color: body,
        italic: true,
        opacity: 0.85,
      },
    ),
    txt(
      "txt-venue",
      20,
      2010,
      350,
      60,
      "Nhà Hàng\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố",
      { size: 14, font: "'Inter', sans-serif", color: body, opacity: 0.85 },
    ),
  ];
}

// ═══════════════════════════════════════════
// LAYOUT D: TRADITIONAL — Red/gold, xi/double happiness, hero-first with large date
// Section flow: Hero fullwidth → Xi decoration → Bold Names → Large Date block → Family columns → Portraits with tilted frames → Events → Gallery mosaic → Quote → Venue
// ═══════════════════════════════════════════
function makeTraditionalPreset(
  red: string,
  dark: string,
  gold: string,
): TemplateElement[] {
  return [
    img("img-main", 20, 15, 350, 360, {
      radius: 12,
      borderColor: gold,
      borderWidth: 3,
    }),
    txt("txt-deco1", 20, 390, 350, 30, "═══════  囍  ═══════", {
      size: 14,
      font: "'Georgia', serif",
      color: red,
      opacity: 0.75,
      locked: true,
      weight: "bold",
    }),
    txt("txt-ceremony", 20, 425, 350, 36, "Lễ Thành Hôn", {
      size: 22,
      font: "'Dancing Script', cursive",
      color: red,
      weight: "bold",
    }),
    txt("txt-invite", 20, 465, 350, 32, "Trân Trọng Kính Mời", {
      size: 17,
      font: "'Playfair Display', serif",
      weight: "bold",
      color: red,
    }),
    txt("txt-names", 10, 505, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", {
      size: 38,
      font: "'Dancing Script', cursive",
      weight: "bold",
      italic: true,
      color: dark,
      lineHeight: 1.15,
    }),
    txt("txt-date", 60, 620, 270, 80, "28\nTHÁNG 05 · 2026", {
      size: 48,
      font: "'Playfair Display', serif",
      weight: "bold",
      color: dark,
      lineHeight: 0.9,
    }),
    txt("txt-time", 20, 710, 350, 30, "Lúc 10:00 sáng", {
      size: 16,
      font: "'Lora', serif",
      color: red,
      italic: true,
      opacity: 0.85,
    }),
    txt(
      "txt-family",
      20,
      755,
      350,
      50,
      "Cùng gia đình hai bên\ntrân trọng kính mời quý khách",
      {
        size: 14,
        font: "'Lora', serif",
        color: dark,
        italic: true,
        opacity: 0.9,
      },
    ),
    txt("txt-nhatrai-label", 20, 825, 170, 28, "NHÀ TRAI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: red,
    }),
    txt(
      "txt-nhatrai",
      20,
      855,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể",
      {
        size: 12,
        font: "'Lora', serif",
        color: dark,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    txt("txt-nhagai-label", 200, 825, 170, 28, "NHÀ GÁI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: red,
    }),
    txt(
      "txt-nhagai",
      200,
      855,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu",
      {
        size: 12,
        font: "'Lora', serif",
        color: dark,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    img("img-groom", 40, 945, 140, 180, {
      radius: 10,
      borderColor: gold,
      rotation: -2,
      zIndex: 2,
    }),
    img("img-bride", 210, 945, 140, 180, {
      radius: 10,
      borderColor: gold,
      rotation: 2,
      zIndex: 3,
    }),
    txt("name-groom", 40, 1135, 140, 32, "Chú Rể", {
      size: 16,
      font: "'Dancing Script', cursive",
      weight: "bold",
      color: dark,
    }),
    txt("name-bride", 210, 1135, 140, 32, "Cô Dâu", {
      size: 16,
      font: "'Dancing Script', cursive",
      weight: "bold",
      color: dark,
    }),
    txt("txt-event1-label", 20, 1190, 170, 24, "LỄ VŨ QUY", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: red,
    }),
    txt(
      "txt-event1",
      20,
      1215,
      170,
      50,
      "08:00 Sáng\nTư gia Nhà Gái\nĐịa chỉ Nhà Gái",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: dark,
        opacity: 0.8,
        lineHeight: 1.6,
        align: "left",
      },
    ),
    txt("txt-event2-label", 200, 1190, 170, 24, "TIỆC CƯỚI", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: red,
    }),
    txt(
      "txt-event2",
      200,
      1215,
      170,
      50,
      "17:00 Chiều\nNhà Hàng ABC\nĐịa chỉ Nhà Hàng",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: dark,
        opacity: 0.8,
        lineHeight: 1.6,
        align: "left",
      },
    ),
    img("img-couple2", 30, 1290, 330, 220, {
      radius: 12,
      borderColor: gold,
      borderWidth: 2,
    }),
    img("img-gallery1", 20, 1530, 170, 150, { radius: 10, borderColor: gold }),
    img("img-gallery2", 200, 1530, 170, 150, { radius: 10, borderColor: gold }),
    img("img-gallery3", 20, 1690, 170, 150, { radius: 10, borderColor: gold }),
    img("img-gallery4", 200, 1690, 170, 150, { radius: 10, borderColor: gold }),
    txt("txt-quote", 25, 1860, 340, 50, "Tình yêu là cùng nhìn về một hướng.", {
      size: 16,
      font: "'Dancing Script', cursive",
      color: red,
      italic: true,
      opacity: 0.9,
    }),
    txt(
      "txt-venue",
      20,
      1930,
      350,
      60,
      "Nhà Hàng\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố",
      { size: 14, font: "'Inter', sans-serif", color: dark, opacity: 0.9 },
    ),
  ];
}

// ═══════════════════════════════════════════
// LAYOUT E: NATURE — Organic flow, full-width photos alternating with text blocks
// Section flow: SAVE THE DATE header → Names → Hero full-width → Invite text → Stacked portraits → Date → Family → Events → Gallery 3-column → Quote → Venue
// ═══════════════════════════════════════════
function makeNaturePreset(
  accent: string,
  heading: string,
  leaf: string,
): TemplateElement[] {
  return [
    txt("txt-ceremony", 20, 20, 350, 32, "SAVE THE DATE", {
      size: 14,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
      opacity: 0.7,
    }),
    txt("txt-names", 10, 60, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", {
      size: 34,
      font: "'Dancing Script', cursive",
      weight: "bold",
      italic: true,
      color: heading,
      lineHeight: 1.15,
    }),
    txt("txt-deco1", 20, 170, 350, 24, "─── 🌿 ───", {
      size: 14,
      font: "'Georgia', serif",
      color: leaf,
      opacity: 0.55,
      locked: true,
    }),
    img("img-main", 0, 210, 390, 300, {
      radius: 0,
      borderColor: "transparent",
      borderWidth: 0,
    }),
    txt("txt-invite", 20, 530, 350, 32, "Trân trọng kính mời", {
      size: 15,
      font: "'Cormorant Garamond', serif",
      color: heading,
      italic: true,
    }),
    txt(
      "txt-family",
      20,
      570,
      350,
      50,
      "Cùng gia đình hai bên\nân hạnh kính mời quý khách",
      { size: 13, font: "'Lora', serif", color: heading, italic: true },
    ),
    img("img-groom", 30, 640, 160, 200, {
      radius: 20,
      borderColor: accent,
      borderWidth: 2,
      zIndex: 2,
    }),
    img("img-bride", 200, 640, 160, 200, {
      radius: 20,
      borderColor: accent,
      borderWidth: 2,
      zIndex: 3,
    }),
    txt("name-groom", 30, 850, 160, 32, "Chú Rể", {
      size: 16,
      font: "'Dancing Script', cursive",
      weight: "bold",
      color: heading,
    }),
    txt("name-bride", 200, 850, 160, 32, "Cô Dâu", {
      size: 16,
      font: "'Dancing Script', cursive",
      weight: "bold",
      color: heading,
    }),
    txt("txt-date", 20, 910, 350, 60, "Chủ Nhật, 28 · 05 · 2026", {
      size: 24,
      font: "'Cormorant Garamond', serif",
      weight: "bold",
      color: heading,
    }),
    txt("txt-time", 20, 975, 350, 30, "Lúc 10:00 sáng", {
      size: 15,
      font: "'Lora', serif",
      color: heading,
      italic: true,
    }),
    txt("txt-nhatrai-label", 20, 1030, 170, 28, "NHÀ TRAI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
    }),
    txt(
      "txt-nhatrai",
      20,
      1060,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể",
      {
        size: 12,
        font: "'Lora', serif",
        color: heading,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    txt("txt-nhagai-label", 200, 1030, 170, 28, "NHÀ GÁI", {
      size: 13,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
    }),
    txt(
      "txt-nhagai",
      200,
      1060,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu",
      {
        size: 12,
        font: "'Lora', serif",
        color: heading,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    txt("txt-event1-label", 20, 1155, 170, 24, "LỄ VŨ QUY", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
    }),
    txt(
      "txt-event1",
      20,
      1180,
      170,
      50,
      "08:00 Sáng\nTư gia Nhà Gái\nĐịa chỉ Nhà Gái",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: heading,
        opacity: 0.8,
        lineHeight: 1.6,
        align: "left",
      },
    ),
    txt("txt-event2-label", 200, 1155, 170, 24, "TIỆC CƯỚI", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: accent,
    }),
    txt(
      "txt-event2",
      200,
      1180,
      170,
      50,
      "17:00 Chiều\nNhà Hàng ABC\nĐịa chỉ Nhà Hàng",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: heading,
        opacity: 0.8,
        lineHeight: 1.6,
        align: "left",
      },
    ),
    img("img-couple2", 0, 1260, 390, 220, {
      radius: 0,
      borderColor: "transparent",
      borderWidth: 0,
    }),
    img("img-gallery1", 20, 1500, 115, 130, {
      radius: 12,
      borderColor: accent,
    }),
    img("img-gallery2", 140, 1500, 115, 130, {
      radius: 12,
      borderColor: accent,
    }),
    img("img-gallery3", 260, 1500, 115, 130, {
      radius: 12,
      borderColor: accent,
    }),
    img("img-gallery4", 80, 1640, 230, 150, {
      radius: 12,
      borderColor: accent,
    }),
    txt("txt-quote", 30, 1810, 330, 50, "Tình yêu là hành trình đẹp nhất.", {
      size: 15,
      font: "'Lora', serif",
      color: heading,
      italic: true,
      opacity: 0.9,
    }),
    txt(
      "txt-venue",
      20,
      1880,
      350,
      60,
      "📍 Nhà Hàng\nĐịa chỉ nhà hàng tiệc cưới\nQuận, Thành phố",
      { size: 12, font: "'Inter', sans-serif", color: heading, opacity: 0.9 },
    ),
  ];
}

// ═══════════════════════════════════════════
// LAYOUT F: MODERN MINIMAL — Geometric, B&W, sans-serif, asymmetric layout
// Section flow: Date on top → GETTING MARRIED → Names → Hero offset → Family minimal → Portraits centered → Events minimal → Gallery single row → Venue
// ═══════════════════════════════════════════
function makeModernPreset(
  dark: string,
  mid: string,
  line: string,
): TemplateElement[] {
  return [
    txt("txt-date", 20, 20, 350, 50, "28 . 05 . 2026", {
      size: 32,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: dark,
    }),
    txt("txt-ceremony", 20, 75, 350, 28, "WE'RE GETTING MARRIED", {
      size: 11,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: mid,
      opacity: 0.7,
    }),
    txt("txt-deco1", 20, 108, 350, 20, "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", {
      size: 10,
      font: "'Inter', sans-serif",
      color: line,
      opacity: 0.3,
      locked: true,
    }),
    txt("txt-names", 10, 140, 370, 100, "Tên Chú Rể\n&\nTên Cô Dâu", {
      size: 36,
      font: "'Cormorant Garamond', serif",
      weight: "bold",
      color: dark,
      lineHeight: 1.15,
    }),
    txt(
      "txt-invite",
      20,
      250,
      350,
      32,
      "REQUEST THE PLEASURE OF YOUR COMPANY",
      {
        size: 10,
        font: "'Inter', sans-serif",
        weight: "bold",
        color: mid,
        opacity: 0.6,
      },
    ),
    img("img-main", 60, 300, 270, 320, {
      radius: 0,
      borderColor: dark,
      borderWidth: 2,
    }),
    txt("txt-time", 20, 640, 350, 24, "10:00 AM", {
      size: 14,
      font: "'Inter', sans-serif",
      color: mid,
      opacity: 0.7,
    }),
    txt(
      "txt-family",
      20,
      680,
      350,
      40,
      "Cùng gia đình hai bên\nân hạnh kính mời quý khách",
      { size: 13, font: "'Inter', sans-serif", color: mid },
    ),
    txt("txt-nhatrai-label", 20, 740, 170, 28, "NHÀ TRAI", {
      size: 11,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: dark,
    }),
    txt(
      "txt-nhatrai",
      20,
      770,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon trai: Tên Chú Rể",
      {
        size: 12,
        font: "'Inter', sans-serif",
        color: mid,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    txt("txt-nhagai-label", 200, 740, 170, 28, "NHÀ GÁI", {
      size: 11,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: dark,
    }),
    txt(
      "txt-nhagai",
      200,
      770,
      170,
      70,
      "Ông: Họ tên cha\nBà: Họ tên mẹ\nCon gái: Tên Cô Dâu",
      {
        size: 12,
        font: "'Inter', sans-serif",
        color: mid,
        opacity: 0.85,
        lineHeight: 1.8,
        align: "left",
      },
    ),
    img("img-groom", 50, 860, 140, 170, {
      radius: 0,
      borderColor: dark,
      borderWidth: 1,
      zIndex: 2,
    }),
    img("img-bride", 200, 860, 140, 170, {
      radius: 0,
      borderColor: dark,
      borderWidth: 1,
      zIndex: 3,
    }),
    txt("name-groom", 50, 1040, 140, 28, "MINH ANH", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: dark,
    }),
    txt("name-bride", 200, 1040, 140, 28, "THUỲ LINH", {
      size: 12,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: dark,
    }),
    txt("txt-event1-label", 20, 1090, 350, 24, "CEREMONY & RECEPTION", {
      size: 11,
      font: "'Inter', sans-serif",
      weight: "bold",
      color: dark,
    }),
    txt(
      "txt-event1",
      20,
      1115,
      350,
      40,
      "08:00 AM — Lễ Vũ Quy — Tư gia Nhà Gái",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: mid,
        opacity: 0.8,
        align: "left",
      },
    ),
    txt("txt-event2-label", 20, 1160, 350, 0, "", {
      size: 1,
      font: "'Inter', sans-serif",
      color: "transparent",
    }),
    txt(
      "txt-event2",
      20,
      1165,
      350,
      40,
      "05:00 PM — Tiệc Cưới — Nhà Hàng ABC",
      {
        size: 11,
        font: "'Inter', sans-serif",
        color: mid,
        opacity: 0.8,
        align: "left",
      },
    ),
    img("img-couple2", 40, 1230, 310, 200, {
      radius: 0,
      borderColor: dark,
      borderWidth: 1,
    }),
    img("img-gallery1", 20, 1450, 85, 100, { radius: 0, borderColor: line }),
    img("img-gallery2", 115, 1450, 85, 100, { radius: 0, borderColor: line }),
    img("img-gallery3", 210, 1450, 85, 100, { radius: 0, borderColor: line }),
    img("img-gallery4", 305, 1450, 80, 100, { radius: 0, borderColor: line }),
    txt(
      "txt-quote",
      20,
      1570,
      350,
      40,
      "Minimalism is the art of living with less but feeling more.",
      { size: 13, font: "'Inter', sans-serif", color: mid, italic: true },
    ),
    txt(
      "txt-venue",
      20,
      1630,
      350,
      50,
      "Diamond Palace — 123 Nguyễn Huệ, Q1, TP.HCM",
      { size: 11, font: "'Inter', sans-serif", color: mid, opacity: 0.75 },
    ),
  ];
}

// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// CINELOVE TEMPLATE 53 — Exact Replica (scraped from live CineLove editor)
// Canvas: 500→390px (scale 0.78) · BG: #f8f3eb (cream)
// Fonts: Mallong→Cormorant Garamond, RetroSignature→Great Vibes, Carlytte→Sacramento, Quicksand, Montserrat
// Colors: #4870A3 (blue) · #343432 (dark) · #4B5320 (olive)
// ═══════════════════════════════════════════
function makeCineLove53(): TemplateElement[] {
  const blue = "#4870A3";
  const dark = "#343432";
  const olive = "#4B5320";
  const cream = "rgba(72,112,163,0.08)";
  const mallong = "'Cormorant Garamond', serif";
  const retro = "'Great Vibes', cursive";
  const carly = "'Sacramento', cursive";
  const quick = "'Quicksand', sans-serif";
  const mont = "'Montserrat', sans-serif";

  // Demo images
  const heroImg =
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";
  const coupleImg =
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80";
  const albumImg1 =
    "https://images.unsplash.com/photo-1620023419992-12f5aee300ed?auto=format&fit=crop&w=600&q=80";
  const albumImg2 =
    "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=600&q=80";
  const albumImg3 =
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80";

  // Decorative transparent PNGs from CineLove assets
  const iconRings =
    "https://assets.cinelove.me/resources/flowchartIcons/3ienjp2nrx4h47t1yh3xzv.png";
  const iconCamera =
    "https://assets.cinelove.me/resources/flowchartIcons/1u64lvcg56egyde7h8rkwr.png";
  const iconWine =
    "https://assets.cinelove.me/resources/flowchartIcons/7ojrsz5b157xyl3xo134g.png";
  const iconCalendarHeart =
    "https://assets.cinelove.me/assets/plugins/calen_heart_1.png";
  const iconDresscode =
    "https://assets.cinelove.me/resources/flowchartIcons/zyryqj33inoq811jkpand.png";
  const waxSeal = "https://assets.cinelove.me/assets/plugins/wax-seal.webp";

  // Abstract floral overlay
  const floralTop =
    "https://images.unsplash.com/photo-1557004413-5cb2b55f1107?auto=format&fit=crop&w=800&q=80"; // Using unsplash for floral abstract if needed

  return [
    // ── Header ──
    txt("txt-le-cuoi", 20, 20, 350, 40, "Lễ Cưới", {
      size: 33,
      font: retro,
      color: olive,
      weight: "bold",
    }),

    // ── Hero Photo ──
    img("img-main", 0, 80, 390, 260, {
      radius: 0,
      borderColor: "transparent",
      borderWidth: 0,
      src: heroImg,
    }),

    // ── Couple portrait ──
    img("img-couple", 95, 330, 200, 140, {
      radius: 6,
      borderColor: cream,
      borderWidth: 0,
      src: coupleImg,
    }),

    // ── Family Info ──
    txt("txt-nhatrai-label", 20, 510, 170, 22, "NHÀ TRAI", {
      size: 15,
      font: mallong,
      weight: "bold",
      color: dark,
      align: "right",
    }),
    txt("txt-nhagai-label", 200, 510, 170, 22, "NHÀ GÁI", {
      size: 15,
      font: mallong,
      weight: "bold",
      color: dark,
      align: "left",
    }),
    txt("txt-bo-trai", 20, 540, 170, 20, "Bố : Tuấn Kiệt", {
      size: 14,
      font: mont,
      color: dark,
      align: "right",
    }),
    txt("txt-me-trai", 20, 565, 170, 20, "Mẹ : Diễm My", {
      size: 14,
      font: mont,
      color: dark,
      align: "right",
    }),
    txt("txt-bo-gai", 200, 540, 170, 20, "Bố : Quốc Phong", {
      size: 14,
      font: mont,
      color: dark,
      align: "left",
    }),
    txt("txt-me-gai", 200, 565, 170, 20, "Mẹ : Hoàng Yến", {
      size: 14,
      font: mont,
      color: dark,
      align: "left",
    }),
    txt("txt-diachi-trai", 20, 595, 170, 18, "Hà Nội", {
      size: 12,
      font: mont,
      color: dark,
      opacity: 0.7,
      align: "right",
    }),
    txt("txt-diachi-gai", 200, 595, 170, 18, "Ninh Bình", {
      size: 12,
      font: mont,
      color: dark,
      opacity: 0.7,
      align: "left",
    }),

    // ── Couple Names ──
    txt("txt-name-groom", 10, 660, 200, 78, "Tuấn Minh", {
      size: 46,
      font: mallong,
      weight: "bold",
      color: blue,
      align: "center",
    }),
    txt("txt-and", 155, 700, 80, 60, "and", {
      size: 56,
      font: retro,
      color: olive,
      align: "center",
    }),
    txt("txt-name-bride", 180, 750, 200, 78, "Mai Trang", {
      size: 46,
      font: mallong,
      weight: "bold",
      color: blue,
      align: "center",
    }),

    // Wax Seal Decoration
    img("img-wax-seal", 180, 810, 30, 30, { src: waxSeal, locked: true }),

    // ── Invitation ──
    txt("txt-invite", 20, 855, 350, 35, "Trân trọng mời Bạn", {
      size: 20,
      font: mallong,
      weight: "bold",
      color: dark,
    }),
    txt("txt-invite2", 20, 895, 350, 44, "Dự  Lễ Vu Quy", {
      size: 26,
      font: mallong,
      weight: "bold",
      color: blue,
    }),

    // ── Event 1 (Vu Quy) ──
    txt("txt-vuquy-time", 20, 960, 350, 44, "Vào 08:00, Thứ Bảy", {
      size: 26,
      font: mallong,
      weight: "bold",
      color: dark,
    }),
    txt("txt-vuquy-date-left", 10, 1010, 140, 40, "Tháng 02", {
      size: 23,
      font: mallong,
      weight: "bold",
      color: dark,
    }),
    txt("txt-vuquy-day", 135, 990, 120, 86, "28", {
      size: 69,
      font: quick,
      weight: "bold",
      color: blue,
      align: "center",
    }),
    txt("txt-vuquy-date-right", 245, 1010, 140, 40, "năm 2026", {
      size: 23,
      font: mallong,
      weight: "bold",
      color: dark,
    }),
    txt(
      "txt-vuquy-lunar",
      20,
      1085,
      350,
      23,
      "(Tức ngày 8 tháng 12 năm Ất Tỵ)",
      { size: 13, font: mallong, weight: "bold", color: dark },
    ),
    txt("txt-vuquy-venue", 20, 1120, 350, 44, "tư gia nhà Gái", {
      size: 26,
      font: mallong,
      weight: "bold",
      color: blue,
    }),
    txt("txt-vuquy-addr", 20, 1165, 350, 23, "Hà Nội", {
      size: 13,
      font: mallong,
      weight: "bold",
      color: dark,
    }),

    // ── Event 2 (Tiec) ──
    txt("txt-tiec-invite", 20, 1220, 350, 44, "Dự  Bữa Tiệc Thân Mật", {
      size: 26,
      font: mallong,
      weight: "bold",
      color: blue,
    }),
    txt("txt-tiec-time", 20, 1280, 350, 44, "Vào 17:30, Thứ Bảy", {
      size: 26,
      font: mallong,
      weight: "bold",
      color: dark,
    }),
    txt("txt-tiec-date-left", 10, 1330, 140, 40, "Tháng 02", {
      size: 23,
      font: mallong,
      weight: "bold",
      color: dark,
    }),
    txt("txt-tiec-day", 135, 1315, 120, 86, "28", {
      size: 69,
      font: quick,
      weight: "bold",
      color: blue,
      align: "center",
    }),
    txt("txt-tiec-date-right", 245, 1330, 140, 40, "năm 2026", {
      size: 23,
      font: mallong,
      weight: "bold",
      color: dark,
    }),
    txt(
      "txt-tiec-lunar",
      20,
      1405,
      350,
      23,
      "(Tức ngày 8 tháng 12 năm Ất Tỵ)",
      { size: 13, font: mallong, weight: "bold", color: dark },
    ),
    txt("txt-tiec-venue", 20, 1440, 350, 44, "nhà hàng sen vàng", {
      size: 26,
      font: mallong,
      weight: "bold",
      color: blue,
    }),
    txt("txt-tiec-addr", 20, 1485, 350, 23, "Quốc Oai - Hà Nội", {
      size: 13,
      font: mallong,
      weight: "bold",
      color: dark,
    }),

    // ── Timeline (With Graphic Icons) ──
    txt("txt-timeline-title", 20, 1540, 350, 73, "Timeline", {
      size: 66,
      font: retro,
      color: olive,
    }),

    img("img-icon-rings", 25, 1630, 70, 70, { src: iconRings, locked: true }),
    img("img-icon-camera", 160, 1630, 70, 70, {
      src: iconCamera,
      locked: true,
    }),
    img("img-icon-wine", 295, 1630, 70, 70, { src: iconWine, locked: true }),

    txt("txt-tl-time1", 10, 1710, 100, 26, "08:00", {
      size: 18,
      font: quick,
      weight: "500",
      color: dark,
    }),
    txt("txt-tl-event1", 10, 1735, 100, 20, "Lễ thành hôn", {
      size: 14,
      font: quick,
      weight: "500",
      color: dark,
    }),

    txt("txt-tl-time2", 145, 1710, 100, 26, "10:30", {
      size: 18,
      font: quick,
      weight: "500",
      color: dark,
    }),
    txt("txt-tl-event2", 145, 1735, 100, 20, "Checkin", {
      size: 14,
      font: quick,
      weight: "500",
      color: dark,
    }),

    txt("txt-tl-time3", 280, 1710, 100, 26, "11:00", {
      size: 18,
      font: quick,
      weight: "500",
      color: dark,
    }),
    txt("txt-tl-event3", 280, 1735, 100, 20, "Khai tiệc", {
      size: 14,
      font: quick,
      weight: "500",
      color: dark,
    }),

    // ── Dresscode ──
    txt("txt-dresscode-title", 20, 1820, 350, 73, "Dresscode", {
      size: 66,
      font: retro,
      color: olive,
    }),
    txt(
      "txt-dresscode-desc",
      40,
      1900,
      310,
      40,
      "Trang phục khuyến nghị tham dự",
      { size: 14, font: quick, color: dark },
    ),
    img("img-icon-dresscode", 145, 1940, 100, 110, {
      src: iconDresscode,
      locked: true,
    }),
    txt("txt-dresscode-colors", 40, 2060, 310, 30, "🔵 ⚪ 🔘", {
      size: 24,
      font: quick,
      color: dark,
    }),

    // ── Couple Cards ──
    txt("txt-groom-label", 20, 2120, 160, 27, "Chú rể", {
      size: 25,
      font: carly,
      color: dark,
    }),
    txt("txt-bride-label", 210, 2120, 160, 27, "Cô dâu", {
      size: 25,
      font: carly,
      color: dark,
    }),
    txt("txt-groom-name2", 20, 2155, 160, 42, "Tuấn Minh", {
      size: 25,
      font: mallong,
      weight: "bold",
      color: blue,
    }),
    txt("txt-bride-name2", 210, 2155, 160, 42, "Mai Trang", {
      size: 25,
      font: mallong,
      weight: "bold",
      color: blue,
    }),
    txt("txt-groom-dob", 20, 2200, 160, 27, "16.01.2000", {
      size: 20,
      font: carly,
      color: blue,
    }),
    txt("txt-bride-dob", 210, 2200, 160, 27, "28.01.2002", {
      size: 20,
      font: carly,
      color: blue,
    }),

    // ── Story ──
    txt("txt-story-title", 20, 2260, 350, 56, "Chuyện kể rằng.....", {
      size: 57,
      font: retro,
      color: dark,
    }),
    txt(
      "txt-story1",
      30,
      2330,
      330,
      100,
      "Chúng mình gặp nhau từ những ngày còn ngồi học chung ở cấp 3. Khi ấy chúng mình chỉ là hai đứa trẻ hay cười đùa, nhưng số phận đã gieo duyên.",
      { size: 14, font: quick, color: olive, lineHeight: 1.8, align: "left" },
    ),
    txt(
      "txt-story2",
      30,
      2430,
      330,
      70,
      "Và hôm nay, chúng mình quyết định viết tiếp câu chuyện ấy bằng một lời hứa trọn đời.",
      { size: 14, font: quick, color: olive, lineHeight: 1.8, align: "left" },
    ),

    // ── Advanced Calendar (with Heart) ──
    txt("txt-cal-title", 20, 2520, 350, 40, "Tháng 2", {
      size: 34,
      font: retro,
      color: blue,
    }),
    txt(
      "txt-cal-grid",
      40,
      2570,
      310,
      200,
      "2  3  4  5  6  7  8\\n9 10 11 12 13 14 15\\n16 17 18 19 20 21 22\\n23 24 25 26 27 28 29",
      { size: 16, font: "monospace", color: dark, lineHeight: 2 },
    ),
    img("img-icon-heart", 260, 2695, 25, 25, {
      src: iconCalendarHeart,
      opacity: 0.8,
      locked: true,
    }), // Hovering over 28

    // ── Countdown Widget ──
    {
      id: "plugin-countdown",
      type: "countdown",
      x: 20,
      y: 2520,
      width: 350,
      height: 120,
      rotation: 0,
      opacity: 1,
      zIndex: 5,
      locked: false,
      animation: { entrance: "fadeIn", loop: "none" },
      props: {
        targetDate: "2026-01-28",
        label: "Ngày trọng đại",
        accentColor: blue,
        theme: "elegant",
      },
    },

    // ── Calendar Widget ──
    {
      id: "plugin-calendar",
      type: "calendar",
      x: 20,
      y: 2660,
      width: 350,
      height: 280,
      rotation: 0,
      opacity: 1,
      zIndex: 5,
      locked: false,
      animation: { entrance: "fadeIn", loop: "none" },
      props: {
        selectedDate: "2026-01-28",
        accentColor: blue,
        highlightColor: "#f9a8d4",
      },
    },

    // ── Map Widget ──
    {
      id: "plugin-map",
      type: "map",
      x: 20,
      y: 2960,
      width: 350,
      height: 200,
      rotation: 0,
      opacity: 1,
      zIndex: 5,
      locked: false,
      animation: { entrance: "fadeIn", loop: "none" },
      props: {
        address: "Nhà hàng Sen Vàng, Quốc Oai, Hà Nội",
        mapUrl: "https://maps.app.goo.gl/Wd7CAj6d3scKH5pV6",
        label: "Nhà hàng Sen Vàng",
      },
    },

    // ── Photo Album ──
    {
      id: "plugin-album",
      type: "album",
      x: 20,
      y: 3180,
      width: 350,
      height: 300,
      rotation: 0,
      opacity: 1,
      zIndex: 5,
      locked: false,
      animation: { entrance: "fadeIn", loop: "none" },
      props: {
        images: [
          { src: albumImg1, alt: "Ảnh 1" },
          { src: albumImg2, alt: "Ảnh 2" },
          { src: albumImg3, alt: "Ảnh 3" },
          { src: coupleImg, alt: "Ảnh 4" },
          { src: heroImg, alt: "Ảnh 5" },
        ],
        columns: 3,
        gap: 8,
      },
    },

    // ── RSVP Form ──
    {
      id: "plugin-rsvp",
      type: "rsvp",
      x: 20,
      y: 3500,
      width: 350,
      height: 300,
      rotation: 0,
      opacity: 1,
      zIndex: 5,
      locked: false,
      animation: { entrance: "fadeIn", loop: "none" },
      props: {
        title: "Xác nhận tham dự",
        nameLabel: "Họ và Tên",
        submitLabel: "Gửi xác nhận",
        accentColor: blue,
      },
    },

    // ── QR Bank Box ──
    {
      id: "plugin-qrbox",
      type: "qrbox",
      x: 20,
      y: 3820,
      width: 350,
      height: 300,
      rotation: 0,
      opacity: 1,
      zIndex: 5,
      locked: false,
      animation: { entrance: "fadeIn", loop: "none" },
      props: {
        groomName: "TUAN MINH",
        groomBank: "MB BANK",
        groomAccount: "12345678",
        brideName: "MAI TRANG",
        brideBank: "VIETCOMBANK",
        brideAccount: "87654321",
      },
    },

    // ── Envelope Widget ──
    {
      id: "plugin-envelope",
      type: "envelope",
      x: 0,
      y: 0,
      width: 390,
      height: 300,
      rotation: 0,
      opacity: 1,
      zIndex: 10,
      locked: false,
      animation: { entrance: "fadeIn", loop: "none" },
      props: {
        flapImage: "",
        backdropOpacity: 0.8,
        preventScrollUntilOpen: true,
      },
    },

    // ── Thank You + Footer ──
    txt("txt-thankyou-title", 20, 4140, 350, 50, "Thankyou!", {
      size: 46,
      font: retro,
      color: olive,
    }),
    txt(
      "txt-thankyou-body",
      30,
      4200,
      330,
      90,
      "Cảm ơn Bạn đã dành thời gian cho thiệp mời! Sự hiện diện của Bạn chính là món quà ý nghĩa nhất, khiến ngày vui thêm phần trọn vẹn.",
      { size: 14, font: quick, color: dark, lineHeight: 1.8, align: "center" },
    ),

    img("img-wax-seal2", 180, 4310, 30, 30, { src: waxSeal, locked: true }),
    txt("txt-footer", 100, 4350, 190, 20, "designed by lovestory.vn", {
      size: 10,
      font: mont,
      color: dark,
      opacity: 0.4,
    }),
  ];
}

// ═══════════════════════════════════════════════════════════════════
// ALL 75 TEMPLATE UNIQUE PRESETS — Each uses a distinct layout family + unique colors
// ═══════════════════════════════════════════════════════════════════

export const TEMPLATE_UNIQUE_PRESETS: Record<string, TemplateElement[]> = {
  // ── WEDDING Romantic Pink (21) ──
  "thiep-cuoi-42": makeRomanticPreset(
    "#fda4af",
    "#831843",
    "#f472b6",
    "'Great Vibes', cursive",
    "✿ ─── ✿ ─── ✿",
  ),
  "thiep-cuoi-39": makeRomanticPreset(
    "#e8a4b8",
    "#6b2058",
    "#c87fa4",
    "'Playfair Display', serif",
    "~ ♥ ~",
  ),
  "thiep-cuoi-46": makeRomanticPreset(
    "#c4b5fd",
    "#5b21b6",
    "#a78bfa",
    "'Cormorant Garamond', serif",
    "✦ ─── ✦",
  ),
  "thiep-cuoi-38": makeRomanticPreset(
    "#fca5a5",
    "#9f1239",
    "#f87171",
    "'Dancing Script', cursive",
    "❀ ──── ❀",
  ),
  "thiep-cuoi-44": makeRomanticPreset(
    "#fde68a",
    "#92400e",
    "#fbbf24",
    "'Cormorant Garamond', serif",
    "✿ ═══ ✿",
  ),
  "thiep-cuoi-40": makeRomanticPreset(
    "#fca5a5",
    "#831843",
    "#f9a8d4",
    "'Playfair Display', serif",
    "♥ ─── ♥",
  ),
  "thiep-cuoi-16": makeRomanticPreset(
    "#f9a8d4",
    "#831843",
    "#f472b6",
    "'Great Vibes', cursive",
    "❀ ──── ❀",
  ),
  "thiep-cuoi-47": makeRomanticPreset(
    "#fda4af",
    "#9f1239",
    "#fb7185",
    "'Cormorant Garamond', serif",
    "── ✿ ──── ✿ ──",
  ),
  "thiep-cuoi-48": makeRomanticPreset(
    "#fecdd3",
    "#be185d",
    "#fda4af",
    "'Lora', serif",
    "✦ ─────── ✦",
  ),
  "thiep-cuoi-19": makeRomanticPreset(
    "#f9a8d4",
    "#7c3369",
    "#f472b6",
    "'Playfair Display', serif",
    "✿ ════════ ✿",
  ),
  "thiep-cuoi-2": makeRomanticPreset(
    "#fda4af",
    "#831843",
    "#fb7185",
    "'Dancing Script', cursive",
    "❀ ──── ❀",
  ),
  "thiep-cuoi-43": makeRomanticPreset(
    "#fecdd3",
    "#9f1239",
    "#fda4af",
    "'Cormorant Garamond', serif",
    "✿ ─── ✿ ─── ✿",
  ),
  "thiep-cuoi-21": makeRomanticPreset(
    "#f9a8d4",
    "#be185d",
    "#f472b6",
    "'Great Vibes', cursive",
    "✦ ══════ ✦",
  ),
  "thiep-cuoi-14": makeRomanticPreset(
    "#fecdd3",
    "#831843",
    "#f9a8d4",
    "'Playfair Display', serif",
    "─── ♥ ───",
  ),
  "thiep-cuoi-15": makeRomanticPreset(
    "#fde8f3",
    "#9f1239",
    "#fca5e4",
    "'Lora', serif",
    "✿ ─── ✿",
  ),
  "thiep-cuoi-50": makeRomanticPreset(
    "#fda4af",
    "#831843",
    "#fb7185",
    "'Cormorant Garamond', serif",
    "❀ ────── ❀",
  ),
  "thiep-cuoi-24": makeRomanticPreset(
    "#f9a8d4",
    "#7c3369",
    "#e879a7",
    "'Dancing Script', cursive",
    "✿ ═══ ✿",
  ),
  "thiep-cuoi-41": makeRomanticPreset(
    "#fecdd3",
    "#be185d",
    "#fda4af",
    "'Great Vibes', cursive",
    "✿ ─── ✿ ─── ✿",
  ),
  "thiep-cuoi-37": makeRomanticPreset(
    "#fda4af",
    "#9f1239",
    "#fb7185",
    "'Playfair Display', serif",
    "✦ ── ✦ ── ✦",
  ),
  "thiep-cuoi-35": makeRomanticPreset(
    "#fde8f3",
    "#831843",
    "#f9a8d4",
    "'Lora', serif",
    "✿ ═══ ✿",
  ),
  "thiep-cuoi-55": makeRomanticPreset(
    "#fecdd3",
    "#9f1239",
    "#fda4af",
    "'Cormorant Garamond', serif",
    "❀ ─── ❀",
  ),

  // ── WEDDING Luxury Dark (10) ──
  "thiep-cuoi-36": makeLuxuryPreset("#c9a84c", "#fef3c7", "─── ✦ ───"),
  "thiep-cuoi-53": makeCineLove53(),
  "thiep-cuoi-56": makeLuxuryPreset("#c9a84c", "#fef9e7", "✦ ═══════ ✦"),
  "thiep-cuoi-52": makeLuxuryPreset("#d4af37", "#fff8e1", "─── ✦ ───"),
  "thiep-cuoi-49": makeLuxuryPreset("#b8860b", "#fef3c7", "✦ ─────── ✦"),
  "thiep-cuoi-57": makeLuxuryPreset("#d4a574", "#faf3e0", "✦ ─────── ✦"),
  "thiep-cuoi-54": makeLuxuryPreset("#c9a84c", "#fef3c7", "─── ✦ ───"),
  "thiep-cuoi-60": makeLuxuryPreset("#e5c678", "#fffbeb", "✦ ────── ✦"),
  "thiep-cuoi-34": makeLuxuryPreset("#d4a574", "#fef3c7", "─ ✦ ─ ✦ ─"),
  "thiep-cuoi-33": makeLuxuryPreset("#c9a84c", "#fff8e1", "✦ ─────── ✦"),

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

  // ── WEDDING Traditional Red/Gold (12) ──
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
  "thiep-cuoi-tone-xanh": makeNaturePreset("#86efac", "#14532d", "#22c55e"),
  "thiep-cuoi-25": makeNaturePreset("#bbf7d0", "#14532d", "#86efac"),

  // ── Modern B&W (1) ──
  "thiep-bw-1": makeModernPreset("#18181b", "#52525b", "#71717a"),

  // ── BIRTHDAY (6) — uses Nature layout (bright, organic) ──
  "thiep-sinh-nhat-01": makeNaturePreset("#fda4af", "#be185d", "#f472b6"),
  "thiep-sinh-nhat-06": makeNaturePreset("#c4b5fd", "#5b21b6", "#a78bfa"),
  "thiep-sinh-nhat-05": makeNaturePreset("#fde68a", "#92400e", "#fbbf24"),
  "thiep-sinh-nhat-02": makeNaturePreset("#fca5a5", "#9f1239", "#f87171"),
  "thiep-sinh-nhat-04": makeNaturePreset("#bfdbfe", "#1e40af", "#93c5fd"),
  "thiep-sinh-nhat-03": makeNaturePreset("#fde68a", "#78350f", "#fbbf24"),

  // ── GRADUATION (3) — uses Modern layout ──
  "thiep-tot-nghiep-1": makeModernPreset("#1e3a5f", "#2d5a8e", "#bfdbfe"),
  "thiep-tot-nghiep-3": makeModernPreset("#1a1a2e", "#374151", "#c7d2fe"),
  "thiep-tot-nghiep-2": makeModernPreset("#14532d", "#166534", "#bbf7d0"),

  // ── EVENTS ──
  "thiep-ky-yeu-mau1": makeModernPreset("#1e3a5f", "#374151", "#bfdbfe"),
  "thiep-ky-yeu-mau2": makeClassicPreset("#312e81", "#4338ca", "#c7d2fe"),
  "thiep-tan-gia-1": makeTraditionalPreset("#dc2626", "#7f1d1d", "#fbbf24"),
  "thiep-tan-gia-2": makeNaturePreset("#fde68a", "#92400e", "#fbbf24"),
  "thiep-valentine-1": makeRomanticPreset(
    "#fda4af",
    "#be185d",
    "#f472b6",
    "'Great Vibes', cursive",
    "♥ ────── ♥",
  ),
  "tiec-tat-nien-3": makeLuxuryPreset("#d4a574", "#fef3c7", "✦ ───── ✦"),
  "thiep-tat-nien-4": makeLuxuryPreset("#c9a84c", "#fef3c7", "✦ ══════ ✦"),
  "tiec-tat-nien-1": makeLuxuryPreset("#b8860b", "#fef9e7", "✦ ────── ✦"),

  // ── DEMO ELEGANT — CineLove 36 clone ──
  "demo-elegant": [
    txt(
      "txt-quote",
      30,
      40,
      360,
      80,
      "I love three things in this world.\nSun, moon and you.\nSun for morning, moon for night,\nand you forever.",
      {
        size: 14,
        font: "'Cormorant Garamond', Georgia, serif",
        color: "#8b7e6a",
        italic: true,
        opacity: 0.55,
        lineHeight: 1.7,
      },
    ),
    img("img-hero-left", 0, 160, 207, 530, {
      radius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&h=700&fit=crop&crop=faces",
    }),
    img("img-hero-right", 213, 160, 207, 530, {
      radius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=700&fit=crop&crop=faces",
    }),
    txt("txt-bride", 20, 740, 380, 50, "Mai Anh", {
      size: 42,
      font: "'Great Vibes', 'Dancing Script', cursive",
      color: "#2c2417",
      lineHeight: 1.2,
    }),
    txt("txt-amp", 20, 800, 380, 40, "&", {
      size: 36,
      font: "'Great Vibes', 'Dancing Script', cursive",
      color: "#8b7e6a",
      italic: true,
      opacity: 0.5,
      lineHeight: 1.2,
    }),
    txt("txt-groom", 20, 850, 380, 50, "Minh Quân", {
      size: 42,
      font: "'Great Vibes', 'Dancing Script', cursive",
      color: "#2c2417",
      lineHeight: 1.2,
    }),
    txt(
      "txt-poem1",
      30,
      960,
      360,
      100,
      "Đời dài muôn mảnh bình yên\nEm mang lãng mạn dịu hiền bước qua.\nSáng ngời dáng ngọc ngọc ngà\nCùng anh sánh bước chan hòa trọn đời.",
      {
        size: 18,
        font: "'Dancing Script', 'Great Vibes', cursive",
        color: "#5c4f3d",
        opacity: 0.85,
        lineHeight: 1.8,
      },
    ),
    img("img-photo1", 0, 1150, 420, 320, {
      radius: 8,
      borderWidth: 0,
      borderColor: "transparent",
      src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&fit=crop",
    }),
    txt(
      "txt-invite",
      30,
      1780,
      360,
      100,
      "Mời bạn tới dự lễ thành hôn\ncủa chúng mình\nĐể cùng chứng kiến khoảnh khắc\nthiêng liêng nhất",
      {
        size: 18,
        font: "'Dancing Script', 'Great Vibes', cursive",
        color: "#5c4f3d",
        lineHeight: 1.7,
      },
    ),
    txt("txt-day", 60, 2020, 300, 80, "15", {
      size: 72,
      font: "'Playfair Display', Georgia, serif",
      color: "#2c2417",
      weight: "bold",
      lineHeight: 1,
    }),
    txt("txt-weekday", 60, 2105, 300, 25, "Chủ Nhật", {
      size: 15,
      font: "'Cormorant Garamond', Georgia, serif",
      color: "#8b7e6a",
      opacity: 0.6,
      lineHeight: 1.2,
    }),
    txt("txt-time", 60, 2140, 140, 20, "10:00 AM", {
      size: 13,
      font: "'Cormorant Garamond', Georgia, serif",
      color: "#8b7e6a",
      opacity: 0.7,
    }),
    txt("txt-month", 160, 2140, 100, 20, "Tháng 6", {
      size: 13,
      font: "'Cormorant Garamond', Georgia, serif",
      color: "#8b7e6a",
      opacity: 0.7,
    }),
    txt("txt-year", 260, 2140, 100, 20, "2026", {
      size: 13,
      font: "'Cormorant Garamond', Georgia, serif",
      color: "#8b7e6a",
      opacity: 0.7,
    }),
    txt("txt-addr-label", 20, 2320, 380, 25, "A D D R E S S", {
      size: 12,
      font: "'Cormorant Garamond', Georgia, serif",
      color: "#8b7e6a",
      opacity: 0.5,
    }),
    txt("txt-venue", 20, 2350, 380, 30, "Trung tâm Tiệc cưới Cinelove", {
      size: 20,
      font: "'Playfair Display', Georgia, serif",
      color: "#2c2417",
      weight: "600",
    }),
    img("img-photo2", 0, 2460, 420, 560, {
      radius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&fit=crop",
    }),
    txt(
      "txt-en-quote",
      40,
      3120,
      340,
      70,
      "LOVE AND FREEDOM\nYOU AND\nGENTLENESS",
      {
        size: 20,
        font: "'Cormorant Garamond', Georgia, serif",
        color: "#8b7e6a",
        opacity: 0.5,
        lineHeight: 1.5,
      },
    ),
    txt(
      "txt-poem2",
      30,
      3280,
      360,
      60,
      "Đời này quý giá vô ngần\nCó anh chung bước, muôn phần đẹp tươi.",
      {
        size: 18,
        font: "'Dancing Script', 'Great Vibes', cursive",
        color: "#5c4f3d",
        opacity: 0.85,
        lineHeight: 1.8,
      },
    ),
    img("img-photo3", 0, 3450, 420, 560, {
      radius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      src: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&fit=crop",
    }),
    txt(
      "txt-detail",
      30,
      4930,
      360,
      140,
      "Xin vui lòng xác nhận trước với chúng mình\nsố lượng người tham dự để tiện sắp xếp chỗ ngồi.\n\nNếu có việc bận đột xuất không thể đến được,\nmong bạn báo trước.\n\nHẹn gặp bạn tại đám cưới nhé~",
      {
        size: 14,
        font: "'Cormorant Garamond', Georgia, serif",
        color: "#5c4f3d",
        opacity: 0.85,
        lineHeight: 1.7,
      },
    ),
    img("img-photo4", 0, 5200, 420, 560, {
      radius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&fit=crop",
    }),
    txt(
      "txt-closing",
      30,
      6720,
      360,
      100,
      "Non sông một chặng đường dài\nBa sinh hữu hạnh, duyên này thành đôi.\nTiệc vui ngắn ngủi mà thôi\nNếu điều sơ suất, mong người lượng thương.",
      {
        size: 18,
        font: "'Dancing Script', 'Great Vibes', cursive",
        color: "#5c4f3d",
        opacity: 0.85,
        lineHeight: 1.8,
      },
    ),
    txt("txt-thankyou", 20, 7200, 380, 50, "THANK YOU", {
      size: 36,
      font: "'Great Vibes', 'Dancing Script', cursive",
      color: "#8b7e6a",
      opacity: 0.5,
      lineHeight: 1.2,
    }),
  ],
};
