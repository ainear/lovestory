"use client";

import { useState } from "react";

export function PlanChanger({ userId, currentPlan }: { userId: string; currentPlan: string }) {
    const [plan, setPlan] = useState(currentPlan);
    const [loading, setLoading] = useState(false);

    async function changePlan(newPlan: string) {
        if (newPlan === plan) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, plan: newPlan }),
            });
            if (res.ok) {
                setPlan(newPlan);
            }
        } finally {
            setLoading(false);
        }
    }

    const plans = [
        { value: "free", label: "🆓", color: "#64748b" },
        { value: "basic", label: "⭐", color: "#8b5cf6" },
        { value: "premium", label: "👑", color: "#f59e0b" },
    ];

    return (
        <div style={{ display: "flex", gap: 4 }}>
            {plans.map((p) => (
                <button
                    key={p.value}
                    onClick={() => changePlan(p.value)}
                    disabled={loading}
                    title={p.value}
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        border: plan === p.value ? `2px solid ${p.color}` : "1px solid #334155",
                        background: plan === p.value ? "rgba(255,255,255,0.1)" : "transparent",
                        cursor: loading ? "wait" : "pointer",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: loading ? 0.5 : 1,
                    }}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
}
