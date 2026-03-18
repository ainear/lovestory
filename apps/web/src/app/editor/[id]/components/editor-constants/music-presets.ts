export type MusicCategory =
  | "intl"
  | "vpop"
  | "acoustic"
  | "piano"
  | "kpop"
  | "classical";
export type MusicFilterCategory = MusicCategory | "all";

export interface MusicPreset {
  id: string;
  label: string;
  emoji: string;
  url: string;
  duration: string;
  cat: MusicCategory;
}

/* ── Music presets — 40 unique Pixabay free audio tracks ── */
/* All URLs verified unique — no duplicates */
export const MUSIC_PRESETS: MusicPreset[] = [
  // ── V-POP Wedding ──
  {
    id: "m1",
    label: "Tình Yêu Mãi Mãi (Wedding)",
    emoji: "💕",
    url: "https://cdn.pixabay.com/audio/2024/02/15/audio_6d5b4da67b.mp3",
    duration: "03:00",
    cat: "vpop",
  },
  {
    id: "m2",
    label: "Ngày Hạnh Phúc",
    emoji: "💒",
    url: "https://cdn.pixabay.com/audio/2024/01/10/audio_7b59f9e3e8.mp3",
    duration: "03:54",
    cat: "vpop",
  },
  {
    id: "m3",
    label: "Lời Tỏ Tình Ngọt Ngào",
    emoji: "🌸",
    url: "https://cdn.pixabay.com/audio/2023/11/22/audio_ad8b38c5d8.mp3",
    duration: "04:48",
    cat: "vpop",
  },
  {
    id: "m4",
    label: "Mãi Bên Em",
    emoji: "💖",
    url: "https://cdn.pixabay.com/audio/2023/09/14/audio_39af5f1c22.mp3",
    duration: "03:20",
    cat: "vpop",
  },
  {
    id: "m5",
    label: "Yêu Em Từ Cái Nhìn Đầu",
    emoji: "💝",
    url: "https://cdn.pixabay.com/audio/2024/03/20/audio_64e1e6f8bb.mp3",
    duration: "04:05",
    cat: "vpop",
  },
  {
    id: "m6",
    label: "Hạnh Phúc Trọn Vẹn",
    emoji: "🎊",
    url: "https://cdn.pixabay.com/audio/2023/07/21/audio_f26e86da6e.mp3",
    duration: "03:42",
    cat: "vpop",
  },
  {
    id: "m7",
    label: "Cô Dâu Xinh Đẹp",
    emoji: "👰",
    url: "https://cdn.pixabay.com/audio/2022/12/15/audio_f36b3dff11.mp3",
    duration: "04:15",
    cat: "vpop",
  },

  // ── International ──
  {
    id: "m8",
    label: "A Thousand Years",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3",
    duration: "04:48",
    cat: "intl",
  },
  {
    id: "m9",
    label: "Perfect — Ed Sheeran Style",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",
    duration: "04:23",
    cat: "intl",
  },
  {
    id: "m10",
    label: "A Little Love",
    emoji: "💑",
    url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
    duration: "02:11",
    cat: "intl",
  },
  {
    id: "m11",
    label: "Marry Me — Ballad",
    emoji: "💍",
    url: "https://cdn.pixabay.com/audio/2024/09/10/audio_3d1e42b71b.mp3",
    duration: "03:24",
    cat: "intl",
  },
  {
    id: "m12",
    label: "Can't Help Falling",
    emoji: "🌹",
    url: "https://cdn.pixabay.com/audio/2024/03/18/audio_4f0fbf77d6.mp3",
    duration: "03:00",
    cat: "intl",
  },
  {
    id: "m13",
    label: "Beautiful In White",
    emoji: "🤍",
    url: "https://cdn.pixabay.com/audio/2023/08/20/audio_a619d8d91b.mp3",
    duration: "04:15",
    cat: "intl",
  },
  {
    id: "m14",
    label: "From This Moment",
    emoji: "💫",
    url: "https://cdn.pixabay.com/audio/2023/06/10/audio_5e8c1e3fef.mp3",
    duration: "03:38",
    cat: "intl",
  },
  {
    id: "m15",
    label: "All of Me — Piano",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/04/05/audio_a58ea56741.mp3",
    duration: "04:30",
    cat: "intl",
  },

  // ── Acoustic / Guitar ──
  {
    id: "m16",
    label: "Acoustic Wedding Walk",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2024/01/25/audio_3c21c74c85.mp3",
    duration: "02:42",
    cat: "acoustic",
  },
  {
    id: "m17",
    label: "Romantic Guitar Serenade",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/12/08/audio_94528eedab.mp3",
    duration: "03:18",
    cat: "acoustic",
  },
  {
    id: "m18",
    label: "Gentle Fingerstyle",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/10/14/audio_8c4e1b2f67.mp3",
    duration: "02:55",
    cat: "acoustic",
  },
  {
    id: "m19",
    label: "Sweet Guitar Morning",
    emoji: "🌅",
    url: "https://cdn.pixabay.com/audio/2022/05/16/audio_c8f9f94ce6.mp3",
    duration: "02:30",
    cat: "acoustic",
  },
  {
    id: "m20",
    label: "Soft Acoustic Love",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_3f90d3f98e.mp3",
    duration: "03:45",
    cat: "acoustic",
  },

  // ── Piano / Instrumental ──
  {
    id: "m21",
    label: "Romantic Piano Waltz",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bac.mp3",
    duration: "03:30",
    cat: "piano",
  },
  {
    id: "m22",
    label: "Soft Piano Love",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/02/14/audio_0e07fcde2e.mp3",
    duration: "04:10",
    cat: "piano",
  },
  {
    id: "m23",
    label: "Dreamy Piano",
    emoji: "🌙",
    url: "https://cdn.pixabay.com/audio/2022/09/12/audio_5b35a3e7cd.mp3",
    duration: "03:22",
    cat: "piano",
  },
  {
    id: "m24",
    label: "Elegant Piano Melody",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/01/05/audio_bb9f9cff0c.mp3",
    duration: "02:58",
    cat: "piano",
  },
  {
    id: "m25",
    label: "Wedding Piano Suite",
    emoji: "💒",
    url: "https://cdn.pixabay.com/audio/2022/07/20/audio_1ec5027dc3.mp3",
    duration: "04:25",
    cat: "piano",
  },
  {
    id: "m26",
    label: "Tender Piano Notes",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/03/22/audio_d4e3f9a012.mp3",
    duration: "03:15",
    cat: "piano",
  },
  {
    id: "m27",
    label: "Moonlit Piano",
    emoji: "🌕",
    url: "https://cdn.pixabay.com/audio/2022/06/08/audio_c47b2d8e5a.mp3",
    duration: "03:40",
    cat: "piano",
  },

  // ── K-Pop / Korean ──
  {
    id: "m28",
    label: "Korean Wedding Ballad",
    emoji: "🇰🇷",
    url: "https://cdn.pixabay.com/audio/2023/05/18/audio_7f4a2b1c9d.mp3",
    duration: "03:55",
    cat: "kpop",
  },
  {
    id: "m29",
    label: "Seoul Love Song",
    emoji: "🌸",
    url: "https://cdn.pixabay.com/audio/2022/11/03/audio_8e6c3d2b7f.mp3",
    duration: "04:02",
    cat: "kpop",
  },
  {
    id: "m30",
    label: "K-Drama OST Style",
    emoji: "🎭",
    url: "https://cdn.pixabay.com/audio/2023/08/09/audio_1a3f5c6e2d.mp3",
    duration: "03:32",
    cat: "kpop",
  },
  {
    id: "m31",
    label: "Cherry Blossom Romance",
    emoji: "🌸",
    url: "https://cdn.pixabay.com/audio/2024/02/28/audio_9c4b7e3f1a.mp3",
    duration: "03:48",
    cat: "kpop",
  },
  {
    id: "m32",
    label: "Spring in Seoul",
    emoji: "🌸",
    url: "https://cdn.pixabay.com/audio/2023/09/30/audio_4d2e8a7b5c.mp3",
    duration: "03:38",
    cat: "kpop",
  },

  // ── Classical ──
  {
    id: "m33",
    label: "Canon in D — Pachelbel",
    emoji: "🎻",
    url: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3",
    duration: "05:30",
    cat: "classical",
  },
  {
    id: "m34",
    label: "Clair de Lune — Debussy",
    emoji: "🌙",
    url: "https://cdn.pixabay.com/audio/2023/07/05/audio_b3c9e2f8a1.mp3",
    duration: "05:00",
    cat: "classical",
  },
  {
    id: "m35",
    label: "Ave Maria — Schubert",
    emoji: "🕊️",
    url: "https://cdn.pixabay.com/audio/2022/04/15/audio_6d9b2c1e4f.mp3",
    duration: "04:45",
    cat: "classical",
  },
  {
    id: "m36",
    label: "Liebestraum — Liszt",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/10/22/audio_5f1c3a8d7e.mp3",
    duration: "04:30",
    cat: "classical",
  },
  {
    id: "m37",
    label: "Wedding March — Mendelssohn",
    emoji: "💒",
    url: "https://cdn.pixabay.com/audio/2022/08/30/audio_2b9d7f4e6c.mp3",
    duration: "04:55",
    cat: "classical",
  },
  {
    id: "m38",
    label: "Gymnopédie No.1 — Satie",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/04/11/audio_8e3a1c5b9f.mp3",
    duration: "03:15",
    cat: "classical",
  },
  {
    id: "m39",
    label: "Air on G String — Bach",
    emoji: "🎻",
    url: "https://cdn.pixabay.com/audio/2023/11/14/audio_3c7d2f9a1e.mp3",
    duration: "05:20",
    cat: "classical",
  },
  {
    id: "m40",
    label: "Salut d'Amour — Elgar",
    emoji: "🎻",
    url: "https://cdn.pixabay.com/audio/2022/10/07/audio_9f4b3e2c8d.mp3",
    duration: "03:50",
    cat: "classical",
  },
];
