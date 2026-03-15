"use client";
import { useEffect, useRef } from "react";
import { useEditorContext } from "./useEditorState";

export function useKeyboard() {
  const { state, dispatch } = useEditorContext();
  const nudgeSnapshotRef = useRef(false);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      const el = state.elements.find((el) => el.id === state.selectedId);

      // Delete selected element
      if ((e.key === "Delete" || e.key === "Backspace") && state.selectedId) {
        e.preventDefault();
        dispatch({ type: "SNAPSHOT" });
        dispatch({ type: "DELETE_ELEMENT", id: state.selectedId });
        return;
      }

      // Undo: Ctrl+Z
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.key === "z" && e.shiftKey) || e.key === "y") &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault();
        dispatch({ type: "REDO" });
        return;
      }

      // Arrow key nudge (1px, Shift = 10px) — snapshot only once per burst
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) &&
        el &&
        !el.locked
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;

        if (!nudgeSnapshotRef.current) {
          dispatch({ type: "SNAPSHOT" });
          nudgeSnapshotRef.current = true;
        }
        // Reset snapshot flag after 500ms of no arrow keys
        if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
        nudgeTimerRef.current = setTimeout(() => {
          nudgeSnapshotRef.current = false;
        }, 500);

        const patch: Record<string, number> = {};
        if (e.key === "ArrowUp") patch.top = el.top - step;
        if (e.key === "ArrowDown") patch.top = el.top + step;
        if (e.key === "ArrowLeft") patch.left = el.left - step;
        if (e.key === "ArrowRight") patch.left = el.left + step;
        dispatch({ type: "UPDATE_ELEMENT", id: el.id, patch });
        return;
      }

      // Escape: deselect
      if (e.key === "Escape") {
        dispatch({ type: "SELECT", id: null });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedId, state.elements, dispatch]);
}
