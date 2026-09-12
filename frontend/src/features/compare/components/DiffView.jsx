import React from "react";
import { PlusCircle, MinusCircle, ArrowRight } from "lucide-react";

export function DiffView({ diffItems = [] }) {
  const sampleDiffs = [
    {
      type: "modified",
      clause: "Clause 14.1 (Indemnity)",
      oldText: "Vendor shall defend Customer from claims up to INR 50 Lakhs.",
      newText: "Vendor shall defend Customer from all third-party IP claims without liability cap.",
      impact: "Shifted from capped to uncapped liability.",
    },
    {
      type: "added",
      clause: "Clause 23 (Data Protection & DPDP Audit)",
      oldText: "[Not present in Version 1]",
      newText: "Customer retains quarterly security audit inspection rights with 7 business days notice.",
      impact: "Added statutory data privacy requirement.",
    },
  ];

  const items = diffItems.length > 0 ? diffItems : sampleDiffs;

  return (
    <div id="diff-view-container" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {items.map((item, idx) => (
        <div key={idx} className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>{item.clause}</h4>
            <span className={`badge ${item.type === "added" ? "badge-low" : "badge-medium"}`}>
              {item.type}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
            <div style={{ padding: "0.75rem", borderRadius: "6px", backgroundColor: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
              <strong style={{ color: "var(--accent-rose)", display: "block", marginBottom: "0.3rem" }}>
                <MinusCircle size={14} style={{ display: "inline", marginRight: "4px" }} /> Version A (Original)
              </strong>
              <p style={{ color: "var(--text-secondary)" }}>{item.oldText}</p>
            </div>

            <div style={{ padding: "0.75rem", borderRadius: "6px", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <strong style={{ color: "var(--accent-emerald)", display: "block", marginBottom: "0.3rem" }}>
                <PlusCircle size={14} style={{ display: "inline", marginRight: "4px" }} /> Version B (Revised)
              </strong>
              <p style={{ color: "var(--text-primary)" }}>{item.newText}</p>
            </div>
          </div>

          <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--accent-gold)" }}>
            <strong>Analysis: </strong> {item.impact}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DiffView;
