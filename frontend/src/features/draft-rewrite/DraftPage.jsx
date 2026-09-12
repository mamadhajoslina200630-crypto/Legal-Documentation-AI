import React, { useState } from "react";
import ClauseEditor from "./components/ClauseEditor";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { Plus, FileText, X, Sparkles, Loader2, Download } from "lucide-react";
import api from "../../api/client";

export function DraftPage() {
  const [showModal, setShowModal] = useState(false);
  const [agreementType, setAgreementType] = useState("Non-Disclosure Agreement (NDA)");
  const [parties, setParties] = useState("Alpha Innovations Pvt Ltd & Beta Tech Solutions Ltd");
  const [keyTerms, setKeyTerms] = useState("24 months term, bilateral confidentiality, INR 25 Lakh liquidated damages for breach, New Delhi jurisdiction");
  const [loading, setLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/drafting/generate", {
        agreement_type: agreementType,
        parties,
        key_terms: keyTerms,
        jurisdiction: "India",
      });
      setGeneratedDraft(res);
      setShowModal(false);
    } catch (err) {
      console.error("Draft generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="draft-page" className="page-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Drafting & Clause Rewriting</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Generate bespoke contracts under Indian Law or fine-tune clauses to eliminate legal vulnerabilities.
          </p>
        </div>
        <Button id="btn-create-contract" icon={Plus} onClick={() => setShowModal(true)}>
          New Agreement Draft
        </Button>
      </div>

      {generatedDraft && (
        <Card
          id="card-generated-draft"
          title={generatedDraft.title}
          subtitle={`Generated Contract Draft under Indian Law`}
        >
          <div style={{ padding: "1rem", backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.875rem", lineHeight: "1.65", color: "var(--text-primary)" }}>
              {generatedDraft.content}
            </pre>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: generatedDraft ? "1.5rem" : "0" }}>
        <Card id="card-clause-editor" title="Clause Rewriter" subtitle="Make clauses protective, balanced, or strictly pro-customer">
          <ClauseEditor />
        </Card>
      </div>

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}>
          <div className="glass-panel" style={{ width: "550px", maxWidth: "90vw", padding: "1.75rem", borderRadius: "12px", border: "1px solid var(--border-active)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={20} color="var(--accent-indigo)" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: "600" }}>Generate Legal Agreement</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.3rem", color: "var(--text-secondary)" }}>
                  Agreement Type:
                </label>
                <select
                  value={agreementType}
                  onChange={(e) => setAgreementType(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "6px",
                    color: "var(--text-primary)",
                    padding: "0.6rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="Non-Disclosure Agreement (NDA)" style={{ backgroundColor: "#1e1e24" }}>Non-Disclosure Agreement (NDA)</option>
                  <option value="Master Services Agreement (MSA)" style={{ backgroundColor: "#1e1e24" }}>Master Services Agreement (MSA)</option>
                  <option value="Independent Contractor Agreement" style={{ backgroundColor: "#1e1e24" }}>Independent Contractor Agreement</option>
                  <option value="Commercial Lease Agreement" style={{ backgroundColor: "#1e1e24" }}>Commercial Lease Agreement</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.3rem", color: "var(--text-secondary)" }}>
                  Contracting Parties:
                </label>
                <input
                  type="text"
                  value={parties}
                  onChange={(e) => setParties(e.target.value)}
                  placeholder="e.g. Acme Corp & Beta Ltd"
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "6px",
                    color: "var(--text-primary)",
                    padding: "0.6rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.3rem", color: "var(--text-secondary)" }}>
                  Key Commercial Terms:
                </label>
                <textarea
                  rows={3}
                  value={keyTerms}
                  onChange={(e) => setKeyTerms(e.target.value)}
                  placeholder="Duration, payments, liabilities, dispute resolution..."
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "6px",
                    color: "var(--text-primary)",
                    padding: "0.6rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} icon={loading ? Loader2 : Sparkles}>
                  {loading ? "Generating Draft..." : "Generate Draft"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DraftPage;
