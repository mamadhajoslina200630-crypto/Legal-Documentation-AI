import React from "react";
import { Scale, BookOpen, CheckCircle } from "lucide-react";
import Badge from "../../components/Badge";

export function JudgmentSummaryView() {
  const judgment = {
    court: "Supreme Court of India",
    caseTitle: "ABC Logistics Ltd. vs. Commercial Taxes Department",
    bench: "Hon'ble CJI & Companion Justices",
    citations: "2026 INSC 412",
    facts: "Dispute concerning applicability of GST on liquidated damages recovered for contractual delay.",
    legalIssues: ["Whether liquidated damages constitute consideration for agreeing to tolerate an act."],
    ratioDecidendi: "Liquidated damages for breach do not constitute taxable supply under Section 7 of the CGST Act.",
    disposition: "Civil Appeal Allowed in favor of Appellant.",
  };

  return (
    <div id="judgment-summary-view" className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>{judgment.caseTitle}</h3>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{judgment.court} | {judgment.citations}</span>
        </div>
        <Badge variant="low">Landmark Precedent</Badge>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem", lineHeight: "1.6" }}>
        <div>
          <strong style={{ color: "var(--accent-indigo)" }}>Bench: </strong>
          <span>{judgment.bench}</span>
        </div>

        <div>
          <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.25rem" }}>Material Facts:</strong>
          <p style={{ color: "var(--text-secondary)" }}>{judgment.facts}</p>
        </div>

        <div>
          <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.25rem" }}>Ratio Decidendi:</strong>
          <p style={{ color: "var(--text-secondary)" }}>{judgment.ratioDecidendi}</p>
        </div>

        <div style={{ padding: "0.75rem", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <strong style={{ color: "var(--accent-emerald)" }}>Final Order / Disposition: </strong>
          <span>{judgment.disposition}</span>
        </div>
      </div>
    </div>
  );
}

export default JudgmentSummaryView;
