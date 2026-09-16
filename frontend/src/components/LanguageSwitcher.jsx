import React from "react";
import { useDocumentContext } from "../context/DocumentContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useDocumentContext();

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ta" : "en"));
  };

  return (
    <button
      onClick={toggleLanguage}
      className="lang-switcher-btn"
      title={language === "en" ? "Switch to Tamil (தமிழ்)" : "Switch to English"}
      aria-label="Toggle language"
    >
      <span className={language === "en" ? "active-lang" : ""}>EN</span>
      <span className="lang-divider">|</span>
      <span className={language === "ta" ? "active-lang" : ""}>தமிழ்</span>
    </button>
  );
}
