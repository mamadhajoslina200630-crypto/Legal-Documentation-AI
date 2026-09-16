import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  AlertTriangle,
  Gavel,
  ShieldAlert
} from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function DocumentViewer() {
  const { activeConversation, toggleSplitView, highlightClause, language } = useDocumentContext();
  const t = translations[language] || translations.en;

  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const canvasRef = useRef(null);
  const clauseRefs = useRef({});

  const document = activeConversation?.document;
  const activeHighlightId = activeConversation?.activeHighlightId;
  const totalPages = document?.totalPages || 12;
  const isJudgment = document?.category === "judgment" || document?.filename?.includes("Judgment");

  // Listen for scroll-to-clause events from Chat citations
  useEffect(() => {
    const handleScrollToClause = (event) => {
      const clauseId = event.detail?.clauseId;
      const targetPage = event.detail?.page;

      if (targetPage && typeof targetPage === "number") {
        setCurrentPage(targetPage);
      }

      setTimeout(() => {
        if (clauseId && clauseRefs.current[clauseId]) {
          clauseRefs.current[clauseId].scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 80);
    };

    window.addEventListener("scroll-to-clause", handleScrollToClause);
    return () => {
      window.removeEventListener("scroll-to-clause", handleScrollToClause);
    };
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
  const handleResetZoom = () => setZoomLevel(100);

  // Page navigation
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (!document) {
    return (
      <div className="doc-canvas-container" style={{ justifyContent: "center", color: "#666" }}>
        <p>No document attached to this conversation.</p>
      </div>
    );
  }

  return (
    <div className="document-pane" role="region" aria-label="Legal Document Viewer">
      {/* Header Controls */}
      <div className="doc-viewer-header">
        <div className="doc-viewer-controls">
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder={t.searchInDocument}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="doc-search-input"
            />
            <Search size={11} style={{ position: "absolute", right: 6, color: "#666", pointerEvents: "none" }} />
          </div>

          {/* Zoom controls */}
          <button onClick={handleZoomOut} className="doc-tool-btn" title={t.zoomOut}>
            <ZoomOut size={12} />
          </button>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)", minWidth: "32px", textAlign: "center" }}>
            {zoomLevel}%
          </span>
          <button onClick={handleZoomIn} className="doc-tool-btn" title={t.zoomIn}>
            <ZoomIn size={12} />
          </button>
          <button onClick={handleResetZoom} className="doc-tool-btn" title={t.resetZoom}>
            <RotateCcw size={11} />
          </button>
        </div>

        <div className="doc-viewer-controls">
          {/* Page Navigator */}
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="doc-tool-btn">
            <ChevronLeft size={12} />
          </button>
          <span className="page-indicator">
            {t.page} {currentPage} {t.of} {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="doc-tool-btn">
            <ChevronRight size={12} />
          </button>

          {/* Close Split View */}
          <button
            onClick={() => toggleSplitView(false)}
            className="btn-close-split"
            title={t.closeSplitView}
          >
            <X size={13} />
            <span>{t.closeSplitView}</span>
          </button>
        </div>
      </div>

      {/* Document Canvas (Dark Frame with White Paper Page inside) */}
      <div className="doc-canvas-container" ref={canvasRef}>
        <div
          className="doc-paper-page"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease"
          }}
        >
          {/* Document Paper Header */}
          <div className="doc-page-header">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {isJudgment ? <Gavel size={12} color="#818CF8" /> : <FileText size={12} color="var(--blue-primary)" />}
              <span>{document.docType || "LEGAL INSTRUMENT"}</span>
            </div>
            <span>{document.filename}</span>
            <span>PAGE {currentPage} OF {totalPages}</span>
          </div>

          {/* Document Content Pages */}
          {document.pages?.map((pg) => {
            return (
              <div key={pg.pageNumber} className="doc-page-section">
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#666", marginBottom: "8px" }}>
                  {isJudgment ? `PARAGRAPH / SECTION ${pg.pageNumber}: ` : `SECTION ${pg.pageNumber}: `}{pg.title}
                </div>
                <div className="doc-page-content">{pg.content}</div>

                {/* Individual Clauses */}
                {pg.clauses?.map((clause) => {
                  const isHighlighted = activeHighlightId === clause.id;
                  const matchesSearch =
                    searchQuery &&
                    (clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      clause.text.toLowerCase().includes(searchQuery.toLowerCase()));

                  return (
                    <div
                      key={clause.id}
                      ref={(el) => (clauseRefs.current[clause.id] = el)}
                      onClick={() => highlightClause(clause.id, pg.pageNumber)}
                      className={`doc-clause-block ${isHighlighted ? "highlight-active" : ""}`}
                      style={{
                        backgroundColor: matchesSearch ? "rgba(234, 179, 8, 0.15)" : undefined,
                        cursor: "pointer"
                      }}
                    >
                      <div className="doc-clause-title-row">
                        <span className="doc-clause-num">
                          {clause.number} {clause.title}
                        </span>
                        {clause.riskLevel && clause.riskLevel !== "LOW" && (
                          <span className={`doc-clause-risk-tag risk-${clause.riskLevel.toLowerCase()}`}>
                            <AlertTriangle size={9} />
                            {clause.riskLevel} RISK
                          </span>
                        )}
                      </div>
                      <p className="doc-clause-text">{clause.text}</p>
                      {clause.riskExplanation && (
                        <div className="doc-clause-explainer">
                          <span>Analysis: {clause.riskExplanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
