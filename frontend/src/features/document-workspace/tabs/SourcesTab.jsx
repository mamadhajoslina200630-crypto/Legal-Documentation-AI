import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";

export function SourcesTab() {
  const sources = [
    { section: "Section 14.1", page: 9, title: "Indemnity Provisions", text: "Direct text extracted from page 9 of uploaded PDF." },
    { section: "Schedule B", page: 12, title: "Service Level Commitments", text: "Direct text extracted from page 12 of uploaded PDF." },
  ];

  return (
    <div id="tab-content-sources" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {sources.map((s, idx) => (
        <div key={idx} className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen size={16} color="var(--accent-indigo)" />
              <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>{s.title} ({s.section})</h4>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Page {s.page}</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export default SourcesTab;
