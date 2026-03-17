import { redirect, notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

/**
 * /i/preview/[slug] → redirect to /i/[slug]
 * Templates page links here; the actual invitation viewer lives at /i/[slug].
 * Returns 404 if slug doesn't exist (instead of redirecting to a broken page).
 */
export default async function PreviewRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) {
    notFound();
  }

  redirect(`/i/${encodeURIComponent(slug)}`);
}
