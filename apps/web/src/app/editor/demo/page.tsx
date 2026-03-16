"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { TEMPLATE_UNIQUE_PRESETS } from "@/server/data/template-presets";
import { convertTemplateToCanvas } from "../[id]/components/canvas-engine/convertTemplate";
import { CraftVisualEditor } from "../[id]/components/CraftVisualEditor";

function DemoEditorInner() {
  const searchParams = useSearchParams();
  const templateSlug = searchParams.get("template") || "demo-elegant";

  const canvasJson = useMemo(() => {
    const elements = TEMPLATE_UNIQUE_PRESETS[templateSlug];
    if (!elements) return null;

    const canvasElements = convertTemplateToCanvas(elements);

    // Pick gradient based on template
    const bgMap: Record<string, string> = {
      "demo-elegant":
        "linear-gradient(180deg, #f5f0eb 0%, #ffffff 5%, #faf8f5 15%, #ffffff 35%, #faf7f4 55%, #ffffff 75%, #f5f0eb 100%)",
      "rose-garden":
        "linear-gradient(180deg, #fdf6f0 0%, #fce8e8 30%, #fdf6f0 60%, #fef9f6 100%)",
      "midnight-romance":
        "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
      "golden-hour":
        "linear-gradient(180deg, #fdf6e3 0%, #fef3c7 30%, #fffbeb 100%)",
      "cherry-blossom":
        "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)",
      "ocean-breeze":
        "linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 100%)",
      "cinelove-classic":
        "linear-gradient(180deg, #faf5ef 0%, #f5ede3 30%, #faf5ef 60%, #f5ede3 100%)",
    };
    const bg =
      bgMap[templateSlug] ||
      "linear-gradient(180deg, #f9f6f0 0%, #f0ebe2 50%, #f9f6f0 100%)";

    return JSON.stringify({
      version: 2,
      engine: "custom-canvas",
      canvas: { width: 500, height: 7300, bg },
      elements: canvasElements,
      meta: { musicUrl: "", musicName: "" },
      effects: { particleEffect: "petals" },
    });
  }, [templateSlug]);

  if (!canvasJson) {
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
          Template &quot;{templateSlug}&quot; not found
        </p>
      </div>
    );
  }

  return (
    <CraftVisualEditor
      projectId="demo"
      initialCanvasJson={canvasJson}
      projectSlug={`demo-${templateSlug}`}
      onPublish={() => {
        window.open(`/i/demo-elegant`, "_blank");
      }}
    />
  );
}

export default function DemoEditorPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f9fafb",
          }}
        >
          <p style={{ fontSize: 16, color: "#be185d" }}>
            Loading editor demo...
          </p>
        </div>
      }
    >
      <DemoEditorInner />
    </Suspense>
  );
}
