import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Highlighter,
  X,
  AlertTriangle,
  ShieldAlert,
  SlidersHorizontal,
  Lock,
  Eye,
  CheckCircle2
} from "lucide-react";
import { useDocumentContext, SAMPLE_DOCUMENTS } from "../../../context/DocumentContext";

export function DocumentViewer() {
  const {
    activeDocument,
    activeCitation,
    setActiveCitation,
    setIsDocViewerOpen,
    selectedLanguage,
    redlineMode,
    setRedlineMode
  } = useDocumentContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedClause, setHighlightedClause] = useState(null);
  const [hoveredClauseId, setHoveredClauseId] = useState(null);
  const pageRefs = useRef({});

  const isTamil = selectedLanguage === "ta";

  // When activeCitation updates from chat or forensic modules, jump and highlight!
  useEffect(() => {
    if (activeCitation) {
      const pageNum = activeCitation.page || 1;
      setCurrentPage(pageNum);
      setHighlightedClause(activeCitation.clauseId || `page-${pageNum}`);

      setTimeout(() => {
        const targetId = activeCitation.clauseId || `doc-page-${pageNum}`;
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [activeCitation]);

  // Clean active citation highlight after 8 seconds
  useEffect(() => {
    if (highlightedClause) {
      const timer = setTimeout(() => {
        setHighlightedClause(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [highlightedClause]);

  if (!activeDocument) return null;

  const pages = activeDocument.pages || SAMPLE_DOCUMENTS[0].pages;
  const totalPages = activeDocument.totalPages || pages.length;

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleZoomIn = () => setZoomLevel((z) => Math.min(140, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(75, z - 10));

  // Risk metadata mapping for sample clauses
  const CLAUSE_RISK_MAP = {
    "clause-14": { level: "CRITICAL", color: "#E50914", advisory: "Mandatory lock-in penalty. 100% unexpired gross rent exposure." },
    "clause-5": { level: "HIGH", color: "#B30000", advisory: "Unilateral deposit forfeiture rights without independent adjudication." },
    "clause-18": { level: "HIGH", color: "#B30000", advisory: "Unilateral arbitrator appointment void under Perkins Eastman precedent." },
    "clause-11": { level: "REVIEW", color: "#D97706", advisory: "60-day notice requirement with punitive 3-month rent deficit." },
    "clause-1": { level: "SAFE", color: "#475569", advisory: "Standard premises demised clause. Compliant with local zoning." },
    "clause-j18": { level: "CRITICAL", color: "#E50914", advisory: "Ratio decidendi: Section 12(5) voidness of biased panels." }
  };

  return (
    <div className="doc-viewer-forensic-root" id="document-viewer-column">
      {/* Top Forensic Toolbar */}
      <div className="doc-forensic-toolbar font-mono-tech">
        <div className="toolbar-left-meta">
          <div className="doc-type-indicator">
            <span className="type-tag">[ {activeDocument.docType || "LEGAL INSTRUMENT"} ]</span>
          </div>
          <span className="doc-title-text" title={activeDocument.filename}>
            {activeDocument.filename}
          </span>
        </div>

        <div className="toolbar-controls-cluster">
          {/* Page Stepper */}
          <div className="page-stepper-box">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="btn-stepper-icon"
              title="Previous Page"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="stepper-counter">
              PG {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="btn-stepper-icon"
              title="Next Page"
            >
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Zoom Stepper */}
          <div className="zoom-stepper-box">
            <button onClick={handleZoomOut} className="btn-stepper-icon" title="Zoom Out">
              <ZoomOut size={12} />
            </button>
            <span className="zoom-label">{zoomLevel}%</span>
            <button onClick={handleZoomIn} className="btn-stepper-icon" title="Zoom In">
              <ZoomIn size={12} />
            </button>
          </div>

          {/* Close Split Button */}
          <button
            onClick={() => setIsDocViewerOpen(false)}
            className="btn-close-split-forensic"
            title="Dismiss Document Split"
          >
            <X size={13} />
            <span>[ CLOSE ]</span>
          </button>
        </div>
      </div>

      {/* Redline Mode Sub-Bar & Legend */}
      <div className="doc-forensic-subbar font-mono-tech">
        <div className="subbar-legend">
          <span className="legend-label text-muted">RISK TIERS:</span>
          <span className="legend-chip critical-chip">● CRITICAL</span>
          <span className="legend-chip high-chip">● HIGH RISK</span>
          <span className="legend-chip review-chip">● REVIEW</span>
          <span className="legend-chip safe-chip">● SAFE</span>
        </div>

        <div className="subbar-redline-state">
          <span className="text-muted">MODE:</span>
          <span className="text-crimson font-bold">
            {redlineMode === "original" ? "ORIGINAL TEXT" : redlineMode === "flagged" ? "AI FLAGGED REDLINE" : "RECOMMENDED REVIEW"}
          </span>
        </div>
      </div>

      {/* Floating Citation Indicator */}
      {activeCitation && (
        <div className="forensic-citation-toast font-mono-tech">
          <div className="toast-left">
            <ShieldAlert size={14} color="#E50914" />
            <span>
              {isTamil ? "சுட்டிக்காட்டப்பட்ட பகுதி:" : "EVIDENCE TARGET:"} <strong>PAGE {activeCitation.page}</strong>
              {activeCitation.clauseNumber ? ` · CLAUSE ${activeCitation.clauseNumber}` : ""}
            </span>
          </div>
          <button onClick={() => setActiveCitation(null)} className="btn-toast-dismiss">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Document Parchment / Obsidian Viewport */}
      <div className="doc-forensic-viewport">
        {/* Subtle Animated Red Scanning Line */}
        <div className="laser-scanning-line" />

        <div
          className="doc-sheet-container"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
        >
          {pages.map((page) => {
            const isTargetPage = currentPage === page.pageNumber;

            return (
              <div
                key={page.pageNumber}
                id={`doc-page-${page.pageNumber}`}
                ref={(el) => (pageRefs.current[page.pageNumber] = el)}
                className={`obsidian-legal-sheet ${isTargetPage ? "active-page-ring" : ""}`}
              >
                {/* Sheet Technical Header */}
                <div className="sheet-tech-header font-mono-tech">
                  <div className="sheet-header-left">
                    <span className="text-crimson">CONFIDENTIAL</span>
                    <span>//</span>
                    <span>{activeDocument.jurisdiction || "LEGAL EVIDENCE"}</span>
                  </div>
                  <div className="sheet-header-right">
                    <span>PAGE {page.pageNumber} OF {totalPages}</span>
                  </div>
                </div>

                {/* Sheet Body & Clauses */}
                <div className="sheet-body-content">
                  {page.title && <div className="sheet-section-title font-mono-tech">[ {page.title} ]</div>}

                  {page.content.split("\n\n").map((para, pIdx) => (
                    <p key={pIdx} className="sheet-text-paragraph">{para}</p>
                  ))}

                  {/* Render Clauses with Redline / Risk Glow */}
                  {page.clauses && page.clauses.map((clause) => {
                    const isHighlighted = highlightedClause === clause.id;
                    const risk = CLAUSE_RISK_MAP[clause.id] || { level: "REVIEW", color: "#D97706", advisory: "Standard review recommended." };
                    const isRisky = risk.level === "CRITICAL" || risk.level === "HIGH";

                    return (
                      <div
                        key={clause.id}
                        id={clause.id}
                        onMouseEnter={() => setHoveredClauseId(clause.id)}
                        onMouseLeave={() => setHoveredClauseId(null)}
                        className={`forensic-clause-block ${isHighlighted ? "laser-glow" : ""} ${redlineMode === "flagged" && isRisky ? "flagged-redline" : ""} ${redlineMode === "review" && isRisky ? "review-redline" : ""}`}
                        style={{ borderLeftColor: isHighlighted ? "#E50914" : isRisky ? risk.color : undefined }}
                      >
                        <div className="clause-block-header font-mono-tech">
                          <span className="clause-tag" style={{ color: risk.color }}>
                            [ CLAUSE {clause.number} // {clause.title} ]
                          </span>
                          <span
                            className="clause-risk-pill"
                            style={{ backgroundColor: `${risk.color}22`, color: risk.color, borderColor: risk.color }}
                          >
                            {risk.level}
                          </span>
                        </div>

                        {/* Redline Display */}
                        {redlineMode === "review" && isRisky ? (
                          <div className="redline-comparison-box">
                            <div className="strikethrough-original">
                              <span className="redline-tag font-mono-tech text-red">[ DISPUTED CLAUSE ]:</span>
                              <span className="strike-text">{clause.text}</span>
                            </div>
                            <div className="suggested-replacement">
                              <span className="redline-tag font-mono-tech text-gold">[ RECOMMENDED AMENDMENT ]:</span>
                              <span className="replacement-text">
                                "Either party may terminate upon providing sixty (60) days prior written notice, subject to an agreed maximum liquidated damages fee capped at two (2) months gross rent."
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="clause-text-body">{clause.text}</div>
                        )}

                        {/* Hover Tooltip / AI Annotation */}
                        {hoveredClauseId === clause.id && (
                          <div className="clause-hover-telemetry font-mono-tech">
                            <span className="telemetry-label text-crimson">[ AI FORENSIC ANNOTATION ]:</span>
                            <span className="telemetry-text">{risk.advisory}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DocumentViewer;
