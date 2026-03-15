export interface TextPreset {
  label: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
}

/* ── Text presets ── */
export const TEXT_PRESETS: TextPreset[] = [
  {
    label: "Tiêu đề chính",
    fontSize: 32,
    fontFamily: "'Dancing Script', cursive",
    fontWeight: "bold",
    fontStyle: "normal",
  },
  {
    label: "Tiêu đề phụ",
    fontSize: 18,
    fontFamily: "'Playfair Display', serif",
    fontWeight: "normal",
    fontStyle: "italic",
  },
  {
    label: "Ngày tháng",
    fontSize: 22,
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: "bold",
    fontStyle: "normal",
  },
  {
    label: "Địa điểm",
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Ghi chú",
    fontSize: 13,
    fontFamily: "'Lora', serif",
    fontWeight: "normal",
    fontStyle: "italic",
  },
  // CineLove-style wedding fonts
  {
    label: "Sacramento",
    fontSize: 28,
    fontFamily: "'Sacramento', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Alex Brush",
    fontSize: 28,
    fontFamily: "'Alex Brush', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Satisfy",
    fontSize: 24,
    fontFamily: "'Satisfy', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Allura",
    fontSize: 28,
    fontFamily: "'Allura', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Pinyon Script",
    fontSize: 28,
    fontFamily: "'Pinyon Script', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Cinzel Decorative",
    fontSize: 18,
    fontFamily: "'Cinzel Decorative', serif",
    fontWeight: "normal",
    fontStyle: "normal",
  },
];
