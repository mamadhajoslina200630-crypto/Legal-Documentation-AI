export const translations = {
  en: {
    brand: "LegalAI",
    tagline: "Your Legal Intelligence Companion",
    newChat: "New Chat",
    searchPlaceholder: "Search conversations...",
    recent: "RECENT",
    today: "Today",
    yesterday: "Yesterday",
    previous7Days: "Previous 7 Days",
    older: "Older",
    settings: "Settings",
    profile: "Profile",
    language: "Language",
    chatGreeting: "How can I help with your legal document?",
    chatGreetingSub: "Upload a contract, lease, or court judgment to analyze clauses, uncover hidden risks, or ask specific questions.",
    
    // Screen 1: Welcome & Dropzone
    welcomeTitle: "Understand judgments, contracts and legal documents in simple language.",
    welcomeSubtitle: "Upload your document to automatically detect its type, review critical liabilities, and interact through a grounded conversational intelligence workbench.",
    dropzonePrompt: "Drag and drop your legal document here, or",
    browseFiles: "Browse Files",
    supportedFormats: "Supports PDF, DOCX, TXT • Secure & Confidential",
    trySampleTitle: "Or explore an Indian legal document sample immediately:",
    
    // Upload Verification Checklist Steps
    verification: {
      received: "Document received",
      reading: "Reading document",
      identifying: "Identifying structure & classification",
      understanding: "Understanding legal clauses",
      ready: "Analysis complete & ready"
    },

    uploadDocument: "Upload a document",
    analyzingDocument: "Analyzing document...",
    analysisComplete: "Document analyzed",
    clauses: "clauses",
    pages: "pages",
    splitView: "Document Viewer",
    closeSplitView: "Close Viewer",
    documentView: "Document",
    chatView: "Chat",
    askPlaceholder: "Ask anything about this document...",
    recording: "Listening to your voice...",
    send: "Send",
    readAloud: "Read aloud",
    stopReading: "Stop reading",
    searchInDocument: "Search in document...",
    page: "Page",
    of: "of",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    resetZoom: "Reset",
    
    // Conversational Quick Actions
    recommended: "⭐ Recommended",
    moreActions: "Other actions",
    whatNext: "What would you like to do next?",
    sourcesEvidence: "Sources & Evidence",
    viewClauseInDoc: "View clause in doc",
    explainClause: "Explain clause",
    marketComparison: "Compare with market norms",

    // Risk Card
    riskTitle: "Potential Risks & Exposure",
    riskExplainer: "These are clauses that could cause commercial exposure or dispute. Click any citation to view the clause highlighted in the document.",
    risksFound: "potential risks found",
    clickToViewClause: "Click to jump to clause in document",
    servicesTitle: "Legal Capabilities",

    // The 8 Canonical Legal Services & Natural Prompts
    services: {
      understand: {
        name: "Understand",
        desc: "Explain document structure & parties in simple terms",
        prompt: "Explain this legal document structure and key parties in plain terms."
      },
      summarize: {
        name: "Summarize",
        desc: "Structured executive summary with dates & terms",
        prompt: "Summarize this document with key dates, parties, and core obligations."
      },
      keyInfo: {
        name: "Key Information",
        desc: "Extract obligations, financials & lock-in terms",
        prompt: "Extract key information including financials, lock-in duration, and covenants."
      },
      detectRisks: {
        name: "Detect Risks",
        desc: "Highlight one-sided terms & severe liability clauses",
        prompt: "Detect potential risks and one-sided clauses in this document."
      },
      simplify: {
        name: "Simplify / Plain Tamil",
        desc: "Convert legalese into everyday plain language",
        prompt: "Simplify complex legalese and Latin maxims into everyday language."
      },
      askDoc: {
        name: "Ask Document",
        desc: "Ask specific questions grounded in text",
        prompt: "What are the primary remedies, notice periods, and termination rights?"
      },
      judgment: {
        name: "Court Judgment Analysis",
        desc: "Analyze decision, ratio decidendi & precedents",
        prompt: "Analyze the court's decision, legal issues, and practical implications of this judgment."
      },
      compare: {
        name: "Market Comparison",
        desc: "Compare clauses against Indian institutional norms",
        prompt: "Compare these provisions against standard market terms and statutory law."
      }
    },

    // Judgment specific action labels
    judgmentActions: {
      summarize: "Summarize Judgment",
      decision: "What did the Court decide?",
      keyIssues: "Key Legal Issues",
      reasoning: "Court's Reasoning",
      simplify: "Simplify Judgment",
      askJudgment: "Ask the Judgment",
      voice: "🎙 Explain by Voice"
    },

    // Risk levels
    risks: {
      low: "LOW RISK",
      medium: "MEDIUM RISK",
      high: "HIGH RISK",
      critical: "CRITICAL RISK"
    },

    // Settings Modal
    settingsModal: {
      title: "LegalAI Settings",
      subtitle: "Configure intelligence model, legal jurisdiction and preferences",
      jurisdiction: "Legal Jurisdiction",
      jurisdictionDesc: "Specifies default statutory framework and precedents",
      aiModel: "Intelligence Model",
      aiModelDesc: "Underlying legal reasoning model",
      citationStyle: "Citation Style",
      citationStyleDesc: "How references and statutory citations are rendered",
      speechRate: "Speech Playback Rate",
      save: "Save Preferences",
      close: "Close"
    },

    // Profile Modal
    profileModal: {
      title: "Legal Practitioner Profile",
      subtitle: "Enterprise organization & credentials",
      name: "Adv. Rajesh Kumar",
      role: "Senior Partner, Corporate & Commercial Practice",
      barId: "Bar Council Reg: D/1982/2014",
      org: "Apex Chambers LLP",
      tier: "Enterprise Intelligence Tier",
      statsAnalyzed: "Documents Analyzed",
      statsRisks: "Risks Prevented",
      statsHours: "Hours Saved",
      close: "Done"
    }
  },

  ta: {
    brand: "LegalAI",
    tagline: "உங்கள் சட்ட நுண்ணறிவு துணை",
    newChat: "புதிய உரையாடல்",
    searchPlaceholder: "உரையாடல்களைத் தேடுங்கள்...",
    recent: "சமீபத்தியவை",
    today: "இன்று",
    yesterday: "நேற்று",
    previous7Days: "கடந்த 7 நாட்கள்",
    older: "பழையவை",
    settings: "அமைப்புகள்",
    profile: "சுயவிவரம்",
    language: "மொழி",
    chatGreeting: "உங்கள் சட்ட ஆவணத்தில் எவ்வாறு உதவ முடியும்?",
    chatGreetingSub: "விதிமுறைகளை பகுப்பாய்வு செய்யவும், மறைமுக அபாயங்களை கண்டறியவும் அல்லது கேள்விகள் கேட்கவும் ஆவணத்தை பதிவேற்றவும்.",
    
    // Screen 1: Welcome & Dropzone
    welcomeTitle: "தீர்ப்புகள், ஒப்பந்தங்கள் மற்றும் சட்ட ஆவணங்களை எளிய தமிழில் புரிந்து கொள்ளுங்கள்.",
    welcomeSubtitle: "ஆவணத்தை பதிவேற்றவும் — ஆவண வகைப்பாடு, மறைமுக அபாயங்கள் மற்றும் சட்ட ஆதாரங்களை உடனடியாக கண்டறியலாம்.",
    dropzonePrompt: "உங்கள் சட்ட ஆவணத்தை இங்கே பதிவேற்றவும், அல்லது",
    browseFiles: "கோப்புகளைத் தேர்ந்தெடுக்கவும்",
    supportedFormats: "PDF, DOCX, TXT ஆதரிக்கப்படுகிறது • பாதுகாப்பானது",
    trySampleTitle: "அல்லது மாதிரி ஆவணத்தை உடனடியாக சோதிக்கவும்:",
    
    // Upload Verification Checklist Steps
    verification: {
      received: "ஆவணம் பெறப்பட்டது",
      reading: "ஆவணம் படிக்கப்படுகிறது",
      identifying: "கட்டமைப்பு & வகைப்பாடு அடையாளம் காணப்படுகிறது",
      understanding: "சட்ட விதிகள் பகுப்பாய்வு செய்யப்படுகின்றன",
      ready: "ஆய்வு முடிந்தது & தயார்"
    },

    uploadDocument: "ஆவணத்தை பதிவேற்றவும்",
    analyzingDocument: "ஆவணம் பகுப்பாய்வு செய்யப்படுகிறது...",
    analysisComplete: "ஆவணம் பகுப்பாய்வு செய்யப்பட்டது",
    clauses: "விதிகள்",
    pages: "பக்கங்கள்",
    splitView: "ஆவணப் பார்வை",
    closeSplitView: "பார்வையை மூடு",
    documentView: "ஆவணம்",
    chatView: "உரையாடல்",
    askPlaceholder: "இந்த ஆவணத்தைப் பற்றி எதையும் கேளுங்கள்…",
    recording: "உங்கள் குரலைக் கேட்கிறது...",
    send: "அனுப்பு",
    readAloud: "படித்துக் காட்டு",
    stopReading: "நிறுத்து",
    searchInDocument: "ஆவணத்தில் தேடுங்கள்...",
    page: "பக்கம்",
    of: "மொத்தம்",
    zoomIn: "பெரிதாக்கு",
    zoomOut: "சிறிதாக்கு",
    resetZoom: "மீட்டமை",
    
    // Conversational Quick Actions
    recommended: "⭐ பரிந்துரைக்கப்படுபவை",
    moreActions: "பிற நடவடிக்கைகள்",
    whatNext: "அடுத்து என்ன செய்ய விரும்புகிறீர்கள்?",
    sourcesEvidence: "ஆதாரங்கள் & பக்கங்கள்",
    viewClauseInDoc: "ஆவணத்தில் காண்க",
    explainClause: "விதியை விளக்கு",
    marketComparison: "சந்தை வழக்கத்துடன் ஒப்பிடு",

    // Risk Card
    riskTitle: "சாத்தியமான அபாயங்கள்",
    riskExplainer: "இவை உங்கள் ஆவணத்தில் எதிர்காலத்தில் சிக்கல்களை ஏற்படுத்தக்கூடிய விதிகளாகும். ஆவணத்தில் உள்ள விதியைப் பார்க்க சான்றை கிளிக் செய்யவும்.",
    risksFound: "அபாயங்கள் கண்டறியப்பட்டுள்ளன",
    clickToViewClause: "ஆவணத்தில் குறிப்பிட்ட விதியைப் பார்க்க கிளிக் செய்க",
    servicesTitle: "சட்ட சேவைகள்",

    // 8 Canonical Legal Services in Tamil
    services: {
      understand: {
        name: "ஆவணத்தை விளக்குங்கள்",
        desc: "எளிய மொழியில் ஆவண விளக்கம்",
        prompt: "இந்த ஆவணத்தை எளிய மற்றும் தெளிவான தமிழில் விளக்குங்கள்."
      },
      summarize: {
        name: "சுருக்கம்",
        desc: "சுருக்கமான அறிக்கை உருவாக்கம்",
        prompt: "முக்கிய நிபந்தனைகளை முன்னிலைப்படுத்தி சுருக்கமான அறிக்கை தரவும்."
      },
      keyInfo: {
        name: "முக்கிய தகவல்கள்",
        desc: "முக்கிய தகவல்களைக் கண்டறிதல்",
        prompt: "முக்கிய தேதிகள், தரப்பினர், கட்டண அட்டவணைகள் ஆகியவற்றை பிரித்தெடுக்கவும்."
      },
      detectRisks: {
        name: "அபாயங்களைக் கண்டறி",
        desc: "சாத்தியமான சட்ட அபாயங்களைக் கண்டறிதல்",
        prompt: "இந்த ஆவணத்தில் உள்ள சட்ட அபாயங்கள் மற்றும் அபராதங்களை கண்டறியவும்."
      },
      simplify: {
        name: "எளிதாக்கு / எளிய தமிழ்",
        desc: "சட்ட மொழியை எளிய மொழியாக மாற்றுதல்",
        prompt: "இந்த ஆவணத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்."
      },
      askDoc: {
        name: "ஆவணத்திடம் கேள்",
        desc: "ஆவணம் தொடர்பான கேள்விகள்",
        prompt: "இந்த ஒப்பந்தத்தின் கீழ் ஒப்பந்த ரத்து மற்றும் பரிகார உரிமைகள் என்ன?"
      },
      judgment: {
        name: "தீர்ப்புகள் பகுப்பாய்வு",
        desc: "நீதிமன்ற தீர்ப்புகள் மற்றும் சட்ட முடிவுகள்",
        prompt: "இந்த தீர்ப்பின் பின்னணி, சட்டப் பிரச்சினைகள் மற்றும் இறுதி உத்தரவை விளக்குங்கள்."
      },
      compare: {
        name: "சந்தை ஒப்பீடு",
        desc: "வழக்கமான சந்தை விதிகளுடன் ஒப்பீடு",
        prompt: "நிலையான சந்தை விதிமுறைகளுடன் இந்த ஆவணத்தின் விதிகளை ஒப்பிடுங்கள்."
      }
    },

    judgmentActions: {
      summarize: "தீர்ப்பின் சுருக்கம்",
      decision: "நீதிமன்றம் என்ன முடிவு செய்தது?",
      keyIssues: "முக்கிய சட்டப் பிரச்சினைகள்",
      reasoning: "நீதிமன்றத்தின் நியாயவாதம்",
      simplify: "தீர்ப்பை எளிமைப்படுத்து",
      askJudgment: "தீர்ப்பிடம் கேள்",
      voice: "🎙 குரல் மூலம் விளக்கு"
    },

    // Risk levels in Tamil
    risks: {
      low: "குறைந்த அபாயம்",
      medium: "நடுத்தர அபாயம்",
      high: "உயர் அபாயம்",
      critical: "தீவிர அபாயம்"
    },

    settingsModal: {
      title: "LegalAI அமைப்புகள்",
      subtitle: "சட்ட அதிகார வரம்பு மற்றும் விருப்பங்களை உள்ளமைக்கவும்",
      jurisdiction: "சட்ட அதிகார வரம்பு",
      jurisdictionDesc: "இயல்புநிலை சட்ட கட்டமைப்பு மற்றும் முன்மாதிரிகள்",
      aiModel: "நுண்ணறிவு மாதிரி",
      aiModelDesc: "சட்ட நியாயவாதம் மற்றும் பகுப்பாய்வு மாதிரி",
      citationStyle: "சான்று நடை",
      citationStyleDesc: "சட்ட மேற்கோள்கள் காட்டப்படும் விதம்",
      speechRate: "பேச்சு வேகம்",
      save: "சேமிக்கவும்",
      close: "மூடு"
    },

    profileModal: {
      title: "வழக்கறிஞர் சுயவிவரம்",
      subtitle: "நிறுவனம் மற்றும் உரிமம் விவரங்கள்",
      name: "Adv. ராஜேஷ் குமார்",
      role: "மூத்த பங்குதாரர், நிறுவன சட்டம்",
      barId: "பார் கவுன்சில் பதிவு: D/1982/2014",
      org: "அபெக்ஸ் சேம்பர்ஸ் எல்.எல்.பி",
      tier: "எண்டர்பிரைஸ் நிலை",
      statsAnalyzed: "ஆய்வு செய்யப்பட்ட ஆவணங்கள்",
      statsRisks: "தடுக்கப்பட்ட அபாயங்கள்",
      statsHours: "சேமிக்கப்பட்ட நேரம்",
      close: "முடிந்தது"
    }
  }
};
