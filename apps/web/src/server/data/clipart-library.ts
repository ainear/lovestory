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
];
