"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useReducer,
} from "react";
import { ZoomIn, ZoomOut, Smartphone, Tablet, Monitor } from "lucide-react";
import { DevicePreviewBar } from "./sidebar/DevicePreviewBar";
import type { DeviceMode } from "./sidebar/DevicePreviewBar";
// html2canvas loaded dynamically to avoid large static bundle (PERF-02)
import { createBrowserClient } from "@supabase/ssr";
import {
  CanvasRenderer,
  CanvasContextMenu,
  CanvasRightPanel,
  EditorContext,
  editorReducer,
  initialState,
  useKeyboard,
} from "./canvas-engine";
import { sanitizeElements } from "./canvas-engine/types";
import type { CanvasElement } from "./canvas-engine/types";
import { TEXT_PRESETS } from "./editor-constants";
import { SidebarPanel } from "./sidebar/SidebarPanel";
import { EditorTopBar } from "./sidebar/EditorTopBar";
import { FloatingToolbar } from "./sidebar/FloatingToolbar";
import { BackupRecoveryBanner } from "./sidebar/BackupRecoveryBanner";
import { LeftIconColumn } from "./sidebar/LeftIconColumn";

/* ═══════════════════════════════════════════════
   CraftVisualEditor — Main Editor Component
   Custom canvas engine (CraftJS removed)
   ═══════════════════════════════════════════════ */

interface CraftVisualEditorProps {
  projectId: string;
  initialCanvasJson?: string | null;
  projectSlug: string;
  onPublish?: () => void;
}

export function CraftVisualEditor({
  projectId,
  initialCanvasJson,
  projectSlug,
  onPublish,
}: CraftVisualEditorProps) {
  return (
    <CraftEditorInner
      projectId={projectId}
      initialCanvasJson={initialCanvasJson}
      projectSlug={projectSlug}
      onPublish={onPublish}
    />
  );
}

/* ── Inner editor component ── */
/** Wrapper component to activate useKeyboard hook inside EditorContext */
function CanvasKeyboardHandler() {
  useKeyboard();
  return null;
}

function CraftEditorInner({
  projectId,
  initialCanvasJson,
  projectSlug,
  onPublish,
}: CraftVisualEditorProps) {
  // CraftJS removed — these stubs keep remaining sidebar UI code compiling.
  // The sidebar tab buttons (text, image, sticker, etc.) still reference
  // actions/query but are effectively no-ops. The custom canvas engine
  // handles element management via EditorContext.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selected:
    | {
        id: string;
        name: string;
        settings: any;
        isDeletable: boolean;
        props: any;
      }
    | undefined = undefined as any;
  const canUndo = false;
  const canRedo = false;
  // Stub components for dead sidebar code that still references them in JSX.
  // These are never rendered — only passed to query.parseReactElement (also a stub).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StubComponent = (_props: any) => null;
  const CraftText = StubComponent;
  const CraftImage = StubComponent;
  const CraftContainer = StubComponent;
  const RootContainer = StubComponent;
  const CraftCountdown = StubComponent;
  const CraftCalendar = StubComponent;
  const CraftMap = StubComponent;
  const CraftRSVP = StubComponent;
  const CraftCallButton = StubComponent;
  const CraftPhotoAlbum = StubComponent;
  const CraftYouTube = StubComponent;
  const CraftQRBox = StubComponent;
  const CraftGuestName = StubComponent;
  const CraftFormBuilder = StubComponent;
  const CraftEnvelope = StubComponent;
  const CraftSticker = StubComponent;
  const CraftShape = StubComponent;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const noop = (..._args: any[]) => {};
  const actions = {
    history: { undo: noop, redo: noop },
    delete: noop,
    addNodeTree: noop,
    move: noop,
    setProp: noop,
    deserialize: noop,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    serialize: () => "{}",
    getSerializedNodes: () => ({}),
    node: (_id: string) => ({
      get: () => ({ data: { nodes: [] } }),
      toNodeTree: () => ({}),
      isDeletable: () => false,
    }),
    parseReactElement: (_el: any) => ({ toNodeTree: () => ({}) }),
  };

  const [activeTab, setActiveTab] = useState("text");
  const [clipartCat, setClipartCat] = useState("all");
  const [sectionCat, setSectionCat] = useState("all");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "done"
  >("idle");
  const [musicUrl, setMusicUrl] = useState("");
  const [musicName, setMusicName] = useState("");
  const [particleEffect, setParticleEffect] = useState("none");
  const [effectSubTab, setEffectSubTab] = useState("anim");
  const [pageAnimation, setPageAnimation] = useState("none");
  const [curtainEffect, setCurtainEffect] = useState("none");
  const [background, setBackground] = useState(
    "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
  );
  const [showTemplateSwap, setShowTemplateSwap] = useState(false);
  /* Phase 1: BG upgrade */
  const [bgSubTab, setBgSubTab] = useState<"colors" | "gradient" | "image">(
    "colors",
  );
  const [bgOpacity, setBgOpacity] = useState(100);
  /* Phase 2: Music widget */
  const [musicWidgetStyle, setMusicWidgetStyle] = useState("vinyl");
  const [musicWidgetColor, setMusicWidgetColor] = useState("#ff6b9d");
  /* Phase 4: Support + Backup */
  const [showBackupRecovery, setShowBackupRecovery] = useState(false);
  const [bugReportText, setBugReportText] = useState("");
  const [musicFilter, setMusicFilter] = useState<"all" | "intl" | "vpop">(
    "all",
  );
  const [musicSearch, setMusicSearch] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const thumbnailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [zoom, setZoomLocal] = useState(100);
  const [previewDevice, setPreviewDevice] = useState<DeviceMode>("mobile");
  // Sync zoom with canvas engine state
  const setZoom = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setZoomLocal((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return next;
      });
    },
    [],
  );
  const [projectCategory, setProjectCategory] = useState("wedding");
  const [projectStatus, setProjectStatus] = useState("draft");
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; name: string; size: number }[]
  >([]);
  const [showInLibrary, setShowInLibrary] = useState(false);
  // Premium features state (persisted in canvas_json.meta)
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(3);
  const [qrBank, setQrBank] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Custom Canvas Engine State ──
  const [editorState, editorDispatch] = useReducer(editorReducer, initialState);
  const selectedCanvasElement = useMemo(
    () =>
      editorState.elements.find(
        (el: CanvasElement) => el.id === editorState.selectedId,
      ) || null,
    [editorState.elements, editorState.selectedId],
  );
  const editorCtx = useMemo(
    () => ({
      state: editorState,
      dispatch: editorDispatch,
      selectedElement: selectedCanvasElement,
    }),
    [editorState, selectedCanvasElement],
  );
  // Sync zoom state with canvas engine
  useEffect(() => {
    editorDispatch({ type: "SET_ZOOM", zoom: zoom / 100 });
  }, [zoom]);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      ),
    [],
  );

  // Parse initial background + craft.js state from saved canvas_json
  useEffect(() => {
    if (initialCanvasJson) {
      try {
        const parsed = JSON.parse(initialCanvasJson);
        if (parsed.canvas?.bg) setBackground(parsed.canvas.bg);
        if (parsed.canvas?.bgOpacity !== undefined)
          setBgOpacity(parsed.canvas.bgOpacity);
        if (parsed.meta?.musicUrl) {
          setMusicUrl(parsed.meta.musicUrl);
          setMusicName(parsed.meta.musicName || "");
        }
        if (parsed.meta?.musicWidgetStyle)
          setMusicWidgetStyle(parsed.meta.musicWidgetStyle);
        if (parsed.meta?.musicWidgetColor)
          setMusicWidgetColor(parsed.meta.musicWidgetColor);
        if (parsed.effects?.particleEffect)
          setParticleEffect(parsed.effects.particleEffect);
        if (parsed.effects?.pageAnimation)
          setPageAnimation(parsed.effects.pageAnimation);
        if (parsed.effects?.curtainEffect)
          setCurtainEffect(parsed.effects.curtainEffect);
        if (parsed.meta?.projectCategory)
          setProjectCategory(parsed.meta.projectCategory);
        if (parsed.meta?.projectStatus)
          setProjectStatus(parsed.meta.projectStatus);
        if (parsed.meta?.showInLibrary)
          setShowInLibrary(parsed.meta.showInLibrary);
        if (parsed.meta?.uploadedImages)
          setUploadedImages(parsed.meta.uploadedImages);
        if (parsed.meta?.removeWatermark !== undefined)
          setRemoveWatermark(parsed.meta.removeWatermark);
        if (parsed.meta?.autoScroll !== undefined)
          setAutoScroll(parsed.meta.autoScroll);
        if (parsed.meta?.scrollSpeed !== undefined)
          setScrollSpeed(parsed.meta.scrollSpeed);
        if (parsed.meta?.qrBank !== undefined) setQrBank(parsed.meta.qrBank);
        // Load custom canvas format
        if (parsed.elements) {
          const validElements = sanitizeElements(parsed.elements);
          editorDispatch({ type: "SET_ELEMENTS", elements: validElements });
          if (parsed.canvas?.width && parsed.canvas?.height) {
            editorDispatch({
              type: "SET_CANVAS",
              width: parsed.canvas.width,
              height: parsed.canvas.height,
              background: parsed.canvas.background || "#f8f3eb",
            });
          }
        }
      } catch {
        /* ignore */
      }
    }
  }, [initialCanvasJson]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Backup recovery check ──
  useEffect(() => {
    try {
      const backupKey = `editor_backup_${projectId}`;
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        const parsed = JSON.parse(backup);
        const backupAge = Date.now() - (parsed.timestamp || 0);
        // Show recovery if backup is less than 24h old
        if (backupAge < 86400000) {
          setShowBackupRecovery(true);
        } else {
          localStorage.removeItem(backupKey);
        }
      }
    } catch {
      /* ignore */
    }
  }, [projectId]);

  // ── Cleanup on unmount: stop audio, clear timers ──
  useEffect(() => {
    return () => {
      musicAudioRef.current?.pause();
      musicAudioRef.current = null;
      if (thumbnailTimer.current) clearTimeout(thumbnailTimer.current);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  // ── Clipboard for copy/paste ──
  // Keyboard shortcuts are handled by CanvasKeyboardHandler inside EditorContext

  // ── Save ──
  const save = useCallback(async () => {
    setSaveStatus("saving");
    let canvasJson: string;
    canvasJson = JSON.stringify({
      version: 2,
      engine: "custom-canvas",
      canvas: {
        width: editorState.canvasWidth,
        height: editorState.canvasHeight,
        background: editorState.canvasBackground,
        bg: background,
        bgOpacity,
      },
      elements: editorState.elements,
      meta: {
        musicUrl,
        musicName,
        musicWidgetStyle,
        musicWidgetColor,
        projectCategory,
        projectStatus,
        showInLibrary,
        uploadedImages,
        removeWatermark,
        autoScroll,
        scrollSpeed,
        qrBank,
      },
      effects: { particleEffect, pageAnimation, curtainEffect },
    });
    // Save backup to localStorage
    try {
      localStorage.setItem(
        `editor_backup_${projectId}`,
        JSON.stringify({ canvasJson, timestamp: Date.now() }),
      );
    } catch {
      /* quota exceeded */
    }
    try {
      await supabase
        .from("projects")
        .update({
          canvas_json: canvasJson,
          music_url: musicUrl || null,
          music_name: musicName || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);
      setSaveStatus("saved");
      // Schedule thumbnail generation after save
      if (thumbnailTimer.current) clearTimeout(thumbnailTimer.current);
      thumbnailTimer.current = setTimeout(() => {
        const el = canvasRef.current;
        if (!el) return;
        setThumbnailLoading(true);
        import("html2canvas")
          .then(({ default: html2canvas }) =>
            html2canvas(el, {
              useCORS: true,
              allowTaint: true,
              scale: 0.5,
              width: el.offsetWidth,
              height: Math.min(el.offsetHeight, 1200),
              windowWidth: el.offsetWidth,
              windowHeight: Math.min(el.offsetHeight, 1200),
            }),
          )
          .then((capturedCanvas) => {
            const thumbCanvas = document.createElement("canvas");
            const maxW = 200;
            const ratio = maxW / capturedCanvas.width;
            thumbCanvas.width = maxW;
            thumbCanvas.height = Math.round(capturedCanvas.height * ratio);
            const ctx = thumbCanvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(
                capturedCanvas,
                0,
                0,
                thumbCanvas.width,
                thumbCanvas.height,
              );
              setThumbnailUrl(thumbCanvas.toDataURL("image/jpeg", 0.8));
            }
          })
          .catch(() => {
            /* silently skip */
          })
          .finally(() => setThumbnailLoading(false));
      }, 1500);
    } catch {
      setSaveStatus("unsaved");
    }
  }, [
    background,
    bgOpacity,
    projectId,
    supabase,
    musicUrl,
    musicName,
    musicWidgetStyle,
    musicWidgetColor,
    particleEffect,
    pageAnimation,
    curtainEffect,
    projectCategory,
    projectStatus,
    showInLibrary,
    uploadedImages,
    editorState,
  ]);

  // ── Publish ──
  const handlePublish = useCallback(async () => {
    if (publishStatus === "publishing") return;
    setPublishStatus("publishing");
    const canvasJson = JSON.stringify({
      version: 2,
      engine: "custom-canvas",
      canvas: {
        width: editorState.canvasWidth,
        height: editorState.canvasHeight,
        background: editorState.canvasBackground,
        bg: background,
        bgOpacity,
      },
      elements: editorState.elements,
      meta: {
        musicUrl,
        musicName,
        musicWidgetStyle,
        musicWidgetColor,
        projectCategory,
        projectStatus,
        showInLibrary,
        uploadedImages,
      },
      effects: { particleEffect, pageAnimation, curtainEffect },
    });
    try {
      await supabase
        .from("projects")
        .update({
          canvas_json: canvasJson,
          music_url: musicUrl || null,
          music_name: musicName || null,
          status: "published",
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);
      setSaveStatus("saved");
      setPublishStatus("done");
      onPublish?.();
    } catch {
      setPublishStatus("idle");
      alert("Xuất bản thất bại. Vui lòng thử lại.");
    }
  }, [
    background,
    bgOpacity,
    projectId,
    supabase,
    musicUrl,
    musicName,
    musicWidgetStyle,
    musicWidgetColor,
    onPublish,
    publishStatus,
    particleEffect,
    pageAnimation,
    curtainEffect,
    projectCategory,
    projectStatus,
    showInLibrary,
    uploadedImages,
    editorState,
  ]);

  // Auto-save on changes (debounced)
  const triggerAutosave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("unsaved");
    saveTimer.current = setTimeout(save, 3000);
  }, [save]);

  // ── Add Text via custom canvas engine ──
  const addCraftText = useCallback(
    (preset: (typeof TEXT_PRESETS)[0]) => {
      const newElement: CanvasElement = {
        id: `text-${Date.now()}`,
        type: "text",
        top: 100 + editorState.elements.length * 60,
        left: 50,
        width: 300,
        height: 60,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: editorState.elements.length + 1,
        locked: false,
        visible: true,
        opacity: 1,
        borderRadius: 0,
        border: { width: 0, color: "transparent", style: "solid" },
        shadow: null,
        entrance: null,
        continuous: null,
        props: {
          text: preset.label,
          fontSize: preset.fontSize,
          fontFamily: preset.fontFamily,
          fontWeight: String(preset.fontWeight),
          fontStyle: preset.fontStyle || "normal",
          color:
            background.includes("0f0825") || background.includes("111827")
              ? "#ffffff"
              : "#1f2937",
          backgroundColor: "transparent",
          textAlign: "center" as const,
          lineHeight: 1.5,
          letterSpacing: 0,
        },
      };
      editorDispatch({ type: "ADD_ELEMENT", element: newElement });
      triggerAutosave();
    },
    [background, triggerAutosave, editorState.elements.length, editorDispatch],
  );

  // ── Add Image via upload ──
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert("Chỉ hỗ trợ file ảnh (JPEG, PNG, GIF, WebP, SVG).");
        return;
      }
      if (file.size > MAX_SIZE) {
        alert("File quá lớn. Giới hạn 10MB.");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setUploadedImages((prev) => [
            ...prev,
            { url: data.url, name: file.name, size: file.size },
          ]);
          const newElement: CanvasElement = {
            id: `image-${Date.now()}`,
            type: "image",
            top: 100 + editorState.elements.length * 60,
            left: 50,
            width: 300,
            height: 200,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            zIndex: editorState.elements.length + 1,
            locked: false,
            visible: true,
            opacity: 1,
            borderRadius: 12,
            border: { width: 0, color: "transparent", style: "solid" },
            shadow: null,
            entrance: null,
            continuous: null,
            props: {
              src: data.url,
              objectFit: "cover" as const,
              crop: null,
            },
          };
          editorDispatch({ type: "ADD_ELEMENT", element: newElement });
          triggerAutosave();
        }
      } catch {
        alert("Upload ảnh thất bại.");
      }
      e.target.value = "";
    },
    [projectId, triggerAutosave, editorState.elements.length, editorDispatch],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f0f0f0",
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Selection overlay CSS handled by custom canvas engine */}
      {/* ══ Top Bar ══ */}
      <EditorTopBar
        projectSlug={projectSlug}
        canUndo={canUndo}
        canRedo={canRedo}
        saveStatus={saveStatus}
        publishStatus={publishStatus}
        showTemplateSwap={showTemplateSwap}
        setShowTemplateSwap={setShowTemplateSwap}
        background={background}
        setBackground={setBackground}
        editorDispatch={editorDispatch}
        save={save}
        handlePublish={handlePublish}
        triggerAutosave={triggerAutosave}
        query={query}
        actions={actions}
      />

      {/* ── Backup Recovery Banner ── */}
      {showBackupRecovery && (
        <BackupRecoveryBanner
          projectId={projectId}
          setBackground={setBackground}
          setBgOpacity={setBgOpacity}
          setMusicUrl={setMusicUrl}
          setMusicName={setMusicName}
          editorDispatch={editorDispatch}
          triggerAutosave={triggerAutosave}
          setShowBackupRecovery={setShowBackupRecovery}
        />
      )}

      {/* ══ Main Area ══ */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Left Icon Column ── */}
        <LeftIconColumn activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ── Overlay Left Panel (floats over canvas) ── */}
        <SidebarPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          addCraftText={addCraftText}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          background={background}
          setBackground={setBackground}
          bgSubTab={bgSubTab}
          setBgSubTab={setBgSubTab}
          bgOpacity={bgOpacity}
          setBgOpacity={setBgOpacity}
          projectId={projectId}
          clipartCat={clipartCat}
          setClipartCat={setClipartCat}
          effectSubTab={effectSubTab}
          setEffectSubTab={setEffectSubTab}
          pageAnimation={pageAnimation}
          setPageAnimation={setPageAnimation}
          curtainEffect={curtainEffect}
          setCurtainEffect={setCurtainEffect}
          particleEffect={particleEffect}
          setParticleEffect={setParticleEffect}
          musicUrl={musicUrl}
          setMusicUrl={setMusicUrl}
          musicName={musicName}
          setMusicName={setMusicName}
          musicFilter={musicFilter}
          setMusicFilter={setMusicFilter}
          musicSearch={musicSearch}
          setMusicSearch={setMusicSearch}
          previewId={previewId}
          setPreviewId={setPreviewId}
          musicAudioRef={musicAudioRef}
          musicWidgetStyle={musicWidgetStyle}
          setMusicWidgetStyle={setMusicWidgetStyle}
          musicWidgetColor={musicWidgetColor}
          setMusicWidgetColor={setMusicWidgetColor}
          sectionCat={sectionCat}
          setSectionCat={setSectionCat}
          triggerAutosave={triggerAutosave}
          query={query}
          actions={actions}
          CraftText={CraftText}
          CraftImage={CraftImage}
          CraftContainer={CraftContainer}
          CraftCountdown={CraftCountdown}
          CraftCalendar={CraftCalendar}
          CraftMap={CraftMap}
          CraftRSVP={CraftRSVP}
          CraftCallButton={CraftCallButton}
          CraftPhotoAlbum={CraftPhotoAlbum}
          CraftYouTube={CraftYouTube}
          CraftQRBox={CraftQRBox}
          CraftGuestName={CraftGuestName}
          CraftFormBuilder={CraftFormBuilder}
          CraftEnvelope={CraftEnvelope}
          CraftSticker={CraftSticker}
          CraftShape={CraftShape}
          editorDispatch={editorDispatch}
          editorState={editorState}
        />

        {/* ══ Canvas Area ══ */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "32px 24px",
            background: "linear-gradient(180deg, #d1d5db 0%, #e5e7eb 100%)",
            position: "relative",
          }}
        >
          {/* ── Floating Element Toolbar ── */}
          {selected && (
            <FloatingToolbar
              selected={selected}
              triggerAutosave={triggerAutosave}
              query={query}
              actions={actions}
            />
          )}
          <EditorContext.Provider value={editorCtx}>
            <CanvasRenderer />
            <CanvasContextMenu />
            <CanvasKeyboardHandler />
          </EditorContext.Provider>

          {/* Zoom + Device Preview Controls */}
          <div
            style={{
              position: "sticky",
              bottom: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginLeft: "auto",
              marginRight: 12,
              marginTop: -44,
              zIndex: 10,
              width: "fit-content",
            }}
          >
            <DevicePreviewBar
              activeDevice={previewDevice}
              onDeviceChange={setPreviewDevice}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,255,255,0.95)",
                borderRadius: 10,
                padding: "4px 8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                title="Thu nhỏ"
                style={{
                  width: 28,
                  height: 28,
                  border: "none",
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#374151",
                }}
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => setZoom(100)}
                title="Reset 100%"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b7280",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "2px 6px",
                  minWidth: 36,
                  textAlign: "center",
                }}
              >
                {zoom}%
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
                title="Phóng to"
                style={{
                  width: 28,
                  height: 28,
                  border: "none",
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#374151",
                }}
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ══ Right Settings Panel — CineLove accordion style ══ */}
        <div
          style={{
            width: 350,
            background: "#fafafa",
            borderLeft: "1px solid #e5e7eb",
            overflowY: "auto",
            flexShrink: 0,
            boxShadow: "-2px 0 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #f0f0f0",
              background: "linear-gradient(180deg, #fff 0%, #fafafa 100%)",
            }}
          >
            <h3
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
                margin: 0,
                letterSpacing: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✏️ Tuỳ chỉnh
            </h3>
          </div>
          <div style={{ padding: 16 }}>
            <EditorContext.Provider value={editorCtx}>
              <CanvasRightPanel
                projectCategory={projectCategory}
                setProjectCategory={setProjectCategory}
                projectStatus={projectStatus}
                setProjectStatus={setProjectStatus}
                removeWatermark={removeWatermark}
                setRemoveWatermark={setRemoveWatermark}
                autoScroll={autoScroll}
                setAutoScroll={setAutoScroll}
                scrollSpeed={scrollSpeed}
                setScrollSpeed={setScrollSpeed}
                qrBank={qrBank}
                setQrBank={setQrBank}
                triggerAutosave={triggerAutosave}
              />
            </EditorContext.Provider>
          </div>
          {/* close content padding wrapper */}
        </div>
      </div>

      {/* Quick Image Replace Bar removed (was CraftJS-dependent) */}
    </div>
  );
}
