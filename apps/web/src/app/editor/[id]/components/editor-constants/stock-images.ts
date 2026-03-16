export type StockCategory =
  | "couple"
  | "ceremony"
  | "reception"
  | "decoration"
  | "rings"
  | "flowers"
  | "backdrop"
  | "food"
  | "detail"
  | "outdoor"
  | "vietnamese";

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
    { key: "backdrop", label: "Phông nền" },
    { key: "food", label: "Ẩm thực" },
    { key: "detail", label: "Chi tiết" },
    { key: "outdoor", label: "Ngoài trời" },
    { key: "vietnamese", label: "Việt Nam" },
  ];

function img(id: string, label: string, category: StockCategory): StockImage {
  return {
    url: `https://images.unsplash.com/photo-${id}?w=600`,
    thumb: `https://images.unsplash.com/photo-${id}?w=120`,
    label,
    category,
  };
}

// TODO: Replace duplicated Unsplash photo IDs with unique ones.
// Some IDs appear in multiple categories. Browse https://unsplash.com/s/photos/wedding
// and replace duplicates with unique photo IDs.
/* ── Stock image library — 120+ curated wedding photos ── */
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

  // ── Expand existing categories (+30) ──

  // Couple (+5)
  img("1546032996-6dfeeede4b55", "Dạo phố", "couple"),
  img("1518049362265-d5b2a6467637", "Nụ hôn", "couple"),
  img("1606216794074-735e91aa2c92", "Tay trong tay", "couple"),
  img("1583939411023-14783179e581", "Couple sunset", "couple"),
  img("1506836467174-27f1042aa48c", "Romantic walk", "couple"),

  // Ceremony (+5)
  img("1519167758481-83f550bb49b3", "Lễ đường hoa", "ceremony"),
  img("1501901609772-df0848060b33", "Lối đi lễ", "ceremony"),
  img("1543262705-2a2e1ba8e72f", "Nghi thức truyền thống", "ceremony"),
  img("1495722801012-1df51c498b49", "Confetti vàng", "ceremony"),
  img("1528823872057-9c018a7a7553", "Lễ nhà thờ", "ceremony"),

  // Reception (+5)
  img("1530103862676-de8c9debad1d", "Champagne toast", "reception"),
  img("1504359200354-042e153cb8d0", "Bàn tiệc rustic", "reception"),
  img("1528823872057-9c018a7a7553", "First dance", "reception"),
  img("1467003909585-2f8a72700288", "Cupcake tiệc", "reception"),
  img("1481391319762-47dff72954d9", "Wine toast", "reception"),

  // Decoration (+5)
  img("1519389950473-47ba0277781c", "Arch hoa", "decoration"),
  img("1457369804613-52c61a468e7d", "Hoa tươi vintage", "decoration"),
  img("1494955870715-979ca4f13bf0", "Trang trí bàn", "decoration"),
  img("1516589178581-95deaec6eb51", "Phong cách boho", "decoration"),
  img("1502082553048-f009c37129b9", "Trang trí ánh sáng", "decoration"),

  // Rings (+5)
  img("1611652022419-a9419f74343d", "Nhẫn cưới vàng hồng", "rings"),
  img("1602173574767-37ac01994b2a", "Nhẫn cưới tối giản", "rings"),
  img("1573408301185-af6a23ce1ed7", "Nhẫn trên hoa", "rings"),
  img("1589674781770-c79e3c0a0c78", "Nhẫn kim cương", "rings"),
  img("1603561591411-07134e71a2a9", "Nhẫn sáng bóng", "rings"),

  // Flowers (+5)
  img("1508610048659-a06b669e3321", "Hoa tươi pastel", "flowers"),
  img("1459411552884-841db9b3cc2a", "Hoa cưới vintage", "flowers"),
  img("1490750967868-88aa4f44baee", "Bouquet trắng", "flowers"),
  img("1518882093-ef8c6e3de0ab", "Hoa mẫu đơn hồng", "flowers"),
  img("1487530811176-3780de880c2d", "Hoa hồng đỏ", "flowers"),

  // ── New categories ──

  // Backdrop (12)
  img("1507525428034-b723cf961d3e", "Bãi biển", "backdrop"),
  img("1501785888108-9e30e23f7722", "Rừng cây", "backdrop"),
  img("1506905925346-21bda4d32df4", "Hoàng hôn", "backdrop"),
  img("1464366400600-7168b8af9bc3", "Sân vườn", "backdrop"),
  img("1502082553048-f009c37129b9", "Thành phố đêm", "backdrop"),
  img("1505142468610-359e7d316be0", "Biệt thự", "backdrop"),
  img("1500835556837-99ac94a94552", "Bờ hồ", "backdrop"),
  img("1470770903676-69b98201ea1c", "Mùa thu", "backdrop"),
  img("1501854140801-50d01698950b", "Đồng cỏ", "backdrop"),
  img("1519167758481-83f550bb49b3", "Vườn hoa", "backdrop"),
  img("1518049362265-d5b2a6467637", "Cổng vào", "backdrop"),
  img("1506836467174-27f1042aa48c", "Đường hoa", "backdrop"),

  // Food (10)
  img("1510076857177-7470076d4098", "Bánh cưới 3 tầng", "food"),
  img("1530103862676-de8c9debad1d", "Champagne", "food"),
  img("1504359200354-042e153cb8d0", "Bàn tiệc", "food"),
  img("1467003909585-2f8a72700288", "Cupcake cưới", "food"),
  img("1414235077428-338989a2e8c0", "Buffet", "food"),
  img("1504674900247-0877df9cc836", "Trái cây tiệc", "food"),
  img("1481391319762-47dff72954d9", "Wine", "food"),
  img("1464349095431-e9a21285b5f3", "Canapé", "food"),
  img("1516559828984-fb3b99548b21", "Dessert table", "food"),
  img("1519869325930-281384150729", "Macaron cưới", "food"),

  // Detail (10)
  img("1517457373958-b7bdd4587205", "Thiệp mời", "detail"),
  img("1522771739823-7d41e3cf92ba", "Phong bì", "detail"),
  img("1535632066927-ab7c9ab60908", "Hộp nhẫn satin", "detail"),
  img("1605100804763-247f67b3557e", "Giày cô dâu", "detail"),
  img("1546468517-c60a23500a4f", "Nước hoa", "detail"),
  img("1522673607200-164d1b6ce486", "Close-up nhẫn", "detail"),
  img("1583939003579-730e3918a45a", "Veil cô dâu", "detail"),
  img("1550005809-91ad75fb315f", "Hair accessory", "detail"),
  img("1478827536114-da961b7f86d2", "Table number", "detail"),
  img("1515934751635-c81c6bc9a2d8", "Nến thơm", "detail"),

  // Outdoor (10)
  img("1507525428034-b723cf961d3e", "Beach wedding", "outdoor"),
  img("1501785888108-9e30e23f7722", "Forest wedding", "outdoor"),
  img("1506905925346-21bda4d32df4", "Golden hour", "outdoor"),
  img("1470770903676-69b98201ea1c", "Autumn garden", "outdoor"),
  img("1501854140801-50d01698950b", "Meadow ceremony", "outdoor"),
  img("1506836467174-27f1042aa48c", "Vineyard", "outdoor"),
  img("1500835556837-99ac94a94552", "Lakeside", "outdoor"),
  img("1505142468610-359e7d316be0", "Villa garden", "outdoor"),
  img("1518049362265-d5b2a6467637", "Mountain view", "outdoor"),
  img("1502082553048-f009c37129b9", "Rooftop", "outdoor"),

  // Vietnamese (12)
  img("1583939411023-14783179e581", "Áo dài đỏ", "vietnamese"),
  img("1606216794074-735e91aa2c92", "Lễ ăn hỏi", "vietnamese"),
  img("1546032996-6dfeeede4b55", "Cô dâu áo dài", "vietnamese"),
  img("1543262705-2a2e1ba8e72f", "Trầu cau", "vietnamese"),
  img("1495722801012-1df51c498b49", "Hoa cưới đỏ", "vietnamese"),
  img("1519167758481-83f550bb49b3", "Cổng hoa truyền thống", "vietnamese"),
  img("1501901609772-df0848060b33", "Lễ rước dâu", "vietnamese"),
  img("1528823872057-9c018a7a7553", "Đám cưới quê", "vietnamese"),
  img("1519389950473-47ba0277781c", "Trang trí cưới VN", "vietnamese"),
  img("1457369804613-52c61a468e7d", "Hoa cưới hồng", "vietnamese"),
  img("1494955870715-979ca4f13bf0", "Cô dâu chú rể VN", "vietnamese"),
  img("1516589178581-95deaec6eb51", "Phông cưới", "vietnamese"),
];
