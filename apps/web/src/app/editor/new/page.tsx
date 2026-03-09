"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";

// Template canvas presets — match the visual editor's background list
const TEMPLATE_CANVAS_PRESETS: Record<string, {
    bg: string;
    elements: Array<{
        type: "text";
        text: string;
        x: number; y: number;
        width: number; height: number;
        fontSize: number;
        fontFamily: string;
        fontWeight: "normal" | "bold";
        fontStyle: "normal" | "italic";
        color: string;
        textAlign: "left" | "center" | "right";
        lineHeight: number;
    }>;
}> = {
    "rose-garden": {
        bg: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
        elements: [
            { type: "text", text: "✿ ❀ ✿", x: 20, y: 60, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#be185d", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Trân trọng kính mời", x: 20, y: 120, width: 350, height: 40, fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#9f1239", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 175, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#831843", textAlign: "center", lineHeight: 1.3 },
            { type: "text", text: "cùng gia đình hai bên\nân hạnh kính mời", x: 20, y: 260, width: 350, height: 60, fontSize: 14, fontFamily: "'Lora', serif", fontWeight: "normal", fontStyle: "italic", color: "#9f1239", textAlign: "center", lineHeight: 1.6 },
            { type: "text", text: "ngày 28 · tháng 05 · năm 2026", x: 20, y: 340, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#78350f", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "lúc 10:00 sáng", x: 20, y: 390, width: 350, height: 36, fontSize: 15, fontFamily: "'Lora', serif", fontWeight: "normal", fontStyle: "italic", color: "#831843", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Trung tâm Tiệc cưới Diamond Palace\n123 Nguyễn Huệ, Quận 1, TP.HCM", x: 20, y: 440, width: 350, height: 60, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#374151", textAlign: "center", lineHeight: 1.6 },
            { type: "text", text: "❀ ✿ ❀", x: 20, y: 520, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#be185d", textAlign: "center", lineHeight: 1.4 },
        ],
    },
    "midnight-romance": {
        bg: "linear-gradient(180deg, #0f0825 0%, #1a0a3e 30%, #2d1b69 100%)",
        elements: [
            { type: "text", text: "☆ ✧ ☆", x: 20, y: 60, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#c084fc", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "We joyfully invite you to celebrate", x: 20, y: 110, width: 350, height: 36, fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#e9d5ff", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 160, width: 350, height: 70, fontSize: 32, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#f5f3ff", textAlign: "center", lineHeight: 1.3 },
            { type: "text", text: "28 · 05 · 2026", x: 20, y: 250, width: 350, height: 44, fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#c084fc", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Diamond Palace Ballroom\nTP. Hồ Chí Minh", x: 20, y: 310, width: 350, height: 56, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#e9d5ff", textAlign: "center", lineHeight: 1.6 },
            { type: "text", text: "✧ ☆ ✧", x: 20, y: 390, width: 350, height: 40, fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#c084fc", textAlign: "center", lineHeight: 1.4 },
        ],
    },
    "golden-hour": {
        bg: "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)",
        elements: [
            { type: "text", text: "❋ ✤ ❋", x: 20, y: 60, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#d97706", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#92400e", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#78350f", textAlign: "center", lineHeight: 1.3 },
            { type: "text", text: "28 · tháng 05 · 2026  |  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#b45309", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Diamond Palace, TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#44403c", textAlign: "center", lineHeight: 1.5 },
            { type: "text", text: "✤ ❋ ✤", x: 20, y: 365, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#d97706", textAlign: "center", lineHeight: 1.4 },
        ],
    },
    "cherry-blossom": {
        bg: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)",
        elements: [
            { type: "text", text: "❀ 🌸 ❀", x: 20, y: 60, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#ec4899", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Trân trọng kính mời", x: 20, y: 115, width: 350, height: 36, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: "normal", fontStyle: "italic", color: "#9d174d", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Tên Chú Rể & Tên Cô Dâu", x: 20, y: 163, width: 350, height: 70, fontSize: 34, fontFamily: "'Dancing Script', cursive", fontWeight: "bold", fontStyle: "italic", color: "#831843", textAlign: "center", lineHeight: 1.3 },
            { type: "text", text: "28 · 05 · 2026  ·  10:00 sáng", x: 20, y: 248, width: 350, height: 44, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold", fontStyle: "normal", color: "#9d174d", textAlign: "center", lineHeight: 1.4 },
            { type: "text", text: "Diamond Palace  •  TP.HCM", x: 20, y: 305, width: 350, height: 40, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: "normal", fontStyle: "normal", color: "#374151", textAlign: "center", lineHeight: 1.5 },
            { type: "text", text: "🌸 ❀ 🌸", x: 20, y: 365, width: 350, height: 40, fontSize: 22, fontFamily: "'Georgia', serif", fontWeight: "normal", fontStyle: "normal", color: "#ec4899", textAlign: "center", lineHeight: 1.4 },
        ],
    },
};

// Default template for any unknown slug
const DEFAULT_PRESET = TEMPLATE_CANVAS_PRESETS["rose-garden"];

function buildTemplateCanvasJson(templateSlug: string): string {
    const preset = TEMPLATE_CANVAS_PRESETS[templateSlug] ?? DEFAULT_PRESET;
    return JSON.stringify({
        version: 1,
        canvas: { width: 390, height: 844, bg: preset.bg },
        elements: preset.elements.map((el, i) => ({
            id: `el-${i + 1}`,
            type: el.type,
            x: el.x, y: el.y,
            width: el.width, height: el.height,
            rotation: 0, opacity: 1,
            zIndex: i + 1, locked: false,
            props: {
                text: el.text,
                fontSize: el.fontSize,
                fontFamily: el.fontFamily,
                fontWeight: el.fontWeight,
                fontStyle: el.fontStyle,
                color: el.color,
                textAlign: el.textAlign,
                lineHeight: el.lineHeight,
            },
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
