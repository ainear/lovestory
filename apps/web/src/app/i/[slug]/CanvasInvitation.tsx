"use client";

/**
 * CanvasInvitation v2 — Multi-section scrollable published invitation.
 * Sprint 56: Full-page scroll with per-section IntersectionObserver,
 *            parallax background, sticky music, floating RSVP CTA.
 * Replaces the old single-card static render.
 */

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";

/* ═══════ Security helpers ═══════ */

function safeColor(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  if (
    /^(#[0-9a-fA-F]{3,8}|rgba?\([\d\s,./%]+\)|hsla?\([\d\s,./%]+\)|[a-z]+|transparent|none)$/i.test(
      val.trim(),
    )
  )
    return val.trim();
  return fallback;
}

function safeSrc(src: string | undefined): string {
  if (!src) return "";
  if (
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("data:image/")
  )
    return src;
  return "";
}

/* ═══════ Types ═══════ */

export interface ElementAnimationData {
  entrance?:
    | "none"
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "zoomIn"
    | "bounceIn";
  loop?: "none" | "pulse" | "float" | "shake";
}

export interface CanvasElementData {
  id: string;
  type: "text" | "image" | "sticker" | "shape" | "widget";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  animation?: ElementAnimationData;
  props: {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    textAlign?: "left" | "center" | "right";
    fontWeight?: "normal" | "bold";
    fontStyle?: "normal" | "italic";
    lineHeight?: number;
    src?: string;
    objectFit?: "cover" | "contain";
    borderRadius?: number;
    opacity?: number;
    filter?: string;
    boxShadow?: string;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: string;
  };
}

export interface CanvasData {
  version: number;
  canvas: { width: number; height: number; bg: string };
  elements: CanvasElementData[];
  meta?: { musicUrl?: string; musicName?: string };
  effects?: { particleEffect?: string; introEffect?: string };
}

type ParticleType =
  | "hearts"
  | "flowers"
  | "snow"
  | "stars"
  | "confetti"
  | "butterflies"
  | "petals"
  | "mixed"
  | "none";

/* ═══════ Sub-components ═══════ */

const PARTICLE_CHARS: Record<string, string[]> = {
  hearts: ["❤️", "💕", "💗", "💖", "💞", "💘"],
  flowers: ["🌸", "🌺", "💮", "🌼", "🏵️", "🌷"],
  snow: ["❄️", "❅", "❆", "✦", "·", "⊹"],
  stars: ["⭐", "✨", "🌟", "💫", "⊹", "✦"],
  confetti: ["🎊", "🎉", "✨", "⭐", "🌟", "🎈"],
  butterflies: ["🦋", "🦋", "🦋", "🌿", "🍃", "🦋"],
  petals: ["🌸", "🌺", "🌹", "💮", "🌼", "🌷"],
  mixed: ["❤️", "🌸", "✨", "🦋", "💫", "🌟"],
};

function ParticleOverlay({ effect }: { effect: ParticleType }) {
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (effect === "none" || !PARTICLE_CHARS[effect]) return null;
  const chars = PARTICLE_CHARS[effect];
  const count =
    typeof window !== "undefined" && window.innerWidth < 768 ? 15 : 28;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 900,
      }}
    >
      <style>{`
                @keyframes particleFall {
                    0% { transform: translateY(-30px) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.9; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                @keyframes particleSway {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(20px); }
                }
            `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 13 + 5) % 96}%`,
            top: -30,
            fontSize: 10 + (i % 5) * 4,
            animation: `particleFall ${5 + (i % 4) * 2.5}s linear ${(i * 0.5) % 6}s infinite, particleSway ${3 + (i % 3)}s ease-in-out ${(i * 0.3) % 4}s infinite`,
            animationPlayState: visible ? "running" : "paused",
            willChange: "transform",
            transform: "translateZ(0)",
            opacity: 0,
            filter: i % 3 === 0 ? "blur(0.5px)" : "none",
          }}
        >
          {chars[i % chars.length]}
        </span>
      ))}
    </div>
  );
}

/** Scroll-in-view reveal wrapper — respects pageAnimation preset */
function ScrollSection({
  children,
  delay = 0,
  pageAnimation = "none",
}: {
  children: React.ReactNode;
  delay?: number;
  pageAnimation?: PageAnimPreset;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const animStyles = getPageAnimStyles(pageAnimation, delay);
  return (
    <div
      ref={ref}
      style={{
        ...(visible ? animStyles.visible : animStyles.hidden),
        transition: animStyles.transition,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════ Page Animation Types ═══════ */

type PageAnimPreset =
  | "none"
  | "fadeInAll"
  | "slideUpAll"
  | "scaleInAll"
  | "flipInAll"
  | "slideUpMix"
  | "fadeInMix";

/** Returns CSS for the visible state and the hidden state for a given pageAnimation preset */
function getPageAnimStyles(
  preset: PageAnimPreset,
  delay: number,
): {
  hidden: React.CSSProperties;
  visible: React.CSSProperties;
  transition: string;
} {
  const dur = "0.8s";
  const easing = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  const base = `opacity ${dur} ${easing} ${delay}s`;

  switch (preset) {
    case "fadeInAll":
    case "fadeInMix":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        transition: base,
      };
    case "slideUpAll":
    case "slideUpMix":
      return {
        hidden: { opacity: 0, transform: "translateY(40px)" },
        visible: { opacity: 1, transform: "translateY(0)" },
        transition: `${base}, transform ${dur} ${easing} ${delay}s`,
      };
    case "scaleInAll":
      return {
        hidden: { opacity: 0, transform: "scale(0.88)" },
        visible: { opacity: 1, transform: "scale(1)" },
        transition: `${base}, transform ${dur} ${easing} ${delay}s`,
      };
    case "flipInAll":
      return {
        hidden: { opacity: 0, transform: "perspective(600px) rotateX(60deg)" },
        visible: { opacity: 1, transform: "perspective(600px) rotateX(0deg)" },
        transition: `${base}, transform ${dur} ${easing} ${delay}s`,
      };
    default:
      // "none" — still use a subtle slide-up as default UX
      return {
        hidden: { opacity: 0, transform: "translateY(30px)" },
        visible: { opacity: 1, transform: "translateY(0)" },
        transition: `${base}, transform ${dur} ${easing} ${delay}s`,
      };
  }
}

/* ═══════ Curtain / Fadereveal Overlay ═══════ */

function CurtainOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");

  const open = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("opening");
    onDone();
    setTimeout(() => setPhase("done"), 1200);
  }, [phase, onDone]);

  if (phase === "done") return null;

  return (
    <div
      onClick={open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <style>{`
                @keyframes curtainLeft {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-100%); }
                }
                @keyframes curtainRight {
                    from { transform: translateX(0); }
                    to   { transform: translateX(100%); }
                }
                @keyframes curtainPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>

      {/* Left panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(135deg, #9b1657 0%, #e91e8c 100%)",
          animation:
            phase === "opening"
              ? "curtainLeft 1s cubic-bezier(0.77,0,0.18,1) forwards"
              : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 8,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 4,
            height: "100%",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Right panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(225deg, #9b1657 0%, #e91e8c 100%)",
          animation:
            phase === "opening"
              ? "curtainRight 1s cubic-bezier(0.77,0,0.18,1) forwards"
              : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: 8,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 4,
            height: "100%",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Center text */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          opacity: phase === "opening" ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>
          🎭
        </span>
        <p
          style={{
            fontSize: 15,
            color: "#fff",
            margin: 0,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: 2,
            textTransform: "uppercase",
            animation: "curtainPulse 2s ease-in-out infinite",
          }}
        >
          Nhấn để mở thiệp
        </p>
      </div>
    </div>
  );
}

function FadeRevealOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"idle" | "fading" | "done">("idle");

  const open = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("fading");
    onDone();
    setTimeout(() => setPhase("done"), 1000);
  }, [phase, onDone]);

  if (phase === "done") return null;

  return (
    <div
      onClick={open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 1s ease-out",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>
          🌅
        </span>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.8)",
            margin: 0,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Nhấn để xem thiệp
        </p>
      </div>
    </div>
  );
}

/* ═══════ Envelope Intro Animation ═══════ */
function EnvelopeIntro({
  guestName,
  onOpen,
}: {
  groomName?: string;
  brideName?: string;
  guestName?: string;
  onOpen?: () => void;
}) {
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");

  const handleOpen = useCallback(() => {
    if (phase !== "closed") return;
    setPhase("opening");
    onOpen?.();
    setTimeout(() => setPhase("opened"), 1800);
  }, [phase, onOpen]);

  if (phase === "opened") return null;

  return (
    <div
      onClick={handleOpen}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 30%, #f48fb1 70%, #ec407a 100%)",
        cursor: "pointer",
        opacity: phase === "opening" ? 0 : 1,
        transition: "opacity 0.8s ease-out 1s",
        fontFamily: "'Playfair Display', serif",
      }}
    >
      <style>{`
                @keyframes envelopePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                @keyframes lidOpen {
                    0% { transform: rotateX(0deg); }
                    100% { transform: rotateX(-180deg); }
                }
                @keyframes cardSlide {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-60px); }
                }
                @keyframes sealBounce {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(-5deg); }
                    75% { transform: scale(0.95) rotate(5deg); }
                }
            `}</style>

      <div
        style={{
          width: 280,
          height: 200,
          position: "relative",
          perspective: 800,
          animation:
            phase === "closed"
              ? "envelopePulse 2s ease-in-out infinite"
              : "none",
        }}
      >
        {/* Envelope body */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, #fff5f5 0%, #ffe0e6 100%)",
            borderRadius: 12,
            boxShadow:
              "0 8px 32px rgba(236,64,122,0.3), 0 2px 8px rgba(0,0,0,0.1)",
            position: "relative",
            overflow: "hidden",
            border: "2px solid rgba(236,64,122,0.2)",
          }}
        >
          {/* Inner card preview */}
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
              background: "#fff",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              animation:
                phase === "opening"
                  ? "cardSlide 0.8s ease-out 0.3s forwards"
                  : "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#ec407a",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Thiệp mời
            </span>
            {guestName && (
              <span
                style={{ fontSize: 14, color: "#880e4f", fontStyle: "italic" }}
              >
                {guestName}
              </span>
            )}
            <span style={{ fontSize: 20 }}>💒</span>
          </div>
        </div>

        {/* Envelope lid (flap) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            transformOrigin: "top center",
            animation:
              phase === "opening"
                ? "lidOpen 0.8s ease-in-out forwards"
                : "none",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "140px solid transparent",
              borderRight: "140px solid transparent",
              borderTop: "100px solid #ffe0e6",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />
        </div>

        {/* Wax seal */}
        <div
          style={{
            position: "absolute",
            bottom: -16,
            left: "50%",
            transform: "translateX(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e91e63, #c2185b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(233,30,99,0.4)",
            animation:
              phase === "closed"
                ? "sealBounce 2s ease-in-out infinite"
                : "none",
            opacity: phase === "opening" ? 0 : 1,
            transition: "opacity 0.3s",
            zIndex: 3,
          }}
        >
          <span style={{ fontSize: 18 }}>❤️</span>
        </div>
      </div>

      {/* Tap to open text */}
      <p
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 14,
          color: "rgba(255,255,255,0.9)",
          letterSpacing: 2,
          textTransform: "uppercase",
          animation: "envelopePulse 2s ease-in-out infinite",
          opacity: phase === "opening" ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      >
        ✉️ Nhấn để mở thiệp
      </p>
    </div>
  );
}

/* ═══════ Section Splitter ═══════ */

interface Section {
  elements: CanvasElementData[];
  yStart: number;
  yEnd: number;
}

/** Split elements into sections by Y-position bands (each ~SECTION_H px tall) */
function splitIntoSections(
  elements: CanvasElementData[],
  canvasHeight: number,
): Section[] {
  const SECTION_H = Math.min(400, canvasHeight / 2); // ~2-4 sections
  const sorted = [...elements].sort((a, b) => a.y - b.y);
  const sections: Section[] = [];
  let currentSection: Section = { elements: [], yStart: 0, yEnd: SECTION_H };

  for (const el of sorted) {
    if (el.y >= currentSection.yEnd && currentSection.elements.length > 0) {
      sections.push(currentSection);
      const newStart = currentSection.yEnd;
      currentSection = {
        elements: [],
        yStart: newStart,
        yEnd: newStart + SECTION_H,
      };
    }
    // Adjust yEnd to fit this element
    const elBottom = el.y + el.height;
    if (elBottom > currentSection.yEnd) currentSection.yEnd = elBottom + 20;
    currentSection.elements.push(el);
  }
  if (currentSection.elements.length > 0) sections.push(currentSection);

  return sections;
}

/* ═══════ Element Renderer ═══════ */

function RenderElement({
  el,
  sectionYStart,
  idx,
}: {
  el: CanvasElementData;
  sectionYStart: number;
  idx: number;
}) {
  const entranceAnim =
    el.animation?.entrance && el.animation.entrance !== "none"
      ? `${el.animation.entrance} 0.6s ease-out ${idx * 0.12}s both`
      : undefined;
  const loopAnim =
    el.animation?.loop && el.animation.loop !== "none"
      ? `el${el.animation.loop.charAt(0).toUpperCase() + el.animation.loop.slice(1)} 2s ease-in-out infinite`
      : undefined;
  const animStr =
    [entranceAnim, loopAnim].filter(Boolean).join(", ") || undefined;

  // Remap Y position relative to section
  const relativeY = el.y - sectionYStart;

  if (el.type === "text") {
    const p = el.props;
    return (
      <div
        style={{
          position: "absolute",
          left: el.x,
          top: relativeY,
          width: el.width,
          minHeight: el.height,
          zIndex: el.zIndex,
          opacity: el.opacity,
          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
          fontSize: p.fontSize ?? 24,
          fontFamily: p.fontFamily ?? "serif",
          color: p.color ?? "#1f2937",
          textAlign: p.textAlign ?? "center",
          fontWeight: p.fontWeight ?? "normal",
          fontStyle: p.fontStyle ?? "normal",
          lineHeight: p.lineHeight ?? 1.4,
          padding: "2px 4px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          boxSizing: "border-box",
          pointerEvents: "none",
          userSelect: "none",
          animation: animStr,
          boxShadow: p.boxShadow || undefined,
        }}
      >
        {p.text ?? ""}
      </div>
    );
  }

  if (el.type === "image") {
    const p = el.props;
    if (!p.src) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: el.x,
          top: relativeY,
          width: el.width,
          height: el.height,
          zIndex: el.zIndex,
          borderRadius: p.borderRadius ?? 12,
          overflow: "hidden",
          opacity: el.opacity,
          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
          animation: animStr,
          boxShadow: p.boxShadow || undefined,
          border: p.borderWidth
            ? `${p.borderWidth}px ${p.borderStyle || "solid"} ${p.borderColor || "transparent"}`
            : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safeSrc(p.src)}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: p.objectFit ?? "cover",
            display: "block",
            filter: p.filter || undefined,
          }}
        />
      </div>
    );
  }

  /* ── Sprint 57: Widget rendering on published page ── */
  if (
    el.type === "widget" ||
    (el.props as Record<string, unknown>).widgetType
  ) {
    const p = el.props as Record<string, unknown>;
    const wt = (p.widgetType ?? "countdown") as string;
    const wrapStyle: React.CSSProperties = {
      position: "absolute",
      left: el.x,
      top: relativeY,
      width: el.width,
      height: el.height,
      zIndex: el.zIndex,
      opacity: el.opacity,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      animation: animStr,
      fontFamily: "'Inter', sans-serif",
    };

    if (wt === "countdown") {
      const target = p.targetDate
        ? new Date(p.targetDate as string).getTime()
        : Date.now() + 30 * 86400000;
      const diff = Math.max(0, target - Date.now());
      const blocks = [
        { v: Math.floor(diff / 86400000), l: "Ngày" },
        { v: Math.floor((diff % 86400000) / 3600000), l: "Giờ" },
        { v: Math.floor((diff % 3600000) / 60000), l: "Phút" },
        { v: Math.floor((diff % 60000) / 1000), l: "Giây" },
      ];
      return (
        <div
          style={{
            ...wrapStyle,
            background:
              "linear-gradient(135deg, rgba(253,242,248,0.95), rgba(252,231,243,0.95))",
            borderRadius: 16,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backdropFilter: "blur(8px)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#831843",
              margin: 0,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {(p.label as string) || "ĐẾM NGƯỢC"}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {blocks.map((b) => (
              <div
                key={b.l}
                style={{
                  textAlign: "center",
                  background: "#fff",
                  borderRadius: 10,
                  padding: "8px 12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  minWidth: 52,
                }}
              >
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#e11d48",
                    margin: 0,
                  }}
                >
                  {String(b.v).padStart(2, "0")}
                </p>
                <p style={{ fontSize: 9, color: "#9ca3af", margin: 0 }}>
                  {b.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (wt === "map") {
      const venueName = (p.venueName ||
        p.label ||
        "Vị trí tiệc cưới") as string;
      const venueAddr = (p.venueAddress || "") as string;
      const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddr)}`;
      return (
        <div
          style={{
            ...wrapStyle,
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #d1fae5, #ecfdf5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "60%",
            }}
          >
            <span style={{ fontSize: 36 }}>📍</span>
          </div>
          <div style={{ padding: "10px 14px" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                margin: 0,
              }}
            >
              {venueName}
            </p>
            {venueAddr && (
              <p
                style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 8px" }}
              >
                {venueAddr}
              </p>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "8px",
                borderRadius: 10,
                border: "none",
                background: "#10b981",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              🗺️ Chỉ đường
            </a>
          </div>
        </div>
      );
    }

    if (wt === "gift") {
      return (
        <div
          style={{
            ...wrapStyle,
            background: "linear-gradient(135deg, #fef3c7, #fefde8)",
            borderRadius: 16,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            border: "1px solid #fcd34d",
          }}
        >
          <span style={{ fontSize: 28 }}>💰</span>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#92400e",
              margin: 0,
            }}
          >
            {(p.label as string) || "Phong bì mừng cưới"}
          </p>
          {Boolean(p.bankName) && (
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "8px 16px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>
                {String(p.bankName)}
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#374151",
                  margin: "2px 0",
                  letterSpacing: 1,
                }}
              >
                {(p.accountNumber as string) || "0123456789"}
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                {(p.accountName as string) || ""}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (wt === "qr") {
      const qrUrl = `https://img.vietqr.io/image/${(p.bankBin || "970422") as string}-${(p.accountNumber || "0123456789") as string}-qr_only.png?amount=${(p.amount || "") as string}&addInfo=${encodeURIComponent((p.message || "") as string)}`;
      return (
        <div
          style={{
            ...wrapStyle,
            background: "#fff",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              margin: 0,
            }}
          >
            {(p.label as string) || "Quét mã QR"}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="QR"
            style={{ width: 120, height: 120, borderRadius: 8 }}
          />
          {Boolean(p.bankName) && (
            <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>
              {String(p.bankName)} — {String(p.accountName || "")}
            </p>
          )}
        </div>
      );
    }

    if (wt === "calendar") {
      const targetDate = p.targetDate
        ? new Date(p.targetDate as string)
        : new Date();
      const month = targetDate.toLocaleString("vi-VN", { month: "long" });
      const year = targetDate.getFullYear();
      const day = targetDate.getDate();
      return (
        <div
          style={{
            ...wrapStyle,
            background: "#fff",
            borderRadius: 16,
            padding: 14,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#374151",
              margin: "0 0 8px",
              textTransform: "capitalize",
            }}
          >
            {month} {year}
          </p>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#ff6b9d",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            {day}
          </div>
        </div>
      );
    }

    if (wt === "guestname") {
      return (
        <div
          style={{
            ...wrapStyle,
            background:
              "linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,245,255,0.9))",
            borderRadius: 16,
            border: "1px dashed #d946ef",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#9333ea",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {(p.guestNameLabel as string) || "Trân trọng kính mời"}
          </p>
          <p
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#7c3aed",
              margin: 0,
              fontStyle: "italic",
              fontFamily: "'Great Vibes', cursive",
            }}
          >
            Tên khách mời
          </p>
        </div>
      );
    }

    if (wt === "call") {
      const phone = (p.phoneNumber || "0909 xxx xxx") as string;
      return (
        <div
          style={{
            ...wrapStyle,
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            borderRadius: 16,
            border: "1px solid #6ee7b7",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 28 }}>📞</span>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#065f46",
              margin: 0,
            }}
          >
            {(p.label as string) || "Liên hệ"}
          </p>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            style={{
              padding: "8px 20px",
              borderRadius: 99,
              border: "none",
              background: "#10b981",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            📱 Gọi {phone}
          </a>
        </div>
      );
    }

    if (wt === "youtube") {
      const url = (p.youtubeUrl ?? "") as string;
      const match = url.match(
        /(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );
      const videoId = match?.[1];
      if (!videoId) return <div style={wrapStyle} />;
      return (
        <div style={{ ...wrapStyle, borderRadius: 16, overflow: "hidden" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="autoplay; encrypted-media"
            loading="lazy"
          />
        </div>
      );
    }

    if (wt === "album") {
      const images = ((p.albumImages as string) || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      return (
        <div
          style={{
            ...wrapStyle,
            background: "#fff",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#374151",
              margin: 0,
              textAlign: "center",
            }}
          >
            {(p.label as string) || "Album ảnh cưới"}
          </p>
          {images.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 4,
                flex: 1,
                overflow: "hidden",
              }}
            >
              {images.map((src: string, i: number) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#f3f4f6",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={safeSrc(src)}
                    alt={`Photo ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: 11,
              }}
            >
              Chưa có ảnh
            </div>
          )}
        </div>
      );
    }

    if (wt === "formbuilder") {
      const fields = Array.isArray(p.fields)
        ? (p.fields as Array<{
            id?: string;
            label?: string;
            type?: string;
            placeholder?: string;
            options?: string[];
            required?: boolean;
          }>)
        : [];
      return (
        <div
          style={{
            ...wrapStyle,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 16,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#374151",
              margin: 0,
              textAlign: "center",
            }}
          >
            {(p.title as string) || "Biểu mẫu"}
          </p>
          {Boolean(p.subtitle) && (
            <p
              style={{
                fontSize: 11,
                color: "#6b7280",
                margin: 0,
                textAlign: "center",
              }}
            >
              {p.subtitle as string}
            </p>
          )}
          {fields.map(
            (
              field: {
                id?: string;
                label?: string;
                type?: string;
                placeholder?: string;
                options?: string[];
                required?: boolean;
              },
              idx: number,
            ) => (
              <div
                key={field.id || idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {field.label || `Trường ${idx + 1}`}
                  {field.required && (
                    <span style={{ color: "#e11d48", marginLeft: 2 }}>*</span>
                  )}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder || ""}
                    rows={3}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                      width: "100%",
                      boxSizing: "border-box" as const,
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                ) : field.type === "select" ? (
                  <select
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                      width: "100%",
                      boxSizing: "border-box" as const,
                      background: "#fff",
                    }}
                  >
                    <option value="">{field.placeholder || "Chọn..."}</option>
                    {(field.options || []).map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "#374151",
                    }}
                  >
                    <input type="checkbox" />
                    {field.placeholder || field.label || ""}
                  </label>
                ) : (
                  <input
                    type={field.type === "tel" ? "tel" : "text"}
                    placeholder={field.placeholder || ""}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                      width: "100%",
                      boxSizing: "border-box" as const,
                    }}
                  />
                )}
              </div>
            ),
          )}
          <button
            style={{
              padding: "10px 20px",
              borderRadius: 99,
              border: "none",
              background: (p.buttonColor as string) || "#e11d48",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            {(p.buttonText as string) || "Gửi"}
          </button>
        </div>
      );
    }

    // Fallback for unknown widget types
    return <div style={wrapStyle} />;
  }

  return null;
}

/* ═══════ Published Page Widget Renderers ═══════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CountdownRenderer({ props: p }: { props: Record<string, any> }) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    function calc() {
      const diff =
        new Date(p.targetDate || "2026-05-28").getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }
    setTime(calc());
    const timer = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(timer);
  }, [p.targetDate]);

  const boxes = [
    { value: time.days, unit: "Ngày" },
    { value: time.hours, unit: "Giờ" },
    { value: time.minutes, unit: "Phút" },
    { value: time.seconds, unit: "Giây" },
  ];

  return (
    <div
      style={{
        padding: 20,
        background: p.background || "rgba(255,255,255,0.6)",
        borderRadius: p.borderRadius ?? 16,
        textAlign: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: p.labelColor || "#9f1239",
          margin: "0 0 12px",
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
        }}
      >
        {p.label || "Đếm ngược đến ngày cưới"}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {boxes.map((b) => (
          <div
            key={b.unit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: p.fontSize ?? 28,
                fontWeight: 700,
                color: p.color || "#831843",
                fontFamily: "'Cormorant Garamond', serif",
                minWidth: 48,
                lineHeight: 1,
              }}
            >
              {String(b.value).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: 10,
                color: p.labelColor || "#9f1239",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {b.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const WEEKDAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS_VI = [
  "",
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CalendarRenderer({ props: p }: { props: Record<string, any> }) {
  const d = new Date(p.targetDate || "2026-05-28");
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const days: (number | null)[] = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let dd = 1; dd <= daysInMonth; dd++) days.push(dd);

  return (
    <div
      style={{
        padding: 16,
        background: p.background || "rgba(255,255,255,0.7)",
        borderRadius: p.borderRadius ?? 16,
        width: "100%",
        boxSizing: "border-box",
        maxWidth: 320,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          textAlign: "center",
          margin: "0 0 12px",
          fontSize: 16,
          fontWeight: 700,
          color: p.accentColor || "#ff6b9d",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        {MONTHS_VI[month]} {year}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          marginBottom: 4,
        }}
      >
        {WEEKDAYS_VI.map((w) => (
          <div
            key={w}
            style={{
              textAlign: "center",
              fontSize: 9,
              fontWeight: 700,
              color: p.accentColor || "#ff6b9d",
              padding: "4px 0",
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
        }}
      >
        {days.map((dd, i) => {
          const isTarget = dd === day;
          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "6px 0",
                fontSize: 12,
                color: isTarget
                  ? "#fff"
                  : dd
                    ? p.textColor || "#374151"
                    : "transparent",
                fontWeight: isTarget ? 700 : 400,
                background: isTarget
                  ? p.accentColor || "#ff6b9d"
                  : "transparent",
                borderRadius: isTarget ? "50%" : 0,
                position: "relative",
              }}
            >
              {dd ?? ""}
              {isTarget && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -2,
                    fontSize: 10,
                  }}
                >
                  ❤️
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════ Craft.js v2 Static Renderer ═══════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CraftNode {
  type: { resolvedName: string };
  props: Record<string, any>;
  nodes?: string[];
  linkedNodes?: Record<string, string>;
}
interface CraftState {
  [nodeId: string]: CraftNode;
}

/** Parse craft.js serialized state and render statically (no drag-drop, view only) */
function CraftV2Renderer({
  craftState,
  background,
}: {
  craftState: string | Record<string, unknown>;
  background: string;
}) {
  const nodes: CraftState = useMemo(() => {
    try {
      if (typeof craftState === "object" && craftState !== null) {
        return craftState as unknown as CraftState;
      }
      return JSON.parse(craftState as string);
    } catch {
      return {};
    }
  }, [craftState]);

  /** Recursively render a craft.js node tree */
  function renderNode(nodeId: string): React.ReactNode {
    const node = nodes[nodeId];
    if (!node) return null;
    const name = node.type?.resolvedName || "";
    const p = node.props || {};
    const childIds = node.nodes || [];

    if (name === "CraftText") {
      return (
        <div
          key={nodeId}
          style={{
            padding: "4px 8px",
            fontSize: p.fontSize ?? 16,
            fontFamily: p.fontFamily ?? "serif",
            fontWeight: p.fontWeight ?? "normal",
            fontStyle: p.fontStyle ?? "normal",
            color: p.color ?? "#1f2937",
            textAlign: p.textAlign ?? "center",
            lineHeight: p.lineHeight ?? 1.5,
            letterSpacing: p.letterSpacing ?? 0,
            opacity: p.opacity ?? 1,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {p.text ?? ""}
        </div>
      );
    }

    if (name === "CraftImage") {
      return (
        <div
          key={nodeId}
          style={{ padding: 4, display: "flex", justifyContent: "center" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={safeSrc(p.src) || "/placeholder-couple.png"}
            alt="Wedding"
            style={{
              width: "100%",
              maxWidth: 320,
              height: "auto",
              objectFit: p.objectFit ?? "cover",
              borderRadius: p.borderRadius ?? 12,
              border:
                (p.borderWidth || 0) > 0
                  ? `${p.borderWidth}px solid ${p.borderColor || "transparent"}`
                  : undefined,
              opacity: p.opacity ?? 1,
              boxShadow: p.shadow ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
              display: "block",
            }}
          />
        </div>
      );
    }

    if (name === "CraftContainer" || name === "RootContainer") {
      const isRoot = name === "RootContainer";
      const bg = isRoot ? background : p.background || "transparent";
      const containerStyle: React.CSSProperties = {
        background: bg,
        padding: p.padding ?? (isRoot ? 0 : 16),
        minHeight: isRoot ? undefined : (p.minHeight ?? 100),
        display: "flex",
        flexDirection:
          (p.flexDirection as React.CSSProperties["flexDirection"]) ?? "column",
        alignItems: p.alignItems ?? "center",
        justifyContent: p.justifyContent ?? "center",
        gap: p.gap ?? 8,
        width: "100%",
        boxSizing: "border-box",
      };
      // Also render linked nodes (sections inside root)
      const linkedIds = Object.values(node.linkedNodes || {}) as string[];
      const allChildIds = [...childIds, ...linkedIds];
      return (
        <div key={nodeId} style={containerStyle}>
          {allChildIds.map((cid) => renderNode(cid))}
        </div>
      );
    }

    if (name === "CraftCountdown") {
      return <CountdownRenderer key={nodeId} props={p} />;
    }

    if (name === "CraftCalendar") {
      return <CalendarRenderer key={nodeId} props={p} />;
    }

    if (name === "CraftMap") {
      const embedUrl = `https://www.google.com/maps?q=${p.lat ?? 10.7769},${p.lng ?? 106.7009}&z=${p.zoom ?? 15}&output=embed`;
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat ?? 10.7769},${p.lng ?? 106.7009}`;
      return (
        <div
          key={nodeId}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#374151",
              margin: 0,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            📍 {p.venueName || "Nhà hàng"}
          </p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
            {p.address || ""}
          </p>
          <div
            style={{
              width: "100%",
              height: p.height ?? 200,
              borderRadius: p.borderRadius ?? 12,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
            }}
          >
            <iframe
              src={embedUrl}
              width="100%"
              height={p.height ?? 200}
              style={{ border: 0 }}
              loading="lazy"
              title="Wedding venue map"
            />
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 24,
              background: p.accentColor || "#ff6b9d",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            🧭 Chỉ đường
          </a>
        </div>
      );
    }

    if (name === "CraftRSVP") {
      return (
        <div
          key={nodeId}
          style={{
            padding: 20,
            background: p.background || "rgba(255,255,255,0.7)",
            borderRadius: p.borderRadius ?? 16,
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: p.accentColor || "#ff6b9d",
              margin: 0,
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            💌 {p.title || "Xác nhận tham dự"}
          </p>
          <p
            style={{
              fontSize: 12,
              color: p.textColor || "#374151",
              margin: 0,
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            {p.subtitle || ""}
          </p>
          <input
            type="text"
            placeholder="Họ và tên"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontSize: 13,
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 10,
                border: "none",
                background: p.accentColor || "#ff6b9d",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✅ Tham dự
            </button>
            <button
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 10,
                border: "none",
                background: "#f3f4f6",
                color: p.textColor || "#374151",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ❌ Vắng mặt
            </button>
          </div>
          <button
            style={{
              padding: "12px 20px",
              borderRadius: 24,
              border: "none",
              background: p.accentColor || "#ff6b9d",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Gửi xác nhận
          </button>
        </div>
      );
    }

    if (name === "CraftCallButton") {
      const icon =
        p.type === "call"
          ? "\u{1F4DE}"
          : p.type === "zalo"
            ? "\u{1F4AC}"
            : "\u{2709}\u{FE0F}";
      const href =
        p.type === "call"
          ? `tel:${p.phoneNumber}`
          : p.type === "zalo"
            ? `https://zalo.me/${p.phoneNumber}`
            : `sms:${p.phoneNumber}`;
      return (
        <div key={nodeId}>
          <a
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "14px 24px",
              borderRadius: p.borderRadius ?? 24,
              background: p.accentColor || "#ff6b9d",
              color: p.textColor || "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: "'Inter', sans-serif",
              boxShadow: `0 3px 12px ${p.accentColor || "#ff6b9d"}30`,
              width: "100%",
              boxSizing: "border-box" as const,
            }}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            {p.label || "Call"}
          </a>
        </div>
      );
    }

    if (name === "CraftPhotoAlbum") {
      const PLACEHOLDER_PHOTOS = [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300&h=300&fit=crop",
      ];
      const photos: string[] =
        p.photos && p.photos.length > 0 ? p.photos : PLACEHOLDER_PHOTOS;
      return (
        <div
          key={nodeId}
          style={{
            padding: 16,
            width: "100%",
            boxSizing: "border-box" as const,
          }}
        >
          {p.title && (
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: p.accentColor || "#ff6b9d",
                textAlign: "center",
                margin: "0 0 12px",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {p.title}
            </p>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${p.columns ?? 3}, 1fr)`,
              gap: p.gap ?? 6,
            }}
          >
            {photos.map((src: string, i: number) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: p.borderRadius ?? 8,
                  overflow: "hidden",
                  background: "#f3f4f6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={safeSrc(src)}
                  alt={`Photo ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (name === "CraftYouTube") {
      const videoMatch = (p.videoUrl || "").match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/,
      );
      const videoId = videoMatch ? videoMatch[1] : null;
      return (
        <div
          key={nodeId}
          style={{
            padding: 8,
            width: "100%",
            boxSizing: "border-box" as const,
          }}
        >
          <div
            style={{
              position: "relative",
              paddingBottom: p.aspectRatio === "4:3" ? "75%" : "56.25%",
              borderRadius: p.borderRadius ?? 12,
              overflow: "hidden",
              background: "#000",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            {videoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Wedding Video"
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <span style={{ fontSize: 40 }}>Video</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (name === "CraftQRBox") {
      const qrUrl = `https://img.vietqr.io/image/${p.bankName || "VCB"}-${p.accountNumber || ""}-compact.png?amount=${p.amount || ""}&addInfo=${encodeURIComponent(p.note || "")}&accountName=${encodeURIComponent(p.accountName || "")}`;
      return (
        <div
          key={nodeId}
          style={{
            padding: 20,
            width: "100%",
            boxSizing: "border-box" as const,
            background: "rgba(255,255,255,0.85)",
            borderRadius: p.borderRadius ?? 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            backdropFilter: "blur(8px)",
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: p.accentColor || "#ff6b9d",
              margin: 0,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Mung cuoi
          </p>
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 12,
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {p.accountNumber ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={qrUrl}
                alt="QR Code"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: 12,
                  padding: 16,
                }}
              >
                <span style={{ fontSize: 32 }}>QR</span>
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", width: "100%" }}>
            <p
              style={{
                fontSize: 13,
                color: p.textColor || "#374151",
                margin: "0 0 4px",
                fontWeight: 600,
              }}
            >
              {p.bankName || ""}
            </p>
            <p
              style={{
                fontSize: 16,
                color: p.accentColor || "#ff6b9d",
                margin: "0 0 4px",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {p.accountNumber || ""}
            </p>
            <p
              style={{
                fontSize: 12,
                color: p.textColor || "#374151",
                margin: 0,
                opacity: 0.7,
              }}
            >
              {p.accountName || ""}
            </p>
          </div>
          {p.accountNumber && (
            <button
              onClick={() => {
                if (p.accountNumber)
                  navigator.clipboard.writeText(p.accountNumber);
              }}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                border: `1px solid ${p.accentColor || "#ff6b9d"}`,
                background: "transparent",
                color: p.accentColor || "#ff6b9d",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sao chep STK
            </button>
          )}
        </div>
      );
    }

    if (name === "CraftGuestName") {
      return (
        <div
          key={nodeId}
          style={{
            padding: "16px 20px",
            width: "100%",
            boxSizing: "border-box" as const,
            textAlign:
              (p.textAlign as React.CSSProperties["textAlign"]) ?? "center",
          }}
        >
          {p.prefix && (
            <p
              style={{
                fontSize: (p.fontSize ?? 28) * 0.6,
                color: p.color || "#374151",
                fontFamily: p.fontFamily || "'Playfair Display', serif",
                margin: "0 0 4px",
                opacity: 0.6,
              }}
            >
              {p.prefix}
            </p>
          )}
          <p
            style={{
              fontSize: p.fontSize ?? 28,
              fontFamily: p.fontFamily || "'Playfair Display', serif",
              color: p.accentColor || "#ff6b9d",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {p.defaultName || "Quy khach"}
          </p>
        </div>
      );
    }

    if (name === "CraftFormBuilder") {
      const fields = p.fields || [];
      return (
        <div
          key={nodeId}
          style={{
            padding: 20,
            background: p.background || "rgba(255,255,255,0.8)",
            borderRadius: p.borderRadius ?? 16,
            width: "100%",
            boxSizing: "border-box" as const,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: p.accentColor || "#ff6b9d",
              margin: 0,
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {p.title || "Form"}
          </p>
          {p.subtitle && (
            <p
              style={{
                fontSize: 12,
                color: p.textColor || "#374151",
                margin: 0,
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              {p.subtitle}
            </p>
          )}
          {fields.map(
            (field: {
              id: string;
              label: string;
              type: string;
              placeholder?: string;
              options?: string[];
              required?: boolean;
            }) => (
              <div
                key={field.id}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: p.textColor || "#374151",
                  }}
                >
                  {field.label}
                  {field.required && (
                    <span
                      style={{
                        color: p.accentColor || "#ff6b9d",
                        marginLeft: 2,
                      }}
                    >
                      *
                    </span>
                  )}
                </label>
                {(field.type === "text" || field.type === "textarea") && (
                  <input
                    type="text"
                    placeholder={field.placeholder || ""}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      fontSize: 13,
                      width: "100%",
                      boxSizing: "border-box" as const,
                    }}
                  />
                )}
                {field.type === "radio" && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(field.options || []).map((opt: string) => (
                      <button
                        key={opt}
                        style={{
                          flex: 1,
                          padding: "10px 8px",
                          borderRadius: 10,
                          border: "none",
                          background: "#f3f4f6",
                          color: p.textColor || "#374151",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          minWidth: 80,
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
          <button
            style={{
              padding: "12px 20px",
              borderRadius: 24,
              border: "none",
              cursor: "pointer",
              background: p.accentColor || "#ff6b9d",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {p.buttonText || "Gui"}
          </button>
        </div>
      );
    }

    if (name === "CraftEnvelope") {
      return (
        <div
          key={nodeId}
          style={{
            padding: 20,
            width: "100%",
            boxSizing: "border-box" as const,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 220,
              height: 160,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: p.envelopeColor || "#d4a574",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 15,
                  right: 15,
                  height: 120,
                  background: "#fff",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: p.sealColor || "#c0392b",
                    fontFamily: p.fontFamily || "'Playfair Display', serif",
                    fontWeight: 700,
                  }}
                >
                  {p.groomName || "Anh"} & {p.brideName || "Em"}
                </span>
                <span style={{ fontSize: 8, color: "#9ca3af" }}>
                  Wedding Invitation
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: p.sealColor || "#c0392b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  fontSize: 14,
                }}
              >
                {"\u{1F48C}"}
              </div>
            </div>
          </div>
          <p
            style={{
              fontSize: 13,
              color: p.textColor || "#374151",
              fontFamily: p.fontFamily || "'Playfair Display', serif",
              fontWeight: 600,
              textAlign: "center",
              margin: 0,
            }}
          >
            {p.label || "Nhan de mo thiep moi"}
          </p>
        </div>
      );
    }

    if (name === "CraftSticker") {
      const STICKER_SVGS_VIEWER: Record<string, (c: string) => string> = {
        "heart-divider": (c) =>
          `<svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="15" x2="75" y2="15" stroke="${c}" stroke-width="1" opacity="0.4"/><path d="M100 5 C95 0 85 0 85 8 C85 16 100 22 100 22 C100 22 115 16 115 8 C115 0 105 0 100 5Z" fill="${c}"/><line x1="125" y1="15" x2="195" y2="15" stroke="${c}" stroke-width="1" opacity="0.4"/></svg>`,
        "double-hearts": (c) =>
          `<svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg"><path d="M25 10 C22 5 15 5 15 12 C15 19 25 25 25 25 C25 25 35 19 35 12 C35 5 28 5 25 10Z" fill="${c}" opacity="0.7"/><path d="M55 10 C52 5 45 5 45 12 C45 19 55 25 55 25 C55 25 65 19 65 12 C65 5 58 5 55 10Z" fill="${c}" opacity="0.9"/></svg>`,
        rings: (c) =>
          `<svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="20" r="12" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="52" cy="20" r="12" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="40" cy="8" r="2.5" fill="${c}"/></svg>`,
        "floral-top": (c) =>
          `<svg viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg"><path d="M30 35 Q40 15 50 25 Q55 10 65 20 Q75 5 80 20 Q85 5 95 20 Q105 10 110 25 Q120 15 130 35" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.6"/><circle cx="50" cy="22" r="2" fill="${c}" opacity="0.4"/><circle cx="80" cy="15" r="2.5" fill="${c}"/><circle cx="110" cy="22" r="2" fill="${c}" opacity="0.4"/></svg>`,
        "gold-line": (c) =>
          `<svg viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="5" x2="190" y2="5" stroke="${c}" stroke-width="1" opacity="0.5"/><circle cx="100" cy="5" r="3" fill="${c}"/><circle cx="85" cy="5" r="1.5" fill="${c}" opacity="0.5"/><circle cx="115" cy="5" r="1.5" fill="${c}" opacity="0.5"/></svg>`,
        "leaf-branch": (c) =>
          `<svg viewBox="0 0 160 30" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="15" x2="140" y2="15" stroke="${c}" stroke-width="0.8" opacity="0.3"/><ellipse cx="45" cy="11" rx="8" ry="4" fill="${c}" opacity="0.3" transform="rotate(-30 45 11)"/><ellipse cx="65" cy="19" rx="8" ry="4" fill="${c}" opacity="0.35" transform="rotate(30 65 19)"/><ellipse cx="95" cy="11" rx="8" ry="4" fill="${c}" opacity="0.35" transform="rotate(-30 95 11)"/><ellipse cx="115" cy="19" rx="8" ry="4" fill="${c}" opacity="0.3" transform="rotate(30 115 19)"/></svg>`,
        "star-sparkle": (c) =>
          `<svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg"><polygon points="20,5 22,12 29,12 23,17 25,24 20,19 15,24 17,17 11,12 18,12" fill="${c}" opacity="0.5"/><polygon points="50,3 52.5,11 60,11 54,16 56,24 50,19 44,24 46,16 40,11 47.5,11" fill="${c}" opacity="0.8"/><polygon points="80,5 82,12 89,12 83,17 85,24 80,19 75,24 77,17 71,12 78,12" fill="${c}" opacity="0.5"/></svg>`,
        butterfly: (c) =>
          `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"><path d="M30 20 Q15 5 10 15 Q5 25 30 20" fill="${c}" opacity="0.6"/><path d="M30 20 Q45 5 50 15 Q55 25 30 20" fill="${c}" opacity="0.6"/><path d="M30 20 Q18 25 15 32 Q20 35 30 20" fill="${c}" opacity="0.4"/><path d="M30 20 Q42 25 45 32 Q40 35 30 20" fill="${c}" opacity="0.4"/><line x1="30" y1="15" x2="30" y2="25" stroke="${c}" stroke-width="1"/></svg>`,
      };

      const sColor = p.color || "#d4a574";
      const sSize = p.size ?? 200;
      const sOpacity = p.opacity ?? 1;

      if (p.customSvg) {
        const coloredSvg = (p.customSvg as string).replace(
          /currentColor/g,
          sColor,
        );
        const cleanSvg = DOMPurify.sanitize(coloredSvg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          FORBID_TAGS: ["script", "foreignObject"],
          FORBID_ATTR: ["onclick", "onload", "onerror", "onmouseover"],
        });
        return (
          <div
            key={nodeId}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "4px 0",
              opacity: sOpacity,
            }}
            dangerouslySetInnerHTML={{
              __html: cleanSvg.replace(
                "<svg ",
                `<svg width="${sSize}" height="${sSize}" `,
              ),
            }}
          />
        );
      }

      const stickerFn = STICKER_SVGS_VIEWER[p.stickerId || "heart-divider"];
      if (!stickerFn) return <div key={nodeId} />;
      const svgStr = stickerFn(sColor);
      return (
        <div
          key={nodeId}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "4px 0",
            opacity: sOpacity,
          }}
          dangerouslySetInnerHTML={{
            __html: svgStr.replace(
              "<svg ",
              `<svg width="${sSize}" height="${sSize * 0.25}" `,
            ),
          }}
        />
      );
    }

    if (name === "CraftShape") {
      const renderShapeSvg = (
        shapeType: string,
        fill: string,
        stroke: string,
        strokeWidth: number,
      ): string => {
        switch (shapeType) {
          case "rectangle":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="${strokeWidth}" y="${strokeWidth}" width="${100 - strokeWidth * 2}" height="${100 - strokeWidth * 2}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
          case "circle":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="${48 - strokeWidth}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
          case "triangle":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,95 5,95" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/></svg>`;
          case "star":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/></svg>`;
          case "heart":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 88 C30 65 8 50 8 30 C8 15 18 8 28 8 C36 8 44 14 50 22 C56 14 64 8 72 8 C82 8 92 15 92 30 C92 50 70 65 50 88Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
          case "line":
            return `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="10" x2="195" y2="10" stroke="${stroke || fill}" stroke-width="${Math.max(strokeWidth, 2)}" stroke-linecap="round"/></svg>`;
          case "diamond":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,50 50,95 5,50" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/></svg>`;
          default:
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="96" height="96" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
        }
      };
      const svgStr = renderShapeSvg(
        p.shapeType || "rectangle",
        safeColor(p.fill, "#f9a8d4"),
        safeColor(p.stroke, "#ec4899"),
        p.strokeWidth ?? 2,
      );
      return (
        <div
          key={nodeId}
          style={{
            opacity: p.opacity ?? 1,
            transform: p.rotation ? `rotate(${p.rotation}deg)` : undefined,
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: svgStr }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      );
    }

    // Fallback: render children
    return <div key={nodeId}>{childIds.map((cid) => renderNode(cid))}</div>;
  }

  return <>{renderNode("ROOT")}</>;
}

/* ═══════ Main Component ═══════ */

interface CanvasInvitationProps {
  canvasJson: string;
  guestName?: string;
  projectId?: string;
  showWatermark?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCanvasJson(raw: string): any | null {
  try {
    const data = JSON.parse(raw);
    if (!data) return null;

    // Normalize editor format → viewer format
    // Editor uses: canvasWidth, canvasHeight, canvasBackground, top, left
    // Viewer uses: canvas.width, canvas.height, canvas.bg, x, y
    if (data.canvasWidth && !data.canvas) {
      data.canvas = {
        width: data.canvasWidth,
        height: data.canvasHeight || 5000,
        bg:
          data.canvasBackground ||
          "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
      };
    }

    if (Array.isArray(data.elements)) {
      data.elements = data.elements.map(
        (el: Record<string, unknown>): CanvasElementData => {
          const props = (el.props || {}) as Record<string, unknown>;
          const border = el.border as {
            width?: number;
            color?: string;
            style?: string;
          } | null;
          const shadow = el.shadow as {
            offsetX?: number;
            offsetY?: number;
            blur?: number;
            spread?: number;
            color?: string;
          } | null;
          const entrance = el.entrance as { type?: string } | null;
          const continuous = el.continuous as { type?: string } | null;

          // Build boxShadow string from shadow object
          let boxShadow: string | undefined;
          if (shadow) {
            boxShadow = `${shadow.offsetX || 0}px ${shadow.offsetY || 0}px ${shadow.blur || 0}px ${shadow.spread || 0}px ${shadow.color || "rgba(0,0,0,0.1)"}`;
          }

          return {
            id:
              (el.id as string) || `el-${Math.random().toString(36).slice(2)}`,
            type: (el.type as CanvasElementData["type"]) || "text",
            x: (el.x as number) ?? (el.left as number) ?? 0,
            y: (el.y as number) ?? (el.top as number) ?? 0,
            width: (el.width as number) || 200,
            height:
              typeof el.height === "number"
                ? el.height
                : el.type === "text"
                  ? 40
                  : 200,
            rotation: (el.rotation as number) || 0,
            opacity: (el.opacity as number) ?? 1,
            zIndex: (el.zIndex as number) || 0,
            locked: (el.locked as boolean) || false,
            animation: {
              entrance:
                entrance?.type && entrance.type !== "none"
                  ? (entrance.type as CanvasElementData["animation"] extends
                      | undefined
                      | { entrance?: infer E }
                      ? E
                      : never)
                  : undefined,
              loop:
                continuous?.type && continuous.type !== "none"
                  ? (continuous.type as CanvasElementData["animation"] extends
                      | undefined
                      | { loop?: infer L }
                      ? L
                      : never)
                  : undefined,
            } as ElementAnimationData,
            props: {
              ...props,
              borderRadius:
                props.borderRadius ?? (el.borderRadius as number) ?? undefined,
              borderWidth: props.borderWidth ?? border?.width ?? undefined,
              borderColor: props.borderColor ?? border?.color ?? undefined,
              borderStyle: props.borderStyle ?? border?.style ?? undefined,
              boxShadow: (props.boxShadow as string) ?? boxShadow ?? undefined,
            },
          } as CanvasElementData;
        },
      );
    }

    return data;
  } catch {
    return null;
  }
}

const CANVAS_DESIGN_WIDTH = 420;

/** Hook: responsive scale factor for screens narrower than the design width */
function useResponsiveScale(designWidth: number = CANVAS_DESIGN_WIDTH) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      setScale(w < designWidth ? w / designWidth : 1);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  return { containerRef, scale };
}

export function CanvasInvitation({
  canvasJson,
  guestName,
  projectId,
  showWatermark = true,
}: CanvasInvitationProps) {
  const data = useMemo(() => parseCanvasJson(canvasJson), [canvasJson]);
  const [isPlaying, setIsPlaying] = useState(false);
  const { containerRef: scaleRef, scale } =
    useResponsiveScale(CANVAS_DESIGN_WIDTH);
  const [copied, setCopied] = useState(false);
  const [rsvpName, setRsvpName] = useState(guestName || "");
  const [rsvpAttend, setRsvpAttend] = useState<"yes" | "no" | null>(null);
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpNote, setRsvpNote] = useState("");
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpSending, setRsvpSending] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Detect v2 craft.js format
  const isCraftV2 = data?.engine === "craftjs" && data?.craftState;

  const rawMusicUrl = isCraftV2
    ? data?.meta?.musicUrl || ""
    : data?.meta?.musicUrl || "";
  const musicUrl = rawMusicUrl.startsWith("https://") ? rawMusicUrl : "";
  const musicName = isCraftV2
    ? data?.meta?.musicName || ""
    : data?.meta?.musicName || "";
  const particleEffect = (data?.effects?.particleEffect ||
    "none") as ParticleType;
  const canvasBg =
    data?.canvas?.bg ||
    "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)";

  const toggleMusic = useCallback(() => {
    if (!musicUrl) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [musicUrl, isPlaying]);

  // Auto-play music on first interaction
  useEffect(() => {
    const handleFirst = () => {
      if (musicUrl && !audioRef.current) {
        audioRef.current = new Audio(musicUrl);
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      document.removeEventListener("click", handleFirst);
      document.removeEventListener("touchstart", handleFirst);
    };
    if (musicUrl) {
      document.addEventListener("click", handleFirst, { once: true });
      document.addEventListener("touchstart", handleFirst, { once: true });
    }
    return () => {
      document.removeEventListener("click", handleFirst);
      document.removeEventListener("touchstart", handleFirst);
    };
  }, [musicUrl]);

  const handleRSVP = useCallback(async () => {
    if (!rsvpName.trim() || !rsvpAttend) return;
    setRsvpSending(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          guestName: rsvpName.trim(),
          status: rsvpAttend === "yes" ? "confirmed" : "declined",
          guestCount: parseInt(rsvpGuests) || 1,
        }),
      });
      if (!res.ok) {
        const err = (await res
          .json()
          .catch(() => ({ error: "Lỗi gửi RSVP" }))) as { error?: string };
        alert(err.error || "Gửi RSVP thất bại, vui lòng thử lại.");
        setRsvpSending(false);
        return;
      }
      setRsvpSent(true);
      if (projectId) {
        fetch("/api/rsvp/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            guestName: rsvpName.trim(),
            attending: rsvpAttend === "yes",
          }),
        }).catch(() => {});
      }
    } catch {
      alert("Không thể gửi RSVP. Vui lòng thử lại.");
    }
    setRsvpSending(false);
  }, [rsvpName, rsvpAttend, rsvpGuests, projectId]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  if (!data) return null;

  /* ── V1 branch: old format with flat elements array ── */
  const elements: CanvasElementData[] | undefined = !isCraftV2
    ? data.elements
    : undefined;
  const canvas = data.canvas || { width: 390, height: 5000, bg: canvasBg };
  const sections = useMemo(
    () =>
      elements
        ? splitIntoSections(elements, canvas.height).map((s) => ({
            ...s,
            elements: [...s.elements].sort((a, b) => a.zIndex - b.zIndex),
          }))
        : [],
    [elements, canvas.height],
  );

  /* ── Page animation preset ── */
  const pageAnimation = (data?.effects?.pageAnimation ||
    "none") as PageAnimPreset;

  /* ── Curtain effect — read curtainEffect (new), fall back to introEffect (legacy) ── */
  const curtainEffect: string =
    data?.effects?.curtainEffect || data?.effects?.introEffect || "none";

  const handleMusicStart = () => {
    if (musicUrl && !audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div
      ref={scaleRef}
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        background: "#000",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Curtain / Intro Overlay */}
      {curtainEffect === "envelope" && (
        <EnvelopeIntro guestName={guestName} onOpen={handleMusicStart} />
      )}
      {curtainEffect === "curtain" && (
        <CurtainOverlay onDone={handleMusicStart} />
      )}
      {curtainEffect === "fadeReveal" && (
        <FadeRevealOverlay onDone={handleMusicStart} />
      )}

      {/* Global styles */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Lora:ital,wght@0,400;1,400&family=Inter:wght@400;600;700&display=swap');
                @keyframes particleFall {
                    0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
                    10% { opacity: 1; }
                    90% { opacity: 0.8; }
                    100% { opacity: 0; transform: translateY(100vh) rotate(360deg); }
                }
                @keyframes elPulse { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: .7; transform: scale(1.03) } }
                @keyframes elFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
                @keyframes elShake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-3px) } 75% { transform: translateX(3px) } }
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-30px) } to { opacity: 1; transform: translateY(0) } }
                @keyframes slideLeft { from { opacity: 0; transform: translateX(40px) } to { opacity: 1; transform: translateX(0) } }
                @keyframes slideRight { from { opacity: 0; transform: translateX(-40px) } to { opacity: 1; transform: translateX(0) } }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.7) } to { opacity: 1; transform: scale(1) } }
                @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3) } 50% { transform: scale(1.05) } 70% { transform: scale(0.95) } 100% { opacity: 1; transform: scale(1) } }
                @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .6 } }
                @keyframes spinVinyl { to { transform: rotate(360deg) } }
                @keyframes slideInUp { from { opacity: 0; transform: translateY(100%) } to { opacity: 1; transform: translateY(0) } }
                html { scroll-behavior: smooth; }
                body { overscroll-behavior-y: none; }
                .canvas-section-v1 { width: 100%; max-width: ${CANVAS_DESIGN_WIDTH}px; box-sizing: border-box; overflow: hidden; }
                button, a { min-height: 44px; min-width: 44px; }
                @media (max-width: ${CANVAS_DESIGN_WIDTH}px) {
                  .canvas-section-v1 { max-width: 100vw; }
                }
            `}</style>

      {/* Particle effects — fixed full-screen */}
      <ParticleOverlay effect={particleEffect} />

      {/* Guest name hero banner */}
      {guestName && (
        <ScrollSection pageAnimation={pageAnimation}>
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px 24px",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                margin: "0 0 4px",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Thiệp mời dành riêng cho
            </p>
            <p
              style={{
                fontSize: 28,
                fontFamily: "'Great Vibes', 'Dancing Script', cursive",
                color: "#fff",
                margin: 0,
                textShadow: "0 2px 16px rgba(255,107,157,0.5)",
              }}
            >
              {guestName}
            </p>
          </div>
        </ScrollSection>
      )}

      {/* ═══ Multi-section scrollable invitation ═══ */}
      {isCraftV2 ? (
        /* V2: craft.js flow-layout renderer — naturally responsive */
        <ScrollSection delay={0.15} pageAnimation={pageAnimation}>
          <div
            style={{
              width: "100%",
              maxWidth: CANVAS_DESIGN_WIDTH,
              margin: "0 auto",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
            }}
          >
            <CraftV2Renderer
              craftState={data.craftState}
              background={canvasBg}
            />
          </div>
        </ScrollSection>
      ) : (
        /* V1: old absolute positioning sections */
        sections.map((section, sIdx) => {
          const sectionHeight = section.yEnd - section.yStart;
          const scaledHeight = Math.max(sectionHeight, 200) * scale;
          return (
            <ScrollSection
              key={sIdx}
              delay={sIdx * 0.15}
              pageAnimation={pageAnimation}
            >
              <div
                className="canvas-section-v1"
                style={{
                  margin: "0 auto",
                  overflow: "hidden",
                  /* Collapse container height to match the scaled inner content */
                  height: scale < 1 ? scaledHeight : undefined,
                }}
              >
                <div
                  className="canvas-section-v1-inner"
                  style={{
                    position: "relative",
                    width: CANVAS_DESIGN_WIDTH,
                    minHeight: Math.max(sectionHeight, 200),
                    background: canvas.bg,
                    overflow: "hidden",
                    transformOrigin: "top left",
                    transform: scale < 1 ? `scale(${scale})` : undefined,
                    ...(sIdx === 0
                      ? {
                          borderRadius: "16px 16px 0 0",
                          paddingTop: guestName ? 0 : 24,
                        }
                      : {}),
                    ...(sIdx === sections.length - 1
                      ? { borderRadius: "0 0 16px 16px", paddingBottom: 24 }
                      : {}),
                  }}
                >
                  {section.elements.map((el, eIdx) => (
                    <RenderElement
                      key={el.id}
                      el={el}
                      sectionYStart={section.yStart}
                      idx={eIdx}
                    />
                  ))}
                </div>
              </div>
            </ScrollSection>
          );
        })
      )}

      {/* ═══ Share Bar ═══ */}
      <ScrollSection delay={0.2} pageAnimation={pageAnimation}>
        <div
          style={{
            maxWidth: CANVAS_DESIGN_WIDTH,
            margin: "32px auto 0",
            padding: "0 16px",
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigator.share?.({ url: window.location.href })}
            style={{
              padding: "12px 24px",
              borderRadius: 50,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              border: "none",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 16px rgba(255,107,157,.35)",
            }}
          >
            💌 Chia sẻ thiệp
          </button>
          <button
            onClick={copyLink}
            style={{
              padding: "12px 20px",
              borderRadius: 50,
              background: copied
                ? "rgba(16,185,129,0.15)"
                : "rgba(255,255,255,0.1)",
              border:
                "1px solid " +
                (copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.2)"),
              color: copied ? "#10b981" : "#e5e7eb",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: copied ? 600 : 400,
              backdropFilter: "blur(8px)",
            }}
          >
            {copied ? "✅ Đã copy!" : "🔗 Sao chép link"}
          </button>
        </div>
      </ScrollSection>

      {/* ═══ RSVP Section ═══ */}
      <ScrollSection delay={0.3} pageAnimation={pageAnimation}>
        <div
          data-rsvp-section
          style={{
            maxWidth: CANVAS_DESIGN_WIDTH,
            margin: "32px auto 0",
            padding: "0 16px 80px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(0,0,0,.12)",
              padding: 28,
              backdropFilter: "blur(12px)",
            }}
          >
            {rsvpSent ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ fontSize: 48, margin: "0 0 12px" }}>🎉</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#1f2937" }}>
                  Cảm ơn bạn!
                </p>
                <p
                  style={{ fontSize: 14, color: "#6b7280", margin: "8px 0 0" }}
                >
                  Chúng tôi rất mong được gặp{" "}
                  <strong>
                    {rsvpAttend === "yes" ? "bạn" : "nhưng hiểu vì bạn bận"}
                  </strong>{" "}
                  💕
                </p>
              </div>
            ) : (
              <>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1f2937",
                    margin: "0 0 4px",
                    textAlign: "center",
                  }}
                >
                  📝 Xác nhận tham dự
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    margin: "0 0 24px",
                    textAlign: "center",
                  }}
                >
                  Vui lòng xác nhận để chúng tôi chuẩn bị tốt nhất
                </p>

                {/* Name */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Họ và tên *
                  </label>
                  <input
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #e5e7eb",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#ff6b9d")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                {/* Attend */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Bạn có tham dự không? *
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {(["yes", "no"] as const).map((a) => (
                      <button
                        key={a}
                        onClick={() => setRsvpAttend(a)}
                        style={{
                          flex: 1,
                          padding: "14px 0",
                          borderRadius: 14,
                          fontSize: 14,
                          fontWeight: 600,
                          border:
                            "2px solid " +
                            (rsvpAttend === a
                              ? a === "yes"
                                ? "#ff6b9d"
                                : "#9ca3af"
                              : "#e5e7eb"),
                          background:
                            rsvpAttend === a
                              ? a === "yes"
                                ? "#fdf2f8"
                                : "#f9fafb"
                              : "#fff",
                          color:
                            rsvpAttend === a
                              ? a === "yes"
                                ? "#be185d"
                                : "#374151"
                              : "#6b7280",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {a === "yes" ? "💕 Sẽ tham dự" : "😔 Không thể đến"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest count */}
                {rsvpAttend === "yes" && (
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Số người tham dự
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1.5px solid #e5e7eb",
                        fontSize: 14,
                      }}
                    >
                      {["1", "2", "3", "4", "5+"].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Note */}
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Lời nhắn (tuỳ chọn)
                  </label>
                  <textarea
                    value={rsvpNote}
                    onChange={(e) => setRsvpNote(e.target.value)}
                    placeholder="Gửi lời chúc mừng đến cặp đôi..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #e5e7eb",
                      fontSize: 14,
                      resize: "vertical",
                      outline: "none",
                      fontFamily: "'Inter', sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={handleRSVP}
                  disabled={rsvpSending || !rsvpName.trim() || !rsvpAttend}
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    borderRadius: 14,
                    background:
                      !rsvpName.trim() || !rsvpAttend
                        ? "#e5e7eb"
                        : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    border: "none",
                    color: !rsvpName.trim() || !rsvpAttend ? "#9ca3af" : "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor:
                      !rsvpName.trim() || !rsvpAttend
                        ? "not-allowed"
                        : "pointer",
                    boxShadow:
                      !rsvpName.trim() || !rsvpAttend
                        ? "none"
                        : "0 4px 16px rgba(255,107,157,.35)",
                    transition: "all 0.2s",
                  }}
                >
                  {rsvpSending ? "⏳ Đang gửi..." : "💌 Xác nhận tham dự"}
                </button>
              </>
            )}
          </div>
        </div>
      </ScrollSection>

      {/* ═══ Watermark ═══ */}
      {showWatermark && (
        <a
          href="https://7app.online?ref=watermark"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            textAlign: "center",
            padding: "16px 0 32px",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            textDecoration: "none",
            letterSpacing: 0.5,
          }}
        >
          Made with LoveStory ❤️
        </a>
      )}

      {/* ═══ Sticky Music Player (bottom-right) ═══ */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          title={musicName}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 999,
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
            color: "#fff",
            fontSize: 22,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(255,107,157,.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: isPlaying ? "spinVinyl 3s linear infinite" : undefined,
          }}
        >
          {isPlaying ? "🎵" : "▶️"}
        </button>
      )}

      {/* ═══ Sticky bottom RSVP CTA ═══ */}
      {!rsvpSent && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 990,
            padding: "12px 16px",
            paddingBottom: "max(12px, env(safe-area-inset-bottom))",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 30%)",
            display: "flex",
            justifyContent: "center",
            animation: "slideInUp 0.5s ease-out 1.5s both",
          }}
        >
          <button
            onClick={() => {
              const rsvpEl = document.querySelector("[data-rsvp-section]");
              rsvpEl?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(255,107,157,.45)",
              letterSpacing: 0.3,
            }}
          >
            💌 Xác nhận tham dự
          </button>
        </div>
      )}
    </div>
  );
}
