export default function DashboardLoading() {
    return (
        <div style={{ padding: "28px 32px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* Header skeleton */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <div style={{ width: 200, height: 24, borderRadius: 8, background: "#e5e7eb", marginBottom: 8, animation: "pulse 1.5s infinite" }} />
                    <div style={{ width: 120, height: 14, borderRadius: 6, background: "#f3f4f6", animation: "pulse 1.5s infinite" }} />
                </div>
                <div style={{ width: 120, height: 40, borderRadius: 12, background: "#e5e7eb", animation: "pulse 1.5s infinite" }} />
            </div>

            {/* Stats skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ background: "var(--dash-card)", borderRadius: 16, border: "1px solid var(--dash-border)", padding: 24 }}>
                        <div style={{ width: 80, height: 12, borderRadius: 6, background: "#f3f4f6", marginBottom: 12, animation: "pulse 1.5s infinite" }} />
                        <div style={{ width: 60, height: 28, borderRadius: 8, background: "#e5e7eb", animation: "pulse 1.5s infinite" }} />
                    </div>
                ))}
            </div>

            {/* Cards skeleton */}
            {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: "var(--dash-card)", borderRadius: 16, border: "1px solid var(--dash-border)", padding: 24, marginBottom: 12, display: "flex", gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 14, background: "#f3f4f6", flexShrink: 0, animation: "pulse 1.5s infinite" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ width: "60%", height: 16, borderRadius: 6, background: "#e5e7eb", marginBottom: 8, animation: "pulse 1.5s infinite" }} />
                        <div style={{ width: "40%", height: 12, borderRadius: 6, background: "#f3f4f6", animation: "pulse 1.5s infinite" }} />
                    </div>
                </div>
            ))}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
