"use client";

import React, { useState } from "react";

interface AccordionSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

/* ── CineLove-style Accordion Section component ── */
export function AccordionSection({
  title,
  icon,
  children,
}: AccordionSectionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#9ca3af",
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▶
        </span>
        <span>{icon}</span>
        <span>{title}</span>
      </button>
      {open && <div style={{ padding: "0 0 12px 20px" }}>{children}</div>}
    </div>
  );
}
