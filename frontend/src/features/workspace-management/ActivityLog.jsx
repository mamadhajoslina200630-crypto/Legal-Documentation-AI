import React from "react";
import { Activity, Clock } from "lucide-react";

export function ActivityLog() {
  const events = [
    { action: "DOCUMENT_UPLOAD", detail: "Uploaded Master_Services_Agreement_2026.pdf", time: "10 mins ago", user: "Associate Advocate" },
    { action: "RISK_ANALYSIS", detail: "Completed automated risk & liability scan", time: "8 mins ago", user: "AI Engine" },
    { action: "CLAUSE_REWRITE", detail: "Revised Clause 14.1 (Indemnity cap)", time: "3 mins ago", user: "Senior Partner" },
  ];

  return (
    <div id="activity-log-widget" className="glass-panel" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <Activity size={18} color="var(--accent-indigo)" />
        <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>Workspace Audit Trail</h4>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {events.map((ev, idx) => (
          <div key={idx} style={{ fontSize: "0.825rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
              <span>{ev.user}</span>
              <span style={{ fontSize: "0.75rem" }}>{ev.time}</span>
            </div>
            <p style={{ color: "var(--text-primary)" }}>{ev.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityLog;
