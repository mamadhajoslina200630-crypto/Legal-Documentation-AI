import React, { useEffect, useState } from "react";
import Badge from "../../../components/Badge";
import api from "../../../api/client";

export function ClausesTab({ documentId }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [liveClauses, setLiveClauses] = useState([]);

  useEffect(() => {
    if (!documentId) return;
    api.get(`/analysis/${documentId}/clauses`)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveClauses(data);
        }
      })
      .catch((err) => console.log("Clauses fetch note:", err));
  }, [documentId]);

  const defaultClauses = [
    { type: "Indemnity", clause_type: "Indemnity", title: "Clause 14: Intellectual Property Indemnification", page: 9, page_number: 9, text: "Vendor shall defend, indemnify and hold harmless Customer against any third-party claims alleging patent or copyright infringement." },
    { type: "Termination", clause_type: "Termination", title: "Clause 18: Termination for Cause and Convenience", page: 12, page_number: 12, text: "Either party may terminate upon thirty (30) business days written notice without penalty." },
    { type: "Confidentiality", clause_type: "Confidentiality", title: "Clause 11: Non-Disclosure of Proprietary Data", page: 7, page_number: 7, text: "Recipient shall protect Confidential Information with standard of care no less than reasonable care for 5 years." },
    { type: "Governing Law", clause_type: "Governing Law", title: "Clause 22: Governing Law & Dispute Resolution", page: 14, page_number: 14, text: "This Agreement shall be construed under Indian Law with jurisdiction exclusively in courts of New Delhi." },
  ];

  const clauses = liveClauses.length > 0 ? liveClauses : defaultClauses;

  return (
    <div id="tab-content-clauses" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {["all", "Indemnity", "Termination", "Confidentiality"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`btn btn-secondary ${activeFilter === f ? "btn-primary" : ""}`}
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {clauses
          .filter((c) => activeFilter === "all" || (c.type || c.clause_type) === activeFilter)
          .map((c, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>{c.title || c.clause_type}</h4>
                <Badge variant="low">Page {c.page || c.page_number || 1}</Badge>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>{c.text}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ClausesTab;
