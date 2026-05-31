import { createClient } from "@supabase/supabase-js";
import PublicInvitationPage from "./InvitationPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "demo-wedding") {
    return {
      title: "Minh & Mai 💍 Lễ Thành Hôn - Thiệp cưới LoveStory",
      description: "Chào mừng bạn đến với thiệp cưới của Minh & Mai!",
    };
  }
  if (slug === "demo-elegant") {
    return {
      title: "Trần Mai Anh & Nguyễn Thế Minh 💍 Thiệp cưới LoveStory",
      description: "Chào mừng bạn đến với lễ thành hôn của chúng tôi!",
    };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!project) {
    return {
      title: "Thiệp Cưới | LoveStory",
      description: "Nền tảng thiệp cưới online và video AI hàng đầu Việt Nam",
    };
  }

  const groom = project.groom_name || "Chú rể";
  const bride = project.bride_name || "Cô dâu";
  const title = `${groom} & ${bride} 💍 Lễ Thành Hôn`;
  const description = project.story || project.message || "Chúng tôi trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi!";
  
  const images = [];
  try {
    const photos = JSON.parse(project.photos || "[]");
    if (photos.length > 0) {
      images.push(photos[0]);
    }
  } catch {}

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "demo-wedding" || slug === "demo-elegant") {
    return <PublicInvitationPage params={params} />;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #fce7f3, #fdf2f8)",
          fontFamily: "'Inter', sans-serif",
          padding: 24,
          textAlign: "center"
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#be185d", marginBottom: 12 }}>
            Thiệp cưới chưa xuất bản
          </h2>
          <p style={{ color: "#6b7280" }}>
            Đường liên kết này không tồn tại hoặc chủ sở hữu chưa xuất bản thiệp mời.
          </p>
        </div>
      </div>
    );
  }

  let isPremium = false;
  if (project.user_id) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", project.user_id)
      .maybeSingle();
    if (sub?.plan === "basic" || sub?.plan === "premium") {
      isPremium = true;
    }
  }

  return (
    <PublicInvitationPage
      params={params}
      initialProject={project}
      initialIsPremium={isPremium}
    />
  );
}
