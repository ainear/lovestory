import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        await supabase.auth.signOut();
    } catch {
        // ignore signout errors
    }
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(new URL("/login", origin));
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        await supabase.auth.signOut();
    } catch {
        // ignore signout errors
    }
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(new URL("/login", origin));
}
