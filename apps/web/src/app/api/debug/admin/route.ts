import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const envAdminEmail = process.env.ADMIN_EMAIL;
    const fallbackEmail = envAdminEmail || "admin@7app.online";

    return NextResponse.json({
        envRaw: envAdminEmail,
        envLength: envAdminEmail?.length,
        fallback: fallbackEmail,
        userEmail: user?.email,
        userEmailLength: user?.email?.length,
        isMatch: user?.email === fallbackEmail,
        isStrictMatch: user?.email?.trim()?.toLowerCase() === fallbackEmail?.trim()?.toLowerCase(),
    });
}
