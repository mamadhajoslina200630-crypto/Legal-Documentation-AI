import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scale,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Search,
  AlertTriangle,
  Globe,
  Gavel,
  Volume2,
  CheckCircle2,
  ChevronRight,
  Split,
  Lock,
  Cpu,
  Database,
  Layers,
  Zap,
  ExternalLink,
  BookOpen,
  Mic,
  BarChart3
} from "lucide-react";
import { SAMPLE_DOCUMENTS } from "../context/DocumentContext";

export function LandingPage() {
  const navigate = useNavigate();
  const [activeDemoTab, setActiveDemoTab] = useState("lease");

  const demoScenarios = {
    lease: {
      title: "Commercial Lease Agreement.pdf",
      badge: "Commercial Contract · 14 Pages",
      jurisdiction: "Transfer of Property Act, 1882",
      prompt: "Identify hidden legal risks and early exit penalties.",
      answer: "🔴 HIGH RISK: Clause 14.0 mandates gross rental payment for the entire unexpired 24-month lock-in period upon premature vacation.\n\n🟡 MEDIUM RISK: Clause 5.0 gives Lessor unilateral discretion to forfeit the ₹21,00,000 security deposit for non-material alterations.",
      citations: ["Page 9 · Clause 14.0", "Page 3 · Clause 5.0"],
      nextAction: "Explain Liquidated Damages under Sec 74 Indian Contract Act"
    },
    judgment: {
      title: "Supreme_Court_Civil_Appeal_4192_2024.pdf",
      badge: "Supreme Court of India · 28 Pages",
      jurisdiction: "Arbitration & Conciliation Act, 1996",
      prompt: "What is the operative decision and ratio decidendi?",
      answer: "✅ OPERATIVE DECREE: Appeal allowed with costs. Unilateral appointment clauses in arbitral panels fail the statutory test of independence under Section 12(5) and are void ab initio.\n\n🏛️ DIRECTIONS: Justice (Retd.) A.K. Sikri appointed independent Sole Arbitrator under DIAC rules.",
      citations: ["Page 18 · Para 27", "Page 24 · Para 35"],
      nextAction: "What is the practical impact on existing public contracts?"
    },
    tamil: {
      title: "Residential_Tenancy_Agreement.pdf",
      badge: "Plain-Language · Regional Indian",
      jurisdiction: "Tamil Nadu Tenancy Laws",
      prompt: "இந்த ஒப்பந்தத்தில் நான் வெளியேற எத்தனை நாட்கள் முன் அறிவிப்பு தர வேண்டும்?",
      answer: "🤖 Clause 11-ன் படி, வீட்டை காலி செய்வதற்கு முன்பாக 60 நாட்களுக்கு முன்னரே எழுத்துப்பூர்வ அறிவிப்பு (Notice) கொடுக்க வேண்டும். தவறும் பட்சத்தில் 3 மாத வாடகை அபராதமாக வசூலிக்கப்படும்.",
      citations: ["Page 8 · Clause 11.0"],
      nextAction: "Listen Aloud in Tamil (குரல் வாசிப்பு)"
    }
  };

  const currentDemo = demoScenarios[activeDemoTab];

  return (
    <div className="landing-root-container">
      {/* Background Subtle Tech Ambient Gradients */}
      <div className="bg-glow-orb orb-top-left"></div>
      <div className="bg-glow-orb orb-top-right"></div>
      <div className="bg-subtle-grid-pattern"></div>

      {/* 1. SLEEK NAVIGATION BAR */}
      <nav className="landing-navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand-logo">
            <div className="brand-icon-box">
              <Scale size={18} color="#ffffff" />
            </div>
            <span className="brand-name">Legal<span className="gradient-text">AI</span></span>
            <span className="brand-status-tag">v2.0</span>
          </Link>

          <div className="nav-links-desktop">
            <a href="#capabilities" className="nav-link-item">Capabilities</a>
            <a href="#interactive-demo" className="nav-link-item">Live Preview</a>
            <a href="#architecture" className="nav-link-item">3-Zone Engine</a>
            <a href="#security" className="nav-link-item">Security & Trust</a>
            <a href="#metrics" className="nav-link-item">Impact</a>
          </div>

          <div className="nav-actions">
            <button
              onClick={() => navigate("/app")}
              className="btn-launch-workspace"
            >
              <span>Launch Workspace</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. AI HERO SECTION */}
      <header className="hero-section">
        <div className="hero-container">
          {/* Announcement Pill */}
          <div className="hero-badge-pill">
            <span className="pill-dot-pulse"></span>
            <Sparkles size={13} color="#22D3EE" />
            <span>Hybrid Indian Legal RAG + Gemini 2.5 Pro</span>
            <ChevronRight size={13} color="#94A3B8" />
          </div>

          {/* Main Headline */}
          <h1 className="hero-main-title">
            Next-Generation Legal Intelligence <br />
            for <span className="gradient-text">Contracts, Judgments & Compliance</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-description-text">
            Transform complex 500-page agreements and court judgments into instant,
            grounded answers, risk audits, and plain-language explanations in 8+ Indian languages.
            Powered by verifiable page-level citations.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <button
              onClick={() => navigate("/app")}
              className="btn-hero-primary"
            >
              <Zap size={17} />
              <span>Launch Live Workspace</span>
              <ArrowRight size={16} />
            </button>

            <a href="#interactive-demo" className="btn-hero-secondary">
              <span>Try Interactive Demo</span>
              <Sparkles size={15} color="#8B5CF6" />
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="hero-trust-bar">
            <div className="trust-item">
              <CheckCircle2 size={15} color="#10a37f" />
              <span>Supreme Court & High Court Precedents</span>
            </div>
            <div className="trust-divider">•</div>
            <div className="trust-item">
              <CheckCircle2 size={15} color="#10a37f" />
              <span>Zero-Hallucination Page Grounding</span>
            </div>
            <div className="trust-divider">•</div>
            <div className="trust-item">
              <CheckCircle2 size={15} color="#10a37f" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE HERO PRODUCT SHOWCASE (Futuristic 3-Zone Workspace Mockup) */}
        <div className="hero-showcase-wrapper">
          <div className="showcase-glass-card">
            <div className="showcase-top-bar">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="window-address-bar">
                <Lock size={12} color="#10a37f" />
                <span>app.legalai.internal/workspace/commercial-lease-402</span>
              </div>
              <div className="window-meta-tag">
                <span className="pulse-indicator"></span> Live Document Session
              </div>
            </div>

            <div className="showcase-mockup-body">
              {/* Mock Zone 1: Sidebar */}
              <div className="mock-sidebar">
                <div className="mock-section-label">DOCUMENTS</div>
                <div className="mock-doc-item active">
                  <FileText size={13} color="#3B82F6" />
                  <span>Lease_Cyber_Hub.pdf</span>
                </div>
                <div className="mock-doc-item">
                  <Gavel size={13} color="#8B5CF6" />
                  <span>SC_Judgment_4192.pdf</span>
                </div>
                <div className="mock-doc-item">
                  <FileText size={13} color="#94A3B8" />
                  <span>Employment_NDA.pdf</span>
                </div>

                <div className="mock-section-label" style={{ marginTop: "1rem" }}>ACTIVE AUDIT</div>
                <div className="mock-audit-chip high">
                  <AlertTriangle size={12} />
                  <span>1 High Risk Found</span>
                </div>
                <div className="mock-audit-chip ok">
                  <CheckCircle2 size={12} />
                  <span>Statutory Compliance 94%</span>
                </div>
              </div>

              {/* Mock Zone 2: Document Viewer */}
              <div className="mock-doc-viewer">
                <div className="mock-viewer-toolbar">
                  <span>Page <strong>8</strong> of 14</span>
                  <span className="mock-zoom-tag">100%</span>
                </div>
                <div className="mock-parchment">
                  <div className="mock-clause-box cited-glow">
                    <div className="mock-clause-header">
                      <span className="mock-clause-title">CLAUSE 11.0: NOTICE PERIOD & TERMINATION</span>
                      <span className="mock-cited-tag">📍 Cited Evidence</span>
                    </div>
                    <p className="mock-clause-text">
                      "The Lessee must serve a minimum of sixty (60) days prior written notice before vacating the demised premises. Failure to provide sixty (60) days notice shall incur rent penalty equivalent to three (3) months' gross rental."
                    </p>
                  </div>
                  <div className="mock-clause-box" style={{ marginTop: "0.75rem", opacity: 0.6 }}>
                    <div className="mock-clause-header">
                      <span className="mock-clause-title">CLAUSE 12.0: PEACEFUL REPOSSESSION</span>
                    </div>
                    <p className="mock-clause-text">
                      "Upon expiration or premature determination of the lease period, the Lessee shall peacefully yield vacant possession of the premises to Lessor..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Mock Zone 3: AI Assistant */}
              <div className="mock-ai-chat">
                <div className="mock-chat-bubble assistant">
                  <div className="bubble-header">
                    <Scale size={13} color="#8B5CF6" />
                    <strong>Risk Detection Analysis</strong>
                  </div>
                  <p>
                    <strong>🔴 High Exposure Detected in Clause 14:</strong> Premature vacation incurs 24-month lock-in liquidated damages.
                  </p>
                  <div className="mock-citation-pill">
                    <BookOpen size={11} color="#F59E0B" />
                    <span>Page 8 · Clause 11.0</span>
                  </div>
                </div>

                <div className="mock-next-actions-row">
                  <span className="next-label">Next Action:</span>
                  <span className="next-pill">Explain Penalty</span>
                  <span className="next-pill">Tamil Summary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. INTERACTIVE DEMO PLAYGROUND */}
      <section id="interactive-demo" className="interactive-demo-section">
        <div className="section-header-center">
          <div className="section-pill-tag">
            <Zap size={12} color="#22D3EE" />
            <span>Interactive Playground</span>
          </div>
          <h2 className="section-title">
            Test Document Intelligence <span className="gradient-text">Live Right Now</span>
          </h2>
          <p className="section-subtitle">
            Experience how Legal AI reads contracts, isolates critical liabilities, and gives verifiable citations.
          </p>
        </div>

        <div className="demo-playground-card">
          {/* Tabs */}
          <div className="demo-tabs-bar">
            <button
              onClick={() => setActiveDemoTab("lease")}
              className={`demo-tab-btn ${activeDemoTab === "lease" ? "active" : ""}`}
            >
              <FileText size={15} />
              <span>Commercial Lease Agreement</span>
            </button>
            <button
              onClick={() => setActiveDemoTab("judgment")}
              className={`demo-tab-btn ${activeDemoTab === "judgment" ? "active" : ""}`}
            >
              <Gavel size={15} />
              <span>Supreme Court Judgment</span>
            </button>
            <button
              onClick={() => setActiveDemoTab("tamil")}
              className={`demo-tab-btn ${activeDemoTab === "tamil" ? "active" : ""}`}
            >
              <Globe size={15} />
              <span>Tamil Plain-Language Brief</span>
            </button>
          </div>

          {/* Playground Body */}
          <div className="demo-content-grid">
            {/* Left: Input & Document Scope */}
            <div className="demo-input-panel">
              <div className="demo-doc-header">
                <div className="doc-badge-live">
                  <Scale size={13} color="#3B82F6" />
                  <span>{currentDemo.badge}</span>
                </div>
                <h4 className="doc-title-text">{currentDemo.title}</h4>
                <div className="doc-jurisdiction-sub">
                  Jurisdiction: <strong>{currentDemo.jurisdiction}</strong>
                </div>
              </div>

              <div className="demo-user-query-box">
                <span className="query-label">PROMPT QUERY</span>
                <div className="query-bubble">{currentDemo.prompt}</div>
              </div>

              <div className="demo-action-footer">
                <button
                  onClick={() => navigate("/app")}
                  className="btn-demo-open-full"
                >
                  <span>Open in Full 3-Zone Workspace</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Right: AI Intelligence Output */}
            <div className="demo-output-panel">
              <div className="output-header-bar">
                <div className="output-brand">
                  <Sparkles size={14} color="#8B5CF6" />
                  <span>Grounding Verification · 100% Citation Backed</span>
                </div>
                <span className="confidence-chip">Confidence: 99.2%</span>
              </div>

              <div className="output-body-text">
                {currentDemo.answer.split("\n\n").map((chunk, idx) => (
                  <p key={idx} className="output-paragraph">{chunk}</p>
                ))}
              </div>

              <div className="demo-citations-wrapper">
                <span className="citations-label">📚 Verified Evidence Citations:</span>
                <div className="citations-pills-list">
                  {currentDemo.citations.map((cite, cIdx) => (
                    <span key={cIdx} className="cite-badge">
                      <BookOpen size={12} color="#F59E0B" />
                      <span>{cite}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="demo-next-contextual">
                <span className="next-label">Suggested Contextual Next Action:</span>
                <button
                  onClick={() => navigate("/app")}
                  className="suggested-action-chip"
                >
                  <span>{currentDemo.nextAction}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE AI CAPABILITIES GRID */}
      <section id="capabilities" className="capabilities-section">
        <div className="section-header-center">
          <div className="section-pill-tag">
            <Cpu size={12} color="#8B5CF6" />
            <span>Product Architecture</span>
          </div>
          <h2 className="section-title">
            Enterprise Intelligence Built for <span className="gradient-text">Complex Legal Realities</span>
          </h2>
          <p className="section-subtitle">
            Engineered specifically for the nuances of Indian statutes, court precedents, bilingual drafting, and strict compliance.
          </p>
        </div>

        <div className="capabilities-grid">
          {/* Card 1 */}
          <div className="glass-feature-card">
            <div className="feature-icon-box gradient-blue-purple">
              <FileText size={20} color="#ffffff" />
            </div>
            <h3>Document Understanding & OCR</h3>
            <p>
              Handles multi-page scanned deeds, affidavits, and court orders. Identifies sections, recitals, annexures, and signatures with high precision.
            </p>
            <div className="card-tag">OCR + Multi-format Ingestion</div>
          </div>

          {/* Card 2 */}
          <div className="glass-feature-card">
            <div className="feature-icon-box gradient-blue-purple">
              <AlertTriangle size={20} color="#ffffff" />
            </div>
            <h3>Clause-Level Risk Detection</h3>
            <p>
              Scans contracts for unfavorable lock-in periods, unilateral indemnity, excessive liquidated damages, and ambiguous termination periods.
            </p>
            <div className="card-tag">Severity Classification (High/Med/Low)</div>
          </div>

          {/* Card 3 */}
          <div className="glass-feature-card">
            <div className="feature-icon-box gradient-blue-purple">
              <Gavel size={20} color="#ffffff" />
            </div>
            <h3>Supreme Court & High Court Intelligence</h3>
            <p>
              Understands Indian judicial rulings, extracts ratio decidendi, legal issues framed, arguments, and operative directions in seconds.
            </p>
            <div className="card-tag">Indian Precedent Grounding</div>
          </div>

          {/* Card 4 */}
          <div className="glass-feature-card">
            <div className="feature-icon-box gradient-blue-purple">
              <Globe size={20} color="#ffffff" />
            </div>
            <h3>Multilingual Citizen Simplification</h3>
            <p>
              Converts complex statutory legalese into plain, crystal-clear explanations in Tamil (தமிழ்), Hindi (हिंदी), Telugu (తెలుగు), and Kannada.
            </p>
            <div className="card-tag">8+ Indian Regional Languages</div>
          </div>

          {/* Card 5 */}
          <div className="glass-feature-card">
            <div className="feature-icon-box gradient-blue-purple">
              <Volume2 size={20} color="#ffffff" />
            </div>
            <h3>Voice Assistant & Audio Briefing</h3>
            <p>
              Ask legal questions verbally and listen to audio briefings on the go. Integrated with Web Speech API for hands-free courtroom preparation.
            </p>
            <div className="card-tag">Real-time Speech Synthesis & Recognition</div>
          </div>

          {/* Card 6 */}
          <div className="glass-feature-card">
            <div className="feature-icon-box gradient-blue-purple">
              <Shield size={20} color="#ffffff" />
            </div>
            <h3>Statutory & Regulatory Compliance</h3>
            <p>
              Checks documents against the Indian Contract Act 1872, Arbitration & Conciliation Act 1996, and Digital Personal Data Protection (DPDP) Act 2023.
            </p>
            <div className="card-tag">Statutory Rule Validation</div>
          </div>
        </div>
      </section>

      {/* 6. THE 3-ZONE REVOLUTION SECTION */}
      <section id="architecture" className="architecture-section">
        <div className="arch-container">
          <div className="arch-text-content">
            <div className="section-pill-tag">
              <Layers size={12} color="#3B82F6" />
              <span>UX Innovation</span>
            </div>
            <h2 className="section-title">
              Why We Abandoned <br />
              <span className="gradient-text">Siloed 8-Page Tools</span>
            </h2>
            <p className="arch-description">
              Traditional legal software forces you to jump between separate "Summary Pages", "Risk Pages", and "Clause Tools". Every click loses context.
            </p>
            <div className="arch-benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Split size={16} color="#3B82F6" />
                </div>
                <div>
                  <strong>Synchronized 3-Zone Workspace:</strong> The Document Viewer and Conversational AI sit side-by-side.
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Sparkles size={16} color="#8B5CF6" />
                </div>
                <div>
                  <strong>Click-to-Highlight Citations:</strong> Click any citation in chat; the original document page smoothly scrolls and glows into focus.
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <ArrowRight size={16} color="#22D3EE" />
                </div>
                <div>
                  <strong>Contextual Next Actions:</strong> After every answer, Legal AI recommends the next logical step—never leaving you guessing.
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/app")}
              className="btn-hero-primary"
              style={{ marginTop: "1.5rem" }}
            >
              <span>Experience 3-Zone Workspace</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="arch-visual-card">
            <div className="arch-badge-tag">REVOLUTIONARY WORKFLOW</div>
            <div className="arch-diagram-box">
              <div className="diagram-step">
                <span className="step-num">01</span>
                <div>
                  <strong>Upload Document</strong>
                  <p>PDF, Word, or Scanned Orders</p>
                </div>
              </div>
              <div className="diagram-connector">↓</div>
              <div className="diagram-step active">
                <span className="step-num">02</span>
                <div>
                  <strong>Auto-Classify & Ground</strong>
                  <p>Structure, Clauses & Precedents Indexed</p>
                </div>
              </div>
              <div className="diagram-connector">↓</div>
              <div className="diagram-step">
                <span className="step-num">03</span>
                <div>
                  <strong>Document-Centered Chat</strong>
                  <p>Summarize, Audit Risks, and Translate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. METRICS & IMPACT */}
      <section id="metrics" className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-number gradient-text">98.4%</div>
            <div className="metric-label">Clause Extraction Precision</div>
            <div className="metric-sub">Benchmarked on 2,000+ Indian commercial contracts</div>
          </div>
          <div className="metric-card">
            <div className="metric-number gradient-text">10x</div>
            <div className="metric-label">Faster Due Diligence</div>
            <div className="metric-sub">From 4 hours per agreement down to under 5 minutes</div>
          </div>
          <div className="metric-card">
            <div className="metric-number gradient-text">8+</div>
            <div className="metric-label">Indian Regional Languages</div>
            <div className="metric-sub">Tamil, Hindi, Telugu, Kannada, Malayalam & more</div>
          </div>
          <div className="metric-card">
            <div className="metric-number gradient-text">100%</div>
            <div className="metric-label">Verifiable Citations</div>
            <div className="metric-sub">Every single sentence grounded in original text</div>
          </div>
        </div>
      </section>

      {/* 8. ENTERPRISE SECURITY & TRUST */}
      <section id="security" className="security-section">
        <div className="security-card">
          <div className="security-icon-circle">
            <Lock size={28} color="#22D3EE" />
          </div>
          <h2>Bank-Grade Security for Sensitive Legal Data</h2>
          <p>
            Your legal documents never train public AI models. Designed with strict tenant isolation,
            ephemeral processing modes, and SOC-2 / DPDP Act alignment.
          </p>
          <div className="security-badges-row">
            <div className="sec-chip"><Shield size={13} color="#10a37f" /> End-to-End Encryption (AES-256)</div>
            <div className="sec-chip"><Shield size={13} color="#10a37f" /> Zero Model-Training Guarantee</div>
            <div className="sec-chip"><Shield size={13} color="#10a37f" /> Role-Based Tenant Isolation</div>
            <div className="sec-chip"><Shield size={13} color="#10a37f" /> Private Cloud / VPC Deployable</div>
          </div>
        </div>
      </section>

      {/* 9. READY TO TRANSFORM CTA */}
      <section className="bottom-cta-section">
        <div className="cta-banner-container">
          <h2>Ready to Transform Your Legal Workflow?</h2>
          <p>
            Join leading advocates, corporate counsels, and enterprises. Upload your first document in seconds.
          </p>
          <button
            onClick={() => navigate("/app")}
            className="btn-cta-large"
          >
            <span>Launch Legal AI Workspace Free</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 10. MODERN FOOTER */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="nav-brand-logo">
              <div className="brand-icon-box">
                <Scale size={16} color="#ffffff" />
              </div>
              <span className="brand-name">Legal<span className="gradient-text">AI</span></span>
            </div>
            <p className="footer-desc">
              State-of-the-art conversational legal intelligence grounded in Indian jurisprudence and statutory frameworks.
            </p>
            <div className="footer-disclaimer-badge">
              ⚖️ AI Legal Research & Plain-Language Assistance. Not a substitute for formal legal representation.
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Capabilities</h4>
            <Link to="/app">Document Workspace</Link>
            <Link to="/compare">Redline Comparison</Link>
            <Link to="/draft">Clause Drafter</Link>
            <Link to="/indian-legal">Judgments Intelligence</Link>
          </div>

          <div className="footer-links-col">
            <h4>Statutory Law</h4>
            <span>Indian Contract Act, 1872</span>
            <span>Arbitration Act, 1996</span>
            <span>DPDP Act, 2023</span>
            <span>Transfer of Property Act</span>
          </div>

          <div className="footer-links-col">
            <h4>Platform</h4>
            <a href="#interactive-demo">Interactive Demo</a>
            <a href="#architecture">3-Zone Architecture</a>
            <a href="#security">Security & Privacy</a>
            <button onClick={() => navigate("/app")} className="footer-launch-link">Open App →</button>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 Legal AI Technologies Inc. All rights reserved.</span>
          <div className="footer-bottom-links">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Security Whitepaper</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
