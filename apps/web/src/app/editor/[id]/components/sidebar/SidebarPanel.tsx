"use client";

import React from "react";
import { TABS } from "../editor-constants";
import { TextTab } from "./TextTab";
import { ImageTab } from "./ImageTab";
import { BgTab } from "./BgTab";
import { PluginsTab } from "./PluginsTab";
import { StockTab } from "./StockTab";
import { ShapesTab } from "./ShapesTab";
import { TemplatesTab } from "./TemplatesTab";
import { EffectsTab } from "./EffectsTab";
import { MusicTab } from "./MusicTab";
import { ComponentsTab } from "./ComponentsTab";
import type { TEXT_PRESETS } from "../editor-constants";
import type { EditorAction, EditorState } from "../canvas-engine/types";

interface UploadedImage {
  url: string;
  name: string;
  size: number;
}

interface SidebarPanelProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
  /* Text tab */
  addCraftText: (preset: (typeof TEXT_PRESETS)[0]) => void;
  /* Image tab */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  /* BG tab */
  background: string;
  setBackground: (val: string) => void;
  bgSubTab: "colors" | "gradient" | "image";
  setBgSubTab: (val: "colors" | "gradient" | "image") => void;
  bgOpacity: number;
  setBgOpacity: (val: number) => void;
  projectId: string;
  /* Stock tab */
  clipartCat: string;
  setClipartCat: (val: string) => void;
  /* Effects tab */
  effectSubTab: string;
  setEffectSubTab: (val: string) => void;
  pageAnimation: string;
  setPageAnimation: (val: string) => void;
  curtainEffect: string;
  setCurtainEffect: (val: string) => void;
  particleEffect: string;
  setParticleEffect: (val: string) => void;
  /* Music tab */
  musicUrl: string;
  setMusicUrl: (val: string) => void;
  musicName: string;
  setMusicName: (val: string) => void;
  musicFilter:
    | "all"
    | "intl"
    | "vpop"
    | "acoustic"
    | "piano"
    | "kpop"
    | "classical";
  setMusicFilter: (
    val: "all" | "intl" | "vpop" | "acoustic" | "piano" | "kpop" | "classical",
  ) => void;
  musicSearch: string;
  setMusicSearch: (val: string) => void;
  previewId: string | null;
  setPreviewId: (val: string | null) => void;
  musicAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  musicWidgetStyle: string;
  setMusicWidgetStyle: (val: string) => void;
  musicWidgetColor: string;
  setMusicWidgetColor: (val: string) => void;
  /* Components tab */
  sectionCat: string;
  setSectionCat: (val: string) => void;
  /* Canvas-engine state */
  editorDispatch?: React.Dispatch<EditorAction>;
  editorState?: EditorState;
  /* Common */
  triggerAutosave: () => void;
  /* Responsive */
  isMobile?: boolean;
}

export function SidebarPanel(props: SidebarPanelProps) {
  const { activeTab, setActiveTab, isMobile } = props;
  const isSmallScreen = isMobile !== undefined ? isMobile : false;

  if (activeTab === "") return null;

  return (
    <div
      style={{
        position: isSmallScreen ? "fixed" : "absolute",
        top: 0,
        left: isSmallScreen ? 0 : 85,
        bottom: 0,
        right: isSmallScreen ? 0 : "auto",
        width: isSmallScreen ? "100%" : 220,
        background: "#fff",
        borderRight: isSmallScreen ? "none" : "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: isSmallScreen ? 50 : 20,
        animation: "slideIn 0.2s ease",
        boxShadow: isSmallScreen
          ? "0 0 40px rgba(0,0,0,0.15)"
          : "4px 0 24px rgba(0,0,0,0.08)",
      }}
    >
      <style>{`@keyframes slideIn { from { transform: translateX(-10px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
      <div
        style={{
          padding: "12px 16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#374151",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          {TABS.find((t) => t.key === activeTab)?.label}
        </p>
        <button
          onClick={() => setActiveTab("")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            fontSize: 16,
            padding: 2,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {activeTab === "text" && <TextTab addCraftText={props.addCraftText} />}

        {activeTab === "image" && (
          <ImageTab
            fileInputRef={props.fileInputRef}
            handleImageUpload={props.handleImageUpload}
            uploadedImages={props.uploadedImages}
            setUploadedImages={props.setUploadedImages}
            triggerAutosave={props.triggerAutosave}
            editorDispatch={props.editorDispatch}
          />
        )}

        {activeTab === "bg" && (
          <BgTab
            background={props.background}
            setBackground={props.setBackground}
            bgSubTab={props.bgSubTab}
            setBgSubTab={props.setBgSubTab}
            bgOpacity={props.bgOpacity}
            setBgOpacity={props.setBgOpacity}
            triggerAutosave={props.triggerAutosave}
            projectId={props.projectId}
          />
        )}

        {activeTab === "plugins" && (
          <PluginsTab
            triggerAutosave={props.triggerAutosave}
            editorDispatch={props.editorDispatch}
          />
        )}

        {activeTab === "stock" && (
          <StockTab
            clipartCat={props.clipartCat}
            setClipartCat={props.setClipartCat}
            triggerAutosave={props.triggerAutosave}
            editorDispatch={props.editorDispatch}
          />
        )}

        {activeTab === "shapes" && (
          <ShapesTab
            triggerAutosave={props.triggerAutosave}
            editorDispatch={props.editorDispatch}
          />
        )}

        {activeTab === "templates" && (
          <TemplatesTab
            background={props.background}
            setBackground={props.setBackground}
            triggerAutosave={props.triggerAutosave}
          />
        )}

        {activeTab === "effects" && (
          <EffectsTab
            effectSubTab={props.effectSubTab}
            setEffectSubTab={props.setEffectSubTab}
            pageAnimation={props.pageAnimation}
            setPageAnimation={props.setPageAnimation}
            curtainEffect={props.curtainEffect}
            setCurtainEffect={props.setCurtainEffect}
            particleEffect={props.particleEffect}
            setParticleEffect={props.setParticleEffect}
            triggerAutosave={props.triggerAutosave}
          />
        )}

        {activeTab === "music" && (
          <MusicTab
            musicUrl={props.musicUrl}
            setMusicUrl={props.setMusicUrl}
            musicName={props.musicName}
            setMusicName={props.setMusicName}
            musicFilter={props.musicFilter}
            setMusicFilter={props.setMusicFilter}
            musicSearch={props.musicSearch}
            setMusicSearch={props.setMusicSearch}
            previewId={props.previewId}
            setPreviewId={props.setPreviewId}
            musicAudioRef={props.musicAudioRef}
            musicWidgetStyle={props.musicWidgetStyle}
            setMusicWidgetStyle={props.setMusicWidgetStyle}
            musicWidgetColor={props.musicWidgetColor}
            setMusicWidgetColor={props.setMusicWidgetColor}
            triggerAutosave={props.triggerAutosave}
          />
        )}

        {activeTab === "components" && (
          <ComponentsTab
            sectionCat={props.sectionCat}
            setSectionCat={props.setSectionCat}
            triggerAutosave={props.triggerAutosave}
            editorDispatch={props.editorDispatch}
            editorState={props.editorState}
          />
        )}
      </div>
    </div>
  );
}
