import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import BlogList from "./BlogList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Blog — Mẹo thiệp cưới & đám cưới | LoveStory",
    description: "Chia sẻ kinh nghiệm làm thiệp cưới online, mẫu thiệp đẹp, tips tổ chức đám cưới. Cập nhật thường xuyên bởi đội ngũ LoveStory.",
    openGraph: {
        title: "Blog LoveStory — Thiệp cưới & Sự kiện",
        description: "Chia sẻ kinh nghiệm làm thiệp cưới online, mẫu thiệp đẹp, tips tổ chức đám cưới.",
        url: "https://7app.online/blog",
    },
};

const PAGE_SIZE = 6;

async function getInitialPosts() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data, error } = await supabase
            .from("blog_posts")
            .select("id, slug, title, excerpt, cover_url, tags, created_at, view_count")
            .eq("published", true)
            .order("created_at", { ascending: false })
            .limit(PAGE_SIZE);
        if (error) console.error("[Blog] fetch error:", error.message);
        return data || [];
    } catch (e) {
        console.error("[Blog] getInitialPosts exception:", e);
        return [];
    }
}

export default async function BlogPage() {
    const initialPosts = await getInitialPosts();

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#fafafa" }}>
            {/* Navigation */}
            <nav style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                    <Link href="/" style={{ fontSize: 18, fontWeight: 800, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>
                        ❤️ LoveStory
                    </Link>
                    <span style={{ color: "#d1d5db" }}>›</span>
                    <span style={{ fontSize: 14, color: "#6b7280" }}>Blog</span>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)", padding: "64px 24px", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <p style={{ fontSize: 12, letterSpacing: 3, color: "#c084fc", margin: "0 0 12px", fontWeight: 600 }}>BLOG & TIPS</p>
                    <h1 style={{ fontSize: 40, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2 }}>
                        Chuyện kể về thiệp cưới
                    </h1>
                    <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
                        Mẹo thiết kế thiệp, xu hướng đám cưới 2026, và chia sẻ từ các cặp đôi đã dùng LoveStory.
                    </p>
                </div>
            </section>

            {/* Posts Grid — client component with load-more + tag filter */}
            <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
                <BlogList initialPosts={initialPosts} />
            </section>

            {/* CTA Banner */}
            <section style={{ background: "linear-gradient(135deg, #ff6b9d, #c084fc)", padding: "48px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>
                    Sẵn sàng tạo thiệp của bạn?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", margin: "0 0 24px", fontSize: 15 }}>
                    Miễn phí, đẹp, chia sẻ được ngay trong 5 phút
                </p>
                <Link href="/login?ref=blog-cta" style={{
                    display: "inline-block", padding: "14px 32px", borderRadius: 12,
                    background: "#fff", color: "#be185d", fontWeight: 700, fontSize: 15,
                    textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}>
                    Tạo thiệp miễn phí →
                </Link>
            </section>

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": "Blog LoveStory",
                        "url": "https://7app.online/blog",
                        "description": "Chia sẻ kinh nghiệm làm thiệp cưới online và tips tổ chức đám cưới",
                        "publisher": {
                            "@type": "Organization",
                            "name": "LoveStory",
                            "url": "https://7app.online",
                        },
                    }),
                }}
            />
        </div>
    );
}
