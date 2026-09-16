import React from "react";
import { FileText, CheckCircle2, Loader2, SplitSquareVertical, Check } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function FileAttachment({ message }) {
  const { toggleSplitView, activeConversation, language } = useDocumentContext();
  const t = translations[language] || translations.en;

  const status = message.status || "ready";
  const isReady = status === "ready";
  const isSplitOpen = activeConversation?.isSplitViewOpen;

  // Multi-step verification steps order
  const steps = [
    { key: "received", label: t.verification?.received || "Document received" },
    { key: "reading", label: t.verification?.reading || "Reading document" },
    { key: "identifying", label: t.verification?.identifying || "Identifying structure & classification" },
    { key: "understanding", label: t.verification?.understanding || "Understanding legal clauses" }
  ];

  const statusIndexMap = {
    received: 0,
    reading: 1,
    identifying: 2,
    understanding: 3,
    ready: 4
  };

  const currentStepIndex = statusIndexMap[status] ?? 4;

  return (
    <div className="file-attachment-card">
      <div className="attachment-left">
        <div className="attachment-icon-box">
          <FileText size={18} />
        </div>
        <div className="attachment-meta">
          <span className="attachment-name">{message.filename}</span>

          {isReady ? (
            <div className="attachment-details">
              <span className="badge-ready">
                <CheckCircle2 size={11} color="var(--blue-primary)" />
                {t.analysisComplete}
              </span>
              <span>•</span>
              <span>
                {message.pages} {t.pages}
              </span>
              <span>•</span>
              <span>
                {message.clauses} {t.clauses}
              </span>
              <span>•</span>
              <span>{message.format || "PDF"}</span>
            </div>
          ) : (
            <div className="attachment-progress-checklist">
              {steps.map((step, idx) => {
                const isPast = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={step.key}
                    className={`progress-step-item ${isPast ? "step-done" : isCurrent ? "step-active" : "step-pending"}`}
                  >
                    {isPast ? (
                      <span className="step-icon-done">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    ) : isCurrent ? (
                      <Loader2 size={10} className="spin" color="var(--blue-primary)" />
                    ) : (
                      <span className="step-bullet" />
                    )}
                    <span className="step-text">{step.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {isReady && (
        <div className="attachment-right">
          <button
            onClick={() => toggleSplitView()}
            className={`btn-open-split-inline ${isSplitOpen ? "active" : ""}`}
            title={isSplitOpen ? t.closeSplitView : t.splitView}
          >
            <SplitSquareVertical size={13} />
            <span>{isSplitOpen ? t.closeSplitView : t.splitView}</span>
          </button>
        </div>
      )}
    </div>
  );
}
