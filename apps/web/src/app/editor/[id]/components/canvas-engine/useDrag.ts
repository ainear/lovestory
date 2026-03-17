"use client";
import { useCallback, useRef } from "react";
import { useEditorContext } from "./useEditorState";
import { useSnapGuides } from "./useSnapGuides";

export function useDrag(elementId: string) {
  const { state, dispatch } = useEditorContext();
  const { calcSnap } = useSnapGuides(
    state.elements,
    state.canvasWidth,
    state.canvasHeight,
  );
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origTop: number;
    origLeft: number;
    snapshotTaken: boolean;
    // For group-move: store original positions of all multi-selected elements
    groupOrigins: Array<{ id: string; top: number; left: number }>;
  } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = state.elements.find((el) => el.id === elementId);
      if (!el || el.locked) return;

      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      const isMultiKey = e.ctrlKey || e.metaKey;

      if (isMultiKey) {
        // ── Ctrl/Cmd+click → toggle this element in/out of multi-selection ──
        const current = state.multiSelectIds ?? [];
        const already = current.includes(elementId);
        const next = already
          ? current.filter((id) => id !== elementId)
          : [...current, elementId];

        if (next.length === 0) {
          dispatch({ type: "SELECT", id: null });
        } else {
          dispatch({ type: "MULTI_SELECT", ids: next });
        }
        // Don't start drag on Ctrl+click (just toggle)
        return;
      }

      // ── Normal click → single select ──
      // If clicking an already-multiselected element, keep the group for group-move
      const isInGroup = state.multiSelectIds?.includes(elementId);
      if (!isInGroup) {
        dispatch({ type: "SELECT", id: elementId });
      }

      // Record origins for group-move
      const idsToMove = isInGroup
        ? (state.multiSelectIds ?? [])
        : [elementId];

      const groupOrigins = idsToMove
        .map((id) => {
          const e = state.elements.find((el) => el.id === id);
          return e ? { id, top: e.top, left: e.left } : null;
        })
        .filter(Boolean) as Array<{ id: string; top: number; left: number }>;

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origTop: el.top,
        origLeft: el.left,
        snapshotTaken: false,
        groupOrigins,
      };
    },
    [elementId, state.elements, state.multiSelectIds, dispatch],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;

      // Defer snapshot until first actual move
      if (!dragRef.current.snapshotTaken) {
        dispatch({ type: "SNAPSHOT" });
        dragRef.current.snapshotTaken = true;
      }

      const zoom = state.zoom;
      const dx = (e.clientX - dragRef.current.startX) / zoom;
      const dy = (e.clientY - dragRef.current.startY) / zoom;

      if (dragRef.current.groupOrigins.length > 1) {
        // ── Group move: shift all selected elements by same delta ──
        for (const orig of dragRef.current.groupOrigins) {
          dispatch({
            type: "UPDATE_ELEMENT",
            id: orig.id,
            patch: {
              top: orig.top + dy,
              left: orig.left + dx,
            },
          });
        }
        dispatch({ type: "SET_GUIDES", guides: [] });
      } else {
        // ── Single element move with snapping ──
        const rawTop = dragRef.current.origTop + dy;
        const rawLeft = dragRef.current.origLeft + dx;
        const { top, left, guides } = calcSnap(elementId, rawTop, rawLeft);

        dispatch({
          type: "UPDATE_ELEMENT",
          id: elementId,
          patch: { top, left },
        });
        dispatch({ type: "SET_GUIDES", guides });
      }
    },
    [elementId, state.zoom, dispatch, calcSnap],
  );

  const onPointerUp = useCallback(() => {
    if (dragRef.current) {
      dispatch({ type: "SET_GUIDES", guides: [] });
    }
    dragRef.current = null;
  }, [dispatch]);

  return { onPointerDown, onPointerMove, onPointerUp };
}
