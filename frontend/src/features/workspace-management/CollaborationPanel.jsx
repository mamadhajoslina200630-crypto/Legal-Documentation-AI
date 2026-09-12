import React from "react";
import { Users, UserPlus } from "lucide-react";
import Button from "../../components/Button";

export function CollaborationPanel() {
  const members = [
    { name: "Senior Partner", email: "lead@legalai.in", role: "Owner" },
    { name: "Associate Advocate", email: "associate@legalai.in", role: "Member" },
    { name: "Compliance Analyst", email: "compliance@legalai.in", role: "Reviewer" },
  ];

  return (
    <div id="collaboration-panel" className="glass-panel" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Users size={18} color="var(--accent-indigo)" />
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>Workspace Members</h4>
        </div>
        <Button size="sm" icon={UserPlus} id="btn-invite-member">
          Invite
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {members.map((m, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <div>
              <strong>{m.name}</strong>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{m.email}</div>
            </div>
            <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px", backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollaborationPanel;
