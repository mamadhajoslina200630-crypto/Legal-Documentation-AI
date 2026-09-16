# SERVICE 2 — LEGAL DOCUMENT SUMMARIZATION

## AI-Driven Multilingual Legal Document Simplifier

**Project ID:** JEC-SIH2026-027  
**Service Number:** 2  
**Service Name:** Legal Document Summarization  
**Category:** Software  
**Domain:** GovTech & NLP

---

# 1. SERVICE OVERVIEW

## 1.1 Purpose

Legal Document Summarization is one of the primary services of the AI-Driven Multilingual Legal Document Simplifier.

The purpose of this service is to convert a long and complex legal document into a concise, structured, and legally meaningful summary.

The service should help a normal user understand the important contents of a legal document without requiring them to read and understand the entire original document.

The summary must remain faithful to the original document.

The service must never invent facts, decisions, clauses, dates, parties, legal provisions, or other information that is not supported by the document.

---

# 2. POSITION OF SERVICE 2 IN THE PROJECT

The overall product workflow is:

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
DOCUMENT Q&A
        ↓
SOURCE / PAGE EVIDENCE
```

Service 2 performs the **LEGAL SUMMARY** stage.

It uses the common document-processing and document-context infrastructure rather than creating a separate document-processing pipeline.

---

# 3. SERVICE 2 OBJECTIVE

The service should answer the user's basic question:

> "What is this legal document about, and what are the most important things I need to know?"

The answer should be:

- Concise
- Structured
- Easy to understand
- Legally meaningful
- Faithful to the source
- Document-grounded
- Evidence-supported where possible
- Appropriate for the document type

The service is NOT simply a generic text summarizer.

It is a legal-document-specific summarization service.

---

# 4. SUPPORTED DOCUMENT TYPES

Service 2 can work with the legal document types supported by the project.

## Court Documents

- Supreme Court judgments
- High Court judgments
- Court orders
- Bail orders
- Civil orders
- Criminal orders
- Family matters
- Commercial matters

## Contracts

- Employment agreements
- Lease agreements
- NDAs
- Service agreements
- Sale agreements
- Partnership agreements

## Notices

- Legal notices
- Demand notices
- Termination notices
- Consumer/property-related notices

## Other Legal Documents

Other legal documents may also be summarized where the document-processing pipeline can successfully understand their structure.

---

# 5. HOW THE USER ACCESSES SERVICE 2

After uploading a legal document, the user sees the Legal AI Workspace.

Example:

```text
┌────────────────────────────────────────────────────────────┐
│                 LEGAL AI WORKSPACE                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  DOCUMENT                                                  │
│  Employment_Agreement.pdf                                  │
│  18 Pages                                                  │
│                                                            │
│  SERVICES                                                  │
│                                                            │
│  [ Understand Document ]                                   │
│  [ Summarize ]                                             │
│  [ Extract Key Information ]                               │
│  [ Detect Risks ]                                          │
│  [ Simplify & Translate ]                                  │
│  [ Ask Document ]                                          │
│  [ Understand Judgment ]                                   │
│  [ Voice Assistant ]                                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

The user selects:

```text
[ SUMMARIZE ]
```

The frontend sends the document request to the backend.

The backend executes Service 2.

The structured summary is returned and displayed inside the same Legal AI Workspace.

---

# 6. USER-VISIBLE ANSWER

The service should NOT display one giant paragraph.

The answer should be displayed as structured sections/cards.

General output:

```text
╔════════════════════════════════════════════════════════════╗
║                 LEGAL DOCUMENT SUMMARY                    ║
╚════════════════════════════════════════════════════════════╝

📌 TL;DR

Short explanation of the entire document in simple language.


📋 DOCUMENT OVERVIEW

Document Type:
Parties:
Date:
Purpose:


⭐ KEY POINTS

• Important point 1
• Important point 2
• Important point 3
• Important point 4


📖 MAIN CONTENT

Facts / Background:
...

Important Terms:
...

Responsibilities:
...

Important Conditions:
...


⚖️ LEGAL INFORMATION

Laws / Sections:
...

Legal Issues:
...


✅ FINAL DECISION / OUTCOME

...


📍 SOURCES

Page 3 — Section/Clause 4
Page 7 — Section/Clause 12


💬 ASK ABOUT THIS DOCUMENT

[ Ask a follow-up question... ]
```

The exact sections displayed depend on the document type.

---

# 7. JUDGMENT SUMMARY FORMAT

For a court judgment or court order:

```text
LEGAL JUDGMENT SUMMARY

1. TL;DR

A short explanation of the case and final result.


2. CASE OVERVIEW

Court:
Case Number:
Case Title:
Date:
Parties:
Judges:


3. FACTS

Important facts and background of the case.


4. LEGAL ISSUES

The important legal questions/issues considered by the court.


5. ARGUMENTS

Petitioner's/Appellant's arguments:
...

Respondent's arguments:
...


6. LAWS / SECTIONS INVOLVED

Relevant Acts:
Relevant Sections:
Other legal references:


7. COURT REASONING

Important reasoning used by the court.


8. FINAL DECISION

What the court finally decided.


9. OUTCOME

Final result and directions given by the court.


10. IMPORTANT POINTS

Important points the user should know.


11. SOURCES

Page / Section / relevant source information.
```

---

# 8. CONTRACT SUMMARY FORMAT

For a contract:

```text
CONTRACT SUMMARY

1. TL;DR

Simple explanation of what the contract is about.


2. CONTRACT OVERVIEW

Contract Type:
Parties:
Purpose:
Effective Date:
Duration:


3. IMPORTANT TERMS

• Important term 1
• Important term 2
• Important term 3


4. FINANCIAL TERMS

Payment:
Payment Schedule:
Fees:
Other Financial Conditions:


5. RESPONSIBILITIES

Party A:
...

Party B:
...


6. TERMINATION

Termination conditions:
Notice period:
Other termination requirements:


7. PENALTIES

Penalty:
Condition:
Applicable situation:


8. IMPORTANT CONDITIONS

• Condition 1
• Condition 2
• Condition 3


9. SOURCES

Page:
Clause:
Section:
```

Service 2 summarizes what the contract says. Detailed risk assessment belongs primarily to Service 4.

---

# 9. LEGAL NOTICE SUMMARY FORMAT

For a legal notice:

```text
LEGAL NOTICE SUMMARY

1. TL;DR

Short explanation of the notice.


2. PARTIES

Sender:
Recipient:


3. REASON

Why the notice was issued.


4. DEMAND / REQUIREMENT

What the sender is asking the recipient to do.


5. DEADLINE

Important deadline mentioned in the notice.


6. LEGAL BASIS

Acts:
Sections:
Legal references:


7. REQUIRED ACTION

What action the recipient is being asked to take.


8. IMPORTANT POINTS


9. SOURCES

Page / Section / Paragraph
```

---

# 10. HOW THE ANSWER IS OBTAINED

The answer is generated through the existing project architecture.

High-level flow:

```text
USER
  ↓
REACT FRONTEND
  ↓
FASTAPI BACKEND
  ↓
SERVICE 2
LEGAL DOCUMENT SUMMARIZATION
  ↓
SHARED DOCUMENT CONTEXT
  ↓
RELEVANT DOCUMENT CONTENT
  ↓
AI GATEWAY
  ↓
MOCK / REAL AI PROVIDER
  ↓
STRUCTURED SUMMARY
  ↓
SOURCE VALIDATION
  ↓
FRONTEND
  ↓
USER
```

---

# 11. DOCUMENT PROCESSING BEFORE SUMMARIZATION

Service 2 assumes that the uploaded document has already passed through the common document pipeline.

```text
UPLOAD
   ↓
VALIDATION
   ↓
STORAGE
   ↓
DOCUMENT TYPE DETECTION
   ↓
TEXT EXTRACTION
   ↓
OCR IF REQUIRED
   ↓
PAGE / STRUCTURE EXTRACTION
   ↓
CHUNKING
   ↓
DOCUMENT UNDERSTANDING
   ↓
INDEXING
   ↓
READY
```

The service should reuse this processed information.

It should NOT independently perform a completely separate extraction pipeline.

---

# 12. SHARED DOCUMENT CONTEXT

Service 2 receives a shared document context containing information such as:

```text
Document ID
Document Type
Language
Pages
Extracted Text
Sections
Clauses
Entities
Chunks
Metadata
Sources
Citations
Relevant Retrieved Content
```

This shared context is important because other services also use the same document information.

---

# 13. WORKING LOGIC OF SERVICE 2

Basic working logic:

```text
START
  ↓
Receive Document ID
  ↓
Check Document Exists
  ↓
Check Document Status
  ↓
Load Shared Document Context
  ↓
Identify Document Type
  ↓
Select Appropriate Summary Structure
  ↓
Retrieve Important Document Content
  ↓
Prepare Summarization Context
  ↓
Send Context to AI Gateway
  ↓
AI Generates Structured Summary
  ↓
Validate Summary Against Source
  ↓
Attach Source Information
  ↓
Return Structured Result
  ↓
Frontend Renders Summary
  ↓
END
```

---

# 14. STEP-BY-STEP WORKING

## Step 1 — User selects Summarize

The user clicks:

```text
[ Summarize ]
```

The frontend identifies the current document.

## Step 2 — Backend receives request

The frontend sends a request such as:

```text
POST /documents/{id}/summarize
```

## Step 3 — Validate document

The backend checks:

- Document exists
- User has access
- Document processing is complete
- Document has usable content
- Document status is READY

## Step 4 — Load document context

The summarization service loads the shared document context.

Example:

```text
Document Type: Employment Agreement
Language: English
Pages: 18
Sections: 16
Clauses: 24
```

## Step 5 — Determine document category

```text
IF document = JUDGMENT
    USE JUDGMENT SUMMARY STRUCTURE

ELSE IF document = CONTRACT
    USE CONTRACT SUMMARY STRUCTURE

ELSE IF document = NOTICE
    USE NOTICE SUMMARY STRUCTURE

ELSE
    USE GENERAL LEGAL DOCUMENT SUMMARY
```

---

# 15. IMPORTANT INFORMATION IDENTIFICATION

The summarizer identifies information that is important for the particular document type.

## For judgments

```text
Facts
Issues
Arguments
Laws
Reasoning
Decision
Outcome
```

## For contracts

```text
Parties
Purpose
Terms
Financial information
Responsibilities
Termination
Penalties
Conditions
```

## For notices

```text
Sender
Recipient
Reason
Demand
Deadline
Legal basis
Required action
```

The service should not treat every legal document as if it has the same structure.

---

# 16. SUMMARIZATION LOGIC

The fundamental summarization logic is:

```text
UNDERSTAND
     ↓
IDENTIFY IMPORTANT INFORMATION
     ↓
REMOVE REPETITION / UNNECESSARY DETAIL
     ↓
PRESERVE LEGAL MEANING
     ↓
STRUCTURE INFORMATION
     ↓
GENERATE SUMMARY
```

The system should not simply cut sentences from the original document.

It should understand the document before producing the summary.

---

# 17. LEGAL MEANING PRESERVATION

The summary must preserve:

- Important facts
- Legal relationships
- Conditions
- Obligations
- Rights
- Dates
- Deadlines
- Amounts
- Legal sections
- Court decisions
- Directions
- Contract conditions

Example:

Original:

```text
The employee must provide 30 days' written notice
before terminating the agreement.
```

Correct summary:

```text
The employee must provide 30 days' written notice
before terminating the agreement.
```

Incorrect summary:

```text
The employee can leave immediately.
```

The service must never change the legal meaning.

---

# 18. WHAT THE SERVICE MUST NOT DO

The service must NOT:

- Invent information
- Invent facts
- Invent parties
- Invent dates
- Invent legal sections
- Invent court decisions
- Invent contract clauses
- Change financial amounts
- Change deadlines
- Change obligations
- Change the outcome of a case
- Make unsupported legal conclusions
- Pretend to be a lawyer
- Guarantee a legal outcome

If information cannot be established from the document:

```text
The uploaded document does not clearly specify the requested information.
```

---

# 19. AI PROMPT LOGIC

The AI prompt should instruct the model to:

```text
1. Use the supplied document/context.
2. Understand the document.
3. Identify legally important information.
4. Generate a concise summary.
5. Preserve the original legal meaning.
6. Do not invent information.
7. Do not assume missing information.
8. Use the appropriate structure for the document type.
9. Use simple and understandable language.
10. Preserve important legal terminology where required.
11. Provide source/page information where available.
12. Clearly communicate uncertainty.
13. Separate document facts from general legal knowledge.
```

The model should operate as a summarization engine grounded in the uploaded document.

---

# 20. STRUCTURED OUTPUT

General structure:

```json
{
  "title": "Legal Document Summary",
  "document_type": "contract",
  "tldr": "...",
  "overview": {
    "parties": [],
    "purpose": "...",
    "date": "...",
    "duration": "..."
  },
  "key_points": [],
  "important_terms": [],
  "responsibilities": [],
  "financial_terms": [],
  "termination": [],
  "penalties": [],
  "important_conditions": [],
  "outcome": null,
  "sources": []
}
```

The exact fields should depend on the document type.

---

# 21. JUDGMENT STRUCTURED OUTPUT

```json
{
  "title": "Judgment Summary",
  "document_type": "judgment",
  "tldr": "...",
  "case_overview": {
    "court": "...",
    "case_number": "...",
    "case_title": "...",
    "date": "...",
    "parties": [],
    "judges": []
  },
  "facts": [],
  "legal_issues": [],
  "arguments": {
    "petitioner": [],
    "respondent": []
  },
  "laws_sections": [],
  "court_reasoning": [],
  "final_decision": "...",
  "outcome": "...",
  "important_points": [],
  "sources": []
}
```

---

# 22. CONTRACT STRUCTURED OUTPUT

```json
{
  "title": "Contract Summary",
  "document_type": "contract",
  "tldr": "...",
  "contract_overview": {
    "parties": [],
    "purpose": "...",
    "effective_date": "...",
    "duration": "..."
  },
  "important_terms": [],
  "financial_terms": [],
  "responsibilities": [],
  "termination": [],
  "penalties": [],
  "important_conditions": [],
  "sources": []
}
```

---

# 23. SOURCE / EVIDENCE LOGIC

The summary should provide source information whenever possible.

Example:

```text
Summary:
The tenant must provide 30 days' written notice before termination.

Source:
Lease Agreement
Page 7
Clause 12.2
```

Source information can contain:

```text
Document ID
Page Number
Section
Clause
Source Chunk
Relevant Source Text
Citation
```

This allows the user to verify the generated summary against the original document.

---

# 24. USER INTERACTION AFTER SUMMARY

The user should be able to continue interacting with the same document.

Example:

```text
AI SUMMARY
     ↓
User:
"Explain the termination condition."
     ↓
Document Q&A
     ↓
AI:
"According to Clause 12, ..."
     ↓
Source:
Page 7
Clause 12
```

The summary becomes part of the larger Legal AI Workspace rather than an isolated result.

---

# 25. LANGUAGE SUPPORT

The project supports Indian/regional languages such as:

- English
- Tamil
- Hindi
- Telugu
- Malayalam
- Kannada
- Bengali
- Marathi
- Other Indian languages as implementation permits

Multilingual legal simplification is primarily the responsibility of Service 5.

Service 2 should not duplicate Service 5's complete translation/simplification pipeline.

Services can work together:

```text
SERVICE 2
Legal Summary
       ↓
SERVICE 5
Multilingual Legal Simplification
       ↓
Simple Regional-Language Explanation
```

---

# 26. BUSINESS LOGIC OF SERVICE 2

The core business logic is:

```text
IF document is READY
    ↓
Identify document type
    ↓
Select document-specific summary format
    ↓
Read shared document context
    ↓
Identify important legal information
    ↓
Generate concise summary
    ↓
Preserve legal meaning
    ↓
Validate against document
    ↓
Attach evidence
    ↓
Return structured summary
```

The business logic should remain inside the Service/Business layer.

It should NOT be placed directly inside the API router.

---

# 27. API RESPONSIBILITY

A possible endpoint is:

```text
POST /documents/{id}/summarize
```

The API layer should:

1. Authenticate the request.
2. Validate the document ID.
3. Check user access.
4. Call the summarization service.
5. Return the service result.

The API router should NOT contain document-specific summarization logic.

---

# 28. BACKEND ARCHITECTURE

```text
React Frontend
       ↓
FastAPI API
       ↓
Authentication / Security
       ↓
Legal Document Summarization Service
       ↓
Shared Document Context
       ↓
Relevant Context / Retrieval
       ↓
AI Gateway
       ↓
Mock Provider / Real Provider
       ↓
Structured Summary
       ↓
Source Validation
       ↓
FastAPI Response
       ↓
React UI
```

---

# 29. AI GATEWAY

Service 2 must not be permanently tied to a single AI provider.

```text
Service 2
    ↓
AI Gateway
    ↓
Provider
```

Possible providers include:

- Gemini
- OpenAI
- Claude
- Mistral
- Groq
- Local/open-source models

The frontend should not know which provider is being used.

---

# 30. DETERMINISTIC DEMO MODE

For the SIH MVP, Service 2 can operate using deterministic mock responses.

```text
Frontend
   ↓
FastAPI
   ↓
Summarization Service
   ↓
AI Gateway
   ↓
Mock Provider
   ↓
JSON Fixture
```

The mock provider should behave like a real AI provider from the application's perspective.

---

# 31. MOCK FIXTURE STRUCTURE

```text
fixtures/
└── intelligence/
    ├── document-001/
    │   ├── understanding.json
    │   ├── summary.json
    │   ├── extraction.json
    │   ├── risks.json
    │   ├── simplification.json
    │   ├── translation.json
    │   ├── judgment.json
    │   └── chat.json
```

For Service 2:

```text
summary.json
```

contains the document-specific summary.

The fixture must match the actual demo document.

Do NOT create generic random responses.

---

# 32. REAL AI MODE

Production-style processing can use:

```text
Service 2
    ↓
Document Context
    ↓
Relevant Content Retrieval
    ↓
AI Gateway
    ↓
Gemini / OpenAI / Claude / Local Model
    ↓
Structured Summary
    ↓
Source Validation
    ↓
Frontend
```

The frontend architecture remains the same.

Only the provider behind the AI Gateway changes.

---

# 33. ERROR HANDLING

## Document Not Found

```text
Document could not be found.
```

## Unauthorized Access

```text
You do not have permission to access this document.
```

## Document Still Processing

```text
This document is still being processed.
Please try summarizing when processing is complete.
```

## Empty Document

```text
No usable text could be found in the uploaded document.
```

## Unsupported Document

```text
This document type could not be reliably processed.
```

## AI Failure

```text
The summary could not be generated at this time.
Please try again.
```

## Insufficient Information

```text
The uploaded document does not contain enough information
to generate this part of the summary.
```

---

# 34. LOADING STATE

While the summary is being generated:

```text
Generating legal summary...

✓ Reading document
✓ Identifying document type
● Preparing summary
○ Validating sources
```

After completion:

```text
Summary Ready
```

---

# 35. EMPTY STATE

If no summary is available:

```text
No summary available yet.

Upload and process a legal document,
then select "Summarize".
```

---

# 36. FRONTEND DISPLAY REQUIREMENTS

The frontend should provide:

- Summary title
- TL;DR card
- Document overview
- Important points
- Document-specific sections
- Source references
- Page navigation where possible
- Language selector
- Follow-up question input
- Loading state
- Error state
- Empty state

The summary should be visually readable and should not appear as raw JSON.

---

# 37. PAGE / SOURCE NAVIGATION

When a user clicks a source:

```text
Page 7 — Clause 12.2
```

the application should ideally navigate to the corresponding document page or highlight the relevant source.

This improves traceability and helps users verify the AI output.

---

# 38. LEGAL SAFETY

Service 2 is an explanation and summarization system.

It does not replace a lawyer.

The service should:

- Summarize
- Explain
- Highlight
- Organize
- Simplify where appropriate
- Provide source evidence

It should NOT:

- Guarantee legal outcomes
- Declare that a clause is definitely illegal
- Pretend to provide professional legal representation
- Make unsupported legal conclusions
- Invent legal information

For uncertain information:

```text
This information could not be verified from the uploaded document.
```

For important legal decisions:

```text
Consider professional legal review where appropriate.
```

---

# 39. SECURITY CONSIDERATIONS

Legal documents can contain sensitive information.

Important considerations include:

- Authentication
- Authorization
- Document access control
- Secure document storage
- Secure API access
- No exposure of provider credentials
- Audit logging
- Controlled document retrieval

Frontend must never directly access:

- Database
- AI provider
- Vector database
- File system

---

# 40. PERFORMANCE CONSIDERATIONS

The service should avoid unnecessarily processing the entire document repeatedly.

It should reuse:

```text
Extracted Text
Pages
Sections
Clauses
Chunks
Document Metadata
Document Context
```

For large documents, relevant content should be processed efficiently.

The architecture should allow future use of:

- Embeddings
- Vector database
- Semantic retrieval
- Reranking
- Context assembly

---

# 41. REAL RAG VS MOCK RETRIEVAL

For the MVP:

```text
Mock Fixture Retrieval
```

may simulate document-grounded processing.

It should NOT be described as real RAG.

Real RAG can later use:

```text
User Request
     ↓
Query Processing
     ↓
Document Retrieval
     ↓
Relevant Chunks
     ↓
AI
     ↓
Summary
     ↓
Citations
```

---

# 42. DIFFERENCE BETWEEN SERVICE 2 AND OTHER SERVICES

## Service 1 — Document Understanding

Answers:

> "What is this document and what is its structure?"

## Service 2 — Summarization

Answers:

> "What are the most important contents of this document?"

## Service 3 — Key Information Extraction

Answers:

> "What specific information, clauses, dates, obligations, and entities are present?"

## Service 4 — Risk Detection

Answers:

> "Which parts may create important contractual or legal risks?"

## Service 5 — Multilingual Simplification

Answers:

> "How can this legal meaning be explained simply in a regional language?"

## Service 6 — Document Q&A

Answers:

> "What does the document say about my specific question?"

## Service 7 — Judgment Understanding

Answers:

> "What happened in the case, what were the issues, and why did the court decide this way?"

Service 2 should remain focused on summarizing the document.

---

# 43. EXAMPLE USER EXPERIENCE

## User Action

```text
User uploads:

Supreme_Court_Judgment.pdf
```

After processing:

```text
[ Summarize ]
```

The user clicks it.

## System

```text
Document Type:
Court Judgment

Generating summary...
```

## Result

```text
LEGAL JUDGMENT SUMMARY

📌 TL;DR

The case concerns...
The court considered...
The final decision was...


📋 CASE OVERVIEW

Court: ...
Case Number: ...
Parties: ...
Date: ...


📖 FACTS

• ...
• ...
• ...


⚖️ LEGAL ISSUES

• ...
• ...


👥 ARGUMENTS

Petitioner:
• ...

Respondent:
• ...


📜 LAWS / SECTIONS

• ...
• ...


🧠 COURT REASONING

• ...
• ...


⚖️ FINAL DECISION

...


✅ OUTCOME

...


⭐ IMPORTANT POINTS

• ...
• ...


📍 SOURCES

Page 8
Page 14
Page 22
```

The user can then ask:

```text
"What did the court finally decide?"
```

and continue using the same document.

---

# 44. COMPLETE SERVICE 2 DATA FLOW

```text
                         USER
                           │
                           ▼
                LEGAL AI WORKSPACE
                           │
                           ▼
                     SUMMARIZE
                           │
                           ▼
                    FASTAPI API
                           │
                           ▼
              AUTHENTICATION / ACCESS
                           │
                           ▼
                SUMMARIZATION SERVICE
                           │
                           ▼
              SHARED DOCUMENT CONTEXT
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       DOCUMENT TYPE                DOCUMENT CONTENT
             │                           │
             └─────────────┬─────────────┘
                           ▼
                 SUMMARY STRATEGY
                           │
                           ▼
                 RELEVANT CONTENT
                           │
                           ▼
                      AI GATEWAY
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
            MOCK PROVIDER        REAL PROVIDER
                 │                   │
                 └─────────┬─────────┘
                           ▼
                  STRUCTURED SUMMARY
                           │
                           ▼
                   SOURCE VALIDATION
                           │
                           ▼
                     API RESPONSE
                           │
                           ▼
                  FRONTEND RENDERING
                           │
                           ▼
                        USER
```

---

# 45. SERVICE 2 CORE LOGIC IN SIMPLE FORM

```text
INPUT
Legal Document
      ↓
UNDERSTAND
Identify document type and structure
      ↓
SELECT
Choose suitable summary format
      ↓
EXTRACT
Find important information
      ↓
SUMMARIZE
Compress the important content
      ↓
PRESERVE
Keep the original legal meaning
      ↓
VERIFY
Check source/page evidence
      ↓
STRUCTURE
Create organized summary
      ↓
DISPLAY
Show summary to user
```

---

# 46. INPUT CONTRACT

Service 2 should receive information equivalent to:

```text
document_id
```

Conceptually:

```json
{
  "document_id": "document-001"
}
```

The backend obtains the remaining document information through the shared document context.

---

# 47. OUTPUT CONTRACT

The output should contain, as applicable:

```json
{
  "title": "...",
  "document_type": "...",
  "tldr": "...",
  "overview": {},
  "key_points": [],
  "document_specific_sections": {},
  "sources": []
}
```

The frontend should consume this structured response.

---

# 48. VALIDATION RULES

Before returning the result, the service should verify:

```text
✓ Summary belongs to the requested document
✓ Document type is correct
✓ Important fields are source-supported
✓ No unsupported facts are introduced
✓ Sources refer to the document
✓ Required summary sections exist
✓ Output follows the expected schema
```

---

# 49. TESTING REQUIREMENTS

Service 2 should be tested using realistic legal documents.

## Contract

- Employment Agreement
- Lease Agreement
- NDA
- Service Agreement

## Court

- Court Judgment
- Court Order
- Bail Order

## Notice

- Legal Notice
- Termination Notice
- Demand Notice

## Document Quality

- Text PDF
- Scanned PDF
- Poor-quality OCR document
- Long document
- Short document

---

# 50. EXAMPLE TEST CASE

### Input

```text
Document:
Employment Agreement

Action:
Summarize
```

### Expected

```text
✓ Contract identified
✓ Parties identified
✓ Purpose identified
✓ Important terms summarized
✓ Financial terms summarized
✓ Responsibilities summarized
✓ Termination summarized
✓ Important conditions summarized
✓ Sources attached
```

### Must NOT happen

```text
✗ Invent salary
✗ Invent notice period
✗ Invent parties
✗ Invent contract duration
✗ Invent clauses
```

---

# 51. ACCEPTANCE CRITERIA

Service 2 is considered complete when:

- [ ] User can select "Summarize".
- [ ] Backend accepts the document ID.
- [ ] User authorization is checked.
- [ ] Document status is checked.
- [ ] Shared document context is loaded.
- [ ] Document type is identified.
- [ ] Appropriate summary structure is selected.
- [ ] Important information is identified.
- [ ] Summary is generated.
- [ ] Legal meaning is preserved.
- [ ] Unsupported information is not invented.
- [ ] Structured output is returned.
- [ ] Source/page evidence is included where possible.
- [ ] Frontend renders the summary correctly.
- [ ] Loading state is available.
- [ ] Error state is available.
- [ ] Empty state is available.
- [ ] Mock/demo mode works.
- [ ] Real AI architecture remains possible.
- [ ] Test cases exist.
- [ ] Legal safety rules are respected.

---

# 52. SIH DEMO FLOW FOR SERVICE 2

Recommended demonstration:

```text
STEP 1
Upload an Indian court judgment.

        ↓

STEP 2
Document processing completes.

        ↓

STEP 3
Click:

[ SUMMARIZE ]

        ↓

STEP 4
Show:

TL;DR
Case Overview
Facts
Issues
Arguments
Laws
Reasoning
Decision
Outcome

        ↓

STEP 5
Click a source.

        ↓

STEP 6
Show the relevant page/source.

        ↓

STEP 7
Ask:

"What did the court finally decide?"

        ↓

STEP 8
Continue with Document Q&A.
```

---

# 53. SERVICE 2 BUSINESS VALUE

The service solves the problem:

```text
LONG LEGAL DOCUMENT
        ↓
DIFFICULT TO READ
        ↓
DIFFICULT TO UNDERSTAND
        ↓
USER MAY MISS IMPORTANT INFORMATION
```

Service 2 changes this into:

```text
LONG LEGAL DOCUMENT
        ↓
AI UNDERSTANDING
        ↓
IMPORTANT INFORMATION
        ↓
STRUCTURED SUMMARY
        ↓
EASY UNDERSTANDING
        ↓
SOURCE VERIFICATION
```

The user can understand the document faster while still being able to verify the information against the original source.

---

# 54. CORE PRINCIPLE

The central principle of Service 2 is:

```text
DO NOT SIMPLY SHORTEN THE DOCUMENT.

UNDERSTAND THE LEGAL DOCUMENT
        ↓
IDENTIFY WHAT MATTERS
        ↓
PRESERVE LEGAL MEANING
        ↓
SUMMARIZE
        ↓
SHOW EVIDENCE
```

---

# 55. FINAL SERVICE 2 DEFINITION

**Legal Document Summarization** is a document-grounded AI service that converts complex and lengthy legal documents into concise, structured, and legally meaningful summaries.

It is document-type aware and can summarize court judgments, court orders, contracts, legal notices, and other supported legal documents.

The service uses the shared document context, identifies important legal information, generates a structured summary through the provider-independent AI Gateway, validates the output against the source where possible, and presents the result through the ChatGPT-like Legal AI Workspace.

The service must preserve the original legal meaning, avoid hallucination, provide source evidence where possible, and clearly communicate uncertainty.

The final experience is:

```text
UPLOAD
   ↓
PROCESS
   ↓
SELECT "SUMMARIZE"
   ↓
UNDERSTAND DOCUMENT
   ↓
IDENTIFY IMPORTANT CONTENT
   ↓
GENERATE STRUCTURED SUMMARY
   ↓
PRESERVE LEGAL MEANING
   ↓
ATTACH SOURCE EVIDENCE
   ↓
DISPLAY IN LEGAL AI WORKSPACE
   ↓
ASK FOLLOW-UP QUESTIONS
```

## One-line definition

> **Service 2 converts a complex legal document into a concise, structured, document-grounded summary while preserving its original legal meaning and providing source evidence wherever possible.**
