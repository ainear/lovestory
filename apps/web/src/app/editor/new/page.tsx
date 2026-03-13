"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";

// ════════════════════════════════════════════════
//  75 Cinelove templates — use long_thumbnail as
//  canvas background image (proxied via Next.js)
// ════════════════════════════════════════════════

const CDN = "/cinelove-cdn/";

/** Cinelove slug → long_thumbnail path (from templates.json) */
const CINELOVE_BG: Record<string, string> = {
    // ── Top Wedding (sorted by usage) ──
    "thiep-cuoi-42": "templates/long_thumbnail/5731de59-c0f3-4fa7-9860-e5e47b829ce3.webp",
    "thiep-cuoi-39": "templates/long_thumbnail/a2f11727-8717-46db-ada4-ff29271ce53b.webp",
    "thiep-cuoi-46": "templates/long_thumbnail/efd815e3-41ff-4eb3-b31b-c25b202bc08c_1762512003.webp",
    "thiep-cuoi-38": "templates/long_thumbnail/7e64b0eb-9b5b-497f-b09e-3d3024571dfa.webp",
    "thiep-cuoi-36": "templates/long_thumbnail/e554cdff-72d4-4657-863a-68cf83b61fe3.webp",
    "thiep-cuoi-44": "templates/long_thumbnail/0189eb35-5cf1-4525-a8d0-867f70e0bf67.webp",
    "thiep-cuoi-40": "templates/long_thumbnail/cbe1c609-0b73-42f5-8d29-81404f0c5bfe.webp",
    "thiep-cuoi-16": "templates/long_thumbnail/8d4b8ad3-0d91-4cba-9e16-e5c2de3275b4.webp",
    "thiep-cuoi-47": "templates/long_thumbnail/6c40c8a5-5ead-4723-abff-bcb98f19d403_1762676162.webp",
    "thiep-cuoi-48": "templates/long_thumbnail/77a0f81e-67af-4f30-91b6-73c5e5ce6aea_1763195257.webp",
    "thiep-cuoi-19": "templates/long_thumbnail/26ead6d0-bed0-4e61-877b-901b18aab1df.webp",
    "thiep-cuoi-tone-xanh": "templates/long_thumbnail/c6238e18-d92b-4eea-ba14-3fe832517e62_1762512018.webp",
    "thiep-cuoi-2": "templates/long_thumbnail/c9e80a57234fb12dd764.webp",
    "thiep-cuoi-5": "templates/long_thumbnail/bdc44f064724f87aa135.webp",
    "thiep-cuoi-23": "templates/long_thumbnail/5913a014-9fc0-4a7d-aa73-31416a84d0b7.webp",
    "thiep-cuoi-8": "templates/long_thumbnail/9afa4639-e512-4490-8a28-def233513413.webp",
    "thiep-cuoi-53": "templates/long_thumbnail/a038df05-e9a9-408e-bd48-3cd7a239bbc4_1767931340.webp",
    "thiep-cuoi-28": "templates/long_thumbnail/248881a1-7da2-4232-b69b-c39d393f0b91.webp",
    "thiep-cuoi-11": "templates/long_thumbnail/1bf25163-6f28-4430-a67a-553274c679ea.webp",
    "thiep-cuoi-49": "templates/long_thumbnail/314cf592-7bb3-4067-aeb0-e259db6b6c31_1765806090.webp",
    "thiep-cuoi-1": "templates/long_thumbnail/f4b65e20983dd71aa541.webp",
    "thiep-cuoi-17": "templates/long_thumbnail/47b0118b-1f91-4622-8061-f7002f6d5aaf.webp",
    "thiep-cuoi-56": "templates/long_thumbnail/428a253a-0bb7-412b-8861-ec12c5f06582_1770022452.webp",
    "thiep-cuoi-52": "templates/long_thumbnail/6b90e268-6745-48d2-95dc-6d0e5fc22981_1765795744.webp",
    "thiep-cuoi-12": "templates/long_thumbnail/128f51ee-4b37-4f6f-92c7-8629673d3d3c.webp",
    "thiep-bw-1": "templates/long_thumbnail/416b30bd-bedf-44ab-b0b8-63d1530b968d.webp",
    "thiep-cuoi-43": "templates/long_thumbnail/5f9854a9-b3fc-48f1-b486-885200a457b0.webp",
    "thiep-cuoi-21": "templates/long_thumbnail/8ebb5aec-e2dc-4ac3-b3e6-400beff173c8.webp",
    "thiep-cuoi-7": "templates/long_thumbnail/5a508f27-c1b9-442f-8a28-2aaf51016367.webp",
    "thiep-cuoi-31": "templates/long_thumbnail/d9094782-edf0-4a6c-935d-6c0c8c85ec16.webp",
    "thiep-cuoi-30": "templates/long_thumbnail/2297df1e-b0f2-451d-b381-8484df3d954a.webp",
    "thiep-cuoi-4": "templates/long_thumbnail/6b427ff42d4d9c13c55c.webp",
    "thiep-cuoi-14": "templates/long_thumbnail/9e12caf2-8536-4533-9510-7e6f1d2bb580.webp",
    "thiep-cuoi-15": "templates/long_thumbnail/4b4ae2bf-1cbb-454f-97e6-ad18347e260f.webp",
    "thiep-cuoi-3": "templates/long_thumbnail/f7d2dc3e258994d7cd98.webp",
    "thiep-cuoi-55": "templates/long_thumbnail/3a1be50a-fb53-4fe8-a4a1-49f42bdad909_1768714525.webp",
    "thiep-cuoi-10": "templates/long_thumbnail/d563e157-0ce9-45ca-886d-c51597654b9e.webp",
    "thiep-cuoi-50": "templates/long_thumbnail/e0c6fead-4264-4160-96ec-41453a44f49d_1765806349.webp",
    "thiep-cuoi-24": "templates/long_thumbnail/3c9d5f5c-f064-4ce7-92e5-9b041af1ff16.webp",
    "thiep-cuoi-18": "templates/long_thumbnail/d75f03f4-0fcb-4e48-936f-87b60a521019.webp",
    "thiep-cuoi-41": "templates/long_thumbnail/cc9e76d5-6930-429d-afef-eb273b60486f.webp",
    "thiep-cuoi-57": "templates/long_thumbnail/d0b50b46-aeb0-4787-950d-2ad16e95ed6b_1770798662.webp",
    "thiep-cuoi-37": "templates/long_thumbnail/fde6b6bf-7a58-4854-a605-8b894541235d.webp",
    "thiep-cuoi-6": "templates/long_thumbnail/a7d21c98b350e46ff982.webp",
    "thiep-cuoi-32": "templates/long_thumbnail/fbacc9af-425f-4eff-8d9d-1bd3e5b31d7b.webp",
    "thiep-cuoi-34": "templates/long_thumbnail/8575bc5c-a8fb-4db1-9196-eda871e6c9f2.webp",
    "thiep-cuoi-20": "templates/long_thumbnail/950b4ce8-b6d1-42b4-9873-5b365b980e5a.webp",
    "thiep-cuoi-35": "templates/long_thumbnail/58730a4f-39c9-40e8-9895-0f1ca52b6d19.webp",
    "thiep-cuoi-9": "templates/long_thumbnail/5d72210e-4b00-4051-a353-e625bb04d021.webp",
    "thiep-cuoi-33": "templates/long_thumbnail/97315700-6655-4e8c-9e39-4fcc2dd58e5a.webp",
    "thiep-cuoi-22": "templates/long_thumbnail/93687287-5077-4522-a0ac-1400ee724ce2.webp",
    "thiep-cuoi-25": "templates/long_thumbnail/9457be2d-7b5a-47d5-a9cb-0614576116c1.webp",
    "thiep-cuoi-54": "templates/long_thumbnail/9108532d-cae0-4229-89c0-3be4c04b472f_1770022563.webp",
    "thiep-cuoi-60": "templates/long_thumbnail/6e37afe3-3ba2-42a3-8c39-350a7d492d22_1772556864.webp",
    "thiep-cuoi-13": "templates/long_thumbnail/d40913ef-e700-4ed3-8670-36b0ddbd9db0.webp",
    "thiep-cuoi-26": "templates/long_thumbnail/1858d9e4-acc2-4bdd-a4c5-cc40fbc557ea.webp",
    "thiep-cuoi-29": "templates/long_thumbnail/e76cd240-fdb9-4726-bfd3-3dd5bc1d0eee.webp",
    "thiep-cuoi-27": "templates/long_thumbnail/f541d1cf-4104-479a-857c-a1f13456eb30.webp",
    // ── Birthday (6) ──
    "thiep-sinh-nhat-01": "templates/long_thumbnail/24ee195b-972f-4679-9b99-e8eed392932d.webp",
    "thiep-sinh-nhat-06": "templates/long_thumbnail/1745ba59-703d-4c2a-9f10-f18fa1dfe932.webp",
    "thiep-sinh-nhat-05": "templates/long_thumbnail/cc8a0656-b177-440c-b815-021a57cd9d57.webp",
    "thiep-sinh-nhat-02": "templates/long_thumbnail/5058a82f-e399-43c5-af6a-c373adc7d541.webp",
    "thiep-sinh-nhat-04": "templates/long_thumbnail/a7ed865c-d572-44f9-9fa7-eaf968af4b05.webp",
    "thiep-sinh-nhat-03": "templates/long_thumbnail/1e592af3-aaac-4709-b3cf-3001564b15c5.webp",
    // ── Graduation (3) ──
    "thiep-tot-nghiep-1": "templates/long_thumbnail/b576bcf6-abdf-428e-a002-18787cdfab8c.webp",
    "thiep-tot-nghiep-3": "templates/long_thumbnail/c77202cd-13db-4545-b4d1-61a48b238649.webp",
    "thiep-tot-nghiep-2": "templates/long_thumbnail/b2adc2a9-1542-4623-9379-df3d5407d093.webp",
    // ── Events (8) ──
    "thiep-ky-yeu-mau1": "templates/long_thumbnail/2d3f9e31-6be4-46b5-a815-5fd2a9b568cf_1770022514.webp",
    "thiep-ky-yeu-mau2": "templates/long_thumbnail/f4ce10de-7695-4976-bceb-10caf599d06d_1770022535.webp",
    "thiep-tan-gia-1": "templates/long_thumbnail/b4fd3107-f6d1-4714-b210-8295623db669_1765805653.webp",
    "thiep-tan-gia-2": "templates/long_thumbnail/7927269f-331e-4379-990d-4892553c357b_1765805621.webp",
    "thiep-valentine-1": "templates/long_thumbnail/61381a9c-7aee-4dc2-8451-6c82e649afdc_1770867338.webp",
    "tiec-tat-nien-3": "templates/long_thumbnail/f6f8612f-470c-4bb7-85a8-31fe1f25b65b_1768715117.webp",
    "thiep-tat-nien-4": "templates/long_thumbnail/bb722b44-e4f9-4253-801d-7a31bcaa81bb_1770022483.webp",
    "tiec-tat-nien-1": "templates/long_thumbnail/b9e8dafd-a1f5-446d-b716-ed382ff4f250_1765805585.webp",
};

/**
 * Standard editable text overlay elements for ALL templates.
 * These position editable text zones on top of the template background.
 * Users click to edit: names, date, venue, etc.
 */
const STANDARD_OVERLAY_ELEMENTS = [
    { id: "el-1", type: "text", x: 20, y: 30, width: 350, height: 36, rotation: 0, opacity: 0.9, zIndex: 10, locked: false, animation: { entrance: "fadeIn", loop: "none" }, props: { text: "✿ SAVE THE DATE ✿", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#ffffff", textAlign: "center", lineHeight: 1.4, textShadow: "0 1px 6px rgba(0,0,0,0.5)" } },
    { id: "el-2", type: "text", x: 20, y: 80, width: 350, height: 40, rotation: 0, opacity: 0.9, zIndex: 11, locked: false, animation: { entrance: "fadeIn", loop: "none" }, props: { text: "Trân trọng kính mời", fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#ffffff", textAlign: "center", lineHeight: 1.4, textShadow: "0 1px 6px rgba(0,0,0,0.5)" } },
    { id: "el-3", type: "text", x: 15, y: 135, width: 360, height: 80, rotation: 0, opacity: 1, zIndex: 12, locked: false, animation: { entrance: "fadeIn", loop: "none" }, props: { text: "Minh Anh & Thuỳ Linh", fontSize: 36, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#ffffff", textAlign: "center", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.6)" } },
    { id: "el-4", type: "text", x: 20, y: 230, width: 350, height: 55, rotation: 0, opacity: 0.85, zIndex: 13, locked: false, animation: { entrance: "fadeIn", loop: "none" }, props: { text: "Cùng gia đình hai bên\nân hạnh kính mời", fontSize: 14, fontFamily: "'Lora', serif", fontWeight: "normal", fontStyle: "italic", color: "#ffffff", textAlign: "center", lineHeight: 1.6, textShadow: "0 1px 4px rgba(0,0,0,0.5)" } },
    { id: "el-5", type: "text", x: 20, y: 310, width: 350, height: 50, rotation: 0, opacity: 1, zIndex: 14, locked: false, animation: { entrance: "fadeIn", loop: "none" }, props: { text: "Chủ Nhật, 28 · 05 · 2026", fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#ffffff", textAlign: "center", lineHeight: 1.3, textShadow: "0 2px 8px rgba(0,0,0,0.6)" } },
    { id: "el-6", type: "text", x: 20, y: 370, width: 350, height: 36, rotation: 0, opacity: 0.9, zIndex: 15, locked: false, animation: { entrance: "fadeIn", loop: "none" }, props: { text: "Lúc 10:00 sáng", fontSize: 16, fontFamily: "'Lora', serif", fontWeight: "normal", fontStyle: "italic", color: "#ffffff", textAlign: "center", lineHeight: 1.4, textShadow: "0 1px 4px rgba(0,0,0,0.5)" } },
    { id: "el-7", type: "text", x: 20, y: 420, width: 350, height: 70, rotation: 0, opacity: 0.85, zIndex: 16, locked: false, animation: { entrance: "fadeIn", loop: "none" }, props: { text: "Trung tâm Tiệc cưới Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#ffffff", textAlign: "center", lineHeight: 1.6, textShadow: "0 1px 4px rgba(0,0,0,0.5)" } },
    { id: "el-8", type: "text", x: 20, y: 510, width: 350, height: 36, rotation: 0, opacity: 0.7, zIndex: 17, locked: false, animation: { entrance: "fadeIn", loop: "none" }, props: { text: "Sự hiện diện của bạn là niềm vui của chúng tôi ♡", fontSize: 13, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "italic", color: "#ffffff", textAlign: "center", lineHeight: 1.4, textShadow: "0 1px 4px rgba(0,0,0,0.4)" } },
];

/** Build canvas_json — Cinelove bg + editable text overlays */
function buildTemplateCanvasJson(templateSlug: string): string {
    const bgPath = CINELOVE_BG[templateSlug];

    if (bgPath) {
        // Cinelove template: bg image + editable text overlay elements
        const bgUrl = CDN + bgPath;
        return JSON.stringify({
            version: 1,
            canvas: {
                width: 390, height: 844,
                bg: `url(${bgUrl}) center/cover no-repeat`,
            },
            elements: STANDARD_OVERLAY_ELEMENTS,
        });
    }

    // Fallback: gradient + text for unknown slugs
    return JSON.stringify({
        version: 1,
        canvas: {
            width: 390, height: 844,
            bg: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
        },
        elements: STANDARD_OVERLAY_ELEMENTS.map(el => ({
            ...el,
            props: { ...el.props, color: "#831843", textShadow: "none" },
        })),
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
            const { createBrowserClient: createClient } = await import("@supabase/ssr");
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            );

            // Auth check
            const { data: { user } } = await supabase.auth.getUser();
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
                alert("Không thể tạo thiệp. Vui lòng thử lại: " + (error?.message ?? "unknown"));
                router.push("/templates");
                return;
            }

            // Redirect to VisualEditor with the new project
            router.replace("/editor/" + project.id);
        }

        createProject();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{
            height: "100vh", display: "flex",
            flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #fdf2f8, #faf5ff)",
            gap: 16,
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "3px solid #f3e8ff",
                borderTop: "3px solid #ff6b9d",
                animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ fontSize: 16, color: "#be185d", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                💌 Đang tạo thiệp mới...
            </p>
            <p style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>
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
        <Suspense fallback={
            <div style={{
                height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "#fdf2f8",
            }}>
                <p style={{ fontSize: 16, color: "#be185d" }}>💌 Loading...</p>
            </div>
        }>
            <NewEditorInner />
        </Suspense>
    );
}
