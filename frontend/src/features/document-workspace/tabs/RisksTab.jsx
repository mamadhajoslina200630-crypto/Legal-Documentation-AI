import React, { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import Badge from "../../../components/Badge";
import api from "../../../api/client";

export function RisksTab({ documentId }) {
  const [liveRisks, setLiveRisks] = useState([]);

  useEffect(() => {
    if (!documentId) return;
    api.get(`/analysis/${documentId}/risks`)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveRisks(data);
        }
      })
      .catch((err) => console.log("Risks fetch note:", err));
  }, [documentId]);

  const defaultRisks = [
    {
      severity: "high",
      title: "Uncapped Consequential Damages Carve-Out",
      clause: "Clause 15.2 (Limitation of Liability)",
      description: "Data breach claims are exempted from the aggregate liability ceiling, creating uncapped exposure under Indian IT & DPDP rules.",
      recommendation: "Limit liability for data incidents to a super-cap of 3x total contract value.",
    },
    {
      severity: "medium",
      title: "Shortened Cure Period for Breach",
      clause: "Clause 18.1 (Default Notice)",
      description: "Party allows only 7 days to cure technical non-compliance before contract termination.",
      recommendation: "Negotiate standard 30-day cure period for non-critical performance defaults.",
    },
    {
      severity: "low",
      title: "Unilateral Jurisdiction Clause",
      clause: "Clause 22.3 (Jurisdiction)",
      description: "Appeals are routed exclusively to Mumbai bench while performance occurs in Bengaluru.",
      recommendation: "Select neutral seat or match operational location.",
    },
  ];

  const risks = liveRisks.length > 0 ? liveRisks : defaultRisks;

  return (
    <div id="tab-content-risks" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {risks.map((risk, idx) => (
        <div key={idx} className="glass-panel" style={{ padding: "1.25rem", borderLeft: `4px solid ${risk.severity === "high" ? "var(--accent-rose)" : risk.severity === "medium" ? "var(--accent-gold)" : "var(--accent-emerald)"}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={18} color={risk.severity === "high" ? "var(--accent-rose)" : "var(--accent-gold)"} />
              <h4 style={{ fontSize: "1rem", fontWeight: "600" }}>{risk.title}</h4>
            </div>
            <Badge variant={risk.severity}>{risk.severity}</Badge>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Reference: {risk.clause || risk.clause_reference}</div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>{risk.description}</p>
          <div style={{ padding: "0.6rem 0.8rem", borderRadius: "6px", backgroundColor: "rgba(99, 102, 241, 0.08)", fontSize: "0.825rem" }}>
            <strong style={{ color: "var(--accent-indigo)" }}>Recommended Mitigation: </strong>
            <span style={{ color: "var(--text-primary)" }}>{risk.recommendation || risk.mitigation_suggestion}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RisksTab;
