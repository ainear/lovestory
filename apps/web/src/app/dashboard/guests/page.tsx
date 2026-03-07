import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GuestList } from "./_components/GuestList";

export default async function GuestsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Load user's projects for the selector
    const { data: projects } = await supabase
        .from("projects")
        .select("id, title, slug")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lovestory.app";

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>
                    👥 Danh sách khách mời
                </h2>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                    Quản lý danh sách khách và gửi link thiệp cá nhân hóa
                </p>
            </div>

            {/* No projects state */}
            {(!projects || projects.length === 0) && (
                <div style={{
                    background: "#fff", borderRadius: 20, padding: "60px 40px",
                    textAlign: "center", border: "1px solid #e8e8ec",
                }}>
                    <p style={{ fontSize: 48, margin: "0 0 16px" }}>💌</p>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: "0 0 8px" }}>
                        Chưa có thiệp nào
                    </h3>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>
                        Hãy tạo thiệp cưới trước khi quản lý danh sách khách.
                    </p>
                    <a
                        href="/templates"
                        style={{
                            display: "inline-block", padding: "12px 28px", borderRadius: 12,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none",
                        }}
                    >
                        🎨 Tạo thiệp ngay
                    </a>
                </div>
            )}

            {/* Guest management UI */}
            {projects && projects.length > 0 && (
                <GuestList
                    projects={projects.map(p => ({
                        id: p.id,
                        title: p.title || "",
                        slug: p.slug || "",
                    }))}
                    appUrl={appUrl}
                />
            )}
        </div>
    );
}
