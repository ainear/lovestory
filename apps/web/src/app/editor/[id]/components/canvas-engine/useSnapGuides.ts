"use client";
import { useCallback } from "react";
import type { CanvasElement, GuideLine } from "./types";

const SNAP_THRESHOLD = 5;

export type { GuideLine };

export interface SnapResult {
  top: number;
  left: number;
  guides: GuideLine[];
}

/** Resolve element height to a number (treat "auto" as 0 for snap purposes) */
function resolveHeight(el: CanvasElement): number {
  return el.height === "auto" ? 0 : el.height;
}

/**
 * Hook that calculates snap points and returns adjusted position + active guide lines.
 * Snap targets: canvas center, other elements' centers and edges.
 */
export function useSnapGuides(
  elements: CanvasElement[],
  canvasWidth: number,
  canvasHeight: number,
) {
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  const calcSnap = useCallback(
    (
      draggingId: string,
      proposedTop: number,
      proposedLeft: number,
    ): SnapResult => {
      const dragging = elements.find((el) => el.id === draggingId);
      if (!dragging) {
        return { top: proposedTop, left: proposedLeft, guides: [] };
      }

      const dragW = dragging.width;
      const dragH = resolveHeight(dragging);

      // Dragged element edges and center at proposed position
      const dragCenterX = proposedLeft + dragW / 2;
      const dragCenterY = proposedTop + dragH / 2;
      const dragRight = proposedLeft + dragW;
      const dragBottom = proposedTop + dragH;

      // Collect vertical snap targets (x positions)
      const verticalTargets: number[] = [canvasCenterX];
      // Collect horizontal snap targets (y positions)
      const horizontalTargets: number[] = [canvasCenterY];

      for (const el of elements) {
        if (el.id === draggingId || !el.visible) continue;
        const h = resolveHeight(el);
        // Other element centers
        verticalTargets.push(el.left + el.width / 2);
        horizontalTargets.push(el.top + h / 2);
        // Other element edges
        verticalTargets.push(el.left);
        verticalTargets.push(el.left + el.width);
        horizontalTargets.push(el.top);
        horizontalTargets.push(el.top + h);
      }

      const guides: GuideLine[] = [];
      let snappedLeft = proposedLeft;
      let snappedTop = proposedTop;

      // --- Snap on X axis (vertical guide lines) ---
      // Check dragged element's left edge, center, and right edge
      const dragXPoints = [
        { value: proposedLeft, offset: 0 },
        { value: dragCenterX, offset: dragW / 2 },
        { value: dragRight, offset: dragW },
      ];

      let bestXDist = SNAP_THRESHOLD + 1;
      let bestXGuide: number | null = null;
      let bestXOffset = 0;

      for (const point of dragXPoints) {
        for (const target of verticalTargets) {
          const dist = Math.abs(point.value - target);
          if (dist < bestXDist) {
            bestXDist = dist;
            bestXGuide = target;
            bestXOffset = point.offset;
          }
        }
      }

      if (bestXGuide !== null && bestXDist <= SNAP_THRESHOLD) {
        snappedLeft = bestXGuide - bestXOffset;
        guides.push({ orientation: "vertical", position: bestXGuide });
      }

      // --- Snap on Y axis (horizontal guide lines) ---
      const dragYPoints = [
        { value: proposedTop, offset: 0 },
        { value: dragCenterY, offset: dragH / 2 },
        { value: dragBottom, offset: dragH },
      ];

      let bestYDist = SNAP_THRESHOLD + 1;
      let bestYGuide: number | null = null;
      let bestYOffset = 0;

      for (const point of dragYPoints) {
        for (const target of horizontalTargets) {
          const dist = Math.abs(point.value - target);
          if (dist < bestYDist) {
            bestYDist = dist;
            bestYGuide = target;
            bestYOffset = point.offset;
          }
        }
      }

      if (bestYGuide !== null && bestYDist <= SNAP_THRESHOLD) {
        snappedTop = bestYGuide - bestYOffset;
        guides.push({ orientation: "horizontal", position: bestYGuide });
      }

      return { top: snappedTop, left: snappedLeft, guides };
    },
    [elements, canvasCenterX, canvasCenterY],
  );

  return { calcSnap };
}
