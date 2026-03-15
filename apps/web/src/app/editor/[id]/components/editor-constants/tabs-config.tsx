import React from "react";
import {
  Type,
  Image as ImageIcon,
  Palette,
  Music,
  Sparkles,
  LayoutTemplate,
  Grid,
  Flower2,
  Pentagon,
} from "lucide-react";

export interface TabConfig {
  key: string;
  icon: React.ReactNode;
  label: string;
}

/* ── Tab config (CineLove parity: 10 tabs) ── */
export const TABS: TabConfig[] = [
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
