import React, { useState } from "react";
import {
  LayoutDashboard,
  Files,
  Cpu,
  Terminal,
  Binary,
  ShieldAlert,
  Highlighter,
  FileBarChart,
  Sliders,
  Plus,
  PanelLeftClose,
  PanelLeft,
  Lock,
  Radio,
  FileText
} from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    activeNavSection,
    setActiveNavSection,
    activeDocument,
    setActiveDocument,
    setIsDocViewerOpen,
    selectedLanguage
  } = useDocumentContext();

  const isTamil = selectedLanguage === "ta";

  const NAV_ITEMS = [
    { id: "overview", labelEn: "Overview", labelTa: "கண்ணோட்டம்", icon: LayoutDashboard },
    { id: "documents", labelEn: "Documents", labelTa: "ஆவணங்கள்", icon: Files },
    { id: "ai_analysis", labelEn: "AI Analysis", labelTa: "AI பகுப்பாய்வு", icon: Cpu },
    { id: "case_workspace", labelEn: "Case Workspace", labelTa: "வழக்கு பணிமனை", icon: Terminal },
    { id: "clause_intelligence", labelEn: "Clause Intelligence", labelTa: "விதிமுறைகள் நுண்ணறிவு", icon: Binary },
    { id: "risk_detection", labelEn: "Risk Detection", labelTa: "அபாய வரைபடம் (Threat Map)", icon: ShieldAlert },
    { id: "citations", labelEn: "Citations", labelTa: "சான்றுகள்", icon: Highlighter },
    { id: "reports", labelEn: "Reports", labelTa: "அறிக்கைகள்", icon: FileBarChart },
    { id: "settings", labelEn: "Settings", labelTa: "அமைப்புகள்", icon: Sliders },
  ];

  const handleNewCase = () => {
    setActiveDocument(null);
    setIsDocViewerOpen(false);
    setActiveNavSection("case_workspace");
    window.dispatchEvent(new CustomEvent("start-new-chat"));
  };

  if (isCollapsed) {
    return (
      <aside className="forensic-sidebar-collapsed">
        <button
          onClick={() => setIsCollapsed(false)}
          className="btn-sidebar-collapse font-mono-tech"
          title="Expand Command Navigation"
        >
          <PanelLeft size={16} />
        </button>

        <button
          onClick={handleNewCase}
          className="btn-new-case-mini"
          title="New Case Dossier"
        >
          <Plus size={16} />
        </button>

        <div className="collapsed-nav-icons">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavSection(item.id)}
                className={`collapsed-nav-btn ${isActive ? "active" : ""}`}
                title={isTamil ? item.labelTa : item.labelEn}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside id="forensic-sidebar" className="forensic-sidebar-expanded">
      {/* Brand & System Identifier */}
      <div className="sidebar-forensic-header">
        <div className="brand-lockup">
          <div className="brand-dot-crimson"></div>
          <div className="brand-title font-mono-tech">
            LEGAL<span className="text-crimson font-bold">INTEL</span>
          </div>
          <span className="brand-sub-tag font-mono-tech">[ v2.6 // PRO ]</span>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="btn-sidebar-collapse"
          title="Collapse"
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      {/* Primary Action: + NEW CASE DOSSIER */}
      <div className="sidebar-action-wrap">
        <button
          onClick={handleNewCase}
          className="btn-new-case font-mono-tech"
        >
          <Plus size={14} color="#E50914" />
          <span>{isTamil ? "+ புதிய வழக்கு" : "+ ANALYZE NEW DOCUMENT"}</span>
        </button>
      </div>

      {/* Primary Technical Navigation List */}
      <div className="sidebar-nav-scroller">
        <div className="sidebar-group-label font-mono-tech">
          // SYSTEM NAVIGATION
        </div>

        <nav className="forensic-nav-list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavSection(item.id)}
                className={`forensic-nav-item ${isActive ? "active" : ""}`}
              >
                <div className="nav-item-left">
                  <Icon size={15} className="nav-icon" />
                  <span className="nav-label">{isTamil ? item.labelTa : item.labelEn}</span>
                </div>
                {isActive && <div className="nav-active-pip" />}
              </button>
            );
          })}
        </nav>

        {/* Active Document Mini Metadata Strip */}
        {activeDocument && (
          <div className="sidebar-doc-card">
            <div className="doc-card-title-row font-mono-tech">
              <FileText size={12} color="#E50914" />
              <span>ACTIVE DOSSIER</span>
            </div>
            <div className="sidebar-doc-name" title={activeDocument.filename}>
              {activeDocument.filename}
            </div>
            <div className="sidebar-doc-meta font-mono-tech">
              <span>{activeDocument.totalPages || 14} PAGES</span>
              <span>·</span>
              <span className="text-crimson">INDEXED</span>
            </div>
          </div>
        )}
      </div>

      {/* Forensic Footer / Encryption Status */}
      <div className="sidebar-forensic-footer font-mono-tech">
        <div className="footer-status-row">
          <div className="pulse-beacon-container">
            <span className="beacon-pip red-beacon"></span>
            <span className="text-muted">SESSION STATUS:</span>
          </div>
          <span className="text-crimson">SECURE</span>
        </div>
        <div className="footer-crypto-text">
          <span>AES-256 GCM</span>
          <span>·</span>
          <span>AIR-GAPPED AUDIT</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
