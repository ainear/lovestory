export interface MusicWidgetStyle {
  id: string;
  label: string;
  emoji: string;
}

/* ── Music widget style options ── */
export const MUSIC_WIDGET_STYLES: MusicWidgetStyle[] = [
  { id: "vinyl", label: "Đĩa than", emoji: "💿" },
  { id: "notes", label: "Nốt nhạc", emoji: "🎵" },
  { id: "wave", label: "Sóng âm", emoji: "🌊" },
  { id: "minimal", label: "Tối giản", emoji: "▶️" },
];
