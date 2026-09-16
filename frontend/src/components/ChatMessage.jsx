import React from "react";
import {
  Scale,
  ArrowUpRight,
  FileText,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Gavel,
  Calendar,
  Users,
  ShieldAlert
} from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";
import RiskBadge from "./RiskBadge";
import TextToSpeech from "./TextToSpeech";
import FileAttachment from "./FileAttachment";

export default function ChatMessage({ message }) {
  const { highlightClause, runServiceAction, activeConversation, language } = useDocumentContext();
  const t = translations[language] || translations.en;

  // 1. If this message is a document attachment
  if (message.type === "attachment") {
    return (
      <div className="chat-message-row">
        <FileAttachment message={message} />
      </div>
    );
  }

  // 2. If user message
  if (message.sender === "user") {
    return (
      <div className="chat-message-row" style={{ alignItems: "flex-end" }}>
        <div className="chat-message-user">
          <p>{message.text}</p>
        </div>
      </div>
    );
  }

  // 3. AI Message
  const activeHighlightId = activeConversation?.activeHighlightId;

  const handleNextActionClick = (action) => {
    if (action.action === "viewSource" && action.clauseId) {
      highlightClause(action.clauseId, action.page);
    } else if (action.action === "focusComposer") {
      const textarea = document.querySelector(".composer-input");
      if (textarea) textarea.focus();
    } else if (action.action === "voice") {
      const micBtn = document.querySelector(".composer-btn.listening") || document.querySelector(".composer-actions .composer-btn");
      if (micBtn) micBtn.click();
    } else if (action.service) {
      runServiceAction(action.service, action.prompt || action.query);
    }
  };

  return (
    <div className="chat-message-row">
      <div className="chat-message-ai">
        {/* Header Lockup */}
        <div className="ai-message-header">
          <div className="ai-avatar-lockup">
            <div className="ai-avatar">
              <Scale size={13} />
            </div>
            <span className="ai-name">LegalAI</span>
            {message.timestamp && <span className="ai-timestamp">{message.timestamp}</span>}
          </div>

          <TextToSpeech
            messageId={message.id}
            textToRead={
              message.structuredSummary
                ? `${message.structuredSummary.overview}`
                : message.structuredJudgment
                ? `${message.structuredJudgment.caseName}. Final decision: ${message.structuredJudgment.finalDecision}`
                : message.text
            }
          />
        </div>

        {/* VARIATION A: Document Auto-Classification & Initial Quick Actions */}
        {message.type === "welcome_actions" && (
          <div className="welcome-actions-card">
            <div className="classification-pill-bar">
              <div className="classification-badge">
                <CheckCircle2 size={13} color="var(--blue-primary)" />
                <span>{message.docType} detected</span>
              </div>
              <span className="classification-submeta">
                {message.totalPages} {t.pages} • {message.language || "English"} • {message.jurisdiction}
              </span>
            </div>

            <p className="welcome-intro-text">{message.text}</p>

            {/* Recommended 2-Column Action Cards (ui_look.md Section 2) */}
            {message.recommendedActions && (
              <div className="action-pill-section">
                <div className="action-section-title">
                  <Sparkles size={12} color="#F59E0B" />
                  <span>{t.recommended}</span>
                </div>
                <div className="welcome-actions-grid">
                  {message.recommendedActions.map((act) => (
                    <button
                      key={act.key}
                      onClick={() => runServiceAction(act.service, act.prompt)}
                      className="welcome-action-card welcome-action-card-primary"
                    >
                      <div className="action-card-top">
                        <span className="action-card-name">{act.label}</span>
                        <ArrowUpRight size={13} className="action-card-arrow" />
                      </div>
                      <span className="action-card-desc">{act.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Other Actions */}
            {message.otherActions && (
              <div className="action-pill-section" style={{ marginTop: "14px" }}>
                <div className="action-section-title">
                  <span>{t.moreActions}</span>
                </div>
                <div className="welcome-actions-grid">
                  {message.otherActions.map((act) => (
                    <button
                      key={act.key}
                      onClick={() => (act.action ? handleNextActionClick(act) : runServiceAction(act.service, act.prompt))}
                      className="welcome-action-card welcome-action-card-secondary"
                    >
                      <div className="action-card-top">
                        <span className="action-card-name">{act.label}</span>
                        <ArrowUpRight size={13} className="action-card-arrow" />
                      </div>
                      <span className="action-card-desc">{act.prompt || act.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VARIATION B: Structured Document Summary */}
        {message.type === "document_summary" && message.structuredSummary && (
          <div className="structured-summary-card">
            <div className="summary-card-header">
              <FileCheck2 size={14} color="var(--blue-primary)" />
              <span className="summary-card-title">{message.title || "LEGAL DOCUMENT SUMMARY"}</span>
            </div>

            <div className="summary-section">
              <div className="summary-sec-title">📌 Overview</div>
              <p className="summary-sec-content">{message.structuredSummary.overview}</p>
            </div>

            {message.structuredSummary.parties && (
              <div className="summary-section">
                <div className="summary-sec-title">👥 Parties</div>
                <div className="summary-parties-list">
                  {message.structuredSummary.parties.map((p, idx) => (
                    <div key={idx} className="party-row">
                      <span className="party-role">{p.role}:</span>
                      <span className="party-name">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {message.structuredSummary.dates && (
              <div className="summary-section">
                <div className="summary-sec-title">📅 Important Dates</div>
                <div className="summary-bullet-grid">
                  {message.structuredSummary.dates.map((d, idx) => (
                    <div key={idx} className="summary-bullet-item">
                      <span className="bullet-label">{d.label}:</span>
                      <span className="bullet-value">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {message.structuredSummary.keyTerms && (
              <div className="summary-section">
                <div className="summary-sec-title">⚖ Key Terms</div>
                <div className="summary-bullet-grid">
                  {message.structuredSummary.keyTerms.map((k, idx) => (
                    <div key={idx} className="summary-bullet-item">
                      <span className="bullet-label">{k.label}:</span>
                      <span className="bullet-value">{k.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VARIATION C: Structured Judgment Analysis */}
        {message.type === "judgment_summary" && message.structuredJudgment && (
          <div className="structured-judgment-card">
            <div className="judgment-card-header">
              <Gavel size={15} color="#818CF8" />
              <span className="judgment-card-title">{message.title || "JUDGMENT UNDERSTANDING"}</span>
            </div>

            <div className="judgment-meta-grid">
              <div className="judgment-meta-item">
                <span className="meta-lbl">📌 Case:</span>
                <span className="meta-val highlight">{message.structuredJudgment.caseName}</span>
              </div>
              <div className="judgment-meta-item">
                <span className="meta-lbl">⚖ Court:</span>
                <span className="meta-val">{message.structuredJudgment.court}</span>
              </div>
              <div className="judgment-meta-item">
                <span className="meta-lbl">👥 Bench:</span>
                <span className="meta-val">{message.structuredJudgment.bench}</span>
              </div>
              <div className="judgment-meta-item">
                <span className="meta-lbl">📚 Citation:</span>
                <span className="meta-val">{message.structuredJudgment.citation}</span>
              </div>
            </div>

            <div className="judgment-divider" />

            <div className="judgment-narrative">
              <div className="judgment-subheading">1. Background</div>
              <p>{message.structuredJudgment.background}</p>

              <div className="judgment-subheading">2. Core Legal Issues</div>
              <p>{message.structuredJudgment.legalIssues}</p>

              <div className="judgment-subheading">3. Court's Reasoning (Ratio Decidendi)</div>
              <p>{message.structuredJudgment.reasoning}</p>

              <div className="judgment-subheading">4. Final Operative Decision</div>
              <p className="judgment-decision-text">{message.structuredJudgment.finalDecision}</p>

              <div className="judgment-subheading">5. Practical Legal Impact</div>
              <p>{message.structuredJudgment.practicalMeaning}</p>
            </div>
          </div>
        )}

        {/* Standard AI text (for risks, plain language, or general answers) */}
        {message.type !== "welcome_actions" &&
          message.type !== "document_summary" &&
          message.type !== "judgment_summary" && (
            <div className="ai-message-body">{message.text}</div>
          )}

        {/* Risk Findings Structured List */}
        {message.riskFindings && message.riskFindings.length > 0 && (
          <div className="risk-findings-section">
            <div className="risk-findings-explainer">
              <ShieldAlert size={13} color="#F97316" />
              <span>{t.riskExplainer}</span>
            </div>

            <div className="risk-findings-list">
              {message.riskFindings.map((finding) => {
                const isSelected = activeHighlightId === finding.clauseId;
                return (
                  <div
                    key={finding.id}
                    onClick={() => highlightClause(finding.clauseId, finding.page)}
                    className={`risk-finding-item ${isSelected ? "active" : ""}`}
                    title={t.clickToViewClause}
                  >
                    <div className="risk-index-box">{finding.id}</div>
                    <div className="risk-finding-content">
                      <div className="risk-finding-header">
                        <span className="risk-finding-title">
                          {finding.clauseNumber ? `${finding.clauseNumber} ` : ""}
                          {finding.title}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <RiskBadge level={finding.riskLevel} />
                          <button
                            type="button"
                            className="btn-view-clause-inline"
                            onClick={(e) => {
                              e.stopPropagation();
                              highlightClause(finding.clauseId, finding.page);
                            }}
                          >
                            <span>{t.viewClauseInDoc}</span>
                            <ArrowUpRight size={11} />
                          </button>
                        </div>
                      </div>
                      <p className="risk-finding-summary">{finding.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clickable Citations & Evidence Pill Bar */}
        {message.citations && message.citations.length > 0 && (
          <div className="ai-sources-bar">
            <span className="sources-label">📚 {t.sourcesEvidence}:</span>
            <div className="citations-pill-list">
              {message.citations.map((cite, idx) => (
                <button
                  key={idx}
                  onClick={() => highlightClause(cite.clauseId, cite.page)}
                  className="citation-pill"
                  title="Jump to original clause in document viewer"
                >
                  <FileText size={11} />
                  <span>{cite.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contextual "What would you like to do next?" Navigation */}
        {message.nextActions && message.nextActions.length > 0 && (
          <div className="ai-next-actions-container">
            <span className="next-actions-prompt">{t.whatNext}</span>
            <div className="next-actions-pills">
              {message.nextActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNextActionClick(action)}
                  className="next-action-pill"
                >
                  <span>{action.label}</span>
                  <ArrowUpRight size={10} className="pill-arrow" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
