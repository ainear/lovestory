export interface GradientPreset {
  label: string;
  value: string;
}

/* ── Gradient presets — CineLove parity (premium Vietnamese wedding palettes) ── */
export const GRADIENT_PRESETS: GradientPreset[] = [
  // ── Romantic Pink family ──
  {
    label: "Hồng pastel",
    value: "radial-gradient(ellipse at top, #ffeef8 0%, #fce4ec 55%, #f8bbd9 100%)",
  },
  {
    label: "Hồng → Tím",
    value: "linear-gradient(180deg, #fdf6f8 0%, #fce4ec 50%, #f3e5f5 100%)",
  },
  {
    label: "Đào → Hồng",
    value: "linear-gradient(180deg, #fff5f0 0%, #ffd6cc 40%, #ffb3ba 100%)",
  },
  {
    label: "Kem hồng",
    value: "linear-gradient(180deg, #fdf6f0 0%, #fce8e8 50%, #fdf6f0 100%)",
  },
  {
    label: "Hoa anh đào",
    value: "linear-gradient(135deg, #fff0f6 0%, #ffd6e8 40%, #ffb3d1 70%, #ff85b4 100%)",
  },

  // ── Luxury Gold family ──
  {
    label: "Vàng ánh kim",
    value: "linear-gradient(135deg, #f5f0e0 0%, #d4a574 50%, #f5f0e0 100%)",
  },
  {
    label: "Vàng → Cam",
    value: "linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%)",
  },
  {
    label: "Gold sang trọng",
    value: "linear-gradient(180deg, #fdfaf0 0%, #e8d5a3 40%, #c9a84c 70%, #a07840 100%)",
  },

  // ── Dark Luxury family ──
  {
    label: "Đêm sao",
    value: "radial-gradient(ellipse at top, #1b2735 0%, #090a0f 100%)",
  },
  {
    label: "Navy sang trọng",
    value: "linear-gradient(180deg, #1a2744 0%, #16213e 50%, #0f3460 100%)",
  },
  {
    label: "Đen nhung",
    value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0d0d1a 100%)",
  },

  // ── Cool family ──
  {
    label: "Xanh → Tím",
    value: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
  },
  {
    label: "Tím → Xanh",
    value: "linear-gradient(135deg, #ede7f6 0%, #e3f2fd 100%)",
  },
  {
    label: "Xanh lá → Vàng",
    value: "linear-gradient(135deg, #e8f5e9 0%, #fffde7 100%)",
  },

  // ── Atmosphere family ──
  {
    label: "Hoàng hôn",
    value: "linear-gradient(180deg, #ffecd2 0%, #fcb69f 40%, #ff9a9e 75%, #fad0c4 100%)",
  },
  {
    label: "Bình minh",
    value: "linear-gradient(180deg, #fdfcfb 0%, #f5efe6 40%, #e2d1c3 100%)",
  },
  {
    label: "Trăng rằm",
    value: "radial-gradient(ellipse at center, #f9f0ff 0%, #e8d5f5 50%, #d1aae8 100%)",
  },
  {
    label: "Cam → Hồng",
    value: "linear-gradient(135deg, #fff3e0 0%, #fce4ec 50%, #f3e5f5 100%)",
  },
];
