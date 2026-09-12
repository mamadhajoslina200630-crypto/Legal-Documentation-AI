import React from "react";
import { Scale, FileText, Split, Sparkles, Check, Globe } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";

export function Header() {
  const {
    activeDocument,
    isDocViewerOpen,
    setIsDocViewerOpen,
    selectedLanguage,
    setSelectedLanguage,
  } = useDocumentContext();

  return (
    <header id="main-header" className="legal-app-header">
      {/* Brand & Document Chip */}
      <div className="header-left-group">
        <div className="header-brand-badge">
          <div className="header-brand-icon">
            <Scale size={15} color="#ffffff" />
          </div>
          <span className="header-brand-title">Legal<span className="brand-gradient-txt">AI</span></span>
        </div>

        {activeDocument && (
          <div className="header-active-doc-pill">
            <FileText size={13} color="#3B82F6" />
            <span className="doc-pill-name">{activeDocument.filename}</span>
            <span className="doc-pill-pages">
              {activeDocument.totalPages || 14} pgs
            </span>
          </div>
        )}
      </div>

      {/* Right Controls: Split Screen Toggle (Only when doc is active) + Language */}
      <div className="header-right-group">
        {/* Split Screen Toggle Button - only appears when a doc is active */}
        {activeDocument && (
          <button
            onClick={() => setIsDocViewerOpen(!isDocViewerOpen)}
            className={`btn-split-toggle ${isDocViewerOpen ? "active" : ""}`}
            title={isDocViewerOpen ? "Close document preview" : "View original document side-by-side"}
          >
            <Split size={14} />
            <span>{isDocViewerOpen ? (selectedLanguage === "ta" ? "ஆவணத்தை மூடு" : "Close Split") : (selectedLanguage === "ta" ? "ஆவணத்தைப் பார்" : "View Document")}</span>
          </button>
        )}

        {/* Language Switcher: English and தமிழ் */}
        <div className="lang-switcher-pill">
          <button
            onClick={() => setSelectedLanguage("en")}
            className={`lang-btn ${selectedLanguage === "en" ? "active" : ""}`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLanguage("ta")}
            className={`lang-btn ${selectedLanguage === "ta" ? "active" : ""}`}
          >
            தமிழ்
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
