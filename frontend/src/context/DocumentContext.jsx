import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const DocumentContext = createContext(null);

export const SAMPLE_DOCUMENTS = [
  {
    id: "doc-sample-lease",
    filename: "Commercial_Lease_Agreement.pdf",
    docType: "Commercial Lease Agreement",
    totalPages: 14,
    jurisdiction: "India (Transfer of Property Act, 1882)",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "PARTIES & PREMISES",
        content: `COMMERCIAL LEASE AGREEMENT\n\nThis Commercial Lease Agreement is executed on this 1st day of October, 2024 at Gurugram, Haryana.\n\nBETWEEN:\nHORIZON PROPERTIES PRIVATE LIMITED (Lessor)\nAND:\nNEXATECH SOLUTIONS PRIVATE LIMITED (Lessee).`,
        clauses: [
          { id: "clause-1", number: "1.0", title: "Premises Demised", text: "Unit 402, 4th Floor, Horizon Towers, Cyber Hub, Gurugram (4,200 sq. ft. super built-up area)." }
        ]
      },
      {
        pageNumber: 3,
        title: "SECURITY DEPOSIT",
        content: `3.0 SECURITY DEPOSIT & ESCROW TERMS\n\nThe Lessee shall deposit an interest-free refundable security deposit of INR 21,00,000 (6 months' gross rent).`,
        clauses: [
          { id: "clause-5", number: "5.0", title: "Security Deposit Forfeiture", text: "Lessor reserves the sole right to forfeit the entire Security Deposit (INR 21,00,000) in event of any unauthorized interior modification or alleged breach." }
        ]
      },
      {
        pageNumber: 8,
        title: "TERMINATION & NOTICE",
        content: `11.0 TERMINATION AND VACATION\n\nEither party may terminate this lease after the expiry of the mandatory 24-month Lock-in Period.`,
        clauses: [
          { id: "clause-11", number: "11.0", title: "Notice Period & Vacation", text: "The Lessee must serve a minimum of sixty (60) days prior written notice before vacating the premises. Failure to provide 60 days notice incurs a 3-month rent penalty." }
        ]
      },
      {
        pageNumber: 9,
        title: "LOCK-IN PENALTY",
        content: `14.0 EARLY TERMINATION LIQUIDATED DAMAGES\n\nThe agreed lock-in period of 24 months is of the essence of this contract.`,
        clauses: [
          { id: "clause-14", number: "14.0", title: "Early Termination Penalty", text: "If Lessee terminates prior to 24 months, Lessee shall immediately pay the remaining rent for the unexpired lock-in period as liquidated damages." }
        ]
      },
      {
        pageNumber: 12,
        title: "DISPUTE RESOLUTION",
        content: `18.0 ARBITRATION AND JURISDICTION\n\nGoverned by the substantive laws of India and the Arbitration and Conciliation Act, 1996. Seat: Gurugram, Haryana.`,
        clauses: [
          { id: "clause-18", number: "18.0", title: "Sole Arbitrator Clause", text: "Sole arbitrator shall be nominated by the Lessor. Courts at Gurugram shall have exclusive jurisdiction." }
        ]
      }
    ]
  },
  {
    id: "doc-sample-judgment",
    filename: "Supreme_Court_Civil_Appeal_4192_2024.pdf",
    docType: "Supreme Court Judgment",
    totalPages: 28,
    jurisdiction: "Supreme Court of India",
    language: "English / Indian Precedent",
    pages: [
      {
        pageNumber: 1,
        title: "SUPREME COURT OF INDIA",
        content: `IN THE SUPREME COURT OF INDIA\nCIVIL APPEAL NO. 4192 OF 2024\nABC INFRASTRUCTURE PVT. LTD. v. UNION OF INDIA & ANR.`,
        clauses: [
          { id: "clause-j1", number: "Para 1", title: "Appeal & Seminal Question", text: "Whether unilateral appointment of sole arbitrators by a party violates statutory neutrality." }
        ]
      },
      {
        pageNumber: 18,
        title: "RATIO DECIDENDI",
        content: `ANALYSIS AND HOLDING:\nApplying Perkins Eastman and TRF Limited, party autonomy cannot defeat statutory independence under Section 12(5).`,
        clauses: [
          { id: "clause-j18", number: "Para 27", title: "Unilateral Panel Struck Down", text: "Unilateral arbitrator appointments fail the test of independence and are void ab initio." }
        ]
      },
      {
        pageNumber: 24,
        title: "FINAL ORDER & RELIEF",
        content: `FINAL DIRECTIONS:\nAppeal allowed with costs. Independent sole arbitrator appointed from DIAC panel.`,
        clauses: [
          { id: "clause-j24", number: "Para 35", title: "Operative Directions", text: "Justice (Retd.) A.K. Sikri appointed as independent Sole Arbitrator under Fourth Schedule fees." }
        ]
      }
    ]
  }
];

export function DocumentProvider({ children }) {
  const [activeDocument, setActiveDocument] = useState(null); // default null until user uploads or tests demo
  const [activeCitation, setActiveCitation] = useState(null); // { page, clauseId, text }
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false); // SPLIT SCREEN IS CLOSED BY DEFAULT
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // 'en' | 'ta' (English & Tamil only)
  const [lastAssistantAnswer, setLastAssistantAnswer] = useState(""); // For TTS in typing section
  const [conversations, setConversations] = useState([]);

  // Fetch conversations history
  const fetchConversations = () => {
    api.get("/chat/conversations")
      .then((data) => {
        if (Array.isArray(data)) setConversations(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchConversations();
    window.addEventListener("conversations-updated", fetchConversations);
    return () => window.removeEventListener("conversations-updated", fetchConversations);
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        activeDocument,
        setActiveDocument,
        activeCitation,
        setActiveCitation,
        isDocViewerOpen,
        setIsDocViewerOpen,
        selectedLanguage,
        setSelectedLanguage,
        lastAssistantAnswer,
        setLastAssistantAnswer,
        conversations,
        setConversations,
        fetchConversations,
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
