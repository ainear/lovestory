/**
 * Wedding Clipart Library — CineLove Parity
 * Categories: all, wedding, character, flower, double-happiness, heart
 * Each item has inline SVG content for zero-dependency rendering.
 */

export interface ClipartCategory {
  id: string;
  label: string;
  icon: string;
}

export interface ClipartItem {
  id: string;
  category: string;
  name: string;
  svgContent: string;
}

export const CLIPART_CATEGORIES: ClipartCategory[] = [
  { id: "all", label: "Tất cả", icon: "🎨" },
  { id: "wedding", label: "Yếu tố đám cưới", icon: "💒" },
  { id: "character", label: "Nhân vật", icon: "👤" },
  { id: "flower", label: "Hoa cưới", icon: "🌸" },
  { id: "double-happiness", label: "Chữ hỷ", icon: "囍" },
  { id: "heart", label: "Trái tim", icon: "❤" },
  { id: "decoration", label: "Trang trí", icon: "✨" },
  { id: "vietnamese", label: "Việt Nam", icon: "🏮" },
];

export const CLIPART_ITEMS: ClipartItem[] = [
  // ── Wedding category ──
  {
    id: "wedding-rings",
    category: "wedding",
    name: "Nhẫn cưới",
    svgContent: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="30" r="16" fill="none" stroke="#d4a574" stroke-width="3"/><circle cx="65" cy="30" r="16" fill="none" stroke="#d4a574" stroke-width="3"/><path d="M50 12 l3 -8 l-3 -2 l-3 2 z" fill="#d4a574"/></svg>`,
  },
  {
    id: "wedding-cake",
    category: "wedding",
    name: "Bánh cưới",
    svgContent: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="60" height="20" rx="4" fill="#f8e8d0" stroke="#d4a574" stroke-width="1.5"/><rect x="18" y="38" width="44" height="22" rx="4" fill="#f8e8d0" stroke="#d4a574" stroke-width="1.5"/><rect x="26" y="18" width="28" height="20" rx="4" fill="#f8e8d0" stroke="#d4a574" stroke-width="1.5"/><path d="M40 5 C37 2 33 2 33 6 C33 10 40 14 40 14 C40 14 47 10 47 6 C47 2 43 2 40 5Z" fill="#e8838a"/></svg>`,
  },
  {
    id: "wedding-bells",
    category: "wedding",
    name: "Chuông cưới",
    svgContent: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path d="M30 20 Q30 5 40 5 L40 2 L42 2 L42 5 Q52 5 52 20 L55 50 L27 50 Z" fill="#d4a574" opacity="0.8"/><circle cx="41" cy="53" r="4" fill="#c49660"/><path d="M48 20 Q48 5 58 5 L58 2 L60 2 L60 5 Q70 5 70 20 L73 50 L45 50 Z" fill="#d4a574" opacity="0.9"/><circle cx="59" cy="53" r="4" fill="#c49660"/><path d="M42 3 Q50 -2 60 3" fill="none" stroke="#d4a574" stroke-width="1.5"/><path d="M48 0 Q50 -4 52 0" fill="none" stroke="#d4a574" stroke-width="1"/></svg>`,
  },
  {
    id: "wedding-candle",
    category: "wedding",
    name: "Nến cưới",
    svgContent: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="35" width="20" height="50" rx="2" fill="#f5ebe0" stroke="#d4a574" stroke-width="1"/><path d="M30 35 L30 25" stroke="#333" stroke-width="1"/><ellipse cx="30" cy="20" rx="5" ry="8" fill="#fbbf24" opacity="0.9"/><ellipse cx="30" cy="20" rx="2.5" ry="5" fill="#f97316" opacity="0.7"/><rect x="18" y="58" width="24" height="3" rx="1" fill="#d4a574" opacity="0.5"/></svg>`,
  },
  {
    id: "wedding-dove",
    category: "wedding",
    name: "Chim bồ câu",
    svgContent: `<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg"><path d="M60 30 Q70 15 80 20 Q90 25 75 30 Q85 28 80 35 Q75 42 65 38 Q70 45 60 50 Q50 55 40 50 Q30 45 25 35 Q20 25 30 22 Q40 18 50 25 Z" fill="#e8e8e8" stroke="#bbb" stroke-width="0.8"/><circle cx="70" cy="26" r="1.5" fill="#333"/><path d="M78 27 L82 26 L78 28" fill="#d4a574"/><path d="M25 35 Q15 30 10 35 Q5 40 15 38" fill="#e8e8e8" stroke="#bbb" stroke-width="0.5"/></svg>`,
  },
  {
    id: "wedding-champagne",
    category: "wedding",
    name: "Ly champagne",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30 10 L25 45 Q30 50 35 50 L35 80 L25 85 L45 85 L35 80 L35 50 Q40 50 45 45 L40 10 Z" fill="none" stroke="#d4a574" stroke-width="1.5"/><path d="M55 10 L50 45 Q55 50 60 50 L60 80 L50 85 L70 85 L60 80 L60 50 Q65 50 70 45 L65 10 Z" fill="none" stroke="#d4a574" stroke-width="1.5"/><circle cx="28" cy="5" r="2" fill="#fbbf24" opacity="0.6"/><circle cx="68" cy="7" r="1.5" fill="#fbbf24" opacity="0.5"/><circle cx="50" cy="3" r="1" fill="#fbbf24" opacity="0.4"/></svg>`,
  },
  {
    id: "wedding-arch",
    category: "wedding",
    name: "Cổng hoa",
    svgContent: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="30" width="8" height="60" fill="#d4a574" opacity="0.6"/><rect x="97" y="30" width="8" height="60" fill="#d4a574" opacity="0.6"/><path d="M19 30 Q60 -10 101 30" fill="none" stroke="#6b8e5a" stroke-width="8" stroke-linecap="round"/><circle cx="35" cy="18" r="5" fill="#f9a8d4" opacity="0.7"/><circle cx="60" cy="8" r="6" fill="#f9a8d4" opacity="0.8"/><circle cx="85" cy="18" r="5" fill="#f9a8d4" opacity="0.7"/><circle cx="48" cy="12" r="3.5" fill="#fce7f3" opacity="0.6"/><circle cx="72" cy="12" r="3.5" fill="#fce7f3" opacity="0.6"/></svg>`,
  },

  // ── Character category ──
  {
    id: "char-couple-silhouette",
    category: "character",
    name: "Cặp đôi",
    svgContent: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><circle cx="38" cy="22" r="10" fill="#374151"/><path d="M25 38 Q30 32 38 32 Q46 32 51 38 L55 80 L21 80 Z" fill="#374151"/><circle cx="62" cy="20" r="10" fill="#374151"/><path d="M49 36 Q54 30 62 30 Q70 30 75 36 L79 80 L45 80 Z" fill="#374151"/><path d="M52 55 Q58 40 65 55" fill="none" stroke="#374151" stroke-width="1"/><rect x="20" y="80" width="60" height="3" rx="1.5" fill="#374151" opacity="0.3"/></svg>`,
  },
  {
    id: "char-bride",
    category: "character",
    name: "Cô dâu",
    svgContent: `<svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="20" r="10" fill="#374151"/><path d="M30 18 Q40 5 50 18" fill="none" stroke="#e5e7eb" stroke-width="4"/><path d="M28 35 Q32 28 40 28 Q48 28 52 35 L60 95 L20 95 Z" fill="#e5e7eb" stroke="#d1d5db" stroke-width="0.5"/><path d="M32 95 Q40 110 48 95" fill="#e5e7eb" stroke="#d1d5db" stroke-width="0.5"/><path d="M50 18 Q55 15 58 25 Q62 40 55 50" fill="#e5e7eb" opacity="0.4"/></svg>`,
  },
  {
    id: "char-groom",
    category: "character",
    name: "Chú rể",
    svgContent: `<svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="22" r="10" fill="#374151"/><rect x="30" y="12" width="20" height="5" rx="2" fill="#1f2937"/><path d="M28 38 Q32 30 40 30 Q48 30 52 38 L55 95 L25 95 Z" fill="#1f2937"/><line x1="40" y1="38" x2="40" y2="70" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/><rect x="38" y="38" width="4" height="4" rx="1" fill="#d4a574"/></svg>`,
  },
  {
    id: "char-couple-cute",
    category: "character",
    name: "Cặp đôi dễ thương",
    svgContent: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="30" r="14" fill="#fde68a"/><circle cx="36" cy="28" r="2" fill="#374151"/><circle cx="44" cy="28" r="2" fill="#374151"/><path d="M36 34 Q40 38 44 34" fill="none" stroke="#374151" stroke-width="1"/><path d="M30 48 Q35 42 40 42 Q45 42 50 48 L52 80 L28 80 Z" fill="#3b82f6"/><circle cx="80" cy="30" r="14" fill="#fde68a"/><circle cx="76" cy="28" r="2" fill="#374151"/><circle cx="84" cy="28" r="2" fill="#374151"/><path d="M76 34 Q80 38 84 34" fill="none" stroke="#374151" stroke-width="1"/><path d="M70 48 Q75 42 80 42 Q85 42 90 48 L92 80 L68 80 Z" fill="#ec4899"/><path d="M40 14 Q42 6 48 12" fill="none" stroke="#fde68a" stroke-width="3"/><path d="M80 14 Q78 6 72 12" fill="none" stroke="#fde68a" stroke-width="3"/><path d="M52 60 Q60 50 68 60" fill="none" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="3,2"/></svg>`,
  },
  {
    id: "char-ao-dai",
    category: "character",
    name: "Áo dài truyền thống",
    svgContent: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="22" r="10" fill="#374151"/><path d="M30 35 Q35 28 40 28 Q45 28 50 35 L48 95 L32 95 Z" fill="#dc2626"/><path d="M32 95 L28 105 L52 105 L48 95" fill="#dc2626"/><circle cx="80" cy="22" r="10" fill="#374151"/><path d="M70 35 Q75 28 80 28 Q85 28 90 35 L88 95 L72 95 Z" fill="#1e40af"/><path d="M72 95 L68 105 L92 105 L88 95" fill="#1e40af"/></svg>`,
  },
  {
    id: "char-kiss-silhouette",
    category: "character",
    name: "Nụ hôn",
    svgContent: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path d="M25 20 Q25 5 35 10 Q40 12 42 18 Q44 12 50 10 Q60 5 60 20 Q60 35 42 45 Q25 35 25 20Z" fill="#374151" opacity="0.8"/><path d="M42 18 Q42 25 48 30" fill="none" stroke="#374151" stroke-width="0.5"/></svg>`,
  },

  // ── Flower category ──
  {
    id: "flower-rose",
    category: "flower",
    name: "Hoa hồng",
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="35" r="8" fill="#f9a8d4"/><path d="M32 35 Q28 28 35 25 Q30 20 38 20 Q35 14 42 16 Q45 10 48 16 Q52 14 50 20 Q56 20 52 25 Q58 28 48 35" fill="#f472b6" opacity="0.7"/><path d="M36 43 Q30 55 28 70" stroke="#6b8e5a" stroke-width="2" fill="none"/><ellipse cx="22" cy="55" rx="8" ry="4" fill="#6b8e5a" opacity="0.6" transform="rotate(-40 22 55)"/><ellipse cx="35" cy="60" rx="8" ry="4" fill="#6b8e5a" opacity="0.5" transform="rotate(30 35 60)"/></svg>`,
  },
  {
    id: "flower-bouquet",
    category: "flower",
    name: "Bó hoa",
    svgContent: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><path d="M42 65 L38 110 L62 110 L58 65" fill="#d4a574" opacity="0.5"/><circle cx="50" cy="35" r="10" fill="#f9a8d4"/><circle cx="35" cy="40" r="9" fill="#fda4af"/><circle cx="65" cy="40" r="9" fill="#fda4af"/><circle cx="42" cy="25" r="8" fill="#fce7f3"/><circle cx="58" cy="25" r="8" fill="#fce7f3"/><circle cx="50" cy="50" r="8" fill="#f472b6" opacity="0.7"/><ellipse cx="25" cy="48" rx="10" ry="5" fill="#6b8e5a" opacity="0.5" transform="rotate(-30 25 48)"/><ellipse cx="75" cy="48" rx="10" ry="5" fill="#6b8e5a" opacity="0.5" transform="rotate(30 75 48)"/></svg>`,
  },
  {
    id: "flower-cherry-blossom",
    category: "flower",
    name: "Hoa anh đào",
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><g transform="translate(40,40)"><ellipse cx="0" cy="-12" rx="5" ry="10" fill="#fce7f3" transform="rotate(0)"/><ellipse cx="0" cy="-12" rx="5" ry="10" fill="#fce7f3" transform="rotate(72)"/><ellipse cx="0" cy="-12" rx="5" ry="10" fill="#fce7f3" transform="rotate(144)"/><ellipse cx="0" cy="-12" rx="5" ry="10" fill="#fce7f3" transform="rotate(216)"/><ellipse cx="0" cy="-12" rx="5" ry="10" fill="#fce7f3" transform="rotate(288)"/><circle cx="0" cy="0" r="4" fill="#f472b6"/></g></svg>`,
  },
  {
    id: "flower-lily",
    category: "flower",
    name: "Hoa lily",
    svgContent: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M40 40 Q30 20 20 25 Q10 30 30 40" fill="#fff" stroke="#e5e7eb" stroke-width="0.8"/><path d="M40 40 Q50 20 60 25 Q70 30 50 40" fill="#fff" stroke="#e5e7eb" stroke-width="0.8"/><path d="M40 40 Q35 15 40 10 Q45 15 40 40" fill="#fff" stroke="#e5e7eb" stroke-width="0.8"/><circle cx="40" cy="38" r="3" fill="#fbbf24" opacity="0.6"/><path d="M40 43 L40 90" stroke="#6b8e5a" stroke-width="2"/><ellipse cx="32" cy="65" rx="8" ry="4" fill="#6b8e5a" opacity="0.5" transform="rotate(-35 32 65)"/></svg>`,
  },
  {
    id: "flower-wreath",
    category: "flower",
    name: "Vòng hoa",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="none" stroke="#6b8e5a" stroke-width="3" opacity="0.4"/><circle cx="50" cy="15" r="5" fill="#f9a8d4" opacity="0.8"/><circle cx="80" cy="35" r="4" fill="#fda4af" opacity="0.7"/><circle cx="80" cy="65" r="5" fill="#f9a8d4" opacity="0.8"/><circle cx="50" cy="85" r="4" fill="#fda4af" opacity="0.7"/><circle cx="20" cy="65" r="5" fill="#f9a8d4" opacity="0.8"/><circle cx="20" cy="35" r="4" fill="#fda4af" opacity="0.7"/><ellipse cx="65" cy="22" rx="6" ry="3" fill="#6b8e5a" opacity="0.5" transform="rotate(-45 65 22)"/><ellipse cx="85" cy="50" rx="6" ry="3" fill="#6b8e5a" opacity="0.5" transform="rotate(0 85 50)"/><ellipse cx="65" cy="78" rx="6" ry="3" fill="#6b8e5a" opacity="0.5" transform="rotate(45 65 78)"/><ellipse cx="35" cy="78" rx="6" ry="3" fill="#6b8e5a" opacity="0.5" transform="rotate(-45 35 78)"/><ellipse cx="15" cy="50" rx="6" ry="3" fill="#6b8e5a" opacity="0.5" transform="rotate(0 15 50)"/><ellipse cx="35" cy="22" rx="6" ry="3" fill="#6b8e5a" opacity="0.5" transform="rotate(45 35 22)"/></svg>`,
  },
  {
    id: "flower-corner",
    category: "flower",
    name: "Góc hoa",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 80 Q10 50 30 40 Q50 30 80 0" fill="none" stroke="#6b8e5a" stroke-width="2" opacity="0.5"/><circle cx="15" cy="60" r="6" fill="#f9a8d4" opacity="0.7"/><circle cx="30" cy="42" r="8" fill="#f472b6" opacity="0.6"/><circle cx="50" cy="28" r="5" fill="#fce7f3" opacity="0.8"/><circle cx="65" cy="15" r="6" fill="#f9a8d4" opacity="0.7"/><ellipse cx="8" cy="70" rx="7" ry="3" fill="#6b8e5a" opacity="0.4" transform="rotate(-50 8 70)"/><ellipse cx="42" cy="32" rx="7" ry="3" fill="#6b8e5a" opacity="0.4" transform="rotate(-40 42 32)"/><ellipse cx="70" cy="10" rx="6" ry="3" fill="#6b8e5a" opacity="0.4" transform="rotate(-30 70 10)"/></svg>`,
  },
  {
    id: "flower-sunflower",
    category: "flower",
    name: "Hoa hướng dương",
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><g transform="translate(40,40)"><ellipse cx="0" cy="-14" rx="5" ry="10" fill="#fbbf24" transform="rotate(0)"/><ellipse cx="0" cy="-14" rx="5" ry="10" fill="#fbbf24" transform="rotate(45)"/><ellipse cx="0" cy="-14" rx="5" ry="10" fill="#fbbf24" transform="rotate(90)"/><ellipse cx="0" cy="-14" rx="5" ry="10" fill="#fbbf24" transform="rotate(135)"/><ellipse cx="0" cy="-14" rx="5" ry="10" fill="#fbbf24" transform="rotate(180)"/><ellipse cx="0" cy="-14" rx="5" ry="10" fill="#fbbf24" transform="rotate(225)"/><ellipse cx="0" cy="-14" rx="5" ry="10" fill="#fbbf24" transform="rotate(270)"/><ellipse cx="0" cy="-14" rx="5" ry="10" fill="#fbbf24" transform="rotate(315)"/><circle cx="0" cy="0" r="8" fill="#92400e"/></g></svg>`,
  },

  // ── Double-happiness category ──
  {
    id: "dh-classic",
    category: "double-happiness",
    name: "Chữ Hỷ truyền thống",
    svgContent: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><text x="50" y="60" text-anchor="middle" font-size="60" fill="#dc2626" font-weight="bold" font-family="serif">囍</text></svg>`,
  },
  {
    id: "dh-circle",
    category: "double-happiness",
    name: "Chữ Hỷ tròn",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="42" fill="none" stroke="#dc2626" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="none" stroke="#dc2626" stroke-width="1" opacity="0.4"/><text x="50" y="68" text-anchor="middle" font-size="52" fill="#dc2626" font-weight="bold" font-family="serif">囍</text></svg>`,
  },
  {
    id: "dh-diamond",
    category: "double-happiness",
    name: "Chữ Hỷ kim cương",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="#dc2626" stroke-width="2.5"/><text x="50" y="65" text-anchor="middle" font-size="45" fill="#dc2626" font-weight="bold" font-family="serif">囍</text></svg>`,
  },
  {
    id: "dh-floral",
    category: "double-happiness",
    name: "Chữ Hỷ hoa",
    svgContent: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><text x="60" y="65" text-anchor="middle" font-size="50" fill="#dc2626" font-weight="bold" font-family="serif">囍</text><circle cx="20" cy="20" r="6" fill="#f9a8d4" opacity="0.6"/><circle cx="100" cy="20" r="6" fill="#f9a8d4" opacity="0.6"/><circle cx="20" cy="80" r="5" fill="#f9a8d4" opacity="0.5"/><circle cx="100" cy="80" r="5" fill="#f9a8d4" opacity="0.5"/><ellipse cx="15" cy="30" rx="5" ry="3" fill="#6b8e5a" opacity="0.4" transform="rotate(-30 15 30)"/><ellipse cx="105" cy="30" rx="5" ry="3" fill="#6b8e5a" opacity="0.4" transform="rotate(30 105 30)"/></svg>`,
  },
  {
    id: "dh-lantern",
    category: "double-happiness",
    name: "Đèn lồng Hỷ",
    svgContent: `<svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="5" width="20" height="6" rx="2" fill="#dc2626"/><ellipse cx="40" cy="55" rx="25" ry="40" fill="#dc2626" opacity="0.85"/><text x="40" y="65" text-anchor="middle" font-size="30" fill="#fbbf24" font-weight="bold" font-family="serif">囍</text><line x1="40" y1="95" x2="40" y2="110" stroke="#dc2626" stroke-width="1.5"/><path d="M35 110 Q40 115 45 110" fill="none" stroke="#dc2626" stroke-width="1.5"/></svg>`,
  },
  {
    id: "dh-gold",
    category: "double-happiness",
    name: "Chữ Hỷ vàng",
    svgContent: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="84" height="64" rx="4" fill="none" stroke="#d4a574" stroke-width="2"/><text x="50" y="58" text-anchor="middle" font-size="48" fill="#d4a574" font-weight="bold" font-family="serif">囍</text></svg>`,
  },

  // ── Heart category ──
  {
    id: "heart-simple",
    category: "heart",
    name: "Trái tim đơn giản",
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M40 70 C20 50 5 35 5 22 C5 10 15 5 25 5 C32 5 37 10 40 15 C43 10 48 5 55 5 C65 5 75 10 75 22 C75 35 60 50 40 70Z" fill="#ec4899"/></svg>`,
  },
  {
    id: "heart-outline",
    category: "heart",
    name: "Trái tim viền",
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M40 68 C20 48 5 35 5 22 C5 10 15 5 25 5 C32 5 37 10 40 15 C43 10 48 5 55 5 C65 5 75 10 75 22 C75 35 60 48 40 68Z" fill="none" stroke="#ec4899" stroke-width="2.5"/></svg>`,
  },
  {
    id: "heart-double",
    category: "heart",
    name: "Đôi trái tim",
    svgContent: `<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg"><path d="M30 55 C15 40 5 30 5 20 C5 10 12 5 20 5 C25 5 28 8 30 12 C32 8 35 5 40 5 C48 5 55 10 55 20 C55 30 45 40 30 55Z" fill="#ec4899" opacity="0.7"/><path d="M65 50 C50 35 42 28 42 18 C42 10 48 5 55 5 C60 5 63 8 65 12 C67 8 70 5 75 5 C82 5 88 10 88 18 C88 28 80 35 65 50Z" fill="#ec4899" opacity="0.9"/></svg>`,
  },
  {
    id: "heart-infinity",
    category: "heart",
    name: "Tim vô cực",
    svgContent: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><path d="M60 30 C60 15 45 5 35 5 C20 5 10 15 10 30 C10 45 25 55 60 30 C95 55 110 45 110 30 C110 15 100 5 85 5 C75 5 60 15 60 30Z" fill="none" stroke="#ec4899" stroke-width="2.5"/></svg>`,
  },
  {
    id: "heart-arrow",
    category: "heart",
    name: "Tim mũi tên",
    svgContent: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path d="M50 65 C30 45 15 35 15 22 C15 12 22 7 30 7 C36 7 42 11 50 18 C58 11 64 7 70 7 C78 7 85 12 85 22 C85 35 70 45 50 65Z" fill="#ec4899" opacity="0.8"/><line x1="5" y1="50" x2="95" y2="15" stroke="#374151" stroke-width="1.5"/><polygon points="95,15 85,12 88,22" fill="#374151"/><polygon points="5,50 15,48 8,42" fill="#374151"/></svg>`,
  },
  {
    id: "heart-lock",
    category: "heart",
    name: "Ổ khóa tình yêu",
    svgContent: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M40 75 C25 60 10 50 10 35 C10 22 20 15 30 15 C36 15 40 20 40 25 C40 20 44 15 50 15 C60 15 70 22 70 35 C70 50 55 60 40 75Z" fill="#ec4899"/><path d="M32 8 Q32 0 40 0 Q48 0 48 8 L48 18 L32 18 Z" fill="none" stroke="#d4a574" stroke-width="2.5"/><circle cx="40" cy="42" r="3" fill="#fff"/><line x1="40" y1="45" x2="40" y2="52" stroke="#fff" stroke-width="2"/></svg>`,
  },
  {
    id: "heart-sparkle",
    category: "heart",
    name: "Tim lấp lánh",
    svgContent: `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"><path d="M50 70 C30 50 15 38 15 25 C15 14 23 8 32 8 C38 8 44 12 50 20 C56 12 62 8 68 8 C77 8 85 14 85 25 C85 38 70 50 50 70Z" fill="#ec4899" opacity="0.85"/><polygon points="20,10 21,14 25,14 22,17 23,21 20,18 17,21 18,17 15,14 19,14" fill="#fbbf24" opacity="0.7"/><polygon points="80,5 81,9 85,9 82,12 83,16 80,13 77,16 78,12 75,9 79,9" fill="#fbbf24" opacity="0.6"/><polygon points="90,35 91,38 94,38 92,40 92.5,43 90,41 87.5,43 88,40 86,38 89,38" fill="#fbbf24" opacity="0.5"/></svg>`,
  },

  // ── Decoration category ──
  {
    id: "deco-ribbon",
    category: "decoration",
    name: "Ruy băng",
    svgContent: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M50 15 Q30 5 15 15 Q5 22 15 30 Q30 38 50 28 Q70 38 85 30 Q95 22 85 15 Q70 5 50 15Z" fill="#f9a8d4" stroke="#ec4899" stroke-width="1"/><path d="M15 30 L5 50 L20 40 L25 55 L35 35" fill="#f9a8d4" stroke="#ec4899" stroke-width="0.8"/><path d="M85 30 L95 50 L80 40 L75 55 L65 35" fill="#f9a8d4" stroke="#ec4899" stroke-width="0.8"/></svg>`,
  },
  {
    id: "deco-frame-ornate",
    category: "decoration",
    name: "Khung trang trí",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 Q10 5 15 5 L40 5" fill="none" stroke="#d4a574" stroke-width="2"/><path d="M10 10 Q5 10 5 15 L5 40" fill="none" stroke="#d4a574" stroke-width="2"/><path d="M90 10 Q90 5 85 5 L60 5" fill="none" stroke="#d4a574" stroke-width="2"/><path d="M90 10 Q95 10 95 15 L95 40" fill="none" stroke="#d4a574" stroke-width="2"/><path d="M10 90 Q10 95 15 95 L40 95" fill="none" stroke="#d4a574" stroke-width="2"/><path d="M10 90 Q5 90 5 85 L5 60" fill="none" stroke="#d4a574" stroke-width="2"/><path d="M90 90 Q90 95 85 95 L60 95" fill="none" stroke="#d4a574" stroke-width="2"/><path d="M90 90 Q95 90 95 85 L95 60" fill="none" stroke="#d4a574" stroke-width="2"/><circle cx="10" cy="10" r="3" fill="#d4a574"/><circle cx="90" cy="10" r="3" fill="#d4a574"/><circle cx="10" cy="90" r="3" fill="#d4a574"/><circle cx="90" cy="90" r="3" fill="#d4a574"/></svg>`,
  },
  {
    id: "deco-divider-floral",
    category: "decoration",
    name: "Đường phân cách hoa",
    svgContent: `<svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="15" x2="45" y2="15" stroke="#d4a574" stroke-width="1" opacity="0.6"/><line x1="75" y1="15" x2="115" y2="15" stroke="#d4a574" stroke-width="1" opacity="0.6"/><circle cx="60" cy="15" r="5" fill="#f9a8d4" opacity="0.8"/><circle cx="50" cy="15" r="3" fill="#ec4899" opacity="0.5"/><circle cx="70" cy="15" r="3" fill="#ec4899" opacity="0.5"/><ellipse cx="55" cy="10" rx="4" ry="2" fill="#6b8e5a" opacity="0.5" transform="rotate(-30 55 10)"/><ellipse cx="65" cy="10" rx="4" ry="2" fill="#6b8e5a" opacity="0.5" transform="rotate(30 65 10)"/></svg>`,
  },
  {
    id: "deco-laurel",
    category: "decoration",
    name: "Vòng nguyệt quế",
    svgContent: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path d="M50 75 Q25 65 15 45 Q8 28 15 15" fill="none" stroke="#6b8e5a" stroke-width="1.5"/><path d="M50 75 Q75 65 85 45 Q92 28 85 15" fill="none" stroke="#6b8e5a" stroke-width="1.5"/><ellipse cx="18" cy="22" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(-60 18 22)"/><ellipse cx="16" cy="34" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(-50 16 34)"/><ellipse cx="20" cy="45" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(-35 20 45)"/><ellipse cx="28" cy="55" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(-20 28 55)"/><ellipse cx="38" cy="63" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(-10 38 63)"/><ellipse cx="82" cy="22" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(60 82 22)"/><ellipse cx="84" cy="34" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(50 84 34)"/><ellipse cx="80" cy="45" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(35 80 45)"/><ellipse cx="72" cy="55" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(20 72 55)"/><ellipse cx="62" cy="63" rx="6" ry="3" fill="#6b8e5a" opacity="0.7" transform="rotate(10 62 63)"/></svg>`,
  },
  {
    id: "deco-banner",
    category: "decoration",
    name: "Băng rôn",
    svgContent: `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg"><path d="M5 15 L15 10 L15 40 L5 35 Z" fill="#d4a574" opacity="0.7"/><rect x="15" y="10" width="90" height="30" rx="2" fill="#d4a574" opacity="0.85"/><path d="M105 10 L115 15 L115 35 L105 40 Z" fill="#d4a574" opacity="0.7"/><path d="M5 15 L0 5" stroke="#d4a574" stroke-width="1.5"/><path d="M5 35 L0 45" stroke="#d4a574" stroke-width="1.5"/><path d="M115 15 L120 5" stroke="#d4a574" stroke-width="1.5"/><path d="M115 35 L120 45" stroke="#d4a574" stroke-width="1.5"/></svg>`,
  },
  {
    id: "deco-confetti",
    category: "decoration",
    name: "Confetti",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="10" width="6" height="3" rx="1" fill="#ec4899" transform="rotate(25 15 10)"/><rect x="40" y="5" width="6" height="3" rx="1" fill="#fbbf24" transform="rotate(-15 40 5)"/><rect x="70" y="12" width="6" height="3" rx="1" fill="#6b8e5a" transform="rotate(45 70 12)"/><rect x="85" y="30" width="6" height="3" rx="1" fill="#d4a574" transform="rotate(-30 85 30)"/><circle cx="25" cy="35" r="3" fill="#fbbf24" opacity="0.7"/><circle cx="55" cy="25" r="2.5" fill="#ec4899" opacity="0.6"/><circle cx="80" cy="55" r="3" fill="#6b8e5a" opacity="0.7"/><rect x="10" y="60" width="5" height="3" rx="1" fill="#dc2626" transform="rotate(60 10 60)"/><rect x="50" y="70" width="6" height="3" rx="1" fill="#f9a8d4" transform="rotate(-45 50 70)"/><circle cx="35" cy="80" r="2" fill="#fbbf24" opacity="0.8"/><circle cx="75" cy="75" r="2.5" fill="#ec4899" opacity="0.6"/><rect x="90" y="65" width="5" height="3" rx="1" fill="#d4a574" transform="rotate(20 90 65)"/></svg>`,
  },
  {
    id: "deco-sparkles",
    category: "decoration",
    name: "Tia sáng",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 53,40 80,30 55,48 70,75 50,55 30,75 45,48 20,30 47,40" fill="#fbbf24" opacity="0.85"/><polygon points="20,15 21,22 28,22 23,26 24,33 20,29 16,33 17,26 12,22 19,22" fill="#fbbf24" opacity="0.5"/><polygon points="80,65 81,72 88,72 83,76 84,83 80,79 76,83 77,76 72,72 79,72" fill="#fbbf24" opacity="0.5"/><polygon points="85,10 86,15 90,15 87,17 88,22 85,19 82,22 83,17 80,15 84,15" fill="#fbbf24" opacity="0.4"/></svg>`,
  },
  {
    id: "deco-mandala",
    category: "decoration",
    name: "Hoa văn mandala",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="#d4a574" stroke-width="1" opacity="0.4"/><circle cx="50" cy="50" r="28" fill="none" stroke="#d4a574" stroke-width="1" opacity="0.5"/><circle cx="50" cy="50" r="15" fill="none" stroke="#d4a574" stroke-width="1" opacity="0.6"/><circle cx="50" cy="50" r="5" fill="#d4a574" opacity="0.4"/><ellipse cx="50" cy="20" rx="4" ry="8" fill="#d4a574" opacity="0.3" transform="rotate(0 50 50)"/><ellipse cx="50" cy="20" rx="4" ry="8" fill="#d4a574" opacity="0.3" transform="rotate(45 50 50)"/><ellipse cx="50" cy="20" rx="4" ry="8" fill="#d4a574" opacity="0.3" transform="rotate(90 50 50)"/><ellipse cx="50" cy="20" rx="4" ry="8" fill="#d4a574" opacity="0.3" transform="rotate(135 50 50)"/><ellipse cx="50" cy="20" rx="4" ry="8" fill="#d4a574" opacity="0.3" transform="rotate(180 50 50)"/><ellipse cx="50" cy="20" rx="4" ry="8" fill="#d4a574" opacity="0.3" transform="rotate(225 50 50)"/><ellipse cx="50" cy="20" rx="4" ry="8" fill="#d4a574" opacity="0.3" transform="rotate(270 50 50)"/><ellipse cx="50" cy="20" rx="4" ry="8" fill="#d4a574" opacity="0.3" transform="rotate(315 50 50)"/></svg>`,
  },

  // ── Wedding category (expanded) ──
  {
    id: "wedding-bouquet-toss",
    category: "wedding",
    name: "Tung bó hoa",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="30" r="8" fill="#f9a8d4"/><circle cx="40" cy="25" r="7" fill="#fda4af"/><circle cx="60" cy="25" r="7" fill="#fda4af"/><circle cx="45" cy="18" r="6" fill="#fce7f3"/><circle cx="55" cy="18" r="6" fill="#fce7f3"/><path d="M45 38 L42 60 L58 60 L55 38" fill="#6b8e5a" opacity="0.6"/><path d="M42 60 L38 65 L62 65 L58 60" fill="#d4a574" opacity="0.5"/><path d="M50 65 Q55 75 60 80" stroke="#d4a574" stroke-width="1" fill="none" stroke-dasharray="2,2"/><path d="M50 65 Q45 75 40 80" stroke="#d4a574" stroke-width="1" fill="none" stroke-dasharray="2,2"/><circle cx="65" cy="85" r="3" fill="#f9a8d4" opacity="0.4"/><circle cx="35" cy="88" r="2.5" fill="#fda4af" opacity="0.4"/></svg>`,
  },
  {
    id: "wedding-shoes",
    category: "wedding",
    name: "Giày cưới",
    svgContent: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M15 45 Q15 30 25 28 L40 25 L42 35 Q50 38 55 45 Z" fill="#fce7f3" stroke="#d4a574" stroke-width="1"/><path d="M55 45 L15 45 Q12 45 12 48 L12 50 L58 50 L58 48 Q58 45 55 45Z" fill="#d4a574" opacity="0.6"/><circle cx="38" cy="30" r="2" fill="#ec4899" opacity="0.5"/><path d="M55 45 Q55 30 65 28 L80 25 L82 35 Q90 38 95 45 Z" fill="#fce7f3" stroke="#d4a574" stroke-width="1" transform="translate(0,0) scale(-1,1) translate(-140,0)"/><path d="M55 45 L95 45 Q98 45 98 48 L98 50 L52 50 L52 48 Q52 45 55 45Z" fill="#d4a574" opacity="0.6"/><circle cx="72" cy="30" r="2" fill="#ec4899" opacity="0.5"/></svg>`,
  },
  {
    id: "wedding-invitation-scroll",
    category: "wedding",
    name: "Cuộn thiệp",
    svgContent: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="15" width="44" height="65" rx="2" fill="#fef3c7" stroke="#d4a574" stroke-width="1.5"/><ellipse cx="40" cy="15" rx="24" ry="5" fill="#f5ebe0" stroke="#d4a574" stroke-width="1"/><ellipse cx="40" cy="80" rx="24" ry="5" fill="#f5ebe0" stroke="#d4a574" stroke-width="1"/><line x1="26" y1="30" x2="54" y2="30" stroke="#d4a574" stroke-width="0.8" opacity="0.4"/><line x1="26" y1="38" x2="54" y2="38" stroke="#d4a574" stroke-width="0.8" opacity="0.4"/><line x1="26" y1="46" x2="54" y2="46" stroke="#d4a574" stroke-width="0.8" opacity="0.4"/><line x1="26" y1="54" x2="45" y2="54" stroke="#d4a574" stroke-width="0.8" opacity="0.4"/><path d="M40 62 C38 59 35 59 35 61 C35 63 40 66 40 66 C40 66 45 63 45 61 C45 59 42 59 40 62Z" fill="#ec4899" opacity="0.6"/></svg>`,
  },
  {
    id: "wedding-garland",
    category: "wedding",
    name: "Dây hoa",
    svgContent: `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg"><path d="M5 10 Q30 40 60 25 Q90 10 115 35" fill="none" stroke="#6b8e5a" stroke-width="2" opacity="0.5"/><circle cx="20" cy="22" r="5" fill="#f9a8d4" opacity="0.7"/><circle cx="40" cy="30" r="4" fill="#fda4af" opacity="0.6"/><circle cx="60" cy="25" r="5" fill="#f9a8d4" opacity="0.7"/><circle cx="80" cy="20" r="4" fill="#fce7f3" opacity="0.7"/><circle cx="100" cy="28" r="5" fill="#f9a8d4" opacity="0.7"/><ellipse cx="30" cy="28" rx="5" ry="2.5" fill="#6b8e5a" opacity="0.4" transform="rotate(20 30 28)"/><ellipse cx="50" cy="28" rx="5" ry="2.5" fill="#6b8e5a" opacity="0.4" transform="rotate(-15 50 28)"/><ellipse cx="70" cy="22" rx="5" ry="2.5" fill="#6b8e5a" opacity="0.4" transform="rotate(10 70 22)"/><ellipse cx="90" cy="25" rx="5" ry="2.5" fill="#6b8e5a" opacity="0.4" transform="rotate(-20 90 25)"/></svg>`,
  },

  // ── Heart category (expanded) ──
  {
    id: "heart-initials",
    category: "heart",
    name: "Tim có chữ cái",
    svgContent: `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"><path d="M50 80 C25 55 5 40 5 25 C5 12 15 5 27 5 C35 5 43 10 50 20 C57 10 65 5 73 5 C85 5 95 12 95 25 C95 40 75 55 50 80Z" fill="#ec4899" opacity="0.8"/><text x="35" y="52" font-size="22" fill="#fff" font-weight="bold" font-family="serif">A</text><text x="48" y="48" font-size="12" fill="#fbbf24" font-family="serif">&amp;</text><text x="58" y="52" font-size="22" fill="#fff" font-weight="bold" font-family="serif">B</text></svg>`,
  },
  {
    id: "heart-wreath",
    category: "heart",
    name: "Vòng hoa tim",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 75 C30 55 15 45 15 30 C15 18 23 12 33 12 C40 12 46 16 50 24 C54 16 60 12 67 12 C77 12 85 18 85 30 C85 45 70 55 50 75Z" fill="none" stroke="#ec4899" stroke-width="2"/><circle cx="33" cy="12" r="4" fill="#f9a8d4" opacity="0.6"/><circle cx="67" cy="12" r="4" fill="#f9a8d4" opacity="0.6"/><circle cx="15" cy="30" r="3.5" fill="#fda4af" opacity="0.6"/><circle cx="85" cy="30" r="3.5" fill="#fda4af" opacity="0.6"/><circle cx="20" cy="48" r="4" fill="#f9a8d4" opacity="0.6"/><circle cx="80" cy="48" r="4" fill="#f9a8d4" opacity="0.6"/><circle cx="30" cy="62" r="3.5" fill="#fda4af" opacity="0.6"/><circle cx="70" cy="62" r="3.5" fill="#fda4af" opacity="0.6"/><ellipse cx="24" cy="38" rx="5" ry="2.5" fill="#6b8e5a" opacity="0.4" transform="rotate(-50 24 38)"/><ellipse cx="76" cy="38" rx="5" ry="2.5" fill="#6b8e5a" opacity="0.4" transform="rotate(50 76 38)"/></svg>`,
  },
  {
    id: "heart-wings",
    category: "heart",
    name: "Tim có cánh",
    svgContent: `<svg viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg"><path d="M70 55 C55 40 45 32 45 22 C45 14 50 10 56 10 C61 10 66 14 70 20 C74 14 79 10 84 10 C90 10 95 14 95 22 C95 32 85 40 70 55Z" fill="#ec4899"/><path d="M45 28 Q30 15 15 20 Q5 24 10 32 Q15 40 30 35 Q20 30 18 22 Q25 12 38 22" fill="#e5e7eb" stroke="#d1d5db" stroke-width="0.5"/><path d="M45 32 Q32 22 20 28 Q12 32 16 38 Q22 45 35 40 Q25 38 24 30 Q30 22 42 30" fill="#e5e7eb" stroke="#d1d5db" stroke-width="0.5" opacity="0.7"/><path d="M95 28 Q110 15 125 20 Q135 24 130 32 Q125 40 110 35 Q120 30 122 22 Q115 12 102 22" fill="#e5e7eb" stroke="#d1d5db" stroke-width="0.5"/><path d="M95 32 Q108 22 120 28 Q128 32 124 38 Q118 45 105 40 Q115 38 116 30 Q110 22 98 30" fill="#e5e7eb" stroke="#d1d5db" stroke-width="0.5" opacity="0.7"/></svg>`,
  },
  // ── Vietnamese premium assets (Sprint 3C) ──
  {
    id: "vn-lantern-red",
    category: "vietnamese",
    name: "Đèn lồng đỏ",
    svgContent: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><path d="M30 8 L20 12 L12 30 L12 60 L20 78 L30 82 L40 78 L48 60 L48 30 L40 12 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1"/><path d="M15 35 Q30 28 45 35" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.6"/><path d="M13 45 Q30 38 47 45" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.6"/><path d="M13 55 Q30 48 47 55" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.6"/><path d="M15 65 Q30 58 45 65" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.6"/><text x="30" y="52" text-anchor="middle" font-size="14" fill="#fbbf24" font-weight="bold" font-family="serif">囍</text><line x1="30" y1="5" x2="30" y2="1" stroke="#c49660" stroke-width="2"/><path d="M26 1 L34 1" stroke="#c49660" stroke-width="2" stroke-linecap="round"/><path d="M30 82 L28 92 L32 92 L30 82" fill="#fbbf24" opacity="0.8"/></svg>`,
  },
  {
    id: "vn-lantern-pair",
    category: "vietnamese",
    name: "Đèn lồng cặp",
    svgContent: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><path d="M25 10 L17 14 L10 28 L10 55 L17 68 L25 72 L33 68 L40 55 L40 28 L33 14 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1"/><text x="25" y="45" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="bold" font-family="serif">囍</text><path d="M25 72 L24 80 L26 80" fill="#fbbf24" opacity="0.7"/><path d="M95 10 L87 14 L80 28 L80 55 L87 68 L95 72 L103 68 L110 55 L110 28 L103 14 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1"/><text x="95" y="45" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="bold" font-family="serif">囍</text><path d="M95 72 L94 80 L96 80" fill="#fbbf24" opacity="0.7"/><path d="M25 5 L25 1 M22 1 L28 1" stroke="#c49660" stroke-width="1.5" stroke-linecap="round"/><path d="M95 5 L95 1 M92 1 L98 1" stroke="#c49660" stroke-width="1.5" stroke-linecap="round"/><path d="M40 15 Q60 8 80 15" fill="none" stroke="#c49660" stroke-width="1.5" stroke-dasharray="3,2"/></svg>`,
  },
  {
    id: "vn-lotus",
    category: "vietnamese",
    name: "Hoa sen",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 70 Q35 55 30 40 Q28 28 38 25 Q45 22 50 30 Q55 22 62 25 Q72 28 70 40 Q65 55 50 70Z" fill="#f9a8d4" opacity="0.9"/><path d="M50 70 Q20 60 15 42 Q12 28 25 24 Q35 20 45 32" fill="#fda4af" opacity="0.7"/><path d="M50 70 Q80 60 85 42 Q88 28 75 24 Q65 20 55 32" fill="#fda4af" opacity="0.7"/><path d="M50 70 Q10 68 8 50 Q6 35 20 32 Q32 29 42 40" fill="#fce7f3" opacity="0.5"/><path d="M50 70 Q90 68 92 50 Q94 35 80 32 Q68 29 58 40" fill="#fce7f3" opacity="0.5"/><ellipse cx="50" cy="52" rx="10" ry="6" fill="#fbbf24" opacity="0.5"/><path d="M50 70 L50 88" stroke="#6b8e5a" stroke-width="2.5" stroke-linecap="round"/><path d="M40 80 Q35 75 50 75 Q65 75 60 80" fill="#6b8e5a" opacity="0.4"/></svg>`,
  },
  {
    id: "vn-chu-phuc",
    category: "vietnamese",
    name: "Chữ phúc",
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="70" height="70" rx="8" fill="#dc2626" opacity="0.9"/><rect x="10" y="10" width="60" height="60" rx="6" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.5"/><text x="40" y="58" text-anchor="middle" font-size="44" fill="#fbbf24" font-weight="bold" font-family="serif">福</text></svg>`,
  },
  {
    id: "vn-double-happiness-premium",
    category: "vietnamese",
    name: "Chữ hỷ đôi cao cấp",
    svgContent: `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="116" height="76" rx="8" fill="#dc2626" opacity="0.95"/><rect x="6" y="6" width="108" height="68" rx="6" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.6"/><text x="60" y="59" text-anchor="middle" font-size="52" fill="#fbbf24" font-weight="bold" font-family="serif">囍</text><path d="M15 15 L20 10 L20 15 M100 15 L105 10 L105 15" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.4"/><path d="M15 65 L20 70 L20 65 M100 65 L105 70 L105 65" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.4"/></svg>`,
  },
  {
    id: "vn-phoenix-dragon",
    category: "vietnamese",
    name: "Long phụng",
    svgContent: `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 60 Q20 40 35 45 Q45 50 40 35 Q38 25 50 20 Q58 16 55 28 Q52 38 60 32 Q70 26 75 35 Q80 44 70 50 Q60 55 65 65" fill="none" stroke="#d4a574" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="60" r="3" fill="#d4a574"/><path d="M50 20 L46 14 L52 16 M58 16 L60 10 L55 14" fill="#d4a574" opacity="0.7"/><path d="M110 60 Q100 40 85 45 Q75 50 80 35 Q82 25 70 20 Q62 16 65 28 Q68 38 60 32 Q50 26 45 35" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/><circle cx="110" cy="60" r="3" fill="#dc2626"/><path d="M70 20 L74 14 L68 16 M62 16 L60 10 L65 14" fill="#dc2626" opacity="0.7"/><text x="60" y="70" text-anchor="middle" font-size="9" fill="#c49660" font-family="serif" opacity="0.6">Long Phụng</text></svg>`,
  },
  {
    id: "vn-hoa-mai",
    category: "vietnamese",
    name: "Hoa mai vàng",
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 85 L48 60 Q40 55 30 58 Q38 50 36 40 Q44 46 50 42 Q56 46 64 40 Q62 50 70 58 Q60 55 52 60 Z" fill="#6b8e5a" opacity="0.7"/><path d="M50 5 C50 22 50 22 50 22" stroke="#6b8e5a" stroke-width="0" fill="none"/><g transform="translate(50,32)"><polygon points="0,-12 3.5,-4 12,-4 5.5,2 8,10 0,5 -8,10 -5.5,2 -12,-4 -3.5,-4" fill="#fbbf24" opacity="0.9"/></g><g transform="translate(30,40)"><polygon points="0,-10 3,-3.5 10,-3.5 4.5,1.5 6.5,9 0,4.5 -6.5,9 -4.5,1.5 -10,-3.5 -3,-3.5" fill="#fbbf24" opacity="0.85"/></g><g transform="translate(70,40)"><polygon points="0,-10 3,-3.5 10,-3.5 4.5,1.5 6.5,9 0,4.5 -6.5,9 -4.5,1.5 -10,-3.5 -3,-3.5" fill="#fbbf24" opacity="0.85"/></g><g transform="translate(38,60)"><polygon points="0,-9 2.5,-3 9,-3 4,1.5 6,8 0,4 -6,8 -4,1.5 -9,-3 -2.5,-3" fill="#fbbf24" opacity="0.8"/></g><g transform="translate(62,60)"><polygon points="0,-9 2.5,-3 9,-3 4,1.5 6,8 0,4 -6,8 -4,1.5 -9,-3 -2.5,-3" fill="#fbbf24" opacity="0.8"/></g></svg>`,
  },
  {
    id: "vn-wedding-gate",
    category: "vietnamese",
    name: "Cổng cưới truyền thống",
    svgContent: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="40" width="10" height="55" fill="#c49660" rx="2"/><rect x="102" y="40" width="10" height="55" fill="#c49660" rx="2"/><path d="M8 45 Q60 5 112 45" fill="#dc2626" stroke="#991b1b" stroke-width="2"/><path d="M12 50 Q60 15 108 50" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.5"/><rect x="5" y="35" width="110" height="10" rx="3" fill="#dc2626"/><rect x="5" y="35" width="110" height="5" rx="3" fill="#c49660" opacity="0.5"/><path d="M40 40 Q60 10 80 40" fill="#dc2626" opacity="0.4"/><text x="60" y="38" text-anchor="middle" font-size="10" fill="#fbbf24" font-family="serif" font-weight="bold">囍</text><path d="M30 95 L30 65 Q60 55 90 65 L90 95" fill="none" stroke="#c49660" stroke-width="1.5" opacity="0.4"/></svg>`,
  },
  {
    id: "vn-five-fruits",
    category: "vietnamese",
    name: "Mâm ngũ quả",
    svgContent: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="68" rx="42" ry="8" fill="#c49660" opacity="0.4"/><rect x="15" y="62" width="70" height="6" rx="3" fill="#d4a574" opacity="0.6"/><circle cx="50" cy="45" r="12" fill="#dc2626" opacity="0.9"/><circle cx="32" cy="52" r="10" fill="#f97316" opacity="0.85"/><circle cx="68" cy="52" r="10" fill="#f97316" opacity="0.85"/><circle cx="22" cy="60" r="9" fill="#16a34a" opacity="0.8"/><circle cx="78" cy="60" r="9" fill="#fbbf24" opacity="0.85"/><path d="M50 33 L50 28 Q52 24 48 20" stroke="#6b8e5a" stroke-width="1.5" fill="none"/><path d="M32 42 L30 37 Q32 33 28 30" stroke="#6b8e5a" stroke-width="1.2" fill="none"/><path d="M68 42 L70 37 Q68 33 72 30" stroke="#6b8e5a" stroke-width="1.2" fill="none"/></svg>`,
  },
  {
    id: "vn-banana-blossom",
    category: "vietnamese",
    name: "Hoa chuối",
    svgContent: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M40 10 L40 80" stroke="#6b8e5a" stroke-width="3" stroke-linecap="round"/><path d="M40 25 Q55 20 58 30 Q55 38 40 35" fill="#dc2626" opacity="0.8"/><path d="M40 38 Q55 33 58 43 Q55 51 40 48" fill="#dc2626" opacity="0.75"/><path d="M40 51 Q55 46 58 56 Q55 64 40 61" fill="#9f1239" opacity="0.7"/><path d="M40 64 Q55 59 58 69 Q55 77 40 74" fill="#9f1239" opacity="0.65"/><path d="M40 25 Q25 20 22 30 Q25 38 40 35" fill="#fda4af" opacity="0.7"/><path d="M40 38 Q25 33 22 43 Q25 51 40 48" fill="#fda4af" opacity="0.65"/><path d="M40 5 Q42 2 40 0 Q38 2 40 5" fill="#fbbf24" opacity="0.7"/></svg>`,
  },
  {
    id: "vn-ao-dai-couple",
    category: "vietnamese",
    name: "Cặp áo dài",
    svgContent: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="15" r="9" fill="#fef3c7"/><path d="M24 28 Q30 22 35 22 Q40 22 46 28 L50 65 L30 70 L20 65 Z" fill="#dc2626"/><path d="M30 70 L22 95 M50 65 L45 95" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/><path d="M20 65 L18 72" stroke="#dc2626" stroke-width="3"/><path d="M50 65 L52 72" stroke="#dc2626" stroke-width="3"/><circle cx="65" cy="15" r="9" fill="#fef3c7"/><path d="M54 28 Q60 22 65 22 Q70 22 76 28 L82 65 L62 68 L52 65 Z" fill="#ec4899" opacity="0.9"/><path d="M62 68 L56 95 M82 65 L78 95" stroke="#ec4899" stroke-width="4" stroke-linecap="round" opacity="0.9"/><path d="M52 65 L50 72" stroke="#ec4899" stroke-width="3" opacity="0.9"/><path d="M82 65 L84 72" stroke="#ec4899" stroke-width="3" opacity="0.9"/><path d="M64 8 Q65 4 68 3" stroke="#c49660" stroke-width="1" fill="none"/></svg>`,
  },
  {
    id: "vn-floral-border",
    category: "vietnamese",
    name: "Viền hoa cưới",
    svgContent: `<svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="15" x2="115" y2="15" stroke="#d4a574" stroke-width="0.8" opacity="0.4"/><g transform="translate(15,15)"><circle cx="0" cy="0" r="4" fill="#f9a8d4" opacity="0.8"/><circle cx="0" cy="0" r="2" fill="#ec4899"/></g><g transform="translate(35,15)"><circle cx="0" cy="0" r="4" fill="#f9a8d4" opacity="0.8"/><circle cx="0" cy="0" r="2" fill="#ec4899"/></g><g transform="translate(60,15)"><circle cx="0" cy="0" r="5" fill="#fbbf24" opacity="0.7"/><circle cx="0" cy="0" r="2.5" fill="#d97706"/></g><g transform="translate(85,15)"><circle cx="0" cy="0" r="4" fill="#f9a8d4" opacity="0.8"/><circle cx="0" cy="0" r="2" fill="#ec4899"/></g><g transform="translate(105,15)"><circle cx="0" cy="0" r="4" fill="#f9a8d4" opacity="0.8"/><circle cx="0" cy="0" r="2" fill="#ec4899"/></g><ellipse cx="25" cy="15" rx="5" ry="2" fill="#6b8e5a" opacity="0.35" transform="rotate(15 25 15)"/><ellipse cx="47" cy="15" rx="5" ry="2" fill="#6b8e5a" opacity="0.35" transform="rotate(-20 47 15)"/><ellipse cx="73" cy="15" rx="5" ry="2" fill="#6b8e5a" opacity="0.35" transform="rotate(15 73 15)"/><ellipse cx="95" cy="15" rx="5" ry="2" fill="#6b8e5a" opacity="0.35" transform="rotate(-15 95 15)"/></svg>`,
  },
];
