import React from "react";
import { FileText, Calendar, Users, ShieldAlert, CheckCircle } from "lucide-react";
import Badge from "../../../components/Badge";

export function OverviewTab({ documentData = {} }) {
  const meta = {
    filename: documentData.filename || "Master_Services_Agreement_2026.pdf",
    status: documentData.status || "ready",
    fileSize: "2.4 MB",
    pages: 14,
    parties: "Acme Corp Ltd. & Alpha Tech Solutions India Pvt. Ltd.",
    effectiveDate: "March 15, 2026",
    governingLaw: "Laws of India (Arbitration: New Delhi)",
  };

  return (
    <div id="tab-content-overview" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Processing Status</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
            <Badge variant="low">Pipeline Ready</Badge>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Pages / Size</span>
          <div style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.4rem" }}>
            {meta.pages} Pages ({meta.fileSize})
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>OCR Layer</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem", color: "var(--accent-emerald)", fontSize: "0.9rem" }}>
            <CheckCircle size={16} /> Digital & Extracted
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>Document Identification</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem" }}>
          <div>
            <span style={{ color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>Contracting Parties:</span>
            <strong>{meta.parties}</strong>
          </div>
          <div>
            <span style={{ color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>Effective Date:</span>
            <strong>{meta.effectiveDate}</strong>
          </div>
          <div>
            <span style={{ color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>Jurisdiction & Governing Law:</span>
            <strong>{meta.governingLaw}</strong>
          </div>
          <div>
            <span style={{ color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>Original File:</span>
            <strong>{meta.filename}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
