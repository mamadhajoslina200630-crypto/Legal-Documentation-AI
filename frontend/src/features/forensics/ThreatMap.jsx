import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  DollarSign,
  Clock,
  Lock,
  Scale,
  Cpu,
  Globe2,
  ChevronRight,
  ExternalLink,
  Activity
} from "lucide-react";
import { useDocumentContext } from "../../context/DocumentContext";

export function ThreatMap({ onSelectCitation }) {
  const { activeDocument, selectedLanguage, language } = useDocumentContext();
  const currentLang = language || selectedLanguage || "en";
  const isTamil = currentLang === "ta";
  const isMalayalam = currentLang === "ml";
  const isTelugu = currentLang === "te";

  const [selectedThreat, setSelectedThreat] = useState("termination");

  const THREAT_NODES = [
    {
      id: "financial",
      labelEn: "Financial Exposure",
      labelTa: "நிதி அபாயம்",
      labelMl: "സാമ്പത്തിക ബാധ്യത",
      labelTe: "ఆర్థిక నష్టభయం",
      level: "HIGH",
      color: "#B30000",
      score: 78,
      penalties: "INR 21,00,000 security deposit forfeiture + unexpired term rent",
      clauses: ["Clause 5.0", "Clause 14.0"],
      summaryEn: "Lessor retains unilateral right to forfeit 6 months deposit upon any disputed interior modification.",
      summaryTa: "உள் அலங்கார மாற்றம் தொடர்பாக 6 மாத பாதுகாப்பு வைப்புத் தொகையை பறிமுதல் செய்யும் ஒருதலைப்பட்ச உரிமை.",
      summaryMl: "തർക്കമുണ്ടായാൽ 6 മാസത്തെ ഡെപ്പോസിറ്റ് കണ്ടുകെട്ടാൻ ഉടമയ്ക്ക് ഏകപക്ഷീയമായ അധികാരം നൽകുന്നു.",
      summaryTe: "వివాదాస్పద ఇంటీరియర్ మార్పుపై 6 నెలల సెక్యూరిటీ డిపాజిట్‌ను జప్తు చేసే ఏకపక్ష హక్కును యజమాని కలిగి ఉంటారు.",
      targetCitation: { page: 3, clauseId: "clause-5" },
    },
    {
      id: "liability",
      labelEn: "Indemnity & Liability",
      labelTa: "பொறுப்பு & இழப்பீடு",
      labelMl: "ബാധ്യതയും നഷ്ടപരിഹാരവും",
      labelTe: "నష్టపరిహారం & బాధ్యత",
      level: "CRITICAL",
      color: "#E50914",
      score: 92,
      penalties: "Uncapped consequential damages & third-party indemnification",
      clauses: ["Clause 8.2", "Clause 12.1"],
      summaryEn: "Lessee indemnifies Lessor against all indirect damages without statutory liability caps.",
      summaryTa: "அதிகபட்ச வரம்பின்றி அனைத்து மறைமுக இழப்பீடுகளுக்கும் பயனர் பொறுப்பேற்க வேண்டும்.",
      summaryMl: "പരിധിയില്ലാത്ത പരോക്ഷ നാശനഷ്ടങ്ങൾക്കും മൂന്നാം കക്ഷി നഷ്ടപരിഹാരത്തിനും വാടകക്കാരൻ ബാധ്യസ്ഥനാണ്.",
      summaryTe: "చట్టబద్ధమైన బాధ్యత పరిమితులు లేకుండా అన్ని పరోక్ష నష్టాల నుండి యజమానికి అద్దెదారు నష్టపరిహారం చెల్లిస్తారు.",
      targetCitation: { page: 9, clauseId: "clause-14" },
    },
    {
      id: "termination",
      labelEn: "Termination Lock-In",
      labelTa: "ஒப்பந்த முறிவு & காலக்கெடு",
      labelMl: "റദ്ദാക്കലും ലോക്ക്-ഇന്നും",
      labelTe: "రద్దు & లాక్-ఇన్",
      level: "CRITICAL",
      color: "#E50914",
      score: 87,
      penalties: "Liquidated damages for remaining 24-month duration",
      clauses: ["Clause 11.0", "Clause 14.0"],
      summaryEn: "Mandatory 24-month lock-in. Early vacation triggers immediate demand for remaining term rental.",
      summaryTa: "24 மாத கட்டாய கால அளவு. இடையில் வெளியேறினால் எஞ்சிய மாதங்களின் முழு வாடகையும் செலுத்த வேண்டும்.",
      summaryMl: "24 മാസത്തെ നിർബന്ധിത ലോക്ക്-ഇൻ. നേരത്തെ ഒഴിഞ്ഞാൽ ശേഷിക്കുന്ന മാസങ്ങളിലെ മുഴുവൻ വാടകയും പിഴയായി നൽകണം.",
      summaryTe: "తప్పనిసరి 24 నెలల లాక్-ఇన్. ముందస్తు ఖాళీ చేయడం వల్ల మిగిలిన మొత్తం అద్దెను వెంటనే డిమాండ్ చేసే అవకాశం ఉంటుంది.",
      targetCitation: { page: 9, clauseId: "clause-14" },
    },
    {
      id: "confidentiality",
      labelEn: "Confidentiality",
      labelTa: "ரகசியத்தன்மை",
      labelMl: "രഹസ്യസ്വഭാവം",
      labelTe: "గోప్యత",
      level: "REVIEW",
      color: "#D97706",
      score: 64,
      penalties: "Injunctive relief and mandatory disclosure indemnity",
      clauses: ["Clause 15.0"],
      summaryEn: "Perpetual non-disclosure obligations extending 5 years beyond lease termination.",
      summaryTa: "ஒப்பந்தம் முடிந்த பிறகும் 5 ஆண்டுகளுக்கு ரகசியத்தன்மையை பாதுகாக்கும் கட்டாயம்.",
      summaryMl: "പാട്ടക്കരാർ അവസാനിച്ചതിന് ശേഷവും 5 വർഷത്തേക്ക് രഹസ്യസ്വഭാവം നിലനിർത്താനുള്ള ബാധ്യത.",
      summaryTe: "లీజు ముగిసిన తర్వాత కూడా 5 సంవత్సరాల పాటు గోప్యతను కాపాడాల్సిన శాశ్వత నిబంధన.",
      targetCitation: { page: 12, clauseId: "clause-18" },
    },
    {
      id: "compliance",
      labelEn: "Statutory Compliance",
      labelTa: "சட்ட இணக்கம்",
      labelMl: "നിയമപരമായ അനുസരണ",
      labelTe: "చట్టబద్ధమైన సమ్మతి",
      level: "REVIEW",
      color: "#D97706",
      score: 58,
      penalties: "Municipal stamp duty deficit & Transfer of Property Act Sec 107",
      clauses: ["Clause 2.1"],
      summaryEn: "Requires compulsory registration with Sub-Registrar to ensure admissibility in evidence.",
      summaryTa: "சான்றாக சமர்ப்பிக்க துணைப் பதிவாளர் அலுவலகத்தில் கட்டாயப் பதிவு தேவைப்படுகிறது.",
      summaryMl: "തെളിവായി സ്വീകരിക്കുന്നതിന് സബ് രജിസ്ട്രാർ ഓഫീസിൽ നിർബന്ധിത രജിസ്ട്രേഷൻ ആവശ്യമാണ്.",
      summaryTe: "సాక్ష్యంగా అంగీకరించడానికి సబ్-రిజిస్ట్రార్ వద్ద తప్పనిసరి నమోదు అవసరం.",
      targetCitation: { page: 1, clauseId: "clause-1" },
    },
    {
      id: "ip",
      labelEn: "Intellectual Property",
      labelTa: "அறிவுசார் சொத்துரிமை",
      labelMl: "ബൗദ്ധിക സ്വത്തവകാശം",
      labelTe: "మేధో సంపత్తి",
      level: "SAFE",
      color: "#475569",
      score: 22,
      penalties: "Standard trade name usage restrictions on premises signage",
      clauses: ["Clause 6.4"],
      summaryEn: "Limited to signage usage rights. No adverse ownership risk detected.",
      summaryTa: "பெயர்ப் பலகை வைப்பதற்கான நிலையான விதிகள் மட்டுமே. பெரிய ஆபத்துகள் இல்லை.",
      summaryMl: "സൈൻബോർഡ് ഉപയോഗിക്കുന്നതിനുള്ള സാധാരണ മാനദണ്ഡങ്ങൾ മാത്രം. ഗുരുതരമായ അപകടസാധ്യതകളില്ല.",
      summaryTe: "సైనేజ్ వినియోగ హక్కులకు మాత్రమే పరిమితం. ఎలాంటి యాజమాన్య రిస్క్ కనుగొనబడలేదు.",
      targetCitation: { page: 3, clauseId: "clause-5" },
    },
    {
      id: "jurisdiction",
      labelEn: "Arbitration & Seat",
      labelTa: "நீதித்துறை எல்லை & நடுவர்",
      labelMl: "ആർബിട്രേഷനും അധികാരപരിധിയും",
      labelTe: "ఆర్బిట్రేషన్ & న్యాయ పరిధి",
      level: "HIGH",
      color: "#B30000",
      score: 84,
      penalties: "Unilateral arbitrator appointment void under Section 12(5)",
      clauses: ["Clause 18.0"],
      summaryEn: "Lessor unilaterally appoints sole arbitrator, violating Supreme Court Perkins Eastman precedent.",
      summaryTa: "உரிமையாளர் ஒருதலைப்பட்சமாக நடுவரை நியமிப்பது உச்ச நீதிமன்ற தீர்ப்புகளுக்கு எதிரானது.",
      summaryMl: "ഉടമ ഏകപക്ഷീയമായി ആർബിട്രേറ്ററെ നിയമിക്കുന്നത് സുപ്രീം കോടതി വിധികൾക്ക് വിരുദ്ധമാണ്.",
      summaryTe: "సుప్రీంకోర్టు పెర్కిన్స్ ఈస్ట్‌మన్ తీర్పును ఉల్లంఘిస్తూ యజమాని ఏకపక్షంగా ఆర్బిట్రేటర్‌ను నియమిస్తారు.",
      targetCitation: { page: 12, clauseId: "clause-18" },
    },
  ];

  const getNodeLabel = (node) => (isTelugu ? node.labelTe : isMalayalam ? node.labelMl : isTamil ? node.labelTa : node.labelEn);
  const getNodeSummary = (node) => (isTelugu ? node.summaryTe : isMalayalam ? node.summaryMl : isTamil ? node.summaryTa : node.summaryEn);

  const activeNode = THREAT_NODES.find((n) => n.id === selectedThreat) || THREAT_NODES[0];

  return (
    <div className="threat-map-container">
      {/* Header Forensic Telemetry */}
      <div className="threat-map-header">
        <div className="threat-header-left">
          <div className="threat-pulse-indicator">
            <span className="threat-pulse-dot"></span>
            <span className="font-mono-tech">[ THREAT MAP ENGINE v4.2 ]</span>
          </div>
          <h3 className="threat-title">
            {isTelugu ? "చట్టపరమైన ముప్పు మ్యాప్" : isMalayalam ? "നിയമപരമായ ഭീഷണി മാപ്പ്" : isTamil ? "சட்ட ரீதியான அச்சுறுத்தல் வரைபடம்" : "LEGAL THREAT MAP"}
          </h3>
          <p className="threat-subtitle">
            {isTelugu
              ? "పత్రం నోడ్స్‌ను రిస్క్ వెక్టార్‌లతో అనుసంధానించే టోపోలాజికల్ రిస్క్ అంచనా."
              : isMalayalam
              ? "പ്രധാന നിയമപരമായ അപകടസാധ്യതകളും സാമ്പത്തിക ബാധ്യതകളും ബന്ധിപ്പിക്കുന്ന ഭൂപടം."
              : isTamil
              ? "ஆவணத்தின் முக்கிய சட்ட ரீதியான ஆபத்துகள் மற்றும் நிதி பொறுப்புகளின் தொழில்நுட்ப வரைபடம்."
              : "Topological risk assessment connecting document nodes to exposure vectors."}
          </p>
        </div>

        <div className="threat-header-stats">
          <div className="forensic-stat-pill">
            <span className="stat-label">AGGREGATE RISK</span>
            <span className="stat-value text-crimson">81 / 100</span>
          </div>
          <div className="forensic-stat-pill">
            <span className="stat-label">CRITICAL VECTORS</span>
            <span className="stat-value text-red">3 ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Node Map + Right Threat Telemetry Dossier */}
      <div className="threat-map-body">
        {/* Left: Interactive Node Radar */}
        <div className="threat-nodes-canvas">
          <div className="central-doc-hub">
            <div className="doc-hub-core">
              <ShieldAlert size={22} color="#E50914" />
              <span className="doc-hub-title">{activeDocument?.filename || "AGREEMENT.PDF"}</span>
              <span className="doc-hub-tag font-mono-tech">[ ROOT NODE ]</span>
            </div>
          </div>

          <div className="threat-nodes-grid">
            {THREAT_NODES.map((node) => {
              const isSelected = selectedThreat === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedThreat(node.id)}
                  className={`threat-node-card ${isSelected ? "selected" : ""} level-${node.level.toLowerCase()}`}
                  style={{ borderColor: isSelected ? node.color : undefined }}
                >
                  <div className="node-card-top">
                    <span className="node-badge" style={{ backgroundColor: `${node.color}22`, color: node.color, borderColor: node.color }}>
                      {node.level}
                    </span>
                    <span className="node-score font-mono-tech" style={{ color: node.color }}>
                      {node.score}%
                    </span>
                  </div>
                  <div className="node-card-label">{getNodeLabel(node)}</div>
                  <div className="node-clauses-strip font-mono-tech">
                    {node.clauses.join(" · ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Threat Forensic Dossier */}
        <div className="threat-detail-dossier">
          <div className="dossier-top-bar">
            <div className="dossier-tag-group">
              <span className="font-mono-tech text-crimson">[ THREAT VECTOR ]</span>
              <h4 className="dossier-title">{getNodeLabel(activeNode)}</h4>
            </div>
            <div className="dossier-score-badge" style={{ borderColor: activeNode.color }}>
              <span className="score-num font-mono-tech" style={{ color: activeNode.color }}>{activeNode.score}</span>
              <span className="score-denom">/100</span>
            </div>
          </div>

          <div className="dossier-section">
            <label className="dossier-sec-label font-mono-tech">POTENTIAL EXPOSURE</label>
            <div className="dossier-penalty-box">
              <AlertTriangle size={15} color={activeNode.color} />
              <span>{activeNode.penalties}</span>
            </div>
          </div>

          <div className="dossier-section">
            <label className="dossier-sec-label font-mono-tech">AI FORENSIC INTERPRETATION</label>
            <p className="dossier-interpretation-text">
              {getNodeSummary(activeNode)}
            </p>
          </div>

          <div className="dossier-section">
            <label className="dossier-sec-label font-mono-tech">IDENTIFIED CLAUSES</label>
            <div className="dossier-clauses-row">
              {activeNode.clauses.map((c, idx) => (
                <span key={idx} className="clause-chip font-mono-tech">{c}</span>
              ))}
            </div>
          </div>

          <div className="dossier-action-footer">
            <button
              onClick={() => onSelectCitation && onSelectCitation(activeNode.targetCitation)}
              className="btn-inspect-clause"
            >
              <ExternalLink size={13} />
              <span>{isTelugu ? "పత్రంలో నిబంధనను పరిశీలించండి (Split View)" : isMalayalam ? "രേഖയിൽ കാണുക (Split View)" : isTamil ? "ஆதார பகுதியை பார்க்கவும் (Split View)" : "Inspect Clause in Document"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreatMap;
