import React, { useState } from "react";
import { X, Sliders, Shield, Cpu, Scale } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, language } = useDocumentContext();
  const t = translations[language] || translations.en;

  const [jurisdiction, setJurisdiction] = useState("india");
  const [aiModel, setAiModel] = useState("gemini-legal-flash");
  const [citationMode, setCitationMode] = useState("grounded");

  if (!isSettingsOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sliders size={16} color="var(--red-primary)" />
            <span className="modal-title">{t.settingsModal.title}</span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="btn-close-modal"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Jurisdiction */}
          <div className="modal-section">
            <label className="modal-label">{t.settingsModal.jurisdiction}</label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="modal-select"
            >
              <option value="india">India (Supreme Court & High Courts · Contract Act, 1872)</option>
              <option value="us">United States (Federal & Delaware Commercial Law)</option>
              <option value="uk">United Kingdom (England & Wales Commercial Courts)</option>
              <option value="sg">Singapore (SIAC & Commercial Code)</option>
            </select>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              {t.settingsModal.jurisdictionDesc}
            </span>
          </div>

          {/* AI Intelligence Model */}
          <div className="modal-section">
            <label className="modal-label">{t.settingsModal.aiModel}</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="modal-select"
            >
              <option value="gemini-legal-flash">LegalAI Reasoning Engine v2.4 (Optimized for Contracts)</option>
              <option value="claude-sonnet-legal">Claude 3.7 Sonnet Legal Specialization</option>
              <option value="gpt4o-legal">GPT-4o Enterprise Legal Assistant</option>
            </select>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              {t.settingsModal.aiModelDesc}
            </span>
          </div>

          {/* Citation Style */}
          <div className="modal-section">
            <label className="modal-label">{t.settingsModal.citationStyle}</label>
            <select
              value={citationMode}
              onChange={(e) => setCitationMode(e.target.value)}
              className="modal-select"
            >
              <option value="grounded">Grounded Pinpoint Citations (Clause + Paragraph number)</option>
              <option value="bluebook">Standard Bluebook / OSCOLA Format</option>
              <option value="plain">Plain Conversational Citations</option>
            </select>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              {t.settingsModal.citationStyleDesc}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="btn-primary-action"
          >
            {t.settingsModal.save}
          </button>
        </div>
      </div>
    </div>
  );
}
