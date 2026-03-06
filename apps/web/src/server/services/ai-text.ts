/**
 * Gemini AI Text Generation Service
 * Generates "Love Story" text content for wedding video overlays.
 * Uses Google Gemini Flash model for fast, low-cost text generation.
 */

interface CoupleInfo {
    groomName?: string;
    brideName?: string;
    weddingDate?: string;
    howWeMet?: string;
}

interface LoveStoryOutput {
    title: string;
    subtitle: string;
    dateFormatted: string;
    loveStory: string;
    poem: string;
    closing: string;
    hashtag: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function buildPrompt(info: CoupleInfo, style: string): string {
    return `Bạn là một nhà thơ lãng mạn chuyên viết nội dung thiệp cưới. Hãy viết nội dung cho video cưới:

- Tên chú rể: ${info.groomName || "Anh"}
- Tên cô dâu: ${info.brideName || "Em"}
- Ngày cưới: ${info.weddingDate || "sắp tới"}
- Câu chuyện tình yêu: ${info.howWeMet || "Một câu chuyện tình đẹp"}
- Phong cách: ${style}

Trả về CHÍNH XÁC một JSON object (không markdown, không code block) với format:
{
  "title": "Tên cặp đôi, ví dụ: Minh & Hoa",
  "subtitle": "A Love Story hoặc tương đương tiếng Việt",
  "dateFormatted": "Ngày tháng format đẹp, ví dụ: 25 Tháng 12, 2026",
  "loveStory": "2-3 câu kể câu chuyện tình yêu, tối đa 50 từ",
  "poem": "Bài thơ lãng mạn 4 dòng",
  "closing": "Lời kết, ví dụ: Trân trọng kính mời",
  "hashtag": "Hashtag, ví dụ: #MinhHoa2026"
}

Viết bằng tiếng Việt, giọng văn ${style}. CHỈ trả về JSON, không có text khác.`;
}

function getDefaultOutput(info: CoupleInfo): LoveStoryOutput {
    const groom = info.groomName || "Anh";
    const bride = info.brideName || "Em";
    return {
        title: `${groom} & ${bride}`,
        subtitle: "Our Love Story",
        dateFormatted: info.weddingDate || "Coming Soon",
        loveStory: `Câu chuyện tình yêu đẹp của ${groom} và ${bride} bắt đầu từ những ngày bình dị.`,
        poem: `Yêu nhau là nắm tay cùng đi\nQua bao mùa nắng mưa không ngại\nHạnh phúc đôi ta dệt từng ngày\nMãi bên nhau trọn vẹn tháng ngày`,
        closing: "Trân trọng kính mời",
        hashtag: `#${groom}${bride}2026`,
    };
}

/**
 * Generate love story text using Gemini Flash API.
 * Falls back to a default template if API fails.
 */
export async function generateLoveStoryText(
    coupleInfo: CoupleInfo,
    style: string = "romantic",
): Promise<LoveStoryOutput> {
    if (!GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not set, using default text");
        return getDefaultOutput(coupleInfo);
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: buildPrompt(coupleInfo, style) }],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                },
            }),
        });

        if (!response.ok) {
            console.error("Gemini API error:", response.status);
            return getDefaultOutput(coupleInfo);
        }

        const data = await response.json();
        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Parse JSON from response (handle potential markdown code blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Failed to parse Gemini response as JSON");
            return getDefaultOutput(coupleInfo);
        }

        const parsed = JSON.parse(jsonMatch[0]) as LoveStoryOutput;

        // Validate required fields
        if (!parsed.title || !parsed.loveStory) {
            return getDefaultOutput(coupleInfo);
        }

        return parsed;
    } catch (err) {
        console.error("AI text generation failed:", err);
        return getDefaultOutput(coupleInfo);
    }
}
