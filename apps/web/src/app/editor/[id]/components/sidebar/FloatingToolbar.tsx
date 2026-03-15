"use client";

import React, { useState } from "react";
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { floatBtnStyle } from "../editor-constants";

interface SelectedElement {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  isDeletable: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
}

interface FloatingToolbarProps {
  selected: SelectedElement;
  triggerAutosave: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
}

export function FloatingToolbar({
  selected,
  triggerAutosave,
  query,
  actions,
}: FloatingToolbarProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div
      style={{
        position: "sticky",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "#1f2937",
        borderRadius: 10,
        padding: "4px 6px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {/* Element name badge */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#9ca3af",
          padding: "0 6px",
          borderRight: "1px solid #374151",
          marginRight: 2,
          whiteSpace: "nowrap",
        }}
      >
        {selected.name}
      </span>

      {/* Duplicate */}
      <button
        title="Nhân đôi (Ctrl+D)"
        onClick={() => {
          try {
            const freshSerialized = query.serialize();
            const freshNodes = JSON.parse(freshSerialized);
            const currentNode = freshNodes[selected.id];
            if (!currentNode) return;
            const parentId = currentNode.parent;
            if (!parentId) return;
            const tree = query.node(selected.id).toNodeTree();
            actions.addNodeTree(tree, parentId);
            triggerAutosave();
          } catch {
            /* ignore */
          }
        }}
        style={floatBtnStyle}
      >
        <Copy size={13} />
      </button>

      {/* Move Up */}
      <button
        title="Lên trên"
        onClick={() => {
          try {
            const serialized = query.serialize();
            const nodes = JSON.parse(serialized);
            const node = nodes[selected.id];
            if (!node || !node.parent) return;
            const parent = nodes[node.parent];
            if (!parent || !parent.nodes) return;
            const idx = parent.nodes.indexOf(selected.id);
            if (idx < parent.nodes.length - 1) {
              actions.move(selected.id, node.parent, idx + 2);
            }
          } catch {
            /* ignore */
          }
        }}
        style={floatBtnStyle}
      >
        <ArrowUp size={13} />
      </button>

      {/* Move Down */}
      <button
        title="Xuống dưới"
        onClick={() => {
          try {
            const serialized = query.serialize();
            const nodes = JSON.parse(serialized);
            const node = nodes[selected.id];
            if (!node || !node.parent) return;
            const parent = nodes[node.parent];
            if (!parent || !parent.nodes) return;
            const idx = parent.nodes.indexOf(selected.id);
            if (idx > 0) {
              actions.move(selected.id, node.parent, idx - 1);
            }
          } catch {
            /* ignore */
          }
        }}
        style={floatBtnStyle}
      >
        <ArrowDown size={13} />
      </button>

      {/* Divider */}
      <span
        style={{
          width: 1,
          height: 18,
          background: "#374151",
          margin: "0 2px",
        }}
      />

      {/* Delete */}
      {selected.isDeletable && (
        <button
          title="Xóa (Delete)"
          onClick={() => {
            actions.delete(selected.id);
            triggerAutosave();
          }}
          style={{ ...floatBtnStyle, color: "#f87171" }}
        >
          <Trash2 size={13} />
        </button>
      )}

      {/* More options */}
      <div style={{ position: "relative" }}>
        <button
          title="Thêm tùy chọn"
          onClick={() => setShowMoreMenu((p) => !p)}
          style={floatBtnStyle}
        >
          <span
            style={{
              fontSize: 13,
              color: "#e5e7eb",
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            •••
          </span>
        </button>
        {showMoreMenu && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              background: "#1f2937",
              borderRadius: 8,
              padding: "4px 0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              zIndex: 100,
              minWidth: 160,
              border: "1px solid #374151",
            }}
          >
            <MoreMenuItem
              label="🔒 Khóa"
              onClick={() => setShowMoreMenu(false)}
            />
            <MoreMenuItem
              label="🎨 Sao chép kiểu"
              onClick={() => setShowMoreMenu(false)}
            />
            <MoreMenuItem
              label="⬆️ Đưa lên trước"
              onClick={() => {
                try {
                  const serialized = query.serialize();
                  const nodes = JSON.parse(serialized);
                  const node = nodes[selected.id];
                  if (!node || !node.parent) return;
                  const parent = nodes[node.parent];
                  if (!parent || !parent.nodes) return;
                  actions.move(
                    selected.id,
                    node.parent,
                    parent.nodes.length,
                  );
                } catch {
                  /* ignore */
                }
                setShowMoreMenu(false);
              }}
            />
            <MoreMenuItem
              label="⬇️ Đưa ra sau"
              onClick={() => {
                try {
                  const serialized = query.serialize();
                  const nodes = JSON.parse(serialized);
                  const node = nodes[selected.id];
                  if (!node || !node.parent) return;
                  actions.move(selected.id, node.parent, 0);
                } catch {
                  /* ignore */
                }
                setShowMoreMenu(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MoreMenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "7px 14px",
        background: "none",
        border: "none",
        color: "#e5e7eb",
        fontSize: 12,
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {label}
    </button>
  );
}
