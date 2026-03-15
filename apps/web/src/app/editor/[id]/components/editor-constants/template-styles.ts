export interface TemplateStyle {
  name: string;
  bg: string;
  textColor: string;
  font: string;
  desc: string;
  tier: "FREE" | "BASIC" | "PREMIUM";
  views: number;
  uses: number;
}

/* ── Template style presets ── */
export const TEMPLATE_STYLES: TemplateStyle[] = [
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
