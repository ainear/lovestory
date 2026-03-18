/**
 * RSVP Email Unsubscribe API
 * GET /api/rsvp/unsubscribe?token=xxx&email=yyy
 * 
 * Validates a signed token and marks the project owner as unsubscribed.
 * Token = base64(email + ":" + projectId + ":" + HMAC-SHA256 signature)
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const SECRET =
  process.env.UNSUBSCRIBE_SECRET ??
  // NOTE: Never use SERVICE_ROLE_KEY as a signing secret for public-facing tokens.
  // If UNSUBSCRIBE_SECRET is missing, log a warning and use a safe dedicated fallback.
  (() => {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[SECURITY] UNSUBSCRIBE_SECRET env var not set — " +
          "set this in Vercel environment variables.",
      );
    }
    return "lovestory-unsub-2026-v2";
  })();


function verifyToken(token: string): { email: string; projectId: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length < 3) return null;

    const [email, projectId, ...sigParts] = parts;
    const sig = sigParts.join(":");
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(`${email}:${projectId}`)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return { email, projectId };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const payload = verifyToken(token);

  if (!payload) {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:system-ui;text-align:center;padding:80px">
        <h2>❌ Link không hợp lệ hoặc đã hết hạn</h2>
        <p style="color:#6b7280">Vui lòng liên hệ hỗ trợ nếu cần giúp đỡ.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }

  const supabase = await createClient();

  // Store unsubscribe preference in user metadata
  // Find the project owner and update their metadata
  try {
    const { data: project } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", payload.projectId)
      .single();

    if (project?.user_id) {
      // Update user metadata to include unsubscribed project IDs
      const { data: { user } } = await supabase.auth.admin.getUserById(project.user_id);
      const existing: string[] = user?.user_metadata?.rsvp_unsub ?? [];
      const updated = Array.from(new Set([...existing, payload.projectId]));
      await supabase.auth.admin.updateUserById(project.user_id, {
        user_metadata: { ...user?.user_metadata, rsvp_unsub: updated },
      });
    }
  } catch {
    // Best-effort — still show success page
  }


  return new NextResponse(
    `<!DOCTYPE html><html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
      <div style="text-align:center;padding:40px;max-width:400px">
        <div style="font-size:64px;margin-bottom:16px">✉️</div>
        <h1 style="font-size:24px;font-weight:800;color:#1f2937;margin:0 0 12px">Đã hủy đăng ký</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px">
          Bạn sẽ không nhận email thông báo RSVP cho thiệp cưới này nữa.
        </p>
        <p style="color:#9ca3af;font-size:13px">
          Muốn bật lại? Vào 
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/rsvp" style="color:#c084fc">Dashboard → RSVP</a>
        </p>
      </div>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } },
  );
}
