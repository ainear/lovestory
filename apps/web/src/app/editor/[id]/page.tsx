"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { CraftVisualEditor } from "./components/CraftVisualEditor";
import { MobileFormEditor } from "./components/MobileFormEditor";
import { useIsMobile } from "./hooks/useIsMobile";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

interface Project {
  id: string;
  slug: string;
  canvas_json: string | null;
  title: string;
}

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    async function load() {
      if (!params.id || params.id === "new") {
        router.push("/templates");
        return;
      }

      // C2 fix: check authentication before fetching
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // C2 fix: filter by user_id to prevent unauthorized project access
      const { data, error } = await supabase
        .from("projects")
        .select("id, slug, canvas_json, title")
        .eq("id", params.id)
        .eq("user_id", user.id) // ← ownership guard
        .single();

      if (error || !data) {
        setError("Không tìm thấy dự án. Vui lòng thử lại.");
        setLoading(false);
        return;
      }
      setProject(data);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid #e5e7eb",
            borderTop: "3px solid #ff6b9d",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#9ca3af", fontSize: 14 }}>Đang tải editor...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p style={{ fontSize: 48 }}>😢</p>
        <p style={{ color: "#374151", fontSize: 16 }}>
          {error ?? "Lỗi không xác định"}
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "none",
            background: "#ff6b9d",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Về Dashboard
        </button>
      </div>
    );
  }

  return (
    <SubscriptionProvider>
      {isMobile ? (
        <MobileFormEditor
          projectId={project.id}
          initialCanvasJson={project.canvas_json}
          projectSlug={project.slug}
          onPublish={() => {
            router.push(`/i/${project.slug}`);
          }}
        />
      ) : (
        <CraftVisualEditor
          projectId={project.id}
          initialCanvasJson={project.canvas_json}
          projectSlug={project.slug}
          onPublish={() => {
            router.push(`/i/${project.slug}`);
          }}
        />
      )}
    </SubscriptionProvider>
  );
}
