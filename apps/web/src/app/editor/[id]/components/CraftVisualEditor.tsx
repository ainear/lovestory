"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useReducer,
} from "react";
import {
  Type,
  Image as ImageIcon,
  Palette,
  Music,
  Sparkles,
  Undo2,
  Redo2,
  Eye,
  Rocket,
  Save,
  LayoutTemplate,
  Grid,
  Home,
  Share2,
  ZoomIn,
  ZoomOut,
  Flower2,
  HelpCircle,
  Pentagon,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
// html2canvas loaded dynamically to avoid large static bundle (PERF-02)
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { CraftText } from "./craft/CraftText";
import { CraftImage } from "./craft/CraftImage";
import { CraftContainer, RootContainer } from "./craft/CraftContainer";
import { CraftCountdown } from "./craft/CraftCountdown";
import { CraftCalendar } from "./craft/CraftCalendar";
import { CraftMap } from "./craft/CraftMap";
import { CraftRSVP } from "./craft/CraftRSVP";
import { CraftCallButton } from "./craft/CraftCallButton";
import { CraftPhotoAlbum } from "./craft/CraftPhotoAlbum";
import { CraftYouTube } from "./craft/CraftYouTube";
import { CraftQRBox } from "./craft/CraftQRBox";
import { CraftGuestName } from "./craft/CraftGuestName";
import { CraftFormBuilder } from "./craft/CraftFormBuilder";
import { CraftEnvelope } from "./craft/CraftEnvelope";
import { CraftSticker } from "./craft/CraftSticker";
import { CraftShape } from "./craft/CraftShape";
import {
  CLIPART_CATEGORIES,
  CLIPART_ITEMS,
} from "@/server/data/clipart-library";
import {
  SECTION_CATEGORIES,
  SECTION_PRESETS,
} from "@/server/data/section-library";
import { createBrowserClient } from "@supabase/ssr";
import {
  CanvasRenderer,
  CanvasContextMenu,
  CanvasRightPanel,
  EditorContext,
  editorReducer,
  initialState,
} from "./canvas-engine";
import type { CanvasElement } from "./canvas-engine/types";

/* ── Tab config (CineLove parity: 10 tabs) ── */
const TABS = [
  { key: "text", icon: <Type size={20} />, label: "Văn bản" },
  { key: "image", icon: <ImageIcon size={20} />, label: "Hình ảnh" },
  { key: "stock", icon: <Flower2 size={20} />, label: "Stock" },
  { key: "shapes", icon: <Pentagon size={20} />, label: "Hình dạng" },
  { key: "bg", icon: <Palette size={20} />, label: "Nền" },
  { key: "music", icon: <Music size={20} />, label: "Âm nhạc" },
  { key: "plugins", icon: <Grid size={20} />, label: "Tiện ích" },
  { key: "templates", icon: <LayoutTemplate size={20} />, label: "Mẫu" },
  { key: "effects", icon: <Sparkles size={20} />, label: "Hiệu ứng" },
  {
    key: "components",
    icon: <Grid size={20} />,
    label: "Thành phần",
  },
];

/* ── Text presets ── */
const TEXT_PRESETS = [
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

/* ── Background presets — Solid colors ── */
const BG_PRESETS = [
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

/* ── Gradient presets (CineLove parity) ── */
const GRADIENT_PRESETS = [
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

/* ── Music widget style options ── */
const MUSIC_WIDGET_STYLES = [
  { id: "vinyl", label: "Đĩa than", emoji: "💿" },
  { id: "notes", label: "Nốt nhạc", emoji: "🎵" },
  { id: "wave", label: "Sóng âm", emoji: "🌊" },
  { id: "minimal", label: "Tối giản", emoji: "▶️" },
];

/* ── Music presets ── */
const MUSIC_PRESETS = [
  {
    id: "m1",
    label: "Bà Này Không Để Đi Diễn",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3",
    duration: "03:00",
    cat: "vpop",
  },
  {
    id: "m2",
    label: "50 Năm Về Sau – đi…",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/03/18/audio_4f0fbf77d6.mp3",
    duration: "03:54",
    cat: "vpop",
  },
  {
    id: "m3",
    label: "50 Năm Về Sau (ma…",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",
    duration: "04:48",
    cat: "vpop",
  },
  {
    id: "m4",
    label: "A Little Love",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
    duration: "02:11",
    cat: "intl",
  },
  {
    id: "m5",
    label: "A Thousand Years",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3",
    duration: "04:48",
    cat: "intl",
  },
  {
    id: "m6",
    label: "Alex Warren – Ordin…",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/09/10/audio_3d1e42b71b.mp3",
    duration: "03:08",
    cat: "intl",
  },
  {
    id: "m7",
    label: "All of Me",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3",
    duration: "04:30",
    cat: "intl",
  },
  {
    id: "m8",
    label: "Aloha – 이기타리스…",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/03/18/audio_4f0fbf77d6.mp3",
    duration: "02:50",
    cat: "intl",
  },
  {
    id: "m9",
    label: "Always",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",
    duration: "03:26",
    cat: "intl",
  },
  {
    id: "m10",
    label: "Beautiful In White",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
    duration: "04:15",
    cat: "intl",
  },
  {
    id: "m11",
    label: "Canon in D – Pachelbel",
    emoji: "🎻",
    url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3",
    duration: "05:30",
    cat: "intl",
  },
  {
    id: "m12",
    label: "Can't Help Falling",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/09/10/audio_3d1e42b71b.mp3",
    duration: "03:00",
    cat: "intl",
  },
  {
    id: "m13",
    label: "Cưới Nhau Đi (Yes I Do)",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3",
    duration: "04:20",
    cat: "vpop",
  },
  {
    id: "m14",
    label: "Đi Về Nhà",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/03/18/audio_4f0fbf77d6.mp3",
    duration: "03:45",
    cat: "vpop",
  },
  {
    id: "m15",
    label: "Perfect – Ed Sheeran",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",
    duration: "04:23",
    cat: "intl",
  },
  {
    id: "m16",
    label: "Marry Me – Train",
    emoji: "💍",
    url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
    duration: "03:24",
    cat: "intl",
  },
  {
    id: "m17",
    label: "From This Moment",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3",
    duration: "03:38",
    cat: "intl",
  },
  {
    id: "m18",
    label: "Here Comes The Sun",
    emoji: "☀️",
    url: "https://cdn.pixabay.com/audio/2024/09/10/audio_3d1e42b71b.mp3",
    duration: "03:05",
    cat: "intl",
  },
  {
    id: "m19",
    label: "Thinking Out Loud",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/11/29/audio_a0fdb1c963.mp3",
    duration: "04:41",
    cat: "intl",
  },
  {
    id: "m20",
    label: "Nơi Này Có Anh",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/03/18/audio_4f0fbf77d6.mp3",
    duration: "04:15",
    cat: "vpop",
  },
  {
    id: "m21",
    label: "Ngày Chung Đôi",
    emoji: "💒",
    url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",
    duration: "03:52",
    cat: "vpop",
  },
  {
    id: "m22",
    label: "Chỉ Cần Em Hạnh Phúc",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
    duration: "04:10",
    cat: "vpop",
  },
  {
    id: "m23",
    label: "Yêu Là Cưới",
    emoji: "💒",
    url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3",
    duration: "03:30",
    cat: "vpop",
  },
  {
    id: "m24",
    label: "Anh Thấy Cô Gái Kia Chưa",
    emoji: "🎵",
    url: "https://cdn.pixabay.com/audio/2024/09/10/audio_3d1e42b71b.mp3",
    duration: "03:42",
    cat: "vpop",
  },
];

/* ── CineLove-style Accordion Section component ── */
function AccordionSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#9ca3af",
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▶
        </span>
        <span>{icon}</span>
        <span>{title}</span>
      </button>
      {open && <div style={{ padding: "0 0 12px 20px" }}>{children}</div>}
    </div>
  );
}

/* ── Particle effect presets (CineLove parity: 7 effects) ── */
const PARTICLE_PRESETS = [
  { id: "none", label: "Không hiệu ứng", emoji: "🚫" },
  { id: "hearts", label: "Trái tim", emoji: "❤️" },
  { id: "flowers", label: "Hoa anh đào", emoji: "🌸" },
  { id: "snow", label: "Tuyết rơi", emoji: "❄️" },
  { id: "stars", label: "Ngôi sao", emoji: "⭐" },
  { id: "confetti", label: "Confetti", emoji: "🎉" },
  { id: "butterflies", label: "Bướm", emoji: "🦋" },
  { id: "mixed", label: "Hỗn hợp", emoji: "✨" },
];

/* ── Page animation presets (CineLove parity: 7 effects) ── */
const PAGE_ANIM_PRESETS = [
  { id: "none", label: "None", icon: "🚫" },
  { id: "fadeInAll", label: "Fade In All", icon: "🌫️" },
  { id: "slideUpAll", label: "Slide Up All", icon: "⬆️" },
  { id: "scaleInAll", label: "Scale In All", icon: "🔍" },
  { id: "flipInAll", label: "Flip In All", icon: "🔄" },
  { id: "slideUpMix", label: "Slide Up Mix", icon: "🎭" },
  { id: "fadeInMix", label: "Fade In Mix", icon: "✨" },
];

/* ── Curtain / opening presets ── */
const CURTAIN_PRESETS = [
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

/* ── Stock image library ── */
const STOCK_IMAGES: { url: string; thumb: string; label: string }[] = [
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=120",
    label: "Hoa cưới",
  },
  {
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
    thumb: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=120",
    label: "Nhẫn cưới",
  },
  {
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
    thumb: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=120",
    label: "Hoa hồng",
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    label: "Bàn tiệc",
  },
  {
    url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600",
    thumb: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=120",
    label: "Cô dâu",
  },
  {
    url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600",
    thumb: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=120",
    label: "Nến",
  },
  {
    url: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=600",
    thumb: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=120",
    label: "Bánh cưới",
  },
  {
    url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600",
    thumb: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=120",
    label: "Lễ cưới",
  },
  {
    url: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600",
    thumb: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=120",
    label: "Hoa lá",
  },
  {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
    thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=120",
    label: "Confetti",
  },
  {
    url: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600",
    thumb: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=120",
    label: "Đôi tay",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600",
    thumb: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=120",
    label: "Cổng hoa",
  },
];

/* ── Template style presets ── */
const TEMPLATE_STYLES: {
  name: string;
  bg: string;
  textColor: string;
  font: string;
  desc: string;
  tier: "FREE" | "BASIC" | "PREMIUM";
  views: number;
  uses: number;
}[] = [
  {
    name: "Hoa hồng",
    bg: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
    textColor: "#831843",
    font: "'Dancing Script', cursive",
    desc: "Lãng mạn, nhẹ nhàng",
    tier: "FREE",
    views: 4182,
    uses: 312,
  },
  {
    name: "Đêm tím",
    bg: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)",
    textColor: "#e9d5ff",
    font: "'Cormorant Garamond', serif",
    desc: "Sang trọng, huyền bí",
    tier: "BASIC",
    views: 3113,
    uses: 245,
  },
  {
    name: "Hoàng hôn",
    bg: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)",
    textColor: "#92400e",
    font: "'Playfair Display', serif",
    desc: "Ấm áp, rực rỡ",
    tier: "BASIC",
    views: 2578,
    uses: 189,
  },
  {
    name: "Anh đào",
    bg: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)",
    textColor: "#9f1239",
    font: "'Lora', serif",
    desc: "Ngọt ngào, dịu dàng",
    tier: "FREE",
    views: 1424,
    uses: 167,
  },
  {
    name: "Trắng tinh",
    bg: "#ffffff",
    textColor: "#1f2937",
    font: "'Inter', sans-serif",
    desc: "Tối giản, hiện đại",
    tier: "FREE",
    views: 2414,
    uses: 209,
  },
  {
    name: "Đen sang trọng",
    bg: "linear-gradient(180deg, #111827 0%, #1f2937 100%)",
    textColor: "#f9a8d4",
    font: "'Cormorant Garamond', serif",
    desc: "Luxury, premium",
    tier: "PREMIUM",
    views: 2177,
    uses: 154,
  },
  {
    name: "Vintage Gold",
    bg: "linear-gradient(180deg, #fef9ef 0%, #fdf4dc 40%, #fcefc7 100%)",
    textColor: "#78350f",
    font: "'Playfair Display', serif",
    desc: "Cổ điển, vàng ấm",
    tier: "PREMIUM",
    views: 2801,
    uses: 198,
  },
  {
    name: "Biển xanh",
    bg: "linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 100%)",
    textColor: "#164e63",
    font: "'Inter', sans-serif",
    desc: "Tươi mát, biển cả",
    tier: "BASIC",
    views: 1652,
    uses: 143,
  },
  {
    name: "Hoa lavender",
    bg: "linear-gradient(180deg, #faf5ff 0%, #f3e8ff 40%, #e9d5ff 100%)",
    textColor: "#581c87",
    font: "'Dancing Script', cursive",
    desc: "Nhẹ nhàng, thanh lịch",
    tier: "BASIC",
    views: 1474,
    uses: 128,
  },
  {
    name: "Rustic",
    bg: "linear-gradient(180deg, #fefce8 0%, #fef3c7 30%, #fde68a 100%)",
    textColor: "#713f12",
    font: "'Lora', serif",
    desc: "Mộc mạc, ấm cúng",
    tier: "BASIC",
    views: 4556,
    uses: 367,
  },
  {
    name: "Bạc tuyết",
    bg: "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 40%, #bae6fd 100%)",
    textColor: "#0c4a6e",
    font: "'Cormorant Garamond', serif",
    desc: "Thanh thoát, mùa đông",
    tier: "PREMIUM",
    views: 5011,
    uses: 428,
  },
  {
    name: "Sunset Beach",
    bg: "linear-gradient(180deg, #fff7ed 0%, #ffedd5 30%, #fed7aa 100%)",
    textColor: "#9a3412",
    font: "'Playfair Display', serif",
    desc: "Hoàng hôn biển",
    tier: "BASIC",
    views: 1062,
    uses: 98,
  },
];

/* ═══════════════════════════════════════════════
   CraftVisualEditor — Main Editor Component
   Uses craft.js for drag-drop canvas
   ═══════════════════════════════════════════════ */

interface CraftVisualEditorProps {
  projectId: string;
  initialCanvasJson?: string | null;
  projectSlug: string;
  onPublish?: () => void;
}

export function CraftVisualEditor({
  projectId,
  initialCanvasJson,
  projectSlug,
  onPublish,
}: CraftVisualEditorProps) {
  return (
    <Editor
      resolver={{
        div: "div" as any,
        CraftText,
        CraftImage,
        CraftContainer,
        RootContainer,
        CraftCountdown,
        CraftCalendar,
        CraftMap,
        CraftRSVP,
        CraftCallButton,
        CraftPhotoAlbum,
        CraftYouTube,
        CraftQRBox,
        CraftGuestName,
        CraftFormBuilder,
        CraftEnvelope,
        CraftSticker,
        CraftShape,
      }}
      enabled={true}
    >
      <CraftEditorInner
        projectId={projectId}
        initialCanvasJson={initialCanvasJson}
        projectSlug={projectSlug}
        onPublish={onPublish}
      />
    </Editor>
  );
}

/* ── Inner component with useEditor access ── */
function CraftEditorInner({
  projectId,
  initialCanvasJson,
  projectSlug,
  onPublish,
}: CraftVisualEditorProps) {
  const { actions, query, selected, canUndo, canRedo } = useEditor(
    (state, query) => {
      const [currentNodeId] = state.events.selected;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let sel:
        | {
            id: string;
            name: string;
            settings: any;
            isDeletable: boolean;
            props: any;
          }
        | undefined;
      if (currentNodeId) {
        sel = {
          id: currentNodeId,
          name: state.nodes[currentNodeId]?.data?.name || "Unknown",
          settings:
            (state.nodes[currentNodeId] as any)?.related?.settings || null,
          isDeletable: query.node(currentNodeId).isDeletable(),
          props: (state.nodes[currentNodeId] as any)?.data?.props ?? {},
        };
      }
      return {
        selected: sel,
        canUndo: query.history.canUndo(),
        canRedo: query.history.canRedo(),
      };
    },
  );

  const [activeTab, setActiveTab] = useState("text");
  const [clipartCat, setClipartCat] = useState("all");
  const [sectionCat, setSectionCat] = useState("all");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "done"
  >("idle");
  const [musicUrl, setMusicUrl] = useState("");
  const [musicName, setMusicName] = useState("");
  const [particleEffect, setParticleEffect] = useState("none");
  const [effectSubTab, setEffectSubTab] = useState("anim");
  const [pageAnimation, setPageAnimation] = useState("none");
  const [curtainEffect, setCurtainEffect] = useState("none");
  const [background, setBackground] = useState(
    "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
  );
  const [showTemplateSwap, setShowTemplateSwap] = useState(false);
  /* Phase 1: BG upgrade */
  const [bgSubTab, setBgSubTab] = useState<"colors" | "gradient" | "image">(
    "colors",
  );
  const [bgOpacity, setBgOpacity] = useState(100);
  /* Phase 2: Music widget */
  const [musicWidgetStyle, setMusicWidgetStyle] = useState("vinyl");
  const [musicWidgetColor, setMusicWidgetColor] = useState("#ff6b9d");
  /* Phase 4: Support + Backup */
  const [showBackupRecovery, setShowBackupRecovery] = useState(false);
  const [bugReportText, setBugReportText] = useState("");
  const [musicFilter, setMusicFilter] = useState<"all" | "intl" | "vpop">(
    "all",
  );
  const [musicSearch, setMusicSearch] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const thumbnailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [projectCategory, setProjectCategory] = useState("wedding");
  const [projectStatus, setProjectStatus] = useState("draft");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; name: string; size: number }[]
  >([]);
  const [showInLibrary, setShowInLibrary] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Custom Canvas Engine State ──
  const [editorState, editorDispatch] = useReducer(editorReducer, initialState);
  const selectedCanvasElement = useMemo(
    () =>
      editorState.elements.find(
        (el: CanvasElement) => el.id === editorState.selectedId,
      ) || null,
    [editorState.elements, editorState.selectedId],
  );
  const editorCtx = useMemo(
    () => ({
      state: editorState,
      dispatch: editorDispatch,
      selectedElement: selectedCanvasElement,
    }),
    [editorState, selectedCanvasElement],
  );
  const [useCustomCanvas, setUseCustomCanvas] = useState(true);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      ),
    [],
  );

  // Parse initial background + craft.js state from saved canvas_json
  useEffect(() => {
    if (initialCanvasJson) {
      try {
        const parsed = JSON.parse(initialCanvasJson);
        if (parsed.canvas?.bg) setBackground(parsed.canvas.bg);
        if (parsed.canvas?.bgOpacity !== undefined)
          setBgOpacity(parsed.canvas.bgOpacity);
        if (parsed.meta?.musicUrl) {
          setMusicUrl(parsed.meta.musicUrl);
          setMusicName(parsed.meta.musicName || "");
        }
        if (parsed.meta?.musicWidgetStyle)
          setMusicWidgetStyle(parsed.meta.musicWidgetStyle);
        if (parsed.meta?.musicWidgetColor)
          setMusicWidgetColor(parsed.meta.musicWidgetColor);
        if (parsed.effects?.particleEffect)
          setParticleEffect(parsed.effects.particleEffect);
        if (parsed.effects?.pageAnimation)
          setPageAnimation(parsed.effects.pageAnimation);
        if (parsed.effects?.curtainEffect)
          setCurtainEffect(parsed.effects.curtainEffect);
        if (parsed.meta?.projectCategory)
          setProjectCategory(parsed.meta.projectCategory);
        if (parsed.meta?.projectStatus)
          setProjectStatus(parsed.meta.projectStatus);
        if (parsed.meta?.showInLibrary)
          setShowInLibrary(parsed.meta.showInLibrary);
        if (parsed.meta?.uploadedImages)
          setUploadedImages(parsed.meta.uploadedImages);
        // Detect engine type and load accordingly
        if (parsed.engine === "custom-canvas" && parsed.elements) {
          // New custom canvas format
          setUseCustomCanvas(true);
          editorDispatch({ type: "SET_ELEMENTS", elements: parsed.elements });
          if (parsed.canvas?.width && parsed.canvas?.height) {
            editorDispatch({
              type: "SET_CANVAS",
              width: parsed.canvas.width,
              height: parsed.canvas.height,
              background: parsed.canvas.background || "#f8f3eb",
            });
          }
        } else if (parsed.craftState) {
          // Legacy CraftJS format
          setUseCustomCanvas(false);
          const stateStr =
            typeof parsed.craftState === "string"
              ? parsed.craftState
              : JSON.stringify(parsed.craftState);
          actions.deserialize(stateStr);
        }
      } catch {
        /* ignore */
      }
    }
  }, [initialCanvasJson]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Backup recovery check ──
  useEffect(() => {
    try {
      const backupKey = `editor_backup_${projectId}`;
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        const parsed = JSON.parse(backup);
        const backupAge = Date.now() - (parsed.timestamp || 0);
        // Show recovery if backup is less than 24h old
        if (backupAge < 86400000) {
          setShowBackupRecovery(true);
        } else {
          localStorage.removeItem(backupKey);
        }
      }
    } catch {
      /* ignore */
    }
  }, [projectId]);

  // ── Clipboard for copy/paste ──
  const clipboardRef = useRef<string | null>(null);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept keyboard events from input/textarea
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl+Z
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        actions.history.undo();
        return;
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        actions.history.redo();
        return;
      }

      if (!selected) return;

      // Delete / Backspace: remove selected element
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selected.isDeletable
      ) {
        e.preventDefault();
        actions.delete(selected.id);
        return;
      }

      // Copy: Ctrl+C
      if (ctrl && e.key === "c") {
        e.preventDefault();
        try {
          const serialized = query.serialize();
          const nodes = JSON.parse(serialized);
          const nodeData = nodes[selected.id];
          if (nodeData) {
            clipboardRef.current = JSON.stringify({
              node: nodeData,
              id: selected.id,
            });
          }
        } catch {
          /* ignore */
        }
        return;
      }

      // Duplicate: Ctrl+D
      if (ctrl && e.key === "d") {
        e.preventDefault();
        try {
          const freshSerialized = query.serialize();
          const freshNodes = JSON.parse(freshSerialized);
          const currentNode = freshNodes[selected.id];
          if (!currentNode) return;
          // Use CraftJS clone approach via parseSerializedNode
          const parentId = currentNode.parent;
          if (!parentId) return;
          const tree = query.node(selected.id).toNodeTree();
          actions.addNodeTree(tree, parentId);
        } catch {
          /* ignore */
        }
        return;
      }

      // Arrow key nudge: CraftJS components use internal drag positioning,
      // not top/left/x/y props, so nudge via arrow keys is not supported.
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, query, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save ──
  const save = useCallback(async () => {
    setSaveStatus("saving");
    let canvasJson: string;
    if (useCustomCanvas) {
      // New custom canvas engine format
      canvasJson = JSON.stringify({
        version: 2,
        engine: "custom-canvas",
        canvas: {
          width: editorState.canvasWidth,
          height: editorState.canvasHeight,
          background: editorState.canvasBackground,
          bg: background,
          bgOpacity,
        },
        elements: editorState.elements,
        meta: {
          musicUrl,
          musicName,
          musicWidgetStyle,
          musicWidgetColor,
          projectCategory,
          projectStatus,
          showInLibrary,
          uploadedImages,
        },
        effects: { particleEffect, pageAnimation, curtainEffect },
      });
    } else {
      // Legacy CraftJS format
      const craftJson = query.serialize();
      canvasJson = JSON.stringify({
        version: 2,
        engine: "craftjs",
        canvas: { width: 390, height: 5000, bg: background, bgOpacity },
        craftState: craftJson,
        meta: {
          musicUrl,
          musicName,
          musicWidgetStyle,
          musicWidgetColor,
          projectCategory,
          projectStatus,
          showInLibrary,
          uploadedImages,
        },
        effects: { particleEffect, pageAnimation, curtainEffect },
      });
    }
    // Save backup to localStorage
    try {
      localStorage.setItem(
        `editor_backup_${projectId}`,
        JSON.stringify({ canvasJson, timestamp: Date.now() }),
      );
    } catch {
      /* quota exceeded */
    }
    try {
      await supabase
        .from("projects")
        .update({
          canvas_json: canvasJson,
          music_url: musicUrl || null,
          music_name: musicName || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);
      setSaveStatus("saved");
      // Schedule thumbnail generation after save
      if (thumbnailTimer.current) clearTimeout(thumbnailTimer.current);
      thumbnailTimer.current = setTimeout(() => {
        const el = canvasRef.current;
        if (!el) return;
        setThumbnailLoading(true);
        import("html2canvas")
          .then(({ default: html2canvas }) =>
            html2canvas(el, {
              useCORS: true,
              allowTaint: true,
              scale: 0.5,
              width: el.offsetWidth,
              height: Math.min(el.offsetHeight, 1200),
              windowWidth: el.offsetWidth,
              windowHeight: Math.min(el.offsetHeight, 1200),
            }),
          )
          .then((capturedCanvas) => {
            const thumbCanvas = document.createElement("canvas");
            const maxW = 200;
            const ratio = maxW / capturedCanvas.width;
            thumbCanvas.width = maxW;
            thumbCanvas.height = Math.round(capturedCanvas.height * ratio);
            const ctx = thumbCanvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(
                capturedCanvas,
                0,
                0,
                thumbCanvas.width,
                thumbCanvas.height,
              );
              setThumbnailUrl(thumbCanvas.toDataURL("image/jpeg", 0.8));
            }
          })
          .catch(() => {
            /* silently skip */
          })
          .finally(() => setThumbnailLoading(false));
      }, 1500);
    } catch {
      setSaveStatus("unsaved");
    }
  }, [
    query,
    background,
    bgOpacity,
    projectId,
    supabase,
    musicUrl,
    musicName,
    musicWidgetStyle,
    musicWidgetColor,
    particleEffect,
    pageAnimation,
    curtainEffect,
    projectCategory,
    projectStatus,
    showInLibrary,
    uploadedImages,
    useCustomCanvas,
    editorState,
  ]);

  // ── Publish ──
  const handlePublish = useCallback(async () => {
    if (publishStatus === "publishing") return;
    setPublishStatus("publishing");
    const craftJson = query.serialize();
    const canvasJson = JSON.stringify({
      version: 2,
      engine: "craftjs",
      canvas: { width: 390, height: 5000, bg: background, bgOpacity },
      craftState: craftJson,
      meta: {
        musicUrl,
        musicName,
        musicWidgetStyle,
        musicWidgetColor,
        projectCategory,
        projectStatus,
        showInLibrary,
        uploadedImages,
      },
      effects: { particleEffect, pageAnimation, curtainEffect },
    });
    try {
      await supabase
        .from("projects")
        .update({
          canvas_json: canvasJson,
          music_url: musicUrl || null,
          music_name: musicName || null,
          status: "published",
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);
      setSaveStatus("saved");
      setPublishStatus("done");
      onPublish?.();
    } catch {
      setPublishStatus("idle");
      alert("Xuất bản thất bại. Vui lòng thử lại.");
    }
  }, [
    query,
    background,
    projectId,
    supabase,
    musicUrl,
    musicName,
    onPublish,
    publishStatus,
    projectCategory,
    projectStatus,
    showInLibrary,
    uploadedImages,
  ]);

  // Auto-save on changes (debounced)
  const triggerAutosave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("unsaved");
    saveTimer.current = setTimeout(save, 3000);
  }, [save]);

  // ── Add Text via craft.js ──
  const addCraftText = useCallback(
    (preset: (typeof TEXT_PRESETS)[0]) => {
      const tree = query
        .parseReactElement(
          <CraftText
            text={preset.label}
            fontSize={preset.fontSize}
            fontFamily={preset.fontFamily}
            fontWeight={preset.fontWeight}
            fontStyle={preset.fontStyle}
            color={
              background.includes("0f0825") || background.includes("111827")
                ? "#ffffff"
                : "#1f2937"
            }
            textAlign="center"
            lineHeight={1.5}
            letterSpacing={0}
            opacity={1}
          />,
        )
        .toNodeTree();
      // Add to ROOT canvas node
      const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
      if (rootNodeId) {
        actions.addNodeTree(tree, rootNodeId);
      }
      triggerAutosave();
    },
    [query, actions, background, triggerAutosave],
  );

  // ── Add Image via upload ──
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setUploadedImages((prev) => [
            ...prev,
            { url: data.url, name: file.name, size: file.size },
          ]);
          const tree = query
            .parseReactElement(
              <CraftImage
                src={data.url}
                objectFit="cover"
                borderRadius={12}
                borderWidth={2}
                borderColor="#f9a8d4"
                opacity={1}
                shadow={false}
              />,
            )
            .toNodeTree();
          const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
          if (rootNodeId) {
            actions.addNodeTree(tree, rootNodeId);
          }
          triggerAutosave();
        }
      } catch {
        alert("Upload ảnh thất bại.");
      }
      e.target.value = "";
    },
    [query, actions, projectId, triggerAutosave],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f0f0f0",
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ══ Selection overlay CSS ══ */}
      <style>{`
        /* CraftJS selected element — blue dashed border */
        [data-cy="craft-selected"],
        .craft-selected-indicator {
          outline: 2px dashed #3b82f6 !important;
          outline-offset: 2px !important;
        }
        /* CraftJS hover highlight */
        [data-cy="craft-hovered"] {
          outline: 1px solid #93c5fd !important;
          outline-offset: 2px !important;
        }
      `}</style>
      {/* ══ Top Bar ══ */}
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        <a
          href="/dashboard"
          title="Về trang chủ"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: "#ff6b9d" }}>
            💌
          </span>
          <Home size={16} style={{ color: "#9ca3af" }} />
        </a>
        <span
          style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, flex: 1 }}
        >
          Visual Editor
        </span>

        {/* Undo/Redo — craft.js history */}
        <button
          onClick={() => actions.history.undo()}
          disabled={!canUndo}
          title="Hoàn tác (⌘Z)"
          style={topBtnStyle(!canUndo)}
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
          title="Làm lại (⌘⇧Z)"
          style={topBtnStyle(!canRedo)}
        >
          <Redo2 size={16} />
        </button>

        {/* Template Hot-Swap */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowTemplateSwap((p) => !p)}
            title="Đổi giao diện"
            style={{
              ...topBtnStyle(false),
              padding: "6px 10px",
              fontSize: 11,
              gap: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <LayoutTemplate size={14} /> Đổi mẫu
          </button>
          {showTemplateSwap && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#fff",
                borderRadius: 12,
                padding: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                border: "1px solid #e5e7eb",
                width: 220,
                zIndex: 999,
                marginTop: 4,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#374151",
                  margin: "0 0 8px",
                  textTransform: "uppercase",
                }}
              >
                Đổi giao diện nhanh
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 6,
                }}
              >
                {BG_PRESETS.map((bg) => (
                  <button
                    key={bg.label}
                    onClick={() => {
                      setBackground(bg.value);
                      const rootNodeId = query.node("ROOT").get().data
                        .nodes?.[0];
                      if (rootNodeId) {
                        actions.setProp(
                          rootNodeId,
                          (props: { background: string }) => {
                            props.background = bg.value;
                          },
                        );
                      }
                      triggerAutosave();
                      setShowTemplateSwap(false);
                    }}
                    style={{
                      height: 44,
                      borderRadius: 8,
                      border:
                        background === bg.value
                          ? "2px solid #ff6b9d"
                          : "1px solid #e5e7eb",
                      background: bg.value,
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        bottom: 1,
                        left: 0,
                        right: 0,
                        fontSize: 7,
                        fontWeight: 600,
                        textAlign: "center",
                        color:
                          bg.value.includes("0f0825") ||
                          bg.value.includes("111827")
                            ? "#fff"
                            : "#374151",
                      }}
                    >
                      {bg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color:
              saveStatus === "saved"
                ? "#10b981"
                : saveStatus === "saving"
                  ? "#f59e0b"
                  : "#ef4444",
          }}
        >
          <Save size={13} />
          {saveStatus === "saved"
            ? "Đã lưu tạm thời"
            : saveStatus === "saving"
              ? "Đang lưu..."
              : "Chưa lưu"}
        </div>

        {/* Manual Save */}
        <button
          onClick={save}
          title="Lưu ngay (⌘S)"
          style={{
            ...topBtnStyle(false),
            padding: "6px 12px",
            fontSize: 12,
          }}
        >
          💾 Lưu
        </button>

        {/* Preview */}
        <a
          href={`/i/${projectSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#374151",
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          <Eye size={14} /> Xem trước
        </a>

        {/* Share */}
        <button
          onClick={async () => {
            const url = `${window.location.origin}/i/${projectSlug}`;
            try {
              if (navigator.share)
                await navigator.share({ title: "Thiệp mời cưới", url });
              else {
                await navigator.clipboard.writeText(url);
                alert("✅ Đã sao chép link mời!");
              }
            } catch {
              /* user cancelled */
            }
          }}
          style={{ ...topBtnStyle(false), padding: "6px 12px", fontSize: 12 }}
        >
          <Share2 size={14} /> Chia sẻ
        </button>

        {/* Publish */}
        <button
          onClick={handlePublish}
          disabled={publishStatus === "publishing"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 10,
            border: "none",
            background:
              publishStatus === "publishing"
                ? "#d1d5db"
                : "linear-gradient(135deg, #ff6b9d, #c084fc)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: publishStatus === "publishing" ? "not-allowed" : "pointer",
            boxShadow:
              publishStatus === "publishing"
                ? "none"
                : "0 2px 8px rgba(255,107,157,0.35)",
          }}
        >
          <Rocket size={14} />
          {publishStatus === "publishing" ? "Đang xuất bản..." : "Xuất bản"}
        </button>
      </div>

      {/* ── Backup Recovery Banner ── */}
      {showBackupRecovery && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            background: "linear-gradient(90deg, #fef3c7, #fde68a)",
            borderBottom: "1px solid #f59e0b",
          }}
        >
          <span style={{ fontSize: 16 }}>💾</span>
          <p style={{ flex: 1, fontSize: 12, color: "#92400e", margin: 0 }}>
            Phát hiện bản sao lưu chưa được lưu. Bạn muốn khôi phục?
          </p>
          <button
            onClick={() => {
              try {
                const backup = localStorage.getItem(
                  `editor_backup_${projectId}`,
                );
                if (backup) {
                  const parsed = JSON.parse(backup);
                  const data = JSON.parse(parsed.canvasJson);
                  if (data.canvas?.bg) setBackground(data.canvas.bg);
                  if (data.canvas?.bgOpacity !== undefined)
                    setBgOpacity(data.canvas.bgOpacity);
                  if (data.meta?.musicUrl) {
                    setMusicUrl(data.meta.musicUrl);
                    setMusicName(data.meta.musicName || "");
                  }
                  if (data.craftState) {
                    const stateStr =
                      typeof data.craftState === "string"
                        ? data.craftState
                        : JSON.stringify(data.craftState);
                    actions.deserialize(stateStr);
                  }
                  triggerAutosave();
                }
              } catch {
                /* ignore */
              }
              setShowBackupRecovery(false);
            }}
            style={{
              padding: "5px 14px",
              borderRadius: 8,
              border: "none",
              background: "#16a34a",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Khôi phục
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(`editor_backup_${projectId}`);
              setShowBackupRecovery(false);
            }}
            style={{
              padding: "5px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#6b7280",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Bỏ qua
          </button>
        </div>
      )}

      {/* ══ Main Area ══ */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Left Icon Column ── */}
        <div
          style={{
            width: 85,
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 8,
            gap: 2,
            flexShrink: 0,
            overflowY: "auto",
            boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
            zIndex: 2,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(activeTab === tab.key ? "" : tab.key)}
              title={tab.label}
              style={{
                width: 74,
                padding: "8px 2px",
                border: "none",
                borderRadius: 10,
                background: activeTab === tab.key ? "#fff0f5" : "transparent",
                color: activeTab === tab.key ? "#ff6b9d" : "#6b7280",
                cursor: "pointer",
                fontSize: 9,
                fontWeight: activeTab === tab.key ? 700 : 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          {/* ── Fixed "Hỗ trợ" button at bottom (CineLove parity) ── */}
          <div
            style={{
              marginTop: "auto",
              borderTop: "1px solid #f0f0f0",
              paddingTop: 8,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => window.open("https://lovestory.vn/help", "_blank")}
              title="Hỗ trợ"
              style={{
                width: 74,
                padding: "8px 2px",
                border: "none",
                borderRadius: 10,
                background: "transparent",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: 9,
                fontWeight: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
                marginBottom: 8,
              }}
            >
              <HelpCircle size={20} />
              <span>Hỗ trợ</span>
            </button>
          </div>
        </div>

        {/* ── Overlay Left Panel (floats over canvas) ── */}
        {activeTab !== "" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 85,
              bottom: 0,
              width: 220,
              background: "#fff",
              borderRight: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 20,
              animation: "slideIn 0.2s ease",
              boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
            }}
          >
            <style>{`@keyframes slideIn { from { transform: translateX(-10px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
            <div
              style={{
                padding: "12px 16px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#374151",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {TABS.find((t) => t.key === activeTab)?.label}
              </p>
              <button
                onClick={() => setActiveTab("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  fontSize: 16,
                  padding: 2,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {/* TEXT TAB */}
              {activeTab === "text" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <p style={panelLabelStyle}>Thêm văn bản</p>
                  {TEXT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => addCraftText(preset)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                        background: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: preset.fontFamily,
                        fontSize: Math.min(preset.fontSize * 0.65, 16),
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              {/* IMAGE TAB */}
              {activeTab === "image" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <p style={panelLabelStyle}>Thêm hình ảnh</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: "2px dashed #e5e7eb",
                      background: "#fafafa",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <ImageIcon size={24} color="#9ca3af" />
                    <span style={{ fontSize: 13, color: "#6b7280" }}>
                      Kéo thả hoặc nhấn vào đây để tải lên
                    </span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>
                      PNG, JPG, WebP — tối đa 15 ảnh cùng lúc
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />

                  {/* File counter — CineLove parity */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      fontSize: 11,
                      color: "#6b7280",
                      padding: "4px 0",
                    }}
                  >
                    <span>
                      Đã tải:{" "}
                      <strong style={{ color: "#3b82f6" }}>
                        {uploadedImages.length}/10
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Còn lại:{" "}
                      <strong>{Math.max(0, 10 - uploadedImages.length)}</strong>
                    </span>
                  </div>

                  {/* Uploaded files section */}
                  <div>
                    <p style={panelLabelStyle}>Tệp đã tải lên</p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#9ca3af",
                        margin: "-4px 0 8px",
                      }}
                    >
                      Tổng {uploadedImages.length} tệp (
                      {(
                        uploadedImages.reduce((a, b) => a + b.size, 0) /
                        (1024 * 1024 * 1024)
                      ).toFixed(4)}{" "}
                      GB / 5GB)
                    </p>
                    {uploadedImages.length > 0 && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 4,
                          marginBottom: 8,
                        }}
                      >
                        {uploadedImages.map((img, i) => (
                          <div
                            key={i}
                            style={{
                              width: "100%",
                              aspectRatio: "1",
                              borderRadius: 6,
                              border: "1px solid #e5e7eb",
                              overflow: "hidden",
                              position: "relative",
                              background: `url(${img.url}) center/cover`,
                            }}
                          >
                            <button
                              onClick={() => {
                                setUploadedImages((prev) =>
                                  prev.filter((_, idx) => idx !== i),
                                );
                                triggerAutosave();
                              }}
                              style={{
                                position: "absolute",
                                top: 2,
                                right: 2,
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: "rgba(0,0,0,0.5)",
                                border: "none",
                                color: "#fff",
                                fontSize: 10,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              ×
                            </button>
                            <span
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "rgba(0,0,0,0.5)",
                                color: "#fff",
                                fontSize: 7,
                                textAlign: "center",
                                padding: "1px 0",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {img.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stock Image Library */}
                  <p style={panelLabelStyle}>Kho ảnh miễn phí</p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 4,
                    }}
                  >
                    {STOCK_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const tree = query
                            .parseReactElement(
                              <CraftImage
                                src={img.url}
                                borderRadius={12}
                                objectFit="cover"
                                opacity={1}
                                shadow={false}
                                borderWidth={0}
                                borderColor="transparent"
                              />,
                            )
                            .toNodeTree();
                          const rootNodeId = query.node("ROOT").get().data
                            .nodes?.[0];
                          if (rootNodeId) actions.addNodeTree(tree, rootNodeId);
                          triggerAutosave();
                        }}
                        title={img.label}
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                          cursor: "pointer",
                          background: `url(${img.thumb}) center/cover no-repeat`,
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "rgba(0,0,0,0.45)",
                            color: "#fff",
                            fontSize: 7,
                            textAlign: "center",
                            padding: "2px 0",
                          }}
                        >
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* BG TAB — CineLove parity: sub-tabs + gradient picker + opacity */}
              {activeTab === "bg" &&
                (() => {
                  const applyBg = (val: string) => {
                    setBackground(val);
                    const rootNodeId = query.node("ROOT").get().data.nodes?.[0];
                    if (rootNodeId) {
                      actions.setProp(
                        rootNodeId,
                        (props: { background: string }) => {
                          props.background = val;
                        },
                      );
                    }
                    triggerAutosave();
                  };
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {/* Sub-tab buttons */}
                      <div style={{ display: "flex", gap: 4 }}>
                        {(
                          [
                            { id: "colors" as const, label: "Màu nền" },
                            { id: "gradient" as const, label: "Gradient" },
                            { id: "image" as const, label: "Hình nền" },
                          ] as const
                        ).map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setBgSubTab(sub.id)}
                            style={{
                              flex: 1,
                              padding: "6px 8px",
                              borderRadius: 20,
                              border: "none",
                              background:
                                bgSubTab === sub.id ? "#3b82f6" : "#f3f4f6",
                              color: bgSubTab === sub.id ? "#fff" : "#6b7280",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>

                      {/* Solid colors */}
                      {bgSubTab === "colors" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 6,
                            }}
                          >
                            {BG_PRESETS.map((bg) => (
                              <button
                                key={bg.label}
                                onClick={() => applyBg(bg.value)}
                                style={{
                                  height: 44,
                                  borderRadius: 8,
                                  border:
                                    background === bg.value
                                      ? "2px solid #3b82f6"
                                      : "2px solid #e5e7eb",
                                  background: bg.value,
                                  cursor: "pointer",
                                  position: "relative",
                                  overflow: "hidden",
                                }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    bottom: 2,
                                    left: 0,
                                    right: 0,
                                    fontSize: 8,
                                    fontWeight: 600,
                                    textAlign: "center",
                                    color:
                                      bg.value.includes("0f0825") ||
                                      bg.value.includes("111827")
                                        ? "#fff"
                                        : "#374151",
                                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                                  }}
                                >
                                  {bg.label}
                                </span>
                              </button>
                            ))}
                          </div>
                          {/* Custom hex color */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <input
                              type="color"
                              value={
                                background.startsWith("#")
                                  ? background
                                  : "#ffffff"
                              }
                              onChange={(e) => applyBg(e.target.value)}
                              style={{
                                width: 32,
                                height: 32,
                                border: "none",
                                borderRadius: 6,
                                cursor: "pointer",
                              }}
                            />
                            <span style={{ fontSize: 11, color: "#6b7280" }}>
                              Chọn màu tùy chỉnh
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Gradient presets */}
                      {bgSubTab === "gradient" && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 6,
                          }}
                        >
                          {GRADIENT_PRESETS.map((g) => (
                            <button
                              key={g.label}
                              onClick={() => applyBg(g.value)}
                              style={{
                                height: 48,
                                borderRadius: 10,
                                border:
                                  background === g.value
                                    ? "2px solid #3b82f6"
                                    : "2px solid #e5e7eb",
                                background: g.value,
                                cursor: "pointer",
                                position: "relative",
                                overflow: "hidden",
                                transition: "all 0.15s",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: 3,
                                  left: 0,
                                  right: 0,
                                  fontSize: 8,
                                  fontWeight: 600,
                                  textAlign: "center",
                                  color:
                                    g.value.includes("1b2735") ||
                                    g.value.includes("1a2744")
                                      ? "#fff"
                                      : "#374151",
                                  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                                }}
                              >
                                {g.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Background image upload */}
                      {bgSubTab === "image" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = async (ev) => {
                                const file = (ev.target as HTMLInputElement)
                                  .files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("projectId", projectId);
                                try {
                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    body: formData,
                                  });
                                  const data = await res.json();
                                  if (data.url) {
                                    applyBg(
                                      `url(${data.url}) center/cover no-repeat`,
                                    );
                                  }
                                } catch {
                                  alert("Upload nền thất bại.");
                                }
                              };
                              input.click();
                            }}
                            style={{
                              padding: 16,
                              borderRadius: 12,
                              border: "2px dashed #d1d5db",
                              background: "#fafafa",
                              cursor: "pointer",
                              fontSize: 12,
                              color: "#6b7280",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 6,
                              transition: "all 0.15s",
                            }}
                          >
                            <span style={{ fontSize: 24 }}>📁</span>
                            <span>Upload ảnh nền</span>
                            <span style={{ fontSize: 10, color: "#9ca3af" }}>
                              PNG, JPG, WebP
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Opacity slider — always visible */}
                      <div
                        style={{
                          borderTop: "1px solid #f0f0f0",
                          paddingTop: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Độ trong suốt nền
                          </span>
                          <span style={{ fontSize: 11, color: "#6b7280" }}>
                            {bgOpacity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={bgOpacity}
                          onChange={(e) => {
                            setBgOpacity(Number(e.target.value));
                            triggerAutosave();
                          }}
                          style={{ width: "100%", accentColor: "#3b82f6" }}
                        />
                      </div>
                    </div>
                  );
                })()}

              {/* PLUGINS TAB — Widget add buttons */}
              {activeTab === "plugins" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <p style={panelLabelStyle}>Thêm tiện ích</p>
                  {[
                    {
                      label: "⏱️ Đếm ngược",
                      desc: "Live countdown đến ngày cưới",
                      component: (
                        <CraftCountdown
                          targetDate="2026-05-28"
                          label="Đếm ngược đến ngày cưới"
                          color="#831843"
                          labelColor="#9f1239"
                          background="rgba(255,255,255,0.6)"
                          borderRadius={16}
                          fontSize={28}
                        />
                      ),
                    },
                    {
                      label: "📅 Lịch cưới",
                      desc: "Lịch tháng đánh dấu ngày cưới",
                      component: (
                        <CraftCalendar
                          targetDate="2026-05-28"
                          accentColor="#ff6b9d"
                          textColor="#374151"
                          background="rgba(255,255,255,0.7)"
                          borderRadius={16}
                        />
                      ),
                    },
                    {
                      label: "📍 Bản đồ",
                      desc: "Google Maps + nút chỉ đường",
                      component: (
                        <CraftMap
                          address="123 Nguyễn Huệ, Quận 1, TP.HCM"
                          venueName="Diamond Palace"
                          lat={10.7769}
                          lng={106.7009}
                          zoom={15}
                          height={200}
                          borderRadius={12}
                          accentColor="#ff6b9d"
                        />
                      ),
                    },
                    {
                      label: "💌 RSVP",
                      desc: "Form xác nhận tham dự",
                      component: (
                        <CraftRSVP
                          title="Xác nhận tham dự"
                          subtitle="Vui lòng xác nhận sự hiện diện của bạn"
                          accentColor="#ff6b9d"
                          textColor="#374151"
                          background="rgba(255,255,255,0.7)"
                          borderRadius={16}
                        />
                      ),
                    },
                    {
                      label: "📞 Nút gọi",
                      desc: "Gọi điện / Zalo / SMS",
                      component: (
                        <CraftCallButton
                          phoneNumber="0901234567"
                          label="Gọi cho chúng tôi"
                          type="call"
                          accentColor="#ff6b9d"
                          textColor="#ffffff"
                          borderRadius={24}
                        />
                      ),
                    },
                    {
                      label: "📸 Album ảnh",
                      desc: "Gallery ảnh cưới",
                      component: (
                        <CraftPhotoAlbum
                          photos={[]}
                          columns={3}
                          gap={6}
                          borderRadius={8}
                          accentColor="#ff6b9d"
                          title="Album ảnh"
                        />
                      ),
                    },
                    {
                      label: "🎥 Video YouTube",
                      desc: "Nhúng video cưới",
                      component: (
                        <CraftYouTube
                          videoUrl=""
                          borderRadius={12}
                          aspectRatio="16:9"
                        />
                      ),
                    },
                    {
                      label: "🎁 QR Box",
                      desc: "Mừng cưới qua QR ngân hàng",
                      component: (
                        <CraftQRBox
                          bankName="VCB"
                          accountNumber=""
                          accountName=""
                          amount="500000"
                          note="Mung cuoi"
                          accentColor="#ff6b9d"
                          textColor="#374151"
                          borderRadius={16}
                        />
                      ),
                    },
                    {
                      label: "👤 Tên khách mời",
                      desc: "Tự động điền tên khi chia sẻ",
                      component: (
                        <CraftGuestName
                          prefix="Trân trọng kính mời"
                          defaultName="Quý khách"
                          fontSize={28}
                          fontFamily="'Playfair Display', serif"
                          color="#374151"
                          textAlign="center"
                          accentColor="#ff6b9d"
                        />
                      ),
                    },
                    {
                      label: "📋 Form tuỳ chỉnh",
                      desc: "Tạo form thông tin khách mời",
                      component: (
                        <CraftFormBuilder
                          title="Thông tin khách mời"
                          subtitle="Vui lòng điền đầy đủ thông tin"
                          fields={[
                            {
                              id: "name",
                              label: "Họ và tên",
                              type: "text",
                              placeholder: "Nhập tên của bạn",
                              options: [],
                              required: true,
                            },
                            {
                              id: "phone",
                              label: "Số điện thoại",
                              type: "text",
                              placeholder: "0901234567",
                              options: [],
                              required: false,
                            },
                            {
                              id: "message",
                              label: "Lời chúc",
                              type: "textarea",
                              placeholder: "Gửi lời chúc...",
                              options: [],
                              required: false,
                            },
                            {
                              id: "attend",
                              label: "Bạn sẽ tham dự?",
                              type: "radio",
                              placeholder: "",
                              options: ["Sẽ tham dự", "Không tham dự"],
                              required: true,
                            },
                          ]}
                          buttonText="Gửi thông tin"
                          accentColor="#ff6b9d"
                          textColor="#374151"
                          background="rgba(255,255,255,0.8)"
                          borderRadius={16}
                        />
                      ),
                    },
                    {
                      label: "💌 Phong bì thư",
                      desc: "Hiệu ứng mở phong bì",
                      component: (
                        <CraftEnvelope
                          groomName="Anh"
                          brideName="Em"
                          label="Nhấn để mở thiệp mời"
                          envelopeColor="#d4a574"
                          sealColor="#c0392b"
                          textColor="#374151"
                          fontFamily="'Playfair Display', serif"
                        />
                      ),
                    },
                  ].map((widget) => (
                    <button
                      key={widget.label}
                      onClick={() => {
                        const tree = query
                          .parseReactElement(widget.component)
                          .toNodeTree();
                        const rootNodeId = query.node("ROOT").get().data
                          .nodes?.[0];
                        if (rootNodeId) {
                          actions.addNodeTree(tree, rootNodeId);
                        }
                        triggerAutosave();
                      }}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        background: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        transition: "all 0.15s",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {widget.label}
                      </span>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>
                        {widget.desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STOCK TAB — Clipart library (CineLove parity) */}
              {activeTab === "stock" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    Clipart đám cưới
                  </p>
                  <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
                    Chọn danh mục và thêm clipart vào thiệp
                  </p>
                  {/* Category filter chips */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {CLIPART_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setClipartCat(cat.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 12,
                          border: "none",
                          fontSize: 11,
                          cursor: "pointer",
                          fontWeight: 500,
                          background:
                            clipartCat === cat.id ? "#fdf2f8" : "#f3f4f6",
                          color: clipartCat === cat.id ? "#be185d" : "#6b7280",
                        }}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                  {/* Clipart grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 6,
                    }}
                  >
                    {CLIPART_ITEMS.filter(
                      (item) =>
                        clipartCat === "all" || item.category === clipartCat,
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const el = (
                            <CraftSticker
                              stickerId={item.id}
                              color="#d4a574"
                              size={150}
                              opacity={1}
                              customSvg={item.svgContent}
                            />
                          );
                          const tree = query.parseReactElement(el).toNodeTree();
                          const rootNodeId = query.node("ROOT").get().data
                            .nodes?.[0];
                          if (rootNodeId) actions.addNodeTree(tree, rootNodeId);
                          triggerAutosave();
                        }}
                        title={item.name}
                        style={{
                          padding: 6,
                          borderRadius: 8,
                          border: "1px solid #f3e8ff",
                          background: "#faf5ff",
                          cursor: "pointer",
                          aspectRatio: "1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{ width: "100%", height: "100%" }}
                          dangerouslySetInnerHTML={{ __html: item.svgContent }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SHAPES TAB — Basic geometric shapes (CineLove parity) */}
              {activeTab === "shapes" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    Hình dạng cơ bản
                  </p>
                  <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
                    Thêm hình dạng vào thiệp
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    {[
                      {
                        id: "shape-line",
                        name: "Đường thẳng",
                        shapeType: "line",
                        svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" stroke-width="4"/></svg>',
                      },
                      {
                        id: "shape-rect",
                        name: "Hình chữ nhật",
                        shapeType: "rectangle",
                        svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="40" width="160" height="120" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
                      },
                      {
                        id: "shape-circle",
                        name: "Hình tròn",
                        shapeType: "circle",
                        svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
                      },
                      {
                        id: "shape-triangle",
                        name: "Tam giác",
                        shapeType: "triangle",
                        svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,20 180,180 20,180" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
                      },
                      {
                        id: "shape-star",
                        name: "Ngôi sao",
                        shapeType: "star",
                        svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,10 125,75 195,80 140,125 155,195 100,160 45,195 60,125 5,80 75,75" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
                      },
                      {
                        id: "shape-heart",
                        name: "Trái tim",
                        shapeType: "heart",
                        svg: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100,180 C60,140 10,110 10,70 C10,30 50,10 100,50 C150,10 190,30 190,70 C190,110 140,140 100,180Z" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
                      },
                    ].map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => {
                          const el = (
                            <CraftShape
                              shapeType={shape.shapeType}
                              fill="#374151"
                              stroke="#374151"
                              strokeWidth={2}
                              opacity={1}
                              rotation={0}
                            />
                          );
                          const tree = query.parseReactElement(el).toNodeTree();
                          const rootNodeId = query.node("ROOT").get().data
                            .nodes?.[0];
                          if (rootNodeId) actions.addNodeTree(tree, rootNodeId);
                          triggerAutosave();
                        }}
                        style={{
                          padding: "12px 6px",
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.15s",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ff6b9d";
                          e.currentTarget.style.background = "#fff0f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.background = "#fff";
                        }}
                      >
                        <div
                          style={{ width: 40, height: 40, color: "#6b7280" }}
                          dangerouslySetInnerHTML={{ __html: shape.svg }}
                        />
                        <span
                          style={{
                            fontSize: 9,
                            color: "#6b7280",
                            fontWeight: 500,
                          }}
                        >
                          {shape.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TEMPLATES TAB — Visual gallery with BASIC/PREMIUM badges (CineLove parity) */}
              {activeTab === "templates" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    Chọn mẫu thiết kế
                  </p>
                  <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
                    Chọn một mẫu có sẵn để bắt đầu nhanh chóng
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    {TEMPLATE_STYLES.map((t) => {
                      const tierColors = {
                        FREE: { bg: "#6b7280", text: "#fff" },
                        BASIC: { bg: "#10b981", text: "#fff" },
                        PREMIUM: { bg: "#8b5cf6", text: "#fff" },
                      };
                      const badge = tierColors[t.tier];
                      return (
                        <div
                          key={t.name}
                          style={{
                            borderRadius: 10,
                            border:
                              background === t.bg
                                ? "2px solid #ff6b9d"
                                : "1px solid #e5e7eb",
                            background: "#fff",
                            overflow: "hidden",
                            transition: "all 0.2s",
                          }}
                        >
                          {/* Thumbnail preview */}
                          <button
                            onClick={() => {
                              setBackground(t.bg);
                              const rootNodeId = query.node("ROOT").get().data
                                .nodes?.[0];
                              if (rootNodeId) {
                                actions.setProp(
                                  rootNodeId,
                                  (props: { background: string }) => {
                                    props.background = t.bg;
                                  },
                                );
                              }
                              const nodes = query.getSerializedNodes();
                              Object.keys(nodes).forEach((nodeId) => {
                                const node = nodes[nodeId];
                                if (
                                  (node?.type as any)?.resolvedName ===
                                  "CraftText"
                                ) {
                                  actions.setProp(
                                    nodeId,
                                    (props: { color: string }) => {
                                      props.color = t.textColor;
                                    },
                                  );
                                }
                              });
                              triggerAutosave();
                            }}
                            style={{
                              width: "100%",
                              padding: 0,
                              border: "none",
                              cursor: "pointer",
                              background: "none",
                              textAlign: "left",
                            }}
                          >
                            <div
                              style={{
                                height: 100,
                                background: t.bg,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                overflow: "hidden",
                              }}
                            >
                              {/* Tier Badge */}
                              <span
                                style={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  fontSize: 8,
                                  fontWeight: 700,
                                  background: badge.bg,
                                  color: badge.text,
                                  letterSpacing: 0.5,
                                }}
                              >
                                {t.tier}
                              </span>
                              <span
                                style={{
                                  fontSize: 14,
                                  color: t.textColor,
                                  fontFamily: t.font,
                                  fontWeight: 600,
                                  opacity: 0.9,
                                }}
                              >
                                A & B
                              </span>
                              <span
                                style={{
                                  fontSize: 8,
                                  color: t.textColor,
                                  fontFamily: t.font,
                                  opacity: 0.6,
                                  marginTop: 2,
                                }}
                              >
                                28.05.2026
                              </span>
                            </div>
                          </button>
                          {/* Label + Stats + Xem mẫu */}
                          <div style={{ padding: "6px 8px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  color: "#374151",
                                  margin: 0,
                                }}
                              >
                                {t.name}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBackground(t.bg);
                                  const rootNodeId = query.node("ROOT").get()
                                    .data.nodes?.[0];
                                  if (rootNodeId) {
                                    actions.setProp(
                                      rootNodeId,
                                      (props: { background: string }) => {
                                        props.background = t.bg;
                                      },
                                    );
                                  }
                                  triggerAutosave();
                                }}
                                style={{
                                  fontSize: 9,
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  border: "1px solid #3b82f6",
                                  background: "#eff6ff",
                                  color: "#3b82f6",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                Xem mẫu
                              </button>
                            </div>
                            {/* View count + usage */}
                            <div
                              style={{ display: "flex", gap: 8, marginTop: 3 }}
                            >
                              <span style={{ fontSize: 8, color: "#9ca3af" }}>
                                {t.views.toLocaleString()}
                              </span>
                              <span style={{ fontSize: 8, color: "#f9a8d4" }}>
                                {t.uses.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EFFECTS TAB — CineLove parity: 3 sub-tabs */}
              {activeTab === "effects" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {/* Sub-tab buttons */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {[
                      { id: "anim", label: "Hiệu ứng động" },
                      { id: "curtain", label: "Hiệu ứng mở màn" },
                      { id: "particles", label: "Hiệu ứng rơi" },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setEffectSubTab(sub.id)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 20,
                          border: "none",
                          background:
                            effectSubTab === sub.id ? "#3b82f6" : "#f3f4f6",
                          color: effectSubTab === sub.id ? "#fff" : "#6b7280",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {/* Hiệu ứng động — page transition presets */}
                  {effectSubTab === "anim" && (
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#9ca3af",
                          margin: "0 0 8px",
                        }}
                      >
                        Chọn 1 mẫu hiệu ứng để áp dụng cho toàn bộ trang
                      </p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 6,
                        }}
                      >
                        {PAGE_ANIM_PRESETS.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => {
                              setPageAnimation(a.id);
                              triggerAutosave();
                            }}
                            style={{
                              padding: "12px 8px",
                              borderRadius: 10,
                              border: `2px solid ${pageAnimation === a.id ? "#3b82f6" : "#e5e7eb"}`,
                              background:
                                pageAnimation === a.id ? "#eff6ff" : "#fff",
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 6,
                              transition: "all 0.15s",
                            }}
                          >
                            <span style={{ fontSize: 22 }}>{a.icon}</span>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: "#374151",
                              }}
                            >
                              {a.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      <button
                        disabled
                        style={{
                          marginTop: 10,
                          padding: "8px 16px",
                          borderRadius: 10,
                          border: "none",
                          background: "rgba(100,100,120,0.3)",
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "not-allowed",
                          width: "100%",
                        }}
                      >
                        🎬 Xem trước (sắp có)
                      </button>
                    </div>
                  )}

                  {/* Hiệu ứng mở màn — envelope opening */}
                  {effectSubTab === "curtain" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                        Hiệu ứng mở màn khi khách xem thiệp
                      </p>
                      {CURTAIN_PRESETS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setCurtainEffect(c.id);
                            triggerAutosave();
                          }}
                          style={{
                            padding: "12px 14px",
                            borderRadius: 10,
                            border: `2px solid ${curtainEffect === c.id ? "#ff6b9d" : "#e5e7eb"}`,
                            background:
                              curtainEffect === c.id ? "#fdf2f8" : "#fff",
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span style={{ fontSize: 24 }}>{c.emoji}</span>
                          <div>
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#374151",
                                margin: 0,
                              }}
                            >
                              {c.label}
                            </p>
                            <p
                              style={{
                                fontSize: 10,
                                color: "#9ca3af",
                                margin: 0,
                              }}
                            >
                              {c.desc}
                            </p>
                          </div>
                          {curtainEffect === c.id && (
                            <span
                              style={{
                                fontSize: 14,
                                color: "#ff6b9d",
                                marginLeft: "auto",
                              }}
                            >
                              ✔
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Hiệu ứng rơi — particles */}
                  {effectSubTab === "particles" && (
                    <div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 6,
                        }}
                      >
                        {PARTICLE_PRESETS.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setParticleEffect(p.id);
                              triggerAutosave();
                            }}
                            style={{
                              padding: "10px 8px",
                              borderRadius: 10,
                              border: `2px solid ${particleEffect === p.id ? "#ff6b9d" : "#e5e7eb"}`,
                              background:
                                particleEffect === p.id ? "#fdf2f8" : "#fff",
                              cursor: "pointer",
                              fontSize: 12,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 4,
                              transition: "all 0.15s",
                            }}
                          >
                            <span style={{ fontSize: 20 }}>{p.emoji}</span>
                            <span style={{ fontSize: 10, color: "#374151" }}>
                              {p.label}
                            </span>
                            {particleEffect === p.id && (
                              <span style={{ fontSize: 10, color: "#ff6b9d" }}>
                                ✔
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      <p
                        style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}
                      >
                        Hiệu ứng hiển thị trên thiệp khi khách mở link mời
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* MUSIC TAB — CineLove-style library with categories + play + search */}
              {activeTab === "music" &&
                (() => {
                  const filtered = MUSIC_PRESETS.filter((m) => {
                    if (musicFilter === "vpop" && m.cat !== "vpop")
                      return false;
                    if (musicFilter === "intl" && m.cat !== "intl")
                      return false;
                    if (
                      musicSearch &&
                      !m.label.toLowerCase().includes(musicSearch.toLowerCase())
                    )
                      return false;
                    return true;
                  });

                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {/* Tab categories */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#374151",
                            margin: 0,
                            marginRight: 8,
                          }}
                        >
                          Thư viện nhạc
                        </p>
                      </div>

                      {/* Currently playing */}
                      {musicUrl && (
                        <div
                          style={{
                            padding: "8px 12px",
                            borderRadius: 12,
                            background: "#fdf2f8",
                            border: "1px solid #ff6b9d",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 16 }}>🎵</span>
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#374151",
                                margin: 0,
                              }}
                            >
                              {musicName || "Đã chọn nhạc"}
                            </p>
                            <p
                              style={{
                                fontSize: 9,
                                color: "#9ca3af",
                                margin: 0,
                              }}
                            >
                              Nhạc hiện tại
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setMusicUrl("");
                              setMusicName("");
                              triggerAutosave();
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#dc2626",
                              fontSize: 14,
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Search */}
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: 10,
                            top: 8,
                            fontSize: 12,
                            color: "#9ca3af",
                          }}
                        >
                          🔍
                        </span>
                        <input
                          type="text"
                          placeholder="Tìm kiếm bài hát"
                          value={musicSearch}
                          onChange={(e) => setMusicSearch(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "7px 10px 7px 28px",
                            borderRadius: 20,
                            border: "1px solid #e5e7eb",
                            fontSize: 11,
                            boxSizing: "border-box",
                            background: "#fff",
                          }}
                        />
                      </div>

                      {/* Category tabs */}
                      <div style={{ display: "flex", gap: 6 }}>
                        {[
                          { id: "all" as const, label: "Tất cả" },
                          { id: "intl" as const, label: "Nhạc ngoại" },
                          { id: "vpop" as const, label: "V-POP" },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setMusicFilter(cat.id)}
                            style={{
                              padding: "5px 14px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 600,
                              border: "none",
                              cursor: "pointer",
                              background:
                                musicFilter === cat.id ? "#3b82f6" : "#f3f4f6",
                              color:
                                musicFilter === cat.id ? "#fff" : "#6b7280",
                              transition: "all 0.15s",
                            }}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Song list */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {filtered.map((m) => (
                          <div
                            key={m.id}
                            style={{
                              padding: "8px 10px",
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              background:
                                musicUrl === m.url ? "#fdf2f8" : "transparent",
                              transition: "all 0.1s",
                            }}
                          >
                            {/* Play button */}
                            <button
                              onClick={() => {
                                if (previewId === m.id) {
                                  musicAudioRef.current?.pause();
                                  setPreviewId(null);
                                } else {
                                  if (musicAudioRef.current)
                                    musicAudioRef.current.pause();
                                  musicAudioRef.current = new Audio(m.url);
                                  musicAudioRef.current.play().catch(() => {});
                                  setPreviewId(m.id);
                                }
                              }}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                border: "none",
                                background:
                                  previewId === m.id ? "#3b82f6" : "#f3f4f6",
                                color: previewId === m.id ? "#fff" : "#374151",
                                cursor: "pointer",
                                fontSize: 10,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {previewId === m.id ? "⏸" : "▶"}
                            </button>

                            {/* Song info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: 11,
                                  fontWeight: 500,
                                  color: "#374151",
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {m.label}
                              </p>
                              <p
                                style={{
                                  fontSize: 9,
                                  color: "#9ca3af",
                                  margin: 0,
                                }}
                              >
                                {m.duration}
                              </p>
                            </div>

                            {/* Use button */}
                            <button
                              onClick={() => {
                                setMusicUrl(m.url);
                                setMusicName(m.label);
                                if (musicAudioRef.current) {
                                  musicAudioRef.current.pause();
                                  setPreviewId(null);
                                }
                                triggerAutosave();
                              }}
                              style={{
                                padding: "4px 12px",
                                borderRadius: 16,
                                fontSize: 10,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                flexShrink: 0,
                                background:
                                  musicUrl === m.url ? "#dcfce7" : "#e0f2fe",
                                color:
                                  musicUrl === m.url ? "#16a34a" : "#0369a1",
                              }}
                            >
                              {musicUrl === m.url ? "✓" : "Sử dụng"}
                            </button>
                            {musicUrl === m.url && (
                              <span style={{ fontSize: 10, color: "#16a34a" }}>
                                ✅
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Music widget style picker */}
                      <div
                        style={{
                          borderTop: "1px solid #f0f0f0",
                          paddingTop: 10,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#374151",
                            margin: "0 0 6px",
                          }}
                        >
                          Kiểu nhạc widget
                        </p>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 6,
                          }}
                        >
                          {MUSIC_WIDGET_STYLES.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setMusicWidgetStyle(s.id);
                                triggerAutosave();
                              }}
                              style={{
                                padding: "10px 8px",
                                borderRadius: 10,
                                border:
                                  musicWidgetStyle === s.id
                                    ? "2px solid #3b82f6"
                                    : "2px solid #e5e7eb",
                                background:
                                  musicWidgetStyle === s.id
                                    ? "#eff6ff"
                                    : "#fff",
                                cursor: "pointer",
                                fontSize: 11,
                                fontWeight: 500,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                                transition: "all 0.15s",
                              }}
                            >
                              <span style={{ fontSize: 18 }}>{s.emoji}</span>
                              <span style={{ color: "#374151" }}>
                                {s.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        {/* Widget color picker */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          <input
                            type="color"
                            value={musicWidgetColor}
                            onChange={(e) => {
                              setMusicWidgetColor(e.target.value);
                              triggerAutosave();
                            }}
                            style={{
                              width: 28,
                              height: 28,
                              border: "none",
                              borderRadius: 6,
                              cursor: "pointer",
                            }}
                          />
                          <span style={{ fontSize: 11, color: "#6b7280" }}>
                            Màu widget nhạc
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* COMPONENTS TAB — "Thành phần" section library */}
              {activeTab === "components" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    Thư viện thành phần
                  </p>
                  <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
                    Chèn nhanh các khối nội dung có sẵn
                  </p>

                  {/* Category filter chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    {SECTION_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSectionCat(cat.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          border: "none",
                          background:
                            sectionCat === cat.id ? "#ff6b9d" : "#f3f4f6",
                          color: sectionCat === cat.id ? "#fff" : "#6b7280",
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Section preset cards — 2-column visual grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    {SECTION_PRESETS.filter(
                      (p) => sectionCat === "all" || p.category === sectionCat,
                    ).map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          const rootNodeId = query.node("ROOT").get().data
                            .nodes?.[0];
                          if (!rootNodeId) return;
                          preset.elements.forEach((el) => {
                            let reactEl: React.ReactElement;
                            if (el.type === "text") {
                              const p = el.props as {
                                fontSize?: number;
                                fontFamily?: string;
                                fontWeight?: string;
                                fontStyle?: string;
                                color?: string;
                                textAlign?: string;
                                letterSpacing?: number;
                              };
                              reactEl = (
                                <CraftText
                                  text={el.label}
                                  fontSize={p.fontSize ?? 16}
                                  fontFamily={
                                    p.fontFamily ?? "'Inter', sans-serif"
                                  }
                                  fontWeight={p.fontWeight ?? "normal"}
                                  fontStyle={p.fontStyle ?? "normal"}
                                  color={p.color ?? "#374151"}
                                  textAlign={
                                    (p.textAlign as
                                      | "left"
                                      | "center"
                                      | "right") ?? "center"
                                  }
                                  lineHeight={1.5}
                                  letterSpacing={p.letterSpacing ?? 0}
                                  opacity={1}
                                />
                              );
                            } else if (el.type === "image") {
                              const p = el.props as {
                                objectFit?: string;
                                borderRadius?: number;
                              };
                              reactEl = (
                                <CraftImage
                                  src=""
                                  objectFit={
                                    (p.objectFit as
                                      | "cover"
                                      | "contain"
                                      | "fill") ?? "cover"
                                  }
                                  borderRadius={p.borderRadius ?? 8}
                                  borderWidth={0}
                                  borderColor="transparent"
                                  opacity={1}
                                  shadow={false}
                                />
                              );
                            } else {
                              const p = el.props as {
                                background?: string;
                                padding?: number;
                              };
                              reactEl = (
                                <CraftContainer
                                  background={p.background ?? "#f9fafb"}
                                  padding={p.padding ?? 16}
                                  minHeight={80}
                                  flexDirection="column"
                                  alignItems="flex-start"
                                  justifyContent="flex-start"
                                  gap={8}
                                />
                              );
                            }
                            try {
                              const tree = query
                                .parseReactElement(reactEl)
                                .toNodeTree();
                              actions.addNodeTree(tree, rootNodeId);
                            } catch {
                              /* noop */
                            }
                          });
                          triggerAutosave();
                        }}
                        style={{
                          padding: 0,
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          cursor: "pointer",
                          textAlign: "left",
                          overflow: "hidden",
                          transition: "all 0.15s",
                          display: "flex",
                          flexDirection: "column",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ff6b9d";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(255,107,157,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {/* Visual preview thumbnail — aspect ratio 3:4 */}
                        <div
                          style={{
                            aspectRatio: "3/4",
                            background: preset.previewBg,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            padding: 8,
                          }}
                        >
                          {preset.category === "photo" && (
                            <>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: 3,
                                  width: "100%",
                                }}
                              >
                                {[0, 1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    style={{
                                      height: 28,
                                      background: "rgba(255,255,255,0.45)",
                                      borderRadius: 4,
                                      border: "1px solid rgba(255,255,255,0.6)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 10,
                                    }}
                                  >
                                    🖼
                                  </div>
                                ))}
                              </div>
                              <div
                                style={{
                                  width: "70%",
                                  height: 6,
                                  background: "rgba(255,255,255,0.5)",
                                  borderRadius: 3,
                                }}
                              />
                            </>
                          )}
                          {preset.category === "info" && (
                            <>
                              <div
                                style={{
                                  width: "60%",
                                  height: 7,
                                  background: "rgba(255,255,255,0.7)",
                                  borderRadius: 3,
                                  marginBottom: 2,
                                }}
                              />
                              <div
                                style={{
                                  width: "80%",
                                  height: 5,
                                  background: "rgba(255,255,255,0.5)",
                                  borderRadius: 3,
                                }}
                              />
                              <div
                                style={{
                                  width: "70%",
                                  height: 5,
                                  background: "rgba(255,255,255,0.4)",
                                  borderRadius: 3,
                                }}
                              />
                              <div
                                style={{
                                  width: "50%",
                                  height: 5,
                                  background: "rgba(255,255,255,0.3)",
                                  borderRadius: 3,
                                }}
                              />
                            </>
                          )}
                          {preset.category === "timeline" && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                width: "80%",
                                alignItems: "flex-start",
                              }}
                            >
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: "50%",
                                      background: "rgba(255,255,255,0.9)",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <div
                                    style={{
                                      height: 5,
                                      background: "rgba(255,255,255,0.5)",
                                      borderRadius: 3,
                                      width: `${55 + i * 10}%`,
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {preset.category === "invitation" && (
                            <div
                              style={{
                                width: "75%",
                                height: "60%",
                                border: "2px solid rgba(255,255,255,0.7)",
                                borderRadius: 6,
                                background: "rgba(255,255,255,0.25)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                              }}
                            >
                              <span style={{ fontSize: 16 }}>💌</span>
                              <div
                                style={{
                                  width: "60%",
                                  height: 4,
                                  background: "rgba(255,255,255,0.6)",
                                  borderRadius: 2,
                                }}
                              />
                              <div
                                style={{
                                  width: "45%",
                                  height: 4,
                                  background: "rgba(255,255,255,0.4)",
                                  borderRadius: 2,
                                }}
                              />
                            </div>
                          )}
                          {![
                            "photo",
                            "info",
                            "timeline",
                            "invitation",
                          ].includes(preset.category) && (
                            <div
                              style={{
                                width: "80%",
                                border: "1px solid rgba(255,255,255,0.5)",
                                borderRadius: 6,
                                background: "rgba(255,255,255,0.2)",
                                padding: 8,
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                              }}
                            >
                              <div
                                style={{
                                  width: "50%",
                                  height: 6,
                                  background: "rgba(255,255,255,0.7)",
                                  borderRadius: 3,
                                }}
                              />
                              <div
                                style={{
                                  width: "80%",
                                  height: 4,
                                  background: "rgba(255,255,255,0.4)",
                                  borderRadius: 3,
                                }}
                              />
                              <div
                                style={{
                                  width: "65%",
                                  height: 4,
                                  background: "rgba(255,255,255,0.3)",
                                  borderRadius: 3,
                                }}
                              />
                            </div>
                          )}
                        </div>
                        {/* Card name below thumbnail */}
                        <div style={{ padding: "6px 8px" }}>
                          <p
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#374151",
                              margin: 0,
                              lineHeight: 1.3,
                            }}
                          >
                            {preset.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ Canvas Area — craft.js Frame ══ */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "32px 24px",
            background: "linear-gradient(180deg, #d1d5db 0%, #e5e7eb 100%)",
            position: "relative",
          }}
        >
          {/* ── Floating Element Toolbar ── */}
          {selected && (
            <div
              style={{
                position: "sticky",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: "#1f2937",
                borderRadius: 10,
                padding: "4px 6px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                width: "fit-content",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {/* Element name badge */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#9ca3af",
                  padding: "0 6px",
                  borderRight: "1px solid #374151",
                  marginRight: 2,
                  whiteSpace: "nowrap",
                }}
              >
                {selected.name}
              </span>

              {/* Duplicate */}
              <button
                title="Nhân đôi (Ctrl+D)"
                onClick={() => {
                  try {
                    const freshSerialized = query.serialize();
                    const freshNodes = JSON.parse(freshSerialized);
                    const currentNode = freshNodes[selected.id];
                    if (!currentNode) return;
                    const parentId = currentNode.parent;
                    if (!parentId) return;
                    const tree = query.node(selected.id).toNodeTree();
                    actions.addNodeTree(tree, parentId);
                    triggerAutosave();
                  } catch {
                    /* ignore */
                  }
                }}
                style={floatBtnStyle}
              >
                <Copy size={13} />
              </button>

              {/* Move Up (forward in z-order within parent) */}
              <button
                title="Lên trên"
                onClick={() => {
                  try {
                    const serialized = query.serialize();
                    const nodes = JSON.parse(serialized);
                    const node = nodes[selected.id];
                    if (!node || !node.parent) return;
                    const parent = nodes[node.parent];
                    if (!parent || !parent.nodes) return;
                    const idx = parent.nodes.indexOf(selected.id);
                    if (idx < parent.nodes.length - 1) {
                      actions.move(selected.id, node.parent, idx + 2);
                    }
                  } catch {
                    /* ignore */
                  }
                }}
                style={floatBtnStyle}
              >
                <ArrowUp size={13} />
              </button>

              {/* Move Down (back in z-order) */}
              <button
                title="Xuống dưới"
                onClick={() => {
                  try {
                    const serialized = query.serialize();
                    const nodes = JSON.parse(serialized);
                    const node = nodes[selected.id];
                    if (!node || !node.parent) return;
                    const parent = nodes[node.parent];
                    if (!parent || !parent.nodes) return;
                    const idx = parent.nodes.indexOf(selected.id);
                    if (idx > 0) {
                      actions.move(selected.id, node.parent, idx - 1);
                    }
                  } catch {
                    /* ignore */
                  }
                }}
                style={floatBtnStyle}
              >
                <ArrowDown size={13} />
              </button>

              {/* Divider */}
              <span
                style={{
                  width: 1,
                  height: 18,
                  background: "#374151",
                  margin: "0 2px",
                }}
              />

              {/* Delete */}
              {selected.isDeletable && (
                <button
                  title="Xóa (Delete)"
                  onClick={() => {
                    actions.delete(selected.id);
                    triggerAutosave();
                  }}
                  style={{ ...floatBtnStyle, color: "#f87171" }}
                >
                  <Trash2 size={13} />
                </button>
              )}

              {/* More options "..." */}
              <div style={{ position: "relative" }}>
                <button
                  title="Thêm tùy chọn"
                  onClick={() => setShowMoreMenu((p) => !p)}
                  style={floatBtnStyle}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "#e5e7eb",
                      letterSpacing: 1,
                      lineHeight: 1,
                    }}
                  >
                    •••
                  </span>
                </button>
                {showMoreMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      right: 0,
                      background: "#1f2937",
                      borderRadius: 8,
                      padding: "4px 0",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                      zIndex: 100,
                      minWidth: 160,
                      border: "1px solid #374151",
                    }}
                  >
                    {/* Khóa — UI only */}
                    <button
                      onClick={() => setShowMoreMenu(false)}
                      style={{
                        width: "100%",
                        padding: "7px 14px",
                        background: "none",
                        border: "none",
                        color: "#e5e7eb",
                        fontSize: 12,
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      🔒 Khóa
                    </button>
                    {/* Sao chép kiểu — UI only */}
                    <button
                      onClick={() => setShowMoreMenu(false)}
                      style={{
                        width: "100%",
                        padding: "7px 14px",
                        background: "none",
                        border: "none",
                        color: "#e5e7eb",
                        fontSize: 12,
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      🎨 Sao chép kiểu
                    </button>
                    {/* Đưa lên trước */}
                    <button
                      onClick={() => {
                        try {
                          const serialized = query.serialize();
                          const nodes = JSON.parse(serialized);
                          const node = nodes[selected.id];
                          if (!node || !node.parent) return;
                          const parent = nodes[node.parent];
                          if (!parent || !parent.nodes) return;
                          actions.move(
                            selected.id,
                            node.parent,
                            parent.nodes.length,
                          );
                        } catch {
                          /* ignore */
                        }
                        setShowMoreMenu(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "7px 14px",
                        background: "none",
                        border: "none",
                        color: "#e5e7eb",
                        fontSize: 12,
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      ⬆️ Đưa lên trước
                    </button>
                    {/* Đưa ra sau */}
                    <button
                      onClick={() => {
                        try {
                          const serialized = query.serialize();
                          const nodes = JSON.parse(serialized);
                          const node = nodes[selected.id];
                          if (!node || !node.parent) return;
                          actions.move(selected.id, node.parent, 0);
                        } catch {
                          /* ignore */
                        }
                        setShowMoreMenu(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "7px 14px",
                        background: "none",
                        border: "none",
                        color: "#e5e7eb",
                        fontSize: 12,
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      ⬇️ Đưa ra sau
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {useCustomCanvas ? (
            <EditorContext.Provider value={editorCtx}>
              <CanvasRenderer />
              <CanvasContextMenu />
            </EditorContext.Provider>
          ) : (
            <div
              ref={canvasRef}
              style={{
                width: 390,
                minHeight: 5000,
                margin: "0 auto",
                boxShadow:
                  "0 8px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                borderRadius: 12,
                overflow: "hidden",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.2s ease",
                background: "#fff",
              }}
            >
              {(() => {
                let savedCraftState: string | undefined;
                if (initialCanvasJson) {
                  try {
                    const parsed = JSON.parse(initialCanvasJson);
                    if (parsed.craftState) {
                      savedCraftState =
                        typeof parsed.craftState === "string"
                          ? parsed.craftState
                          : JSON.stringify(parsed.craftState);
                    }
                  } catch {
                    /* fallback */
                  }
                }
                if (savedCraftState) {
                  return <Frame data={savedCraftState} />;
                }
                return (
                  <Frame>
                    <Element
                      canvas
                      is={RootContainer}
                      background={background}
                    ></Element>
                  </Frame>
                );
              })()}
            </div>
          )}

          {/* Zoom Controls Overlay */}
          <div
            style={{
              position: "sticky",
              bottom: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(255,255,255,0.95)",
              borderRadius: 10,
              padding: "4px 8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              marginLeft: "auto",
              marginRight: 12,
              marginTop: -44,
              zIndex: 10,
              width: "fit-content",
            }}
          >
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              title="Thu nhỏ"
              style={{
                width: 28,
                height: 28,
                border: "none",
                borderRadius: 6,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
              }}
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setZoom(100)}
              title="Reset 100%"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#6b7280",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "2px 6px",
                minWidth: 36,
                textAlign: "center",
              }}
            >
              {zoom}%
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              title="Phóng to"
              style={{
                width: 28,
                height: 28,
                border: "none",
                borderRadius: 6,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
              }}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* ══ Right Settings Panel — CineLove accordion style ══ */}
        <div
          style={{
            width: 350,
            background: "#fafafa",
            borderLeft: "1px solid #e5e7eb",
            overflowY: "auto",
            flexShrink: 0,
            boxShadow: "-2px 0 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #f0f0f0",
              background: "linear-gradient(180deg, #fff 0%, #fafafa 100%)",
            }}
          >
            <h3
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
                margin: 0,
                letterSpacing: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✏️ Tuỳ chỉnh
            </h3>
          </div>
          <div style={{ padding: 16 }}>
            {useCustomCanvas ? (
              <EditorContext.Provider value={editorCtx}>
                <CanvasRightPanel />
              </EditorContext.Provider>
            ) : selected ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Element tag — CineLove style */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      background: "#3b82f6",
                      color: "#fff",
                      fontSize: 10,
                      padding: "3px 10px",
                      borderRadius: 4,
                      fontWeight: 600,
                    }}
                  >
                    {selected.name}
                  </span>
                  {selected.isDeletable && (
                    <button
                      onClick={() => {
                        actions.delete(selected.id);
                        triggerAutosave();
                      }}
                      style={{
                        marginLeft: "auto",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14,
                        color: "#dc2626",
                        padding: "2px 6px",
                      }}
                      title="Xóa phần tử"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                {/* Component-specific settings (auto from craft.js related) */}
                {selected.settings && React.createElement(selected.settings)}

                {/* ── CineLove accordion sections ── */}
                <div
                  style={{
                    marginTop: 16,
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: 12,
                  }}
                >
                  {/* Hiệu ứng chuyển động (Entrance animation) */}
                  <AccordionSection title="Hiệu ứng chuyển động" icon="🎬">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {[
                        { id: "none", label: "Không" },
                        { id: "fadeIn", label: "Fade In" },
                        { id: "slideUp", label: "Slide Up" },
                        { id: "slideLeft", label: "Slide Left" },
                        { id: "slideRight", label: "Slide Right" },
                        { id: "scaleIn", label: "Scale In" },
                        { id: "bounceIn", label: "Bounce In" },
                        { id: "flipIn", label: "Flip In" },
                      ].map((a) => {
                        const isActive =
                          (selected?.props?.entranceAnimation ?? "none") ===
                          a.id;
                        return (
                          <button
                            key={a.id}
                            onClick={() => {
                              if (!selected) return;
                              actions.setProp(
                                selected.id,
                                (props: { entranceAnimation: string }) => {
                                  props.entranceAnimation = a.id;
                                },
                              );
                              triggerAutosave();
                            }}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: isActive
                                ? "2px solid #3b82f6"
                                : "1px solid #e5e7eb",
                              background: isActive ? "#eff6ff" : "#fff",
                              cursor: "pointer",
                              fontSize: 11,
                              color: isActive ? "#1d4ed8" : "#374151",
                              textAlign: "left",
                              fontWeight: isActive ? 600 : 400,
                              transition: "all 0.1s",
                            }}
                          >
                            {a.label}
                          </button>
                        );
                      })}
                    </div>
                  </AccordionSection>

                  {/* Chuyển động liên tục */}
                  <AccordionSection title="Chuyển động liên tục" icon="🔄">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {[
                        { id: "none", label: "Không" },
                        { id: "float", label: "Float (lên xuống)" },
                        { id: "pulse", label: "Pulse (nhịp đập)" },
                        { id: "shake", label: "Shake (rung)" },
                        { id: "spin", label: "Spin (xoay)" },
                        { id: "bounce", label: "Bounce (nảy)" },
                      ].map((a) => {
                        const isActive =
                          (selected?.props?.loopAnimation ?? "none") === a.id;
                        return (
                          <button
                            key={a.id}
                            onClick={() => {
                              if (!selected) return;
                              actions.setProp(
                                selected.id,
                                (props: { loopAnimation: string }) => {
                                  props.loopAnimation = a.id;
                                },
                              );
                              triggerAutosave();
                            }}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: isActive
                                ? "2px solid #ff6b9d"
                                : "1px solid #e5e7eb",
                              background: isActive ? "#fdf2f8" : "#fff",
                              cursor: "pointer",
                              fontSize: 11,
                              color: isActive ? "#be185d" : "#374151",
                              textAlign: "left",
                              fontWeight: isActive ? 600 : 400,
                              transition: "all 0.1s",
                            }}
                          >
                            {a.label}
                          </button>
                        );
                      })}
                    </div>
                  </AccordionSection>

                  {/* Liên kết */}
                  <AccordionSection title="Liên kết" icon="🔗">
                    <input
                      type="url"
                      placeholder="https://..."
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 11,
                        boxSizing: "border-box",
                      }}
                    />
                  </AccordionSection>
                </div>
              </div>
            ) : (
              <div style={{ paddingTop: 16 }}>
                <p
                  style={{
                    fontSize: 13,
                    color: "#9ca3af",
                    fontStyle: "italic",
                    textAlign: "center",
                    margin: "0 0 12px",
                  }}
                >
                  Click vào phần tử trên canvas để chỉnh sửa
                </p>

                {/* ── Danh mục dropdown ── */}
                <div style={{ marginBottom: 12 }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#374151",
                      margin: "0 0 6px",
                    }}
                  >
                    Danh mục
                  </p>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                      color: "#374151",
                      background: "#fff",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="wedding">Thiệp cưới</option>
                    <option value="birthday">Thiệp sinh nhật</option>
                    <option value="graduation">Thiệp tốt nghiệp</option>
                    <option value="event">Sự kiện</option>
                    <option value="anniversary">Kỷ niệm</option>
                    <option value="wish">Lời chúc</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* ── Trạng thái dropdown ── */}
                <div style={{ marginBottom: 12 }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#374151",
                      margin: "0 0 6px",
                    }}
                  >
                    Trạng thái
                  </p>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                      color: "#374151",
                      background: "#fff",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="draft">Nháp</option>
                    <option value="public">Công khai</option>
                  </select>
                </div>

                {/* ── Bản xem trước ── */}
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#374151",
                        margin: 0,
                      }}
                    >
                      Bản xem trước
                    </p>
                    <button
                      title="Làm mới ảnh xem trước"
                      onClick={() => {
                        const el = canvasRef.current;
                        if (!el || thumbnailLoading) return;
                        setThumbnailLoading(true);
                        import("html2canvas")
                          .then(({ default: html2canvas }) =>
                            html2canvas(el, {
                              useCORS: true,
                              allowTaint: true,
                              scale: 0.5,
                              width: el.offsetWidth,
                              height: Math.min(el.offsetHeight, 1200),
                              windowWidth: el.offsetWidth,
                              windowHeight: Math.min(el.offsetHeight, 1200),
                            }),
                          )
                          .then((capturedCanvas) => {
                            const thumbCanvas =
                              document.createElement("canvas");
                            const maxW = 200;
                            const ratio = maxW / capturedCanvas.width;
                            thumbCanvas.width = maxW;
                            thumbCanvas.height = Math.round(
                              capturedCanvas.height * ratio,
                            );
                            const ctx = thumbCanvas.getContext("2d");
                            if (ctx) {
                              ctx.drawImage(
                                capturedCanvas,
                                0,
                                0,
                                thumbCanvas.width,
                                thumbCanvas.height,
                              );
                              setThumbnailUrl(
                                thumbCanvas.toDataURL("image/jpeg", 0.8),
                              );
                            }
                          })
                          .catch(() => {
                            /* silently skip */
                          })
                          .finally(() => setThumbnailLoading(false));
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: thumbnailLoading ? "not-allowed" : "pointer",
                        color: thumbnailLoading ? "#9ca3af" : "#3b82f6",
                        padding: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <RefreshCw
                        size={13}
                        style={{
                          animation: thumbnailLoading
                            ? "spin 1s linear infinite"
                            : "none",
                        }}
                      />
                    </button>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 140,
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt="Bản xem trước"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 9,
                        }}
                      />
                    ) : thumbnailLoading ? (
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>
                        Đang tạo ảnh...
                      </span>
                    ) : (
                      <a
                        href={`/i/${projectSlug}`}
                        target="_blank"
                        rel="noopener"
                        style={{
                          fontSize: 11,
                          color: "#3b82f6",
                          textDecoration: "none",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Eye size={24} strokeWidth={1.5} />
                        <span>Lưu để xem ảnh xem trước</span>
                      </a>
                    )}
                  </div>
                  <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                  `}</style>
                </div>

                {/* ── Link thiệp ── */}
                <div style={{ marginBottom: 16 }}>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      margin: "0 0 4px",
                    }}
                  >
                    Link thiệp
                  </p>
                  <a
                    href={`/i/${projectSlug}`}
                    target="_blank"
                    rel="noopener"
                    style={{
                      fontSize: 11,
                      color: "#3b82f6",
                      wordBreak: "break-all",
                      textDecoration: "none",
                    }}
                  >
                    7app.online/i/{projectSlug}
                  </a>
                </div>

                {/* ── Tính năng nâng cao ── */}
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
                    border: "1px solid #fde68a",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#92400e",
                      margin: "0 0 8px",
                    }}
                  >
                    Tính năng nâng cao
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {/* Xóa watermark toggle */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#78350f" }}>
                        Xóa watermark
                      </span>
                      <label
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: 36,
                          height: 20,
                        }}
                      >
                        <input
                          type="checkbox"
                          disabled
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            cursor: "not-allowed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "#d1d5db",
                            borderRadius: 10,
                            transition: "0.2s",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              height: 16,
                              width: 16,
                              left: 2,
                              bottom: 2,
                              background: "#fff",
                              borderRadius: "50%",
                              transition: "0.2s",
                            }}
                          />
                        </span>
                      </label>
                    </div>
                    {/* QR Bank */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#78350f" }}>
                        QR Bank
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          color: "#a16207",
                          background: "#fef3c7",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        PRO
                      </span>
                    </div>
                    {/* Tùy chỉnh tự động cuộn */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#78350f" }}>
                        Tùy chỉnh tự động cuộn
                      </span>
                      <label
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: 36,
                          height: 20,
                        }}
                      >
                        <input
                          type="checkbox"
                          disabled
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            cursor: "not-allowed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "#d1d5db",
                            borderRadius: 10,
                            transition: "0.2s",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              height: 16,
                              width: 16,
                              left: 2,
                              bottom: 2,
                              background: "#fff",
                              borderRadius: "50%",
                              transition: "0.2s",
                            }}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#a16207",
                      margin: "8px 0 0",
                      lineHeight: 1.5,
                    }}
                  >
                    Nâng cấp lên Basic+ để mở khóa tất cả tính năng.
                  </p>
                </div>

                {/* ── Thư viện thiệp toggle — CineLove parity ── */}
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#374151",
                          margin: "0 0 4px",
                        }}
                      >
                        Thư viện thiệp
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: "#9ca3af",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        Cho phép trang này xuất hiện trong thư viện thiệp mẫu để
                        người dùng khác có thể xem.
                      </p>
                    </div>
                    <label
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: 36,
                        height: 20,
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={showInLibrary}
                        onChange={(e) => {
                          setShowInLibrary(e.target.checked);
                          triggerAutosave();
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: showInLibrary ? "#3b82f6" : "#d1d5db",
                          borderRadius: 10,
                          transition: "0.2s",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            height: 16,
                            width: 16,
                            left: showInLibrary ? 18 : 2,
                            bottom: 2,
                            background: "#fff",
                            borderRadius: "50%",
                            transition: "0.2s",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                  {showInLibrary && (
                    <p
                      style={{
                        fontSize: 9,
                        color: "#6b7280",
                        margin: "8px 0 0",
                        lineHeight: 1.4,
                      }}
                    >
                      Khi hiển thị trong thư viện, link sẽ được mã hóa và chỉ
                      cho phép xem, không thể thao tác trực tiếp.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* close content padding wrapper */}
        </div>
      </div>

      {/* ══ Quick Image Replace Bar (CineLove parity) ══ */}
      <QuickImageBar projectId={projectId} onReplace={triggerAutosave} />
    </div>
  );
}

/* ── Quick Image Replace Bar ── */
function QuickImageBar({
  projectId,
  onReplace,
}: {
  projectId: string;
  onReplace: () => void;
}) {
  const { actions, query } = useEditor();
  const replaceRef = useRef<HTMLInputElement>(null);
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null);

  // Scan all nodes for CraftImage components
  const imageNodes = useMemo(() => {
    try {
      const serialized = query.serialize();
      const nodes = JSON.parse(serialized);
      const images: { id: string; src: string }[] = [];
      for (const [id, node] of Object.entries(nodes)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const n = node as any;
        if (n?.type?.resolvedName === "CraftImage" && n?.props?.src) {
          images.push({ id, src: n.props.src });
        }
      }
      return images;
    } catch {
      return [];
    }
  }, [query]);

  const handleReplace = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !targetNodeId) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          actions.setProp(targetNodeId, (props: { src: string }) => {
            props.src = data.url;
          });
          onReplace();
        }
      } catch {
        alert("Upload thất bại");
      }
      e.target.value = "";
      setTargetNodeId(null);
    },
    [targetNodeId, projectId, actions, onReplace],
  );

  if (imageNodes.length === 0) return null;

  return (
    <div
      style={{
        height: 64,
        background: "#fff",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6b7280",
          whiteSpace: "nowrap",
          letterSpacing: 0.5,
        }}
      >
        🖼️ Thay nhanh ({imageNodes.length})
      </span>
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          flex: 1,
          padding: "4px 0",
          scrollbarWidth: "none",
        }}
      >
        {imageNodes.map((img: { id: string; src: string }) => (
          <button
            key={img.id}
            onClick={() => {
              setTargetNodeId(img.id);
              replaceRef.current?.click();
            }}
            title="Click để thay ảnh"
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              border: "2px solid #e5e7eb",
              background: `url(${img.src}) center/cover no-repeat`,
              flexShrink: 0,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#ff6b9d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#e5e7eb")
            }
          >
            <span
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                fontSize: 8,
                textAlign: "center",
                padding: "1px 0",
              }}
            >
              thay
            </span>
          </button>
        ))}
      </div>
      <input
        ref={replaceRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleReplace}
      />
    </div>
  );
}

/* ── Shared styles ── */
const panelLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#6b7280",
  margin: "0 0 8px",
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase",
};

function topBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: disabled ? "#d1d5db" : "#374151",
  };
}

/* ── Floating toolbar button style ── */
const floatBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  border: "none",
  borderRadius: 6,
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#e5e7eb",
  transition: "background 0.1s",
};
