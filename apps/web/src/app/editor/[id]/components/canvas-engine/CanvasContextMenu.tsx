"use client";
import { useState, useEffect } from "react";
import { useEditorContext } from "./useEditorState";

interface MenuPosition {
  x: number;
  y: number;
  elementId: string;
}

export function CanvasContextMenu() {
  const { state, dispatch } = useEditorContext();
  const [menu, setMenu] = useState<MenuPosition | null>(null);

  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const elDiv = target.closest("[data-element-id]") as HTMLElement;
      if (!elDiv) {
        setMenu(null);
        return;
      }
      e.preventDefault();
      const id = elDiv.getAttribute("data-element-id")!;
      dispatch({ type: "SELECT", id });
      setMenu({ x: e.clientX, y: e.clientY, elementId: id });
    }

    function handleClick() {
      setMenu(null);
    }

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [dispatch]);

  if (!menu) return null;

  const el = state.elements.find((e) => e.id === menu.elementId);
  if (!el) return null;

  const menuItems = [
    {
      label: "Đưa lên trên cùng",
      action: () => dispatch({ type: "REORDER", id: el.id, direction: "front" as const }),
    },
    {
      label: "Đưa xuống dưới cùng",
      action: () => dispatch({ type: "REORDER", id: el.id, direction: "back" as const }),
    },
    {
      label: "Đưa lên một lớp",
      action: () => dispatch({ type: "REORDER", id: el.id, direction: "up" as const }),
    },
    {
      label: "Đưa xuống một lớp",
      action: () => dispatch({ type: "REORDER", id: el.id, direction: "down" as const }),
    },
    {
      label: el.locked ? "Mở khóa" : "Khóa vị trí",
      action: () =>
        dispatch({ type: "UPDATE_ELEMENT", id: el.id, patch: { locked: !el.locked } }),
    },
    {
      label: "Xóa",
      action: () => {
        dispatch({ type: "SNAPSHOT" });
        dispatch({ type: "DELETE_ELEMENT", id: el.id });
      },
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: menu.y,
        left: menu.x,
        background: "#1f2937",
        borderRadius: 8,
        padding: "4px 0",
        minWidth: 200,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        zIndex: 999999,
      }}
    >
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={(e) => {
            e.stopPropagation();
            item.action();
            setMenu(null);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "8px 16px",
            border: "none",
            background: "transparent",
            color: "#e5e7eb",
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <span>{item.label}</span>
        </button>
      ))}
      <div style={{ padding: "4px 16px", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
        Lớp hiện tại: {el.zIndex}
      </div>
    </div>
  );
}
