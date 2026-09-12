import React from "react";
import { Clock, Calendar, AlertCircle } from "lucide-react";
import Badge from "../../components/Badge";

export function CourtOrderView() {
  const order = {
    court: "High Court of Judicature at Bombay (Commercial Division)",
    caseNo: "Commercial Suit No. 892 of 2026",
    orderType: "Ad-Interim Relief / Status Quo Order",
    nextHearingDate: "24 October 2026",
    directions: [
      "Defendants restrained from invoking bank guarantee till the next date of hearing.",
      "Plaintiffs directed to serve notice of motion within 48 hours.",
      "Affidavit in reply to be filed within two weeks.",
    ],
  };

  return (
    <div id="court-order-view" className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>{order.orderType}</h3>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{order.court} | {order.caseNo}</span>
        </div>
        <Badge variant="medium">Urgent Compliance</Badge>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", fontSize: "0.85rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-gold)" }}>
          <Calendar size={16} /> Next Hearing: {order.nextHearingDate}
        </div>
      </div>

      <div>
        <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>Operative Directions:</strong>
        <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          {order.directions.map((dir, idx) => (
            <li key={idx}>{dir}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CourtOrderView;
