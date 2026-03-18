/**
 * Shared SEO metadata for LoveStory pages.
 * Import and re-export from individual page.tsx files.
 */
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://lovestory.7app.online";
const SITE_NAME = "LoveStory";
const SITE_DESC = "Tạo thiệp cưới online đẹp, chia sẻ link cho khách mời, nhận RSVP tự động. Miễn phí mãi mãi.";

export function buildMeta(overrides: Partial<Metadata> & { title: string }): Metadata {
  const { title: rawTitle, openGraph: ogOverride, alternates: altOverride, description, ...rest } = overrides;
  const title = `${rawTitle} — ${SITE_NAME}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: description ?? SITE_DESC,
    openGraph: {
      title,
      description: description ?? SITE_DESC,
      siteName: SITE_NAME,
      locale: "vi_VN",
      type: "website",
      ...(ogOverride ?? {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? SITE_DESC,
    },
    alternates: {
      canonical: altOverride?.canonical ?? "/",
    },
    ...rest,
  };
}

export const defaultMeta: Metadata = buildMeta({
  title: "Thiệp cưới online đẹp nhất Việt Nam",
  description: SITE_DESC,
  alternates: { canonical: "/" },
});
