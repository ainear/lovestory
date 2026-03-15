"use client";
import { useEditorContext } from "./useEditorState";
import type { CanvasElement } from "./types";

/** Floating toolbar above selected element — CineLove style */
export function ElementToolbar() {
  const { state, dispatch } = useEditorContext();

  const el = state.elements.find((e) => e.id === state.selectedId);
  if (!el) return null;

  const elHeight = el.height === "auto" ? 40 : el.height;

  const handleClone = () => {
    dispatch({ type: "SNAPSHOT" });
    const cloned: CanvasElement = {
      ...el,
      id: `${el.id}_copy_${Date.now()}`,
      top: el.top + 20,
      left: el.left + 20,
      zIndex: Math.max(...state.elements.map((e) => e.zIndex), 0) + 1,
    };
    dispatch({ type: "ADD_ELEMENT", element: cloned });
  };

  const handleDelete = () => {
    dispatch({ type: "SNAPSHOT" });
    dispatch({ type: "DELETE_ELEMENT", id: el.id });
  };

  const handleLock = () => {
    dispatch({
      type: "UPDATE_ELEMENT",
      id: el.id,
      patch: { locked: !el.locked },
    });
  };

  const handleMoveUp = () => {
    dispatch({ type: "SNAPSHOT" });
    dispatch({ type: "REORDER", id: el.id, direction: "up" });
  };

  const handleMoveDown = () => {
    dispatch({ type: "SNAPSHOT" });
    dispatch({ type: "REORDER", id: el.id, direction: "down" });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: el.top - 44,
        left: el.left,
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "#1f2937",
        borderRadius: 8,
        padding: "4px 6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      <ToolbarBtn title="Nhân bản" onClick={handleClone}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn title="Lên một lớp" onClick={handleMoveUp}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn title="Xuống một lớp" onClick={handleMoveDown}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn
        title={el.locked ? "Mở khóa" : "Khóa"}
        onClick={handleLock}
        active={el.locked}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {el.locked ? (
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
          ) : (
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </>
          )}
        </svg>
      </ToolbarBtn>
      <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.15)", margin: "0 2px" }} />
      <ToolbarBtn title="Xóa" onClick={handleDelete} danger>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </ToolbarBtn>
    </div>
  );
}

function ToolbarBtn({
  children,
  onClick,
  title,
  active,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        border: "none",
        borderRadius: 6,
        background: active ? "rgba(59,130,246,0.3)" : "transparent",
        color: danger ? "#f87171" : "#e5e7eb",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.background = danger
          ? "rgba(248,113,113,0.15)"
          : "rgba(255,255,255,0.1)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.background = active
          ? "rgba(59,130,246,0.3)"
          : "transparent";
      }}
    >
      {children}
    </button>
  );
}
