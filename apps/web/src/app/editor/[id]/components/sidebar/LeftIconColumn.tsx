"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { TABS } from "../editor-constants";

interface LeftIconColumnProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

export function LeftIconColumn({ activeTab, setActiveTab }: LeftIconColumnProps) {
  return (
    <div
      style={{
        width: 85,
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
        gap: 2,
        flexShrink: 0,
        overflowY: "auto",
        boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        zIndex: 2,
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(activeTab === tab.key ? "" : tab.key)}
          title={tab.label}
          style={{
            width: 74,
            padding: "8px 2px",
            border: "none",
            borderRadius: 10,
            background: activeTab === tab.key ? "#fff0f5" : "transparent",
            color: activeTab === tab.key ? "#ff6b9d" : "#6b7280",
            cursor: "pointer",
            fontSize: 9,
            fontWeight: activeTab === tab.key ? 700 : 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            transition: "all 0.15s",
          }}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
      {/* Fixed "Hỗ trợ" button at bottom */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid #f0f0f0",
          paddingTop: 8,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => window.open("https://lovestory.vn/help", "_blank")}
          title="Hỗ trợ"
          style={{
            width: 74,
            padding: "8px 2px",
            border: "none",
            borderRadius: 10,
            background: "transparent",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: 9,
            fontWeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            transition: "all 0.15s",
            marginBottom: 8,
          }}
        >
          <HelpCircle size={20} />
          <span>Hỗ trợ</span>
        </button>
      </div>
    </div>
  );
}
