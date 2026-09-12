import React, { useEffect, useState } from "react";
import { Clock, Calendar, CheckSquare } from "lucide-react";
import api from "../../../api/client";

export function ObligationsTab({ documentId }) {
  const [liveObligations, setLiveObligations] = useState([]);

  useEffect(() => {
    if (!documentId) return;
    api.get(`/analysis/${documentId}/obligations`)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveObligations(data);
        }
      })
      .catch((err) => console.log("Obligations fetch note:", err));
  }, [documentId]);

  const defaultObligations = [
    { party: "Vendor", task: "Submit Quarterly Security Vulnerability Audit", deadline: "Every 90 days from effective date", penalty: "5% penalty per week delay" },
    { party: "Customer", task: "Process Invoice Payment via NEFT/RTGS", deadline: "Net 30 days after invoice receipt", penalty: "1.5% monthly late interest" },
    { party: "Vendor", task: "Annual Business Continuity & Disaster Recovery Test", deadline: "Within 60 days of fiscal year start", penalty: "Right to withhold milestone payment" },
  ];

  const obligations = liveObligations.length > 0
    ? liveObligations.map(item => ({
        party: item.responsible_party || item.party,
        task: item.action_required || item.task,
        deadline: item.due_date || item.deadline,
        penalty: item.penalty_or_consequence || item.penalty,
      }))
    : defaultObligations;

  return (
    <div id="tab-content-obligations" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {obligations.map((ob, idx) => (
        <div key={idx} className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>{ob.task}</h4>
            <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px", backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
              Responsible: {ob.party}
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={14} color="var(--accent-indigo)" /> Deadline: {ob.deadline}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-rose)" }}>
              Penalty: {ob.penalty}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ObligationsTab;
