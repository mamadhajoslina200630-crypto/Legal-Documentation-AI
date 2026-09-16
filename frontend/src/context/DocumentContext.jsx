import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const DocumentContext = createContext(null);

export const SAMPLE_DOCUMENTS = [
  {
    id: "doc-commercial-lease",
    filename: "Commercial_Lease_Agreement.pdf",
    docType: "Commercial Real Estate Lease",
    category: "contract",
    totalPages: 12,
    totalClauses: 87,
    jurisdiction: "India (Transfer of Property Act, 1882)",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "PARTIES & DEMISED PREMISES",
        content: `COMMERCIAL LEASE AGREEMENT\n\nThis Commercial Lease Agreement (the "Agreement") is executed on this 1st day of October, 2024 at Gurugram, Haryana.\n\nBETWEEN:\nHORIZON PROPERTIES PRIVATE LIMITED, a corporation registered under the Companies Act, 2013, having its corporate office at Horizon Cyber Towers, DLF Phase 2, Gurugram (hereinafter "Lessor")\n\nAND:\nNEXATECH SOLUTIONS PRIVATE LIMITED, a technology company incorporated under the Companies Act, 2013, having its registered office at Cyber City, Gurugram (hereinafter "Lessee").`,
        clauses: [
          {
            id: "clause-1",
            number: "1.0",
            title: "Premises Demised",
            text: "The Lessor hereby demises unto the Lessee all that commercial office suite comprising Unit 402, 4th Floor, Horizon Towers, Cyber Hub, Gurugram, containing approximately 4,200 square feet of super built-up area together with 4 reserved basement car parking spaces.",
            riskLevel: "LOW",
            riskExplanation: "Standard description of commercial premises and parking allotment."
          },
          {
            id: "clause-2",
            number: "2.1",
            title: "Term of Lease",
            text: "The initial lease term shall be for a fixed duration of sixty (60) calendar months commencing from October 15, 2024 ('Commencement Date') and concluding on October 14, 2029, unless terminated earlier in accordance with provisions herein.",
            riskLevel: "LOW",
            riskExplanation: "Standard 5-year commercial lease duration."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "SECURITY DEPOSIT & FORFEITURE",
        content: `3.0 FINANCIAL OBLIGATIONS & SECURITY ESCROW\n\n3.1 The Lessee shall remit a monthly gross base rental of INR 3,50,000 (Rupees Three Lakhs Fifty Thousand only) plus applicable GST, payable in advance on or before the 5th calendar day of each month.`,
        clauses: [
          {
            id: "clause-5",
            number: "5.0",
            title: "Security Deposit Forfeiture",
            text: "Lessor reserves the absolute and unfettered right to immediately forfeit the entire Security Deposit of INR 21,00,000 (Twenty-One Lakhs) in the event of any unauthorized interior fixture modification, operational irregularity, or alleged contractual default without prior judicial determination.",
            riskLevel: "MEDIUM",
            riskExplanation: "Allows landlord to forfeit 6 months security deposit without proof of pecuniary loss under Section 74 Indian Contract Act."
          }
        ]
      },
      {
        pageNumber: 8,
        title: "TERMINATION & NOTICE",
        content: `11.0 TERMINATION RIGHTS & VACATION PROTOCOL\n\n11.1 The parties recognize the commercial necessity of predictable tenure and orderly handover.`,
        clauses: [
          {
            id: "clause-11",
            number: "11.0",
            title: "Termination Notice Clause",
            text: "Either party may terminate this agreement with seven (7) days written notice. Upon expiration of said seven days, the Lessee must vacate the premises immediately, relinquishing all tenant leasehold fixtures without right of cure.",
            riskLevel: "HIGH",
            riskExplanation: "Disproportionately short 7-day notice is commercially hazardous for enterprise operations."
          }
        ]
      },
      {
        pageNumber: 9,
        title: "LOCK-IN PERIOD & ACCELERATED DAMAGES",
        content: `14.0 LOCK-IN OBLIGATIONS AND ACCELERATED DAMAGES\n\n14.1 The agreed lock-in duration of twenty-four (24) months is of the essence of this commercial transaction.`,
        clauses: [
          {
            id: "clause-14",
            number: "14.0",
            title: "Lock-in Penalty",
            text: "If Lessee terminates this Agreement prior to the expiration of twenty-four (24) months, Lessee shall immediately pay the gross rent for the entire unexpired lock-in period as liquidated damages, irrespective of whether Lessor re-lets the premises.",
            riskLevel: "CRITICAL",
            riskExplanation: "Penal acceleration clause violating statutory duty to mitigate damages under Indian contract law."
          }
        ]
      },
      {
        pageNumber: 12,
        title: "DISPUTE RESOLUTION & ARBITRATION",
        content: `18.0 ARBITRATION AND GOVERNING LAW\n\n18.1 This Agreement shall be construed and enforced according to the laws of the Republic of India.`,
        clauses: [
          {
            id: "clause-18",
            number: "18.0",
            title: "Sole Arbitrator Appointment",
            text: "All disputes and controversies arising hereunder shall be referred to a sole arbitrator appointed unilaterally and exclusively by the Managing Director of the Lessor. The venue and seat of arbitration shall be Gurugram, Haryana.",
            riskLevel: "HIGH",
            riskExplanation: "Unilateral arbitrator appointments violate Section 12(5) and Schedule VII of the Arbitration and Conciliation Act (Perkins Eastman principle)."
          }
        ]
      }
    ]
  },
  {
    id: "doc-supreme-court-judgment",
    filename: "Perkins_Eastman_Architects_vs_HSCC_SC_Judgment.pdf",
    docType: "Supreme Court Judgment",
    category: "judgment",
    totalPages: 18,
    totalClauses: 34,
    jurisdiction: "Supreme Court of India (Civil Appellate Jurisdiction)",
    language: "English",
    citation: "(2020) 15 SCC 760",
    bench: "Hon'ble Dr. Justice D.Y. Chandrachud & Hon'ble Justice Ajay Rastogi",
    pages: [
      {
        pageNumber: 1,
        title: "IN THE SUPREME COURT OF INDIA - ARBITRATION APPLICATION NO. 32 OF 2019",
        content: `IN THE SUPREME COURT OF INDIA\nCIVIL ORIGINAL JURISDICTION\nARBITRATION APPLICATION NO. 32 OF 2019\n\nPerkins Eastman Architects DPC & Anr. ... Petitioners\nVERSUS\nHSCC (India) Ltd. ... Respondent\n\nJUDGMENT\nUday Umesh Lalit, J.\n\n1. This application under Section 11(6) read with Section 11(12)(a) of the Arbitration and Conciliation Act, 1996 prays for appointment of a sole arbitrator in terms of Clause 24 of the Contract Agreement dated 22.05.2017 executed between the parties.`,
        clauses: [
          {
            id: "clause-sc-1",
            number: "Para 1",
            title: "Application under Section 11(6)",
            text: "Application filed before the Supreme Court seeking appointment of an independent sole arbitrator after the Respondent's Chief Managing Director purported to unilaterally appoint a sole arbitrator.",
            riskLevel: "LOW",
            riskExplanation: "Procedural invoking of Supreme Court appointment jurisdiction under Section 11(6)."
          }
        ]
      },
      {
        pageNumber: 8,
        title: "ISSUE: UNILATERAL APPOINTMENT BY INTERESTED PARTY",
        content: `14. The core issue falling for determination is whether a person who has become ineligible by operation of law under Section 12(5) read with Schedule VII of the Arbitration Act, is still eligible to nominate another person as the sole arbitrator.`,
        clauses: [
          {
            id: "clause-sc-14",
            number: "Para 14",
            title: "Legal Ineligibility to Nominate",
            text: "A person having an interest in the outcome or decision of the dispute must not have the power to appoint a sole arbitrator. What cannot be done directly by an interested party cannot be permitted to be done indirectly through unilateral nomination.",
            riskLevel: "CRITICAL",
            riskExplanation: "Supreme Court ratio: Extends TRF Ltd principle to disqualify interested parties from appointing even independent nominees."
          }
        ]
      },
      {
        pageNumber: 15,
        title: "OPERATIVE DECISION & RATIO DECIDENDI",
        content: `21. In our considered view, the appointment of a sole arbitrator by the Chief Managing Director of the Respondent cannot be sustained in law. Independence and impartiality of the arbitral tribunal are the hallmarks of modern arbitration.\n\n22. We accordingly allow the application and appoint Hon'ble Dr. Justice A.K. Sikri, former Judge of this Court, as the sole arbitrator to adjudicate all disputes between the parties.`,
        clauses: [
          {
            id: "clause-sc-21",
            number: "Para 21",
            title: "Final Decision & Appointment of Neutral Arbitrator",
            text: "Unilateral appointment by CMD set aside as void and contrary to statutory neutrality. Former Supreme Court Judge appointed as independent sole arbitrator.",
            riskLevel: "LOW",
            riskExplanation: "Final operative disposition and appointment order of the Supreme Court."
          }
        ]
      }
    ]
  },
  {
    id: "doc-employment-contract",
    filename: "Employment_Agreement.pdf",
    docType: "Executive Employment Contract",
    category: "contract",
    totalPages: 8,
    totalClauses: 42,
    jurisdiction: "India (Industrial Disputes & Contract Act)",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "APPOINTMENT & ROLE",
        content: `EXECUTIVE EMPLOYMENT AGREEMENT\n\nExecuted on 12th July 2024 between Apex Labs Private Limited ("Company") and Devendra Sharma ("Executive").`,
        clauses: [
          {
            id: "clause-emp-1",
            number: "1.1",
            title: "Position & Duties",
            text: "Executive is engaged as Vice President of Engineering, reporting to the Chief Technology Officer.",
            riskLevel: "LOW",
            riskExplanation: "Standard corporate executive title and reporting hierarchy."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "POST-EMPLOYMENT RESTRICTIONS",
        content: `3.0 RESTRICTIVE COVENANTS\n\n3.1 Executive acknowledges access to vital technological trade secrets and customer proprietary frameworks.`,
        clauses: [
          {
            id: "clause-emp-3",
            number: "3.2",
            title: "Non-Compete Restriction",
            text: "For a period of thirty-six (36) months post-separation, the Executive shall not directly or indirectly engage with, consult for, or establish any entity competing in software services within India or Southeast Asia.",
            riskLevel: "CRITICAL",
            riskExplanation: "Section 27 of the Indian Contract Act declares agreements in restraint of trade void. Post-employment non-competes are unenforceable in India."
          }
        ]
      },
      {
        pageNumber: 6,
        title: "INTELLECTUAL PROPERTY & TERMINATION",
        content: `7.0 INTELLECTUAL PROPERTY ASSIGNMENT\n\n7.1 Executive assigns all worldwide patent, copyright, and trade secret claims.`,
        clauses: [
          {
            id: "clause-emp-10",
            number: "10.4",
            title: "Summary Dismissal",
            text: "The Company may terminate employment with zero (0) days notice and without severance payment if Management determines in its subjective discretion that Executive failed to meet quarterly milestones.",
            riskLevel: "HIGH",
            riskExplanation: "Subjective summary termination without notice or cure period violates natural justice principles."
          }
        ]
      }
    ]
  },
  {
    id: "doc-nda-confidentiality",
    filename: "Mutual_NDA_Agreement.pdf",
    docType: "Non-Disclosure & Trade Secret Agreement",
    category: "contract",
    totalPages: 5,
    totalClauses: 28,
    jurisdiction: "India (Commercial Law)",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "PREAMBLE & DEFINITION",
        content: `MUTUAL NON-DISCLOSURE AGREEMENT\n\nEntered into between Veloce AI Private Limited and Strata Cloud Systems Private Limited on August 20, 2024.`,
        clauses: [
          {
            id: "clause-nda-1",
            number: "1.0",
            title: "Scope of Confidentiality",
            text: "Confidential Information encompasses all non-public technical, product roadmap, financial, and customer data disclosed in oral, written, or machine-readable format.",
            riskLevel: "LOW",
            riskExplanation: "Standard bilateral confidentiality definition."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "DURATION & EQUITABLE REMEDIES",
        content: `4.0 TERM OF OBLIGATION & SURVIVAL`,
        clauses: [
          {
            id: "clause-nda-4",
            number: "4.1",
            title: "Indefinite Duration",
            text: "The obligations of non-disclosure and non-use under this Agreement shall endure in perpetuity from the date of disclosure, surviving indefinitely without sunset or termination.",
            riskLevel: "MEDIUM",
            riskExplanation: "Perpetual duration on commercial data creates excessive compliance liability; 3-5 years is industry standard."
          },
          {
            id: "clause-nda-9",
            number: "9.2",
            title: "Automatic Injunction Waiver",
            text: "The Receiving Party agrees that money damages are inadequate and irrevocably consents to immediate preliminary injunction without requirement for the Disclosing Party to post bond or establish irreparable harm.",
            riskLevel: "HIGH",
            riskExplanation: "Waiving bond requirements and conceding injunction without evidentiary scrutiny limits Order XXXIX CPC defenses."
          }
        ]
      }
    ]
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: "conv-lease",
    title: "Commercial Lease Agreement",
    timeCategory: "today",
    updatedAt: "10 mins ago",
    document: SAMPLE_DOCUMENTS[0],
    isSplitViewOpen: true,
    activeHighlightId: "clause-11",
    messages: [
      {
        id: "msg-doc-1",
        sender: "system",
        type: "attachment",
        filename: "Commercial_Lease_Agreement.pdf",
        pages: 12,
        clauses: 87,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-welcome-1",
        sender: "ai",
        type: "welcome_actions",
        docType: "Commercial Real Estate Lease",
        filename: "Commercial_Lease_Agreement.pdf",
        totalPages: 12,
        totalClauses: 87,
        jurisdiction: "India (Transfer of Property Act, 1882)",
        language: "English",
        text: "I've analyzed your Commercial Lease Agreement. What would you like to know?",
        timestamp: "10:40 AM",
        recommendedActions: [
          { key: "summarize", label: "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract key information including financials, lock-in duration, and covenants." },
          { key: "detectRisks", label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks, liabilities, and one-sided clauses in this document." }
        ],
        otherActions: [
          { key: "understand", label: "Understand", service: "understand", prompt: "Explain this legal document in plain and clear terms." },
          { key: "simplify", label: "Simplify / Plain Tamil", service: "simplify", prompt: "Explain this document in plain and simple Tamil." },
          { key: "askDoc", label: "Ask Document", service: "askDoc", prompt: "What are the primary remedies and termination rights under this agreement?" },
          { key: "compare", label: "Compare Market", service: "compare", prompt: "Compare standard market terms against the provisions drafted in this agreement." }
        ]
      },
      {
        id: "msg-2",
        sender: "user",
        text: "Detect risks in this document.",
        timestamp: "10:42 AM"
      },
      {
        id: "msg-3",
        sender: "ai",
        type: "risk_result",
        text: "I found 4 areas that require legal attention, including severe lock-in damages and unilateral arbitration.",
        timestamp: "10:42 AM",
        serviceId: "detectRisks",
        riskFindings: [
          {
            id: "01",
            clauseNumber: "11.0",
            clauseId: "clause-11",
            page: 8,
            title: "Termination Notice Clause",
            riskLevel: "HIGH",
            summary: "Either party may terminate with seven (7) days written notice. This provision allows termination with an unusually short notice period, causing acute operational disruption."
          },
          {
            id: "02",
            clauseNumber: "14.0",
            clauseId: "clause-14",
            page: 9,
            title: "Lock-in Penalty",
            riskLevel: "CRITICAL",
            summary: "Demands full unexpired rent for 24 months as liquidated damages. Indian contract jurisprudence requires proof of actual injury and duty to mitigate."
          },
          {
            id: "03",
            clauseNumber: "18.0",
            clauseId: "clause-18",
            page: 12,
            title: "Sole Arbitrator Appointment",
            riskLevel: "HIGH",
            summary: "Lessor reserves exclusive right to unilaterally appoint the sole arbitrator. Unilateral appointments are invalid under Perkins Eastman principles."
          },
          {
            id: "04",
            clauseNumber: "5.0",
            clauseId: "clause-5",
            page: 3,
            title: "Security Deposit Forfeiture",
            riskLevel: "MEDIUM",
            summary: "Lessor reserves the sole right to forfeit INR 21,00,000 for alleged defaults without prior judicial or arbitral determination."
          }
        ],
        citations: [
          { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
          { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" },
          { label: "Page 12 · Clause 18.0", page: 12, clauseId: "clause-18" },
          { label: "Page 3 · Clause 5.0", page: 3, clauseId: "clause-5" }
        ],
        nextActions: [
          { label: "Explain High Risk Clause", service: "simplify", prompt: "Explain Clause 11.0 and Clause 14.0 in simple terms." },
          { label: "Extract Key Information", service: "keyInfo", prompt: "Extract key financial terms, lock-in duration, and deposit details." },
          { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ஆவணத்தின் அபாயங்களை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
          { label: "Compare with Market", service: "compare", prompt: "Compare these termination and lock-in terms with standard commercial practice." }
        ]
      }
    ]
  },
  {
    id: "conv-sc-judgment",
    title: "Supreme Court Judgment",
    timeCategory: "today",
    updatedAt: "1 hour ago",
    document: SAMPLE_DOCUMENTS[1],
    isSplitViewOpen: true,
    activeHighlightId: "clause-sc-14",
    messages: [
      {
        id: "msg-sc-doc",
        sender: "system",
        type: "attachment",
        filename: "Perkins_Eastman_Architects_vs_HSCC_SC_Judgment.pdf",
        pages: 18,
        clauses: 34,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-sc-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Supreme Court Judgment",
        filename: "Perkins_Eastman_Architects_vs_HSCC_SC_Judgment.pdf",
        totalPages: 18,
        totalClauses: 34,
        jurisdiction: "Supreme Court of India",
        language: "English",
        text: "I've analyzed your Supreme Court Judgment (Perkins Eastman v. HSCC). What would you like to know?",
        timestamp: "09:15 AM",
        recommendedActions: [
          { key: "judgment_summarize", label: "Summarize Judgment", service: "judgment", prompt: "Summarize this Supreme Court judgment and key rulings." },
          { key: "judgment_decision", label: "What did the Court decide?", service: "judgment", prompt: "What did the Court decide and what is the final operative order?" },
          { key: "judgment_issues", label: "Key Legal Issues", service: "judgment", prompt: "What are the core legal issues and statutory questions framed by the Court?" }
        ],
        otherActions: [
          { key: "judgment_reasoning", label: "Court's Reasoning", service: "judgment", prompt: "Explain the Court's ratio decidendi and legal reasoning." },
          { key: "simplify", label: "Simplify Judgment", service: "simplify", prompt: "Explain this judgment in plain everyday terms." },
          { key: "askDoc", label: "Ask the Judgment", service: "askDoc", prompt: "How does this precedent apply to unilateral appointments in contracts?" },
          { key: "voice", label: "🎙 Explain by Voice", action: "voice" }
        ]
      }
    ]
  },
  {
    id: "conv-employment",
    title: "Executive Employment Agreement",
    timeCategory: "yesterday",
    updatedAt: "Yesterday",
    document: SAMPLE_DOCUMENTS[2],
    isSplitViewOpen: true,
    activeHighlightId: "clause-emp-3",
    messages: [
      {
        id: "msg-emp-doc",
        sender: "system",
        type: "attachment",
        filename: "Employment_Agreement.pdf",
        pages: 8,
        clauses: 42,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-emp-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Executive Employment Contract",
        filename: "Employment_Agreement.pdf",
        totalPages: 8,
        totalClauses: 42,
        jurisdiction: "India (Industrial Disputes & Contract Act)",
        language: "English",
        text: "I've analyzed your Executive Employment Agreement. What would you like to know?",
        timestamp: "Yesterday, 4:10 PM",
        recommendedActions: [
          { key: "summarize", label: "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract key information including compensation, notice period, and covenants." },
          { key: "detectRisks", label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks, non-compete liabilities, and termination clauses." }
        ],
        otherActions: [
          { key: "simplify", label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த வேலை ஒப்பந்தத்தின் முக்கிய விதிகளை எளிய தமிழில் விளக்குங்கள்." },
          { key: "askDoc", label: "Ask Document", service: "askDoc", prompt: "Is the 36-month non-compete clause enforceable under Section 27 of Indian Contract Act?" },
          { key: "compare", label: "Compare Market", service: "compare", prompt: "Compare these executive terms against Indian corporate standards." }
        ]
      }
    ]
  },
  {
    id: "conv-nda",
    title: "Mutual NDA Agreement",
    timeCategory: "previous7Days",
    updatedAt: "3 days ago",
    document: SAMPLE_DOCUMENTS[3],
    isSplitViewOpen: true,
    activeHighlightId: "clause-nda-4",
    messages: [
      {
        id: "msg-nda-doc",
        sender: "system",
        type: "attachment",
        filename: "Mutual_NDA_Agreement.pdf",
        pages: 5,
        clauses: 28,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-nda-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Non-Disclosure & Trade Secret Agreement",
        filename: "Mutual_NDA_Agreement.pdf",
        totalPages: 5,
        totalClauses: 28,
        jurisdiction: "India (Commercial Law)",
        language: "English",
        text: "I've analyzed your Mutual NDA Agreement. What would you like to know?",
        timestamp: "3 days ago",
        recommendedActions: [
          { key: "summarize", label: "Summarize", service: "summarize", prompt: "Summarize this NDA's confidentiality scope and term." },
          { key: "detectRisks", label: "Detect Risks", service: "detectRisks", prompt: "Are there perpetual confidentiality terms or automatic injunction waivers?" },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract definition of confidential information and exclusions." }
        ],
        otherActions: [
          { key: "simplify", label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ரகசிய ஒப்பந்தத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
          { key: "compare", label: "Compare Market", service: "compare", prompt: "Compare perpetual confidentiality against 3-year market standard." }
        ]
      }
    ]
  }
];

export function DocumentProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("legal_ai_conversations_v5");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load stored conversations", e);
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id || "conv-lease");
  const [language, setLanguage] = useState(() => localStorage.getItem("legal_ai_lang") || "en");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;

  useEffect(() => {
    try {
      localStorage.setItem("legal_ai_conversations_v4", JSON.stringify(conversations));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("legal_ai_lang", language);
  }, [language]);

  const handleToggleSpeech = (messageId, textToRead) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (language === "ta") {
      const taVoice = voices.find((v) => v.lang.includes("ta") || v.name.includes("Tamil"));
      if (taVoice) utterance.voice = taVoice;
    } else {
      const enVoice = voices.find((v) => (v.lang.includes("en-US") || v.lang.includes("en-GB")) && v.name.includes("Natural"));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const selectConversation = (id) => {
    if (speakingMessageId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }
    setActiveConversationId(id);
    setIsMobileSidebarOpen(false);
  };

  const createNewChat = () => {
    if (speakingMessageId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }

    const newId = `conv-${Date.now()}`;
    const newChatObj = {
      id: newId,
      title: language === "ta" ? "புதிய உரையாடல்" : "New Conversation",
      timeCategory: "today",
      updatedAt: "Just now",
      document: null,
      messages: [],
      isSplitViewOpen: false,
      activeHighlightId: null
    };

    setConversations([newChatObj, ...conversations]);
    setActiveConversationId(newId);
    setIsMobileSidebarOpen(false);
  };

  const uploadDocument = (fileOrSample = null) => {
    let docObj = SAMPLE_DOCUMENTS[0]; // default commercial lease

    if (fileOrSample && typeof fileOrSample === "object" && fileOrSample.pages) {
      docObj = fileOrSample;
    } else if (typeof fileOrSample === "string") {
      const matched = SAMPLE_DOCUMENTS.find((d) => d.id === fileOrSample);
      if (matched) docObj = matched;
    } else if (fileOrSample && fileOrSample.name) {
      const isJudgment = fileOrSample.name.toLowerCase().includes("judgment") || fileOrSample.name.toLowerCase().includes("order");
      docObj = {
        id: `custom-doc-${Date.now()}`,
        filename: fileOrSample.name,
        docType: isJudgment ? "Court Judgment / Order" : "Legal Contract / Agreement",
        category: isJudgment ? "judgment" : "contract",
        totalPages: 14,
        totalClauses: 56,
        jurisdiction: isJudgment ? "Supreme Court / High Court of India" : "Republic of India",
        language: "English",
        pages: isJudgment ? SAMPLE_DOCUMENTS[1].pages : SAMPLE_DOCUMENTS[0].pages
      };
    }

    const isJudgment = docObj.category === "judgment" || docObj.filename.toLowerCase().includes("judgment");

    const attachmentMsg = {
      id: `msg-doc-${Date.now()}`,
      sender: "system",
      type: "attachment",
      filename: docObj.filename,
      pages: docObj.totalPages,
      clauses: docObj.totalClauses,
      format: docObj.filename.endsWith(".docx") ? "DOCX" : docObj.filename.endsWith(".txt") ? "TXT" : "PDF",
      language: docObj.language || "English",
      status: "received" // received -> reading -> identifying -> understanding -> ready
    };

    const targetConvId = activeConversationId;

    // 1. Initial State: Received
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          const updatedTitle = docObj.filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
          return {
            ...c,
            title: updatedTitle,
            document: docObj,
            messages: [...c.messages, attachmentMsg]
          };
        }
        return c;
      })
    );

    // 2. Reading document (500ms)
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map((m) => (m.id === attachmentMsg.id ? { ...m, status: "reading" } : m))
            };
          }
          return c;
        })
      );

      // 3. Identifying structure (1000ms)
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map((m) => (m.id === attachmentMsg.id ? { ...m, status: "identifying" } : m))
              };
            }
            return c;
          })
        );

        // 4. Understanding clauses (1600ms)
        setTimeout(() => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === targetConvId) {
                return {
                  ...c,
                  messages: c.messages.map((m) => (m.id === attachmentMsg.id ? { ...m, status: "understanding" } : m))
                };
              }
              return c;
            })
          );

          // 5. Ready & Emit AI Classification Welcome Message (2200ms)
          setTimeout(() => {
            const welcomeAiMsg = {
              id: `msg-welcome-${Date.now()}`,
              sender: "ai",
              type: "welcome_actions",
              docType: docObj.docType,
              filename: docObj.filename,
              totalPages: docObj.totalPages,
              totalClauses: docObj.totalClauses,
              category: docObj.category,
              jurisdiction: docObj.jurisdiction,
              language: docObj.language,
              text: language === "ta"
                ? `உங்கள் ${docObj.docType}-ஐ நான் ஆய்வு செய்துள்ளேன். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?`
                : `I've analyzed your ${docObj.docType}. What would you like to know?`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              recommendedActions: isJudgment
                ? [
                    { key: "judgment_summarize", label: language === "ta" ? "தீர்ப்பின் சுருக்கம்" : "Summarize Judgment", service: "judgment", prompt: "Summarize this Supreme Court judgment and key rulings." },
                    { key: "judgment_decision", label: language === "ta" ? "நீதிமன்ற முடிவு என்ன?" : "What did the Court decide?", service: "judgment", prompt: "What did the Court decide and what is the final operative order?" },
                    { key: "judgment_issues", label: language === "ta" ? "முக்கிய சட்டப் பிரச்சினைகள்" : "Key Legal Issues", service: "judgment", prompt: "What are the core legal issues and statutory questions framed by the Court?" }
                  ]
                : [
                    { key: "summarize", label: language === "ta" ? "ஆவணச் சுருக்கம்" : "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
                    { key: "keyInfo", label: language === "ta" ? "முக்கிய தகவல்கள்" : "Key Information", service: "keyInfo", prompt: "Extract key information including financials, lock-in duration, and covenants." },
                    { key: "detectRisks", label: language === "ta" ? "அபாயங்களைக் கண்டறி" : "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks, liabilities, and one-sided clauses in this document." }
                  ],
              otherActions: isJudgment
                ? [
                    { key: "judgment_reasoning", label: language === "ta" ? "நீதிமன்ற நியாயவாதம்" : "Court's Reasoning", service: "judgment", prompt: "Explain the Court's ratio decidendi and legal reasoning." },
                    { key: "simplify", label: language === "ta" ? "எளிய தமிழில் விளக்கு" : "Simplify Judgment", service: "simplify", prompt: "Explain this judgment in plain everyday terms." },
                    { key: "askDoc", label: language === "ta" ? "தீர்ப்பிடம் கேள்" : "Ask the Judgment", service: "askDoc", prompt: "How does this precedent apply to unilateral appointments in contracts?" },
                    { key: "voice", label: language === "ta" ? "🎙 குரல் மூலம் கேள்" : "🎙 Explain by Voice", action: "voice" }
                  ]
                : [
                    { key: "understand", label: language === "ta" ? "விளக்கம்" : "Understand", service: "understand", prompt: "Explain this legal document in plain and clear terms." },
                    { key: "simplify", label: language === "ta" ? "எளிய தமிழில்" : "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ஆவணத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
                    { key: "askDoc", label: language === "ta" ? "ஆவணத்திடம் கேள்" : "Ask Document", service: "askDoc", prompt: "What are the primary remedies and termination rights under this agreement?" },
                    { key: "compare", label: language === "ta" ? "சந்தை ஒப்பீடு" : "Compare Market", service: "compare", prompt: "Compare standard market terms against the provisions drafted in this agreement." }
                  ]
            };

            setConversations((prev) =>
              prev.map((c) => {
                if (c.id === targetConvId) {
                  return {
                    ...c,
                    isSplitViewOpen: window.innerWidth > 960, // 3-zone on desktop
                    messages: [
                      ...c.messages.map((m) => (m.id === attachmentMsg.id ? { ...m, status: "ready" } : m)),
                      welcomeAiMsg
                    ]
                  };
                }
                return c;
              })
            );
          }, 600);
        }, 600);
      }, 500);
    }, 500);
  };

  const openDocument = (docId) => {
    if (speakingMessageId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }

    const existing = conversations.find((c) => c.document?.id === docId);
    if (existing) {
      setActiveConversationId(existing.id);
      setIsMobileSidebarOpen(false);
      return;
    }

    const docObj = SAMPLE_DOCUMENTS.find((d) => d.id === docId) || SAMPLE_DOCUMENTS[0];
    const newId = `conv-${docObj.id}-${Date.now()}`;
    const isJudgment = docObj.category === "judgment" || docObj.filename.toLowerCase().includes("judgment");

    const newChat = {
      id: newId,
      title: docObj.filename.replace(/\.pdf$/, "").replace(/_/g, " "),
      timeCategory: "today",
      updatedAt: "Just now",
      document: docObj,
      isSplitViewOpen: true,
      activeHighlightId: null,
      messages: [
        {
          id: `msg-doc-${Date.now()}`,
          sender: "system",
          type: "attachment",
          filename: docObj.filename,
          pages: docObj.totalPages,
          clauses: docObj.totalClauses,
          format: "PDF",
          language: docObj.language,
          status: "ready"
        },
        {
          id: `msg-welcome-${Date.now()}`,
          sender: "ai",
          type: "welcome_actions",
          docType: docObj.docType,
          filename: docObj.filename,
          totalPages: docObj.totalPages,
          totalClauses: docObj.totalClauses,
          category: docObj.category,
          jurisdiction: docObj.jurisdiction,
          language: docObj.language,
          text: language === "ta"
            ? `உங்கள் ${docObj.docType}-ஐ நான் ஆய்வு செய்துள்ளேன். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?`
            : `I've analyzed your ${docObj.docType}. What would you like to know?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          recommendedActions: isJudgment
            ? [
                { key: "judgment_summarize", label: language === "ta" ? "தீர்ப்பின் சுருக்கம்" : "Summarize Judgment", service: "judgment", prompt: "Summarize this Supreme Court judgment and key rulings." },
                { key: "judgment_decision", label: language === "ta" ? "நீதிமன்ற முடிவு என்ன?" : "What did the Court decide?", service: "judgment", prompt: "What did the Court decide and what is the final operative order?" },
                { key: "judgment_issues", label: language === "ta" ? "முக்கிய சட்டப் பிரச்சினைகள்" : "Key Legal Issues", service: "judgment", prompt: "What are the core legal issues and statutory questions framed by the Court?" }
              ]
            : [
                { key: "summarize", label: language === "ta" ? "ஆவணச் சுருக்கம்" : "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
                { key: "keyInfo", label: language === "ta" ? "முக்கிய தகவல்கள்" : "Key Information", service: "keyInfo", prompt: "Extract key information including financials, lock-in duration, and covenants." },
                { key: "detectRisks", label: language === "ta" ? "அபாயங்களைக் கண்டறி" : "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks, liabilities, and one-sided clauses in this document." }
              ],
          otherActions: isJudgment
            ? [
                { key: "judgment_reasoning", label: language === "ta" ? "நீதிமன்ற நியாயவாதம்" : "Court's Reasoning", service: "judgment", prompt: "Explain the Court's ratio decidendi and legal reasoning." },
                { key: "simplify", label: language === "ta" ? "எளிய தமிழில் விளக்கு" : "Simplify Judgment", service: "simplify", prompt: "Explain this judgment in plain everyday terms." },
                { key: "askDoc", label: language === "ta" ? "தீர்ப்பிடம் கேள்" : "Ask the Judgment", service: "askDoc", prompt: "How does this precedent apply to unilateral appointments in contracts?" },
                { key: "voice", label: language === "ta" ? "🎙 குரல் மூலம் கேள்" : "🎙 Explain by Voice", action: "voice" }
              ]
            : [
                { key: "understand", label: language === "ta" ? "விளக்கம்" : "Understand", service: "understand", prompt: "Explain this legal document in plain and clear terms." },
                { key: "simplify", label: language === "ta" ? "எளிய தமிழில்" : "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ஆவணத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
                { key: "askDoc", label: language === "ta" ? "ஆவணத்திடம் கேள்" : "Ask Document", service: "askDoc", prompt: "What are the primary remedies and termination rights under this agreement?" },
                { key: "compare", label: language === "ta" ? "சந்தை ஒப்பீடு" : "Compare Market", service: "compare", prompt: "Compare standard market terms against the provisions drafted in this agreement." }
              ]
        }
      ]
    };

    setConversations([newChat, ...conversations]);
    setActiveConversationId(newId);
    setIsMobileSidebarOpen(false);
  };

  const toggleSplitView = (forceState = null) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          const nextState = forceState !== null ? forceState : !c.isSplitViewOpen;
          return { ...c, isSplitViewOpen: nextState };
        }
        return c;
      })
    );
  };

  const highlightClause = (clauseId, targetPage = null) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            activeHighlightId: clauseId,
            isSplitViewOpen: true
          };
        }
        return c;
      })
    );

    window.dispatchEvent(
      new CustomEvent("scroll-to-clause", { detail: { clauseId, page: targetPage } })
    );
  };

  const runServiceAction = (serviceKey, customQuery = null) => {
    const t = translations[language] || translations.en;
    const currentDoc = activeConversation?.document || SAMPLE_DOCUMENTS[0];
    const isJudgmentDoc = currentDoc?.category === "judgment" || currentDoc?.filename?.toLowerCase().includes("judgment");

    let effectiveKey = serviceKey;
    if (!effectiveKey) {
      const q = (customQuery || "").toLowerCase();
      if (q.includes("risk") || q.includes("liability") || q.includes("அபாயம்")) effectiveKey = "detectRisks";
      else if (q.includes("summar") || q.includes("சுருக்")) effectiveKey = isJudgmentDoc ? "judgment_summarize" : "summarize";
      else if (q.includes("key") || q.includes("date") || q.includes("முக்கிய")) effectiveKey = "keyInfo";
      else if (q.includes("simplif") || q.includes("tamil") || q.includes("தமிழ்") || q.includes("எளிய")) effectiveKey = "simplify";
      else if (q.includes("decid") || q.includes("court") || q.includes("தீர்ப்பு") || q.includes("நீதிமன்றம்")) effectiveKey = "judgment";
      else if (q.includes("compar") || q.includes("ஒப்பீ")) effectiveKey = "compare";
      else effectiveKey = "askDoc";
    }

    const serviceDef = t.services[effectiveKey];
    const userQueryText = customQuery || (serviceDef ? serviceDef.prompt : effectiveKey);

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: userQueryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: [...c.messages, userMsg]
          };
        }
        return c;
      })
    );

    setTimeout(() => {
      let aiResponseObj = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        serviceId: effectiveKey
      };

      let targetHighlightId = null;

      if (effectiveKey === "detectRisks") {
        aiResponseObj.type = "risk_result";
        aiResponseObj.text = language === "ta"
          ? "நான் மதிப்பாய்வு செய்யப்பட வேண்டிய 4 பகுதிகளைக் கண்டறிந்துள்ளேன். கீழே உள்ள சான்றை தட்டினால் ஆவணத்தில் அந்த விதிமுறை முன்னிலைப்படுத்தப்படும்."
          : "I analyzed the clauses and identified 4 potential risk areas that require attention:";
        aiResponseObj.riskFindings = [
          {
            id: "01",
            clauseNumber: "11.0",
            clauseId: "clause-11",
            page: 8,
            title: language === "ta" ? "ஒப்பந்த ரத்து விதிமுறை" : "Termination Clause",
            riskLevel: "HIGH",
            summary: language === "ta"
              ? "இந்த விதி 7 நாட்கள் முன்னறிவிப்புடன் ஒப்பந்தத்தை ரத்து செய்ய அனுமதிக்கிறது. இது மிகக் குறுகிய கால அவகாசம்."
              : "Either party may terminate this agreement with seven (7) days written notice. This provision creates acute operational relocation risk."
          },
          {
            id: "02",
            clauseNumber: "14.0",
            clauseId: "clause-14",
            page: 9,
            title: language === "ta" ? "லாக்-இன் இழப்பீடு" : "Lock-in Penalty",
            riskLevel: "CRITICAL",
            summary: language === "ta"
              ? "முழு 24 மாதங்களுக்கான வாடகையை நஷ்ட ஈடாக கோருகிறது. இது சட்டப்படி அபராத தன்மையுடையது."
              : "Demands remaining unexpired 24-month gross rent as liquidated damages. Indian contract law requires duty to mitigate losses."
          },
          {
            id: "03",
            clauseNumber: "18.0",
            clauseId: "clause-18",
            page: 12,
            title: language === "ta" ? "தனி நடுவர் நியமனம்" : "Sole Arbitrator Appointment",
            riskLevel: "HIGH",
            summary: language === "ta"
              ? "வாடகைதாரர் ஒப்புதல் இன்றி உரிமையாளர் மட்டுமே நடுவரை நியமிக்கிறார். உச்ச நீதிமன்ற தீர்ப்புகளின்படி இது செல்லாது."
              : "Unilateral arbitrator appointments fail statutory neutrality mandates under Perkins Eastman (2020)."
          },
          {
            id: "04",
            clauseNumber: "5.0",
            clauseId: "clause-5",
            page: 3,
            title: language === "ta" ? "வைப்புத்தொகை பறிமுதல்" : "Security Deposit Forfeiture",
            riskLevel: "MEDIUM",
            summary: language === "ta"
              ? "நீதிமன்ற தீர்ப்பின்றி முழு 21,00,000 ரூபாயையும் பறிமுதல் செய்ய உரிமையாளருக்கு உரிமை வழங்குகிறது."
              : "Authorizes forfeiture of INR 21,00,000 without requiring proof of actual pecuniary damages under Sec 74."
          }
        ];
        aiResponseObj.citations = [
          { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
          { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" },
          { label: "Page 12 · Clause 18.0", page: 12, clauseId: "clause-18" },
          { label: "Page 3 · Clause 5.0", page: 3, clauseId: "clause-5" }
        ];
        aiResponseObj.nextActions = [
          { label: "Explain High Risk Clause", service: "simplify", prompt: "Explain Clause 11.0 and 14.0 in simple plain language." },
          { label: "Extract Key Obligations", service: "keyInfo", prompt: "Extract all financial obligations and notice requirements." },
          { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த அபாயங்களை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
          { label: "Ask a Question", action: "focusComposer" }
        ];
        targetHighlightId = "clause-11";
      } else if (effectiveKey === "summarize" || effectiveKey === "judgment_summarize") {
        if (isJudgmentDoc) {
          aiResponseObj.type = "judgment_summary";
          aiResponseObj.title = "JUDGMENT UNDERSTANDING";
          aiResponseObj.structuredJudgment = {
            caseName: "Perkins Eastman Architects DPC & Anr. vs. HSCC (India) Ltd.",
            court: "Supreme Court of India (Civil Appellate Jurisdiction)",
            citation: "(2020) 15 SCC 760",
            bench: "Hon'ble Dr. Justice D.Y. Chandrachud & Hon'ble Justice Ajay Rastogi",
            background: "Dispute arose out of an architectural design contract where Clause 24 empowered Respondent's Chief Managing Director to unilaterally appoint a sole arbitrator.",
            legalIssues: "Whether a person ineligible under Section 12(5) read with Schedule VII of the Arbitration Act can unilaterally appoint a sole arbitrator.",
            reasoning: "Impartiality and independence are paramount. An interested party cannot indirectly control arbitration by choosing the sole adjudicator.",
            finalDecision: "Unilateral appointment quashed. Supreme Court exercised Section 11(6) jurisdiction to appoint an independent former Supreme Court Judge.",
            practicalMeaning: "All unilateral sole arbitrator clauses in Indian commercial contracts are legally void."
          };
          aiResponseObj.citations = [
            { label: "Page 1 · Para 1", page: 1, clauseId: "clause-sc-1" },
            { label: "Page 8 · Para 14", page: 8, clauseId: "clause-sc-14" },
            { label: "Page 15 · Para 21", page: 15, clauseId: "clause-sc-21" }
          ];
          aiResponseObj.nextActions = [
            { label: "What did the Court decide?", service: "judgment", prompt: "What did the Court decide and what is the final operative order?" },
            { label: "Key Legal Issues", service: "judgment", prompt: "What are the core legal issues and statutory questions framed by the Court?" },
            { label: "Simplify Judgment", service: "simplify", prompt: "Explain this judgment in plain everyday terms." },
            { label: "🎙 Explain by Voice", action: "voice" }
          ];
          targetHighlightId = "clause-sc-14";
        } else {
          aiResponseObj.type = "document_summary";
          aiResponseObj.title = "LEGAL DOCUMENT SUMMARY";
          aiResponseObj.structuredSummary = {
            overview: language === "ta"
              ? "இந்த ஆவணம் குருகிராம் வணிக அலுவலக குத்தகைக்கான சட்டப்பூர்வ ஒப்பந்தமாகும். இது வாடகை, லாக்-இன் மற்றும் ரத்து விதிமுறைகளை வரையறுக்கிறது."
              : "This agreement establishes a 60-month commercial tenancy for prime IT office premises at Horizon Towers, Cyber Hub, Gurugram.",
            parties: [
              { role: "Lessor", name: "Horizon Properties Private Limited" },
              { role: "Lessee", name: "NexaTech Solutions Private Limited" }
            ],
            dates: [
              { label: "Commencement Date", value: "15 October 2024" },
              { label: "Lease Duration", value: "60 calendar months" },
              { label: "Lock-in Period", value: "24 months mandatory" }
            ],
            keyTerms: [
              { label: "Monthly Rent", value: "INR 3,50,000 + 5% annual escalation" },
              { label: "Security Deposit", value: "INR 21,00,000 (6 months rent)" },
              { label: "Notice Period", value: "7 days written notice" }
            ]
          };
          aiResponseObj.citations = [
            { label: "Page 1 · Section 1.0", page: 1, clauseId: "clause-1" },
            { label: "Page 1 · Section 2.1", page: 1, clauseId: "clause-2" },
            { label: "Page 3 · Section 5.0", page: 3, clauseId: "clause-5" },
            { label: "Page 8 · Section 11.0", page: 8, clauseId: "clause-11" }
          ];
          aiResponseObj.nextActions = [
            { label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks and one-sided clauses in this document." },
            { label: "Extract Key Obligations", service: "keyInfo", prompt: "Extract key information including financials, lock-in duration, and covenants." },
            { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ஆவணத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
            { label: "Ask a Question", action: "focusComposer" }
          ];
          targetHighlightId = "clause-2";
        }
      } else if (effectiveKey === "keyInfo") {
        aiResponseObj.type = "key_info";
        aiResponseObj.text = language === "ta"
          ? "முக்கிய ஒப்பந்த விபரங்கள் பிரித்தெடுக்கப்பட்டன:\n• வளாகம்: யூனிட் 402, 4வது தளம், ஹொரைசன் டவர்ஸ் (4,200 சதுர அடி)\n• வைப்புத்தொகை: ₹21,00,000 (வட்டி இல்லா திருப்பப்படும் தொகை)\n• லாக்-இன் காலம்: 24 மாதங்கள்\n• அறிவிப்பு காலம்: 7 நாட்கள்"
          : "Key Information Extracted from the Demised Agreement:\n• Demised Premises: Unit 402, 4th Floor, Horizon Towers (4,200 sq. ft.)\n• Financials: Base rent INR 3,50,000/mo + INR 21,00,000 security deposit\n• Lock-in Duration: 24 mandatory calendar months\n• Handover Notice: 7 days written notice required.";
        aiResponseObj.citations = [
          { label: "Page 1 · Clause 1.0", page: 1, clauseId: "clause-1" },
          { label: "Page 3 · Clause 5.0", page: 3, clauseId: "clause-5" },
          { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" }
        ];
        aiResponseObj.nextActions = [
          { label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks in these terms." },
          { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த விதிமுறைகளை எளிய தமிழில் விளக்குங்கள்." },
          { label: "Compare with Market", service: "compare", prompt: "Compare standard market terms against these provisions." },
          { label: "Ask a Question", action: "focusComposer" }
        ];
        targetHighlightId = "clause-5";
      } else if (effectiveKey === "simplify") {
        aiResponseObj.type = "simplified";
        aiResponseObj.text = language === "ta" || userQueryText.includes("தமிழ்")
          ? "எளிமைப்படுத்தப்பட்ட விளக்கம் (Plain Tamil):\n\n'விதி 11.0' கூறுகிறது: இரு தரப்பினரும் வெறும் 7 நாட்கள் எழுத்துப்பூர்வ அறிவிப்பு வழங்கி இந்த ஒப்பந்தத்தை எப்போது வேண்டுமானாலும் ரத்து செய்யலாம். இது வணிக ரீதியாக மிகவும் ஆபத்தானது, ஏனெனில் புதிய அலுவலகத்தைக் கண்டுபிடிக்க பல மாதங்கள் ஆகும்.\n\n'விதி 14.0' கூறுகிறது: 24 மாதங்களுக்குள் வெளியேறினால், மீதமுள்ள அனைத்து மாதங்களின் வாடகையையும் உரிமையாளருக்கு அபராதமாக செலுத்த வேண்டும்."
          : "Plain English Simplification:\n\nClause 11.0: Either side can terminate this tenancy with only 7 days written notice. In real-world business, this is dangerous because moving an office takes 60–90 days.\n\nClause 14.0: If you leave before 24 months, the landlord demands full rent for all remaining unserved months as penalty, which is often legally unenforceable in India.";
        aiResponseObj.citations = [
          { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
          { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" }
        ];
        aiResponseObj.nextActions = [
          { label: "English Version", service: "understand", prompt: "Explain this clause in English plain language." },
          { label: "Check Related Risks", service: "detectRisks", prompt: "Detect all high risk provisions in this document." },
          { label: "🎙 Read Aloud", action: "readAloud" },
          { label: "Show Original Clause", action: "viewSource", clauseId: "clause-11", page: 8 }
        ];
        targetHighlightId = "clause-11";
      } else if (effectiveKey === "judgment" || effectiveKey === "judgment_decision" || effectiveKey === "judgment_issues" || effectiveKey === "judgment_reasoning") {
        aiResponseObj.type = "judgment_summary";
        aiResponseObj.title = "JUDGMENT ANALYSIS: PERKINS EASTMAN (2020)";
        aiResponseObj.structuredJudgment = {
          caseName: "Perkins Eastman Architects DPC v. HSCC (India) Ltd.",
          court: "Supreme Court of India",
          citation: "(2020) 15 SCC 760",
          bench: "Dr. D.Y. Chandrachud & Ajay Rastogi, JJ.",
          background: "The respondent's CMD claimed contractual authority to unilaterally appoint the sole arbitrator under Clause 24.",
          legalIssues: "Whether an interested person disqualified under Section 12(5) can nominate another person as sole arbitrator.",
          reasoning: "Natural justice requires that an interested party cannot even indirectly shape the arbitral tribunal. Independence is an absolute statutory bar.",
          finalDecision: "Unilateral appointment struck down. Independent sole arbitrator appointed by Supreme Court under Section 11(6).",
          practicalMeaning: "Standard arbitration clauses empowering landlords/corporations to unilaterally choose arbitrators are unconstitutional & unenforceable."
        };
        aiResponseObj.citations = [
          { label: "Page 8 · Para 14", page: 8, clauseId: "clause-sc-14" },
          { label: "Page 15 · Para 21", page: 15, clauseId: "clause-sc-21" }
        ];
        aiResponseObj.nextActions = [
          { label: "Explain Reasoning", service: "judgment", prompt: "Explain the Court's ratio decidendi and legal reasoning in detail." },
          { label: "Simplify for Client", service: "simplify", prompt: "Explain this judgment in plain everyday terms." },
          { label: "View Precedent in Doc", action: "viewSource", clauseId: "clause-sc-14", page: 8 },
          { label: "Ask a Question", action: "focusComposer" }
        ];
        targetHighlightId = "clause-sc-14";
      } else if (effectiveKey === "compare") {
        aiResponseObj.type = "comparison";
        aiResponseObj.text = language === "ta"
          ? "சந்தை தரநிலைகளுடன் ஒப்பீடு:\n• அறிவிப்பு காலம்: ஆவணத்தில் 7 நாட்கள் vs சந்தை வழக்கம் 60 முதல் 90 நாட்கள்.\n• லாக்-இன் அபராதம்: முழு வாடகையும் கோருகிறது vs சந்தை வழக்கம் 3 மாத வாடகை.\n• நடுவர் நியமனம்: ஒருதலைப்பட்சம் vs சந்தை வழக்கம் நடுநிலையான மத்திய நடுவர் மன்றம் (DIAC / MCIA)."
          : "Market Standard Comparison against Indian Commercial Practice:\n• Termination Notice: Document provides 7 days vs Market Standard of 60–90 days.\n• Lock-in Liquidated Damages: Document demands 100% unexpired rent vs Market Standard of 3 months maximum.\n• Dispute Resolution: Unilateral Lessor appointment vs Neutral Institutional Arbitration (e.g. DIAC, MCIA).";
        aiResponseObj.citations = [
          { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
          { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" },
          { label: "Page 12 · Clause 18.0", page: 12, clauseId: "clause-18" }
        ];
        aiResponseObj.nextActions = [
          { label: "Detect Risks", service: "detectRisks", prompt: "Highlight all critical risks based on this comparison." },
          { label: "Draft Amendment", service: "simplify", prompt: "How should these clauses be rephrased to match standard terms?" },
          { label: "Ask a Question", action: "focusComposer" }
        ];
        targetHighlightId = "clause-11";
      } else {
        aiResponseObj.type = "standard";
        aiResponseObj.text = language === "ta"
          ? `உங்கள் கேள்வி: "${userQueryText}"\n\nஇந்த ஆவணத்தின்படி, குறிப்பிட்ட விதிமுறைகள் சரிபார்க்கப்பட்டன. இந்த ஆவணத்தில் உள்ள நிபந்தனைகள் வாடகைதாரர்/எதிர் தரப்பினருக்கு கடுமையான பொறுப்புகளை சுமத்துகின்றன. கீழே உள்ள பரிந்துரைக்கப்பட்ட நடவடிக்கைகளை தொடர்ந்து அணுகலாம்.`
          : `Regarding "${userQueryText}":\n\nI analyzed the applicable clauses in this instrument. The provisions place direct performance and liability covenants on the counterparty. Reviewing the highlighted clauses and sources is recommended.`;
        aiResponseObj.citations = [
          { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
          { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" }
        ];
        aiResponseObj.nextActions = [
          { label: "Detect Risks", service: "detectRisks", prompt: "Detect potential risks and one-sided clauses in this document." },
          { label: "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
          { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ஆவணத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." }
        ];
        targetHighlightId = "clause-11";
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              messages: [...c.messages, aiResponseObj],
              isSplitViewOpen: window.innerWidth > 960 ? true : c.isSplitViewOpen,
              activeHighlightId: targetHighlightId || c.activeHighlightId
            };
          }
          return c;
        })
      );

      if (targetHighlightId) {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("scroll-to-clause", { detail: { clauseId: targetHighlightId } })
          );
        }, 150);
      }
    }, 600);
  };

  const deleteConversation = (id, e) => {
    if (e) e.stopPropagation();
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const freshId = `conv-${Date.now()}`;
      setConversations([
        {
          id: freshId,
          title: "New Conversation",
          timeCategory: "today",
          updatedAt: "Just now",
          document: null,
          messages: [],
          isSplitViewOpen: false,
          activeHighlightId: null
        }
      ]);
      setActiveConversationId(freshId);
    } else {
      setConversations(remaining);
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0].id);
      }
    }
  };

  const value = {
    conversations,
    activeConversation,
    activeConversationId,
    language,
    setLanguage,
    selectConversation,
    createNewChat,
    uploadDocument,
    openDocument,
    toggleSplitView,
    highlightClause,
    runServiceAction,
    deleteConversation,
    isSettingsOpen,
    setIsSettingsOpen,
    isProfileOpen,
    setIsProfileOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    speakingMessageId,
    handleToggleSpeech,
    SAMPLE_DOCUMENTS
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocumentContext() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocumentContext must be used within a DocumentProvider");
  }
  return context;
}

export default DocumentContext;
