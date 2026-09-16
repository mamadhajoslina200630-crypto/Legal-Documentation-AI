# SERVICE 4 — LEGAL RISK DETECTION

## AI-Driven Multilingual Legal Document Simplifier

**Project ID:** JEC-SIH2026-027

---

# 1. SERVICE OVERVIEW

## Service Name

**Legal Risk Detection**

## Service Number

**Service 4**

## Purpose

Legal Risk Detection identifies potentially important, risky, restrictive, unfavorable, ambiguous, or financially significant portions of a legal document.

The service is especially useful for contracts and agreements.

The purpose is NOT to declare that a clause is illegal.

The purpose is to help the user understand:

- Which clauses may create risk.
- What type of risk may exist.
- How severe the potential risk appears.
- Why the clause may matter.
- Which clause contains the potential risk.
- Where the clause appears in the document.
- What the user may want to clarify or consider.

---

# 2. POSITION OF SERVICE 4 IN THE PROJECT

The overall project workflow is:

```text
COMPLEX LEGAL DOCUMENT
        ↓
DOCUMENT UNDERSTANDING
        ↓
IMPORTANT INFORMATION EXTRACTION
        ↓
LEGAL SUMMARY
        ↓
PLAIN-LANGUAGE SIMPLIFICATION
        ↓
REGIONAL-LANGUAGE SIMPLIFICATION
        ↓
RISK DETECTION
        ↓
DOCUMENT Q&A
        ↓
SOURCE / PAGE EVIDENCE
```

Service 4 is one of the core document-analysis services.

It operates on the shared document context created by the common document-processing pipeline.

The service should NOT create an independent document-processing pipeline.

---

# 3. USER-FACING SERVICE

After a document becomes READY, the user sees the primary services:

```text
[ Understand Document ]

[ Summarize ]

[ Extract Key Information ]

[ Detect Risks ]

[ Simplify & Translate ]

[ Ask Document ]

[ Understand Judgment ]

[ Voice Assistant ]
```

The user selects:

```text
[ Detect Risks ]
```

The system then analyzes the uploaded document and presents the potential risks in a structured interface.

---

# 4. WHAT SERVICE 4 SHOULD ANSWER

The main question answered by Service 4 is:

> "What parts of this document could create important contractual or legal concerns, why might they matter, and where exactly are they mentioned?"

The service should identify potential concerns such as:

- High penalties
- Automatic renewal
- Broad termination rights
- Unlimited liability
- One-sided obligations
- Confidentiality restrictions
- Non-compete restrictions
- Hidden fees
- Ambiguous wording
- Unfavorable payment terms
- Strict deadlines
- Liability exposure
- Dispute-resolution concerns
- Jurisdiction concerns

These are potential concerns identified from the document.

They are NOT automatically legal violations.

---

# 5. SUPPORTED DOCUMENT TYPES

Service 4 can operate on multiple legal-document types.

## Primary Use Case

Contracts and agreements.

Examples:

- Employment agreements
- Lease agreements
- NDAs
- Service agreements
- Sale agreements
- Partnership agreements
- Commercial contracts
- SaaS agreements
- Other authorized legal contracts

## Other Documents

Risk detection may also be useful for:

- Legal notices
- Court-related documents
- Settlement agreements
- Terms and conditions

However, the risk categories must be appropriate for the document type.

The service must NOT assume that every uploaded document is a contract.

---

# 6. INPUT

The service receives a processed legal document through the shared document context.

Example input:

```json
{
  "document_id": "DOC-001",
  "document_type": "employment_agreement",
  "language": "English",
  "pages": 12,
  "sections": [],
  "clauses": [],
  "entities": [],
  "chunks": [],
  "metadata": {}
}
```

The actual service should use the complete shared document context rather than independently re-extracting everything.

---

# 7. SHARED DOCUMENT CONTEXT

Service 4 can reuse:

- Document ID
- Document type
- Document language
- Page information
- Extracted text
- Sections
- Clauses
- Entities
- Document chunks
- Metadata
- Relevant source chunks
- Existing citations
- Document structure

The shared document context is created once and reused by multiple services.

Architecture principle:

```text
DOCUMENT
    ↓
DOCUMENT PROCESSING
    ↓
SHARED DOCUMENT CONTEXT
    ↓
┌───────────────┬──────────────┬───────────────┐
│ Summary       │ Extraction   │ Risk Detection│
└───────────────┴──────────────┴───────────────┘
```

Do NOT create separate extraction pipelines for Service 4.

---

# 8. HOW THE SERVICE ANSWER IS GOT

The answer is generated through the following process:

```text
USER CLICKS "DETECT RISKS"
        ↓
SERVICE 4 REQUEST
        ↓
LOAD DOCUMENT CONTEXT
        ↓
IDENTIFY DOCUMENT TYPE
        ↓
LOAD RELEVANT CLAUSES / CHUNKS
        ↓
ANALYZE CLAUSES
        ↓
IDENTIFY POTENTIAL RISK PATTERNS
        ↓
CLASSIFY RISK TYPE
        ↓
ESTIMATE SEVERITY
        ↓
GENERATE EXPLANATION
        ↓
IDENTIFY WHY IT MATTERS
        ↓
ATTACH CLAUSE / SECTION
        ↓
ATTACH PAGE / SOURCE
        ↓
GENERATE SUGGESTED CONSIDERATION
        ↓
VALIDATE GROUNDING
        ↓
RETURN STRUCTURED RESULT
        ↓
FRONTEND RENDERS RISK CARDS
```

---

# 9. DETAILED WORKING LOGIC

## STEP 1 — Receive Request

The frontend sends a request to the backend.

Example:

```http
POST /documents/{document_id}/risks
```

The frontend does NOT directly communicate with the AI provider.

---

## STEP 2 — Load Document

The backend retrieves the document and its shared document context.

The system verifies:

- Document exists.
- User has access.
- Document processing is complete.
- Document is in READY state.
- Required text/context is available.

If the document is not ready, the service should not perform incomplete analysis.

---

# 10. STEP 3 — IDENTIFY DOCUMENT TYPE

The service checks the document type.

Examples:

```text
employment agreement
lease agreement
NDA
service agreement
sale agreement
legal notice
court order
judgment
```

Risk detection should use document-specific analysis.

### Employment Agreement

Look for:

- Non-compete
- Termination
- Penalties
- Confidentiality
- Liability
- Notice periods

### Lease Agreement

Look for:

- Security deposit
- Rent increases
- Renewal
- Termination
- Penalties
- Maintenance obligations
- Liability

### NDA

Look for:

- Broad confidentiality requirements
- Duration
- Exceptions
- Penalties
- Liability
- Restrictions

The system should not apply irrelevant risk categories blindly.

---

# 11. STEP 4 — CLAUSE IDENTIFICATION

The service examines relevant clauses.

Example:

```text
Clause 9.1
Automatic Renewal

Clause 11.3
Termination

Clause 14.2
Liability

Clause 16.1
Dispute Resolution
```

Each clause should retain its location.

Example:

```json
{
  "clause_id": "14.2",
  "page": 8,
  "text": "..."
}
```

---

# 12. STEP 5 — RISK PATTERN ANALYSIS

The service checks whether the clause contains potentially important risk characteristics.

Examples:

```text
IF liability has no clear limit
        ↓
Potential Unlimited Liability Risk
```

```text
IF agreement automatically renews
        ↓
Potential Automatic Renewal Risk
```

```text
IF termination rights are significantly one-sided
        ↓
Potential Broad Termination Risk
```

```text
IF penalty is unusually restrictive according to
the document context
        ↓
Potential Penalty Risk
```

```text
IF wording is unclear or open to multiple interpretations
        ↓
Potential Ambiguity Risk
```

This is risk identification, not a legal verdict.

---

# 13. RISK CATEGORIES

## 13.1 Financial Risk

Examples:

- High penalties
- Hidden fees
- Unfavorable payment conditions
- Financial liability

## 13.2 Liability Risk

Examples:

- Unlimited liability
- Broad indemnification
- Liability for third-party losses
- Extensive responsibility for damages

## 13.3 Termination Risk

Examples:

- Broad termination rights
- One-sided termination
- Short notice period
- Termination penalties

## 13.4 Renewal Risk

Examples:

- Automatic renewal
- Difficult cancellation
- Renewal without clear notice

## 13.5 Restriction Risk

Examples:

- Non-compete restrictions
- Confidentiality restrictions
- Broad use restrictions

## 13.6 Obligation Risk

Examples:

- One-sided obligations
- Extensive responsibilities
- Strict performance requirements

## 13.7 Deadline Risk

Examples:

- Very strict notice deadlines
- Short payment deadlines
- Short termination notice periods

## 13.8 Ambiguity Risk

Examples:

- Unclear wording
- Undefined terms
- Broad interpretation
- Conflicting provisions

## 13.9 Dispute / Jurisdiction Risk

Examples:

- Unfavorable jurisdiction
- Unclear dispute-resolution mechanism
- Mandatory arbitration provisions
- Exclusive jurisdiction clauses

---

# 14. STEP 6 — RISK SEVERITY

Each detected risk should receive a severity classification.

Recommended MVP levels:

```text
HIGH
MEDIUM
LOW
```

Optional UI category:

```text
ATTENTION NEEDED
```

Severity should indicate the apparent importance of the issue within the document.

It should NOT be presented as a guaranteed legal classification.

---

# 15. HIGH RISK

A HIGH risk indicates that the clause may create substantial concern or exposure based on the information available in the document.

Examples:

- Unlimited liability
- Significant penalty
- Very broad unilateral termination rights
- Major financial exposure

Example:

```text
HIGH RISK

Unlimited Liability

Clause 14.2
Page 8
```

---

# 16. MEDIUM RISK

A MEDIUM risk indicates a potentially important concern that deserves user attention.

Examples:

- Automatic renewal
- Strict deadlines
- One-sided obligations
- Restrictive payment terms

---

# 17. LOW / ATTENTION NEEDED

A lower-severity concern may still be useful to the user.

Examples:

- Ambiguous wording
- Minor restrictive language
- Less significant procedural concern

The UI should make clear that low severity does NOT mean "safe."

---

# 18. STEP 7 — GENERATE EXPLANATION

For every detected risk, the system generates a plain-language explanation.

Example:

```text
Risk:
Unlimited Liability

Explanation:
This clause may create significant financial exposure
because it does not appear to specify a clear maximum
limit on liability.
```

The explanation should be:

- Clear
- Concise
- Grounded in the document
- Understandable to non-lawyers
- Careful about legal certainty

---

# 19. STEP 8 — EXPLAIN WHY IT MATTERS

Every risk should explain its practical significance.

Example:

```text
WHY IT MATTERS

If the conditions in this clause apply, the party may
potentially be responsible for losses without a clearly
defined maximum amount.
```

This helps the user understand the practical meaning rather than simply seeing a risk label.

---

# 20. STEP 9 — IDENTIFY RELEVANT CLAUSE

Every risk should point to the exact clause whenever possible.

Example:

```text
Relevant Clause:
Clause 14.2 — Liability
```

If there is no formal clause number:

```text
Relevant Section:
Liability and Indemnification
```

If neither exists:

```text
Source:
Page 8
```

---

# 21. STEP 10 — SOURCE / PAGE EVIDENCE

Every risk should provide evidence whenever possible.

Example:

```text
Source

Employment Agreement
Page 8
Clause 14.2
```

The user should be able to click:

```text
[ View Source ]
```

The application should navigate to the relevant page or source text.

---

# 22. SOURCE HIGHLIGHTING

When possible, the frontend should highlight the source clause.

Example:

```text
DOCUMENT PAGE 8

14.2 LIABILITY

"The Employee shall be responsible for any and all
losses arising from..."

             ↑
      Potential Risk
```

This creates traceability between the AI answer and the original document.

---

# 23. STEP 11 — SUGGESTED CONSIDERATION

The system can provide a question or consideration.

Example:

```text
Suggested consideration:

You may want to clarify whether a maximum liability
limit applies to this clause.
```

Another example:

```text
Suggested consideration:

You may want to confirm whether the agreement renews
automatically and how cancellation must be provided.
```

The system should not present these as mandatory legal instructions.

---

# 24. HOW THE FINAL ANSWER LOOKS

The user should receive a structured risk report.

Example:

```text
LEGAL RISK DETECTION

Document:
Employment Agreement.pdf

Risk Overview:

🔴 High: 2
🟠 Medium: 4
🟡 Attention: 3

Total Potential Concerns: 9
```

Then:

```text
🔴 HIGH RISK

Unlimited Liability

Clause 14.2

Explanation:
This clause may create significant financial exposure
because the liability does not appear to have a clearly
defined maximum limit.

Why it matters:
The responsible party may potentially be exposed to
substantial losses if the stated conditions apply.

Source:
Page 8
Clause 14.2

Suggested consideration:
You may want to clarify whether a liability cap applies.

[ View Source ]
[ Explain Simply ]
```

---

# 25. MULTIPLE RISK RESULTS

If several risks are identified:

```text
RISK REPORT

1. 🔴 Unlimited Liability
   Clause 14.2
   Page 8

2. 🔴 High Termination Penalty
   Clause 11.3
   Page 6

3. 🟠 Automatic Renewal
   Clause 9.1
   Page 5

4. 🟠 Strict Notice Period
   Clause 11.4
   Page 6

5. 🟡 Ambiguous Wording
   Clause 15.2
   Page 9
```

The user can expand each card.

---

# 26. USER INTERFACE STRUCTURE

Recommended UI:

```text
┌──────────────────────────────────────────────────────┐
│ LEGAL RISK DETECTION                                 │
│ Employment Agreement.pdf                             │
├──────────────────────────────────────────────────────┤
│                                                      │
│ RISK OVERVIEW                                        │
│                                                      │
│ 🔴 2 High   🟠 4 Medium   🟡 3 Attention             │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ FILTER                                               │
│ [ All ▼ ] [ Severity ▼ ] [ Category ▼ ]              │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 🔴 HIGH RISK                                         │
│                                                      │
│ Unlimited Liability                                 │
│ Clause 14.2                                         │
│                                                      │
│ This clause may create significant financial         │
│ exposure because...                                 │
│                                                      │
│ 📄 Page 8                                            │
│                                                      │
│ [ View Source ] [ Explain Simply ]                   │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 🟠 MEDIUM RISK                                       │
│                                                      │
│ Automatic Renewal                                   │
│ Clause 9.1                                          │
│                                                      │
│ ...                                                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 27. LANGUAGE SUPPORT

Service 4 should work with the multilingual capabilities of the overall project.

The user can select:

```text
English
Tamil
Hindi
Telugu
Malayalam
Kannada
Bengali
Marathi
```

The risk analysis itself should remain grounded in the original document.

The explanation can then be presented in the selected language.

Example:

```text
English:

This clause may create significant financial exposure.

Tamil:

இந்த விதி குறிப்பிடத்தக்க நிதிச் சுமையை ஏற்படுத்தக்கூடும்.
```

The translated explanation must preserve the intended meaning.

---

# 28. SIMPLIFICATION OF RISK

The user may select:

```text
[ Explain Simply ]
```

The system converts the detected risk into simple language.

Example:

Original legal concept:

```text
Unlimited liability under Clause 14.2
```

Simple explanation:

```text
This clause may mean that there is no clearly stated
maximum limit on the amount that could be claimed
under these conditions.
```

The simplification must not change the underlying legal meaning.

---

# 29. DOCUMENT CHAT INTEGRATION

Service 4 should integrate with the project's Document Q&A service.

After seeing a risk, the user can ask:

```text
Why is this clause risky?
```

or:

```text
Explain this clause in Tamil.
```

or:

```text
What happens if I do not follow this clause?
```

or:

```text
Show me all clauses related to penalties.
```

The answer should remain grounded in the uploaded document.

---

# 30. HOW CHAT CONNECTS TO SERVICE 4

Example:

```text
USER
"Why is Clause 14.2 risky?"
        ↓
QUERY PROCESSING
        ↓
IDENTIFY CLAUSE 14.2
        ↓
RETRIEVE RELEVANT DOCUMENT CONTEXT
        ↓
AI GATEWAY
        ↓
GENERATE GROUNDED ANSWER
        ↓
SOURCE VALIDATION
        ↓
ANSWER
```

Example response:

```text
Clause 14.2 may create financial exposure because
the clause does not appear to specify a clear maximum
liability limit.

Source:
Page 8
Clause 14.2
```

---

# 31. DOCUMENT GROUNDING

Service 4 must be document-grounded.

When detecting risks, the system should use:

```text
UPLOADED DOCUMENT
        ↓
RELEVANT CLAUSE
        ↓
DOCUMENT CONTEXT
        ↓
RISK ANALYSIS
```

The AI must not invent a clause.

It must not claim a risk that is unsupported by the document.

---

# 32. RAG FLOW FOR REAL AI MODE

In a real implementation:

```text
USER REQUEST
      ↓
QUERY / RISK ANALYSIS
      ↓
DOCUMENT RETRIEVAL
      ↓
RELEVANT CHUNKS
      ↓
RERANKING
      ↓
CONTEXT ASSEMBLY
      ↓
AI MODEL
      ↓
STRUCTURED RISK OUTPUT
      ↓
SOURCE VALIDATION
      ↓
FRONTEND
```

The uploaded document remains the primary source for document-specific analysis.

---

# 33. MVP DETERMINISTIC DEMO MODE

For the SIH demo, Service 4 may use deterministic mock responses.

Architecture:

```text
FRONTEND
   ↓
FASTAPI
   ↓
SERVICE 4
   ↓
AI GATEWAY
   ↓
MOCK PROVIDER
   ↓
JSON FIXTURE
```

The mock provider behaves like an AI provider from the application's perspective.

---

# 34. MOCK FIXTURE

Example structure:

```text
fixtures/
└── intelligence/
    └── document-001/
        ├── understanding.json
        ├── summary.json
        ├── extraction.json
        ├── risks.json
        ├── simplification.json
        ├── translation.json
        ├── judgment.json
        └── chat.json
```

Service 4 uses:

```text
risks.json
```

---

# 35. SAMPLE RISK FIXTURE

Example:

```json
{
  "document_id": "document-001",
  "analysis_type": "legal_risk_detection",
  "risks": [
    {
      "id": "risk-001",
      "title": "Unlimited Liability",
      "category": "liability",
      "severity": "high",
      "explanation": "This clause may create significant financial exposure because it does not appear to specify a clear maximum liability limit.",
      "clause": "14.2",
      "why_it_matters": "The responsible party may potentially be exposed to substantial losses if the stated conditions apply.",
      "source": {
        "page": 8,
        "section": "Liability",
        "clause": "14.2"
      },
      "suggested_consideration": "You may want to clarify whether a maximum liability limit applies."
    }
  ]
}
```

---

# 36. REAL AI MODE

The same service architecture must support real AI providers.

Example:

```text
SERVICE 4
    ↓
DOCUMENT CONTEXT
    ↓
AI GATEWAY
    ↓
Gemini
```

or:

```text
SERVICE 4
    ↓
DOCUMENT CONTEXT
    ↓
AI GATEWAY
    ↓
OpenAI
```

or:

```text
SERVICE 4
    ↓
DOCUMENT CONTEXT
    ↓
AI GATEWAY
    ↓
Claude
```

The frontend should not know which AI provider is being used.

---

# 37. AI PROMPT LOGIC

The Service 4 AI prompt should instruct the model to:

1. Use the supplied document/context.
2. Identify potentially risky or unfavorable clauses.
3. Do not invent clauses.
4. Do not invent facts.
5. Preserve the legal meaning.
6. Identify the relevant source.
7. Identify the page/section/clause where possible.
8. Explain why the clause may matter.
9. Assign an appropriate severity.
10. Provide a suggested consideration.
11. Clearly communicate uncertainty.
12. Avoid unsupported legal conclusions.
13. Never claim that a clause is definitely illegal solely from the analysis.
14. Use simple language.
15. Support the selected regional language when required.

---

# 38. IMPORTANT AI SAFETY RULE

The model must NOT produce:

```text
"This clause is definitely illegal."
```

It should instead produce:

```text
"This clause may create a significant contractual risk
because..."
```

or:

```text
"This provision may warrant further legal review because..."
```

The system must distinguish between:

```text
Potential Risk
```

and:

```text
Confirmed Legal Violation
```

Service 4 should focus on potential risk identification.

---

# 39. LEGAL SAFETY

Service 4 is an assistance tool.

It is NOT a lawyer replacement.

The system should:

- Explain
- Highlight
- Identify
- Simplify
- Summarize
- Provide evidence
- Suggest questions for consideration

The system should NOT:

- Guarantee legal outcomes.
- Declare a clause illegal without sufficient legal basis.
- Pretend to be a lawyer.
- Invent legal rules.
- Invent court decisions.
- Invent clauses.
- Give unsupported legal conclusions.
- Claim certainty when evidence is insufficient.

For high-risk decisions, the system may recommend professional legal review.

---

# 40. SOURCE VALIDATION

Before returning a risk result, the system should validate:

```text
Does the cited clause exist?
        ↓
YES → Continue

NO → Remove / flag result
```

Also verify:

```text
Does the cited page correspond to the clause?
```

and:

```text
Does the explanation actually correspond
to the source text?
```

This reduces hallucinated risk findings.

---

# 41. ERROR HANDLING

## Document Not Found

```text
Document could not be found.
Please select a valid document.
```

## Document Still Processing

```text
Your document is still being processed.
Risk detection will be available once processing is complete.
```

## No Risks Detected

Do NOT say:

```text
"This document is completely safe."
```

Instead:

```text
No significant potential risks were identified
from the available document content.

This does not guarantee that the document is risk-free.
```

## Insufficient Text

```text
I could not analyze the document reliably because
some required text could not be extracted.
```

## Unsupported Document

```text
Risk detection is currently limited for this
document type.
```

---

# 42. EMPTY STATE

If the analysis has not yet been performed:

```text
Legal Risk Detection

No risk analysis has been performed yet.

Click "Detect Risks" to analyze this document.

[ Detect Risks ]
```

---

# 43. LOADING STATE

While processing:

```text
Analyzing document...

✓ Reading document
✓ Identifying clauses
● Checking potential risks
○ Generating explanations
○ Verifying sources
```

The user should receive meaningful processing feedback.

---

# 44. SUCCESS STATE

After completion:

```text
Risk analysis complete.

9 potential areas identified.

🔴 2 High
🟠 4 Medium
🟡 3 Attention
```

Then display the risk cards.

---

# 45. API CONTRACT

Recommended endpoint:

```http
POST /documents/{document_id}/risks
```

Request:

```json
{
  "language": "en"
}
```

Optional:

```json
{
  "language": "ta",
  "severity_filter": "all"
}
```

The exact API must remain consistent with the existing project architecture.

---

# 46. RESPONSE CONTRACT

Recommended response:

```json
{
  "document_id": "DOC-001",
  "analysis_type": "legal_risk_detection",
  "status": "completed",
  "summary": {
    "total": 9,
    "high": 2,
    "medium": 4,
    "low": 3
  },
  "risks": [
    {
      "id": "risk-001",
      "title": "Unlimited Liability",
      "category": "liability",
      "severity": "high",
      "explanation": "...",
      "clause": "14.2",
      "why_it_matters": "...",
      "source": {
        "page": 8,
        "section": "Liability",
        "clause": "14.2"
      },
      "suggested_consideration": "..."
    }
  ]
}
```

---

# 47. FRONTEND RENDERING

The frontend should render:

```text
Risk Overview
        ↓
Risk Filters
        ↓
Risk Categories
        ↓
Risk Cards
        ↓
Source Evidence
        ↓
Simple Explanation
        ↓
Follow-up Chat
```

The frontend should not contain the actual risk-analysis business logic.

---

# 48. BACKEND BUSINESS LOGIC

Recommended internal structure:

```text
backend/
├── services/
│   └── legal_risk_detection/
│       ├── service.py
│       ├── schemas.py
│       ├── prompts.py
│       ├── validators.py
│       └── risk_rules.py
│
├── ai/
│   ├── gateway.py
│   └── providers/
│
├── document/
│   └── context.py
│
└── sources/
    └── evidence.py
```

The exact directory structure may be adjusted to match the existing codebase.

---

# 49. BUSINESS LOGIC OF SERVICE 4

The core business logic is:

```text
INPUT:
Legal document

        ↓

UNDERSTAND DOCUMENT

        ↓

IDENTIFY DOCUMENT TYPE

        ↓

GET RELEVANT CLAUSES

        ↓

ANALYZE CLAUSE CONTENT

        ↓

IDENTIFY POTENTIAL RISK

        ↓

CLASSIFY RISK CATEGORY

        ↓

ASSIGN SEVERITY

        ↓

EXPLAIN RISK

        ↓

EXPLAIN WHY IT MATTERS

        ↓

LINK TO CLAUSE / PAGE

        ↓

GENERATE SUGGESTED CONSIDERATION

        ↓

VALIDATE SOURCE

        ↓

RETURN STRUCTURED RISK RESULT
```

---

# 50. CORE BUSINESS RULES

## Rule 1 — Document Grounding

Every risk should be based on the uploaded document.

## Rule 2 — No Hallucination

Never invent:

- Clauses
- Pages
- Parties
- Terms
- Penalties
- Obligations
- Legal facts

## Rule 3 — No Definitive Legal Verdict

Do not automatically state that something is illegal.

## Rule 4 — Evidence

Whenever possible, every risk must have:

- Page
- Section
- Clause
- Source text
- Citation

## Rule 5 — Explain the Risk

A risk title alone is insufficient.

Every risk should explain:

```text
What is the risk?
+
Why might it matter?
```

## Rule 6 — User-Friendly Language

The result should be understandable by a non-lawyer.

## Rule 7 — Preserve Meaning

Simplification must not change the legal meaning.

## Rule 8 — Document-Type Awareness

Risk analysis must consider the type of legal document.

## Rule 9 — Uncertainty

When evidence is insufficient:

```text
The available document content is insufficient
to determine this reliably.
```

## Rule 10 — Legal Review

For significant legal decisions, the system may recommend professional review.

---

# 51. EXAMPLE END-TO-END FLOW

User uploads:

```text
Employment_Agreement.pdf
```

The common document pipeline performs:

```text
UPLOAD
 ↓
VALIDATION
 ↓
TEXT EXTRACTION
 ↓
OCR IF REQUIRED
 ↓
PAGE EXTRACTION
 ↓
STRUCTURE EXTRACTION
 ↓
CHUNKING
 ↓
DOCUMENT UNDERSTANDING
 ↓
INDEXING
 ↓
READY
```

The user clicks:

```text
[ Detect Risks ]
```

Service 4 receives the shared document context.

It identifies:

```text
Document Type:
Employment Agreement
```

It analyzes relevant clauses.

It finds:

```text
Clause 9.1
Automatic Renewal

Clause 11.3
Termination Penalty

Clause 14.2
Unlimited Liability
```

It evaluates each potential concern.

Then produces:

```text
2 High Risks
4 Medium Risks
3 Attention Areas
```

The frontend displays structured risk cards.

The user clicks:

```text
[ View Source ]
```

The application opens the relevant page.

The user then asks:

```text
"Explain the high-risk clauses in Tamil."
```

The Document Q&A + Simplification + Language capabilities work together.

The final response is grounded in the same document.

---

# 52. RELATIONSHIP WITH OTHER SERVICES

Service 4 should reuse other project capabilities.

## Service 1 — Understanding

Provides:

- Document type
- Structure
- Parties
- Sections
- Clauses

↓

Service 4 uses this information.

## Service 2 — Summarization

Can provide a high-level document understanding.

↓

Service 4 focuses specifically on potential risks.

## Service 3 — Key Information Extraction

Provides:

- Obligations
- Deadlines
- Penalties
- Payment terms
- Termination
- Liability

↓

Service 4 can use these extracted elements as risk-analysis inputs.

## Service 5 — Multilingual Simplification

Can simplify risk explanations and present them in regional languages.

## Service 6 — Document Q&A

Allows the user to ask follow-up questions about detected risks.

## Service 7 — Judgment Understanding

May support risk/concern analysis for relevant court documents where appropriate.

## Service 8 — Voice Assistant

Allows the user to ask questions about detected risks using regional-language voice.

---

# 53. SERVICE 4 ARCHITECTURE

```text
                     USER
                       │
                       ↓
              LEGAL AI WORKSPACE
                       │
                       ↓
              [ DETECT RISKS ]
                       │
                       ↓
                REACT FRONTEND
                       │
                       ↓
                FASTAPI BACKEND
                       │
                       ↓
             SERVICE 4 — RISK
                DETECTION
                       │
                       ↓
             SHARED DOCUMENT
                 CONTEXT
                       │
                       ↓
          RELEVANT CLAUSE RETRIEVAL
                       │
                       ↓
                AI GATEWAY
                 /       \
                /         \
        MOCK PROVIDER    REAL AI
             │              │
             ↓              ↓
       JSON FIXTURE      AI MODEL
                \         /
                 \       /
                  ↓     ↓
             STRUCTURED
             RISK OUTPUT
                    │
                    ↓
             SOURCE VALIDATION
                    │
                    ↓
                FRONTEND
                    │
          ┌─────────┼─────────┐
          ↓         ↓         ↓
       Risk Cards Source    Chat
```

---

# 54. DEMO MODE VS PRODUCTION MODE

## DEMO MODE

```text
Deterministic
Fixture based
Predictable
Limited documents
Simulated processing
Controlled outputs
```

The SIH demonstration should use realistic document-specific fixtures.

## PRODUCTION MODE

```text
Real document processing
Real OCR
Real retrieval
Real AI
Real multilingual generation
Real source validation
Real evaluation
Strong security
Monitoring
```

The frontend architecture should remain unchanged.

---

# 55. SECURITY

Service 4 must follow the project's security architecture.

The frontend must never directly access:

- Database
- AI provider
- Vector database
- File system

The frontend communicates only through backend APIs.

The backend verifies:

- User authentication
- Document ownership/access
- Document permissions
- Request validity

Sensitive documents must be handled securely.

---

# 56. AUDITABILITY

Important Service 4 operations can be recorded through the shared audit system.

Possible audit event:

```json
{
  "event": "risk_analysis_requested",
  "document_id": "DOC-001",
  "service": "legal_risk_detection",
  "timestamp": "..."
}
```

Do not create unnecessary independent audit infrastructure for Service 4.

Use the shared platform capability.

---

# 57. PERFORMANCE

Service 4 should reuse previously processed document information.

Do NOT repeat:

```text
OCR
Text extraction
Document parsing
Structure extraction
```

for every risk-analysis request.

Instead:

```text
PROCESS DOCUMENT ONCE
        ↓
STORE SHARED CONTEXT
        ↓
REUSE CONTEXT
```

This improves performance and consistency.

---

# 58. QUALITY REQUIREMENTS

Service 4 is complete only when it has:

- Input contract
- Output contract
- Risk-analysis logic
- Error handling
- Loading state
- Empty state
- Source/evidence
- Validation
- Security consideration
- Frontend rendering
- Backend implementation
- Mock/demo support
- Test case
- Acceptance criteria

---

# 59. TEST CASES

## Test 1 — Unlimited Liability

Input:

```text
Clause contains broad liability without
a clearly defined maximum.
```

Expected:

```text
Risk:
Unlimited Liability

Severity:
High or appropriate severity

Source:
Correct clause/page
```

## Test 2 — Automatic Renewal

Input:

```text
Agreement automatically renews unless
notice is given within a specified period.
```

Expected:

```text
Risk:
Automatic Renewal

Source:
Correct clause/page
```

## Test 3 — Ambiguous Clause

Input:

```text
Clause contains unclear wording.
```

Expected:

```text
Risk:
Ambiguous Wording

Severity:
Appropriate level

Explanation:
Clear explanation of why the wording may
require clarification.
```

## Test 4 — No Significant Risk

Expected:

```text
No significant potential risks were identified
from the available document content.

This does not guarantee that the document is risk-free.
```

## Test 5 — Missing Evidence

If the system cannot verify the source:

```text
The potential concern could not be reliably
linked to a specific source in the document.
```

The system should not invent a page number.

---

# 60. ACCEPTANCE CRITERIA

## Functional

- User can select Detect Risks.
- Backend receives the document ID.
- Service loads shared document context.
- Relevant clauses are analyzed.
- Potential risks are identified.
- Risks receive categories.
- Risks receive severity.
- Risks contain explanations.
- Risks contain why-it-matters information.
- Risks contain source information whenever available.
- Risks contain suggested considerations.

## UI

- Risk overview is visible.
- Risk cards are visible.
- Severity is visually distinguishable.
- User can view source.
- User can request simple explanation.
- User can change language.
- User can continue with document chat.

## Safety

- No unsupported legal conclusions.
- No claims that a clause is definitely illegal.
- No fabricated sources.
- No fabricated clauses.
- Uncertainty is communicated.

## Architecture

- Uses shared document context.
- Uses AI Gateway.
- Supports Mock Provider.
- Can support Real AI Provider.
- Frontend does not directly access AI or database.
- Business logic remains in backend/service layer.

---

# 61. FINAL SERVICE 4 OUTPUT MODEL

The conceptual output is:

```text
LEGAL RISK DETECTION RESULT

Document
    ↓
Risk Overview
    ↓
Risk List
    ↓
For each risk:

    Risk Title
        ↓
    Risk Category
        ↓
    Severity
        ↓
    Explanation
        ↓
    Why It Matters
        ↓
    Relevant Clause
        ↓
    Page / Section
        ↓
    Source Evidence
        ↓
    Suggested Consideration
```

---

# 62. FINAL BUSINESS LOGIC

The complete business logic of Service 4 can be summarized as:

```text
UPLOAD LEGAL DOCUMENT
        ↓
USE SHARED DOCUMENT CONTEXT
        ↓
IDENTIFY DOCUMENT TYPE
        ↓
IDENTIFY RELEVANT CLAUSES
        ↓
ANALYZE CLAUSES
        ↓
FIND POTENTIAL RISK PATTERNS
        ↓
CLASSIFY RISK
        ↓
ASSIGN SEVERITY
        ↓
EXPLAIN THE POTENTIAL RISK
        ↓
EXPLAIN WHY IT MATTERS
        ↓
LINK TO SOURCE
        ↓
GENERATE SUGGESTED CONSIDERATION
        ↓
VALIDATE EVIDENCE
        ↓
RETURN STRUCTURED JSON
        ↓
RENDER RISK CARDS
        ↓
USER CAN VIEW SOURCE
        ↓
USER CAN SIMPLIFY
        ↓
USER CAN CHANGE LANGUAGE
        ↓
USER CAN ASK FOLLOW-UP QUESTIONS
```

---

# 63. ONE-LINE SERVICE DEFINITION

> **Service 4 — Legal Risk Detection identifies potentially risky, restrictive, unfavorable, or important clauses in a legal document, explains why they may matter, provides source evidence, and presents the findings in a clear, legally cautious, user-friendly format.**

---

# 64. CORE PRINCIPLE

Service 4 should always follow:

```text
DOCUMENT
   ↓
UNDERSTAND
   ↓
IDENTIFY POTENTIAL RISK
   ↓
EXPLAIN
   ↓
SHOW EVIDENCE
   ↓
LET USER VERIFY
```

It should never become:

```text
DOCUMENT
   ↓
AI GUESS
   ↓
"THIS IS ILLEGAL"
```

The goal is **risk awareness and understanding**, not unsupported legal judgment.

---

# 65. SERVICE 4 IN THE OVERALL PROJECT

The complete product remains:

```text
UPLOAD
   ↓
UNDERSTAND
   ↓
EXTRACT
   ↓
SUMMARIZE
   ↓
SIMPLIFY
   ↓
TRANSLATE
   ↓
DETECT RISKS
   ↓
ASK
   ↓
VERIFY
```

Service 4 strengthens the project's contract-understanding capability while remaining part of the same unified:

**AI-Driven Multilingual Legal Document Simplifier**

and not a separate legal-risk application.
