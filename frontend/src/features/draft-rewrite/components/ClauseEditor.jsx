import React, { useState } from "react";
import Button from "../../../components/Button";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import api from "../../../api/client";

export function ClauseEditor() {
  const [originalClause, setOriginalClause] = useState(
    "Vendor shall defend, indemnify and hold harmless Customer from all third-party claims, liabilities, and damages of every kind without monetary ceiling."
  );
  const [rewrittenClause, setRewrittenClause] = useState(
    "Vendor shall defend and indemnify Customer from direct third-party IP infringement damages, subject strictly to the aggregate liability ceiling equal to 12 months fees paid, excluding indirect and consequential losses."
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    setLoading(true);
    try {
      const res = await api.post("/drafting/rewrite", {
        clause_text: originalClause,
        target_party: "Vendor",
        objective: "Balance liability and add standard cap",
      });
      if (res.rewritten_clause) {
        setRewrittenClause(res.rewritten_clause);
      }
    } catch (err) {
      console.error("Rewrite error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="clause-editor-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
      <div className="glass-panel" style={{ padding: "1.25rem" }}>
        <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem" }}>Original Clause</h4>
        <textarea
          id="original-clause-textarea"
          value={originalClause}
          onChange={(e) => setOriginalClause(e.target.value)}
          rows={7}
          style={{
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "0.75rem",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            resize: "vertical",
            outline: "none",
          }}
        />
        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
          <Button
            size="sm"
            icon={loading ? Loader2 : Sparkles}
            id="btn-rewrite-clause"
            onClick={handleRewrite}
            disabled={loading}
          >
            {loading ? "Rewriting..." : "AI Rewrite Clause"}
          </Button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>Balanced AI Suggestion</h4>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
            id="btn-copy-suggestion"
          >
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <textarea
          id="rewritten-clause-textarea"
          value={rewrittenClause}
          onChange={(e) => setRewrittenClause(e.target.value)}
          rows={7}
          style={{
            width: "100%",
            backgroundColor: "rgba(99, 102, 241, 0.05)",
            border: "1px solid var(--border-active)",
            borderRadius: "8px",
            padding: "0.75rem",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            resize: "vertical",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}

export default ClauseEditor;
