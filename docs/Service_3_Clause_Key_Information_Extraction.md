# SERVICE 3 --- CLAUSE & KEY INFORMATION EXTRACTION

## 1. Service Overview

**Service Name:** Clause & Key Information Extraction\
**Service Number:** 3\
**Project:** AI-Driven Multilingual Legal Document Simplifier\
**Project ID:** JEC-SIH2026-027

### Purpose

Service 3 extracts the information that a user actually needs from an
uploaded legal document.

It does not simply copy text from the document. It identifies important
legal information, organizes it into meaningful categories, and points
the user back to the relevant page, section, or clause wherever
possible.

This service is one of the eight primary user-facing services of the
project.

The service must work inside the unified Legal AI Workspace. It is a
backend capability exposed through the workspace rather than a
completely separate application or independent product.

------------------------------------------------------------------------

# 2. Position of Service 3 in the Project

The overall product flow is:

``` text
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

Service 3 is responsible for:

``` text
DOCUMENT
   ↓
DOCUMENT CONTEXT
   ↓
IDENTIFY DOCUMENT TYPE
   ↓
SELECT RELEVANT INFORMATION CATEGORIES
   ↓
EXTRACT KEY INFORMATION
   ↓
MAP INFORMATION TO SOURCE
   ↓
VALIDATE
   ↓
STRUCTURED RESULT
```

------------------------------------------------------------------------

# 3. What the User Sees

After the user uploads a document and the document becomes ready, the
workspace displays the available services.

Example:

``` text
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

``` text
EXTRACT KEY INFORMATION
```

The service then processes the already-created document context.

The user should remain in the same Legal AI Workspace.

------------------------------------------------------------------------

# 4. General User Interface

A recommended Service 3 result layout is:

``` text
┌──────────────────────────────────────────────────────────┐
│ KEY INFORMATION                                          │
│ Employment Agreement                                     │
│                                                          │
│ Important information extracted from your document       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ PARTIES                                                  │
│                                                          │
│ Employer                                                 │
│ ABC Technologies Pvt. Ltd.                              │
│ Source: Page 1                                          │
│                                                          │
│ Employee                                                 │
│ Rahul Kumar                                             │
│ Source: Page 1                                          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ IMPORTANT DATES                                          │
│                                                          │
│ Effective Date: 01 January 2026                         │
│ Duration: 2 Years                                       │
│ Source: Page 1 / Page 3                                 │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ PAYMENT                                                  │
│                                                          │
│ Monthly Salary: ₹50,000                                 │
│ Payment Date: Last working day                          │
│ Source: Page 2 / Clause 3.1                             │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ OBLIGATIONS                                              │
│                                                          │
│ • Employee must maintain confidentiality.               │
│ • Employee must follow company policies.                │
│ • Employer must pay the agreed salary.                  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ IMPORTANT CLAUSES                                        │
│                                                          │
│ Clause 4 — Confidentiality                              │
│ Clause 7 — Termination                                  │
│ Clause 9 — Dispute Resolution                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

The exact categories must change according to the detected document
type.

------------------------------------------------------------------------

# 5. Document-Type-Specific Extraction

Service 3 must not apply one fixed extraction schema to every document.

The system first identifies the document type and then chooses the
appropriate information categories.

## 5.1 Contract

For contracts, extract where present:

-   Parties
-   Effective date
-   Duration
-   Payment
-   Responsibilities
-   Rights
-   Obligations
-   Termination
-   Renewal
-   Penalties
-   Liability
-   Confidentiality
-   Dispute resolution
-   Jurisdiction
-   Important clauses

### Example

``` text
CONTRACT INFORMATION

Parties
- Employer: ABC Technologies Pvt. Ltd.
- Employee: Rahul Kumar

Effective Date
- 01 January 2026

Duration
- 2 years

Payment
- ₹50,000 per month

Obligations
- Maintain confidentiality
- Follow company policies

Termination
- 30 days written notice

Dispute Resolution
- As specified in Clause 9

Sources
- Page 1
- Page 2
- Page 6
- Page 7
```

------------------------------------------------------------------------

# 6.1 Court Judgment

For judgments, extract where present:

-   Parties
-   Court
-   Case number
-   Date
-   Judges
-   Facts
-   Issues
-   Arguments
-   Acts
-   Sections
-   Precedents
-   Decision
-   Directions

### Example

``` text
JUDGMENT INFORMATION

Parties
- Petitioner: XYZ
- Respondent: ABC

Court
- High Court

Case Number
- XXXX/2026

Date
- 10 March 2026

Judges
- Justice A
- Justice B

Legal Issues
- Issue identified from the judgment

Sections / Acts
- Relevant provisions mentioned in the judgment

Decision
- Court's decision as stated in the document

Directions
- Directions issued by the court

Sources
- Page 1
- Page 5
- Page 18
- Page 24
```

------------------------------------------------------------------------

# 7. Legal Notice

For legal notices, extract where present:

-   Sender
-   Recipient
-   Reason
-   Demand
-   Deadline
-   Legal basis
-   Required action

### Example

``` text
LEGAL NOTICE INFORMATION

Sender
- ABC

Recipient
- XYZ

Reason
- Non-payment of contractual amount

Demand
- Payment of outstanding amount

Deadline
- 15 days

Legal Basis
- Relevant provision mentioned in the notice

Required Action
- Make the required payment within the stated period

Sources
- Page 1
- Page 2
```

------------------------------------------------------------------------

# 8. How the Service Answer Is Obtained

Service 3 should reuse the shared document-processing pipeline.

It should not create a completely separate document extraction system.

The common pipeline is:

``` text
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

Once the document is ready:

``` text
USER SELECTS SERVICE 3
        ↓
LOAD DOCUMENT CONTEXT
        ↓
IDENTIFY DOCUMENT TYPE
        ↓
SELECT EXTRACTION SCHEMA
        ↓
EXTRACT INFORMATION
        ↓
MAP TO PAGE / SECTION / CLAUSE
        ↓
VALIDATE AGAINST DOCUMENT
        ↓
GENERATE STRUCTURED OUTPUT
        ↓
SEND TO FRONTEND
        ↓
DISPLAY INFORMATION CARDS
```

------------------------------------------------------------------------

# 9. Shared Document Context

Service 3 should consume the shared document context.

The document context can contain:

``` text
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

The service should reuse information already extracted during document
processing.

It should not repeat OCR, text extraction, or document parsing
unnecessarily.

------------------------------------------------------------------------

# 10. Working Logic of Service 3

## Step 1 --- Receive Request

The frontend sends a request such as:

``` http
POST /documents/{document_id}/analyze
```

or the project's equivalent Service 3 endpoint.

The exact endpoint must remain consistent with the existing project API
architecture.

------------------------------------------------------------------------

## Step 2 --- Validate Document

Check:

-   Document exists
-   User has permission
-   Document processing is complete
-   Document context is available
-   Document is supported
-   Required extracted text is available

If the document is not ready:

``` text
Document is still being processed.
Please wait until processing is complete.
```

------------------------------------------------------------------------

## Step 3 --- Determine Document Type

Use the document understanding result.

Possible types include:

``` text
Contract
Agreement
Employment Agreement
Lease Agreement
NDA
Service Agreement
Sale Agreement
Legal Notice
Court Judgment
Court Order
Bail Order
Other Legal Document
```

------------------------------------------------------------------------

## Step 4 --- Select Extraction Schema

The document type determines what should be extracted.

Example:

``` text
IF document_type = CONTRACT
    → Contract extraction schema

IF document_type = JUDGMENT
    → Judgment extraction schema

IF document_type = LEGAL_NOTICE
    → Notice extraction schema
```

This is not intended to be arbitrary document-specific router logic.

The service should use a clear document-type-to-schema mapping.

------------------------------------------------------------------------

# 11. Information Extraction Logic

The AI receives relevant document context and an extraction instruction.

The instruction should tell the model:

``` text
You are extracting information from a legal document.

Use only the supplied document context.

Extract only information supported by the document.

Do not invent missing information.

Preserve the original legal meaning.

Identify the relevant page, section, or clause where possible.

If information is not present, return null or mark it as not found.

Return the result in the required structured format.
```

The model then identifies information such as:

``` text
PARTIES
DATES
MONEY
RIGHTS
OBLIGATIONS
DEADLINES
CLAUSES
TERMINATION
PENALTIES
LIABILITY
JURISDICTION
```

depending on document type.

------------------------------------------------------------------------

# 12. Source Mapping Logic

Every extracted item should be connected to evidence whenever possible.

Example:

``` text
Extracted Information:
Monthly Salary = ₹50,000

Source:
Page = 2
Section = Compensation
Clause = 3.1
Source Text = relevant document text
```

The source mapping flow is:

``` text
EXTRACTED ITEM
      ↓
IDENTIFY SUPPORTING TEXT
      ↓
IDENTIFY PAGE
      ↓
IDENTIFY SECTION
      ↓
IDENTIFY CLAUSE IF AVAILABLE
      ↓
CREATE SOURCE OBJECT
      ↓
ATTACH SOURCE TO ITEM
```

This makes the output verifiable.

------------------------------------------------------------------------

# 13. Source Evidence UI

The user can see:

``` text
Monthly Salary
₹50,000

📄 Page 2
§ Clause 3.1

[ View Source ]
```

When the user selects `View Source`, the document viewer should navigate
to the relevant page and, where technically possible, highlight the
supporting text.

------------------------------------------------------------------------

# 14. Structured Output

Service 3 should return structured data instead of a large text
response.

A conceptual output structure is:

``` json
{
  "document_id": "document-001",
  "document_type": "employment_agreement",
  "categories": {
    "parties": [],
    "dates": [],
    "payments": [],
    "responsibilities": [],
    "rights": [],
    "obligations": [],
    "deadlines": [],
    "termination": [],
    "renewal": [],
    "penalties": [],
    "liability": [],
    "confidentiality": [],
    "dispute_resolution": [],
    "jurisdiction": [],
    "important_clauses": []
  },
  "sources": []
}
```

The exact schema can be adjusted to the project's API standards.

The important principle is that the frontend receives predictable
structured information.

------------------------------------------------------------------------

# 15. Example Extraction Object

A single extracted item can conceptually look like:

``` json
{
  "category": "payment",
  "label": "Monthly Salary",
  "value": "₹50,000",
  "description": "The employee is entitled to a monthly salary of ₹50,000.",
  "source": {
    "page": 2,
    "section": "Compensation",
    "clause": "3.1",
    "text": "..."
  }
}
```

For a deadline:

``` json
{
  "category": "deadline",
  "label": "Termination Notice",
  "value": "30 days",
  "description": "Thirty days' written notice is required.",
  "source": {
    "page": 6,
    "clause": "7.2",
    "text": "..."
  }
}
```

------------------------------------------------------------------------

# 16. Missing Information Logic

The service must never invent missing information.

If the document does not contain a requested field:

``` text
Not found in the uploaded document.
```

or, in structured form:

``` json
{
  "label": "Renewal Period",
  "value": null,
  "status": "not_found"
}
```

Do not infer information merely because it is common in similar
contracts.

------------------------------------------------------------------------

# 17. Important Distinction: Extraction vs Simplification

Service 3 primarily extracts and organizes information.

It should not silently turn into Service 5.

### Service 3

``` text
Find
↓
Extract
↓
Organize
↓
Attach evidence
```

### Service 5

``` text
Understand legal meaning
↓
Preserve legal meaning
↓
Simplify
↓
Translate
↓
Explain in regional language
```

Service 3 may provide short descriptions for usability, but it must
preserve the document's actual meaning.

------------------------------------------------------------------------

# 18. Important Distinction: Extraction vs Risk Detection

Service 3 should identify important clauses and information.

Service 4 determines potentially risky or unfavorable portions.

Example:

### Service 3

``` text
Termination Clause
Clause 7
Either party may terminate the agreement with
30 days written notice.
```

### Service 4

``` text
Potential Risk
Severity: Medium

The termination provision may create a risk
depending on which party is exercising it.

Source: Clause 7
```

Service 3 should not automatically label a clause as legally risky.

------------------------------------------------------------------------

# 19. Important Distinction: Extraction vs Summarization

Service 2 produces a document-level summary.

Service 3 produces a structured information inventory.

### Summarization

``` text
This agreement establishes the terms of employment
between the employer and employee...
```

### Extraction

``` text
Employer: ABC Technologies
Employee: Rahul Kumar
Salary: ₹50,000/month
Duration: 2 years
Termination notice: 30 days
```

Both services use the shared document context.

------------------------------------------------------------------------

# 20. AI Gateway Logic

Service 3 must not directly depend on a particular AI provider.

Architecture:

``` text
FRONTEND
   ↓
FASTAPI BACKEND
   ↓
SERVICE 3
   ↓
DOCUMENT CONTEXT
   ↓
AI GATEWAY
   ↓
AI PROVIDER
```

Possible providers include:

``` text
Gemini
OpenAI
Claude
Mistral
Groq
Local / Open-source models
```

The frontend must not know which provider is being used.

------------------------------------------------------------------------

# 21. Deterministic Demo Mode

For the SIH MVP, Service 3 may operate using deterministic fixtures.

Flow:

``` text
FRONTEND
   ↓
FASTAPI
   ↓
SERVICE 3
   ↓
AI GATEWAY
   ↓
MOCK PROVIDER
   ↓
JSON FIXTURE
```

The fixture should contain realistic information matching the selected
demo document.

Example:

``` text
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

The mock response should behave like a real AI provider from the
application's perspective.

Do not put document-specific fixture logic inside API routers.

------------------------------------------------------------------------

# 22. Real AI Mode

In production or advanced development:

``` text
Service 3
   ↓
Document Context
   ↓
Relevant Context / Retrieval
   ↓
AI Gateway
   ↓
Selected AI Provider
   ↓
Structured Extraction
   ↓
Source Validation
   ↓
Frontend
```

The same Service 3 interface should work with both mock and real AI
modes.

------------------------------------------------------------------------

# 23. RAG / Retrieval Logic

For long documents, the service may retrieve relevant chunks.

Conceptual flow:

``` text
DOCUMENT
   ↓
CHUNKS
   ↓
INDEX
   ↓
EXTRACTION REQUEST
   ↓
RELEVANT CHUNKS
   ↓
AI MODEL
   ↓
EXTRACTED INFORMATION
   ↓
SOURCE REFERENCES
```

For the MVP, deterministic fixture retrieval may simulate this behavior.

It should not be described as real RAG.

Real RAG can later use:

-   Embeddings
-   Vector database
-   Semantic retrieval
-   Reranking
-   Context assembly
-   Grounded generation

------------------------------------------------------------------------

# 24. Business Logic of Service 3

The business logic is:

``` text
1. Receive document ID.
2. Verify document access.
3. Verify document processing status.
4. Load shared document context.
5. Determine document type.
6. Select the appropriate extraction schema.
7. Identify relevant sections/chunks.
8. Extract required information.
9. Normalize the extracted information.
10. Attach page/section/clause evidence.
11. Validate extracted values against the document.
12. Remove unsupported information.
13. Mark missing information appropriately.
14. Return structured output.
15. Store the analysis result if required.
16. Render the result in the workspace.
```

------------------------------------------------------------------------

# 25. Business Rules

## Rule 1 --- Document Grounding

Document-specific information must come from the uploaded document.

## Rule 2 --- No Hallucination

Never invent:

-   Parties
-   Dates
-   Amounts
-   Clauses
-   Deadlines
-   Case numbers
-   Court names
-   Legal sections
-   Obligations
-   Decisions

## Rule 3 --- Preserve Meaning

Do not change the legal meaning while extracting information.

## Rule 4 --- Evidence

Attach source information whenever possible.

## Rule 5 --- Document-Type Awareness

Use an appropriate schema for the document type.

## Rule 6 --- Missing Information

If information is absent, clearly indicate that it was not found.

## Rule 7 --- Shared Context

Reuse the common document context rather than creating separate
document-processing pipelines.

## Rule 8 --- Legal Safety

Extraction is informational and must not be presented as guaranteed
legal advice.

## Rule 9 --- No Unsupported Legal Conclusions

The service should not determine that a clause is definitely legal,
illegal, enforceable, or unenforceable unless such a conclusion is
explicitly supported by an appropriate verified source and the project
architecture allows it.

## Rule 10 --- Source Traceability

Users should be able to verify important extracted information against
the original document.

------------------------------------------------------------------------

# 26. Frontend Components

Service 3 can use the following UI components:

``` text
Service Header
Document Name
Document Type
Extraction Status
Category Tabs
Information Cards
Clause Cards
Source References
Page Links
View Source Button
Search
Language Selector
Empty State
Loading State
Error State
Follow-up Chat
```

------------------------------------------------------------------------

# 27. Loading State

While processing:

``` text
Extracting key information...

✓ Reading document
✓ Identifying document type
✓ Finding important sections
● Extracting key information
○ Mapping sources
○ Preparing result
```

The frontend should clearly communicate processing status.

------------------------------------------------------------------------

# 28. Empty State

If no relevant information can be extracted:

``` text
No key information could be reliably extracted
from this document.

Try uploading a clearer or supported legal document.
```

Do not fill the empty state with guessed information.

------------------------------------------------------------------------

# 29. Error State

Example:

``` text
Unable to extract key information.

The document may still be processing or the
required document content could not be analyzed.

[ Try Again ]
```

Possible backend error categories:

``` text
DOCUMENT_NOT_FOUND
DOCUMENT_NOT_READY
UNSUPPORTED_DOCUMENT
EXTRACTION_FAILED
AI_PROVIDER_ERROR
SOURCE_MAPPING_FAILED
INVALID_AI_OUTPUT
PERMISSION_DENIED
```

------------------------------------------------------------------------

# 30. Validation

Before returning the result, validate:

### Input Validation

-   Document ID exists
-   User is authorized
-   Document status is READY
-   Document type is available
-   Required context exists

### Output Validation

-   Required schema is valid
-   Extracted values have correct types
-   Sources reference valid document pages where possible
-   No unsupported mandatory values are invented
-   Null/missing values are handled correctly

Pydantic or an equivalent schema validation mechanism can be used on the
backend.

------------------------------------------------------------------------

# 31. Source Validation

For each important extracted item:

``` text
Extracted Item
      ↓
Supporting Source
      ↓
Does source actually support item?
      ↓
YES → Keep
      ↓
NO → Remove / mark uncertain
```

This reduces hallucination risk.

------------------------------------------------------------------------

# 32. Example Complete User Answer

For an employment agreement, the user could see:

``` text
KEY INFORMATION

Document Type
Employment Agreement

PARTIES
Employer
ABC Technologies Pvt. Ltd.
Page 1

Employee
Rahul Kumar
Page 1

EMPLOYMENT
Position
Software Developer
Page 1

Start Date
01 January 2026
Page 1

Duration
2 Years
Page 3

PAYMENT
Monthly Salary
₹50,000
Page 2, Clause 3.1

OBLIGATIONS
Employee
• Maintain confidentiality
• Follow company policies
Page 4

Employer
• Pay agreed salary
• Provide agreed employment benefits
Page 2–3

TERMINATION
Notice Period
30 days written notice
Page 6, Clause 7

CONFIDENTIALITY
Confidentiality obligations apply to specified
company information.
Page 4, Clause 4

DISPUTE RESOLUTION
As specified in Clause 9.
Page 7, Clause 9

RENEWAL
Not found in the uploaded document.

────────────────────────────────────

Sources
[Page 1] [Page 2] [Page 4] [Page 6] [Page 7]

Ask about this document...
```

------------------------------------------------------------------------

# 33. API-Level Concept

A conceptual request:

``` http
POST /documents/{document_id}/extract
```

Request:

``` json
{
  "service": "key_information_extraction"
}
```

Response:

``` json
{
  "document_id": "document-001",
  "service": "key_information_extraction",
  "document_type": "employment_agreement",
  "status": "completed",
  "result": {
    "parties": [],
    "dates": [],
    "payments": [],
    "responsibilities": [],
    "rights": [],
    "obligations": [],
    "termination": [],
    "renewal": [],
    "penalties": [],
    "liability": [],
    "confidentiality": [],
    "dispute_resolution": [],
    "jurisdiction": [],
    "important_clauses": []
  },
  "sources": []
}
```

The exact API should follow the existing project's API standards rather
than introducing conflicting endpoint conventions.

------------------------------------------------------------------------

# 34. Database / Storage Consideration

Service 3 does not require an unnecessary collection of new tables.

If analysis persistence is required, it can use the project's analysis
result concepts.

Possible future entities include:

``` text
analysis_runs
analysis_results
sources
document_pages
document_chunks
```

The MVP should keep the database simple unless persistence is actually
required.

------------------------------------------------------------------------

# 35. Security

The service handles potentially sensitive legal documents.

Therefore:

-   Verify user authorization before accessing a document.
-   Never expose documents belonging to another workspace.
-   Do not send unnecessary document content to external services.
-   Protect AI provider credentials.
-   Do not place provider credentials in the frontend.
-   Log important analysis operations where required.
-   Follow the project's audit and security architecture.
-   Do not expose private source text to unauthorized users.

------------------------------------------------------------------------

# 36. Multilingual Consideration

Service 3 can initially return structured information in the selected
application language.

However, multilingual simplification should remain conceptually
connected to Service 5.

For example:

``` text
Extracted Information
        ↓
Selected Language
        ↓
Readable Label / Explanation
```

The underlying legal fact must remain unchanged.

Example:

``` text
English:
Termination Notice — 30 days

Tamil:
ஒப்பந்த முடிப்பு அறிவிப்பு — 30 நாட்கள்
```

The language layer must not alter the extracted legal value.

------------------------------------------------------------------------

# 37. Interaction With Other Services

Service 3 is connected to the other services but remains distinct.

``` text
SERVICE 1
Document Understanding
        ↓
SERVICE 3
Key Information Extraction
        ↓
SERVICE 2
Summarization
```

Service 3 also supports:

``` text
SERVICE 4 → Risk Detection
SERVICE 5 → Simplification / Translation
SERVICE 6 → Document Q&A
SERVICE 7 → Judgment Understanding
SERVICE 8 → Voice Assistant
```

All services reuse the shared document context.

------------------------------------------------------------------------

# 38. Example Internal Processing

Input:

``` text
User uploads Employment Agreement.pdf
```

Document processing finds:

``` text
Document Type = Employment Agreement

Page 1:
Employer, Employee, Start Date

Page 2:
Salary

Page 4:
Confidentiality

Page 6:
Termination

Page 7:
Dispute Resolution
```

Service 3 converts this into:

``` text
Parties
→ Employer + Employee

Dates
→ Start Date

Payment
→ Salary

Obligations
→ Confidentiality / employment responsibilities

Termination
→ Termination condition

Dispute Resolution
→ Clause 9

Each item
→ Source page / clause
```

The frontend then renders these as cards.

------------------------------------------------------------------------

# 39. Deterministic Fixture Example

A mock fixture could contain:

``` json
{
  "document_id": "employment-demo-001",
  "document_type": "employment_agreement",
  "parties": [
    {
      "role": "employer",
      "name": "ABC Technologies Pvt. Ltd.",
      "source": {
        "page": 1
      }
    },
    {
      "role": "employee",
      "name": "Rahul Kumar",
      "source": {
        "page": 1
      }
    }
  ],
  "dates": [
    {
      "label": "Effective Date",
      "value": "01 January 2026",
      "source": {
        "page": 1
      }
    }
  ],
  "payments": [
    {
      "label": "Monthly Salary",
      "value": "₹50,000",
      "source": {
        "page": 2,
        "clause": "3.1"
      }
    }
  ]
}
```

The fixture must match the actual demo document.

------------------------------------------------------------------------

# 40. Testing

Service 3 should have tests for:

## Contract Tests

-   Extract parties
-   Extract dates
-   Extract payment
-   Extract obligations
-   Extract termination
-   Extract confidentiality
-   Extract dispute resolution
-   Handle missing renewal information
-   Return source references

## Judgment Tests

-   Extract parties
-   Extract court
-   Extract case number
-   Extract judges
-   Extract issues
-   Extract sections
-   Extract precedents
-   Extract decision
-   Extract directions

## Notice Tests

-   Extract sender
-   Extract recipient
-   Extract demand
-   Extract deadline
-   Extract legal basis
-   Extract required action

## Safety Tests

-   Do not invent missing information
-   Do not fabricate sources
-   Do not create unsupported legal conclusions
-   Preserve extracted values
-   Handle uncertain information

------------------------------------------------------------------------

# 41. Acceptance Criteria

Service 3 is considered complete only when:

-   [ ] User can select "Extract Key Information".
-   [ ] Service runs inside the unified Legal AI Workspace.
-   [ ] Document type is considered before extraction.
-   [ ] Appropriate fields are extracted for contracts.
-   [ ] Appropriate fields are extracted for judgments.
-   [ ] Appropriate fields are extracted for legal notices.
-   [ ] Information is displayed in structured cards/categories.
-   [ ] Important extracted information has source references where
    possible.
-   [ ] User can open the original source page.
-   [ ] Missing information is not invented.
-   [ ] Loading state exists.
-   [ ] Empty state exists.
-   [ ] Error state exists.
-   [ ] Backend validates the input.
-   [ ] Backend validates AI output.
-   [ ] Mock/demo mode is supported.
-   [ ] Real AI mode can use the same service architecture.
-   [ ] AI provider is accessed through the AI Gateway.
-   [ ] Service reuses shared document context.
-   [ ] Service does not duplicate OCR/text extraction unnecessarily.
-   [ ] Legal safety requirements are followed.
-   [ ] Tests cover supported document types.
-   [ ] Frontend rendering is implemented.
-   [ ] Source/evidence is preserved.

------------------------------------------------------------------------

# 42. Service 3 --- Complete Logic in One Flow

``` text
USER
 ↓
UPLOAD LEGAL DOCUMENT
 ↓
DOCUMENT VALIDATION
 ↓
DOCUMENT PROCESSING
 ↓
TEXT / OCR / STRUCTURE
 ↓
DOCUMENT UNDERSTANDING
 ↓
DOCUMENT READY
 ↓
USER CLICKS
"EXTRACT KEY INFORMATION"
 ↓
SERVICE 3
 ↓
LOAD SHARED DOCUMENT CONTEXT
 ↓
CHECK DOCUMENT TYPE
 ↓
SELECT DOCUMENT-SPECIFIC SCHEMA
 ↓
RETRIEVE RELEVANT CONTENT
 ↓
AI / MOCK PROVIDER
 ↓
EXTRACT KEY INFORMATION
 ↓
NORMALIZE INFORMATION
 ↓
MAP TO PAGE / SECTION / CLAUSE
 ↓
VALIDATE AGAINST SOURCE
 ↓
REMOVE UNSUPPORTED INFORMATION
 ↓
MARK MISSING INFORMATION
 ↓
STRUCTURED JSON OUTPUT
 ↓
FASTAPI RESPONSE
 ↓
FRONTEND
 ↓
CATEGORY / INFORMATION CARDS
 ↓
SOURCE REFERENCES
 ↓
USER CAN VIEW ORIGINAL SOURCE
 ↓
USER CAN ASK FOLLOW-UP QUESTIONS
```

------------------------------------------------------------------------

# 43. Core Principle of Service 3

The service should answer:

> **"What important information is contained in this legal document, and
> where exactly can I find it?"**

It should not primarily answer:

> "What does this document generally mean?"

That belongs mainly to understanding and summarization.

It should not primarily answer:

> "Is this clause risky?"

That belongs to Risk Detection.

It should not primarily answer:

> "Explain this in Tamil."

That belongs to Multilingual Legal Simplification.

Service 3's core job is:

``` text
FIND
   ↓
EXTRACT
   ↓
STRUCTURE
   ↓
VERIFY
   ↓
SHOW SOURCE
```

------------------------------------------------------------------------

# 44. Final Service 3 Definition

**Service 3 --- Clause & Key Information Extraction** is a
document-grounded legal information extraction service that identifies
the most important information from contracts, judgments, court orders,
and legal notices; organizes that information according to document
type; preserves the original legal meaning; connects extracted
information to page/section/clause evidence; and presents the result as
structured, easy-to-understand information cards inside the unified
Legal AI Workspace.

It is a core P0 MVP capability and must remain integrated with the
project's shared document context, source/evidence system, AI Gateway,
legal safety layer, and deterministic demo architecture.
