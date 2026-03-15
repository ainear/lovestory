export type StockCategory =
  | "couple"
  | "ceremony"
  | "reception"
  | "decoration"
  | "rings"
  | "flowers";

export interface StockImage {
  url: string;
  thumb: string;
  label: string;
  category: StockCategory;
}

export const STOCK_CATEGORIES: { key: StockCategory | "all"; label: string }[] =
  [
    { key: "all", label: "Tất cả" },
    { key: "couple", label: "Cặp đôi" },
    { key: "ceremony", label: "Lễ cưới" },
    { key: "reception", label: "Tiệc" },
    { key: "decoration", label: "Trang trí" },
    { key: "rings", label: "Nhẫn" },
    { key: "flowers", label: "Hoa" },
  ];

function img(id: string, label: string, category: StockCategory): StockImage {
  return {
    url: `https://images.unsplash.com/photo-${id}?w=600`,
    thumb: `https://images.unsplash.com/photo-${id}?w=120`,
    label,
    category,
  };
}

/* ── Stock image library — 36 curated wedding photos ── */
export const STOCK_IMAGES: StockImage[] = [
  // Couple (6)
  img("1520854221256-17451cc331bf", "Cô dâu chú rể", "couple"),
  img("1478146059778-26028b07395a", "Đôi tay", "couple"),
  img("1529636798458-92182e662485", "Cặp đôi ngoài trời", "couple"),
  img("1519741497674-611481863552", "Khoảnh khắc", "couple"),
  img("1591604466107-ec97de577aff", "Đôi lứa", "couple"),
  img("1544078751-58fee2d8a03b", "Bên nhau", "couple"),

  // Ceremony (6)
  img("1469371670807-013ccf25f16a", "Lễ cưới", "ceremony"),
  img("1511285560929-80b456fea0bc", "Confetti", "ceremony"),
  img("1505236858219-8359eb29e329", "Lễ đường", "ceremony"),
  img("1507003211169-0a1dd7228f2d", "Nghi lễ", "ceremony"),
  img("1545232979-8bf68ee9b1f7", "Lễ ngoài trời", "ceremony"),
  img("1465495976277-4387d4b0b4c6", "Trao lời thề", "ceremony"),

  // Reception (6)
  img("1464366400600-7168b8af9bc3", "Bàn tiệc hoa", "reception"),
  img("1510076857177-7470076d4098", "Bánh cưới", "reception"),
  img("1515934751635-c81c6bc9a2d8", "Nến", "reception"),
  img("1519225421980-715cb0215aed", "Tiệc tối", "reception"),
  img("1470290378698-263fa7ca60ab", "Bàn tiệc ngoài trời", "reception"),
  img("1414235077428-338989a2e8c0", "Buffet cưới", "reception"),

  // Decoration (6)
  img("1550005809-91ad75fb315f", "Hoa lá", "decoration"),
  img("1583939003579-730e3918a45a", "Cổng hoa", "decoration"),
  img("1478827536114-da961b7f86d2", "Trang trí bàn", "decoration"),
  img("1522771739823-7d41e3cf92ba", "Đèn dây", "decoration"),
  img("1467810563316-b5476525c0f8", "Backdrop", "decoration"),
  img("1517457373958-b7bdd4587205", "Lối đi hoa", "decoration"),

  // Rings (6)
  img("1522673607200-164d1b6ce486", "Nhẫn cưới", "rings"),
  img("1515488042361-ee00e0ddd4e4", "Nhẫn kim cương", "rings"),
  img("1573408259828-01onal48f3ab", "Nhẫn đôi", "rings"),
  img("1535632066927-ab7c9ab60908", "Hộp nhẫn", "rings"),
  img("1605100804763-247f67b3557e", "Nhẫn vàng", "rings"),
  img("1546468517-c60a23500a4f", "Nhẫn vintage", "rings"),

  // Flowers (6)
  img("1490750967868-88aa4f44baee", "Hoa cầm tay", "flowers"),
  img("1487530811176-3780de880c2d", "Hoa hồng", "flowers"),
  img("1455659817273-f96807779a8a", "Hoa pastel", "flowers"),
  img("1526047932273-341f2a7631f9", "Hoa cưới trắng", "flowers"),
  img("1487614244868-2c768a8c1570", "Hoa lavender", "flowers"),
  img("1494972308698-b1e25c9b0774", "Bó hoa", "flowers"),
];
