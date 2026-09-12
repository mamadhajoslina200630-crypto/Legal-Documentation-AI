import React, { createContext, useContext, useState } from "react";

const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
  const [activeDocument, setActiveDocument] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // 'en' | 'hi' | 'ta' | 'te' | 'bn'
  const [isSimplifiedView, setIsSimplifiedView] = useState(false);

  return (
    <DocumentContext.Provider
      value={{
        activeDocument,
        setActiveDocument,
        selectedLanguage,
        setSelectedLanguage,
        isSimplifiedView,
        setIsSimplifiedView,
      }}
    >
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
