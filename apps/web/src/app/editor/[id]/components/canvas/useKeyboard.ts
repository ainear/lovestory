"use client";
import { useEffect } from "react";
import { useEditorContext } from "./useEditorState";

export function useKeyboard() {
  const { state, dispatch } = useEditorContext();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

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

      // Redo: Ctrl+Shift+Z
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "REDO" });
        return;
      }

      // Arrow key nudge (1px, Shift = 10px)
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && el && !el.locked) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        dispatch({ type: "SNAPSHOT" });
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
