import React from "react";
import { useDocumentContext } from "../context/DocumentContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useDocumentContext();

  const handleSelect = (lang, e) => {
    e.stopPropagation();
    setLanguage(lang);
  };

  const cycleLanguage = () => {
    setLanguage((prev) => {
      if (prev === "en") return "ta";
      if (prev === "ta") return "ml";
      if (prev === "ml") return "te";
      return "en";
    });
  };

  return (
    <div
      onClick={cycleLanguage}
      className="lang-switcher-btn"
      title="Switch Language: English | தமிழ் | മലയാളം | తెలుగు"
      aria-label="Select language: EN | தமிழ் | മലയാളം | తెలుగు"
      role="group"
    >
      <span
        className={`lang-option ${language === "en" ? "active-lang" : ""}`}
        onClick={(e) => handleSelect("en", e)}
        title="English"
      >
        EN
      </span>
      <span className="lang-divider">|</span>
      <span
        className={`lang-option ${language === "ta" ? "active-lang" : ""}`}
        onClick={(e) => handleSelect("ta", e)}
        title="தமிழ் (Tamil)"
      >
        தமிழ்
      </span>
      <span className="lang-divider">|</span>
      <span
        className={`lang-option ${language === "ml" ? "active-lang" : ""}`}
        onClick={(e) => handleSelect("ml", e)}
        title="മലയാളം (Malayalam)"
      >
        മലയാളം
      </span>
      <span className="lang-divider">|</span>
      <span
        className={`lang-option ${language === "te" ? "active-lang" : ""}`}
        onClick={(e) => handleSelect("te", e)}
        title="తెలుగు (Telugu)"
      >
        తెలుగు
      </span>
    </div>
  );
}
