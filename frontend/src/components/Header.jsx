import React from "react";
import { Shield, Lock, Split, Terminal, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";

export function Header() {
  const {
    activeDocument,
    isDocViewerOpen,
    setIsDocViewerOpen,
    selectedLanguage,
    setSelectedLanguage,
    language,
    setLanguage,
    caseId,
    aiConfidence,
    securityStatus,
    redlineMode,
    setRedlineMode,
  } = useDocumentContext();

  const currentLang = selectedLanguage || language || "en";
  const isTamil = currentLang === "ta";
  const isMalayalam = currentLang === "ml";
  const isTelugu = currentLang === "te";

  const handleLangChange = (code) => {
    if (setSelectedLanguage) setSelectedLanguage(code);
    if (setLanguage) setLanguage(code);
  };

  const getSplitLabel = () => {
    if (isDocViewerOpen) {
      if (isTelugu) return "[ పత్రం మూసివేయి ]";
      if (isMalayalam) return "[ രേഖ അടയ്ക്കുക ]";
      if (isTamil) return "[ ஆவணத்தை மூடு ]";
      return "[ CLOSE SPLIT ]";
    } else {
      if (isTelugu) return "[ పత్రం వీక్షించండి ]";
      if (isMalayalam) return "[ രേഖ കാണുക ]";
      if (isTamil) return "[ ஆவணத்தைப் பார் ]";
      return "[ VIEW DOCUMENT ]";
    }
  };

  return (
    <header id="command-top-bar" className="forensic-top-bar">
      {/* Group 1: Forensic Case Identifiers & Encryption Status */}
      <div className="topbar-left-group font-mono-tech">
        <div className="case-id-badge">
          <span className="case-id-text">{caseId}</span>
        </div>

        <div className="status-item analysis-status">
          <span className="beacon-dot red-beacon"></span>
          <span>{activeDocument ? "ANALYSIS COMPLETE" : "CASEROOM STANDBY"}</span>
        </div>

        <div className="status-item ai-confidence-metric">
          <span className="text-muted">AI CONFIDENCE:</span>
          <span className="text-crimson font-bold">{activeDocument ? aiConfidence : "--"}</span>
        </div>

        <div className="status-item security-badge">
          <Lock size={12} color="#E50914" />
          <span>{securityStatus}</span>
        </div>
      </div>

      {/* Group 2: REDLINE MODE CONTROLS (Center) */}
      {activeDocument && (
        <div className="topbar-center-group">
          <div className="redline-mode-selector font-mono-tech">
            <span className="redline-label text-muted">REDLINE:</span>
            <button
              onClick={() => setRedlineMode("original")}
              className={`btn-redline-mode ${redlineMode === "original" ? "active" : ""}`}
            >
              [ ORIGINAL ]
            </button>
            <button
              onClick={() => setRedlineMode("flagged")}
              className={`btn-redline-mode ${redlineMode === "flagged" ? "active" : ""}`}
            >
              [ AI FLAGGED ]
            </button>
            <button
              onClick={() => setRedlineMode("review")}
              className={`btn-redline-mode ${redlineMode === "review" ? "active" : ""}`}
            >
              [ RECOMMENDED REVIEW ]
            </button>
          </div>
        </div>
      )}

      {/* Group 3: Split View Toggle & Language Selector (Right) */}
      <div className="topbar-right-group">
        {activeDocument && (
          <button
            onClick={() => setIsDocViewerOpen(!isDocViewerOpen)}
            className={`btn-split-toggle-crimson font-mono-tech ${isDocViewerOpen ? "active" : ""}`}
            title={isDocViewerOpen ? "Close document split view" : "View original document side-by-side"}
          >
            <Split size={13} />
            <span>{getSplitLabel()}</span>
          </button>
        )}

        {/* Multilingual Switcher: English, Tamil, Malayalam, Telugu */}
        <div className="lang-switcher-forensic font-mono-tech">
          <button
            onClick={() => handleLangChange("en")}
            className={`lang-btn-tech ${currentLang === "en" ? "active" : ""}`}
            title="English"
          >
            EN
          </button>
          <button
            onClick={() => handleLangChange("ta")}
            className={`lang-btn-tech ${currentLang === "ta" ? "active" : ""}`}
            title="Tamil"
          >
            தமிழ்
          </button>
          <button
            onClick={() => handleLangChange("ml")}
            className={`lang-btn-tech ${currentLang === "ml" ? "active" : ""}`}
            title="Malayalam"
          >
            മലയാളം
          </button>
          <button
            onClick={() => handleLangChange("te")}
            className={`lang-btn-tech ${currentLang === "te" ? "active" : ""}`}
            title="Telugu"
          >
            తెలుగు
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
