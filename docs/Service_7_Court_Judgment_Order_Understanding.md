# SERVICE 7 — COURT JUDGMENT & ORDER UNDERSTANDING

## 1. Service Overview

**Service Name:** Court Judgment & Order Understanding

**Service Number:** 7

**Purpose:**  
Service 7 is a specialized legal-document workflow for understanding court judgments and court orders. It converts a long and complex judgment into a structured explanation that a normal user can understand without reading every page first.

The service is specifically aligned with the project's official problem statement and focuses on court judgments and orders.

### Supported document examples

- Supreme Court judgments
- High Court judgments
- Court orders
- Bail orders
- Civil orders
- Criminal orders
- Family matters
- Commercial matters

---

## 2. Main Objective

The service should answer the user's core questions about a judgment:

- What is this case about?
- Who are the parties?
- What happened?
- What were the important facts?
- What legal issues did the court consider?
- What did each party argue?
- Which laws or sections were involved?
- Which precedents were considered?
- What reasoning did the court use?
- What did the court decide?
- What is the final order?
- What is the final outcome?
- Can this be explained in simple language?
- Where in the judgment is the information found?

The service is designed for **understanding**, not for replacing a lawyer or providing guaranteed legal advice.

---

# 3. User Journey

The user flow is:

```text
USER
  ↓
UPLOAD COURT JUDGMENT / ORDER
  ↓
DOCUMENT VALIDATION
  ↓
DOCUMENT TYPE DETECTION
  ↓
TEXT EXTRACTION
  ↓
OCR IF REQUIRED
  ↓
PAGE / STRUCTURE EXTRACTION
  ↓
DOCUMENT CONTEXT
  ↓
JUDGMENT UNDERSTANDING
  ↓
STRUCTURED RESULT
  ↓
SOURCE / PAGE EVIDENCE
  ↓
USER CAN ASK FOLLOW-UP QUESTIONS
```

The service operates inside the same Legal AI Workspace. It should not become a separate standalone legal application.

---

# 4. Service Selection — User View

After the document becomes ready, the user can see the primary service actions.

For a judgment, the interface can prioritize:

```text
[ Understand Document ]

[ Summarize ]

[ Extract Key Information ]

[ Simplify & Translate ]

[ Ask Document ]

[ Understand Judgment ]

[ Voice Assistant ]
```

The user selects:

**Understand Judgment**

The system then starts Service 7.

---

# 5. Service 7 Initial Screen

The service should appear approximately as:

```text
┌──────────────────────────────────────────────────────┐
│ ⚖️ Court Judgment & Order Understanding              │
│                                                      │
│ Understand the case, legal issues, arguments,        │
│ court reasoning, decision and final order.           │
│                                                      │
│ Document: ABC vs XYZ Judgment                        │
│ Type: High Court Judgment                            │
│                                                      │
│             [ Understand Judgment ]                  │
└──────────────────────────────────────────────────────┘
```

The interface should remain simple and focused.

---

# 6. Processing State

After the user selects the service:

```text
Understanding your judgment...

✓ Document identified
✓ Pages processed
✓ Case information extracted
✓ Facts identified
✓ Legal issues identified
✓ Arguments analyzed
✓ Laws and precedents identified
✓ Court reasoning analyzed
✓ Decision identified
✓ Final order identified

Preparing your explanation...
```

Possible states:

```text
IDLE
  ↓
PROCESSING
  ↓
ANALYZING
  ↓
GENERATING
  ↓
VALIDATING SOURCES
  ↓
READY
```

If processing fails:

```text
⚠️ Unable to understand this judgment

Some information could not be reliably extracted
from the uploaded document.

[ Try Again ]
```

---

# 7. Main Answer — User View

The final result should be structured instead of being one large paragraph.

Recommended structure:

```text
⚖️ JUDGMENT UNDERSTANDING

1. Quick Understanding
2. Case Overview
3. Facts of the Case
4. Legal Issues
5. Parties' Arguments
6. Laws & Precedents
7. Court's Reasoning
8. Court Decision
9. Final Order / Outcome
10. Simple Explanation
11. Sources / Evidence
12. Follow-up Actions
```

---

# 8. Quick Understanding

This is the first section the user should see.

Example:

```text
🟢 QUICK UNDERSTANDING

This case concerns a dispute between ABC and XYZ
regarding __________.

The court considered whether __________.

The court ultimately decided that __________.

FINAL OUTCOME:
The petition was dismissed.
```

The purpose is to give the user a fast understanding before they explore the detailed sections.

---

# 9. Case Overview

Display important case metadata.

```text
📋 CASE OVERVIEW

Case Name:
ABC vs XYZ

Court:
High Court of Madras

Case Number:
XXXX / 2026

Judgment Date:
12 September 2026

Judges:
Justice A
Justice B

Document Type:
Court Judgment
```

Only information actually found in the uploaded document should be presented.

If a field is unavailable:

```text
Not found in the uploaded document.
```

Do not invent missing information.

---

# 10. Facts of the Case

The system explains the factual background.

```text
📌 FACTS OF THE CASE

What happened?

The dispute began when __________.

The petitioner stated that __________.

The respondent stated that __________.

Important events:

• Event 1
• Event 2
• Event 3

SOURCE
Page 2–5
```

The facts should be summarized rather than copied unnecessarily.

The system should distinguish factual statements from arguments.

---

# 11. Legal Issues

The service identifies the questions that the court needed to decide.

```text
⚖️ LEGAL ISSUES

The main issues considered by the court were:

1. Whether __________?
2. Whether __________?
3. Whether __________?

In simple language:

The court mainly had to decide whether __________.
```

This section must not confuse an argument with an issue.

---

# 12. Parties' Arguments

The service should separate the arguments of the different parties.

```text
👤 PETITIONER / APPELLANT

Main arguments:

• __________
• __________
• __________


👤 RESPONDENT

Main arguments:

• __________
• __________
• __________
```

If multiple parties exist, the system should create separate sections where appropriate.

Important:

The AI must not present a party's argument as the court's finding.

---

# 13. Laws & Precedents

The system extracts laws, sections, rules and precedents mentioned in the judgment.

```text
📚 LAWS & PRECEDENTS

Laws / Acts:

• __________
• __________

Sections:

• Section __________
• Section __________

Precedents:

• Case A
• Case B

Why they were relevant:

The court referred to these authorities while considering
__________.

SOURCE
Pages 10–14
```

The service should clearly distinguish:

```text
LAW MENTIONED IN THE JUDGMENT
```

from:

```text
GENERAL LEGAL KNOWLEDGE
```

The uploaded judgment remains the primary source for document-specific understanding.

---

# 14. Court's Reasoning

This is one of the most important sections.

```text
🧠 COURT'S REASONING

The court considered:

1. __________
2. __________
3. __________

The court found that __________.

The court explained that __________.

Therefore, the court concluded that __________.
```

The objective is not simply to state the result.

The service must explain the reasoning path:

```text
FACTS
  ↓
LEGAL ISSUE
  ↓
LAW / PRECEDENT
  ↓
COURT'S ANALYSIS
  ↓
CONCLUSION
```

---

# 15. Court Decision

The final decision should be clearly separated.

```text
⚖️ COURT DECISION

The court decided that:

__________.

In simple language:

The court basically decided that __________.
```

This section should represent the court's actual decision as supported by the document.

---

# 16. Final Order / Outcome

The final order should receive strong visual emphasis.

```text
🏛️ FINAL ORDER / OUTCOME

The court ordered:

• __________
• __________
• __________

FINAL OUTCOME:

Petition dismissed.

SOURCE:
Page 18
```

If the order contains multiple directions, show each direction separately.

---

# 17. Simple Explanation

Service 7 should work together with the project's simplification capability.

Example:

```text
💡 SIMPLE EXPLANATION

In simple English:

The case was about __________.

The court looked at __________.

After considering the arguments and applicable law,
the court decided __________.

This means __________.
```

The simplification must preserve the legal meaning.

It should not merely shorten the judgment.

---

# 18. Regional Language Explanation

The user can select a supported Indian language.

```text
LANGUAGE

[ English ▼ ]
```

Possible options:

- English
- Tamil
- Hindi
- Telugu
- Malayalam
- Kannada
- Bengali
- Marathi
- Other languages as implementation permits

Example:

```text
தமிழில் எளிய விளக்கம்

இந்த வழக்கு __________ பற்றியது.

நீதிமன்றம் __________ என்பதை பரிசீலித்தது.

இறுதியாக நீதிமன்றம் __________ என்று தீர்மானித்தது.
```

The intended pipeline is:

```text
COMPLEX JUDGMENT
      ↓
LEGAL MEANING
      ↓
PLAIN-LANGUAGE MEANING
      ↓
REGIONAL LANGUAGE
      ↓
SIMPLE REGIONAL-LANGUAGE EXPLANATION
```

---

# 19. Source / Evidence

Each important AI-generated conclusion should be traceable where possible.

Example:

```text
🔎 SOURCE

Statement:
"The petition was dismissed."

Document:
ABC Judgment

Page:
18

Section:
Final Order

[ View Page ]
[ Highlight Source ]
```

Possible evidence fields:

- Document ID
- Page number
- Section
- Paragraph
- Source chunk
- Citation
- Relevant source text
- Grounding information where appropriate

---

# 20. Source Interaction

When the user clicks a source:

```text
AI ANSWER
   ↓
SOURCE REFERENCE
   ↓
PAGE 18
   ↓
ORIGINAL JUDGMENT
   ↓
HIGHLIGHTED RELEVANT TEXT
```

This allows the user to verify the AI answer against the original document.

---

# 21. Follow-up Actions

At the bottom of the Service 7 result:

```text
What would you like to do next?

[ Summarize Judgment ]

[ Simplify Judgment ]

[ Explain in Tamil ]

[ Explain in Hindi ]

[ Ask a Question ]

[ Find Important Sections ]

[ View Sources ]

[ 🎤 Ask by Voice ]
```

These actions should continue using the same uploaded document context.

---

# 22. Document Q&A Integration

Service 7 should connect naturally with Service 6.

Example:

User asks:

```text
What did the court finally decide?
```

System uses:

```text
Document Context
       ↓
Relevant Judgment Sections
       ↓
Decision / Final Order
       ↓
Grounded Answer
       ↓
Source
```

Answer:

```text
The court dismissed the petition.

SOURCE:
Page 18 — Final Order
```

If the information cannot be found:

```text
I could not find this information in the uploaded
judgment.
```

The system must not invent an answer.

---

# 23. How the Service 7 Answer Is Obtained

The answer is obtained through the shared document-processing architecture.

## Step 1 — Upload

The user uploads a judgment or court order.

## Step 2 — Validation

Check:

- File type
- File readability
- File size
- Whether the document contains usable content
- Whether the document can be processed

## Step 3 — Document Type Detection

Determine whether the document is likely to be:

- Judgment
- Court order
- Bail order
- Civil order
- Criminal order
- Family matter
- Commercial matter
- Other legal document

Service 7 should be activated or prioritized when the document is a judgment/order.

## Step 4 — Text Extraction

Extract the text from the document.

If usable text exists:

```text
PDF
 ↓
Native Text Extraction
```

If the document is scanned:

```text
Scanned PDF
 ↓
OCR
 ↓
Extracted Text
```

OCR should be conditional rather than automatically applied to every document.

## Step 5 — Page and Structure Extraction

Preserve:

- Page numbers
- Headings
- Paragraphs
- Sections
- Legal references
- Important structural information

## Step 6 — Chunking

Break the document into meaningful chunks while retaining page/source metadata.

Example:

```text
Chunk 01 → Pages 1–2
Chunk 02 → Pages 3–4
Chunk 03 → Pages 5–6
...
```

## Step 7 — Shared Document Context

Create/reuse the shared context containing:

```text
Document ID
Document type
Language
Pages
Extracted text
Sections
Entities
Chunks
Metadata
Sources
Citations
Relevant retrieved content
```

## Step 8 — Judgment Analysis

The Service 7 logic analyzes:

```text
CASE
 ↓
FACTS
 ↓
LEGAL ISSUES
 ↓
PARTIES' ARGUMENTS
 ↓
LAW / PRECEDENTS
 ↓
COURT REASONING
 ↓
DECISION
 ↓
FINAL ORDER / OUTCOME
```

## Step 9 — Structured Generation

The AI/service produces structured output instead of a large free-form response.

## Step 10 — Source Validation

Each important output should be connected to available document evidence.

## Step 11 — Frontend Rendering

The frontend converts the structured result into:

- Cards
- Sections
- Tabs
- Evidence references
- Page links
- Simple explanations
- Language controls

---

# 24. Working Logic of Service 7

The core logic is:

```text
INPUT:
Court Judgment / Court Order

        ↓

DOCUMENT UNDERSTANDING

        ↓

IDENTIFY CASE INFORMATION

        ↓

IDENTIFY FACTS

        ↓

IDENTIFY LEGAL ISSUES

        ↓

IDENTIFY PARTY ARGUMENTS

        ↓

IDENTIFY LAWS / SECTIONS / PRECEDENTS

        ↓

UNDERSTAND COURT REASONING

        ↓

IDENTIFY DECISION

        ↓

IDENTIFY FINAL ORDER

        ↓

IDENTIFY OUTCOME

        ↓

CONNECT EACH RESULT TO SOURCE

        ↓

GENERATE STRUCTURED RESPONSE

        ↓

DISPLAY TO USER
```

---

# 25. Business Logic of Service 7

## Input

```json
{
  "document_id": "document-001",
  "service": "judgment_understanding",
  "language": "en"
}
```

## Internal Processing

```text
document_id
      ↓
retrieve document context
      ↓
verify document type
      ↓
retrieve relevant judgment content
      ↓
run judgment-understanding service
      ↓
generate structured output
      ↓
validate sources
      ↓
return response
```

## Output

Conceptually:

```json
{
  "service": "judgment_understanding",
  "document_type": "court_judgment",
  "case_overview": {},
  "quick_understanding": "",
  "facts": [],
  "legal_issues": [],
  "arguments": [],
  "laws_and_precedents": [],
  "court_reasoning": [],
  "decision": "",
  "final_order": [],
  "outcome": "",
  "simple_explanation": "",
  "sources": []
}
```

The exact API schema should remain consistent with the project's existing API standards.

---

# 26. Suggested Structured Output Model

```json
{
  "title": "Judgment Understanding",
  "document_type": "High Court Judgment",

  "case_overview": {
    "case_name": "",
    "court": "",
    "case_number": "",
    "judgment_date": "",
    "judges": []
  },

  "quick_understanding": "",

  "facts": [
    {
      "point": "",
      "source": {
        "page": 0,
        "section": ""
      }
    }
  ],

  "legal_issues": [
    {
      "issue": "",
      "simple_explanation": "",
      "source": {}
    }
  ],

  "arguments": {
    "petitioner": [],
    "respondent": []
  },

  "laws_and_precedents": [],

  "court_reasoning": [
    {
      "point": "",
      "source": {}
    }
  ],

  "decision": "",

  "final_order": [],

  "outcome": "",

  "simple_explanation": "",

  "sources": []
}
```

---

# 27. AI Prompt Logic

The Service 7 AI prompt should instruct the model to:

```text
1. Analyze only the supplied judgment/document context
   for document-specific facts.

2. Identify the case structure.

3. Extract the relevant facts.

4. Identify the legal issues considered by the court.

5. Separate party arguments from court findings.

6. Identify laws, sections and precedents actually
   mentioned in the document.

7. Explain the court's reasoning.

8. Identify the court's decision.

9. Identify the final order and outcome.

10. Preserve the legal meaning.

11. Do not invent missing information.

12. Provide source/page references where available.

13. Clearly communicate uncertainty when evidence
    is insufficient.

14. Use simple language when generating explanations.

15. Respect the selected regional language.

16. Do not claim to be a lawyer.

17. Do not guarantee legal outcomes.
```

---

# 28. Important Separation Rules

Service 7 must distinguish:

```text
FACT
≠
PARTY ARGUMENT
≠
COURT REASONING
≠
COURT DECISION
≠
FINAL ORDER
```

For example:

```text
Petitioner argued:
"__________"

Court found:
"__________"
```

The AI must never turn the petitioner's statement into a court finding.

---

# 29. Hallucination Prevention

If information is not available:

```text
I could not find this information in the uploaded
judgment.
```

If the source is unclear:

```text
The uploaded document does not provide enough
information to determine this reliably.
```

Do not:

- Invent case facts
- Invent judges
- Invent sections
- Invent precedents
- Invent decisions
- Invent final orders
- Invent page numbers
- Claim unsupported legal conclusions

---

# 30. Legal Safety

Service 7 is an explanation and understanding service.

It should:

- Explain
- Simplify
- Summarize
- Extract
- Highlight
- Help users understand judgments

It should not:

- Replace a lawyer
- Replace a judge
- Guarantee a legal outcome
- Claim unsupported legal conclusions
- State that something is definitely illegal without appropriate support
- Invent legal authorities
- Pretend that the AI has professional legal authority

For high-risk legal decisions, the interface can recommend professional/legal review where appropriate.

---

# 31. Demo Mode Logic

For the SIH MVP, Service 7 can use deterministic fixture responses.

Architecture:

```text
FRONTEND
   ↓
FASTAPI
   ↓
JUDGMENT UNDERSTANDING SERVICE
   ↓
DOCUMENT CONTEXT
   ↓
AI GATEWAY
   ↓
MOCK PROVIDER
   ↓
JUDGMENT FIXTURE
   ↓
STRUCTURED OUTPUT
   ↓
FRONTEND
```

The mock output must correspond to the selected demo document.

Do not place document-specific `if/else` logic inside API routers.

---

# 32. Fixture Structure

Recommended fixture:

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

For Service 7:

```text
judgment.json
```

should contain the document-specific judgment-understanding result.

---

# 33. Real AI Mode

The same Service 7 architecture should later support real providers.

```text
SERVICE 7
    ↓
DOCUMENT CONTEXT
    ↓
AI GATEWAY
    ↓
Gemini / OpenAI / Claude / Mistral /
Groq / Local Model
    ↓
STRUCTURED OUTPUT
    ↓
SOURCE VALIDATION
    ↓
FRONTEND
```

The frontend must not know which AI provider is being used.

---

# 34. RAG / Retrieval Logic

For long judgments, relevant sections can be retrieved.

```text
USER / SERVICE REQUEST
        ↓
QUERY / ANALYSIS TARGET
        ↓
DOCUMENT RETRIEVAL
        ↓
RELEVANT JUDGMENT CHUNKS
        ↓
AI
        ↓
STRUCTURED JUDGMENT ANALYSIS
        ↓
CITATIONS
```

For the MVP, deterministic fixture retrieval may simulate this behavior.

It should not be described as real RAG.

Future real RAG may use:

- Embeddings
- Vector database
- Semantic retrieval
- Reranking
- Context assembly
- Grounded generation

---

# 35. API Integration

The frontend communicates with the backend.

Conceptually:

```text
POST /documents/{id}/analyze
```

or a project-consistent dedicated action such as:

```text
POST /documents/{id}/judgment
```

The exact endpoint must follow the project's existing API conventions rather than creating a conflicting API design.

The frontend must never directly access:

- Database
- AI provider
- Vector database
- File system

---

# 36. Frontend Components

Recommended Service 7 components:

```text
JudgmentUnderstanding
├── JudgmentHeader
├── QuickUnderstandingCard
├── CaseOverviewCard
├── FactsSection
├── LegalIssuesSection
├── ArgumentsSection
├── LawsPrecedentsSection
├── CourtReasoningSection
├── DecisionCard
├── FinalOrderCard
├── SimpleExplanationCard
├── LanguageSelector
├── SourceEvidencePanel
├── PageReference
└── FollowUpActions
```

These should remain part of the unified Legal AI Workspace.

---

# 37. Loading State

Example:

```text
⚖️ Understanding Judgment

Analyzing the court document...

[████████████░░░░░░]

Identifying:
✓ Case information
✓ Facts
✓ Issues
✓ Arguments

Currently analyzing:
Court reasoning...
```

---

# 38. Empty State

If there is no judgment/order content:

```text
⚖️ Judgment Understanding

No suitable court judgment or order was found
in the uploaded document.

Please upload a supported court document.
```

---

# 39. Error State

Example:

```text
⚠️ Something went wrong

We could not reliably analyze this judgment.

Possible reasons:
• The document is unreadable.
• The document contains insufficient text.
• OCR could not extract the content.
• The document may not be a supported judgment/order.

[ Try Again ]
```

---

# 40. Unsupported Document Handling

Service 7 should not assume every uploaded document is a judgment.

If the user uploads a contract:

```text
This document appears to be a contract rather than
a court judgment or order.

You may want to use:

[ Summarize ]
[ Extract Key Information ]
[ Detect Risks ]
[ Simplify & Translate ]
[ Ask Document ]
```

This maintains the project's requirement that the system should not assume every document is a judgment.

---

# 41. Security Considerations

Service 7 should respect the common platform security architecture.

Important considerations:

- Authenticate the user.
- Authorize access to the workspace/document.
- Do not expose documents across users.
- Protect uploaded documents.
- Protect extracted legal text.
- Do not expose AI provider credentials to the frontend.
- Log important analysis events where required.
- Maintain audit information where appropriate.
- Respect privacy for private documents.
- Preserve provenance for public court documents.

---

# 42. Performance Considerations

For long judgments:

```text
Upload
 ↓
Background processing
 ↓
Text extraction
 ↓
Structure extraction
 ↓
Indexing
 ↓
Ready
```

The frontend should receive processing status instead of blocking indefinitely.

Long-document analysis can use background jobs where appropriate.

---

# 43. Language Handling

The judgment may be written in:

- English
- Tamil
- Hindi
- Telugu
- Malayalam
- Kannada
- Other supported Indian languages

The service should first understand the document and then generate the requested explanation.

Preferred conceptual flow:

```text
ORIGINAL JUDGMENT
      ↓
UNDERSTAND LEGAL CONTENT
      ↓
STRUCTURED JUDGMENT ANALYSIS
      ↓
PLAIN-LANGUAGE EXPLANATION
      ↓
SELECTED LANGUAGE
```

Do not use word-for-word translation as the primary judgment-understanding mechanism.

---

# 44. Evidence Model

A source object can conceptually contain:

```json
{
  "document_id": "document-001",
  "page": 18,
  "section": "Final Order",
  "source_text": "..."
}
```

Possible evidence hierarchy:

```text
Document
  ↓
Page
  ↓
Section
  ↓
Paragraph / Chunk
  ↓
Relevant Source Text
```

---

# 45. Acceptance Criteria

Service 7 is complete only when:

### Functional

- [ ] User can select Understand Judgment.
- [ ] Judgment/order is analyzed.
- [ ] Case overview is displayed.
- [ ] Facts are displayed.
- [ ] Legal issues are displayed.
- [ ] Arguments are separated by party.
- [ ] Laws/sections are displayed.
- [ ] Precedents are displayed when present.
- [ ] Court reasoning is displayed.
- [ ] Decision is displayed.
- [ ] Final order/outcome is displayed.
- [ ] Simple explanation is available.
- [ ] Sources are displayed where available.
- [ ] User can continue with Q&A.

### Safety

- [ ] No unsupported facts are invented.
- [ ] Missing information is clearly stated.
- [ ] Party arguments are not presented as court findings.
- [ ] Legal conclusions are not overstated.
- [ ] The system does not claim to replace a lawyer.

### UX

- [ ] Loading state exists.
- [ ] Error state exists.
- [ ] Empty state exists.
- [ ] Unsupported-document state exists.
- [ ] Results are structured.
- [ ] Page/source references are clickable where implemented.
- [ ] Language selection works with the shared language capability.

### Architecture

- [ ] Uses shared document context.
- [ ] Uses AI Gateway.
- [ ] Does not hard-code an AI provider.
- [ ] Uses the common document-processing pipeline.
- [ ] Supports deterministic demo mode.
- [ ] Mock fixture matches the selected document.
- [ ] Frontend does not directly access database or AI provider.

---

# 46. Testing

Test Service 7 using:

### Test 1 — Normal Judgment

Input:

```text
Valid High Court Judgment
```

Expected:

```text
Case overview
Facts
Issues
Arguments
Law
Reasoning
Decision
Final order
Sources
```

### Test 2 — Court Order

Input:

```text
Valid Court Order
```

Expected:

Service 7 provides an order-focused understanding.

### Test 3 — Scanned Judgment

Input:

```text
Scanned PDF
```

Expected:

```text
OCR
 ↓
Text extraction
 ↓
Judgment understanding
```

### Test 4 — Missing Information

Expected:

```text
Not found in the uploaded document.
```

rather than invented content.

### Test 5 — Contract Uploaded

Expected:

Service 7 identifies that the document is not a judgment/order and suggests relevant services.

### Test 6 — Source Verification

Clicking a source should navigate to the relevant document page/section when supported.

### Test 7 — Regional Language

Request:

```text
Explain the judgment in Tamil.
```

Expected:

A simple Tamil explanation that preserves the legal meaning.

---

# 47. Golden Test Dataset

The project should maintain controlled test documents.

For Service 7, include:

- Supreme Court judgment
- High Court judgment
- Court order
- Bail order
- Civil order
- Criminal order
- Family-related order
- Commercial judgment
- Scanned judgment

Expected outputs should define:

```text
Case information
Facts
Issues
Arguments
Acts
Sections
Precedents
Court reasoning
Decision
Final order
Sources
```

---

# 48. What Service 7 Must NOT Become

Service 7 must not become:

- A generic chatbot
- A general legal search engine
- A generic PDF summarizer
- A lawyer replacement
- A legal prediction engine
- An independent legal advice system
- A general-purpose court database

It is specifically:

> **A specialized workflow for understanding court judgments and orders.**

---

# 49. Relationship With Other Services

Service 7 works together with the other seven services.

```text
SERVICE 1
Legal Document Understanding
        ↓
SERVICE 7
Court Judgment & Order Understanding
        ↓
SERVICE 2
Summarization
        ↓
SERVICE 3
Key Information Extraction
        ↓
SERVICE 5
Multilingual Simplification
        ↓
SERVICE 6
Document Q&A
        ↓
SERVICE 8
Voice Assistant
```

Service 7 should reuse shared document context rather than creating a separate document-processing pipeline.

---

# 50. End-to-End Example

User uploads:

```text
50-page High Court Judgment
```

System:

```text
UPLOAD
 ↓
VALIDATE
 ↓
TEXT EXTRACTION
 ↓
OCR IF REQUIRED
 ↓
PAGE STRUCTURE
 ↓
DOCUMENT CONTEXT
 ↓
JUDGMENT ANALYSIS
```

The user sees:

```text
⚖️ Judgment Understanding

Quick Understanding
↓
Case Overview
↓
Facts
↓
Legal Issues
↓
Arguments
↓
Laws & Precedents
↓
Court Reasoning
↓
Decision
↓
Final Order
↓
Simple Explanation
↓
Sources
```

The user then asks:

```text
What did the court finally decide?
```

The system retrieves the relevant final-order content and returns:

```text
The court dismissed the petition.

📄 Source:
Page 18 — Final Order

[View Source]
```

The user then selects:

```text
Tamil
```

The system produces a simple Tamil explanation based on the same grounded judgment context.

---

# 51. Final Business Logic

The complete business logic is:

```text
                    USER
                      │
                      ▼
              UPLOAD JUDGMENT
                      │
                      ▼
               DOCUMENT SERVICE
                      │
             ┌────────┴────────┐
             ▼                 ▼
        TEXT EXISTS?        SCANNED?
             │                 │
             ▼                 ▼
      TEXT EXTRACTION          OCR
             │                 │
             └────────┬────────┘
                      ▼
             PAGE / STRUCTURE
                      │
                      ▼
             SHARED DOCUMENT
                  CONTEXT
                      │
                      ▼
             JUDGMENT SERVICE
                      │
       ┌──────────────┼───────────────┐
       ▼              ▼               ▼
     FACTS          ISSUES         ARGUMENTS
       │              │               │
       └──────────────┼───────────────┘
                      ▼
              LAWS / PRECEDENTS
                      │
                      ▼
              COURT REASONING
                      │
                      ▼
                  DECISION
                      │
                      ▼
               FINAL ORDER
                      │
                      ▼
                  OUTCOME
                      │
                      ▼
              SOURCE VALIDATION
                      │
                      ▼
             STRUCTURED OUTPUT
                      │
                      ▼
              FRONTEND RESULT
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       SIMPLE       LANGUAGE      Q&A
     EXPLANATION    SELECTOR
```

---

# 52. Final Definition of Service 7

**Service 7 — Court Judgment & Order Understanding** is the specialized component of the AI-Driven Multilingual Legal Document Simplifier that transforms a complex court judgment or order into a structured understanding of:

```text
CASE
→ FACTS
→ LEGAL ISSUES
→ PARTIES' ARGUMENTS
→ LAW / PRECEDENTS
→ COURT REASONING
→ DECISION
→ FINAL ORDER
→ OUTCOME
→ SIMPLE EXPLANATION
→ SOURCE EVIDENCE
```

Its central promise is:

> **“Understand what happened in the case, what questions the court considered, why the court decided the way it did, and what the final order means — in simple language and with evidence from the judgment.”**

It must remain document-grounded, multilingual-ready, source-traceable, legally cautious, provider-independent, and integrated into the project's single ChatGPT-like Legal AI Workspace.
