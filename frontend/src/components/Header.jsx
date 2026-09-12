import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Sparkles, Scale, Split, MessageSquare, FileText, ArrowLeft } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";

export function Header() {
  const { activeDocument, viewMode, setViewMode } = useDocumentContext();

  return (
    <header id="main-header" className="legal-app-header">
      {/* Left: Home Return + Model & Workspace Status */}
      <div className="header-left-group">
        <Link to="/" className="header-home-btn" title="Return to Landing Page">
          <ArrowLeft size={14} />
          <span>Home</span>
        </Link>

        <div className="model-brand-badge">
          <Scale size={14} color="#3B82F6" />
          <span>Legal AI 2.0</span>
          <span className="model-engine-tag">Hybrid RAG + Gemini 2.5 Pro</span>
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
          <span className="cyan-live-light"></span>
          <span>Indian Legal Jurisdiction</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
