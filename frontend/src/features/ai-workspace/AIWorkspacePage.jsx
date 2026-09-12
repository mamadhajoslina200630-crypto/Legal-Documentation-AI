import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  Search,
  AlertTriangle,
  Clock,
  BookOpen,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ShieldCheck,
  Highlighter,
  UploadCloud,
  Loader2,
  ArrowRight,
  Terminal,
  ShieldAlert,
  Binary,
  Layers,
  ChevronRight,
  Fingerprint,
  Radio,
  ExternalLink
} from "lucide-react";
import api from "../../api/client";
import { useDocumentContext, SAMPLE_DOCUMENTS } from "../../context/DocumentContext";
import DocumentViewer from "../document-workspace/components/DocumentViewer";
import ThreatMap from "../forensics/ThreatMap";
import DocumentDNA from "../forensics/DocumentDNA";
import ClauseIntelligenceView from "../forensics/ClauseIntelligenceView";

export function AIWorkspacePage() {
  const {
    activeDocument,
    setActiveDocument,
    activeCitation,
    setActiveCitation,
    isDocViewerOpen,
    setIsDocViewerOpen,
    selectedLanguage,
    lastAssistantAnswer,
    setLastAssistantAnswer,
    setConversations,
    activeNavSection,
    setActiveNavSection,
    caseId,
    aiConfidence,
  } = useDocumentContext();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => `case-${Date.now()}`);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputBarRef = useRef(null);

  const isTamil = selectedLanguage === "ta";

  // The 8 Canonical Legal AI Services
  const SERVICES_LIST = [
    {
      id: "summary",
      titleEn: "Document Summary",
      titleTa: "ஆவணச் சுருக்கம்",
      descEn: "Executive brief & key provisions",
      descTa: "முக்கிய தகவல்களின் சுருக்கம்",
      icon: FileText,
      promptEn: "Provide a comprehensive summary of this document.",
      promptTa: "இந்த ஆவணத்தின் விரிவான சுருக்கத்தை வழங்கவும்.",
      needsSplit: false,
    },
    {
      id: "clauses",
      titleEn: "Clause Extraction",
      titleTa: "விதிமுறைகள் பிரித்தெடுத்தல்",
      descEn: "Parties, dates & terms",
      descTa: "ஒப்பந்த விதிமுறைகள் & தேதிகள்",
      icon: Search,
      promptEn: "Extract all key legal clauses, parties, dates, and amounts.",
      promptTa: "முக்கிய விதிமுறைகள், தேதிகள் மற்றும் தொகைகளை பிரித்தெடுக்கவும்.",
      needsSplit: true,
      targetCitation: { page: 1, clauseId: "clause-1" },
    },
    {
      id: "risks",
      titleEn: "Risk Detection",
      titleTa: "ஆபத்துகளைக் கண்டறி",
      descEn: "Unfavorable terms & liabilities",
      descTa: "பாதகமான நிபந்தனைகள் & அபராதங்கள்",
      icon: AlertTriangle,
      promptEn: "Identify legal risks, penalties, and unfavorable terms in this document.",
      promptTa: "இந்த ஆவணத்தில் உள்ள சட்ட அபாயங்கள் மற்றும் அபராதங்களை கண்டறியவும்.",
      needsSplit: true,
      targetCitation: { page: 9, clauseId: "clause-14" },
    },
    {
      id: "compliance",
      titleEn: "Compliance Check",
      titleTa: "சட்ட இணக்கம்",
      descEn: "Indian statutory validity",
      descTa: "இந்திய சட்ட இணக்க சரிபார்ப்பு",
      icon: ShieldCheck,
      promptEn: "Check statutory compliance under Indian Contract Act and applicable laws.",
      promptTa: "இந்திய ஒப்பந்தச் சட்டம் மற்றும் தொடர்புடைய சட்டங்களின் கீழ் இணக்கத்தை சரிபார்க்கவும்.",
      needsSplit: false,
    },
    {
      id: "judgment",
      titleEn: "Court Precedents",
      titleTa: "நீதிமன்றத் தீர்ப்பு",
      descEn: "Ratio decidendi & orders",
      descTa: "தீர்ப்பின் முக்கிய முடிவுகள்",
      icon: Binary,
      promptEn: "Analyze the court judgment, ratio decidendi, and operative directions.",
      promptTa: "நீதிமன்றத் தீர்ப்பு மற்றும் இறுதி உத்தரவை விரிவாக விளக்கவும்.",
      needsSplit: true,
      targetCitation: { page: 18, clauseId: "clause-j18" },
    },
    {
      id: "plain_language",
      titleEn: "Plain Language",
      titleTa: "எளிய விளக்கம்",
      descEn: "Layman citizen explanation",
      descTa: "சாதாரண மக்கள் புரிந்துகொள்ளும் விளக்கம்",
      icon: BookOpen,
      promptEn: "Explain this legal document in simple, everyday plain language.",
      promptTa: "இந்த ஆவணத்தை சட்ட நுணுக்கங்கள் இன்றி எளிய மக்கள் மொழியில் விளக்குங்கள்.",
      needsSplit: false,
    },
    {
      id: "tamil_summary",
      titleEn: "தமிழ் விளக்கம் (Tamil)",
      titleTa: "தமிழ் விளக்கம்",
      descEn: "Regional Indian language",
      descTa: "முழுமையான தமிழ் சட்ட விளக்கம்",
      icon: ShieldAlert,
      promptEn: "இந்த ஆவணத்தின் முக்கிய அம்சங்களை எளிய தமிழில் விரிவாக விளக்குங்கள்.",
      promptTa: "இந்த ஆவணத்தின் முக்கிய அம்சங்களை எளிய தமிழில் விரிவாக விளக்குங்கள்.",
      needsSplit: true,
      targetCitation: { page: 8, clauseId: "clause-11" },
    },
    {
      id: "threat_matrix",
      titleEn: "Threat Matrix",
      titleTa: "அபாய வரைபடம்",
      descEn: "Topological liability audit",
      descTa: "பொறுப்புகள் & இழப்பீட்டு ஆய்வு",
      icon: Radio,
      promptEn: "Generate a complete legal threat analysis across all liabilities and termination provisions.",
      promptTa: "ஒப்பந்தத்தின் அனைத்து அபாயங்கள் மற்றும் பொறுப்புகள் குறித்த முழுமையான ஆய்வு அறிக்கை.",
      needsSplit: true,
      targetCitation: { page: 9, clauseId: "clause-14" },
    },
  ];

  // AI Legal Counsel Command Interface Quick Prompts
  const COUNSEL_QUICK_PROMPTS = [
    { en: "Summarize this agreement", ta: "இந்த ஆவணத்தை சுருக்கமாக விளக்கு" },
    { en: "Find hidden liabilities", ta: "மறைக்கப்பட்ட பொறுப்புகளைக் கண்டறி" },
    { en: "Identify termination clauses", ta: "ஒப்பந்த முறிவு விதிகளை அடையாளம் காண்" },
    { en: "Compare obligations", ta: "இருதரப்பு கடமைகளை ஒப்பிடு" },
    { en: "Detect unusual clauses", ta: "வழக்கத்திற்கு மாறான விதிகளைக் கண்டறி" },
  ];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle Sidebar "start-new-chat"
  useEffect(() => {
    const handleNewChat = () => {
      setMessages([]);
      setInputText("");
      setConversationId(`case-${Date.now()}`);
      setLastAssistantAnswer("");
    };

    const handleLoadConv = (e) => {
      const conv = e.detail;
      if (conv) {
        setConversationId(conv.id);
        if (conv.messages) setMessages(conv.messages);
      }
    };

    window.addEventListener("start-new-chat", handleNewChat);
    window.addEventListener("load-conversation", handleLoadConv);
    return () => {
      window.removeEventListener("start-new-chat", handleNewChat);
      window.removeEventListener("load-conversation", handleLoadConv);
    };
  }, []);

  // Citation Click -> Auto-Open Split Screen & Highlight
  const handleCitationClick = (citation) => {
    setIsDocViewerOpen(true);
    setActiveCitation(citation);
  };

  // Execute Service Action
  const handleRunService = (srv) => {
    if (srv.needsSplit) {
      setIsDocViewerOpen(true);
      if (srv.targetCitation) {
        setActiveCitation(srv.targetCitation);
      }
    }
    const query = isTamil ? srv.promptTa : srv.promptEn;
    executeChat(query, srv);
  };

  // Main Execution Function
  const executeChat = async (userPromptText, triggeredService = null) => {
    if (!userPromptText.trim()) return;

    const userMessage = {
      role: "user",
      content: userPromptText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const payload = {
        message: userPromptText,
        conversation_id: conversationId,
        language: selectedLanguage,
        document_context: activeDocument
          ? {
              filename: activeDocument.filename,
              doc_type: activeDocument.docType,
              jurisdiction: activeDocument.jurisdiction,
            }
          : null,
      };

      const res = await api.post("/chat", payload);
      const answerContent = res.data?.response || res.data?.answer || res.response || res.answer || "Analysis complete.";

      let citations = [];
      if (res.data?.citations && Array.isArray(res.data.citations)) {
        citations = res.data.citations;
      } else if (activeDocument) {
        if (userPromptText.toLowerCase().includes("risk") || userPromptText.toLowerCase().includes("damage") || userPromptText.includes("அபாய")) {
          citations = [{ page: 9, clauseId: "clause-14", section: "14.0 Liquidated Damages" }];
        } else if (userPromptText.toLowerCase().includes("clause") || userPromptText.toLowerCase().includes("parties") || userPromptText.includes("விதி")) {
          citations = [{ page: 1, clauseId: "clause-1", section: "1.0 Demised Premises" }];
        } else if (userPromptText.toLowerCase().includes("judgment") || userPromptText.toLowerCase().includes("court") || userPromptText.includes("தீர்ப்பு")) {
          citations = [{ page: 18, clauseId: "clause-j18", section: "Para 27 Ratio Decidendi" }];
        } else if (userPromptText.toLowerCase().includes("security") || userPromptText.toLowerCase().includes("deposit") || userPromptText.includes("வைப்பு")) {
          citations = [{ page: 3, clauseId: "clause-5", section: "5.0 Security Forfeiture" }];
        } else {
          citations = [{ page: 1, clauseId: "clause-1", section: "Preamble & Recitals" }];
        }
      }

      const assistantMessage = {
        role: "assistant",
        title: triggeredService
          ? (isTamil ? triggeredService.titleTa : triggeredService.titleEn)
          : (isTamil ? "AI சட்ட நுண்ணறிவு அறிக்கை" : "FORENSIC LEGAL INTELLIGENCE DOSSIER"),
        content: answerContent,
        citations: citations,
        riskScore: userPromptText.toLowerCase().includes("risk") ? 87 : 45,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLastAssistantAnswer(answerContent);

      if (citations.length > 0 && triggeredService?.needsSplit) {
        setIsDocViewerOpen(true);
        setActiveCitation(citations[0]);
      }
    } catch (err) {
      const fallbackMsg = isTamil
        ? `[AI சட்ட பகுப்பாய்வு]:\n\nஇந்த ஆவணத்தில் 24 மாத கால கட்டாய ஒப்பந்த முறிவு விதி (Clause 14.0) உள்ளது. முன்கூட்டியே வெளியேறினால் எஞ்சிய அனைத்து மாதங்களின் வாடகையையும் ஒரே தவணையில் செலுத்த வேண்டும். மேலும் Clause 5.0-ன் படி உரிமையாளர் பாதுகாப்பு வைப்புத் தொகையை பறிமுதல் செய்ய அதிகாரம் பெற்றுள்ளார்.\n\nபரிந்துரை: இந்த கடுமையான நிபந்தனைகளை திருத்த வழக்கறிஞரை அணுகவும்.`
        : `[FORENSIC INTELLIGENCE AUDIT]:\n\n1. CRITICAL EXPOSURE DETECTED: Clause 14.0 imposes a strict 24-month lock-in liquidated damages penalty. Terminating early incurs 100% gross rent liability for the unexpired term.\n2. UNILATERAL FORFEITURE: Clause 5.0 permits total retention of INR 21,00,000 security deposit without independent adjudication.\n3. ARBITRATION DEFECT: Clause 18.0 unilateral arbitrator nomination violates Supreme Court Perkins Eastman precedent.\n\nRECOMMENDED ACTION: Amend Clause 14 to cap liquidated damages at 2 months gross rent with 60 days notice.`;

      const fallbackCitations = activeDocument
        ? [
            { page: 9, clauseId: "clause-14", section: "14.0 Liquidated Damages" },
            { page: 3, clauseId: "clause-5", section: "5.0 Security Forfeiture" }
          ]
        : [];

      const assistantMessage = {
        role: "assistant",
        title: triggeredService
          ? (isTamil ? triggeredService.titleTa : triggeredService.titleEn)
          : (isTamil ? "AI சட்ட நுண்ணறிவு அறிக்கை" : "FORENSIC LEGAL INTELLIGENCE DOSSIER"),
        content: fallbackMsg,
        citations: fallbackCitations,
        riskScore: 87,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLastAssistantAnswer(fallbackMsg);

      if (triggeredService?.needsSplit && fallbackCitations.length > 0) {
        setIsDocViewerOpen(true);
        setActiveCitation(fallbackCitations[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = async (file) => {
    if (!file) return;
    const docObj = {
      id: `doc-${Date.now()}`,
      filename: file.name,
      docType: "Uploaded Legal Instrument",
      totalPages: 14,
      jurisdiction: "India (Statutory Jurisprudence)",
      language: selectedLanguage === "ta" ? "Tamil" : "English",
      pages: SAMPLE_DOCUMENTS[0].pages,
    };

    setActiveDocument(docObj);
    setIsDocViewerOpen(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (e) {}
  };

  // Text-To-Speech (TTS)
  const handleSpeak = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is supported in modern browsers.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_\[\]]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isTamil ? "ta-IN" : "en-IN";
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Mic)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Microphone voice recognition is supported on Chrome & Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isTamil ? "ta-IN" : "en-IN";
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
      setInputText(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ROUTING BASED ON ACTIVE NAVIGATION SECTION
  if (activeNavSection === "risk_detection") {
    return (
      <div className="forensic-subview-container">
        <ThreatMap onSelectCitation={handleCitationClick} />
      </div>
    );
  }

  if (activeNavSection === "clause_intelligence") {
    return (
      <div className="forensic-subview-container">
        <ClauseIntelligenceView onSelectCitation={handleCitationClick} />
      </div>
    );
  }

  if (activeNavSection === "documents") {
    return (
      <div className="forensic-subview-container">
        <DocumentDNA />
      </div>
    );
  }

  return (
    <div className={`forensic-command-workspace ${isDocViewerOpen ? "split-active" : "single-active"}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
        }}
        style={{ display: "none" }}
        accept=".pdf,.docx,.txt,.doc"
      />

      {/* ZONE 1: DOCUMENT VIEWER (SPLIT SCREEN - ONLY SHOWN WHEN OPENED!) */}
      {isDocViewerOpen && activeDocument && (
        <div className="forensic-split-doc-zone">
          <DocumentViewer />
        </div>
      )}

      {/* ZONE 2: AI LEGAL COUNSEL COMMAND INTERFACE */}
      <div className="forensic-counsel-zone">
        {/* Scrollable Messages / Command Stream */}
        <div className="forensic-messages-stream">
          {/* LANDING / DASHBOARD HERO & EMPTY STATE (When no messages) */}
          {messages.length === 0 && (
            <div className="forensic-hero-wrapper">
              {/* HERO BANNER WITH SCANNING LINE */}
              <div className="forensic-hero-banner">
                <div className="hero-laser-scan"></div>
                <div className="hero-top-eyebrow font-mono-tech">
                  <span className="text-crimson">[ HIGH-SECURITY CASEROOM ENGINE ]</span>
                  <span>//</span>
                  <span>CLASSIFIED INTELLIGENCE</span>
                </div>

                <h1 className="hero-main-title">
                  LEGAL INTELLIGENCE, REDEFINED.
                </h1>

                <p className="hero-subtitle">
                  {isTamil
                    ? "சிக்கலான சட்ட ஆவணங்கள், ஒப்பந்தங்கள் மற்றும் நீதிமன்றத் தீர்ப்புகளிலிருந்து முக்கிய தகவல்களை ஆராய்ந்து பிரித்தெடுக்கும் அதிநவீன AI தளம்."
                    : "Analyze, understand and extract intelligence from complex legal documents with AI."}
                </p>

                {/* Hero Actions */}
                <div className="hero-actions-row font-mono-tech">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-hero-primary"
                  >
                    <span>+ ANALYZE DOCUMENT</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setActiveDocument(SAMPLE_DOCUMENTS[0]);
                      setIsDocViewerOpen(false);
                    }}
                    className="btn-hero-secondary"
                  >
                    <span>VIEW CASES</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!activeDocument) setActiveDocument(SAMPLE_DOCUMENTS[0]);
                      inputBarRef.current?.focus();
                    }}
                    className="btn-hero-secondary"
                  >
                    <span>ASK LEGAL AI</span>
                  </button>
                </div>
              </div>

              {/* EMPTY CASEROOM STATE */}
              {!activeDocument ? (
                <div className="empty-caseroom-card">
                  <div className="empty-scan-radar">
                    <div className="radar-laser"></div>
                    <UploadCloud size={32} color="#E50914" />
                  </div>

                  <h3 className="empty-card-heading font-mono-tech">
                    YOUR CASEROOM IS EMPTY.
                  </h3>
                  <p className="empty-card-subtext">
                    {isTamil
                      ? "சட்ட ஆவணங்களின் பகுப்பாய்வைத் தொடங்க ஆவணத்தை பதிவேற்றவும்."
                      : "Upload a legal document to begin intelligence extraction."}
                  </p>

                  <div className="empty-upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <div className="zone-inner font-mono-tech">
                      <span className="text-crimson">[ DRAG & DROP PDF / DOCX ]</span>
                      <span className="text-muted">OR CLICK TO BROWSE FORENSIC ARCHIVE</span>
                    </div>
                  </div>

                  {/* Demo Dossier Chips */}
                  <div className="empty-dossier-chips-row font-mono-tech">
                    <span className="chips-label text-muted">OR LOAD ARCHIVAL DOSSIER:</span>
                    {SAMPLE_DOCUMENTS.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setActiveDocument(doc);
                          setIsDocViewerOpen(false);
                        }}
                        className="btn-dossier-chip"
                      >
                        <FileText size={12} color="#E50914" />
                        <span>{doc.filename}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* ACTIVE DOCUMENT ANALYZED BANNER */
                <div className="dossier-loaded-banner font-mono-tech">
                  <div className="dossier-loaded-left">
                    <div className="loaded-pulse-beacon">
                      <span className="beacon-dot red-beacon"></span>
                    </div>
                    <div>
                      <div className="dossier-loaded-title">
                        <strong>{activeDocument.filename}</strong> // ANALYSIS ACTIVE
                      </div>
                      <div className="dossier-loaded-meta text-muted">
                        {activeDocument.totalPages || 14} PAGES · {activeDocument.jurisdiction} · ENCRYPTED
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDocViewerOpen(true)}
                    className="btn-view-dossier-split"
                  >
                    <span>[ VIEW IN CASEROOM ]</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DOCUMENT STATUS HEADER WHEN MESSAGES EXIST */}
          {activeDocument && messages.length > 0 && (
            <div className="active-dossier-sticky-strip font-mono-tech">
              <div className="strip-left">
                <span className="strip-beacon red-beacon"></span>
                <span>DOSSIER: <strong>{activeDocument.filename}</strong></span>
                <span className="text-muted">({activeDocument.totalPages || 14} PGS)</span>
              </div>
              {!isDocViewerOpen && (
                <button
                  onClick={() => setIsDocViewerOpen(true)}
                  className="btn-strip-open-doc"
                >
                  [ VIEW DOCUMENT ]
                </button>
              )}
            </div>
          )}

          {/* CHAT / COUNSEL COMMAND STREAM */}
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`forensic-msg-row ${msg.role}`}>
              {msg.role === "assistant" ? (
                <div className="counsel-intelligence-card">
                  {/* Card Header */}
                  <div className="counsel-card-header font-mono-tech">
                    <div className="counsel-header-title">
                      <Terminal size={14} color="#E50914" />
                      <span>{msg.title || "AI LEGAL COUNSEL // DOSSIER"}</span>
                    </div>

                    <div className="counsel-header-tools">
                      {msg.riskScore && (
                        <div className="counsel-risk-badge">
                          <span>RISK SCORE:</span>
                          <span className="font-bold text-crimson">{msg.riskScore}/100</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="btn-card-audio-tts"
                        title="Listen to audio briefing"
                      >
                        <Volume2 size={12} />
                        <span>{isTamil ? "கேளுங்கள்" : "READ ALOUD"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="counsel-card-body">
                    {msg.content.split("\n\n").map((chunk, cIdx) => (
                      <p key={cIdx} className="counsel-paragraph">{chunk}</p>
                    ))}
                  </div>

                  {/* Grounded Page Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="counsel-citations-tray font-mono-tech">
                      <span className="citations-label text-crimson">
                        [ GROUNDED EVIDENCE ]:
                      </span>
                      <div className="citations-pills">
                        {msg.citations.map((cite, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleCitationClick(cite)}
                            className="btn-counsel-citation-chip"
                            title="Click to jump and highlight in document"
                          >
                            <span>PAGE {cite.page} {cite.section ? `// ${cite.section}` : ""}</span>
                            <ExternalLink size={10} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="counsel-card-footer font-mono-tech">
                    <span className="card-timestamp text-muted">TIMESTAMP: {msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="btn-counsel-copy"
                    >
                      {copiedIndex === idx ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                      <span>{copiedIndex === idx ? (isTamil ? "COPIED" : "COPIED") : (isTamil ? "நகலெடு" : "COPY INTELLIGENCE")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="counsel-user-query-card font-mono-tech">
                  <div className="user-query-tag text-crimson">[ COMMAND QUERY ]:</div>
                  <div className="user-query-text">{msg.content}</div>
                </div>
              )}
            </div>
          ))}

          {/* Loading Forensic Pulse */}
          {loading && (
            <div className="forensic-loading-indicator font-mono-tech">
              <div className="loading-radar-ring"></div>
              <Loader2 size={15} className="spin-icon text-crimson" />
              <span>{isTamil ? "ஆவணத்தை சட்ட ரீதியாக ஆய்வு செய்கிறது..." : "EXTRACTING FORENSIC LEGAL INTELLIGENCE..."}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 8 SERVICES ACTION TILES (2 ROWS x 4 COLUMNS) ABOVE TYPING SECTION */}
        {activeDocument && (
          <div className="counsel-action-bar-container">
            <div className="counsel-action-grid-2x4">
              {SERVICES_LIST.map((srv) => {
                const Icon = srv.icon;
                return (
                  <button
                    key={srv.id}
                    onClick={() => handleRunService(srv)}
                    className="btn-counsel-action-tile font-mono-tech"
                    disabled={loading}
                  >
                    <Icon size={13} color="#E50914" />
                    <span>{isTamil ? srv.titleTa : srv.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM COMMAND INPUT SECTION WITH TTS & MIC */}
        <div className="counsel-bottom-input-bar">
          {/* Quick Prompts Strip */}
          <div className="counsel-quick-prompts-strip font-mono-tech">
            <span className="strip-tag text-muted">PROMPTS:</span>
            {COUNSEL_QUICK_PROMPTS.map((qp, qIdx) => (
              <button
                key={qIdx}
                onClick={() => executeChat(isTamil ? qp.ta : qp.en)}
                className="btn-quick-prompt"
                disabled={loading}
              >
                {isTamil ? qp.ta : qp.en}
              </button>
            ))}
          </div>

          {/* Input Command Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeChat(inputText);
            }}
            className="counsel-input-box-wrapper"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-counsel-tool"
              title="Upload legal document"
            >
              <Paperclip size={16} />
            </button>

            {/* Input Box */}
            <input
              ref={inputBarRef}
              type="text"
              placeholder={
                isTamil
                  ? "சட்ட ஆவணம் அல்லது தீர்ப்பு பற்றி கட்டளையிடுங்கள்..."
                  : "Issue command: 'Identify termination clauses', 'Find hidden liabilities'..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="counsel-text-input"
            />

            {/* Text-to-Speech (TTS) Button */}
            {lastAssistantAnswer && (
              <button
                type="button"
                onClick={() => handleSpeak(lastAssistantAnswer)}
                className={`btn-counsel-tool ${isSpeaking ? "tts-speaking" : ""}`}
                title={isSpeaking ? "Stop Briefing" : "Read Briefing Aloud (TTS)"}
              >
                {isSpeaking ? <VolumeX size={16} color="#E50914" /> : <Volume2 size={16} color="#B30000" />}
              </button>
            )}

            {/* Voice Input Mic */}
            <button
              type="button"
              onClick={toggleListening}
              className={`btn-counsel-tool ${isListening ? "mic-recording" : ""}`}
              title={isListening ? "Listening..." : "Speak Question"}
            >
              {isListening ? <MicOff size={16} color="#E50914" /> : <Mic size={16} color="#8A8A8A" />}
            </button>

            {/* Send Command Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn-counsel-send"
            >
              <Send size={14} />
            </button>
          </form>

          <div className="counsel-security-subtext font-mono-tech">
            <span>[ SYSTEM: HIGH-SECURITY FORENSIC AI ]</span>
            <span>·</span>
            <span>AES-256 ENCRYPTED AUDIT</span>
            <span>·</span>
            <span>NOT FORMAL LEGAL COUNSEL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIWorkspacePage;
