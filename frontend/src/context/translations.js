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
  },

  ml: {
    brand: "LegalAI",
    tagline: "നിങ്ങളുടെ നിയമപരമായ ഇന്റലിജൻസ് സഹായി",
    newChat: "പുതിയ സംഭാഷണം",
    searchPlaceholder: "സംഭാഷണങ്ങൾ തിരയുക...",
    recent: "സമീപകാലം",
    today: "ഇന്ന്",
    yesterday: "ഇന്നലെ",
    previous7Days: "കഴിഞ്ഞ 7 ദിവസങ്ങൾ",
    older: "പഴയവ",
    settings: "ക്രമീകരണങ്ങൾ",
    profile: "പ്രൊഫൈൽ",
    language: "ഭാഷ",
    chatGreeting: "നിങ്ങളുടെ നിയമപരമായ രേഖയിൽ എങ്ങനെ സഹായിക്കാനാകും?",
    chatGreetingSub: "നിബന്ധനകൾ വിശകലനം ചെയ്യാനും മറഞ്ഞിരിക്കുന്ന അപകടസാധ്യതകൾ കണ്ടെത്താനും ചോദ്യങ്ങൾ ചോദിക്കാനും രേഖ അപ്‌ലോഡ് ചെയ്യുക.",
    
    // Screen 1: Welcome & Dropzone
    welcomeTitle: "വിധികൾ, കരാറുകൾ, നിയമപരമായ രേഖകൾ ലളിതമായ മലയാളത്തിൽ മനസ്സിലാക്കുക.",
    welcomeSubtitle: "നിങ്ങളുടെ രേഖ അപ്‌ലോഡ് ചെയ്യുക — രേഖ തരംതിരിക്കൽ, ഗുരുതരമായ ബാധ്യതകൾ, നിയമപരമായ തെളിവുകൾ തൽക്ഷണം കണ്ടെത്തുക.",
    dropzonePrompt: "നിങ്ങളുടെ നിയമപരമായ രേഖ ഇവിടെ വലിച്ചിടുക, അല്ലെങ്കിൽ",
    browseFiles: "ഫയലുകൾ തിരഞ്ഞെടുക്കുക",
    supportedFormats: "PDF, DOCX, TXT പിന്തുണയ്ക്കുന്നു • സുരക്ഷിതവും രഹസ്യാത്മകവും",
    trySampleTitle: "അല്ലെങ്കിൽ ഒരു മാതൃകാ രേഖ ഉടൻ പരിശോധിക്കുക:",
    
    // Upload Verification Checklist Steps
    verification: {
      received: "രേഖ ലഭിച്ചു",
      reading: "രേഖ വായിക്കുന്നു",
      identifying: "ഘടനയും തരംതിരിവും തിരിച്ചറിയുന്നു",
      understanding: "നിയമപരമായ നിബന്ധനകൾ വിശകലനം ചെയ്യുന്നു",
      ready: "വിശകലനം പൂർത്തിയായി & തയ്യാറാണ്"
    },

    uploadDocument: "രേഖ അപ്‌ലോഡ് ചെയ്യുക",
    analyzingDocument: "രേഖ വിശകലനം ചെയ്യുന്നു...",
    analysisComplete: "രേഖ വിശകലനം ചെയ്തു",
    clauses: "നിബന്ധനകൾ",
    pages: "പേജുകൾ",
    splitView: "രേഖ കാണുക",
    closeSplitView: "കാഴ്ച അടയ്ക്കുക",
    documentView: "രേഖ",
    chatView: "ചാറ്റ്",
    askPlaceholder: "ഈ രേഖയെക്കുറിച്ച് എന്തും ചോദിക്കുക…",
    recording: "നിങ്ങളുടെ ശബ്ദം കേൾക്കുന്നു...",
    send: "അയക്കുക",
    readAloud: "ഉറക്കെ വായിക്കുക",
    stopReading: "നിർത്തുക",
    searchInDocument: "രേഖയിൽ തിരയുക...",
    page: "പേജ്",
    of: "ആകെ",
    zoomIn: "വലുതാക്കുക",
    zoomOut: "ചെറുതാക്കുക",
    resetZoom: "യഥാർത്ഥ വലുപ്പം",
    
    // Conversational Quick Actions
    recommended: "⭐ ശുപാർശ ചെയ്യുന്നവ",
    moreActions: "മറ്റു നടപടികൾ",
    whatNext: "അടുത്തതായി എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?",
    sourcesEvidence: "ഉറവിടങ്ങളും തെളിവുകളും",
    viewClauseInDoc: "രേഖയിലെ നിബന്ധന കാണുക",
    explainClause: "നിബന്ധന വിശദീകരിക്കുക",
    marketComparison: "വിപണി മാനദണ്ഡങ്ങളുമായി താരതമ്യം ചെയ്യുക",

    // Risk Card
    riskTitle: "സാധ്യതയുള്ള ബാധ്യതകളും അപകടസാധ്യതകളും",
    riskExplainer: "ഭാവിയിൽ തർക്കങ്ങൾക്ക് കാരണമായേക്കാവുന്ന നിബന്ധനകളാണിത്. രേഖയിൽ ആ ഭാഗം കാണാൻ ക്ലിക്ക് ചെയ്യുക.",
    risksFound: "അപകടസാധ്യതകൾ കണ്ടെത്തി",
    clickToViewClause: "രേഖയിലെ നിർദ്ദിഷ്ട നിബന്ധന കാണാൻ ക്ലിക്ക് ചെയ്യുക",
    servicesTitle: "നിയമപരമായ സേവനങ്ങൾ",

    // 8 Canonical Legal Services in Malayalam
    services: {
      understand: {
        name: "മനസ്സിലാക്കുക",
        desc: "ലളിതമായ ഭാഷയിൽ രേഖാ വിവരണം",
        prompt: "ഈ രേഖയുടെ ഘടനയും കക്ഷികളെയും ലളിതമായ മലയാളത്തിൽ വിശദീകരിക്കുക."
      },
      summarize: {
        name: "സംഗ്രഹം",
        desc: "പ്രധാന തീയതികളും വ്യവസ്ഥകളും ഉൾക്കൊള്ളുന്ന സംഗ്രഹം",
        prompt: "പ്രധാന തീയതികളും ബാധ്യതകളും അടങ്ങിയ രേഖാ സംഗ്രഹം നൽകുക."
      },
      keyInfo: {
        name: "പ്രധാന വിവരങ്ങൾ",
        desc: "സാമ്പത്തിക നിബന്ധനകളും കാലാവധിയും വേർതിരിച്ചെടുക്കുക",
        prompt: "സാമ്പത്തിക ബാധ്യതകൾ, ലോക്ക്-ഇൻ കാലാവധി തുടങ്ങിയ പ്രധാന വിവരങ്ങൾ വേർതിരിച്ചെടുക്കുക."
      },
      detectRisks: {
        name: "അപകടസാധ്യതകൾ കണ്ടെത്തുക",
        desc: "ഏകപക്ഷീയമായ നിബന്ധനകളും ബാധ്യതകളും കണ്ടെത്തുക",
        prompt: "ഈ രേഖയിലെ നിയമപരമായ അപകടസാധ്യതകളും ഏകപക്ഷീയ നിബന്ധനകളും കണ്ടെത്തുക."
      },
      simplify: {
        name: "ലളിതമാക്കുക / ലളിത മലയാളം",
        desc: "സങ്കീർണ്ണമായ നിയമഭാഷ ലളിതമാക്കുക",
        prompt: "സങ്കീർണ്ണമായ നിയമ പദാവലികൾ ലളിതമായ മലയാളത്തിൽ വിശദീകരിക്കുക."
      },
      askDoc: {
        name: "രേഖയോട് ചോദിക്കുക",
        desc: "രേഖയെ അടിസ്ഥാനമാക്കി ചോദ്യങ്ങൾ ചോദിക്കുക",
        prompt: "കരാർ റദ്ദാക്കൽ, നോട്ടീസ് കാലയളവ് എന്നിവയെക്കുറിച്ച് വിശദീകരിക്കുക."
      },
      judgment: {
        name: "കോടതി വിധി വിശകലനം",
        desc: "കോടതി തീരുമാനം, നിയമ കാരണങ്ങൾ, പ്രത്യാഘാതങ്ങൾ",
        prompt: "ഈ വിധിയുടെ പശ്ചാത്തലം, നിയമ പ്രശ്നങ്ങൾ, അന്തിമ ഉത്തരവ് എന്നിവ വിശദീകരിക്കുക."
      },
      compare: {
        name: "വിപണി താരതമ്യം",
        desc: "സാധാരണ വിപണി വ്യവസ്ഥകളുമായി താരതമ്യം ചെയ്യുക",
        prompt: "സ്റ്റാൻഡേർഡ് വിപണി നിബന്ധനകളുമായി ഈ രേഖ താരതമ്യം ചെയ്യുക."
      }
    },

    judgmentActions: {
      summarize: "വിധിയുടെ സംഗ്രഹം",
      decision: "കോടതി എന്താണ് തീരുമാനിച്ചത്?",
      keyIssues: "പ്രധാന നിയമ പ്രശ്നങ്ങൾ",
      reasoning: "കോടതിയുടെ ന്യായവാദം",
      simplify: "വിധി ലളിതമാക്കുക",
      askJudgment: "വിധിയോട് ചോദിക്കുക",
      voice: "🎙 ശബ്ദത്തിലൂടെ വിശദീകരിക്കുക"
    },

    // Risk levels in Malayalam
    risks: {
      low: "കുറഞ്ഞ അപകടസാധ്യത",
      medium: "ഇടത്തരം അപകടസാധ്യത",
      high: "ഉയർന്ന അപകടസാധ്യത",
      critical: "ഗുരുതരമായ അപകടസാധ്യത"
    },

    settingsModal: {
      title: "LegalAI ക്രമീകരണങ്ങൾ",
      subtitle: "നിയമ അധികാരപരിധിയും മുൻഗണനകളും ക്രമീകരിക്കുക",
      jurisdiction: "നിയമ അധികാരപരിധി",
      jurisdictionDesc: "സ്ഥിരസ്ഥിതി നിയമ ചട്ടക്കൂടും മുൻകാല വിധികളും",
      aiModel: "ഇന്റലിജൻസ് മോഡൽ",
      aiModelDesc: "അടിസ്ഥാന നിയമ വിശകലന മാതൃക",
      citationStyle: "ഉദ്ധരണി ശൈലി",
      citationStyleDesc: "നിയമപരമായ റഫറൻസുകൾ പ്രദർശിപ്പിക്കുന്ന രീതി",
      speechRate: "ശബ്ദ വേഗത",
      save: "മുൻഗണനകൾ സംരക്ഷിക്കുക",
      close: "അടയ്ക്കുക"
    },

    profileModal: {
      title: "നിയമ പ്രാക്ടീഷണർ പ്രൊഫൈൽ",
      subtitle: "സ്ഥാപനവും യോഗ്യതാ വിവരങ്ങളും",
      name: "അഡ്വ. രാജേഷ് കുമാർ",
      role: "സീനിയർ പാർട്ണർ, കോർപ്പറേറ്റ് & കൊമേഴ്‌സ്യൽ പ്രാക്ടീസ്",
      barId: "ബാർ കൗൺസിൽ രജിസ്ട്രേഷൻ: D/1982/2014",
      org: "അപെക്സ് ചേമ്പേഴ്സ് എൽ.എൽ.പി",
      tier: "എന്റർപ്രൈസ് ഇന്റലിജൻസ് ടയർ",
      statsAnalyzed: "വിശകലനം ചെയ്ത രേഖകൾ",
      statsRisks: "തടഞ്ഞ അപകടസാധ്യതകൾ",
      statsHours: "ലാഭിച്ച സമയം",
      close: "പൂർത്തിയായി"
    }
  },

  hi: {
    brand: "LegalAI",
    tagline: "आपका कानूनी बुद्धिमत्ता साथी",
    newChat: "नई बातचीत",
    searchPlaceholder: "बातचीत खोजें...",
    recent: "हाल का",
    today: "आज",
    yesterday: "कल",
    previous7Days: "पिछले 7 दिन",
    older: "पुराने",
    settings: "सेटिंग्स",
    profile: "प्रोफ़ाइल",
    language: "भाषा",
    chatGreeting: "आपके कानूनी दस्तावेज़ में मैं किस प्रकार सहायता कर सकता हूँ?",
    chatGreetingSub: "शर्तों का विश्लेषण करने, छिपे हुए जोखिमों को उजागर करने या विशिष्ट प्रश्न पूछने के लिए अनुबंध, पट्टा या अदालती फैसला अपलोड करें।",
    
    // Screen 1: Welcome & Dropzone
    welcomeTitle: "अदालती फैसलों, अनुबंधों और कानूनी दस्तावेज़ों को सरल भाषा में समझें।",
    welcomeSubtitle: "दस्तावेज़ के प्रकार का स्वचालित पता लगाने, गंभीर देनदारियों की समीक्षा करने और संवादात्मक बुद्धिमत्ता मंच के माध्यम से बातचीत करने के लिए अपना दस्तावेज़ अपलोड करें।",
    dropzonePrompt: "अपना कानूनी दस्तावेज़ यहाँ खींचें और छोड़ें, या",
    browseFiles: "फ़ाइलें चुनें",
    supportedFormats: "PDF, DOCX, TXT समर्थित • सुरक्षित एवं गोपनीय",
    trySampleTitle: "या तुरंत एक भारतीय कानूनी दस्तावेज़ नमूना देखें:",
    
    // Upload Verification Checklist Steps
    verification: {
      received: "दस्तावेज़ प्राप्त हुआ",
      reading: "दस्तावेज़ पढ़ा जा रहा है",
      identifying: "संरचना एवं वर्गीकरण की पहचान",
      understanding: "कानूनी शर्तों का विश्लेषण",
      ready: "विश्लेषण पूर्ण एवं तैयार"
    },

    uploadDocument: "दस्तावेज़ अपलोड करें",
    analyzingDocument: "दस्तावेज़ का विश्लेषण हो रहा है...",
    analysisComplete: "दस्तावेज़ का विश्लेषण पूर्ण",
    clauses: "शर्तें",
    pages: "पृष्ठ",
    splitView: "दस्तावेज़ दर्शक",
    closeSplitView: "दर्शक बंद करें",
    documentView: "दस्तावेज़",
    chatView: "चैट",
    askPlaceholder: "इस दस्तावेज़ के बारे में कुछ भी पूछें…",
    recording: "आपकी आवाज़ सुन रहा हूँ...",
    send: "भेजें",
    readAloud: "बोलकर सुनाएं",
    stopReading: "रोकें",
    searchInDocument: "दस्तावेज़ में खोजें...",
    page: "पृष्ठ",
    of: "का",
    zoomIn: "बड़ा करें",
    zoomOut: "छोटा करें",
    resetZoom: "रीसेट",
    
    // Conversational Quick Actions
    recommended: "⭐ अनुशंसित",
    moreActions: "अन्य कार्रवाइयां",
    whatNext: "आप आगे क्या करना चाहेंगे?",
    sourcesEvidence: "स्रोत एवं साक्ष्य",
    viewClauseInDoc: "दस्तावेज़ में शर्त देखें",
    explainClause: "शर्त समझाएं",
    marketComparison: "बाजार मानकों से तुलना करें",

    // Risk Card
    riskTitle: "संभावित जोखिम एवं देनदारी",
    riskExplainer: "ये वे शर्तें हैं जो व्यावसायिक जोखिम या विवाद का कारण बन सकती हैं। दस्तावेज़ में शर्त देखने के लिए किसी भी संदर्भ पर क्लिक करें।",
    risksFound: "संभावित जोखिम मिले",
    clickToViewClause: "दस्तावेज़ में शर्त देखने के लिए क्लिक करें",
    servicesTitle: "कानूनी सेवाएं",

    // 8 Canonical Legal Services in Hindi
    services: {
      understand: {
        name: "समझें",
        desc: "दस्तावेज़ की संरचना और पक्षों को सरल शब्दों में समझें",
        prompt: "इस कानूनी दस्तावेज़ की संरचना और मुख्य पक्षों को सरल शब्दों में समझाएं।"
      },
      summarize: {
        name: "संक्षेप",
        desc: "मुख्य तिथियों और शर्तों के साथ संरचित कार्यकारी सारांश",
        prompt: "मुख्य तिथियों, पक्षों और मुख्य दायित्वों के साथ इस दस्तावेज़ का सारांश प्रस्तुत करें।"
      },
      keyInfo: {
        name: "मुख्य जानकारी",
        desc: "वित्तीय शर्तें, लॉक-इन अवधि और दायित्व निकालें",
        prompt: "वित्तीय दायित्वों, लॉक-इन अवधि और समझौतों सहित मुख्य जानकारी निकालें।"
      },
      detectRisks: {
        name: "जोखिम पहचानें",
        desc: "एकतरफा शर्तें और गंभीर देनदारी खंड उजागर करें",
        prompt: "इस दस्तावेज़ में संभावित कानूनी जोखिमों और एकतरफा शर्तों का पता लगाएं।"
      },
      simplify: {
        name: "सरल हिंदी / अनुवाद",
        desc: "जटिल कानूनी भाषा को आम बोलचाल की भाषा में बदलें",
        prompt: "जटिल कानूनी शब्दावली और लैटिन सूत्रों को सरल रोज़मर्रा की भाषा में समझाएं।"
      },
      askDoc: {
        name: "दस्तावेज़ से पूछें",
        desc: "दस्तावेज़ के आधार पर विशिष्ट प्रश्न पूछें",
        prompt: "इस समझौते के तहत प्राथमिक उपचार, नोटिस अवधि और समाप्ति अधिकार क्या हैं?"
      },
      judgment: {
        name: "न्यायालय निर्णय विश्लेषण",
        desc: "निर्णय, कानूनी कारण और मिसालों का विश्लेषण करें",
        prompt: "इस निर्णय के कानूनी मुद्दों, अदालत के तर्क और व्यावहारिक प्रभावों का विश्लेषण करें।"
      },
      compare: {
        name: "बाजार तुलना",
        desc: "मानक बाजार शर्तों और वैधानिक कानून से तुलना करें",
        prompt: "मानक बाजार शर्तों और वैधानिक कानूनों के साथ इन प्रावधानों की तुलना करें।"
      }
    },

    judgmentActions: {
      summarize: "निर्णय का सारांश",
      decision: "अदालत ने क्या फैसला सुनाया?",
      keyIssues: "मुख्य कानूनी मुद्दे",
      reasoning: "अदालत का कानूनी तर्क",
      simplify: "निर्णय को सरल बनाएं",
      askJudgment: "निर्णय से पूछें",
      voice: "🎙 आवाज़ से समझाएं"
    },

    // Risk levels in Hindi
    risks: {
      low: "कम जोखिम",
      medium: "मध्यम जोखिम",
      high: "उच्च जोखिम",
      critical: "गंभीर जोखिम"
    },

    settingsModal: {
      title: "LegalAI सेटिंग्स",
      subtitle: "बुद्धिमत्ता मॉडल, कानूनी क्षेत्राधिकार और प्राथमिकताएं कॉन्फ़िगर करें",
      jurisdiction: "कानूनी क्षेत्राधिकार",
      jurisdictionDesc: "डिफ़ॉल्ट वैधानिक ढांचा और मिसालें निर्दिष्ट करता है",
      aiModel: "बुद्धिमत्ता मॉडल",
      aiModelDesc: "अंतर्निहित कानूनी तर्क मॉडल",
      citationStyle: "उद्धरण शैली",
      citationStyleDesc: "संदर्भ और वैधानिक उद्धरण कैसे प्रदर्शित होते हैं",
      speechRate: "आवाज़ की गति",
      save: "प्राथमिकताएं सहेजें",
      close: "बंद करें"
    },

    profileModal: {
      title: "कानूनी व्यवसायी प्रोफ़ाइल",
      subtitle: "संगठन और क्रेडेंशियल विवरण",
      name: "एडव. राजेश कुमार",
      role: "वरिष्ठ भागीदार, कॉर्पोरेट एवं वाणिज्यिक अभ्यास",
      barId: "बार काउंसिल पंजीकरण: D/1982/2014",
      org: "एपेक्स चैंबर्स एलएलपी",
      tier: "एंटरप्राइज इंटेलिजेंस टियर",
      statsAnalyzed: "विश्लेषित दस्तावेज़",
      statsRisks: "रोके गए जोखिम",
      statsHours: "बचाए गए घंटे",
      close: "पूर्ण"
    }
  },

  te: {
    brand: "LegalAI",
    tagline: "మీ చట్టపరమైన ఇంటెలిజెన్స్ సహాయకుడు",
    newChat: "కొత్త సంభాషణ",
    searchPlaceholder: "సంభాషణలను శోధించండి...",
    recent: "ఇటీవలి",
    today: "ఈరోజు",
    yesterday: "నిన్న",
    previous7Days: "గత 7 రోజులు",
    older: "పాతవి",
    settings: "సెట్టింగ్‌లు",
    profile: "ప్రొఫైల్",
    language: "భాష",
    chatGreeting: "మీ చట్టపరమైన పత్రంలో నేను ఎలా సహాయపడగలను?",
    chatGreetingSub: "నిబంధనలను విశ్లేషించడానికి, దాగి ఉన్న నష్టాలను గుర్తించడానికి లేదా ప్రశ్నలు అడగడానికి ఒప్పందం లేదా కోర్టు తీర్పును అప్‌లోడ్ చేయండి.",
    
    // Screen 1: Welcome & Dropzone
    welcomeTitle: "కోర్టు తీర్పులు, ఒప్పందాలు మరియు చట్టపరమైన పత్రాలను సరళమైన తెలుగులో అర్థం చేసుకోండి.",
    welcomeSubtitle: "పత్ర రకాన్ని గుర్తించడం, బాధ్యతలను సమీక్షించడం మరియు సంభాషణాత్మక ఇంటెలిజెన్స్ ద్వారా శోధించడానికి మీ పత్రాన్ని అప్‌లోడ్ చేయండి.",
    dropzonePrompt: "మీ చట్టపరమైన పత్రాన్ని ఇక్కడ లాగి వదలండి, లేదా",
    browseFiles: "ఫైల్‌లను ఎంచుకోండి",
    supportedFormats: "PDF, DOCX, TXT సపోర్ట్ చేస్తుంది • సురక్షితం & గోప్యమైనది",
    trySampleTitle: "లేదా భారతీయ చట్టపరమైన పత్ర నమూనాను వెంటనే అన్వేషించండి:",
    
    // Upload Verification Checklist Steps
    verification: {
      received: "పత్రం అందింది",
      reading: "పత్రం చదవబడుతోంది",
      identifying: "నిర్మాణం & వర్గీకరణ గుర్తింపు",
      understanding: "చట్టపరమైన నిబంధనల విశ్లేషణ",
      ready: "విశ్లేషణ పూర్తయింది & సిద్ధంగా ఉంది"
    },

    uploadDocument: "పత్రాన్ని అప్‌లోడ్ చేయండి",
    analyzingDocument: "పత్రం విశ్లేషించబడుతోంది...",
    analysisComplete: "పత్ర విశ్లేషణ పూర్తయింది",
    clauses: "నిబంధనలు",
    pages: "పేజీలు",
    splitView: "పత్ర వీక్షణ",
    closeSplitView: "వీక్షణను మూసివేయి",
    documentView: "పత్రం",
    chatView: "చాట్",
    askPlaceholder: "ఈ పత్రం గురించి ఏదైనా అడగండి...",
    recording: "మీ వాయిస్ వింటోంది...",
    send: "పంపండి",
    readAloud: "గట్టిగా చదవండి",
    stopReading: "ఆపండి",
    searchInDocument: "పత్రంలో శోధించండి...",
    page: "పేజీ",
    of: "మొత్తం",
    zoomIn: "పెద్దది చేయండి",
    zoomOut: "చిన్నది చేయండి",
    resetZoom: "రీసెట్",
    
    // Conversational Quick Actions
    recommended: "⭐ సిఫార్సు చేయబడినవి",
    moreActions: "ఇతర చర్యలు",
    whatNext: "మీరు తదుపరి ఏమి చేయాలనుకుంటున్నారు?",
    sourcesEvidence: "మూలాలు & ఆధారాలు",
    viewClauseInDoc: "పత్రంలో నిబంధన చూడండి",
    explainClause: "నిబంధనను వివరించండి",
    marketComparison: "మార్కెట్ ప్రమాణాలతో పోల్చండి",

    // Risk Card
    riskTitle: "సంభావ్య నష్టాలు & బాధ్యతలు",
    riskExplainer: "ఇవి భవిష్యత్తులో వివాదాలకు కారణమయ్యే నిబంధనలు. పత్రంలో ఆ భాగాన్ని చూడటానికి క్లిక్ చేయండి.",
    risksFound: "సంభావ్య నష్టాలు కనుగొనబడ్డాయి",
    clickToViewClause: "పత్రంలో నిర్దిష్ట నిబంధనను చూడటానికి క్లిక్ చేయండి",
    servicesTitle: "చట్టపరమైన సేవలు",

    // 8 Canonical Legal Services in Telugu
    services: {
      understand: {
        name: "అర్థం చేసుకోండి",
        desc: "సరళమైన భాషలో పత్ర వివరణ",
        prompt: "ఈ పత్ర నిర్మాణం మరియు పార్టీలను సరళమైన తెలుగులో వివరించండి."
      },
      summarize: {
        name: "సారాంశం",
        desc: "ముఖ్యమైన తేదీలు మరియు నిబంధనలతో కూడిన సారాంశం",
        prompt: "ముఖ్య తేదీలు, బాధ్యతలతో కూడిన పత్ర సారాంశాన్ని అందించండి."
      },
      keyInfo: {
        name: "ముఖ్య సమాచారం",
        desc: "ఆర్థిక నిబంధనలు మరియు వ్యవధిని సేకరించండి",
        prompt: "ఆర్థిక బాధ్యతలు, లాక్-ఇన్ కాలం వంటి ముఖ్య సమాచారాన్ని సేకరించండి."
      },
      detectRisks: {
        name: "నష్టాలను గుర్తించండి",
        desc: "ఏకపక్ష నిబంధనలు మరియు తీవ్ర బాధ్యతలను గుర్తించండి",
        prompt: "ఈ పత్రంలోని చట్టపరమైన నష్టాలు మరియు ఏకపక్ష నిబంధనలను గుర్తించండి."
      },
      simplify: {
        name: "సరళీకరించండి / సరళ తెలుగు",
        desc: "సంక్లిష్ట చట్టపరమైన భాషను సరళంగా మార్చండి",
        prompt: "ఈ పత్రాన్ని సాధారణ తెలుగులో నాకు అర్థమయ్యే రీతిలో వివరించండి."
      },
      askDoc: {
        name: "పత్రాన్ని అడగండి",
        desc: "పత్రం ఆధారంగా ప్రశ్నలు అడగండి",
        prompt: "ఒప్పందం రద్దు, నోటీసు వ్యవధి మరియు పరిహార హక్కుల గురించి వివరించండి."
      },
      judgment: {
        name: "కోర్టు తీర్పు విశ్లేషణ",
        desc: "కోర్టు నిర్ణయం, న్యాయ కారణాలు మరియు తీర్పులు",
        prompt: "ఈ తీర్పు నేపథ్యం, చట్టపరమైన సమస్యలు మరియు తుది ఉత్తర్వును వివరించండి."
      },
      compare: {
        name: "మార్కెట్ పోలిక",
        desc: "సాధారణ మార్కెట్ నిబంధనలతో పోల్చండి",
        prompt: "ప్రామాణిక మార్కెట్ నిబంధనలతో ఈ పత్ర నిబంధనలను పోల్చండి."
      }
    },

    judgmentActions: {
      summarize: "తీర్పు సారాంశం",
      decision: "కోర్టు ఏమి నిర్ణయించింది?",
      keyIssues: "ముఖ్యమైన చట్టపరమైన సమస్యలు",
      reasoning: "కోర్టు న్యాయవాదం",
      simplify: "తీర్పును సరళీకరించండి",
      askJudgment: "తీర్పును అడగండి",
      voice: "🎙 వాయిస్ ద్వారా వివరించండి"
    },

    // Risk levels in Telugu
    risks: {
      low: "తక్కువ నష్టం",
      medium: "మధ్యస్థ నష్టం",
      high: "అధిక నష్టం",
      critical: "తీవ్రమైన నష్టం"
    },

    settingsModal: {
      title: "LegalAI సెట్టింగ్‌లు",
      subtitle: "చట్టపరమైన అధికార పరిధి మరియు ప్రాధాన్యతలను కాన్ఫిగర్ చేయండి",
      jurisdiction: "చట్టపరమైన అధికార పరిధి",
      jurisdictionDesc: "డిఫాల్ట్ చట్టపరమైన ఫ్రేమ్‌వర్క్ మరియు పూర్వాపరాలు",
      aiModel: "ఇంటెలిజెన్స్ మోడల్",
      aiModelDesc: "అంతర్లీన చట్టపరమైన విశ్లేషణ నమూనా",
      citationStyle: "సైటేషన్ శైలి",
      citationStyleDesc: "చట్టపరమైన సూచనలు ప్రదర్శించబడే విధానం",
      speechRate: "వాయిస్ వేగం",
      save: "ప్రాధాన్యతలను సేవ్ చేయండి",
      close: "మూసివేయి"
    },

    profileModal: {
      title: "న్యాయవాది ప్రొఫైల్",
      subtitle: "సంస్థ మరియు అర్హత వివరాలు",
      name: "అడ్వ. రాజేష్ కుమార్",
      role: "సీనియర్ పార్ట్‌నర్, కార్పొరేట్ & కమర్షియల్ ప్రాక్టీస్",
      barId: "బార్ కౌన్సిల్ రిజిస్ట్రేషన్: D/1982/2014",
      org: "అపెక్స్ ఛాంబర్స్ LLP",
      tier: "ఎంటర్‌ప్రైజ్ ఇంటెలిజెన్స్ టైర్",
      statsAnalyzed: "విశ్లేషించిన పత్రాలు",
      statsRisks: "నివారించిన నష్టాలు",
      statsHours: "ఆదా చేసిన గంటలు",
      close: "పూర్తయింది"
    }
  }
};

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்" },
  { code: "ml", label: "Malayalam", nativeName: "മലയാളം" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు" }
];

