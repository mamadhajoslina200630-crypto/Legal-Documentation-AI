import React from "react";
import { Menu, SplitSquareVertical, FileText, Sparkles, Eye, EyeOff } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function ChatHeader() {
  const {
    activeConversation,
    toggleSplitView,
    setIsMobileSidebarOpen,
    language
  } = useDocumentContext();

  const t = translations[language] || translations.en;
  const isSplitOpen = activeConversation?.isSplitViewOpen;
  const hasDocument = !!activeConversation?.document;

  return (
    <header className="chat-header">
      <div className="header-left">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="mobile-menu-btn"
          aria-label="Open conversation menu"
        >
          <Menu size={18} />
        </button>

        <div className="header-title-wrapper">
          <span className="header-chat-title">
            {activeConversation?.title || "LegalAI Workspace"}
          </span>

          {hasDocument && (
            <div className="header-doc-pill">
              <FileText size={11} color="var(--blue-primary)" />
              <span>{activeConversation.document.filename}</span>
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Mobile View Switcher (Visible on small screens when document exists) */}
        {hasDocument && (
          <div className="mobile-view-tabs">
            <button
              type="button"
              onClick={() => toggleSplitView(true)}
              className={`mobile-tab-btn ${isSplitOpen ? "active" : ""}`}
            >
              <FileText size={11} />
              <span>{language === "ta" ? "ஆவணம்" : "Document"}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSplitView(false)}
              className={`mobile-tab-btn ${!isSplitOpen ? "active" : ""}`}
            >
              <Sparkles size={11} />
              <span>{language === "ta" ? "உரையாடல்" : "Chat"}</span>
            </button>
          </div>
        )}

        {/* Desktop Split View toggle button */}
        {hasDocument && (
          <button
            onClick={() => toggleSplitView()}
            className={`btn-split-view-toggle desktop-only ${isSplitOpen ? "active" : ""}`}
            title={isSplitOpen ? t.closeSplitView : t.splitView}
          >
            {isSplitOpen ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{isSplitOpen ? (language === "ta" ? "பார்வையை மறை" : "Hide Document") : (language === "ta" ? "ஆவணத்தைக் காட்டு" : "Show Document")}</span>
          </button>
        )}
      </div>
    </header>
  );
}
