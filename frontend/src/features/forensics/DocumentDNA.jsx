import React from "react";
import {
  Fingerprint,
  FileCheck2,
  Binary,
  Layers,
  Users2,
  CalendarClock,
  ShieldCheck,
  Compass,
  Zap,
  Lock,
  Copy,
  Check
} from "lucide-react";
import { useDocumentContext } from "../../context/DocumentContext";

export function DocumentDNA() {
  const { activeDocument, selectedLanguage, caseId, aiConfidence } = useDocumentContext();
  const isTamil = selectedLanguage === "ta";
  const [copiedHash, setCopiedHash] = React.useState(false);

  const docHash = "SHA256: 4f8b9e1c2a0349f7b6d1829e01f54318c4e0987ad029bf31a679234857ef091a";

  const handleCopyHash = () => {
    navigator.clipboard.writeText(docHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const DNA_METRICS = [
    { labelEn: "DOCUMENT TYPE", labelTa: "ஆவண வகை", value: activeDocument?.docType || "Commercial Lease Agreement", icon: FileCheck2 },
    { labelEn: "TOTAL PAGES", labelTa: "மொத்த பக்கங்கள்", value: `${activeDocument?.totalPages || 14} Pages (Indexed)`, icon: Layers },
    { labelEn: "CLAUSES PARSED", labelTa: "பிரித்தெடுக்கப்பட்ட விதிகள்", value: "24 Clauses / 5 Operational", icon: Binary },
    { labelEn: "IDENTIFIED ENTITIES", labelTa: "சம்பந்தப்பட்ட நிறுவனங்கள்", value: "Horizon Properties Pvt Ltd vs Nexatech Solutions", icon: Users2 },
    { labelEn: "ACTIVE OBLIGATIONS", labelTa: "செயலில் உள்ள கடமைகள்", value: "18 Contractual Terms", icon: ShieldCheck },
    { labelEn: "CRITICAL DEADLINES", labelTa: "முக்கிய காலக்கெடு", value: "3 Notice / Vacation Timelines", icon: CalendarClock },
    { labelEn: "RISK SIGNALS", labelTa: "ஆபத்து சிக்னல்கள்", value: "5 High / Critical Signals", icon: Zap, isRisk: true },
    { labelEn: "GOVERNING JURISDICTION", labelTa: "சட்ட எல்லை", value: activeDocument?.jurisdiction || "India (Transfer of Property Act, 1882)", icon: Compass },
    { labelEn: "AI FORENSIC CONFIDENCE", labelTa: "AI நம்பகத்தன்மை", value: `${aiConfidence} (Ground Truth Verified)`, icon: Fingerprint, isHighlighted: true },
  ];

  return (
    <div className="doc-dna-container">
      {/* Top Banner Forensic Hash & Barcode */}
      <div className="dna-hero-card">
        <div className="dna-card-header">
          <div className="dna-title-row">
            <div className="dna-icon-badge">
              <Fingerprint size={20} color="#B30000" />
            </div>
            <div>
              <div className="dna-eyebrow font-mono-tech">[ FORENSIC DIGITAL PROFILE ]</div>
              <h3 className="dna-main-title">DOCUMENT DNA</h3>
            </div>
          </div>
          <div className="dna-badge-pill font-mono-tech">
            <Lock size={12} color="#10B981" />
            <span>CONFIDENTIAL FORENSIC DOSSIER</span>
          </div>
        </div>

        {/* Technical Barcode Visualization */}
        <div className="dna-barcode-canvas">
          <div className="barcode-bars-strip">
            {Array.from({ length: 64 }).map((_, i) => (
              <span
                key={i}
                className="barcode-bar"
                style={{
                  height: `${28 + ((i * 7 + 13) % 36)}px`,
                  opacity: i % 5 === 0 ? 1 : i % 3 === 0 ? 0.75 : 0.45,
                  backgroundColor: i % 9 === 0 ? "#E50914" : i % 4 === 0 ? "#B30000" : "#8A8A8A",
                  width: i % 6 === 0 ? "3px" : "1.5px"
                }}
              />
            ))}
          </div>
          <div className="barcode-meta-row font-mono-tech">
            <span>DIGITAL CHECKSUM: {docHash.slice(0, 36)}...</span>
            <button onClick={handleCopyHash} className="btn-copy-hash font-mono-tech">
              {copiedHash ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
              <span>{copiedHash ? "COPIED" : "COPY HASH"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Grid of 9 Metrics */}
      <div className="dna-metrics-grid">
        {DNA_METRICS.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className={`dna-metric-card ${metric.isRisk ? "risk-card" : ""} ${metric.isHighlighted ? "highlight-card" : ""}`}
            >
              <div className="metric-card-top">
                <span className="metric-tag font-mono-tech">
                  [ 0{idx + 1} // {isTamil ? metric.labelTa : metric.labelEn} ]
                </span>
                <Icon size={14} color={metric.isRisk ? "#E50914" : metric.isHighlighted ? "#B30000" : "#8A8A8A"} />
              </div>
              <div className="metric-value-display">
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DocumentDNA;
