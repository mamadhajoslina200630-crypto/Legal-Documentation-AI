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
  const { activeDocument, selectedLanguage, language } = useDocumentContext();
  const currentLang = language || selectedLanguage || "en";
  const isTamil = currentLang === "ta";
  const isMalayalam = currentLang === "ml";
  const isTelugu = currentLang === "te";

  const [expandedId, setExpandedId] = useState("clause-07");

  const CLAUSE_INTELLIGENCE_ITEMS = [
    {
      id: "clause-07",
      number: "CLAUSE 07",
      titleEn: "TERMINATION & LIQUIDATED DAMAGES",
      titleTa: "ஒப்பந்த முறிவு & அபராதம்",
      titleMl: "കരാർ റദ്ദാക്കലും നഷ്ടപരിഹാരവും",
      titleTe: "ఒప్పందం రద్దు & లిక్విడేటెడ్ డ్యామేజెస్",
      riskLevel: "HIGH",
      riskScore: 87,
      interpretationEn:
        "This provision restricts your right to terminate the contract before the 24-month lock-in period expires. If you vacate early for any business reason, you must immediately pay all remaining gross rent as liquidated damages.",
      interpretationTa:
        "இந்த விதி 24 மாதங்களுக்குள் ஒப்பந்தத்தை முறிக்க தடை விதிக்கிறது. முன்கூட்டியே வெளியேறினால் எஞ்சிய அனைத்து மாதங்களின் வாடகையையும் இழப்பீடாக ஒரே தவணையில் செலுத்த வேண்டும்.",
      interpretationMl:
        "24 മാസത്തെ ലോക്ക്-ഇൻ കാലയളവിന് മുൻപ് കരാർ അവസാനിപ്പിക്കാൻ ഈ വ്യവസ്ഥ വിലക്കുന്നു. നേരത്തെ ഒഴിഞ്ഞാൽ ബാക്കി മാസങ്ങളിലെ മുഴുവൻ വാടകയും ഉടൻ നൽകണം.",
      interpretationTe:
        "24 నెలల లాక్-ఇన్ వ్యవధి ముగియకముందే ఒప్పందాన్ని రద్దు చేసే మీ హక్కును ఈ నిబంధన పరిమితం చేస్తుంది. ఏదైనా వ్యాపార కారణంతో మీరు ముందుగా వైదొలిగితే, మిగిలిన నెలల మొత్తం స్థూల అద్దెను నష్టపరిహారంగా వెంటనే చెల్లించాలి.",
      potentialImpactEn:
        "Severe cash-flow exposure. Even in the event of landlord default or economic downturn, your company would owe up to INR 84,00,000 in unmitigated damages with no provision for duty to mitigate losses.",
      potentialImpactTa:
        "கடுமையான நிதி இழப்பு அபாயம். வணிக இழப்பு அல்லது உரிமையாளர் குறைபாடுகள் இருந்தாலும் உங்கள் நிறுவனம் அதிகபட்சமாக ரூ. 84,00,000 வரை செலுத்த வேண்டிய கட்டாயம் ஏற்படலாம்.",
      potentialImpactMl:
        "ഗുരുതരമായ സാമ്പത്തിക ബാധ്യത. ബിസിനസ്സ് നഷ്ടം സംഭവിച്ചാലും കമ്പനി 84 ലക്ഷം രൂപ വരെ നഷ്ടപരിഹാരമായി നൽകേണ്ടി വന്നേക്കാം.",
      potentialImpactTe:
        "తీవ్రమైన నగదు ప్రవాహ నష్టభయం. భూస్వామి డిఫాల్ట్ లేదా ఆర్థిక మందగమనం సంభవించినప్పటికీ, నష్టాలను తగ్గించే నిబంధన లేకపోవడం వల్ల మీ కంపెనీ గరిష్టంగా రూ. 84,00,000 వరకు పరిహారం చెల్లించాల్సి రావచ్చు.",
      recommendedActionEn:
        "Consult legal counsel to insert a mutual termination clause with a standard 60-day notice and a reasonable cap on early termination fee (maximum 2 to 3 months' rent instead of the entire lock-in balance).",
      recommendedActionTa:
        "முழுத் தொகையை செலுத்துவதற்குப் பதிலாக, 60 நாட்கள் முன்னறிவிப்புடன் அதிகபட்சம் 2-3 மாத வாடகையுடன் வெளியேறும் வகையில் விதியை திருத்த வழக்கறிஞரிடம் ஆலோசிக்கவும்.",
      recommendedActionMl:
        "60 ദിവസത്തെ നോട്ടീസോടെ പരമാവധി 2-3 മാസത്തെ വാടക മാത്രം നൽകി കരാർ അവസാനിപ്പിക്കാൻ അഭിഭാഷകനുമായി ആലോചിച്ച് മാറ്റം വരുത്തുക.",
      recommendedActionTe:
        "ప్రామాణిక 60 రోజుల నోటీసు మరియు ముందస్తు రద్దు రుసుముపై సహేతుకమైన పరిమితితో (మొత్తం లాక్-ఇన్ బకాయికి బదులుగా గరిష్టంగా 2 నుండి 3 నెలల అద్దె) పరస్పర రద్దు నిబంధనను చేర్చడానికి న్యాయ సలహాదారుని సంప్రదించండి.",
      citation: { page: 9, clauseId: "clause-14" },
    },
    {
      id: "clause-05",
      number: "CLAUSE 05",
      titleEn: "SECURITY DEPOSIT FORFEITURE",
      titleTa: "பாதுகாப்பு வைப்புத் தொகை பறிமுதல்",
      titleMl: "സെക്യൂരിറ്റി ഡെപ്പോസിറ്റ് കണ്ടുകെട്ടൽ",
      titleTe: "సెక్యూరిటీ డిపాజిట్ జప్తు",
      riskLevel: "HIGH",
      riskScore: 78,
      interpretationEn:
        "Lessor claims absolute discretion to forfeit the entire security deposit of INR 21,00,000 without requiring judicial proof of actual damages or independent appraisal.",
      interpretationTa:
        "உண்மையான சேதத்தை நிரூபிக்காமல், ரூ. 21,00,000 பாதுகாப்பு வைப்புத் தொகையை முழுமையாக பறிமுதல் செய்ய உரிமையாளருக்கு முழு அதிகாரம் வழங்குகிறது.",
      interpretationMl:
        "യഥാർത്ഥ നാശനഷ്ടങ്ങൾ തെളിയിക്കാതെ മുഴുവൻ ₹21,00,000 സെക്യൂരിറ്റി ഡെപ്പോസിറ്റും കണ്ടുകെട്ടാൻ ഉടമയ്ക്ക് പൂർണ്ണ അധികാരം നൽകുന്നു.",
      interpretationTe:
        "వాస్తవ నష్టాలకు న్యాయపరమైన రుజువు లేదా స్వతంత్ర మూల్యాంకనం అవసరం లేకుండా రూ. 21,00,000 పూర్తి సెక్యూరిటీ డిపాజిట్‌ను జప్తు చేయడానికి యజమానికి పూర్తి విచక్షణ ఉందని ఈ నిబంధన పేర్కొంటుంది.",
      potentialImpactEn:
        "Risk of total deposit loss over minor wear-and-tear or subjective disputes over premises handover condition.",
      potentialImpactTa:
        "சிறு சேதங்கள் அல்லது கருத்து வேறுபாடுகளுக்காக முழு வைப்புத்தொகையையும் இழக்கும் அபாயம் உள்ளது.",
      potentialImpactMl:
        "ചെറിയ അറ്റകുറ്റപ്പണികൾക്കോ തർക്കങ്ങൾക്കോ മുഴുവൻ നിക്ഷേപവും നഷ്ടപ്പെടാനുള്ള സാധ്യത.",
      potentialImpactTe:
        "చిన్నపాటి మరమ్మతులు లేదా ప్రాంగణం అప్పగింత పరిస్థితిపై వివాదాల కారణంగా మొత్తం డిపాజిట్ నష్టపోయే ప్రమాదం ఉంది.",
      recommendedActionEn:
        "Demand joint pre-inspection protocols and escrow holding by a neutral third party, limiting forfeiture strictly to proven actual repairs.",
      recommendedActionTa:
        "இருதரப்பு ஆய்வு நெறிமுறைகளைச் சேர்க்கவும், உண்மையான பழுதுபார்ப்புச் செலவுகளுக்கு மட்டுமே பிடித்தம் செய்ய நிபந்தனை விதிக்கவும்.",
      recommendedActionMl:
        "യഥാർത്ഥ അറ്റകുറ്റപ്പണി ചെലവുകൾക്ക് മാത്രമായി കണ്ടുകെട്ടൽ പരിമിതപ്പെടുത്താൻ നിബന്ധന ചേർക്കുക.",
      recommendedActionTe:
        "సంయుక్త పూర్వ తనిఖీ ప్రోటోకాల్స్ మరియు తటస్థ మూడవ పక్షం ద్వారా ఎస్క్రో హోల్డింగ్‌ను డిమాండ్ చేయండి, జప్తును నిరూపితమైన వాస్తవ మరమ్మతులకు మాత్రమే ఖచ్చితంగా పరిమితం చేయండి.",
      citation: { page: 3, clauseId: "clause-5" },
    },
    {
      id: "clause-18",
      number: "CLAUSE 18",
      titleEn: "UNILATERAL ARBITRATOR APPOINTMENT",
      titleTa: "ஒருதலைப்பட்ச நடுவர் நியமனம்",
      titleMl: "ഏകപക്ഷീയ ആർബിട്രേറ്റർ നിയമനം",
      titleTe: "ఏకపక్ష ఆర్బిట్రేటర్ నియామకం",
      riskLevel: "CRITICAL",
      riskScore: 92,
      interpretationEn:
        "The dispute clause gives the Lessor sole prerogative to appoint an arbitrator in any conflict, denying mutual consensus or institutional appointment.",
      interpretationTa:
        "சர்ச்சைகள் ஏற்பட்டால் நடுவரை நியமிக்கும் முழு அதிகாரத்தையும் உரிமையாளருக்கு மட்டுமே அளிக்கிறது, இது நடுநிலைமைக்கு எதிரானது.",
      interpretationMl:
        "തർക്കമുണ്ടായാൽ ആർബിട്രേറ്ററെ നിയമിക്കാനുള്ള പൂർണ്ണാവകാശം ഉടമയ്ക്ക് നൽകുന്നു, ഇത് സ്വാഭാവിക നീതിക്ക് വിരുദ്ധമാണ്.",
      interpretationTe:
        "ఏదైనా వివాదంలో మధ్యవర్తిని నియమించే ఏకైక ప్రత్యేక హక్కును ఈ వివాద నిబంధన యజమానికి ఇస్తుంది, పరస్పర ఏకాభిప్రాయం లేదా సంస్థాగత నియామకాన్ని నిరాకరిస్తుంది.",
      potentialImpactEn:
        "High risk of biased arbitration awards. Although unenforceable under Section 12(5) per Supreme Court precedents, it forces expensive preliminary litigation to quash the panel.",
      potentialImpactTa:
        "ஒருதலைப்பட்ச தீர்ப்பு வரும் ஆபத்து. இது சட்டவிரோதமானது என்றாலும் நீதிமன்றத்தில் முறையிட கூடுதல் செலவாகும்.",
      potentialImpactMl:
        "പക്ഷപാതപരമായ വിധികൾ ഉണ്ടാകാനുള്ള വലിയ സാധ്യത. സുപ്രീം കോടതി വിധിയനുസരിച്ച് ഇത് അസാധുവാണെങ്കിലും കോടതിയെ സമീപിക്കാൻ ചെലവുണ്ടാകും.",
      potentialImpactTe:
        "పక్షపాతంతో కూడిన ఆర్బిట్రేషన్ తీర్పుల అధిక ప్రమాదం. సుప్రీంకోర్టు పూర్వదర్శనాల ప్రకారం సెక్షన్ 12(5) కింద ఇది అమలు చేయలేనిది అయినప్పటికీ, ప్యానెల్‌ను రద్దు చేయడానికి ఖరీదైన ప్రాథమిక వ్యాజ్యాన్ని ఎదుర్కోవాల్సి వస్తుంది.",
      recommendedActionEn:
        "Replace with institutional arbitration (e.g. DIAC or MCIA rules) where the presiding arbitrator is chosen by mutual consent or by the arbitral institution.",
      recommendedActionTa:
        "இருதரப்பு ஒப்புதலுடன் அல்லது அதிகாரப்பூர்வ நடுவர் மன்றம் (DIAC) மூலம் நடுவரை நியமிக்க பரிந்துரைக்கவும்.",
      recommendedActionMl:
        "സ്ഥാപനപരമായ ആർബിട്രേഷൻ (DIAC അല്ലെങ്കിൽ MCIA) വഴി പരസ്പര സമ്മതത്തോടെ ആർബിട്രേറ്ററെ നിയമിക്കാൻ വ്യവസ്ഥ ചെയ്യുക.",
      recommendedActionTe:
        "సంస్థాగత ఆర్బిట్రేషన్‌తో (ఉదా. DIAC లేదా MCIA నిబంధనలు) భర్తీ చేయండి, ఇక్కడ ప్రిసైడింగ్ ఆర్బిట్రేటర్‌ను పరస్పర సమ్మతితో లేదా ఆర్బిట్రల్ సంస్థ ద్వారా ఎంపిక చేస్తారు.",
      citation: { page: 12, clauseId: "clause-18" },
    },
    {
      id: "clause-01",
      number: "CLAUSE 01",
      titleEn: "PREMISES & USE RESTRICTION",
      titleTa: "சொத்து & பயன்பாட்டு வரம்பு",
      titleMl: "ഉപയോഗ നിയന്ത്രണങ്ങൾ",
      titleTe: "ప్రాంగణం & వినియోగ పరిమితి",
      riskLevel: "SAFE",
      riskScore: 24,
      interpretationEn:
        "Standard commercial office use clause for IT and software development services within authorized municipal building guidelines.",
      interpretationTa:
        "அங்கீகரிக்கப்பட்ட தகவல் தொழில்நுட்ப அலுவலகப் பணிகளுக்காக சொத்தை பயன்படுத்துவதற்கான நிலையான விதிமுறை.",
      interpretationMl:
        "അംഗീകൃത ഐടി, സോഫ്റ്റ്‌വെയർ സേവനങ്ങൾക്കായി കെട്ടിടം ഉപയോഗിക്കുന്നതിനുള്ള സാധാരണ നിബന്ധന.",
      interpretationTe:
        "అధీకృత మునిసిపల్ భవన మార్గదర్శకాల పరిధిలో IT మరియు సాఫ్ట్‌వేర్ అభివృద్ధి సేవల కోసం ప్రామాణిక వాణిజ్య కార్యాలయ వినియోగ నిబంధన.",
      potentialImpactEn:
        "Negligible risk under normal operating parameters.",
      potentialImpactTa:
        "வழக்கமான செயல்பாடுகளில் எந்தவொரு ஆபத்தும் இல்லை.",
      potentialImpactMl:
        "സാധാരണ പ്രവർത്തനങ്ങളിൽ അപകടസാധ്യതകളില്ല.",
      potentialImpactTe:
        "సాధారణ ఆపరేటింగ్ పారామితుల క్రింద స్వల్పమైన లేదా ఎలాంటి రిస్క్ లేదు.",
      recommendedActionEn:
        "Ensure commercial sub-leasing or remote-work occupancy rights are explicitly protected if your team scales.",
      recommendedActionTa:
        "எதிர்காலத்தில் குழு வளரும்போது துணை குத்தகை அல்லது தொலைதூர வேலை உரிமைகளை உறுதிப்படுத்திக் கொள்ளுங்கள்.",
      recommendedActionMl:
        "ഭാവിയിൽ കമ്പനി വികസിക്കുമ്പോൾ സബ്-ലീസ് ചെയ്യാനുള്ള അവകാശം ഉറപ്പുവരുത്തുക.",
      recommendedActionTe:
        "మీ బృందం విస్తరిస్తే వాణిజ్య సబ్-లీజింగ్ లేదా రిమోట్-వర్క్ ఆక్యుపెన్సీ హక్కులు స్పష్టంగా రక్షించబడ్డాయని నిర్ధారించుకోండి.",
      citation: { page: 1, clauseId: "clause-1" },
    }
  ];

  const getItemTitle = (item) => (isTelugu ? item.titleTe : isMalayalam ? item.titleMl : isTamil ? item.titleTa : item.titleEn);
  const getItemInterpretation = (item) => (isTelugu ? item.interpretationTe : isMalayalam ? item.interpretationMl : isTamil ? item.interpretationTa : item.interpretationEn);
  const getItemImpact = (item) => (isTelugu ? item.potentialImpactTe : isMalayalam ? item.potentialImpactMl : isTamil ? item.potentialImpactTa : item.potentialImpactEn);
  const getItemAction = (item) => (isTelugu ? item.recommendedActionTe : isMalayalam ? item.recommendedActionMl : isTamil ? item.recommendedActionTa : item.recommendedActionEn);

  return (
    <div className="clause-intel-container">
      {/* Header */}
      <div className="clause-intel-header">
        <div>
          <div className="font-mono-tech text-crimson">[ CLAUSE FORENSICS // AUDIT STREAM ]</div>
          <h3 className="clause-intel-title">
            {isTelugu ? "నిబంధనల చట్టపరమైన విశ్లేషణ" : isMalayalam ? "നിബന്ധനകളുടെ നിയമപരമായ വിശകലനം" : isTamil ? "விதிமுறைகளின் சட்ட ஆய்வு" : "CLAUSE INTELLIGENCE"}
          </h3>
          <p className="clause-intel-subtitle">
            {isTelugu
              ? "ముఖ్యమైన ఒప్పంద నిబంధనలు, బాధ్యతలు మరియు న్యాయవాది సిఫార్సుల లోతైన విశ్లేషణ."
              : isMalayalam
              ? "പ്രധാന കരാർ വ്യവസ്ഥകൾ, ബാധ്യതകൾ, അഭിഭാഷക ശുപാർശകൾ എന്നിവയുടെ സമഗ്ര വിശകലനം."
              : isTamil
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
                  <span className="clause-heading-title">{getItemTitle(item)}</span>
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
                      {getItemInterpretation(item)}
                    </p>
                  </div>

                  {/* Section 2: Potential Impact */}
                  <div className="clause-detail-block impact-block">
                    <div className="detail-block-heading font-mono-tech text-crimson">
                      [ POTENTIAL IMPACT // COMMERCIAL EXPOSURE ]
                    </div>
                    <p className="detail-block-body">
                      {getItemImpact(item)}
                    </p>
                  </div>

                  {/* Section 3: Recommended Action */}
                  <div className="clause-detail-block advice-block">
                    <div className="detail-block-heading font-mono-tech text-gold">
                      [ RECOMMENDED ACTION // ADVISORY NOTICE ]
                    </div>
                    <p className="detail-block-body">
                      {getItemAction(item)}
                    </p>
                  </div>

                  {/* Footer Jump to Document */}
                  <div className="clause-card-footer">
                    <button
                      onClick={() => onSelectCitation && onSelectCitation(item.citation)}
                      className="btn-inspect-citation font-mono-tech"
                    >
                      <ExternalLink size={13} />
                      <span>
                        {isTelugu
                          ? "పత్రంలో వీక్షించండి (Page " + item.citation.page + ")"
                          : isMalayalam
                          ? "രേഖയിൽ കാണുക (Page " + item.citation.page + ")"
                          : isTamil
                          ? "ஆவணத்தில் காண்க (Page " + item.citation.page + ")"
                          : "INSPECT IN DOCUMENT (Page " + item.citation.page + ")"}
                      </span>
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
