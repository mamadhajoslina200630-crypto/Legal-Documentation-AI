import React from "react";
import { FileSearch, Sparkles, AlertTriangle, Languages, FileCheck } from "lucide-react";

export function QuickActions({ onSelectAction }) {
  const actions = [
    { id: "qa-summarize", label: "Summarize Document", icon: Sparkles, prompt: "Generate a concise executive summary with key dates and parties." },
    { id: "qa-risks", label: "Analyze Risks", icon: AlertTriangle, prompt: "Identify all unfavorable clauses, uncapped liabilities, and missing legal protections." },
    { id: "qa-clauses", label: "Extract Clauses", icon: FileSearch, prompt: "Extract and tag all key clauses including indemnity, governing law, and termination." },
    { id: "qa-translate", label: "Regional Translation", icon: Languages, prompt: "Translate the key clauses into Hindi with plain-language explanations." },
    { id: "qa-compliance", label: "Compliance Check", icon: FileCheck, prompt: "Verify compliance against Indian Contract Act and DPDP Act provisions." },
  ];

  return (
    <div id="quick-actions-bar" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            id={act.id}
            onClick={() => onSelectAction && onSelectAction(act.prompt)}
            className="btn btn-secondary"
            style={{ fontSize: "0.8rem", padding: "0.5rem 0.875rem" }}
          >
            <Icon size={14} color="var(--accent-indigo)" />
            {act.label}
          </button>
        );
      })}
    </div>
  );
}

export default QuickActions;
