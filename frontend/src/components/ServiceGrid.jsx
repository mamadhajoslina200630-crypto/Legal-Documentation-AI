import React from "react";
import {
  FileText,
  FileCheck2,
  Search,
  AlertTriangle,
  Languages,
  MessageSquare,
  Scale,
  GitCompare
} from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function ServiceGrid({ compact = false }) {
  const { language, runServiceAction, activeConversation } = useDocumentContext();
  const t = translations[language] || translations.en;

  // The 8 canonical services with clean icons
  const SERVICES = [
    {
      key: "understand",
      icon: FileText,
      name: t.services.understand.name,
      desc: t.services.understand.desc
    },
    {
      key: "summarize",
      icon: FileCheck2,
      name: t.services.summarize.name,
      desc: t.services.summarize.desc
    },
    {
      key: "keyInfo",
      icon: Search,
      name: t.services.keyInfo.name,
      desc: t.services.keyInfo.desc
    },
    {
      key: "detectRisks",
      icon: AlertTriangle,
      name: t.services.detectRisks.name,
      desc: t.services.detectRisks.desc
    },
    {
      key: "simplify",
      icon: Languages,
      name: t.services.simplify.name,
      desc: t.services.simplify.desc
    },
    {
      key: "askDoc",
      icon: MessageSquare,
      name: t.services.askDoc.name,
      desc: t.services.askDoc.desc
    },
    {
      key: "judgment",
      icon: Scale,
      name: t.services.judgment.name,
      desc: t.services.judgment.desc
    },
    {
      key: "compare",
      icon: GitCompare,
      name: t.services.compare.name,
      desc: t.services.compare.desc
    }
  ];

  const handleSelectService = (key) => {
    runServiceAction(key);
  };

  return (
    <div className={compact ? "services-compact-wrapper" : "services-grid-container"}>
      <div className="services-grid" role="group" aria-label="Legal Services">
        {SERVICES.map((srv) => {
          const Icon = srv.icon;
          return (
            <button
              key={srv.key}
              onClick={() => handleSelectService(srv.key)}
              className="service-card"
              title={srv.desc}
            >
              <div className="service-header">
                <span className="service-name">{srv.name}</span>
                <Icon size={compact ? 13 : 15} className="service-icon" />
              </div>
              {!compact && <span className="service-desc">{srv.desc}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
