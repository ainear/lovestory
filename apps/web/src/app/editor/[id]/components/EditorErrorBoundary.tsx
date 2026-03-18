"use client";

import React from "react";

interface Props {
  tabName?: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

/**
 * EditorErrorBoundary — catches React #310 and any other render errors
 * in editor sidebar tabs. Shows a friendly recovery UI instead of a white screen.
 */
export class EditorErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMsg: error?.message ?? "Unknown error",
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[EditorErrorBoundary] Tab: ${this.props.tabName ?? "unknown"}`,
      error,
      info.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          data-error-boundary="true"
          style={{
            padding: "16px",
            borderRadius: 12,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 22, margin: "0 0 8px" }}>⚠️</p>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#dc2626",
              margin: "0 0 4px",
            }}
          >
            Lỗi tải tab {this.props.tabName ?? ""}
          </p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 12px" }}>
            {this.state.errorMsg.slice(0, 80)}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorMsg: "" })}
            style={{
              padding: "6px 16px",
              borderRadius: 16,
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
