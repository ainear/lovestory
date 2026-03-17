"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ──────────────────────────────────────────────
   CINELOVE CDN BASE — long_thumbnail images
   ────────────────────────────────────────────── */
const CDN = "/cinelove-cdn/";

/* ──────────────────────────────────────────────
   81 TEMPLATES — Cloned from Cinelove data
   ────────────────────────────────────────────── */
const TEMPLATES: Array<{
    id: string;
    slug: string;
    name: string;
    category: string;
    tier: "free" | "basic" | "premium";
    thumbnail: string;
    usageCount: number;
    desc: string;
}> = [
    // ── TOP WEDDING (sorted by usage) ──
    { id: "t-42", slug: "thiep-cuoi-42", name: "Thiệp Cưới 42", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/5731de59-c0f3-4fa7-9860-e5e47b829ce3.webp", usageCount: 38211, desc: "Mẫu thiệp cưới phổ biến nhất" },
    { id: "t-39", slug: "thiep-cuoi-39", name: "Thiệp cưới 39", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/a2f11727-8717-46db-ada4-ff29271ce53b.webp", usageCount: 23327, desc: "Thiệp cưới tinh tế, hài hòa" },
    { id: "t-46", slug: "thiep-cuoi-46", name: "Thiệp cưới 46", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/efd815e3-41ff-4eb3-b31b-c25b202bc08c_1762512003.webp", usageCount: 22535, desc: "Thiệp cưới hiện đại, trend 2026" },
    { id: "t-38", slug: "thiep-cuoi-38", name: "Thiệp cưới 38", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/7e64b0eb-9b5b-497f-b09e-3d3024571dfa.webp", usageCount: 21914, desc: "Thiệp cưới đẹp, tone nhẹ nhàng" },
    { id: "t-36", slug: "thiep-cuoi-36", name: "Thiệp cưới 36", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/e554cdff-72d4-4657-863a-68cf83b61fe3.webp", usageCount: 20140, desc: "Thiệp cưới cổ điển, sang trọng" },
    { id: "t-44", slug: "thiep-cuoi-44", name: "Thiệp cưới 44", category: "wedding", tier: "premium", thumbnail: CDN + "templates/long_thumbnail/0189eb35-5cf1-4525-a8d0-867f70e0bf67.webp", usageCount: 16322, desc: "Thiệp cưới Premium, cao cấp" },
    { id: "t-40", slug: "thiep-cuoi-40", name: "Thiệp cưới 40", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/cbe1c609-0b73-42f5-8d29-81404f0c5bfe.webp", usageCount: 16137, desc: "Thiệp cưới trang nhã, thanh lịch" },
    { id: "t-16", slug: "thiep-cuoi-16", name: "Thiệp cưới 16", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/8d4b8ad3-0d91-4cba-9e16-e5c2de3275b4.webp", usageCount: 14864, desc: "Thiệp cưới hoa lá, dịu dàng" },
    { id: "t-47", slug: "thiep-cuoi-47", name: "Thiệp cưới 47", category: "wedding", tier: "premium", thumbnail: CDN + "templates/long_thumbnail/6c40c8a5-5ead-4723-abff-bcb98f19d403_1762676162.webp", usageCount: 14780, desc: "Thiệp cưới Premium, đặc sắc" },
    { id: "t-48", slug: "thiep-cuoi-48", name: "Thiệp cưới 48", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/77a0f81e-67af-4f30-91b6-73c5e5ce6aea_1763195257.webp", usageCount: 13465, desc: "Thiệp cưới độc đáo, nổi bật" },
    { id: "t-19", slug: "thiep-cuoi-19", name: "Thiệp cưới 19", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/26ead6d0-bed0-4e61-877b-901b18aab1df.webp", usageCount: 12206, desc: "Thiệp cưới nhẹ nhàng" },
    { id: "t-mint", slug: "thiep-cuoi-tone-xanh", name: "Thiệp Cưới Xanh Mint", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/c6238e18-d92b-4eea-ba14-3fe832517e62_1762512018.webp", usageCount: 10286, desc: "Tone xanh mint, tươi mát" },
    { id: "t-02", slug: "thiep-cuoi-2", name: "Thiệp cưới 2", category: "wedding", tier: "premium", thumbnail: CDN + "templates/long_thumbnail/c9e80a57234fb12dd764.webp", usageCount: 9660, desc: "Thiệp cưới Premium, đẳng cấp" },
    { id: "t-05", slug: "thiep-cuoi-5", name: "Thiệp cưới 5", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/bdc44f064724f87aa135.webp", usageCount: 9231, desc: "Thiệp cưới lãng mạn" },
    { id: "t-23", slug: "thiep-cuoi-23", name: "Thiệp cưới 23", category: "wedding", tier: "free", thumbnail: CDN + "templates/long_thumbnail/5913a014-9fc0-4a7d-aa73-31416a84d0b7.webp", usageCount: 8763, desc: "Thiệp cưới miễn phí, đẹp" },
    { id: "t-08", slug: "thiep-cuoi-8", name: "Thiệp cưới 8", category: "wedding", tier: "free", thumbnail: CDN + "templates/long_thumbnail/9afa4639-e512-4490-8a28-def233513413.webp", usageCount: 8027, desc: "Thiệp cưới miễn phí, trendy" },
    { id: "t-53", slug: "thiep-cuoi-53", name: "Thiệp cưới 53", category: "wedding", tier: "premium", thumbnail: CDN + "templates/long_thumbnail/a038df05-e9a9-408e-bd48-3cd7a239bbc4_1767931340.webp", usageCount: 7764, desc: "Thiệp cưới Premium, độc quyền" },
    { id: "t-28", slug: "thiep-cuoi-28", name: "Thiệp cưới 28", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/248881a1-7da2-4232-b69b-c39d393f0b91.webp", usageCount: 7203, desc: "Thiệp cưới trang nhã" },
    { id: "t-11", slug: "thiep-cuoi-11", name: "Thiệp cưới 11", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/1bf25163-6f28-4430-a67a-553274c679ea.webp", usageCount: 6530, desc: "Thiệp cưới hoa nhẹ nhàng" },
    { id: "t-49", slug: "thiep-cuoi-49", name: "Thiệp cưới 49", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/314cf592-7bb3-4067-aeb0-e259db6b6c31_1765806090.webp", usageCount: 6184, desc: "Thiệp cưới hiện đại" },
    { id: "t-01", slug: "thiep-cuoi-1", name: "Thiệp cưới 1", category: "wedding", tier: "premium", thumbnail: CDN + "templates/long_thumbnail/f4b65e20983dd71aa541.webp", usageCount: 5958, desc: "OG Premium, thiệp đầu tiên" },
    { id: "t-17", slug: "thiep-cuoi-17", name: "Thiệp cưới 17", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/47b0118b-1f91-4622-8061-f7002f6d5aaf.webp", usageCount: 5810, desc: "Thiệp cưới dịu dàng" },
    { id: "t-56", slug: "thiep-cuoi-56", name: "Thiệp cưới 56", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/428a253a-0bb7-412b-8861-ec12c5f06582_1770022452.webp", usageCount: 5793, desc: "Thiệp cưới mới nhất 2026" },
    { id: "t-52", slug: "thiep-cuoi-52", name: "Thiệp cưới 52", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/6b90e268-6745-48d2-95dc-6d0e5fc22981_1765795744.webp", usageCount: 5106, desc: "Thiệp cưới tinh tế" },
    { id: "t-12", slug: "thiep-cuoi-12", name: "Thiệp cưới 12", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/128f51ee-4b37-4f6f-92c7-8629673d3d3c.webp", usageCount: 4655, desc: "Thiệp cưới đơn giản đẹp" },
    { id: "t-bw", slug: "thiep-bw-1", name: "Black & White", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/416b30bd-bedf-44ab-b0b8-63d1530b968d.webp", usageCount: 4588, desc: "Thiệp cưới đen trắng, sang trọng" },
    { id: "t-43", slug: "thiep-cuoi-43", name: "Thiệp Cưới 43", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/5f9854a9-b3fc-48f1-b486-885200a457b0.webp", usageCount: 4200, desc: "Thiệp cưới đẹp" },
    { id: "t-21", slug: "thiep-cuoi-21", name: "Thiệp cưới 21", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/8ebb5aec-e2dc-4ac3-b3e6-400beff173c8.webp", usageCount: 4070, desc: "Thiệp cưới duyên dáng" },
    { id: "t-07", slug: "thiep-cuoi-7", name: "Thiệp cưới 7", category: "wedding", tier: "premium", thumbnail: CDN + "templates/long_thumbnail/5a508f27-c1b9-442f-8a28-2aaf51016367.webp", usageCount: 3657, desc: "Premium, thiệp cưới quý phái" },
    { id: "t-31", slug: "thiep-cuoi-31", name: "Thiệp cưới 31", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/d9094782-edf0-4a6c-935d-6c0c8c85ec16.webp", usageCount: 3576, desc: "Thiệp cưới hoa lá" },
    { id: "t-30", slug: "thiep-cuoi-30", name: "Thiệp cưới 30", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/2297df1e-b0f2-451d-b381-8484df3d954a.webp", usageCount: 3585, desc: "Thiệp cưới vintage" },
    { id: "t-04", slug: "thiep-cuoi-4", name: "Thiệp cưới 4", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/6b427ff42d4d9c13c55c.webp", usageCount: 3540, desc: "Thiệp cưới phong cách" },
    { id: "t-14", slug: "thiep-cuoi-14", name: "Thiệp cưới 14", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/9e12caf2-8536-4533-9510-7e6f1d2bb580.webp", usageCount: 3323, desc: "Thiệp cưới pastel" },
    { id: "t-15", slug: "thiep-cuoi-15", name: "Thiệp cưới 15", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/4b4ae2bf-1cbb-454f-97e6-ad18347e260f.webp", usageCount: 3113, desc: "Thiệp cưới hoa cỏ" },
    { id: "t-03", slug: "thiep-cuoi-3", name: "Thiệp cưới 3", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/f7d2dc3e258994d7cd98.webp", usageCount: 3102, desc: "Thiệp cưới tối giản" },
    { id: "t-55", slug: "thiep-cuoi-55", name: "Thiệp cưới 55", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/3a1be50a-fb53-4fe8-a4a1-49f42bdad909_1768714525.webp", usageCount: 2992, desc: "Thiệp cưới tone ấm" },
    { id: "t-10", slug: "thiep-cuoi-10", name: "Thiệp cưới 10", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/d563e157-0ce9-45ca-886d-c51597654b9e.webp", usageCount: 2895, desc: "Thiệp cưới nhẹ nhàng" },
    { id: "t-50", slug: "thiep-cuoi-50", name: "Thiệp cưới 50", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/e0c6fead-4264-4160-96ec-41453a44f49d_1765806349.webp", usageCount: 2813, desc: "Thiệp cưới xanh dịu" },
    { id: "t-24", slug: "thiep-cuoi-24", name: "Thiệp cưới 24", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/3c9d5f5c-f064-4ce7-92e5-9b041af1ff16.webp", usageCount: 2651, desc: "Thiệp cưới mùa hè" },
    { id: "t-18", slug: "thiep-cuoi-18", name: "Thiệp cưới 18", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/d75f03f4-0fcb-4e48-936f-87b60a521019.webp", usageCount: 2580, desc: "Thiệp cưới retro" },
    { id: "t-41", slug: "thiep-cuoi-41", name: "Thiệp cưới 41", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/cc9e76d5-6930-429d-afef-eb273b60486f.webp", usageCount: 2495, desc: "Thiệp cưới tone trầm" },
    { id: "t-57", slug: "thiep-cuoi-57", name: "Thiệp cưới 57", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/d0b50b46-aeb0-4787-950d-2ad16e95ed6b_1770798662.webp", usageCount: 2383, desc: "Thiệp cưới mới 2026" },
    { id: "t-37", slug: "thiep-cuoi-37", name: "Thiệp cưới 37", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/fde6b6bf-7a58-4854-a605-8b894541235d.webp", usageCount: 2160, desc: "Thiệp cưới thanh lịch" },
    { id: "t-06", slug: "thiep-cuoi-6", name: "Thiệp cưới 6", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/a7d21c98b350e46ff982.webp", usageCount: 1965, desc: "Thiệp cưới cổ điển" },
    { id: "t-32", slug: "thiep-cuoi-32", name: "Thiệp cưới 32", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/fbacc9af-425f-4eff-8d9d-1bd3e5b31d7b.webp", usageCount: 1790, desc: "Thiệp cưới hoa hồng" },
    { id: "t-34", slug: "thiep-cuoi-34", name: "Thiệp cưới 34", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/8575bc5c-a8fb-4db1-9196-eda871e6c9f2.webp", usageCount: 1699, desc: "Thiệp cưới floral" },
    { id: "t-20", slug: "thiep-cuoi-20", name: "Thiệp cưới 20", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/950b4ce8-b6d1-42b4-9873-5b365b980e5a.webp", usageCount: 1617, desc: "Thiệp cưới ngọt ngào" },
    { id: "t-35", slug: "thiep-cuoi-35", name: "Thiệp cưới 35", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/58730a4f-39c9-40e8-9895-0f1ca52b6d19.webp", usageCount: 1454, desc: "Thiệp cưới tươi mới" },
    { id: "t-09", slug: "thiep-cuoi-9", name: "Thiệp cưới 9", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/5d72210e-4b00-4051-a353-e625bb04d021.webp", usageCount: 1438, desc: "Thiệp cưới vintage" },
    { id: "t-33", slug: "thiep-cuoi-33", name: "Thiệp cưới 33", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/97315700-6655-4e8c-9e39-4fcc2dd58e5a.webp", usageCount: 1353, desc: "Thiệp cưới minimalist" },
    { id: "t-22", slug: "thiep-cuoi-22", name: "Thiệp cưới 22", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/93687287-5077-4522-a0ac-1400ee724ce2.webp", usageCount: 1059, desc: "Thiệp cưới thanh nhã" },
    { id: "t-25", slug: "thiep-cuoi-25", name: "Thiệp cưới 25", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/9457be2d-7b5a-47d5-a9cb-0614576116c1.webp", usageCount: 887, desc: "Thiệp cưới tone sáng" },
    { id: "t-54", slug: "thiep-cuoi-54", name: "Thiệp cưới 54", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/9108532d-cae0-4229-89c0-3be4c04b472f_1770022563.webp", usageCount: 772, desc: "Thiệp cưới tinh tế" },
    { id: "t-60", slug: "thiep-cuoi-60", name: "Thiệp cưới 60", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/6e37afe3-3ba2-42a3-8c39-350a7d492d22_1772556864.webp", usageCount: 841, desc: "Thiệp cưới mới nhất" },
    { id: "t-13", slug: "thiep-cuoi-13", name: "Thiệp cưới 13", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/d40913ef-e700-4ed3-8670-36b0ddbd9db0.webp", usageCount: 850, desc: "Thiệp cưới garden" },
    { id: "t-26", slug: "thiep-cuoi-26", name: "Thiệp cưới 26", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/1858d9e4-acc2-4bdd-a4c5-cc40fbc557ea.webp", usageCount: 735, desc: "Thiệp cưới nature" },
    { id: "t-29", slug: "thiep-cuoi-29", name: "Thiệp cưới 29", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/e76cd240-fdb9-4726-bfd3-3dd5bc1d0eee.webp", usageCount: 727, desc: "Thiệp cưới bohemian" },
    { id: "t-27", slug: "thiep-cuoi-27", name: "Thiệp cưới 27", category: "wedding", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/f541d1cf-4104-479a-857c-a1f13456eb30.webp", usageCount: 437, desc: "Thiệp cưới rustic" },
    // ── BIRTHDAY (6) ──
    { id: "t-sn01", slug: "thiep-sinh-nhat-01", name: "Thiệp sinh nhật 01", category: "birthday", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/24ee195b-972f-4679-9b99-e8eed392932d.webp", usageCount: 4051, desc: "Thiệp sinh nhật rực rỡ" },
    { id: "t-sn06", slug: "thiep-sinh-nhat-06", name: "Thiệp sinh nhật 06", category: "birthday", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/1745ba59-703d-4c2a-9f10-f18fa1dfe932.webp", usageCount: 2561, desc: "Thiệp sinh nhật hiện đại" },
    { id: "t-sn05", slug: "thiep-sinh-nhat-05", name: "Thiệp sinh nhật 05", category: "birthday", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/cc8a0656-b177-440c-b815-021a57cd9d57.webp", usageCount: 1953, desc: "Thiệp sinh nhật party" },
    { id: "t-sn02", slug: "thiep-sinh-nhat-02", name: "Thiệp sinh nhật 02", category: "birthday", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/5058a82f-e399-43c5-af6a-c373adc7d541.webp", usageCount: 1384, desc: "Thiệp sinh nhật vui vẻ" },
    { id: "t-sn04", slug: "thiep-sinh-nhat-04", name: "Thiệp sinh nhật 04", category: "birthday", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/a7ed865c-d572-44f9-9fa7-eaf968af4b05.webp", usageCount: 720, desc: "Thiệp sinh nhật cute" },
    { id: "t-sn03", slug: "thiep-sinh-nhat-03", name: "Thiệp sinh nhật 03", category: "birthday", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/1e592af3-aaac-4709-b3cf-3001564b15c5.webp", usageCount: 647, desc: "Thiệp sinh nhật đáng yêu" },
    // ── GRADUATION (3) ──
    { id: "t-tn01", slug: "thiep-tot-nghiep-1", name: "Thiệp tốt nghiệp 1", category: "graduation", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/b576bcf6-abdf-428e-a002-18787cdfab8c.webp", usageCount: 2118, desc: "Thiệp tốt nghiệp trang trọng" },
    { id: "t-tn03", slug: "thiep-tot-nghiep-3", name: "Thiệp tốt nghiệp 3", category: "graduation", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/c77202cd-13db-4545-b4d1-61a48b238649.webp", usageCount: 1262, desc: "Thiệp tốt nghiệp sáng tạo" },
    { id: "t-tn02", slug: "thiep-tot-nghiep-2", name: "Thiệp tốt nghiệp 2", category: "graduation", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/b2adc2a9-1542-4623-9379-df3d5407d093.webp", usageCount: 695, desc: "Thiệp tốt nghiệp học thuật" },
    // ── EVENTS (4) ──
    { id: "t-ky01", slug: "thiep-ky-yeu-mau1", name: "Thiệp Kỷ Yếu 01", category: "event", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/2d3f9e31-6be4-46b5-a815-5fd2a9b568cf_1770022514.webp", usageCount: 533, desc: "Thiệp kỷ yếu đẹp" },
    { id: "t-ky02", slug: "thiep-ky-yeu-mau2", name: "Thiệp Kỷ Yếu 02", category: "event", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/f4ce10de-7695-4976-bceb-10caf599d06d_1770022535.webp", usageCount: 1178, desc: "Thiệp kỷ yếu hiện đại" },
    { id: "t-tg01", slug: "thiep-tan-gia-1", name: "Thiệp Tân Gia 1", category: "event", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/b4fd3107-f6d1-4714-b210-8295623db669_1765805653.webp", usageCount: 574, desc: "Thiệp tân gia mới nhà" },
    { id: "t-tg02", slug: "thiep-tan-gia-2", name: "Thiệp Tân Gia 2", category: "event", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/7927269f-331e-4379-990d-4892553c357b_1765805621.webp", usageCount: 541, desc: "Thiệp tân gia đẹp" },
    { id: "t-vl01", slug: "thiep-valentine-1", name: "Thiệp Valentine", category: "event", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/61381a9c-7aee-4dc2-8451-6c82e649afdc_1770867338.webp", usageCount: 583, desc: "Thiệp valentine lãng mạn" },
    { id: "t-tn3", slug: "tiec-tat-nien-3", name: "Tiệc Tất Niên 3", category: "event", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/f6f8612f-470c-4bb7-85a8-31fe1f25b65b_1768715117.webp", usageCount: 449, desc: "Thiệp tiệc tất niên" },
    { id: "t-tn4", slug: "thiep-tat-nien-4", name: "Tiệc Tất Niên 4", category: "event", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/bb722b44-e4f9-4253-801d-7a31bcaa81bb_1770022483.webp", usageCount: 496, desc: "Thiệp tiệc year-end" },
    { id: "t-tn1", slug: "tiec-tat-nien-1", name: "Tiệc Tất Niên 1", category: "event", tier: "basic", thumbnail: CDN + "templates/long_thumbnail/b9e8dafd-a1f5-446d-b716-ed382ff4f250_1765805585.webp", usageCount: 719, desc: "Tiệc tất niên sôi động" },
];

const CATEGORIES = [
    { key: "all", label: "Tất cả" },
    { key: "wedding", label: "Thiệp cưới" },
    { key: "birthday", label: "Thiệp sinh nhật" },
    { key: "graduation", label: "Thiệp tốt nghiệp" },
    { key: "event", label: "Sự kiện" },
];

/* ──────────────────
   TEMPLATE CARD
   ────────────────── */
function TemplateCard({
    template,
    onPreview,
}: {
    template: (typeof TEMPLATES)[0];
    onPreview: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Intersection Observer fade-in
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add("card-visible"); obs.unobserve(el); } },
            { threshold: 0.1 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className="card-animate"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                background: "#fff",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
                boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
                transform: hovered ? "translateY(-3px)" : "none",
            }}
            onClick={onPreview}
        >
            {/* Thumbnail */}
            <div style={{ position: "relative", paddingBottom: "140%", overflow: "hidden" }}>
                <img
                    src={template.thumbnail}
                    alt={template.name}
                    loading="lazy"
                    style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        transform: hovered ? "scale(1.05)" : "scale(1)",
                    }}
                />

                {/* BASIC / PREMIUM / FREE Badge */}
                <span style={{
                    position: "absolute", top: 8, left: 8, zIndex: 2,
                    padding: "3px 8px", borderRadius: 4,
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                    background: template.tier === "premium" ? "#9333EA" : template.tier === "free" ? "#10B981" : "#3B82F6",
                    color: "#fff",
                }}>
                    {template.tier === "premium" ? "PREMIUM" : template.tier === "free" ? "FREE" : "BASIC"}
                </span>

                {/* Premium lock overlay — always visible on premium cards */}
                {template.tier === "premium" && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 4,
                            background: "linear-gradient(0deg, rgba(109,40,217,0.92) 0%, transparent 100%)",
                            padding: "40px 12px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <span style={{ fontSize: 20 }}>🔒</span>
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#fff",
                                letterSpacing: 1,
                                textTransform: "uppercase",
                            }}
                        >
                            ⭐ Gói Premium
                        </span>
                        <a
                            href={`/pricing?from=template&id=${template.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                fontSize: 10,
                                color: "#e9d5ff",
                                fontWeight: 600,
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Nâng cấp →
                        </a>
                    </div>
                )}

                {hovered && (
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 3,
                        background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "flex-end",
                        padding: "16px 12px",
                        animation: "fadeIn 0.15s ease",
                    }}>
                        {/* Top-right: heart + views */}
                        <div style={{
                            position: "absolute", top: 8, right: 8,
                            display: "flex", gap: 8, alignItems: "center",
                        }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); /* TODO: save to favorites */ }}
                                style={{
                                    width: 30, height: 30, borderRadius: "50%",
                                    background: "rgba(255,255,255,0.9)", border: "none",
                                    cursor: "pointer", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontSize: 14,
                                }}
                                title="Yêu thích"
                            >
                                ♡
                            </button>
                            <span style={{
                                fontSize: 11, color: "#fff",
                                background: "rgba(0,0,0,0.45)",
                                padding: "3px 8px", borderRadius: 10,
                                fontWeight: 500,
                            }}>
                                {template.usageCount.toLocaleString()}
                            </span>
                        </div>

                        {/* Center: "Xem mẫu" button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onPreview(); }}
                            style={{
                                padding: "10px 24px", borderRadius: 8,
                                background: "#fff", border: "none",
                                fontSize: 13, fontWeight: 600, color: "#1f2937",
                                cursor: "pointer", marginBottom: 4,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                        >
                            Xem mẫu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ──────────────────
   PREVIEW MODAL
   ────────────────── */
function PreviewModal({
    template,
    onClose,
}: {
    template: (typeof TEMPLATES)[0];
    onClose: () => void;
}) {
    // Keyboard close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                zIndex: 50, display: "flex",
                alignItems: "center", justifyContent: "center",
                padding: 24,
                animation: "fadeIn 0.2s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff", borderRadius: 20,
                    width: "100%", maxWidth: 420,
                    maxHeight: "90vh",
                    overflow: "hidden",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
                    animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    display: "flex", flexDirection: "column",
                }}
            >
                {/* Preview Image */}
                <div style={{ position: "relative", width: "100%", paddingBottom: "140%", flexShrink: 0 }}>
                    <img
                        src={template.thumbnail}
                        alt={template.name}
                        style={{
                            position: "absolute", inset: 0,
                            width: "100%", height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute", top: 12, right: 12,
                            width: 32, height: 32, borderRadius: "50%",
                            background: "rgba(0,0,0,0.5)", border: "none",
                            color: "#fff", fontSize: 16, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >
                        ✕
                    </button>

                    {/* Badge */}
                    <span style={{
                        position: "absolute", top: 12, left: 12,
                        padding: "4px 10px", borderRadius: 6,
                        fontSize: 11, fontWeight: 700,
                        background: template.tier === "premium" ? "#9333EA" : template.tier === "free" ? "#10B981" : "#3B82F6",
                        color: "#fff",
                    }}>
                        {template.tier === "premium" ? "PREMIUM" : template.tier === "free" ? "FREE" : "BASIC"}
                    </span>
                </div>

                {/* Info + Actions */}
                <div style={{ padding: "16px 20px 20px" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>
                        {template.name}
                    </h2>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px", lineHeight: 1.4 }}>
                        {template.desc}
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 16px" }}>
                        👁 {template.usageCount.toLocaleString()} lượt sử dụng
                    </p>

                    <div style={{ display: "flex", gap: 10 }}>
                        <Link
                            href={`/editor/new?template=${template.slug}`}
                            style={{
                                flex: 1, padding: "12px 0", borderRadius: 10,
                                background: "#EF7E90",
                                color: "#fff", fontSize: 14, fontWeight: 700,
                                textAlign: "center", textDecoration: "none",
                                display: "block",
                            }}
                        >
                            Dùng thử
                        </Link>
                        <Link
                            href={`/i/preview/${template.slug}`}
                            style={{
                                flex: 1, padding: "12px 0", borderRadius: 10,
                                border: "1px solid #e5e7eb", background: "#fff",
                                color: "#374151", fontSize: 14, fontWeight: 600,
                                textAlign: "center", textDecoration: "none",
                                display: "block",
                            }}
                        >
                            Xem trực tiếp
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────
   MAIN PAGE
   ────────────────── */
export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeTier, setActiveTier] = useState<"all" | "free" | "basic" | "premium">("all");
    const [previewTemplate, setPreviewTemplate] = useState<(typeof TEMPLATES)[0] | null>(null);

    const filtered = TEMPLATES.filter((t) => {
        if (activeCategory !== "all" && t.category !== activeCategory) return false;
        if (activeTier !== "all" && t.tier !== activeTier) return false;
        return true;
    });

    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* ── Navbar ── */}
            <nav style={{
                background: "#fff",
                borderBottom: "1px solid #eee",
                padding: "12px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 40,
            }}>
                <Link href="/" style={{
                    display: "flex", alignItems: "center", gap: 8,
                    textDecoration: "none", color: "#EF7E90",
                    fontSize: 20, fontWeight: 700,
                }}>
                    <span style={{ fontSize: 24 }}>💌</span> 7app
                </Link>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                    <Link href="/" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Trang chủ</Link>
                    <Link href="/templates" style={{ fontSize: 13, color: "#EF7E90", fontWeight: 600, textDecoration: "none" }}>Mẫu thiệp</Link>
                    <Link href="/blog" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Blog</Link>
                    <Link href="/dashboard" style={{
                        padding: "8px 18px", borderRadius: 8,
                        background: "#EF7E90", color: "#fff",
                        fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}>
                        Tạo thiệp
                    </Link>
                </div>
            </nav>

            {/* ── Page Header ── */}
            <div style={{
                textAlign: "center",
                padding: "48px 24px 32px",
                background: "#fff",
                borderBottom: "1px solid #f0f0f0",
            }}>
                <h1 style={{
                    fontSize: 32, fontWeight: 700, color: "#1f2937",
                    margin: "0 0 8px",
                }}>
                    Mẫu thiệp online đẹp
                </h1>
                <p style={{
                    fontSize: 15, color: "#6b7280",
                    margin: "0 0 24px", maxWidth: 500, marginInline: "auto",
                }}>
                    Khám phá {TEMPLATES.length}+ mẫu thiệp điện tử: cưới, sinh nhật, sự kiện, kỷ niệm — chỉnh sửa tự do tại 7app
                </p>

                {/* Category Pills + Tier Filter */}
                <div style={{
                    display: "flex", gap: 8, justifyContent: "center",
                    flexWrap: "wrap", marginBottom: 12,
                }}>
                    {CATEGORIES.map((cat) => (
                        <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                            padding: "8px 18px", borderRadius: 20,
                            border: "1px solid " + (activeCategory === cat.key ? "#EF7E90" : "#e5e7eb"),
                            fontSize: 13, fontWeight: activeCategory === cat.key ? 600 : 400,
                            cursor: "pointer",
                            background: activeCategory === cat.key ? "#EF7E90" : "#fff",
                            color: activeCategory === cat.key ? "#fff" : "#4b5563",
                            transition: "all 0.2s",
                        }}>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Breadcrumb + Tier filter row */}
                <div style={{
                    maxWidth: 1200, margin: "0 auto", padding: "0 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                        ☆ Trang chủ / Mẫu thiệp · {filtered.length} mẫu
                    </p>
                    <select
                        value={activeTier}
                        onChange={(e) => setActiveTier(e.target.value as "all" | "free" | "basic" | "premium")}
                        style={{
                            padding: "6px 12px", borderRadius: 8,
                            border: "1px solid #e5e7eb", fontSize: 12,
                            color: "#6b7280", background: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <option value="all">Tất cả gói</option>
                        <option value="free">FREE</option>
                        <option value="basic">BASIC</option>
                        <option value="premium">PREMIUM</option>
                    </select>
                </div>
            </div>

            {/* ── Template Grid (6-col desktop) ── */}
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "24px 16px 60px" }}>
                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
                        <p style={{ fontSize: 48, margin: "0 0 12px" }}>🔍</p>
                        <p style={{ fontSize: 16 }}>Không tìm thấy mẫu phù hợp</p>
                    </div>
                )}
                <div className="templates-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 14,
                }}>
                    {filtered.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onPreview={() => setPreviewTemplate(template)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Footer ── */}
            <footer style={{
                borderTop: "1px solid #eee", background: "#fff",
                padding: "24px", textAlign: "center",
            }}>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                    © 2026 7app.online — Thiệp mời trực tuyến đẹp nhất Việt Nam
                </p>
            </footer>

            {/* ── Preview Modal ── */}
            {previewTemplate && (
                <PreviewModal
                    template={previewTemplate}
                    onClose={() => setPreviewTemplate(null)}
                />
            )}

            {/* ── CSS Animations + Responsive ── */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }

                .card-animate {
                    opacity: 0;
                    transform: translateY(24px);
                    transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease;
                }
                .card-visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }

                /* Responsive grid */
                @media (max-width: 1200px) {
                    div[style*="grid-template-columns: repeat(6"] {
                        /* handled via style override below */
                    }
                }
            `}</style>

            {/* Responsive override via <style> for grid columns */}
            <style>{`
                @media (max-width: 480px) {
                    .templates-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
                    nav { padding: 10px 16px !important; }
                    nav > div:last-child > a:not(:last-child) { display: none !important; }
                }
                @media (min-width: 481px) and (max-width: 768px) {
                    .templates-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (min-width: 769px) and (max-width: 1024px) {
                    .templates-grid { grid-template-columns: repeat(4, 1fr) !important; }
                }
            `}</style>
        </div>
    );
}
