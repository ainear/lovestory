import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering — blog posts change over time
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

async function getPosts() {
    try {
        // Use anon key — RLS allows public SELECT on published posts
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data, error } = await supabase
            .from("blog_posts")
            .select("id, slug, title, excerpt, cover_url, tags, created_at, view_count")
            .eq("published", true)
            .order("created_at", { ascending: false })
            .limit(20);
        if (error) console.error("[Blog] fetch error:", error.message);
        return data || [];
    } catch (e) {
        console.error("[Blog] getPosts exception:", e);
        return [];
    }
}


export default async function BlogPage() {
    const posts = await getPosts();

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

            {/* Posts Grid */}
            <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
                {posts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                        <p style={{ fontSize: 40, margin: "0 0 16px" }}>✍️</p>
                        <p style={{ fontSize: 16 }}>Bài viết đang được chuẩn bị. Quay lại sớm nhé!</p>
                        <Link href="/" style={{ display: "inline-block", marginTop: 16, padding: "10px 24px", borderRadius: 8, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                            Tạo thiệp ngay →
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                        {posts.map((post: { slug: string; cover_url: string | null; tags: string[]; title: string; excerpt: string | null; created_at: string; view_count: number }) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <article style={{
                                    background: "#fff", borderRadius: 16, overflow: "hidden",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    cursor: "pointer",
                                }}>
                                    {post.cover_url ? (
                                        <img src={post.cover_url} alt={post.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                                    ) : (
                                        <div style={{
                                            height: 180, display: "flex", alignItems: "center", justifyContent: "center",
                                            background: "linear-gradient(135deg, #fce7f3, #f5f3ff)",
                                            fontSize: 48,
                                        }}>💌</div>
                                    )}
                                    <div style={{ padding: 24 }}>
                                        {post.tags?.length > 0 && (
                                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                                                {post.tags.slice(0, 2).map((tag: string) => (
                                                    <span key={tag} style={{
                                                        fontSize: 11, padding: "3px 8px", borderRadius: 20,
                                                        background: "#fdf2f8", color: "#be185d", fontWeight: 500,
                                                    }}>{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.4, color: "#1f2937" }}>
                                            {post.title}
                                        </h2>
                                        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.6 }}>
                                            {post.excerpt}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#9ca3af" }}>
                                            <span>{new Date(post.created_at).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })}</span>
                                            <span>👁 {post.view_count || 0}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Banner */}
            <section style={{ background: "linear-gradient(135deg, #ff6b9d, #c084fc)", padding: "48px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>
                    Sẵn sàng tạo thiệp của bạn?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", margin: "0 0 24px", fontSize: 15 }}>
                    Miễn phí, đẹp, chia sẻ được ngay trong 5 phút
                </p>
                <Link href="/login" style={{
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
