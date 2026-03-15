export interface PageAnimPreset {
  id: string;
  label: string;
  icon: string;
}

/* ── Page animation presets (CineLove parity: 7 effects) ── */
export const PAGE_ANIM_PRESETS: PageAnimPreset[] = [
  { id: "none", label: "None", icon: "🚫" },
  { id: "fadeInAll", label: "Fade In All", icon: "🌫️" },
  { id: "slideUpAll", label: "Slide Up All", icon: "⬆️" },
  { id: "scaleInAll", label: "Scale In All", icon: "🔍" },
  { id: "flipInAll", label: "Flip In All", icon: "🔄" },
  { id: "slideUpMix", label: "Slide Up Mix", icon: "🎭" },
  { id: "fadeInMix", label: "Fade In Mix", icon: "✨" },
];
