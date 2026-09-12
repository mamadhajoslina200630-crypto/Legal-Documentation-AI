import React, { useState } from "react";
import JudgmentSummaryView from "./JudgmentSummaryView";
import CourtOrderView from "./CourtOrderView";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { Shield, BookOpen, Search } from "lucide-react";

export function IndianLegalPage() {
  const [activeSubTab, setActiveSubTab] = useState("judgments");

  return (
    <div id="indian-legal-page" className="page-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Indian Legal Intelligence</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Extract ratio decidendi from Supreme Court/High Court judgments and understand operative directions from court orders.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            id="subtab-btn-judgments"
            variant={activeSubTab === "judgments" ? "primary" : "secondary"}
            onClick={() => setActiveSubTab("judgments")}
          >
            Court Judgments
          </Button>
          <Button
            id="subtab-btn-orders"
            variant={activeSubTab === "orders" ? "primary" : "secondary"}
            onClick={() => setActiveSubTab("orders")}
          >
            Court Orders
          </Button>
        </div>
      </div>

      <div>
        {activeSubTab === "judgments" ? (
          <JudgmentSummaryView />
        ) : (
          <CourtOrderView />
        )}
      </div>
    </div>
  );
}

export default IndianLegalPage;
