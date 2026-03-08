import { NextResponse, type NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> },
) {
    const { code } = await params;
    const normalizedCode = code.toUpperCase();

    // Redirect to login with referral code as query param
    // Click tracking is handled server-side via the login page reading ?ref=
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("ref", normalizedCode);
    return NextResponse.redirect(loginUrl);
}
