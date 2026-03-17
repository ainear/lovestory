import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DOMPurify from "isomorphic-dompurify";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string;
  tags: string[];
  author: string;
  created_at: string;
  view_count: number;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    // Increment view count (fire and forget)
    if (data) {
      supabase
        .from("blog_posts")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id)
        .then(() => {});
    }
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Bài viết không tồn tại" };
  return {
    title: `${post.title} | Blog LoveStory`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      locale: "vi_VN",
      siteName: "LoveStory",
      title: post.title,
      description: post.excerpt,
      url: `https://7app.online/blog/${slug}`,
      images: post.cover_url ? [{ url: post.cover_url, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: `https://7app.online/blog/${slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        background: "#fff",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: 16,
              fontWeight: 800,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "none",
            }}
          >
            ❤️ LoveStory
          </Link>
          <span style={{ color: "#d1d5db" }}>›</span>
          <Link
            href="/blog"
            style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}
          >
            Blog
          </Link>
          <span style={{ color: "#d1d5db" }}>›</span>
          <span
            style={{
              fontSize: 13,
              color: "#9ca3af",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 200,
            }}
          >
            {post.title}
          </span>
        </div>
      </nav>

      {/* Article */}
      <article
        style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "#fdf2f8",
                  color: "#be185d",
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.3,
            margin: "0 0 16px",
            color: "#111827",
          }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 13,
            color: "#9ca3af",
            marginBottom: 32,
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: 24,
          }}
        >
          <span>✍️ {post.author}</span>
          <span>
            📅{" "}
            {new Date(post.created_at).toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>👁 {post.view_count} lượt xem</span>
        </div>

        {/* Cover */}
        {post.cover_url && (
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 32 }}>
            <Image
              src={post.cover_url}
              alt={post.title}
              width={760}
              height={400}
              style={{ width: "100%", height: "auto", maxHeight: 400, objectFit: "cover", display: "block" }}
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{ lineHeight: 1.9, fontSize: 16, color: "#374151" }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content || ""),
          }}
        />

        {/* CTA */}
        <div
          style={{
            marginTop: 48,
            padding: 32,
            borderRadius: 20,
            background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)",
            textAlign: "center",
            border: "1px solid #fce7f3",
          }}
        >
          <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>
            Tạo thiệp của bạn ngay!
          </h3>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px" }}>
            Miễn phí · Đẹp · Chia sẻ được trong 5 phút
          </p>
          <Link
            href={`/login?ref=blog-post&from=${post.slug}`}
            style={{
              display: "inline-block",
              padding: "12px 28px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            Bắt đầu miễn phí →
          </Link>
        </div>
      </article>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.cover_url || "https://7app.online/og.png",
            author: { "@type": "Organization", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "LoveStory",
              url: "https://7app.online",
            },
            datePublished: post.created_at,
            url: `https://7app.online/blog/${post.slug}`,
          }),
        }}
      />
    </div>
  );
}
