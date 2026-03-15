export interface ParticlePreset {
  id: string;
  label: string;
  emoji: string;
}

/* ── Particle effect presets (CineLove parity: 7 effects) ── */
export const PARTICLE_PRESETS: ParticlePreset[] = [
  { id: "none", label: "Không hiệu ứng", emoji: "🚫" },
  { id: "hearts", label: "Trái tim", emoji: "❤️" },
  { id: "flowers", label: "Hoa anh đào", emoji: "🌸" },
  { id: "snow", label: "Tuyết rơi", emoji: "❄️" },
  { id: "stars", label: "Ngôi sao", emoji: "⭐" },
  { id: "confetti", label: "Confetti", emoji: "🎉" },
  { id: "butterflies", label: "Bướm", emoji: "🦋" },
  { id: "mixed", label: "Hỗn hợp", emoji: "✨" },
];
