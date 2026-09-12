import React, { useEffect, useState } from "react";
import DiffView from "./components/DiffView";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { GitCompare, Loader2 } from "lucide-react";
import api from "../../api/client";

export function ComparePage() {
  const [loading, setLoading] = useState(false);
  const [diffData, setDiffData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docA, setDocA] = useState("doc-v1");
  const [docB, setDocB] = useState("doc-v2");

  useEffect(() => {
    api.get("/documents")
      .then((docs) => {
        if (Array.isArray(docs) && docs.length >= 2) {
          setDocuments(docs);
          setDocA(docs[0].id);
          setDocB(docs[1].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleRunComparison = async () => {
    setLoading(true);
    try {
      const res = await api.post("/comparison/documents", {
        doc_a_id: docA,
        doc_b_id: docB,
      });
      setDiffData(res);
    } catch (err) {
      console.error("Comparison error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="compare-page" className="page-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Document Comparison & Redline</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Compare clauses between two contracts or detect modifications between document revisions.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {documents.length >= 2 && (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <select
                value={docA}
                onChange={(e) => setDocA(e.target.value)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  color: "var(--text-primary)",
                  padding: "0.4rem 0.6rem",
                  fontSize: "0.85rem",
                }}
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id} style={{ backgroundColor: "#1e1e24" }}>{d.filename}</option>
                ))}
              </select>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>vs</span>
              <select
                value={docB}
                onChange={(e) => setDocB(e.target.value)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  color: "var(--text-primary)",
                  padding: "0.4rem 0.6rem",
                  fontSize: "0.85rem",
                }}
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id} style={{ backgroundColor: "#1e1e24" }}>{d.filename}</option>
                ))}
              </select>
            </div>
          )}
          <Button
            id="btn-run-comparison"
            icon={loading ? Loader2 : GitCompare}
            onClick={handleRunComparison}
            disabled={loading}
          >
            {loading ? "Comparing..." : "Run Redline Comparison"}
          </Button>
        </div>
      </div>

      <Card
        id="card-comparison-results"
        title="Comparison Summary"
        subtitle={diffData ? diffData.diff_summary : "Comparing Agreement_v1.pdf vs. Agreement_v2_final.pdf"}
      >
        <DiffView diffItems={diffData?.diff_items} />
      </Card>
    </div>
  );
}

export default ComparePage;
