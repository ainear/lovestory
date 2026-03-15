"use client";

import React, { useState } from "react";
import { useNode, UserComponent } from "@craftjs/core";

/* ══════════════════════════════════════════
   CraftSticker — SVG wedding decoration sticker
   CineLove parity: Stock tab decorations
   Renders inline SVG wedding elements (dividers, hearts, rings, floral)
   ══════════════════════════════════════════ */

interface CraftStickerProps {
  stickerId: string;
  color: string;
  size: number;
  opacity: number;
  customSvg?: string;
}

const STICKER_SVGS: Record<
  string,
  { name: string; svg: (color: string) => string }
> = {
  "heart-divider": {
    name: "Heart Divider",
    svg: (c) =>
      `<svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="15" x2="75" y2="15" stroke="${c}" stroke-width="1" opacity="0.4"/><path d="M100 5 C95 0 85 0 85 8 C85 16 100 22 100 22 C100 22 115 16 115 8 C115 0 105 0 100 5Z" fill="${c}"/><line x1="125" y1="15" x2="195" y2="15" stroke="${c}" stroke-width="1" opacity="0.4"/></svg>`,
  },
  "double-hearts": {
    name: "Double Hearts",
    svg: (c) =>
      `<svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg"><path d="M25 10 C22 5 15 5 15 12 C15 19 25 25 25 25 C25 25 35 19 35 12 C35 5 28 5 25 10Z" fill="${c}" opacity="0.7"/><path d="M55 10 C52 5 45 5 45 12 C45 19 55 25 55 25 C55 25 65 19 65 12 C65 5 58 5 55 10Z" fill="${c}" opacity="0.9"/></svg>`,
  },
  rings: {
    name: "Wedding Rings",
    svg: (c) =>
      `<svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="20" r="12" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="52" cy="20" r="12" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="40" cy="8" r="2.5" fill="${c}"/></svg>`,
  },
  "floral-top": {
    name: "Floral Top",
    svg: (c) =>
      `<svg viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg"><path d="M30 35 Q40 15 50 25 Q55 10 65 20 Q75 5 80 20 Q85 5 95 20 Q105 10 110 25 Q120 15 130 35" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.6"/><circle cx="50" cy="22" r="2" fill="${c}" opacity="0.4"/><circle cx="80" cy="15" r="2.5" fill="${c}"/><circle cx="110" cy="22" r="2" fill="${c}" opacity="0.4"/></svg>`,
  },
  "gold-line": {
    name: "Gold Line",
    svg: (c) =>
      `<svg viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="5" x2="190" y2="5" stroke="${c}" stroke-width="1" opacity="0.5"/><circle cx="100" cy="5" r="3" fill="${c}"/><circle cx="85" cy="5" r="1.5" fill="${c}" opacity="0.5"/><circle cx="115" cy="5" r="1.5" fill="${c}" opacity="0.5"/></svg>`,
  },
  "leaf-branch": {
    name: "Leaf Branch",
    svg: (c) =>
      `<svg viewBox="0 0 160 30" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="15" x2="140" y2="15" stroke="${c}" stroke-width="0.8" opacity="0.3"/><ellipse cx="45" cy="11" rx="8" ry="4" fill="${c}" opacity="0.3" transform="rotate(-30 45 11)"/><ellipse cx="65" cy="19" rx="8" ry="4" fill="${c}" opacity="0.35" transform="rotate(30 65 19)"/><ellipse cx="95" cy="11" rx="8" ry="4" fill="${c}" opacity="0.35" transform="rotate(-30 95 11)"/><ellipse cx="115" cy="19" rx="8" ry="4" fill="${c}" opacity="0.3" transform="rotate(30 115 19)"/></svg>`,
  },
  "star-sparkle": {
    name: "Star Sparkle",
    svg: (c) =>
      `<svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg"><polygon points="20,5 22,12 29,12 23,17 25,24 20,19 15,24 17,17 11,12 18,12" fill="${c}" opacity="0.5"/><polygon points="50,3 52.5,11 60,11 54,16 56,24 50,19 44,24 46,16 40,11 47.5,11" fill="${c}" opacity="0.8"/><polygon points="80,5 82,12 89,12 83,17 85,24 80,19 75,24 77,17 71,12 78,12" fill="${c}" opacity="0.5"/></svg>`,
  },
  butterfly: {
    name: "Butterfly",
    svg: (c) =>
      `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"><path d="M30 20 Q15 5 10 15 Q5 25 30 20" fill="${c}" opacity="0.6"/><path d="M30 20 Q45 5 50 15 Q55 25 30 20" fill="${c}" opacity="0.6"/><path d="M30 20 Q18 25 15 32 Q20 35 30 20" fill="${c}" opacity="0.4"/><path d="M30 20 Q42 25 45 32 Q40 35 30 20" fill="${c}" opacity="0.4"/><line x1="30" y1="15" x2="30" y2="25" stroke="${c}" stroke-width="1"/></svg>`,
  },
};

export const STOCK_STICKERS = Object.entries(STICKER_SVGS).map(
  ([id, data]) => ({
    id,
    name: data.name,
  }),
);

export const CraftSticker: UserComponent<CraftStickerProps> = ({
  stickerId,
  color,
  size,
  opacity,
  customSvg,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  // Custom SVG shapes (from Shapes tab)
  if (customSvg) {
    const coloredSvg = customSvg.replace(/currentColor/g, color);
    return (
      <div
        ref={(r) => {
          if (r) connect(drag(r));
        }}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "4px 0",
          opacity,
        }}
        dangerouslySetInnerHTML={{
          __html: coloredSvg.replace(
            "<svg ",
            `<svg width="${size}" height="${size}" `,
          ),
        }}
      />
    );
  }

  const stickerData = STICKER_SVGS[stickerId];
  if (!stickerData)
    return (
      <div
        ref={(r) => {
          if (r) connect(drag(r));
        }}
      >
        ❓
      </div>
    );

  const svgStr = stickerData.svg(color);

  return (
    <div
      ref={(r) => {
        if (r) connect(drag(r));
      }}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "4px 0",
        opacity,
      }}
      dangerouslySetInnerHTML={{
        __html: svgStr.replace(
          "<svg ",
          `<svg width="${size}" height="${size * 0.25}" `,
        ),
      }}
    />
  );
};

function CraftStickerSettings() {
  const {
    actions: { setProp },
    props,
  } = useNode((n) => ({ props: n.data.props as CraftStickerProps }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label style={lbl}>Loại trang trí</label>
      <select
        value={props.stickerId}
        onChange={(e) =>
          setProp((p: CraftStickerProps) => {
            p.stickerId = e.target.value;
          })
        }
        style={inp}
      >
        {Object.entries(STICKER_SVGS).map(([id, data]) => (
          <option key={id} value={id}>
            {data.name}
          </option>
        ))}
      </select>
      <label style={lbl}>Màu sắc</label>
      <input
        type="color"
        value={props.color}
        onChange={(e) =>
          setProp((p: CraftStickerProps) => {
            p.color = e.target.value;
          })
        }
        style={{ ...inp, height: 32, padding: 2 }}
      />
      <label style={lbl}>Kích thước ({props.size}px)</label>
      <input
        type="range"
        min={60}
        max={300}
        value={props.size}
        onChange={(e) =>
          setProp((p: CraftStickerProps) => {
            p.size = +e.target.value;
          })
        }
        style={inp}
      />
      <label style={lbl}>Độ mờ ({Math.round(props.opacity * 100)}%)</label>
      <input
        type="range"
        min={10}
        max={100}
        value={Math.round(props.opacity * 100)}
        onChange={(e) =>
          setProp((p: CraftStickerProps) => {
            p.opacity = +e.target.value / 100;
          })
        }
        style={inp}
      />
    </div>
  );
}

const lbl: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#374151",
};
const inp: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
};

CraftSticker.craft = {
  displayName: "CraftSticker",
  props: {
    stickerId: "heart-divider",
    color: "#d4a574",
    size: 200,
    opacity: 1,
    customSvg: undefined,
  },
  related: { settings: CraftStickerSettings },
};
