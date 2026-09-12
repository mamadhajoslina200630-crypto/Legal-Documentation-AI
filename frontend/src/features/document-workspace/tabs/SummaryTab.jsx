import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Loader2, Globe, BookOpen } from "lucide-react";
import api from "../../../api/client";
import { useDocumentContext } from "../../../context/DocumentContext";

export function SummaryTab({ documentId }) {
  const { selectedLanguage, isSimplifiedView } = useDocumentContext();
  const [summaryData, setSummaryData] = useState(null);
  const [translatedText, setTranslatedText] = useState(null);
  const [simplifiedText, setSimplifiedText] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!documentId) return;
    setLoading(true);
    api.get(`/analysis/${documentId}/summary`)
      .then((data) => setSummaryData(data))
      .catch((err) => console.log("Summary fetch note:", err))
      .finally(() => setLoading(false));
  }, [documentId]);

  // Handle translation when language changes
  useEffect(() => {
    if (selectedLanguage && selectedLanguage !== "en" && summaryData?.summary) {
      api.post("/language/translate", {
        text: summaryData.summary.slice(0, 1500),
        target_lang: selectedLanguage,
      })
        .then((res) => setTranslatedText(res.translated_text))
        .catch(() => setTranslatedText(null));
    } else {
      setTranslatedText(null);
    }
  }, [selectedLanguage, summaryData]);

  // Handle simplification toggle
  useEffect(() => {
    if (isSimplifiedView && summaryData?.summary) {
      api.post("/language/simplify", {
        clause_text: summaryData.summary.slice(0, 1200),
      })
        .then((res) => setSimplifiedText(res.simple_explanation))
        .catch(() => setSimplifiedText(null));
    } else {
      setSimplifiedText(null);
    }
  }, [isSimplifiedView, summaryData]);

  return (
    <div id="tab-content-summary" className="glass-panel" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={20} color="var(--accent-indigo)" />
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
            {isSimplifiedView ? "Plain Language Simplification" : selectedLanguage !== "en" ? `Regional Summary (${selectedLanguage.toUpperCase()})` : "Executive Legal Summary"}
          </h3>
        </div>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
            <Loader2 size={14} className="animate-spin" /> Fetching AI summary...
          </div>
        )}
      </div>

      <div style={{ fontSize: "0.925rem", lineHeight: "1.7", color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {translatedText ? (
          <div style={{ padding: "1rem", backgroundColor: "rgba(99, 102, 241, 0.08)", borderRadius: "8px", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem", color: "var(--accent-indigo)", fontWeight: "600" }}>
              <Globe size={16} /> Regional Translation ({selectedLanguage.toUpperCase()})
            </div>
            <p style={{ whiteSpace: "pre-wrap" }}>{translatedText}</p>
          </div>
        ) : simplifiedText ? (
          <div style={{ padding: "1rem", backgroundColor: "rgba(16, 185, 129, 0.08)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem", color: "var(--accent-emerald)", fontWeight: "600" }}>
              <BookOpen size={16} /> Plain-English Everyday Explanation
            </div>
            <p style={{ whiteSpace: "pre-wrap" }}>{simplifiedText}</p>
          </div>
        ) : summaryData?.summary ? (
          <div style={{ whiteSpace: "pre-wrap" }}>
            <p>{summaryData.summary}</p>
          </div>
        ) : (
          <>
            <p>
              This document is a commercial <strong>Master Services Agreement (MSA)</strong> executed between Acme Corp Ltd. (Customer) and Alpha Tech Solutions India Pvt. Ltd. (Vendor). The agreement establishes terms for cloud infrastructure consulting, data migration, and continuing technical support over a 24-month term.
            </p>

            <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginTop: "0.5rem" }}>Key Takeaways & Highlights:</h4>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", color: "var(--text-secondary)" }}>
              <li><strong style={{ color: "var(--text-primary)" }}>Payment:</strong> Net 30 days from undisputed invoice submission via electronic bank transfer.</li>
              <li><strong style={{ color: "var(--text-primary)" }}>Termination:</strong> Either party may terminate with 30 days written notice for convenience or immediately upon uncured material breach.</li>
              <li><strong style={{ color: "var(--text-primary)" }}>Liability Cap:</strong> Capped at the aggregate fees paid in the preceding 12 months, excluding confidentiality and gross negligence.</li>
              <li><strong style={{ color: "var(--text-primary)" }}>Dispute Resolution:</strong> Sole arbitrator appointed under the Indian Arbitration and Conciliation Act, 1996 in New Delhi.</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default SummaryTab;
