"use client";

import { useState, useEffect } from "react";

export function ThemeToggle() {
    const [dark, setDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme");
        const isDark = saved === "dark";
        setDark(isDark);
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }, []);

    function toggle() {
        const next = !dark;
        setDark(next);
        document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
        localStorage.setItem("theme", next ? "dark" : "light");
    }

    if (!mounted) return null;

    return (
        <button
            onClick={toggle}
            title={dark ? "Chuyển sang sáng" : "Chuyển sang tối"}
            style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "1px solid var(--dash-border)",
                background: "var(--dash-card)",
                color: "var(--dash-text)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                transition: "all 0.2s",
                flexShrink: 0,
            }}
        >
            {dark ? "☀️" : "🌙"}
        </button>
    );
}
