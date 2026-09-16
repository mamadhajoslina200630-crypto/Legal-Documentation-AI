import React from "react";
import { X, Award, ShieldCheck, Briefcase, FileCheck, Clock } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function ProfileModal() {
  const { isProfileOpen, setIsProfileOpen, language } = useDocumentContext();
  const t = translations[language] || translations.en;

  if (!isProfileOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsProfileOpen(false)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={16} color="var(--red-primary)" />
            <span className="modal-title">{t.profileModal.title}</span>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="btn-close-modal"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* User Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px",
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#202020",
                border: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)"
              }}
            >
              RK
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                {t.profileModal.name}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {t.profileModal.role}
              </span>
              <span style={{ fontSize: "11px", color: "var(--red-primary)", fontFamily: "var(--font-mono)" }}>
                {t.profileModal.barId}
              </span>
            </div>
          </div>

          {/* Subscription Tier */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              backgroundColor: "rgba(185, 28, 28, 0.08)",
              border: "1px solid rgba(185, 28, 28, 0.25)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={16} color="var(--red-primary)" />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                {t.profileModal.tier}
              </span>
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Active License</span>
          </div>

          {/* Usage Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px"
            }}
          >
            <div
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>142</div>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{t.profileModal.statsAnalyzed}</div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--red-active)" }}>68</div>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{t.profileModal.statsRisks}</div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>320h</div>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{t.profileModal.statsHours}</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => setIsProfileOpen(false)}
            className="btn-primary-action"
          >
            {t.profileModal.close}
          </button>
        </div>
      </div>
    </div>
  );
}
