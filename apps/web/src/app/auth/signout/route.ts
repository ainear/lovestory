import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(new URL("/login", origin));
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(new URL("/login", origin));
}
