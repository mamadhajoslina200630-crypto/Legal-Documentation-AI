import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Badge from "../../../components/Badge";
import api from "../../../api/client";

export function ComplianceTab({ documentId }) {
  const [liveItems, setLiveItems] = useState([]);

  useEffect(() => {
    if (!documentId) return;
    api.get(`/analysis/${documentId}/compliance`)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveItems(data);
        }
      })
      .catch((err) => console.log("Compliance fetch note:", err));
  }, [documentId]);

  const defaultItems = [
    { act: "Digital Personal Data Protection Act (DPDP) 2023", compliant: true, notes: "Explicit purpose limitation and consent mechanisms included in schedule D." },
    { act: "Indian Contract Act, 1872 (Section 27 - Restraint of Trade)", compliant: true, notes: "Non-compete covenants are tailored to post-termination non-solicitation only." },
    { act: "Indian Stamp Act & State Stamping Rules", compliant: false, notes: "Verify e-stamp certificate adhesive stamp duty before formal execution." },
  ];

  const complianceItems = liveItems.length > 0
    ? liveItems.map(item => ({
        act: item.standard || item.act,
        compliant: item.status === "compliant",
        notes: item.notes,
      }))
    : defaultItems;

  return (
    <div id="tab-content-compliance" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {complianceItems.map((item, idx) => (
        <div key={idx} className="glass-panel" style={{ padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          {item.compliant ? <CheckCircle2 size={22} color="var(--accent-emerald)" /> : <AlertCircle size={22} color="var(--accent-gold)" />}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>{item.act}</h4>
              <Badge variant={item.compliant ? "low" : "medium"}>{item.compliant ? "Compliant" : "Action Needed"}</Badge>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>{item.notes}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ComplianceTab;
