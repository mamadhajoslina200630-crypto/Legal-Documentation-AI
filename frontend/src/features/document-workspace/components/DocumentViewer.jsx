import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Scale,
  Sparkles,
  Highlighter,
  X
} from "lucide-react";
import { useDocumentContext, SAMPLE_DOCUMENTS } from "../../../context/DocumentContext";

export function DocumentViewer() {
  const {
    activeDocument,
    activeCitation,
    setActiveCitation,
    setIsDocViewerOpen,
    selectedLanguage
  } = useDocumentContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedClause, setHighlightedClause] = useState(null);
  const pageRefs = useRef({});

  // When activeCitation updates from chat click, auto-jump and highlight!
  useEffect(() => {
    if (activeCitation) {
      const pageNum = activeCitation.page || 1;
      setCurrentPage(pageNum);
      setHighlightedClause(activeCitation.clauseId || `page-${pageNum}`);

      // Scroll smoothly to the cited element
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

  const handleZoomIn = () => setZoomLevel((z) => Math.min(150, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(70, z - 10));

  return (
    <div className="doc-viewer-container" id="document-viewer-column">
      {/* Top Toolbar */}
      <div className="doc-viewer-toolbar">
        <div className="doc-title-group">
          <div className="doc-badge-type">
            <Scale size={13} color="#3B82F6" />
            <span>{activeDocument.docType || "Document"}</span>
          </div>
          <span className="doc-filename-display" title={activeDocument.filename}>
            {activeDocument.filename}
          </span>
        </div>

        <div className="doc-toolbar-controls">
          {/* Page Stepper */}
          <div className="doc-page-stepper">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="doc-nav-btn"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="doc-page-counter">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="doc-nav-btn"
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Zoom */}
          <div className="doc-zoom-stepper">
            <button onClick={handleZoomOut} className="doc-nav-btn" title="Zoom Out">
              <ZoomOut size={13} />
            </button>
            <span className="doc-zoom-label">{zoomLevel}%</span>
            <button onClick={handleZoomIn} className="doc-nav-btn" title="Zoom In">
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Close Document Viewer Button */}
          <button
            onClick={() => setIsDocViewerOpen(false)}
            className="doc-close-split-btn"
            title="Close Split View"
          >
            <X size={15} />
            <span>{selectedLanguage === "ta" ? "மூடு" : "Close"}</span>
          </button>
        </div>
      </div>

      {/* Floating Citation Alert Banner */}
      {activeCitation && (
        <div className="citation-floating-alert">
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Highlighter size={13} color="#ffffff" />
            <span>
              {selectedLanguage === "ta" ? "சுட்டிக்காட்டப்பட்ட பக்கம்:" : "Cited Evidence:"} <strong>Page {activeCitation.page}</strong>
              {activeCitation.clauseNumber ? ` · Clause ${activeCitation.clauseNumber}` : ""}
            </span>
          </div>
          <button
            onClick={() => setActiveCitation(null)}
            style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", display: "flex" }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Document Pages Scroll Area */}
      <div className="doc-canvas-scroll-area">
        <div
          className="doc-canvas-content"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
        >
          {pages.map((page) => {
            const isTargetPage = currentPage === page.pageNumber;
            return (
              <div
                key={page.pageNumber}
                id={`doc-page-${page.pageNumber}`}
                ref={(el) => (pageRefs.current[page.pageNumber] = el)}
                className={`legal-parchment-sheet ${isTargetPage ? "active-page-sheet" : ""}`}
              >
                {/* Header */}
                <div className="parchment-header">
                  <span>{activeDocument.jurisdiction || "LEGAL DOCUMENT INTELLIGENCE"}</span>
                  <span>Page {page.pageNumber} of {totalPages}</span>
                </div>

                <div className="parchment-divider"></div>

                {page.title && <h4 className="parchment-section-title">{page.title}</h4>}

                {/* Content */}
                <div className="parchment-text-body">
                  {page.content.split("\n\n").map((para, pIdx) => (
                    <p key={pIdx} className="parchment-paragraph">{para}</p>
                  ))}
                </div>

                {/* Clauses */}
                {page.clauses && page.clauses.length > 0 && (
                  <div className="parchment-clauses-wrapper">
                    {page.clauses.map((clause) => {
                      const isHighlighted =
                        highlightedClause === clause.id ||
                        (activeCitation && activeCitation.clauseId === clause.id);

                      return (
                        <div
                          key={clause.id}
                          id={clause.id}
                          className={`legal-clause-box ${isHighlighted ? "citation-highlight-pulse" : ""}`}
                        >
                          <div className="clause-box-header">
                            <span className="clause-tag">
                              Clause {clause.number}: {clause.title}
                            </span>
                            {isHighlighted && (
                              <span className="clause-evidence-pill">
                                <Sparkles size={11} /> Cited Evidence
                              </span>
                            )}
                          </div>
                          <p className="clause-text-content">{clause.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="parchment-footer">
                  <span>CONFIDENTIAL</span>
                  <span>{activeDocument.filename}</span>
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
