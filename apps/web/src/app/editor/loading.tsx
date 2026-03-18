export default function EditorLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Toolbar skeleton */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          background: "#1a1a1a",
          borderBottom: "1px solid #333",
        }}
      />
      {/* Canvas skeleton */}
      <div
        style={{
          width: 390,
          height: 700,
          background: "#1a1a1a",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 52,
        }}
      >
        <div style={{ textAlign: "center", color: "#4b5563" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid #333",
              borderTop: "3px solid #ec4899",
              borderRadius: "50%",
              margin: "0 auto 12px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 13, margin: 0 }}>Đang tải editor...</p>
        </div>
      </div>
      {/* Right panel skeleton */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 52,
          bottom: 0,
          width: 260,
          background: "#1a1a1a",
          borderLeft: "1px solid #333",
        }}
      />
    </div>
  );
}
