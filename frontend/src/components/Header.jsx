import React from "react";
import { ChevronDown, Sparkles, Scale, Split, MessageSquare, FileText, Globe } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";

export function Header() {
  const { activeDocument, viewMode, setViewMode, selectedLanguage, setSelectedLanguage } = useDocumentContext();

  return (
    <header id="main-header" className="legal-app-header">
      {/* Left: Model & Workspace Status */}
      <div className="header-left-group">
        <div className="model-brand-badge">
          <Scale size={14} color="#10a37f" />
          <span>Legal AI 2.0</span>
          <span className="model-engine-tag">Indian Law RAG + Gemini</span>
        </div>

        {activeDocument && (
          <div className="header-active-doc-pill">
            <span className="doc-pill-icon">📄</span>
            <span className="doc-pill-name">{activeDocument.filename}</span>
            <span className="doc-pill-pages">
              {activeDocument.totalPages || 14} pgs
            </span>
          </div>
        )}
      </div>

      {/* Right: Layout Switcher & Indian Jurisdiction Badge */}
      <div className="header-right-group">
        {/* 3-Zone Layout Controller */}
        <div className="layout-switcher-pill">
          <button
            onClick={() => setViewMode("split")}
            className={`layout-pill-btn ${viewMode === "split" ? "active" : ""}`}
            title="Split: Document Viewer + Conversational AI"
          >
            <Split size={13} />
            <span>Split</span>
          </button>
          <button
            onClick={() => setViewMode("chat-only")}
            className={`layout-pill-btn ${viewMode === "chat-only" ? "active" : ""}`}
            title="Conversational AI Chat"
          >
            <MessageSquare size={13} />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setViewMode("doc-only")}
            className={`layout-pill-btn ${viewMode === "doc-only" ? "active" : ""}`}
            title="Document Viewer Fullscreen"
          >
            <FileText size={13} />
            <span>Document</span>
          </button>
        </div>

        {/* Indian Legal System Status */}
        <div className="jurisdiction-status-pill">
          <span className="green-live-light"></span>
          <span>Indian Legal Jurisdiction</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
