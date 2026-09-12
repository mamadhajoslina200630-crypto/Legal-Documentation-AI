import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const DocumentContext = createContext(null);

// Default sample documents for immediate testing
export const SAMPLE_DOCUMENTS = [
  {
    id: "doc-sample-lease",
    filename: "Commercial_Lease_Agreement.pdf",
    docType: "Commercial Lease Agreement",
    totalPages: 14,
    jurisdiction: "India (Transfer of Property Act, 1882)",
    language: "English",
    uploadDate: "Just now",
    summary: "14-page commercial tenancy contract between Horizon Properties Ltd (Lessor) and NexaTech Solutions Pvt Ltd (Lessee) for office premises at Cyber Hub, Gurugram. Monthly rent INR 3,50,000 with 3-year term and 60 days lock-in.",
    pages: [
      {
        pageNumber: 1,
        title: "PARTIES & PREMISES",
        content: `COMMERCIAL LEASE AGREEMENT\n\nThis Commercial Lease Agreement is executed on this 1st day of October, 2024 at Gurugram, Haryana.\n\nBETWEEN:\nHORIZON PROPERTIES PRIVATE LIMITED, a company incorporated under the Companies Act, 2013, having its registered office at Cyber City, Sector 24, Gurugram (hereinafter referred to as the 'LESSOR') of the FIRST PART;\n\nAND:\nNEXATECH SOLUTIONS PRIVATE LIMITED, a company incorporated under the Companies Act, 2013, having its registered office at Outer Ring Road, Bengaluru (hereinafter referred to as the 'LESSEE') of the SECOND PART.`,
        clauses: [
          { id: "clause-1", number: "1.0", title: "Definitions & Premises", text: "The Lessor hereby demises unto the Lessee all that commercial premises situated at Unit 402, 4th Floor, Horizon Towers, Cyber Hub, Gurugram, measuring approximately 4,200 sq. ft. super built-up area." }
        ]
      },
      {
        pageNumber: 3,
        title: "SECURITY DEPOSIT",
        content: `Page 3 of 14 — Horizon Properties & NexaTech Solutions\n\n3.0 SECURITY DEPOSIT & ESCROW TERMS\n\nThe Lessee shall deposit with the Lessor an interest-free refundable security deposit equal to six (6) months' rent, amounting to INR 21,00,000 (Rupees Twenty-One Lakhs only) upon execution of this Agreement.`,
        clauses: [
          { id: "clause-5", number: "5.0", title: "Security Deposit Forfeiture", text: "In the event of any alleged breach of peaceful possession or unauthorized interior modifications, the Lessor reserves the sole right to forfeit the entire Security Deposit without prejudice to additional claim for damages." }
        ]
      },
      {
        pageNumber: 8,
        title: "TERMINATION & NOTICE",
        content: `Page 8 of 14 — Horizon Properties & NexaTech Solutions\n\n11.0 TERMINATION AND VACATION\n\nEither party may terminate this lease after the expiry of the mandatory Lock-in Period by serving written notice as stipulated herein.`,
        clauses: [
          { id: "clause-11", number: "11.0", title: "Notice Period & Vacation", text: "The Lessee must serve a minimum of sixty (60) days prior written notice before vacating the demised premises. Failure to provide sixty (60) days notice shall incur rent penalty equivalent to three (3) months' gross rental." }
        ]
      },
      {
        pageNumber: 9,
        title: "LIQUIDATED DAMAGES & PENALTY",
        content: `Page 9 of 14 — Horizon Properties & NexaTech Solutions\n\n14.0 EARLY TERMINATION LIQUIDATED DAMAGES\n\nBoth parties acknowledge that the agreed lock-in period of twenty-four (24) months is of the essence of this lease contract.`,
        clauses: [
          { id: "clause-14", number: "14.0", title: "Early Termination Penalty", text: "If the Lessee terminates this Lease prior to completion of the 24-month lock-in period, the Lessee shall immediately pay the Lessor the remaining rental for the unexpired lock-in period as pre-estimated liquidated damages." }
        ]
      },
      {
        pageNumber: 12,
        title: "DISPUTE RESOLUTION & ARBITRATION",
        content: `Page 12 of 14 — Horizon Properties & NexaTech Solutions\n\n18.0 GOVERNING LAW AND ARBITRATION\n\nThis Agreement shall be governed by and construed in accordance with the substantive laws of India. Any dispute arising out of or in connection with this Agreement shall be referred to arbitration under the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Gurugram, Haryana.`,
        clauses: [
          { id: "clause-18", number: "18.0", title: "Arbitration & Jurisdiction", text: "Sole arbitrator shall be nominated by the Lessor. Courts at Gurugram, Haryana shall have exclusive territorial jurisdiction over any interim reliefs." }
        ]
      }
    ]
  },
  {
    id: "doc-sample-judgment",
    filename: "Supreme_Court_Judgment_CA_4192_2024.pdf",
    docType: "Supreme Court Judgment",
    totalPages: 28,
    jurisdiction: "Supreme Court of India (Civil Appellate Jurisdiction)",
    language: "English / Indian Precedent",
    uploadDate: "Yesterday",
    summary: "Civil Appeal No. 4192 of 2024 (Arising out of SLP (C) No. 11029/2023). Division Bench: Hon'ble Justice D.Y. Chandrachud & Hon'ble Justice P.S. Narasimha. Ruling on unilateral arbitration appointment clauses and statutory compliance under Section 11(6) of Arbitration & Conciliation Act.",
    pages: [
      {
        pageNumber: 1,
        title: "IN THE SUPREME COURT OF INDIA",
        content: `IN THE SUPREME COURT OF INDIA\nCIVIL APPELLATE JURISDICTION\n\nCIVIL APPEAL NO. 4192 OF 2024\n(Arising out of SLP (Civil) No. 11029 of 2023)\n\nABC INFRASTRUCTURE PVT. LTD. ... APPELLANT\nVERSUS\nUNION OF INDIA & ANR. ... RESPONDENTS`,
        clauses: [
          { id: "clause-j1", number: "Para 1", title: "Introduction & Appeal", text: "Leave granted. The present appeal raises a seminal question of law regarding the validity of unilateral appointment of a sole arbitrator by one party having superior bargaining power." }
        ]
      },
      {
        pageNumber: 12,
        title: "LEGAL ISSUES & PRECEDENTS",
        content: `Page 12 of 28 — Supreme Court of India\n\nISSUE FRAMED:\nWhether an arbitration clause entitling one party to curate a unilateral panel of arbitrators violates the principle of neutrality enshrined in Section 12(5) read with the Seventh Schedule of the Arbitration and Conciliation Act, 1996.`,
        clauses: [
          { id: "clause-j12", number: "Para 18", title: "Statutory Neutrality", text: "The foundational premise of arbitration is party equality. A clause that gives one contracting party unilateral authority to nominate all panellists creates an inherent justifiable apprehension of bias." }
        ]
      },
      {
        pageNumber: 18,
        title: "COURT'S RATIO DECIDENDI",
        content: `Page 18 of 28 — Supreme Court of India\n\nANALYSIS AND REASONING:\nApplying the ratio laid down in Perkins Eastman Architects DPC and TRF Limited, an ineligible arbitrator cannot nominate another arbitrator. What cannot be done directly cannot be sanctioned indirectly.`,
        clauses: [
          { id: "clause-j18", number: "Para 27", title: "Invalidity of Unilateral Panels", text: "We hold that unilateral appointment clauses in public and private contracts fail the test of independence and are void ab initio. The High Court was in error in rejecting the Section 11(6) application." }
        ]
      },
      {
        pageNumber: 24,
        title: "FINAL DIRECTIONS & ORDER",
        content: `Page 24 of 28 — Supreme Court of India\n\nFINAL ORDER:\n(i) Appeal is allowed with costs.\n(ii) An independent sole arbitrator is hereby appointed from the Delhi International Arbitration Centre (DIAC) panel.\n(iii) The impugned order of the High Court is set aside.`,
        clauses: [
          { id: "clause-j24", number: "Para 35", title: "Operative Decree", text: "The dispute is referred to Justice (Retd.) A.K. Sikri as the independent Sole Arbitrator. Arbitrator fee shall be governed by the Fourth Schedule of the Act." }
        ]
      }
    ]
  }
];

export function DocumentProvider({ children }) {
  const [activeDocument, setActiveDocument] = useState(SAMPLE_DOCUMENTS[0]);
  const [documentsList, setDocumentsList] = useState(SAMPLE_DOCUMENTS);
  const [activeCitation, setActiveCitation] = useState(null); // { page, clauseId, text }
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // 'en' | 'ta' | 'hi' | 'te' | 'bn'
  const [isSimplifiedView, setIsSimplifiedView] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'chat-only' | 'doc-only'

  // Fetch documents from backend on mount
  useEffect(() => {
    api.get("/documents")
      .then((docs) => {
        if (Array.isArray(docs) && docs.length > 0) {
          // Merge backend docs with sample documents
          const formatted = docs.map((d) => ({
            id: d.id,
            filename: d.filename,
            docType: d.filename.toLowerCase().includes("judgment") || d.filename.toLowerCase().includes("order") 
              ? "Court Order / Judgment" 
              : "Commercial Legal Agreement",
            totalPages: d.file_size ? Math.max(1, Math.ceil(d.file_size / 25000)) : 8,
            jurisdiction: "India (Courts & Statutes)",
            language: "English",
            uploadDate: d.created_at ? new Date(d.created_at).toLocaleDateString() : "Uploaded",
            pages: SAMPLE_DOCUMENTS[0].pages
          }));
          setDocumentsList([...formatted, ...SAMPLE_DOCUMENTS]);
        }
      })
      .catch(() => {
        // Use default sample documents
      });
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        activeDocument,
        setActiveDocument,
        documentsList,
        setDocumentsList,
        activeCitation,
        setActiveCitation,
        selectedLanguage,
        setSelectedLanguage,
        isSimplifiedView,
        setIsSimplifiedView,
        viewMode,
        setViewMode,
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
