"use client";
import { TEMPLATE_UNIQUE_PRESETS } from "@/server/data/template-presets";
import { convertTemplateToCanvas } from "../[id]/components/canvas-engine/convertTemplate";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";

// ════════════════════════════════════════════════
// Sprint 55: Self-hosted — no more CDN proxy
const TEMPLATE_IMG_DIR = "/templates/";

/** Cinelove slug → long_thumbnail path (from templates.json) */
const CINELOVE_BG: Record<string, string> = {
  // ── Top Wedding (sorted by usage) ──
  "thiep-cuoi-42":
    "templates/long_thumbnail/5731de59-c0f3-4fa7-9860-e5e47b829ce3.webp",
  "thiep-cuoi-39":
    "templates/long_thumbnail/a2f11727-8717-46db-ada4-ff29271ce53b.webp",
  "thiep-cuoi-46":
    "templates/long_thumbnail/efd815e3-41ff-4eb3-b31b-c25b202bc08c_1762512003.webp",
  "thiep-cuoi-38":
    "templates/long_thumbnail/7e64b0eb-9b5b-497f-b09e-3d3024571dfa.webp",
  "thiep-cuoi-36":
    "templates/long_thumbnail/e554cdff-72d4-4657-863a-68cf83b61fe3.webp",
  "thiep-cuoi-44":
    "templates/long_thumbnail/0189eb35-5cf1-4525-a8d0-867f70e0bf67.webp",
  "thiep-cuoi-40":
    "templates/long_thumbnail/cbe1c609-0b73-42f5-8d29-81404f0c5bfe.webp",
  "thiep-cuoi-16":
    "templates/long_thumbnail/8d4b8ad3-0d91-4cba-9e16-e5c2de3275b4.webp",
  "thiep-cuoi-47":
    "templates/long_thumbnail/6c40c8a5-5ead-4723-abff-bcb98f19d403_1762676162.webp",
  "thiep-cuoi-48":
    "templates/long_thumbnail/77a0f81e-67af-4f30-91b6-73c5e5ce6aea_1763195257.webp",
  "thiep-cuoi-19":
    "templates/long_thumbnail/26ead6d0-bed0-4e61-877b-901b18aab1df.webp",
  "thiep-cuoi-tone-xanh":
    "templates/long_thumbnail/c6238e18-d92b-4eea-ba14-3fe832517e62_1762512018.webp",
  "thiep-cuoi-2": "templates/long_thumbnail/c9e80a57234fb12dd764.webp",
  "thiep-cuoi-5": "templates/long_thumbnail/bdc44f064724f87aa135.webp",
  "thiep-cuoi-23":
    "templates/long_thumbnail/5913a014-9fc0-4a7d-aa73-31416a84d0b7.webp",
  "thiep-cuoi-8":
    "templates/long_thumbnail/9afa4639-e512-4490-8a28-def233513413.webp",
  "thiep-cuoi-53":
    "templates/long_thumbnail/a038df05-e9a9-408e-bd48-3cd7a239bbc4_1767931340.webp",
  "thiep-cuoi-28":
    "templates/long_thumbnail/248881a1-7da2-4232-b69b-c39d393f0b91.webp",
  "thiep-cuoi-11":
    "templates/long_thumbnail/1bf25163-6f28-4430-a67a-553274c679ea.webp",
  "thiep-cuoi-49":
    "templates/long_thumbnail/314cf592-7bb3-4067-aeb0-e259db6b6c31_1765806090.webp",
  "thiep-cuoi-1": "templates/long_thumbnail/f4b65e20983dd71aa541.webp",
  "thiep-cuoi-17":
    "templates/long_thumbnail/47b0118b-1f91-4622-8061-f7002f6d5aaf.webp",
  "thiep-cuoi-56":
    "templates/long_thumbnail/428a253a-0bb7-412b-8861-ec12c5f06582_1770022452.webp",
  "thiep-cuoi-52":
    "templates/long_thumbnail/6b90e268-6745-48d2-95dc-6d0e5fc22981_1765795744.webp",
  "thiep-cuoi-12":
    "templates/long_thumbnail/128f51ee-4b37-4f6f-92c7-8629673d3d3c.webp",
  "thiep-bw-1":
    "templates/long_thumbnail/416b30bd-bedf-44ab-b0b8-63d1530b968d.webp",
  "thiep-cuoi-43":
    "templates/long_thumbnail/5f9854a9-b3fc-48f1-b486-885200a457b0.webp",
  "thiep-cuoi-21":
    "templates/long_thumbnail/8ebb5aec-e2dc-4ac3-b3e6-400beff173c8.webp",
  "thiep-cuoi-7":
    "templates/long_thumbnail/5a508f27-c1b9-442f-8a28-2aaf51016367.webp",
  "thiep-cuoi-31":
    "templates/long_thumbnail/d9094782-edf0-4a6c-935d-6c0c8c85ec16.webp",
  "thiep-cuoi-30":
    "templates/long_thumbnail/2297df1e-b0f2-451d-b381-8484df3d954a.webp",
  "thiep-cuoi-4": "templates/long_thumbnail/6b427ff42d4d9c13c55c.webp",
  "thiep-cuoi-14":
    "templates/long_thumbnail/9e12caf2-8536-4533-9510-7e6f1d2bb580.webp",
  "thiep-cuoi-15":
    "templates/long_thumbnail/4b4ae2bf-1cbb-454f-97e6-ad18347e260f.webp",
  "thiep-cuoi-3": "templates/long_thumbnail/f7d2dc3e258994d7cd98.webp",
  "thiep-cuoi-55":
    "templates/long_thumbnail/3a1be50a-fb53-4fe8-a4a1-49f42bdad909_1768714525.webp",
  "thiep-cuoi-10":
    "templates/long_thumbnail/d563e157-0ce9-45ca-886d-c51597654b9e.webp",
  "thiep-cuoi-50":
    "templates/long_thumbnail/e0c6fead-4264-4160-96ec-41453a44f49d_1765806349.webp",
  "thiep-cuoi-24":
    "templates/long_thumbnail/3c9d5f5c-f064-4ce7-92e5-9b041af1ff16.webp",
  "thiep-cuoi-18":
    "templates/long_thumbnail/d75f03f4-0fcb-4e48-936f-87b60a521019.webp",
  "thiep-cuoi-41":
    "templates/long_thumbnail/cc9e76d5-6930-429d-afef-eb273b60486f.webp",
  "thiep-cuoi-57":
    "templates/long_thumbnail/d0b50b46-aeb0-4787-950d-2ad16e95ed6b_1770798662.webp",
  "thiep-cuoi-37":
    "templates/long_thumbnail/fde6b6bf-7a58-4854-a605-8b894541235d.webp",
  "thiep-cuoi-6": "templates/long_thumbnail/a7d21c98b350e46ff982.webp",
  "thiep-cuoi-32":
    "templates/long_thumbnail/fbacc9af-425f-4eff-8d9d-1bd3e5b31d7b.webp",
  "thiep-cuoi-34":
    "templates/long_thumbnail/8575bc5c-a8fb-4db1-9196-eda871e6c9f2.webp",
  "thiep-cuoi-20":
    "templates/long_thumbnail/950b4ce8-b6d1-42b4-9873-5b365b980e5a.webp",
  "thiep-cuoi-35":
    "templates/long_thumbnail/58730a4f-39c9-40e8-9895-0f1ca52b6d19.webp",
  "thiep-cuoi-9":
    "templates/long_thumbnail/5d72210e-4b00-4051-a353-e625bb04d021.webp",
  "thiep-cuoi-33":
    "templates/long_thumbnail/97315700-6655-4e8c-9e39-4fcc2dd58e5a.webp",
  "thiep-cuoi-22":
    "templates/long_thumbnail/93687287-5077-4522-a0ac-1400ee724ce2.webp",
  "thiep-cuoi-25":
    "templates/long_thumbnail/9457be2d-7b5a-47d5-a9cb-0614576116c1.webp",
  "thiep-cuoi-54":
    "templates/long_thumbnail/9108532d-cae0-4229-89c0-3be4c04b472f_1770022563.webp",
  "thiep-cuoi-60":
    "templates/long_thumbnail/6e37afe3-3ba2-42a3-8c39-350a7d492d22_1772556864.webp",
  "thiep-cuoi-13":
    "templates/long_thumbnail/d40913ef-e700-4ed3-8670-36b0ddbd9db0.webp",
  "thiep-cuoi-26":
    "templates/long_thumbnail/1858d9e4-acc2-4bdd-a4c5-cc40fbc557ea.webp",
  "thiep-cuoi-29":
    "templates/long_thumbnail/e76cd240-fdb9-4726-bfd3-3dd5bc1d0eee.webp",
  "thiep-cuoi-27":
    "templates/long_thumbnail/f541d1cf-4104-479a-857c-a1f13456eb30.webp",
  // ── Birthday (6) ──
  "thiep-sinh-nhat-01":
    "templates/long_thumbnail/24ee195b-972f-4679-9b99-e8eed392932d.webp",
  "thiep-sinh-nhat-06":
    "templates/long_thumbnail/1745ba59-703d-4c2a-9f10-f18fa1dfe932.webp",
  "thiep-sinh-nhat-05":
    "templates/long_thumbnail/cc8a0656-b177-440c-b815-021a57cd9d57.webp",
  "thiep-sinh-nhat-02":
    "templates/long_thumbnail/5058a82f-e399-43c5-af6a-c373adc7d541.webp",
  "thiep-sinh-nhat-04":
    "templates/long_thumbnail/a7ed865c-d572-44f9-9fa7-eaf968af4b05.webp",
  "thiep-sinh-nhat-03":
    "templates/long_thumbnail/1e592af3-aaac-4709-b3cf-3001564b15c5.webp",
  // ── Graduation (3) ──
  "thiep-tot-nghiep-1":
    "templates/long_thumbnail/b576bcf6-abdf-428e-a002-18787cdfab8c.webp",
  "thiep-tot-nghiep-3":
    "templates/long_thumbnail/c77202cd-13db-4545-b4d1-61a48b238649.webp",
  "thiep-tot-nghiep-2":
    "templates/long_thumbnail/b2adc2a9-1542-4623-9379-df3d5407d093.webp",
  // ── Events (8) ──
  "thiep-ky-yeu-mau1":
    "templates/long_thumbnail/2d3f9e31-6be4-46b5-a815-5fd2a9b568cf_1770022514.webp",
  "thiep-ky-yeu-mau2":
    "templates/long_thumbnail/f4ce10de-7695-4976-bceb-10caf599d06d_1770022535.webp",
  "thiep-tan-gia-1":
    "templates/long_thumbnail/b4fd3107-f6d1-4714-b210-8295623db669_1765805653.webp",
  "thiep-tan-gia-2":
    "templates/long_thumbnail/7927269f-331e-4379-990d-4892553c357b_1765805621.webp",
  "thiep-valentine-1":
    "templates/long_thumbnail/61381a9c-7aee-4dc2-8451-6c82e649afdc_1770867338.webp",
  "tiec-tat-nien-3":
    "templates/long_thumbnail/f6f8612f-470c-4bb7-85a8-31fe1f25b65b_1768715117.webp",
  "thiep-tat-nien-4":
    "templates/long_thumbnail/bb722b44-e4f9-4253-801d-7a31bcaa81bb_1770022483.webp",
  "tiec-tat-nien-1":
    "templates/long_thumbnail/b9e8dafd-a1f5-446d-b716-ed382ff4f250_1765805585.webp",
};

/**
 * ════════════════════════════════════════════════════
 *  6 RICH TEMPLATE PRESET FAMILIES (Cinelove-style)
 *  Each: ~15 elements = 3 images + 10 text + 2 deco
 * ════════════════════════════════════════════════════
 */

type TemplateElement = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  animation: { entrance: string; loop: string };
  props: Record<string, unknown>;
};

/** ① Romantic Pink — pastel pink, flowers, elegant serif */
const ROMANTIC_PINK: TemplateElement[] = [
  {
    id: "img-main",
    type: "image",
    x: 45,
    y: 20,
    width: 300,
    height: 220,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 16,
      borderWidth: 3,
      borderColor: "#f9a8d4",
    },
  },
  {
    id: "img-groom",
    type: "image",
    x: 30,
    y: 560,
    width: 150,
    height: 180,
    rotation: -3,
    opacity: 1,
    zIndex: 2,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#fda4af",
    },
  },
  {
    id: "img-bride",
    type: "image",
    x: 210,
    y: 560,
    width: 150,
    height: 180,
    rotation: 3,
    opacity: 1,
    zIndex: 3,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#fda4af",
    },
  },
  {
    id: "deco-top",
    type: "text",
    x: 20,
    y: 250,
    width: 350,
    height: 30,
    rotation: 0,
    opacity: 0.6,
    zIndex: 4,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "━━━━  ✿  ━━━━",
      fontSize: 14,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#f472b6",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-invite",
    type: "text",
    x: 20,
    y: 280,
    width: 350,
    height: 36,
    rotation: 0,
    opacity: 0.95,
    zIndex: 5,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Trân trọng kính mời",
      fontSize: 15,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#9f1239",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-names",
    type: "text",
    x: 10,
    y: 316,
    width: 370,
    height: 75,
    rotation: 0,
    opacity: 1,
    zIndex: 6,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh\n&\nThuỳ Linh",
      fontSize: 32,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "italic",
      color: "#831843",
      textAlign: "center",
      lineHeight: 1.15,
    },
  },
  {
    id: "deco-mid",
    type: "text",
    x: 20,
    y: 396,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.5,
    zIndex: 7,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "❀ ━━━━━━━━━━━━ ❀",
      fontSize: 12,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#fb7185",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-family",
    type: "text",
    x: 20,
    y: 424,
    width: 350,
    height: 48,
    rotation: 0,
    opacity: 0.9,
    zIndex: 8,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Cùng gia đình hai bên\nân hạnh kính mời quý khách",
      fontSize: 13,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#6b2140",
      textAlign: "center",
      lineHeight: 1.6,
    },
  },
  {
    id: "txt-date-label",
    type: "text",
    x: 20,
    y: 478,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.7,
    zIndex: 9,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "VÀO NGÀY",
      fontSize: 11,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#9f1239",
      textAlign: "center",
      lineHeight: 1.2,
    },
  },
  {
    id: "txt-date",
    type: "text",
    x: 20,
    y: 498,
    width: 350,
    height: 44,
    rotation: 0,
    opacity: 1,
    zIndex: 10,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Chủ Nhật, 28 · 05 · 2026",
      fontSize: 22,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#831843",
      textAlign: "center",
      lineHeight: 1.2,
    },
  },
  {
    id: "txt-time",
    type: "text",
    x: 20,
    y: 540,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.85,
    zIndex: 11,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Lúc 10:00 sáng",
      fontSize: 15,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#9f1239",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-groom-name",
    type: "text",
    x: 30,
    y: 745,
    width: 150,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 12,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh",
      fontSize: 16,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#831843",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-bride-name",
    type: "text",
    x: 210,
    y: 745,
    width: 150,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 13,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Thuỳ Linh",
      fontSize: 16,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#831843",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-venue",
    type: "text",
    x: 20,
    y: 790,
    width: 350,
    height: 50,
    rotation: 0,
    opacity: 0.9,
    zIndex: 14,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "📍 Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM",
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#6b2140",
      textAlign: "center",
      lineHeight: 1.5,
    },
  },
];

/** ② Luxury Dark — navy/black, gold accents, premium feel */
const LUXURY_DARK: TemplateElement[] = [
  {
    id: "img-main",
    type: "image",
    x: 45,
    y: 20,
    width: 300,
    height: 240,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "#d4a574",
    },
  },
  {
    id: "img-groom",
    type: "image",
    x: 30,
    y: 580,
    width: 150,
    height: 170,
    rotation: 0,
    opacity: 1,
    zIndex: 2,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#b8860b",
    },
  },
  {
    id: "img-bride",
    type: "image",
    x: 210,
    y: 580,
    width: 150,
    height: 170,
    rotation: 0,
    opacity: 1,
    zIndex: 3,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#b8860b",
    },
  },
  {
    id: "deco-top",
    type: "text",
    x: 20,
    y: 270,
    width: 350,
    height: 28,
    rotation: 0,
    opacity: 0.5,
    zIndex: 4,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "╍╍╍╍  ◆  ╍╍╍╍",
      fontSize: 13,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#d4a574",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-invite",
    type: "text",
    x: 20,
    y: 298,
    width: 350,
    height: 36,
    rotation: 0,
    opacity: 0.9,
    zIndex: 5,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "TRÂN TRỌNG KÍNH MỜI",
      fontSize: 13,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#d4a574",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-names",
    type: "text",
    x: 10,
    y: 334,
    width: 370,
    height: 75,
    rotation: 0,
    opacity: 1,
    zIndex: 6,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh\n&\nThuỳ Linh",
      fontSize: 34,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "bold",
      fontStyle: "italic",
      color: "#fef3c7",
      textAlign: "center",
      lineHeight: 1.15,
    },
  },
  {
    id: "deco-mid",
    type: "text",
    x: 20,
    y: 414,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.4,
    zIndex: 7,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "◇ ╍╍╍╍╍╍╍╍╍╍╍╍ ◇",
      fontSize: 11,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#b8860b",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-family",
    type: "text",
    x: 20,
    y: 440,
    width: 350,
    height: 48,
    rotation: 0,
    opacity: 0.85,
    zIndex: 8,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Cùng gia đình hai bên\nân hạnh kính mời quý khách",
      fontSize: 13,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#e5c890",
      textAlign: "center",
      lineHeight: 1.6,
    },
  },
  {
    id: "txt-date",
    type: "text",
    x: 20,
    y: 500,
    width: 350,
    height: 44,
    rotation: 0,
    opacity: 1,
    zIndex: 10,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Chủ Nhật, 28 · 05 · 2026",
      fontSize: 22,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#fef3c7",
      textAlign: "center",
      lineHeight: 1.2,
    },
  },
  {
    id: "txt-time",
    type: "text",
    x: 20,
    y: 544,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.85,
    zIndex: 11,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Lúc 10:00 sáng",
      fontSize: 15,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#d4a574",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-groom-name",
    type: "text",
    x: 30,
    y: 755,
    width: 150,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 12,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh",
      fontSize: 16,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "bold",
      fontStyle: "italic",
      color: "#fef3c7",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-bride-name",
    type: "text",
    x: 210,
    y: 755,
    width: 150,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 13,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Thuỳ Linh",
      fontSize: 16,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "bold",
      fontStyle: "italic",
      color: "#fef3c7",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-venue",
    type: "text",
    x: 20,
    y: 795,
    width: 350,
    height: 46,
    rotation: 0,
    opacity: 0.85,
    zIndex: 14,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "📍 Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM",
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#d4a574",
      textAlign: "center",
      lineHeight: 1.5,
    },
  },
];

/** ③ Classic White — clean, minimal, timeless */
const CLASSIC_WHITE: TemplateElement[] = [
  {
    id: "img-main",
    type: "image",
    x: 55,
    y: 25,
    width: 280,
    height: 210,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#d1d5db",
    },
  },
  {
    id: "img-groom",
    type: "image",
    x: 40,
    y: 565,
    width: 140,
    height: 170,
    rotation: 0,
    opacity: 1,
    zIndex: 2,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
  },
  {
    id: "img-bride",
    type: "image",
    x: 210,
    y: 565,
    width: 140,
    height: 170,
    rotation: 0,
    opacity: 1,
    zIndex: 3,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
  },
  {
    id: "deco-top",
    type: "text",
    x: 20,
    y: 245,
    width: 350,
    height: 28,
    rotation: 0,
    opacity: 0.4,
    zIndex: 4,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "───────  ♡  ───────",
      fontSize: 12,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#9ca3af",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-invite",
    type: "text",
    x: 20,
    y: 275,
    width: 350,
    height: 36,
    rotation: 0,
    opacity: 0.9,
    zIndex: 5,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Trân trọng kính mời",
      fontSize: 15,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#374151",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-names",
    type: "text",
    x: 10,
    y: 312,
    width: 370,
    height: 75,
    rotation: 0,
    opacity: 1,
    zIndex: 6,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh\n&\nThuỳ Linh",
      fontSize: 32,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#111827",
      textAlign: "center",
      lineHeight: 1.15,
    },
  },
  {
    id: "deco-mid",
    type: "text",
    x: 20,
    y: 392,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.35,
    zIndex: 7,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "♡ ─────────────── ♡",
      fontSize: 11,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#9ca3af",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-family",
    type: "text",
    x: 20,
    y: 420,
    width: 350,
    height: 48,
    rotation: 0,
    opacity: 0.85,
    zIndex: 8,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Cùng gia đình hai bên\nân hạnh kính mời quý khách",
      fontSize: 13,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#4b5563",
      textAlign: "center",
      lineHeight: 1.6,
    },
  },
  {
    id: "txt-date",
    type: "text",
    x: 20,
    y: 480,
    width: 350,
    height: 44,
    rotation: 0,
    opacity: 1,
    zIndex: 10,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Chủ Nhật, 28 · 05 · 2026",
      fontSize: 22,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#111827",
      textAlign: "center",
      lineHeight: 1.2,
    },
  },
  {
    id: "txt-time",
    type: "text",
    x: 20,
    y: 524,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.8,
    zIndex: 11,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Lúc 10:00 sáng",
      fontSize: 15,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#6b7280",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-groom-name",
    type: "text",
    x: 40,
    y: 740,
    width: 140,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 12,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh",
      fontSize: 16,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#111827",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-bride-name",
    type: "text",
    x: 210,
    y: 740,
    width: 140,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 13,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Thuỳ Linh",
      fontSize: 16,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#111827",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-venue",
    type: "text",
    x: 20,
    y: 785,
    width: 350,
    height: 50,
    rotation: 0,
    opacity: 0.85,
    zIndex: 14,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "📍 Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM",
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#6b7280",
      textAlign: "center",
      lineHeight: 1.5,
    },
  },
];

/** ④ Traditional Red — Vietnamese wedding, red & gold */
const TRADITIONAL_RED: TemplateElement[] = [
  {
    id: "img-main",
    type: "image",
    x: 45,
    y: 20,
    width: 300,
    height: 230,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 12,
      borderWidth: 3,
      borderColor: "#fbbf24",
    },
  },
  {
    id: "img-groom",
    type: "image",
    x: 30,
    y: 570,
    width: 150,
    height: 175,
    rotation: -2,
    opacity: 1,
    zIndex: 2,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#f59e0b",
    },
  },
  {
    id: "img-bride",
    type: "image",
    x: 210,
    y: 570,
    width: 150,
    height: 175,
    rotation: 2,
    opacity: 1,
    zIndex: 3,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#f59e0b",
    },
  },
  {
    id: "deco-top",
    type: "text",
    x: 20,
    y: 260,
    width: 350,
    height: 28,
    rotation: 0,
    opacity: 0.7,
    zIndex: 4,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "═══════  囍  ═══════",
      fontSize: 14,
      fontFamily: "'Georgia', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#dc2626",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-invite",
    type: "text",
    x: 20,
    y: 290,
    width: 350,
    height: 36,
    rotation: 0,
    opacity: 0.95,
    zIndex: 5,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Trân Trọng Kính Mời",
      fontSize: 16,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#991b1b",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-names",
    type: "text",
    x: 10,
    y: 326,
    width: 370,
    height: 75,
    rotation: 0,
    opacity: 1,
    zIndex: 6,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh\n&\nThuỳ Linh",
      fontSize: 34,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "italic",
      color: "#7f1d1d",
      textAlign: "center",
      lineHeight: 1.15,
    },
  },
  {
    id: "deco-mid",
    type: "text",
    x: 20,
    y: 406,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.6,
    zIndex: 7,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "♦ ═══════════════ ♦",
      fontSize: 12,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#dc2626",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-family",
    type: "text",
    x: 20,
    y: 434,
    width: 350,
    height: 48,
    rotation: 0,
    opacity: 0.9,
    zIndex: 8,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Cùng gia đình hai bên\nân hạnh kính mời quý khách",
      fontSize: 13,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#7f1d1d",
      textAlign: "center",
      lineHeight: 1.6,
    },
  },
  {
    id: "txt-date",
    type: "text",
    x: 20,
    y: 496,
    width: 350,
    height: 44,
    rotation: 0,
    opacity: 1,
    zIndex: 10,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Chủ Nhật, 28 · 05 · 2026",
      fontSize: 22,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#7f1d1d",
      textAlign: "center",
      lineHeight: 1.2,
    },
  },
  {
    id: "txt-time",
    type: "text",
    x: 20,
    y: 540,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.85,
    zIndex: 11,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Lúc 10:00 sáng",
      fontSize: 15,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#991b1b",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-groom-name",
    type: "text",
    x: 30,
    y: 750,
    width: 150,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 12,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh",
      fontSize: 16,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#7f1d1d",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-bride-name",
    type: "text",
    x: 210,
    y: 750,
    width: 150,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 13,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Thuỳ Linh",
      fontSize: 16,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#7f1d1d",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-venue",
    type: "text",
    x: 20,
    y: 795,
    width: 350,
    height: 46,
    rotation: 0,
    opacity: 0.9,
    zIndex: 14,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "📍 Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM",
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#7f1d1d",
      textAlign: "center",
      lineHeight: 1.5,
    },
  },
];

/** ⑤ Nature Green — botanical, sage green, organic */
const NATURE_GREEN: TemplateElement[] = [
  {
    id: "img-main",
    type: "image",
    x: 45,
    y: 25,
    width: 300,
    height: 215,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 20,
      borderWidth: 3,
      borderColor: "#86efac",
    },
  },
  {
    id: "img-groom",
    type: "image",
    x: 35,
    y: 565,
    width: 145,
    height: 175,
    rotation: -2,
    opacity: 1,
    zIndex: 2,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 14,
      borderWidth: 2,
      borderColor: "#a7f3d0",
    },
  },
  {
    id: "img-bride",
    type: "image",
    x: 215,
    y: 565,
    width: 145,
    height: 175,
    rotation: 2,
    opacity: 1,
    zIndex: 3,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 14,
      borderWidth: 2,
      borderColor: "#a7f3d0",
    },
  },
  {
    id: "deco-top",
    type: "text",
    x: 20,
    y: 250,
    width: 350,
    height: 28,
    rotation: 0,
    opacity: 0.55,
    zIndex: 4,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "─── 🌿 ───",
      fontSize: 14,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#22c55e",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-invite",
    type: "text",
    x: 20,
    y: 280,
    width: 350,
    height: 36,
    rotation: 0,
    opacity: 0.95,
    zIndex: 5,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Trân trọng kính mời",
      fontSize: 15,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#166534",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-names",
    type: "text",
    x: 10,
    y: 316,
    width: 370,
    height: 75,
    rotation: 0,
    opacity: 1,
    zIndex: 6,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh\n&\nThuỳ Linh",
      fontSize: 32,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "italic",
      color: "#14532d",
      textAlign: "center",
      lineHeight: 1.15,
    },
  },
  {
    id: "deco-mid",
    type: "text",
    x: 20,
    y: 396,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.45,
    zIndex: 7,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "🍃 ─────────────── 🍃",
      fontSize: 11,
      fontFamily: "'Georgia', serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#22c55e",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-family",
    type: "text",
    x: 20,
    y: 424,
    width: 350,
    height: 48,
    rotation: 0,
    opacity: 0.9,
    zIndex: 8,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Cùng gia đình hai bên\nân hạnh kính mời quý khách",
      fontSize: 13,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#15803d",
      textAlign: "center",
      lineHeight: 1.6,
    },
  },
  {
    id: "txt-date",
    type: "text",
    x: 20,
    y: 490,
    width: 350,
    height: 44,
    rotation: 0,
    opacity: 1,
    zIndex: 10,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Chủ Nhật, 28 · 05 · 2026",
      fontSize: 22,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#14532d",
      textAlign: "center",
      lineHeight: 1.2,
    },
  },
  {
    id: "txt-time",
    type: "text",
    x: 20,
    y: 534,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.85,
    zIndex: 11,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Lúc 10:00 sáng",
      fontSize: 15,
      fontFamily: "'Lora', serif",
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#166534",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-groom-name",
    type: "text",
    x: 35,
    y: 745,
    width: 145,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 12,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh",
      fontSize: 16,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#14532d",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-bride-name",
    type: "text",
    x: 215,
    y: 745,
    width: 145,
    height: 36,
    rotation: 0,
    opacity: 1,
    zIndex: 13,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Thuỳ Linh",
      fontSize: 16,
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#14532d",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-venue",
    type: "text",
    x: 20,
    y: 790,
    width: 350,
    height: 50,
    rotation: 0,
    opacity: 0.9,
    zIndex: 14,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "📍 Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM",
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#15803d",
      textAlign: "center",
      lineHeight: 1.5,
    },
  },
];

/** ⑥ Modern Minimal — B&W, geometric, contemporary */
const MODERN_MINIMAL: TemplateElement[] = [
  {
    id: "img-main",
    type: "image",
    x: 50,
    y: 20,
    width: 290,
    height: 220,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 0,
      borderWidth: 2,
      borderColor: "#18181b",
    },
  },
  {
    id: "img-groom",
    type: "image",
    x: 35,
    y: 570,
    width: 148,
    height: 175,
    rotation: 0,
    opacity: 1,
    zIndex: 2,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 0,
      borderWidth: 1,
      borderColor: "#3f3f46",
    },
  },
  {
    id: "img-bride",
    type: "image",
    x: 210,
    y: 570,
    width: 148,
    height: 175,
    rotation: 0,
    opacity: 1,
    zIndex: 3,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      src: null,
      objectFit: "cover",
      borderRadius: 0,
      borderWidth: 1,
      borderColor: "#3f3f46",
    },
  },
  {
    id: "deco-top",
    type: "text",
    x: 20,
    y: 250,
    width: 350,
    height: 28,
    rotation: 0,
    opacity: 0.3,
    zIndex: 4,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
      fontSize: 10,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#71717a",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-invite",
    type: "text",
    x: 20,
    y: 280,
    width: 350,
    height: 32,
    rotation: 0,
    opacity: 0.8,
    zIndex: 5,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "WE'RE GETTING MARRIED",
      fontSize: 11,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#52525b",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-names",
    type: "text",
    x: 10,
    y: 312,
    width: 370,
    height: 75,
    rotation: 0,
    opacity: 1,
    zIndex: 6,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Minh Anh\n&\nThuỳ Linh",
      fontSize: 34,
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#18181b",
      textAlign: "center",
      lineHeight: 1.15,
    },
  },
  {
    id: "deco-mid",
    type: "text",
    x: 20,
    y: 392,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.25,
    zIndex: 7,
    locked: true,
    animation: { entrance: "none", loop: "none" },
    props: {
      text: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
      fontSize: 10,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#71717a",
      textAlign: "center",
      lineHeight: 1.0,
    },
  },
  {
    id: "txt-family",
    type: "text",
    x: 20,
    y: 418,
    width: 350,
    height: 48,
    rotation: 0,
    opacity: 0.8,
    zIndex: 8,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Cùng gia đình hai bên\nân hạnh kính mời quý khách",
      fontSize: 13,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#3f3f46",
      textAlign: "center",
      lineHeight: 1.6,
    },
  },
  {
    id: "txt-date",
    type: "text",
    x: 20,
    y: 478,
    width: 350,
    height: 44,
    rotation: 0,
    opacity: 1,
    zIndex: 10,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "28 . 05 . 2026",
      fontSize: 28,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#18181b",
      textAlign: "center",
      lineHeight: 1.2,
    },
  },
  {
    id: "txt-time",
    type: "text",
    x: 20,
    y: 524,
    width: 350,
    height: 24,
    rotation: 0,
    opacity: 0.7,
    zIndex: 11,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "10:00 AM",
      fontSize: 14,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#52525b",
      textAlign: "center",
      lineHeight: 1.4,
    },
  },
  {
    id: "txt-groom-name",
    type: "text",
    x: 35,
    y: 750,
    width: 148,
    height: 32,
    rotation: 0,
    opacity: 1,
    zIndex: 12,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "MINH ANH",
      fontSize: 13,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#18181b",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-bride-name",
    type: "text",
    x: 210,
    y: 750,
    width: 148,
    height: 32,
    rotation: 0,
    opacity: 1,
    zIndex: 13,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "THUỲ LINH",
      fontSize: 13,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#18181b",
      textAlign: "center",
      lineHeight: 1.3,
    },
  },
  {
    id: "txt-venue",
    type: "text",
    x: 20,
    y: 790,
    width: 350,
    height: 50,
    rotation: 0,
    opacity: 0.75,
    zIndex: 14,
    locked: false,
    animation: { entrance: "fadeIn", loop: "none" },
    props: {
      text: "Diamond Palace — 123 Nguyễn Huệ, Q1, TP.HCM",
      fontSize: 11,
      fontFamily: "'Inter', sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#52525b",
      textAlign: "center",
      lineHeight: 1.5,
    },
  },
];

// ════════════════════════════════════════
//  TEMPLATE → FAMILY MAPPING
//  Visual classification based on Cinelove thumbnail analysis
// ════════════════════════════════════════

type FamilyKey =
  | "romantic-pink"
  | "luxury-dark"
  | "classic-white"
  | "traditional-red"
  | "nature-green"
  | "modern-minimal"
  | "cinelove-53";

const FAMILY_ELEMENTS: Record<FamilyKey, TemplateElement[]> = {
  "romantic-pink": ROMANTIC_PINK,
  "luxury-dark": LUXURY_DARK,
  "classic-white": CLASSIC_WHITE,
  "traditional-red": TRADITIONAL_RED,
  "nature-green": NATURE_GREEN,
  "modern-minimal": MODERN_MINIMAL,
  "cinelove-53": [], // populated dynamically from TEMPLATE_UNIQUE_PRESETS
};

/** Map each Cinelove slug → style family */
const TEMPLATE_FAMILY: Record<string, FamilyKey> = {
  // ── Romantic Pink (~20 templates) ──
  "thiep-cuoi-42": "romantic-pink",
  "thiep-cuoi-39": "romantic-pink",
  "thiep-cuoi-46": "romantic-pink",
  "thiep-cuoi-38": "romantic-pink",
  "thiep-cuoi-44": "romantic-pink",
  "thiep-cuoi-40": "romantic-pink",
  "thiep-cuoi-16": "romantic-pink",
  "thiep-cuoi-47": "romantic-pink",
  "thiep-cuoi-48": "romantic-pink",
  "thiep-cuoi-19": "romantic-pink",
  "thiep-cuoi-2": "romantic-pink",
  "thiep-cuoi-43": "romantic-pink",
  "thiep-cuoi-21": "romantic-pink",
  "thiep-cuoi-14": "romantic-pink",
  "thiep-cuoi-15": "romantic-pink",
  "thiep-cuoi-50": "romantic-pink",
  "thiep-cuoi-24": "romantic-pink",
  "thiep-cuoi-41": "romantic-pink",
  "thiep-cuoi-37": "romantic-pink",
  "thiep-cuoi-35": "romantic-pink",
  "thiep-cuoi-55": "romantic-pink",
  // ── Luxury Dark (~10 templates) ──
  "thiep-cuoi-36": "luxury-dark",
  "thiep-cuoi-56": "luxury-dark",
  "thiep-cuoi-52": "luxury-dark",
  "thiep-cuoi-49": "luxury-dark",
  "thiep-cuoi-57": "luxury-dark",
  "thiep-cuoi-54": "luxury-dark",
  "thiep-cuoi-60": "luxury-dark",
  "thiep-cuoi-34": "luxury-dark",
  "thiep-cuoi-33": "luxury-dark",
  // ── Classic White (~12 templates) ──
  "thiep-cuoi-5": "classic-white",
  "thiep-cuoi-23": "classic-white",
  "thiep-cuoi-8": "classic-white",
  "thiep-cuoi-11": "classic-white",
  "thiep-cuoi-1": "classic-white",
  "thiep-cuoi-17": "classic-white",
  "thiep-cuoi-12": "classic-white",
  "thiep-cuoi-7": "classic-white",
  "thiep-cuoi-4": "classic-white",
  "thiep-cuoi-3": "classic-white",
  "thiep-cuoi-18": "classic-white",
  "thiep-cuoi-22": "classic-white",
  // ── Traditional Red/Gold (~10 templates) ──
  "thiep-cuoi-28": "traditional-red",
  "thiep-cuoi-31": "traditional-red",
  "thiep-cuoi-30": "traditional-red",
  "thiep-cuoi-10": "traditional-red",
  "thiep-cuoi-6": "traditional-red",
  "thiep-cuoi-32": "traditional-red",
  "thiep-cuoi-20": "traditional-red",
  "thiep-cuoi-9": "traditional-red",
  "thiep-cuoi-13": "traditional-red",
  "thiep-cuoi-29": "traditional-red",
  "thiep-cuoi-26": "traditional-red",
  "thiep-cuoi-27": "traditional-red",
  // ── Nature Green (~5 templates) ──
  "thiep-cuoi-tone-xanh": "nature-green",
  "thiep-cuoi-25": "nature-green",
  // ── Modern Minimal / B&W ──
  "thiep-bw-1": "modern-minimal",
  // ── CineLove Exact Replicas ──
  "thiep-cuoi-53": "cinelove-53",
  // ── Birthday → romantic-pink (bright, fun) ──
  "thiep-sinh-nhat-01": "romantic-pink",
  "thiep-sinh-nhat-06": "romantic-pink",
  "thiep-sinh-nhat-05": "romantic-pink",
  "thiep-sinh-nhat-02": "romantic-pink",
  "thiep-sinh-nhat-04": "romantic-pink",
  "thiep-sinh-nhat-03": "romantic-pink",
  // ── Graduation → modern-minimal ──
  "thiep-tot-nghiep-1": "modern-minimal",
  "thiep-tot-nghiep-3": "modern-minimal",
  "thiep-tot-nghiep-2": "modern-minimal",
  // ── Events → classic-white ──
  "thiep-ky-yeu-mau1": "classic-white",
  "thiep-ky-yeu-mau2": "classic-white",
  "thiep-tan-gia-1": "traditional-red",
  "thiep-tan-gia-2": "traditional-red",
  "thiep-valentine-1": "romantic-pink",
  "tiec-tat-nien-3": "luxury-dark",
  "thiep-tat-nien-4": "luxury-dark",
  "tiec-tat-nien-1": "luxury-dark",
};

/** Convert v1 TemplateElement[] → craft.js node tree JSON string */
function convertElementsToCraftState(
  elements: TemplateElement[],
  rootBg = "transparent",
): string {
  let nodeIdx = 1;
  const uid = () => `node-${nodeIdx++}`;

  // Group elements into sections by y-position bands
  const textEls = elements.filter((e) => e.type === "text");
  const imgEls = elements.filter((e) => e.type === "image");

  // Build craft.js node tree
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: Record<string, any> = {};
  const sectionIds: string[] = [];

  // Helper: create a CraftText node
  function addTextNode(el: TemplateElement, parentId: string) {
    const id = uid();
    const p = el.props as Record<string, unknown>;
    nodes[id] = {
      type: { resolvedName: "CraftText" },
      isCanvas: false,
      props: {
        text: (p.text as string) || "",
        fontSize: (p.fontSize as number) || 14,
        fontFamily: (p.fontFamily as string) || "'Playfair Display', serif",
        fontWeight: (p.fontWeight as string) || "normal",
        fontStyle: (p.fontStyle as string) || "normal",
        color: (p.color as string) || "#1f2937",
        textAlign: (p.textAlign as string) || "center",
        lineHeight: (p.lineHeight as number) || 1.4,
        letterSpacing: 0,
        opacity: el.opacity ?? 1,
      },
      displayName: "CraftText",
      custom: {},
      parent: parentId,
      nodes: [],
      linkedNodes: {},
    };
    return id;
  }

  // Helper: create a CraftImage node
  function addImageNode(el: TemplateElement, parentId: string) {
    const id = uid();
    const p = el.props as Record<string, unknown>;
    nodes[id] = {
      type: { resolvedName: "CraftImage" },
      isCanvas: false,
      props: {
        src: (p.src as string) || "/placeholder-couple.png",
        objectFit: (p.objectFit as string) || "cover",
        borderRadius: (p.borderRadius as number) || 12,
        borderWidth: (p.borderWidth as number) || 2,
        borderColor: (p.borderColor as string) || "#f9a8d4",
        opacity: el.opacity ?? 1,
        shadow: false,
      },
      displayName: "CraftImage",
      custom: {},
      parent: parentId,
      nodes: [],
      linkedNodes: {},
    };
    return id;
  }

  // Helper: create a plugin widget node
  function addPluginNode(el: TemplateElement, parentId: string) {
    const id = uid();
    const p = el.props as Record<string, unknown>;
    const typeMap: Record<string, string> = {
      countdown: "CraftCountdown",
      calendar: "CraftCalendar",
      map: "CraftMap",
      album: "CraftPhotoAlbum",
      rsvp: "CraftRSVP",
      qrbox: "CraftQRBox",
      envelope: "CraftEnvelope",
    };
    const resolvedName = typeMap[el.type];
    if (!resolvedName) return id; // unknown plugin type

    // Build props based on type
    const pluginProps: Record<string, unknown> = { ...p };

    // Map preset prop names to CraftJS component prop names where they differ
    if (el.type === "countdown") {
      pluginProps.targetDate = (p.targetDate as string) || "2026-05-28";
      pluginProps.label = (p.label as string) || "Đếm ngược đến ngày cưới";
      pluginProps.color =
        (p.accentColor as string) || (p.color as string) || "#831843";
    } else if (el.type === "calendar") {
      pluginProps.targetDate =
        (p.selectedDate as string) || (p.targetDate as string) || "2026-05-28";
      pluginProps.accentColor = (p.accentColor as string) || "#ff6b9d";
    } else if (el.type === "map") {
      pluginProps.address =
        (p.address as string) || "123 Nguyễn Huệ, Quận 1, TP.HCM";
      pluginProps.venueName =
        (p.label as string) || (p.venueName as string) || "Địa điểm";
    } else if (el.type === "album") {
      pluginProps.photos = (p.images as unknown[]) || [];
      pluginProps.columns = (p.columns as number) || 3;
      pluginProps.gap = (p.gap as number) || 6;
    } else if (el.type === "rsvp") {
      pluginProps.title = (p.title as string) || "Xác nhận tham dự";
      pluginProps.accentColor = (p.accentColor as string) || "#ff6b9d";
    } else if (el.type === "qrbox") {
      pluginProps.bankName = (p.groomBank as string) || "VCB";
      pluginProps.accountNumber = (p.groomAccount as string) || "";
      pluginProps.accountName = (p.groomName as string) || "";
    } else if (el.type === "envelope") {
      pluginProps.groomName = (p.groomName as string) || "Anh";
      pluginProps.brideName = (p.brideName as string) || "Em";
    }

    nodes[id] = {
      type: { resolvedName },
      isCanvas: false,
      props: pluginProps,
      displayName: resolvedName,
      custom: {},
      parent: parentId,
      nodes: [],
      linkedNodes: {},
    };
    return id;
  }

  // Helper: create a CraftContainer section
  function addSection(
    childIds: string[],
    opts: { direction?: string; bg?: string; isRoot?: boolean } = {},
  ) {
    const id = uid();
    nodes[id] = {
      type: { resolvedName: "CraftContainer" },
      isCanvas: true,
      props: {
        background: opts.bg || "transparent",
        padding: 16,
        minHeight: 100,
        gap: 8,
        flexDirection: opts.direction || "column",
        alignItems: "center",
        justifyContent: "center",
      },
      displayName: "CraftContainer",
      custom: {},
      parent: "ROOT", // replaced if nested
      nodes: childIds,
      linkedNodes: {},
    };
    // Set parent for children
    childIds.forEach((cid) => {
      if (nodes[cid]) nodes[cid].parent = id;
    });
    if (opts.isRoot !== false) {
      sectionIds.push(id);
    }
    return id;
  }

  // --- Template 53 Custom Mapping ---
  if (elements.some((e) => e.id === "txt-vuquy-time")) {
    const pluginTypes = [
      "countdown",
      "calendar",
      "map",
      "album",
      "rsvp",
      "qrbox",
      "envelope",
    ];
    const getElNode = (id: string, parentId: string = "") => {
      const el = elements.find((e) => e.id === id);
      if (!el) return null;
      if (el.type === "image") return addImageNode(el, parentId);
      if (pluginTypes.includes(el.type)) return addPluginNode(el, parentId);
      return addTextNode(el, parentId);
    };
    const getNodes = (ids: string[]) =>
      ids.map((id) => getElNode(id)).filter(Boolean) as string[];

    addSection(getNodes(["txt-le-cuoi", "img-main"]));
    addSection(getNodes(["img-couple"]));

    const nhatrai = addSection(
      getNodes([
        "txt-nhatrai-label",
        "txt-bo-trai",
        "txt-me-trai",
        "txt-diachi-trai",
      ]),
      { isRoot: false },
    );
    const nhagai = addSection(
      getNodes([
        "txt-nhagai-label",
        "txt-bo-gai",
        "txt-me-gai",
        "txt-diachi-gai",
      ]),
      { isRoot: false },
    );
    addSection([nhatrai, nhagai], { direction: "row" });

    addSection(
      getNodes(["txt-name-groom", "img-wax-seal", "txt-and", "txt-name-bride"]),
    );
    addSection(getNodes(["txt-invite", "txt-invite2"]));

    addSection(getNodes(["txt-vuquy-time"]));
    const vqLeft = addSection(getNodes(["txt-vuquy-date-left"]), {
      isRoot: false,
    });
    const vqMid = addSection(getNodes(["txt-vuquy-day"]), { isRoot: false });
    const vqRight = addSection(getNodes(["txt-vuquy-date-right"]), {
      isRoot: false,
    });
    addSection([vqLeft, vqMid, vqRight], { direction: "row" });
    addSection(
      getNodes(["txt-vuquy-lunar", "txt-vuquy-venue", "txt-vuquy-addr"]),
    );

    addSection(getNodes(["txt-tiec-invite", "txt-tiec-time"]));
    const tLeft = addSection(getNodes(["txt-tiec-date-left"]), {
      isRoot: false,
    });
    const tMid = addSection(getNodes(["txt-tiec-day"]), { isRoot: false });
    const tRight = addSection(getNodes(["txt-tiec-date-right"]), {
      isRoot: false,
    });
    addSection([tLeft, tMid, tRight], { direction: "row" });
    addSection(getNodes(["txt-tiec-lunar", "txt-tiec-venue", "txt-tiec-addr"]));

    addSection(getNodes(["txt-timeline-title"]));
    addSection(getNodes(["img-icon-rings", "txt-tl-time1", "txt-tl-event1"]));
    addSection(getNodes(["img-icon-camera", "txt-tl-time2", "txt-tl-event2"]));
    addSection(getNodes(["img-icon-wine", "txt-tl-time3", "txt-tl-event3"]));

    addSection(
      getNodes([
        "txt-dresscode-title",
        "txt-dresscode-desc",
        "img-icon-dresscode",
        "txt-dresscode-colors",
      ]),
    );

    const groomDet = addSection(
      getNodes(["txt-groom-label", "txt-groom-name2", "txt-groom-dob"]),
      { isRoot: false },
    );
    const brideDet = addSection(
      getNodes(["txt-bride-label", "txt-bride-name2", "txt-bride-dob"]),
      { isRoot: false },
    );
    addSection([groomDet, brideDet], { direction: "row" });

    addSection(
      getNodes([
        "txt-story-title",
        "txt-story1",
        "img-story1",
        "txt-story2",
        "img-story2",
        "img-story3",
        "img-wax-seal2",
      ]),
    );

    // Use a relative positioning trick for heart overlapping if needed, but flexbox stacking works normally
    addSection(getNodes(["txt-cal-title", "txt-cal-grid", "img-icon-heart"]));

    // ── Plugin Widgets ──
    addSection(getNodes(["plugin-countdown"]));
    addSection(getNodes(["plugin-calendar"]));
    addSection(getNodes(["plugin-map"]));
    addSection(getNodes(["plugin-album"]));
    addSection(getNodes(["plugin-rsvp"]));
    addSection(getNodes(["plugin-qrbox"]));

    // ── Thank You + Footer ──
    addSection(
      getNodes(["txt-thankyou-title", "txt-thankyou-body", "img-wax-seal2"]),
    );
    addSection(getNodes(["txt-footer"]));

    // ── Envelope (full-screen overlay — renders on top) ──
    addSection(getNodes(["plugin-envelope"]));
  } else {
    // --- Legacy Template Fallback ---
    // Build sections based on element IDs
    // Hero image
    const heroImg = imgEls.find((e) => e.id === "img-main");
    if (heroImg) {
      const imgId = addImageNode(heroImg, "");
      addSection([imgId]);
    }

    // ── Ceremony label + ornament 1 ──
    const ceremonyTxt = textEls.find((e) => e.id === "txt-ceremony");
    const deco1 = textEls.find((e) => e.id === "txt-deco1");
    const crmChildIds: string[] = [];
    if (deco1) crmChildIds.push(addTextNode(deco1, ""));
    if (ceremonyTxt) crmChildIds.push(addTextNode(ceremonyTxt, ""));
    if (crmChildIds.length) addSection(crmChildIds);

    // Names section
    const inviteTxt = textEls.find((e) => e.id === "txt-invite");
    const namesTxt = textEls.find((e) => e.id === "txt-names");
    const familyTxt = textEls.find((e) => e.id === "txt-family");
    const nameChildIds: string[] = [];
    if (inviteTxt) nameChildIds.push(addTextNode(inviteTxt, ""));
    if (namesTxt) nameChildIds.push(addTextNode(namesTxt, ""));
    if (familyTxt) nameChildIds.push(addTextNode(familyTxt, ""));
    if (nameChildIds.length) addSection(nameChildIds);

    // ── Ornament 2 ──
    const deco2 = textEls.find((e) => e.id === "txt-deco2");
    if (deco2) addSection([addTextNode(deco2, "")]);

    // Family section (Nhà Trai / Nhà Gái)
    const nhaTraiLabel = textEls.find((e) => e.id === "txt-nhatrai-label");
    const nhaTraiTxt = textEls.find((e) => e.id === "txt-nhatrai");
    const nhaGaiLabel = textEls.find((e) => e.id === "txt-nhagai-label");
    const nhaGaiTxt = textEls.find((e) => e.id === "txt-nhagai");
    const famChildIds: string[] = [];
    if (nhaTraiLabel) famChildIds.push(addTextNode(nhaTraiLabel, ""));
    if (nhaTraiTxt) famChildIds.push(addTextNode(nhaTraiTxt, ""));
    if (nhaGaiLabel) famChildIds.push(addTextNode(nhaGaiLabel, ""));
    if (nhaGaiTxt) famChildIds.push(addTextNode(nhaGaiTxt, ""));
    if (famChildIds.length) addSection(famChildIds);

    // Groom & Bride photos
    const groomImg = imgEls.find((e) => e.id === "img-groom");
    const brideImg = imgEls.find((e) => e.id === "img-bride");
    const groomName = textEls.find(
      (e) => e.id === "name-groom" || e.id === "txt-groom-name",
    );
    const brideName = textEls.find(
      (e) => e.id === "name-bride" || e.id === "txt-bride-name",
    );
    const photoChildIds: string[] = [];
    if (groomImg) photoChildIds.push(addImageNode(groomImg, ""));
    if (brideImg) photoChildIds.push(addImageNode(brideImg, ""));
    if (photoChildIds.length) addSection(photoChildIds, { direction: "row" });
    const namesBelowIds: string[] = [];
    if (groomName) namesBelowIds.push(addTextNode(groomName, ""));
    if (brideName) namesBelowIds.push(addTextNode(brideName, ""));
    if (namesBelowIds.length) addSection(namesBelowIds, { direction: "row" });

    // ── Ornament 3 ──
    const deco3 = textEls.find((e) => e.id === "txt-deco3");
    if (deco3) addSection([addTextNode(deco3, "")]);

    // Date section (+ CineLove-style large day number)
    const dateTxt = textEls.find((e) => e.id === "txt-date");
    const dateDayTxt = textEls.find((e) => e.id === "txt-date-day");
    const timeTxt = textEls.find((e) => e.id === "txt-time");
    const dateChildIds: string[] = [];
    if (dateTxt) dateChildIds.push(addTextNode(dateTxt, ""));
    if (dateDayTxt) dateChildIds.push(addTextNode(dateDayTxt, ""));
    if (timeTxt) dateChildIds.push(addTextNode(timeTxt, ""));
    if (dateChildIds.length) addSection(dateChildIds);

    // ── Ornament 4 ──
    const deco4 = textEls.find((e) => e.id === "txt-deco4");
    if (deco4) addSection([addTextNode(deco4, "")]);

    // Events section
    const ev1Label = textEls.find((e) => e.id === "txt-event1-label");
    const ev1 = textEls.find((e) => e.id === "txt-event1");
    const ev2Label = textEls.find((e) => e.id === "txt-event2-label");
    const ev2 = textEls.find((e) => e.id === "txt-event2");
    const evChildIds: string[] = [];
    if (ev1Label) evChildIds.push(addTextNode(ev1Label, ""));
    if (ev1) evChildIds.push(addTextNode(ev1, ""));
    if (ev2Label) evChildIds.push(addTextNode(ev2Label, ""));
    if (ev2) evChildIds.push(addTextNode(ev2, ""));
    if (evChildIds.length) addSection(evChildIds);

    // Gallery
    const galleryImgs = imgEls.filter(
      (e) => e.id.startsWith("img-gallery") || e.id === "img-couple2",
    );
    if (galleryImgs.length) {
      const galChildIds = galleryImgs.map((el) => addImageNode(el, ""));
      addSection(galChildIds, { direction: "row" });
    }

    // Quote
    const quoteTxt = textEls.find((e) => e.id === "txt-quote");
    if (quoteTxt) {
      addSection([addTextNode(quoteTxt, "")]);
    }

    // Venue
    const venueTxt = textEls.find((e) => e.id === "txt-venue");
    if (venueTxt) {
      addSection([addTextNode(venueTxt, "")]);
    }

    // ── Bottom ornament 5 ──
    const deco5 = textEls.find((e) => e.id === "txt-deco5");
    if (deco5) addSection([addTextNode(deco5, "")]);
  }

  // Root canvas node
  const canvasId = uid();
  nodes[canvasId] = {
    type: { resolvedName: "RootContainer" },
    isCanvas: true,
    props: { background: rootBg },
    displayName: "RootContainer",
    custom: {},
    parent: "ROOT",
    nodes: sectionIds,
    linkedNodes: {},
  };
  // Update section parents
  sectionIds.forEach((sid) => {
    nodes[sid].parent = canvasId;
  });

  // ROOT node
  nodes["ROOT"] = {
    type: { resolvedName: "div" },
    isCanvas: true,
    props: {},
    displayName: "div",
    custom: {},
    parent: null,
    nodes: [canvasId],
    linkedNodes: {},
  };

  return JSON.stringify(nodes);
}

/** Build canvas_json — v2 craft.js format for all 75 templates */
function buildTemplateCanvasJson(templateSlug: string): string {
  const family = TEMPLATE_FAMILY[templateSlug] ?? "romantic-pink";
  const elements =
    TEMPLATE_UNIQUE_PRESETS[templateSlug] ?? FAMILY_ELEMENTS[family];

  // Always use gradient bg — photos are standalone CraftImage nodes (like CineLove)
  const gradients: Record<FamilyKey, string> = {
    "romantic-pink":
      "linear-gradient(180deg, #fdf6f0 0%, #fce8e8 30%, #fdf6f0 60%, #fef9f6 100%)",
    "luxury-dark":
      "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
    "classic-white":
      "linear-gradient(180deg, #f9f6f0 0%, #f0ebe2 50%, #f9f6f0 100%)",
    "traditional-red":
      "linear-gradient(180deg, #fdf2f2 0%, #fbe8e8 30%, #fdf5ec 100%)",
    "nature-green":
      "linear-gradient(180deg, #f0fdf4 0%, #ecfccb 30%, #f5fdf0 100%)",
    "modern-minimal": "linear-gradient(180deg, #fafaf8 0%, #f5f1eb 100%)",
    "cinelove-53":
      "linear-gradient(180deg, #f8f3eb 0%, #f5efe5 50%, #f8f3eb 100%)",
  };
  const bgCss = gradients[family];

  // Custom canvas engine (default) — absolute positioned elements
  const canvasElements = convertTemplateToCanvas(elements);

  return JSON.stringify({
    version: 2,
    engine: "custom-canvas",
    canvas: { width: 500, height: 7300, bg: bgCss },
    elements: canvasElements,
    meta: { musicUrl: "", musicName: "" },
    effects: { particleEffect: "none" },
  });
}

function NewEditorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const creatingRef = useRef(false);

  useEffect(() => {
    if (creatingRef.current) return;
    creatingRef.current = true;

    async function createProject() {
      const templateSlug = searchParams.get("template") || "rose-garden";
      const { createBrowserClient: createClient } =
        await import("@supabase/ssr");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      // Auth check
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/editor/new?template=" + templateSlug);
        return;
      }

      // Build initial canvas_json from template preset
      const canvasJson = buildTemplateCanvasJson(templateSlug);

      // Create slug
      const slug = `wedding-${Date.now().toString(36)}`;

      // Create project
      const { data: project, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          slug,
          title: "Thiệp cưới mới",
          template: templateSlug,
          status: "draft",
          canvas_json: canvasJson,
          groom_name: "Tên Chú Rể",
          bride_name: "Tên Cô Dâu",
          wedding_date: null,
        })
        .select("id")
        .single();

      if (error || !project) {
        alert(
          "Không thể tạo thiệp. Vui lòng thử lại: " +
            (error?.message ?? "unknown"),
        );
        router.push("/templates");
        return;
      }

      // Redirect to VisualEditor with the new project
      router.replace("/editor/" + project.id);
    }

    createProject();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fdf2f8, #faf5ff)",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid #f3e8ff",
          borderTop: "3px solid #ff6b9d",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          fontSize: 16,
          color: "#be185d",
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        💌 Đang tạo thiệp mới...
      </p>
      <p
        style={{
          fontSize: 13,
          color: "#9ca3af",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Chỉ mất vài giây để khởi tạo
      </p>
      <style>{`
                @keyframes spin { to { transform: rotate(360deg) } }
            `}</style>
    </div>
  );
}

export default function NewEditorPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fdf2f8",
          }}
        >
          <p style={{ fontSize: 16, color: "#be185d" }}>💌 Loading...</p>
        </div>
      }
    >
      <NewEditorInner />
    </Suspense>
  );
}
