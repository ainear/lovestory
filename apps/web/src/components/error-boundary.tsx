"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  eventId: string | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, eventId: null };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      extra: { componentStack: errorInfo.componentStack },
    });
    this.setState({ eventId });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f9fafb",
            gap: 16,
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 48 }}>😢</p>
          <h2
            style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}
          >
            Đã xảy ra lỗi không mong muốn
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 400, margin: 0 }}>
            Chúng tôi đã ghi nhận lỗi và sẽ xử lý sớm nhất có thể. Vui lòng
            thử tải lại trang.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: "#ff6b9d",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Tải lại trang
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#374151",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Về Dashboard
            </button>
          </div>
          {this.state.eventId && (
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>
              Mã lỗi: {this.state.eventId}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
