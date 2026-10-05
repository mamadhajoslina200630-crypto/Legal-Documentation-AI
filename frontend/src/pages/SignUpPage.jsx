import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scale,
  ShieldCheck,
  FileText,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import "../styles/login.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, login } = useAuthContext();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateFullName = (val) => {
    if (!val.trim()) return "Full name is required.";
    return "";
  };

  const validateEmail = (val) => {
    if (!val.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (val) => {
    if (!val) return "Password is required.";
    if (val.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const nameVal = validateFullName(fullName);
    const emailVal = validateEmail(email);
    const passVal = validatePassword(password);

    setFullNameError(nameVal);
    setEmailError(emailVal);
    setPasswordError(passVal);

    if (nameVal || emailVal || passVal) return;

    setIsLoading(true);
    try {
      await signup(email.trim(), password, fullName.trim());
      // Automatically log the user in
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError("Failed to create account. Please verify your details or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page-root">
      <div className="auth-layout-grid">
        {/* Left Branding Panel */}
        <section className="auth-branding-panel" aria-label="Legal AI Overview">
          <div className="auth-branding-content">
            <div className="auth-brand-badge">
              <div className="auth-brand-logo-icon">
                <Scale size={14} />
              </div>
              <span className="auth-brand-title">LegalAI</span>
              <span className="auth-brand-pill">Practitioner Access</span>
            </div>

            <h1 className="auth-hero-heading">
              Enterprise Legal Tech, <br />
              <span className="gradient-text">At Your Fingertips.</span>
            </h1>

            <p className="auth-hero-desc">
              Join legal practitioners, corporate counsel, and law researchers automating
              contract forensics, judgment analysis, and risk detection.
            </p>

            <div className="auth-visual-showcase" role="img" aria-label="Legal AI Platform Overview">
              <div className="visual-card-header">
                <div className="visual-doc-badge">
                  <FileText size={16} color="var(--blue-primary)" />
                  <span>8 Specialized Legal Microservices</span>
                </div>
                <div className="visual-doc-confidence">
                  <ShieldCheck size={13} />
                  <span>Verified Architecture</span>
                </div>
              </div>

              <div className="doc-clause-highlight">
                <strong>Grounded AI Extraction</strong>
                <span>
                  Stateless RAG architecture with exact document line citations and zero hallucinations.
                </span>
              </div>

              <div className="visual-feature-pills">
                <div className="visual-pill-item">
                  <Sparkles size={12} />
                  <span>Tamil, Malayalam & Regional Indic Support</span>
                </div>
                <div className="visual-pill-item">
                  <Scale size={12} />
                  <span>Order XXXVIII CPC Analysis</span>
                </div>
              </div>
            </div>
          </div>

          <footer className="auth-branding-footer">
            <span className="auth-security-stamp">
              <ShieldCheck size={14} color="#16A34A" />
              <span>SOC2 & Enterprise Data Isolation</span>
            </span>
            <span>© 2026 LegalAI Technologies</span>
          </footer>
        </section>

        {/* Right Signup Form Card */}
        <section className="auth-form-panel" aria-label="Sign Up Section">
          <div className="auth-card-container">
            <div className="mobile-auth-brand">
              <div className="auth-brand-logo-icon">
                <Scale size={14} />
              </div>
              <span className="auth-brand-title">LegalAI</span>
            </div>

            <div className="auth-card-header">
              <h2 className="auth-form-title">Create an account</h2>
              <p className="auth-form-subtitle">
                Get started with your enterprise Legal AI intelligence workspace.
              </p>
            </div>

            {authError && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="signup-name">
                  Full Name
                </label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" aria-hidden="true" />
                  <input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fullNameError) setFullNameError("");
                    }}
                    placeholder="Adv. Rajesh Kumar"
                    className={`auth-input ${fullNameError ? "has-error" : ""}`}
                    autoComplete="name"
                    required
                    disabled={isLoading}
                  />
                </div>
                {fullNameError && (
                  <span className="auth-field-error" role="alert">{fullNameError}</span>
                )}
              </div>

              {/* Email */}
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="signup-email">
                  Work Email
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" aria-hidden="true" />
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="rajesh@lawchambers.in"
                    className={`auth-input ${emailError ? "has-error" : ""}`}
                    autoComplete="email"
                    required
                    disabled={isLoading}
                  />
                </div>
                {emailError && (
                  <span className="auth-field-error" role="alert">{emailError}</span>
                )}
              </div>

              {/* Password */}
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="signup-password">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" aria-hidden="true" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    placeholder="Create a strong password (min. 6 chars)"
                    className={`auth-input ${passwordError ? "has-error" : ""}`}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordError && (
                  <span className="auth-field-error" role="alert">{passwordError}</span>
                )}
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="auth-spinner" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch-prompt">
              <span>Already have an account?</span>
              <Link to="/login" className="auth-switch-link">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
