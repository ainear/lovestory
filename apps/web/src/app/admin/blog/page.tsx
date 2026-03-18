"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Post {
    id: string; slug: string; title: string; excerpt: string;
    content: string; tags: string[]; published: boolean;
    created_at: string; view_count: number;
}

// Form state — tags as comma string for input
interface EditingPost {
    id?: string; slug: string; title: string; excerpt: string;
    content: string; tags: string; published: boolean;
}

const EMPTY_POST: EditingPost = { slug: "", title: "", excerpt: "", content: "", tags: "", published: false };

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [editing, setEditing] = useState<EditingPost | null>(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    async function loadPosts() {
        const { data } = await supabase
            .from("blog_posts").select("*").order("created_at", { ascending: false });
        setPosts(data || []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadPosts(); }, []);

    async function save() {
        if (!editing) return;
        setSaving(true);
        const tagsArr = typeof editing.tags === "string"
            ? (editing.tags as string).split(",").map((t: string) => t.trim()).filter(Boolean)
            : editing.tags || [];

        const payload = {
            slug: editing.slug,
            title: editing.title,
            excerpt: editing.excerpt,
            content: editing.content,
            tags: tagsArr,
            published: editing.published,
        };

        if (editing.id) {
            await supabase.from("blog_posts").update(payload).eq("id", editing.id);
        } else {
            await supabase.from("blog_posts").insert(payload);
        }
        setSaving(false);
        setMsg("✅ Đã lưu!");
        setTimeout(() => setMsg(""), 2000);
        setEditing(null);
        loadPosts();
    }

    async function togglePublish(post: Post) {
        await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
        loadPosts();
    }

    async function deletePost(id: string) {
        if (!confirm("Xóa bài viết này?")) return;
        await supabase.from("blog_posts").delete().eq("id", id);
        loadPosts();
    }

    const inputStyle = {
        width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb",
        fontSize: 13, outline: "none", boxSizing: "border-box" as const, marginBottom: 12,
    };
    const labelStyle = { fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 };

    return (
        <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>📝 Quản lý Blog</h1>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {msg && <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>{msg}</span>}
                    <button
                        onClick={() => setEditing({ ...EMPTY_POST })}
                        style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                    >
                        + Bài viết mới
                    </button>
                </div>
            </div>

            {/* Editor */}
            {editing && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                    <h2 style={{ margin: "0 0 16px", fontSize: 16 }}>{editing.id ? "Chỉnh sửa bài viết" : "Bài viết mới"}</h2>

                    <label style={labelStyle}>Slug (URL) *</label>
                    <input style={inputStyle} value={editing.slug} onChange={e => setEditing(p => ({ ...p!, slug: e.target.value }))} placeholder="ten-bai-viet-khong-dau" />

                    <label style={labelStyle}>Tiêu đề *</label>
                    <input style={inputStyle} value={editing.title} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} placeholder="Tiêu đề bài viết" />

                    <label style={labelStyle}>Mô tả ngắn (excerpt)</label>
                    <input style={inputStyle} value={editing.excerpt} onChange={e => setEditing(p => ({ ...p!, excerpt: e.target.value }))} placeholder="Tóm tắt bài viết" />

                    <label style={labelStyle}>Tags (cách nhau bằng dấu phảy)</label>
                    <input style={inputStyle}
                        value={editing.tags}
                        onChange={e => setEditing(p => ({ ...p!, tags: e.target.value }))}
                        placeholder="thiệp cưới, 2026, tips" />

                    <label style={labelStyle}>Nội dung (HTML)</label>
                    <textarea
                        style={{ ...inputStyle, minHeight: 200, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
                        value={editing.content}
                        onChange={e => setEditing(p => ({ ...p!, content: e.target.value }))}
                        placeholder="<h2>Tiêu đề</h2><p>Nội dung...</p>"
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                        <input type="checkbox" checked={editing.published || false} onChange={e => setEditing(p => ({ ...p!, published: e.target.checked }))} />
                        Xuất bản công khai
                    </label>

                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                        <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: 8, background: "#10b981", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>
                            {saving ? "Đang lưu..." : "💾 Lưu"}
                        </button>
                        <button onClick={() => setEditing(null)} style={{ padding: "10px 16px", borderRadius: 8, background: "#f3f4f6", color: "#374151", border: "none", cursor: "pointer" }}>
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {/* Posts Table */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                            {["Tiêu đề", "Slug", "Tags", "Lượt xem", "Trạng thái", "Thao tác"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length === 0 && (
                            <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Chưa có bài viết nào</td></tr>
                        )}
                        {posts.map(post => (
                            <tr key={post.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 500, maxWidth: 200 }}>{post.title}</td>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{post.slug}</td>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                        {post.tags?.slice(0, 2).map(t => (
                                            <span key={t} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 10, background: "#fdf2f8", color: "#be185d" }}>{t}</span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: "12px 14px", fontSize: 13 }}>👁 {post.view_count}</td>
                                <td style={{ padding: "12px 14px" }}>
                                    <button onClick={() => togglePublish(post)} style={{
                                        padding: "3px 10px", borderRadius: 20, border: "none", cursor: "pointer",
                                        background: post.published ? "#d1fae5" : "#fee2e2",
                                        color: post.published ? "#065f46" : "#991b1b",
                                        fontSize: 11, fontWeight: 600,
                                    }}>
                                        {post.published ? "✓ Xuất bản" : "Draft"}
                                    </button>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button onClick={() => setEditing({
                                            id: post.id, slug: post.slug, title: post.title,
                                            excerpt: post.excerpt, content: post.content,
                                            tags: (post.tags || []).join(", "),
                                            published: post.published,
                                        })}
                                            style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 12 }}>
                                            ✏️ Sửa
                                        </button>
                                        <button onClick={() => deletePost(post.id)}
                                            style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#fee2e2", cursor: "pointer", fontSize: 12, color: "#dc2626" }}>
                                            🗑
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
