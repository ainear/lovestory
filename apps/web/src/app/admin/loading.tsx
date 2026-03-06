export default function AdminLoading() {
    return (
        <div>
            <div style={{ width: 220, height: 26, borderRadius: 8, background: "#334155", marginBottom: 24, animation: "pulse 1.5s infinite" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} style={{ background: "#1e293b", borderRadius: 16, border: "1px solid #334155", padding: 24 }}>
                        <div style={{ width: 80, height: 12, borderRadius: 6, background: "#334155", marginBottom: 12, animation: "pulse 1.5s infinite" }} />
                        <div style={{ width: 60, height: 28, borderRadius: 8, background: "#475569", animation: "pulse 1.5s infinite" }} />
                    </div>
                ))}
            </div>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
        </div>
    );
}
