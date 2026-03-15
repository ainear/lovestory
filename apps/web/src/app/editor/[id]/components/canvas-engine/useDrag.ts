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
  } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = state.elements.find((el) => el.id === elementId);
      if (!el || el.locked) return;

      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      dispatch({ type: "SELECT", id: elementId });

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origTop: el.top,
        origLeft: el.left,
        snapshotTaken: false,
      };
    },
    [elementId, state.elements, dispatch],
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

      const rawTop = dragRef.current.origTop + dy;
      const rawLeft = dragRef.current.origLeft + dx;

      const { top, left, guides } = calcSnap(elementId, rawTop, rawLeft);

      dispatch({
        type: "UPDATE_ELEMENT",
        id: elementId,
        patch: { top, left },
      });

      dispatch({ type: "SET_GUIDES", guides });
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
