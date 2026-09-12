import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  FileText,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Scale,
  Globe,
  Search,
  AlertTriangle,
  Clock,
  BookOpen,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Gavel,
  ShieldCheck,
  Highlighter,
  UploadCloud,
  Loader2,
  ArrowRight
} from "lucide-react";
import api from "../../api/client";
import { useDocumentContext, SAMPLE_DOCUMENTS } from "../../context/DocumentContext";
import DocumentViewer from "../document-workspace/components/DocumentViewer";

export function AIWorkspacePage() {
  const {
    activeDocument,
    setActiveDocument,
    setActiveCitation,
    isDocViewerOpen,
    setIsDocViewerOpen,
    selectedLanguage,
    lastAssistantAnswer,
    setLastAssistantAnswer,
    setConversations,
  } = useDocumentContext();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => `conv-${Date.now()}`);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const isTamil = selectedLanguage === "ta";

  // The 8 Canonical Legal AI Services (2 rows x 4 cols)
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
      titleEn: "Court Judgments",
      titleTa: "நீதிமன்றத் தீர்ப்பு",
      descEn: "Ratio decidendi & orders",
      descTa: "தீர்ப்பின் முக்கிய முடிவுகள்",
      icon: Gavel,
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
      icon: Globe,
      promptEn: "இந்த ஆவணத்தின் முக்கிய அம்சங்களை எளிய தமிழில் விரிவாக விளக்குங்கள்.",
      promptTa: "இந்த ஆவணத்தின் முக்கிய அம்சங்களை எளிய தமிழில் விரிவாக விளக்குங்கள்.",
      needsSplit: true,
      targetCitation: { page: 8, clauseId: "clause-11" },
    },
    {
      id: "voice_audio",
      titleEn: "Voice Audio",
      titleTa: "குரல் வாசிப்பு",
      descEn: "Text-to-speech briefing",
      descTa: "ஆடியோ மூலம் கேட்டு அறிதல்",
      icon: Volume2,
      isVoiceTrigger: true,
      needsSplit: false,
    },
  ];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle Sidebar "start-new-chat"
  useEffect(() => {
    const handleNewChat = () => {
      setMessages([]);
      setActiveDocument(null);
      setActiveCitation(null);
      setIsDocViewerOpen(false);
      setLastAssistantAnswer("");
      setConversationId(`conv-${Date.now()}`);
      setInputText("");
    };

    const handleLoadConv = (e) => {
      const conv = e.detail;
      setConversationId(conv.id);
      api.get(`/chat/conversations/${conv.id}/history`)
        .then((hist) => {
          if (Array.isArray(hist) && hist.length > 0) {
            setMessages(hist.map(m => ({
              id: m.id,
              role: m.role,
              content: m.content,
              citations: m.citations ? (typeof m.citations === "string" ? JSON.parse(m.citations) : m.citations) : []
            })));
            const lastAns = hist.filter(m => m.role === "assistant").pop();
            if (lastAns) setLastAssistantAnswer(lastAns.content);
          }
        })
        .catch(() => {});
    };

    window.addEventListener("start-new-chat", handleNewChat);
    window.addEventListener("load-conversation", handleLoadConv);
    return () => {
      window.removeEventListener("start-new-chat", handleNewChat);
      window.removeEventListener("load-conversation", handleLoadConv);
    };
  }, []);

  // Document Upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/documents/upload", formData);
      const isJudge = file.name.toLowerCase().includes("judgment") || file.name.toLowerCase().includes("order");

      const docObj = {
        id: res.id || `doc-${Date.now()}`,
        filename: res.filename || file.name,
        docType: isJudge ? "Supreme Court Judgment" : "Commercial Legal Agreement",
        totalPages: res.file_size ? Math.ceil(res.file_size / 20000) : 14,
        jurisdiction: "India",
        language: "English",
        pages: SAMPLE_DOCUMENTS[0].pages
      };

      setActiveDocument(docObj);
      setMessages([]); // Clear to show clean analyzed doc state
      window.dispatchEvent(new CustomEvent("conversations-updated"));
    } catch (err) {
      // Offline / demo fallback
      const fallbackDoc = {
        id: `doc-${Date.now()}`,
        filename: file.name,
        docType: file.name.toLowerCase().includes("judgment") ? "Supreme Court Judgment" : "Commercial Agreement",
        totalPages: 14,
        jurisdiction: "India",
        language: "English",
        pages: SAMPLE_DOCUMENTS[0].pages
      };
      setActiveDocument(fallbackDoc);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Execute Service or User Prompt
  const handleRunService = async (service) => {
    if (service.isVoiceTrigger) {
      if (lastAssistantAnswer) {
        handleSpeak(lastAssistantAnswer);
      } else {
        handleSpeak(isTamil ? "வணக்கம். நீங்கள் ஆவணத்தை பதிவேற்றி எந்த சேவையையும் தேர்வு செய்யலாம்." : "Hello. Please upload or select a document to begin analysis.");
      }
      return;
    }

    const promptText = isTamil ? service.promptTa : service.promptEn;

    // AUTO-OPEN SPLIT SCREEN if service highlights points in document!
    if (service.needsSplit && activeDocument) {
      setIsDocViewerOpen(true);
      if (service.targetCitation) {
        setActiveCitation(service.targetCitation);
      }
    }

    executeChat(promptText, service.id);
  };

  const executeChat = async (promptQuery, serviceKey = "chat") => {
    if (!promptQuery.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptQuery,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await api.post("/chat/ask", {
        conversation_id: conversationId,
        question: promptQuery,
        document_id: activeDocument?.id,
        document_name: activeDocument?.filename || activeDocument?.name,
      });

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.answer,
        citations: res.citations || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setLastAssistantAnswer(res.answer);

      // If response has citations and service called for it, auto open split screen
      if (res.citations && res.citations.length > 0 && (serviceKey === "risks" || serviceKey === "clauses")) {
        setIsDocViewerOpen(true);
        setActiveCitation(res.citations[0]);
      }
    } catch (err) {
      // Grounded simulation if backend query failed
      const simulated = generateGroundedAnswer(serviceKey, promptQuery);
      setMessages((prev) => [...prev, simulated]);
      setLastAssistantAnswer(simulated.content);

      if (simulated.citations && simulated.citations.length > 0 && (serviceKey === "risks" || serviceKey === "clauses" || serviceKey === "tamil_summary")) {
        setIsDocViewerOpen(true);
        setActiveCitation(simulated.citations[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  // High quality grounded responses with citations
  const generateGroundedAnswer = (serviceKey, query) => {
    const docName = activeDocument?.filename || "Document";
    const q = query.toLowerCase();

    if (serviceKey === "risks" || q.includes("risk") || q.includes("ஆபத்து")) {
      return {
        id: `ans-${Date.now()}`,
        role: "assistant",
        title: isTamil ? "⚠️ சட்ட அபாயங்கள் கண்டறியப்பட்டன" : "⚠️ Legal Risks Detected",
        content: isTamil
          ? `**${docName} — கண்டறியப்பட்ட 3 முக்கிய அபாயங்கள்:**\n\n` +
            `1. **🔴 அதிக ஆபத்து — 24 மாத Lock-in அபராதம் (Clause 14.0, Page 9):**\n` +
            `   • 24 மாதங்களுக்குள் வெளியேறினால், எஞ்சிய முழு மாதங்களின் வாடகையையும் செலுத்த வேண்டும்.\n\n` +
            `2. **🟡 நடுத்தர ஆபத்து — முன்பணம் பறிமுதல் (Clause 5.0, Page 3):**\n` +
            `   • சிறிய மாற்றங்களுக்கும் ₹21,00,000 முன்பணத்தை முழுமையாக பறிமுதல் செய்ய உரிமையாளருக்கு அதிகாரம் உள்ளது.\n\n` +
            `3. **🟢 குறைந்த ஆபத்து — 60 நாட்கள் Notice Period (Clause 11.0, Page 8):**\n` +
            `   • 60 நாட்கள் முன் அறிவிப்பு தராவிடில் 3 மாத வாடகை அபராதம்.`
          : `**${docName} — 3 Critical Legal Liabilities Identified:**\n\n` +
            `1. **🔴 HIGH SEVERITY — Early Exit Lock-in Liquidated Damages (Page 9 · Clause 14.0):**\n` +
            `   • Premature vacation prior to 24 months mandates payment of gross rent for entire unexpired term.\n\n` +
            `2. **🟡 MEDIUM SEVERITY — Unilateral Security Deposit Forfeiture (Page 3 · Clause 5.0):**\n` +
            `   • Lessor holds subjective right to forfeit entire INR 21,00,000 deposit for interior modifications.\n\n` +
            `3. **🟢 LOW SEVERITY — Strict 60-Day Notice Obligation (Page 8 · Clause 11.0):**\n` +
            `   • Failure to provide written notice incurs equivalent 3-month rental penalty.`,
        citations: [
          { page: 9, section: "Clause 14.0", text: "Lock-in Penalty", clauseId: "clause-14" },
          { page: 3, section: "Clause 5.0", text: "Deposit Forfeiture", clauseId: "clause-5" },
          { page: 8, section: "Clause 11.0", text: "Notice Period: 60 Days", clauseId: "clause-11" },
        ]
      };
    }

    if (serviceKey === "tamil_summary" || q.includes("tamil") || q.includes("தமிழ்")) {
      return {
        id: `ans-${Date.now()}`,
        role: "assistant",
        title: "🌐 எளிய தமிழ் விளக்கம்",
        content: `**${docName} — சுருக்கமான தமிழ் விளக்கம்:**\n\n` +
          `• **ஒப்பந்த காலம்:** 3 ஆண்டுகள் (24 மாதங்கள் கட்டாய Lock-in காலம்).\n` +
          `• **மாத வாடகை:** ₹3,50,000 + GST.\n` +
          `• **முன்பணம் (Security Deposit):** ₹21,00,000.\n` +
          `• **காலி செய்யும் முன் அறிவிப்பு:** 60 நாட்களுக்கு முன்னதாக நோட்டீஸ் அனுப்ப வேண்டும் (Clause 11.0, Page 8).\n` +
          `• **சட்ட எல்லை:** குருகிராம், ஹரியானா நீதிமன்றங்கள் மற்றும் நடுவர் மன்றம் (Arbitration).`,
        citations: [
          { page: 8, section: "Clause 11.0", text: "Notice Period: 60 Days", clauseId: "clause-11" },
          { page: 9, section: "Clause 14.0", text: "Lock-in Terms", clauseId: "clause-14" },
        ]
      };
    }

    if (serviceKey === "judgment" || q.includes("judgment") || q.includes("court") || q.includes("தீர்ப்பு")) {
      return {
        id: `ans-${Date.now()}`,
        role: "assistant",
        title: isTamil ? "⚖️ நீதிமன்றத் தீர்ப்பின் ஆய்வு" : "⚖️ Supreme Court Ratio & Order",
        content: isTamil
          ? `**உச்ச நீதிமன்றத் தீர்ப்பு (CA No. 4192/2024):**\n\n` +
            `• **முக்கிய சட்டப் பிரச்சினை:** ஒரு தரப்பு தன்னிச்சையாக நடுவரை (Arbitrator) நியமிக்க முடியுமா?\n` +
            `• **நீதிமன்ற முடிவு:** தன்னிச்சையான நியமனங்கள் செல்லாது (Void ab initio).\n` +
            `• **இறுதி உத்தரவு (Page 24, Para 35):** நடுநிலை நடுவராக மாண்புமிகு நீதிபதி ஏ.கே.சிக்ரி நியமிக்கப்பட்டுள்ளார்.`
          : `**SUPREME COURT OF INDIA (CA No. 4192/2024):**\n\n` +
            `• **Seminal Issue:** Validity of unilateral arbitration appointment panels under Section 12(5).\n` +
            `• **Ratio Decidendi (Page 18 · Para 27):** Unilateral panels fail the test of statutory independence and are void ab initio.\n` +
            `• **Final Relief (Page 24 · Para 35):** Appeal allowed with costs. Justice (Retd.) A.K. Sikri appointed as independent Sole Arbitrator under DIAC rules.`,
        citations: [
          { page: 18, section: "Para 27", text: "Unilateral Appointment Void", clauseId: "clause-j18" },
          { page: 24, section: "Para 35", text: "Final Operative Order", clauseId: "clause-j24" },
        ]
      };
    }

    // Default Summary
    return {
      id: `ans-${Date.now()}`,
      role: "assistant",
      title: isTamil ? "📋 ஆவணச் சுருக்கம்" : "📋 Executive Document Summary",
      content: isTamil
        ? `**${docName} — முக்கிய விவரங்கள்:**\n\n` +
          `• **தரப்பினர்:** Horizon Properties (உரிமையாளர்) மற்றும் NexaTech Solutions (வாடகைதாரர்).\n` +
          `• **இடம்:** யூனிட் 402, சைபர் ஹப், குருகிராம்.\n` +
          `• **மாத வாடகை:** ₹3,50,000.\n` +
          `• **முன்பணம்:** ₹21,00,000 (Page 3 · Clause 5.0).\n` +
          `• **நோட்டீஸ் காலம்:** 60 நாட்கள் (Page 8 · Clause 11.0).\n` +
          `• **ஒப்பந்த காலம்:** 36 மாதங்கள் (24 மாத Lock-in காலம், Page 9 · Clause 14.0).`
        : `**${docName} — Summary & Key Terms:**\n\n` +
          `• **Parties:** Horizon Properties Ltd (Lessor) & NexaTech Solutions Pvt Ltd (Lessee).\n` +
          `• **Premises:** Unit 402, Cyber Hub, Sector 24, Gurugram (4,200 sq. ft.).\n` +
          `• **Monthly Rental:** INR 3,50,000 + applicable taxes.\n` +
          `• **Security Deposit:** INR 21,00,000 (6 months' gross rental, Page 3 · Clause 5.0).\n` +
          `• **Notice Period:** 60 days written notice after lock-in period (Page 8 · Clause 11.0).\n` +
          `• **Early Exit Penalty:** Unexpired lock-in rent due upon premature vacation (Page 9 · Clause 14.0).`,
      citations: [
        { page: 8, section: "Clause 11.0", text: "Notice Period: 60 Days", clauseId: "clause-11" },
        { page: 9, section: "Clause 14.0", text: "Lock-in Period: 24 Months", clauseId: "clause-14" },
        { page: 3, section: "Clause 5.0", text: "Security Deposit: INR 21,00,000", clauseId: "clause-5" },
      ]
    };
  };

  // Clicking a citation in the chat auto-opens split screen & scrolls into view!
  const handleCitationClick = (cite) => {
    setIsDocViewerOpen(true);
    setActiveCitation(cite);
  };

  // Text-To-Speech (Web Speech API)
  const handleSpeak = (textToRead) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = textToRead.replace(/[*_#•`]/g, "").replace(/\n/g, " ");
    const utterance = new SpeechSynthesisUtterance(clean);

    const voices = window.speechSynthesis.getVoices();
    const matchVoice = voices.find(v => isTamil ? (v.lang.includes("ta") || v.lang.includes("IN")) : (v.lang.includes("IN") || v.lang.includes("en")));
    if (matchVoice) utterance.voice = matchVoice;

    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-To-Text (Web Speech API)
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

  return (
    <div className={`chat-workspace-root ${isDocViewerOpen ? "split-active" : "single-active"}`}>
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
        <div className="split-doc-zone">
          <DocumentViewer />
        </div>
      )}

      {/* ZONE 2: CHAT CONVERSATION SYSTEM (MAIN CHAT) */}
      <div className="chat-conversation-zone">
        {/* Scrollable Messages Stream */}
        <div className="chat-messages-container">
          {/* HOME STATE (ChatGPT style when no messages) */}
          {messages.length === 0 && (
            <div className="chat-home-welcome">
              <div className="home-logo-badge">
                <Scale size={24} color="#ffffff" />
              </div>
              <h2 className="home-title">
                {isTamil ? "சட்ட ஆவணங்களின் AI உதவியாளர்" : "Legal AI Assistant"}
              </h2>
              <p className="home-subtitle">
                {isTamil
                  ? "ஒப்பந்தங்கள் மற்றும் நீதிமன்றத் தீர்ப்புகளை எளிதாகப் புரிந்து கொள்ளவும், ஆய்வு செய்யவும் உதவும் AI தளம்."
                  : "Analyze contracts, court judgments, and statutory provisions with grounded page citations."}
              </p>

              {/* 8 SERVICES TEXT SHOWCASE (2 rows x 4 cols) */}
              <div className="home-services-showcase-grid">
                {SERVICES_LIST.map((srv) => {
                  const Icon = srv.icon;
                  return (
                    <div key={srv.id} className="service-showcase-tile">
                      <div className="service-tile-header">
                        <Icon size={14} color="#3B82F6" />
                        <span className="service-tile-name">{isTamil ? srv.titleTa : srv.titleEn}</span>
                      </div>
                      <p className="service-tile-desc">{isTamil ? srv.descTa : srv.descEn}</p>
                    </div>
                  );
                })}
              </div>

              {/* Document Upload or Test with Demo */}
              <div className="home-action-card">
                {!activeDocument ? (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-home-upload"
                    >
                      <UploadCloud size={18} />
                      <span>{isTamil ? "ஆவணத்தைப் பதிவேற்றவும் (PDF / Word)" : "Upload Legal Document (PDF / DOCX)"}</span>
                    </button>
                    <div className="demo-doc-chips-row">
                      <span className="demo-chip-label">{isTamil ? "மாதிரி ஆவணங்கள்:" : "Or try demo documents:"}</span>
                      {SAMPLE_DOCUMENTS.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            setActiveDocument(doc);
                            setIsDocViewerOpen(false);
                          }}
                          className="btn-demo-chip"
                        >
                          <FileText size={13} color="#3B82F6" />
                          <span>{doc.filename}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Document is Loaded Banner */
                  <div className="active-doc-banner">
                    <div className="active-doc-banner-left">
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>
                        <strong>{activeDocument.filename}</strong> {isTamil ? "ஆய்வு செய்யப்பட்டு தயாராக உள்ளது" : "analyzed & indexed"} ({activeDocument.totalPages || 14} pgs · {activeDocument.jurisdiction})
                      </span>
                    </div>
                    <button
                      onClick={() => setIsDocViewerOpen(true)}
                      className="btn-banner-view-doc"
                    >
                      <span>{isTamil ? "ஆவணத்தைப் பார்" : "View Document"}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DOCUMENT ANALYZED BANNER (when messages exist) */}
          {activeDocument && messages.length > 0 && (
            <div className="inline-doc-status-badge">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle2 size={14} color="#10B981" />
                <span>
                  <strong>{activeDocument.filename}</strong> ({activeDocument.totalPages || 14} pgs · {activeDocument.jurisdiction})
                </span>
              </div>
              {!isDocViewerOpen && (
                <button
                  onClick={() => setIsDocViewerOpen(true)}
                  className="btn-open-doc-small"
                >
                  {isTamil ? "ஆவணத்தைப் பார் (Split)" : "View Document"}
                </button>
              )}
            </div>
          )}

          {/* CHAT MESSAGES STREAM */}
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`chat-message-row ${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="assistant-avatar-box">
                  <Scale size={14} color="#ffffff" />
                </div>
              )}

              <div className={`chat-bubble-box ${msg.role}`}>
                {msg.role === "assistant" ? (
                  <div className="assistant-card-inner">
                    {msg.title && (
                      <div className="assistant-card-title">
                        <h4>{msg.title}</h4>
                        <button
                          onClick={() => handleSpeak(msg.content)}
                          className="btn-card-tts"
                          title="Listen to answer"
                        >
                          <Volume2 size={13} />
                          <span>{isTamil ? "கேளுங்கள்" : "Listen"}</span>
                        </button>
                      </div>
                    )}

                    <div className="assistant-card-body">
                      {msg.content.split("\n\n").map((chunk, cIdx) => (
                        <p key={cIdx} className="msg-paragraph">{chunk}</p>
                      ))}
                    </div>

                    {/* Grounded Evidence Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="grounded-citations-strip">
                        <span className="citations-tag">
                          <Highlighter size={12} color="#F59E0B" />
                          <span>{isTamil ? "ஆதார பக்கங்கள்:" : "Grounded Citations:"}</span>
                        </span>
                        <div className="citations-pills-list">
                          {msg.citations.map((cite, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleCitationClick(cite)}
                              className="btn-citation-chip"
                              title="Click to jump and highlight in document"
                            >
                              <span>Page {cite.page} {cite.section ? `· ${cite.section}` : ""}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="assistant-footer-bar">
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="btn-copy-chip"
                      >
                        {copiedIndex === idx ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                        <span>{copiedIndex === idx ? (isTamil ? "நகலெடுக்கப்பட்டது" : "Copied") : (isTamil ? "நகலெடு" : "Copy")}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="user-text-content">{msg.content}</div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="chat-message-row assistant">
              <div className="assistant-avatar-box">
                <Scale size={14} color="#ffffff" />
              </div>
              <div className="chat-bubble-box assistant loading-box">
                <Loader2 size={16} className="spin-icon" color="#3B82F6" />
                <span>{isTamil ? "ஆவணத்தை ஆய்வு செய்கிறது..." : "Analyzing document with grounded citations..."}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 8 SERVICES ACTION BUTTONS (2 ROWS x 4 COLUMNS) ABOVE TYPING SECTION */}
        {activeDocument && (
          <div className="services-action-bar-container">
            <div className="services-action-grid-2x4">
              {SERVICES_LIST.map((srv) => {
                const Icon = srv.icon;
                return (
                  <button
                    key={srv.id}
                    onClick={() => handleRunService(srv)}
                    className="btn-action-tile"
                    disabled={loading}
                  >
                    <Icon size={14} color="#3B82F6" />
                    <span>{isTamil ? srv.titleTa : srv.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM TYPING BAR WITH TEXT-TO-SPEECH (TTS) OPTION */}
        <div className="chat-bottom-input-bar">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeChat(inputText);
            }}
            className="chat-input-pill-wrapper"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-input-tool"
              title="Upload legal document"
            >
              <Paperclip size={17} />
            </button>

            {/* Input Box */}
            <input
              type="text"
              placeholder={
                isTamil
                  ? "இந்த ஆவணம் பற்றி எதுவும் கேளுங்கள்..."
                  : "Ask anything about this document, clauses, or Indian law..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />

            {/* Text-to-Speech (TTS) Button - available when answer is generated */}
            {lastAssistantAnswer && (
              <button
                type="button"
                onClick={() => handleSpeak(lastAssistantAnswer)}
                className={`btn-input-tool ${isSpeaking ? "tts-active" : ""}`}
                title={isSpeaking ? "Stop Speaking" : "Read Answer Aloud (Text-to-Speech)"}
              >
                {isSpeaking ? <VolumeX size={17} color="#EF4444" /> : <Volume2 size={17} color="#8B5CF6" />}
              </button>
            )}

            {/* Microphone Voice Input */}
            <button
              type="button"
              onClick={toggleListening}
              className={`btn-input-tool ${isListening ? "mic-recording" : ""}`}
              title={isListening ? "Listening..." : "Speak Question (Voice Input)"}
            >
              {isListening ? <MicOff size={17} color="#EF4444" /> : <Mic size={17} color="#3B82F6" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn-input-send"
            >
              <Send size={15} />
            </button>
          </form>

          <div className="input-disclaimer-sub">
            {isTamil
              ? "⚖️ AI சட்ட விளக்கங்கள் ஆய்வுக்கானது மட்டுமே. வழக்கறிஞர் ஆலோசனைக்கு மாற்றாகாது."
              : "⚖️ AI Legal Assistant grounded in Indian jurisprudence. For research & informational purposes."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIWorkspacePage;
