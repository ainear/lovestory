export interface BgPreset {
  label: string;
  value: string;
}

/* ── Background presets — Solid colors ── */
export const BG_PRESETS: BgPreset[] = [
  {
    label: "Hoa hồng",
    value: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
  },
  {
    label: "Đêm tím",
    value: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)",
  },
  {
    label: "Vàng hoàng hôn",
    value: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)",
  },
  {
    label: "Anh đào",
    value: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)",
  },
  { label: "Trắng tinh", value: "#ffffff" },
  {
    label: "Đen sang trọng",
    value: "linear-gradient(180deg, #111827 0%, #1f2937 100%)",
  },
];
