export interface CurtainPreset {
  id: string;
  label: string;
  emoji: string;
  desc: string;
}

/* ── Curtain / opening presets ── */
export const CURTAIN_PRESETS: CurtainPreset[] = [
  {
    id: "none",
    label: "Không hiệu ứng",
    emoji: "🚫",
    desc: "Thiệp hiển thị ngay",
  },
  {
    id: "envelope",
    label: "Phong bì thư",
    emoji: "💌",
    desc: "Mở phong bì để xem thiệp",
  },
  { id: "curtain", label: "Rèm cửa", emoji: "🎭", desc: "Rèm kéo sang 2 bên" },
  { id: "fadeReveal", label: "Fade lên", emoji: "🌅", desc: "Từ tối sáng dần" },
];
