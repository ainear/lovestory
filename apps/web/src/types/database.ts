/**
 * Shared types for Supabase database records.
 * Used across dashboard and admin pages to replace `any` types.
 */

export interface Project {
    id: string;
    user_id: string;
    slug: string;
    template_id: string;
    title: string;
    groom_name: string;
    bride_name: string;
    wedding_date: string | null;
    status: "draft" | "published";
    view_count: number;
    created_at: string;
    updated_at: string;
}

export interface Wish {
    id: string;
    project_id: string;
    guest_name: string;
    message: string;
    emoji: string;
    created_at: string;
}

export interface Rsvp {
    id: string;
    project_id: string;
    guest_name: string;
    status: "confirmed" | "declined" | "maybe";
    guest_count: number;
    phone: string;
    created_at: string;
}

export interface Gift {
    id: string;
    project_id: string;
    guest_name: string;
    amount: number;
    method: string;
    message: string;
    note: string;
    created_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    plan: "free" | "basic" | "premium";
    expires_at: string | null;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    plan: string;
    amount: number;
    status: "pending" | "paid" | "failed";
    created_at: string;
}
