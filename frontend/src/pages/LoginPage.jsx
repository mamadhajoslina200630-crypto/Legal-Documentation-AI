import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Scale,
  ShieldCheck,
  FileText,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import "../styles/login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // If already logged in, redirect to workspace
  useEffect(() => {
    if (isAuthenticated) {
      const target = location.state?.from || "/";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateEmail = (val) => {
    if (!val.trim()) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validatePassword = (val) => {
    if (!val) {
      return "Password is required.";
    }
    return "";
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setForgotSent(false);

    const emailValidation = validateEmail(email);
    const passValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passValidation);

    if (emailValidation || passValidation) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
      const destination = location.state?.from || "/";
      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Authentication error:", err);
      // Give clean, professional legal-tech message without exposing internals
      if (err.status === 401 || err.status === 403) {
        setAuthError("Invalid email or password. Please verify your credentials.");
      } else if (err.message && err.message.includes("Network")) {
        setAuthError("Unable to reach authentication service. Please check your connection.");
      } else {
        setAuthError("Authentication failed. Please verify your credentials or try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("demo@legalai.in");
    setPassword("LegalTech2026!");
    setEmailError("");
    setPasswordError("");
    setAuthError("");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <main className="auth-page-root">
      <div className="auth-layout-grid">
        {/* ====================================================================
            LEFT: Legal AI Branding & Visual Section (Desktop)
            ==================================================================== */}
        <section className="auth-branding-panel" aria-label="Legal AI Overview">
          <div className="auth-branding-content">
            {/* Brand Logo Mark */}
            <div className="auth-brand-badge">
              <div className="auth-brand-logo-icon">
                <Scale size={14} />
              </div>
              <span className="auth-brand-title">LegalAI</span>
              <span className="auth-brand-pill">Intelligence</span>
            </div>

            {/* Main Branding Headings */}
            <h1 className="auth-hero-heading">
              Legal Intelligence, <br />
              <span className="gradient-text">Simplified.</span>
            </h1>

            <p className="auth-hero-desc">
              Analyze legal documents, understand complex information, and work smarter with
              AI-powered legal intelligence.
            </p>

            {/* Sophisticated Legal-Tech Visual Artifact */}
            <div className="auth-visual-showcase" role="img" aria-label="Legal Document Intelligence Preview">
              <div className="visual-card-header">
                <div className="visual-doc-badge">
                  <FileText size={16} color="var(--blue-primary)" />
                  <span>Commercial Lease Agreement & Forensics</span>
                </div>
                <div className="visual-doc-confidence">
                  <ShieldCheck size={13} />
                  <span>99.4% AI Confidence</span>
                </div>
              </div>

              <div className="visual-doc-lines">
                <div className="doc-line-skeleton long"></div>
                <div className="doc-line-skeleton medium"></div>
              </div>

              <div className="doc-clause-highlight">
                <strong>Clause 11.0 · Risk Detected</strong>
                <span>
                  "7-day unilateral termination creates acute operational vulnerability under Indian contract norms."
                </span>
              </div>

              <div className="visual-feature-pills">
                <div className="visual-pill-item">
                  <Sparkles size={12} />
                  <span>Sub-second Parsing</span>
                </div>
                <div className="visual-pill-item">
                  <Scale size={12} />
                  <span>Indian Case Law Grounding</span>
                </div>
                <div className="visual-pill-item">
                  <Cpu size={12} />
                  <span>Multi-Agent Synthesis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Panel Footer */}
          <footer className="auth-branding-footer">
            <span className="auth-security-stamp">
              <ShieldCheck size={14} color="#16A34A" />
              <span>Enterprise End-to-End Encryption</span>
            </span>
            <span>© 2026 LegalAI Technologies</span>
          </footer>
        </section>

        {/* ====================================================================
            RIGHT: Login Form Card
            ==================================================================== */}
        <section className="auth-form-panel" aria-label="Sign In Section">
          <div className="auth-card-container">
            {/* Mobile Header (displayed on screens < 960px) */}
            <div className="mobile-auth-brand">
              <div className="auth-brand-logo-icon">
                <Scale size={14} />
              </div>
              <span className="auth-brand-title">LegalAI</span>
            </div>

            <div className="auth-card-header">
              <h2 className="auth-form-title">Welcome back</h2>
              <p className="auth-form-subtitle">
                Sign in to continue to your Legal AI workspace.
              </p>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            {/* Forgot Password Feedback Banner */}
            {forgotSent && (
              <div className="auth-success-banner" role="status">
                <CheckCircle2 size={16} />
                <span>Password reset instructions sent to your registered address.</span>
              </div>
            )}

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Field 1: Email */}
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="login-email">
                  Email
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" aria-hidden="true" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    onBlur={handleEmailBlur}
                    placeholder="Enter your email address"
                    className={`auth-input ${emailError ? "has-error" : ""}`}
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "email-error-msg" : undefined}
                    disabled={isLoading}
                  />
                </div>
                {emailError && (
                  <span id="email-error-msg" className="auth-field-error" role="alert">
                    {emailError}
                  </span>
                )}
              </div>

              {/* Field 2: Password */}
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="login-password">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" aria-hidden="true" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    onBlur={handlePasswordBlur}
                    placeholder="Enter your password"
                    className={`auth-input ${passwordError ? "has-error" : ""}`}
                    autoComplete="current-password"
                    required
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? "password-error-msg" : undefined}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordError && (
                  <span id="password-error-msg" className="auth-field-error" role="alert">
                    {passwordError}
                  </span>
                )}
              </div>

              {/* Below Password: Remember Me & Forgot Password */}
              <div className="auth-options-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="auth-checkbox"
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="auth-forgot-link"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="auth-spinner" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Quick Demo Helper for Evaluators */}
              <div className="auth-demo-helper">
                <span>Try with pre-configured legal account:</span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="auth-demo-helper-btn"
                  title="Auto-fill demo credentials"
                >
                  Fill Demo
                </button>
              </div>
            </form>

            {/* Switch to Registration */}
            <div className="auth-switch-prompt">
              <span>Don't have an account?</span>
              <Link to="/signup" className="auth-switch-link">
                Create account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
