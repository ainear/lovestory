export interface GradientPreset {
  label: string;
  value: string;
}

/* ── Gradient presets (CineLove parity) ── */
export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    label: "Hồng → Tím",
    value: "linear-gradient(135deg, #fce4ec 0%, #e1bee7 100%)",
  },
  {
    label: "Vàng → Cam",
    value: "linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%)",
  },
  {
    label: "Xanh → Tím",
    value: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
  },
  {
    label: "Cam → Hồng",
    value: "linear-gradient(135deg, #fff3e0 0%, #fce4ec 50%, #f3e5f5 100%)",
  },
  {
    label: "Xanh lá → Vàng",
    value: "linear-gradient(135deg, #e8f5e9 0%, #fffde7 100%)",
  },
  {
    label: "Tím → Xanh",
    value: "linear-gradient(135deg, #ede7f6 0%, #e3f2fd 100%)",
  },
  {
    label: "Hoàng hôn",
    value: "linear-gradient(180deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)",
  },
  {
    label: "Bình minh",
    value: "linear-gradient(180deg, #fdfcfb 0%, #e2d1c3 100%)",
  },
  {
    label: "Đêm sao",
    value: "radial-gradient(ellipse at top, #1b2735 0%, #090a0f 100%)",
  },
  {
    label: "Vàng ánh kim",
    value: "linear-gradient(135deg, #f5f0e0 0%, #d4a574 50%, #f5f0e0 100%)",
  },
  {
    label: "Navy sang trọng",
    value: "linear-gradient(180deg, #1a2744 0%, #16213e 50%, #0f3460 100%)",
  },
  {
    label: "Hồng pastel",
    value:
      "radial-gradient(ellipse at center, #ffeef8 0%, #fce4ec 50%, #f8bbd9 100%)",
  },
];
