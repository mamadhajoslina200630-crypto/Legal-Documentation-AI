import React, { useEffect, useState } from "react";
import OverviewTab from "./tabs/OverviewTab";
import SummaryTab from "./tabs/SummaryTab";
import KeyInfoTab from "./tabs/KeyInfoTab";
import ClausesTab from "./tabs/ClausesTab";
import RisksTab from "./tabs/RisksTab";
import ComplianceTab from "./tabs/ComplianceTab";
import ObligationsTab from "./tabs/ObligationsTab";
import ChatTab from "./tabs/ChatTab";
import SourcesTab from "./tabs/SourcesTab";
import LanguageSwitcher from "../language-accessibility/LanguageSwitcher";
import SimpleExplanationToggle from "../language-accessibility/SimpleExplanationToggle";
import VoicePlayer from "../language-accessibility/VoicePlayer";
import { useDocumentContext } from "../../context/DocumentContext";
import api from "../../api/client";
import { FileText } from "lucide-react";

export function DocumentWorkspacePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { activeDocument, setActiveDocument } = useDocumentContext();
  const [documentList, setDocumentList] = useState([]);

  useEffect(() => {
    api.get("/documents")
      .then((docs) => {
        if (Array.isArray(docs)) {
          setDocumentList(docs);
          if (!activeDocument && docs.length > 0) {
            setActiveDocument(docs[0]);
          }
        }
      })
      .catch((err) => console.log("List docs note:", err));
  }, []);

  const docId = activeDocument?.id || "doc-msa-preview";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "summary", label: "Summary" },
    { id: "key-info", label: "Key Info" },
    { id: "clauses", label: "Clauses" },
    { id: "risks", label: "Risks & Redlines" },
    { id: "compliance", label: "Compliance" },
    { id: "obligations", label: "Obligations" },
    { id: "chat", label: "Document Chat" },
    { id: "sources", label: "Sources & Pages" },
  ];

  const handleSelectDoc = (e) => {
    const selected = documentList.find((d) => d.id === e.target.value);
    if (selected) setActiveDocument(selected);
  };

  return (
    <div id="document-workspace-page" className="page-container">
      {/* Header bar with Accessibility & Language controls */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
              {activeDocument?.filename || "Master_Services_Agreement_2026.pdf"}
            </h2>
            <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
              Document ID: {docId}
            </span>
          </div>

          {documentList.length > 1 && (
            <select
              id="doc-selector-dropdown"
              value={docId}
              onChange={handleSelectDoc}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                color: "var(--text-primary)",
                padding: "0.35rem 0.6rem",
                fontSize: "0.85rem",
                outline: "none",
              }}
            >
              {documentList.map((d) => (
                <option key={d.id} value={d.id} style={{ backgroundColor: "#1e1e24" }}>
                  {d.filename}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <VoicePlayer />
          <SimpleExplanationToggle />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="tabs-header">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`tab-btn-${t.id}`}
            className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "overview" && <OverviewTab documentData={activeDocument} />}
        {activeTab === "summary" && <SummaryTab documentId={docId} />}
        {activeTab === "key-info" && <KeyInfoTab documentId={docId} />}
        {activeTab === "clauses" && <ClausesTab documentId={docId} />}
        {activeTab === "risks" && <RisksTab documentId={docId} />}
        {activeTab === "compliance" && <ComplianceTab documentId={docId} />}
        {activeTab === "obligations" && <ObligationsTab documentId={docId} />}
        {activeTab === "chat" && <ChatTab documentId={docId} />}
        {activeTab === "sources" && <SourcesTab />}
      </div>
    </div>
  );
}

export default DocumentWorkspacePage;
