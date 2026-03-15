"use client";
import { useCallback, useRef } from "react";
import { useEditorContext } from "./useEditorState";

export function useDrag(elementId: string) {
  const { state, dispatch } = useEditorContext();
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

      dispatch({
        type: "UPDATE_ELEMENT",
        id: elementId,
        patch: {
          top: dragRef.current.origTop + dy,
          left: dragRef.current.origLeft + dx,
        },
      });
    },
    [elementId, state.zoom, dispatch],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
