import type { CanvasElement, TextProps, ImageProps, WidgetProps } from "./types";

interface TemplateElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  animation: { entrance: string; loop: string };
  props: Record<string, unknown>;
}

export function convertTemplateToCanvas(elements: TemplateElement[]): CanvasElement[] {
  return elements.map((te) => {
    const base: Omit<CanvasElement, "props"> = {
      id: te.id,
      type: mapType(te.type),
      top: te.y,
      left: te.x,
      width: te.width,
      height: te.type === "text" ? ("auto" as const) : te.height,
      rotation: te.rotation,
      scaleX: 1,
      scaleY: 1,
      zIndex: te.zIndex,
      locked: te.locked,
      visible: true,
      opacity: te.opacity,
      borderRadius: (te.props.borderRadius as number) || 0,
      border: { width: 0, color: "transparent", style: "solid" },
      shadow: null,
      entrance:
        te.animation.entrance !== "none"
          ? { type: te.animation.entrance, duration: 600, delay: 0 }
          : null,
      continuous:
        te.animation.loop !== "none"
          ? { type: te.animation.loop, duration: 2000 }
          : null,
    };

    let props: CanvasElement["props"];

    if (te.type === "text") {
      props = {
        text: (te.props.text as string) || "",
        fontFamily: (te.props.fontFamily as string) || "'Playfair Display', serif",
        fontSize: (te.props.fontSize as number) || 16,
        fontWeight: (te.props.fontWeight as string) || "normal",
        fontStyle: (te.props.fontStyle as string) || "normal",
        color: (te.props.color as string) || "#1f2937",
        backgroundColor: "transparent",
        textAlign: ((te.props.textAlign as string) || "center") as TextProps["textAlign"],
        lineHeight: (te.props.lineHeight as number) || 1.4,
        letterSpacing: (te.props.letterSpacing as number) || 0,
      } satisfies TextProps;
    } else if (te.type === "image") {
      props = {
        src: (te.props.src as string) || "/placeholder-couple.png",
        objectFit: ((te.props.objectFit as string) || "cover") as ImageProps["objectFit"],
        crop: null,
      } satisfies ImageProps;
    } else {
      // Widget types (countdown, calendar, map, etc.)
      props = {
        widgetType: te.type as WidgetProps["widgetType"],
        config: te.props,
      } satisfies WidgetProps;
    }

    return { ...base, props } as CanvasElement;
  });
}

function mapType(type: string): CanvasElement["type"] {
  if (type === "text") return "text";
  if (type === "image") return "image";
  if (type === "shape") return "shape";
  if (type === "sticker") return "sticker";
  return "widget";
}
