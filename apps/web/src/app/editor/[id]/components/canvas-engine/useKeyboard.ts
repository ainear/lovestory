"use client";
import { useEffect, useRef } from "react";
import { useEditorContext } from "./useEditorState";

export function useKeyboard() {
  const { state, dispatch } = useEditorContext();
  const stateRef = useRef(state);
  const nudgeSnapshotRef = useRef(false);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clipboardRef = useRef<string | null>(null); // stores copied element id

  // Keep stateRef in sync without re-registering listener
  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      const { elements, selectedId } = stateRef.current;
      const el = elements.find((el) => el.id === selectedId);

      // Delete selected element
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        dispatch({ type: "SNAPSHOT" });
        dispatch({ type: "DELETE_ELEMENT", id: selectedId });
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

      // Ctrl+D — Duplicate element
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && el) {
        e.preventDefault();
        dispatch({ type: "SNAPSHOT" });
        dispatch({
          type: "ADD_ELEMENT",
          element: {
            ...el,
            id: `${el.id}_copy_${Date.now()}`,
            top: el.top + 20,
            left: el.left + 20,
          },
        });
        return;
      }

      // Ctrl+C — Copy element to clipboard ref
      if (e.key === "c" && (e.ctrlKey || e.metaKey) && el) {
        clipboardRef.current = el.id;
        return;
      }

      // Ctrl+V — Paste copied element
      if (e.key === "v" && (e.ctrlKey || e.metaKey) && clipboardRef.current) {
        const src = elements.find((el) => el.id === clipboardRef.current);
        if (src) {
          e.preventDefault();
          dispatch({ type: "SNAPSHOT" });
          dispatch({
            type: "ADD_ELEMENT",
            element: {
              ...src,
              id: `${src.id}_paste_${Date.now()}`,
              top: src.top + 20,
              left: src.left + 20,
            },
          });
        }
        return;
      }

      // Ctrl+] — Bring forward (increase zIndex)
      if (e.key === "]" && (e.ctrlKey || e.metaKey) && el) {
        e.preventDefault();
        dispatch({ type: "SNAPSHOT" });
        dispatch({ type: "UPDATE_ELEMENT", id: el.id, patch: { zIndex: (el.zIndex ?? 0) + 1 } });
        return;
      }

      // Ctrl+[ — Send backward (decrease zIndex)
      if (e.key === "[" && (e.ctrlKey || e.metaKey) && el) {
        e.preventDefault();
        dispatch({ type: "SNAPSHOT" });
        dispatch({ type: "UPDATE_ELEMENT", id: el.id, patch: { zIndex: Math.max(0, (el.zIndex ?? 0) - 1) } });
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
  }, [dispatch]);
}
