import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function getBlogSlugs(): Promise<{ slug: string; created_at: string }[]> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data } = await supabase
            .from("blog_posts")
            .select("slug, created_at")
            .eq("published", true)
            .order("created_at", { ascending: false });
        return data || [];
    } catch {
        return [];
    }
}

// Sprint 13: also include public invitation pages for Google indexing
async function getPublicInvitations(): Promise<{ slug: string; updated_at: string }[]> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data } = await supabase
            .from("projects")
            .select("slug, updated_at")
            .eq("status", "published")
            .order("updated_at", { ascending: false })
            .limit(500); // cap for sitemap size
        return data || [];
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://7app.online";

    const [blogPosts, invitations] = await Promise.all([
        getBlogSlugs(),
        getPublicInvitations(),
    ]);

    return [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${baseUrl}/templates`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
        { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        // Dynamic blog posts
        ...blogPosts.map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.created_at),
            changeFrequency: "monthly" as const,
            priority: 0.75,
        })),
        // Dynamic public invitation pages — boost sharing + organic traffic
        ...invitations.map(inv => ({
            url: `${baseUrl}/i/${inv.slug}`,
            lastModified: new Date(inv.updated_at),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
    ];
}
