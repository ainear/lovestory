import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * POST /api/ai/text-suggest
 *
 * Generates 3 Vietnamese wedding text suggestions using Gemini Flash.
 * Requires a valid Supabase session (401 on unauth).
 * Rate limited: 5 requests/min per user.
 *
 * Body: { type, groomName, brideName, date?, venue? }
 * Returns: { suggestions: string[] }
 */

// Simple in-memory rate limiter (resets on cold start — good enough for free tier)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 }); // 1 min window
    return true;
  }

  if (entry.count >= 5) return false;

  entry.count++;
  return true;
}

const PROMPTS: Record<string, (data: TextSuggestBody) => string> = {
  invitation: ({ groomName, brideName, date, venue }) =>
    `Viết 3 lời mời dự đám cưới ngắn gọn (3-4 câu mỗi cái), lịch sự và ấm áp bằng tiếng Việt cho:
- Chú rể: ${groomName}
- Cô dâu: ${brideName}
${date ? `- Ngày cưới: ${date}` : ""}
${venue ? `- Địa điểm: ${venue}` : ""}
Mỗi lời mời phải khác phong cách (1: trang trọng, 2: ấm áp thân mật, 3: thơ mộng lãng mạn).
Trả về JSON: {"suggestions": ["...", "...", "..."]}`,

  vow: ({ groomName, brideName }) =>
    `Viết 3 lời thề hôn nhân ngắn (5-6 câu mỗi cái) bằng tiếng Việt, chân thật và cảm động cho:
- Người thề: ${groomName} hứa với ${brideName}
Mỗi lời thề có phong cách khác nhau (1: thi sĩ lãng mạn, 2: chân thật giản dị, 3: hài hước nhẹ nhàng nhưng vẫn chân thành).
Trả về JSON: {"suggestions": ["...", "...", "..."]}`,

  description: ({ groomName, brideName, date, venue }) =>
    `Viết 3 đoạn mô tả ngắn (2-3 câu mỗi cái) về câu chuyện tình yêu bằng tiếng Việt cho:
- Cặp đôi: ${groomName} & ${brideName}
${date ? `- Ngày trọng đại: ${date}` : ""}
${venue ? `- Địa điểm: ${venue}` : ""}
Phong cách: 1: thơ mộng, 2: hiện đại, 3: truyền thống Việt Nam.
Trả về JSON: {"suggestions": ["...", "...", "..."]}`,
};

interface TextSuggestBody {
  type: "invitation" | "vow" | "description";
  groomName: string;
  brideName: string;
  date?: string;
  venue?: string;
}

export async function POST(req: NextRequest) {
  // 1. Auth check
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cs) { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." },
      { status: 429 },
    );
  }

  // 3. Parse + validate body
  let body: TextSuggestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, groomName, brideName } = body;
  if (!type || !groomName || !brideName) {
    return NextResponse.json(
      { error: "Thiếu thông tin: type, groomName, brideName là bắt buộc" },
      { status: 400 },
    );
  }

  if (!["invitation", "vow", "description"].includes(type)) {
    return NextResponse.json({ error: "type không hợp lệ" }, { status: 400 });
  }

  // 4. Gemini call
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = PROMPTS[type](body);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response (Gemini may wrap in markdown)
    const jsonMatch = text.match(/\{[\s\S]*"suggestions"[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback: try to parse raw text as lines
      const lines = text
        .split(/\n+/)
        .map((l) => l.replace(/^[\d\.\-\*]+\s*/, "").trim())
        .filter((l) => l.length > 20)
        .slice(0, 3);

      return NextResponse.json({ suggestions: lines });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const suggestions: string[] = (parsed.suggestions || []).slice(0, 3);

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("[ai/text-suggest]", err);
    return NextResponse.json(
      { error: "AI service error. Vui lòng thử lại." },
      { status: 502 },
    );
  }
}
