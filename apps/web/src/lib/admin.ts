import { createClient } from "@/lib/supabase/server";
import { createClient as createServerClient } from "@supabase/supabase-js";

/**
 * Verify current user is admin.
 * Double-check: env ADMIN_EMAIL + DB user_roles table.
 * Returns user on success, error on failure.
 */
export async function verifyAdmin() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL) {
    return { error: "Server misconfigured", status: 500 } as const;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return { error: "Unauthorized", status: 403 } as const;
  }

  // Double-check against DB role table (defense-in-depth)
  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .single();

  if (!role) {
    return { error: "Unauthorized", status: 403 } as const;
  }

  return { user } as const;
}

/**
 * Check if a user ID has admin role in DB.
 * For use in server components (layout guards).
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL) return false;

  const supabase = await createClient();
  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .single();

  return !!role;
}

/** Service-role client for admin operations */
export function getAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
