import { redirect } from "next/navigation";

/**
 * /i/preview/[slug] → redirect to /i/[slug]
 * Templates page links here; the actual invitation viewer lives at /i/[slug].
 */
export default async function PreviewRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/i/${encodeURIComponent(slug)}`);
}
