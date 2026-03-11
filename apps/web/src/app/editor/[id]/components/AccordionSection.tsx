"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionSectionProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
    icon?: string;
}

export function AccordionSection({ title, defaultOpen = false, children, icon }: AccordionSectionProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div style={{ borderBottom: "1px solid #f3f4f6" }}>
            <button
                onClick={() => setOpen(v => !v)}
                style={{
                    width: "100%", padding: "10px 16px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#374151", fontSize: 12, fontWeight: 700,
                    letterSpacing: 0.5,
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
                    {title}
                </span>
                <ChevronDown
                    size={14}
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        color: "#9ca3af",
                    }}
                />
            </button>
            {open && (
                <div style={{ padding: "0 16px 14px" }}>
                    {children}
                </div>
            )}
        </div>
    );
}
