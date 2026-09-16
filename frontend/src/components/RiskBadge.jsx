import React from "react";
import { AlertCircle, AlertTriangle, ShieldCheck, Flame } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function RiskBadge({ level = "LOW" }) {
  const { language } = useDocumentContext();
  const t = translations[language] || translations.en;

  const normalized = (level || "LOW").toUpperCase();

  let className = "risk-badge risk-badge-low";
  let label = t.risks.low;
  let Icon = ShieldCheck;

  if (normalized === "MEDIUM") {
    className = "risk-badge risk-badge-medium";
    label = t.risks.medium;
    Icon = AlertTriangle;
  } else if (normalized === "HIGH") {
    className = "risk-badge risk-badge-high";
    label = t.risks.high;
    Icon = AlertCircle;
  } else if (normalized === "CRITICAL") {
    className = "risk-badge risk-badge-critical";
    label = t.risks.critical;
    Icon = Flame;
  }

  return (
    <span className={className}>
      <Icon size={11} strokeWidth={2.5} />
      <span>{label}</span>
    </span>
  );
}
