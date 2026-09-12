import React from "react";
import { ChevronDown, Sparkles, Scale } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";

export function Header() {
  const { activeDocument } = useDocumentContext();

  return (
    <header
      id="main-header"
      style={{
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.25rem",
        backgroundColor: "transparent",
        userSelect: "none",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Model Selector (ChatGPT style) */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            padding: "0.3rem 0.6rem",
            borderRadius: "var(--radius-md)",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <span>Legal AI 2.0</span>
          <ChevronDown size={14} color="var(--text-secondary)" />
        </button>

        {activeDocument && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              backgroundColor: "var(--bg-surface)",
              padding: "0.2rem 0.6rem",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <Scale size={12} color="var(--accent-green)" />
            <span>{activeDocument.filename}</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Indian Law & Court Intelligence
        </span>
      </div>
    </header>
  );
}

export default Header;
