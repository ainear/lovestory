"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  tags: string[];
  created_at: string;
  view_count: number;
}

const PAGE_SIZE = 6;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function BlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === PAGE_SIZE);

  // Collect unique tags from initial posts
  const allTags = Array.from(
    new Set(initialPosts.flatMap((p) => p.tags ?? []))
  ).slice(0, 8);

  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  async function loadMore() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_url, tags, created_at, view_count")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(posts.length, posts.length + PAGE_SIZE - 1);

      if (data) {
        setPosts((prev) => [...prev, ...data]);
        if (data.length < PAGE_SIZE) setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <button
            onClick={() => setActiveTag(null)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1.5px solid",
              borderColor: !activeTag ? "#be185d" : "#e5e7eb",
              background: !activeTag ? "#fdf2f8" : "#fff",
              color: !activeTag ? "#be185d" : "#6b7280",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1.5px solid",
                borderColor: activeTag === tag ? "#be185d" : "#e5e7eb",
                background: activeTag === tag ? "#fdf2f8" : "#fff",
                color: activeTag === tag ? "#be185d" : "#6b7280",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Posts grid */}
      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
          <p style={{ fontSize: 40, margin: "0 0 16px" }}>✍️</p>
          <p style={{ fontSize: 16 }}>Bài viết đang được chuẩn bị. Quay lại sớm nhé!</p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: 16,
              padding: "10px 24px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              color: "#fff",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Tạo thiệp ngay →
          </Link>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                  }}
                >
                  {post.cover_url ? (
                    <Image
                      src={post.cover_url}
                      alt={post.title}
                      width={400}
                      height={180}
                      style={{ width: "100%", height: 180, objectFit: "cover" }}
                      unoptimized={!post.cover_url.startsWith("https://")}
                    />
                  ) : (
                    <div
                      style={{
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #fce7f3, #f5f3ff)",
                        fontSize: 48,
                      }}
                    >
                      💌
                    </div>
                  )}
                  <div style={{ padding: 24 }}>
                    {post.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 11,
                              padding: "3px 8px",
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
                    <h2
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        margin: "0 0 8px",
                        lineHeight: 1.4,
                        color: "#1f2937",
                      }}
                    >
                      {post.title}
                    </h2>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        margin: "0 0 16px",
                        lineHeight: 1.6,
                      }}
                    >
                      {post.excerpt}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      <span>
                        {new Date(post.created_at).toLocaleDateString("vi-VN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span>👁 {post.view_count || 0}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Load more button — only visible when not filtering by tag */}
          {!activeTag && hasMore && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button
                onClick={loadMore}
                disabled={loading}
                data-testid="load-more-btn"
                style={{
                  padding: "13px 36px",
                  borderRadius: 50,
                  border: "2px solid #ff6b9d",
                  background: loading ? "#f9fafb" : "#fff",
                  color: "#ff6b9d",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Đang tải..." : "Xem thêm bài viết →"}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
