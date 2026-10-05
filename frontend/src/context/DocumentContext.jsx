import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";
import { translations } from "./translations";


const DocumentContext = createContext(null);

export const SAMPLE_DOCUMENTS = [
  {
    id: "doc-commercial-lease",
    filename: "Commercial_Lease_Agreement.pdf",
    docType: "Commercial Real Estate Lease",
    category: "contract",
    totalPages: 12,
    totalClauses: 87,
    jurisdiction: "India (Transfer of Property Act, 1882)",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "PARTIES & DEMISED PREMISES",
        content: `COMMERCIAL LEASE AGREEMENT\n\nThis Commercial Lease Agreement (the "Agreement") is executed on this 1st day of October, 2024 at Gurugram, Haryana.\n\nBETWEEN:\nHORIZON PROPERTIES PRIVATE LIMITED, a corporation registered under the Companies Act, 2013, having its corporate office at Horizon Cyber Towers, DLF Phase 2, Gurugram (hereinafter "Lessor")\n\nAND:\nNEXATECH SOLUTIONS PRIVATE LIMITED, a technology company incorporated under the Companies Act, 2013, having its registered office at Cyber City, Gurugram (hereinafter "Lessee").`,
        clauses: [
          {
            id: "clause-1",
            number: "1.0",
            title: "Premises Demised",
            text: "The Lessor hereby demises unto the Lessee all that commercial office suite comprising Unit 402, 4th Floor, Horizon Towers, Cyber Hub, Gurugram, containing approximately 4,200 square feet of super built-up area together with 4 reserved basement car parking spaces.",
            riskLevel: "LOW",
            riskExplanation: "Standard description of commercial premises and parking allotment."
          },
          {
            id: "clause-2",
            number: "2.1",
            title: "Term of Lease",
            text: "The initial lease term shall be for a fixed duration of sixty (60) calendar months commencing from October 15, 2024 ('Commencement Date') and concluding on October 14, 2029, unless terminated earlier in accordance with provisions herein.",
            riskLevel: "LOW",
            riskExplanation: "Standard 5-year commercial lease duration."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "SECURITY DEPOSIT & FORFEITURE",
        content: `3.0 FINANCIAL OBLIGATIONS & SECURITY ESCROW\n\n3.1 The Lessee shall remit a monthly gross base rental of INR 3,50,000 (Rupees Three Lakhs Fifty Thousand only) plus applicable GST, payable in advance on or before the 5th calendar day of each month.`,
        clauses: [
          {
            id: "clause-5",
            number: "5.0",
            title: "Security Deposit Forfeiture",
            text: "Lessor reserves the absolute and unfettered right to immediately forfeit the entire Security Deposit of INR 21,00,000 (Twenty-One Lakhs) in the event of any unauthorized interior fixture modification, operational irregularity, or alleged contractual default without prior judicial determination.",
            riskLevel: "MEDIUM",
            riskExplanation: "Allows landlord to forfeit 6 months security deposit without proof of pecuniary loss under Section 74 Indian Contract Act."
          }
        ]
      },
      {
        pageNumber: 8,
        title: "TERMINATION & NOTICE",
        content: `11.0 TERMINATION RIGHTS & VACATION PROTOCOL\n\n11.1 The parties recognize the commercial necessity of predictable tenure and orderly handover.`,
        clauses: [
          {
            id: "clause-11",
            number: "11.0",
            title: "Termination Notice Clause",
            text: "Either party may terminate this agreement with seven (7) days written notice. Upon expiration of said seven days, the Lessee must vacate the premises immediately, relinquishing all tenant leasehold fixtures without right of cure.",
            riskLevel: "HIGH",
            riskExplanation: "Disproportionately short 7-day notice is commercially hazardous for enterprise operations."
          }
        ]
      },
      {
        pageNumber: 9,
        title: "LOCK-IN PERIOD & ACCELERATED DAMAGES",
        content: `14.0 LOCK-IN OBLIGATIONS AND ACCELERATED DAMAGES\n\n14.1 The agreed lock-in duration of twenty-four (24) months is of the essence of this commercial transaction.`,
        clauses: [
          {
            id: "clause-14",
            number: "14.0",
            title: "Lock-in Penalty",
            text: "If Lessee terminates this Agreement prior to the expiration of twenty-four (24) months, Lessee shall immediately pay the gross rent for the entire unexpired lock-in period as liquidated damages, irrespective of whether Lessor re-lets the premises.",
            riskLevel: "CRITICAL",
            riskExplanation: "Penal acceleration clause violating statutory duty to mitigate damages under Indian contract law."
          }
        ]
      },
      {
        pageNumber: 12,
        title: "DISPUTE RESOLUTION & ARBITRATION",
        content: `18.0 ARBITRATION AND GOVERNING LAW\n\n18.1 This Agreement shall be construed and enforced according to the laws of the Republic of India.`,
        clauses: [
          {
            id: "clause-18",
            number: "18.0",
            title: "Sole Arbitrator Appointment",
            text: "All disputes and controversies arising hereunder shall be referred to a sole arbitrator appointed unilaterally and exclusively by the Managing Director of the Lessor. The venue and seat of arbitration shall be Gurugram, Haryana.",
            riskLevel: "HIGH",
            riskExplanation: "Unilateral arbitrator appointments violate Section 12(5) and Schedule VII of the Arbitration and Conciliation Act (Perkins Eastman principle)."
          }
        ]
      }
    ]
  },
  {
    id: "doc-supreme-court-judgment",
    filename: "Perkins_Eastman_Architects_vs_HSCC_SC_Judgment.pdf",
    docType: "Supreme Court Judgment",
    category: "judgment",
    totalPages: 18,
    totalClauses: 34,
    jurisdiction: "Supreme Court of India (Civil Appellate Jurisdiction)",
    language: "English",
    citation: "(2020) 15 SCC 760",
    bench: "Hon'ble Dr. Justice D.Y. Chandrachud & Hon'ble Justice Ajay Rastogi",
    pages: [
      {
        pageNumber: 1,
        title: "IN THE SUPREME COURT OF INDIA - ARBITRATION APPLICATION NO. 32 OF 2019",
        content: `IN THE SUPREME COURT OF INDIA\nCIVIL ORIGINAL JURISDICTION\nARBITRATION APPLICATION NO. 32 OF 2019\n\nPerkins Eastman Architects DPC & Anr. ... Petitioners\nVERSUS\nHSCC (India) Ltd. ... Respondent\n\nJUDGMENT\nUday Umesh Lalit, J.\n\n1. This application under Section 11(6) read with Section 11(12)(a) of the Arbitration and Conciliation Act, 1996 prays for appointment of a sole arbitrator in terms of Clause 24 of the Contract Agreement dated 22.05.2017 executed between the parties.`,
        clauses: [
          {
            id: "clause-sc-1",
            number: "Para 1",
            title: "Application under Section 11(6)",
            text: "Application filed before the Supreme Court seeking appointment of an independent sole arbitrator after the Respondent's Chief Managing Director purported to unilaterally appoint a sole arbitrator.",
            riskLevel: "LOW",
            riskExplanation: "Procedural invoking of Supreme Court appointment jurisdiction under Section 11(6)."
          }
        ]
      },
      {
        pageNumber: 8,
        title: "ISSUE: UNILATERAL APPOINTMENT BY INTERESTED PARTY",
        content: `14. The core issue falling for determination is whether a person who has become ineligible by operation of law under Section 12(5) read with Schedule VII of the Arbitration Act, is still eligible to nominate another person as the sole arbitrator.`,
        clauses: [
          {
            id: "clause-sc-14",
            number: "Para 14",
            title: "Legal Ineligibility to Nominate",
            text: "A person having an interest in the outcome or decision of the dispute must not have the power to appoint a sole arbitrator. What cannot be done directly by an interested party cannot be permitted to be done indirectly through unilateral nomination.",
            riskLevel: "CRITICAL",
            riskExplanation: "Supreme Court ratio: Extends TRF Ltd principle to disqualify interested parties from appointing even independent nominees."
          }
        ]
      },
      {
        pageNumber: 15,
        title: "OPERATIVE DECISION & RATIO DECIDENDI",
        content: `21. In our considered view, the appointment of a sole arbitrator by the Chief Managing Director of the Respondent cannot be sustained in law. Independence and impartiality of the arbitral tribunal are the hallmarks of modern arbitration.\n\n22. We accordingly allow the application and appoint Hon'ble Dr. Justice A.K. Sikri, former Judge of this Court, as the sole arbitrator to adjudicate all disputes between the parties.`,
        clauses: [
          {
            id: "clause-sc-21",
            number: "Para 21",
            title: "Final Decision & Appointment of Neutral Arbitrator",
            text: "Unilateral appointment by CMD set aside as void and contrary to statutory neutrality. Former Supreme Court Judge appointed as independent sole arbitrator.",
            riskLevel: "LOW",
            riskExplanation: "Final operative disposition and appointment order of the Supreme Court."
          }
        ]
      }
    ]
  },
  {
    id: "doc-employment-contract",
    filename: "Employment_Agreement.pdf",
    docType: "Executive Employment Contract",
    category: "contract",
    totalPages: 8,
    totalClauses: 42,
    jurisdiction: "India (Industrial Disputes & Contract Act)",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "APPOINTMENT & ROLE",
        content: `EXECUTIVE EMPLOYMENT AGREEMENT\n\nExecuted on 12th July 2024 between Apex Labs Private Limited ("Company") and Devendra Sharma ("Executive").`,
        clauses: [
          {
            id: "clause-emp-1",
            number: "1.1",
            title: "Position & Duties",
            text: "Executive is engaged as Vice President of Engineering, reporting to the Chief Technology Officer.",
            riskLevel: "LOW",
            riskExplanation: "Standard corporate executive title and reporting hierarchy."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "POST-EMPLOYMENT RESTRICTIONS",
        content: `3.0 RESTRICTIVE COVENANTS\n\n3.1 Executive acknowledges access to vital technological trade secrets and customer proprietary frameworks.`,
        clauses: [
          {
            id: "clause-emp-3",
            number: "3.2",
            title: "Non-Compete Restriction",
            text: "For a period of thirty-six (36) months post-separation, the Executive shall not directly or indirectly engage with, consult for, or establish any entity competing in software services within India or Southeast Asia.",
            riskLevel: "CRITICAL",
            riskExplanation: "Section 27 of the Indian Contract Act declares agreements in restraint of trade void. Post-employment non-competes are unenforceable in India."
          }
        ]
      },
      {
        pageNumber: 6,
        title: "INTELLECTUAL PROPERTY & TERMINATION",
        content: `7.0 INTELLECTUAL PROPERTY ASSIGNMENT\n\n7.1 Executive assigns all worldwide patent, copyright, and trade secret claims.`,
        clauses: [
          {
            id: "clause-emp-10",
            number: "10.4",
            title: "Summary Dismissal",
            text: "The Company may terminate employment with zero (0) days notice and without severance payment if Management determines in its subjective discretion that Executive failed to meet quarterly milestones.",
            riskLevel: "HIGH",
            riskExplanation: "Subjective summary termination without notice or cure period violates natural justice principles."
          }
        ]
      }
    ]
  },
  {
    id: "doc-nda-confidentiality",
    filename: "Mutual_NDA_Agreement.pdf",
    docType: "Non-Disclosure & Trade Secret Agreement",
    category: "contract",
    totalPages: 5,
    totalClauses: 28,
    jurisdiction: "India (Commercial Law)",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "PREAMBLE & DEFINITION",
        content: `MUTUAL NON-DISCLOSURE AGREEMENT\n\nEntered into between Veloce AI Private Limited and Strata Cloud Systems Private Limited on August 20, 2024.`,
        clauses: [
          {
            id: "clause-nda-1",
            number: "1.0",
            title: "Scope of Confidentiality",
            text: "Confidential Information encompasses all non-public technical, product roadmap, financial, and customer data disclosed in oral, written, or machine-readable format.",
            riskLevel: "LOW",
            riskExplanation: "Standard bilateral confidentiality definition."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "DURATION & EQUITABLE REMEDIES",
        content: `4.0 TERM OF OBLIGATION & SURVIVAL`,
        clauses: [
          {
            id: "clause-nda-4",
            number: "4.1",
            title: "Indefinite Duration",
            text: "The obligations of non-disclosure and non-use under this Agreement shall endure in perpetuity from the date of disclosure, surviving indefinitely without sunset or termination.",
            riskLevel: "MEDIUM",
            riskExplanation: "Perpetual duration on commercial data creates excessive compliance liability; 3-5 years is industry standard."
          },
          {
            id: "clause-nda-9",
            number: "9.2",
            title: "Automatic Injunction Waiver",
            text: "The Receiving Party agrees that money damages are inadequate and irrevocably consents to immediate preliminary injunction without requirement for the Disclosing Party to post bond or establish irreparable harm.",
            riskLevel: "HIGH",
            riskExplanation: "Waiving bond requirements and conceding injunction without evidentiary scrutiny limits Order XXXIX CPC defenses."
          }
        ]
      }
    ]
  },
  {
    id: "doc-legal-1",
    filename: "legal doc 1.pdf",
    docType: "Court Order (Execution Petition)",
    category: "judgment",
    totalPages: 2,
    totalClauses: 3,
    jurisdiction: "Court of Principal District Munsif, Ulundurpet",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "COURT HEADING & PARTIES (E.P. NO. 09 / 2026)",
        content: `IN THE COURT OF PRINCIPAL DISTRICT MUNSIF, AT ULUNDURPET\nPresent: Tmt. S. Madhumitha., B.A., LL.B[Hons]., Principal District Munsif,(FAC), Ulundurpet.\nTUESDAY THE 21st DAY OF JULY 2026\nE.P.NO. 09 / 2026 IN ACP.NO.162 / 2016\n[CNR.No.TNKAOF-000014-2026]\n\nM.S. Shriram Finance Ltd,\nFormerly Known as Sriram City Union Finance Ltd,\nMan.Sivakumar .....Decree Holder/Plaintiff\n\n-VS-\nDhanachezhiyan .....Judgment Debtor/Defendant\n\nThis Execution Petition coming up before me on 21.07.2026 for final hearing in the presence of Learned Advocate Mr.P.Senthilkumaran, counsel for the Petitioner/Decree Holder and Judgment Debtor/Defendant set exparte. This petition is pending for means evidence. Upon perusing the documents on record and having stood over for consideration till this day, this court delivers the following:`,
        clauses: [
          {
            id: "clause-ep-1",
            number: "Para 1",
            title: "Parties & Proceeding Status",
            text: "E.P. No. 09/2026 in ACP No. 162/2016 between M.S. Shriram Finance Ltd and Dhanachezhiyan. Judgment debtor set ex-parte; matter pending for means evidence.",
            riskLevel: "LOW",
            riskExplanation: "Procedural execution petition caption and hearing record."
          }
        ]
      },
      {
        pageNumber: 2,
        title: "ORDER & FINDINGS: DISMISSAL FOR DEFAULT",
        content: `ORDER\nThis Execution Petition is filed under Order XXI Rule 37 & 38 of the Code of Civil Procedure to Recover a sum of Rs. 46,502/- to arrest the Respondent/ Judgment Debtor.\n\nFINDINGS\nPetitioner not present. No representation on behalf of petitioner. Sufficient opportunities given. Hence this petition is dismissed for default.\n\nThis order Pronounced by me in the open court, typed by my steno typist, on this 21st day of July 2026.\ns/d. S.Madhumitha\nPrincipal District Munsif,(FAC)\nUlundurpet.\nDraft/Fair Order\nE.P.No.09/2026 in ACP.No.162/2016\nDate : 21-07-2026`,
        clauses: [
          {
            id: "clause-ep-2",
            number: "Para 2",
            title: "Relief Sought: Order XXI Rule 37 & 38 CPC",
            text: "Execution Petition filed under Order XXI Rule 37 & 38 CPC to recover a sum of Rs. 46,502/- and to arrest the Respondent / Judgment Debtor.",
            riskLevel: "MEDIUM",
            riskExplanation: "Civil arrest remedy and debt recovery petition."
          },
          {
            id: "clause-ep-3",
            number: "Para 3",
            title: "Operative Finding: Dismissal for Default",
            text: "Petitioner not present. No representation on behalf of petitioner. Sufficient opportunities given. Hence this petition is dismissed for default.",
            riskLevel: "HIGH",
            riskExplanation: "Procedural termination: Execution petition dismissed for default due to non-appearance."
          }
        ]
      }
    ]
  },
  {
    id: "doc-legal-2",
    filename: "legal doc 2.pdf",
    docType: "Court Cross-Examination Record (Tamil)",
    category: "judgment",
    totalPages: 5,
    totalClauses: 5,
    jurisdiction: "Principal District Munsif Court, Ulundurpet",
    language: "Tamil (தமிழ்)",
    pages: [
      {
        pageNumber: 1,
        title: "குறுக்கு விசாரணை: சாட்சி RW1 (Page 1)",
        content: `முதன்மை வட்ட உரிமையியல் நீதிமன்றம், உளுந்தூர்பேட்டை\nEA.5/2025 in EP.45/2007 in OS.127/2004\nஇன்று 2026 ஆம் ஆண்டு ஜூலை திங்கள் 15-ஆம் நாள் சாட்சியின் வாக்குமூலம்...\nPW/DW : RW1\nபெயர் : திரு. முத்துகுமாரசாமி, ஆண்/61, தந்தை: கிருஷ்ணமூர்த்தி, தொழில்: வழக்கறிஞர், சென்னை, உளுந்தூர்பேட்டை, கள்ளக்குறிச்சி.\n\nகுறுக்கு விசாரணை:\nமனுசொத்து கந்தசாமிபுரம் மேற்கில் உள்ளது. அதன் விஸ்தீரணம் 4050 சதுரஅடி. மேற்படி மனுசொத்தில் ஆர்.சி.சி. மொட்டை வீடு உள்ளது. அது எத்தனை அடுக்குகள் கொண்டது என்பது எனக்கு தெரியாது...`,
        clauses: [
          {
            id: "clause-dep-1",
            number: "பக்கம் 1",
            title: "சாட்சி அடையாளம் & சொத்து விவரம் (RW1 Deposition)",
            text: "சாட்சி RW1 திரு. முத்துகுமாரசாமி, வழக்கறிஞர் (வயது 61). கந்தசாமிபுரம் மேற்கில் உள்ள 4,050 சதுர அடி நிலம் மற்றும் ஆர்.சி.சி. மொட்டை மாடி வீடு பற்றிய வாக்குமூலம்.",
            riskLevel: "LOW",
            riskExplanation: "Witness identity and property description in cross-examination."
          }
        ]
      },
      {
        pageNumber: 2,
        title: "முந்தைய மனுக்கள் & ஏல மதிப்பு குறைப்பு (Page 2)",
        content: `இ.எ.எண்.587/2011 வாரிசு மனு... இ.எ.233/2013 திருத்தல் மனு அனுமதிக்கப்பட்டது. அதன் பிறகு நான் எ.ம.சா.ஆ-6ன் படியான இ.எ.405/2014 படியான ஏலச்சொத்தின் மதிப்பை குறைக்க வேண்டி மனு தாக்கல் செய்திருந்தேன். 2010ம் ஆண்டு வரை ஏலச்சொத்தின் மதிப்பு ரூ.40 லட்சம் என குறிப்பிடப்பட்டுள்ள நிலையில் 2014ல் அதன் மதிப்பு கூடுதலாக தான் இருக்கும் என்ற அடிப்படையில் இ.எ.405/2014 மற்றும் இ.எ.276/2016 தள்ளுபடி செய்யப்பட்டது...`,
        clauses: [
          {
            id: "clause-dep-2",
            number: "பக்கம் 2",
            title: "மதிப்பு குறைப்பு மனுக்கள் தள்ளுபடி (Prior EA Dismissals)",
            text: "ரூ. 40 லட்சம் என நிர்ணயிக்கப்பட்ட ஏல மதிப்பை குறைக்க கோரி தாக்கல் செய்யப்பட்ட இ.எ.405/2014 மற்றும் இ.எ.276/2016 மனுக்கள் தள்ளுபடி செய்யப்பட்டன.",
            riskLevel: "MEDIUM",
            riskExplanation: "Prior applications to reduce property auction valuation were dismissed."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "அழைப்பாணை சார்வு & விளம்பரம் (Page 3)",
        content: `எதிர்மனுதாரர் கவிதா என்பவர் No residence, left என்று அழைப்பாணை திருப்பப்பட்டது. நாளிதழில் விளம்பரம் செய்ய நான் மனு தாக்கல் செய்து அவருக்கு எதிராக தினசரி நாளிதழில் விளம்பரம் செய்ய உத்தரவு பெறப்பட்டது...`,
        clauses: [
          {
            id: "clause-dep-3",
            number: "பக்கம் 3",
            title: "அழைப்பாணை சார்வு & நாளிதழ் விளம்பரம் (Service of Summons)",
            text: "கவிதா என்ற எதிர்மனுதாரருக்கு அழைப்பாணை திரும்பியதால் நீதிமன்ற உத்தரவுப்படி தினசரி நாளிதழில் விளம்பரம் செய்யப்பட்டது.",
            riskLevel: "LOW",
            riskExplanation: "Substituted service via newspaper publication."
          }
        ]
      },
      {
        pageNumber: 4,
        title: "பொறியாளர் சான்று & நீதிமன்ற ஏல மதிப்பு (Page 4)",
        content: `எ.ம.சா.ஆ-10 பொதுப்பணித்துறை வழியான பழனிவேல் (ஓய்வு) என்பவரால் வழங்கப்பட்டது... நீதிமன்ற மதிப்பு என்னவென்றால் ரூ.57,76,000/-. அந்த ஏலத்தில் ஐந்து நபர்கள் கலந்து கொண்டதாக எனது வழக்கறிஞர் மூலம் கேள்விப்பட்டேன்...`,
        clauses: [
          {
            id: "clause-dep-4",
            number: "பக்கம் 4",
            title: "பொறியாளர் சான்றிதழ் & நீதிமன்ற மதிப்பு (Ex.P10 Valuation)",
            text: "ஓய்வு பெற்ற பொதுப்பணித்துறை பொறியாளர் பழனிவேல் வழங்கிய எ.ம.சா.ஆ-10 மதிப்பீட்டு சான்று; நீதிமன்ற ஏல மதிப்பு ரூ. 57,76,000/-.",
            riskLevel: "MEDIUM",
            riskExplanation: "Valuation certificate by retired PWD engineer and court valuation of Rs. 57.76 lakhs."
          }
        ]
      },
      {
        pageNumber: 5,
        title: "ஒத்திவைப்பு உத்தரவு (Page 5)",
        content: `குறுக்குவிசாரணை தொடர்ச்சிக்கு ஒத்திவைக்கப்படுகிறது.\nமேற்படி சாட்சியத்தை சாட்சி சொல்ல-சொல்ல என்னால் திறந்த நீதிமன்றத்தில் நேரடியாக தட்டச்சருக்கு சொல்லப்பட்டு... சரி என ஒப்புக் கொண்டு கையொப்பம் செய்தார்.\n(Sd. S.Madhumitha)\nமுதன்மை வட்ட உரிமையியல் நீதிபதி(மு.கூ.பொ.), உளுந்தூர்பேட்டை.`,
        clauses: [
          {
            id: "clause-dep-5",
            number: "பக்கம் 5",
            title: "ஒத்திவைப்பு (Adjourned for Continuation - Not a Final Order)",
            text: "குறுக்குவிசாரணை தொடர்ச்சிக்கு ஒத்திவைக்கப்படுகிறது. இறுதி தீர்ப்பு அல்லது இறுதி உத்தரவு எதுவும் பிறப்பிக்கப்படவில்லை.",
            riskLevel: "LOW",
            riskExplanation: "Cross-examination adjourned for continuation; no final judicial decision."
          }
        ]
      }
    ]
  },
  {
    id: "doc-legal-3",
    filename: "legal doc 3.pdf",
    docType: "Court Order (Removal of Attachment)",
    category: "judgment",
    totalPages: 8,
    totalClauses: 5,
    jurisdiction: "Court of Principal District Munsif, Ulundurpet",
    language: "English",
    pages: [
      {
        pageNumber: 1,
        title: "COURT HEADING & PARTIES (I.A. NO. 3 / 2024)",
        content: `IN THE COURT OF PRINCIPAL DISTRICT MUNSIF, AT ULUNDURPET\nPresent: Tmt. A.ELAKIYA B.C.A.,LL.B[Hons].,LL.M., Principal District Munsif, Ulundurpet.\nWEDNESDAY THE 25TH DAY OF MARCH 2026\nI.A.NO. 3 / 2024 IN I.A.NO. 419 / 2012 IN O.S.NO. 116 / 2012\n\n1. Booma Devi, 2. Arun Kumar, 3. Anitha, 4. Minor Arjunan (Rep. by mother 1st Petitioner) .....Petitioners\n-VS-\n1. Ramalingam .....Respondent/Petitioner/Plaintiff\n2. Krishnanveni .....Respondent/Respondent/Defendant`,
        clauses: [
          {
            id: "clause-ia3-1",
            number: "Page 1",
            title: "Application Details & Parties",
            text: "I.A. No. 3/2024 in I.A. 419/2012 in O.S. 116/2012 filed by Booma Devi and other legal heirs of Kannan against Ramalingam and Krishnanveni.",
            riskLevel: "LOW",
            riskExplanation: "Procedural court heading and party details."
          }
        ]
      },
      {
        pageNumber: 2,
        title: "AVERMENTS & PRIOR SALE IN 2009",
        content: `Application under Order XXXVIII Rule 8 CPC to remove attachment placed before judgment.\nPetitioners stated that properties originally belonged to Krishnanveni who sold them to Kannan on 26.03.2009 via Document No. 737/2009. Kannan died intestate leaving petitioners as only legal heirs. Attachment was subsequently made in 2012 (Doc No. 8/2012) after Krishnanveni had already alienated the property.`,
        clauses: [
          {
            id: "clause-ia3-2",
            number: "Page 2",
            title: "Sale Preceding Attachment (Ex.P1)",
            text: "Properties sold by Krishnanveni to Kannan in 2009 via registered Document No. 737/2009, prior to the 2012 attachment before judgment.",
            riskLevel: "LOW",
            riskExplanation: "Key factual averment demonstrating alienation prior to attachment."
          }
        ]
      },
      {
        pageNumber: 4,
        title: "STATUS OF ITEMS 1 TO 5 (ALREADY REMOVED)",
        content: `Court considered Ex.P9 and found that Items 1 to 5 had already been removed from attachment on 21 September 2024 through registered Document No. 36/2024. Items 6 and 7 remained under attachment.`,
        clauses: [
          {
            id: "clause-ia3-3",
            number: "Page 4",
            title: "Items 1–5 Attachment Previously Raised",
            text: "Items 1 to 5 already removed from attachment on 21.09.2024 via Doc No. 36/2024; only Items 6 and 7 remained subject to attachment.",
            riskLevel: "LOW",
            riskExplanation: "Property schedule segregation."
          }
        ]
      },
      {
        pageNumber: 5,
        title: "OPERATIVE ORDER: ATTACHMENT REMOVED OVER ITEMS 6 & 7",
        content: `In the result, this application is allowed. The attachment over the petition-mentioned properties, specifically Items 6 and 7, made through registered Document No. 8/2012 on 23 July 2012 pursuant to order in I.A. 419/2012 in O.S. 116/2012 is ordered to be raised/removed. The Registry is directed to communicate the removal to the concerned Sub-Registrar office for necessary encumbrance entries. No cost.`,
        clauses: [
          {
            id: "clause-ia3-4",
            number: "Page 5",
            title: "Operative Order: Attachment Raised / Removed",
            text: "Application ALLOWED. Attachment over Items 6 & 7 ordered removed. Registry directed to communicate to Sub-Registrar office. No cost.",
            riskLevel: "LOW",
            riskExplanation: "Final judicial disposition granting removal of attachment."
          }
        ]
      },
      {
        pageNumber: 6,
        title: "EXHIBITS LIST: Ex.P1 TO Ex.P9",
        content: `Petitioners' Exhibits: Ex.P1 (26.03.2009 Sale deed Doc 737/2009), Ex.P2 (Patta Items 1-5 No. 4219), Ex.P3 (Patta Item 6 No. 2154), Ex.P4 (Patta Item 7 No. 4219), Ex.P5 (Attachment Doc 8/2012), Ex.P6 (EC 2007-2024), Ex.P7 (Death Cert of Kannan), Ex.P8 (Legal Heir Cert of Kannan), Ex.P9 (EC 2007-2025). Respondents' exhibits: Nil.`,
        clauses: [
          {
            id: "clause-ia3-5",
            number: "Page 6",
            title: "Documentary Exhibits List",
            text: "Exhibits Ex.P1 to Ex.P9 marked by petitioners proving title, possession, legal heirship, and encumbrance history.",
            riskLevel: "LOW",
            riskExplanation: "Marked documentary evidence record."
          }
        ]
      }
    ]
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: "conv-lease",
    title: "Commercial Lease Agreement",
    timeCategory: "today",
    updatedAt: "10 mins ago",
    document: SAMPLE_DOCUMENTS[0],
    isSplitViewOpen: true,
    activeHighlightId: "clause-11",
    messages: [
      {
        id: "msg-doc-1",
        sender: "system",
        type: "attachment",
        filename: "Commercial_Lease_Agreement.pdf",
        pages: 12,
        clauses: 87,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-welcome-1",
        sender: "ai",
        type: "welcome_actions",
        docType: "Commercial Real Estate Lease",
        filename: "Commercial_Lease_Agreement.pdf",
        totalPages: 12,
        totalClauses: 87,
        jurisdiction: "India (Transfer of Property Act, 1882)",
        language: "English",
        text: "I've analyzed your Commercial Lease Agreement. What would you like to know?",
        timestamp: "10:40 AM",
        recommendedActions: [
          { key: "summarize", label: "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract key information including financials, lock-in duration, and covenants." },
          { key: "detectRisks", label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks, liabilities, and one-sided clauses in this document." }
        ],
        otherActions: [
          { key: "understand", label: "Understand", service: "understand", prompt: "Explain this legal document in plain and clear terms." },
          { key: "simplify", label: "Simplify / Plain Tamil", service: "simplify", prompt: "Explain this document in plain and simple Tamil." },
          { key: "askDoc", label: "Ask Document", service: "askDoc", prompt: "What are the primary remedies and termination rights under this agreement?" },
          { key: "compare", label: "Compare Market", service: "compare", prompt: "Compare standard market terms against the provisions drafted in this agreement." }
        ]
      },
      {
        id: "msg-2",
        sender: "user",
        text: "Detect risks in this document.",
        timestamp: "10:42 AM"
      },
      {
        id: "msg-3",
        sender: "ai",
        type: "risk_result",
        text: "I found 4 areas that require legal attention, including severe lock-in damages and unilateral arbitration.",
        timestamp: "10:42 AM",
        serviceId: "detectRisks",
        riskFindings: [
          {
            id: "01",
            clauseNumber: "11.0",
            clauseId: "clause-11",
            page: 8,
            title: "Termination Notice Clause",
            riskLevel: "HIGH",
            summary: "Either party may terminate with seven (7) days written notice. This provision allows termination with an unusually short notice period, causing acute operational disruption."
          },
          {
            id: "02",
            clauseNumber: "14.0",
            clauseId: "clause-14",
            page: 9,
            title: "Lock-in Penalty",
            riskLevel: "CRITICAL",
            summary: "Demands full unexpired rent for 24 months as liquidated damages. Indian contract jurisprudence requires proof of actual injury and duty to mitigate."
          },
          {
            id: "03",
            clauseNumber: "18.0",
            clauseId: "clause-18",
            page: 12,
            title: "Sole Arbitrator Appointment",
            riskLevel: "HIGH",
            summary: "Lessor reserves exclusive right to unilaterally appoint the sole arbitrator. Unilateral appointments are invalid under Perkins Eastman principles."
          },
          {
            id: "04",
            clauseNumber: "5.0",
            clauseId: "clause-5",
            page: 3,
            title: "Security Deposit Forfeiture",
            riskLevel: "MEDIUM",
            summary: "Lessor reserves the sole right to forfeit INR 21,00,000 for alleged defaults without prior judicial or arbitral determination."
          }
        ],
        citations: [
          { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
          { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" },
          { label: "Page 12 · Clause 18.0", page: 12, clauseId: "clause-18" },
          { label: "Page 3 · Clause 5.0", page: 3, clauseId: "clause-5" }
        ],
        nextActions: [
          { label: "Explain High Risk Clause", service: "simplify", prompt: "Explain Clause 11.0 and Clause 14.0 in simple terms." },
          { label: "Extract Key Information", service: "keyInfo", prompt: "Extract key financial terms, lock-in duration, and deposit details." },
          { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ஆவணத்தின் அபாயங்களை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
          { label: "Compare with Market", service: "compare", prompt: "Compare these termination and lock-in terms with standard commercial practice." }
        ]
      }
    ]
  },
  {
    id: "conv-sc-judgment",
    title: "Supreme Court Judgment",
    timeCategory: "today",
    updatedAt: "1 hour ago",
    document: SAMPLE_DOCUMENTS[1],
    isSplitViewOpen: true,
    activeHighlightId: "clause-sc-14",
    messages: [
      {
        id: "msg-sc-doc",
        sender: "system",
        type: "attachment",
        filename: "Perkins_Eastman_Architects_vs_HSCC_SC_Judgment.pdf",
        pages: 18,
        clauses: 34,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-sc-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Supreme Court Judgment",
        filename: "Perkins_Eastman_Architects_vs_HSCC_SC_Judgment.pdf",
        totalPages: 18,
        totalClauses: 34,
        jurisdiction: "Supreme Court of India",
        language: "English",
        text: "I've analyzed your Supreme Court Judgment (Perkins Eastman v. HSCC). What would you like to know?",
        timestamp: "09:15 AM",
        recommendedActions: [
          { key: "judgment_summarize", label: "Summarize Judgment", service: "judgment", prompt: "Summarize this Supreme Court judgment and key rulings." },
          { key: "judgment_decision", label: "What did the Court decide?", service: "judgment", prompt: "What did the Court decide and what is the final operative order?" },
          { key: "judgment_issues", label: "Key Legal Issues", service: "judgment", prompt: "What are the core legal issues and statutory questions framed by the Court?" }
        ],
        otherActions: [
          { key: "judgment_reasoning", label: "Court's Reasoning", service: "judgment", prompt: "Explain the Court's ratio decidendi and legal reasoning." },
          { key: "simplify", label: "Simplify Judgment", service: "simplify", prompt: "Explain this judgment in plain everyday terms." },
          { key: "askDoc", label: "Ask the Judgment", service: "askDoc", prompt: "How does this precedent apply to unilateral appointments in contracts?" },
          { key: "voice", label: "🎙 Explain by Voice", action: "voice" }
        ]
      }
    ]
  },
  {
    id: "conv-employment",
    title: "Executive Employment Agreement",
    timeCategory: "yesterday",
    updatedAt: "Yesterday",
    document: SAMPLE_DOCUMENTS[2],
    isSplitViewOpen: true,
    activeHighlightId: "clause-emp-3",
    messages: [
      {
        id: "msg-emp-doc",
        sender: "system",
        type: "attachment",
        filename: "Employment_Agreement.pdf",
        pages: 8,
        clauses: 42,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-emp-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Executive Employment Contract",
        filename: "Employment_Agreement.pdf",
        totalPages: 8,
        totalClauses: 42,
        jurisdiction: "India (Industrial Disputes & Contract Act)",
        language: "English",
        text: "I've analyzed your Executive Employment Agreement. What would you like to know?",
        timestamp: "Yesterday, 4:10 PM",
        recommendedActions: [
          { key: "summarize", label: "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract key information including compensation, notice period, and covenants." },
          { key: "detectRisks", label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks, non-compete liabilities, and termination clauses." }
        ],
        otherActions: [
          { key: "simplify", label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த வேலை ஒப்பந்தத்தின் முக்கிய விதிகளை எளிய தமிழில் விளக்குங்கள்." },
          { key: "askDoc", label: "Ask Document", service: "askDoc", prompt: "Is the 36-month non-compete clause enforceable under Section 27 of Indian Contract Act?" },
          { key: "compare", label: "Compare Market", service: "compare", prompt: "Compare these executive terms against Indian corporate standards." }
        ]
      }
    ]
  },
  {
    id: "conv-nda",
    title: "Mutual NDA Agreement",
    timeCategory: "previous7Days",
    updatedAt: "3 days ago",
    document: SAMPLE_DOCUMENTS[3],
    isSplitViewOpen: true,
    activeHighlightId: "clause-nda-4",
    messages: [
      {
        id: "msg-nda-doc",
        sender: "system",
        type: "attachment",
        filename: "Mutual_NDA_Agreement.pdf",
        pages: 5,
        clauses: 28,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-nda-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Non-Disclosure & Trade Secret Agreement",
        filename: "Mutual_NDA_Agreement.pdf",
        totalPages: 5,
        totalClauses: 28,
        jurisdiction: "India (Commercial Law)",
        language: "English",
        text: "I've analyzed your Mutual NDA Agreement. What would you like to know?",
        timestamp: "3 days ago",
        recommendedActions: [
          { key: "summarize", label: "Summarize", service: "summarize", prompt: "Summarize this NDA's confidentiality scope and term." },
          { key: "detectRisks", label: "Detect Risks", service: "detectRisks", prompt: "Are there perpetual confidentiality terms or automatic injunction waivers?" },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract definition of confidential information and exclusions." }
        ],
        otherActions: [
          { key: "simplify", label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ரகசிய ஒப்பந்தத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
          { key: "compare", label: "Compare Market", service: "compare", prompt: "Compare perpetual confidentiality against 3-year market standard." }
        ]
      }
    ]
  },
  {
    id: "conv-legal-1",
    title: "E.P. 09/2026 (legal doc 1.pdf)",
    timeCategory: "today",
    updatedAt: "Just now",
    document: SAMPLE_DOCUMENTS[4],
    isSplitViewOpen: true,
    activeHighlightId: "clause-ep-3",
    messages: [
      {
        id: "msg-ep-doc",
        sender: "system",
        type: "attachment",
        filename: "legal doc 1.pdf",
        pages: 2,
        clauses: 3,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-ep-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Court Order (Execution Petition)",
        filename: "legal doc 1.pdf",
        totalPages: 2,
        totalClauses: 3,
        category: "judgment",
        jurisdiction: "Court of Principal District Munsif, Ulundurpet",
        language: "English",
        text: "I've analyzed your Court Order in E.P. No. 09/2026 (M.S. Shriram Finance Ltd v. Dhanachezhiyan). What would you like to know?",
        timestamp: "Just now",
        recommendedActions: [
          { key: "detectRisks", label: "Detect Legal Risks (Service 4)", service: "detectRisks", prompt: "Detect procedural risks and execution status in this petition." },
          { key: "summarize", label: "Order Summary", service: "summarize", prompt: "Summarize this execution petition and court order." },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract CNR number, court, parties, and recovery amount." }
        ],
        otherActions: [
          { key: "simplify", label: "Simplify / எளிய தமிழில்", service: "simplify", prompt: "Explain this court order in simple terms." },
          { key: "askDoc", label: "Ask Document", service: "askDoc", prompt: "Why was this execution petition dismissed for default?" }
        ]
      }
    ]
  },
  {
    id: "conv-legal-2",
    title: "Cross-Examination Record (legal doc 2.pdf)",
    timeCategory: "today",
    updatedAt: "Just now",
    document: SAMPLE_DOCUMENTS[5],
    isSplitViewOpen: true,
    activeHighlightId: "clause-dep-5",
    messages: [
      {
        id: "msg-dep-doc",
        sender: "system",
        type: "attachment",
        filename: "legal doc 2.pdf",
        pages: 5,
        clauses: 5,
        format: "PDF",
        language: "Tamil (தமிழ்)",
        status: "ready"
      },
      {
        id: "msg-dep-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Court Cross-Examination Record (Tamil)",
        filename: "legal doc 2.pdf",
        totalPages: 5,
        totalClauses: 5,
        category: "judgment",
        jurisdiction: "Principal District Munsif Court, Ulundurpet",
        language: "Tamil (தமிழ்)",
        text: "நான் உங்கள் நீதிமன்ற வாக்குமூல ஆவணத்தை (EA.5/2025 in EP.45/2007) ஆய்வு செய்துள்ளேன். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
        timestamp: "Just now",
        recommendedActions: [
          { key: "judgment_summarize", label: "Deposition Analysis (Service 7)", service: "judgment", prompt: "Analyze this cross-examination deposition and procedural stage." },
          { key: "detectRisks", label: "Assess Procedural Status", service: "detectRisks", prompt: "Assess whether this document contains a final judgment or is adjourned." },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract witness details, property size, and court valuation." }
        ],
        otherActions: [
          { key: "simplify", label: "எளிய தமிழில் விளக்கம்", service: "simplify", prompt: "இந்த குறுக்கு விசாரணை வாக்குமூலத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
          { key: "askDoc", label: "Ask Document", service: "askDoc", prompt: "What is the valuation given in Ex.P10 and was a final order passed?" }
        ]
      }
    ]
  },
  {
    id: "conv-legal-3",
    title: "Removal of Attachment (legal doc 3.pdf)",
    timeCategory: "today",
    updatedAt: "Just now",
    document: SAMPLE_DOCUMENTS[6],
    isSplitViewOpen: true,
    activeHighlightId: "clause-ia3-4",
    messages: [
      {
        id: "msg-ia3-doc",
        sender: "system",
        type: "attachment",
        filename: "legal doc 3.pdf",
        pages: 8,
        clauses: 5,
        format: "PDF",
        language: "English",
        status: "ready"
      },
      {
        id: "msg-ia3-welcome",
        sender: "ai",
        type: "welcome_actions",
        docType: "Court Order (Removal of Attachment)",
        filename: "legal doc 3.pdf",
        totalPages: 8,
        totalClauses: 5,
        category: "judgment",
        jurisdiction: "Court of Principal District Munsif, Ulundurpet",
        language: "English",
        text: "I've analyzed the Court Order in I.A. No. 3/2024 (Booma Devi v. Ramalingam & Krishnanveni). What would you like to know?",
        timestamp: "Just now",
        recommendedActions: [
          { key: "summarize", label: "Order Summary (Service 2)", service: "summarize", prompt: "Summarize this court order on removal of attachment." },
          { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract application details, parties, and marked exhibits." },
          { key: "detectRisks", label: "Risk & Discrepancy Check", service: "detectRisks", prompt: "Identify any date discrepancies or title risks in this order." }
        ],
        otherActions: [
          { key: "simplify", label: "எளிய தமிழில் விளக்கம்", service: "simplify", prompt: "இந்த தீர்ப்பு ஆணையை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
          { key: "askDoc", label: "Ask Document", service: "askDoc", prompt: "Which properties had their attachment lifted by the court?" }
        ]
      }
    ]
  }
];

export function DocumentProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("legal_ai_conversations_v6");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load stored conversations", e);
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id || "conv-lease");
  const [language, setLanguage] = useState(() => localStorage.getItem("legal_ai_lang") || "en");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [isSimplifiedView, setIsSimplifiedView] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;
  const activeDocument = activeConversation?.document || SAMPLE_DOCUMENTS[0];

  const setActiveDocument = (doc) => {
    if (!doc) return;
    const existing = conversations.find(
      (c) => c.document?.id === doc.id || c.document?.filename === doc.filename
    );
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      uploadDocument(doc);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("legal_ai_conversations_v6", JSON.stringify(conversations));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("legal_ai_lang", language);
  }, [language]);

  const handleToggleSpeech = (messageId, textToRead) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (language === "te") {
      const teVoice = voices.find((v) => v.lang.includes("te") || v.name.includes("Telugu"));
      if (teVoice) utterance.voice = teVoice;
    } else if (language === "ta") {
      const taVoice = voices.find((v) => v.lang.includes("ta") || v.name.includes("Tamil"));
      if (taVoice) utterance.voice = taVoice;
    } else if (language === "ml") {
      const mlVoice = voices.find((v) => v.lang.includes("ml") || v.name.includes("Malayalam"));
      if (mlVoice) utterance.voice = mlVoice;
    } else {
      const enVoice = voices.find((v) => (v.lang.includes("en-US") || v.lang.includes("en-GB")) && v.name.includes("Natural"));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const selectConversation = (id) => {
    if (speakingMessageId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }
    setActiveConversationId(id);
    setIsMobileSidebarOpen(false);
  };

  const createNewChat = () => {
    if (speakingMessageId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }

    const newId = `conv-${Date.now()}`;
    const newChatObj = {
      id: newId,
      title: language === "te" ? "కొత్త సంభాషణ" : language === "ta" ? "புதிய உரையாடல்" : language === "ml" ? "പുതിയ സംഭാഷണം" : "New Conversation",
      timeCategory: "today",
      updatedAt: "Just now",
      document: null,
      messages: [],
      isSplitViewOpen: false,
      activeHighlightId: null
    };

    setConversations([newChatObj, ...conversations]);
    setActiveConversationId(newId);
    setIsMobileSidebarOpen(false);
  };

  const uploadDocument = (fileOrSample = null) => {
    let docObj = SAMPLE_DOCUMENTS[0]; // default commercial lease
    let matchedSample = null;

    if (fileOrSample && typeof fileOrSample === "object" && fileOrSample.pages) {
      docObj = fileOrSample;
    } else if (typeof fileOrSample === "string") {
      matchedSample = SAMPLE_DOCUMENTS.find((d) => d.id === fileOrSample);
      if (matchedSample) docObj = matchedSample;
    } else if (fileOrSample && fileOrSample.name) {
      const fileNameLower = fileOrSample.name.toLowerCase();
      if (
        fileNameLower.includes("legal doc 1") ||
        fileNameLower.includes("ep.no. 09") ||
        fileNameLower.includes("ep.no.09") ||
        fileNameLower.includes("ep 09") ||
        fileNameLower.includes("shriram") ||
        fileNameLower.includes("dhanachezhiyan")
      ) {
        matchedSample = SAMPLE_DOCUMENTS.find((d) => d.id === "doc-legal-1");
      } else if (
        fileNameLower.includes("legal doc 2") ||
        fileNameLower.includes("muthukumarasamy") ||
        fileNameLower.includes("ea.5") ||
        fileNameLower.includes("ea 5") ||
        fileNameLower.includes("கந்தசாமிபுரம்")
      ) {
        matchedSample = SAMPLE_DOCUMENTS.find((d) => d.id === "doc-legal-2");
      } else if (
        fileNameLower.includes("legal doc 3") ||
        fileNameLower.includes("booma devi") ||
        fileNameLower.includes("ia.no. 3") ||
        fileNameLower.includes("ia 3") ||
        fileNameLower.includes("ramalingam") ||
        fileNameLower.includes("krishnanveni")
      ) {
        matchedSample = SAMPLE_DOCUMENTS.find((d) => d.id === "doc-legal-3");
      } else if (fileNameLower.includes("perkins") || fileNameLower.includes("hscc")) {
        matchedSample = SAMPLE_DOCUMENTS.find((d) => d.id === "doc-supreme-court-judgment");
      } else if (fileNameLower.includes("employment")) {
        matchedSample = SAMPLE_DOCUMENTS.find((d) => d.id === "doc-employment-contract");
      } else if (fileNameLower.includes("nda")) {
        matchedSample = SAMPLE_DOCUMENTS.find((d) => d.id === "doc-nda-confidentiality");
      }

      if (matchedSample) {
        docObj = {
          ...matchedSample,
          filename: fileOrSample.name
        };
      } else {
        const isJudgment =
          fileNameLower.includes("judgment") ||
          fileNameLower.includes("order") ||
          fileNameLower.includes("court") ||
          fileNameLower.includes("petition");
        docObj = {
          id: `custom-doc-${Date.now()}`,
          filename: fileOrSample.name,
          docType: isJudgment ? "Court Judgment / Order" : "Legal Contract / Agreement",
          category: isJudgment ? "judgment" : "contract",
          totalPages: 4,
          totalClauses: 12,
          jurisdiction: isJudgment ? "Principal District Munsif Court / High Court" : "Republic of India",
          language: "English",
          pages: isJudgment ? SAMPLE_DOCUMENTS[4].pages : SAMPLE_DOCUMENTS[0].pages
        };
      }
    }

    if (
      fileOrSample &&
      typeof fileOrSample === "object" &&
      (fileOrSample instanceof File || fileOrSample instanceof Blob || fileOrSample.size)
    ) {
      const formData = new FormData();
      formData.append("file", fileOrSample);
      api.post("/documents/upload", formData)
        .then((res) => {
          if (res && res.id) {
            docObj.backendDocId = res.id;
          }
        })
        .catch((err) => {
          console.warn("Backend document upload sync notice (using client benchmark data):", err?.message);
        });
    }

    const isJudgment = docObj.category === "judgment" || docObj.filename.toLowerCase().includes("judgment");

    const attachmentMsg = {
      id: `msg-doc-${Date.now()}`,
      sender: "system",
      type: "attachment",
      filename: docObj.filename,
      pages: docObj.totalPages,
      clauses: docObj.totalClauses,
      format: docObj.filename.endsWith(".docx") ? "DOCX" : docObj.filename.endsWith(".txt") ? "TXT" : "PDF",
      language: docObj.language || "English",
      status: "received" // received -> reading -> identifying -> understanding -> ready
    };

    const targetConvId = activeConversationId;

    // 1. Initial State: Received
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          const updatedTitle = docObj.filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
          return {
            ...c,
            title: updatedTitle,
            document: docObj,
            messages: [...c.messages, attachmentMsg]
          };
        }
        return c;
      })
    );

    // 2. Reading document (500ms)
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: c.messages.map((m) => (m.id === attachmentMsg.id ? { ...m, status: "reading" } : m))
            };
          }
          return c;
        })
      );

      // 3. Identifying structure (1000ms)
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map((m) => (m.id === attachmentMsg.id ? { ...m, status: "identifying" } : m))
              };
            }
            return c;
          })
        );

        // 4. Understanding clauses (1600ms)
        setTimeout(() => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === targetConvId) {
                return {
                  ...c,
                  messages: c.messages.map((m) => (m.id === attachmentMsg.id ? { ...m, status: "understanding" } : m))
                };
              }
              return c;
            })
          );

          // 5. Ready & Emit AI Classification Welcome Message (2200ms)
          setTimeout(() => {
            const welcomeAiMsg = {
              id: `msg-welcome-${Date.now()}`,
              sender: "ai",
              type: "welcome_actions",
              docType: docObj.docType,
              filename: docObj.filename,
              totalPages: docObj.totalPages,
              totalClauses: docObj.totalClauses,
              category: docObj.category,
              jurisdiction: docObj.jurisdiction,
              language: docObj.language,
              text: language === "te"
                ? `మీ ${docObj.docType} పత్రాన్ని నేను సమీక్షించాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?`
                : language === "ta"
                ? `உங்கள் ${docObj.docType}-ஐ நான் ஆய்வு செய்துள்ளேன். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?`
                : language === "ml"
                ? `ഞാൻ നിങ്ങളുടെ ${docObj.docType} വിശകലനം ചെയ്തു. എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?`
                : `I've analyzed your ${docObj.docType}. What would you like to know?`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              recommendedActions: isJudgment
                ? [
                    { key: "judgment_summarize", label: language === "te" ? "తీర్పు సారాంశం" : language === "ta" ? "தீர்ப்பின் சுருக்கம்" : language === "ml" ? "വിധിയുടെ സംഗ്രഹം" : "Summarize Judgment", service: "judgment", prompt: "Summarize this Supreme Court judgment and key rulings." },
                    { key: "judgment_decision", label: language === "te" ? "కోర్టు నిర్ణయం ఏమిటి?" : language === "ta" ? "நீதிமன்ற முடிவு என்ன?" : language === "ml" ? "കോടതി തീരുമാനം" : "What did the Court decide?", service: "judgment", prompt: "What did the Court decide and what is the final operative order?" },
                    { key: "judgment_issues", label: language === "te" ? "ప్రధాన చట్టపరమైన సమస్యలు" : language === "ta" ? "முக்கிய சட்டப் பிரச்சினைகள்" : language === "ml" ? "പ്രധാന നിയമ പ്രശ്നങ്ങൾ" : "Key Legal Issues", service: "judgment", prompt: "What are the core legal issues and statutory questions framed by the Court?" }
                  ]
                : [
                    { key: "summarize", label: language === "te" ? "పత్రం సారాంశం" : language === "ta" ? "ஆவணச் சுருக்கம்" : language === "ml" ? "രേഖാ സംഗ്രഹം" : "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
                    { key: "keyInfo", label: language === "te" ? "ముఖ్య సమాచారం" : language === "ta" ? "முக்கிய தகவல்கள்" : language === "ml" ? "പ്രധാന വിവരങ്ങൾ" : "Key Information", service: "keyInfo", prompt: "Extract key information including financials, lock-in duration, and covenants." },
                    { key: "detectRisks", label: language === "te" ? "రిస్క్‌లను గుర్తించండి" : language === "ta" ? "அபாயங்களைக் கண்டறி" : language === "ml" ? "അപകടസാധ്യതകൾ" : "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks, liabilities, and one-sided clauses in this document." }
                  ],
              otherActions: isJudgment
                ? [
                    { key: "judgment_reasoning", label: language === "te" ? "కోర్టు న్యాయవాదం" : language === "ta" ? "நீதிமன்ற நியாயவாதம்" : language === "ml" ? "കോടതിയുടെ ന്യായவாദം" : "Court's Reasoning", service: "judgment", prompt: "Explain the Court's ratio decidendi and legal reasoning." },
                    { key: "simplify", label: language === "te" ? "తీర్పును సరళీకరించండి" : language === "ta" ? "எளிய தமிழில் விளக்கு" : language === "ml" ? "വിധി ലളിതമാക്കുക" : "Simplify Judgment", service: "simplify", prompt: "Explain this judgment in plain everyday terms." },
                    { key: "askDoc", label: language === "te" ? "తీర్పును అడగండి" : language === "ta" ? "தீர்ப்பிடம் கேள்" : language === "ml" ? "വിധിയോട് ചോදിക്കുക" : "Ask the Judgment", service: "askDoc", prompt: "How does this precedent apply to unilateral appointments in contracts?" },
                    { key: "voice", label: language === "te" ? "🎙 వాయిస్‌తో వివరించండి" : language === "ta" ? "🎙 குரல் மூலம் கேள்" : language === "ml" ? "🎙 ശബ്ദത്തിൽ വിശദീകരിക്കുക" : "🎙 Explain by Voice", action: "voice" }
                  ]
                : [
                    { key: "understand", label: language === "te" ? "వివరణ అర్థం చేసుకోండి" : language === "ta" ? "விளக்கம்" : language === "ml" ? "രേഖാ വിവരണം" : "Understand", service: "understand", prompt: "Explain this legal document in plain and clear terms." },
                    { key: "simplify", label: language === "te" ? "సరళమైన తెలుగులో" : language === "ta" ? "எளிய தமிழில்" : language === "ml" ? "ലളിതമായ മലയാളത്തിൽ" : "Simplify in Plain Language", service: "simplify", prompt: language === "te" ? "ఈ పత్రాన్ని నాకు సులభంగా అర్థమయ్యే సరళమైన తెలుగులో వివరించండి." : language === "ml" ? "ഈ രേഖ ലളിതമായ മലയാളത്തിൽ എനിക്ക് മനസ്സിലാകുന്ന രീതിയിൽ വിശദീകരിക്കുക." : "இந்த ஆவணத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
                    { key: "askDoc", label: language === "te" ? "పత్రాన్ని అడగండి" : language === "ta" ? "ஆவணத்திடம் கேள்" : language === "ml" ? "രേഖയോട് ചോදിക്കുക" : "Ask Document", service: "askDoc", prompt: "What are the primary remedies and termination rights under this agreement?" },
                    { key: "compare", label: language === "te" ? "మార్కెట్ పోలిక" : language === "ta" ? "சந்தை ஒப்பீடு" : language === "ml" ? "വിപണി താരതമ్యం" : "Compare Market", service: "compare", prompt: "Compare standard market terms against the provisions drafted in this agreement." }
                  ]
            };

            setConversations((prev) =>
              prev.map((c) => {
                if (c.id === targetConvId) {
                  return {
                    ...c,
                    isSplitViewOpen: window.innerWidth > 960, // 3-zone on desktop
                    messages: [
                      ...c.messages.map((m) => (m.id === attachmentMsg.id ? { ...m, status: "ready" } : m)),
                      welcomeAiMsg
                    ]
                  };
                }
                return c;
              })
            );
          }, 600);
        }, 600);
      }, 500);
    }, 500);
  };

  const openDocument = (docId) => {
    if (speakingMessageId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }

    const existing = conversations.find((c) => c.document?.id === docId);
    if (existing) {
      setActiveConversationId(existing.id);
      setIsMobileSidebarOpen(false);
      return;
    }

    const docObj = SAMPLE_DOCUMENTS.find((d) => d.id === docId) || SAMPLE_DOCUMENTS[0];
    const isJudgment = docObj.category === "judgment" || docObj.filename.toLowerCase().includes("judgment");

    const newChat = {
      id: newId,
      title: docObj.filename.replace(/\.pdf$/, "").replace(/_/g, " "),
      timeCategory: "today",
      updatedAt: "Just now",
      document: docObj,
      isSplitViewOpen: true,
      activeHighlightId: null,
      messages: [
        {
          id: `msg-doc-${Date.now()}`,
          sender: "system",
          type: "attachment",
          filename: docObj.filename,
          pages: docObj.totalPages,
          clauses: docObj.totalClauses,
          format: "PDF",
          language: docObj.language,
          status: "ready"
        },
        {
          id: `msg-welcome-${Date.now()}`,
          sender: "ai",
          type: "welcome_actions",
          docType: docObj.docType,
          filename: docObj.filename,
          totalPages: docObj.totalPages,
          totalClauses: docObj.totalClauses,
          category: docObj.category,
          jurisdiction: docObj.jurisdiction,
          language: docObj.language,
          text: language === "te"
            ? `మీ ${docObj.docType} పత్రాన్ని నేను సమీక్షించాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?`
            : language === "ta"
            ? `உங்கள் ${docObj.docType}-ஐ நான் ஆய்வு செய்துள்ளேன். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?`
            : language === "ml"
            ? `ഞാൻ നിങ്ങളുടെ ${docObj.docType} വിശകലനം ചെയ്തു. എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?`
            : `I've analyzed your ${docObj.docType}. What would you like to know?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          recommendedActions: [
            { key: "summarize", label: "Summarize", service: "summarize", prompt: "Summarize this document with key dates, parties, and core obligations." },
            { key: "keyInfo", label: "Key Information", service: "keyInfo", prompt: "Extract key information including financials, lock-in duration, and covenants." },
            { key: "detectRisks", label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks and one-sided clauses in this document." }
          ],
          otherActions: [
            { key: "simplify", label: "Simplify / Plain Language", service: "simplify", prompt: "Explain this document in plain and simple terms." },
            { key: "askDoc", label: "Ask Document", service: "askDoc", prompt: "What are the primary remedies and rights under this document?" }
          ]
        }
      ]
    };

    setConversations([newChat, ...conversations]);
    setActiveConversationId(newId);
    setIsMobileSidebarOpen(false);
  };

  const toggleSplitView = (forceState = null) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          const nextState = forceState !== null ? forceState : !c.isSplitViewOpen;
          return { ...c, isSplitViewOpen: nextState };
        }
        return c;
      })
    );
  };

  const highlightClause = (clauseId, targetPage = null) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            activeHighlightId: clauseId,
            isSplitViewOpen: true
          };
        }
        return c;
      })
    );

    window.dispatchEvent(
      new CustomEvent("scroll-to-clause", { detail: { clauseId, page: targetPage } })
    );
  };

  const runServiceAction = (serviceKey, customQuery = null) => {
    const t = translations[language] || translations.en;
    const currentDoc = activeConversation?.document || SAMPLE_DOCUMENTS[0];
    const isDoc1 =
      currentDoc?.id === "doc-legal-1" ||
      currentDoc?.filename?.toLowerCase().includes("legal doc 1") ||
      currentDoc?.filename?.toLowerCase().includes("shriram");
    const isDoc2 =
      currentDoc?.id === "doc-legal-2" ||
      currentDoc?.filename?.toLowerCase().includes("legal doc 2") ||
      currentDoc?.filename?.toLowerCase().includes("muthukumarasamy");
    const isDoc3 =
      currentDoc?.id === "doc-legal-3" ||
      currentDoc?.filename?.toLowerCase().includes("legal doc 3") ||
      currentDoc?.filename?.toLowerCase().includes("booma devi");
    const isJudgmentDoc =
      isDoc1 ||
      isDoc2 ||
      isDoc3 ||
      currentDoc?.category === "judgment" ||
      currentDoc?.filename?.toLowerCase().includes("judgment") ||
      currentDoc?.filename?.toLowerCase().includes("order");

    let effectiveKey = serviceKey;
    if (!effectiveKey) {
      const q = (customQuery || "").toLowerCase();
      if (q.includes("risk") || q.includes("liability") || q.includes("அபாயம்") || q.includes("അപകട") || q.includes("నష్టం") || q.includes("రిస్క్")) effectiveKey = "detectRisks";
      else if (q.includes("summar") || q.includes("சுருக்") || q.includes("സംഗ്രഹ") || q.includes("సారాంశ")) effectiveKey = isJudgmentDoc ? "judgment_summarize" : "summarize";
      else if (q.includes("key") || q.includes("date") || q.includes("முக்கிய") || q.includes("பிரதான") || q.includes("ముఖ్య")) effectiveKey = "keyInfo";
      else if (q.includes("simplif") || q.includes("tamil") || q.includes("தமிழ்") || q.includes("malayalam") || q.includes("മലയാളം") || q.includes("telugu") || q.includes("తెలుగు") || q.includes("సరళ")) effectiveKey = "simplify";
      else if (q.includes("decid") || q.includes("court") || q.includes("தீர்ப்பு") || q.includes("விധി") || q.includes("కోర్టు") || q.includes("தீர்")) effectiveKey = "judgment";
      else if (q.includes("compar") || q.includes("ஒப்பீ") || q.includes("താരതമ്യ") || q.includes("పోలిక")) effectiveKey = "compare";
      else effectiveKey = "askDoc";
    }

    const serviceDef = t.services[effectiveKey];
    const userQueryText = customQuery || (serviceDef ? serviceDef.prompt : effectiveKey);

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: userQueryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: [...c.messages, userMsg]
          };
        }
        return c;
      })
    );

    setTimeout(() => {
      let aiResponseObj = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        serviceId: effectiveKey
      };

      let targetHighlightId = null;

      if (effectiveKey === "detectRisks") {
        aiResponseObj.type = "risk_result";
        if (isDoc1) {
          aiResponseObj.title = "LEGAL RISK DETECTION (E.P. NO. 09 / 2026)";
          aiResponseObj.text = language === "ta"
            ? "சட்ட அபாய ஆய்வு (சேவை 4): மனுதாரர் ஆஜராகாததால் மனு தள்ளுபடி செய்யப்பட்டுள்ளது. வணிக ஒப்பந்த அபாயங்கள் இதில் பொருந்தாது; நடைமுறை அபாயமே முதன்மையானது:"
            : "Service 4 — Legal Risk Detection Analysis: The execution petition was dismissed for default. Note that standard commercial contract risks (unilateral termination, uncapped indemnity) are absent because this is an execution petition, not a commercial agreement:";
          aiResponseObj.riskFindings = [
            {
              id: "01",
              clauseNumber: "Para 3",
              clauseId: "clause-ep-3",
              page: 2,
              title: language === "ta" ? "வழக்கு தள்ளுபடி (Dismissal for Default)" : "Dismissal for Default (Critical Procedural Risk)",
              riskLevel: "CRITICAL",
              summary: language === "ta"
                ? "மனுதாரர் அல்லது வழக்கறிஞர் ஆஜராகாததால், போதுமான அவகாசம் அளிக்கப்பட்டும் E.P. மனு தள்ளுபடி செய்யப்பட்டது. இதனால் கடன் வசூல் மற்றும் கைது நடவடிக்கை முடிவுக்கு வந்தது."
                : "Petitioner not present; no representation on behalf of petitioner despite sufficient opportunities. The Execution Petition was dismissed for default, terminating the arrest/recovery proceeding under Order XXI."
            },
            {
              id: "02",
              clauseNumber: "Para 2",
              clauseId: "clause-ep-2",
              page: 2,
              title: language === "ta" ? "சிவில் கைது கோரிக்கை (Civil Arrest under O. XXI R. 37 & 38)" : "Execution by Civil Arrest (O. XXI R. 37 & 38 CPC)",
              riskLevel: "MEDIUM",
              summary: language === "ta"
                ? "ரூ. 46,502 வசூலிக்க தீர்ப்புக் கடனாளியை கைது செய்ய கோரப்பட்டது. போதுமான வருவாய் ஆதார விசாரணை இன்றி கைது நடவடிக்கை மேற்கொள்வதில் சட்ட சிக்கல் உள்ளது."
                : "Petition sought arrest of Judgment Debtor to recover Rs. 46,502/-. Civil arrest for money decrees requires strict means inquiry under Section 51 and Order XXI Rule 37-40 CPC."
            },
            {
              id: "03",
              clauseNumber: "N/A",
              clauseId: "clause-ep-1",
              page: 1,
              title: language === "ta" ? "வணிக ஒப்பந்த அபாயங்கள் இல்லை (Commercial Clauses Absent)" : "Commercial Contract Risk Clauses Absent",
              riskLevel: "LOW",
              summary: language === "ta"
                ? "இந்த ஆவணம் ஒரு நீதிமன்ற உத்தரவு என்பதால், தானியங்கி புதுப்பித்தல், ஒருதலைப்பட்ச ஒப்பந்த ரத்து போன்ற வணிக அபாயங்கள் இதில் இல்லை."
                : "Automated renewal, non-compete, and unilateral termination clauses are not present in this document as it is a judicial execution order rather than an executory commercial agreement."
            }
          ];
          aiResponseObj.citations = [
            { label: "Page 2 · Para 3 (Findings)", page: 2, clauseId: "clause-ep-3" },
            { label: "Page 2 · Para 2 (Order)", page: 2, clauseId: "clause-ep-2" },
            { label: "Page 1 · Hearing Record", page: 1, clauseId: "clause-ep-1" }
          ];
          aiResponseObj.nextActions = [
            { label: "Summarize Case", service: "summarize", prompt: "Summarize this execution petition and court order." },
            { label: "Key Case Info", service: "keyInfo", prompt: "Extract CNR number, court, parties, and recovery amount." },
            { label: "எளிய தமிழில் விளக்கம்", service: "simplify", prompt: "இந்த உத்தரவை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." }
          ];
          targetHighlightId = "clause-ep-3";
        } else if (isDoc2) {
          aiResponseObj.title = "PROCEDURAL & DEPOSITION RISK ASSESSMENT (EA.5/2025 in EP.45/2007)";
          aiResponseObj.text = language === "ta"
            ? "சாட்சிய வாக்குமூல சட்ட ஆய்வு: இது இறுதி தீர்ப்பு அல்ல, குறுக்கு விசாரணை வாக்குமூலம் மட்டுமே. ஒத்திவைக்கப்பட்டுள்ளதால் நடைமுறை நிச்சயமற்ற தன்மை உள்ளது:"
            : "Deposition & Procedural Risk Assessment: This document is a witness cross-examination deposition, NOT a final decree or judgment. Key procedural risks identified:";
          aiResponseObj.riskFindings = [
            {
              id: "01",
              clauseNumber: "பக்கம் 5",
              clauseId: "clause-dep-5",
              page: 5,
              title: language === "ta" ? "இறுதி தீர்ப்பு இன்மை (Adjourned - No Final Order)" : "Pending Cross-Examination (No Final Judicial Order)",
              riskLevel: "HIGH",
              summary: language === "ta"
                ? "குறுக்கு விசாரணை நிறைவடையாமல் தொடர்ச்சிக்கு ஒத்திவைக்கப்பட்டுள்ளது. ஏல உரிமை அல்லது தீர்ப்பு பற்றிய இறுதி முடிவு எதுவும் பிறப்பிக்கப்படவில்லை."
                : "The deposition explicitly records 'Adjourned for continuation'. There is no final adjudication or operative order determining property auction rights."
            },
            {
              id: "02",
              clauseNumber: "பக்கம் 2",
              clauseId: "clause-dep-2",
              page: 2,
              title: language === "ta" ? "முந்தைய மதிப்பு குறைப்பு மனுக்கள் தள்ளுபடி (Prior EA Dismissals)" : "Prior Valuation Reduction Dismissals",
              riskLevel: "MEDIUM",
              summary: language === "ta"
                ? "ஏலச்சொத்தின் மதிப்பை ரூ. 40 லட்சத்திலிருந்து குறைக்க கோரி தாக்கல் செய்யப்பட்ட மனுக்கள் (EA 405/2014, EA 276/2016) தள்ளுபடி செய்யப்பட்டன."
                : "Prior execution applications to reduce the auction valuation below Rs. 40,00,000/- were dismissed by the court."
            },
            {
              id: "03",
              clauseNumber: "பக்கம் 3",
              clauseId: "clause-dep-3",
              page: 3,
              title: language === "ta" ? "நாளிதழ் விளம்பரம் மூலம் அழைப்பாணை (Substituted Service)" : "Substituted Service on Respondent Kavitha",
              riskLevel: "LOW",
              summary: language === "ta"
                ? "கவிதா என்பவருக்கு அழைப்பாணை திரும்பியதால் நாளிதழ் விளம்பரம் மூலம் மாற்று சார்வு செய்யப்பட்டது."
                : "Summons returned as 'No residence, left' necessitating substituted service via daily newspaper advertisement."
            }
          ];
          aiResponseObj.citations = [
            { label: "Page 5 · Adjournment", page: 5, clauseId: "clause-dep-5" },
            { label: "Page 2 · Prior EAs", page: 2, clauseId: "clause-dep-2" },
            { label: "Page 4 · Ex.P10 Valuation", page: 4, clauseId: "clause-dep-4" }
          ];
          aiResponseObj.nextActions = [
            { label: "Deposition Analysis (Service 7)", service: "judgment", prompt: "Analyze this cross-examination deposition and procedural stage." },
            { label: "Key Case Info", service: "keyInfo", prompt: "Extract witness details, property size, and court valuation." },
            { label: "எளிய தமிழில் விளக்கம்", service: "simplify", prompt: "இந்த வாக்குமூலத்தை எளிய தமிழில் விளக்குங்கள்." }
          ];
          targetHighlightId = "clause-dep-5";
        } else if (isDoc3) {
          aiResponseObj.title = "ATTACHMENT & TITLE RISK EVALUATION (I.A. NO. 3 / 2024)";
          aiResponseObj.text = language === "ta"
            ? "ஜப்தி நீக்கம் மற்றும் ஆவண தேதி முரண்பாடு சட்ட ஆய்வு: 2012-ல் செய்யப்பட்ட ஜப்திக்கு முன்பாகவே 2009-ல் கிரயம் செய்யப்பட்டுள்ளதால் ஜப்தி நீக்கப்பட்டது."
            : "Attachment & Title Risk Evaluation: Alienation in 2009 preceded the 2012 attachment before judgment; court ordered attachment raised under Order XXXVIII Rule 8 CPC.";
          aiResponseObj.citations = [
            { label: "Page 1 · Witness & Property Details", page: 1, clauseId: "clause-dep-1" },
            { label: "Page 4 · Ex.P10 Palanivel Valuation", page: 4, clauseId: "clause-dep-4" },
            { label: "Page 5 · Cross-Examination Adjourned", page: 5, clauseId: "clause-dep-5" }
          ];
          aiResponseObj.nextActions = [
            { label: "Analyze Proceedings (Service 7)", service: "judgment", prompt: "Explain the procedural nature of this deposition and why it is not a final decree." },
            { label: "Extract Key Witnesses & Property", service: "keyInfo", prompt: "Extract witness details, property size, and valuation amounts." },
            { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த வாக்குமூலத்தை எளிய தமிழில் விளக்குங்கள்." }
          ];
          targetHighlightId = "clause-dep-5";
        } else if (isDoc3) {
          aiResponseObj.type = "summary";
          aiResponseObj.title = "EXECUTIVE SUMMARY: I.A. 3/2024 (SERVICE 2 BENCHMARK)";
          aiResponseObj.structuredSummary = {
            overview: "Order passed in I.A. 3/2024 under Order XXXVIII Rule 8 CPC releasing Items 6 & 7 from attachment before judgment.",
            parties: "Petitioners: Booma Devi & minor children; Respondents: Ramalingam (R1), Krishnanveni (R2)",
            propertyInvolved: "Items 6 & 7 of suit schedule properties (Kannan purchased via Doc 737/2009)",
            coreHolding: "Alienation to Kannan in 2009 preceded the 2012 attachment before judgment; attachment raised/removed."
          };
          aiResponseObj.citations = [
            { label: "Page 1 · Parties & Petition", page: 1, clauseId: "clause-ia3-1" },
            { label: "Page 2 · Registered Sale 2009", page: 2, clauseId: "clause-ia3-2" },
            { label: "Page 5 · Attachment Raised", page: 5, clauseId: "clause-ia3-4" }
          ];
          aiResponseObj.nextActions = [
            { label: "Full Summary (Service 2)", service: "summarize", prompt: "Summarize the full background and holding of this court order." },
            { label: "Analyze Order (Service 7)", service: "judgment", prompt: "Provide full judicial order analysis under Order XXXVIII Rule 8 CPC." },
            { label: "Simplify / எளிய தமிழில்", service: "simplify", prompt: "இந்த தீர்ப்பை எளிய தமிழில் விளக்குங்கள்." }
          ];
          targetHighlightId = "clause-ia3-4";
        } else {
          aiResponseObj.type = "summary";
          aiResponseObj.title = "EXECUTIVE SUMMARY";
          aiResponseObj.structuredSummary = {
            overview: "Commercial lease agreement for office premises.",
            parties: "Lessor: Nexus Infrastructure Ltd.; Lessee: Sterling Legal AI Technologies Pvt. Ltd.",
            propertyInvolved: "Unit 402, Horizon Towers, Bangalore",
            coreHolding: "High-risk 7-day termination and 24-month unserved rent liquidated damages."
          };
          aiResponseObj.citations = [
            { label: "Page 1 · Clause 1.0", page: 1, clauseId: "clause-1" },
            { label: "Page 8 · Section 11.0", page: 8, clauseId: "clause-11" }
          ];
          aiResponseObj.nextActions = [
            { label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks and one-sided clauses in this document." },
            { label: "Extract Key Obligations", service: "keyInfo", prompt: "Extract key information including financials, lock-in duration, and covenants." },
            { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த ஆவணத்தை எளிய தமிழில் எனக்கு புரியும்படி விளக்குங்கள்." },
            { label: "Ask a Question", action: "focusComposer" }
          ];
          targetHighlightId = "clause-2";
        }
      } else if (effectiveKey === "keyInfo") {
        aiResponseObj.type = "key_info";
        if (isDoc1) {
          aiResponseObj.text = language === "ta"
            ? "முக்கிய வழக்கு விபரங்கள் (Key Case Information):\n• வழக்கு எண்: E.P. No. 09 / 2026 in ACP No. 162 / 2016 [CNR: TNKAOF-000014-2026]\n• நீதிமன்றம்: உளுந்தூர்பேட்டை மாவட்ட உரிமையியல் நீதிமன்றம்\n• நீதிபதி: திருமதி S. மதுமிதா, B.A., LL.B[Hons]., முதன்மை மாவட்ட உரிமையியல் நீதிபதி (பொறுப்பு)\n• மனுதாரர்: M.S. ஸ்ரீராம் பைனான்ஸ் லிமிடெட் (பொது அதிகார முகவர் S. சந்தோஷ்குமார்)\n• எதிர்மனுதாரர்: தனசெழியன், த/பெ. ஜெயராமன்\n• சட்டப்பிரிவு: Order XXI Rule 37 & 38 CPC\n• கோரப்பட்ட தொகை: ரூ. 46,502/-\n• நீதிமன்ற முடிவு: மனுதாரர் ஆஜராகாததால் தள்ளுபடி (Dismissed for default - 21.07.2026)"
            : "Key Case Information Extracted:\n• Case Number: E.P. No. 09/2026 in ACP No. 162/2016 [CNR: TNKAOF-000014-2026]\n• Court: Principal District Munsif Court, Ulundurpet\n• Presiding Officer: Tmt. S. Madhumitha, B.A., LL.B[Hons]., Principal District Munsif (FAC)\n• Petitioner: M.S. Shriram Finance Ltd (Rep by GPA S. Santhosh Kumar)\n• Respondent / Judgment Debtor: Dhanachezhiyan, S/o Jayaraman\n• Statutory Provisions: Order XXI Rule 37 & 38 CPC\n• Execution Claim: Rs. 46,502/- with interest & costs\n• Judicial Disposal: Dismissed for Default on 21.07.2026.";
          aiResponseObj.citations = [
            { label: "Page 1 · Parties & CNR", page: 1, clauseId: "clause-ep-1" },
            { label: "Page 2 · Claim & Recovery", page: 2, clauseId: "clause-ep-2" },
            { label: "Page 2 · Order & Disposal", page: 2, clauseId: "clause-ep-3" }
          ];
          aiResponseObj.nextActions = [
            { label: "Detect Procedural Risks (Service 4)", service: "detectRisks", prompt: "Detect procedural risks and execution status in this petition." },
            { label: "Simplify / எளிய தமிழில்", service: "simplify", prompt: "Explain this court order in simple terms." }
          ];
          targetHighlightId = "clause-ep-2";
        } else if (isDoc2) {
          aiResponseObj.text = language === "ta"
            ? "முக்கிய சாட்சி வாக்குமூல விபரங்கள் (Key Witness Deposition Information):\n• வழக்கு: EA.5/2025 in EP.45/2007 in OS.127/2004\n• நீதிமன்றம்: உளுந்தூர்பேட்டை மாவட்ட உரிமையியல் நீதிமன்றம்\n• நீதிபதி: திருமதி S. மதுமிதா, முதன்மை மாவட்ட உரிமையியல் நீதிபதி (பொறுப்பு)\n• சாட்சி: RW1 திரு. முத்துகுமாரசாமி (வழக்கறிஞர், வயது 61)\n• சொத்து விபரம்: உளுந்தூர்பேட்டை கந்தசாமிபுரம் மேற்கு, 4,050 சதுர அடி நிலமும் ஆர்.சி.சி. வீடும்\n• நீதிமன்ற ஏல மதிப்பீடு: ரூ. 57,76,000/- (ஓய்வுபெற்ற பொதுப்பணித்துறை செயற்பொறியாளர் பழனிவேல் மதிப்பீடு Ex.P10)\n• நடைமுறை நிலை: இறுதி தீர்ப்பு அல்ல; குறுக்கு விசாரணை தொடர்ச்சிக்கு ஒத்திவைப்பு"
            : "Key Witness Deposition Information Extracted:\n• Case: EA.5/2025 in EP.45/2007 in OS.127/2004\n• Court: Principal District Munsif Court, Ulundurpet\n• Witness: RW1 Mr. Muthukumarasamy (Advocate, age 61)\n• Property Involved: 4,050 sq. ft. RCC terrace house in Kandasamipuram West\n• Court Auction Valuation: Rs. 57,76,000/- as per Ex.P10 (Palanivel, Retd PWD EE)\n• Current Status: SCOPE LIMITATION: Deposition evidence only; adjourned for continuation of cross-examination.";
          aiResponseObj.citations = [
            { label: "Page 1 · Deposition Heading", page: 1, clauseId: "clause-dep-1" },
            { label: "Page 4 · Valuation Ex.P10", page: 4, clauseId: "clause-dep-4" },
            { label: "Page 5 · Adjourned", page: 5, clauseId: "clause-dep-5" }
          ];
          aiResponseObj.nextActions = [
            { label: "Analyze Proceedings (Service 7)", service: "judgment", prompt: "Explain the procedural nature of this deposition." },
            { label: "Simplify / எளிய தமிழில்", service: "simplify", prompt: "இந்த வாக்குமூலத்தை எளிய தமிழில் விளக்குங்கள்." }
          ];
          targetHighlightId = "clause-dep-4";
        } else if (isDoc3) {
          aiResponseObj.text = language === "ta"
            ? "முக்கிய நீதிமன்ற உத்தரவு விபரங்கள் (Key Court Order Information):\n• வழக்கு எண்: I.A. 3/2024 in I.A. 419/2012 in O.S. 116/2012\n• நீதிமன்றம்: உளுந்தூர்பேட்டை மாவட்ட உரிமையியல் நீதிமன்றம் (நீதிபதி திருமதி ஏ. எளக்கியா)\n• மனுதாரர்கள்: பூமா தேவி மற்றும் மைனர் குழந்தைகள் (மறைந்த கண்ணனின் வாரிசுகள்)\n• எதிர்மனுதாரர்கள்: ராமலிங்கம் (R1 - வாதி), கிருஷ்ணவேணி (R2 - 1வது பிரதிவாதி)\n• சட்டப்பிரிவு: Order XXXVIII Rule 8 CPC (தீர்ப்புக்கு முந்தைய ஜப்தியை நீக்குதல்)\n• சொத்துக்கள்: வழக்கு அட்டவணை சொத்துக்களில் 6 மற்றும் 7-வது இனங்கள்\n• கிரைய உரிமை: 2009-ல் (ஆவண எண் 737/2009) கண்ணன் கிரையம் பெற்றார்\n• நீதிமன்ற முடிவு: மனு அனுமதிக்கப்பட்டது; 6 மற்றும் 7-வது சொத்துக்கள் மீதான ஜப்தி நீக்கப்பட்டது"
            : "Key Court Order Information Extracted:\n• Case: I.A. 3/2024 in I.A. 419/2012 in O.S. 116/2012\n• Court: Principal District Munsif Court, Ulundurpet (Judge: Tmt. A. Elakiya)\n• Petitioners: Booma Devi & minor children (legal heirs of Kannan)\n• Respondents: Ramalingam (R1), Krishnanveni (R2)\n• Statutory Provision: Order XXXVIII Rule 8 CPC\n• Property Involved: Items 6 & 7 of suit schedule properties\n• Title Origin: Registered Sale Deed Doc No. 737/2009 executed prior to 2012 attachment\n• Final Order: Application ALLOWED; attachment over Items 6 & 7 raised/removed.";
          aiResponseObj.citations = [
            { label: "Page 1 · Cause Title", page: 1, clauseId: "clause-ia3-1" },
            { label: "Page 2 · 2009 Purchase", page: 2, clauseId: "clause-ia3-2" },
            { label: "Page 5 · Operative Relief", page: 5, clauseId: "clause-ia3-4" }
          ];
          aiResponseObj.nextActions = [
            { label: "Full Summary (Service 2)", service: "summarize", prompt: "Summarize this court order in detail." },
            { label: "Order Analysis (Service 7)", service: "judgment", prompt: "Analyze legal reasoning under Order XXXVIII Rule 8 CPC." },
            { label: "Simplify / எளிய தமிழில்", service: "simplify", prompt: "இந்த உத்தரவை எளிய தமிழில் விளக்குங்கள்." }
          ];
          targetHighlightId = "clause-ia3-4";
        } else {
          aiResponseObj.text = language === "te"
            ? "ముఖ్య ఒప్పంద వివరాలు సేకరించబడ్డాయి:\n• ప్రాంగణం: యూనిట్ 402, 4వ అంతస్తు, హారిజన్ టవర్స్ (4,200 చ.అడుగులు)\n• డిపాజిట్: ₹21,00,000 (వడ్డీ లేని రీఫండబుల్ సెక్యూరిటీ)\n• లాక్-ఇన్ కాలం: 24 నెలలు తప్పనిసరి\n• నోటీసు కాలం: కేవలం 7 రోజుల రాతపూర్వక నోటీసు."
            : language === "ta"
            ? "முக்கிய ஒப்பந்த விபரங்கள் பிரித்தெடுக்கப்பட்டன:\n• வளாகம்: யூனிட் 402, 4வது தளம், ஹொரைசன் டவர்ஸ் (4,200 சதுர அடி)\n• வைப்புத்தொகை: ₹21,00,000 (வட்டி இல்லா திருப்பப்படும் தொகை)\n• லாக்-இன் காலம்: 24 மாதங்கள்\n• அறிவிப்பு காலம்: 7 நாட்கள்"
            : language === "ml"
            ? "പ്രധാന കരാർ വിവരങ്ങൾ വേർതിരിച്ചെടുത്തു:\n• പരിസരം: യൂണിറ്റ് 402, നാലാം നില, ഹൊറൈസൺ ടവേഴ്സ് (4,200 ചതുരശ്ര അടി)\n• നിക്ഷേപം: ₹21,00,000 (പലിശയില്ലാതെ തിരികെ ലഭിക്കുന്നത്)\n• ലോക്ക്-ഇൻ കാലയളവ്: 24 മാസങ്ങൾ നിർബന്ധിതം\n• നോട്ടീസ് കാലയളവ്: 7 ദിവസത്തെ രേഖാമൂലമുള്ള നോട്ടീസ്"
            : "Key Information Extracted from the Demised Agreement:\n• Demised Premises: Unit 402, 4th Floor, Horizon Towers (4,200 sq. ft.)\n• Financials: Base rent INR 3,50,000/mo + INR 21,00,000 security deposit\n• Lock-in Duration: 24 mandatory calendar months\n• Handover Notice: 7 days written notice required.";
          aiResponseObj.citations = [
            { label: "Page 1 · Clause 1.0", page: 1, clauseId: "clause-1" },
            { label: "Page 3 · Clause 5.0", page: 3, clauseId: "clause-5" },
            { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" }
          ];
          aiResponseObj.nextActions = [
            { label: "Detect Risks", service: "detectRisks", prompt: "Detect potential legal risks in these terms." },
            { label: "Simplify in Plain Tamil", service: "simplify", prompt: "இந்த விதிமுறைகளை எளிய தமிழில் விளக்குங்கள்." },
            { label: "Compare with Market", service: "compare", prompt: "Compare standard market terms against these provisions." },
            { label: "Ask a Question", action: "focusComposer" }
          ];
          targetHighlightId = "clause-5";
        }
      } else if (effectiveKey === "simplify") {
        aiResponseObj.type = "simplified";
        if (isDoc1) {
          aiResponseObj.text = language === "ta" || userQueryText.includes("தமிழ்")
            ? "எளிய தமிழ் விளக்கம் (Plain Tamil):\n\nஸ்ரீராம் பைனான்ஸ் நிறுவனம் தனசெழியன் என்பவரிடமிருந்து ரூ. 46,502 வசூலிக்க அவரை கைது செய்ய வேண்டும் என உளுந்தூர்பேட்டை நீதிமன்றத்தில் மனு தாக்கல் செய்தது. ஆனால் பலமுறை வாய்ப்பு அளித்தும் ஸ்ரீராம் பைனான்ஸ் தரப்பில் வழக்கறிஞரோ அல்லது அதிகாரியோ நீதிமன்றத்தில் ஆஜராகவில்லை. இதனால் நீதிபதி இந்த வழக்கை 'Dismissed for Default' (ஆஜராகாததால் தள்ளுபடி) செய்து முடித்து வைத்துள்ளார்."
            : "Plain English Explanation:\n\nShriram Finance filed a court petition asking the judge to arrest Dhanachezhiyan to recover Rs. 46,502. However, when the case was called up on 21 July 2026, nobody from Shriram Finance showed up in court despite being given multiple opportunities. Because of this non-appearance, the Principal District Munsif dismissed the case for default.";
          aiResponseObj.citations = [
            { label: "Page 2 · Findings", page: 2, clauseId: "clause-ep-3" }
          ];
          targetHighlightId = "clause-ep-3";
        } else if (isDoc2) {
          aiResponseObj.text = language === "ta" || userQueryText.includes("தமிழ்")
            ? "எளிய தமிழ் விளக்கம் (Plain Tamil):\n\nஇது நீதிமன்றத்தின் இறுதி தீர்ப்பு அல்ல! உளுந்தூர்பேட்டை நீதிமன்றத்தில் வழக்கறிஞர் திரு. முத்துகுமாரசாமி (வயது 61) சாட்சியாக அளித்த குறுக்கு விசாரணை வாக்குமூலம். கந்தசாமிபுரத்தில் உள்ள 4050 சதுர அடி வீடு, ரூ. 57,76,000 மதிப்பீடு மற்றும் கவிதா என்பவருக்கு பத்திரிகை மூலம் அறிவிப்பு அனுப்பியது குறித்து சாட்சியம் அளித்துள்ளார். இந்த குறுக்கு விசாரணை இன்னும் முடியவில்லை; தொடர்ச்சிக்கு ஒத்திவைக்கப்பட்டுள்ளது."
            : "Plain English Explanation:\n\nThis document is NOT a final judgment or verdict. It is a witness cross-examination record from the Ulundurpet Munsif Court. Mr. Muthukumarasamy, a 61-year-old advocate, was cross-examined regarding a 4,050 sq. ft. property in Kandasamipuram, its Rs. 57,76,000 court auction valuation, and summons. The hearing was adjourned for continuation.";
          aiResponseObj.citations = [
            { label: "Page 1 · Deposition", page: 1, clauseId: "clause-dep-1" },
            { label: "Page 5 · Adjourned", page: 5, clauseId: "clause-dep-5" }
          ];
          targetHighlightId = "clause-dep-5";
        } else if (isDoc3) {
          aiResponseObj.text = language === "ta" || userQueryText.includes("தமிழ்")
            ? "எளிய தமிழ் விளக்கம் (Plain Tamil):\n\nபூமா தேவியின் கணவர் கண்ணன் 2009-ஆம் ஆண்டிலேயே கிருஷ்ணவேணியிடமிருந்து கிரையப் பத்திரம் மூலம் இந்த சொத்துக்களை வாங்கிவிட்டார். ஆனால் 2012-ல் ராமலிங்கம் தொடர்ந்த வழக்கில் இந்த சொத்துக்கள் தவறுதலாக ஜப்தி செய்யப்பட்டன. கண்ணன் ஏற்கனவே விலைக்கு வாங்கிவிட்டதால் கிருஷ்ணவேணிக்கு இதில் உரிமை இல்லை என்பதை நீதிமன்றம் ஏற்றுக்கொண்டு, 6 மற்றும் 7-வது சொத்துக்கள் மீதான ஜப்தியை உடனடியாக நீக்கி நீதிபதி எளக்கியா உத்தரவிட்டுள்ளார்."
            : "Plain English Explanation:\n\nBooma Devi's husband Kannan bought the properties from Krishnanveni back in 2009 through a registered sale deed. Three years later, in 2012, the properties were placed under court attachment before judgment in a suit between Ramalingam and Krishnanveni. Because Kannan had already purchased the property before any court attachment, the judge held that the attachment was invalid and ordered it completely removed over Items 6 & 7.";
          aiResponseObj.citations = [
            { label: "Page 2 · 2009 Sale", page: 2, clauseId: "clause-ia3-2" },
            { label: "Page 5 · Attachment Removed", page: 5, clauseId: "clause-ia3-4" }
          ];
          targetHighlightId = "clause-ia3-4";
        } else {
          aiResponseObj.text = language === "te" || userQueryText.includes("తెలుగు")
            ? "సరళమైన తెలుగు వివరణ (Plain Telugu):\n\n'నిబంధన 11.0' ప్రకారం: కేవలం 7 రోజుల రాతపూర్వక నోటీసుతో ఇరుపక్షాలు ఎప్పుడైనా ఒప్పందాన్ని రద్దు చేయవచ్చు. వ్యాపార రీత్యా ఇది చాలా ప్రమాదకరం, ఎందుకంటే కొత్త ఆఫీస్ కోసం 60-90 రోజులు పడుతుంది.\n\n'నిబంధన 14.0' ప్రకారం: 24 నెలల కంటే ముందు వైదొలిగితే, మిగిలిన నెలల మొత్తం అద్దెను పెనాల్టీగా చెల్లించాలని యజమాని కోరుతున్నారు. భారతీయ చట్టం ప్రకారం ఇది చెల్లని పెనాల్టీగా పరిగణించబడుతుంది."
            : language === "ta" || userQueryText.includes("தமிழ்")
            ? "எளிமைப்படுத்தப்பட்ட விளக்கம் (Plain Tamil):\n\n'விதி 11.0' கூறுகிறது: இரு தரப்பினரும் வெறும் 7 நாட்கள் எழுத்துப்பூர்வ அறிவிப்பு வழங்கி இந்த ஒப்பந்தத்தை எப்போது வேண்டுமானாலும் ரத்து செய்யலாம். இது வணிக ரீதியாக மிகவும் ஆபத்தானது, ஏனெனில் புதிய அலுவலகத்தைக் கண்டுபிடிக்க பல மாதங்கள் ஆகும்.\n\n'விதி 14.0' கூறுகிறது: 24 மாதங்களுக்குள் வெளியேறினால், மீதமுள்ள அனைத்து மாதங்களின் வாடகையையும் உரிமையாளருக்கு அபராதமாக செலுத்த வேண்டும்."
            : language === "ml" || userQueryText.includes("മലയാളം")
            ? "ലളിതമായ മലയാളം വിശദീകരണം (Plain Malayalam):\n\n'നിബന്ധന 11.0' വ്യക്തമാക്കുന്നു: വെറും 7 ദിവസത്തെ നോട്ടീസ് നൽകി ഇരുപക്ഷത്തിനും കരാർ റദ്ദാക്കാം. ബിസിനസ്സ് രംഗത്ത് ഇത് വളരെ അപകടകരമാണ്, കാരണം പുതിയ ഓഫീസ് കണ്ടെത്താൻ 60 മുതൽ 90 ദിവസം വരെ വേണ്ടിവരും.\n\n'നിബന്ധന 14.0' വ്യക്തമാക്കുന്നു: 24 മാസത്തിന് മുൻപ് ഒഴിഞ്ഞാൽ, ബാക്കി മാസങ്ങളിലെ മുഴുവൻ വാടകയും പിഴയായി ഉടമയ്ക്ക് നൽകേണ്ടിവരും. ഇന്ത്യൻ നിയമപ്രകാരം ഇത് പലപ്പോഴും അസാധുവാണ്."
            : "Plain English Simplification:\n\nClause 11.0: Either side can terminate this tenancy with only 7 days written notice. In real-world business, this is dangerous because moving an office takes 60–90 days.\n\nClause 14.0: If you leave before 24 months, the landlord demands full rent for all remaining unserved months as penalty, which is often legally unenforceable in India.";
          aiResponseObj.citations = [
            { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
            { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" }
          ];
          targetHighlightId = "clause-11";
        }
      } else if (effectiveKey === "judgment" || effectiveKey === "judgment_decision" || effectiveKey === "judgment_issues" || effectiveKey === "judgment_reasoning") {
        if (isDoc1) {
          aiResponseObj.type = "judgment_summary";
          aiResponseObj.title = "JUDICIAL ORDER ANALYSIS: E.P. NO. 09 / 2026";
          aiResponseObj.structuredJudgment = {
            caseName: "M.S. Shriram Finance Ltd v. Dhanachezhiyan",
            court: "Court of Principal District Munsif, Ulundurpet",
            citation: "E.P. No. 09/2026 in ACP No. 162/2016",
            bench: "Tmt. S. Madhumitha, Principal District Munsif (FAC)",
            background: "Execution Petition seeking arrest of judgment debtor for Rs. 46,502 under Order XXI Rule 37 & 38 CPC.",
            legalIssues: "Whether execution petition can survive non-appearance of decree holder.",
            reasoning: "Petitioner absent despite opportunities; no means evidence led.",
            finalDecision: "Dismissed for default on 21.07.2026.",
            practicalMeaning: "Execution proceedings terminated for non-prosecution."
          };
          aiResponseObj.citations = [
            { label: "Page 2 · Findings", page: 2, clauseId: "clause-ep-3" }
          ];
          targetHighlightId = "clause-ep-3";
        } else if (isDoc2) {
          aiResponseObj.type = "judgment_summary";
          aiResponseObj.title = "COURT PROCEEDING UNDERSTANDING (SERVICE 7)";
          aiResponseObj.structuredJudgment = {
            caseName: "Witness Deposition of RW1 in EA.5/2025 in EP.45/2007",
            court: "Principal District Munsif Court, Ulundurpet",
            citation: "EA.5/2025 in EP.45/2007 in OS.127/2004",
            bench: "Tmt. S. Madhumitha, Principal District Munsif (FAC)",
            background: "Witness cross-examination on auction valuation and summons service.",
            legalIssues: "Deposition evidence regarding property valuation and substituted service.",
            reasoning: "Testimony of RW1 Muthukumarasamy recorded.",
            finalDecision: "SCOPE LIMITATION: NOT A FINAL JUDGMENT. Adjourned for continuation.",
            practicalMeaning: "Ongoing cross-examination deposition, no final order."
          };
          aiResponseObj.citations = [
            { label: "Page 5 · Adjournment", page: 5, clauseId: "clause-dep-5" }
          ];
          targetHighlightId = "clause-dep-5";
        } else if (isDoc3) {
          aiResponseObj.type = "judgment_summary";
          aiResponseObj.title = "COURT ORDER ANALYSIS: I.A. NO. 3 / 2024";
          aiResponseObj.structuredJudgment = {
            caseName: "Booma Devi & others v. Ramalingam & Krishnanveni",
            court: "Court of Principal District Munsif, Ulundurpet",
            citation: "I.A. No. 3/2024 in I.A. No. 419/2012 in O.S. No. 116/2012",
            bench: "Tmt. A. Elakiya, Principal District Munsif",
            background: "Application under Order XXXVIII Rule 8 CPC to remove attachment before judgment.",
            legalIssues: "Validity of attachment placed after alienation by registered sale deed in 2009.",
            reasoning: "Title vested in Kannan prior to 2012 attachment; alienation was bona fide.",
            finalDecision: "Application ALLOWED. Attachment on Items 6 & 7 raised/removed.",
            practicalMeaning: "Third-party purchasers obtain full clear title free from attachment."
          };
          aiResponseObj.citations = [
            { label: "Page 5 · Operative Order", page: 5, clauseId: "clause-ia3-4" }
          ];
          targetHighlightId = "clause-ia3-4";
        } else {
          aiResponseObj.type = "judgment_summary";
          aiResponseObj.title = "JUDGMENT ANALYSIS: PERKINS EASTMAN (2020)";
          aiResponseObj.structuredJudgment = {
            caseName: "Perkins Eastman Architects DPC v. HSCC (India) Ltd.",
            court: "Supreme Court of India",
            citation: "(2020) 15 SCC 760",
            bench: "Dr. D.Y. Chandrachud & Ajay Rastogi, JJ.",
            background: "The respondent's CMD claimed contractual authority to unilaterally appoint the sole arbitrator under Clause 24.",
            legalIssues: "Whether an interested person disqualified under Section 12(5) can nominate another person as sole arbitrator.",
            reasoning: "Natural justice requires that an interested party cannot even indirectly shape the arbitral tribunal. Independence is an absolute statutory bar.",
            finalDecision: "Unilateral appointment struck down. Independent sole arbitrator appointed by Supreme Court under Section 11(6).",
            practicalMeaning: "Standard arbitration clauses empowering landlords/corporations to unilaterally choose arbitrators are unconstitutional & unenforceable."
          };
          aiResponseObj.citations = [
            { label: "Page 8 · Para 14", page: 8, clauseId: "clause-sc-14" },
            { label: "Page 15 · Para 21", page: 15, clauseId: "clause-sc-21" }
          ];
          targetHighlightId = "clause-sc-14";
        }
      } else if (effectiveKey === "compare") {
        aiResponseObj.type = "comparison";
        if (isDoc1 || isDoc2 || isDoc3) {
          aiResponseObj.text = language === "ta"
            ? "நீதிமன்ற நடைமுறை விதிமுறை ஒப்பீடு (CPC Procedural Comparison):\n• உத்தரவு XXI vs சிவில் ஒப்பந்தம்: இந்த ஆவணம் ஒரு நீதிமன்ற நடைமுறை ஆவணமாகும். இதில் வணிக ஒப்பந்த விதிகள் பொருந்தாது.\n• ஆஜராகாமைக்கான தள்ளுபடி: CPC விதிமுறைகளின்படி மனுதாரர் ஆஜராகாவிட்டால் வழக்கு தள்ளுபடி செய்யப்படுகிறது.\n• ஜப்தி நீக்கம்: Order XXXVIII Rule 8 CPC அடிப்படையில் முந்தைய கிரையதாரருக்கு முழு பாதுகாப்பு அளிக்கப்படுகிறது."
            : "Procedural Comparison under Code of Civil Procedure:\n• Judicial Execution vs Contractual Terms: These instruments are judicial proceedings governed strictly by the CPC, not private commercial contracts.\n• Default Dismissals: Order XXI executions are dismissed for default upon repeated non-appearance of decree holder.\n• Third-Party Protection: Order XXXVIII Rule 8 provides absolute protection to bona fide purchasers who acquired title prior to an attachment before judgment.";
          aiResponseObj.citations = [
            { label: "Page 2 · CPC Findings", page: 2, clauseId: isDoc1 ? "clause-ep-3" : isDoc3 ? "clause-ia3-2" : "clause-dep-2" }
          ];
        } else {
          aiResponseObj.text = language === "te"
            ? "ప్రామాణిక మార్కెట్ నిబంధనలతో పోలిక:\n• నోటీసు కాలం: పత్రంలో 7 రోజులు vs మార్కెట్ ప్రమాణం 60 నుండి 90 రోజులు.\n• లాక్-ఇన్ పెనాల్టీ: 100% మిగిలిన అద్దె vs మార్కెట్ ప్రమాణం గరిష్టంగా 3 నెలల అద్దె.\n• వివాద పరిష్కారం: యజమాని ఏకపక్ష ఎంపిక vs తటస్థ సంస్థాగత ఆర్బిట్రేషన్ (DIAC / MCIA)."
            : language === "ta"
            ? "சந்தை தரநிலைகளுடன் ஒப்பீடு:\n• அறிவிப்பு காலம்: ஆவணத்தில் 7 நாட்கள் vs சந்தை வழக்கம் 60 முதல் 90 நாட்கள்.\n• லாக்-இன் அபராதம்: முழு வாடகையும் கோருகிறது vs சந்தை வழக்கம் 3 மாத வாடகை.\n• நடுவர் நியமனம்: ஒருதலைப்பட்சம் vs சந்தை வழக்கம் நடுநிலையான மத்திய நடுவர் மன்றம் (DIAC / MCIA)."
            : language === "ml"
            ? "വിപണി മാനദണ്ഡങ്ങളുമായുള്ള താരതമ്യം:\n• നോട്ടീസ് കാലയളവ്: രേഖയിൽ 7 ദിവസം vs സാധാരണ വിപണി രീതി 60 മുതൽ 90 ദിവസം.\n• ലോക്ക്-ഇൻ പിഴ: 100% വാടകയും ആവശ്യപ്പെടുന്നു vs വിപണി രീതി പരമാവധി 3 മാസത്തെ വാടക.\n• തർക്ക പരിഹാരം: ഉടമയുടെ ഏകപക്ഷീയ നിയമനം vs നിഷ്പക്ഷ സ്ഥാപന ആർബിട്രേഷൻ (DIAC / MCIA)."
            : "Market Standard Comparison against Indian Commercial Practice:\n• Termination Notice: Document provides 7 days vs Market Standard of 60–90 days.\n• Lock-in Liquidated Damages: Document demands 100% unexpired rent vs Market Standard of 3 months maximum.\n• Dispute Resolution: Unilateral Lessor appointment vs Neutral Institutional Arbitration (e.g. DIAC, MCIA).";
          aiResponseObj.citations = [
            { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
            { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" },
            { label: "Page 12 · Clause 18.0", page: 12, clauseId: "clause-18" }
          ];
          targetHighlightId = "clause-11";
        }
      } else {
        aiResponseObj.type = "standard";
        if (isDoc1) {
          aiResponseObj.text = `Regarding "${userQueryText}":\n\nIn E.P. No. 09/2026 (M.S. Shriram Finance Ltd v. Dhanachezhiyan) before the Principal District Munsif Court at Ulundurpet, the petition was filed under Order XXI Rule 37 & 38 CPC to recover Rs. 46,502/-. On 21.07.2026, the court dismissed the petition for default due to the non-appearance of the petitioner.`;
          aiResponseObj.citations = [
            { label: "Page 2 · Findings", page: 2, clauseId: "clause-ep-3" }
          ];
          targetHighlightId = "clause-ep-3";
        } else if (isDoc2) {
          aiResponseObj.text = `Regarding "${userQueryText}":\n\nIn EA.5/2025 in EP.45/2007, the document is a witness cross-examination of RW1 Mr. Muthukumarasamy (Advocate, age 61) concerning a 4,050 sq. ft. RCC terrace property in Kandasamipuram West. The court valuation is Rs. 57,76,000/- based on Ex.P10. Crucially, this is NOT a final order; the proceeding was adjourned for continuation of cross-examination.`;
          aiResponseObj.citations = [
            { label: "Page 5 · Adjournment", page: 5, clauseId: "clause-dep-5" }
          ];
          targetHighlightId = "clause-dep-5";
        } else if (isDoc3) {
          aiResponseObj.text = `Regarding "${userQueryText}":\n\nIn I.A. No. 3/2024 in I.A. No. 419/2012 in O.S. No. 116/2012 (Booma Devi & others v. Ramalingam & Krishnanveni), the Principal District Munsif Court, Ulundurpet allowed the application under Order XXXVIII Rule 8 CPC and raised/removed the attachment over Items 6 & 7, holding that the 2009 sale to Kannan preceded the 2012 attachment.`;
          aiResponseObj.citations = [
            { label: "Page 5 · Order", page: 5, clauseId: "clause-ia3-4" }
          ];
          targetHighlightId = "clause-ia3-4";
        } else {
          aiResponseObj.text = language === "te"
            ? `మీ ప్రశ్న: "${userQueryText}"\n\nఈ పత్రంలోని వర్తించే నిబంధనలను విశ్లేషించాము. ఈ నిబంధనలు ఎదుటి పక్షంపై నేరుగా పనితీరు మరియు బాధ్యతలను విధిస్తాయి. హైలైట్ చేయబడిన నిబంధనలను సమీక్షించడం మరియు తదుపరి చర్యలను పరిశీలించడం మంచిది.`
            : language === "ta"
            ? `உங்கள் கேள்வி: "${userQueryText}"\n\nஇந்த ஆவணத்தின்படி, குறிப்பிட்ட விதிமுறைகள் சரிபார்க்கப்பட்டன. இந்த ஆவணத்தில் உள்ள நிபந்தனைகள் வாடகைதாரர்/எதிர் தரப்பினருக்கு கடுமையான பொறுப்புகளை சுமத்துகின்றன. கீழே உள்ள பரிந்துரைக்கப்பட்ட நடவடிக்கைகளை தொடர்ந்து அணுகலாம்.`
            : language === "ml"
            ? `നിങ്ങളുടെ ചോദ്യം: "${userQueryText}"\n\nഈ രേഖയിലെ പ്രസക്തമായ വ്യവസ്ഥകൾ പരിശോധിച്ചു. ഈ നിബന്ധനകൾ മറുപക്ഷത്തിന്മേൽ കർശന ബാധ്യതകൾ ചുമത്തുന്നു. താഴെ നൽകിയിട്ടുള്ള ശുപാർശിത നടപടികൾ സ്വീകരിക്കാവുന്നതാണ്.`
            : `Regarding "${userQueryText}":\n\nI analyzed the applicable clauses in this instrument. The provisions place direct performance and liability covenants on the counterparty. Reviewing the highlighted clauses and sources is recommended.`;
          aiResponseObj.citations = [
            { label: "Page 8 · Clause 11.0", page: 8, clauseId: "clause-11" },
            { label: "Page 9 · Clause 14.0", page: 9, clauseId: "clause-14" }
          ];
          targetHighlightId = "clause-11";
        }
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              messages: [...c.messages, aiResponseObj],
              isSplitViewOpen: window.innerWidth > 960 ? true : c.isSplitViewOpen,
              activeHighlightId: targetHighlightId || c.activeHighlightId
            };
          }
          return c;
        })
      );

      if (targetHighlightId) {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("scroll-to-clause", { detail: { clauseId: targetHighlightId } })
          );
        }, 150);
      }
    }, 600);
  };

  const deleteConversation = (id, e) => {
    if (e) e.stopPropagation();
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const freshId = `conv-${Date.now()}`;
      setConversations([
        {
          id: freshId,
          title: "New Conversation",
          timeCategory: "today",
          updatedAt: "Just now",
          document: null,
          messages: [],
          isSplitViewOpen: false,
          activeHighlightId: null
        }
      ]);
      setActiveConversationId(freshId);
    } else {
      setConversations(remaining);
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0].id);
      }
    }
  };

  const value = {
    conversations,
    activeConversation,
    activeConversationId,
    activeDocument,
    setActiveDocument,
    selectedLanguage: language,
    setSelectedLanguage: setLanguage,
    language,
    setLanguage,
    selectConversation,
    createNewChat,
    uploadDocument,
    openDocument,
    toggleSplitView,
    highlightClause,
    runServiceAction,
    deleteConversation,
    isSettingsOpen,
    setIsSettingsOpen,
    isProfileOpen,
    setIsProfileOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    speakingMessageId,
    handleToggleSpeech,
    isSimplifiedView,
    setIsSimplifiedView,
    caseId: activeDocument?.id || "CNR: TNKAOF-000014-2026",
    aiConfidence: "99.4%",
    SAMPLE_DOCUMENTS
  };

  return (
    <DocumentContext.Provider value={value}>
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

export default DocumentContext;
