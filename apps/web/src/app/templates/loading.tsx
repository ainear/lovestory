/** Templates page skeleton loader */
export default function TemplatesLoading() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header skeleton */}
      <div style={{
        width: 300, height: 36, borderRadius: 8,
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        marginBottom: 32,
      }} />
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {/* Grid skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 20 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{
              height: 320,
              background: "linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              animationDelay: `${i * 0.1}s`,
            }} />
            <div style={{ padding: "12px 16px" }}>
              <div style={{ height: 16, width: "70%", borderRadius: 4, background: "#f0f0f0", marginBottom: 8 }} />
              <div style={{ height: 12, width: "40%", borderRadius: 4, background: "#f0f0f0" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
