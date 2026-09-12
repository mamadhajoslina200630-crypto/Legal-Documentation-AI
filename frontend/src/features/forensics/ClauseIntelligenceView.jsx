import React, { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  FileText,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Scale
} from "lucide-react";
import { useDocumentContext } from "../../context/DocumentContext";

export function ClauseIntelligenceView({ onSelectCitation }) {
  const { activeDocument, selectedLanguage } = useDocumentContext();
  const isTamil = selectedLanguage === "ta";

  const [expandedId, setExpandedId] = useState("clause-07");

  const CLAUSE_INTELLIGENCE_ITEMS = [
    {
      id: "clause-07",
      number: "CLAUSE 07",
      titleEn: "TERMINATION & LIQUIDATED DAMAGES",
      titleTa: "ஒப்பந்த முறிவு & அபராதம்",
      riskLevel: "HIGH",
      riskScore: 87,
      interpretationEn:
        "This provision restricts your right to terminate the contract before the 24-month lock-in period expires. If you vacate early for any business reason, you must immediately pay all remaining gross rent as liquidated damages.",
      interpretationTa:
        "இந்த விதி 24 மாதங்களுக்குள் ஒப்பந்தத்தை முறிக்க தடை விதிக்கிறது. முன்கூட்டியே வெளியேறினால் எஞ்சிய அனைத்து மாதங்களின் வாடகையையும் இழப்பீடாக ஒரே தவணையில் செலுத்த வேண்டும்.",
      potentialImpactEn:
        "Severe cash-flow exposure. Even in the event of landlord default or economic downturn, your company would owe up to INR 84,00,000 in unmitigated damages with no provision for duty to mitigate losses.",
      potentialImpactTa:
        "கடுமையான நிதி இழப்பு அபாயம். வணிக இழப்பு அல்லது உரிமையாளர் குறைபாடுகள் இருந்தாலும் உங்கள் நிறுவனம் அதிகபட்சமாக ரூ. 84,00,000 வரை செலுத்த வேண்டிய கட்டாயம் ஏற்படலாம்.",
      recommendedActionEn:
        "Consult legal counsel to insert a mutual termination clause with a standard 60-day notice and a reasonable cap on early termination fee (maximum 2 to 3 months' rent instead of the entire lock-in balance).",
      recommendedActionTa:
        "முழுத் தொகையை செலுத்துவதற்குப் பதிலாக, 60 நாட்கள் முன்னறிவிப்புடன் அதிகபட்சம் 2-3 மாத வாடகையுடன் வெளியேறும் வகையில் விதியை திருத்த வழக்கறிஞரிடம் ஆலோசிக்கவும்.",
      citation: { page: 9, clauseId: "clause-14" },
    },
    {
      id: "clause-05",
      number: "CLAUSE 05",
      titleEn: "SECURITY DEPOSIT FORFEITURE",
      titleTa: "பாதுகாப்பு வைப்புத் தொகை பறிமுதல்",
      riskLevel: "HIGH",
      riskScore: 78,
      interpretationEn:
        "Lessor claims absolute discretion to forfeit the entire security deposit of INR 21,00,000 without requiring judicial proof of actual damages or independent appraisal.",
      interpretationTa:
        "உண்மையான சேதத்தை நிரூபிக்காமல், ரூ. 21,00,000 பாதுகாப்பு வைப்புத் தொகையை முழுமையாக பறிமுதல் செய்ய உரிமையாளருக்கு முழு அதிகாரம் வழங்குகிறது.",
      potentialImpactEn:
        "Risk of total deposit loss over minor wear-and-tear or subjective disputes over premises handover condition.",
      potentialImpactTa:
        "சிறு சேதங்கள் அல்லது கருத்து வேறுபாடுகளுக்காக முழு வைப்புத்தொகையையும் இழக்கும் அபாயம் உள்ளது.",
      recommendedActionEn:
        "Demand joint pre-inspection protocols and escrow holding by a neutral third party, limiting forfeiture strictly to proven actual repairs.",
      recommendedActionTa:
        "இருதரப்பு ஆய்வு நெறிமுறைகளைச் சேர்க்கவும், உண்மையான பழுதுபார்ப்புச் செலவுகளுக்கு மட்டுமே பிடித்தம் செய்ய நிபந்தனை விதிக்கவும்.",
      citation: { page: 3, clauseId: "clause-5" },
    },
    {
      id: "clause-18",
      number: "CLAUSE 18",
      titleEn: "UNILATERAL ARBITRATOR APPOINTMENT",
      titleTa: "ஒருதலைப்பட்ச நடுவர் நியமனம்",
      riskLevel: "CRITICAL",
      riskScore: 92,
      interpretationEn:
        "The dispute clause gives the Lessor sole prerogative to appoint an arbitrator in any conflict, denying mutual consensus or institutional appointment.",
      interpretationTa:
        "சர்ச்சைகள் ஏற்பட்டால் நடுவரை நியமிக்கும் முழு அதிகாரத்தையும் உரிமையாளருக்கு மட்டுமே அளிக்கிறது, இது நடுநிலைமைக்கு எதிரானது.",
      potentialImpactEn:
        "High risk of biased arbitration awards. Although unenforceable under Section 12(5) per Supreme Court precedents, it forces expensive preliminary litigation to quash the panel.",
      potentialImpactTa:
        "ஒருதலைப்பட்ச தீர்ப்பு வரும் ஆபத்து. இது சட்டவிரோதமானது என்றாலும் நீதிமன்றத்தில் முறையிட கூடுதல் செலவாகும்.",
      recommendedActionEn:
        "Replace with institutional arbitration (e.g. DIAC or MCIA rules) where the presiding arbitrator is chosen by mutual consent or by the arbitral institution.",
      recommendedActionTa:
        "இருதரப்பு ஒப்புதலுடன் அல்லது அதிகாரப்பூர்வ நடுவர் மன்றம் (DIAC) மூலம் நடுவரை நியமிக்க பரிந்துரைக்கவும்.",
      citation: { page: 12, clauseId: "clause-18" },
    },
    {
      id: "clause-01",
      number: "CLAUSE 01",
      titleEn: "PREMISES & USE RESTRICTION",
      titleTa: "சொத்து & பயன்பாட்டு வரம்பு",
      riskLevel: "SAFE",
      riskScore: 24,
      interpretationEn:
        "Standard commercial office use clause for IT and software development services within authorized municipal building guidelines.",
      interpretationTa:
        "அங்கீகரிக்கப்பட்ட தகவல் தொழில்நுட்ப அலுவலகப் பணிகளுக்காக சொத்தை பயன்படுத்துவதற்கான நிலையான விதிமுறை.",
      potentialImpactEn:
        "Negligible risk under normal operating parameters.",
      potentialImpactTa:
        "வழக்கமான செயல்பாடுகளில் எந்தவொரு ஆபத்தும் இல்லை.",
      recommendedActionEn:
        "Ensure commercial sub-leasing or remote-work occupancy rights are explicitly protected if your team scales.",
      recommendedActionTa:
        "எதிர்காலத்தில் குழு வளரும்போது துணை குத்தகை அல்லது தொலைதூர வேலை உரிமைகளை உறுதிப்படுத்திக் கொள்ளுங்கள்.",
      citation: { page: 1, clauseId: "clause-1" },
    }
  ];

  return (
    <div className="clause-intel-container">
      {/* Header */}
      <div className="clause-intel-header">
        <div>
          <div className="font-mono-tech text-crimson">[ CLAUSE FORENSICS // AUDIT STREAM ]</div>
          <h3 className="clause-intel-title">
            {isTamil ? "விதிமுறைகளின் சட்ட ஆய்வு" : "CLAUSE INTELLIGENCE"}
          </h3>
          <p className="clause-intel-subtitle">
            {isTamil
              ? "ஒப்பந்தத்தின் முக்கிய பிரிவுகள், அபாய மதிப்பீடுகள் மற்றும் வழக்கறிஞர் பரிந்துரைகள்."
              : "Deep forensic breakdown of critical contractual terms and liability exposure."}
          </p>
        </div>
      </div>

      {/* Cards List */}
      <div className="clause-cards-list">
        {CLAUSE_INTELLIGENCE_ITEMS.map((item) => {
          const isExpanded = expandedId === item.id;
          const isCritical = item.riskLevel === "CRITICAL";
          const isHigh = item.riskLevel === "HIGH";

          return (
            <div
              key={item.id}
              className={`clause-forensic-card ${isExpanded ? "expanded" : ""}`}
            >
              {/* Card Header Accordion Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="clause-card-bar"
              >
                <div className="card-bar-left">
                  <span className="clause-index-tag font-mono-tech">[{item.number}]</span>
                  <span className="clause-heading-title">{isTamil ? item.titleTa : item.titleEn}</span>
                </div>

                <div className="card-bar-right">
                  <span
                    className="clause-risk-badge font-mono-tech"
                    style={{
                      backgroundColor: isCritical ? "rgba(229, 9, 20, 0.15)" : isHigh ? "rgba(179, 0, 0, 0.18)" : "rgba(71, 85, 105, 0.2)",
                      color: isCritical ? "#E50914" : isHigh ? "#B30000" : "#8A8A8A",
                      borderColor: isCritical ? "#E50914" : isHigh ? "#B30000" : "transparent"
                    }}
                  >
                    {item.riskLevel}
                  </span>

                  {/* Horizontal Risk Meter Pill */}
                  <div className="compact-meter-pill">
                    <div className="meter-track">
                      <div
                        className="meter-fill"
                        style={{
                          width: `${item.riskScore}%`,
                          backgroundColor: isCritical ? "#E50914" : isHigh ? "#B30000" : "#475569"
                        }}
                      />
                    </div>
                    <span className="meter-num font-mono-tech" style={{ color: isCritical ? "#E50914" : isHigh ? "#B30000" : "#8A8A8A" }}>
                      {item.riskScore}/100
                    </span>
                  </div>

                  <div className="accordion-toggle-arrow">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="clause-expanded-content">
                  {/* Circular/Large Risk Score Visualizer */}
                  <div className="clause-score-banner">
                    <div className="score-meter-large">
                      <div className="score-meter-box">
                        <span className="score-lg-value font-mono-tech" style={{ color: isCritical ? "#E50914" : isHigh ? "#B30000" : "#8A8A8A" }}>
                          {item.riskScore}
                        </span>
                        <span className="score-lg-denom font-mono-tech">/ 100</span>
                      </div>
                      <div className="score-bar-horizontal">
                        <div
                          className="score-bar-fill"
                          style={{
                            width: `${item.riskScore}%`,
                            backgroundColor: isCritical ? "#E50914" : isHigh ? "#B30000" : "#475569"
                          }}
                        />
                      </div>
                    </div>
                    <div className="score-banner-text">
                      <span className="font-mono-tech score-alert-label">
                        {isCritical ? "CRITICAL VULNERABILITY DETECTED" : isHigh ? "HIGH RISK FACTOR DETECTED" : "STANDARD LOW RISK PROVISION"}
                      </span>
                      <span className="score-alert-sub">Evaluated under Indian Contract Act, 1872 jurisprudence</span>
                    </div>
                  </div>

                  {/* Section 1: AI Interpretation */}
                  <div className="clause-detail-block">
                    <div className="detail-block-heading font-mono-tech">
                      [ AI INTERPRETATION // PLAIN LANGUAGE ]
                    </div>
                    <p className="detail-block-body">
                      {isTamil ? item.interpretationTa : item.interpretationEn}
                    </p>
                  </div>

                  {/* Section 2: Potential Impact */}
                  <div className="clause-detail-block impact-block">
                    <div className="detail-block-heading font-mono-tech text-crimson">
                      [ POTENTIAL IMPACT // COMMERCIAL EXPOSURE ]
                    </div>
                    <p className="detail-block-body">
                      {isTamil ? item.potentialImpactTa : item.potentialImpactEn}
                    </p>
                  </div>

                  {/* Section 3: Recommended Action */}
                  <div className="clause-detail-block advice-block">
                    <div className="detail-block-heading font-mono-tech text-gold">
                      [ RECOMMENDED ACTION // ADVISORY NOTICE ]
                    </div>
                    <p className="detail-block-body">
                      {isTamil ? item.recommendedActionTa : item.recommendedActionEn}
                    </p>
                  </div>

                  {/* Footer Jump to Document */}
                  <div className="clause-card-footer">
                    <button
                      onClick={() => onSelectCitation && onSelectCitation(item.citation)}
                      className="btn-inspect-citation font-mono-tech"
                    >
                      <ExternalLink size={13} />
                      <span>{isTamil ? "ஆவணத்தில் காண்க (Page " + item.citation.page + ")" : "INSPECT IN DOCUMENT (Page " + item.citation.page + ")"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClauseIntelligenceView;
