import type { Metadata, Viewport } from "next";
import { createClient } from "@supabase/supabase-js";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Dynamic OG metadata: fetch real names from DB for correct Zalo/Facebook sharing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let groomName = "";
  let brideName = "";
  let weddingDate = "";
  let coverImage = "";
  let ogTitle = "";
  let ogDescription = "";

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from("projects")
      .select("groom_name, bride_name, wedding_date, cover_image, canvas_json")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (data) {
      groomName = data.groom_name || "";
      brideName = data.bride_name || "";
      weddingDate = data.wedding_date
        ? new Date(data.wedding_date).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";
      coverImage = data.cover_image || "";

      // Extract OG metadata from canvas_json if available
      if (data.canvas_json) {
        try {
          const canvas =
            typeof data.canvas_json === "string"
              ? JSON.parse(data.canvas_json)
              : data.canvas_json;
          ogTitle = canvas?.meta?.ogTitle || "";
          ogDescription = canvas?.meta?.ogDescription || "";
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  } catch {
    // Fallback gracefully
  }

  const names =
    groomName && brideName ? `${groomName} & ${brideName}` : "Thiệp cưới";
  const title =
    ogTitle ||
    (groomName && brideName
      ? `💒 Thiệp mời cưới ${names}`
      : "Thiệp mời cưới - LoveStory");
  const description =
    ogDescription ||
    (weddingDate
      ? `${names} trân trọng kính mời bạn đến chia sẻ hạnh phúc trong ngày lễ trọng đại — ${weddingDate} 💕`
      : `${names} trân trọng kính mời bạn đến chia sẻ hạnh phúc trong ngày lễ trọng đại 💕`);
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://7app.online"}/i/${slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: "LoveStory",
      title,
      description,
      url,
      ...(coverImage
        ? {
            images: [{ url: coverImage, width: 1200, height: 630, alt: names }],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(coverImage ? { images: [coverImage] } : {}),
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
