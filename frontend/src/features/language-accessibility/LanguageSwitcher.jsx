import React from "react";
import { Languages } from "lucide-react";
import { useDocumentContext } from "../../context/DocumentContext";

export function LanguageSwitcher() {
  const { selectedLanguage, setSelectedLanguage } = useDocumentContext();

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी (Hindi)" },
    { code: "ta", label: "தமிழ் (Tamil)" },
    { code: "te", label: "తెలుగు (Telugu)" },
    { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { code: "bn", label: "বাংলা (Bengali)" },
    { code: "mr", label: "मराठी (Marathi)" },
  ];

  return (
    <div id="language-switcher-widget" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Languages size={18} color="var(--accent-indigo)" />
      <select
        id="language-select-dropdown"
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-primary)",
          borderRadius: "6px",
          padding: "0.35rem 0.6rem",
          fontSize: "0.825rem",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} style={{ backgroundColor: "#111827", color: "#ffffff" }}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSwitcher;
