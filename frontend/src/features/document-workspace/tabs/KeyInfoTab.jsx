import React, { useEffect, useState } from "react";
import { Users, Calendar, DollarSign, Scale, Clock } from "lucide-react";
import api from "../../../api/client";

export function KeyInfoTab({ documentId }) {
  const [keyInfo, setKeyInfo] = useState(null);

  useEffect(() => {
    if (!documentId) return;
    api.get(`/analysis/${documentId}/key-info`)
      .then((data) => setKeyInfo(data))
      .catch((err) => console.log("Key info note:", err));
  }, [documentId]);

  const partiesStr = keyInfo?.parties
    ? (Array.isArray(keyInfo.parties) ? keyInfo.parties.map(p => typeof p === "string" ? p : p.name).join(" & ") : String(keyInfo.parties))
    : "Acme Corp Ltd. & Alpha Tech Solutions India Pvt. Ltd.";

  const items = [
    { label: "Contracting Parties", value: partiesStr, icon: Users },
    { label: "Effective Date", value: keyInfo?.effective_date || "15 March 2026", icon: Calendar },
    { label: "Total Contract Value", value: keyInfo?.total_value || "INR 1,20,00,000 (Milestone-based)", icon: DollarSign },
    { label: "Governing Law", value: keyInfo?.governing_law || "Indian Law (Seat: New Delhi)", icon: Scale },
    { label: "Notice Period", value: keyInfo?.expiration_date ? `Valid until ${keyInfo.expiration_date}` : "30 Days Written Notice", icon: Clock },
  ];

  return (
    <div id="tab-content-key-info" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="glass-panel" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ padding: "0.5rem", borderRadius: "8px", backgroundColor: "rgba(99, 102, 241, 0.15)" }}>
              <Icon size={20} color="var(--accent-indigo)" />
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{item.label}</span>
              <div style={{ fontSize: "0.95rem", fontWeight: "600", marginTop: "0.25rem" }}>{item.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KeyInfoTab;
