import { createClient } from "@/lib/supabase/server";

export interface ProjectRow {
    id: string;
    user_id: string;
    title: string;
    slug: string;
    template_id: string;
    status: "draft" | "published" | "archived";
    groom_name: string;
    bride_name: string;
    wedding_date: string | null;
    wedding_time: string | null;
    venue_name: string;
    venue_address: string;
    google_maps_url: string;
    groom_parent_names: string;
    bride_parent_names: string;
    story: string;
    message: string;
    bank_name: string;
    bank_account: string;
    bank_owner: string;
    view_count: number;
    created_at: string;
    updated_at: string;
}

function generateSlug(groomName: string, brideName: string): string {
    const base = `${groomName}-${brideName}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    const rand = Math.random().toString(36).slice(2, 7);
    return `${base}-${rand}`;
}

export async function createProject(userId: string, templateId: string = "rose-garden") {
    const supabase = await createClient();
    const slug = generateSlug("", "");
    const { data, error } = await supabase
        .from("projects")
        .insert({
            user_id: userId,
            title: "Thiệp mới",
            slug: `thiep-${slug}`,
            template_id: templateId,
            status: "draft",
        })
        .select()
        .single();

    if (error) throw error;
    return data as ProjectRow;
}

export async function getUserProjects(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as ProjectRow[];
}

export async function getProjectBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) return null;
    return data as ProjectRow;
}

export async function updateProject(projectId: string, userId: string, updates: Partial<ProjectRow>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", projectId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) throw error;
    return data as ProjectRow;
}

export async function publishProject(projectId: string, userId: string, groomName: string, brideName: string) {
    const slug = generateSlug(groomName, brideName);
    return updateProject(projectId, userId, { slug, status: "published" });
}

export async function getProjectRsvps(projectId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("rsvps")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
    return data || [];
}

export async function getProjectWishes(projectId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("wishes")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
    return data || [];
}

export async function getProjectGifts(projectId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("gifts")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
    return data || [];
}

export async function addRsvp(projectId: string, guestName: string, status: string, guestCount: number, phone?: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("rsvps")
        .insert({ project_id: projectId, guest_name: guestName, status, guest_count: guestCount, phone: phone || "" })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function addWish(projectId: string, guestName: string, message: string, emoji: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("wishes")
        .insert({ project_id: projectId, guest_name: guestName, message, emoji })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function incrementViewCount(projectId: string) {
    const supabase = await createClient();
    try {
        await supabase.rpc("increment_view_count", { p_id: projectId });
    } catch {
        // RPC not yet created — silently skip
    }
}
