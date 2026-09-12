import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Maximize2,
  Minimize2,
  ExternalLink,
  Highlighter,
  CheckCircle2,
  Scale,
  Sparkles,
  BookOpen,
  X
} from "lucide-react";
import { useDocumentContext, SAMPLE_DOCUMENTS } from "../../../context/DocumentContext";

export function DocumentViewer() {
  const {
    activeDocument,
    setActiveDocument,
    activeCitation,
    setActiveCitation,
    viewMode,
    setViewMode,
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

  if (!activeDocument) {
    return (
      <div className="doc-viewer-empty-state">
        <div className="doc-empty-icon-ring">
          <FileText size={32} color="#10a37f" />
        </div>
        <h3>No Document Selected</h3>
        <p>Select or upload a contract, lease, or court order to view page evidence and original text.</p>
        <div className="doc-sample-pills">
          <span className="doc-sample-label">Or test with demo documents:</span>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {SAMPLE_DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocument(doc)}
                className="doc-sample-btn"
              >
                <Scale size={13} />
                <span>{doc.filename}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pages = activeDocument.pages || SAMPLE_DOCUMENTS[0].pages;
  const totalPages = activeDocument.totalPages || pages.length;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(150, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(70, z - 10));

  return (
    <div className="doc-viewer-container" id="document-viewer-column">
      {/* Top Toolbar */}
      <div className="doc-viewer-toolbar">
        <div className="doc-title-group">
          <div className="doc-badge-type">
            <Scale size={13} color="#10a37f" />
            <span>{activeDocument.docType || "Legal Document"}</span>
          </div>
          <span className="doc-filename-display" title={activeDocument.filename}>
            {activeDocument.filename}
          </span>
        </div>

        <div className="doc-toolbar-controls">
          {/* Search inside Document */}
          <div className="doc-search-box">
            <Search size={13} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Find in document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="doc-search-clear">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Page Selector */}
          <div className="doc-page-stepper">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="doc-nav-btn"
              title="Previous Page"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="doc-page-counter">
              Page <strong>{currentPage}</strong> of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="doc-nav-btn"
              title="Next Page"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="doc-zoom-stepper">
            <button onClick={handleZoomOut} className="doc-nav-btn" title="Zoom Out">
              <ZoomOut size={14} />
            </button>
            <span className="doc-zoom-label">{zoomLevel}%</span>
            <button onClick={handleZoomIn} className="doc-nav-btn" title="Zoom In">
              <ZoomIn size={14} />
            </button>
          </div>

          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === "doc-only" ? "split" : "doc-only")}
            className="doc-nav-btn"
            title={viewMode === "doc-only" ? "Restore Split View" : "Maximize Document"}
          >
            {viewMode === "doc-only" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Active Citation Notification Banner */}
      {activeCitation && (
        <div className="citation-floating-alert">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Highlighter size={14} color="#f59e0b" />
            <span>
              Citing <strong>Page {activeCitation.page}</strong>
              {activeCitation.clauseNumber ? ` · Clause ${activeCitation.clauseNumber}` : ""}
            </span>
          </div>
          <button
            onClick={() => setActiveCitation(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Document Pages Canvas */}
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
                {/* Official Page Header */}
                <div className="parchment-header">
                  <div className="parchment-jurisdiction">
                    {activeDocument.jurisdiction || "LEGAL DOCUMENT INTELLIGENCE"}
                  </div>
                  <div className="parchment-page-num">
                    Page {page.pageNumber} of {totalPages}
                  </div>
                </div>

                <div className="parchment-divider"></div>

                {/* Page Title */}
                {page.title && (
                  <h4 className="parchment-section-title">
                    {page.title}
                  </h4>
                )}

                {/* Legal Text Content */}
                <div className="parchment-text-body">
                  {page.content.split("\n\n").map((para, pIdx) => (
                    <p key={pIdx} className="parchment-paragraph">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Structured Clauses with Citation Anchors */}
                {page.clauses && page.clauses.length > 0 && (
                  <div className="parchment-clauses-wrapper">
                    {page.clauses.map((clause) => {
                      const isHighlighted =
                        highlightedClause === clause.id ||
                        (activeCitation && activeCitation.clauseId === clause.id) ||
                        (activeCitation && activeCitation.page === page.pageNumber && !activeCitation.clauseId);

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

                {/* Page Footer Watermark */}
                <div className="parchment-footer">
                  <span>CONFIDENTIAL & LEGAL PRIVILEGE</span>
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
